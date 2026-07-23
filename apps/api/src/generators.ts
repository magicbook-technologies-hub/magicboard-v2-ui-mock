import type { GenerateTool, LessonPlan } from '@magicboard/schema';

export function generateDerivative(tool: GenerateTool, plan: LessonPlan, opts?: { language?: string }) {
  const title = plan.title.content;
  const lang = opts?.language || plan.lessonInfo.language;

  switch (tool) {
    case 'slides':
      return {
        title: `Slides — ${title}`,
        payload: {
          cover_slide: {
            title,
            subtitle: `${plan.lessonInfo.subject} · ${plan.lessonInfo.gradeLabel}`,
            duration: `${plan.lessonInfo.durationMinutes} min`,
          },
          slides: [
            {
              index: 0,
              title: plan.objective.title,
              bullets: plan.objective.content.goals,
            },
            {
              index: 1,
              title: plan.starter.title,
              body: plan.starter.teacherScript,
            },
            {
              index: 2,
              title: plan.contentDiscovery.title,
              body: plan.contentDiscovery.body,
              labels: plan.contentDiscovery.media[0]?.labels ?? [],
            },
            ...plan.activities.content.slice(0, 2).map((a, i) => ({
              index: 3 + i,
              title: a.name,
              body: a.description,
              meta: `${a.duration} · ${a.grouping}`,
            })),
            {
              index: 3 + Math.min(2, plan.activities.content.length),
              title: plan.assessment.title,
              bullets: plan.assessment.content.quickChecks.map((q) => `${q.id}: ${q.prompt}`),
            },
            {
              index: 4 + Math.min(2, plan.activities.content.length),
              title: 'Exit check',
              body: plan.assessment.content.exitCheck,
            },
          ],
        },
      };

    case 'quiz':
      return {
        title: `Quiz — ${title}`,
        payload: {
          topic: plan.lessonInfo.topic,
          language: lang,
          questions: plan.assessment.content.quickChecks.map((q, i) => ({
            id: q.id,
            bloomLevel: q.bloomLevel,
            prompt: q.prompt,
            alternatives: buildAlternatives(q.prompt, i),
            correctIndex: 0,
          })),
          exitCheck: plan.assessment.content.exitCheck,
        },
      };

    case 'worksheet':
      return {
        title: `Ficha — ${title}`,
        payload: {
          header: {
            title,
            subject: plan.lessonInfo.subject,
            grade: plan.lessonInfo.gradeLabel,
          },
          sections: [
            {
              heading: 'Diagrama',
              instructions: 'Complete os rótulos:',
              labels: plan.contentDiscovery.media.find((m) => m.kind === 'diagram')?.labels ?? [],
            },
            {
              heading: 'Atividade',
              items: plan.activities.content.map((a) => ({
                name: a.name,
                task: a.description,
                recordingFormat: a.recordingFormat,
              })),
            },
            {
              heading: 'Verificação',
              questions: plan.assessment.content.quickChecks,
            },
            {
              heading: 'Saída',
              prompt: plan.assessment.content.exitCheck,
            },
          ],
        },
      };

    case 'mindmap':
      return {
        title: plan.mindmap.title || `Mapa Mental — ${title}`,
        payload: {
          plantuml: plan.mindmap.content,
          topic: plan.lessonInfo.topic,
          keyConcepts: plan.keyConcepts.content,
        },
      };

    case 'diagram': {
      const media =
        plan.contentDiscovery.media.find((m) => m.kind === 'diagram') ||
        plan.contentDiscovery.media[0] ||
        plan.starter.media[0];
      return {
        title: `Diagrama — ${title}`,
        payload: {
          kind: media?.kind ?? 'diagram',
          alt: media?.alt ?? title,
          caption: media?.caption ?? '',
          promptHint: media?.promptHint ?? `educational diagram of ${plan.lessonInfo.topic}`,
          labels: media?.labels ?? [],
          // ponytail: placeholder URL until image pipeline wired
          imageUrl: null,
          statusNote: 'promptHint ready for image pipeline',
        },
      };
    }

    case 'video':
      return {
        title: `Vídeo — ${title}`,
        payload: {
          status: 'brief_ready',
          script: {
            hook: plan.starter.teacherScript,
            explanation: plan.contentDiscovery.body,
            callouts: plan.contentDiscovery.callouts.map((c) => `${c.title}: ${c.text}`),
            close: plan.assessment.content.exitCheck,
          },
          durationTargetSec: 90,
          language: lang,
        },
      };

    case 'simulation':
      return {
        title: `Simulação — ${title}`,
        payload: {
          type: 'simulation_brief',
          title: `Explorar ${plan.lessonInfo.topic}`,
          variables: [
            { id: 'light', label: 'Luz', min: 0, max: 100, default: 70 },
            { id: 'water', label: 'Água', min: 0, max: 100, default: 50 },
            { id: 'co2', label: 'CO2', min: 0, max: 100, default: 40 },
          ],
          outputs: [
            { id: 'oxygen', label: 'Oxigênio' },
            { id: 'glucose', label: 'Glicose' },
          ],
          learnerPrompt: plan.teachingSteps.content[1]?.questions[0] ?? plan.assessment.content.diagnosticPrompt,
          embedUrl: null,
          note: 'Brief only — embed third-party sim later',
        },
      };

    case 'easy_read':
      return {
        title: `Leitura Fácil — ${title}`,
        payload: {
          language: lang,
          title,
          simplifiedBody: simplify(plan.contentDiscovery.body),
          simplifiedGoals: plan.objective.content.goals.map(simplify),
          keyWords: plan.teacherPlanning
            ? ((plan.teacherPlanning as { academicVocabulary?: string[] }).academicVocabulary ?? []).slice(0, 5)
            : [],
        },
      };

    case 'translate': {
      const target = opts?.language || (lang.toLowerCase().includes('port') ? 'English' : 'Portuguese');
      return {
        title: `Tradução (${target}) — ${title}`,
        payload: {
          sourceLanguage: lang,
          targetLanguage: target,
          title: target === 'English' ? `Introduction: ${plan.lessonInfo.topic}` : plan.title.content,
          objectiveGoals: plan.objective.content.goals,
          starterScript: plan.starter.teacherScript,
          contentBody: plan.contentDiscovery.body,
          note: 'Deterministic stub — wire Translater.md LLM for production',
        },
      };
    }

    default:
      return { title: `Artifact — ${title}`, payload: {} };
  }
}

function buildAlternatives(prompt: string, seed: number): string[] {
  const correct = 'Resposta correta baseada na aula';
  return [
    correct,
    `Distrator A (${seed + 1})`,
    `Distrator B ligado a concepção errada`,
    `Distrator C fora do tema: ${prompt.slice(0, 24)}…`,
  ];
}

function simplify(text: string): string {
  return text
    .replace(/\([^)]*\)/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .split('. ')
    .slice(0, 2)
    .join('. ')
    .slice(0, 280);
}
