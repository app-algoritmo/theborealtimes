/* Hallfreðr — ligue as ilhas com pontes (invenção). */
BTJogo.registrar({
  canvas: 'jogo-hallfred',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As pontes de Hallfreðr",
    "sub": "Cada ilha tem um número: é quantas pontes devem sair dela. Toque numa ilha e depois noutra da mesma linha ou coluna, sem outra ilha entre elas, para construir uma ponte. Toque de novo na mesma dupla para fazer uma ponte dupla, e mais uma vez para desfazer. Pontes não se cruzam. Todas as ilhas precisam ficar ligadas num só conjunto, com o número certo de pontes. São 3 mapas, e o tempo é limitado.",
    "perdeu": "O tempo acabou antes de as ilhas ficarem ligadas",
    "v1": "Todas as ilhas ligadas!",
    "v2": "Segundo a saga, o poeta Hallfreðr serviu a Hákon Sigurðarson, a Óláfr Tryggvason e a Eiríkr Hákonarson, e contou em versos a sua conversão difícil ao cristianismo. Ligar ilhas com pontes é invenção.",
    "h1": "Mapa",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Hallfreðr’s bridges",
    "sub": "Each island has a number: how many bridges must leave it. Tap one island and then another in the same row or column, with no other island between them, to build a bridge. Tap the same pair again for a double bridge, and once more to remove it. Bridges do not cross. All islands must end up linked in one group, with the right number of bridges. There are 3 maps, and time is limited.",
    "perdeu": "Time ran out before the islands were linked",
    "v1": "Every island linked!",
    "v2": "According to the saga, the poet Hallfreðr served Hákon Sigurðarson, Óláfr Tryggvason and Eiríkr Hákonarson, and told in verse of his difficult conversion to Christianity. Linking islands with bridges is invented.",
    "h1": "Map",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Hallfreðs broer",
    "sub": "Hver øy har et tall: det er hvor mange broer som skal gå ut fra den. Trykk på én øy og deretter på en annen i samme rad eller kolonne, uten at det ligger en annen øy imellom, for å bygge en bro. Trykk på det samme paret igjen for en dobbel bro, og én gang til for å fjerne den. Broer krysser ikke hverandre. Alle øyene må henge sammen i én gruppe, med riktig antall broer. Det er 3 kart, og tiden er begrenset.",
    "perdeu": "Tiden gikk ut før øyene var knyttet sammen",
    "v1": "Alle øyene er knyttet sammen!",
    "v2": "Ifølge sagaen tjente skalden Hallfreðr Hákon Sigurðarson, Óláfr Tryggvason og Eiríkr Hákonarson, og fortalte i vers om sin vanskelige overgang til kristendommen. Å knytte øyer sammen med broer er oppfunnet.",
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
    var LV = [6, 8, 10], NL = 3, LIM = 540, S = 7;
    var lvl = 0, isl = [], hid = [], br = {}, pairs = [], sel = -1, t = 0, pend = 0;
    function at(x, y) { for (var i = 0; i < isl.length; i++) if (isl[i].x === x && isl[i].y === y) return i; return -1; }
    function pk(a, b) { return a < b ? a + '_' + b : b + '_' + a; }
    function cells(a, b) { var A = isl[a], B = isl[b], out = [], dx = Math.sign(B.x - A.x), dy = Math.sign(B.y - A.y), x = A.x + dx, y = A.y + dy; while (x !== B.x || y !== B.y) { out.push([x, y]); x += dx; y += dy; } return out; }
    function genPairs() { pairs = []; var i, j; for (i = 0; i < isl.length; i++) for (j = i + 1; j < isl.length; j++) { var A = isl[i], B = isl[j]; if (A.x !== B.x && A.y !== B.y) continue; var ok = true; cells(i, j).forEach(function (c) { if (at(c[0], c[1]) >= 0) ok = false; }); if (ok) pairs.push([i, j]); } }
    function gen(i) {
      var k = LV[i];
      for (var tries = 0; tries < 500; tries++) {
        isl = [{ x: (Math.random() * S) | 0, y: (Math.random() * S) | 0, n: 0 }]; hid = []; var occ = {}, att = 0;
        occ[isl[0].x + ',' + isl[0].y] = 'i';
        while (isl.length < k && att++ < 600) {
          var ai = (Math.random() * isl.length) | 0, A = isl[ai], d = (Math.random() * 4) | 0, L = 2 + ((Math.random() * 3) | 0), dx = [0, 1, 0, -1][d], dy = [-1, 0, 1, 0][d], tx = A.x + dx * L, ty = A.y + dy * L;
          if (tx < 0 || ty < 0 || tx >= S || ty >= S) continue; var ok = true, m, path = [];
          for (m = 1; m < L; m++) { var cx = A.x + dx * m, cy = A.y + dy * m; if (occ[cx + ',' + cy]) ok = false; path.push([cx, cy]); }
          if (occ[tx + ',' + ty]) ok = false; if (!ok) continue;
          var near = false; [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (o) { var nx = tx + o[0], ny = ty + o[1]; if (nx === A.x - 0 && ny === A.y - 0) return; if (occ[nx + ',' + ny] === 'i' && !(nx === tx - dx && ny === ty - dy && L === 1)) near = true; }); if (near) continue;
          var c = Math.random() < 0.55 ? 1 : 2; isl.push({ x: tx, y: ty, n: 0 }); occ[tx + ',' + ty] = 'i'; path.forEach(function (p) { occ[p[0] + ',' + p[1]] = 'b'; }); hid.push([ai, isl.length - 1, c]);
        }
        if (isl.length < k) continue;
        genPairs(); var extra = 0, pi;
        for (pi = 0; pi < pairs.length && extra < 2; pi++) { var pr = pairs[(Math.random() * pairs.length) | 0], have = hid.some(function (h) { return pk(h[0], h[1]) === pk(pr[0], pr[1]); }); if (have) continue; var free = true; cells(pr[0], pr[1]).forEach(function (c2) { if (occ[c2[0] + ',' + c2[1]]) free = false; }); if (!free) continue; cells(pr[0], pr[1]).forEach(function (c3) { occ[c3[0] + ',' + c3[1]] = 'b'; }); hid.push([pr[0], pr[1], 1]); extra++; }
        isl.forEach(function (o) { o.n = 0; }); hid.forEach(function (h) { isl[h[0]].n += h[2]; isl[h[1]].n += h[2]; });
        if (isl.every(function (o) { return o.n >= 1 && o.n <= 8; })) { br = {}; sel = -1; genPairs(); return; }
      }
    }
    function crossing(a, b) {
      var A = isl[a], B = isl[b], horiz = A.y === B.y, key, ok = true;
      Object.keys(br).forEach(function (k2) { if (!br[k2]) return; var pa = k2.split('_'), C = isl[+pa[0]], D = isl[+pa[1]], ch = C.y === D.y; if (ch === horiz) return;
        if (horiz) { var y = A.y, x1 = Math.min(A.x, B.x), x2 = Math.max(A.x, B.x); if (C.x > x1 && C.x < x2 && y > Math.min(C.y, D.y) && y < Math.max(C.y, D.y)) ok = false; }
        else { var x = A.x, y1 = Math.min(A.y, B.y), y2 = Math.max(A.y, B.y); if (C.y > y1 && C.y < y2 && x > Math.min(C.x, D.x) && x < Math.max(C.x, D.x)) ok = false; } });
      return !ok;
    }
    function deg(i) { var s = 0; Object.keys(br).forEach(function (k) { var p = k.split('_'); if (+p[0] === i || +p[1] === i) s += br[k]; }); return s; }
    function check() {
      var i; for (i = 0; i < isl.length; i++) if (deg(i) !== isl[i].n) return false;
      var seen = { 0: 1 }, q = [0]; while (q.length) { var v = q.pop(); Object.keys(br).forEach(function (k) { if (!br[k]) return; var p = k.split('_'), w = +p[0] === v ? +p[1] : +p[1] === v ? +p[0] : -1; if (w >= 0 && !seen[w]) { seen[w] = 1; q.push(w); } }); }
      return Object.keys(seen).length === isl.length;
    }
    function reset() { lvl = 0; t = 0; pend = 0; gen(0); st = 'play'; }
    function lay() { var W = api.w, H = api.h, s = Math.min((W - 20) / S, (H - 130) / S, 62); return { s: s, x0: (W - s * S) / 2, y0: 72 }; }
    function ip(i) { var L = lay(); return { x: L.x0 + isl[i].x * L.s + L.s / 2, y: L.y0 + isl[i].y * L.s + L.s / 2 }; }
    function tapI(i) {
      if (sel < 0 || sel === i) { sel = sel === i ? -1 : i; return; }
      var k = pk(sel, i), ok = pairs.some(function (p) { return pk(p[0], p[1]) === k; });
      if (!ok) { sel = i; return; }
      var c = br[k] || 0; if (c === 0 && crossing(sel, i)) { sel = -1; if (api.nota) api.nota(120, 0.15, 'sawtooth', 0.05); return; }
      br[k] = (c + 1) % 3; sel = -1; if (api.nota) api.nota(260 + br[k] * 60, 0.06, 'square', 0.03);
      if (check()) { lvl++; pend = 0.9; if (api.nota) api.nota(520, 0.2, 'triangle', 0.07); }
    }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { var p = [], i; for (i = 0; i < isl.length; i++) p.push(ip(i)); return { st: st, lvl: lvl, isl: isl.map(function (o) { return o.n; }), hid: hid.map(function (h) { return h.slice(); }), pos: p, sel: sel, t: t, pend: pend }; },
      down: function (x, y) {
        if (menu()) return; if (pend > 0) return; var L = lay(), i;
        for (i = 0; i < isl.length; i++) { var p = ip(i); if (Math.hypot(x - p.x, y - p.y) < L.s * 0.45) { tapI(i); return; } }
        sel = -1;
      },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) {
        if (st !== 'play') return; t += dt;
        if (pend > 0) { pend -= dt; if (pend <= 0) { if (lvl >= NL) st = 'win'; else gen(lvl); } }
        if (st === 'play' && t >= LIM) st = 'lose';
      },
      draw: function () {
        var L = lay(), i; bg('#0f2230', '#04090e');
        g.fillStyle = 'rgba(255,255,255,.04)'; g.fillRect(L.x0, L.y0, L.s * S, L.s * S);
        Object.keys(br).forEach(function (k) {
          var c = br[k]; if (!c) return; var p = k.split('_'), a = ip(+p[0]), b = ip(+p[1]), h = isl[+p[0]].y === isl[+p[1]].y;
          g.strokeStyle = '#d8c79a'; g.lineWidth = 3;
          for (var m = 0; m < c; m++) { var o = c === 2 ? (m ? 4 : -4) : 0; g.beginPath(); if (h) { g.moveTo(a.x, a.y + o); g.lineTo(b.x, b.y + o); } else { g.moveTo(a.x + o, a.y); g.lineTo(b.x + o, b.y); } g.stroke(); }
        });
        for (i = 0; i < isl.length; i++) {
          var p2 = ip(i), d = deg(i), ok = d === isl[i].n, over = d > isl[i].n;
          g.fillStyle = ok ? '#6c8a58' : over ? '#a85a4a' : '#3d5a7a'; g.beginPath(); g.arc(p2.x, p2.y, L.s * 0.36, 0, 6.2832); g.fill();
          g.strokeStyle = i === sel ? '#ffd88a' : 'rgba(255,255,255,.4)'; g.lineWidth = i === sel ? 4 : 2; g.stroke(); txt(String(isl[i].n), p2.x, p2.y + 1, L.s * 0.4, '#f3ecd2');
        }
        bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 60 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + Math.min(lvl + 1, NL) + '/' + NL, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };

  }
});
