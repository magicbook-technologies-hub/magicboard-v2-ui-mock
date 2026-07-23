'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { createLesson, listLessons, type LessonSummary } from '@/lib/api';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Badge';

export default function LessonsPage() {
  const { t, locale, setLocale } = useI18n();
  const [lessons, setLessons] = useState<LessonSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    listLessons()
      .then((d) => setLessons(d.lessons))
      .catch((e) => setError(String(e.message || e)))
      .finally(() => setLoading(false));
  }, []);

  async function onCreate() {
    setCreating(true);
    setError(null);
    try {
      const lesson = await createLesson({
        subject: 'Ciências',
        grade: 5,
        topic: 'Introdução à Fotossíntese',
        duration: 50,
        complexity: 'standard',
        teaching_method: 'inquiry-based learning',
        language: 'Portuguese',
        curriculum_framework: 'BNCC',
      });
      window.location.href = `/lessons/${lesson.id}`;
    } catch (e) {
      setError(String((e as Error).message));
      setCreating(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-lg font-semibold text-zinc-900">{t('brand')}</p>
            <p className="text-[11px] text-zinc-400">{t('brandBy')}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-zinc-200 p-0.5 text-[11px] font-medium">
              {(['pt', 'en'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLocale(l)}
                  className={`rounded-md px-2 py-1 uppercase ${
                    locale === l ? 'bg-[var(--primary-soft)] text-[var(--primary)]' : 'text-zinc-400'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <Button variant="primary" onClick={onCreate} disabled={creating}>
              <Plus size={14} />
              {t('createLesson')}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6 flex items-center gap-2">
          <Sparkles className="text-[var(--primary)]" size={18} />
          <h1 className="text-xl font-semibold tracking-tight">{t('libraryTitle')}</h1>
        </div>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        {loading ? (
          <p className="text-sm text-zinc-500">{t('loading')}</p>
        ) : lessons.length === 0 ? (
          <p className="text-sm text-zinc-500">{t('noLessons')}</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {lessons.map((l) => (
              <Link key={l.id} href={`/lessons/${l.id}`}>
                <Card className="p-5 transition hover:border-[var(--ring)] hover:shadow-md">
                  <p className="text-[11px] text-zinc-400">
                    {l.subject} · {l.gradeLabel} · {l.durationMinutes} min
                  </p>
                  <h2 className="mt-1 text-lg font-semibold tracking-tight text-zinc-900">{l.title}</h2>
                  <p className="mt-3 text-[12px] font-medium text-[var(--primary)]">{t('openLesson')} →</p>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
