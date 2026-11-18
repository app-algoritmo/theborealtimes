/* Surtr e Muspelheim — espalhe o fogo pelo campo (invenção). */
BTJogo.registrar({
  canvas: 'jogo-surtr',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A chama de Surtr",
    "sub": "O fogo começa no canto de cima, à esquerda. Toque numa cor para que toda a mancha de fogo vire essa cor e engula as casas vizinhas da mesma cor. Pinte o campo inteiro de uma só cor em até 22 lances. (Teclado: teclas 1 a 5.)",
    "perdeu": "Os lances acabaram antes de o campo ficar de uma só cor",
    "v1": "O campo inteiro está em chamas!",
    "v2": "Na Völuspá, Surtr vem do sul com fogo e uma espada muito brilhante no Ragnarök, e o mundo queima. O campo de cores é invenção.",
    "h1": "Lances",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Surtr's flame",
    "sub": "The fire starts in the top left corner. Tap a colour so that the whole patch of fire turns that colour and swallows the neighbouring squares of the same colour. Paint the whole field one colour in up to 22 moves. (Keyboard: keys 1 to 5.)",
    "perdeu": "The moves ran out before the field became one colour",
    "v1": "The whole field is ablaze!",
    "v2": "In the Völuspá, Surtr comes from the south with fire and a very bright sword at Ragnarök, and the world burns. The field of colours is invented.",
    "h1": "Moves",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Surts flamme",
    "sub": "Ilden starter i hjørnet øverst til venstre. Trykk på en farge så hele flekken av ild blir den fargen og sluker nabofeltene med samme farge. Mal hele feltet i én farge på opptil 22 trekk. (Tastatur: tast 1 til 5.)",
    "perdeu": "Trekkene tok slutt før feltet ble av én farge",
    "v1": "Hele feltet står i brann!",
    "v2": "I Völuspá kommer Surt fra sør med ild og et svært skinnende sverd ved ragnarok, og verden brenner. Fargefeltet er oppfunnet.",
    "h1": "Trekk",
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
    var N = 9, K = 5, LIMIT = 22, LIM = 150;
    var COL = ['#c0392b', '#f08a24', '#ffd23e', '#7b3f9e', '#2f9fb0'];
    var cells = [], moves = 0, t = 0, pop = [];
    function reset() { cells = []; for (var i = 0; i < N * N; i++) cells.push(Math.floor(Math.random() * K)); moves = 0; t = 0; pop = []; st = 'play'; }
    function region() { var c0 = cells[0], seen = {0: 1}, q = [0], out = [0]; while (q.length) { var i = q.pop(), r = Math.floor(i / N), c = i % N, nb = []; if (r > 0) nb.push(i - N); if (r < N - 1) nb.push(i + N); if (c > 0) nb.push(i - 1); if (c < N - 1) nb.push(i + 1); nb.forEach(function (z) { if (!seen[z] && cells[z] === c0) { seen[z] = 1; q.push(z); out.push(z); } }); } return out; }
    function pick(k) {
      if (st !== 'play' || k === cells[0]) return;
      var reg = region(); reg.forEach(function (i) { cells[i] = k; pop.push([i, 0.35]); }); moves++;
      if (api.nota) api.nota(300 + k * 70, 0.12, 'triangle', 0.06);
      var all = cells.every(function (v) { return v === k; }); if (all) st = 'win'; else if (moves >= LIMIT) st = 'lose';
    }
    function lay() { var W = api.w, H = api.h, gs = Math.max(120, Math.min(W - 30, H - 170, 380)), cs = gs / N, x0 = (W - gs) / 2, y0 = 74, ps = Math.min(52, (W - 30) / 6); return { gs: gs, cs: cs, x0: x0, y0: y0, ps: ps, py: y0 + gs + 20 }; }
    function ppos(k) { var L = lay(), gp = 10, x0 = (api.w - (L.ps * K + gp * (K - 1))) / 2; return { x: x0 + k * (L.ps + gp) + L.ps / 2, y: L.py + L.ps / 2 }; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, cells: cells.slice(), moves: moves, t: t, N: N, K: K, limit: LIMIT, pal: [0, 1, 2, 3, 4].map(ppos) }; },
      down: function (x, y) { if (menu()) return; var L = lay(); for (var k = 0; k < K; k++) { var p = ppos(k); if (Math.abs(x - p.x) < L.ps / 2 + 3 && Math.abs(y - p.y) < L.ps / 2 + 3) { pick(k); return; } } },
      move: function () {}, up: function () {},
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } var m = { Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3, Digit5: 4, Numpad1: 0, Numpad2: 1, Numpad3: 2, Numpad4: 3, Numpad5: 4 }[k]; if (m !== undefined) pick(m); },
      update: function (dt) { pop = pop.filter(function (p) { p[1] -= dt; return p[1] > 0; }); if (st !== 'play') return; t += dt; if (t >= LIM) st = 'lose'; },
      draw: function () {
        var L = lay(), i, k; bg('#2b1410', '#0d0605');
        for (i = 0; i < N * N; i++) { var r = Math.floor(i / N), c = i % N; g.fillStyle = COL[cells[i]]; g.fillRect(L.x0 + c * L.cs + 1, L.y0 + r * L.cs + 1, L.cs - 2, L.cs - 2); }
        pop.forEach(function (p) { var r = Math.floor(p[0] / N), c = p[0] % N; g.fillStyle = 'rgba(255,255,255,' + (p[1] * 1.4) + ')'; g.fillRect(L.x0 + c * L.cs + 1, L.y0 + r * L.cs + 1, L.cs - 2, L.cs - 2); });
        g.strokeStyle = '#fff'; g.lineWidth = 3; g.strokeRect(L.x0, L.y0, L.cs, L.cs);
        for (k = 0; k < K; k++) { var q = ppos(k); g.fillStyle = COL[k]; g.beginPath(); g.arc(q.x, q.y, L.ps / 2, 0, 6.2832); g.fill(); g.strokeStyle = k === cells[0] ? '#fff' : 'rgba(255,255,255,.35)'; g.lineWidth = k === cells[0] ? 3 : 1; g.stroke(); txt(String(k + 1), q.x, q.y + 6, 16, 'rgba(0,0,0,.55)'); }
        bar(api.w / 2 - 110, api.h - 14, 220, 5, (LIM - t) / LIM, LIM - t < 25 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + moves + '/' + LIMIT, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };

  }
});
