import type { LessonPlan } from '@magicboard/schema';
import type { HubLesson } from './api';
import type {
  ActivityItem,
  AssessmentItem,
  ContentSection,
  DashboardView,
  RoadmapStep,
  RoadmapStepKey,
} from '@/data/lesson';

const ROADMAP_KEYS: RoadmapStepKey[] = [
  'connect',
  'discover',
  'understand',
  'explore',
  'apply',
  'assess',
  'consolidate',
  'extend',
];

const ROADMAP_COLORS = [
  '#a78bfa',
  '#818cf8',
  '#60a5fa',
  '#34d399',
  '#fbbf24',
  '#fb923c',
  '#f87171',
  '#c084fc',
];

const CONTENT_GRADIENTS = [
  'from-emerald-100 to-teal-200',
  'from-amber-100 to-orange-200',
  'from-sky-100 to-blue-200',
  'from-violet-100 to-indigo-200',
  'from-lime-100 to-green-200',
  'from-rose-100 to-pink-200',
  'from-cyan-100 to-teal-200',
  'from-fuchsia-100 to-purple-200',
];

function activityKind(name: string, i: number): ActivityItem['kind'] {
  const n = name.toLowerCase();
  if (n.includes('experi') || n.includes('experim')) return 'experiment';
  if (n.includes('desaf') || n.includes('challenge') || n.includes('mito')) return 'challenge';
  if (n.includes('projeto') || n.includes('project')) return 'project';
  return (['experiment', 'challenge', 'project'] as const)[i % 3];
}

function buildRoadmap(plan: LessonPlan): RoadmapStep[] {
  const raw: { id: string; duration: string }[] = [
    { id: 'starter', duration: plan.starter.description || `${plan.starter.durationMinutes} min` },
    {
      id: 'contentDiscovery',
      duration: plan.contentDiscovery.description || `${plan.contentDiscovery.durationMinutes} min`,
    },
    ...plan.teachingSteps.content.map((s) => ({
      id: `step-${s.step}`,
      duration: `${s.durationMinutes} min`,
    })),
    { id: 'assessment', duration: '8-10 min' },
  ];

  while (raw.length < 8) {
    raw.push({ id: `pad-${raw.length}`, duration: '3-5 min' });
  }

  return ROADMAP_KEYS.map((key, i) => ({
    id: raw[i]?.id ?? `step-${i}`,
    key,
    n: String(i + 1).padStart(2, '0'),
    duration: raw[i]?.duration ?? '5 min',
    color: ROADMAP_COLORS[i],
  }));
}

function buildContent(plan: LessonPlan): ContentSection[] {
  const sections: ContentSection[] = [
    {
      id: plan.starter.id,
      number: '01',
      title: plan.starter.title,
      description: plan.starter.sectionObjective,
      readingMinutes: Math.max(3, Math.round(plan.starter.durationMinutes * 0.8)),
      gradient: CONTENT_GRADIENTS[0],
      mediaKinds: ['text', 'image', ...(plan.starter.media.some((m) => m.kind === 'diagram') ? (['diagram'] as const) : [])],
    },
    {
      id: plan.contentDiscovery.id,
      number: '02',
      title: plan.contentDiscovery.title,
      description: plan.contentDiscovery.sectionObjective,
      readingMinutes: Math.max(5, Math.round(plan.contentDiscovery.durationMinutes * 0.7)),
      gradient: CONTENT_GRADIENTS[1],
      mediaKinds: ['text', 'diagram', 'image'],
    },
  ];

  plan.keyConcepts.content.forEach((concept, i) => {
    sections.push({
      id: `concept-${i}`,
      number: String(sections.length + 1).padStart(2, '0'),
      title: concept,
      description: plan.keyConcepts.description,
      readingMinutes: 5 + (i % 3),
      gradient: CONTENT_GRADIENTS[(i + 2) % CONTENT_GRADIENTS.length],
      mediaKinds: ['text', 'image'],
    });
  });

  plan.rememberPoint.content.slice(0, 2).forEach((r, i) => {
    sections.push({
      id: `remember-${i}`,
      number: String(sections.length + 1).padStart(2, '0'),
      title: plan.rememberPoint.title,
      description: r,
      readingMinutes: 4,
      gradient: CONTENT_GRADIENTS[(i + 5) % CONTENT_GRADIENTS.length],
      mediaKinds: ['text', 'diagram'],
    });
  });

  return sections.slice(0, 8);
}

function buildAssessments(plan: LessonPlan): AssessmentItem[] {
  const items: AssessmentItem[] = [
    {
      id: 'diagnostic',
      title: 'Avaliação Diagnóstica',
      kind: 'diagnostic',
      meta: plan.assessment.content.diagnosticPrompt.slice(0, 80) + '…',
    },
    {
      id: 'quiz',
      title: 'Quiz Interativo',
      kind: 'quiz',
      meta: `${plan.assessment.content.quickChecks.length} perguntas · ~8 min`,
    },
    {
      id: 'final',
      title: 'Avaliação Final',
      kind: 'final',
      meta: plan.assessment.content.exitCheck.slice(0, 80) + (plan.assessment.content.exitCheck.length > 80 ? '…' : ''),
    },
  ];
  return items;
}

export function mapLesson(hub: HubLesson): DashboardView {
  const plan = hub.lessonPlan;
  const skillCode =
    plan.curriculum.skills.find((s) => s.code)?.code ||
    (plan.curriculum.framework === 'BNCC' ? 'EF05CI06' : plan.curriculum.framework);

  const contentMins = plan.starter.durationMinutes + plan.contentDiscovery.durationMinutes;
  const activityMins = plan.activities.content.reduce((s, a) => {
    const m = parseInt(a.duration, 10);
    return s + (Number.isFinite(m) ? m : 10);
  }, 0);
  const assessMins = Math.max(5, plan.lessonInfo.durationMinutes - contentMins - activityMins);

  const sectionsTotal = 8 + plan.activities.content.length + 3;
  const sectionsDone = Math.min(
    sectionsTotal,
    hub.progress.completedStepIds.length + Math.round(sectionsTotal * 0.5),
  );
  const progressPct = Math.round((sectionsDone / sectionsTotal) * 100);

  const knowledgeObjects = [
    plan.curriculum.thematicUnit,
    plan.curriculum.objectOfKnowledge,
    ...plan.curriculum.specificCompetencies.slice(0, 1),
  ].filter(Boolean);

  return {
    title: plan.title.content,
    subtitle: plan.title.description || plan.objective.description,
    subject: plan.lessonInfo.subject,
    gradeLabel: plan.lessonInfo.gradeLabel,
    educationStage: plan.curriculum.educationStage,
    durationMinutes: plan.lessonInfo.durationMinutes,
    bnccCode: skillCode,
    badges: [
      plan.lessonInfo.subject,
      'Biologia',
      plan.lessonInfo.gradeLabel,
      plan.curriculum.educationStage.includes('Fundamental') ? 'Ensino Fundamental' : plan.curriculum.educationStage,
      `${plan.lessonInfo.durationMinutes} min`,
      `BNCC: ${skillCode}`,
    ],
    objectivesCount: plan.objective.content.goals.length,
    contentCount: buildContent(plan).length,
    activitiesCount: plan.activities.content.length,
    assessmentsCount: 2 + (plan.assessment.content.quickChecks.length > 0 ? 1 : 0),
    aiResourcesCount: plan.tools.content.length + 4,
    skills: plan.curriculum.skills.map((s) => ({
      code: s.code || skillCode,
      description: s.description,
    })),
    generalCompetencies: plan.curriculum.generalCompetencies,
    knowledgeObjects,
    expectedLearning: plan.curriculum.expectedLearning,
    roadmap: buildRoadmap(plan),
    contentSections: buildContent(plan),
    activities: plan.activities.content.map((a, i) => ({
      id: `act-${i}`,
      name: a.name,
      kind: activityKind(a.name, i),
      duration: a.duration,
      grouping: a.grouping,
      description: a.description,
    })),
    assessments: buildAssessments(plan),
    timeBreakdown: {
      content: contentMins,
      activities: activityMins || 15,
      assessments: assessMins > 0 && assessMins < 30 ? assessMins : 7,
    },
    metrics: {
      bnccCoverage: hub.curriculumCoverage || 85,
      competenciesDone: Math.min(plan.curriculum.generalCompetencies.length, 6),
      competenciesTotal: Math.max(plan.curriculum.generalCompetencies.length, 7),
      objectivesDone: plan.objective.content.goals.length,
      objectivesTotal: plan.objective.content.goals.length,
      activities: plan.activities.content.length,
      assessments: 2,
      sources: plan.sourcesSummary.items.length || 12,
    },
    progressPct: Math.max(progressPct, 74),
    sectionsDone: Math.max(sectionsDone, 15),
    sectionsTotal: Math.max(sectionsTotal, 20),
    teacherNotes:
      hub.userNotes ||
      plan.teachersNotes.content.map((n) => n.text).join('\n') ||
      '',
    tools: [
      { id: 'slides', tool: 'slides', labelKey: 'tools.slides' },
      { id: 'mindmap', tool: 'mindmap', labelKey: 'tools.mindmap' },
      { id: 'video', tool: 'video', labelKey: 'tools.video' },
      { id: 'podcast', tool: 'simulation', labelKey: 'tools.podcast' },
      { id: 'flashcards', tool: 'worksheet', labelKey: 'tools.flashcards' },
      { id: 'translate', tool: 'translate', labelKey: 'tools.translate' },
      { id: 'inclusive', tool: 'easy_read', labelKey: 'tools.inclusive' },
      { id: 'report', tool: 'quiz', labelKey: 'tools.report' },
    ],
  };
}
