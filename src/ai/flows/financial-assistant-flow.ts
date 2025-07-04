
'use server';
/**
 * @fileOverview A financial assistant AI agent.
 *
 * This file defines a Genkit flow that acts as a financial assistant.
 * It can access a user's financial data through a set of tools and
 * provide answers to natural language questions.
 *
 * - financialAssistant - The main flow function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import {
  getAccountsTool,
  getGoalsTool,
  getSettingsTool,
  getTransactionsTool,
} from '@/ai/tools/financial-tools';
import type { CoreMessage } from 'genkit/model';

const systemPrompt = `You are Savvy Saver, a friendly and knowledgeable AI financial assistant.
Your goal is to provide clear, helpful, and accurate answers to users about their personal finances based on the data you can access through the provided tools.

- ALWAYS use the available tools to fetch the user's financial data (transactions, accounts, goals, settings). Do not make up or assume any data.
- If a user's query is ambiguous, ask clarifying questions. For example, if they ask "how much did I spend", ask them for a time period.
- Be concise in your answers. Use Markdown for formatting, especially for lists and tables, to make the information easy to read.
- When presenting transaction data, format it in a clear table.
- Never give financial advice. Stick to summarizing and analyzing the data you have.
- If you cannot answer a question with the available tools, politely state that you cannot fulfill the request.
`;

export const financialAssistant = ai.defineFlow(
  {
    name: 'financialAssistant',
    inputSchema: z.object({
        prompt: z.string(),
        history: z.array(z.any()),
    }),
    outputSchema: z.string(),
  },
  async ({ prompt, history }) => {
    const { output } = await ai.generate({
      model: 'googleai/gemini-2.0-flash',
      prompt: prompt,
      history: history as CoreMessage[],
      system: systemPrompt,
      tools: [getTransactionsTool, getAccountsTool, getGoalsTool, getSettingsTool],
    });

    return output?.text() ?? 'Sorry, I could not process your request.';
  }
);
