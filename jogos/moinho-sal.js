/* O moinho que mói sal — encha o navio sem afundá-lo. */
BTJogo.registrar({
  canvas: 'jogo-moinho',
  t: {
    pt: {
      titulo: 'O moinho que mói sal',
      sub: 'Segure o dedo (ou a barra de espaço) para girar o moinho e despejar sal no navio. Solte antes de passar da linha: o moinho demora a parar! Encha três navios.',
      toque: 'Toque para começar', navio: 'Navio', sobre: 'Cuidado: o moinho ainda gira!',
      perdeu: 'O navio afundou', de_novo: 'Toque para tentar de novo',
      v1: 'Três navios carregados!',
      v2: 'No conto norueguês recolhido por Asbjørnsen e Moe, um moinho mágico mói o que lhe pedem, mas o marinheiro não sabe a palavra para pará-lo. O navio afunda, e o moinho continua moendo sal no fundo do mar. O jogo é uma simplificação.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: 'The mill that grinds salt',
      sub: 'Hold your finger (or the space bar) to turn the mill and pour salt into the ship. Let go before passing the line: the mill is slow to stop! Fill three ships.',
      toque: 'Tap to start', navio: 'Ship', sobre: 'Careful: the mill is still turning!',
      perdeu: 'The ship sank', de_novo: 'Tap to try again',
      v1: 'Three ships loaded!',
      v2: 'In the Norwegian tale collected by Asbjørnsen and Moe, a magic mill grinds whatever it is asked, but the sailor does not know the word to stop it. The ship sinks, and the mill keeps grinding salt at the bottom of the sea. The game is a simplification.',
      jogar: 'Tap to play again'
    },
    no: {
      titulo: 'Saltkvernen',
      sub: 'Hold fingeren (eller mellomromstasten) nede for å dreie kvernen og helle salt i skipet. Slipp før du passerer linjen: kvernen stopper sakte! Fyll tre skip.',
      toque: 'Trykk for å starte', navio: 'Skip', sobre: 'Pass på: kvernen går fortsatt!',
      perdeu: 'Skipet sank', de_novo: 'Trykk for å prøve igjen',
      v1: 'Tre skip er lastet!',
      v2: 'I det norske eventyret samlet av Asbjørnsen og Moe maler en magisk kvern hva som helst den blir bedt om, men sjømannen kjenner ikke ordet som får den til å stoppe. Skipet synker, og kvernen fortsetter å male salt på havets bunn. Spillet er en forenkling.',
      jogar: 'Trykk for å spille igjen'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt;
    var st = 'menu', segurando = false, vel = 0, sal = 0, nav = 0, ang = 0, afund = 0, ok = 0;
    function novoNavio() { sal = 0; vel = 0; afund = 0; ok = 0; }
    function reset() { st = 'jogo'; nav = 0; novoNavio(); segurando = false; }
    function down() { if (st === 'menu' || st === 'lose') { reset(); return; } if (st === 'win') { st = 'menu'; return; } segurando = true; }
    function faixa() { return [86, 108 - nav * 4]; }
    return {
      down: down, up: function () { segurando = false; }, pausar: function () { segurando = false; },
      key: function (c, d) { if (c === 'Space' || c === 'Enter') { if (d) down(); else segurando = false; } },
      update: function (dt) {
        if (st !== 'jogo') return;
        if (segurando) vel = Math.min(120, vel + 110 * dt); else vel = Math.max(0, vel - 75 * dt);
        ang += vel * dt * 0.06; sal += vel * dt * 0.16;
        if (sal > faixa()[1]) { st = 'lose'; return; }
        var f = faixa();
        if (vel === 0 && !segurando && sal >= f[0]) { ok += dt; if (ok > 0.4) { nav++; if (nav >= 3) st = 'win'; else novoNavio(); } }
      },
      draw: function () {
        var W = api.w, H = api.h, cx = W / 2, f = faixa();
        var s = g.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#1d3a58'); s.addColorStop(1, '#0a1628'); g.fillStyle = s; g.fillRect(0, 0, W, H);
        // moinho
        var mx = cx, my = H * 0.22; g.fillStyle = '#6b6f78'; g.fillRect(mx - 40, my + 10, 80, 50);
        g.save(); g.translate(mx, my); g.rotate(ang); g.fillStyle = '#b8bcc4'; g.beginPath(); g.arc(0, 0, 42, 0, 6.29); g.fill(); g.fillStyle = '#7a7f88'; g.fillRect(-5, -42, 10, 84); g.fillRect(-42, -5, 84, 10); g.restore();
        if (vel > 5) { g.fillStyle = '#fff'; g.fillRect(mx - 3, my + 60, 6, H * 0.34 - 60); }
        // navio e sal
        var base = H * 0.62, nivel = H * 0.3 * Math.min(1.1, sal / 100), sink = sal > 100 ? (sal - 100) * 4 : 0;
        g.fillStyle = '#7a4e24'; g.beginPath(); g.moveTo(cx - 110, base + sink); g.lineTo(cx + 110, base + sink); g.lineTo(cx + 80, base + 50 + sink); g.lineTo(cx - 80, base + 50 + sink); g.closePath(); g.fill();
        g.fillStyle = '#f4f7fb'; g.fillRect(cx - 100, base - nivel + sink, 200, nivel);
        var ly = base - H * 0.3 * f[0] / 100 + sink; g.strokeStyle = '#7fd68a'; g.lineWidth = 3; g.setLineDash([8, 6]); g.beginPath(); g.moveTo(cx - 130, ly); g.lineTo(cx + 130, ly); g.stroke(); g.setLineDash([]);
        g.fillStyle = 'rgba(30,90,150,.55)'; g.fillRect(0, base + 20, W, H); 
        if (st !== 'menu') {
          txt(T.navio + ' ' + Math.min(3, nav + 1) + '/3', 24, 34, 15, '#fff', 'left');
          if (!segurando && vel > 5 && sal > f[0] - 12) txt(T.sobre, cx, H - 40, 15, '#ffd88a');
        }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
