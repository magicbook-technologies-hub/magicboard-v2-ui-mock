# VEO3 PRODUCTION PROMPT - ANIMATE ONLY MODE (HAND-ELIMINATION OPTIMIZED) - KERNEL Format

## CONTEXT (Input)

### Core Template Variables

- **Style:** `{style}`
- **Visuals:** `{scene_visuals}` ← **MUST start with "The video frame contains:"**
- **Motion:** `{scene_motion}` ← **Format: "FROZEN_ELEMENTS: bg&#124;page&#124;labels&#124;text&#124;borders &#124; ANIMATED: ONLY-[subject]&#124;motion:[type]&#124;rate:[value] &#124; CAMERA: locked-static"**
- **Voiceover:** `{scene_voiceover}` ← **Third-person, subject demonstrates itself. MAXIMUM 14 words per scene. Minimum 2 words per second pacing.**
- **Extras:** `{scene_extras}` ← **Positive statements only**
- **Persona:** `{persona}` ← **Specifies voice, tone, pace, energy, and delivery style. Format: "VOICE: OpenAI '[Name]' preset &#124; TONE: [Educational/Scientific] &#124; PACE: [WPM] &#124; ENERGY: [X/10] &#124; AGE: [X-Y] &#124; DELIVERY: [Clear/Authoritative]"**

### Technical Specifications

- **Aspect Ratio:** 9:16
- **Duration:** 8 seconds
- **Audio:** Fade-in 1s (0-1s), Fade-out 1s (7-8s), Voiceover only + essential sounds, NO background music
- **Voiceover Requirements:**
  - **Maximum:** 14 words per scene voiceover
  - **Pacing:** Minimum 2 words per second (ensures clear, comprehensible narration)
  - **Audio Fade:** 1 second fade-in at start (0-1s), 1 second fade-out at end (7-8s)
  - Voiceover must be concise, educational, and third-person perspective
- **Background:** Plain white (#FFFFFF), 100% static, NO shadows
- **Camera:** Locked static, NO movement
- **Frame Fill:** Complete, NO black borders. **CRITICAL:** All padding areas (top, bottom, left, right) where there is no image content MUST be solid white (#FFFFFF), NOT black. This applies to all video processing and generation steps.
- **Padding Policy:** When aspect ratio differs or content doesn't fill entire frame, use scale-to-fill with center-crop OR extend pure white (#FFFFFF) background to edges. NEVER show black borders, black letterboxing, black pillarboxing, or black padding around the video. All empty areas must be white.
- **Visual Style Reference:** The video should match this exact visual style: Subject/drawing is CENTERED in the frame with substantial white padding areas at the top and bottom (and sides if needed). The white background should be prominent and visible, especially above and below the main content. This creates a clean, educational look with the subject clearly isolated against pure white space.
- **Shadow Policy:** ZERO shadows except those inherent to drawn subject. NO shadows of hands, humans, or body parts anywhere in frame. If source image has shadows around the sheet, they must be removed and replaced with white background.

### Persona Specification (Voice Configuration)

**Format:** 
```
VOICE: OpenAI '[Name]' preset &#124; TONE: [Educational/Scientific] &#124; PACE: [WPM] &#124; ENERGY: [X/10] &#124; AGE: [X-Y] &#124; DELIVERY: [Clear/Authoritative]
```

**Age Presets (For SIMPLE/INTERMEDIATE Content):**
- **3-5:** Breeze &#124; Educational-Nurturing &#124; 100 WPM &#124; 6/10 &#124; "Gentle, nurturing, storytelling warmth"
- **6-8:** Coral &#124; Educational-Encouraging &#124; 110 WPM &#124; 7/10 &#124; "Bright, encouraging, 'favorite teacher' energy"
- **9-12:** Coral &#124; Knowledgeable-Scientific &#124; 120 WPM &#124; 7/10 &#124; "Friendly confidence, approachable companion"
- **13+:** Coral &#124; Professional-Scientific &#124; 130 WPM &#124; 6/10 &#124; "Professional narrator, polished authority"

**Advanced Content Override (OVERRIDE AGE PRESETS):**
- **Ages 6-8 (Advanced):** Coral &#124; Academic-Educator &#124; 105 WPM &#124; 7/10 &#124; "Young professor tone—mature delivery, NOT playful"
- **Ages 9-12 (Advanced):** Coral &#124; Academic-Educator &#124; 115 WPM &#124; 7/10 &#124; "Academic educator—intellectual gravitas, authoritative"
- **Ages 13+ (Advanced):** Coral &#124; Professional-Scientific &#124; 125 WPM &#124; 7/10 &#124; "PhD lecturer—commanding presence, scholarly precision"

**CRITICAL RULES:**
- Single voice throughout (no mixing)
- Educational tone mandatory (no childish baby-talk)
- Maturity MUST match age AND topic complexity - Advanced topics require mature delivery even for younger ages
- Voice characteristics locked after Scene 1
- Pacing adjustments: Advanced content = -5 to -10 WPM slower for processing

---

## TASK (Function)

### Primary Goal

Generate video content from input parameters following strict visual consistency, animation scope, and frame composition rules. The video must demonstrate the subject's autonomous function while maintaining exact visual fidelity to the source image.

### Visual Consistency Requirements (Multi-Scene Videos)

**MANDATORY FOR ALL 2-3 SCENE VIDEOS:**

**1. Visual Identity Lock - IDENTICAL ACROSS ALL SCENES**
- Same subject appearance: Colors, proportions, patterns, and physical features must be IDENTICAL across all scenes
- Same paper/sheet position: Pixel-perfect match - same coordinates, angle, lighting, and position in frame
- Same background: White background (#FFFFFF) with identical padding and positioning
- Same frame composition: Exact same visual setup - only the subject's animation changes
- CRITICAL: Scene 1 establishes the visual reference - Scenes 2-3 must copy-paste the visual description from Scene 1
- Page Lock Protocol: All scenes reference the same "static frozen reference layer" established in Scene 1

**2. Smooth Motion Consistency**
- Similar motion patterns: Motion type, rate, and quality must be consistent across all scenes
- Smooth transitions: Motion should flow naturally from Scene 1 → Scene 2 → Scene 3
- No abrupt changes: Motion intensity, speed, and style should remain similar throughout
- Quality preservation: Same smooth, fluid, seamless motion quality across all scenes
- CRITICAL: If Scene 1 uses "gentle unified swaying", all scenes should use similar gentle, unified motion patterns

### Notebook Sheet Preservation

**When Main Object is on Notebook Sheet:**
- The notebook sheet is the ONLY visible element (aside from white background and drawn subject)
- ANYTHING around the sheet should NOT be changed because it should NOT EXIST
- Frame should show ONLY: white background + complete sheet + drawn subject
- If source image contains hands/shadows around the sheet, they MUST be cropped/removed and replaced with white background

**MANDATORY RULE:**
- The frame contains ONLY three elements: white background, the notebook sheet, and the drawn subject
- NO external elements (hands, humans, shadows, body parts, props, pens, pencils, bottles, containers, pouring water) are present or should be visible
- NO PROPS OF ANY KIND - NO pens, NO pencils, NO markers, NO bottles, NO containers, NO pouring water, NO visual metaphors
- All areas around the sheet that might contain hands/shadows/objects/props should be white background only
- Frame contains ONLY: white background + original drawing. Nothing else.

### Specialized Plant Rules

**STRUCTURAL PROHIBITION RULE (PLANT):**
- Maintain exact structure and shape of the drawn plant. Preserve original leaf count, stem shape, and root lines exactly as drawn
- ZERO structural modification is permitted
- The model should not extend, duplicate, or invent new lines that alter the drawing's shape
- NO appendage-like additions

**MOTION RULE (PLANT):**
- ONLY gentle unified swaying motion applied to leaves and stem
- Roots remain completely static (100% FROZEN)
- NO separation, stretching, or independent articulation of any drawn segment
- Motion must be unified - leaves and stem move as a single cohesive unit
- Individual leaves and stem segments should NOT move independently or separately

**For Plant Subjects - Format:**
```
STRUCTURAL_PROHIBITION: maintain-exact-drawn-structure&#124;preserve-original-leaf-count&#124;preserve-stem-shape&#124;preserve-root-lines&#124;zero-structural-modification&#124;no-line-extensions&#124;no-duplications&#124;no-invented-lines&#124;no-appendage-additions&#124;no-shape-alterations&#124;no-appendage-like-additions
MOTION_RESTRICTION: ONLY-gentle-unified-swaying&#124;leaves-and-stem-move-as-one&#124;roots-100%-static&#124;no-segment-separation&#124;no-stretching&#124;no-independent-articulation&#124;no-individual-leaf-motion&#124;unified-motion-only
```

### Mandatory Pre-Processing Protocol

**BEFORE submitting ANY video generation request:**

**STEP 1: Source Image Forensic Analysis**
- Zoom to 400% and scan ENTIRE image boundary
- Mark EVERY pixel containing:
  - Hand shapes (full, partial, at edges)
  - Finger shapes (any of 5 digits)
  - Arm/wrist shapes
  - Human shadows (especially near hands/fingers)
  - Ambiguous shapes that COULD be hands
- Document exact pixel coordinates of ALL marked areas

**STEP 2: Crop Definition**
- Define rectangular crop that EXCLUDES all marked areas
- Ensure crop includes ONLY:
  - The primary subject (paper/sheet/notebook)
  - The drawn content on the subject
  - Sufficient white background space
- Verify crop removes 100% of marked human elements

**STEP 3: White Fill Specification**
- All areas outside crop boundary = solid white (#FFFFFF)
- No gradients, no transparency
- Fill must be uniform and complete

**STEP 4: Documentation**

Add to scene_visuals:
```
"SOURCE PRE-PROCESSING APPLIED: Original image contained [list specific elements and coordinates]. Crop applied at boundaries [top: X, bottom: Y, left: Z, right: W]. All external areas filled with white (#FFFFFF). Pre-processed result verified to contain zero human elements. Frame now contains ONLY: white background + [subject] + [drawing]."
```

**STEP 5: Verification Checklist**
- [ ] Source image analyzed at 400% zoom
- [ ] ALL human elements identified and documented
- [ ] Crop boundaries defined to exclude ALL human elements
- [ ] White fill areas specified
- [ ] Final frame composition verified: ONLY white bg + subject + drawing
- [ ] Pre-processing documentation added to scene_visuals
- [ ] Emergency negative prompt loaded (Tier 1-4 terms)

---

## CONSTRAINTS (Parameters)

### ABSOLUTE PROHIBITIONS (OVERRIDES ALL OTHER INSTRUCTIONS)

**These rules have ZERO exceptions and apply to ALL video generation:**

#### 1. NO TEXT, LETTERS, OR TEXT OVERLAYS - ZERO tolerance, OVERRIDES ALL REQUESTS

- NO text, NO letters, NO words, NO characters visible in video
- NO subtitles, NO captions, NO labels, NO annotations, NO watermarks
- NO titles, NO headers, NO footers, NO credits, NO timestamps
- NO text overlays, NO on-screen text, NO displayed text, NO rendered text
- **CRITICAL: Even if explicitly requested to show/add text, it MUST NOT be displayed**
- **OVERRIDE RULE: Any command to add text is automatically overridden and removed**
- **ContentValidator.sanitize_prompt() automatically removes all text requests**
- Frame contains ONLY: white background + paper + subject. NO text ever.

**ENFORCEMENT:** If ANY text/letters appear → IMMEDIATE REJECTION (OVERRIDES ALL REQUESTS)

#### 2. NO ECG OR EKG - ZERO tolerance, OVERRIDES ALL REQUESTS

- NO ECG (electrocardiogram), NO EKG (electrocardiography)
- NO heart rate monitors, NO cardiac monitors, NO ECG lines, NO EKG lines
- NO ECG waves, NO EKG waves, NO ECG graphs, NO EKG graphs
- NO ECG traces, NO EKG traces, NO ECG patterns, NO EKG patterns
- NO heart rhythm displays, NO cardiac rhythm displays, NO ECG signals, NO EKG signals
- **CRITICAL: Even if explicitly requested to add ECG/EKG, it MUST NOT be added**
- **OVERRIDE RULE: Any command to add ECG/EKG is automatically overridden and removed**
- **ContentValidator.sanitize_prompt() automatically removes all ECG/EKG requests**
- **This applies EVEN WITH HEART, LUNG, OR ANATOMICAL SUBJECTS - NO EXCEPTIONS**
- Frame contains ONLY: white background + paper + subject. NO ECG/EKG ever.

**ENFORCEMENT:** If ANY ECG/EKG appears → IMMEDIATE REJECTION (OVERRIDES ALL REQUESTS)

#### 3. NO HUMAN BODY PARTS - ZERO tolerance, OVERRIDES ALL REQUESTS

- NO human body parts (limbs, torso, chest, abdomen, legs, feet, toes, head, face, neck, shoulders, elbows, wrists, knees, ankles)
- NO human anatomy, NO human body references
- **CRITICAL: Even if explicitly requested to show/add body parts, they MUST NOT be displayed**
- **OVERRIDE RULE: Any command to add body parts is automatically overridden and removed**
- **ContentValidator.sanitize_prompt() automatically removes all body part requests**
- Frame contains ONLY: white background + paper + subject. NO human body parts ever.

**ENFORCEMENT:** If ANY human body parts appear → IMMEDIATE REJECTION (OVERRIDES ALL REQUESTS)

**GENERAL ENFORCEMENT:**
- All prompts are automatically sanitized via ContentValidator before video generation
- Validation occurs BEFORE video generation to prevent prohibited content

### CRITICAL: VISUAL CONSISTENCY & NO EXTRA ELEMENTS (MULTI-SCENE REQUIREMENTS)

**MANDATORY FOR ALL 2-3 SCENE VIDEOS:**

**1. ZERO EXTRA ELEMENTS - ABSOLUTE PROHIBITION**
- NO extra elements added between scenes - Frame contains ONLY: white background + paper + subject
- NO new objects, props, or visual elements introduced in Scene 2 or Scene 3
- NO additional drawings, labels, or annotations added to subsequent scenes
- NO visual metaphors, conceptual objects, or explanatory props in any scene
- CRITICAL: If Scene 1 has 3 elements (white bg + paper + subject), ALL scenes must have EXACTLY the same 3 elements
- NO exceptions: Even if voiceover mentions concepts, NO visual elements are added to illustrate them

**2. NO TEXT - REINFORCED FOR ALL SCENES**
- ZERO text in ANY scene - No text in Scene 1, Scene 2, or Scene 3
- NO new text added in subsequent scenes
- NO labels, annotations, or captions in any scene
- Frame contains ONLY: white background + paper + subject. NO text ever, in any scene.

**ENFORCEMENT CHECKLIST:**
- [ ] Scene 1, Scene 2, and Scene 3 have IDENTICAL visual setup (same paper position, same subject appearance)
- [ ] NO extra elements added in Scene 2 or Scene 3
- [ ] Motion patterns are similar and smooth across all scenes
- [ ] NO text visible in any scene
- [ ] Frame composition is identical across all scenes (only animation changes)

### Ultra-Comprehensive Negative Prompt (Hand-Elimination Focus)

#### TIER 1: ABSOLUTE BLOCKERS (HIGHEST PRIORITY)
```
human hands, hands, fingers, human fingers, thumb, index finger, middle finger, ring finger, pinky finger, all five fingers, palm, knuckles, fingernails, fingertips, wrist, forearm, arm, elbow, hand gesture, pointing hand, holding hand, grasping hand, open hand, closed hand, fist, hand at edge, hand at corner, hand at border, partial hand, cropped hand, hand fragment, hand entering frame
```

#### TIER 2: SHADOW & SILHOUETTE ELIMINATION
```
hand shadow, finger shadow, shadow of hand, shadow of fingers, shadow containing hands, shadow with human shape, human shadow, person shadow, body shadow, arm shadow, limb shadow, hand silhouette, finger silhouette, hand-shaped shadow, finger-shaped shadow, dark hand shape, shadow on paper showing hands, shadow overlay with hands, partial hand shadow, cropped hand shadow, hand shadow from edge, hand shadow at border, any shadow resembling hands or human body parts
```

#### TIER 3: CONTEXTUAL HAND BLOCKS
```
hand turning page, hand holding paper, hand holding notebook, hand touching sheet, hand pointing at drawing, hand indicating subject, hand gesture toward subject, hand near drawing, hand beside sheet, hand above paper, hand below paper, hand reaching, hand approaching, hand interacting, fingers touching paper, fingers on sheet, palm on page, hand resting on surface
```

#### TIER 4: AMBIGUOUS SHAPE BLOCKS
```
hand-like shape, finger-like shape, hand-like form, digit-like protrusion, five-fingered appendage, hand appendage, manual extremity, appendage resembling hand, protrusion resembling fingers, shape similar to hand, form similar to fingers, ambiguous hand shape, unclear hand shape, partial hand shape, hand-shaped object
```

#### TIER 5: HUMAN ANATOMY COMPLETE BLOCK (ABSOLUTE PROHIBITION)
```
human body parts, human anatomy, arms, human arms, legs, human legs, feet, human feet, toes, human face, human head, human torso, human body, human chest, human abdomen, human neck, human shoulders, human elbows, human wrists, human knees, human ankles, person, people, human figure, human silhouette, human outline, human shape, anatomical hands, anatomical fingers, anatomical limbs, body parts, limbs, extremities, human limbs, human extremities
```
**CRITICAL:** Human body parts are ABSOLUTELY PROHIBITED - even if requested, they MUST NOT be displayed. ContentValidator automatically removes all body part requests.

#### TIER 6: CHARACTER & AGENT BLOCKS
```
teacher character, doctor character, guide character, narrator character, mascot character, explainer figure, helper character, human character, person character, stick figure, cartoon person, illustrated person, drawn person, character holding something, character pointing, character demonstrating, character showing, character explaining, anthropomorphic hands
```

#### TIER 7: TECHNICAL & OVERLAY BLOCKS (ECG/EKG ABSOLUTE PROHIBITION)
```
medical overlays, diagnostic overlays, EKG lines, ECG lines, ECG displays, EKG displays, electrocardiogram, electrocardiography, heart rate monitors, cardiac monitors, ECG waves, EKG waves, ECG graphs, EKG graphs, ECG traces, EKG traces, ECG patterns, EKG patterns, heart rhythm displays, cardiac rhythm displays, ECG signals, EKG signals, medical graphics, diagnostic graphics, waveforms, pulse lines, monitoring lines, overlay graphics, arrows, annotation lines, circles appearing, boxes appearing, labels overlay, pointer, indicator, cursor, interface elements, UI elements
```
**CRITICAL:** ECG/EKG is ABSOLUTELY PROHIBITED - even if requested, it MUST NOT be added. ContentValidator automatically removes all ECG/EKG requests.

#### TIER 8: STRUCTURAL & QUALITY BLOCKS
```
extra limbs, duplicate parts, missing body parts, extra appendages, duplicated lines, extended lines, invented lines, additional segments, morphing, distorted anatomy, stretched anatomy, warped shapes, line extensions, shape modifications, structural alterations
```

#### CAMERA/BACKGROUND BLOCKING:
```
camera movement, camera zoom, camera pan, camera rotation, camera tilt, dolly shot, tracking shot, orbit, black borders, black letterboxing, black pillarboxing, black bars, black padding, vignette, frame borders, animated background, moving background, moving trees, moving clouds, moving particles, animated environment, moving props, animated shadows, background motion, environmental animation
```
**NOTE:** White padding and white borders are REQUIRED for areas without image content. Only BLACK borders/padding/letterboxing/pillarboxing are blocked.

#### TEXT/OVERLAY BLOCKING (ABSOLUTE PROHIBITION):
```
text overlay, text on screen, on-screen text, screen text, visible text, displayed text, rendered text, generated text, added text, included text, shown text, subtitles, captions, watermarks, timestamps, headers, footers, annotations, labels appearing, text appearing, letters appearing, words appearing, characters appearing, UI overlay, menu, button, icon, logo, title card, lower third, text overlay graphics, text annotations, text labels, text captions, any text visible in video, any letters visible in video, any words visible in video
```
**CRITICAL:** Text/letters are ABSOLUTELY PROHIBITED - even if requested, they MUST NOT be displayed. ContentValidator automatically removes all text/letter requests.

#### OBJECT/TOOL BLOCKING (CRITICAL - ZERO TOLERANCE):
```
drawing tools, pencils, pens, markers, rulers, compass, eraser, brush, stylus, tools, implements, utensils, objects, props, props entering frame, external objects, foreign objects, unrelated objects, water bottles, bottles, containers, cups, glasses, pouring water, spilling, dripping, liquid pouring, water pouring, props of any kind, writing instruments, pens, pencils, markers, any props, any external objects, visual metaphors, conceptual objects, objects to illustrate concepts, props to explain concepts, water bottles for fluid balance, scales for balance, pens for writing, any objects not in original drawing
```

#### SPATIAL BLOCKING:
```
black empty space, black padding, black borders, black bars, black letterboxing, black pillarboxing, void, gap appearing, separation, splitting, fragmentation, disintegration, parts separating, elements detaching
```
**NOTE:** White empty space is ALLOWED and REQUIRED for padding areas. Only BLACK empty space/padding is blocked.

### Policy Constraints

- **Text Policy:** **ABSOLUTE PROHIBITION - NO TEXT, NO LETTERS, NO TEXT OVERLAYS.** Even if explicitly requested, text MUST NOT be displayed. ContentValidator automatically removes all text requests before video generation.
- **ECG/EKG Policy:** **ABSOLUTE PROHIBITION - NO ECG, NO EKG, NO CARDIAC MONITORS.** Even if explicitly requested, ECG/EKG MUST NOT be added. This applies EVEN WITH HEART, LUNG, OR ANATOMICAL SUBJECTS. ContentValidator automatically removes all ECG/EKG requests before video generation.
- **Body Parts Policy:** **ABSOLUTE PROHIBITION - NO HUMAN BODY PARTS.** Even if explicitly requested, human body parts MUST NOT be displayed. ContentValidator automatically removes all body part requests before video generation.

### IF HANDS STILL APPEAR - EMERGENCY PROTOCOL

1. **Source Analysis:**
   - Re-examine input image pixel-by-pixel
   - Identify ALL hand-like shapes (even ambiguous, even at edges)
   - Identify ALL shadows that could be interpreted as hands or human shapes
   - Identify ANY elements around the notebook sheet that are not part of the sheet or subject
   - Mark exact pixel boundaries of ALL areas to be removed (hands, shadows, anything around sheet)

2. **Pre-Processing Required (MANDATORY):**
   - Crop input image to EXCLUDE all identified areas (hands, shadows, elements around sheet)
   - Fill ALL cropped areas with solid white (#FFFFFF)
   - Verify NO hand-like shapes remain in pre-processed image
   - Verify NO shadows of hands or humans remain
   - Verify frame shows ONLY: white background + notebook sheet + drawn subject
   - Submit ONLY the pre-processed image to Veo3

3. **Negative Prompt Escalation:**
   - Add to beginning of negative prompt: `"CRITICAL: hands, fingers, human anatomy, shadows of hands, hand-like shapes, finger-like shapes, appendages, extremities"`
   - Increase hand-blocking term count to 60+ variations
   - Add species-specific blocks: "five-digit appendage, digit-like protrusion, finger-like extension, thumb-like shape, palm-like shape"

4. **Positive Prompt Reinforcement:**
   - Add to `scene_visuals`: "The entire frame contains only: white background plus complete paper sheet plus drawn subject. Zero external elements. No props. No pens. No pencils. No bottles. No containers. No pouring water. No hands, no human body parts, no shadows of hands or humans anywhere. Frame contains ONLY three elements: white background, the notebook sheet, and the drawn subject. NO PROPS OF ANY KIND."
   - Add to `scene_extras`: "ISOLATION CONFIRMED: Frame boundary contains only white background, notebook sheet, and drawn subject. All external elements (hands, shadows, human body parts, props, pens, pencils, bottles, containers) excluded. EXTERNAL OBJECTS BAN: NO pens, NO pencils, NO bottles, NO pouring water, NO props, NO visual metaphors. Frame contains ONLY: white background + original drawing. Anything around the sheet is white background only."

---

## FORMAT (Output)

### Variable Formatting Rules

#### {scene_visuals} Template:
```
FRAME COMPOSITION VERIFICATION: This frame has been verified to contain ONLY three elements with NO additional objects: (1) White background (#FFFFFF) filling [X]% of frame, (2) [Subject type: paper/sheet] filling [Y]% of frame positioned at [location], (3) Drawn subject visible at [position] on the sheet.

SOURCE PRE-PROCESSING APPLIED: [If original image contained hands/shadows: "Original source contained [list specific elements: hands at bottom-left, finger shadow at top-right, etc.]. These elements were removed via crop at boundaries [specify coordinates]. All removed areas filled with solid white (#FFFFFF). Pre-processed image verified to contain zero human elements." If clean: "Source image verified human-free - no preprocessing required."]

VISUAL DESCRIPTION: The [color] [sheet/paper] is centered in 9:16 frame with [subject: colors, features, style] visible at [position]. [Text/labels if any]. Lighting is even across sheet.

ANIMATION SCOPE: ONLY the [subject] animates with [motion type]. Sheet, paper texture, labels, text, borders, background, and ALL shadows remain 100% frozen static.

FRAME BOUNDARY CONFIRMATION: The frame shows ONLY the isolated sheet with its drawn subject against clean white background. Zero external objects. Zero props. Zero pens. Zero pencils. Zero bottles. Zero containers. Zero pouring water. Zero hands. Zero fingers. Zero human body parts. Zero shadows of hands or humans. Zero hand-like shapes. Zero finger-like shapes. The frame contains precisely three elements: white background + notebook sheet + drawn subject. Nothing else exists in this frame. NO PROPS OF ANY KIND.

HUMAN ELEMENT VERIFICATION: No human hands, no human fingers (all 5 digits absent), no thumbs, no palms, no knuckles, no fingernails, no wrists, no forearms, no arms, no elbows, no human shadows, no hand shadows, no finger shadows, no hand silhouettes, no partial hands, no cropped hands, no hands at edges, no hands at corners, no hands at borders, no hand-like shapes, no finger-like shapes, no appendages, no extremities are visible anywhere in this frame.
```

#### {scene_motion} Format:
```
FROZEN_ELEMENTS: background-100%&#124;page-100%&#124;labels-100%&#124;text-100%&#124;borders-100%&#124;shadows-100%
ANIMATED_ELEMENT: ONLY-[subject]&#124;motion:[beating/breathing/swaying]&#124;rate:[60-80-BPM/slow-continuous]&#124;quality:smooth-fluid-seamless&#124;structural-preservation:exact
CAMERA: locked-static&#124;zoom:none&#124;pan:none&#124;rotation:none&#124;frame:fixed-8s
STRUCTURAL_RULE: maintain-exact-drawn-shape&#124;zero-structural-modification&#124;no-line-extensions&#124;no-duplications&#124;no-invented-lines&#124;no-appendage-additions
```

#### {scene_extras} Format:
```
Style: [living_sketch/realistic]. 

FRAME COMPOSITION PRE-VERIFICATION: Frame analyzed and verified to contain ONLY three elements: (1) plain white background, (2) notebook sheet/paper, (3) drawn subject. Zero additional elements exist.

SOURCE PRE-PROCESSING: [If applicable: "Original image contained [specific human elements]. Pre-processing applied: crop boundaries at [coordinates], white fill applied to [areas]. Result: zero human elements in final frame." If not applicable: "Source verified human-free."]

ANIMATION SCOPE: Animate ONLY [subject]. All else frozen (background-100%, page-100%, labels-100%, text-100%, borders-100%, shadows-100%).

CAMERA: Locked static 8s, no movement.

HUMAN ELEMENT ABSOLUTE PROHIBITION: NO human hands (zero hands visible), NO human fingers (all digits absent - no thumb, no index, no middle, no ring, no pinky), NO fingertips, NO fingernails, NO knuckles, NO palm, NO wrist, NO forearm, NO arm, NO elbow, NO human body parts, NO human shadows (zero hand shadows, zero finger shadows, zero body shadows), NO hand silhouettes, NO hand-like shapes, NO finger-like shapes, NO partial hands, NO cropped hands, NO hands at edges, NO hands at corners, NO hands at borders, NO appendages, NO extremities anywhere in frame.

FRAME BOUNDARY RULE: Full 9:16 frame filled, zero black borders. Frame shows ONLY isolated sheet with drawn subject against clean white background. **CRITICAL PADDING RULE:** All padding areas (top, bottom, left, right) where there is no image content MUST be solid white (#FFFFFF), NOT black. This applies to all video frames throughout the entire duration. **VISUAL STYLE:** Subject/drawing should be CENTERED with substantial white padding areas visible at top and bottom, creating a clean educational presentation with the content clearly isolated against pure white space.

SPATIAL ISOLATION: No external objects beyond the three verified elements (white bg + sheet + subject). No props. No pens. No pencils. No bottles. No containers. No pouring water. No visual metaphors. Nothing exists around the sheet except white background. Anything that was around the sheet in source (hands, shadows, objects, props) has been removed and replaced with white. Frame contains ONLY: white background + original drawing. Nothing else.

Subject autonomous. Camera locked 8s.
```

### Hand-Prevention Checklist

**Before Generation - Manual Verification:**
- [ ] Input image scanned for ANY human elements
- [ ] All human hands identified in source (even partial/shadow)
- [ ] All human shadows identified in source
- [ ] Frame crop planned to EXCLUDE all human elements
- [ ] Crop boundaries defined (exclude hands/shadows)
- [ ] Fill areas determined (where humans removed, use white)

**In Template Variables:**
- [ ] `scene_visuals` includes: "Frame shows only isolated sheet with drawn subject against clean white background"
- [ ] `scene_visuals` includes: "No external objects, no props, no pens, no pencils, no bottles, no hands, no human body parts, no shadows of hands or humans are visible"
- [ ] `scene_visuals` includes: "The frame contains ONLY three elements: white background, the notebook sheet, and the drawn subject. NO PROPS OF ANY KIND."
- [ ] `scene_motion` includes shadow blocking: "shadows-100%" in FROZEN_ELEMENTS
- [ ] `scene_extras` includes: "No external objects, no props, no pens, no pencils, no bottles, no pouring water, no hands, no human body parts, no shadows of hands or humans are visible"
- [ ] `scene_extras` includes: "Anything around the sheet that might contain hands, shadows, objects, or props must be white background only"
- [ ] `scene_extras` includes: "Frame contains ONLY: white background + original drawing. NO PROPS OF ANY KIND."
- [ ] Primary hand blocking terms in negative prompt (40+ variations)
- [ ] Shadow/silhouette blocking terms in negative prompt (enhanced with hand-specific shadow blocking)
- [ ] Contextual hand blocking terms in negative prompt
- [ ] Source image has been checked for hands/shadows around the sheet - all removed and replaced with white background

**Post-Generation Validation:**
- [ ] ❌ **INSTANT REJECTION CRITERIA (Any ONE triggers full rejection):**
  - **ANY text/letters visible** (includes: subtitles, captions, labels, annotations, watermarks, titles, headers, footers, credits, timestamps, text overlays, on-screen text, displayed text, rendered text, any text visible in video) → **OVERRIDES ALL REQUESTS**
  - **ANY ECG/EKG visible** (includes: ECG lines, EKG lines, ECG waves, EKG waves, ECG graphs, EKG graphs, ECG traces, EKG traces, heart rate monitors, cardiac monitors, electrocardiogram, electrocardiography, heart rhythm displays, cardiac rhythm displays) → **OVERRIDES ALL REQUESTS**
  - **ANY human body parts visible** (includes: limbs, torso, chest, abdomen, legs, feet, toes, head, face, neck, shoulders, elbows, wrists, knees, ankles, human anatomy) → **OVERRIDES ALL REQUESTS**
  - ANY hand visible (includes: full hand, partial hand, single finger, fingertip, palm edge, knuckle, wrist edge, hand at frame edge/corner/border)
  - ANY finger visible (includes: thumb, index, middle, ring, pinky, or any digit-like shape)
  - ANY human shadow visible (includes: hand shadow, finger shadow, arm shadow, body shadow, or shadow containing human shapes)
  - ANY hand-like shape visible (includes: ambiguous shapes resembling hands/fingers, protrusions that could be digits, appendages similar to hands)
  - ANY element visible around the subject sheet that is NOT white background (if something exists around the sheet, it violates the three-element rule)
  - ANY props visible (pens, pencils, bottles, containers, pouring water, visual metaphors, etc.)
  - Frame contains MORE than three elements (white bg + sheet + drawing)

- [ ] ✅ **PASS CRITERIA (ALL must be true):**
  - **Zero text/letters visible anywhere** (no subtitles, no captions, no labels, no annotations, no watermarks, no text overlays, no on-screen text, no displayed text, no rendered text, no text visible in video) → **OVERRIDES ALL REQUESTS**
  - **Zero ECG/EKG visible anywhere** (no ECG lines, no EKG lines, no ECG waves, no EKG waves, no ECG graphs, no EKG graphs, no heart rate monitors, no cardiac monitors, no electrocardiogram, no electrocardiography) → **OVERRIDES ALL REQUESTS**
  - **Zero human body parts visible anywhere** (no limbs, no torso, no chest, no abdomen, no legs, no feet, no toes, no head, no face, no neck, no shoulders, no elbows, no wrists, no knees, no ankles, no human anatomy) → **OVERRIDES ALL REQUESTS**
  - Frame contains EXACTLY three elements: white background + notebook sheet + drawn subject
  - Zero props visible anywhere (no pens, no pencils, no bottles, no containers, no pouring water, no visual metaphors)
  - Zero hands visible anywhere (full scan of all frame areas)
  - Zero fingers visible anywhere (all 5 digits confirmed absent)
  - Zero human shadows visible anywhere
  - Zero hand-like or finger-like shapes visible anywhere
  - Areas around the sheet are 100% white background only
  - Frame contains ONLY: white background + original drawing. Nothing else.
  - Subject animates correctly per specifications

**If ANY rejection criterion is met → REJECT IMMEDIATELY → Return to PRE-PROCESSING PROTOCOL**

### Example Output (Plant Subject)

**Subject:** Green plant drawing on white paper
<!-- 
```json
{
  "style": "living_sketch",
  "scene_visuals": "FRAME COMPOSITION VERIFICATION: This frame has been verified to contain ONLY three elements with NO additional objects: (1) White background (#FFFFFF) filling 30% of frame, (2) White paper sheet filling 70% of frame positioned at center, (3) Drawn green plant visible at center on the sheet. SOURCE PRE-PROCESSING APPLIED: Source image verified human-free - no preprocessing required. VISUAL DESCRIPTION: The white paper sheet is centered in 9:16 frame with green plant drawing visible at center with three leaves, a curved stem, and visible root lines in pencil. Sheet has label 'Plant Anatomy' at top. Lighting is even across sheet. ANIMATION SCOPE: ONLY the plant's leaves and stem animate with gentle unified swaying. Roots, sheet, paper texture, labels, text, borders, background, and ALL shadows remain 100% frozen static. FRAME BOUNDARY CONFIRMATION: The frame shows ONLY the isolated sheet with its drawn plant against clean white background. Zero external objects. Zero props. Zero pens. Zero pencils. Zero bottles. Zero containers. Zero pouring water. Zero hands. Zero fingers. Zero human body parts. Zero shadows of hands or humans. Zero hand-like shapes. Zero finger-like shapes. The frame contains precisely three elements: white background + notebook sheet + drawn plant. Nothing else exists in this frame. NO PROPS OF ANY KIND. HUMAN ELEMENT VERIFICATION: No human hands, no human fingers (all 5 digits absent), no thumbs, no palms, no knuckles, no fingernails, no wrists, no forearms, no arms, no elbows, no human shadows, no hand shadows, no finger shadows, no hand silhouettes, no partial hands, no cropped hands, no hands at edges, no hands at corners, no hands at borders, no hand-like shapes, no finger-like shapes, no appendages, no extremities are visible anywhere in this frame.",
  
  "scene_motion": "FROZEN_ELEMENTS: background-100%&#124;page-100%&#124;labels-100%&#124;text-100%&#124;borders-100%&#124;shadows-100%&#124;roots-100% &#124; ANIMATED_ELEMENT: ONLY-plant-leaves-and-stem&#124;motion:gentle-unified-swaying&#124;rate:slow-continuous&#124;quality:smooth-fluid-seamless&#124;structural-preservation:exact &#124; CAMERA: locked-static&#124;zoom:none&#124;pan:none&#124;rotation:none&#124;frame:fixed-8s &#124; STRUCTURAL_PROHIBITION: maintain-exact-drawn-structure&#124;preserve-original-leaf-count:3&#124;preserve-stem-shape&#124;preserve-root-lines&#124;zero-structural-modification&#124;no-line-extensions&#124;no-duplications&#124;no-invented-lines&#124;no-appendage-additions &#124; MOTION_RESTRICTION: ONLY-gentle-unified-swaying&#124;leaves-and-stem-move-as-one&#124;roots-100%-static&#124;no-segment-separation&#124;no-stretching&#124;no-independent-articulation",
  
  "scene_voiceover": "This is an image of a plant. Its leaves and stem sway gently together, while the roots remain firmly in place.",
  
  "scene_extras": "Style: living_sketch. FRAME COMPOSITION PRE-VERIFICATION: Frame analyzed and verified to contain ONLY three elements: (1) plain white background, (2) notebook sheet/paper, (3) drawn plant subject. Zero additional elements exist. NO PROPS OF ANY KIND. SOURCE PRE-PROCESSING: Source verified human-free. ANIMATION SCOPE: Animate ONLY plant leaves and stem with unified swaying. All else frozen (background-100%, page-100%, labels-100%, text-100%, borders-100%, shadows-100%, roots-100%). CAMERA: Locked static 8s, no movement. EXTERNAL OBJECTS BAN: NO pens, NO pencils, NO markers, NO bottles, NO containers, NO pouring water, NO props, NO visual metaphors. Frame contains ONLY: white background + original drawing. Nothing else. HUMAN ELEMENT ABSOLUTE PROHIBITION: NO human hands (zero hands visible), NO human fingers (all digits absent - no thumb, no index, no middle, no ring, no pinky), NO fingertips, NO fingernails, NO knuckles, NO palm, NO wrist, NO forearm, NO arm, NO elbow, NO human body parts, NO human shadows (zero hand shadows, zero finger shadows, zero body shadows), NO hand silhouettes, NO hand-like shapes, NO finger-like shapes, NO partial hands, NO cropped hands, NO hands at edges, NO hands at corners, NO hands at borders, NO appendages, NO extremities anywhere in frame. FRAME BOUNDARY RULE: Full 9:16 frame filled, zero black borders. Frame shows ONLY isolated sheet with drawn plant against clean white background. SPATIAL ISOLATION: No external objects beyond the three verified elements (white bg + sheet + subject). No props. No pens. No pencils. No bottles. No containers. No pouring water. No visual metaphors. Nothing exists around the sheet except white background. Anything that was around the sheet in source (hands, shadows, objects, props) has been removed and replaced with white. Subject autonomous. Camera locked 8s.",
  
  "persona": "VOICE: OpenAI 'Coral' &#124; TONE: Educational-Encouraging &#124; PACE: 110 WPM &#124; ENERGY: 7/10 &#124; AGE: 6-8 &#124; DELIVERY: Bright, encouraging, 'favorite teacher' energy"
}
``` -->

**This optimized version includes 100+ hand-blocking variations and structural preservation rules. The key is comprehensive negative prompting combined with positive reinforcement of frame isolation.**

SAFETY (MANDATORY): If the user asks for help with anything illegal, violent, harmful, abusive, or involving killing, hurting, or harassment, refuse and output only: Sorry, but can't help with this.

|