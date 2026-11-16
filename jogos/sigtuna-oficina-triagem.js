/* Sigtuna, primeira cidade sueca — separe moedas e pentes de osso que chegam à oficina (invenção). */
BTJogo.registrar({
  canvas: 'jogo-sigtuna',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A oficina de Sigtuna",
    "sub": "Peças descem pela esteira: moedas redondas vão para a esquerda e pentes de osso vão para a direita. Toque no lado esquerdo ou direito da tela (ou use ← →) para mandar a peça de baixo. Separe 30 peças certas. Mandar para o lado errado ou deixar uma peça passar conta como erro: no terceiro erro, a oficina para.",
    "perdeu": "A oficina parou",
    "v1": "As peças estão separadas!",
    "v2": "Fundada por volta de 980, Sigtuna cunhou as primeiras moedas suecas. A triagem de moedas e pentes é invenção.",
    "h1": "Peças",
    "h2": "Erros",
    "lm": "Moedas",
    "lp": "Pentes"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Sigtuna's workshop",
    "sub": "Pieces come down the belt: round coins go left and bone combs go right. Tap the left or right side of the screen (or use ← →) to send the lowest piece. Sort 30 pieces correctly. Sending one the wrong way or letting one pass counts as a mistake: on the third mistake, the workshop stops.",
    "perdeu": "The workshop stopped",
    "v1": "The pieces are sorted!",
    "v2": "Founded around 980, Sigtuna minted the first Swedish coins. The sorting of coins and combs is invented.",
    "h1": "Pieces",
    "h2": "Mistakes",
    "lm": "Coins",
    "lp": "Combs"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Sigtunas verksted",
    "sub": "Brikker kommer nedover båndet: runde mynter går til venstre og beinkammer går til høyre. Trykk på venstre eller høyre side av skjermen (eller bruk ← →) for å sende den nederste brikken. Sorter 30 brikker riktig. Å sende en feil vei eller la en gå forbi teller som en feil: ved den tredje feilen stopper verkstedet.",
    "perdeu": "Verkstedet stoppet",
    "v1": "Brikkene er sortert!",
    "v2": "Sigtuna ble grunnlagt rundt år 980 og preget de første svenske myntene. Sorteringen av mynter og kammer er oppfunnet.",
    "h1": "Brikker",
    "h2": "Feil",
    "lm": "Mynter",
    "lp": "Kammer"
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
    var GOAL = 30, MAXE = 2;
    var items = [], ok = 0, err = 0, t = 0, nextSp = 0, fly = [], flash = 0, lastY = 0;
    function lay() { var W = api.w, H = api.h, s = Math.max(0.8, Math.min(1.4, Math.min(W, H) / 450)); return { W: W, H: H, s: s, line: H * 0.8 }; }
    function reset() { items = []; ok = 0; err = 0; t = 0; nextSp = 0.4; fly = []; flash = 0; st = 'play'; }
    function sort(side) {
      if (st !== 'play' || !items.length) return;
      var it = items.shift(); fly.push({ kind: it.kind, x: lay().W / 2, y: it.y, d: side, a: 0 });
      if (it.kind === side) { ok++; if (api.nota) api.nota(500 + ok * 8, 0.08, 'triangle', 0.05); if (ok >= GOAL) st = 'win'; }
      else { err++; flash = 0.4; if (api.nota) api.nota(110, 0.25, 'sawtooth', 0.06); if (err > MAXE) st = 'lose'; }
    }
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, items: items.map(function (i) { return { kind: i.kind, y: i.y }; }), ok: ok, goal: GOAL, err: err, W: L.W, line: L.line, t: t }; },
      down: function (x, y) { if (menu()) return; sort(x < lay().W / 2 ? 0 : 1); },
      move: function () {}, up: function () {},
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'ArrowLeft' || k === 'KeyA') sort(0); else if (k === 'ArrowRight' || k === 'KeyD') sort(1); },
      update: function (dt) {
        if (flash > 0) flash -= dt; for (var i = fly.length - 1; i >= 0; i--) { fly[i].a += dt; if (fly[i].a > 0.3) fly.splice(i, 1); }
        if (st !== 'play') return; var L = lay(); t += dt;
        var v = (125 + Math.min(110, ok * 4)) * L.s; nextSp -= dt;
        var lastItem = items[items.length - 1]; if (nextSp <= 0 && (!lastItem || lastItem.y > 70 + 95 * L.s)) { items.push({ kind: Math.random() < 0.5 ? 0 : 1, y: 50 }); nextSp = 0.15 + Math.random() * 0.3; }
        for (i = 0; i < items.length; i++) items[i].y += v * dt;
        if (items.length && items[0].y > L.line) { items.shift(); err++; flash = 0.4; if (api.nota) api.nota(110, 0.25, 'sawtooth', 0.06); if (err > MAXE) st = 'lose'; }
      },
      draw: function () {
        var L = lay(), W = L.W, H = L.H, s = L.s, i;
        bg('#2a2030', '#0d0a12');
        g.fillStyle = '#3a3040'; g.fillRect(W / 2 - 46 * s, 0, 92 * s, H); g.strokeStyle = 'rgba(255,255,255,.08)'; g.lineWidth = 2; for (i = 0; i < 14; i++) { var yy = ((i * 60 + t * 90) % (H + 60)) - 30; g.beginPath(); g.moveTo(W / 2 - 46 * s, yy); g.lineTo(W / 2 + 46 * s, yy); g.stroke(); }
        g.fillStyle = 'rgba(255,216,138,.35)'; g.fillRect(W / 2 - 60 * s, L.line, 120 * s, 3);
        function piece(k, x, y, a) { g.globalAlpha = a; if (k === 0) { g.fillStyle = '#c8ccd8'; g.beginPath(); g.arc(x, y, 22 * s, 0, 6.283); g.fill(); g.strokeStyle = '#7a8090'; g.lineWidth = 3; g.stroke(); g.beginPath(); g.moveTo(x - 10 * s, y); g.lineTo(x + 10 * s, y); g.moveTo(x, y - 10 * s); g.lineTo(x, y + 10 * s); g.stroke(); } else { g.fillStyle = '#e2d4a8'; rr(x - 28 * s, y - 14 * s, 56 * s, 28 * s, 5); g.fill(); g.strokeStyle = '#8a7a4a'; g.lineWidth = 2; for (var q = -3; q <= 3; q++) { g.beginPath(); g.moveTo(x + q * 7 * s, y + 2 * s); g.lineTo(x + q * 7 * s, y + 14 * s); g.stroke(); } } g.globalAlpha = 1; }
        for (i = 0; i < items.length; i++) piece(items[i].kind, W / 2, items[i].y, 1);
        for (i = 0; i < fly.length; i++) { var f = fly[i]; piece(f.kind, W / 2 + (f.d ? 1 : -1) * f.a * 600 * s, f.y, 1 - f.a / 0.3); }
        g.fillStyle = 'rgba(110,150,200,.22)'; g.fillRect(0, L.line - 40 * s, W / 2 - 70 * s, 110 * s); g.fillStyle = 'rgba(200,170,110,.22)'; g.fillRect(W / 2 + 70 * s, L.line - 40 * s, W / 2 - 70 * s, 110 * s);
        txt(T.lm, (W / 2 - 70 * s) / 2, L.line + 20 * s, 18 * s, '#c8d4f0'); txt(T.lp, W - (W / 2 - 70 * s) / 2, L.line + 20 * s, 18 * s, '#f0dcb0');
        if (flash > 0) { g.fillStyle = 'rgba(192,57,43,' + flash * 0.5 + ')'; g.fillRect(0, 0, W, H); }
        hud(T.h1 + ' ' + ok + '/' + GOAL, T.h2 + ' ' + err + '/' + (MAXE + 1), err >= MAXE);
        fim(st);
      }
    };
  }
});
