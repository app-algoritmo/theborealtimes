/* Flateyjarbók — nonograma de 5 por 5 (invenção). */
BTJogo.registrar({
  canvas: 'jogo-flatey',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As folhas da Flateyjarbók",
    "sub": "Os números ao lado de cada linha e no alto de cada coluna dizem quantas casas seguidas devem ser pintadas, na ordem. Toque nas casas que devem ser pintadas, até revelar o desenho. Cada casa errada conta um erro; até 4 erros e 240 segundos. (Teclado: setas movem, Espaço pinta.)",
    "perdeu": "Foram erros demais ou o tempo acabou",
    "v1": "O desenho da folha apareceu!",
    "v2": "A Flateyjarbók tem 225 folhas de pergaminho, escritas entre 1387 e 1394, e o padre Magnús Þórhallsson também desenhou as ilustrações. O desenho do jogo é invenção.",
    "h1": "Casas",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The leaves of the Flateyjarbók",
    "sub": "The numbers beside each row and above each column say how many squares in a row must be filled, in order. Tap the squares that must be filled until the picture appears. Each wrong square counts as a mistake; up to 4 mistakes and 240 seconds. (Keyboard: arrows move, Space fills.)",
    "perdeu": "Too many mistakes or time ran out",
    "v1": "The picture on the leaf appeared!",
    "v2": "The Flateyjarbók has 225 vellum leaves, written between 1387 and 1394, and the priest Magnús Þórhallsson also drew the illustrations. The picture in the game is invented.",
    "h1": "Squares",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Bladene i Flateyjarbók",
    "sub": "Tallene ved siden av hver rad og over hver kolonne forteller hvor mange felt på rad som skal fylles, i rekkefølge. Trykk på feltene som skal fylles, til bildet viser seg. Hvert feil felt teller som en feil; opptil 4 feil og 240 sekunder. (Tastatur: piler flytter, mellomrom fyller.)",
    "perdeu": "For mange feil eller tiden tok slutt",
    "v1": "Bildet på bladet kom fram!",
    "v2": "Flateyjarbók har 225 pergamentblad, skrevet mellom 1387 og 1394, og presten Magnús Þórhallsson tegnet også illustrasjonene. Bildet i spillet er oppfunnet.",
    "h1": "Felt",
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
    var N = 5, MAXE = 4, LIM = 240;
    var sol = [], fill = [], rowc = [], colc = [], cur = 0, err = 0, t = 0, shk = 0, shc = -1;
    function clue(a) { var o = [], n = 0; a.forEach(function (v) { if (v) n++; else if (n) { o.push(n); n = 0; } }); if (n) o.push(n); return o.length ? o : [0]; }
    function pats(cl) { var out = []; for (var m = 0; m < 32; m++) { var a = []; for (var i = 0; i < 5; i++) a.push((m >> i) & 1); if (clue(a).join() === cl.join()) out.push(a); } return out; }
    function unique(rc, cc) {
      var P = rc.map(pats), n = 0, rows = [];
      function go(r) { if (n > 1) return; if (r === 5) { for (var c = 0; c < 5; c++) { if (clue(rows.map(function (x) { return x[c]; })).join() !== cc[c].join()) return; } n++; return; } P[r].forEach(function (p) { rows[r] = p; go(r + 1); }); }
      go(0); return n === 1;
    }
    function gen() {
      for (var tr = 0; tr < 400; tr++) {
        var s = []; for (var i = 0; i < 25; i++) s.push(Math.random() < 0.55 ? 1 : 0);
        var rc = [], cc = [], r, c; for (r = 0; r < 5; r++) rc.push(clue(s.slice(r * 5, r * 5 + 5))); for (c = 0; c < 5; c++) cc.push(clue([0, 1, 2, 3, 4].map(function (k) { return s[k * 5 + c]; })));
        if (s.reduce(function (a, b) { return a + b; }, 0) < 11) continue;
        if (unique(rc, cc)) { sol = s; rowc = rc; colc = cc; return; }
      }
      sol = [1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1]; rowc = []; colc = [];
      for (var r2 = 0; r2 < 5; r2++) rowc.push(clue(sol.slice(r2 * 5, r2 * 5 + 5))); for (var c2 = 0; c2 < 5; c2++) colc.push(clue([0, 1, 2, 3, 4].map(function (k) { return sol[k * 5 + c2]; })));
    }
    function reset() { gen(); fill = []; for (var i = 0; i < 25; i++) fill.push(0); cur = 12; err = 0; t = 0; shk = 0; st = 'play'; }
    function lay() { var W = api.w, H = api.h, cs = Math.max(34, Math.min((W - 110) / 5, (H - 168) / 5, 66)), x0 = (W - cs * 5) / 2 + 28, y0 = 112; return { cs: cs, x0: x0, y0: y0 }; }
    function cpos(i) { var L = lay(); return { x: L.x0 + (i % 5 + 0.5) * L.cs, y: L.y0 + (Math.floor(i / 5) + 0.5) * L.cs }; }
    function tryc(i) {
      if (st !== 'play' || fill[i]) return; cur = i;
      if (sol[i]) { fill[i] = 1; if (api.nota) api.nota(420 + (i % 5) * 50, 0.1, 'triangle', 0.05); var done = true; for (var k = 0; k < 25; k++) if (sol[k] && !fill[k]) done = false; if (done) st = 'win'; }
      else { err++; shk = 0.35; shc = i; if (api.nota) api.nota(110, 0.25, 'sawtooth', 0.06); if (err >= MAXE) st = 'lose'; }
    }
    function at(x, y) { var L = lay(); for (var i = 0; i < 25; i++) { var p = cpos(i); if (Math.abs(x - p.x) < L.cs / 2 && Math.abs(y - p.y) < L.cs / 2) return i; } return -1; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { var ps = []; for (var i = 0; i < 25; i++) ps.push(cpos(i)); return { st: st, sol: sol.slice(), fill: fill.slice(), err: err, t: t, cells: ps, rowc: rowc, colc: colc }; },
      down: function (x, y) { if (menu()) return; var i = at(x, y); if (i >= 0) tryc(i); },
      move: function () {}, up: function () {},
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'Space' || k === 'Enter') { tryc(cur); return; } var dr = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -5, ArrowDown: 5 }[k]; if (dr) { var n = cur + dr; if (n >= 0 && n < 25 && (Math.abs(dr) === 5 || Math.floor(n / 5) === Math.floor(cur / 5))) cur = n; } },
      update: function (dt) { if (shk > 0) shk -= dt; if (st !== 'play') return; t += dt; if (t >= LIM) st = 'lose'; },
      draw: function () {
        var L = lay(), i; bg('#33281c', '#120d08');
        g.fillStyle = 'rgba(240,226,190,.08)'; rr(L.x0 - L.cs * 1.3, L.y0 - 56, L.cs * 6.3, L.cs * 5 + 62, 10); g.fill();
        for (i = 0; i < 25; i++) {
          var p = cpos(i), dx = (shk > 0 && shc === i) ? Math.sin(shk * 60) * 4 : 0;
          g.fillStyle = fill[i] ? '#d9a93a' : 'rgba(240,226,190,.16)'; rr(p.x - L.cs / 2 + 2 + dx, p.y - L.cs / 2 + 2, L.cs - 4, L.cs - 4, 6); g.fill();
          if (i === cur && st === 'play') { g.strokeStyle = '#fff'; g.lineWidth = 2; rr(p.x - L.cs / 2 + 2, p.y - L.cs / 2 + 2, L.cs - 4, L.cs - 4, 6); g.stroke(); }
        }
        var fs = Math.max(11, Math.min(17, L.cs * 0.3));
        for (i = 0; i < 5; i++) {
          txt(rowc[i].join(' '), L.x0 - 8, cpos(i * 5).y + fs * 0.35, fs, '#f3ecd2', 'right');
          var cl = colc[i]; for (var k = 0; k < cl.length; k++) txt(String(cl[k]), cpos(i).x, L.y0 - 8 - (cl.length - 1 - k) * (fs + 2), fs, '#f3ecd2');
        }
        bar(api.w / 2 - 110, api.h - 14, 220, 5, (LIM - t) / LIM, LIM - t < 40 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + fill.reduce(function (a, b) { return a + b; }, 0) + '/' + sol.reduce(function (a, b) { return a + b; }, 0), T.h2 + ' ' + err + '/' + MAXE, true);
        fim(st);
      }
    };

  }
});
