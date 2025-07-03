'use client';

import {
  Bot,
  CandlestickChart,
  Home,
  Menu,
  PiggyBank,
  Plus,
  Settings,
  Shield,
  ShoppingBag,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { AddTransactionModal } from './transactions/AddTransactionModal';
import { format } from 'date-fns';

const navItems = [
  { href: '/', icon: Home, label: 'Dashboard' },
  { href: '/needs', icon: Shield, label: 'Needs Account' },
  { href: '/wants', icon: ShoppingBag, label: 'Wants Account' },
  { href: '/savings', icon: PiggyBank, label: 'Savings Account' },
  { href: '/investments', icon: CandlestickChart, label: 'Investments' },
  { href: '/visualizer', icon: Bot, label: 'Visualizer AI' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [currentDate, setCurrentDate] = React.useState('');

  React.useEffect(() => {
    setCurrentDate(format(new Date(), 'MMMM dd, yyyy'));
  }, []);


  const NavContent = () => (
    <>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary/20 text-primary p-2 rounded-lg">
            <Wallet className="h-6 w-6" />
          </div>
          <span className="font-bold text-lg text-foreground">Savvy Saver</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="text-xs text-muted-foreground p-4">
          Version 1.0.0
        </div>
      </SidebarFooter>
    </>
  );

  return (
    <SidebarProvider>
      <div className="relative min-h-screen">
        <Sidebar>
          <NavContent />
        </Sidebar>
        <SidebarInset>
           <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-8">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="sm:max-w-xs p-0 md:hidden">
                <nav className="grid gap-6 text-lg font-medium">
                  <NavContent />
                </nav>
              </SheetContent>
            </Sheet>
            
            <Link href="/" className="flex items-center gap-2 font-bold text-lg md:hidden">
                <Wallet className="h-6 w-6 text-primary" />
                <span>Savvy Saver</span>
            </Link>

            <div className="ml-auto flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                  {currentDate}
              </div>
              {/* Future: Theme toggle button can go here */}
            </div>
          </header>
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </SidebarInset>
        <AddTransactionModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
        <Button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl"
          size="icon"
        >
          <Plus className="h-7 w-7" />
          <span className="sr-only">Add Transaction</span>
        </Button>
      </div>
    </SidebarProvider>
  );
}
