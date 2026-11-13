/* A balança do mercador — some os pedaços de prata até o peso exato. */
BTJogo.registrar({
  canvas: 'jogo-balanca',
  t: {
    pt: {
      titulo: 'A balança do mercador',
      sub: 'O comprador quer exatamente o peso pedido em prata. Toque nos pedaços para pôr ou tirar da balança até o peso bater. Seis negócios, tempo limitado, até duas falhas.',
      toque: 'Toque para começar', negocio: 'Negócio', alvo: 'Peso pedido', na_balanca: 'Na balança', falhas: 'Falhas',
      perdeu: 'O comprador foi embora', de_novo: 'Toque para tentar de novo',
      v1: 'Negócios fechados!',
      v2: 'Os vikings pesavam prata em balanças pequenas e cortavam moedas e joias em pedaços (hacksilver). Os pesos e os negócios do jogo são inventados.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: "The merchant's scales",
      sub: 'The buyer wants exactly the weight asked in silver. Tap the pieces to put them on or take them off the scales until the weight matches. Six deals, limited time, up to two failures.',
      toque: 'Tap to start', negocio: 'Deal', alvo: 'Weight asked', na_balanca: 'On the scales', falhas: 'Failures',
      perdeu: 'The buyer walked away', de_novo: 'Tap to try again',
      v1: 'Deals done!',
      v2: 'The Vikings weighed silver on small scales and cut coins and jewellery into pieces (hacksilver). The weights and the deals in the game are made up.',
      jogar: 'Tap to play again'
    },
    no: {
      titulo: 'Kjøpmannens vekt',
      sub: 'Kjøperen vil ha nøyaktig den vekten han ber om i sølv. Trykk på bitene for å legge dem på eller ta dem av vekten til vekten stemmer. Seks handler, begrenset tid, opptil to feil.',
      toque: 'Trykk for å starte', negocio: 'Handel', alvo: 'Ønsket vekt', na_balanca: 'På vekten', falhas: 'Feil',
      perdeu: 'Kjøperen gikk sin vei', de_novo: 'Trykk for å prøve igjen',
      v1: 'Handlene er i havn!',
      v2: 'Vikingene veide sølv på små vekter og kuttet mynter og smykker i biter (hacksilver). Vektene og handlene i spillet er diktet opp.',
      jogar: 'Trykk for å spille igjen'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt, R = 6, MAXF = 2;
    var st = 'menu', rnd = 0, fails = 0, pcs = [], target = 0, time = 0, lim = 0, res = 0, rt = 0;
    var POOL = [2, 3, 4, 5, 7, 9, 11, 13];
    function sum() { var s = 0; pcs.forEach(function (p) { if (p.on) s += p.v; }); return s; }
    function geo() { var n = pcs.length, sp = Math.min(86, (api.w - 40) / n); return { sp: sp, x0: api.w / 2 - sp * (n - 1) / 2, y: api.h * 0.76 }; }
    function round() {
      rnd++; var pool = POOL.slice(), v = [];
      for (var i = 0; i < 6; i++) v.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
      pcs = v.map(function (x) { return { v: x, on: false, sol: false }; });
      var k = rnd < 3 ? 2 : 3, idx = [0, 1, 2, 3, 4, 5].sort(function () { return Math.random() - 0.5; }).slice(0, k); target = 0;
      idx.forEach(function (j) { pcs[j].sol = true; target += pcs[j].v; });
      lim = 26 - rnd * 1.5; time = lim; res = 0; rt = 0;
    }
    function reset() { st = 'play'; rnd = 0; fails = 0; round(); }
    function tocar(x, y) {
      if (st === 'menu' || st === 'lose') { reset(); return; }
      if (st === 'win') { st = 'menu'; return; }
      if (rt > 0) return;
      var G = geo(); pcs.forEach(function (p, i) { if (Math.abs(x - (G.x0 + i * G.sp)) < G.sp / 2 && Math.abs(y - G.y) < 52) p.on = !p.on; });
      if (sum() === target) { res = 1; rt = 0.9; }
    }
    return {
      pausar: function () {},
      dbg: function () { return { st: st, rnd: rnd, fails: fails, target: target, pcs: pcs, sum: sum(), geo: geo(), time: time }; },
      down: function (x, y) { tocar(x, y); },
      key: function (c, d) { if (d && (c === 'Space' || c === 'Enter') && st !== 'play') tocar(0, 0); },
      update: function (dt) {
        if (st !== 'play') return;
        if (rt > 0) { rt -= dt; if (rt <= 0) { if (rnd >= R) st = 'win'; else round(); } return; }
        time -= dt;
        if (time <= 0) { fails++; if (fails > MAXF) { st = 'lose'; return; } res = -1; rt = 0.9; }
      },
      draw: function () {
        var W = api.w, H = api.h, i, G = geo(), s0 = sum();
        var s = g.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#2a2218'); s.addColorStop(1, '#14100b'); g.fillStyle = s; g.fillRect(0, 0, W, H);
        var tilt = Math.max(-0.28, Math.min(0.28, (target - s0) * 0.04)), cx = W / 2, cy = H * 0.32;
        g.fillStyle = '#6b5a3a'; g.fillRect(cx - 5, cy, 10, 70); g.fillRect(cx - 40, cy + 70, 80, 8);
        g.save(); g.translate(cx, cy); g.rotate(tilt); g.fillStyle = '#c9a84a'; g.fillRect(-100, -4, 200, 8);
        [-100, 100].forEach(function (x) { g.fillStyle = '#8c7a4a'; g.fillRect(x - 1, 0, 2, 40); g.beginPath(); g.ellipse(x, 44, 40, 10, -tilt, 0, 3.14); g.fill(); });
        g.restore();
        txt(s0 + ' g', cx - 100, cy + 82, 18, s0 > target ? '#ffb08a' : '#f3ecd2');
        txt(target + ' g', cx + 100, cy + 82, 18, '#ffd88a');
        pcs.forEach(function (p, k) {
          var x = G.x0 + k * G.sp, y = G.y - (p.on ? 22 : 0);
          g.fillStyle = p.on ? '#ffd88a' : '#b8bcc6'; g.beginPath(); g.moveTo(x - 24, y + 16); g.lineTo(x - 16, y - 14); g.lineTo(x + 10, y - 20); g.lineTo(x + 24, y + 4); g.lineTo(x + 14, y + 20); g.closePath(); g.fill();
          txt(String(p.v), x, y + 6, 17, '#222');
        });
        if (res) { g.fillStyle = res > 0 ? 'rgba(80,200,120,.25)' : 'rgba(220,70,60,.25)'; g.fillRect(0, 0, W, H); }
        if (st !== 'menu') {
          txt(T.negocio + ' ' + rnd + '/' + R, 24, 34, 15, '#f3ecd2', 'left');
          txt(T.falhas + ': ' + fails + '/' + (MAXF + 1), 24, 56, 13, fails ? '#ffb08a' : '#c9b3f2', 'left');
          txt(T.alvo + ': ' + target + ' g', W / 2, H * 0.12, 20, '#ffd88a');
          var pw = Math.min(220, W - 48); g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(24, 66, pw, 6); g.fillStyle = time < 6 ? '#ffb08a' : '#9be3b4'; g.fillRect(24, 66, pw * Math.max(0, time / lim), 6);
        }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
