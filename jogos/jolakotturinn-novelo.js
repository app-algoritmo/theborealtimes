/* Novelos antes do gato — recolha a lã sem deixar o fio se enrolar. */
BTJogo.registrar({
  canvas: 'jogo-jola',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Novelos antes do gato",
    "sub": "O Gato de Natal ronda a casa. Guie o fio de lã e recolha 12 novelos antes que ele chegue. Deslize o dedo (ou use as setas) para mudar de direção. Se o fio bater na parede ou em si mesmo, ele se emaranha. No terceiro emaranhado, o jogo acaba.",
    "perdeu": "O gato chegou primeiro",
    "v1": "A roupa nova ficou pronta!",
    "v2": "Na tradição islandesa, quem ganhava uma peça de roupa nova antes do Natal escapava do Gato de Natal. O fio de lã do jogo é invenção.",
    "h1": "Novelos",
    "h2": "Emaranhados"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Wool before the cat",
    "sub": "The Yule Cat prowls around the house. Guide the thread of wool and collect 12 balls before he arrives. Swipe (or use the arrows) to change direction. If the thread hits a wall or itself, it tangles. The third tangle ends the game.",
    "perdeu": "The cat got there first",
    "v1": "The new clothes are ready!",
    "v2": "In Icelandic tradition, whoever got a new piece of clothing before Christmas escaped the Yule Cat. The thread of wool in the game is made up.",
    "h1": "Balls",
    "h2": "Tangles"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Ull før katten",
    "sub": "Julekatten går rundt huset. Led ulltråden og samle 12 nøster før han kommer. Sveip (eller bruk piltastene) for å skifte retning. Treffer tråden en vegg eller seg selv, floker den seg. Den tredje floken avslutter spillet.",
    "perdeu": "Katten kom først",
    "v1": "De nye klærne er ferdige!",
    "v2": "I islandsk tradisjon slapp den som fikk et nytt plagg før jul unna Julekatten. Ulltråden i spillet er diktet opp.",
    "h1": "Nøster",
    "h2": "Floker"
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
    var NEED = 12, MAXE = 3, LIM = 120;
    var cols = 16, rows = 10, sn = [], dir = [1, 0], q = [], food = null, got = 0, errs = 0, acc = 0, step = 0.14, tmr = LIM, sx = 0, sy = 0, dn = false, inv = 0, flash = 0, pop = 0;
    function lay() { var W = api.w, H = api.h, cs = Math.min((W - 20) / cols, (H - 96) / rows); return { cs: cs, x: (W - cs * cols) / 2, y: Math.max(68, (H - cs * rows) / 2 + 22) }; }
    function place() { var tries = 0, f; do { f = [Math.floor(Math.random() * cols), Math.floor(Math.random() * rows)]; tries++; } while (tries < 200 && sn.some(function (p) { return p[0] === f[0] && p[1] === f[1]; })); food = f; }
    function respawn() { var cx = Math.floor(cols / 2), cy = Math.floor(rows / 2); sn = [[cx, cy], [cx - 1, cy], [cx - 2, cy]]; dir = [1, 0]; q = []; inv = 1; }
    function setup() { cols = api.w >= api.h ? 16 : 10; rows = api.w >= api.h ? 10 : 16; respawn(); got = 0; errs = 0; acc = 0; tmr = LIM; place(); flash = 0; inv = 0; }
    function reset() { setup(); st = 'play'; }
    function turn(d) { var last = q.length ? q[q.length - 1] : dir; if (d[0] === -last[0] && d[1] === -last[1]) return; if (d[0] === last[0] && d[1] === last[1]) return; if (q.length < 2) q.push(d); }
    function tick() {
      if (q.length) dir = q.shift();
      var h = sn[0], nx = h[0] + dir[0], ny = h[1] + dir[1], hit = nx < 0 || ny < 0 || nx >= cols || ny >= rows;
      if (!hit) for (var i = 0; i < sn.length - 1; i++) if (sn[i][0] === nx && sn[i][1] === ny) hit = true;
      if (hit) { if (inv > 0) { return; } errs++; flash = 0.5; if (api.nota) api.nota(140, 0.2, 'sawtooth', 0.07); if (errs >= MAXE) { st = 'lose'; return; } respawn(); return; }
      sn.unshift([nx, ny]);
      if (food && nx === food[0] && ny === food[1]) { got++; if (api.nota) api.nota(500 + got * 20, 0.1, 'triangle', 0.06); if (got >= NEED) { st = 'win'; return; } place(); step = Math.max(0.085, 0.14 - got * 0.004); } else sn.pop();
    }
    setup();
    return {
      pausar: function () { dn = false; },
      dbg: function () { return { st: st, sn: sn.map(function (p) { return p.slice(); }), dir: dir.slice(), food: food.slice(), cols: cols, rows: rows, got: got, errs: errs, q: q.length }; },
      down: function (x, y) { if (menu()) return; dn = true; sx = x; sy = y; },
      up: function () { dn = false; },
      move: function (x, y, pr) { if (!dn || pr === false) return; var dx = x - sx, dy = y - sy; if (Math.abs(dx) > 22 || Math.abs(dy) > 22) { if (Math.abs(dx) > Math.abs(dy)) turn([dx > 0 ? 1 : -1, 0]); else turn([0, dy > 0 ? 1 : -1]); sx = x; sy = y; } },
      key: function (c, d) {
        if (!d) return; if (st !== 'play') { menu(); return; }
        if (c === 'ArrowLeft' || c === 'KeyA') turn([-1, 0]); else if (c === 'ArrowRight' || c === 'KeyD') turn([1, 0]); else if (c === 'ArrowUp' || c === 'KeyW') turn([0, -1]); else if (c === 'ArrowDown' || c === 'KeyS') turn([0, 1]);
      },
      update: function (dt) {
        pop += dt; if (flash > 0) flash -= dt; if (st !== 'play') return;
        if (inv > 0) inv -= dt;
        tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; return; }
        acc += dt; while (acc >= step && st === 'play') { acc -= step; tick(); }
      },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), i;
        bg('#2a2230', '#100c14');
        g.fillStyle = 'rgba(255,255,255,.05)'; rr(L.x - 4, L.y - 4, L.cs * cols + 8, L.cs * rows + 8, 8); g.fill();
        for (i = 0; i < sn.length; i++) { var p = sn[i], a = 1 - i / (sn.length + 6); g.fillStyle = i === 0 ? '#f3ecd2' : 'rgba(210,90,90,' + (0.55 + a * 0.45) + ')'; if (inv > 0 && Math.floor(pop * 10) % 2) g.fillStyle = 'rgba(255,255,255,.35)'; rr(L.x + p[0] * L.cs + 1.5, L.y + p[1] * L.cs + 1.5, L.cs - 3, L.cs - 3, L.cs * 0.3); g.fill(); }
        if (food) { var fx = L.x + food[0] * L.cs + L.cs / 2, fy = L.y + food[1] * L.cs + L.cs / 2; g.fillStyle = '#e8c04a'; g.beginPath(); g.arc(fx, fy, L.cs * 0.38, 0, 6.283); g.fill(); g.strokeStyle = '#a07a1a'; g.lineWidth = 1.5; g.beginPath(); g.arc(fx, fy, L.cs * 0.22, 0.5, 4.5); g.stroke(); }
        if (flash > 0) { g.fillStyle = 'rgba(200,40,40,' + flash * 0.3 + ')'; g.fillRect(0, 0, W, H); }
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 30 ? '#c0392b' : '#e8c04a');
        hud(T.h1 + ' ' + got + '/' + NEED, T.h2 + ' ' + errs + '/' + MAXE, errs > 0);
        fim(st);
      }
    };
  }
});
