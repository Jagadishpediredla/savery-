
'use client';

import {
  Bot,
  CandlestickChart,
  Home,
  Plus,
  Settings,
  Wallet,
  PanelLeft,
  Bell,
  UserCircle,
  Search,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { Button } from './ui/button';
import { AddTransactionModal } from './transactions/AddTransactionModal';
import { MobileNav } from './MobileNav';
import { ThemeToggle } from './ThemeToggle';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';


const navItems = [
  { href: '/', icon: Home, label: 'Dashboard' },
  { href: '/accounts', icon: Wallet, label: 'Accounts' },
  { href: '/investments', icon: CandlestickChart, label: 'Investments' },
  { href: '/visualizer', icon: Bot, label: 'Visualizer' },
];

const NavItem = ({ item, isExpanded }: { item: typeof navItems[0], isExpanded: boolean }) => {
    const pathname = usePathname();
    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
    return (
        <Link
            href={item.href}
            className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-accent",
                isActive && "bg-accent text-foreground",
                !isExpanded && "justify-center"
            )}
        >
            <item.icon className="h-5 w-5" />
            <span className={cn("transition-all duration-200", isExpanded ? "opacity-100" : "opacity-0 w-0")}>{item.label}</span>
        </Link>
    );
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = React.useState(true);
  const isMobile = useIsMobile();
  
  const sidebarContent = (
    <div className="flex flex-col h-full">
        <div className="flex h-16 items-center border-b px-4 shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary/20 text-primary p-2 rounded-lg">
                <Wallet className="h-6 w-6" />
            </div>
            <span className={cn("font-bold text-lg transition-all", isSidebarExpanded ? "opacity-100" : "opacity-0 w-0")}>FinanceFlow</span>
          </Link>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-2">
          {navItems.map((item) => (
            <NavItem key={item.href} item={item} isExpanded={isSidebarExpanded} />
          ))}
        </nav>
        <div className="mt-auto p-2 border-t">
            <Button variant="ghost" onClick={() => setIsSidebarExpanded(!isSidebarExpanded)} className="w-full justify-start">
                {isSidebarExpanded ? <ChevronsLeft className="mr-2 h-4 w-4" /> : <ChevronsRight className="mr-2 h-4 w-4" />}
                <span className={cn(isSidebarExpanded ? 'opacity-100' : 'opacity-0', !isSidebarExpanded && 'hidden')}>Collapse</span>
            </Button>
        </div>
    </div>
  );

  // Use a client-side effect to prevent hydration mismatch for sidebar state
  React.useEffect(() => {
    if(isMobile) setIsSidebarExpanded(true);
  }, [isMobile]);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
        {/* Desktop Sidebar */}
        {!isMobile && (
            <aside className={cn("hidden md:flex flex-col border-r transition-all duration-300 ease-in-out", isSidebarExpanded ? "w-64" : "w-20")}>
                {sidebarContent}
            </aside>
        )}
      
      <div className="flex flex-col flex-1 min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background/60 px-4 md:px-8 backdrop-blur-xl">
            <div className="flex items-center gap-4">
                {isMobile && (
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <PanelLeft className="h-5 w-5" />
                                <span className="sr-only">Toggle Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64 p-0">
                           {sidebarContent}
                        </SheetContent>
                    </Sheet>
                )}
                 <h1 className="text-xl font-semibold hidden md:block">
                    {navItems.find(item => item.href === pathname)?.label || 'FinanceFlow'}
                </h1>
            </div>

             <div className="w-full max-w-sm lg:max-w-md hidden md:block">
                <form>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search transactions, goals..." className="pl-9 bg-card/60 backdrop-blur-sm border-white/10"/>
                    </div>
                </form>
            </div>

            <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                </Button>
                 <Link href="/settings">
                    <Button variant={pathname === '/settings' ? "secondary" : "ghost"} size="icon" className="rounded-full">
                        <Settings className="h-5 w-5" />
                        <span className="sr-only">Settings</span>
                    </Button>
                </Link>
                 <Button variant="ghost" size="icon" className="rounded-full">
                    <UserCircle className="h-5 w-5" />
                    <span className="sr-only">Profile</span>
                </Button>
            </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
          {children}
        </main>
      </div>

      <MobileNav navItems={navItems} />
      
      <Button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-20 right-6 h-14 w-14 rounded-full shadow-2xl z-40 md:hidden"
        size="icon"
        variant="gradient"
      >
        <Plus className="h-7 w-7" />
        <span className="sr-only">Add Transaction</span>
      </Button>
      <AddTransactionModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
      
    </div>
  );
}
