
'use client'

import { BucketPageLayout } from "@/components/buckets/BucketPageLayout";

export default function InvestmentsPage() {
    return (
        <BucketPageLayout
            bucketType="Investments"
            title="Investments Bucket"
            description="Transactions related to your investments and financial goals."
        />
    );
}
