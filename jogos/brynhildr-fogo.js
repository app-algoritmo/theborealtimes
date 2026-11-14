/* O círculo de fogo — apague as chamas que cercam Brynhildr. */
BTJogo.registrar({
  canvas: 'jogo-brynhildr',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O círculo de fogo",
    "sub": "Um muro de chamas cerca Brynhildr. Toque numa pedra: ela e as quatro vizinhas trocam de estado (acesa vira apagada, e vice-versa). Apague todas as chamas, em três fases cada vez mais difíceis, antes que o tempo acabe.",
    "perdeu": "As chamas não se apagaram",
    "v1": "O fogo se apagou!",
    "v2": "Nas sagas, Brynhildr dorme dentro de um muro de fogo. O quebra-cabeça de apagar chamas é invenção do jogo.",
    "h1": "Fases",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The ring of fire",
    "sub": "A wall of flames surrounds Brynhildr. Tap a stone: it and its four neighbours switch state (lit becomes out, and the other way round). Put out every flame, in three increasingly hard stages, before time runs out.",
    "perdeu": "The flames were not put out",
    "v1": "The fire is out!",
    "v2": "In the sagas, Brynhildr sleeps inside a wall of fire. The flame-puzzle is made up for the game.",
    "h1": "Stages",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Ildringen",
    "sub": "En mur av flammer omgir Brynhild. Trykk på en stein: Den og de fire naboene bytter tilstand (tent blir slukket, og omvendt). Slukk alle flammene, i tre stadig vanskeligere runder, før tiden er ute.",
    "perdeu": "Flammene ble ikke slukket",
    "v1": "Ilden er slukket!",
    "v2": "I sagaene sover Brynhild bak en mur av ild. Flammepuslespillet er diktet opp for spillet.",
    "h1": "Runder",
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
    var R = 3, LIM = 100, N = 5, CNT = [3, 5, 7];
    var grid = [], sol = [], rd = 0, tmr = LIM, wait = 0, cur = 12;
    function lay() { var W = api.w, H = api.h, S = Math.min(W - 40, H * 0.74, 400); return { S: S, c: S / N, x: (W - S) / 2, y: Math.max(66, (H - S) / 2 + 12) }; }
    function press(i) {
      var r = Math.floor(i / N), c = i % N; grid[i] = !grid[i]; sol[i] = !sol[i];
      if (r > 0) grid[i - N] = !grid[i - N]; if (r < N - 1) grid[i + N] = !grid[i + N]; if (c > 0) grid[i - 1] = !grid[i - 1]; if (c < N - 1) grid[i + 1] = !grid[i + 1];
    }
    function lit() { var n = 0; for (var i = 0; i < 25; i++) if (grid[i]) n++; return n; }
    function newRound() {
      do { grid = []; sol = []; for (var i = 0; i < 25; i++) { grid.push(false); sol.push(false); }
        var pool = []; for (i = 0; i < 25; i++) pool.push(i);
        for (var k = 0; k < CNT[rd]; k++) { var j = Math.floor(Math.random() * pool.length); press(pool[j]); pool.splice(j, 1); }
      } while (lit() === 0); wait = 0;
    }
    function setup() { rd = 0; tmr = LIM; cur = 12; newRound(); }
    function reset() { setup(); st = 'play'; }
    function tap(i) { if (st !== 'play' || wait > 0) return; press(i); if (lit() === 0) { rd++; if (rd >= R) st = 'win'; else wait = 0.9; } }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(), s = []; for (var i = 0; i < 25; i++) if (sol[i]) s.push(i); return { st: st, rd: rd, sol: s, lit: lit(), tmr: tmr, x: L.x, y: L.y, c: L.c, wait: wait }; },
      down: function (x, y) { if (menu()) return; var L = lay(), c = Math.floor((x - L.x) / L.c), r = Math.floor((y - L.y) / L.c); if (c >= 0 && c < N && r >= 0 && r < N) { cur = r * N + c; tap(cur); } },
      key: function (c, d) {
        if (!d) return; var r = Math.floor(cur / N), cc = cur % N;
        if (c === 'ArrowLeft' || c === 'KeyA') cc = Math.max(0, cc - 1); else if (c === 'ArrowRight' || c === 'KeyD') cc = Math.min(N - 1, cc + 1);
        else if (c === 'ArrowUp' || c === 'KeyW') r = Math.max(0, r - 1); else if (c === 'ArrowDown' || c === 'KeyS') r = Math.min(N - 1, r + 1);
        else if (c === 'Space' || c === 'Enter') { if (st !== 'play') menu(); else tap(cur); return; }
        cur = r * N + cc;
      },
      update: function (dt) {
        if (st !== 'play') return; tmr -= dt; if (tmr <= 0) { st = 'lose'; return; }
        if (wait > 0) { wait -= dt; if (wait <= 0) newRound(); }
      },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), i, t = api.clock;
        bg('#2a0f12', '#0d0709');
        g.fillStyle = 'rgba(255,255,255,.06)'; rr(L.x - 10, L.y - 10, L.S + 20, L.S + 20, 14); g.fill();
        for (i = 0; i < 25; i++) {
          var x = L.x + (i % N) * L.c, y = L.y + Math.floor(i / N) * L.c, on = grid[i];
          g.fillStyle = on ? '#4a1a14' : '#34343c'; rr(x + 3, y + 3, L.c - 6, L.c - 6, 8); g.fill();
          if (on) {
            var fl = Math.sin(t * 9 + i * 1.7) * 4, cx = x + L.c / 2, cy = y + L.c * 0.72;
            g.fillStyle = '#e8542a'; g.beginPath(); g.moveTo(cx - L.c * 0.24, cy); g.quadraticCurveTo(cx - L.c * 0.2, cy - L.c * 0.35, cx + fl * 0.4, cy - L.c * 0.52); g.quadraticCurveTo(cx + L.c * 0.2, cy - L.c * 0.3, cx + L.c * 0.24, cy); g.closePath(); g.fill();
            g.fillStyle = '#ffd35a'; g.beginPath(); g.moveTo(cx - L.c * 0.12, cy); g.quadraticCurveTo(cx - L.c * 0.1, cy - L.c * 0.2, cx + fl * 0.2, cy - L.c * 0.3); g.quadraticCurveTo(cx + L.c * 0.1, cy - L.c * 0.15, cx + L.c * 0.12, cy); g.closePath(); g.fill();
          } else { g.strokeStyle = 'rgba(255,255,255,.12)'; g.lineWidth = 2; g.beginPath(); g.arc(x + L.c / 2, y + L.c / 2, L.c * 0.18, 0, 6.29); g.stroke(); }
          if (st === 'play' && i === cur) { g.strokeStyle = '#fff'; g.lineWidth = 2; rr(x + 2, y + 2, L.c - 4, L.c - 4, 8); g.stroke(); }
        }
        if (wait > 0) txt('✓', W / 2, L.y + L.S / 2, 90, 'rgba(157,255,182,.8)');
        bar(W / 2 - 110, H - 22, 220, 6, tmr / LIM, tmr < 25 ? '#c0392b' : '#e8842a');
        hud(T.h1 + ' ' + rd + '/' + R, T.h2 + ' ' + Math.max(0, Math.ceil(tmr)), false);
        fim(st);
      }
    };
  }
});
