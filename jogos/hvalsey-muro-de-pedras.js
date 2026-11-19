/* Hvalsey — o muro de pedras (invenção). */
BTJogo.registrar({
  canvas: 'jogo-hvalsey',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O muro de pedras",
    "sub": "Uma pedra pesada vai de um lado a outro. Toque para soltá-la sobre o muro. O que passar da borda da pedra de baixo se perde, e a parede fica mais estreita. Se a pedra cair toda fora, conta um erro. Com três erros o jogo acaba. Chegue à linha dourada. São 3 muros.",
    "perdeu": "O muro caiu",
    "v1": "Muro de pé!",
    "v2": "A igreja de pedra de Hvalsey, na Groenlândia, tem paredes de pedra de muitas toneladas. Empilhar no ritmo certo é invenção.",
    "h1": "Muro",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The wall of stones",
    "sub": "A heavy stone slides from side to side. Tap to drop it onto the wall. Whatever sticks out past the stone below is lost, and the wall gets narrower. If the stone falls completely outside, it counts as a mistake. With three mistakes the game ends. Reach the golden line. There are 3 walls.",
    "perdeu": "The wall fell",
    "v1": "Wall standing!",
    "v2": "The stone church at Hvalsey, in Greenland, has walls of stones weighing many tonnes. Stacking to the right rhythm is invented.",
    "h1": "Wall",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Muren av steiner",
    "sub": "En tung stein glir fra side til side. Trykk for å slippe den på muren. Det som stikker ut forbi steinen under, går tapt, og muren blir smalere. Hvis steinen faller helt utenfor, teller det som en feil. Med tre feil er spillet slutt. Nå den gylne linjen. Det er 3 murer.",
    "perdeu": "Muren falt",
    "v1": "Muren står!",
    "v2": "Steinkirken i Hvalsey på Grønland har vegger av steiner som veier mange tonn. Å stable i riktig rytme er oppfunnet.",
    "h1": "Mur",
    "h2": "Feil"
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
    var TG = [6, 8, 10], LIM = 300, MAXE = 3, err = 0, rows = [], bx = 0, bw = 0, dir = 1, tower = 0, fall = null, shake = 0;
    function geo() { var W = api.w, H = api.h, rh = Math.min(34, (H - 150) / 11); return { W: W, H: H, rh: rh, base: H - 36, lo: 40, hi: W - 40, w0: Math.min(W * 0.4, 220) }; }
    function load(i) {
      var G0 = geo(); rows = [{ x: G0.W / 2 - G0.w0 / 2, w: G0.w0 }]; bw = G0.w0; bx = G0.lo; dir = 1; fall = null; err = 0;
    }
    function spd() { var G0 = geo(); return (G0.hi - G0.lo) * (0.55 + 0.14 * lvl); }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); st = 'play'; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { var G0 = geo(), top = rows[rows.length - 1]; return { st: st, lvl: lvl, pend: pend, err: err, bx: bx, tx: top.x, bw: bw, rows: rows.length, pos: [{ x: G0.W / 2, y: G0.H / 2 }] }; },
      down: function () {
        if (menu()) return; if (pend > 0 || st !== 'play') return;
        var top = rows[rows.length - 1], d = bx - top.x;
        if (Math.abs(d) < 8) { bx = top.x; d = 0; }
        var left = Math.max(bx, top.x), right = Math.min(bx + bw, top.x + top.w), ov = right - left;
        if (ov < 10) { err++; fall = { x: bx, y: 0, w: bw, v: 0 }; if (api.nota) api.nota(140, 0.3, 'sawtooth', 0.06); if (err >= MAXE) st = 'lose'; bx = geo().lo; dir = 1; return; }
        rows.push({ x: left, w: ov }); bw = ov; if (api.nota) api.nota(300 + rows.length * 25, 0.1, 'triangle', 0.06);
        if (rows.length - 1 >= TG[lvl]) { lvlUp(); }
      },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); else if (d && (k === ' ' || k === 'Space' || k === 'Enter') && st === 'play') this.down(); },
      update: function (dt) {
        if (st === 'play' && pend <= 0) { var G0 = geo(); bx += dir * spd() * dt; if (bx + bw > G0.hi) { bx = G0.hi - bw; dir = -1; } if (bx < G0.lo) { bx = G0.lo; dir = 1; } }
        if (fall) { fall.v += 900 * dt; fall.y += fall.v * dt; if (fall.y > 400) fall = null; }
        tick(dt, load);
      },
      draw: function () {
        var G0 = geo(), rh = G0.rh, n = rows.length, i; bg('#1a2a38', '#070d14');
        var vis = Math.floor((G0.base - 110) / rh), off = Math.max(0, n - vis);
        g.fillStyle = '#2d4a3a'; g.fillRect(0, G0.base, G0.W, G0.H - G0.base);
        for (i = 0; i < n; i++) { var y = G0.base - (i + 1 - off) * rh; if (y < 90 || y > G0.base) continue; g.fillStyle = 'hsl(' + (30 + (i % 4) * 6) + ',8%,' + (46 + (i % 3) * 5) + '%)'; rr(rows[i].x, y + 1, rows[i].w, rh - 2, 4); g.fill(); }
        var gy = G0.base - (TG[lvl] + 1 - off) * rh; if (gy > 92) { g.strokeStyle = '#ffd88a'; g.lineWidth = 2; g.setLineDash && g.setLineDash([8, 6]); g.beginPath(); g.moveTo(20, gy); g.lineTo(G0.W - 20, gy); g.stroke(); g.setLineDash && g.setLineDash([]); }
        var by = Math.max(96, G0.base - (n + 1 - off) * rh - 18); if (st === 'play') { g.fillStyle = '#d6cdb8'; rr(bx, by, bw, rh - 2, 4); g.fill(); }
        if (fall) { g.fillStyle = 'rgba(214,205,184,.8)'; rr(fall.x, by + fall.y, fall.w, rh - 2, 4); g.fill(); }
        foot(); hud(T.h1 + ' ' + Math.min(lvl + 1, NL) + '/' + NL, T.h2 + ' ' + err + '/' + MAXE, true); fim(st);
      }
    };

  }
});
