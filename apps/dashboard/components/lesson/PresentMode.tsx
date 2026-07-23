'use client';

import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import type { HubLesson } from '@/lib/api';
import { useI18n } from '@/lib/i18n';

export function PresentMode({
  lesson,
  onClose,
  onQuiz,
}: {
  lesson: HubLesson;
  onClose: () => void;
  onQuiz?: () => void;
}) {
  const { t } = useI18n();
  const plan = lesson.lessonPlan;
  const slides = useMemo(
    () => [
      { title: plan.title.content, body: `${plan.lessonInfo.subject} · ${plan.lessonInfo.gradeLabel}` },
      { title: plan.objective.title, body: plan.objective.content.goals.join('\n') },
      { title: plan.starter.title, body: plan.starter.teacherScript },
      { title: plan.contentDiscovery.title, body: plan.contentDiscovery.body },
      ...plan.activities.content.map((a) => ({ title: a.name, body: a.description })),
      {
        title: plan.assessment.title,
        body: plan.assessment.content.quickChecks.map((q) => `${q.id}. ${q.prompt}`).join('\n'),
      },
    ],
    [plan],
  );
  const [i, setI] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setI((x) => Math.min(slides.length - 1, x + 1));
      if (e.key === 'ArrowLeft') setI((x) => Math.max(0, x - 1));
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [slides.length, onClose]);

  const slide = slides[i];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-zinc-950 text-white">
      <div className="flex items-center justify-between px-6 py-4 text-sm text-white/70">
        <button onClick={onClose} className="inline-flex items-center gap-1 hover:text-white">
          <X size={16} /> {t('exitPresent')}
        </button>
        <span>
          {i + 1} / {slides.length}
        </span>
        {onQuiz ? (
          <button onClick={onQuiz} className="hover:text-white">
            Quiz
          </button>
        ) : (
          <span className="text-white/40">{t('presentMode')}</span>
        )}
      </div>
      <div className="flex flex-1 items-center justify-center px-10">
        <div className="max-w-4xl w-full">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">{slide.title}</h1>
          <p className="mt-8 text-xl md:text-2xl text-white/80 whitespace-pre-wrap leading-relaxed">
            {slide.body}
          </p>
        </div>
      </div>
      <div className="flex justify-center gap-3 pb-8">
        <button
          onClick={() => setI((x) => Math.max(0, x - 1))}
          className="rounded-full border border-white/20 px-5 py-2 text-sm"
        >
          {t('prev')}
        </button>
        <button
          onClick={() => setI((x) => Math.min(slides.length - 1, x + 1))}
          className="rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-medium"
        >
          {t('next')}
        </button>
      </div>
    </div>
  );
}
