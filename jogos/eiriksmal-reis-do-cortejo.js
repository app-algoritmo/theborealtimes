/* Eiríksmál — os reis do cortejo (invenção). */
BTJogo.registrar({
  canvas: 'jogo-eiriksmal',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os reis do cortejo",
    "sub": "Preencha a grade com os números de 1 até o tamanho dela, sem repetir nenhum em linha ou coluna, e respeitando os sinais entre casas vizinhas: o sinal aponta para o número menor. Os números fixos não mudam. Toque numa casa para trocar o número. O tempo é limitado. São 3 grades.",
    "perdeu": "O tempo acabou",
    "v1": "Cortejo em ordem!",
    "v2": "No Eiríksmál, Érico chega ao Valhalla e diz que cinco reis o acompanham e que ele é o sexto. Ordenar números com sinais é invenção.",
    "h1": "Grade",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The kings of the train",
    "sub": "Fill the grid with the numbers from 1 up to its size, with no repeats in any row or column, and obeying the signs between neighbouring squares: the sign points to the smaller number. The fixed numbers do not change. Tap a square to change the number. Time is limited. There are 3 grids.",
    "perdeu": "Time ran out",
    "v1": "Train in order!",
    "v2": "In Eiríksmál, Eric arrives in Valhalla and says that five kings follow him and that he is the sixth. Ordering numbers with signs is invented.",
    "h1": "Grid",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Kongene i følget",
    "sub": "Fyll rutenettet med tallene fra 1 til størrelsen på det, uten gjentakelser i noen rad eller kolonne, og følg tegnene mellom nabo-ruter: tegnet peker mot det minste tallet. De faste tallene endres ikke. Trykk på en rute for å bytte tall. Tiden er begrenset. Det er 3 rutenett.",
    "perdeu": "Tiden tok slutt",
    "v1": "Følget er i orden!",
    "v2": "I Eiríksmál kommer Eirik til Valhall og sier at fem konger følger ham, og at han selv er den sjette. Å ordne tall med tegn er oppfunnet.",
    "h1": "Rutenett",
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
    var NS = [4, 4, 5], TG = [9, 10, 14], LIM = 300, N = 4, sol = [], giv = [], cur = [], H = [], V = [];
    function range(n) { var a = [], i; for (i = 0; i < n; i++) a.push(i); return a; }
    function latin(n) {
      var rp = sh(range(n)), cp = sh(range(n)), vp = sh(range(n)), out = [], i, j;
      for (i = 0; i < n; i++) { var row = []; for (j = 0; j < n; j++) row.push(vp[(rp[i] + cp[j]) % n] + 1); out.push(row); }
      return out;
    }
    function count(n, gv, Hh, Vv) {
      var a = [], c = 0, i; for (i = 0; i < n * n; i++) a.push(0);
      function ok(p, v) {
        var r = Math.floor(p / n), cc = p % n, k;
        for (k = 0; k < cc; k++) if (a[r * n + k] === v) return false;
        for (k = 0; k < r; k++) if (a[k * n + cc] === v) return false;
        if (cc > 0 && Hh[r][cc - 1]) { var l = a[r * n + cc - 1]; if (Hh[r][cc - 1] === 1 ? !(l < v) : !(l > v)) return false; }
        if (r > 0 && Vv[r - 1][cc]) { var u = a[(r - 1) * n + cc]; if (Vv[r - 1][cc] === 1 ? !(u < v) : !(u > v)) return false; }
        return true;
      }
      function rec(p) {
        if (c > 1) return; if (p === n * n) { c++; return; }
        if (gv[p]) { if (ok(p, gv[p])) { a[p] = gv[p]; rec(p + 1); a[p] = 0; } return; }
        for (var v = 1; v <= n; v++) if (ok(p, v)) { a[p] = v; rec(p + 1); a[p] = 0; if (c > 1) return; }
      }
      rec(0); return c;
    }
    function gen(n, target) {
      var lat = latin(n), s = [], i, j, r, c;
      for (r = 0; r < n; r++) for (c = 0; c < n; c++) s.push(lat[r][c]);
      var Hh = [], Vv = [], gv = []; for (i = 0; i < n * n; i++) gv.push(0);
      for (r = 0; r < n; r++) { Hh.push([]); Vv.push([]); for (c = 0; c < n; c++) { Hh[r].push(c < n - 1 ? (lat[r][c] < lat[r][c + 1] ? 1 : -1) : 0); Vv[r].push(r < n - 1 ? (lat[r][c] < lat[r + 1][c] ? 1 : -1) : 0); } }
      var guard = 0; while (count(n, gv, Hh, Vv) > 1 && guard++ < 40) { var p = Math.floor(Math.random() * n * n); gv[p] = s[p]; }
      var clues = [];
      for (r = 0; r < n; r++) for (c = 0; c < n; c++) { if (c < n - 1) clues.push(['h', r, c]); if (r < n - 1) clues.push(['v', r, c]); }
      for (i = 0; i < n * n; i++) if (gv[i]) clues.push(['g', i]);
      var total = clues.length; sh(clues);
      for (i = 0; i < clues.length && total > target; i++) {
        var q = clues[i], old;
        if (q[0] === 'h') { old = Hh[q[1]][q[2]]; Hh[q[1]][q[2]] = 0; if (count(n, gv, Hh, Vv) > 1) Hh[q[1]][q[2]] = old; else total--; }
        else if (q[0] === 'v') { old = Vv[q[1]][q[2]]; Vv[q[1]][q[2]] = 0; if (count(n, gv, Hh, Vv) > 1) Vv[q[1]][q[2]] = old; else total--; }
        else { old = gv[q[1]]; gv[q[1]] = 0; if (count(n, gv, Hh, Vv) > 1) gv[q[1]] = old; else total--; }
      }
      return { s: s, gv: gv, H: Hh, V: Vv };
    }
    function load(i) {
      N = NS[i]; var d = gen(N, TG[i]); sol = d.s; giv = d.gv; H = d.H; V = d.V; cur = []; for (var k = 0; k < N * N; k++) cur.push(giv[k] || 0);
    }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function L() { return glay(N, N, 92, 44); }
    function pos() { var l = L(), a = [], i; for (i = 0; i < N * N; i++) a.push({ x: l.x0 + (i % N + 0.5) * l.s, y: l.y0 + (Math.floor(i / N) + 0.5) * l.s }); return a; }
    function solved() { for (var i = 0; i < N * N; i++) if (cur[i] !== sol[i]) return false; return true; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lvl: lvl, pend: pend, sol: sol.slice(), cur: cur.slice(), pos: pos() }; },
      down: function (x, y) {
        if (menu()) return; if (pend > 0 || st !== 'play') return;
        var l = L(), c = Math.floor((x - l.x0) / l.s), r = Math.floor((y - l.y0) / l.s);
        if (c < 0 || r < 0 || c >= N || r >= N) return;
        var p = r * N + c; if (giv[p]) return;
        cur[p] = (cur[p] + 1) % (N + 1); if (api.nota) api.nota(300 + cur[p] * 50, 0.05, 'triangle', 0.04);
        if (solved()) lvlUp();
      },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) { tick(dt, load); },
      draw: function () {
        var l = L(), s = l.s, i, r, c; bg('#2a1d24', '#0b0609');
        var bw = s * 0.74, off = (s - bw) / 2;
        for (i = 0; i < N * N; i++) {
          r = Math.floor(i / N); c = i % N; var x = l.x0 + c * s + off, y = l.y0 + r * s + off;
          g.fillStyle = giv[i] ? '#6a4a1c' : 'rgba(255,255,255,.12)'; rr(x, y, bw, bw, 8); g.fill();
          if (cur[i]) txt(String(cur[i]), x + bw / 2, y + bw / 2 + s * 0.13, Math.max(18, s * 0.42), giv[i] ? '#ffe9b0' : '#f3ecd2');
        }
        for (r = 0; r < N; r++) for (c = 0; c < N; c++) {
          if (c < N - 1 && H[r][c]) txt(H[r][c] === 1 ? '<' : '>', l.x0 + (c + 1) * s, l.y0 + (r + 0.5) * s + s * 0.1, Math.max(16, s * 0.34), '#ffd88a');
          if (r < N - 1 && V[r][c]) txt(V[r][c] === 1 ? '∨' : '∧', l.x0 + (c + 0.5) * s, l.y0 + (r + 1) * s + s * 0.1, Math.max(16, s * 0.34), '#ffd88a');
        }
        foot(); hh(); fim(st);
      }
    };

  }
});
