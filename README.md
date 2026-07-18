# CUBED — Interactive 3D Rubik's Cube Tutorial

**Live site:** https://markplaga.github.io/rubiks-cube-tutorial/

A single-file web app that teaches you to solve the Rubik's Cube on a live, animated 3D cube. Orbit it, turn its faces, scramble it, follow the 8-step beginner solving guide, or sit back and watch any of 25 classic patterns play out move by move.

## Features

- **Real 3D cube** — 27 individual cubies rendered with Three.js/WebGL, with drag-to-orbit, scroll/pinch zoom, and smoothly animated face turns (including one-motion 180° turns, M/E/S slice moves, and whole-cube rotations)
- **8-step solving guide** — the beginner layer-by-layer method, with every algorithm shown as notation chips and a ▶ Play button that performs it on the cube
- **Pattern gallery** — 25 decorative patterns (Checkerboard, Superflip, Cube-in-Cube-in-Cube…) selectable from a dropdown; the move sequence displays on screen and highlights each move as it plays
- **Adjustable pacing** — a delay slider (0.25s–5s) sets the pause between pattern moves, changeable mid-playback
- **Cumulative playback** — patterns play from the cube's current state, so you can stack them; Reset is the only way back to solved
- **Spin control** — a slider sets auto-rotation direction and speed, or stops it
- **Four environments** — Nebula, Synthwave, Daylight, and Ember themes crossfade the entire scene: lighting, backdrop, starfield/grid, and accent color
- **Move deck & keyboard** — twelve face-turn buttons plus keyboard input (letter = move, Shift = counter-clockwise), scramble and reset
- **Tech & Help overlays** — an in-app tour of the technology behind the page and a full feature manual
- **Mobile-ready** — responsive layout with self-correcting canvas sizing that stays centered even inside in-app browsers

## Controls

| Input | Action |
|---|---|
| Drag | Orbit the camera |
| Scroll / pinch | Zoom |
| U D L R F B (+Shift) | Turn a face (Shift = counter-clockwise) |
| Esc | Close overlay / toggle guide |

## Repository

- `index.html` — the entire application (HTML, CSS, and JavaScript in one file; Three.js r128 via cdnjs, fonts via Google Fonts)
- `SPEC.md` — a complete build specification documenting every feature, algorithm, pattern sequence, theme value, and behavior, suitable for handing to a developer (or an LLM) to rebuild the app from scratch

## Hosting

Served by GitHub Pages from the `main` branch. Every commit to `index.html` goes live automatically within a minute or two.
