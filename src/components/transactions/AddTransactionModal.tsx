'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, CalendarIcon, Landmark, ShoppingCart, Wallet } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { AnimatePresence, motion } from 'framer-motion';

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
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { mockAccounts } from '@/data/mock-data';

const transactionSchema = z.object({
  date: z.date(),
  type: z.enum(['Credit', 'Debit']),
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
  account: z.string().min(1, 'Please select an account'),
  category: z.string().min(1, 'Please select a category'),
  note: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

const categories = [
    'Groceries', 'Rent', 'Salary', 'Dining Out', 'Entertainment', 'Transfer', 'Investment', 'Utilities', 'Shopping', 'Other'
];

interface AddTransactionModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export function AddTransactionModal({ isOpen, onOpenChange }: AddTransactionModalProps) {
  const [step, setStep] = useState(1);

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'Debit',
      account: '',
      category: '',
      note: ''
    },
  });

  const onSubmit = (data: TransactionFormValues) => {
    console.log('Transaction submitted:', data);
    onOpenChange(false);
    setStep(1);
    form.reset();
  };

  const handleNext = async () => {
    const isValid = await form.trigger(['date', 'type', 'amount']);
    if (isValid) setStep(2);
  };
  
  const handleNextToStep3 = async () => {
    const isValid = await form.trigger(['account']);
    if (isValid) setStep(3);
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background/80 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>
            Step {step} of 3: {step === 1 ? "Details" : step === 2 ? "Account" : "Category"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Select transaction type" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Credit">Credit</SelectItem>
                                <SelectItem value="Debit">Debit</SelectItem>
                            </SelectContent>
                        </Select>
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
                          <Input type="number" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                </motion.div>
              )}
              {step === 2 && (
                <motion.div
                    key="step2"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-4"
                >
                    <FormField
                        control={form.control}
                        name="account"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Account</FormLabel>
                                <FormControl>
                                    <div className="grid grid-cols-2 gap-4">
                                        {mockAccounts.map(account => (
                                            <Card key={account.id} onClick={() => field.onChange(account.id)} className={cn("cursor-pointer", field.value === account.id && "ring-2 ring-primary")}>
                                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                    <CardTitle className="text-sm font-medium">{account.name}</CardTitle>
                                                    <Landmark className="h-4 w-4 text-muted-foreground" />
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="text-lg font-bold">
                                                        ${account.balance.toLocaleString()}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
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
                  className="space-y-4"
                >
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
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
                  <FormField
                    control={form.control}
                    name="note"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Note (Optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Add a note..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
              ) : <div></div>}
              {step === 1 && (
                <Button type="button" onClick={handleNext}>
                  Next
                </Button>
              )}
              {step === 2 && (
                <Button type="button" onClick={handleNextToStep3}>
                  Next
                </Button>
              )}
              {step === 3 && <Button type="submit">Add Transaction</Button>}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
