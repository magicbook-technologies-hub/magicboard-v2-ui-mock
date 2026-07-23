import photosynthesisFixture from './fixtures/photosynthesis.v2.json' with { type: 'json' };
import type { CreateLessonInput, LessonPlan } from './index.js';

export { photosynthesisFixture };

function resolveFramework(input: CreateLessonInput): 'BNCC' | 'CURRICULO_PAULISTA' | 'NONE' {
  if (input.grade === 'uni' || String(input.grade).toLowerCase() === 'uni') return 'NONE';
  if (input.curriculum_framework === 'BNCC' || input.curriculum_framework === 'CURRICULO_PAULISTA') {
    return input.curriculum_framework;
  }
  if (input.curriculum_framework === 'NONE') return 'NONE';
  const lang = input.language.toLowerCase();
  if (lang.startsWith('pt') || lang.includes('portug')) return 'BNCC';
  return 'NONE';
}

/** Clone golden fixture and overlay form fields. Live LLM can replace this later. */
export function buildLessonPlanFromInput(input: CreateLessonInput): LessonPlan {
  const base = structuredClone(photosynthesisFixture.lessonPlan) as LessonPlan;
  const framework = resolveFramework(input);
  const gradeLabel =
    input.grade === 'uni' || String(input.grade).toLowerCase() === 'uni'
      ? 'Universitário'
      : `${input.grade}º Ano`;

  base.lessonInfo.subject = input.subject;
  base.lessonInfo.topic = input.topic;
  base.lessonInfo.grade = String(input.grade);
  base.lessonInfo.gradeLabel = gradeLabel;
  base.lessonInfo.durationMinutes = input.duration;
  base.lessonInfo.durationBand =
    input.duration <= 30 ? 'curta' : input.duration <= 45 ? 'media' : 'longa';
  base.lessonInfo.complexity = input.complexity;
  base.lessonInfo.teachingMethod = input.teaching_method;
  base.lessonInfo.language = input.language;
  base.lessonInfo.adaptabilityMode = input.adaptability_mode || 'standard';

  base.curriculum.framework = framework;
  base.curriculum.gradeLabel = gradeLabel;
  base.curriculum.bimestre = input.bimestre || null;
  base.curriculum.lessonSequence = input.lesson_sequence || null;
  if (input.curriculum_alignment_notes) {
    base.objective.content.curriculumHighlight = input.curriculum_alignment_notes.slice(0, 200);
  }

  base.title.content = input.topic;
  base.title.description = `${input.subject} · ${gradeLabel}`;

  if (input.topic.toLowerCase() !== 'introdução à fotossíntese' && input.topic.toLowerCase() !== 'introducao a fotossintese') {
    // ponytail: fixture overlay — full LLM CREATE V2 replaces body later
    base.objective.content.goals = base.objective.content.goals.map((g) =>
      g.replace(/fotossíntese|Fotossíntese|plantas/gi, (m) =>
        m.toLowerCase().includes('foto') ? input.topic : m,
      ),
    );
    base.starter.sectionObjective = `Ativar conhecimentos prévios sobre ${input.topic}`;
    base.contentDiscovery.sectionObjective = `Construir entendimento de ${input.topic}`;
    base.contentDiscovery.body = `Conteúdo base sobre ${input.topic} (${input.subject}, ${gradeLabel}). ${base.contentDiscovery.body}`;
  }

  return base;
}
