import { randomUUID } from 'node:crypto';
import type {
  Artifact,
  CreateLessonInput,
  GenerateTool,
  LessonPlan,
  LessonRecord,
} from '@magicboard/schema';
import { buildLessonPlanFromInput, timelineStepIds } from '@magicboard/schema';

const lessons = new Map<string, LessonRecord>();

function now() {
  return new Date().toISOString();
}

export function listLessons(): LessonRecord[] {
  return [...lessons.values()]
    .filter((l) => !l.trashed)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getLesson(id: string): LessonRecord | undefined {
  return lessons.get(id);
}

export function createLesson(input: CreateLessonInput): LessonRecord {
  const lessonPlan = buildLessonPlanFromInput(input);
  const id = randomUUID();
  const ts = now();
  const record: LessonRecord = {
    id,
    createdAt: ts,
    updatedAt: ts,
    coverUrl: null,
    favorite: false,
    trashed: false,
    userNotes: '',
    progress: {
      completedStepIds: [],
      currentStepId: timelineStepIds(lessonPlan)[0] ?? null,
    },
    lessonPlan,
    artifacts: [],
  };
  lessons.set(id, record);
  return record;
}

export function seedGoldenLesson(): LessonRecord {
  const existing = [...lessons.values()].find(
    (l) => l.lessonPlan.title.content === 'Introdução à Fotossíntese',
  );
  if (existing) return existing;
  return createLesson({
    subject: 'Ciências',
    grade: 5,
    topic: 'Introdução à Fotossíntese',
    duration: 50,
    complexity: 'standard',
    teaching_method: 'inquiry-based learning',
    language: 'Portuguese',
    curriculum_framework: 'BNCC',
    curriculum_alignment_notes:
      'Unidade: Vida e evolução; Objeto: plantas e necessidades básicas; nenhum código oficial foi fornecido.',
    bimestre: '',
    lesson_sequence: '',
    points_to_note: '',
    reference_links: '',
    accessibility_profiles: [],
    adaptability_mode: 'standard',
    useFixture: true,
  });
}

export function updateNotes(id: string, text: string): LessonRecord | undefined {
  const lesson = lessons.get(id);
  if (!lesson) return undefined;
  lesson.userNotes = text;
  lesson.updatedAt = now();
  return lesson;
}

export function updateProgress(
  id: string,
  completedStepIds: string[],
  currentStepId: string | null,
): LessonRecord | undefined {
  const lesson = lessons.get(id);
  if (!lesson) return undefined;
  lesson.progress = { completedStepIds, currentStepId };
  lesson.updatedAt = now();
  return lesson;
}

export function mergeRegenerated(
  id: string,
  sections: string[],
  directive: string,
): LessonRecord | undefined {
  const lesson = lessons.get(id);
  if (!lesson) return undefined;
  const plan = lesson.lessonPlan;
  const stamp = directive ? ` [${directive.slice(0, 40)}]` : ' (regenerado)';

  for (const key of sections) {
    if (key === 'starter') {
      plan.starter.teacherScript = plan.starter.teacherScript.replace(/ \(regenerado\).*|$/, '') + stamp;
      plan.starter.body = plan.starter.body + stamp;
    } else if (key === 'contentDiscovery') {
      plan.contentDiscovery.body = plan.contentDiscovery.body.replace(/ \(regenerado\).*|$/, '') + stamp;
    } else if (key === 'objective') {
      plan.objective.content.goals = plan.objective.content.goals.map((g) =>
        g.includes('(regenerado)') ? g : g + stamp,
      );
    } else if (key === 'teachersNotes') {
      plan.teachersNotes.content.push({
        type: 'tip',
        text: `Nota regenerada${stamp}`,
      });
    } else if (key === 'assessment') {
      plan.assessment.content.exitCheck =
        plan.assessment.content.exitCheck.replace(/ \(regenerado\).*|$/, '') + stamp;
    } else if (key === 'activities') {
      for (const a of plan.activities.content) {
        a.description = a.description.replace(/ \(regenerado\).*|$/, '') + stamp;
      }
    } else if (key === 'mindmap') {
      plan.mindmap.content = plan.mindmap.content.replace(
        '@endmindmap',
        `** Regenerado${stamp}\n@endmindmap`,
      );
    }
  }

  lesson.updatedAt = now();
  return lesson;
}

export function addArtifact(
  id: string,
  tool: GenerateTool,
  title: string,
  payload: unknown,
): Artifact | undefined {
  const lesson = lessons.get(id);
  if (!lesson) return undefined;
  const ts = now();
  const artifact: Artifact = {
    id: randomUUID(),
    tool,
    status: 'ready',
    createdAt: ts,
    updatedAt: ts,
    title,
    payload,
  };
  lesson.artifacts.unshift(artifact);
  lesson.updatedAt = ts;
  return artifact;
}

export function getPlan(id: string): LessonPlan | undefined {
  return lessons.get(id)?.lessonPlan;
}
