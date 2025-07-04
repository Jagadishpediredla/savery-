
'use client'

import { BucketPageLayout } from "@/components/buckets/BucketPageLayout";

export default function SavingsPage() {
    return (
        <BucketPageLayout
            bucketType="Savings"
            title="Savings Bucket"
            description="Transactions related to your savings and financial goals."
        />
    );
}
