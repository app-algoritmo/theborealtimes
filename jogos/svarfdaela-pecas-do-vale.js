/* Svarfdœla saga — as peças do vale (invenção). */
BTJogo.registrar({
  canvas: 'jogo-svarfdaela',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As peças do vale",
    "sub": "Oito lotes numerados e um espaço vazio estão fora de ordem. Toque num lote ao lado do espaço vazio para deslizá-lo para lá. Ponha os números em ordem, de 1 a 8, linha por linha, com o espaço vazio no canto de baixo à direita. O número de movimentos e o tempo são limitados. São 3 rodadas.",
    "perdeu": "Os movimentos ou o tempo acabaram",
    "v1": "Vale em ordem!",
    "v2": "A Svarfdœla saga, registrada por escrito no século XIV, trata de disputas na colonização de Svarfaðardalur, um vale no norte da Islândia. Deslizar lotes é invenção.",
    "h1": "Rodada",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The pieces of the valley",
    "sub": "Eight numbered plots and one empty space are out of order. Tap a plot next to the empty space to slide it there. Put the numbers in order, from 1 to 8, row by row, with the empty space at the bottom right. The number of moves and the time are limited. There are 3 rounds.",
    "perdeu": "The moves or the time ran out",
    "v1": "Valley in order!",
    "v2": "Svarfdœla saga, written down in the 14th century, deals with disputes during the settlement of Svarfaðardalur, a valley in northern Iceland. Sliding plots is invented.",
    "h1": "Round",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Brikkene i dalen",
    "sub": "Åtte nummererte teiger og ett tomt felt ligger i feil rekkefølge. Trykk på en teig ved siden av det tomme feltet for å skyve den dit. Legg tallene i rekkefølge, fra 1 til 8, rad for rad, med det tomme feltet nede til høyre. Antall trekk og tiden er begrenset. Det er 3 runder.",
    "perdeu": "Trekkene eller tiden tok slutt",
    "v1": "Dalen er i orden!",
    "v2": "Svarfdœla saga, skrevet ned på 1300-tallet, handler om stridigheter under landnåmet i Svarfaðardalur, en dal i Nord-Island. Å skyve teiger er oppfunnet.",
    "h1": "Runde",
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
    var NS = [12, 18, 24], NL = 3, LIM = 300;
    var lvl = 0, a = [], sol = [], lim = 0, moves = 0, t = 0, pend = 0;
    function nb(b) { var r = [], x = b % 3, y = (b / 3) | 0; if (x > 0) r.push(b - 1); if (x < 2) r.push(b + 1); if (y > 0) r.push(b - 3); if (y < 2) r.push(b + 3); return r; }
    function solved() { for (var i = 0; i < 8; i++) if (a[i] !== i + 1) return false; return a[8] === 0; }
    function load(i) {
      for (;;) {
        a = [1, 2, 3, 4, 5, 6, 7, 8, 0]; var b = 8, prev = -1, bs = [8], k;
        for (k = 0; k < NS[i]; k++) { var c = nb(b).filter(function (x) { return x !== prev; }), nx = c[(Math.random() * c.length) | 0]; a[b] = a[nx]; a[nx] = 0; prev = b; b = nx; bs.push(b); }
        if (!solved()) { sol = []; for (k = bs.length - 2; k >= 0; k--) sol.push(bs[k]); break; }
      }
      lim = NS[i] + 6; moves = 0;
    }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function lay() { var W = api.w, H = api.h, s = Math.min((W - 30) / 3, (H - 170) / 3, 100); return { s: s, x0: (W - 3 * s) / 2, y0: 76 }; }
    function cpos(i) { var L = lay(); return { x: L.x0 + (i % 3) * L.s + L.s / 2, y: L.y0 + ((i / 3) | 0) * L.s + L.s / 2 }; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lvl: lvl, a: a.slice(), sol: sol.slice(), moves: moves, lim: lim, pos: [0, 1, 2, 3, 4, 5, 6, 7, 8].map(cpos), pend: pend }; },
      down: function (x, y) {
        if (menu()) return; if (pend > 0) return; var L = lay(), cx = Math.floor((x - L.x0) / L.s), cy = Math.floor((y - L.y0) / L.s);
        if (cx < 0 || cy < 0 || cx > 2 || cy > 2) return; var i = cy * 3 + cx, z = a.indexOf(0);
        if (nb(z).indexOf(i) < 0) return; a[z] = a[i]; a[i] = 0; moves++; if (api.nota) api.nota(240, 0.05, 'square', 0.03);
        if (solved()) { lvl++; pend = 0.9; if (api.nota) api.nota(520, 0.2, 'triangle', 0.07); } else if (moves >= lim) st = 'lose';
      },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) {
        if (st !== 'play') return; t += dt;
        if (pend > 0) { pend -= dt; if (pend <= 0) { if (lvl >= NL) st = 'win'; else load(lvl); } }
        if (st === 'play' && t >= LIM) st = 'lose';
      },
      draw: function () {
        var L = lay(), i; bg('#25303a', '#0a0e14');
        for (i = 0; i < 9; i++) {
          var x = L.x0 + (i % 3) * L.s, y = L.y0 + ((i / 3) | 0) * L.s, v = a[i]; if (!v) continue;
          var ok = v === i + 1; g.fillStyle = ok ? '#6c8a58' : '#7a6a4a'; rr(x + 3, y + 3, L.s - 6, L.s - 6, 10); g.fill();
          g.strokeStyle = 'rgba(255,255,255,.25)'; g.lineWidth = 2; rr(x + 3, y + 3, L.s - 6, L.s - 6, 10); g.stroke(); txt(String(v), x + L.s / 2, y + L.s / 2 + 1, L.s * 0.42, '#f3ecd2');
        }
        txt(moves + '/' + lim, api.w / 2, L.y0 + 3 * L.s + 28, 18, moves >= lim - 2 ? '#ff9a8d' : '#f3ecd2');
        bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 60 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + Math.min(lvl + 1, NL) + '/' + NL, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };

  }
});
