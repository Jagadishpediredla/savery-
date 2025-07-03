'use client';

import {
  Bot,
  CandlestickChart,
  Home,
  Menu,
  Plus,
  Settings,
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
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { AddTransactionModal } from './transactions/AddTransactionModal';

const navItems = [
  { href: '/', icon: Home, label: 'Dashboard' },
  { href: '/investments', icon: CandlestickChart, label: 'Investments' },
  { href: '/accounts', icon: Wallet, label: 'Accounts' },
  { href: '/visualizer', icon: Bot, label: 'Visualizer AI' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

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
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="sm:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="sm:max-w-xs p-0">
                <nav className="grid gap-6 text-lg font-medium">
                  <NavContent />
                </nav>
              </SheetContent>
            </Sheet>
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
                <Wallet className="h-6 w-6 text-primary" />
                <span>Savvy Saver</span>
            </Link>
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
