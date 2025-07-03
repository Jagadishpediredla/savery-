
'use client';

import { CandlestickChart, Home, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const navItems = [
  { href: '/', icon: Home, label: 'Dashboard', activeIn: ['/needs', '/wants'] },
  { href: '/investments', icon: CandlestickChart, label: 'Growth' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export function MobileNav() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  
  if (!isMobile) {
    return null;
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/90 backdrop-blur-lg border-t border-white/10 z-40">
      <div className="flex justify-around items-center h-full max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || item.activeIn?.includes(pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center text-xs w-full h-full gap-1 transition-colors rounded-lg',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
