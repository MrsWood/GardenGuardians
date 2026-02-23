// Shared simulation helpers extracted from game.js (Step 1B modular refactor).
(function () {
  function computeWaveSpawnPlan(input) {
    const wave = Number(input?.wave) || 1;
    const lvl = input?.lvl || {};
    const profile = input?.profile || {};
    const waveBalance = input?.waveBalance || {};
    const currentWaveHasBoss = !!input?.currentWaveHasBoss;

    const levelWaveMul = Number.isFinite(lvl.waveCountMul) ? lvl.waveCountMul : 1;
    const levelHpMul = Number.isFinite(lvl.enemyHpMul) ? lvl.enemyHpMul : 1;
    const levelSpeedMul = Number.isFinite(lvl.enemySpeedMul) ? lvl.enemySpeedMul : 1;
    const levelSpawnMul = Number.isFinite(lvl.spawnDelayMul) ? lvl.spawnDelayMul : 1;
    const levelRewardMul = Number.isFinite(lvl.enemyRewardMul) ? lvl.enemyRewardMul : 1;

    const baseTotal = currentWaveHasBoss
      ? Math.max(7, Math.floor(waveBalance.bossBaseCount + wave * waveBalance.bossCountPerWave))
      : waveBalance.regularBaseCount + Math.ceil(wave * waveBalance.regularCountPerWave);
    const total = Math.max(6, Math.round(baseTotal * profile.waveCountMul * levelWaveMul));

    const hpBase = waveBalance.hpBase + wave * waveBalance.hpPerWave + Math.pow(wave, waveBalance.hpCurvePow);
    const speedBase = waveBalance.speedBase
      + wave * waveBalance.speedPerWave
      + Math.min(waveBalance.speedCurveCap, wave * waveBalance.speedCurvePerWave);
    const rewardBase = waveBalance.rewardBase + wave * waveBalance.rewardPerWave;
    const spawnBase = Math.max(waveBalance.spawnPreMulFloor, waveBalance.spawnBase - wave * waveBalance.spawnDropPerWave);

    const hp = Math.round(hpBase * profile.hpMul * levelHpMul);
    const speed = speedBase * profile.speedMul * levelSpeedMul;
    const reward = Math.max(1, Math.round(rewardBase * profile.rewardMul * levelRewardMul));
    const spawnDelay = Math.max(waveBalance.spawnFinalFloor, Math.round(spawnBase * profile.spawnDelayMul * levelSpawnMul));

    return { total, hp, speed, reward, spawnDelay };
  }

  function createEnemyEntity(input) {
    const enemyType = input?.enemyType;
    const waveLaneId = input?.waveLaneId;
    const hp = Number(input?.hp) || 1;
    const speed = Number(input?.speed) || 0;
    const reward = Number(input?.reward) || 1;
    const finalWaveBoost = !!input?.finalWaveBoost;
    const profile = input?.profile || {};
    const enemyRoleStats = input?.enemyRoleStats || {};
    const spawnPoint = input?.spawnPoint || { x: 0, y: 0 };
    const id = Number(input?.id) || 1;

    const stats = enemyRoleStats[enemyType] || enemyRoleStats.aphid || {};
    let hpScaled = Math.round(hp * (Number.isFinite(stats.hpMul) ? stats.hpMul : 1));
    let armor = Number.isFinite(stats.armor) ? stats.armor : 0;
    let glueResist = Number.isFinite(stats.glueResist) ? stats.glueResist : 0;
    let sizeMul = Number.isFinite(stats.sizeMul) ? stats.sizeMul : 1;
    let jamRadius = Number.isFinite(stats.jamRadius) ? stats.jamRadius : 0;
    let jamFireDelayMul = Number.isFinite(stats.jamFireDelayMul) ? stats.jamFireDelayMul : 1;
    let strengthMul = 1;

    if (enemyType === "gatecrasher") {
      hpScaled = Math.round(hpScaled * (Number.isFinite(profile.bossHpMul) ? profile.bossHpMul : 1));
      armor = Math.max(0, Math.min(0.8, armor + (Number.isFinite(profile.bossArmorAdd) ? profile.bossArmorAdd : 0)));
      glueResist = Math.max(0, Math.min(0.9, glueResist + (Number.isFinite(profile.bossGlueResistAdd) ? profile.bossGlueResistAdd : 0)));
    }
    if (finalWaveBoost) {
      hpScaled = Math.round(hpScaled * 2);
      armor = Math.max(0, Math.min(0.85, armor + 0.08));
      sizeMul *= 1.45;
      strengthMul = 2;
    }

    return {
      id,
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
      speed: speed * (Number.isFinite(stats.speedMul) ? stats.speedMul : 1),
      reward: Math.max(1, Math.round(reward * (Number.isFinite(stats.rewardMul) ? stats.rewardMul : 1))),
      glueResist,
      armor,
      jamRadius,
      jamFireDelayMul,
      sizeMul,
      strengthMul,
      role: stats.role || "",
      hitFlash: 0,
      hitColor: "rgba(255, 224, 224, 0.9)",
      hitType: "spray",
      slowFlash: 0,
      slowStatusTimer: 0,
      jamStatusTimer: 0
    };
  }

  function pickTargetByProgress(tower, enemies) {
    let best = null;
    let bestScore = -Infinity;
    if (!tower || !Array.isArray(enemies)) return null;
    const rangeSq = tower.range * tower.range;
    for (const e of enemies) {
      const dx = e.x - tower.x;
      const dy = e.y - tower.y;
      const dSq = dx * dx + dy * dy;
      if (dSq > rangeSq) continue;
      const score = e.progress;
      if (!best || score > bestScore) {
        best = e;
        bestScore = score;
      }
    }
    return best;
  }

  function getHitFeedbackColor(sourceType) {
    if (sourceType === "hose") return "rgba(90, 190, 255, 0.95)";
    if (sourceType === "glue") return "rgba(247, 193, 94, 0.92)";
    if (sourceType === "salt") return "rgba(232, 239, 250, 0.95)";
    return "rgba(255, 116, 116, 0.92)";
  }

  window.GG_SIM = {
    ...(window.GG_SIM || {}),
    computeWaveSpawnPlan,
    createEnemyEntity,
    pickTargetByProgress,
    getHitFeedbackColor
  };
})();
