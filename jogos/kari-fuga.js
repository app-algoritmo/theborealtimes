/* A fuga de Kári — pule as chamas e alcance o telhado. */
BTJogo.registrar({
  canvas: 'jogo-kari',
  t: {
    pt: {
      titulo: 'A fuga de Kári',
      sub: 'A casa de Njál arde. Toque (ou use a barra de espaço) para pular as chamas; segure para pular mais alto. Chegue ao telhado antes que o fogo vença.',
      toque: 'Toque para começar', telhado: 'Telhado', folego: 'Fôlego',
      perdeu: 'O fogo venceu', de_novo: 'Toque para tentar de novo',
      v1: 'Kári escapou!',
      v2: 'Na Saga de Njál, Kári foge pelas vigas em chamas, com a roupa e o cabelo queimando, e se joga num riacho. O jogo é uma simplificação.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: 'Kári\'s escape',
      sub: 'Njál\'s house is burning. Tap (or use the space bar) to jump over the flames; hold to jump higher. Reach the roof before the fire wins.',
      toque: 'Tap to start', telhado: 'Roof', folego: 'Breath',
      perdeu: 'The fire won', de_novo: 'Tap to try again',
      v1: 'Kári escaped!',
      v2: 'In Njáls saga, Kári flees along the burning beams, with his clothes and hair on fire, and throws himself into a stream. The game is a simplification.',
      jogar: 'Tap to play again'
    },
    no: {
      titulo: 'Kåres flukt',
      sub: 'Njåls hus brenner. Trykk (eller bruk mellomromstasten) for å hoppe over flammene; hold inne for å hoppe høyere. Kom deg opp på taket før ilden vinner.',
      toque: 'Trykk for å starte', telhado: 'Tak', folego: 'Pust',
      perdeu: 'Ilden vant', de_novo: 'Trykk for å prøve igjen',
      v1: 'Kåre slapp unna!',
      v2: 'I Njåls saga flykter Kåre langs de brennende bjelkene, med klær og hår i brann, og kaster seg i en bekk. Spillet er en forenkling.',
      jogar: 'Trykk for å spille igjen'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt, META = 4600;
    var st = 'menu', dist = 0, y = 0, vy = 0, hold = false, hp = 3, inv = 0, obs = [], next = 0, kx = 0;
    function gy() { return api.h * 0.74; }
    function reset() { st = 'play'; dist = 0; y = 0; vy = 0; hold = false; hp = 3; inv = 0; obs = []; next = 520; }
    function speed() { return 250 + Math.min(1, dist / META) * 90; }
    function jump() { if (y <= 0.5) { vy = 560; y = 0.6; } }
    function press() { if (st === 'menu' || st === 'lose') { reset(); return; } if (st === 'win') { st = 'menu'; return; } hold = true; jump(); }
    function flame(o) {
      var x = o.x, b = gy();
      var gr = g.createLinearGradient(0, b - o.h, 0, b); gr.addColorStop(0, '#ffd45a'); gr.addColorStop(0.5, '#ff8a2a'); gr.addColorStop(1, '#d83a1a');
      g.fillStyle = gr;
      g.beginPath(); g.moveTo(x, b);
      var n = Math.max(2, Math.round(o.w / 16));
      for (var i = 0; i <= n; i++) { var fx = x + i * o.w / n, wob = Math.sin(api.clock * 11 + i * 1.7 + x * 0.02) * 6; g.lineTo(fx, b - o.h * (i % 2 ? 1 : 0.62) - wob); }
      g.lineTo(x + o.w, b); g.closePath(); g.fill();
    }
    return {
      pausar: function () { hold = false; },
      dbg: function () { return { st: st, dist: dist, y: y, hp: hp, obs: obs, kx: kx, gy: gy(), speed: speed() }; },
      down: function () { press(); },
      up: function () { hold = false; },
      key: function (c, d) { if (c === 'Space' || c === 'Enter' || c === 'ArrowUp' || c === 'KeyW') { if (d) press(); else hold = false; } },
      update: function (dt) {
        kx = api.w * 0.24;
        if (st !== 'play') return;
        var v = speed(); dist += v * dt;
        if (inv > 0) inv -= dt;
        vy -= (vy > 0 && hold ? 1050 : 1900) * dt; y += vy * dt; if (y < 0) { y = 0; vy = 0; }
        if (dist >= META) { st = 'win'; return; }
        next -= v * dt;
        if (next <= 0 && dist < META - 600) {
          var big = Math.random() < 0.35 + dist / META * 0.25, h = big ? 78 + Math.random() * 20 : 34 + Math.random() * 18, w = big ? 44 : 36 + Math.random() * 24;
          obs.push({ x: api.w + 40, w: w, h: h });
          next = v * 1.2 + 120 + Math.random() * 200;
        }
        for (var i = obs.length - 1; i >= 0; i--) {
          var o = obs[i]; o.x -= v * dt;
          if (o.x + o.w < -20) { obs.splice(i, 1); continue; }
          if (inv <= 0 && kx + 11 > o.x + 6 && kx - 11 < o.x + o.w - 6 && y < o.h - 8) { hp--; inv = 1.2; if (hp <= 0) st = 'lose'; }
        }
      },
      draw: function () {
        var W = api.w, H = api.h, i, b = gy();
        var s = g.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#1a0d0a'); s.addColorStop(0.7, '#5a1e10'); s.addColorStop(1, '#8a3216'); g.fillStyle = s; g.fillRect(0, 0, W, H);
        g.fillStyle = '#2e1a12'; for (i = 0; i < 6; i++) g.fillRect(((i * 190 - dist * 0.4) % (W + 190) + W + 190) % (W + 190) - 60, 0, 26, b);
        g.fillStyle = '#3a2216'; g.fillRect(0, 0, W, 22);
        g.fillStyle = 'rgba(255,120,40,.18)'; for (i = 0; i < 9; i++) g.fillRect(((i * 120 - dist * 0.7) % (W + 120) + W + 120) % (W + 120) - 40, 24, 50, 18 + (i % 3) * 14);
        g.fillStyle = '#4b2e1c'; g.fillRect(0, b, W, H - b); g.fillStyle = '#6a4228'; for (i = 0; i < 14; i++) g.fillRect(((i * 80 - dist) % (W + 80) + W + 80) % (W + 80) - 20, b, 4, H - b);
        obs.forEach(flame);
        var ky = b - y;
        if (!(inv > 0 && Math.floor(api.clock * 14) % 2)) {
          g.fillStyle = '#d8b48a'; g.beginPath(); g.arc(kx, ky - 40, 9, 0, 6.29); g.fill();
          g.fillStyle = hp < 3 ? '#ff7a2a' : '#7a4a22'; g.beginPath(); g.moveTo(kx - 8, ky - 48); g.lineTo(kx, ky - 60 - (hp < 3 ? Math.sin(api.clock * 20) * 4 : 0)); g.lineTo(kx + 8, ky - 48); g.fill();
          g.fillStyle = '#3d5a8a'; g.fillRect(kx - 9, ky - 32, 18, 22);
          var l = Math.sin(api.clock * 16) * 7 * (y <= 0.5 ? 1 : 0.2);
          g.fillStyle = '#3a2a1a'; g.fillRect(kx - 8 + l, ky - 10, 6, 10); g.fillRect(kx + 2 - l, ky - 10, 6, 10);
        }
        if (st !== 'menu') {
          txt(T.folego, 24, 52, 15, '#f3ecd2', 'left');
          for (i = 0; i < 3; i++) { g.fillStyle = i < hp ? '#e6554a' : 'rgba(255,255,255,.2)'; g.beginPath(); g.arc(88 + i * 22, 47, 8, 0, 6.29); g.fill(); }
          var pw = Math.min(220, W - 48); g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(24, 66, pw, 7); g.fillStyle = '#ffd88a'; g.fillRect(24, 66, pw * Math.min(1, dist / META), 7);
          txt(T.telhado, 24 + pw + 8, 74, 12, '#ffe9c0', 'left');
        }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
