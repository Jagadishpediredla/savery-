
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { LayoutDashboard, Wallet, Plus, Bot, LayoutGrid } from 'lucide-react';
import { Button } from './ui/button';

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/accounts', icon: Wallet, label: 'Accounts' },
  { href: '/support', icon: LayoutGrid, label: 'Analytics' },
  { href: '/visualizer', icon: Bot, label: 'AI' },
];

interface MobileNavProps {
  onAddTransaction: () => void;
}

export function MobileNav({ onAddTransaction }: MobileNavProps) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  
  if (!isMobile) {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-xl border-t z-50">
      <nav className="flex justify-around items-center h-full max-w-md mx-auto px-2">
        {navItems.slice(0, 2).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center text-xs w-full h-full gap-1 transition-colors rounded-lg',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
        })}

        <Button
            onClick={onAddTransaction}
            className="h-14 w-14 p-0 rounded-full shadow-2xl z-40 -mt-8"
            size="icon"
            variant="gradient"
        >
            <Plus className="h-7 w-7" />
            <span className="sr-only">Add Transaction</span>
        </Button>

        {navItems.slice(2, 4).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center text-xs w-full h-full gap-1 transition-colors rounded-lg',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
        })}
      </nav>
    </div>
  );
}
