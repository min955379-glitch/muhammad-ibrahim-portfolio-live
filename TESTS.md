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
- **Deployment Protection: not changed by me.** The connector exposes no setting for it and
  `api.vercel.com` is blocked from the sandbox. I did verify the public page loads without a login today,
  so nothing needs changing unless Vercel later starts asking for one.

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
