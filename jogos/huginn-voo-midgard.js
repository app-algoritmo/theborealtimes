/* Grímnismál — guie Huginn numa volta sobre Midgard. */
BTJogo.registrar({
  canvas: 'jogo-midgard',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A volta sobre Midgard",
    "sub": "Toque na tela (ou aperte espaço) para o corvo bater as asas; sem toque, ele cai. Passe pelas aberturas entre as pedras e as árvores. Cumpra 14 aberturas, sem bater, para completar a volta sobre Midgard.",
    "perdeu": "O corvo bateu",
    "v1": "A volta sobre Midgard está completa!",
    "v2": "No Grímnismál, Huginn e Muninn voam todos os dias sobre Midgard. O voo entre obstáculos é invenção.",
    "h1": "Aberturas",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "A round over Midgard",
    "sub": "Tap the screen (or press space) to make the raven flap; without a tap it falls. Pass through the gaps between the stones and the trees. Clear 14 gaps without crashing to complete the round over Midgard.",
    "perdeu": "The raven crashed",
    "v1": "The round over Midgard is complete!",
    "v2": "In the Grímnismál, Huginn and Muninn fly every day over Midgard. The flight between obstacles is made up.",
    "h1": "Gaps",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "En runde over Midgard",
    "sub": "Trykk på skjermen (eller trykk mellomrom) for at ravnen slår med vingene; uten trykk faller den. Fly gjennom åpningene mellom steinene og trærne. Klar 14 åpninger uten å krasje for å fullføre runden over Midgard.",
    "perdeu": "Ravnen krasjet",
    "v1": "Runden over Midgard er fullført!",
    "v2": "I Grímnismál flyr Huginn og Muninn hver dag over Midgard. Flukten mellom hindre er diktet opp.",
    "h1": "Åpninger",
    "h2": "Tid"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "La vuelta sobre Midgard",
    "sub": "Toca la pantalla (o pulsa espacio) para que el cuervo bata las alas; si no tocas, cae. Pasa por las aberturas entre las piedras y los árboles. Cumple 14 aberturas, sin chocar, para completar la vuelta sobre Midgard.",
    "perdeu": "El cuervo chocó",
    "v1": "¡La vuelta sobre Midgard está completa!",
    "v2": "En el Grímnismál, Huginn y Muninn vuelan todos los días sobre Midgard. El vuelo entre obstáculos es un invento.",
    "h1": "Aberturas",
    "h2": "Tiempo"
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
    function rr(x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
    function bar(x, y, w, h, f, c) { g.fillStyle = 'rgba(0,0,0,.28)'; g.fillRect(x, y, w, h); g.fillStyle = c; g.fillRect(x, y, w * Math.max(0, Math.min(1, f)), h); }
    var GOAL = 14, LIM = 120;
    var y = 0, vy = 0, pipes = [], t = 0, passed = 0, spawnX = 0, flap_ = 0, cur = 0;
    function lay() { var W = api.w, H = api.h, s = Math.max(0.8, Math.min(1.3, Math.min(W, H) / 450)); return { W: W, H: H, s: s, rx: Math.max(70, W * 0.22), gap: 150 * s, pw: 58 * s, spd: 150 * s, top: 70 }; }
    function setup() { var L = lay(); y = L.H / 2; vy = 0; pipes = []; t = 0; passed = 0; spawnX = L.W + 40; for (var i = 0; i < 3; i++) addPipe(L.W + 80 + i * 230 * L.s); }
    function addPipe(x) { var L = lay(), lo = L.top + L.gap / 2 + 20, hi = L.H - L.gap / 2 - 20, prev = pipes.length ? pipes[pipes.length - 1].gy : (lo + hi) / 2, gy = Math.max(lo, Math.min(hi, prev + (Math.random() - 0.5) * 2 * 130 * L.s)); pipes.push({ x: x, gy: gy, done: false }); }
    function reset() { setup(); st = 'play'; }
    function flap() { if (st !== 'play') return; vy = -300 * lay().s; if (api.nota) api.nota(520, 0.04, 'triangle', 0.03); }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, y: y, vy: vy, pipes: pipes.map(function (p) { return { x: p.x, gy: p.gy, done: p.done }; }), rx: L.rx, gap: L.gap, passed: passed, goal: GOAL, t: t, tmr: LIM - t, H: L.H }; },
      down: function (x, yy) { if (menu()) return; flap(); },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'Space' || k === 'ArrowUp' || k === 'Enter') flap(); },
      update: function (dt) {
        if (st !== 'play') return; var L = lay(); t += dt; if (t >= LIM) { st = 'lose'; return; }
        vy += 900 * L.s * dt; y += vy * dt; if (y < 14 || y > L.H - 14) { st = 'lose'; if (api.nota) api.nota(110, 0.3, 'sawtooth', 0.07); return; }
        var sp = L.spd * (1 + Math.min(1, passed / GOAL) * 0.35); for (var i = 0; i < pipes.length; i++) { var p = pipes[i]; p.x -= sp * dt;
          if (Math.abs(p.x - L.rx) < L.pw / 2 + 10 * L.s && Math.abs(y - p.gy) > L.gap / 2 - 12 * L.s) { st = 'lose'; if (api.nota) api.nota(110, 0.3, 'sawtooth', 0.07); return; }
          if (!p.done && p.x < L.rx - L.pw / 2 - 10 * L.s) { p.done = true; passed++; if (api.nota) api.nota(600, 0.05, 'triangle', 0.04); if (passed >= GOAL) { st = 'win'; return; } } }
        if (pipes[0].x < -L.pw) pipes.shift(); var last = pipes[pipes.length - 1]; if (last.x < L.W - 230 * L.s) addPipe(last.x + 230 * L.s);
      },
      draw: function () {
        var L = lay(), W = L.W, H = L.H, s = L.s, i;
        bg('#2a3a5a', '#0a1020');
        for (i = 0; i < pipes.length; i++) { var p = pipes[i], x = p.x - L.pw / 2; g.fillStyle = '#4a5a4a'; g.fillRect(x, 0, L.pw, p.gy - L.gap / 2); g.fillRect(x, p.gy + L.gap / 2, L.pw, H); g.fillStyle = '#6a7a6a'; g.fillRect(x - 4, p.gy - L.gap / 2 - 12, L.pw + 8, 12); g.fillRect(x - 4, p.gy + L.gap / 2, L.pw + 8, 12); }
        g.save(); g.translate(L.rx, y); g.rotate(Math.max(-0.5, Math.min(0.8, vy / 600)));
        g.fillStyle = '#0a0a12'; g.beginPath(); g.ellipse(0, 0, 18 * s, 11 * s, 0, 0, 6.283); g.fill();
        var w = Math.sin(t * 18) * 8 * s; g.beginPath(); g.moveTo(-4 * s, 0); g.lineTo(-14 * s, -14 * s - w); g.lineTo(6 * s, -4 * s); g.closePath(); g.fill();
        g.fillStyle = '#e8c070'; g.beginPath(); g.moveTo(16 * s, -2 * s); g.lineTo(26 * s, 1 * s); g.lineTo(16 * s, 4 * s); g.closePath(); g.fill();
        g.fillStyle = '#fff'; g.beginPath(); g.arc(10 * s, -3 * s, 2 * s, 0, 6.283); g.fill();
        g.restore();
        hud(T.h1 + ' ' + passed + '/' + GOAL, T.h2 + ' ' + Math.ceil(LIM - t), false);
        fim(st);
      }
    };
  }
});
