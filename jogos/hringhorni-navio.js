/* Funeral de Baldr — leve o navio Hringhorni até o mar. */
BTJogo.registrar({
  canvas: 'jogo-hringhorni',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O navio Hringhorni",
    "sub": "Toque numa peça para escolhê-la e toque numa casa livre na mesma fileira (ou coluna) para deslizá-la até lá. Abra caminho para o navio claro e leve-o até a saída, à direita, em até 30 jogadas.",
    "perdeu": "As jogadas ou o tempo acabaram",
    "v1": "O navio chegou ao mar!",
    "v2": "Na Gylfaginning, a giganta Hyrrokkin empurra o navio de Baldr, Hringhorni, para o mar. O quebra-cabeça é invenção.",
    "h1": "Avanço",
    "h2": "Jogadas"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The ship Hringhorni",
    "sub": "Tap a piece to choose it and tap a free square in the same row (or column) to slide it there. Clear a path for the light ship and take it to the exit on the right in 30 moves or fewer.",
    "perdeu": "The moves or the time ran out",
    "v1": "The ship reached the sea!",
    "v2": "In the Gylfaginning, the giantess Hyrrokkin pushes Baldr's ship, Hringhorni, into the sea. The puzzle is made up.",
    "h1": "Progress",
    "h2": "Moves"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Skipet Ringhorne",
    "sub": "Trykk på en brikke for å velge den, og trykk på en ledig rute i samme rad (eller kolonne) for å skyve den dit. Rydd vei for det lyse skipet og før det til utgangen til høyre på maksimalt 30 trekk.",
    "perdeu": "Trekkene eller tiden var brukt opp",
    "v1": "Skipet nådde havet!",
    "v2": "I Gylfaginning skyver jotunkvinnen Hyrrokkin Balders skip, Ringhorne, ut i havet. Gåten er diktet opp.",
    "h1": "Framgang",
    "h2": "Trekk"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "El barco Hringhorni",
    "sub": "Toca una pieza para elegirla y toca una casilla libre en la misma fila (o columna) para deslizarla hasta allí. Abre camino para el barco claro y llévalo hasta la salida, a la derecha, en un máximo de 30 movimientos.",
    "perdeu": "Se acabaron los movimientos o el tiempo",
    "v1": "¡El barco llegó al mar!",
    "v2": "En la Gylfaginning, la giganta Hyrrokkin empuja el barco de Baldr, Hringhorni, hacia el mar. El rompecabezas es un invento.",
    "h1": "Avance",
    "h2": "Movimientos"
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
    var N = 6, MAXM = 30, LIM = 200;
    var pcs = [], sel = -1, moves = 0, tmr = LIM, sol = [], opt = 0, cur = { r: 0, c: 0 };
    var COLS = ['#d8d0b0', '#c0392b', '#4a8ad0', '#7fa86a', '#d8b040', '#9a6ab0', '#e08a4a', '#6a7a8a', '#b04a6a', '#4aa8a0', '#8a6a4a'];
    function lay() { var W = api.w, H = api.h, cs = Math.max(40, Math.min((W - 48) / N, (H - 170) / N, 76)); return { cs: cs, x: (W - cs * N) / 2, y: Math.max(88, (H - cs * N) / 2 + 8) }; }
    function key_(ps) { return ps.map(function (p) { return p.h ? p.x : p.y; }).join(','); }
    function occ(ps, skip) { var m = []; for (var i = 0; i < N; i++) m.push(new Array(N).fill(-1)); ps.forEach(function (p, k) { if (k === skip) return; for (var j = 0; j < p.len; j++) { var r = p.h ? p.y : p.y + j, c = p.h ? p.x + j : p.x; m[r][c] = k; } }); return m; }
    function solve(ps) { var seen = {}, q = [{ ps: ps.map(function (p) { return { x: p.x, y: p.y }; }), path: [] }]; seen[key_(ps.map(function (p, i) { return { h: pcs[i].h, x: p.x, y: p.y }; }))] = 1; var H0 = ps.map(function (p) { return p.h; }), L0 = ps.map(function (p) { return p.len; }); var head = 0;
      while (head < q.length && q.length < 60000) { var cur_ = q[head++], pp = cur_.ps.map(function (p, i) { return { x: p.x, y: p.y, len: L0[i], h: H0[i] }; }); if (pp[0].x + pp[0].len === N) return cur_.path; var m = occ(pp, -1);
        for (var i = 0; i < pp.length; i++) { var p = pp[i]; for (var d = -1; d <= 1; d += 2) { var k = 1; while (true) { var nx = p.h ? p.x + d * k : p.x, ny = p.h ? p.y : p.y + d * k, ok = true; if (nx < 0 || ny < 0 || (p.h ? nx + p.len > N : ny + p.len > N)) break; var edge = d < 0 ? (p.h ? nx : ny) : (p.h ? nx + p.len - 1 : ny + p.len - 1), r = p.h ? p.y : edge, c = p.h ? edge : p.x; if (m[r][c] !== -1) break; var np = cur_.ps.map(function (z) { return { x: z.x, y: z.y }; }); np[i] = { x: nx, y: ny }; var kk = key_(np.map(function (z, j) { return { h: H0[j], x: z.x, y: z.y }; })); if (!seen[kk]) { seen[kk] = 1; q.push({ ps: np, path: cur_.path.concat([[i, p.h ? nx : ny]]) }); } k++; } } } }
      return null; }
    function gen() { for (var tries = 0; tries < 400; tries++) { var ps = [{ x: 0, y: 2, len: 2, h: true }]; var m = occ(ps, -1), n = 0, guard = 0; while (n < 8 + Math.floor(Math.random() * 3) && guard++ < 200) { var h = Math.random() < 0.5, len = Math.random() < 0.3 ? 3 : 2, x = Math.floor(Math.random() * (h ? N - len + 1 : N)), y = Math.floor(Math.random() * (h ? N : N - len + 1)), ok = true; if (h && y === 2) continue; for (var j = 0; j < len; j++) { var r = h ? y : y + j, c = h ? x + j : x; if (m[r][c] !== -1) ok = false; } if (!ok) continue; ps.push({ x: x, y: y, len: len, h: h }); m = occ(ps, -1); n++; }
        pcs = ps; var s = solve(ps); if (s && s.length >= 6 && s.length <= 14) { sol = s; opt = s.length; return; } } }
    function setup() { gen(); sel = -1; moves = 0; tmr = LIM; }
    function reset() { setup(); st = 'play'; }
    function prog() { return Math.min(6, pcs[0].x + 2); }
    function target(p, r, c) { if (p.h) { if (r !== p.y) return null; return c; } if (c !== p.x) return null; return r; }
    function tryMove(i, r, c) { var p = pcs[i], t = target(p, r, c); if (t === null) return false; var from = p.h ? p.x : p.y; if (t + p.len > N) t = N - p.len; if (t < 0) t = 0; if (t === from) return false; var m = occ(pcs, i), a = Math.min(from, t), b = Math.max(from, t) + p.len - 1; for (var k = a; k <= b; k++) { var rr_ = p.h ? p.y : k, cc = p.h ? k : p.x; if (m[rr_][cc] !== -1) return false; } if (p.h) p.x = t; else p.y = t; moves++; if (api.nota) api.nota(280, 0.04, 'triangle', 0.04); return true; }
    function press(r, c) { if (st !== 'play') return; var m = occ(pcs, -1), k = m[r][c]; if (k >= 0 && sel !== k) { sel = k; return; } if (sel >= 0 && k < 0) { var p = pcs[sel], t = target(p, r, c); if (t === null) { sel = -1; return; } var from = p.h ? p.x : p.y; var dest = t > from ? t - p.len + 1 : t; if (dest < 0) dest = 0; if (dest + p.len > N) dest = N - p.len; if (!tryMove(sel, p.h ? p.y : dest, p.h ? dest : p.x)) { return; } } else if (k === sel) { sel = -1; return; }
      if (pcs[0].x + 2 >= N) { st = 'win'; if (api.nota) api.nota(700, 0.2, 'triangle', 0.06); return; } if (moves >= MAXM) st = 'lose'; }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, pcs: pcs.map(function (p) { return { x: p.x, y: p.y, len: p.len, h: p.h }; }), sel: sel, moves: moves, max: MAXM, sol: sol.map(function (s) { return s.slice(); }), opt: opt, tmr: tmr, pos: function (r, c) { return { x: L.x + (c + 0.5) * L.cs, y: L.y + (r + 0.5) * L.cs }; } }; },
      down: function (x, y) { if (menu()) return; var L = lay(), c = Math.floor((x - L.x) / L.cs), r = Math.floor((y - L.y) / L.cs); if (r >= 0 && c >= 0 && r < N && c < N) { cur = { r: r, c: c }; press(r, c); } },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'ArrowUp') cur.r = (cur.r + N - 1) % N; else if (k === 'ArrowDown') cur.r = (cur.r + 1) % N; else if (k === 'ArrowLeft') cur.c = (cur.c + N - 1) % N; else if (k === 'ArrowRight') cur.c = (cur.c + 1) % N; else if (k === 'Space' || k === 'Enter') press(cur.r, cur.c); },
      update: function (dt) { if (st !== 'play') return; tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; } },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), r, c, i;
        bg('#1a2a3a', '#060c12');
        g.fillStyle = 'rgba(0,0,0,.35)'; rr(L.x - 5, L.y - 5, L.cs * N + 10, L.cs * N + 10, 10); g.fill();
        for (r = 0; r < N; r++) for (c = 0; c < N; c++) { g.fillStyle = 'rgba(255,255,255,.05)'; g.fillRect(L.x + c * L.cs + 1, L.y + r * L.cs + 1, L.cs - 2, L.cs - 2); }
        g.fillStyle = 'rgba(255,216,138,.25)'; g.fillRect(L.x + L.cs * N, L.y + 2 * L.cs + 6, 10, L.cs - 12); txt('→', L.x + L.cs * N + 6, L.y + 2.6 * L.cs, 22, '#ffd88a');
        for (i = 0; i < pcs.length; i++) { var p = pcs[i], w = p.h ? p.len * L.cs : L.cs, h = p.h ? L.cs : p.len * L.cs; g.fillStyle = COLS[i % COLS.length]; rr(L.x + p.x * L.cs + 3, L.y + p.y * L.cs + 3, w - 6, h - 6, 10); g.fill(); if (i === 0) { txt('⛵', L.x + (p.x + p.len / 2) * L.cs, L.y + (p.y + 0.68) * L.cs, L.cs * 0.55, '#2a1a08'); } if (sel === i) { g.strokeStyle = '#fff'; g.lineWidth = 3; rr(L.x + p.x * L.cs + 3, L.y + p.y * L.cs + 3, w - 6, h - 6, 10); g.stroke(); } }
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 30 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + prog() + '/6', T.h2 + ' ' + moves + '/' + MAXM, moves >= MAXM - 5);
        fim(st);
      }
    };
  }
});
