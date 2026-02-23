// Combat helpers extracted from game.js (Step 1C modular refactor).
(function () {
  function spawnImpactBurst(impactBursts, options) {
    if (!Array.isArray(impactBursts)) return;
    const x = Number(options?.x) || 0;
    const y = Number(options?.y) || 0;
    const color = options?.color || "rgba(255, 224, 224, 0.9)";
    const count = Number(options?.count) || 6;
    const spread = Number(options?.spread) || 0.8;
    const speedBase = Number(options?.speedBase) || 0.8;
    const sizeBase = Number(options?.sizeBase) || 1.8;
    const lifeBase = Number(options?.lifeBase) || 11;
    const cap = Number.isFinite(options?.cap) ? Number(options.cap) : 700;

    const n = Math.max(3, Math.min(16, Math.round(count)));
    for (let i = 0; i < n; i += 1) {
      const a = Math.random() * Math.PI * 2;
      const speed = speedBase + Math.random() * spread;
      impactBursts.push({
        x,
        y,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed,
        life: lifeBase + Math.floor(Math.random() * 4),
        maxLife: lifeBase + 3,
        size: sizeBase + Math.random() * 1.6,
        color
      });
    }
    if (impactBursts.length > cap) {
      impactBursts.splice(0, impactBursts.length - cap);
    }
  }

  function applyEnemyDamage(input) {
    const enemy = input?.enemy;
    const damage = Number(input?.damage) || 0;
    const sourceType = input?.sourceType || "spray";
    const getHitFeedbackColor = input?.getHitFeedbackColor;
    const impactBursts = input?.impactBursts;
    const onDamageDealt = input?.onDamageDealt;
    const onBossHit = input?.onBossHit;

    if (!enemy) return 0;
    const armor = enemy.armor || 0;
    const dealt = Math.max(0, damage * (1 - armor));
    if (dealt <= 0) return 0;

    enemy.hp -= dealt;
    enemy.hitFlash = Math.max(enemy.hitFlash || 0, 8);
    enemy.hitColor = typeof getHitFeedbackColor === "function"
      ? getHitFeedbackColor(sourceType)
      : "rgba(255, 116, 116, 0.92)";
    enemy.hitType = sourceType;

    spawnImpactBurst(impactBursts, {
      x: enemy.x,
      y: enemy.y,
      color: enemy.hitColor,
      count: sourceType === "hose" ? 6 : 8,
      spread: 0.8,
      speedBase: 0.8,
      sizeBase: 1.8,
      lifeBase: 11,
      cap: 700
    });

    if (typeof onDamageDealt === "function") onDamageDealt(dealt, enemy, sourceType);
    if (enemy.enemyType === "gatecrasher" && typeof onBossHit === "function") onBossHit(enemy, sourceType);

    return dealt;
  }

  function resolveProjectileHits(input) {
    const bullets = input?.bullets;
    const enemies = input?.enemies;
    const enemyRadius = Number(input?.enemyRadius) || 0;
    const canvasWidth = Number(input?.canvasWidth) || 0;
    const canvasHeight = Number(input?.canvasHeight) || 0;
    const applyEnemyDamageFn = input?.applyEnemyDamageFn;
    const removeEnemyAtIndex = input?.removeEnemyAtIndex;

    if (!Array.isArray(bullets) || !Array.isArray(enemies)) return;
    if (typeof applyEnemyDamageFn !== "function" || typeof removeEnemyAtIndex !== "function") return;

    for (let i = bullets.length - 1; i >= 0; i -= 1) {
      const b = bullets[i];
      b.px = b.x;
      b.py = b.y;
      b.x += b.vx;
      b.y += b.vy;
      b.life -= 1;

      let hitEnemyIdx = -1;
      for (let ei = enemies.length - 1; ei >= 0; ei -= 1) {
        const e = enemies[ei];
        const hitRadius = enemyRadius * (e.sizeMul || 1);
        const dx = e.x - b.x;
        const dy = e.y - b.y;
        const hitDist = hitRadius + b.radius;
        if (dx * dx + dy * dy <= hitDist * hitDist) {
          hitEnemyIdx = ei;
          break;
        }
      }

      if (hitEnemyIdx >= 0) {
        const hitEnemy = enemies[hitEnemyIdx];
        applyEnemyDamageFn(hitEnemy, b.damage, b.kind === "salt" ? "salt" : "spray");
        bullets.splice(i, 1);
        if (hitEnemy.hp <= 0) {
          removeEnemyAtIndex(hitEnemyIdx, true);
        }
        continue;
      }

      if (b.life <= 0 || b.x < -20 || b.x > canvasWidth + 20 || b.y < -20 || b.y > canvasHeight + 20) {
        bullets.splice(i, 1);
      }
    }
  }

  window.GG_COMBAT = {
    ...(window.GG_COMBAT || {}),
    spawnImpactBurst,
    applyEnemyDamage,
    resolveProjectileHits
  };
})();
