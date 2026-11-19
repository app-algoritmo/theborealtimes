/* Víga-Glúms saga — divida o campo em lotes retangulares (invenção). */
BTJogo.registrar({
  canvas: 'jogo-vigaglums',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os lotes do campo",
    "sub": "Divida o campo em retângulos. Cada retângulo deve conter exatamente um número, e esse número é a quantidade de casas do retângulo. Arraste de uma casa a outra para desenhar um retângulo, e toque num retângulo para apagá-lo. Todas as casas precisam ficar cobertas, sem sobreposição. São 3 campos, e o tempo é limitado.",
    "perdeu": "O tempo acabou antes de o campo ser dividido",
    "v1": "Campo dividido!",
    "v2": "A Víga-Glúms saga se passa no Eyjafjörður, no norte da Islândia, onde Glúmr Eyjólfsson vive em Þverá; um dos campos que aparecem na história se chama Vitazgjafi. Dividir o campo em retângulos é invenção.",
    "h1": "Campo",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The plots of the field",
    "sub": "Divide the field into rectangles. Each rectangle must contain exactly one number, and that number is how many squares the rectangle has. Drag from one square to another to draw a rectangle, and tap a rectangle to erase it. Every square must be covered, with no overlap. There are 3 fields, and time is limited.",
    "perdeu": "Time ran out before the field was divided",
    "v1": "Field divided!",
    "v2": "Víga-Glúms saga is set in Eyjafjörður, in northern Iceland, where Glúmr Eyjólfsson lives at Þverá; one of the fields in the story is called Vitazgjafi. Dividing the field into rectangles is invented.",
    "h1": "Field",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Teigene på jordet",
    "sub": "Del jordet inn i rektangler. Hvert rektangel må inneholde nøyaktig ett tall, og tallet er hvor mange ruter rektanglet har. Dra fra én rute til en annen for å tegne et rektangel, og trykk på et rektangel for å viske det ut. Alle rutene må være dekket, uten overlapp. Det er 3 jorder, og tiden er begrenset.",
    "perdeu": "Tiden gikk ut før jordet var delt",
    "v1": "Jordet er delt!",
    "v2": "Víga-Glúms saga foregår i Eyjafjörður, nord på Island, der Glúmr Eyjólfsson bor på Þverá; en av markene i fortellingen heter Vitazgjafi. Å dele jordet i rektangler er oppfunnet.",
    "h1": "Jorde",
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
    var LV = [5, 6, 7], NL = 3, LIM = 420, PAL = ['#7aa86a', '#c9a35a', '#6f9ac0', '#b57aa8', '#b0b86a', '#c97a6a', '#6ab0a8'];
    var lvl = 0, n = 5, clue = [], rects = [], sol = [], drag = null, t = 0, pend = 0, fl = 0;
    function inR(r, x, y) { return x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h; }
    function options(cl, k) {
      var c = cl[k], out = [], w, h, x, y, i;
      for (w = 1; w <= c.v; w++) { if (c.v % w) continue; h = c.v / w; if (w > n || h > n) continue;
        for (x = c.x - w + 1; x <= c.x; x++) for (y = c.y - h + 1; y <= c.y; y++) { if (x < 0 || y < 0 || x + w > n || y + h > n) continue; var r = { x: x, y: y, w: w, h: h }, ok = true; for (i = 0; i < cl.length; i++) if (i !== k && inR(r, cl[i].x, cl[i].y)) ok = false; if (ok) out.push(r); } }
      return out;
    }
    function count(cl) {
      var opts = cl.map(function (c, k) { return options(cl, k); }), cov = [], used = [], c2 = 0, i; for (i = 0; i < n * n; i++) cov.push(0);
      (function go() {
        if (c2 > 1) return; var f = cov.indexOf(0); if (f < 0) { c2++; return; } var fx = f % n, fy = (f / n) | 0;
        for (var k = 0; k < cl.length; k++) { if (used[k]) continue; for (var j = 0; j < opts[k].length; j++) { var r = opts[k][j]; if (!inR(r, fx, fy)) continue; var ok = true, x, y; for (x = r.x; x < r.x + r.w && ok; x++) for (y = r.y; y < r.y + r.h; y++) if (cov[y * n + x]) { ok = false; break; } if (!ok) continue; for (x = r.x; x < r.x + r.w; x++) for (y = r.y; y < r.y + r.h; y++) cov[y * n + x] = 1; used[k] = true; go(); used[k] = false; for (x = r.x; x < r.x + r.w; x++) for (y = r.y; y < r.y + r.h; y++) cov[y * n + x] = 0; } }
      })(); return c2;
    }
    function gen(i) {
      n = LV[i];
      for (var tries = 0; tries < 4000; tries++) {
        var occ = [], rs = [], k, ok = true; for (k = 0; k < n * n; k++) occ.push(0);
        for (k = 0; k < n * n; k++) {
          if (occ[k]) continue; var x = k % n, y = (k / n) | 0, cand = [], w, h, a, b;
          for (h = 1; h <= 4 && y + h <= n; h++) { if (occ[(y + h - 1) * n + x]) break; for (w = 1; w <= 5 && x + w <= n; w++) { var fr = true; for (a = 0; a < w && fr; a++) for (b = 0; b < h; b++) if (occ[(y + b) * n + x + a]) { fr = false; break; } if (!fr) break; cand.push({ x: x, y: y, w: w, h: h }); } }
          var big = cand.filter(function (r) { return r.w * r.h >= 2; }); if (big.length) cand = big;
          var r = cand[(Math.random() * cand.length) | 0]; rs.push(r); for (a = 0; a < r.w; a++) for (b = 0; b < r.h; b++) occ[(r.y + b) * n + r.x + a] = 1;
        }
        var cl = rs.map(function (r) { return { x: r.x + ((Math.random() * r.w) | 0), y: r.y + ((Math.random() * r.h) | 0), v: r.w * r.h }; });
        if (cl.length < n || cl.length > n * n * 0.6) continue;
        if (count(cl) === 1) { clue = cl; sol = rs; rects = []; return; }
      }
    }
    function covered() { var s = 0; rects.forEach(function (r) { s += r.w * r.h; }); return s; }
    function reset() { lvl = 0; t = 0; pend = 0; drag = null; gen(0); st = 'play'; }
    function lay() { var W = api.w, H = api.h, s = Math.min((W - 20) / n, (H - 130) / n, 62); return { s: s, x0: (W - s * n) / 2, y0: 72 }; }
    function cc(x, y) { var L = lay(); return { x: L.x0 + x * L.s + L.s / 2, y: L.y0 + y * L.s + L.s / 2 }; }
    function cellAt(x, y) { var L = lay(), c = Math.floor((x - L.x0) / L.s), r = Math.floor((y - L.y0) / L.s); return { x: Math.max(0, Math.min(n - 1, c)), y: Math.max(0, Math.min(n - 1, r)), inside: c >= 0 && c < n && r >= 0 && r < n }; }
    reset(); st = 'menu';
    return {
      pausar: function () { drag = null; },
      dbg: function () { var p = [], i; for (i = 0; i < n * n; i++) p.push(cc(i % n, (i / n) | 0)); return { st: st, lvl: lvl, n: n, sol: sol.map(function (r) { return [r.x, r.y, r.w, r.h]; }), rects: rects.map(function (r) { return [r.x, r.y, r.w, r.h]; }), pos: p, t: t, pend: pend }; },
      down: function (x, y) { if (menu()) return; if (pend > 0) return; var c = cellAt(x, y); if (!c.inside) return; drag = { a: c, b: c }; },
      move: function (x, y) { if (drag) drag.b = cellAt(x, y); },
      up: function () {
        if (!drag || st !== 'play') { drag = null; return; } var a = drag.a, b = drag.b, i; drag = null;
        if (a.x === b.x && a.y === b.y) { for (i = rects.length - 1; i >= 0; i--) if (inR(rects[i], a.x, a.y)) { rects.splice(i, 1); if (api.nota) api.nota(200, 0.05, 'square', 0.03); return; } }
        var r = { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), w: Math.abs(a.x - b.x) + 1, h: Math.abs(a.y - b.y) + 1 }, cn = clue.filter(function (c) { return inR(r, c.x, c.y); });
        if (cn.length !== 1 || cn[0].v !== r.w * r.h) { fl = 0.4; if (api.nota) api.nota(120, 0.15, 'sawtooth', 0.05); return; }
        rects = rects.filter(function (q) { return !(q.x < r.x + r.w && r.x < q.x + q.w && q.y < r.y + r.h && r.y < q.y + q.h); }); rects.push(r); if (api.nota) api.nota(360, 0.06, 'square', 0.03);
        if (covered() === n * n) { lvl++; pend = 0.9; if (api.nota) api.nota(520, 0.2, 'triangle', 0.07); }
      },
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) {
        if (st !== 'play') return; t += dt; if (fl > 0) fl -= dt;
        if (pend > 0) { pend -= dt; if (pend <= 0) { if (lvl >= NL) st = 'win'; else gen(lvl); } }
        if (st === 'play' && t >= LIM) st = 'lose';
      },
      draw: function () {
        var L = lay(), i; bg('#16241a', '#060b07');
        g.fillStyle = 'rgba(255,255,255,.05)'; g.fillRect(L.x0, L.y0, L.s * n, L.s * n);
        g.strokeStyle = 'rgba(255,255,255,.14)'; g.lineWidth = 1;
        for (i = 0; i <= n; i++) { g.beginPath(); g.moveTo(L.x0 + i * L.s, L.y0); g.lineTo(L.x0 + i * L.s, L.y0 + n * L.s); g.stroke(); g.beginPath(); g.moveTo(L.x0, L.y0 + i * L.s); g.lineTo(L.x0 + n * L.s, L.y0 + i * L.s); g.stroke(); }
        rects.forEach(function (r, k) { g.fillStyle = PAL[k % PAL.length]; g.globalAlpha = 0.75; g.fillRect(L.x0 + r.x * L.s + 2, L.y0 + r.y * L.s + 2, r.w * L.s - 4, r.h * L.s - 4); g.globalAlpha = 1; });
        if (drag) { var a = drag.a, b = drag.b, x = Math.min(a.x, b.x), y = Math.min(a.y, b.y), w = Math.abs(a.x - b.x) + 1, h = Math.abs(a.y - b.y) + 1; g.strokeStyle = '#ffd88a'; g.lineWidth = 3; g.strokeRect(L.x0 + x * L.s + 2, L.y0 + y * L.s + 2, w * L.s - 4, h * L.s - 4); }
        clue.forEach(function (c) { var p = cc(c.x, c.y); txt(String(c.v), p.x, p.y + 1, L.s * 0.46, fl > 0 ? '#ff9a8d' : '#f3ecd2'); });
        bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 60 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + Math.min(lvl + 1, NL) + '/' + NL, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };

  }
});
