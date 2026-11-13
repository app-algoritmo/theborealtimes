/* A ponte de Stamford — segure a ponte contra o exército inglês. */
BTJogo.registrar({
  canvas: 'jogo-stamford',
  t: {
    pt: {
      titulo: 'A ponte de Stamford',
      sub: 'Você é o machadeiro que segura a ponte. Toque acima da ponte (ou use a barra de espaço) para golpear quem chega pela direita. Quando surgir uma lança sob as tábuas, toque abaixo da ponte (ou use a seta para baixo) para afastá-la a tempo. Derrube 20 inimigos.',
      toque: 'Toque para começar', derrotas: 'Derrotados', vidas: 'Vidas',
      perdeu: 'A ponte caiu', perdeu2: 'A lança vinda de baixo te pegou', de_novo: 'Toque para tentar de novo',
      v1: 'A ponte resistiu!',
      v2: 'Fontes escritas depois da batalha, como Henry de Huntingdon, contam que um único machadeiro norueguês segurou a ponte até ser atingido por baixo. Na história real, Haroldo Hardrada morreu e a batalha foi perdida, em 1066. A vitória aqui é invenção do jogo.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: 'Stamford Bridge',
      sub: 'You are the axeman holding the bridge. Tap above the bridge (or press the space bar) to strike whoever comes from the right. When a spear appears under the planks, tap below the bridge (or press the down arrow) to knock it away in time. Defeat 20 enemies.',
      toque: 'Tap to start', derrotas: 'Defeated', vidas: 'Lives',
      perdeu: 'The bridge fell', perdeu2: 'The spear from below got you', de_novo: 'Tap to try again',
      v1: 'The bridge held!',
      v2: 'Sources written after the battle, such as Henry of Huntingdon, say a single Norwegian axeman held the bridge until he was struck from below. In real history, Harald Hardrada died and the battle was lost, in 1066. The victory here is made up for the game.',
      jogar: 'Tap to play again'
    },
    no: {
      titulo: 'Stamford Bridge',
      sub: 'Du er øksemannen som holder broen. Trykk over broen (eller bruk mellomromstasten) for å slå den som kommer fra høyre. Når et spyd dukker opp under planken, trykker du under broen (eller bruker pil ned) for å slå det unna i tide. Fell 20 fiender.',
      toque: 'Trykk for å starte', derrotas: 'Felt', vidas: 'Liv',
      perdeu: 'Broen falt', perdeu2: 'Spydet nedenfra tok deg', de_novo: 'Trykk for å prøve igjen',
      v1: 'Broen holdt!',
      v2: 'Kilder skrevet etter slaget, som Henry av Huntingdon, forteller at én enkelt norsk øksemann holdt broen til han ble truffet nedenfra. I virkeligheten døde Harald Hardråde og slaget gikk tapt, i 1066. Seieren her er diktet opp for spillet.',
      jogar: 'Trykk for å spille igjen'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt, META = 20;
    var st = 'menu', kills = 0, hp = 3, foes = [], spear = null, spawn = 0, sp = 0, swing = 0, cd = 0, why = 1, puffs = [], time = 0;
    function by() { return api.h * 0.56; }
    function hx() { return api.w * 0.32; }
    function reset() { st = 'play'; kills = 0; hp = 3; foes = []; spear = null; spawn = 1; sp = 5; swing = 0; cd = 0; puffs = []; time = 0; }
    function slash() {
      if (cd > 0) return; cd = 0.28; swing = 0.18;
      var best = null; foes.forEach(function (f) { if (f.x - hx() < 150 && (!best || f.x < best.x)) best = f; });
      if (best && --best.hp > 0) best.x += 45; else if (best) { foes.splice(foes.indexOf(best), 1); kills++; puffs.push({ x: best.x, y: by() - 30, t: 0.4 }); if (kills >= META) st = 'win'; }
    }
    function parry() { if (spear) { spear = null; sp = 3.5 + Math.random() * 2; } }
    return {
      pausar: function () {},
      dbg: function () { return { st: st, kills: kills, hp: hp, foes: foes, spear: spear, hx: hx(), by: by(), w: api.w, h: api.h }; },
      down: function (x, y) {
        if (st === 'menu' || st === 'lose') { reset(); return; } if (st === 'win') { st = 'menu'; return; }
        if (y > by() + 12) parry(); else slash();
      },
      key: function (c, d) {
        if (!d) return;
        if (c === 'Space' || c === 'Enter') { if (st === 'menu' || st === 'lose') reset(); else if (st === 'win') st = 'menu'; else slash(); }
        else if ((c === 'ArrowDown' || c === 'KeyS') && st === 'play') parry();
        else if ((c === 'ArrowUp' || c === 'KeyW' || c === 'KeyD' || c === 'ArrowRight') && st === 'play') slash();
      },
      update: function (dt) {
        if (cd > 0) cd -= dt; if (swing > 0) swing -= dt;
        puffs.forEach(function (p) { p.t -= dt; }); puffs = puffs.filter(function (p) { return p.t > 0; });
        if (st !== 'play') return;
        time += dt; spawn -= dt;
        if (spawn <= 0) { foes.push({ hp: kills >= 5 && Math.random() < 0.4 ? 2 : 1, x: api.w + 40, sp: 115 + Math.min(80, time * 2.4), ph: Math.random() * 6 }); spawn = Math.max(0.6, 1.3 - time * 0.03) * (0.75 + Math.random() * 0.6); }
        sp -= dt;
        if (!spear && sp <= 0) spear = { t: 0, life: 1.2, x: hx() + (Math.random() * 40 - 20) };
        if (spear) { spear.t += dt; if (spear.t >= spear.life) { why = 2; st = 'lose'; return; } }
        for (var i = foes.length - 1; i >= 0; i--) {
          var f = foes[i]; f.x -= f.sp * dt;
          if (f.x - hx() < 34) { foes.splice(i, 1); hp--; puffs.push({ x: hx(), y: by() - 40, t: 0.4 }); if (hp <= 0) { why = 1; st = 'lose'; return; } }
        }
      },
      draw: function () {
        var W = api.w, H = api.h, b = by(), i;
        var s = g.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#9ab4c8'); s.addColorStop(0.6, '#d8e2e8'); s.addColorStop(1, '#5b7f8f'); g.fillStyle = s; g.fillRect(0, 0, W, H);
        g.fillStyle = '#6f8f6a'; g.fillRect(0, b - 8, 70, H); g.fillRect(W - 70, b - 8, 70, H);
        g.fillStyle = '#3d6a80'; g.fillRect(70, b + 44, W - 140, H);
        g.strokeStyle = 'rgba(255,255,255,.3)'; g.lineWidth = 2; for (i = 0; i < 8; i++) { g.beginPath(); g.moveTo(90 + i * (W - 180) / 8, b + 60 + (i % 3) * 18); g.lineTo(130 + i * (W - 180) / 8, b + 60 + (i % 3) * 18); g.stroke(); }
        g.fillStyle = '#7a5532'; g.fillRect(0, b, W, 14); g.fillStyle = '#5a3d22'; for (i = 0; i < W; i += 28) g.fillRect(i, b, 2, 14);
        g.fillStyle = '#4a3320'; for (i = 0; i < 6; i++) g.fillRect(W * (i + 0.5) / 6 - 6, b + 14, 12, 34);
        if (spear) {
          var k = spear.t / spear.life, sx = spear.x, tip = b + 40 - k * 70;
          g.fillStyle = 'rgba(255,60,40,' + (0.25 + 0.5 * Math.abs(Math.sin(api.clock * (6 + k * 14)))) + ')'; g.fillRect(sx - 22, b + 14, 44, 34);
          g.strokeStyle = '#9a9aa4'; g.lineWidth = 4; g.beginPath(); g.moveTo(sx, b + 60); g.lineTo(sx, tip); g.stroke();
          g.fillStyle = '#d5d9e0'; g.beginPath(); g.moveTo(sx, tip - 14); g.lineTo(sx - 5, tip); g.lineTo(sx + 5, tip); g.fill();
        }
        foes.forEach(function (f) {
          var bob = Math.abs(Math.sin(api.clock * 8 + f.ph)) * 3;
          g.fillStyle = f.hp > 1 ? '#2f4a7a' : '#b73a2e'; g.fillRect(f.x - 8, b - 40 - bob, 16, 26); g.fillStyle = '#d8b48a'; g.beginPath(); g.arc(f.x, b - 48 - bob, 8, 0, 6.29); g.fill();
          g.fillStyle = '#9a9aa4'; g.beginPath(); g.arc(f.x, b - 50 - bob, 8, Math.PI, 0); g.fill();
          g.fillStyle = '#3a2a1a'; g.fillRect(f.x - 7, b - 14 - bob, 5, 14); g.fillRect(f.x + 2, b - 14 - bob, 5, 14);
          g.strokeStyle = '#cfd3da'; g.lineWidth = 3; g.beginPath(); g.moveTo(f.x - 6, b - 32 - bob); g.lineTo(f.x - 26, b - 56 - bob); g.stroke();
        });
        var x = hx();
        g.fillStyle = '#d8b48a'; g.beginPath(); g.arc(x, b - 50, 9, 0, 6.29); g.fill(); g.fillStyle = '#e8c872'; g.beginPath(); g.arc(x, b - 52, 9, Math.PI, 0); g.fill();
        g.fillStyle = '#2f5a8a'; g.fillRect(x - 9, b - 42, 18, 28); g.fillStyle = '#3a2a1a'; g.fillRect(x - 8, b - 14, 6, 14); g.fillRect(x + 2, b - 14, 6, 14);
        g.strokeStyle = '#5a3d22'; g.lineWidth = 4; var a = swing > 0 ? 1.1 - swing * 6 : -0.6; g.beginPath(); g.moveTo(x + 6, b - 34); g.lineTo(x + 6 + Math.cos(a) * 34, b - 34 + Math.sin(a) * 34); g.stroke();
        g.fillStyle = '#cfd3da'; g.beginPath(); g.arc(x + 6 + Math.cos(a) * 36, b - 34 + Math.sin(a) * 36, 9, 0, 6.29); g.fill();
        puffs.forEach(function (p) { g.fillStyle = 'rgba(255,230,180,' + p.t + ')'; g.beginPath(); g.arc(p.x, p.y, 26 * (1 - p.t), 0, 6.29); g.fill(); });
        if (st !== 'menu') {
          txt(T.derrotas + ': ' + kills + '/' + META, 24, 34, 15, '#10222c', 'left');
          txt(T.vidas, 24, 58, 15, '#10222c', 'left');
          for (i = 0; i < 3; i++) { g.fillStyle = i < hp ? '#d8392c' : 'rgba(0,0,0,.2)'; g.beginPath(); g.arc(84 + i * 22, 53, 8, 0, 6.29); g.fill(); }
        }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(why === 2 ? T.perdeu2 : T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
