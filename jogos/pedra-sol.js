/* A pedra do sol — ache o sol escondido pelas nuvens equilibrando as duas luzes do cristal. */
BTJogo.registrar({
  canvas: 'jogo-pedrasol',
  t: {
    pt: {
      titulo: 'A pedra do sol',
      sub: 'O céu está cheio de nuvens. Arraste o dedo (ou use as setas) para mover a mira ao longo do horizonte e olhe as duas luzes do cristal: o sol está onde as duas brilham igual. Toque em Marcar. São cinco rodadas.',
      toque: 'Toque para começar', marcar: 'Marcar', rodada: 'Rodada', acertos: 'Acertos',
      certo: 'Achou o sol!', quase: 'Errou por pouco', longe: 'Longe do sol',
      perdeu: 'Nuvens demais', p1: 'Você acertou menos de quatro vezes.', de_novo: 'Toque para tentar de novo',
      v1: 'Você achou o sol!',
      v2: 'Uma saga islandesa conta que o rei Olavo usou uma pedra do sol para mostrar onde o sol estava num dia nublado. Experimentos modernos mostram que um cristal poderia ajudar, mas ninguém sabe se os vikings o usavam. O jogo é uma simplificação.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: 'The sunstone',
      sub: 'The sky is full of clouds. Drag your finger (or use the arrow keys) to move the marker along the horizon and watch the two lights in the crystal: the sun is where both shine equally. Tap Mark. Five rounds.',
      toque: 'Tap to start', marcar: 'Mark', rodada: 'Round', acertos: 'Hits',
      certo: 'You found the sun!', quase: 'Just missed', longe: 'Far from the sun',
      perdeu: 'Too many clouds', p1: 'You got fewer than four right.', de_novo: 'Tap to try again',
      v1: 'You found the sun!',
      v2: 'An Icelandic saga says King Olaf used a sunstone to show where the sun was on a cloudy day. Modern experiments show a crystal could help, but nobody knows whether the Vikings used one. The game is a simplification.',
      jogar: 'Tap to play again'
    },
    no: {
      titulo: 'Solsteinen',
      sub: 'Himmelen er full av skyer. Dra fingeren (eller bruk piltastene) for å flytte markøren langs horisonten, og følg med på de to lysene i krystallen: solen er der begge lyser likt. Trykk Merk. Fem runder.',
      toque: 'Trykk for å starte', marcar: 'Merk', rodada: 'Runde', acertos: 'Treff',
      certo: 'Du fant solen!', quase: 'Nesten', longe: 'Langt fra solen',
      perdeu: 'For mange skyer', p1: 'Du traff færre enn fire.', de_novo: 'Trykk for å prøve igjen',
      v1: 'Du fant solen!',
      v2: 'En islandsk saga forteller at kong Olav brukte en solstein for å vise hvor solen sto en overskyet dag. Moderne forsøk viser at en krystall kan hjelpe, men ingen vet om vikingene brukte en. Spillet er en forenkling.',
      jogar: 'Trykk for å spille igjen'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt, N = 5;
    var st = 'menu', rod = 0, ac = 0, sx = 0, px = 0, press = false, res = '', fim = 0, esq = false, dir = false, ultSx = -1;
    function btn() { var w = 150, h = 46; return { x: api.w / 2 - w / 2, y: api.h - 70, w: w, h: h }; }
    function novoSol() {
      var w = api.w, x, k = 0;
      do { x = w * (0.14 + Math.random() * 0.72); k++; } while (ultSx >= 0 && Math.abs(x - ultSx) < w * 0.22 && k < 20);
      sx = x; ultSx = x; px = w * (Math.random() < 0.5 ? 0.12 : 0.88);
    }
    function reset() { st = 'jogo'; rod = 0; ac = 0; ultSx = -1; novoSol(); res = ''; }
    function marcar() {
      if (st !== 'jogo') return;
      var d = Math.abs(px - sx) / api.w;
      if (d < 0.05) { ac++; res = 'certo'; } else if (d < 0.12) res = 'quase'; else res = 'longe';
      st = 'res'; fim = 1.5;
    }
    function acao() { if (st === 'menu' || st === 'lose') reset(); else if (st === 'win') st = 'menu'; else if (st === 'jogo') marcar(); }
    function luzes() {
      var d = (px - sx) / (api.w * 0.5), ruido = (0.05 + 0.03 * rod) * Math.sin(api.clock * 13);
      var a = Math.max(0, Math.min(1, 0.5 + 0.5 * Math.max(-1, Math.min(1, d * 2.4)) + ruido));
      return [a, 1 - a];
    }
    return {
      pausar: function () { press = false; },
      down: function (x, y) {
        if (st === 'menu' || st === 'lose') { reset(); return; }
        if (st === 'win') { st = 'menu'; return; }
        if (st !== 'jogo') return;
        var b = btn();
        if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) { marcar(); return; }
        press = true; px = Math.max(10, Math.min(api.w - 10, x));
      },
      move: function (x) { if (press && st === 'jogo') px = Math.max(10, Math.min(api.w - 10, x)); },
      up: function () { press = false; },
      key: function (c, d) {
        if (c === 'ArrowLeft' || c === 'KeyA') esq = d; if (c === 'ArrowRight' || c === 'KeyD') dir = d;
        if (d && (c === 'Space' || c === 'Enter')) acao();
      },
      update: function (dt) {
        if (st === 'jogo') { if (esq) px = Math.max(10, px - api.w * 0.35 * dt); if (dir) px = Math.min(api.w - 10, px + api.w * 0.35 * dt); }
        if (st === 'res') { fim -= dt; if (fim <= 0) { rod++; if (rod >= N) st = ac >= 4 ? 'win' : 'lose'; else { novoSol(); st = 'jogo'; } } }
      },
      draw: function () {
        var W = api.w, H = api.h, c = api.clock, hor = H * 0.5;
        var s = g.createLinearGradient(0, 0, 0, hor); s.addColorStop(0, '#59616f'); s.addColorStop(1, '#a9b0ba'); g.fillStyle = s; g.fillRect(0, 0, W, hor);
        // sol aparece na revelação
        if (st === 'res' || st === 'win' || st === 'lose') {
          var k = Math.min(1, (1.5 - fim) * 2), rg = g.createRadialGradient(sx, hor - 70, 4, sx, hor - 70, 110 * k);
          rg.addColorStop(0, 'rgba(255,240,170,.95)'); rg.addColorStop(1, 'rgba(255,220,120,0)');
          if (st === 'res') { g.fillStyle = rg; g.beginPath(); g.arc(sx, hor - 70, 110 * k, 0, 6.29); g.fill(); g.fillStyle = '#ffe27a'; g.beginPath(); g.arc(sx, hor - 70, 26, 0, 6.29); g.fill(); }
        }
        // nuvens
        g.fillStyle = 'rgba(235,238,244,.9)';
        for (var i = 0; i < 9; i++) { var cx = ((i * 157 + c * 6) % (W + 260)) - 130, cy = 40 + (i * 53) % (hor - 90); g.beginPath(); g.ellipse(cx, cy, 90, 26, 0, 0, 6.29); g.ellipse(cx + 40, cy - 12, 60, 24, 0, 0, 6.29); g.fill(); }
        // mar
        var m = g.createLinearGradient(0, hor, 0, H); m.addColorStop(0, '#2c4a66'); m.addColorStop(1, '#10223a'); g.fillStyle = m; g.fillRect(0, hor, W, H - hor);
        g.strokeStyle = 'rgba(255,255,255,.15)'; g.lineWidth = 2; for (var w = 0; w < 6; w++) { g.beginPath(); for (var x2 = 0; x2 <= W; x2 += 20) g.lineTo(x2, hor + 24 + w * 22 + Math.sin(c * 1.5 + x2 * 0.02 + w) * 3); g.stroke(); }
        // mira
        g.strokeStyle = '#ffe28a'; g.lineWidth = 3; g.beginPath(); g.moveTo(px, hor - 100); g.lineTo(px, hor + 8); g.stroke();
        g.fillStyle = '#ffe28a'; g.beginPath(); g.moveTo(px - 10, hor - 100); g.lineTo(px + 10, hor - 100); g.lineTo(px, hor - 84); g.closePath(); g.fill();
        // cristal
        var L = luzes(), kx = W / 2, ky = hor + Math.max(78, (H - hor - 70) / 2);
        g.fillStyle = 'rgba(200,235,255,.35)'; g.strokeStyle = 'rgba(230,248,255,.9)'; g.lineWidth = 3;
        g.beginPath(); g.moveTo(kx, ky - 70); g.lineTo(kx + 70, ky); g.lineTo(kx, ky + 70); g.lineTo(kx - 70, ky); g.closePath(); g.fill(); g.stroke();
        [[-26, L[0]], [26, L[1]]].forEach(function (u) {
          var gl = g.createRadialGradient(kx + u[0], ky, 2, kx + u[0], ky, 34); gl.addColorStop(0, 'rgba(255,236,150,' + (0.15 + u[1] * 0.85) + ')'); gl.addColorStop(1, 'rgba(255,236,150,0)');
          g.fillStyle = gl; g.beginPath(); g.arc(kx + u[0], ky, 34, 0, 6.29); g.fill();
          g.fillStyle = 'rgba(255,248,210,' + (0.2 + u[1] * 0.8) + ')'; g.beginPath(); g.arc(kx + u[0], ky, 9, 0, 6.29); g.fill();
        });
        if (Math.abs(L[0] - L[1]) < 0.06 && st === 'jogo') { g.strokeStyle = 'rgba(157,255,176,.8)'; g.lineWidth = 3; g.beginPath(); g.arc(kx, ky, 82, 0, 6.29); g.stroke(); }
        if (st !== 'menu') {
          txt(T.rodada + ' ' + Math.min(N, rod + 1) + '/' + N, 24, 34, 16, '#fff', 'left');
          txt(T.acertos + ' ' + ac, 24, 58, 14, '#ffe6b0', 'left');
          if (st === 'jogo') {
            var b = btn(); g.fillStyle = '#7b3df0'; g.beginPath(); g.moveTo(b.x + 23, b.y); g.lineTo(b.x + b.w - 23, b.y); g.arc(b.x + b.w - 23, b.y + 23, 23, -1.57, 1.57); g.lineTo(b.x + 23, b.y + b.h); g.arc(b.x + 23, b.y + 23, 23, 1.57, 4.71); g.fill();
            txt(T.marcar, b.x + b.w / 2, b.y + 30, 20, '#fff');
          }
          if (st === 'res') txt(T[res], W / 2, hor - 130, 24, res === 'certo' ? '#9dffb0' : '#ffd0a0');
        }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [T.p1], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
