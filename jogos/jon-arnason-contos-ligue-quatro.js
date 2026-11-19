/* Jón Árnason e os contos da Islândia — ligue quatro fichas (invenção). */
BTJogo.registrar({
  canvas: 'jogo-jonarnason',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os fios dos contos de Jón",
    "sub": "Num quadro de 7 colunas por 6 linhas, você e o adversário deixam cair fichas, uma por vez, e cada ficha desce até o ponto mais baixo da coluna. Quem ligar quatro fichas da própria cor, em linha reta ou na diagonal, vence. Você joga primeiro, com as fichas douradas. Toque numa coluna para soltar a sua.",
    "perdeu": "O adversário ligou quatro, o quadro encheu ou o tempo acabou",
    "v1": "Quatro fichas ligadas!",
    "v2": "Jón Árnason (1819–1888) foi o primeiro bibliotecário do que viria a ser a Biblioteca Nacional da Islândia. Sua coletânea Íslenzkar þjóðsögur og æfintýri saiu em dois volumes, em 1862 e 1864. O jogo é invenção.",
    "h1": "Lances",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The threads of Jón's tales",
    "sub": "On a board of 7 columns by 6 rows, you and the opponent drop tokens one at a time, and each token falls to the lowest free spot in its column. Whoever links four tokens of their own colour, in a straight line or on a diagonal, wins. You play first, with the gold tokens. Tap a column to drop yours.",
    "perdeu": "The opponent linked four, the board filled up or the time ran out",
    "v1": "Four tokens linked!",
    "v2": "Jón Árnason (1819–1888) was the first librarian of what became the National Library of Iceland. His collection Íslenzkar þjóðsögur og æfintýri came out in two volumes, in 1862 and 1864. The game is invented.",
    "h1": "Moves",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Trådene i Jóns fortellinger",
    "sub": "På et brett med 7 kolonner og 6 rader slipper du og motstanderen brikker, én om gangen, og hver brikke faller til det laveste ledige stedet i kolonnen. Den som får fire brikker i sin egen farge på rad, rett eller på skrå, vinner. Du spiller først, med de gylne brikkene. Trykk på en kolonne for å slippe din.",
    "perdeu": "Motstanderen fikk fire på rad, brettet ble fullt eller tiden tok slutt",
    "v1": "Fire brikker på rad!",
    "v2": "Jón Árnason (1819–1888) var den første bibliotekaren i det som ble Islands nasjonalbibliotek. Samlingen hans, Íslenzkar þjóðsögur og æfintýri, kom ut i to bind, i 1862 og 1864. Spillet er oppfunnet.",
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
    var CO = 7, RO = 6, LIM = 200;
    var b = [], turn = 'me', aiT = 0, t = 0, moves = 0, last = null;
    function get(c, r) { return c >= 0 && c < CO && r >= 0 && r < RO && b[c][r] ? b[c][r] : 0; }
    function line(c, r, p) { var ds = [[1, 0], [0, 1], [1, 1], [1, -1]]; for (var d = 0; d < 4; d++) { var n = 1, k; for (k = 1; k < 4 && get(c + ds[d][0] * k, r + ds[d][1] * k) === p; k++) n++; for (k = 1; k < 4 && get(c - ds[d][0] * k, r - ds[d][1] * k) === p; k++) n++; if (n >= 4) return true; } return false; }
    function wouldWin(c, p) { if (b[c].length >= RO) return false; var r = b[c].length; b[c].push(p); var w = line(c, r, p); b[c].pop(); return w; }
    function legal() { var o = []; for (var c = 0; c < CO; c++) if (b[c].length < RO) o.push(c); return o; }
    function reset() { b = []; for (var c = 0; c < CO; c++) b.push([]); turn = 'me'; aiT = 0; t = 0; moves = 0; last = null; st = 'play'; }
    function drop(c, p) { b[c].push(p); last = [c, b[c].length - 1]; if (api.nota) api.nota(p === 1 ? 300 : 220, 0.1, 'triangle', 0.06); return line(c, b[c].length - 1, p); }
    function aiPick() {
      var L = legal(), i, c;
      for (i = 0; i < L.length; i++) if (wouldWin(L[i], 2)) return L[i];
      for (i = 0; i < L.length; i++) if (wouldWin(L[i], 1)) return L[i];
      if (Math.random() < 0.2) return L[Math.floor(Math.random() * L.length)];
      var safe = L.filter(function (c2) { b[c2].push(2); var bad = b[c2].length < RO && wouldWin(c2, 1); b[c2].pop(); return !bad; });
      if (safe.length) L = safe;
      L.sort(function (a, d) { return Math.abs(a - 3) - Math.abs(d - 3) + (Math.random() - 0.5) * 1.5; });
      return L[0];
    }
    function full() { return legal().length === 0; }
    function lay() { var W = api.w, H = api.h, cs = Math.max(30, Math.min((W - 30) / CO, (H - 130) / RO, 64)); return { cs: cs, x0: (W - cs * CO) / 2, y0: 70 }; }
    function cx(c) { var L = lay(); return L.x0 + (c + 0.5) * L.cs; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, b: b.map(function (c) { return c.slice(); }), turn: turn, moves: moves, t: t, cols: [0, 1, 2, 3, 4, 5, 6].map(function (c) { return { x: cx(c), y: lay().y0 + 20 }; }) }; },
      down: function (x, y) {
        if (menu()) return; if (st !== 'play' || turn !== 'me') return; var L = lay(), c = Math.floor((x - L.x0) / L.cs);
        if (c < 0 || c >= CO || b[c].length >= RO) return;
        moves++; if (drop(c, 1)) { st = 'win'; return; } if (full()) { st = 'lose'; return; } turn = 'ai'; aiT = 0.6;
      },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) {
        if (st !== 'play') return; t += dt; if (t >= LIM) { st = 'lose'; return; }
        if (turn === 'ai') { aiT -= dt; if (aiT <= 0) { var c = aiPick(); if (drop(c, 2) || full()) st = 'lose'; else turn = 'me'; } }
      },
      draw: function () {
        var L = lay(), c, r; bg('#1c1830', '#08060f');
        g.fillStyle = '#2f3f7a'; rr(L.x0 - 6, L.y0 - 6, L.cs * CO + 12, L.cs * RO + 12, 14); g.fill();
        for (c = 0; c < CO; c++) for (r = 0; r < RO; r++) {
          var x = cx(c), y = L.y0 + (RO - 1 - r + 0.5) * L.cs, v = b[c][r] || 0;
          g.beginPath(); g.arc(x, y, L.cs * 0.38, 0, 6.2832); g.fillStyle = v === 1 ? '#e8b84a' : (v === 2 ? '#a58cd0' : '#0c0a18'); g.fill();
          if (last && last[0] === c && last[1] === r) { g.strokeStyle = '#fff'; g.lineWidth = 2; g.stroke(); }
        }
        bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 30 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + moves, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };

  }
});
