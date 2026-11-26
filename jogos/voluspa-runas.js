/* Völuspá — lance as runas e faça cada grupo de três desaparecer. */
BTJogo.registrar({
  canvas: 'jogo-voluspa',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As runas da vidente",
    "sub": "Mire com o dedo (ou use as setas) e toque acima do lançador (ou espaço) para lançar uma runa. Três ou mais da mesma cor juntas desaparecem, e as que ficam soltas também caem. Limpe todas as runas antes que os lançamentos acabem.",
    "perdeu": "As runas ficaram sem resposta",
    "v1": "A vidente ficou em silêncio!",
    "v2": "O poema Völuspá é recitado por uma vidente diante de Odin. As runas que se lançam no jogo são invenção.",
    "h1": "Runas",
    "h2": "Lançamentos"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The seeress's runes",
    "sub": "Aim with your finger (or use the arrows) and tap above the launcher (or press Space) to throw a rune. Three or more of the same colour together vanish, and any left hanging loose fall too. Clear all the runes before the throws run out.",
    "perdeu": "The runes were left unanswered",
    "v1": "The seeress fell silent!",
    "v2": "The poem Völuspá is recited by a seeress before Odin. The runes thrown in the game are made up.",
    "h1": "Runes",
    "h2": "Throws"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Seerens runer",
    "sub": "Sikt med fingeren (eller bruk piltastene) og trykk over utskyteren (eller mellomrom) for å kaste en rune. Tre eller flere av samme farge som henger sammen, forsvinner, og de som blir hengende løse, faller også. Fjern alle runene før kastene er brukt opp.",
    "perdeu": "Runene ble stående ubesvart",
    "v1": "Seeren ble stille!",
    "v2": "Diktet Völuspá fremsies av en seer foran Odin. Runene som kastes i spillet, er diktet opp.",
    "h1": "Runer",
    "h2": "Kast"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "Las runas de la vidente",
    "sub": "Apunta con el dedo (o usa las flechas) y toca encima del lanzador (o espacio) para lanzar una runa. Tres o más del mismo color juntas desaparecen, y las que quedan sueltas también caen. Limpia todas las runas antes de que se acaben los lanzamientos.",
    "perdeu": "Las runas se quedaron sin respuesta",
    "v1": "¡La vidente guardó silencio!",
    "v2": "El poema Völuspá lo recita una vidente ante Odín. Las runas que se lanzan en el juego son invención.",
    "h1": "Runas",
    "h2": "Lanzamientos"
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
    var COLS = 9, ROWS0 = 5, SHOTS = 32, NCOL = 4, COL = ['#e0a030', '#c0392b', '#4a90c0', '#5aa05a'], GL = ['ᚠ', 'ᚢ', 'ᚦ', 'ᛉ'];
    var gr = [], cur = 0, ball = null, aim = Math.PI / 2, shots = 0, tot = 0, cleared = 0, held = {}, pop = 0, fx = [];
    function lay() { var W = api.w, H = api.h, rad = Math.min((W - 20) / (2 * COLS), (H - 180) / 14, 26); return { rad: rad, x0: (W - 2 * COLS * rad) / 2, y0: 78, sx: W / 2, sy: H - 52, dy: rad * 1.732 }; }
    function ncol(r) { return r % 2 ? COLS - 1 : COLS; }
    function maxRow() { var L = lay(); return Math.floor((L.sy - 2.2 * L.rad - L.y0 - L.rad) / L.dy); }
    function cpos(r, c) { var L = lay(); return { x: L.x0 + (2 * c + (r % 2) + 1) * L.rad, y: L.y0 + L.rad + r * L.dy }; }
    function get(r, c) { return gr[r] && gr[r][c] !== undefined ? gr[r][c] : -1; }
    function nbrs(r, c) { var o = [[r, c - 1], [r, c + 1]], d = r % 2 ? [c, c + 1] : [c - 1, c]; o.push([r - 1, d[0]], [r - 1, d[1]], [r + 1, d[0]], [r + 1, d[1]]); return o.filter(function (p) { return p[0] >= 0 && p[0] <= maxRow() && p[1] >= 0 && p[1] < ncol(p[0]); }); }
    function setup() { gr = []; var R = maxRow() + 2; for (var r = 0; r < R; r++) { gr.push([]); for (var c = 0; c < ncol(r); c++) gr[r].push(r < ROWS0 ? Math.floor(Math.random() * NCOL) : -1); } shots = 0; cleared = 0; ball = null; fx = []; tot = ROWS0 * COLS - Math.floor(ROWS0 / 2); aim = Math.PI / 2; held = {}; nextColor(); }
    function present() { var s = {}; gr.forEach(function (row) { row.forEach(function (v) { if (v >= 0) s[v] = 1; }); }); return Object.keys(s).map(Number); }
    function count() { var n = 0; gr.forEach(function (row) { row.forEach(function (v) { if (v >= 0) n++; }); }); return n; }
    function nextColor() { var p = present(); cur = p.length ? p[Math.floor(Math.random() * p.length)] : 0; }
    function reset() { setup(); st = 'play'; }
    function sim(a) {
      var L = lay(), x = L.sx, y = L.sy, dx = Math.cos(a), dy = -Math.sin(a), path = [[x, y]], lim = L.x0 + L.rad, rim = L.x0 + 2 * COLS * L.rad - L.rad, i, k;
      for (k = 0; k < 900; k++) {
        x += dx * 3; y += dy * 3; if (x < lim) { x = 2 * lim - x; dx = -dx; } if (x > rim) { x = 2 * rim - x; dx = -dx; }
        path.push([x, y]); if (y <= L.y0 + L.rad) break;
        var hit = false; for (var r = 0; r < gr.length && !hit; r++) for (var c = 0; c < gr[r].length; c++) if (gr[r][c] >= 0) { var p = cpos(r, c); if (Math.hypot(p.x - x, p.y - y) < L.rad * 1.85) { hit = true; break; } }
        if (hit) break;
      }
      var best = null, bd = 1e9; for (var r2 = 0; r2 <= maxRow(); r2++) for (var c2 = 0; c2 < ncol(r2); c2++) if (gr[r2][c2] < 0) { var q = cpos(r2, c2), d = Math.hypot(q.x - x, q.y - y); var ok = r2 === 0; if (!ok) nbrs(r2, c2).forEach(function (n) { if (get(n[0], n[1]) >= 0) ok = true; }); if (ok && d < bd) { bd = d; best = [r2, c2]; } }
      return { r: best ? best[0] : 0, c: best ? best[1] : 0, path: path };
    }
    function cluster(r, c, col) { var seen = {}, q = [[r, c]], out = []; seen[r + ',' + c] = 1; while (q.length) { var p = q.pop(); out.push(p); nbrs(p[0], p[1]).forEach(function (n) { var k = n[0] + ',' + n[1]; if (!seen[k] && get(n[0], n[1]) === col) { seen[k] = 1; q.push(n); } }); } return out; }
    function gain(a) { var s = sim(a); if (gr[s.r][s.c] >= 0) return -1; gr[s.r][s.c] = cur; var cl = cluster(s.r, s.c, cur).length; gr[s.r][s.c] = -1; return cl; }
    function attach() {
      var s = ball.land, r = s.r, c = s.c; if (gr[r] && gr[r][c] === -1) gr[r][c] = cur; shots++; var cl = cluster(r, c, cur);
      if (cl.length >= 3) { cl.forEach(function (p) { var q = cpos(p[0], p[1]); fx.push({ x: q.x, y: q.y, t: 0.4, c: gr[p[0]][p[1]] }); gr[p[0]][p[1]] = -1; }); if (api.nota) api.nota(520, 0.1, 'triangle', 0.06);
        var seen = {}, st2 = []; for (var c0 = 0; c0 < ncol(0); c0++) if (gr[0][c0] >= 0) { seen['0,' + c0] = 1; st2.push([0, c0]); } while (st2.length) { var p = st2.pop(); nbrs(p[0], p[1]).forEach(function (n) { var k = n[0] + ',' + n[1]; if (!seen[k] && get(n[0], n[1]) >= 0) { seen[k] = 1; st2.push(n); } }); }
        for (var rr2 = 0; rr2 < gr.length; rr2++) for (var cc2 = 0; cc2 < gr[rr2].length; cc2++) if (gr[rr2][cc2] >= 0 && !seen[rr2 + ',' + cc2]) { var q2 = cpos(rr2, cc2); fx.push({ x: q2.x, y: q2.y, t: 0.5, c: gr[rr2][cc2] }); gr[rr2][cc2] = -1; } }
      else if (api.nota) api.nota(220, 0.05, 'square', 0.04);
      ball = null; cleared = tot - count(); if (count() === 0) { st = 'win'; return; }
      if (r >= maxRow() - 0) { st = 'lose'; return; } if (shots >= SHOTS) { st = 'lose'; return; } nextColor();
    }
    function fire() { if (st !== 'play' || ball) return; var s = sim(aim); ball = { path: s.path, i: 0, land: s }; }
    setup();
    return {
      pausar: function () { held = {}; },
      dbg: function () { var L = lay(); return { st: st, cur: cur, shots: shots, left: count(), aim: aim, gain: gain, sx: L.sx, sy: L.sy, busy: !!ball, gr: gr.map(function (r) { return r.slice(); }) }; },
      down: function (x, y) { if (menu()) return; var L = lay(); if (y < L.sy - 14) { aim = Math.max(0.2, Math.min(Math.PI - 0.2, Math.atan2(L.sy - y, x - L.sx))); fire(); } },
      move: function (x, y, pr) { var L = lay(); if (y < L.sy - 14 && !ball) aim = Math.max(0.2, Math.min(Math.PI - 0.2, Math.atan2(L.sy - y, x - L.sx))); },
      key: function (k, d) { held[k] = d; if (d && st !== 'play') { menu(); return; } if (d && (k === 'Space' || k === 'Enter' || k === 'ArrowUp')) fire(); },
      update: function (dt) {
        pop += dt; fx = fx.filter(function (f) { f.t -= dt; return f.t > 0; }); if (st !== 'play') return;
        var k = (held.ArrowLeft || held.KeyA ? 1 : 0) - (held.ArrowRight || held.KeyD ? 1 : 0); if (k) aim = Math.max(0.2, Math.min(Math.PI - 0.2, aim + k * 1.2 * dt));
        if (ball) { ball.i += 900 * dt / 3; if (ball.i >= ball.path.length - 1) attach(); }
      },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), r, c, i;
        bg('#1a1430', '#080512');
        for (r = 0; r < gr.length; r++) for (c = 0; c < gr[r].length; c++) { var v = gr[r][c]; if (v < 0) continue; var p = cpos(r, c); g.fillStyle = COL[v]; g.beginPath(); g.arc(p.x, p.y, L.rad - 1.5, 0, 6.283); g.fill(); txt(GL[v], p.x, p.y + L.rad * 0.35, L.rad * 1.0, 'rgba(0,0,0,.45)'); }
        for (i = 0; i < fx.length; i++) { g.fillStyle = COL[fx[i].c]; g.globalAlpha = fx[i].t; g.beginPath(); g.arc(fx[i].x, fx[i].y, L.rad * (1.6 - fx[i].t), 0, 6.283); g.fill(); g.globalAlpha = 1; }
        g.strokeStyle = 'rgba(255,255,255,.12)'; g.lineWidth = 2; g.beginPath(); g.moveTo(L.x0, L.sy - 2.2 * L.rad); g.lineTo(L.x0 + 2 * COLS * L.rad, L.sy - 2.2 * L.rad); g.stroke();
        if (st === 'play' && !ball) { var s = sim(aim); g.fillStyle = 'rgba(255,255,255,.35)'; for (i = 4; i < s.path.length; i += 8) g.fillRect(s.path[i][0] - 1.5, s.path[i][1] - 1.5, 3, 3); }
        var bp = ball ? ball.path[Math.min(ball.path.length - 1, Math.floor(ball.i))] : [L.sx, L.sy]; g.fillStyle = COL[cur]; g.beginPath(); g.arc(bp[0], bp[1], L.rad - 1.5, 0, 6.283); g.fill(); txt(GL[cur], bp[0], bp[1] + L.rad * 0.35, L.rad, 'rgba(0,0,0,.45)');
        g.strokeStyle = '#ffd88a'; g.lineWidth = 3; g.beginPath(); g.moveTo(L.sx, L.sy); g.lineTo(L.sx + Math.cos(aim) * L.rad * 2.2, L.sy - Math.sin(aim) * L.rad * 2.2); g.stroke();
        hud(T.h1 + ' ' + cleared + '/' + tot, T.h2 + ' ' + shots + '/' + SHOTS, shots > SHOTS - 8);
        fim(st);
      }
    };
  }
});
