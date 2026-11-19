/* Angrboða e Járnviðr — pinte a mancha até a floresta inteira ter uma só cor (invenção). */
BTJogo.registrar({
  canvas: 'jogo-angrboda',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A Floresta de Ferro",
    "sub": "Em Járnviðr, a mata se espalha a partir de um canto. Toque numa cor da paleta para pintar toda a mancha ligada ao canto superior esquerdo; ela engole as casas vizinhas que já tinham essa cor. Deixe o terreno inteiro de uma só cor em até 16 lances. (Teclado: teclas 1 a 5.)",
    "perdeu": "Os lances ou o tempo acabaram antes de a floresta ter uma só cor",
    "v1": "A floresta é uma só!",
    "v2": "Na Völuspá, uma velha em Járnviðr, a Floresta de Ferro, cria a prole de Fenrir; os estudiosos a identificam, como mais provável, com Angrboða, mãe de Fenrir, Jörmungandr e Hel na Gylfaginning. A mancha que se espalha é invenção.",
    "h1": "Lances",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The Iron Wood",
    "sub": "In Járnviðr, the forest spreads from one corner. Tap a colour in the palette to paint the whole patch connected to the top-left corner; it swallows the neighbouring squares that already had that colour. Leave the whole ground one colour in up to 16 moves. (Keyboard: keys 1 to 5.)",
    "perdeu": "The moves or the time ran out before the forest was one colour",
    "v1": "The forest is one!",
    "v2": "In the Völuspá, an old woman in Járnviðr, the Iron Wood, raises the kin of Fenrir; scholars most likely identify her with Angrboða, mother of Fenrir, Jörmungandr and Hel in the Gylfaginning. The spreading patch is invented.",
    "h1": "Moves",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Jernskogen",
    "sub": "I Járnviðr sprer skogen seg fra ett hjørne. Trykk på en farge i paletten for å male hele flekken som henger sammen med øvre venstre hjørne; den sluker naborutene som allerede hadde den fargen. La hele terrenget få én farge på opptil 16 trekk. (Tastatur: tast 1 til 5.)",
    "perdeu": "Trekkene eller tiden tok slutt før skogen hadde én farge",
    "v1": "Skogen er én!",
    "v2": "I Völuspá oppdrar en gammel kvinne i Járnviðr, Jernskogen, Fenrirs ætt; forskerne identifiserer henne mest sannsynlig med Angrboða, mor til Fenrir, Midgardsormen og Hel i Gylfaginning. Flekken som sprer seg er oppfunnet.",
    "h1": "Trekk",
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
    var N = 9, K = 5, MAXM = 16, LIM = 240;
    var COL = ['#2e7d4f', '#d8b04a', '#4c8fd6', '#b0504a', '#9b6bd1'];
    var grid = [], moves = 0, t = 0, cur = 0;
    function flood(gr, c) {
      var old = gr[0]; if (old === c) return false;
      var q = [0], seen = {}, n, x, y, nb, i; seen[0] = 1;
      while (q.length) { n = q.pop(); gr[n] = c; x = n % N; y = (n - x) / N; nb = []; if (x > 0) nb.push(n - 1); if (x < N - 1) nb.push(n + 1); if (y > 0) nb.push(n - N); if (y < N - 1) nb.push(n + N); for (i = 0; i < nb.length; i++) if (!seen[nb[i]] && gr[nb[i]] === old) { seen[nb[i]] = 1; q.push(nb[i]); } }
      return true;
    }
    function done() { for (var i = 1; i < N * N; i++) if (grid[i] !== grid[0]) return false; return true; }
    function reset() { grid = []; for (var i = 0; i < N * N; i++) grid.push(Math.floor(Math.random() * K)); moves = 0; t = 0; st = 'play'; }
    function pick(c) {
      if (st !== 'play') return; if (!flood(grid, c)) return; moves++; cur = c;
      if (api.nota) api.nota(240 + c * 50, 0.1, 'triangle', 0.05);
      if (done()) st = 'win'; else if (moves >= MAXM) st = 'lose';
    }
    function lay() { var W = api.w, H = api.h, s = Math.min(W - 24, H - 215, 420), c = s / N, ps = Math.min(46, (W - 30) / (K + 1)); return { s: s, c: c, x0: (W - s) / 2, y0: 70, ps: ps, py: 70 + s + 18 + ps / 2 }; }
    function cpos() { var L = lay(), o = [], i; for (i = 0; i < K; i++) { var gp = 8, x0 = (api.w - (L.ps * K + gp * (K - 1))) / 2; o.push({ x: x0 + i * (L.ps + gp) + L.ps / 2, y: L.py }); } return o; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, grid: grid.slice(), N: N, K: K, moves: moves, maxm: MAXM, pos: cpos(), t: t }; },
      down: function (x, y) { if (menu()) return; var p = cpos(), L = lay(), i; for (i = 0; i < K; i++) if (Math.abs(x - p[i].x) < L.ps / 2 + 3 && Math.abs(y - p[i].y) < L.ps / 2 + 3) { pick(i); return; } },
      move: function () {}, up: function () {},
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } var m = { Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3, Digit5: 4, Numpad1: 0, Numpad2: 1, Numpad3: 2, Numpad4: 3, Numpad5: 4 }[k]; if (m !== undefined) pick(m); },
      update: function (dt) { if (st !== 'play') return; t += dt; if (t >= LIM) st = 'lose'; },
      draw: function () {
        var L = lay(), i, p = cpos(); bg('#10201a', '#060d0a');
        for (i = 0; i < N * N; i++) { var x = i % N, y = (i - x) / N; g.fillStyle = COL[grid[i]]; g.fillRect(L.x0 + x * L.c, L.y0 + y * L.c, L.c - 1, L.c - 1); }
        g.strokeStyle = '#ffd88a'; g.lineWidth = 2; g.strokeRect(L.x0 + 1, L.y0 + 1, L.c - 3, L.c - 3);
        for (i = 0; i < K; i++) { g.fillStyle = COL[i]; g.beginPath(); g.arc(p[i].x, p[i].y, L.ps / 2, 0, 6.2832); g.fill(); g.strokeStyle = i === grid[0] ? '#fff' : 'rgba(255,255,255,.35)'; g.lineWidth = i === grid[0] ? 3 : 1.5; g.stroke(); txt(String(i + 1), p[i].x, p[i].y + 6, 16, 'rgba(0,0,0,.55)'); }
        bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 40 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + moves + '/' + MAXM, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };

  }
});
