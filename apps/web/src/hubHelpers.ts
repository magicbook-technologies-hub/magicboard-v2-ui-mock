import type { LessonPlan } from '@magicboard/schema';
import { timelineStepIds } from '@magicboard/schema';

export type HubSection =
  | 'overview'
  | 'objectives'
  | 'content'
  | 'activities'
  | 'assessments'
  | 'resources'
  | 'mindmap'
  | 'timeline'
  | 'notes'
  | 'adaptations'
  | 'reports';

export function buildRoteiro(plan: LessonPlan) {
  const nodes = [
    {
      id: 'starter',
      n: 1,
      title: plan.starter.title,
      duration: plan.starter.description,
      phase: 'Warm-up',
    },
    {
      id: 'contentDiscovery',
      n: 2,
      title: plan.contentDiscovery.title,
      duration: plan.contentDiscovery.description,
      phase: 'Content',
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
      duration: '8-10 min',
      phase: 'Assessment',
    },
  ];
  return nodes;
}

export function progressPercent(plan: LessonPlan, completed: string[]) {
  const ids = timelineStepIds(plan);
  if (!ids.length) return 0;
  return Math.round((completed.filter((id) => ids.includes(id)).length / ids.length) * 100);
}

export const NAV: { id: HubSection; label: string }[] = [
  { id: 'overview', label: 'Visão Geral da Aula' },
  { id: 'objectives', label: 'Objetivos' },
  { id: 'content', label: 'Conteúdo Completo' },
  { id: 'activities', label: 'Atividades' },
  { id: 'assessments', label: 'Avaliações' },
  { id: 'resources', label: 'Recursos' },
  { id: 'mindmap', label: 'Mapa Mental' },
  { id: 'timeline', label: 'Linha do Tempo' },
  { id: 'notes', label: 'Notas do Professor' },
  { id: 'adaptations', label: 'Adaptações' },
  { id: 'reports', label: 'Relatórios' },
];

export const TOOL_META: Record<
  string,
  { label: string; icon: string; description: string }
> = {
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
