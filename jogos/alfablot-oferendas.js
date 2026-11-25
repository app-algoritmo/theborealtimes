/* O Álfablót — ligue cada oferenda ao seu altar, sem cruzar os caminhos. */
BTJogo.registrar({
  canvas: 'jogo-alfablot',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O Álfablót",
    "sub": "Cada oferenda tem um altar da mesma cor. Arraste de uma oferenda até o seu altar, formando um caminho; os caminhos não podem se cruzar, e passar por cima de outro o corta. Cubra todas as casas do campo. O tempo é limitado.",
    "perdeu": "O banquete passou sem as oferendas",
    "v1": "Os álfar foram honrados!",
    "v2": "O Álfablót é uma oferenda aos elfos, citada na poesia de Sigvatr Þórðarson. Os caminhos do jogo são invenção.",
    "h1": "Caminhos",
    "h2": "Tempo",
    "dica": "cubra todas as casas"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The Álfablót",
    "sub": "Each offering has an altar of the same colour. Drag from an offering to its altar, drawing a path; paths cannot cross, and running over another cuts it. Cover every square of the field. Time is limited.",
    "perdeu": "The feast passed without the offerings",
    "v1": "The álfar are honoured!",
    "v2": "The Álfablót was an offering to the elves, mentioned in the poetry of Sigvatr Þórðarson. The paths in the game are made up.",
    "h1": "Paths",
    "h2": "Time",
    "dica": "cover every square"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Alfeblotet",
    "sub": "Hver gave har et alter i samme farge. Dra fra en gave til alteret dens og tegn en sti; stiene kan ikke krysse hverandre, og å gå over en annen kutter den. Dekk alle rutene på marka. Tiden er begrenset.",
    "perdeu": "Festen gikk uten gavene",
    "v1": "Alvene er æret!",
    "v2": "Alfeblotet var et offer til alvene, nevnt i diktningen til Sigvat Tordsson. Stiene i spillet er diktet opp.",
    "h1": "Stier",
    "h2": "Tid",
    "dica": "dekk alle rutene"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "El Álfablót",
    "sub": "Cada ofrenda tiene un altar del mismo color. Arrastra desde una ofrenda hasta su altar, formando un camino; los caminos no pueden cruzarse, y pasar por encima de otro lo corta. Cubre todas las casillas del campo. El tiempo es limitado.",
    "perdeu": "El banquete pasó sin las ofrendas",
    "v1": "¡Los álfar fueron honrados!",
    "v2": "El Álfablót es una ofrenda a los elfos, citada en la poesía de Sigvatr Þórðarson. Los caminos del juego son invención.",
    "h1": "Caminos",
    "h2": "Tiempo",
    "dica": "cubre todas las casillas"
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
    var N = 5, K = 4, LIM = 150, COLS = ['#d9a23a', '#4a8ad9', '#d95a5a', '#6ac07a'];
    var sol = [], ends = [], path = [], active = -1, tmr = LIM, doneN = 0, fT = 0;
    function lay() { var S = Math.min(api.w - 40, api.h - 150, 380); return { S: S, c: S / N, x: (api.w - S) / 2, y: Math.max(68, (api.h - S) / 2 - 2) }; }
    function nb(k) { var r = Math.floor(k / N), c = k % N, o = []; if (r > 0) o.push(k - N); if (r < N - 1) o.push(k + N); if (c > 0) o.push(k - 1); if (c < N - 1) o.push(k + 1); return o; }
    function ham() {
      for (var t = 0; t < 400; t++) {
        var s = Math.floor(Math.random() * N * N), p = [s], used = {}; used[s] = 1; var steps = 0;
        (function dfs() { if (p.length === N * N) return true; if (++steps > 20000) return false; var o = nb(p[p.length - 1]).sort(function () { return Math.random() - 0.5; }); for (var i = 0; i < o.length; i++) { if (used[o[i]]) continue; used[o[i]] = 1; p.push(o[i]); if (dfs()) return true; p.pop(); used[o[i]] = 0; } return false; })();
        if (p.length === N * N) return p;
      }
      return [0, 1, 2, 3, 4, 9, 8, 7, 6, 5, 10, 11, 12, 13, 14, 19, 18, 17, 16, 15, 20, 21, 22, 23, 24];
    }
    function setup() {
      var p = ham(), cuts = [], tot = N * N, mn = 4;
      while (true) { cuts = []; var a = mn + Math.floor(Math.random() * 4), b = mn + Math.floor(Math.random() * 4), c = mn + Math.floor(Math.random() * 4), d = tot - a - b - c; if (d >= mn && d <= 9) { cuts = [a, b, c, d]; break; } }
      sol = []; ends = []; var i = 0; cuts.forEach(function (n) { var seg = p.slice(i, i + n); sol.push(seg); ends.push([seg[0], seg[seg.length - 1]]); i += n; });
      path = []; for (var k = 0; k < K; k++) path.push([]); active = -1; tmr = LIM; doneN = 0; fT = 0;
    }
    function reset() { setup(); st = 'play'; }
    function owner(k) { for (var c = 0; c < K; c++) if (path[c].indexOf(k) >= 0) return c; return -1; }
    function endOf(k) { for (var c = 0; c < K; c++) if (ends[c][0] === k || ends[c][1] === k) return c; return -1; }
    function complete(c) { var p = path[c]; return p.length > 1 && p[0] !== p[p.length - 1] && ends[c].indexOf(p[0]) >= 0 && ends[c].indexOf(p[p.length - 1]) >= 0; }
    function recount() { doneN = 0; for (var c = 0; c < K; c++) if (complete(c)) doneN++; var f = 0; for (c = 0; c < K; c++) f += path[c].length; if (doneN === K && f === N * N && st === 'play') st = 'win'; }
    function startAt(k) {
      var c = endOf(k); if (c >= 0) { path[c] = [k]; active = c; return; }
      var o = owner(k); if (o >= 0) { var i = path[o].indexOf(k); path[o] = path[o].slice(0, i + 1); active = o; recount(); }
    }
    function stepTo(k) {
      var p = path[active], head = p[p.length - 1]; if (k === head || nb(head).indexOf(k) < 0) return;
      if (complete(active)) { if (p.length > 1 && p[p.length - 2] === k) { p.pop(); recount(); } return; }
      var bi = p.indexOf(k); if (bi >= 0) { path[active] = p.slice(0, bi + 1); recount(); return; }
      var e = endOf(k); if (e >= 0 && e !== active) return; if (e === active && k === p[0]) return;
      var o = owner(k); if (o >= 0 && o !== active) path[o] = path[o].slice(0, path[o].indexOf(k));
      p.push(k); if (o >= 0 && o !== active && path[o].length === 0) path[o] = []; if (api.nota) api.nota(300 + p.length * 18, 0.04, 'sine', 0.03); recount();
    }
    function cellAt(x, y) { var L = lay(), c = Math.floor((x - L.x) / L.c), r = Math.floor((y - L.y) / L.c); if (c < 0 || c >= N || r < 0 || r >= N) return -1; return r * N + c; }
    function follow(k) {
      if (active < 0 || k < 0) return; var guard = 0;
      while (guard++ < 12) { var p = path[active], head = p[p.length - 1]; if (head === k) return; var hr = Math.floor(head / N), hc = head % N, kr = Math.floor(k / N), kc = k % N, nx; if (Math.abs(kr - hr) >= Math.abs(kc - hc)) nx = (kr > hr ? head + N : head - N); else nx = (kc > hc ? head + 1 : head - 1); var before = p.length, bh = head; stepTo(nx); var q = path[active]; if (q[q.length - 1] === bh && q.length === before) return; }
    }
    setup();
    return {
      pausar: function () { active = -1; },
      dbg: function () { var L = lay(); return { st: st, sol: sol, ends: ends, path: path.map(function (p) { return p.slice(); }), doneN: doneN, tmr: tmr, x: L.x, y: L.y, c: L.c, N: N }; },
      down: function (x, y) { if (menu()) return; var k = cellAt(x, y); if (k >= 0) startAt(k); },
      move: function (x, y, pr) { if (active >= 0 && st === 'play') follow(cellAt(x, y)); },
      up: function () { active = -1; },
      key: function (c, d) { if (d && (c === 'Space' || c === 'Enter') && st !== 'play') menu(); },
      update: function (dt) { if (st !== 'play') return; tmr -= dt; if (tmr <= 0) st = 'lose'; },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), r, c, k, i;
        bg('#2a2438', '#100c18'); g.fillStyle = 'rgba(255,255,255,.06)'; rr(L.x - 8, L.y - 8, L.S + 16, L.S + 16, 10); g.fill();
        for (r = 0; r < N; r++) for (c = 0; c < N; c++) { g.fillStyle = 'rgba(255,255,255,.07)'; g.fillRect(L.x + c * L.c + 2, L.y + r * L.c + 2, L.c - 4, L.c - 4); }
        for (i = 0; i < K; i++) {
          var p = path[i]; g.strokeStyle = COLS[i]; g.lineWidth = L.c * 0.34; g.lineCap = 'round'; g.lineJoin = 'round'; g.globalAlpha = 0.85; g.beginPath(); p.forEach(function (q, j) { var X = L.x + (q % N + 0.5) * L.c, Y = L.y + (Math.floor(q / N) + 0.5) * L.c; if (j) g.lineTo(X, Y); else g.moveTo(X, Y); }); g.stroke(); g.globalAlpha = 1; g.lineCap = 'butt';
          [0, 1].forEach(function (e) { var q = ends[i][e], X = L.x + (q % N + 0.5) * L.c, Y = L.y + (Math.floor(q / N) + 0.5) * L.c; g.fillStyle = COLS[i]; g.beginPath(); if (e === 0) g.arc(X, Y, L.c * 0.3, 0, 6.29); else { g.rect(X - L.c * 0.26, Y - L.c * 0.26, L.c * 0.52, L.c * 0.52); } g.fill(); g.strokeStyle = 'rgba(0,0,0,.5)'; g.lineWidth = 3; g.stroke(); });
        }
        txt(T.dica, W / 2, L.y + L.S + 34, 14, 'rgba(255,255,255,.5)'); bar(W / 2 - 110, H - 12, 220, 5, tmr / LIM, tmr < 25 ? '#c0392b' : '#a88ad9');
        hud(T.h1 + ' ' + doneN + '/' + K, T.h2 + ' ' + Math.max(0, Math.ceil(tmr)), false);
        fim(st);
      }
    };
  }
});
