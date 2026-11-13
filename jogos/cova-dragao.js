/* A cova do dragão — cave, espere o dragão passar e fure o ponto mole. */
BTJogo.registrar({
  canvas: 'jogo-cova',
  t: {
    pt: {
      titulo: 'A cova do dragão',
      sub: 'Toque (ou use a barra de espaço) várias vezes para cavar a cova antes que o dragão chegue. Depois, quando o ponto claro da barriga dele passar bem em cima de Sigurd, toque para golpear. O dragão passa três vezes.',
      toque: 'Toque para começar', cavar: 'Cave! Toque rápido', golpe: 'Toque para golpear!', passada: 'Passada',
      perdeu: 'O dragão escapou', p1: 'A cova não ficou pronta a tempo.', p2: 'Você errou as três passadas.', de_novo: 'Toque para tentar de novo',
      v1: 'O dragão caiu!',
      v2: 'Na Saga dos Volsungos, Sigurd cava uma cova no caminho de Fafnir e o fere por baixo, conselho que recebe de Odin disfarçado. As três passadas e o tempo para cavar são invenção do jogo.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: "The dragon's pit",
      sub: 'Tap (or use the space bar) again and again to dig the pit before the dragon arrives. Then, when the pale spot on his belly passes right over Sigurd, tap to strike. The dragon passes three times.',
      toque: 'Tap to start', cavar: 'Dig! Tap fast', golpe: 'Tap to strike!', passada: 'Pass',
      perdeu: 'The dragon got away', p1: 'The pit was not ready in time.', p2: 'You missed all three passes.', de_novo: 'Tap to try again',
      v1: 'The dragon has fallen!',
      v2: "In the Völsunga Saga, Sigurd digs a pit on Fafnir's path and wounds him from below, advice he gets from Odin in disguise. The three passes and the time limit for digging are made up for the game.",
      jogar: 'Tap to play again'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt, N = 14, GAP = 26, SEG = 7;
    var st = 'menu', prof = 0, tc = 0, pas = 0, hx = 0, dir = 1, usou = false, sw = 0, res = '', fim = 0, flash = 0;
    function gy() { return api.h * 0.55; }
    function reset() { st = 'cava'; prof = 0; tc = 0; pas = 0; sw = 0; res = ''; flash = 0; }
    function inicia() {
      dir = pas % 2 === 0 ? 1 : -1; hx = dir === 1 ? -60 : api.w + 60; usou = false; st = 'passa';
    }
    function segx(i) { return hx - dir * i * GAP; }
    function bate() {
      if (st === 'cava') { prof = Math.min(1, prof + 0.085); if (prof >= 1) { pas = 0; st = 'pausa'; fim = 0.9; } }
      else if (st === 'passa' && !usou) {
        usou = true; sw = 0.001;
        if (Math.abs(segx(SEG) - api.w / 2) < 26) { res = 'ok'; st = 'golpe'; fim = 0.7; }
        else { res = 'erro'; flash = 0.4; }
      }
    }
    function acao() {
      if (st === 'menu' || st === 'lose') reset(); else if (st === 'win') st = 'menu'; else bate();
    }
    return {
      pausar: function () {}, down: acao,
      key: function (c, d) { if (d && (c === 'Space' || c === 'Enter')) acao(); },
      update: function (dt) {
        if (sw > 0) sw = Math.min(1, sw + dt * 5);
        if (flash > 0) flash -= dt;
        if (st === 'cava') { tc += dt; prof = Math.max(0, prof - 0.045 * dt); if (tc > 9) st = 'lose', res = 'p1'; }
        else if (st === 'pausa') { fim -= dt; if (fim <= 0) inicia(); }
        else if (st === 'passa') {
          hx += dir * (140 + 45 * pas) * dt;
          var cauda = segx(N);
          if ((dir === 1 && cauda > api.w + 40) || (dir === -1 && cauda < -40)) {
            pas++; sw = 0;
            if (pas >= 3) { st = 'lose'; res = 'p2'; } else { st = 'pausa'; fim = 0.6; }
          }
        } else if (st === 'golpe') { fim -= dt; if (fim <= 0) st = 'win'; }
      },
      draw: function () {
        var W = api.w, H = api.h, cx = W / 2, c = api.clock, G = gy();
        var s = g.createLinearGradient(0, 0, 0, G); s.addColorStop(0, '#16222e'); s.addColorStop(1, '#4a5a66'); g.fillStyle = s; g.fillRect(0, 0, W, G);
        g.fillStyle = 'rgba(255,255,255,.07)'; for (var i = 0; i < 4; i++) { g.beginPath(); g.ellipse((i * 233 + c * 8) % (W + 200) - 100, 70 + i * 34, 120, 22, 0, 0, 6.29); g.fill(); }
        // chão e cova
        g.fillStyle = '#3a2a1c'; g.fillRect(0, G, W, H - G);
        g.fillStyle = '#4c6a38'; g.fillRect(0, G - 6, W, 10);
        var pd = 8 + prof * 78;
        g.fillStyle = '#120c08'; g.fillRect(cx - 30, G - 2, 60, pd);
        g.fillStyle = '#5a3f27'; g.fillRect(cx - 38, G - 6, 8, 10); g.fillRect(cx + 30, G - 6, 8, 10);
        // Sigurd
        var sy = G + pd - 4;
        g.fillStyle = '#b8bcc4'; g.beginPath(); g.arc(cx, sy - 20, 9, 3.14, 6.29); g.fill();
        g.fillStyle = '#e8c9a0'; g.fillRect(cx - 7, sy - 20, 14, 8);
        g.fillStyle = '#9a3a2a'; g.fillRect(cx - 9, sy - 12, 18, 14);
        if (sw > 0) { var L = 20 + sw * (pd + 56); g.fillStyle = '#e8eef5'; g.fillRect(cx - 2, sy - 12 - L, 4, L); }
        else { g.fillStyle = '#e8eef5'; g.fillRect(cx - 2, sy - 40, 4, 28); }
        // dragão
        if (st === 'passa' || st === 'golpe') {
          for (var k = N; k >= 0; k--) {
            var x = segx(k), y = G - 40 - Math.sin(c * 5 + k * 0.7) * 7, r = 20 - k * 0.7;
            g.fillStyle = k % 2 ? '#2f6b3a' : '#3b8148'; g.beginPath(); g.arc(x, y, r, 0, 6.29); g.fill();
            if (k === SEG) {
              var pu = 0.6 + Math.sin(c * 8) * 0.4; g.fillStyle = 'rgba(220,255,240,' + (0.55 + pu * 0.4) + ')'; g.beginPath(); g.arc(x, y + r * 0.45, 11, 0, 6.29); g.fill();
              g.strokeStyle = 'rgba(255,255,255,' + pu + ')'; g.lineWidth = 2; g.beginPath(); g.arc(x, y + r * 0.45, 15, 0, 6.29); g.stroke();
            }
            g.fillStyle = '#25552e'; g.beginPath(); g.moveTo(x - 6, y - r); g.lineTo(x, y - r - 9); g.lineTo(x + 6, y - r); g.fill();
          }
          var hy = G - 40 - Math.sin(c * 5) * 7;
          g.fillStyle = '#2b5f35'; g.beginPath(); g.arc(hx + dir * 12, hy - 4, 22, 0, 6.29); g.fill();
          g.fillStyle = '#25552e'; g.beginPath(); g.moveTo(hx + dir * 6, hy - 22); g.lineTo(hx + dir * 0, hy - 40); g.lineTo(hx + dir * 16, hy - 24); g.fill();
          g.fillStyle = '#ffcf4a'; g.beginPath(); g.arc(hx + dir * 22, hy - 10, 4.5, 0, 6.29); g.fill();
          g.fillStyle = '#111'; g.beginPath(); g.arc(hx + dir * 23, hy - 10, 2, 0, 6.29); g.fill();
          g.fillStyle = '#1b3f23'; g.fillRect(hx + dir * 26 - (dir < 0 ? 18 : 0), hy + 2, 18, 8);
        }
        if (flash > 0) { g.fillStyle = 'rgba(255,90,70,' + (flash * 0.5) + ')'; g.fillRect(0, 0, W, H); }
        // textos de ajuda
        if (st === 'cava') {
          txt(T.cavar, 24, 34, 16, '#ffe6b0', 'left');
          g.fillStyle = 'rgba(255,255,255,.2)'; g.fillRect(24, 46, 160, 10); g.fillStyle = '#ffcf4a'; g.fillRect(24, 46, 160 * prof, 10);
          txt(Math.max(0, Math.ceil(9 - tc)) + 's', 194, 56, 14, '#fff', 'left');
        } else if (st === 'passa') {
          txt(T.passada + ' ' + (pas + 1) + '/3', 24, 34, 16, '#fff', 'left');
          if (!usou) txt(T.golpe, 24, 58, 16, '#ffe6b0', 'left');
        }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [T[res]], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
