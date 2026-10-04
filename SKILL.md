---
name: ui-craft-clarity
description: >-
  Use this skill whenever designing, building, reviewing, or refactoring UI components, web interfaces, dashboards, modals, or frontend styling (HTML, Tailwind CSS, React, Vue, Svelte, CSS). Enforces strict master theme alignment with the host app, theme consistency, contrast hierarchy, radical simplicity, subtle non-clashing background surfaces, elimination of unnecessary borders, removal of verbose text/descriptions, scannable micro-copy brevity, purposeful vector icons over emoji clutter, layout-driven visual affordance, spatial continuity (preventing disorienting layout shifts, keeping trigger buttons anchored, and preserving co-dependent reference data side-by-side), and responsive asynchronous API feedback (preventing frozen/dead states with wireframe skeleton loading and inline micro-loaders).
---

# UI Craft Clarity: Design Principles & Spatial Continuity

A comprehensive guide and behavioral protocol for creating modern, professional, high-clarity user interfaces. This skill guides the agent and developers to replace visual clutter, border soup, clashing backgrounds, emoji soup, walls of explanatory text, and frozen loading states with **strict host theme alignment, disciplined theme harmony, subtle tonal contrast, generous whitespace, scannable micro-copy, purposeful vector icons, self-explanatory visual layouts, smooth spatial continuity, and responsive asynchronous loading feedback**.

---

## The 11 Core Design Pillars

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           UI CRAFT CLARITY                              │
├─────────────────────────────────────────────────────────────────────────┤
│ 1. Host Theme Alignment → Inherit app tokens, CSS vars & brand DNA      │
│ 2. Theme Cohesion       → 60-30-10 palette, uniform tokens & radii      │
│ 3. Contrast & Focus     → Exactly ONE primary focal point per view      │
│ 4. Radical Simplicity   → Subtract decoration until function is naked   │
│ 5. Tonal Surfaces       → Subtle 2-5% shade steps, NO clashing boxes    │
│ 6. Border Reduction     → Whitespace & shadows over 1px wireframes      │
│ 7. Micro-copy Brevity   → Strip text walls, 2s scannability, no fluff   │
│ 8. Layout Affordance    → Explain state & relationships visually        │
│ 9. Spatial Continuity   → Anchor triggers & keep co-dependent data in view│
│ 10. Async API Feedback  → Skeletons & micro-loaders, never freeze UI   │
│ 11. Vector Icons & Context→ SVG/Lucide for UI tone; emoji context rules │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### Pillar 1: Master Theme Alignment (การยึดโยงและกลมกลืนกับ Theme หลักของ App/Web/Program)

#### The Problem
**"Frankenstein UI" / "Isolated Component Syndrome"**: Creating a component, modal, widget, or new sub-page in complete isolation as if it were a separate website. Common symptoms include:
- Introducing random one-off accent colors (e.g. an app uses an Emerald/Slate theme, but a newly added modal or button arbitrarily uses Purple or Cyan).
- Using mismatched corner radii (e.g. the app uses `rounded-2xl`, but a new card has sharp `rounded-none` or tiny `rounded-sm`).
- Hardcoding static light-mode hex colors (`#ffffff`, `#f3f4f6`) that break when the parent app is switched into Dark Mode or high-contrast mode.
- Copy-pasting styles from third-party component libraries without adapting them to the host application's typography, color tokens, and elevation system.

#### The Principle
- **Rule of Host Environment Discovery**:
  - *Before writing a single line of UI styling*, inspect the host project's global design tokens:
    1. Check `tailwind.config.js` or `tailwind.config.ts` for established color names (`primary`, `secondary`, `accent`, `muted`, `card`, `background`).
    2. Check global CSS (`globals.css`, `theme.css`, `:root { ... }`) for CSS variables (`--primary`, `--background`, `--radius`, `--ring`).
    3. Check existing shared UI components (e.g. buttons, cards, modals in `@/components/ui` or similar) to see how the project handles padding, radius, and elevation.
- **Always Bind to Semantic Theme Tokens**:
  - ❌ Avoid hardcoded arbitrary utilities: `bg-[#4f46e5] text-white border-[#e5e7eb]`
  - ✅ Prefer semantic theme tokens: `bg-primary text-primary-foreground border-border` or CSS variable mappings: `bg-[var(--primary)] text-[var(--primary-foreground)]`.
- **Inherit Host Application Personality & Visual Tone**:
  - **Enterprise / B2B SaaS**: Disciplined neutrals (Slate/Zinc), crisp micro-interactions, subtle shadows, high information density.
  - **Consumer / Playful**: Softer curves (`rounded-2xl` to `rounded-3xl`), warmer ambient tones, cheerful semantic accents.
  - **Developer Tools / Technical**: Monospace accents (`font-mono`), compact heights, deep dark-canvas tones (`slate-950`), vibrant status indicators.
  *Never impose a foreign visual personality onto an existing app.*
- **Overlay & Modal Harmony**:
  - Modals, slide-over drawers, dropdown menus, toast notifications, and tooltips must feel like organic parts of the application.
  - They must use the exact same backdrop blur intensity, surface background variables (`bg-card` / `bg-popover`), border-radius scale, and typography hierarchy as the rest of the application.

#### Rationale
An application is a cohesive ecosystem. When a dialog or widget introduces foreign colors, fonts, or shapes, it triggers visual dissonance, erodes user trust, feels like spam or an ad, and breaks the user's immersion. Perfect host alignment makes features feel native, robust, and professionally engineered.

---

### Pillar 2: Theme Consistency & Cohesion (คุม Theme ให้เป็นหนึ่งเดียว)

#### The Problem
Interfaces that mix multiple competing colors, conflicting font weights, chaotic icon styles (mixing filled icons with outlined thin icons), or mismatched padding scales.

#### The Principle
- **60-30-10 Color Rule**:
  - **60% Dominant Base**: Neutral page canvas (`bg-background` / `bg-slate-50` / `bg-slate-950`).
  - **30% Structural Surface**: Cards, panels, sidebars (`bg-card` / `bg-white` / `bg-slate-900`).
  - **10% Intentional Accent**: A single brand/accent color (e.g. `bg-primary`) reserved exclusively for primary actions and active states.
- **Consistent Tokens**:
  - Pick **one** border-radius scale across the entire app (e.g. default to `rounded-xl` for cards, `rounded-lg` for buttons and inputs).
  - Use an 8-point spatial grid (`gap-2`, `gap-4`, `p-4`, `p-6`).
  - Consistent font families and weights (`font-medium` for labels, `font-semibold` for headers).

#### Rationale
Theme consistency builds visual rhythm. Predictable aesthetics allow the user's brain to process the interface effortlessly without being distracted by conflicting stylistic choices.

---

### Pillar 3: Contrast Hierarchy & Single Focal Point (Contrast & Focus)

#### The Problem
"When everything shouts, nothing is heard." UIs where every button has a vibrant primary color, every number is bold and colored, and badges are scattered everywhere cause cognitive overload. Users don't know where to look first.

#### The Principle
- **Strict 3-Tier Contrast Rule**:
  1. **Tier 1 (High Contrast - Focal Point)**: Exactly ONE primary element per card or viewport (e.g. the main CTA button or the critical KPI number). Uses solid accent color or maximum contrast.
  2. **Tier 2 (Medium Contrast - Structural)**: Secondary actions, titles, card headings (`text-slate-900` / `text-slate-100`, ghost buttons, neutral surfaces).
  3. **Tier 3 (Low Contrast - Supporting)**: Timestamps, units, captions, secondary metadata (`text-slate-500` / `text-slate-400`).
- **Never Use Pure Extremes**:
  - Avoid `#000000` text on `#ffffff` backgrounds (causes harsh glare / halation). Use `text-slate-900` (`#0f172a`).
  - In dark mode, avoid pure black background `#000000` with pure white cards. Use deep neutral navy/zinc tones (`slate-950` canvas with `slate-900` cards).

#### Rationale
Contrast directs visual flow. By rationing high contrast, you guide the user's eye naturally to the primary action in milliseconds.

---

### Pillar 4: Radical Simplicity & Subtraction (Simple & Minimal)

#### The Problem
Adding decorative lines, gradient overlays, icons next to every single word, colored badges for trivial statuses, and patterned backgrounds.

#### The Principle
- **Design by Subtraction**:
  - Before finalizing any UI element, ask: *"If I remove this element, does the user lose critical context or functionality?"* If no, remove it.
  - Remove unnecessary dividing lines (`<hr>`, `border-b`) between list items when padding and row alignment already group them cleanly.
  - Stop placing decorative icons inside every button or header unless they actively aid recognition.

#### Rationale
Antoine de Saint-Exupéry: *"Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away."* Less visual clutter translates directly to faster task completion and fewer user errors.

---

### Pillar 5: Tonal Surfaces Over Clashing Backgrounds (ลด Background ที่ตัดกัน)

#### The Problem
"Checkerboard UI" where adjacent cards or sections switch abruptly between jarring dark, bright, or intensely saturated backgrounds (e.g. a bright purple box inside a yellow card, or pure white containers placed over pitch-dark panels).

#### The Principle
- **Subtle Lightness Delta (2% – 5%)**:
  - Distinguish surfaces with gentle shade steps rather than contrasting colors:
    - **Light Mode**: Canvas `bg-slate-100` $\rightarrow$ Card `bg-white` $\rightarrow$ Hover `bg-slate-50`.
    - **Dark Mode**: Canvas `bg-slate-950` $\rightarrow$ Card `bg-slate-900` $\rightarrow$ Hover `bg-slate-800`.
- **Reserve Saturated Backgrounds for Micro-Highlights Only**:
  - Saturated backgrounds (like `bg-blue-600` or `bg-amber-500`) should only be used for small elements: primary buttons, small badge dots, or active tabs.
  - Never fill an entire content card with a heavy saturated color.

#### Rationale
Abrupt background transitions create harsh artificial boundaries that fracture the visual plane, induce eye fatigue, and fight for the user's attention. Smooth tonal stepping creates depth without noise.

---

### Pillar 6: Eliminating Borders & "Containeritis" (ลด Border / เลิกขังกล่องซ้อนกล่อง)

#### The Problem
"Containeritis" is wrapping every element in a 1px bordered box: an outlined page container, inside an outlined section, inside an outlined card, inside an outlined table, inside outlined table cells. The result looks like an Excel wireframe.

#### The Principle
- **Whitespace First, Shadow Second, Border Last**:
  1. **Whitespace (Proximity)**: Use Gestalt grouping—place related items close together (`gap-2`) and separate sections with generous whitespace (`py-6` to `py-10`).
  2. **Subtle Elevation**: Use modern soft shadows (`shadow-sm` or `shadow-[0_2px_8px_rgba(0,0,0,0.04)]`) on an elevated surface instead of a hard border.
  3. **Subtle 1-Sided Border (Only when necessary)**: If a border is required, use ultra-subtle tones (`border-slate-100` in light mode, `border-slate-800/60` in dark mode). Never use dark 100% opaque borders.
- **Rule of No Nested Borders**:
  - If the parent container has an outline or distinct surface, child rows or cards must NOT have their own outlines. Use divider-less rows with hover highlights (`hover:bg-slate-50`).

#### Rationale
Every border adds two hard parallel lines into the user's field of view. Eliminating unnecessary borders removes visual prison bars, making the interface feel modern, open, and lightweight.

---

### Pillar 7: Micro-copy Brevity & Zero Text Bloat (ลดข้อความฟุ่มเฟือย สั้นกระชับ อ่านจบในเสี้ยววินาที)

#### The Problem
**"Text Walls & Conversational Bloat" (เขียน UI เหมือนคู่มือการใช้งาน หรือใส่ข้อความเยิ่นเย้อจนรกสายตา)**:
- **Manual Syndrome**: Treating the UI like a printed user manual, blog post, or legal contract. Adding long explanatory paragraphs under every header or section.
- **Polite & Conversational Fluff**: Padding labels with conversational crutches (*"กรุณากรอก...", "โปรดเลือก...", "ท่านสามารถกดปุ่มนี้เพื่อ...", "ในส่วนนี้คือการตั้งค่า...", "Please click here to...", "Use this section to manage..."*).
- **Redundant Helper Echoes**: Repeating the label in the helper text or placeholder (e.g. Input label is `Email Address`, helper text says: *"Please enter your email address here"*).
- **Apologetic & Wordy Errors**: Long essays explaining an error instead of telling the user what happened and the immediate one-click fix.

#### The Principle
- **Rule 1: The 2-Second Scannability Threshold (กฎการกวาดสายตา 2 วินาที — สแกนแล้วเข้าใจทันที)**:
  - Users do NOT read web/app interfaces; they scan them in F-patterns, Z-patterns, or layer-cake scanning (Nielsen Norman Group).
  - Every button, card, header, and badge must communicate its core message in **under 2 seconds**. If a user has to read a full sentence to understand what a button does or what a card represents, the design needs to be simplified.
- **Rule 2: Eliminate Polite Filler & Conversational Crutches (ตัดคำสุภาพฟุ่มเฟือยทิ้ง 100%)**:
  - A user interface is a high-efficiency functional instrument, not a customer service email.
  - ❌ **Banned Filler**: "กรุณา", "โปรด", "ท่านสามารถ...", "ในหน้านี้จะช่วยให้ท่าน...", "ระบบจะทำการ...", "Please", "Kindly", "You can now", "Click here to".
  - ✅ **Direct Micro-copy**: Replace with direct imperative verbs or concise nouns (`บันทึก`, `ส่งออก`, `เชื่อมต่อ`, `ลบ`).
- **Rule 3: Front-Load Action Verbs & Direct Nouns (ขึ้นต้นด้วยกริยาหรือคำนามทันที)**:
  - Put the critical keyword as the very first word.
  - Buttons:
    - ❌ *"คลิกเพื่อดาวน์โหลดรายงานประจำเดือน"* $\rightarrow$ ✅ *"ดาวน์โหลดรายงาน"* (`Download report`)
    - ❌ *"กดที่นี่เพื่อทำการบันทึกข้อมูลการเปลี่ยนแปลง"* $\rightarrow$ ✅ *"บันทึก"* (`Save`)
    - ❌ *"ทำการลบบัญชีผู้ใช้นี้ออกจากระบบอย่างถาวร"* $\rightarrow$ ✅ *"ลบบัญชี"* (`Delete account`)
  - Section Headers:
    - ❌ *"ส่วนการจัดการรหัสผ่านและความปลอดภัยของบัญชีผู้ใช้"* $\rightarrow$ ✅ *"ความปลอดภัย"* (`Security`)
- **Rule 4: Progressive Disclosure for In-Depth Explanations (ข้อมูลเสริมให้ซ่อนไว้ ไม่เอามากางเกะกะหน้าแรก)**:
  - Never dump niche edge-case explanations, calculation formulas, or secondary policies onto the main viewport.
  - **Tooltips & Popovers**: Use a subtle info icon (`<HelpCircle class="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />`) that reveals details on hover or click.
  - **Collapsible Drawers / `<details>`**: Keep advanced parameters or lengthy explanations collapsed by default.
  - **Inline Help Links**: Use a quiet link (`Learn more ↗`) pointing to documentation rather than pasting documentation onto the card.
- **Rule 5: Actionable, Blame-Free Error & Status States (แจ้งสถานะสั้น ตรงจุด บอกทางแก้ทันที)**:
  - State the reality and the exact next action. Never lecture the user or write apologetic essays.
  - ❌ *"เกิดข้อผิดพลาดขึ้นในระบบเซิร์ฟเวอร์ กรุณาตรวจสอบให้แน่ใจว่าอุปกรณ์ของท่านเชื่อมต่ออินเทอร์เน็ตแล้วลองกดใหม่อีกครั้ง"*
  - ✅ `เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ • ตรวจสอบอินเทอร์เน็ตแล้วลองใหม่` (พร้อมปุ่ม `[ลองใหม่]`)
  - ❌ *"คุณกรอกรหัสผ่านไม่ถูกต้องเนื่องจากต้องมีตัวอักษรอย่างน้อย 8 ตัวและมีสัญลักษณ์พิเศษ"*
  - ✅ `รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษรและ 1 สัญลักษณ์`

#### Micro-copy Transformation Matrix (ตารางแปลงข้อความเยิ่นเย้อเป็น Micro-copy สั้นกระชับ)

| บริบท (Context) | ❌ ข้อความเยิ่นเย้อ / ฟุ่มเฟือย (Verbose / Fluff) | ✅ Micro-copy สั้น กระชับ ทรงพลัง (Punchy & Scannable) |
| :--- | :--- | :--- |
| **Header** | ส่วนการจัดการและตั้งค่าโปรไฟล์ส่วนตัวของคุณ | โปรไฟล์ (`Profile`) |
| **Subheader** | ในหน้านี้คุณสามารถแก้ไขชื่อ อีเมล และรหัสผ่านของคุณได้ | จัดการข้อมูลบัญชีและความปลอดภัย |
| **Input Helper** | กรุณากรอกอีเมลของท่านที่ใช้ในการลงทะเบียน | อีเมลที่ทำงาน (`Work email`) |
| **Action Button** | คลิกที่นี่เพื่อทำการยืนยันการสั่งซื้อสินค้า | สั่งซื้อ • ฿1,290 (`Place order • $39`) |
| **Action Button** | กดเพื่อส่งออกข้อมูลออกเป็นไฟล์ Excel | ส่งออก Excel (`Export Excel`) |
| **Status Badge** | ระบบกำลังดำเนินการประมวลผลข้อมูลของท่านอยู่ในขณะนี้ | กำลังประมวลผล... (`Processing...`) |
| **Empty State** | ขณะนี้คุณยังไม่มีรายการเอกสารใดๆ ในระบบ หากต้องการสร้างเอกสารกรุณากดปุ่มด้านล่าง | ยังไม่มีเอกสาร (`No documents yet`) |
| **Delete Warning** | การกระทำนี้ไม่สามารถย้อนกลับได้ คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้ออกจากฐานข้อมูล | ลบรายการนี้ถาวร? การกระทำนี้ย้อนกลับไม่ได้ |
| **Offline Toast** | ขณะนี้อุปกรณ์ของท่านขาดการเชื่อมต่อกับอินเทอร์เน็ต | ออฟไลน์ • กำลังลองเชื่อมต่อใหม่... |

#### Rationale
Every extra word is visual friction. Users scan software to accomplish tasks, not to read essays. Trimming text bloat down to crisp micro-copy clarifies hierarchy, respects user time, and creates interfaces that feel swift, professional, and razor-sharp.

---

### Pillar 8: Show, Don't Tell — Layout & Affordance Over Words (ใช้ลักษณะหรือ Layout ในการอธิบาย แทน Text)

#### The Problem
Explaining statuses, relationships, and workflows with verbose text sentences instead of visual affordances and spatial structure.

#### The Principle
- **Visual Status Over Text Descriptions**:
  - ❌ *"The backup process completed successfully at 10:30 AM without any errors."*
  - ✅ `🟢 Backed up 10:30 AM` (pills, status dots, relative time).
- **Progress Indicators Over Explanations**:
  - ❌ *"You are currently on step 2 of our 4-step deployment configuration wizard."*
  - ✅ Visual 4-step stepper bar with active dot on Step 2.
- **Metric Cards Over Summary Paragraphs**:
  - ❌ *"In the last 30 days, your store generated a total of $48,200 in revenue, which represents an increase of 14.2% compared to the previous period."*
  - ✅ Stat Card:
    ```
    Revenue (30d)
    $48,200   ▲ +14.2%
    ```
- **Spatial Alignment for Logical Grouping**:
  - Place primary actions in the predictable right corner (`justify-between items-center`).
  - Group label and value as compact pairs, letting column layout and typographic weight communicate the relationship.

#### Rationale
The human visual system processes spatial arrangements, colors, and shapes **pre-attentively** in under 100 milliseconds, whereas reading sentences requires sequential phonological decoding and working memory. Visual affordance is 10x faster to understand.

---

### Pillar 9: Spatial Continuity & Context Preservation (ความต่อเนื่องเชิงพื้นที่และการรักษา Context)

#### The Problem
**Disorienting Layout Jumps & Context Obliteration (กดเปิดอะไรบางอย่างแล้วหน้ากระตุก ปุ่มเลื่อนหนี หรือข้อมูลอ้างอิงหาย)**:
- **Button Runaway / Shifting Controls**: User clicks button `A` to open panel `B`, but opening the panel violently pushes button `A` 400px down or completely off-screen, so the user cannot easily close or toggle it back.
- **Context Obliteration**: Opening panel `B` completely replaces or hides data `A`. When the user needs to cross-reference or inspect details in `B` alongside `A`, they are forced to memorize information or flip back and forth frantically.
- **Cumulative Layout Shift (CLS)**: Dynamic elements reflowing surrounding content unpredictably, causing visual disorientation and misclicks.

#### The Principle
- **Rule 1: Anchor the Trigger (ปุ่มเปิดต้องอยู่นิ่ง มั่นคง และเป็น Toggle เสมอ)**:
  - The control (button, row, tab) that triggers panel `B` must maintain its spatial coordinates or remain clearly visible as an active anchor (`aria-expanded="true"`, subtle highlight `bg-muted` or `ring-1 ring-primary`).
  - Reversible actions must be effortless: clicking the same anchor or a dedicated sticky close button returns state without layout jarring.
- **Rule 2: Side-by-Side Context Preservation (Split-View / Master-Detail)**:
  - When information in panel `B` depends on or needs to be viewed alongside panel `A`, keep both visible:
    * **Desktop & Tablet**: Use a dual-pane layout, slide-over drawer, or side sheet (`Sheet / Drawer`) where list/table `A` remains visible on the left and detail panel `B` opens on the right.
    * Highlight the currently inspected item in `A` so the user always knows what `B` refers to.
- **Rule 3: In-Place Non-Destructive Expansion**:
  - For lists and tables, prefer inline accordions or sub-row expansions that push content smoothly downward without displacing headers, search bars, or the active row.
- **Rule 4: Avoid Full-Screen Takeovers for Inspection Tasks**:
  - Reserve full-screen modals only for high-stakes, multi-step isolated tasks (e.g. complex creation wizards). For viewing details, editing settings, or inspecting logs, never hide the host screen completely.

#### Rationale
- **Visual Working Memory**: Human working memory can hold only 3–4 visual chunks simultaneously. Hiding original context forces users into high-friction mental caching.
- **Saccadic Re-acquisition**: Violent layout shifts force the brain's visual cortex to restart spatial scanning from zero, creating cognitive fatigue and irritation.
- **Motor Predictability (Fitts's Law)**: Keeping the trigger anchor in place enables muscle memory and lightning-fast reversible navigation.

---

### Pillar 10: Responsive Asynchronous Feedback & Loading Craft (การตอบสนองเมื่อยิง API ไม่ปล่อยให้ UI ค้างหรือหยุดนิ่ง)

#### The Problem
**"Dead UI" & Frozen Interaction (อาการกดปุ่มหรือดึงข้อมูลแล้วหน้าจอนิ่งสนิทเหมือนโปรแกรมค้าง)**:
- **Zero Acknowledgment**: User clicks a button or navigates to a tab, but for 1–3 seconds while the API call is in-flight, absolutely nothing happens. The cursor doesn't change, the button doesn't react, and the page sits completely still.
- **Rage Clicks & Duplicate Mutations**: Because there is no feedback, users assume their click failed and click repeatedly, triggering duplicate database records, double charges, or race conditions.
- **Overly Aggressive Full-Screen Spinners**: Slapping an opaque full-screen spinner overlay across the entire window for a 200ms background fetch, jarring the user and blocking all interaction.
- **Layout Whiplash (Cumulative Layout Shift - CLS)**: When the API response finally arrives, data abruptly slaps onto the screen without reserved space, shoving surrounding content downward or sideways.

#### The Principle
- **Rule 1: Instant Interaction Acknowledgment (<100ms - Doherty Threshold)**:
  - The moment an async action is triggered, the UI *must* provide immediate sensory feedback. Never leave the user wondering if their action registered.
- **Rule 2: Wireframe Skeleton Loading for Content Containers (ลดอาการกระตุกด้วยโครงสร้างล่วงหน้า)**:
  - **When to use**: Initial page load, metric cards, data tables, list feeds, profile details.
  - **Craft Rule**: Skeletons must **strictly match** the exact geometry, aspect ratio, and corner radius of the real incoming elements (`rounded-[var(--radius)] bg-muted/60 animate-pulse`).
  - **Benefit**: Reserves layout footprint in advance (Zero Layout Shift), giving the brain an instant mental blueprint of incoming content.
- **Rule 3: Inline Micro-Loaders for Interactive Controls (ปุ่มและสวิตช์ต้องล็อกขนาดและไม่ให้กดซ้ำ)**:
  - **When to use**: Form submit buttons, action triggers, toggle switches, inline edits.
  - **Craft Rule**:
    1. Lock the button's explicit dimensions (`min-w-[...]` or preserve width/height) so the button doesn't shrink or shift when the text label transitions into a spinner.
    2. Disable the button (`disabled cursor-not-allowed opacity-80`) to guarantee idempotency and prevent duplicate API calls.
    3. Display a subtle inline SVG spinner matching the button's foreground color.
- **Rule 4: Ambient Non-Blocking Progress for Background Sync**:
  - **When to use**: Polling, background revalidations, autosaves, sorting/filtering large cached lists.
  - **Craft Rule**: Use a micro progress bar along the very top edge of the card or viewport (`h-0.5 bg-primary animate-pulse`) or a quiet syncing indicator (`Syncing... ↻`), allowing the user to continue reading or interacting without interruption.
- **Rule 5: Timeout & Actionable Error States**:
  - Never allow a loader to spin indefinitely. If an API call exceeds reasonable limits (e.g. 8–10s) or fails with an error, gracefully swap the loader for an inline retry trigger (`Retry sync`).
- **Rule 6: Media, Images & External Embeds (YouTube, Links & Previews)**:
  - **Always Lock Aspect Ratios**: Every image, video player, and YouTube embed wrapper *must* declare an explicit aspect ratio (`aspect-video` for 16:9, `aspect-square`, `aspect-[4/3]`) or fixed dimensions. Never render an unsized `<img>` or `<iframe>`, as this is the primary cause of Cumulative Layout Shift (CLS).
  - **Contextual Media Skeletons**: While images or YouTube metadata load, show a skeleton wrapper matching the exact aspect ratio with a subtle media silhouette (e.g. a centered play-triangle icon silhouette for YouTube videos).
  - **Facade Pattern for Heavy Embeds (Lite YouTube)**: Instead of immediately mounting a heavy 500KB+ YouTube `<iframe>` on page load (which blocks mobile main threads), display a lightweight thumbnail facade with a styled play button overlay. Mount the actual interactive iframe only when the user clicks play.
  - **Rich Link Unfurling Skeletons**: When fetching OpenGraph metadata for an external URL (YouTube link, article, or social post), render an inline skeleton preview card that pre-allocates the thumbnail slot (`w-24 h-24 rounded-lg bg-muted`) and title lines. The card fills in smoothly without pushing chat messages or article paragraphs.
  - **Graceful Media Fallbacks**: If an image or YouTube link is broken, restricted, or 404s, replace it with a clean, low-contrast fallback card with a domain badge and retry/link-out button—never leave a blank hole or native browser broken-image icon.

#### Rationale
- **Doherty Threshold**: When human-computer interaction takes place at a pace (<400ms) where neither computer nor user has to wait, productivity soars.
- **Perceived Latency**: Cognitive research proves that skeleton screens make pages feel 25–40% faster than a blank screen or a centered spinning wheel, because skeletons communicate structural progress.
- **Interaction Confidence**: Immediate tactile feedback eliminates the anxiety of uncertainty, stopping accidental duplicate submissions.
- **Zero Cumulative Layout Shift (CLS)**: Pre-sizing media containers preserves spatial stability so users don't accidentally click the wrong element while images and embeds are still streaming in.

---

### Pillar 11: Vector Icon Craft Over Emoji Clutter (ลด Emoji ใช้ SVG/Vector Icon แทนตามสถานการณ์)

#### The Problem
**"Emoji Soup" Syndrome (การใช้ Emoji เกลื่อนกลาดจนทำลาย Theme, ความน่าเชื่อถือ และความสม่ำเสมอของ UI)**:
- **Scattering Emojis Everywhere**: Slapping random emojis into system navigation menus, action buttons, table headers, and status cards (e.g. `🔔 แจ้งเตือน`, `⚙️ ตั้งค่า`, `🚀 เริ่มระบบ`, `⚠️ คำเตือน`, `🗑️ ลบ`, `🟢 ออนไลน์`, `📊 รายงาน`, `💡 ข้อแนะนำ`).
- **Why Emojis Break Professional UI**:
  1. **Theme & Palette Clashing**: Emojis contain hardcoded, non-customizable multi-color bitmaps (bright yellow faces, blue gears, red sirens, orange flames). They clash violently with Dark Mode, subtle monochrome Slate/Zinc canvases, and branded design tokens. You cannot tint an emoji with `currentColor` or `text-muted-foreground`.
  2. **Cross-Platform Fragmentation**: Emojis are OS font glyphs that render completely differently across platforms:
     - **macOS / iOS**: Glossy, realistic 3D Apple styling.
     - **Windows 11**: Flat / Fluent pastel vector graphics.
     - **Android**: Google cartoon style.
     - **Linux / Legacy OS**: Often missing glyphs, rendering as empty boxes or question marks (``).
     *Your UI looks wildly inconsistent depending on the user's machine.*
  3. **Amateurish & Toy-Like Visual Tone**: High emoji density makes professional SaaS, developer tooling, financial dashboards, and enterprise platforms look like a casual toy, a crypto pump channel, or a children's game, instantly eroding user trust and perceived system stability.
  4. **Optical Misalignment & Line-Height Havoc**: Emojis have uneven glyph bounding boxes and unpredictable baseline metrics across operating systems, causing button text, badges, and table rows to jitter or misalign vertically.

#### The Principle
- **Rule 1: Standardize on Vector / SVG Icons (Lucide, Heroicons, Phosphor) as the Default**:
  - **Dynamic Theme Binding (`currentColor`)**: SVGs inherit font colors automatically. They seamlessly adapt to Light Mode (`text-slate-700`), Dark Mode (`text-slate-300`), muted captions (`text-muted-foreground`), and destructive triggers (`text-destructive`).
  - **Consistent Optical Geometry & Stroke Scale**:
    - Use a uniform stroke width throughout the app (typically `stroke-[1.5]` or `stroke-[2]`).
    - Standardize on an 8-point sizing scale:
      - `h-3.5 w-3.5` (14px): Compact inline badges, table sub-indicators, micro chips.
      - `h-4 w-4` (16px): Form inputs, standard buttons, dropdown menu items.
      - `h-5 w-5` (20px): Sidebar navigation, card action headers, modal headers.
      - `h-6 w-6` (24px): Empty state illustrations, feature overview cards.
  - **Semantic CSS Status Indicators Over Emoji Dots**:
    - ❌ `🟢 ออนไลน์` / `🔴 ออฟไลน์` / `🟡 กำลังตรวจสอบ`
    - ✅ Accessible, theme-reactive CSS dots:
      ```html
      <span class="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
        <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
        Online
      </span>
      ```
- **Rule 2: Situational Usage Matrix (การเลือกใช้ตามสถานการณ์: เมื่อไหร่ต้อง SVG vs เมื่อไหร่ Emoji ยอมรับได้)**:

| บริบทการใช้งาน (Context) | ตัวเลือกที่ถูกต้อง | เหตุผล & แนวทางปฏิบัติ (Guidelines) |
| :--- | :--- | :--- |
| **System Navigation & Menus** (แดชบอร์ด, เมนูบาร์, ลิงก์) | 🔴 **SVG Icon เท่านั้น** | ความเป็นระเบียบ เป็นทางการ คุมโทนสีเดียวกับข้อความ |
| **Action Buttons** (บันทึก, ลบ, แก้ไข, ดาวน์โหลด) | 🔴 **SVG Icon เท่านั้น** | สีไอคอนต้องเปลี่ยนตามสถานะปุ่ม (Hover, Disabled, Focus) |
| **Form Inputs & Adornments** (ค้นหา, ตาเปิด/ปิดรหัสผ่าน) | 🔴 **SVG Icon เท่านั้น** | ต้องจัดกึ่งกลาง (Center) สมบูรณ์แบบ ไม่ดิ้นตาม OS font |
| **Table Headers & Sorting** (ลูกศรจัดเรียง, ฟิลเตอร์) | 🔴 **SVG Icon เท่านั้น** | ต้องการความกะทัดรัดและแม่นยำเชิงพิกเซล |
| **Alerts, Banners & Modals** (ข้อความแจ้งเตือน, ยืนยัน) | 🔴 **SVG Icon เท่านั้น** | ใช้สี Semantic (แดง destructive, เหลือง amber, เขียว emerald) |
| **Status Badges & Pills** (สถานะการทำงาน, แท็กระบบ) | 🔴 **SVG Icon / CSS Dot** | จุดกลมขนาด 6px (`h-1.5 w-1.5`) กลมกลืนกับข้อความ |
| **User-Generated Content (UGC)** (คอมเมนต์, แชต, ฟีดผู้ใช้) | 🟢 **Emoji ยอมรับได้** | เนื้อหาที่ผู้ใช้พิมพ์เองตามธรรมชาติ ไม่ควรถูกบล็อก |
| **Interactive Reaction Picker** (ปุ่มกดไลก์/รีแอ็กชันแบบ Slack/Discord) | 🟢 **Emoji ยอมรับได้** | แสดงอารมณ์ความรู้สึกของผู้ใช้งาน เช่น `👍`, `❤️`, `🎉`, `🔥` |
| **Custom Avatar / Workspace Icon** (เลือกไอคอนโฟลเดอร์แบบ Notion) | 🟢 **Emoji ยอมรับได้** | ทางเลือกให้ผู้ใช้ปรับแต่งความเป็นส่วนตัวในพื้นที่ของตนเอง |
| **Gamified / Playful Consumer Apps** (เกมเลี้ยงสัตว์, แอปสำหรับเด็ก) | 🟢 **Emoji ยอมรับได้** | อารมณ์สนุกสนาน ความเป็นกันเองเป็นแกนหลักของแบรนด์ |

- **Rule 3: Accessibility & Icon Restraint (วินัยในการใช้ไอคอนและการเข้าถึง)**:
  - **Do NOT put an icon on everything**: An icon is only useful if it speeds up optical scanning (e.g. Search, Close, Trash, Download). If every single item has an icon, visual fatigue increases.
  - **Accessible Markings**: Always apply `aria-hidden="true"` to decorative icons.
  - **Icon-Only Buttons**: If a button contains only an icon (e.g. a close button `✕`), you **must** provide `aria-label="Close"` or `<span class="sr-only">Close</span>`.

#### Rationale
Vector icons belong to the interface's design system—they scale, adapt to color tokens, respect dark mode, and align with mathematical precision across every device on earth. Emojis belong to user conversation and cultural expression. Keeping system chrome clean with vector icons elevates product quality from a prototype to enterprise-grade software.

---

## Concrete Before & After Code Examples

### Example 1: Spatial Continuity — Panel Inspection on Same Page

*Scenario: User clicks an item or button in a table/list to inspect details (Panel B) while needing to see the item list (Context A).*

#### ❌ BAD (Violent Layout Shift: Trigger Displaced, Context Obliterated)
```html
<!-- BAD: Clicking 'Inspect' hides the entire list or violently pushes the button 500px down, obliterating context -->
<div>
  <!-- Once clicked, the entire list is unmounted/hidden, or pushed completely off-screen -->
  <div class="p-6">
    <div class="border-b pb-4 mb-4">
      <h2 class="text-xl font-bold">Transaction #TRX-9482 Details</h2>
      <!-- Close button is now in a totally different random position -->
      <button class="bg-red-500 text-white px-4 py-2 mt-2">Back to List</button>
    </div>
    <div class="space-y-4">
      <p>Amount: $1,250.00</p>
      <p>Customer: John Doe</p>
      <p>Status: Completed</p>
      <!-- User has no idea what other transactions were around this one, cannot compare rates or dates -->
    </div>
  </div>
</div>
```
*Why it fails*:
- **Lost Spatial Context**: The original list disappeared; user cannot cross-reference neighboring transactions.
- **Displaced Controls**: The trigger button shifted to another location or turned into a "Back" link in a different coordinate.
- **High Mental Load**: User must memorize numbers before navigating back and forth.

---

#### ✅ GOOD (Master-Detail Side Panel: Persistent Trigger Anchor & Co-Dependent View)
```html
<!-- GOOD: Dual-pane layout. List A stays firmly in place with active row highlighted; Panel B slides in alongside -->
<div class="flex h-[520px] w-full max-w-5xl rounded-2xl bg-card border border-border overflow-hidden shadow-sm">
  <!-- Left Pane (Context A): Always visible, active item anchored -->
  <div class="w-1/2 border-r border-border overflow-y-auto p-4 space-y-2">
    <div class="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-3">
      Recent Transactions
    </div>

    <!-- Active Item: Clearly anchored and highlighted -->
    <div class="flex items-center justify-between p-3 rounded-xl bg-accent text-accent-foreground ring-1 ring-border transition-colors">
      <div class="space-y-0.5">
        <div class="text-sm font-semibold text-foreground">Transaction #TRX-9482</div>
        <div class="text-xs text-muted-foreground">Today, 14:32 • Stripe</div>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-sm font-bold text-foreground">$1,250.00</span>
        <!-- Active indicator keeps visual continuity -->
        <span class="h-2 w-2 rounded-full bg-primary"></span>
      </div>
    </div>

    <!-- Other items remain visible for effortless cross-referencing -->
    <div class="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors">
      <div class="space-y-0.5">
        <div class="text-sm font-medium text-foreground">Transaction #TRX-9481</div>
        <div class="text-xs text-muted-foreground">Today, 11:15 • PayPal</div>
      </div>
      <span class="text-sm font-medium text-muted-foreground">$340.00</span>
    </div>

    <div class="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors">
      <div class="space-y-0.5">
        <div class="text-sm font-medium text-foreground">Transaction #TRX-9480</div>
        <div class="text-xs text-muted-foreground">Yesterday, 18:40 • Bank Transfer</div>
      </div>
      <span class="text-sm font-medium text-muted-foreground">$4,890.00</span>
    </div>
  </div>

  <!-- Right Pane (Panel B): Opens smoothly side-by-side, predictable sticky header with close toggle -->
  <div class="w-1/2 flex flex-col bg-background/50 p-5 overflow-y-auto">
    <!-- Header: Sticky & anchored close button in predictable upper-right corner -->
    <div class="flex items-center justify-between pb-4 border-b border-border">
      <div>
        <h3 class="text-sm font-semibold text-foreground">Transaction Details</h3>
        <span class="text-xs text-muted-foreground">#TRX-9482</span>
      </div>
      <button class="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted transition-colors" aria-label="Close panel">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Side-by-side Inspection Data: Clean layout affordance, no text walls -->
    <div class="mt-4 space-y-4">
      <div class="flex items-center justify-between text-xs">
        <span class="text-muted-foreground">Status</span>
        <span class="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 font-medium text-emerald-600 dark:text-emerald-400">
          <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          Settled
        </span>
      </div>

      <div class="flex items-center justify-between text-xs">
        <span class="text-muted-foreground">Gross Amount</span>
        <span class="font-semibold text-foreground">$1,250.00</span>
      </div>

      <div class="flex items-center justify-between text-xs">
        <span class="text-muted-foreground">Processing Fee</span>
        <span class="text-muted-foreground">$36.25</span>
      </div>

      <div class="pt-2 border-t border-border flex items-center justify-between text-xs font-semibold">
        <span class="text-foreground">Net Payout</span>
        <span class="text-base font-bold text-foreground">$1,213.75</span>
      </div>
    </div>

    <!-- Action pinned cleanly at bottom without jumping -->
    <div class="mt-auto pt-6 flex justify-end gap-2">
      <button class="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
        Receipt
      </button>
      <button class="px-3.5 py-1.5 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-sm transition-colors">
        Issue Refund
      </button>
    </div>
  </div>
</div>
```
*Why it succeeds*:
- **Zero Layout Shift**: The left list does not move, resize, or jump.
- **Anchor Retention**: The active row is clearly marked (`ring-1 ring-border bg-accent`), keeping the user oriented.
- **Side-by-Side Co-dependence**: The user can compare the open transaction with others in the list instantly without touching anything.

---

### Example 2: Modal / Dialog Host Theme Integration

*Scenario: The host app is built with an Emerald & Slate theme using CSS variables (`--primary`, `--radius`, `--card`, `--muted`).*

#### ❌ BAD (Frankenstein Component: Foreign Colors, Sharp Corners, Breaks Dark Mode)
```html
<!-- BAD: Hardcoded foreign purple color, sharp corners, static pure white/black, ignores app tokens -->
<div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4">
  <div class="bg-white border-2 border-purple-500 rounded-none w-full max-w-lg p-6 shadow-2xl">
    <div class="border-b border-gray-300 pb-3 mb-4">
      <h2 class="text-xl font-bold text-black">Confirmation Dialog Window</h2>
      <p class="text-sm text-gray-500 mt-1">
        Please read this confirmation notice carefully before you proceed with deleting this record from the database.
      </p>
    </div>
    <div class="bg-purple-50 p-4 border border-purple-200 mb-6">
      <p class="text-xs text-purple-900">
        Deleting this item cannot be undone. Are you sure you wish to continue with this permanent deletion action?
      </p>
    </div>
    <div class="flex justify-end gap-3">
      <button class="bg-gray-200 text-gray-800 font-bold px-4 py-2 hover:bg-gray-300">
        Cancel Operation
      </button>
      <button class="bg-purple-600 text-white font-bold px-5 py-2 hover:bg-purple-700">
        Confirm Deletion
      </button>
    </div>
  </div>
</div>
```

---

#### ✅ GOOD (Seamless Master Theme Alignment via App Tokens & Dynamic Variables)
```html
<!-- GOOD: Dynamic host theme tokens (bg-card, text-foreground, rounded-[var(--radius)]), dark/light compatible -->
<div class="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
  <div class="bg-card text-card-foreground rounded-[var(--radius,1rem)] w-full max-w-md p-6 shadow-lg border border-border">
    <!-- Header: Consistent typography scale, concise title -->
    <div class="flex items-center justify-between">
      <h2 class="text-base font-semibold text-foreground">Delete item</h2>
      <button class="text-muted-foreground hover:text-foreground p-1 rounded-lg transition-colors">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Body: Concise micro-copy, semantic subtle alert -->
    <p class="mt-3 text-sm text-muted-foreground">
      This action is permanent and cannot be reversed.
    </p>

    <!-- Actions: Inherits host theme destructive & ghost button tokens -->
    <div class="mt-6 flex items-center justify-end gap-2">
      <button class="px-3.5 py-2 text-xs font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-[calc(var(--radius,1rem)-4px)] transition-colors">
        Cancel
      </button>
      <button class="px-4 py-2 text-xs font-semibold bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-[calc(var(--radius,1rem)-4px)] shadow-sm transition-colors">
        Delete
      </button>
    </div>
  </div>
</div>
```

---

### Example 3: Dashboard KPI & Quick Action Card

#### ❌ BAD (Border-heavy, Clashing BG, Verbose Text Wall, No Clear Focus)
```html
<!-- BAD: Harsh border, clashing bright blue background, wall of text, nested borders -->
<div class="border-2 border-gray-400 bg-blue-100 p-6 rounded-none m-4">
  <div class="border border-gray-500 bg-white p-4 mb-3">
    <h3 class="text-xl font-bold text-black border-b border-black pb-2">Active Subscriptions Overview</h3>
    <p class="text-sm text-gray-700 mt-2">
      This card shows the total number of customers who are currently enrolled in our monthly paid subscription plan. 
      You can review this number to understand current customer retention and monthly recurring revenue performance.
    </p>
  </div>
  <div class="border border-blue-400 bg-blue-200 p-4 mb-4">
    <span class="text-base text-gray-800 font-bold">Total Active Paying Members: </span>
    <span class="text-2xl font-black text-red-600">1,420 users</span>
    <p class="text-xs text-gray-600 mt-1">This is an increase of twelve point five percent compared to the previous month's recorded calculation.</p>
  </div>
  <div class="flex gap-2">
    <button class="border-2 border-black bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4">
      Click Here To View Full Detailed Analytics Report
    </button>
    <button class="border-2 border-black bg-green-500 text-white font-bold py-2 px-4">
      Export Data As CSV File To Your Computer
    </button>
  </div>
</div>
```

---

#### ✅ GOOD (Cohesive Theme, Tonal Depth, Zero Harsh Borders, Layout-Driven Clarity)
```html
<!-- GOOD: Minimal surface, soft elevation, single high-contrast focal point, concise micro-copy -->
<div class="bg-card rounded-2xl p-6 shadow-sm border border-border/60 max-w-md">
  <!-- Header: Clean flex alignment, concise label + secondary badge -->
  <div class="flex items-center justify-between">
    <span class="text-sm font-medium text-muted-foreground">Active Subscriptions</span>
    <span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
      <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
      12.5%
    </span>
  </div>

  <!-- KPI Metric: Large numeral, pre-attentive instant recognition -->
  <div class="mt-4 flex items-baseline gap-2">
    <span class="text-3xl font-bold tracking-tight text-foreground">1,420</span>
    <span class="text-xs text-muted-foreground">vs. last month</span>
  </div>

  <!-- Visual Context: Micro progress bar instead of text explanation -->
  <div class="mt-4">
    <div class="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div class="h-full rounded-full bg-primary" style="width: 71%"></div>
    </div>
    <div class="mt-1.5 flex justify-between text-[11px] text-muted-foreground">
      <span>Target: 2,000</span>
      <span>71% achieved</span>
    </div>
  </div>

  <!-- Actions: One primary CTA, one ghost button -->
  <div class="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-border/60">
    <button class="text-xs font-semibold text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg transition-colors">
      Export CSV
    </button>
    <button class="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors">
      View Report
    </button>
  </div>
</div>
```

---

### Example 4: Settings & Preference Row

#### ❌ BAD (Overly Verbose, Heavy Outlines, Nested Boxes)
```html
<!-- BAD: Boxed-in row, redundant explanatory paragraph, cluttered icons -->
<div class="border-2 border-slate-800 p-4 rounded-lg bg-gray-50 mb-4">
  <div class="border border-slate-400 p-3 bg-white rounded">
    <h4 class="font-bold text-gray-900">🔔 Push Notification Alerts Configuration</h4>
    <p class="text-sm text-gray-600 mt-2">
      Toggle this option to choose whether or not our platform will send automated push notifications directly to your desktop browser whenever an important update, task completion, or security alert takes place in your workspace. We recommend leaving this enabled.
    </p>
    <div class="mt-3 border-t border-gray-300 pt-2 flex items-center justify-between">
      <span class="text-xs font-bold text-gray-700">Notification State: Currently Disabled</span>
      <button class="border border-blue-600 bg-blue-500 text-white font-bold py-1 px-3 rounded">
        Click to Turn Push Notifications On
      </button>
    </div>
  </div>
</div>
```

---

#### ✅ GOOD (Flat Layout, Proximity Grouping, Self-Explanatory Toggle Affordance)
```html
<!-- GOOD: Seamless row, zero heavy borders, layout affordance explains the state -->
<div class="flex items-center justify-between py-4 px-2 hover:bg-muted/40 rounded-xl transition-colors">
  <div class="space-y-0.5">
    <div class="text-sm font-medium text-foreground">Push notifications</div>
    <div class="text-xs text-muted-foreground">Receive alerts for completed tasks and security events</div>
  </div>
  
  <!-- Visual Toggle: Switch position and color visually explain state immediately -->
  <button type="button" role="switch" aria-checked="true"
    class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full bg-primary p-0.5 transition-colors duration-200 ease-in-out focus:outline-none">
    <span class="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-background shadow-sm transition duration-200 ease-in-out"></span>
  </button>
</div>
```

---

### Example 5: Plan / Tier Selection Cards

#### ❌ BAD (Equal-Weight Box Soup, Repetitive Checkmarks & Explanations)
```html
<!-- BAD: Three identical loud bordered boxes, walls of text in bullets, zero focal hierarchy -->
<div class="grid grid-cols-2 gap-4 p-4">
  <div class="border-4 border-gray-600 p-4 bg-gray-100">
    <h3 class="text-lg font-bold border-b-2 border-gray-400 pb-1">Starter Plan Membership</h3>
    <p class="text-xs text-gray-600 mt-2">
      This is our entry level starter plan intended for individual developers and solo founders who are just getting started building their applications.
    </p>
    <div class="my-4 border border-gray-400 p-2 bg-white">
      <span class="text-xl font-bold">$10.00 USD Every Month</span>
    </div>
    <ul class="text-xs text-gray-700 space-y-1">
      <li>• You will receive access to up to 5 team projects</li>
      <li>• You will have 10GB of cloud storage capacity included</li>
      <li>• Standard community support via email tickets</li>
    </ul>
    <button class="w-full mt-4 bg-blue-600 text-white p-2 font-bold border border-black">Select Starter Plan</button>
  </div>

  <div class="border-4 border-gray-600 p-4 bg-gray-100">
    <h3 class="text-lg font-bold border-b-2 border-gray-400 pb-1">Pro Plan Membership</h3>
    <p class="text-xs text-gray-600 mt-2">
      This is our popular tier intended for scaling teams that need more performance, power, and team collaboration capabilities.
    </p>
    <div class="my-4 border border-gray-400 p-2 bg-white">
      <span class="text-xl font-bold">$30.00 USD Every Month</span>
    </div>
    <ul class="text-xs text-gray-700 space-y-1">
      <li>• You will receive access to unlimited team projects</li>
      <li>• You will have 100GB of cloud storage capacity included</li>
      <li>• Priority 24/7 dedicated support via Slack and email</li>
    </ul>
    <button class="w-full mt-4 bg-blue-600 text-white p-2 font-bold border border-black">Select Pro Plan</button>
  </div>
</div>
```

---

#### ✅ GOOD (Clear Focal Plan, Borderless Elevation, Concise Feature Highlights)
```html
<!-- GOOD: The recommended plan stands out via contrast and elevation; concise scannable features -->
<div class="grid grid-cols-2 gap-6 max-w-2xl">
  <!-- Tier 1: Standard (Subtle card) -->
  <div class="rounded-2xl bg-card p-6 border border-border/80 shadow-sm flex flex-col justify-between">
    <div>
      <h3 class="text-sm font-semibold text-foreground">Starter</h3>
      <div class="mt-4 flex items-baseline gap-1">
        <span class="text-3xl font-bold text-foreground">$10</span>
        <span class="text-xs text-muted-foreground">/mo</span>
      </div>
      <div class="mt-6 space-y-2.5 text-xs text-muted-foreground">
        <div class="flex items-center gap-2">
          <div class="h-1.5 w-1.5 rounded-full bg-muted-foreground/40"></div>
          <span class="text-foreground">5 projects</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="h-1.5 w-1.5 rounded-full bg-muted-foreground/40"></div>
          <span class="text-foreground">10 GB storage</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="h-1.5 w-1.5 rounded-full bg-muted-foreground/40"></div>
          <span class="text-foreground">Email support</span>
        </div>
      </div>
    </div>
    <button class="mt-8 w-full rounded-xl bg-muted hover:bg-muted/80 text-foreground py-2.5 text-xs font-semibold transition-colors">
      Get Started
    </button>
  </div>

  <!-- Tier 2: Recommended (Clear Focal Point with Brand Contrast) -->
  <div class="relative rounded-2xl bg-primary p-6 shadow-xl flex flex-col justify-between text-primary-foreground ring-1 ring-white/10">
    <!-- Visual Badge Affordance -->
    <span class="absolute -top-2.5 right-6 rounded-full bg-background text-foreground px-3 py-0.5 text-[10px] font-bold tracking-wider uppercase shadow-sm">
      Popular
    </span>
    <div>
      <h3 class="text-sm font-semibold text-primary-foreground/90">Pro</h3>
      <div class="mt-4 flex items-baseline gap-1">
        <span class="text-3xl font-bold text-primary-foreground">$30</span>
        <span class="text-xs text-primary-foreground/70">/mo</span>
      </div>
      <div class="mt-6 space-y-2.5 text-xs text-primary-foreground/80">
        <div class="flex items-center gap-2">
          <div class="h-1.5 w-1.5 rounded-full bg-primary-foreground/60"></div>
          <span class="text-primary-foreground">Unlimited projects</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="h-1.5 w-1.5 rounded-full bg-primary-foreground/60"></div>
          <span class="text-primary-foreground">100 GB storage</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="h-1.5 w-1.5 rounded-full bg-primary-foreground/60"></div>
          <span class="text-primary-foreground">24/7 priority support</span>
        </div>
      </div>
    </div>
    <button class="mt-8 w-full rounded-xl bg-background text-foreground hover:bg-background/90 py-2.5 text-xs font-semibold shadow-sm transition-colors">
      Upgrade to Pro
    </button>
  </div>
</div>
```

---

### Example 7: Content Card Wireframe Skeleton (Zero Layout Shift vs Dead Blank State)

*Scenario: A metric card fetching live API data upon initial page load or tab navigation.*

#### ❌ BAD (Dead Frozen UI: Blank Box That Abruptly Pops In with Violent Layout Shift)
```html
<!-- BAD: Empty container with 0px height while loading. When data arrives, it violently shoves everything down 220px -->
<div class="bg-card rounded-2xl border border-border">
  <!-- Sits completely empty for 1.5s; user has no idea if the page is broken or still loading -->
</div>
```
*Why it fails*:
- **Dead state**: For 1.5 seconds, the screen has an awkward empty gap.
- **Violent Layout Shift (CLS)**: Once the API returns, the card pops to full height, jarring the entire layout.

---

#### ✅ GOOD (Wireframe Skeleton: Exact Geometry Reservation & Zero CLS)
```html
<!-- GOOD: Exact layout footprint reserved with smooth, subtle theme-aware pulsing tokens -->
<div class="bg-card rounded-2xl p-6 shadow-sm border border-border/60 max-w-md animate-pulse">
  <!-- Header: Skeleton title + skeleton badge -->
  <div class="flex items-center justify-between">
    <div class="h-4 w-32 rounded-md bg-muted"></div>
    <div class="h-5 w-14 rounded-full bg-muted"></div>
  </div>

  <!-- Metric: Exact numeral height reserved -->
  <div class="mt-4 flex items-baseline gap-2">
    <div class="h-8 w-24 rounded-lg bg-muted"></div>
    <div class="h-3 w-16 rounded-md bg-muted/60"></div>
  </div>

  <!-- Progress Bar Skeleton -->
  <div class="mt-4 space-y-2">
    <div class="h-1.5 w-full rounded-full bg-muted"></div>
    <div class="flex justify-between">
      <div class="h-2.5 w-16 rounded bg-muted/60"></div>
      <div class="h-2.5 w-16 rounded bg-muted/60"></div>
    </div>
  </div>

  <!-- Actions Skeleton: Exact button size reserved -->
  <div class="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-border/60">
    <div class="h-8 w-20 rounded-lg bg-muted/60"></div>
    <div class="h-8 w-24 rounded-lg bg-muted"></div>
  </div>
</div>
```
*Why it succeeds*:
- **Pre-attentive preview**: The user immediately perceives the layout structure.
- **CLS = 0**: When the real API data renders, not a single surrounding element moves.

---

### Example 8: Action Button Async Loading (Locked Width & Idempotency)

*Scenario: User clicks a primary submission button triggering an asynchronous API mutation.*

#### ❌ BAD (Unresponsive / Shrinking Button: Duplicate Clicks & Layout Reflow)
```html
<!-- BAD: No loading feedback, button remains clickable allowing race conditions, or shrinks drastically -->
<button class="bg-primary text-primary-foreground px-4 py-2 rounded-lg">
  Save changes
  <!-- Nothing happens on click! User clicks 5 times rapidly in frustration -->
</button>
```

---

#### ✅ GOOD (Dimension-Locked, Disabled, Accessible Inline Micro-Loader)
```html
<!-- GOOD: Explicit min-width prevents button resizing, disabled state prevents duplicate mutations -->
<button 
  type="submit" 
  disabled 
  aria-busy="true"
  class="min-w-[140px] inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm opacity-85 cursor-not-allowed transition-all">
  <!-- Subtle inline spinner matching foreground color -->
  <svg class="h-3.5 w-3.5 animate-spin text-current" fill="none" viewBox="0 0 24 24">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
  <span>Saving...</span>
</button>
```
*Why it succeeds*:
- **Dimension stability**: `min-w-[140px]` keeps button width unchanged between "Save changes" and "Saving...".
- **Duplicate protection**: `disabled` and `aria-busy="true"` protect the API from rage-clicking.
- **Sensory feedback**: Instant transition within <50ms confirms the action is processing.

---

### Example 9: YouTube Video Embed / Media Skeleton (16:9 Aspect Ratio Locking)

*Scenario: Embedding an external YouTube video or rich media player on a dashboard or resource page.*

#### ❌ BAD (Unsized Embed: Layout Whiplash & Thread Freezing)
```html
<!-- BAD: No aspect ratio wrapper. When YouTube iframe initializes, page jumps 360px down -->
<div class="my-4">
  <!-- Sits blank, then suddenly pops into view pushing comments/articles downward -->
  <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>
</div>
```
*Why it fails*:
- **Severe CLS**: Browser cannot calculate height before the iframe renders, causing jarring page jumping.
- **Thread blocking**: Heavy YouTube embed scripts load immediately, stalling the page render.

---

#### ✅ GOOD (Locked `aspect-video` Skeleton & Facade with Contextual Silhouette)
```html
<!-- GOOD: Aspect-video locks the 16:9 box before load; contextual play icon communicates video content -->
<div class="relative w-full max-w-2xl aspect-video rounded-2xl overflow-hidden bg-muted border border-border shadow-sm">
  <!-- Skeleton State (While fetching video metadata or player) -->
  <div class="absolute inset-0 flex flex-col items-center justify-center bg-muted animate-pulse">
    <!-- Play button silhouette affordance -->
    <div class="h-12 w-12 rounded-full bg-foreground/10 flex items-center justify-center">
      <svg class="h-5 w-5 text-foreground/30 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z"/>
      </svg>
    </div>
    <span class="mt-3 text-xs font-medium text-muted-foreground/60">Loading video player...</span>
  </div>

  <!-- Facade / Mounted Video (Exact same 16:9 box; zero layout shift on swap) -->
  <iframe 
    class="relative z-10 h-full w-full opacity-0 transition-opacity duration-300"
    onload="this.classList.remove('opacity-0')"
    src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=0" 
    title="YouTube video player"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen>
  </iframe>
</div>
```
*Why it succeeds*:
- **CLS = 0**: The `aspect-video` container guarantees exact pixel reservation across all screen sizes.
- **Pre-attentive silhouette**: The centered play icon signals a video is incoming, relieving user anxiety.
- **Smooth fade-in**: `transition-opacity duration-300` replaces the harsh pop-in with a gentle transition.

---

### Example 10: Rich External Link Unfurling Skeleton (e.g. YouTube / Website Link)

*Scenario: User pastes a YouTube or external URL into a post or message; an API fetches OpenGraph preview metadata.*

#### ❌ BAD (Abrupt Pop-In: Chat / Reading Content Shifts Violently)
```html
<!-- BAD: Card is injected abruptly without layout reservation, jumping text lines under user's cursor -->
<div class="text-sm">Check out this tutorial: https://youtube.com/watch?v=xyz</div>
<!-- 2 seconds later, a 110px preview card suddenly appears here, pushing everything below it down -->
```

---

#### ✅ GOOD (Inline Preview Skeleton: Pre-Allocated Thumbnail & Typography Slots)
```html
<!-- GOOD: Pre-allocates exact horizontal card footprint while API metadata resolves -->
<div class="mt-3 flex items-center gap-4 rounded-xl p-3 bg-card border border-border/80 shadow-sm max-w-lg animate-pulse">
  <!-- Locked Aspect-Video Thumbnail Slot -->
  <div class="relative w-28 aspect-video shrink-0 rounded-lg bg-muted flex items-center justify-center">
    <svg class="h-4 w-4 text-muted-foreground/40" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z"/>
    </svg>
  </div>

  <!-- Text Slots: Domain + Title + Description Pre-allocation -->
  <div class="flex-1 space-y-2 py-0.5">
    <!-- Domain badge skeleton -->
    <div class="h-3 w-20 rounded bg-muted"></div>
    <!-- Title skeleton -->
    <div class="h-4 w-5/6 rounded bg-muted"></div>
    <!-- Meta description skeleton -->
    <div class="h-3 w-2/3 rounded bg-muted/60"></div>
  </div>
</div>
```
*Why it succeeds*:
- **Zero layout jump**: Thumbnail (`aspect-video`), domain pill, and title lines already hold their physical space.
- **Seamless data fill**: When YouTube or OpenGraph API returns, the real thumbnail and title replace the skeletons smoothly.

---

### Example 11: Micro-copy Brevity & Vector Icons vs. Emoji Clutter (ลดข้อความเยิ่นเย้อและเปลี่ยน Emoji เป็น SVG)

*Scenario: An account security settings card with two-factor authentication (2FA) status, recovery codes, and action buttons.*

#### ❌ BAD (Emoji Soup, Conversational Fluff, Redundant Explanations, Broken Theme Alignment)
```html
<!-- BAD: Multicolored emojis clash with theme, wordy manual-like paragraphs, polite fluff, non-standard layout -->
<div class="border-2 border-gray-300 bg-gray-50 p-6 rounded-lg max-w-xl">
  <!-- Clashing emoji header with redundant explanation -->
  <div class="border-b border-gray-200 pb-3 mb-4">
    <h3 class="text-lg font-bold text-gray-900">🔐 การตั้งค่าความปลอดภัยและการยืนยันตัวตนสองชั้น (2FA) 🛡️</h3>
    <p class="text-xs text-gray-600 mt-1">
      ในหน้านี้ท่านสามารถทำการเปิดใช้งานการยืนยันตัวตนสองขั้นตอน เพื่อช่วยปกป้องความปลอดภัยของบัญชีผู้ใช้งานของท่านไม่ให้ถูกโจรกรรมข้อมูลจากผู้ไม่หวังดี
    </p>
  </div>

  <!-- Status banner with emoji soup -->
  <div class="bg-yellow-100 border border-yellow-300 p-3 rounded mb-4 flex items-start gap-2">
    <span class="text-xl">⚠️</span>
    <div>
      <h4 class="text-xs font-bold text-yellow-900">💡 คำแนะนำสำคัญ: สถานะปัจจุบันยังไม่ได้เปิดใช้งาน 🔴</h4>
      <p class="text-[11px] text-yellow-800 mt-0.5">
        ระบบตรวจสอบพบว่าบัญชีของท่านยังไม่ได้เปิดใช้งานการยืนยันตัวตนผ่านแอปพลิเคชัน Authenticator ขอแนะนำให้ท่านเปิดใช้งานทันที
      </p>
    </div>
  </div>

  <!-- Recovery codes section with conversational text -->
  <div class="bg-white border border-gray-200 p-3 rounded mb-4">
    <span class="text-xs font-bold text-gray-800">🔑 รหัสกู้คืนฉุกเฉิน (Backup Recovery Codes) 📑</span>
    <p class="text-[11px] text-gray-500 mt-1">
      ท่านสามารถกดปุ่มด้านขวาเพื่อทำการดาวน์โหลดรหัสสำรองฉุกเฉินเก็บไว้ในคอมพิวเตอร์ของท่าน ในกรณีที่ท่านทำโทรศัพท์มือถือสูญหาย
    </p>
  </div>

  <!-- Verbose buttons with emojis -->
  <div class="flex justify-end gap-3 pt-2">
    <button class="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold py-2.5 px-4 rounded border border-gray-400">
      ❌ ยกเลิกการตั้งค่า
    </button>
    <button class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded border border-blue-800 flex items-center gap-1.5">
      🚀 คลิกที่นี่เพื่อเริ่มการเปิดใช้งาน 2FA ทันที ➡️
    </button>
  </div>
</div>
```
*Why it fails*:
- **Emoji visual noise**: `🔐`, `🛡️`, `⚠️`, `💡`, `🔴`, `🔑`, `📑`, `❌`, `🚀`, `➡️` create severe cognitive clutter and look like a toy.
- **Theme breakage**: Yellow/red/blue emojis cannot adapt to dark mode or branded palettes; they render inconsistently across Windows, Mac, and mobile.
- **Text bloat**: Reading takes 15–20 seconds instead of scanning in 2 seconds. Every section has polite conversational padding (*"ในหน้านี้ท่านสามารถ...", "ขอแนะนำให้ท่าน...", "คลิกที่นี่เพื่อเริ่ม..."*).
- **Misaligned baselines**: Emojis have uneven font heights, making button text look crooked.

---

#### ✅ GOOD (Theme-Reactive Lucide SVG Icons, Scannable Micro-copy, Layout-Driven Affordance)
```html
<!-- GOOD: Semantic SVG icons (currentColor), concise 1-2 word labels, scannable in <2 seconds, dark mode ready -->
<div class="rounded-2xl bg-card border border-border/80 p-6 shadow-sm max-w-lg">
  <!-- Header: Crisp layout, 1-word title + semantic SVG icon -->
  <div class="flex items-center justify-between pb-4 border-b border-border/60">
    <div class="flex items-center gap-2.5">
      <div class="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
        <!-- Lucide: ShieldCheck (stroke-2, currentColor) -->
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      </div>
      <div>
        <h3 class="text-sm font-semibold text-foreground">ความปลอดภัยบัญชี</h3>
        <p class="text-xs text-muted-foreground">การยืนยันตัวตนสองชั้น (2FA)</p>
      </div>
    </div>

    <!-- Semantic CSS Dot Badge: Replaces emoji dot 🔴/🟢 -->
    <span class="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
      <span class="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
      ยังไม่เปิดใช้
    </span>
  </div>

  <!-- Compact Rows with Proximity Grouping: Zero filler words -->
  <div class="mt-4 space-y-3">
    <!-- Row 1: Authenticator app -->
    <div class="flex items-center justify-between p-3 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors">
      <div class="flex items-center gap-3">
        <!-- Lucide: Smartphone -->
        <svg class="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/>
          <path d="M12 18h.01"/>
        </svg>
        <div class="text-xs">
          <span class="font-medium text-foreground">Authenticator App</span>
          <p class="text-muted-foreground">Google Auth, 1Password</p>
        </div>
      </div>
      <button class="px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-sm transition-colors">
        เปิดใช้งาน
      </button>
    </div>

    <!-- Row 2: Recovery codes with Progressive Disclosure (Tooltip helper) -->
    <div class="flex items-center justify-between p-3 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors">
      <div class="flex items-center gap-3">
        <!-- Lucide: Key -->
        <svg class="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
        </svg>
        <div class="flex items-center gap-1.5 text-xs">
          <span class="font-medium text-foreground">รหัสสำรองฉุกเฉิน</span>
          <!-- Micro Tooltip Trigger: Replaces text wall -->
          <button class="text-muted-foreground hover:text-foreground transition-colors" title="ใช้เข้าสู่ระบบเมื่อไม่สามารถใช้อุปกรณ์หลักได้">
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
            </svg>
            <span class="sr-only">ข้อมูลเพิ่มเติม</span>
          </button>
        </div>
      </div>
      <button class="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-background rounded-lg border border-border/60 transition-colors">
        ดาวน์โหลด
      </button>
    </div>
  </div>
</div>
```
*Why it succeeds*:
- **Scannable in <2 seconds**: User grasps the status (`ยังไม่เปิดใช้`), the options, and the action buttons at a single glance.
- **Zero conversational fluff**: "กรุณา", "ท่านสามารถ", "คลิกที่นี่เพื่อ" are completely gone. Labels are 1–2 words (`เปิดใช้งาน`, `ดาวน์โหลด`).
- **Theme-reactive SVGs**: Icons inherit text colors dynamically (`currentColor`, `text-primary`, `text-muted-foreground`), adapting flawlessly to light/dark modes.
- **Consistent optical weight**: Clean 16px (`h-4 w-4`) icons with 2px stroke width create harmony and enterprise-level polish.
- **Progressive disclosure**: Long explanations are replaced by a clean micro info tooltip, preserving canvas clarity.

---

## The 11-Step UI Quality Checklist

Before completing any frontend code, review against this checklist:

| Check | Question | Standard |
| :--- | :--- | :--- |
| **1. Host Theme Alignment** | Does the component inherit the host app's design tokens, CSS variables, and radius scale? | Binds to `primary`, `card`, `background`, `border-border`. No rogue random colors or mismatched radii. |
| **2. Theme Cohesion** | Are colors, font-weights, and corner radii drawn from the same design token system? | 60% neutral, 30% surface, 10% accent. Uniform radius. |
| **3. Focal Point** | Is there exactly ONE dominant primary action on this screen/card? | Primary button stands out; secondary actions use ghost/muted styling. |
| **4. Simplicity** | Did you remove all decorative lines, unnecessary icons, and redundant badges? | No clutter. Every pixel serves function. |
| **5. Surface Tone** | Are adjacent backgrounds within a subtle 2–5% lightness delta? | No jarring light/dark checkerboard or saturated card bodies. |
| **6. Border Diet** | Did you eliminate nested borders and heavy outlines? | Whitespace & subtle shadows replace 1px solid wireframes. |
| **7. Micro-copy Brevity** | Did you strip out filler words ("กรุณา", "please", "click here") and wordy subtitles? Can the UI be scanned in <2s? | Headers are 1–3 words. No paragraphs stating the obvious. Rare details hidden behind tooltips. |
| **8. Layout Affordance** | Did you use layout, pills, status dots, and progress bars instead of text sentences? | Show state visually; let the layout explain the relationship. |
| **9. Spatial Continuity** | When opening/expanding a panel, does the trigger remain stable and co-dependent reference data stay visible? | No runaway buttons, no violent layout shifts; dual-pane/slide-over preserves context. |
| **10. Async & Media Loading** | Does every API fetch, image load, and video/link embed (e.g. YouTube) provide immediate feedback with locked aspect ratios? | Skeletons for content layout; `aspect-video`/`aspect-square` for media (zero CLS); locked-dimension button spinners; no frozen UI. |
| **11. Vector Icons vs. Emoji** | Are system navigation, actions, form inputs, and status indicators using theme-bound SVG icons instead of emojis? | Strictly SVG for system chrome; emojis restricted to UGC, interactive reaction bars, or playful consumer apps. |

---

## When to Activate This Skill

- When creating new UI components, forms, cards, dashboards, or modals.
- When handling asynchronous data fetching, form submissions, mutations, and API requests.
- When designing multi-panel views, slide-over sheets, detail inspection drawers, or split-pane interfaces.
- When injecting new features or dialogs into an existing application to ensure they match the host theme.
- When refactoring existing clunky, cluttered, or dated interfaces.
- When writing micro-copy, labels, button text, headers, and error messages to ensure scannability and eliminate conversational text bloat.
- When selecting icons or deciding between vector/SVG icons and emojis to maintain theme consistency and professional aesthetics.
- When styling web interfaces with Tailwind CSS, CSS Modules, styled-components, or vanilla CSS.
- When reviewing frontend designs for visual clarity, user experience (UX), and cognitive load reduction.
