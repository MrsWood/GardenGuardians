// Persistence helpers extracted from game.js (Step 1D modular refactor).
(function () {
  function loadHighscores(key) {
    try {
      const raw = localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveHighscores(key, highscores) {
    try {
      const list = Array.isArray(highscores) ? highscores.slice(0, 10) : [];
      localStorage.setItem(key, JSON.stringify(list));
      return true;
    } catch {
      return false;
    }
  }

  function loadCompletedLevels(key) {
    try {
      const raw = localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : [];
      const levels = Array.isArray(parsed) ? parsed.filter(v => Number.isInteger(v) && v > 0) : [];
      return [...new Set(levels)].sort((a, b) => a - b);
    } catch {
      return [];
    }
  }

  function saveCompletedLevels(key, completedLevels) {
    try {
      const levels = Array.isArray(completedLevels) ? completedLevels : [];
      localStorage.setItem(key, JSON.stringify(levels));
      return true;
    } catch {
      return false;
    }
  }

  function getDefaultProfileData(saveSchemaVersion) {
    return {
      version: saveSchemaVersion,
      lastPlayerName: "",
      lastDifficulty: "normal",
      lastLevel: 1,
      tutorialSeen: false,
      tutorialAutoStart: false,
      mobileHoldToPlace: false,
      audioEnabled: true,
      musicEnabled: true,
      sfxVolume: 0.65,
      musicVolume: 0.3,
      career: {
        wavesCleared: 0,
        bugsDefeated: 0,
        coinsFromKills: 0,
        coinsFromBonus: 0,
        bankedTotal: 0,
        bestWave: 0,
        bestBank: 0
      }
    };
  }

  function ensureCareerStats(profile, careerDefaults) {
    const defaults = careerDefaults || {
      wavesCleared: 0,
      bugsDefeated: 0,
      coinsFromKills: 0,
      coinsFromBonus: 0,
      bankedTotal: 0,
      bestWave: 0,
      bestBank: 0
    };
    if (!profile.career || typeof profile.career !== "object") {
      profile.career = { ...defaults };
    } else {
      profile.career = {
        ...defaults,
        ...profile.career
      };
    }
    for (const key of Object.keys(defaults)) {
      const v = Number(profile.career[key]);
      profile.career[key] = Number.isFinite(v) ? Math.max(0, Math.round(v)) : 0;
    }
    return profile.career;
  }

  function loadProfileData(options) {
    const key = options?.key;
    const saveSchemaVersion = Number(options?.saveSchemaVersion) || 1;
    const defaults = options?.defaults || getDefaultProfileData(saveSchemaVersion);
    const levelExists = typeof options?.levelExists === "function" ? options.levelExists : (() => true);
    const difficultyExists = typeof options?.difficultyExists === "function" ? options.difficultyExists : (() => true);

    let loaded = { ...defaults };
    try {
      const raw = localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : null;
      if (parsed && typeof parsed === "object") {
        loaded = {
          ...loaded,
          ...parsed
        };
      }
    } catch {
      loaded = { ...defaults };
    }

    if (loaded.version !== saveSchemaVersion) loaded.version = saveSchemaVersion;
    if (!levelExists(Number(loaded.lastLevel))) loaded.lastLevel = 1;
    if (!difficultyExists(loaded.lastDifficulty)) loaded.lastDifficulty = "normal";
    if (typeof loaded.lastPlayerName !== "string") loaded.lastPlayerName = "";
    loaded.tutorialSeen = !!loaded.tutorialSeen;
    loaded.tutorialAutoStart = !!loaded.tutorialAutoStart;
    loaded.mobileHoldToPlace = !!loaded.mobileHoldToPlace;
    loaded.audioEnabled = loaded.audioEnabled !== false;
    loaded.musicEnabled = loaded.musicEnabled !== false;
    loaded.sfxVolume = Math.max(0, Math.min(1, Number(loaded.sfxVolume)));
    if (!Number.isFinite(loaded.sfxVolume)) loaded.sfxVolume = 0.65;
    loaded.musicVolume = Math.max(0, Math.min(1, Number(loaded.musicVolume)));
    if (!Number.isFinite(loaded.musicVolume)) loaded.musicVolume = 0.3;
    ensureCareerStats(loaded, defaults.career || getDefaultProfileData(saveSchemaVersion).career);
    return loaded;
  }

  function saveProfileData(key, profileData) {
    try {
      localStorage.setItem(key, JSON.stringify(profileData));
      return true;
    } catch {
      return false;
    }
  }

  function clearRunSnapshot(runKey, runBackupKey) {
    localStorage.removeItem(runKey);
    localStorage.removeItem(runBackupKey);
  }

  function sanitizeRunSnapshot(options) {
    const parsed = options?.parsed;
    const saveSchemaVersion = Number(options?.saveSchemaVersion) || 1;
    const levelExists = typeof options?.levelExists === "function" ? options.levelExists : (() => true);
    const difficultyExists = typeof options?.difficultyExists === "function" ? options.difficultyExists : (() => true);
    const defaultTutorialProgress = options?.defaultTutorialProgress || { active: false, forced: false, placedTower: false, startedWave: false, upgradedTower: false };

    if (!parsed || typeof parsed !== "object") return null;
    if (parsed.version !== saveSchemaVersion) return null;
    if (!parsed.gameStarted || parsed.gameOver || parsed.levelComplete) return null;
    const parsedLevel = Number(parsed.levelNumber);
    if (!levelExists(parsedLevel)) return null;
    if (!difficultyExists(parsed.difficultyKey)) return null;

    return {
      ...parsed,
      levelNumber: parsedLevel,
      difficultyKey: String(parsed.difficultyKey),
      money: Math.max(0, Number(parsed.money) || 0),
      bank: Math.max(0, Number(parsed.bank) || 0),
      lives: Math.max(0, Number(parsed.lives) || 0),
      wave: Math.max(0, Number(parsed.wave) || 0),
      lastClearedWave: Math.max(0, Number(parsed.lastClearedWave) || 0),
      frameCount: Math.max(0, Number(parsed.frameCount) || 0),
      nextEnemyId: Math.max(1, Number(parsed.nextEnemyId) || 1),
      nextTowerId: Math.max(1, Number(parsed.nextTowerId) || 1),
      nextVegetableId: Math.max(1, Number(parsed.nextVegetableId) || 1),
      bunnySpawnCooldown: Math.max(0, Number(parsed.bunnySpawnCooldown) || 0),
      autoWaveRemainingMs: Math.max(0, Number(parsed.autoWaveRemainingMs) || 0),
      currentWaveSpawnTotal: Math.max(0, Number(parsed.currentWaveSpawnTotal) || 0),
      currentWaveKillCount: Math.max(0, Number(parsed.currentWaveKillCount) || 0),
      currentWaveRewardEarned: Math.max(0, Number(parsed.currentWaveRewardEarned) || 0),
      currentWaveStartLives: Math.max(0, Number(parsed.currentWaveStartLives) || 0),
      currentWaveDamageDealt: Math.max(0, Number(parsed.currentWaveDamageDealt) || 0),
      nextLevelPending: parsed.nextLevelPending ? Number(parsed.nextLevelPending) : null,
      selectedTowerType: parsed.selectedTowerType || "spray",
      selectedTowerId: parsed.selectedTowerId ? Number(parsed.selectedTowerId) : null,
      tutorialProgress: parsed.tutorialProgress && typeof parsed.tutorialProgress === "object" ? parsed.tutorialProgress : defaultTutorialProgress,
      towers: Array.isArray(parsed.towers) ? parsed.towers : [],
      enemies: Array.isArray(parsed.enemies) ? parsed.enemies : [],
      gluePatches: Array.isArray(parsed.gluePatches) ? parsed.gluePatches : [],
      craters: Array.isArray(parsed.craters) ? parsed.craters : [],
      gardenVegetables: Array.isArray(parsed.gardenVegetables) ? parsed.gardenVegetables : []
    };
  }

  function writeRunSnapshot(runKey, runBackupKey, snapshot) {
    try {
      const previousRaw = localStorage.getItem(runKey);
      if (previousRaw) localStorage.setItem(runBackupKey, previousRaw);
      localStorage.setItem(runKey, JSON.stringify(snapshot));
      return true;
    } catch {
      return false;
    }
  }

  function readRunSnapshot(runKey, runBackupKey, sanitizeFn) {
    const sanitize = typeof sanitizeFn === "function" ? sanitizeFn : (v => v);
    try {
      const rawPrimary = localStorage.getItem(runKey);
      if (rawPrimary) {
        const parsedPrimary = sanitize(JSON.parse(rawPrimary));
        if (parsedPrimary) return { snapshot: parsedPrimary, recovered: false };
      }
    } catch {
      // try backup slot below
    }
    try {
      const rawBackup = localStorage.getItem(runBackupKey);
      if (!rawBackup) return null;
      const parsedBackup = sanitize(JSON.parse(rawBackup));
      if (!parsedBackup) return null;
      try {
        localStorage.setItem(runKey, JSON.stringify(parsedBackup));
      } catch {
        // ignore write-back failures
      }
      return { snapshot: parsedBackup, recovered: true };
    } catch {
      return null;
    }
  }

  window.GG_PERSIST = {
    ...(window.GG_PERSIST || {}),
    loadHighscores,
    saveHighscores,
    loadCompletedLevels,
    saveCompletedLevels,
    getDefaultProfileData,
    ensureCareerStats,
    loadProfileData,
    saveProfileData,
    clearRunSnapshot,
    sanitizeRunSnapshot,
    writeRunSnapshot,
    readRunSnapshot
  };
})();
