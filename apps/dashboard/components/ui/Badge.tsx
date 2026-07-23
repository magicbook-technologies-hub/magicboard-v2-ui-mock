import { cn } from '@/lib/utils';
import type { HTMLAttributes, ReactNode } from 'react';

export function Badge({
  children,
  className,
  tone = 'neutral',
}: {
  children: ReactNode;
  className?: string;
  tone?: 'neutral' | 'green' | 'indigo' | 'soft';
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium',
        tone === 'neutral' && 'bg-white/90 text-zinc-700 border border-white/40',
        tone === 'green' && 'bg-emerald-500/90 text-white',
        tone === 'indigo' && 'bg-[var(--primary-soft)] text-[var(--primary)]',
        tone === 'soft' && 'bg-zinc-100 text-zinc-600',
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Card({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-zinc-200/80 bg-white shadow-sm',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
