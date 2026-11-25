/* O mercado de Kaupang — arrume as mercadorias sem repetir nenhuma na fila. */
BTJogo.registrar({
  canvas: 'jogo-kaupang',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O mercado de Kaupang",
    "sub": "Quatro mercadorias, quatro bancas em cada fila. Preencha as casas vazias de modo que nenhuma mercadoria se repita em nenhuma linha nem em nenhuma coluna. Toque numa casa vazia e depois na mercadoria (ou use as setas e as teclas de 1 a 4). Uma casa errada conta como erro, e no terceiro erro o jogo acaba.",
    "perdeu": "As bancas ficaram em desordem",
    "v1": "O mercado está em ordem!",
    "v2": "Kaupang, na Noruega, foi um mercado da Era Viking, perto de Larvik. Os quadrados do jogo são invenção.",
    "h1": "Casas",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Kaupang's market",
    "sub": "Four goods, four stalls in each row. Fill the empty squares so that no good repeats in any row or column. Tap an empty square, then a good (or use the arrows and the keys 1 to 4). A wrong square counts as a mistake, and the third mistake ends the game.",
    "perdeu": "The stalls fell into disorder",
    "v1": "The market is in order!",
    "v2": "Kaupang, in Norway, was a Viking Age market near Larvik. The squares in the game are made up.",
    "h1": "Squares",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Markedet i Kaupang",
    "sub": "Fire varer, fire boder i hver rad. Fyll de tomme rutene slik at ingen vare gjentas i noen rad eller kolonne. Trykk på en tom rute, og deretter på en vare (eller bruk piltastene og tastene 1 til 4). En feil rute teller som feil, og ved den tredje feilen er spillet over.",
    "perdeu": "Bodene havnet i uorden",
    "v1": "Markedet er i orden!",
    "v2": "Kaupang i Norge var et marked i vikingtiden, nær Larvik. Rutene i spillet er diktet opp.",
    "h1": "Ruter",
    "h2": "Feil"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "El mercado de Kaupang",
    "sub": "Cuatro mercancías, cuatro puestos en cada fila. Rellena las casillas vacías de modo que ninguna mercancía se repita en ninguna fila ni en ninguna columna. Toca una casilla vacía y después la mercancía (o usa las flechas y las teclas del 1 al 4). Una casilla equivocada cuenta como error, y al tercer error el juego termina.",
    "perdeu": "Los puestos quedaron en desorden",
    "v1": "¡El mercado está en orden!",
    "v2": "Kaupang, en Noruega, fue un mercado de la era vikinga, cerca de Larvik. Los cuadrados del juego son invención.",
    "h1": "Casillas",
    "h2": "Errores"
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
    var N = 4, EMPT = 8, MAXE = 3, COLS = ['#d9a23a', '#d8d8e8', '#c0553a', '#6ac9b0'];
    var sol = [], val = [], sel = 0, errs = 0, filled = 0, fl = -1, fT = 0;
    function perm(n) { var a = []; for (var i = 0; i < n; i++) a.push(i); for (i = n - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
    function ok(g, k, v) { var r = Math.floor(k / N), c = k % N; for (var i = 0; i < N; i++) { if (g[r * N + i] === v && r * N + i !== k) return false; if (g[i * N + c] === v && i * N + c !== k) return false; } return true; }
    function count(g, lim) { var k = g.indexOf(0); if (k < 0) return 1; var n = 0; for (var v2 = 1; v2 <= N; v2++) if (ok(g, k, v2)) { g[k] = v2; n += count(g, lim); g[k] = 0; if (n >= lim) break; } return n; }
    function make() {
      for (var tries = 0; tries < 200; tries++) {
        var pr = perm(N), pc = perm(N), ps = perm(N), s = []; for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) s.push(ps[(pr[r] + pc[c]) % N] + 1);
        var g2 = s.slice(), order = perm(N * N), rm = 0; for (var i = 0; i < order.length && rm < EMPT; i++) { var k = order[i], old = g2[k]; g2[k] = 0; if (count(g2.slice(), 2) === 1) rm++; else g2[k] = old; }
        if (rm === EMPT) { sol = s; val = g2; return; }
      }
      sol = [1, 2, 3, 4, 2, 1, 4, 3, 3, 4, 1, 2, 4, 3, 2, 1]; val = sol.slice(); [0, 1, 2, 5, 6, 10, 11, 15].forEach(function (k) { val[k] = 0; });
    }
    function setup() { make(); errs = 0; filled = 0; fl = -1; fT = 0; sel = val.indexOf(0); }
    function reset() { setup(); st = 'play'; }
    function lay() { var S = Math.min(api.w - 40, api.h - 220, 300), c = S / N; return { S: S, c: c, x: (api.w - S) / 2, y: Math.max(68, (api.h - S - 110) / 2 + 10) }; }
    function pal() { var L = lay(), w = Math.min(70, (api.w - 30) / 4), o = []; for (var i = 0; i < 4; i++) o.push({ x: api.w / 2 + (i - 1.5) * (w + 8), y: L.y + L.S + 54, r: w / 2 }); return o; }
    function place(v2) {
      if (st !== 'play' || sel < 0 || val[sel]) return; if (sol[sel] === v2) { val[sel] = v2; filled++; if (api.nota) api.nota(520, 0.08, 'triangle', 0.05); var nx = val.indexOf(0); if (nx >= 0) sel = nx; if (filled >= EMPT) st = 'win'; } else { errs++; fl = sel; fT = 0.5; if (api.nota) api.nota(140, 0.15, 'sawtooth', 0.05); if (errs >= MAXE) st = 'lose'; }
    }
    function good(i, x, y, r) { g.fillStyle = COLS[i]; g.strokeStyle = 'rgba(0,0,0,.45)'; g.lineWidth = 2; g.beginPath(); if (i === 0) g.arc(x, y, r, 0, 6.29); else if (i === 1) { g.rect(x - r * 0.85, y - r * 0.85, r * 1.7, r * 1.7); } else if (i === 2) { g.moveTo(x, y - r); g.lineTo(x + r, y + r * 0.8); g.lineTo(x - r, y + r * 0.8); g.closePath(); } else { g.moveTo(x, y - r); g.lineTo(x + r, y); g.lineTo(x, y + r); g.lineTo(x - r, y); g.closePath(); } g.fill(); g.stroke(); }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(), p = pal(); return { st: st, sol: sol.slice(), val: val.slice(), sel: sel, errs: errs, filled: filled, x: L.x, y: L.y, c: L.c, pal: p.map(function (q) { return { x: q.x, y: q.y }; }) }; },
      down: function (x, y) {
        if (menu()) return; var L = lay(), p = pal(), i; for (i = 0; i < 4; i++) if (Math.hypot(x - p[i].x, y - p[i].y) <= p[i].r + 4) { place(i + 1); return; }
        var c = Math.floor((x - L.x) / L.c), r = Math.floor((y - L.y) / L.c); if (c >= 0 && c < N && r >= 0 && r < N) sel = r * N + c;
      },
      key: function (c, d) {
        if (!d) return; var r = Math.floor(sel / N), cc = sel % N;
        if (c === 'ArrowLeft' || c === 'KeyA') cc = Math.max(0, cc - 1); else if (c === 'ArrowRight' || c === 'KeyD') cc = Math.min(N - 1, cc + 1); else if (c === 'ArrowUp' || c === 'KeyW') r = Math.max(0, r - 1); else if (c === 'ArrowDown' || c === 'KeyS') r = Math.min(N - 1, r + 1);
        else if (/^(Digit|Numpad)[1-4]$/.test(c)) { place(+c.slice(-1)); return; } else if (c === 'Space' || c === 'Enter') { if (st !== 'play') menu(); return; }
        sel = r * N + cc;
      },
      update: function (dt) { if (fT > 0) fT -= dt; },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), p = pal(), r, c, i;
        bg('#2a2a22', '#0f0f0a'); g.fillStyle = 'rgba(255,255,255,.06)'; rr(L.x - 8, L.y - 8, L.S + 16, L.S + 16, 10); g.fill();
        for (r = 0; r < N; r++) for (c = 0; c < N; c++) {
          var k = r * N + c, X = L.x + c * L.c, Y = L.y + r * L.c; g.fillStyle = k === sel && st === 'play' ? 'rgba(255,255,255,.2)' : 'rgba(255,255,255,.07)'; g.fillRect(X + 2, Y + 2, L.c - 4, L.c - 4);
          if (val[k]) good(val[k] - 1, X + L.c / 2, Y + L.c / 2, L.c * 0.3); if (fT > 0 && fl === k) { g.strokeStyle = '#ff8a7a'; g.lineWidth = 4; g.strokeRect(X + 3, Y + 3, L.c - 6, L.c - 6); }
        }
        for (i = 0; i < 4; i++) { g.fillStyle = 'rgba(255,255,255,.08)'; g.beginPath(); g.arc(p[i].x, p[i].y, p[i].r, 0, 6.29); g.fill(); good(i, p[i].x, p[i].y, p[i].r * 0.55); txt(String(i + 1), p[i].x, p[i].y + p[i].r + 16, 13, 'rgba(255,255,255,.5)'); }
        hud(T.h1 + ' ' + filled + '/' + EMPT, T.h2 + ' ' + errs + '/' + MAXE, errs > 0);
        fim(st);
      }
    };
  }
});
