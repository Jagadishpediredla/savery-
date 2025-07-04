
'use client'

import { BucketPageLayout } from "@/components/buckets/BucketPageLayout";

export default function WantsPage() {
    return (
        <BucketPageLayout
            bucketType="Wants"
            title="Wants Bucket"
            description="Transactions related to your discretionary spending."
        />
    );
}
