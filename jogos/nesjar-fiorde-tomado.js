/* Batalha de Nesjar — o fiorde tomado (invenção). */
BTJogo.registrar({
  canvas: 'jogo-nesjar',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O fiorde tomado",
    "sub": "Você começa no canto de cima, à esquerda. Toque numa cor para pintar toda a sua região com ela: as casas vizinhas dessa cor passam a fazer parte da região. Deixe o mapa inteiro de uma só cor com um número limitado de toques. O tempo é limitado. São 3 mapas, cada um maior que o anterior.",
    "perdeu": "Os toques ou o tempo acabaram",
    "v1": "Fiorde tomado!",
    "v2": "Em 25 de março de 1016, Domingo de Ramos, Olav Haraldsson derrotou Sveinn Hákonarson em Nesjar; o local é indicado pela tradição. Pintar o fiorde é invenção.",
    "h1": "Mapa",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The fjord taken",
    "sub": "You start in the top left corner. Tap a colour to paint your whole region with it: neighbouring squares of that colour join the region. Make the whole map a single colour with a limited number of taps. Time is limited. There are 3 maps, each larger than the last.",
    "perdeu": "The taps or the time ran out",
    "v1": "Fjord taken!",
    "v2": "On 25 March 1016, Palm Sunday, Olav Haraldsson defeated Sveinn Hákonarson at Nesjar; the site is given by tradition. Painting the fjord is invented.",
    "h1": "Map",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Fjorden erobret",
    "sub": "Du starter i hjørnet øverst til venstre. Trykk på en farge for å male hele regionen din med den: nabo-rutene i den fargen blir en del av regionen. Gjør hele kartet i én farge med et begrenset antall trykk. Tiden er begrenset. Det er 3 kart, hvert større enn det forrige.",
    "perdeu": "Trykkene eller tiden tok slutt",
    "v1": "Fjorden er erobret!",
    "v2": "25. mars 1016, palmesøndag, beseiret Olav Haraldsson Sveinn Hákonarson ved Nesjar; stedet er angitt av tradisjonen. Å male fjorden er oppfunnet.",
    "h1": "Kart",
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
    var NS = [6, 8, 10], NCL = [4, 5, 6], LIM = 300, COL = ['#d9604a', '#e0b04a', '#58b06a', '#4a8fd8', '#a56ad6', '#58b0b0'];
    var n = 6, nc = 4, a = [], sol = [], moves = 0, lim = 0;
    function reg(b, N) { var r = [], i, q = [0], c = b[0]; for (i = 0; i < N * N; i++) r.push(false); r[0] = true;
      while (q.length) { var p = q.pop(), x = p % N, y = Math.floor(p / N), d = [[1, 0], [-1, 0], [0, 1], [0, -1]]; for (i = 0; i < 4; i++) { var nx = x + d[i][0], ny = y + d[i][1]; if (nx < 0 || ny < 0 || nx >= N || ny >= N) continue; var j = ny * N + nx; if (!r[j] && b[j] === c) { r[j] = true; q.push(j); } } }
      return r; }
    function paint(b, N, c) { var r = reg(b, N), nb = b.slice(), i; for (i = 0; i < N * N; i++) if (r[i]) nb[i] = c; return nb; }
    function size(b, N) { var r = reg(b, N), s = 0; for (var i = 0; i < N * N; i++) if (r[i]) s++; return s; }
    function whole(b) { for (var i = 1; i < b.length; i++) if (b[i] !== b[0]) return false; return true; }
    function greedy(b0, N, K) { var b = b0.slice(), out = []; while (!whole(b) && out.length < 200) { var best = -1, bs = -1, c; for (c = 0; c < K; c++) { if (c === b[0]) continue; var s = size(paint(b, N, c), N); if (s > bs) { bs = s; best = c; } } out.push(best); b = paint(b, N, best); } return out; }
    function load(i) {
      n = NS[i]; nc = NCL[i];
      for (;;) { a = []; for (var k = 0; k < n * n; k++) a.push(Math.floor(Math.random() * nc)); if (!whole(a)) { sol = greedy(a, n, nc); if (sol.length >= 4) break; } }
      moves = 0; lim = sol.length + 2;
    }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function bpos() { var W = api.w, H = api.h, w = Math.min(56, (W - 30) / nc), p = []; for (var i = 0; i < nc; i++) p.push({ x: W / 2 + (i - (nc - 1) / 2) * w, y: H - 58 }); return p; }
    function tap(c) { if (pend > 0 || st !== 'play' || c === a[0]) return; a = paint(a, n, c); moves++; if (api.nota) api.nota(300 + c * 40, 0.05, 'square', 0.03); if (whole(a)) lvlUp(); else if (moves >= lim) st = 'lose'; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lvl: lvl, pend: pend, sol: sol.slice(), moves: moves, lim: lim, pos: bpos() }; },
      down: function (x, y) { if (menu()) return; var bp = bpos(), w = Math.min(56, (api.w - 30) / nc); for (var i = 0; i < nc; i++) if (Math.abs(x - bp[i].x) < w / 2 && Math.abs(y - bp[i].y) < 30) { tap(i); return; } },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) { tick(dt, load); },
      draw: function () {
        var L = glay(n, n, 70, 110), s = L.s, i; bg('#12283a', '#050d16');
        var r = reg(a, n);
        for (i = 0; i < n * n; i++) { var x = L.x0 + (i % n) * s, y = L.y0 + Math.floor(i / n) * s; g.fillStyle = COL[a[i]]; g.fillRect(x, y, s + 0.5, s + 0.5); if (r[i]) { g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(x + s * 0.3, y + s * 0.3, s * 0.4, s * 0.4); } }
        var bp = bpos(), w = Math.min(56, (api.w - 30) / nc);
        for (i = 0; i < nc; i++) { g.fillStyle = COL[i]; g.beginPath(); g.arc(bp[i].x, bp[i].y, w * 0.36, 0, 7); g.fill(); if (i === a[0]) { g.strokeStyle = '#f3ecd2'; g.lineWidth = 3; g.stroke(); } }
        txt(moves + '/' + lim, api.w - 40, 22, 14, moves >= lim - 1 ? '#ff9a8d' : '#c9b3f2');
        foot(); hh(); fim(st);
      }
    };

  }
});
