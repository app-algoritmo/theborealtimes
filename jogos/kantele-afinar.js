/* Afine o kantele — ajuste cada corda até o ponteiro ficar no centro. */
BTJogo.registrar({
  canvas: 'jogo-kantele',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Afine o kantele",
    "sub": "Arraste o dedo para a esquerda ou a direita (ou use as setas) para girar a cravelha da corda e levar o ponteiro ao centro verde. Segure ali por um instante e a corda fica afinada. Cada corda tem tempo limitado; três cordas rompidas e o jogo termina.",
    "perdeu": "As cordas se romperam",
    "v1": "O kantele canta!",
    "v2": "No Kalevala, reunido por Elias Lönnrot no século XIX, Väinämöinen faz o primeiro kantele com a mandíbula de um grande peixe. As cordas e a afinação do jogo são invenção.",
    "h1": "Cordas",
    "h2": "Rompidas"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Tune the kantele",
    "sub": "Drag your finger left or right (or use the arrow keys) to turn the string's peg and bring the needle to the green centre. Hold it there for a moment and the string is in tune. Each string has limited time; three broken strings end the game.",
    "perdeu": "The strings snapped",
    "v1": "The kantele sings!",
    "v2": "In the Kalevala, compiled by Elias Lönnrot in the 19th century, Väinämöinen makes the first kantele from the jawbone of a great fish. The strings and the tuning in the game are made up.",
    "h1": "Strings",
    "h2": "Broken"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Stem kantelen",
    "sub": "Dra fingeren til venstre eller høyre (eller bruk piltastene) for å dreie strengens stemmeskrue og få nåla til det grønne midtpunktet. Hold den der et øyeblikk, så er strengen stemt. Hver streng har begrenset tid; tre strenger som ryker, avslutter spillet.",
    "perdeu": "Strengene røk",
    "v1": "Kantelen synger!",
    "v2": "I Kalevala, samlet av Elias Lönnrot på 1800-tallet, lager Väinämöinen den første kantelen av kjeven til en stor fisk. Strengene og stemmingen i spillet er diktet opp.",
    "h1": "Strenger",
    "h2": "Røket"
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
    var N = 5, MAXE = 3, TOL = 0.08, HOLD = 1.0, LIM = 12, FR = [196, 220, 262, 294, 330];
    var idx = 0, x = 0, hold = 0, tl = 0, errs = 0, done = 0, drag = false, lx = 0, kk = 0, ping = 0, fl = 0;
    function novo() { var s = Math.random() < 0.5 ? -1 : 1; x = s * (0.7 + Math.random() * 0.7); hold = 0; tl = LIM; ping = 0; }
    function reset() { st = 'play'; idx = 0; done = 0; errs = 0; drag = false; kk = 0; fl = 0; novo(); }
    function lim(v) { return Math.max(-1.6, Math.min(1.6, v)); }
    function nota(f, d, tp, v) { if (api.nota) api.nota(f, d, tp, v); }
    return {
      pausar: function () { kk = 0; drag = false; },
      dbg: function () { return { st: st, idx: idx, x: x, tol: TOL, hold: hold, tl: tl, done: done, errs: errs }; },
      down: function (px) { if (menu()) return; drag = true; lx = px; },
      move: function (px) { if (st !== 'play' || !drag) return; x = lim(x + (px - lx) / (api.w * 0.22)); lx = px; },
      up: function () { drag = false; },
      key: function (c, d) { if (c === 'ArrowLeft' || c === 'KeyA') kk = d ? -1 : (kk === -1 ? 0 : kk); else if (c === 'ArrowRight' || c === 'KeyD') kk = d ? 1 : (kk === 1 ? 0 : kk); else if (d && st !== 'play' && (c === 'Space' || c === 'Enter')) menu(); },
      update: function (dt) {
        if (st !== 'play') return;
        if (fl > 0) { fl -= dt; return; }
        x = lim(x + kk * 0.9 * dt); tl -= dt; ping -= dt;
        if (ping <= 0) { nota(FR[idx], 0.35, 'sine', 0.09); nota(FR[idx] * Math.pow(2, x / 12), 0.35, 'triangle', 0.07); ping = 1.1; }
        if (Math.abs(x) <= TOL) hold += dt; else hold = Math.max(0, hold - dt * 1.5);
        if (hold >= HOLD) { done++; idx++; fl = 0.7; if (api.nota) { nota(FR[idx - 1], 0.5, 'sine', 0.12); } if (done >= N) st = 'win'; else novo(); }
        else if (tl <= 0) { errs++; fl = 0.7; if (errs >= MAXE) st = 'lose'; else novo(); }
      },
      draw: function () {
        var W = api.w, H = api.h;
        bg('#1b1030', '#2c1a44');
        var cx = W / 2, top = H * 0.2, bot = H * 0.66, wt = Math.min(W * 0.36, 180), wb = Math.min(W * 0.7, 360);
        g.fillStyle = '#c99a5a'; g.beginPath(); g.moveTo(cx - wt, top); g.lineTo(cx + wt, top); g.lineTo(cx + wb, bot); g.lineTo(cx - wb, bot); g.fill(); g.fillStyle = '#7a5428'; g.beginPath(); g.moveTo(cx - wt + 12, top + 10); g.lineTo(cx + wt - 12, top + 10); g.lineTo(cx + wb - 22, bot - 12); g.lineTo(cx - wb + 22, bot - 12); g.fill();
        for (var s = 0; s < N; s++) {
          var f = N === 1 ? 0.5 : s / (N - 1), sx0 = cx - wt + 22 + (2 * wt - 44) * f, sx1 = cx - wb + 40 + (2 * wb - 80) * f, act = s === idx && st === 'play', ok = s < done;
          g.strokeStyle = ok ? '#9dffb6' : act ? '#ffd88a' : '#e8d9a8'; g.lineWidth = act ? 3 : 2; g.beginPath(); g.moveTo(sx0, top + 12); g.lineTo(sx1 + (act ? Math.sin(api.clock * 40) * 1.5 * Math.min(1, Math.abs(x)) : 0), bot - 14); g.stroke();
        }
        var gy = H * 0.8, gw = Math.min(W * 0.7, 420), gx = cx - gw / 2;
        g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(gx, gy, gw, 12); g.fillStyle = 'rgba(80,220,140,.6)'; g.fillRect(cx - gw * TOL / 1.6 * 0.5 / 1, gy - 2, gw * TOL / 1.6, 16);
        var px = cx + (x / 1.6) * (gw / 2); g.fillStyle = Math.abs(x) <= TOL ? '#9dffb6' : '#ffd88a'; g.beginPath(); g.moveTo(px, gy - 14); g.lineTo(px - 8, gy - 28); g.lineTo(px + 8, gy - 28); g.fill();
        txt('♭', gx - 14, gy + 10, 20, '#9ad7ff'); txt('♯', gx + gw + 14, gy + 10, 20, '#ff9a8d');
        g.fillStyle = 'rgba(255,255,255,.2)'; g.fillRect(cx - gw / 2, gy + 26, gw, 6); g.fillStyle = tl < 4 ? '#ff8a7a' : '#c9b3f2'; g.fillRect(cx - gw / 2, gy + 26, gw * Math.max(0, tl) / LIM, 6);
        if (hold > 0) { g.fillStyle = '#9dffb6'; g.fillRect(cx - gw / 2, gy + 36, gw * Math.min(1, hold / HOLD), 4); }
        hud(T.h1 + ' ' + done + '/' + N, T.h2 + ' ' + errs + '/' + MAXE, errs > 0);
        fim(st);
      }
    };
  }
});
