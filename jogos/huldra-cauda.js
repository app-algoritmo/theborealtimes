/* Quem tem cauda? — descubra a huldra entre as moças da floresta. */
BTJogo.registrar({
  canvas: 'jogo-huldra',
  t: {
    pt: {
      titulo: 'Quem tem cauda?',
      sub: 'Uma huldra se esconde entre as moças da floresta. Só a cauda a trai, e por um instante, sob a barra do vestido. Toque nela quando a vir. Descubra a huldra em 5 rodadas, com no máximo 3 enganos.',
      toque: 'Toque para começar', rodada: 'Rodada', enganos: 'Enganos', demorou: 'Ela escapou',
      perdeu: 'A huldra te enganou', de_novo: 'Toque para tentar de novo',
      v1: 'Você a reconheceu!',
      v2: 'No folclore norueguês, a huldra parece uma moça bonita, mas tem cauda de vaca e, em muitos relatos, as costas ocas como um tronco. O jogo é invenção.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: 'Who has a tail?',
      sub: 'A huldra hides among the forest girls. Only her tail gives her away, for a moment, below the hem of her dress. Tap her when you see it. Spot the huldra in 5 rounds, with at most 3 mistakes.',
      toque: 'Tap to start', rodada: 'Round', enganos: 'Mistakes', demorou: 'She got away',
      perdeu: 'The huldra fooled you', de_novo: 'Tap to try again',
      v1: 'You spotted her!',
      v2: 'In Norwegian folklore the huldra looks like a pretty young woman, but has a cow\'s tail and, in many accounts, a back hollow like a tree trunk. The game is made up.',
      jogar: 'Tap to play again'
    },
    no: {
      titulo: 'Hvem har hale?',
      sub: 'En hulder skjuler seg blant jentene i skogen. Bare halen røper henne, et øyeblikk, under kjolefalden. Trykk på henne når du ser den. Avslør huldra i 5 runder, med høyst 3 feil.',
      toque: 'Trykk for å starte', rodada: 'Runde', enganos: 'Feil', demorou: 'Hun slapp unna',
      perdeu: 'Huldra lurte deg', de_novo: 'Trykk for å prøve igjen',
      v1: 'Du avslørte henne!',
      v2: 'I norsk folketro ser huldra ut som en pen ung kvinne, men har kuhale og, i mange fortellinger, en hul rygg som en trestamme. Spillet er diktet opp.',
      jogar: 'Trykk for å spille igjen'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt, ROUNDS = 5, MAXE = 3;
    var st = 'menu', rnd = 1, errs = 0, figs = [], tail = -1, tailT = 0, tailOn = 0, time = 0, limit = 0, msg = 0, pause = 0;
    var COL = ['#8a3a4a', '#3a6a8a', '#6a8a3a', '#8a6a3a', '#6a3a8a', '#3a8a7a'];
    function setup() {
      var n = 3 + Math.min(3, Math.ceil(rnd / 2)); figs = [];
      for (var i = 0; i < n; i++) figs.push({ c: COL[(i + rnd) % 6], ph: Math.random() * 6, fl: 0, nf: 0.5 + Math.random() * 2 });
      tail = Math.floor(Math.random() * n); tailT = 1.2 + Math.random() * 1.2; tailOn = 0; time = 0; limit = 11; pause = 0;
    }
    function reset() { st = 'play'; rnd = 1; errs = 0; msg = 0; setup(); }
    function geo() { var n = figs.length, W = api.w, sp = Math.min(130, (W - 60) / n), x0 = W / 2 - sp * (n - 1) / 2, out = []; for (var i = 0; i < n; i++) out.push({ x: x0 + i * sp, y: api.h * 0.72 }); return out; }
    function err() { errs++; if (errs >= MAXE) { st = 'lose'; return; } }
    return {
      pausar: function () {},
      dbg: function () { return { st: st, rnd: rnd, errs: errs, tail: tail, tailOn: tailOn, geo: geo() }; },
      down: function (x, y) {
        if (st === 'menu' || st === 'lose') { reset(); return; } if (st === 'win') { st = 'menu'; return; }
        if (pause > 0) return;
        var G = geo(), k = -1; G.forEach(function (p, i) { if (Math.abs(x - p.x) < 40 && y > p.y - 150 && y < p.y + 20) k = i; });
        if (k < 0) return;
        if (k === tail && tailOn > 0) { if (rnd >= ROUNDS) st = 'win'; else { rnd++; setup(); } }
        else { err(); if (st === 'play') { msg = 1; tailT = 1.0 + Math.random() * 1.0; tailOn = 0; } }
      },
      key: function (c, d) { if (d && (c === 'Space' || c === 'Enter')) { if (st === 'menu' || st === 'lose') reset(); else if (st === 'win') st = 'menu'; } },
      update: function (dt) {
        time += dt;
        if (st !== 'play') return;
        figs.forEach(function (f) { f.nf -= dt; if (f.nf <= 0) { f.fl = 0.5; f.nf = 1 + Math.random() * 2.2; } if (f.fl > 0) f.fl -= dt; });
        if (tailOn > 0) { tailOn -= dt; if (tailOn <= 0) tailT = 1.0 + Math.random() * 1.4; }
        else { tailT -= dt; if (tailT <= 0) tailOn = 0.85; }
        limit -= dt; if (limit <= 0) { err(); if (st === 'play') { msg = 1; limit = 11; } }
      },
      draw: function () {
        var W = api.w, H = api.h, G = geo(), i;
        var s = g.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#142a1e'); s.addColorStop(1, '#0a150f'); g.fillStyle = s; g.fillRect(0, 0, W, H);
        g.fillStyle = '#0c1c14'; for (i = 0; i < 10; i++) { var tx = i * W / 9; g.beginPath(); g.moveTo(tx - 36, H * 0.74); g.lineTo(tx, H * 0.18 + (i % 3) * 24); g.lineTo(tx + 36, H * 0.74); g.fill(); }
        g.fillStyle = '#102418'; g.fillRect(0, H * 0.72, W, H);
        if (st !== 'menu') {
          figs.forEach(function (f, k) {
            var p = G[k], sw = Math.sin(api.clock * 1.6 + f.ph) * 2 + (f.fl > 0 ? Math.sin(f.fl * 22) * 6 : 0);
            if (k === tail && tailOn > 0) { var tw = Math.sin(tailOn * 9) * 4; g.strokeStyle = '#6a4a2a'; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath(); g.moveTo(p.x + 6, p.y - 10); g.quadraticCurveTo(p.x + 22, p.y + 2 + tw, p.x + 18, p.y + 16); g.stroke(); g.fillStyle = '#2a1a10'; g.beginPath(); g.arc(p.x + 18, p.y + 18, 5, 0, 6.29); g.fill(); }
            g.fillStyle = f.c; g.beginPath(); g.moveTo(p.x - 12 + sw * 0.2, p.y - 70); g.lineTo(p.x + 12 + sw * 0.2, p.y - 70); g.lineTo(p.x + 30 + sw, p.y - 8); g.lineTo(p.x - 30 + sw, p.y - 8); g.closePath(); g.fill();
            g.fillStyle = '#e8cfae'; g.beginPath(); g.arc(p.x + sw * 0.2, p.y - 82, 11, 0, 6.29); g.fill();
            g.fillStyle = '#e8c872'; g.beginPath(); g.moveTo(p.x - 12 + sw * 0.2, p.y - 82); g.quadraticCurveTo(p.x + sw * 0.2, p.y - 108, p.x + 12 + sw * 0.2, p.y - 82); g.quadraticCurveTo(p.x + 16, p.y - 40, p.x + 12, p.y - 56); g.lineTo(p.x - 12, p.y - 56); g.quadraticCurveTo(p.x - 16, p.y - 50, p.x - 12, p.y - 82); g.fill();
            g.fillStyle = '#3a2a1a'; g.fillRect(p.x - 12, p.y - 8, 7, 10); g.fillRect(p.x + 5, p.y - 8, 7, 10);
          });
          txt(T.rodada + ' ' + rnd + '/' + ROUNDS, 24, 34, 15, '#f3ecd2', 'left');
          txt(T.enganos + ': ' + errs + '/' + MAXE, 24, 60, 15, '#ffb08a', 'left');
          var pw = Math.min(220, W - 48); g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(24, 74, pw, 6); g.fillStyle = limit < 3 ? '#ff9a8d' : '#c9b3f2'; g.fillRect(24, 74, pw * Math.max(0, limit / 11), 6);
        }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
