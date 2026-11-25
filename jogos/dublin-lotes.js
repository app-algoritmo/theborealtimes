/* Os lotes de Dublin — pinte o mapa inteiro de uma só cor. */
BTJogo.registrar({
  canvas: 'jogo-dublin',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os lotes de Dublin",
    "sub": "Você começa no lote do canto de cima, à esquerda. Escolha uma cor embaixo: o seu território vira essa cor e engole os lotes vizinhos que a tiverem. Pinte o mapa inteiro de uma só cor dentro do limite de jogadas. Teclado: números de 1 a 5.",
    "perdeu": "O mapa ficou retalhado",
    "v1": "Dublin é toda sua!",
    "v2": "As escavações de Wood Quay, em Dublin, revelaram lotes de casas vikings, alinhados em ruas. A pintura de lotes é invenção do jogo.",
    "h1": "Lotes",
    "h2": "Jogadas"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Dublin's plots",
    "sub": "You start on the plot in the top left corner. Pick a colour below: your territory turns that colour and swallows the neighbouring plots that have it. Paint the whole map one colour within the move limit. Keyboard: numbers 1 to 5.",
    "perdeu": "The map stayed patchy",
    "v1": "All of Dublin is yours!",
    "v2": "The Wood Quay excavations in Dublin revealed plots of Viking houses laid out along streets. The painting of plots is made up for the game.",
    "h1": "Plots",
    "h2": "Moves"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Dublins tomter",
    "sub": "Du starter på tomten i øvre venstre hjørne. Velg en farge nederst: området ditt skifter til den fargen og sluker nabotomtene som har den. Mal hele kartet i én farge innenfor trekkgrensen. Tastatur: tallene 1 til 5.",
    "perdeu": "Kartet ble liggende flekkete",
    "v1": "Hele Dublin er ditt!",
    "v2": "Utgravingene på Wood Quay i Dublin avdekket tomter med vikinghus langs gater. Tomtemalingen er diktet opp for spillet.",
    "h1": "Tomter",
    "h2": "Trekk"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "Las parcelas de Dublín",
    "sub": "Empiezas en la parcela de la esquina de arriba, a la izquierda. Elige un color abajo: tu territorio se vuelve de ese color y se traga las parcelas vecinas que lo tengan. Pinta todo el mapa de un solo color dentro del límite de jugadas. Teclado: números del 1 al 5.",
    "perdeu": "El mapa quedó a retazos",
    "v1": "¡Dublín es toda tuya!",
    "v2": "Las excavaciones de Wood Quay, en Dublín, revelaron parcelas de casas vikingas alineadas en calles. La pintura de parcelas es invención del juego.",
    "h1": "Parcelas",
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
    var N = 9, NCOL = 5, MAXM = 18, LIM = 150, COL = ['#d9573a', '#e0b030', '#4a90c0', '#5aa05a', '#9a6ac0'];
    var m = [], moves = 0, tmr = LIM, pop = 0, cur = 0;
    function lay() { var W = api.w, H = api.h, S = Math.min(W - 30, H - 170, 340), cs = S / N; return { S: S, cs: cs, x: (W - S) / 2, y: Math.max(70, (H - S - 56) / 2 + 22), py: 0 }; }
    function setup() { m = []; for (var r = 0; r < N; r++) { m.push([]); for (var c = 0; c < N; c++) m[r].push(Math.floor(Math.random() * NCOL)); } moves = 0; tmr = LIM; cur = m[0][0]; }
    function region() { var s = {}, q = [[0, 0]], v = m[0][0]; s[0] = 1; while (q.length) { var p = q.pop(); [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) { var a = p[0] + d[0], b = p[1] + d[1]; if (a >= 0 && b >= 0 && a < N && b < N && !s[b * N + a] && m[b][a] === v) { s[b * N + a] = 1; q.push([a, b]); } }); } return s; }
    function count() { return Object.keys(region()).length; }
    function reset() { setup(); st = 'play'; }
    function paint(k) { if (st !== 'play' || k === m[0][0]) return; var s = region(); for (var i in s) m[Math.floor(i / N)][i % N] = k; moves++; if (api.nota) api.nota(300 + k * 70, 0.06, 'triangle', 0.05); if (count() === N * N) st = 'win'; else if (moves >= MAXM) st = 'lose'; }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, m: m.map(function (r) { return r.slice(); }), moves: moves, cnt: count(), pbx: function (k) { return L.x + (k + 0.5) * L.S / NCOL; }, pby: L.y + L.S + 34 }; },
      down: function (x, y) { if (menu()) return; var L = lay(), k = Math.floor((x - L.x) / (L.S / NCOL)); if (y > L.y + L.S + 8 && k >= 0 && k < NCOL) paint(k); },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (/^Digit[1-5]$/.test(k)) paint(+k.slice(5) - 1); else if (k === 'ArrowLeft' || k === 'KeyA') cur = (cur + NCOL - 1) % NCOL; else if (k === 'ArrowRight' || k === 'KeyD') cur = (cur + 1) % NCOL; else if (k === 'Space' || k === 'Enter') paint(cur); },
      update: function (dt) { pop += dt; if (st === 'play') { tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; } } },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), r, c, k, rg = region();
        bg('#1c2420', '#080c0a');
        for (r = 0; r < N; r++) for (c = 0; c < N; c++) { g.fillStyle = COL[m[r][c]]; g.fillRect(L.x + c * L.cs + 1, L.y + r * L.cs + 1, L.cs - 2, L.cs - 2); if (rg[r * N + c]) { g.fillStyle = 'rgba(255,255,255,.3)'; g.fillRect(L.x + c * L.cs + L.cs * 0.38, L.y + r * L.cs + L.cs * 0.38, L.cs * 0.24, L.cs * 0.24); } }
        for (k = 0; k < NCOL; k++) { var bx = L.x + k * L.S / NCOL, bw = L.S / NCOL - 8; g.fillStyle = COL[k]; rr(bx + 4, L.y + L.S + 14, bw, 40, 10); g.fill(); g.strokeStyle = k === m[0][0] ? '#fff' : 'rgba(0,0,0,.4)'; g.lineWidth = k === m[0][0] ? 3 : 2; rr(bx + 4, L.y + L.S + 14, bw, 40, 10); g.stroke(); txt(String(k + 1), bx + 4 + bw / 2, L.y + L.S + 42, 18, 'rgba(0,0,0,.55)'); }
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 30 ? '#c0392b' : '#5aa05a');
        hud(T.h1 + ' ' + Object.keys(rg).length + '/' + N * N, T.h2 + ' ' + moves + '/' + MAXM, moves > MAXM - 5);
        fim(st);
      }
    };
  }
});
