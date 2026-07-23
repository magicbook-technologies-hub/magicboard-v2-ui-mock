'use client';

import { motion } from 'framer-motion';
import {
  BookOpen,
  ClipboardCheck,
  FlaskConical,
  Sparkles,
  Target,
} from 'lucide-react';
import { Card } from '@/components/ui/Badge';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const ICONS = [Target, BookOpen, FlaskConical, ClipboardCheck, Sparkles];
const COLORS = [
  'bg-violet-50 text-violet-600',
  'bg-sky-50 text-sky-600',
  'bg-emerald-50 text-emerald-600',
  'bg-orange-50 text-orange-600',
  'bg-indigo-50 text-indigo-600',
];

export function SummaryCards({
  objectives,
  content,
  activities,
  assessments,
  ai,
  onJump,
}: {
  objectives: number;
  content: number;
  activities: number;
  assessments: number;
  ai: number;
  onJump: (id: string) => void;
}) {
  const { t } = useI18n();
  const items = [
    { label: t('summaryObjectives'), value: String(objectives), sub: '', jump: 'objectives' },
    {
      label: t('summaryContent'),
      value: String(content),
      sub: t('sections'),
      jump: 'content',
    },
    { label: t('summaryActivities'), value: String(activities), sub: '', jump: 'activities' },
    { label: t('summaryAssessments'), value: String(assessments), sub: '', jump: 'assessments' },
    { label: t('summaryAi'), value: String(ai), sub: '', jump: 'ai' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      {items.map((item, i) => {
        const Icon = ICONS[i];
        return (
          <motion.div key={item.label} whileHover={{ y: -2 }}>
            <Card className="p-4 transition hover:border-[var(--ring)] cursor-pointer" onClick={() => onJump(item.jump)}>
              <div className={cn('mb-3 flex h-9 w-9 items-center justify-center rounded-xl', COLORS[i])}>
                <Icon size={16} />
              </div>
              <p className="text-2xl font-semibold tracking-tight text-zinc-900">
                {item.value}
                {item.sub ? (
                  <span className="ml-1 text-xs font-normal text-zinc-400">{item.sub}</span>
                ) : null}
              </p>
              <p className="mt-0.5 text-[12px] text-zinc-500">{item.label}</p>
              <p className="mt-2 text-[11px] font-medium text-[var(--primary)]">{t('seeDetails')}</p>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
