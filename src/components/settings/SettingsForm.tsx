'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const settingsSchema = z.object({
  monthlySalary: z.coerce.number().min(0, 'Salary must be a positive number'),
  needsPercentage: z.number().min(0).max(100),
  wantsPercentage: z.number().min(0).max(100),
  investmentsPercentage: z.number().min(0).max(100),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

export function SettingsForm() {
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      monthlySalary: 50000,
      needsPercentage: 50,
      wantsPercentage: 30,
      investmentsPercentage: 15,
    },
  });

  const { watch, setValue } = form;
  const needs = watch('needsPercentage');
  const wants = watch('wantsPercentage');
  const investments = watch('investmentsPercentage');
  const savings = 100 - needs - wants - investments;

  const pieData = [
    { name: 'Needs', value: needs, fill: COLORS[0] },
    { name: 'Wants', value: wants, fill: COLORS[1] },
    { name: 'Investments', value: investments, fill: COLORS[2] },
    { name: 'Savings', value: savings, fill: COLORS[3] },
  ].filter(item => item.value > 0);

  const onSubmit = (data: SettingsFormValues) => {
    console.log('Settings saved:', { ...data, savingsPercentage: savings });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-8 md:grid-cols-3">
        <Card className="md:col-span-2">
            <CardHeader>
                <CardTitle>Budget Allocation</CardTitle>
                <CardDescription>Set your monthly salary and allocate your budget.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <FormField
                    control={form.control}
                    name="monthlySalary"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Monthly Salary (₹)</FormLabel>
                        <FormControl>
                        <Input type="number" placeholder="50000" {...field} />
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
                
                <Button type="submit">Save Settings</Button>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Your Plan</CardTitle>
                <CardDescription>Live visualization of your budget.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.fill} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                background: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "var(--radius)"
                            }}
                            formatter={(value) => `${value}%`}
                        />
                    </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                    {pieData.map(entry => (
                        <div key={entry.name} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full" style={{backgroundColor: entry.fill}}/>
                                <span>{entry.name}</span>
                            </div>
                            <span className="font-medium">
                                ₹{((watch('monthlySalary') * entry.value) / 100).toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </form>
    </Form>
  );
}
