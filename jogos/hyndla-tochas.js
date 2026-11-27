/* Hyndluljóð — acenda todas as tochas da gruta de Hyndla. */
BTJogo.registrar({
  canvas: 'jogo-hyndla',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As tochas de Hyndla",
    "sub": "Toque numa tocha para trocar o estado dela e o das quatro vizinhas (acesa ou apagada). Acenda as 25 tochas da gruta antes de gastar as 12 jogadas.",
    "perdeu": "As jogadas ou o tempo acabaram",
    "v1": "A gruta está toda acesa!",
    "v2": "No Hyndluljóð, Freyja leva Óttarr à gruta da vidente Hyndla. As tochas e o quebra-cabeça de luzes são invenção.",
    "h1": "Acesas",
    "h2": "Jogadas"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Hyndla's torches",
    "sub": "Tap a torch to flip its state and that of its four neighbours (lit or unlit). Light all 25 torches of the cave before you use up your 12 moves.",
    "perdeu": "The moves or the time ran out",
    "v1": "The whole cave is lit!",
    "v2": "In the Hyndluljóð, Freyja takes Óttarr to the cave of the seeress Hyndla. The torches and the light puzzle are made up.",
    "h1": "Lit",
    "h2": "Moves"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Hyndlas fakler",
    "sub": "Trykk på en fakkel for å bytte tilstanden til den og de fire naboene (tent eller slukket). Tenn alle 25 faklene i hulen før du har brukt opp de 12 trekkene.",
    "perdeu": "Trekkene eller tiden var brukt opp",
    "v1": "Hele hulen er tent!",
    "v2": "I Hyndluljóð tar Freyja med Óttarr til hulen til seeren Hyndla. Faklene og lysgåten er diktet opp.",
    "h1": "Tent",
    "h2": "Trekk"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "Las antorchas de Hyndla",
    "sub": "Toca una antorcha para cambiar su estado y el de las cuatro vecinas (encendida o apagada). Enciende las 25 antorchas de la gruta antes de gastar las 12 jugadas.",
    "perdeu": "Se acabaron las jugadas o el tiempo",
    "v1": "¡La gruta está toda encendida!",
    "v2": "En el Hyndluljóð, Freyja lleva a Óttarr a la gruta de la vidente Hyndla. Las antorchas y el rompecabezas de luces son invención.",
    "h1": "Encendidas",
    "h2": "Jugadas"
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
    var N = 5, LIM = 180, MAXM = 12;
    var lit = [], sol = [], moves = 0, tmr = LIM, pop = 0, last = null;
    function lay() { var W = api.w, H = api.h, cs = Math.max(36, Math.min((W - 24) / N, (H - 170) / N, 76)); return { cs: cs, x: (W - cs * N) / 2, y: Math.max(90, (H - cs * N) / 2 + 12) }; }
    function flip(r, c) { [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) { var a = r + d[0], b = c + d[1]; if (a >= 0 && b >= 0 && a < N && b < N) lit[a][b] = !lit[a][b]; }); }
    function count() { var n = 0; lit.forEach(function (r) { r.forEach(function (v) { if (v) n++; }); }); return n; }
    function setup() { do { lit = []; sol = []; for (var r = 0; r < N; r++) { lit.push(new Array(N).fill(true)); sol.push(new Array(N).fill(0)); } var cells = []; for (var i = 0; i < N * N; i++) cells.push(i); cells.sort(function () { return Math.random() - 0.5; }); for (var k = 0; k < 8; k++) { var r2 = Math.floor(cells[k] / N), c2 = cells[k] % N; flip(r2, c2); sol[r2][c2] = 1; } } while (count() === N * N); moves = 0; tmr = LIM; }
    function reset() { setup(); st = 'play'; }
    function press(r, c) { if (st !== 'play') return; flip(r, c); moves++; last = [r, c]; if (api.nota) api.nota(300 + count() * 12, 0.05, 'triangle', 0.04); if (count() === N * N) { st = 'win'; return; } if (moves >= MAXM) st = 'lose'; }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, lit: lit.map(function (r) { return r.slice(); }), sol: sol.map(function (r) { return r.slice(); }), moves: moves, max: MAXM, tmr: tmr, pos: function (r, c) { return { x: L.x + (c + 0.5) * L.cs, y: L.y + (r + 0.5) * L.cs }; } }; },
      down: function (x, y) { if (menu()) return; var L = lay(), c = Math.floor((x - L.x) / L.cs), r = Math.floor((y - L.y) / L.cs); if (r >= 0 && c >= 0 && r < N && c < N) press(r, c); },
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) { pop += dt; if (st !== 'play') return; tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; } },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), r, c;
        bg('#2a1a10', '#0a0604');
        g.fillStyle = 'rgba(0,0,0,.4)'; rr(L.x - 6, L.y - 6, L.cs * N + 12, L.cs * N + 12, 12); g.fill();
        for (r = 0; r < N; r++) for (c = 0; c < N; c++) { var x = L.x + (c + 0.5) * L.cs, y = L.y + (r + 0.5) * L.cs, on = lit[r][c];
          g.fillStyle = on ? 'rgba(255,170,60,.22)' : 'rgba(255,255,255,.06)'; rr(x - L.cs / 2 + 3, y - L.cs / 2 + 3, L.cs - 6, L.cs - 6, 10); g.fill();
          g.fillStyle = '#6a4a2a'; g.fillRect(x - 3, y - 2, 6, L.cs * 0.28);
          if (on) { var fl = 1 + 0.08 * Math.sin(pop * 9 + r * 3 + c); g.fillStyle = '#ff9a2a'; g.beginPath(); g.ellipse(x, y - L.cs * 0.12, L.cs * 0.14 * fl, L.cs * 0.24 * fl, 0, 0, 6.283); g.fill(); g.fillStyle = '#ffe08a'; g.beginPath(); g.ellipse(x, y - L.cs * 0.08, L.cs * 0.07, L.cs * 0.14 * fl, 0, 0, 6.283); g.fill(); }
          else { g.fillStyle = 'rgba(255,255,255,.18)'; g.beginPath(); g.arc(x, y - L.cs * 0.12, L.cs * 0.07, 0, 6.283); g.fill(); } }
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 30 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + count() + '/' + (N * N), T.h2 + ' ' + moves + '/' + MAXM, moves >= MAXM - 3);
        fim(st);
      }
    };
  }
});
