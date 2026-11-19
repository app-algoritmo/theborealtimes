/* Harald Klak — até a foz do rio (invenção). */
BTJogo.registrar({
  canvas: 'jogo-haraldklak',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Até a foz do rio",
    "sub": "Cada casa vai receber um número em sequência. Você começa no 1: toque numa casa vizinha, inclusive na diagonal, para colocar o 2, e assim por diante. Os números dourados já estão no lugar e só cabem nas casas deles. Toque na última casa colocada para desfazer. O tempo é limitado. São 3 grades.",
    "perdeu": "O tempo acabou",
    "v1": "Foz alcançada!",
    "v2": "Harald Klak foi um rei dinamarquês batizado em 826. Ligar números vizinhos até a foz de um rio é invenção.",
    "h1": "Rio",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "To the river mouth",
    "sub": "Every square will receive a number in sequence. You start at 1: tap a neighbouring square, diagonals included, to place the 2, and so on. The golden numbers are already in place and only fit their own squares. Tap the last square placed to undo it. Time is limited. There are 3 grids.",
    "perdeu": "Time ran out",
    "v1": "Mouth reached!",
    "v2": "Harald Klak was a Danish king baptised in 826. Linking neighbouring numbers up to a river mouth is invented.",
    "h1": "River",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Til elvemunningen",
    "sub": "Hver rute skal få et tall i rekkefølge. Du starter på 1: trykk på en nabo-rute, også på skrå, for å sette 2, og så videre. De gylne tallene står allerede på plass og passer bare i sine egne ruter. Trykk på den siste ruten du la for å angre. Tiden er begrenset. Det er 3 rutenett.",
    "perdeu": "Tiden tok slutt",
    "v1": "Munningen er nådd!",
    "v2": "Harald Klak var en dansk konge som ble døpt i 826. Å knytte sammen nabotall helt til en elvemunning er oppfunnet.",
    "h1": "Elv",
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
    var SZ = [[3, 4], [4, 4], [5, 5]], LIM = 300, R = 3, C = 4, N = 12, path = [], cur = [], givenAt = [], numCell = {}, k = 1;
    function nb(q) { var a = [], r = Math.floor(q / C), c = q % C, dr, dc; for (dr = -1; dr <= 1; dr++) for (dc = -1; dc <= 1; dc++) { if (!dr && !dc) continue; var rr2 = r + dr, cc = c + dc; if (rr2 >= 0 && cc >= 0 && rr2 < R && cc < C) a.push(rr2 * C + cc); } return a; }
    function genPath() {
      for (var tries = 0; tries < 400; tries++) {
        var vis = [], i, steps = 0, p = []; for (i = 0; i < N; i++) vis.push(false);
        var start = Math.floor(Math.random() * N);
        var dfs = function (q) {
          vis[q] = true; p.push(q); if (p.length === N) return true; if (++steps > 6000) return false;
          var cs = nb(q).filter(function (z) { return !vis[z]; });
          cs.forEach(function (z) { z.__o = 0; });
          var sc = cs.map(function (z) { return { z: z, o: nb(z).filter(function (y) { return !vis[y]; }).length + Math.random() * 1.2 }; });
          sc.sort(function (a, b) { return a.o - b.o; });
          for (var j = 0; j < sc.length; j++) { if (dfs(sc[j].z)) return true; if (steps > 6000) break; }
          vis[q] = false; p.pop(); return false;
        };
        if (dfs(start)) return p;
      }
      return null;
    }
    function load(i) {
      R = SZ[i][0]; C = SZ[i][1]; N = R * C; path = genPath();
      if (!path) { path = []; for (var q = 0; q < N; q++) { var r = Math.floor(q / C), c = q % C; path.push(r * C + (r % 2 ? C - 1 - c : c)); } }
      cur = []; givenAt = []; numCell = {}; var j;
      for (j = 0; j < N; j++) { cur.push(0); givenAt.push(0); }
      var nums = [1, N], extra = Math.max(2, Math.floor(N * 0.26)), pool = []; for (j = 2; j < N; j++) pool.push(j); sh(pool);
      for (j = 0; j < extra; j++) nums.push(pool[j]);
      nums.forEach(function (n) { givenAt[path[n - 1]] = n; numCell[n] = path[n - 1]; });
      k = 1; cur[path[0]] = 1;
    }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function L() { return glay(R, C, 90, 44); }
    function pos() { var l = L(), a = [], q; for (q = 0; q < N; q++) a.push({ x: l.x0 + (q % C + 0.5) * l.s, y: l.y0 + (Math.floor(q / C) + 0.5) * l.s }); return a; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lvl: lvl, pend: pend, sol: path.slice(), k: k, pos: pos() }; },
      down: function (x, y) {
        if (menu()) return; if (pend > 0 || st !== 'play') return;
        var l = L(), c = Math.floor((x - l.x0) / l.s), r = Math.floor((y - l.y0) / l.s);
        if (c < 0 || r < 0 || c >= C || r >= R) return;
        var q = r * C + c, last = path.indexOf(-1);
        var lastCell = -1, i; for (i = 0; i < N; i++) if (cur[i] === k) lastCell = i;
        if (q === lastCell) { if (k > 1) { cur[q] = 0; k--; if (api.nota) api.nota(200, 0.05, 'triangle', 0.04); } return; }
        if (cur[q] || nb(lastCell).indexOf(q) < 0) return;
        var nx = k + 1; if ((givenAt[q] && givenAt[q] !== nx) || (numCell[nx] !== undefined && numCell[nx] !== q)) { if (api.nota) api.nota(140, 0.12, 'sawtooth', 0.04); return; }
        cur[q] = nx; k = nx; if (api.nota) api.nota(300 + k * 18, 0.06, 'triangle', 0.05);
        if (k === N) lvlUp();
      },
      move: function () {}, up: function () {},
      key: function (kk, d) { if (d && st !== 'play') menu(); },
      update: function (dt) { tick(dt, load); },
      draw: function () {
        var l = L(), s = l.s, q; bg('#1a2630', '#060a0e');
        for (q = 0; q < N; q++) {
          var x = l.x0 + (q % C) * s, y = l.y0 + Math.floor(q / C) * s, v = cur[q], isLast = v === k;
          g.fillStyle = isLast ? '#5a7fa8' : v ? '#2f4a66' : 'rgba(255,255,255,.1)'; rr(x + 3, y + 3, s - 6, s - 6, 8); g.fill();
          if (givenAt[q]) { g.strokeStyle = '#ffd88a'; g.lineWidth = 3; rr(x + 3, y + 3, s - 6, s - 6, 8); g.stroke(); }
          if (v) txt(String(v), x + s / 2, y + s / 2 + s * 0.12, Math.max(16, s * 0.38), givenAt[q] ? '#ffe9b0' : '#f3ecd2');
          else if (givenAt[q]) txt(String(givenAt[q]), x + s / 2, y + s / 2 + s * 0.12, Math.max(16, s * 0.38), '#a8884a');
        }
        foot(); hh(); fim(st);
      }
    };

  }
});
