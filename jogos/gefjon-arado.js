/* A terra de Gefjon — divida o chão em retângulos, um para cada número. */
BTJogo.registrar({
  canvas: 'jogo-gefjon',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A terra de Gefjon",
    "sub": "Gefjon quer cortar a terra em lotes. Arraste de uma casa a outra para marcar um retângulo (ou use as setas e a barra de espaço nos dois cantos). Cada retângulo deve ter um número só, igual à sua área. Cubra todo o chão. No quarto engano o jogo acaba.",
    "perdeu": "O arado se perdeu no meio da terra",
    "v1": "A ilha está cortada!",
    "v2": "Segundo Snorri, Gefjon arou uma ilha inteira numa noite. A divisão em lotes é invenção do jogo.",
    "h1": "Lotes",
    "h2": "Enganos",
    "dica": "toque num lote para desfazer"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Gefjon's land",
    "sub": "Gefjon wants to cut the land into plots. Drag from one square to another to mark a rectangle (or use the arrows and Space on both corners). Each rectangle must hold exactly one number, equal to its area. Cover the whole ground. The fourth mistake ends the game.",
    "perdeu": "The plough was lost in the land",
    "v1": "The island is cut!",
    "v2": "According to Snorri, Gefjon ploughed a whole island in one night. The plots in the game are made up.",
    "h1": "Plots",
    "h2": "Mistakes",
    "dica": "tap a plot to undo it"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Gefjons jord",
    "sub": "Gefjon vil skjære jorda i tomter. Dra fra en rute til en annen for å markere et rektangel (eller bruk piltastene og mellomromstasten på begge hjørnene). Hvert rektangel skal ha ett tall, lik arealet. Dekk hele bakken. Ved fjerde feil er spillet over.",
    "perdeu": "Plogen gikk seg bort i jorda",
    "v1": "Øya er skåret ut!",
    "v2": "Ifølge Snorre pløyde Gefjon en hel øy på én natt. Tomtene i spillet er diktet opp.",
    "h1": "Tomter",
    "h2": "Feil",
    "dica": "trykk på en tomt for å angre"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "La tierra de Gefjon",
    "sub": "Gefjon quiere cortar la tierra en parcelas. Arrastra de una casilla a otra para marcar un rectángulo (o usa las flechas y la barra espaciadora en las dos esquinas). Cada rectángulo debe tener un solo número, igual a su área. Cubre todo el suelo. Al cuarto error el juego termina.",
    "perdeu": "El arado se perdió en medio de la tierra",
    "v1": "¡La isla está cortada!",
    "v2": "Según Snorri, Gefjon aró una isla entera en una noche. La división en parcelas es invención del juego.",
    "h1": "Parcelas",
    "h2": "Errores",
    "dica": "toca una parcela para deshacer"
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
    var N = 6, MAXE = 4, LIM = 200, tmr = 200, PAL = ['#d9a86a', '#8ab56a', '#6aa8d9', '#c98ac0', '#d97a6a', '#b0b06a', '#6ac9b0', '#c9a0d9', '#9aa0d9'];
    var num = [], sol = [], cl = [], own = [], errs = 0, a0 = null, a1 = null, cur = [0, 0], anc = null, flash = 0, fr = null;
    function lay() { var W = api.w, H = api.h, S = Math.min(W - 40, H * 0.68, 400); return { S: S, c: S / N, x: (W - S) / 2, y: Math.max(66, (H - S) / 2 + 12) }; }
    function split(r, c, h, w, out) {
      var a = h * w; if (a <= 2 || (a <= 9 && Math.random() < 0.5)) { out.push({ r: r, c: c, h: h, w: w }); return; }
      var opts = [], k;
      for (k = 1; k < h; k++) if (k * w >= 2 && (h - k) * w >= 2) opts.push([0, k]);
      for (k = 1; k < w; k++) if (k * h >= 2 && (w - k) * h >= 2) opts.push([1, k]);
      if (!opts.length) { out.push({ r: r, c: c, h: h, w: w }); return; }
      var o = opts[Math.floor(Math.random() * opts.length)];
      if (o[0] === 0) { split(r, c, o[1], w, out); split(r + o[1], c, h - o[1], w, out); } else { split(r, c, h, o[1], out); split(r, c + o[1], h, w - o[1], out); }
    }
    function setup() {
      do { sol = []; split(0, 0, N, N, sol); } while (sol.length < 6 || sol.length > 10);
      num = []; for (var i = 0; i < N * N; i++) num.push(0);
      sol.forEach(function (q) { var rr = q.r + Math.floor(Math.random() * q.h), cc = q.c + Math.floor(Math.random() * q.w); num[rr * N + cc] = q.h * q.w; });
      tmr = LIM; cl = []; own = []; for (i = 0; i < N * N; i++) own.push(-1); errs = 0; a0 = a1 = null; anc = null; cur = [0, 0]; flash = 0;
    }
    function reset() { setup(); st = 'play'; }
    function norm(p, q) { return { r: Math.min(p[0], q[0]), c: Math.min(p[1], q[1]), h: Math.abs(p[0] - q[0]) + 1, w: Math.abs(p[1] - q[1]) + 1 }; }
    function covered() { var n = 0; for (var i = 0; i < N * N; i++) if (own[i] >= 0) n++; return n; }
    function rebuild() { own = []; for (var i = 0; i < N * N; i++) own.push(-1); cl.forEach(function (q, k) { for (var r = q.r; r < q.r + q.h; r++) for (var c = q.c; c < q.c + q.w; c++) own[r * N + c] = k; }); }
    function attempt(p, q) {
      if (st !== 'play') return; var R = norm(p, q), cnt = 0, val = 0, bad = false, r, c;
      for (r = R.r; r < R.r + R.h; r++) for (c = R.c; c < R.c + R.w; c++) { if (own[r * N + c] >= 0) bad = true; if (num[r * N + c]) { cnt++; val = num[r * N + c]; } }
      if (bad || cnt !== 1 || val !== R.h * R.w) { errs++; flash = 0.5; fr = R; if (errs >= MAXE) st = 'lose'; return; }
      cl.push(R); rebuild(); if (api.nota) api.nota(440 + cl.length * 40, 0.1, 'triangle', 0.06); if (covered() === N * N) st = 'win';
    }
    function cellAt(x, y) { var L = lay(), c = Math.floor((x - L.x) / L.c), r = Math.floor((y - L.y) / L.c); if (c < 0 || c >= N || r < 0 || r >= N) return null; return [r, c]; }
    setup();
    return {
      pausar: function () { a0 = a1 = null; },
      dbg: function () { var L = lay(); return { st: st, sol: sol.map(function (q) { return { r: q.r, c: q.c, h: q.h, w: q.w }; }), errs: errs, claimed: cl.length, covered: covered(), x: L.x, y: L.y, c: L.c }; },
      down: function (x, y) { if (menu()) return; var p = cellAt(x, y); if (p) { a0 = p; a1 = p; } },
      move: function (x, y, pr) { if (a0 && pr !== false) { var p = cellAt(x, y); if (p) a1 = p; } },
      up: function () {
        if (!a0) return; var p = a0, q = a1 || a0; a0 = a1 = null;
        if (p[0] === q[0] && p[1] === q[1] && own[p[0] * N + p[1]] >= 0) { cl.splice(own[p[0] * N + p[1]], 1); rebuild(); return; }
        if (p[0] === q[0] && p[1] === q[1] && !(num[p[0] * N + p[1]] === 1)) { /* toque sozinho: espera segundo toque */ if (anc) { var an = anc; anc = null; attempt(an, p); } else anc = p; return; }
        attempt(p, q);
      },
      key: function (c, d) {
        if (!d) return;
        if (c === 'ArrowLeft' || c === 'KeyA') cur[1] = Math.max(0, cur[1] - 1); else if (c === 'ArrowRight' || c === 'KeyD') cur[1] = Math.min(N - 1, cur[1] + 1);
        else if (c === 'ArrowUp' || c === 'KeyW') cur[0] = Math.max(0, cur[0] - 1); else if (c === 'ArrowDown' || c === 'KeyS') cur[0] = Math.min(N - 1, cur[0] + 1);
        else if (c === 'Space' || c === 'Enter') { if (st !== 'play') { menu(); return; } if (own[cur[0] * N + cur[1]] >= 0) { cl.splice(own[cur[0] * N + cur[1]], 1); rebuild(); anc = null; return; } if (anc) { var an = anc; anc = null; attempt(an, cur.slice()); } else anc = cur.slice(); }
      },
      update: function (dt) { if (flash > 0) flash -= dt; if (st === 'play') { tmr -= dt; if (tmr <= 0) st = 'lose'; } },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), i, r, c;
        bg('#2b3a2a', '#101a12');
        g.fillStyle = 'rgba(255,255,255,.06)'; rr(L.x - 8, L.y - 8, L.S + 16, L.S + 16, 10); g.fill();
        for (i = 0; i < cl.length; i++) { var q = cl[i]; g.fillStyle = PAL[i % PAL.length]; rr(L.x + q.c * L.c + 2, L.y + q.r * L.c + 2, q.w * L.c - 4, q.h * L.c - 4, 8); g.fill(); }
        g.strokeStyle = 'rgba(255,255,255,.18)'; g.lineWidth = 1; for (i = 0; i <= N; i++) { g.beginPath(); g.moveTo(L.x + i * L.c, L.y); g.lineTo(L.x + i * L.c, L.y + L.S); g.moveTo(L.x, L.y + i * L.c); g.lineTo(L.x + L.S, L.y + i * L.c); g.stroke(); }
        for (r = 0; r < N; r++) for (c = 0; c < N; c++) if (num[r * N + c]) txt(String(num[r * N + c]), L.x + c * L.c + L.c / 2, L.y + r * L.c + L.c / 2 + 8, 22, own[r * N + c] >= 0 ? '#1a1a1a' : '#f3ecd2');
        var d = null; if (a0) d = norm(a0, a1 || a0); else if (anc) d = norm(anc, cur);
        if (d && st === 'play') { g.strokeStyle = '#fff'; g.lineWidth = 3; rr(L.x + d.c * L.c + 2, L.y + d.r * L.c + 2, d.w * L.c - 4, d.h * L.c - 4, 8); g.stroke(); }
        if (st === 'play') { g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 2; g.strokeRect(L.x + cur[1] * L.c + 5, L.y + cur[0] * L.c + 5, L.c - 10, L.c - 10); }
        if (flash > 0 && fr) { g.strokeStyle = '#ff8a7a'; g.lineWidth = 4; rr(L.x + fr.c * L.c + 2, L.y + fr.r * L.c + 2, fr.w * L.c - 4, fr.h * L.c - 4, 8); g.stroke(); }
        txt(T.dica, W / 2, L.y + L.S + 34, 14, 'rgba(255,255,255,.5)'); bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 30 ? '#c0392b' : '#8ab56a');
        hud(T.h1 + ' ' + cl.length + '/' + sol.length, T.h2 + ' ' + errs + '/' + MAXE, errs > 0);
        fim(st);
      }
    };
  }
});
