# Simulation brief from master lesson plan

Input: `lessonPlan` V2 JSON.
Output minified JSON:

```json
{
  "simulation": {
    "type": "simulation_brief",
    "title": "",
    "variables": [{ "id": "", "label": "", "min": 0, "max": 100, "default": 50 }],
    "outputs": [{ "id": "", "label": "" }],
    "learnerPrompt": "",
    "embedUrl": null
  }
}
```

Rules: variables must relate to topic; no fake embed URLs; language from lessonInfo.
