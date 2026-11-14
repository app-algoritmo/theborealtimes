/* O fio das Nornas — mantenha o fio dourado esticado. */
BTJogo.registrar({
  canvas: 'jogo-nornas',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O fio das Nornas",
    "sub": "Arraste o dedo (ou o mouse, ou use as setas) para cima e para baixo e mantenha a ponta do fio dentro da faixa dourada que ondula. Se o fio ficar solto por muito tempo, ele arrebenta.",
    "perdeu": "O fio arrebentou",
    "v1": "O fio está tecido!",
    "v2": "Nas fontes nórdicas, as nornas moldam o destino junto ao poço de Urðr. A faixa e o fio do jogo são invenção.",
    "h1": "Fio",
    "h2": "Tensão"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The threads of the Norns",
    "sub": "Drag your finger (or mouse, or use the arrow keys) up and down and keep the thread tip inside the wavering golden band. If the thread stays slack for too long, it snaps.",
    "perdeu": "The thread snapped",
    "v1": "The thread is woven!",
    "v2": "In the Norse sources, the Norns shape fate by the well of Urðr. The band and the thread in the game are made up.",
    "h1": "Thread",
    "h2": "Tension"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Nornenes tråd",
    "sub": "Dra fingeren (eller musa, eller bruk piltastene) opp og ned og hold trådspissen innenfor det bølgende gylne båndet. Hvis tråden henger slakk for lenge, ryker den.",
    "perdeu": "Tråden røk",
    "v1": "Tråden er vevd!",
    "v2": "I de norrøne kildene former nornene skjebnen ved Urds brønn. Båndet og tråden i spillet er diktet opp.",
    "h1": "Tråd",
    "h2": "Spenning"
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
    var t = 0, val = 0, my = 0, ten = 1, ku = 0, kd = 0, BW = 90;
    function reset() { st = 'play'; t = 0; val = 0; ten = 1; my = api.h / 2; }
    function by() { var h = api.h; return Math.max(60 + BW / 2, Math.min(h - 40 - BW / 2, h / 2 + Math.sin(t * 0.9) * h * 0.26 + Math.sin(t * 0.37) * h * 0.1)); }
    return {
      pausar: function () { ku = kd = 0; },
      dbg: function () { return { st: st, by: by(), my: my, bw: BW, val: val, ten: ten }; },
      down: function (x, y) { if (menu()) return; my = y; },
      move: function (x, y) { if (st === 'play') my = y; },
      key: function (c, d) { if (c === 'ArrowUp' || c === 'KeyW') ku = d ? 1 : 0; else if (c === 'ArrowDown' || c === 'KeyS') kd = d ? 1 : 0; else if (d && st !== 'play' && (c === 'Space' || c === 'Enter')) menu(); },
      update: function (dt) {
        if (st !== 'play') return;
        t += dt; my = Math.max(20, Math.min(api.h - 20, my + (kd - ku) * 320 * dt));
        if (Math.abs(my - by()) < BW / 2) { val += dt / 16; ten = Math.min(1, ten + dt * 0.5); } else { ten -= dt / 3.5; }
        if (ten <= 0) st = 'lose'; else if (val >= 1) st = 'win';
      },
      draw: function () {
        var W = api.w, H = api.h, b = by();
        bg('#2c2147', '#12102a');
        g.fillStyle = 'rgba(255,216,138,.28)'; g.fillRect(0, b - BW / 2, W, BW);
        g.fillStyle = 'rgba(255,216,138,.8)'; g.fillRect(0, b - BW / 2, W, 3); g.fillRect(0, b + BW / 2 - 3, W, 3);
        g.strokeStyle = ten > 0.4 ? '#f3ecd2' : '#ff8a7a'; g.lineWidth = 3; g.beginPath(); g.moveTo(0, H / 2); g.bezierCurveTo(W * 0.3, H / 2 + (my - H / 2) * 0.2, W * 0.6, my, W * 0.82, my); g.stroke();
        g.fillStyle = '#ffd88a'; g.beginPath(); g.arc(W * 0.82, my, 11, 0, 6.29); g.fill();
        if (st !== 'menu') { g.fillStyle = 'rgba(255,255,255,.2)'; g.fillRect(22, 66, 140, 8); g.fillStyle = '#ffd88a'; g.fillRect(22, 66, 140 * val, 8); }
        hud(T.h1 + ' ' + Math.round(val * 100) + '%', T.h2 + ' ' + Math.round(Math.max(0, ten) * 100) + '%', ten < 0.4);
        fim(st);
      }
    };
  }
});
