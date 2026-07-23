import assert from 'node:assert/strict';
import { buildLessonPlanFromInput, computeCurriculumCoverage, timelineStepIds } from '@magicboard/schema';
import { generateDerivative } from './generators.js';

const plan = buildLessonPlanFromInput({
  subject: 'Ciências',
  grade: 5,
  topic: 'Introdução à Fotossíntese',
  duration: 50,
  complexity: 'standard',
  teaching_method: 'inquiry-based learning',
  language: 'Portuguese',
  curriculum_framework: 'BNCC',
  curriculum_alignment_notes: '',
  bimestre: '',
  lesson_sequence: '',
  points_to_note: '',
  reference_links: '',
  accessibility_profiles: [],
  adaptability_mode: 'standard',
  useFixture: true,
});

assert.equal(plan.title.content, 'Introdução à Fotossíntese');
assert.ok(computeCurriculumCoverage(plan) >= 80);
assert.ok(timelineStepIds(plan).includes('starter'));

for (const tool of [
  'slides',
  'quiz',
  'worksheet',
  'mindmap',
  'diagram',
  'video',
  'simulation',
  'easy_read',
  'translate',
] as const) {
  const out = generateDerivative(tool, plan);
  assert.ok(out.title.length > 0, tool);
  assert.ok(out.payload, tool);
}

console.log('self-check ok');
