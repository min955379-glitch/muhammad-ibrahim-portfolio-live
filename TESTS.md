# What was tested and what was not

Date: 2026-11-27/28. Branch `arena/60aae8ed-muhammad-ibrahim-portfolio-liv` (rounds 3 and 4, not deployed).
Production still runs `main` = `4d6c8404` at
`https://muhammad-ibrahim-portfolio-live.vercel.app/`.
Everything below was measured in this sandbox against the files in this repo.
The rig lives in `.verify/` (gitignored): a static server, a real headless Chromium
(`puppeteer-core` + `@sparticuz/chromium`), and the checkers `check.js`, `dom-test.js`,
`premium-test.js`, `contrast.js`, `verify.js`, `rm.js`, plus `extra.js` / `seams.js` for the
section PNGs that were looked at by hand.

## ROUND 4 — colour revert + the Honest note removed

Two changes only: the page went back to `main`'s colour layout (ivory bands, `band-2`
one shade deeper, night kept for the hero / the tool strip / contact / footer, dark stages
kept inside them), and the `Honest note` panel in *How I work* was deleted along with its CSS.
Everything above was re-run against the new files, and `contrast.js` was rewritten to sample
the real painted pixels instead of reading `background-color` (a dark stage sitting on an
ivory band is invisible to a background-colour guess).

| Re-run after the revert | Result |
|---|---|
| `check.js` | 0 fail / 67 pass (added: band classes, `.band` before `.band-2`, page ground, no `.honest` left, tag balance for `div`/`section`/`ul`/`li`/`a`/`figure`, and "no ivory literal paints on a light band") |
| `dom-test.js` | 0 fail / 32 pass — `#work`/`#services`/`#about` measured as `rgb(246,241,231)`, `#more`/`#process` as `rgb(239,232,217)`, hero/contact/marquee/footer as `rgb(11,18,32)`, each `.stage` still its own dark gradient, no stray node in a trio, lightbox + focus trap + Esc, nothing under 44 px |
| `premium-test.js` | 0 fail / 24 pass — type ramp steps up (16 → 19 → 24 → 34 → 54.4 → 120.3 px at 1280), no clipped line, no layout property transitioned, hover feedback ≤ 400 ms, media and text never collide, bands flush with a hairline between |
| `contrast.js` | 591 still runs at 360/768/1280 (188 / 200 / 203) + 171 hover runs: **0 under par, worst 5.11:1**. 21 runs skipped because a clip box or a masked band cuts them, 2 too tall for one strip, 98 runs inside `aria-hidden` decoration excluded (the mirrored MI reflection and the marquee's echo — listed under Known warnings) |
| `verify.js` | h-scroll 0 px at all three widths; every preview `fill100%/92-94%`, `minPad≥1`, `noteGap≥8`; all ratios 0.996–1.004; `small taps=[]`, `narrow cols=[]`; name slack 0 / clip 0 at 43.9, 72.2, 120.3 px; lightbox `{open:true, imgW:420, focus:"lb-box", body:"hidden"}`; hover spread 25/25 |
| `rm.js` | reduced-motion / lite / full × 360 and 1280: all clean, no item left faded or shifted (the walker now waits for the reveals, which is how the two "faded work-item" lines were shown to be a test artefact, not a page bug) |
| Weights | `index.html` 43 827 B, `style.css` 41 074 B (< 60 KB), `script.js` 13 494 B (< 25 KB), 26 WebP 472 006 B, 3 WOFF2 64 936 B → ≈ 620.4 KB (< 750 KB) |
| Eyes on PNGs | hero, both work rows, the tool strip joining two ivory bands, "More work" tiles, services, "How I work", about, contact, footer at 360 and 1280, plus tiles at 768 — the dark stages, the light-glass sticky bar over ivory, the dark ink tags and the gold-button ink were each checked in the picture, not only in numbers |
| One real bug the revert exposed | over an ivory band the sticky bar turns light, and `.bar.is-day .nav a` also recoloured the gold WhatsApp pill to translucent navy — 3.93:1. The pill now keeps solid `--night` ink in both states (`style.css`): re-measured at 8.31:1 over ivory, 9.70:1 on its hover gold, and the hover pass then ran clean at every width. |

## TESTED (measured, tool named)

| Check | Result | How |
|---|---|---|
| Static rules: no prices, no reviews/awards, no green in the CSS, no `cursor:none`, honest wording kept, no leftover placeholders | 0 fail / 67 pass | `node .verify/check.js` |
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
| Contrast | see round 4: the current harness samples the painted pixel under every text run, still and under hover | `contrast.js` |
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
- `contrast.js` does not score text inside `aria-hidden="true"` decoration: the mirrored "MI"
  reflection under the hero monogram (1.89:1 by design — it is a reflection, not a message) and
  the marquee's echo row of gold separators. Both are hidden from a screen reader and both were
  left as they were on `main`. Every run a visitor is asked to read is scored.

## NOT TESTED (cannot be done from this sandbox)

- No real Android device. Touch behaviour was measured through an emulated coarse pointer only.
- No Lighthouse score and no frame-rate trace: not available here. Motion was verified by
  checking that only `transform`/`opacity` animate and by reading the computed styles.
- Public response headers (cache-control, content-type) cannot be read over HTTPS from here.
- This branch has not been deployed; nothing here was checked against a live Vercel URL yet.
- The five linked live apps were checked by reading their repos and URLs, not by signing in.
