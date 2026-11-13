/* A pesca de Thor — segure para puxar, solte quando a serpente investir. */
BTJogo.registrar({
  canvas: 'jogo-thor',
  t: {
    pt: {
      titulo: 'A pesca de Thor',
      sub: 'Segure para puxar a linha. Solte quando a serpente investir.',
      toque: 'Toque para começar',
      tensao: 'Linha', dist: 'Fundo', aviso: 'Ela vai puxar! Solte!', rodada: 'Rodada',
      arrebentou: 'A linha arrebentou', fugiu: 'A serpente voltou ao fundo',
      de_novo: 'Toque para tentar de novo', proxima: 'Rodada vencida! Toque para a próxima',
      fim1: 'Thor trouxe Jörmungandr à superfície.',
      fim2: 'Segundo Snorri, porém, Hymir teve medo e cortou a linha: a serpente voltou ao mar e o duelo ficou para o Ragnarök.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: "Thor's fishing trip",
      sub: 'Hold to reel in. Let go when the serpent lunges.',
      toque: 'Tap to start',
      tensao: 'Line', dist: 'Depth', aviso: "It's going to pull! Let go!", rodada: 'Round',
      arrebentou: 'The line snapped', fugiu: 'The serpent sank back down',
      de_novo: 'Tap to try again', proxima: 'Round won! Tap for the next one',
      fim1: 'Thor brought Jörmungandr to the surface.',
      fim2: 'But in Snorri’s telling, Hymir panicked and cut the line: the serpent sank, and the duel was left for Ragnarök.',
      jogar: 'Tap to play again'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt;
    var R = [null,
      { reel: 11, drift: 3, gap: [3.2, 5], tens: 26 },
      { reel: 9.5, drift: 4.5, gap: [2.6, 4], tens: 30 },
      { reel: 8.5, drift: 6, gap: [2, 3.3], tens: 34 }];
    var st = 'menu', round = 1, holding = false;
    var dist = 70, tension = 15, surge = 0, warn = 0, nextSurge = 2, lost = '';

    function start(r) { round = r; dist = 70; tension = 15; surge = 0; warn = 0; nextSurge = 2 + Math.random() * 1.5; st = 'play'; }
    function press() {
      if (st === 'menu') start(1);
      else if (st === 'lose') start(round);
      else if (st === 'next') start(round + 1);
      else if (st === 'end') st = 'menu';
      else if (st === 'play') holding = true;
    }
    function water() { return api.h * 0.42; }

    function sky() {
      var W = api.w, WA = water();
      var s = g.createLinearGradient(0, 0, 0, WA); s.addColorStop(0, '#1f1b3a'); s.addColorStop(1, '#4b2a7b');
      g.fillStyle = s; g.fillRect(0, 0, W, WA);
      g.fillStyle = 'rgba(255,255,255,.75)';
      for (var i = 0; i < 70; i++) g.fillRect((i * 197) % W, (i * 53) % (WA - 40), 2, 2);
      g.fillStyle = '#e9e1f7'; g.beginPath(); g.arc(W * 0.25, 90, 22, 0, 6.29); g.fill();
    }
    function sea() {
      var W = api.w, H = api.h, WA = water();
      var s = g.createLinearGradient(0, WA, 0, H); s.addColorStop(0, '#1d5a73'); s.addColorStop(1, '#07202e');
      g.fillStyle = s; g.fillRect(0, WA, W, H - WA);
      g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 2;
      for (var k = 0; k < 3; k++) {
        g.beginPath();
        for (var x = 0; x <= W; x += 10) {
          var y = WA + 4 + k * 9 + Math.sin(x / 40 + api.clock * (1.4 + k * .3) + k) * 3;
          if (x === 0) g.moveTo(x, y); else g.lineTo(x, y);
        }
        g.stroke();
      }
    }
    function boat(bx, by) {
      g.save(); g.translate(bx, by); g.rotate(Math.sin(api.clock * 1.6) * 0.04);
      var im = api.sprite('thor-barco');
      if (im) { var w = 230, h = w * im.naturalHeight / im.naturalWidth; g.drawImage(im, -w / 2, 24 - h, w, h); g.restore(); return; }
      g.fillStyle = '#6b3e1f';
      g.beginPath(); g.moveTo(-70, -6); g.lineTo(70, -6); g.lineTo(52, 22); g.lineTo(-52, 22); g.closePath(); g.fill();
      g.fillStyle = '#8c5a2f'; g.fillRect(-70, -10, 140, 5);
      g.fillStyle = '#c99a3c'; g.beginPath(); g.arc(-70, -9, 6, 0, 6.29); g.fill();
      g.fillStyle = '#c0392b'; g.fillRect(-14, -50, 28, 44);
      g.fillStyle = '#e8c9a0'; g.beginPath(); g.arc(0, -62, 12, 0, 6.29); g.fill();
      g.fillStyle = '#d4731c'; g.beginPath(); g.arc(0, -56, 11, 0.1, 3.04); g.fill(); g.fillRect(-13, -76, 26, 8);
      g.fillStyle = '#f2f2f2'; g.fillRect(-6, -65, 3, 3); g.fillRect(3, -65, 3, 3);
      g.fillStyle = '#222'; g.fillRect(-5, -64, 1.5, 2); g.fillRect(4, -64, 1.5, 2);
      var pull = holding ? 1 : 0;
      g.strokeStyle = '#8c5a2f'; g.lineWidth = 4;
      g.beginPath(); g.moveTo(10, -36); g.lineTo(46 + pull * 4, -52 - pull * 4); g.stroke();
      g.restore();
    }
    function serpent(hx, hy) {
      var thrash = surge > 0, alert = warn > 0, c = api.clock, pts = [], n = Math.ceil((api.h - hy) / 26) + 2;
      g.lineCap = 'round'; g.lineJoin = 'round';
      for (var i = 0; i <= n; i++) pts.push([hx + Math.sin(i * 0.9 + c * (thrash ? 7 : 2.2)) * (22 + Math.min(i, 14) * 4), hy + i * 26]);
      function tr(w, col, dy) {
        g.strokeStyle = col; g.lineWidth = w; g.beginPath();
        pts.forEach(function (p, i) { if (i) g.lineTo(p[0], p[1] + (dy || 0)); else g.moveTo(p[0], p[1] + (dy || 0)); }); g.stroke();
      }
      tr(30, '#1e6b45'); tr(20, '#2f9a64');
      g.setLineDash([2, 12]); tr(3, 'rgba(210,235,160,.5)', 4); g.setLineDash([]);
      g.save(); g.translate(hx, hy);
      var hi = api.sprite('serpente-cabeca');
      if (hi) { var hw = 110, hh = hw * hi.naturalHeight / hi.naturalWidth; g.drawImage(hi, -hw / 2, -hh / 2, hw, hh); g.restore(); return; }
      g.fillStyle = '#2f9a64'; g.beginPath(); g.ellipse(0, 0, 30, 22, 0, 0, 6.29); g.fill();
      g.fillStyle = '#1e6b45'; g.beginPath(); g.moveTo(-14, -18); g.lineTo(-6, -34); g.lineTo(0, -18); g.fill();
      g.beginPath(); g.moveTo(2, -19); g.lineTo(11, -34); g.lineTo(16, -17); g.fill();
      g.fillStyle = alert || thrash ? '#ff3b30' : '#ffd84a';
      g.beginPath(); g.arc(-10, -4, 5, 0, 6.29); g.arc(10, -4, 5, 0, 6.29); g.fill();
      g.fillStyle = '#000'; g.fillRect(-11, -8, 2, 8); g.fillRect(9, -8, 2, 8);
      g.strokeStyle = '#0d3a25'; g.lineWidth = 3;
      g.beginPath(); g.moveTo(-14, 10); g.quadraticCurveTo(0, thrash ? 20 : 14, 14, 10); g.stroke();
      g.restore();
    }
    function bar(x, y, w, h, v, label, zones) {
      g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(x, y, w, h);
      if (zones) {
        g.fillStyle = 'rgba(80,200,120,.35)'; g.fillRect(x, y + h * 0.25, w, h * 0.5);
        g.fillStyle = 'rgba(230,70,60,.4)'; g.fillRect(x, y, w, h * 0.25);
      }
      g.fillStyle = zones && v > 75 ? '#ff5b4d' : '#c9b3f2';
      var fh = h * v / 100; g.fillRect(x, y + h - fh, w, fh);
      g.strokeStyle = '#f3ecd2'; g.lineWidth = 2; g.strokeRect(x, y, w, h);
      txt(label, x + w / 2, y - 8, 14, '#f3ecd2');
    }

    return {
      down: press,
      up: function () { holding = false; },
      pausar: function () { holding = false; },
      key: function (code, down) {
        if (code === 'Space' || code === 'Enter') { if (down) press(); else holding = false; }
      },
      update: function (dt) {
        if (st !== 'play') return;
        var c = R[round];
        if (warn > 0) { warn -= dt; if (warn <= 0) surge = 1.1; }
        else if (surge > 0) { surge -= dt; if (surge <= 0) nextSurge = c.gap[0] + Math.random() * (c.gap[1] - c.gap[0]); }
        else { nextSurge -= dt; if (nextSurge <= 0) warn = 0.75; }
        var pulling = surge > 0;
        if (holding) { dist -= (pulling ? c.reel * 0.35 : c.reel) * dt; tension += (c.tens + (pulling ? 60 : 0)) * dt; }
        else { tension -= 38 * dt; dist += c.drift * dt; }
        if (pulling) dist += 14 * dt;
        if (tension < 0) tension = 0;
        if (tension >= 100) { tension = 100; lost = T.arrebentou; st = 'lose'; holding = false; }
        else if (dist >= 100) { dist = 100; lost = T.fugiu; st = 'lose'; holding = false; }
        else if (dist <= 0) { dist = 0; holding = false; st = round >= 3 ? 'end' : 'next'; }
      },
      draw: function () {
        var W = api.w, H = api.h, WA = water(), cx = W / 2;
        sky(); sea();
        var sh = surge > 0 ? (Math.random() - .5) * 5 : 0;
        g.save(); g.translate(sh, sh);
        var hy = WA + 40 + dist * (H - WA - 110) / 100;
        var hx = cx + Math.sin(api.clock * 1.3) * 12 + (surge > 0 ? Math.sin(api.clock * 30) * 8 : 0);
        if (st === 'end') hy = WA - 10;
        serpent(hx, hy);
        var danger = tension > 75;
        g.strokeStyle = danger && Math.floor(api.clock * 10) % 2 ? '#ff5b4d' : '#f3ecd2'; g.lineWidth = danger ? 3 : 2;
        g.beginPath(); g.moveTo(cx + 56, WA - 88); g.lineTo(hx, hy - 20); g.stroke();
        boat(cx, WA - 40);
        g.restore();
        if (st !== 'menu') {
          var by = 96, bh = Math.min(300, H - 190);
          bar(34, by, 26, bh, tension, T.tensao, true);
          bar(W - 60, by, 26, bh, 100 - dist, T.dist, false);
          txt(T.rodada + ' ' + round + '/3', cx, 32, 17, '#f3ecd2');
        }
        if (warn > 0) txt(T.aviso, cx, 76, 24, '#ff7a6b');
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(lost, [], T.de_novo, '#ff9a8d');
        else if (st === 'next') api.cartaz(T.proxima, []);
        else if (st === 'end') api.cartaz(T.fim1, [T.fim2], T.jogar);
      }
    };
  }
});
