/* Hymiskviða — carregue o caldeirão de Hymir sem deixá-lo tombar. */
BTJogo.registrar({
  canvas: 'jogo-hymir',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O caldeirão de Hymir",
    "sub": "Segure o lado esquerdo ou o direito da tela (ou use ← →) para empurrar o caldeirão de volta ao centro quando ele pender. Dê 36 passos sem deixá-lo tombar.",
    "perdeu": "O caldeirão tombou",
    "v1": "Você chegou ao salão de Ægir!",
    "v2": "No Hymiskviða, Thor carrega o caldeirão de Hymir até o salão de Ægir. O jogo de equilíbrio é invenção.",
    "h1": "Passos",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Hymir's cauldron",
    "sub": "Hold the left or right side of the screen (or use ← →) to push the cauldron back to the centre when it leans. Take 36 steps without letting it tip over.",
    "perdeu": "The cauldron tipped over",
    "v1": "You reached Ægir's hall!",
    "v2": "In the Hymiskviða, Thor carries Hymir's cauldron to Ægir's hall. The balancing game is made up.",
    "h1": "Steps",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Hymirs kjele",
    "sub": "Hold inne venstre eller høyre side av skjermen (eller bruk ← →) for å skyve kjelen tilbake til midten når den heller. Ta 36 steg uten at den velter.",
    "perdeu": "Kjelen veltet",
    "v1": "Du nådde Ægirs hall!",
    "v2": "I Hymiskviða bærer Tor Hymirs kjele til Ægirs hall. Balansespillet er diktet opp.",
    "h1": "Steg",
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
    var GOAL = 36, STEP = 1.2, LIM = 100;
    var th = 0, om = 0, u = 0, kl = 0, kr = 0, pt_ = 0, t = 0, steps = 0, nextKick = 0.8, ptrd = false, wob = 0;
    function lay() { var W = api.w, H = api.h, s = Math.max(0.7, Math.min(1.4, Math.min(W, H) / 450)); return { W: W, H: H, s: s, cx: W / 2, by: H * 0.74 }; }
    function setup() { th = (Math.random() - 0.5) * 0.1; om = 0; u = 0; t = 0; steps = 0; nextKick = 0.8; wob = 0; }
    function reset() { setup(); st = 'play'; }
    function ctl() { return pt_ || (kr - kl); }
    setup();
    return {
      pausar: function () { kl = kr = pt_ = 0; ptrd = false; },
      dbg: function () { return { st: st, th: th, om: om, steps: steps, goal: GOAL, t: t, tmr: LIM - t }; },
      down: function (x, y) { if (menu()) return; ptrd = true; pt_ = x < api.w / 2 ? -1 : 1; },
      move: function (x, y, pr) { if (st !== 'play') return; if (pr || ptrd) pt_ = x < api.w / 2 ? -1 : 1; },
      up: function () { ptrd = false; pt_ = 0; },
      key: function (k, d) { if (k === 'ArrowLeft' || k === 'KeyA') kl = d ? 1 : 0; else if (k === 'ArrowRight' || k === 'KeyD') kr = d ? 1 : 0; else if (d && st !== 'play') menu(); },
      update: function (dt) {
        if (st !== 'play') return; t += dt; if (t >= LIM) { st = 'lose'; return; }
        var dif = 1 + Math.min(1, t / 40) * 0.8; nextKick -= dt;
        if (nextKick <= 0) { nextKick += STEP * (0.7 + Math.random() * 0.6); om += (Math.random() < 0.5 ? -1 : 1) * (0.35 + Math.random() * 0.45) * dif; wob = 0.3; }
        var n = 4, h = dt / n, i;
        for (i = 0; i < n; i++) { var a = 2.6 * th + 9 * ctl() - 0.4 * om; om += a * h; th += om * h; }
        if (wob > 0) wob -= dt;
        steps = Math.floor(t / STEP * 0.95);
        if (Math.abs(th) > 0.85) { st = 'lose'; if (api.nota) api.nota(110, 0.3, 'sawtooth', 0.07); return; }
        if (steps >= GOAL) { st = 'win'; if (api.nota) api.nota(700, 0.2, 'triangle', 0.06); }
      },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), s = L.s;
        bg('#1a2a3a', '#06090e');
        g.fillStyle = 'rgba(200,230,255,.12)'; g.fillRect(0, L.by + 40 * s, W, H);
        g.fillStyle = 'rgba(220,240,255,.2)'; for (var i = 0; i < 8; i++) { var x = ((i * 130 - t * 90) % (W + 100) + W + 100) % (W + 100) - 50; g.fillRect(x, L.by + 38 * s, 36, 3); }
        g.fillStyle = '#c0392b'; rr(L.cx - 16 * s, L.by - 4 * s, 32 * s, 46 * s, 8); g.fill();
        g.fillStyle = '#e8c9a0'; g.beginPath(); g.arc(L.cx, L.by - 18 * s, 15 * s, 0, 6.283); g.fill();
        g.save(); g.translate(L.cx, L.by - 34 * s); g.rotate(th);
        g.fillStyle = '#6a6a74'; rr(-90 * s, -6 * s, 180 * s, 12 * s, 5); g.fill();
        g.fillStyle = '#3a3a44'; g.beginPath(); g.moveTo(-70 * s, -6 * s); g.quadraticCurveTo(-78 * s, -78 * s, 0, -80 * s); g.quadraticCurveTo(78 * s, -78 * s, 70 * s, -6 * s); g.closePath(); g.fill();
        g.strokeStyle = '#8a8a94'; g.lineWidth = 5 * s; g.beginPath(); g.arc(-72 * s, -34 * s, 14 * s, 1.2, 4.6); g.stroke(); g.beginPath(); g.arc(72 * s, -34 * s, 14 * s, -1.5, 1.9); g.stroke();
        g.fillStyle = 'rgba(255,216,138,.6)'; g.fillRect(-56 * s, -70 * s, 112 * s, 6 * s);
        g.restore();
        var gx = W / 2 - 110, gy = 78; g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(gx, gy, 220, 8); g.fillStyle = Math.abs(th) > 0.55 ? '#c0392b' : '#7fd08a'; var q = Math.max(-1, Math.min(1, th / 0.85)); g.fillRect(gx + 110, gy, q * 110, 8); g.fillStyle = '#fff'; g.fillRect(gx + 109, gy - 3, 2, 14);
        hud(T.h1 + ' ' + Math.min(steps, GOAL) + '/' + GOAL, T.h2 + ' ' + Math.ceil(LIM - t), false);
        fim(st);
      }
    };
  }
});
