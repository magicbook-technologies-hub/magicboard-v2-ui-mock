# Worksheet from master lesson plan (thin derivative)

Input: full `lessonPlan` JSON (V2).
Output: minified JSON only:

```json
{
  "worksheet": {
    "header": { "title": "", "subject": "", "grade": "" },
    "sections": [
      { "heading": "", "instructions": "", "labels": [], "items": [], "questions": [], "prompt": "" }
    ]
  }
}
```

Rules:
- Derive ONLY from activities, assessment.quickChecks, contentDiscovery diagram labels, exitCheck.
- Do not invent new curriculum codes or contradict the master plan.
- Language = `lessonPlan.lessonInfo.language`.
