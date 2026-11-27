# What was tested and what was not

Date: 2026-11-27. Branch `arena/60aae8ed-muhammad-ibrahim-portfolio-liv` (round 3, not deployed).
Production still runs `main` = `4d6c8404` at
`https://muhammad-ibrahim-portfolio-live.vercel.app/`.
Everything below was measured in this sandbox against the files in this repo.
The rig lives in `.verify/` (gitignored): a static server, a real headless Chromium
(`puppeteer-core` + `@sparticuz/chromium`), and four checkers — `check.js`, `verify.js`,
`contrast.js`, `rm.js`, plus `extra.js` for the section PNGs that were looked at by hand.

## TESTED (measured, tool named)

| Check | Result | How |
|---|---|---|
| Static rules: no prices, no reviews/awards, no green in the CSS, no `cursor:none`, honest wording kept, no leftover placeholders | 0 fail / 52 pass | `node .verify/check.js` |
| Weights | `index.html` 44 257 B, `style.css` 40 998 B (budget 60 KB), `script.js` 13 494 B (budget 25 KB), 26 WebP 472 006 B, 3 WOFF2 64 936 B → page ≈ 621 KB (budget 750 KB) | `check.js` + `du -cb` |
| Layout in a real browser at 360 / 768 / 1280 | no horizontal scroll at any width (0 px); every phone, window frame and concept panel inside its stage (smallest padding left 1 px, usually 5–18 px); the note line never touches a picture (smallest gap 8 px); `small taps=[]`, `narrow cols=[]` | `verify.js` |
| No stretched screenshot | every `img` content box within 0.5% of its own file ratio (`R` column, e.g. 1.002), `width`/`height` attributes equal to the real pixels of the file on disk | `verify.js` + `identify` in `check.js` |
| Phone frames | 6 trios of 3 upright frames; the project's first screenshot is the middle one, the 2nd sits left, the 3rd right (asserted on the markup, re-read in the DOM) | `check.js` |
| Real screenshots added | Fitness Pro: 3 shots in browser-window frames; Chat Bridge: 3 popup shots in extension frames (never a phone frame); DailyMB: 3 real phone shots; DaemonCut: generated panel, labelled "Concept artwork I drew for this page. The real console is still being built." | markup + `check.js` + the PNGs |
| No prices inside a screenshot | the third Fitness Pro shot turned out to be the club's price panel — replaced with the gallery shot; `alt`, `data-cap` and the on-page note now match what the picture really shows | looked at the decoded WebP by hand |
| Hover on a mouse | the two side phones open up 25 px each (symmetric), one sheen crosses the middle phone, service rows slide 8 px and their arrow moves; transform/opacity only | `verify.js` + `getComputedStyle` |
| Lightbox | opens from any preview, caption taken from `data-cap`, focus moves into the box, `Esc` closes, page scroll locks, `body=hidden` | `verify.js` |
| Sticky bar | goes light only over a light band (measured from each band's own background), so it now inverts over "How I work" and "About" and stays dark over the night bands | `verify.js` + a DOM probe |
| Menu sheet on a phone | button visible below 768, sheet 323 px tall, 6 links, fully opaque `rgb(11,18,32)` | `verify.js` |
| `prefers-reduced-motion`, lite, full | 3 modes × 360 and 1280: no item left faded or shifted, no transform on the hero words, no running animation except the marquee and the aurora drift (both stopped in lite) | `rm.js` |
| Contrast | 622 visible text runs measured against the background each one really paints on: 0 under 4.5:1 (3 under 3:1 for display sizes: none). The one skipped run is the "MI" tile, painted by a gradient | `contrast.js` |
| Body size, heading size | body 16 px everywhere; `h2` 32 px (360) / 33.8 px (768) / 54.4 px (1280); hero name 43.9 / 72.2 / 120.3 px, one whole word per line, `slack=0 clip=0` (never cut) | `verify.js` |
| WhatsApp links | 10 links, each carrying a prefilled English message (`?text=`), the big contact one ending in "Here is what I need:" | `check.js` |
| Image hygiene | every `img` file exists, none over 100 KB, no unused file in `images/`, no loose text node inside a media box (that stray text was a bug, now asserted against) | `check.js` |
| JS syntax | `node --check script.js` clean | node |
| Screenshots actually looked at | hero, work rows, "More work" tiles, services, "How I work", contact, footer at 360 and 1280 | `extra.js` → PNGs in `.verify/shots` |

## KNOWN WARNINGS

- `backdrop-filter` is used on the sticky bar and the hero card. Off in lite mode, and there
  is a `@supports` fallback for browsers without it.
- The BluePeak Terminal preview is the project's own social card, because the live app sits
  behind a sign-in. The page says so instead of pretending otherwise.
- Real app screenshots contain the app's own colours (a green button inside ReviewNudge,
  green and red candles inside the trading card). The site's own palette has no green; no
  screenshot was recoloured to make that look tidier.
- The Fiverr row says "My Fiverr profile" and points at the link from the original brief
  (`fiverr.com/paid_promotions?public_mode=true`). If that is not the profile address, the
  label should change or the link should be dropped. Not verified either way.
- `check.js` counts `<img>`s that carry `width`/`height`; the lightbox `img` is sized by hand
  in the CSS because its source is set by JS.

## NOT TESTED (cannot be done from this sandbox)

- No real Android device. Touch behaviour was measured through an emulated coarse pointer only.
- No Lighthouse score and no frame-rate trace: not available here. Motion was verified by
  checking that only `transform`/`opacity` animate and by reading the computed styles.
- Public response headers (cache-control, content-type) cannot be read over HTTPS from here.
- This branch has not been deployed; nothing here was checked against a live Vercel URL yet.
- The five linked live apps were checked by reading their repos and URLs, not by signing in.
