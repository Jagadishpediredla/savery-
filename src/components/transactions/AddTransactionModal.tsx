
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, CalendarIcon, SlidersHorizontal, Sparkles, ArrowRight, Sun, Moon, ArrowDown, ArrowUp } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle } from '../ui/card';
import { categories, mockAccounts } from '@/data/mock-data';
import { useFirebase } from '@/context/FirebaseContext';
import { useToast } from '@/hooks/use-toast';
import { Shield, ShoppingBag, PiggyBank, CandlestickChart } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';


const transactionSchema = z.object({
  date: z.date({ required_error: "A date is required." }),
  type: z.enum(['Credit', 'Debit']),
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
  account: z.string().min(1, 'Please select an account type'),
  category: z.string().min(1, 'Please select a category'),
  note: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface AddTransactionModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

const accountTypes = [
    { name: 'Needs', icon: Shield },
    { name: 'Wants', icon: ShoppingBag },
    { name: 'Savings', icon: PiggyBank },
    { name: 'Investments', icon: CandlestickChart },
];

const ProgressDots = ({ current, total }: { current: number; total: number }) => (
    <div className="flex justify-center gap-3 py-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-2 w-2 rounded-full transition-all duration-300",
            i < current ? "bg-primary" : "bg-muted"
          )}
        />
      ))}
    </div>
  );

export function AddTransactionModal({ isOpen, onOpenChange }: AddTransactionModalProps) {
  const [step, setStep] = useState(1);
  const { addTransaction } = useFirebase();
  const { toast } = useToast();
  const { setTheme, theme } = useTheme();

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      date: new Date(),
      type: 'Debit',
      amount: undefined,
      account: '',
      category: '',
      note: ''
    },
  });

  const handleFormSubmit = async (implement: boolean) => {
    const isValid = await form.trigger();
    if (!isValid) {
        toast({
            variant: "destructive",
            title: "Validation Error",
            description: "Please fill all required fields correctly.",
        });
        return;
    }

    const data = form.getValues();
    const transactionData = {
        ...data,
        date: format(data.date, 'yyyy-MM-dd'),
    };

    try {
        await addTransaction(transactionData);

        if (implement) {
            const amount = transactionData.amount;
            const note = encodeURIComponent(transactionData.note || 'FinanceFlow Transaction');
            const upiUrl = `upi://pay?am=${amount}&tn=${note}&cu=INR`;
            window.location.href = upiUrl;
        }

        toast({
            title: "Success!",
            description: `Transaction has been ${implement ? 'saved and implemented' : 'saved'}.`,
        });
        onOpenChange(false);
    } catch (error) {
        console.error("Failed to save transaction", error);
        toast({
            variant: "destructive",
            title: "Oh no! Something went wrong.",
            description: "Could not save your transaction. Please try again.",
        });
    }
  };

  const handleNext = async () => {
    const isValid = await form.trigger(['date', 'type', 'amount']);
    if (isValid) setStep(2);
  };
  
  const handleAccountSelect = async (accountName: string) => {
    form.setValue('account', accountName, { shouldValidate: true });
    const isValid = await form.trigger(['account']);
    if (isValid) {
      setStep(3);
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
            setTimeout(() => {
                form.reset({
                  date: new Date(),
                  type: 'Debit',
                  amount: undefined,
                  account: '',
                  category: '',
                  note: ''
                });
                setStep(1);
            }, 300);
        }
        onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-lg bg-card/80 backdrop-blur-xl border-border/20">
        <DialogHeader>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="absolute top-4 right-14"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <DialogTitle className="text-2xl font-bold">Add New Transaction</DialogTitle>
           <DialogDescription>
            {step === 1 ? 'Enter transaction details' : step === 2 ? 'Choose an account' : 'Add category & notes'}
          </DialogDescription>
          <ProgressDots current={step} total={3} />
        </DialogHeader>
        <Form {...form}>
            <div className="min-h-[380px]">
                <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                    key="step1"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6 pt-4"
                    >
                     <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                        "pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                        )}
                                    >
                                        {field.value ? (
                                        format(field.value, "PPP")
                                        ) : (
                                        <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                        date > new Date() || date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Type</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-2 gap-4"
                              >
                                <FormItem>
                                  <RadioGroupItem value="Debit" id="debit" className="peer sr-only" />
                                  <Label
                                    htmlFor="debit"
                                    className="flex flex-col items-center justify-center rounded-2xl border-2 border-muted bg-popover/40 p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                                  >
                                    <div className="p-2 rounded-full bg-red-500/20 text-red-400 mb-2">
                                        <ArrowDown className="h-5 w-5" />
                                    </div>
                                    <span className="font-bold">Debit</span>
                                    <span className="text-xs text-muted-foreground">Money out</span>
                                  </Label>
                                </FormItem>
                                <FormItem>
                                  <RadioGroupItem value="Credit" id="credit" className="peer sr-only" />
                                  <Label
                                    htmlFor="credit"
                                    className="flex flex-col items-center justify-center rounded-2xl border-2 border-muted bg-popover/40 p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                                  >
                                     <div className="p-2 rounded-full bg-green-500/20 text-green-400 mb-2">
                                        <ArrowUp className="h-5 w-5" />
                                    </div>
                                    <span className="font-bold">Credit</span>
                                    <span className="text-xs text-muted-foreground">Money in</span>
                                  </Label>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                            <Input type="number" placeholder="0.00" {...field} value={field.value ?? ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    </motion.div>
                )}
                {step === 2 && (
                    <motion.div
                        key="step2"
                        variants={stepVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-4 pt-4"
                    >
                        <FormField
                            control={form.control}
                            name="account"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Account Type</FormLabel>
                                    <FormControl>
                                        <div className="grid grid-cols-2 gap-4 pt-2">
                                            {accountTypes.map(typeInfo => {
                                                const account = mockAccounts.find(a => a.type === typeInfo.name);
                                                if (!account) return null;
                                                
                                                const isSelected = field.value === account.name;
                                                
                                                return (
                                                    <Card 
                                                        key={typeInfo.name} 
                                                        onClick={() => handleAccountSelect(account.name)} 
                                                        className={cn(
                                                            "cursor-pointer transition-all hover:border-primary/50 text-center py-6 bg-popover/40", 
                                                            isSelected ? "ring-2 ring-primary border-primary" : ""
                                                        )}
                                                    >
                                                        <CardHeader className="flex flex-col items-center justify-center space-y-2 p-0">
                                                            <typeInfo.icon className="h-8 w-8 text-muted-foreground" />
                                                            <CardTitle className="text-lg font-semibold">{typeInfo.name}</CardTitle>
                                                        </CardHeader>
                                                    </Card>
                                                )
                                            })}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                            )}
                        />
                    </motion.div>
                )}
                {step === 3 && (
                    <motion.div
                    key="step3"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-8 pt-4"
                    >
                    <FormField
                        control={form.control}
                        name="note"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Note</FormLabel>
                            <FormControl>
                            <Textarea placeholder="e.g., Weekly grocery shopping" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                            <FormItem>
                                <div className="flex justify-between items-center">
                                    <FormLabel>Category</FormLabel>
                                    <div className="flex items-center gap-2">
                                        <Button type="button" size="sm" variant="outline">
                                            <Sparkles className="mr-2 h-4 w-4" />
                                            Suggest
                                        </Button>
                                        <Button type="button" variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                            <SlidersHorizontal className="mr-2 h-4 w-4" />
                                            Manage
                                        </Button>
                                    </div>
                                </div>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="mt-2">
                                        <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
            
            <div className="flex w-full items-center justify-between pt-8 mt-4 border-t">
                <div>
                {step > 1 && (
                    <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                )}
                </div>

                <div className="flex items-center gap-4">
                    {step === 1 && (
                        <>
                            <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                            <Button type="button" variant="gradient" onClick={handleNext}>
                                Next <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </>
                    )}

                    {step === 2 && (
                         <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                    )}

                    {step === 3 && (
                        <div className="flex flex-col-reverse sm:flex-row items-center gap-3">
                            <Button type="button" variant="secondary" onClick={() => handleFormSubmit(false)}>Save Transaction</Button>
                            <Button type="button" variant="gradient" onClick={() => handleFormSubmit(true)}>Save & Implement</Button>
                        </div>
                    )}
                </div>
            </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
