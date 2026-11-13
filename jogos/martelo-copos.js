/* Cadê o martelo? — siga o Mjölnir escondido sob as almofadas. */
BTJogo.registrar({
  canvas: 'jogo-martelo',
  t: {
    pt: {
      titulo: 'Cadê o martelo?',
      sub: 'O gigante Thrym escondeu o martelo de Thor. Observe sob qual almofada ele está, acompanhe as trocas e toque na almofada certa. Cinco rodadas, até duas falhas.',
      toque: 'Toque para começar', rodada: 'Rodada', vidas: 'Falhas', observe: 'Observe...', escolha: 'Onde está o martelo?',
      perdeu: 'Thrym ficou com o martelo', de_novo: 'Toque para tentar de novo',
      v1: 'Mjölnir de volta!',
      v2: 'No poema Þrymskviða, Thor se disfarça de noiva para recuperar o martelo roubado pelo gigante Thrym. O jogo das almofadas é invenção.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: 'Where is the hammer?',
      sub: "The giant Thrym has hidden Thor's hammer. Watch which cushion it is under, follow the swaps and tap the right cushion. Five rounds, up to two misses.",
      toque: 'Tap to start', rodada: 'Round', vidas: 'Misses', observe: 'Watch...', escolha: 'Where is the hammer?',
      perdeu: 'Thrym kept the hammer', de_novo: 'Tap to try again',
      v1: 'Mjölnir is back!',
      v2: "In the poem Þrymskviða, Thor disguises himself as a bride to recover the hammer stolen by the giant Thrym. The cushion game is made up.",
      jogar: 'Tap to play again'
    },
    no: {
      titulo: 'Hvor er hammeren?',
      sub: 'Jotunen Trym har gjemt Tors hammer. Se hvilken pute den ligger under, følg byttene og trykk på riktig pute. Fem runder, opptil to bom.',
      toque: 'Trykk for å starte', rodada: 'Runde', vidas: 'Bom', observe: 'Se på...', escolha: 'Hvor er hammeren?',
      perdeu: 'Trym beholdt hammeren', de_novo: 'Trykk for å prøve igjen',
      v1: 'Mjølner er tilbake!',
      v2: 'I diktet Trymskvida forkler Tor seg som brud for å få tilbake hammeren som jotunen Trym stjal. Putespillet er diktet opp.',
      jogar: 'Trykk for å spille igjen'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt, R = 5, MAXF = 2;
    var st = 'menu', rnd = 0, fails = 0, cups = [], ham = 0, phase = 'show', t = 0, left = 0, sw = null, pick = -1, res = 0;
    function sx(slot) { var sp = Math.min(150, (api.w - 80) / 3); return api.w / 2 + (slot - 1) * sp; }
    function cy() { return api.h / 2 + 20; }
    function start() { rnd++; cups = [0, 1, 2].map(function (i) { return { slot: i, x: sx(i) }; }); ham = Math.floor(Math.random() * 3); phase = 'show'; t = 1.1; left = 3 + rnd * 2; sw = null; pick = -1; }
    function reset() { st = 'play'; rnd = 0; fails = 0; start(); }
    function press(x, y) {
      if (st === 'menu' || st === 'lose') { reset(); return; }
      if (st === 'win') { st = 'menu'; return; }
      if (phase !== 'pick') return;
      var k = -1; cups.forEach(function (c, i) { if (Math.abs(x - c.x) < 55 && Math.abs(y - cy()) < 70) k = i; });
      if (k < 0) return;
      pick = k; res = k === ham ? 1 : 0; phase = 'reveal'; t = 1.0;
    }
    function dur() { return Math.max(0.28, 0.55 - rnd * 0.05); }
    return {
      pausar: function () {},
      dbg: function () { return { st: st, rnd: rnd, fails: fails, phase: phase, ham: ham, cups: cups, cy: cy(), w: api.w }; },
      down: function (x, y) { press(x, y); },
      key: function (c, d) { if (d && (c === 'Space' || c === 'Enter')) { if (st === 'menu' || st === 'lose') reset(); else if (st === 'win') st = 'menu'; } },
      update: function (dt) {
        if (st !== 'play') return;
        if (phase === 'show') { t -= dt; if (t <= 0) phase = 'shuffle'; }
        else if (phase === 'shuffle') {
          if (!sw) {
            if (left <= 0) { phase = 'pick'; return; }
            var a = Math.floor(Math.random() * 3), b = (a + 1 + Math.floor(Math.random() * 2)) % 3;
            sw = { a: a, b: b, t: 0, xa: cups[a].x, xb: cups[b].x };
          }
          sw.t += dt / dur(); var e = Math.min(1, sw.t); e = e * e * (3 - 2 * e);
          cups[sw.a].x = sw.xa + (sw.xb - sw.xa) * e; cups[sw.b].x = sw.xb + (sw.xa - sw.xb) * e;
          if (sw.t >= 1) { cups[sw.a].x = sw.xb; cups[sw.b].x = sw.xa; sw = null; left--; }
        } else if (phase === 'reveal') {
          t -= dt;
          if (t <= 0) {
            if (!res) { fails++; if (fails > MAXF) { st = 'lose'; return; } }
            if (rnd >= R) { st = 'win'; return; }
            start();
          }
        }
      },
      draw: function () {
        var W = api.w, H = api.h, i, y = cy();
        var s = g.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#2d1f12'); s.addColorStop(1, '#120c07'); g.fillStyle = s; g.fillRect(0, 0, W, H);
        g.fillStyle = '#5a3a1e'; g.fillRect(0, y + 52, W, 12);
        cups.forEach(function (c, k) {
          var up = phase === 'show' || (phase === 'reveal') ? 46 : 0;
          if (k === ham && up) txt('🔨', c.x, y + 30, 34, '#fff');
          g.fillStyle = k === pick && phase === 'reveal' ? (res ? '#4caf6a' : '#c0392b') : '#9a2f3a';
          g.beginPath(); g.ellipse(c.x, y - up + 16, 44, 36, 0, 3.14, 6.29); g.fill();
          g.fillRect(c.x - 44, y - up + 16, 88, 20); g.fillStyle = '#f3d9a0'; g.fillRect(c.x - 44, y - up + 30, 88, 5);
        });
        if (st !== 'menu') {
          txt(T.rodada + ' ' + rnd + '/' + R, 24, 34, 15, '#f3ecd2', 'left');
          txt(T.vidas + ': ' + fails + '/' + (MAXF + 1), 24, 56, 13, fails ? '#ffb08a' : '#c9b3f2', 'left');
          if (phase === 'show' || phase === 'shuffle') txt(T.observe, W / 2, y - 110, 20, '#c9b3f2'); else if (phase === 'pick') txt(T.escolha, W / 2, y - 110, 20, '#ffd88a');
        }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
