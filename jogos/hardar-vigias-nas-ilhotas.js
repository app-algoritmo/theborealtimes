/* Harðar saga — os vigias de cada ilhota (invenção). */
BTJogo.registrar({
  canvas: 'jogo-hardar',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os vigias das ilhotas",
    "sub": "O quadro está dividido em ilhotas de cores diferentes. Ponha um vigia em cada ilhota, com um só vigia por linha e por coluna, e sem que dois vigias se toquem, nem na diagonal. Toque numa casa para pôr ou tirar um vigia. Vigias em conflito ficam com um aro vermelho. São 3 quadros, e o tempo é limitado.",
    "perdeu": "O tempo acabou antes de os vigias estarem no lugar",
    "v1": "Todas as ilhotas vigiadas!",
    "v2": "Na Harðar saga ok Hólmverja, Hörðr e seus companheiros, fora da lei, se refugiam numa ilhota do Hvalfjörður, que passa a se chamar Geirshólm. Os vigias deste quadro são invenção.",
    "h1": "Quadro",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The lookouts of the islets",
    "sub": "The board is divided into islets of different colours. Place one lookout on each islet, with only one lookout per row and per column, and no two lookouts touching, not even diagonally. Tap a square to place or remove a lookout. Lookouts in conflict get a red ring. There are 3 boards, and time is limited.",
    "perdeu": "Time ran out before the lookouts were in place",
    "v1": "Every islet watched!",
    "v2": "In Harðar saga ok Hólmverja, Hörðr and his companions, outlaws, take refuge on an islet in Hvalfjörður, which comes to be called Geirshólm. The lookouts on this board are invented.",
    "h1": "Board",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Vaktene på holmene",
    "sub": "Brettet er delt inn i holmer med ulike farger. Sett én vakt på hver holme, med bare én vakt per rad og per kolonne, og uten at to vakter berører hverandre, heller ikke på skrå. Trykk på en rute for å sette eller fjerne en vakt. Vakter i konflikt får en rød ring. Det er 3 brett, og tiden er begrenset.",
    "perdeu": "Tiden gikk ut før vaktene sto på plass",
    "v1": "Alle holmene er vaktet!",
    "v2": "I Harðar saga ok Hólmverja tar Hörðr og følgesvennene hans, fredløse, tilflukt på en holme i Hvalfjörður, som kommer til å hete Geirshólm. Vaktene på dette brettet er oppfunnet.",
    "h1": "Brett",
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
    var LV = [5, 6, 7], NL = 3, LIM = 480, PAL = ['#4e7fa8', '#a8774e', '#6f9a5c', '#9a5c8a', '#b0a04e', '#5c9a96', '#b06a6a'];
    var lvl = 0, n = 0, reg = [], q = [], sol = [], t = 0, pend = 0, bad = [];
    function count(regs, nn) {
      var cols = [], used = [], rg = [], c = 0;
      (function go(r) {
        if (c > 1) return; if (r === nn) { c++; return; }
        for (var x = 0; x < nn; x++) { if (used[x]) continue; var rid = regs[r * nn + x]; if (rg[rid]) continue; if (r > 0 && Math.abs(cols[r - 1] - x) < 2) continue; used[x] = true; rg[rid] = true; cols[r] = x; go(r + 1); used[x] = false; rg[rid] = false; }
      })(0); return c;
    }
    function gen(i) {
      n = LV[i];
      for (var tries = 0; tries < 40000; tries++) {
        var p = [], k, ok = true; for (k = 0; k < n; k++) p.push(k); p.sort(function () { return Math.random() - 0.5; });
        for (k = 1; k < n; k++) if (Math.abs(p[k] - p[k - 1]) < 2) ok = false; if (!ok) continue;
        var R = []; for (k = 0; k < n * n; k++) R.push(-1); var fr = [];
        for (k = 0; k < n; k++) { R[k * n + p[k]] = k; }
        var cells = n; while (cells < n * n) {
          var cand = [], c; for (c = 0; c < n * n; c++) if (R[c] < 0) { var x = c % n, y = (c / n) | 0, nb = []; if (x > 0 && R[c - 1] >= 0) nb.push(R[c - 1]); if (x < n - 1 && R[c + 1] >= 0) nb.push(R[c + 1]); if (y > 0 && R[c - n] >= 0) nb.push(R[c - n]); if (y < n - 1 && R[c + n] >= 0) nb.push(R[c + n]); if (nb.length) cand.push([c, nb[(Math.random() * nb.length) | 0]]); }
          var pick = cand[(Math.random() * cand.length) | 0]; R[pick[0]] = pick[1]; cells++;
        }
        if (count(R, n) === 1) { reg = R; sol = p; q = []; for (k = 0; k < n * n; k++) q.push(0); return; }
      }
      reg = []; for (var z = 0; z < n * n; z++) reg.push(((z / n) | 0)); sol = []; for (z = 0; z < n; z++) sol.push(z); q = []; for (z = 0; z < n * n; z++) q.push(0);
    }
    function conflicts() {
      var cs = [], i, j; bad = []; for (i = 0; i < n * n; i++) { bad[i] = false; if (q[i]) cs.push(i); }
      for (i = 0; i < cs.length; i++) for (j = i + 1; j < cs.length; j++) { var a = cs[i], b = cs[j], ax = a % n, ay = (a / n) | 0, bx = b % n, by = (b / n) | 0; if (ax === bx || ay === by || reg[a] === reg[b] || (Math.abs(ax - bx) < 2 && Math.abs(ay - by) < 2)) { bad[a] = bad[b] = true; } }
      return cs.length;
    }
    function check() { var c = conflicts(), i; if (c !== n) return false; for (i = 0; i < n * n; i++) if (bad[i]) return false; return true; }
    function reset() { lvl = 0; t = 0; pend = 0; gen(0); st = 'play'; }
    function lay() { var W = api.w, H = api.h, s = Math.min((W - 20) / n, (H - 130) / n, 64); return { s: s, x0: (W - s * n) / 2, y0: 72 }; }
    function cc(i) { var L = lay(); return { x: L.x0 + (i % n) * L.s + L.s / 2, y: L.y0 + ((i / n) | 0) * L.s + L.s / 2 }; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { var p = [], i; for (i = 0; i < n * n; i++) p.push(cc(i)); return { st: st, lvl: lvl, n: n, q: q.slice(), sol: sol.slice(), pos: p, t: t, pend: pend }; },
      down: function (x, y) {
        if (menu()) return; if (pend > 0) return; var L = lay(), c = Math.floor((x - L.x0) / L.s), r = Math.floor((y - L.y0) / L.s);
        if (c < 0 || c >= n || r < 0 || r >= n) return; var i = r * n + c; q[i] = q[i] ? 0 : 1; if (api.nota) api.nota(q[i] ? 320 : 220, 0.05, 'square', 0.03);
        if (check()) { lvl++; pend = 0.9; if (api.nota) api.nota(520, 0.2, 'triangle', 0.07); }
      },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) {
        if (st !== 'play') return; t += dt;
        if (pend > 0) { pend -= dt; if (pend <= 0) { if (lvl >= NL) st = 'win'; else gen(lvl); } }
        if (st === 'play' && t >= LIM) st = 'lose';
      },
      draw: function () {
        var L = lay(), i; bg('#122430', '#050c12'); conflicts();
        for (i = 0; i < n * n; i++) {
          var x = L.x0 + (i % n) * L.s, y = L.y0 + ((i / n) | 0) * L.s, c = i % n, r = (i / n) | 0;
          g.fillStyle = PAL[reg[i] % PAL.length]; g.fillRect(x, y, L.s, L.s);
          g.strokeStyle = 'rgba(0,0,0,.55)'; g.lineWidth = 3;
          if (c < n - 1 && reg[i + 1] !== reg[i]) { g.beginPath(); g.moveTo(x + L.s, y); g.lineTo(x + L.s, y + L.s); g.stroke(); }
          if (r < n - 1 && reg[i + n] !== reg[i]) { g.beginPath(); g.moveTo(x, y + L.s); g.lineTo(x + L.s, y + L.s); g.stroke(); }
          g.strokeStyle = 'rgba(255,255,255,.12)'; g.lineWidth = 1; g.strokeRect(x, y, L.s, L.s);
          if (q[i]) { var p = cc(i); g.fillStyle = '#f3ecd2'; g.beginPath(); g.arc(p.x, p.y, L.s * 0.28, 0, 6.2832); g.fill(); g.fillStyle = '#1c2230'; g.beginPath(); g.arc(p.x, p.y, L.s * 0.12, 0, 6.2832); g.fill(); if (bad[i]) { g.strokeStyle = '#ff5a4a'; g.lineWidth = 4; g.beginPath(); g.arc(p.x, p.y, L.s * 0.36, 0, 6.2832); g.stroke(); } }
        }
        bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 60 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + Math.min(lvl + 1, NL) + '/' + NL, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };

  }
});
