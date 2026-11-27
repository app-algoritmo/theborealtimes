/* Salme — troque os achados da sepultura em linhas de três. */
BTJogo.registrar({
  canvas: 'jogo-salme',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os achados de Salme",
    "sub": "Toque numa peça e depois numa vizinha (ou arraste) para trocá-las de lugar. Forme linhas de três ou mais iguais para recolher os achados. Recolha 120 em 20 jogadas.",
    "perdeu": "As jogadas acabaram",
    "v1": "Todos os achados recolhidos!",
    "v2": "Em Salme, na ilha de Saaremaa, escavaram-se navios com guerreiros e objetos. Os desenhos de achados no jogo são invenção.",
    "h1": "Achados",
    "h2": "Jogadas"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The finds of Salme",
    "sub": "Tap a piece and then a neighbour (or drag) to swap them. Make lines of three or more of a kind to collect the finds. Collect 120 in 20 moves.",
    "perdeu": "The moves ran out",
    "v1": "All the finds collected!",
    "v2": "At Salme, on the island of Saaremaa, ships with warriors and objects were excavated. The find icons in the game are made up.",
    "h1": "Finds",
    "h2": "Moves"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Funnene fra Salme",
    "sub": "Trykk på en brikke og så på en nabo (eller dra) for å bytte dem. Lag rader med tre eller flere like for å samle funnene. Samle 120 på 20 trekk.",
    "perdeu": "Trekkene var brukt opp",
    "v1": "Alle funnene er samlet!",
    "v2": "I Salme på øya Saaremaa ble skip med krigere og gjenstander gravd ut. Funnbildene i spillet er diktet opp.",
    "h1": "Funn",
    "h2": "Trekk"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "Los hallazgos de Salme",
    "sub": "Toca una pieza y luego una vecina (o arrastra) para intercambiarlas. Forma líneas de tres o más iguales para recoger los hallazgos. Recoge 120 en 20 jugadas.",
    "perdeu": "Se acabaron las jugadas",
    "v1": "¡Todos los hallazgos recogidos!",
    "v2": "En Salme, en la isla de Saaremaa, se excavaron barcos con guerreros y objetos. Los dibujos de hallazgos del juego son invención.",
    "h1": "Hallazgos",
    "h2": "Jugadas"
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
    var N = 7, K = 5, GOAL = 120, MOVES = 20, LIM = 180;
    var gr = [], sel = null, phase = 'idle', timer = 0, flag = [], cleared = 0, moves = MOVES, tmr = LIM, pop = 0, down_ = false, st0 = null;
    var COL = ['#c0392b', '#e0b040', '#4a8ad0', '#5aa05a', '#9a6ab0'], SYM = ['⚔', '◉', '⚓', '▲', '✦'];
    function lay() { var W = api.w, H = api.h, cs = Math.max(30, Math.min((W - 20) / N, (H - 160) / N, 62)); return { cs: cs, x: (W - cs * N) / 2, y: Math.max(88, (H - cs * N) / 2 + 10) }; }
    function rnd() { return Math.floor(Math.random() * K); }
    function matches(b) { var f = [], r, c; for (r = 0; r < N; r++) f.push(new Array(N).fill(false)); for (r = 0; r < N; r++) for (c = 0; c < N - 2; c++) { var v = b[r][c]; if (v >= 0 && v === b[r][c + 1] && v === b[r][c + 2]) { f[r][c] = f[r][c + 1] = f[r][c + 2] = true; } } for (c = 0; c < N; c++) for (r = 0; r < N - 2; r++) { var w = b[r][c]; if (w >= 0 && w === b[r + 1][c] && w === b[r + 2][c]) { f[r][c] = f[r + 1][c] = f[r + 2][c] = true; } } return f; }
    function cnt(f) { var n = 0; f.forEach(function (row) { row.forEach(function (x) { if (x) n++; }); }); return n; }
    function validMoves() { var out = [], r, c; for (r = 0; r < N; r++) for (c = 0; c < N; c++) { [[0, 1], [1, 0]].forEach(function (d) { var r2 = r + d[0], c2 = c + d[1]; if (r2 >= N || c2 >= N) return; var b = gr.map(function (x) { return x.slice(); }); var t = b[r][c]; b[r][c] = b[r2][c2]; b[r2][c2] = t; var n = cnt(matches(b)); if (n) out.push({ r: r, c: c, r2: r2, c2: c2, n: n }); }); } return out; }
    function fresh() { do { gr = []; for (var r = 0; r < N; r++) { gr.push([]); for (var c = 0; c < N; c++) gr[r].push(rnd()); } } while (cnt(matches(gr)) || !validMoves().length); }
    function setup() { fresh(); sel = null; phase = 'idle'; cleared = 0; moves = MOVES; tmr = LIM; flag = []; }
    function reset() { setup(); st = 'play'; }
    function collapse() { for (var c = 0; c < N; c++) { var col = []; for (var r = N - 1; r >= 0; r--) if (!flag[r][c]) col.push(gr[r][c]); while (col.length < N) col.push(rnd()); for (r = N - 1; r >= 0; r--) gr[r][c] = col[N - 1 - r]; } }
    function after() { var f = matches(gr), n = cnt(f); if (n) { flag = f; phase = 'flash'; timer = 0.25; if (api.nota) api.nota(400 + n * 20, 0.08, 'triangle', 0.05); return; } phase = 'idle'; if (cleared >= GOAL) { st = 'win'; return; } if (moves <= 0) { st = 'lose'; return; } if (!validMoves().length) fresh(); }
    function trySwap(r, c, r2, c2) { if (phase !== 'idle' || st !== 'play') return; var t = gr[r][c]; gr[r][c] = gr[r2][c2]; gr[r2][c2] = t; if (!cnt(matches(gr))) { t = gr[r][c]; gr[r][c] = gr[r2][c2]; gr[r2][c2] = t; if (api.nota) api.nota(120, 0.12, 'sawtooth', 0.05); return; } moves--; after(); }
    function cellAt(x, y) { var L = lay(), c = Math.floor((x - L.x) / L.cs), r = Math.floor((y - L.y) / L.cs); if (r < 0 || c < 0 || r >= N || c >= N) return null; return { r: r, c: c }; }
    setup();
    return {
      pausar: function () { down_ = false; },
      dbg: function () { var L = lay(); return { st: st, phase: phase, cleared: cleared, moves: moves, moveList: validMoves(), pos: function (r, c) { return { x: L.x + (c + 0.5) * L.cs, y: L.y + (r + 0.5) * L.cs }; }, tmr: tmr, gr: gr.map(function (x) { return x.slice(); }) }; },
      down: function (x, y) { if (menu()) return; if (phase !== 'idle') return; var p = cellAt(x, y); if (!p) { sel = null; return; } if (sel && Math.abs(sel.r - p.r) + Math.abs(sel.c - p.c) === 1) { var s = sel; sel = null; trySwap(s.r, s.c, p.r, p.c); return; } sel = p; st0 = { x: x, y: y }; down_ = true; },
      move: function (x, y, pr) { if (!down_ || !sel || phase !== 'idle' || st !== 'play') return; var L = lay(), dx = x - st0.x, dy = y - st0.y; if (Math.max(Math.abs(dx), Math.abs(dy)) > L.cs * 0.45) { var r2 = sel.r, c2 = sel.c; if (Math.abs(dx) > Math.abs(dy)) c2 += dx > 0 ? 1 : -1; else r2 += dy > 0 ? 1 : -1; var s = sel; sel = null; down_ = false; if (r2 >= 0 && c2 >= 0 && r2 < N && c2 < N) trySwap(s.r, s.c, r2, c2); } },
      up: function () { down_ = false; },
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) {
        pop += dt; if (st !== 'play') return; tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; return; }
        if (phase === 'flash') { timer -= dt; if (timer <= 0) { cleared += cnt(flag); collapse(); flag = []; after(); } }
      },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), r, c;
        bg('#1a2a32', '#080e12');
        g.fillStyle = 'rgba(0,0,0,.3)'; rr(L.x - 5, L.y - 5, L.cs * N + 10, L.cs * N + 10, 10); g.fill();
        for (r = 0; r < N; r++) for (c = 0; c < N; c++) { var v = gr[r][c], x = L.x + c * L.cs, y = L.y + r * L.cs, fl = phase === 'flash' && flag[r] && flag[r][c]; g.fillStyle = fl ? '#fff' : COL[v]; rr(x + 3, y + 3, L.cs - 6, L.cs - 6, 9); g.fill(); if (!fl) txt(SYM[v], x + L.cs / 2, y + L.cs * 0.66, L.cs * 0.5, 'rgba(255,255,255,.9)'); if (sel && sel.r === r && sel.c === c) { g.strokeStyle = '#fff'; g.lineWidth = 3; rr(x + 2, y + 2, L.cs - 4, L.cs - 4, 9); g.stroke(); } }
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 30 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + cleared + '/' + GOAL, T.h2 + ' ' + moves, moves <= 4);
        fim(st);
      }
    };
  }
});
