import { SidebarLayout } from '@/components/layout/sidebar-layout';
import { ProgressProvider } from '@/context/ProgressContext';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProgressProvider>
      <SidebarLayout>{children}</SidebarLayout>
    </ProgressProvider>
  );
}
