
'use client'

import { PageWrapper } from "@/components/PageWrapper";
import { useFirebase } from "@/context/FirebaseContext";
import { BucketSummaryCard } from "@/components/dashboard/BucketSummaryCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccountsPage() {
  const { buckets, loading } = useFirebase();

  if (loading) {
    return (
        <PageWrapper>
            <div className="space-y-8">
                <header>
                    <Skeleton className="h-9 w-48" />
                    <Skeleton className="h-4 w-64 mt-2" />
                </header>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                </div>
            </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
          <p className="text-muted-foreground">
            A summary of all your financial buckets. Click a card or a link in the sidebar to see details.
          </p>
        </header>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {buckets.map((bucket) => (
            <BucketSummaryCard key={bucket.name} bucket={bucket} />
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
