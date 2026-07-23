# Lesson Plan V2.0 — CREATE & REGENERATE (short guide)

Shared Magicboard schema. User-facing text in `{language}`; JSON **keys stay English**. Output: minified JSON only (no markdown fences).

| File | Role |
|------|------|
| [`CREATE LESSON PLAN V2.0.txt`](CREATE%20LESSON%20PLAN%20V2.0.txt) | Full lesson only |
| [`LessonPlan_EDIT(REGENERATE) V2.0.txt`](LessonPlan_EDIT(REGENERATE)%20V2.0.txt) | MODE A = full plan; MODE B = regenerate listed sections |

## Flow

1. Fill form → substitute `{placeholders}` into the prompt  
2. Model returns JSON → parse → store → render Magicboard UI  

## Inputs (both prompts)

**Required:** `subject`, `grade` (1–12 / `uni`), `topic`, `duration`, `complexity`, `teaching_method`, `language`  

**Optional:** `curriculum_framework` (`BNCC` \| `CURRICULO_PAULISTA` \| empty), `curriculum_alignment_notes`, `bimestre`, `lesson_sequence`, `points_to_note`, `reference_links`, `accessibility_profiles`, `adaptability_mode`  

**Regenerate only:** `regenerateSections` (e.g. `["starter"]`), `existingLessonPlan`, `regeneration_directive`  

**Defaults:** PT + empty framework → BNCC; non-PT + empty → NONE. Never invent skill codes (`code: null` if unverified). `uni` → no BNCC/CP claims.

## Outputs (`lessonPlan`)

| Section | Use |
|---------|-----|
| `lessonInfo` / `title` | Chips + hero title |
| `curriculum` | Alinhamento Curricular card |
| `teacherPlanning` | Prep panel (rubric, observation, criteria) |
| `objective` | `goals[]` + `curriculumHighlight` |
| `starter` / `contentDiscovery` | Magicboard blocks: script, body, callouts, media, sources |
| `teachingSteps` / `activities` / `homework` / `assessment` | Timeline, tasks, Q1–Q3 + exit |
| `teachersNotes` / `tools` / `sourcesSummary` / `mindmap` | AI tips, generate-hints, fontes donut, PlantUML |
| `accessibility` / `differentiation` | Profiles + support paths |

**Block fields:** `teacherScript` (“O Professor Diz”), `callouts` (tip / Sabia que? / Erro comum), `media.promptHint` (image gen—not URLs), `sources`.

## CREATE vs REGENERATE

- **CREATE / MODE A:** `{"lessonPlan":{...}}` — full key order including `contentDiscovery` + `sourcesSummary`.  
- **MODE B:** top-level keys = `regenerateSections` only (no wrapper). Fresh content vs existing (No-Echo). Allowed keys include `starter`, `contentDiscovery`, `objective`, `sourcesSummary`, etc.

## Tips

Always send `language`. Media via `promptHint`, not URLs. Tools are generate-hints. Private sticky notes are UI-only; AI notes = `teachersNotes`.
