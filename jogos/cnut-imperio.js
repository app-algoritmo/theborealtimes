/* As ondas de Cnut — espalhe sua cor até cobrir todo o tabuleiro. */
BTJogo.registrar({
  canvas: 'jogo-cnut',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As ondas de Cnut",
    "sub": "Comece pelo canto de cima, à esquerda. A cada jogada, escolha uma cor: seu território vira essa cor e engole as casas vizinhas da mesma cor. Cubra o tabuleiro todo antes de acabarem as jogadas. Jogada que não engole nada é em vão.",
    "perdeu": "Acabaram as jogadas",
    "v1": "Todo o reino é seu!",
    "v2": "Cnut governou a Inglaterra, a Dinamarca e a Noruega. A lenda da maré é conhecida, mas o quebra-cabeça é invenção do jogo.",
    "h1": "Reino",
    "h2": "Em vão",
    "rest": "jogadas restantes"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Cnut's waves",
    "sub": "Start at the top-left corner. Each turn pick a colour: your territory turns that colour and swallows neighbouring squares of the same colour. Cover the whole board before the moves run out. A move that swallows nothing is wasted.",
    "perdeu": "The moves ran out",
    "v1": "The whole realm is yours!",
    "v2": "Cnut ruled England, Denmark and Norway. The tide legend is well known, but the puzzle is made up for the game.",
    "h1": "Realm",
    "h2": "Wasted",
    "rest": "moves left"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Knuts bølger",
    "sub": "Start i øvre venstre hjørne. For hver runde velger du en farge: Territoriet ditt får den fargen og sluker nabofeltene med samme farge. Dekk hele brettet før trekkene er brukt opp. Et trekk som ikke sluker noe, er bortkastet.",
    "perdeu": "Trekkene tok slutt",
    "v1": "Hele riket er ditt!",
    "v2": "Knut styrte England, Danmark og Norge. Legenden om tidevannet er kjent, men puslespillet er diktet opp for spillet.",
    "h1": "Rike",
    "h2": "Bortkastet",
    "rest": "trekk igjen"
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
    var N = 7, K = 5, LIM = 120, COL = ['#d94a3a', '#e8c23a', '#4aa86a', '#3a8ad9', '#9a5ad9'];
    var grid = [], mv = 0, lim = 0, errs = 0, tmr = LIM, cur = 0, ripple = 0;
    function lay() {
      var W = api.w, H = api.h, land = W >= H * 1.1, S = land ? Math.min(W * 0.52, H * 0.78, 400) : Math.min(W - 40, H * 0.58, 400);
      var gx = land ? W * 0.08 + (W * 0.52 - S) / 2 + 10 : (W - S) / 2, gy = land ? Math.max(66, (H - S) / 2 + 14) : 70, b = [], r = Math.min(land ? 30 : 34, S / 8), i;
      for (i = 0; i < K; i++) { if (land) b.push({ x: W * 0.8, y: H * 0.24 + i * (H * 0.6 / (K - 1)), r: r }); else b.push({ x: W / 2 + (i - (K - 1) / 2) * (r * 2 + 8), y: gy + S + 52, r: r }); }
      return { S: S, c: S / N, x: gx, y: gy, b: b };
    }
    function region(gr, col) {
      var seen = {}, q = [0], k = 0; seen[0] = 1;
      while (k < q.length) { var i = q[k++], r = Math.floor(i / N), c = i % N, nb = []; if (r > 0) nb.push(i - N); if (r < N - 1) nb.push(i + N); if (c > 0) nb.push(i - 1); if (c < N - 1) nb.push(i + 1); for (var j = 0; j < nb.length; j++) if (!seen[nb[j]] && gr[nb[j]] === col) { seen[nb[j]] = 1; q.push(nb[j]); } }
      return q;
    }
    function play(gr, col) { var rg = region(gr, gr[0]); for (var i = 0; i < rg.length; i++) gr[rg[i]] = col; return region(gr, col).length; }
    function greedy(gr) {
      var n = 0; gr = gr.slice();
      while (region(gr, gr[0]).length < N * N && n < 60) { var best = -1, bs = -1; for (var c = 0; c < K; c++) { if (c === gr[0]) continue; var t = gr.slice(), s = play(t, c); if (s > bs) { bs = s; best = c; } } play(gr, best); n++; }
      return n;
    }
    function setup() { do { grid = []; for (var i = 0; i < N * N; i++) grid.push(Math.floor(Math.random() * K)); } while (region(grid, grid[0]).length > 4); lim = greedy(grid) + 3; mv = 0; errs = 0; tmr = LIM; cur = 0; }
    function reset() { setup(); st = 'play'; }
    function pick(c) {
      if (st !== 'play' || c < 0 || c >= K || c === grid[0]) return; var b = region(grid, grid[0]).length, a = play(grid, c); mv++; ripple = 0.4; if (a <= b) errs++;
      if (a === N * N) st = 'win'; else if (mv >= lim) st = 'lose';
    }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, grid: grid.slice(), mv: mv, lim: lim, errs: errs, tmr: tmr, b: L.b, size: region(grid, grid[0]).length }; },
      down: function (x, y) { if (menu()) return; var L = lay(); for (var i = 0; i < K; i++) if (Math.hypot(x - L.b[i].x, y - L.b[i].y) < L.b[i].r + 6) { cur = i; pick(i); return; } },
      key: function (c, d) {
        if (!d) return; var m = /^(Digit|Numpad)([1-5])$/.exec(c); if (m) { pick(+m[2] - 1); return; }
        if (c === 'ArrowLeft' || c === 'ArrowUp' || c === 'KeyA' || c === 'KeyW') cur = (cur + K - 1) % K; else if (c === 'ArrowRight' || c === 'ArrowDown' || c === 'KeyD' || c === 'KeyS') cur = (cur + 1) % K; else if (c === 'Space' || c === 'Enter') { if (st !== 'play') menu(); else pick(cur); }
      },
      update: function (dt) { if (ripple > 0) ripple -= dt; if (st !== 'play') return; tmr -= dt; if (tmr <= 0) st = 'lose'; },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), i, t = api.clock;
        bg('#0e2a3a', '#06141d');
        g.fillStyle = 'rgba(255,255,255,.07)'; rr(L.x - 8, L.y - 8, L.S + 16, L.S + 16, 10); g.fill();
        for (i = 0; i < N * N; i++) { var x = L.x + (i % N) * L.c, y = L.y + Math.floor(i / N) * L.c; g.fillStyle = COL[grid[i]]; g.fillRect(x + 1, y + 1, L.c - 2, L.c - 2); }
        var rg = region(grid, grid[0]); g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = 2; for (i = 0; i < rg.length; i++) { var x2 = L.x + (rg[i] % N) * L.c, y2 = L.y + Math.floor(rg[i] / N) * L.c; g.strokeRect(x2 + 3, y2 + 3, L.c - 6, L.c - 6); }
        g.fillStyle = '#fff'; g.fillRect(L.x + L.c / 2 - 4, L.y + L.c / 2 - 4, 8, 8);
        for (i = 0; i < K; i++) { var b = L.b[i], on = i === grid[0]; g.fillStyle = COL[i]; g.globalAlpha = on ? 0.35 : 1; g.beginPath(); g.arc(b.x, b.y, b.r, 0, 6.29); g.fill(); g.globalAlpha = 1; g.strokeStyle = i === cur && st === 'play' ? '#fff' : 'rgba(255,255,255,.4)'; g.lineWidth = i === cur ? 4 : 2; g.stroke(); txt(String(i + 1), b.x, b.y + 7, 20, '#fff'); }
        var left = Math.max(0, lim - mv), land = W >= H * 1.1; txt(left + ' ' + T.rest, land ? L.b[0].x : W / 2, land ? H * 0.135 : L.y + L.S + 106, 16, left <= 2 ? '#ff9a8d' : '#f3ecd2');
        bar(W / 2 - 110, H - 16, 220, 5, tmr / LIM, tmr < 20 ? '#c0392b' : '#3a8ad9');
        hud(T.h1 + ' ' + rg.length + '/' + (N * N), T.h2 + ' ' + errs, false);
        fim(st);
      }
    };
  }
});
