/* O ouro de Hrólf — espalhe ouro para deter os cavaleiros de Aðils. */
BTJogo.registrar({
  canvas: 'jogo-hrolf',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O ouro de Hrólf",
    "sub": "Três cavaleiros de Aðils perseguem Hrólf, um em cada faixa. Toque na faixa de um deles (ou use as teclas 1, 2 e 3) para jogar ouro na frente dele: ele para para recolher. Você tem dez bolsas. Chegue à floresta antes de ser alcançado três vezes.",
    "perdeu": "Os cavaleiros alcançaram Hrólf",
    "v1": "A floresta!",
    "v2": "Na Edda em Prosa, Hrólf Kraki espalha ouro em Fyrisvellir para atrasar os perseguidores. As faixas e as bolsas do jogo são invenção.",
    "h1": "Distância",
    "h2": "Alcances",
    "ouro": "ouro"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Hrólf's gold",
    "sub": "Three of Aðils's riders chase Hrólf, one in each lane. Tap a rider's lane (or use keys 1, 2 and 3) to throw gold in front of him: he stops to gather it. You have ten pouches. Reach the forest before being caught three times.",
    "perdeu": "The riders caught Hrólf",
    "v1": "The forest!",
    "v2": "In the Prose Edda, Hrólf Kraki scatters gold on Fyrisvellir to delay his pursuers. The lanes and the pouches in the game are made up.",
    "h1": "Distance",
    "h2": "Catches",
    "ouro": "gold"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Rolfs gull",
    "sub": "Tre av Adils' ryttere forfølger Rolf, én i hvert felt. Trykk på feltet til en av dem (eller bruk tastene 1, 2 og 3) for å kaste gull foran ham: Han stopper for å samle det opp. Du har ti pungar. Kom frem til skogen før du blir tatt igjen tre ganger.",
    "perdeu": "Rytterne tok Rolf igjen",
    "v1": "Skogen!",
    "v2": "I Snorres Edda sprer Rolf Krake gull på Fyrisvellir for å forsinke forfølgerne. Feltene og pungene i spillet er diktet opp.",
    "h1": "Avstand",
    "h2": "Innhentet",
    "ouro": "gull"
  }
},
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt;
    var st = 'menu';
    function menu() { if (st === 'menu' || st === 'lose') { reset(); return true; } if (st === 'win') { st = 'menu'; return true; } return false; }
    function fim(s) {
      if (s === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
      else if (s === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
      else if (s === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
    }
    function bg(a, b) { var s = g.createLinearGradient(0, 0, 0, api.h); s.addColorStop(0, a); s.addColorStop(1, b); g.fillStyle = s; g.fillRect(0, 0, api.w, api.h); }
    function hud(a, b, bad) { if (st === 'menu') return; txt(a, 22, 32, 15, '#f3ecd2', 'left'); if (b) txt(b, 22, 54, 13, bad ? '#ffb08a' : '#c9b3f2', 'left'); }
    var GOAL = 30, POUCH = 10, MAXE = 3;
    var t = 0, gaps = [], stop = [], piles = [], pouch = 0, errs = 0, dist = 0, flash = 0;
    var MUL = [1, 1.18, 0.92];
    function reset() { st = 'play'; t = 0; dist = 0; pouch = POUCH; errs = 0; gaps = [250, 300, 350]; stop = [0, 0, 0]; piles = []; flash = 0; }
    function lanes() { var H = api.h; return [H * 0.34, H * 0.52, H * 0.70]; }
    function hx() { return api.w * 0.78; }
    function jogar(i) {
      if (st !== 'play' || i < 0 || i > 2 || pouch <= 0 || stop[i] > 0) return;
      pouch--; stop[i] = 1.3; piles.push({ i: i, x: hx() - gaps[i] + 46, l: 1.5 });
    }
    return {
      pausar: function () {},
      dbg: function () { return { st: st, t: t, pouch: pouch, errs: errs, gaps: gaps.slice(), stop: stop.slice() }; },
      down: function (x, y) { if (menu()) return; var L2 = lanes(), b = 0, d = 1e9; for (var i = 0; i < 3; i++) { var dd = Math.abs(y - L2[i]); if (dd < d) { d = dd; b = i; } } jogar(b); },
      key: function (c, d) { if (!d) return; if (st !== 'play') { if (c === 'Space' || c === 'Enter') menu(); return; } var k = { Digit1: 0, Digit2: 1, Digit3: 2, KeyA: 0, KeyS: 1, KeyD: 2 }[c]; if (k !== undefined) jogar(k); },
      update: function (dt) {
        if (st !== 'play') return;
        t += dt; var s = Math.floor(t); if (s > dist) dist = Math.min(GOAL, s);
        flash = Math.max(0, flash - dt);
        for (var i = 0; i < 3; i++) {
          if (stop[i] > 0) { stop[i] -= dt; gaps[i] += 120 * dt; } else gaps[i] -= (22 + t * 0.45) * MUL[i] * dt;
          if (gaps[i] <= 70) { errs++; gaps[i] = 150; stop[i] = 0.4; flash = 0.4; }
        }
        piles.forEach(function (p) { p.l -= dt; }); piles = piles.filter(function (p) { return p.l > 0; });
        if (errs >= MAXE) st = 'lose'; else if (t >= GOAL) { dist = GOAL; st = 'win'; }
      },
      draw: function () {
        var W = api.w, H = api.h, L2 = lanes(), X = hx(), sc = t * 120;
        bg('#e9b873', '#5a3a2a');
        g.fillStyle = '#3d6a3a'; g.fillRect(0, H * 0.22, W, H * 0.62);
        g.fillStyle = 'rgba(0,0,0,.12)'; for (var i = 0; i < 3; i++) g.fillRect(0, L2[i] + 20, W, 4);
        g.fillStyle = '#25502a'; for (var k = 0; k < 9; k++) { var tx = ((k * 130 - sc * 0.5) % (W + 140) + W + 140) % (W + 140) - 70; g.beginPath(); g.moveTo(tx, H * 0.24); g.lineTo(tx - 22, H * 0.24 + 52); g.lineTo(tx + 22, H * 0.24 + 52); g.fill(); }
        if (t > GOAL - 7) { var a = Math.min(1, (t - (GOAL - 7)) / 7); g.fillStyle = 'rgba(10,40,20,' + (0.8 * a) + ')'; g.fillRect(W * (1 - 0.18 * a), H * 0.2, W * 0.18 * a + 2, H * 0.66); }
        piles.forEach(function (p) { var y = L2[p.i] + 12; g.fillStyle = '#ffd44a'; for (var j = 0; j < 6; j++) { g.beginPath(); g.arc(p.x - 12 + j * 5, y - (j % 2) * 4, 4, 0, 6.29); g.fill(); } });
        for (var r = 0; r < 3; r++) { var rx = X - gaps[r], ry = L2[r]; g.fillStyle = stop[r] > 0 ? '#8a5a2a' : '#3a2a2a'; g.fillRect(rx - 22, ry - 6, 46, 18); g.fillRect(rx + 14, ry - 18, 10, 14); g.fillStyle = '#b8352f'; g.fillRect(rx - 6, ry - 24, 12, 18); g.fillStyle = '#e8c9a0'; g.beginPath(); g.arc(rx, ry - 30, 6, 0, 6.29); g.fill(); g.fillRect(rx - 20, ry + 12, 4, 12); g.fillRect(rx + 14, ry + 12, 4, 12); if (gaps[r] < 130) txt('!', rx, ry - 44, 18, '#ff6a4a'); }
        var hy = L2[1]; g.fillStyle = '#f5f0e0'; g.fillRect(X - 24, hy - 6, 50, 20); g.fillRect(X + 16, hy - 20, 11, 16); g.fillStyle = '#ffd88a'; g.fillRect(X - 6, hy - 28, 12, 22); g.fillStyle = '#e8c9a0'; g.beginPath(); g.arc(X, hy - 34, 7, 0, 6.29); g.fill(); g.fillRect(X - 22, hy + 14, 4, 12); g.fillRect(X + 16, hy + 14, 4, 12);
        for (var b = 0; b < POUCH; b++) { g.fillStyle = b < pouch ? '#ffd44a' : 'rgba(255,255,255,.18)'; g.beginPath(); g.arc(24 + b * 18, H - 26, 6, 0, 6.29); g.fill(); }
        txt(T.ouro, 22 + 0, H - 44, 12, '#fff2c4', 'left');
        if (flash > 0) { g.fillStyle = 'rgba(255,60,40,' + flash * 0.5 + ')'; g.fillRect(0, 0, W, H); }
        hud(T.h1 + ' ' + dist + '/' + GOAL, T.h2 + ' ' + errs + '/' + MAXE, errs > 0);
        fim(st);
      }
    };
  }
});
