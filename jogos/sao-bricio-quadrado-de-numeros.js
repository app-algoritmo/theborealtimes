/* O Dia de São Brício — o quadrado de números (invenção). */
BTJogo.registrar({
  canvas: 'jogo-bricio',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O quadrado de números",
    "sub": "Ponha os números nas nove casas de modo que todas as linhas, todas as colunas e as duas diagonais somem o valor mostrado no alto, à direita. Toque num número da fileira de baixo e depois numa casa vazia. Toque num número já colocado para devolvê-lo. Os números dourados já estão fixos. O tempo é limitado. São 3 quadrados.",
    "perdeu": "O tempo acabou",
    "v1": "Quadrado completo!",
    "v2": "O massacre do Dia de São Brício, em 1002, partiu de uma ordem do rei inglês Etelredo. Completar um quadrado de números é invenção.",
    "h1": "Quadrado",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The square of numbers",
    "sub": "Put the numbers in the nine squares so that every row, every column and both diagonals add up to the value shown at the top right. Tap a number in the bottom row and then an empty square. Tap a number already placed to return it. The golden numbers are already fixed. Time is limited. There are 3 squares.",
    "perdeu": "Time ran out",
    "v1": "Square complete!",
    "v2": "The St Brice's Day massacre of 1002 followed an order from the English king Æthelred. Completing a square of numbers is invented.",
    "h1": "Square",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Tallkvadratet",
    "sub": "Sett tallene i de ni rutene slik at alle rader, alle kolonner og begge diagonalene gir den summen som vises øverst til høyre. Trykk på et tall i nederste rad og så på en tom rute. Trykk på et tall som allerede er lagt, for å ta det tilbake. De gylne tallene er allerede festet. Tiden er begrenset. Det er 3 kvadrater.",
    "perdeu": "Tiden tok slutt",
    "v1": "Kvadratet er fullført!",
    "v2": "Massakren på Sankt Brictius-dagen i 1002 kom etter en ordre fra den engelske kongen Æthelred. Å fullføre et tallkvadrat er oppfunnet.",
    "h1": "Kvadrat",
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
    var OFF = [0, 2, 5], NG = [3, 3, 2], LIM = 300, base = [2, 7, 6, 9, 5, 1, 4, 3, 8], sol = [], cur = [], fixed = [], sel = 0, S = 15, nums = [], used = {};
    function xform(a) {
      var m = [[0, 1, 2], [3, 4, 5], [6, 7, 8]], rot = Math.floor(Math.random() * 4), flip = Math.random() < 0.5, i;
      for (i = 0; i < rot; i++) m = [[m[2][0], m[1][0], m[0][0]], [m[2][1], m[1][1], m[0][1]], [m[2][2], m[1][2], m[0][2]]];
      if (flip) m = m.map(function (r) { return r.slice().reverse(); });
      var out = []; m.forEach(function (r) { r.forEach(function (q) { out.push(a[q]); }); }); return out;
    }
    function load(i) {
      var o = OFF[i], b = xform(base); sol = b.map(function (v) { return v + o; }); S = 15 + 3 * o;
      nums = []; for (var v = 1; v <= 9; v++) nums.push(v + o);
      cur = []; fixed = []; var q; for (q = 0; q < 9; q++) { cur.push(0); fixed.push(false); }
      sh([0, 1, 2, 3, 4, 5, 6, 7, 8]).slice(0, NG[i]).forEach(function (z) { cur[z] = sol[z]; fixed[z] = true; });
      sel = 0;
    }
    function okSq() {
      var i, seen = {}; for (i = 0; i < 9; i++) { if (!cur[i] || seen[cur[i]]) return false; seen[cur[i]] = 1; }
      var ln = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
      return ln.every(function (l) { return cur[l[0]] + cur[l[1]] + cur[l[2]] === S; });
    }
    function placed(v) { for (var i = 0; i < 9; i++) if (cur[i] === v) return true; return false; }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function L() { var W = api.w, H = api.h, s = Math.min((W - 24) / 3, (H - 70 - 112) / 3, 88), ps = Math.min((W - 24) / 9, 50); return { s: s, x0: (W - s * 3) / 2, y0: 70, ps: ps, px0: (W - ps * 9) / 2, py: 70 + s * 3 + 22 }; }
    function cpos() { var l = L(), a = [], i; for (i = 0; i < 9; i++) a.push({ x: l.x0 + (i % 3 + 0.5) * l.s, y: l.y0 + (Math.floor(i / 3) + 0.5) * l.s }); return a; }
    function ppos() { var l = L(), a = [], i; for (i = 0; i < 9; i++) a.push({ x: l.px0 + (i + 0.5) * l.ps, y: l.py + l.ps / 2 }); return a; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lvl: lvl, pend: pend, sol: sol.slice(), cur: cur.slice(), fixed: fixed.slice(), sel: sel, nums: nums.slice(), pool: ppos(), pos: cpos().concat(ppos()) }; },
      down: function (x, y) {
        if (menu()) return; if (pend > 0 || st !== 'play') return;
        var l = L(), c = Math.floor((x - l.x0) / l.s), r = Math.floor((y - l.y0) / l.s), i;
        if (c >= 0 && r >= 0 && c < 3 && r < 3) {
          var q = r * 3 + c; if (fixed[q]) return;
          if (cur[q]) { cur[q] = 0; if (api.nota) api.nota(220, 0.05, 'triangle', 0.04); return; }
          if (sel && !placed(sel)) { cur[q] = sel; sel = 0; if (api.nota) api.nota(330, 0.06, 'triangle', 0.05); if (okSq()) lvlUp(); }
          return;
        }
        if (y >= l.py - 6 && y <= l.py + l.ps + 6) { i = Math.floor((x - l.px0) / l.ps); if (i >= 0 && i < 9 && !placed(nums[i])) sel = sel === nums[i] ? 0 : nums[i]; }
      },
      move: function () {}, up: function () {},
      key: function (kk, d) { if (d && st !== 'play') menu(); },
      update: function (dt) { tick(dt, load); },
      draw: function () {
        var l = L(), s = l.s, i; bg('#2a2018', '#0b0806');
        txt('= ' + S, l.x0 + s * 3, l.y0 - 12, 22, '#ffd88a', 'right');
        for (i = 0; i < 9; i++) {
          var x = l.x0 + (i % 3) * s, y = l.y0 + Math.floor(i / 3) * s;
          g.fillStyle = fixed[i] ? '#6a4a1c' : 'rgba(255,255,255,.12)'; rr(x + 3, y + 3, s - 6, s - 6, 8); g.fill();
          if (cur[i]) txt(String(cur[i]), x + s / 2, y + s / 2 + s * 0.13, Math.max(18, s * 0.42), fixed[i] ? '#ffe9b0' : '#f3ecd2');
        }
        for (i = 0; i < 9; i++) {
          var px = l.px0 + i * l.ps, v = nums[i], pl = placed(v);
          g.fillStyle = pl ? 'rgba(255,255,255,.05)' : sel === v ? '#d9ae48' : 'rgba(255,255,255,.2)'; rr(px + 2, l.py + 2, l.ps - 4, l.ps - 4, 6); g.fill();
          if (!pl) txt(String(v), px + l.ps / 2, l.py + l.ps / 2 + l.ps * 0.14, Math.max(14, l.ps * 0.4), sel === v ? '#2a1d08' : '#f3ecd2');
        }
        foot(); hh(); fim(st);
      }
    };

  }
});
