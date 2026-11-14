/* As renas de Ohthere — conduza o rebanho ao curral. */
BTJogo.registrar({
  canvas: 'jogo-ohthere',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As renas de Ohthere",
    "sub": "Arraste o dedo (ou o mouse, ou use as setas) para mover o pastor. As renas fogem de quem chega perto, então ande atrás delas para empurrá-las em direção ao curral, à direita. Salve oito de dez renas em setenta segundos; se três se perderem pelas bordas, o jogo termina.",
    "perdeu": "O rebanho se dispersou",
    "v1": "O rebanho está no curral!",
    "v2": "Ohthere contou ao rei Alfredo que tinha seiscentas renas domesticadas. O curral, o pastor e a fuga das renas no jogo são invenção.",
    "h1": "Renas",
    "h2": "Perdidas"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Ohthere's reindeer",
    "sub": "Drag your finger (or the mouse, or use the arrow keys) to move the herder. The reindeer flee from anyone who gets close, so walk behind them to push them toward the corral on the right. Save eight of ten reindeer in seventy seconds; if three get lost over the edges, the game ends.",
    "perdeu": "The herd scattered",
    "v1": "The herd is in the corral!",
    "v2": "Ohthere told King Alfred he had six hundred tame reindeer. The corral, the herder and the reindeer's flight in the game are made up.",
    "h1": "Reindeer",
    "h2": "Lost"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Ohtheres rein",
    "sub": "Dra fingeren (eller musa, eller bruk piltastene) for å flytte gjeteren. Reinen flykter fra den som kommer nær, så gå bak dem for å skyve dem mot gjerdet til høyre. Berg åtte av ti rein på sytti sekunder; hvis tre kommer bort over kantene, er spillet over.",
    "perdeu": "Flokken spredte seg",
    "v1": "Flokken er i gjerdet!",
    "v2": "Ohthere fortalte kong Alfred at han hadde seks hundre tamme rein. Gjerdet, gjeteren og reinens flukt i spillet er diktet opp.",
    "h1": "Rein",
    "h2": "Tapt"
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
    var NR = 10, NEED = 8, MAXE = 3, LIM = 70, FLEE = 112;
    var rd = [], hx = 0, hy = 0, tx = 0, ty = 0, lost = 0, ins = 0, tl = 0, kx = 0, ky = 0;
    function pen() { var W = api.w, H = api.h; return { x: W * 0.8, y: H * 0.24, w: W * 0.2, h: H * 0.52 }; }
    function reset() { st = 'play'; lost = 0; ins = 0; tl = LIM; var W = api.w, H = api.h; hx = tx = W * 0.1; hy = ty = H * 0.5; rd = []; for (var i = 0; i < NR; i++) rd.push({ x: W * (0.34 + Math.random() * 0.2), y: H * (0.3 + Math.random() * 0.4), vx: 0, vy: 0, in: false, gone: false, ph: Math.random() * 6 }); kx = ky = 0; }
    return {
      pausar: function () { kx = ky = 0; },
      dbg: function () { return { st: st, ins: ins, lost: lost, tl: tl, hx: hx, hy: hy, pen: pen(), w: api.w, h: api.h, rd: rd.map(function (r) { return { x: r.x, y: r.y, in: r.in, gone: r.gone }; }) }; },
      down: function (x, y) { if (menu()) return; tx = x; ty = y; },
      move: function (x, y) { if (st === 'play') { tx = x; ty = y; } },
      key: function (c, d) { if (c === 'ArrowLeft' || c === 'KeyA') kx = d ? -1 : (kx === -1 ? 0 : kx); else if (c === 'ArrowRight' || c === 'KeyD') kx = d ? 1 : (kx === 1 ? 0 : kx); else if (c === 'ArrowUp' || c === 'KeyW') ky = d ? -1 : (ky === -1 ? 0 : ky); else if (c === 'ArrowDown' || c === 'KeyS') ky = d ? 1 : (ky === 1 ? 0 : ky); else if (d && st !== 'play' && (c === 'Space' || c === 'Enter')) menu(); },
      update: function (dt) {
        if (st !== 'play') return;
        var W = api.w, H = api.h, P = pen(); tl -= dt;
        tx = Math.max(0, Math.min(W, tx + kx * 300 * dt)); ty = Math.max(0, Math.min(H, ty + ky * 300 * dt));
        var dx = tx - hx, dy = ty - hy, dd = Math.hypot(dx, dy), mv = Math.min(dd, 300 * dt); if (dd > 0.01) { hx += dx / dd * mv; hy += dy / dd * mv; }
        rd.forEach(function (r) {
          if (r.gone) return;
          r.ph += dt; var d = Math.hypot(r.x - hx, r.y - hy);
          if (d < FLEE && d > 0.1) { var k = (1 - d / FLEE) * 520 * dt; r.vx += (r.x - hx) / d * k; r.vy += (r.y - hy) / d * k; }
          else { r.vx += Math.cos(r.ph * 0.9) * 5 * dt; r.vy += Math.sin(r.ph * 1.1) * 5 * dt; }
          rd.forEach(function (o) { if (o !== r && !o.gone) { var q = Math.hypot(r.x - o.x, r.y - o.y); if (q < 26 && q > 0.1) { r.vx += (r.x - o.x) / q * 60 * dt; r.vy += (r.y - o.y) / q * 60 * dt; } } });
          var sp = Math.hypot(r.vx, r.vy), cap = d < FLEE ? 135 : 30; if (sp > cap) { r.vx *= cap / sp; r.vy *= cap / sp; } r.vx *= Math.pow(0.5, dt * 2.5); r.vy *= Math.pow(0.5, dt * 2.5);
          var nx = r.x + r.vx * dt, ny = r.y + r.vy * dt;
          if (r.in) { nx = Math.max(P.x + 10, Math.min(P.x + P.w - 10, nx)); ny = Math.max(P.y + 10, Math.min(P.y + P.h - 10, ny)); }
          else {
            /* cerca do curral: paredes de cima, de baixo e do fundo */
            if (nx > P.x - 2 && (ny < P.y || ny > P.y + P.h)) { nx = r.x; if (r.vx > 0) r.vx = -r.vx * 0.4; }
          }
          r.x = nx; r.y = ny;
          if (!r.in && r.x > P.x + 12 && r.y > P.y + 6 && r.y < P.y + P.h - 6) { r.in = true; ins++; }
          if (!r.in && (r.x < -14 || r.y < -14 || r.y > H + 14 || r.x > W + 14)) { r.gone = true; lost++; }
        });
        if (ins >= NEED) st = 'win'; else if (lost >= MAXE || tl <= 0 || (NR - lost) < NEED) st = 'lose';
      },
      draw: function () {
        var W = api.w, H = api.h, P = pen();
        bg('#cfd8e6', '#8fa3bd'); g.fillStyle = '#eef3f8'; g.fillRect(0, H * 0.12, W, H * 0.88);
        g.fillStyle = 'rgba(160,180,205,.45)'; for (var i = 0; i < 14; i++) { g.beginPath(); g.arc((i * 97) % W, H * 0.2 + ((i * 61) % (H * 0.7)), 18 + (i % 4) * 6, 0, 6.29); g.fill(); }
        g.strokeStyle = '#6b4a2a'; g.lineWidth = 5; g.beginPath(); g.moveTo(P.x, P.y); g.lineTo(P.x + P.w, P.y); g.lineTo(P.x + P.w, P.y + P.h); g.lineTo(P.x, P.y + P.h); g.stroke(); g.fillStyle = 'rgba(107,74,42,.12)'; g.fillRect(P.x, P.y, P.w, P.h);
        rd.forEach(function (r) { if (r.gone) return; g.fillStyle = '#8a6a50'; g.beginPath(); g.ellipse(r.x, r.y, 13, 8, 0, 0, 6.29); g.fill(); g.beginPath(); g.arc(r.x + 12, r.y - 6, 5, 0, 6.29); g.fill(); g.strokeStyle = '#5a4030'; g.lineWidth = 2; g.beginPath(); g.moveTo(r.x + 12, r.y - 9); g.lineTo(r.x + 8, r.y - 18); g.moveTo(r.x + 12, r.y - 9); g.lineTo(r.x + 17, r.y - 17); g.stroke(); });
        g.fillStyle = '#2a4a8a'; g.beginPath(); g.arc(hx, hy, 11, 0, 6.29); g.fill(); g.fillStyle = '#e8c9a0'; g.beginPath(); g.arc(hx, hy - 4, 6, 0, 6.29); g.fill(); g.strokeStyle = 'rgba(42,74,138,.25)'; g.lineWidth = 2; g.beginPath(); g.arc(hx, hy, FLEE, 0, 6.29); g.stroke();
        var bw = Math.min(W * 0.4, 260); g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(W - bw - 22, 26, bw, 7); g.fillStyle = tl < 15 ? '#c0392b' : '#4a5a8a'; g.fillRect(W - bw - 22, 26, bw * Math.max(0, tl) / LIM, 7);
        hud(T.h1 + ' ' + ins + '/' + NEED, T.h2 + ' ' + lost + '/' + MAXE, lost > 0);
        fim(st);
      }
    };
  }
});
