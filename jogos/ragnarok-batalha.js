/* A última batalha — defenda o salão dos deuses até o amanhecer. */
BTJogo.registrar({
  canvas: 'jogo-ragnarok',
  t: {
    pt: {
      titulo: 'A última batalha',
      sub: 'Ragnarök chegou, e lobos e gigantes avançam sobre o salão dos deuses. Toque na metade esquerda ou direita da tela (ou use as setas) para golpear quem se aproxima de cada lado. Resista até o amanhecer.',
      toque: 'Toque para começar', salao: 'Salão', ate: 'Até o amanhecer',
      perdeu: 'O salão caiu', de_novo: 'Toque para tentar de novo',
      v1: 'O dia nasceu!',
      v2: 'Na Völuspá e em Snorri, os deuses morrem no Ragnarök, e só depois a terra renasce. Aqui você resistiu até o amanhecer: esse final foi inventado para o jogo.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: 'The last battle',
      sub: 'Ragnarök has come, and wolves and giants advance on the gods\' hall. Tap the left or right half of the screen (or use the arrow keys) to strike whoever approaches on each side. Hold out until dawn.',
      toque: 'Tap to start', salao: 'Hall', ate: 'Until dawn',
      perdeu: 'The hall has fallen', de_novo: 'Tap to try again',
      v1: 'Dawn has broken!',
      v2: 'In the Völuspá and in Snorri, the gods die at Ragnarök, and only afterwards does the earth live again. Here you held out until dawn: that ending was made up for the game.',
      jogar: 'Tap to play again'
    },
    no: {
      titulo: 'Den siste kampen',
      sub: 'Ragnarok er kommet, og ulver og jotner rykker fram mot gudenes sal. Trykk på venstre eller høyre halvdel av skjermen (eller bruk piltastene) for å slå den som nærmer seg fra hver side. Hold ut til daggry.',
      toque: 'Trykk for å starte', salao: 'Sal', ate: 'Til daggry',
      perdeu: 'Salen falt', de_novo: 'Trykk for å prøve igjen',
      v1: 'Dagen gryr!',
      v2: 'I Vøluspå og hos Snorre dør gudene i Ragnarok, og først etterpå lever jorden igjen. Her holdt du ut til daggry: den slutten er diktet opp for spillet.',
      jogar: 'Trykk for å spille igjen'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt, META = 42;
    var st = 'menu', time = 0, hp = 5, kills = 0, cd = 0, spawn = 0, foes = [], puffs = [], slash = [0, 0], shake = 0, face = 1;
    function reset() { st = 'play'; time = 0; hp = 5; kills = 0; cd = 0; spawn = 0.8; foes = []; puffs = []; slash = [0, 0]; shake = 0; }
    function cx() { return api.w / 2; }
    function gy() { return api.h * 0.72; }
    function strike(side) {
      if (st !== 'play' || cd > 0) return;
      cd = 0.22; slash[side < 0 ? 0 : 1] = 0.16; face = side;
      var best = null, bd = 1e9;
      foes.forEach(function (f) { var d = Math.abs(f.x - cx()); if (f.side === side && d < 190 && d < bd) { bd = d; best = f; } });
      if (!best) return;
      best.hp--; best.hit = 0.15; best.x += side * 34;
      if (best.hp <= 0) { kills++; puffs.push({ x: best.x, y: gy() - 20, t: 0.4 }); foes.splice(foes.indexOf(best), 1); }
    }
    function spawnFoe() {
      var side = Math.random() < 0.5 ? -1 : 1, big = time > 10 && Math.random() < 0.3;
      foes.push({ side: side, x: cx() + side * (api.w / 2 + 50), hp: big ? 2 : 1, big: big, sp: (big ? 56 : 92) + time * 1.8, hit: 0, ph: Math.random() * 6 });
    }
    function foe(f) {
      var y = gy(), s = f.big ? 1.5 : 1, bob = Math.abs(Math.sin(api.clock * 9 + f.ph)) * 5;
      g.save(); g.translate(f.x, y - bob); g.scale(-f.side * s, s);
      g.fillStyle = f.hit > 0 ? '#ffffff' : (f.big ? '#8a2a14' : '#2b2b36');
      g.beginPath(); g.ellipse(0, -16, 26, 14, 0, 0, 6.29); g.fill();
      g.beginPath(); g.moveTo(14, -24); g.lineTo(34, -30); g.lineTo(32, -14); g.closePath(); g.fill();
      g.beginPath(); g.moveTo(18, -29); g.lineTo(20, -40); g.lineTo(26, -29); g.closePath(); g.fill();
      g.fillRect(-18, -8, 5, 12); g.fillRect(-4, -8, 5, 12); g.fillRect(8, -8, 5, 12);
      g.fillStyle = f.big ? '#ffb347' : '#ff4a3a'; g.beginPath(); g.arc(27, -22, 2.6, 0, 6.29); g.fill();
      if (f.big) { g.fillStyle = 'rgba(255,140,40,.8)'; g.beginPath(); g.moveTo(-20, -30); g.lineTo(-14, -48); g.lineTo(-8, -32); g.lineTo(-2, -52); g.lineTo(4, -32); g.closePath(); g.fill(); }
      g.restore();
    }
    function hall() {
      var x = cx(), y = gy();
      g.fillStyle = '#2a1d33'; g.fillRect(x - 60, y - 70, 120, 70);
      g.fillStyle = '#3b2846'; g.beginPath(); g.moveTo(x - 76, y - 70); g.lineTo(x, y - 118); g.lineTo(x + 76, y - 70); g.closePath(); g.fill();
      g.fillStyle = '#d9a441'; for (var i = -2; i <= 2; i++) g.fillRect(x + i * 24 - 3, y - 66, 6, 66);
      g.fillStyle = '#ffcf6b'; g.fillRect(x - 10, y - 34, 20, 34);
      g.strokeStyle = '#d9a441'; g.lineWidth = 3; g.beginPath(); g.moveTo(x - 76, y - 70); g.lineTo(x, y - 118); g.lineTo(x + 76, y - 70); g.stroke();
    }
    function hero() {
      var x = cx() + face * 38, y = gy();
      g.fillStyle = '#d8dde6'; g.beginPath(); g.arc(x, y - 44, 9, 0, 6.29); g.fill();
      g.fillStyle = '#7c4a2a'; g.fillRect(x - 8, y - 36, 16, 26); g.fillStyle = '#c9ced8'; g.fillRect(x - 6, y - 10, 5, 10); g.fillRect(x + 1, y - 10, 5, 10);
      g.strokeStyle = '#eef3ff'; g.lineWidth = 4; g.beginPath(); g.moveTo(x, y - 30); g.lineTo(x + face * 26, y - 48); g.stroke();
    }
    return {
      pausar: function () {},
      dbg: function () { return { st: st, time: time, hp: hp, kills: kills, foes: foes, cx: cx() }; },
      down: function (x) { if (st === 'menu' || st === 'lose') reset(); else if (st === 'win') st = 'menu'; else strike(x < cx() ? -1 : 1); },
      key: function (c, d) {
        if (!d) return;
        if (c === 'ArrowLeft' || c === 'KeyA') { if (st === 'play') strike(-1); }
        else if (c === 'ArrowRight' || c === 'KeyD') { if (st === 'play') strike(1); }
        else if (c === 'Space' || c === 'Enter') { if (st === 'menu' || st === 'lose') reset(); else if (st === 'win') st = 'menu'; }
      },
      update: function (dt) {
        if (cd > 0) cd -= dt; if (shake > 0) shake -= dt;
        slash[0] = Math.max(0, slash[0] - dt); slash[1] = Math.max(0, slash[1] - dt);
        puffs.forEach(function (p) { p.t -= dt; }); puffs = puffs.filter(function (p) { return p.t > 0; });
        if (st !== 'play') return;
        time += dt; if (time >= META) { st = 'win'; return; }
        spawn -= dt;
        if (spawn <= 0) { spawnFoe(); spawn = Math.max(0.42, 1.3 - time * 0.026) * (0.7 + Math.random() * 0.6); }
        for (var i = foes.length - 1; i >= 0; i--) {
          var f = foes[i]; f.hit = Math.max(0, f.hit - dt); f.x -= f.side * f.sp * dt;
          if (Math.abs(f.x - cx()) < 52) { hp--; shake = 0.3; foes.splice(i, 1); if (hp <= 0) { st = 'lose'; } }
        }
      },
      draw: function () {
        var W = api.w, H = api.h, k = Math.min(1, time / META);
        g.save();
        if (shake > 0) g.translate((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8);
        var s = g.createLinearGradient(0, 0, 0, H);
        s.addColorStop(0, k > 0.8 ? '#4a3a6a' : '#2a0e18'); s.addColorStop(0.6, k > 0.5 ? '#a8452e' : '#5a1a22'); s.addColorStop(1, k > 0.8 ? '#f0b060' : '#8a3020');
        g.fillStyle = s; g.fillRect(-10, -10, W + 20, H + 20);
        g.fillStyle = 'rgba(255,255,255,.7)'; for (var i = 0; i < 30; i++) { g.globalAlpha = (1 - k) * 0.7; g.fillRect((i * 97) % W, (i * 53) % (H * 0.5), 2, 2); } g.globalAlpha = 1;
        g.fillStyle = '#1a0f16'; g.fillRect(-10, gy(), W + 20, H);
        hall();
        foes.forEach(foe);
        hero();
        [0, 1].forEach(function (i) {
          if (slash[i] > 0) { var d = i ? 1 : -1; g.strokeStyle = 'rgba(255,255,255,' + (slash[i] / 0.16) + ')'; g.lineWidth = 5; g.beginPath(); g.arc(cx() + d * 90, gy() - 30, 52, d > 0 ? -1.2 : Math.PI - 1.2 + 0.0, d > 0 ? 1.2 : Math.PI + 1.2); g.stroke(); }
        });
        puffs.forEach(function (p) { g.fillStyle = 'rgba(255,220,160,' + p.t + ')'; g.beginPath(); g.arc(p.x, p.y, 28 * (1 - p.t), 0, 6.29); g.fill(); });
        g.restore();
        if (st !== 'menu') {
          txt(T.salao, 24, 34, 15, '#f3ecd2', 'left');
          for (var h = 0; h < 5; h++) { g.fillStyle = h < hp ? '#e6554a' : 'rgba(255,255,255,.2)'; g.beginPath(); g.arc(88 + h * 22, 29, 8, 0, 6.29); g.fill(); }
          var px = 24, pw = Math.min(220, W - 48), py = 58;
          g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(px, py, pw, 8); g.fillStyle = '#ffcf6b'; g.fillRect(px, py, pw * k, 8);
          txt(T.ate, px, py + 28, 13, '#f3ecd2', 'left');
        }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
