/* Ansgar em Birka — vire as peças do rival com as suas. */
BTJogo.registrar({
  canvas: 'jogo-ansgar',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O tabuleiro de Birka",
    "sub": "Você joga com as peças claras. Toque numa casa marcada para colocar uma peça: todas as peças do rival presas em linha reta entre ela e outra sua viram suas. No fim, vence quem tiver mais peças. Você tem 3 minutos.",
    "perdeu": "O rival ficou com mais peças, ou o tempo acabou",
    "v1": "Você ficou com mais peças!",
    "v2": "Ansgar foi missionário na Suécia (Birka) no século IX. O jogo de tabuleiro é invenção.",
    "h1": "Suas peças",
    "h2": "Rival"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Birka's board",
    "sub": "You play the light pieces. Tap a marked square to place a piece: all rival pieces trapped in a straight line between it and another of yours flip to your side. At the end, whoever has more pieces wins. You have 3 minutes.",
    "perdeu": "The rival has more pieces, or time ran out",
    "v1": "You finished with more pieces!",
    "v2": "Ansgar was a missionary in Sweden (Birka) in the 9th century. The board game is made up.",
    "h1": "Yours",
    "h2": "Rival"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Brettet i Birka",
    "sub": "Du spiller med de lyse brikkene. Trykk på en merket rute for å sette en brikke: alle rivalens brikker som er fanget på rett linje mellom den og en annen av dine, snus til din side. Til slutt vinner den som har flest brikker. Du har 3 minutter.",
    "perdeu": "Rivalen fikk flest brikker, eller tiden gikk ut",
    "v1": "Du endte med flest brikker!",
    "v2": "Ansgar var misjonær i Sverige (Birka) på 800-tallet. Brettspillet er diktet opp.",
    "h1": "Dine",
    "h2": "Rival"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "El tablero de Birka",
    "sub": "Juegas con las fichas claras. Toca una casilla marcada para colocar una ficha: todas las fichas del rival atrapadas en línea recta entre ella y otra tuya pasan a ser tuyas. Al final gana quien tenga más fichas. Tienes 3 minutos.",
    "perdeu": "El rival se quedó con más fichas, o se acabó el tiempo",
    "v1": "¡Te quedaste con más fichas!",
    "v2": "Ansgar fue misionero en Suecia (Birka) en el siglo IX. El juego de tablero es invención.",
    "h1": "Tuyas",
    "h2": "Rival"
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
    var N = 6, LIM = 180, D8 = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    var bd = [], turn = 1, tmr = LIM, wait = 0, pop = 0, cur = { r: 2, c: 2 };
    var WT = [[9, 1, 4, 4, 1, 9], [1, 0, 2, 2, 0, 1], [4, 2, 3, 3, 2, 4], [4, 2, 3, 3, 2, 4], [1, 0, 2, 2, 0, 1], [9, 1, 4, 4, 1, 9]];
    function lay() { var W = api.w, H = api.h, cs = Math.max(40, Math.min((W - 24) / N, (H - 170) / N, 76)); return { cs: cs, x: (W - cs * N) / 2, y: Math.max(88, (H - cs * N) / 2 + 8) }; }
    function flips(b, r, c, p) { var out = []; if (b[r][c]) return out; D8.forEach(function (d) { var y = r + d[0], x = c + d[1], line = []; while (y >= 0 && x >= 0 && y < N && x < N && b[y][x] === -p) { line.push([y, x]); y += d[0]; x += d[1]; } if (line.length && y >= 0 && x >= 0 && y < N && x < N && b[y][x] === p) out = out.concat(line); }); return out; }
    function moves(b, p) { var o = []; for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) { var f = flips(b, r, c, p); if (f.length) o.push({ r: r, c: c, f: f }); } return o; }
    function apply(b, m, p) { b[m.r][m.c] = p; m.f.forEach(function (q) { b[q[0]][q[1]] = p; }); }
    function count(b, p) { var n = 0; b.forEach(function (r) { r.forEach(function (v) { if (v === p) n++; }); }); return n; }
    function setup() { bd = []; for (var r = 0; r < N; r++) bd.push(new Array(N).fill(0)); bd[2][2] = -1; bd[3][3] = -1; bd[2][3] = 1; bd[3][2] = 1; turn = 1; tmr = LIM; wait = 0; }
    function reset() { setup(); st = 'play'; }
    function finish() { var a = count(bd, 1), b = count(bd, -1); st = a > b ? 'win' : 'lose'; }
    function after() { var mine = moves(bd, turn); if (!mine.length) { var other = moves(bd, -turn); if (!other.length) { finish(); return; } turn = -turn; wait = 0.5; if (turn === 1) after(); } }
    function aiMove() { var ms = moves(bd, -1); if (!ms.length) { turn = 1; after(); return; } var best = null, bs = -1e9; ms.forEach(function (m) { var s = m.f.length + Math.random() * 3; if (s > bs) { bs = s; best = m; } }); if (Math.random() < 0.65) best = ms[Math.floor(Math.random() * ms.length)]; apply(bd, best, -1); if (api.nota) api.nota(240, 0.05, 'square', 0.03); turn = 1; after(); }
    function play(r, c) { if (st !== 'play' || turn !== 1) return; var f = flips(bd, r, c, 1); if (!f.length) return; apply(bd, { r: r, c: c, f: f }, 1); if (api.nota) api.nota(360, 0.05, 'triangle', 0.04); turn = -1; wait = 0.55; after(); }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, bd: bd.map(function (r) { return r.slice(); }), turn: turn, mv: moves(bd, 1).map(function (m) { return { r: m.r, c: m.c, n: m.f.length }; }), me: count(bd, 1), ai: count(bd, -1), tmr: tmr, pos: function (r, c) { return { x: L.x + (c + 0.5) * L.cs, y: L.y + (r + 0.5) * L.cs }; } }; },
      down: function (x, y) { if (menu()) return; var L = lay(), c = Math.floor((x - L.x) / L.cs), r = Math.floor((y - L.y) / L.cs); if (r >= 0 && c >= 0 && r < N && c < N) { cur = { r: r, c: c }; play(r, c); } },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'ArrowUp') cur.r = (cur.r + N - 1) % N; else if (k === 'ArrowDown') cur.r = (cur.r + 1) % N; else if (k === 'ArrowLeft') cur.c = (cur.c + N - 1) % N; else if (k === 'ArrowRight') cur.c = (cur.c + 1) % N; else if (k === 'Space' || k === 'Enter') play(cur.r, cur.c); },
      update: function (dt) { pop += dt; if (st !== 'play') return; tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; return; } if (turn === -1) { wait -= dt; if (wait <= 0) aiMove(); } },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), r, c, mv = turn === 1 ? moves(bd, 1) : [];
        bg('#1a2a2a', '#060c0c');
        g.fillStyle = '#2a5a3a'; rr(L.x - 5, L.y - 5, L.cs * N + 10, L.cs * N + 10, 10); g.fill();
        for (r = 0; r < N; r++) for (c = 0; c < N; c++) { var x = L.x + c * L.cs, y = L.y + r * L.cs; g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 1.5; g.strokeRect(x, y, L.cs, L.cs); var v = bd[r][c]; if (v) { g.fillStyle = v === 1 ? '#f2efe4' : '#26211c'; g.beginPath(); g.arc(x + L.cs / 2, y + L.cs / 2, L.cs * 0.39, 0, 6.283); g.fill(); g.strokeStyle = 'rgba(255,255,255,.25)'; g.stroke(); } }
        mv.forEach(function (m) { g.fillStyle = 'rgba(255,216,138,.55)'; g.beginPath(); g.arc(L.x + (m.c + 0.5) * L.cs, L.y + (m.r + 0.5) * L.cs, L.cs * 0.12, 0, 6.283); g.fill(); });
        if (st === 'play' && turn === 1) { g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 2; g.strokeRect(L.x + cur.c * L.cs + 3, L.y + cur.r * L.cs + 3, L.cs - 6, L.cs - 6); }
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 30 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + count(bd, 1), T.h2 + ' ' + count(bd, -1), false);
        fim(st);
      }
    };
  }
});
