'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  BookCopy,
  Globe,
  Home,
  Lock,
  LogOut,
  NotebookText,
  User,
  Sparkles,
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
import { PlaceHolderImages } from '@/lib/placeholder-images';

const navItems = [
  { id: 'dashboard', href: '/dashboard', label: 'Dashboard', icon: Home },
  { id: 'profile', href: '/profile', label: 'Profile', icon: User },
  { id: 'guide', href: '/guide', label: 'Career Guide', icon: NotebookText },
  { id: 'assessment', href: '/assessment', label: 'Assessment', icon: BarChart3 },
  { id: 'prediction', href: '/prediction', label: 'Migration Prediction', icon: Sparkles },
  { id: 'language-resources', href: '/language-resources', label: 'Language Resources', icon: BookCopy },
  { id: 'jobs', href: '/jobs', label: 'Global Opportunities', icon: Globe },
];

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isStepUnlocked } = useProgress();

  const getPageTitle = () => {
    const currentPath = pathname.split('?')[0];
    if (currentPath === '/dashboard') {
      return 'Dashboard';
    }
    const activeItem = navItems.find((item) => currentPath === item.href);
    if (activeItem) {
      return activeItem.label;
    }
    if (currentPath.startsWith('/guide/')) return 'Career Guide';
    return 'My Migration Buddy';
  };
  
  const avatarPlaceholder = PlaceHolderImages.find((p) => p.id === 'avatar');

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo className="h-9 w-20" />
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
                src={avatarPlaceholder?.imageUrl || "https://picsum.photos/seed/avatar/40/40"}
                data-ai-hint={avatarPlaceholder?.imageHint || "nurse portrait"}
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
        <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur-sm">
          <div className="flex h-1.5 w-full">
            <div className="w-1/3 bg-black" />
            <div className="w-1/3 bg-red-600" />
            <div className="w-1/3 bg-yellow-400" />
          </div>
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="md:hidden" />
              <h1 className="font-headline text-xl font-semibold">
                {getPageTitle()}
              </h1>
            </div>
            <Button variant="ghost" size="icon" aria-label="Log out">
              <LogOut />
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
