/* Draumkvedet — a ponte do sonho (invenção). */
BTJogo.registrar({
  canvas: 'jogo-draumkvedet',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A ponte do sonho",
    "sub": "Uma ponte tem quatro pedras por fileira, mas só uma pedra de cada fileira é segura. As pedras seguras se acendem uma a uma, de baixo para cima, mostrando o caminho. Memorize a trilha. Quando ela apagar, toque nas pedras na mesma ordem, de baixo para cima. Cada toque errado conta como erro, e três erros encerram a partida. A cada rodada a ponte fica mais longa. São 3 rodadas.",
    "perdeu": "Três erros",
    "v1": "Ponte atravessada!",
    "v2": "Na balada norueguesa Draumkvedet, Olav Åsteson dorme da noite de Natal até o décimo terceiro dia e, ao acordar, conta seus sonhos, entre eles uma ponte muito alta. Memorizar a trilha é invenção.",
    "h1": "Ponte",
    "h2": "Erros",
    "memo": "Memorize a trilha",
    "vai": "Toque nas pedras, de baixo para cima"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The dream bridge",
    "sub": "A bridge has four stones in each row, but only one stone per row is safe. The safe stones light up one by one, from the bottom up, showing the way. Memorise the path. When it goes dark, tap the stones in the same order, from the bottom up. Each wrong tap counts as a mistake, and three mistakes end the game. Each round the bridge grows longer. There are 3 rounds.",
    "perdeu": "Three mistakes",
    "v1": "Bridge crossed!",
    "v2": "In the Norwegian ballad Draumkvedet, Olav Åsteson sleeps from Christmas Eve until the thirteenth day and, on waking, tells of his dreams, among them a very tall bridge. Memorising the path is invented.",
    "h1": "Bridge",
    "h2": "Mistakes",
    "memo": "Memorise the path",
    "vai": "Tap the stones, from the bottom up"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Drømmebroen",
    "sub": "En bro har fire steiner i hver rekke, men bare én stein i hver rekke er trygg. De trygge steinene lyser opp én etter én, nedenfra og opp, og viser veien. Husk stien. Når den slukner, trykk på steinene i samme rekkefølge, nedenfra og opp. Hvert feil trykk teller som en feil, og tre feil avslutter spillet. For hver runde blir broen lengre. Det er 3 runder.",
    "perdeu": "Tre feil",
    "v1": "Broen er krysset!",
    "v2": "I den norske balladen Draumkvedet sover Olav Åsteson fra julaften til trettendedagen og forteller når han våkner om draumene sine, blant dem en svært høy bro. Å huske stien er oppfunnet.",
    "h1": "Bro",
    "h2": "Feil",
    "memo": "Husk stien",
    "vai": "Trykk på steinene, nedenfra og opp"
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
    var NR = [5, 6, 7], NL = 3, MAXE = 3, COLS = 4;
    var rd = 0, err = 0, path = [], idx = 0, ph = 'show', tm = 0, tm0 = 1, fl = 0, wrong = -1, pend = 0;
    function newRound() {
      var n = NR[rd], c = (Math.random() * COLS) | 0; path = [c]; while (path.length < n) { path.push((Math.random() * COLS) | 0); }
      idx = 0; ph = 'show'; tm0 = tm = 0.6 * n + 1.6; fl = 0; wrong = -1; pend = 0;
    }
    function reset() { rd = 0; err = 0; newRound(); st = 'play'; }
    function lay() { var W = api.w, H = api.h, n = NR[2], cs = Math.min((W - 30) / COLS, (H - 190) / n, 72); return { cs: cs, x0: (W - COLS * cs) / 2, base: 90 + n * cs }; }
    function cpos(r, c) { var L = lay(); return { x: L.x0 + c * L.cs + L.cs / 2, y: L.base - r * L.cs - L.cs / 2 }; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, rd: rd, err: err, ph: ph, path: path.slice(), idx: idx, pend: pend, pos: path.map(function (c, r) { return cpos(r, c); }), grid: path.map(function (c, r) { var a = []; for (var k = 0; k < COLS; k++) a.push(cpos(r, k)); return a; }) }; },
      down: function (x, y) {
        if (menu()) return; if (ph !== 'go' || pend > 0) return; var L = lay(), c = Math.floor((x - L.x0) / L.cs), r = Math.floor((L.base - y) / L.cs);
        if (c < 0 || c >= COLS || r < 0 || r >= path.length || r !== idx) { if (r >= 0 && r < path.length && c >= 0 && c < COLS && r !== idx) return; return; }
        if (path[idx] === c) { idx++; if (api.nota) api.nota(380 + idx * 40, 0.08, 'triangle', 0.05); if (idx >= path.length) { rd++; pend = 0.9; if (api.nota) api.nota(520, 0.2, 'triangle', 0.07); } }
        else { err++; fl = 0.4; wrong = c; if (api.nota) api.nota(120, 0.2, 'sawtooth', 0.06); if (err >= MAXE) st = 'lose'; }
      },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) {
        if (st !== 'play') return;
        if (ph === 'show') { tm -= dt; if (tm <= 0) ph = 'go'; }
        if (fl > 0) fl -= dt;
        if (pend > 0) { pend -= dt; if (pend <= 0) { if (rd >= NL) st = 'win'; else newRound(); } }
      },
      draw: function () {
        var L = lay(), r, c; bg('#241e33', '#09070f'); var n = path.length;
        var lit = ph === 'show' ? Math.min(n, Math.floor((tm0 - tm) / 0.6)) : 0;
        for (r = 0; r < n; r++) for (c = 0; c < COLS; c++) {
          var p = cpos(r, c), on = (ph === 'show' && r < lit && path[r] === c) || (ph === 'go' && r < idx && path[r] === c);
          g.fillStyle = on ? '#ffd88a' : 'rgba(255,255,255,.1)'; g.beginPath(); g.arc(p.x, p.y, L.cs * 0.36, 0, 6.2832); g.fill();
          if (fl > 0 && wrong === c && r === idx) { g.strokeStyle = '#ff9a8d'; g.lineWidth = 4; g.beginPath(); g.arc(p.x, p.y, L.cs * 0.36, 0, 6.2832); g.stroke(); }
        }
        txt(ph === 'show' ? T.memo : T.vai, api.w / 2, L.base + 34, 15, '#f3ecd2');
        if (ph === 'show') bar(api.w / 2 - 110, L.base + 54, 220, 6, tm / tm0, '#ffd88a');
        hud(T.h1 + ' ' + Math.min(rd + 1, NL) + '/' + NL, T.h2 + ' ' + err + '/' + MAXE, true);
        fim(st);
      }
    };

  }
});
