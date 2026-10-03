# IoT Hub: Compact Build Prompt

You are a senior full-stack dev + UI designer (Next.js, Three.js, i18n). Build **IoT Hub**: a bilingual (th/en) info + price-comparison site for IoT/Arduino/ESP32 parts. It does NOT sell. "Buy" opens the real product page of the source shop in a new tab (`target=_blank rel="noopener noreferrer sponsored"`).

**Source shops** (both LnwShop; product URL `/product/{id}/{slug}`):
- CyberTice: https://www.cybertice.com
- AllNewStep: https://www.allnewstep.com

**Categories:** Arduino boards (Uno, Nano, Mega, Pro Mini) · IoT (ESP32, ESP8266, M5Stack, LoRa) · Sensors (environment, gas, distance, light, PIR, IMU, RFID, GPS/GSM) · Relays · Servo/Motor/Smart car · Displays/LED · Raspberry Pi/Micro:bit/STM32 · Power (step up/down, battery, solar) · Starter kits · Smart home.

## Stack
Next.js 14 App Router, TypeScript, Tailwind, next-intl, @react-three/fiber + drei, Framer Motion, Shiki, Recharts. Product data in local JSON/MDX (no backend). Responsive from 360px. Fonts: Noto Sans Thai + Inter with fallbacks.

## i18n
- Locales `th` (default), `en`; routes `/th/...`, `/en/...`; `/` redirects via Accept-Language; persist choice in cookie.
- Navbar neumorphic `TH | EN` toggle; keeps current page and query string.
- No hard-coded UI text: `messages/th.json`, `messages/en.json`; missing key falls back to en, never show raw keys.
- `type L = {th:string; en:string}` for every user-facing product field. Don't translate code, library names, install commands, chip names, numbers, URLs.
- Code comments in both languages.
- Money via `Intl.NumberFormat` (th: `฿1,250`, en: `THB 1,250`). Dates via `Intl.DateTimeFormat` (th uses Buddhist calendar).
- Thai text: line-height ≥1.6, proper line breaking. UI must survive text-length differences.
- Per-locale title/description/OG, `hreflang` + `x-default`, sitemap for all locales, `<html lang>` matches, translated aria-labels.
- On en locale, note under shop links: "Shop site is in Thai; use browser translate."
- Test: every key in th.json exists in en.json and vice versa.

## Product schema
```ts
type Product = {
  id; slug; name:L; category; tags:string[]; summary:L;
  specs:{chip;voltage;io_pins;interfaces:string[];dimensions};
  difficulty:"beginner"|"intermediate"|"advanced";
  useCases:{title:L;description:L}[];
  howToUse:{step;title:L;description:L}[];
  wiring:{pins:{from;to;note:L}[]};
  libraries:{name;installCommand;docsUrl;platform:string[]}[];
  codeExamples:{title:L;language;code;explanation:L}[];
  model3d:{type:"glb"|"procedural";path?;scale;hotspots:{label:L;position:[n,n,n];description:L}[]};
  prices:{shop:"cybertice"|"allnewstep";url;price:number|null;originalPrice?;inStock:boolean;shippingNote:L;lastChecked:ISODate}[];
  compareSpecs:{voltage_v;current_ma;io_pins;adc_channels;flash_kb;sram_kb;clock_mhz;wifi;bluetooth;lora;size_mm;weight_g;difficulty_score:1-5};
  compareSummary:L; relatedProducts:string[];
}
```
Seed 8 products: Uno R3, Nano, ESP32 DevKit, ESP8266 NodeMCU, DHT22, HC-SR04, 4ch 5V relay, SG90 servo. Write all text/code yourself; never copy text or images from the shops, only link. Never guess prices: unknown → `price:null` and show "Check price at shop".

## Design: Glass outside, Neumorphism inside
**Glass** (backdrop, hero, navbar, product cards, filter sidebar, modals, 3D frame, tag chips): Modern glassmorphism, multi-layered dashboard. Background: vibrant abstract mesh gradient with floating glowing color orbs (slow CSS animation, respect `prefers-reduced-motion`). Frosted translucent cards: 65% opacity fill for primary containers, 25% for secondary chips. `backdrop-filter: blur(20-40px)`, 1px `rgba(255,255,255,0.25)` border highlight, soft multi-layered drop shadows. Crisp high-contrast sans-serif.

**Neumorphism** (language toggle, tabs, toggles, buttons, sliders, steppers, spec cards, price cards, comparison tables, pin tables, copy buttons, filters): uniform surface `#e0e5ec` shared by cards and controls; raised = `9px 9px 18px #bec3c9, -9px -9px 18px #ffffff`; inset shadow for pressed/active; `16px` radius; text `#2d3436`; single muted blue accent `#4d6bfe` for active states, CTA and "lowest price" badge only.

Rules: neumorphic opaque panels sit on glass frames. WCAG AA contrast. All tokens as CSS variables/Tailwind theme. `backdrop-filter` fallback to semi-opaque bg. Optional dark mode (neu surface `#2b2f36`).

## Pages (all under `/[locale]/`)
1. **Home:** glass hero + orbs, search, category cards, "Start here" (Uno/Nano/ESP32), popular items, what-this-site-is.
2. **/products:** filters (category, difficulty, WiFi/BT/LoRa, voltage, price slider, in-both-shops, discounted), bilingual search, sort (price asc/desc, biggest saving between shops), glass cards with 3D thumbnail + lowest price + cheaper-shop icon.
3. **/products/[slug]:** left 3D viewer; right name, summary, difficulty, specs, two-shop price cards. Neumorphic tabs: Overview | How to use | Pinout | Libraries (install command + copy, docs link, Arduino IDE/PlatformIO) | Code (highlight, copy, Arduino/MicroPython switch, explanation) | Related.
4. **/compare**, 5. **/projects**, 6. **/learn** (beginner path: Blink, read sensor, WiFi relay), 7. **/shops** (shipping, free-shipping threshold, tax invoice, contacts; verify against live shop sites).

## 3D
Use `.glb` if present, else procedural Three.js board (PCB, black chip, gold headers, silver USB, realistic proportions). Ambient + directional + env map, soft shadows, transparent background. Slow auto-rotate that stops on interaction, orbit/zoom/touch, reset button, explode view if available, clickable hotspots (labels localized). Lazy-load; static image fallback on weak mobile.

## Pricing & comparison
**Rules:** every price shows "Price as of {date}". `lastChecked` > 7 days → yellow "may have changed" warning. Data from JSON updated manually/by script, not live per request. Check robots.txt/ToS or get shop permission before any automated scraping.

**A. Two-shop price cards (product page):** price, original price + discount %, stock, shipping note, "Buy at {shop}". Cheaper card gets accent "Lowest price" badge + saving (amount, %). Equal → "Same price", compare shipping. Out of stock/missing → greyed with reason. Optional 2-line price history chart.

**B. /compare (2-4 items):** "Add to compare" on cards, sticky bottom tray. Neumorphic table with groups: Price (lowest, cheapest shop, stock) · Core specs (chip, clock, flash, SRAM, I/O, ADC, voltage, current) · Connectivity (WiFi/BT/LoRa/USB/I2C/SPI/UART ✓/✗) · Size/weight · Beginner difficulty (1-5 stars) · Libraries · Use cases. Highlight best value per row (lower price = better; more memory/pins = better), mute worst. "Differences only" toggle. Radar chart: performance, connectivity, ease, compactness, value (specs per baht). `compareSummary` row. Shareable `?items=a,b`. Mobile: horizontal scroll with sticky name column.

**C. /projects cost calculator:** preset projects (auto plant watering, temperature-to-web, phone-controlled lights) with BOM from catalog and quantity steppers. Totals: all at CyberTice, all at AllNewStep, "mixed cart" (cheapest per item, warn about extra shipping). Show free-shipping status and amount missing. As of the last check: CyberTice free shipping from 1,500 THB (Kerry 2,000); AllNewStep 40 THB shipping, free from 1,500 THB; re-verify. "Copy shopping list" (names + chosen shop links).

## Quality
Lighthouse mobile ≥85 (lazy 3D, dynamic imports, per-locale messages). Keyboard access, focus rings, no layout shift on language switch. Unit-test pricing utils (lowest price, % diff, value score, mixed cart, free-shipping gap; cases: out of stock, equal price, null price).

**Footer disclosure**
- EN: Prices are for reference as of the last check date and may change without notice. Actual prices and stock are on the source shop's site. This site does not sell products directly.
- TH: ราคาเป็นข้อมูลอ้างอิง ณ วันที่ตรวจสอบล่าสุด อาจเปลี่ยนแปลงโดยไม่แจ้งล่วงหน้า ราคาและสต็อกจริงเป็นไปตามเว็บร้านต้นทาง เว็บนี้ไม่ได้จำหน่ายสินค้าโดยตรง

## Example message keys
`common.buyAt` "ซื้อที่ {shop}"/"Buy at {shop}" · `price.cheapest` "ถูกที่สุด"/"Lowest price" · `price.save` "ประหยัดกว่า {amount} ({percent})"/"Save {amount} ({percent})" · `price.asOf` "ราคา ณ วันที่ {date}"/"Price as of {date}" · `price.stale` "ราคาอาจเปลี่ยนแปลง กรุณาตรวจสอบที่ร้าน"/"Price may have changed, please check the shop" · `price.checkAtShop` "ดูราคาที่ร้าน"/"Check price at shop" · `compare.diffOnly` "แสดงเฉพาะความแตกต่าง"/"Show differences only"

## Work order
1. Propose folder structure (`messages/`, `data/products/`) + design tokens.
2. next-intl, middleware, `/[locale]` routing, language switcher.
3. Layout, mesh gradient + orbs, base components (GlassCard, NeuButton, NeuTabs, NeuToggle, Chip, LanguageSwitcher).
4. Home + product list.
5. Product detail + 3D viewer.
6. 8 seed products, fully bilingual.
7. PriceCompareCard, CompareTable, RadarChart, CostCalculator + utils + tests.
8. /compare, /projects, /learn, /shops.
9. Audit: responsive, a11y, performance, SEO (hreflang, sitemap), translation completeness.

Keep each step summary short. Flag anything I must verify myself (prices, shipping terms).
