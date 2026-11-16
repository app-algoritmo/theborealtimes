/* Ridgeway Hill — complete a tabela com dois símbolos. */
BTJogo.registrar({
  canvas: 'jogo-ridgeway',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A tabela de Ridgeway",
    "sub": "Preencha a grade com dois símbolos (toque para alternar: vazio → ◯ → ●). Regras: nunca três iguais em seguida, na horizontal ou na vertical; cada linha e cada coluna tem três de cada. Casas douradas já vêm preenchidas. Conflitos ficam vermelhos.",
    "perdeu": "O tempo acabou",
    "v1": "A tabela está completa!",
    "v2": "Em Ridgeway Hill (Dorset), foi achada uma sepultura coletiva do tempo viking. O quebra-cabeça de símbolos é invenção.",
    "h1": "Preenchidas",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Ridgeway's table",
    "sub": "Fill the grid with two symbols (tap to cycle: empty → ◯ → ●). Rules: never three of a kind in a row, horizontally or vertically; every row and every column has three of each. Golden cells come filled in. Conflicts turn red.",
    "perdeu": "Time ran out",
    "v1": "The table is complete!",
    "v2": "At Ridgeway Hill (Dorset), a mass grave from the Viking age was found. The symbol puzzle is made up.",
    "h1": "Filled",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Ridgeways tabell",
    "sub": "Fyll rutenettet med to symboler (trykk for å bytte: tom → ◯ → ●). Regler: aldri tre like på rad, verken vannrett eller loddrett; hver rad og hver kolonne har tre av hver. Gylne ruter er ferdig utfylt. Konflikter blir røde.",
    "perdeu": "Tiden gikk ut",
    "v1": "Tabellen er fullført!",
    "v2": "Ved Ridgeway Hill (Dorset) ble en massegrav fra vikingtiden funnet. Symbolgåten er diktet opp.",
    "h1": "Fylt",
    "h2": "Tid"
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
    var N = 6, LIM = 240;
    var sol = [], cl = [], gr = [], tmr = LIM, pop = 0, holes = 0;
    function lay() { var W = api.w, H = api.h, cs = Math.max(34, Math.min((W - 24) / N, (H - 160) / N, 66)); return { cs: cs, x: (W - cs * N) / 2, y: Math.max(88, (H - cs * N) / 2 + 12) }; }
    function shuf(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
    function okPart(b, r, c, v) { var i, n = 0, m = 0; if (c >= 2 && b[r][c - 1] === v && b[r][c - 2] === v) return false; if (r >= 2 && b[r - 1][c] === v && b[r - 2][c] === v) return false; for (i = 0; i < c; i++) if (b[r][i] === v) n++; if (n >= N / 2) return false; for (i = 0; i < r; i++) if (b[i][c] === v) m++; if (m >= N / 2) return false; return true; }
    function solveCount(b, lim) { var i = -1, r, c; for (var k = 0; k < N * N; k++) if (!b[Math.floor(k / N)][k % N]) { i = k; break; } if (i < 0) return fullOk(b) ? 1 : 0; r = Math.floor(i / N); c = i % N; var n = 0; for (var v = 1; v <= 2; v++) { b[r][c] = v; if (partOk(b, r, c)) { n += solveCount(b, lim - n); } b[r][c] = 0; if (n >= lim) return n; } return n; }
    function partOk(b, r, c) { var v = b[r][c], k, a = 0, d = 0; for (k = 0; k < N; k++) { if (b[r][k] === v) a++; if (b[k][c] === v) d++; } if (a > N / 2 || d > N / 2) return false; for (k = 0; k + 2 < N; k++) { if (b[r][k] && b[r][k] === b[r][k + 1] && b[r][k] === b[r][k + 2]) return false; if (b[k][c] && b[k][c] === b[k + 1][c] && b[k][c] === b[k + 2][c]) return false; } return true; }
    function fullOk(b) { for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) { if (!b[r][c] || !partOk(b, r, c)) return false; } return true; }
    function gen() { var b; for (var tries = 0; tries < 200; tries++) { b = []; for (var r = 0; r < N; r++) b.push(new Array(N).fill(0)); var good = (function fill(i) { if (i === N * N) return true; var r = Math.floor(i / N), c = i % N, vs = shuf([1, 2]); for (var k = 0; k < 2; k++) if (okPart(b, r, c, vs[k])) { b[r][c] = vs[k]; if (fill(i + 1)) return true; b[r][c] = 0; } return false; })(0); if (good) break; }
      sol = b.map(function (x) { return x.slice(); }); var cells = shuf(Array.apply(null, Array(N * N)).map(function (_, i) { return i; })), p = b.map(function (x) { return x.slice(); }); holes = 0;
      cells.forEach(function (i) { if (holes >= 20) return; var r = Math.floor(i / N), c = i % N, keep = p[r][c]; p[r][c] = 0; var q = p.map(function (x) { return x.slice(); }); if (solveCount(q, 2) === 1) holes++; else p[r][c] = keep; });
      cl = p.map(function (row) { return row.map(function (v) { return v > 0; }); }); gr = p.map(function (x) { return x.slice(); }); }
    function setup() { gen(); tmr = LIM; }
    function reset() { setup(); st = 'play'; }
    function conflict(r, c) { var v = gr[r][c]; if (!v) return false; var k, a = 0, d = 0; for (k = 0; k < N; k++) { if (gr[r][k] === v) a++; if (gr[k][c] === v) d++; } if (a > N / 2 || d > N / 2) return true; for (k = 0; k + 2 < N; k++) { if (gr[r][k] === v && gr[r][k + 1] === v && gr[r][k + 2] === v && c >= k && c <= k + 2) return true; if (gr[k][c] === v && gr[k + 1][c] === v && gr[k + 2][c] === v && r >= k && r <= k + 2) return true; } return false; }
    function filled() { var n = 0; for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) if (!cl[r][c] && gr[r][c]) n++; return n; }
    function check() { for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) if (gr[r][c] !== sol[r][c]) return; st = 'win'; if (api.nota) api.nota(660, 0.2, 'triangle', 0.06); }
    function tap(r, c) { if (st !== 'play' || cl[r][c]) return; gr[r][c] = (gr[r][c] + 1) % 3; if (api.nota) api.nota(300 + gr[r][c] * 90, 0.04, 'triangle', 0.04); check(); }
    var cur = { r: 0, c: 0 };
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, sol: sol.map(function (r) { return r.slice(); }), gr: gr.map(function (r) { return r.slice(); }), cl: cl, holes: holes, tmr: tmr, pos: function (r, c) { return { x: L.x + (c + 0.5) * L.cs, y: L.y + (r + 0.5) * L.cs }; } }; },
      down: function (x, y) { if (menu()) return; var L = lay(), c = Math.floor((x - L.x) / L.cs), r = Math.floor((y - L.y) / L.cs); if (r >= 0 && c >= 0 && r < N && c < N) { cur = { r: r, c: c }; tap(r, c); } },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'ArrowUp') cur.r = (cur.r + N - 1) % N; else if (k === 'ArrowDown') cur.r = (cur.r + 1) % N; else if (k === 'ArrowLeft') cur.c = (cur.c + N - 1) % N; else if (k === 'ArrowRight') cur.c = (cur.c + 1) % N; else if (k === 'Space' || k === 'Enter') tap(cur.r, cur.c); },
      update: function (dt) { pop += dt; if (st !== 'play') return; tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; } },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), r, c;
        bg('#26221a', '#0a0804');
        for (r = 0; r < N; r++) for (c = 0; c < N; c++) { var x = L.x + c * L.cs, y = L.y + r * L.cs, v = gr[r][c], bad = conflict(r, c); g.fillStyle = cl[r][c] ? 'rgba(255,216,138,.22)' : 'rgba(255,255,255,.07)'; if (bad) g.fillStyle = 'rgba(192,57,43,.45)'; g.fillRect(x + 1.5, y + 1.5, L.cs - 3, L.cs - 3); if (cur.r === r && cur.c === c && st === 'play') { g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 2; g.strokeRect(x + 3, y + 3, L.cs - 6, L.cs - 6); }
          if (v === 1) { g.strokeStyle = '#ffd88a'; g.lineWidth = Math.max(3, L.cs * 0.09); g.beginPath(); g.arc(x + L.cs / 2, y + L.cs / 2, L.cs * 0.28, 0, 6.283); g.stroke(); } else if (v === 2) { g.fillStyle = '#9ac0e8'; g.beginPath(); g.arc(x + L.cs / 2, y + L.cs / 2, L.cs * 0.28, 0, 6.283); g.fill(); } }
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 40 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + filled() + '/' + holes, T.h2 + ' ' + Math.ceil(tmr), false);
        fim(st);
      }
    };
  }
});
