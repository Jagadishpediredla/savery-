'use server';
/**
 * @fileOverview AI flow to visualize account data using charts.
 *
 * - visualizeAccountData - A function that generates a pie chart visualizing expense distribution across categories for a selected account.
 * - VisualizeAccountDataInput - The input type for the visualizeAccountData function.
 * - VisualizeAccountDataOutput - The return type for the visualizeAccountData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VisualizeAccountDataInputSchema = z.object({
  accountId: z.string().describe('The ID of the account to visualize data for.'),
  transactionData: z.string().describe('A JSON string containing transaction data for the specified account, including date, type, amount, category, and note.'),
});
export type VisualizeAccountDataInput = z.infer<typeof VisualizeAccountDataInputSchema>;

const VisualizeAccountDataOutputSchema = z.object({
  chartDataUri: z.string().describe('A data URI containing the generated pie chart as an image (e.g., data:image/png;base64,...).'),
  summary: z.string().describe('A short text summary of the expense distribution.'),
});
export type VisualizeAccountDataOutput = z.infer<typeof VisualizeAccountDataOutputSchema>;

export async function visualizeAccountData(input: VisualizeAccountDataInput): Promise<VisualizeAccountDataOutput> {
  return visualizeAccountDataFlow(input);
}

const visualizeAccountDataPrompt = ai.definePrompt({
  name: 'visualizeAccountDataPrompt',
  input: {schema: VisualizeAccountDataInputSchema},
  output: {schema: VisualizeAccountDataOutputSchema},
  prompt: `You are an AI assistant specializing in financial data visualization.

  A user has requested a pie chart visualizing the distribution of their expenses across different categories for the account with ID {{{accountId}}}.
  Use the provided transaction data to generate the chart and a short summary highlighting the key expense categories.

  Transaction Data (JSON format):
  {{{transactionData}}}

  Based on the transaction data, generate a data URI containing a pie chart image visualizing the expense distribution, and provide a concise summary of the expense distribution.
  Ensure that the chart is visually appealing and easy to understand.
  Return the chart as a data URI in the chartDataUri field and the summary in the summary field.

  Avoid listing every category; focus on the most significant ones.
`,
});

const visualizeAccountDataFlow = ai.defineFlow(
  {
    name: 'visualizeAccountDataFlow',
    inputSchema: VisualizeAccountDataInputSchema,
    outputSchema: VisualizeAccountDataOutputSchema,
  },
  async input => {
    const {output} = await visualizeAccountDataPrompt(input);
    return output!;
  }
);
