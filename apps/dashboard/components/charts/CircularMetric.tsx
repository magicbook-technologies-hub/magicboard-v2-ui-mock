'use client';

import { cn } from '@/lib/utils';

export function CircularMetric({
  value,
  label,
  sub,
  size = 72,
  color = '#6366f1',
}: {
  value: number;
  label: string;
  sub?: string;
  size?: number;
  color?: string;
}) {
  const r = (size - 10) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, value));
  const offset = c - (pct / 100) * c;

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} stroke="#f4f4f5" strokeWidth="6" fill="none" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={color}
            strokeWidth="6"
            fill="none"
            strokeDasharray={c}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <span
          className={cn(
            'absolute inset-0 flex items-center justify-center font-semibold text-zinc-800',
            size > 80 ? 'text-lg' : 'text-sm',
          )}
        >
          {Number.isInteger(value) && value <= 100 && !sub?.includes('/')
            ? `${Math.round(value)}%`
            : sub || `${Math.round(value)}%`}
        </span>
      </div>
      <p className="text-[11px] font-medium text-zinc-500 leading-tight max-w-[88px]">{label}</p>
    </div>
  );
}

export function ProgressWidget({
  pct,
  done,
  total,
  title,
  linkLabel,
}: {
  pct: number;
  done: number;
  total: number;
  title: string;
  linkLabel: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold text-zinc-800 mb-3">{title}</p>
      <div className="flex items-center gap-3">
        <CircularMetric value={pct} label="" size={56} />
        <div>
          <p className="text-lg font-semibold text-zinc-900">{pct}%</p>
          <p className="text-[11px] text-zinc-500">
            {done} / {total}
          </p>
        </div>
      </div>
      <button className="mt-3 text-[11px] font-medium text-[var(--primary)] hover:underline">
        {linkLabel}
      </button>
    </div>
  );
}

export function LessonTimeWidget({
  total,
  content,
  activities,
  assessments,
  title,
  totalLabel,
  labels,
}: {
  total: number;
  content: number;
  activities: number;
  assessments: number;
  title: string;
  totalLabel: string;
  labels: { content: string; activities: string; assessments: string };
}) {
  const sum = content + activities + assessments || 1;
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold text-zinc-800 mb-1">{title}</p>
      <p className="text-sm font-semibold text-zinc-900">
        {total} min <span className="font-normal text-zinc-500 text-xs">{totalLabel}</span>
      </p>
      <div className="mt-3 flex h-2.5 overflow-hidden rounded-full bg-zinc-100">
        <div className="bg-violet-400" style={{ width: `${(content / sum) * 100}%` }} />
        <div className="bg-indigo-400" style={{ width: `${(activities / sum) * 100}%` }} />
        <div className="bg-amber-400" style={{ width: `${(assessments / sum) * 100}%` }} />
      </div>
      <ul className="mt-3 space-y-1.5 text-[11px] text-zinc-500">
        <li className="flex justify-between">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-violet-400" /> {labels.content}
          </span>
          <span>{content} min</span>
        </li>
        <li className="flex justify-between">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-indigo-400" /> {labels.activities}
          </span>
          <span>{activities} min</span>
        </li>
        <li className="flex justify-between">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400" /> {labels.assessments}
          </span>
          <span>{assessments} min</span>
        </li>
      </ul>
    </div>
  );
}
