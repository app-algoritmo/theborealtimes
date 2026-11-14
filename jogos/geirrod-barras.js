/* As luvas de ferro — agarre as barras em brasa antes que caiam no chão. */
BTJogo.registrar({
  canvas: 'jogo-geirrod',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As barras de Geirrøðr",
    "sub": "O gigante atira barras de ferro em brasa. Arraste o dedo (ou use as setas) para mover Thor e agarrar cada barra com as luvas de ferro. Pegue 15 barras. Na terceira que cair, o jogo acaba.",
    "perdeu": "A barra passou pelas suas mãos",
    "v1": "As luvas seguraram o ferro!",
    "v2": "Segundo Snorri, Thor usou luvas de ferro para agarrar a barra em brasa. A chuva de barras é invenção do jogo.",
    "h1": "Barras",
    "h2": "Falhas"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Geirrøðr's bars",
    "sub": "The giant hurls glowing iron bars. Drag a finger (or use the arrows) to move Thor and catch each bar with the iron gloves. Catch 15 bars. The third one that falls ends the game.",
    "perdeu": "The bar slipped past your hands",
    "v1": "The gloves held the iron!",
    "v2": "According to Snorri, Thor used iron gloves to catch the glowing bar. The rain of bars is made up for the game.",
    "h1": "Bars",
    "h2": "Misses"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Geirrøds stenger",
    "sub": "Jotunen kaster glødende jernstenger. Dra en finger (eller bruk piltastene) for å flytte Tor og gripe hver stang med jernhanskene. Grip 15 stenger. Den tredje som faller, avslutter spillet.",
    "perdeu": "Stanga gikk forbi hendene dine",
    "v1": "Hanskene holdt jernet!",
    "v2": "Ifølge Snorre brukte Tor jernhansker for å gripe den glødende stanga. Regnet av stenger er diktet opp for spillet.",
    "h1": "Stenger",
    "h2": "Feil"
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
    var NEED = 15, MAXM = 3, SP = 700;
    var x = 400, tx = 400, bars = [], caught = 0, misses = 0, spawn = 0, held = {}, drag = false, flash = 0, pop = 0, sprk = [], n = 0;
    function setup() { x = tx = api.w / 2; bars = []; caught = 0; misses = 0; spawn = 0.6; held = {}; drag = false; flash = 0; sprk = []; n = 0; }
    function reset() { setup(); st = 'play'; }
    function gy() { return api.h - 70; }
    setup();
    return {
      pausar: function () { held = {}; drag = false; },
      dbg: function () { return { st: st, x: x, tx: tx, bars: bars.map(function (b) { return { x: b.x, y: b.y }; }), caught: caught, misses: misses, y: gy(), H: api.h, W: api.w }; },
      down: function (x2, y2) { if (menu()) return; drag = true; tx = x2; },
      move: function (x2, y2, pr) { if (drag && pr !== false) tx = x2; },
      up: function () { drag = false; },
      key: function (c, d) { held[c] = d; if (d && st !== 'play') menu(); },
      update: function (dt) {
        pop += dt; if (flash > 0) flash -= dt;
        sprk = sprk.filter(function (s) { s.t -= dt; s.x += s.vx * dt; s.y += s.vy * dt; return s.t > 0; });
        if (st !== 'play') return;
        var dir = (held.ArrowRight || held.KeyD ? 1 : 0) - (held.ArrowLeft || held.KeyA ? 1 : 0);
        if (dir) tx = Math.max(30, Math.min(api.w - 30, x + dir * 260));
        var mvx = SP * dt, dx = tx - x; x += Math.abs(dx) < mvx ? dx : (dx > 0 ? mvx : -mvx); x = Math.max(30, Math.min(api.w - 30, x));
        spawn -= dt; var k = Math.min(1, caught / NEED);
        if (spawn <= 0) { spawn = 1.0 - 0.45 * k + Math.random() * 0.25; bars.push({ x: 40 + Math.random() * (api.w - 80), y: -20, v: 190 + 130 * k + Math.random() * 40, r: Math.random() * 6 }); }
        for (var i = bars.length - 1; i >= 0; i--) {
          var b = bars[i]; b.y += b.v * dt; b.r += dt * 4;
          if (b.y >= gy() - 8 && b.y <= gy() + 18 && Math.abs(b.x - x) < 50) { bars.splice(i, 1); caught++; flash = 0.15; if (api.nota) api.nota(300 + caught * 18, 0.1, 'square', 0.05); for (var j = 0; j < 8; j++) sprk.push({ x: b.x, y: b.y, vx: (Math.random() - 0.5) * 220, vy: -Math.random() * 180, t: 0.4 }); if (caught >= NEED) { st = 'win'; } }
          else if (b.y > api.h + 10) { bars.splice(i, 1); misses++; if (misses >= MAXM) st = 'lose'; }
        }
      },
      draw: function () {
        var W = api.w, H = api.h, Y = gy();
        bg('#2a1612', '#0f0907');
        g.fillStyle = 'rgba(255,120,60,.08)'; for (var q = 0; q < 6; q++) g.fillRect(q * W / 6 + 10, 0, 2, H);
        g.fillStyle = '#3a2a22'; g.fillRect(0, H - 40, W, 40); g.fillStyle = '#5a3f30'; g.fillRect(0, H - 40, W, 4);
        bars.forEach(function (b) { g.save(); g.translate(b.x, b.y); g.rotate(Math.sin(b.r) * 0.25); var gr = g.createRadialGradient(0, 0, 4, 0, 0, 36); gr.addColorStop(0, 'rgba(255,150,60,.6)'); gr.addColorStop(1, 'rgba(255,150,60,0)'); g.fillStyle = gr; g.fillRect(-40, -40, 80, 80); g.fillStyle = '#ff7a3a'; g.fillRect(-5, -26, 10, 52); g.fillStyle = '#ffd88a'; g.fillRect(-2, -24, 4, 48); g.restore(); });
        sprk.forEach(function (s) { g.fillStyle = 'rgba(255,200,110,' + s.t * 2 + ')'; g.fillRect(s.x, s.y, 3, 3); });
        g.fillStyle = flash > 0 ? '#ffd88a' : '#6b7a8f'; rr(x - 42, Y - 4, 84, 16, 6); g.fill();
        g.fillStyle = '#c9a07a'; g.beginPath(); g.arc(x, Y + 22, 15, 0, 6.283); g.fill(); g.fillStyle = '#b5472a'; g.fillRect(x - 17, Y + 34, 34, 8); g.fillStyle = '#e8d9a8'; g.fillRect(x - 11, Y + 16, 22, 5);
        hud(T.h1 + ' ' + caught + '/' + NEED, T.h2 + ' ' + misses + '/' + MAXM, misses > 0);
        fim(st);
      }
    };
  }
});
