const canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d");

    const roadHalfHeight = 9.52;
    const towerRadius = 11;
    const enemyRadius = 11;
    const noBuildPadding = 10;
    const allowDirectLevelSelect = true;
    const levelConfigs = {
      1: {
        name: "Garden Lawn",
        waves: 10,
        terrain: "lawn",
        flowerTheme: "mixed",
        mergeGate: false,
        badgeName: "Garden Blossom",
        badgePetal: "#f08ea0",
        badgeCenter: "#f6e6a2",
        laneDefinitions: [
          {
            id: "top",
            basePoints: [
              { x: -30, y: 92 },
              { x: 90, y: 62 },
              { x: 180, y: 108 },
              { x: 270, y: 74 },
              { x: 355, y: 118 },
              { x: 445, y: 82 },
              { x: 535, y: 120 },
              { x: 615, y: 90 },
              { x: 675, y: 126 },
              { x: 704, y: 142 },
              { x: 714, y: 183 }
            ]
          },
          {
            id: "bottom",
            basePoints: [
              { x: -30, y: 344 },
              { x: 100, y: 366 },
              { x: 195, y: 320 },
              { x: 285, y: 362 },
              { x: 375, y: 314 },
              { x: 465, y: 356 },
              { x: 555, y: 318 },
              { x: 635, y: 348 },
              { x: 685, y: 304 },
              { x: 704, y: 280 },
              { x: 714, y: 248 }
            ]
          }
        ]
      },
      2: {
        name: "Prairie Merge",
        waves: 12,
        terrain: "prairie",
        flowerTheme: "susan",
        mergeGate: true,
        badgeName: "Black-Eyed Susan",
        badgePetal: "#f4c91f",
        badgeCenter: "#2a1b11",
        laneDefinitions: [
          {
            id: "top",
            basePoints: [
              { x: -30, y: 50 },
              { x: 95, y: 36 },
              { x: 190, y: 82 },
              { x: 280, y: 48 },
              { x: 380, y: 96 },
              { x: 475, y: 70 },
              { x: 565, y: 130 },
              { x: 640, y: 176 },
              { x: 690, y: 206 },
              { x: 714, y: 210 }
            ]
          },
          {
            id: "bottom",
            basePoints: [
              { x: -30, y: 372 },
              { x: 110, y: 390 },
              { x: 215, y: 344 },
              { x: 305, y: 386 },
              { x: 405, y: 328 },
              { x: 500, y: 374 },
              { x: 585, y: 300 },
              { x: 650, y: 246 },
              { x: 694, y: 216 },
              { x: 714, y: 210 }
            ]
          }
        ]
      },
      3: {
        name: "Desert Cactus Run",
        waves: 14,
        terrain: "desert",
        flowerTheme: "cactus",
        mergeGate: false,
        waveCountMul: 1.1,
        enemyHpMul: 1.15,
        enemySpeedMul: 1.12,
        spawnDelayMul: 0.88,
        enemyWeights: { aphid: 4, mantis: 3, locust: 4, ladybug: 2, caterpillar: 2 },
        badgeName: "Cactus Bloom",
        badgePetal: "#67a85f",
        badgeCenter: "#e8cf6a",
        laneDefinitions: [
          {
            id: "top",
            basePoints: [
              { x: -30, y: 82 },
              { x: 92, y: 58 },
              { x: 185, y: 106 },
              { x: 276, y: 74 },
              { x: 362, y: 118 },
              { x: 451, y: 86 },
              { x: 539, y: 122 },
              { x: 622, y: 92 },
              { x: 684, y: 132 },
              { x: 705, y: 154 },
              { x: 714, y: 183 }
            ]
          },
          {
            id: "bottom",
            basePoints: [
              { x: -30, y: 346 },
              { x: 106, y: 370 },
              { x: 200, y: 324 },
              { x: 290, y: 366 },
              { x: 382, y: 320 },
              { x: 472, y: 360 },
              { x: 560, y: 320 },
              { x: 640, y: 350 },
              { x: 688, y: 306 },
              { x: 704, y: 282 },
              { x: 714, y: 248 }
            ]
          }
        ]
      },
      4: {
        name: "Sunflower Crossroads",
        terrain: "prairie",
        flowerTheme: "sunflower",
        mergeGate: false,
        waveCountMul: 1.18,
        enemyHpMul: 1.2,
        enemySpeedMul: 1.14,
        spawnDelayMul: 0.84,
        enemyWeights: { aphid: 3, mantis: 4, locust: 4, ladybug: 3, caterpillar: 3 },
        badgeName: "Sunflower Crest",
        badgePetal: "#f2be1d",
        badgeCenter: "#4a2f1a",
        laneDefinitions: [
          {
            id: "top",
            basePoints: [
              { x: -30, y: 64 },
              { x: 105, y: 118 },
              { x: 240, y: 176 },
              { x: 360, y: 214 },
              { x: 500, y: 276 },
              { x: 620, y: 324 },
              { x: 695, y: 350 },
              { x: 714, y: 356 }
            ]
          },
          {
            id: "bottom",
            basePoints: [
              { x: -30, y: 358 },
              { x: 110, y: 304 },
              { x: 245, y: 246 },
              { x: 360, y: 212 },
              { x: 500, y: 148 },
              { x: 620, y: 98 },
              { x: 696, y: 70 },
              { x: 714, y: 64 }
            ]
          }
        ]
      },
      5: {
        name: "Snowfield Patrol",
        terrain: "snow",
        flowerTheme: "christmas",
        mergeGate: false,
        waveCountMul: 1.25,
        enemyHpMul: 1.28,
        enemySpeedMul: 1.16,
        spawnDelayMul: 0.8,
        enemyWeights: { aphid: 2, mantis: 3, locust: 4, ladybug: 4, caterpillar: 4 },
        badgeName: "Winter Holly",
        badgePetal: "#2f8f4d",
        badgeCenter: "#d84b4b",
        laneDefinitions: [
          {
            id: "top",
            basePoints: [
              { x: -30, y: 66 },
              { x: 76, y: 96 },
              { x: 170, y: 154 },
              { x: 268, y: 188 },
              { x: 346, y: 232 },
              { x: 472, y: 286 },
              { x: 562, y: 312 },
              { x: 658, y: 342 },
              { x: 714, y: 356 }
            ]
          },
          {
            id: "middle",
            basePoints: [
              { x: -30, y: 196 },
              { x: 90, y: 162 },
              { x: 188, y: 230 },
              { x: 304, y: 206 },
              { x: 428, y: 178 },
              { x: 546, y: 246 },
              { x: 642, y: 220 },
              { x: 714, y: 210 }
            ]
          },
          {
            id: "bottom",
            basePoints: [
              { x: -30, y: 360 },
              { x: 120, y: 318 },
              { x: 198, y: 272 },
              { x: 314, y: 222 },
              { x: 410, y: 170 },
              { x: 534, y: 120 },
              { x: 616, y: 82 },
              { x: 686, y: 62 },
              { x: 714, y: 64 }
            ]
          }
        ]
      },
      6: {
        name: "Topiary Maze",
        waves: 16,
        terrain: "lawn",
        flowerTheme: "topiary",
        mergeGate: true,
        waveCountMul: 1.32,
        enemyHpMul: 1.34,
        enemySpeedMul: 1.18,
        spawnDelayMul: 0.76,
        enemyWeights: { aphid: 2, mantis: 3, locust: 4, ladybug: 4, caterpillar: 5 },
        badgeName: "Boxwood Crown",
        badgePetal: "#4a8a47",
        badgeCenter: "#dbe7c8",
        laneDefinitions: [
          {
            id: "upperA",
            basePoints: [
              { x: -30, y: 52 },
              { x: 96, y: 84 },
              { x: 208, y: 60 },
              { x: 318, y: 116 },
              { x: 432, y: 98 },
              { x: 526, y: 186 },
              { x: 594, y: 256 },
              { x: 612, y: 338 },
              { x: 662, y: 338 },
              { x: 700, y: 338 },
              { x: 714, y: 338 }
            ]
          },
          {
            id: "upperB",
            basePoints: [
              { x: -30, y: 136 },
              { x: 116, y: 174 },
              { x: 212, y: 230 },
              { x: 310, y: 174 },
              { x: 426, y: 236 },
              { x: 524, y: 206 },
              { x: 604, y: 274 },
              { x: 612, y: 338 },
              { x: 666, y: 338 },
              { x: 702, y: 338 },
              { x: 714, y: 338 }
            ]
          },
          {
            id: "lowerA",
            basePoints: [
              { x: -30, y: 252 },
              { x: 98, y: 220 },
              { x: 202, y: 162 },
              { x: 304, y: 248 },
              { x: 420, y: 188 },
              { x: 516, y: 262 },
              { x: 602, y: 288 },
              { x: 612, y: 338 },
              { x: 668, y: 338 },
              { x: 704, y: 338 },
              { x: 714, y: 338 }
            ]
          },
          {
            id: "lowerB",
            basePoints: [
              { x: -30, y: 366 },
              { x: 112, y: 334 },
              { x: 218, y: 358 },
              { x: 328, y: 304 },
              { x: 438, y: 318 },
              { x: 542, y: 276 },
              { x: 612, y: 338 },
              { x: 676, y: 338 },
              { x: 708, y: 338 },
              { x: 714, y: 338 }
            ]
          }
        ]
      }
    };
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
    const enemyTypes = ["aphid", "mantis", "locust", "ladybug", "caterpillar"];

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
    const scorePanelEl = document.getElementById("scorePanel");
    const scoreNameInputEl = document.getElementById("scoreNameInput");
    const submitScoreBtn = document.getElementById("submitScoreBtn");
    const highscoreListEl = document.getElementById("highscoreList");
    const badgeListEl = document.getElementById("badgeList");
    const towerInfoNameEl = document.getElementById("towerInfoName");
    const towerInfoCostEl = document.getElementById("towerInfoCost");
    const towerInfoDescEl = document.getElementById("towerInfoDesc");
    const upgradeInfoEl = document.getElementById("upgradeInfo");
    const upgradeTitleEl = document.getElementById("upgradeTitle");
    const upgradeCostEl = document.getElementById("upgradeCost");
    const upgradeStatsEl = document.getElementById("upgradeStats");
    const upgradeSelectedBtn = document.getElementById("upgradeSelectedBtn");
    const sellSelectedBtn = document.getElementById("sellSelectedBtn");
    const towerTargetSelect = document.getElementById("towerTargetSelect");
    const sprayTowerBtn = document.getElementById("sprayTowerBtn");
    const glueTowerBtn = document.getElementById("glueTowerBtn");
    const hoseTowerBtn = document.getElementById("hoseTowerBtn");
    const difficultySelect = document.getElementById("difficultySelect");
    const levelSelect = document.getElementById("levelSelect");
    const levelStatEl = document.getElementById("levelStat");
    const difficultyStatEl = document.getElementById("difficultyStat");
    const targetModeBtn = document.getElementById("targetModeBtn");
    const instructionsBtn = document.getElementById("instructionsBtn");
    const helpPanelEl = document.getElementById("helpPanel");
    const scoresPanelEl = document.getElementById("scoresPanel");
    const badgesPanelEl = document.getElementById("badgesPanel");
    const landingScreenEl = document.getElementById("landingScreen");
    const landingStartBtn = document.getElementById("landingStartBtn");
    const landingHowToBtn = document.getElementById("landingHowToBtn");
    const landingLevelSelect = document.getElementById("landingLevelSelect");
    const landingContinueBtn = document.getElementById("landingContinueBtn");
    const shellEl = document.querySelector(".shell");
    const startBtn = document.getElementById("startBtn");
    const nextLevelBtn = document.getElementById("nextLevelBtn");
    const resetBtn = document.getElementById("resetBtn");
    const minimalHudBtn = document.getElementById("minimalHudBtn");
    const buildCueEl = document.getElementById("buildCue");
    const nextWaveCountdownEl = document.getElementById("nextWaveCountdown");
    const nextWaveStatEl = document.getElementById("nextWaveStat");
    const bonusWaveStatEl = document.getElementById("bonusWaveStat");

    let money;
    let bank;
    let lives;
    let wave;
    let enemies;
    let towers;
    let bullets;
    let gluePatches;
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
    let nextVegetableId;
    let targetMode;
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
    let minimalHud;
    let uiFadeTimer;
    let currentWaveSpawnTotal;
    let currentWaveLaneLabel;
    let currentWaveKillCount;
    let currentWaveRewardEarned;
    let currentWaveStartLives;
    let waveSummaryHideTimer;
    let waveCalloutHideTimer;

    const maxBitesPerVegetable = 8;
    const highscoreStorageKey = "garden_td_highscores_v1";
    const levelProgressStorageKey = "garden_td_level_badges_v1";
    const earlyStartBonusPct = 0.25;
    const towerSellRate = 0.72;

    const towerCosts = {
      spray: 25,
      glue: 35,
      hose: 45
    };

    const towerDetails = {
      spray: { name: "Sprayer", desc: "Fan spray aerosol damage." },
      glue: { name: "Glue Pot", desc: "Throws sticky traps that slow bugs." },
      hose: { name: "Hosepipe", desc: "Laser-like stream that pierces through all bugs in its path." }
    };

    const difficultyProfiles = {
      easy: {
        label: "Easy",
        startMoney: 130,
        waveCountMul: 0.9,
        hpMul: 0.86,
        speedMul: 0.9,
        rewardMul: 1.15,
        spawnDelayMul: 1.14,
        bossEvery: 6,
        bossHpMul: 0.82,
        bossArmorAdd: -0.06,
        bossGlueResistAdd: -0.12
      },
      normal: {
        label: "Normal",
        startMoney: 100,
        waveCountMul: 1,
        hpMul: 1,
        speedMul: 1,
        rewardMul: 1,
        spawnDelayMul: 1,
        bossEvery: 5,
        bossHpMul: 1,
        bossArmorAdd: 0,
        bossGlueResistAdd: 0
      },
      hard: {
        label: "Hard",
        startMoney: 85,
        waveCountMul: 1.12,
        hpMul: 1.18,
        speedMul: 1.1,
        rewardMul: 0.92,
        spawnDelayMul: 0.9,
        bossEvery: 4,
        bossHpMul: 1.25,
        bossArmorAdd: 0.08,
        bossGlueResistAdd: 0.1
      }
    };

    const enemyRoleStats = {
      aphid: { hpMul: 0.8, speedMul: 1.3, rewardMul: 0.92, glueResist: 0.07, armor: 0, role: "Scout" },
      mantis: { hpMul: 1.06, speedMul: 1.06, rewardMul: 1.06, glueResist: 0.14, armor: 0.03, role: "Hunter" },
      locust: { hpMul: 0.95, speedMul: 1.18, rewardMul: 1, glueResist: 0.18, armor: 0.02, role: "Swarm" },
      ladybug: { hpMul: 1.45, speedMul: 0.82, rewardMul: 1.32, glueResist: 0.22, armor: 0.12, role: "Tank" },
      caterpillar: { hpMul: 1.2, speedMul: 0.9, rewardMul: 1.18, glueResist: 0.34, armor: 0.07, role: "Bulwark" },
      gatecrasher: { hpMul: 3.6, speedMul: 0.78, rewardMul: 3.8, glueResist: 0.5, armor: 0.18, role: "Boss", sizeMul: 1.9 }
    };

    function loadHighscores() {
      try {
        const raw = localStorage.getItem(highscoreStorageKey);
        const parsed = raw ? JSON.parse(raw) : [];
        highscores = Array.isArray(parsed) ? parsed : [];
      } catch {
        highscores = [];
      }
      renderHighscores();
    }

    function saveHighscores() {
      localStorage.setItem(highscoreStorageKey, JSON.stringify(highscores.slice(0, 10)));
    }

    function loadCompletedLevels() {
      try {
        const raw = localStorage.getItem(levelProgressStorageKey);
        const parsed = raw ? JSON.parse(raw) : [];
        completedLevels = Array.isArray(parsed) ? parsed.filter(v => Number.isInteger(v) && v > 0) : [];
      } catch {
        completedLevels = [];
      }
      completedLevels = [...new Set(completedLevels)].sort((a, b) => a - b);
      renderBadges();
    }

    function saveCompletedLevels() {
      localStorage.setItem(levelProgressStorageKey, JSON.stringify(completedLevels));
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

    function submitHighscore() {
      const name = (scoreNameInputEl.value || "").trim();
      if (!gameOver) {
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

    function getVegetableById(id) {
      return gardenVegetables.find(v => v.id === id);
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

    function pickEnemyTypeForLevel(cfg) {
      const weights = cfg.enemyWeights;
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
      money = profile.startMoney;
      if (!keepBank) bank = 0;
      wave = 0;
      enemies = [];
      towers = [];
      bullets = [];
      gluePatches = [];
      bunnies = [];
      implosions = [];
      craters = [];
      bunnySpawnCooldown = 360 + Math.floor(Math.random() * 220);
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
      selectedTowerId = null;
      frameCount = 0;
      targetMode = "garden";
      scoreSubmittedForWave = false;
      autoWaveDueAt = 0;
      currentWaveEarlyStart = false;
      currentWaveHasBoss = false;
      currentWaveFinalBoost = false;
      levelComplete = false;
      nextLevelPending = null;
      difficultyStatEl.textContent = profile.label;
      lastRunWave = 0;
      lastRunMoney = 0;
      lastRunBank = keepBank ? bank : 0;
      currentWaveSpawnTotal = 0;
      currentWaveLaneLabel = "";
      currentWaveKillCount = 0;
      currentWaveRewardEarned = 0;
      currentWaveStartLives = lives || 0;
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
      if (waveSummaryEl) waveSummaryEl.classList.remove("show");
      if (waveCalloutEl) {
        waveCalloutEl.classList.remove("show", "boss", "final");
        waveCalloutEl.textContent = "";
      }
      if (shellEl) shellEl.classList.remove("uiQuiet");
      if (uiFadeTimer) {
        clearTimeout(uiFadeTimer);
        uiFadeTimer = null;
      }
      buildPathData();
      buildLawnTexture();
      gardenVegetables = buildGardenVegetables();
      lives = gardenVegetables.length;
      currentWaveStartLives = lives;
      syncTowerSelectionUI();
      syncTargetModeUI();
      setStatus("Build defenses, then start Wave 1.", "warn");
      syncHUD();
    }

    function beginGameFromLanding() {
      gameStarted = true;
      if (landingScreenEl) landingScreenEl.style.display = "none";
      if (shellEl) shellEl.classList.remove("paused");
      setStatus("Build defenses, then start Wave 1.", "warn");
      syncHUD();
    }

    function startNewGameFromLanding() {
      levelNumber = 1;
      if (levelSelect) levelSelect.value = "1";
      if (landingLevelSelect) landingLevelSelect.value = "1";
      resetGame(false);
      beginGameFromLanding();
      setStatus(`Level 1 started: ${getCurrentLevelConfig().name}.`, "good");
    }

    function continueCampaignFromLanding() {
      const chosen = Number(landingLevelSelect?.value) || 1;
      const levelIds = getSortedLevelIds();
      const fallback = levelIds[0] || 1;
      const target = isLevelUnlocked(chosen, levelIds) ? chosen : fallback;
      levelNumber = target;
      if (levelSelect) levelSelect.value = String(levelNumber);
      if (landingLevelSelect) landingLevelSelect.value = String(levelNumber);
      resetGame(false);
      beginGameFromLanding();
      setStatus(`Campaign level selected: Level ${levelNumber} (${getCurrentLevelConfig().name}).`, "good");
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
      const nextWaveNumber = wave + 1;
      const canSpawnNextWave = nextWaveNumber <= lvl.waves;
      const nextIsBoss = canSpawnNextWave && nextWaveNumber > 0 && nextWaveNumber % profile.bossEvery === 0;
      waveEl.textContent = `${wave}/${lvl.waves}`;
      if (gameOver) {
        waveBannerEl.dataset.state = "normal";
        waveBannerTagEl.textContent = "Over";
      } else if (levelComplete) {
        waveBannerEl.dataset.state = "complete";
        waveBannerTagEl.textContent = "Complete";
      } else if (currentWaveFinalBoost) {
        waveBannerEl.dataset.state = "final";
        waveBannerTagEl.textContent = "Final";
      } else if (currentWaveHasBoss) {
        waveBannerEl.dataset.state = "boss";
        waveBannerTagEl.textContent = "Boss";
      } else if (wave <= 0) {
        waveBannerEl.dataset.state = "normal";
        waveBannerTagEl.textContent = "Ready";
      } else {
        waveBannerEl.dataset.state = "normal";
        waveBannerTagEl.textContent = "Active";
      }
      levelStatEl.textContent = String(levelNumber);
      moneyEl.textContent = money;
      bankEl.textContent = bank;
      livesEl.textContent = lives;
      enemyCountEl.textContent = enemies.length;
      difficultyStatEl.textContent = profile.label;
      if (buildCueEl) {
        const info = towerDetails[selectedTowerType] || towerDetails.spray;
        if (!gameStarted || gameOver || levelComplete) {
          buildCueEl.textContent = "";
        } else {
          buildCueEl.textContent = `Build mode: ${info.name} selected. Click grass to place.`;
        }
      }
      syncTowerAffordability();
      startBtn.disabled = gameOver || (levelComplete && !nextLevelPending);
      const showNextLevelBtn = !gameOver && levelComplete && !!nextLevelPending;
      nextLevelBtn.style.display = showNextLevelBtn ? "inline-block" : "none";
      nextLevelBtn.disabled = !showNextLevelBtn;
      if (showNextLevelBtn) nextLevelBtn.textContent = `Go To Level ${nextLevelPending}`;
      if (autoWaveTimer && autoWaveDueAt > 0 && !gameOver) {
        const remainingMs = Math.max(0, autoWaveDueAt - Date.now());
        const sec = Math.max(1, Math.ceil(remainingMs / 1000));
        nextWaveCountdownEl.textContent = `Next in ${sec}s | +25% early-start`;
        nextWaveStatEl.textContent = nextIsBoss ? `Next: ${sec}s (Boss, +25% early)` : `Next: ${sec}s (+25% early)`;
        bonusWaveStatEl.textContent = "Bonus: +25% if started early";
        startBtn.textContent = nextIsBoss ? `Start Boss (+25%) - ${sec}s` : `Start Now (+25%) - ${sec}s`;
      } else {
        nextWaveCountdownEl.textContent = "";
        if (gameOver) nextWaveStatEl.textContent = "Next: --";
        else if (levelComplete && nextLevelPending) nextWaveStatEl.textContent = `Next: Level ${nextLevelPending} Ready`;
        else if (levelComplete) nextWaveStatEl.textContent = `Level ${levelNumber} Complete`;
        else if (!canSpawnNextWave) nextWaveStatEl.textContent = "Next: Final Cleared";
        else nextWaveStatEl.textContent = nextIsBoss ? "Next: Ready (Boss)" : "Next: Ready";
        if (levelComplete && nextLevelPending) {
          bonusWaveStatEl.textContent = `Level ${nextLevelPending} Unlocked`;
        } else if (levelComplete) {
          bonusWaveStatEl.textContent = "Level Complete";
        } else if (currentWaveFinalBoost) {
          bonusWaveStatEl.textContent = "Final boost active";
        } else if (currentWaveHasBoss) {
          bonusWaveStatEl.textContent = currentWaveEarlyStart ? "Boss +25% active" : "Boss wave active";
        } else {
          bonusWaveStatEl.textContent = currentWaveEarlyStart ? "+25% active this wave" : "Bonus: none";
        }
        startBtn.textContent = levelComplete && nextLevelPending ? `Start Level ${nextLevelPending}` : (levelComplete ? "Level Complete" : "Start Wave");
      }
      renderUpgradePanel();
    }

    function goToNextLevel() {
      if (gameOver || !levelComplete || !nextLevelPending) return;
      levelNumber = nextLevelPending;
      if (levelSelect) levelSelect.value = String(levelNumber);
      resetGame(true);
      setStatus(`Level ${levelNumber} selected: ${getCurrentLevelConfig().name}.`, "good");
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
      if (!gameStarted || gameOver || levelComplete || minimalHud) return;
      uiFadeTimer = setTimeout(() => {
        shellEl.classList.add("uiQuiet");
      }, 3400);
    }

    function setUpgradeStatsChips(parts) {
      upgradeStatsEl.innerHTML = "";
      for (const part of parts) {
        const chip = document.createElement("span");
        chip.className = "statChip";
        chip.textContent = part;
        upgradeStatsEl.appendChild(chip);
      }
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

    function showWaveSummary(summary) {
      if (!waveSummaryEl || !waveSummaryTitleEl || !waveSummaryBodyEl) return;
      waveSummaryTitleEl.textContent = summary.title;
      waveSummaryBodyEl.innerHTML = "";
      const parts = [
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
      waveSummaryHideTimer = setTimeout(() => {
        waveSummaryEl.classList.remove("show");
      }, 7200);
    }

    function getUpgradeCost(tower) {
      if (tower.type === "glue") return 28 + tower.level * 15;
      if (tower.type === "hose") return 38 + tower.level * 19;
      return 30 + tower.level * 17;
    }

    function getTowerSellValue(tower) {
      return Math.max(1, Math.round((tower.totalSpent || 0) * towerSellRate));
    }

    function getTowerDisplayName(type) {
      if (type === "glue") return "Glue Pot";
      if (type === "hose") return "Hosepipe";
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
      chosen.totalSpent = (chosen.totalSpent || 0) + cost;
      chosen.level += 1;
      if (chosen.type === "glue") {
        chosen.range += 10;
        chosen.fireRate = Math.max(30, chosen.fireRate - 5);
        chosen.slowMultiplier = Math.max(0.35, chosen.slowMultiplier - 0.05);
        chosen.trapRadius += 2;
        chosen.trapLife += 26;
      } else if (chosen.type === "hose") {
        chosen.damage += 6;
        chosen.range += 10;
        chosen.fireRate = Math.max(20, chosen.fireRate - 5);
        chosen.beamWidth += 0.6;
      } else {
        chosen.damage += 5;
        chosen.range += 8;
        chosen.fireRate = Math.max(16, chosen.fireRate - 4);
      }
      setStatus(`Tower upgraded to level ${chosen.level}.`, "good");
      selectedTowerId = chosen.id;
      chosen.showRangeUntil = frameCount + 220;
      syncHUD();
      return true;
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
      setStatus(`Sold ${getTowerDisplayName(tower.type)} for $${value}.`, "good");
      syncHUD();
    }

    function createEnemy(enemyType, waveLaneId, hp, speed, reward, finalWaveBoost = false) {
      const profile = getDifficultyProfile();
      const stats = enemyRoleStats[enemyType] || enemyRoleStats.aphid;
      const spawnPoint = getPathPointAtDistance(waveLaneId, 0);
      let hpScaled = Math.round(hp * stats.hpMul);
      let armor = stats.armor || 0;
      let glueResist = stats.glueResist || 0;
      let sizeMul = stats.sizeMul || 1;
      let strengthMul = 1;
      if (enemyType === "gatecrasher") {
        hpScaled = Math.round(hpScaled * profile.bossHpMul);
        armor = Math.max(0, Math.min(0.8, armor + profile.bossArmorAdd));
        glueResist = Math.max(0, Math.min(0.9, glueResist + profile.bossGlueResistAdd));
      }
      if (finalWaveBoost) {
        hpScaled = Math.round(hpScaled * 2);
        armor = Math.max(0, Math.min(0.85, armor + 0.08));
        sizeMul *= 1.45;
        strengthMul = 2;
      }
      return {
        id: nextEnemyId++,
        x: spawnPoint.x,
        y: spawnPoint.y,
        laneId: waveLaneId,
        enemyType,
        state: "path",
        targetVegetableId: null,
        eatTimer: 0,
        pathDist: 0,
        progress: 0,
        hp: hpScaled,
        maxHp: hpScaled,
        speed: speed * stats.speedMul,
        reward: Math.max(1, Math.round(reward * stats.rewardMul)),
        glueResist,
        armor,
        sizeMul,
        strengthMul,
        role: stats.role || ""
      };
    }

    function renderUpgradePanel() {
      if (!upgradeInfoEl) return;
      const selected = towers.find(t => t.id === selectedTowerId);
      if (!selected) {
        upgradeTitleEl.textContent = "";
        upgradeCostEl.textContent = "";
        upgradeCostEl.classList.remove("locked");
        setUpgradeStatsChips(["Right-click a tower to upgrade"]);
        upgradeSelectedBtn.textContent = "Upgrade";
        sellSelectedBtn.textContent = "Sell";
        upgradeSelectedBtn.disabled = true;
        sellSelectedBtn.disabled = true;
        towerTargetSelect.disabled = true;
        return;
      }

      const name = selected.type === "glue" ? "Glue Pot" : "Sprayer";
      upgradeTitleEl.textContent = `${name} L${selected.level}`;
      sellSelectedBtn.disabled = false;
      towerTargetSelect.disabled = false;
      towerTargetSelect.value = selected.targetMode || "garden";
      const sellValue = getTowerSellValue(selected);
      sellSelectedBtn.textContent = `Sell ($${sellValue})`;
      if (selected.level >= 6) {
        upgradeCostEl.textContent = "MAX LEVEL";
        upgradeCostEl.classList.remove("locked");
        upgradeSelectedBtn.disabled = true;
        if (selected.type === "glue") {
          const slowPct = Math.round((1 - selected.slowMultiplier) * 100);
          setUpgradeStatsChips([
            `Range ${Math.round(selected.range)}`,
            `Rate ${selected.fireRate}`,
            `Slow ${slowPct}%`,
            `Radius ${selected.trapRadius}`,
            `Life ${selected.trapLife}`
          ]);
        } else if (selected.type === "hose") {
          const dps = (selected.damage / Math.max(1, selected.fireRate / 60)).toFixed(1);
          setUpgradeStatsChips([
            `Beam ${selected.damage}`,
            `Range ${Math.round(selected.range)}`,
            `Rate ${selected.fireRate}`,
            `Width ${selected.beamWidth.toFixed(1)}`,
            `DPS ${dps}`
          ]);
        } else {
          const dps = ((selected.damage * 0.34 * 6) / Math.max(1, selected.fireRate / 60)).toFixed(1);
          setUpgradeStatsChips([
            `Damage ${selected.damage}`,
            `Range ${Math.round(selected.range)}`,
            `Rate ${selected.fireRate}`,
            `DPS ${dps}`
          ]);
        }
        return;
      }

      const cost = getUpgradeCost(selected);
      const canAfford = money >= cost;
      upgradeCostEl.textContent = `Upgrade: $${cost}`;
      upgradeCostEl.classList.toggle("locked", !canAfford);
      upgradeSelectedBtn.textContent = `Upgrade ($${cost})`;
      upgradeSelectedBtn.disabled = !canAfford;

      if (selected.type === "glue") {
        const nextRange = selected.range + 10;
        const nextRate = Math.max(30, selected.fireRate - 5);
        const currentSlowPct = Math.round((1 - selected.slowMultiplier) * 100);
        const nextSlowPct = Math.round((1 - Math.max(0.35, selected.slowMultiplier - 0.05)) * 100);
        const nextRadius = selected.trapRadius + 2;
        const nextLife = selected.trapLife + 26;
        setUpgradeStatsChips([
          `Range ${Math.round(selected.range)} -> ${Math.round(nextRange)}`,
          `Rate ${selected.fireRate} -> ${nextRate}`,
          `Slow ${currentSlowPct}% -> ${nextSlowPct}%`,
          `Radius ${selected.trapRadius} -> ${nextRadius}`,
          `Life ${selected.trapLife} -> ${nextLife}`
        ]);
      } else if (selected.type === "hose") {
        const nextDamage = selected.damage + 6;
        const nextRange = selected.range + 10;
        const nextRate = Math.max(20, selected.fireRate - 5);
        const nextWidth = (selected.beamWidth + 0.6).toFixed(1);
        const currentDps = (selected.damage / Math.max(1, selected.fireRate / 60)).toFixed(1);
        const nextDps = (nextDamage / Math.max(1, nextRate / 60)).toFixed(1);
        setUpgradeStatsChips([
          `Beam ${selected.damage} -> ${nextDamage}`,
          `Range ${Math.round(selected.range)} -> ${Math.round(nextRange)}`,
          `Rate ${selected.fireRate} -> ${nextRate}`,
          `Width ${selected.beamWidth.toFixed(1)} -> ${nextWidth}`,
          `DPS ${currentDps} -> ${nextDps}`
        ]);
      } else {
        const nextDamage = selected.damage + 5;
        const nextRange = selected.range + 8;
        const nextRate = Math.max(16, selected.fireRate - 4);
        const currentDps = ((selected.damage * 0.34 * 6) / Math.max(1, selected.fireRate / 60)).toFixed(1);
        const nextDps = ((nextDamage * 0.34 * 6) / Math.max(1, nextRate / 60)).toFixed(1);
        setUpgradeStatsChips([
          `Damage ${selected.damage} -> ${nextDamage}`,
          `Range ${Math.round(selected.range)} -> ${Math.round(nextRange)}`,
          `Rate ${selected.fireRate} -> ${nextRate}`,
          `DPS ${currentDps} -> ${nextDps}`
        ]);
      }
    }

    function syncTowerSelectionUI() {
      sprayTowerBtn.classList.toggle("active", selectedTowerType === "spray");
      glueTowerBtn.classList.toggle("active", selectedTowerType === "glue");
      hoseTowerBtn.classList.toggle("active", selectedTowerType === "hose");
      const info = towerDetails[selectedTowerType];
      towerInfoNameEl.textContent = info.name;
      towerInfoCostEl.textContent = towerCosts[selectedTowerType];
      towerInfoDescEl.textContent = info.desc;
      syncTowerAffordability();
    }

    function syncTowerAffordability() {
      const towerButtons = [
        { btn: sprayTowerBtn, type: "spray" },
        { btn: glueTowerBtn, type: "glue" },
        { btn: hoseTowerBtn, type: "hose" }
      ];
      towerButtons.forEach(({ btn, type }) => {
        const cost = towerCosts[type];
        const canAfford = money >= cost;
        const shortName = type === "glue" ? "Glue Pot" : (type === "hose" ? "Hosepipe" : "Sprayer");
        const hotkey = type === "glue" ? "2" : (type === "hose" ? "3" : "1");
        const missing = Math.max(0, cost - money);
        const affordText = canAfford ? `${shortName} ($${cost}) [${hotkey}]` : `${shortName} ($${cost}) [${hotkey}] - Need $${missing} more`;
        btn.classList.toggle("unaffordable", !canAfford);
        btn.setAttribute("aria-disabled", canAfford ? "false" : "true");
        btn.setAttribute("title", affordText);
        btn.setAttribute("aria-label", affordText);
      });
    }

    function setSelectedTowerType(type) {
      selectedTowerType = type;
      syncTowerSelectionUI();
      const label = getTowerDisplayName(type);
      setStatus(`${label} selected.`, "warn");
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
      }
    }

    function toggleMinimalHud() {
      minimalHud = !minimalHud;
      if (shellEl) shellEl.classList.toggle("minimalHud", minimalHud);
      if (shellEl && minimalHud) shellEl.classList.remove("uiQuiet");
      if (minimalHudBtn) minimalHudBtn.textContent = minimalHud ? "HUD: Minimal" : "HUD: Full";
      setStatus(minimalHud ? "Minimal HUD enabled." : "Full HUD enabled.", "warn");
    }

    function syncTargetModeUI() {
      targetModeBtn.textContent = targetMode === "closest" ? "Target: Nearest" : "Target: Garden";
    }

    function toggleTargetMode() {
      targetMode = targetMode === "closest" ? "garden" : "closest";
      syncTargetModeUI();
      setStatus(targetMode === "closest" ? "Targeting closest in range." : "Targeting closest to garden.", "warn");
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
        let totalLength = 0;

        for (let i = 0; i < points.length - 1; i += 1) {
          const a = points[i];
          const b = points[i + 1];
          const length = Math.hypot(b.x - a.x, b.y - a.y);
          segments.push({ a, b, length, start: totalLength });
          totalLength += length;
        }

        lanes[def.id] = {
          id: def.id,
          points,
          segments,
          totalLength,
          flagstones: [],
          flowers: []
        };
        buildFlagstones(lanes[def.id]);
        buildFlowerBeds(lanes[def.id]);
      }
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
      for (let d = 14; d < lane.totalLength - 14; d += 24) {
        const p = getPathPointAtDistance(lane.id, d);
        const t = getPathTangentAtDistance(lane.id, d);
        const n = { x: -t.y, y: t.x };
        const lateral = Math.sin(d * 0.09) * roadHalfHeight * 0.22;
        const hue = Math.sin(d * 0.11);

        lane.flagstones.push({
          x: p.x + n.x * lateral,
          y: p.y + n.y * lateral,
          rx: 6 + (Math.sin(d * 0.17) + 1) * 2.2,
          ry: 4.8 + (Math.cos(d * 0.13) + 1) * 1.6,
          rot: Math.atan2(t.y, t.x) + Math.sin(d * 0.07) * 0.35,
          fill: hue > 0 ? "#9ea7b1" : "#8a939d",
          edge: hue > 0 ? "#6d7682" : "#5f6873"
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

    function placeTower(x, y) {
      if (gameOver || levelComplete) return;
      if (!Number.isFinite(x) || !Number.isFinite(y)) {
        setStatus("Invalid click position detected. Try reloading the page.", "danger");
        return;
      }
      const towerCost = towerCosts[selectedTowerType];
      if (money < towerCost) {
        setStatus("Not enough money to place a tower.", "danger");
        return;
      }

      if (intersectsRoad(x, y)) {
        setStatus("You cannot place towers on the road.", "danger");
        return;
      }

      if (intersectsCrater(x, y, towerRadius + 2)) {
        setStatus("That crater is unstable. You cannot rebuild there.", "danger");
        return;
      }

      for (const t of towers) {
        if (Math.hypot(t.x - x, t.y - y) < towerRadius * 2 + 8) {
          setStatus("Too close to another tower.", "danger");
          return;
        }
      }

      if (selectedTowerType === "glue") {
        towers.push({
          id: nextTowerId++,
          x,
          y,
          type: "glue",
          level: 1,
          range: 135,
          fireRate: 74,
          cooldown: 0,
          slowMultiplier: 0.62,
          trapRadius: 24,
          trapLife: 185,
          targetMode,
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
          damage: 14,
          range: 155,
          fireRate: 52,
          beamWidth: 7,
          cooldown: 0,
          laserFlash: 0,
          lastAimAngle: 0,
          targetMode,
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
          damage: 10,
          range: 120,
          fireRate: 46,
          cooldown: 0,
          sprayFlash: 0,
          lastAimAngle: 0,
          targetMode,
          totalSpent: towerCost,
          showRangeUntil: frameCount + 220
        });
      }
      selectedTowerId = towers[towers.length - 1].id;
      money -= towerCost;
      setStatus("Tower placed.", "good");
      syncHUD();
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
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
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
      const startedEarly = !!autoWaveTimer;
      if (autoWaveTimer) {
        clearTimeout(autoWaveTimer);
        autoWaveTimer = null;
      }
      autoWaveDueAt = 0;

      wave += 1;
      currentWaveEarlyStart = startedEarly;
      currentWaveFinalBoost = wave === lvl.waves;
      currentWaveHasBoss = wave % profile.bossEvery === 0;
      const levelWaveMul = lvl.waveCountMul || 1;
      const levelHpMul = lvl.enemyHpMul || 1;
      const levelSpeedMul = lvl.enemySpeedMul || 1;
      const levelSpawnMul = lvl.spawnDelayMul || 1;
      const baseTotal = currentWaveHasBoss ? Math.max(8, Math.floor(5 + wave * 1.1)) : 8 + wave * 2;
      const total = Math.max(6, Math.round(baseTotal * profile.waveCountMul * levelWaveMul));
      const hp = Math.round((30 + wave * 7) * profile.hpMul * levelHpMul);
      const speed = (0.9 + wave * 0.07) * profile.speedMul * levelSpeedMul;
      const reward = Math.max(1, Math.round((8 + wave * 2) * profile.rewardMul));
      const spawnDelay = Math.max(220, Math.round(Math.max(280, 780 - wave * 30) * profile.spawnDelayMul * levelSpawnMul));
      const laneIds = (lvl.laneDefinitions || []).map(def => def.id).filter(Boolean);
      const waveLaneId = laneIds.length > 0 ? laneIds[Math.floor(Math.random() * laneIds.length)] : "top";
      const waveLaneLabel = `${waveLaneId} path`;
      currentWaveSpawnTotal = total;
      currentWaveLaneLabel = waveLaneLabel;
      currentWaveKillCount = 0;
      currentWaveRewardEarned = 0;
      currentWaveStartLives = lives;

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
      showWaveCallout(calloutText, calloutMode, 2900);
      syncHUD();

      let bossSpawned = !currentWaveHasBoss;
      const spawnTimer = setInterval(() => {
        let enemyType = pickEnemyTypeForLevel(lvl);
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
    }

    function pickTarget(tower) {
      const mode = tower.targetMode || targetMode;
      let best = null;
      let bestScore = mode === "closest" ? Infinity : -Infinity;
      for (const e of enemies) {
        const d = Math.hypot(e.x - tower.x, e.y - tower.y);
        if (d > tower.range) continue;
        const score = mode === "closest" ? d : e.progress;
        if (!best || (mode === "closest" ? score < bestScore : score > bestScore)) {
          best = e;
          bestScore = score;
        }
      }
      return best;
    }

    function removeEnemyAtIndex(enemyIndex, rewardOnDefeat = false) {
      if (enemyIndex < 0 || enemyIndex >= enemies.length) return;
      const enemy = enemies[enemyIndex];
      releaseVegetableReservation(enemy);
      if (rewardOnDefeat) {
        money += enemy.reward;
        currentWaveKillCount += 1;
        currentWaveRewardEarned += enemy.reward;
      }
      enemies.splice(enemyIndex, 1);
    }

    function updateSimulation() {
      if (!gameStarted) return;
      frameCount += 1;

      bunnySpawnCooldown -= 1;
      if (!gameOver && bunnySpawnCooldown <= 0) {
        triggerBunnyAttack();
        bunnySpawnCooldown = 360 + Math.floor(Math.random() * 240);
      }

      for (let i = bunnies.length - 1; i >= 0; i -= 1) {
        bunnies[i].life -= 1;
        if (bunnies[i].life <= 0) bunnies.splice(i, 1);
      }

      for (let i = implosions.length - 1; i >= 0; i -= 1) {
        implosions[i].life -= 1;
        if (implosions[i].life <= 0) implosions.splice(i, 1);
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
        if (e.state === "path") {
          const lane = getLane(e.laneId);
          let speedFactor = 1;
          for (const patch of gluePatches) {
            if (patch.laneId !== e.laneId) continue;
            const d = Math.hypot(e.x - patch.x, e.y - patch.y);
            const enemySize = enemyRadius * (e.sizeMul || 1);
            if (d <= patch.radius + enemySize * 0.4) {
              const resist = e.glueResist || 0;
              const adjustedSlow = 1 - (1 - patch.slowMultiplier) * (1 - resist);
              speedFactor = Math.min(speedFactor, adjustedSlow);
            }
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
            const dist = Math.hypot(dx, dy);
            const step = 1.25;
            if (dist <= step + 0.2) {
              e.x = veg.x;
              e.y = veg.y;
              e.state = "eating";
              e.eatTimer = 0;
            } else {
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
        if (t.type === "spray" && t.sprayFlash > 0) t.sprayFlash -= 1;
        if (t.type === "hose" && t.laserFlash > 0) t.laserFlash -= 1;
        if (t.cooldown > 0 || enemies.length === 0) continue;

        const best = pickTarget(t);

        if (best) {
          if (t.type === "glue") {
            const lane = getLane(best.laneId);
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
                const armor = e.armor || 0;
                e.hp -= t.damage * (1 - armor);
                if (e.hp <= 0) {
                  removeEnemyAtIndex(ei, true);
                }
              }
            }
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
          }
          t.cooldown = t.fireRate;
        }
      }

      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.px = b.x;
        b.py = b.y;
        b.x += b.vx;
        b.y += b.vy;
        b.life -= 1;

        let hitEnemy = null;
        for (const e of enemies) {
          const hitRadius = enemyRadius * (e.sizeMul || 1);
          const d = Math.hypot(e.x - b.x, e.y - b.y);
          if (d <= hitRadius + b.radius) {
            hitEnemy = e;
            break;
          }
        }

        if (hitEnemy) {
          const armor = hitEnemy.armor || 0;
          hitEnemy.hp -= b.damage * (1 - armor);
          bullets.splice(i, 1);
          if (hitEnemy.hp <= 0) {
            const defeatedIdx = enemies.indexOf(hitEnemy);
            if (defeatedIdx >= 0) removeEnemyAtIndex(defeatedIdx, true);
          }
          continue;
        }

        if (b.life <= 0 || b.x < -20 || b.x > canvas.width + 20 || b.y < -20 || b.y > canvas.height + 20) {
          bullets.splice(i, 1);
        }
      }

      if (!gameOver && activeSpawners === 0 && enemies.length === 0 && wave > lastClearedWave) {
        const lvl = getCurrentLevelConfig();
        const baseBonus = 10 + wave * 2;
        const bonus = currentWaveEarlyStart ? Math.round(baseBonus * (1 + earlyStartBonusPct)) : baseBonus;
        const waveBossFlag = currentWaveHasBoss;
        const waveVegLost = Math.max(0, currentWaveStartLives - lives);
        money += bonus;
        showWaveSummary({
          title: waveBossFlag ? `Wave ${wave} Cleared - Boss Defeated` : `Wave ${wave} Cleared`,
          lane: currentWaveLaneLabel || "Unknown path",
          defeated: currentWaveKillCount,
          spawned: currentWaveSpawnTotal || currentWaveKillCount,
          vegLost: waveVegLost,
          rewards: currentWaveRewardEarned,
          bonus
        });
        showWaveCallout(waveBossFlag ? `Wave ${wave} Cleared - Boss Down` : `Wave ${wave} Cleared`, waveBossFlag ? "boss" : "normal", 2200);
        if (wave >= lvl.waves) {
          const levelBankDeposit = money;
          bank += levelBankDeposit;
          money = 0;
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
            setStatus(`Level ${levelNumber} complete. Banked $${levelBankDeposit}. Final bank: $${bank}. You defended all ${lvl.waves} waves.`, "good");
          }
          lastClearedWave = wave;
          populateLevelSelect();
          syncHUD();
          return;
        }
        if (currentWaveEarlyStart) {
          const bonusExtra = bonus - baseBonus;
          const bossNote = waveBossFlag ? " Boss defeated!" : "";
          setStatus(`Wave ${wave} cleared.${bossNote} Base $${baseBonus} + early-start $${bonusExtra} = $${bonus}. Next wave in 10s (or start now for +25%).`, "good");
        } else {
          const bossNote = waveBossFlag ? " Boss defeated!" : "";
          setStatus(`Wave ${wave} cleared.${bossNote} +$${bonus} bonus. Next wave in 10s (or start now for +25%).`, "good");
        }
        lastClearedWave = wave;
        currentWaveEarlyStart = false;
        currentWaveHasBoss = false;
        scheduleAutoWaveStart();
      }

      syncHUD();
    }

    function drawRoad() {
      const blockedWidth = (roadHalfHeight + 4) * 2;
      const cfg = getCurrentLevelConfig();
      const shoulderColor = cfg.terrain === "snow" ? "rgba(96, 112, 132, 0.28)" : "rgba(93, 104, 116, 0.26)";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (const lane of Object.values(lanes)) {
        const points = lane.points;
        const yMin = Math.min(...points.map(p => p.y)) - roadHalfHeight;
        const yMax = Math.max(...points.map(p => p.y)) + roadHalfHeight;
        const roadGradient = ctx.createLinearGradient(0, yMin, 0, yMax);
        if (cfg.terrain === "snow") {
          roadGradient.addColorStop(0, "#c2cbd6");
          roadGradient.addColorStop(0.55, "#98a4b2");
          roadGradient.addColorStop(1, "#8693a3");
        } else {
          roadGradient.addColorStop(0, "#9aa5b0");
          roadGradient.addColorStop(0.5, "#7e8894");
          roadGradient.addColorStop(1, "#6d7783");
        }

        ctx.strokeStyle = shoulderColor;
        ctx.lineWidth = blockedWidth;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i += 1) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();

        ctx.strokeStyle = roadGradient;
        ctx.lineWidth = roadHalfHeight * 2;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i += 1) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();

        // Soft edge highlights for a cleaner, more dimensional path
        ctx.strokeStyle = "rgba(240, 248, 255, 0.22)";
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i += 1) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();

        ctx.strokeStyle = "rgba(18, 24, 34, 0.18)";
        ctx.lineWidth = Math.max(1, roadHalfHeight * 0.6);
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i += 1) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();

        for (const stone of lane.flagstones) {
          ctx.save();
          ctx.translate(stone.x, stone.y);
          ctx.rotate(stone.rot);
          ctx.fillStyle = stone.fill;
          ctx.strokeStyle = stone.edge;
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.ellipse(0, 0, stone.rx, stone.ry, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
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
      const cfg = getCurrentLevelConfig();
      const topWash = ctx.createLinearGradient(0, 0, 0, canvas.height);
      if (cfg.terrain === "snow") {
        topWash.addColorStop(0, "rgba(206, 226, 255, 0.13)");
        topWash.addColorStop(1, "rgba(150, 182, 220, 0.05)");
      } else {
        topWash.addColorStop(0, "rgba(255, 240, 188, 0.08)");
        topWash.addColorStop(1, "rgba(76, 123, 77, 0.03)");
      }
      ctx.fillStyle = topWash;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const vignette = ctx.createRadialGradient(
        canvas.width * 0.5,
        canvas.height * 0.5,
        Math.min(canvas.width, canvas.height) * 0.24,
        canvas.width * 0.5,
        canvas.height * 0.5,
        Math.max(canvas.width, canvas.height) * 0.72
      );
      vignette.addColorStop(0, "rgba(255, 255, 255, 0)");
      vignette.addColorStop(1, "rgba(7, 12, 22, 0.2)");
      ctx.fillStyle = vignette;
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

    function drawTowers() {
      for (const t of towers) {
        const showRange = t.id === selectedTowerId || (t.showRangeUntil && t.showRangeUntil > frameCount);
        if (showRange) {
          ctx.strokeStyle = "rgba(120, 250, 170, 0.42)";
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.arc(t.x, t.y, t.range, 0, Math.PI * 2);
          ctx.stroke();
        }

        if (t.level > 1) {
          const strength = Math.min(1, (t.level - 1) / 5);
          ctx.strokeStyle = `rgba(255, 224, 114, ${0.25 + strength * 0.45})`;
          ctx.lineWidth = 1.5 + strength * 1.5;
          ctx.beginPath();
          ctx.arc(t.x, t.y, towerRadius + 5 + strength * 3, 0, Math.PI * 2);
          ctx.stroke();
        }

        const idlePulse = 0.12 + (Math.sin(frameCount * 0.08 + t.id * 0.6) + 1) * 0.04;
        const glowColor = t.type === "glue" ? "255, 214, 120" : (t.type === "hose" ? "132, 228, 255" : "255, 104, 104");
        ctx.fillStyle = `rgba(${glowColor}, ${idlePulse})`;
        ctx.beginPath();
        ctx.arc(t.x, t.y + 2.5, 16, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.translate(t.x, t.y);
        ctx.scale(1.5, 1.5);

        // Shared mount plate under each tower body
        ctx.fillStyle = "rgba(24, 30, 44, 0.88)";
        ctx.strokeStyle = "rgba(189, 205, 235, 0.35)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(0, 7.6, 8.8, 3.3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        if (t.type === "glue") {
          const glueGrad = ctx.createLinearGradient(0, -8, 0, 8);
          glueGrad.addColorStop(0, "#f2b164");
          glueGrad.addColorStop(0.55, "#d18b46");
          glueGrad.addColorStop(1, "#a86f31");
          ctx.fillStyle = glueGrad;
          ctx.strokeStyle = "#7a4f21";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(-8.2, -6.8, 16.4, 13.8, 3.2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = "rgba(255, 232, 182, 0.38)";
          ctx.beginPath();
          ctx.roundRect(-6.6, -4.9, 4.5, 8.8, 1.8);
          ctx.fill();

          ctx.fillStyle = "#9e6a32";
          ctx.beginPath();
          ctx.roundRect(-8.4, -9.3, 16.8, 3.8, 1.8);
          ctx.fill();

          ctx.fillStyle = "#f2d367";
          ctx.beginPath();
          ctx.arc(0, -7.4, 4.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#cfb24e";
          ctx.beginPath();
          ctx.arc(1.6, -7.1, 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (t.type === "hose") {
          ctx.save();
          ctx.rotate(t.lastAimAngle || 0);

          const hoseGrad = ctx.createLinearGradient(0, -10, 0, 9);
          hoseGrad.addColorStop(0, "#7dc6e8");
          hoseGrad.addColorStop(0.6, "#4a9fc8");
          hoseGrad.addColorStop(1, "#2f7697");
          ctx.fillStyle = hoseGrad;
          ctx.strokeStyle = "#1f5673";
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.roundRect(-7.6, -10.2, 15.2, 18.8, 4.2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = "#85d6f2";
          ctx.beginPath();
          ctx.roundRect(-5.6, -3.8, 11.2, 5.8, 2.2);
          ctx.fill();

          ctx.fillStyle = "rgba(230, 251, 255, 0.34)";
          ctx.beginPath();
          ctx.roundRect(-5.1, -2.9, 10.1, 1.6, 0.8);
          ctx.fill();

          ctx.fillStyle = "#d8ecf5";
          ctx.beginPath();
          ctx.roundRect(-3.8, -15.1, 7.6, 5.2, 2.1);
          ctx.fill();
          ctx.strokeStyle = "#557583";
          ctx.stroke();

          ctx.fillStyle = "#2f424d";
          ctx.beginPath();
          ctx.arc(0, -12.2, 1.1, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = "#1f5673";
          ctx.lineWidth = 2.3;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(6.8, -0.4);
          ctx.lineTo(15.4, -0.4);
          ctx.stroke();

          ctx.fillStyle = "#2a7a9d";
          ctx.beginPath();
          ctx.moveTo(15.4, -2.8);
          ctx.lineTo(20.8, -0.4);
          ctx.lineTo(15.4, 2.0);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = "#153544";
          ctx.beginPath();
          ctx.roundRect(-6.4, 2.8, 12.8, 2.8, 1.2);
          ctx.fill();
          ctx.fillStyle = "#ebf8ff";
          ctx.font = "bold 3.4px Segoe UI";
          ctx.textAlign = "center";
          ctx.fillText("HOSE", 0, 5.1);

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
          }
          ctx.restore();
        } else {
          ctx.save();
          ctx.rotate(t.lastAimAngle || 0);

          const sprayGrad = ctx.createLinearGradient(0, -11, 0, 9);
          sprayGrad.addColorStop(0, "#ff8d8d");
          sprayGrad.addColorStop(0.58, "#ff5a5a");
          sprayGrad.addColorStop(1, "#b82f2f");
          ctx.fillStyle = sprayGrad;
          ctx.strokeStyle = "#7a2b2b";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(-7.2, -10.8, 14.4, 19.8, 4);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = "#ff7a7a";
          ctx.beginPath();
          ctx.roundRect(-6, -4.8, 12, 6.2, 2.5);
          ctx.fill();

          ctx.fillStyle = "rgba(255, 220, 220, 0.32)";
          ctx.beginPath();
          ctx.roundRect(-5.4, -4.1, 9.2, 1.5, 0.8);
          ctx.fill();

          ctx.fillStyle = "#efefef";
          ctx.beginPath();
          ctx.roundRect(-3.5, -16, 7, 5, 2);
          ctx.fill();
          ctx.strokeStyle = "#7a7a7a";
          ctx.stroke();

          ctx.fillStyle = "#fff4f4";
          ctx.font = "bold 3.9px Segoe UI";
          ctx.textAlign = "center";
          ctx.fillText("SPRAY", 0, -1.2);
          ctx.fillText("BUG", 0, 2.7);

          ctx.fillStyle = "#4a4a4a";
          ctx.beginPath();
          ctx.arc(0, -12.6, 1.2, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = "#6d7772";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(6.8, -0.8);
          ctx.lineTo(14.4, -0.8);
          ctx.stroke();

          ctx.fillStyle = "#5d6661";
          ctx.beginPath();
          ctx.moveTo(14.4, -2.4);
          ctx.lineTo(18.2, -0.8);
          ctx.lineTo(14.4, 0.8);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = "rgba(236, 255, 238, 0.85)";
          ctx.beginPath();
          ctx.arc(18.3, -7.6, 1.2, 0, Math.PI * 2);
          ctx.arc(20.9, -8.8, 0.95, 0, Math.PI * 2);
          ctx.arc(17.2, -5.3, 0.8, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#151515";
          ctx.beginPath();
          ctx.roundRect(-7.4, -6.4, 10.8, 7.6, 1.7);
          ctx.fill();
          ctx.strokeStyle = "#2d2d2d";
          ctx.lineWidth = 1.1;
          ctx.stroke();

          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 0.95;
          ctx.beginPath();
          ctx.moveTo(-5.6, -1.0);
          ctx.lineTo(-2.2, -3.4);
          ctx.moveTo(-5.6, -3.4);
          ctx.lineTo(-2.2, -1.0);
          ctx.moveTo(-2.0, -1.0);
          ctx.lineTo(1.6, -3.4);
          ctx.moveTo(-2.0, -3.4);
          ctx.lineTo(1.6, -1.0);
          ctx.stroke();

          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(-0.4, -4.4, 1.35, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#101010";
          ctx.beginPath();
          ctx.arc(-0.85, -4.6, 0.25, 0, Math.PI * 2);
          ctx.arc(0.05, -4.6, 0.25, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(-0.4, -3.8, 0.22, 0, Math.PI * 2);
          ctx.fill();

          if (t.sprayFlash > 0) {
            const alpha = 0.14 + (t.sprayFlash / 6) * 0.26;
            ctx.fillStyle = `rgba(255, 92, 92, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(18.3, -0.8);
            ctx.lineTo(31.5, -6.8);
            ctx.lineTo(31.5, 5.2);
            ctx.closePath();
            ctx.fill();
          }
          ctx.restore();
        }

        ctx.restore();

        const pedestalW = 24;
        const pedestalH = 14;
        const pedestalX = t.x - pedestalW / 2;
        const pedestalY = t.y + 15;

        const pedestalGrad = ctx.createLinearGradient(0, pedestalY, 0, pedestalY + pedestalH);
        pedestalGrad.addColorStop(0, "rgba(28, 36, 44, 0.95)");
        pedestalGrad.addColorStop(1, "rgba(11, 15, 19, 0.96)");
        ctx.fillStyle = pedestalGrad;
        ctx.strokeStyle = "#ffe072";
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.roundRect(pedestalX, pedestalY, pedestalW, pedestalH, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#ffe072";
        ctx.font = "700 12px Consolas, 'Courier New', monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillText(String(t.level), t.x, pedestalY + pedestalH / 2 + 0.5);
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
      ctx.strokeStyle = "#3e7a33";
      ctx.lineWidth = 1.7;
      ctx.fillStyle = "#88d65f";
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
      ctx.strokeStyle = "#6a4d2c";
      ctx.lineWidth = 1.6;
      ctx.fillStyle = "#b68a56";
      ctx.beginPath();
      ctx.ellipse(x - 1.2, y, 10.8, 5.8, 0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "rgba(215, 189, 147, 0.82)";
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
        { ox: -9.2, r: 3.4, c: "#75bf59" },
        { ox: -5.2, r: 4, c: "#6ab152" },
        { ox: -1.2, r: 4.4, c: "#75bf59" },
        { ox: 2.8, r: 4.2, c: "#6ab152" },
        { ox: 6.8, r: 4, c: "#75bf59" }
      ];
      ctx.strokeStyle = "#2e5b25";
      ctx.lineWidth = 1.2;
      for (const s of segments) {
        ctx.fillStyle = s.c;
        ctx.beginPath();
        ctx.arc(x + s.ox, y, s.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.fillStyle = "#4d9340";
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

    function getEnemyStyle(type) {
      if (type === "aphid") return { hp: "#7edb67", icon: "#55b942" };
      if (type === "mantis") return { hp: "#9dfc8a", icon: "#71cf5d" };
      if (type === "locust") return { hp: "#d8b181", icon: "#bf915e" };
      if (type === "ladybug") return { hp: "#ff8f8f", icon: "#de5656" };
      if (type === "gatecrasher") return { hp: "#ffb170", icon: "#d8702f" };
      return { hp: "#a6e08b", icon: "#6dbb58" };
    }

    function getEnemyLabel(type) {
      if (type === "aphid") return "APHID";
      if (type === "mantis") return "MANTIS";
      if (type === "locust") return "LOCUST";
      if (type === "ladybug") return "LADYBUG";
      if (type === "caterpillar") return "CATERPILLAR";
      if (type === "gatecrasher") return "GATE CRASHER";
      return "BUG";
    }

    function drawEnemyTypeBadge(type, x, y, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 4.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(20, 20, 20, 0.85)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.save();
      ctx.translate(x, y);
      ctx.strokeStyle = "#ffffff";
      ctx.fillStyle = "#ffffff";
      ctx.lineWidth = 0.9;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (type === "aphid") {
        ctx.beginPath();
        ctx.ellipse(0, 0, 1.9, 1.5, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(2.3, -0.2, 0.9, 0, Math.PI * 2);
        ctx.stroke();
      } else if (type === "mantis") {
        ctx.beginPath();
        ctx.moveTo(-2.2, 1.6);
        ctx.lineTo(0.2, -1.8);
        ctx.lineTo(2.2, 1.6);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0.2, -1.8);
        ctx.lineTo(0.2, 2);
        ctx.stroke();
      } else if (type === "locust") {
        ctx.beginPath();
        ctx.ellipse(-0.4, -0.1, 2.1, 1.2, -0.25, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0.6, 0.6);
        ctx.lineTo(2.6, 2.3);
        ctx.stroke();
      } else if (type === "ladybug") {
        ctx.beginPath();
        ctx.arc(0, 0.1, 2.1, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, -2.1);
        ctx.lineTo(0, 2.1);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(-0.9, 0, 0.36, 0, Math.PI * 2);
        ctx.arc(1, 0, 0.36, 0, Math.PI * 2);
        ctx.fill();
      } else {
        if (type === "gatecrasher") {
          ctx.beginPath();
          ctx.ellipse(0, 0, 2.3, 1.4, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(0.4, 0.8);
          ctx.lineTo(2.6, 2.3);
          ctx.stroke();
        } else {
          ctx.beginPath();
          for (let i = -2; i <= 2; i++) {
            ctx.arc(i * 0.85, 0, 0.72, 0, Math.PI * 2);
          }
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    function drawEnemies() {
      for (const e of enemies) {
        if (e.enemyType === "aphid") drawAphid(e);
        else if (e.enemyType === "mantis") drawMantis(e);
        else if (e.enemyType === "locust") drawLocust(e);
        else if (e.enemyType === "ladybug") drawLadybug(e);
        else if (e.enemyType === "caterpillar") drawCaterpillar(e);
        else drawGateCrasher(e);

        const style = getEnemyStyle(e.enemyType);
        const sizeMul = e.sizeMul || 1;
        const barWidth = Math.max(26, Math.round(26 * sizeMul));
        const pct = Math.max(0, e.hp / e.maxHp);
        const barX = e.x - barWidth / 2;
        const barY = e.y - 21 - (sizeMul - 1) * 8;

        const panelW = barWidth + 30;
        const panelX = e.x - panelW / 2 + 8;
        const panelY = barY - 11;
        ctx.fillStyle = "rgba(8, 12, 20, 0.58)";
        ctx.fillRect(panelX, panelY, panelW, 9);
        ctx.strokeStyle = "rgba(208, 223, 255, 0.28)";
        ctx.lineWidth = 0.8;
        ctx.strokeRect(panelX, panelY, panelW, 9);

        ctx.fillStyle = "rgba(0, 0, 0, 0.52)";
        ctx.fillRect(barX - 1.2, barY - 1.2, barWidth + 2.4, 6.4);

        ctx.fillStyle = "#1d1d1d";
        ctx.fillRect(barX, barY, barWidth, 4.2);
        ctx.fillStyle = style.hp;
        ctx.fillRect(barX, barY, barWidth * pct, 4.2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.24)";
        ctx.fillRect(barX, barY, barWidth * pct, 1);

        drawEnemyTypeBadge(e.enemyType, e.x - (15 + (sizeMul - 1) * 5), e.y - 18 - (sizeMul - 1) * 8, style.icon);

        ctx.fillStyle = "rgba(231, 239, 255, 0.92)";
        ctx.font = "700 8px Segoe UI";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        const hpNow = Math.max(0, Math.ceil(e.hp));
        ctx.fillText(`${getEnemyLabel(e.enemyType)}  ${hpNow}`, panelX + 3, panelY + 4.7);
      }
    }

    function drawBullets() {
      for (const b of bullets) {
        const core = b.radius || 4;
        const lifeAlpha = Math.max(0.24, Math.min(0.58, (b.life || 12) / 30));

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
      ctx.fillText(`You reached wave ${wave}.`, canvas.width / 2, canvas.height / 2 + 28);
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
      drawTowers();
      drawImplosions();
      drawEnemies();
      drawBullets();
      drawGameOver();
      drawLevelComplete();
    }

    function gameLoop() {
      updateSimulation();
      render();
      requestAnimationFrame(gameLoop);
    }

    canvas.addEventListener("click", (e) => {
      if (!gameStarted) return;
      const pos = getCanvasCoords(e);
      const { x, y } = normalizePlacement(pos.x, pos.y);
      const existing = findTowerAt(x, y);
      if (existing) {
        selectedTowerId = existing.id;
        existing.showRangeUntil = frameCount + 220;
        setStatus(`${getTowerDisplayName(existing.type)} selected.`, "warn");
        syncHUD();
        return;
      }
      selectedTowerId = null;
      placeTower(x, y);
    });

    canvas.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      if (!gameStarted) return;
      const { x, y } = getCanvasCoords(e);
      upgradeTowerAt(x, y);
    });

    startBtn.addEventListener("click", startWave);
    nextLevelBtn.addEventListener("click", goToNextLevel);
    resetBtn.addEventListener("click", resetGame);
    minimalHudBtn.addEventListener("click", toggleMinimalHud);
    sprayTowerBtn.addEventListener("click", () => setSelectedTowerType("spray"));
    glueTowerBtn.addEventListener("click", () => setSelectedTowerType("glue"));
    hoseTowerBtn.addEventListener("click", () => setSelectedTowerType("hose"));
    targetModeBtn.addEventListener("click", toggleTargetMode);
    difficultySelect.addEventListener("change", () => {
      difficultyKey = difficultySelect.value;
      resetGame(true);
      setStatus(`Difficulty set to ${getDifficultyProfile().label}.`, "warn");
    });
    levelSelect.addEventListener("change", () => {
      levelNumber = Number(levelSelect.value) || 1;
      resetGame(true);
      setStatus(`Level ${levelNumber} selected: ${getCurrentLevelConfig().name}.`, "warn");
    });
    instructionsBtn.addEventListener("click", () => {
      window.open("./instructions.html", "_blank");
    });
    landingStartBtn.addEventListener("click", startNewGameFromLanding);
    landingContinueBtn.addEventListener("click", continueCampaignFromLanding);
    landingHowToBtn.addEventListener("click", () => {
      window.open("./instructions.html", "_blank");
    });
    upgradeSelectedBtn.addEventListener("click", () => {
      if (gameOver || levelComplete) return;
      const selected = towers.find(t => t.id === selectedTowerId);
      upgradeTower(selected);
    });
    sellSelectedBtn.addEventListener("click", () => {
      if (gameOver || levelComplete) return;
      sellTowerById(selectedTowerId);
    });
    towerTargetSelect.addEventListener("change", () => {
      const selected = towers.find(t => t.id === selectedTowerId);
      if (!selected) return;
      selected.targetMode = towerTargetSelect.value;
      setStatus(`${getTowerDisplayName(selected.type)} target set to ${towerTargetSelect.value === "closest" ? "Closest" : "Garden"}.`, "warn");
      syncHUD();
    });
    submitScoreBtn.addEventListener("click", submitHighscore);
    scoreNameInputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") submitHighscore();
    });
    document.addEventListener("keydown", handleTowerHotkeys);
    document.addEventListener("mousemove", markUiInteraction, { passive: true });
    document.addEventListener("mousedown", markUiInteraction, { passive: true });
    document.addEventListener("touchstart", markUiInteraction, { passive: true });
    document.addEventListener("keydown", markUiInteraction);

    loadHighscores();
    loadCompletedLevels();
    levelNumber = Number(levelSelect.value) || 1;
    populateLevelSelect();
    populateLandingLevelSelect();
    difficultyKey = difficultySelect.value || "normal";
    gameStarted = false;
    minimalHud = false;
    if (shellEl) shellEl.classList.add("paused");
    resetGame();
    gameLoop();

