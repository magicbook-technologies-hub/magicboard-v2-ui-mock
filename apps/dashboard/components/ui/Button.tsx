import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
};

export function Button({
  className,
  variant = 'secondary',
  size = 'md',
  children,
  ...props
}: Props) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:opacity-50',
        variant === 'primary' && 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-sm',
        variant === 'secondary' && 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200',
        variant === 'ghost' && 'bg-transparent text-zinc-600 hover:bg-zinc-100',
        variant === 'outline' && 'border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50',
        size === 'sm' && 'h-8 rounded-lg px-3 text-xs',
        size === 'md' && 'h-9 rounded-xl px-3.5 text-sm',
        size === 'lg' && 'h-11 rounded-xl px-5 text-sm',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
