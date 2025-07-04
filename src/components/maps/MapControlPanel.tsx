
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TransactionCard } from '../transactions/TransactionCard';
import { motion, AnimatePresence } from 'framer-motion';
import type { Transaction, LocationData } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MapControlPanelProps {
    transactions: Transaction[];
    onTransactionClick: (location: LocationData) => void;
    isVisible: boolean;
}

export function MapControlPanel({ transactions, onTransactionClick, isVisible }: MapControlPanelProps) {
    const transactionsWithLocation = transactions.filter(t => t.location);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="absolute top-0 right-0 h-full w-full max-w-sm p-4 pointer-events-none"
                >
                    <Card className="h-full flex flex-col bg-card/80 backdrop-blur-lg pointer-events-auto">
                        <CardHeader>
                            <CardTitle>Transactions</CardTitle>
                            <CardDescription>Click a transaction to view it on the map.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-hidden p-0">
                            <ScrollArea className="h-full p-6 pt-0">
                                {transactionsWithLocation.length > 0 ? (
                                     <div className="space-y-2">
                                        {transactionsWithLocation.map(tx => (
                                            <TransactionCard
                                                key={tx.id}
                                                transaction={tx}
                                                onClick={() => onTransactionClick(tx.location!)}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-muted-foreground">
                                        No transactions with location data in the current filter.
                                    </div>
                                )}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
