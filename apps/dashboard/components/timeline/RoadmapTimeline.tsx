'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { RoadmapStep } from '@/data/lesson';
import { SectionHeader } from '@/components/lesson/SectionHeader';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export function RoadmapTimeline({
  steps,
  completedIds = [],
  currentId = null,
  onToggle,
}: {
  steps: RoadmapStep[];
  completedIds?: string[];
  currentId?: string | null;
  onToggle?: (id: string) => void;
}) {
  const { t } = useI18n();
  const done = new Set(completedIds);

  return (
    <section id="roadmap">
      <SectionHeader title={t('lessonRoadmap')} />
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm overflow-x-auto scrollbar-thin">
        <div className="relative flex min-w-[720px] items-start justify-between px-2">
          <div className="absolute left-8 right-8 top-[18px] h-px bg-zinc-200" />
          {steps.map((step) => {
            const isDone = done.has(step.id);
            const isCurrent = currentId === step.id && !isDone;
            return (
              <motion.button
                key={step.id}
                type="button"
                whileHover={{ y: -4 }}
                onClick={() => onToggle?.(step.id)}
                className="relative z-10 flex w-[88px] flex-col items-center text-center"
                aria-pressed={isDone}
                title={step.id}
              >
                <div
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-semibold text-white shadow-sm ring-4 ring-white',
                    isCurrent && 'ring-[var(--ring)]',
                  )}
                  style={{ background: isDone ? '#22c55e' : step.color }}
                >
                  {isDone ? <Check size={14} /> : step.n}
                </div>
                <p className="mt-2 text-[12px] font-semibold text-zinc-800">
                  {t(`roadmapSteps.${step.key}`)}
                </p>
                <p className="mt-0.5 text-[10px] text-zinc-400">{step.duration}</p>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
