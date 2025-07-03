
'use client';

import * as React from 'react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PanelLeft } from 'lucide-react';

export const SidebarContext = React.createContext({
  isOpen: true,
  setIsOpen: (open: boolean) => {},
});

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(true);
  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => React.useContext(SidebarContext);

export const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(true);
  
  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
        <aside className={cn(
            "hidden md:flex flex-col border-r transition-all duration-300 ease-in-out",
            isOpen ? "w-64" : "w-20"
        )}>
            {children}
        </aside>

        {/* Mobile Sidebar */}
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <PanelLeft className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
                <div className="flex flex-col h-full">
                    {children}
                </div>
            </SheetContent>
        </Sheet>

    </SidebarContext.Provider>
  )
};


export const SidebarTrigger = ({ className, ...props }: React.ComponentProps<typeof Button>) => {
    return (
        <Button variant="ghost" size="icon" className={cn("md:hidden", className)} {...props}>
             <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
        </Button>
    )
}

export const SidebarHeader = ({ children }: { children: React.ReactNode }) => {
  const { isOpen } = useSidebar();
  return (
    <div className="flex h-16 items-center border-b px-6">
        <div className={cn(isOpen ? 'opacity-100' : 'opacity-0 md:opacity-100')}>
            {children}
        </div>
    </div>
  );
};

export const SidebarContent = ({ children }: { children: React.ReactNode }) => (
  <nav className="flex-1 space-y-2 px-4 py-6">{children}</nav>
);

export const SidebarFooter = ({ children }: { children: React.ReactNode }) => (
    <div className="mt-auto border-t p-4">{children}</div>
);

interface SidebarItemProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
}

export const SidebarItem = ({ href, icon, label, isActive }: SidebarItemProps) => {
    const { isOpen } = useSidebar();
    return (
        <Link href={href}>
            <div className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-accent",
                isActive && "bg-accent text-foreground",
                !isOpen && "justify-center"
            )}>
                {icon}
                <span className={cn("transition-opacity", isOpen ? "opacity-100" : "opacity-0 md:hidden")}>{label}</span>
            </div>
        </Link>
    )
}
