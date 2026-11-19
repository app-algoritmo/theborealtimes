/* Hiisi e o bosque sagrado — complete o bosque de quatro árvores, sem repetir (invenção). */
BTJogo.registrar({
  canvas: 'jogo-hiisi',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O bosque de Hiisi",
    "sub": "Um bosque sagrado tem 16 clareiras e quatro tipos de árvore, numerados de 1 a 4. Cada linha, cada coluna e cada bloco de quatro clareiras (os quadrados 2 por 2) precisa ter as quatro árvores, sem repetir. Toque numa clareira vazia e depois na árvore que cabe nela. Três plantios errados encerram o jogo. (Teclado: setas movem, teclas 1 a 4 plantam.)",
    "perdeu": "Três plantios errados: o bosque se fechou",
    "v1": "O bosque está completo!",
    "v2": "Em estoniano, hiis é um bosque sagrado, geralmente em terreno elevado; em finlandês, hiisi nomeou primeiro lugares sagrados e só depois seres míticos. No Kalevala, Hiisi faz o alce de Lemminkäinen com madeira podre, salgueiro e juncos. O bosque numerado é invenção.",
    "h1": "Árvores",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Hiisi's grove",
    "sub": "A sacred grove has 16 clearings and four kinds of tree, numbered 1 to 4. Every row, every column and every block of four clearings (the 2-by-2 squares) must have all four trees, without repeating. Tap an empty clearing and then the tree that fits it. Three wrong plantings end the game. (Keyboard: arrows move, keys 1 to 4 plant.)",
    "perdeu": "Three wrong plantings: the grove closed in",
    "v1": "The grove is complete!",
    "v2": "In Estonian, hiis is a sacred grove, usually on elevated ground; in Finnish, hiisi first named sacred places and only later mythical beings. In the Kalevala, Hiisi makes Lemminkäinen's elk from rotten wood, willow and reeds. The numbered grove is invented.",
    "h1": "Trees",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Hiisis lund",
    "sub": "En hellig lund har 16 glenner og fire slags trær, nummerert fra 1 til 4. Hver rad, hver kolonne og hver blokk med fire glenner (kvadratene på 2 ganger 2) må ha alle fire trærne, uten å gjenta dem. Trykk på en tom glenne og deretter på treet som passer der. Tre gale plantinger avslutter spillet. (Tastatur: piltaster flytter, tast 1 til 4 planter.)",
    "perdeu": "Tre gale plantinger: lunden lukket seg",
    "v1": "Lunden er ferdig!",
    "v2": "På estisk er hiis en hellig lund, vanligvis på høyt terreng; på finsk navnga hiisi først hellige steder og først senere mytiske vesener. I Kalevala lager Hiisi Lemminkäinens elg av råtten ved, pil og siv. Den nummererte lunden er oppfunnet.",
    "h1": "Trær",
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
    var MAXE = 3;
    var COL = ['#4fa86b', '#d8b04a', '#4c8fd6', '#c75a50'];
    var sol = [], given = [], vals = [], sel = -1, err = 0, flash = -1, ft = 0;
    function cnt(v, stop) {
      var i, c, ok, k, r, cc, n = 0;
      for (i = 0; i < 16; i++) if (v[i] < 0) break;
      if (i === 16) return 1;
      for (c = 0; c < 4 && n < stop; c++) {
        ok = true; r = (i / 4) | 0; cc = i % 4;
        for (k = 0; k < 4; k++) { if (v[r * 4 + k] === c || v[k * 4 + cc] === c) ok = false; }
        var br = r - r % 2, bc = cc - cc % 2;
        for (k = 0; k < 4; k++) if (v[(br + (k >> 1)) * 4 + bc + (k & 1)] === c) ok = false;
        if (ok) { v[i] = c; n += cnt(v, stop - n); v[i] = -1; }
      }
      return n;
    }
    function reset() {
      var base = [[0, 1, 2, 3], [2, 3, 0, 1], [1, 2, 3, 0], [3, 0, 1, 2]], perm = [0, 1, 2, 3], i, j, x;
      for (i = 3; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); x = perm[i]; perm[i] = perm[j]; perm[j] = x; }
      var rows = [0, 1, 2, 3], cols = [0, 1, 2, 3];
      if (Math.random() < 0.5) rows = [1, 0, 2, 3]; if (Math.random() < 0.5) rows = [rows[2], rows[3], rows[0], rows[1]];
      if (Math.random() < 0.5) cols = [1, 0, 2, 3]; if (Math.random() < 0.5) cols = [cols[2], cols[3], cols[0], cols[1]];
      sol = []; for (i = 0; i < 4; i++) for (j = 0; j < 4; j++) sol.push(perm[base[rows[i]][cols[j]]]);
      var o = []; for (i = 0; i < 16; i++) o.push(i);
      for (i = 15; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); x = o[i]; o[i] = o[j]; o[j] = x; }
      var v = sol.slice(); given = []; for (i = 0; i < 16; i++) given.push(true);
      for (i = 0; i < 16; i++) { var c = v[o[i]]; v[o[i]] = -1; if (cnt(v.slice(), 2) !== 1) v[o[i]] = c; else given[o[i]] = false; }
      vals = v; sel = -1; err = 0; flash = -1; ft = 0; st = 'play';
    }
    function filled() { var n = 0; for (var i = 0; i < 16; i++) if (vals[i] >= 0) n++; return n; }
    function plant(d) {
      if (st !== 'play' || sel < 0 || vals[sel] >= 0) return;
      if (d === sol[sel]) { vals[sel] = d; if (api.nota) api.nota(300 + d * 60, 0.12, 'triangle', 0.06); sel = -1; if (filled() === 16) st = 'win'; }
      else { err++; flash = sel; ft = 0.5; if (api.nota) api.nota(120, 0.2, 'sawtooth', 0.05); if (err >= MAXE) st = 'lose'; }
    }
    function lay() { var W = api.w, H = api.h, s = Math.min(W - 30, H - 220, 360), c = s / 4, ps = Math.min(52, (W - 30) / 5); return { s: s, c: c, x0: (W - s) / 2, y0: 72, ps: ps, py: 72 + s + 20 + ps / 2 }; }
    function cp() { var L = lay(), o = [], i; for (i = 0; i < 16; i++) o.push({ x: L.x0 + (i % 4) * L.c + L.c / 2, y: L.y0 + ((i / 4) | 0) * L.c + L.c / 2 }); return o; }
    function pp() { var L = lay(), o = [], gp = 8, x0 = (api.w - (L.ps * 4 + gp * 3)) / 2, i; for (i = 0; i < 4; i++) o.push({ x: x0 + i * (L.ps + gp) + L.ps / 2, y: L.py }); return o; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, sol: sol.slice(), vals: vals.slice(), given: given.slice(), sel: sel, err: err, maxe: MAXE, pos: cp(), pal: pp(), filled: filled() }; },
      down: function (x, y) {
        if (menu()) return; var L = lay(), p = cp(), q = pp(), i;
        for (i = 0; i < 4; i++) if (Math.abs(x - q[i].x) < L.ps / 2 + 3 && Math.abs(y - q[i].y) < L.ps / 2 + 3) { plant(i); return; }
        for (i = 0; i < 16; i++) if (Math.abs(x - p[i].x) < L.c / 2 && Math.abs(y - p[i].y) < L.c / 2) { if (vals[i] < 0) sel = i; return; }
      },
      move: function () {}, up: function () {},
      key: function (k, d) {
        if (!d) return; if (st !== 'play') { menu(); return; }
        var m = { Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3, Numpad1: 0, Numpad2: 1, Numpad3: 2, Numpad4: 3 }[k]; if (m !== undefined) { plant(m); return; }
        var dx = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: 0, ArrowDown: 0 }[k], dy = { ArrowUp: -1, ArrowDown: 1, ArrowLeft: 0, ArrowRight: 0 }[k];
        if (dx === undefined) return; var c = sel < 0 ? 0 : sel % 4, r = sel < 0 ? 0 : (sel / 4) | 0; c = (c + dx + 4) % 4; r = (r + dy + 4) % 4; sel = r * 4 + c;
      },
      update: function (dt) { if (ft > 0) ft -= dt; },
      draw: function () {
        var L = lay(), p = cp(), q = pp(), i; bg('#1a2416', '#080c06');
        for (i = 0; i < 16; i++) {
          var x = p[i].x - L.c / 2, y = p[i].y - L.c / 2;
          g.fillStyle = (((i / 4) | 0) >> 1) + ((i % 4) >> 1) & 1 ? 'rgba(255,255,255,.07)' : 'rgba(255,255,255,.14)'; g.fillRect(x, y, L.c, L.c);
          if (i === sel) { g.fillStyle = 'rgba(255,216,138,.28)'; g.fillRect(x, y, L.c, L.c); }
          if (flash === i && ft > 0) { g.fillStyle = 'rgba(220,60,50,.5)'; g.fillRect(x, y, L.c, L.c); }
          if (vals[i] >= 0) { g.beginPath(); g.arc(p[i].x, p[i].y, L.c * 0.32, 0, 6.2832); g.fillStyle = COL[vals[i]]; g.fill(); if (given[i]) { g.strokeStyle = '#f3ecd2'; g.lineWidth = 2.5; g.stroke(); } txt(String(vals[i] + 1), p[i].x, p[i].y + 7, 20, 'rgba(0,0,0,.6)'); }
        }
        g.strokeStyle = 'rgba(255,255,255,.4)'; g.lineWidth = 1; for (i = 0; i <= 4; i++) { g.beginPath(); g.moveTo(L.x0 + i * L.c, L.y0); g.lineTo(L.x0 + i * L.c, L.y0 + L.s); g.stroke(); g.beginPath(); g.moveTo(L.x0, L.y0 + i * L.c); g.lineTo(L.x0 + L.s, L.y0 + i * L.c); g.stroke(); }
        g.strokeStyle = '#ffd88a'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(L.x0 + 2 * L.c, L.y0); g.lineTo(L.x0 + 2 * L.c, L.y0 + L.s); g.moveTo(L.x0, L.y0 + 2 * L.c); g.lineTo(L.x0 + L.s, L.y0 + 2 * L.c); g.stroke(); g.strokeRect(L.x0, L.y0, L.s, L.s);
        for (i = 0; i < 4; i++) { g.fillStyle = COL[i]; g.beginPath(); g.arc(q[i].x, q[i].y, L.ps / 2, 0, 6.2832); g.fill(); g.strokeStyle = 'rgba(255,255,255,.4)'; g.lineWidth = 1.5; g.stroke(); txt(String(i + 1), q[i].x, q[i].y + 6, 17, 'rgba(0,0,0,.6)'); }
        hud(T.h1 + ' ' + filled() + '/16', T.h2 + ' ' + err + '/' + MAXE, true);
        fim(st);
      }
    };

  }
});
