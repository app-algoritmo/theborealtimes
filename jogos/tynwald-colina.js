/* Os degraus da colina — mova os quatro discos para o terceiro poste. */
BTJogo.registrar({
  canvas: 'jogo-tynwald',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os degraus da colina",
    "sub": "Quatro discos estão no poste da esquerda. Leve todos para o poste da direita, um de cada vez, sem nunca pôr um disco maior sobre um menor. Toque num poste para pegar o disco de cima e toque em outro para soltá-lo (ou use as setas e o espaço). Há um limite de movimentos.",
    "perdeu": "Os degraus se embaralharam",
    "v1": "A colina foi subida!",
    "v2": "Em Tynwald Hill, na Ilha de Man, a colina tem quatro níveis em degraus. Os discos e as regras do jogo são invenção.",
    "h1": "Discos",
    "h2": "Movimentos",
    "dica": "nunca um disco maior sobre um menor"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The steps of the hill",
    "sub": "Four discs sit on the left post. Take all of them to the right post, one at a time, never putting a larger disc on a smaller one. Tap a post to pick up the top disc and tap another to drop it (or use the arrows and Space). There is a move limit.",
    "perdeu": "The steps got jumbled",
    "v1": "The hill is climbed!",
    "v2": "Tynwald Hill, on the Isle of Man, has four stepped levels. The discs and the rules of the game are made up.",
    "h1": "Discs",
    "h2": "Moves",
    "dica": "never a larger disc on a smaller one"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Trinnene på haugen",
    "sub": "Fire skiver ligger på den venstre stolpen. Flytt alle til den høyre stolpen, én om gangen, og legg aldri en større skive på en mindre. Trykk på en stolpe for å ta den øverste skiva, og trykk på en annen for å slippe den (eller bruk piltastene og mellomrom). Det er en grense for antall trekk.",
    "perdeu": "Trinnene ble blandet sammen",
    "v1": "Haugen er besteget!",
    "v2": "Tynwald Hill på Isle of Man har fire trinn. Skivene og reglene i spillet er diktet opp.",
    "h1": "Skiver",
    "h2": "Trekk",
    "dica": "aldri en større skive på en mindre"
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
    var ND = 4, MAXM = 32, LIM = 240, DC = ['#e0503a', '#f0a030', '#5ac07a', '#4aa0e0'];
    var pegs = [[3, 2, 1, 0], [], []], sel = -1, moves = 0, tmr = LIM, cur = 0, flash = 0, pop = 0;
    function lay() { var W = api.w, H = api.h, hh = Math.min(H - 190, 240), px = function (i) { return W / 2 + (i - 1) * Math.min(W / 3.2, 190); }; return { px: px, base: Math.max(210, (H + hh) / 2 + 30), hh: hh, dh: Math.min(30, hh / 6.5), mw: Math.min(W / 3.2, 190) * 0.48 }; }
    function setup() { pegs = [[3, 2, 1, 0], [], []]; sel = -1; moves = 0; tmr = LIM; cur = 0; flash = 0; }
    function reset() { setup(); st = 'play'; }
    function peg(i) {
      if (st !== 'play') return; cur = i;
      if (sel < 0) { if (pegs[i].length) { sel = i; if (api.nota) api.nota(400, 0.05, 'triangle', 0.05); } return; }
      if (sel === i) { sel = -1; return; }
      var d = pegs[sel][pegs[sel].length - 1], top = pegs[i].length ? pegs[i][pegs[i].length - 1] : 99;
      if (d > top) { flash = 0.4; sel = -1; return; }
      pegs[sel].pop(); pegs[i].push(d); sel = -1; moves++; if (api.nota) api.nota(300, 0.07, 'square', 0.05);
      if (pegs[2].length === ND) st = 'win'; else if (moves >= MAXM) st = 'lose';
    }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, pegs: pegs.map(function (p) { return p.slice(); }), sel: sel, moves: moves, px: [L.px(0), L.px(1), L.px(2)], y: L.base - 40 }; },
      down: function (x, y) { if (menu()) return; var L = lay(), b = 0, bd = 1e9; for (var i = 0; i < 3; i++) { var d = Math.abs(x - L.px(i)); if (d < bd) { bd = d; b = i; } } peg(b); },
      key: function (c, d) {
        if (!d) return; if (st !== 'play') { menu(); return; }
        if (c === 'ArrowLeft' || c === 'KeyA') cur = Math.max(0, cur - 1); else if (c === 'ArrowRight' || c === 'KeyD') cur = Math.min(2, cur + 1);
        else if (c === 'Space' || c === 'Enter') peg(cur); else if (c === 'Digit1') peg(0); else if (c === 'Digit2') peg(1); else if (c === 'Digit3') peg(2);
      },
      update: function (dt) { pop += dt; if (flash > 0) flash -= dt; if (st === 'play') { tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; } } },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), i, k;
        bg('#1c2a24', '#0a110e');
        g.fillStyle = '#3a4a38'; g.fillRect(L.px(0) - L.mw - 20, L.base, (L.px(2) - L.px(0)) + 2 * L.mw + 40, 12);
        for (i = 0; i < 3; i++) {
          var x = L.px(i); g.fillStyle = i === cur && st === 'play' ? '#ffd88a' : '#8a7a5a'; g.fillRect(x - 4, L.base - L.hh - 20, 8, L.hh + 20);
          if (i === 2) { g.fillStyle = 'rgba(255,216,138,.16)'; rr(x - L.mw - 8, L.base - L.hh - 30, L.mw * 2 + 16, L.hh + 40, 10); g.fill(); }
          for (k = 0; k < pegs[i].length; k++) {
            var d = pegs[i][k], w = L.mw * (0.45 + 0.55 * (d + 1) / ND), lift = (sel === i && k === pegs[i].length - 1);
            var y = lift ? L.base - L.hh - 50 : L.base - (k + 1) * (L.dh + 3);
            g.fillStyle = DC[d]; rr(x - w, y, w * 2, L.dh, 8); g.fill(); g.fillStyle = 'rgba(255,255,255,.22)'; g.fillRect(x - w + 8, y + 3, w * 2 - 16, 4);
          }
        }
        if (flash > 0) txt(T.dica, W / 2, 96, 16, '#ff9a8d'); else txt(T.dica, W / 2, 96, 14, 'rgba(255,255,255,.4)');
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 40 ? '#c0392b' : '#8ab56a');
        hud(T.h1 + ' ' + pegs[2].length + '/' + ND, T.h2 + ' ' + moves + '/' + MAXM, moves > 25);
        fim(st);
      }
    };
  }
});
