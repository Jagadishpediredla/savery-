
'use client';

import {
  Bot,
  CandlestickChart,
  Home,
  Plus,
  Settings,
  Shield,
  ShoppingBag,
  Wallet,
  PanelLeft,
  Bell,
  UserCircle
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarItem, SidebarTrigger } from '@/components/ui/sidebar-new';
import { Button } from './ui/button';
import { AddTransactionModal } from './transactions/AddTransactionModal';
import { MobileNav } from './MobileNav';
import { ThemeToggle } from './ThemeToggle';

const navItems = [
  { href: '/', icon: Home, label: 'Dashboard' },
  { href: '/needs', icon: Shield, label: 'Needs' },
  { href: '/wants', icon: ShoppingBag, label: 'Wants' },
  { href: '/investments', icon: CandlestickChart, label: 'Investments' },
  { href: '/visualizer', icon: Bot, label: 'Visualizer' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar>
        <SidebarHeader>
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary/20 text-primary p-2 rounded-lg">
                <Wallet className="h-6 w-6" />
            </div>
            <span className="font-bold text-lg">FinanceFlow</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          {navItems.map((item) => (
            <SidebarItem key={item.href} href={item.href} isActive={pathname === item.href} icon={<item.icon />} label={item.label} />
          ))}
        </SidebarContent>
      </Sidebar>

      <div className="flex flex-col flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 md:px-8 backdrop-blur-sm">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="flex md:hidden" />
                <h1 className="text-xl font-semibold hidden md:block">
                    {navItems.find(item => item.href === pathname)?.label || 'Dashboard'}
                </h1>
            </div>

            <div className="flex items-center gap-4">
                <ThemeToggle />
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                </Button>
                 <Button variant="ghost" size="icon" className="rounded-full">
                    <UserCircle className="h-5 w-5" />
                    <span className="sr-only">Profile</span>
                </Button>
                <Link href="/settings">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Settings className="h-5 w-5" />
                        <span className="sr-only">Settings</span>
                    </Button>
                </Link>
            </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
          {children}
        </main>
      </div>

      <MobileNav navItems={navItems} />
      
      <AddTransactionModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
      
      {pathname === '/' && (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="fixed bottom-20 right-6 h-14 w-14 rounded-full shadow-2xl z-40 md:hidden"
            size="icon"
            variant="gradient"
          >
            <Plus className="h-7 w-7" />
            <span className="sr-only">Add Transaction</span>
          </Button>
      )}
    </div>
  );
}
