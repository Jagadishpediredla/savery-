'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';

export function HeaderDate() {
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        // This runs only on the client, avoiding hydration mismatch
        setCurrentDate(format(new Date(), 'EEEE, MMMM dd, yyyy'));
    }, []);

    if (!currentDate) {
        // Render nothing on the server and on initial client render
        return null; 
    }

    return (
        <Link href="/">
            <div className="hidden md:flex items-center gap-2 rounded-full bg-card/60 backdrop-blur-lg px-4 py-2 text-sm font-medium text-muted-foreground border cursor-pointer hover:border-primary/50 transition-colors">
                <span>{currentDate}</span>
            </div>
        </Link>
    );
}
