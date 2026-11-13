/* Os bens do túmulo — encontre os pares de objetos da tumba de Birka. */
BTJogo.registrar({
  canvas: 'jogo-birka',
  t: {
    pt: {
      titulo: 'Os bens do túmulo',
      sub: 'Na tumba Bj 581, em Birka, havia armas, cavalos e peças de jogo. Vire duas cartas por vez e encontre os 8 pares de objetos. Você pode errar no máximo 10 vezes.',
      toque: 'Toque para começar', pares: 'Pares', erros: 'Erros',
      itens: ['Espada', 'Machado', 'Flechas', 'Escudo', 'Cavalos', 'Peças de jogo', 'Seda', 'Faca'],
      perdeu: 'Erros demais', de_novo: 'Toque para tentar de novo',
      v1: 'Tumba reconstituída!',
      v2: 'Durante mais de um século, o esqueleto da tumba Bj 581 foi lido como o de um guerreiro. Em 2017, o DNA mostrou que era de uma mulher, e ainda se debate se ela comandava tropas ou se os objetos tinham outro sentido. O jogo de pares é invenção.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: 'The grave goods',
      sub: 'In grave Bj 581 at Birka there were weapons, horses and game pieces. Turn two cards at a time and find the 8 pairs of objects. You may make at most 10 mistakes.',
      toque: 'Tap to start', pares: 'Pairs', erros: 'Mistakes',
      itens: ['Sword', 'Axe', 'Arrows', 'Shield', 'Horses', 'Game pieces', 'Silk', 'Knife'],
      perdeu: 'Too many mistakes', de_novo: 'Tap to try again',
      v1: 'Grave rebuilt!',
      v2: 'For over a century the skeleton in grave Bj 581 was read as a warrior\'s. In 2017, DNA showed it was a woman, and it is still debated whether she led troops or whether the objects meant something else. The pairs game is made up.',
      jogar: 'Tap to play again'
    },
    no: {
      titulo: 'Gravgodset',
      sub: 'I grav Bj 581 på Birka lå det våpen, hester og spillebrikker. Vend to kort om gangen og finn de 8 parene av gjenstander. Du kan gjøre høyst 10 feil.',
      toque: 'Trykk for å starte', pares: 'Par', erros: 'Feil',
      itens: ['Sverd', 'Øks', 'Piler', 'Skjold', 'Hester', 'Spillebrikker', 'Silke', 'Kniv'],
      perdeu: 'For mange feil', de_novo: 'Trykk for å prøve igjen',
      v1: 'Graven er gjenskapt!',
      v2: 'I over hundre år ble skjelettet i grav Bj 581 lest som en kriger. I 2017 viste DNA at det var en kvinne, og det diskuteres fortsatt om hun ledet tropper eller om gjenstandene hadde en annen betydning. Parspillet er diktet opp.',
      jogar: 'Trykk for å spille igjen'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt, ICON = ['🗡️', '🪓', '🏹', '🛡️', '🐎', '♟️', '🧵', '🔪'], MAXE = 10;
    var st = 'menu', cards = [], open = [], pairs = 0, errs = 0, lock = 0;
    function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
    function reset() { st = 'play'; var ids = []; for (var i = 0; i < 8; i++) ids.push(i, i); cards = shuffle(ids).map(function (v) { return { v: v, up: false, done: false }; }); open = []; pairs = 0; errs = 0; lock = 0; }
    function geo() {
      var w = api.w, h = api.h, cols = w >= h * 1.1 ? 8 : 4, rows = 16 / cols, top = 90;
      var cw = Math.min((w - 24) / cols, (h - top - 20) / rows, 96), gap = 6, x0 = w / 2 - cw * cols / 2, y0 = top + (h - top - 14 - cw * rows) / 2, out = [];
      for (var i = 0; i < 16; i++) out.push({ x: x0 + (i % cols) * cw + gap / 2, y: y0 + Math.floor(i / cols) * cw + gap / 2, s: cw - gap });
      return out;
    }
    function pick(i) {
      var c = cards[i]; if (!c || c.up || c.done || lock > 0) return;
      c.up = true; open.push(i);
      if (open.length === 2) { if (cards[open[0]].v === cards[open[1]].v) { cards[open[0]].done = cards[open[1]].done = true; pairs++; open = []; if (pairs >= 8) st = 'win'; } else { errs++; lock = 0.8; } }
    }
    function tocar(x, y) { var G = geo(); for (var i = 0; i < 16; i++) if (x >= G[i].x && x <= G[i].x + G[i].s && y >= G[i].y && y <= G[i].y + G[i].s) { pick(i); return; } }
    return {
      pausar: function () {},
      dbg: function () { return { st: st, cards: cards, geo: geo(), pairs: pairs, errs: errs, lock: lock }; },
      down: function (x, y) { if (st === 'menu' || st === 'lose') reset(); else if (st === 'win') st = 'menu'; else tocar(x, y); },
      key: function (c, d) { if (d && (c === 'Space' || c === 'Enter')) { if (st === 'menu' || st === 'lose') reset(); else if (st === 'win') st = 'menu'; } },
      update: function (dt) {
        if (lock > 0) { lock -= dt; if (lock <= 0) { open.forEach(function (i) { cards[i].up = false; }); open = []; if (errs >= MAXE) st = 'lose'; } }
      },
      draw: function () {
        var W = api.w, H = api.h, G = geo(), i;
        var s = g.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#2a2118'); s.addColorStop(1, '#17110c'); g.fillStyle = s; g.fillRect(0, 0, W, H);
        if (st !== 'menu') {
          for (i = 0; i < 16; i++) {
            var c = cards[i], q = G[i]; if (!c) continue;
            g.fillStyle = c.done ? '#3a4a2a' : c.up ? '#efe3c6' : '#6a4a2a'; g.fillRect(q.x, q.y, q.s, q.s);
            g.strokeStyle = c.up || c.done ? '#c9a24a' : '#8a6a3a'; g.lineWidth = 2; g.strokeRect(q.x, q.y, q.s, q.s);
            if (c.up || c.done) { txt(ICON[c.v], q.x + q.s / 2, q.y + q.s * 0.58, q.s * 0.46, '#222'); txt(T.itens[c.v], q.x + q.s / 2, q.y + q.s - 6, Math.max(9, q.s * 0.12), c.done ? '#cfe3b0' : '#4a3a22'); }
            else { g.strokeStyle = '#a8844c'; g.beginPath(); g.moveTo(q.x + q.s * 0.3, q.y + q.s * 0.5); g.lineTo(q.x + q.s * 0.5, q.y + q.s * 0.3); g.lineTo(q.x + q.s * 0.7, q.y + q.s * 0.5); g.lineTo(q.x + q.s * 0.5, q.y + q.s * 0.7); g.closePath(); g.stroke(); }
          }
          txt(T.pares + ': ' + pairs + '/8', 24, 34, 15, '#f3ecd2', 'left');
          txt(T.erros + ': ' + errs + '/' + MAXE, 24, 60, 15, errs >= MAXE - 2 ? '#ff9a8d' : '#ffb08a', 'left');
        }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
