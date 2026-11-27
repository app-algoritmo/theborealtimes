/* Gotland — pinte a imagem inteira de uma só cor. */
BTJogo.registrar({
  canvas: 'jogo-gotland',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A imagem de Gotland",
    "sub": "A mancha parte do canto de cima à esquerda. Toque numa cor para pintar a mancha com ela: ela engole as casas vizinhas da mesma cor. Pinte a imagem toda de uma só cor em até 18 jogadas.",
    "perdeu": "As jogadas ou o tempo acabaram",
    "v1": "A imagem é de uma só cor!",
    "v2": "As pedras pintadas de Gotland, na Suécia, mostram barcos de velas entre os séculos V e XII. O jogo de cores é invenção.",
    "h1": "Pintadas",
    "h2": "Jogadas"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The Gotland picture",
    "sub": "The patch starts at the top-left corner. Tap a colour to paint the patch with it: it swallows neighbouring cells of the same colour. Paint the whole picture one colour in 18 moves or fewer.",
    "perdeu": "The moves or the time ran out",
    "v1": "The picture is one colour!",
    "v2": "The picture stones of Gotland, in Sweden, show sailing ships from the 5th to the 12th century. The colour game is made up.",
    "h1": "Painted",
    "h2": "Moves"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Bildet fra Gotland",
    "sub": "Flekken starter i øvre venstre hjørne. Trykk på en farge for å male flekken med den: den sluker nabo-rutene med samme farge. Mal hele bildet i én farge på maksimalt 18 trekk.",
    "perdeu": "Trekkene eller tiden var brukt opp",
    "v1": "Bildet har én farge!",
    "v2": "Bildesteinene på Gotland i Sverige viser seilskip fra 400-tallet til 1100-tallet. Fargespillet er diktet opp.",
    "h1": "Malt",
    "h2": "Trekk"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "La imagen de Gotland",
    "sub": "La mancha parte de la esquina de arriba a la izquierda. Toca un color para pintar la mancha con él: se traga las casillas vecinas del mismo color. Pinta toda la imagen de un solo color en un máximo de 18 jugadas.",
    "perdeu": "Se acabaron las jugadas o el tiempo",
    "v1": "¡La imagen es de un solo color!",
    "v2": "Las piedras pintadas de Gotland, en Suecia, muestran barcos de vela entre los siglos V y XII. El juego de colores es invención.",
    "h1": "Pintadas",
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
    var N = 9, NCOL = 5, MAXM = 18, LIM = 150, COL = ['#c0392b', '#4a8ad0', '#7fa86a', '#d8b040', '#9a6ab0'];
    var gr = [], moves = 0, tmr = LIM, pop = 0;
    function lay() { var W = api.w, H = api.h, cs = Math.max(28, Math.min((W - 24) / N, (H - 210) / N, 52)); return { cs: cs, x: (W - cs * N) / 2, y: Math.max(86, (H - cs * N) / 2 - 20) }; }
    function bts() { var L = lay(), w = 48, gap = 10, tot = NCOL * w + (NCOL - 1) * gap, x0 = api.w / 2 - tot / 2, a = []; for (var i = 0; i < NCOL; i++) a.push({ x: x0 + i * (w + gap), y: L.y + L.cs * N + 16, w: w, h: 44, k: i }); return a; }
    function region() { var seen = {}, q = [[0, 0]], c0 = gr[0][0]; seen['0,0'] = 1; var list = [[0, 0]]; while (q.length) { var p = q.shift(); [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) { var a = p[0] + d[0], b = p[1] + d[1]; if (a < 0 || b < 0 || a >= N || b >= N || seen[a + ',' + b] || gr[a][b] !== c0) return; seen[a + ',' + b] = 1; q.push([a, b]); list.push([a, b]); }); } return list; }
    function setup() { do { gr = []; for (var r = 0; r < N; r++) { gr.push([]); for (var c = 0; c < N; c++) gr[r].push(Math.floor(Math.random() * NCOL)); } } while (region().length > 4); moves = 0; tmr = LIM; }
    function reset() { setup(); st = 'play'; }
    function done() { var c0 = gr[0][0]; return gr.every(function (r) { return r.every(function (v) { return v === c0; }); }); }
    function paint(k) { if (st !== 'play' || k === gr[0][0]) return; region().forEach(function (p) { gr[p[0]][p[1]] = k; }); moves++; if (api.nota) api.nota(300 + k * 60, 0.05, 'triangle', 0.04); if (done()) { st = 'win'; if (api.nota) api.nota(700, 0.2, 'triangle', 0.06); return; } if (moves >= MAXM) st = 'lose'; }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var b = bts(); return { st: st, gr: gr.map(function (r) { return r.slice(); }), moves: moves, max: MAXM, tmr: tmr, reg: region().length, btn: function (k) { return { x: b[k].x + b[k].w / 2, y: b[k].y + b[k].h / 2 }; } }; },
      down: function (x, y) { if (menu()) return; var b = bts(), L = lay(); for (var i = 0; i < NCOL; i++) if (x >= b[i].x && x <= b[i].x + b[i].w && y >= b[i].y && y <= b[i].y + b[i].h) { paint(i); return; } var c = Math.floor((x - L.x) / L.cs), r = Math.floor((y - L.y) / L.cs); if (r >= 0 && c >= 0 && r < N && c < N) paint(gr[r][c]); },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } var n = parseInt(String(k).replace('Digit', ''), 10); if (n >= 1 && n <= NCOL) paint(n - 1); },
      update: function (dt) { pop += dt; if (st !== 'play') return; tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; } },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), r, c, b = bts(), reg = region(), inreg = {};
        reg.forEach(function (p) { inreg[p[0] + ',' + p[1]] = 1; });
        bg('#1a2a2e', '#060c0e');
        for (r = 0; r < N; r++) for (c = 0; c < N; c++) { g.fillStyle = COL[gr[r][c]]; g.fillRect(L.x + c * L.cs, L.y + r * L.cs, L.cs - 1, L.cs - 1); if (inreg[r + ',' + c]) { g.fillStyle = 'rgba(255,255,255,.22)'; g.beginPath(); g.arc(L.x + (c + 0.5) * L.cs, L.y + (r + 0.5) * L.cs, L.cs * 0.12, 0, 6.283); g.fill(); } }
        for (var i = 0; i < NCOL; i++) { g.fillStyle = COL[i]; rr(b[i].x, b[i].y, b[i].w, b[i].h, 10); g.fill(); g.strokeStyle = gr[0][0] === i ? '#fff' : 'rgba(255,255,255,.25)'; g.lineWidth = 2; g.stroke(); }
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 30 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + reg.length + '/' + (N * N), T.h2 + ' ' + moves + '/' + MAXM, moves >= MAXM - 3);
        fim(st);
      }
    };
  }
});
