'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Briefcase,
  Home,
  Lock,
  LogOut,
  NotebookText,
  User,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { useProgress } from '@/context/ProgressContext';

const navItems = [
  { id: 'dashboard', href: '/dashboard', label: 'Dashboard', icon: Home },
  { id: 'profile', href: '/profile', label: 'Profile', icon: User },
  { id: 'guide', href: '/guide', label: 'Career Guide', icon: NotebookText },
  { id: 'assessment', href: '/assessment', label: 'Assessment', icon: BarChart3 },
  { id: 'jobs', href: '/jobs', label: 'Job Listings', icon: Briefcase },
];

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isStepUnlocked } = useProgress();

  const getPageTitle = () => {
    const currentPath = pathname.split('?')[0];
    const activeItem = navItems.find((item) => currentPath === item.href);
    if (activeItem) {
      return activeItem.label;
    }
    if (currentPath.startsWith('/guide/')) return 'Career Guide';
    return 'GTS Migration Buddy';
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="rounded-lg bg-primary p-1.5">
                <Logo />
              </div>
              <h2 className="text-xl font-semibold text-sidebar-foreground">
                GTS Buddy
              </h2>
            </Link>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => {
              const unlocked = isStepUnlocked(item.id);
              const Icon = unlocked ? item.icon : Lock;

              return(
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href)}
                  tooltip={unlocked ? item.label : 'Locked'}
                  disabled={!unlocked}
                  className={!unlocked ? 'cursor-not-allowed text-sidebar-foreground/50 hover:bg-transparent hover:text-sidebar-foreground/50' : ''}
                >
                  <Link href={unlocked ? item.href : '#'}>
                    <Icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )})}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <Link
            href="/profile"
            className="flex items-center gap-3 rounded-md p-2 hover:bg-sidebar-accent"
          >
            <Avatar>
              <AvatarImage
                src="https://picsum.photos/seed/avatar/40/40"
                data-ai-hint="nurse portrait"
              />
              <AvatarFallback>N</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden text-sm">
              <span className="truncate font-semibold text-sidebar-foreground">
                Nurse Alex
              </span>
              <span className="truncate text-sidebar-foreground/70">
                alex.doe@example.com
              </span>
            </div>
          </Link>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
            <h1 className="font-headline text-xl font-semibold">
              {getPageTitle()}
            </h1>
          </div>
          <Button variant="ghost" size="icon" aria-label="Log out">
            <LogOut />
          </Button>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
