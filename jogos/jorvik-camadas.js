/* As camadas de Jórvík — escave sem quebrar as camadas frágeis. */
BTJogo.registrar({
  canvas: 'jogo-jorvik',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As camadas de Jórvík",
    "sub": "Você escava um lote de Jórvík, em York. Toque numa casa para escavar. O número diz quantas camadas frágeis há nas casas vizinhas. Quebrar uma camada frágil causa um dano, e no terceiro dano a escavação é interrompida. Escave as 50 casas seguras. O botão de baixo alterna entre cavar e marcar.",
    "perdeu": "A escavação foi interrompida",
    "v1": "A escavação está completa!",
    "v2": "Em Coppergate, em York, as escavações de 1976 a 1981 revelaram casas e oficinas da Jórvík viking. As camadas frágeis do jogo são invenção.",
    "h1": "Achados",
    "h2": "Danos",
    "modoC": "Cavar",
    "modoM": "Marcar"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The layers of Jórvík",
    "sub": "You dig a plot in Jórvík, in York. Tap a square to dig. The number tells how many fragile layers lie in the neighbouring squares. Breaking a fragile layer costs one damage, and the third damage halts the dig. Dig all 50 safe squares. The button below switches between digging and marking.",
    "perdeu": "The dig was halted",
    "v1": "The dig is complete!",
    "v2": "At Coppergate, in York, the 1976–81 excavations revealed houses and workshops of Viking Jórvík. The fragile layers in the game are made up.",
    "h1": "Finds",
    "h2": "Damage",
    "modoC": "Dig",
    "modoM": "Mark"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Lagene i Jórvík",
    "sub": "Du graver i en tomt i Jórvík, i York. Trykk på en rute for å grave. Tallet forteller hvor mange skjøre lag som ligger i naborutene. Å knuse et skjørt lag gir én skade, og ved den tredje skaden stanses utgravingen. Grav ut alle 50 trygge ruter. Knappen under bytter mellom å grave og å markere.",
    "perdeu": "Utgravingen ble stanset",
    "v1": "Utgravingen er ferdig!",
    "v2": "På Coppergate i York avdekket utgravingene i 1976–81 hus og verksteder i vikingtidens Jórvík. De skjøre lagene i spillet er diktet opp.",
    "h1": "Funn",
    "h2": "Skader",
    "modoC": "Grave",
    "modoM": "Markere"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "Las capas de Jórvík",
    "sub": "Excavas una parcela de Jórvík, en York. Toca una casilla para excavar. El número indica cuántas capas frágiles hay en las casillas vecinas. Romper una capa frágil causa un daño, y al tercer daño la excavación se interrumpe. Excava las 50 casillas seguras. El botón de abajo alterna entre excavar y marcar.",
    "perdeu": "La excavación se interrumpió",
    "v1": "¡La excavación está completa!",
    "v2": "En Coppergate, en York, las excavaciones de 1976 a 1981 revelaron casas y talleres de la Jórvík vikinga. Las capas frágiles del juego son invención.",
    "h1": "Hallazgos",
    "h2": "Daños",
    "modoC": "Excavar",
    "modoM": "Marcar"
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
    var N = 8, M = 14, MAXD = 3, SAFE = N * N - M, CT = ['', '#6ab0e0', '#6ac07a', '#e0b45a', '#c08ad9', '#d96a6a', '#6ac9c0', '#ddd', '#999'];
    var mine = [], rev = [], dmg = [], flag = [], first = true, found = 0, danos = 0, mode = 0, cur = [4, 4];
    function lay() { var S = Math.min(api.w - 24, api.h - 150, 380); return { S: S, c: S / N, x: (api.w - S) / 2, y: Math.max(66, (api.h - S) / 2 - 8) }; }
    function btn() { var L = lay(); return { x: api.w / 2 - 70, y: L.y + L.S + 14, w: 140, h: 38 }; }
    function setup() { mine = []; rev = []; dmg = []; flag = []; for (var i = 0; i < N * N; i++) { mine.push(false); rev.push(false); dmg.push(false); flag.push(false); } first = true; found = 0; danos = 0; mode = 0; cur = [4, 4]; }
    function reset() { setup(); st = 'play'; }
    function nbrs(r, c) { var o = []; for (var a = -1; a <= 1; a++) for (var b = -1; b <= 1; b++) { if (!a && !b) continue; var y = r + a, x = c + b; if (y >= 0 && y < N && x >= 0 && x < N) o.push(y * N + x); } return o; }
    function cnt(r, c) { var n = 0; nbrs(r, c).forEach(function (k) { if (mine[k]) n++; }); return n; }
    function plant(r, c) { var ban = nbrs(r, c); ban.push(r * N + c); var n = 0; while (n < M) { var k = Math.floor(Math.random() * N * N); if (!mine[k] && ban.indexOf(k) < 0) { mine[k] = true; n++; } } }
    function open(r, c) {
      var q = [[r, c]]; while (q.length) { var p = q.pop(), k = p[0] * N + p[1]; if (rev[k] || mine[k] || flag[k]) continue; rev[k] = true; found++; if (cnt(p[0], p[1]) === 0) nbrs(p[0], p[1]).forEach(function (m2) { q.push([Math.floor(m2 / N), m2 % N]); }); }
    }
    function dig(r, c) {
      if (st !== 'play') return; var k = r * N + c; if (rev[k] || dmg[k]) return;
      if (mode === 1) { flag[k] = !flag[k]; return; } if (flag[k]) return;
      if (first) { plant(r, c); first = false; }
      if (mine[k]) { dmg[k] = true; danos++; if (api.nota) api.nota(120, 0.2, 'sawtooth', 0.07); if (danos >= MAXD) st = 'lose'; return; }
      open(r, c); if (api.nota) api.nota(400, 0.04, 'triangle', 0.04); if (found >= SAFE) st = 'win';
    }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(), b = btn(); return { st: st, mine: mine.slice(), rev: rev.slice(), dmg: dmg.slice(), flag: flag.slice(), found: found, danos: danos, mode: mode, first: first, x: L.x, y: L.y, c: L.c, bx: b.x + b.w / 2, by: b.y + b.h / 2, num: function (r, c) { return cnt(r, c); } }; },
      down: function (x, y) {
        if (menu()) return; var b = btn(); if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) { mode = 1 - mode; return; }
        var L = lay(), c = Math.floor((x - L.x) / L.c), r = Math.floor((y - L.y) / L.c); if (c >= 0 && c < N && r >= 0 && r < N) { cur = [r, c]; dig(r, c); }
      },
      key: function (c, d) {
        if (!d) return; if (c === 'ArrowLeft' || c === 'KeyA') cur[1] = Math.max(0, cur[1] - 1); else if (c === 'ArrowRight' || c === 'KeyD') cur[1] = Math.min(N - 1, cur[1] + 1); else if (c === 'ArrowUp' || c === 'KeyW') cur[0] = Math.max(0, cur[0] - 1); else if (c === 'ArrowDown' || c === 'KeyS') cur[0] = Math.min(N - 1, cur[0] + 1);
        else if (c === 'KeyF' || c === 'KeyM') mode = 1 - mode; else if (c === 'Space' || c === 'Enter') { if (st !== 'play') menu(); else dig(cur[0], cur[1]); }
      },
      update: function (dt) {},
      draw: function () {
        var W = api.w, H = api.h, L = lay(), r, c, b = btn();
        bg('#2b241c', '#100c08');
        g.fillStyle = 'rgba(255,255,255,.06)'; rr(L.x - 6, L.y - 6, L.S + 12, L.S + 12, 8); g.fill();
        for (r = 0; r < N; r++) for (c = 0; c < N; c++) {
          var k = r * N + c, X = L.x + c * L.c, Y = L.y + r * L.c;
          if (rev[k]) { g.fillStyle = '#4a3c2c'; g.fillRect(X + 1, Y + 1, L.c - 2, L.c - 2); var n = cnt(r, c); if (n) txt(String(n), X + L.c / 2, Y + L.c / 2 + 8, 22, CT[n]); }
          else if (dmg[k]) { g.fillStyle = '#7a2a22'; g.fillRect(X + 1, Y + 1, L.c - 2, L.c - 2); g.strokeStyle = '#ff9a8d'; g.lineWidth = 3; g.beginPath(); g.moveTo(X + 8, Y + 8); g.lineTo(X + L.c - 8, Y + L.c - 8); g.moveTo(X + L.c - 8, Y + 8); g.lineTo(X + 8, Y + L.c - 8); g.stroke(); }
          else { g.fillStyle = '#8a7656'; g.fillRect(X + 1, Y + 1, L.c - 2, L.c - 2); g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(X + 3, Y + 3, L.c - 6, 4); if (flag[k]) { g.fillStyle = '#d93a3a'; g.beginPath(); g.moveTo(X + L.c * 0.35, Y + L.c * 0.2); g.lineTo(X + L.c * 0.75, Y + L.c * 0.38); g.lineTo(X + L.c * 0.35, Y + L.c * 0.55); g.fill(); g.fillStyle = '#ddd'; g.fillRect(X + L.c * 0.32, Y + L.c * 0.2, 3, L.c * 0.6); } }
        }
        if (st === 'play') { g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = 2; g.strokeRect(L.x + cur[1] * L.c + 2, L.y + cur[0] * L.c + 2, L.c - 4, L.c - 4); }
        g.fillStyle = mode ? '#a8402a' : '#3a6aa8'; rr(b.x, b.y, b.w, b.h, 10); g.fill(); txt(mode ? T.modoM : T.modoC, b.x + b.w / 2, b.y + b.h / 2 + 7, 18, '#fff');
        hud(T.h1 + ' ' + found + '/' + SAFE, T.h2 + ' ' + danos + '/' + MAXD, danos > 0);
        fim(st);
      }
    };
  }
});
