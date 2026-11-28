# What was tested and what was not

Date: 2026-11-27/28. Branch `arena/60aae8ed-muhammad-ibrahim-portfolio-liv` (rounds 3, 4 and 5, not deployed).
Production still runs `main` = `4d6c8404` at
`https://muhammad-ibrahim-portfolio-live.vercel.app/`.
Everything below was measured in this sandbox against the files in this repo.
The rig lives in `.verify/` (gitignored): a static server, a real headless Chromium
(`puppeteer-core` + `@sparticuz/chromium`), and the checkers `check.js`, `dom-test.js`,
`premium-test.js`, `contrast.js`, `verify.js`, `rm.js`, plus `extra.js` / `seams.js` for the
section PNGs that were looked at by hand.

## ROUND 5 — the monogram, the icons, the frames

Nine fixes, nothing else touched: the MI mark redrawn, words replaced by brand icons, a real
burger, device frames chosen by project type, four equal cards in *More work*, one media system
for Fitness Pro / Chat Bridge / DailyMB, five services instead of six, a back-to-top that
scrolls instead of changing the URL, and equal heights where the boxes were drifting apart.
Ivory and night, the type scale, the hero, the scroll reveal, the prefilled WhatsApp messages,
the wording and the absence of prices are all as they were.

| Fix | What it became, and how it was measured |
|---|---|
| MI monogram | One `<symbol id="mi-tile">` used by the bar (24 px), the hero card (48 px), the footer line (24 px) and `assets/favicon.svg` (993 B). Rounded square, a soft vertical gradient, one inner highlight, one drop shadow — the mirrored reflection under the hero mark is gone with its CSS. Rendered at 24, 48 and 120 px on ivory and on night, and the favicon at 16, 32 and 64, in one PNG, and looked at: `.verify/shots/mi-sizes.png` |
| Icons instead of words | WhatsApp, GitHub and Fiverr are the official paths from Simple Icons 16.38.1 (CC0), inlined as four `<symbol>`s; the email mark is a drawn line envelope. No official green anywhere — the marks inherit ivory or gold. 14 icon buttons: bar 48 px, hero 56 (WhatsApp, gold) + 52, contact 64 ×4, footer 48. Measured: **0 under 48 px, 0 carrying words, 14 with `aria-label` and 14 with a `title`**, focus ring on the bar's WhatsApp button = `2px solid rgb(214, 164, 92)`. Every link is still a real link and every WhatsApp link still opens a prefilled English message |
| The bar | The text pill is gone; the two icon buttons sit at the end of `.bar-in` (not inside `nav`, so they do not inherit the link styling). Measured 838 px of content in the row, so one row only starts at **920**, and the burger + sheet cover everything below it. Bar height 65 px at 1280/920/768 and 61 px at 360/600/700 — at 768 it used to wrap to 105 px |
| Burger | Three 20×2 px lines that fold into an X while the sheet is open (measured `matrix(.707,.707,-.707,.707,0,6)` / `matrix(.4,0,0,1,0,0)` / the mirror of the first), `aria-expanded` true ⇄ false, label "Open menu" ⇄ "Close menu", sheet 323 px with the same 6 links at ≥ 48 px, Esc and an outside click close it, focus goes back to the button, `matchMedia` in the JS listens on the same 920 |
| Device frames | Phone frames (8 px bezel, camera pill, two side buttons, one light edge, `cover` + top) for Mental Maths Practice and Street Food Empire; browser windows (three dots in ivory/gold/navy, a rounded pill with the deployed domain) for ReviewNudge, My English Practice and Blue Peak Store — their captures are portrait, so the windows are narrow "responsive view" ones. 26 slots: 9 phone, 13 browser, 3 extension, 1 wide panel. Measured: the two sides identical at 360/600/700/1280, the middle exactly 8 % larger on both axes (a `scale(1.08)` on its bottom edge, so its base and its shape stay with its neighbours), no tilt anywhere |
| Four equal cards | `align-items:stretch` + `grid-auto-rows:1fr`, the media box a fixed `16/10` at the top, the description clamped to 3 lines, the buttons `margin-top:auto`. Heights 669.9 / 669.9 / 669.9 / 669.9 px at 1280 (media 546×341), 733.6 ×4 at 768 (662×414), 563.1 ×4 at 360 (302×227), and no leftover gap under the button row. The Fitness Pro caption that mentioned prices is gone |
| One media system for the three | Fitness Pro: three `1.25` browser windows, `cover`, cropped from the left so a headline is never cut mid-word. Chat Bridge: a drawn toolbar strip with the extension icon, the three real popups hanging under it, `contain`, equal slots. DailyMB: the one screenshot that shows the app in the middle, and two coded SVG drawings of real README features (the five answers in Short mode, the 30-day history) in the same phone frame and the same box — each labelled "Illustration, not a screenshot", `role="img"` with the drawing described. DaemonCut keeps its "Concept artwork" label. Every frame in every row: same size, `cover` + `object-position:top`, one label under it on a shared line |
| Five services | The "AI-assisted building" row deleted, the remaining five renumbered 01–05, each with its own prefilled message (5 unique of 5 measured). Heading "Five jobs people actually ask for", the hero counter reads 5, `check.js` and this file follow it |
| Back to top | "Back to top" with an up arrow that bobs: `animation:bob 1.6s ease-in-out infinite`, transform-only keyframes, stopped by both `html.lite` and `prefers-reduced-motion`. Click: 5200 → 0 px with the URL still `…/index.html` (no `#top`); a reload at 3990 px stayed at 3990 px with `hash:""`; `history.scrollRestoration` is never mentioned in the JS, asserted |
| Equal height | How-I-work steps 166 / 166 / 166 / 166 at 1280 (174 ×4 at 360), About facts 82.6 ×6 (68.6 ×6 at 360), contact icon buttons 64 ×4 (the Fiverr wordmark is 31 px against the line icons' 28 so the four read the same size), the four tiles and all ten stage rows as above |

| Harness work | Result |
|---|---|
| `check.js` | 67 → **108 assertions, 0 fail**. Added: the media system counted from the file (26 slots / 24 preview links / 9 phone + 13 browser + 3 extension + 1 panel / 5 middle slots / 8 three-up rows), "first shot centred" for the trios that have a middle, icon-button label + title + no-words + 48 px box + focus ring, the burger's classes and its 920 threshold, the X transform, five services numbered with five unique prefills, the four tiles' stretch + `margin-top:auto`, back-to-top (label, 1.6 s, transform-only, lite and reduced-motion both stop it, `preventDefault` + `scrollTo`, no `scrollRestoration`), drawings labelled, the old frame classes absent, no tilt, no prices anywhere, tag balance kept, and that every one of the 30 off-site links carries `target="_blank" rel="noopener"` |
| `premium-test.js` | 24 → **28 checks, 0 fail**. The image test was rewritten for the new system (a screenshot must *cover* its frame and be top- or left-anchored; an uncropped one must keep its own ratio; nothing may spill) and a new test compares the label lines inside every row. The clipped-text test now only looks at boxes that actually clip, and the brand tile is asserted as a 48 px target on a small phone |
| `verify.js` | selectors moved to `.dev` / `.slot` / the label as a sibling: `h-scroll=0`, `small taps: []`, `narrow cols: []`, every stage `minPad≥1`, `cap:ok` on all ten labelled rows, lightbox `{open:true, imgW:420, focus:"lb-box"}`, hover spread live at 40/40 px, all at 360/768/1280 |
| `polish.js` (new) | the round-5 rig: the monogram page, then per width the bar, every icon button's box/icon/label/title, the ten stage rows with each frame's size, ratio, `object-fit`, `object-position`, URL text and label line, the four tiles, the how/steps/facts/services heights, the illustrations, back-to-top, the sheet open and closed, scroll position through a click and a reload, the lightbox, the focus ring — and a PNG per block |
| `shots2.js` / `probe-bar.js` / `probe-cap.js` / `probe-slot.js` (new) | the widths in between (600, 700, 920…) where the row and the sheet change hands, and the measurements behind the two breakpoint fixes |
| `probe-clicks.js` (new) | every button clicked, with the smooth scroll allowed to stop before each measurement: `.svc-go`, the footer icons, the hero icons and text link, the four contact icons, a work button, a *More work* button, a device frame, the footer "Back to top", the brand, the burger. **Nothing moved the page but the two links whose whole job is to scroll** — "See my work" `3976→716` onto `#work`, and Back to top / brand `5200→0` with the URL unchanged. A frame opens the lightbox with the page frozen under it (`moved 0`, `lock=true`); the burger opens the sheet at 5678 px without shifting it; a reload at 2600 px came back at 2600 px with `hash:""`; the main frame never left the page |
| Re-run in full | `check.js` 0/108 · `dom-test.js` 0/32 · `premium-test.js` 0/28 · `verify.js` clean at 360/768/1280 · `contrast.js` 536 still runs + 146 hover runs, **0 under par, worst 5.11:1** · `rm.js` reduced-motion / lite / full at 360 and 1280 all clean · `node --check script.js` clean |
| Weights | `index.html` 58 191 B, `style.css` 43 667 B (< 60 KB), `script.js` 14 085 B (< 25 KB), 24 WebP 453 812 B, 3 WOFF2 69 032 B → ≈ **623.8 KB** (< 750 KB). `images/dailymb-1.webp` and `dailymb-3.webp` were deleted (the green-accented screen and the settings screen); no file in `images/` is unused |
| PNGs looked at | the monogram sheet, the bar at 360/768/1280, the hero at 360/1280, the sheet open at 360, all six Selected-work stages at 1280 and the first two at 360, all four More-work tiles at 1280 and three of them at 360, the services at 1280, contact and footer at 360/1280, the tiles at 768 |

One real defect came out of `probe-clicks.js` and was fixed in the same round: the five
service buttons were the only off-site links on the page without `target="_blank"
rel="noopener"`, so tapping one navigated the portfolio itself away to wa.me. They now open in
their own tab like the other 25 links; the hrefs and the prefilled messages are untouched.


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
- `contrast.js` does not score text inside `aria-hidden="true"` decoration: the marquee's echo
  row of gold separators, and the drawn shapes inside the two DailyMB illustrations. Both are
  hidden from a screen reader. Every run a visitor is asked to read is scored.
- The two DailyMB slots beside the real screenshot are drawings of features the README describes
  (the Short-mode answer list, the 30-day history grid), not captures of the app. Each is
  labelled "Illustration, not a screenshot" and carries a `role="img"` description; the stage
  note says which of the three is real. The old `dailymb-1.webp` (green accents) and
  `dailymb-3.webp` (a settings screen) were deleted rather than kept to fill the row.
- The top bar shows its links in one row from 920 px up and folds them into the sheet below that.
  920 is measured (the row needs 838 px), not a device width; at 768 and 820 the bar therefore
  carries the burger, which is what keeps it one line tall there.
- The brand mark in the bar is a 24 px tile inside a 48 px target on a phone (`check.js` asserts
  both), because below 480 the name next to it is hidden.

## NOT TESTED (cannot be done from this sandbox)

- No real Android device. Touch behaviour was measured through an emulated coarse pointer only.
- No Lighthouse score and no frame-rate trace: not available here. Motion was verified by
  checking that only `transform`/`opacity` animate and by reading the computed styles.
- Public response headers (cache-control, content-type) cannot be read over HTTPS from here.
- Every number above was measured against these files served from this sandbox. The branch does get a
  Vercel preview build (see the PR), but that URL sits behind a Vercel sign-in here, so the
  deployed copy was not re-measured.
- The five linked live apps were checked by reading their repos and URLs, not by signing in.
