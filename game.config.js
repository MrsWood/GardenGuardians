// Extracted shared game configuration (Step 1A modular refactor).
(function () {
  const existing = (typeof window !== "undefined" && window.GG_CONFIGS) ? window.GG_CONFIGS : {};

    const allowDirectLevelSelect = false;
    const defaultThemeId = "garden_guard";
    const themePacks = {
      garden_guard: {
        id: "garden_guard",
        name: "Garden Guard",
        description: "Baseline campaign theme with garden, prairie, desert, winter, and topiary levels.",
        levelOrder: [1, 2, 3, 4, 5, 6],
        availableTerrains: ["lawn", "prairie", "desert", "snow"],
        availableFlowerThemes: ["mixed", "susan", "cactus", "sunflower", "christmas", "topiary"]
      }
    };
    const levelConfigs = {
      1: {
        name: "Garden Lawn",
        waves: 10,
        terrain: "lawn",
        flowerTheme: "mixed",
        mergeGate: false,
        waveCountMul: 0.95,
        enemyHpMul: 0.92,
        enemySpeedMul: 0.94,
        spawnDelayMul: 1.05,
        enemyRewardMul: 1.02,
        clearBonusMul: 1.06,
        bossEvery: 6,
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
        waveCountMul: 1,
        enemyHpMul: 1,
        enemySpeedMul: 1,
        spawnDelayMul: 1,
        enemyRewardMul: 1.03,
        clearBonusMul: 1.03,
        bossEvery: 5,
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
        waveCountMul: 1.08,
        enemyHpMul: 1.1,
        enemySpeedMul: 1.08,
        spawnDelayMul: 0.92,
        enemyRewardMul: 1.06,
        clearBonusMul: 1.06,
        bossEvery: 5,
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
        waves: 16,
        terrain: "prairie",
        flowerTheme: "sunflower",
        mergeGate: false,
        waveCountMul: 1.18,
        enemyHpMul: 1.2,
        enemySpeedMul: 1.14,
        spawnDelayMul: 0.84,
        enemyRewardMul: 1.1,
        clearBonusMul: 1.1,
        bossEvery: 4,
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
        waves: 18,
        terrain: "snow",
        flowerTheme: "christmas",
        mergeGate: false,
        waveCountMul: 1.25,
        enemyHpMul: 1.28,
        enemySpeedMul: 1.16,
        spawnDelayMul: 0.8,
        enemyRewardMul: 1.15,
        clearBonusMul: 1.14,
        bossEvery: 4,
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
        waves: 20,
        terrain: "lawn",
        flowerTheme: "topiary",
        mergeGate: true,
        waveCountMul: 1.34,
        enemyHpMul: 1.36,
        enemySpeedMul: 1.18,
        spawnDelayMul: 0.74,
        enemyRewardMul: 1.2,
        clearBonusMul: 1.2,
        bossEvery: 3,
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

    const enemyTypes = ["aphid", "mantis", "locust", "ladybug", "caterpillar"];

    const waveBalance = {
      regularBaseCount: 7,
      regularCountPerWave: 1.75,
      bossBaseCount: 5,
      bossCountPerWave: 1.05,
      hpBase: 28,
      hpPerWave: 6,
      hpCurvePow: 1.18,
      speedBase: 0.88,
      speedPerWave: 0.055,
      speedCurvePerWave: 0.012,
      speedCurveCap: 0.35,
      rewardBase: 7,
      rewardPerWave: 1.75,
      spawnBase: 820,
      spawnDropPerWave: 25,
      spawnPreMulFloor: 300,
      spawnFinalFloor: 230,
      clearBonusBase: 8,
      clearBonusPerWave: 1.8,
      clearBonusBossAdd: 6,
      clearBonusVegPenalty: 4,
      clearBonusFlawless: 5,
      reserveBonusRate: 0.045,
      reserveBonusCap: 14
    };

    const towerCosts = {
      spray: 25,
      glue: 35,
      hose: 55,
      salt: 60
    };

    const towerDetails = {
      spray: { name: "Sprayer", desc: "Fan spray aerosol damage." },
      glue: { name: "Glue Pot", desc: "Throws sticky traps that slow bugs." },
      hose: { name: "Hosepipe", desc: "High-pressure water beam that pierces through bugs in its path." },
      salt: { name: "Salt Cannon", desc: "Focused salt shots for strong single-target damage." }
    };
    const difficultyProfiles = {
      easy: {
        label: "Easy",
        startMoney: 140,
        waveCountMul: 0.84,
        hpMul: 0.8,
        speedMul: 0.86,
        rewardMul: 1.2,
        spawnDelayMul: 1.22,
        bossEvery: 7,
        bossHpMul: 0.74,
        bossArmorAdd: -0.08,
        bossGlueResistAdd: -0.16,
        clearBonusMul: 1.12,
        upgradeCostMul: 0.92,
        bunnyCooldownBase: 480,
        bunnyCooldownJitter: 280
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
        bossGlueResistAdd: 0,
        clearBonusMul: 1,
        upgradeCostMul: 1,
        bunnyCooldownBase: 360,
        bunnyCooldownJitter: 240
      },
      hard: {
        label: "Hard",
        startMoney: 78,
        waveCountMul: 1.2,
        hpMul: 1.24,
        speedMul: 1.15,
        rewardMul: 0.9,
        spawnDelayMul: 0.84,
        bossEvery: 3,
        bossHpMul: 1.34,
        bossArmorAdd: 0.12,
        bossGlueResistAdd: 0.14,
        clearBonusMul: 0.9,
        upgradeCostMul: 1.1,
        bunnyCooldownBase: 280,
        bunnyCooldownJitter: 180
      }
    };

    const enemyRoleStats = {
      aphid: { hpMul: 0.8, speedMul: 1.26, rewardMul: 0.92, glueResist: 0.07, armor: 0, role: "Scout" },
      mantis: { hpMul: 1.04, speedMul: 1.02, rewardMul: 1.12, glueResist: 0.16, armor: 0.04, role: "Jammer", jamRadius: 96, jamFireDelayMul: 1.45 },
      locust: { hpMul: 0.72, speedMul: 1.48, rewardMul: 0.9, glueResist: 0.12, armor: 0.01, role: "Runner" },
      ladybug: { hpMul: 1.36, speedMul: 0.84, rewardMul: 1.28, glueResist: 0.24, armor: 0.11, role: "Tank" },
      caterpillar: { hpMul: 1.6, speedMul: 0.72, rewardMul: 1.26, glueResist: 0.42, armor: 0.15, role: "Blocker" },
      gatecrasher: { hpMul: 3.6, speedMul: 0.78, rewardMul: 3.8, glueResist: 0.5, armor: 0.18, role: "Boss", sizeMul: 1.9 }
    };


  window.GG_CONFIGS = {
    ...existing,
    allowDirectLevelSelect,
    defaultThemeId,
    themePacks,
    levelConfigs,
    enemyTypes,
    waveBalance,
    towerCosts,
    towerDetails,
    difficultyProfiles,
    enemyRoleStats
  };
})();

