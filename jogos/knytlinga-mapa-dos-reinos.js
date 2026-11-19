/* Knýtlinga saga — colorir o mapa dos reinos (invenção). */
BTJogo.registrar({
  canvas: 'jogo-knytlinga',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O mapa dos reinos",
    "sub": "O mapa está dividido em reinos. Toque num reino para pintá-lo: cada toque muda a cor (cada cor tem um símbolo). Dois reinos que se tocam por um lado não podem ter a mesma cor. Pinte todos os reinos usando apenas as cores da paleta, que nas rodadas seguintes passa a ter menos cores. Reinos vizinhos de mesma cor ficam com a fronteira vermelha. São 3 mapas, e o tempo é limitado.",
    "perdeu": "O tempo acabou antes de o mapa ser pintado",
    "v1": "O mapa está pintado!",
    "v2": "A Knýtlinga saga, escrita por volta de 1250, conta a história dos reis da Dinamarca desde Harald Dente Azul até o fim do século XII. Colorir mapas é invenção.",
    "h1": "Mapa",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The map of the realms",
    "sub": "The map is divided into realms. Tap a realm to paint it: each tap changes the colour (each colour has a symbol). Two realms that share a border cannot have the same colour. Paint every realm using only the colours in the palette, which has fewer colours in the later rounds. Neighbouring realms of the same colour get a red border. There are 3 maps, and time is limited.",
    "perdeu": "Time ran out before the map was painted",
    "v1": "The map is painted!",
    "v2": "The Knýtlinga saga, written around 1250, tells the story of the kings of Denmark from Harald Bluetooth to the end of the 12th century. Colouring maps is invented.",
    "h1": "Map",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Kartet over rikene",
    "sub": "Kartet er delt inn i riker. Trykk på et rike for å male det: hvert trykk bytter farge (hver farge har et symbol). To riker som deler en grense, kan ikke ha samme farge. Mal alle rikene med bare fargene i paletten, som har færre farger i de senere rundene. Nabo-riker med samme farge får rød grense. Det er 3 kart, og tiden er begrenset.",
    "perdeu": "Tiden gikk ut før kartet var malt",
    "v1": "Kartet er malt!",
    "v2": "Knýtlinga saga, skrevet rundt 1250, forteller om danske konger fra Harald Blåtann til slutten av 1100-tallet. Å fargelegge kart er oppfunnet.",
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
    var NL = 3, LIM = 300, CFG = [[9, 4], [9, 3], [12, 3]], S = 7, SYM = ['●', '▲', '■', '◆'], CL = ['#c9605a', '#5a9bc9', '#7cbf6a', '#d6b84a'];
    var lvl = 0, reg = [], R = 0, K = 4, adj = [], col = [], sol = [], cen = [], t = 0, pend = 0;
    function nb(i) { var x = i % S, y = (i / S) | 0, o = []; if (x > 0) o.push(i - 1); if (x < S - 1) o.push(i + 1); if (y > 0) o.push(i - S); if (y < S - 1) o.push(i + S); return o; }
    function colorable(k) {
      var c = [], i; for (i = 0; i < R; i++) c.push(0);
      function go(r) { if (r === R) return true; for (var v = 1; v <= k; v++) { var ok = true; for (var j = 0; j < adj.length; j++) { var e = adj[j]; if ((e[0] === r && e[1] < r && c[e[1]] === v) || (e[1] === r && e[0] < r && c[e[0]] === v)) { ok = false; break; } } if (ok) { c[r] = v; if (go(r + 1)) return true; c[r] = 0; } } return false; }
      return go(0) ? c.slice() : null;
    }
    function gen(i) {
      R = CFG[i][0]; K = CFG[i][1];
      for (var tries = 0; tries < 5000; tries++) {
        var sd = [], k, j, ok = true;
        for (k = 0; k < R; k++) { var p, w = 0; do { p = (Math.random() * S * S) | 0; ok = true; sd.forEach(function (q) { if (Math.abs(q % S - p % S) + Math.abs(((q / S) | 0) - ((p / S) | 0)) < 2) ok = false; }); w++; } while (!ok && w < 80); if (!ok) break; sd.push(p); }
        if (sd.length < R) continue;
        var rg = []; for (k = 0; k < S * S; k++) { var b = 0, bd = 1e9; for (j = 0; j < R; j++) { var d = Math.pow(sd[j] % S - k % S, 2) + Math.pow(((sd[j] / S) | 0) - ((k / S) | 0), 2) + j * 0.001; if (d < bd) { bd = d; b = j; } } rg.push(b); }
        ok = true;
        for (j = 0; j < R && ok; j++) { var cells = [], q; rg.forEach(function (v, ii) { if (v === j) cells.push(ii); }); if (!cells.length) { ok = false; break; } var seen = {}, st = [cells[0]]; seen[cells[0]] = 1; var cnt = 1; while (st.length) { var m = st.pop(); nb(m).forEach(function (z) { if (rg[z] === j && !seen[z]) { seen[z] = 1; cnt++; st.push(z); } }); } if (cnt !== cells.length) ok = false; }
        if (!ok) continue;
        var A = {}; adj = []; for (k = 0; k < S * S; k++) nb(k).forEach(function (z) { if (rg[z] !== rg[k]) { var a = Math.min(rg[k], rg[z]), b2 = Math.max(rg[k], rg[z]); if (!A[a + '_' + b2]) { A[a + '_' + b2] = 1; adj.push([a, b2]); } } });
        if (adj.length < R + 4) continue;
        var s = colorable(K); if (!s) continue; if (K === 3 && colorable(2)) continue;
        reg = rg; sol = s; col = []; cen = [];
        for (j = 0; j < R; j++) { col.push(0); var cs = [], mx = 0, my = 0; reg.forEach(function (v, ii) { if (v === j) { cs.push(ii); mx += ii % S; my += (ii / S) | 0; } }); mx /= cs.length; my /= cs.length; var bi = cs[0], bb = 1e9; cs.forEach(function (ii) { var d = Math.pow(ii % S - mx, 2) + Math.pow(((ii / S) | 0) - my, 2); if (d < bb) { bb = d; bi = ii; } }); cen.push(bi); }
        return;
      }
    }
    function done() { var i; for (i = 0; i < R; i++) if (!col[i]) return false; for (i = 0; i < adj.length; i++) if (col[adj[i][0]] === col[adj[i][1]]) return false; return true; }
    function reset() { lvl = 0; t = 0; pend = 0; gen(0); st = 'play'; }
    function lay() { var W = api.w, H = api.h, s = Math.min((W - 20) / S, (H - 140) / S, 62); return { s: s, x0: (W - s * S) / 2, y0: 72 }; }
    function cc(i) { var L = lay(); return { x: L.x0 + (i % S) * L.s + L.s / 2, y: L.y0 + ((i / S) | 0) * L.s + L.s / 2 }; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lvl: lvl, R: R, K: K, col: col.slice(), sol: sol.slice(), pos: cen.map(cc), t: t, pend: pend }; },
      down: function (x, y) {
        if (menu()) return; if (pend > 0) return; var L = lay(), c = Math.floor((x - L.x0) / L.s), r = Math.floor((y - L.y0) / L.s);
        if (c < 0 || c >= S || r < 0 || r >= S) return; var rr2 = reg[r * S + c]; col[rr2] = (col[rr2] + 1) % (K + 1); if (api.nota) api.nota(240 + col[rr2] * 50, 0.05, 'square', 0.03);
        if (done()) { lvl++; pend = 0.9; if (api.nota) api.nota(520, 0.2, 'triangle', 0.07); }
      },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) {
        if (st !== 'play') return; t += dt;
        if (pend > 0) { pend -= dt; if (pend <= 0) { if (lvl >= NL) st = 'win'; else gen(lvl); } }
        if (st === 'play' && t >= LIM) st = 'lose';
      },
      draw: function () {
        var L = lay(), i, j; bg('#13222c', '#050b10');
        for (i = 0; i < S * S; i++) { var x = L.x0 + (i % S) * L.s, y = L.y0 + ((i / S) | 0) * L.s, c = col[reg[i]]; g.fillStyle = c ? CL[c - 1] : '#2c3b4d'; g.fillRect(x, y, L.s, L.s); }
        for (i = 0; i < S * S; i++) {
          var x2 = L.x0 + (i % S) * L.s, y2 = L.y0 + ((i / S) | 0) * L.s, cx = i % S, cy = (i / S) | 0;
          if (cx < S - 1 && reg[i + 1] !== reg[i]) { var bad = col[reg[i]] && col[reg[i]] === col[reg[i + 1]]; g.strokeStyle = bad ? '#ff2a1a' : '#0b1118'; g.lineWidth = bad ? 5 : 3; g.beginPath(); g.moveTo(x2 + L.s, y2); g.lineTo(x2 + L.s, y2 + L.s); g.stroke(); }
          if (cy < S - 1 && reg[i + S] !== reg[i]) { var bad2 = col[reg[i]] && col[reg[i]] === col[reg[i + S]]; g.strokeStyle = bad2 ? '#ff2a1a' : '#0b1118'; g.lineWidth = bad2 ? 5 : 3; g.beginPath(); g.moveTo(x2, y2 + L.s); g.lineTo(x2 + L.s, y2 + L.s); g.stroke(); }
        }
        for (j = 0; j < R; j++) if (col[j]) { var p = cc(cen[j]); txt(SYM[col[j] - 1], p.x, p.y + 1, L.s * 0.5, '#10141c'); }
        for (j = 0; j < K; j++) { var px = api.w / 2 + (j - (K - 1) / 2) * 44, py = L.y0 + S * L.s + 24; g.fillStyle = CL[j]; g.beginPath(); g.arc(px, py, 15, 0, 6.2832); g.fill(); txt(SYM[j], px, py + 1, 16, '#10141c'); }
        bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 60 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + Math.min(lvl + 1, NL) + '/' + NL, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };

  }
});
