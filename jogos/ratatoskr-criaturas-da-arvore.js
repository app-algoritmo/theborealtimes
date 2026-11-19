/* Ratatoskr — os pares de criaturas da árvore (invenção). */
BTJogo.registrar({
  canvas: 'jogo-ratatoskr',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As criaturas da árvore",
    "sub": "As cartas estão viradas para baixo, e cada símbolo aparece em duas cartas. Toque numa carta para virá-la e depois em outra. Se os símbolos forem iguais, o par fica à mostra; se forem diferentes, as duas cartas voltam e você erra. Encontre todos os pares sem passar do limite de erros. O tempo é limitado. São 3 mesas, cada uma com mais cartas.",
    "perdeu": "Erros demais ou o tempo acabou",
    "v1": "Árvore completa!",
    "v2": "Na Grímnismál, o esquilo Ratatoskr corre para cima e para baixo em Yggdrasil e leva mensagens entre a águia, no alto, e Níðhöggr, embaixo. Achar pares de cartas é invenção.",
    "h1": "Mesa",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The creatures of the tree",
    "sub": "The cards lie face down, and each symbol appears on two cards. Tap a card to turn it over, then another one. If the symbols match, the pair stays face up; if they differ, both cards turn back and you make a mistake. Find all the pairs without passing the limit of mistakes. Time is limited. There are 3 tables, each with more cards.",
    "perdeu": "Too many mistakes or time ran out",
    "v1": "Tree complete!",
    "v2": "In the Grímnismál, the squirrel Ratatoskr runs up and down Yggdrasil and carries messages between the eagle, at the top, and Níðhöggr, below. Finding pairs of cards is invented.",
    "h1": "Table",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Skapningene i treet",
    "sub": "Kortene ligger med forsiden ned, og hvert symbol finnes på to kort. Trykk på et kort for å snu det, og så på et til. Hvis symbolene er like, blir paret liggende åpent; hvis de er ulike, snur begge kortene tilbake og du gjør en feil. Finn alle parene uten å overskride grensen for feil. Tiden er begrenset. Det er 3 bord, hvert med flere kort.",
    "perdeu": "For mange feil, eller tiden tok slutt",
    "v1": "Treet er komplett!",
    "v2": "I Grímnismál løper ekornet Ratatoskr opp og ned Yggdrasil og bærer meldinger mellom ørnen, øverst, og Níðhöggr, nederst. Å finne kortpar er oppfunnet.",
    "h1": "Bord",
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
    var NL = 3, lvl = 0, t = 0, pend = 0;
    function lvlUp() { lvl++; pend = 0.9; if (api.nota) api.nota(520, 0.2, 'triangle', 0.07); }
    function tick(dt, load) { if (st !== 'play') return; t += dt; if (pend > 0) { pend -= dt; if (pend <= 0) { if (lvl >= NL) st = 'win'; else load(lvl); } } if (st === 'play' && t >= LIM) st = 'lose'; }
    function foot() { bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 60 ? '#c0392b' : '#ffd88a'); }
    function hh() { hud(T.h1 + ' ' + Math.min(lvl + 1, NL) + '/' + NL, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false); }
    function glay(R, C, top, bot) { var W = api.w, H = api.h, s = Math.min((W - 24) / C, (H - top - bot) / R, 96); return { s: s, x0: (W - s * C) / 2, y0: top + ((H - top - bot) - s * R) / 2 }; }
    function sh(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
    var NP = [3, 6, 8], CO = [3, 4, 4], MX = [4, 8, 11], LIM = 240;
    var SY = ['✦', '☾', '♦', '♣', '♠', '✚', '★', '▲'], CLR = ['#ffd88a', '#9fc5ff', '#ff9a8d', '#8fd19e', '#c9b3f2', '#f3a6d0', '#f0e27a', '#8fe0e0'];
    var n = 6, cols = 3, rows = 2, val = [], up = [], done = [], err = 0, lock = 0, open1 = -1, m1 = -1, m2 = -1, mx = 4;
    function load(i) {
      var k, a = []; n = NP[i] * 2; cols = CO[i]; rows = n / cols;
      for (k = 0; k < NP[i]; k++) { a.push(k); a.push(k); } val = sh(a); up = []; done = []; for (k = 0; k < n; k++) { up.push(false); done.push(false); }
      err = 0; lock = 0; open1 = -1; mx = MX[i];
    }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function pos() { var l = glay(rows, cols, 70, 40), a = [], i; for (i = 0; i < n; i++) a.push({ x: l.x0 + (i % cols + 0.5) * l.s, y: l.y0 + (Math.floor(i / cols) + 0.5) * l.s }); return a; }
    function tap(i) {
      if (pend > 0 || st !== 'play' || lock > 0 || done[i] || up[i]) return;
      up[i] = true; if (api.nota) api.nota(400 + val[i] * 40, 0.05, 'triangle', 0.04);
      if (open1 < 0) { open1 = i; return; }
      if (val[open1] === val[i]) {
        done[open1] = true; done[i] = true; open1 = -1; var k, all = true; for (k = 0; k < n; k++) if (!done[k]) all = false; if (all) lvlUp();
      } else { err++; m1 = open1; m2 = i; open1 = -1; lock = 0.7; if (api.nota) api.nota(170, 0.12, 'sawtooth', 0.05); }
    }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lvl: lvl, pend: Math.max(pend, lock), val: val.slice(), done: done.slice(), up: up.slice(), open1: open1, err: err, pos: pos() }; },
      down: function (x, y) { if (menu()) return; var l = glay(rows, cols, 70, 40), c = Math.floor((x - l.x0) / l.s), r = Math.floor((y - l.y0) / l.s); if (c < 0 || r < 0 || c >= cols || r >= rows) return; tap(r * cols + c); },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) {
        if (lock > 0) { lock -= dt; if (lock <= 0) { up[m1] = false; up[m2] = false; if (err > mx && st === 'play') st = 'lose'; } }
        tick(dt, load);
      },
      draw: function () {
        var l = glay(rows, cols, 70, 40), s = l.s, i; bg('#241c10', '#0a0804');
        for (i = 0; i < n; i++) {
          var x = l.x0 + (i % cols) * s, y = l.y0 + Math.floor(i / cols) * s;
          g.fillStyle = up[i] ? (done[i] ? '#3a4a2a' : '#4a3a22') : '#6a5330'; rr(x + 3, y + 3, s - 6, s - 6, 8); g.fill();
          if (up[i]) txt(SY[val[i]], x + s / 2, y + s / 2 + 2, Math.max(16, s * 0.5), CLR[val[i]]);
          else { g.strokeStyle = 'rgba(255,216,138,.35)'; g.lineWidth = 2; rr(x + 8, y + 8, s - 16, s - 16, 6); g.stroke(); }
        }
        foot(); hud(T.h1 + ' ' + Math.min(lvl + 1, NL) + '/' + NL, T.h2 + ' ' + err + '/' + mx, true); fim(st);
      }
    };

  }
});
