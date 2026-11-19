/* Danelaw e os Cinco Burgos — jogo de retirar fichas contra o adversário (invenção). */
BTJogo.registrar({
  canvas: 'jogo-danelaw',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os Cinco Burgos",
    "sub": "Cinco burgos têm 1, 2, 3, 4 e 5 fichas. Você joga primeiro, e depois o adversário. Na sua vez, toque numa ficha de um burgo: ela e todas as que estão acima dela saem. Quem retirar a última ficha de todas vence. O adversário nem sempre joga bem, mas às vezes joga.",
    "perdeu": "O adversário ficou com a última ficha, ou o tempo acabou",
    "v1": "A última ficha foi sua!",
    "v2": "Os Cinco Burgos eram Leicester, Nottingham, Derby, Stamford e Lincoln. O termo Danelaw só aparece no início do século XI, na forma Dena lage, em inglês antigo. O jogo é invenção.",
    "h1": "Fichas",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The Five Boroughs",
    "sub": "Five boroughs hold 1, 2, 3, 4 and 5 tokens. You play first, then the opponent. On your turn, tap a token in one borough: it and every token above it are removed. Whoever takes the very last token wins. The opponent does not always play well, but sometimes does.",
    "perdeu": "The opponent took the last token, or the time ran out",
    "v1": "The last token was yours!",
    "v2": "The Five Boroughs were Leicester, Nottingham, Derby, Stamford and Lincoln. The term Danelaw first appears in the early 11th century, in the Old English form Dena lage. The game is invented.",
    "h1": "Tokens",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "De fem byene",
    "sub": "Fem byer har 1, 2, 3, 4 og 5 brikker. Du spiller først, så motstanderen. På din tur trykker du på en brikke i én by: den og alle brikkene over den fjernes. Den som tar den aller siste brikken, vinner. Motstanderen spiller ikke alltid godt, men noen ganger gjør han det.",
    "perdeu": "Motstanderen tok den siste brikken, eller tiden tok slutt",
    "v1": "Den siste brikken var din!",
    "v2": "De fem byene var Leicester, Nottingham, Derby, Stamford og Lincoln. Ordet Danelagen dukker først opp tidlig på 1000-tallet, i den gammelengelske formen Dena lage. Spillet er oppfunnet.",
    "h1": "Brikker",
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
    var NAMES = ['Leicester', 'Nottingham', 'Derby', 'Stamford', 'Lincoln'], LIM = 150;
    var heaps = [], turn = 'me', aiT = 0, t = 0;
    function total() { return heaps.reduce(function (a, b) { return a + b; }, 0); }
    function xr(h) { return h.reduce(function (a, b) { return a ^ b; }, 0); }
    function reset() { heaps = [1, 2, 3, 4, 5]; turn = 'me'; aiT = 0; t = 0; st = 'play'; }
    function take(i, k) { heaps[i] = k; if (api.nota) api.nota(180 + i * 40, 0.12, 'triangle', 0.06); }
    function aiMove() {
      var i, k, h, best = null;
      if (Math.random() < 0.75 && xr(heaps) !== 0) { for (i = 0; i < 5 && !best; i++) for (k = 0; k < heaps[i]; k++) { h = heaps.slice(); h[i] = k; if (xr(h) === 0) { best = [i, k]; break; } } }
      if (!best) { var ne = []; for (i = 0; i < 5; i++) if (heaps[i] > 0) ne.push(i); i = ne[Math.floor(Math.random() * ne.length)]; best = [i, Math.floor(Math.random() * heaps[i])]; }
      take(best[0], best[1]);
    }
    function lay() { var W = api.w, H = api.h, cw = (W - 30) / 5, r = Math.max(9, Math.min(20, cw * 0.38, (H - 190) / 11)); return { cw: cw, r: r, x0: 15, yb: H - 62 }; }
    function ppos(i, k) { var L = lay(); return { x: L.x0 + (i + 0.5) * L.cw, y: L.yb - (k + 0.5) * (2 * L.r + 5) }; }
    function plist() { var o = []; for (var i = 0; i < 5; i++) for (var k = 0; k < heaps[i]; k++) { var p = ppos(i, k); o.push({ h: i, k: k, x: p.x, y: p.y }); } return o; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, heaps: heaps.slice(), turn: turn, t: t, pieces: plist() }; },
      down: function (x, y) {
        if (menu()) return; if (st !== 'play' || turn !== 'me') return; var L = lay(), i = Math.floor((x - L.x0) / L.cw);
        if (i < 0 || i > 4) return;
        for (var k = 0; k < heaps[i]; k++) { var p = ppos(i, k); if (Math.abs(y - p.y) <= L.r + 3) { take(i, k); if (total() === 0) st = 'win'; else { turn = 'ai'; aiT = 0.9; } return; } }
      },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) {
        if (st !== 'play') return; t += dt; if (t >= LIM) { st = 'lose'; return; }
        if (turn === 'ai') { aiT -= dt; if (aiT <= 0) { aiMove(); if (total() === 0) st = 'lose'; else turn = 'me'; } }
      },
      draw: function () {
        var L = lay(), i, k; bg('#1a2420', '#070b09');
        for (i = 0; i < 5; i++) {
          var cx = L.x0 + (i + 0.5) * L.cw; g.fillStyle = 'rgba(255,255,255,.1)'; g.fillRect(cx - 2, L.yb - 5 * (2 * L.r + 5) - 6, 4, 5 * (2 * L.r + 5) + 6);
          for (k = 0; k < heaps[i]; k++) { var p = ppos(i, k); g.fillStyle = turn === 'me' ? '#d9b05a' : '#8a7a58'; g.beginPath(); g.arc(p.x, p.y, L.r, 0, 6.2832); g.fill(); g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 1.5; g.stroke(); }
          txt(NAMES[i], cx, L.yb + 22, Math.min(12, L.cw / 7.5), 'rgba(255,255,255,.55)');
        }
        bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 25 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + total(), T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };

  }
});
