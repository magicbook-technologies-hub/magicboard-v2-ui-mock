export type RoadmapStepKey =
  | 'connect'
  | 'discover'
  | 'understand'
  | 'explore'
  | 'apply'
  | 'assess'
  | 'consolidate'
  | 'extend';

export type RoadmapStep = {
  id: string;
  key: RoadmapStepKey;
  n: string;
  duration: string;
  color: string;
};

export type ContentSection = {
  id: string;
  number: string;
  title: string;
  description: string;
  readingMinutes: number;
  gradient: string;
  mediaKinds: ('text' | 'image' | 'video' | 'diagram')[];
};

export type ActivityItem = {
  id: string;
  name: string;
  kind: 'experiment' | 'challenge' | 'project';
  duration: string;
  grouping: string;
  description: string;
};

export type AssessmentItem = {
  id: string;
  title: string;
  kind: 'quiz' | 'diagnostic' | 'final';
  meta: string;
};

export type DashboardView = {
  title: string;
  subtitle: string;
  subject: string;
  gradeLabel: string;
  educationStage: string;
  durationMinutes: number;
  bnccCode: string;
  badges: string[];
  objectivesCount: number;
  contentCount: number;
  activitiesCount: number;
  assessmentsCount: number;
  aiResourcesCount: number;
  skills: { code: string | null; description: string }[];
  generalCompetencies: string[];
  knowledgeObjects: string[];
  expectedLearning: string[];
  roadmap: RoadmapStep[];
  contentSections: ContentSection[];
  activities: ActivityItem[];
  assessments: AssessmentItem[];
  timeBreakdown: { content: number; activities: number; assessments: number };
  metrics: {
    bnccCoverage: number;
    competenciesDone: number;
    competenciesTotal: number;
    objectivesDone: number;
    objectivesTotal: number;
    activities: number;
    assessments: number;
    sources: number;
  };
  progressPct: number;
  sectionsDone: number;
  sectionsTotal: number;
  teacherNotes: string;
  tools: { id: string; tool: string; labelKey: string }[];
};
