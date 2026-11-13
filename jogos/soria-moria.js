/* Rumo a Soria Moria — atravesse o labirinto da floresta até o castelo. */
BTJogo.registrar({
  canvas: 'jogo-soria',
  t: {
    pt: {
      titulo: 'Rumo a Soria Moria',
      sub: 'Halvor atravessa três florestas até avistar o castelo dourado. Toque na direção em que quer andar (ou use as setas) e chegue ao castelo antes que o tempo acabe. As florestas ficam maiores a cada vez.',
      toque: 'Toque para começar', floresta: 'Floresta', tempo: 'Tempo',
      perdeu: 'A noite caiu na floresta', de_novo: 'Toque para tentar de novo',
      v1: 'Soria Moria!',
      v2: 'No conto de Asbjørnsen e Moe, Halvor chega ao castelo dourado depois de uma longa viagem. Os labirintos do jogo são sorteados e inventados.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: 'To Soria Moria',
      sub: 'Halvor crosses three forests until he sights the golden castle. Tap in the direction you want to walk (or use the arrow keys) and reach the castle before time runs out. The forests grow larger each time.',
      toque: 'Tap to start', floresta: 'Forest', tempo: 'Time',
      perdeu: 'Night fell on the forest', de_novo: 'Tap to try again',
      v1: 'Soria Moria!',
      v2: "In Asbjørnsen and Moe's tale, Halvor reaches the golden castle after a long journey. The game's mazes are random and made up.",
      jogar: 'Tap to play again'
    },
    no: {
      titulo: 'Mot Soria Moria',
      sub: 'Halvor krysser tre skoger til han ser det gylne slottet. Trykk i retningen du vil gå (eller bruk piltastene) og nå slottet før tiden går ut. Skogene blir større hver gang.',
      toque: 'Trykk for å starte', floresta: 'Skog', tempo: 'Tid',
      perdeu: 'Natten falt på i skogen', de_novo: 'Trykk for å prøve igjen',
      v1: 'Soria Moria!',
      v2: 'I eventyret til Asbjørnsen og Moe kommer Halvor til det gylne slottet etter en lang reise. Labyrintene i spillet er tilfeldige og diktet opp.',
      jogar: 'Trykk for å spille igjen'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt;
    var SZ = [5, 7, 9], TL = [30, 45, 70];
    var st = 'menu', lv = 0, n = 5, cells = [], px = 0, py = 0, time = 0, flash = 0, seen = [];
    var DX = [0, 1, 0, -1], DY = [-1, 0, 1, 0]; /* 0 N,1 E,2 S,3 W */
    function build() {
      n = SZ[lv - 1]; time = TL[lv - 1]; cells = []; seen = [];
      for (var i = 0; i < n * n; i++) cells.push([1, 1, 1, 1]);
      var stack = [[0, 0]], vis = {}; vis['0,0'] = 1;
      while (stack.length) {
        var c = stack[stack.length - 1], opts = [];
        for (var d = 0; d < 4; d++) { var x = c[0] + DX[d], y = c[1] + DY[d]; if (x >= 0 && y >= 0 && x < n && y < n && !vis[x + ',' + y]) opts.push(d); }
        if (!opts.length) { stack.pop(); continue; }
        var dd = opts[Math.floor(Math.random() * opts.length)], nx = c[0] + DX[dd], ny = c[1] + DY[dd];
        cells[c[1] * n + c[0]][dd] = 0; cells[ny * n + nx][(dd + 2) % 4] = 0; vis[nx + ',' + ny] = 1; stack.push([nx, ny]);
      }
      px = 0; py = 0;
    }
    function reset() { st = 'play'; lv = 1; build(); }
    function geo() { var w = api.w, h = api.h, cs = Math.min((w - 20) / n, (h - 90) / n); return { cs: cs, ox: (w - cs * n) / 2, oy: (h - cs * n) / 2 + 20 }; }
    function go(d) {
      if (st !== 'play' || cells[py * n + px][d]) return;
      px += DX[d]; py += DY[d];
      if (px === n - 1 && py === n - 1) { flash = 0.3; if (lv >= 3) st = 'win'; else { lv++; build(); } }
    }
    function nextDir() {
      var q = [[n - 1, n - 1]], prev = {}; prev[(n - 1) + ',' + (n - 1)] = null;
      while (q.length) { var c = q.shift(); for (var d = 0; d < 4; d++) { if (cells[c[1] * n + c[0]][d]) continue; var x = c[0] + DX[d], y = c[1] + DY[d], k = x + ',' + y; if (prev[k] !== undefined) continue; prev[k] = [c[0], c[1], d]; q.push([x, y]); } }
      var p = prev[px + ',' + py]; return p ? (p[2] + 2) % 4 : 0;
    }
    return {
      pausar: function () {},
      dbg: function () { var G = geo(); return { st: st, lv: lv, n: n, px: px, py: py, time: time, nd: st === 'play' ? nextDir() : -1, cx: G.ox + (px + 0.5) * G.cs, cy: G.oy + (py + 0.5) * G.cs }; },
      down: function (x, y) {
        if (st === 'menu' || st === 'lose') { reset(); return; }
        if (st === 'win') { st = 'menu'; return; }
        var G = geo(), cx = G.ox + (px + 0.5) * G.cs, cy = G.oy + (py + 0.5) * G.cs, dx = x - cx, dy = y - cy;
        if (Math.abs(dx) > Math.abs(dy)) go(dx > 0 ? 1 : 3); else go(dy > 0 ? 2 : 0);
      },
      key: function (c, d) {
        if (!d) return;
        if (st !== 'play') { if (c === 'Space' || c === 'Enter') this.down(0, 0); return; }
        var m = { ArrowUp: 0, KeyW: 0, ArrowRight: 1, KeyD: 1, ArrowDown: 2, KeyS: 2, ArrowLeft: 3, KeyA: 3 }[c]; if (m !== undefined) go(m);
      },
      update: function (dt) { if (flash > 0) flash -= dt; if (st === 'play') { time -= dt; if (time <= 0) st = 'lose'; } },
      draw: function () {
        var W = api.w, H = api.h, G = geo(), x, y;
        var s = g.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#173326'); s.addColorStop(1, '#0c1a14'); g.fillStyle = s; g.fillRect(0, 0, W, H);
        if (st === 'play' || st === 'win') {
          g.fillStyle = '#244a35'; g.fillRect(G.ox, G.oy, G.cs * n, G.cs * n);
          g.strokeStyle = '#9fd0a8'; g.lineWidth = 3;
          for (y = 0; y < n; y++) for (x = 0; x < n; x++) {
            var c = cells[y * n + x], X = G.ox + x * G.cs, Y = G.oy + y * G.cs; g.beginPath();
            if (c[0]) { g.moveTo(X, Y); g.lineTo(X + G.cs, Y); } if (c[1]) { g.moveTo(X + G.cs, Y); g.lineTo(X + G.cs, Y + G.cs); }
            if (c[2]) { g.moveTo(X, Y + G.cs); g.lineTo(X + G.cs, Y + G.cs); } if (c[3]) { g.moveTo(X, Y); g.lineTo(X, Y + G.cs); } g.stroke();
          }
          txt('🏰', G.ox + (n - 0.5) * G.cs, G.oy + (n - 0.5) * G.cs + G.cs * 0.18, G.cs * 0.6, '#fff');
          txt('🧍', G.ox + (px + 0.5) * G.cs, G.oy + (py + 0.5) * G.cs + G.cs * 0.18, G.cs * 0.6, '#fff');
          txt(T.floresta + ' ' + Math.min(lv, 3) + '/3', 22, 32, 15, '#f3ecd2', 'left');
          txt(T.tempo + ': ' + Math.max(0, Math.ceil(time)), 22, 54, 13, time < 8 ? '#ff9a8d' : '#c9b3f2', 'left');
        }
        if (flash > 0) { g.fillStyle = 'rgba(255,216,138,' + flash + ')'; g.fillRect(0, 0, W, H); }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
