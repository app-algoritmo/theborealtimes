/* Sweyn — conduza a frota rio acima entre os bancos de areia. */
BTJogo.registrar({
  canvas: 'jogo-sweyn',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A frota de Sweyn",
    "sub": "Toque (ou use o espaço) para o navio subir; ao soltar, ele desce sozinho. Passe pelo vão entre os bancos de areia, sem tocar neles nem no fundo do rio. Complete 12 passagens para chegar a Gainsborough.",
    "perdeu": "O navio encalhou",
    "v1": "A frota chegou a Gainsborough!",
    "v2": "Segundo a Crônica Anglo-Saxônica, Sweyn subiu o Humber e o Trent até Gainsborough em 1013. As passagens do jogo são invenção.",
    "h1": "Passagens",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Sweyn's fleet",
    "sub": "Tap (or press Space) to make the ship rise; when you let go, it sinks by itself. Pass through the gap between the sandbanks, without touching them or the river bed. Complete 12 passages to reach Gainsborough.",
    "perdeu": "The ship ran aground",
    "v1": "The fleet reached Gainsborough!",
    "v2": "According to the Anglo-Saxon Chronicle, Sweyn went up the Humber and the Trent to Gainsborough in 1013. The passages in the game are made up.",
    "h1": "Passages",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Svends flåte",
    "sub": "Trykk (eller mellomrom) for å få skipet til å stige; når du slipper, synker det av seg selv. Kom gjennom åpningen mellom sandbankene uten å berøre dem eller elvebunnen. Fullfør 12 passeringer for å nå Gainsborough.",
    "perdeu": "Skipet gikk på grunn",
    "v1": "Flåten nådde Gainsborough!",
    "v2": "Ifølge Den angelsaksiske krøniken seilte Svend opp Humber og Trent til Gainsborough i 1013. Passeringene i spillet er diktet opp.",
    "h1": "Passeringer",
    "h2": "Tid"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "La flota de Sweyn",
    "sub": "Toca (o usa la barra espaciadora) para que el barco suba; al soltar, baja solo. Pasa por el hueco entre los bancos de arena, sin tocarlos ni rozar el fondo del río. Completa 12 pasos para llegar a Gainsborough.",
    "perdeu": "El barco encalló",
    "v1": "¡La flota llegó a Gainsborough!",
    "v2": "Según la Crónica anglosajona, Sweyn remontó el Humber y el Trent hasta Gainsborough en 1013. Los pasos del juego son invención.",
    "h1": "Pasos",
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
    var GOAL = 12;
    var y = 0, vy = 0, pipes = [], dist = 0, passed = 0, t = 0, pop = 0, sc = 1, nextX = 0;
    function lay() { var W = api.w, H = api.h, s = Math.max(0.8, Math.min(1.8, H / 450)); return { W: W, H: H, s: s, sx: W * 0.24, top: 62 * s * 0.6, floor: H - 22 }; }
    function addPipe(x) { var L = lay(), gap = 150 * L.s, minC = L.top + gap / 2 + 30, maxC = L.floor - gap / 2 - 30; pipes.push({ x: x, c: minC + Math.random() * (maxC - minC), gap: gap, done: false }); }
    function setup() { var L = lay(); y = L.H / 2; vy = 0; pipes = []; passed = 0; t = 0; dist = 0; nextX = L.W + 120 * L.s; for (var i = 0; i < 4; i++) { addPipe(nextX); nextX += 240 * L.s; } }
    function reset() { setup(); st = 'play'; }
    function flap() { if (st !== 'play') return; var L = lay(); vy = -340 * L.s; if (api.nota) api.nota(520, 0.04, 'triangle', 0.03); }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(), nx = null; for (var i = 0; i < pipes.length; i++) if (!pipes[i].done) { nx = pipes[i]; break; } return { st: st, y: y, vy: vy, s: L.s, sx: L.sx, pipe: nx ? { x: nx.x, c: nx.c, gap: nx.gap } : null, passed: passed, floor: L.floor }; },
      down: function (x, yy) { if (menu()) return; flap(); },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'Space' || k === 'ArrowUp' || k === 'KeyW' || k === 'Enter') flap(); },
      update: function (dt) {
        pop += dt; if (st !== 'play') return; var L = lay(); t += dt; vy += 1150 * L.s * dt; y += vy * dt; if (y < L.top + 10) { y = L.top + 10; if (vy < 0) vy = 0; }
        var spd = 165 * L.s; pipes.forEach(function (p) { p.x -= spd * dt; }); dist += spd * dt;
        if (pipes.length && pipes[0].x < -80 * L.s) pipes.shift(); var last = pipes[pipes.length - 1]; if (last && last.x < L.W) { addPipe(last.x + 240 * L.s); }
        var r = 13 * L.s; if (y + r > L.floor) { st = 'lose'; if (api.nota) api.nota(120, 0.25, 'sawtooth', 0.07); return; }
        for (var i = 0; i < pipes.length; i++) { var p = pipes[i], pw = 46 * L.s; if (L.sx + r > p.x - pw / 2 && L.sx - r < p.x + pw / 2) { if (y - r < p.c - p.gap / 2 || y + r > p.c + p.gap / 2) { st = 'lose'; if (api.nota) api.nota(120, 0.25, 'sawtooth', 0.07); return; } }
          if (!p.done && p.x + pw / 2 < L.sx - r) { p.done = true; passed++; if (api.nota) api.nota(600 + passed * 25, 0.08, 'triangle', 0.05); if (passed >= GOAL) { st = 'win'; return; } } }
      },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), i;
        bg('#16384a', '#06141c');
        g.fillStyle = '#6a5a3a'; g.fillRect(0, L.floor, W, H - L.floor);
        for (i = 0; i < 7; i++) { g.strokeStyle = 'rgba(255,255,255,.06)'; g.lineWidth = 2; g.beginPath(); for (var x = 0; x <= W; x += 16) { var yy = 120 * L.s + i * 52 * L.s + Math.sin(x * 0.03 + pop * 2 + i) * 4; if (x) g.lineTo(x, yy); else g.moveTo(x, yy); } g.stroke(); }
        pipes.forEach(function (p) { var pw = 46 * L.s; g.fillStyle = '#c0a060'; g.fillRect(p.x - pw / 2, L.top, pw, p.c - p.gap / 2 - L.top); g.fillRect(p.x - pw / 2, p.c + p.gap / 2, pw, L.floor - (p.c + p.gap / 2)); g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(p.x - pw / 2 - 4, p.c - p.gap / 2 - 10, pw + 8, 10); g.fillRect(p.x - pw / 2 - 4, p.c + p.gap / 2, pw + 8, 10); });
        g.save(); g.translate(L.sx, y); g.rotate(Math.max(-0.5, Math.min(0.6, vy / (700 * L.s)))); g.fillStyle = '#8a4a2a'; g.beginPath(); g.moveTo(-18 * L.s, -4 * L.s); g.lineTo(20 * L.s, -10 * L.s); g.lineTo(14 * L.s, 8 * L.s); g.lineTo(-14 * L.s, 8 * L.s); g.closePath(); g.fill(); g.fillStyle = '#e8e0c8'; g.fillRect(-2 * L.s, -26 * L.s, 3 * L.s, 22 * L.s); g.fillStyle = '#c0392b'; g.fillRect(2 * L.s, -26 * L.s, 14 * L.s, 14 * L.s); g.restore();
        hud(T.h1 + ' ' + passed + '/' + GOAL, T.h2 + ' ' + Math.floor(t), false);
        fim(st);
      }
    };
  }
});
