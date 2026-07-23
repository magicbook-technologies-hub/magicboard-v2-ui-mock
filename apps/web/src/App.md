import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
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
import {
  ASSISTANT_STARTERS,
  JOURNEY,
  TOOL_META,
  buildRoteiro,
  progressPercent,
  type JourneyPhase,
} from './hubHelpers';
import {
  ArrowLeft,
  BookOpen,
  Bot,
  CheckCircle2,
  Circle,
  Download,
  Home,
  Loader2,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Play,
  Plus,
  Presentation,
  Share2,
  Sparkles,
  X,
} from 'lucide-react';

type View = 'library' | 'create' | 'hub' | 'present' | 'artifact' | 'assistant';

type ChatMessage = { id: string; role: 'user' | 'assistant'; text: string };

const NAV = [
  { id: 'library' as const, label: 'Home', icon: Home },
  { id: 'library' as const, label: 'Lições Mágicas', icon: BookOpen },
  { id: 'assistant' as const, label: 'Teacher Assistant', icon: Bot },
];

export default function App() {
  const [view, setView] = useState<View>('library');
  const [lessons, setLessons] = useState<LessonSummary[]>([]);
  const [lesson, setLesson] = useState<HubLesson | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeArtifact, setActiveArtifact] = useState<Artifact | null>(null);
  const [busyTool, setBusyTool] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
    const data = await postProgress(lesson.id, [...set], stepId);
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

  function goNav(id: View) {
    setError(null);
    setView(id);
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

  const shell = (content: ReactNode, active: View = view) => (
    <AppShell
      active={active}
      collapsed={sidebarCollapsed}
      onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
      onNav={goNav}
      onPresent={lesson ? () => setView('present') : undefined}
    >
      {content}
    </AppShell>
  );

  if (view === 'artifact' && lesson && activeArtifact) {
    return shell(
      <ArtifactView
        artifact={activeArtifact}
        onBack={() => setView('hub')}
        onPresent={() => setView('present')}
      />,
      'hub',
    );
  }

  if (view === 'assistant') {
    return shell(<AssistantView lesson={lesson} onOpenLesson={lesson ? () => setView('hub') : undefined} />);
  }

  if (view === 'create') {
    return shell(
      <CreateForm loading={loading} error={error} onCancel={() => setView('library')} onSubmit={onCreate} />,
    );
  }

  if (view === 'hub' && lesson) {
    return shell(
      <TeacherHub
        lesson={lesson}
        onBack={() => {
          setView('library');
          refreshList();
        }}
        onPresent={() => setView('present')}
        onAssistant={() => setView('assistant')}
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
      />,
      'hub',
    );
  }

  return shell(
    <Library
      lessons={lessons}
      loading={loading}
      error={error}
      onOpen={openLesson}
      onCreate={() => setView('create')}
      onAssistant={() => setView('assistant')}
    />,
  );
}

function AppShell({
  children,
  active,
  collapsed,
  onToggleCollapse,
  onNav,
  onPresent,
}: {
  children: ReactNode;
  active: View;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onNav: (v: View) => void;
  onPresent?: () => void;
}) {
  const w = collapsed ? 72 : 242;
  return (
    <div className="flex h-full overflow-hidden bg-[var(--surface)]" style={{ ['--sidebar-w' as string]: `${w}px` }}>
      <aside
        className="shrink-0 h-full flex flex-col justify-between py-[18px] transition-all duration-200"
        style={{ width: w, paddingLeft: collapsed ? 8 : 18, paddingRight: collapsed ? 8 : 18 }}
      >
        <div className="flex flex-col gap-[54px] w-full">
          <div className={`h-11 flex items-center ${collapsed ? 'justify-center w-full' : 'gap-1.5'}`}>
            <MagicboardMark />
            {!collapsed && (
              <span className="text-[var(--brand)] font-semibold text-[21px] tracking-[-0.7px] leading-[26px]">
                Magicboard
              </span>
            )}
          </div>
          <nav className={`flex flex-col gap-1.5 w-full ${collapsed ? 'items-center' : ''}`}>
            {NAV.map(({ label, icon: Icon }, idx) => {
              const target: View = label === 'Teacher Assistant' ? 'assistant' : 'library';
              const isActive = active === target || (target === 'library' && (active === 'hub' || active === 'create'));
              return (
                <button
                  key={`${label}-${idx}`}
                  title={collapsed ? label : undefined}
                  onClick={() => onNav(target)}
                  className={`h-[38px] flex items-center rounded-[7px] transition-all duration-150 ${
                    isActive
                      ? 'bg-[var(--accent-hover)] border border-[var(--accent-border)]'
                      : 'hover:bg-white/70 active:scale-[0.98]'
                  } ${collapsed ? 'w-[38px] justify-center' : 'w-full px-2.5 gap-1.5'}`}
                >
                  <Icon size={18} className={isActive ? 'text-[var(--brand)]' : 'text-[var(--muted)]'} />
                  {!collapsed && (
                    <span
                      className={`font-semibold text-[13px] tracking-[-0.4px] whitespace-nowrap ${
                        isActive ? 'text-[var(--brand)]' : 'text-[var(--muted)]'
                      }`}
                    >
                      {label}
                    </span>
                  )}
                </button>
              );
            })}
            {onPresent && (
              <button
                title={collapsed ? 'Apresentar' : undefined}
                onClick={onPresent}
                className={`h-[38px] flex items-center rounded-[7px] transition-all duration-150 hover:bg-white/70 ${
                  collapsed ? 'w-[38px] justify-center' : 'w-full px-2.5 gap-1.5'
                }`}
              >
                <Presentation size={18} className="text-[var(--muted)]" />
                {!collapsed && (
                  <span className="font-semibold text-[13px] text-[var(--muted)] tracking-[-0.4px]">
                    Apresentação em Slide
                  </span>
                )}
              </button>
            )}
          </nav>
        </div>
        <button
          onClick={onToggleCollapse}
          className={`text-[var(--muted)] hover:text-[var(--brand)] p-2 rounded-lg hover:bg-white/70 ${
            collapsed ? 'mx-auto' : ''
          }`}
          aria-label="Alternar menu"
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </aside>
      <main className="flex-1 min-w-0 p-3 pr-4 pb-4">{children}</main>
    </div>
  );
}

function MagicboardMark() {
  return (
    <svg width="21" height="32" viewBox="0 0 29 45" fill="none" aria-hidden>
      <path
        d="M14.5 0C6.5 8 0 18 0 28C0 38 6.5 45 14.5 45C22.5 45 29 38 29 28C29 18 22.5 8 14.5 0Z"
        fill="#515CDB"
      />
    </svg>
  );
}

function Library({
  lessons,
  loading,
  error,
  onOpen,
  onCreate,
  onAssistant,
}: {
  lessons: LessonSummary[];
  loading: boolean;
  error: string | null;
  onOpen: (id: string) => void;
  onCreate: () => void;
  onAssistant: () => void;
}) {
  return (
    <div className="bg-white h-full rounded-[10px] border border-black/[0.07] overflow-y-auto scrollbar-thin">
      <div className="px-8 pt-8 pb-6">
        <button
          onClick={onAssistant}
          className="inline-flex items-center gap-2 rounded-full border border-[#c8cdff] bg-[var(--accent-soft)] px-4 py-2 text-[13px] font-medium text-[#0025E5] tracking-[-0.13px] hover:bg-[#e4e7ff] transition-colors"
        >
          <Bot size={16} />
          Fale com seu assistente de Magicboard
        </button>

        <h1 className="display text-[28px] tracking-[-0.8px] mt-8 mb-1">Bem-vindo de volta</h1>
        <p className="text-[var(--muted)] text-[14px] tracking-[-0.14px]">
          Da planificação à sala de aula — comece pela jornada pedagógica da sua lição.
        </p>

        <h2 className="display text-[20px] tracking-[-0.64px] mt-10 mb-4">Ações rápidas</h2>
        <div className="flex flex-wrap gap-3">
          <QuickActionCard
            title="Nova Lição Mágica"
            description="Crie aulas interativas potenciadas por IA"
            onClick={onCreate}
            accent
          />
          <QuickActionCard
            title="Teacher Assistant"
            description="Peça ajuda para adaptar, avaliar ou justificar"
            onClick={onAssistant}
          />
        </div>

        <h2 className="display text-[20px] tracking-[-0.64px] mt-10 mb-4">Suas lições</h2>
        {error && <p className="mb-4 text-sm text-[var(--danger)]">{error}</p>}
        {loading && !lessons.length ? (
          <p className="text-[var(--muted)]">Carregando…</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {lessons.map((l) => {
              const pct = Math.round((l.progress.completedStepIds.length / Math.max(1, 6)) * 100);
              return (
                <button
                  key={l.id}
                  onClick={() => onOpen(l.id)}
                  className="text-left rounded-[11px] border border-[var(--line)] bg-white p-4 hover:border-[var(--accent-border)] hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] text-[var(--muted-light)] tracking-[-0.1px]">
                        {l.subject} · {l.gradeLabel} · {l.durationMinutes} min
                      </p>
                      <h3 className="display text-[16px] tracking-[-0.5px] mt-1">{l.title}</h3>
                    </div>
                    <span className="text-[11px] font-semibold rounded-[4px] bg-[var(--accent-soft)] text-[var(--brand)] px-2 py-0.5">
                      {pct}%
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--muted-light)] mt-3">
                    Atualizado {new Date(l.updatedAt).toLocaleString()}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function QuickActionCard({
  title,
  description,
  onClick,
  accent,
}: {
  title: string;
  description: string;
  onClick: () => void;
  accent?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="text-left rounded-[11px] p-4 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 w-full max-w-[339px] min-h-[165px]"
      style={{ background: accent ? '#EEF0FF' : '#F4F5F7' }}
    >
      <div
        className="w-10 h-9 rounded-md flex items-center justify-center mb-8"
        style={{ background: accent ? '#6674FF' : '#61647A' }}
      >
        {accent ? <Sparkles size={18} className="text-white" /> : <Bot size={18} className="text-white" />}
      </div>
      <p className="display text-[16px] tracking-[-0.54px] text-[var(--ink)]">{title}</p>
      <p className="text-[14px] text-[#453e64] tracking-[-0.14px] mt-2 leading-snug">{description}</p>
    </button>
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
    <div className="bg-white h-full rounded-[10px] border border-black/[0.07] overflow-y-auto scrollbar-thin">
      <header className="sticky top-0 z-10 bg-white flex items-center gap-3 px-5 py-3 border-b border-[var(--line-soft)]">
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 h-[30px] px-2.5 rounded-md border border-[var(--line)] text-[12px] text-[var(--muted)] hover:bg-[var(--accent-soft)] hover:text-[var(--brand)]"
        >
          <ArrowLeft size={14} /> Voltar
        </button>
        <h1 className="display text-[15px] tracking-[-0.5px]">Nova Lição Mágica</h1>
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
        <JourneyIntro
          question="Por onde começar?"
          subtitle="Conte o essencial — a IA monta a jornada pedagógica completa."
        />
        {(
          [
            ['topic', 'Tópico da aula'],
            ['subject', 'Disciplina'],
            ['grade', 'Ano (1–12 ou uni)'],
            ['duration', 'Duração (min)'],
            ['teaching_method', 'Método de ensino'],
            ['curriculum_framework', 'Framework curricular'],
            ['curriculum_alignment_notes', 'Notas de alinhamento BNCC'],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="block text-sm">
            <span className="font-medium text-[var(--muted)] text-[12px] tracking-[-0.12px]">{label}</span>
            <input
              className="mt-1 w-full rounded-lg border border-[var(--line)] bg-white px-3 py-2.5 text-[14px] focus:outline-none focus:border-[var(--accent-border)]"
              value={String(form[key as keyof typeof form])}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            />
          </label>
        ))}
        <label className="block text-sm">
          <span className="font-medium text-[var(--muted)] text-[12px]">Complexidade</span>
          <select
            className="mt-1 w-full rounded-lg border border-[var(--line)] bg-white px-3 py-2.5 text-[14px]"
            value={form.complexity}
            onChange={(e) => setForm((f) => ({ ...f, complexity: e.target.value }))}
          >
            <option value="easy">Fácil</option>
            <option value="standard">Padrão</option>
            <option value="advanced">Avançado</option>
          </select>
        </label>
        {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
        <button
          disabled={loading}
          className="w-full rounded-lg bg-[var(--accent)] text-white py-3 font-semibold inline-flex items-center justify-center gap-2 hover:opacity-95"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
          Gerar jornada pedagógica
        </button>
      </form>
    </div>
  );
}

function TeacherHub({
  lesson,
  onBack,
  onPresent,
  onAssistant,
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
  onBack: () => void;
  onPresent: () => void;
  onAssistant: () => void;
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
  const [phase, setPhase] = useState<JourneyPhase>('ensinar');
  const [notesDraft, setNotesDraft] = useState(lesson.userNotes);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => setNotesDraft(lesson.userNotes), [lesson.userNotes]);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const onScroll = () => {
      for (let i = JOURNEY.length - 1; i >= 0; i--) {
        const el = document.getElementById(JOURNEY[i].id);
        if (el && el.getBoundingClientRect().top <= 160) {
          setPhase(JOURNEY[i].id);
          return;
        }
      }
      setPhase('ensinar');
    };
    root.addEventListener('scroll', onScroll, { passive: true });
    return () => root.removeEventListener('scroll', onScroll);
  }, []);

  function jump(id: JourneyPhase) {
    setPhase(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="bg-white h-full rounded-[10px] border border-black/[0.07] flex flex-col overflow-hidden">
      <header
        className="shrink-0 sticky top-0 z-10 bg-white flex items-center gap-4 px-5 py-3"
        style={{ borderBottom: '1px solid #EDEEF5' }}
      >
        <button
          onClick={onBack}
          className="shrink-0 flex items-center gap-1.5 h-[30px] px-2.5 text-[var(--muted)] rounded-md border border-[var(--line)] text-[12px] hover:bg-[var(--accent-soft)] hover:text-[var(--brand)]"
        >
          <ArrowLeft size={14} /> Voltar
        </button>
        <div className="h-5 w-px bg-[var(--line)] shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 min-w-0 flex-wrap">
            <h1 className="display text-[15px] tracking-[-0.5px] truncate">{plan.title.content}</h1>
            <Tag>{plan.lessonInfo.subject}</Tag>
            <Tag muted>{plan.lessonInfo.gradeLabel}</Tag>
            <Tag muted>{plan.lessonInfo.durationMinutes} min</Tag>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <IconBtn icon={<Share2 size={14} />} label="Partilhar" />
          <IconBtn icon={<Download size={14} />} label="Download" />
          <button
            onClick={onPresent}
            className="flex items-center gap-1.5 h-[30px] px-3 rounded-md bg-[var(--accent)] text-white text-[12px] font-medium hover:opacity-95"
          >
            <Presentation size={14} /> Apresentar
          </button>
        </div>
      </header>

      <div className="flex-1 flex min-h-0">
        <aside
          className="shrink-0 flex flex-col py-4 overflow-y-auto scrollbar-thin"
          style={{ width: 188, borderRight: '1px solid #F0F1F7', paddingLeft: 10, paddingRight: 10 }}
        >
          <p className="text-[var(--muted-light)] text-[10px] uppercase tracking-[0.5px] mb-2 px-2">Jornada</p>
          {JOURNEY.map((j) => (
            <button
              key={j.id}
              onClick={() => jump(j.id)}
              className={`w-full text-left px-2 py-2 rounded-lg mb-0.5 transition-colors ${
                phase === j.id ? 'bg-[var(--accent-soft)]' : 'hover:bg-[#F4F5FF]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] font-semibold rounded px-1.5 py-0.5"
                  style={{
                    background: phase === j.id ? '#6674FF' : '#F4F5F7',
                    color: phase === j.id ? '#fff' : '#61647A',
                  }}
                >
                  {j.tag}
                </span>
                <span
                  className={`text-[12px] font-medium tracking-[-0.3px] ${
                    phase === j.id ? 'text-[var(--brand)]' : 'text-[var(--ink)]'
                  }`}
                >
                  {j.label}
                </span>
              </div>
              <p className="text-[10px] text-[var(--muted-light)] mt-0.5 pl-7 leading-snug">{j.subtitle}</p>
            </button>
          ))}
          <div className="mt-4 px-2 pt-4 border-t border-[var(--line-soft)]">
            <p className="text-[10px] uppercase tracking-[0.5px] text-[var(--muted-light)] mb-2">Progresso</p>
            <ProgressRing value={pct} label={`${pct}%`} />
            <p className="text-[11px] text-[var(--muted)] mt-2">{lesson.progress.completedStepIds.length} etapas concluídas</p>
          </div>
        </aside>

        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin min-h-0">
          <div className="max-w-3xl mx-auto px-6 py-6 space-y-8">
            {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
            {loading && (
              <p className="text-sm text-[var(--muted)] inline-flex items-center gap-2">
                <Loader2 className="animate-spin" size={14} /> Atualizando…
              </p>
            )}

            <JourneySection id="ensinar" phase={JOURNEY[0]} onRegen={() => onRegenerate('objective')}>
              <LessonHero plan={plan} />
              <Block title={plan.objective.title} subtitle={plan.objective.description}>
                <BulletList items={plan.objective.content.goals} />
                <TeacherTip text={plan.objective.content.curriculumHighlight} />
              </Block>
              <Block title={plan.keyConcepts.title} subtitle="Conceitos-chave desta aula">
                <div className="flex flex-wrap gap-2">
                  {plan.keyConcepts.content.map((k) => (
                    <span
                      key={k}
                      className="text-[13px] rounded-lg px-3 py-1.5 bg-[var(--accent-soft)] text-[var(--brand)] border border-[#e8eaff]"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </Block>
            </JourneySection>

            <JourneySection id="metodo" phase={JOURNEY[1]}>
              <Block title="Roteiro da Aula" subtitle="Fluxo passo a passo — do aquecimento à avaliação">
                <RoteiroList
                  roteiro={roteiro}
                  completed={lesson.progress.completedStepIds}
                  current={lesson.progress.currentStepId}
                  onToggle={onToggleStep}
                />
              </Block>
              <ContentBlock plan={plan} block={plan.starter} onRegen={() => onRegenerate('starter')} />
              <ContentBlock plan={plan} block={plan.contentDiscovery} onRegen={() => onRegenerate('contentDiscovery')} />
              <Block title={plan.teachingSteps.title} subtitle={plan.teachingSteps.description}>
                {plan.teachingSteps.content.map((s) => (
                  <StepCard key={s.step} step={s} />
                ))}
              </Block>
            </JourneySection>

            <JourneySection id="engajar" phase={JOURNEY[2]} onRegen={() => onRegenerate('activities')}>
              <Block title={plan.activities.title} subtitle="Aprendizagem prática · engajamento ativo">
                {plan.activities.content.map((a) => (
                  <article key={a.name} className="rounded-lg border border-[var(--line)] p-4 mb-3 last:mb-0">
                    <div className="flex justify-between gap-3">
                      <h4 className="font-semibold text-[13px] text-[var(--ink)]">{a.name}</h4>
                      <span className="text-[11px] text-[var(--muted-light)] whitespace-nowrap">
                        {a.duration} · {a.grouping}
                      </span>
                    </div>
                    <p className="text-[14px] mt-2 leading-relaxed">{a.description}</p>
                    <p className="text-[13px] mt-2 text-[var(--muted)]">
                      <strong>Resultado esperado:</strong> {a.expectedOutcome}
                    </p>
                  </article>
                ))}
              </Block>
              <Block title={plan.mindmap.title} subtitle="Visualize conexões para motivar a turma">
                <pre className="rounded-lg bg-[#0f0f14] text-emerald-100 p-4 text-[11px] overflow-x-auto whitespace-pre-wrap">
                  {plan.mindmap.content}
                </pre>
                <button
                  onClick={() => onGenerate('mindmap')}
                  className="mt-3 text-[12px] rounded-lg border border-[var(--line)] px-3 py-2 hover:border-[var(--accent-border)]"
                >
                  Exportar mapa mental
                </button>
              </Block>
            </JourneySection>

            <JourneySection id="avaliar" phase={JOURNEY[3]} onRegen={() => onRegenerate('assessment')}>
              <Block title={plan.assessment.title} subtitle="Verificar a compreensão">
                <p className="text-[14px]">
                  <strong>Diagnóstico:</strong> {plan.assessment.content.diagnosticPrompt}
                </p>
                <div className="space-y-2 mt-4">
                  {plan.assessment.content.quickChecks.map((q) => (
                    <div key={q.id} className="rounded-lg border border-[var(--line)] p-3 text-[14px]">
                      <span className="text-[11px] font-semibold text-[var(--brand)]">
                        {q.id} · {q.bloomLevel}
                      </span>
                      <p className="mt-1">{q.prompt}</p>
                    </div>
                  ))}
                </div>
                <TeacherTip text={`Saída: ${plan.assessment.content.exitCheck}`} />
                <button
                  onClick={() => onGenerate('quiz')}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] text-white px-4 py-2 text-[13px] font-medium"
                >
                  <Sparkles size={14} /> Gerar quiz interativo
                </button>
              </Block>
            </JourneySection>

            <JourneySection id="adaptar" phase={JOURNEY[4]}>
              <Block title="Adaptações e diferenciação" subtitle="Para que todos participem com sucesso">
                <AdaptGrid plan={plan} />
              </Block>
              <Block title={plan.materialsNeeded.title} subtitle="Preparação da aula">
                <MaterialsGrid plan={plan} />
              </Block>
              <Block title={plan.teachersNotes.title} subtitle="Dicas e diferenciação">
                {plan.teachersNotes.content.map((n, i) => (
                  <div key={i} className="rounded-lg border border-[var(--line)] p-3 text-[14px] mb-2">
                    <span className="text-[10px] uppercase font-semibold text-[var(--brand)]">{n.type}</span>
                    <p className="mt-1">{n.text}</p>
                  </div>
                ))}
                <label className="block mt-4">
                  <span className="text-[12px] font-medium text-[var(--muted)]">Nota privada do professor</span>
                  <textarea
                    value={notesDraft}
                    onChange={(e) => setNotesDraft(e.target.value)}
                    onBlur={() => onNotes(notesDraft)}
                    className="mt-1 w-full min-h-24 rounded-lg border border-amber-200 bg-[var(--warm-soft)] p-3 text-[14px]"
                    placeholder="Lembrete só para você…"
                  />
                </label>
              </Block>
            </JourneySection>

            <JourneySection id="justificar" phase={JOURNEY[5]}>
              <CurriculumJustification plan={plan} coverage={lesson.curriculumCoverage} />
              <Block title="Fontes da Aula" subtitle="Evidências que sustentam o conteúdo">
                <SourcesDonut byType={plan.sourcesSummary.byType} />
                <ul className="mt-3 space-y-1">
                  {plan.sourcesSummary.items.map((s) => (
                    <li key={s.name} className="text-[13px] text-[var(--muted)]">
                      · {s.name}
                    </li>
                  ))}
                </ul>
              </Block>
            </JourneySection>

            <JourneySection id="entregar" phase={JOURNEY[6]}>
              <div className="rounded-[11px] p-6 text-white" style={{ background: 'linear-gradient(135deg, #515CDB, #6674FF)' }}>
                <p className="text-[11px] uppercase tracking-[0.5px] opacity-80">Pronto para a sala?</p>
                <h3 className="display text-[22px] tracking-[-0.6px] mt-2">Entregar a aula</h3>
                <p className="text-[14px] mt-2 opacity-90 max-w-md">
                  Você percorreu a jornada — objetivos, método, engajamento, avaliação, adaptação e justificativa. Agora leve para a turma.
                </p>
                <div className="flex flex-wrap gap-2 mt-5">
                  <button
                    onClick={onPresent}
                    className="inline-flex items-center gap-2 rounded-lg bg-white text-[var(--brand)] px-4 py-2.5 text-[13px] font-semibold"
                  >
                    <Play size={14} /> Apresentar slides
                  </button>
                  <button
                    onClick={() => onGenerate('slides')}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-4 py-2.5 text-[13px] font-medium"
                  >
                    <Sparkles size={14} /> Gerar slides
                  </button>
                  <button
                    onClick={onAssistant}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-4 py-2.5 text-[13px] font-medium"
                  >
                    <MessageSquare size={14} /> Assistente IA
                  </button>
                </div>
              </div>
              <Block title="Ferramentas de IA" subtitle="Materiais derivados do plano">
                <div className="grid sm:grid-cols-2 gap-2">
                  {Object.keys(TOOL_META).map((tool) => {
                    const meta = TOOL_META[tool];
                    return (
                      <button
                        key={tool}
                        disabled={busyTool === tool}
                        onClick={() => onGenerate(tool)}
                        className="flex items-start gap-2 rounded-lg border border-[var(--line)] px-3 py-2.5 text-left hover:border-[var(--accent-border)] disabled:opacity-60"
                      >
                        <span>{meta.icon}</span>
                        <span>
                          <span className="block text-[13px] font-medium">{meta.label}</span>
                          <span className="block text-[11px] text-[var(--muted-light)]">{meta.description}</span>
                        </span>
                        {busyTool === tool && <Loader2 className="ml-auto animate-spin" size={14} />}
                      </button>
                    );
                  })}
                </div>
              </Block>
              {lesson.artifacts.length > 0 && (
                <Block title="Artefatos gerados" subtitle="Outputs prontos para usar">
                  <ul className="space-y-1">
                    {lesson.artifacts.map((a) => (
                      <li key={a.id}>
                        <button
                          onClick={() => onOpenArtifact(a)}
                          className="text-[13px] text-[var(--brand)] hover:underline"
                        >
                          {a.tool}: {a.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </Block>
              )}
            </JourneySection>
          </div>
        </div>
      </div>
    </div>
  );
}

function JourneyIntro({ question, subtitle }: { question: string; subtitle: string }) {
  return (
    <div className="rounded-lg p-4 mb-2" style={{ background: '#F8F9FF', border: '1px solid #E8EAFF' }}>
      <p className="text-[11px] uppercase tracking-[0.5px] text-[var(--brand)] font-semibold">{question}</p>
      <p className="text-[14px] mt-1 leading-relaxed">{subtitle}</p>
    </div>
  );
}

function JourneySection({
  id,
  phase,
  children,
  onRegen,
}: {
  id: JourneyPhase;
  phase: (typeof JOURNEY)[number];
  children: ReactNode;
  onRegen?: () => void;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.5px] text-[var(--brand)] font-semibold">{phase.question}</p>
          <h2 className="display text-[20px] tracking-[-0.64px] mt-1">{phase.label}</h2>
          <p className="text-[13px] text-[var(--muted)] mt-0.5">{phase.subtitle}</p>
        </div>
        {onRegen && (
          <button
            onClick={onRegen}
            className="shrink-0 text-[11px] rounded-md border border-[var(--line)] px-2 py-1 hover:border-[var(--accent-border)]"
          >
            Regenerar
          </button>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Block({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <article className="rounded-[10px] border border-black/[0.07] bg-white overflow-hidden">
      <header className="px-5 py-4 border-b border-[var(--line-soft)] flex items-start justify-between gap-3">
        <div>
          <h3 className="display text-[15px] tracking-[-0.4px]">{title}</h3>
          {subtitle && <p className="text-[12px] text-[var(--muted-light)] mt-0.5">{subtitle}</p>}
        </div>
        <span className="text-[10px] font-semibold rounded px-2 py-0.5 bg-[var(--accent-soft)] text-[var(--brand)]">
          Magic AI
        </span>
      </header>
      <div className="px-5 py-4">{children}</div>
    </article>
  );
}

function LessonHero({ plan }: { plan: LessonPlan }) {
  return (
    <div
      className="rounded-[11px] p-6 text-white overflow-hidden relative"
      style={{ background: 'linear-gradient(120deg, #08134C 0%, #515CDB 55%, #6674FF 100%)' }}
    >
      <p className="text-[11px] uppercase tracking-[0.18em] opacity-75">{plan.lessonInfo.subject}</p>
      <h2 className="display text-[26px] tracking-[-0.8px] mt-2 max-w-xl">{plan.title.content}</h2>
      <p className="text-[14px] mt-2 opacity-90 max-w-lg leading-relaxed">{plan.title.description}</p>
      <div className="flex flex-wrap gap-2 mt-4">
        <Tag inverted>{plan.lessonInfo.gradeLabel}</Tag>
        <Tag inverted>{plan.lessonInfo.durationMinutes} min</Tag>
        <Tag inverted>{plan.curriculum.framework}</Tag>
        <Tag inverted>{plan.curriculum.thematicUnit}</Tag>
      </div>
    </div>
  );
}

function ContentBlock({
  block,
  onRegen,
}: {
  plan: LessonPlan;
  block: LessonPlan['starter'];
  onRegen: () => void;
}) {
  return (
    <Block title={block.title} subtitle={`${block.description} · ${block.durationMinutes} min`}>
      <p className="text-[13px] text-[var(--muted)] mb-3">{block.sectionObjective}</p>
      <div className="rounded-lg p-4 mb-3" style={{ background: '#F8F9FF', border: '1px solid #E8EAFF' }}>
        <p className="text-[11px] font-semibold text-[var(--brand)] uppercase tracking-wide mb-1">O Professor Diz</p>
        <p className="text-[14px] whitespace-pre-wrap leading-relaxed">{block.teacherScript}</p>
      </div>
      <p className="text-[14px] leading-relaxed">{block.body}</p>
      <div className="grid gap-2 mt-3">
        {block.callouts.map((c, i) => (
          <Callout key={i} type={c.type} title={c.title} text={c.text} />
        ))}
      </div>
      <button onClick={onRegen} className="mt-3 text-[11px] rounded-md border border-[var(--line)] px-2 py-1">
        Regenerar seção
      </button>
    </Block>
  );
}

function StepCard({ step }: { step: LessonPlan['teachingSteps']['content'][number] }) {
  return (
    <div className="flex gap-3 items-start mb-4 last:mb-0">
      <div
        className="shrink-0 w-[26px] h-[26px] rounded-full flex items-center justify-center text-white text-[12px] font-semibold"
        style={{ background: '#6674FF' }}
      >
        {step.step}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-[13px] text-[var(--ink)]">{step.phase}</p>
        <p className="text-[11px] text-[var(--muted-light)]">{step.durationMinutes} min · {step.bloomLevel}</p>
        {step.teacherScript && (
          <p className="text-[14px] mt-2 leading-relaxed whitespace-pre-wrap">{step.teacherScript}</p>
        )}
      </div>
    </div>
  );
}

function RoteiroList({
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
  const done = new Set(completed);
  return (
    <ol className="space-y-2">
      {roteiro.map((node) => {
        const isDone = done.has(node.id);
        const isCurrent = current === node.id && !isDone;
        return (
          <li key={node.id} className="flex items-start gap-3 rounded-lg border border-[var(--line)] p-3">
            <button onClick={() => onToggle(node.id)} className="mt-0.5 text-[var(--accent)]">
              {isDone ? (
                <CheckCircle2 size={18} />
              ) : isCurrent ? (
                <Circle size={18} className="text-[var(--warm)]" />
              ) : (
                <Circle size={18} className="text-slate-300" />
              )}
            </button>
            <div className="flex-1">
              <div className="flex justify-between gap-2">
                <p className="text-[13px] font-medium">
                  <span className="text-[var(--muted-light)] mr-2">{node.n}.</span>
                  {node.title}
                </p>
                <span className="text-[11px] text-[var(--muted-light)]">{node.duration}</span>
              </div>
              {isCurrent && (
                <span className="inline-block mt-1 text-[10px] uppercase font-semibold text-[var(--warm)] bg-[var(--warm-soft)] px-2 py-0.5 rounded">
                  Em andamento
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function AdaptGrid({ plan }: { plan: LessonPlan }) {
  const d = plan.differentiation;
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {(
        [
          ['Apoio', d.supportStudents],
          ['Avançados', d.advancedStudents],
          ['Rápidos', d.fastFinishers],
          ['Multilíngue', d.multilingualSupport],
        ] as const
      ).map(([label, items]) => (
        <div key={label} className="rounded-lg border border-[var(--line)] p-3">
          <h4 className="text-[12px] font-semibold">{label}</h4>
          <ul className="mt-2 list-disc pl-4 text-[13px] text-[var(--muted)] space-y-1">
            {items.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function MaterialsGrid({ plan }: { plan: LessonPlan }) {
  const m = plan.materialsNeeded.content;
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {(
        [
          ['Físicos', m.physicalResources],
          ['Digitais', m.digitalResources],
          ['Professor', m.teacherResources],
          ['Aluno', m.studentResources],
        ] as const
      ).map(([label, items]) => (
        <div key={label} className="rounded-lg border border-[var(--line)] p-3">
          <h4 className="text-[12px] font-semibold">{label}</h4>
          <ul className="mt-2 list-disc pl-4 text-[13px] text-[var(--muted)]">
            {items.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function CurriculumJustification({ plan, coverage }: { plan: LessonPlan; coverage: number }) {
  const c = plan.curriculum;
  return (
    <Block title="Alinhamento Curricular" subtitle="Como justificar pedagogicamente esta aula">
      <div className="flex items-start justify-between gap-4 mb-4">
        <p className="text-[13px] text-[var(--muted)]">
          Cobertura dos campos de alinhamento ({coverage}% — indicador interno, não oficial BNCC)
        </p>
        <ProgressRing value={coverage} label={`${coverage}%`} />
      </div>
      <div className="grid md:grid-cols-2 gap-4 text-[14px]">
        <div>
          <p className="text-[11px] font-semibold text-[var(--muted-light)] uppercase">Unidade / Objeto</p>
          <p className="mt-1 font-medium">{c.thematicUnit}</p>
          <p className="text-[var(--muted)]">{c.objectOfKnowledge}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-[var(--muted-light)] uppercase">Habilidades</p>
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
          <p className="text-[11px] font-semibold text-[var(--muted-light)] uppercase">Competências gerais</p>
          <ul className="mt-1 list-disc pl-4 text-[var(--muted)]">
            {c.generalCompetencies.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-[var(--muted-light)] uppercase">Aprendizagens esperadas</p>
          <BulletList items={c.expectedLearning} />
        </div>
      </div>
    </Block>
  );
}

function AssistantView({
  lesson,
  onOpenLesson,
}: {
  lesson: HubLesson | null;
  onOpenLesson?: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'assistant',
      text: 'Sou o seu assistente de IA Magicboard. Posso ajudá-lo a criar aulas, gerar questões, dar feedback pedagógico ou adaptar conteúdo para a sua turma.',
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  function send(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || typing) return;
    setInput('');
    setMessages((m) => [...m, { id: Date.now().toString(), role: 'user', text: msg }]);
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { id: (Date.now() + 1).toString(), role: 'assistant', text: assistantReply(msg, lesson) },
      ]);
      setTyping(false);
    }, 1200);
  }

  return (
    <div className="bg-white rounded-[10px] border border-black/[0.07] h-full flex overflow-hidden">
      <div
        className="shrink-0 flex flex-col border-r border-[var(--line)] transition-all duration-200 overflow-hidden"
        style={{ width: sidebarOpen ? 240 : 0, opacity: sidebarOpen ? 1 : 0 }}
      >
        <div className="flex items-center justify-between px-3.5 py-3.5 border-b border-[var(--line)]">
          <div className="flex items-center gap-2">
            <div className="w-[26px] h-[26px] rounded-full bg-[var(--accent-soft)] flex items-center justify-center">
              <Bot size={12} className="text-[var(--accent)]" />
            </div>
            <span className="text-[13px] font-semibold tracking-[-0.4px]">Conversas</span>
          </div>
        </div>
        <div className="px-2.5 pt-2.5">
          <button
            onClick={() => setMessages([{ id: '0', role: 'assistant', text: assistantReply('', lesson) }])}
            className="w-full flex items-center gap-1.5 h-[34px] px-2.5 rounded-lg border border-dashed border-[#c8cdff] text-[var(--accent)] text-[13px] font-medium hover:bg-[var(--accent-soft)]"
          >
            <Plus size={14} /> Nova conversa
          </button>
        </div>
        {lesson && onOpenLesson && (
          <div className="px-2.5 mt-3">
            <button
              onClick={onOpenLesson}
              className="w-full text-left px-2 py-2 rounded-lg bg-[var(--accent-soft)] text-[12px] font-medium text-[var(--brand)]"
            >
              Abrir: {lesson.lessonPlan.title.content}
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-[var(--line-soft)]">
          <button onClick={() => setSidebarOpen((v) => !v)} className="text-[var(--muted)] hover:text-[var(--brand)]">
            <MessageSquare size={18} />
          </button>
          <div>
            <h1 className="display text-[15px] tracking-[-0.5px]">Teacher Assistant</h1>
            <p className="text-[11px] text-[var(--muted-light)]">Apoio pedagógico em tempo real</p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4 space-y-4">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-[12px] px-4 py-3 text-[14px] leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-[var(--accent)] text-white'
                    : 'bg-[#F4F5F7] text-[var(--body)] border border-[var(--line-soft)]'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex gap-1 px-2">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full bg-[var(--accent)]"
                  style={{ animation: `typingBounce 1s ease infinite`, animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="shrink-0 px-4 pb-4">
          <div className="flex flex-wrap gap-2 mb-3">
            {ASSISTANT_STARTERS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-[11px] rounded-full border border-[var(--line)] px-3 py-1 hover:border-[var(--accent-border)] hover:bg-[var(--accent-soft)]"
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-end gap-2 rounded-[12px] border border-[var(--line)] bg-white p-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={1}
              placeholder="Pergunte sobre planificação, BNCC, avaliação…"
              className="flex-1 resize-none border-0 bg-transparent text-[14px] focus:outline-none max-h-[120px] py-2 px-2"
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || typing}
              className="shrink-0 w-9 h-9 rounded-lg bg-[var(--accent)] text-white flex items-center justify-center disabled:opacity-40"
            >
              <Sparkles size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function assistantReply(prompt: string, lesson: HubLesson | null): string {
  const p = prompt.toLowerCase();
  const topic = lesson?.lessonPlan.title.content ?? 'sua aula';
  if (!prompt)
    return 'Sou o seu assistente de IA Magicboard. Posso ajudá-lo a criar aulas, gerar questões, dar feedback pedagógico ou adaptar conteúdo para a sua turma.';
  if (p.includes('bncc') || p.includes('justif'))
    return `Para ${topic}, destaque a unidade temática "${lesson?.lessonPlan.curriculum.thematicUnit ?? '…'}" e as competências gerais da BNCC. Relacione cada objetivo a uma evidência observável na sala — diagrama, discussão ou produto do aluno.`;
  if (p.includes('avali') || p.includes('checagem') || p.includes('quiz'))
    return `Sugiro uma checagem formativa em 3 minutos: pergunta de saída alinhada ao objetivo principal, plus duas perguntas rápidas (recordar + aplicar). Posso gerar um quiz completo na fase "Como avaliar" da jornada.`;
  if (p.includes('adapt') || p.includes('simplif') || p.includes('grupo'))
    return `Para adaptar ${topic}: reduza o tempo da atividade em grupo, forneça sentence starters e um diagrama parcialmente preenchido. Consulte a fase "Como adaptar" para diferenciação por perfil.`;
  if (p.includes('engaj') || p.includes('discuss'))
    return `Engaje com uma pergunta provocadora nos primeiros 2 minutos, depois alterne pares→plenary. Use o mapa mental como ancora visual durante a atividade em grupo.`;
  return `Entendi. Para "${prompt}" em ${topic}, recomendo revisar a jornada pedagógica: confirme objetivos (O que ensinar), ajuste o roteiro (Como ensinar) e valide com uma checagem rápida antes de apresentar. Quer que eu detalhe alguma fase?`;
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
    <div className="fixed inset-0 z-50 flex flex-col text-white" style={{ background: 'linear-gradient(160deg, #08134C, #1b1d25)' }}>
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
          <h1 className="display text-4xl md:text-5xl leading-tight tracking-[-0.04em]">{slide.title}</h1>
          <p className="mt-8 text-xl md:text-2xl text-white/85 whitespace-pre-wrap leading-relaxed">{slide.body}</p>
        </div>
      </div>
      <div className="flex justify-center gap-3 pb-8">
        <button onClick={() => setI((x) => Math.max(0, x - 1))} className="rounded-full border border-white/20 px-5 py-2">
          Anterior
        </button>
        <button
          onClick={() => setI((x) => Math.min(slides.length - 1, x + 1))}
          className="rounded-full bg-[var(--accent)] px-5 py-2 font-medium"
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
    <div className="bg-white h-full rounded-[10px] border border-black/[0.07] overflow-y-auto scrollbar-thin">
      <header className="sticky top-0 bg-white border-b border-[var(--line-soft)] px-5 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-[var(--accent-soft)]">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-wide text-[var(--muted-light)]">{artifact.tool}</p>
          <h1 className="display text-[18px] tracking-[-0.5px]">{artifact.title}</h1>
        </div>
        {artifact.tool === 'slides' && (
          <button
            onClick={onPresent}
            className="rounded-lg bg-[var(--accent)] text-white px-3 py-2 text-[13px] font-semibold"
          >
            Apresentar
          </button>
        )}
      </header>
      <pre className="max-w-4xl mx-auto m-6 rounded-lg border border-[var(--line)] bg-[#F4F5F7] p-4 text-[11px] overflow-auto scrollbar-thin">
        {JSON.stringify(artifact.payload, null, 2)}
      </pre>
    </div>
  );
}

function Tag({ children, muted, inverted }: { children: ReactNode; muted?: boolean; inverted?: boolean }) {
  if (inverted) {
    return (
      <span className="text-[11px] rounded px-2 py-0.5 bg-white/15 border border-white/20 text-white">{children}</span>
    );
  }
  return (
    <span
      className="text-[11px] rounded px-2 py-0.5 tracking-[-0.1px]"
      style={{
        background: muted ? '#F4F5F7' : '#EEF0FF',
        color: muted ? '#61647A' : '#515CDB',
      }}
    >
      {children}
    </span>
  );
}

function IconBtn({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <button className="flex items-center gap-1 h-[30px] px-3 rounded-md bg-[#F4F5F7] text-[#3a3c4b] text-[12px] font-medium hover:bg-[#EDEDF4]">
      {icon}
      <span>{label}</span>
    </button>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-[14px] leading-relaxed">
          <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-2" style={{ background: '#6674FF' }} />
          {item}
        </li>
      ))}
    </ul>
  );
}

function TeacherTip({ text }: { text: string }) {
  return (
    <div className="mt-4 rounded-lg p-3 text-[14px]" style={{ background: '#F8F9FF', border: '1px solid #E8EAFF' }}>
      {text}
    </div>
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
    <div className={`rounded-lg border px-3 py-2 text-[13px] ${colors[type] || 'border-slate-200 bg-slate-50'}`}>
      <p className="font-semibold text-[11px] uppercase tracking-wide">{title}</p>
      <p className="mt-1">{text}</p>
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
          stroke="#6674FF"
          strokeWidth="4"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      {label && (
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[var(--ink)]">
          {label}
        </span>
      )}
    </div>
  );
}

function SourcesDonut({ byType }: { byType: { type: string; count: number }[] }) {
  const total = byType.reduce((s, b) => s + b.count, 0) || 1;
  return (
    <div className="text-[12px] space-y-1">
      {byType.map((b) => (
        <div key={b.type} className="flex items-center gap-2">
          <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-[var(--accent)]" style={{ width: `${(b.count / total) * 100}%` }} />
          </div>
          <span className="w-28 truncate text-[var(--muted-light)]">
            {b.type} ({b.count})
          </span>
        </div>
      ))}
    </div>
  );
}
