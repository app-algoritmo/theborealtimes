/* Repton — preencha a grade sem repetir símbolos. */
BTJogo.registrar({
  canvas: 'jogo-repton',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A grade de Repton",
    "sub": "Preencha cada linha, coluna e quadrado de 2×2 com os números de 1 a 4, sem repetir. Toque numa casa vazia e depois num número embaixo (✕ apaga). Números repetidos ficam vermelhos. Tempo limitado.",
    "perdeu": "O tempo acabou",
    "v1": "A grade está completa!",
    "v2": "Em Repton (Derbyshire), o Grande Exército passou o inverno de 873–874. A grade numérica do jogo é invenção.",
    "h1": "Preenchidas",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Repton's grid",
    "sub": "Fill every row, column and 2×2 square with the numbers 1 to 4, without repeats. Tap an empty cell and then a number below (✕ erases). Repeated numbers turn red. Time is limited.",
    "perdeu": "Time ran out",
    "v1": "The grid is complete!",
    "v2": "At Repton (Derbyshire), the Great Army wintered in 873–874. The number grid in the game is made up.",
    "h1": "Filled",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Reptons rutenett",
    "sub": "Fyll hver rad, kolonne og 2×2-rute med tallene 1 til 4, uten gjentakelser. Trykk på en tom rute og så på et tall under (✕ visker ut). Gjentatte tall blir røde. Tiden er begrenset.",
    "perdeu": "Tiden gikk ut",
    "v1": "Rutenettet er fullført!",
    "v2": "I Repton (Derbyshire) overvintret Den store hæren i 873–874. Tallrutenettet i spillet er diktet opp.",
    "h1": "Fylt",
    "h2": "Tid"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "La cuadrícula de Repton",
    "sub": "Rellena cada fila, columna y cuadrado de 2×2 con los números del 1 al 4, sin repetir. Toca una casilla vacía y después un número de abajo (✕ borra). Los números repetidos se ponen en rojo. Tiempo limitado.",
    "perdeu": "Se acabó el tiempo",
    "v1": "¡La cuadrícula está completa!",
    "v2": "En Repton (Derbyshire), el Gran Ejército pasó el invierno de 873–874. La cuadrícula numérica del juego es invención.",
    "h1": "Rellenas",
    "h2": "Tiempo"
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
    var LIM = 180;
    var sol = [], cl = [], gr = [], sel = null, tmr = LIM, pop = 0, holes = 0;
    function lay() { var W = api.w, H = api.h, cs = Math.max(40, Math.min((W - 30) / 4, (H - 250) / 4, 84)); var x = (W - cs * 4) / 2, y = Math.max(86, (H - cs * 4 - 80) / 2); return { cs: cs, x: x, y: y, py: y + cs * 4 + 28, ps: Math.min(cs * 0.9, 64) }; }
    function shuf(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
    function okAt(b, r, c, v) { for (var i = 0; i < 4; i++) { if (i !== c && b[r][i] === v) return false; if (i !== r && b[i][c] === v) return false; } var br = r - r % 2, bc = c - c % 2; for (var a = 0; a < 2; a++) for (var d = 0; d < 2; d++) { var rr_ = br + a, cc = bc + d; if ((rr_ !== r || cc !== c) && b[rr_][cc] === v) return false; } return true; }
    function count(b, lim) { for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) if (!b[r][c]) { var n = 0; for (var v = 1; v <= 4; v++) if (okAt(b, r, c, v)) { b[r][c] = v; n += count(b, lim - n); b[r][c] = 0; if (n >= lim) return n; } return n; } return 1; }
    function gen() { var b = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]; (function fill(i) { if (i === 16) return true; var r = Math.floor(i / 4), c = i % 4, vs = shuf([1, 2, 3, 4]); for (var k = 0; k < 4; k++) if (okAt(b, r, c, vs[k])) { b[r][c] = vs[k]; if (fill(i + 1)) return true; b[r][c] = 0; } return false; })(0);
      sol = b.map(function (x) { return x.slice(); }); var cells = shuf([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]), p = b.map(function (x) { return x.slice(); }); holes = 0;
      cells.forEach(function (i) { if (holes >= 9) return; var r = Math.floor(i / 4), c = i % 4, keep = p[r][c]; p[r][c] = 0; var q = p.map(function (x) { return x.slice(); }); if (count(q, 2) === 1) holes++; else p[r][c] = keep; });
      cl = p.map(function (row) { return row.map(function (v) { return v > 0; }); }); gr = p.map(function (x) { return x.slice(); }); }
    function setup() { gen(); sel = null; tmr = LIM; }
    function reset() { setup(); st = 'play'; }
    function conflict(r, c) { var v = gr[r][c]; if (!v) return false; return !okAt(gr, r, c, v); }
    function filled() { var n = 0; for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) if (!cl[r][c] && gr[r][c]) n++; return n; }
    function check() { for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) if (gr[r][c] !== sol[r][c]) return; st = 'win'; if (api.nota) api.nota(660, 0.2, 'triangle', 0.06); }
    function place(v) { if (st !== 'play' || !sel || cl[sel.r][sel.c]) return; gr[sel.r][sel.c] = v; if (api.nota) api.nota(380 + v * 40, 0.05, 'triangle', 0.04); check(); }
    function palAt(x, y) { var L = lay(); for (var i = 0; i < 5; i++) { var px = L.x + L.cs * 2 + (i - 2) * (L.ps + 8), py = L.py + L.ps / 2; if (Math.abs(x - px) < L.ps / 2 + 3 && Math.abs(y - py) < L.ps / 2 + 3) return i; } return -1; }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, sol: sol.map(function (r) { return r.slice(); }), gr: gr.map(function (r) { return r.slice(); }), cl: cl, holes: holes, tmr: tmr, pos: function (r, c) { return { x: L.x + (c + 0.5) * L.cs, y: L.y + (r + 0.5) * L.cs }; }, pal: function (i) { return { x: L.x + L.cs * 2 + (i - 2) * (L.ps + 8), y: L.py + L.ps / 2 }; } }; },
      down: function (x, y) { if (menu()) return; var L = lay(), p = palAt(x, y); if (p >= 0) { place(p === 4 ? 0 : p + 1); return; } var c = Math.floor((x - L.x) / L.cs), r = Math.floor((y - L.y) / L.cs); if (r >= 0 && c >= 0 && r < 4 && c < 4) sel = { r: r, c: c }; },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (!sel) sel = { r: 0, c: 0 }; if (k === 'ArrowUp') sel.r = (sel.r + 3) % 4; else if (k === 'ArrowDown') sel.r = (sel.r + 1) % 4; else if (k === 'ArrowLeft') sel.c = (sel.c + 3) % 4; else if (k === 'ArrowRight') sel.c = (sel.c + 1) % 4; else if (/^Digit[1-4]$/.test(k)) place(+k.slice(5)); else if (k === 'Backspace' || k === 'Digit0' || k === 'Delete') place(0); },
      update: function (dt) { pop += dt; if (st !== 'play') return; tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; } },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), r, c, i;
        bg('#2a2418', '#0c0a06');
        for (r = 0; r < 4; r++) for (c = 0; c < 4; c++) { var x = L.x + c * L.cs, y = L.y + r * L.cs; g.fillStyle = cl[r][c] ? 'rgba(255,216,138,.18)' : 'rgba(255,255,255,.07)'; if (sel && sel.r === r && sel.c === c) g.fillStyle = 'rgba(255,255,255,.28)'; g.fillRect(x + 1, y + 1, L.cs - 2, L.cs - 2); if (gr[r][c]) txt(String(gr[r][c]), x + L.cs / 2, y + L.cs * 0.68, L.cs * 0.55, conflict(r, c) ? '#ff6a5a' : cl[r][c] ? '#ffd88a' : '#fff'); }
        g.strokeStyle = 'rgba(255,216,138,.7)'; g.lineWidth = 3; g.strokeRect(L.x, L.y, L.cs * 4, L.cs * 4); g.beginPath(); g.moveTo(L.x + L.cs * 2, L.y); g.lineTo(L.x + L.cs * 2, L.y + L.cs * 4); g.moveTo(L.x, L.y + L.cs * 2); g.lineTo(L.x + L.cs * 4, L.y + L.cs * 2); g.stroke();
        for (i = 0; i < 5; i++) { var q = { x: L.x + L.cs * 2 + (i - 2) * (L.ps + 8), y: L.py + L.ps / 2 }; g.fillStyle = 'rgba(255,216,138,.2)'; rr(q.x - L.ps / 2, q.y - L.ps / 2, L.ps, L.ps, 10); g.fill(); txt(i === 4 ? '✕' : String(i + 1), q.x, q.y + L.ps * 0.17, L.ps * 0.5, '#fff'); }
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 30 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + filled() + '/' + holes, T.h2 + ' ' + Math.ceil(tmr), false);
        fim(st);
      }
    };
  }
});
