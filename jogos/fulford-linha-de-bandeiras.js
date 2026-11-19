/* Batalha de Fulford — conte as bandeiras visíveis (invenção). */
BTJogo.registrar({
  canvas: 'jogo-fulford',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A linha de bandeiras",
    "sub": "Toque numa casa para mudar o número, que é a altura de uma bandeira. Cada linha e cada coluna deve ter todas as alturas, sem repetir. Os números nas bordas dizem quantas bandeiras se veem daquele lado, porque as mais altas escondem as mais baixas que ficam atrás. Números repetidos ficam em vermelho. São 3 quadros, e o tempo é limitado.",
    "perdeu": "O tempo acabou antes de a linha ser completada",
    "v1": "Todas as bandeiras no lugar!",
    "v2": "Na Batalha de Fulford, em 20 de setembro de 1066, ao sul de York, Harald Hardrada e Tostig derrotaram os condes Edwin e Morcar. Depois veio Stamford Bridge. Contar bandeiras visíveis é invenção.",
    "h1": "Quadro",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The line of banners",
    "sub": "Tap a square to change the number, which is the height of a banner. Each row and each column must hold every height, without repeating. The numbers on the edges say how many banners can be seen from that side, because taller ones hide shorter ones behind them. Repeated numbers turn red. There are 3 boards, and time is limited.",
    "perdeu": "Time ran out before the line was completed",
    "v1": "Every banner in place!",
    "v2": "At the Battle of Fulford, on 20 September 1066, south of York, Harald Hardrada and Tostig defeated the earls Edwin and Morcar. Stamford Bridge followed. Counting visible banners is invented.",
    "h1": "Board",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Rekken av bannere",
    "sub": "Trykk på en rute for å bytte tallet, som er høyden på et banner. Hver rad og hver kolonne skal ha alle høydene, uten gjentakelser. Tallene i kantene sier hvor mange bannere som kan ses fra den siden, fordi de høyeste skjuler de lavere bak seg. Gjentatte tall blir røde. Det er 3 brett, og tiden er begrenset.",
    "perdeu": "Tiden gikk ut før rekken var fullført",
    "v1": "Alle bannerne på plass!",
    "v2": "I slaget ved Fulford, 20. september 1066, sør for York, beseiret Harald Hardråde og Tostig jarlene Edwin og Morcar. Så kom Stamford Bridge. Å telle synlige bannere er oppfunnet.",
    "h1": "Brett",
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
    var LV = [4, 4, 5], NL = 3, LIM = 480;
    var lvl = 0, n = 4, sol = [], cur = [], cl = { t: [], b: [], l: [], r: [] }, t = 0, pend = 0;
    function vis(a) { var m = 0, c = 0, i; for (i = 0; i < a.length; i++) if (a[i] > m) { m = a[i]; c++; } return c; }
    function shuf(m) { var a = [], i; for (i = 0; i < m; i++) a.push(i); a.sort(function () { return Math.random() - 0.5; }); return a; }
    function okClues(v, C) {
      var i, j, a;
      for (i = 0; i < n; i++) {
        a = []; for (j = 0; j < n; j++) a.push(v[i * n + j]); if (C.l[i] && vis(a) !== C.l[i]) return false; if (C.r[i] && vis(a.slice().reverse()) !== C.r[i]) return false;
        a = []; for (j = 0; j < n; j++) a.push(v[j * n + i]); if (C.t[i] && vis(a) !== C.t[i]) return false; if (C.b[i] && vis(a.slice().reverse()) !== C.b[i]) return false;
      } return true;
    }
    function count(C) {
      var v = [], c = 0, i; for (i = 0; i < n * n; i++) v.push(0);
      (function go(k) {
        if (c > 1) return; if (k === n * n) { if (okClues(v, C)) c++; return; }
        var x = k % n, y = (k / n) | 0, h, j;
        for (h = 1; h <= n; h++) { var ok = true; for (j = 0; j < x; j++) if (v[y * n + j] === h) ok = false; for (j = 0; j < y; j++) if (v[j * n + x] === h) ok = false; if (!ok) continue; v[k] = h;
          if (x === n - 1) { var a = []; for (j = 0; j < n; j++) a.push(v[y * n + j]); if (C.l[y] && vis(a) !== C.l[y]) continue; if (C.r[y] && vis(a.slice().reverse()) !== C.r[y]) continue; }
          if (y === n - 1) { var b = []; for (j = 0; j < n; j++) b.push(v[j * n + x]); if (C.t[x] && vis(b) !== C.t[x]) continue; if (C.b[x] && vis(b.slice().reverse()) !== C.b[x]) continue; }
          go(k + 1); }
        v[k] = 0;
      })(0); return c;
    }
    function gen(i) {
      n = LV[i]; var pr = shuf(n), pc = shuf(n), pv = shuf(n), s = [], r, c, j, a;
      for (r = 0; r < n; r++) for (c = 0; c < n; c++) s.push(pv[(pr[r] + pc[c]) % n] + 1);
      var C = { t: [], b: [], l: [], r: [] };
      for (j = 0; j < n; j++) { a = []; for (r = 0; r < n; r++) a.push(s[r * n + j]); C.t.push(vis(a)); C.b.push(vis(a.slice().reverse())); a = []; for (c = 0; c < n; c++) a.push(s[j * n + c]); C.l.push(vis(a)); C.r.push(vis(a.slice().reverse())); }
      var all = []; ['t', 'b', 'l', 'r'].forEach(function (s2) { for (j = 0; j < n; j++) all.push([s2, j]); }); all.sort(function () { return Math.random() - 0.5; });
      all.forEach(function (e) { var old = C[e[0]][e[1]]; C[e[0]][e[1]] = 0; if (count(C) !== 1) C[e[0]][e[1]] = old; });
      sol = s; cl = C; cur = []; for (j = 0; j < n * n; j++) cur.push(0);
    }
    function reset() { lvl = 0; t = 0; pend = 0; gen(0); st = 'play'; }
    function lay() { var W = api.w, H = api.h, s = Math.min((W - 20) / (n + 2), (H - 140) / (n + 2), 58); return { s: s, x0: (W - s * n) / 2, y0: 62 + s }; }
    function cc(i) { var L = lay(); return { x: L.x0 + (i % n) * L.s + L.s / 2, y: L.y0 + ((i / n) | 0) * L.s + L.s / 2 }; }
    function dup(i) { var x = i % n, y = (i / n) | 0, j; if (!cur[i]) return false; for (j = 0; j < n; j++) { if (j !== x && cur[y * n + j] === cur[i]) return true; if (j !== y && cur[j * n + x] === cur[i]) return true; } return false; }
    function done() { for (var i = 0; i < n * n; i++) if (cur[i] !== sol[i]) return false; return true; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { var p = [], i; for (i = 0; i < n * n; i++) p.push(cc(i)); return { st: st, lvl: lvl, n: n, sol: sol.slice(), cur: cur.slice(), pos: p, t: t, pend: pend }; },
      down: function (x, y) {
        if (menu()) return; if (pend > 0) return; var L = lay(), c = Math.floor((x - L.x0) / L.s), r = Math.floor((y - L.y0) / L.s);
        if (c < 0 || c >= n || r < 0 || r >= n) return; var i = r * n + c; cur[i] = (cur[i] + 1) % (n + 1); if (api.nota) api.nota(240 + cur[i] * 40, 0.05, 'square', 0.03);
        if (done()) { lvl++; pend = 0.9; if (api.nota) api.nota(520, 0.2, 'triangle', 0.07); }
      },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) {
        if (st !== 'play') return; t += dt;
        if (pend > 0) { pend -= dt; if (pend <= 0) { if (lvl >= NL) st = 'win'; else gen(lvl); } }
        if (st === 'play' && t >= LIM) st = 'lose';
      },
      draw: function () {
        var L = lay(), i; bg('#1d2028', '#08090d');
        for (i = 0; i < n * n; i++) {
          var x = L.x0 + (i % n) * L.s, y = L.y0 + ((i / n) | 0) * L.s, p = cc(i);
          g.fillStyle = 'rgba(255,255,255,.08)'; rr(x + 2, y + 2, L.s - 4, L.s - 4, 6); g.fill();
          if (cur[i]) { var hh = (L.s - 10) * cur[i] / n; g.fillStyle = 'rgba(150,120,70,.45)'; g.fillRect(x + 5, y + L.s - 5 - hh, L.s - 10, hh); txt(String(cur[i]), p.x, p.y + 1, L.s * 0.46, dup(i) ? '#ff7a6a' : '#f3ecd2'); }
        }
        for (i = 0; i < n; i++) {
          var cx = L.x0 + i * L.s + L.s / 2, cy = L.y0 + i * L.s + L.s / 2;
          if (cl.t[i]) txt(String(cl.t[i]), cx, L.y0 - L.s * 0.45, 17, '#ffd88a'); if (cl.b[i]) txt(String(cl.b[i]), cx, L.y0 + n * L.s + L.s * 0.45, 17, '#ffd88a');
          if (cl.l[i]) txt(String(cl.l[i]), L.x0 - L.s * 0.45, cy, 17, '#ffd88a'); if (cl.r[i]) txt(String(cl.r[i]), L.x0 + n * L.s + L.s * 0.45, cy, 17, '#ffd88a');
        }
        bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 60 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + Math.min(lvl + 1, NL) + '/' + NL, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };

  }
});
