/* Bragi, deus da poesia — grade de runas 4x4 (invenção). */
BTJogo.registrar({
  canvas: 'jogo-bragi',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As runas de Bragi",
    "sub": "Preencha a grade de 4 por 4 com quatro runas, sem repetir nenhuma em cada linha, em cada coluna e em cada quadrado de 2 por 2. Toque numa casa vazia e depois numa runa. Até 5 erros e 240 segundos. (Teclado: setas movem, teclas 1 a 4 põem a runa.)",
    "perdeu": "Foram erros demais ou o tempo acabou",
    "v1": "A grade está completa!",
    "v2": "Na Sigrdrífumál, runas são gravadas em várias coisas, entre elas a língua de Bragi, deus da poesia. A grade é invenção.",
    "h1": "Casas",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Bragi's runes",
    "sub": "Fill the 4-by-4 grid with four runes, without repeating any in each row, each column and each 2-by-2 square. Tap an empty square and then a rune. Up to 5 mistakes and 240 seconds. (Keyboard: arrows move, keys 1 to 4 place the rune.)",
    "perdeu": "Too many mistakes or time ran out",
    "v1": "The grid is complete!",
    "v2": "In the Sigrdrífumál, runes are carved on many things, among them the tongue of Bragi, the god of poetry. The grid is invented.",
    "h1": "Squares",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Bragis runer",
    "sub": "Fyll rutenettet på 4 ganger 4 med fire runer, uten å gjenta noen i hver rad, hver kolonne og hvert kvadrat på 2 ganger 2. Trykk på et tomt felt og deretter på en rune. Opptil 5 feil og 240 sekunder. (Tastatur: piler flytter, tast 1 til 4 setter runen.)",
    "perdeu": "For mange feil eller tiden tok slutt",
    "v1": "Rutenettet er fullført!",
    "v2": "I Sigrdrífumál ristes runer på mange ting, blant dem tungen til Bragi, diktningens gud. Rutenettet er oppfunnet.",
    "h1": "Felt",
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
    var N = 4, MAXE = 5, LIM = 240;
    var RUN = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ'], COL = ['#d9a93a', '#4a98b8', '#c0563f', '#4b8a4b'];
    var sol = [], giv = [], val = [], sel = -1, err = 0, t = 0, shk = 0, shc = -1;
    function shuf(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
    function ok(gr, i, v) { var r = Math.floor(i / 4), c = i % 4, k; for (k = 0; k < 4; k++) { if (gr[r * 4 + k] === v && r * 4 + k !== i) return false; if (gr[k * 4 + c] === v && k * 4 + c !== i) return false; } var br = r - r % 2, bc = c - c % 2; for (var a = 0; a < 2; a++) for (var b = 0; b < 2; b++) { var z = (br + a) * 4 + bc + b; if (z !== i && gr[z] === v) return false; } return true; }
    function count(gr, lim) { var i = gr.indexOf(-1); if (i < 0) return 1; var n = 0; for (var v = 0; v < 4; v++) { if (ok(gr, i, v)) { gr[i] = v; n += count(gr, lim - n); gr[i] = -1; if (n >= lim) return n; } } return n; }
    function gen() {
      var sy = shuf([0, 1, 2, 3]), rows = shuf([0, 1]).concat(shuf([2, 3])), cols = shuf([0, 1]).concat(shuf([2, 3]));
      if (Math.random() < 0.5) rows = [rows[2], rows[3], rows[0], rows[1]]; if (Math.random() < 0.5) cols = [cols[2], cols[3], cols[0], cols[1]];
      sol = []; for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) sol.push(sy[(2 * (rows[r] % 2) + Math.floor(rows[r] / 2) + cols[c]) % 4]);
      for (var tr = 0; tr < 300; tr++) {
        var idx = shuf([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]).slice(0, 7), gr = []; for (var i = 0; i < 16; i++) gr.push(-1);
        idx.forEach(function (k) { gr[k] = sol[k]; });
        if (count(gr, 2) === 1) { giv = gr.map(function (v) { return v >= 0; }); val = gr.slice(); return; }
      }
      giv = sol.map(function (v, i) { return i % 2 === 0; }); val = sol.map(function (v, i) { return i % 2 === 0 ? v : -1; });
    }
    function reset() { gen(); sel = -1; err = 0; t = 0; shk = 0; st = 'play'; }
    function lay() { var W = api.w, H = api.h, cs = Math.max(40, Math.min((W - 40) / 4, (H - 200) / 4, 86)), x0 = (W - cs * 4) / 2, y0 = 78; return { cs: cs, x0: x0, y0: y0, py: y0 + cs * 4 + 22 }; }
    function cpos(i) { var L = lay(); return { x: L.x0 + (i % 4 + 0.5) * L.cs, y: L.y0 + (Math.floor(i / 4) + 0.5) * L.cs }; }
    function ppos(k) { var L = lay(), ps = Math.min(L.cs, 70), gp = 12, x0 = (api.w - (ps * 4 + gp * 3)) / 2; return { x: x0 + k * (ps + gp) + ps / 2, y: L.py + ps / 2, ps: ps }; }
    function place(k) {
      if (st !== 'play' || sel < 0 || val[sel] >= 0) return;
      if (k === sol[sel]) { val[sel] = k; sel = -1; if (api.nota) api.nota(500 + k * 80, 0.12, 'triangle', 0.06); if (val.every(function (v) { return v >= 0; })) st = 'win'; }
      else { err++; shk = 0.35; shc = sel; if (api.nota) api.nota(110, 0.25, 'sawtooth', 0.06); if (err >= MAXE) st = 'lose'; }
    }
    function cellAt(x, y) { var L = lay(); for (var i = 0; i < 16; i++) { var p = cpos(i); if (Math.abs(x - p.x) < L.cs / 2 && Math.abs(y - p.y) < L.cs / 2) return i; } return -1; }
    function palAt(x, y) { for (var k = 0; k < 4; k++) { var p = ppos(k); if (Math.abs(x - p.x) < p.ps / 2 + 4 && Math.abs(y - p.y) < p.ps / 2 + 4) return k; } return -1; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, sol: sol.slice(), val: val.slice(), giv: giv.slice(), sel: sel, err: err, t: t, cells: [].concat.apply([], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(function (i) { return [cpos(i)]; })), pal: [0, 1, 2, 3].map(ppos) }; },
      down: function (x, y) { if (menu()) return; var k = palAt(x, y); if (k >= 0) { place(k); return; } var c = cellAt(x, y); if (c >= 0 && val[c] < 0) sel = c; },
      move: function () {}, up: function () {},
      key: function (k, d) {
        if (!d) return; if (st !== 'play') { menu(); return; }
        var m = { Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3, Numpad1: 0, Numpad2: 1, Numpad3: 2, Numpad4: 3 }[k]; if (m !== undefined) { place(m); return; }
        var s = sel < 0 ? 0 : sel, dr = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -4, ArrowDown: 4 }[k]; if (dr) { var n = s + dr; if (sel < 0) n = 0; if (n >= 0 && n < 16 && (Math.abs(dr) === 4 || Math.floor(n / 4) === Math.floor(s / 4))) sel = n; }
      },
      update: function (dt) { if (shk > 0) shk -= dt; if (st !== 'play') return; t += dt; if (t >= LIM) st = 'lose'; },
      draw: function () {
        var L = lay(), i; bg('#2a2438', '#0e0b18');
        for (i = 0; i < 16; i++) {
          var p = cpos(i), v = val[i], dx = (shk > 0 && shc === i) ? Math.sin(shk * 60) * 4 : 0;
          g.fillStyle = v >= 0 ? COL[v] : 'rgba(255,255,255,.08)'; g.globalAlpha = v >= 0 ? (giv[i] ? 1 : 0.85) : 1; rr(p.x - L.cs / 2 + 2 + dx, p.y - L.cs / 2 + 2, L.cs - 4, L.cs - 4, 10); g.fill(); g.globalAlpha = 1;
          if (i === sel) { g.strokeStyle = '#fff'; g.lineWidth = 3; rr(p.x - L.cs / 2 + 2, p.y - L.cs / 2 + 2, L.cs - 4, L.cs - 4, 10); g.stroke(); }
          if (v >= 0) txt(RUN[v], p.x, p.y + L.cs * 0.14, L.cs * 0.46, giv[i] ? '#fff' : 'rgba(255,255,255,.9)');
        }
        g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 2; g.beginPath(); g.moveTo(L.x0 + L.cs * 2, L.y0); g.lineTo(L.x0 + L.cs * 2, L.y0 + L.cs * 4); g.moveTo(L.x0, L.y0 + L.cs * 2); g.lineTo(L.x0 + L.cs * 4, L.y0 + L.cs * 2); g.stroke();
        for (var k = 0; k < 4; k++) { var q = ppos(k); g.fillStyle = COL[k]; rr(q.x - q.ps / 2, q.y - q.ps / 2, q.ps, q.ps, 12); g.fill(); txt(RUN[k], q.x, q.y + q.ps * 0.16, q.ps * 0.5, '#fff'); txt(String(k + 1), q.x + q.ps * 0.34, q.y - q.ps * 0.3, 10, 'rgba(255,255,255,.6)'); }
        bar(api.w / 2 - 110, api.h - 14, 220, 5, (LIM - t) / LIM, LIM - t < 40 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + val.filter(function (v) { return v >= 0; }).length + '/16', T.h2 + ' ' + err + '/' + MAXE, true);
        fim(st);
      }
    };

  }
});
