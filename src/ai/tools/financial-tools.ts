
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import * as financialService from '@/services/firebase-service';

export const getTransactionsTool = ai.defineTool(
    {
        name: 'getTransactions',
        description: 'Get a list of financial transactions. Can be filtered by date range and category.',
        inputSchema: z.object({
            startDate: z.string().optional().describe('Start date in YYYY-MM-DD format'),
            endDate: z.string().optional().describe('End date in YYYY-MM-DD format'),
            category: z.string().optional().describe('Filter by category (e.g., Groceries, Rent)'),
        }),
        outputSchema: z.array(z.object({
            id: z.string(),
            date: z.string(),
            type: z.string(),
            amount: z.number(),
            account: z.string(),
            bucket: z.string(),
            category: z.string().optional(),
            note: z.string().optional(),
        })),
    },
    async (input) => {
        const transactions = await financialService.getTransactions();
        return transactions.filter(t => {
            const date = new Date(t.date);
            const isAfterStartDate = !input.startDate || date >= new Date(input.startDate);
            const isBeforeEndDate = !input.endDate || date <= new Date(input.endDate);
            const isCategoryMatch = !input.category || t.category === input.category;
            return isAfterStartDate && isBeforeEndDate && isCategoryMatch;
        });
    }
);

export const getGoalsTool = ai.defineTool(
    {
        name: 'getGoals',
        description: 'Get a list of the user\'s financial goals and their progress.',
        inputSchema: z.object({}),
        outputSchema: z.array(z.object({
            id: z.string(),
            name: z.string(),
            targetAmount: z.number(),
            currentAmount: z.number(),
        })),
    },
    async () => {
        return financialService.getGoals();
    }
);


export const getSettingsTool = ai.defineTool(
    {
        name: 'getSettings',
        description: 'Get the user\'s current budget settings, including monthly salary and allocation percentages.',
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
        return financialService.getSettings();
    }
);

export const getAccountsTool = ai.defineTool(
    {
        name: 'getAccounts',
        description: 'Get a list of all user accounts and their current balances.',
        inputSchema: z.object({}),
        outputSchema: z.array(z.object({
            id: z.string(),
            name: z.string(),
            type: z.string(),
            balance: z.number(),
        })),
    },
    async () => {
        return financialService.getAccounts();
    }
);
