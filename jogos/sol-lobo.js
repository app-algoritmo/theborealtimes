/* O sol e o lobo — rebata o sol antes que o lobo o alcance. */
BTJogo.registrar({
  canvas: 'jogo-solmani',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O sol e o lobo",
    "sub": "Você guia Sól e o lobo Sköll quer o sol. Arraste o dedo (ou use as setas) para mover a sua barra e rebater o sol. Faça o sol passar pelo lobo 7 vezes. Se o lobo marcar 5 vezes, o jogo acaba.",
    "perdeu": "O lobo alcançou o sol",
    "v1": "O sol continua no céu!",
    "v2": "Segundo Snorri, Sól corre porque um lobo a persegue, e no Ragnarök ele a alcança. A partida de rebater é invenção do jogo.",
    "h1": "Sol",
    "h2": "Lobo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The sun and the wolf",
    "sub": "You guide Sól and the wolf Sköll wants the sun. Drag a finger (or use the arrows) to move your bar and bat the sun back. Get the sun past the wolf 7 times. If the wolf scores 5 times, the game ends.",
    "perdeu": "The wolf caught the sun",
    "v1": "The sun is still in the sky!",
    "v2": "According to Snorri, Sól runs because a wolf chases her, and at Ragnarök it catches her. The bat-and-ball match is made up for the game.",
    "h1": "Sun",
    "h2": "Wolf"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Sola og ulven",
    "sub": "Du styrer Sol, og ulven Skoll vil ha sola. Dra en finger (eller bruk piltastene) for å flytte staven din og slå sola tilbake. Få sola forbi ulven 7 ganger. Scorer ulven 5 ganger, er spillet over.",
    "perdeu": "Ulven tok igjen sola",
    "v1": "Sola står fortsatt på himmelen!",
    "v2": "Ifølge Snorre løper Sol fordi en ulv jager henne, og i ragnarok tar den henne igjen. Slåkampen er diktet opp for spillet.",
    "h1": "Sol",
    "h2": "Ulv"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "El sol y el lobo",
    "sub": "Tú guías a Sól y el lobo Sköll quiere el sol. Arrastra el dedo (o usa las flechas) para mover tu barra y devolver el sol. Haz que el sol pase por el lobo 7 veces. Si el lobo marca 5 veces, el juego termina.",
    "perdeu": "El lobo alcanzó el sol",
    "v1": "¡El sol sigue en el cielo!",
    "v2": "Según Snorri, Sól corre porque un lobo la persigue, y en el Ragnarök la alcanza. La partida de devolver el sol es invención del juego.",
    "h1": "Sol",
    "h2": "Lobo"
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
    var WIN = 7, LOSE = 5, PL = 78, PS = 560, WS = 295;
    var ba = 0, bb = 0, va = 0, vb = 0, pb = 0, tb = 0, wb = 0, wt = 0, werr = 0, ps = 0, ws = 0, serve = 1, wait = 1, held = {}, drag = false, pop = 0, sp = 330;
    function geo() { var W = api.w, H = api.h, land = W >= H; return land ? { land: 1, x0: 30, y0: 66, LA: W - 60, LB: H - 96 } : { land: 0, x0: 20, y0: 70, LA: H - 120, LB: W - 40 }; }
    function P(a, b) { var G2 = geo(); return G2.land ? { x: G2.x0 + a, y: G2.y0 + b } : { x: G2.x0 + b, y: G2.y0 + G2.LA - a }; }
    function toB(x, y) { var G2 = geo(); return G2.land ? y - G2.y0 : x - G2.x0; }
    function serveBall() { var G2 = geo(); ba = G2.LA / 2; bb = G2.LB / 2; sp = 330; var ang = (Math.random() - 0.5) * 1.0; va = (serve > 0 ? 1 : -1) * sp * Math.cos(ang); vb = sp * Math.sin(ang); wait = 0.9; }
    function setup() { var G2 = geo(); pb = tb = wb = wt = G2.LB / 2; ps = ws = 0; serve = 1; held = {}; drag = false; serveBall(); }
    function reset() { setup(); st = 'play'; }
    function point(player) { if (player) ps++; else ws++; if (api.nota) api.nota(player ? 520 : 160, 0.15, 'triangle', 0.07); if (ps >= WIN) st = 'win'; else if (ws >= LOSE) st = 'lose'; serve = player ? -1 : 1; serveBall(); }
    setup();
    return {
      pausar: function () { held = {}; drag = false; },
      dbg: function () { var G2 = geo(), p = P(14, pb); return { st: st, bb: bb, ba: ba, va: va, vb: vb, pb: pb, ps: ps, ws: ws, wait: wait, LB: G2.LB, at: function (b) { return P(14, b); } }; },
      down: function (x, y) { if (menu()) return; drag = true; tb = toB(x, y); },
      move: function (x, y, pr) { if (drag && pr !== false) tb = toB(x, y); },
      up: function () { drag = false; },
      key: function (c, d) { held[c] = d; if (d && st !== 'play') menu(); },
      update: function (dt) {
        pop += dt; if (st !== 'play') return; var G2 = geo(), k = (held.ArrowRight || held.ArrowDown || held.KeyD || held.KeyS ? 1 : 0) - (held.ArrowLeft || held.ArrowUp || held.KeyA || held.KeyW ? 1 : 0);
        if (k) tb = Math.max(0, Math.min(G2.LB, pb + k * 140));
        if (!G2.land) { /* em retrato, esquerda e direita seguem o eixo x */ }
        var d = tb - pb, m = PS * dt; pb += Math.abs(d) < m ? d : (d > 0 ? m : -m); pb = Math.max(PL / 2, Math.min(G2.LB - PL / 2, pb));
        if (wait > 0) { wait -= dt; return; }
        /* lobo */
        werr -= dt; if (werr <= 0) { werr = 0.3; wt = bb + (Math.random() - 0.5) * 36; }
        var target = va > 0 ? wt : G2.LB / 2, dw = target - wb, mw = WS * dt; wb += Math.abs(dw) < mw ? dw : (dw > 0 ? mw : -mw); wb = Math.max(PL / 2, Math.min(G2.LB - PL / 2, wb));
        ba += va * dt; bb += vb * dt;
        if (bb < 9) { bb = 9; vb = Math.abs(vb); } if (bb > G2.LB - 9) { bb = G2.LB - 9; vb = -Math.abs(vb); }
        if (va < 0 && ba <= 24 && ba > 6 && Math.abs(bb - pb) < PL / 2 + 8) { sp = Math.min(640, sp * 1.09); var o = (bb - pb) / (PL / 2); va = Math.abs(va); var ang = o * 0.9; va = sp * Math.cos(ang); vb = sp * Math.sin(ang); if (api.nota) api.nota(330, 0.05, 'square', 0.05); }
        if (va > 0 && ba >= G2.LA - 24 && ba < G2.LA - 6 && Math.abs(bb - wb) < PL / 2 + 8) { var o2 = (bb - wb) / (PL / 2), ang2 = o2 * 0.9; va = -sp * Math.cos(ang2); vb = sp * Math.sin(ang2); if (api.nota) api.nota(250, 0.05, 'square', 0.05); }
        if (ba < -12) point(false); else if (ba > G2.LA + 12) point(true);
      },
      draw: function () {
        var W = api.w, H = api.h, G2 = geo(), i;
        bg('#2a1c34', '#0b0714');
        var a0 = P(0, 0), a1 = P(G2.LA, G2.LB); g.strokeStyle = 'rgba(255,255,255,.12)'; g.lineWidth = 2; g.strokeRect(Math.min(a0.x, a1.x), Math.min(a0.y, a1.y), Math.abs(a1.x - a0.x), Math.abs(a1.y - a0.y));
        for (i = 0; i < 12; i++) { var m1 = P(G2.LA / 2, i * G2.LB / 12 + 6); g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(m1.x - 2, m1.y - 2, 4, 4); }
        function pad(a, b, col) { var p1 = P(a, b - PL / 2), p2 = P(a + 10, b + PL / 2); g.fillStyle = col; rr(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y), Math.abs(p2.x - p1.x) + (G2.land ? 0 : 0), Math.abs(p2.y - p1.y), 5); g.fill(); }
        pad(14, pb, '#ffd88a'); pad(G2.LA - 24, wb, '#8a93a8');
        var bp = P(ba, bb); g.fillStyle = '#ffcf5a'; g.beginPath(); g.arc(bp.x, bp.y, 9, 0, 6.283); g.fill(); g.strokeStyle = 'rgba(255,207,90,.4)'; g.lineWidth = 3; g.beginPath(); g.arc(bp.x, bp.y, 13 + Math.sin(pop * 8) * 1.5, 0, 6.283); g.stroke();
        hud(T.h1 + ' ' + ps + '/' + WIN, T.h2 + ' ' + ws + '/' + LOSE, ws > 0);
        fim(st);
      }
    };
  }
});
