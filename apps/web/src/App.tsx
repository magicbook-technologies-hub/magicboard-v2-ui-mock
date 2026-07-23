import { useEffect, useMemo, useState } from 'react';
import type { Artifact, LessonPlan } from '@magicboard/schema';
import {
  createLesson,
  generateTool,
  getLesson,
  listLessons,
  patchNotes,
  postProgress,
  regenerate,
  type HubLesson,
  type LessonSummary,
} from './api';
import { NAV, TOOL_META, buildRoteiro, progressPercent, type HubSection } from './hubHelpers';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Download,
  Loader2,
  Lock,
  Play,
  Plus,
  Presentation,
  Search,
  Share2,
  Sparkles,
  X,
} from 'lucide-react';

type View = 'library' | 'create' | 'hub' | 'present' | 'artifact';

export default function App() {
  const [view, setView] = useState<View>('library');
  const [lessons, setLessons] = useState<LessonSummary[]>([]);
  const [lesson, setLesson] = useState<HubLesson | null>(null);
  const [section, setSection] = useState<HubSection>('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeArtifact, setActiveArtifact] = useState<Artifact | null>(null);
  const [busyTool, setBusyTool] = useState<string | null>(null);

  async function refreshList() {
    const data = await listLessons();
    setLessons(data.lessons);
  }

  useEffect(() => {
    refreshList().catch((e) => setError(String(e.message || e)));
  }, []);

  async function openLesson(id: string) {
    setLoading(true);
    setError(null);
    try {
      const data = await getLesson(id);
      setLesson(data);
      setSection('overview');
      setView('hub');
    } catch (e) {
      setError(String((e as Error).message));
    } finally {
      setLoading(false);
    }
  }

  async function onCreate(form: Record<string, unknown>) {
    setLoading(true);
    setError(null);
    try {
      const data = await createLesson(form);
      setLesson(data);
      setView('hub');
      await refreshList();
    } catch (e) {
      setError(String((e as Error).message));
    } finally {
      setLoading(false);
    }
  }

  async function onNotes(text: string) {
    if (!lesson) return;
    const data = await patchNotes(lesson.id, text);
    setLesson(data);
  }

  async function toggleStep(stepId: string) {
    if (!lesson) return;
    const set = new Set(lesson.progress.completedStepIds);
    if (set.has(stepId)) set.delete(stepId);
    else set.add(stepId);
    const completed = [...set];
    const data = await postProgress(lesson.id, completed, stepId);
    setLesson(data);
  }

  async function onGenerate(tool: string) {
    if (!lesson) return;
    setBusyTool(tool);
    try {
      const { artifact } = await generateTool(
        lesson.id,
        tool,
        tool === 'translate' ? 'English' : undefined,
      );
      const refreshed = await getLesson(lesson.id);
      setLesson(refreshed);
      setActiveArtifact(artifact);
      setView('artifact');
    } catch (e) {
      setError(String((e as Error).message));
    } finally {
      setBusyTool(null);
    }
  }

  async function onRegenerate(sectionKey: string) {
    if (!lesson) return;
    setLoading(true);
    try {
      const data = await regenerate(lesson.id, [sectionKey], 'Refresh for classroom clarity');
      setLesson(data);
    } catch (e) {
      setError(String((e as Error).message));
    } finally {
      setLoading(false);
    }
  }

  if (view === 'present' && lesson) {
    return (
      <PresentMode
        plan={lesson.lessonPlan}
        onClose={() => setView('hub')}
        onQuiz={() => onGenerate('quiz')}
      />
    );
  }

  if (view === 'artifact' && lesson && activeArtifact) {
    return (
      <ArtifactView
        artifact={activeArtifact}
        onBack={() => setView('hub')}
        onPresent={() => setView('present')}
      />
    );
  }

  if (view === 'create') {
    return (
      <CreateForm
        loading={loading}
        error={error}
        onCancel={() => setView('library')}
        onSubmit={onCreate}
      />
    );
  }

  if (view === 'hub' && lesson) {
    return (
      <TeacherHub
        lesson={lesson}
        section={section}
        onSection={setSection}
        onBack={() => {
          setView('library');
          refreshList();
        }}
        onPresent={() => setView('present')}
        onNotes={onNotes}
        onToggleStep={toggleStep}
        onGenerate={onGenerate}
        onRegenerate={onRegenerate}
        busyTool={busyTool}
        loading={loading}
        error={error}
        onOpenArtifact={(a) => {
          setActiveArtifact(a);
          setView('artifact');
        }}
      />
    );
  }

  return (
    <Library
      lessons={lessons}
      loading={loading}
      error={error}
      onOpen={openLesson}
      onCreate={() => setView('create')}
    />
  );
}

function Library({
  lessons,
  loading,
  error,
  onOpen,
  onCreate,
}: {
  lessons: LessonSummary[];
  loading: boolean;
  error: string | null;
  onOpen: (id: string) => void;
  onCreate: () => void;
}) {
  return (
    <div className="min-h-full bg-[var(--surface)]">
      <header className="border-b border-[var(--line)] bg-white px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] font-semibold">
            Magicboard by Jandaia
          </p>
          <h1 className="display text-2xl mt-1">Lições Mágicas</h1>
        </div>
        <button
          onClick={onCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] text-white px-4 py-2.5 text-sm font-semibold shadow-sm hover:opacity-95"
        >
          <Plus size={16} /> Nova aula
        </button>
      </header>
      <main className="max-w-5xl mx-auto p-6">
        {error && <p className="mb-4 text-sm text-[var(--danger)]">{error}</p>}
        {loading && !lessons.length ? (
          <p className="text-[var(--muted)]">Carregando…</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {lessons.map((l) => {
              const pct = Math.round(
                (l.progress.completedStepIds.length / Math.max(1, 6)) * 100,
              );
              return (
                <button
                  key={l.id}
                  onClick={() => onOpen(l.id)}
                  className="text-left rounded-2xl border border-[var(--line)] bg-white p-5 hover:border-[var(--accent)] transition shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-[var(--muted)]">
                        {l.subject} · {l.gradeLabel} · {l.durationMinutes} min
                      </p>
                      <h2 className="display text-xl mt-1">{l.title}</h2>
                    </div>
                    <span className="text-xs font-semibold rounded-full bg-[var(--accent-soft)] text-[var(--accent)] px-2.5 py-1">
                      {pct}%
                    </span>
                  </div>
                  <p className="text-xs text-[var(--muted)] mt-3">
                    Atualizado {new Date(l.updatedAt).toLocaleString()}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

function CreateForm({
  loading,
  error,
  onCancel,
  onSubmit,
}: {
  loading: boolean;
  error: string | null;
  onCancel: () => void;
  onSubmit: (body: Record<string, unknown>) => void;
}) {
  const [form, setForm] = useState({
    subject: 'Ciências',
    grade: '5',
    topic: 'Introdução à Fotossíntese',
    duration: 50,
    complexity: 'standard',
    teaching_method: 'inquiry-based learning',
    language: 'Portuguese',
    curriculum_framework: 'BNCC',
    curriculum_alignment_notes:
      'Unidade: Vida e evolução; Objeto: plantas e necessidades básicas; nenhum código oficial foi fornecido.',
  });

  return (
    <div className="min-h-full bg-[var(--surface)]">
      <header className="border-b border-[var(--line)] bg-white px-6 py-4 flex items-center gap-3">
        <button onClick={onCancel} className="p-2 rounded-lg hover:bg-slate-100">
          <ArrowLeft size={18} />
        </button>
        <h1 className="display text-xl">Criar lição mágica</h1>
      </header>
      <form
        className="max-w-xl mx-auto p-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({
            ...form,
            grade: form.grade === 'uni' ? 'uni' : Number(form.grade),
            duration: Number(form.duration),
          });
        }}
      >
        {(
          [
            ['topic', 'Tópico'],
            ['subject', 'Disciplina'],
            ['grade', 'Ano (1–12 ou uni)'],
            ['duration', 'Duração (min)'],
            ['language', 'Idioma'],
            ['teaching_method', 'Método'],
            ['curriculum_framework', 'Framework (BNCC | CURRICULO_PAULISTA | NONE | vazio)'],
            ['curriculum_alignment_notes', 'Notas de alinhamento'],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="block text-sm">
            <span className="font-medium text-[var(--muted)]">{label}</span>
            <input
              className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2.5"
              value={String(form[key as keyof typeof form])}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            />
          </label>
        ))}
        <label className="block text-sm">
          <span className="font-medium text-[var(--muted)]">Complexidade</span>
          <select
            className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2.5"
            value={form.complexity}
            onChange={(e) => setForm((f) => ({ ...f, complexity: e.target.value }))}
          >
            <option value="easy">easy</option>
            <option value="standard">standard</option>
            <option value="advanced">advanced</option>
          </select>
        </label>
        {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
        <button
          disabled={loading}
          className="w-full rounded-xl bg-[var(--accent)] text-white py-3 font-semibold inline-flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
          Gerar plano V2
        </button>
      </form>
    </div>
  );
}

function TeacherHub({
  lesson,
  section,
  onSection,
  onBack,
  onPresent,
  onNotes,
  onToggleStep,
  onGenerate,
  onRegenerate,
  busyTool,
  loading,
  error,
  onOpenArtifact,
}: {
  lesson: HubLesson;
  section: HubSection;
  onSection: (s: HubSection) => void;
  onBack: () => void;
  onPresent: () => void;
  onNotes: (t: string) => void;
  onToggleStep: (id: string) => void;
  onGenerate: (tool: string) => void;
  onRegenerate: (key: string) => void;
  busyTool: string | null;
  loading: boolean;
  error: string | null;
  onOpenArtifact: (a: Artifact) => void;
}) {
  const plan = lesson.lessonPlan;
  const roteiro = useMemo(() => buildRoteiro(plan), [plan]);
  const pct = progressPercent(plan, lesson.progress.completedStepIds);
  const [notesDraft, setNotesDraft] = useState(lesson.userNotes);
  useEffect(() => setNotesDraft(lesson.userNotes), [lesson.userNotes]);

  return (
    <div className="h-full flex flex-col bg-[var(--surface)]">
      <TopBar
        plan={plan}
        onBack={onBack}
        onPresent={onPresent}
        onSlides={() => onGenerate('slides')}
      />
      <div className="flex-1 flex min-h-0">
        <aside className="w-60 shrink-0 border-r border-[var(--line)] bg-white flex flex-col">
          <nav className="p-3 space-y-0.5 overflow-y-auto scrollbar-thin flex-1">
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => onSection(item.id)}
                className={`w-full text-left rounded-lg px-3 py-2 text-sm ${
                  section === item.id
                    ? 'bg-[var(--accent-soft)] text-[var(--accent)] font-semibold'
                    : 'text-[var(--muted)] hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-[var(--line)]">
            <p className="text-xs text-[var(--muted)] mb-2">Progresso da Aula</p>
            <div className="flex items-center gap-3">
              <ProgressRing value={pct} />
              <div>
                <p className="text-sm font-semibold">{pct}% completo</p>
                <p className="text-xs text-[var(--muted)]">
                  {lesson.progress.completedStepIds.length} etapas
                </p>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto scrollbar-thin p-6">
          {error && <p className="mb-3 text-sm text-[var(--danger)]">{error}</p>}
          {loading && (
            <p className="mb-3 text-sm text-[var(--muted)] inline-flex items-center gap-2">
              <Loader2 className="animate-spin" size={14} /> Atualizando…
            </p>
          )}
          {section === 'overview' && (
            <Overview
              lesson={lesson}
              roteiro={roteiro}
              onToggleStep={onToggleStep}
              onJump={(s) => onSection(s)}
            />
          )}
          {section === 'objectives' && <ObjectivesBlock plan={plan} onRegen={() => onRegenerate('objective')} />}
          {section === 'content' && (
            <ContentBlocks plan={plan} onRegen={onRegenerate} />
          )}
          {section === 'activities' && <ActivitiesBlock plan={plan} onRegen={() => onRegenerate('activities')} />}
          {section === 'assessments' && (
            <AssessmentBlock plan={plan} onRegen={() => onRegenerate('assessment')} onQuiz={() => onGenerate('quiz')} />
          )}
          {section === 'resources' && <ResourcesBlock plan={plan} />}
          {section === 'mindmap' && (
            <MindmapBlock plan={plan} onRegen={() => onRegenerate('mindmap')} onGenerate={() => onGenerate('mindmap')} />
          )}
          {section === 'timeline' && (
            <TimelineBlock
              roteiro={roteiro}
              completed={lesson.progress.completedStepIds}
              current={lesson.progress.currentStepId}
              onToggle={onToggleStep}
            />
          )}
          {section === 'notes' && (
            <NotesBlock
              aiNotes={plan.teachersNotes}
              draft={notesDraft}
              setDraft={setNotesDraft}
              onSave={() => onNotes(notesDraft)}
            />
          )}
          {section === 'adaptations' && <AdaptationsBlock plan={plan} />}
          {section === 'reports' && (
            <ReportsPlaceholder coverage={lesson.curriculumCoverage} artifacts={lesson.artifacts} onOpen={onOpenArtifact} />
          )}
        </main>

        <aside className="w-72 shrink-0 border-l border-[var(--line)] bg-white overflow-y-auto scrollbar-thin p-4 space-y-5">
          <div>
            <h3 className="text-sm font-semibold mb-2">Ferramentas</h3>
            <div className="space-y-1.5">
              {Object.keys(TOOL_META).map((tool) => {
                const meta = TOOL_META[tool];
                return (
                  <button
                    key={tool}
                    disabled={busyTool === tool}
                    onClick={() => onGenerate(tool)}
                    className="w-full flex items-start gap-2 rounded-xl border border-[var(--line)] px-3 py-2.5 text-left hover:border-[var(--accent)] disabled:opacity-60"
                  >
                    <span className="text-base leading-none mt-0.5">{meta.icon}</span>
                    <span>
                      <span className="block text-sm font-medium">{meta.label}</span>
                      <span className="block text-xs text-[var(--muted)]">{meta.description}</span>
                    </span>
                    {busyTool === tool && <Loader2 className="ml-auto animate-spin" size={14} />}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Fontes da Aula</h3>
            <SourcesDonut byType={plan.sourcesSummary.byType} />
            <ul className="mt-3 space-y-1">
              {plan.sourcesSummary.items.map((s) => (
                <li key={s.name} className="text-xs text-[var(--muted)]">
                  · {s.name}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Notas do Professor</h3>
            <textarea
              value={notesDraft}
              onChange={(e) => setNotesDraft(e.target.value)}
              onBlur={() => onNotes(notesDraft)}
              placeholder="Lembrete privado (não vai para os alunos)…"
              className="w-full min-h-28 rounded-xl border border-amber-200 bg-[var(--warm-soft)] p-3 text-sm"
            />
          </div>

          {lesson.artifacts.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Artefatos</h3>
              <ul className="space-y-1">
                {lesson.artifacts.slice(0, 6).map((a) => (
                  <li key={a.id}>
                    <button
                      onClick={() => onOpenArtifact(a)}
                      className="text-left text-xs text-[var(--accent)] hover:underline"
                    >
                      {a.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={() => onGenerate('quiz')}
            className="fixed bottom-6 right-6 z-20 inline-flex items-center gap-2 rounded-full bg-[#2563eb] text-white px-4 py-3 text-sm font-semibold shadow-lg"
          >
            <Sparkles size={16} /> Assistente IA
          </button>
        </aside>
      </div>
    </div>
  );
}

function TopBar({
  plan,
  onBack,
  onPresent,
  onSlides,
}: {
  plan: LessonPlan;
  onBack: () => void;
  onPresent: () => void;
  onSlides: () => void;
}) {
  return (
    <header className="shrink-0 border-b border-[var(--line)] bg-white px-4 py-3 flex items-center gap-3">
      <button onClick={onBack} className="text-sm text-[var(--muted)] hover:text-[var(--ink)] inline-flex items-center gap-1">
        <ArrowLeft size={16} /> Classes
      </button>
      <div className="flex-1 max-w-md relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
        <input
          placeholder="Pesquisar nesta aula…"
          className="w-full rounded-full border border-[var(--line)] bg-[var(--surface)] pl-9 pr-3 py-2 text-sm"
        />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={onPresent}
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] text-white px-3 py-2 text-sm font-semibold"
        >
          <Presentation size={16} /> Apresentar Slides
        </button>
        <button onClick={onSlides} className="rounded-xl border border-[var(--line)] px-3 py-2 text-sm inline-flex items-center gap-1">
          <Play size={14} /> Gerar slides
        </button>
        <button className="rounded-xl border border-[var(--line)] px-3 py-2 text-sm inline-flex items-center gap-1">
          <Share2 size={14} /> Share
        </button>
        <button className="rounded-xl border border-[var(--line)] px-3 py-2 text-sm inline-flex items-center gap-1">
          <Download size={14} /> Download
        </button>
        <div className="ml-2 text-sm font-medium">Prof. Thiago</div>
      </div>
    </header>
  );
}

function Overview({
  lesson,
  roteiro,
  onToggleStep,
  onJump,
}: {
  lesson: HubLesson;
  roteiro: ReturnType<typeof buildRoteiro>;
  onToggleStep: (id: string) => void;
  onJump: (s: HubSection) => void;
}) {
  const plan = lesson.lessonPlan;
  const completed = new Set(lesson.progress.completedStepIds);
  const current = lesson.progress.currentStepId;

  return (
    <div className="space-y-6 max-w-4xl">
      <Hero plan={plan} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Objetivos', value: plan.objective.content.goals.length, go: 'objectives' as const },
          { label: 'Conteúdo', value: 2 + plan.keyConcepts.content.length, go: 'content' as const },
          { label: 'Atividades', value: plan.activities.content.length, go: 'activities' as const },
          {
            label: 'Avaliações',
            value: plan.assessment.content.quickChecks.length,
            go: 'assessments' as const,
          },
        ].map((c) => (
          <button
            key={c.label}
            onClick={() => onJump(c.go)}
            className="rounded-2xl border border-[var(--line)] bg-white p-4 text-left hover:border-[var(--accent)]"
          >
            <p className="text-2xl font-semibold text-[var(--accent)]">{c.value}</p>
            <p className="text-sm text-[var(--muted)]">{c.label}</p>
          </button>
        ))}
      </div>

      <section className="rounded-2xl border border-[var(--line)] bg-white p-5">
        <h2 className="display text-lg mb-4">Roteiro da Aula</h2>
        <ol className="space-y-3">
          {roteiro.map((node) => {
            const done = completed.has(node.id);
            const isCurrent = current === node.id && !done;
            const locked = !done && !isCurrent && roteiro.findIndex((r) => r.id === node.id) > roteiro.findIndex((r) => r.id === current);
            return (
              <li key={node.id} className="flex items-start gap-3">
                <button onClick={() => onToggleStep(node.id)} className="mt-0.5 text-[var(--accent)]">
                  {done ? <CheckCircle2 size={20} /> : isCurrent ? <Circle size={20} className="text-[var(--warm)]" /> : locked ? <Lock size={18} className="text-slate-300" /> : <Circle size={20} className="text-slate-300" />}
                </button>
                <div className="flex-1 border-b border-[var(--line)] pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-sm">
                      <span className="text-[var(--muted)] mr-2">{node.n}.</span>
                      {node.title}
                    </p>
                    <span className="text-xs text-[var(--muted)]">{node.duration}</span>
                  </div>
                  {isCurrent && (
                    <span className="inline-block mt-1 text-[10px] uppercase tracking-wide font-semibold text-[var(--warm)] bg-[var(--warm-soft)] px-2 py-0.5 rounded-full">
                      Em andamento
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="display text-lg">Conteúdo Completo da Aula</h2>
          <button onClick={() => onJump('content')} className="text-sm text-[var(--accent)]">
            Ver tudo
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-thin pb-2">
          {[plan.starter, plan.contentDiscovery].map((b) => (
            <article
              key={b.id}
              className="min-w-[220px] rounded-2xl border border-[var(--line)] bg-white overflow-hidden"
            >
              <div className="h-28 bg-gradient-to-br from-emerald-100 to-teal-200 flex items-end p-3">
                <span className="text-xs bg-white/80 rounded-full px-2 py-0.5">{b.durationMinutes} min</span>
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm">{b.title}</h3>
                <p className="text-xs text-[var(--muted)] mt-1 line-clamp-2">{b.sectionObjective}</p>
              </div>
            </article>
          ))}
          {plan.keyConcepts.content.map((k) => (
            <article key={k} className="min-w-[200px] rounded-2xl border border-[var(--line)] bg-white p-3">
              <p className="text-xs text-[var(--muted)]">Conceito</p>
              <h3 className="font-semibold text-sm mt-1">{k}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--line)] bg-white p-5">
        <h2 className="display text-lg mb-3">Atividades em Destaque</h2>
        <ul className="space-y-3">
          {plan.activities.content.map((a) => (
            <li key={a.name} className="flex items-start justify-between gap-3 border-b border-[var(--line)] pb-3 last:border-0">
              <div>
                <p className="font-medium text-sm">{a.name}</p>
                <p className="text-xs text-[var(--muted)] mt-0.5">{a.description}</p>
              </div>
              <span className="text-xs whitespace-nowrap text-[var(--muted)]">
                {a.duration} · {a.grouping}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <CurriculumCard plan={plan} coverage={lesson.curriculumCoverage} />
    </div>
  );
}

function Hero({ plan }: { plan: LessonPlan }) {
  const skillCode = plan.curriculum.skills.find((s) => s.code)?.code;
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[var(--line)] bg-[#0f2f28] text-white min-h-[200px]">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(circle at 70% 40%, #3d9a6a 0%, transparent 55%), linear-gradient(120deg, #0f2f28, #1a4d40)',
        }}
      />
      <div className="relative p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.18em] text-emerald-100/80">
          {plan.lessonInfo.subject}
        </p>
        <h1 className="display text-3xl md:text-4xl mt-2 max-w-xl">{plan.title.content}</h1>
        <p className="mt-2 text-sm text-emerald-50/90 max-w-lg">{plan.title.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Chip>{plan.lessonInfo.gradeLabel}</Chip>
          <Chip>{plan.lessonInfo.durationMinutes} min</Chip>
          <Chip>{plan.curriculum.framework}</Chip>
          {skillCode && <Chip>BNCC: {skillCode}</Chip>}
          <Chip>{plan.curriculum.thematicUnit}</Chip>
        </div>
      </div>
    </section>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs rounded-full bg-white/15 border border-white/20 px-2.5 py-1">
      {children}
    </span>
  );
}

function CurriculumCard({ plan, coverage }: { plan: LessonPlan; coverage: number }) {
  const c = plan.curriculum;
  return (
    <section className="rounded-2xl border border-[var(--line)] bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="display text-lg">Alinhamento Curricular</h2>
          <p className="text-xs text-[var(--muted)] mt-1">
            Completude dos campos de alinhamento (não é % oficial BNCC)
          </p>
        </div>
        <ProgressRing value={coverage} label={`${coverage}%`} />
      </div>
      <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-xs font-semibold text-[var(--muted)] uppercase">Unidade / Objeto</p>
          <p className="mt-1">{c.thematicUnit}</p>
          <p className="text-[var(--muted)]">{c.objectOfKnowledge}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-[var(--muted)] uppercase">Habilidades</p>
          <ul className="mt-1 space-y-1">
            {c.skills.map((s, i) => (
              <li key={i} className="text-[var(--muted)]">
                {s.code ? <strong className="text-[var(--ink)]">{s.code} — </strong> : null}
                {s.description}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold text-[var(--muted)] uppercase">Competências gerais</p>
          <ul className="mt-1 list-disc pl-4 text-[var(--muted)]">
            {c.generalCompetencies.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold text-[var(--muted)] uppercase">Destaque</p>
          <p className="mt-1 text-[var(--muted)]">{plan.objective.content.curriculumHighlight}</p>
        </div>
      </div>
    </section>
  );
}

function Callout({ type, title, text }: { type: string; title: string; text: string }) {
  const colors: Record<string, string> = {
    pedagogicalTip: 'border-amber-300 bg-amber-50',
    didYouKnow: 'border-emerald-300 bg-emerald-50',
    commonError: 'border-red-300 bg-red-50',
    safety: 'border-orange-300 bg-orange-50',
    ctsa: 'border-sky-300 bg-sky-50',
  };
  return (
    <div className={`rounded-xl border px-3 py-2 text-sm ${colors[type] || 'border-slate-200 bg-slate-50'}`}>
      <p className="font-semibold text-xs uppercase tracking-wide">{title}</p>
      <p className="mt-1 text-[var(--ink)]">{text}</p>
    </div>
  );
}

function ObjectivesBlock({ plan, onRegen }: { plan: LessonPlan; onRegen: () => void }) {
  return (
    <section className="max-w-3xl space-y-4">
      <HeaderWithRegen title={plan.objective.title} onRegen={onRegen} />
      <p className="text-sm text-[var(--muted)]">{plan.objective.description}</p>
      <ul className="space-y-2">
        {plan.objective.content.goals.map((g) => (
          <li key={g} className="rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-sm">
            {g}
          </li>
        ))}
      </ul>
    </section>
  );
}

function ContentBlocks({
  plan,
  onRegen,
}: {
  plan: LessonPlan;
  onRegen: (key: string) => void;
}) {
  return (
    <div className="max-w-3xl space-y-8">
      {[plan.starter, plan.contentDiscovery].map((b) => (
        <article key={b.id} className="rounded-2xl border border-[var(--line)] bg-white p-5 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-[var(--muted)]">
                Seção {b.sectionNumber} · {b.description}
              </p>
              <h2 className="display text-xl mt-1">{b.title}</h2>
              <p className="text-sm text-[var(--muted)] mt-1">{b.sectionObjective}</p>
            </div>
            <button
              onClick={() => onRegen(b.id)}
              className="text-xs rounded-lg border border-[var(--line)] px-2 py-1 hover:border-[var(--accent)]"
            >
              Regenerar
            </button>
          </div>
          <div className="rounded-xl bg-[var(--accent-soft)] border border-emerald-100 p-4">
            <p className="text-xs font-semibold text-[var(--accent)] uppercase tracking-wide mb-1">
              O Professor Diz
            </p>
            <p className="text-sm whitespace-pre-wrap">{b.teacherScript}</p>
          </div>
          <p className="text-sm leading-relaxed">{b.body}</p>
          <div className="grid gap-2">
            {b.callouts.map((c, i) => (
              <Callout key={i} type={c.type} title={c.title} text={c.text} />
            ))}
          </div>
          {b.media.map((m, i) => (
            <div key={i} className="rounded-xl border border-dashed border-[var(--line)] p-4 bg-[var(--surface)]">
              <p className="text-xs font-semibold uppercase text-[var(--muted)]">{m.kind}</p>
              <p className="text-sm mt-1">{m.caption || m.alt}</p>
              {m.labels.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {m.labels.map((l) => (
                    <span key={l} className="text-xs rounded-full bg-white border border-[var(--line)] px-2 py-0.5">
                      {l}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-[11px] text-[var(--muted)] mt-2">promptHint: {m.promptHint}</p>
            </div>
          ))}
          <footer className="text-xs text-[var(--muted)] pt-2 border-t border-[var(--line)]">
            Fontes: {b.sources.map((s) => s.name).join(' · ') || '—'}
          </footer>
        </article>
      ))}
    </div>
  );
}

function ActivitiesBlock({ plan, onRegen }: { plan: LessonPlan; onRegen: () => void }) {
  return (
    <section className="max-w-3xl space-y-4">
      <HeaderWithRegen title={plan.activities.title} onRegen={onRegen} />
      {plan.activities.content.map((a) => (
        <article key={a.name} className="rounded-2xl border border-[var(--line)] bg-white p-5">
          <div className="flex justify-between gap-3">
            <h3 className="font-semibold">{a.name}</h3>
            <span className="text-xs text-[var(--muted)]">
              {a.duration} · {a.grouping}
            </span>
          </div>
          <p className="text-sm mt-2 text-[var(--muted)]">{a.description}</p>
          <p className="text-sm mt-2">
            <strong>Resultado:</strong> {a.expectedOutcome}
          </p>
        </article>
      ))}
    </section>
  );
}

function AssessmentBlock({
  plan,
  onRegen,
  onQuiz,
}: {
  plan: LessonPlan;
  onRegen: () => void;
  onQuiz: () => void;
}) {
  return (
    <section className="max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <HeaderWithRegen title={plan.assessment.title} onRegen={onRegen} />
        <button onClick={onQuiz} className="text-sm rounded-xl bg-[var(--accent)] text-white px-3 py-2 font-medium">
          Gerar quiz
        </button>
      </div>
      <p className="text-sm">
        <strong>Diagnóstico:</strong> {plan.assessment.content.diagnosticPrompt}
      </p>
      <ul className="space-y-2">
        {plan.assessment.content.quickChecks.map((q) => (
          <li key={q.id} className="rounded-xl border border-[var(--line)] bg-white p-4 text-sm">
            <span className="text-xs font-semibold text-[var(--accent)]">
              {q.id} · {q.bloomLevel}
            </span>
            <p className="mt-1">{q.prompt}</p>
          </li>
        ))}
      </ul>
      <p className="text-sm rounded-xl bg-[var(--warm-soft)] border border-amber-100 p-4">
        <strong>Exit check:</strong> {plan.assessment.content.exitCheck}
      </p>
    </section>
  );
}

function ResourcesBlock({ plan }: { plan: LessonPlan }) {
  const m = plan.materialsNeeded.content;
  return (
    <section className="max-w-3xl space-y-4">
      <h2 className="display text-xl">{plan.materialsNeeded.title}</h2>
      {(
        [
          ['Físicos', m.physicalResources],
          ['Digitais', m.digitalResources],
          ['Professor', m.teacherResources],
          ['Aluno', m.studentResources],
        ] as const
      ).map(([label, items]) => (
        <div key={label} className="rounded-2xl border border-[var(--line)] bg-white p-4">
          <h3 className="text-sm font-semibold">{label}</h3>
          <ul className="mt-2 list-disc pl-5 text-sm text-[var(--muted)]">
            {items.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

function MindmapBlock({
  plan,
  onRegen,
  onGenerate,
}: {
  plan: LessonPlan;
  onRegen: () => void;
  onGenerate: () => void;
}) {
  return (
    <section className="max-w-3xl space-y-3">
      <div className="flex items-center justify-between">
        <HeaderWithRegen title={plan.mindmap.title} onRegen={onRegen} />
        <button onClick={onGenerate} className="text-sm rounded-xl border border-[var(--line)] px-3 py-2">
          Exportar artefato
        </button>
      </div>
      <pre className="rounded-2xl border border-[var(--line)] bg-slate-900 text-emerald-100 p-4 text-xs overflow-x-auto whitespace-pre-wrap">
        {plan.mindmap.content}
      </pre>
    </section>
  );
}

function TimelineBlock({
  roteiro,
  completed,
  current,
  onToggle,
}: {
  roteiro: ReturnType<typeof buildRoteiro>;
  completed: string[];
  current: string | null;
  onToggle: (id: string) => void;
}) {
  const set = new Set(completed);
  return (
    <section className="max-w-2xl space-y-3">
      <h2 className="display text-xl">Linha do Tempo</h2>
      {roteiro.map((n) => (
        <button
          key={n.id}
          onClick={() => onToggle(n.id)}
          className="w-full flex items-center gap-3 rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-left"
        >
          {set.has(n.id) ? (
            <CheckCircle2 className="text-[var(--accent)]" size={18} />
          ) : (
            <Circle className={current === n.id ? 'text-[var(--warm)]' : 'text-slate-300'} size={18} />
          )}
          <span className="flex-1 text-sm font-medium">{n.title}</span>
          <span className="text-xs text-[var(--muted)]">{n.duration}</span>
        </button>
      ))}
    </section>
  );
}

function NotesBlock({
  aiNotes,
  draft,
  setDraft,
  onSave,
}: {
  aiNotes: LessonPlan['teachersNotes'];
  draft: string;
  setDraft: (t: string) => void;
  onSave: () => void;
}) {
  return (
    <section className="max-w-3xl space-y-4">
      <h2 className="display text-xl">{aiNotes.title}</h2>
      <div className="space-y-2">
        {aiNotes.content.map((n, i) => (
          <div key={i} className="rounded-xl border border-[var(--line)] bg-white p-3 text-sm">
            <span className="text-[10px] uppercase tracking-wide font-semibold text-[var(--accent)]">
              {n.type}
            </span>
            <p className="mt-1">{n.text}</p>
          </div>
        ))}
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2">Sticky privada</h3>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="w-full min-h-32 rounded-xl border border-amber-200 bg-[var(--warm-soft)] p-3 text-sm"
        />
        <button onClick={onSave} className="mt-2 rounded-xl bg-[var(--accent)] text-white px-3 py-2 text-sm">
          Salvar nota
        </button>
      </div>
    </section>
  );
}

function AdaptationsBlock({ plan }: { plan: LessonPlan }) {
  const d = plan.differentiation;
  return (
    <section className="max-w-3xl space-y-4">
      <h2 className="display text-xl">Adaptações</h2>
      {(
        [
          ['Apoio', d.supportStudents],
          ['Avançados', d.advancedStudents],
          ['Rápidos', d.fastFinishers],
          ['Multilíngue', d.multilingualSupport],
        ] as const
      ).map(([label, items]) => (
        <div key={label} className="rounded-2xl border border-[var(--line)] bg-white p-4">
          <h3 className="text-sm font-semibold">{label}</h3>
          <ul className="mt-2 list-disc pl-5 text-sm text-[var(--muted)]">
            {items.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

function ReportsPlaceholder({
  coverage,
  artifacts,
  onOpen,
}: {
  coverage: number;
  artifacts: Artifact[];
  onOpen: (a: Artifact) => void;
}) {
  return (
    <section className="max-w-3xl space-y-4">
      <h2 className="display text-xl">Relatórios</h2>
      <p className="text-sm text-[var(--muted)]">
        Placeholder LMS — cobertura curricular UI: {coverage}%. Roster/notas ficam fora do v1.
      </p>
      <div className="rounded-2xl border border-[var(--line)] bg-white p-4">
        <h3 className="text-sm font-semibold mb-2">Artefatos gerados</h3>
        <ul className="space-y-1">
          {artifacts.map((a) => (
            <li key={a.id}>
              <button onClick={() => onOpen(a)} className="text-sm text-[var(--accent)] hover:underline">
                {a.tool}: {a.title}
              </button>
            </li>
          ))}
          {!artifacts.length && <li className="text-sm text-[var(--muted)]">Nenhum ainda — use Ferramentas.</li>}
        </ul>
      </div>
    </section>
  );
}

function PresentMode({
  plan,
  onClose,
  onQuiz,
}: {
  plan: LessonPlan;
  onClose: () => void;
  onQuiz: () => void;
}) {
  const slides = useMemo(() => {
    return [
      { title: plan.title.content, body: `${plan.lessonInfo.subject} · ${plan.lessonInfo.gradeLabel}` },
      { title: plan.objective.title, body: plan.objective.content.goals.join('\n') },
      { title: plan.starter.title, body: plan.starter.teacherScript },
      { title: plan.contentDiscovery.title, body: plan.contentDiscovery.body },
      ...plan.activities.content.map((a) => ({ title: a.name, body: a.description })),
      {
        title: plan.assessment.title,
        body: plan.assessment.content.quickChecks.map((q) => `${q.id}. ${q.prompt}`).join('\n'),
      },
    ];
  }, [plan]);
  const [i, setI] = useState(0);
  const slide = slides[i];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setI((x) => Math.min(slides.length - 1, x + 1));
      if (e.key === 'ArrowLeft') setI((x) => Math.max(0, x - 1));
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [slides.length, onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-[#071512] text-white flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 text-sm text-white/70">
        <button onClick={onClose} className="inline-flex items-center gap-1 hover:text-white">
          <X size={16} /> Sair
        </button>
        <span>
          {i + 1} / {slides.length}
        </span>
        <button onClick={onQuiz} className="hover:text-white">
          Abrir quiz
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center px-10">
        <div className="max-w-4xl w-full">
          <h1 className="display text-4xl md:text-5xl leading-tight">{slide.title}</h1>
          <p className="mt-8 text-xl md:text-2xl text-emerald-50/90 whitespace-pre-wrap leading-relaxed">
            {slide.body}
          </p>
        </div>
      </div>
      <div className="flex justify-center gap-3 pb-8">
        <button
          onClick={() => setI((x) => Math.max(0, x - 1))}
          className="rounded-full border border-white/20 px-5 py-2"
        >
          Anterior
        </button>
        <button
          onClick={() => setI((x) => Math.min(slides.length - 1, x + 1))}
          className="rounded-full bg-[var(--accent)] px-5 py-2"
        >
          Próximo
        </button>
      </div>
    </div>
  );
}

function ArtifactView({
  artifact,
  onBack,
  onPresent,
}: {
  artifact: Artifact;
  onBack: () => void;
  onPresent: () => void;
}) {
  return (
    <div className="min-h-full bg-[var(--surface)]">
      <header className="border-b border-[var(--line)] bg-white px-6 py-4 flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-slate-100">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wide text-[var(--muted)]">{artifact.tool}</p>
          <h1 className="display text-xl">{artifact.title}</h1>
        </div>
        {artifact.tool === 'slides' && (
          <button onClick={onPresent} className="rounded-xl bg-[var(--accent)] text-white px-3 py-2 text-sm font-semibold">
            Apresentar
          </button>
        )}
      </header>
      <pre className="max-w-4xl mx-auto m-6 rounded-2xl border border-[var(--line)] bg-white p-4 text-xs overflow-auto scrollbar-thin">
        {JSON.stringify(artifact.payload, null, 2)}
      </pre>
    </div>
  );
}

function HeaderWithRegen({ title, onRegen }: { title: string; onRegen: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="display text-xl">{title}</h2>
      <button onClick={onRegen} className="text-xs rounded-lg border border-[var(--line)] px-2 py-1">
        Regenerar
      </button>
    </div>
  );
}

function ProgressRing({ value, label }: { value: number; label?: string }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative w-12 h-12">
      <svg width="48" height="48" className="-rotate-90">
        <circle cx="24" cy="24" r={r} stroke="#e2e8f0" strokeWidth="4" fill="none" />
        <circle
          cx="24"
          cy="24"
          r={r}
          stroke="var(--accent)"
          strokeWidth="4"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      {label && (
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
          {label}
        </span>
      )}
    </div>
  );
}

function SourcesDonut({ byType }: { byType: { type: string; count: number }[] }) {
  const total = byType.reduce((s, b) => s + b.count, 0) || 1;
  return (
    <div className="text-xs space-y-1">
      {byType.map((b) => (
        <div key={b.type} className="flex items-center gap-2">
          <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-[var(--accent)]"
              style={{ width: `${(b.count / total) * 100}%` }}
            />
          </div>
          <span className="w-28 truncate text-[var(--muted)]">
            {b.type} ({b.count})
          </span>
        </div>
      ))}
      <p className="text-[var(--muted)] pt-1">{total} fontes</p>
    </div>
  );
}
