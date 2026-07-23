'use client';

import { Beaker, Lightbulb, Rocket, Users } from 'lucide-react';
import type { ActivityItem } from '@/data/lesson';
import { Card } from '@/components/ui/Badge';
import { SectionHeader } from '@/components/lesson/SectionHeader';
import { useI18n } from '@/lib/i18n';

const KIND_ICON = {
  experiment: Beaker,
  challenge: Lightbulb,
  project: Rocket,
};

export function ActivityCards({ activities }: { activities: ActivityItem[] }) {
  const { t } = useI18n();

  return (
    <section id="activities" className="flex-1">
      <SectionHeader title={t('featuredActivities')} />
      <div className="space-y-2.5">
        {activities.map((a) => {
          const Icon = KIND_ICON[a.kind];
          return (
            <Card key={a.id} className="p-3.5 transition hover:border-[var(--ring)]">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <Icon size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-[13px] font-semibold text-zinc-900">{a.name}</h3>
                    <span className="shrink-0 text-[11px] text-zinc-400">{a.duration}</span>
                  </div>
                  <p className="mt-1 text-[12px] text-zinc-500 line-clamp-2">{a.description}</p>
                  <p className="mt-2 inline-flex items-center gap-1 text-[11px] text-zinc-400">
                    <Users size={12} /> {a.grouping}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
