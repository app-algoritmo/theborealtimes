/* Reginsmál — apanhe o ouro de Andvari e deixe passar o anel maldito. */
BTJogo.registrar({
  canvas: 'jogo-andvari',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O ouro de Andvari",
    "sub": "Arraste o dedo (ou use ← →) para mover a bolsa e apanhar as moedas de ouro que caem. Deixe passar o anel marcado em vermelho: se ele cair na bolsa, a maldição avança. Junte 20 moedas em até 70 segundos, com no máximo 2 anéis.",
    "perdeu": "A maldição ou o tempo venceu",
    "v1": "O resgate está pago!",
    "v2": "No Reginsmál, os deuses pagam o resgate de Otr com o ouro de Andvari, e o anel Andvaranaut leva a maldição. A bolsa que apanha ouro é invenção.",
    "h1": "Ouro",
    "h2": "Maldição"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Andvari's gold",
    "sub": "Drag your finger (or use ← →) to move the bag and catch the gold coins that fall. Let the ring marked in red go by: if it lands in the bag, the curse advances. Collect 20 coins within 70 seconds, with at most 2 rings.",
    "perdeu": "The curse or the time won",
    "v1": "The ransom is paid!",
    "v2": "In the Reginsmál, the gods pay Otr's ransom with Andvari's gold, and the ring Andvaranaut carries the curse. The bag that catches gold is made up.",
    "h1": "Gold",
    "h2": "Curse"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Andvaris gull",
    "sub": "Dra fingeren (eller bruk ← →) for å flytte posen og fange gullmyntene som faller. La ringen merket med rødt gå forbi: lander den i posen, går forbannelsen videre. Samle 20 mynter på 70 sekunder, med høyst 2 ringer.",
    "perdeu": "Forbannelsen eller tiden vant",
    "v1": "Løsepengene er betalt!",
    "v2": "I Reginsmál betaler gudene løsepengene for Otr med Andvaris gull, og ringen Andvaranaut bærer forbannelsen. Posen som fanger gull, er diktet opp.",
    "h1": "Gull",
    "h2": "Forbannelse"
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
    var GOAL = 20, MAXC = 2, LIM = 70;
    var items = [], bx = 0, tgt = 0, gold = 0, cur = 0, t = 0, spawn = 0.3, kl = 0, kr = 0, flash = 0;
    function lay() { var W = api.w, H = api.h, s = Math.max(0.8, Math.min(1.4, Math.min(W, H) / 450)); return { W: W, H: H, s: s, by: H - 46 * s, bw: 84 * s }; }
    function setup() { items = []; var L = lay(); bx = tgt = L.W / 2; gold = 0; cur = 0; t = 0; spawn = 0.3; flash = 0; }
    function reset() { setup(); st = 'play'; }
    setup();
    return {
      pausar: function () { kl = kr = 0; },
      dbg: function () { var L = lay(); return { st: st, bx: bx, bw: L.bw, by: L.by, items: items.map(function (i) { return { x: i.x, y: i.y, ring: i.ring, v: i.v }; }), gold: gold, goal: GOAL, curse: cur, max: MAXC, t: t, tmr: LIM - t, W: L.W }; },
      down: function (x, y) { if (menu()) return; tgt = x; },
      move: function (x, y, pr) { if (st === 'play' && pr) tgt = x; },
      up: function () {},
      key: function (k, d) { if (k === 'ArrowLeft' || k === 'KeyA') kl = d ? 1 : 0; else if (k === 'ArrowRight' || k === 'KeyD') kr = d ? 1 : 0; else if (d && st !== 'play') menu(); },
      update: function (dt) {
        if (flash > 0) flash -= dt; if (st !== 'play') return; t += dt; if (t >= LIM) { st = 'lose'; return; }
        var L = lay(); if (kl || kr) tgt = Math.max(0, Math.min(L.W, tgt + (kr - kl) * 560 * L.s * dt));
        var d = tgt - bx, mx = 620 * L.s * dt; bx += Math.max(-mx, Math.min(mx, d));
        var dif = Math.min(1, t / LIM); spawn -= dt; if (spawn <= 0) { items.push({ x: 30 + Math.random() * (L.W - 60), y: -20, ring: Math.random() < 0.22, v: (170 + dif * 120 + Math.random() * 50) * L.s }); spawn = 0.72 - dif * 0.18 + Math.random() * 0.4; }
        for (var i = items.length - 1; i >= 0; i--) { var it = items[i]; it.y += it.v * dt; if (it.y >= L.by - 12 * L.s && it.y <= L.by + 14 * L.s && Math.abs(it.x - bx) < L.bw / 2 + 6 * L.s) { items.splice(i, 1); if (it.ring) { cur++; flash = 0.4; if (api.nota) api.nota(110, 0.25, 'sawtooth', 0.07); if (cur > MAXC) { st = 'lose'; return; } } else { gold++; if (api.nota) api.nota(600 + (gold % 5) * 60, 0.06, 'triangle', 0.05); if (gold >= GOAL) { st = 'win'; return; } } } else if (it.y > L.H + 20) items.splice(i, 1); }
      },
      draw: function () {
        var L = lay(), W = L.W, H = L.H, s = L.s, i;
        bg('#1a2a3a', '#050a10');
        g.fillStyle = 'rgba(160,200,230,.12)'; for (i = 0; i < 6; i++) g.fillRect(((i * 197 + t * 30) % W), 0, 3, H);
        for (i = 0; i < items.length; i++) { var it = items[i]; if (it.ring) { g.strokeStyle = '#d8493a'; g.lineWidth = 5 * s; g.beginPath(); g.arc(it.x, it.y, 11 * s, 0, 6.283); g.stroke(); g.strokeStyle = 'rgba(255,216,138,.8)'; g.lineWidth = 2; g.beginPath(); g.arc(it.x, it.y, 15 * s, 0, 6.283); g.stroke(); } else { g.fillStyle = '#ffd88a'; g.beginPath(); g.arc(it.x, it.y, 10 * s, 0, 6.283); g.fill(); g.fillStyle = '#c9a050'; g.beginPath(); g.arc(it.x, it.y, 5 * s, 0, 6.283); g.fill(); } }
        g.fillStyle = '#6a4a2a'; g.beginPath(); g.moveTo(bx - L.bw / 2, L.by - 10 * s); g.lineTo(bx + L.bw / 2, L.by - 10 * s); g.lineTo(bx + L.bw / 2 - 12 * s, L.by + 22 * s); g.lineTo(bx - L.bw / 2 + 12 * s, L.by + 22 * s); g.closePath(); g.fill();
        g.fillStyle = '#8a6a3a'; g.fillRect(bx - L.bw / 2, L.by - 14 * s, L.bw, 6 * s);
        if (flash > 0) { g.fillStyle = 'rgba(192,57,43,' + flash * 0.5 + ')'; g.fillRect(0, 0, W, H); }
        bar(W / 2 - 110, H - 12, 220, 5, (LIM - t) / LIM, LIM - t < 15 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + gold + '/' + GOAL, T.h2 + ' ' + cur + '/' + (MAXC + 1), cur >= MAXC);
        fim(st);
      }
    };
  }
});
