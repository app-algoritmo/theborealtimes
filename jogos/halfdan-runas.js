/* Runas na Hagia Sophia — encontre as runas escondidas no mármore. */
BTJogo.registrar({
  canvas: 'jogo-halfdan',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Runas na Hagia Sophia",
    "sub": "O parapeito de mármore está coberto de riscos de visitantes. Entre eles há cinco runas verdadeiras, de traços retos com uma haste. Toque nelas. Cada toque errado conta como erro, e os guardas chegam em cinquenta segundos.",
    "perdeu": "Os guardas chegaram",
    "v1": "Cinco runas encontradas!",
    "v2": "Numa galeria da Hagia Sophia há uma inscrição em runas atribuída a um certo Halfdan. O mármore, os riscos e as cinco runas do jogo são invenção.",
    "h1": "Runas",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Runes in Hagia Sophia",
    "sub": "The marble parapet is covered with visitors' scratches. Among them are five true runes, with straight strokes and a staff. Tap them. Every wrong tap counts as a mistake, and the guards arrive in fifty seconds.",
    "perdeu": "The guards arrived",
    "v1": "Five runes found!",
    "v2": "In a gallery of Hagia Sophia there is a runic inscription attributed to a man named Halfdan. The marble, the scratches and the five runes in the game are made up.",
    "h1": "Runes",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Runer i Hagia Sofia",
    "sub": "Marmorrekkverket er dekket av besøkendes riss. Blant dem er fem ekte runer, med rette streker og en stav. Trykk på dem. Hvert feil trykk teller som feil, og vaktene kommer om femti sekunder.",
    "perdeu": "Vaktene kom",
    "v1": "Fem runer funnet!",
    "v2": "I et galleri i Hagia Sofia finnes en runeinnskrift tilskrevet en mann ved navn Halvdan. Marmoret, rissene og de fem runene i spillet er diktet opp.",
    "h1": "Runer",
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
    var NEED = 5, MAXE = 3, LIM = 50, ND = 42;
    var runes = [], decoys = [], found = 0, errs = 0, tl = 0, lock = 0, bad = null;
    var GL = [[[[.3, 1], [.3, 0]], [[.3, .35], [.8, .05]], [[.3, .65], [.8, .35]]], [[[.25, 1], [.25, 0]], [[.25, .3], [.75, .5], [.25, .7]]], [[[.25, 1], [.25, 0], [.75, .3], [.25, .55]], [[.25, .55], [.75, 1]]], [[[.25, 1], [.25, 0]], [[.75, 1], [.75, 0]], [[.25, .4], [.75, .6]]], [[[.5, 1], [.5, 0]], [[.2, .35], [.8, .65]]], [[[.5, 1], [.5, 0]], [[.2, .3], [.5, 0], [.8, .3]]]];
    function pan() { var W = api.w, H = api.h; return { x: W * 0.05, y: H * 0.2, w: W * 0.9, h: H * 0.68 }; }
    function rr(a, b) { return a + Math.random() * (b - a); }
    function place(list, r, minD) { var p = pan(), tries = 0, x, y; do { x = rr(p.x + 36, p.x + p.w - 36); y = rr(p.y + 36, p.y + p.h - 36); tries++; } while (tries < 300 && list.some(function (o) { return Math.hypot(o.x - x, o.y - y) < minD; })); return { x: x, y: y }; }
    function reset() {
      st = 'play'; found = 0; errs = 0; tl = LIM; lock = 0; bad = null; runes = []; decoys = [];
      var used = [], gi = [0, 1, 2, 3, 4, 5].sort(function () { return Math.random() - 0.5; }).slice(0, NEED), all = [];
      gi.forEach(function (k) { var p = place(all, 0, 78); var o = { x: p.x, y: p.y, k: k, s: rr(34, 42), ok: false }; runes.push(o); all.push(o); });
      for (var i = 0; i < ND; i++) {
        var p2 = place(all, 0, 44), kind = Math.random() < 0.5 ? 'curva' : 'ang', pts = [], s = rr(24, 40);
        if (kind === 'curva') { var cx = rr(-.2, .2); pts = [[0.1, 0.8], [0.4 + cx, 0.2], [0.9, 0.7]]; } else { var m = 3 + Math.floor(Math.random() * 2); for (var j = 0; j < m; j++) pts.push([rr(0.05, 0.95), rr(0.05, 0.95)]); }
        var o2 = { x: p2.x, y: p2.y, kind: kind, pts: pts, s: s, rot: rr(-0.8, 0.8) }; decoys.push(o2); all.push(o2);
      }
    }
    function tocar(x, y) {
      if (st !== 'play' || lock > 0) return;
      for (var i = 0; i < runes.length; i++) { var r = runes[i]; if (!r.ok && Math.hypot(x - r.x, y - r.y) < r.s * 0.75) { r.ok = true; found++; if (found >= NEED) st = 'win'; return; } }
      errs++; bad = { x: x, y: y, l: 0.5 }; lock = 0.35; if (errs >= MAXE) st = 'lose';
    }
    function trace(o, glyph, color, lw) { g.strokeStyle = color; g.lineWidth = lw; g.lineJoin = 'round'; g.lineCap = 'round'; glyph.forEach(function (seg) { g.beginPath(); seg.forEach(function (p, i) { var px = o.x + (p[0] - 0.5) * o.s, py = o.y + (p[1] - 0.5) * o.s * 1.2; if (i === 0) g.moveTo(px, py); else g.lineTo(px, py); }); g.stroke(); }); }
    return {
      pausar: function () {},
      dbg: function () { return { st: st, found: found, errs: errs, tl: tl, runes: runes.map(function (r) { return { x: r.x, y: r.y, ok: r.ok }; }), decoys: decoys.map(function (d) { return { x: d.x, y: d.y }; }) }; },
      down: function (x, y) { if (menu()) return; tocar(x, y); },
      update: function (dt) { if (st !== 'play') return; tl -= dt; lock = Math.max(0, lock - dt); if (bad) { bad.l -= dt; if (bad.l <= 0) bad = null; } if (tl <= 0) st = 'lose'; },
      draw: function () {
        var W = api.w, H = api.h, p = pan();
        bg('#3a3340', '#1b1822');
        var mg = g.createLinearGradient(p.x, p.y, p.x + p.w, p.y + p.h); mg.addColorStop(0, '#e9e4d8'); mg.addColorStop(1, '#c9c2b2'); g.fillStyle = mg; g.fillRect(p.x, p.y, p.w, p.h);
        g.strokeStyle = 'rgba(120,110,100,.25)'; g.lineWidth = 1.2; for (var v = 0; v < 6; v++) { g.beginPath(); g.moveTo(p.x + p.w * (v / 6), p.y); g.bezierCurveTo(p.x + p.w * (v / 6) + 40, p.y + p.h * 0.3, p.x + p.w * (v / 6) - 30, p.y + p.h * 0.7, p.x + p.w * (v / 6) + 10, p.y + p.h); g.stroke(); }
        decoys.forEach(function (d) { g.save(); g.translate(d.x, d.y); g.rotate(d.rot); var o = { x: 0, y: 0, s: d.s }; g.strokeStyle = 'rgba(70,60,55,.5)'; g.lineWidth = 2.2; g.lineCap = 'round'; g.beginPath(); d.pts.forEach(function (q, i) { var px = (q[0] - 0.5) * d.s, py = (q[1] - 0.5) * d.s; if (i === 0) g.moveTo(px, py); else if (d.kind === 'curva' && i === 1 && d.pts.length === 3) g.quadraticCurveTo(px, py - d.s * 0.4, (d.pts[2][0] - 0.5) * d.s, (d.pts[2][1] - 0.5) * d.s); else if (!(d.kind === 'curva' && i === 2)) g.lineTo(px, py); }); g.stroke(); g.restore(); });
        runes.forEach(function (r) { trace(r, GL[r.k], r.ok ? '#d89a1a' : 'rgba(70,60,55,.62)', r.ok ? 4 : 2.6); if (r.ok) { g.strokeStyle = '#ffd88a'; g.lineWidth = 2; g.beginPath(); g.arc(r.x, r.y, r.s * 0.7, 0, 6.29); g.stroke(); } });
        if (bad) { txt('✗', bad.x, bad.y + 8, 28, '#c0392b'); }
        var bw = Math.min(W * 0.5, 300); g.fillStyle = 'rgba(255,255,255,.2)'; g.fillRect(W - bw - 22, 26, bw, 7); g.fillStyle = tl < 12 ? '#ff8a7a' : '#c9b3f2'; g.fillRect(W - bw - 22, 26, bw * Math.max(0, tl) / LIM, 7);
        hud(T.h1 + ' ' + found + '/' + NEED, T.h2 + ' ' + errs + '/' + MAXE, errs > 0);
        fim(st);
      }
    };
  }
});
