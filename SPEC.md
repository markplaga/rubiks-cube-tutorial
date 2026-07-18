# Build Prompt: "CUBED" — Interactive 3D Rubik's Cube Tutorial Web App

## The Prompt (paste this, with the rest of this document attached)

Build me a complete, single-file HTML web application called **CUBED** — an interactive 3D Rubik's Cube tutorial site — exactly to the specification below. The entire app must be one `index.html` file (inline CSS and JavaScript) suitable for hosting on GitHub Pages. Do not use any build tools, frameworks, or bundlers. Implement every feature in this document; the Acceptance Checklist at the end is the definition of done. Where the spec gives exact values (colors, algorithms, slider ranges, theme parameters), use them exactly.

---

## 1. Overview

CUBED is a full-screen web page centered on a live, animated 3D Rubik's Cube. Users can orbit and zoom around the cube, turn its faces with buttons or keyboard, scramble and reset it, follow an 8-step beginner solving tutorial with playable algorithms, play 25 classic decorative patterns from a dropdown with an adjustable delay between moves, control an auto-spin, switch between four visual environment themes, and open Tech and Help information overlays. It must work beautifully on both desktop and mobile — including inside in-app browsers (e.g., Facebook Messenger's WebView).

## 2. Technology constraints

- **One file**: all HTML, CSS, and JS inline in `index.html`.
- **Three.js r128** loaded from cdnjs: `https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js`. Do NOT use OrbitControls or any Three.js examples/addons — write custom camera controls.
- **Google Fonts**: `Chakra Petch` (weights 500/600/700) for display/notation/UI labels and `Sora` (300/400/600) for body text, with sans-serif fallbacks.
- No localStorage/sessionStorage. No external images — all textures generated at runtime via canvas.
- WebGL renderer with `alpha: true` (transparent clear) so a CSS gradient on `<body>` provides the backdrop. Antialiasing on. `setPixelRatio(min(devicePixelRatio, 2))`. Shadow mapping enabled with `PCFSoftShadowMap`.

## 3. Page layout

- **Full-screen canvas** (`#stage`): `position: fixed; inset: 0; width: 100%; height: 100%; display: block; touch-action: none;` cursor `grab`, `grabbing` while dragging.
- **Header** (top, fixed): left — brand "CUBED" in Chakra Petch 700, letter-spaced, with the letter "B" in the accent color, plus a small uppercase tagline "a hands-on solving guide" (hidden on mobile). Right — theme switcher pills: Nebula, Synthwave, Daylight, Ember (active pill highlighted in accent).
- **Right-side button rail** (`#rail`, fixed under the header on the right): four stacked pill buttons — **GUIDE**, **CONTROLS**, **TECH**, **HELP**. Each lights up in the accent color when its target is visible/open.
- **Tutorial panel** (`#panel`): desktop — fixed right side, width 378px, sitting to the LEFT of the rail (right offset ≈ 134px), spanning from below the header to above the deck; frosted-glass card with rounded corners. Mobile — becomes a bottom sheet (left/right 12px, max-height 46vh). Slides off-screen with a smooth transform when hidden.
- **Control deck** (`#deck`, fixed bottom-center): a frosted-glass bar containing, left to right with thin vertical separators: (a) a 6×2 grid of the twelve move buttons U U' L L' F F' / R R' B B' D D'; (b) SCRAMBLE and RESET buttons side by side in one row; (c) a "patterns" column with the pattern dropdown on top and two labeled slider rows beneath (Delay, Spin). On mobile the deck wraps: the patterns column moves to the top at full width (select full-width, the two slider rows side by side at ~45% each), move buttons shrink.
- **Sequence readout** (`#seq`): fixed, centered horizontally, floating just above the deck. Hidden by default.
- **Move HUD** (`#hud`): fixed top-center; flashes the current move token (e.g., `R'`, `U2`, `M2`) in large Chakra Petch accent-colored text with a soft glow for ~0.5s per move.
- **Hint** (bottom-left, desktop only): small muted text — "**Drag** anywhere to orbit the cube · **Scroll** to zoom · Tap a move button to turn a face".
- **Overlays**: two full-screen modal overlays (Tech, Help) — dimmed blurred backdrop, centered scrollable glass "sheet" max-width 720px, max-height 84vh, with a ✕ close button.

Aesthetic: dark glassmorphism — translucent panels (`backdrop-filter: blur`), 1px subtle borders, rounded corners (~12–20px), muted secondary text, one accent color that changes with the theme via CSS custom properties (`--accent`, `--accent-soft`, `--glass`, `--text`, `--muted`, etc.). The Daylight theme flips the UI to light glass with dark text.

## 4. The 3D scene

- **Camera**: PerspectiveCamera, FOV 38, looking at the origin. Position derived from spherical coordinates `{theta, phi, dist}`; initial `theta ≈ 0.72, phi ≈ 1.12, dist ≈ 10.5`. Clamp `phi` to [0.25, π−0.35] and `dist` to [6, 16].
- **Custom orbit controls** via Pointer Events: pointerdown/move/up drag rotates theta/phi (~0.0055 rad per pixel). Mouse wheel zooms (`dist += deltaY * 0.006`, preventDefault). Two-finger touch pinch zooms.
- **Lights**: HemisphereLight + directional key light (position ~(6,9,6), casts a 1024px shadow map with a tight ortho frustum) + colored rim DirectionalLight from behind (~(−7,3,−6)) + low AmbientLight. All colors/intensities are theme-driven (see §8).
- **Ground shadow**: a large plane at y ≈ −3.1 with `ShadowMaterial` (opacity theme-driven) to catch the key light's soft shadow.
- **Starfield**: ~900 points on a large random spherical shell (biased upward), small size, transparent; opacity theme-driven; slowly rotates (~0.008 rad/s).
- **Synthwave grid**: `GridHelper(120, 60)` in magenta/purple at y = −3.1, transparent; opacity theme-driven (0 except in Synthwave).

### Critical sizing requirement (hard-won lesson — do not skip)
The canvas must be sized by CSS (`width:100%; height:100%`) and the renderer buffer must be set with `renderer.setSize(w, h, false)` (never letting Three.js write inline style sizes). Read `canvas.clientWidth/clientHeight` (fallback `window.innerWidth/Height`). Re-check the size **every animation frame** and on `resize`, `orientationchange` (delayed ~200ms), and `visualViewport` resize events, resizing the buffer and camera aspect only when it changed. Without this, high-DPI phones and in-app browsers (Messenger WebView) render the canvas at 2× intrinsic size and the cube appears pushed off into the bottom-right corner.

## 5. The cube

- **27 cubies**: `BoxGeometry(0.97)` meshes on a 3×3×3 grid with spacing `SP = 1.06` between centers (the gap creates the black grid lines). All cubies live in a `cubeGroup` at the origin; all cast shadows.
- **Sticker colors** (standard scheme): Up white `0xf6f7fb`, Down yellow `0xffd500`, Front green `0x00b74a`, Back blue `0x0057d8`, Right red `0xe0271b`, Left orange `0xff7a00`.
- **Sticker textures**: generated once per color on a 256×256 canvas — near-black background (`#0a0b10`), an inset rounded-rectangle (≈22px inset, ≈42px radius) filled with a diagonal gradient from the color to a slightly darker shade, plus a soft white sheen gradient across the top half. Used as `CanvasTexture` on `MeshStandardMaterial` (roughness ≈ 0.32). Interior faces use a plain dark standard material. Assign per-face materials in Three.js order (+x, −x, +y, −y, +z, −z) based on the cubie's grid position — only outward faces get stickers.
- `buildCube()` clears and rebuilds all 27 cubies in the solved state (this is what RESET calls).

## 6. Move engine

- **Notation supported**: face turns `U D L R F B`, slice turns `M E S`, whole-cube rotations `x y z` (lowercase); each token may carry `'` (counter-clockwise) and/or `2` (half turn), e.g. `R`, `R'`, `U2`, `M2`, `x'`.
- **Move table** (axis, layer coordinate, base direction sign for a clockwise turn):
  - U: y, +1, −1 · D: y, −1, +1 · R: x, +1, −1 · L: x, −1, +1 · F: z, +1, −1 · B: z, −1, +1
  - M: x, 0, +1 (follows L) · E: y, 0, +1 (follows D) · S: z, 0, −1 (follows F)
  - x: x, ALL, −1 (like R) · y: y, ALL, −1 · z: z, ALL, −1
- **Animation**: to perform a move, reset an invisible pivot `Group` at the origin, `pivot.attach()` every cubie whose position on the move's axis matches the layer (|pos − layer·SP| < 0.4; ALL takes every cubie), then tween `pivot.rotation[axis]` from 0 to `(π/2) × (2 if double) × dir × (−1 if prime)` using requestAnimationFrame and an **ease-out cubic** curve. Base duration ~260ms (buttons/tutorial ≈ this, patterns 300ms, scramble 130ms); double turns take 1.6×. A `2` move is ONE smooth 180° motion, not two 90° snaps.
- **Snap on completion**: re-`attach()` each cubie back to the cubeGroup, round each position component to the nearest multiple of SP, and snap orientation by extracting Euler angles from the quaternion and rounding each to the nearest π/2, then writing back. This prevents any floating-point drift ever accumulating.
- **Queue**: all moves flow through a FIFO queue of items `{t, speed, pattern?, idx?, last?}`. A pump function starts the next item only when nothing is animating. Manual button presses, keyboard, tutorial algorithms, scramble, and patterns all enqueue.
- **HUD**: every move start flashes its token in the HUD for ~0.5s.
- **Scramble**: 22 random face turns (faces U D L R F B only, never the same face twice in a row, each randomly prime or not), played fast (130ms).
- **Reset**: clears the queue, waits for any in-flight animation to end, then rebuilds the cube solved. Also hides the sequence readout.
- **Keyboard**: pressing U/D/L/R/F/B performs that move; holding Shift makes it prime. Escape closes an open overlay if any, otherwise toggles the tutorial panel.
- **Reduced motion**: if `prefers-reduced-motion: reduce`, drop the base move duration to ~80ms.

## 7. Auto-spin control

A "Spin" slider (range −1 to +1, step 0.05, default 0.1) controls continuous camera orbit: every frame, `theta += dt × sliderValue × 0.6` — but never while the user is dragging. Negative = counter-clockwise, positive = clockwise, 0 = stopped. The value label shows direction and magnitude (e.g., `◂ 0.5`, `0.3 ▸`, `off` at zero). The spin continues during move animations and pattern playback (it's camera-only, so it never affects move correctness).

## 8. Themes

Four themes selectable from the header pills; **Nebula** is the default. Switching a theme must:
1. Set `data-theme` on `<body>` (CSS gradient backgrounds transition ~1.1s) and update the CSS custom properties `--accent` / `--accent-soft` (and, for Daylight, light-mode glass/text variables via the attribute selector).
2. Smoothly **tween the 3D scene** over ~1s (ease-out): hemisphere sky/ground colors and intensity, key light color/intensity, rim light color/intensity, ambient intensity, star opacity, grid opacity, ground-shadow opacity — lerping colors and numbers from current to target.

Exact theme targets:

| Theme | Body background | Accent | Hemi (sky/ground/int) | Key (color/int) | Rim (color/int) | Amb | Stars | Grid | Shadow |
|---|---|---|---|---|---|---|---|---|---|
| Nebula | radial deep indigo → near-black (`#1b2050 → #0b0d1f → #05060f`) | `#59e3ff` | `0xbfd6ff` / `0x10121f` / 0.85 | `0xffffff` / 0.95 | `0x59e3ff` / 0.6 | 0.22 | 0.9 | 0 | 0.22 |
| Synthwave | linear `#0b021a → #2a0b45 → #ff2e88` | `#ff4fa3` | `0xff9ad5` / `0x1a0530` / 0.7 | `0xffd1ec` / 0.85 | `0x00e5ff` / 0.85 | 0.2 | 0.35 | 0.55 | 0.3 |
| Daylight | radial light `#f4f6fa → #dde3ee → #c3ccdd` (light UI: dark text, light glass) | `#2456e6` | `0xffffff` / `0xb9c2d6` / 1.0 | `0xfff6e8` / 1.05 | `0x9db7ff` / 0.35 | 0.5 | 0 | 0 | 0.16 |
| Ember | radial `#3b1408 → #1c0805 → #0b0302` | `#ffb54d` | `0xffd2a1` / `0x2a0d05` / 0.75 | `0xffbe8a` / 1.05 | `0xff5a2b` / 0.7 | 0.18 | 0.25 | 0 | 0.34 |

## 9. Solving tutorial (GUIDE panel)

A step navigator: header shows "STEP n / 8" plus 8 small progress tick bars (filled through the current step) and a ✕ close; scrollable body; footer with "◂ Back" and a primary "Next ▸" (on step 8 the button reads "Start over" and loops to step 1). Algorithm blocks render each token as a notation chip plus a "▶ Play" button that enqueues the algorithm on the live cube from its current state. Clicking Play must work for every algorithm block, including ones embedded mid-step.

The 8 steps (titles, teaching content in this spirit, and these exact algorithms):
1. **Meet your cube** — centers never move (white opposite yellow, green opposite blue, red opposite orange); notation explainer (letters = faces, plain = clockwise facing that side, `'` = counter-clockwise). Warm-up algorithm: `R U R' U'` with a note that six repetitions return a solved cube to solved.
2. **The white cross** — white center up; place the 4 white edges matching side colors to centers; teach the "daisy" trick (white edges around the yellow center first, then match each petal's side color to its center and turn that face twice). Demo algorithm: `F2` (dropping a matched petal into place).
3. **White corners** — find a white corner in the bottom layer, park it directly below its slot, hold that slot front-right, repeat `R' D' R D` (1–5 times) until it pops in white-side-up; note about ejecting wrongly-placed top-layer corners.
4. **Middle layer edges** — flip white down; find a top-layer edge with no yellow, match its front color to a center; if it belongs right: `U R U' R' U' F' U F`; if left: `U' L' U L U F U' F'`; note about ejecting a wrongly-seated edge by running either algorithm.
5. **The yellow cross** — dot → L → line → cross using `F R U R' U' F'` (hold an L back-left or a line horizontal; repeat up to three times).
6. **Line up the yellow edges** — rotate U until ≥2 edges match centers; adjacent matches at back and right; run the Sune `R U R' U R U2 R'`, repeat as needed.
7. **Place the yellow corners** — cycle corners with `U R U' L' U R' U' L`, holding a correct corner front-right (run once from anywhere if none are correct), repeat until all are positioned.
8. **Twist the last corners** — with an unsolved corner front-right-top, repeat `R' D' R D` (2 or 4 times) until its yellow faces up; then turn ONLY the U face to bring the next corner in (never rotate the whole cube); reassure that the cube looks broken until the final twist. Celebrate.

## 10. Pattern gallery

A `<select>` in the deck with placeholder option "✦ Pattern gallery…" and these 25 patterns (exact names and move sequences):

1. Checkerboard — `U2 D2 F2 B2 L2 R2`
2. Six Spots — `U D' R L' F B' U D'`
3. Crosses (4 Crosses) — `B2 F2 D' L2 R2 U2 B2 F2 U' R D2 L2 R2 U2 R'`
4. Cube Inside a Cube — `F L F U' R U F2 L2 U' L' B D' B' L2 U`
5. Cube in Cube in Cube — `U' L' U' F' R2 B' R F U B2 U B' L U' F U R F'`
6. Four Centers — `F2 B2 U D' R2 L2 U D'`
7. Broad Stripes / Pillars — `L2 R2 B2 F2`
8. Vertical Stripes — `F U F R L2 B D' R D2 L D' B R2 L F U F`
9. Horizontal Stripes — `x F U F R L2 B D' R D2 L D' B R2 L F U F x'`
10. Checker Zigzag — `R2 L2 F2 B2 U F2 B2 U2 F2 B2 U`
11. Anaconda — `L U B' U' R L' B R' F B' D R D' F'`
12. Python — `F2 R' B' U R' L F' L F' B D' R B L2`
13. Black Mamba — `R D L F' R L' D R' U D' B U' R' D'`
14. Green Mamba — `R D R F R' F' B D R' U' B' U D2`
15. Union Jack — `U F B' L2 U2 L2 F' B U2 L2 U`
16. Superflip — `U R2 F B R B2 R U2 L B2 R U' D' R2 F R' L B2 U2 F2`
17. Crosses on Every Face — `U2 R2 L2 F2 B2 D2 L2 R2 F2 B2`
18. Six T-Shapes — `F2 R2 U2 F' B D2 L2 F B`
19. Plus-and-Minus — `U2 R2 L2 U2 R2 L2`
20. Christmas Tree / Gift Box — `U B2 R2 B2 L2 F2 R2 D' F2 L2 B F' L F2 D U' R2 F' L' R'`
21. Flower Pattern — `L' R U D F B' R L' M2 E2 S2`
22. Twisted Peaks — `F B' U F U F U L B L2 B' U F' L U L' B`
23. Wire Pattern — `R L F B R L F B R L F B R2 B2 L2 R2 B2 L2`
24. Spiral Pattern — `L' B' D U R U' R' D2 R2 D L D' L' R' F U`
25. Opposite Corners — `R L U2 F2 D2 F2 R L F2 D2 B2 D2`

Behavior on selection (fires on the `change` event, i.e., when the user picks and releases):
- **Cumulative playback**: the pattern plays from the cube's CURRENT state — it must NOT reset the cube first. Users stack patterns deliberately; RESET is the only way back to solved.
- If moves are already animating or queued, the new pattern **waits** until the queue fully drains, then starts (poll ~every 40ms). It never cancels or interleaves with what's running.
- The select immediately returns to its placeholder value and blurs, so the same pattern can be chosen again back-to-back.
- **Sequence readout**: the pattern's name (small uppercase accent label) and every move token appear as chips in the `#seq` strip above the deck. As each move plays: the current chip highlights (accent background, slight scale-up), completed chips stay tinted (accent-soft), upcoming chips stay muted. When the last move finishes, all chips show completed. The strip persists until the next scramble/reset (both hide it).
- **Delay between moves**: the "Delay" slider — range **0.25s to 5s, step 0.25s, default 1s** — inserts that pause AFTER each pattern move before the next starts (no delay after the final move). Read the slider live at each step so dragging it mid-pattern changes the remaining pacing. The value label shows e.g. `0.25s`, `1s`, `2.5s`. The delay applies only to pattern playback, not to button presses, tutorial algorithms, or scramble.
- Move animation speed within patterns: 300ms per quarter turn (1.6× for doubles).

## 11. Rail buttons and overlays

- **GUIDE** — toggles the tutorial panel (slide animation). The panel's own ✕ also hides it. Button reflects state.
- **CONTROLS** — toggles visibility of the entire control deck (a body-level class). While the deck is hidden, the sequence readout (if visible) drops to the bottom of the screen. Hiding both panel and deck yields a clean full-screen cube view.
- **TECH** — toggles a detailed "Under the Hood" overlay explaining, in plain but substantive language, every technology in the app: Three.js/WebGL and the perspective camera; the 27-cubie construction; runtime canvas-painted sticker textures; the pivot-group face-turn technique and quaternion snapping; requestAnimationFrame and ease-out cubic motion; the move queue; the four-light rig, PCF soft shadow mapping, points starfield, and grid; theme interpolation; the no-framework HTML/CSS UI (custom properties, backdrop-filter glass, flexbox/grid, media queries); Google Fonts; Pointer Events, wheel and pinch input; and single-file GitHub Pages hosting with cdnjs delivery.
- **HELP** — toggles a "How to Use CUBED" overlay documenting every feature: orbit/zoom/spin; the twelve move buttons and full notation (letters, `'`, `2`, slices M/E/S, rotation x) plus keyboard shortcuts; Scramble and Reset; the pattern gallery including cumulative behavior, the waiting rule, the sequence readout, and the 0.25–5s delay slider; the 8-step solving guide and its Play buttons; the four themes; and the rail buttons themselves.
- Opening one overlay closes the other. Each closes via its ✕, clicking the dimmed backdrop, pressing its rail button again, or Escape. Rail buttons show accent "on" state while open.

## 12. Responsive behavior (≤880px)

Panel becomes a bottom sheet; rail moves to top-right with narrower buttons; hint hidden; deck wraps with the patterns column first at full width; move buttons shrink to ~38×34px; sequence strip sits higher to clear the taller deck; overlay sheets get tighter padding; theme pills compress; tagline hidden.

## 13. Quality bar

- No console errors. Valid HTML. All interactive elements have visible hover/active states; sliders use `accent-color`.
- The cube must be perfectly centered in the viewport on any screen, any DPI, any orientation, including in-app browsers (see §4's sizing requirement).
- Move mechanics must be flawless: after arbitrarily many moves, patterns, and scrambles, stickers align exactly to the grid with no drift, and RESET always yields a perfect solved cube.
- Playing any tutorial algorithm 6× (for `R U R' U'`) or 2×/3× (self-inverse patterns like Checkerboard from solved) must return the cube to its prior state — use this to verify move-direction correctness for every face, slice, and rotation, primes included.
- 60fps target on a mid-range phone.

## 14. Acceptance checklist

- [ ] Single index.html; loads with no errors; Three.js r128 from cdnjs; fonts load with fallbacks
- [ ] Cube renders centered; drag-orbit, wheel zoom, pinch zoom all work; phi/dist clamped
- [ ] 12 move buttons + keyboard (Shift = prime) animate correct faces/directions; HUD flashes tokens
- [ ] Doubles (X2) animate as one 180° motion; M/E/S and x/y/z moves work
- [ ] Scramble = 22 fast random face turns, no repeats back-to-back; Reset restores solved instantly and clears the sequence strip
- [ ] 8 tutorial steps with exact algorithms; every ▶ Play works; Back/Next/Start-over and progress ticks work; ✕ hides panel
- [ ] All 25 patterns present with exact sequences; selection plays cumulatively from current state; re-selecting the same pattern works; concurrent selection waits for the queue to drain
- [ ] Sequence readout shows name + chips with now/done highlighting; persists until scramble/reset
- [ ] Delay slider 0.25–5s step 0.25 default 1s; live-adjustable mid-pattern; applies only between pattern moves
- [ ] Spin slider −1…+1 controls direction and speed; 0 stops; paused while dragging; runs during playback
- [ ] Four themes with exact palettes; scene lighting/stars/grid/shadow tween smoothly ~1s; UI accent updates everywhere
- [ ] Rail: GUIDE and CONTROLS toggle their targets with lit state; TECH and HELP overlays open/close via button, ✕, backdrop, and Escape; opening one closes the other
- [ ] Mobile layout per §12; canvas stays centered in Messenger/other WebViews
- [ ] Reduced-motion preference speeds up move animations
