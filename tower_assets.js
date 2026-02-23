(function attachTowerAssetsModule(global) {
  "use strict";

  const DEFAULT_TYPES = ["spray", "glue", "hose", "salt"];
  const DEFAULT_LOAD_TIMEOUT_MS = 4200;

  function createTowerArtState(types = DEFAULT_TYPES) {
    const images = {};
    const processed = {};
    const meta = {};
    for (const type of types) {
      images[type] = null;
      processed[type] = null;
      meta[type] = {
        status: "idle",
        source: "",
        error: "",
        loadedAt: 0
      };
    }
    return { images, processed, meta, lastLoadSummary: null };
  }

  function sanitizeTowerArtImage(img) {
    try {
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      if (!w || !h) return null;
      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const octx = off.getContext("2d");
      if (!octx) return null;
      octx.clearRect(0, 0, w, h);
      octx.drawImage(img, 0, 0, w, h);
      const imageData = octx.getImageData(0, 0, w, h);
      const data = imageData.data;
      const idx = (x, y) => (y * w + x) * 4;
      const colorAt = (x, y) => {
        const i = idx(x, y);
        return [data[i], data[i + 1], data[i + 2], data[i + 3]];
      };
      const cornerSeeds = [
        [0, 0],
        [w - 1, 0],
        [0, h - 1],
        [w - 1, h - 1]
      ];
      const cornerColors = cornerSeeds.map(([x, y]) => colorAt(x, y));
      const near = (r, g, b, cr, cg, cb, tol) =>
        Math.abs(r - cr) <= tol && Math.abs(g - cg) <= tol && Math.abs(b - cb) <= tol;
      const isBgLike = (r, g, b, a) => {
        if (a === 0) return true;
        if (r > 245 && g > 245 && b > 245) return true;
        if (g > 90 && g > r * 1.2 && g > b * 1.1 && (g - r) > 20) return true;
        for (let c = 0; c < cornerColors.length; c += 1) {
          const cc = cornerColors[c];
          if (near(r, g, b, cc[0], cc[1], cc[2], 40)) return true;
        }
        return false;
      };

      const visited = new Uint8Array(w * h);
      const queue = [];
      const push = (x, y) => {
        if (x < 0 || y < 0 || x >= w || y >= h) return;
        const vi = y * w + x;
        if (visited[vi]) return;
        visited[vi] = 1;
        queue.push([x, y]);
      };
      push(0, 0);
      push(w - 1, 0);
      push(0, h - 1);
      push(w - 1, h - 1);

      while (queue.length) {
        const [x, y] = queue.pop();
        const i = idx(x, y);
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        if (!isBgLike(r, g, b, a)) continue;
        data[i + 3] = 0;
        push(x + 1, y);
        push(x - 1, y);
        push(x, y + 1);
        push(x, y - 1);
      }

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        if (a === 0) continue;
        const greenDominant =
          g >= 70 &&
          (g - r) >= 12 &&
          (g - b) >= 8 &&
          g > r * 1.08 &&
          g > b * 1.04;
        if (greenDominant) data[i + 3] = 0;
      }

      octx.putImageData(imageData, 0, 0);
      let minX = w;
      let minY = h;
      let maxX = -1;
      let maxY = -1;
      for (let y = 0; y < h; y += 1) {
        for (let x = 0; x < w; x += 1) {
          const i = (y * w + x) * 4;
          if (data[i + 3] > 0) {
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
          }
        }
      }
      if (maxX < minX || maxY < minY) return off;
      const pad = 2;
      const sx = Math.max(0, minX - pad);
      const sy = Math.max(0, minY - pad);
      const sw = Math.min(w - sx, (maxX - minX + 1) + pad * 2);
      const sh = Math.min(h - sy, (maxY - minY + 1) + pad * 2);
      const trimmed = document.createElement("canvas");
      trimmed.width = Math.max(1, sw);
      trimmed.height = Math.max(1, sh);
      const tctx = trimmed.getContext("2d");
      if (!tctx) return off;
      tctx.drawImage(off, sx, sy, sw, sh, 0, 0, sw, sh);
      return trimmed;
    } catch {
      return null;
    }
  }

  function loadTowerArtAssets(args) {
    const sources = args?.sources || {};
    const state = args?.state || null;
    const onAssetReady = args?.onAssetReady;
    const timeoutMs = Math.max(600, Number(args?.timeoutMs) || DEFAULT_LOAD_TIMEOUT_MS);
    if (!state || !state.images || !state.processed || !state.meta) return Promise.resolve({
      total: 0,
      loaded: 0,
      failed: 0,
      failures: []
    });
    const keys = Object.keys(sources);
    if (!keys.length) {
      const emptySummary = { total: 0, loaded: 0, failed: 0, failures: [] };
      state.lastLoadSummary = emptySummary;
      return Promise.resolve(emptySummary);
    }
    return new Promise((resolve) => {
      let settled = 0;
      let loaded = 0;
      let failed = 0;
      const failures = [];
      const finish = () => {
        const summary = {
          total: keys.length,
          loaded,
          failed,
          failures
        };
        state.lastLoadSummary = summary;
        resolve(summary);
      };
      const settleOne = (key, ok, reason = "") => {
        if (ok) loaded += 1;
        else {
          failed += 1;
          failures.push({ key, reason: reason || "unknown", src: String(sources[key] || "") });
        }
        settled += 1;
        if (typeof onAssetReady === "function") onAssetReady(key, ok, reason || "");
        if (settled >= keys.length) finish();
      };

      for (const key of keys) {
        const src = String(sources[key] || "");
        state.meta[key] = {
          status: "loading",
          source: src,
          error: "",
          loadedAt: 0
        };
        state.images[key] = null;
        state.processed[key] = null;

        const img = new Image();
        img.decoding = "async";
        let done = false;
        const conclude = (ok, reason = "") => {
          if (done) return;
          done = true;
          clearTimeout(timer);
          if (ok) {
            state.images[key] = img;
            const sanitized = sanitizeTowerArtImage(img);
            state.processed[key] = sanitized || img;
            state.meta[key].status = "loaded";
            state.meta[key].error = "";
            state.meta[key].loadedAt = Date.now();
          } else {
            state.images[key] = null;
            state.processed[key] = null;
            state.meta[key].status = "failed";
            state.meta[key].error = reason || "load-failed";
            state.meta[key].loadedAt = 0;
          }
          settleOne(key, ok, reason);
        };

        const timer = setTimeout(() => {
          conclude(false, "timeout");
        }, timeoutMs);

        img.onload = () => {
          const w = img.naturalWidth || img.width || 0;
          const h = img.naturalHeight || img.height || 0;
          if (w <= 0 || h <= 0) {
            conclude(false, "decoded-empty");
            return;
          }
          conclude(true, "");
        };
        img.onerror = () => {
          conclude(false, "error-event");
        };
        img.src = src;
      }
    });
  }

  function drawTowerArtSprite(args) {
    const drawCtx = args?.drawCtx;
    const type = args?.type;
    const opts = args?.opts || {};
    const state = args?.state;
    const shouldUseImportedTowerArt = args?.shouldUseImportedTowerArt;
    if (!drawCtx || !state || !state.images || !state.processed) return false;
    if (typeof shouldUseImportedTowerArt === "function" && !shouldUseImportedTowerArt(type)) return false;
    const img = state.processed[type] || state.images[type];
    if (!img) return false;
    const isCanvas = typeof HTMLCanvasElement !== "undefined" && img instanceof HTMLCanvasElement;
    if (!isCanvas && (!img.complete || !img.naturalWidth)) return false;
    const size = Number.isFinite(opts.size) ? opts.size : 27;
    const angle = Number.isFinite(opts.angle) ? opts.angle : 0;
    const x = Number.isFinite(opts.x) ? opts.x : 0;
    const y = Number.isFinite(opts.y) ? opts.y : 0;
    const iw = (isCanvas ? img.width : img.naturalWidth) || img.width || size;
    const ih = (isCanvas ? img.height : img.naturalHeight) || img.height || size;
    const scale = size / Math.max(iw, ih);
    const dw = iw * scale;
    const dh = ih * scale;
    drawCtx.save();
    drawCtx.translate(x, y);
    if (angle) drawCtx.rotate(angle);
    drawCtx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
    drawCtx.restore();
    return true;
  }

  function ensureIconCanvas(hostEl, cls, width, height) {
    if (!hostEl) return null;
    let iconCanvas = hostEl.querySelector("canvas");
    if (!iconCanvas) {
      iconCanvas = document.createElement("canvas");
      iconCanvas.className = cls;
      hostEl.textContent = "";
      hostEl.appendChild(iconCanvas);
    }
    if (iconCanvas.width !== width) iconCanvas.width = width;
    if (iconCanvas.height !== height) iconCanvas.height = height;
    return iconCanvas;
  }

  function renderTowerSelectorIcons(args) {
    const sprayTowerBtn = args?.sprayTowerBtn || null;
    const glueTowerBtn = args?.glueTowerBtn || null;
    const hoseTowerBtn = args?.hoseTowerBtn || null;
    const saltTowerBtn = args?.saltTowerBtn || null;
    const renderTowerSelectorIcon = args?.renderTowerSelectorIcon;
    const drawTowerArtSpriteFn = args?.drawTowerArtSprite;
    if (typeof renderTowerSelectorIcon !== "function" || typeof drawTowerArtSpriteFn !== "function") return;

    const sprayHost = sprayTowerBtn ? sprayTowerBtn.querySelector(".sprayIcon") : null;
    const glueHost = glueTowerBtn ? glueTowerBtn.querySelector(".glueIcon") : null;
    const hoseHost = hoseTowerBtn ? hoseTowerBtn.querySelector(".hoseIcon") : null;
    const saltHost = saltTowerBtn ? saltTowerBtn.querySelector(".saltPreview") : null;

    const sprayCanvas = ensureIconCanvas(sprayHost, "towerAssetIconCanvas", 96, 96);
    const glueCanvas = ensureIconCanvas(glueHost, "towerAssetIconCanvas", 96, 96);
    const hoseCanvas = ensureIconCanvas(hoseHost, "towerAssetIconCanvas", 96, 96);
    const saltCanvas = ensureIconCanvas(saltHost, "saltPreviewCanvas", 96, 96);

    if (sprayCanvas) {
      const iconCtx = sprayCanvas.getContext("2d");
      if (iconCtx) renderTowerSelectorIcon(iconCtx, "spray", drawTowerArtSpriteFn);
    }
    if (glueCanvas) {
      const iconCtx = glueCanvas.getContext("2d");
      if (iconCtx) renderTowerSelectorIcon(iconCtx, "glue", drawTowerArtSpriteFn);
    }
    if (hoseCanvas) {
      const iconCtx = hoseCanvas.getContext("2d");
      if (iconCtx) renderTowerSelectorIcon(iconCtx, "hose", drawTowerArtSpriteFn);
    }
    if (saltCanvas) {
      const iconCtx = saltCanvas.getContext("2d");
      if (iconCtx) renderTowerSelectorIcon(iconCtx, "salt", drawTowerArtSpriteFn);
    }
  }

  global.GG_TOWER_ASSETS = {
    createTowerArtState,
    sanitizeTowerArtImage,
    loadTowerArtAssets,
    drawTowerArtSprite,
    ensureIconCanvas,
    renderTowerSelectorIcons
  };
})(window);
