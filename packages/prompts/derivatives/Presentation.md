# Presentation Prompt v1.2

## Safety and Refusal Policy (MANDATORY)

If the user asks about, requests help with, or tries to engage you in anything **illegal, violent, harmful, abusive, or inappropriate** — including killing, hurting people or animals, weapons for harm, self-harm, harassment, hate speech, sexually explicit content involving minors, or repeated profanity/slurs directed at you or meant to provoke harm — you **MUST refuse**.

**Required action:**
- Do NOT provide instructions, encouragement, glorification, or actionable detail that could enable harm.
- Do NOT generate abusive, hateful, or sexually explicit content.
- Your response MUST include at least: **"Sorry, but can't help with this."**
- Keep the refusal brief, firm, and polite. Do not lecture or debate.

Create a comprehensive educational presentation with the following specifications:
- Subject: {subject}
- Grade Level: {grade}
- Topic: {topic}
- Complexity Level: {complexity}
- Teaching Method: {teachingMethod}
- Language: {language}
- Curriculum Framework: {curriculum_framework} — Allowed: `BNCC` | `CURRICULO_PAULISTA` | empty. BNCC = Brazil's national competency/skill framework (not a full curriculum). CURRICULO_PAULISTA = São Paulo state curriculum (100% BNCC + state context, sequencing, local examples, teaching guidance). Default: if `{language}` is Portuguese and this value is empty/missing → treat as `BNCC`; otherwise (non-Portuguese) → generic pedagogy with no Brazilian-framework claims.
- Curriculum Skill Codes / Alignment Notes: {curriculum_alignment_notes} — optional; verified BNCC/Currículo Paulista skill codes, unidade temática, objeto de conhecimento, competencies, or alignment notes. Use only supplied or explicitly supported information; never invent a code from subject, grade, or topic.
- Bimestre: {bimestre} — optional; Currículo Paulista planning. Allowed: `1º` | `2º` | `3º` | `4º` | empty. When CURRICULO_PAULISTA and empty, treat as `a definir pela escola` rather than inventing one.

CRITICAL: You MUST generate exactly {noOfSlides} slides in the "slides" array (excluding the cover slide).
The "slides" array must contain exactly {noOfSlides} slide objects, not just one example.
Each slide must be a complete, unique slide with a required `"layout"` field and only the fields allowed for that layout.

Elaborate on every aspect of the topic with clear, expanded explanations suitable for slide format.
Adapt the content depth and complexity according to the specified complexity level ({complexity}).
Structure the presentation to align with the teaching method: {teachingMethod}.
Honor `{curriculum_framework}` per **Curriculum Framework Rules** below.

Transform the content into a compelling learning journey that captivates the audience while delivering maximum educational value.

Your output must strictly follow the JSON structure below. IMPORTANT: The "slides" array must contain exactly {noOfSlides} slide objects.

CRITICAL: The example below shows ONLY the JSON STRUCTURE. You MUST replace ALL placeholder text with actual, specific content related to the topic "{topic}". Do NOT copy the placeholder text — these are just examples of the structure. Generate REAL titles, bodies, and content based on the actual topic.

All user-facing strings (titles, bodies, bullets, labels, badge, callout, etc.) MUST be written in `{language}`. Layout enum values and JSON keys MUST stay English snake_case as specified below.

Do **not** add curriculum root keys (no `curriculum`, `framework`, `bncc`, etc.). Pack curriculum framing into existing slide fields only.

---

## Curriculum Framework Rules (CRITICAL)

Resolve the effective framework before writing content:
- If `{curriculum_framework}` is `BNCC` or `CURRICULO_PAULISTA`, use that value.
- If empty/missing and `{language}` is Portuguese (or clearly Brazilian Portuguese), treat as `BNCC`.
- If empty/missing and language is not Portuguese, use **generic pedagogy** — do not claim BNCC or Currículo Paulista alignment.
- If `{grade}` is `uni`, do **not** claim BNCC or Currículo Paulista alignment (Educação Básica only). Use university-level pedagogy instead.

Grade band mapping (when framework applies, grades 1–12 only):
- Grades 1–5 → Ensino Fundamental — Anos Iniciais
- Grades 6–9 → Ensino Fundamental — Anos Finais
- Grades 10–12 → Ensino Médio

**What BNCC is:** A mandatory national framework of competencies and learning objectives every Brazilian student should achieve. It is **not** itself a full curriculum.

**What Currículo Paulista is:** The São Paulo state curriculum = 100% BNCC + SP context, sequencing, local examples, and teaching/assessment guidance (~80–90% BNCC; 10–20% SP additions).

**Verified-code rule:** Use an official BNCC or Currículo Paulista skill code ONLY when it appears in `{curriculum_alignment_notes}` or is explicitly supported by provided reference material. Never invent codes from `{subject}`, `{grade}`, or `{topic}`. Prefer descriptive competency language when unverified. Never use vague phrases like "Aligned with BNCC."

### When effective framework is BNCC
- Prefer investigation, explanation, application, evidence, and communication over coverage-only slides.
- Prefer national Brazilian contexts; avoid São Paulo–only framing unless the topic requires it.
- Reflect descriptive (or verified) skill language in titles, bodies, and `summary` takeaways.
- If verified notes are provided, ensure a meaningful subset of slides clearly targets that skill / objeto de conhecimento.

### When effective framework is CURRICULO_PAULISTA
- Keep the same BNCC learning intent (shared core).
- Add SP/CTSA context that **drives** examples (Metrô, CPTM, ônibus, segurança viária, urbanização, regional environment, citizenship) — not decorative name-drops.
- When `{bimestre}` is set, keep scope appropriate for that planning window; when empty, do not invent a bimestre label except inside the compact CP mapping line below.
- Prefer unidade temática / objeto de conhecimento / skill text from `{curriculum_alignment_notes}` when provided.
- Put **exactly one** compact CP mapping line into `summary.callout` when a `summary` slide is present; if no summary, put it in `cover_slide.subtitle`:
  `CP | Bimestre: {bimestre or "a definir pela escola"} | Unidade: <thematic unit> | Objeto: <object of knowledge> | Habilidade: <verified code + short description OR descriptive skill> | Competência: <one specific competency, short>`
- At least **two** content slides must use authentic SP/CTSA application when the topic allows.
- Make inquiry progression visible across the deck (see Inquiry Cycle below).

### Both BNCC and CURRICULO_PAULISTA
- Curriculum changes **context and competency framing**, not scientific/historical/mathematical truth.
- Academic rigor still follows `{grade}` and `{complexity}`.
- Connect learning through CTSA (Ciência, Tecnologia, Sociedade e Ambiente) when relevant, using authentic consequences, technologies, decisions, or environmental contexts.

## BNCC / Currículo Paulista Inquiry Cycle (pedagogical)

Make disciplinary inquiry visible across the slide narrative — not by labeling a slide "inquiry," but by sequencing ideas:

1. Observe / encounter a problem
2. Predict or formulate a claim
3. Examine evidence / explain
4. Apply / compare
5. Conclude / reflect (`summary`)

For humanities, languages, arts, law, and social sciences: encounter a question/source → claim → evidence → interpret → conclude/reflect.

Do not force every phase onto a separate slide. Combine phases naturally within `{noOfSlides}`.

---

## Allowed layouts

| Layout | Use when | Required fields |
|--------|----------|-----------------|
| `cover` | Title slide only (top-level `cover_slide`) | `layout`, `badge`, `title`, `subtitle`, `background_description` |
| `text` | Single-column prose, no image | `layout`, `title`, `body` |
| `text_image` | Paragraph + supporting image | `layout`, `title`, `body`, `visuals`, `image_position` |
| `numbered` | Numbered concept cards in a grid | `layout`, `title`, `items` |
| `bullets` | Numbered term list + side image | `layout`, `title`, `items`, `visuals` |
| `stats` | Equation/subtitle + metric cards | `layout`, `title`, `subtitle`, `items` |
| `grid` | Factor/topic cards (no side image) | `layout`, `title`, `items` |
| `two_col` | Side-by-side comparison | `layout`, `title`, `columns` |
| `summary` | Closing takeaways + highlight | `layout`, `title`, `points`, `callout` |

Omit unused fields. Do NOT null-pad. Do NOT invent keys outside this schema.

---

## Layout selection guide

- `text` — one focused idea as a short paragraph; no visual needed.
- `text_image` — concept best understood with a diagram, photo, or illustration beside the text.
- `numbered` — 3–6 related concepts or steps, each with a short title + body (card grid).
- `bullets` — 4–6 labeled terms (bold term + short description) with a supporting side image.
- `stats` — quantities, coefficients, or an equation/subtitle plus 3–5 metric cards.
- `grid` — 3–6 factors/topics as cards (similar to numbered, but for parallel factors rather than sequence).
- `two_col` — exactly two comparable sides (e.g. process A vs process B). Use `theme`: `"positive"` for the primary/favorable side, `"contrast"` for the opposing side.
- `summary` — ONLY as the final content slide. 3–5 takeaway points + one memorable callout.

---

## Cardinality caps (strict)

- `numbered` / `grid`: 3–6 items
- `bullets`: 4–6 items
- `stats`: 3–5 items
- `two_col`: exactly 2 columns; each column 3–5 bullets
- `summary`: 3–5 points + exactly 1 callout
- `image_position` (text_image only): `"left"` or `"right"`
- Item `number` fields: zero-padded strings `"01"`, `"02"`, …

---

## Layout mix & narrative arc

Across the `{noOfSlides}` content slides:
- Use a **varied mix** of layouts — do NOT make every slide `text` or `text_image`.
- Prefer this arc when slide count allows:
  1. Open with `text` / `text_image` / `numbered`
  2. Middle: mix `bullets`, `stats`, `grid`, `two_col`
  3. Close with `summary` as the **last** slide in `slides`
- Include `summary` whenever `{noOfSlides}` ≥ 3.
- Include at least one comparison (`two_col`) or metrics (`stats`) slide when the topic supports it.

---

## Per-layout field shapes

**cover_slide**
```json
{
  "layout": "cover",
  "badge": "short badge label (e.g. Presentation)",
  "title": "main presentation title",
  "subtitle": "brief description or subtitle",
  "background_description": "detailed description of a background image for the cover slide"
}
```

**text**
```json
{
  "layout": "text",
  "title": "slide title",
  "body": "one cohesive paragraph explaining the idea"
}
```

**text_image**
```json
{
  "layout": "text_image",
  "title": "slide title",
  "body": "one cohesive paragraph explaining the idea",
  "visuals": "detailed image description for generation",
  "image_position": "right"
}
```

**numbered**
```json
{
  "layout": "numbered",
  "title": "slide title",
  "items": [
    { "number": "01", "title": "concept name", "body": "short explanation" }
  ]
}
```

**bullets**
```json
{
  "layout": "bullets",
  "title": "slide title",
  "items": [
    { "number": "01", "term": "term name", "description": "short phrase after the dash" }
  ],
  "visuals": "detailed image description for the side image"
}
```

**stats**
```json
{
  "layout": "stats",
  "title": "slide title",
  "subtitle": "equation, formula, or short unifying line",
  "items": [
    { "value": "6", "label": "main label", "sublabel": "status word (e.g. absorbed)" }
  ]
}
```

**grid**
```json
{
  "layout": "grid",
  "title": "slide title",
  "items": [
    { "number": "01", "title": "factor name", "body": "short explanation" }
  ]
}
```

**two_col**
```json
{
  "layout": "two_col",
  "title": "slide title",
  "columns": [
    { "title": "left side title", "theme": "positive", "bullets": ["point 1", "point 2", "point 3"] },
    { "title": "right side title", "theme": "contrast", "bullets": ["point 1", "point 2", "point 3"] }
  ]
}
```

**summary**
```json
{
  "layout": "summary",
  "title": "slide title",
  "points": ["takeaway 1", "takeaway 2", "takeaway 3"],
  "callout": "one memorable highlight sentence"
}
```

---

## Full structure example (replace all placeholders with real "{topic}" content)

```json
{
  "cover_slide": {
    "layout": "cover",
    "badge": "short badge label",
    "title": "main presentation title",
    "subtitle": "brief description or subtitle",
    "background_description": "detailed thematic background image description"
  },
  "slides": [
    {
      "layout": "text_image",
      "title": "opening concept title",
      "body": "detailed paragraph explaining the opening idea",
      "visuals": "detailed image description that illustrates this concept",
      "image_position": "right"
    },
    {
      "layout": "numbered",
      "title": "components or steps title",
      "items": [
        { "number": "01", "title": "first concept", "body": "short explanation" },
        { "number": "02", "title": "second concept", "body": "short explanation" },
        { "number": "03", "title": "third concept", "body": "short explanation" }
      ]
    },
    {
      "layout": "bullets",
      "title": "key terms title",
      "items": [
        { "number": "01", "term": "term one", "description": "what it is or does" },
        { "number": "02", "term": "term two", "description": "what it is or does" },
        { "number": "03", "term": "term three", "description": "what it is or does" },
        { "number": "04", "term": "term four", "description": "what it is or does" }
      ],
      "visuals": "detailed side-image description"
    },
    {
      "layout": "stats",
      "title": "quantities or equation title",
      "subtitle": "unifying equation or short line",
      "items": [
        { "value": "6", "label": "metric label", "sublabel": "status word" },
        { "value": "6", "label": "metric label", "sublabel": "status word" },
        { "value": "1", "label": "metric label", "sublabel": "status word" },
        { "value": "6", "label": "metric label", "sublabel": "status word" }
      ]
    },
    {
      "layout": "grid",
      "title": "factors title",
      "items": [
        { "number": "01", "title": "factor one", "body": "short explanation" },
        { "number": "02", "title": "factor two", "body": "short explanation" },
        { "number": "03", "title": "factor three", "body": "short explanation" }
      ]
    },
    {
      "layout": "two_col",
      "title": "comparison title",
      "columns": [
        { "title": "side A", "theme": "positive", "bullets": ["point 1", "point 2", "point 3"] },
        { "title": "side B", "theme": "contrast", "bullets": ["point 1", "point 2", "point 3"] }
      ]
    },
    {
      "layout": "summary",
      "title": "summary title",
      "points": [
        "takeaway sentence one",
        "takeaway sentence two",
        "takeaway sentence three",
        "takeaway sentence four"
      ],
      "callout": "one memorable highlight sentence"
    }
  ]
}
```

The example above illustrates multiple layouts. Your `"slides"` array must contain exactly `{noOfSlides}` objects — add, remove, or reorder layouts as needed for the topic, while keeping a varied mix and ending with `summary` when possible.

REMEMBER:
- Generate ALL {noOfSlides} slides in the array. Do not stop after one slide.
- Replace ALL placeholder text with actual content about "{topic}"
- Do NOT use generic placeholder text — create specific, relevant content for the actual topic
- Every content slide MUST include a valid `"layout"` value from the allowed list

Title Requirements:
    • Craft attention-grabbing, curiosity-inducing titles that make the audience eager to learn more.
    • Titles should be concise yet powerful, using action words, questions, or surprising facts.
    • Avoid generic titles; each title should hint at valuable insights or revelations.
    • Examples of engaging title styles: "The Hidden Science Behind...", "Why X Changes Everything", "3 Surprising Facts About...", "The Secret to Understanding...".

Content Requirements:
    • Write content that educates deeply while remaining accessible and engaging.
    • Include relevant facts, statistics, examples, or analogies that make concepts memorable.
    • Explain the "why" behind facts, not just the "what" — help the audience truly understand.
    • Use storytelling elements where appropriate to make information stick.
    • Each slide should deliver a clear takeaway or insight the audience will remember.
    • Content should be substantial enough to inform but concise enough for slide format.
    • Content should be appropriate for {grade} level students.
    • The teaching method ({teachingMethod}) should be reflected in how the content is structured and presented.
    • Keep bullet points, card bodies, and stats labels short enough to fit on a slide without walls of text.
    • Honor `{curriculum_framework}` (BNCC / CURRICULO_PAULISTA / Portuguese default BNCC / omit for non-PT or `uni`); never invent skill codes; pack framing into existing fields only.
    • Make the inquiry cycle visible across the deck when BNCC or CURRICULO_PAULISTA applies.

Slide Flow & Connection:
    • You MUST create exactly {noOfSlides} slides in the "slides" array — this is not optional.
    • Structure slides in a logical narrative arc that builds understanding progressively.
    • Each slide should naturally lead into the next, creating anticipation for what comes next.
    • Use transitional concepts that connect ideas across slides seamlessly.
    • The presentation should feel like a cohesive story, not disconnected facts.
    • End with a `summary` slide that synthesizes earlier points when `{noOfSlides}` ≥ 3.
    • When CURRICULO_PAULISTA, put the compact CP mapping line in `summary.callout` (or cover subtitle if no summary).
    • Ensure the "slides" array contains exactly {noOfSlides} objects before finalizing your response.

Cover Slide Requirements:
    • cover_slide.layout MUST be `"cover"`.
    • The title must be compelling and thought-provoking.
    • The subtitle should set expectations and create excitement about what the audience will learn.
    • The badge should be a short localized label appropriate for {language} (e.g. "Presentation" / "Apresentação").
    • The background_description should describe an attractive, thematic background image that sets the tone.

Visual Requirements (only where the layout needs an image):
    • Include `visuals` / `background_description` ONLY on: `cover`, `text_image`, and `bullets`.
    • Do NOT add `visuals` to `text`, `numbered`, `stats`, `grid`, `two_col`, or `summary`.
    • Descriptions must be specific enough to generate a relevant educational image (e.g. "A colorful diagram showing Newton's three laws of motion with arrows and force vectors").
    • Choose visuals that add educational value, not just decoration.

FINAL REMINDER:
- The "slides" array MUST contain exactly {noOfSlides} slide objects
- Each slide must have a unique title and a valid `"layout"`
- Use a varied mix of layouts; do not default everything to `text` or `text_image`
- Do not generate only the cover slide — you must generate all {noOfSlides} content slides
- Apply effective `{curriculum_framework}` (BNCC / CURRICULO_PAULISTA / generic); no invented codes; no new curriculum JSON keys
- When CURRICULO_PAULISTA, include SP/CTSA-driven examples and one compact CP mapping line in `summary.callout` (or cover subtitle)
- Output ONLY valid JSON, no extra text, no preamble, no explanations
