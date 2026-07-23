'use client';

import { useEffect, useState } from 'react';
import { getLesson, listLessons, type HubLesson } from '@/lib/api';
import { LessonDashboard } from '@/components/layout/LessonDashboard';
import { useI18n } from '@/lib/i18n';

export function LessonPageClient({ id }: { id: string }) {
  const { t } = useI18n();
  const [lesson, setLesson] = useState<HubLesson | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getLesson(id);
        if (!cancelled) setLesson(data);
      } catch (e1) {
        try {
          const { lessons } = await listLessons();
          if (!lessons[0]) throw e1;
          const data = await getLesson(lessons[0].id);
          if (!cancelled) {
            setLesson(data);
            if (lessons[0].id !== id) {
              window.history.replaceState(null, '', `/lessons/${lessons[0].id}`);
            }
          }
        } catch (e2) {
          if (!cancelled) setError(String((e2 as Error).message || e2));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center p-6">
        <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
          <p className="font-semibold">API error</p>
          <p className="mt-2">{error}</p>
          <p className="mt-3 text-zinc-600">
            Start Express: <code className="rounded bg-white px-1">npm run dev:api</code> on :4100
          </p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-zinc-500">
        {t('loading')}
      </div>
    );
  }

  return <LessonDashboard initial={lesson} />;
}
