
'use client'

import { PageWrapper } from "@/components/PageWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BucketPageLayout } from "@/components/buckets/BucketPageLayout";
import { useFirebase } from "@/context/FirebaseContext";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccountsPage() {
    const { loading } = useFirebase();
    
    if (loading) {
        return (
            <PageWrapper>
                <div className="space-y-8">
                    <header>
                        <Skeleton className="h-9 w-48" />
                        <Skeleton className="h-4 w-64 mt-2" />
                    </header>
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-[500px] w-full" />
                </div>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <div className="space-y-8">
                <header>
                    <h1 className="text-3xl font-bold tracking-tight">Accounts Overview</h1>
                    <p className="text-muted-foreground">
                        A summary of all your financial buckets. Click a tab to see details.
                    </p>
                </header>
                <Tabs defaultValue="needs" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="needs">Needs</TabsTrigger>
                        <TabsTrigger value="wants">Wants</TabsTrigger>
                        <TabsTrigger value="savings">Savings</TabsTrigger>
                        <TabsTrigger value="investments">Investments</TabsTrigger>
                    </TabsList>
                    <TabsContent value="needs" className="mt-6">
                        <BucketPageLayout
                            bucketType="Needs"
                            title="Needs Bucket"
                            description="Transactions related to your essential spending."
                        />
                    </TabsContent>
                    <TabsContent value="wants" className="mt-6">
                        <BucketPageLayout
                            bucketType="Wants"
                            title="Wants Bucket"
                            description="Transactions related to your discretionary spending."
                        />
                    </TabsContent>
                    <TabsContent value="savings" className="mt-6">
                        <BucketPageLayout
                            bucketType="Savings"
                            title="Savings Bucket"
                            description="Transactions related to your savings and financial goals."
                        />
                    </TabsContent>
                    <TabsContent value="investments" className="mt-6">
                         <BucketPageLayout
                            bucketType="Investments"
                            title="Investments Bucket"
                            description="Transactions related to your investments and financial goals."
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </PageWrapper>
    );
}
