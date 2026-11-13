/* O violino da cachoeira — toque nas cordas quando as notas chegam à linha. */
BTJogo.registrar({
  canvas: 'jogo-violino',
  t: {
    pt: {
      titulo: 'O violino da cachoeira',
      sub: 'Fossegrim toca ao pé da cachoeira. Toque na corda certa quando cada nota dourada chegar à linha brilhante (no computador, use as teclas 1 a 4 ou D, F, J, K). Acerte 28 das 40 notas e as árvores dançam. O jogo tem sons simples.',
      toque: 'Toque para começar', notas: 'Notas', perf: 'Perfeito!', bom: 'Bom', errou: 'Errou',
      perdeu: 'As árvores ficaram paradas', p1: 'Você acertou', p1b: 'de 40 notas. Eram necessárias 28.', de_novo: 'Toque para tentar de novo',
      v1: 'As árvores dançaram!',
      v2: 'No folclore norueguês, Fossegrim vive nas cachoeiras e ensina violino a quem lhe leva carne numa noite de quinta-feira, a ponto de as árvores dançarem. A melodia e as notas são invenção do jogo.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: 'The waterfall fiddle',
      sub: 'Fossegrim plays at the foot of the waterfall. Tap the right string when each golden note reaches the glowing line (on a computer, use keys 1 to 4 or D, F, J, K). Hit 28 of the 40 notes and the trees dance. The game has simple sounds.',
      toque: 'Tap to start', notas: 'Notes', perf: 'Perfect!', bom: 'Good', errou: 'Miss',
      perdeu: 'The trees stood still', p1: 'You hit', p1b: 'of 40 notes. You needed 28.', de_novo: 'Tap to try again',
      v1: 'The trees danced!',
      v2: 'In Norwegian folklore, Fossegrim lives in waterfalls and teaches the fiddle to those who bring him meat on a Thursday night, so well that the trees dance. The melody and the notes are made up for the game.',
      jogar: 'Tap to play again'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt, FALL = 1.9, META = 28;
    var LANES = [0, 1, 2, 1, 0, 1, 2, 3, 2, 1, 0, 1, 2, 2, 1, 0, 1, 2, 3, 3, 2, 1, 0, 0, 1, 2, 1, 2, 3, 2, 1, 0, 0, 1, 2, 3, 2, 1, 0, 1];
    var FREQ = [293.66, 329.63, 392.0, 440.0], KEYS = { Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3, KeyD: 0, KeyF: 1, KeyJ: 2, KeyK: 3 };
    var st = 'menu', ts = 0, notas = [], hits = 0, combo = 0, msg = '', msgT = 0, msgC = '#fff', flash = [0, 0, 0, 0], ctx = null;
    function som(l) {
      try {
        if (!ctx) { var A = window.AudioContext || window.webkitAudioContext; if (!A) return; ctx = new A(); }
        if (ctx.state === 'suspended') ctx.resume();
        var o = ctx.createOscillator(), f = ctx.createBiquadFilter(), v = ctx.createGain(), n = ctx.currentTime;
        o.type = 'sawtooth'; o.frequency.value = FREQ[l]; f.type = 'lowpass'; f.frequency.value = 1800;
        v.gain.setValueAtTime(0.0001, n); v.gain.exponentialRampToValueAtTime(0.16, n + 0.03); v.gain.exponentialRampToValueAtTime(0.0001, n + 0.45);
        o.connect(f); f.connect(v); v.connect(ctx.destination); o.start(n); o.stop(n + 0.5);
      } catch (e) {}
    }
    function reset() {
      st = 'jogo'; ts = 0; hits = 0; combo = 0; msg = ''; notas = [];
      var t = 2.2;
      LANES.forEach(function (l, i) { notas.push({ l: l, t: t, ok: false, perdida: false }); t += 0.55 + (i % 4 === 3 ? 0.22 : 0); });
    }
    function geo() {
      var w = api.w, lw = Math.min(92, (w - 40) / 4), x0 = (w - lw * 4) / 2;
      return { lw: lw, x0: x0, hy: api.h - 96, top: 70 };
    }
    function toca(l) {
      if (st !== 'jogo') return;
      flash[l] = 0.2; som(l);
      var best = null, bd = 0.24;
      notas.forEach(function (n) { if (!n.ok && !n.perdida && n.l === l) { var d = Math.abs(n.t - ts); if (d < bd) { bd = d; best = n; } } });
      if (best) { best.ok = true; hits++; combo++; if (bd < 0.09) { msg = T.perf; msgC = '#ffe28a'; } else { msg = T.bom; msgC = '#9dffb0'; } }
      else { combo = 0; msg = T.errou; msgC = '#ff9a8d'; }
      msgT = 0.6;
    }
    function acao() { if (st === 'menu' || st === 'lose') reset(); else if (st === 'win') st = 'menu'; }
    return {
      pausar: function () {},
      down: function (x) {
        if (st !== 'jogo') { acao(); return; }
        var G = geo(), l = Math.floor((x - G.x0) / G.lw); if (l >= 0 && l < 4) toca(l);
      },
      key: function (c, d) {
        if (!d) return;
        if (st !== 'jogo') { if (c === 'Space' || c === 'Enter') acao(); return; }
        if (KEYS[c] !== undefined) toca(KEYS[c]);
      },
      update: function (dt) {
        for (var i = 0; i < 4; i++) if (flash[i] > 0) flash[i] -= dt;
        if (msgT > 0) msgT -= dt;
        if (st !== 'jogo') return;
        ts += dt;
        notas.forEach(function (n) { if (!n.ok && !n.perdida && ts - n.t > 0.24) { n.perdida = true; combo = 0; } });
        if (notas[notas.length - 1].t + 0.6 < ts) st = hits >= META ? 'win' : 'lose';
      },
      draw: function () {
        var W = api.w, H = api.h, c = api.clock, G = geo(), dan = Math.min(1, hits / META);
        var s = g.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#0f2a35'); s.addColorStop(1, '#27564a'); g.fillStyle = s; g.fillRect(0, 0, W, H);
        // cachoeira ao fundo
        g.fillStyle = 'rgba(210,240,250,.13)'; g.fillRect(W * 0.5 - 70, 0, 140, H);
        g.strokeStyle = 'rgba(235,250,255,.35)'; g.lineWidth = 2;
        for (var i = 0; i < 14; i++) { var x = W * 0.5 - 62 + i * 9.5, y = ((c * 220 + i * 61) % (H + 60)) - 30; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 36); g.stroke(); }
        // árvores que dançam
        for (var t = 0; t < 7; t++) {
          var tx = t < 4 ? 28 + t * 42 : W - 28 - (t - 4) * 42, sw = Math.sin(c * 3 + t) * 14 * dan;
          g.fillStyle = '#133a24'; g.beginPath(); g.moveTo(tx - 22 + sw * 0.3, H - 40); g.lineTo(tx + sw, H - 120 - (t % 3) * 14); g.lineTo(tx + 22 + sw * 0.3, H - 40); g.fill();
        }
        // cordas
        for (var l = 0; l < 4; l++) {
          var cx = G.x0 + G.lw * (l + 0.5);
          g.strokeStyle = flash[l] > 0 ? '#fff6c8' : 'rgba(255,230,160,.55)'; g.lineWidth = flash[l] > 0 ? 4 : 2; g.beginPath(); g.moveTo(cx, G.top); g.lineTo(cx, G.hy + 40); g.stroke();
          g.fillStyle = 'rgba(255,255,255,.55)'; g.font = '14px Georgia, serif'; g.textAlign = 'center'; g.fillText(String(l + 1), cx, G.hy + 64);
        }
        g.strokeStyle = 'rgba(255,236,150,.9)'; g.lineWidth = 3; g.beginPath(); g.moveTo(G.x0 - 8, G.hy); g.lineTo(G.x0 + G.lw * 4 + 8, G.hy); g.stroke();
        // notas
        notas.forEach(function (n) {
          if (n.ok) return;
          var y = G.hy - (n.t - ts) / FALL * (G.hy - G.top);
          if (y < G.top - 10 || y > H) return;
          var cx = G.x0 + G.lw * (n.l + 0.5);
          g.globalAlpha = n.perdida ? 0.3 : 1; g.fillStyle = '#ffd25a'; g.beginPath(); g.arc(cx, y, 15, 0, 6.29); g.fill();
          g.fillStyle = '#fff5c4'; g.beginPath(); g.arc(cx - 4, y - 4, 5, 0, 6.29); g.fill(); g.globalAlpha = 1;
        });
        if (st !== 'menu') {
          txt(T.notas + ' ' + hits + '/' + META, 24, 34, 16, '#fff', 'left');
          if (combo > 2) txt('x' + combo, 24, 58, 16, '#ffe28a', 'left');
          if (msgT > 0) { g.globalAlpha = Math.min(1, msgT * 2); txt(msg, W / 2, G.hy - 30, 22, msgC); g.globalAlpha = 1; }
        }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [T.p1 + ' ' + hits + ' ' + T.p1b], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
