/* Emma da Normandia — ligue as cidades com o menor custo (invenção). */
BTJogo.registrar({
  canvas: 'jogo-emma',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As estradas da rainha",
    "sub": "Toque numa estrada para construí-la ou desfazê-la. Cada estrada tem um custo. Ligue todas as cidades umas às outras, direta ou indiretamente, sem gastar mais do que o orçamento. São 3 mapas, e o tempo é limitado.",
    "perdeu": "O tempo acabou antes de as cidades serem ligadas",
    "v1": "Todas as cidades ligadas!",
    "v2": "Emma da Normandia foi rainha da Inglaterra duas vezes: casou-se com Æthelred em 1002 e com Cnut em 1017. Planejar estradas ao menor custo é invenção.",
    "h1": "Mapa",
    "h2": "Tempo",
    "orc": "Orçamento",
    "gasto": "Gasto"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The queen’s roads",
    "sub": "Tap a road to build it or undo it. Each road has a cost. Link all the towns to one another, directly or indirectly, without spending more than the budget. There are 3 maps, and time is limited.",
    "perdeu": "Time ran out before the towns were linked",
    "v1": "Every town linked!",
    "v2": "Emma of Normandy was queen of England twice: she married Æthelred in 1002 and Cnut in 1017. Planning roads at the lowest cost is invented.",
    "h1": "Map",
    "h2": "Time",
    "orc": "Budget",
    "gasto": "Spent"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Dronningens veier",
    "sub": "Trykk på en vei for å bygge den eller angre den. Hver vei har en kostnad. Knytt alle byene sammen, direkte eller indirekte, uten å bruke mer enn budsjettet. Det er 3 kart, og tiden er begrenset.",
    "perdeu": "Tiden gikk ut før byene var knyttet sammen",
    "v1": "Alle byene er knyttet sammen!",
    "v2": "Emma av Normandie var dronning av England to ganger: hun giftet seg med Æthelred i 1002 og med Knut i 1017. Å planlegge veier til lavest mulig pris er oppfunnet.",
    "h1": "Kart",
    "h2": "Tid",
    "orc": "Budsjett",
    "gasto": "Brukt"
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
    var LV = [6, 7, 8], NL = 3, LIM = 360;
    var lvl = 0, P = [], E = [], built = [], mst = [], budget = 0, t = 0, pend = 0;
    function segd(p, a, b) { var dx = b.x - a.x, dy = b.y - a.y, l = dx * dx + dy * dy, u = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / l)); return Math.hypot(p.x - (a.x + u * dx), p.y - (a.y + u * dy)); }
    function ccw(a, b, c) { return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x); }
    function crs(a, b, c, d) { return ((ccw(a, b, c) > 0) !== (ccw(a, b, d) > 0)) && ((ccw(c, d, a) > 0) !== (ccw(c, d, b) > 0)); }
    function find(u, x) { while (u[x] !== x) x = u[x]; return x; }
    function gen(i) {
      var n = LV[i];
      for (var tries = 0; tries < 300; tries++) {
        var Q = [], k, j, w;
        for (k = 0; k < n; k++) { var p, ok; w = 0; do { p = { x: 0.08 + Math.random() * 0.84, y: 0.08 + Math.random() * 0.84 }; ok = true; Q.forEach(function (q) { if (Math.hypot(q.x - p.x, q.y - p.y) < 0.2) ok = false; }); w++; } while (!ok && w < 80); Q.push(p); }
        var pr = []; for (k = 0; k < n; k++) for (j = k + 1; j < n; j++) pr.push([k, j, Math.hypot(Q[k].x - Q[j].x, Q[k].y - Q[j].y)]); pr.sort(function (a, b) { return a[2] - b[2]; });
        var ed = []; pr.forEach(function (e) { if (ed.length >= Math.round(n * 1.9)) return; var ok2 = true, m; for (m = 0; m < n; m++) if (m !== e[0] && m !== e[1] && segd(Q[m], Q[e[0]], Q[e[1]]) < 0.07) ok2 = false; ed.forEach(function (f) { if (f[0] !== e[0] && f[0] !== e[1] && f[1] !== e[0] && f[1] !== e[1] && crs(Q[e[0]], Q[e[1]], Q[f[0]], Q[f[1]])) ok2 = false; }); if (ok2) ed.push([e[0], e[1], 0]); });
        var u = []; for (k = 0; k < n; k++) u.push(k); ed.forEach(function (e) { u[find(u, e[0])] = find(u, e[1]); }); var one = true; for (k = 1; k < n; k++) if (find(u, k) !== find(u, 0)) one = false; if (!one) continue;
        var costs = []; for (k = 3; k <= 40; k++) costs.push(k); costs.sort(function () { return Math.random() - 0.5; }); ed.forEach(function (e, idx) { e[2] = costs[idx]; });
        var ord = ed.map(function (e, idx) { return idx; }).sort(function (a, b) { return ed[a][2] - ed[b][2]; }), u2 = []; for (k = 0; k < n; k++) u2.push(k);
        var ms = [], tot = 0; ord.forEach(function (idx) { var a = find(u2, ed[idx][0]), b = find(u2, ed[idx][1]); if (a !== b) { u2[a] = b; ms.push(idx); tot += ed[idx][2]; } });
        P = Q; E = ed; mst = ms; budget = tot; built = ed.map(function () { return 0; }); return;
      }
    }
    function spent() { var s = 0; E.forEach(function (e, k) { if (built[k]) s += e[2]; }); return s; }
    function linked() { var u = [], k; for (k = 0; k < P.length; k++) u.push(k); E.forEach(function (e, idx) { if (built[idx]) u[find(u, e[0])] = find(u, e[1]); }); for (k = 1; k < P.length; k++) if (find(u, k) !== find(u, 0)) return false; return true; }
    function reset() { lvl = 0; t = 0; pend = 0; gen(0); st = 'play'; }
    function lay() { var W = api.w, H = api.h, s = Math.min(W - 24, H - 140); return { x0: (W - s) / 2, y0: 72, s: s }; }
    function px(p) { var L = lay(); return { x: L.x0 + p.x * L.s, y: L.y0 + p.y * L.s }; }
    function mid(k) { var a = px(P[E[k][0]]), b = px(P[E[k][1]]); return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lvl: lvl, n: P.length, E: E.map(function (e) { return e.slice(); }), built: built.slice(), mst: mst.slice(), budget: budget, pos: E.map(function (e, k) { return mid(k); }), t: t, pend: pend }; },
      down: function (x, y) {
        if (menu()) return; if (pend > 0) return; var best = -1, bd = 26, k;
        for (k = 0; k < E.length; k++) { var m = mid(k), d = Math.min(segd({ x: x, y: y }, px(P[E[k][0]]), px(P[E[k][1]])), Math.hypot(m.x - x, m.y - y)); if (d < bd) { bd = d; best = k; } }
        if (best < 0) return; built[best] = built[best] ? 0 : 1; if (api.nota) api.nota(built[best] ? 330 : 220, 0.05, 'square', 0.03);
        if (linked() && spent() <= budget) { lvl++; pend = 0.9; if (api.nota) api.nota(520, 0.2, 'triangle', 0.07); }
      },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) {
        if (st !== 'play') return; t += dt;
        if (pend > 0) { pend -= dt; if (pend <= 0) { if (lvl >= NL) st = 'win'; else gen(lvl); } }
        if (st === 'play' && t >= LIM) st = 'lose';
      },
      draw: function () {
        var i, L = lay(); bg('#1a2418', '#070a06');
        for (i = 0; i < E.length; i++) { var a = px(P[E[i][0]]), b = px(P[E[i][1]]); g.strokeStyle = built[i] ? '#e8c46a' : 'rgba(255,255,255,.25)'; g.lineWidth = built[i] ? 5 : 2; if (!built[i]) { g.setLineDash && g.setLineDash([6, 5]); } g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke(); g.setLineDash && g.setLineDash([]); }
        for (i = 0; i < E.length; i++) { var m = mid(i); g.fillStyle = built[i] ? '#e8c46a' : 'rgba(20,26,18,.95)'; g.beginPath(); g.arc(m.x, m.y, 13, 0, 6.2832); g.fill(); g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 1; g.stroke(); txt(String(E[i][2]), m.x, m.y + 1, 13, built[i] ? '#1c2230' : '#f3ecd2'); }
        for (i = 0; i < P.length; i++) { var p = px(P[i]); g.fillStyle = '#9ec0e8'; g.beginPath(); g.arc(p.x, p.y, 10, 0, 6.2832); g.fill(); g.strokeStyle = '#10141c'; g.lineWidth = 3; g.stroke(); }
        var sp = spent(); txt(T.gasto + ' ' + sp + ' / ' + T.orc + ' ' + budget, api.w / 2, L.y0 + L.s + 20, 15, sp > budget ? '#ff9a8d' : '#f3ecd2');
        bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 60 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + Math.min(lvl + 1, NL) + '/' + NL, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };

  }
});
