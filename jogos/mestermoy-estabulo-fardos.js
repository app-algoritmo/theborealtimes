/* Mestermøy e o estábulo do gigante — quebra-cabeça de fardos (invenção). */
BTJogo.registrar({
  canvas: 'jogo-mestermoy',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O estábulo da Mestermøy",
    "sub": "Oito fardos numerados estão fora de ordem no estábulo, que tem um espaço vazio. Toque num fardo ao lado do espaço para empurrá-lo para lá. Ponha os fardos em ordem, de 1 a 8, com o espaço no canto de baixo à direita. Você tem 50 lances. (Teclado: setas.)",
    "perdeu": "Os lances ou o tempo acabaram antes de o estábulo ficar em ordem",
    "v1": "O estábulo está em ordem!",
    "v2": "Jørgen Moe anotou o conto da Mestermøy, a donzela que ajuda o filho do rei nas tarefas do gigante, com a narradora Anne Godlid, em Seljord, no outono de 1842. O quebra-cabeça é invenção.",
    "h1": "Lances",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The Mestermøy's stable",
    "sub": "Eight numbered bales are out of order in the stable, which has one empty space. Tap a bale next to the space to push it in. Put the bales in order, from 1 to 8, with the space in the bottom right corner. You have 50 moves. (Keyboard: arrow keys.)",
    "perdeu": "The moves or the time ran out before the stable was in order",
    "v1": "The stable is in order!",
    "v2": "Jørgen Moe wrote down the tale of the Mestermøy, the maiden who helps the king's son with the giant's tasks, from the storyteller Anne Godlid, in Seljord, in the autumn of 1842. The puzzle is invented.",
    "h1": "Moves",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Mestermøys stall",
    "sub": "Åtte nummererte baller ligger i feil rekkefølge i stallen, som har ett tomt rom. Trykk på en ball ved siden av det tomme rommet for å skyve den inn. Få ballene i rekkefølge, fra 1 til 8, med det tomme rommet nederst til høyre. Du har 50 trekk. (Tastatur: piltaster.)",
    "perdeu": "Trekkene eller tiden tok slutt før stallen var i orden",
    "v1": "Stallen er i orden!",
    "v2": "Jørgen Moe skrev ned eventyret om Mestermøy, jenta som hjelper kongssønnen med kjempens oppgaver, etter fortelleren Anne Godlid, i Seljord, høsten 1842. Puslespillet er oppfunnet.",
    "h1": "Trekk",
    "h2": "Tid"
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
    var N = 3, LIMIT = 50, LIM = 180;
    var cells = [], sol = [], moves = 0, t = 0;
    function solvedNow() { for (var i = 0; i < 8; i++) if (cells[i] !== i + 1) return false; return cells[8] === 0; }
    function nbs(e) { var r = Math.floor(e / N), c = e % N, o = []; if (r > 0) o.push(e - N); if (r < N - 1) o.push(e + N); if (c > 0) o.push(e - 1); if (c < N - 1) o.push(e + 1); return o; }
    function reset() {
      do { cells = [1, 2, 3, 4, 5, 6, 7, 8, 0]; sol = []; var e = 8, prev = -1;
        for (var k = 0; k < 24; k++) { var o = nbs(e).filter(function (z) { return z !== prev; }), p = o[Math.floor(Math.random() * o.length)]; cells[e] = cells[p]; cells[p] = 0; sol.push(e); prev = e; e = p; }
        sol.reverse(); } while (solvedNow());
      moves = 0; t = 0; st = 'play';
    }
    function tap(i) {
      if (st !== 'play') return; var e = cells.indexOf(0);
      if (nbs(e).indexOf(i) < 0) return;
      cells[e] = cells[i]; cells[i] = 0; moves++; if (api.nota) api.nota(220 + cells[e] * 25, 0.08, 'triangle', 0.05);
      if (solvedNow()) st = 'win'; else if (moves >= LIMIT) st = 'lose';
    }
    function lay() { var W = api.w, H = api.h, gs = Math.max(150, Math.min(W - 30, H - 120, 380)); return { gs: gs, cs: gs / N, x0: (W - gs) / 2, y0: 70 }; }
    function cpos(i) { var L = lay(); return { x: L.x0 + (i % N + 0.5) * L.cs, y: L.y0 + (Math.floor(i / N) + 0.5) * L.cs }; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, cells: cells.slice(), sol: sol.slice(), moves: moves, limit: LIMIT, t: t, pos: cells.map(function (v, i) { return cpos(i); }) }; },
      down: function (x, y) { if (menu()) return; var L = lay(), c = Math.floor((x - L.x0) / L.cs), r = Math.floor((y - L.y0) / L.cs); if (c >= 0 && c < N && r >= 0 && r < N) tap(r * N + c); },
      move: function () {}, up: function () {},
      key: function (k, d) {
        if (!d) return; if (st !== 'play') { menu(); return; }
        var e = cells.indexOf(0), r = Math.floor(e / N), c = e % N, m = { ArrowUp: [r + 1, c], ArrowDown: [r - 1, c], ArrowLeft: [r, c + 1], ArrowRight: [r, c - 1] }[k];
        if (m && m[0] >= 0 && m[0] < N && m[1] >= 0 && m[1] < N) tap(m[0] * N + m[1]);
      },
      update: function (dt) { if (st !== 'play') return; t += dt; if (t >= LIM) st = 'lose'; },
      draw: function () {
        var L = lay(), i; bg('#2a2312', '#0c0a04');
        g.fillStyle = 'rgba(0,0,0,.35)'; rr(L.x0 - 6, L.y0 - 6, L.gs + 12, L.gs + 12, 14); g.fill();
        for (i = 0; i < N * N; i++) {
          if (!cells[i]) continue; var p = cpos(i), s = L.cs - 8;
          g.fillStyle = cells[i] === i + 1 ? '#d9b05a' : '#b8924a'; rr(p.x - s / 2, p.y - s / 2, s, s, 10); g.fill(); g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 2; g.stroke();
          g.strokeStyle = 'rgba(255,240,200,.25)'; g.lineWidth = 2; g.beginPath(); g.moveTo(p.x - s * 0.38, p.y - s * 0.3); g.lineTo(p.x + s * 0.38, p.y - s * 0.3); g.moveTo(p.x - s * 0.38, p.y + s * 0.3); g.lineTo(p.x + s * 0.38, p.y + s * 0.3); g.stroke();
          txt(String(cells[i]), p.x, p.y + 10, Math.min(34, s * 0.4), '#2a2112');
        }
        bar(api.w / 2 - 110, api.h - 14, 220, 5, (LIM - t) / LIM, LIM - t < 30 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + moves + '/' + LIMIT, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };

  }
});
