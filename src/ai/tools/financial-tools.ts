'use server';
/**
 * @fileOverview This file defines Genkit tools for accessing user financial data from Firebase.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import * as financialService from '@/services/firebase-service';

export const getTransactionsTool = ai.defineTool(
    {
        name: 'getTransactions',
        description: 'Retrieves a list of all user transactions. Use this to answer questions about spending, income, or specific transaction details.',
        inputSchema: z.object({}), // No input for now, could add date range later
        outputSchema: z.array(
            z.object({
                id: z.string(),
                date: z.string(),
                type: z.enum(['Credit', 'Debit']),
                amount: z.number(),
                account: z.string(),
                category: z.string(),
                note: z.string(),
            })
        ),
    },
    async () => {
        return await financialService.getTransactions();
    }
);

export const getGoalsTool = ai.defineTool(
    {
        name: 'getGoals',
        description: "Retrieves the user's financial goals, such as saving for a vacation or a new laptop. Use this to answer questions about goal progress.",
        inputSchema: z.object({}),
        outputSchema: z.array(
            z.object({
                id: z.string(),
                name: z.string(),
                targetAmount: z.number(),
                currentAmount: z.number(),
            })
        ),
    },
    async () => {
        return await financialService.getGoals();
    }
);

export const getSettingsTool = ai.defineTool(
    {
        name: 'getSettings',
        description: "Retrieves the user's budget settings, including monthly salary and allocation percentages for needs, wants, and investments.",
        inputSchema: z.object({}),
        outputSchema: z.object({
            monthlySalary: z.number(),
            needsPercentage: z.number(),
            wantsPercentage: z.number(),
            investmentsPercentage: z.number(),
            savingsPercentage: z.number(),
        }).nullable(),
    },
    async () => {
        return await financialService.getSettings();
    }
);

export const getAccountsTool = ai.defineTool(
    {
        name: 'getAccounts',
        description: "Retrieves a list of all user accounts (Needs, Wants, Savings, Investments) with their current balances. Balances are calculated from transactions.",
        inputSchema: z.object({}),
        outputSchema: z.array(
            z.object({
                id: z.string(),
                name: z.string(),
                balance: z.number(),
                type: z.enum(['Needs', 'Wants', 'Savings', 'Investments']),
            })
        ),
    },
    async () => {
        return await financialService.getAccounts();
    }
);
