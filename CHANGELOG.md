# Changelog

## 2026-02-24 - Build D 20260224a (Hardening Pass)

- Added theme scaffolding in `game.config.js` via `defaultThemeId` and `themePacks`.
- Removed dead tower-art config placeholders from `game.config.js`.
- Added runtime telemetry log: `window.__gardenRuntimeErrors` (error/rejection/game-loop crash).
- Added deterministic gameplay RNG support with `?seed=...` for gameplay-critical random events.
- Expanded smoke harness checks:
  - tower place
  - tower upgrade
  - tower sell double-confirm
  - snapshot sanitize
  - snapshot write/read roundtrip
  - wave spawn/runtime stability
- Smoke result now includes diagnostic metadata (theme pack and seed).
- Updated `README.md` with deterministic debug runs, runtime diagnostics, and hardening notes.

## 2026-02-23 - Build D 20260223ac

- Enemy key visuals switched to insect mini-graphics.
- Enemy color consistency pass across models and key.
- Removed floating enemy role/status chips from the battlefield overlay.
