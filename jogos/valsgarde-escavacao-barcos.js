/* Valsgärde — escavação de túmulos de barco com contagens por linha e coluna (invenção). */
BTJogo.registrar({
  canvas: 'jogo-valsgarde',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A escavação de Valsgärde",
    "sub": "Há 3 barcos enterrados na grade, retos e sem se tocar. Os números nas bordas dizem quantas casas de barco há em cada linha e coluna. Toque numa casa para escavar. Até 10 casas de terra vazia e 300 segundos.",
    "perdeu": "Foi terra demais ou o tempo acabou",
    "v1": "Os três barcos foram achados!",
    "v2": "Valsgärde fica a cerca de 3 km ao norte de Gamla Uppsala. A Universidade de Uppsala escavou oito túmulos de barco em 1928–1936 e os seis restantes em 1946–1952. A grade é invenção.",
    "h1": "Barcos",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The excavation at Valsgärde",
    "sub": "There are 3 boats buried in the grid, straight and not touching. The numbers on the edges say how many boat squares are in each row and column. Tap a square to dig. Up to 10 empty-earth squares and 300 seconds.",
    "perdeu": "Too much bare earth or time ran out",
    "v1": "All three boats were found!",
    "v2": "Valsgärde lies about 3 km north of Gamla Uppsala. Uppsala University excavated eight boat graves in 1928–1936 and the remaining six in 1946–1952. The grid is invented.",
    "h1": "Boats",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Utgravingen på Valsgärde",
    "sub": "Det ligger 3 båter begravd i rutenettet, rette og uten å røre hverandre. Tallene i kantene sier hvor mange båtruter det er i hver rad og kolonne. Trykk på en rute for å grave. Opptil 10 ruter med tom jord og 300 sekunder.",
    "perdeu": "For mye tom jord eller tiden tok slutt",
    "v1": "Alle tre båtene ble funnet!",
    "v2": "Valsgärde ligger omkring 3 km nord for Gamla Uppsala. Uppsala universitet gravde ut åtte båtgraver i 1928–1936 og de seks siste i 1946–1952. Rutenettet er oppfunnet.",
    "h1": "Båter",
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
    var N = 6, MAXE = 10, LIM = 300, LENS = [4, 3, 3];
    var boat = [], state = [], rowc = [], colc = [], boats = [], err = 0, t = 0, shk = 0, shc = -1;
    function gen() {
      for (var tr = 0; tr < 500; tr++) {
        var b = [], i, ok = true, bs = []; for (i = 0; i < 36; i++) b.push(0);
        for (var k = 0; k < LENS.length && ok; k++) {
          var placed = false;
          for (var q = 0; q < 60 && !placed; q++) {
            var h = Math.random() < 0.5, r = Math.floor(Math.random() * (h ? N : N - LENS[k] + 1)), c = Math.floor(Math.random() * (h ? N - LENS[k] + 1 : N)), cells = [], good = true;
            for (i = 0; i < LENS[k]; i++) cells.push(h ? r * N + c + i : (r + i) * N + c);
            cells.forEach(function (z) { var zr = Math.floor(z / N), zc = z % N; for (var dr = -1; dr <= 1; dr++) for (var dc = -1; dc <= 1; dc++) { var rr2 = zr + dr, cc2 = zc + dc; if (rr2 >= 0 && rr2 < N && cc2 >= 0 && cc2 < N && b[rr2 * N + cc2]) good = false; } });
            if (good) { cells.forEach(function (z) { b[z] = k + 1; }); bs.push(cells); placed = true; }
          }
          if (!placed) ok = false;
        }
        if (ok) { boat = b; boats = bs; break; }
      }
      rowc = []; colc = [];
      for (var r2 = 0; r2 < N; r2++) rowc.push(boat.slice(r2 * N, r2 * N + N).filter(Boolean).length);
      for (var c2 = 0; c2 < N; c2++) { var n = 0; for (var r3 = 0; r3 < N; r3++) if (boat[r3 * N + c2]) n++; colc.push(n); }
    }
    function reset() { gen(); state = []; for (var i = 0; i < 36; i++) state.push(0); err = 0; t = 0; shk = 0; st = 'play'; }
    function found() { return boats.filter(function (cs) { return cs.every(function (z) { return state[z] === 2; }); }).length; }
    function lay() { var W = api.w, H = api.h, cs = Math.max(30, Math.min((W - 90) / 6, (H - 170) / 6, 62)); return { cs: cs, x0: (W - cs * 6) / 2 + 14, y0: 108 }; }
    function cpos(i) { var L = lay(); return { x: L.x0 + (i % N + 0.5) * L.cs, y: L.y0 + (Math.floor(i / N) + 0.5) * L.cs }; }
    function dig(i) {
      if (st !== 'play' || state[i]) return;
      if (boat[i]) { state[i] = 2; if (api.nota) api.nota(520, 0.1, 'triangle', 0.06); if (found() === 3) st = 'win'; }
      else { state[i] = 1; err++; shk = 0.3; shc = i; if (api.nota) api.nota(140, 0.15, 'sawtooth', 0.05); if (err >= MAXE) st = 'lose'; }
    }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { var ps = []; for (var i = 0; i < 36; i++) ps.push(cpos(i)); return { st: st, state: state.slice(), rowc: rowc, colc: colc, err: err, t: t, cells: ps, boat: boat.slice() }; },
      down: function (x, y) { if (menu()) return; var L = lay(); for (var i = 0; i < 36; i++) { var p = cpos(i); if (Math.abs(x - p.x) < L.cs / 2 && Math.abs(y - p.y) < L.cs / 2) { dig(i); return; } } },
      move: function () {}, up: function () {},
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } },
      update: function (dt) { if (shk > 0) shk -= dt; if (st !== 'play') return; t += dt; if (t >= LIM) st = 'lose'; },
      draw: function () {
        var L = lay(), i; bg('#2a2a1c', '#0d0d07'); var fs = Math.max(12, Math.min(18, L.cs * 0.34));
        for (i = 0; i < 36; i++) {
          var p = cpos(i), dx = (shk > 0 && shc === i) ? Math.sin(shk * 60) * 3 : 0, s = state[i];
          g.fillStyle = s === 2 ? '#c9893a' : s === 1 ? '#3a3226' : '#6b5a3a'; rr(p.x - L.cs / 2 + 2 + dx, p.y - L.cs / 2 + 2, L.cs - 4, L.cs - 4, 5); g.fill();
          if (s === 1) txt('·', p.x, p.y + 4, fs, 'rgba(255,255,255,.3)');
        }
        for (i = 0; i < N; i++) { txt(String(rowc[i]), L.x0 - 12, cpos(i * N).y + fs * 0.35, fs, '#f3ecd2', 'right'); txt(String(colc[i]), cpos(i).x, L.y0 - 8, fs, '#f3ecd2'); }
        bar(api.w / 2 - 110, api.h - 14, 220, 5, (LIM - t) / LIM, LIM - t < 40 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + found() + '/3', T.h2 + ' ' + err + '/' + MAXE, true);
        fim(st);
      }
    };

  }
});
