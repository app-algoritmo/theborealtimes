/* Érico em York — ligue todas as estradas ao ponto de partida. */
BTJogo.registrar({
  canvas: 'jogo-erico',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As estradas de York",
    "sub": "Toque numa peça para girá-la. Ligue todas as 25 peças ao ponto de partida, marcado com uma coroa, formando uma rede sem peças soltas. Tempo limitado.",
    "perdeu": "O tempo acabou",
    "v1": "Toda a rede está ligada!",
    "v2": "Érico governou York, no norte da Inglaterra, em 947–948 e 952–954. As estradas do jogo são invenção.",
    "h1": "Ligadas",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The roads of York",
    "sub": "Tap a piece to rotate it. Connect all 25 pieces to the starting point, marked with a crown, forming a network with no loose pieces. Time is limited.",
    "perdeu": "Time ran out",
    "v1": "The whole network is connected!",
    "v2": "Eric ruled York, in northern England, in 947–948 and 952–954. The roads in the game are made up.",
    "h1": "Linked",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Veiene i York",
    "sub": "Trykk på en brikke for å snu den. Knytt alle 25 brikkene til startpunktet, merket med en krone, slik at nettet ikke har løse brikker. Tiden er begrenset.",
    "perdeu": "Tiden gikk ut",
    "v1": "Hele nettet er forbundet!",
    "v2": "Eirik styrte York, i Nord-England, i 947–948 og 952–954. Veiene i spillet er diktet opp.",
    "h1": "Koblet",
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
    var N = 5, LIM = 150;
    var m = [], solm = [], tmr = LIM, pop = 0, SR = 2, SC = 2, cur = { r: 0, c: 0 };
    var DR = [[-1, 0, 1, 4], [0, 1, 2, 8], [1, 0, 4, 1], [0, -1, 8, 2]];
    function lay() { var W = api.w, H = api.h, cs = Math.max(40, Math.min((W - 24) / N, (H - 170) / N, 80)); return { cs: cs, x: (W - cs * N) / 2, y: Math.max(88, (H - cs * N) / 2 + 12) }; }
    function rot(v) { return ((v << 1) | (v >> 3)) & 15; }
    function gen() { var r, c, i; solm = []; for (r = 0; r < N; r++) solm.push(new Array(N).fill(0)); var seen = {}, st_ = [[Math.floor(Math.random() * N), Math.floor(Math.random() * N)]], edges = []; seen[st_[0].join()] = 1; var fr = [st_[0]];
      while (fr.length) { var k = Math.floor(Math.random() * fr.length), p = fr[k], nb = []; DR.forEach(function (d) { var a = p[0] + d[0], b = p[1] + d[1]; if (a >= 0 && b >= 0 && a < N && b < N && !seen[a + ',' + b]) nb.push([a, b, d]); }); if (!nb.length) { fr.splice(k, 1); continue; } var q = nb[Math.floor(Math.random() * nb.length)]; seen[q[0] + ',' + q[1]] = 1; solm[p[0]][p[1]] |= q[2][2]; solm[q[0]][q[1]] |= q[2][3]; fr.push([q[0], q[1]]); }
      m = solm.map(function (row) { return row.map(function (v) { var n = Math.floor(Math.random() * 4); while (n--) v = rot(v); return v; }); }); }
    function conn() { var vis = {}, q = [[SR, SC]]; vis[SR + ',' + SC] = 1; while (q.length) { var p = q.shift(); DR.forEach(function (d) { var a = p[0] + d[0], b = p[1] + d[1]; if (a < 0 || b < 0 || a >= N || b >= N || vis[a + ',' + b]) return; if ((m[p[0]][p[1]] & d[2]) && (m[a][b] & d[3])) { vis[a + ',' + b] = 1; q.push([a, b]); } }); } return vis; }
    function setup() { do { gen(); } while (Object.keys(conn()).length === N * N); tmr = LIM; }
    function reset() { setup(); st = 'play'; }
    function spin(r, c) { if (st !== 'play') return; m[r][c] = rot(m[r][c]); if (api.nota) api.nota(320, 0.03, 'triangle', 0.03); if (Object.keys(conn()).length === N * N) { st = 'win'; if (api.nota) api.nota(700, 0.2, 'triangle', 0.06); } }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, m: m.map(function (r) { return r.slice(); }), sol: solm.map(function (r) { return r.slice(); }), n: Object.keys(conn()).length, tmr: tmr, pos: function (r, c) { return { x: L.x + (c + 0.5) * L.cs, y: L.y + (r + 0.5) * L.cs }; } }; },
      down: function (x, y) { if (menu()) return; var L = lay(), c = Math.floor((x - L.x) / L.cs), r = Math.floor((y - L.y) / L.cs); if (r >= 0 && c >= 0 && r < N && c < N) { cur = { r: r, c: c }; spin(r, c); } },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'ArrowUp') cur.r = (cur.r + N - 1) % N; else if (k === 'ArrowDown') cur.r = (cur.r + 1) % N; else if (k === 'ArrowLeft') cur.c = (cur.c + N - 1) % N; else if (k === 'ArrowRight') cur.c = (cur.c + 1) % N; else if (k === 'Space' || k === 'Enter') spin(cur.r, cur.c); },
      update: function (dt) { pop += dt; if (st !== 'play') return; tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; } },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), r, c, vis = conn();
        bg('#1a2a1a', '#060c06');
        for (r = 0; r < N; r++) for (c = 0; c < N; c++) { var x = L.x + c * L.cs, y = L.y + r * L.cs, cx = x + L.cs / 2, cy = y + L.cs / 2, v = m[r][c], on = vis[r + ',' + c]; g.fillStyle = 'rgba(255,255,255,.05)'; g.fillRect(x + 1.5, y + 1.5, L.cs - 3, L.cs - 3);
          g.strokeStyle = on ? '#ffd88a' : '#8a8a8a'; g.lineWidth = L.cs * 0.14; g.lineCap = 'round'; DR.forEach(function (d) { if (v & d[2]) { g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + d[1] * L.cs / 2, cy + d[0] * L.cs / 2); g.stroke(); } });
          g.fillStyle = on ? '#ffd88a' : '#8a8a8a'; g.beginPath(); g.arc(cx, cy, L.cs * 0.11, 0, 6.283); g.fill();
          if (r === SR && c === SC) txt('♛', cx, cy + L.cs * 0.2, L.cs * 0.5, '#c0392b'); if (cur.r === r && cur.c === c && st === 'play') { g.strokeStyle = 'rgba(255,255,255,.3)'; g.lineWidth = 2; g.strokeRect(x + 3, y + 3, L.cs - 6, L.cs - 6); } }
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 30 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + Object.keys(vis).length + '/' + (N * N), T.h2 + ' ' + Math.ceil(tmr), false);
        fim(st);
      }
    };
  }
});
