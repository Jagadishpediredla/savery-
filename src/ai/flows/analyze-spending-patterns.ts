// 'use server';
/**
 * @fileOverview This file defines a Genkit flow for analyzing user spending patterns.
 *
 * - analyzeSpendingPatterns - Analyzes spending patterns over a specified period.
 * - AnalyzeSpendingPatternsInput - The input type for the analyzeSpendingPatterns function.
 * - AnalyzeSpendingPatternsOutput - The return type for the analyzeSpendingPatterns function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSpendingPatternsInputSchema = z.object({
  startDate: z
    .string()
    .describe('The start date for analyzing spending patterns (YYYY-MM-DD).'),
  endDate: z
    .string()
    .describe('The end date for analyzing spending patterns (YYYY-MM-DD).'),
  transactions: z.string().describe('JSON string of all user transactions'),
});

export type AnalyzeSpendingPatternsInput = z.infer<
  typeof AnalyzeSpendingPatternsInputSchema
>;

const AnalyzeSpendingPatternsOutputSchema = z.object({
  summary: z.string().describe('A summary of the spending patterns.'),
  insights: z.string().describe('Key insights into the spending patterns.'),
  suggestions: z
    .string()
    .describe('Suggestions for improving spending habits.'),
});

export type AnalyzeSpendingPatternsOutput = z.infer<
  typeof AnalyzeSpendingPatternsOutputSchema
>;

export async function analyzeSpendingPatterns(
  input: AnalyzeSpendingPatternsInput
): Promise<AnalyzeSpendingPatternsOutput> {
  return analyzeSpendingPatternsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSpendingPatternsPrompt',
  input: {schema: AnalyzeSpendingPatternsInputSchema},
  output: {schema: AnalyzeSpendingPatternsOutputSchema},
  prompt: `You are a personal finance advisor. Analyze the user's spending patterns between {{startDate}} and {{endDate}} based on the following transactions:

Transactions: {{{transactions}}}

Provide a concise summary of their spending, key insights, and suggestions for improvement.

Summary:
Insights:
Suggestions:`, // Ensure output is structured and easily parseable
});

const analyzeSpendingPatternsFlow = ai.defineFlow(
  {
    name: 'analyzeSpendingPatternsFlow',
    inputSchema: AnalyzeSpendingPatternsInputSchema,
    outputSchema: AnalyzeSpendingPatternsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
