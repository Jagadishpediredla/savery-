
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useEffect, useState, useCallback } from 'react';
import { ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Cell, Pie, PieChart } from 'recharts';
import { useFirebase } from '@/context/FirebaseContext';
import { Skeleton } from '../ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

const settingsSchema = z.object({
  monthlySalary: z.coerce.number().min(0, 'Salary must be a positive number'),
  needsPercentage: z.number().min(0).max(100),
  wantsPercentage: z.number().min(0).max(100),
  investmentsPercentage: z.number().min(0).max(100),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const chartConfig = {
  Needs: { label: 'Needs', color: 'hsl(var(--chart-1))' },
  Wants: { label: 'Wants', color: 'hsl(var(--chart-2))' },
  Investments: { label: 'Investments', color: 'hsl(var(--chart-3))' },
  Savings: { label: 'Savings', color: 'hsl(var(--chart-4))' },
} satisfies ChartConfig;


export function SettingsForm() {
  const { settings, updateSettings, loading, seedDatabase, clearDatabase } = useFirebase();
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      monthlySalary: 0,
      needsPercentage: 0,
      wantsPercentage: 0,
      investmentsPercentage: 0,
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        monthlySalary: settings.monthlySalary,
        needsPercentage: settings.needsPercentage,
        wantsPercentage: settings.wantsPercentage,
        investmentsPercentage: settings.investmentsPercentage,
      });
    }
  }, [settings, form]);
  
  const handleSettingsUpdate = useCallback(() => {
    const values = form.getValues();
    updateSettings(values);
  }, [form, updateSettings]);

  const { watch } = form;
  const needs = watch('needsPercentage');
  const wants = watch('wantsPercentage');
  const investments = watch('investmentsPercentage');
  const savings = 100 - needs - wants - investments;

  const pieData = [
    { name: 'Needs', value: needs, fill: 'var(--color-Needs)' },
    { name: 'Wants', value: wants, fill: 'var(--color-Wants)' },
    { name: 'Investments', value: investments, fill: 'var(--color-Investments)' },
    { name: 'Savings', value: savings, fill: 'var(--color-Savings)' },
  ].filter(item => item.value > 0);
  
  if (loading) {
    return (
        <div className="grid gap-8 md:grid-cols-3">
            <Skeleton className="md:col-span-2 h-[500px]" />
            <Skeleton className="h-[500px]" />
        </div>
    );
  }

  return (
    <Form {...form}>
      <div className="grid gap-8 md:grid-cols-3">
        <Collapsible open={isSettingsOpen} onOpenChange={setIsSettingsOpen} className="md:col-span-2">
            <Card className="bg-card/60 backdrop-blur-lg">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Budget Allocation</CardTitle>
                            <CardDescription>Set your monthly salary and allocate your budget. Changes save automatically.</CardDescription>
                        </div>
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <ChevronsUpDown className="h-4 w-4" />
                                <span className="sr-only">Toggle</span>
                            </Button>
                        </CollapsibleTrigger>
                    </div>
                </CardHeader>
                <CollapsibleContent>
                    <CardContent className="space-y-8 pt-4">
                        <FormField
                            control={form.control}
                            name="monthlySalary"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Monthly Salary (₹)</FormLabel>
                                <FormControl>
                                <Input type="number" placeholder="50000" {...field} onBlur={handleSettingsUpdate} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="needsPercentage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Needs ({field.value}%)</FormLabel>
                                    <FormControl>
                                        <Slider
                                            value={[field.value]}
                                            onValueChange={(vals) => field.onChange(vals[0])}
                                            onValueCommit={handleSettingsUpdate}
                                            max={100}
                                            step={1}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="wantsPercentage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Wants ({field.value}%)</FormLabel>
                                    <FormControl>
                                        <Slider
                                            value={[field.value]}
                                            onValueChange={(vals) => field.onChange(vals[0])}
                                            onValueCommit={handleSettingsUpdate}
                                            max={100}
                                            step={1}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="investmentsPercentage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Investments ({field.value}%)</FormLabel>
                                    <FormControl>
                                        <Slider
                                            value={[field.value]}
                                            onValueChange={(vals) => field.onChange(vals[0])}
                                            onValueCommit={handleSettingsUpdate}
                                            max={100}
                                            step={1}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Savings ({savings}%)</label>
                            <Slider disabled value={[savings]} max={100} step={1} />
                            <p className="text-xs text-muted-foreground">Savings are calculated automatically.</p>
                        </div>
                    </CardContent>
                </CollapsibleContent>
            </Card>
        </Collapsible>

        <div className="space-y-8">
            <Card className="bg-card/60 backdrop-blur-lg">
                <CardHeader>
                    <CardTitle>Your Plan</CardTitle>
                    <CardDescription>Live visualization of your budget.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="mx-auto aspect-square h-full max-h-[250px]">
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent formatter={(value) => `${value}%`} />}
                            />
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={70}
                                dataKey="value"
                            >
                                {pieData.map((entry) => (
                                    <Cell key={`cell-${entry.name}`} fill={entry.fill} stroke={entry.fill} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                    <div className="mt-4 space-y-2">
                        {pieData.map(entry => (
                            <div key={entry.name} className="flex items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <span 
                                      className="h-2 w-2 rounded-full" 
                                      style={{
                                        backgroundColor: chartConfig[entry.name as keyof typeof chartConfig]?.color
                                      }}
                                    />
                                    <span>{entry.name}</span>
                                </div>
                                <span className="font-medium ml-auto">
                                    ₹{((watch('monthlySalary') * entry.value) / 100).toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
            <Card className="bg-card/60 backdrop-blur-lg">
                <CardHeader>
                    <CardTitle>Data Management</CardTitle>
                    <CardDescription>Use these actions to manage your app data for testing.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <Button type="button" variant="gradient" onClick={seedDatabase} className="w-full">
                        Seed with Sample Data
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button type="button" variant="destructive" className="w-full">Clear All Data</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete all your data.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={clearDatabase}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>
        </div>
      </div>
    </Form>
  );
}
