/* Njörðr, senhor do vento e do mar — dados de porto (invenção): arrisque o ganho da viagem e guarde no porto. */
BTJogo.registrar({
  canvas: 'jogo-njordr',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os dados do porto",
    "sub": "Toque em Lançar para rolar o dado: cada resultado soma ao ganho da viagem no barco. Se sair 1, o ganho da viagem se perde e começa outra viagem. Toque em Guardar para levar o ganho ao porto. Guarde 50 pontos em até 14 viagens e 140 segundos. (Teclado: Espaço lança, Enter guarda.)",
    "perdeu": "As viagens ou o tempo acabaram",
    "v1": "O porto está cheio!",
    "v2": "Entre os Vanir, Njörðr é o senhor do vento, do mar e da pesca. O jogo de dados e o porto são invenção.",
    "h1": "Porto",
    "h2": "Viagem",
    "b1": "Lançar",
    "b2": "Guardar",
    "pl": "No barco"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The harbour dice",
    "sub": "Tap Roll to throw the die: each result adds to the voyage haul on the boat. If a 1 comes up, the voyage haul is lost and a new voyage begins. Tap Bank to take the haul to the harbour. Bank 50 points within 14 voyages and 140 seconds. (Keyboard: Space rolls, Enter banks.)",
    "perdeu": "The voyages or the time ran out",
    "v1": "The harbour is full!",
    "v2": "Among the Vanir, Njörðr is the lord of wind, sea and fishing. The dice game and the harbour are invented.",
    "h1": "Harbour",
    "h2": "Voyage",
    "b1": "Roll",
    "b2": "Bank",
    "pl": "On the boat"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Havnens terninger",
    "sub": "Trykk på Kast for å rulle terningen: hvert resultat legges til fangsten på båten. Hvis det blir 1, går fangsten tapt og en ny tur begynner. Trykk på Lagre for å ta fangsten med til havna. Lagre 50 poeng på 14 turer og 140 sekunder. (Tastatur: mellomrom kaster, Enter lagrer.)",
    "perdeu": "Turene eller tiden tok slutt",
    "v1": "Havna er full!",
    "v2": "Blant vanene er Njörðr herre over vind, hav og fiske. Terningspillet og havna er oppfunnet.",
    "h1": "Havn",
    "h2": "Tur",
    "b1": "Kast",
    "b2": "Lagre",
    "pl": "På båten"
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
    var GOAL = 50, VOY = 14, LIM = 140;
    var total = 0, pile = 0, turn = 1, die = 0, anim = 0, bust = 0, t = 0;
    function lay() { var W = api.w, H = api.h, s = Math.max(0.8, Math.min(1.4, Math.min(W, H) / 450)), bw = Math.min(190 * s, (W - 50) / 2), bh = 56 * s, by = H - bh - 28 * s; return { W: W, H: H, s: s, bw: bw, bh: bh, by: by, rx: W / 2 - bw - 10 * s, hx: W / 2 + 10 * s, cy: Math.max(150, H * 0.4) }; }
    function reset() { total = 0; pile = 0; turn = 1; die = 0; anim = 0; bust = 0; t = 0; st = 'play'; }
    function endTurn() { turn++; if (turn > VOY && st === 'play') st = 'lose'; }
    function roll() {
      if (st !== 'play') return;
      die = 1 + Math.floor(Math.random() * 6); anim = 0.3;
      if (die === 1) { pile = 0; bust = 0.8; if (api.nota) api.nota(120, 0.3, 'sawtooth', 0.06); endTurn(); }
      else { pile += die; if (api.nota) api.nota(300 + die * 60, 0.08, 'triangle', 0.05); }
    }
    function hold() {
      if (st !== 'play' || pile <= 0) return;
      total += pile; pile = 0; bust = 0; if (api.nota) api.nota(660, 0.2, 'sine', 0.06);
      if (total >= GOAL) { st = 'win'; return; } endTurn();
    }
    function hit(x, y, bx) { var L = lay(); return x >= bx && x <= bx + L.bw && y >= L.by && y <= L.by + L.bh; }
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, total: total, pile: pile, turn: turn, voy: VOY, goal: GOAL, t: t, roll: { x: L.rx + L.bw / 2, y: L.by + L.bh / 2 }, hold: { x: L.hx + L.bw / 2, y: L.by + L.bh / 2 } }; },
      down: function (x, y) { if (menu()) return; if (hit(x, y, lay().rx)) roll(); else if (hit(x, y, lay().hx)) hold(); },
      move: function () {}, up: function () {},
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'Space' || k === 'ArrowUp' || k === 'KeyW') roll(); else if (k === 'Enter' || k === 'ArrowDown' || k === 'KeyS') hold(); },
      update: function (dt) { if (anim > 0) anim -= dt; if (bust > 0) bust -= dt; if (st !== 'play') return; t += dt; if (t >= LIM) st = 'lose'; },
      draw: function () {
        var L = lay(), W = L.W, H = L.H, s = L.s, i, c = W / 2;
        bg('#12304a', '#06121f');
        g.strokeStyle = 'rgba(150,200,230,.14)'; g.lineWidth = 2; for (i = 0; i < 5; i++) { g.beginPath(); for (var x = 0; x <= W; x += 20) { var y = H * 0.28 + i * 34 * s + Math.sin(x / 38 + api.clock * 1.6 + i) * 5; if (x) g.lineTo(x, y); else g.moveTo(x, y); } g.stroke(); }
        var ds = 92 * s, dx = c - ds / 2 + (bust > 0 ? Math.sin(bust * 50) * 8 : 0), dy = L.cy - ds / 2 - (anim > 0 ? Math.sin(anim * 10) * 18 : 0);
        g.fillStyle = bust > 0 ? '#c0392b' : '#f3ecd2'; rr(dx, dy, ds, ds, 14 * s); g.fill();
        if (die) { g.fillStyle = bust > 0 ? '#fff' : '#2a2438'; var P = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] }[die]; P.forEach(function (p) { g.beginPath(); g.arc(c + p[0] * ds * 0.26, L.cy + p[1] * ds * 0.26, ds * 0.075, 0, 6.283); g.fill(); }); }
        txt(T.pl + ': ' + pile, c, L.cy + ds / 2 + 34 * s, 22 * s, pile ? '#ffd88a' : '#c9b3f2');
        var bx = 22, bw = W - 44, by = H - L.bh - 28 * s - 26; bar(bx, by, bw, 8, total / GOAL, '#6fd3a0'); txt('⚓ ' + GOAL, bx + bw, by - 6, 13, '#f3ecd2', 'right');
        var lab = [T.b1, T.b2], xs = [L.rx, L.hx], cols = ['#3a6f9a', pile > 0 ? '#a67c2a' : '#5a5040'];
        for (i = 0; i < 2; i++) { g.fillStyle = cols[i]; rr(xs[i], L.by, L.bw, L.bh, 12 * s); g.fill(); txt(lab[i], xs[i] + L.bw / 2, L.by + L.bh / 2 + 7 * s, 22 * s, '#fff'); }
        bar(W / 2 - 110, H - 14, 220, 5, (LIM - t) / LIM, LIM - t < 20 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + total + '/' + GOAL, T.h2 + ' ' + Math.min(turn, VOY) + '/' + VOY, turn >= VOY - 1);
        fim(st);
      }
    };
  }
});
