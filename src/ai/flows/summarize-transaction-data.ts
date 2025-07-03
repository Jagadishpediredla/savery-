'use server';
/**
 * @fileOverview Summarizes transaction data for a specified time range.
 *
 * - summarizeTransactionData - A function that takes a date range and transaction data and returns a summary.
 * - SummarizeTransactionDataInput - The input type for the summarizeTransactionData function.
 * - SummarizeTransactionDataOutput - The return type for the summarizeTransactionData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTransactionDataInputSchema = z.object({
  startDate: z.string().describe('The start date for the transaction summary (YYYY-MM-DD).'),
  endDate: z.string().describe('The end date for the transaction summary (YYYY-MM-DD).'),
  transactions: z.array(
    z.object({
      date: z.string(),
      type: z.string(),
      amount: z.number(),
      account: z.string(),
      category: z.string(),
      note: z.string(),
    })
  ).describe('An array of transaction objects.'),
});
export type SummarizeTransactionDataInput = z.infer<typeof SummarizeTransactionDataInputSchema>;

const SummarizeTransactionDataOutputSchema = z.object({
  totalIncome: z.number().describe('The total income for the specified period.'),
  totalExpenses: z.number().describe('The total expenses for the specified period.'),
  netSavings: z.number().describe('The net savings (income minus expenses) for the specified period.'),
  summary: z.string().describe('A text summary of the transaction data.'),
});
export type SummarizeTransactionDataOutput = z.infer<typeof SummarizeTransactionDataOutputSchema>;

export async function summarizeTransactionData(input: SummarizeTransactionDataInput): Promise<SummarizeTransactionDataOutput> {
  return summarizeTransactionDataFlow(input);
}

const summarizeTransactionDataPrompt = ai.definePrompt({
  name: 'summarizeTransactionDataPrompt',
  input: {schema: SummarizeTransactionDataInputSchema},
  output: {schema: SummarizeTransactionDataOutputSchema},
  prompt: `You are a personal finance expert. You will receive transaction data for a user for a specific time range and will output key metrics like total income, total expenses, and net savings.

  Start Date: {{{startDate}}}
  End Date: {{{endDate}}}

  Transactions:
  {{#each transactions}}
  Date: {{date}}, Type: {{type}}, Amount: {{amount}}, Account: {{account}}, Category: {{category}}, Note: {{note}}
  {{/each}}

  Based on the transaction data provided, calculate the total income, total expenses, and net savings for the specified period. Also, create a concise text summary (maximum 100 words) of the transaction data, highlighting any significant trends or patterns.
  `,
});

const summarizeTransactionDataFlow = ai.defineFlow(
  {
    name: 'summarizeTransactionDataFlow',
    inputSchema: SummarizeTransactionDataInputSchema,
    outputSchema: SummarizeTransactionDataOutputSchema,
  },
  async input => {
    const {output} = await summarizeTransactionDataPrompt(input);
    return output!;
  }
);
