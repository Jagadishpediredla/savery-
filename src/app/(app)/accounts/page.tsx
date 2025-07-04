
'use client'

import { BucketType } from "@/lib/types";
import { BucketPageLayout } from "@/components/buckets/BucketPageLayout";

export default function NeedsAccountPage() {
    return (
        <BucketPageLayout
            bucketType="Needs"
            title="Needs Bucket"
            description="Transactions related to your essential spending."
        />
    );
}
