# Garden Guard (Tower Defense)

This is a static HTML/JS/CSS game ready to publish with GitHub Pages.

## Play on Web

Live game:

- https://mrswood.github.io/GardenGuardians/

## Play Locally

Open `index.html` in a browser.

## Smoke Test Harness

Run a quick automated sanity check by opening:

- `index.html?smoke=1`

The game runs a lightweight smoke pass (load, start, place, upgrade, sell, snapshot roundtrip, wave spawn, runtime stability) and writes results to:

- `window.__gardenSmokeResult`

## Deterministic Debug Runs

Use a seed to make gameplay-critical randomization deterministic for debugging:

- `index.html?seed=mytest`
- `index.html?smoke=1&seed=mytest`

Seeded randomness currently covers:

- wave lane selection
- weighted enemy type selection
- bunny cooldown and bunny spawn point selection

## Runtime Diagnostics

Runtime errors are captured in:

- `window.__gardenRuntimeErrors`

The log is capped to the latest 30 entries and includes `window.error`, `unhandledrejection`, and guarded game loop crashes.

## Theme Scaffolding

Theme metadata is centralized in `game.config.js`:

- `defaultThemeId`
- `themePacks`

This allows cloning the current game into a new themed variant without rewriting core simulation code.

## Publish with GitHub Pages (Recommended)

1. Create a new GitHub repository.
2. Upload/push this folder to the `main` branch.
3. In GitHub, open:
   - `Settings` -> `Pages`
   - `Build and deployment` -> `Source: GitHub Actions`
4. Push any change to `main`.
5. GitHub will deploy automatically using `.github/workflows/pages.yml`.

Your live URL will be:

- `https://<your-username>.github.io/<repo-name>/`

## Required Files

- `index.html`
- `game.config.js`
- `simulation.js`
- `combat.js`
- `persistence.js`
- `ui.js`
- `rendering.js`
- `game.js`
- `style.css`
- `instructions.html`
- `assets/`

## Notes

- All app paths are relative (`./...`) so it works under a repo subpath on Pages.
- `.nojekyll` is included to avoid Jekyll processing issues.
