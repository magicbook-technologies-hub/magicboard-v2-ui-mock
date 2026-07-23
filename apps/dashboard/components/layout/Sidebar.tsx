'use client';

import Link from 'next/link';
import {
  BookOpen,
  ClipboardList,
  FileText,
  FlaskConical,
  GraduationCap,
  Home,
  Layers,
  Library,
  Sparkles,
  StickyNote,
  Target,
  Trash2,
  Heart,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { LessonTimeWidget, ProgressWidget } from '@/components/charts/CircularMetric';

type NavId =
  | 'overview'
  | 'planning'
  | 'curriculum'
  | 'knowledge'
  | 'objectives'
  | 'outcomes'
  | 'roadmap'
  | 'content'
  | 'activities'
  | 'assessments'
  | 'ai'
  | 'materials'
  | 'notes'
  | 'report';

const NAV: {
  group?: string;
  items: { id: NavId; labelKey: string; icon: typeof Home }[];
}[] = [
  {
    items: [{ id: 'overview', labelKey: 'lessonOverview', icon: Home }],
  },
  {
    group: 'planning',
    items: [
      { id: 'planning', labelKey: 'pedagogicalPlanning', icon: ClipboardList },
      { id: 'curriculum', labelKey: 'curriculumAlignment', icon: GraduationCap },
      { id: 'knowledge', labelKey: 'knowledgeObjects', icon: Layers },
      { id: 'objectives', labelKey: 'learningObjectives', icon: Target },
      { id: 'outcomes', labelKey: 'expectedOutcomes', icon: Sparkles },
    ],
  },
  {
    group: 'lesson',
    items: [
      { id: 'roadmap', labelKey: 'lessonRoadmap', icon: BookOpen },
      { id: 'content', labelKey: 'completeContent', icon: FileText },
      { id: 'activities', labelKey: 'activities', icon: FlaskConical },
      { id: 'assessments', labelKey: 'assessments', icon: ClipboardList },
    ],
  },
  {
    group: 'resources',
    items: [
      { id: 'ai', labelKey: 'aiResources', icon: Sparkles },
      { id: 'materials', labelKey: 'supportingMaterials', icon: Library },
    ],
  },
  {
    group: 'teacherWorkspace',
    items: [
      { id: 'notes', labelKey: 'teacherNotes', icon: StickyNote },
      { id: 'report', labelKey: 'lessonReport', icon: FileText },
    ],
  },
];

export function Sidebar({
  active,
  onNavigate,
  progress,
  time,
}: {
  active: string;
  onNavigate: (id: string) => void;
  progress: { pct: number; done: number; total: number };
  time: { total: number; content: number; activities: number; assessments: number };
}) {
  const { t } = useI18n();

  return (
    <aside className="flex h-full w-[248px] shrink-0 flex-col border-r border-zinc-200/80 bg-white">
      <div className="px-5 pt-5 pb-4">
        <Link href="/lessons" className="block">
          <p className="text-lg font-semibold tracking-tight text-zinc-900">{t('brand')}</p>
          <p className="text-[11px] text-zinc-400">{t('brandBy')}</p>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 pb-3 space-y-4">
        {NAV.map((section, si) => (
          <div key={si}>
            {section.group && (
              <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-400">
                {t(section.group)}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => onNavigate(item.id)}
                      className={cn(
                        'flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-[13px] transition-colors',
                        isActive
                          ? 'bg-[var(--primary-soft)] font-medium text-[var(--primary)]'
                          : 'text-zinc-600 hover:bg-zinc-50',
                      )}
                    >
                      <Icon size={16} className={isActive ? 'text-[var(--primary)]' : 'text-zinc-400'} />
                      <span className="truncate">{t(item.labelKey)}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        <div>
          <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-400">
            {t('lessonLibrary')}
          </p>
          <ul className="space-y-0.5">
            {[
              { href: '/lessons', label: t('myLessons'), icon: Library },
              { href: '/lessons', label: t('favorites'), icon: Heart },
              { href: '/lessons', label: t('trash'), icon: Trash2 },
            ].map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] text-zinc-600 hover:bg-zinc-50"
                >
                  <item.icon size={16} className="text-zinc-400" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="space-y-3 border-t border-zinc-100 p-3">
        <ProgressWidget
          pct={progress.pct}
          done={progress.done}
          total={progress.total}
          title={t('progressTitle')}
          linkLabel={t('viewFullReport')}
        />
        <LessonTimeWidget
          total={time.total}
          content={time.content}
          activities={time.activities}
          assessments={time.assessments}
          title={t('lessonTime')}
          totalLabel={t('totalEstimated')}
          labels={{
            content: t('contentTime'),
            activities: t('activitiesTime'),
            assessments: t('assessmentsTime'),
          }}
        />
      </div>
    </aside>
  );
}
