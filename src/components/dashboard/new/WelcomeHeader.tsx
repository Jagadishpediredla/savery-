
'use client';

import { Wallet } from "lucide-react";

interface WelcomeHeaderProps {
    name: string;
    level: string;
    xp: string;
}

export function WelcomeHeader({ name, level, xp }: WelcomeHeaderProps) {
    return (
        <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-xl">
                <Wallet className="w-8 h-8" />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-foreground">Welcome back, {name}!</h1>
                <p className="text-sm text-muted-foreground">{level} &middot; {xp}</p>
            </div>
        </div>
    );
}
