/* Níðhöggr e as raízes do freixo — apague as zonas roídas (invenção). */
BTJogo.registrar({
  canvas: 'jogo-nidhoggr',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As raízes de Níðhöggr",
    "sub": "Cada nó da raiz está inteiro (claro) ou roído (escuro). Ao tocar num nó, ele e os quatro vizinhos trocam de estado: o que estava inteiro fica roído e o que estava roído fica inteiro. Deixe todos os nós inteiros em até 18 toques.",
    "perdeu": "Os toques ou o tempo acabaram com a raiz ainda roída",
    "v1": "Todas as raízes estão inteiras!",
    "v2": "Na Gylfaginning, Níðhöggr rói uma das três raízes de Yggdrasill, a que fica sobre Niflheimr. A grade de nós é invenção.",
    "h1": "Toques",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Níðhöggr's roots",
    "sub": "Each knot of the root is whole (light) or gnawed (dark). Tapping a knot flips it and its four neighbours: whole becomes gnawed and gnawed becomes whole. Leave every knot whole in up to 18 taps.",
    "perdeu": "The taps or the time ran out with the root still gnawed",
    "v1": "Every root is whole!",
    "v2": "In the Gylfaginning, Níðhöggr gnaws one of the three roots of Yggdrasill, the one that lies over Niflheimr. The grid of knots is invented.",
    "h1": "Taps",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Níðhoggs røtter",
    "sub": "Hver knute på roten er hel (lys) eller gnagd (mørk). Når du trykker på en knute, bytter den og de fire naboene tilstand: det som var helt blir gnagd, og det som var gnagd blir helt. La alle knutene være hele på opptil 18 trykk.",
    "perdeu": "Trykkene eller tiden tok slutt mens roten fortsatt var gnagd",
    "v1": "Alle røttene er hele!",
    "v2": "I Gylfaginning gnager Níðhogg på én av de tre røttene til Yggdrasil, den som ligger over Niflheim. Rutenettet av knuter er oppfunnet.",
    "h1": "Trykk",
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
    var N = 5, LIMIT = 18, LIM = 180;
    var cells = [], sol = [], moves = 0, t = 0, pop = [];
    function flip(i) { var r = Math.floor(i / N), c = i % N; cells[i] ^= 1; if (r > 0) cells[i - N] ^= 1; if (r < N - 1) cells[i + N] ^= 1; if (c > 0) cells[i - 1] ^= 1; if (c < N - 1) cells[i + 1] ^= 1; }
    function reset() {
      do { cells = []; for (var i = 0; i < N * N; i++) cells.push(0); sol = []; var k = 6 + Math.floor(Math.random() * 4); while (sol.length < k) { var z = Math.floor(Math.random() * N * N); if (sol.indexOf(z) < 0) sol.push(z); } sol.forEach(flip); } while (cells.every(function (v) { return v === 0; }));
      moves = 0; t = 0; pop = []; st = 'play';
    }
    function press(i) { if (st !== 'play') return; flip(i); moves++; pop.push([i, 0.3]); if (api.nota) api.nota(200 + (i % N) * 50, 0.1, 'triangle', 0.05); if (cells.every(function (v) { return v === 0; })) st = 'win'; else if (moves >= LIMIT) st = 'lose'; }
    function lay() { var W = api.w, H = api.h, gs = Math.max(120, Math.min(W - 30, H - 120, 400)); return { gs: gs, cs: gs / N, x0: (W - gs) / 2, y0: 70 }; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, cells: cells.slice(), sol: sol.slice(), moves: moves, limit: LIMIT, t: t, N: N, pos: cells.map(function (v, i) { return { x: L.x0 + (i % N + 0.5) * L.cs, y: L.y0 + (Math.floor(i / N) + 0.5) * L.cs }; }) }; },
      down: function (x, y) { if (menu()) return; var L = lay(), c = Math.floor((x - L.x0) / L.cs), r = Math.floor((y - L.y0) / L.cs); if (c >= 0 && c < N && r >= 0 && r < N) press(r * N + c); },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) { pop = pop.filter(function (p) { p[1] -= dt; return p[1] > 0; }); if (st !== 'play') return; t += dt; if (t >= LIM) st = 'lose'; },
      draw: function () {
        var L = lay(), i; bg('#1b1210', '#080504');
        for (i = 0; i < N * N; i++) {
          var r = Math.floor(i / N), c = i % N, x = L.x0 + c * L.cs, y = L.y0 + r * L.cs;
          g.fillStyle = cells[i] ? '#2a0f12' : '#b88a4a'; rr(x + 2, y + 2, L.cs - 4, L.cs - 4, 8); g.fill();
          if (cells[i]) { g.strokeStyle = 'rgba(220,60,50,.55)'; g.lineWidth = 2; g.stroke(); } else { g.fillStyle = 'rgba(255,240,200,.18)'; rr(x + 6, y + 6, L.cs - 12, (L.cs - 12) * 0.35, 5); g.fill(); }
        }
        pop.forEach(function (p) { var r = Math.floor(p[0] / N), c = p[0] % N; g.fillStyle = 'rgba(255,255,255,' + (p[1] * 1.2) + ')'; g.fillRect(L.x0 + c * L.cs + 2, L.y0 + r * L.cs + 2, L.cs - 4, L.cs - 4); });
        bar(api.w / 2 - 110, api.h - 14, 220, 5, (LIM - t) / LIM, LIM - t < 30 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + moves + '/' + LIMIT, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };

  }
});
