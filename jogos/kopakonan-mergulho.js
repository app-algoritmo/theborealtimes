/* A pele de foca — nade até a pele, colhendo pérolas. */
BTJogo.registrar({
  canvas: 'jogo-kopakonan',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A pele de foca",
    "sub": "A mulher-foca volta ao mar. Arraste o dedo (ou o mouse, ou use as setas) para cima e para baixo e nade entre os perigos. Colha oito pérolas e desvie dos anzóis e das rochas. Três batidas e o jogo termina.",
    "perdeu": "A foca ficou presa",
    "v1": "De volta ao mar!",
    "v2": "Na lenda faroesa da Kópakonan, a mulher-foca encontra a pele escondida e volta ao mar. As pérolas, os anzóis e as rochas do jogo são invenção.",
    "h1": "Pérolas",
    "h2": "Batidas"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The sealskin",
    "sub": "The seal woman returns to the sea. Drag your finger (or the mouse, or use the arrow keys) up and down and swim between the dangers. Collect eight pearls and dodge the hooks and rocks. Three bumps and the game ends.",
    "perdeu": "The seal was trapped",
    "v1": "Back in the sea!",
    "v2": "In the Faroese legend of the Kópakonan, the seal woman finds her hidden skin and returns to the sea. The pearls, hooks and rocks in the game are made up.",
    "h1": "Pearls",
    "h2": "Bumps"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Selskinnet",
    "sub": "Selkvinnen vender tilbake til havet. Dra fingeren (eller musa, eller bruk piltastene) opp og ned og svøm mellom farene. Samle åtte perler og unngå krokene og steinene. Tre støt og spillet er over.",
    "perdeu": "Selen ble fanget",
    "v1": "Tilbake i havet!",
    "v2": "I den færøyske legenden om Kópakonan finner selkvinnen det skjulte skinnet og vender tilbake til havet. Perlene, krokene og steinene i spillet er diktet opp.",
    "h1": "Perler",
    "h2": "Støt"
  }
},
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt;
    var st = 'menu';
    function menu() { if (st === 'menu' || st === 'lose') { reset(); return true; } if (st === 'win') { st = 'menu'; return true; } return false; }
    function fim(s) {
      if (s === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
      else if (s === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
      else if (s === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
    }
    function bg(a, b) { var s = g.createLinearGradient(0, 0, 0, api.h); s.addColorStop(0, a); s.addColorStop(1, b); g.fillStyle = s; g.fillRect(0, 0, api.w, api.h); }
    function hud(a, b, bad) { if (st === 'menu') return; txt(a, 22, 32, 15, '#f3ecd2', 'left'); if (b) txt(b, 22, 54, 13, bad ? '#ffb08a' : '#c9b3f2', 'left'); }
    var NEED = 8, MAXE = 3, SX = 0.22;
    var y = 0, ty = 0, objs = [], got = 0, errs = 0, spawnT = 0, inv = 0, ky = 0, t = 0;
    function reset() { st = 'play'; y = ty = api.h * 0.5; objs = []; got = 0; errs = 0; spawnT = 0.7; inv = 0; ky = 0; t = 0; }
    return {
      pausar: function () { ky = 0; },
      dbg: function () { return { st: st, y: y, got: got, errs: errs, x: api.w * SX, objs: objs.map(function (o) { return { k: o.k, x: o.x, y: o.y, r: o.r }; }), h: api.h, w: api.w }; },
      down: function (x, yy) { if (menu()) return; ty = yy; },
      move: function (x, yy) { if (st === 'play') ty = yy; },
      key: function (c, d) { if (c === 'ArrowUp' || c === 'KeyW') ky = d ? -1 : (ky === -1 ? 0 : ky); else if (c === 'ArrowDown' || c === 'KeyS') ky = d ? 1 : (ky === 1 ? 0 : ky); else if (d && st !== 'play' && (c === 'Space' || c === 'Enter')) menu(); },
      update: function (dt) {
        if (st !== 'play') return; var W = api.w, H = api.h; t += dt; inv = Math.max(0, inv - dt);
        ty = Math.max(H * 0.1, Math.min(H * 0.9, ty + ky * 320 * dt)); var d = ty - y, m = Math.min(Math.abs(d), 300 * dt); y += (d >= 0 ? 1 : -1) * m;
        spawnT -= dt; var sp = 150 + t * 1.6;
        if (spawnT <= 0) {
          var r = Math.random(), yy;
          if (r < 0.4) objs.push({ k: 'p', x: W + 20, y: H * (0.15 + Math.random() * 0.7), r: 11 });
          else if (r < 0.72) { var L = H * (0.2 + Math.random() * 0.45); objs.push({ k: 'h', x: W + 20, y: L, r: 17, top: L }); }
          else { var h2 = H * (0.2 + Math.random() * 0.3); objs.push({ k: 'r', x: W + 24, y: H - h2 + 6, r: 24, h: h2 }); }
          spawnT = 0.75 + Math.random() * 0.5 - Math.min(0.25, t * 0.004);
        }
        var sx = W * SX;
        objs.forEach(function (o) { o.x -= sp * dt; if (!o.dead && Math.hypot(o.x - sx, o.y - y) < o.r + 14) { if (o.k === 'p') { got++; o.dead = true; if (got >= NEED) st = 'win'; } else if (inv <= 0) { errs++; inv = 1.1; o.dead = true; if (errs >= MAXE) st = 'lose'; } } });
        objs = objs.filter(function (o) { return o.x > -40 && !o.dead; });
      },
      draw: function () {
        var W = api.w, H = api.h, sx = W * SX, tt = api.clock;
        var sg = g.createLinearGradient(0, 0, 0, H); sg.addColorStop(0, '#2a7a9a'); sg.addColorStop(1, '#0a2a44'); g.fillStyle = sg; g.fillRect(0, 0, W, H);
        g.strokeStyle = 'rgba(255,255,255,.08)'; g.lineWidth = 2; for (var i = 0; i < 7; i++) { g.beginPath(); for (var x = 0; x <= W; x += 20) g.lineTo(x, H * (0.1 + i * 0.13) + Math.sin(x * 0.02 + tt + i) * 4); g.stroke(); }
        objs.forEach(function (o) {
          if (o.k === 'p') { g.fillStyle = '#fff'; g.beginPath(); g.arc(o.x, o.y, o.r, 0, 6.29); g.fill(); g.fillStyle = 'rgba(180,220,255,.7)'; g.beginPath(); g.arc(o.x - 3, o.y - 3, 4, 0, 6.29); g.fill(); }
          else if (o.k === 'h') { g.strokeStyle = '#d8d8d8'; g.lineWidth = 2; g.beginPath(); g.moveTo(o.x, 0); g.lineTo(o.x, o.top); g.stroke(); g.strokeStyle = '#c0c8d0'; g.lineWidth = 4; g.beginPath(); g.arc(o.x - 6, o.top + 2, 10, -1.2, 2.2); g.stroke(); }
          else { g.fillStyle = '#4a4a52'; g.beginPath(); g.moveTo(o.x - 30, H); g.lineTo(o.x - 6, H - o.h); g.lineTo(o.x + 26, H - o.h * 0.6); g.lineTo(o.x + 34, H); g.fill(); }
        });
        if (inv <= 0 || Math.floor(inv * 10) % 2 === 0) { g.fillStyle = '#6a6a72'; g.beginPath(); g.ellipse(sx, y, 26, 12, 0, 0, 6.29); g.fill(); g.beginPath(); g.moveTo(sx - 24, y); g.lineTo(sx - 40, y - 10 + Math.sin(tt * 10) * 4); g.lineTo(sx - 40, y + 10 + Math.sin(tt * 10) * 4); g.fill(); g.fillStyle = '#8a8a92'; g.beginPath(); g.arc(sx + 22, y - 3, 9, 0, 6.29); g.fill(); g.fillStyle = '#111'; g.fillRect(sx + 25, y - 6, 3, 3); }
        hud(T.h1 + ' ' + got + '/' + NEED, T.h2 + ' ' + errs + '/' + MAXE, errs > 0);
        fim(st);
      }
    };
  }
});
