import express from 'express';
import cors from 'cors';
import {
  CreateLessonInputSchema,
  GenerateToolSchema,
  NotesInputSchema,
  ProgressInputSchema,
  RegenerateInputSchema,
  computeCurriculumCoverage,
} from '@magicboard/schema';
import { generateDerivative } from './generators.js';
import {
  addArtifact,
  createLesson,
  getLesson,
  listLessons,
  mergeRegenerated,
  seedGoldenLesson,
  updateNotes,
  updateProgress,
} from './store.js';

const app = express();
const PORT = Number(process.env.PORT || 4100);

app.use(cors());
app.use(express.json({ limit: '2mb' }));

seedGoldenLesson();

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'magicboard-api' });
});

app.get('/lessons', (_req, res) => {
  res.json({
    lessons: listLessons().map((l) => ({
      id: l.id,
      title: l.lessonPlan.title.content,
      subject: l.lessonPlan.lessonInfo.subject,
      gradeLabel: l.lessonPlan.lessonInfo.gradeLabel,
      durationMinutes: l.lessonPlan.lessonInfo.durationMinutes,
      favorite: l.favorite,
      updatedAt: l.updatedAt,
      progress: l.progress,
      coverUrl: l.coverUrl,
    })),
  });
});

app.post('/lessons', (req, res) => {
  const parsed = CreateLessonInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const lesson = createLesson(parsed.data);
  res.status(201).json(enrich(lesson));
});

app.get('/lessons/:id', (req, res) => {
  const lesson = getLesson(req.params.id);
  if (!lesson || lesson.trashed) {
    res.status(404).json({ error: 'Lesson not found' });
    return;
  }
  res.json(enrich(lesson));
});

app.post('/lessons/:id/regenerate', (req, res) => {
  const parsed = RegenerateInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const lesson = mergeRegenerated(
    req.params.id,
    parsed.data.regenerateSections,
    parsed.data.regeneration_directive || '',
  );
  if (!lesson) {
    res.status(404).json({ error: 'Lesson not found' });
    return;
  }
  res.json(enrich(lesson));
});

app.patch('/lessons/:id/notes', (req, res) => {
  const parsed = NotesInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const lesson = updateNotes(req.params.id, parsed.data.text);
  if (!lesson) {
    res.status(404).json({ error: 'Lesson not found' });
    return;
  }
  res.json(enrich(lesson));
});

app.post('/lessons/:id/progress', (req, res) => {
  const parsed = ProgressInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const lesson = updateProgress(
    req.params.id,
    parsed.data.completedStepIds,
    parsed.data.currentStepId ?? null,
  );
  if (!lesson) {
    res.status(404).json({ error: 'Lesson not found' });
    return;
  }
  res.json(enrich(lesson));
});

app.post('/lessons/:id/generate/:tool', (req, res) => {
  const toolParsed = GenerateToolSchema.safeParse(req.params.tool);
  if (!toolParsed.success) {
    res.status(400).json({ error: 'Unknown tool' });
    return;
  }
  const lesson = getLesson(req.params.id);
  if (!lesson) {
    res.status(404).json({ error: 'Lesson not found' });
    return;
  }
  const { title, payload } = generateDerivative(toolParsed.data, lesson.lessonPlan, {
    language: typeof req.body?.language === 'string' ? req.body.language : undefined,
  });
  const artifact = addArtifact(lesson.id, toolParsed.data, title, payload);
  res.status(201).json({ artifact });
});

app.get('/lessons/:id/artifacts', (req, res) => {
  const lesson = getLesson(req.params.id);
  if (!lesson) {
    res.status(404).json({ error: 'Lesson not found' });
    return;
  }
  res.json({ artifacts: lesson.artifacts });
});

function enrich(lesson: NonNullable<ReturnType<typeof getLesson>>) {
  return {
    ...lesson,
    curriculumCoverage: computeCurriculumCoverage(lesson.lessonPlan),
  };
}

app.listen(PORT, () => {
  console.log(`magicboard-api listening on http://localhost:${PORT}`);
});
