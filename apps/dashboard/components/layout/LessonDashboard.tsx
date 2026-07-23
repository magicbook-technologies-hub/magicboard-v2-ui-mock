'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Artifact } from '@magicboard/schema';
import {
  generateTool,
  getLesson,
  patchNotes,
  postProgress,
  type HubLesson,
} from '@/lib/api';
import { mapLesson } from '@/lib/mapLesson';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { ToolsSidebar } from '@/components/layout/ToolsSidebar';
import { HeroLesson } from '@/components/hero/HeroLesson';
import { SummaryCards } from '@/components/cards/SummaryCard';
import { CurriculumCard } from '@/components/cards/CurriculumCard';
import { RoadmapTimeline } from '@/components/timeline/RoadmapTimeline';
import { LessonCarousel } from '@/components/lesson/LessonCarousel';
import { ActivityCards } from '@/components/cards/ActivityCard';
import { AssessmentCards } from '@/components/cards/AssessmentCard';
import { PedagogicalReport } from '@/components/charts/PedagogicalReport';
import { AssistantWidget } from '@/components/assistant/AssistantWidget';
import { PresentMode } from '@/components/lesson/PresentMode';
import { ArtifactPanel } from '@/components/lesson/ArtifactPanel';
import { useI18n } from '@/lib/i18n';

export function LessonDashboard({ initial }: { initial: HubLesson }) {
  const { t } = useI18n();
  const [lesson, setLesson] = useState(initial);
  const [active, setActive] = useState('overview');
  const [notes, setNotes] = useState(initial.userNotes);
  const [busyTool, setBusyTool] = useState<string | null>(null);
  const [present, setPresent] = useState(false);
  const [artifact, setArtifact] = useState<Artifact | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const view = useMemo(() => mapLesson(lesson), [lesson]);

  useEffect(() => {
    setNotes(lesson.userNotes || view.teacherNotes);
  }, [lesson.userNotes, view.teacherNotes]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(id);
  }, [toast]);

  const jump = useCallback((id: string) => {
    setActive(id);
    const el = document.getElementById(id === 'overview' ? 'hero' : id);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  async function saveNotes() {
    try {
      const updated = await patchNotes(lesson.id, notes);
      setLesson(updated);
      setToast('Notes saved');
    } catch (e) {
      setError(String((e as Error).message));
    }
  }

  async function onToggleStep(stepId: string) {
    const set = new Set(lesson.progress.completedStepIds);
    if (set.has(stepId)) set.delete(stepId);
    else set.add(stepId);
    try {
      const updated = await postProgress(lesson.id, [...set], stepId);
      setLesson(updated);
    } catch (e) {
      setError(String((e as Error).message));
    }
  }

  async function onTool(tool: string) {
    setBusyTool(tool);
    setError(null);
    try {
      const { artifact: art } = await generateTool(
        lesson.id,
        tool,
        tool === 'translate' ? 'English' : undefined,
      );
      const refreshed = await getLesson(lesson.id);
      setLesson(refreshed);
      setArtifact(art);
      setToast(`${art.title} ready`);
      if (tool === 'slides') {
        /* keep panel open; Present available from panel */
      }
    } catch (e) {
      setError(String((e as Error).message));
    } finally {
      setBusyTool(null);
    }
  }

  async function onPresent() {
    setError(null);
    try {
      // Ensure slides artifact exists (mock generate), then open present mode
      if (!lesson.artifacts.some((a) => a.tool === 'slides')) {
        setBusyTool('slides');
        await generateTool(lesson.id, 'slides');
        const refreshed = await getLesson(lesson.id);
        setLesson(refreshed);
        setBusyTool(null);
      }
      setPresent(true);
    } catch (e) {
      setBusyTool(null);
      setError(String((e as Error).message));
    }
  }

  function onDownload() {
    const blob = new Blob([JSON.stringify(lesson.lessonPlan, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${view.title.replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setToast('Downloaded lesson JSON');
  }

  function onShare() {
    void navigator.clipboard?.writeText(window.location.href).then(() => {
      setToast('Link copied');
    });
  }

  if (present) {
    return (
      <PresentMode
        lesson={lesson}
        onClose={() => setPresent(false)}
        onQuiz={() => {
          setPresent(false);
          void onTool('quiz');
        }}
      />
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)]">
      <Sidebar
        active={active}
        onNavigate={jump}
        progress={{
          pct: view.progressPct,
          done: view.sectionsDone,
          total: view.sectionsTotal,
        }}
        time={{
          total: view.durationMinutes,
          content: view.timeBreakdown.content,
          activities: view.timeBreakdown.activities,
          assessments: view.timeBreakdown.assessments,
        }}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onPresent={onPresent} onDownload={onDownload} onShare={onShare} />

        <div className="flex min-h-0 flex-1">
          <main className="flex-1 overflow-y-auto scrollbar-thin px-5 py-5 lg:px-8">
            <div className="mx-auto max-w-5xl space-y-8 pb-24">
              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}
              {toast && (
                <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                  {toast}
                </p>
              )}
              {busyTool && <p className="text-sm text-zinc-500">{t('generating')}</p>}

              <div id="hero">
                <HeroLesson title={view.title} subtitle={view.subtitle} badges={view.badges} />
              </div>

              <SummaryCards
                objectives={view.objectivesCount}
                content={view.contentCount}
                activities={view.activitiesCount}
                assessments={view.assessmentsCount}
                ai={view.aiResourcesCount}
                onJump={jump}
              />

              <div id="objectives" className="scroll-mt-4">
                <CurriculumCard
                  skills={view.skills}
                  competencies={view.generalCompetencies}
                  knowledgeObjects={view.knowledgeObjects}
                  expectedLearning={view.expectedLearning}
                />
              </div>

              <RoadmapTimeline
                steps={view.roadmap}
                completedIds={lesson.progress.completedStepIds}
                currentId={lesson.progress.currentStepId}
                onToggle={onToggleStep}
              />
              <LessonCarousel sections={view.contentSections} />

              <div className="flex flex-col gap-6 lg:flex-row">
                <ActivityCards activities={view.activities} />
                <AssessmentCards assessments={view.assessments} onQuiz={() => onTool('quiz')} />
              </div>

              {lesson.artifacts.length > 0 && (
                <section id="ai" className="scroll-mt-4">
                  <h2 className="mb-3 text-base font-semibold text-zinc-900">{t('aiResources')}</h2>
                  <ul className="space-y-2">
                    {lesson.artifacts.map((a) => (
                      <li key={a.id}>
                        <button
                          onClick={() => setArtifact(a)}
                          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-left text-sm hover:border-[var(--ring)]"
                        >
                          <span className="font-medium text-[var(--primary)]">{a.tool}</span>
                          <span className="text-zinc-700"> — {a.title}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <div id="notes" className="scroll-mt-4" />
              <div id="planning" className="scroll-mt-4" />
              <div id="knowledge" className="scroll-mt-4" />
              <div id="outcomes" className="scroll-mt-4" />
              <div id="materials" className="scroll-mt-4" />

              <PedagogicalReport metrics={view.metrics} />
            </div>
          </main>

          <div className="hidden lg:block">
            <ToolsSidebar
              tools={view.tools}
              busyTool={busyTool}
              bnccPct={view.metrics.bnccCoverage}
              bnccCode={view.bnccCode}
              notes={notes}
              onNotesChange={setNotes}
              onNotesSave={saveNotes}
              onTool={onTool}
              onNewSection={() => jump('content')}
            />
          </div>
        </div>
      </div>

      {/* Mobile tools strip */}
      <div className="fixed bottom-20 left-1/2 z-30 flex -translate-x-1/2 gap-2 rounded-full border border-zinc-200 bg-white/95 p-2 shadow-lg lg:hidden">
        {view.tools.slice(0, 4).map((tool) => (
          <button
            key={tool.id}
            disabled={!!busyTool}
            onClick={() => onTool(tool.tool)}
            className="rounded-full bg-[var(--primary-soft)] px-3 py-1.5 text-[11px] font-medium text-[var(--primary)] disabled:opacity-50"
          >
            {t(tool.labelKey)}
          </button>
        ))}
      </div>

      <AssistantWidget lessonTitle={view.title} />

      {artifact && (
        <ArtifactPanel
          artifact={artifact}
          onClose={() => setArtifact(null)}
          onPresent={() => {
            setArtifact(null);
            setPresent(true);
          }}
        />
      )}
    </div>
  );
}
