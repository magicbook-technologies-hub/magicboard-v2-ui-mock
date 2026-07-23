'use client';

import { CircularMetric } from '@/components/charts/CircularMetric';
import { SectionHeader } from '@/components/lesson/SectionHeader';
import { useI18n } from '@/lib/i18n';
import type { DashboardView } from '@/data/lesson';

export function PedagogicalReport({ metrics }: { metrics: DashboardView['metrics'] }) {
  const { t } = useI18n();

  const items = [
    { value: metrics.bnccCoverage, label: t('bnccCoverage'), color: '#6366f1' },
    {
      value: (metrics.competenciesDone / metrics.competenciesTotal) * 100,
      label: t('competencies'),
      sub: `${metrics.competenciesDone}/${metrics.competenciesTotal}`,
      color: '#8b5cf6',
    },
    {
      value: 100,
      label: t('objectivesAchieved'),
      sub: `${metrics.objectivesDone}/${metrics.objectivesTotal}`,
      color: '#10b981',
    },
    {
      value: 100,
      label: t('activitiesPlanned'),
      sub: String(metrics.activities),
      color: '#3b82f6',
    },
    {
      value: 100,
      label: t('assessmentsPlanned'),
      sub: String(metrics.assessments),
      color: '#f59e0b',
    },
    {
      value: 100,
      label: t('sourcesUsed'),
      sub: String(metrics.sources),
      color: '#ef4444',
    },
  ];

  return (
    <section id="report">
      <SectionHeader title={t('pedagogicalReport')} />
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
          {items.map((item) => (
            <CircularMetric
              key={item.label}
              value={item.value}
              label={item.label}
              sub={item.sub}
              color={item.color}
              size={68}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
