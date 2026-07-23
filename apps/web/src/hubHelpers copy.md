import type { LessonPlan } from '@magicboard/schema';
import { timelineStepIds } from '@magicboard/schema';

export type JourneyPhase =
  | 'ensinar'
  | 'metodo'
  | 'engajar'
  | 'avaliar'
  | 'adaptar'
  | 'justificar'
  | 'entregar';

export const JOURNEY: {
  id: JourneyPhase;
  tag: string;
  label: string;
  question: string;
  subtitle: string;
}[] = [
  {
    id: 'ensinar',
    tag: '01',
    label: 'O que ensinar',
    question: 'O que ensinar?',
    subtitle: 'Objetivos, conceitos e foco da aula',
  },
  {
    id: 'metodo',
    tag: '02',
    label: 'Como ensinar',
    question: 'Como ensinar?',
    subtitle: 'Roteiro, etapas e script do professor',
  },
  {
    id: 'engajar',
    tag: '03',
    label: 'Como engajar',
    question: 'Como engajar os alunos?',
    subtitle: 'Aquecimento, atividades e mapa mental',
  },
  {
    id: 'avaliar',
    tag: '04',
    label: 'Como avaliar',
    question: 'Como avaliar a aprendizagem?',
    subtitle: 'Diagnóstico, checagens e saída',
  },
  {
    id: 'adaptar',
    tag: '05',
    label: 'Como adaptar',
    question: 'Como adaptar a lição?',
    subtitle: 'Diferenciação, materiais e notas',
  },
  {
    id: 'justificar',
    tag: '06',
    label: 'Como justificar',
    question: 'Como justificar pedagogicamente?',
    subtitle: 'BNCC, competências e fontes',
  },
  {
    id: 'entregar',
    tag: '07',
    label: 'Entregar a aula',
    question: 'Pronto para a sala?',
    subtitle: 'Slides, apresentação e ferramentas',
  },
];

export function buildRoteiro(plan: LessonPlan) {
  return [
    {
      id: 'starter',
      n: 1,
      title: plan.starter.title,
      duration: plan.starter.description,
      phase: 'Aquecimento',
    },
    {
      id: 'contentDiscovery',
      n: 2,
      title: plan.contentDiscovery.title,
      duration: plan.contentDiscovery.description,
      phase: 'Conteúdo',
    },
    ...plan.teachingSteps.content.map((s, i) => ({
      id: `step-${s.step}`,
      n: 3 + i,
      title: s.phase,
      duration: `${s.durationMinutes} min`,
      phase: s.phase,
    })),
    {
      id: 'assessment',
      n: 3 + plan.teachingSteps.content.length,
      title: plan.assessment.title,
      duration: '8–10 min',
      phase: 'Avaliação',
    },
  ];
}

export function progressPercent(plan: LessonPlan, completed: string[]) {
  const ids = timelineStepIds(plan);
  if (!ids.length) return 0;
  return Math.round((completed.filter((id) => ids.includes(id)).length / ids.length) * 100);
}

export const TOOL_META: Record<string, { label: string; icon: string; description: string }> = {
  slides: { label: 'Slides da Aula', icon: '📽️', description: 'Apresentação para a turma' },
  worksheet: { label: 'Fichas de Exercícios', icon: '📝', description: 'Folha imprimível' },
  quiz: { label: 'Quiz Interativo', icon: '✅', description: 'Perguntas com alternativas' },
  diagram: { label: 'Diagrama Visual', icon: '🖼️', description: 'Imagem a partir do promptHint' },
  mindmap: { label: 'Mapa Mental', icon: '🧠', description: 'PlantUML da aula' },
  video: { label: 'Vídeo Explicativo', icon: '🎬', description: 'Roteiro de vídeo IA' },
  simulation: { label: 'Simulação', icon: '🔬', description: 'Brief interativo' },
  easy_read: { label: 'Leitura Fácil', icon: '📖', description: 'Texto simplificado' },
  translate: { label: 'Traduzir Aula', icon: '🌐', description: 'Versão em outro idioma' },
};

export const ASSISTANT_STARTERS = [
  'Simplifique a atividade em grupo para 15 minutos',
  'Sugira uma checagem formativa rápida',
  'Como justificar esta aula na BNCC?',
  'Gere 3 perguntas de discussão',
];
