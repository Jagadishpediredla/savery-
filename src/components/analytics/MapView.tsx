'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import type { Transaction } from '@/lib/types';
import * as React from 'react';

const LeafletMap = dynamic(() => import('./LeafletMap'), {
    ssr: false,
    loading: () => <Skeleton className="h-[400px] w-full rounded-lg" />
});

interface MapViewProps {
    transactions: Transaction[];
}

export default function MapView({ transactions }: MapViewProps) {
    return <LeafletMap transactions={transactions} />;
}
