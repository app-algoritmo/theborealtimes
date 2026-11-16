/* Sigrdrífumál — revele a runa guiado pelas pistas. */
BTJogo.registrar({
  canvas: 'jogo-sigrdrifa',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A runa de Sigrdrífa",
    "sub": "Os números mostram quantas casas seguidas devem ser pintadas em cada linha e coluna, na ordem, com pausas entre os grupos. Toque numa casa para pintar; toque de novo para marcar ✕ (vazia) e mais uma vez para limpar. Revele a runa antes que o tempo acabe.",
    "perdeu": "O tempo acabou",
    "v1": "A runa foi revelada!",
    "v2": "No Sigrdrífumál, a valquíria ensina runas a Sigurd. A grade de pistas é invenção.",
    "h1": "Runa",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Sigrdrífa's rune",
    "sub": "The numbers show how many cells in a row must be filled in each row and column, in order, with gaps between the groups. Tap a cell to fill it; tap again to mark ✕ (empty) and once more to clear it. Reveal the rune before time runs out.",
    "perdeu": "Time ran out",
    "v1": "The rune is revealed!",
    "v2": "In the Sigrdrífumál, the valkyrie teaches runes to Sigurd. The clue grid is made up.",
    "h1": "Rune",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Sigrdrífas rune",
    "sub": "Tallene viser hvor mange ruter på rad som skal fylles i hver rad og kolonne, i rekkefølge, med opphold mellom gruppene. Trykk på en rute for å fylle den; trykk igjen for å merke ✕ (tom) og en gang til for å tømme. Avslør runen før tiden er ute.",
    "perdeu": "Tiden gikk ut",
    "v1": "Runen er avslørt!",
    "v2": "I Sigrdrífumál lærer valkyrjen Sigurd runer. Ledetrådrutenettet er diktet opp.",
    "h1": "Rune",
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
    var N = 5, LIM = 150;
    var pat = [], gr = [], rc = [], cc = [], need = 0, tmr = LIM, pop = 0;
    function lay() { var W = api.w, H = api.h, cs = Math.max(34, Math.min((W - 30) / (N + 1.9), (H - 180) / (N + 1.9), 62)), cw = cs * 1.9; return { cs: cs, cw: cw, x: (W - cs * N - cw) / 2 + cw, y: Math.max(84, (H - cs * N - cw) / 2 + cw + 6) }; }
    function runs(a) { var o = [], n = 0; a.forEach(function (v) { if (v) n++; else if (n) { o.push(n); n = 0; } }); if (n) o.push(n); return o.length ? o : [0]; }
    function same(a, b) { return a.length === b.length && a.every(function (v, i) { return v === b[i]; }); }
    function rowOf(m, r) { return m[r].map(function (v) { return v === 1 ? 1 : 0; }); }
    function colOf(m, c) { return m.map(function (row) { return row[c] === 1 ? 1 : 0; }); }
    function setup() { var ok = false; while (!ok) { pat = []; need = 0; for (var r = 0; r < N; r++) { pat.push([]); for (var c = 0; c < N; c++) { var v = Math.random() < 0.55 ? 1 : 0; pat[r].push(v); need += v; } } ok = need >= 12 && need <= 18; for (r = 0; r < N; r++) { if (!rowOf(pat, r).some(Boolean) || !colOf(pat, r).some(Boolean)) ok = false; } }
      rc = []; cc = []; for (var i = 0; i < N; i++) { rc.push(runs(rowOf(pat, i))); cc.push(runs(colOf(pat, i))); } gr = []; for (i = 0; i < N; i++) gr.push(new Array(N).fill(0)); tmr = LIM; }
    function reset() { setup(); st = 'play'; }
    function rowOk(i) { return same(runs(rowOf(gr, i)), rc[i]); }
    function colOk(i) { return same(runs(colOf(gr, i)), cc[i]); }
    function filled() { var n = 0; gr.forEach(function (r) { r.forEach(function (v) { if (v === 1) n++; }); }); return n; }
    function check() { for (var i = 0; i < N; i++) if (!rowOk(i) || !colOk(i)) return; st = 'win'; if (api.nota) api.nota(700, 0.2, 'triangle', 0.06); }
    function tap(r, c) { if (st !== 'play') return; gr[r][c] = (gr[r][c] + 1) % 3; if (api.nota) api.nota(300 + gr[r][c] * 90, 0.04, 'triangle', 0.04); check(); }
    var cur = { r: 0, c: 0 };
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, pat: pat.map(function (r) { return r.slice(); }), gr: gr.map(function (r) { return r.slice(); }), need: need, tmr: tmr, pos: function (r, c) { return { x: L.x + (c + 0.5) * L.cs, y: L.y + (r + 0.5) * L.cs }; } }; },
      down: function (x, y) { if (menu()) return; var L = lay(), c = Math.floor((x - L.x) / L.cs), r = Math.floor((y - L.y) / L.cs); if (r >= 0 && c >= 0 && r < N && c < N) { cur = { r: r, c: c }; tap(r, c); } },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'ArrowUp') cur.r = (cur.r + N - 1) % N; else if (k === 'ArrowDown') cur.r = (cur.r + 1) % N; else if (k === 'ArrowLeft') cur.c = (cur.c + N - 1) % N; else if (k === 'ArrowRight') cur.c = (cur.c + 1) % N; else if (k === 'Space' || k === 'Enter') tap(cur.r, cur.c); },
      update: function (dt) { pop += dt; if (st !== 'play') return; tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; } },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), r, c, i;
        bg('#1a1a2a', '#06060c');
        for (i = 0; i < N; i++) { var okr = rowOk(i), okc = colOk(i); txt(rc[i].join(' '), L.x - 8 - (rc[i].length * L.cs * 0.14), L.y + (i + 0.5) * L.cs + L.cs * 0.14, L.cs * 0.36, okr ? 'rgba(255,255,255,.35)' : '#ffd88a'); for (var k = 0; k < cc[i].length; k++) txt(String(cc[i][k]), L.x + (i + 0.5) * L.cs, L.y - 8 - (cc[i].length - 1 - k) * L.cs * 0.4, L.cs * 0.36, okc ? 'rgba(255,255,255,.35)' : '#ffd88a'); }
        for (r = 0; r < N; r++) for (c = 0; c < N; c++) { var x = L.x + c * L.cs, y = L.y + r * L.cs, v = gr[r][c]; g.fillStyle = 'rgba(255,255,255,.07)'; g.fillRect(x + 1.5, y + 1.5, L.cs - 3, L.cs - 3); if (v === 1) { g.fillStyle = '#9ac0e8'; rr(x + 4, y + 4, L.cs - 8, L.cs - 8, 6); g.fill(); } else if (v === 2) txt('✕', x + L.cs / 2, y + L.cs * 0.66, L.cs * 0.5, 'rgba(255,255,255,.4)'); if (cur.r === r && cur.c === c && st === 'play') { g.strokeStyle = 'rgba(255,255,255,.4)'; g.lineWidth = 2; g.strokeRect(x + 3, y + 3, L.cs - 6, L.cs - 6); } }
        g.strokeStyle = 'rgba(255,216,138,.5)'; g.lineWidth = 2; g.strokeRect(L.x, L.y, L.cs * N, L.cs * N);
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 30 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + filled() + '/' + need, T.h2 + ' ' + Math.ceil(tmr), false);
        fim(st);
      }
    };
  }
});
