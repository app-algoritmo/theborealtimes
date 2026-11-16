/* Ullr, deus dos esquis e do arco — escorregue no gelo até o marco (invenção). */
BTJogo.registrar({
  canvas: 'jogo-ullr',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O gelo de Ullr",
    "sub": "Deslize o dedo (ou use as setas) para o esquiador escorregar no gelo: ele só para ao bater numa pedra ou na borda, e para sozinho no marco. Chegue ao marco dentro do limite de movimentos e de 75 segundos. Um toque no tabuleiro também indica a direção, a partir do esquiador.",
    "perdeu": "Sem movimentos ou sem tempo",
    "v1": "O marco foi alcançado!",
    "v2": "Ullr tem um salão de teixos e muitos topônimos, mas quase nenhum mito. O gelo e o marco são invenção.",
    "h1": "Movimentos",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Ullr's ice",
    "sub": "Swipe (or use the arrow keys) to make the skier slide on the ice: it only stops when it hits a stone or the edge, and it stops by itself at the marker. Reach the marker within the move limit and 75 seconds. A tap on the board also gives the direction, starting from the skier.",
    "perdeu": "Out of moves or out of time",
    "v1": "The marker is reached!",
    "v2": "Ullr has a hall of yews and many place names, but almost no myth. The ice and the marker are invented.",
    "h1": "Moves",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Ullrs is",
    "sub": "Sveip (eller bruk piltastene) for å få skiløperen til å gli på isen: den stopper bare når den treffer en stein eller kanten, og stopper av seg selv ved merket. Nå merket innenfor trekkgrensen og 75 sekunder. Et trykk på brettet gir også retningen, fra skiløperen.",
    "perdeu": "Tom for trekk eller tid",
    "v1": "Merket er nådd!",
    "v2": "Ullr har en hall av barlind og mange stedsnavn, men nesten ingen myte. Isen og merket er oppfunnet.",
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
    var N = 7, LIM = 75, DX = [-1, 1, 0, 0], DY = [0, 0, -1, 1];
    var rocks = {}, cx = 0, cy = 0, vx = 0, vy = 0, gx = 0, gy = 0, moves = 0, maxm = 6, t = 0, pend = '', sx = 0, sy = 0, lx = 0, ly = 0, dn = false, trail = [];
    function lay() { var W = api.w, H = api.h, cs = Math.max(34, Math.min((W - 20) / N, (H - 120) / N, 78)); return { W: W, H: H, cs: cs, x: (W - cs * N) / 2, y: Math.max(76, (H - cs * N) / 2 + 12) }; }
    function ok(x, y) { return x >= 0 && y >= 0 && x < N && y < N && !rocks[x + ',' + y]; }
    function dest(x, y, d) { var nx = x, ny = y; while (ok(nx + DX[d], ny + DY[d])) { nx += DX[d]; ny += DY[d]; if (nx === gx && ny === gy) break; } return [nx, ny]; }
    function solve(x0, y0) {
      var seen = {}, q = [[x0, y0, []]]; seen[x0 + ',' + y0] = 1;
      while (q.length) { var c = q.shift(); if (c[0] === gx && c[1] === gy) return c[2]; for (var d = 0; d < 4; d++) { var p = dest(c[0], c[1], d); if (p[0] === c[0] && p[1] === c[1]) continue; var k = p[0] + ',' + p[1]; if (seen[k]) continue; seen[k] = 1; q.push([p[0], p[1], c[2].concat([d])]); } }
      return null;
    }
    function setup() {
      for (var tr = 0; tr < 500; tr++) {
        rocks = {}; var n = 9 + Math.floor(Math.random() * 4), i;
        gx = Math.floor(Math.random() * N); gy = Math.floor(Math.random() * N);
        for (i = 0; i < n; i++) { var rx = Math.floor(Math.random() * N), ry = Math.floor(Math.random() * N); if (rx !== gx || ry !== gy) rocks[rx + ',' + ry] = 1; }
        cx = Math.floor(Math.random() * N); cy = Math.floor(Math.random() * N); if (!ok(cx, cy) || (cx === gx && cy === gy)) continue;
        var p = solve(cx, cy); if (p && p.length >= 4 && p.length <= 6) { maxm = p.length + 2; break; }
      }
      vx = cx; vy = cy; moves = 0; t = 0; pend = ''; trail = [[cx, cy]];
    }
    function reset() { setup(); st = 'play'; }
    function go(d) {
      if (st !== 'play' || pend || Math.abs(vx - cx) + Math.abs(vy - cy) > 0.05) return;
      var p = dest(cx, cy, d); if (p[0] === cx && p[1] === cy) return;
      cx = p[0]; cy = p[1]; moves++; trail.push([cx, cy]); if (api.nota) api.nota(330, 0.12, 'triangle', 0.05);
      pend = (cx === gx && cy === gy) ? 'win' : (moves >= maxm ? 'lose' : 'go');
    }
    function tap(x, y) { var L = lay(), px = L.x + (vx + 0.5) * L.cs, py = L.y + (vy + 0.5) * L.cs, dx = x - px, dy = y - py; if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return; if (Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 0 : 1); else go(dy < 0 ? 2 : 3); }
    setup();
    return {
      pausar: function () { dn = false; },
      dbg: function () { return { st: st, cx: cx, cy: cy, gx: gx, gy: gy, moves: moves, max: maxm, t: t, busy: !!pend || Math.abs(vx - cx) + Math.abs(vy - cy) > 0.05, path: solve(cx, cy) }; },
      down: function (x, y) { if (menu()) return; dn = true; sx = lx = x; sy = ly = y; },
      move: function (x, y, pr) { if (dn && pr) { lx = x; ly = y; } },
      up: function () { if (!dn) return; dn = false; var dx = lx - sx, dy = ly - sy; if (Math.abs(dx) < 16 && Math.abs(dy) < 16) tap(sx, sy); else if (Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 0 : 1); else go(dy < 0 ? 2 : 3); },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } var m = { ArrowLeft: 0, KeyA: 0, ArrowRight: 1, KeyD: 1, ArrowUp: 2, KeyW: 2, ArrowDown: 3, KeyS: 3 }[k]; if (m !== undefined) go(m); },
      update: function (dt) {
        var sp = 13 * dt, ddx = cx - vx, ddy = cy - vy;
        vx += Math.max(-sp, Math.min(sp, ddx)); vy += Math.max(-sp, Math.min(sp, ddy));
        if (st !== 'play') return; t += dt; if (t >= LIM) { st = 'lose'; return; }
        if (pend && Math.abs(cx - vx) + Math.abs(cy - vy) < 0.02) { var p = pend; pend = ''; if (p === 'win') st = 'win'; else if (p === 'lose') st = 'lose'; }
      },
      draw: function () {
        var L = lay(), cs = L.cs, i, j;
        bg('#14304a', '#0a1826');
        for (i = 0; i < N; i++) for (j = 0; j < N; j++) { g.fillStyle = (i + j) % 2 ? '#cfe6f2' : '#b9d8ea'; g.fillRect(L.x + i * cs, L.y + j * cs, cs, cs); if (rocks[i + ',' + j]) { g.fillStyle = '#4a5560'; g.beginPath(); g.arc(L.x + (i + 0.5) * cs, L.y + (j + 0.5) * cs, cs * 0.4, 0, 6.283); g.fill(); g.fillStyle = '#6a7580'; g.beginPath(); g.arc(L.x + (i + 0.4) * cs, L.y + (j + 0.4) * cs, cs * 0.16, 0, 6.283); g.fill(); } }
        g.strokeStyle = 'rgba(70,110,140,.35)'; g.lineWidth = 3; g.beginPath(); for (i = 0; i < trail.length; i++) { var q = trail[i]; if (i) g.lineTo(L.x + (q[0] + 0.5) * cs, L.y + (q[1] + 0.5) * cs); else g.moveTo(L.x + (q[0] + 0.5) * cs, L.y + (q[1] + 0.5) * cs); } g.stroke();
        var mx = L.x + (gx + 0.5) * cs, my = L.y + (gy + 0.5) * cs; g.fillStyle = '#b8403a'; g.beginPath(); g.moveTo(mx, my - cs * 0.42); g.lineTo(mx + cs * 0.3, my + cs * 0.38); g.lineTo(mx - cs * 0.3, my + cs * 0.38); g.closePath(); g.fill(); g.fillStyle = '#f3ecd2'; g.fillRect(mx - 2, my - cs * 0.15, 4, cs * 0.3);
        var px = L.x + (vx + 0.5) * cs, py = L.y + (vy + 0.5) * cs; g.fillStyle = '#2d6fb0'; g.beginPath(); g.arc(px, py, cs * 0.3, 0, 6.283); g.fill(); g.fillStyle = '#f3d2a8'; g.beginPath(); g.arc(px, py - cs * 0.12, cs * 0.14, 0, 6.283); g.fill(); g.strokeStyle = '#fff'; g.lineWidth = 3; g.beginPath(); g.moveTo(px - cs * 0.3, py + cs * 0.34); g.lineTo(px + cs * 0.3, py + cs * 0.34); g.stroke();
        bar(W2(), api.h - 14, 220, 5, (LIM - t) / LIM, LIM - t < 15 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + moves + '/' + maxm, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };
    function W2() { return api.w / 2 - 110; }
  }
});
