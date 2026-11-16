/* Baú de Mästermyr — mude a pilha de ferramentas entre três pinos, sem pôr a maior sobre a menor (invenção). */
BTJogo.registrar({
  canvas: 'jogo-mastermyr',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As ferramentas de Mästermyr",
    "sub": "Mude as 4 ferramentas do primeiro pino para o último, uma de cada vez: toque num pino para pegar a ferramenta de cima e toque noutro para soltá-la. Nunca ponha uma ferramenta maior sobre uma menor. Use no máximo 28 movimentos e 150 segundos. (Teclado: teclas 1 a 3.)",
    "perdeu": "Os movimentos ou o tempo acabaram",
    "v1": "A pilha foi mudada!",
    "v2": "O baú de Mästermyr, achado em Gotland em 1936, tinha mais de 200 ferramentas. A torre de pinos é invenção.",
    "h1": "Ferramentas",
    "h2": "Movimentos"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The Mästermyr tools",
    "sub": "Move the 4 tools from the first peg to the last, one at a time: tap a peg to pick up its top tool and tap another to drop it. Never put a larger tool on a smaller one. Use at most 28 moves and 150 seconds. (Keyboard: keys 1 to 3.)",
    "perdeu": "The moves or the time ran out",
    "v1": "The stack is moved!",
    "v2": "The Mästermyr chest, found on Gotland in 1936, held more than 200 tools. The tower of pegs is invented.",
    "h1": "Tools",
    "h2": "Moves"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Mästermyr-verktøyene",
    "sub": "Flytt de 4 verktøyene fra første pinne til siste, ett om gangen: trykk på en pinne for å ta det øverste verktøyet og trykk på en annen for å slippe det. Legg aldri et større verktøy på et mindre. Bruk høyst 28 trekk og 150 sekunder. (Tastatur: tast 1 til 3.)",
    "perdeu": "Trekkene eller tiden tok slutt",
    "v1": "Stabelen er flyttet!",
    "v2": "Mästermyr-kisten, funnet på Gotland i 1936, inneholdt mer enn 200 verktøy. Pinnetårnet er oppfunnet.",
    "h1": "Verktøy",
    "h2": "Trekk"
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
    var ND = 4, MAXM = 28, LIM = 150, COLS = ['#d9a93a', '#c0563f', '#4a98b8', '#7b6a9a'];
    var pegs = [], hold = -1, moves = 0, t = 0, shake = 0, cur = 0;
    function lay() { var W = api.w, H = api.h, s = Math.max(0.8, Math.min(1.5, Math.min(W / 800, H / 450) * 1.2)), px = [W * 0.2, W * 0.5, W * 0.8]; return { W: W, H: H, s: s, px: px, by: H * 0.72, dh: 30 * s, unit: Math.min(W * 0.28, 150 * s) / 4.4 }; }
    function reset() { pegs = [[4, 3, 2, 1], [], []]; hold = -1; moves = 0; t = 0; shake = 0; st = 'play'; }
    function tap(p) {
      if (st !== 'play') return;
      if (hold < 0) { if (pegs[p].length) hold = p; return; }
      if (p === hold) { hold = -1; return; }
      var d = pegs[hold][pegs[hold].length - 1], tp = pegs[p].length ? pegs[p][pegs[p].length - 1] : 99;
      if (d < tp) { pegs[hold].pop(); pegs[p].push(d); moves++; hold = -1; if (api.nota) api.nota(300 + d * 60, 0.1, 'triangle', 0.05); if (pegs[2].length === ND) st = 'win'; else if (moves >= MAXM) st = 'lose'; }
      else { shake = 0.3; hold = -1; if (api.nota) api.nota(120, 0.15, 'sawtooth', 0.05); }
    }
    function at(x) { var L = lay(); return x < (L.px[0] + L.px[1]) / 2 ? 0 : x < (L.px[1] + L.px[2]) / 2 ? 1 : 2; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, pegs: pegs.map(function (a) { return a.slice(); }), hold: hold, moves: moves, max: MAXM, t: t, px: L.px, by: L.by }; },
      down: function (x, y) { if (menu()) return; cur = at(x); tap(cur); },
      move: function () {}, up: function () {},
      key: function (k, d) {
        if (!d) return; if (st !== 'play') { menu(); return; }
        if (k === 'Digit1' || k === 'Numpad1') { cur = 0; tap(0); } else if (k === 'Digit2' || k === 'Numpad2') { cur = 1; tap(1); } else if (k === 'Digit3' || k === 'Numpad3') { cur = 2; tap(2); }
        else if (k === 'ArrowLeft' || k === 'KeyA') cur = Math.max(0, cur - 1); else if (k === 'ArrowRight' || k === 'KeyD') cur = Math.min(2, cur + 1); else if (k === 'Space' || k === 'Enter') tap(cur);
      },
      update: function (dt) { if (shake > 0) shake -= dt; if (st !== 'play') return; t += dt; if (t >= LIM) st = 'lose'; },
      draw: function () {
        var L = lay(), W = L.W, H = L.H, i, j;
        bg('#2a3036', '#0e1114');
        g.fillStyle = '#4a3a2a'; g.fillRect(W * 0.04, L.by + 4, W * 0.92, 16 * L.s);
        for (i = 0; i < 3; i++) {
          g.fillStyle = i === 2 ? '#7a6a3a' : '#5a5040'; g.fillRect(L.px[i] - 4, L.by - L.dh * 5.2, 8, L.dh * 5.2 + 6);
          if (st === 'play' && i === cur) { g.strokeStyle = 'rgba(255,216,138,.55)'; g.lineWidth = 2; g.strokeRect(L.px[i] - L.unit * 2.6, L.by - L.dh * 5.4, L.unit * 5.2, L.dh * 5.6 + 22 * L.s); }
          txt(String(i + 1), L.px[i], L.by + 18 * L.s + 14, 15 * L.s, '#a99d80');
          for (j = 0; j < pegs[i].length; j++) {
            var d = pegs[i][j], w = d * L.unit * 1.1 + L.unit * 0.8, y = L.by - (j + 1) * L.dh, lift = (hold === i && j === pegs[i].length - 1) ? -L.dh * 1.6 : 0, sx = (shake > 0 && hold < 0 && j === pegs[i].length - 1) ? Math.sin(shake * 60) * 4 : 0;
            g.fillStyle = COLS[d - 1]; rr(L.px[i] - w / 2 + sx, y + lift, w, L.dh - 4, 7); g.fill(); g.fillStyle = 'rgba(255,255,255,.2)'; g.fillRect(L.px[i] - w / 2 + 6 + sx, y + lift + 4, w - 12, 4);
          }
        }
        bar(W / 2 - 110, H - 14, 220, 5, (LIM - t) / LIM, LIM - t < 20 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + pegs[2].length + '/' + ND, T.h2 + ' ' + moves + '/' + MAXM, moves >= MAXM - 5);
        fim(st);
      }
    };
  }
});
