# Magicboard All-in-One

Teacher product: one Lesson Plan V2.0 JSON is the master artifact. Hub, Present mode, and Ferramentas (slides, quiz, worksheet, mind map, video, …) all derive from it.

## Structure

```
apps/dashboard    MagicLesson dashboard (Next.js 15) — screenshot UI, PT/EN
apps/web          Legacy Teacher Hub (Vite + React)
apps/api          Lesson + derivative job API (Express)
packages/schema   Shared Zod/TS types for lessonPlan V2 + artifacts
packages/prompts  Versioned CREATE/REGENERATE + derivative prompts
```

## Quick start (MagicLesson dashboard)

```bash
npm install
npm run build -w @magicboard/schema
npm run dev:api        # http://localhost:4100
npm run dev:dashboard  # http://localhost:3000
```

Or both together:

```bash
npm run dev:magic
```

Open http://localhost:3000/lessons — select the golden Fotossíntese lesson. Toggle **PT | EN** in the top bar for UI chrome.

The dashboard talks to Express via Next rewrite (`/api/*` → `:4100`). Mock flows that work:

- **Apresentar Slides** — generates slides if needed, opens present mode
- **Ferramentas** (right rail) — `POST /generate/:tool`, opens artifact panel
- **Roteiro** steps — click to toggle progress via Express
- **Notas** — autosave on blur (`PATCH /notes`)
- **Quiz** assessment card — generates quiz artifact
- **Download / Share** — lesson JSON / copy link

Env: `apps/dashboard/.env.local` → `NEXT_PUBLIC_API_URL=http://localhost:4100`

## Legacy Vite hub

```bash
npm run dev:web   # http://localhost:5173
```

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
