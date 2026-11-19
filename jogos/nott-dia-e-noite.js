/* Nótt e Dagr — dia e noite (invenção). */
BTJogo.registrar({
  canvas: 'jogo-nott',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Dia e noite",
    "sub": "Cada casa da grade deve ter um sol ou uma lua. Toque numa casa vazia para pôr um sol, toque de novo para trocar por uma lua e mais uma vez para esvaziá-la. Em cada linha e em cada coluna, metade das casas tem sol e metade tem lua, e nunca três iguais seguidas. As casas fixas não mudam. Casas em conflito ficam avermelhadas. O tempo é limitado. São 3 grades.",
    "perdeu": "O tempo acabou",
    "v1": "Dia e noite em equilíbrio!",
    "v2": "Nas Eddas, Nótt e Dagr recebem de Odin cada um uma carruagem e um cavalo e percorrem o céu a cada 24 horas, com Nótt à frente. Preencher sóis e luas é invenção.",
    "h1": "Grade",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Day and night",
    "sub": "Each square of the grid must hold a sun or a moon. Tap an empty square to place a sun, tap again to switch to a moon and once more to empty it. In every row and every column, half the squares hold a sun and half a moon, and never three alike in a row. Fixed squares do not change. Squares in conflict turn reddish. Time is limited. There are 3 grids.",
    "perdeu": "Time ran out",
    "v1": "Day and night in balance!",
    "v2": "In the Eddas, Nótt and Dagr are each given a chariot and a horse by Odin and travel across the sky every 24 hours, with Nótt ahead. Filling suns and moons is invented.",
    "h1": "Grid",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Dag og natt",
    "sub": "Hver rute i rutenettet skal ha en sol eller en måne. Trykk på en tom rute for å sette en sol, trykk igjen for å bytte til en måne og én gang til for å tømme den. I hver rad og hver kolonne har halvparten av rutene sol og halvparten måne, og aldri tre like på rad. De faste rutene endrer seg ikke. Ruter i konflikt blir rødlige. Tiden er begrenset. Det er 3 rutenett.",
    "perdeu": "Tiden tok slutt",
    "v1": "Dag og natt i balanse!",
    "v2": "I Eddaene får Nótt og Dagr hver sin vogn og hver sin hest av Odin og farer over himmelen hvert døgn, med Nótt foran. Å fylle sol og måne er oppfunnet.",
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
    var NS = [4, 6, 6], FR = [0.45, 0.38, 0.33], LIM = 360;
    var n = 4, sol = [], cur = [], lock = [];
    function okAt(a, i, v, N) {
      var x = i % N, y = Math.floor(i / N), k, c;
      if (x >= 2 && a[i - 1] === v && a[i - 2] === v) return false;
      if (y >= 2 && a[i - N] === v && a[i - 2 * N] === v) return false;
      for (c = 0, k = 0; k < x; k++) if (a[y * N + k] === v) c++; if (c >= N / 2) return false;
      for (c = 0, k = 0; k < y; k++) if (a[k * N + x] === v) c++; if (c >= N / 2) return false;
      return true;
    }
    function fill(a, i, N) {
      if (i === N * N) return true;
      var o = Math.random() < 0.5 ? [1, 2] : [2, 1], k;
      for (k = 0; k < 2; k++) if (okAt(a, i, o[k], N)) { a[i] = o[k]; if (fill(a, i + 1, N)) return true; a[i] = 0; }
      return false;
    }
    function load(i) {
      n = NS[i]; for (;;) { sol = []; for (var k = 0; k < n * n; k++) sol.push(0); if (fill(sol, 0, n)) break; }
      cur = []; lock = []; for (var j = 0; j < n * n; j++) { var l = Math.random() < FR[i]; lock.push(l); cur.push(l ? sol[j] : 0); }
    }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function viol() {
      var v = [], N = n, i, k, y, x, c1, c2, a;
      for (i = 0; i < N * N; i++) v.push(false);
      for (y = 0; y < N; y++) for (x = 0; x < N; x++) {
        i = y * N + x; a = cur[i]; if (!a) continue;
        if (x >= 2 && cur[i - 1] === a && cur[i - 2] === a) v[i] = v[i - 1] = v[i - 2] = true;
        if (y >= 2 && cur[i - N] === a && cur[i - 2 * N] === a) v[i] = v[i - N] = v[i - 2 * N] = true;
      }
      for (y = 0; y < N; y++) { c1 = 0; c2 = 0; for (x = 0; x < N; x++) { if (cur[y * N + x] === 1) c1++; if (cur[y * N + x] === 2) c2++; }
        for (x = 0; x < N; x++) { k = cur[y * N + x]; if ((k === 1 && c1 > N / 2) || (k === 2 && c2 > N / 2)) v[y * N + x] = true; } }
      for (x = 0; x < N; x++) { c1 = 0; c2 = 0; for (y = 0; y < N; y++) { if (cur[y * N + x] === 1) c1++; if (cur[y * N + x] === 2) c2++; }
        for (y = 0; y < N; y++) { k = cur[y * N + x]; if ((k === 1 && c1 > N / 2) || (k === 2 && c2 > N / 2)) v[y * N + x] = true; } }
      return v;
    }
    function done() { var v = viol(); for (var i = 0; i < n * n; i++) if (!cur[i] || v[i]) return false; return true; }
    function tap(i) { if (pend > 0 || st !== 'play' || lock[i]) return; cur[i] = (cur[i] + 1) % 3; if (api.nota) api.nota(320, 0.04, 'square', 0.03); if (done()) lvlUp(); }
    function pos() { var L = glay(n, n, 70, 30), a = []; for (var i = 0; i < n * n; i++) a.push({ x: L.x0 + (i % n + 0.5) * L.s, y: L.y0 + (Math.floor(i / n) + 0.5) * L.s }); return a; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lvl: lvl, pend: pend, sol: sol.slice(), cur: cur.slice(), lock: lock.slice(), pos: pos() }; },
      down: function (x, y) { if (menu()) return; var L = glay(n, n, 70, 30), c = Math.floor((x - L.x0) / L.s), r = Math.floor((y - L.y0) / L.s); if (c < 0 || r < 0 || c >= n || r >= n) return; tap(r * n + c); },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) { tick(dt, load); },
      draw: function () {
        var L = glay(n, n, 70, 30), s = L.s, v = viol(), i; bg('#1a2036', '#080a14');
        for (i = 0; i < n * n; i++) {
          var x = L.x0 + (i % n) * s, y = L.y0 + Math.floor(i / n) * s, cx = x + s / 2, cy = y + s / 2;
          g.fillStyle = v[i] ? 'rgba(200,70,60,.45)' : (lock[i] ? 'rgba(255,255,255,.14)' : 'rgba(255,255,255,.07)'); rr(x + 2, y + 2, s - 4, s - 4, 8); g.fill();
          if (cur[i] === 1) {
            g.fillStyle = '#ffd35a'; g.beginPath(); g.arc(cx, cy, s * 0.22, 0, 7); g.fill();
            g.strokeStyle = '#ffd35a'; g.lineWidth = 2.5; for (var k = 0; k < 8; k++) { var a = k * Math.PI / 4; g.beginPath(); g.moveTo(cx + Math.cos(a) * s * 0.29, cy + Math.sin(a) * s * 0.29); g.lineTo(cx + Math.cos(a) * s * 0.38, cy + Math.sin(a) * s * 0.38); g.stroke(); }
          } else if (cur[i] === 2) {
            g.fillStyle = '#cfd8f0'; g.beginPath(); g.arc(cx, cy, s * 0.3, 0, 7); g.fill();
            g.fillStyle = lock[i] ? '#2a3150' : '#1d2338'; g.beginPath(); g.arc(cx + s * 0.13, cy - s * 0.08, s * 0.27, 0, 7); g.fill();
          }
        }
        foot(); hh(); fim(st);
      }
    };

  }
});
