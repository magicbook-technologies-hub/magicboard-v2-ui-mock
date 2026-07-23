# Magicboard All-in-One

Teacher product: one Lesson Plan V2.0 JSON is the master artifact. Hub, Present mode, and Ferramentas (slides, quiz, worksheet, mind map, video, …) all derive from it.

## Structure

```
apps/web          Teacher Hub + Present UI (Vite + React)
apps/api          Lesson + derivative job API (Express)
packages/schema   Shared Zod/TS types for lessonPlan V2 + artifacts
packages/prompts  Versioned CREATE/REGENERATE + derivative prompts
```

## Quick start

```bash
npm install
npm run dev:api   # http://localhost:4100
npm run dev:web   # http://localhost:5173
```

Create a lesson via the form, or open the golden photosynthesis fixture from the library.

## API

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/lessons` | Create from form (fixture-backed generator) |
| GET | `/lessons` | List library |
| GET | `/lessons/:id` | Hub payload |
| POST | `/lessons/:id/regenerate` | Section regenerate |
| PATCH | `/lessons/:id/notes` | Private teacher sticky |
| POST | `/lessons/:id/progress` | Timeline checkmarks |
| POST | `/lessons/:id/generate/:tool` | Derivative job |
| GET | `/lessons/:id/artifacts` | List outputs |
| GET | `/health` | Health check |

Tools: `slides` `worksheet` `quiz` `mindmap` `diagram` `video` `simulation` `easy_read` `translate`
