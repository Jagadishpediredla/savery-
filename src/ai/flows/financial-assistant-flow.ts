'use server';
/**
 * @fileOverview A conversational AI flow for answering questions about a user's financial data.
 *
 * - financialAssistant - The main flow function.
 * - FinancialAssistantInput - The input type for the flow.
 * - FinancialAssistantOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getTransactionsTool, getGoalsTool, getSettingsTool, getAccountsTool } from '@/ai/tools/financial-tools';

const FinancialAssistantInputSchema = z.object({
    prompt: z.string().describe('The user\'s question or message.'),
    // Optional chat history for context
    history: z.array(z.object({
        role: z.enum(['user', 'model']),
        content: z.array(z.object({ text: z.string() }))
    })).optional(),
});
export type FinancialAssistantInput = z.infer<typeof FinancialAssistantInputSchema>;

// The output is just a string for now.
const FinancialAssistantOutputSchema = z.string();
export type FinancialAssistantOutput = z.infer<typeof FinancialAssistantOutputSchema>;


export async function financialAssistant(input: FinancialAssistantInput): Promise<FinancialAssistantOutput> {
    return financialAssistantFlow(input);
}

const financialAssistantFlow = ai.defineFlow(
    {
        name: 'financialAssistantFlow',
        inputSchema: FinancialAssistantInputSchema,
        outputSchema: FinancialAssistantOutputSchema,
    },
    async (input) => {
        const { text } = await ai.generate({
            model: 'googleai/gemini-2.0-flash',
            tools: [getTransactionsTool, getGoalsTool, getSettingsTool, getAccountsTool],
            history: input.history,
            prompt: input.prompt,
            system: `You are FinanceFlow, a friendly and expert personal finance assistant.
            Your role is to help the user understand their financial data clearly and concisely.
            - Use the available tools to fetch the user's financial data (transactions, goals, settings, account balances).
            - Always be polite, helpful, and clear in your responses.
            - If a user asks for data in a table, format your response using Markdown tables.
            - If you cannot answer a question, explain why and suggest what you can do.
            - Do not invent any data. Only use the data provided by the tools.
            - Keep your answers concise unless the user asks for more detail.`
        });
        return text;
    }
);
