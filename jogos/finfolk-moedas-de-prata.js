/* Finfolk — as moedas de prata (invenção). */
BTJogo.registrar({
  canvas: 'jogo-finfolk',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As moedas dos Finfolk",
    "sub": "Uma pilha de moedas de prata de tamanhos diferentes está fora de ordem. Toque numa moeda para virar de cabeça para baixo todas as moedas do topo da pilha até ela. Deixe a pilha em ordem, com a menor no topo e a maior embaixo. O número de viradas e o tempo são limitados. São 3 pilhas, cada uma maior que a anterior.",
    "perdeu": "As viradas ou o tempo acabaram",
    "v1": "Pilha em ordem!",
    "v2": "No folclore de Orkney, os Finfolk são feiticeiros do mar que raptam pessoas; uma moeda de prata é dita um modo de escapar deles. Virar pilhas de moedas é invenção.",
    "h1": "Pilha",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The Finfolk’s coins",
    "sub": "A stack of silver coins of different sizes is out of order. Tap a coin to flip upside down every coin from the top of the stack down to it. Put the stack in order, with the smallest on top and the largest at the bottom. The number of flips and the time are limited. There are 3 stacks, each taller than the last.",
    "perdeu": "The flips or the time ran out",
    "v1": "Stack in order!",
    "v2": "In Orkney folklore, the Finfolk are sea sorcerers who abduct people; a silver coin is said to be a way to escape them. Flipping stacks of coins is invented.",
    "h1": "Stack",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Finfolkenes mynter",
    "sub": "En stabel med sølvmynter i ulik størrelse ligger i feil rekkefølge. Trykk på en mynt for å snu alle myntene fra toppen av stabelen og ned til den. Sett stabelen i orden, med den minste øverst og den største nederst. Antall snuinger og tiden er begrenset. Det er 3 stabler, hver høyere enn den forrige.",
    "perdeu": "Snuingene eller tiden tok slutt",
    "v1": "Stabelen er i orden!",
    "v2": "I folketroen på Orknøyene er Finfolk trollmenn fra havet som bortfører folk; en sølvmynt sies å være en måte å slippe unna dem på. Å snu myntstabler er oppfunnet.",
    "h1": "Stabel",
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
    var NS = [5, 6, 7], SC = [4, 5, 6], LIM = 300;
    var n = 5, a = [], sol = [], moves = 0, lim = 0;
    function flip(b, i) { var c = b.slice(), k; for (k = 0; k <= i; k++) c[k] = b[i - k]; return c; }
    function solved(b) { for (var i = 0; i < b.length; i++) if (b[i] !== i + 1) return false; return true; }
    function load(i) {
      n = NS[i];
      for (;;) { var b = [], k, mv = [], last = -1, m; for (k = 1; k <= n; k++) b.push(k);
        for (k = 0; k < SC[i]; k++) { do { m = 1 + Math.floor(Math.random() * (n - 1)); } while (m === last); mv.push(m); b = flip(b, m); last = m; }
        if (!solved(b)) { a = b; sol = mv.slice().reverse(); break; } }
      moves = 0; lim = SC[i] + 2;
    }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function lay() { var H = api.h, W = api.w, top = 70, h = Math.min(46, (H - top - 40) / n); return { h: h, top: top + (H - top - 40 - h * n) / 2, mw: Math.min(W - 40, 300) }; }
    function pos() { var L = lay(), p = []; for (var i = 0; i < n; i++) p.push({ x: api.w / 2, y: L.top + (i + 0.5) * L.h }); return p; }
    function tap(i) { if (pend > 0 || st !== 'play') return; a = flip(a, i); moves++; if (api.nota) api.nota(300, 0.05, 'triangle', 0.04); if (solved(a)) lvlUp(); else if (moves >= lim) st = 'lose'; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lvl: lvl, pend: pend, sol: sol.slice(), moves: moves, lim: lim, pos: pos() }; },
      down: function (x, y) { if (menu()) return; var L = lay(), r = Math.floor((y - L.top) / L.h); if (r < 0 || r >= n || Math.abs(x - api.w / 2) > L.mw / 2) return; tap(r); },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) { tick(dt, load); },
      draw: function () {
        var L = lay(), i; bg('#1a2a3a', '#060c14');
        for (i = 0; i < n; i++) {
          var w = 60 + a[i] * (L.mw - 60) / n, y = L.top + i * L.h;
          var gr = g.createLinearGradient(api.w / 2 - w / 2, 0, api.w / 2 + w / 2, 0); gr.addColorStop(0, '#9aa4b0'); gr.addColorStop(0.5, '#e4e9f0'); gr.addColorStop(1, '#8a94a0');
          g.fillStyle = gr; rr(api.w / 2 - w / 2, y + 2, w, L.h - 4, L.h * 0.35); g.fill();
          txt(String(a[i]), api.w / 2, y + L.h / 2 + 1, Math.max(11, L.h * 0.4), '#2a3440');
        }
        txt(moves + '/' + lim, api.w - 40, 22, 14, moves >= lim - 1 ? '#ff9a8d' : '#c9b3f2');
        foot(); hh(); fim(st);
      }
    };

  }
});
