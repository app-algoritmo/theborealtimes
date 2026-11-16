/* Julbock, o bode de Natal — descubra o código de cores de palha (invenção). */
BTJogo.registrar({
  canvas: 'jogo-julbock',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O código do bode de palha",
    "sub": "Há um código secreto de 4 feixes, em 5 cores que podem se repetir. Escolha as cores e toque em Enviar. Cada peça preta diz que uma cor está certa no lugar certo; cada peça branca, que a cor existe mas está em outro lugar. Descubra o código em 8 tentativas e 180 segundos. (Teclado: 1 a 5 escolhem, Apagar volta, Enter envia.)",
    "perdeu": "As tentativas ou o tempo acabaram",
    "v1": "O código foi descoberto!",
    "v2": "O julbock, o bode de Natal escandinavo, ganhou muitas formas, e o bode de palha é comum até hoje. O código é invenção.",
    "h1": "Tentativa",
    "h2": "Tempo",
    "b1": "Enviar"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The straw goat code",
    "sub": "There is a secret code of 4 bundles, in 5 colours that can repeat. Pick the colours and tap Submit. Each black peg says one colour is right in the right place; each white peg, that the colour exists but is elsewhere. Crack the code in 8 guesses and 180 seconds. (Keyboard: 1 to 5 pick, Backspace undoes, Enter submits.)",
    "perdeu": "The guesses or the time ran out",
    "v1": "The code is cracked!",
    "v2": "The julbock, the Scandinavian Yule goat, has taken many forms, and the straw goat is common to this day. The code is invented.",
    "h1": "Guess",
    "h2": "Time",
    "b1": "Submit"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Halmbukkens kode",
    "sub": "Det finnes en hemmelig kode på 4 knipper, i 5 farger som kan gjentas. Velg fargene og trykk på Send. Hver svarte brikke sier at en farge er riktig på riktig plass; hver hvite, at fargen finnes men står et annet sted. Knekk koden på 8 forsøk og 180 sekunder. (Tastatur: 1 til 5 velger, Backspace angrer, Enter sender.)",
    "perdeu": "Forsøkene eller tiden tok slutt",
    "v1": "Koden er knekt!",
    "v2": "Julebukken, den skandinaviske julebukken, har hatt mange former, og halmbukken er vanlig den dag i dag. Koden er oppfunnet.",
    "h1": "Forsøk",
    "h2": "Tid",
    "b1": "Send"
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
    var NS = 4, NC = 5, MAXA = 8, LIM = 180;
    var COLS = ['#d9b95a', '#c0563f', '#4a98b8', '#4b8a4b', '#8a6bb0'];
    var secret = [], hist = [], curg = [], t = 0;
    function lay() {
      var W = api.w, H = api.h, y0 = 72, yb = H - 126, rh = Math.min(42, (yb - y0) / MAXA), ss = Math.min(56, (W - 130) / NS), pd = Math.min(58, (W - 40) / NC);
      return { W: W, H: H, y0: y0, rh: rh, ss: ss, sx0: W / 2 - ss * 1.95, pd: pd, py: H - 90, pr: Math.min(24, pd * 0.4), subx: W / 2 - 90, suby: H - 56, subw: 180, subh: 38 };
    }
    function slot(r, k) { var L = lay(); return { x: L.sx0 + k * L.ss, y: L.y0 + r * L.rh + L.rh / 2 }; }
    function pal(i) { var L = lay(); return { x: L.W / 2 + (i - (NC - 1) / 2) * L.pd, y: L.py }; }
    function fb(sec, gs) {
      var ex = 0, a = [], b = [], i; for (i = 0; i < NS; i++) { if (sec[i] === gs[i]) ex++; else { a.push(sec[i]); b.push(gs[i]); } }
      var wh = 0; b.forEach(function (c) { var j = a.indexOf(c); if (j >= 0) { a.splice(j, 1); wh++; } }); return [ex, wh];
    }
    function reset() { secret = []; for (var i = 0; i < NS; i++) secret.push(Math.floor(Math.random() * NC)); hist = []; curg = []; t = 0; st = 'play'; }
    function addc(c) { if (st === 'play' && curg.length < NS) { curg.push(c); if (api.nota) api.nota(300 + c * 60, 0.08, 'triangle', 0.05); } }
    function undo() { if (st === 'play' && curg.length) curg.pop(); }
    function submit() {
      if (st !== 'play' || curg.length < NS) return; var r = fb(secret, curg); hist.push({ g: curg.slice(), ex: r[0], wh: r[1] }); curg = [];
      if (r[0] === NS) { st = 'win'; if (api.nota) api.nota(700, 0.25, 'sine', 0.06); } else if (hist.length >= MAXA) st = 'lose';
    }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, attempt: hist.length, cur: curg.slice(), hist: hist.map(function (h) { return { g: h.g.slice(), ex: h.ex, wh: h.wh }; }), pal: [0, 1, 2, 3, 4].map(pal), submit: { x: L.subx + L.subw / 2, y: L.suby + L.subh / 2 }, slots: [0, 1, 2, 3].map(function (k) { return slot(hist.length, k); }), secret: secret.slice(), t: t }; },
      down: function (x, y) {
        if (menu()) return; var L = lay(), i;
        if (x >= L.subx && x <= L.subx + L.subw && y >= L.suby && y <= L.suby + L.subh) { submit(); return; }
        for (i = 0; i < NC; i++) { var p = pal(i); if (Math.hypot(x - p.x, y - p.y) <= L.pr + 8) { addc(i); return; } }
        for (i = 0; i < curg.length; i++) { var s = slot(hist.length, i); if (Math.hypot(x - s.x, y - s.y) <= L.rh * 0.5 + 6) { curg.splice(i, 1); return; } }
      },
      move: function () {}, up: function () {},
      key: function (k, d) {
        if (!d) return; if (st !== 'play') { menu(); return; }
        var m = /^(Digit|Numpad)([1-5])$/.exec(k); if (m) addc(parseInt(m[2], 10) - 1); else if (k === 'Backspace' || k === 'Delete') undo(); else if (k === 'Enter' || k === 'Space') submit();
      },
      update: function (dt) { if (st !== 'play') return; t += dt; if (t >= LIM) st = 'lose'; },
      draw: function () {
        var L = lay(), r, k, i;
        bg('#3a2e1c', '#140f08');
        for (r = 0; r < MAXA; r++) {
          g.fillStyle = r === hist.length && st === 'play' ? 'rgba(255,216,138,.12)' : 'rgba(0,0,0,.2)'; rr(L.sx0 - L.ss * 0.55, L.y0 + r * L.rh + 2, L.ss * 5, L.rh - 4, 8); g.fill();
          for (k = 0; k < NS; k++) {
            var s = slot(r, k), c = r < hist.length ? hist[r].g[k] : (r === hist.length && k < curg.length ? curg[k] : -1);
            g.fillStyle = c >= 0 ? COLS[c] : 'rgba(255,255,255,.1)'; g.beginPath(); g.arc(s.x, s.y, L.rh * 0.34, 0, 6.283); g.fill();
            if (c >= 0) { g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 2; g.stroke(); g.strokeStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.moveTo(s.x - L.rh * 0.18, s.y); g.lineTo(s.x + L.rh * 0.18, s.y); g.moveTo(s.x - L.rh * 0.12, s.y - L.rh * 0.12); g.lineTo(s.x + L.rh * 0.12, s.y + L.rh * 0.12); g.stroke(); }
          }
          if (r < hist.length) { var bx = L.sx0 + (NS - 1) * L.ss + L.ss * 0.9, by = L.y0 + r * L.rh + L.rh / 2, h = hist[r]; for (i = 0; i < NS; i++) { var ox = (i % 2) * L.rh * 0.3, oy = (Math.floor(i / 2) - 0.5) * L.rh * 0.3; g.fillStyle = i < h.ex ? '#111' : i < h.ex + h.wh ? '#f3ecd2' : 'rgba(255,255,255,.12)'; g.beginPath(); g.arc(bx + ox, by + oy, L.rh * 0.11, 0, 6.283); g.fill(); if (i < h.ex + h.wh) { g.strokeStyle = '#999'; g.lineWidth = 1; g.stroke(); } } }
        }
        for (i = 0; i < NC; i++) { var p = pal(i); g.fillStyle = COLS[i]; g.beginPath(); g.arc(p.x, p.y, L.pr, 0, 6.283); g.fill(); g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 2; g.stroke(); txt(String(i + 1), p.x, p.y + 6, 15, '#222'); }
        g.fillStyle = curg.length === NS ? '#a67c2a' : '#5a5040'; rr(L.subx, L.suby, L.subw, L.subh, 10); g.fill(); txt(T.b1, L.subx + L.subw / 2, L.suby + L.subh / 2 + 7, 20, '#fff');
        bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 20 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + Math.min(hist.length + 1, MAXA) + '/' + MAXA, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };
  }
});
