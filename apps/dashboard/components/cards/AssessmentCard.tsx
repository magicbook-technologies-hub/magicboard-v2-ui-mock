'use client';

import { CheckCircle2, ClipboardList, HelpCircle } from 'lucide-react';
import type { AssessmentItem } from '@/data/lesson';
import { Card } from '@/components/ui/Badge';
import { SectionHeader } from '@/components/lesson/SectionHeader';
import { useI18n } from '@/lib/i18n';

const KIND_ICON = {
  quiz: HelpCircle,
  diagnostic: ClipboardList,
  final: CheckCircle2,
};

export function AssessmentCards({
  assessments,
  onQuiz,
}: {
  assessments: AssessmentItem[];
  onQuiz?: () => void;
}) {
  const { t } = useI18n();

  return (
    <section id="assessments" className="flex-1">
      <SectionHeader title={t('assessments')} />
      <div className="space-y-2.5">
        {assessments.map((a) => {
          const Icon = KIND_ICON[a.kind];
          return (
            <Card
              key={a.id}
              className="p-3.5 transition hover:border-[var(--ring)] cursor-pointer"
              onClick={a.kind === 'quiz' ? onQuiz : undefined}
            >
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                  <Icon size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[13px] font-semibold text-zinc-900">{a.title}</h3>
                  <p className="mt-1 text-[12px] text-zinc-500 line-clamp-2">{a.meta}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
