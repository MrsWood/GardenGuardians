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

  function drawSaltCannonArt(drawCtx, aimAngle, sprayFlash) {
    drawCtx.save();
    drawCtx.rotate(aimAngle);

    drawCtx.fillStyle = "#6d4a2b";
    drawCtx.beginPath();
    drawCtx.roundRect(-8.2, 3.6, 13.2, 3.4, 1.5);
    drawCtx.fill();

    drawCtx.fillStyle = "#1a2029";
    drawCtx.beginPath();
    drawCtx.arc(-5.6, 6.8, 2.3, 0, Math.PI * 2);
    drawCtx.arc(2.0, 6.8, 2.3, 0, Math.PI * 2);
    drawCtx.fill();
    drawCtx.fillStyle = "#56606c";
    drawCtx.beginPath();
    drawCtx.arc(-5.6, 6.8, 0.85, 0, Math.PI * 2);
    drawCtx.arc(2.0, 6.8, 0.85, 0, Math.PI * 2);
    drawCtx.fill();

    const bodyGrad = drawCtx.createRadialGradient(-2.5, -3.0, 2, 0, 0, 13.5);
    bodyGrad.addColorStop(0, "#353c48");
    bodyGrad.addColorStop(0.7, "#1d232c");
    bodyGrad.addColorStop(1, "#0f141b");
    drawCtx.fillStyle = bodyGrad;
    drawCtx.strokeStyle = "#070a0f";
    drawCtx.lineWidth = 1.5;
    drawCtx.beginPath();
    drawCtx.ellipse(-1.0, -1.2, 8.6, 6.8, 0, 0, Math.PI * 2);
    drawCtx.fill();
    drawCtx.stroke();
    drawCtx.strokeStyle = "rgba(228, 236, 248, 0.38)";
    drawCtx.lineWidth = 0.85;
    drawCtx.beginPath();
    drawCtx.ellipse(-2.9, -3.2, 4.1, 2.2, -0.22, 0, Math.PI * 2);
    drawCtx.stroke();

    drawCtx.fillStyle = "#141a22";
    drawCtx.beginPath();
    drawCtx.moveTo(4.8, -3.2);
    drawCtx.lineTo(20.4, -4.8);
    drawCtx.lineTo(20.4, 4.8);
    drawCtx.lineTo(4.8, 3.2);
    drawCtx.closePath();
    drawCtx.fill();
    drawCtx.strokeStyle = "#0a0d12";
    drawCtx.stroke();
    drawCtx.fillStyle = "#1a212b";
    drawCtx.beginPath();
    drawCtx.ellipse(20.4, 0, 4.3, 5.8, 0, 0, Math.PI * 2);
    drawCtx.fill();
    drawCtx.fillStyle = "#0a0f15";
    drawCtx.beginPath();
    drawCtx.ellipse(20.4, 0, 1.8, 2.5, 0, 0, Math.PI * 2);
    drawCtx.fill();

    drawCtx.fillStyle = "#8b6a46";
    drawCtx.beginPath();
    drawCtx.ellipse(-12.0, 8.8, 6.6, 2.1, -0.08, 0, Math.PI * 2);
    drawCtx.fill();
    drawCtx.fillStyle = "#6c7583";
    drawCtx.strokeStyle = "#1a2028";
    drawCtx.lineWidth = 0.75;
    drawCtx.beginPath();
    drawCtx.arc(-11.4, 5.8, 2.25, 0, Math.PI * 2);
    drawCtx.arc(-14.3, 8.0, 2.05, 0, Math.PI * 2);
    drawCtx.arc(-8.4, 8.2, 2.05, 0, Math.PI * 2);
    drawCtx.fill();
    drawCtx.stroke();
    drawCtx.fillStyle = "rgba(244, 249, 255, 0.75)";
    drawCtx.beginPath();
    drawCtx.arc(-12.2, 5.0, 0.65, 0, Math.PI * 2);
    drawCtx.arc(-15.0, 7.3, 0.56, 0, Math.PI * 2);
    drawCtx.arc(-9.1, 7.5, 0.56, 0, Math.PI * 2);
    drawCtx.fill();

    if (sprayFlash > 0) {
      const alpha = 0.2 + (sprayFlash / 6) * 0.32;
      drawCtx.fillStyle = `rgba(246, 246, 236, ${alpha})`;
      drawCtx.beginPath();
      drawCtx.arc(24.8, 0, 2.5 + (sprayFlash / 6) * 2.2, 0, Math.PI * 2);
      drawCtx.fill();

      drawCtx.strokeStyle = `rgba(247, 247, 236, ${Math.min(0.62, alpha + 0.18)})`;
      drawCtx.lineWidth = 1.25;
      drawCtx.beginPath();
      drawCtx.moveTo(23.0, 0);
      drawCtx.lineTo(33.2, -1.8);
      drawCtx.moveTo(23.0, 0);
      drawCtx.lineTo(33.2, 1.8);
      drawCtx.stroke();
    }

    drawCtx.restore();
  }

  function drawTowerPedestal(drawCtx) {
    drawCtx.fillStyle = "rgba(245, 249, 255, 0.94)";
    drawCtx.strokeStyle = "rgba(120, 138, 170, 0.72)";
    drawCtx.lineWidth = 1;
    drawCtx.beginPath();
    drawCtx.ellipse(0, 7.6, 8.8, 3.3, 0, 0, Math.PI * 2);
    drawCtx.fill();
    drawCtx.stroke();
    drawCtx.fillStyle = "rgba(255, 255, 255, 0.42)";
    drawCtx.beginPath();
    drawCtx.ellipse(-1.8, 6.9, 3.4, 1.2, -0.15, 0, Math.PI * 2);
    drawCtx.fill();
  }

  function drawSprayCloudArt(drawCtx, aimAngle, sprayFlash) {
    drawCtx.save();
    drawCtx.rotate(aimAngle);

    const cloud = (x, y, r, color) => {
      drawCtx.fillStyle = color;
      drawCtx.beginPath();
      drawCtx.arc(x, y, r, 0, Math.PI * 2);
      drawCtx.fill();
    };

    cloud(-4.4, 1.2, 4.1, "rgba(255, 98, 98, 0.9)");
    cloud(-1.1, -1.8, 4.8, "rgba(241, 62, 62, 0.92)");
    cloud(2.7, 0.8, 4.1, "rgba(206, 40, 40, 0.92)");
    cloud(5.3, -0.9, 3.7, "rgba(252, 115, 115, 0.86)");
    cloud(0.7, 3.0, 3.9, "rgba(167, 27, 27, 0.88)");

    drawCtx.strokeStyle = "rgba(112, 24, 24, 0.62)";
    drawCtx.lineWidth = 0.9;
    drawCtx.beginPath();
    drawCtx.arc(-1.2, 0.4, 8.5, -2.65, 1.05);
    drawCtx.stroke();

    drawCtx.fillStyle = "rgba(255, 222, 222, 0.86)";
    drawCtx.beginPath();
    drawCtx.arc(-0.2, -4.6, 1.6, 0, Math.PI * 2);
    drawCtx.fill();

    drawCtx.strokeStyle = "#6d7772";
    drawCtx.lineWidth = 1.8;
    drawCtx.beginPath();
    drawCtx.moveTo(7.2, -0.7);
    drawCtx.lineTo(12.8, -0.7);
    drawCtx.stroke();

    drawCtx.fillStyle = "#59625f";
    drawCtx.beginPath();
    drawCtx.moveTo(12.8, -2.2);
    drawCtx.lineTo(16.0, -0.7);
    drawCtx.lineTo(12.8, 0.8);
    drawCtx.closePath();
    drawCtx.fill();

    drawCtx.fillStyle = "#4a3030";
    drawCtx.beginPath();
    drawCtx.roundRect(-7.2, 2.2, 10.8, 3.1, 1.0);
    drawCtx.fill();
    drawCtx.fillStyle = "#ffe1d7";
    drawCtx.font = "bold 2.6px Segoe UI";
    drawCtx.textAlign = "center";
    drawCtx.textBaseline = "middle";
    drawCtx.fillText("SPRAY", -1.8, 3.75);

    if (sprayFlash > 0) {
      const alpha = 0.14 + (sprayFlash / 6) * 0.26;
      drawCtx.fillStyle = `rgba(255, 92, 92, ${alpha})`;
      drawCtx.beginPath();
      drawCtx.moveTo(16.0, -0.8);
      drawCtx.lineTo(29.8, -6.8);
      drawCtx.lineTo(29.8, 5.2);
      drawCtx.closePath();
      drawCtx.fill();

      drawCtx.strokeStyle = `rgba(255, 192, 192, ${Math.min(0.5, alpha + 0.12)})`;
      drawCtx.lineWidth = 1.1;
      drawCtx.beginPath();
      drawCtx.arc(16.0, -0.8, 9.5, -0.45, 0.45);
      drawCtx.stroke();
      drawCtx.beginPath();
      drawCtx.arc(16.0, -0.8, 13.3, -0.45, 0.45);
      drawCtx.stroke();
    }

    drawCtx.restore();
  }

  function drawGlueTowerArt(drawCtx) {
    const glueGrad = drawCtx.createLinearGradient(0, -8, 0, 8);
    glueGrad.addColorStop(0, "#f2b164");
    glueGrad.addColorStop(0.55, "#d18b46");
    glueGrad.addColorStop(1, "#a86f31");
    drawCtx.fillStyle = glueGrad;
    drawCtx.strokeStyle = "#7a4f21";
    drawCtx.lineWidth = 1.5;
    drawCtx.beginPath();
    drawCtx.roundRect(-8.2, -6.8, 16.4, 13.8, 3.2);
    drawCtx.fill();
    drawCtx.stroke();

    drawCtx.fillStyle = "rgba(255, 232, 182, 0.38)";
    drawCtx.beginPath();
    drawCtx.roundRect(-6.6, -4.9, 4.5, 8.8, 1.8);
    drawCtx.fill();

    drawCtx.fillStyle = "#9e6a32";
    drawCtx.beginPath();
    drawCtx.roundRect(-8.4, -9.3, 16.8, 3.8, 1.8);
    drawCtx.fill();

    drawCtx.fillStyle = "#f2d367";
    drawCtx.beginPath();
    drawCtx.arc(0, -7.4, 4.4, 0, Math.PI * 2);
    drawCtx.fill();
    drawCtx.fillStyle = "#cfb24e";
    drawCtx.beginPath();
    drawCtx.arc(1.6, -7.1, 2.5, 0, Math.PI * 2);
    drawCtx.fill();
    drawCtx.fillStyle = "#6f4720";
    drawCtx.beginPath();
    drawCtx.roundRect(-6.1, 0.8, 12.2, 3.2, 1.1);
    drawCtx.fill();
    drawCtx.fillStyle = "#f7e6b8";
    drawCtx.font = "bold 2.8px Segoe UI";
    drawCtx.textAlign = "center";
    drawCtx.textBaseline = "middle";
    drawCtx.fillText("GLUE", 0, 2.45);
  }

  function drawHoseTowerArt(drawCtx) {
    const hoseGrad = drawCtx.createLinearGradient(0, -10, 0, 9);
    hoseGrad.addColorStop(0, "#7dc6e8");
    hoseGrad.addColorStop(0.6, "#4a9fc8");
    hoseGrad.addColorStop(1, "#2f7697");
    drawCtx.fillStyle = hoseGrad;
    drawCtx.strokeStyle = "#1f5673";
    drawCtx.lineWidth = 1.4;
    drawCtx.beginPath();
    drawCtx.roundRect(-7.6, -10.2, 15.2, 18.8, 4.2);
    drawCtx.fill();
    drawCtx.stroke();

    drawCtx.fillStyle = "#85d6f2";
    drawCtx.beginPath();
    drawCtx.roundRect(-5.6, -3.8, 11.2, 5.8, 2.2);
    drawCtx.fill();

    drawCtx.fillStyle = "rgba(230, 251, 255, 0.34)";
    drawCtx.beginPath();
    drawCtx.roundRect(-5.1, -2.9, 10.1, 1.6, 0.8);
    drawCtx.fill();

    drawCtx.fillStyle = "#d8ecf5";
    drawCtx.beginPath();
    drawCtx.roundRect(-3.8, -15.1, 7.6, 5.2, 2.1);
    drawCtx.fill();
    drawCtx.strokeStyle = "#557583";
    drawCtx.stroke();

    drawCtx.fillStyle = "#2f424d";
    drawCtx.beginPath();
    drawCtx.arc(0, -12.2, 1.1, 0, Math.PI * 2);
    drawCtx.fill();

    drawCtx.strokeStyle = "#1f5673";
    drawCtx.lineWidth = 2.3;
    drawCtx.lineCap = "round";
    drawCtx.beginPath();
    drawCtx.moveTo(6.8, -0.4);
    drawCtx.lineTo(15.4, -0.4);
    drawCtx.stroke();

    drawCtx.fillStyle = "#2a7a9d";
    drawCtx.beginPath();
    drawCtx.moveTo(15.4, -2.8);
    drawCtx.lineTo(20.8, -0.4);
    drawCtx.lineTo(15.4, 2.0);
    drawCtx.closePath();
    drawCtx.fill();

    drawCtx.fillStyle = "#153544";
    drawCtx.beginPath();
    drawCtx.roundRect(-6.4, 2.8, 12.8, 2.8, 1.2);
    drawCtx.fill();
    drawCtx.fillStyle = "#ebf8ff";
    drawCtx.font = "bold 3.4px Segoe UI";
    drawCtx.textAlign = "center";
    drawCtx.fillText("HOSE", 0, 5.1);
  }

  function renderTowerSelectorIcon(drawCtx, type, drawTowerArtSprite) {
    if (!drawCtx) return;
    drawCtx.clearRect(0, 0, drawCtx.canvas.width, drawCtx.canvas.height);
    const spriteFn = typeof drawTowerArtSprite === "function" ? drawTowerArtSprite : null;

    if (type === "spray") {
      if (!spriteFn || !spriteFn(drawCtx, "spray", { x: 48, y: 50, size: 90, angle: -0.18 })) {
        drawCtx.save();
        drawCtx.translate(46, 52);
        drawCtx.scale(3.7, 3.7);
        drawSprayCloudArt(drawCtx, -0.18, 0);
        drawCtx.restore();
      }
      return;
    }

    if (type === "glue") {
      if (!spriteFn || !spriteFn(drawCtx, "glue", { x: 48, y: 50, size: 90 })) {
        drawCtx.save();
        drawCtx.translate(48, 52);
        drawCtx.scale(3.5, 3.5);
        drawGlueTowerArt(drawCtx);
        drawCtx.restore();
      }
      return;
    }

    if (type === "hose") {
      if (!spriteFn || !spriteFn(drawCtx, "hose", { x: 48, y: 50, size: 90 })) {
        drawCtx.save();
        drawCtx.translate(48, 52);
        drawCtx.scale(3.4, 3.4);
        drawCtx.rotate(-0.28);
        drawHoseTowerArt(drawCtx);
        drawCtx.restore();
      }
      return;
    }

    if (type === "salt") {
      if (!spriteFn || !spriteFn(drawCtx, "salt", { x: 48, y: 50, size: 94, angle: -0.74 })) {
        drawCtx.fillStyle = "rgba(241, 244, 250, 0.2)";
        drawCtx.beginPath();
        drawCtx.arc(48, 50, 18, 0, Math.PI * 2);
        drawCtx.fill();
        drawCtx.save();
        drawCtx.translate(48, 50);
        drawCtx.scale(1.95, 1.95);
        drawTowerPedestal(drawCtx);
        drawSaltCannonArt(drawCtx, -0.74, 0);
        drawCtx.restore();
      }
    }
  }

  function drawTowerRangeAndGlow(drawCtx, tower, selectedTowerId, frameCount, towerRadius) {
    const showRange = tower.id === selectedTowerId || (tower.showRangeUntil && tower.showRangeUntil > frameCount);
    if (showRange) {
      drawCtx.strokeStyle = "rgba(120, 250, 170, 0.42)";
      drawCtx.lineWidth = 2.2;
      drawCtx.beginPath();
      drawCtx.arc(tower.x, tower.y, tower.range, 0, Math.PI * 2);
      drawCtx.stroke();
    }

    if (tower.level > 1) {
      const strength = Math.min(1, (tower.level - 1) / 5);
      drawCtx.strokeStyle = `rgba(255, 224, 114, ${0.25 + strength * 0.45})`;
      drawCtx.lineWidth = 1.5 + strength * 1.5;
      drawCtx.beginPath();
      drawCtx.arc(tower.x, tower.y, towerRadius + 5 + strength * 3, 0, Math.PI * 2);
      drawCtx.stroke();
    }

    const idlePulse = 0.12 + (Math.sin(frameCount * 0.08 + tower.id * 0.6) + 1) * 0.04;
    const glowColor = tower.type === "glue"
      ? "255, 214, 120"
      : (tower.type === "hose" ? "132, 228, 255" : (tower.type === "salt" ? "241, 244, 250" : "255, 104, 104"));
    drawCtx.fillStyle = `rgba(${glowColor}, ${idlePulse})`;
    drawCtx.beginPath();
    drawCtx.arc(tower.x, tower.y + 2.5, 16, 0, Math.PI * 2);
    drawCtx.fill();
  }

  function drawTowerLevelBadge(drawCtx, tower) {
    const pedestalW = 24;
    const pedestalH = 14;
    const pedestalX = tower.x - pedestalW / 2;
    const pedestalY = tower.y + 15;

    const pedestalGrad = drawCtx.createLinearGradient(0, pedestalY, 0, pedestalY + pedestalH);
    pedestalGrad.addColorStop(0, "rgba(28, 36, 44, 0.95)");
    pedestalGrad.addColorStop(1, "rgba(11, 15, 19, 0.96)");
    drawCtx.fillStyle = pedestalGrad;
    drawCtx.strokeStyle = "#ffe072";
    drawCtx.lineWidth = 1.6;
    drawCtx.beginPath();
    drawCtx.roundRect(pedestalX, pedestalY, pedestalW, pedestalH, 4);
    drawCtx.fill();
    drawCtx.stroke();

    drawCtx.fillStyle = "#ffe072";
    drawCtx.font = "700 12px Consolas, 'Courier New', monospace";
    drawCtx.textAlign = "center";
    drawCtx.textBaseline = "middle";
    drawCtx.fillText(String(tower.level), tower.x, pedestalY + pedestalH / 2 + 0.5);
  }

  function getEnemyStyle(type) {
    if (type === "aphid") return { hp: "#77ce57", icon: "#59af3d" };
    if (type === "mantis") return { hp: "#d2e65f", icon: "#b6cc3e" };
    if (type === "locust") return { hp: "#b8c0ca", icon: "#8d96a1" };
    if (type === "caterpillar") return { hp: "#a98ae3", icon: "#7e60b8" };
    if (type === "ladybug") return { hp: "#ef6666", icon: "#c94646" };
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
    if (enemy.enemyType === "aphid") return { t: "scout", c: "#59af3d" };
    if (enemy.enemyType === "locust") return { t: "runner", c: "#8d96a1" };
    if (enemy.enemyType === "mantis") return { t: "jammer", c: "#b6cc3e" };
    if (enemy.enemyType === "caterpillar") return { t: "blocker", c: "#7e60b8" };
    if (enemy.enemyType === "ladybug") return { t: "tank", c: "#c94646" };
    if (enemy.role === "Scout") return { t: "scout", c: "#59af3d" };
    if (enemy.role === "Runner") return { t: "runner", c: "#8d96a1" };
    if (enemy.role === "Jammer") return { t: "jammer", c: "#b6cc3e" };
    if (enemy.role === "Blocker") return { t: "blocker", c: "#7e60b8" };
    if (enemy.role === "Tank") return { t: "tank", c: "#c94646" };
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
      drawCtx.strokeStyle = `rgba(196, 220, 86, ${auraA})`;
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

    // Intentionally keep enemy UI minimal: health bar only.
    // Type is now communicated by enemy body art + the top legend.
  }

  global.GG_RENDER = {
    getTowerDockDefinitions,
    getTowerArtSources,
    shouldUseImportedTowerArt,
    drawSaltCannonArt,
    drawTowerPedestal,
    drawSprayCloudArt,
    drawGlueTowerArt,
    drawHoseTowerArt,
    renderTowerSelectorIcon,
    drawTowerRangeAndGlow,
    drawTowerLevelBadge,
    getEnemyStyle,
    getEnemyLabel,
    getPrimaryRoleChip,
    getEnemyOverlayLayout,
    drawEnemyStatusChip,
    drawEnemyOverlay
  };
})(window);
