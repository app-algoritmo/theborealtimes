/* Tesouro de Hoen — o colar de contas (invenção). */
BTJogo.registrar({
  canvas: 'jogo-hoen',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O colar de Hoen",
    "sub": "Enfie todas as contas num só fio. Comece na conta marcada com 1 e toque numa conta vizinha, acima, abaixo, à esquerda ou à direita, para estender o fio. Passe uma vez por cada casa e termine na conta final. Toque na última conta do fio para recuar, ou numa conta anterior para voltar até ela. O tempo é limitado. São 3 colares, cada um maior que o anterior.",
    "perdeu": "O tempo acabou",
    "v1": "Colar completo!",
    "v2": "O tesouro de Hoen foi achado em 1834, em Buskerud, na Noruega, com mais de cem contas; hoje está em Oslo. Enfiar contas num fio é invenção.",
    "h1": "Colar",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The Hoen necklace",
    "sub": "String all the beads on a single thread. Start at the bead marked 1 and tap a neighbouring bead, above, below, left or right, to extend the thread. Pass through every square once and finish at the final bead. Tap the last bead of the thread to step back, or an earlier bead to go back to it. Time is limited. There are 3 necklaces, each larger than the last.",
    "perdeu": "Time ran out",
    "v1": "Necklace complete!",
    "v2": "The Hoen hoard was found in 1834, in Buskerud, Norway, with more than a hundred beads; today it is in Oslo. Stringing beads on a thread is invented.",
    "h1": "Necklace",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Hoen-halskjedet",
    "sub": "Træ alle perlene på én tråd. Start ved perlen merket 1 og trykk på en nabo-perle, over, under, til venstre eller til høyre, for å forlenge tråden. Gå gjennom hver rute én gang og avslutt ved den siste perlen. Trykk på den siste perlen på tråden for å gå ett steg tilbake, eller på en tidligere perle for å gå tilbake til den. Tiden er begrenset. Det er 3 halskjeder, hvert større enn det forrige.",
    "perdeu": "Tiden tok slutt",
    "v1": "Halskjedet er ferdig!",
    "v2": "Hoen-skatten ble funnet i 1834 i Buskerud i Norge, med mer enn hundre perler; i dag ligger den i Oslo. Å træ perler på en tråd er oppfunnet.",
    "h1": "Halskjede",
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
    var NS = [[4, 5], [5, 5], [5, 6]], LIM = 360;
    var R = 4, C = 5, sol = [], path = [];
    function genPath(R0, C0) {
      var N = R0 * C0, p = [], r, c, it, k;
      for (r = 0; r < R0; r++) for (c = 0; c < C0; c++) p.push(r * C0 + (r % 2 ? C0 - 1 - c : c));
      for (it = 0; it < N * 30; it++) {
        if (Math.random() < 0.5) p.reverse();
        var h = p[0], hx = h % C0, hy = Math.floor(h / C0), ns = [], j;
        for (j = 2; j < N; j++) { var q = p[j], qx = q % C0, qy = Math.floor(q / C0); if (Math.abs(qx - hx) + Math.abs(qy - hy) === 1) ns.push(j); }
        if (ns.length) { j = ns[Math.floor(Math.random() * ns.length)]; p = p.slice(0, j).reverse().concat(p.slice(j)); }
      }
      return p;
    }
    function load(i) { R = NS[i][0]; C = NS[i][1]; sol = genPath(R, C); path = [sol[0]]; }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function adj(a, b) { return Math.abs(a % C - b % C) + Math.abs(Math.floor(a / C) - Math.floor(b / C)) === 1; }
    function tap(i) {
      if (pend > 0 || st !== 'play') return; var k = path.indexOf(i);
      if (k >= 0) { if (k === path.length - 1) { if (path.length > 1) path.pop(); } else path.length = k + 1; return; }
      if (!adj(path[path.length - 1], i)) return;
      if (i === sol[sol.length - 1] && path.length < R * C - 1) return;
      path.push(i); if (api.nota) api.nota(300 + path.length * 12, 0.04, 'square', 0.03);
      if (path.length === R * C) lvlUp();
    }
    function pos() { var L = glay(R, C, 70, 30), a = []; for (var i = 0; i < R * C; i++) a.push({ x: L.x0 + (i % C + 0.5) * L.s, y: L.y0 + (Math.floor(i / C) + 0.5) * L.s }); return a; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lvl: lvl, pend: pend, sol: sol.slice(), len: path.length, pos: pos() }; },
      down: function (x, y) { if (menu()) return; var L = glay(R, C, 70, 30), c = Math.floor((x - L.x0) / L.s), r = Math.floor((y - L.y0) / L.s); if (c < 0 || r < 0 || c >= C || r >= R) return; tap(r * C + c); },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) { tick(dt, load); },
      draw: function () {
        var L = glay(R, C, 70, 30), s = L.s, ps = pos(), i; bg('#3a2a1a', '#120c06');
        for (i = 0; i < R * C; i++) { g.fillStyle = path.indexOf(i) >= 0 ? 'rgba(224,176,64,.22)' : 'rgba(255,255,255,.07)'; rr(L.x0 + (i % C) * s + 2, L.y0 + Math.floor(i / C) * s + 2, s - 4, s - 4, 8); g.fill(); }
        g.strokeStyle = '#e0b040'; g.lineWidth = Math.max(4, s * 0.16); g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath();
        for (i = 0; i < path.length; i++) { if (i) g.lineTo(ps[path[i]].x, ps[path[i]].y); else g.moveTo(ps[path[i]].x, ps[path[i]].y); } g.stroke();
        for (i = 0; i < path.length; i++) { g.fillStyle = '#f0cd6a'; g.beginPath(); g.arc(ps[path[i]].x, ps[path[i]].y, s * 0.17, 0, 7); g.fill(); }
        var e = sol[sol.length - 1]; g.fillStyle = path.indexOf(e) >= 0 ? '#f0cd6a' : '#5a8fb0'; g.beginPath(); g.arc(ps[e].x, ps[e].y, s * 0.26, 0, 7); g.fill(); txt(String(R * C), ps[e].x, ps[e].y + 1, Math.max(11, s * 0.3), '#10151c');
        g.fillStyle = '#f0cd6a'; g.beginPath(); g.arc(ps[sol[0]].x, ps[sol[0]].y, s * 0.26, 0, 7); g.fill(); txt('1', ps[sol[0]].x, ps[sol[0]].y + 1, Math.max(11, s * 0.3), '#10151c');
        txt(path.length + '/' + R * C, api.w - 40, 22, 14, '#c9b3f2');
        foot(); hh(); fim(st);
      }
    };

  }
});
