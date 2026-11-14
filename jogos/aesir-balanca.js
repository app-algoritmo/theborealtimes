/* A balança da paz — divida os presentes entre os dois lados até a balança ficar parelha. */
BTJogo.registrar({
  canvas: 'jogo-aesir',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A balança da paz",
    "sub": "Æsir e Vanir fazem as pazes trocando presentes. Toque num presente para movê-lo: bandeja, prato da esquerda, prato da direita. Distribua todos os presentes de modo que os dois pratos pesem o mesmo. São três rodadas, e o tempo é curto.",
    "perdeu": "A paz não saiu a tempo",
    "v1": "A paz foi feita!",
    "v2": "Segundo Snorri, Æsir e Vanir fizeram a paz e trocaram reféns. A balança e os presentes são invenção do jogo.",
    "h1": "Rodadas",
    "h2": "Tempo",
    "dica": "bandeja"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The scales of peace",
    "sub": "The Æsir and Vanir make peace by exchanging gifts. Tap a gift to move it: tray, left pan, right pan. Place every gift so both pans weigh the same. Three rounds, and little time.",
    "perdeu": "Peace did not come in time",
    "v1": "Peace is made!",
    "v2": "According to Snorri, the Æsir and Vanir made peace and exchanged hostages. The scales and the gifts are made up for the game.",
    "h1": "Rounds",
    "h2": "Time",
    "dica": "tray"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Fredens vekt",
    "sub": "Æser og vaner slutter fred ved å bytte gaver. Trykk på en gave for å flytte den: brett, venstre vektskål, høyre vektskål. Plasser alle gavene slik at begge skålene veier likt. Tre runder, og knapp tid.",
    "perdeu": "Freden kom ikke i tide",
    "v1": "Freden er sluttet!",
    "v2": "Ifølge Snorre sluttet æser og vaner fred og byttet gisler. Vekten og gavene er diktet opp for spillet.",
    "h1": "Runder",
    "h2": "Tid",
    "dica": "brett"
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
    var R = 3, LIM = 90, NI = 8;
    var it = [], rd = 0, tmr = LIM, wait = 0, cur = 0;
    function parts(T) { var a = [], rem = T, i; for (i = 0; i < 3; i++) { var left = 3 - i, lo = Math.max(1, rem - 9 * left), hi = Math.min(9, rem - left); a.push(lo + Math.floor(Math.random() * (hi - lo + 1))); rem -= a[i]; } a.push(rem); return a; }
    function newRound() {
      var T = 12 + Math.floor(Math.random() * 9), a = parts(T), b = parts(T); it = [];
      a.forEach(function (w) { it.push({ w: w, s: 0, ans: 1 }); }); b.forEach(function (w) { it.push({ w: w, s: 0, ans: 2 }); });
      for (var k = it.length - 1; k > 0; k--) { var j = Math.floor(Math.random() * (k + 1)), t = it[k]; it[k] = it[j]; it[j] = t; }
      wait = 0; cur = 0;
    }
    function setup() { rd = 0; tmr = LIM; newRound(); }
    function reset() { setup(); st = 'play'; }
    function sums() { var l = 0, r = 0, f = true; it.forEach(function (x) { if (x.s === 1) l += x.w; else if (x.s === 2) r += x.w; else f = false; }); return { l: l, r: r, full: f }; }
    function pos(i) {
      var W = api.w, H = api.h, s = it[i].s, k = 0, j; if (s === 0) return { x: W * (i + 0.5) / NI, y: H - 66 };
      for (j = 0; j < i; j++) if (it[j].s === s) k++; var cx = W * (s === 1 ? 0.26 : 0.74); return { x: cx + ((k % 2) - 0.5) * 58, y: H * 0.5 - 8 - Math.floor(k / 2) * 54 };
    }
    function tap(i) { if (st !== 'play' || wait > 0 || i < 0) return; it[i].s = (it[i].s + 1) % 3; var m = sums(); if (m.full && m.l === m.r) { rd++; if (rd >= R) st = 'win'; else wait = 1.0; } }
    setup();
    return {
      pausar: function () {},
      dbg: function () { return { st: st, rd: rd, tmr: tmr, wait: wait, items: it.map(function (x, i) { var p = pos(i); return { w: x.w, s: x.s, ans: x.ans, x: p.x, y: p.y }; }) }; },
      down: function (x, y) { if (menu()) return; var b = -1, bd = 1e9; for (var i = 0; i < it.length; i++) { var p = pos(i), d = Math.hypot(x - p.x, y - p.y); if (d < bd) { bd = d; b = i; } } if (bd <= 32) { cur = b; tap(b); } },
      key: function (c, d) {
        if (!d) return; if (c === 'ArrowLeft' || c === 'KeyA') cur = (cur + NI - 1) % NI; else if (c === 'ArrowRight' || c === 'KeyD') cur = (cur + 1) % NI;
        else if (c === 'Space' || c === 'Enter' || c === 'ArrowUp' || c === 'ArrowDown') { if (st !== 'play') menu(); else tap(cur); }
      },
      update: function (dt) { if (st !== 'play') return; tmr -= dt; if (tmr <= 0) { st = 'lose'; return; } if (wait > 0) { wait -= dt; if (wait <= 0) newRound(); } },
      draw: function () {
        var W = api.w, H = api.h, m = sums(), i, ang = Math.max(-0.22, Math.min(0.22, (m.r - m.l) * 0.02)), cx = W / 2, cy = H * 0.26;
        bg('#1d2a33', '#0d1419');
        g.save(); g.translate(cx, cy); g.rotate(ang); g.fillStyle = '#8a6a3a'; g.fillRect(-W * 0.38, -5, W * 0.76, 10); g.restore();
        g.fillStyle = '#6b4a2a'; g.fillRect(cx - 6, cy, 12, H * 0.28); g.fillRect(cx - 34, cy + H * 0.28, 68, 10);
        var lx = cx - Math.cos(ang) * W * 0.38, ly = cy - Math.sin(ang) * W * 0.38, rx = cx + Math.cos(ang) * W * 0.38, ry = cy + Math.sin(ang) * W * 0.38;
        g.strokeStyle = '#9a8a6a'; g.lineWidth = 2; [[lx, ly, W * 0.26], [rx, ry, W * 0.74]].forEach(function (p) { g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(p[2] - 70, H * 0.5 + 14); g.moveTo(p[0], p[1]); g.lineTo(p[2] + 70, H * 0.5 + 14); g.stroke(); g.fillStyle = '#5a4a3a'; g.fillRect(p[2] - 80, H * 0.5 + 14, 160, 10); });
        txt(String(m.l), W * 0.26, H * 0.5 + 52, 22, '#f3ecd2'); txt(String(m.r), W * 0.74, H * 0.5 + 52, 22, '#f3ecd2');
        g.fillStyle = 'rgba(255,255,255,.07)'; g.fillRect(0, H - 100, W, 100); txt(T.dica, 44, H - 100 + 18, 13, 'rgba(255,255,255,.45)');
        for (i = 0; i < it.length; i++) { var p = pos(i), x = it[i]; g.fillStyle = x.s === 0 ? '#c9a23a' : x.s === 1 ? '#4a8ad9' : '#4aa86a'; g.beginPath(); g.arc(p.x, p.y, 24, 0, 6.29); g.fill(); g.strokeStyle = st === 'play' && cur === i ? '#fff' : 'rgba(0,0,0,.4)'; g.lineWidth = 3; g.stroke(); txt(String(x.w), p.x, p.y + 8, 22, '#fff'); }
        if (wait > 0) txt('✓', W / 2, H * 0.4, 80, 'rgba(157,255,182,.85)');
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 20 ? '#c0392b' : '#4a8ad9');
        hud(T.h1 + ' ' + rd + '/' + R, T.h2 + ' ' + Math.max(0, Math.ceil(tmr)), false);
        fim(st);
      }
    };
  }
});
