
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, CalendarIcon, SlidersHorizontal, Sparkles, ArrowRight, Sun, Moon, ArrowDown, ArrowUp, MapPin, Loader2, Send } from 'lucide-react';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
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
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle } from '../ui/card';
import { useFirebase } from '@/context/FirebaseContext';
import { useToast } from '@/hooks/use-toast';
import { Shield, ShoppingBag, PiggyBank, CandlestickChart } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { mockAccounts } from '@/data/mock-data';
import type { BucketType } from '@/lib/types';
import { ManageCategoriesDialog } from '../settings/ManageCategoriesDialog';


const transactionSchema = z.object({
  date: z.date({ required_error: "A date is required." }),
  type: z.enum(['Credit', 'Debit']),
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
  account: z.string().min(1, 'Please select an account type'),
  category: z.string().min(1, 'Please select a category'),
  note: z.string().optional(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    label: z.string().optional(),
  }).optional(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface AddTransactionModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

const accountToBucketMap = new Map<string, BucketType>(mockAccounts.map(acc => [acc.name, acc.type]));


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
  const { addTransaction, allCategories } = useFirebase();
  const { toast } = useToast();
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);


  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      date: new Date(),
      type: 'Debit',
      amount: undefined,
      account: '',
      category: '',
      note: '',
      location: undefined,
    },
  });
  
  const transactionType = form.watch('type');
  const selectedAccount = form.watch('account');
  const selectedBucket = accountToBucketMap.get(selectedAccount);

  const availableAccounts = useMemo(() => {
    if (transactionType === 'Credit') {
      return mockAccounts.filter(acc => acc.type === 'Savings');
    }
    return mockAccounts.filter(acc => acc.type !== 'Savings');
  }, [transactionType]);
  
  const availableCategories = useMemo(() => {
      if (!selectedBucket) return [];
      return allCategories[selectedBucket] || [];
  }, [selectedBucket, allCategories]);

  useEffect(() => {
    // Reset category if the selected account's bucket changes or categories change
    if (selectedBucket && !availableCategories.includes(form.getValues('category'))) {
      form.setValue('category', '');
    }
  }, [selectedBucket, availableCategories, form]);

  const handleGetLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast({ variant: 'destructive', title: 'Geolocation is not supported by your browser.' });
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        form.setValue('location', {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsGettingLocation(false);
        toast({ title: 'Location captured successfully!' });
      },
      () => {
        setIsGettingLocation(false);
        toast({ variant: 'destructive', title: 'Unable to retrieve location. Please grant permission.' });
      }
    );
  }, [form, toast]);

  useEffect(() => {
    if (step === 4) {
      handleGetLocation();
    }
  }, [step, handleGetLocation]);

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
            const upiUrl = `upi://pay`;
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
  
  const nextStep = async (fieldsToValidate: (keyof TransactionFormValues)[]) => {
      const isValid = await form.trigger(fieldsToValidate);
      if(isValid) setStep(prev => prev + 1);
  }

  const handleModalClose = (open: boolean) => {
    if (!open) {
        setTimeout(() => {
            form.reset({
              date: new Date(),
              type: 'Debit',
              amount: undefined,
              account: '',
              category: '',
              note: '',
              location: undefined,
            });
            setStep(1);
        }, 300);
    }
    onOpenChange(open);
  }
  
  const handleAccountSelect = async (accountName: string) => {
    form.setValue('account', accountName, { shouldValidate: true });
    nextStep(['account']);
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleModalClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Add New Transaction</DialogTitle>
            <DialogDescription>
              {step === 1 && 'Enter transaction details'}
              {step === 2 && 'Choose an account'}
              {step === 3 && 'Add category & notes'}
              {step === 4 && 'Optionally, add a location'}
            </DialogDescription>
            <ProgressDots current={step} total={4} />
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
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    form.setValue('account', ''); // Reset account on type change
                                  }}
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
                                      <FormLabel>Account</FormLabel>
                                      <FormControl>
                                          <div className="grid grid-cols-2 gap-4 pt-2">
                                              {availableAccounts.map(account => {
                                                  const Icon = accountToBucketMap.has(account.name) ?
                                                    { 'Needs': Shield, 'Wants': ShoppingBag, 'Savings': PiggyBank, 'Investments': CandlestickChart }[accountToBucketMap.get(account.name)!]
                                                    : Shield;
                                                  const isSelected = field.value === account.name;
                                                  
                                                  return (
                                                      <Card 
                                                          key={account.id} 
                                                          onClick={() => handleAccountSelect(account.name)} 
                                                          className={cn(
                                                              "cursor-pointer transition-all hover:border-primary/50 text-center py-6 bg-popover/40", 
                                                              isSelected ? "ring-2 ring-primary border-primary" : ""
                                                          )}
                                                      >
                                                          <CardHeader className="flex flex-col items-center justify-center space-y-2 p-0">
                                                              <Icon className="h-8 w-8 text-muted-foreground" />
                                                              <CardTitle className="text-lg font-semibold">{account.name}</CardTitle>
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
                                          <TooltipProvider>
                                              <Tooltip>
                                                  <TooltipTrigger asChild>
                                                      <Button type="button" size="sm" variant="outline" disabled>
                                                          <Sparkles className="mr-2 h-4 w-4" />
                                                          Suggest
                                                      </Button>
                                                  </TooltipTrigger>
                                                  <TooltipContent>
                                                      <p>AI-powered suggestions coming soon!</p>
                                                  </TooltipContent>
                                              </Tooltip>
                                          </TooltipProvider>
                                           <Button type="button" variant="outline" size="sm" onClick={() => setIsManageOpen(true)} disabled={!selectedBucket}>
                                              <SlidersHorizontal className="mr-2 h-4 w-4" />
                                              Manage
                                          </Button>
                                      </div>
                                  </div>
                                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                      <FormControl>
                                          <SelectTrigger className="mt-2">
                                          <SelectValue placeholder="Select category" />
                                          </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                          {availableCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                      </SelectContent>
                                  </Select>
                                  <FormMessage />
                              </FormItem>
                              )}
                          />
                      </motion.div>
                  )}
                  {step === 4 && (
                      <motion.div
                          key="step4"
                          variants={stepVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="space-y-6 pt-4"
                      >
                           <div className="space-y-2">
                             <Label>Location (Optional)</Label>
                              <p className="text-sm text-muted-foreground">
                                  Add a location to this transaction to see it on your map.
                              </p>
                          </div>
                          
                          <Button type="button" variant="outline" className="w-full" onClick={handleGetLocation} disabled={isGettingLocation}>
                              {isGettingLocation ? (
                                  <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Getting Location...
                                  </>
                              ) : (
                                  <>
                                      <MapPin className="mr-2 h-4 w-4" />
                                      Get Current Location
                                  </>
                              )}
                          </Button>

                          {form.watch('location') && !isGettingLocation && (
                               <div className="p-4 rounded-lg bg-muted/50 text-xs space-y-1">
                                  <p>Lat: {form.watch('location.latitude')}</p>
                                  <p>Lon: {form.watch('location.longitude')}</p>
                               </div>
                           )}

                           <FormField
                              control={form.control}
                              name="location.label"
                              render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Location Label</FormLabel>
                                  <FormControl>
                                  <Input placeholder="e.g., Downtown Coffee Shop" {...field} />
                                  </FormControl>
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
                              <Button type="button" variant="gradient" onClick={() => nextStep(['date', 'type', 'amount'])}>
                                  Next <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                          </>
                      )}

                      {step === 2 && (
                           <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                      )}

                      {step === 3 && (
                          <>
                               <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                               <Button type="button" variant="gradient" onClick={() => nextStep(['note', 'category'])}>
                                  Next <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                          </>
                      )}

                      {step === 4 && (
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
      {selectedBucket && <ManageCategoriesDialog isOpen={isManageOpen} onOpenChange={setIsManageOpen} bucketType={selectedBucket} />}
    </>
  );
}
