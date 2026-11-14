/* Carroças no mercado de Ribe — abra o caminho até o cais. */
BTJogo.registrar({
  canvas: 'jogo-ribe',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Carroças no mercado de Ribe",
    "sub": "A rua está entupida de carroças. Arraste cada carroça no sentido do seu comprimento (ou toque nela e use as setas) para abrir caminho até o cais, à direita, para a carroça dourada. Resolva 3 ruas. Cada rua tem um limite de movimentos.",
    "perdeu": "A rua ficou travada",
    "v1": "A rua está livre!",
    "v2": "Escavações em Ribe mostram um mercado ativo desde o início do século VIII. As carroças do jogo são invenção.",
    "h1": "Ruas",
    "h2": "Movimentos",
    "dica": "A carroça dourada vai ao cais"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Carts at the Ribe market",
    "sub": "The street is jammed with carts. Drag each cart along its length (or tap it and use the arrows) to clear the way to the quay, on the right, for the golden cart. Solve 3 streets. Each street has a move limit.",
    "perdeu": "The street stayed blocked",
    "v1": "The street is clear!",
    "v2": "Excavations at Ribe show an active market from the early 8th century. The carts in the game are made up.",
    "h1": "Streets",
    "h2": "Moves",
    "dica": "The golden cart goes to the quay"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Vogner på markedet i Ribe",
    "sub": "Gata er full av vogner. Dra hver vogn i lengderetningen (eller trykk på den og bruk piltastene) for å rydde vei til kaia, til høyre, for den gylne vogna. Løs 3 gater. Hver gate har en grense for antall trekk.",
    "perdeu": "Gata ble stående blokkert",
    "v1": "Gata er fri!",
    "v2": "Utgravinger i Ribe viser et aktivt marked fra tidlig på 700-tallet. Vognene i spillet er diktet opp.",
    "h1": "Gater",
    "h2": "Trekk",
    "dica": "Den gylne vogna skal til kaia"
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
    var N = 6, LV = [[{"m":8,"c":[[2,1,2,1],[5,4,2,1],[1,3,2,0],[0,0,2,0],[4,0,2,0],[0,2,3,1],[3,0,2,1],[2,4,2,0],[4,3,2,0],[1,5,3,0]]},{"m":8,"c":[[2,1,2,1],[4,2,3,1],[2,3,2,0],[4,1,2,0],[0,4,3,0],[3,1,2,1],[4,0,2,0],[2,5,2,0]]},{"m":8,"c":[[2,0,2,1],[4,3,2,1],[4,1,2,1],[0,2,2,0],[1,5,3,0],[1,4,3,0],[5,3,2,1],[4,0,2,0],[3,1,2,1]]},{"m":9,"c":[[2,0,2,1],[0,2,3,0],[3,0,2,0],[1,4,2,1],[0,1,2,0],[2,5,3,0],[3,1,3,1]]}],[{"m":10,"c":[[2,0,2,1],[4,2,2,0],[1,1,2,1],[4,0,2,0],[5,4,2,1],[4,3,3,1],[0,2,2,1],[1,5,3,0],[3,2,3,1]]},{"m":10,"c":[[2,0,2,1],[5,0,2,1],[3,4,2,0],[1,2,2,0],[0,4,2,1],[5,2,3,1],[4,1,3,1],[0,0,2,0],[0,1,2,1],[3,1,2,1]]},{"m":10,"c":[[2,1,2,1],[4,3,2,1],[0,3,2,1],[1,5,2,0],[1,1,2,1],[2,3,2,0],[0,1,2,1],[1,4,3,0],[4,0,2,1],[4,2,2,0]]},{"m":11,"c":[[2,0,2,1],[2,3,3,0],[5,3,3,1],[0,3,2,1],[4,2,2,0],[3,0,3,1],[1,4,2,0],[0,5,2,0],[0,0,2,1]]}],[{"m":12,"c":[[2,0,2,1],[4,0,2,0],[3,3,2,1],[0,4,3,0],[3,0,2,1],[4,2,2,1],[4,4,2,1],[0,5,2,0],[2,2,2,0],[4,1,2,0]]},{"m":12,"c":[[2,0,2,1],[1,4,3,0],[3,2,2,0],[0,0,2,0],[4,4,2,1],[3,3,2,0],[4,1,2,0],[3,0,2,0],[0,5,2,0],[0,1,3,1]]},{"m":12,"c":[[2,0,2,1],[2,3,2,0],[4,3,3,1],[3,2,3,0],[0,1,2,0],[2,4,2,0],[1,2,2,1],[0,3,2,1],[5,3,2,1],[5,0,2,1]]},{"m":13,"c":[[2,0,2,1],[0,3,2,1],[3,4,2,0],[1,2,2,0],[5,4,2,1],[4,0,2,0],[4,2,2,1],[5,1,2,1],[1,3,2,1],[0,0,3,1]]}]], LIM = 300;
    var cars = [], pos = [], idx = 0, solved = 0, moves = 0, limit = 20, drag = null, sel = 0, lastK = null, wait = 0, tmr = LIM, order = [], par = 8, pop = 0;
    var CC = ['#ffd84a', '#c0503a', '#4a8ac0', '#6aa860', '#a06ac0', '#c08a4a', '#5ab0a8', '#b05a7a', '#8a8a9a', '#c0b04a'];
    function lay() { var W = api.w, H = api.h, S = Math.min(W - 24, H - 140, 420); return { S: S, c: S / N, x: (W - S) / 2, y: Math.max(66, (H - S) / 2 + 14) }; }
    function load(t) { var q = LV[t][Math.floor(Math.random() * LV[t].length)]; cars = q.c.map(function (a) { return { r: a[0], c: a[1], len: a[2], h: !!a[3] }; }); pos = cars.map(function (c) { return c.h ? c.c : c.r; }); par = q.m; limit = q.m * 2 + 6; moves = 0; sel = 0; lastK = null; drag = null; wait = 0; }
    function setup() { solved = 0; tmr = LIM; load(0); }
    function reset() { setup(); st = 'play'; }
    function occ(skip) { var g2 = [], r, c; for (r = 0; r < N; r++) { g2.push([]); for (c = 0; c < N; c++) g2[r].push(-1); } cars.forEach(function (q, i) { if (i === skip) return; for (var k = 0; k < q.len; k++) { if (q.h) g2[q.r][pos[i] + k] = i; else g2[pos[i] + k][q.c] = i; } }); return g2; }
    function canStep(i, d) { var q = cars[i], np = pos[i] + d, lo = np, hi = np + q.len - 1; if (lo < 0 || hi > N - 1) return false; var g2 = occ(i), e = d > 0 ? hi : lo; return g2[q.h ? q.r : e][q.h ? e : q.c] < 0; }
    function check() { if (pos[0] >= 4) { solved++; if (api.nota) api.nota(520, 0.15, 'triangle', 0.07); if (solved >= 3) { st = 'win'; return; } wait = 0.9; } }
    function countMove(i, d) { if (!lastK || lastK.i !== i || lastK.d !== d) moves++; lastK = { i: i, d: d }; if (moves > limit) st = 'lose'; }
    function stepKey(d) { if (st !== 'play' || wait > 0) return; var q = cars[sel]; var dd = q.h ? d[0] : d[1]; if (!dd) return; if (canStep(sel, dd)) { pos[sel] += dd; countMove(sel, dd); check(); } }
    function carAt(x, y) { var L = lay(), c = Math.floor((x - L.x) / L.c), r = Math.floor((y - L.y) / L.c); if (r < 0 || r >= N || c < 0 || c >= N) return -1; return occ(-1)[r][c]; }
    setup();
    return {
      pausar: function () { drag = null; },
      dbg: function () { var L = lay(); return { st: st, cars: cars.map(function (q, i) { return { r: q.r, c: q.c, len: q.len, h: q.h, p: pos[i] }; }), moves: moves, limit: limit, solved: solved, x: L.x, y: L.y, cs: L.c, wait: wait, par: par }; },
      down: function (x, y) {
        if (menu()) return; if (wait > 0) return; var i = carAt(x, y); if (i < 0) return; sel = i; var L = lay(), q = cars[i];
        drag = { i: i, start: pos[i], off: (q.h ? x - L.x : y - L.y) / L.c - pos[i] };
      },
      move: function (x, y, pr) {
        if (!drag || pr === false || st !== 'play') return; var L = lay(), q = cars[drag.i], want = Math.round((q.h ? x - L.x : y - L.y) / L.c - drag.off - 0.0);
        want = Math.max(0, Math.min(N - q.len, want));
        while (pos[drag.i] < want && canStep(drag.i, 1)) pos[drag.i]++;
        while (pos[drag.i] > want && canStep(drag.i, -1)) pos[drag.i]--;
      },
      up: function () { if (!drag) return; var i = drag.i; if (pos[i] !== drag.start) { moves++; lastK = null; if (moves > limit) st = 'lose'; else check(); } drag = null; },
      key: function (k, d) {
        if (!d) return; if (st !== 'play') { menu(); return; }
        if (k === 'Space' || k === 'Tab') { sel = (sel + 1) % cars.length; lastK = null; return; }
        if (k === 'ArrowLeft' || k === 'KeyA') stepKey([-1, 0]); else if (k === 'ArrowRight' || k === 'KeyD') stepKey([1, 0]); else if (k === 'ArrowUp' || k === 'KeyW') stepKey([0, -1]); else if (k === 'ArrowDown' || k === 'KeyS') stepKey([0, 1]);
      },
      update: function (dt) { pop += dt; if (st !== 'play') return; tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; return; } if (wait > 0) { wait -= dt; if (wait <= 0) { wait = 0; load(Math.min(2, solved)); } } },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), i, r, c;
        bg('#2a2218', '#100c08');
        g.fillStyle = '#4a3c28'; rr(L.x - 6, L.y - 6, L.S + 12, L.S + 12, 10); g.fill();
        for (r = 0; r < N; r++) for (c = 0; c < N; c++) { g.fillStyle = (r + c) % 2 ? '#5a4a34' : '#54442f'; g.fillRect(L.x + c * L.c, L.y + r * L.c, L.c, L.c); }
        g.fillStyle = '#4a90c0'; g.fillRect(L.x + L.S + 6, L.y + 2 * L.c, 14, L.c); txt('⚓', L.x + L.S + 13, L.y + 2.5 * L.c + 6, 14, '#fff');
        for (i = 0; i < cars.length; i++) {
          var q = cars[i], x = L.x + (q.h ? pos[i] : q.c) * L.c + 4, y = L.y + (q.h ? q.r : pos[i]) * L.c + 4, w = (q.h ? q.len : 1) * L.c - 8, h = (q.h ? 1 : q.len) * L.c - 8;
          g.fillStyle = i === 0 ? CC[0] : CC[1 + (i % 9)]; rr(x, y, w, h, 10); g.fill();
          g.fillStyle = 'rgba(0,0,0,.22)'; if (q.h) { g.fillRect(x + w * 0.2, y + h * 0.18, 3, h * 0.64); g.fillRect(x + w * 0.8, y + h * 0.18, 3, h * 0.64); } else { g.fillRect(x + w * 0.18, y + h * 0.2, w * 0.64, 3); g.fillRect(x + w * 0.18, y + h * 0.8, w * 0.64, 3); }
          if (i === sel && st === 'play') { g.strokeStyle = '#fff'; g.lineWidth = 3; rr(x, y, w, h, 10); g.stroke(); }
        }
        txt(T.dica, W / 2, L.y + L.S + 30, 14, 'rgba(255,255,255,.5)');
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 60 ? '#c0392b' : '#4a90c0');
        hud(T.h1 + ' ' + solved + '/3', T.h2 + ' ' + moves + '/' + limit, true);
        fim(st);
      }
    };
  }
});
