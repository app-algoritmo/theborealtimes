/* Dorestad — junte mercadorias iguais no cais antes que as trocas acabem. */
BTJogo.registrar({
  canvas: 'jogo-dorestad',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O cais de Dorestad",
    "sub": "Toque numa mercadoria e depois numa vizinha (ou arraste) para trocá-las. A troca só vale se juntar três ou mais iguais, em linha ou coluna. Junte 70 mercadorias com 16 trocas, antes de 150 segundos.",
    "perdeu": "As trocas ou o tempo acabaram",
    "v1": "O cais está abastecido!",
    "v2": "Dorestad, porto comercial do Baixo Reno, foi atacado por vikings a partir de 834. A troca de mercadorias é invenção do jogo.",
    "h1": "Mercadorias",
    "h2": "Trocas"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The quay of Dorestad",
    "sub": "Tap a good and then a neighbour (or drag) to swap them. The swap only counts if it joins three or more of a kind, in a row or a column. Gather 70 goods with 16 swaps, within 150 seconds.",
    "perdeu": "The swaps or the time ran out",
    "v1": "The quay is stocked!",
    "v2": "Dorestad, a trading port on the Lower Rhine, was attacked by Vikings from 834. The swapping of goods is made up for the game.",
    "h1": "Goods",
    "h2": "Swaps"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Kaia i Dorestad",
    "sub": "Trykk på en vare og så på en nabo (eller dra) for å bytte dem. Byttet teller bare hvis det slår sammen tre eller flere like, i rad eller kolonne. Samle 70 varer med 16 bytter, innen 150 sekunder.",
    "perdeu": "Byttene eller tiden tok slutt",
    "v1": "Kaia er fylt opp!",
    "v2": "Dorestad, en handelsby ved nedre Rhinen, ble angrepet av vikinger fra 834. Varebyttet er diktet opp for spillet.",
    "h1": "Varer",
    "h2": "Bytter"
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
    var N = 6, K = 5, GOAL = 70, SW = 16, LIM = 150;
    var COL = ['#a0643a', '#4a8ad0', '#9a9a9a', '#5fc8d8', '#e0c040'];
    var b = [], swaps = 0, cleared = 0, t = 0, busy = 0, sel = -1, ds = -1, pend = null, mark = [];
    function lay() { var W = api.w, H = api.h, cs = Math.max(34, Math.min((W - 24) / N, (H - 170) / N, 70)); return { cs: cs, x: (W - cs * N) / 2, y: Math.max(92, (H - cs * N) / 2 + 12) }; }
    function rnd() { return Math.floor(Math.random() * K); }
    function runs(bb) { var m = {}, r, c, k, n = 0; for (r = 0; r < N; r++) for (c = 0; c < N - 2; c++) { var v = bb[r * N + c]; if (v < 0) continue; if (bb[r * N + c + 1] === v && bb[r * N + c + 2] === v) { m[r * N + c] = m[r * N + c + 1] = m[r * N + c + 2] = 1; } } for (c = 0; c < N; c++) for (r = 0; r < N - 2; r++) { var w = bb[r * N + c]; if (w < 0) continue; if (bb[(r + 1) * N + c] === w && bb[(r + 2) * N + c] === w) { m[r * N + c] = m[(r + 1) * N + c] = m[(r + 2) * N + c] = 1; } } return Object.keys(m).map(Number); }
    function hasMove(bb) { for (var i = 0; i < N * N; i++) { var r = Math.floor(i / N), c = i % N, nb = []; if (c < N - 1) nb.push(i + 1); if (r < N - 1) nb.push(i + N); for (var k = 0; k < nb.length; k++) { var q = bb.slice(), j = nb[k], tmp = q[i]; q[i] = q[j]; q[j] = tmp; if (runs(q).length) return true; } } return false; }
    function fresh() { var q; do { q = []; for (var i = 0; i < N * N; i++) q.push(rnd()); } while (runs(q).length || !hasMove(q)); return q; }
    function setup() { b = fresh(); swaps = 0; cleared = 0; t = 0; busy = 0; sel = -1; ds = -1; pend = null; mark = []; }
    function reset() { setup(); st = 'play'; }
    function adj(a, c) { var d = Math.abs(a - c); return (d === N) || (d === 1 && Math.floor(a / N) === Math.floor(c / N)); }
    function trySwap(a, c) { if (st !== 'play' || busy > 0) return; var q = b.slice(), tmp = q[a]; q[a] = q[c]; q[c] = tmp; sel = -1; ds = -1; if (runs(q).length) { b = q; swaps++; busy = 0.3; pend = 'clear'; if (api.nota) api.nota(420, 0.06, 'triangle', 0.05); } else { if (api.nota) api.nota(150, 0.08, 'square', 0.04); busy = 0.15; } }
    function resolve() { var m = runs(b); if (!m.length) { pend = null; if (cleared >= GOAL) { st = 'win'; return; } if (swaps >= SW) { st = 'lose'; return; } if (!hasMove(b)) { b = fresh(); } return; } cleared += m.length; if (api.nota) api.nota(520 + Math.min(m.length, 8) * 40, 0.1, 'triangle', 0.06); m.forEach(function (i) { b[i] = -1; }); for (var c = 0; c < N; c++) { var col = []; for (var r = N - 1; r >= 0; r--) if (b[r * N + c] >= 0) col.push(b[r * N + c]); while (col.length < N) col.push(rnd()); for (r = N - 1; r >= 0; r--) b[r * N + c] = col[N - 1 - r]; } busy = 0.3; pend = 'clear'; }
    function tile(x, y) { var L = lay(), c = Math.floor((x - L.x) / L.cs), r = Math.floor((y - L.y) / L.cs); return (r >= 0 && r < N && c >= 0 && c < N) ? r * N + c : -1; }
    setup();
    return {
      pausar: function () { ds = -1; },
      dbg: function () { var L = lay(); return { st: st, b: b.slice(), N: N, swaps: swaps, cleared: cleared, goal: GOAL, sw: SW, busy: busy > 0, t: t, tmr: LIM - t, pos: function (i) { return { x: L.x + (i % N + 0.5) * L.cs, y: L.y + (Math.floor(i / N) + 0.5) * L.cs }; }, runs: runs }; },
      down: function (x, y) { if (menu()) return; var i = tile(x, y); if (i < 0) return; if (sel >= 0 && adj(sel, i)) { trySwap(sel, i); return; } sel = i; ds = i; },
      move: function (x, y, pr) { if (!pr || ds < 0) return; var i = tile(x, y); if (i >= 0 && i !== ds && adj(ds, i)) { trySwap(ds, i); } },
      up: function () { ds = -1; },
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) { if (st !== 'play') return; t += dt; if (t >= LIM) { t = LIM; st = 'lose'; return; } if (busy > 0) { busy -= dt; if (busy <= 0) { busy = 0; if (pend === 'clear') resolve(); } } },
      draw: function () {
        var L = lay(), W = api.w, H = api.h, i;
        bg('#1a2a3a', '#06090e');
        g.fillStyle = 'rgba(0,0,0,.35)'; rr(L.x - 5, L.y - 5, L.cs * N + 10, L.cs * N + 10, 10); g.fill();
        var mk = (busy > 0 && pend === 'clear') ? runs(b) : [];
        for (i = 0; i < N * N; i++) { var v = b[i]; if (v < 0) continue; var x = L.x + (i % N) * L.cs, y = L.y + Math.floor(i / N) * L.cs, cx = x + L.cs / 2, cy = y + L.cs / 2, r0 = L.cs * 0.34; g.fillStyle = 'rgba(255,255,255,.06)'; g.fillRect(x + 1, y + 1, L.cs - 2, L.cs - 2); g.fillStyle = COL[v]; g.beginPath();
          if (v === 0) g.arc(cx, cy, r0, 0, 6.283); else if (v === 1) g.rect(cx - r0, cy - r0, r0 * 2, r0 * 2); else if (v === 2) { g.moveTo(cx, cy - r0 * 1.1); g.lineTo(cx + r0 * 1.1, cy + r0 * 0.9); g.lineTo(cx - r0 * 1.1, cy + r0 * 0.9); g.closePath(); } else if (v === 3) { g.moveTo(cx, cy - r0 * 1.2); g.lineTo(cx + r0 * 1.1, cy); g.lineTo(cx, cy + r0 * 1.2); g.lineTo(cx - r0 * 1.1, cy); g.closePath(); } else { for (var k = 0; k < 6; k++) { var a = k * 1.0472 + 0.5236; g.lineTo(cx + Math.cos(a) * r0 * 1.1, cy + Math.sin(a) * r0 * 1.1); } g.closePath(); }
          g.fill(); if (mk.indexOf(i) >= 0) { g.strokeStyle = '#fff'; g.lineWidth = 3; g.stroke(); } if (i === sel) { g.strokeStyle = '#ffd88a'; g.lineWidth = 3; g.strokeRect(x + 3, y + 3, L.cs - 6, L.cs - 6); } }
        bar(W / 2 - 110, H - 14, 220, 5, (LIM - t) / LIM, LIM - t < 25 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + Math.min(cleared, GOAL) + '/' + GOAL, T.h2 + ' ' + (SW - swaps), SW - swaps <= 3);
        fim(st);
      }
    };
  }
});
