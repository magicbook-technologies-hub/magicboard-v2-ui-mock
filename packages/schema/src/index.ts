import { z } from 'zod';

export const CurriculumFrameworkSchema = z.enum(['BNCC', 'CURRICULO_PAULISTA', 'NONE']);
export type CurriculumFramework = z.infer<typeof CurriculumFrameworkSchema>;

export const CalloutTypeSchema = z.enum([
  'pedagogicalTip',
  'didYouKnow',
  'commonError',
  'safety',
  'ctsa',
]);

export const SourceTypeSchema = z.enum([
  'textbook',
  'educational_site',
  'video',
  'article',
  'official_curriculum',
  'other',
]);

export const ToolActionSchema = z.enum([
  'worksheet',
  'slides',
  'diagram',
  'mindmap',
  'simulation',
  'video',
]);

export const GenerateToolSchema = z.enum([
  'slides',
  'worksheet',
  'quiz',
  'mindmap',
  'diagram',
  'video',
  'simulation',
  'easy_read',
  'translate',
]);
export type GenerateTool = z.infer<typeof GenerateToolSchema>;

export const SourceSchema = z.object({
  name: z.string(),
  type: SourceTypeSchema,
  url: z.string().nullable(),
});

export const CalloutSchema = z.object({
  type: CalloutTypeSchema,
  title: z.string(),
  text: z.string(),
});

export const MediaSchema = z.object({
  kind: z.enum(['image', 'diagram']),
  alt: z.string(),
  caption: z.string(),
  promptHint: z.string(),
  labels: z.array(z.string()),
});

export const MagicboardBlockSchema = z.object({
  id: z.string(),
  sectionNumber: z.number(),
  title: z.string(),
  description: z.string(),
  durationMinutes: z.number(),
  sectionObjective: z.string(),
  teacherScript: z.string(),
  body: z.string(),
  callouts: z.array(CalloutSchema),
  media: z.array(MediaSchema),
  sources: z.array(SourceSchema),
});

export const TeachingStepSchema = z.object({
  step: z.number(),
  phase: z.string(),
  durationMinutes: z.number(),
  teacherActions: z.array(z.string()),
  studentActions: z.array(z.string()),
  questions: z.array(z.string()),
  bloomLevel: z.string(),
  teacherScript: z.string().optional(),
  callouts: z.array(CalloutSchema).optional(),
  sources: z.array(SourceSchema).optional(),
});

export const ActivitySchema = z.object({
  name: z.string(),
  description: z.string(),
  duration: z.string(),
  grouping: z.string(),
  purpose: z.string(),
  expectedOutcome: z.string(),
  teacherRole: z.string(),
  studentRole: z.string(),
  materials: z.array(z.string()),
  possibleQuestions: z.array(z.string()),
  commonMistakes: z.array(z.string()),
  recordingFormat: z.enum(['table', 'diagram', 'graph', 'notes', 'none']),
});

export const LessonPlanSchema = z.object({
  lessonInfo: z.object({
    subject: z.string(),
    topic: z.string(),
    grade: z.union([z.string(), z.number()]),
    gradeLabel: z.string(),
    durationMinutes: z.number(),
    durationBand: z.string(),
    complexity: z.string(),
    teachingMethod: z.string(),
    language: z.string(),
    lessonType: z.string(),
    adaptabilityMode: z.string(),
  }),
  curriculum: z.object({
    framework: CurriculumFrameworkSchema,
    educationStage: z.string(),
    gradeLabel: z.string(),
    bimestre: z.string().nullable(),
    lessonSequence: z.string().nullable(),
    thematicUnit: z.string(),
    objectOfKnowledge: z.string(),
    generalCompetencies: z.array(z.string()),
    specificCompetencies: z.array(z.string()),
    skills: z.array(
      z.object({
        code: z.string().nullable(),
        description: z.string(),
      }),
    ),
    expectedLearning: z.array(z.string()),
  }),
  teacherPlanning: z.record(z.unknown()),
  accessibility: z.record(z.unknown()),
  differentiation: z.object({
    supportStudents: z.array(z.string()),
    advancedStudents: z.array(z.string()),
    fastFinishers: z.array(z.string()),
    multilingualSupport: z.array(z.string()),
  }),
  title: z.object({
    title: z.string(),
    description: z.string(),
    content: z.string(),
  }),
  objective: z.object({
    title: z.string(),
    description: z.string(),
    content: z.object({
      goals: z.array(z.string()),
      curriculumHighlight: z.string(),
    }),
  }),
  starter: MagicboardBlockSchema,
  contentDiscovery: MagicboardBlockSchema,
  materialsNeeded: z.object({
    title: z.string(),
    description: z.string(),
    content: z.object({
      physicalResources: z.array(z.string()),
      digitalResources: z.array(z.string()),
      teacherResources: z.array(z.string()),
      studentResources: z.array(z.string()),
    }),
  }),
  teachingSteps: z.object({
    title: z.string(),
    description: z.string(),
    content: z.array(TeachingStepSchema),
  }),
  activities: z.object({
    title: z.string(),
    description: z.string(),
    content: z.array(ActivitySchema),
  }),
  homework: z.object({
    title: z.string(),
    description: z.string(),
    content: z.array(
      z.object({
        task: z.string(),
        estimatedMinutes: z.number(),
        difficulty: z.string(),
        optional: z.boolean(),
        extension: z.boolean(),
        communityInvestigation: z.boolean(),
      }),
    ),
  }),
  assessment: z.object({
    title: z.string(),
    description: z.string(),
    content: z.object({
      diagnosticPrompt: z.string(),
      quickChecks: z.array(
        z.object({
          id: z.string(),
          bloomLevel: z.string(),
          prompt: z.string(),
        }),
      ),
      exitCheck: z.string(),
    }),
  }),
  keyConcepts: z.object({
    title: z.string(),
    description: z.string(),
    content: z.array(z.string()),
  }),
  rememberPoint: z.object({
    title: z.string(),
    description: z.string(),
    content: z.array(z.string()),
  }),
  teachersNotes: z.object({
    title: z.string(),
    description: z.string(),
    content: z.array(
      z.object({
        type: z.string(),
        text: z.string(),
      }),
    ),
  }),
  tools: z.object({
    title: z.string(),
    description: z.string(),
    content: z.array(
      z.object({
        action: ToolActionSchema,
        label: z.string(),
        hint: z.string(),
      }),
    ),
  }),
  sourcesSummary: z.object({
    byType: z.array(
      z.object({
        type: SourceTypeSchema,
        count: z.number(),
      }),
    ),
    items: z.array(SourceSchema),
  }),
  mindmap: z.object({
    title: z.string(),
    description: z.string(),
    content: z.string(),
  }),
});

export type LessonPlan = z.infer<typeof LessonPlanSchema>;

export const CreateLessonInputSchema = z.object({
  subject: z.string().min(1),
  grade: z.union([z.number(), z.literal('uni'), z.string()]),
  topic: z.string().min(1),
  duration: z.number().positive().default(50),
  complexity: z.enum(['easy', 'standard', 'advanced']).default('standard'),
  teaching_method: z.string().default('inquiry-based learning'),
  language: z.string().default('Portuguese'),
  curriculum_framework: z
    .union([CurriculumFrameworkSchema, z.literal('')])
    .optional()
    .default(''),
  curriculum_alignment_notes: z.string().optional().default(''),
  bimestre: z.string().optional().default(''),
  lesson_sequence: z.string().optional().default(''),
  points_to_note: z.string().optional().default(''),
  reference_links: z.string().optional().default(''),
  accessibility_profiles: z.array(z.string()).optional().default([]),
  adaptability_mode: z.string().optional().default('standard'),
  useFixture: z.boolean().optional().default(false),
});
export type CreateLessonInput = z.infer<typeof CreateLessonInputSchema>;

export const RegenerateInputSchema = z.object({
  regenerateSections: z.array(z.string()).min(1),
  regeneration_directive: z.string().optional().default(''),
});
export type RegenerateInput = z.infer<typeof RegenerateInputSchema>;

export const NotesInputSchema = z.object({
  text: z.string(),
});

export const ProgressInputSchema = z.object({
  completedStepIds: z.array(z.string()),
  currentStepId: z.string().nullable().optional(),
});

export type ArtifactStatus = 'pending' | 'ready' | 'failed';

export interface Artifact {
  id: string;
  tool: GenerateTool;
  status: ArtifactStatus;
  createdAt: string;
  updatedAt: string;
  title: string;
  payload: unknown;
  error?: string;
}

export interface LessonProgress {
  completedStepIds: string[];
  currentStepId: string | null;
}

export interface LessonRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
  coverUrl: string | null;
  favorite: boolean;
  trashed: boolean;
  userNotes: string;
  progress: LessonProgress;
  lessonPlan: LessonPlan;
  artifacts: Artifact[];
}

/** UI-computed alignment completeness (not official BNCC %). */
export function computeCurriculumCoverage(plan: LessonPlan): number {
  const c = plan.curriculum;
  const checks = [
    Boolean(c.thematicUnit),
    Boolean(c.objectOfKnowledge),
    c.generalCompetencies.length > 0,
    c.specificCompetencies.length > 0,
    c.skills.length > 0,
    c.expectedLearning.length > 0,
    Boolean(plan.objective.content.curriculumHighlight),
  ];
  const hit = checks.filter(Boolean).length;
  return Math.round((hit / checks.length) * 100);
}

export function timelineStepIds(plan: LessonPlan): string[] {
  const ids = ['starter', 'contentDiscovery'];
  for (const step of plan.teachingSteps.content) {
    ids.push(`step-${step.step}`);
  }
  ids.push('assessment');
  return ids;
}

export { buildLessonPlanFromInput, photosynthesisFixture } from './fixture.js';
