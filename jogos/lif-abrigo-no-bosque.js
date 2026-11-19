/* Líf e Lífþrasir — o abrigo no bosque (invenção). */
BTJogo.registrar({
  canvas: 'jogo-lif',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O abrigo de Líf",
    "sub": "Os números ao lado de cada linha e acima de cada coluna dizem quantas casas seguidas devem ser pintadas e em que ordem. Toque numa casa para pintá-la ou apagá-la. Pinte as casas certas até as dicas de todas as linhas e colunas serem cumpridas. O tempo é limitado. São 3 grades, cada uma maior que a anterior.",
    "perdeu": "O tempo acabou",
    "v1": "Abrigo completo!",
    "v2": "Na Vafþrúðnismál, Líf e Lífþrasir sobrevivem ao inverno do fim do mundo escondidos no bosque Hoddmímis holt, e comem o orvalho da manhã. Pintar casas pelas dicas é invenção.",
    "h1": "Grade",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Líf’s hiding place",
    "sub": "The numbers beside each row and above each column say how many squares in a row must be filled, and in what order. Tap a square to fill or clear it. Fill the right squares until the clues of every row and column are met. Time is limited. There are 3 grids, each larger than the last.",
    "perdeu": "Time ran out",
    "v1": "Hiding place complete!",
    "v2": "In the Vafþrúðnismál, Líf and Lífþrasir survive the winter at the end of the world hidden in the wood Hoddmímis holt, and eat the morning dew. Filling squares by clues is invented.",
    "h1": "Grid",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Lifs skjulested",
    "sub": "Tallene ved siden av hver rad og over hver kolonne sier hvor mange ruter på rad som skal fylles, og i hvilken rekkefølge. Trykk på en rute for å fylle den eller tømme den. Fyll de riktige rutene til hintene for alle rader og kolonner er oppfylt. Tiden er begrenset. Det er 3 rutenett, hvert større enn det forrige.",
    "perdeu": "Tiden tok slutt",
    "v1": "Skjulestedet er ferdig!",
    "v2": "I Vafþrúðnismál overlever Líf og Lífþrasir vinteren ved verdens ende skjult i skogen Hoddmímis holt, og de spiser morgendugg. Å fylle ruter etter hint er oppfunnet.",
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
    var NS = [4, 5, 6], LIM = 300;
    var n = 4, sol = [], cur = [], rc = [], cc = [], cl = 2;
    function runs(a) { var r = [], c = 0, i; for (i = 0; i < a.length; i++) { if (a[i]) c++; else if (c) { r.push(c); c = 0; } } if (c) r.push(c); return r.length ? r : [0]; }
    function rowOf(a, r) { return a.slice(r * n, r * n + n); }
    function colOf(a, c) { var o = [], r; for (r = 0; r < n; r++) o.push(a[r * n + c]); return o; }
    function same(x, y) { return x.join() === y.join(); }
    function load(i) {
      var k, ok;
      n = NS[i];
      for (;;) { sol = []; for (k = 0; k < n * n; k++) sol.push(Math.random() < 0.55 ? 1 : 0); ok = true; for (k = 0; k < n; k++) if (!rowOf(sol, k).some(Boolean) || !colOf(sol, k).some(Boolean)) ok = false; if (ok) break; }
      rc = []; cc = []; for (k = 0; k < n; k++) { rc.push(runs(rowOf(sol, k))); cc.push(runs(colOf(sol, k))); }
      cur = []; for (k = 0; k < n * n; k++) cur.push(0); cl = Math.ceil(n / 2);
    }
    function done() { for (var k = 0; k < n; k++) if (!same(runs(rowOf(cur, k)), rc[k]) || !same(runs(colOf(cur, k)), cc[k])) return false; return true; }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function L() { return glay(n + cl, n + cl, 66, 34); }
    function pos() { var l = L(), a = [], i; for (i = 0; i < n * n; i++) a.push({ x: l.x0 + (cl + i % n + 0.5) * l.s, y: l.y0 + (cl + Math.floor(i / n) + 0.5) * l.s }); return a; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lvl: lvl, pend: pend, sol: sol.slice(), cur: cur.slice(), pos: pos() }; },
      down: function (x, y) {
        if (menu()) return; if (pend > 0 || st !== 'play') return;
        var l = L(), c = Math.floor((x - l.x0) / l.s) - cl, r = Math.floor((y - l.y0) / l.s) - cl;
        if (c < 0 || r < 0 || c >= n || r >= n) return;
        cur[r * n + c] ^= 1; if (api.nota) api.nota(cur[r * n + c] ? 380 : 260, 0.05, 'triangle', 0.04);
        if (done()) lvlUp();
      },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) { tick(dt, load); },
      draw: function () {
        var l = L(), s = l.s, i, j, k; bg('#16241c', '#050a07');
        for (i = 0; i < n * n; i++) {
          var x = l.x0 + (cl + i % n) * s, y = l.y0 + (cl + Math.floor(i / n)) * s;
          g.fillStyle = cur[i] ? '#7fbf7a' : 'rgba(255,255,255,.08)'; rr(x + 2, y + 2, s - 4, s - 4, 6); g.fill();
        }
        for (i = 0; i < n; i++) {
          for (j = 0; j < rc[i].length; j++) { k = rc[i].length - 1 - j; txt(String(rc[i][k]), l.x0 + (cl - 1 - j + 0.5) * s, l.y0 + (cl + i + 0.5) * s + 1, Math.max(11, s * 0.4), '#f3ecd2'); }
          for (j = 0; j < cc[i].length; j++) { k = cc[i].length - 1 - j; txt(String(cc[i][k]), l.x0 + (cl + i + 0.5) * s, l.y0 + (cl - 1 - j + 0.5) * s + 1, Math.max(11, s * 0.4), '#f3ecd2'); }
        }
        foot(); hh(); fim(st);
      }
    };

  }
});
