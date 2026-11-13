/* Escolha pelos pés — Skaði escolhe um marido vendo só os pés. */
BTJogo.registrar({
  canvas: 'jogo-skadi',
  t: {
    pt: {
      titulo: 'Escolha pelos pés',
      sub: 'Como Skaði, você só vê os pés por baixo da cortina. Em cada rodada, toque no par mais limpo e sem manchas antes que o tempo acabe. Cinco rodadas; três erros e os deuses riem de você.',
      toque: 'Toque para começar', rodada: 'Rodada', erros: 'Erros',
      perdeu: 'Os deuses riram de você', de_novo: 'Toque para tentar de novo',
      v1: 'Você escolheu… Njörðr!',
      v2: 'No mito, Skaði pensou ter escolhido Baldr e escolheu Njörðr, o deus do mar. A regra dos pés vem da Edda em Prosa; o jogo é invenção.',
      jogar: 'Toque para jogar de novo', ultimo: 'O último par é de Njörðr'
    },
    en: {
      titulo: 'Choose by the feet',
      sub: 'Like Skaði, you see only feet beneath the curtain. Each round, tap the cleanest, spotless pair before time runs out. Five rounds; three mistakes and the gods laugh at you.',
      toque: 'Tap to start', rodada: 'Round', erros: 'Mistakes',
      perdeu: 'The gods laughed at you', de_novo: 'Tap to try again',
      v1: 'You chose… Njörðr!',
      v2: 'In the myth, Skaði thought she had chosen Baldr and chose Njörðr, god of the sea. The feet rule comes from the Prose Edda; the game is made up.',
      jogar: 'Tap to play again', ultimo: 'The last pair is Njörðr'
    },
    no: {
      titulo: 'Velg etter føttene',
      sub: 'Som Skade ser du bare føttene under teppet. I hver runde trykker du på det reneste paret uten flekker før tiden går ut. Fem runder; tre feil og gudene ler av deg.',
      toque: 'Trykk for å starte', rodada: 'Runde', erros: 'Feil',
      perdeu: 'Gudene lo av deg', de_novo: 'Trykk for å prøve igjen',
      v1: 'Du valgte… Njord!',
      v2: 'I myten trodde Skade at hun hadde valgt Balder og valgte Njord, havguden. Regelen med føttene kommer fra Snorres Edda; spillet er diktet opp.',
      jogar: 'Trykk for å spille igjen', ultimo: 'Det siste paret er Njords'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt, N = 5, MAXE = 3;
    var st = 'menu', rnd = 0, errs = 0, pairs = [], good = 0, time = 0, tmax = 0, res = -1, wait = 0;
    function reset() { st = 'play'; rnd = 0; errs = 0; next(); }
    function next() {
      rnd++; res = -1; wait = 0; var n = 3 + (rnd > 2 ? 1 : 0) + (rnd > 4 ? 1 : 0);
      tmax = time = 7 - rnd * 0.6; pairs = []; good = Math.floor(Math.random() * n);
      for (var i = 0; i < n; i++) pairs.push({ spots: i === good ? 0 : 1 + Math.floor(Math.random() * 3), sh: Math.random() });
    }
    function geo(i) {
      var n = pairs.length, w = api.w, h = api.h, cw = Math.min((w - 30) / n, 130);
      return { x: w / 2 + (i - (n - 1) / 2) * cw, y: h * 0.62, r: cw * 0.42 };
    }
    function fim(ok) {
      if (!ok) errs++; wait = 0.8; if (errs >= MAXE) { wait = 0.8; }
    }
    return {
      pausar: function () {},
      dbg: function () { return { st: st, rnd: rnd, errs: errs, good: good, pos: pairs.map(function (p, i) { var G = geo(i); return { x: G.x, y: G.y, ok: i === good }; }), wait: wait }; },
      down: function (x, y) {
        if (st === 'menu' || st === 'lose') { reset(); return; }
        if (st === 'win') { st = 'menu'; return; }
        if (wait > 0) return;
        for (var i = 0; i < pairs.length; i++) { var G = geo(i); if (Math.abs(x - G.x) < G.r * 1.2 && Math.abs(y - G.y) < G.r * 2.2) { res = i; fim(i === good); return; } }
      },
      key: function (c, d) { if (d && (c === 'Space' || c === 'Enter') && st !== 'play') this.down(0, 0); },
      update: function (dt) {
        if (st !== 'play') return;
        if (wait > 0) { wait -= dt; if (wait <= 0) { if (errs >= MAXE) st = 'lose'; else if (rnd >= N) st = 'win'; else next(); } return; }
        time -= dt; if (time <= 0) { res = -2; fim(false); }
      },
      draw: function () {
        var W = api.w, H = api.h, i;
        var s = g.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#26364f'); s.addColorStop(1, '#0f1a2a'); g.fillStyle = s; g.fillRect(0, 0, W, H);
        g.fillStyle = '#7a3b3b'; g.fillRect(0, 0, W, H * 0.58);
        g.fillStyle = 'rgba(0,0,0,.25)'; for (i = 0; i < W; i += 26) g.fillRect(i, 0, 3, H * 0.58);
        g.fillStyle = '#e8edf5'; g.fillRect(0, H * 0.58, W, 6);
        if (st !== 'menu') {
          txt(T.rodada + ' ' + Math.min(rnd, N) + '/' + N, 22, 32, 15, '#f3ecd2', 'left');
          txt(T.erros + ': ' + errs + '/' + MAXE, 22, 54, 13, errs ? '#ffb08a' : '#c9b3f2', 'left');
        }
        if (st === 'play') {
          for (i = 0; i < pairs.length; i++) {
            var G = geo(i), p = pairs[i], mud = wait > 0 && i === good;
            [-1, 1].forEach(function (d) {
              g.fillStyle = i === res ? (i === good ? '#6fd08c' : '#ff8a7a') : '#f1d3b0';
              g.beginPath(); g.ellipse(G.x + d * G.r * 0.55, G.y, G.r * 0.34, G.r * 0.9, 0, 0, 6.29); g.fill();
            });
            for (var k = 0; k < p.spots; k++) { g.fillStyle = '#6b4a2e'; g.beginPath(); g.arc(G.x + ((k * 37 + i * 17) % 40 - 20) * (G.r / 50), G.y + ((k * 29) % 40 - 20) * (G.r / 40), 4, 0, 6.29); g.fill(); }
            if (mud) { g.strokeStyle = '#ffd88a'; g.lineWidth = 3; g.strokeRect(G.x - G.r * 1.1, G.y - G.r * 1.1, G.r * 2.2, G.r * 2.2); }
          }
          g.fillStyle = '#ffd88a'; g.fillRect(0, H - 8, W * Math.max(0, time) / tmax, 8);
        }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
