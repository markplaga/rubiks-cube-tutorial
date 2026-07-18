# CUBED — Interactive 3D Rubik’s Cube Tutorial Web App

## Status

This is the canonical specification for the current CUBED application. It includes the original build requirements plus later additions: 20 alternate cube palettes, live recoloring, automatic control hiding after pattern selection, an always-available animated SOLVE engine, comprehensive Help content, and GitHub Pages publishing.

The application itself must remain a single `index.html` file with inline CSS and JavaScript. Repository support files such as `SPEC.md` and `.nojekyll` are allowed.

## 1. Overview

CUBED is a full-screen, responsive Three.js Rubik’s Cube tutorial. Users can orbit and zoom, turn faces with buttons or keyboard, scramble, automatically solve, and reset, follow an eight-step beginner guide with playable algorithms, play 25 cumulative decorative patterns, adjust pattern delay and camera spin, switch among four visual environments, change all six cube colors through named palettes, hide interface panels for a clean view, and open Tech and Help overlays.

It must work on desktop, mobile, high-DPI devices, orientation changes, and in-app browsers.

## 2. Technology

- One application file: `index.html`, with all CSS and JavaScript inline.
- Three.js r128 from `https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js`.
- No OrbitControls, examples, add-ons, frameworks, bundlers, or build step.
- Google Fonts: Chakra Petch 500/600/700 and Sora 300/400/600, with sans-serif fallbacks.
- No `localStorage` or `sessionStorage`.
- No external images; generate sticker textures with canvas.
- Renderer: `alpha: true`, antialiasing, transparent clear, pixel ratio capped at 2, shadows enabled, `PCFSoftShadowMap`.

## 3. Interface

- `#stage`: fixed full-screen canvas, CSS-sized at 100% width/height, `touch-action:none`, grab/grabbing cursor.
- Header: CUBED brand with accented B, mobile-hidden tagline, and Nebula/Synthwave/Daylight/Ember pills.
- Rail: GUIDE, CONTROLS, TECH, HELP; active styling must reflect state.
- Guide panel: desktop right-side glass card; mobile bottom sheet; smooth hide/show.
- Control deck:
  - Twelve move buttons: `U U' L L' F F' R R' B B' D D'`.
  - SCRAMBLE, SOLVE, and RESET.
  - Pattern Gallery and Color Palette dropdowns side by side.
  - Delay and Spin sliders.
- `#seq`: pattern or AUTO SOLVE name and move-chip readout above the deck; moves down when controls are hidden.
- `#hud`: top-center current-move flash for about 0.5 seconds.
- Desktop hint: drag to orbit, scroll to zoom, tap a move button.
- Tech and Help: full-screen modal overlays with dimmed backdrop, scrollable glass sheet, and ✕.
- Dark glassmorphism by default; Daylight uses light glass and dark text.

## 4. Scene and camera

- Perspective camera, FOV 38, looking at origin.
- Initial spherical state approximately `theta=.72`, `phi=1.12`, `dist=10.5`.
- Clamp phi to `[.25, π-.35]` and distance to `[6,16]`.
- Pointer drag changes theta/phi about `.0055` radians per pixel.
- Wheel zoom: `dist += deltaY * .006`, with `preventDefault()`.
- Two-finger pinch zoom.
- Hemisphere, key directional, rim directional, and ambient lights.
- Key near `(6,9,6)`, 1024 shadow map; rim near `(-7,3,-6)`.
- Shadow plane at approximately `y=-3.1`.
- About 900 star points, slowly rotating at about `.008 rad/s`.
- `GridHelper(120,60)` at `y=-3.1`, visible only in Synthwave.

### Critical sizing

CSS controls displayed canvas size. Use `renderer.setSize(w,h,false)`. Read `stage.clientWidth/clientHeight` with viewport fallbacks. Recheck every render frame and on `resize`, delayed `orientationchange`, and `visualViewport.resize`. Update buffer and camera only when dimensions change.

## 5. Cube and stickers

- 27 `BoxGeometry(.97)` cubies on a 3×3×3 grid.
- Center spacing `SP=1.06`.
- All cubies belong to `cubeGroup` and cast shadows.
- Standard slots:
  - U/white `#F6F7FB`
  - D/yellow `#FFD500`
  - B/blue `#0057D8`
  - F/green `#00B74A`
  - R/red `#E0271B`
  - L/orange `#FF7A00`
- Sticker texture: 256×256 runtime canvas, `#0A0B10` surround, rounded inset, diagonal color shading, top sheen; MeshStandardMaterial roughness about .32.
- Only outward faces get sticker materials, using Three.js face order `+x,-x,+y,-y,+z,-z`.
- `buildCube()` rebuilds solved geometry using the currently active shared sticker materials.

## 6. Color palettes

The palette selector begins with Standard Rubik’s and then the 20 numbered alternates. Slot order is fixed:

1. White → U
2. Yellow → D
3. Blue → B
4. Green → F
5. Red → R
6. Orange → L

| # | Palette | U | D | B | F | R | L |
|---:|---|---|---|---|---|---|---|
| 0 | Standard Rubik’s | `#F6F7FB` | `#FFD500` | `#0057D8` | `#00B74A` | `#E0271B` | `#FF7A00` |
| 1 | Neon Arcade | `#00E5FF` | `#FF2D95` | `#B7FF00` | `#7A00FF` | `#FF6B00` | `#F8F9FA` |
| 2 | Retro 1970s | `#6B8E23` | `#DDAA00` | `#C6531C` | `#007C7A` | `#F4E4C1` | `#5A3625` |
| 3 | Desert Sunset | `#E9C46A` | `#264653` | `#E76F51` | `#8AB17D` | `#C85A3D` | `#9C89B8` |
| 4 | Ocean Reef | `#66CDAA` | `#173F5F` | `#FF6F61` | `#00A6A6` | `#F9C74F` | `#F8F4E3` |
| 5 | Pastel Candy | `#A8E6CF` | `#CDB4DB` | `#FFC8A2` | `#A2D2FF` | `#FFF3A3` | `#FFAFCC` |
| 6 | Gothic Jewel | `#007F5F` | `#A4161A` | `#0B4F8A` | `#5A189A` | `#D4A017` | `#F1E9DA` |
| 7 | Earth & Clay | `#C28B36` | `#A44A3F` | `#667A3E` | `#4F5D75` | `#E8DDCB` | `#2B2D42` |
| 8 | Bauhaus | `#D7263D` | `#0057B8` | `#F5C400` | `#111111` | `#F5F5F5` | `#8D99AE` |
| 9 | Nordic Winter | `#D8F3FF` | `#3A6EA5` | `#2D6A4F` | `#9D174D` | `#FAFAFA` | `#7D8597` |
| 10 | Japanese Garden | `#7A9E45` | `#E8A0BF` | `#264653` | `#E76F51` | `#F6F0E2` | `#C9B458` |
| 11 | Miami Vice | `#00F5D4` | `#F15BB5` | `#9B5DE5` | `#FEE440` | `#00BBF9` | `#14213D` |
| 12 | Forest Mushroom | `#4F772D` | `#B08968` | `#BC6C25` | `#FEFAE0` | `#6D597A` | `#283618` |
| 13 | Ice Cream Shop | `#F28482` | `#84A98C` | `#F6E8C3` | `#577590` | `#F6BD60` | `#9D4EDD` |
| 14 | Cyberpunk | `#00D9FF` | `#FF00A8` | `#39FF14` | `#6F00FF` | `#FFB000` | `#0A0A0A` |
| 15 | Autumn Leaves | `#B23A48` | `#E76F00` | `#D4A017` | `#6B7D3A` | `#6D214F` | `#F2E8CF` |
| 16 | Southwestern Tile | `#2A9D8F` | `#1D4E89` | `#C65D3B` | `#E9B44C` | `#D9A066` | `#F4F1DE` |
| 17 | Galaxy | `#E056FD` | `#6C5CE7` | `#0984E3` | `#00CEC9` | `#FDCB6E` | `#2D3436` |
| 18 | Color-Vision Friendly | `#E69F00` | `#56B4E9` | `#009E73` | `#F0E442` | `#D55E00` | `#CC79A7` |
| 19 | ColorBrewer Set2 | `#66C2A5` | `#FC8D62` | `#8DA0CB` | `#E78AC3` | `#A6D854` | `#FFD92F` |
| 20 | Mineral Spectrum | `#343A40` | `#F8F9FA` | `#B87333` | `#0B8F6A` | `#3454D1` | `#7B2CBF` |

Palette behavior:

- Replace the six shared sticker texture maps in place; dispose of old maps.
- Never reset, unscramble, rotate, or rearrange cubies.
- May be changed during animation without interrupting the move queue.
- RESET keeps the selected palette.
- Reload returns to Standard Rubik’s because no storage is used.
- Dropdown labels show numbered names; title text may show the six hex values.

## 7. Move engine

Supported tokens: `U D L R F B M E S x y z`, optionally with `'` and/or `2`.

| Move | Axis | Layer | Direction |
|---|---|---:|---:|
| U | y | 1 | -1 |
| D | y | -1 | 1 |
| R | x | 1 | -1 |
| L | x | -1 | 1 |
| F | z | 1 | -1 |
| B | z | -1 | 1 |
| M | x | 0 | 1 |
| E | y | 0 | 1 |
| S | z | 0 | -1 |
| x | x | ALL | -1 |
| y | y | ALL | -1 |
| z | z | ALL | -1 |

- Attach affected cubies to an origin pivot. Layer match tolerance: `.4` around `layer*SP`; ALL selects every cubie.
- Angle: `(π/2) * (2 if double) * direction * (-1 if prime)`.
- Ease-out cubic via `requestAnimationFrame`.
- Standard/guide speed about 260ms, pattern 300ms, scramble 130ms; doubles take 1.6× and animate as one 180° turn.
- On completion, reattach cubies; round positions to SP multiples and Euler orientation to π/2 multiples, then rebuild quaternion.
- All input uses one FIFO queue `{t,speed,pattern?,solution?,noDelay?,idx?,last?}`.
- HUD flashes every move token.
- SCRAMBLE: 22 face turns, no same face twice, random plain/prime; hide sequence strip.
- SOLVE: cancel unplayed queued moves and waiting patterns; if a move is already animating, let it finish and include it in the state history; then animate an exact solution and show it as AUTO SOLVE in the sequence strip.
- RESET: clear move queue, waiting patterns, solve request, and move history; hide sequence; allow an in-flight turn to finish safely; rebuild solved; retain palette.
- Keyboard: U/D/L/R/F/B; Shift makes prime; Escape closes overlay or toggles guide; ignore moves while form controls have focus.
- Reduced motion: move and theme duration about 80ms, short interface transitions, non-smooth chip scrolling.

### Automatic solve engine

CUBED must solve any state that can be created inside the application. Because all cube changes occur through the legal move engine, maintain a reversible ledger of every **completed** face, slice, and whole-cube turn.

- Record completed non-solution moves only. Never record a move before its animation finishes.
- Reduce adjacent turns of the same base modulo four: examples `R R → R2`, `R R' →` nothing, `R2 R → R'`.
- Invert a state by reversing the ledger and inverting each token: plain ↔ prime; doubles remain doubles.
- SOLVE behavior:
  1. Ignore repeated SOLVE presses while a solution is active or pending.
  2. Clear unstarted move-queue items and pending patterns.
  3. Hide the old pattern sequence.
  4. If a turn is in flight, set a pending solve request; after that move snaps and is recorded, construct the solution.
  5. Show `AUTO SOLVE` and all solution tokens in `#seq`.
  6. Queue solution turns at about 220ms per quarter turn (80ms with reduced motion), with no Delay-slider pauses; doubles remain 1.6×.
  7. Temporarily ignore manual move buttons, keyboard turns, Scramble, pattern selection, and guide Play buttons while solving. Palette, theme, camera, rail, and Reset remain usable.
  8. On the final solution move, clear the ledger, restore the SOLVE button, and flash `SOLVED` in the HUD.
- RESET interrupts a solution safely by clearing the request, queue, and ledger, then rebuilding solved after any in-flight turn finishes.
- The guarantee is exact for every state produced by this application. It does not claim to infer an externally edited sticker state because the app has no sticker-state import/editor.

## 8. Spin

Range `-1..1`, step `.05`, default `.1`. Each frame while not dragging:

`theta += dt * value * .6`

Label negative as `◂ magnitude`, positive as `magnitude ▸`, and zero as `off`. Spin continues during cube moves and playback.

## 9. Themes

Nebula is default. Set `body[data-theme]`, update CSS variables, and interpolate scene parameters for about one second (about 80ms under reduced motion).

| Theme | Background | Accent | Hemi sky/ground/int | Key color/int | Rim color/int | Amb | Stars | Grid | Shadow |
|---|---|---|---|---|---|---:|---:|---:|---:|
| Nebula | `#1B2050→#0B0D1F→#05060F` radial | `#59E3FF` | `BFD6FF/10121F/.85` | `FFFFFF/.95` | `59E3FF/.6` | .22 | .9 | 0 | .22 |
| Synthwave | `#0B021A→#2A0B45→#FF2E88` linear | `#FF4FA3` | `FF9AD5/1A0530/.7` | `FFD1EC/.85` | `00E5FF/.85` | .2 | .35 | .55 | .3 |
| Daylight | `#F4F6FA→#DDE3EE→#C3CCDD` radial | `#2456E6` | `FFFFFF/B9C2D6/1` | `FFF6E8/1.05` | `9DB7FF/.35` | .5 | 0 | 0 | .16 |
| Ember | `#3B1408→#1C0805→#0B0302` radial | `#FFB54D` | `FFD2A1/2A0D05/.75` | `FFBE8A/1.05` | `FF5A2B/.7` | .18 | .25 | 0 | .34 |

Interpolate all light colors/intensities, star opacity, grid opacity, and ground-shadow opacity.

## 10. Eight-step guide

Panel shows STEP n/8, eight progress ticks, scrollable content, ✕, Back, Next, and Start over on step 8. Every algorithm block has ▶ Play and runs from the cube’s current state.

1. Meet your cube — `R U R' U'`; explain centers and notation; six repetitions return solved to solved.
2. White cross — daisy method; demo `F2`.
3. White corners — repeat `R' D' R D` beneath front-right slot.
4. Middle edges — right `U R U' R' U' F' U F`; left `U' L' U L U F U' F'`.
5. Yellow cross — `F R U R' U' F'`.
6. Line up yellow edges — `R U R' U R U2 R'`.
7. Place yellow corners — `U R U' L' U R' U' L`.
8. Twist last corners — repeat `R' D' R D`, then turn only U to bring in the next corner.

## 11. Pattern gallery

Placeholder: `✦ Pattern gallery…`

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

Selection behavior:

- Play cumulatively from current state; never reset automatically.
- If work is active, wait until the move queue drains; poll about every 40ms; never interleave.
- Reset dropdown to placeholder and blur, allowing repeat selection.
- **Immediately hide the control deck and deactivate CONTROLS after a valid pattern selection.** CONTROLS reveals it again.
- Sequence strip shows pattern name and all tokens; current highlighted, completed tinted, upcoming muted; persist until Scramble or Reset.
- Delay slider: `.25..5s`, step `.25`, default `1s`; read live after each non-final pattern move; pattern-only.
- Pattern turn speed 300ms, doubles 1.6×.

## 12. Rail, Tech, and Help

- GUIDE toggles tutorial; panel ✕ hides it; preserve step and cube.
- CONTROLS toggles deck; hidden sequence moves down; hide GUIDE and CONTROLS for clean view.
- TECH explains Three.js/WebGL, camera, cubies, runtime textures, live palette replacement, pivot turns, snapping, animation, queue, reversible move ledger and SOLVE engine, lights, shadows, stars, grid, themes, CSS/UI, fonts, input, and GitHub Pages hosting.
- HELP must document every current capability, including:
  - orbit, wheel, pinch, spin direction/off/drag pause;
  - buttons, notation, slices, rotations, queue, HUD, keyboard;
  - Scramble, SOLVE, and Reset, including solution cancellation rules, AUTO SOLVE sequence display, waiting-pattern clearing, history clearing, and palette retention;
  - all 25 cumulative patterns, waiting, repeat selection, automatic control hiding, sequence states/persistence, Delay;
  - Standard plus 20 palettes, live recoloring, state preservation, Reset persistence, reload to standard;
  - eight guide steps, ticks, navigation, Play, close behavior;
  - four themes;
  - all rail actions and clean view;
  - all overlay close methods;
  - mobile, orientation, in-app browser, and reduced-motion behavior.
- Opening one overlay closes the other. Close via ✕, backdrop, same rail button, or Escape. Active rail styling must match.

## 13. Responsive behavior

At 880px and below: guide becomes bottom sheet; rail becomes compact top-right row; hint hides; deck wraps with pattern/palette controls first; move buttons shrink; sequence clears the taller deck; overlay padding tightens; theme pills compress; tagline hides. Touch controls and canvas centering remain functional.

## 14. Deployment

- Source repository: `markplaga/Rubiks-cube-gpt`.
- Source branch: `main`.
- GitHub Pages branch: `gh-pages`.
- Entry point: root `index.html`.
- `.nojekyll` is allowed.
- Keep `index.html` synchronized between `main` and `gh-pages`.
- Keep this specification synchronized with behavior changes.

## 15. Quality and validation

Required quality:

- Valid HTML, parseable CSS, no duplicate IDs, JavaScript syntax valid, no console errors.
- Visible hover/active/focus states and accent-colored sliders.
- Cube centered at every DPI/orientation; no cubie drift; Reset solved with active palette.
- Palette changes never alter cubie state.
- Pattern auto-hide never hides sequence readout.
- SOLVE must end in canonical solved state for arbitrary app-generated sequences, including slices and whole-cube rotations.
- A pending SOLVE must account for the in-flight move and cancel all unstarted work.
- Target about 60fps on a mid-range phone.
- Review Help whenever user-facing behavior changes.

Static validation before publishing:

1. Syntax-check inline JavaScript.
2. Parse HTML and CSS; check duplicate IDs.
3. Verify 12 move buttons plus SCRAMBLE/SOLVE/RESET, 8 steps, 9 guide algorithm blocks, 25 exact patterns, 21 exact palettes, and all 120 alternate-palette hex values.
4. Verify slot order `U,D,B,F,R,L`.
5. Verify pattern selection adds `controls-hidden` and deactivates CONTROLS.
6. Verify Reset does not reset palette index.
7. Verify exact Delay and Spin ranges/defaults.
8. Verify Scramble count/no-repeat rule, queue, 40ms pattern waiting, every-frame sizing, resize/orientation/visualViewport listeners, themes, Help coverage, no storage, and no OrbitControls.
9. Verify SOLVE button, completed-move ledger, adjacent-turn reduction, token inversion, queue/pattern cancellation, in-flight solve request, AUTO SOLVE sequence, no pattern delay, interaction guards, final history clearing, SOLVED HUD, and Reset interruption.
10. Run move identities: each move plus inverse, each half turn twice, `R U R' U'` six times, and Checkerboard twice.

Current implementation validation snapshot:

- [x] JavaScript syntax passed.
- [x] HTML parsed without recovery errors; no duplicate IDs.
- [x] CSS parsed with no top-level errors.
- [x] 31/31 static feature checks passed.
- [x] 12 moves, 8 steps, 9 guide algorithm blocks, 25 patterns, and 21 palettes matched.
- [x] All pattern sequences and all alternate palette values matched exactly.
- [x] Pattern auto-hide, live palette texture replacement, Reset palette retention, automatic SOLVE behavior, and comprehensive Help coverage were present.
- [x] Every-frame and event-driven sizing checks were present.
- [x] 26/26 discrete move-identity tests passed for `U D L R F B M E S x y z`, the sixfold warm-up, and double Checkerboard.
- [x] 250/250 deterministic randomized solver simulations returned app-generated states to canonical solved state.
- [ ] Repeat manual WebGL interaction testing in deployed desktop and mobile browsers after future code changes.

## 16. Acceptance checklist

- [ ] Single-file application, Three.js r128, correct fonts, no build step.
- [ ] HTML/CSS/JS validation passes; no duplicate IDs or console errors.
- [ ] Cube centered; orbit, wheel, touch drag, pinch, and camera clamps work.
- [ ] Twelve buttons and keyboard directions work; HUD flashes.
- [ ] Doubles are one 180° animation; slices and rotations work.
- [ ] Snapping prevents drift.
- [ ] Scramble is 22 turns with no consecutive same face.
- [ ] SOLVE is always available, cancels unstarted work, includes an in-flight move, animates AUTO SOLVE without pattern delays, and ends solved.
- [ ] SOLVE handles face, slice, whole-cube, prime, and double moves; repeated SOLVE input is ignored while active.
- [ ] Reset clears active/waiting/solution work and history, solves, clears sequence, and keeps palette.
- [ ] Eight exact guide steps and all Play/navigation controls work.
- [ ] All 25 patterns are exact, cumulative, repeatable, and wait correctly.
- [ ] Pattern selection immediately hides controls; CONTROLS restores them.
- [ ] Sequence states and persistence work.
- [ ] Delay and Spin ranges, defaults, live behavior, and scope are exact.
- [ ] Standard plus 20 exact palettes are present.
- [ ] Palette changes preserve cube state and work during animation.
- [ ] Reset retains palette; reload returns to standard.
- [ ] Four exact themes transition correctly.
- [ ] GUIDE/CONTROLS state and TECH/HELP overlay close behavior work.
- [ ] TECH and HELP document every current capability, including the reversible ledger and SOLVE behavior.
- [ ] Mobile/in-app-browser layout and reduced motion work.
- [ ] `main` and `gh-pages` publish the same `index.html`.
- [ ] `SPEC.md` is updated whenever behavior changes.
