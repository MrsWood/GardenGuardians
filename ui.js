(function attachUiModule(global) {
  "use strict";

  const TOWER_DESCRIPTORS = {
    spray: { name: "Sprayer", hotkey: "1" },
    glue: { name: "Glue Pot", hotkey: "2" },
    hose: { name: "Hosepipe", hotkey: "3" },
    salt: { name: "Salt Cannon", hotkey: "4" }
  };

  function getTowerDescriptor(type) {
    return TOWER_DESCRIPTORS[type] || TOWER_DESCRIPTORS.spray;
  }

  function computeTowerAffordability(args) {
    const type = args && args.type ? args.type : "spray";
    const cost = Number.isFinite(args && args.cost) ? args.cost : 0;
    const money = Number.isFinite(args && args.money) ? args.money : 0;
    const descriptor = getTowerDescriptor(type);
    const canAfford = money >= cost;
    const missing = Math.max(0, cost - money);
    const baseLabel = `${descriptor.name} ($${cost}) [${descriptor.hotkey}]`;
    return {
      canAfford,
      missing,
      label: canAfford ? baseLabel : `${baseLabel} - Need $${missing} more`
    };
  }

  function computeWaveBanner(args) {
    const gameOver = !!(args && args.gameOver);
    const levelComplete = !!(args && args.levelComplete);
    const currentWaveFinalBoost = !!(args && args.currentWaveFinalBoost);
    const currentWaveHasBoss = !!(args && args.currentWaveHasBoss);
    const wave = Number.isFinite(args && args.wave) ? args.wave : 0;

    if (gameOver) return { state: "normal", tag: "Over" };
    if (levelComplete) return { state: "complete", tag: "Complete" };
    if (currentWaveFinalBoost) return { state: "final", tag: "Final" };
    if (currentWaveHasBoss) return { state: "boss", tag: "Boss" };
    if (wave <= 0) return { state: "normal", tag: "Ready" };
    return { state: "normal", tag: "Active" };
  }

  function computeFlawlessChip(args) {
    const now = Number.isFinite(args && args.now) ? args.now : Date.now();
    const celebrateUntil = Number.isFinite(args && args.celebrateUntil) ? args.celebrateUntil : 0;
    const celebrateAmount = Number.isFinite(args && args.celebrateAmount) ? args.celebrateAmount : 0;
    const activeWave = !!(args && args.activeWave);
    const waveVegLost = Number.isFinite(args && args.waveVegLost) ? args.waveVegLost : 0;
    const wave = Number.isFinite(args && args.wave) ? args.wave : 0;

    let state = "ready";
    let text = wave > 0 ? "Next Wave" : "Flawless";
    if (now < celebrateUntil && celebrateAmount > 0) {
      state = "earned";
      text = `+$${celebrateAmount}`;
    } else if (activeWave && waveVegLost === 0) {
      state = "ontrack";
      text = "On Track";
    } else if (activeWave && waveVegLost > 0) {
      state = "lost";
      text = "Lost";
    }
    return { state, text };
  }

  function computeWaveControls(args) {
    const now = Number.isFinite(args && args.now) ? args.now : Date.now();
    const gameOver = !!(args && args.gameOver);
    const levelComplete = !!(args && args.levelComplete);
    const nextLevelPending = Number.isFinite(args && args.nextLevelPending) ? args.nextLevelPending : 0;
    const nextIsBoss = !!(args && args.nextIsBoss);
    const canSpawnNextWave = !!(args && args.canSpawnNextWave);
    const currentWaveFinalBoost = !!(args && args.currentWaveFinalBoost);
    const currentWaveHasBoss = !!(args && args.currentWaveHasBoss);
    const currentWaveEarlyStart = !!(args && args.currentWaveEarlyStart);
    const levelNumber = Number.isFinite(args && args.levelNumber) ? args.levelNumber : 1;
    const autoWaveActive = !!(args && args.autoWaveActive);
    const autoWaveDueAt = Number.isFinite(args && args.autoWaveDueAt) ? args.autoWaveDueAt : 0;

    if (autoWaveActive && autoWaveDueAt > 0 && !gameOver) {
      const remainingMs = Math.max(0, autoWaveDueAt - now);
      const sec = Math.max(1, Math.ceil(remainingMs / 1000));
      return {
        nextWaveText: nextIsBoss ? `Next: ${sec}s (Boss, +25% early)` : `Next: ${sec}s (+25% early)`,
        bonusText: "Bonus: +25% if started early",
        startState: nextIsBoss ? "boss" : "early",
        startGlyph: nextIsBoss ? "BOSS" : "+25",
        startMain: nextIsBoss ? `Boss in ${sec}s (+25%)` : `Start in ${sec}s (+25%)`
      };
    }

    let nextWaveText;
    if (gameOver) nextWaveText = "Next: --";
    else if (levelComplete && nextLevelPending) nextWaveText = `Next: Level ${nextLevelPending} Ready`;
    else if (levelComplete) nextWaveText = `Level ${levelNumber} Complete`;
    else if (!canSpawnNextWave) nextWaveText = "Next: Final Cleared";
    else nextWaveText = nextIsBoss ? "Next: Ready (Boss)" : "Next: Ready";

    let bonusText;
    if (levelComplete && nextLevelPending) {
      bonusText = `Level ${nextLevelPending} Unlocked`;
    } else if (levelComplete) {
      bonusText = "Level Complete";
    } else if (currentWaveFinalBoost) {
      bonusText = "Final boost active";
    } else if (currentWaveHasBoss) {
      bonusText = currentWaveEarlyStart ? "Boss +25% active" : "Boss wave active";
    } else {
      bonusText = currentWaveEarlyStart ? "+25% active this wave" : "Bonus: none";
    }

    if (gameOver) {
      return {
        nextWaveText,
        bonusText,
        startState: "locked",
        startGlyph: "END",
        startMain: "Game Over"
      };
    }
    if (levelComplete && nextLevelPending) {
      return {
        nextWaveText,
        bonusText,
        startState: "complete",
        startGlyph: "NEXT",
        startMain: `Start Level ${nextLevelPending}`
      };
    }
    if (levelComplete) {
      return {
        nextWaveText,
        bonusText,
        startState: "complete",
        startGlyph: "DONE",
        startMain: "Level Complete"
      };
    }
    if (currentWaveHasBoss) {
      return {
        nextWaveText,
        bonusText,
        startState: "boss",
        startGlyph: "BOSS",
        startMain: "Start Boss Wave"
      };
    }
    return {
      nextWaveText,
      bonusText,
      startState: "ready",
      startGlyph: "GO",
      startMain: "Start Wave"
    };
  }

  global.GG_UI = {
    computeTowerAffordability,
    computeWaveBanner,
    computeFlawlessChip,
    computeWaveControls
  };
})(window);
