/* Vatnsdæla saga — o vale e as pedras claras e escuras (invenção). */
BTJogo.registrar({
  canvas: 'jogo-vatnsdaela',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As pedras do vale",
    "sub": "Cada casa do quadro 6 por 6 leva uma pedra clara ou escura. Toque numa casa para alternar: clara, escura, vazia. Regras: nunca três pedras iguais seguidas; cada linha e cada coluna tem 3 claras e 3 escuras; não há duas linhas iguais nem duas colunas iguais. Casas em vermelho quebram uma regra. As casas com moldura são fixas. Preencha o quadro.",
    "perdeu": "O tempo acabou antes de o vale ser preenchido",
    "v1": "O vale está preenchido!",
    "v2": "A Vatnsdæla saga é uma crônica familiar sobre o vale de Vatnsdalur, no norte da Islândia. Ingimundr Þorsteinsson, que lutou por Haroldo Cabelo Belo em Hafrsfjord, muda-se para lá por instigação de uma feiticeira. As pedras claras e escuras são invenção.",
    "h1": "Casas",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The stones of the valley",
    "sub": "Each square of the 6-by-6 board takes a light or a dark stone. Tap a square to cycle: light, dark, empty. Rules: never three equal stones in a row; every row and every column has 3 light and 3 dark; no two rows are equal and no two columns are equal. Squares in red break a rule. Squares with a frame are fixed. Fill the board.",
    "perdeu": "The time ran out before the valley was filled",
    "v1": "The valley is filled!",
    "v2": "The Vatnsdæla saga is a family chronicle about the valley of Vatnsdalur, in northern Iceland. Ingimundr Þorsteinsson, who fought for Harald Fairhair at Hafrsfjord, moves there at the instigation of a sorceress. The light and dark stones are invented.",
    "h1": "Squares",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Steinene i dalen",
    "sub": "Hver rute på brettet på 6 ganger 6 får en lys eller en mørk stein. Trykk på en rute for å bla: lys, mørk, tom. Regler: aldri tre like steiner på rad; hver rad og hver kolonne har 3 lyse og 3 mørke; ingen to rader er like og ingen to kolonner er like. Røde ruter bryter en regel. Ruter med ramme er faste. Fyll brettet.",
    "perdeu": "Tiden tok slutt før dalen var fylt",
    "v1": "Dalen er fylt!",
    "v2": "Vatnsdæla saga er en slektskrønike om dalen Vatnsdalur i Nord-Island. Ingimundr Þorsteinsson, som kjempet for Harald Hårfagre ved Hafrsfjord, flytter dit etter påtrykk fra en trollkvinne. De lyse og mørke steinene er oppfunnet.",
    "h1": "Ruter",
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
    var N = 6, LIM = 420;
    var PATS = [], sol = [], vals = [], given = [], t = 0;
    (function () { for (var m = 0; m < 64; m++) { var a = [], i, c = 0; for (i = 0; i < 6; i++) { a.push((m >> i) & 1); c += a[i]; } if (c !== 3) continue; var ok = true; for (i = 2; i < 6; i++) if (a[i] === a[i - 1] && a[i] === a[i - 2]) ok = false; if (ok) PATS.push(a); } })();
    function same(a, b) { for (var i = 0; i < 6; i++) if (a[i] !== b[i]) return false; return true; }
    function colok(rows) { var n = rows.length, c, i; if (n >= 3) for (c = 0; c < 6; c++) if (rows[n - 1][c] === rows[n - 2][c] && rows[n - 1][c] === rows[n - 3][c]) return false; return true; }
    function search(rows, giv, stop, out) {
      var n = rows.length, i, c, p, found = 0;
      if (n === 6) { for (c = 0; c < 6; c++) { var s = 0; for (i = 0; i < 6; i++) s += rows[i][c]; if (s !== 3) return 0; for (i = c + 1; i < 6; i++) { var eq = true; for (var r = 0; r < 6; r++) if (rows[r][c] !== rows[r][i]) eq = false; if (eq) return 0; } } if (out) out.push(rows.map(function (x) { return x.slice(); })); return 1; }
      var cand = out && out.rnd ? out.rnd(PATS) : PATS;
      for (p = 0; p < cand.length && found < stop; p++) {
        var a = cand[p], ok = true;
        for (c = 0; c < 6; c++) if (giv && giv[n * 6 + c] >= 0 && giv[n * 6 + c] !== a[c]) ok = false;
        if (!ok) continue;
        for (i = 0; i < n; i++) if (same(rows[i], a)) ok = false;
        if (!ok) continue;
        rows.push(a); if (colok(rows)) found += search(rows, giv, stop - found, out); rows.pop();
      }
      return found;
    }
    function shuf(l) { var a = l.slice(), i, j, x; for (i = a.length - 1; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
    function reset() {
      var out = []; out.rnd = shuf; search([], null, 1, out); var rows = out[0], i, j;
      sol = []; for (i = 0; i < 6; i++) for (j = 0; j < 6; j++) sol.push(rows[i][j] + 1);
      var o = shuf((function () { var a = []; for (var k = 0; k < 36; k++) a.push(k); return a; })()), gv = sol.map(function (v) { return v - 1; });
      for (i = 0; i < 36; i++) { var keep = gv[o[i]]; gv[o[i]] = -1; var rws = []; for (j = 0; j < 36; j += 6) rws.push(0); if (search([], gv, 2, null) !== 1) gv[o[i]] = keep; }
      vals = gv.map(function (v) { return v + 1; }); given = vals.map(function (v) { return v > 0; }); t = 0; st = 'play';
    }
    function bad() {
      var b = [], i, r, c, k; for (i = 0; i < 36; i++) b.push(false);
      for (r = 0; r < 6; r++) for (c = 0; c < 6; c++) {
        var v = vals[r * 6 + c]; if (!v) continue;
        if (c < 4 && vals[r * 6 + c + 1] === v && vals[r * 6 + c + 2] === v) { b[r * 6 + c] = b[r * 6 + c + 1] = b[r * 6 + c + 2] = true; }
        if (r < 4 && vals[(r + 1) * 6 + c] === v && vals[(r + 2) * 6 + c] === v) { b[r * 6 + c] = b[(r + 1) * 6 + c] = b[(r + 2) * 6 + c] = true; }
      }
      for (r = 0; r < 6; r++) { var rc = [0, 0, 0], cc = [0, 0, 0]; for (k = 0; k < 6; k++) { rc[vals[r * 6 + k]]++; cc[vals[k * 6 + r]]++; } for (k = 0; k < 6; k++) { if (rc[1] > 3 && vals[r * 6 + k] === 1 || rc[2] > 3 && vals[r * 6 + k] === 2) b[r * 6 + k] = true; if (cc[1] > 3 && vals[k * 6 + r] === 1 || cc[2] > 3 && vals[k * 6 + r] === 2) b[k * 6 + r] = true; } }
      return b;
    }
    function complete() { for (var i = 0; i < 36; i++) if (vals[i] !== sol[i]) return false; return true; }
    function tap(i) { if (st !== 'play' || given[i]) return; vals[i] = (vals[i] + 1) % 3; if (api.nota) api.nota(200 + vals[i] * 90, 0.08, 'sine', 0.05); if (complete()) st = 'win'; }
    function lay() { var W = api.w, H = api.h, s = Math.min(W - 24, H - 130, 440); return { s: s, c: s / 6, x0: (W - s) / 2, y0: 70 }; }
    function cp() { var L = lay(), o = [], i; for (i = 0; i < 36; i++) o.push({ x: L.x0 + (i % 6) * L.c + L.c / 2, y: L.y0 + ((i / 6) | 0) * L.c + L.c / 2 }); return o; }
    function nfill() { var n = 0; for (var i = 0; i < 36; i++) if (vals[i]) n++; return n; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, sol: sol.slice(), vals: vals.slice(), given: given.slice(), pos: cp(), t: t }; },
      down: function (x, y) { if (menu()) return; var L = lay(), p = cp(), i; for (i = 0; i < 36; i++) if (Math.abs(x - p[i].x) < L.c / 2 && Math.abs(y - p[i].y) < L.c / 2) { tap(i); return; } },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) { if (st !== 'play') return; t += dt; if (t >= LIM) st = 'lose'; },
      draw: function () {
        var L = lay(), p = cp(), b = bad(), i; bg('#1d2230', '#090b12');
        for (i = 0; i < 36; i++) {
          var x = p[i].x - L.c / 2, y = p[i].y - L.c / 2;
          g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(x + 1, y + 1, L.c - 2, L.c - 2);
          if (vals[i]) { g.beginPath(); g.arc(p[i].x, p[i].y, L.c * 0.34, 0, 6.2832); g.fillStyle = vals[i] === 1 ? '#e8e2cf' : '#2a2f3d'; g.fill(); g.strokeStyle = vals[i] === 1 ? '#9a9482' : '#7d869c'; g.lineWidth = 2; g.stroke(); }
          if (given[i]) { g.strokeStyle = '#ffd88a'; g.lineWidth = 2; g.strokeRect(x + 3, y + 3, L.c - 6, L.c - 6); }
          if (b[i]) { g.strokeStyle = '#ff5a4a'; g.lineWidth = 3; g.strokeRect(x + 1.5, y + 1.5, L.c - 3, L.c - 3); }
        }
        bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 60 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + nfill() + '/36', T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };

  }
});
