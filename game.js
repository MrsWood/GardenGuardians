const canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d");

    const roadHalfHeight = 9.52;
    const towerRadius = 11;
    const enemyRadius = 11;
    const noBuildPadding = 10;
    const gameConfigs = window.GG_CONFIGS || null;
    if (!gameConfigs || !gameConfigs.levelConfigs || !Array.isArray(gameConfigs.enemyTypes) || !gameConfigs.waveBalance || !gameConfigs.towerCosts || !gameConfigs.towerDetails || !gameConfigs.difficultyProfiles || !gameConfigs.enemyRoleStats) {
      throw new Error("Missing GG_CONFIGS. Ensure game.config.js is loaded before game.js.");
    }
    const simulation = window.GG_SIM || null;
    if (!simulation
      || typeof simulation.computeWaveSpawnPlan !== "function"
      || typeof simulation.createEnemyEntity !== "function"
      || typeof simulation.pickTargetByProgress !== "function"
      || typeof simulation.getHitFeedbackColor !== "function") {
      throw new Error("Missing GG_SIM helpers. Ensure simulation.js is loaded before game.js.");
    }
    const combat = window.GG_COMBAT || null;
    if (!combat
      || typeof combat.spawnImpactBurst !== "function"
      || typeof combat.applyEnemyDamage !== "function"
      || typeof combat.resolveProjectileHits !== "function") {
      throw new Error("Missing GG_COMBAT helpers. Ensure combat.js is loaded before game.js.");
    }
    const persistence = window.GG_PERSIST || null;
    if (!persistence
      || typeof persistence.loadHighscores !== "function"
      || typeof persistence.saveHighscores !== "function"
      || typeof persistence.loadCompletedLevels !== "function"
      || typeof persistence.saveCompletedLevels !== "function"
      || typeof persistence.getDefaultProfileData !== "function"
      || typeof persistence.ensureCareerStats !== "function"
      || typeof persistence.loadProfileData !== "function"
      || typeof persistence.saveProfileData !== "function"
      || typeof persistence.clearRunSnapshot !== "function"
      || typeof persistence.sanitizeRunSnapshot !== "function"
      || typeof persistence.writeRunSnapshot !== "function"
      || typeof persistence.readRunSnapshot !== "function") {
      throw new Error("Missing GG_PERSIST helpers. Ensure persistence.js is loaded before game.js.");
    }
    const ui = window.GG_UI || null;
    if (!ui
      || typeof ui.computeTowerAffordability !== "function"
      || typeof ui.computeWaveBanner !== "function"
      || typeof ui.computeFlawlessChip !== "function"
      || typeof ui.computeWaveControls !== "function") {
      throw new Error("Missing GG_UI helpers. Ensure ui.js is loaded before game.js.");
    }
    const rendering = window.GG_RENDER || null;
    if (!rendering
      || typeof rendering.getTowerDockDefinitions !== "function"
      || typeof rendering.getTowerArtSources !== "function"
      || typeof rendering.shouldUseImportedTowerArt !== "function"
      || typeof rendering.drawSaltCannonArt !== "function"
      || typeof rendering.drawTowerPedestal !== "function"
      || typeof rendering.drawSprayCloudArt !== "function"
      || typeof rendering.drawGlueTowerArt !== "function"
      || typeof rendering.drawHoseTowerArt !== "function"
      || typeof rendering.renderTowerSelectorIcon !== "function"
      || typeof rendering.drawTowerRangeAndGlow !== "function"
      || typeof rendering.drawTowerLevelBadge !== "function"
      || typeof rendering.getEnemyStyle !== "function"
      || typeof rendering.getEnemyLabel !== "function"
      || typeof rendering.getPrimaryRoleChip !== "function"
      || typeof rendering.getEnemyOverlayLayout !== "function"
      || typeof rendering.drawEnemyOverlay !== "function") {
      throw new Error("Missing GG_RENDER helpers. Ensure rendering.js is loaded before game.js.");
    }
    const towerAssets = window.GG_TOWER_ASSETS || null;
    if (!towerAssets
      || typeof towerAssets.createTowerArtState !== "function"
      || typeof towerAssets.sanitizeTowerArtImage !== "function"
      || typeof towerAssets.loadTowerArtAssets !== "function"
      || typeof towerAssets.drawTowerArtSprite !== "function"
      || typeof towerAssets.ensureIconCanvas !== "function"
      || typeof towerAssets.renderTowerSelectorIcons !== "function") {
      throw new Error("Missing GG_TOWER_ASSETS helpers. Ensure tower_assets.js is loaded before game.js.");
    }
    const allowDirectLevelSelect = !!gameConfigs.allowDirectLevelSelect;
    const levelConfigs = gameConfigs.levelConfigs;

    const lanes = {};
    const lawnTexture = document.createElement("canvas");
    const soilTexture = document.createElement("canvas");
    let soilPatternCache = null;
    let soilPatternKey = "";
    const prairieBlades = [];
    const sunflowerField = [];
    const topiaryDots = [];
    const snowflakes = [];
    const winterForestTrees = [];
    const winterSnowmen = [];
    let roadShoulderColor = "rgba(93, 104, 116, 0.26)";
    let sceneTopWashGradient = null;
    let sceneVignetteGradient = null;
    const enemyTypes = gameConfigs.enemyTypes;

    const waveEl = document.getElementById("wave");
    const waveBannerEl = document.getElementById("waveBanner");
    const waveBannerTagEl = document.getElementById("waveBannerTag");
    const moneyEl = document.getElementById("money");
    const bankEl = document.getElementById("bank");
    const livesEl = document.getElementById("lives");
    const enemyCountEl = document.getElementById("enemyCount");
    const statusEl = document.getElementById("status");
    const waveCalloutEl = document.getElementById("waveCallout");
    const waveSummaryEl = document.getElementById("waveSummary");
    const waveSummaryTitleEl = document.getElementById("waveSummaryTitle");
    const waveSummaryBodyEl = document.getElementById("waveSummaryBody");
    const flawlessCalloutEl = document.getElementById("flawlessCallout");
    const scorePanelEl = document.getElementById("scorePanel");
    const scoreNameInputEl = document.getElementById("scoreNameInput");
    const submitScoreBtn = document.getElementById("submitScoreBtn");
    const highscoreListEl = document.getElementById("highscoreList");
    const badgeListEl = document.getElementById("badgeList");
    const sprayTowerBtn = document.getElementById("sprayTowerBtn");
    const glueTowerBtn = document.getElementById("glueTowerBtn");
    const hoseTowerBtn = document.getElementById("hoseTowerBtn");
    const saltTowerBtn = document.getElementById("saltTowerBtn");
    const difficultySelect = document.getElementById("difficultySelect");
    const difficultyHintEl = document.getElementById("difficultyHint");
    const levelSelect = document.getElementById("levelSelect");
    const tutorialAutoToggle = document.getElementById("tutorialAutoToggle");
    const holdPlaceToggle = document.getElementById("holdPlaceToggle");
    const levelStatEl = document.getElementById("levelStat");
    const difficultyStatEl = document.getElementById("difficultyStat");
    const instructionsBtn = document.getElementById("instructionsBtn");
    const hudMuteBtn = document.getElementById("hudMuteBtn");
    const undoPlaceBtn = document.getElementById("undoPlaceBtn");
    const audioEnabledToggle = document.getElementById("audioEnabledToggle");
    const musicEnabledToggle = document.getElementById("musicEnabledToggle");
    const sfxVolumeRange = document.getElementById("sfxVolumeRange");
    const musicVolumeRange = document.getElementById("musicVolumeRange");
    const audioTestBtn = document.getElementById("audioTestBtn");
    const helpPanelEl = document.getElementById("helpPanel");
    const scoresPanelEl = document.getElementById("scoresPanel");
    const badgesPanelEl = document.getElementById("badgesPanel");
    const landingScreenEl = document.getElementById("landingScreen");
    const landingStartBtn = document.getElementById("landingStartBtn");
    const landingResumeBtn = document.getElementById("landingResumeBtn");
    const landingDeleteRunBtn = document.getElementById("landingDeleteRunBtn");
    const landingHowToBtn = document.getElementById("landingHowToBtn");
    const landingTutorialBtn = document.getElementById("landingTutorialBtn");
    const landingLevelSelect = document.getElementById("landingLevelSelect");
    const landingContinueBtn = document.getElementById("landingContinueBtn");
    const landingHintEl = document.querySelector(".landingHint");
    const roleLegendEl = document.getElementById("roleLegend");
    const roleLegendItems = roleLegendEl ? Array.from(roleLegendEl.querySelectorAll(".roleLegendItem")) : [];
    const shellEl = document.querySelector(".shell");
    const startBtn = document.getElementById("startBtn");
    const startBtnGlyphEl = document.getElementById("startBtnGlyph");
    const startBtnMainEl = document.getElementById("startBtnMain");
    const pauseBtn = document.getElementById("pauseBtn");
    const flawlessChipEl = document.getElementById("flawlessChip");
    const flawlessChipTextEl = document.getElementById("flawlessChipText");
    const tutorialOverlayEl = document.getElementById("tutorialOverlay");
    const tutorialStepPlaceEl = document.getElementById("tutorialStepPlace");
    const tutorialStepWaveEl = document.getElementById("tutorialStepWave");
    const tutorialStepUpgradeEl = document.getElementById("tutorialStepUpgrade");
    const tutorialSkipBtn = document.getElementById("tutorialSkipBtn");
    const nextLevelBtn = document.getElementById("nextLevelBtn");
    const resetBtn = document.getElementById("resetBtn");
    const nextWaveStatEl = document.getElementById("nextWaveStat");
    const bonusWaveStatEl = document.getElementById("bonusWaveStat");
    const towerFloatCardEl = document.getElementById("towerFloatCard");
    const towerFloatUpgradeBtn = document.getElementById("towerFloatUpgradeBtn");
    const towerFloatSellBtn = document.getElementById("towerFloatSellBtn");
    const towerFloatSellLabelEl = document.getElementById("towerFloatSellLabel");
    const towerFloatSellValEl = document.getElementById("towerFloatSellVal");
    const towerFloatUpgradeValEl = document.getElementById("towerFloatUpgradeVal");
    const isCoarsePointer = (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) || (navigator.maxTouchPoints || 0) > 0;
    const pageParams = new URLSearchParams(window.location.search || "");
    const smokeMode = pageParams.get("smoke") === "1";

    let money;
    let bank;
    let lives;
    let wave;
    let enemies;
    let towers;
    let bullets;
    let gluePatches;
    let impactBursts;
    let bunnies;
    let implosions;
    let craters;
    let bunnySpawnCooldown;
    let activeSpawners;
    let spawnTimers;
    let nextEnemyId;
    let nextTowerId;
    let gameOver;
    let lastClearedWave;
    let selectedTowerType;
    let selectedTowerId;
    let frameCount;
    let gardenVegetables;
    let vegetableById;
    let nextVegetableId;
    let highscores;
    let completedLevels;
    let scoreSubmittedForWave;
    let autoWaveTimer;
    let autoWaveDueAt;
    let currentWaveEarlyStart;
    let currentWaveHasBoss;
    let currentWaveFinalBoost;
    let levelComplete;
    let nextLevelPending;
    let levelNumber;
    let difficultyKey;
    let lastRunWave;
    let lastRunMoney;
    let lastRunBank;
    let gameStarted;
    let uiFadeTimer;
    let currentWaveSpawnTotal;
    let currentWaveLaneLabel;
    let currentWaveKillCount;
    let currentWaveRewardEarned;
    let currentWaveStartLives;
    let currentWaveDamageDealt;
    let waveSummaryHideTimer;
    let waveCalloutHideTimer;
    let flawlessCalloutHideTimer;
    let flawlessChipCelebrateUntil;
    let flawlessChipCelebrateAmount;
    let waveSummaryLockUntil;
    let towerFloatHideAt;
    let towerFloatHover;
    let towerSellConfirmTowerId;
    let towerSellConfirmUntil;
    let autosaveIntervalId;
    let profileData;
    let tutorialProgress;
    let runtimeCrashed;
    let smokeHarnessRunning;
    let audioCtx;
    let audioMasterGain;
    let audioSfxGain;
    let audioMusicGain;
    let audioCompressor;
    let audioNoiseBuffer;
    let audioMusicTimer;
    let audioMusicStep;
    let audioMusicBeatMs;
    let audioMusicThemeKey;
    let lastDefeatSfxAt;
    let lastShotSfxAt;
    let lastBossHitSfxAt;
    let placementArmed;
    let lastPlacementUndo;
    let lastCanvasPointerDownAt;
    let lastCanvasPointerType;
    let lastInteractionPointerType;
    let mobilePlacementCandidate;
    let mobilePlacementCandidateAt;
    let mobilePlacementArmedAt;
    let lastTowerPlacedAt;

    const maxBitesPerVegetable = 8;
    const saveSchemaVersion = 1;
    const profileStorageKey = "garden_td_profile_v1";
    const runStorageKey = "garden_td_run_v1";
    const runBackupStorageKey = "garden_td_run_v1_backup";
    const highscoreStorageKey = "garden_td_highscores_v1";
    const levelProgressStorageKey = "garden_td_level_badges_v1";
    const earlyStartBonusPct = 0.25;
    const towerSellRate = 0.72;
    const maxBulletsOnScreen = 420;
    const mobilePlacementConfirmRadius = 28;
    const mobilePlacementConfirmWindowMs = 2600;
    const mobilePlacementArmingDelayMs = 140;
    const mobilePlacementCooldownMs = 240;
    const waveBalance = gameConfigs.waveBalance;

    const towerCosts = gameConfigs.towerCosts;

    const towerDetails = gameConfigs.towerDetails;
    const towerArtVersion = "20260222e";
    const towerArtSources = rendering.getTowerArtSources(towerArtVersion);
    const towerArtState = towerAssets.createTowerArtState(["spray", "glue", "hose", "salt"]);
    const towerArtLoadState = { pending: false, summary: null };

    const difficultyProfiles = gameConfigs.difficultyProfiles;

    const enemyRoleStats = gameConfigs.enemyRoleStats;

    function loadHighscores() {
      highscores = persistence.loadHighscores(highscoreStorageKey);
      renderHighscores();
    }

    function saveHighscores() {
      persistence.saveHighscores(highscoreStorageKey, highscores);
    }

    function loadCompletedLevels() {
      completedLevels = persistence.loadCompletedLevels(levelProgressStorageKey);
      renderBadges();
    }

    function saveCompletedLevels() {
      persistence.saveCompletedLevels(levelProgressStorageKey, completedLevels);
    }

    function getDefaultProfileData() {
      return persistence.getDefaultProfileData(saveSchemaVersion);
    }

    function ensureCareerStats(profile) {
      return persistence.ensureCareerStats(profile, getDefaultProfileData().career);
    }

    function syncLandingCareerHint() {
      if (!landingHintEl) return;
      const c = ensureCareerStats(profileData || getDefaultProfileData());
      landingHintEl.textContent = `Tip: Build towers, start waves early for +25% bonus, and bank leftover money. Career: Waves ${c.wavesCleared} | Bugs ${c.bugsDefeated} | Banked $${c.bankedTotal} | Best Wave ${c.bestWave}.`;
    }

    function loadProfileData() {
      const loaded = persistence.loadProfileData({
        key: profileStorageKey,
        saveSchemaVersion,
        defaults: getDefaultProfileData(),
        levelExists: (level) => !!levelConfigs[Number(level)],
        difficultyExists: (key) => !!difficultyProfiles[key]
      });
      profileData = loaded;
      return loaded;
    }

    function saveProfileData() {
      if (!profileData) profileData = getDefaultProfileData();
      ensureCareerStats(profileData);
      profileData.version = saveSchemaVersion;
      profileData.lastDifficulty = difficultyKey || profileData.lastDifficulty || "normal";
      profileData.lastLevel = Number(levelNumber) || profileData.lastLevel || 1;
      if (scoreNameInputEl && scoreNameInputEl.value && scoreNameInputEl.value.trim()) {
        profileData.lastPlayerName = scoreNameInputEl.value.trim().slice(0, 18);
      }
      const ok = persistence.saveProfileData(profileStorageKey, profileData);
      if (!ok) {
        setStatus("Profile save failed: browser storage is full.", "danger");
      }
      syncLandingCareerHint();
    }

    function updateAudioGains() {
      if (!audioMasterGain || !audioSfxGain || !audioMusicGain || !profileData) return;
      const audioOn = !!profileData.audioEnabled;
      const now = audioCtx ? audioCtx.currentTime : 0;
      audioMasterGain.gain.cancelScheduledValues(now);
      audioSfxGain.gain.cancelScheduledValues(now);
      audioMusicGain.gain.cancelScheduledValues(now);
      audioMasterGain.gain.setTargetAtTime(audioOn ? 0.95 : 0.0001, now, 0.04);
      audioSfxGain.gain.setTargetAtTime(Math.max(0.0001, Math.min(1, Number(profileData.sfxVolume) || 0.65)), now, 0.05);
      audioMusicGain.gain.setTargetAtTime(Math.max(0.0001, Math.min(1, Number(profileData.musicVolume) || 0.3)), now, 0.08);
    }

    function getAudioThemeKey() {
      const cfg = getCurrentLevelConfig();
      if (cfg.terrain === "snow") return "winter";
      if (cfg.terrain === "desert") return "desert";
      if (cfg.terrain === "prairie") return "prairie";
      if (cfg.flowerTheme === "topiary") return "topiary";
      return "garden";
    }

    function getMusicThemeProfile() {
      const key = getAudioThemeKey();
      if (key === "winter") {
        return { key, stepMs: 1020, notes: [261.63, 329.63, 392, 349.23, 329.63, 293.66, 261.63, 246.94], bass: [130.81, 146.83, 164.81, 146.83], waveA: "triangle", waveB: "sine" };
      }
      if (key === "desert") {
        return { key, stepMs: 900, notes: [220, 246.94, 293.66, 261.63, 246.94, 220, 196, 220], bass: [110, 123.47, 98, 110], waveA: "sawtooth", waveB: "triangle" };
      }
      if (key === "prairie") {
        return { key, stepMs: 940, notes: [246.94, 293.66, 329.63, 293.66, 261.63, 293.66, 329.63, 392], bass: [98, 110, 123.47, 110], waveA: "sine", waveB: "triangle" };
      }
      if (key === "topiary") {
        return { key, stepMs: 860, notes: [261.63, 329.63, 392, 523.25, 392, 329.63, 293.66, 261.63], bass: [130.81, 164.81, 146.83, 130.81], waveA: "triangle", waveB: "square" };
      }
      return { key: "garden", stepMs: 950, notes: [220, 261.63, 293.66, 329.63, 392, 329.63, 293.66, 261.63], bass: [110, 130.81, 146.83, 130.81], waveA: "sine", waveB: "triangle" };
    }

    function buildNoiseBuffer() {
      if (!audioCtx || audioNoiseBuffer) return;
      const duration = 0.24;
      const len = Math.max(1, Math.floor(audioCtx.sampleRate * duration));
      const buf = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i += 1) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / len);
      }
      audioNoiseBuffer = buf;
    }

    function ensureAudioContext() {
      if (!window.AudioContext && !window.webkitAudioContext) return false;
      if (!audioCtx) {
        try {
          const Ctx = window.AudioContext || window.webkitAudioContext;
          audioCtx = new Ctx();
          audioMasterGain = audioCtx.createGain();
          audioSfxGain = audioCtx.createGain();
          audioMusicGain = audioCtx.createGain();
          audioCompressor = audioCtx.createDynamicsCompressor();
          audioCompressor.threshold.value = -22;
          audioCompressor.knee.value = 22;
          audioCompressor.ratio.value = 3;
          audioCompressor.attack.value = 0.01;
          audioCompressor.release.value = 0.2;
          audioSfxGain.connect(audioMasterGain);
          audioMusicGain.connect(audioMasterGain);
          audioMasterGain.connect(audioCompressor);
          audioCompressor.connect(audioCtx.destination);
          audioMusicStep = 0;
          audioMusicBeatMs = 950;
          audioMusicThemeKey = "";
          lastDefeatSfxAt = 0;
          lastBossHitSfxAt = 0;
          lastShotSfxAt = { spray: 0, glue: 0, hose: 0, salt: 0 };
          buildNoiseBuffer();
          updateAudioGains();
        } catch (err) {
          audioCtx = null;
          audioMasterGain = null;
          audioSfxGain = null;
          audioMusicGain = null;
          audioCompressor = null;
          const msg = err && err.message ? err.message : "unknown";
          console.warn(`[audio] Audio context unavailable: ${msg}`);
          return false;
        }
      }
      if (audioCtx.state === "suspended") {
        audioCtx.resume().catch(() => {});
      }
      return audioCtx.state === "running";
    }

    function playTone(freq, duration = 0.08, type = "triangle", volume = 0.22, endFreq = null, bus = "sfx") {
      if (!profileData?.audioEnabled) return;
      if (!audioCtx || audioCtx.state !== "running") return;
      const targetBus = bus === "music" ? audioMusicGain : audioSfxGain;
      if (!targetBus) return;
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(Math.max(40, freq), now);
      if (endFreq) osc.frequency.exponentialRampToValueAtTime(Math.max(40, endFreq), now + duration);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), now + Math.min(0.03, duration * 0.4));
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(gain);
      gain.connect(targetBus);
      osc.start(now);
      osc.stop(now + duration + 0.02);
    }

    function playNoiseBurst(duration = 0.08, volume = 0.2, hpFreq = 1200, lpFreq = 5200) {
      if (!profileData?.audioEnabled) return;
      if (!audioCtx || audioCtx.state !== "running" || !audioNoiseBuffer) return;
      const now = audioCtx.currentTime;
      const src = audioCtx.createBufferSource();
      src.buffer = audioNoiseBuffer;
      const hp = audioCtx.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.setValueAtTime(hpFreq, now);
      const lp = audioCtx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.setValueAtTime(lpFreq, now);
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), now + Math.min(0.018, duration * 0.35));
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      src.connect(hp);
      hp.connect(lp);
      lp.connect(gain);
      gain.connect(audioSfxGain);
      src.start(now);
      src.stop(now + duration + 0.03);
    }

    function playSfx(kind) {
      if (!profileData?.audioEnabled) return;
      if (!audioCtx || audioCtx.state !== "running") return;
      if (kind === "place") {
        playTone(430, 0.05, "triangle", 0.12, 360);
        playTone(620, 0.035, "sine", 0.09, 560);
      } else if (kind === "upgrade") {
        playTone(520, 0.045, "triangle", 0.13, 640);
        playTone(740, 0.055, "sine", 0.12, 900);
      } else if (kind === "waveStart") {
        playTone(300, 0.08, "triangle", 0.12, 380);
      } else if (kind === "bossStart") {
        playTone(190, 0.13, "sawtooth", 0.18, 150);
        playTone(140, 0.14, "square", 0.12, 120);
      } else if (kind === "waveClear") {
        playTone(520, 0.06, "triangle", 0.12, 660);
        playTone(660, 0.07, "sine", 0.09, 780);
      } else if (kind === "gameOver") {
        playTone(260, 0.13, "square", 0.13, 150);
      } else if (kind === "sprayShot") {
        playNoiseBurst(0.052, 0.06, 1800, 6800);
        playTone(1500, 0.025, "triangle", 0.04, 1200);
      } else if (kind === "glueShot") {
        playNoiseBurst(0.065, 0.075, 500, 2200);
        playTone(190, 0.05, "sine", 0.055, 130);
      } else if (kind === "hoseShot") {
        // Water jet: broad low-mid whoosh with a softer airy tail.
        playNoiseBurst(0.34, 0.29, 180, 2400);
        playNoiseBurst(0.24, 0.2, 240, 3400);
        playTone(130, 0.07, "sine", 0.016, 86);
        playTone(92, 0.09, "triangle", 0.013, 74);
      } else if (kind === "saltShot") {
        // Salt rifle: snappy compressed blast.
        playNoiseBurst(0.17, 0.15, 420, 5200);
        playNoiseBurst(0.13, 0.11, 700, 6800);
        playNoiseBurst(0.1, 0.075, 1000, 8200);
        playTone(120, 0.04, "triangle", 0.015, 95);
      } else if (kind === "bossHit") {
        const nowMs = Date.now();
        if (nowMs - (lastBossHitSfxAt || 0) < 95) return;
        lastBossHitSfxAt = nowMs;
        playTone(240, 0.045, "square", 0.065, 190);
      } else if (kind === "defeat") {
        const nowMs = Date.now();
        if (nowMs - (lastDefeatSfxAt || 0) < 105) return;
        lastDefeatSfxAt = nowMs;
        playTone(720, 0.038, "triangle", 0.062, 610);
      }
    }

    function playTowerShotSfx(type) {
      if (!lastShotSfxAt) return;
      const nowMs = Date.now();
      const minGap = type === "spray" ? 85 : (type === "glue" ? 150 : (type === "salt" ? 135 : 120));
      if (nowMs - (lastShotSfxAt[type] || 0) < minGap) return;
      lastShotSfxAt[type] = nowMs;
      if (type === "spray") playSfx("sprayShot");
      else if (type === "glue") playSfx("glueShot");
      else if (type === "salt") playSfx("saltShot");
      else if (type === "hose") playSfx("hoseShot");
    }

    function playMusicStep() {
      if (!profileData?.audioEnabled || !profileData?.musicEnabled) return;
      if (!audioCtx || audioCtx.state !== "running") return;
      const theme = getMusicThemeProfile();
      const n = theme.notes[audioMusicStep % theme.notes.length];
      const b = theme.bass[audioMusicStep % theme.bass.length];
      playTone(n, 0.46, theme.waveA, 0.055, null, "music");
      playTone(n * 1.5, 0.18, "sine", 0.018, null, "music");
      playTone(b, 0.5, theme.waveB, 0.033, null, "music");
      audioMusicStep += 1;
    }

    function updateMusicPlayback() {
      const shouldPlay = !!(profileData?.audioEnabled && profileData?.musicEnabled && gameStarted && !gameOver);
      const theme = getMusicThemeProfile();
      const beatMs = theme.stepMs;
      const themeChanged = audioMusicThemeKey !== theme.key || audioMusicBeatMs !== beatMs;
      if (shouldPlay) {
        if (audioMusicTimer && themeChanged) {
          clearInterval(audioMusicTimer);
          audioMusicTimer = null;
        }
        if (!audioMusicTimer) {
          audioMusicThemeKey = theme.key;
          audioMusicBeatMs = beatMs;
          audioMusicTimer = setInterval(() => {
            playMusicStep();
          }, beatMs);
          playMusicStep();
        }
      } else if (audioMusicTimer) {
        clearInterval(audioMusicTimer);
        audioMusicTimer = null;
      }
    }

    function unlockAudioFromGesture() {
      const ok = ensureAudioContext();
      if (ok) updateMusicPlayback();
      document.removeEventListener("pointerdown", unlockAudioFromGesture);
      document.removeEventListener("keydown", unlockAudioFromGesture);
      document.removeEventListener("touchstart", unlockAudioFromGesture);
    }

    function syncAudioUi() {
      if (audioEnabledToggle) audioEnabledToggle.checked = profileData?.audioEnabled !== false;
      if (musicEnabledToggle) musicEnabledToggle.checked = profileData?.musicEnabled !== false;
      if (holdPlaceToggle) holdPlaceToggle.checked = !!profileData?.mobileHoldToPlace;
      if (sfxVolumeRange) sfxVolumeRange.value = String(Math.round((Number(profileData?.sfxVolume) || 0.65) * 100));
      if (musicVolumeRange) musicVolumeRange.value = String(Math.round((Number(profileData?.musicVolume) || 0.3) * 100));
      if (hudMuteBtn) hudMuteBtn.textContent = profileData?.audioEnabled === false ? "Unmute" : "Mute";
    }

    function updatePlacementUndoUi() {
      if (!undoPlaceBtn) return;
      if (!gameStarted || !lastPlacementUndo) {
        undoPlaceBtn.hidden = true;
        return;
      }
      const remainingMs = lastPlacementUndo.expiresAt - Date.now();
      if (remainingMs <= 0) {
        lastPlacementUndo = null;
        undoPlaceBtn.hidden = true;
        return;
      }
      const sec = Math.max(1, Math.ceil(remainingMs / 1000));
      undoPlaceBtn.hidden = false;
      undoPlaceBtn.disabled = false;
      undoPlaceBtn.textContent = `Undo Place (${sec})`;
    }

    function registerPlacementUndo(towerId, refund, type) {
      lastPlacementUndo = {
        towerId,
        refund,
        type,
        expiresAt: Date.now() + 3200
      };
      updatePlacementUndoUi();
    }

    function undoLastPlacement() {
      if (!lastPlacementUndo) return;
      const item = lastPlacementUndo;
      if (Date.now() > item.expiresAt) {
        lastPlacementUndo = null;
        updatePlacementUndoUi();
        return;
      }
      const tower = towers.find(t => t.id === item.towerId);
      if (!tower) {
        lastPlacementUndo = null;
        updatePlacementUndoUi();
        return;
      }
      if ((tower.totalSpent || 0) !== item.refund || tower.level !== 1) {
        setStatus("Undo unavailable after tower changes.", "warn");
        lastPlacementUndo = null;
        updatePlacementUndoUi();
        return;
      }
      towers = towers.filter(t => t.id !== item.towerId);
      if (selectedTowerId === item.towerId) selectedTowerId = null;
      money += item.refund;
      lastPlacementUndo = null;
      setStatus(`Placement undone: refunded $${item.refund}.`, "good");
      syncHUD();
      saveRunSnapshot();
    }

    function getDefaultTutorialProgress() {
      return {
        active: false,
        forced: false,
        placedTower: false,
        startedWave: false,
        upgradedTower: false
      };
    }

    function renderTutorialProgress() {
      if (!tutorialOverlayEl) return;
      const active = !!tutorialProgress?.active;
      tutorialOverlayEl.hidden = !active;
      if (tutorialStepPlaceEl) tutorialStepPlaceEl.classList.toggle("done", !!tutorialProgress?.placedTower);
      if (tutorialStepWaveEl) tutorialStepWaveEl.classList.toggle("done", !!tutorialProgress?.startedWave);
      if (tutorialStepUpgradeEl) tutorialStepUpgradeEl.classList.toggle("done", !!tutorialProgress?.upgradedTower);
    }

    function completeTutorialProgress() {
      if (!tutorialProgress) tutorialProgress = getDefaultTutorialProgress();
      tutorialProgress.active = false;
      tutorialProgress.forced = false;
      if (!profileData) profileData = getDefaultProfileData();
      if (!profileData.tutorialSeen) {
        profileData.tutorialSeen = true;
        saveProfileData();
      }
      renderTutorialProgress();
      setStatus("Quick start complete. You are ready for campaign play.", "good");
    }

    function markTutorialProgress(step) {
      if (!tutorialProgress?.active) return;
      if (step === "placedTower") tutorialProgress.placedTower = true;
      if (step === "startedWave") tutorialProgress.startedWave = true;
      if (step === "upgradedTower") tutorialProgress.upgradedTower = true;
      renderTutorialProgress();
      if (tutorialProgress.placedTower && tutorialProgress.startedWave && tutorialProgress.upgradedTower) {
        completeTutorialProgress();
      }
    }

    function startTutorialProgress(forced = false) {
      tutorialProgress = getDefaultTutorialProgress();
      tutorialProgress.active = true;
      tutorialProgress.forced = !!forced;
      renderTutorialProgress();
      setStatus("Quick start: Place a tower, start Wave 1, then upgrade a tower.", "warn");
    }

    function hideTutorialProgress(markSeen = false) {
      if (!tutorialProgress) tutorialProgress = getDefaultTutorialProgress();
      tutorialProgress.active = false;
      tutorialProgress.forced = false;
      renderTutorialProgress();
      if (markSeen) {
        if (!profileData) profileData = getDefaultProfileData();
        profileData.tutorialSeen = true;
        saveProfileData();
      }
    }

    function clearRunSnapshot() {
      persistence.clearRunSnapshot(runStorageKey, runBackupStorageKey);
    }

    function sanitizeRunSnapshot(parsed) {
      return persistence.sanitizeRunSnapshot({
        parsed,
        saveSchemaVersion,
        levelExists: (level) => !!levelConfigs[Number(level)],
        difficultyExists: (key) => !!difficultyProfiles[key],
        defaultTutorialProgress: getDefaultTutorialProgress()
      });
    }

    function buildRunSnapshot() {
      const autoWaveRemainingMs = autoWaveTimer && autoWaveDueAt > 0 ? Math.max(0, autoWaveDueAt - Date.now()) : 0;
      return {
        version: saveSchemaVersion,
        savedAt: Date.now(),
        gameStarted,
        gameOver,
        levelComplete,
        levelNumber,
        difficultyKey,
        money,
        bank,
        lives,
        wave,
        lastClearedWave,
        selectedTowerType,
        selectedTowerId,
        frameCount,
        nextEnemyId,
        nextTowerId,
        nextVegetableId,
        bunnySpawnCooldown,
        autoWaveRemainingMs,
        currentWaveEarlyStart,
        currentWaveHasBoss,
        currentWaveFinalBoost,
        currentWaveSpawnTotal,
        currentWaveLaneLabel,
        currentWaveKillCount,
        currentWaveRewardEarned,
        currentWaveStartLives,
        currentWaveDamageDealt,
        nextLevelPending,
        tutorialProgress,
        towers,
        enemies,
        gluePatches,
        craters,
        gardenVegetables
      };
    }

    function saveRunSnapshot() {
      if (!gameStarted) return;
      if (gameOver || levelComplete) {
        clearRunSnapshot();
        syncResumeAvailability();
        return;
      }
      const snapshot = buildRunSnapshot();
      const ok = persistence.writeRunSnapshot(runStorageKey, runBackupStorageKey, snapshot);
      if (!ok) {
        setStatus("Autosave failed: browser storage is full.", "danger");
      }
      syncResumeAvailability();
    }

    function loadRunSnapshot() {
      const loaded = persistence.readRunSnapshot(runStorageKey, runBackupStorageKey, sanitizeRunSnapshot);
      if (!loaded || !loaded.snapshot) return null;
      if (loaded.recovered) {
        setStatus("Recovered your run from backup save.", "warn");
      }
      return loaded.snapshot;
    }

    function syncResumeAvailability() {
      if (!landingResumeBtn && !landingDeleteRunBtn) return;
      const canResume = !!loadRunSnapshot();
      if (landingResumeBtn) {
        landingResumeBtn.disabled = !canResume;
        landingResumeBtn.setAttribute("aria-disabled", canResume ? "false" : "true");
        landingResumeBtn.title = canResume ? "Continue your saved in-progress run" : "No saved run available";
      }
      if (landingDeleteRunBtn) {
        landingDeleteRunBtn.disabled = !canResume;
        landingDeleteRunBtn.setAttribute("aria-disabled", canResume ? "false" : "true");
        landingDeleteRunBtn.title = canResume ? "Delete your saved in-progress run" : "No saved run available";
      }
    }

    function renderBadges() {
      if (!badgeListEl) return;
      badgeListEl.innerHTML = "";
      if (!completedLevels || completedLevels.length === 0) {
        const empty = document.createElement("span");
        empty.textContent = "No level badges yet.";
        badgeListEl.appendChild(empty);
        return;
      }
      for (const lv of completedLevels) {
        const cfg = levelConfigs[lv];
        const style = cfg
          ? { petal: cfg.badgePetal, center: cfg.badgeCenter, name: cfg.badgeName }
          : { petal: "#d0d7e6", center: "#3b3f4f", name: "Flower Badge" };
        const badge = document.createElement("span");
        badge.className = "levelBadge";
        const icon = document.createElement("span");
        icon.className = "flowerBadge";
        icon.style.setProperty("--petal", style.petal);
        icon.style.setProperty("--center", style.center);
        const label = document.createElement("span");
        label.textContent = `Level ${lv}: ${style.name}`;
        badge.appendChild(icon);
        badge.appendChild(label);
        badgeListEl.appendChild(badge);
      }
    }

    function awardLevelBadge(level) {
      if (!completedLevels.includes(level)) {
        completedLevels.push(level);
        completedLevels.sort((a, b) => a - b);
        saveCompletedLevels();
        renderBadges();
      }
    }

    function getScoreBankValue(entry) {
      return Number(entry?.bank ?? entry?.money ?? 0) || 0;
    }

    function compareScores(a, b) {
      if (b.wave !== a.wave) return b.wave - a.wave;
      const bankA = getScoreBankValue(a);
      const bankB = getScoreBankValue(b);
      if (bankB !== bankA) return bankB - bankA;
      return (a.ts || 0) - (b.ts || 0);
    }

    function getProspectiveRank(waveValue, bankValue) {
      const probe = { name: "__probe__", wave: waveValue, bank: bankValue, ts: Date.now() };
      const merged = [...highscores, probe].sort(compareScores);
      const idx = merged.findIndex(s => s === probe);
      return idx >= 0 && idx < 10 ? idx + 1 : -1;
    }

    function renderHighscores() {
      highscoreListEl.innerHTML = "";
      const top = highscores.slice(0, 10);
      if (top.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No scores yet.";
        highscoreListEl.appendChild(li);
        return;
      }
      for (const s of top) {
        const li = document.createElement("li");
        li.textContent = `${s.name} - Wave ${s.wave}, Bank $${getScoreBankValue(s)}`;
        highscoreListEl.appendChild(li);
      }
    }

    function canSubmitScoreForCurrentRun() {
      return !!(gameOver || (levelComplete && !nextLevelPending));
    }

    function submitHighscore() {
      const name = (scoreNameInputEl.value || "").trim();
      if (!canSubmitScoreForCurrentRun()) {
        setStatus("Finish the run first, then submit your score.", "warn");
        return;
      }
      if (scoreSubmittedForWave || wave <= 0) {
        setStatus("Score already submitted for this run.", "warn");
        return;
      }
      if (!name) {
        setStatus("Enter your name to submit a score.", "danger");
        return;
      }

      highscores.push({
        name: name.slice(0, 18),
        wave: lastRunWave,
        bank: lastRunBank,
        money: lastRunMoney,
        ts: Date.now()
      });
      highscores.sort(compareScores);
      highscores = highscores.slice(0, 10);
      if (name) {
        if (!profileData) profileData = getDefaultProfileData();
        profileData.lastPlayerName = name.slice(0, 18);
      }
      saveProfileData();
      saveHighscores();
      renderHighscores();
      scoreSubmittedForWave = true;
      if (scoresPanelEl) scoresPanelEl.open = true;
      setStatus(`Score submitted: ${name} - Wave ${lastRunWave}, Bank $${lastRunBank}.`, "good");
    }

    function buildGardenVegetables() {
      const bedX = canvas.width - 178;
      const bedY = 6;
      const bedH = canvas.height - 12;
      const rowTop = bedY + 44;
      const rowBottom = bedY + bedH - 26;
      const rowStep = 56;
      const veggies = [];

      for (let y = rowTop; y <= rowBottom; y += rowStep) {
        veggies.push({ id: nextVegetableId++, type: "carrot", x: bedX + 40, y, bites: 0, chewFlash: 0, gone: false, reservedBy: null });
        veggies.push({ id: nextVegetableId++, type: "tomato", x: bedX + 88, y, bites: 0, chewFlash: 0, gone: false, reservedBy: null });
        veggies.push({ id: nextVegetableId++, type: "lettuce", x: bedX + 136, y, bites: 0, chewFlash: 0, gone: false, reservedBy: null });
      }
      return veggies;
    }

    function rebuildVegetableIndex() {
      vegetableById = new Map();
      for (const v of gardenVegetables || []) {
        vegetableById.set(v.id, v);
      }
    }

    function getVegetableById(id) {
      return vegetableById ? (vegetableById.get(id) || null) : null;
    }

    function getAssignableVegetable() {
      for (const v of gardenVegetables) {
        if (!v.gone && v.reservedBy === null) return v;
      }
      return null;
    }

    function releaseVegetableReservation(enemy) {
      if (!enemy.targetVegetableId) return;
      const v = getVegetableById(enemy.targetVegetableId);
      if (v && v.reservedBy === enemy.id) v.reservedBy = null;
    }

    function getDefaultWavesForLevel(level) {
      return 10 + Math.max(0, level - 1) * 2;
    }

    function getCurrentLevelConfig() {
      const baseCfg = levelConfigs[levelNumber] || levelConfigs[1];
      const waves = Number.isFinite(baseCfg.waves) ? baseCfg.waves : getDefaultWavesForLevel(levelNumber || 1);
      return { ...baseCfg, waves };
    }

    function getSortedLevelIds() {
      return Object.keys(levelConfigs).map(v => Number(v)).sort((a, b) => a - b);
    }

    function getNextLevelNumber(level) {
      const ids = getSortedLevelIds();
      const idx = ids.indexOf(level);
      if (idx < 0 || idx >= ids.length - 1) return null;
      return ids[idx + 1];
    }

    function isLevelUnlocked(level, levelIds) {
      const all = levelIds || getSortedLevelIds();
      return allowDirectLevelSelect || level === all[0] || completedLevels.includes(level - 1);
    }

    function populateLevelSelect() {
      if (!levelSelect) return;
      levelSelect.innerHTML = "";
      const levelIds = getSortedLevelIds();
      let highestUnlocked = levelIds[0] || 1;
      for (const id of levelIds) {
        const cfg = levelConfigs[id];
        const opt = document.createElement("option");
        opt.value = String(id);
        opt.textContent = `Level ${id}`;
        opt.title = cfg.name;
        const unlocked = isLevelUnlocked(id, levelIds);
        opt.disabled = !unlocked;
        if (unlocked) highestUnlocked = id;
        levelSelect.appendChild(opt);
      }
      if (!levelNumber || !levelConfigs[levelNumber]) levelNumber = levelIds[0] || 1;
      const chosenOpt = levelSelect.querySelector(`option[value="${levelNumber}"]`);
      if (!chosenOpt || chosenOpt.disabled) levelNumber = highestUnlocked;
      levelSelect.value = String(levelNumber);
    }

    function populateLandingLevelSelect() {
      if (!landingLevelSelect) return;
      landingLevelSelect.innerHTML = "";
      const levelIds = getSortedLevelIds();
      let highestUnlocked = levelIds[0] || 1;
      for (const id of levelIds) {
        const cfg = levelConfigs[id];
        const opt = document.createElement("option");
        opt.value = String(id);
        opt.textContent = `Level ${id}`;
        opt.title = cfg.name;
        const unlocked = isLevelUnlocked(id, levelIds);
        opt.disabled = !unlocked;
        if (unlocked) highestUnlocked = id;
        landingLevelSelect.appendChild(opt);
      }
      const selected = landingLevelSelect.querySelector(`option[value="${levelNumber}"]`);
      landingLevelSelect.value = selected && !selected.disabled ? String(levelNumber) : String(highestUnlocked);
    }

    function getDifficultyProfile() {
      return difficultyProfiles[difficultyKey] || difficultyProfiles.normal;
    }

    function getBossWaveInterval(lvl = getCurrentLevelConfig(), profile = getDifficultyProfile()) {
      const levelBossEvery = Number(lvl?.bossEvery);
      const fallback = Number(profile?.bossEvery) || 5;
      const resolved = Number.isFinite(levelBossEvery) && levelBossEvery > 0 ? levelBossEvery : fallback;
      return Math.max(2, Math.round(resolved));
    }

    function getDifficultyDescriptor(key = difficultyKey) {
      if (key === "easy") return "more money, slower waves, fewer bosses";
      if (key === "hard") return "tighter economy, denser waves, frequent bosses";
      return "balanced pacing and progression";
    }

    function syncDifficultyHint() {
      if (!difficultyHintEl) return;
      const profile = getDifficultyProfile();
      difficultyHintEl.textContent = `${profile.label}: ${getDifficultyDescriptor(difficultyKey)}.`;
    }

    function getBunnyCooldown(profile = getDifficultyProfile()) {
      const base = Math.max(120, Math.round(profile.bunnyCooldownBase || 360));
      const jitter = Math.max(0, Math.round(profile.bunnyCooldownJitter || 240));
      return base + Math.floor(Math.random() * (jitter + 1));
    }

    function getWaveEnemyWeights(cfg, waveNumber) {
      const base = cfg?.enemyWeights || {};
      const defaultWeight = { aphid: 1, mantis: 1, locust: 1, ladybug: 1, caterpillar: 1 };
      const mergedBase = {
        aphid: Math.max(0, Number(base.aphid ?? defaultWeight.aphid)),
        mantis: Math.max(0, Number(base.mantis ?? defaultWeight.mantis)),
        locust: Math.max(0, Number(base.locust ?? defaultWeight.locust)),
        ladybug: Math.max(0, Number(base.ladybug ?? defaultWeight.ladybug)),
        caterpillar: Math.max(0, Number(base.caterpillar ?? defaultWeight.caterpillar))
      };
      let unlockMask;
      if (waveNumber <= 2) {
        unlockMask = { aphid: 1, locust: 1, mantis: 0, ladybug: 0, caterpillar: 0 };
      } else if (waveNumber <= 4) {
        unlockMask = { aphid: 1, locust: 1, mantis: 0, ladybug: 0, caterpillar: 0.8 };
      } else if (waveNumber <= 6) {
        unlockMask = { aphid: 1, locust: 1, mantis: 0.8, ladybug: 0.65, caterpillar: 1 };
      } else {
        unlockMask = { aphid: 1, locust: 1, mantis: 1, ladybug: 1, caterpillar: 1 };
      }
      const resolved = {};
      for (const type of enemyTypes) {
        resolved[type] = mergedBase[type] * (unlockMask[type] || 0);
      }
      let total = 0;
      for (const type of enemyTypes) total += resolved[type];
      if (total <= 0) return mergedBase;
      return resolved;
    }

    function pickEnemyTypeForLevel(cfg, waveNumber) {
      const weights = getWaveEnemyWeights(cfg, waveNumber);
      if (!weights) return enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
      let total = 0;
      for (const type of enemyTypes) total += Math.max(0, Number(weights[type] || 0));
      if (total <= 0) return enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
      let roll = Math.random() * total;
      for (const type of enemyTypes) {
        roll -= Math.max(0, Number(weights[type] || 0));
        if (roll <= 0) return type;
      }
      return enemyTypes[0];
    }

    function resetGame(keepBank = false) {
      const profile = getDifficultyProfile();
      money = Math.max(20, Math.round(profile.startMoney));
      if (!keepBank) bank = 0;
      wave = 0;
      enemies = [];
      towers = [];
      bullets = [];
      gluePatches = [];
      impactBursts = [];
      bunnies = [];
      implosions = [];
      craters = [];
      bunnySpawnCooldown = getBunnyCooldown(profile);
      if (spawnTimers) {
        for (const timer of spawnTimers) clearInterval(timer);
      }
      if (autoWaveTimer) {
        clearTimeout(autoWaveTimer);
        autoWaveTimer = null;
      }
      autoWaveDueAt = 0;
      currentWaveHasBoss = false;
      activeSpawners = 0;
      spawnTimers = new Set();
      nextEnemyId = 1;
      nextTowerId = 1;
      nextVegetableId = 1;
      gameOver = false;
      lastClearedWave = 0;
      selectedTowerType = "spray";
      placementArmed = !isCoarsePointer;
      lastPlacementUndo = null;
      lastCanvasPointerDownAt = 0;
      lastCanvasPointerType = "";
      lastInteractionPointerType = "";
      mobilePlacementCandidate = null;
      mobilePlacementCandidateAt = 0;
      mobilePlacementArmedAt = 0;
      lastTowerPlacedAt = 0;
      selectedTowerId = null;
      frameCount = 0;
      scoreSubmittedForWave = false;
      autoWaveDueAt = 0;
      currentWaveEarlyStart = false;
      currentWaveHasBoss = false;
      currentWaveFinalBoost = false;
      levelComplete = false;
      nextLevelPending = null;
      difficultyStatEl.textContent = profile.label;
      syncDifficultyHint();
      lastRunWave = 0;
      lastRunMoney = 0;
      lastRunBank = keepBank ? bank : 0;
      currentWaveSpawnTotal = 0;
      currentWaveLaneLabel = "";
      currentWaveKillCount = 0;
      currentWaveRewardEarned = 0;
      currentWaveStartLives = lives || 0;
      currentWaveDamageDealt = 0;
      flawlessChipCelebrateUntil = 0;
      flawlessChipCelebrateAmount = 0;
      waveSummaryLockUntil = 0;
      towerFloatHideAt = 0;
      towerFloatHover = false;
      towerSellConfirmTowerId = null;
      towerSellConfirmUntil = 0;
      tutorialProgress = getDefaultTutorialProgress();
      runtimeCrashed = false;
      scorePanelEl.style.display = "none";
      if (helpPanelEl) helpPanelEl.open = false;
      if (scoresPanelEl) scoresPanelEl.open = false;
      if (badgesPanelEl) badgesPanelEl.open = false;
      if (waveSummaryHideTimer) {
        clearTimeout(waveSummaryHideTimer);
        waveSummaryHideTimer = null;
      }
      if (waveCalloutHideTimer) {
        clearTimeout(waveCalloutHideTimer);
        waveCalloutHideTimer = null;
      }
      if (flawlessCalloutHideTimer) {
        clearTimeout(flawlessCalloutHideTimer);
        flawlessCalloutHideTimer = null;
      }
      flawlessChipCelebrateUntil = 0;
      flawlessChipCelebrateAmount = 0;
      if (waveSummaryEl) waveSummaryEl.classList.remove("show");
      if (waveCalloutEl) {
        waveCalloutEl.classList.remove("show", "boss", "final");
        waveCalloutEl.textContent = "";
      }
      if (flawlessCalloutEl) flawlessCalloutEl.classList.remove("show");
      if (shellEl) shellEl.classList.remove("uiQuiet");
      renderTutorialProgress();
      if (uiFadeTimer) {
        clearTimeout(uiFadeTimer);
        uiFadeTimer = null;
      }
      buildPathData();
      buildLawnTexture();
      gardenVegetables = buildGardenVegetables();
      rebuildVegetableIndex();
      lives = gardenVegetables.length;
      currentWaveStartLives = lives;
      syncTowerSelectionUI();
      setStatus("Build defenses, then start Wave 1.", "warn");
      syncHUD();
      updateMusicPlayback();
      saveProfileData();
      saveRunSnapshot();
    }

    function beginGameFromLanding(forceTutorial = false) {
      gameStarted = true;
      if (landingScreenEl) landingScreenEl.style.display = "none";
      if (shellEl) shellEl.classList.remove("paused");
      updateMusicPlayback();
      const autoTutorial = !!profileData?.tutorialAutoStart;
      if (forceTutorial || autoTutorial || !profileData?.tutorialSeen) {
        startTutorialProgress(forceTutorial || autoTutorial);
      } else {
        hideTutorialProgress(false);
        setStatus("Build defenses, then start Wave 1.", "warn");
      }
      syncHUD();
      saveProfileData();
      saveRunSnapshot();
    }

    function startNewGameFromLanding() {
      levelNumber = 1;
      if (levelSelect) levelSelect.value = "1";
      if (landingLevelSelect) landingLevelSelect.value = "1";
      resetGame(false);
      beginGameFromLanding(false);
      if (!tutorialProgress?.active) setStatus(`Level 1 started: ${getCurrentLevelConfig().name}.`, "good");
    }

    function startQuickStartFromLanding() {
      levelNumber = 1;
      if (levelSelect) levelSelect.value = "1";
      if (landingLevelSelect) landingLevelSelect.value = "1";
      resetGame(false);
      beginGameFromLanding(true);
      setStatus("Quick start active: place, start, upgrade.", "warn");
    }

    function continueCampaignFromLanding() {
      const chosen = Number(landingLevelSelect?.value) || 1;
      const levelIds = getSortedLevelIds();
      const fallback = levelIds[0] || 1;
      const target = isLevelUnlocked(chosen, levelIds) ? chosen : fallback;
      levelNumber = target;
      if (levelSelect) levelSelect.value = String(levelNumber);
      if (landingLevelSelect) landingLevelSelect.value = String(levelNumber);
      resetGame(true);
      beginGameFromLanding(false);
      if (!tutorialProgress?.active) setStatus(`Campaign level selected: Level ${levelNumber} (${getCurrentLevelConfig().name}).`, "good");
    }

    function applyRunSnapshot(run) {
      if (!run) return false;
      if (spawnTimers) {
        for (const timer of spawnTimers) clearInterval(timer);
      }
      if (autoWaveTimer) {
        clearTimeout(autoWaveTimer);
        autoWaveTimer = null;
      }
      spawnTimers = new Set();
      activeSpawners = 0;

      levelNumber = Number(run.levelNumber) || 1;
      difficultyKey = run.difficultyKey || "normal";
      if (levelSelect) levelSelect.value = String(levelNumber);
      if (landingLevelSelect) landingLevelSelect.value = String(levelNumber);
      if (difficultySelect) difficultySelect.value = difficultyKey;

      buildPathData();
      buildLawnTexture();

      gameStarted = true;
      gameOver = false;
      levelComplete = false;
      money = Number(run.money) || 0;
      bank = Number(run.bank) || 0;
      lives = Number(run.lives) || 0;
      wave = Number(run.wave) || 0;
      lastClearedWave = Number(run.lastClearedWave) || 0;
      selectedTowerType = run.selectedTowerType || "spray";
      placementArmed = !isCoarsePointer;
      lastPlacementUndo = null;
      lastCanvasPointerDownAt = 0;
      lastCanvasPointerType = "";
      lastInteractionPointerType = "";
      mobilePlacementCandidate = null;
      mobilePlacementCandidateAt = 0;
      mobilePlacementArmedAt = 0;
      lastTowerPlacedAt = 0;
      selectedTowerId = Number(run.selectedTowerId) || null;
      frameCount = Number(run.frameCount) || 0;
      nextEnemyId = Number(run.nextEnemyId) || 1;
      nextTowerId = Number(run.nextTowerId) || 1;
      nextVegetableId = Number(run.nextVegetableId) || 1;
      bunnySpawnCooldown = Number(run.bunnySpawnCooldown) || getBunnyCooldown();
      currentWaveEarlyStart = !!run.currentWaveEarlyStart;
      currentWaveHasBoss = !!run.currentWaveHasBoss;
      currentWaveFinalBoost = !!run.currentWaveFinalBoost;
      currentWaveSpawnTotal = Number(run.currentWaveSpawnTotal) || 0;
      currentWaveLaneLabel = run.currentWaveLaneLabel || "";
      currentWaveKillCount = Number(run.currentWaveKillCount) || 0;
      currentWaveRewardEarned = Number(run.currentWaveRewardEarned) || 0;
      currentWaveStartLives = Number(run.currentWaveStartLives) || lives;
      currentWaveDamageDealt = Number(run.currentWaveDamageDealt) || 0;
      flawlessChipCelebrateUntil = 0;
      flawlessChipCelebrateAmount = 0;
      waveSummaryLockUntil = 0;
      towerFloatHideAt = 0;
      towerFloatHover = false;
      towerSellConfirmTowerId = null;
      towerSellConfirmUntil = 0;
      nextLevelPending = Number(run.nextLevelPending) || null;
      tutorialProgress = {
        ...getDefaultTutorialProgress(),
        ...(run.tutorialProgress && typeof run.tutorialProgress === "object" ? run.tutorialProgress : {})
      };

      towers = Array.isArray(run.towers) ? run.towers : [];
      enemies = Array.isArray(run.enemies) ? run.enemies : [];
      bullets = Array.isArray(run.bullets) ? run.bullets : [];
      gluePatches = Array.isArray(run.gluePatches) ? run.gluePatches : [];
      impactBursts = [];
      bunnies = Array.isArray(run.bunnies) ? run.bunnies : [];
      implosions = Array.isArray(run.implosions) ? run.implosions : [];
      craters = Array.isArray(run.craters) ? run.craters : [];
      gardenVegetables = Array.isArray(run.gardenVegetables) ? run.gardenVegetables : buildGardenVegetables();
      if (!gardenVegetables.length) {
        gardenVegetables = buildGardenVegetables();
        lives = gardenVegetables.length;
      }
      rebuildVegetableIndex();
      const hasSelected = towers.some(t => t.id === selectedTowerId);
      if (!hasSelected) selectedTowerId = null;

      if (run.autoWaveRemainingMs && Number(run.autoWaveRemainingMs) > 0 && !gameOver && !levelComplete) {
        autoWaveDueAt = Date.now() + Number(run.autoWaveRemainingMs);
        autoWaveTimer = setTimeout(() => {
          autoWaveTimer = null;
          autoWaveDueAt = 0;
          if (!gameOver && activeSpawners === 0 && enemies.length === 0) startWave();
        }, Math.max(0, Number(run.autoWaveRemainingMs)));
      } else {
        autoWaveDueAt = 0;
      }

      if (landingScreenEl) landingScreenEl.style.display = "none";
      if (shellEl) shellEl.classList.remove("paused", "uiQuiet");
      updateMusicPlayback();
      syncTowerSelectionUI();
      renderTutorialProgress();
      setStatus(`Resumed Level ${levelNumber} at wave ${wave}.`, "good");
      syncHUD();
      saveProfileData();
      saveRunSnapshot();
      return true;
    }

    function continueLastRunFromLanding() {
      const run = loadRunSnapshot();
      if (!run) {
        syncResumeAvailability();
        setStatus("No valid saved run found. Start a new game or continue campaign.", "warn");
        return;
      }
      applyRunSnapshot(run);
    }

    function deleteSavedRunFromLanding() {
      const hasRun = !!loadRunSnapshot();
      if (!hasRun) {
        syncResumeAvailability();
        setStatus("No saved run to delete.", "warn");
        return;
      }
      clearRunSnapshot();
      syncResumeAvailability();
      setStatus("Saved run deleted.", "good");
    }

    function initAutosave() {
      if (autosaveIntervalId) clearInterval(autosaveIntervalId);
      autosaveIntervalId = setInterval(() => {
        saveProfileData();
        saveRunSnapshot();
      }, 5000);
      window.addEventListener("beforeunload", () => {
        saveProfileData();
        saveRunSnapshot();
      });
    }

    function scheduleAutoWaveStart() {
      if (gameOver || levelComplete) return;
      if (autoWaveTimer) clearTimeout(autoWaveTimer);
      autoWaveDueAt = Date.now() + 10000;
      autoWaveTimer = setTimeout(() => {
        autoWaveTimer = null;
        autoWaveDueAt = 0;
        if (!gameOver && activeSpawners === 0 && enemies.length === 0) {
          startWave();
        }
      }, 10000);
      syncHUD();
    }

    function syncHUD() {
      const lvl = getCurrentLevelConfig();
      const profile = getDifficultyProfile();
      const bossEvery = getBossWaveInterval(lvl, profile);
      const nextWaveNumber = wave + 1;
      const canSpawnNextWave = nextWaveNumber <= lvl.waves;
      const nextIsBoss = canSpawnNextWave && nextWaveNumber > 0 && nextWaveNumber % bossEvery === 0;
      waveEl.textContent = `${wave}/${lvl.waves}`;
      const waveBanner = ui.computeWaveBanner({
        gameOver,
        levelComplete,
        currentWaveFinalBoost,
        currentWaveHasBoss,
        wave
      });
      waveBannerEl.dataset.state = waveBanner.state;
      waveBannerTagEl.textContent = waveBanner.tag;
      levelStatEl.textContent = String(levelNumber);
      moneyEl.textContent = money;
      bankEl.textContent = bank;
      livesEl.textContent = lives;
      const activeThreats = enemies.reduce((count, e) => count + (e.state === "leaving" ? 0 : 1), 0);
      enemyCountEl.textContent = activeThreats;
      difficultyStatEl.textContent = profile.label;
      const now = Date.now();
      const activeWave = !gameOver && !levelComplete && wave > lastClearedWave;
      const waveVegLostNow = Math.max(0, (currentWaveStartLives || lives) - lives);
      const flawlessUi = ui.computeFlawlessChip({
        now,
        celebrateUntil: flawlessChipCelebrateUntil || 0,
        celebrateAmount: flawlessChipCelebrateAmount || 0,
        activeWave,
        waveVegLost: waveVegLostNow,
        wave
      });

      if (flawlessChipEl) flawlessChipEl.dataset.state = flawlessUi.state;
      if (flawlessChipTextEl) flawlessChipTextEl.textContent = flawlessUi.text;
      syncDifficultyHint();
      syncTowerAffordability();
      startBtn.disabled = gameOver || (levelComplete && !nextLevelPending);
      if (pauseBtn) pauseBtn.disabled = !gameStarted || gameOver || levelComplete;
      startBtn.dataset.state = "ready";
      const showNextLevelBtn = !gameOver && levelComplete && !!nextLevelPending;
      nextLevelBtn.style.display = showNextLevelBtn ? "inline-block" : "none";
      nextLevelBtn.disabled = !showNextLevelBtn;
      if (showNextLevelBtn) nextLevelBtn.textContent = `Go To Level ${nextLevelPending}`;
      const waveControls = ui.computeWaveControls({
        now,
        gameOver,
        levelComplete,
        nextLevelPending,
        nextIsBoss,
        canSpawnNextWave,
        currentWaveFinalBoost,
        currentWaveHasBoss,
        currentWaveEarlyStart,
        levelNumber,
        autoWaveActive: !!autoWaveTimer,
        autoWaveDueAt
      });
      nextWaveStatEl.textContent = waveControls.nextWaveText;
      bonusWaveStatEl.textContent = waveControls.bonusText;
      startBtn.dataset.state = waveControls.startState;
      if (startBtnGlyphEl) startBtnGlyphEl.textContent = waveControls.startGlyph;
      if (startBtnMainEl) startBtnMainEl.textContent = waveControls.startMain;
      renderFloatingTowerCard();
      renderNextWavePreview();
      updatePlacementUndoUi();
    }

    function goToNextLevel() {
      if (gameOver || !levelComplete || !nextLevelPending) return;
      levelNumber = nextLevelPending;
      if (levelSelect) levelSelect.value = String(levelNumber);
      resetGame(true);
      setStatus(`Level ${levelNumber} selected: ${getCurrentLevelConfig().name}.`, "good");
      saveProfileData();
      saveRunSnapshot();
    }

    function handleRestartClick() {
      const hasProgress = gameStarted && !gameOver && !levelComplete && (wave > 0 || towers.length > 0 || enemies.length > 0 || activeSpawners > 0);
      if (hasProgress) {
        const ok = window.confirm("Restart this level and lose current wave progress?");
        if (!ok) return;
      }
      resetGame();
      setStatus("Level restarted.", "warn");
      saveRunSnapshot();
    }

    function pauseToLanding() {
      if (!gameStarted || gameOver || levelComplete) return;
      saveProfileData();
      saveRunSnapshot();
      if (spawnTimers) {
        for (const timer of spawnTimers) clearInterval(timer);
        spawnTimers.clear();
      }
      if (autoWaveTimer) {
        clearTimeout(autoWaveTimer);
        autoWaveTimer = null;
      }
      autoWaveDueAt = 0;
      activeSpawners = 0;
      gameStarted = false;
      if (landingScreenEl) landingScreenEl.style.display = "";
      if (shellEl) shellEl.classList.add("paused");
      if (shellEl) shellEl.classList.remove("uiQuiet");
      syncResumeAvailability();
      setStatus("Game paused. Continue Last Run to resume.", "warn");
      syncHUD();
      updateMusicPlayback();
    }

    function setStatus(text, tone) {
      statusEl.textContent = text;
      statusEl.dataset.tone = tone || "warn";
      markUiInteraction();
    }

    function markUiInteraction() {
      if (!shellEl) return;
      shellEl.classList.remove("uiQuiet");
      if (uiFadeTimer) clearTimeout(uiFadeTimer);
      if (!gameStarted || gameOver || levelComplete) return;
      uiFadeTimer = setTimeout(() => {
        shellEl.classList.add("uiQuiet");
      }, 3400);
    }

    function delayMs(ms) {
      return new Promise(resolve => setTimeout(resolve, Math.max(0, Number(ms) || 0)));
    }

    async function runSmokeHarness() {
      if (!smokeMode || smokeHarnessRunning) return;
      smokeHarnessRunning = true;
      const checks = [];
      const startedAt = Date.now();
      const record = (name, pass, detail = "") => {
        checks.push({ name, pass: !!pass, detail });
      };
      const report = (ok, errMsg = "") => {
        const result = {
          ok,
          startedAt,
          endedAt: Date.now(),
          checks,
          error: errMsg || "",
          snapshot: {
            level: levelNumber,
            wave,
            money,
            enemies: enemies.length,
            activeSpawners,
            runtimeCrashed: !!runtimeCrashed
          }
        };
        window.__gardenSmokeResult = result;
        if (ok) setStatus("Smoke harness passed.", "good");
        else setStatus("Smoke harness failed. Check console and window.__gardenSmokeResult.", "danger");
        try {
          const prefix = ok ? "[SMOKE PASS]" : "[SMOKE FAIL]";
          console.log(prefix, result);
          if (!ok) console.error(prefix, result);
        } catch {
          // ignore logging failures
        }
      };
      try {
        record("DOM canvas exists", !!canvas, !!canvas ? "" : "Missing #game canvas");
        record("Core controls exist", !!landingStartBtn && !!startBtn && !!sprayTowerBtn, "Missing one or more required controls");
        const towerAssetModuleLoaded = !!window.GG_TOWER_ASSETS;
        record("Tower asset module loaded", towerAssetModuleLoaded, towerAssetModuleLoaded ? "" : "window.GG_TOWER_ASSETS missing");

        startNewGameFromLanding();
        await delayMs(60);
        record("Game started from landing", gameStarted && (landingScreenEl?.style.display === "none"), `gameStarted=${gameStarted}`);
        const selectorIconsRendered =
          !!sprayTowerBtn?.querySelector(".sprayIcon canvas")
          && !!glueTowerBtn?.querySelector(".glueIcon canvas")
          && !!hoseTowerBtn?.querySelector(".hoseIcon canvas")
          && !!saltTowerBtn?.querySelector(".saltPreview canvas");
        record("Tower selector icons rendered", selectorIconsRendered, selectorIconsRendered ? "" : "Missing one or more selector icon canvases");
        const artLoadSettled = !towerArtLoadState.pending;
        record("Tower art load settled", artLoadSettled, artLoadSettled ? "" : "Tower art loading still pending");
        const towerAssetReady = Object.values(towerArtState.images || {}).some(Boolean);
        const artSummary = towerArtLoadState.summary || towerArtState.lastLoadSummary || null;
        const fallbackMode = !!(artSummary && artSummary.total > 0 && artSummary.loaded === 0 && artSummary.failed === artSummary.total);
        const towerArtUsable = towerAssetReady || fallbackMode;
        const detail = towerAssetReady
          ? "Loaded tower art assets."
          : (fallbackMode ? "Using procedural fallback art." : "No tower art image loaded");
        record("Tower art assets available", towerArtUsable, detail);

        setSelectedTowerType("spray");
        await delayMs(20);
        const grassPoint = getRandomGrassPoint();
        record("Found buildable grass point", !!grassPoint, grassPoint ? `${Math.round(grassPoint.x)},${Math.round(grassPoint.y)}` : "No valid grass point");
        let placed = false;
        const beforeMoney = money;
        if (grassPoint) placed = placeTower(grassPoint.x, grassPoint.y);
        record("Place tower", placed, placed ? "" : "placeTower returned false");
        record("Money decreases after placement", placed ? money < beforeMoney : false, `before=${beforeMoney}, after=${money}`);

        const waveBefore = wave;
        startWave();
        await delayMs(160);
        record("Wave increments", wave === waveBefore + 1, `before=${waveBefore}, after=${wave}`);
        const startWaveLabel = startBtn?.textContent?.trim() || "";
        record("Start wave control text present", startWaveLabel.length > 0, startWaveLabel || "empty");
        await delayMs(1300);
        record("Enemies spawn or spawner active", enemies.length > 0 || activeSpawners > 0, `enemies=${enemies.length}, spawners=${activeSpawners}`);
        if (enemies.length > 0) {
          const overlay = rendering.getEnemyOverlayLayout(enemies[0]);
          const overlayOk = !!overlay
            && Number.isFinite(overlay.barX)
            && Number.isFinite(overlay.barY)
            && Number.isFinite(overlay.roleX)
            && Number.isFinite(overlay.roleY);
          record("Enemy overlay layout valid", overlayOk, overlayOk ? "" : JSON.stringify(overlay || {}));
        } else {
          record("Enemy overlay layout valid", activeSpawners > 0, "No enemy entity available for overlay check");
        }
        await delayMs(260);
        record("Runtime stable", !runtimeCrashed, runtimeCrashed ? "runtimeCrashed=true" : "");

        const ok = checks.every(c => c.pass);
        report(ok);
      } catch (err) {
        const message = err && err.message ? err.message : "Unknown smoke harness error";
        record("Unhandled smoke harness exception", false, message);
        report(false, message);
      } finally {
        smokeHarnessRunning = false;
      }
    }

    function clearRoleLegendTips(except = null) {
      for (const item of roleLegendItems) {
        if (except && item === except) continue;
        item.classList.remove("showTip");
        item.setAttribute("aria-expanded", "false");
      }
    }

    function toggleRoleLegendTip(item) {
      if (!item) return;
      const shouldShow = !item.classList.contains("showTip");
      clearRoleLegendTips(item);
      item.classList.toggle("showTip", shouldShow);
      item.setAttribute("aria-expanded", shouldShow ? "true" : "false");
      markUiInteraction();
    }

    function showWaveCallout(text, mode = "normal", duration = 2600) {
      if (!waveCalloutEl) return;
      waveCalloutEl.textContent = text;
      waveCalloutEl.classList.remove("boss", "final");
      if (mode === "boss") waveCalloutEl.classList.add("boss");
      if (mode === "final") waveCalloutEl.classList.add("final");
      waveCalloutEl.classList.add("show");
      if (waveCalloutHideTimer) clearTimeout(waveCalloutHideTimer);
      waveCalloutHideTimer = setTimeout(() => {
        waveCalloutEl.classList.remove("show", "boss", "final");
      }, duration);
    }

    function showFlawlessCallout(amount, duration = 1500) {
      if (!flawlessCalloutEl || !Number.isFinite(amount) || amount <= 0) return;
      flawlessCalloutEl.textContent = `FLAWLESS +$${Math.round(amount)}`;
      flawlessCalloutEl.classList.add("show");
      if (flawlessCalloutHideTimer) clearTimeout(flawlessCalloutHideTimer);
      flawlessCalloutHideTimer = setTimeout(() => {
        flawlessCalloutEl.classList.remove("show");
      }, Math.max(700, duration));
    }

    function showMoneyGainFx(text, variant = "bonus", delayMs = 0) {
      if (!moneyEl || !text) return;
      const spawn = () => {
        const anchor = moneyEl.closest(".overlayStat");
        if (!anchor) return;
        const rect = anchor.getBoundingClientRect();
        const fx = document.createElement("div");
        fx.className = `moneyGainFx${variant === "flawless" ? " flawless" : ""}`;
        fx.textContent = text;
        fx.style.left = `${Math.round(rect.left + rect.width * 0.55)}px`;
        fx.style.top = `${Math.round(rect.top - 2)}px`;
        document.body.appendChild(fx);
        fx.addEventListener("animationend", () => {
          if (fx.parentNode) fx.parentNode.removeChild(fx);
        }, { once: true });
        setTimeout(() => {
          if (fx.parentNode) fx.parentNode.removeChild(fx);
        }, 1500);
      };
      if (delayMs > 0) setTimeout(spawn, delayMs);
      else spawn();
    }

    function triggerFlawlessChipReward(amount) {
      if (!flawlessChipEl || !moneyEl || !Number.isFinite(amount) || amount <= 0) return;
      flawlessChipCelebrateUntil = Date.now() + 1300;
      flawlessChipCelebrateAmount = Math.max(0, Math.round(amount));
      flawlessChipEl.dataset.state = "earned";
      if (flawlessChipTextEl) flawlessChipTextEl.textContent = `+$${flawlessChipCelebrateAmount}`;

      const startRect = flawlessChipEl.getBoundingClientRect();
      const targetAnchor = moneyEl.closest(".overlayStat") || moneyEl;
      const targetRect = targetAnchor.getBoundingClientRect();
      const fly = document.createElement("div");
      fly.className = "flawlessChipFly";
      fly.textContent = `FLAWLESS +$${flawlessChipCelebrateAmount}`;
      fly.style.left = `${Math.round(startRect.left + startRect.width * 0.5)}px`;
      fly.style.top = `${Math.round(startRect.top + startRect.height * 0.5)}px`;
      document.body.appendChild(fly);

      const tx = Math.round((targetRect.left + targetRect.width * 0.5) - (startRect.left + startRect.width * 0.5));
      const ty = Math.round((targetRect.top + targetRect.height * 0.5) - (startRect.top + startRect.height * 0.5));
      requestAnimationFrame(() => {
        fly.style.transform = `translate(${tx}px, ${ty}px) scale(0.68)`;
        fly.style.opacity = "0";
      });

      const cleanup = () => {
        if (fly.parentNode) fly.parentNode.removeChild(fly);
      };
      fly.addEventListener("transitionend", cleanup, { once: true });
      setTimeout(cleanup, 760);
    }

    function showWaveSummary(summary, opts = {}) {
      if (!waveSummaryEl || !waveSummaryTitleEl || !waveSummaryBodyEl) return;
      waveSummaryTitleEl.textContent = summary.title;
      waveSummaryBodyEl.innerHTML = "";
      const parts = Array.isArray(summary.parts) && summary.parts.length
        ? summary.parts
        : [
            `Lane: ${summary.lane}`,
            `Defeated: ${summary.defeated}/${summary.spawned}`,
            `Veg Lost: ${summary.vegLost}`,
            `Rewards: $${summary.rewards}`,
            `Clear Bonus: $${summary.bonus}`
          ];
      for (const p of parts) {
        const s = document.createElement("span");
        s.textContent = p;
        waveSummaryBodyEl.appendChild(s);
      }
      waveSummaryEl.classList.add("show");
      if (waveSummaryHideTimer) clearTimeout(waveSummaryHideTimer);
      const durationMs = Number.isFinite(opts.durationMs) ? opts.durationMs : 7200;
      if (durationMs > 0) {
        waveSummaryLockUntil = Date.now() + durationMs;
        waveSummaryHideTimer = setTimeout(() => {
          waveSummaryEl.classList.remove("show");
        }, durationMs);
      } else {
        waveSummaryHideTimer = null;
      }
    }

    function getEnemyLabelPlural(type, count) {
      const label = rendering.getEnemyLabel(type);
      if (count === 1) return label;
      if (label.endsWith("s")) return label;
      return `${label}s`;
    }

    function estimateWaveComposition(lvl, waveNumber, totalCount, includesBoss) {
      const weights = getWaveEnemyWeights(lvl, waveNumber);
      let weightSum = 0;
      for (const type of enemyTypes) weightSum += Math.max(0, Number(weights[type] || 0));
      const normalizedWeights = {};
      for (const type of enemyTypes) {
        const w = Math.max(0, Number(weights[type] || 0));
        normalizedWeights[type] = weightSum > 0 ? (w / weightSum) : (1 / enemyTypes.length);
      }

      let remaining = Math.max(0, totalCount - (includesBoss ? 1 : 0));
      const composition = [];
      let allocated = 0;
      const fractional = [];
      for (const type of enemyTypes) {
        const exact = remaining * normalizedWeights[type];
        const base = Math.floor(exact);
        allocated += base;
        composition.push({ type, count: base });
        fractional.push({ type, frac: exact - base });
      }
      let leftovers = Math.max(0, remaining - allocated);
      fractional.sort((a, b) => b.frac - a.frac);
      let fi = 0;
      while (leftovers > 0 && fractional.length) {
        const chosen = fractional[fi % fractional.length].type;
        const slot = composition.find(c => c.type === chosen);
        if (slot) slot.count += 1;
        leftovers -= 1;
        fi += 1;
      }

      const lines = [];
      if (includesBoss) lines.push("1 Gate Crasher");
      for (const item of composition) {
        if (item.count <= 0) continue;
        lines.push(`${item.count} ${getEnemyLabelPlural(item.type, item.count)}`);
      }
      return lines;
    }

    function renderNextWavePreview() {
      if (!gameStarted || gameOver || levelComplete) return;
      if (Date.now() < (waveSummaryLockUntil || 0)) return;
      if (activeSpawners > 0 || enemies.length > 0) return;
      if (autoWaveTimer) return;

      const lvl = getCurrentLevelConfig();
      const profile = getDifficultyProfile();
      const nextWave = wave + 1;
      if (nextWave < 1 || nextWave > lvl.waves) return;

      const bossEvery = getBossWaveInterval(lvl, profile);
      const nextIsBoss = nextWave % bossEvery === 0;
      const levelWaveMul = lvl.waveCountMul || 1;
      const baseTotal = nextIsBoss
        ? Math.max(7, Math.floor(waveBalance.bossBaseCount + nextWave * waveBalance.bossCountPerWave))
        : waveBalance.regularBaseCount + Math.ceil(nextWave * waveBalance.regularCountPerWave);
      const total = Math.max(6, Math.round(baseTotal * profile.waveCountMul * levelWaveMul));
      const comp = estimateWaveComposition(lvl, nextWave, total, nextIsBoss);
      const previewParts = [
        `Wave ${nextWave}/${lvl.waves} | ${nextIsBoss ? "Boss Wave" : "Regular Wave"}`,
        `Total Enemies: ${total}`,
        ...comp.slice(0, 4),
        "Tip: Start early for +25% clear bonus"
      ];
      showWaveSummary(
        { title: "Next Wave Preview", parts: previewParts },
        { durationMs: 0 }
      );
    }

    function getUpgradeCost(tower) {
      const profile = getDifficultyProfile();
      const levelScale = 1 + Math.max(0, (Number(levelNumber) || 1) - 1) * 0.03;
      const diffScale = Number.isFinite(profile.upgradeCostMul) ? profile.upgradeCostMul : 1;
      let base = 29 + tower.level * 16;
      if (tower.type === "glue") base = 30 + tower.level * 16;
      else if (tower.type === "hose") base = 46 + tower.level * 22;
      else if (tower.type === "salt") base = 44 + tower.level * 20;
      return Math.max(1, Math.round(base * levelScale * diffScale));
    }

    function getTowerSellValue(tower) {
      return Math.max(1, Math.round((tower.totalSpent || 0) * towerSellRate));
    }

    function getTowerDisplayName(type) {
      if (type === "glue") return "Glue Pot";
      if (type === "hose") return "Hosepipe";
      if (type === "salt") return "Salt Cannon";
      return "Sprayer";
    }

    function upgradeTower(chosen) {
      if (!chosen) {
        setStatus("No tower selected for upgrade.", "warn");
        return false;
      }

      if (chosen.level >= 6) {
        setStatus("This tower is already max level.", "warn");
        return false;
      }

      const cost = getUpgradeCost(chosen);
      if (money < cost) {
        setStatus("Not enough money for upgrade.", "danger");
        return false;
      }

      money -= cost;
      clearTowerSellConfirm();
      chosen.totalSpent = (chosen.totalSpent || 0) + cost;
      chosen.level += 1;
      if (chosen.type === "glue") {
        chosen.range += 9;
        chosen.fireRate = Math.max(34, chosen.fireRate - 4);
        chosen.slowMultiplier = Math.max(0.38, chosen.slowMultiplier - 0.045);
        chosen.trapRadius += 2;
        chosen.trapLife += 24;
      } else if (chosen.type === "hose") {
        chosen.damage += 5;
        chosen.range += 9;
        chosen.fireRate = Math.max(26, chosen.fireRate - 4);
        chosen.beamWidth += 0.5;
      } else if (chosen.type === "salt") {
        chosen.damage += 6;
        chosen.range += 8;
        chosen.fireRate = Math.max(20, chosen.fireRate - 3);
      } else {
        chosen.damage += 5;
        chosen.range += 9;
        chosen.fireRate = Math.max(16, chosen.fireRate - 4);
      }
      setStatus(`Tower upgraded to level ${chosen.level}.`, "good");
      playSfx("upgrade");
      markTutorialProgress("upgradedTower");
      selectedTowerId = chosen.id;
      showTowerFloatCardBriefly(2200);
      chosen.showRangeUntil = frameCount + 220;
      syncHUD();
      saveRunSnapshot();
      return true;
    }

    function clearTowerSellConfirm() {
      towerSellConfirmTowerId = null;
      towerSellConfirmUntil = 0;
      if (towerFloatSellBtn) towerFloatSellBtn.classList.remove("armed");
      if (towerFloatSellLabelEl) towerFloatSellLabelEl.textContent = "Sell";
    }

    function requestSellTowerConfirm(id) {
      const tower = towers.find(t => t.id === id);
      if (!tower) {
        setStatus("No tower selected to sell.", "warn");
        return false;
      }
      const value = getTowerSellValue(tower);
      if (towerSellConfirmTowerId === id && Date.now() < (towerSellConfirmUntil || 0)) {
        clearTowerSellConfirm();
        sellTowerById(id);
        return true;
      }
      towerSellConfirmTowerId = id;
      towerSellConfirmUntil = Date.now() + 2200;
      showTowerFloatCardBriefly(2400);
      if (towerFloatSellBtn) towerFloatSellBtn.classList.add("armed");
      if (towerFloatSellLabelEl) towerFloatSellLabelEl.textContent = "Confirm";
      setStatus(`Confirm sell: tap Sell again to sell for $${value}.`, "warn");
      return false;
    }

    function sellTowerById(id) {
      const idx = towers.findIndex(t => t.id === id);
      if (idx < 0) {
        setStatus("No tower selected to sell.", "warn");
        return;
      }
      const tower = towers[idx];
      const value = getTowerSellValue(tower);
      money += value;
      towers.splice(idx, 1);
      selectedTowerId = null;
      clearTowerSellConfirm();
      setStatus(`Sold ${getTowerDisplayName(tower.type)} for $${value}.`, "good");
      syncHUD();
      saveRunSnapshot();
    }

    function createEnemy(enemyType, waveLaneId, hp, speed, reward, finalWaveBoost = false) {
      const profile = getDifficultyProfile();
      const spawnPoint = getPathPointAtDistance(waveLaneId, 0);
      const enemy = simulation.createEnemyEntity({
        id: nextEnemyId,
        enemyType,
        waveLaneId,
        hp,
        speed,
        reward,
        finalWaveBoost,
        profile,
        enemyRoleStats,
        spawnPoint
      });
      nextEnemyId += 1;
      return enemy;
    }

    function setTowerFloatCardPosition(left, top) {
      if (!towerFloatCardEl) return;
      const wrap = document.querySelector(".gameWrap");
      if (!wrap) return;
      const wrapRect = wrap.getBoundingClientRect();
      const cardW = towerFloatCardEl.offsetWidth || 128;
      const cardH = towerFloatCardEl.offsetHeight || 82;
      const margin = 6;
      const maxLeft = Math.max(margin, wrapRect.width - cardW - margin);
      const maxTop = Math.max(margin, wrapRect.height - cardH - margin);
      const clampedLeft = Math.max(margin, Math.min(left, maxLeft));
      const clampedTop = Math.max(margin, Math.min(top, maxTop));
      towerFloatCardEl.style.left = `${Math.round(clampedLeft)}px`;
      towerFloatCardEl.style.top = `${Math.round(clampedTop)}px`;
    }

    function positionFloatingCardForTower(tower) {
      if (!towerFloatCardEl || !tower || !canvas) return;
      const wrap = document.querySelector(".gameWrap");
      if (!wrap) return;
      const wrapRect = wrap.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      const scaleX = canvasRect.width / canvas.width;
      const scaleY = canvasRect.height / canvas.height;

      const anchorX = (canvasRect.left - wrapRect.left) + tower.x * scaleX;
      const anchorY = (canvasRect.top - wrapRect.top) + tower.y * scaleY;
      const cardH = towerFloatCardEl.offsetHeight || 82;
      const left = anchorX + 20;
      const top = anchorY - cardH * 0.5;
      setTowerFloatCardPosition(left, top);
    }

    function showTowerFloatCardBriefly(ms = 2600) {
      towerFloatHideAt = Date.now() + Math.max(500, ms);
    }

    function renderFloatingTowerCard() {
      if (!towerFloatCardEl) return;
      const selected = towers.find(t => t.id === selectedTowerId);
      if (!selected || !gameStarted || gameOver) {
        clearTowerSellConfirm();
        towerFloatCardEl.hidden = true;
        return;
      }
      if (!towerFloatHover && towerFloatHideAt > 0 && Date.now() > towerFloatHideAt) {
        clearTowerSellConfirm();
        towerFloatCardEl.hidden = true;
        return;
      }

      const name = getTowerDisplayName(selected.type);
      const sellValue = getTowerSellValue(selected);
      const isMax = selected.level >= 6;
      const upgradeCost = isMax ? 0 : getUpgradeCost(selected);
      const canAfford = isMax ? false : money >= upgradeCost;
      if (towerSellConfirmTowerId && towerSellConfirmTowerId !== selected.id) {
        clearTowerSellConfirm();
      }
      if (towerSellConfirmUntil && Date.now() >= towerSellConfirmUntil) {
        clearTowerSellConfirm();
      }
      const sellArmed = towerSellConfirmTowerId === selected.id && Date.now() < (towerSellConfirmUntil || 0);

      if (towerFloatUpgradeBtn) {
        towerFloatUpgradeBtn.title = isMax ? `${name} L${selected.level} maxed` : `${name} L${selected.level} upgrade $${upgradeCost}`;
        towerFloatUpgradeBtn.disabled = isMax || !canAfford;
      }
      if (towerFloatSellBtn) {
        towerFloatSellBtn.title = sellArmed
          ? `Tap again to confirm selling for $${sellValue}`
          : `${name} L${selected.level} sell for $${sellValue}`;
        towerFloatSellBtn.disabled = false;
        towerFloatSellBtn.classList.toggle("armed", !!sellArmed);
      }
      if (towerFloatSellLabelEl) towerFloatSellLabelEl.textContent = sellArmed ? "Confirm" : "Sell";
      if (towerFloatSellValEl) towerFloatSellValEl.textContent = sellArmed ? `$${sellValue}?` : `$${sellValue}`;
      if (towerFloatUpgradeValEl) towerFloatUpgradeValEl.textContent = isMax ? "MAX" : `$${upgradeCost}`;

      towerFloatCardEl.hidden = false;
      positionFloatingCardForTower(selected);
    }

    function normalizeTowerDockButtons() {
      const gameWrapEl = document.querySelector(".gameWrap");
      const dockEl = document.getElementById("towerDock");
      if (!dockEl) return;
      if (gameWrapEl && dockEl.parentElement !== gameWrapEl) gameWrapEl.appendChild(dockEl);
      dockEl.className = "towerDock";
      dockEl.setAttribute("aria-label", "Tower selection dock");

      const buttonByType = {
        spray: sprayTowerBtn,
        glue: glueTowerBtn,
        hose: hoseTowerBtn,
        salt: saltTowerBtn
      };
      const defs = rendering.getTowerDockDefinitions().map((def) => ({
        ...def,
        btn: buttonByType[def.type],
        cost: towerCosts[def.type]
      }));

      for (const def of defs) {
        if (!def.btn) continue;
        if (def.btn.parentElement !== dockEl) dockEl.appendChild(def.btn);
        def.btn.className = def.extraClass ? `towerDockItem ${def.extraClass}` : "towerDockItem";
        def.btn.setAttribute("role", "button");
        def.btn.setAttribute("tabindex", "0");
        def.btn.setAttribute("aria-pressed", "false");
        def.btn.setAttribute("title", `${def.name} ($${def.cost}) [${def.hotkey}]`);
        def.btn.setAttribute("aria-label", `${def.name} ($${def.cost}) [${def.hotkey}]`);
        def.btn.setAttribute("data-tooltip", `${def.name} | $${def.cost} | ${def.role}`);

        while (def.btn.firstChild) def.btn.removeChild(def.btn.firstChild);

        const artEl = document.createElement("span");
        artEl.className = def.iconClass;
        artEl.setAttribute("aria-hidden", "true");

        const metaEl = document.createElement("span");
        metaEl.className = "towerDockMeta";
        metaEl.setAttribute("aria-hidden", "true");
        metaEl.textContent = `[${def.hotkey}] $${def.cost}`;

        def.btn.appendChild(artEl);
        def.btn.appendChild(metaEl);
      }
    }
    function syncTowerSelectionUI() {
      if (sprayTowerBtn) sprayTowerBtn.classList.toggle("active", selectedTowerType === "spray");
      if (glueTowerBtn) glueTowerBtn.classList.toggle("active", selectedTowerType === "glue");
      if (hoseTowerBtn) hoseTowerBtn.classList.toggle("active", selectedTowerType === "hose");
      if (saltTowerBtn) saltTowerBtn.classList.toggle("active", selectedTowerType === "salt");
      if (sprayTowerBtn) sprayTowerBtn.setAttribute("aria-pressed", selectedTowerType === "spray" ? "true" : "false");
      if (glueTowerBtn) glueTowerBtn.setAttribute("aria-pressed", selectedTowerType === "glue" ? "true" : "false");
      if (hoseTowerBtn) hoseTowerBtn.setAttribute("aria-pressed", selectedTowerType === "hose" ? "true" : "false");
      if (saltTowerBtn) saltTowerBtn.setAttribute("aria-pressed", selectedTowerType === "salt" ? "true" : "false");
      syncTowerAffordability();
    }

    function syncTowerAffordability() {
      const towerButtons = [
        { btn: sprayTowerBtn, type: "spray" },
        { btn: glueTowerBtn, type: "glue" },
        { btn: hoseTowerBtn, type: "hose" },
        { btn: saltTowerBtn, type: "salt" }
      ];
      towerButtons.forEach(({ btn, type }) => {
        if (!btn) return;
        const cost = towerCosts[type];
        const afford = ui.computeTowerAffordability({ type, cost, money });
        btn.classList.toggle("unaffordable", !afford.canAfford);
        btn.setAttribute("aria-disabled", afford.canAfford ? "false" : "true");
        btn.setAttribute("title", afford.label);
        btn.setAttribute("aria-label", afford.label);
      });
    }

    function isTouchPlacementMode(event = null) {
      if (isCoarsePointer) return true;
      const fromEvent = !!(event && (
        event.pointerType === "touch"
        || (event.sourceCapabilities && event.sourceCapabilities.firesTouchEvents)
      ));
      if (fromEvent) return true;
      const recentCanvasTouch = lastCanvasPointerType === "touch" && (Date.now() - (lastCanvasPointerDownAt || 0)) < 1600;
      if (recentCanvasTouch) return true;
      return lastInteractionPointerType === "touch";
    }

    function setSelectedTowerType(type, sourceEvent = null) {
      selectedTowerType = type;
      const touchPlacementMode = isTouchPlacementMode(sourceEvent);
      if (touchPlacementMode) {
        placementArmed = true;
        mobilePlacementCandidate = null;
        mobilePlacementCandidateAt = 0;
        mobilePlacementArmedAt = Date.now();
      }
      syncTowerSelectionUI();
      const label = getTowerDisplayName(type);
      if (touchPlacementMode) setStatus(`${label} armed. Tap field to choose spot, then tap again to place.`, "warn");
      else setStatus(`${label} selected.`, "warn");
    }

    function handleTowerHotkeys(e) {
      const target = e.target;
      const tag = target && target.tagName ? target.tagName.toUpperCase() : "";
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA" || (target && target.isContentEditable)) return;
      if (e.key === "1") {
        e.preventDefault();
        setSelectedTowerType("spray");
      } else if (e.key === "2") {
        e.preventDefault();
        setSelectedTowerType("glue");
      } else if (e.key === "3") {
        e.preventDefault();
        setSelectedTowerType("hose");
      } else if (e.key === "4") {
        e.preventDefault();
        setSelectedTowerType("salt");
      }
    }

    function catmullRomPoint(t, p0, p1, p2, p3) {
      const t2 = t * t;
      const t3 = t2 * t;
      return {
        x: 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
        y: 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3)
      };
    }

    function generateCurvedPath(points, stepsPerSegment) {
      if (points.length < 2) return points.slice();
      const result = [];

      for (let i = 0; i < points.length - 1; i += 1) {
        const p0 = points[Math.max(0, i - 1)];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[Math.min(points.length - 1, i + 2)];

        const startStep = i === 0 ? 0 : 1;
        for (let step = startStep; step <= stepsPerSegment; step += 1) {
          const t = step / stepsPerSegment;
          result.push(catmullRomPoint(t, p0, p1, p2, p3));
        }
      }

      return result;
    }

    function getLane(id) {
      return lanes[id] || lanes.top;
    }

    function buildPathData() {
      const cfg = getCurrentLevelConfig();
      for (const key of Object.keys(lanes)) delete lanes[key];
      for (const def of cfg.laneDefinitions) {
        const points = generateCurvedPath(def.basePoints, 16);
        const segments = [];
        const path = new Path2D();
        let totalLength = 0;
        let yMin = Number.POSITIVE_INFINITY;
        let yMax = Number.NEGATIVE_INFINITY;

        path.moveTo(points[0].x, points[0].y);
        for (let i = 0; i < points.length - 1; i += 1) {
          const a = points[i];
          const b = points[i + 1];
          const length = Math.hypot(b.x - a.x, b.y - a.y);
          segments.push({ a, b, length, start: totalLength });
          totalLength += length;
          path.lineTo(b.x, b.y);
          if (a.y < yMin) yMin = a.y;
          if (a.y > yMax) yMax = a.y;
        }
        const lastPoint = points[points.length - 1];
        if (lastPoint.y < yMin) yMin = lastPoint.y;
        if (lastPoint.y > yMax) yMax = lastPoint.y;

        lanes[def.id] = {
          id: def.id,
          points,
          segments,
          totalLength,
          path,
          yMin,
          yMax,
          roadGradient: null,
          flagstones: [],
          pathJoints: [],
          pathPebbles: [],
          flowers: []
        };
        buildFlagstones(lanes[def.id]);
        buildFlowerBeds(lanes[def.id]);
      }
      rebuildRenderCaches();
    }

    function rebuildRenderCaches() {
      const cfg = getCurrentLevelConfig();
      roadShoulderColor = cfg.terrain === "snow" ? "rgba(96, 112, 132, 0.28)" : "rgba(93, 104, 116, 0.26)";

      for (const lane of Object.values(lanes)) {
        const yMin = lane.yMin - roadHalfHeight;
        const yMax = lane.yMax + roadHalfHeight;
        const grad = ctx.createLinearGradient(0, yMin, 0, yMax);
        if (cfg.terrain === "snow") {
          grad.addColorStop(0, "#c2cbd6");
          grad.addColorStop(0.55, "#98a4b2");
          grad.addColorStop(1, "#8693a3");
        } else {
          grad.addColorStop(0, "#9aa5b0");
          grad.addColorStop(0.5, "#7e8894");
          grad.addColorStop(1, "#6d7783");
        }
        lane.roadGradient = grad;
      }

      sceneTopWashGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      if (cfg.terrain === "snow") {
        sceneTopWashGradient.addColorStop(0, "rgba(206, 226, 255, 0.13)");
        sceneTopWashGradient.addColorStop(1, "rgba(150, 182, 220, 0.05)");
      } else {
        sceneTopWashGradient.addColorStop(0, "rgba(255, 240, 188, 0.08)");
        sceneTopWashGradient.addColorStop(1, "rgba(76, 123, 77, 0.03)");
      }
      sceneVignetteGradient = ctx.createRadialGradient(
        canvas.width * 0.5,
        canvas.height * 0.5,
        Math.min(canvas.width, canvas.height) * 0.24,
        canvas.width * 0.5,
        canvas.height * 0.5,
        Math.max(canvas.width, canvas.height) * 0.72
      );
      sceneVignetteGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
      sceneVignetteGradient.addColorStop(1, "rgba(7, 12, 22, 0.2)");
    }

    function buildLawnTexture() {
      lawnTexture.width = canvas.width;
      lawnTexture.height = canvas.height;
      const ltx = lawnTexture.getContext("2d");
      prairieBlades.length = 0;
      sunflowerField.length = 0;
      topiaryDots.length = 0;
      snowflakes.length = 0;
      winterForestTrees.length = 0;
      winterSnowmen.length = 0;
      const cfg = getCurrentLevelConfig();

      const grad = ltx.createLinearGradient(0, 0, canvas.width, canvas.height);
      if (cfg.terrain === "prairie") {
        grad.addColorStop(0, "#88a65b");
        grad.addColorStop(0.55, "#6f8f44");
        grad.addColorStop(1, "#5e7837");
      } else if (cfg.terrain === "snow") {
        grad.addColorStop(0, "#ecf5ff");
        grad.addColorStop(0.6, "#d9e9f8");
        grad.addColorStop(1, "#c3d9ee");
      } else if (cfg.terrain === "desert") {
        grad.addColorStop(0, "#d9bf84");
        grad.addColorStop(0.55, "#c7a669");
        grad.addColorStop(1, "#b99054");
      } else {
        grad.addColorStop(0, "#5f9f45");
        grad.addColorStop(0.55, "#4b8638");
        grad.addColorStop(1, "#3e6f2f");
      }
      ltx.fillStyle = grad;
      ltx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < 1700; i += 1) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const r = Math.random() * 2 + 0.5;
        ltx.fillStyle = cfg.terrain === "prairie"
          ? (i % 2 === 0 ? "rgba(88, 120, 56, 0.3)" : "rgba(193, 207, 128, 0.2)")
          : (cfg.terrain === "snow"
            ? (i % 2 === 0 ? "rgba(255, 255, 255, 0.38)" : "rgba(189, 208, 228, 0.26)")
          : (cfg.terrain === "desert"
            ? (i % 2 === 0 ? "rgba(154, 121, 70, 0.24)" : "rgba(242, 219, 163, 0.2)")
            : (i % 2 === 0 ? "rgba(72, 122, 49, 0.33)" : "rgba(182, 220, 132, 0.22)")));
        ltx.beginPath();
        ltx.arc(x, y, r, 0, Math.PI * 2);
        ltx.fill();
      }

      if (cfg.flowerTheme === "topiary") {
        for (let i = 0; i < 110; i += 1) {
          let tries = 0;
          while (tries < 18) {
            tries += 1;
            const x = 18 + Math.random() * (canvas.width - 236);
            const y = 14 + Math.random() * (canvas.height - 28);
            if (isOnAnyPathSurface(x, y, roadHalfHeight * 1.08)) continue;
            const r = 4 + Math.random() * 7.5;
            topiaryDots.push({
              x,
              y,
              r,
              shade: i % 4
            });
            ltx.fillStyle = "rgba(31, 55, 31, 0.16)";
            ltx.beginPath();
            ltx.ellipse(x + r * 0.25, y + r * 0.65, r * 0.9, r * 0.42, 0, 0, Math.PI * 2);
            ltx.fill();
            break;
          }
        }
      }

      if (cfg.terrain === "snow") {
        for (let i = 0; i < 38; i += 1) {
          const x = 40 + Math.random() * (canvas.width - 220);
          const y = 18 + Math.random() * (canvas.height - 36);
          const rx = 24 + Math.random() * 54;
          const ry = 8 + Math.random() * 18;
          ltx.fillStyle = i % 2 === 0 ? "rgba(255, 255, 255, 0.33)" : "rgba(225, 238, 250, 0.28)";
          ltx.beginPath();
          ltx.ellipse(x, y, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2);
          ltx.fill();
        }
        for (let i = 0; i < 170; i += 1) {
          snowflakes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: 0.6 + Math.random() * 2.2,
            speed: 0.35 + Math.random() * 0.95,
            sway: 0.2 + Math.random() * 0.7,
            phase: Math.random() * Math.PI * 2
          });
        }

        // Forest-like perimeter trees
        for (let i = 0; i < 64; i += 1) {
          let x = 0;
          let y = 0;
          const side = i % 4;
          if (side === 0) { // top edge
            x = 16 + Math.random() * (canvas.width - 230);
            y = 10 + Math.random() * 44;
          } else if (side === 1) { // bottom edge
            x = 16 + Math.random() * (canvas.width - 230);
            y = canvas.height - 56 + Math.random() * 38;
          } else if (side === 2) { // left edge
            x = 10 + Math.random() * 78;
            y = 20 + Math.random() * (canvas.height - 42);
          } else { // right-side edge before garden
            x = canvas.width - 262 + Math.random() * 70;
            y = 16 + Math.random() * (canvas.height - 34);
          }
          if (isOnAnyPathSurface(x, y, roadHalfHeight * 0.95)) continue;
          winterForestTrees.push({
            x,
            y,
            scale: 1.05 + Math.random() * 1.35,
            tint: 0.8 + Math.random() * 0.3
          });
        }

        // A few small snowmen dotted around the field
        for (let i = 0; i < 8; i += 1) {
          let tries = 0;
          while (tries < 20) {
            tries += 1;
            const x = 30 + Math.random() * (canvas.width - 250);
            const y = 26 + Math.random() * (canvas.height - 40);
            if (isOnAnyPathSurface(x, y, roadHalfHeight * 0.95)) continue;
            winterSnowmen.push({
              x,
              y,
              scale: 0.78 + Math.random() * 0.42
            });
            break;
          }
        }
      }

      if (cfg.flowerTheme === "sunflower") {
        let row = 0;
        for (let y = 26; y <= canvas.height - 20; y += 34) {
          const startX = 20 + (row % 2) * 15;
          for (let x = startX; x <= canvas.width - 204; x += 31) {
            const sx = x + (Math.random() - 0.5) * 5.2;
            const sy = y + (Math.random() - 0.5) * 4.6;
            if (isOnAnyPathSurface(sx, sy, roadHalfHeight * 0.65)) continue;
            sunflowerField.push({
              x: sx,
              y: sy,
              scale: 0.82 + Math.random() * 0.42,
              phase: Math.random() * Math.PI * 2
            });
          }
          row += 1;
        }
      }

      if (cfg.terrain === "prairie" && cfg.flowerTheme !== "sunflower") {
        for (let i = 0; i < 260; i += 1) {
          prairieBlades.push({
            x: 10 + Math.random() * (canvas.width - 24),
            y: 30 + Math.random() * (canvas.height - 36),
            h: 10 + Math.random() * 14,
            sway: 2 + Math.random() * 3.5,
            phase: Math.random() * Math.PI * 2
          });
        }
      }
    }

    function pointToSegmentDistance(px, py, ax, ay, bx, by) {
      const abx = bx - ax;
      const aby = by - ay;
      const apx = px - ax;
      const apy = py - ay;
      const denom = abx * abx + aby * aby;
      const t = denom === 0 ? 0 : Math.max(0, Math.min(1, (apx * abx + apy * aby) / denom));
      const cx = ax + abx * t;
      const cy = ay + aby * t;
      return Math.hypot(px - cx, py - cy);
    }

    function intersectsRoad(x, y) {
      const blockedDistance = roadHalfHeight + towerRadius + noBuildPadding;
      for (const lane of Object.values(lanes)) {
        for (const seg of lane.segments) {
          const d = pointToSegmentDistance(x, y, seg.a.x, seg.a.y, seg.b.x, seg.b.y);
          if (d <= blockedDistance) return true;
        }
      }
      return false;
    }

    function intersectsCrater(x, y, extra = 0) {
      for (const c of craters) {
        if (Math.hypot(c.x - x, c.y - y) <= c.radius + extra) return true;
      }
      return false;
    }

    function isOnAnyPathSurface(x, y, extra = 1.5) {
      const blockedDistance = roadHalfHeight + extra;
      for (const lane of Object.values(lanes)) {
        for (const seg of lane.segments) {
          const d = pointToSegmentDistance(x, y, seg.a.x, seg.a.y, seg.b.x, seg.b.y);
          if (d <= blockedDistance) return true;
        }
      }
      return false;
    }

    function getPathPointAtDistance(laneId, distance) {
      const lane = getLane(laneId);
      if (distance <= 0) return { x: lane.points[0].x, y: lane.points[0].y };
      if (distance >= lane.totalLength) {
        const last = lane.points[lane.points.length - 1];
        return { x: last.x, y: last.y };
      }

      for (const seg of lane.segments) {
        if (distance <= seg.start + seg.length) {
          const t = (distance - seg.start) / seg.length;
          return {
            x: seg.a.x + (seg.b.x - seg.a.x) * t,
            y: seg.a.y + (seg.b.y - seg.a.y) * t
          };
        }
      }

      const fallback = lane.points[lane.points.length - 1];
      return { x: fallback.x, y: fallback.y };
    }

    function getPathTangentAtDistance(laneId, distance) {
      const lane = getLane(laneId);
      if (distance <= 0) {
        const first = lane.segments[0];
        const len = Math.max(0.0001, first.length);
        return { x: (first.b.x - first.a.x) / len, y: (first.b.y - first.a.y) / len };
      }
      if (distance >= lane.totalLength) {
        const last = lane.segments[lane.segments.length - 1];
        const len = Math.max(0.0001, last.length);
        return { x: (last.b.x - last.a.x) / len, y: (last.b.y - last.a.y) / len };
      }

      for (const seg of lane.segments) {
        if (distance <= seg.start + seg.length) {
          const len = Math.max(0.0001, seg.length);
          return { x: (seg.b.x - seg.a.x) / len, y: (seg.b.y - seg.a.y) / len };
        }
      }

      return { x: 1, y: 0 };
    }

    function buildFlagstones(lane) {
      lane.flagstones.length = 0;
      lane.pathJoints.length = 0;
      lane.pathPebbles.length = 0;
      for (let d = 14; d < lane.totalLength - 14; d += 24) {
        const p = getPathPointAtDistance(lane.id, d);
        const t = getPathTangentAtDistance(lane.id, d);
        const n = { x: -t.y, y: t.x };
        const lateral = Math.sin(d * 0.09) * roadHalfHeight * 0.22;
        const hue = Math.sin(d * 0.11);
        const shade = 0.5 + Math.sin(d * 0.037) * 0.5;

        lane.flagstones.push({
          x: p.x + n.x * lateral,
          y: p.y + n.y * lateral,
          rx: 6 + (Math.sin(d * 0.17) + 1) * 2.2,
          ry: 4.8 + (Math.cos(d * 0.13) + 1) * 1.6,
          rot: Math.atan2(t.y, t.x) + Math.sin(d * 0.07) * 0.35,
          fill: hue > 0 ? "#9ea7b1" : "#8a939d",
          edge: hue > 0 ? "#6d7682" : "#5f6873",
          innerA: shade > 0.5 ? "rgba(244, 249, 255, 0.16)" : "rgba(220, 232, 244, 0.12)",
          innerB: shade > 0.5 ? "rgba(43, 51, 64, 0.14)" : "rgba(38, 45, 58, 0.11)",
          crack: Math.abs(Math.sin(d * 0.041)) > 0.62
        });
      }

      for (let d = 18; d < lane.totalLength - 16; d += 30) {
        const p = getPathPointAtDistance(lane.id, d);
        const t = getPathTangentAtDistance(lane.id, d);
        lane.pathJoints.push({
          x: p.x,
          y: p.y,
          angle: Math.atan2(t.y, t.x),
          len: roadHalfHeight * 1.65 + Math.sin(d * 0.1) * 2.2
        });
      }

      for (let d = 10; d < lane.totalLength - 10; d += 14) {
        const p = getPathPointAtDistance(lane.id, d);
        const t = getPathTangentAtDistance(lane.id, d);
        const n = { x: -t.y, y: t.x };
        const s = Math.sin(d * 0.119);
        const side = s > 0 ? 1 : -1;
        const off = roadHalfHeight * (0.88 + (Math.cos(d * 0.071) + 1) * 0.08);
        lane.pathPebbles.push({
          x: p.x + n.x * off * side,
          y: p.y + n.y * off * side,
          r: 0.6 + (Math.sin(d * 0.083) + 1) * 0.7,
          a: 0.1 + (Math.cos(d * 0.137) + 1) * 0.09
        });
      }
    }

    function buildFlowerBeds(lane) {
      lane.flowers.length = 0;
      const cfg = getCurrentLevelConfig();
      const flowerColors = cfg.flowerTheme === "susan"
        ? [
          ["#f4c91f", "#2a1b11"],
          ["#e9bd14", "#2d1c13"],
          ["#f0c523", "#241810"]
        ]
        : (cfg.flowerTheme === "christmas"
          ? [
            ["#2f8f4d", "#d84b4b"],
            ["#357f46", "#ffffff"],
            ["#2f6f43", "#e35d5d"]
          ]
        : (cfg.flowerTheme === "topiary"
          ? [
            ["#3f7e3f", "#c8d8bc"],
            ["#4f8f4a", "#d7e4cb"],
            ["#5e9c56", "#dce9d1"],
            ["#2f6b37", "#bcd2b0"]
          ]
        : (cfg.flowerTheme === "sunflower"
          ? [
            ["#f2be1d", "#4a2f1a"],
            ["#f6cb2f", "#3f2818"],
            ["#e8b015", "#51331b"]
          ]
        : (cfg.flowerTheme === "cactus"
          ? [
            ["#6bad62", "#edda88"],
            ["#5f9f58", "#ebd17e"],
            ["#79b86e", "#f1e2a0"]
          ]
          : [
            ["#f48892", "#f4d7dc"],
            ["#f2c865", "#f3eebf"],
            ["#aa96ef", "#e7e1f5"],
            ["#f2a06d", "#f2dfcf"],
            ["#e269a8", "#f2d8e5"]
	          ]))));
      const borderScale = 0.75;
      const baseOffset = (roadHalfHeight + 8) * borderScale;

      for (let d = 12; d < lane.totalLength - 12; d += 14) {
        const p = getPathPointAtDistance(lane.id, d);
        const t = getPathTangentAtDistance(lane.id, d);
        const n = { x: -t.y, y: t.x };
        for (const side of [-1, 1]) {
          for (let cluster = 0; cluster < 2; cluster += 1) {
            const wobble = (Math.sin(d * 0.16 + side + cluster) + 1) * (2.6 * borderScale);
            const offset = baseOffset + wobble + cluster * (5.2 * borderScale);
            const x = p.x + n.x * offset * side;
            const y = p.y + n.y * offset * side;
            if (isOnAnyPathSurface(x, y, 2.5)) continue;
            const index = Math.abs(Math.floor((d + side * 17 + cluster * 9) / 11)) % flowerColors.length;
            lane.flowers.push({
              x,
              y,
              size: cfg.flowerTheme === "christmas"
                ? (5 + (Math.sin(d * 0.08 + side + cluster) + 1) * 1.15)
                : (cfg.flowerTheme === "topiary"
                  ? (3.8 + (Math.sin(d * 0.08 + side + cluster) + 1) * 1.2)
                  : (3.2 + (Math.sin(d * 0.08 + side + cluster) + 1) * 0.85)),
              petal: flowerColors[index][0],
              center: flowerColors[index][1],
              kind: cfg.flowerTheme
            });
          }
        }
      }

      // Extend the top-lane lower border flowers all the way to the fence.
      if (lane.id === "top" && cfg.flowerTheme !== "susan") {
        const start = Math.max(12, lane.totalLength - 170);
        for (let d = start; d < lane.totalLength - 2; d += 8) {
          const p = getPathPointAtDistance(lane.id, d);
          const t = getPathTangentAtDistance(lane.id, d);
          const n = { x: -t.y, y: t.x };
          const side = 1; // lower side for top lane
          for (let cluster = 0; cluster < 2; cluster += 1) {
            const wobble = (Math.sin(d * 0.18 + cluster) + 1) * (2.6 * borderScale);
            const offset = baseOffset + wobble + cluster * (4.9 * borderScale);
            const x = p.x + n.x * offset * side;
            const y = p.y + n.y * offset * side;
            if (isOnAnyPathSurface(x, y, 2.5)) continue;
            const index = Math.abs(Math.floor((d + cluster * 7) / 10)) % flowerColors.length;
            lane.flowers.push({
              x,
              y,
              size: cfg.flowerTheme === "christmas"
                ? (4.8 + (Math.sin(d * 0.1 + cluster) + 1) * 1.05)
                : (cfg.flowerTheme === "topiary"
                  ? (3.5 + (Math.sin(d * 0.1 + cluster) + 1) * 1.05)
                  : (3 + (Math.sin(d * 0.1 + cluster) + 1) * 0.75)),
              petal: flowerColors[index][0],
              center: flowerColors[index][1],
              kind: cfg.flowerTheme
            });
          }
        }
      }
    }

    function normalizePlacement(x, y) {
      return {
        x: Math.max(towerRadius, Math.min(canvas.width - towerRadius, x)),
        y: Math.max(towerRadius, Math.min(canvas.height - towerRadius, y))
      };
    }

    function findTowerAt(x, y) {
      let chosen = null;
      let bestDist = Infinity;
      for (const t of towers) {
        const d = Math.hypot(t.x - x, t.y - y);
        if (d < 18 && d < bestDist) {
          chosen = t;
          bestDist = d;
        }
      }
      return chosen;
    }

    function getRandomGrassPoint() {
      for (let i = 0; i < 28; i += 1) {
        const x = 24 + Math.random() * (canvas.width - 230);
        const y = 20 + Math.random() * (canvas.height - 40);
        if (intersectsRoad(x, y)) continue;
        return { x, y };
      }
      return null;
    }

    function triggerBunnyAttack() {
      const p = getRandomGrassPoint();
      if (!p) return;

      bunnies.push({
        x: p.x,
        y: p.y,
        life: 140
      });

      for (let i = towers.length - 1; i >= 0; i -= 1) {
        const t = towers[i];
        const d = Math.hypot(t.x - p.x, t.y - p.y);
        if (d <= 18) {
          towers.splice(i, 1);
          if (selectedTowerId === t.id) selectedTowerId = null;
          implosions.push({ x: t.x, y: t.y, life: 28 });
          craters.push({ x: t.x, y: t.y, radius: 13 });
          setStatus("Bunny attack! A tower imploded.", "danger");
          break;
        }
      }
    }

    function evaluateTowerPlacement(x, y) {
      if (!Number.isFinite(x) || !Number.isFinite(y)) return { ok: false, reason: "invalid" };
      const towerCost = towerCosts[selectedTowerType];
      if (!Number.isFinite(towerCost) || money < towerCost) return { ok: false, reason: "money" };
      if (intersectsRoad(x, y)) return { ok: false, reason: "road" };
      if (intersectsCrater(x, y, towerRadius + 2)) return { ok: false, reason: "crater" };
      for (const t of towers) {
        if (Math.hypot(t.x - x, t.y - y) < towerRadius * 2 + 8) return { ok: false, reason: "tower" };
      }
      return { ok: true, reason: "" };
    }

    function getPlacementFailureMessage(reason) {
      if (reason === "invalid") return "Invalid click position detected. Try reloading the page.";
      if (reason === "money") return "Not enough money to place a tower.";
      if (reason === "road") return "You cannot place towers on the road.";
      if (reason === "crater") return "That crater is unstable. You cannot rebuild there.";
      if (reason === "tower") return "Too close to another tower.";
      return "Cannot place tower here.";
    }

    function placeTower(x, y) {
      if (gameOver || levelComplete) return false;
      const placementCheck = evaluateTowerPlacement(x, y);
      if (!placementCheck.ok) {
        setStatus(getPlacementFailureMessage(placementCheck.reason), "danger");
        return false;
      }
      const towerCost = towerCosts[selectedTowerType];

      if (selectedTowerType === "glue") {
        towers.push({
          id: nextTowerId++,
          x,
          y,
          type: "glue",
          level: 1,
          range: 138,
          fireRate: 72,
          cooldown: 0,
          slowMultiplier: 0.6,
          trapRadius: 25,
          trapLife: 190,
          totalSpent: towerCost,
          showRangeUntil: frameCount + 220
        });
      } else if (selectedTowerType === "hose") {
        towers.push({
          id: nextTowerId++,
          x,
          y,
          type: "hose",
          level: 1,
          damage: 12,
          range: 148,
          fireRate: 56,
          beamWidth: 7,
          cooldown: 0,
          laserFlash: 0,
          lastAimAngle: 0,
          totalSpent: towerCost,
          showRangeUntil: frameCount + 220
        });
      } else if (selectedTowerType === "salt") {
        towers.push({
          id: nextTowerId++,
          x,
          y,
          type: "salt",
          level: 1,
          damage: 17,
          range: 154,
          fireRate: 34,
          cooldown: 0,
          sprayFlash: 0,
          lastAimAngle: 0,
          totalSpent: towerCost,
          showRangeUntil: frameCount + 220
        });
      } else {
        towers.push({
          id: nextTowerId++,
          x,
          y,
          type: "spray",
          level: 1,
          damage: 11,
          range: 124,
          fireRate: 44,
          cooldown: 0,
          sprayFlash: 0,
          lastAimAngle: 0,
          totalSpent: towerCost,
          showRangeUntil: frameCount + 220
        });
      }
      selectedTowerId = towers[towers.length - 1].id;
      showTowerFloatCardBriefly(1800);
      money -= towerCost;
      registerPlacementUndo(selectedTowerId, towerCost, selectedTowerType);
      if (isCoarsePointer) setStatus("Tower placed. Tap a tower icon to arm next placement.", "good");
      else setStatus("Tower placed.", "good");
      playSfx("place");
      markTutorialProgress("placedTower");
      syncHUD();
      saveRunSnapshot();
      return true;
    }

    function drawMobilePlacementCandidate() {
      if (!gameStarted || gameOver || levelComplete || !placementArmed || !mobilePlacementCandidate) return;
      const age = Date.now() - (mobilePlacementCandidateAt || 0);
      if (age > mobilePlacementConfirmWindowMs) {
        mobilePlacementCandidate = null;
        mobilePlacementCandidateAt = 0;
        return;
      }
      const x = mobilePlacementCandidate.x;
      const y = mobilePlacementCandidate.y;
      if (!Number.isFinite(x) || !Number.isFinite(y)) return;

      const check = evaluateTowerPlacement(x, y);
      const ok = !!check.ok;
      const pulse = 0.8 + Math.sin(frameCount * 0.17) * 0.18;
      const outerR = 13 + (ok ? 1.8 : 0.8) * pulse;
      const innerR = 4.2 + (ok ? 0.6 : 0.2) * pulse;

      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = ok ? "rgba(142, 243, 171, 0.95)" : "rgba(255, 132, 132, 0.92)";
      ctx.fillStyle = ok ? "rgba(58, 180, 95, 0.28)" : "rgba(180, 58, 58, 0.24)";
      ctx.beginPath();
      ctx.arc(x, y, outerR, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = ok ? "rgba(182, 255, 204, 0.92)" : "rgba(255, 200, 200, 0.9)";
      ctx.beginPath();
      ctx.arc(x, y, innerR, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = ok ? "rgba(224, 255, 232, 0.92)" : "rgba(255, 224, 224, 0.92)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(x - 7, y);
      ctx.lineTo(x + 7, y);
      ctx.moveTo(x, y - 7);
      ctx.lineTo(x, y + 7);
      ctx.stroke();

      if (!ok) {
        ctx.strokeStyle = "rgba(255, 98, 98, 0.9)";
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(x - 8, y - 8);
        ctx.lineTo(x + 8, y + 8);
        ctx.moveTo(x + 8, y - 8);
        ctx.lineTo(x - 8, y + 8);
        ctx.stroke();
      }
      ctx.restore();
    }

    function upgradeTowerAt(x, y) {
      if (gameOver || levelComplete) return;
      const chosen = findTowerAt(x, y);
      upgradeTower(chosen);
    }

    function getCanvasCoords(e) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      let clientX = Number.isFinite(e?.clientX) ? e.clientX : null;
      let clientY = Number.isFinite(e?.clientY) ? e.clientY : null;

      if ((clientX === null || clientY === null) && e?.touches?.length) {
        clientX = Number.isFinite(e.touches[0].clientX) ? e.touches[0].clientX : clientX;
        clientY = Number.isFinite(e.touches[0].clientY) ? e.touches[0].clientY : clientY;
      }
      if ((clientX === null || clientY === null) && e?.changedTouches?.length) {
        clientX = Number.isFinite(e.changedTouches[0].clientX) ? e.changedTouches[0].clientX : clientX;
        clientY = Number.isFinite(e.changedTouches[0].clientY) ? e.changedTouches[0].clientY : clientY;
      }
      if (clientX === null || clientY === null) {
        return { x: NaN, y: NaN };
      }
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
      };
    }

    function startWave() {
      if (levelComplete && nextLevelPending) {
        levelNumber = nextLevelPending;
        if (levelSelect) levelSelect.value = String(levelNumber);
        resetGame(true);
        setStatus(`Level ${levelNumber} started: ${getCurrentLevelConfig().name}.`, "good");
        return;
      }
      if (gameOver || levelComplete) return;
      const lvl = getCurrentLevelConfig();
      if (wave >= lvl.waves) {
        setStatus(`Level ${levelNumber} already complete. Press New Run to replay.`, "good");
        return;
      }
      const profile = getDifficultyProfile();
      const bossEvery = getBossWaveInterval(lvl, profile);
      const startedEarly = !!autoWaveTimer;
      if (autoWaveTimer) {
        clearTimeout(autoWaveTimer);
        autoWaveTimer = null;
      }
      autoWaveDueAt = 0;
      towerFloatHideAt = 0;
      towerFloatHover = false;
      if (towerFloatCardEl) towerFloatCardEl.hidden = true;
      if (waveSummaryHideTimer) {
        clearTimeout(waveSummaryHideTimer);
        waveSummaryHideTimer = null;
      }
      if (waveSummaryEl) waveSummaryEl.classList.remove("show");
      if (flawlessCalloutHideTimer) {
        clearTimeout(flawlessCalloutHideTimer);
        flawlessCalloutHideTimer = null;
      }
      if (flawlessCalloutEl) flawlessCalloutEl.classList.remove("show");
      flawlessChipCelebrateUntil = 0;
      flawlessChipCelebrateAmount = 0;

      wave += 1;
      if (wave === 1) markTutorialProgress("startedWave");
      currentWaveEarlyStart = startedEarly;
      currentWaveFinalBoost = wave === lvl.waves;
      currentWaveHasBoss = wave % bossEvery === 0;
      const wavePlan = simulation.computeWaveSpawnPlan({
        wave,
        lvl,
        profile,
        waveBalance,
        currentWaveHasBoss
      });
      const total = wavePlan.total;
      const hp = wavePlan.hp;
      const speed = wavePlan.speed;
      const reward = wavePlan.reward;
      const spawnDelay = wavePlan.spawnDelay;
      const laneIds = (lvl.laneDefinitions || []).map(def => def.id).filter(Boolean);
      const waveLaneId = laneIds.length > 0 ? laneIds[Math.floor(Math.random() * laneIds.length)] : "top";
      const waveLaneLabel = `${waveLaneId} path`;
      currentWaveSpawnTotal = total;
      currentWaveLaneLabel = waveLaneLabel;
      currentWaveKillCount = 0;
      currentWaveRewardEarned = 0;
      currentWaveStartLives = lives;
      currentWaveDamageDealt = 0;

      let pending = total;
      activeSpawners += 1;
      let calloutText = `Wave ${wave} - ${waveLaneLabel}`;
      let calloutMode = "normal";
      if (currentWaveFinalBoost && currentWaveHasBoss && startedEarly) {
        setStatus(`Final Boss ${wave}/${lvl.waves} on ${waveLaneLabel}. Enemies are 2x strength and enlarged. +25% early-start active.`, "danger");
        calloutText = `Final Boss Wave ${wave}/${lvl.waves}`;
        calloutMode = "final";
      } else if (currentWaveFinalBoost && currentWaveHasBoss) {
        setStatus(`Final Boss ${wave}/${lvl.waves} on ${waveLaneLabel}. Enemies are 2x strength and enlarged.`, "danger");
        calloutText = `Final Boss Wave ${wave}/${lvl.waves}`;
        calloutMode = "final";
      } else if (currentWaveFinalBoost && startedEarly) {
        setStatus(`Final Wave ${wave}/${lvl.waves} on ${waveLaneLabel}. Enemies are 2x strength and enlarged. +25% early-start active.`, "danger");
        calloutText = `Final Wave ${wave}/${lvl.waves}`;
        calloutMode = "final";
      } else if (currentWaveFinalBoost) {
        setStatus(`Final Wave ${wave}/${lvl.waves} on ${waveLaneLabel}. Enemies are 2x strength and enlarged.`, "danger");
        calloutText = `Final Wave ${wave}/${lvl.waves}`;
        calloutMode = "final";
      } else if (currentWaveHasBoss && startedEarly) {
        setStatus(`Boss Wave ${wave} on ${waveLaneLabel}. Gate Crasher incoming. +25% early-start active.`, "danger");
        calloutText = `Boss Wave ${wave} - ${waveLaneLabel}`;
        calloutMode = "boss";
      } else if (currentWaveHasBoss) {
        setStatus(`Boss Wave ${wave} on ${waveLaneLabel}. Gate Crasher incoming.`, "danger");
        calloutText = `Boss Wave ${wave} - ${waveLaneLabel}`;
        calloutMode = "boss";
      } else if (startedEarly) {
        setStatus(`Wave ${wave} started early on ${waveLaneLabel}. +25% clear bonus active. ${total} bugs incoming.`, "good");
      } else {
        setStatus(`Wave ${wave} started on ${waveLaneLabel}. ${total} bugs incoming.`, "warn");
      }
      playSfx(currentWaveHasBoss ? "bossStart" : "waveStart");
      showWaveCallout(calloutText, calloutMode, 2900);
      syncHUD();
      saveRunSnapshot();

      let bossSpawned = !currentWaveHasBoss;
      const spawnTimer = setInterval(() => {
        let enemyType = pickEnemyTypeForLevel(lvl, wave);
        if (!bossSpawned) {
          enemyType = "gatecrasher";
          bossSpawned = true;
        }
        enemies.push(createEnemy(enemyType, waveLaneId, hp, speed, reward, currentWaveFinalBoost));

        pending -= 1;
        if (pending <= 0) {
          clearInterval(spawnTimer);
          spawnTimers.delete(spawnTimer);
          activeSpawners = Math.max(0, activeSpawners - 1);
          syncHUD();
        }
      }, spawnDelay);
      spawnTimers.add(spawnTimer);
    }

    function endGame() {
      gameOver = true;
      if (spawnTimers) {
        for (const timer of spawnTimers) clearInterval(timer);
        spawnTimers.clear();
      }
      if (autoWaveTimer) {
        clearTimeout(autoWaveTimer);
        autoWaveTimer = null;
      }
      updateMusicPlayback();
      playSfx("gameOver");
      autoWaveDueAt = 0;
      activeSpawners = 0;
      lastRunWave = lastClearedWave;
      lastRunMoney = money;
      lastRunBank = bank;
      const rank = getProspectiveRank(lastRunWave, lastRunBank);
      if (rank > 0) {
        scorePanelEl.style.display = "block";
        if (scoresPanelEl) scoresPanelEl.open = true;
        setStatus(`Game over. Top ${rank} run! Enter your name to save: Wave ${lastRunWave}, Bank $${lastRunBank}.`, "danger");
      } else {
        setStatus("Game over. Press New Run to try for top 10.", "danger");
      }
      syncHUD();
      saveRunSnapshot();
    }

    function pickTarget(tower) {
      return simulation.pickTargetByProgress(tower, enemies);
    }

    function getHitFeedbackColor(sourceType) {
      return simulation.getHitFeedbackColor(sourceType);
    }

    function spawnImpactBurst(x, y, color, count, spread, speedBase, sizeBase, lifeBase) {
      if (!impactBursts) impactBursts = [];
      combat.spawnImpactBurst(impactBursts, {
        x,
        y,
        color,
        count,
        spread,
        speedBase,
        sizeBase,
        lifeBase,
        cap: 700
      });
    }

    function applyEnemyDamage(enemy, damage, sourceType = "spray") {
      return combat.applyEnemyDamage({
        enemy,
        damage,
        sourceType,
        getHitFeedbackColor,
        impactBursts,
        onDamageDealt: (dealt) => {
          currentWaveDamageDealt += dealt;
        },
        onBossHit: () => {
          playSfx("bossHit");
        }
      });
    }

    function removeEnemyAtIndex(enemyIndex, rewardOnDefeat = false) {
      if (enemyIndex < 0 || enemyIndex >= enemies.length) return;
      const enemy = enemies[enemyIndex];
      releaseVegetableReservation(enemy);
      const style = rendering.getEnemyStyle(enemy.enemyType);
      const deathColor = enemy.hitColor || style.hp || "rgba(255, 196, 130, 0.9)";
      spawnImpactBurst(enemy.x, enemy.y, deathColor, enemy.enemyType === "gatecrasher" ? 14 : 10, 1.15, 1.2, 2.2, 14);
      if (rewardOnDefeat) {
        money += enemy.reward;
        currentWaveKillCount += 1;
        currentWaveRewardEarned += enemy.reward;
        if (profileData) {
          const c = ensureCareerStats(profileData);
          c.bugsDefeated += 1;
          c.coinsFromKills += Math.max(0, Math.round(enemy.reward));
        }
        playSfx("defeat");
      }
      enemies.splice(enemyIndex, 1);
    }

    function updateSimulation() {
      if (!gameStarted) return;
      frameCount += 1;
      updatePlacementUndoUi();

      bunnySpawnCooldown -= 1;
      if (!gameOver && bunnySpawnCooldown <= 0) {
        triggerBunnyAttack();
        bunnySpawnCooldown = getBunnyCooldown();
      }

      for (let i = bunnies.length - 1; i >= 0; i -= 1) {
        bunnies[i].life -= 1;
        if (bunnies[i].life <= 0) bunnies.splice(i, 1);
      }

      for (let i = implosions.length - 1; i >= 0; i -= 1) {
        implosions[i].life -= 1;
        if (implosions[i].life <= 0) implosions.splice(i, 1);
      }
      for (let i = impactBursts.length - 1; i >= 0; i -= 1) {
        const p = impactBursts[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.93;
        p.vy *= 0.93;
        p.life -= 1;
        if (p.life <= 0) impactBursts.splice(i, 1);
      }

      for (const veg of gardenVegetables) {
        if (veg.chewFlash > 0) veg.chewFlash -= 1;
      }

      for (let i = gluePatches.length - 1; i >= 0; i--) {
        gluePatches[i].life -= 1;
        if (gluePatches[i].life <= 0) gluePatches.splice(i, 1);
      }

      for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        e.hitFlash = Math.max(0, (e.hitFlash || 0) - 1);
        e.slowFlash = Math.max(0, (e.slowFlash || 0) - 1);
        e.slowStatusTimer = Math.max(0, (e.slowStatusTimer || 0) - 1);
        e.jamStatusTimer = Math.max(0, (e.jamStatusTimer || 0) - 1);
        if (e.state === "path") {
          const lane = getLane(e.laneId);
          if (!lane || !Number.isFinite(lane.totalLength) || lane.totalLength <= 0) {
            removeEnemyAtIndex(i, false);
            continue;
          }
          let speedFactor = 1;
          let glueContact = false;
          for (const patch of gluePatches) {
            if (patch.laneId !== e.laneId) continue;
            const dx = e.x - patch.x;
            const dy = e.y - patch.y;
            const enemySize = enemyRadius * (e.sizeMul || 1);
            const overlap = patch.radius + enemySize * 0.4;
            if (dx * dx + dy * dy <= overlap * overlap) {
              const resist = e.glueResist || 0;
              const adjustedSlow = 1 - (1 - patch.slowMultiplier) * (1 - resist);
              speedFactor = Math.min(speedFactor, adjustedSlow);
              glueContact = true;
            }
          }
          if (glueContact) {
            e.slowFlash = Math.max(e.slowFlash || 0, 8);
            e.slowStatusTimer = Math.max(e.slowStatusTimer || 0, 16);
          }
          if (e.enemyType === "mantis") {
            e.jamStatusTimer = Math.max(e.jamStatusTimer || 0, 18);
          }

          e.pathDist += e.speed * speedFactor;
          const pos = getPathPointAtDistance(e.laneId, e.pathDist);
          e.x = pos.x;
          e.y = pos.y;
          e.progress = Math.min(1, e.pathDist / lane.totalLength);

          if (e.pathDist >= lane.totalLength) {
            const targetVeg = getAssignableVegetable();
            if (targetVeg) {
              targetVeg.reservedBy = e.id;
              e.targetVegetableId = targetVeg.id;
              e.state = "toVegetable";
              e.progress = 1;
            } else {
              e.state = "leaving";
            }
          }
        } else if (e.state === "toVegetable") {
          const veg = getVegetableById(e.targetVegetableId);
          if (!veg || veg.gone) {
            e.state = "leaving";
            releaseVegetableReservation(e);
            e.targetVegetableId = null;
          } else {
            const dx = veg.x - e.x;
            const dy = veg.y - e.y;
            const step = 1.25;
            const snapDist = step + 0.2;
            const distSq = dx * dx + dy * dy;
            if (distSq <= snapDist * snapDist) {
              e.x = veg.x;
              e.y = veg.y;
              e.state = "eating";
              e.eatTimer = 0;
            } else {
              const dist = Math.sqrt(distSq);
              e.x += (dx / dist) * step;
              e.y += (dy / dist) * step;
            }
          }
        } else if (e.state === "eating") {
          const veg = getVegetableById(e.targetVegetableId);
          if (!veg || veg.gone) {
            releaseVegetableReservation(e);
            e.targetVegetableId = null;
            e.state = "leaving";
          } else {
            e.eatTimer += 1;
            const biteInterval = Math.max(7, Math.round(14 / (e.strengthMul || 1)));
            if (e.eatTimer % biteInterval === 0) {
              veg.bites += 1;
              veg.chewFlash = 10;
              if (veg.bites >= maxBitesPerVegetable) {
                veg.gone = true;
                veg.reservedBy = null;
                e.targetVegetableId = null;
                lives -= 1;
                if (lives <= 0) {
                  lives = 0;
                  endGame();
                }
                e.state = "leaving";
              }
            }
          }
        } else if (e.state === "leaving") {
          e.x += 1.8;
          if (e.x > canvas.width + 45) {
            removeEnemyAtIndex(i, false);
            continue;
          }
        }
      }

      for (const t of towers) {
        t.cooldown -= 1;
        if ((t.type === "spray" || t.type === "salt") && t.sprayFlash > 0) t.sprayFlash -= 1;
        if (t.type === "hose" && t.laserFlash > 0) t.laserFlash -= 1;
        if (t.cooldown > 0 || enemies.length === 0) continue;

        let towerJamDelayMul = 1;
        for (const e of enemies) {
          if (e.enemyType !== "mantis" || e.state === "leaving") continue;
          const jr = e.jamRadius || 0;
          if (jr <= 0) continue;
          const dx = e.x - t.x;
          const dy = e.y - t.y;
          if (dx * dx + dy * dy <= jr * jr) {
            towerJamDelayMul = Math.max(towerJamDelayMul, e.jamFireDelayMul || 1);
          }
        }

        const best = pickTarget(t);

          if (best) {
          if (t.type === "glue") {
            const lane = getLane(best.laneId);
            if (!lane || !Number.isFinite(lane.totalLength) || lane.totalLength <= 0) {
              t.cooldown = Math.max(10, Math.round(t.fireRate * 0.35 * towerJamDelayMul));
              continue;
            }
            const trapDist = Math.min(lane.totalLength - 10, best.pathDist + 22 + t.level * 4.5);
            const trapPos = getPathPointAtDistance(best.laneId, trapDist);
            gluePatches.push({
              x: trapPos.x,
              y: trapPos.y,
              laneId: best.laneId,
              life: t.trapLife,
              radius: t.trapRadius,
              slowMultiplier: t.slowMultiplier
            });
            if (gluePatches.length > 90) gluePatches.shift();
            playTowerShotSfx("glue");
          } else if (t.type === "hose") {
            const baseAngle = Math.atan2(best.y - t.y, best.x - t.x);
            t.lastAimAngle = baseAngle;
            t.laserFlash = 5;
            const endX = t.x + Math.cos(baseAngle) * t.range;
            const endY = t.y + Math.sin(baseAngle) * t.range;
            for (let ei = enemies.length - 1; ei >= 0; ei -= 1) {
              const e = enemies[ei];
              const hitRadius = enemyRadius * (e.sizeMul || 1);
              const distToBeam = pointToSegmentDistance(e.x, e.y, t.x, t.y, endX, endY);
              if (distToBeam <= hitRadius + t.beamWidth) {
                applyEnemyDamage(e, t.damage, "hose");
                if (e.hp <= 0) {
                  removeEnemyAtIndex(ei, true);
                }
              }
            }
            playTowerShotSfx("hose");
          } else if (t.type === "salt") {
            const baseAngle = Math.atan2(best.y - t.y, best.x - t.x);
            t.lastAimAngle = baseAngle;
            t.sprayFlash = 5;
            const angle = baseAngle + (Math.random() - 0.5) * 0.035;
            const speed = 7.1 + Math.random() * 0.8;
            bullets.push({
              x: t.x,
              y: t.y,
              px: t.x,
              py: t.y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              damage: t.damage,
              life: 28,
              radius: 2.6,
              kind: "salt"
            });
            if (bullets.length > maxBulletsOnScreen) {
              bullets.splice(0, bullets.length - maxBulletsOnScreen);
            }
            playTowerShotSfx("salt");
          } else {
            const baseAngle = Math.atan2(best.y - t.y, best.x - t.x);
            t.lastAimAngle = baseAngle;
            t.sprayFlash = 6;
            const sprayCount = 6;
            const spread = 0.62;
            for (let s = 0; s < sprayCount; s += 1) {
              const laneT = sprayCount === 1 ? 0.5 : s / (sprayCount - 1);
              const angle = baseAngle - spread / 2 + laneT * spread + (Math.random() - 0.5) * 0.08;
              const speed = 4.8 + Math.random() * 1.3;
              bullets.push({
                x: t.x,
                y: t.y,
                px: t.x,
                py: t.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                damage: t.damage * 0.34,
                life: 24 + Math.floor(Math.random() * 5),
                radius: 4.2 + Math.random() * 2.1
              });
            }
            if (bullets.length > maxBulletsOnScreen) {
              bullets.splice(0, bullets.length - maxBulletsOnScreen);
            }
            playTowerShotSfx("spray");
          }
          t.cooldown = Math.round(t.fireRate * towerJamDelayMul);
        }
      }

      combat.resolveProjectileHits({
        bullets,
        enemies,
        enemyRadius,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
        applyEnemyDamageFn: applyEnemyDamage,
        removeEnemyAtIndex
      });

      if (!gameOver && activeSpawners === 0 && enemies.length === 0 && wave > lastClearedWave) {
        const lvl = getCurrentLevelConfig();
        const profile = getDifficultyProfile();
        const waveBossFlag = currentWaveHasBoss;
        const waveVegLost = Math.max(0, currentWaveStartLives - lives);
        const flawlessBonus = waveVegLost === 0
          ? Math.round(waveBalance.clearBonusFlawless + wave * 0.45 + (waveBossFlag ? 2 : 0))
          : 0;
        const reserveCap = Math.round(waveBalance.reserveBonusCap + wave * 0.55 + (waveBossFlag ? 2 : 0));
        const reserveBonus = Math.max(0, Math.min(reserveCap, Math.round(money * waveBalance.reserveBonusRate)));
        const baseBonus = waveBalance.clearBonusBase + Math.round(wave * waveBalance.clearBonusPerWave) + (waveBossFlag ? waveBalance.clearBonusBossAdd : 0) + flawlessBonus;
        const levelClearBonusMul = Number.isFinite(lvl.clearBonusMul) ? lvl.clearBonusMul : 1;
        const scaledBonus = Math.max(0, Math.round(baseBonus * (profile.clearBonusMul || 1) * levelClearBonusMul));
        const cleanDefenseBonus = Math.max(0, scaledBonus - waveVegLost * waveBalance.clearBonusVegPenalty) + reserveBonus;
        const bonus = currentWaveEarlyStart ? Math.round(cleanDefenseBonus * (1 + earlyStartBonusPct)) : cleanDefenseBonus;
        const damageDealt = Math.round(currentWaveDamageDealt || 0);
        const kps = currentWaveKillCount > 0 ? (currentWaveRewardEarned / currentWaveKillCount).toFixed(1) : "0.0";
        const earlyTag = currentWaveEarlyStart ? `Early Start +${Math.round(earlyStartBonusPct * 100)}%` : "Early Start: No";
        money += bonus;
        if (flawlessBonus > 0) {
          showFlawlessCallout(flawlessBonus, 1500);
          triggerFlawlessChipReward(flawlessBonus);
          showMoneyGainFx(`FLAWLESS +$${flawlessBonus}`, "flawless", 120);
        }
        showMoneyGainFx(`+$${bonus}`, "bonus", flawlessBonus > 0 ? 360 : 120);
        if (profileData) {
          const c = ensureCareerStats(profileData);
          c.wavesCleared += 1;
          c.coinsFromBonus += Math.max(0, Math.round(bonus));
          c.bestWave = Math.max(c.bestWave || 0, wave);
        }
        showWaveSummary({
          title: waveBossFlag ? `Wave ${wave} Cleared - Boss Defeated` : `Wave ${wave} Cleared`,
          parts: [
            `Lane: ${currentWaveLaneLabel || "Unknown path"}`,
            `Defeated: ${currentWaveKillCount}/${currentWaveSpawnTotal || currentWaveKillCount}`,
            `Veg Lost: ${waveVegLost}`,
            `Damage Dealt: ${damageDealt}`,
            `Rewards: $${currentWaveRewardEarned} (${kps}/kill)`,
            `Flawless: +$${flawlessBonus} | Reserve: +$${reserveBonus} (cap $${reserveCap})`,
            `${earlyTag} | Clear Bonus: $${bonus}`
          ]
        });
        showWaveCallout(waveBossFlag ? `Wave ${wave} Cleared - Boss Down` : `Wave ${wave} Cleared`, waveBossFlag ? "boss" : "normal", 2200);
        if (wave >= lvl.waves) {
          const levelBankDeposit = money;
          bank += levelBankDeposit;
          money = 0;
          if (profileData) {
            const c = ensureCareerStats(profileData);
            c.bankedTotal += Math.max(0, Math.round(levelBankDeposit));
            c.bestBank = Math.max(c.bestBank || 0, bank);
          }
          levelComplete = true;
          currentWaveHasBoss = false;
          currentWaveFinalBoost = false;
          currentWaveEarlyStart = false;
          if (autoWaveTimer) {
            clearTimeout(autoWaveTimer);
            autoWaveTimer = null;
          }
          autoWaveDueAt = 0;
          awardLevelBadge(levelNumber);
          nextLevelPending = getNextLevelNumber(levelNumber);
          if (badgesPanelEl) badgesPanelEl.open = true;
          if (nextLevelPending) {
            setStatus(`Level ${levelNumber} complete. Banked $${levelBankDeposit}. Bank total: $${bank}. Badge earned. Level ${nextLevelPending} unlocked. Press Start to continue.`, "good");
          } else {
            lastRunWave = wave;
            lastRunMoney = money;
            lastRunBank = bank;
            const rank = getProspectiveRank(lastRunWave, lastRunBank);
            if (rank > 0) {
              scorePanelEl.style.display = "block";
              if (scoresPanelEl) scoresPanelEl.open = true;
              setStatus(`Level ${levelNumber} complete. Final bank: $${bank}. Top ${rank} run! Enter your name to save score.`, "good");
            } else {
              setStatus(`Level ${levelNumber} complete. Banked $${levelBankDeposit}. Final bank: $${bank}. You defended all ${lvl.waves} waves.`, "good");
            }
          }
          lastClearedWave = wave;
          populateLevelSelect();
          syncHUD();
          saveRunSnapshot();
          playSfx("waveClear");
          updateMusicPlayback();
          return;
        }
        if (currentWaveEarlyStart) {
          const bonusExtra = bonus - cleanDefenseBonus;
          const bossNote = waveBossFlag ? " Boss defeated!" : "";
          setStatus(`Wave ${wave} cleared.${bossNote} Base $${baseBonus} + reserve $${reserveBonus} + early-start $${bonusExtra} = $${bonus}. Next wave in 10s (or start now for +25%).`, "good");
        } else {
          const bossNote = waveBossFlag ? " Boss defeated!" : "";
          setStatus(`Wave ${wave} cleared.${bossNote} +$${bonus} bonus (includes reserve +$${reserveBonus}). Next wave in 10s (or start now for +25%).`, "good");
        }
        lastClearedWave = wave;
        currentWaveEarlyStart = false;
        currentWaveHasBoss = false;
        scheduleAutoWaveStart();
        saveRunSnapshot();
        playSfx("waveClear");
      }

      if (frameCount % 6 === 0) syncHUD();
    }

    function drawRoad() {
      const blockedWidth = (roadHalfHeight + 4) * 2;
      const cfg = getCurrentLevelConfig();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (const lane of Object.values(lanes)) {
        const points = lane.points;
        const lanePath = lane.path;
        ctx.strokeStyle = roadShoulderColor;
        ctx.lineWidth = blockedWidth;
        ctx.stroke(lanePath);

        ctx.strokeStyle = lane.roadGradient || "#7e8894";
        ctx.lineWidth = roadHalfHeight * 2;
        ctx.stroke(lanePath);

        // Soft paving bed tint and wear for depth.
        ctx.save();
        ctx.globalCompositeOperation = "soft-light";
        ctx.strokeStyle = "rgba(190, 204, 222, 0.12)";
        ctx.lineWidth = Math.max(3, roadHalfHeight * 0.95);
        ctx.stroke(lanePath);
        ctx.globalCompositeOperation = "multiply";
        ctx.strokeStyle = "rgba(56, 66, 80, 0.16)";
        ctx.lineWidth = Math.max(2, roadHalfHeight * 0.55);
        ctx.stroke(lanePath);
        ctx.restore();

        // Soft edge highlights for a cleaner, more dimensional path
        ctx.strokeStyle = "rgba(240, 248, 255, 0.22)";
        ctx.lineWidth = 1.4;
        ctx.stroke(lanePath);

        ctx.strokeStyle = "rgba(18, 24, 34, 0.18)";
        ctx.lineWidth = Math.max(1, roadHalfHeight * 0.6);
        ctx.stroke(lanePath);

        if (cfg.terrain === "snow") {
          // Frost buildup hugging both road shoulders.
          ctx.save();
          ctx.globalCompositeOperation = "screen";
          ctx.strokeStyle = "rgba(243, 251, 255, 0.56)";
          ctx.lineWidth = Math.max(2.8, roadHalfHeight * 0.44);
          ctx.stroke(lanePath);
          ctx.strokeStyle = "rgba(176, 206, 234, 0.36)";
          ctx.lineWidth = Math.max(4.8, roadHalfHeight * 0.64);
          ctx.stroke(lanePath);
          ctx.strokeStyle = "rgba(228, 244, 255, 0.28)";
          ctx.lineWidth = Math.max(1.6, roadHalfHeight * 0.22);
          ctx.stroke(lanePath);
          ctx.restore();

          // Compacted snow ruts for a trampled/worn winter lane look.
          ctx.save();
          ctx.strokeStyle = "rgba(98, 122, 150, 0.34)";
          ctx.lineWidth = Math.max(1.8, roadHalfHeight * 0.24);
          for (const seg of lane.segments) {
            const dx = seg.b.x - seg.a.x;
            const dy = seg.b.y - seg.a.y;
            const len = Math.max(0.0001, Math.hypot(dx, dy));
            const nx = -dy / len;
            const ny = dx / len;
            const inset = Math.max(2.8, roadHalfHeight * 0.27);
            ctx.beginPath();
            ctx.moveTo(seg.a.x + nx * inset, seg.a.y + ny * inset);
            ctx.lineTo(seg.b.x + nx * inset, seg.b.y + ny * inset);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(seg.a.x - nx * inset, seg.a.y - ny * inset);
            ctx.lineTo(seg.b.x - nx * inset, seg.b.y - ny * inset);
            ctx.stroke();

            ctx.strokeStyle = "rgba(222, 240, 255, 0.26)";
            ctx.lineWidth = Math.max(0.9, roadHalfHeight * 0.12);
            ctx.beginPath();
            ctx.moveTo(seg.a.x + nx * (inset - 0.9), seg.a.y + ny * (inset - 0.9));
            ctx.lineTo(seg.b.x + nx * (inset - 0.9), seg.b.y + ny * (inset - 0.9));
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(seg.a.x - nx * (inset - 0.9), seg.a.y - ny * (inset - 0.9));
            ctx.lineTo(seg.b.x - nx * (inset - 0.9), seg.b.y - ny * (inset - 0.9));
            ctx.stroke();

            ctx.strokeStyle = "rgba(98, 122, 150, 0.34)";
            ctx.lineWidth = Math.max(1.8, roadHalfHeight * 0.24);
          }
          ctx.restore();
        }

        // Subtle paving joints crossing the path.
        for (const joint of lane.pathJoints || []) {
          const nx = -Math.sin(joint.angle);
          const ny = Math.cos(joint.angle);
          const jh = joint.len * 0.5;
          ctx.strokeStyle = "rgba(68, 77, 92, 0.26)";
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.moveTo(joint.x - nx * jh, joint.y - ny * jh);
          ctx.lineTo(joint.x + nx * jh, joint.y + ny * jh);
          ctx.stroke();

          ctx.strokeStyle = "rgba(220, 232, 246, 0.1)";
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(joint.x - nx * jh + 0.4, joint.y - ny * jh + 0.4);
          ctx.lineTo(joint.x + nx * jh + 0.4, joint.y + ny * jh + 0.4);
          ctx.stroke();
        }

        // Tiny edge pebbles to blend path into surrounding terrain.
        for (const pebble of lane.pathPebbles || []) {
          if (cfg.terrain === "snow") {
            ctx.fillStyle = `rgba(238, 248, 255, ${Math.min(0.5, pebble.a + 0.16)})`;
          } else {
            ctx.fillStyle = `rgba(206, 217, 228, ${pebble.a})`;
          }
          ctx.beginPath();
          ctx.arc(pebble.x, pebble.y, pebble.r, 0, Math.PI * 2);
          ctx.fill();
        }

        for (const stone of lane.flagstones) {
          ctx.save();
          ctx.translate(stone.x, stone.y);
          ctx.rotate(stone.rot);
          const stoneGrad = ctx.createLinearGradient(-stone.rx, -stone.ry, stone.rx, stone.ry);
          stoneGrad.addColorStop(0, stone.fill);
          stoneGrad.addColorStop(1, stone.edge);
          ctx.fillStyle = stoneGrad;
          ctx.strokeStyle = stone.edge;
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.ellipse(0, 0, stone.rx, stone.ry, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = stone.innerA;
          ctx.beginPath();
          ctx.ellipse(-stone.rx * 0.22, -stone.ry * 0.24, stone.rx * 0.44, stone.ry * 0.34, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = stone.innerB;
          ctx.beginPath();
          ctx.ellipse(stone.rx * 0.2, stone.ry * 0.26, stone.rx * 0.48, stone.ry * 0.34, 0, 0, Math.PI * 2);
          ctx.fill();

          if (stone.crack) {
            ctx.strokeStyle = "rgba(52, 61, 72, 0.35)";
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(-stone.rx * 0.36, -stone.ry * 0.08);
            ctx.lineTo(stone.rx * 0.34, stone.ry * 0.14);
            ctx.moveTo(stone.rx * 0.05, -stone.ry * 0.26);
            ctx.lineTo(stone.rx * 0.26, stone.ry * 0.02);
            ctx.stroke();
          }
          ctx.restore();
        }

        for (const flower of lane.flowers) {
          if ((flower.kind || cfg.flowerTheme) === "cactus") {
            ctx.fillStyle = flower.petal;
            ctx.beginPath();
            ctx.roundRect(flower.x - flower.size * 0.9, flower.y - flower.size * 1.7, flower.size * 1.8, flower.size * 3.2, flower.size * 0.55);
            ctx.fill();

            ctx.beginPath();
            ctx.roundRect(flower.x - flower.size * 1.75, flower.y - flower.size * 1.0, flower.size * 0.95, flower.size * 1.8, flower.size * 0.45);
            ctx.fill();

            ctx.beginPath();
            ctx.roundRect(flower.x + flower.size * 0.8, flower.y - flower.size * 1.0, flower.size * 0.95, flower.size * 1.8, flower.size * 0.45);
            ctx.fill();

            ctx.strokeStyle = "rgba(234, 245, 220, 0.65)";
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(flower.x, flower.y - flower.size * 1.4);
            ctx.lineTo(flower.x, flower.y + flower.size * 1.3);
            ctx.moveTo(flower.x - flower.size * 1.3, flower.y - flower.size * 0.7);
            ctx.lineTo(flower.x - flower.size * 1.3, flower.y + flower.size * 0.6);
            ctx.moveTo(flower.x + flower.size * 1.3, flower.y - flower.size * 0.7);
            ctx.lineTo(flower.x + flower.size * 1.3, flower.y + flower.size * 0.6);
            ctx.stroke();

            ctx.fillStyle = flower.center;
            ctx.beginPath();
            ctx.arc(flower.x, flower.y - flower.size * 1.75, flower.size * 0.48, 0, Math.PI * 2);
            ctx.fill();
          } else if ((flower.kind || cfg.flowerTheme) === "sunflower") {
            ctx.fillStyle = flower.petal;
            for (let p = 0; p < 10; p += 1) {
              const a = (Math.PI * 2 * p) / 10;
              const px = flower.x + Math.cos(a) * flower.size * 1.75;
              const py = flower.y + Math.sin(a) * flower.size * 1.75;
              ctx.beginPath();
              ctx.ellipse(px, py, flower.size * 0.72, flower.size * 1.1, a, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.fillStyle = flower.center;
            ctx.beginPath();
            ctx.arc(flower.x, flower.y, flower.size * 0.95, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "rgba(40, 26, 18, 0.35)";
            ctx.beginPath();
            ctx.arc(flower.x + flower.size * 0.16, flower.y + flower.size * 0.12, flower.size * 0.34, 0, Math.PI * 2);
            ctx.fill();
          } else if ((flower.kind || cfg.flowerTheme) === "christmas") {
            const scale = flower.size * 0.5;
            const sway = Math.sin((flower.x + flower.y) * 0.08 + frameCount * 0.02) * 0.5;
            const cx = flower.x + sway;
            const cy = flower.y;

            // Tree trunk
            ctx.fillStyle = "#7a5632";
            ctx.beginPath();
            ctx.roundRect(cx - 0.55 * scale, cy + 1.5 * scale, 1.1 * scale, 1.7 * scale, 0.25 * scale);
            ctx.fill();

            // Pine tree body
            ctx.fillStyle = flower.petal;
            ctx.beginPath();
            ctx.moveTo(cx, cy - 3.0 * scale);
            ctx.lineTo(cx - 2.2 * scale, cy - 0.6 * scale);
            ctx.lineTo(cx - 0.95 * scale, cy - 0.6 * scale);
            ctx.lineTo(cx - 2.7 * scale, cy + 1.45 * scale);
            ctx.lineTo(cx + 2.7 * scale, cy + 1.45 * scale);
            ctx.lineTo(cx + 0.95 * scale, cy - 0.6 * scale);
            ctx.lineTo(cx + 2.2 * scale, cy - 0.6 * scale);
            ctx.closePath();
            ctx.fill();

            // Ornaments
            ctx.fillStyle = flower.center;
            ctx.beginPath();
            ctx.arc(cx - 1.0 * scale, cy - 0.65 * scale, 0.26 * scale, 0, Math.PI * 2);
            ctx.arc(cx + 0.95 * scale, cy + 0.1 * scale, 0.24 * scale, 0, Math.PI * 2);
            ctx.arc(cx, cy + 0.8 * scale, 0.22 * scale, 0, Math.PI * 2);
            ctx.fill();

            // Candy cane hedge accent
            const caneX = cx + 3.05 * scale;
            const caneY = cy + 1.9 * scale;
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = Math.max(1.1, 0.45 * scale);
            ctx.beginPath();
            ctx.moveTo(caneX, caneY);
            ctx.lineTo(caneX, caneY - 2.5 * scale);
            ctx.arc(caneX - 0.62 * scale, caneY - 2.5 * scale, 0.62 * scale, 0, Math.PI, true);
            ctx.stroke();

            ctx.strokeStyle = "#d84b4b";
            ctx.lineWidth = Math.max(0.8, 0.26 * scale);
            for (let s = 0; s < 3; s += 1) {
              const yy = caneY - 0.8 * scale - s * 0.75 * scale;
              ctx.beginPath();
              ctx.moveTo(caneX - 0.45 * scale, yy);
              ctx.lineTo(caneX + 0.2 * scale, yy - 0.42 * scale);
              ctx.stroke();
            }

            // Short hedge rail line
            ctx.strokeStyle = "#e8ecef";
            ctx.lineWidth = Math.max(0.9, 0.25 * scale);
            ctx.beginPath();
            ctx.moveTo(cx + 1.8 * scale, cy + 1.7 * scale);
            ctx.lineTo(cx + 4.15 * scale, cy + 1.7 * scale);
            ctx.stroke();
          } else {
            ctx.fillStyle = flower.petal;
            for (let p = 0; p < 5; p += 1) {
              const a = (Math.PI * 2 * p) / 5;
              const px = flower.x + Math.cos(a) * flower.size * 1.2;
              const py = flower.y + Math.sin(a) * flower.size * 1.2;
              ctx.beginPath();
              ctx.arc(px, py, flower.size, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.fillStyle = flower.center;
            ctx.beginPath();
            ctx.arc(flower.x, flower.y, flower.size * 0.75, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      for (const patch of gluePatches) {
        const lifeAlpha = Math.max(0.18, Math.min(0.55, patch.life / 210));
        ctx.fillStyle = `rgba(245, 224, 124, ${lifeAlpha})`;
        ctx.beginPath();
        ctx.ellipse(patch.x, patch.y, patch.radius * 1.05, patch.radius * 0.72, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(232, 198, 69, ${lifeAlpha * 0.9})`;
        ctx.beginPath();
        ctx.arc(patch.x - patch.radius * 0.22, patch.y + 1, patch.radius * 0.38, 0, Math.PI * 2);
        ctx.arc(patch.x + patch.radius * 0.2, patch.y - 1, patch.radius * 0.31, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawLawn() {
      ctx.drawImage(lawnTexture, 0, 0);
      const cfg = getCurrentLevelConfig();
      if (cfg.terrain === "snow") {
        for (const tr of winterForestTrees) {
          const s = tr.scale;
          const cx = tr.x;
          const cy = tr.y;
          ctx.fillStyle = "#6b4f34";
          ctx.beginPath();
          ctx.roundRect(cx - 1.2 * s, cy + 6.5 * s, 2.4 * s, 3.2 * s, 0.6 * s);
          ctx.fill();

          ctx.fillStyle = tr.tint > 1 ? "#2f7f4a" : "#2b6f43";
          ctx.beginPath();
          ctx.moveTo(cx, cy - 9.2 * s);
          ctx.lineTo(cx - 7.8 * s, cy + 1.6 * s);
          ctx.lineTo(cx + 7.8 * s, cy + 1.6 * s);
          ctx.closePath();
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(cx, cy - 4.6 * s);
          ctx.lineTo(cx - 6.2 * s, cy + 4.6 * s);
          ctx.lineTo(cx + 6.2 * s, cy + 4.6 * s);
          ctx.closePath();
          ctx.fill();
        }

        for (const sm of winterSnowmen) {
          const s = sm.scale;
          ctx.fillStyle = "#f8fbff";
          ctx.beginPath();
          ctx.arc(sm.x, sm.y + 2.2 * s, 2.3 * s, 0, Math.PI * 2);
          ctx.arc(sm.x, sm.y - 0.5 * s, 1.55 * s, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#2e3640";
          ctx.beginPath();
          ctx.arc(sm.x - 0.48 * s, sm.y - 0.8 * s, 0.18 * s, 0, Math.PI * 2);
          ctx.arc(sm.x + 0.48 * s, sm.y - 0.8 * s, 0.18 * s, 0, Math.PI * 2);
          ctx.fill();
        }

        const t = frameCount * 0.02;
        for (const f of snowflakes) {
          f.y += f.speed;
          f.x += Math.sin(t + f.phase) * f.sway;
          if (f.y > canvas.height + 3) {
            f.y = -3;
            f.x = Math.random() * canvas.width;
          }
          if (f.x < -4) f.x = canvas.width + 4;
          if (f.x > canvas.width + 4) f.x = -4;
          const alpha = 0.32 + (f.r / 2.8) * 0.36;
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      if (cfg.flowerTheme === "sunflower") {
        const t = frameCount * 0.05;
        for (const s of sunflowerField) {
          const sway = Math.sin(t + s.phase) * 1.9;
          const stemH = 8 + s.scale * 7.5;

          ctx.strokeStyle = "#4f7f2f";
          ctx.lineWidth = 1.25 * s.scale;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y + stemH);
          ctx.quadraticCurveTo(s.x + sway * 0.3, s.y + stemH * 0.56, s.x + sway, s.y + 1.4);
          ctx.stroke();

          ctx.fillStyle = "#6a983f";
          ctx.beginPath();
          ctx.ellipse(s.x - 1.2, s.y + stemH * 0.58, 2.2 * s.scale, 1.25 * s.scale, -0.6, 0, Math.PI * 2);
          ctx.ellipse(s.x + 1.3, s.y + stemH * 0.47, 2.1 * s.scale, 1.2 * s.scale, 0.6, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#f3bf21";
          for (let p = 0; p < 11; p += 1) {
            const a = (Math.PI * 2 * p) / 11 + (s.phase * 0.15);
            const px = s.x + sway + Math.cos(a) * (3.2 * s.scale);
            const py = s.y + Math.sin(a) * (3.2 * s.scale);
            ctx.beginPath();
            ctx.ellipse(px, py, 1.15 * s.scale, 2.0 * s.scale, a, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.fillStyle = "#4a2f1a";
          ctx.beginPath();
          ctx.arc(s.x + sway, s.y, 2.05 * s.scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (cfg.flowerTheme === "topiary") {
        for (const dot of topiaryDots) {
          const sway = Math.sin(frameCount * 0.03 + dot.x * 0.04 + dot.y * 0.02) * 0.7;
          const x = dot.x + sway * 0.2;
          const y = dot.y;
          const r = dot.r;

          ctx.fillStyle = "rgba(30, 55, 31, 0.2)";
          ctx.beginPath();
          ctx.ellipse(x + r * 0.2, y + r * 0.76, r * 0.92, r * 0.42, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = dot.shade === 0 ? "#3f7b3d" : (dot.shade === 1 ? "#4f8f49" : (dot.shade === 2 ? "#5b9a55" : "#2e6834"));
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "rgba(229, 244, 218, 0.33)";
          ctx.beginPath();
          ctx.arc(x - r * 0.32, y - r * 0.36, r * 0.34, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (cfg.terrain !== "prairie" && cfg.terrain !== "snow") return;
      const t = frameCount * 0.06;
      ctx.strokeStyle = "rgba(214, 225, 146, 0.34)";
      ctx.lineWidth = 1.1;
      for (const g of prairieBlades) {
        const sway = Math.sin(t + g.phase) * g.sway;
        ctx.beginPath();
        ctx.moveTo(g.x, g.y);
        ctx.quadraticCurveTo(g.x + sway * 0.5, g.y - g.h * 0.5, g.x + sway, g.y - g.h);
        ctx.stroke();
      }
    }

    function drawSceneLighting() {
      if (!sceneTopWashGradient || !sceneVignetteGradient) rebuildRenderCaches();
      ctx.fillStyle = sceneTopWashGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = sceneVignetteGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Directional sunlight sweep for depth.
      const sunSweep = ctx.createLinearGradient(0, 0, canvas.width, canvas.height * 0.9);
      sunSweep.addColorStop(0, "rgba(255, 248, 220, 0.07)");
      sunSweep.addColorStop(0.45, "rgba(255, 255, 255, 0.02)");
      sunSweep.addColorStop(1, "rgba(34, 50, 72, 0.07)");
      ctx.fillStyle = sunSweep;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function getSoilPattern(width, height) {
      const w = Math.max(32, Math.round(width));
      const h = Math.max(32, Math.round(height));
      const key = `${w}x${h}`;
      if (soilPatternCache && soilPatternKey === key) return soilPatternCache;

      soilTexture.width = w;
      soilTexture.height = h;
      const sctx = soilTexture.getContext("2d");
      if (!sctx) return null;

      sctx.clearRect(0, 0, w, h);
      sctx.fillStyle = "#8a6238";
      sctx.fillRect(0, 0, w, h);

      const baseGrad = sctx.createLinearGradient(0, 0, 0, h);
      baseGrad.addColorStop(0, "rgba(176, 132, 86, 0.3)");
      baseGrad.addColorStop(0.45, "rgba(124, 86, 49, 0.15)");
      baseGrad.addColorStop(1, "rgba(70, 45, 27, 0.32)");
      sctx.fillStyle = baseGrad;
      sctx.fillRect(0, 0, w, h);

      // Soil clods with shadow/highlight for depth.
      for (let i = 0; i < 64; i += 1) {
        const x = 6 + ((i * 37) % Math.max(10, w - 12));
        const y = 6 + ((i * 59) % Math.max(10, h - 12));
        const rx = 5 + (i % 5) * 1.5;
        const ry = 2.5 + (i % 4) * 0.9;
        const rot = ((i % 7) - 3) * 0.15;

        sctx.fillStyle = "rgba(74, 49, 29, 0.18)";
        sctx.beginPath();
        sctx.ellipse(x + 1.2, y + 0.8, rx, ry, rot, 0, Math.PI * 2);
        sctx.fill();

        sctx.fillStyle = "rgba(207, 167, 120, 0.13)";
        sctx.beginPath();
        sctx.ellipse(x - 1, y - 0.6, rx * 0.86, ry * 0.8, rot, 0, Math.PI * 2);
        sctx.fill();
      }

      // Furrows with slight alternating tonal ridges.
      for (let y = 10; y < h - 6; y += 13) {
        const wobble = ((y * 11) % 9) - 4;
        sctx.strokeStyle = "rgba(83, 54, 30, 0.34)";
        sctx.lineWidth = 1.2;
        sctx.beginPath();
        sctx.moveTo(4, y);
        sctx.bezierCurveTo(w * 0.3, y - 2 + wobble * 0.15, w * 0.68, y + 2 - wobble * 0.12, w - 4, y + wobble * 0.08);
        sctx.stroke();

        sctx.strokeStyle = "rgba(198, 157, 111, 0.16)";
        sctx.lineWidth = 0.7;
        sctx.beginPath();
        sctx.moveTo(4, y - 1.2);
        sctx.bezierCurveTo(w * 0.3, y - 2.8 + wobble * 0.12, w * 0.68, y + 1.2 - wobble * 0.1, w - 4, y - 1.1 + wobble * 0.06);
        sctx.stroke();
      }

      // Dense grit
      for (let i = 0; i < 520; i += 1) {
        const x = 2 + ((i * 23) % Math.max(6, w - 4));
        const y = 2 + ((i * 31) % Math.max(6, h - 4));
        const r = 0.35 + (i % 3) * 0.26;
        sctx.fillStyle = i % 5 === 0 ? "rgba(50, 33, 19, 0.26)" : (i % 2 === 0 ? "rgba(214, 176, 129, 0.17)" : "rgba(124, 87, 52, 0.2)");
        sctx.beginPath();
        sctx.arc(x, y, r, 0, Math.PI * 2);
        sctx.fill();
      }

      soilPatternCache = ctx.createPattern(soilTexture, "repeat");
      soilPatternKey = key;
      return soilPatternCache;
    }
    function drawGarden() {
      const bedX = canvas.width - 178;
      const bedY = 6;
      const bedW = 172;
      const bedH = canvas.height - 12;
      const soil = "#8a6238";
      const fenceColor = "#ffffff";
      const fenceStroke = "#cfd7df";
      const cfg = getCurrentLevelConfig();

      function getGateYAtX(laneId, targetX) {
        const lane = getLane(laneId);
        let nearest = lane.points[0];
        let nearestDist = Math.abs(nearest.x - targetX);
        for (let i = 0; i < lane.points.length - 1; i += 1) {
          const a = lane.points[i];
          const b = lane.points[i + 1];
          const minX = Math.min(a.x, b.x);
          const maxX = Math.max(a.x, b.x);
          if (targetX >= minX && targetX <= maxX && Math.abs(b.x - a.x) > 0.001) {
            const t = (targetX - a.x) / (b.x - a.x);
            return a.y + (b.y - a.y) * t;
          }
          const da = Math.abs(a.x - targetX);
          if (da < nearestDist) {
            nearest = a;
            nearestDist = da;
          }
        }
        return nearest.y;
      }

      ctx.fillStyle = "#6d4b2d";
      ctx.beginPath();
      ctx.roundRect(bedX, bedY, bedW, bedH, 12);
      ctx.fill();

      const innerX = bedX + 8;
      const innerY = bedY + 8;
      const innerW = bedW - 16;
      const innerH = bedH - 16;

      ctx.fillStyle = soil;
      ctx.beginPath();
      ctx.roundRect(innerX, innerY, innerW, innerH, 10);
      ctx.fill();      // Textured soil fill with stronger depth and contrast.
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(innerX, innerY, innerW, innerH, 10);
      ctx.clip();

      const soilPattern = getSoilPattern(innerW, innerH);
      if (soilPattern) {
        ctx.fillStyle = soilPattern;
        ctx.fillRect(innerX, innerY, innerW, innerH);
      }

      // Inner shadow and subtle top rim highlight to add depth.
      const edgeShade = ctx.createLinearGradient(0, innerY, 0, innerY + innerH);
      edgeShade.addColorStop(0, "rgba(255, 232, 197, 0.08)");
      edgeShade.addColorStop(0.16, "rgba(0, 0, 0, 0)");
      edgeShade.addColorStop(0.82, "rgba(0, 0, 0, 0)");
      edgeShade.addColorStop(1, "rgba(46, 28, 16, 0.3)");
      ctx.fillStyle = edgeShade;
      ctx.fillRect(innerX, innerY, innerW, innerH);

      ctx.strokeStyle = "rgba(229, 192, 142, 0.2)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(innerX + 0.6, innerY + 0.6, innerW - 1.2, innerH - 1.2, 9.2);
      ctx.stroke();

      ctx.restore();

      if (cfg.terrain === "snow") {
        // Snow accumulation around outer garden edges
        ctx.fillStyle = "rgba(248, 252, 255, 0.92)";
        for (let i = 0; i < 11; i += 1) {
          const x = bedX + 10 + i * 15;
          ctx.beginPath();
          ctx.ellipse(x, bedY - 3 + (i % 2) * 0.8, 11 + (i % 3), 5 + (i % 2), 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(x, bedY + bedH + 2 - (i % 2) * 0.5, 12 + (i % 2), 5.2 + (i % 3) * 0.4, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        for (let i = 0; i < 9; i += 1) {
          const y = bedY + 12 + i * 43;
          ctx.beginPath();
          ctx.ellipse(bedX - 4 + (i % 2), y, 5 + (i % 2), 10 + (i % 3), 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(bedX + bedW + 4 - (i % 2), y, 5.2 + (i % 2), 10 + ((i + 1) % 3), 0, 0, Math.PI * 2);
          ctx.fill();
        }

        // Soft snow ridges just inside the garden border
        ctx.fillStyle = "rgba(241, 248, 255, 0.66)";
        for (let i = 0; i < 10; i += 1) {
          const x = bedX + 16 + i * 14;
          ctx.beginPath();
          ctx.ellipse(x, bedY + 14 + (i % 2) * 1.2, 8.4, 2.6, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(x, bedY + bedH - 14 - (i % 2) * 1.2, 8.4, 2.6, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const leftFenceX = bedX - 8;
      const rightFenceX = bedX + bedW - 2;
      const topFenceY = bedY - 8;
      const bottomFenceY = bedY + bedH - 6;
      const gateCenterX = leftFenceX + 3.5;
      const gateHeight = 40;
      const gateHalf = gateHeight / 2;
      const gateCenters = (cfg.laneDefinitions || [])
        .map(def => getGateYAtX(def.id, gateCenterX))
        .filter(y => Number.isFinite(y))
        .sort((a, b) => a - b);
      const effectiveGates = [];
      for (const y of gateCenters) {
        const prev = effectiveGates[effectiveGates.length - 1];
        if (!prev || Math.abs(prev - y) > gateHeight * 0.65) effectiveGates.push(y);
      }

      function drawPicket(x, y) {
        ctx.fillStyle = fenceColor;
        ctx.strokeStyle = fenceStroke;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(x, y, 7, 16, 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y + 11);
        ctx.lineTo(x + 7, y + 11);
        ctx.stroke();
      }

      function drawPost(cx, cy) {
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#c5ced7";
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.roundRect(cx - 5.5, cy - 6.5, 11, 20, 2.2);
        ctx.fill();
        ctx.stroke();
      }

      function drawGate(gateY) {
        const gateTop = gateY - gateHalf;
        const gateBottom = gateY + gateHalf;
        const leftX = leftFenceX + 3.5;

        // Gate frame rails around the opening
        ctx.strokeStyle = "#eef3f7";
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(leftX - 1, gateTop);
        ctx.lineTo(leftX + 9, gateTop);
        ctx.moveTo(leftX - 1, gateBottom);
        ctx.lineTo(leftX + 9, gateBottom);
        ctx.stroke();

        // Open gate doors (swung inward toward garden)
        ctx.save();
        ctx.translate(leftX + 2.2, gateTop + 4);
        ctx.rotate(-0.55);
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#c5ced7";
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.roundRect(0, 0, 8, 14, 1.8);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(1.2, 4.5);
        ctx.lineTo(6.8, 4.5);
        ctx.moveTo(1.2, 9.2);
        ctx.lineTo(6.8, 9.2);
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.translate(leftX + 2.2, gateBottom - 4);
        ctx.rotate(0.55);
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#c5ced7";
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.roundRect(0, -14, 8, 14, 1.8);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(1.2, -9.5);
        ctx.lineTo(6.8, -9.5);
        ctx.moveTo(1.2, -4.8);
        ctx.lineTo(6.8, -4.8);
        ctx.stroke();
        ctx.restore();
      }

      for (let x = leftFenceX; x <= rightFenceX; x += 9) {
        drawPicket(x, topFenceY);
        drawPicket(x, bottomFenceY);
      }

      for (let y = topFenceY + 9; y <= bottomFenceY - 3; y += 10) {
        const inAnyGate = effectiveGates.some(g => y > g - gateHalf && y < g + gateHalf);
        if (!inAnyGate) drawPicket(leftFenceX, y);
        drawPicket(rightFenceX, y);
      }

      ctx.strokeStyle = "#e9eef3";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(leftFenceX + 3.5, topFenceY + 13);
      ctx.lineTo(rightFenceX + 3.5, topFenceY + 13);
      ctx.moveTo(leftFenceX + 3.5, bottomFenceY + 13);
      ctx.lineTo(rightFenceX + 3.5, bottomFenceY + 13);
      ctx.stroke();

      drawPost(leftFenceX + 3.5, topFenceY + 8);
      drawPost(rightFenceX + 3.5, topFenceY + 8);
      drawPost(leftFenceX + 3.5, bottomFenceY + 8);
      drawPost(rightFenceX + 3.5, bottomFenceY + 8);
      for (const g of effectiveGates) {
        drawPost(leftFenceX + 3.5, g - gateHalf);
        drawPost(leftFenceX + 3.5, g + gateHalf);
        drawGate(g);
      }

      for (const veg of gardenVegetables) {
        if (veg.gone) continue;

        if (veg.type === "carrot") {
          ctx.fillStyle = "#67b54c";
          ctx.beginPath();
          ctx.arc(veg.x - 5, veg.y - 22, 4.5, 0, Math.PI * 2);
          ctx.arc(veg.x + 1, veg.y - 26, 4.2, 0, Math.PI * 2);
          ctx.arc(veg.x + 6, veg.y - 21, 4.3, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#ef7f2e";
          ctx.beginPath();
          ctx.moveTo(veg.x - 8, veg.y - 8);
          ctx.lineTo(veg.x + 8, veg.y - 8);
          ctx.lineTo(veg.x, veg.y + 18);
          ctx.closePath();
          ctx.fill();
        } else if (veg.type === "tomato") {
          ctx.fillStyle = "#d64040";
          ctx.beginPath();
          ctx.arc(veg.x, veg.y, 11.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#4d9b40";
          ctx.beginPath();
          ctx.moveTo(veg.x, veg.y - 14);
          ctx.lineTo(veg.x + 3, veg.y - 8);
          ctx.lineTo(veg.x + 9, veg.y - 8);
          ctx.lineTo(veg.x + 4, veg.y - 4);
          ctx.lineTo(veg.x + 6, veg.y + 2);
          ctx.lineTo(veg.x, veg.y - 2);
          ctx.lineTo(veg.x - 6, veg.y + 2);
          ctx.lineTo(veg.x - 4, veg.y - 4);
          ctx.lineTo(veg.x - 9, veg.y - 8);
          ctx.lineTo(veg.x - 3, veg.y - 8);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillStyle = "#81c85f";
          ctx.beginPath();
          ctx.arc(veg.x, veg.y, 13, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#93d572";
          ctx.beginPath();
          ctx.arc(veg.x - 5, veg.y - 2, 5.8, 0, Math.PI * 2);
          ctx.arc(veg.x + 6, veg.y + 1, 6.2, 0, Math.PI * 2);
          ctx.arc(veg.x + 1, veg.y - 6, 5.4, 0, Math.PI * 2);
          ctx.fill();
        }

        for (let b = 0; b < veg.bites; b += 1) {
          const theta = -0.6 + (b / Math.max(1, maxBitesPerVegetable - 1)) * 1.9;
          const radius = veg.type === "carrot" ? 9.5 : (veg.type === "tomato" ? 11.5 : 12.5);
          const dx = Math.cos(theta) * radius;
          const dy = Math.sin(theta) * radius;
          ctx.fillStyle = soil;
          ctx.beginPath();
          ctx.arc(veg.x + dx, veg.y + dy, 3.8 + (b % 2) * 0.9, 0, Math.PI * 2);
          ctx.fill();
        }

        if (veg.chewFlash > 0) {
          const a = Math.max(0.15, veg.chewFlash / 12);
          ctx.fillStyle = `rgba(245, 225, 150, ${a})`;
          for (let k = 0; k < 4; k += 1) {
            const spread = (k - 1.5) * 2.3;
            ctx.beginPath();
            ctx.arc(veg.x + spread, veg.y - 14 - (10 - veg.chewFlash) * 0.7, 1.2 + (k % 2) * 0.4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      if (cfg.terrain === "snow") {
        // Snowfall visible over the vegetable garden
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(bedX + 2, bedY + 2, bedW - 4, bedH - 4, 10);
        ctx.clip();
        for (let i = 0; i < 34; i += 1) {
          const fx = bedX + 6 + ((frameCount * 0.95 + i * 29) % (bedW - 12));
          const fy = bedY + 6 + ((frameCount * 1.18 + i * 47) % (bedH - 12));
          const r = 0.8 + (i % 3) * 0.55;
          const a = 0.38 + (i % 4) * 0.09;
          ctx.fillStyle = `rgba(255,255,255,${a})`;
          ctx.beginPath();
          ctx.arc(fx, fy, r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }


    }

    function loadTowerArtAssets() {
      towerArtLoadState.pending = true;
      return towerAssets.loadTowerArtAssets({
        sources: towerArtSources,
        state: towerArtState,
        onAssetReady: () => {
          renderTowerSelectorIcons();
        },
        timeoutMs: 4200
      }).then((summary) => {
        towerArtLoadState.pending = false;
        towerArtLoadState.summary = summary || null;
        window.__towerArtLoadSummary = towerArtLoadState.summary;
        if (summary && summary.failed > 0) {
          console.warn("[assets] Tower art fallback in use for some files.", summary);
        }
        renderTowerSelectorIcons();
        return summary;
      }).catch((err) => {
        towerArtLoadState.pending = false;
        towerArtLoadState.summary = {
          total: Object.keys(towerArtSources || {}).length,
          loaded: 0,
          failed: Object.keys(towerArtSources || {}).length,
          failures: [{ key: "all", reason: err && err.message ? err.message : "load-error", src: "" }]
        };
        window.__towerArtLoadSummary = towerArtLoadState.summary;
        console.warn("[assets] Tower art loading failed; procedural fallback active.", towerArtLoadState.summary);
        renderTowerSelectorIcons();
        return towerArtLoadState.summary;
      });
    }

    function drawTowerArtSprite(drawCtx, type, opts = {}) {
      return towerAssets.drawTowerArtSprite({
        drawCtx,
        type,
        opts,
        state: towerArtState,
        shouldUseImportedTowerArt: rendering.shouldUseImportedTowerArt
      });
    }

    function renderTowerSelectorIcons() {
      towerAssets.renderTowerSelectorIcons({
        sprayTowerBtn,
        glueTowerBtn,
        hoseTowerBtn,
        saltTowerBtn,
        renderTowerSelectorIcon: rendering.renderTowerSelectorIcon,
        drawTowerArtSprite: (drawCtx, type, opts) => drawTowerArtSprite(drawCtx, type, opts)
      });
    }

    function drawTowers() {
      for (const t of towers) {
        rendering.drawTowerRangeAndGlow(ctx, t, selectedTowerId, frameCount, towerRadius);

        ctx.save();
        ctx.translate(t.x, t.y);
        ctx.scale(1.5, 1.5);

        // Shared pedestal under each tower body.
        rendering.drawTowerPedestal(ctx);

        if (t.type === "glue") {
          if (!drawTowerArtSprite(ctx, "glue", { size: 40 })) {
            rendering.drawGlueTowerArt(ctx);
          }
        } else if (t.type === "hose") {
          ctx.save();
          ctx.rotate(t.lastAimAngle || 0);

          if (!drawTowerArtSprite(ctx, "hose", { size: 44 })) {
            rendering.drawHoseTowerArt(ctx);
          }

          if (t.laserFlash > 0) {
            const beamLen = t.range / 1.5;
            const glowA = 0.24 + (t.laserFlash / 6) * 0.34;
            const coreA = 0.42 + (t.laserFlash / 6) * 0.4;

            ctx.strokeStyle = `rgba(132, 228, 255, ${glowA})`;
            ctx.lineWidth = (t.beamWidth || 7) + 5;
            ctx.beginPath();
            ctx.moveTo(20.8, -0.4);
            ctx.lineTo(20.8 + beamLen, -0.4);
            ctx.stroke();

            ctx.strokeStyle = `rgba(220, 247, 255, ${coreA})`;
            ctx.lineWidth = Math.max(2, (t.beamWidth || 7) * 0.58);
            ctx.beginPath();
            ctx.moveTo(20.8, -0.4);
            ctx.lineTo(20.8 + beamLen, -0.4);
            ctx.stroke();

            // Muzzle pulse makes hose firing easier to read in busy scenes.
            const pulseA = 0.25 + (t.laserFlash / 6) * 0.3;
            ctx.fillStyle = `rgba(196, 244, 255, ${pulseA})`;
            ctx.beginPath();
            ctx.arc(20.8, -0.4, 3.4 + (t.laserFlash / 6) * 2.4, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        } else if (t.type === "salt") {
          if (!drawTowerArtSprite(ctx, "salt", { size: 48, angle: (t.lastAimAngle || 0) - 0.22 })) {
            rendering.drawSaltCannonArt(ctx, (t.lastAimAngle || 0) - 0.22, t.sprayFlash || 0);
          }
        } else {
          if (!drawTowerArtSprite(ctx, "spray", { size: 42, angle: t.lastAimAngle || 0 })) {
            rendering.drawSprayCloudArt(ctx, t.lastAimAngle || 0, t.sprayFlash || 0);
          } else if (t.sprayFlash > 0) {
            const sprayAngle = t.lastAimAngle || 0;
            const alpha = 0.14 + (t.sprayFlash / 6) * 0.26;
            ctx.save();
            ctx.rotate(sprayAngle);
            ctx.fillStyle = `rgba(255, 92, 92, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(16.0, -0.8);
            ctx.lineTo(29.8, -6.8);
            ctx.lineTo(29.8, 5.2);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = `rgba(255, 192, 192, ${Math.min(0.5, alpha + 0.12)})`;
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.arc(16.0, -0.8, 9.5, -0.45, 0.45);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(16.0, -0.8, 13.3, -0.45, 0.45);
            ctx.stroke();
            ctx.restore();
          }
        }

        ctx.restore();

        rendering.drawTowerLevelBadge(ctx, t);
      }
    }

    function drawBunnies() {
      const showSantaHat = getCurrentLevelConfig().flowerTheme === "christmas";
      for (const b of bunnies) {
        const pop = Math.min(1, (140 - b.life) / 16);
        const hop = Math.sin((140 - b.life) * 0.24) * 4.2;
        const y = b.y + hop;

        ctx.save();
        ctx.globalAlpha = 0.82 + pop * 0.18;
        ctx.fillStyle = "#f5f5f5";
        ctx.beginPath();
        ctx.ellipse(b.x, y, 42, 34, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(b.x - 20, y - 50, 11, 34, -0.12, 0, Math.PI * 2);
        ctx.ellipse(b.x + 13, y - 51, 10.5, 32.5, 0.12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#f0c8d0";
        ctx.beginPath();
        ctx.ellipse(b.x - 20, y - 50, 4.6, 21, -0.12, 0, Math.PI * 2);
        ctx.ellipse(b.x + 13, y - 51, 4.4, 20, 0.12, 0, Math.PI * 2);
        ctx.fill();

        if (showSantaHat) {
          // Santa hat for the winter Christmas level only
          ctx.fillStyle = "#c63d3d";
          ctx.beginPath();
          ctx.moveTo(b.x - 28, y - 36);
          ctx.lineTo(b.x + 6, y - 66);
          ctx.lineTo(b.x + 20, y - 35);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = "#f4f7fb";
          ctx.beginPath();
          ctx.roundRect(b.x - 30, y - 38.6, 52, 8, 3.5);
          ctx.fill();

          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(b.x + 8, y - 67, 4.8, 0, Math.PI * 2);
          ctx.fill();
        }

        // Button eye (left)
        ctx.fillStyle = "#131313";
        ctx.beginPath();
        ctx.arc(b.x - 14, y - 7, 6.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#e2e2e2";
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(b.x - 14, y - 7, 6.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "#e2e2e2";
        ctx.beginPath();
        ctx.arc(b.x - 16.5, y - 8.3, 1.3, 0, Math.PI * 2);
        ctx.arc(b.x - 11.3, y - 5.8, 1.3, 0, Math.PI * 2);
        ctx.fill();

        // Sewn X eye (right)
        ctx.strokeStyle = "#2a2a2a";
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(b.x + 9, y - 12);
        ctx.lineTo(b.x + 20, y - 2);
        ctx.moveTo(b.x + 20, y - 12);
        ctx.lineTo(b.x + 9, y - 2);
        ctx.stroke();

        // Pink button nose + whiskers + two buck teeth
        ctx.fillStyle = "#f7a5b8";
        ctx.beginPath();
        ctx.arc(b.x + 2.3, y + 2.3, 2.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#cc7f93";
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.arc(b.x + 2.3, y + 2.3, 2.6, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = "#2a2a2a";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(b.x + 0.6, y + 2.4);
        ctx.lineTo(b.x - 10.5, y - 0.2);
        ctx.moveTo(b.x + 0.8, y + 3.6);
        ctx.lineTo(b.x - 10.8, y + 4.3);
        ctx.moveTo(b.x + 4.2, y + 2.4);
        ctx.lineTo(b.x + 15.1, y - 0.1);
        ctx.moveTo(b.x + 4.0, y + 3.6);
        ctx.lineTo(b.x + 15.3, y + 4.2);
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#2a2a2a";
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.roundRect(b.x - 5.5, y + 6.6, 6.6, 12.0, 1.4);
        ctx.roundRect(b.x + 1.1, y + 6.6, 6.6, 12.0, 1.4);
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      }
    }

    function drawImplosions() {
      for (const fx of implosions) {
        const t = fx.life / 28;
        const r = (1 - t) * 26;
        ctx.strokeStyle = `rgba(255, 82, 82, ${t * 0.7})`;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(fx.x, fx.y, r, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = `rgba(255, 170, 170, ${t * 0.32})`;
        ctx.beginPath();
        ctx.arc(fx.x, fx.y, r * 0.45, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawCraters() {
      for (const c of craters) {
        const r = c.radius;
        ctx.fillStyle = "rgba(62, 40, 25, 0.82)";
        ctx.beginPath();
        ctx.ellipse(c.x, c.y + 1.5, r + 2, r * 0.72, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "rgba(108, 74, 48, 0.92)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(c.x, c.y, r + 1.2, r * 0.62, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = "rgba(88, 60, 38, 0.45)";
        ctx.beginPath();
        ctx.ellipse(c.x - 2.2, c.y - 1.2, r * 0.5, r * 0.3, -0.3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawEnemyShadow(x, y, w = 13, h = 5) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.24)";
      ctx.beginPath();
      ctx.ellipse(x - 1.5, y + 10, w, h, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawAphid(e) {
      const x = e.x;
      const y = e.y + Math.sin((frameCount + e.id * 7) * 0.13) * 0.8;
      drawEnemyShadow(x, y, 12, 4.5);
      ctx.strokeStyle = "#24451f";
      ctx.lineWidth = 1.6;
      const lobes = [{ ox: -5.5, rx: 5.3, ry: 4.3 }, { ox: 0, rx: 5.9, ry: 4.8 }, { ox: 5.8, rx: 5, ry: 4.1 }];
      ctx.fillStyle = "#77c955";
      for (const b of lobes) {
        ctx.beginPath();
        ctx.ellipse(x + b.ox, y, b.rx, b.ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(x + 8.8, y - 3.8);
      ctx.lineTo(x + 14.3, y - 7.2);
      ctx.moveTo(x + 8.4, y - 1.5);
      ctx.lineTo(x + 14, y - 1.7);
      ctx.stroke();
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(x + 9.4, y - 1.9, 1.4, 0, Math.PI * 2);
      ctx.arc(x + 12.1, y - 1.9, 1.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#1f281e";
      ctx.beginPath();
      ctx.arc(x + 9.6, y - 1.8, 0.6, 0, Math.PI * 2);
      ctx.arc(x + 12.3, y - 1.8, 0.6, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawMantis(e) {
      const x = e.x;
      const y = e.y + Math.sin((frameCount + e.id * 5) * 0.12) * 0.7;
      drawEnemyShadow(x, y, 13, 4.8);
      ctx.strokeStyle = "#7e8e2a";
      ctx.lineWidth = 1.7;
      ctx.fillStyle = "#c5da4d";
      ctx.beginPath();
      ctx.ellipse(x - 2.5, y + 1.4, 8.7, 5.6, 0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + 1.5, y - 2);
      ctx.lineTo(x + 10.2, y - 8.5);
      ctx.lineTo(x + 10.2, y - 2.1);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + 0.4, y - 0.6);
      ctx.lineTo(x + 8.3, y + 6.7);
      ctx.moveTo(x - 1, y - 2.1);
      ctx.lineTo(x + 8.3, y - 10.6);
      ctx.moveTo(x - 4, y + 4.6);
      ctx.lineTo(x - 10.4, y + 9.8);
      ctx.stroke();
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(x + 8.6, y - 6.7, 1.25, 0, Math.PI * 2);
      ctx.arc(x + 10.5, y - 5.1, 1.25, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawLocust(e) {
      const x = e.x;
      const y = e.y + Math.sin((frameCount + e.id * 9) * 0.11) * 0.55;
      drawEnemyShadow(x, y, 13.5, 4.8);
      ctx.strokeStyle = "#59626e";
      ctx.lineWidth = 1.6;
      ctx.fillStyle = "#9da6b2";
      ctx.beginPath();
      ctx.ellipse(x - 1.2, y, 10.8, 5.8, 0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "rgba(196, 203, 214, 0.82)";
      ctx.beginPath();
      ctx.ellipse(x + 0.8, y - 1.3, 8.5, 4.1, -0.18, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + 0.3, y + 1.7);
      ctx.lineTo(x + 10.6, y + 9.4);
      ctx.moveTo(x - 2.5, y + 1.8);
      ctx.lineTo(x - 11, y + 9.2);
      ctx.stroke();
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(x + 7.9, y - 1.3, 1.2, 0, Math.PI * 2);
      ctx.arc(x + 10.1, y - 1.2, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawLadybug(e) {
      const x = e.x;
      const y = e.y + Math.sin((frameCount + e.id * 8) * 0.14) * 0.65;
      drawEnemyShadow(x, y, 12.5, 4.6);
      ctx.strokeStyle = "#251a1a";
      ctx.lineWidth = 1.6;
      ctx.fillStyle = "#e04b4b";
      ctx.beginPath();
      ctx.ellipse(x, y, 10.2, 7.7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#1f1f1f";
      ctx.beginPath();
      ctx.arc(x + 7.3, y - 0.9, 4.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - 0.2, y - 7.6);
      ctx.lineTo(x - 0.2, y + 7.6);
      ctx.stroke();
      ctx.fillStyle = "#0f0f0f";
      const spots = [[-4.2, -2.1], [-2.9, 3], [2.7, -2.9], [1.8, 3.2]];
      for (const s of spots) {
        ctx.beginPath();
        ctx.arc(x + s[0], y + s[1], 1.25, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(x + 8.2, y - 1.7, 0.95, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawCaterpillar(e) {
      const x = e.x;
      const y = e.y + Math.sin((frameCount + e.id * 6) * 0.1) * 0.55;
      drawEnemyShadow(x, y, 14, 4.8);
      const segments = [
        { ox: -9.2, r: 3.4, c: "#9f7fdc" },
        { ox: -5.2, r: 4, c: "#8b69ca" },
        { ox: -1.2, r: 4.4, c: "#9f7fdc" },
        { ox: 2.8, r: 4.2, c: "#8b69ca" },
        { ox: 6.8, r: 4, c: "#9f7fdc" }
      ];
      ctx.strokeStyle = "#5e468f";
      ctx.lineWidth = 1.2;
      for (const s of segments) {
        ctx.fillStyle = s.c;
        ctx.beginPath();
        ctx.arc(x + s.ox, y, s.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.fillStyle = "#7757b0";
      ctx.beginPath();
      ctx.arc(x + 10.4, y - 0.2, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + 11.1, y - 3.1);
      ctx.lineTo(x + 13.8, y - 7);
      ctx.moveTo(x + 9.5, y - 3.1);
      ctx.lineTo(x + 11.6, y - 7.1);
      ctx.stroke();
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(x + 10.7, y - 1, 0.9, 0, Math.PI * 2);
      ctx.arc(x + 12.2, y - 1, 0.9, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawGateCrasher(e) {
      const x = e.x;
      const y = e.y + Math.sin((frameCount + e.id * 4) * 0.09) * 0.8;
      drawEnemyShadow(x, y, 22, 7.5);

      ctx.strokeStyle = "#40220f";
      ctx.lineWidth = 2.2;
      ctx.fillStyle = "#7b4f2f";
      ctx.beginPath();
      ctx.ellipse(x - 1, y + 1, 17.5, 10.5, 0.02, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#8f5e3a";
      ctx.beginPath();
      ctx.ellipse(x + 8, y, 9, 8, -0.04, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = "#29160a";
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(x + 8, y + 3);
      ctx.lineTo(x + 21, y + 10);
      ctx.moveTo(x + 0.5, y + 4);
      ctx.lineTo(x - 11, y + 12);
      ctx.stroke();

      ctx.fillStyle = "#e8c186";
      ctx.beginPath();
      ctx.moveTo(x + 14, y - 2);
      ctx.lineTo(x + 21, y - 7);
      ctx.lineTo(x + 19, y + 0.5);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(x + 9, y - 2.5, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#1b130f";
      ctx.beginPath();
      ctx.arc(x + 9.4, y - 2.3, 1, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawEnemies() {
      for (const e of enemies) {
        if (e.enemyType === "aphid") drawAphid(e);
        else if (e.enemyType === "mantis") drawMantis(e);
        else if (e.enemyType === "locust") drawLocust(e);
        else if (e.enemyType === "ladybug") drawLadybug(e);
        else if (e.enemyType === "caterpillar") drawCaterpillar(e);
        else drawGateCrasher(e);

        const style = rendering.getEnemyStyle(e.enemyType);
        const overlay = rendering.getEnemyOverlayLayout(e);
        rendering.drawEnemyOverlay(ctx, e, overlay, style, frameCount, null);
      }
    }

    function drawImpactBursts() {
      if (!impactBursts || impactBursts.length === 0) return;
      for (const p of impactBursts) {
        const lifePct = Math.max(0, Math.min(1, p.life / Math.max(1, p.maxLife)));
        const a = 0.16 + lifePct * 0.56;
        const color = (p.color || "rgba(255, 180, 150, 0.9)").replace(/0\.\d+\)|1\)/, `${a})`);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.7, p.size * lifePct), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawBullets() {
      const compact = bullets.length > 260;
      for (const b of bullets) {
        const core = b.radius || 4;
        const lifeAlpha = Math.max(0.24, Math.min(0.58, (b.life || 12) / 30));
        const isSalt = b.kind === "salt";

        if (compact) {
          ctx.fillStyle = isSalt
            ? `rgba(246, 249, 255, ${Math.min(0.62, lifeAlpha + 0.14)})`
            : `rgba(255, 88, 88, ${Math.min(0.55, lifeAlpha + 0.08)})`;
          ctx.beginPath();
          ctx.arc(b.x, b.y, core + 1.5, 0, Math.PI * 2);
          ctx.fill();
          continue;
        }

        if (isSalt) {
          ctx.strokeStyle = `rgba(226, 233, 244, ${Math.min(0.78, lifeAlpha + 0.2)})`;
          ctx.lineWidth = Math.max(2.2, core * 1.22);
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(b.px ?? b.x, b.py ?? b.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();

          ctx.fillStyle = `rgba(247, 251, 255, ${Math.min(0.85, lifeAlpha + 0.24)})`;
          ctx.beginPath();
          ctx.arc(b.x, b.y, core + 1.15, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = `rgba(195, 206, 220, ${Math.min(0.62, lifeAlpha + 0.08)})`;
          ctx.beginPath();
          ctx.arc(b.x - 1.2, b.y + 0.8, core * 0.54, 0, Math.PI * 2);
          ctx.fill();
          continue;
        }

        ctx.strokeStyle = `rgba(255, 95, 95, ${Math.min(0.6, lifeAlpha + 0.1)})`;
        ctx.lineWidth = core * 1.15;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(b.px ?? b.x, b.py ?? b.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();

        ctx.globalCompositeOperation = "lighter";

        ctx.fillStyle = `rgba(255, 70, 70, ${lifeAlpha})`;
        ctx.beginPath();
        ctx.arc(b.x, b.y, core + 2.1, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255, 95, 95, ${lifeAlpha * 0.92})`;
        ctx.beginPath();
        ctx.arc(b.x - 2.1, b.y + 1.1, core, 0, Math.PI * 2);
        ctx.arc(b.x + 2.4, b.y - 0.7, core * 0.92, 0, Math.PI * 2);
        ctx.arc(b.x + 0.4, b.y - 2.2, core * 0.82, 0, Math.PI * 2);
        ctx.arc(b.x - 1.1, b.y + 2.6, core * 0.72, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255, 165, 165, ${lifeAlpha * 0.7})`;
        ctx.beginPath();
        ctx.arc(b.x + 2.2, b.y - 1.7, core * 0.45, 0, Math.PI * 2);
        ctx.arc(b.x - 1.9, b.y + 0.5, core * 0.38, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalCompositeOperation = "source-over";
      }
    }

    function drawGameOver() {
      if (!gameOver) return;
      ctx.fillStyle = "rgba(3, 5, 12, 0.55)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#ff8ea3";
      ctx.font = "bold 48px Segoe UI";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 10);

      ctx.fillStyle = "#e7edff";
      ctx.font = "bold 20px Segoe UI";
      ctx.fillText(`You survived wave ${lastClearedWave}.`, canvas.width / 2, canvas.height / 2 + 28);
    }

    function drawLevelComplete() {
      if (gameOver || !levelComplete) return;
      const lvl = getCurrentLevelConfig();
      ctx.fillStyle = "rgba(8, 20, 8, 0.42)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#9effb3";
      ctx.font = "bold 44px Segoe UI";
      ctx.textAlign = "center";
      ctx.fillText(`LEVEL ${levelNumber} COMPLETE`, canvas.width / 2, canvas.height / 2 - 4);

      ctx.fillStyle = "#e7edff";
      ctx.font = "bold 18px Segoe UI";
      ctx.fillText(`All ${lvl.waves} waves defended`, canvas.width / 2, canvas.height / 2 + 28);
    }

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawLawn();
      drawRoad();
      drawGarden();
      drawSceneLighting();
      drawCraters();
      drawBunnies();
      drawMobilePlacementCandidate();
      drawTowers();
      drawImplosions();
      drawEnemies();
      drawImpactBursts();
      drawBullets();
      drawGameOver();
      drawLevelComplete();
    }

    function gameLoop() {
      if (!runtimeCrashed) {
        try {
          updateSimulation();
          render();
        } catch (err) {
          runtimeCrashed = true;
          gameStarted = false;
          if (autoWaveTimer) {
            clearTimeout(autoWaveTimer);
            autoWaveTimer = null;
          }
          autoWaveDueAt = 0;
          activeSpawners = 0;
          setStatus("A runtime error occurred and the game was paused safely. Press Restart Level.", "danger");
          try {
            console.error("Game loop crash:", err);
          } catch {
            // ignore logging failures
          }
          syncHUD();
        }
      }
      requestAnimationFrame(gameLoop);
    }

    canvas.addEventListener("pointerdown", (e) => {
      lastCanvasPointerDownAt = Date.now();
      lastCanvasPointerType = e?.pointerType || "";
      if (e?.pointerType) lastInteractionPointerType = e.pointerType;
    }, { passive: true });

    canvas.addEventListener("click", (e) => {
      if (!gameStarted) return;
      const pos = getCanvasCoords(e);
      const { x, y } = normalizePlacement(pos.x, pos.y);
      const existing = findTowerAt(x, y);
      if (existing) {
        selectedTowerId = existing.id;
        if (isCoarsePointer) {
          mobilePlacementCandidate = null;
          mobilePlacementCandidateAt = 0;
        }
        existing.showRangeUntil = frameCount + 220;
        showTowerFloatCardBriefly(2600);
        setStatus(`${getTowerDisplayName(existing.type)} selected.`, "warn");
        syncHUD();
        return;
      }
      selectedTowerId = null;
      const touchPlacementMode = isTouchPlacementMode(e);
      if (touchPlacementMode) {
        if (!placementArmed) {
          setStatus("Tap a tower icon to arm placement.", "warn");
          syncHUD();
          return;
        }
        const armedAgo = Date.now() - (mobilePlacementArmedAt || 0);
        if (armedAgo < mobilePlacementArmingDelayMs) {
          setStatus("Placement armed. Tap field to choose a spot.", "warn");
          syncHUD();
          return;
        }
        if (profileData?.mobileHoldToPlace) {
          const heldMs = Date.now() - (lastCanvasPointerDownAt || 0);
          if (heldMs < 260) {
            setStatus("Hold briefly on the field to place.", "warn");
            syncHUD();
            return;
          }
        }
        const topSafePx = 26;
        const bottomSafePx = 20;
        if (y < topSafePx || y > canvas.height - bottomSafePx) {
          setStatus("Tap a little farther from the edge to place.", "warn");
          syncHUD();
          return;
        }
        const now = Date.now();
        const hasCandidate = !!mobilePlacementCandidate;
        const candidateAge = now - (mobilePlacementCandidateAt || 0);
        const nearCandidate = hasCandidate
          && candidateAge <= mobilePlacementConfirmWindowMs
          && Math.hypot(x - mobilePlacementCandidate.x, y - mobilePlacementCandidate.y) <= mobilePlacementConfirmRadius;

        if (!nearCandidate) {
          const check = evaluateTowerPlacement(x, y);
          if (!check.ok) {
            setStatus(getPlacementFailureMessage(check.reason), "danger");
            syncHUD();
            return;
          }
          mobilePlacementCandidate = { x, y };
          mobilePlacementCandidateAt = now;
          setStatus("Spot selected. Tap the same spot again to place.", "warn");
          syncHUD();
          return;
        }

        if (now - (lastTowerPlacedAt || 0) < mobilePlacementCooldownMs) {
          setStatus("Please wait a moment before placing again.", "warn");
          syncHUD();
          return;
        }
      }
      const placed = placeTower(x, y);
      if (placed && touchPlacementMode) {
        mobilePlacementCandidate = null;
        mobilePlacementCandidateAt = 0;
        placementArmed = false;
        lastTowerPlacedAt = Date.now();
      }
    });

    canvas.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      if (!gameStarted) return;
      const { x, y } = getCanvasCoords(e);
      upgradeTowerAt(x, y);
    });

    startBtn.addEventListener("click", startWave);
    if (pauseBtn) pauseBtn.addEventListener("click", pauseToLanding);
    nextLevelBtn.addEventListener("click", goToNextLevel);
    resetBtn.addEventListener("click", handleRestartClick);
    if (sprayTowerBtn) sprayTowerBtn.addEventListener("click", (e) => setSelectedTowerType("spray", e));
    if (glueTowerBtn) glueTowerBtn.addEventListener("click", (e) => setSelectedTowerType("glue", e));
    if (hoseTowerBtn) hoseTowerBtn.addEventListener("click", (e) => setSelectedTowerType("hose", e));
    if (saltTowerBtn) saltTowerBtn.addEventListener("click", (e) => setSelectedTowerType("salt", e));
    const towerSelectKeys = (e, type) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setSelectedTowerType(type, e);
      }
    };
    if (sprayTowerBtn) sprayTowerBtn.addEventListener("keydown", (e) => towerSelectKeys(e, "spray"));
    if (glueTowerBtn) glueTowerBtn.addEventListener("keydown", (e) => towerSelectKeys(e, "glue"));
    if (hoseTowerBtn) hoseTowerBtn.addEventListener("keydown", (e) => towerSelectKeys(e, "hose"));
    if (saltTowerBtn) saltTowerBtn.addEventListener("keydown", (e) => towerSelectKeys(e, "salt"));
    difficultySelect.addEventListener("change", () => {
      difficultyKey = difficultySelect.value;
      resetGame(true);
      const label = getDifficultyProfile().label;
      setStatus(`Difficulty set to ${label}: ${getDifficultyDescriptor(difficultyKey)}.`, "warn");
      syncDifficultyHint();
      saveProfileData();
    });
    if (tutorialAutoToggle) {
      tutorialAutoToggle.addEventListener("change", () => {
        if (!profileData) profileData = getDefaultProfileData();
        profileData.tutorialAutoStart = !!tutorialAutoToggle.checked;
        saveProfileData();
        setStatus(profileData.tutorialAutoStart ? "Tutorial will show at each new start." : "Tutorial auto-start disabled.", "warn");
      });
    }
    if (holdPlaceToggle) {
      holdPlaceToggle.addEventListener("change", () => {
        if (!profileData) profileData = getDefaultProfileData();
        profileData.mobileHoldToPlace = !!holdPlaceToggle.checked;
        saveProfileData();
        setStatus(profileData.mobileHoldToPlace ? "Mobile hold-to-place enabled." : "Mobile hold-to-place disabled.", "warn");
      });
    }
    if (audioEnabledToggle) {
      audioEnabledToggle.addEventListener("change", () => {
        if (!profileData) profileData = getDefaultProfileData();
        profileData.audioEnabled = !!audioEnabledToggle.checked;
        ensureAudioContext();
        updateAudioGains();
        updateMusicPlayback();
        syncAudioUi();
        saveProfileData();
        setStatus(profileData.audioEnabled ? "Audio enabled." : "Audio muted.", "warn");
      });
    }
    if (musicEnabledToggle) {
      musicEnabledToggle.addEventListener("change", () => {
        if (!profileData) profileData = getDefaultProfileData();
        profileData.musicEnabled = !!musicEnabledToggle.checked;
        ensureAudioContext();
        updateMusicPlayback();
        syncAudioUi();
        saveProfileData();
        setStatus(profileData.musicEnabled ? "Music enabled." : "Music disabled.", "warn");
      });
    }
    if (sfxVolumeRange) {
      sfxVolumeRange.addEventListener("input", () => {
        if (!profileData) profileData = getDefaultProfileData();
        profileData.sfxVolume = Math.max(0, Math.min(1, Number(sfxVolumeRange.value) / 100));
        updateAudioGains();
        syncAudioUi();
        saveProfileData();
      });
    }
    if (musicVolumeRange) {
      musicVolumeRange.addEventListener("input", () => {
        if (!profileData) profileData = getDefaultProfileData();
        profileData.musicVolume = Math.max(0, Math.min(1, Number(musicVolumeRange.value) / 100));
        updateAudioGains();
        updateMusicPlayback();
        syncAudioUi();
        saveProfileData();
      });
    }
    if (hudMuteBtn) {
      hudMuteBtn.addEventListener("click", () => {
        if (!profileData) profileData = getDefaultProfileData();
        profileData.audioEnabled = !profileData.audioEnabled;
        ensureAudioContext();
        updateAudioGains();
        updateMusicPlayback();
        syncAudioUi();
        saveProfileData();
        setStatus(profileData.audioEnabled ? "Audio unmuted." : "Audio muted.", "warn");
      });
    }
    if (undoPlaceBtn) {
      undoPlaceBtn.addEventListener("click", () => {
        if (!gameStarted || gameOver || levelComplete) return;
        undoLastPlacement();
      });
    }
    if (audioTestBtn) {
      audioTestBtn.addEventListener("click", () => {
        ensureAudioContext();
        if (!profileData) profileData = getDefaultProfileData();
        if (!profileData.audioEnabled) {
          profileData.audioEnabled = true;
          updateAudioGains();
        }
        playSfx("place");
        playSfx("sprayShot");
        playSfx("glueShot");
        playSfx("hoseShot");
        playSfx("saltShot");
        playSfx("waveClear");
        syncAudioUi();
        saveProfileData();
      });
    }
    levelSelect.addEventListener("change", () => {
      levelNumber = Number(levelSelect.value) || 1;
      resetGame(true);
      setStatus(`Level ${levelNumber} selected: ${getCurrentLevelConfig().name}.`, "warn");
      saveProfileData();
    });
    instructionsBtn.addEventListener("click", () => {
      window.open("./instructions.html", "_blank");
    });
    landingStartBtn.addEventListener("click", startNewGameFromLanding);
    if (landingTutorialBtn) landingTutorialBtn.addEventListener("click", startQuickStartFromLanding);
    if (landingResumeBtn) landingResumeBtn.addEventListener("click", continueLastRunFromLanding);
    if (landingDeleteRunBtn) landingDeleteRunBtn.addEventListener("click", deleteSavedRunFromLanding);
    landingContinueBtn.addEventListener("click", continueCampaignFromLanding);
    landingHowToBtn.addEventListener("click", () => {
      window.open("./instructions.html", "_blank");
    });
    if (tutorialSkipBtn) tutorialSkipBtn.addEventListener("click", () => {
      hideTutorialProgress(true);
      setStatus("Quick start skipped. You can replay it from landing.", "warn");
    });
    if (roleLegendItems.length > 0) {
      for (const item of roleLegendItems) {
        item.setAttribute("role", "button");
        item.setAttribute("aria-expanded", "false");
        item.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleRoleLegendTip(item);
        });
        item.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleRoleLegendTip(item);
          } else if (e.key === "Escape") {
            clearRoleLegendTips();
          }
        });
      }
      document.addEventListener("pointerdown", (e) => {
        if (!roleLegendEl || roleLegendEl.contains(e.target)) return;
        clearRoleLegendTips();
      }, { passive: true });
    }
    if (towerFloatUpgradeBtn) {
      towerFloatUpgradeBtn.addEventListener("click", () => {
        if (gameOver || levelComplete) return;
        const selected = towers.find(t => t.id === selectedTowerId);
        upgradeTower(selected);
      });
    }
    if (towerFloatSellBtn) {
      towerFloatSellBtn.addEventListener("click", () => {
        if (gameOver || levelComplete) return;
        requestSellTowerConfirm(selectedTowerId);
      });
    }
    if (towerFloatCardEl) {
      towerFloatCardEl.addEventListener("mouseenter", () => {
        towerFloatHover = true;
      });
      towerFloatCardEl.addEventListener("mouseleave", () => {
        towerFloatHover = false;
        showTowerFloatCardBriefly(1200);
      });
      towerFloatCardEl.addEventListener("pointerdown", () => {
        showTowerFloatCardBriefly(2200);
      }, { passive: true });
    }
    submitScoreBtn.addEventListener("click", submitHighscore);
    scoreNameInputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") submitHighscore();
    });
    document.addEventListener("keydown", handleTowerHotkeys);
    document.addEventListener("mousemove", markUiInteraction, { passive: true });
    document.addEventListener("mousedown", (e) => {
      lastInteractionPointerType = "mouse";
      markUiInteraction(e);
    }, { passive: true });
    document.addEventListener("touchstart", (e) => {
      lastInteractionPointerType = "touch";
      markUiInteraction(e);
    }, { passive: true });
    document.addEventListener("keydown", markUiInteraction);

    loadHighscores();
    loadCompletedLevels();
    loadProfileData();
    syncLandingCareerHint();
    if (profileData?.lastPlayerName && scoreNameInputEl) scoreNameInputEl.value = profileData.lastPlayerName;
    if (profileData?.lastDifficulty && difficultySelect) difficultySelect.value = profileData.lastDifficulty;
    if (profileData?.lastLevel && levelSelect) levelSelect.value = String(profileData.lastLevel);
    if (tutorialAutoToggle) tutorialAutoToggle.checked = !!profileData?.tutorialAutoStart;
    syncAudioUi();
    levelNumber = Number(levelSelect.value) || 1;
    populateLevelSelect();
    populateLandingLevelSelect();
    difficultyKey = difficultySelect.value || "normal";
    syncDifficultyHint();
    normalizeTowerDockButtons();
    loadTowerArtAssets();
    renderTowerSelectorIcons();
    updateAudioGains();
    updateMusicPlayback();
    syncResumeAvailability();
    gameStarted = false;
    if (shellEl) shellEl.classList.add("paused");
    resetGame();
    document.addEventListener("pointerdown", unlockAudioFromGesture, { passive: true });
    document.addEventListener("keydown", unlockAudioFromGesture);
    document.addEventListener("touchstart", unlockAudioFromGesture, { passive: true });
    initAutosave();
    gameLoop();
    if (smokeMode) {
      setTimeout(() => {
        runSmokeHarness();
      }, 220);
    }
