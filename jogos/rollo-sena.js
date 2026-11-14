/* O curso do Sena — gire os trechos e leve a água do rio até o mar. */
BTJogo.registrar({
  canvas: 'jogo-rollo',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O curso do Sena",
    "sub": "Gire os trechos do rio, um toque de cada vez (ou use as setas e a barra de espaço), até a água sair da nascente, à esquerda, e chegar ao mar, à direita. São três rios, e o tempo é curto.",
    "perdeu": "A água não chegou ao mar",
    "v1": "A água chegou ao mar!",
    "v2": "Rollo e seus homens se instalaram no baixo Sena, e dali nasceu a Normandia. O quebra-cabeça do rio é invenção do jogo.",
    "h1": "Rios",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The course of the Seine",
    "sub": "Turn the river pieces, one tap at a time (or use the arrows and Space), until the water runs from the spring on the left to the sea on the right. Three rivers, and little time.",
    "perdeu": "The water never reached the sea",
    "v1": "The water reached the sea!",
    "v2": "Rollo and his men settled on the lower Seine, and Normandy grew from there. The river puzzle is made up for the game.",
    "h1": "Rivers",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Seinens løp",
    "sub": "Drei elvebitene, ett trykk om gangen (eller bruk piltastene og mellomromstasten), til vannet renner fra kilden til venstre til havet til høyre. Tre elver, og knapp tid.",
    "perdeu": "Vannet nådde aldri havet",
    "v1": "Vannet nådde havet!",
    "v2": "Rollo og mennene hans slo seg ned ved nedre Seine, og Normandie vokste frem derfra. Elvepuslespillet er diktet opp for spillet.",
    "h1": "Elver",
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
    var N = 5, R = 3, LIM = 70, DX = [0, 1, 0, -1], DY = [-1, 0, 1, 0];
    var cell = [], need = [], rd = 0, tmr = LIM, wait = 0, cur = 12, flow = [], row0 = 0;
    function lay() { var W = api.w, H = api.h, S = Math.min(W - 80, H * 0.72, 380); return { S: S, c: S / N, x: (W - S) / 2, y: Math.max(66, (H - S) / 2 + 12) }; }
    function open(c) { return c.t === 0 ? [c.r % 2, c.r % 2 + 2] : [c.r % 4, (c.r + 1) % 4]; }
    function makePath() {
      for (var tries = 0; tries < 400; tries++) {
        var r0 = Math.floor(Math.random() * N), x = 0, y = r0, path = [[0, r0]], seen = {}; seen['0,' + r0] = 1;
        for (var s = 0; s < 40; s++) {
          if (x === N - 1 && path.length >= 7 && Math.random() < 0.6) break;
          var o = [0, 1, 2, 3].filter(function (d) { var nx = x + DX[d], ny = y + DY[d]; return nx >= 0 && nx < N && ny >= 0 && ny < N && !seen[nx + ',' + ny]; });
          if (!o.length) break; var d = o[Math.floor(Math.random() * o.length)]; if (Math.random() < 0.35 && o.indexOf(1) >= 0) d = 1;
          x += DX[d]; y += DY[d]; path.push([x, y]); seen[x + ',' + y] = 1;
        }
        if (x === N - 1 && path.length >= 7) return path;
      }
      return [[0, 2], [1, 2], [1, 3], [2, 3], [2, 2], [3, 2], [3, 1], [4, 1]];
    }
    function newRound() {
      var path = makePath(), i, k; cell = []; need = []; for (i = 0; i < N * N; i++) { cell.push({ t: Math.floor(Math.random() * 2), r: Math.floor(Math.random() * 4) }); need.push(-1); }
      row0 = path[0][1];
      for (k = 0; k < path.length; k++) {
        var p = path[k], inD = k === 0 ? 3 : (function () { var q = path[k - 1], dx = p[0] - q[0], dy = p[1] - q[1]; for (var d = 0; d < 4; d++) if (DX[d] === -dx && DY[d] === -dy) return d; })();
        var outD = k === path.length - 1 ? 1 : (function () { var q = path[k + 1], dx = q[0] - p[0], dy = q[1] - p[1]; for (var d = 0; d < 4; d++) if (DX[d] === dx && DY[d] === dy) return d; })();
        var c = cell[p[1] * N + p[0]], opp = (inD + 2) % 4 === outD; c.t = opp ? 0 : 1;
        var rq = 0; for (var r = 0; r < 4; r++) { c.r = r; var o = open(c); if (o.indexOf(inD) >= 0 && o.indexOf(outD) >= 0) { rq = r; break; } }
        need[p[1] * N + p[0]] = rq; c.r = (rq + 1 + Math.floor(Math.random() * 3)) % 4;
      }
      wait = 0; solve();
    }
    function solve() {
      flow = []; var x = 0, y = row0, ind = 3, ok = false, seen = {};
      for (var s = 0; s < 40; s++) {
        var c = cell[y * N + x], o = open(c), k = o.indexOf(ind); if (k < 0 || seen[x + ',' + y]) break; seen[x + ',' + y] = 1; flow.push(y * N + x);
        var out = o[1 - k]; if (out === 1 && x === N - 1) { ok = true; break; }
        var nx = x + DX[out], ny = y + DY[out]; if (nx < 0 || nx >= N || ny < 0 || ny >= N) break; x = nx; y = ny; ind = (out + 2) % 4;
      }
      return ok;
    }
    function setup() { rd = 0; tmr = LIM; cur = 12; newRound(); }
    function reset() { setup(); st = 'play'; }
    function rot(i) { if (st !== 'play' || wait > 0) return; cell[i].r = (cell[i].r + 1) % 4; if (solve()) { rd++; if (rd >= R) st = 'win'; else wait = 1.1; } }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(), tp = []; for (var i = 0; i < N * N; i++) if (need[i] >= 0) { var t = (need[i] - cell[i].r + 4) % 4; if (cell[i].t === 0) t = (need[i] % 2 === cell[i].r % 2) ? 0 : 1; if (t) tp.push([i, t]); } return { st: st, rd: rd, taps: tp, tmr: tmr, x: L.x, y: L.y, c: L.c, wait: wait }; },
      down: function (x, y) { if (menu()) return; var L = lay(), c = Math.floor((x - L.x) / L.c), r = Math.floor((y - L.y) / L.c); if (c >= 0 && c < N && r >= 0 && r < N) { cur = r * N + c; rot(cur); } },
      key: function (c, d) {
        if (!d) return; var r = Math.floor(cur / N), cc = cur % N;
        if (c === 'ArrowLeft' || c === 'KeyA') cc = Math.max(0, cc - 1); else if (c === 'ArrowRight' || c === 'KeyD') cc = Math.min(N - 1, cc + 1);
        else if (c === 'ArrowUp' || c === 'KeyW') r = Math.max(0, r - 1); else if (c === 'ArrowDown' || c === 'KeyS') r = Math.min(N - 1, r + 1);
        else if (c === 'Space' || c === 'Enter') { if (st !== 'play') menu(); else rot(cur); return; }
        cur = r * N + cc;
      },
      update: function (dt) { if (st !== 'play') return; tmr -= dt; if (tmr <= 0) { st = 'lose'; return; } if (wait > 0) { wait -= dt; if (wait <= 0) newRound(); } },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), i, t = api.clock;
        bg('#16301f', '#0b1a14');
        g.fillStyle = '#2a4a6a'; g.fillRect(L.x + L.S, L.y, W - L.x - L.S, L.S); g.fillStyle = 'rgba(255,255,255,.12)'; for (i = 0; i < 6; i++) g.fillRect(L.x + L.S + 6 + (i * 13 + t * 20) % Math.max(10, W - L.x - L.S - 12), L.y + 10 + i * (L.S / 6), 10, 2);
        g.fillStyle = '#7a8a9a'; g.beginPath(); g.arc(L.x - 14, L.y + row0 * L.c + L.c / 2, 12, 0, 6.29); g.fill();
        for (i = 0; i < N * N; i++) {
          var c = cell[i], x = L.x + (i % N) * L.c, y = L.y + Math.floor(i / N) * L.c, cx = x + L.c / 2, cy = y + L.c / 2, wet = flow.indexOf(i) >= 0;
          g.fillStyle = '#3a4a34'; rr(x + 2, y + 2, L.c - 4, L.c - 4, 6); g.fill();
          g.strokeStyle = wet ? '#4aa8e8' : '#9a7a4a'; g.lineWidth = L.c * 0.22; g.lineCap = 'butt';
          var o = open(c); for (var k = 0; k < 2; k++) { g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + DX[o[k]] * L.c / 2, cy + DY[o[k]] * L.c / 2); g.stroke(); }
          g.fillStyle = wet ? '#4aa8e8' : '#9a7a4a'; g.beginPath(); g.arc(cx, cy, L.c * 0.11, 0, 6.29); g.fill();
          if (st === 'play' && i === cur) { g.strokeStyle = '#fff'; g.lineWidth = 2; rr(x + 2, y + 2, L.c - 4, L.c - 4, 6); g.stroke(); }
        }
        bar(W / 2 - 110, H - 22, 220, 6, tmr / LIM, tmr < 25 ? '#c0392b' : '#4aa8e8');
        hud(T.h1 + ' ' + rd + '/' + R, T.h2 + ' ' + Math.max(0, Math.ceil(tmr)), false);
        fim(st);
      }
    };
  }
});
