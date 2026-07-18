# CUBED — Current Specification

## Status

This is the current specification for CUBED. `SPEC-core.md` preserves the complete pre-environment specification for the cube, solver, patterns, palettes, guide, controls, responsive layout, validation, and deployment. This document incorporates that baseline and supersedes its former four-theme requirements with the 25-environment system below.

The current application includes the animated 3D cube, exact reversible SOLVE engine, SCRAMBLE and RESET, twelve face controls and keyboard input, eight-step playable guide, 25 cumulative patterns, Standard plus 20 alternate cube palettes, Delay and Spin controls, clean-view controls, comprehensive Tech and Help overlays, and GitHub Pages deployment.

## Theme Environment selector

The four header pills are replaced by one accessible `#themeSelect` dropdown labeled **Environment**. It is visible in the fixed header on desktop and compresses into a narrower selector on phones and tablets. The dropdown is populated from one 25-item `themeEnvironments` data structure and displays numbered labels from `01` through `25`.

Nebula is the default after every page reload. Environment selection is not stored in local or session storage.

## The 25 environments

| # | Environment | Design intent | UI mode | Accent |
|---:|---|---|---|---|
| 1 | Nebula | Deep indigo space with cyan starlight | Dark | `#59E3FF` |
| 2 | Synthwave Grid | Magenta horizon, cyan rim light, neon floor grid | Dark | `#FF4FA3` |
| 3 | Daylight Studio | Clean gallery daylight and soft gray floor | Light | `#2456E6` |
| 4 | Ember Forge | Smoky charcoal with glowing forge light | Dark | `#FFB54D` |
| 5 | Aurora Sky | Emerald and violet aurora over polar night | Dark | `#79FFD2` |
| 6 | Moonlit Ocean | Silver moonlight and layered midnight blues | Dark | `#8FD8FF` |
| 7 | Desert Dusk | Terracotta sunset fading into violet night | Dark | `#F5B66E` |
| 8 | Enchanted Forest | Moss, moonlit mist, and woodland green | Dark | `#9BE564` |
| 9 | Arctic Ice | Bright glacial blue and crystalline light | Light | `#13A8C7` |
| 10 | Golden Hour | Cream studio warmed by late-afternoon sun | Light | `#C86B20` |
| 11 | Midnight Garden | Velvet plum with emerald botanical light | Dark | `#FF7AC8` |
| 12 | Cosmic Violet | Dense violet cosmos and lavender stars | Dark | `#C7A0FF` |
| 13 | Cyber City | Electric cyan digital grid and magenta rim | Dark | `#00F0FF` |
| 14 | Rose Quartz | Blush mineral light and pearly softness | Light | `#B94F7C` |
| 15 | Jade Temple | Lacquer green, jade, and antique gold | Dark | `#67D6A3` |
| 16 | Solar Flare | Yellow-orange plasma against solar red | Dark | `#FFD84D` |
| 17 | Deep Sea | Abyssal blue with bioluminescent aqua | Dark | `#4DF4D2` |
| 18 | Cloud Nine | Airy sky blue and soft white atmosphere | Light | `#287BC1` |
| 19 | Volcanic Glass | Obsidian darkness with lava-red cuts | Dark | `#FF5A36` |
| 20 | Lavender Mist | Pale lavender haze and violet studio light | Light | `#7252B8` |
| 21 | Copper Workshop | Burnished copper, walnut shadow, maker light | Dark | `#D98A4E` |
| 22 | Sakura Night | Cherry-blossom pink under indigo night | Dark | `#FF8FBD` |
| 23 | Emerald Cavern | Dark stone with crystalline emerald glow | Dark | `#39E58C` |
| 24 | Monochrome Studio | Minimal grayscale sculptural gallery | Light | `#343A40` |
| 25 | Prism Festival | Layered spectral light and cosmic sparkle | Dark | `#7CF7FF` |

## Environment design contract

Every environment must coordinate the HTML/CSS interface and the Three.js scene rather than merely changing one background color.

Each data entry provides:

- a unique ID, display name, and short descriptive title;
- a layered CSS background using gradients appropriate to the environment;
- an accent color and a dark or light interface mode;
- a surface color used to derive glass panels and native dropdown colors;
- hemisphere sky color, hemisphere ground color, and intensity;
- key-light color and intensity;
- rim-light color and intensity;
- ambient-light intensity;
- exponential-fog color and density;
- star color, size, rotation speed, and opacity;
- perspective-grid primary color, secondary color, and opacity;
- ground-shadow color and opacity.

Light environments automatically use light translucent panels, dark body text, a lighter overlay, and appropriate native select-option colors. Dark environments use dark tinted glass and light text. Accent contrast must be calculated so filled accent buttons and active sequence chips remain readable.

## Transition behavior

Selecting a new environment must immediately update the dropdown value, layered page backdrop, browser theme color, CSS accent variables, glass surfaces, text colors, borders, shadows, overlay tint, and form-option colors.

Three.js parameters interpolate from their current values to the new target with an ease-out curve over approximately one second. When `prefers-reduced-motion: reduce` is active, this transition is approximately 80 milliseconds.

The interpolation includes:

- hemisphere, key, rim, and ambient lighting;
- star opacity, color, point size, and rotation speed;
- grid opacity and both grid colors;
- ground-shadow opacity and color;
- fog color and density.

Environment changes must never move cubies, change sticker colors, reset the cube, clear a pattern, alter the solver history, or interrupt a move queue. They remain available during manual moves, patterns, Scramble, guide playback, and AUTO SOLVE.

## Help and Tech requirements

HELP must explain the Environment dropdown, state that it contains 25 environments, describe the coordinated CSS/WebGL changes, identify light and dark modes, and provide an expandable list containing all 25 names.

TECH must explain that the environments coordinate layered CSS backgrounds with hemisphere/key/rim/ambient lighting, fog, recolored and resized stars, optional grids, and colored ground shadows. It must also explain that those parameters interpolate smoothly.

All other comprehensive Help requirements in `SPEC-core.md` remain in force.

## Responsive behavior

At 880 px and below, the Environment control becomes a compact single-column selector and its text size decreases. The label may hide while the select retains an accessible label. It must not collide with the CUBED brand or the compact rail. At 470 px and below, it narrows again while remaining usable by touch.

## Deployment

- Source repository: `markplaga/Rubiks-cube-gpt`
- Source branch: `main`
- GitHub Pages branch: `gh-pages`
- Entry point: root `index.html`
- `main` and `gh-pages` must publish the same environment behavior.
- The canonical specification copy in `markplaga/rubiks-cube-tutorial` must remain synchronized.

## Validation requirements

Before publishing an environment change:

1. Verify exactly 25 unique environment IDs and 25 unique names.
2. Verify every environment contains every required scene property.
3. Verify the dropdown has 25 numbered options and defaults to Nebula.
4. Verify old theme pills and `.theme-btn` event handling are absent.
5. Syntax-check JavaScript.
6. Parse HTML and CSS and check for duplicate IDs.
7. Verify light-mode contrast and select-option colors.
8. Verify Help contains all 25 names and describes the dropdown.
9. Verify changing environments preserves cube state, palette, queue, pattern, and solver history.
10. Manually test transitions on desktop and mobile WebGL browsers.

## Acceptance checklist

- [ ] One Environment dropdown replaces the four theme pills.
- [ ] All 25 environment names appear once and in the specified order.
- [ ] Nebula is selected after reload.
- [ ] Every environment has a deliberate layered backdrop and coordinated WebGL lighting.
- [ ] Fog, stars, grid, and ground shadow respond to environment selection.
- [ ] Light environments use readable light glass and dark text.
- [ ] Dark environments use readable tinted glass and light text.
- [ ] Environment changes transition smoothly and do not alter the cube state.
- [ ] Environment selection remains available during AUTO SOLVE.
- [ ] The selector is usable on desktop, phone, tablet, high-DPI, and in-app browsers.
- [ ] HELP and TECH document the complete environment system.
- [ ] Existing cube, solver, guide, pattern, palette, rail, overlay, and responsive acceptance requirements remain satisfied.
