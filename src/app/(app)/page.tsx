
'use client';

import { PageWrapper } from '@/components/PageWrapper';
import { WelcomeHeader } from '@/components/dashboard/new/WelcomeHeader';
import { SpendingBreakdown } from '@/components/dashboard/new/SpendingBreakdown';
import { CashflowCard } from '@/components/dashboard/new/CashflowCard';
import { EarningsChart } from '@/components/dashboard/new/EarningsChart';
import { UpcomingBills } from '@/components/dashboard/new/UpcomingBills';
import { FinancialHabits } from '@/components/dashboard/new/FinancialHabits';
import { StatCard } from '@/components/dashboard/new/StatCard';
import { Smile, Landmark } from 'lucide-react';
import { GoalStorageCard } from '@/components/dashboard/new/GoalStorageCard';

export default function DashboardPage() {
  return (
    <PageWrapper>
      <div className="space-y-6">
        <WelcomeHeader name="Marco Yates" level="Intermediate Level" xp="1,500 XP" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Column 1 */}
          <div className="lg:col-span-1 xl:col-span-1 space-y-6">
            <SpendingBreakdown />
            <FinancialHabits />
          </div>

          {/* Column 2 */}
          <div className="lg:col-span-2 xl:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CashflowCard />
                <EarningsChart />
            </div>
            <UpcomingBills />
          </div>

          {/* Column 3 */}
          <div className="lg:col-span-3 xl:col-span-1 space-y-6">
             <GoalStorageCard />
             <StatCard 
                title="Invest in My Future"
                value="$30"
                footerText="invested since your last login"
                icon={<Smile className="w-8 h-8 text-yellow-400" />}
             />
             <StatCard 
                title="Paying Off Loans"
                value="$430"
                footerText="paid towards loans since your last login"
                icon={<Landmark className="w-8 h-8 text-green-400" />}
                />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
