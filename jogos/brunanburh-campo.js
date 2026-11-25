/* O campo de Brunanburh — conquiste o campo virando as casas do adversário. */
BTJogo.registrar({
  canvas: 'jogo-brunanburh',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O campo de Brunanburh",
    "sub": "Você comanda as peças claras. Toque numa casa marcada para colocar uma peça: todas as peças escuras presas em linha entre ela e outra sua viram suas. Ao fim, vence quem tiver mais peças. Os cantos valem muito. O tempo é limitado. (Teclado: setas e espaço.)",
    "perdeu": "O campo ficou com o inimigo",
    "v1": "O campo é seu!",
    "v2": "Em 937, na batalha de Brunanburh, o rei Æthelstan venceu uma aliança de nórdicos, escoceses e britânicos. O tabuleiro é invenção do jogo.",
    "h1": "Placar",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The field of Brunanburh",
    "sub": "You command the light pieces. Tap a marked square to place a piece: every dark piece trapped in a line between it and another of yours turns to your side. At the end, whoever has more pieces wins. Corners are worth a lot. Time is limited. (Keyboard: arrows and Space.)",
    "perdeu": "The field went to the enemy",
    "v1": "The field is yours!",
    "v2": "In 937, at the battle of Brunanburh, King Æthelstan defeated an alliance of Norse, Scots and Britons. The board is made up for the game.",
    "h1": "Score",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Slagmarka ved Brunanburh",
    "sub": "Du leder de lyse brikkene. Trykk på en merket rute for å sette ut en brikke: alle mørke brikker som er fanget i en linje mellom den og en annen av dine, blir dine. Til slutt vinner den som har flest brikker. Hjørnene er verdt mye. Tiden er begrenset. (Tastatur: piler og mellomrom.)",
    "perdeu": "Marka gikk til fienden",
    "v1": "Marka er din!",
    "v2": "I 937, i slaget ved Brunanburh, beseiret kong Æthelstan en allianse av nordmenn, skotter og briter. Brettet er diktet opp for spillet.",
    "h1": "Stilling",
    "h2": "Tid"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "El campo de Brunanburh",
    "sub": "Mandas las piezas claras. Toca una casilla marcada para colocar una pieza: todas las piezas oscuras atrapadas en línea entre ella y otra tuya pasan a ser tuyas. Al final gana quien tenga más piezas. Las esquinas valen mucho. El tiempo es limitado. (Teclado: flechas y espacio.)",
    "perdeu": "El campo se quedó con el enemigo",
    "v1": "¡El campo es tuyo!",
    "v2": "En 937, en la batalla de Brunanburh, el rey Æthelstan venció a una alianza de nórdicos, escoceses y britanos. El tablero es invención del juego.",
    "h1": "Marcador",
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
    var N = 6, LIM = 240;
    var bd = [], turn = 1, wait = 0, tmr = LIM, cur = [2, 2], msg = '', pop = 0;
    var DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
    var WT = [[9, -2, 2, 2, -2, 9], [-2, -4, 0, 0, -4, -2], [2, 0, 1, 1, 0, 2], [2, 0, 1, 1, 0, 2], [-2, -4, 0, 0, -4, -2], [9, -2, 2, 2, -2, 9]];
    function lay() { var W = api.w, H = api.h, S = Math.min(W - 24, H - 150, 420); return { S: S, c: S / N, x: (W - S) / 2, y: Math.max(70, (H - S) / 2 + 16) }; }
    function flips(b, r, c, p) { var out = [], d, k; if (b[r][c]) return out; for (d = 0; d < 8; d++) { var line = [], a = r + DIRS[d][1], e = c + DIRS[d][0]; while (a >= 0 && a < N && e >= 0 && e < N && b[a][e] === -p) { line.push([a, e]); a += DIRS[d][1]; e += DIRS[d][0]; } if (line.length && a >= 0 && a < N && e >= 0 && e < N && b[a][e] === p) out = out.concat(line); } return out; }
    function legal(b, p) { var o = []; for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) { var f = flips(b, r, c, p); if (f.length) o.push({ r: r, c: c, f: f }); } return o; }
    function count(b, p) { var n = 0; b.forEach(function (row) { row.forEach(function (v) { if (v === p) n++; }); }); return n; }
    function setup() { bd = []; for (var r = 0; r < N; r++) { bd.push([]); for (var c = 0; c < N; c++) bd[r].push(0); } bd[2][2] = -1; bd[3][3] = -1; bd[2][3] = 1; bd[3][2] = 1; turn = 1; wait = 0; tmr = LIM; msg = ''; cur = [2, 2]; }
    function reset() { setup(); st = 'play'; }
    function place(r, c, p) { var f = flips(bd, r, c, p); bd[r][c] = p; f.forEach(function (q) { bd[q[0]][q[1]] = p; }); if (api.nota) api.nota(p === 1 ? 330 : 240, 0.07, 'square', 0.05); }
    function after(p) {
      var o = -p, lo = legal(bd, o), lp = legal(bd, p);
      if (!lo.length && !lp.length) { st = count(bd, 1) > count(bd, -1) ? 'win' : 'lose'; return; }
      if (lo.length) { turn = o; wait = o === -1 ? 0.8 : 0; } else { turn = p; wait = p === -1 ? 0.8 : 0.4; }
    }
    function aiMove() {
      var m = legal(bd, -1); if (!m.length) { after(-1); return; }
      var pick; if (Math.random() < 0.4) pick = m[Math.floor(Math.random() * m.length)]; else { var bs = -1e9; m.forEach(function (q) { var s = WT[q.r][q.c] + q.f.length + Math.random() * 3; if (s > bs) { bs = s; pick = q; } }); }
      place(pick.r, pick.c, -1); after(-1);
    }
    function tryP(r, c) { if (st !== 'play' || turn !== 1 || wait > 0) return; var f = flips(bd, r, c, 1); if (!f.length) return; place(r, c, 1); after(1); }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, bd: bd.map(function (r) { return r.slice(); }), turn: turn, wait: wait, x: L.x, y: L.y, c: L.c, tmr: tmr }; },
      down: function (x, y) { if (menu()) return; var L = lay(), c = Math.floor((x - L.x) / L.c), r = Math.floor((y - L.y) / L.c); if (r >= 0 && r < N && c >= 0 && c < N) { cur = [r, c]; tryP(r, c); } },
      key: function (k, d) {
        if (!d) return; if (st !== 'play') { menu(); return; }
        if (k === 'ArrowLeft' || k === 'KeyA') cur[1] = Math.max(0, cur[1] - 1); else if (k === 'ArrowRight' || k === 'KeyD') cur[1] = Math.min(N - 1, cur[1] + 1);
        else if (k === 'ArrowUp' || k === 'KeyW') cur[0] = Math.max(0, cur[0] - 1); else if (k === 'ArrowDown' || k === 'KeyS') cur[0] = Math.min(N - 1, cur[0] + 1);
        else if (k === 'Space' || k === 'Enter') tryP(cur[0], cur[1]);
      },
      update: function (dt) {
        pop += dt; if (st !== 'play') return; tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; return; }
        if (wait > 0) { wait -= dt; if (wait <= 0) { wait = 0; if (turn === -1) aiMove(); } }
        else if (turn === -1) aiMove();
        else if (turn === 1 && !legal(bd, 1).length) { turn = -1; wait = 0.6; }
      },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), r, c;
        bg('#1a2a1e', '#0a120c');
        g.fillStyle = '#2f5a3a'; rr(L.x - 6, L.y - 6, L.S + 12, L.S + 12, 10); g.fill();
        var lm = turn === 1 && st === 'play' && wait <= 0 ? legal(bd, 1) : [];
        for (r = 0; r < N; r++) for (c = 0; c < N; c++) {
          g.fillStyle = (r + c) % 2 ? '#3a6e46' : '#33653f'; g.fillRect(L.x + c * L.c, L.y + r * L.c, L.c, L.c);
          var v = bd[r][c], x = L.x + c * L.c + L.c / 2, y = L.y + r * L.c + L.c / 2;
          if (v) { g.fillStyle = v === 1 ? '#f3ecd2' : '#2a2030'; g.beginPath(); g.arc(x, y, L.c * 0.38, 0, 6.283); g.fill(); g.strokeStyle = v === 1 ? '#c9b98a' : '#5a4a6a'; g.lineWidth = 2; g.stroke(); }
        }
        lm.forEach(function (q) { g.fillStyle = 'rgba(255,216,138,.65)'; g.beginPath(); g.arc(L.x + q.c * L.c + L.c / 2, L.y + q.r * L.c + L.c / 2, L.c * 0.12, 0, 6.283); g.fill(); });
        if (st === 'play') { g.strokeStyle = 'rgba(255,255,255,.6)'; g.lineWidth = 2; g.strokeRect(L.x + cur[1] * L.c + 3, L.y + cur[0] * L.c + 3, L.c - 6, L.c - 6); }
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 40 ? '#c0392b' : '#8ab56a');
        hud(T.h1 + ' ' + count(bd, 1) + '/' + count(bd, -1), T.h2 + ' ' + Math.ceil(tmr), false);
        fim(st);
      }
    };
  }
});
