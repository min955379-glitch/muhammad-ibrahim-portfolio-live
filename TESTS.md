# What was tested and what was not

Date: 2026-11-27. Host: Vercel project `muhammad-ibrahim-portfolio-live`
production alias `https://muhammad-ibrahim-portfolio-live.vercel.app/`.

## TESTED (real measurements, tools listed)

| Check | Result | How |
|---|---|---|
| Public page loads without login | HTTP 200, full content read | `fetch_page` on the Vercel URL |
| `style.css` over the public URL | HTTP 200, latest CSS confirmed on live URL | `fetch_page` (chunks 0 and 2) |
| `script.js` over the public URL | HTTP 200, content matches deployed commit | `fetch_page` |
| Vercel build | READY, `Build Completed in /vercel/output [33ms]`, no stderr errors | `get_deployment_events` |
| Every local asset over HTTP | 200 for `/`, `/style.css`, `/script.js`, 3 fonts, 6 images, `favicon.ico`, `robots.txt`, `sitemap.xml`, icons; 404 only for unknown paths | local static server + `curl` (22 paths) |
| HTML structure | 1 H1, 5 H2, 7 H3, all tags balanced, no `<ul>` inside `<span>` | `cheerio` parse + own tag-balance script |
| In-page links | every `#anchor` has a target section | `cheerio` |
| External links | 22 links, 19 unique targets, all real (wa.me / mailto / vercel.app / github.com / fiverr); none empty; `target=_blank` all carry `rel=noopener` | `cheerio` |
| Images | 6 `<img>`, all 21-40 KB, all WebP, all have width+height, alt text, `loading=lazy` | `cheerio` + `identify` |
| No fake screenshot | 3 sites with no image use a labelled text card that literally says `no screenshot` | manual + `cheerio` |
| Proof-strip fact | "6 of 10 shown projects run on a public URL" - counted on the page, no date, no expiry |
| Tech tags re-checked against each repo | `package.json` / repo tree read for all 10 repos (see below) |
| No prices, no reviews, no invented claims | zero matches for `PKR/Rs/$/per month`, `testimonial`, `award`, `years of experience` | regex over body text |
| No emoji | zero emoji codepoints | regex over markup |
| Contrast (WCAG) | ink/ivory 15.4:1, muted 7.9:1, link 9.0:1, gold button label 7.7:1, footer 12.4:1, worst used pair 5.2:1 | own WCAG formula script (`/tmp/contrast.js`) |
| Motion budget | only `transform` + `opacity` animate; enter easing `cubic-bezier(0.16,1,0.3,1)`, exit `cubic-bezier(0.7,0,0.84,0)`; longest motion 420 ms; stagger 45 ms x 6 = 225 ms; no infinite animation, no gradient, no backdrop-filter | CSS scanner |
| `prefers-reduced-motion` | reveal + scramble skipped, content shown immediately | jsdom run with reduce = true |
| Menu behaviour | opens, closes on Esc, closes on outside click, closes on link click, `aria-expanded` flips, focus moves into sheet, Tab wraps, no scroll lock leak, inert at >= 768 px | jsdom (`dom-test.js`) |
| Reveal fallback | if `IntersectionObserver` is missing, content is visible (this is why I changed the feature test) | jsdom |
| JS syntax / runtime errors | `node --check` clean; no console.error or uncaught error in mobile / desktop / reduced runs | node + jsdom VirtualConsole |
| Page weight (first visit, no images) | 25.5 KB HTML + 19.3 KB CSS + 4.5 KB JS + 40.7 KB fonts + 0.3 KB favicon = **90.3 KB** | `stat` |
| Full repo payload with every image | **364 KB** (budget 500 KB) | `du` / script |
| No horizontal overflow risk | no fixed width over 210 px outside a media query; `overflow-x: clip` on body; `.shots` scroll only inside its own box | CSS scan |

## NOT TESTED (honest limits)

- **Not tested in a real browser.** This sandbox has no Chromium/Playwright/Puppeteer, so no pixels, no
  layout engine: overlap and clipping at 360 / 768 / 1280 are reasoned about from CSS, not measured.
- **Not tested on a real phone** (Android or iPhone).
- **Not tested: image HTTP status on the public Vercel URL.** `.webp` is binary and my fetch tool only reads
  text, and the sandbox blocks `vercel.app` by network policy (a proxy test returned `000`). The images
  returned 200 from the same files on a local server and they are in the deployed repo, but I did not see
  a 200 for `/images/*.webp` over the public internet. Click one preview on the live site to confirm.
- **Not tested: real scroll animation smoothness / FPS**, hover feel, tap feedback latency.
- **Not tested: WhatsApp deep reply, Fiverr page content** (links are the exact ones you gave).
- **Not verified: the Mental Maths APK.** It is committed in your repo and its README claims offline install,
  but nothing on this site links it, because I could not install it.
- **Not installed: Impeccable, Awesome Design MD, Vercel web-design-guidelines, Chrome DevTools MCP.**
  I confirmed the first three exist on GitHub and read the guidelines repo file list, but the design review
  here is my own manual pass, not a tool run.
- **Deployment Protection: not changed by me** (the connector exposes no setting for it and `api.vercel.com`
  is blocked from the sandbox). Measured today: the production alias
  `https://muhammad-ibrahim-portfolio-live.vercel.app/` loads with **no login**, but a deployment-specific URL
  like `muhammad-ibrahim-portfolio-live-<hash>-min955379-6910.vercel.app` **is** blocked with
  "Log in to Vercel" (that is `ssoProtection: all_except_custom_domains`). So: share only the alias URL. If you
  want every Vercel URL public, disable it in Dashboard -> project -> Settings -> Deployment Protection.
- Note for re-checks: the page fetcher can return a cached copy for a few seconds after a deploy. A cache-busting
  query (`/?v=2`) showed the new content, which matched the deployed commit exactly.

## Tech-tag corrections (repo evidence, this pass)

| Project | Was | Now (repo evidence) |
|---|---|---|
| Blue Peak Store | Next.js, Supabase | Static HTML + CSS + vanilla JS, Supabase Postgres, no build step (repo has only `index.html`, `admin.html`, `supabase/*.sql`) |
| Mental Maths | TypeScript, PWA, Android/WebView | Vanilla JS + Web App Manifest (`pwa/`), React 18 + Vite prototype (`frontend/`), Android WebView |
| Fitness Pro | Next.js, Tailwind | Next.js 16, TypeScript, React, Supabase Auth (no Tailwind in `package.json`) |
| ReviewNudge | ...Resend, Vercel | ...Resend (Vercel is hosting, not a dependency) |
| My English Practice | ...Web Speech | ...Supabase + Drizzle (`@supabase/supabase-js`, `drizzle-orm`; Tailwind 4 present) |
| BluePeak Terminal | Vanilla JS, Node gateway, Supabase, RLS | Static HTML + CSS + vanilla JS, Node gateway, Supabase Auth + RLS |
| Street Food Empire | Godot 4 | Godot 4.7 (`project.godot` header) |
| Chat Bridge, DailyMB, DaemonCut | unchanged | already matched the repos |

Backtests claim: kept, because the repo really has it - `PROJECT_STATUS.md` describes a
"fee/slippage-aware deterministic backtesting" stage and a "Historical Backtester" (up to 1,000 candles).
The card now reads "a historical backtester that accounts for fees and slippage" instead of "backtests".

Claims softened this pass (removed as unprovable): "tested and fixed by me line by line",
"tested on real phones", "checked frame by frame", "I check them at 360 px width", "Same-day reply is usual",
and the perishable "I opened it today / links I checked today" wording (verified true on 2026-11-27, but it
rots, so it is gone from the page).

## Things you should confirm by eye

1. The wording of the 6 project descriptions and 6 service lines (I wrote them from your repos).
2. That the 3 cards marked `no screenshot` are acceptable, or send me screenshots of those sites.
3. The Fiverr link is the `paid_promotions` link you gave, not a profile URL.
4. The "How I work" and "Nothing on this page is a client review..." lines (they state your honesty rules back
   to the visitor - remove them if you find them too blunt).

## Preview-image rules (why nothing can look stretched)

Checked with ImageMagick `identify` + a script that compares every `width`/`height`
attribute in `index.html` with the real file, and greps `style.css` for any fixed
height on an image.

| Preview | File | Real size | Drawn at 360x640 | Drawn at 1280x800 |
| --- | --- | --- | --- | --- |
| Mental Maths x3 | `images/mental-maths-*.webp` | 620x1262 | 218 x 444 | 168 x 342 each |
| Street Food x3 | `images/street-food-1..3.webp` | 620x1102 | 218 x 388 | 168 x 298 each |
| BluePeak Terminal | `images/bluepeak-og.webp` | 1200x630 | 320 x 168 | 533 x 280 |
| Fitness Pro (row) | `images/fitness-pro.webp` | 1000x563 | 260 x 146 | 200 x 113 |

Rules that make this hold:

* `img,svg{max-width:100%;height:auto}` - without `height:auto` an image with
  `width`/`height` attributes shrinks its width but keeps its height on older
  Android engines, which is what makes a screenshot look pulled long.
* `[data-shape="wide"] img{aspect-ratio:1200/630}` / `[data-shape="phone"] img{aspect-ratio:620/1262}`
  plus `object-fit:contain`, so the box can never be a different shape than the file.
* One frame rule for every preview: `border:1px solid var(--line)`, `border-radius:var(--radius)`,
  `background:var(--surface)` - the same values the Street Food row uses.
* No photo exists for ReviewNudge, My English Practice or Blue Peak Store, so those keep the drawn
  "no screenshot" text card (dashed `--line-2` frame, same `--radius`) - never a fake screenshot.
* Phone shots are drawn `min(252px, 100%, 34vh)`: about 250-280 px wide when there is room,
  never taller than ~70% of the screen height, three side by side at 1280, swipeable below that.
* `alt` on every image, `loading="lazy" decoding="async"`, all WebP under 40 KB.

Not checked (honest gaps): no real browser and no real phone in this sandbox - the
drawn sizes above are computed from the CSS by hand, not measured by a rendering
engine. The live page was re-read after deploy and lists the right files, but image
HTTP status over `vercel.app` cannot be seen from here (`fetch_page` returns text only).

## Premium layer (this round) - what is on, what is off, and how it was measured

Files: `style.css` (premium block at the end), `script.js` (premium block at the end), `index.html`
(hero restructure, 8 real screenshots, marquee, progress line).

| Effect | Where | On | Off when |
| --- | --- | --- | --- |
| Night-desk hero panel (palette B) | `#hero` | always | never (structure) |
| Aurora drift, 3 blobs, transform only | `.hero-bg` | 44s alternate | `prefers-reduced-motion`, `html.lite` |
| Grain (inline SVG, no file) | `.hero-grain` | opacity .05 | stays (cheap) |
| Frosted glass | nav bar, hero card, contact card | 3 surfaces | `@supports not (backdrop-filter)` -> solid fill |
| Sheen, one 600 ms pass | `[data-shine]` x8 | on reveal, and on hover (desktop) | lite / reduced motion |
| Floor reflection | `.mark-refl` | always (CSS mask) | stays |
| Gold dot + ring + label | `.cur-dot`, `.cur-ring` | only `(hover:hover) and (pointer:fine)` | touch, lite, reduced motion; **native cursor is never hidden** |
| Pointer spotlight in hero | `.hero-spot` | desktop, while the pointer is in the hero | same |
| Scroll progress line | `#progress` | `scaleX` in one rAF | lite / reduced motion |
| Number counters | `[data-count]` (3 nodes) | rAF, 700 ms, one shot | lite; final value is the HTML text |
| Magnetic WhatsApp button | `[data-magnet]` | max 8 px, desktop only | same |
| Hero letter reveal | `.name.split` | 15 letters, 26 ms apart, one shot | lite / reduced motion (plain heading) |
| Tech marquee | `.mq` | 46s linear, pause on hover | lite / reduced motion -> static row |
| Lit border on rows, underline on link pills | `.list-row::before`, `.lnk::before` | hover + focus-within | stays (transform only) |
| Section rail labels | `.sec-head .label` at 1280 | vertical marker | stays |

**`lite` mode = one flag** in `script.js`: `prefers-reduced-motion: reduce`, OR a coarse/absent
hover (`(hover: none)` / `(pointer: coarse)`), OR `Save-Data`, OR `deviceMemory <= 2`, OR
`effectiveType` `2g`/`slow-2g`. Core count is deliberately **not** used (cheap phones report plenty of cores).

Dropped from the approved plan, on purpose:
* **3D tilt on project images** - your instruction, and it was the most likely effect to cost frames.
* The sticky section label became an absolutely-positioned vertical rail at 1280 px: a real
  `position:sticky` label needed every section's markup re-nested, which risked the content you asked
  me to leave word-for-word.

### Checks run for this round

* `node /home/user/assetgen/check.js` - 0 failures, 2 warnings. Budgets raised as agreed:
  CSS 60 KB (**32.1 KB**), JS 25 KB (**12.6 KB**), total 700 KB (**633.5 KB**), first visit 250 KB (**138.6 KB**).
  It also now proves: every hex in the CSS belongs to palette A or B, **no green anywhere**, no price or
  testimonial text, every image WebP under 100 KB with `alt`, `loading="lazy"`, `width`/`height`, `height:auto`,
  tap targets >= 48 px, infinite animations stopped by both reduced-motion and lite mode.
* `node /home/user/assetgen/dom-test.js` - menu, keyboard, focus trap, reveal, scramble, no-IO fallback: all pass.
* `node /home/user/assetgen/premium-test.js` (new) - runs the page in jsdom with a **stubbed
  `matchMedia` for a desktop mouse**, so the new paths really execute: cursor created and moved,
  spotlight armed, letter split into 15 and revealed, heading text intact, progress `scaleX`,
  nav flips to day glass, counters land on 6 / 6 / 10, magnet capped inside 8 px, sheen armed on 8 surfaces,
  `@supports` fallback present, `cursor:none` never used. Then the same page with `hover:none` (touch) and
  with `prefers-reduced-motion` - all effects absent, all content visible, no errors.
* `node /home/user/assetgen/contrast.js` (new) - composites the translucent layers (aurora tint -> glass fill ->
  text alpha) and applies WCAG ratios to 22 pairs: worst measured pair **5.11:1**, everything else
  5.74:1 to 16.06:1. Glass areas included.

### Not tested (honest)

* No real browser and no real Android phone in this sandbox: no pixels, no FPS, no paint timing,
  no Lighthouse, no DevTools device emulation. Impeccable / Chrome DevTools MCP / Vercel's
  web-design-guidelines MCP are not installed here.
* The visual look of the glass, the sheen timing, the cursor weight and the marquee speed are therefore
  **computed and reviewed by reading the CSS, not seen**. Tell me what feels wrong and I will tune it.
* Image HTTP status over `vercel.app` cannot be read from the sandbox (`fetch_page` returns text only),
  so I verify the local file list, the repo file list from Vercel and the live HTML instead.
