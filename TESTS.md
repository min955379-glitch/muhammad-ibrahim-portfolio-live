# What was tested and what was not

Date: 2026-11-27. Host: Vercel project `muhammad-ibrahim-portfolio-live`,
production alias `https://muhammad-ibrahim-portfolio-live.vercel.app/`.
Checks run in this sandbox against the files in this repo, plus the live URL after deploy.

## TESTED (measured, tool named)

| Check | Result | How |
|---|---|---|
| Static rules: no green, palette-only gradients, no prices, no testimonials/awards/"years of experience", no emoji, honest wording kept | 0 failures (1 warning, see below) | `node check.js` |
| Weight | HTML 39.0 KB, CSS 33.9 KB, JS 12.8 KB; fonts 63.4 KB, images 438.7 KB; whole payload 654-702 KB (budget 750); first visit incl. 3 eager screenshots 227.4 KB (budget 250) | `check.js` + `du`/`ls -l` |
| CSS budget < 60 KB, JS budget < 25 KB | pass | `check.js` |
| Every screenshot link is a real file, every preview is a `figure` + `figcaption` | 15 phone previews + 2 wide shots, 0 links without an image | `check.js` + a jsdom parse |
| Real browser layout at 1280x800, 768, 360 | no horizontal scroll at any width (0 px) | headless Chromium (`audit.js`) |
| Phone trio: all three screenshots visible, none stretched, none clipped | stage 629x402 (1280) / 704x439 (768) / 328x288 (360); middle phone 185x306 / 208x345 / 128x199; side phones 88% of the middle; `clipped=0px`, `unloaded=0`, aspect ratio of every `img` content box within 0.5% of the file's own ratio | `audit.js` + `clip.js` ratio probe |
| Captions and the note line never collide or run out of the panel | smallest gap measured: 5 px (desktop), 2-14 px (360); 0 captions outside the stage | `clip.js` |
| Hover on a real mouse: the two side phones open up and one sheen crosses the middle phone | side phones move 10 px, sheen runs once (620 ms); transform/opacity only | `audit.js` + `hover.js` |
| Lightbox | opens with `role=dialog`, `aria-modal`, focus moves in, Esc closes and focus returns to the trigger, page scroll locks | `audit.js` |
| Scroll-spy | highlights the section you are actually in (rect-based), and the last section at page bottom | `audit.js` |
| Sticky bar | flips to day colours past the hero; 6 links + WhatsApp fit from 768 up with no overflow | `audit.js` |
| Menu sheet on a phone | button visible below 768, sheet 323 px tall, 6 links all >= 48 px, scroll lock, `aria-expanded` flips, Esc closes, focus starts on "Work", tab traps inside the sheet, inert at desktop width, sheet fully opaque (no bleed-through) | `dom-test.js` + `menu.js` in Chromium |
| `prefers-reduced-motion` and lite mode | aurora/marquee/word-animations stopped, 0 items left hidden, custom cursor off, native cursor never hidden | `audit.js` (reduced viewport) + jsdom runs |
| Tap targets >= 48 px, body text 16 px, no text column under 28ch | `small=[]`, `narrow=[]`, body 16 px, h2 38.4/25.6 px | `audit.js` |
| Contrast, each text measured over what is really behind it | all 46 groups >= 4.5:1 (worst 5.11:1) | `contrast2.js` (headless Chromium) |
| Hero name | two whole-word spans, `white-space:nowrap`, "Muhammad" on line 1 / "Ibrahim" on line 2 at 1280, 768 and 360 | `audit.js` |
| Images honest | 19 WebP files, 620x1034-1262 phone shots + 2 wide previews, all `width`/`height` attributes equal to the file's real size, `alt` text on all, lazy except the 3 above the fold | `identify` + `check.js` |
| JS syntax | `node --check script.js` clean; no console error in mobile/desktop/reduced jsdom runs | node + VirtualConsole |
| Screenshots actually looked at by hand | hero, all six work rows, "More work", and the open menu at 1280 / 768 / 360 | PNG crops from `shots.js`, `items.js`, `menu.js` |

## KNOWN WARNINGS

- `backdrop-filter` is used on the sticky bar and the glass cards. It is turned off in lite
  mode (reduced motion, coarse pointer, data-saver, 2 GB-class devices) and there is a
  `@supports` fallback for browsers without it. `check.js` warns about it on purpose.
- The BluePeak Terminal preview is a screenshot of a trading UI, so it contains green and red
  candlesticks inside the picture. The page's own palette has no green. The project's own
  caption says it "places no trades and gives no advice".
- The Blue Peak Store bag screenshot is cropped so that prices are off-frame. Nothing is
  blurred or painted over.

## NOT TESTED (cannot be done from this sandbox)

- No real Android device. Touch behaviour was measured through emulated coarse pointers only.
- No Lighthouse score and no frame-rate trace: not available here. Motion was verified by
  checking that only `transform`/`opacity` animate, and by watching the screenshots.
- Public `.webp` response headers (cache-control) cannot be read over HTTPS from here.
- Not installed in this session: Impeccable, the Vercel design-guidelines MCP, Chrome DevTools MCP.
- The 5 live apps were checked by reading the repos and the deployed URLs, not by signing in
  (BluePeak Terminal sits behind a login, and the page says so instead of showing a fake demo).
