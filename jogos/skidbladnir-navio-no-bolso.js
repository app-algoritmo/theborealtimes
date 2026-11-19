/* Skíðblaðnir — o navio no bolso (invenção). */
BTJogo.registrar({
  canvas: 'jogo-skidbladnir',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O navio no bolso",
    "sub": "Peças de formas diferentes precisam preencher o bolso, uma grade, sem sobrar casas vazias. Toque numa peça para escolhê-la e depois toque na casa onde o ponto branco dela deve ficar. Toque numa peça já colocada para tirá-la. O tempo é limitado. São 3 bolsos.",
    "perdeu": "O tempo acabou",
    "v1": "Bolso cheio!",
    "v2": "Nas fontes nórdicas, o navio Skíðblaðnir se dobra como pano e cabe num bolso, mas elas não dizem como. O encaixe das peças é invenção.",
    "h1": "Bolso",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The ship in the pocket",
    "sub": "Pieces of different shapes must fill the pocket, a grid, with no empty squares left. Tap a piece to choose it and then tap the square where its white dot should go. Tap a piece already placed to take it out. Time is limited. There are 3 pockets.",
    "perdeu": "Time ran out",
    "v1": "Pocket full!",
    "v2": "In the Norse sources, the ship Skíðblaðnir folds like cloth and fits in a pocket, but they do not say how. Fitting the pieces is invented.",
    "h1": "Pocket",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Skipet i lommen",
    "sub": "Brikker med ulike former skal fylle lommen, et rutenett, uten at det blir tomme ruter igjen. Trykk på en brikke for å velge den, og trykk så på ruten der den hvite prikken skal ligge. Trykk på en brikke som er lagt, for å ta den bort. Tiden er begrenset. Det er 3 lommer.",
    "perdeu": "Tiden tok slutt",
    "v1": "Lommen er full!",
    "v2": "I de norrøne kildene kan skipet Skíðblaðnir brettes sammen som tøy og få plass i en lomme, men de sier ikke hvordan. Å passe inn brikkene er oppfunnet.",
    "h1": "Lomme",
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
    var LV = [[4, 4, 4], [4, 5, 5], [5, 5, 6]], LIM = 300, COL = ['#d9ae48', '#6fb1d9', '#d97f6f', '#8fcf7a', '#b58be0', '#e0a05a', '#7fd0c4'];
    var R = 4, C = 4, pcs = [], grid = [], sel = -1, nplaced = 0;
    function nbs(q) { var a = [], y = Math.floor(q / C), x = q % C; if (y > 0) a.push(q - C); if (y < R - 1) a.push(q + C); if (x > 0) a.push(q - 1); if (x < C - 1) a.push(q + 1); return a; }
    function gen(k) {
      for (var tries = 0; tries < 600; tries++) {
        var own = [], i, list = [], n = 0, order = [];
        for (i = 0; i < R * C; i++) { own.push(-1); order.push(i); }
        sh(order);
        for (i = 0; i < order.length && n < k; i++) {
          var s0 = order[i]; if (own[s0] >= 0) continue;
          own[s0] = n; var cl = [s0], tg = 3 + Math.floor(Math.random() * 3);
          while (cl.length < tg) {
            var cand = []; cl.forEach(function (q) { nbs(q).forEach(function (z) { if (own[z] < 0) cand.push(z); }); });
            if (!cand.length) break;
            var z0 = cand[Math.floor(Math.random() * cand.length)]; own[z0] = n; cl.push(z0);
          }
          list.push(cl); n++;
        }
        var guard = 0, ok = true;
        for (;;) {
          var left = []; for (i = 0; i < R * C; i++) if (own[i] < 0) left.push(i);
          if (!left.length) break;
          var prog = false;
          left.forEach(function (q) { var ns = nbs(q).filter(function (z) { return own[z] >= 0; }); if (ns.length) { var z1 = ns[Math.floor(Math.random() * ns.length)]; own[q] = own[z1]; list[own[z1]].push(q); prog = true; } });
          if (!prog || ++guard > 60) { ok = false; break; }
        }
        if (!ok || list.length !== k) continue;
        var good = true; list.forEach(function (c2) { if (c2.length < 3 || c2.length > 7) good = false; });
        if (good) return list;
      }
      return null;
    }
    function load(i) {
      R = LV[i][0]; C = LV[i][1]; var list = gen(LV[i][2]), q;
      if (!list) { list = []; for (q = 0; q < R; q++) { var rw = []; for (var c = 0; c < C; c++) rw.push(q * C + c); list.push(rw); } }
      pcs = list.map(function (cl, ix) {
        cl.sort(function (a, b) { return a - b; });
        var a = cl[0], ar = Math.floor(a / C), ac = a % C;
        return { rel: cl.map(function (z) { return [Math.floor(z / C) - ar, z % C - ac]; }), sol: [ar, ac], placed: false, cells: [], col: COL[ix % COL.length] };
      });
      sh(pcs); grid = []; for (q = 0; q < R * C; q++) grid.push(-1);
      sel = -1; nplaced = 0;
    }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function tray(cs, tx0, ty0, tx1, ty1) {
      var sl = [], x = tx0, y = ty0, rowH = 0, i, ok = true;
      for (i = 0; i < pcs.length; i++) {
        var p = pcs[i]; if (p.placed) { sl.push(null); continue; }
        var mr = 0, mc = 0, nr = 0, nc = 0; p.rel.forEach(function (r) { mr = Math.max(mr, r[0]); nr = Math.min(nr, r[0]); mc = Math.max(mc, r[1]); nc = Math.min(nc, r[1]); });
        var w = (mc - nc + 1) * cs, h = (mr - nr + 1) * cs;
        if (x + w > tx1 && x > tx0) { x = tx0; y += rowH + 12; rowH = 0; }
        sl.push({ x: x, y: y, w: w, h: h, ox: -nc * cs, oy: -nr * cs }); x += w + 16; rowH = Math.max(rowH, h);
        if (y + rowH > ty1 || x - 16 > tx1 + 0.5) ok = false;
      }
      return { sl: sl, ok: ok };
    }
    function L() {
      var W = api.w, H = api.h, land = W > H * 1.25, gs, gx, gy, tx0, ty0, tx1, ty1;
      if (land) { gs = Math.min(W * 0.46 / C, (H - 120) / R, 72); gx = 22; gy = 84 + (H - 84 - 20 - gs * R) / 2; tx0 = gx + gs * C + 34; ty0 = 84; tx1 = W - 16; ty1 = H - 20; }
      else { gs = Math.min((W - 24) / C, (H - 170) * 0.5 / R, 72); gx = (W - gs * C) / 2; gy = 76; tx0 = 14; ty0 = gy + gs * R + 18; tx1 = W - 14; ty1 = H - 22; }
      var cs = Math.max(12, Math.min(gs * 0.52, 36)), tr = tray(cs, tx0, ty0, tx1, ty1);
      while (!tr.ok && cs > 12) { cs -= 2; tr = tray(cs, tx0, ty0, tx1, ty1); }
      return { gs: gs, gx: gx, gy: gy, cs: cs, sl: tr.sl };
    }
    function place(i, r0, c0) {
      var p = pcs[i], l = [], k;
      for (k = 0; k < p.rel.length; k++) { var rr2 = r0 + p.rel[k][0], cc = c0 + p.rel[k][1]; if (rr2 < 0 || cc < 0 || rr2 >= R || cc >= C || grid[rr2 * C + cc] >= 0) return false; l.push(rr2 * C + cc); }
      l.forEach(function (q) { grid[q] = i; }); p.cells = l; p.placed = true; nplaced++; sel = -1;
      if (api.nota) api.nota(380 + i * 30, 0.06, 'triangle', 0.05);
      if (nplaced === pcs.length) lvlUp();
      return true;
    }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () {
        var l = L(), pos = [], tr = [], cell = [], i, q;
        for (i = 0; i < pcs.length; i++) { var s = l.sl[i]; tr.push(s ? { x: s.x + s.ox + l.cs / 2, y: s.y + s.oy + l.cs / 2 } : null); if (s) pos.push(tr[i]); }
        for (q = 0; q < R * C; q++) { var p = { x: l.gx + (q % C + 0.5) * l.gs, y: l.gy + (Math.floor(q / C) + 0.5) * l.gs }; cell.push(p); pos.push(p); }
        return { st: st, lvl: lvl, pend: pend, C: C, sel: sel, pcs: pcs.map(function (p) { return { placed: p.placed, sol: p.sol }; }), tray: tr, cell: cell, pos: pos };
      },
      down: function (x, y) {
        if (menu()) return; if (pend > 0 || st !== 'play') return;
        var l = L(), i;
        for (i = 0; i < pcs.length; i++) { var s = l.sl[i]; if (s && x >= s.x - 6 && x <= s.x + s.w + 6 && y >= s.y - 6 && y <= s.y + s.h + 6) { sel = sel === i ? -1 : i; return; } }
        var c = Math.floor((x - l.gx) / l.gs), r = Math.floor((y - l.gy) / l.gs);
        if (c < 0 || r < 0 || c >= C || r >= R) return;
        var q = r * C + c;
        if (grid[q] >= 0) { var pi = grid[q]; pcs[pi].cells.forEach(function (z) { grid[z] = -1; }); pcs[pi].cells = []; pcs[pi].placed = false; nplaced--; return; }
        if (sel >= 0) place(sel, r, c);
      },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) { tick(dt, load); },
      draw: function () {
        var l = L(), s = l.gs, i, q; bg('#1d2a3a', '#070b12');
        g.fillStyle = 'rgba(255,255,255,.07)'; rr(l.gx - 6, l.gy - 6, s * C + 12, s * R + 12, 10); g.fill();
        for (q = 0; q < R * C; q++) {
          var x = l.gx + (q % C) * s, y = l.gy + Math.floor(q / C) * s;
          g.fillStyle = grid[q] >= 0 ? pcs[grid[q]].col : 'rgba(255,255,255,.12)'; rr(x + 2, y + 2, s - 4, s - 4, 6); g.fill();
        }
        for (i = 0; i < pcs.length; i++) {
          var sl = l.sl[i]; if (!sl) continue;
          pcs[i].rel.forEach(function (rl, k) {
            var cx = sl.x + sl.ox + rl[1] * l.cs, cy = sl.y + sl.oy + rl[0] * l.cs;
            g.fillStyle = pcs[i].col; rr(cx + 1, cy + 1, l.cs - 2, l.cs - 2, 4); g.fill();
            if (k === 0) { g.fillStyle = '#fff'; g.beginPath(); g.arc(cx + l.cs / 2, cy + l.cs / 2, Math.max(2.5, l.cs * 0.14), 0, 7); g.fill(); }
          });
          if (sel === i) { g.strokeStyle = '#fff'; g.lineWidth = 3; rr(sl.x - 6, sl.y - 6, sl.w + 12, sl.h + 12, 8); g.stroke(); }
        }
        foot(); hh(); fim(st);
      }
    };

  }
});
