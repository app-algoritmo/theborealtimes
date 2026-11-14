/* A tocha em Helheim — ache a porta no escuro, guiado só pela luz da tocha. */
BTJogo.registrar({
  canvas: 'jogo-hel',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A tocha em Helheim",
    "sub": "Helheim é escuro e só a luz da sua tocha mostra o caminho. Arraste o dedo (ou use as setas) para andar. Chegue à porta antes que o tempo acabe. Cada brasa que você pega dá mais tempo e mais luz.",
    "perdeu": "A tocha se apagou no escuro",
    "v1": "Você saiu de Helheim!",
    "v2": "Na Edda em Prosa, Hermóðr cavalga nove noites no escuro até chegar à ponte Gjallarbrú. O labirinto é invenção do jogo.",
    "h1": "Brasas",
    "h2": "Tempo",
    "dica": "A porta só se abre para quem ainda tem luz"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The torch in Helheim",
    "sub": "Helheim is dark and only the light of your torch shows the way. Drag a finger (or use the arrows) to walk. Reach the door before time runs out. Each ember you pick up gives more time and more light.",
    "perdeu": "The torch went out in the dark",
    "v1": "You left Helheim!",
    "v2": "In the Prose Edda, Hermóðr rides nine nights in the dark until he reaches the bridge Gjallarbrú. The maze is made up for the game.",
    "h1": "Embers",
    "h2": "Time",
    "dica": "Find the door"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Fakkelen i Helheim",
    "sub": "Helheim er mørkt, og bare lyset fra fakkelen viser veien. Dra en finger (eller bruk piltastene) for å gå. Nå døra før tiden går ut. Hver glo du tar gir mer tid og mer lys.",
    "perdeu": "Fakkelen sluknet i mørket",
    "v1": "Du kom deg ut av Helheim!",
    "v2": "I Snorres Edda rir Hermod ni netter i mørket før han kommer til broen Gjallarbrú. Labyrinten er diktet opp for spillet.",
    "h1": "Glør",
    "h2": "Tid",
    "dica": "Finn døra"
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
    var LIM = 70, STEP = 0.105;
    var cols = 15, rows = 11, m = [], seen = [], keys = [], ex = 0, ey = 0, px = 1, py = 1, mv = null, tmr = LIM, got = 0, held = [], anc = null, ptr = null, pop = 0, ox = 1, oy = 1, glow = 0;
    function lay() { var W = api.w, H = api.h, s = Math.min((W - 16) / cols, (H - 84) / rows); return { c: s, x: (W - cols * s) / 2, y: Math.max(68, (H - rows * s) / 2 + 22) }; }
    function bfs(sx, sy) {
      var d = [], r, c, q = [[sx, sy]], k = 0; for (r = 0; r < rows; r++) { d.push([]); for (c = 0; c < cols; c++) d[r].push(-1); }
      d[sy][sx] = 0;
      while (k < q.length) { var p = q[k++], D = [[1, 0], [-1, 0], [0, 1], [0, -1]]; for (var i = 0; i < 4; i++) { var a = p[0] + D[i][0], b = p[1] + D[i][1]; if (a >= 0 && a < cols && b >= 0 && b < rows && !m[b][a] && d[b][a] < 0) { d[b][a] = d[p[1]][p[0]] + 1; q.push([a, b]); } } }
      return d;
    }
    function gen() {
      var r, c; m = []; seen = [];
      for (r = 0; r < rows; r++) { m.push([]); seen.push([]); for (c = 0; c < cols; c++) { m[r].push(1); seen[r].push(0); } }
      var st2 = [[1, 1]]; m[1][1] = 0;
      while (st2.length) {
        var p = st2[st2.length - 1], D = [[2, 0], [-2, 0], [0, 2], [0, -2]], o = [];
        for (var i = 0; i < 4; i++) { var a = p[0] + D[i][0], b = p[1] + D[i][1]; if (a > 0 && a < cols - 1 && b > 0 && b < rows - 1 && m[b][a]) o.push(D[i]); }
        if (!o.length) { st2.pop(); continue; }
        var q = o[Math.floor(Math.random() * o.length)]; m[p[1] + q[1] / 2][p[0] + q[0] / 2] = 0; m[p[1] + q[1]][p[0] + q[0]] = 0; st2.push([p[0] + q[0], p[1] + q[1]]);
      }
      /* algumas paredes abertas para criar atalhos */
      for (i = 0; i < 6; i++) { c = 2 + Math.floor(Math.random() * (cols - 4)); r = 2 + Math.floor(Math.random() * (rows - 4)); if (m[r][c] && ((c % 2 === 0 && r % 2 === 1) || (c % 2 === 1 && r % 2 === 0))) m[r][c] = 0; }
      var d = bfs(1, 1), best = 0, cand = [];
      for (r = 0; r < rows; r++) for (c = 0; c < cols; c++) if (d[r][c] > best) { best = d[r][c]; ex = c; ey = r; }
      for (r = 0; r < rows; r++) for (c = 0; c < cols; c++) if (d[r][c] >= 8 && !(c === ex && r === ey)) cand.push([c, r]);
      keys = [];
      while (keys.length < 3 && cand.length) { var k = cand.splice(Math.floor(Math.random() * cand.length), 1)[0], far = true; keys.forEach(function (z) { if (Math.abs(z[0] - k[0]) + Math.abs(z[1] - k[1]) < 6) far = false; }); if (far) keys.push(k); }
    }
    function setup() { cols = api.w >= api.h ? 15 : 11; rows = api.w >= api.h ? 11 : 15; gen(); px = ox = 1; py = oy = 1; mv = null; tmr = LIM; got = 0; held = []; anc = null; ptr = null; pop = 0; glow = 0; }
    function reset() { setup(); st = 'play'; }
    function curDir() {
      var D = { ArrowLeft: [-1, 0], KeyA: [-1, 0], ArrowRight: [1, 0], KeyD: [1, 0], ArrowUp: [0, -1], KeyW: [0, -1], ArrowDown: [0, 1], KeyS: [0, 1] };
      if (held.length) return D[held[held.length - 1]];
      if (ptr && anc) { var dx = ptr[0] - anc[0], dy = ptr[1] - anc[1], l = Math.sqrt(dx * dx + dy * dy); if (l > 16) { if (l > 60) { anc[0] += dx * (l - 60) / l; anc[1] += dy * (l - 60) / l; } return Math.abs(dx) > Math.abs(dy) ? [dx > 0 ? 1 : -1, 0] : [0, dy > 0 ? 1 : -1]; } }
      return null;
    }
    function arrive() {
      for (var i = 0; i < keys.length; i++) if (keys[i][0] === px && keys[i][1] === py) { keys.splice(i, 1); got++; tmr = Math.min(LIM, tmr + 14); glow = 1; if (api.nota) api.nota(660, 0.12, 'triangle', 0.07); break; }
      if (px === ex && py === ey) st = 'win';
    }
    setup();
    return {
      pausar: function () { held = []; ptr = anc = null; },
      dbg: function () { return { st: st, m: m, px: px, py: py, ex: ex, ey: ey, keys: keys.map(function (k) { return k.slice(); }), got: got, moving: !!mv, nx: mv ? mv.tx : px, ny: mv ? mv.ty : py, tmr: tmr, cols: cols, rows: rows }; },
      down: function (x, y) { if (menu()) return; anc = [x, y]; ptr = [x, y]; },
      move: function (x, y, pr) { if (anc && pr !== false) ptr = [x, y]; },
      up: function () { anc = ptr = null; },
      key: function (c, d) { var i = held.indexOf(c); if (i >= 0) held.splice(i, 1); if (d) { if (st !== 'play') { menu(); return; } held.push(c); } },
      update: function (dt) {
        pop += dt; if (glow > 0) glow -= dt * 2;
        if (st !== 'play') return;
        tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; return; }
        if (mv) { mv.t += dt / STEP; if (mv.t >= 1) { px = mv.tx; py = mv.ty; mv = null; ox = px; oy = py; arrive(); } else { ox = px + (mv.tx - px) * mv.t; oy = py + (mv.ty - py) * mv.t; } }
        if (!mv && st === 'play') { var dd = curDir(); if (dd && !m[py + dd[1]][px + dd[0]]) mv = { tx: px + dd[0], ty: py + dd[1], t: 0 }; }
      },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), r, c, rad = 3.2 + got * 0.55 + (tmr < 12 ? -1.2 * (1 - tmr / 12) : 0);
        bg('#07060e', '#07060e');
        for (r = 0; r < rows; r++) for (c = 0; c < cols; c++) {
          var dx = c - ox, dy = r - oy, dd = Math.sqrt(dx * dx + dy * dy), a = 0;
          if (dd < rad) { seen[r][c] = 1; a = 1 - 0.85 * (dd / rad); } else if (seen[r][c]) a = 0.16;
          if (a <= 0) continue;
          g.globalAlpha = a; g.fillStyle = m[r][c] ? '#4a3f66' : '#2a2440'; g.fillRect(L.x + c * L.c, L.y + r * L.c, L.c + 0.5, L.c + 0.5);
          if (m[r][c]) { g.fillStyle = '#6a5c92'; g.fillRect(L.x + c * L.c, L.y + r * L.c, L.c + 0.5, L.c * 0.2); }
        }
        g.globalAlpha = 1;
        function vis(c2, r2) { var d2 = Math.sqrt((c2 - ox) * (c2 - ox) + (r2 - oy) * (r2 - oy)); return d2 < rad ? 1 - 0.7 * (d2 / rad) : (seen[r2][c2] ? 0.25 : 0); }
        var a2 = vis(ex, ey); if (a2 > 0) { g.globalAlpha = a2; g.fillStyle = '#8ae0a0'; rr(L.x + ex * L.c + L.c * 0.15, L.y + ey * L.c + L.c * 0.05, L.c * 0.7, L.c * 0.9, L.c * 0.3); g.fill(); g.fillStyle = '#12301c'; rr(L.x + ex * L.c + L.c * 0.3, L.y + ey * L.c + L.c * 0.3, L.c * 0.4, L.c * 0.65, L.c * 0.2); g.fill(); g.globalAlpha = 1; }
        keys.forEach(function (k) { var a3 = vis(k[0], k[1]); if (a3 <= 0.3) return; g.globalAlpha = a3; g.fillStyle = '#ffb347'; g.beginPath(); g.arc(L.x + k[0] * L.c + L.c / 2, L.y + k[1] * L.c + L.c / 2, L.c * (0.22 + 0.04 * Math.sin(pop * 6)), 0, 6.283); g.fill(); g.globalAlpha = 1; });
        var cx = L.x + ox * L.c + L.c / 2, cy = L.y + oy * L.c + L.c / 2;
        var gr = g.createRadialGradient(cx, cy, 2, cx, cy, rad * L.c); gr.addColorStop(0, 'rgba(255,200,110,' + (0.3 + glow * 0.3) + ')'); gr.addColorStop(1, 'rgba(255,200,110,0)'); g.fillStyle = gr; g.fillRect(L.x, L.y, cols * L.c, rows * L.c);
        g.fillStyle = '#f3ecd2'; g.beginPath(); g.arc(cx, cy, L.c * 0.3, 0, 6.283); g.fill(); g.fillStyle = '#ffb347'; g.beginPath(); g.arc(cx, cy - L.c * 0.28, L.c * 0.16 + Math.sin(pop * 14) * 1.2, 0, 6.283); g.fill();
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 15 ? '#c0392b' : '#ffb347');
        hud(T.h1 + ' ' + got + '/3', T.h2 + ' ' + Math.ceil(tmr), false);
        fim(st);
      }
    };
  }
});
