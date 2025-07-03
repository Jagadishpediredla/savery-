
'use client';

import {
  Settings,
  LayoutDashboard,
  Wallet,
  CandlestickChart,
  Bot,
  Plus,
  PanelLeft,
  Search,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { Button } from './ui/button';
import { AddTransactionModal } from './transactions/AddTransactionModal';
import { MobileNav } from './MobileNav';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { ThemeToggle } from './ThemeToggle';
import { Input } from './ui/input';

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/accounts', icon: Wallet, label: 'Accounts' },
  { href: '/investments', icon: CandlestickChart, label: 'Investments' },
  { href: '/visualizer', icon: Bot, label: 'Visualizer AI' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

const NavItem = ({ item, isExpanded }: { item: any, isExpanded: boolean }) => {
    const pathname = usePathname();
    const isActive = pathname === item.href;
    return (
        <Link
            href={item.href}
            className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10",
                isActive && "bg-primary/20 text-primary font-semibold",
                !isExpanded && "justify-center"
            )}
        >
            <item.icon className="h-5 w-5" />
            <span className={cn("transition-opacity duration-200 text-sm font-medium", isExpanded ? "opacity-100" : "opacity-0 w-0")}>{item.label}</span>
        </Link>
    );
};


export function AppShell({ children }: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const isMobile = useIsMobile();
  
  const sidebarContent = (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
        <div className="flex h-16 items-center border-b border-sidebar-border px-4 shrink-0">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            Savvy Saver
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {navItems.map((item) => <NavItem key={item.href} item={item} isExpanded={true} />)}
        </div>
        <div className="mt-auto p-4 border-t border-sidebar-border space-y-4">
            <Button variant="gradient" className="w-full" onClick={() => setIsModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
            </Button>
        </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
        {/* Desktop Sidebar */}
        {!isMobile && (
            <aside className="w-64 border-r bg-card/60 backdrop-blur-lg hidden md:flex flex-col">
                {sidebarContent}
            </aside>
        )}
      
      <div className="flex flex-col flex-1 min-w-0">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 md:px-8 backdrop-blur-xl">
            <div className="flex items-center gap-4">
                {/* Mobile Sidebar Toggle */}
                {isMobile && (
                    <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <PanelLeft className="h-5 w-5" />
                                <span className="sr-only">Toggle Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64 p-0 border-r-0 bg-transparent">
                           {sidebarContent}
                        </SheetContent>
                    </Sheet>
                )}
                 <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search..." className="pl-10 w-64 bg-card/60" />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <ThemeToggle />
            </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      <MobileNav onAddTransaction={() => setIsModalOpen(true)} />
      
      <AddTransactionModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
      
    </div>
  );
}
