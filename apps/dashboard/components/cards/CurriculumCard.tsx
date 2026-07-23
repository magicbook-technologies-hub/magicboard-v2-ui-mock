'use client';

import { Info } from 'lucide-react';
import { Card } from '@/components/ui/Badge';
import { SectionHeader } from '@/components/lesson/SectionHeader';
import { useI18n } from '@/lib/i18n';

export function CurriculumCard({
  skills,
  competencies,
  knowledgeObjects,
  expectedLearning,
}: {
  skills: { code: string | null; description: string }[];
  competencies: string[];
  knowledgeObjects: string[];
  expectedLearning: string[];
}) {
  const { t } = useI18n();

  return (
    <section id="curriculum">
      <SectionHeader
        title={t('bnccAlignment')}
        action={
          <button className="text-[12px] font-medium text-[var(--primary)] hover:underline inline-flex items-center gap-1">
            <Info size={12} />
            {t('viewFullReport')}
          </button>
        }
      />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Card className="p-4">
          <h3 className="text-xs font-semibold text-zinc-800 mb-3">{t('skillsBncc')}</h3>
          <ul className="space-y-3">
            {skills.slice(0, 2).map((s, i) => (
              <li key={i}>
                {s.code && (
                  <span className="inline-block rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 mb-1">
                    {s.code}
                  </span>
                )}
                <p className="text-[13px] leading-relaxed text-zinc-600">{s.description}</p>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-4">
          <h3 className="text-xs font-semibold text-zinc-800 mb-3">{t('generalCompetencies')}</h3>
          <ol className="space-y-2 text-[13px] text-zinc-600">
            {competencies.map((c, i) => (
              <li key={c} className="flex gap-2">
                <span className="font-semibold text-[var(--primary)]">{i + 1}.</span>
                <span className="leading-relaxed">{c}</span>
              </li>
            ))}
          </ol>
        </Card>
        <Card className="p-4">
          <h3 className="text-xs font-semibold text-zinc-800 mb-3">{t('knowledgeObjectsCol')}</h3>
          <ul className="space-y-2 text-[13px] text-zinc-600">
            {knowledgeObjects.map((k) => (
              <li key={k} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                <span className="leading-relaxed">{k}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-4">
          <h3 className="text-xs font-semibold text-zinc-800 mb-3">{t('expectedOutcomesCol')}</h3>
          <ul className="space-y-2 text-[13px] text-zinc-600">
            {expectedLearning.map((e) => (
              <li key={e} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                <span className="leading-relaxed">{e}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  );
}
