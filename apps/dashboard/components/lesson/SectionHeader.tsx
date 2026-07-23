import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export function SectionHeader({
  title,
  action,
  className,
}: {
  title: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mb-4 flex items-center justify-between gap-3', className)}>
      <h2 className="text-base font-semibold tracking-tight text-zinc-900">{title}</h2>
      {action}
    </div>
  );
}
