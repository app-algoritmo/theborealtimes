/* Os tesouros do fundo do mar — troque peças vizinhas até alinhar três iguais. */
BTJogo.registrar({
  canvas: 'jogo-agnete',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os tesouros do fundo do mar",
    "sub": "Toque numa peça e depois numa vizinha para trocá-las (ou arraste). Alinhe três ou mais peças iguais, na horizontal ou na vertical, para recolher os tesouros. Recolha 50 peças antes que os movimentos ou o tempo acabem.",
    "perdeu": "A maré levou os tesouros",
    "v1": "Os tesouros foram recolhidos!",
    "v2": "Na balada, Agnete vive no fundo do mar com o tritão e acaba voltando à terra. Os tesouros do jogo são invenção.",
    "h1": "Tesouros",
    "h2": "Movimentos"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Treasures of the sea floor",
    "sub": "Tap a piece and then a neighbour to swap them (or drag). Line up three or more alike, across or down, to gather the treasures. Collect 50 pieces before the moves or the time run out.",
    "perdeu": "The tide took the treasures",
    "v1": "The treasures are gathered!",
    "v2": "In the ballad, Agnete lives on the sea floor with the merman and in the end returns to land. The treasures in the game are made up.",
    "h1": "Treasures",
    "h2": "Moves"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Skattene på havbunnen",
    "sub": "Trykk på en brikke og deretter på en nabo for å bytte dem (eller dra). Få tre eller flere like på rad, vannrett eller loddrett, for å samle skattene. Samle 50 brikker før trekkene eller tiden går ut.",
    "perdeu": "Tidevannet tok skattene",
    "v1": "Skattene er samlet!",
    "v2": "I balladen bor Agnete på havbunnen med havmannen og vender til slutt tilbake til land. Skattene i spillet er diktet opp.",
    "h1": "Skatter",
    "h2": "Trekk"
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
    var N = 7, NT = 5, GOAL = 50, MAXM = 11, LIM = 180, COL = ['#e0503a', '#f0c040', '#5ac07a', '#4aa0e0', '#b070d0'];
    var b = [], got = 0, moves = 0, tmr = LIM, sel = null, busy = 0, pend = null, sx = 0, sy = 0, dn = null, pop = 0, fl = [];
    function lay() { var W = api.w, H = api.h, S = Math.min(W - 20, H - 140, 430); return { S: S, c: S / N, x: (W - S) / 2, y: Math.max(66, (H - S) / 2 + 16) }; }
    function rnd() { return Math.floor(Math.random() * NT); }
    function findM(bb) { var m = [], r, c; for (r = 0; r < N; r++) for (c = 0; c < N; c++) { var v = bb[r][c]; if (v < 0) continue; var k = 1; while (c + k < N && bb[r][c + k] === v) k++; if (k >= 3 && (c === 0 || bb[r][c - 1] !== v)) for (var i = 0; i < k; i++) m.push([r, c + i]); k = 1; while (r + k < N && bb[r + k][c] === v) k++; if (k >= 3 && (r === 0 || bb[r - 1][c] !== v)) for (i = 0; i < k; i++) m.push([r + i, c]); } return m; }
    function hasMove(bb) { for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) for (var d = 0; d < 2; d++) { var r2 = r + d, c2 = c + (1 - d); if (r2 >= N || c2 >= N) continue; var t = bb[r][c]; bb[r][c] = bb[r2][c2]; bb[r2][c2] = t; var ok = findM(bb).length > 0; t = bb[r][c]; bb[r][c] = bb[r2][c2]; bb[r2][c2] = t; if (ok) return true; } return false; }
    function fresh() { var ok = false; while (!ok) { b = []; for (var r = 0; r < N; r++) { b.push([]); for (var c = 0; c < N; c++) b[r].push(rnd()); } ok = findM(b).length === 0 && hasMove(b); } }
    function setup() { fresh(); got = 0; moves = 0; tmr = LIM; sel = null; busy = 0; fl = []; }
    function reset() { setup(); st = 'play'; }
    function resolve() {
      var total = 0, m;
      while ((m = findM(b)).length) {
        var seen = {}; m.forEach(function (p) { if (!seen[p[0] * N + p[1]]) { seen[p[0] * N + p[1]] = 1; total++; fl.push({ r: p[0], c: p[1], v: b[p[0]][p[1]], t: 0.35 }); b[p[0]][p[1]] = -1; } });
        for (var c = 0; c < N; c++) { var col = []; for (var r = N - 1; r >= 0; r--) if (b[r][c] >= 0) col.push(b[r][c]); while (col.length < N) col.push(rnd()); for (r = 0; r < N; r++) b[N - 1 - r][c] = col[r]; }
      }
      return total;
    }
    function swap(r1, c1, r2, c2) {
      if (st !== 'play' || busy > 0) return; var t = b[r1][c1]; b[r1][c1] = b[r2][c2]; b[r2][c2] = t;
      if (!findM(b).length) { t = b[r1][c1]; b[r1][c1] = b[r2][c2]; b[r2][c2] = t; busy = 0.12; return; }
      moves++; var n = resolve(); got += n; busy = 0.3; if (api.nota) api.nota(380 + Math.min(n, 8) * 40, 0.1, 'triangle', 0.06);
      if (got >= GOAL) { st = 'win'; return; } if (moves >= MAXM) { st = 'lose'; return; }
      var guard = 0; while (!hasMove(b) && guard++ < 50) fresh2();
    }
    function fresh2() { var ok = false, g2 = 0; while (!ok && g2++ < 100) { for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) b[r][c] = rnd(); ok = findM(b).length === 0 && hasMove(b); } }
    function cellAt(x, y) { var L = lay(), c = Math.floor((x - L.x) / L.c), r = Math.floor((y - L.y) / L.c); if (r < 0 || r >= N || c < 0 || c >= N) return null; return [r, c]; }
    setup();
    return {
      pausar: function () { dn = null; },
      dbg: function () { var L = lay(); return { st: st, b: b.map(function (r) { return r.slice(); }), got: got, moves: moves, busy: busy, x: L.x, y: L.y, c: L.c }; },
      down: function (x, y) {
        if (menu()) return; var p = cellAt(x, y); if (!p) return; dn = p; sx = x; sy = y;
        if (sel && Math.abs(sel[0] - p[0]) + Math.abs(sel[1] - p[1]) === 1) { swap(sel[0], sel[1], p[0], p[1]); sel = null; dn = null; return; }
        sel = p;
      },
      move: function (x, y, pr) { if (!dn || pr === false) return; var L = lay(), dx = x - sx, dy = y - sy; if (Math.abs(dx) > L.c * 0.5 || Math.abs(dy) > L.c * 0.5) { var r2 = dn[0] + (Math.abs(dy) > Math.abs(dx) ? (dy > 0 ? 1 : -1) : 0), c2 = dn[1] + (Math.abs(dx) >= Math.abs(dy) ? (dx > 0 ? 1 : -1) : 0); if (r2 >= 0 && r2 < N && c2 >= 0 && c2 < N) swap(dn[0], dn[1], r2, c2); dn = null; sel = null; } },
      up: function () { dn = null; },
      key: function (c, d) { if (d && st !== 'play') menu(); },
      update: function (dt) { pop += dt; if (busy > 0) busy -= dt; fl = fl.filter(function (f) { f.t -= dt; return f.t > 0; }); if (st === 'play') { tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; } } },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), r, c;
        bg('#10303a', '#061218');
        g.fillStyle = 'rgba(255,255,255,.06)'; rr(L.x - 6, L.y - 6, L.S + 12, L.S + 12, 12); g.fill();
        function shape(v, x, y, s) {
          g.fillStyle = COL[v]; g.beginPath();
          if (v === 0) g.arc(x, y, s, 0, 6.283);
          else if (v === 1) { g.moveTo(x, y - s); g.lineTo(x + s, y); g.lineTo(x, y + s); g.lineTo(x - s, y); g.closePath(); }
          else if (v === 2) { g.moveTo(x, y - s); g.lineTo(x + s, y + s * 0.8); g.lineTo(x - s, y + s * 0.8); g.closePath(); }
          else if (v === 3) { g.rect(x - s * 0.85, y - s * 0.85, s * 1.7, s * 1.7); }
          else { for (var i = 0; i < 6; i++) { var a = i / 6 * 6.283; g.lineTo(x + Math.cos(a) * s, y + Math.sin(a) * s); } g.closePath(); }
          g.fill(); g.fillStyle = 'rgba(255,255,255,.3)'; g.beginPath(); g.arc(x - s * 0.3, y - s * 0.3, s * 0.22, 0, 6.283); g.fill();
        }
        for (r = 0; r < N; r++) for (c = 0; c < N; c++) {
          var x = L.x + c * L.c + L.c / 2, y = L.y + r * L.c + L.c / 2;
          g.fillStyle = (r + c) % 2 ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.09)'; g.fillRect(L.x + c * L.c, L.y + r * L.c, L.c, L.c);
          if (b[r][c] >= 0) shape(b[r][c], x, y, L.c * 0.34);
        }
        fl.forEach(function (f) { g.fillStyle = 'rgba(255,255,255,' + f.t * 1.6 + ')'; g.beginPath(); g.arc(L.x + f.c * L.c + L.c / 2, L.y + f.r * L.c + L.c / 2, L.c * (0.6 - f.t), 0, 6.283); g.fill(); });
        if (sel && st === 'play') { g.strokeStyle = '#fff'; g.lineWidth = 3; g.strokeRect(L.x + sel[1] * L.c + 3, L.y + sel[0] * L.c + 3, L.c - 6, L.c - 6); }
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 40 ? '#c0392b' : '#5ac0e0');
        hud(T.h1 + ' ' + got + '/' + GOAL, T.h2 + ' ' + moves + '/' + MAXM, moves >= MAXM - 4);
        fim(st);
      }
    };
  }
});
