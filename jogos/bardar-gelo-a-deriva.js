/* Bárðar saga Snæfellsáss — o gelo à deriva (invenção). */
BTJogo.registrar({
  canvas: 'jogo-bardar',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O gelo à deriva",
    "sub": "Você está sobre o gelo e, quando se move, escorrega em linha reta até bater numa pedra ou na borda. Toque na direção em que quer escorregar, em relação a você. Passe pelo buraco de pesca para parar nele e vencer. O número de deslizes e o tempo são limitados. São 3 campos de gelo.",
    "perdeu": "Os deslizes ou o tempo acabaram",
    "v1": "Chegou ao buraco!",
    "v2": "Na Bárðar saga Snæfellsáss, Helga é empurrada para o mar sobre um bloco de gelo e vai parar na Groenlândia. Bárðr some na geleira Snæfellsjökull e passa a ser lembrado como espírito guardião da península. Escorregar no gelo é invenção.",
    "h1": "Campo",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The drifting ice",
    "sub": "You stand on the ice and, when you move, you slide in a straight line until you hit a rock or the edge. Tap in the direction you want to slide, relative to yourself. Pass over the fishing hole to stop in it and win. The number of slides and the time are limited. There are 3 ice fields.",
    "perdeu": "The slides or the time ran out",
    "v1": "You reached the hole!",
    "v2": "In Bárðar saga Snæfellsáss, Helga is pushed out to sea on a block of ice and ends up in Greenland. Bárðr vanishes into the Snæfellsjökull glacier and comes to be remembered as a guardian spirit of the peninsula. Sliding on ice is invented.",
    "h1": "Field",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Isen som driver",
    "sub": "Du står på isen, og når du beveger deg, glir du rett frem til du treffer en stein eller kanten. Trykk i retningen du vil gli, sett fra deg selv. Gli over fiskehullet for å stoppe i det og vinne. Antall glid og tiden er begrenset. Det er 3 isflater.",
    "perdeu": "Glidene eller tiden tok slutt",
    "v1": "Du nådde hullet!",
    "v2": "I Bárðar saga Snæfellsáss blir Helga skjøvet ut på havet på en isblokk og havner på Grønland. Bárðr forsvinner inn i breen Snæfellsjökull og blir husket som en vokterånd for halvøya. Å gli på is er oppfunnet.",
    "h1": "Flate",
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
    var NS = [6, 7, 8], MIN = [4, 5, 6], NL = 3, LIM = 300, DXY = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    var lvl = 0, n = 0, rock = [], p = 0, goal = 0, sol = [], lim = 0, moves = 0, t = 0, pend = 0;
    function slide(q, d) {
      var x = q % n, y = (q / n) | 0;
      for (;;) { var nx = x + DXY[d][0], ny = y + DXY[d][1]; if (nx < 0 || ny < 0 || nx >= n || ny >= n || rock[ny * n + nx]) break; x = nx; y = ny; if (y * n + x === goal) break; }
      return y * n + x;
    }
    function bfs(s) {
      var seen = {}, q = [[s, []]]; seen[s] = 1;
      while (q.length) { var c = q.shift(); if (c[0] === goal) return c[1]; for (var d = 0; d < 4; d++) { var nq = slide(c[0], d); if (seen[nq]) continue; seen[nq] = 1; q.push([nq, c[1].concat([d])]); } }
      return null;
    }
    function load(i) {
      n = NS[i];
      for (;;) {
        var k; rock = []; for (k = 0; k < n * n; k++) rock[k] = Math.random() < 0.22 ? 1 : 0;
        p = (Math.random() * n * n) | 0; goal = (Math.random() * n * n) | 0; if (rock[p] || rock[goal] || p === goal) continue;
        var r = bfs(p); if (r && r.length >= MIN[i] && r.length <= MIN[i] + 3) { sol = r; break; }
      }
      lim = sol.length + 4; moves = 0;
    }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function lay() { var W = api.w, H = api.h, cs = Math.min((W - 30) / NS[2], (H - 150) / NS[2], 60); return { cs: cs, x0: (W - n * cs) / 2, y0: 78 }; }
    function ppos() { var L = lay(); return { x: L.x0 + (p % n) * L.cs + L.cs / 2, y: L.y0 + ((p / n) | 0) * L.cs + L.cs / 2 }; }
    function dpos() { var q = ppos(); return [{ x: q.x, y: q.y - 80 }, { x: q.x + 80, y: q.y }, { x: q.x, y: q.y + 80 }, { x: q.x - 80, y: q.y }]; }
    function go(d) {
      if (st !== 'play' || pend > 0) return; var np = slide(p, d); if (np === p) return; p = np; moves++; if (api.nota) api.nota(200, 0.08, 'sine', 0.04);
      if (p === goal) { lvl++; pend = 0.9; if (api.nota) api.nota(520, 0.2, 'triangle', 0.07); } else if (moves >= lim) st = 'lose';
    }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lvl: lvl, sol: sol.slice(), moves: moves, lim: lim, dpos: dpos(), pend: pend, p: p }; },
      down: function (x, y) { if (menu()) return; var q = ppos(), dx = x - q.x, dy = y - q.y; go(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0)); },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') { menu(); return; } if (!d) return; var m = { ArrowUp: 0, ArrowRight: 1, ArrowDown: 2, ArrowLeft: 3 }[k]; if (m !== undefined) go(m); },
      update: function (dt) {
        if (st !== 'play') return; t += dt;
        if (pend > 0) { pend -= dt; if (pend <= 0) { if (lvl >= NL) st = 'win'; else load(lvl); } }
        if (st === 'play' && t >= LIM) st = 'lose';
      },
      draw: function () {
        var L = lay(), k; bg('#1c3040', '#060d14');
        for (k = 0; k < n * n; k++) {
          var x = L.x0 + (k % n) * L.cs, y = L.y0 + ((k / n) | 0) * L.cs;
          g.fillStyle = rock[k] ? '#4a5560' : 'rgba(190,225,245,.22)'; rr(x + 1.5, y + 1.5, L.cs - 3, L.cs - 3, rock[k] ? 10 : 6); g.fill();
          if (k === goal) { g.strokeStyle = '#0a1620'; g.fillStyle = '#0a1620'; g.beginPath(); g.arc(x + L.cs / 2, y + L.cs / 2, L.cs * 0.3, 0, 6.2832); g.fill(); g.strokeStyle = '#ffd88a'; g.lineWidth = 2; g.stroke(); }
        }
        var q = ppos(); g.fillStyle = '#f3ecd2'; g.beginPath(); g.arc(q.x, q.y, L.cs * 0.27, 0, 6.2832); g.fill(); g.fillStyle = '#c0392b'; g.beginPath(); g.arc(q.x, q.y, L.cs * 0.1, 0, 6.2832); g.fill();
        txt(moves + '/' + lim, api.w / 2, L.y0 + n * L.cs + 28, 18, moves >= lim - 1 ? '#ff9a8d' : '#f3ecd2');
        bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 60 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + Math.min(lvl + 1, NL) + '/' + NL, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };

  }
});
