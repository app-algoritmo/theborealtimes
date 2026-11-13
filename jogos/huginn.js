/* O voo de Huginn — toque para bater as asas e passe entre os galhos de Yggdrasil. */
BTJogo.registrar({
  canvas: 'jogo-huginn',
  t: {
    pt: {
      titulo: 'O voo de Huginn', sub: 'Toque (ou espaço) para bater as asas. Passe entre os galhos da Árvore do Mundo e traga as notícias do mundo a Odin.',
      toque: 'Toque para começar', pontos: 'Galhos',
      perdeu: 'Huginn se perdeu', de_novo: 'Toque para tentar de novo',
      v1: 'Huginn e Muninn voltaram a Odin!',
      v2: 'Os corvos Huginn (“pensamento”) e Muninn (“memória”) saem todo dia pelo mundo. No poema Grímnismál, da Edda Poética, Odin teme que Huginn não volte e teme mais ainda por Muninn. Os galhos do voo são invenção do jogo.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: 'The flight of Huginn', sub: 'Tap (or press space) to flap. Fly through the branches of the World Tree and bring the news of the world to Odin.',
      toque: 'Tap to start', pontos: 'Branches',
      perdeu: 'Huginn got lost', de_novo: 'Tap to try again',
      v1: 'Huginn and Muninn are back with Odin!',
      v2: 'The ravens Huginn (“thought”) and Muninn (“memory”) fly out across the world each day. In the poem Grímnismál, in the Poetic Edda, Odin fears Huginn may not come back, and fears even more for Muninn. The branches in the flight are made up for the game.',
      jogar: 'Tap to play again'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt, META = 20;
    var st = 'menu', y = 0, vy = 0, pipes = [], score = 0, spawn = 0, hist = [], BX = 130;
    function gap() { return Math.max(180, Math.min(235, api.h * 0.34)); }
    function start() { st = 'play'; y = api.h / 2; vy = 0; pipes = []; score = 0; spawn = 0.4; hist = []; }
    function bate() { if (st === 'play') vy = -430; }
    function ramo(p) {
      var G = gap();
      function tronco(y0, y1) {
        g.fillStyle = '#4a2c14'; g.fillRect(p.x - 22, y0, 44, y1 - y0);
        g.fillStyle = '#6b3e1f'; g.fillRect(p.x - 22, y0, 12, y1 - y0);
      }
      tronco(0, p.top); tronco(p.top + G, api.h);
      g.fillStyle = '#1f6a3d';
      [[p.top, -1], [p.top + G, 1]].forEach(function (e) {
        g.beginPath(); g.arc(p.x, e[0], 38, 0, 6.29); g.fill();
        g.beginPath(); g.arc(p.x - 20, e[0] + e[1] * 12, 28, 0, 6.29); g.fill();
      });
    }
    function corvo(x, yy, a, cor) {
      var asa = Math.sin(api.clock * 14 + a) * 14;
      g.save(); g.translate(x, yy); g.rotate(Math.max(-0.5, Math.min(0.6, vy / 700)));
      g.fillStyle = cor; g.beginPath(); g.ellipse(0, 0, 20, 12, 0, 0, 6.29); g.fill();
      g.beginPath(); g.moveTo(-8, 0); g.lineTo(-30 + asa / 3, -asa - 6); g.lineTo(2, -4); g.fill();
      g.beginPath(); g.arc(18, -6, 8, 0, 6.29); g.fill();
      g.fillStyle = '#d4a24a'; g.beginPath(); g.moveTo(24, -8); g.lineTo(36, -4); g.lineTo(24, -2); g.fill();
      g.fillStyle = '#fff'; g.beginPath(); g.arc(20, -8, 2, 0, 6.29); g.fill();
      g.fillStyle = cor; g.beginPath(); g.moveTo(-18, 0); g.lineTo(-34, 6); g.lineTo(-30, -4); g.fill();
      g.restore();
    }
    return {
      down: function () { if (st === 'menu' || st === 'lose') start(); else if (st === 'win') st = 'menu'; else bate(); },
      pausar: function () {},
      key: function (c, d) { if ((c === 'Space' || c === 'ArrowUp' || c === 'KeyW' || c === 'Enter') && d) { if (st === 'play') bate(); else if (st === 'menu' || st === 'lose') start(); else if (st === 'win') st = 'menu'; } },
      update: function (dt) {
        if (st === 'menu') { y = api.h / 2 + Math.sin(api.clock * 2) * 12; return; }
        if (st !== 'play') return;
        vy += 1400 * dt; y += vy * dt;
        hist.push(y); if (hist.length > 14) hist.shift();
        spawn -= dt;
        if (spawn <= 0) { spawn = 1.6; var G = gap(); pipes.push({ x: api.w + 50, top: 70 + Math.random() * (api.h - G - 140), ok: false }); }
        for (var i = pipes.length - 1; i >= 0; i--) {
          var p = pipes[i]; p.x -= 200 * dt;
          if (p.x < -80) { pipes.splice(i, 1); continue; }
          if (!p.ok && p.x < BX - 22) { p.ok = true; score++; if (score >= META) { st = 'win'; return; } }
          if (BX + 14 > p.x - 22 && BX - 14 < p.x + 22 && (y - 10 < p.top || y + 10 > p.top + gap())) { st = 'lose'; return; }
        }
        if (y > api.h - 12 || y < 12) st = 'lose';
      },
      draw: function () {
        var W = api.w, H = api.h, s = g.createLinearGradient(0, 0, 0, H);
        s.addColorStop(0, '#1a1440'); s.addColorStop(1, '#4b2a7b'); g.fillStyle = s; g.fillRect(0, 0, W, H);
        g.fillStyle = 'rgba(255,255,255,.8)'; for (var i = 0; i < 80; i++) g.fillRect((i * 173) % W, (i * 71) % H, 2, 2);
        g.fillStyle = '#e9e1f7'; g.beginPath(); g.arc(W * 0.5, 100, 26, 0, 6.29); g.fill();
        pipes.forEach(ramo);
        if (st !== 'menu') corvo(BX - 46, hist.length ? hist[0] + 6 : y, 2, '#2b2b36');
        corvo(BX, y, 0, '#15151c');
        if (st !== 'menu') txt(T.pontos + ': ' + score + '/' + META, 24, 34, 16, '#fff', 'left');
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd84a');
      }
    };
  }
});
