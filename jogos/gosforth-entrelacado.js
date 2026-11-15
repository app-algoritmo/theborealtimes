/* O entrelaçado da cruz — gire as peças até o fio ligar a fonte ao fim. */
BTJogo.registrar({
  canvas: 'jogo-gosforth',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O entrelaçado da cruz",
    "sub": "Toque numa peça para girá-la. Ligue o fio da entrada, à esquerda do alto, até a saída, à direita de baixo. As peças ligadas ao fio acendem. Há um limite de giros e de tempo.",
    "perdeu": "O fio ficou partido",
    "v1": "O entrelaçado está completo!",
    "v2": "A cruz de Gosforth, na Cumbria, tem entalhes de nós e cenas ligadas à mitologia nórdica. O jogo de peças é invenção.",
    "h1": "Fio",
    "h2": "Giros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The cross's interlace",
    "sub": "Tap a tile to rotate it. Connect the thread from the entrance, top left, to the exit, bottom right. Tiles joined to the thread light up. There is a limit on turns and on time.",
    "perdeu": "The thread stayed broken",
    "v1": "The interlace is complete!",
    "v2": "The Gosforth Cross in Cumbria carries carved knotwork and scenes linked to Norse mythology. The tile game is made up.",
    "h1": "Thread",
    "h2": "Turns"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Korsets flettverk",
    "sub": "Trykk på en brikke for å snu den. Koble tråden fra inngangen, øverst til venstre, til utgangen, nederst til høyre. Brikker som henger sammen med tråden lyser. Det er en grense for vendinger og tid.",
    "perdeu": "Tråden ble liggende brutt",
    "v1": "Flettverket er ferdig!",
    "v2": "Gosforth-korset i Cumbria har skårne knuter og motiver knyttet til norrøn mytologi. Brikkespillet er diktet opp.",
    "h1": "Tråd",
    "h2": "Vendinger"
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
    var R = 5, C = 5, MAXM = 44, LIM = 160, DX = [0, 1, 0, -1], DY = [-1, 0, 1, 0];
    var tl = [], want = [], moves = 0, tmr = LIM, cur = 0, pop = 0, lit = [];
    function lay() { var W = api.w, H = api.h, cs = Math.min((W - 24) / C, (H - 150) / R, 76); return { cs: cs, x: (W - cs * C) / 2, y: Math.max(76, (H - cs * R) / 2 + 14) }; }
    function rot(m, r) { for (var i = 0; i < r; i++) m = ((m << 1) | (m >> 3)) & 15; return m; }
    function mask(t) { return rot(t.m, t.r); }
    function walk() { var path = [[0, 0]], seen = { 0: 1 }; function dfs(x, y) { if (x === C - 1 && y === R - 1) return true; var ds = [0, 1, 2, 3].sort(function () { return Math.random() - 0.5; }); for (var k = 0; k < 4; k++) { var d = ds[k], nx = x + DX[d], ny = y + DY[d]; if (nx < 0 || ny < 0 || nx >= C || ny >= R || seen[ny * C + nx]) continue; seen[ny * C + nx] = 1; path.push([nx, ny]); if (dfs(nx, ny)) return true; path.pop(); delete seen[ny * C + nx]; } return false; } dfs(0, 0); return path; }
    function floodLit() { var L2 = {}, q = []; if (mask(tl[0]) & 8) { L2[0] = 1; q.push(0); } while (q.length) { var i = q.pop(), x = i % C, y = Math.floor(i / C), m = mask(tl[i]); for (var d = 0; d < 4; d++) if (m & (1 << d)) { var nx = x + DX[d], ny = y + DY[d]; if (nx < 0 || ny < 0 || nx >= C || ny >= R) continue; var j = ny * C + nx; if (!L2[j] && (mask(tl[j]) & (1 << ((d + 2) % 4)))) { L2[j] = 1; q.push(j); } } } return L2; }
    function connected() { var L2 = floodLit(), e = R * C - 1; return L2[e] && (mask(tl[e]) & 2); }
    function setup() {
      do {
        var p = path2(); tl = []; want = []; var i; for (i = 0; i < R * C; i++) { var t = [5, 3, 7][Math.floor(Math.random() * 3)]; tl.push({ m: t, r: Math.floor(Math.random() * 4) }); want.push(null); }
        for (i = 0; i < p.length; i++) { var x = p[i][0], y = p[i][1], need = 0, k;
          if (i === 0) need |= 8; else { for (k = 0; k < 4; k++) if (x + DX[k] === p[i - 1][0] && y + DY[k] === p[i - 1][1]) need |= 1 << k; }
          if (i === p.length - 1) need |= 2; else { for (k = 0; k < 4; k++) if (x + DX[k] === p[i + 1][0] && y + DY[k] === p[i + 1][1]) need |= 1 << k; }
          var idx = y * C + x, m = need; var ok2 = [0, 1, 2, 3].filter(function (r) { return rot(tl[idx].m, r) === m; }); var base;
          if (m === 5 || m === 10) base = 5; else base = 3; tl[idx].m = base; want[idx] = [0, 1, 2, 3].filter(function (r) { return rot(base, r) === m; }); tl[idx].r = Math.floor(Math.random() * 4); }
        moves = 0;
      } while (p.length < 9 || connected());
      tmr = LIM; cur = 0; lit = floodLit();
    }
    function path2() { return walk(); }
    function reset() { setup(); st = 'play'; }
    function turn(i) { if (st !== 'play') return; tl[i].r = (tl[i].r + 1) % 4; moves++; if (api.nota) api.nota(280, 0.04, 'triangle', 0.05); lit = floodLit(); if (connected()) st = 'win'; else if (moves >= MAXM) st = 'lose'; }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, tl: tl.map(function (t) { return { m: t.m, r: t.r }; }), want: want, moves: moves, x: L.x, y: L.y, cs: L.cs, C: C, R: R }; },
      down: function (x, y) { if (menu()) return; var L = lay(), c = Math.floor((x - L.x) / L.cs), r = Math.floor((y - L.y) / L.cs); if (c >= 0 && c < C && r >= 0 && r < R) { cur = r * C + c; turn(cur); } },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } var r = Math.floor(cur / C), c = cur % C; if (k === 'ArrowUp' || k === 'KeyW') r = Math.max(0, r - 1); else if (k === 'ArrowDown' || k === 'KeyS') r = Math.min(R - 1, r + 1); else if (k === 'ArrowLeft' || k === 'KeyA') c = Math.max(0, c - 1); else if (k === 'ArrowRight' || k === 'KeyD') c = Math.min(C - 1, c + 1); else if (k === 'Space' || k === 'Enter') { turn(cur); return; } cur = r * C + c; },
      update: function (dt) { pop += dt; if (st === 'play') { tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; } } },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), i, d, n = 0;
        bg('#2a2a2e', '#0c0c10');
        for (i = 0; i < R * C; i++) {
          var x = L.x + (i % C) * L.cs, y = L.y + Math.floor(i / C) * L.cs, m = mask(tl[i]), on = lit[i], cx = x + L.cs / 2, cy = y + L.cs / 2; if (on) n++;
          g.fillStyle = on ? '#4a4638' : '#34343a'; rr(x + 2, y + 2, L.cs - 4, L.cs - 4, 8); g.fill();
          g.strokeStyle = on ? '#ffd88a' : '#8a93a8'; g.lineWidth = Math.max(5, L.cs * 0.14); g.lineCap = 'round';
          for (d = 0; d < 4; d++) if (m & (1 << d)) { g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + DX[d] * L.cs * 0.5, cy + DY[d] * L.cs * 0.5); g.stroke(); }
          g.fillStyle = on ? '#ffd88a' : '#8a93a8'; g.beginPath(); g.arc(cx, cy, L.cs * 0.1, 0, 6.283); g.fill();
          if (i === cur && st === 'play') { g.strokeStyle = 'rgba(255,216,138,.7)'; g.lineWidth = 2; rr(x + 2, y + 2, L.cs - 4, L.cs - 4, 8); g.stroke(); }
        }
        g.fillStyle = '#ffd88a'; g.fillRect(L.x - 10, L.y + L.cs / 2 - 3, 12, 6); g.fillRect(L.x + C * L.cs - 2, L.y + (R - 0.5) * L.cs - 3, 12, 6);
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 30 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + n + '/' + (R * C), T.h2 + ' ' + moves + '/' + MAXM, moves > MAXM - 12);
        fim(st);
      }
    };
  }
});
