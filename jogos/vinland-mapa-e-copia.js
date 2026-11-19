/* Mapa de Vinland — o mapa e a cópia (invenção). */
BTJogo.registrar({
  canvas: 'jogo-vinland',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O mapa e a cópia",
    "sub": "Dois mapas parecem iguais, mas a cópia tem diferenças: algo some, muda de cor ou de lugar. Toque no ponto onde você vê uma diferença, em qualquer um dos dois mapas. Um toque errado conta como erro, e três erros encerram a partida. São 3 pares de mapas, com mais diferenças a cada par.",
    "perdeu": "Você errou três vezes",
    "v1": "Cópia desmascarada!",
    "v2": "O Mapa de Vinland foi apresentado ao público em 1965; em 2021, a análise da tinta, com um composto de titânio só produzido a partir dos anos 1920, mostrou que é falso. Achar diferenças entre dois mapas é invenção.",
    "h1": "Diferenças",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The map and the copy",
    "sub": "Two maps look the same, but the copy has differences: something vanishes, changes colour or moves. Tap the spot where you see a difference, on either of the two maps. A wrong tap counts as a mistake, and three mistakes end the game. There are 3 pairs of maps, with more differences each time.",
    "perdeu": "You made three mistakes",
    "v1": "Copy exposed!",
    "v2": "The Vinland Map was presented to the public in 1965; in 2021, analysis of its ink, with a titanium compound not made before the 1920s, showed it to be a fake. Finding differences between two maps is invented.",
    "h1": "Differences",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Kartet og kopien",
    "sub": "To kart ser like ut, men kopien har forskjeller: noe forsvinner, skifter farge eller flytter seg. Trykk på stedet der du ser en forskjell, på et av de to kartene. Et feil trykk teller som en feil, og tre feil avslutter spillet. Det er 3 kartpar, med flere forskjeller for hvert par.",
    "perdeu": "Du gjorde tre feil",
    "v1": "Kopien er avslørt!",
    "v2": "Vinland-kartet ble presentert for allmennheten i 1965; i 2021 viste en analyse av blekket, med en titanforbindelse som ikke ble laget før på 1920-tallet, at det er en forfalskning. Å finne forskjeller mellom to kart er oppfunnet.",
    "h1": "Forskjeller",
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
    var ND = [4, 5, 6], LIM = 420, PAL = ['#c9a45a', '#6a8f5a', '#b8553f', '#5a7fa8', '#8a6a9a', '#d9d0a8'];
    var A = [], Bc = [], diffs = [], found = [], err = 0;
    function mid(p) { return p.k === 'l' ? { x: (p.x + p.x2) / 2, y: (p.y + p.y2) / 2 } : { x: p.x, y: p.y }; }
    function scene() {
      var s = [], i, k, a, x, y;
      var pts = []; for (k = 0; k < 10; k++) { a = k * Math.PI / 5; var rad = 0.2 + Math.random() * 0.1; pts.push([Math.cos(a) * rad, Math.sin(a) * rad * 0.8]); }
      s.push({ k: 'p', x: 0.5, y: 0.5, pts: pts, col: PAL[0], land: true });
      for (i = 0; i < 6; i++) { do { x = 0.12 + Math.random() * 0.76; y = 0.12 + Math.random() * 0.76; } while (Math.hypot(x - 0.5, (y - 0.5) * 1.2) < 0.32); s.push({ k: 'c', x: x, y: y, r: 0.035 + Math.random() * 0.03, col: PAL[1 + i % 3] }); }
      for (i = 0; i < 4; i++) { do { x = 0.1 + Math.random() * 0.8; y = 0.1 + Math.random() * 0.8; } while (Math.hypot(x - 0.5, (y - 0.5) * 1.2) < 0.3); s.push({ k: 'p', x: x, y: y, pts: [[-0.03, 0.02], [0.03, 0.02], [0, -0.04]], col: PAL[2 + i % 3] }); }
      for (i = 0; i < 5; i++) { do { x = 0.1 + Math.random() * 0.8; y = 0.1 + Math.random() * 0.8; } while (Math.hypot(x - 0.5, (y - 0.5) * 1.2) < 0.3); s.push({ k: 'l', x: x - 0.04, y: y, x2: x + 0.04, y2: y, col: PAL[3] }); }
      return s;
    }
    function load(i) {
      A = scene(); Bc = JSON.parse(JSON.stringify(A)); diffs = []; found = []; err = 0;
      var ids = []; for (var k = 1; k < A.length; k++) ids.push(k); sh(ids);
      for (var d = 0; d < ND[i]; d++) {
        var id = ids[d], p = Bc[id], ty = Math.floor(Math.random() * 3); if (p.k === 'l' && ty === 1) ty = 0;
        var m0 = mid(A[id]);
        if (ty === 0) p.gone = true;
        else if (ty === 1) { var c2; do { c2 = PAL[Math.floor(Math.random() * PAL.length)]; } while (c2 === p.col); p.col = c2; }
        else { var sx = (Math.random() < 0.5 ? -1 : 1) * 0.07, sy = (Math.random() < 0.5 ? -1 : 1) * 0.06; p.x += sx; p.y += sy; if (p.k === 'l') { p.x2 += sx; p.y2 += sy; } }
        diffs.push({ x: m0.x, y: m0.y });
      }
    }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function panels() {
      var W = api.w, H = api.h, land = W >= H, ps, a, b;
      if (land) { ps = Math.min((W - 36) / 2, H - 70 - 34); a = { x: W / 2 - ps - 6, y: 66 + (H - 66 - 28 - ps) / 2 }; b = { x: W / 2 + 6, y: a.y }; }
      else { ps = Math.min(W - 24, (H - 66 - 28 - 12) / 2); a = { x: (W - ps) / 2, y: 62 }; b = { x: a.x, y: 62 + ps + 12 }; }
      return { ps: ps, a: a, b: b };
    }
    function dpos() { var P = panels(), a = []; for (var i = 0; i < diffs.length; i++) if (!found[i]) a.push({ x: P.b.x + diffs[i].x * P.ps, y: P.b.y + diffs[i].y * P.ps }); return a; }
    function tap(u, v) {
      if (pend > 0 || st !== 'play') return; var best = -1, bd = 1e9, i;
      for (i = 0; i < diffs.length; i++) if (!found[i]) { var d = Math.hypot(u - diffs[i].x, v - diffs[i].y); if (d < bd) { bd = d; best = i; } }
      if (best >= 0 && bd < 0.075) { found[best] = true; if (api.nota) api.nota(560, 0.08, 'triangle', 0.05); var n = 0; for (i = 0; i < diffs.length; i++) if (found[i]) n++; if (n === diffs.length) lvlUp(); }
      else { err++; if (api.nota) api.nota(160, 0.1, 'sawtooth', 0.05); if (err >= 3) st = 'lose'; }
    }
    function drawScene(s, ox, oy, ps) {
      g.fillStyle = '#d8cfae'; rr(ox, oy, ps, ps, 10); g.fill(); g.strokeStyle = '#8a7a4a'; g.lineWidth = 3; rr(ox, oy, ps, ps, 10); g.stroke();
      for (var i = 0; i < s.length; i++) {
        var p = s[i]; if (p.gone) continue; g.fillStyle = p.col; g.strokeStyle = p.col;
        if (p.k === 'c') { g.beginPath(); g.arc(ox + p.x * ps, oy + p.y * ps, p.r * ps, 0, 7); g.fill(); }
        else if (p.k === 'p') { g.beginPath(); for (var j = 0; j < p.pts.length; j++) { var X = ox + (p.x + p.pts[j][0]) * ps, Y = oy + (p.y + p.pts[j][1]) * ps; if (j) g.lineTo(X, Y); else g.moveTo(X, Y); } g.closePath(); g.fill(); }
        else { g.lineWidth = 3; g.beginPath(); g.moveTo(ox + p.x * ps, oy + p.y * ps); g.lineTo(ox + p.x2 * ps, oy + p.y2 * ps); g.stroke(); }
      }
    }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lvl: lvl, pend: pend, err: err, pos: dpos() }; },
      down: function (x, y) {
        if (menu()) return; var P = panels(), u, v;
        if (x >= P.a.x && x <= P.a.x + P.ps && y >= P.a.y && y <= P.a.y + P.ps) { u = (x - P.a.x) / P.ps; v = (y - P.a.y) / P.ps; tap(u, v); }
        else if (x >= P.b.x && x <= P.b.x + P.ps && y >= P.b.y && y <= P.b.y + P.ps) { u = (x - P.b.x) / P.ps; v = (y - P.b.y) / P.ps; tap(u, v); }
      },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) { tick(dt, load); },
      draw: function () {
        var P = panels(), i; bg('#2a261a', '#0c0a06');
        drawScene(A, P.a.x, P.a.y, P.ps); drawScene(Bc, P.b.x, P.b.y, P.ps);
        for (i = 0; i < diffs.length; i++) if (found[i]) for (var q = 0; q < 2; q++) { var o = q ? P.b : P.a; g.strokeStyle = '#2ecc71'; g.lineWidth = 3; g.beginPath(); g.arc(o.x + diffs[i].x * P.ps, o.y + diffs[i].y * P.ps, P.ps * 0.06, 0, 7); g.stroke(); }
        var nf = 0; for (i = 0; i < diffs.length; i++) if (found[i]) nf++;
        txt(String(Math.min(lvl + 1, NL)) + '/' + NL, api.w - 34, 22, 14, '#c9b3f2');
        bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, '#ffd88a');
        hud(T.h1 + ' ' + nf + '/' + diffs.length, T.h2 + ' ' + err + '/3', true); fim(st);
      }
    };

  }
});
