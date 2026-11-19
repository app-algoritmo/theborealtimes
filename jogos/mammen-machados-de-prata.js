/* Mammen — os machados (invenção). */
BTJogo.registrar({
  canvas: 'jogo-mammen',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os machados de Mammen",
    "sub": "Toque numa casa para pôr ou tirar um machado. Ponha um machado por linha, sem que dois fiquem na mesma linha, na mesma coluna ou na mesma diagonal. Machados que se atacam ficam em vermelho. O tempo é limitado. São 3 tabuleiros, cada um maior que o anterior.",
    "perdeu": "O tempo acabou",
    "v1": "Machados em paz!",
    "v2": "Na sepultura de Mammen, perto de Viborg, na Dinamarca, havia dois machados, e um deles, com incrustações de prata, deu nome ao estilo Mammen. A madeira da câmara foi cortada em 970/971. Pôr machados sem se atacarem é invenção.",
    "h1": "Tabuleiro",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The axes of Mammen",
    "sub": "Tap a square to place or remove an axe. Place one axe per row, with no two on the same row, the same column or the same diagonal. Axes that attack each other turn red. Time is limited. There are 3 boards, each larger than the last.",
    "perdeu": "Time ran out",
    "v1": "Axes at peace!",
    "v2": "In the Mammen grave, near Viborg in Denmark, there were two axes, and one of them, with silver inlay, gave its name to the Mammen style. The timber of the chamber was felled in 970/971. Placing axes that do not attack each other is invented.",
    "h1": "Board",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Mammen-øksene",
    "sub": "Trykk på en rute for å sette ut eller ta bort en øks. Sett én øks per rad, uten at to står på samme rad, samme kolonne eller samme diagonal. Økser som angriper hverandre blir røde. Tiden er begrenset. Det er 3 brett, hvert større enn det forrige.",
    "perdeu": "Tiden tok slutt",
    "v1": "Øksene er i fred!",
    "v2": "I graven i Mammen, nær Viborg i Danmark, lå det to økser, og den ene, med sølvinnlegg, ga navn til Mammen-stilen. Tømmeret i kammeret ble felt i 970/971. Å sette ut økser som ikke angriper hverandre er oppfunnet.",
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
    var NL = 3, lvl = 0, t = 0, pend = 0;
    function lvlUp() { lvl++; pend = 0.9; if (api.nota) api.nota(520, 0.2, 'triangle', 0.07); }
    function tick(dt, load) { if (st !== 'play') return; t += dt; if (pend > 0) { pend -= dt; if (pend <= 0) { if (lvl >= NL) st = 'win'; else load(lvl); } } if (st === 'play' && t >= LIM) st = 'lose'; }
    function foot() { bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 60 ? '#c0392b' : '#ffd88a'); }
    function hh() { hud(T.h1 + ' ' + Math.min(lvl + 1, NL) + '/' + NL, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false); }
    function glay(R, C, top, bot) { var W = api.w, H = api.h, s = Math.min((W - 24) / C, (H - top - bot) / R, 96); return { s: s, x0: (W - s * C) / 2, y0: top + ((H - top - bot) - s * R) / 2 }; }
    function sh(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
    var NS = [5, 6, 7], LIM = 300;
    var n = 5, cur = [], sol = [];
    function allSol(m) { var res = [], cs = []; (function go(r) { if (r === m) { res.push(cs.slice()); return; } for (var c = 0; c < m; c++) { var ok = true; for (var q = 0; q < r; q++) if (cs[q] === c || Math.abs(cs[q] - c) === r - q) { ok = false; break; } if (ok) { cs[r] = c; go(r + 1); } } })(0); return res; }
    function load(i) { n = NS[i]; var a = allSol(n), s = a[Math.floor(Math.random() * a.length)], k; sol = []; for (k = 0; k < n; k++) sol.push(k * n + s[k]); cur = []; for (k = 0; k < n * n; k++) cur.push(0); }
    function bad() {
      var q = [], b = [], i, j, k; for (i = 0; i < n * n; i++) { q.push(cur[i] ? i : -1); b.push(false); }
      for (i = 0; i < n * n; i++) if (cur[i]) for (j = i + 1; j < n * n; j++) if (cur[j]) {
        var r1 = Math.floor(i / n), c1 = i % n, r2 = Math.floor(j / n), c2 = j % n;
        if (r1 === r2 || c1 === c2 || Math.abs(r1 - r2) === Math.abs(c1 - c2)) { b[i] = true; b[j] = true; }
      }
      return b;
    }
    function check() { var c = 0, i, b = bad(); for (i = 0; i < n * n; i++) { if (cur[i]) c++; if (b[i]) return false; } return c === n; }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function L() { return glay(n, n, 66, 34); }
    function pos() { var l = L(), a = [], i; for (i = 0; i < n * n; i++) a.push({ x: l.x0 + (i % n + 0.5) * l.s, y: l.y0 + (Math.floor(i / n) + 0.5) * l.s }); return a; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lvl: lvl, pend: pend, sol: sol.slice(), cur: cur.slice(), pos: pos() }; },
      down: function (x, y) {
        if (menu()) return; if (pend > 0 || st !== 'play') return;
        var l = L(), c = Math.floor((x - l.x0) / l.s), r = Math.floor((y - l.y0) / l.s);
        if (c < 0 || r < 0 || c >= n || r >= n) return;
        cur[r * n + c] ^= 1; if (api.nota) api.nota(cur[r * n + c] ? 340 : 240, 0.05, 'triangle', 0.04);
        if (check()) lvlUp();
      },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) { tick(dt, load); },
      draw: function () {
        var l = L(), s = l.s, i, b = bad(); bg('#1c2230', '#05070b');
        for (i = 0; i < n * n; i++) {
          var x = l.x0 + (i % n) * s, y = l.y0 + Math.floor(i / n) * s, dk = ((i % n) + Math.floor(i / n)) % 2;
          g.fillStyle = dk ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.05)'; g.fillRect(x, y, s, s);
          if (cur[i]) { var cx = x + s / 2, cy = y + s / 2, cc = b[i] ? '#ff7a6a' : '#e8e0c8'; g.strokeStyle = cc; g.lineWidth = Math.max(3, s * 0.07); g.beginPath(); g.moveTo(cx - s * 0.18, cy + s * 0.3); g.lineTo(cx + s * 0.12, cy - s * 0.3); g.stroke(); g.fillStyle = cc; g.beginPath(); g.moveTo(cx + s * 0.08, cy - s * 0.32); g.lineTo(cx + s * 0.36, cy - s * 0.2); g.lineTo(cx + s * 0.3, cy + s * 0.05); g.lineTo(cx + s * 0.1, cy - s * 0.05); g.closePath(); g.fill(); }
          if (cur[i] && b[i]) { g.strokeStyle = '#ff7a6a'; g.lineWidth = 3; g.strokeRect(x + 3, y + 3, s - 6, s - 6); }
        }
        foot(); hh(); fim(st);
      }
    };

  }
});
