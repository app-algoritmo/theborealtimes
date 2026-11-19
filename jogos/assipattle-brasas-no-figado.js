/* Assipattle e o Stoor Worm — corte as brasas no ar (invenção). */
BTJogo.registrar({
  canvas: 'jogo-assipattle',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As brasas de Assipattle",
    "sub": "Brasas e bolhas de água sobem e caem. Passe o dedo (ou o mouse) sobre as brasas para recolhê-las, sem tocar nas bolhas azuis, que as apagam. Recolha 24 brasas. Três bolhas tocadas encerram o jogo.",
    "perdeu": "Três bolhas tocadas",
    "v1": "O fígado do monstro está em brasa!",
    "v2": "No conto de Orkney, Assipattle, o sétimo filho, acende o fígado do monstro Stoor Worm com uma turfa em brasa. O verme morre, e seus dentes viram as ilhas Orkney, Shetland e Feroé. Cortar brasas no ar é invenção.",
    "h1": "Brasas",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Assipattle’s embers",
    "sub": "Embers and water bubbles rise and fall. Swipe your finger (or the mouse) over the embers to collect them, without touching the blue bubbles, which put them out. Collect 24 embers. Three bubbles touched end the game.",
    "perdeu": "Three bubbles touched",
    "v1": "The monster’s liver is aflame!",
    "v2": "In the Orkney tale, Assipattle, the seventh son, sets the liver of the Stoor Worm alight with a burning peat. The worm dies, and its teeth become the islands of Orkney, Shetland and the Faroes. Slicing embers in the air is invented.",
    "h1": "Embers",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Assipattles glør",
    "sub": "Glør og vannbobler stiger og faller. Dra fingeren (eller musen) over gløden for å samle den, uten å røre de blå boblene, som slukker den. Samle 24 glør. Tre bobler som berøres avslutter spillet.",
    "perdeu": "Tre bobler berørt",
    "v1": "Uhyrets lever står i brann!",
    "v2": "I eventyret fra Orknøyene tenner Assipattle, den sjuende sønnen, på leveren til Stoor Worm med en glødende torv. Ormen dør, og tennene blir til Orknøyene, Shetland og Færøyene. Å skjære glør i lufta er oppfunnet.",
    "h1": "Glør",
    "h2": "Feil"
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
    function rr(x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
    function bar(x, y, w, h, f, c) { g.fillStyle = 'rgba(0,0,0,.28)'; g.fillRect(x, y, w, h); g.fillStyle = c; g.fillRect(x, y, w * Math.max(0, Math.min(1, f)), h); }
    var GOAL = 24, MAXE = 3;
    var got = 0, err = 0, it = [], tmr = 0, prev = null, burst = [], fl = 0;
    function R() { return Math.max(24, Math.min(api.w, api.h) * 0.055); }
    function spawn() {
      var w = api.w, h = api.h, x = w * (0.12 + Math.random() * 0.76), y0 = h + 24, top = h * (0.12 + Math.random() * 0.3), G2 = h * 0.95, rise = y0 - top;
      it.push({ x: x, y: y0, vx: (w / 2 - x) * (0.12 + Math.random() * 0.2), vy: -Math.sqrt(2 * G2 * rise), k: Math.random() < 0.34 ? 1 : 0, ph: Math.random() * 6 });
    }
    function reset() { got = 0; err = 0; it = []; tmr = 0.4; prev = null; burst = []; fl = 0; st = 'play'; }
    function hit(x, y) {
      if (st !== 'play') return; var i, r = R() + 6;
      for (i = it.length - 1; i >= 0; i--) { var o = it[i]; if (Math.hypot(o.x - x, o.y - y) < r) { it.splice(i, 1); burst.push({ x: o.x, y: o.y, t: 0.4, k: o.k }); if (o.k === 0) { got++; if (api.nota) api.nota(480 + got * 8, 0.06, 'triangle', 0.05); if (got >= GOAL) st = 'win'; } else { err++; fl = 0.4; if (api.nota) api.nota(110, 0.2, 'sawtooth', 0.05); if (err >= MAXE) st = 'lose'; } }
      }
    }
    reset(); st = 'menu';
    return {
      pausar: function () { prev = null; },
      dbg: function () { return { st: st, got: got, err: err, items: it.map(function (o) { return { x: o.x, y: o.y, k: o.k }; }) }; },
      down: function (x, y) { if (menu()) return; prev = { x: x, y: y }; hit(x, y); },
      move: function (x, y) { if (!prev) return; var dx = x - prev.x, dy = y - prev.y, d = Math.hypot(dx, dy), n = Math.max(1, Math.ceil(d / 10)), k; for (k = 1; k <= n; k++) hit(prev.x + dx * k / n, prev.y + dy * k / n); prev = { x: x, y: y }; },
      up: function () { prev = null; },
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) {
        if (st !== 'play') return; var h = api.h, G2 = h * 0.95, i;
        tmr -= dt; if (tmr <= 0) { spawn(); tmr = 0.5 + Math.random() * 0.35; }
        for (i = it.length - 1; i >= 0; i--) { var o = it[i]; o.vy += G2 * dt; o.x += o.vx * dt; o.y += o.vy * dt; if (o.y > h + 40 && o.vy > 0) it.splice(i, 1); }
        for (i = burst.length - 1; i >= 0; i--) { burst[i].t -= dt; if (burst[i].t <= 0) burst.splice(i, 1); }
        if (fl > 0) fl -= dt;
      },
      draw: function () {
        var r = R(), i; bg(fl > 0 ? '#1d2a44' : '#1e1a1a', '#07060a');
        for (i = 0; i < it.length; i++) {
          var o = it[i];
          if (o.k === 0) { g.fillStyle = 'rgba(255,150,60,.35)'; g.beginPath(); g.arc(o.x, o.y, r * 1.3, 0, 6.2832); g.fill(); g.fillStyle = '#ff8a2a'; g.beginPath(); g.arc(o.x, o.y, r * 0.85, 0, 6.2832); g.fill(); g.fillStyle = '#ffe08a'; g.beginPath(); g.arc(o.x, o.y, r * 0.42, 0, 6.2832); g.fill(); }
          else { g.fillStyle = 'rgba(120,190,255,.25)'; g.beginPath(); g.arc(o.x, o.y, r, 0, 6.2832); g.fill(); g.strokeStyle = '#8fcaff'; g.lineWidth = 3; g.stroke(); g.fillStyle = 'rgba(255,255,255,.6)'; g.beginPath(); g.arc(o.x - r * 0.35, o.y - r * 0.35, r * 0.18, 0, 6.2832); g.fill(); }
        }
        for (i = 0; i < burst.length; i++) { var b = burst[i], a = 1 - b.t / 0.4; g.strokeStyle = b.k ? '#8fcaff' : '#ffd88a'; g.lineWidth = 3; g.beginPath(); g.arc(b.x, b.y, r * (0.8 + a), 0, 6.2832); g.stroke(); }
        hud(T.h1 + ' ' + got + '/' + GOAL, T.h2 + ' ' + err + '/' + MAXE, true);
        fim(st);
      }
    };

  }
});
