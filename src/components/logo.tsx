import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-md border-2 border-dashed border-current p-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground',
        className
      )}
    >
      Logo
    </div>
  );
}
