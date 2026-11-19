/* Auðun — o caminho do urso (invenção). */
BTJogo.registrar({
  canvas: 'jogo-audun',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O caminho do urso",
    "sub": "Cada casa mostra o custo de passar por ela. Parta da casa de cima, à esquerda, e chegue à casa de baixo, à direita, tocando numa casa vizinha de cada vez, sem diagonais e sem repetir casas. O custo total não pode passar do limite. Tocar na última casa do caminho a desfaz, mas só 3 vezes. O tempo é limitado. São 3 mapas.",
    "perdeu": "Sem caminho possível ou sem tempo",
    "v1": "Urso entregue!",
    "v2": "Na história de Auðun, um islandês pobre compra um urso-polar na Groenlândia e o leva de presente ao rei Sveinn da Dinamarca. Achar o caminho mais barato é invenção.",
    "h1": "Mapa",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The bear’s road",
    "sub": "Each square shows the cost of passing through it. Start from the top-left square and reach the bottom-right square, tapping one neighbouring square at a time, with no diagonals and no repeated squares. The total cost cannot pass the limit. Tapping the last square of the path undoes it, but only 3 times. Time is limited. There are 3 maps.",
    "perdeu": "No possible path left, or time ran out",
    "v1": "Bear delivered!",
    "v2": "In the tale of Auðun, a poor Icelander buys a polar bear in Greenland and takes it as a gift to King Sveinn of Denmark. Finding the cheapest path is invented.",
    "h1": "Map",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Bjørnens vei",
    "sub": "Hver rute viser kostnaden ved å gå gjennom den. Start i ruten øverst til venstre og kom til ruten nederst til høyre ved å trykke på én nabo-rute om gangen, uten diagonaler og uten å gjenta ruter. Totalkostnaden kan ikke overstige grensen. Å trykke på den siste ruten i veien angrer den, men bare 3 ganger. Tiden er begrenset. Det er 3 kart.",
    "perdeu": "Ingen vei igjen, eller tiden tok slutt",
    "v1": "Bjørnen er levert!",
    "v2": "I fortellingen om Auðun kjøper en fattig islending en isbjørn på Grønland og tar den med som gave til kong Sveinn av Danmark. Å finne den billigste veien er oppfunnet.",
    "h1": "Kart",
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
    var NS = [5, 6, 6], SL = [3, 2, 1], LIM = 300;
    var n = 5, cost = [], path = [], spent = 0, budget = 0, sol = [], und = 3;
    function adj(a, b) { var ax = a % n, ay = Math.floor(a / n), bx = b % n, by = Math.floor(b / n); return Math.abs(ax - bx) + Math.abs(ay - by) === 1; }
    function dijk() {
      var N = n * n, d = [], pr = [], dn = [], i, k, u, v, best, nb;
      for (i = 0; i < N; i++) { d.push(1e9); pr.push(-1); dn.push(false); } d[0] = 0;
      for (k = 0; k < N; k++) {
        u = -1; best = 1e9; for (i = 0; i < N; i++) if (!dn[i] && d[i] < best) { best = d[i]; u = i; } if (u < 0) break; dn[u] = true;
        nb = [u - n, u + n, u % n > 0 ? u - 1 : -1, u % n < n - 1 ? u + 1 : -1];
        for (i = 0; i < 4; i++) { v = nb[i]; if (v < 0 || v >= N) continue; if (d[u] + cost[v] < d[v]) { d[v] = d[u] + cost[v]; pr[v] = u; } }
      }
      var out = [], c = N - 1; while (c >= 0) { out.unshift(c); c = pr[c]; } return { d: d[N - 1], path: out };
    }
    function load(i) {
      var k; n = NS[i]; cost = []; for (k = 0; k < n * n; k++) cost.push(1 + Math.floor(Math.random() * 9));
      var r = dijk(); sol = r.path; budget = r.d + SL[i]; path = [0]; spent = 0; und = 3;
    }
    function stuck() { var last = path[path.length - 1], c = [last - n, last + n, last % n > 0 ? last - 1 : -1, last % n < n - 1 ? last + 1 : -1], i; for (i = 0; i < 4; i++) { var v = c[i]; if (v >= 0 && v < n * n && path.indexOf(v) < 0 && spent + cost[v] <= budget) return false; } return und <= 0; }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function L() { return glay(n, n, 86, 40); }
    function pos() { var l = L(), a = [], i; for (i = 0; i < n * n; i++) a.push({ x: l.x0 + (i % n + 0.5) * l.s, y: l.y0 + (Math.floor(i / n) + 0.5) * l.s }); return a; }
    function tap(i) {
      if (pend > 0 || st !== 'play') return; var last = path[path.length - 1];
      if (i === last && path.length > 1) { if (und > 0) { und--; spent -= cost[last]; path.pop(); if (api.nota) api.nota(200, 0.06, 'square', 0.04); } return; }
      if (!adj(last, i) || path.indexOf(i) >= 0 || spent + cost[i] > budget) return;
      path.push(i); spent += cost[i]; if (api.nota) api.nota(300 + path.length * 20, 0.05, 'triangle', 0.04);
      if (i === n * n - 1) lvlUp(); else if (stuck()) st = 'lose';
    }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lvl: lvl, pend: pend, sol: sol.slice(), plen: path.length, pos: pos() }; },
      down: function (x, y) { if (menu()) return; var l = L(), c = Math.floor((x - l.x0) / l.s), r = Math.floor((y - l.y0) / l.s); if (c < 0 || r < 0 || c >= n || r >= n) return; tap(r * n + c); },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) { tick(dt, load); },
      draw: function () {
        var l = L(), s = l.s, i; bg('#1a2630', '#05090c');
        for (i = 0; i < n * n; i++) {
          var x = l.x0 + (i % n) * s, y = l.y0 + Math.floor(i / n) * s, on = path.indexOf(i) >= 0;
          g.fillStyle = on ? '#e0b040' : 'rgba(255,255,255,.1)'; rr(x + 2, y + 2, s - 4, s - 4, 7); g.fill();
          txt(String(cost[i]), x + s / 2, y + s / 2 + 1, Math.max(12, s * 0.42), on ? '#2a2010' : '#f3ecd2');
        }
        txt(spent + ' / ' + budget + '     ↶ ' + und, api.w / 2, l.y0 - 14, 20, spent >= budget ? '#ff9a8d' : '#f3ecd2');
        foot(); hh(); fim(st);
      }
    };

  }
});
