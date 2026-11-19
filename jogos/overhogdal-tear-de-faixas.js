/* Tapeçarias de Överhogdal — o tear (invenção). */
BTJogo.registrar({
  canvas: 'jogo-overhogdal',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O tear de Överhogdal",
    "sub": "Os quadrados de cores numeradas estão fora de ordem. Toque numa seta ao lado de uma linha ou coluna para deslizá-la uma casa; o que sai por um lado volta pelo outro. Ponha os números em ordem, de 1 em diante, linha por linha. O número de movimentos e o tempo são limitados. São 3 telas, cada uma maior que a anterior.",
    "perdeu": "Os movimentos ou o tempo acabaram",
    "v1": "Tela em ordem!",
    "v2": "As tapeçarias de Överhogdal foram achadas em 1909 numa igreja de Härjedalen; a leitura das figuras é debatida, e a mais citada é a de Ragnarök. Deslizar faixas é invenção.",
    "h1": "Tela",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The Överhogdal loom",
    "sub": "The numbered coloured squares are out of order. Tap an arrow beside a row or column to slide it one square; what leaves on one side comes back on the other. Put the numbers in order, from 1 on, row by row. The number of moves and the time are limited. There are 3 panels, each larger than the last.",
    "perdeu": "The moves or the time ran out",
    "v1": "Panel in order!",
    "v2": "The Överhogdal tapestries were found in 1909 in a church in Härjedalen; the reading of their figures is debated, and the most cited is Ragnarök. Sliding strips is invented.",
    "h1": "Panel",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Overhogdal-veven",
    "sub": "De nummererte fargede rutene står i feil rekkefølge. Trykk på en pil ved siden av en rad eller kolonne for å skyve den én rute; det som går ut på den ene siden, kommer inn på den andre. Sett tallene i rekkefølge, fra 1 og utover, rad for rad. Antall trekk og tiden er begrenset. Det er 3 felt, hvert større enn det forrige.",
    "perdeu": "Trekkene eller tiden tok slutt",
    "v1": "Feltet er i orden!",
    "v2": "Overhogdal-tapetene ble funnet i 1909 i en kirke i Härjedalen; tolkningen av figurene er omdiskutert, og den mest siterte er Ragnarok. Å skyve striper er oppfunnet.",
    "h1": "Felt",
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
    var NL = 3, lvl = 0, t = 0, pend = 0;
    function lvlUp() { lvl++; pend = 0.9; if (api.nota) api.nota(520, 0.2, 'triangle', 0.07); }
    function tick(dt, load) { if (st !== 'play') return; t += dt; if (pend > 0) { pend -= dt; if (pend <= 0) { if (lvl >= NL) st = 'win'; else load(lvl); } } if (st === 'play' && t >= LIM) st = 'lose'; }
    function foot() { bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 60 ? '#c0392b' : '#ffd88a'); }
    function hh() { hud(T.h1 + ' ' + Math.min(lvl + 1, NL) + '/' + NL, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false); }
    function glay(R, C, top, bot) { var W = api.w, H = api.h, s = Math.min((W - 24) / C, (H - top - bot) / R, 96); return { s: s, x0: (W - s * C) / 2, y0: top + ((H - top - bot) - s * R) / 2 }; }
    function sh(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
    var NS = [[3, 3, 4], [3, 4, 6], [4, 4, 8]], LIM = 360;
    var R = 3, C = 3, a = [], sol = [], moves = 0, lim = 0;
    function app(b, m) {
      var nb = b.slice(), i, k = m >> 1, dir = (m & 1) ? 1 : -1;
      if (k < R) { for (i = 0; i < C; i++) nb[k * C + (i + dir + C) % C] = b[k * C + i]; }
      else { k -= R; for (i = 0; i < R; i++) nb[((i + dir + R) % R) * C + k] = b[i * C + k]; }
      return nb;
    }
    function solved(b) { for (var i = 0; i < b.length; i++) if (b[i] !== i) return false; return true; }
    function load(i) {
      R = NS[i][0]; C = NS[i][1]; var nm = 2 * R + 2 * C;
      for (;;) { var b = [], k, mv = [], last = -1, m; for (k = 0; k < R * C; k++) b.push(k);
        for (k = 0; k < NS[i][2]; k++) { do { m = Math.floor(Math.random() * nm); } while (last >= 0 && m === (last ^ 1)); mv.push(m); b = app(b, m); last = m; }
        if (!solved(b)) { a = b; sol = mv.slice().reverse().map(function (x) { return x ^ 1; }); break; } }
      moves = 0; lim = NS[i][2] + 2;
    }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function bpos() {
      var L = glay(R + 2, C + 2, 70, 30), p = [], i, s = L.s;
      for (i = 0; i < R; i++) { p.push({ x: L.x0 + s * 0.5, y: L.y0 + (i + 1.5) * s }); p.push({ x: L.x0 + (C + 1.5) * s, y: L.y0 + (i + 1.5) * s }); }
      for (i = 0; i < C; i++) { p.push({ x: L.x0 + (i + 1.5) * s, y: L.y0 + s * 0.5 }); p.push({ x: L.x0 + (i + 1.5) * s, y: L.y0 + (R + 1.5) * s }); }
      return p;
    }
    function tap(m) { if (pend > 0 || st !== 'play') return; a = app(a, m); moves++; if (api.nota) api.nota(280, 0.05, 'square', 0.03); if (solved(a)) lvlUp(); else if (moves >= lim) st = 'lose'; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lvl: lvl, pend: pend, sol: sol.slice(), moves: moves, lim: lim, pos: bpos() }; },
      down: function (x, y) { if (menu()) return; var bp = bpos(), L = glay(R + 2, C + 2, 70, 30); for (var i = 0; i < bp.length; i++) if (Math.abs(x - bp[i].x) < L.s * 0.5 && Math.abs(y - bp[i].y) < L.s * 0.5) { tap(i); return; } },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) { tick(dt, load); },
      draw: function () {
        var L = glay(R + 2, C + 2, 70, 30), s = L.s, i, bp = bpos(); bg('#2a1f1a', '#0d0907');
        for (i = 0; i < R * C; i++) {
          var x = L.x0 + (i % C + 1) * s, y = L.y0 + (Math.floor(i / C) + 1) * s;
          g.fillStyle = 'hsl(' + (a[i] * 360 / (R * C)) + ',50%,52%)'; rr(x + 2, y + 2, s - 4, s - 4, 8); g.fill();
          txt(String(a[i] + 1), x + s / 2, y + s / 2 + 1, Math.max(12, s * 0.38), '#1a1410');
        }
        var gl = [];
        for (i = 0; i < R; i++) { gl.push('◀'); gl.push('▶'); } for (i = 0; i < C; i++) { gl.push('▲'); gl.push('▼'); }
        for (i = 0; i < bp.length; i++) txt(gl[i], bp[i].x, bp[i].y + 1, Math.max(12, s * 0.36), '#c9b3f2');
        txt(moves + '/' + lim, api.w - 40, 22, 14, moves >= lim - 1 ? '#ff9a8d' : '#c9b3f2');
        foot(); hh(); fim(st);
      }
    };

  }
});
