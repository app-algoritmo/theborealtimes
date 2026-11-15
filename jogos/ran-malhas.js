/* As malhas de Rán — feche mais malhas do que a deusa. */
BTJogo.registrar({
  canvas: 'jogo-ran',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As malhas de Rán",
    "sub": "Cada jogada liga dois pontos vizinhos com um fio. Quem fecha o quarto lado de uma malha fica com ela e joga de novo. Toque num fio (ou use as setas e o espaço). Feche pelo menos 9 das 16 malhas antes de Rán. O tempo é limitado.",
    "perdeu": "A rede de Rán ficou com mais malhas",
    "v1": "A rede é sua!",
    "v2": "Nas fontes, Rán possui uma rede com que apanha os que se afogam. O jogo de fechar malhas é invenção.",
    "h1": "Malhas",
    "h2": "Rán"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Rán's meshes",
    "sub": "Each move joins two neighbouring dots with a thread. Whoever closes the fourth side of a mesh keeps it and plays again. Tap a thread (or use the arrows and Space). Close at least 9 of the 16 meshes before Rán. Time is limited.",
    "perdeu": "Rán's net kept more meshes",
    "v1": "The net is yours!",
    "v2": "In the sources, Rán owns a net with which she catches the drowned. The game of closing meshes is made up.",
    "h1": "Meshes",
    "h2": "Rán"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Ráns masker",
    "sub": "Hvert trekk knytter to nabopunkter med en tråd. Den som lukker den fjerde siden av en maske, beholder den og spiller igjen. Trykk på en tråd (eller bruk piltastene og mellomrom). Lukk minst 9 av de 16 maskene før Rán. Tiden er begrenset.",
    "perdeu": "Ráns garn fikk flest masker",
    "v1": "Garnet er ditt!",
    "v2": "I kildene eier Rán et garn som hun fanger de druknede med. Maskespillet er diktet opp.",
    "h1": "Masker",
    "h2": "Rán"
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
    var N = 4, NEED = 9, LIM = 240;
    var ed = [], bx = [], turn = 1, mine = 0, ai = 0, wait = 0, tmr = LIM, cur = 0, pop = 0, last = -1;
    /* arestas: 0..19 horizontais (r*4+c, r 0..4, c 0..3); 20..39 verticais (r*5+c, r 0..3, c 0..4) */
    function lay() { var W = api.w, H = api.h, cs = Math.min((W - 60) / N, (H - 170) / N, 80); return { cs: cs, x: (W - cs * N) / 2, y: Math.max(80, (H - cs * N) / 2 + 10) }; }
    function ends(e) { if (e < 20) { var r = Math.floor(e / 4), c = e % 4; return [c, r, c + 1, r]; } var r2 = Math.floor((e - 20) / 5), c2 = (e - 20) % 5; return [c2, r2, c2, r2 + 1]; }
    function mid(e) { var L = lay(), q = ends(e); return { x: L.x + (q[0] + q[2]) / 2 * L.cs, y: L.y + (q[1] + q[3]) / 2 * L.cs }; }
    function H_(r, c) { return r * 4 + c; } function V_(r, c) { return 20 + r * 5 + c; }
    function boxEdges(r, c) { return [H_(r, c), H_(r + 1, c), V_(r, c), V_(r, c + 1)]; }
    function sides(r, c) { var n = 0; boxEdges(r, c).forEach(function (e) { if (ed[e]) n++; }); return n; }
    function adj(e) { var q = ends(e), out = []; if (e < 20) { var r = q[1], c = q[0]; if (r > 0) out.push([r - 1, c]); if (r < N) out.push([r, c]); } else { var r2 = q[1], c2 = q[0]; if (c2 > 0) out.push([r2, c2 - 1]); if (c2 < N) out.push([r2, c2]); } return out; }
    function setup() { ed = []; for (var i = 0; i < 40; i++) ed.push(0); bx = []; for (i = 0; i < 16; i++) bx.push(0); turn = 1; mine = 0; ai = 0; wait = 0; tmr = LIM; cur = 0; last = -1; }
    function reset() { setup(); st = 'play'; }
    function play(e, who) {
      if (ed[e]) return false; ed[e] = who; last = e; var got = 0; adj(e).forEach(function (a) { if (!bx[a[0] * 4 + a[1]] && sides(a[0], a[1]) === 4) { bx[a[0] * 4 + a[1]] = who; got++; if (who === 1) mine++; else ai++; } });
      if (api.nota) api.nota(got ? 520 : 260, 0.06, 'triangle', 0.05);
      if (mine >= NEED) { st = 'win'; return true; }
      if (ai > 16 - NEED || mine + ai === 16) { st = 'lose'; return true; }
      if (!got) { turn = who === 1 ? 2 : 1; wait = who === 1 ? 0.6 : 0.1; } else wait = who === 2 ? 0.55 : 0; return true;
    }
    function aiMove() {
      var all = [], i; for (i = 0; i < 40; i++) if (!ed[i]) all.push(i);
      var take = [], safe = [], lose2 = [];
      all.forEach(function (e) { var a = adj(e), can = false, bad = false; a.forEach(function (b) { var s = sides(b[0], b[1]); if (!bx[b[0] * 4 + b[1]]) { if (s === 3) can = true; if (s === 2) bad = true; } }); if (can) take.push(e); else if (!bad) safe.push(e); else lose2.push(e); });
      var e2;
      if (take.length && Math.random() < 0.75) e2 = take[Math.floor(Math.random() * take.length)];
      else if (safe.length && Math.random() < 0.55) e2 = safe[Math.floor(Math.random() * safe.length)];
      else e2 = all[Math.floor(Math.random() * all.length)];
      return e2;
    }
    function human(e) { if (st !== 'play' || turn !== 1 || wait > 0 || ed[e]) return; play(e, 1); }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var arr = []; for (var i = 0; i < 40; i++) { var m = mid(i); arr.push({ x: m.x, y: m.y }); } return { st: st, ed: ed.slice(), bx: bx.slice(), turn: turn, wait: wait, mine: mine, ai: ai, mid: arr, sides: sides, adj: adj }; },
      down: function (x, y) { if (menu()) return; if (turn !== 1) return; var L = lay(), best = -1, bd = 1e9; for (var i = 0; i < 40; i++) { if (ed[i]) continue; var m = mid(i), d = Math.hypot(m.x - x, m.y - y); if (d < bd) { bd = d; best = i; } } if (best >= 0 && bd < L.cs * 0.45) { cur = best; human(best); } },
      key: function (k, d) {
        if (!d) return; if (st !== 'play') { menu(); return; } var n = 0; for (var i = 0; i < 40; i++) if (!ed[i]) n++; if (!n) return;
        var step = 0; if (k === 'ArrowRight' || k === 'ArrowDown' || k === 'KeyD' || k === 'KeyS') step = 1; else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'KeyA' || k === 'KeyW') step = -1; else if (k === 'Space' || k === 'Enter') { human(cur); return; }
        if (step) { do { cur = (cur + step + 40) % 40; } while (ed[cur]); }
      },
      update: function (dt) {
        pop += dt; if (st !== 'play') return; tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; return; }
        if (wait > 0) { wait -= dt; return; }
        if (turn === 2) { var e = aiMove(); play(e, 2); }
      },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), r, c, i;
        bg('#12263a', '#050b12');
        for (r = 0; r < N; r++) for (c = 0; c < N; c++) { var o = bx[r * 4 + c]; if (o) { g.fillStyle = o === 1 ? 'rgba(255,216,138,.55)' : 'rgba(120,150,200,.5)'; g.fillRect(L.x + c * L.cs + 4, L.y + r * L.cs + 4, L.cs - 8, L.cs - 8); txt(o === 1 ? '●' : '○', L.x + (c + 0.5) * L.cs, L.y + (r + 0.5) * L.cs + 7, L.cs * 0.3, 'rgba(0,0,0,.5)'); } }
        for (i = 0; i < 40; i++) { var q = ends(i), x1 = L.x + q[0] * L.cs, y1 = L.y + q[1] * L.cs, x2 = L.x + q[2] * L.cs, y2 = L.y + q[3] * L.cs; g.lineCap = 'round';
          if (ed[i]) { g.strokeStyle = ed[i] === 1 ? '#ffd88a' : '#8aa6d8'; g.lineWidth = i === last ? 7 : 5; } else { g.strokeStyle = i === cur && turn === 1 && st === 'play' ? 'rgba(255,216,138,.7)' : 'rgba(255,255,255,.15)'; g.lineWidth = i === cur && st === 'play' ? 6 : 3; }
          g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); }
        for (r = 0; r <= N; r++) for (c = 0; c <= N; c++) { g.fillStyle = '#e8f0ff'; g.beginPath(); g.arc(L.x + c * L.cs, L.y + r * L.cs, 5, 0, 6.283); g.fill(); }
        txt(turn === 1 ? '▶' : '…', W / 2, L.y + L.cs * N + 40, 18, 'rgba(255,255,255,.5)');
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 40 ? '#c0392b' : '#6aa0d8');
        hud(T.h1 + ' ' + mine + '/' + NEED, T.h2 + ' ' + ai, ai > mine);
        fim(st);
      }
    };
  }
});
