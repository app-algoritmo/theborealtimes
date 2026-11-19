/* Heiðrún e o hidromel — meça com duas vasilhas sem marcas (invenção). */
BTJogo.registrar({
  canvas: 'jogo-heidrun',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O hidromel de Heiðrún",
    "sub": "Do úbere da cabra Heiðrún corre hidromel sem parar. Você tem duas vasilhas sem marcas, só com a capacidade escrita nelas. Use +A e +B para encher, −A e −B para esvaziar, e A→B ou B→A para despejar uma na outra, até esvaziar a de origem ou encher a de destino. Deixe uma das vasilhas exatamente com a medida pedida. São 5 medidas, cada uma com limite de lances. (Teclado: teclas 1 a 6.)",
    "perdeu": "Os lances ou o tempo acabaram antes de a medida ser alcançada",
    "v1": "Todas as medidas servidas!",
    "v2": "Na Grímnismál e na Gylfaginning, a cabra Heiðrún está sobre o Valhalla, come as folhas da árvore Læraðr e dela escorre todos os dias hidromel suficiente para embriagar todos os einherjar. As vasilhas e as medidas são invenção.",
    "h1": "Medidas",
    "h2": "Tempo",
    "g0": "Meta",
    "g1": "Lances"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Heiðrún's mead",
    "sub": "Mead flows endlessly from the udder of the goat Heiðrún. You have two unmarked vessels, with only their capacity written on them. Use +A and +B to fill, −A and −B to empty, and A→B or B→A to pour one into the other, until the source is empty or the target is full. Leave one of the vessels with exactly the requested measure. There are 5 measures, each with a move limit. (Keyboard: keys 1 to 6.)",
    "perdeu": "The moves or the time ran out before the measure was reached",
    "v1": "Every measure served!",
    "v2": "In the Grímnismál and the Gylfaginning, the goat Heiðrún stands on Valhalla, eats the leaves of the tree Læraðr, and every day mead runs from her, enough to make all the einherjar fully drunk. The vessels and the measures are invented.",
    "h1": "Measures",
    "h2": "Time",
    "g0": "Goal",
    "g1": "Moves"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Heiðruns mjød",
    "sub": "Fra juret til geita Heiðrún renner det mjød uten stans. Du har to umerkede kar, med bare kapasiteten skrevet på. Bruk +A og +B for å fylle, −A og −B for å tømme, og A→B eller B→A for å helle det ene i det andre, til det ene er tomt eller det andre fullt. La ett av karene inneholde nøyaktig den målte mengden. Det er 5 mål, hvert med en grense for trekk. (Tastatur: tast 1 til 6.)",
    "perdeu": "Trekkene eller tiden tok slutt før målet var nådd",
    "v1": "Alle målene er servert!",
    "v2": "I Grímnismál og Gylfaginning står geita Heiðrún på Valhall, spiser bladene på treet Læraðr, og hver dag renner det mjød fra henne, nok til at alle einherjene blir fullstendig fulle. Karene og målene er oppfunnet.",
    "h1": "Mål",
    "h2": "Tid",
    "g0": "Mål",
    "g1": "Trekk"
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
    var PUZ = [[3, 5, 4], [5, 8, 6], [4, 7, 5], [3, 7, 5], [5, 11, 8], [7, 9, 4]], NR = 5, LIM = 240;
    var order = [], round = 0, A = 0, B = 0, ca = 3, cb = 5, tg = 4, moves = 0, maxm = 10, t = 0, pend = 0;
    function nexts(a, b, x, y) { var p = Math.min(a, y - b), q = Math.min(b, x - a); return [[x, b], [a, y], [0, b], [a, 0], [a - p, b + p], [a + q, b - q]]; }
    function bfs(x, y, z) {
      var seen = { '0,0': 1 }, q = [[0, 0, 0]], i, c, nx, k;
      while (q.length) { c = q.shift(); if (c[0] === z || c[1] === z) return c[2]; nx = nexts(c[0], c[1], x, y); for (i = 0; i < nx.length; i++) { k = nx[i][0] + ',' + nx[i][1]; if (!seen[k]) { seen[k] = 1; q.push([nx[i][0], nx[i][1], c[2] + 1]); } } }
      return 99;
    }
    function load(i) { var p = PUZ[order[i]]; ca = p[0]; cb = p[1]; tg = p[2]; A = 0; B = 0; moves = 0; maxm = bfs(ca, cb, tg) + 4; }
    function reset() { order = [0, 1, 2, 3, 4, 5]; for (var i = 5; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = order[i]; order[i] = order[j]; order[j] = x; } round = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function apply(op) {
      if (st !== 'play' || pend > 0) return;
      var n = nexts(A, B, ca, cb)[op]; A = n[0]; B = n[1]; moves++;
      if (api.nota) api.nota(220 + op * 40, 0.08, 'sine', 0.05);
      if (A === tg || B === tg) { round++; pend = 0.9; if (api.nota) api.nota(520, 0.2, 'triangle', 0.07); }
      else if (moves >= maxm) st = 'lose';
    }
    var LAB = ['+A', '+B', '−A', '−B', 'A→B', 'B→A'];
    function lay() { var W = api.w, H = api.h, n = 6, gp = 6, bw = Math.min(70, (W - 24 - gp * (n - 1)) / n), bh = 44, x0 = (W - (bw * n + gp * (n - 1))) / 2; return { bw: bw, bh: bh, x0: x0, gp: gp, y: H - bh - 30, base: H * 0.62, jw: Math.min(80, W * 0.2) }; }
    function bpos() { var L = lay(), o = [], i; for (i = 0; i < 6; i++) o.push({ x: L.x0 + i * (L.bw + L.gp) + L.bw / 2, y: L.y + L.bh / 2 }); return o; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, round: round, A: A, B: B, ca: ca, cb: cb, tg: tg, moves: moves, maxm: maxm, pos: bpos(), pend: pend, t: t }; },
      down: function (x, y) { if (menu()) return; var p = bpos(), L = lay(), i; for (i = 0; i < 6; i++) if (Math.abs(x - p[i].x) < L.bw / 2 + 2 && Math.abs(y - p[i].y) < L.bh / 2 + 4) { apply(i); return; } },
      move: function () {}, up: function () {},
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } var m = { Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3, Digit5: 4, Digit6: 5, Numpad1: 0, Numpad2: 1, Numpad3: 2, Numpad4: 3, Numpad5: 4, Numpad6: 5 }[k]; if (m !== undefined) apply(m); },
      update: function (dt) {
        if (st !== 'play') return; t += dt;
        if (pend > 0) { pend -= dt; if (pend <= 0) { if (round >= NR) st = 'win'; else load(round); } }
        if (st === 'play' && t >= LIM) st = 'lose';
      },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), i; bg('#2a1f10', '#0d0a06');
        var u = Math.min(H * 0.34 / Math.max(ca, cb), 40), caps = [ca, cb], vals = [A, B], xs = [W * 0.3, W * 0.7], nm = ['A', 'B'];
        txt(T.g0 + ': ' + tg, W / 2, 96, 22, '#ffd88a');
        txt(T.g1 + ' ' + moves + '/' + maxm, W / 2, 120, 14, moves >= maxm - 2 ? '#ffb08a' : '#c9b3f2');
        for (i = 0; i < 2; i++) {
          var jh = caps[i] * u, x = xs[i] - L.jw / 2, y = L.base - jh;
          g.fillStyle = 'rgba(255,255,255,.06)'; g.fillRect(x, y, L.jw, jh);
          g.fillStyle = vals[i] === tg ? '#ffd88a' : '#d59a2e'; g.fillRect(x, L.base - vals[i] * u, L.jw, vals[i] * u);
          g.strokeStyle = 'rgba(255,255,255,.18)'; g.lineWidth = 1;
          for (var k = 1; k < caps[i]; k++) { g.beginPath(); g.moveTo(x, L.base - k * u); g.lineTo(x + 8, L.base - k * u); g.stroke(); }
          g.strokeStyle = 'rgba(255,255,255,.6)'; g.lineWidth = 2; g.strokeRect(x, y, L.jw, jh);
          txt(nm[i] + ' · ' + caps[i], xs[i], L.base + 22, 15, '#f3ecd2');
          if (vals[i] > 0) txt(String(vals[i]), xs[i], Math.max(y + 22, L.base - vals[i] * u + 22), 20, '#2a1a05');
        }
        var p = bpos();
        for (i = 0; i < 6; i++) { g.fillStyle = 'rgba(70,55,30,.9)'; rr(p[i].x - L.bw / 2, L.y, L.bw, L.bh, 8); g.fill(); g.strokeStyle = 'rgba(255,216,138,.5)'; g.lineWidth = 1.5; rr(p[i].x - L.bw / 2, L.y, L.bw, L.bh, 8); g.stroke(); txt(LAB[i], p[i].x, L.y + L.bh / 2 + 5, 15, '#fff'); }
        bar(W / 2 - 110, H - 12, 220, 5, (LIM - t) / LIM, LIM - t < 40 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + Math.min(round + 1, NR) + '/' + NR, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };

  }
});
