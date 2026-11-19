/* Grobiņa — os montes (invenção). */
BTJogo.registrar({
  canvas: 'jogo-grobina',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os montes de Grobiņa",
    "sub": "Cada casa recebe um monte de altura 1 a N; toque na casa para mudar a altura. Não repita altura na mesma linha nem na mesma coluna. Os números nas bordas dizem quantos montes se veem daquele lado: um monte alto esconde os mais baixos atrás dele. O tempo é limitado. São 3 grades.",
    "perdeu": "O tempo acabou",
    "v1": "Montes erguidos!",
    "v2": "Perto de Liepāja, na Letônia, Grobiņa teve um assentamento escandinavo, e o cemitério de Priediens tem cerca de 2000 montes. Alinhar montes por visibilidade é invenção.",
    "h1": "Grade",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The mounds of Grobiņa",
    "sub": "Each square gets a mound of height 1 to N; tap the square to change the height. Do not repeat a height in the same row or the same column. The numbers on the edges say how many mounds can be seen from that side: a tall mound hides the lower ones behind it. Time is limited. There are 3 grids.",
    "perdeu": "Time ran out",
    "v1": "Mounds raised!",
    "v2": "Near Liepāja, in Latvia, Grobiņa had a Scandinavian settlement, and the Priediens cemetery has about 2000 mounds. Arranging mounds by visibility is invented.",
    "h1": "Grid",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Haugene i Grobiņa",
    "sub": "Hver rute får en haug med høyde fra 1 til N; trykk på ruten for å endre høyden. Ikke gjenta en høyde på samme rad eller i samme kolonne. Tallene i kantene sier hvor mange hauger som kan ses fra den siden: en høy haug skjuler de lavere bak seg. Tiden er begrenset. Det er 3 rutenett.",
    "perdeu": "Tiden tok slutt",
    "v1": "Haugene er reist!",
    "v2": "Nær Liepāja i Latvia hadde Grobiņa en skandinavisk bosetning, og gravfeltet Priediens har omtrent 2000 hauger. Å ordne hauger etter synlighet er oppfunnet.",
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
    var NS = [4, 5, 5], LIM = 300;
    var n = 4, cur = [], sol = [], cl = {};
    function vis(a) { var m = 0, c = 0, i; for (i = 0; i < a.length; i++) if (a[i] > m) { m = a[i]; c++; } return c; }
    function rowOf(a, r) { return a.slice(r * n, r * n + n); }
    function colOf(a, c) { var o = [], r; for (r = 0; r < n; r++) o.push(a[r * n + c]); return o; }
    function clues(a) { var o = { L: [], R: [], T: [], B: [] }, k; for (k = 0; k < n; k++) { var r = rowOf(a, k), c = colOf(a, k); o.L.push(vis(r)); o.R.push(vis(r.slice().reverse())); o.T.push(vis(c)); o.B.push(vis(c.slice().reverse())); } return o; }
    function load(i) {
      var k, rp, cp, sp, r, c; n = NS[i];
      rp = sh(seq(n)); cp = sh(seq(n)); sp = sh(seq(n)); sol = [];
      for (r = 0; r < n; r++) for (c = 0; c < n; c++) sol.push(sp[(rp[r] + cp[c]) % n] + 1);
      cl = clues(sol); cur = []; for (k = 0; k < n * n; k++) cur.push(0);
    }
    function seq(m) { var a = [], i; for (i = 0; i < m; i++) a.push(i); return a; }
    function dup(i) { var r = Math.floor(i / n), c = i % n, j; if (!cur[i]) return false; for (j = 0; j < n; j++) { if (j !== c && cur[r * n + j] === cur[i]) return true; if (j !== r && cur[j * n + c] === cur[i]) return true; } return false; }
    function done() {
      var i, k, q; for (i = 0; i < n * n; i++) if (!cur[i] || dup(i)) return false;
      q = clues(cur); for (k = 0; k < n; k++) if (q.L[k] !== cl.L[k] || q.R[k] !== cl.R[k] || q.T[k] !== cl.T[k] || q.B[k] !== cl.B[k]) return false; return true;
    }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function L() { return glay(n + 2, n + 2, 62, 34); }
    function pos() { var l = L(), a = [], i; for (i = 0; i < n * n; i++) a.push({ x: l.x0 + (i % n + 1.5) * l.s, y: l.y0 + (Math.floor(i / n) + 1.5) * l.s }); return a; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lvl: lvl, pend: pend, sol: sol.slice(), cur: cur.slice(), pos: pos() }; },
      down: function (x, y) {
        if (menu()) return; if (pend > 0 || st !== 'play') return;
        var l = L(), c = Math.floor((x - l.x0) / l.s) - 1, r = Math.floor((y - l.y0) / l.s) - 1;
        if (c < 0 || r < 0 || c >= n || r >= n) return;
        cur[r * n + c] = (cur[r * n + c] + 1) % (n + 1); if (api.nota) api.nota(260 + cur[r * n + c] * 50, 0.05, 'triangle', 0.04);
        if (done()) lvlUp();
      },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) { tick(dt, load); },
      draw: function () {
        var l = L(), s = l.s, i, k, fs = Math.max(12, s * 0.42); bg('#1c2220', '#050807');
        for (i = 0; i < n * n; i++) {
          var x = l.x0 + (i % n + 1) * s, y = l.y0 + (Math.floor(i / n) + 1) * s, v = cur[i];
          g.fillStyle = 'rgba(255,255,255,.07)'; rr(x + 2, y + 2, s - 4, s - 4, 6); g.fill();
          if (v) { var hgt = (s - 10) * v / n; g.fillStyle = dup(i) ? '#e0705a' : '#7fa88a'; g.fillRect(x + 6, y + s - 5 - hgt, s - 12, hgt); txt(String(v), x + s / 2, y + s / 2 + 1, fs, '#10180f'); }
        }
        for (k = 0; k < n; k++) {
          txt(String(cl.L[k]), l.x0 + 0.5 * s, l.y0 + (k + 1.5) * s, fs, '#f3ecd2');
          txt(String(cl.R[k]), l.x0 + (n + 1.5) * s, l.y0 + (k + 1.5) * s, fs, '#f3ecd2');
          txt(String(cl.T[k]), l.x0 + (k + 1.5) * s, l.y0 + 0.5 * s, fs, '#f3ecd2');
          txt(String(cl.B[k]), l.x0 + (k + 1.5) * s, l.y0 + (n + 1.5) * s, fs, '#f3ecd2');
        }
        foot(); hh(); fim(st);
      }
    };

  }
});
