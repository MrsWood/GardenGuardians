(function attachRenderingModule(global) {
  "use strict";

  const TOWER_DOCK_DEFINITIONS = [
    { type: "hose", iconClass: "towerIcon hoseIcon towerDockArt", name: "Hosepipe", hotkey: 3, role: "Beam lane control" },
    { type: "glue", iconClass: "towerIcon glueIcon towerDockArt", name: "Glue Pot", hotkey: 2, role: "Area slow trap" },
    { type: "spray", iconClass: "towerIcon sprayIcon towerDockArt", name: "Sprayer", hotkey: 1, role: "Fan damage" },
    { type: "salt", iconClass: "saltPreview", name: "Salt Cannon", hotkey: 4, role: "Heavy single target", extraClass: "towerDockSalt" }
  ];

  function getTowerDockDefinitions() {
    return TOWER_DOCK_DEFINITIONS.map((def) => ({ ...def }));
  }

  function getTowerArtSources(versionTag) {
    const version = (typeof versionTag === "string" && versionTag.trim()) ? versionTag.trim() : "20260222e";
    return {
      spray: `./assets/bug_sprayer_game_clean.png?v=${version}`,
      glue: `./assets/glue_trap_game_clean.png?v=${version}`,
      hose: `./assets/water_hose_game_clean.png?v=${version}`,
      salt: `./assets/cannon_game_clean.png?v=${version}`
    };
  }

  function shouldUseImportedTowerArt(type) {
    const useImportedTowerArtByType = {
      spray: false,
      glue: false,
      hose: false,
      salt: true
    };
    return !!useImportedTowerArtByType[type];
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
    if (type === "aphid") return "Aphid";
    if (type === "mantis") return "Praying Mantis";
    if (type === "locust") return "Locust";
    if (type === "ladybug") return "Ladybug";
    if (type === "caterpillar") return "Caterpillar";
    if (type === "gatecrasher") return "Gate Crasher";
    return "Bug";
  }

  function getPrimaryRoleChip(enemy) {
    if (enemy.enemyType === "gatecrasher" || enemy.role === "Boss") return { t: "boss", c: "#d39a31" };
    if (enemy.role === "Scout") return { t: "scout", c: "#6dbb58" };
    if (enemy.role === "Runner") return { t: "runner", c: "#3c8fe6" };
    if (enemy.role === "Jammer") return { t: "jammer", c: "#7d78eb" };
    if (enemy.role === "Blocker") return { t: "blocker", c: "#607484" };
    if (enemy.role === "Tank") return { t: "tank", c: "#de5656" };
    return null;
  }

  function getEnemyOverlayLayout(enemy) {
    const sizeMul = Number.isFinite(enemy.sizeMul) ? enemy.sizeMul : 1;
    const hp = Number.isFinite(enemy.hp) ? enemy.hp : 0;
    const maxHp = Math.max(1, Number.isFinite(enemy.maxHp) ? enemy.maxHp : 1);
    const barWidth = Math.max(26, Math.round(26 * sizeMul));
    const pct = Math.max(0, Math.min(1, hp / maxHp));
    const roleOffsetX = 12 + (sizeMul - 1) * 6;
    const roleOffsetY = 12 + (sizeMul - 1) * 7;

    return {
      sizeMul,
      barWidth,
      hpPct: pct,
      barX: enemy.x - barWidth / 2,
      barY: enemy.y - 21 - (sizeMul - 1) * 8,
      roleX: enemy.x + roleOffsetX,
      roleY: enemy.y - roleOffsetY,
      slowX: enemy.x - roleOffsetX,
      slowY: enemy.y - roleOffsetY,
      jamX: enemy.x - (24 + (sizeMul - 1) * 8),
      jamY: enemy.y - roleOffsetY
    };
  }

  function drawEnemyStatusChip(drawCtx, x, y, kind, fill, stroke = "rgba(10, 14, 22, 0.95)", size = 4.1) {
    drawCtx.fillStyle = fill;
    drawCtx.beginPath();
    drawCtx.arc(x, y, size, 0, Math.PI * 2);
    drawCtx.fill();
    drawCtx.strokeStyle = stroke;
    drawCtx.lineWidth = 0.9;
    drawCtx.stroke();
    drawCtx.save();
    drawCtx.translate(x, y);
    const glyphScale = size / 4.1;
    drawCtx.scale(glyphScale, glyphScale);
    drawCtx.strokeStyle = "#f7fbff";
    drawCtx.fillStyle = "#f7fbff";
    drawCtx.lineWidth = 0.9;
    drawCtx.lineCap = "round";
    drawCtx.lineJoin = "round";
    if (kind === "runner") {
      drawCtx.beginPath();
      drawCtx.moveTo(-2.2, -1.2);
      drawCtx.lineTo(1.7, -1.2);
      drawCtx.moveTo(-1.4, 0);
      drawCtx.lineTo(2.3, 0);
      drawCtx.moveTo(-2.2, 1.2);
      drawCtx.lineTo(1.2, 1.2);
      drawCtx.stroke();
    } else if (kind === "scout") {
      drawCtx.beginPath();
      drawCtx.ellipse(0, 0, 2.35, 1.55, 0, 0, Math.PI * 2);
      drawCtx.stroke();
      drawCtx.beginPath();
      drawCtx.arc(0, 0, 0.75, 0, Math.PI * 2);
      drawCtx.fill();
    } else if (kind === "jammer") {
      drawCtx.beginPath();
      drawCtx.arc(-0.3, 0, 0.46, 0, Math.PI * 2);
      drawCtx.fill();
      drawCtx.beginPath();
      drawCtx.arc(-0.2, 0, 1.45, -0.9, 0.9);
      drawCtx.stroke();
      drawCtx.beginPath();
      drawCtx.arc(-0.1, 0, 2.25, -0.9, 0.9);
      drawCtx.stroke();
    } else if (kind === "blocker") {
      drawCtx.beginPath();
      drawCtx.moveTo(0, -2.2);
      drawCtx.lineTo(1.8, -1.2);
      drawCtx.lineTo(1.4, 1.2);
      drawCtx.lineTo(0, 2.2);
      drawCtx.lineTo(-1.4, 1.2);
      drawCtx.lineTo(-1.8, -1.2);
      drawCtx.closePath();
      drawCtx.fill();
    } else if (kind === "tank") {
      drawCtx.beginPath();
      drawCtx.arc(0, 0, 2.05, 0, Math.PI * 2);
      drawCtx.stroke();
      drawCtx.beginPath();
      drawCtx.moveTo(0, -2.05);
      drawCtx.lineTo(0, 2.05);
      drawCtx.moveTo(-2.05, 0);
      drawCtx.lineTo(2.05, 0);
      drawCtx.stroke();
    } else if (kind === "boss") {
      drawCtx.beginPath();
      drawCtx.moveTo(-2.4, 1.6);
      drawCtx.lineTo(-2.4, -0.7);
      drawCtx.lineTo(-1.2, 0.2);
      drawCtx.lineTo(0, -1.5);
      drawCtx.lineTo(1.2, 0.2);
      drawCtx.lineTo(2.4, -0.7);
      drawCtx.lineTo(2.4, 1.6);
      drawCtx.closePath();
      drawCtx.fill();
    } else if (kind === "slow") {
      drawCtx.beginPath();
      drawCtx.moveTo(0, -2.3);
      drawCtx.lineTo(0.6, -0.8);
      drawCtx.lineTo(2.2, -0.8);
      drawCtx.lineTo(0.95, 0.25);
      drawCtx.lineTo(1.45, 2.2);
      drawCtx.lineTo(0, 1.1);
      drawCtx.lineTo(-1.45, 2.2);
      drawCtx.lineTo(-0.95, 0.25);
      drawCtx.lineTo(-2.2, -0.8);
      drawCtx.lineTo(-0.6, -0.8);
      drawCtx.closePath();
      drawCtx.fill();
    } else if (kind === "jam") {
      drawCtx.beginPath();
      drawCtx.arc(-0.45, -0.2, 0.38, 0, Math.PI * 2);
      drawCtx.fill();
      drawCtx.beginPath();
      drawCtx.arc(-0.2, 0, 1.35, -0.9, 0.9);
      drawCtx.stroke();
      drawCtx.beginPath();
      drawCtx.arc(0, 0, 2.15, -0.85, 0.85);
      drawCtx.stroke();
    } else {
      drawCtx.font = "700 6.2px Segoe UI";
      drawCtx.textAlign = "center";
      drawCtx.textBaseline = "middle";
      drawCtx.fillText(String(kind || ""), 0, 0.2);
    }
    drawCtx.restore();
  }

  function drawEnemyOverlay(drawCtx, enemy, overlay, style, frameCount, roleChip) {
    if ((enemy.slowFlash || 0) > 0) {
      const slowA = Math.min(0.45, 0.14 + (enemy.slowFlash / 8) * 0.36);
      const slowR = 12 + (enemy.sizeMul || 1) * 3 + ((8 - Math.min(8, enemy.slowFlash || 0)) * 0.25);
      drawCtx.strokeStyle = `rgba(126, 220, 255, ${slowA})`;
      drawCtx.lineWidth = 2;
      drawCtx.beginPath();
      drawCtx.arc(enemy.x, enemy.y, slowR, 0, Math.PI * 2);
      drawCtx.stroke();
    }

    if ((enemy.hitFlash || 0) > 0) {
      const hitA = Math.min(0.5, 0.16 + (enemy.hitFlash / 7) * 0.34);
      const hitColor = enemy.hitColor || "rgba(255, 224, 224, 0.95)";
      const tint = hitColor.replace(/0\.\d+\)|1\)/, `${hitA})`);
      drawCtx.fillStyle = tint;
      drawCtx.beginPath();
      drawCtx.arc(enemy.x, enemy.y, 10 + (overlay.sizeMul || 1) * 4, 0, Math.PI * 2);
      drawCtx.fill();
    }

    if (enemy.role === "Jammer" && (enemy.jamRadius || 0) > 0) {
      const pulse = Math.sin((frameCount + enemy.id * 7) * 0.14) * 0.5 + 0.5;
      const auraR = 11 + pulse * 3;
      const auraA = 0.12 + pulse * 0.1;
      drawCtx.strokeStyle = `rgba(125, 120, 235, ${auraA})`;
      drawCtx.lineWidth = 1.6;
      drawCtx.beginPath();
      drawCtx.arc(enemy.x, enemy.y, auraR, 0, Math.PI * 2);
      drawCtx.stroke();
    }

    drawCtx.fillStyle = "rgba(17, 24, 36, 0.34)";
    drawCtx.fillRect(overlay.barX, overlay.barY, overlay.barWidth, 4.2);
    drawCtx.fillStyle = style.hp;
    drawCtx.fillRect(overlay.barX, overlay.barY, overlay.barWidth * overlay.hpPct, 4.2);
    drawCtx.fillStyle = "rgba(255, 255, 255, 0.24)";
    drawCtx.fillRect(overlay.barX, overlay.barY, overlay.barWidth * overlay.hpPct, 1);
    drawCtx.strokeStyle = "rgba(235, 243, 255, 0.45)";
    drawCtx.lineWidth = 0.7;
    drawCtx.strokeRect(overlay.barX, overlay.barY, overlay.barWidth, 4.2);

    const resolvedRoleChip = roleChip || getPrimaryRoleChip(enemy);
    if (resolvedRoleChip) {
      drawEnemyStatusChip(drawCtx, overlay.roleX, overlay.roleY, resolvedRoleChip.t, resolvedRoleChip.c, "rgba(15, 18, 24, 0.96)", 6.5);
      drawCtx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      drawCtx.lineWidth = 1;
      drawCtx.beginPath();
      drawCtx.arc(overlay.roleX, overlay.roleY, 7.9, 0, Math.PI * 2);
      drawCtx.stroke();
    }

    if ((enemy.slowStatusTimer || 0) > 0) {
      drawEnemyStatusChip(drawCtx, overlay.slowX, overlay.slowY, "slow", "#76d8f7", "rgba(12, 21, 34, 0.92)", 5.8);
    }
    if ((enemy.jamStatusTimer || 0) > 0) {
      drawEnemyStatusChip(drawCtx, overlay.jamX, overlay.jamY, "jam", "#8f83ee", "rgba(15, 18, 24, 0.92)", 5.8);
    }
  }

  global.GG_RENDER = {
    getTowerDockDefinitions,
    getTowerArtSources,
    shouldUseImportedTowerArt,
    getEnemyStyle,
    getEnemyLabel,
    getPrimaryRoleChip,
    getEnemyOverlayLayout,
    drawEnemyStatusChip,
    drawEnemyOverlay
  };
})(window);
