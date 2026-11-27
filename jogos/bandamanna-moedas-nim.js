/* Bandamanna saga — tire moedas dos montes e fique com a última. */
BTJogo.registrar({
  canvas: 'jogo-bandamanna',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As moedas do Althing",
    "sub": "Há três montes de moedas. Na sua vez, toque numa moeda para levar essa e todas as de cima do mesmo monte. Quem levar a última moeda vence. O rival joga logo depois de você. Vença em até 90 segundos.",
    "perdeu": "O rival levou a última",
    "v1": "A última moeda é sua!",
    "v2": "Na Bandamanna saga, Ófeigr vence um processo com astúcia e pagamentos. O jogo de moedas é invenção.",
    "h1": "Moedas",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The Althing's coins",
    "sub": "There are three heaps of coins. On your turn, tap a coin to take it and all those above it in the same heap. Whoever takes the last coin wins. The rival plays right after you. Win within 90 seconds.",
    "perdeu": "The rival took the last coin",
    "v1": "The last coin is yours!",
    "v2": "In the Bandamanna saga, Ófeigr wins a case with cunning and payments. The coin game is made up.",
    "h1": "Coins",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Alltingets mynter",
    "sub": "Det er tre hauger med mynter. I din tur trykker du på en mynt for å ta den og alle over den i samme haug. Den som tar den siste mynten, vinner. Rivalen spiller rett etter deg. Vinn innen 90 sekunder.",
    "perdeu": "Rivalen tok den siste mynten",
    "v1": "Den siste mynten er din!",
    "v2": "I Bandamanna saga vinner Ófeigr en sak med list og betalinger. Myntspillet er diktet opp.",
    "h1": "Mynter",
    "h2": "Tid"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "Las monedas del Althing",
    "sub": "Hay tres montones de monedas. En tu turno, toca una moneda para llevarte esa y todas las de encima del mismo montón. Quien se lleve la última moneda gana. El rival juega justo después de ti. Gana en un máximo de 90 segundos.",
    "perdeu": "El rival se llevó la última",
    "v1": "¡La última moneda es tuya!",
    "v2": "En la Bandamanna saga, Ófeigr gana un proceso con astucia y pagos. El juego de monedas es un invento.",
    "h1": "Monedas",
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
    var LIM = 90, ERR = 0.3;
    var h = [], turn = 0, t = 0, aiT = 0, selH = 0, selN = 1, lastTake = null, tt = 0;
    function lay() { var W = api.w, H = api.h, cs = Math.max(22, Math.min((W - 40) / 9, (H - 190) / 8.5, 44)); return { cs: cs, W: W, H: H, x: W / 2 - 3.2 * cs * 1.6, step: cs * 3.2, base: Math.max(100, (H - 8.5 * cs) / 2 + 8.5 * cs + 10) }; }
    function nimsum(a) { return a[0] ^ a[1] ^ a[2]; }
    function setup() { var tries = 0; do { h = [3 + Math.floor(Math.random() * 3), 4 + Math.floor(Math.random() * 3), 5 + Math.floor(Math.random() * 3)]; tries++; } while (nimsum(h) === 0 && tries < 50); turn = 0; t = 0; aiT = 0; selH = 0; selN = 1; lastTake = null; }
    function reset() { setup(); st = 'play'; }
    function total() { return h[0] + h[1] + h[2]; }
    function take(i, n) { h[i] -= n; lastTake = { i: i, n: n, t: 0.5 }; if (api.nota) api.nota(300 + n * 40, 0.06, 'triangle', 0.05); }
    function mine(i, n) { if (st !== 'play' || turn !== 0 || n < 1 || n > h[i]) return; take(i, n); if (total() === 0) { st = 'win'; return; } turn = 1; aiT = 0.9; }
    function aiMove() { var best = null; if (Math.random() > ERR) { var ns = nimsum(h); if (ns !== 0) { for (var i = 0; i < 3; i++) { var tgt = h[i] ^ ns; if (tgt < h[i]) { best = [i, h[i] - tgt]; break; } } } } if (!best) { var L = []; for (var j = 0; j < 3; j++) if (h[j] > 0) L.push(j); var k = L[Math.floor(Math.random() * L.length)]; best = [k, 1 + Math.floor(Math.random() * h[k])]; } return best; }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, h: h.slice(), turn: turn, busy: turn !== 0, t: t, tmr: LIM - t, nimsum: nimsum(h), pos: function (i, idx) { return { x: L.x + i * L.step + L.step / 2 - L.cs * 0.1, y: L.base - (idx + 0.5) * L.cs * 1.05 }; } }; },
      down: function (x, y) { if (menu()) return; if (turn !== 0) return; var L = lay(); for (var i = 0; i < 3; i++) { var cx = L.x + i * L.step + L.step / 2 - L.cs * 0.1; if (Math.abs(x - cx) < L.step / 2 - 4) { var idx = Math.floor((L.base - y) / (L.cs * 1.05)); if (idx >= 0 && idx < h[i]) { selH = i; mine(i, h[i] - idx); return; } if (idx >= 0 && idx < 8) { selH = i; } } } },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'ArrowLeft') { selH = (selH + 2) % 3; selN = 1; } else if (k === 'ArrowRight') { selH = (selH + 1) % 3; selN = 1; } else if (k === 'ArrowUp') selN = Math.min(h[selH], selN + 1); else if (k === 'ArrowDown') selN = Math.max(1, selN - 1); else if (k === 'Space' || k === 'Enter') { mine(selH, Math.min(selN, h[selH])); selN = 1; } },
      update: function (dt) { tt += dt; if (lastTake) { lastTake.t -= dt; if (lastTake.t <= 0) lastTake = null; } if (st !== 'play') return; t += dt; if (t >= LIM) { t = LIM; st = 'lose'; return; } if (turn === 1) { aiT -= dt; if (aiT <= 0) { var m = aiMove(); take(m[0], m[1]); if (total() === 0) { st = 'lose'; return; } turn = 0; selH = Math.max(0, h.findIndex(function (x) { return x > 0; })); selN = 1; } } },
      draw: function () {
        var L = lay(), W = L.W, H = L.H, i, j;
        bg('#2a2418', '#0a0804');
        for (i = 0; i < 3; i++) { var cx = L.x + i * L.step + L.step / 2 - L.cs * 0.1;
          g.fillStyle = 'rgba(255,255,255,.07)'; rr(cx - L.step / 2 + 6, L.base - 8.4 * L.cs * 1.05, L.step - 12, 8.6 * L.cs * 1.05, 12); g.fill();
          for (j = 0; j < h[i]; j++) { var cy = L.base - (j + 0.5) * L.cs * 1.05, hl = (turn === 0 && st === 'play' && selH === i && j >= h[i] - selN);
            g.fillStyle = hl ? '#fff0b0' : '#ffd88a'; g.beginPath(); g.ellipse(cx, cy, L.cs * 0.46, L.cs * 0.42, 0, 0, 6.283); g.fill(); g.fillStyle = hl ? '#e0c070' : '#c9a050'; g.beginPath(); g.ellipse(cx, cy, L.cs * 0.26, L.cs * 0.24, 0, 0, 6.283); g.fill(); } }
        txt(turn === 0 ? '▶' : '…', W / 2, 84, 18, '#ffd88a');
        bar(W / 2 - 110, H - 14, 220, 5, (LIM - t) / LIM, LIM - t < 15 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + total(), T.h2 + ' ' + Math.ceil(LIM - t), false);
        fim(st);
      }
    };
  }
});
