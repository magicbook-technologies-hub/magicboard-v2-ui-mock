'use client';

import {
  FileBarChart2,
  Languages,
  Layers,
  Loader2,
  Mic,
  Presentation,
  Sparkles,
  Video,
  Accessibility,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';
import { CircularMetric } from '@/components/charts/CircularMetric';
import { TeacherNote } from '@/components/teacher/TeacherNote';

const TOOL_ICONS: Record<string, typeof Presentation> = {
  slides: Presentation,
  mindmap: Layers,
  video: Video,
  podcast: Mic,
  flashcards: Sparkles,
  translate: Languages,
  inclusive: Accessibility,
  report: FileBarChart2,
};

export function ToolsSidebar({
  tools,
  busyTool,
  bnccPct,
  bnccCode,
  notes,
  onNotesChange,
  onNotesSave,
  onTool,
  onNewSection,
}: {
  tools: { id: string; tool: string; labelKey: string }[];
  busyTool: string | null;
  bnccPct: number;
  bnccCode: string;
  notes: string;
  onNotesChange: (v: string) => void;
  onNotesSave: () => void;
  onTool: (tool: string) => void;
  onNewSection: () => void;
}) {
  const { t } = useI18n();

  return (
    <aside className="flex h-full w-[280px] shrink-0 flex-col border-l border-zinc-200/80 bg-white overflow-y-auto scrollbar-thin">
      <div className="p-4 space-y-4">
        <h3 className="text-sm font-semibold text-zinc-900">{t('lessonTools')}</h3>
        <ul className="space-y-1.5">
          {tools.map((tool) => {
            const Icon = TOOL_ICONS[tool.id] || Sparkles;
            const busy = busyTool === tool.tool;
            return (
              <li key={tool.id}>
                <button
                  onClick={() => onTool(tool.tool)}
                  disabled={!!busyTool}
                  className="flex w-full items-center gap-2.5 rounded-xl border border-zinc-100 bg-zinc-50/50 px-3 py-2.5 text-left text-[13px] text-zinc-700 transition hover:border-[var(--ring)] hover:bg-[var(--primary-soft)]/40 disabled:opacity-60"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-zinc-100 text-[var(--primary)]">
                    {busy ? <Loader2 size={14} className="animate-spin" /> : <Icon size={14} />}
                  </span>
                  <span className="font-medium">{t(tool.labelKey)}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <Button variant="primary" className="w-full" onClick={onNewSection}>
          {t('newSection')}
        </Button>

        <div className="rounded-2xl border border-zinc-200/80 p-4">
          <p className="text-xs font-semibold text-zinc-800 mb-3">{t('bnccCoverage')}</p>
          <div className="flex flex-col items-center">
            <CircularMetric value={bnccPct} label="" size={96} color="#6366f1" />
            <p className="mt-2 text-center text-[11px] text-zinc-500">
              {t('coverageOf', { pct: bnccPct, code: bnccCode })}
            </p>
            <button className="mt-2 text-[11px] font-medium text-[var(--primary)] hover:underline">
              {t('viewFullReport')}
            </button>
          </div>
        </div>

        <TeacherNote
          title={t('teacherNotes')}
          value={notes}
          placeholder={t('notesPlaceholder')}
          onChange={onNotesChange}
          onBlur={onNotesSave}
        />
      </div>
    </aside>
  );
}
