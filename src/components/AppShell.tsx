
'use client';

import {
  User,
  LineChart,
  BarChart,
  Mail,
  Phone,
  MessageSquare,
  Ticket,
  Plus,
  PanelLeft,
  ChevronsLeft,
  ChevronsRight,
  Download,
  FileText,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { Button, buttonVariants } from './ui/button';
import { AddTransactionModal } from './transactions/AddTransactionModal';
import { MobileNav } from './MobileNav';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from './ui/badge';
import { ThemeToggle } from './ThemeToggle';

const navItems = {
  profile: [
    { href: '/', icon: User, label: 'Profile' },
    { href: '/report', icon: LineChart, label: 'Report' },
    { href: '/graphs', icon: BarChart, label: 'Graphs' },
    { href: '/texts', icon: FileText, label: 'Texts' },
  ],
  channels: [
    { href: '/email', icon: Mail, label: 'Email' },
    { href: '/phone', icon: Phone, label: 'Phone Call' },
    { href: '/chat', icon: MessageSquare, label: 'Online Chat' },
  ],
  tickets: [
    { href: '/created', icon: Ticket, label: 'Created' },
    { href: '/open', icon: Ticket, label: 'Open' },
    { href: '/responded', icon: Ticket, label: 'Responded' },
    { href: '/solved', icon: Ticket, label: 'Solved', badge: 'new' },
    { href: '/other', icon: Ticket, label: 'Other' },
    { href: '/deleted', icon: Ticket, label: 'Deleted' },
  ],
};

const NavItem = ({ item, isExpanded }: { item: any, isExpanded: boolean }) => {
    const pathname = usePathname();
    const isActive = pathname === item.href;
    return (
        <Link
            href={item.href}
            className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-muted",
                isActive && "bg-primary/20 text-primary",
                !isExpanded && "justify-center"
            )}
        >
            <item.icon className="h-4 w-4" />
            <span className={cn("transition-opacity duration-200 text-sm", isExpanded ? "opacity-100" : "opacity-0 w-0")}>{item.label}</span>
            {item.badge && isExpanded && <Badge variant={item.badge === 'new' ? 'default': 'secondary'} className="ml-auto">{item.badge}</Badge>}
        </Link>
    );
};

const NavSection = ({ title, items, isExpanded }: { title: string, items: any[], isExpanded: boolean}) => (
    <div>
        <h2 className={cn("mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider", isExpanded ? "opacity-100" : "opacity-0 h-0")}>{title}</h2>
        <div className="space-y-1">
            {items.map((item) => <NavItem key={item.href} item={item} isExpanded={isExpanded} />)}
        </div>
    </div>
);


export function AppShell({ children }: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = React.useState(true);
  const isMobile = useIsMobile();
  
  const sidebarContent = (
    <div className="flex flex-col h-full bg-card/50">
        <div className="flex h-16 items-center border-b px-4 shrink-0">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            CRM Dashboard
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-6">
          <NavSection title="Profile" items={navItems.profile} isExpanded={isSidebarExpanded} />
          <NavSection title="Channels" items={navItems.channels} isExpanded={isSidebarExpanded} />
          <NavSection title="Tickets Status" items={navItems.tickets} isExpanded={isSidebarExpanded} />
        </div>
        <div className="mt-auto p-4 border-t space-y-4">
            <div className={cn("p-3 rounded-lg bg-muted", isSidebarExpanded ? 'block' : 'hidden')}>
                <div className="flex justify-between items-center text-sm">
                    <p className="font-semibold">Full Tickets Report</p>
                    <Badge variant="destructive">180</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Download report</p>
            </div>
             <Link href="#" className={cn(buttonVariants({ variant: "gradient" }), "w-full", !isSidebarExpanded && 'px-0 justify-center')}>
                <Download className={cn("h-4 w-4", isSidebarExpanded && 'mr-2')} />
                <span className={cn(isSidebarExpanded ? 'opacity-100' : 'opacity-0 w-0', 'transition-opacity')}>Download</span>
            </Link>
        </div>
    </div>
  );

  React.useEffect(() => {
    if(isMobile) setIsSidebarExpanded(false);
    else setIsSidebarExpanded(true);
  }, [isMobile]);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
        {!isMobile && (
            <aside className={cn("hidden md:flex flex-col border-r transition-all duration-300 ease-in-out", isSidebarExpanded ? "w-64" : "w-20")}>
                {sidebarContent}
                 <Button variant="ghost" onClick={() => setIsSidebarExpanded(!isSidebarExpanded)} className="absolute top-14 -right-5 h-10 w-10 rounded-full border bg-card">
                    {isSidebarExpanded ? <ChevronsLeft className="h-5 w-5" /> : <ChevronsRight className="h-5 w-5" />}
                </Button>
            </aside>
        )}
      
      <div className="flex flex-col flex-1 min-w-0">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 md:px-8 backdrop-blur-xl">
            <div className="flex items-center gap-4">
                {isMobile && (
                    <Sheet open={isSidebarExpanded} onOpenChange={setIsSidebarExpanded}>
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
            </div>

            <div className="flex items-center gap-2">
                <ThemeToggle />
            </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      <MobileNav navItems={[...navItems.profile, ...navItems.channels, ...navItems.tickets]} />
      
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
