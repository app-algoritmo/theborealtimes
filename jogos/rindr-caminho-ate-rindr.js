/* Rindr — o caminho até a princesa (invenção). */
BTJogo.registrar({
  canvas: 'jogo-rindr',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O caminho até Rindr",
    "sub": "Cada casa tem um trecho de trilha reto ou em curva. Toque numa casa para girá-la um quarto de volta. Ligue a entrada, na esquerda do alto, até a saída, na direita de baixo. As casas ligadas ao caminho acendem. O tempo é limitado. São 3 mapas, cada um maior que o anterior.",
    "perdeu": "O tempo acabou antes de o caminho fechar",
    "v1": "Caminho aberto!",
    "v2": "Nas fontes nórdicas, Rindr é a mãe de Váli, filho de Odin. Em Saxo Grammaticus, ela vira a princesa Rinda, filha do rei dos rutenos, e Odin se disfarça para chegar até ela. Girar trilhas é invenção.",
    "h1": "Mapa",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The way to Rindr",
    "sub": "Each square holds a straight or curved stretch of path. Tap a square to turn it a quarter turn. Connect the entrance, at the top left, to the exit, at the bottom right. Squares joined to the path light up. Time is limited. There are 3 maps, each larger than the last.",
    "perdeu": "Time ran out before the path closed",
    "v1": "Path open!",
    "v2": "In the Norse sources, Rindr is the mother of Váli, Odin’s son. In Saxo Grammaticus, she becomes the princess Rinda, daughter of the king of the Ruthenians, and Odin disguises himself to reach her. Turning paths is invented.",
    "h1": "Map",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Veien til Rind",
    "sub": "Hver rute har et rett eller bøyd stykke sti. Trykk på en rute for å dreie den en kvart omdreining. Knytt inngangen, øverst til venstre, til utgangen, nederst til høyre. Rutene som henger sammen med stien lyser opp. Tiden er begrenset. Det er 3 kart, hvert større enn det forrige.",
    "perdeu": "Tiden gikk ut før stien var sluttet",
    "v1": "Veien er åpen!",
    "v2": "I de nordiske kildene er Rindr mor til Váli, Odins sønn. Hos Saxo Grammaticus blir hun prinsessen Rinda, datter av kongen over rutenerne, og Odin forkler seg for å nå henne. Å dreie stier er oppfunnet.",
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
    var NS = [5, 6, 7], NL = 3, LIM = 300, DX = [0, 1, 0, -1], DY = [-1, 0, 1, 0], KIND = [5, 10, 3, 6, 12, 9];
    var lvl = 0, n = 0, mask = [], tgt = [], onp = [], t = 0, pend = 0, lit = [], ok = false;
    function rotm(m) { return ((m << 1) | (m >> 3)) & 15; }
    function genPath(N) {
      var calls = 0, path = [], vis = [];
      function dfs(x, y) {
        if (++calls > 30000) return false;
        path.push([x, y]); vis[y * N + x] = 1;
        if (x === N - 1 && y === N - 1) { if (path.length >= 2 * N + 2) return true; path.pop(); vis[y * N + x] = 0; return false; }
        var o = [0, 1, 2, 3].sort(function () { return Math.random() - 0.5; });
        for (var i = 0; i < 4; i++) { var nx = x + DX[o[i]], ny = y + DY[o[i]]; if (nx < 0 || ny < 0 || nx >= N || ny >= N || vis[ny * N + nx]) continue; if (dfs(nx, ny)) return true; }
        path.pop(); vis[y * N + x] = 0; return false;
      }
      return dfs(0, 0) ? path : null;
    }
    function flow() {
      var x = 0, y = 0, from = 3, c = 0; lit = []; ok = false;
      while (c++ < n * n + 2) {
        var m = mask[y * n + x]; if (!(m & (1 << from))) break; lit[y * n + x] = 1;
        var o = m & ~(1 << from), d = o === 1 ? 0 : o === 2 ? 1 : o === 4 ? 2 : o === 8 ? 3 : -1; if (d < 0) break;
        var nx = x + DX[d], ny = y + DY[d];
        if (nx < 0 || ny < 0 || nx >= n || ny >= n) { if (x === n - 1 && y === n - 1 && d === 1) ok = true; break; }
        x = nx; y = ny; from = (d + 2) & 3;
      }
    }
    function load(i) {
      n = NS[i]; var p = null; while (!p) p = genPath(n);
      tgt = []; onp = []; mask = [];
      var k; for (k = 0; k < n * n; k++) { tgt[k] = KIND[(Math.random() * 6) | 0]; onp[k] = 0; }
      for (k = 0; k < p.length; k++) {
        var cell = p[k][1] * n + p[k][0], entry = k === 0 ? 3 : (function () { var dx = p[k][0] - p[k - 1][0], dy = p[k][1] - p[k - 1][1]; var d = dx === 1 ? 1 : dx === -1 ? 3 : dy === 1 ? 2 : 0; return (d + 2) & 3; })();
        var ex = k === p.length - 1 ? 1 : (function () { var dx = p[k + 1][0] - p[k][0], dy = p[k + 1][1] - p[k][1]; return dx === 1 ? 1 : dx === -1 ? 3 : dy === 1 ? 2 : 0; })();
        tgt[cell] = (1 << entry) | (1 << ex); onp[cell] = 1;
      }
      do { for (k = 0; k < n * n; k++) { var r = (Math.random() * 4) | 0, m = tgt[k]; while (r--) m = rotm(m); mask[k] = m; } flow(); } while (ok);
    }
    function need(k) { if (!onp[k]) return 0; var m = mask[k], r = 0; while (m !== tgt[k] && r < 4) { m = rotm(m); r++; } return r % 4; }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); flow(); st = 'play'; }
    function lay() { var W = api.w, H = api.h, cs = Math.min((W - 40) / NS[2], (H - 150) / NS[2], 66); return { cs: cs, x0: (W - n * cs) / 2, y0: 78 }; }
    function cpos(k) { var L = lay(); return { x: L.x0 + (k % n) * L.cs + L.cs / 2, y: L.y0 + ((k / n) | 0) * L.cs + L.cs / 2 }; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { var p = [], k; for (k = 0; k < n * n; k++) p.push(cpos(k)); return { st: st, lvl: lvl, n: n, mask: mask.slice(), tgt: tgt.slice(), need: mask.map(function (m, k) { return need(k); }), pos: p, pend: pend, ok: ok }; },
      down: function (x, y) {
        if (menu()) return; if (pend > 0) return; var L = lay(), cx = Math.floor((x - L.x0) / L.cs), cy = Math.floor((y - L.y0) / L.cs);
        if (cx < 0 || cy < 0 || cx >= n || cy >= n) return;
        var k = cy * n + cx; mask[k] = rotm(mask[k]); if (api.nota) api.nota(300, 0.04, 'square', 0.03); flow();
        if (ok) { lvl++; pend = 0.9; if (api.nota) api.nota(520, 0.2, 'triangle', 0.07); }
      },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) {
        if (st !== 'play') return; t += dt;
        if (pend > 0) { pend -= dt; if (pend <= 0) { if (lvl >= NL) st = 'win'; else { load(lvl); flow(); } } }
        if (st === 'play' && t >= LIM) st = 'lose';
      },
      draw: function () {
        var L = lay(), k, b; bg('#1d2a24', '#07100c');
        for (k = 0; k < n * n; k++) {
          var x = L.x0 + (k % n) * L.cs, y = L.y0 + ((k / n) | 0) * L.cs, cx = x + L.cs / 2, cy = y + L.cs / 2;
          g.fillStyle = lit[k] ? 'rgba(255,216,138,.16)' : 'rgba(255,255,255,.05)'; rr(x + 2, y + 2, L.cs - 4, L.cs - 4, 8); g.fill();
          g.strokeStyle = lit[k] ? '#ffd88a' : '#7d9a8a'; g.lineWidth = L.cs * 0.2; g.lineCap = 'round';
          for (b = 0; b < 4; b++) if (mask[k] & (1 << b)) { g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + DX[b] * L.cs / 2, cy + DY[b] * L.cs / 2); g.stroke(); }
          g.lineCap = 'butt';
        }
        txt('▶', L.x0 - 14, L.y0 + L.cs / 2, 18, '#8fe0a0'); txt('★', L.x0 + n * L.cs + 14, L.y0 + (n - 0.5) * L.cs, 18, '#ffd88a');
        bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 60 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + Math.min(lvl + 1, NL) + '/' + NL, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };

  }
});
