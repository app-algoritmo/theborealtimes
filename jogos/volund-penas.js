/* As penas do ferreiro — ordene as penas das asas de Völund com poucas trocas. */
BTJogo.registrar({
  canvas: 'jogo-volund',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As penas do ferreiro",
    "sub": "Völund precisa pôr as penas das asas em ordem, da mais curta à mais longa. Toque numa pena e depois em outra para trocá-las (ou use as setas e a barra de espaço). Troca que não põe nenhuma pena no lugar certo é em vão: três e o jogo acaba.",
    "perdeu": "As asas não ficaram prontas",
    "v1": "Völund voa!",
    "v2": "No poema, Völund foge pelos ares depois de anos preso na ilha. As penas e as trocas são invenção do jogo.",
    "h1": "Penas",
    "h2": "Em vão",
    "dica": "da mais curta à mais longa"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The smith's feathers",
    "sub": "Völund must put the wing feathers in order, from shortest to longest. Tap one feather and then another to swap them (or use the arrows and Space). A swap that puts no feather in its right place is wasted: three and the game is over.",
    "perdeu": "The wings were not ready",
    "v1": "Völund flies!",
    "v2": "In the poem, Völund escapes through the air after years on the island. The feathers and swaps are made up for the game.",
    "h1": "Feathers",
    "h2": "Wasted",
    "dica": "shortest to longest"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Smedens fjær",
    "sub": "Völund må legge vingefjærene i rekkefølge, fra den korteste til den lengste. Trykk på en fjær og så på en annen for å bytte dem (eller bruk piltastene og mellomromstasten). Et bytte som ikke setter noen fjær på rett plass, er bortkastet: Tre, og spillet er over.",
    "perdeu": "Vingene ble ikke ferdige",
    "v1": "Völund flyr!",
    "v2": "I diktet flykter Völund gjennom luften etter år på øya. Fjærene og byttene er diktet opp for spillet.",
    "h1": "Fjær",
    "h2": "Bortkastet",
    "dica": "fra korteste til lengste"
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
    var N = 8, MAXE = 3, LIM = 80;
    var arr = [], sel = -1, cur = 0, errs = 0, tl = LIM;
    function correct() { var c = 0; for (var i = 0; i < N; i++) if (arr[i] === i) c++; return c; }
    function lay() { var W = api.w, H = api.h, sw = Math.min(72, (W - 36) / N); return { sw: sw, x0: (W - sw * N) / 2, base: H * 0.74, mn: 70, mx: Math.min(H * 0.46, 250) }; }
    function setup() { errs = 0; tl = LIM; sel = -1; cur = 0; do { arr = []; for (var i = 0; i < N; i++) arr.push(i); for (var k = N - 1; k > 0; k--) { var j = Math.floor(Math.random() * (k + 1)), t = arr[k]; arr[k] = arr[j]; arr[j] = t; } } while (correct() > 1); }
    function reset() { setup(); st = 'play'; }
    function pick(i) {
      if (st !== 'play' || i < 0 || i >= N) return;
      if (sel < 0) { sel = i; return; }
      if (sel === i) { sel = -1; return; }
      var b = correct(), t = arr[sel]; arr[sel] = arr[i]; arr[i] = t; sel = -1;
      var a = correct(); if (a <= b) errs++;
      if (a === N) st = 'win'; else if (errs >= MAXE) st = 'lose';
    }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, arr: arr.slice(), errs: errs, sel: sel, correct: correct(), tl: tl, x0: L.x0, sw: L.sw, y: L.base - 40 }; },
      down: function (x, y) { if (menu()) return; var L = lay(); pick(Math.floor((x - L.x0) / L.sw)); cur = Math.max(0, Math.min(N - 1, Math.floor((x - L.x0) / L.sw))); },
      key: function (c, d) {
        if (!d) return;
        if (c === 'ArrowLeft' || c === 'KeyA') cur = Math.max(0, cur - 1); else if (c === 'ArrowRight' || c === 'KeyD') cur = Math.min(N - 1, cur + 1);
        else if (c === 'Space' || c === 'Enter') { if (st !== 'play') menu(); else pick(cur); }
      },
      update: function (dt) { if (st !== 'play') return; tl -= dt; if (tl <= 0) st = 'lose'; },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), i, t = api.clock;
        bg('#16243e', '#2c1f3a');
        g.fillStyle = '#3a3a48'; g.beginPath(); g.moveTo(0, H); g.lineTo(0, L.base + 20); g.lineTo(W * 0.3, L.base + 6); g.lineTo(W * 0.7, L.base + 6); g.lineTo(W, L.base + 24); g.lineTo(W, H); g.fill();
        g.fillStyle = 'rgba(255,255,255,.1)'; g.fillRect(L.x0 - 10, L.base + 6, L.sw * N + 20, 4);
        for (i = 0; i < N; i++) {
          var v = arr[i], hh = L.mn + v * (L.mx - L.mn) / (N - 1), cx = L.x0 + i * L.sw + L.sw / 2, ok = v === i, up = sel === i ? 14 : 0, yb = L.base - up;
          g.fillStyle = ok ? '#ffd88a' : '#5a4a8c'; g.beginPath(); g.ellipse(cx, yb - hh / 2, L.sw * 0.3, hh / 2, 0, 0, 6.29); g.fill();
          g.strokeStyle = ok ? '#8a5a1a' : '#c9b3f2'; g.lineWidth = 2; g.beginPath(); g.moveTo(cx, yb + 6); g.lineTo(cx, yb - hh + 4); g.stroke();
          g.strokeStyle = 'rgba(255,255,255,.25)'; g.lineWidth = 1; for (var k = 1; k < 5; k++) { g.beginPath(); g.moveTo(cx, yb - hh * k / 5); g.lineTo(cx - L.sw * 0.24, yb - hh * k / 5 + 10); g.moveTo(cx, yb - hh * k / 5); g.lineTo(cx + L.sw * 0.24, yb - hh * k / 5 + 10); g.stroke(); }
          if (sel === i) { g.strokeStyle = '#fff'; g.lineWidth = 3; g.beginPath(); g.ellipse(cx, yb - hh / 2, L.sw * 0.36, hh / 2 + 6, 0, 0, 6.29); g.stroke(); }
          if (st === 'play' && cur === i) { g.fillStyle = '#fff'; g.beginPath(); g.moveTo(cx, L.base + 22); g.lineTo(cx - 7, L.base + 34); g.lineTo(cx + 7, L.base + 34); g.fill(); }
        }
        txt(T.dica + ' →', W / 2, L.base + 62, 14, 'rgba(255,255,255,.55)');
        bar(W / 2 - 110, H - 22, 220, 6, tl / LIM, tl < 15 ? '#c0392b' : '#8f7fd0');
        hud(T.h1 + ' ' + correct() + '/' + N, T.h2 + ' ' + errs + '/' + MAXE, errs > 0);
        fim(st);
      }
    };
  }
});
