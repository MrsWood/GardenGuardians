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

The game runs a lightweight smoke pass (load, start, place tower, start wave, enemy spawn, runtime stability) and writes results to:

- `window.__gardenSmokeResult`

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
