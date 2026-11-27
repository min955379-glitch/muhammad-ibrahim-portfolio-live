# Stage 1 Plan — Muhammad Ibrahim Portfolio (LIVE)

Prepared 2026-11-27. Nothing built yet. Awaiting approval.

## 0. Sources checked (all opened by me)

| Source | Status |
|---|---|
| github.com/Animmaster | LIVE. His site is https://animmasterlib.dev (linked from his profile). |
| skiper-ui.com | LIVE (wordmark "Skiper UI", shadcn component库). |
| vengenceui.com | LIVE, redirects to www.vengenceui.com ("Vengeance UI"). |
| webflow.com/made-in-webflow | LIVE. webflow.com/templates also reachable via "Looking for templates?" link. |
| 21st.dev | LIVE. |
| html5up.net | LIVE (44 templates, static HTML). |
| design.dev | LIVE (now mostly AI-agent config generators + templates). |
| useamoeba.com | LIVE (multiplayer AI IDE — not a design site). |
| reactbits.dev | LIVE (repo DavidHDev/react-bits, licence = "NOASSERTION", so ideas only). |
| ui.watermelon.sh | LIVE. |
| kokonutui.com | LIVE. |
| motion-primitives.com | LIVE (repo ibelick/motion-primitives, MIT — but ideas only, no code copied). |
| animejs.com | LIVE (docs + bundle-size table). |

Design tools: I do NOT have Impeccable, "Awesome Design MD", Vercel web-design-guidelines or Chrome
DevTools MCP as installed tools. I checked access honestly:
- `vercel-labs/web-interface-guidelines` exists on GitHub (read its file list only).
- `VoltAgent/awesome-design-md` exists (129k stars).
- No browser (Playwright/Puppeteer/Chromium) exists in this sandbox.
=> Review will be manual + measured with `curl` and file-size checks. I will say so in the final report.

## 1. One idea taken from each source

| Source | The one idea I take |
|---|---|
| Animmaster Lib | Giant all-caps, wide letter-spaced display heading (300-PROUD-COMPONENTS style), used once in the hero. |
| Skiper UI | The scramble/decode title as a one-shot 400 ms intro only (never looping). |
| Vengeance UI | Spotlight hover: a hairline border that lights up on the active project row. |
| Webflow (made-in-webflow) | Project = one big real thumbnail + one-line title; the image is the link. |
| 21st.dev | "Top today" numbered index (01, 02, 03) — my featured-work numbering. |
| HTML5 UP | Generic layout discipline + licence: CC-BY. I borrow structure only, no code, and give no credit obligation. |
| Design.dev | Code-comment section labels (e.g. `// FEATURED WORK`) in the mono font. |
| Amoeba | "Honesty block" — a plain, stated-in-words trust note. Becomes my "How I work" lines (AI-assisted, tested by me). |
| React Bits | Staggered reveal of a small set (their marquee lists) — I keep it to 6 rows, 40 ms apart. |
| Watermelon UI | `//LABEL` + index numbers (01/02) as a section system; also "no card inside card". |
| Kokonut UI | Catalogue discipline: one code-ish index per item (RW-01, ME-02) + tiny metadata line (stack, licence, status). |
| Motion Primitives | Text-scramble + "Scroll down" hint; also their one-image-per-row focus. |
| Anime.js | Their bundle-size table = proof-first culture. My proof strip shows only verifiable numbers. |
| Brittany Chiang | Numbered project list with tech tags (used for "More work"). |
| Rauno Freiberg | One-line identity sentence as the hero label; short values list. |
| Freelancer-structure articles (5 read: gigforge.io, cssgallerypro.com, timelesstype.co, anobee.com, myseera.com) | CTA repeated in 3 places; strongest project first; skip testimonials when there are none; nav = Work / About / Contact only. |

## 2. Final layout (mobile first)

1. Sticky top bar — monogram "MI" + name; links Work / Services / About / Contact; gold WhatsApp button (primary). Mobile: one 48px "Menu" button, opens ~250 ms closes ~120 ms, Esc + click-outside close, focus trap.
2. Hero — label `// SOFTWARE ENGINEERING STUDENT · ABBOTTABAD, PK`; H1 "Muhammad Ibrahim"; sub-headline = your exact headline text; one WhatsApp button + one "See my work" link; one-shot scramble on the label only. No photo, no video, no particles.
3. Proof strip — 4 verifiable facts: 6 featured projects · 4 live URLs I checked today (HTTP 200) · 4 countries served (PK/UK/USA) · static HTML/CSS/JS, no framework. No fake numbers.
4. Featured work — 6 full-width editorial rows, alternating image side at 1280px, numbered 01–06: title, 2-line description, tech tags, status label (Live / Repo only / Sign-in required / Not on Play Store yet), links Live + Code.
5. More work — compact numbered list (Fitness Pro, DailyMB, Chat Bridge, DaemonCut). No card grid.
6. Services — 6 numbered rows with hand-drawn inline SVG icons, one line each, no prices.
7. How I work (inside About) — 3 short honest lines (direct AI with prompts, test on real phone sizes, ship as static site).
8. About — your bio text, verbatim.
9. Contact — WhatsApp (primary), Email, Fiverr, GitHub. 4 links, 48px targets.
10. Footer — name, year, the 4 links, "Built with AI tools, by hand." + link to GitHub.

Motion: only transform + opacity. Enter `cubic-bezier(0.16,1,0.3,1)`, exit `cubic-bezier(0.7,0,0.84,0)`, 150–300 ms, stagger 40 ms on max 6 rows (<300 ms total), all inside `@media (prefers-reduced-motion: no-preference)`. IntersectionObserver adds a class once; no scroll listeners, no parallax.

## 3. Two palettes (no green anywhere)

A — "Warm paper" (light, my pick)
- Ink navy `#101A2E` (headings, text)
- Deep navy `#1B2C4B` (section rules, footer)
- Warm ivory `#F6F1E7` (page background)
- Muted gold `#B4884A` (ONE accent: primary button, numbers)
- Indigo `#3B4BA8` (links/focus) — contrast on ivory ≈ 4.6:1
- Gold button text = ink navy (contrast 7.4:1)

B — "Night desk" (dark, high contrast, softer on eyes at night)
- Background `#0B1220`
- Panel `#131E33`
- Ivory text `#F3EDE1`
- Cyan-blue `#66B8E8` (links/focus; 8:1 on bg)
- Muted gold `#D6A45C` (primary button, ink navy text on it)

Both: 16px+ body, visible focus ring (2px, 3px offset), no pure #000/#FFF.

## 4. Fonts (2 families, 3 files, self-hosted WOFF2, font-display: swap)

- Display: **Fraunces** 600 (latin subset, ~28 KB) — headings, hero name.
- Body: **IBM Plex Sans** 400 + 600 (~2 × 25 KB) — everything else, mono-ish labels use IBM Plex Sans 600 with letter-spacing (no 3rd family).
- Fallback stack: `Georgia, serif` / `system-ui, sans-serif`. No Google Fonts CDN request.
If you would rather spend 0 KB on fonts: Option B of fonts = system stack only (I can swap this in one line).

## 5. Project preview images — real ones only

I have no browser and no screenshot tool in this sandbox, so I cannot photograph live sites. Honest split:

I CAN make (real images taken from your own repos, converted with ImageMagick to WebP, <100 KB, width/height set, lazy-loaded, alt text):
- Mental Maths Practice — 1 desktop + 1 phone from `docs/screenshots/` (e.g. `dashboard-continue.png`, `quiz-light.png`).
- Street Food Empire — 3 from `store/screenshots/` (01_tutorial, 05_diner, 07_map) + `store/feature-graphic.png`.
- BluePeak Terminal — `og-preview.png` (41 KB, already in repo) + the label "sign-in required".
- Fitness Pro — `public/images/fitness-pro-hero.jpg` (217 KB, real project asset, converted).

I CANNOT make (no image in repo, and live site not screenshot-able here): ReviewNudge, My English Practice, Blue Peak Store, DailyMB, Chat Bridge, DaemonCut → clean text/SVG cards (drawn by me, labelled "no preview"), plus for DaemonCut a simple SVG diagram of the local app + Drive layout. No fake screenshots. If you later paste real screenshots into the repo, I can convert them in one pass.

## 6. Vercel name check (done today)

- `GET /v9/projects/muhammad-ibrahim-portfolio-live` → 404 "Project not found" (your account does not use this name).
- Project-name uniqueness on Vercel is global, so this is "not taken in your account", not a 100% guarantee. On create I use the API response; if Vercel rejects it I fall back in order: `muhammad-ibrahim-portfolio-next` → `muhammad-ibrahim-portfolio-2026` → `muhammed-ibrahim`.
- Your Vercel login is `min955379-6910`, team `team_luAhbBYjPV0EQn8drCTz8Ml2`. Default domain will be `<name>.vercel.app` (or `<name>-min955379-6910.vercel.app`).
- Old repo/project `Muhammad-Ibrahim-Portfolio` will not be touched. New repo `Muhammad-Ibrahim-Portfolio-Live` will be created at Stage 2 and pushed on this session branch first, then you merge to main (or I do it if you say so).

## 7. Live-site check results (by me, today, HTTP 200 via my page reader, no login)

- review-nudge-alpha.vercel.app → OK (marketing page live; app behind /signup)
- my-english-practice-three.vercel.app → OK
- bluepeak-terminal.vercel.app → OK but login wall (as you said). Note: that page shows "Access 1,000 PKR" — prices will NOT appear on your portfolio.
- blue-peak-store.vercel.app → OK (12 products visible)
- fitness-pro-kappa.vercel.app → OK
- Mental-Maths-Practice-: no live URL in repo; a signed APK v1.1.0 is committed in `apk/` and its README says it works offline. I cannot install it here, so I will NOT link an APK as "verified".
- Blue Peak Store images are hosted on cdn.shopify.com (the store's own assets) — I will not hotlink them.

## 8. Two things I need from you (short answers, or say "use your default")

1. Palette A (warm paper, light) or B (night desk, dark)? Self-hosted fonts OK, or system fonts (0 KB)?
2. Your Fiverr link is `fiverr.com/paid_promotions?public_mode=true` (a promo link, not a profile URL). Use it as-is, or send your real Fiverr profile link?

Reply `approved` (with any changes) and I build Stage 2.


---

## Stage 2 - premium pass (approved and built)

Same content contract. New: night-desk hero panel (palette B) with aurora + grain + pointer spotlight,
frosted glass on the nav / hero card / contact card, a one-pass sheen, floor reflection on the monogram,
desktop-only gold dot-and-ring cursor with a View/Open/Go label, scroll progress line, two real number
counters, magnetic WhatsApp button, one-shot letter reveal, a paused-on-hover marquee of the real stacks,
lit borders on rows and vertical section rails at 1280. Everything is transform/opacity only, all of it
switches off in `lite` mode (touch, reduced-motion, save-data, slow network) and behind `@supports`
fallbacks for glass. 3D tilt was dropped on request. Nine of the owner's own screenshots now sit in one
shared 620x1034 frame, swipeable like the Street Food Empire strip; the bag screenshot was not used because
it shows currency amounts, and no prices are allowed on this page.
