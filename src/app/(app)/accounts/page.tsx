'use client';

import { PageWrapper } from "@/components/PageWrapper";

export default function AccountsPage() {
    return (
        <PageWrapper>
            <div className="space-y-8">
                <header>
                    <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
                    <p className="text-muted-foreground">
                        This page is no longer in use. Please use the specific account pages from the sidebar.
                    </p>
                </header>
            </div>
        </PageWrapper>
    );
}
