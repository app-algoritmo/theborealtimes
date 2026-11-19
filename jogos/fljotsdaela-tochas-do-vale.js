/* Fljótsdœla saga — as tochas do vale (invenção). */
BTJogo.registrar({
  canvas: 'jogo-fljotsdaela',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As tochas do vale",
    "sub": "Algumas tochas estão acesas. Ao tocar numa tocha, ela e as quatro vizinhas, de cima, de baixo, da esquerda e da direita, trocam de estado: as acesas apagam e as apagadas acendem. Apague todas as tochas. O número de toques e o tempo são limitados. São 3 quadros, de 3 por 3, 4 por 4 e 5 por 5.",
    "perdeu": "Os toques ou o tempo acabaram",
    "v1": "Todas apagadas!",
    "v2": "A Fljótsdœla saga conta de novo a história dos irmãos Droplaugarsons, com detalhes que diferem da outra saga; foi provavelmente escrita bem mais tarde, talvez nos séculos XVI ou XVII. Apagar tochas é invenção.",
    "h1": "Quadro",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The torches of the valley",
    "sub": "Some torches are lit. Tapping a torch makes it and its four neighbours, above, below, left and right, change state: lit ones go out and unlit ones light up. Put out every torch. The number of taps and the time are limited. There are 3 boards: 3 by 3, 4 by 4 and 5 by 5.",
    "perdeu": "The taps or the time ran out",
    "v1": "All out!",
    "v2": "Fljótsdœla saga retells the story of the Droplaugarsons brothers, with details that differ from the other saga; it was probably written much later, perhaps in the 16th or 17th century. Putting out torches is invented.",
    "h1": "Board",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Fakkelene i dalen",
    "sub": "Noen fakler brenner. Når du trykker på en fakkel, bytter den og de fire naboene, over, under, til venstre og til høyre, tilstand: de som brenner, slukner, og de slukkede tennes. Slukk alle fakler. Antall trykk og tiden er begrenset. Det er 3 brett: 3 ganger 3, 4 ganger 4 og 5 ganger 5.",
    "perdeu": "Trykkene eller tiden tok slutt",
    "v1": "Alle slukket!",
    "v2": "Fljótsdœla saga forteller på nytt historien om Droplaugarsønnene, med detaljer som avviker fra den andre sagaen; den ble trolig skrevet mye senere, kanskje på 1500- eller 1600-tallet. Å slukke fakler er oppfunnet.",
    "h1": "Brett",
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
    var NS = [3, 4, 5], PR = [3, 5, 7], NL = 3, LIM = 300;
    var lvl = 0, n = 0, a = [], sol = [], lim = 0, moves = 0, t = 0, pend = 0;
    function flip(k) { var x = k % n, y = (k / n) | 0; a[k] ^= 1; if (x > 0) a[k - 1] ^= 1; if (x < n - 1) a[k + 1] ^= 1; if (y > 0) a[k - n] ^= 1; if (y < n - 1) a[k + n] ^= 1; }
    function off() { for (var i = 0; i < n * n; i++) if (a[i]) return false; return true; }
    function load(i) {
      n = NS[i];
      for (;;) {
        a = []; var k; for (k = 0; k < n * n; k++) a[k] = 0;
        var all = []; for (k = 0; k < n * n; k++) all.push(k); all.sort(function () { return Math.random() - 0.5; }); sol = all.slice(0, PR[i]);
        sol.forEach(flip); if (!off()) break;
      }
      lim = PR[i] + 6; moves = 0;
    }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function lay() { var W = api.w, H = api.h, s = Math.min((W - 30) / 5, (H - 170) / 5, 80); return { s: s, x0: (W - n * s) / 2, y0: 76 }; }
    function cpos(k) { var L = lay(); return { x: L.x0 + (k % n) * L.s + L.s / 2, y: L.y0 + ((k / n) | 0) * L.s + L.s / 2 }; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { var p = [], k; for (k = 0; k < n * n; k++) p.push(cpos(k)); return { st: st, lvl: lvl, a: a.slice(), sol: sol.slice(), moves: moves, lim: lim, pos: p, pend: pend }; },
      down: function (x, y) {
        if (menu()) return; if (pend > 0) return; var L = lay(), cx = Math.floor((x - L.x0) / L.s), cy = Math.floor((y - L.y0) / L.s);
        if (cx < 0 || cy < 0 || cx >= n || cy >= n) return; flip(cy * n + cx); moves++; if (api.nota) api.nota(280, 0.05, 'square', 0.03);
        if (off()) { lvl++; pend = 0.9; if (api.nota) api.nota(520, 0.2, 'triangle', 0.07); } else if (moves >= lim) st = 'lose';
      },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) {
        if (st !== 'play') return; t += dt;
        if (pend > 0) { pend -= dt; if (pend <= 0) { if (lvl >= NL) st = 'win'; else load(lvl); } }
        if (st === 'play' && t >= LIM) st = 'lose';
      },
      draw: function () {
        var L = lay(), k; bg('#2a2420', '#0c0907');
        for (k = 0; k < n * n; k++) {
          var x = L.x0 + (k % n) * L.s, y = L.y0 + ((k / n) | 0) * L.s;
          g.fillStyle = a[k] ? '#d98a3a' : '#3a342e'; rr(x + 3, y + 3, L.s - 6, L.s - 6, 10); g.fill();
          if (a[k]) { g.fillStyle = 'rgba(255,230,160,.9)'; g.beginPath(); g.arc(x + L.s / 2, y + L.s / 2, L.s * 0.18, 0, 6.2832); g.fill(); }
        }
        txt(moves + '/' + lim, api.w / 2, L.y0 + n * L.s + 28, 18, moves >= lim - 2 ? '#ff9a8d' : '#f3ecd2');
        bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 60 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + Math.min(lvl + 1, NL) + '/' + NL, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };

  }
});
