
'use client';

// This page has been moved to /maps.
// This file can be deleted.
// We are replacing its content to avoid build errors.
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function SupportPage() {
    useEffect(() => {
        redirect('/maps');
    }, []);
    return null;
}
