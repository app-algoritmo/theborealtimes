/* Naglfar — desenrede as cordas do navio das unhas (invenção). */
BTJogo.registrar({
  canvas: 'jogo-naglfar',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As cordas de Naglfar",
    "sub": "As cordas do navio estão embaraçadas. Arraste cada nó (com o dedo ou o mouse) para outro lugar até que nenhuma corda cruze outra. As cordas cruzadas aparecem em vermelho. São 3 fases, e o tempo é limitado.",
    "perdeu": "O tempo acabou antes de as cordas ficarem soltas",
    "v1": "As cordas estão livres!",
    "v2": "Naglfar é o navio feito das unhas dos mortos que, no Ragnarök, leva monstros ao campo de batalha. Desembaraçar as cordas é invenção.",
    "h1": "Fase",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The ropes of Naglfar",
    "sub": "The ship’s ropes are tangled. Drag each knot (with a finger or the mouse) somewhere else until no rope crosses another. Crossing ropes show in red. There are 3 levels, and time is limited.",
    "perdeu": "Time ran out before the ropes were free",
    "v1": "The ropes are free!",
    "v2": "Naglfar is the ship made from the nails of the dead which, at Ragnarök, carries monsters to the battlefield. Untangling the ropes is invented.",
    "h1": "Level",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Naglfars tau",
    "sub": "Skipets tau er floket sammen. Dra hver knute (med fingeren eller musen) til et annet sted til ingen tau krysser et annet. Kryssende tau vises i rødt. Det er 3 brett, og tiden er begrenset.",
    "perdeu": "Tiden gikk ut før taudragene ble frie",
    "v1": "Taudragene er frie!",
    "v2": "Naglfar er skipet laget av neglene til de døde, som ved Ragnarok fører monstre til slagmarken. Å greie ut tauene er oppfunnet.",
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
    var LV = [7, 9, 11], NL = 3, LIM = 420;
    var lvl = 0, n = 0, P = [], TP = [], E = [], drag = -1, t = 0, pend = 0, cr = 0, bad = [];
    function ccw(a, b, c) { return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x); }
    function inter(a, b, c, d) { var d1 = ccw(a, b, c), d2 = ccw(a, b, d), d3 = ccw(c, d, a), d4 = ccw(c, d, b); return ((d1 > 0) !== (d2 > 0)) && ((d3 > 0) !== (d4 > 0)) && d1 !== 0 && d2 !== 0 && d3 !== 0 && d4 !== 0; }
    function crosses(Q, e, f) { if (e[0] === f[0] || e[0] === f[1] || e[1] === f[0] || e[1] === f[1]) return false; return inter(Q[e[0]], Q[e[1]], Q[f[0]], Q[f[1]]); }
    function count(Q) { var c = 0, i, j; bad = []; for (i = 0; i < E.length; i++) bad[i] = false; for (i = 0; i < E.length; i++) for (j = i + 1; j < E.length; j++) if (crosses(Q, E[i], E[j])) { c++; bad[i] = bad[j] = true; } return c; }
    function conn(nn, ed) { var seen = { 0: 1 }, q = [0], k; while (q.length) { var v = q.pop(); ed.forEach(function (e) { var w = e[0] === v ? e[1] : e[1] === v ? e[0] : -1; if (w >= 0 && !seen[w]) { seen[w] = 1; q.push(w); } }); } return Object.keys(seen).length === nn; }
    function gen(i) {
      n = LV[i];
      for (var tries = 0; tries < 400; tries++) {
        var Q = [], k, j;
        for (k = 0; k < n; k++) { var p, ok, w = 0; do { p = { x: 0.08 + Math.random() * 0.84, y: 0.08 + Math.random() * 0.84 }; ok = true; Q.forEach(function (q) { if (Math.hypot(q.x - p.x, q.y - p.y) < 0.17) ok = false; }); w++; } while (!ok && w < 60); Q.push(p); }
        var pr = []; for (k = 0; k < n; k++) for (j = k + 1; j < n; j++) pr.push([k, j, Math.hypot(Q[k].x - Q[j].x, Q[k].y - Q[j].y)]);
        pr.sort(function (a, b) { return a[2] - b[2]; });
        var ed = []; for (k = 0; k < pr.length && ed.length < Math.round(n * 1.6); k++) { var e = [pr[k][0], pr[k][1]], okk = true; ed.forEach(function (f) { if (crosses(Q, e, f)) okk = false; }); if (okk) ed.push(e); }
        if (!conn(n, ed)) continue;
        var perm = []; for (k = 0; k < n; k++) perm.push(k); perm.sort(function () { return Math.random() - 0.5; });
        var S = []; for (k = 0; k < n; k++) { var an = perm[k] / n * 6.2832; S[k] = { x: 0.5 + 0.4 * Math.cos(an), y: 0.5 + 0.4 * Math.sin(an) }; }
        E = ed; if (count(S) >= 4) { TP = Q; P = S; count(P); return; }
      }
    }
    function reset() { lvl = 0; t = 0; pend = 0; drag = -1; gen(0); st = 'play'; }
    function lay() { var W = api.w, H = api.h, s = Math.min(W - 24, H - 130); return { x0: (W - s) / 2, y0: 70, s: s }; }
    function px(p) { var L = lay(); return { x: L.x0 + p.x * L.s, y: L.y0 + p.y * L.s }; }
    reset(); st = 'menu';
    return {
      pausar: function () { drag = -1; },
      dbg: function () { return { st: st, lvl: lvl, n: n, cross: cr, t: t, pos: P.map(px), tpos: TP.map(px) }; },
      down: function (x, y) {
        if (menu()) return; if (pend > 0) return; var best = -1, bd = 34, i;
        for (i = 0; i < n; i++) { var p = px(P[i]), d = Math.hypot(p.x - x, p.y - y); if (d < bd) { bd = d; best = i; } } drag = best;
      },
      move: function (x, y) {
        if (drag < 0 || st !== 'play') return; var L = lay();
        P[drag] = { x: Math.max(0.03, Math.min(0.97, (x - L.x0) / L.s)), y: Math.max(0.03, Math.min(0.97, (y - L.y0) / L.s)) };
        cr = count(P);
      },
      up: function () { if (drag >= 0 && st === 'play') { cr = count(P); if (cr === 0) { lvl++; pend = 0.9; if (api.nota) api.nota(520, 0.2, 'triangle', 0.07); } } drag = -1; },
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) {
        if (st !== 'play') return; t += dt;
        if (pend > 0) { pend -= dt; if (pend <= 0) { if (lvl >= NL) st = 'win'; else gen(lvl); } }
        if (st === 'play' && t >= LIM) st = 'lose';
      },
      draw: function () {
        var i; bg('#10202a', '#050b10'); cr = count(P);
        for (i = 0; i < E.length; i++) { var a = px(P[E[i][0]]), b = px(P[E[i][1]]); g.strokeStyle = bad[i] ? '#ff7a6a' : '#cdb98a'; g.lineWidth = bad[i] ? 3 : 2.5; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke(); }
        for (i = 0; i < n; i++) { var p = px(P[i]); g.fillStyle = i === drag ? '#ffd88a' : '#e8e2cf'; g.beginPath(); g.arc(p.x, p.y, 13, 0, 6.2832); g.fill(); g.strokeStyle = 'rgba(0,0,0,.5)'; g.lineWidth = 2; g.stroke(); }
        bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 60 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + Math.min(lvl + 1, NL) + '/' + NL, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };

  }
});
