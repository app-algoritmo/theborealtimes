/* Salte o muro de fogo — o cavalo de Skírnir atravessa as chamas. */
BTJogo.registrar({
  canvas: 'jogo-freyr',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Salte o muro de fogo",
    "sub": "Skírnir cavalga para a casa dos gigantes e as chamas cercam o caminho. Toque (ou use a barra de espaço) para saltar sobre cada fogueira. Chegue ao fim sem se queimar.",
    "perdeu": "As chamas alcançaram o cavalo",
    "v1": "Você atravessou as chamas!",
    "v2": "No Skírnismál, Skírnir cruza um muro de fogo a cavalo para pedir a mão de Gerðr. Os obstáculos do jogo são invenção.",
    "h1": "Distância"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Leap the wall of fire",
    "sub": "Skírnir rides to the giants' hall and flames ring the road. Tap (or press Space) to jump each fire. Reach the end without being burned.",
    "perdeu": "The flames reached the horse",
    "v1": "You crossed the flames!",
    "v2": "In the Skírnismál, Skírnir rides through a wall of fire to ask for Gerðr's hand. The obstacles in the game are made up.",
    "h1": "Distance"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Hopp over ildmuren",
    "sub": "Skirne rir mot jotnenes hall og flammer omkranser veien. Trykk (eller bruk mellomromstasten) for å hoppe over hvert bål. Kom frem uten å bli brent.",
    "perdeu": "Flammene nådde hesten",
    "v1": "Du kom deg gjennom flammene!",
    "v2": "I Skírnismál rir Skirne gjennom en ildmur for å fri til Gerd. Hindrene i spillet er diktet opp.",
    "h1": "Avstand"
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
    var GOAL = 6500, PX = 110;
    var y = 0, vy = 0, obs = [], dist = 0, gapx = 0;
    function reset() { st = 'play'; y = 0; vy = 0; obs = []; dist = 0; gapx = 320; }
    function sp() { return 260 + dist / GOAL * 90; }
    function gy() { return api.h - 70; }
    function jump() { if (y <= 0.5) vy = 620; }
    return {
      pausar: function () {},
      dbg: function () { return { st: st, y: y, dist: dist, goal: GOAL, px: PX, sp: sp(), obs: obs.map(function (o) { return { x: o.x, w: o.w, h: o.h }; }) }; },
      down: function () { if (menu()) return; jump(); },
      key: function (c, d) { if (!d) return; if (st !== 'play') { if (c === 'Space' || c === 'Enter') menu(); return; } if (c === 'Space' || c === 'ArrowUp' || c === 'KeyW') jump(); },
      update: function (dt) {
        if (st !== 'play') return;
        vy -= 1500 * dt; y += vy * dt; if (y < 0) { y = 0; vy = 0; }
        var s = sp() * dt; dist += s; gapx -= s;
        obs.forEach(function (o) { o.x -= s; });
        while (obs.length && obs[0].x < -60) obs.shift();
        if (gapx <= 0 && dist < GOAL - 400) { obs.push({ x: api.w + 40, w: 34, h: 40 + Math.random() * 32 }); gapx = 300 + Math.random() * 140; }
        for (var i = 0; i < obs.length; i++) { var o = obs[i]; if (PX + 13 > o.x - o.w / 2 + 4 && PX - 13 < o.x + o.w / 2 - 4 && y < o.h - 6) { st = 'lose'; return; } }
        if (dist >= GOAL) st = 'win';
      },
      draw: function () {
        var W = api.w, H = api.h, G = gy();
        bg('#2b1b3a', '#6b3a2e');
        g.fillStyle = '#2a1c16'; g.fillRect(0, G, W, H - G);
        g.fillStyle = '#4a2f22'; for (var i = 0; i < W; i += 40) g.fillRect(i - (dist * 1) % 40, G, 20, 4);
        obs.forEach(function (o) { var t = api.clock * 9; g.fillStyle = '#e0562a'; g.beginPath(); g.moveTo(o.x - o.w / 2, G); g.lineTo(o.x - o.w / 4 + Math.sin(t + o.x) * 3, G - o.h * 0.7); g.lineTo(o.x, G - o.h); g.lineTo(o.x + o.w / 4, G - o.h * 0.65); g.lineTo(o.x + o.w / 2, G); g.fill(); g.fillStyle = '#ffd36a'; g.beginPath(); g.moveTo(o.x - o.w / 4, G); g.lineTo(o.x, G - o.h * 0.6); g.lineTo(o.x + o.w / 4, G); g.fill(); });
        var py = G - y; g.fillStyle = '#f3ecd2'; g.fillRect(PX - 22, py - 30, 44, 20); g.fillRect(PX + 14, py - 44, 14, 20); g.fillRect(PX - 18, py - 12, 6, 12); g.fillRect(PX + 10, py - 12, 6, 12); g.fillStyle = '#58b86a'; g.fillRect(PX - 8, py - 46, 14, 16);
        g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(0, H - 8, W, 8); g.fillStyle = '#ffd88a'; g.fillRect(0, H - 8, W * Math.min(1, dist / GOAL), 8);
        hud(T.h1 + ' ' + Math.round(Math.min(1, dist / GOAL) * 100) + '%');
        fim(st);
      }
    };
  }
});
