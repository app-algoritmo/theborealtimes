/* Construir Trelleborg — alinhe a cruz giratória com a cruz do projeto. */
BTJogo.registrar({
  canvas: 'jogo-trelleborg',
  t: {
    pt: {
      titulo: 'Construir Trelleborg',
      sub: 'Uma cruz de estacas gira sobre o terreno. Toque quando ela se alinhar com a cruz do projeto, o contorno dourado, para assentar as casas de um quarto da fortaleza. Quatro etapas, quatro casas cada; a cada etapa a giro acelera e a tolerância diminui. Três erros e o plano se perde.',
      toque: 'Toque para começar', etapa: 'Etapa', erros: 'Erros', casas: 'Casas',
      perdeu: 'O plano se perdeu', de_novo: 'Toque para tentar de novo',
      v1: 'Trelleborg está de pé!',
      v2: 'A fortaleza de Trelleborg teve quatro portões, quatro quartos e dezesseis casas compridas dentro do anel, erguida por volta de 981. O jogo é uma simplificação.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: 'Build Trelleborg',
      sub: 'A cross of stakes spins over the site. Tap when it lines up with the plan cross, the golden outline, to lay the houses of one quarter of the fortress. Four stages, four houses each; at each stage the spin speeds up and the tolerance shrinks. Three mistakes and the plan is lost.',
      toque: 'Tap to start', etapa: 'Stage', erros: 'Mistakes', casas: 'Houses',
      perdeu: 'The plan was lost', de_novo: 'Tap to try again',
      v1: 'Trelleborg stands!',
      v2: 'The fortress of Trelleborg had four gates, four quarters and sixteen longhouses inside the ring, raised around 981. The game is a simplification.',
      jogar: 'Tap to play again'
    },
    no: {
      titulo: 'Bygg Trelleborg',
      sub: 'Et kors av staker snurrer over tomten. Trykk når det er på linje med planens kors, den gylne omrisset, for å sette husene i ett kvarter av festningen. Fire etapper, fire hus hver; for hver etappe går snurringen raskere og toleransen blir mindre. Tre feil og planen går tapt.',
      toque: 'Trykk for å starte', etapa: 'Etappe', erros: 'Feil', casas: 'Hus',
      perdeu: 'Planen gikk tapt', de_novo: 'Trykk for å prøve igjen',
      v1: 'Trelleborg står!',
      v2: 'Festningen Trelleborg hadde fire porter, fire kvarter og seksten langhus innenfor ringen, reist rundt 981. Spillet er en forenkling.',
      jogar: 'Trykk for å spille igjen'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt, MAXE = 3, PI2 = Math.PI / 2;
    var st = 'menu', stage = 0, errs = 0, ang = 0, dir = 1, flash = 0, fcol = '', done = [];
    function speed() { return 1.5 + stage * 0.35; }
    function tol() { return 0.34 - stage * 0.045; }
    function reset() { st = 'play'; stage = 1; errs = 0; ang = Math.random() * PI2; done = []; }
    function off() { var a = ((ang % PI2) + PI2) % PI2; return Math.min(a, PI2 - a); }
    function tocar() {
      if (st === 'menu' || st === 'lose') { reset(); return; }
      if (st === 'win') { st = 'menu'; return; }
      if (off() <= tol()) { done.push(stage); flash = 0.35; fcol = '#6fd08c'; if (stage >= 4) { st = 'win'; } else { stage++; } }
      else { errs++; flash = 0.35; fcol = '#ff6a5a'; if (errs >= MAXE) st = 'lose'; }
    }
    return {
      pausar: function () {},
      dbg: function () { return { st: st, stage: stage, errs: errs, ang: ang, off: off(), tol: tol(), speed: speed() }; },
      down: function () { tocar(); },
      key: function (c, d) { if (d && (c === 'Space' || c === 'Enter')) tocar(); },
      update: function (dt) { if (flash > 0) flash -= dt; if (st === 'play') ang += dir * speed() * dt; },
      draw: function () {
        var W = api.w, H = api.h, cx = W / 2, cy = H * 0.5, R = Math.min(W, H) * 0.36, i, q;
        var s = g.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#46603a'); s.addColorStop(1, '#2a3f25'); g.fillStyle = s; g.fillRect(0, 0, W, H);
        g.strokeStyle = '#8a6a3a'; g.lineWidth = 12; g.beginPath(); g.arc(cx, cy, R, 0, 6.29); g.stroke();
        g.strokeStyle = 'rgba(255,216,138,.9)'; g.lineWidth = 4; g.setLineDash([10, 8]); g.beginPath(); g.moveTo(cx - R, cy); g.lineTo(cx + R, cy); g.moveTo(cx, cy - R); g.lineTo(cx, cy + R); g.stroke(); g.setLineDash([]);
        for (q = 0; q < 4; q++) {
          if (done.indexOf(q + 1) < 0) continue;
          for (i = 0; i < 4; i++) { var a = q * PI2 + 0.45 + (i % 2) * 0.45, rr = R * (0.38 + Math.floor(i / 2) * 0.28); g.fillStyle = '#c9a56a'; g.fillRect(cx + Math.cos(a) * rr - 9, cy + Math.sin(a) * rr - 9, 18, 18); }
        }
        if (st === 'play') {
          g.save(); g.translate(cx, cy); g.rotate(ang); g.strokeStyle = '#f3ecd2'; g.lineWidth = 7; g.beginPath(); g.moveTo(-R, 0); g.lineTo(R, 0); g.moveTo(0, -R); g.lineTo(0, R); g.stroke(); g.restore();
          txt(T.etapa + ' ' + stage + '/4', 22, 32, 15, '#f3ecd2', 'left');
          txt(T.erros + ': ' + errs + '/' + MAXE, 22, 54, 13, errs ? '#ffb08a' : '#d9e8d0', 'left');
        } else if (st === 'win') txt(T.casas + ' 16', 22, 32, 15, '#f3ecd2', 'left');
        if (flash > 0) { g.fillStyle = fcol; g.globalAlpha = flash * 0.5; g.fillRect(0, 0, W, H); g.globalAlpha = 1; }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
