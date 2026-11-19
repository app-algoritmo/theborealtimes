/* Gudbrand i Lia — três em linha contra a aposta (invenção). */
BTJogo.registrar({
  canvas: 'jogo-gudbrand',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A aposta de Gudbrand",
    "sub": "Cada jogador tem três pedras. Primeiro vocês colocam as pedras, uma por vez, em pontos livres. Depois cada jogador move uma pedra por vez para um ponto vizinho livre, seguindo as linhas do tabuleiro. Quem formar uma linha de três pedras vence a partida. Ganhe duas partidas antes de perder duas. Partidas empatadas são repetidas.",
    "perdeu": "Duas partidas perdidas",
    "v1": "Aposta ganha!",
    "v2": "No conto Gudbrand i Lia, o fazendeiro troca a vaca por um cavalo, o cavalo por um porco, e assim por diante, até ficar sem nada. Mesmo assim ganha a aposta, porque a mulher elogia cada troca. Jogar três em linha é invenção.",
    "h1": "Vitórias",
    "h2": "Derrotas",
    "colocar": "Coloque uma pedra",
    "mover": "Mova uma pedra",
    "vez": "Vez do adversário",
    "empate": "Empate: de novo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Gudbrand’s bet",
    "sub": "Each player has three stones. First you place the stones, one at a time, on free points. Then each player moves one stone at a time to a free neighbouring point, following the lines of the board. Whoever forms a line of three stones wins the game. Win two games before losing two. Drawn games are replayed.",
    "perdeu": "Two games lost",
    "v1": "Bet won!",
    "v2": "In the tale Gudbrand i Lia, the farmer trades the cow for a horse, the horse for a pig, and so on, until he is left with nothing. Even so he wins the bet, because his wife praises every trade. Playing three in a row is invented.",
    "h1": "Wins",
    "h2": "Losses",
    "colocar": "Place a stone",
    "mover": "Move a stone",
    "vez": "Opponent’s turn",
    "empate": "Draw: again"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Gudbrands veddemål",
    "sub": "Hver spiller har tre steiner. Først plasserer dere steinene, én om gangen, på ledige punkter. Deretter flytter hver spiller én stein om gangen til et ledig nabopunkt, langs linjene på brettet. Den som får en rekke med tre steiner, vinner partiet. Vinn to partier før du taper to. Uavgjorte partier spilles om igjen.",
    "perdeu": "To partier tapt",
    "v1": "Veddemålet er vunnet!",
    "v2": "I eventyret Gudbrand i Lia bytter bonden bort kua mot en hest, hesten mot en gris, og så videre, til han står igjen med ingenting. Likevel vinner han veddemålet, fordi kona roser hvert bytte. Å spille tre på rad er oppfunnet.",
    "h1": "Seiere",
    "h2": "Tap",
    "colocar": "Sett ned en stein",
    "mover": "Flytt en stein",
    "vez": "Motstanderens tur",
    "empate": "Uavgjort: på nytt"
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
    var LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]], NEED = 2, MAXMV = 36;
    var b = [], pl = [0, 0], turn = 0, mv = 0, sel = -1, wins = 0, loss = 0, gi = 0, aiT = 0, res = 0, msg = '';
    function adj(i, j) { if (i === j) return false; var dx = Math.abs(i % 3 - j % 3), dy = Math.abs(((i / 3) | 0) - ((j / 3) | 0)); return dx + dy === 1 || i === 4 || j === 4; }
    function won(bb, p) { return LINES.some(function (l) { return bb[l[0]] === p + 1 && bb[l[1]] === p + 1 && bb[l[2]] === p + 1; }); }
    function moves(bb, pc, p) {
      var o = [], i, j; if (pc[p] < 3) { for (i = 0; i < 9; i++) if (!bb[i]) o.push([-1, i]); return o; }
      for (i = 0; i < 9; i++) if (bb[i] === p + 1) for (j = 0; j < 9; j++) if (!bb[j] && adj(i, j)) o.push([i, j]); return o;
    }
    function apply(bb, pc, p, m) { var nb = bb.slice(), np = pc.slice(); if (m[0] < 0) np[p]++; else nb[m[0]] = 0; nb[m[1]] = p + 1; return { b: nb, p: np }; }
    function aiPick() {
      var ms = moves(b, pl, 1), i, w = [], safe = [];
      for (i = 0; i < ms.length; i++) { var r = apply(b, pl, 1, ms[i]); if (won(r.b, 1)) w.push(ms[i]); else { var hm = moves(r.b, r.p, 0), bad = false, k; for (k = 0; k < hm.length; k++) if (won(apply(r.b, r.p, 0, hm[k]).b, 0)) { bad = true; break; } if (!bad) safe.push(ms[i]); } }
      var pool = w.length ? w : safe.length ? safe : ms; return pool[(Math.random() * pool.length) | 0];
    }
    function newGame() { b = []; for (var i = 0; i < 9; i++) b.push(0); pl = [0, 0]; mv = 0; sel = -1; turn = gi % 2 === 0 ? 0 : 1; aiT = turn === 1 ? 0.7 : 0; res = 0; msg = ''; }
    function reset() { wins = 0; loss = 0; gi = 0; newGame(); st = 'play'; }
    function after(p) {
      mv++; if (won(b, p)) { if (p === 0) wins++; else loss++; res = 1.1; msg = ''; if (api.nota) api.nota(p === 0 ? 520 : 120, 0.2, p === 0 ? 'triangle' : 'sawtooth', 0.06); return; }
      if (mv >= MAXMV) { res = 1.1; msg = T.empate; return; }
      turn = 1 - p; if (moves(b, pl, turn).length === 0) turn = p; if (turn === 1) aiT = 0.6;
    }
    function lay() { var W = api.w, H = api.h, s = Math.min(W - 60, H - 190, 300); return { s: s, x0: (W - s) / 2, y0: 90 }; }
    function pp(i) { var L = lay(); return { x: L.x0 + (i % 3) * L.s / 2, y: L.y0 + ((i / 3) | 0) * L.s / 2 }; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, b: b.slice(), pl: pl.slice(), turn: turn, mv: mv, sel: sel, wins: wins, loss: loss, aiT: aiT, res: res, pos: [0, 1, 2, 3, 4, 5, 6, 7, 8].map(pp) }; },
      down: function (x, y) {
        if (menu()) return; if (turn !== 0 || res > 0 || aiT > 0) return; var L = lay(), i, hitI = -1;
        for (i = 0; i < 9; i++) { var p = pp(i); if (Math.hypot(x - p.x, y - p.y) < L.s * 0.17) hitI = i; }
        if (hitI < 0) return;
        if (pl[0] < 3) { if (!b[hitI]) { b[hitI] = 1; pl[0]++; after(0); } return; }
        if (b[hitI] === 1) { sel = hitI; return; }
        if (sel >= 0 && !b[hitI] && adj(sel, hitI)) { b[sel] = 0; b[hitI] = 1; sel = -1; after(0); }
      },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) {
        if (st !== 'play') return;
        if (res > 0) { res -= dt; if (res <= 0) { if (wins >= NEED) st = 'win'; else if (loss >= NEED) st = 'lose'; else { gi++; newGame(); } } return; }
        if (aiT > 0) { aiT -= dt; if (aiT <= 0) { var m = aiPick(); if (!m) { turn = 0; return; } var r = apply(b, pl, 1, m); b = r.b; pl = r.p; after(1); } }
      },
      draw: function () {
        var L = lay(), i; bg('#1f2418', '#080a06');
        g.strokeStyle = 'rgba(232,196,106,.55)'; g.lineWidth = 3; LINES.forEach(function (l) { var a = pp(l[0]), c = pp(l[2]); g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(c.x, c.y); g.stroke(); });
        for (i = 0; i < 9; i++) {
          var p = pp(i), r = L.s * 0.1;
          if (b[i] === 0) { g.fillStyle = 'rgba(255,255,255,.18)'; g.beginPath(); g.arc(p.x, p.y, 7, 0, 6.2832); g.fill(); }
          else { g.fillStyle = b[i] === 1 ? '#f0d27a' : '#6f89b8'; g.beginPath(); g.arc(p.x, p.y, r, 0, 6.2832); g.fill(); g.strokeStyle = i === sel ? '#ffffff' : 'rgba(0,0,0,.55)'; g.lineWidth = i === sel ? 4 : 2; g.stroke(); }
        }
        var inf = msg || (res > 0 ? '' : turn === 1 ? T.vez : (pl[0] < 3 ? T.colocar : T.mover)); txt(inf, api.w / 2, L.y0 + L.s + 38, 16, msg ? '#ffd88a' : '#f3ecd2');
        hud(T.h1 + ' ' + wins + '/' + NEED, T.h2 + ' ' + loss + '/' + NEED, true);
        fim(st);
      }
    };

  }
});
