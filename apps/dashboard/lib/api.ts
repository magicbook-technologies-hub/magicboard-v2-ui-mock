/** Browser uses Next rewrite `/api` → Express. Server uses absolute URL. */
function apiBase() {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4100';
  }
  return '/api';
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      typeof body.error === 'string'
        ? body.error
        : body.error
          ? JSON.stringify(body.error)
          : res.statusText || `HTTP ${res.status}`,
    );
  }
  return res.json() as Promise<T>;
}

export type LessonSummary = {
  id: string;
  title: string;
  subject: string;
  gradeLabel: string;
  durationMinutes: number;
  favorite: boolean;
  updatedAt: string;
  progress: { completedStepIds: string[]; currentStepId: string | null };
  coverUrl: string | null;
};

export type HubLesson = {
  id: string;
  createdAt: string;
  updatedAt: string;
  coverUrl: string | null;
  favorite: boolean;
  trashed: boolean;
  userNotes: string;
  progress: { completedStepIds: string[]; currentStepId: string | null };
  lessonPlan: import('@magicboard/schema').LessonPlan;
  artifacts: import('@magicboard/schema').Artifact[];
  curriculumCoverage: number;
};

export async function listLessons() {
  return handle<{ lessons: LessonSummary[] }>(await fetch(`${apiBase()}/lessons`, { cache: 'no-store' }));
}

export async function getLesson(id: string) {
  return handle<HubLesson>(await fetch(`${apiBase()}/lessons/${id}`, { cache: 'no-store' }));
}

export async function createLesson(body: Record<string, unknown>) {
  return handle<HubLesson>(
    await fetch(`${apiBase()}/lessons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  );
}

export async function patchNotes(id: string, text: string) {
  return handle<HubLesson>(
    await fetch(`${apiBase()}/lessons/${id}/notes`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    }),
  );
}

export async function postProgress(
  id: string,
  completedStepIds: string[],
  currentStepId: string | null,
) {
  return handle<HubLesson>(
    await fetch(`${apiBase()}/lessons/${id}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completedStepIds, currentStepId }),
    }),
  );
}

export async function regenerate(
  id: string,
  regenerateSections: string[],
  regeneration_directive?: string,
) {
  return handle<HubLesson>(
    await fetch(`${apiBase()}/lessons/${id}/regenerate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ regenerateSections, regeneration_directive }),
    }),
  );
}

export async function generateTool(id: string, tool: string, language?: string) {
  return handle<{ artifact: import('@magicboard/schema').Artifact }>(
    await fetch(`${apiBase()}/lessons/${id}/generate/${tool}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language }),
    }),
  );
}

export async function listArtifacts(id: string) {
  return handle<{ artifacts: import('@magicboard/schema').Artifact[] }>(
    await fetch(`${apiBase()}/lessons/${id}/artifacts`, { cache: 'no-store' }),
  );
}
