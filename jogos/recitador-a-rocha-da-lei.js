/* O recitador da lei — a rocha da lei (invenção). */
BTJogo.registrar({
  canvas: 'jogo-recitador',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A rocha da lei",
    "sub": "Uma só rocha guarda a lei, e ela tem um número. Toque num número para tentar. O jogo diz se a rocha certa fica num número maior ou menor, e os números que já não servem ficam apagados. Tocar num número apagado conta como erro. Faça poucos erros. São 3 rodadas.",
    "perdeu": "Tentativas demais",
    "v1": "Lei encontrada!",
    "v2": "O recitador da lei, o lagman, foi um cargo da Escandinávia. Adivinhar um número entre rochas é invenção.",
    "h1": "Lei",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The rock of the law",
    "sub": "One rock keeps the law, and it has a number. Tap a number to try. The game says whether the right rock lies at a higher or lower number, and the numbers that no longer fit are dimmed. Tapping a dimmed number counts as a mistake. Make few mistakes. There are 3 rounds.",
    "perdeu": "Too many attempts",
    "v1": "Law found!",
    "v2": "The lawspeaker, the lagman, was an office in Scandinavia. Guessing a number among rocks is invented.",
    "h1": "Law",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Lovbergets stein",
    "sub": "Én stein rommer loven, og den har et tall. Trykk på et tall for å prøve. Spillet sier om riktig stein ligger på et høyere eller lavere tall, og tallene som ikke lenger passer, blir dempet. Å trykke på et dempet tall teller som en feil. Gjør få feil. Det er 3 runder.",
    "perdeu": "For mange forsøk",
    "v1": "Loven er funnet!",
    "v2": "Lovsigemannen, lagmannen, var et embete i Skandinavia. Å gjette et tall blant steiner er oppfunnet.",
    "h1": "Lov",
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
    var NL = 3, lvl = 0, t = 0, pend = 0;
    function lvlUp() { lvl++; pend = 0.9; if (api.nota) api.nota(520, 0.2, 'triangle', 0.07); }
    function tick(dt, load) { if (st !== 'play') return; t += dt; if (pend > 0) { pend -= dt; if (pend <= 0) { if (lvl >= NL) st = 'win'; else load(lvl); } } if (st === 'play' && t >= LIM) st = 'lose'; }
    function foot() { bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 60 ? '#c0392b' : '#ffd88a'); }
    function hh() { hud(T.h1 + ' ' + Math.min(lvl + 1, NL) + '/' + NL, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false); }
    function glay(R, C, top, bot) { var W = api.w, H = api.h, s = Math.min((W - 24) / C, (H - top - bot) / R, 96); return { s: s, x0: (W - s * C) / 2, y0: top + ((H - top - bot) - s * R) / 2 }; }
    function sh(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
    var NN = [16, 32, 64], MM = [5, 6, 7], LIM = 300, N = 12, M = 4, secret = 1, lo = 1, hi = 12, err = 0, hint = 0, hintT = 0, shake = -1;
    function load(i) { N = NN[i]; M = MM[i]; secret = 1 + Math.floor(Math.random() * N); lo = 1; hi = N; err = 0; hint = 0; }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function L() {
      var W = api.w, H = api.h, C = Math.max(3, Math.ceil(Math.sqrt(N * (W - 24) / Math.max(120, H - 134)))), R = Math.ceil(N / C), l = glay(R, C, 96, 44);
      l.C = C; l.R = R; return l;
    }
    function pos() { var l = L(), a = [], i; for (i = 0; i < N; i++) a.push({ x: l.x0 + (i % l.C + 0.5) * l.s, y: l.y0 + (Math.floor(i / l.C) + 0.5) * l.s }); return a; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lvl: lvl, pend: pend, err: err, lo: lo, hi: hi, pos: pos() }; },
      down: function (x, y) {
        if (menu()) return; if (pend > 0 || st !== 'play') return;
        var l = L(), c = Math.floor((x - l.x0) / l.s), r = Math.floor((y - l.y0) / l.s);
        if (c < 0 || r < 0 || c >= l.C) return;
        var v = r * l.C + c + 1; if (v < 1 || v > N) return;
        if (v < lo || v > hi) { err++; if (api.nota) api.nota(130, 0.15, 'sawtooth', 0.05); if (err >= M) st = 'lose'; return; }
        if (v === secret) { lvlUp(); return; }
        err++; hint = v < secret ? 1 : -1; hintT = 1.6; if (v < secret) lo = v + 1; else hi = v - 1;
        if (api.nota) api.nota(v < secret ? 440 : 220, 0.12, 'triangle', 0.05);
        if (err >= M) st = 'lose';
      },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) { if (hintT > 0) hintT -= dt; tick(dt, load); },
      draw: function () {
        var l = L(), s = l.s, i; bg('#26211a', '#0a0806');
        for (i = 0; i < N; i++) {
          var v = i + 1, x = l.x0 + (i % l.C) * s, y = l.y0 + Math.floor(i / l.C) * s, live = v >= lo && v <= hi;
          g.fillStyle = live ? '#7d7466' : 'rgba(255,255,255,.07)'; rr(x + 3, y + 3, s - 6, s - 6, s * 0.28); g.fill();
          if (live) { g.fillStyle = 'rgba(255,255,255,.12)'; rr(x + 6, y + 6, s - 12, (s - 12) * 0.4, s * 0.2); g.fill(); }
          txt(String(v), x + s / 2, y + s / 2 + s * 0.12, Math.max(15, s * 0.36), live ? '#fff4d6' : '#6a655c');
        }
        if (hintT > 0 && hint) { var sy = 78; g.fillStyle = hint > 0 ? '#8fcf7a' : '#ff9a8d'; g.beginPath(); if (hint > 0) { g.moveTo(api.w - 40, sy - 10); g.lineTo(api.w - 28, sy + 10); g.lineTo(api.w - 52, sy + 10); } else { g.moveTo(api.w - 40, sy + 10); g.lineTo(api.w - 28, sy - 10); g.lineTo(api.w - 52, sy - 10); } g.closePath(); g.fill(); }
        foot(); hud(T.h1 + ' ' + Math.min(lvl + 1, NL) + '/' + NL, T.h2 + ' ' + err + '/' + M, true); fim(st);
      }
    };

  }
});
