/* Forseti e o salão Glitnir — descubra a sentença oculta (invenção). */
BTJogo.registrar({
  canvas: 'jogo-forseti',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A sentença de Forseti",
    "sub": "Forseti guardou uma sentença de quatro símbolos coloridos, que podem se repetir. Toque nas cores para montar o seu palpite. Depois de cada palpite, um ponto dourado marca uma cor certa no lugar certo, e um ponto claro marca uma cor certa no lugar errado. Descubra a sentença em até 8 palpites. (Teclado: teclas 1 a 6, Backspace apaga.)",
    "perdeu": "Os palpites ou o tempo acabaram antes de a sentença ser revelada",
    "v1": "Sentença descoberta!",
    "v2": "Na Gylfaginning, Snorri diz que Forseti vive no salão Glitnir e que quem leva a ele uma disputa sai de lá reconciliado. A sentença escondida é invenção.",
    "h1": "Palpites",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Forseti's verdict",
    "sub": "Forseti has kept a verdict of four coloured symbols, which may repeat. Tap the colours to build your guess. After each guess, a gold dot marks a right colour in the right place, and a pale dot marks a right colour in the wrong place. Find the verdict in up to 8 guesses. (Keyboard: keys 1 to 6, Backspace deletes.)",
    "perdeu": "The guesses or the time ran out before the verdict was revealed",
    "v1": "Verdict found!",
    "v2": "In the Gylfaginning, Snorri says that Forseti lives in the hall Glitnir and that whoever brings a dispute to him leaves reconciled. The hidden verdict is invented.",
    "h1": "Guesses",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Forsetes dom",
    "sub": "Forsete har gjemt en dom av fire fargede symboler, som kan gjentas. Trykk på fargene for å lage gjetningen din. Etter hver gjetning markerer en gylden prikk en riktig farge på riktig plass, og en lys prikk en riktig farge på feil plass. Finn dommen på opptil 8 gjetninger. (Tastatur: tast 1 til 6, Backspace sletter.)",
    "perdeu": "Gjetningene eller tiden tok slutt før dommen ble avslørt",
    "v1": "Dommen er funnet!",
    "v2": "I Gylfaginning sier Snorre at Forsete bor i salen Glitnir og at den som bringer en strid til ham, går derfra forlikt. Den skjulte dommen er oppfunnet.",
    "h1": "Gjetninger",
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
    var K = 6, LEN = 4, MAXT = 8, LIM = 180;
    var COL = ['#d64545', '#e8a33d', '#e6d84a', '#4fa86b', '#4c8fd6', '#9b6bd1'];
    var code = [], hist = [], cur = [], t = 0;
    function reset() { code = []; for (var i = 0; i < LEN; i++) code.push(Math.floor(Math.random() * K)); hist = []; cur = []; t = 0; st = 'play'; }
    function score(c, gs) { var b = 0, a = [], h = [], i, w = 0; for (i = 0; i < K; i++) { a.push(0); h.push(0); } for (i = 0; i < LEN; i++) { if (c[i] === gs[i]) b++; a[c[i]]++; h[gs[i]]++; } for (i = 0; i < K; i++) w += Math.min(a[i], h[i]); return [b, w - b]; }
    function add(k) {
      if (st !== 'play' || cur.length >= LEN) return;
      cur.push(k); if (api.nota) api.nota(260 + k * 60, 0.1, 'triangle', 0.05);
      if (cur.length === LEN) { var s = score(code, cur); hist.push([cur.slice(), s]); cur = []; if (s[0] === LEN) st = 'win'; else if (hist.length >= MAXT) st = 'lose'; }
    }
    function lay() { var W = api.w, H = api.h, rh = Math.max(22, Math.min(38, (H - 200) / MAXT)), y0 = 64, sp = Math.min(46, (W - 150) / LEN), ps = Math.min(46, (W - 30) / (K + 1)); return { rh: rh, y0: y0, sp: sp, x0: W / 2 - (LEN - 1) * sp / 2 - 34, ps: ps, py: y0 + MAXT * rh + 18 + ps / 2, r: Math.min(rh * 0.4, 16) }; }
    function slot(L, row, j) { return { x: L.x0 + j * L.sp, y: L.y0 + row * L.rh + L.rh / 2 }; }
    function ppos(k) { var L = lay(), gp = 8, x0 = (api.w - (L.ps * K + gp * (K - 1))) / 2; return { x: x0 + k * (L.ps + gp) + L.ps / 2, y: L.py }; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, code: code.slice(), hist: hist.map(function (h) { return [h[0].slice(), h[1].slice()]; }), cur: cur.slice(), tries: hist.length, limit: MAXT, t: t, pal: [0, 1, 2, 3, 4, 5].map(ppos) }; },
      down: function (x, y) {
        if (menu()) return; var L = lay(), k, j;
        for (k = 0; k < K; k++) { var p = ppos(k); if (Math.abs(x - p.x) < L.ps / 2 + 3 && Math.abs(y - p.y) < L.ps / 2 + 3) { add(k); return; } }
        for (j = 0; j < cur.length; j++) { var s = slot(L, hist.length, j); if (Math.abs(x - s.x) < L.sp / 2 && Math.abs(y - s.y) < L.rh / 2) { cur.length = j; return; } }
      },
      move: function () {}, up: function () {},
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'Backspace') { cur.pop(); return; } var m = { Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3, Digit5: 4, Digit6: 5, Numpad1: 0, Numpad2: 1, Numpad3: 2, Numpad4: 3, Numpad5: 4, Numpad6: 5 }[k]; if (m !== undefined) add(m); },
      update: function (dt) { if (st !== 'play') return; t += dt; if (t >= LIM) st = 'lose'; },
      draw: function () {
        var L = lay(), i, j, k; bg('#1a2230', '#0b0f17');
        for (i = 0; i < MAXT; i++) {
          var rowY = L.y0 + i * L.rh;
          if (i === hist.length && st === 'play') { g.fillStyle = 'rgba(255,216,138,.10)'; g.fillRect(L.x0 - L.sp * 0.6, rowY + 1, L.sp * (LEN - 1) + L.sp * 2.8, L.rh - 2); }
          for (j = 0; j < LEN; j++) {
            var s = slot(L, i, j), v = i < hist.length ? hist[i][0][j] : (i === hist.length && j < cur.length ? cur[j] : -1);
            g.beginPath(); g.arc(s.x, s.y, L.r, 0, 6.2832);
            if (v >= 0) { g.fillStyle = COL[v]; g.fill(); txt(String(v + 1), s.x, s.y + 4, 12, 'rgba(0,0,0,.6)'); } else { g.strokeStyle = 'rgba(255,255,255,.25)'; g.lineWidth = 1.5; g.stroke(); }
          }
          if (i < hist.length) {
            var f = hist[i][1], px = L.x0 + (LEN - 1) * L.sp + L.sp * 0.95;
            for (j = 0; j < 4; j++) { var cx = px + (j % 2) * 11, cy = rowY + L.rh / 2 + (j < 2 ? -5 : 5); g.beginPath(); g.arc(cx, cy, 3.6, 0, 6.2832); if (j < f[0]) { g.fillStyle = '#ffd88a'; g.fill(); } else if (j < f[0] + f[1]) { g.fillStyle = '#d8e2f0'; g.fill(); } else { g.strokeStyle = 'rgba(255,255,255,.2)'; g.lineWidth = 1; g.stroke(); } }
          }
        }
        for (k = 0; k < K; k++) { var q = ppos(k); g.fillStyle = COL[k]; g.beginPath(); g.arc(q.x, q.y, L.ps / 2, 0, 6.2832); g.fill(); g.strokeStyle = 'rgba(255,255,255,.4)'; g.lineWidth = 1.5; g.stroke(); txt(String(k + 1), q.x, q.y + 6, 16, 'rgba(0,0,0,.55)'); }
        bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 30 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + hist.length + '/' + MAXT, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };

  }
});
