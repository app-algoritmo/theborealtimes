/* Topônimos do Danelaw — as fazendas (invenção). */
BTJogo.registrar({
  canvas: 'jogo-topon',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As fazendas do Danelaw",
    "sub": "Cada casa vale um número: o da coluna, para a soma da linha, e o da linha, para a soma da coluna. Toque numa casa para marcá-la ou desmarcá-la. O número à direita de cada linha é a soma dos números das colunas das casas marcadas nela; o número embaixo de cada coluna é a soma dos números das linhas das casas marcadas nela. O tempo é limitado. São 3 grades.",
    "perdeu": "O tempo acabou",
    "v1": "Fazendas marcadas!",
    "v2": "No Danelaw, na Inglaterra, há muitas centenas de topônimos de origem escandinava; \"-by\" designa uma fazenda e é o elemento mais comum, e \"-thorpe\" uma povoação secundária. Marcar casas por somas é invenção.",
    "h1": "Grade",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The farmsteads of the Danelaw",
    "sub": "Each square is worth a number: that of its column, for the row sum, and that of its row, for the column sum. Tap a square to mark or unmark it. The number to the right of each row is the sum of the column numbers of the squares marked in it; the number below each column is the sum of the row numbers of the squares marked in it. Time is limited. There are 3 grids.",
    "perdeu": "Time ran out",
    "v1": "Farmsteads marked!",
    "v2": "In the Danelaw, in England, there are many hundreds of place-names of Scandinavian origin; \"-by\" means a farmstead and is the most common element, and \"-thorpe\" a secondary settlement. Marking squares by sums is invented.",
    "h1": "Grid",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Gårdene i Danelaw",
    "sub": "Hver rute er verdt et tall: kolonnens tall, for radsummen, og radens tall, for kolonnesummen. Trykk på en rute for å merke den eller fjerne merket. Tallet til høyre for hver rad er summen av kolonnetallene til rutene som er merket i den; tallet under hver kolonne er summen av radtallene til rutene som er merket i den. Tiden er begrenset. Det er 3 rutenett.",
    "perdeu": "Tiden tok slutt",
    "v1": "Gårdene er merket!",
    "v2": "I Danelaw i England finnes det mange hundre stedsnavn av skandinavisk opprinnelse; «-by» betyr en gård og er det vanligste leddet, og «-thorpe» en sekundær bosetning. Å merke ruter etter summer er oppfunnet.",
    "h1": "Rutenett",
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
    var NS = [5, 5, 6], LIM = 300;
    var n = 5, cur = [], sol = [], rc = [], cc = [];
    function sums(a) { var r = [], c = [], i, j; for (i = 0; i < n; i++) { r.push(0); c.push(0); } for (i = 0; i < n; i++) for (j = 0; j < n; j++) if (a[i * n + j]) { r[i] += j + 1; c[j] += i + 1; } return { r: r, c: c }; }
    function load(i) {
      var k, s, ok; n = NS[i];
      for (;;) { sol = []; for (k = 0; k < n * n; k++) sol.push(Math.random() < 0.5 ? 1 : 0); s = sums(sol); ok = true; for (k = 0; k < n; k++) if (!s.r[k] || !s.c[k]) ok = false; if (ok) break; }
      rc = s.r; cc = s.c; cur = []; for (k = 0; k < n * n; k++) cur.push(0);
    }
    function done() { var s = sums(cur), k; for (k = 0; k < n; k++) if (s.r[k] !== rc[k] || s.c[k] !== cc[k]) return false; return true; }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function L() { return glay(n + 2, n + 2, 62, 34); }
    function pos() { var l = L(), a = [], i; for (i = 0; i < n * n; i++) a.push({ x: l.x0 + (i % n + 1.5) * l.s, y: l.y0 + (Math.floor(i / n) + 1.5) * l.s }); return a; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lvl: lvl, pend: pend, sol: sol.slice(), cur: cur.slice(), pos: pos() }; },
      down: function (x, y) {
        if (menu()) return; if (pend > 0 || st !== 'play') return;
        var l = L(), c = Math.floor((x - l.x0) / l.s) - 1, r = Math.floor((y - l.y0) / l.s) - 1;
        if (c < 0 || r < 0 || c >= n || r >= n) return;
        cur[r * n + c] ^= 1; if (api.nota) api.nota(cur[r * n + c] ? 380 : 260, 0.05, 'triangle', 0.04);
        if (done()) lvlUp();
      },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) { tick(dt, load); },
      draw: function () {
        var l = L(), s = l.s, i, k, q = sums(cur), fs = Math.max(12, s * 0.4); bg('#16241c', '#050a07');
        for (i = 0; i < n * n; i++) {
          var x = l.x0 + (i % n + 1) * s, y = l.y0 + (Math.floor(i / n) + 1) * s;
          g.fillStyle = cur[i] ? '#c9a45a' : 'rgba(255,255,255,.08)'; rr(x + 2, y + 2, s - 4, s - 4, 6); g.fill();
        }
        for (k = 0; k < n; k++) {
          txt(String(k + 1), l.x0 + (k + 1.5) * s, l.y0 + 0.5 * s, fs * 0.8, 'rgba(243,236,210,.45)');
          txt(String(k + 1), l.x0 + 0.5 * s, l.y0 + (k + 1.5) * s, fs * 0.8, 'rgba(243,236,210,.45)');
          txt(String(rc[k]), l.x0 + (n + 1.5) * s, l.y0 + (k + 1.5) * s, fs, q.r[k] === rc[k] ? '#8fd19e' : (q.r[k] > rc[k] ? '#ff9a8d' : '#f3ecd2'));
          txt(String(cc[k]), l.x0 + (k + 1.5) * s, l.y0 + (n + 1.5) * s, fs, q.c[k] === cc[k] ? '#8fd19e' : (q.c[k] > cc[k] ? '#ff9a8d' : '#f3ecd2'));
        }
        foot(); hh(); fim(st);
      }
    };

  }
});
