/* Os cabelos de Sif — refaça as tranças douradas na ordem certa. */
BTJogo.registrar({
  canvas: 'jogo-sif',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os cabelos de Sif",
    "sub": "As oito tranças de ouro de Sif foram embaralhadas. Toque numa trança vizinha do espaço vazio para movê-la (ou use as setas). Coloque as tranças na ordem de 1 a 8, com o espaço no canto de baixo. Há um limite de movimentos.",
    "perdeu": "As tranças se embaralharam de vez",
    "v1": "Os cabelos de Sif estão refeitos!",
    "v2": "Segundo Snorri, Loki cortou o cabelo de Sif e os anões o refizeram em ouro. As tranças do jogo são invenção.",
    "h1": "Tranças",
    "h2": "Movimentos"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Sif's hair",
    "sub": "Sif's eight golden braids have been scrambled. Tap a braid next to the empty space to move it (or use the arrows). Put the braids in order from 1 to 8, with the space in the bottom corner. There is a move limit.",
    "perdeu": "The braids stayed jumbled",
    "v1": "Sif's hair is restored!",
    "v2": "According to Snorri, Loki cut off Sif's hair and the dwarfs remade it in gold. The braids in the game are made up.",
    "h1": "Braids",
    "h2": "Moves"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Sifs hår",
    "sub": "De åtte gylne flettene til Sif er blandet sammen. Trykk på en fletning ved siden av det tomme rommet for å flytte den (eller bruk piltastene). Legg flettene i rekkefølge fra 1 til 8, med det tomme rommet i hjørnet nederst. Det er en grense for antall trekk.",
    "perdeu": "Flettene ble liggende rotete",
    "v1": "Sifs hår er gjenskapt!",
    "v2": "Ifølge Snorre klippet Loke av håret til Sif, og dvergene lagde det på nytt i gull. Flettene i spillet er diktet opp.",
    "h1": "Fletter",
    "h2": "Trekk"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "Los cabellos de Sif",
    "sub": "Las ocho trenzas de oro de Sif se han mezclado. Toca una trenza vecina del hueco vacío para moverla (o usa las flechas). Coloca las trenzas en orden del 1 al 8, con el hueco en la esquina de abajo. Hay un límite de movimientos.",
    "perdeu": "Las trenzas se mezclaron del todo",
    "v1": "¡Los cabellos de Sif están rehechos!",
    "v2": "Según Snorri, Loki cortó el pelo de Sif y los enanos lo rehicieron en oro. Las trenzas del juego son invención.",
    "h1": "Trenzas",
    "h2": "Movimientos"
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
    var N = 3, MAXM = 34, LIM = 240;
    var t = [], moves = 0, tmr = LIM, last = -1, cur = 0, pop = 0;
    function lay() { var W = api.w, H = api.h, S = Math.min(W - 30, H - 150, 380); return { S: S, c: S / N, x: (W - S) / 2, y: Math.max(72, (H - S) / 2 + 20) }; }
    function blank() { return t.indexOf(0); }
    function neigh(i) { var r = Math.floor(i / N), c = i % N, o = []; if (r > 0) o.push(i - N); if (r < N - 1) o.push(i + N); if (c > 0) o.push(i - 1); if (c < N - 1) o.push(i + 1); return o; }
    function setup() { t = []; for (var i = 1; i < N * N; i++) t.push(i); t.push(0); last = -1; for (var k = 0; k < 40; k++) { var bi = t.indexOf(0), o = neigh(bi).filter(function (x) { return x !== last; }), p = o[Math.floor(Math.random() * o.length)]; t[bi] = t[p]; t[p] = 0; last = bi; } if (placed() > 5) return setup(); moves = 0; tmr = LIM; cur = 0; }
    function reset() { setup(); st = 'play'; }
    function placed() { var n = 0; for (var i = 0; i < N * N - 1; i++) if (t[i] === i + 1) n++; return n; }
    function slide(i) { if (st !== 'play') return; var bi = blank(); if (neigh(bi).indexOf(i) < 0) return; t[bi] = t[i]; t[i] = 0; moves++; if (api.nota) api.nota(300, 0.05, 'triangle', 0.05); if (placed() === N * N - 1) st = 'win'; else if (moves >= MAXM) st = 'lose'; }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, t: t.slice(), moves: moves, x: L.x, y: L.y, c: L.c }; },
      down: function (x, y) { if (menu()) return; var L = lay(), c = Math.floor((x - L.x) / L.c), r = Math.floor((y - L.y) / L.c); if (r >= 0 && r < N && c >= 0 && c < N) slide(r * N + c); },
      key: function (k, d) {
        if (!d) return; if (st !== 'play') { menu(); return; } var bi = blank(), r = Math.floor(bi / N), c = bi % N, from = -1;
        if (k === 'ArrowUp' || k === 'KeyW') from = r < N - 1 ? bi + N : -1; else if (k === 'ArrowDown' || k === 'KeyS') from = r > 0 ? bi - N : -1; else if (k === 'ArrowLeft' || k === 'KeyA') from = c < N - 1 ? bi + 1 : -1; else if (k === 'ArrowRight' || k === 'KeyD') from = c > 0 ? bi - 1 : -1;
        if (from >= 0) slide(from);
      },
      update: function (dt) { pop += dt; if (st === 'play') { tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; } } },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), i;
        bg('#2c2410', '#100c05');
        g.fillStyle = '#4a3a18'; rr(L.x - 8, L.y - 8, L.S + 16, L.S + 16, 12); g.fill();
        for (i = 0; i < N * N; i++) {
          var v = t[i]; if (!v) continue; var r = Math.floor(i / N), c = i % N, x = L.x + c * L.c + 4, y = L.y + r * L.c + 4, s = L.c - 8, ok = v === i + 1;
          var gr = g.createLinearGradient(x, y, x + s, y + s); gr.addColorStop(0, ok ? '#ffe08a' : '#e8b84a'); gr.addColorStop(1, ok ? '#e8b84a' : '#b8862a'); g.fillStyle = gr; rr(x, y, s, s, 12); g.fill();
          g.strokeStyle = 'rgba(120,70,10,.45)'; g.lineWidth = 3; for (var k = 0; k < 4; k++) { g.beginPath(); g.moveTo(x + s * (0.2 + k * 0.2), y + 8); g.quadraticCurveTo(x + s * (0.1 + k * 0.2), y + s / 2, x + s * (0.2 + k * 0.2), y + s - 8); g.stroke(); }
          txt(String(v), x + s / 2, y + s / 2 + 10, 30, '#3a2208');
        }
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 40 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + placed() + '/' + (N * N - 1), T.h2 + ' ' + moves + '/' + MAXM, moves > MAXM - 15);
        fim(st);
      }
    };
  }
});
