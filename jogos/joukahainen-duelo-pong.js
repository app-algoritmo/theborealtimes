/* Joukahainen — rebata a bola no duelo e marque sete pontos. */
BTJogo.registrar({
  canvas: 'jogo-joukahainen',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O duelo de cantos",
    "sub": "Arraste o dedo (ou use ← →) para mover sua barra, embaixo, e rebater a bola. Se a bola passar pelo rival, você marca. Chegue a 7 pontos antes dele, em até 150 segundos.",
    "perdeu": "O rival chegou a 7 ou o tempo acabou",
    "v1": "Você venceu o duelo!",
    "v2": "No Kalevala, o jovem Joukahainen desafia o velho Väinämöinen para um duelo de cantos e perde. A bola é invenção do jogo.",
    "h1": "Pontos",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The duel of songs",
    "sub": "Drag your finger (or use ← →) to move your bar, at the bottom, and return the ball. If the ball gets past the rival, you score. Reach 7 points before him, within 150 seconds.",
    "perdeu": "The rival reached 7 or the time ran out",
    "v1": "You won the duel!",
    "v2": "In the Kalevala, young Joukahainen challenges old Väinämöinen to a singing contest and loses. The ball is made up for the game.",
    "h1": "Points",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Sangduellen",
    "sub": "Dra fingeren (eller bruk ← →) for å flytte stangen din nederst og returnere ballen. Hvis ballen kommer forbi rivalen, scorer du. Nå 7 poeng før ham, innen 150 sekunder.",
    "perdeu": "Rivalen nådde 7, eller tiden gikk ut",
    "v1": "Du vant duellen!",
    "v2": "I Kalevala utfordrer unge Joukahainen gamle Väinämöinen til en sangduell og taper. Ballen er diktet opp for spillet.",
    "h1": "Poeng",
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
    var GOAL = 7, LIM = 150;
    var px = 0, ax = 0, bx = 0, by = 0, vx = 0, vy = 0, sp = 0, sc = [0, 0], t = 0, tgt = 0, kl = 0, kr = 0, aoff = 0, wait = 0;
    function lay() { var W = api.w, H = api.h, s = Math.max(0.8, Math.min(1.4, Math.min(W, H) / 450)); return { W: W, H: H, s: s, top: 100, ty: 118 * s / 1.0 > 0 ? 112 : 112, by: H - 46, pw: 92 * s, l: 16, r: W - 16 }; }
    function serve(dirDown) { var L = lay(); bx = L.W / 2; by = (L.ty + L.by) / 2; sp = 280 * L.s; var a = (Math.random() - 0.5) * 0.9; vx = Math.sin(a) * sp; vy = Math.cos(a) * sp * (dirDown ? 1 : -1); wait = 0.8; aoff = (Math.random() - 0.5) * 50 * L.s; }
    function setup() { var L = lay(); px = ax = L.W / 2; tgt = px; sc = [0, 0]; t = 0; kl = kr = 0; serve(false); }
    function reset() { setup(); st = 'play'; }
    function score(p) { sc[p]++; if (api.nota) api.nota(p === 0 ? 700 : 200, 0.15, 'triangle', 0.06); if (sc[0] >= GOAL) { st = 'win'; return; } if (sc[1] >= GOAL) { st = 'lose'; return; } serve(p === 1 ? false : true); }
    setup();
    return {
      pausar: function () { kl = kr = 0; },
      dbg: function () { var L = lay(); return { st: st, px: px, ax: ax, bx: bx, by: by, vx: vx, vy: vy, py: L.by, ty: L.ty, pw: L.pw, W: L.W, sc: sc.slice(), t: t, tmr: LIM - t, wait: wait, r: 8 * L.s, l: L.l, rr: L.r }; },
      down: function (x, y) { if (menu()) return; tgt = x; },
      move: function (x, y, pr) { if (st === 'play' && pr) tgt = x; },
      up: function () {},
      key: function (k, d) { if (k === 'ArrowLeft' || k === 'KeyA') kl = d ? 1 : 0; else if (k === 'ArrowRight' || k === 'KeyD') kr = d ? 1 : 0; else if (d && st !== 'play') menu(); },
      update: function (dt) {
        if (st !== 'play') return; var L = lay(), s = L.s; t += dt; if (t >= LIM) { t = LIM; st = sc[0] > sc[1] ? 'win' : 'lose'; return; }
        if (kl || kr) tgt = Math.max(L.l, Math.min(L.r, tgt + (kr - kl) * 560 * s * dt)); var d = tgt - px, m = 700 * s * dt; px += Math.max(-m, Math.min(m, d)); px = Math.max(L.l + L.pw / 2, Math.min(L.r - L.pw / 2, px));
        var ad = (bx + aoff) - ax, am = (vy < 0 ? 250 : 120) * s * dt; ax += Math.max(-am, Math.min(am, ad)); ax = Math.max(L.l + L.pw / 2, Math.min(L.r - L.pw / 2, ax));
        if (wait > 0) { wait -= dt; return; }
        bx += vx * dt; by += vy * dt; var r = 8 * s;
        if (bx < L.l + r) { bx = L.l + r; vx = Math.abs(vx); } if (bx > L.r - r) { bx = L.r - r; vx = -Math.abs(vx); }
        if (vy > 0 && by + r >= L.by && by - r < L.by + 12 && Math.abs(bx - px) <= L.pw / 2 + r) { by = L.by - r; var o = (bx - px) / (L.pw / 2); sp = Math.min(520 * s, sp * 1.05); var a = o * 1.0; vx = Math.sin(a) * sp; vy = -Math.cos(a) * sp; if (api.nota) api.nota(520, 0.04, 'square', 0.04); }
        else if (vy < 0 && by - r <= L.ty && by + r > L.ty - 12 && Math.abs(bx - ax) <= L.pw / 2 + r) { by = L.ty + r; var o2 = (bx - ax) / (L.pw / 2); sp = Math.min(520 * s, sp * 1.05); var a2 = o2 * 1.0; vx = Math.sin(a2) * sp; vy = Math.cos(a2) * sp; aoff = (Math.random() - 0.5) * 70 * s; if (api.nota) api.nota(400, 0.04, 'square', 0.04); }
        if (by > L.by + 30) score(1); else if (by < L.ty - 30) score(0);
      },
      draw: function () {
        var L = lay(), W = L.W, H = L.H, s = L.s;
        bg('#16222e', '#04080c');
        g.strokeStyle = 'rgba(255,255,255,.12)'; g.setLineDash([8, 8]); g.beginPath(); g.moveTo(L.l, (L.ty + L.by) / 2); g.lineTo(L.r, (L.ty + L.by) / 2); g.stroke(); g.setLineDash([]);
        g.fillStyle = '#e05a4a'; rr(ax - L.pw / 2, L.ty - 12, L.pw, 12, 6); g.fill();
        g.fillStyle = '#ffd88a'; rr(px - L.pw / 2, L.by, L.pw, 12, 6); g.fill();
        g.fillStyle = '#fff'; g.beginPath(); g.arc(bx, by, 8 * s, 0, 6.283); g.fill();
        hud(T.h1 + ' ' + sc[0] + '–' + sc[1], T.h2 + ' ' + Math.ceil(LIM - t), false);
        fim(st);
      }
    };
  }
});
