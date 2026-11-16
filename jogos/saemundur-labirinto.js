/* Sæmundur — escape da Escola Negra antes que o diabo alcance sua sombra. */
BTJogo.registrar({
  canvas: 'jogo-saemundur',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A Escola Negra",
    "sub": "Use as setas (ou segure o dedo no lado para onde quer ir) para andar pelo labirinto até a saída, embaixo à direita. Depois de alguns segundos, o diabo começa a perseguir sua sombra e anda mais rápido que você. Não deixe que ele a alcance.",
    "perdeu": "A sombra foi alcançada",
    "v1": "Você saiu da Escola Negra!",
    "v2": "No folclore islandês, Sæmundur foge da Escola Negra sem deixar o diabo prender sua sombra. O labirinto é invenção do jogo.",
    "h1": "Distância",
    "h2": "Sombra"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The Black School",
    "sub": "Use the arrow keys (or hold your finger on the side you want to go) to walk through the maze to the exit, bottom right. After a few seconds the devil starts chasing your shadow and moves faster than you. Do not let him catch it.",
    "perdeu": "The shadow was caught",
    "v1": "You left the Black School!",
    "v2": "In Icelandic folklore, Sæmundur flees the Black School without letting the devil seize his shadow. The maze is made up for the game.",
    "h1": "Distance",
    "h2": "Shadow"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Svarteskolen",
    "sub": "Bruk piltastene (eller hold fingeren på siden du vil gå mot) for å gå gjennom labyrinten til utgangen nede til høyre. Etter noen sekunder begynner djevelen å jage skyggen din, og han går raskere enn deg. Ikke la ham ta den igjen.",
    "perdeu": "Skyggen ble tatt igjen",
    "v1": "Du kom ut av Svarteskolen!",
    "v2": "I islandsk folketro flykter Sæmundur fra Svarteskolen uten at djevelen får tak i skyggen hans. Labyrinten er diktet opp for spillet.",
    "h1": "Avstand",
    "h2": "Skygge"
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
    var CW = 7, CH = 5, W_ = CW * 2 + 1, H_ = CH * 2 + 1, DELAY = 3.5, SPD = 0.23, PINT = 0.12;
    var wall = [], pl, sh, ex, t = 0, tp = 0, tc = 0, held = null, keys = {}, shPath = [], cur = null;
    function lay() { var W = api.w, H = api.h, cs = Math.max(20, Math.min((W - 16) / W_, (H - 170) / H_, 44)); return { cs: cs, x: (W - cs * W_) / 2, y: Math.max(88, (H - cs * H_) / 2 + 6) }; }
    function gen() { wall = []; for (var y = 0; y < H_; y++) { wall.push([]); for (var x = 0; x < W_; x++) wall[y].push(true); } var seen = {}, stack = [[1, 1]]; wall[1][1] = false; seen['1,1'] = 1;
      while (stack.length) { var c = stack[stack.length - 1], nb = []; [[2, 0], [-2, 0], [0, 2], [0, -2]].forEach(function (d) { var nx = c[0] + d[0], ny = c[1] + d[1]; if (nx > 0 && ny > 0 && nx < W_ - 1 && ny < H_ - 1 && wall[ny][nx]) nb.push(d); }); if (!nb.length) { stack.pop(); continue; } var d = nb[Math.floor(Math.random() * nb.length)]; wall[c[1] + d[1] / 2][c[0] + d[0] / 2] = false; wall[c[1] + d[1]][c[0] + d[0]] = false; stack.push([c[0] + d[0], c[1] + d[1]]); }
      for (var k = 0; k < 6; k++) { var rx = 2 + Math.floor(Math.random() * (W_ - 4)), ry = 2 + Math.floor(Math.random() * (H_ - 4)); if (wall[ry][rx] && ((!wall[ry][rx - 1] && !wall[ry][rx + 1]) || (!wall[ry - 1][rx] && !wall[ry + 1][rx]))) wall[ry][rx] = false; } }
    function bfs(a, b) { var q = [a], prev = {}, key = function (p) { return p.x + ',' + p.y; }; prev[key(a)] = null; var h = 0; while (h < q.length) { var c = q[h++]; if (c.x === b.x && c.y === b.y) break; [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) { var n = { x: c.x + d[0], y: c.y + d[1] }; if (n.x < 0 || n.y < 0 || n.x >= W_ || n.y >= H_ || wall[n.y][n.x] || prev[key(n)] !== undefined) return; prev[key(n)] = c; q.push(n); }); } var p = [], c2 = b; while (c2) { p.unshift(c2); c2 = prev[key(c2)]; } return p; }
    function setup() { gen(); pl = { x: 1, y: 1 }; ex = { x: W_ - 2, y: H_ - 2 }; sh = { x: 1, y: 1 }; t = 0; tp = PINT; tc = 0; held = null; keys = {}; cur = null; }
    function reset() { setup(); st = 'play'; }
    function tryMove(dx, dy) { var nx = pl.x + dx, ny = pl.y + dy; if (nx < 0 || ny < 0 || nx >= W_ || ny >= H_ || wall[ny][nx]) return false; pl = { x: nx, y: ny }; if (pl.x === ex.x && pl.y === ex.y) { st = 'win'; if (api.nota) api.nota(700, 0.2, 'triangle', 0.06); } else if (pl.x === sh.x && pl.y === sh.y && t > DELAY) st = 'lose'; return true; }
    function dirNow() { if (keys.l) return [-1, 0]; if (keys.r) return [1, 0]; if (keys.u) return [0, -1]; if (keys.d) return [0, 1]; if (held) { var L = lay(), px = L.x + (pl.x + 0.5) * L.cs, py = L.y + (pl.y + 0.5) * L.cs, dx = held.x - px, dy = held.y - py; if (Math.abs(dx) > Math.abs(dy)) return [dx > 0 ? 1 : -1, 0]; return [0, dy > 0 ? 1 : -1]; } return null; }
    function nudge() { var d = dirNow(); if (d && tp >= PINT) { tp = 0; tryMove(d[0], d[1]); } }
    setup();
    return {
      pausar: function () { keys = {}; held = null; },
      dbg: function () { var L = lay(); return { st: st, pl: { x: pl.x, y: pl.y }, sh: { x: sh.x, y: sh.y }, ex: { x: ex.x, y: ex.y }, wall: wall.map(function (r) { return r.slice(); }), w: W_, h: H_, t: t, delay: DELAY, dist: bfs(pl, ex).length - 1, gap: sh.x === pl.x && sh.y === pl.y ? 0 : bfs(sh, pl).length - 1 }; },
      down: function (x, y) { if (menu()) return; held = { x: x, y: y }; nudge(); },
      move: function (x, y, pr) { if (pr && held) held = { x: x, y: y }; },
      up: function () { held = null; },
      key: function (k, d) { var m = { ArrowLeft: 'l', KeyA: 'l', ArrowRight: 'r', KeyD: 'r', ArrowUp: 'u', KeyW: 'u', ArrowDown: 'd', KeyS: 'd' }[k]; if (m) { if (d) { keys = {}; keys[m] = 1; if (st === 'play') nudge(); } else keys[m] = 0; } else if (d && st !== 'play') menu(); },
      update: function (dt) {
        if (st !== 'play') return; t += dt; tp += dt;
        nudge(); if (st !== 'play') return;
        if (t > DELAY) { tc += dt; if (tc >= SPD) { tc = 0; var p = bfs(sh, pl); if (p.length > 1) sh = { x: p[1].x, y: p[1].y }; if (sh.x === pl.x && sh.y === pl.y) { st = 'lose'; if (api.nota) api.nota(100, 0.3, 'sawtooth', 0.07); } } }
      },
      draw: function () {
        var L = lay(), W = api.w, H = api.h, x, y;
        bg('#1a1a2a', '#05050a');
        for (y = 0; y < H_; y++) for (x = 0; x < W_; x++) { var px = L.x + x * L.cs, py = L.y + y * L.cs; g.fillStyle = wall[y][x] ? '#3a3a50' : 'rgba(255,255,255,.04)'; g.fillRect(px, py, L.cs, L.cs); }
        g.fillStyle = '#ffd88a'; g.fillRect(L.x + ex.x * L.cs + L.cs * 0.2, L.y + ex.y * L.cs + L.cs * 0.2, L.cs * 0.6, L.cs * 0.6);
        if (t > DELAY - 1) { g.fillStyle = t > DELAY ? 'rgba(120,20,40,.85)' : 'rgba(120,20,40,.35)'; g.beginPath(); g.arc(L.x + (sh.x + 0.5) * L.cs, L.y + (sh.y + 0.5) * L.cs, L.cs * 0.38, 0, 6.283); g.fill(); }
        g.fillStyle = '#e8c9a0'; g.beginPath(); g.arc(L.x + (pl.x + 0.5) * L.cs, L.y + (pl.y + 0.5) * L.cs, L.cs * 0.3, 0, 6.283); g.fill();
        var dist = bfs(pl, ex).length - 1, gap = t > DELAY ? bfs(sh, pl).length - 1 : 99;
        hud(T.h1 + ' ' + dist, T.h2 + ' ' + (gap > 90 ? '–' : gap), gap <= 3);
        fim(st);
      }
    };
  }
});
