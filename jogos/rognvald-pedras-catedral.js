/* Kirkwall — encaixe os blocos e erga as paredes da catedral. */
BTJogo.registrar({
  canvas: 'jogo-rognvald',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A catedral de Kirkwall",
    "sub": "Blocos de arenito descem. Toque à esquerda ou à direita do campo para mover, no meio de cima para girar e no meio de baixo para soltar de vez (setas, espaço e ↑ no teclado). Complete 10 fileiras antes que a pilha chegue ao topo.",
    "perdeu": "A pilha chegou ao topo",
    "v1": "As paredes estão de pé!",
    "v2": "A catedral de São Magnus, em Kirkwall, teve a obra iniciada em 1137 por Rögnvald Kali. O encaixe de blocos é invenção.",
    "h1": "Fileiras",
    "h2": "Altura"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The cathedral of Kirkwall",
    "sub": "Sandstone blocks fall. Tap the left or right of the field to move, the top middle to rotate and the bottom middle to drop at once (arrow keys, space and ↑ on the keyboard). Complete 10 rows before the stack reaches the top.",
    "perdeu": "The stack reached the top",
    "v1": "The walls are standing!",
    "v2": "The work on St Magnus Cathedral in Kirkwall was begun in 1137 by Rögnvald Kali. The fitting of blocks is made up.",
    "h1": "Rows",
    "h2": "Height"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Katedralen i Kirkwall",
    "sub": "Sandsteinsblokker faller. Trykk til venstre eller høyre i feltet for å flytte, øverst i midten for å rotere og nederst i midten for å slippe rett ned (piltaster, mellomrom og ↑ på tastaturet). Fullfør 10 rader før stabelen når toppen.",
    "perdeu": "Stabelen nådde toppen",
    "v1": "Veggene står!",
    "v2": "Byggingen av St. Magnus-katedralen i Kirkwall ble begynt i 1137 av Rögnvald Kali. Blokkpasningen er diktet opp.",
    "h1": "Rader",
    "h2": "Høyde"
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
    var W_ = 8, H_ = 14, GOAL = 10;
    var SH = [
      [[[0,0],[0,1],[0,2],[0,3]], [[0,0],[1,0],[2,0],[3,0]]],
      [[[0,0],[0,1],[1,0],[1,1]]],
      [[[0,1],[1,0],[1,1],[1,2]], [[0,0],[1,0],[1,1],[2,0]], [[0,0],[0,1],[0,2],[1,1]], [[0,1],[1,0],[1,1],[2,1]]],
      [[[0,0],[1,0],[2,0],[2,1]], [[0,0],[0,1],[0,2],[1,0]], [[0,0],[0,1],[1,1],[2,1]], [[0,2],[1,0],[1,1],[1,2]]],
      [[[0,1],[1,1],[2,0],[2,1]], [[0,0],[1,0],[1,1],[1,2]], [[0,0],[0,1],[1,0],[2,0]], [[0,0],[0,1],[0,2],[1,2]]],
      [[[0,1],[0,2],[1,0],[1,1]], [[0,0],[1,0],[1,1],[2,1]]],
      [[[0,0],[0,1],[1,1],[1,2]], [[0,1],[1,0],[1,1],[2,0]]]
    ];
    var COL = ['#7fc0d0', '#d8b040', '#a070c0', '#e08a4a', '#4a8ad0', '#7fc06a', '#d8493a'];
    var grid = [], pc = null, tk = 0, lines = 0, flash = 0, hold = 0, nextIdx = 0, kd = 0;
    function lay() { var W = api.w, H = api.h, cs = Math.max(16, Math.min((W - 24) / W_, (H - 150) / H_, 40)); return { cs: cs, x: (W - cs * W_) / 2, y: Math.max(84, (H - cs * H_) / 2 + 6) }; }
    function setup() { grid = []; for (var r = 0; r < H_; r++) grid.push(new Array(W_).fill(0)); lines = 0; tk = 0; flash = 0; nextIdx = Math.floor(Math.random() * 7); spawn(); }
    function spawn() { var i = nextIdx; nextIdx = Math.floor(Math.random() * 7); pc = { i: i, r: 0, x: 3, y: 0 }; if (!fits(pc.i, pc.r, pc.x, pc.y)) { st = 'lose'; if (api.nota) api.nota(110, 0.4, 'sawtooth', 0.07); } }
    function reset() { setup(); st = 'play'; }
    function cells(i, r, x, y) { var s = SH[i][r % SH[i].length]; return s.map(function (c) { return [y + c[0], x + c[1]]; }); }
    function fits(i, r, x, y) { return cells(i, r, x, y).every(function (c) { return c[0] >= 0 && c[0] < H_ && c[1] >= 0 && c[1] < W_ && !grid[c[0]][c[1]]; }); }
    function lock() { cells(pc.i, pc.r, pc.x, pc.y).forEach(function (c) { grid[c[0]][c[1]] = pc.i + 1; }); var n = 0; for (var r = H_ - 1; r >= 0; r--) { if (grid[r].every(function (v) { return v; })) { grid.splice(r, 1); grid.unshift(new Array(W_).fill(0)); n++; r++; } } if (n) { lines += n; flash = 0.3; if (api.nota) api.nota(500 + n * 80, 0.12, 'triangle', 0.06); if (lines >= GOAL) { st = 'win'; return; } } else if (api.nota) api.nota(200, 0.04, 'square', 0.03); spawn(); }
    function mv(dx) { if (st !== 'play') return; if (fits(pc.i, pc.r, pc.x + dx, pc.y)) pc.x += dx; }
    function rot() { if (st !== 'play') return; var nr = (pc.r + 1) % SH[pc.i].length; if (fits(pc.i, nr, pc.x, pc.y)) pc.r = nr; else if (fits(pc.i, nr, pc.x - 1, pc.y)) { pc.r = nr; pc.x--; } else if (fits(pc.i, nr, pc.x + 1, pc.y)) { pc.r = nr; pc.x++; } }
    function drop() { if (st !== 'play') return; while (fits(pc.i, pc.r, pc.x, pc.y + 1)) pc.y++; lock(); tk = 0; }
    function soft() { if (st !== 'play') return; if (fits(pc.i, pc.r, pc.x, pc.y + 1)) pc.y++; else lock(); tk = 0; }
    function height() { for (var r = 0; r < H_; r++) if (grid[r].some(function (v) { return v; })) return H_ - r; return 0; }
    setup();
    return {
      pausar: function () { kd = 0; },
      dbg: function () { return { st: st, grid: grid.map(function (r) { return r.slice(); }), pc: pc ? { i: pc.i, r: pc.r, x: pc.x, y: pc.y } : null, shapes: SH, lines: lines, goal: GOAL, W: W_, H: H_, height: height() }; },
      down: function (x, y) { if (menu()) return; var L = lay(), fx = (x - L.x) / (L.cs * W_), fy = (y - L.y) / (L.cs * H_); if (fx < 0.34) mv(-1); else if (fx > 0.66) mv(1); else if (fy < 0.5) rot(); else drop(); },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'ArrowLeft' || k === 'KeyA') mv(-1); else if (k === 'ArrowRight' || k === 'KeyD') mv(1); else if (k === 'ArrowUp' || k === 'KeyW') rot(); else if (k === 'ArrowDown' || k === 'KeyS') soft(); else if (k === 'Space') drop(); },
      update: function (dt) { if (flash > 0) flash -= dt; if (st !== 'play') return; tk += dt; var iv = Math.max(0.28, 0.85 - lines * 0.05); if (tk >= iv) { tk = 0; if (fits(pc.i, pc.r, pc.x, pc.y + 1)) pc.y++; else lock(); } },
      draw: function () {
        var L = lay(), W = api.w, H = api.h, r, c;
        bg('#2a1e1a', '#0a0605');
        g.fillStyle = 'rgba(0,0,0,.45)'; rr(L.x - 5, L.y - 5, L.cs * W_ + 10, L.cs * H_ + 10, 8); g.fill();
        for (r = 0; r < H_; r++) for (c = 0; c < W_; c++) { var v = grid[r][c]; g.fillStyle = v ? COL[v - 1] : 'rgba(255,255,255,.04)'; g.fillRect(L.x + c * L.cs + 1, L.y + r * L.cs + 1, L.cs - 2, L.cs - 2); }
        if (pc && st === 'play') { var gy = pc.y; while (fits(pc.i, pc.r, pc.x, gy + 1)) gy++; cells(pc.i, pc.r, pc.x, gy).forEach(function (q) { g.strokeStyle = 'rgba(255,255,255,.25)'; g.lineWidth = 1; g.strokeRect(L.x + q[1] * L.cs + 2, L.y + q[0] * L.cs + 2, L.cs - 4, L.cs - 4); }); cells(pc.i, pc.r, pc.x, pc.y).forEach(function (q) { g.fillStyle = COL[pc.i]; g.fillRect(L.x + q[1] * L.cs + 1, L.y + q[0] * L.cs + 1, L.cs - 2, L.cs - 2); }); }
        if (flash > 0) { g.fillStyle = 'rgba(255,216,138,' + flash + ')'; g.fillRect(L.x, L.y, L.cs * W_, L.cs * H_); }
        hud(T.h1 + ' ' + lines + '/' + GOAL, T.h2 + ' ' + height() + '/' + H_, height() >= H_ - 4);
        fim(st);
      }
    };
  }
});
