/* Peer Gynt — atravesse o salão do Rei da Montanha. */
BTJogo.registrar({
  canvas: 'jogo-peer',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O salão do Rei da Montanha",
    "sub": "Peer corre pelo salão. Deslize para o lado (ou toque na metade esquerda/direita; setas ou A D) para mudar de faixa e fugir dos trolls. Percorra 300 m com 3 vidas.",
    "perdeu": "Os trolls pegaram Peer",
    "v1": "Peer escapou do salão!",
    "v2": "Em Peer Gynt, de Ibsen, o Rei da Montanha (Dovregubben) leva Peer ao seu salão de trolls. A corrida pelo salão é invenção.",
    "h1": "Percurso",
    "h2": "Vidas"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The Mountain King's hall",
    "sub": "Peer runs through the hall. Swipe sideways (or tap the left/right half; arrows or A D) to change lanes and dodge the trolls. Run 300 m with 3 lives.",
    "perdeu": "The trolls caught Peer",
    "v1": "Peer escaped the hall!",
    "v2": "In Ibsen's Peer Gynt, the Mountain King (Dovregubben) takes Peer to his hall of trolls. The run through the hall is made up.",
    "h1": "Distance",
    "h2": "Lives"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Dovregubbens sal",
    "sub": "Peer løper gjennom salen. Sveip sidelengs (eller trykk på venstre/høyre halvdel; piltaster eller A D) for å bytte felt og unngå trollene. Løp 300 m med 3 liv.",
    "perdeu": "Trollene tok Peer",
    "v1": "Peer slapp ut av salen!",
    "v2": "I Ibsens Peer Gynt tar Dovregubben Peer med til trollsalen sin. Løpet gjennom salen er diktet opp.",
    "h1": "Strekning",
    "h2": "Liv"
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
    var GOAL = 300;
    var lane = 1, lx = 0, obs = [], dist = 0, lives = 3, inv = 0, nextRow = 0, pop = 0, sx = 0, sy = 0, down_ = false, spd = 0;
    function lay() { var W = api.w, H = api.h, s = Math.max(0.8, Math.min(1.5, H / 450)); var rw = Math.min(W * 0.9, 480 * Math.max(1, s)), lw = rw / 3; return { W: W, H: H, s: s, x0: (W - rw) / 2, lw: lw, ply: H - 90 * s, top: 70 }; }
    function lanex(i) { var L = lay(); return L.x0 + L.lw * (i + 0.5); }
    function speedNow() { return 210 + Math.min(120, dist * 0.5); }
    function setup() { lane = 1; lx = lanex(1); obs = []; dist = 0; lives = 3; inv = 0; nextRow = 0.8; }
    function reset() { setup(); st = 'play'; }
    function go(d) { if (st !== 'play') return; var n = Math.max(0, Math.min(2, lane + d)); if (n !== lane) { lane = n; if (api.nota) api.nota(360, 0.04, 'triangle', 0.03); } }
    function spawn() { var L = lay(), n = Math.random() < 0.45 ? 2 : 1, ls = [0, 1, 2].sort(function () { return Math.random() - 0.5; }).slice(0, n); ls.forEach(function (i) { obs.push({ lane: i, y: L.top - 40 }); }); }
    setup();
    return {
      pausar: function () { down_ = false; },
      dbg: function () { var L = lay(); return { st: st, lane: lane, obs: obs.map(function (o) { return { lane: o.lane, y: o.y }; }), ply: L.ply, dist: dist, lives: lives, spd: speedNow(), h: 34 * L.s }; },
      down: function (x, y) { if (menu()) return; sx = x; sy = y; down_ = true; },
      move: function (x, y, pr) { if (!down_ || st !== 'play') return; var dx = x - sx; if (Math.abs(dx) > 30) { go(dx > 0 ? 1 : -1); down_ = false; } },
      up: function (x, y) { if (down_ && st === 'play') { var L = lay(); if (x !== undefined) { go(x < L.W / 2 ? -1 : 1); } } down_ = false; },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'ArrowLeft' || k === 'KeyA') go(-1); else if (k === 'ArrowRight' || k === 'KeyD') go(1); },
      update: function (dt) {
        pop += dt; if (st !== 'play') return; var L = lay(), sp = speedNow() * L.s; dist += sp / L.s * dt / 14; lx += (lanex(lane) - lx) * Math.min(1, dt * 16); if (inv > 0) inv -= dt;
        nextRow -= dt; if (nextRow <= 0) { spawn(); nextRow = 1.1 + Math.random() * 0.6 - Math.min(0.3, dist / 1000); }
        obs.forEach(function (o) { o.y += sp * dt; });
        obs = obs.filter(function (o) { if (o.y > L.H + 40) return false; if (inv <= 0 && o.lane === lane && Math.abs(o.y - L.ply) < 34 * L.s) { lives--; inv = 1.1; if (api.nota) api.nota(110, 0.25, 'sawtooth', 0.07); if (lives <= 0) st = 'lose'; return false; } return true; });
        if (dist >= GOAL) { dist = GOAL; st = 'win'; }
      },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), i;
        bg('#2a1a2a', '#0a050a');
        g.fillStyle = '#3a2a3a'; g.fillRect(L.x0, 0, L.lw * 3, H);
        for (i = 0; i <= 3; i++) { g.strokeStyle = 'rgba(255,255,255,.12)'; g.lineWidth = 2; g.setLineDash([14, 14]); g.lineDashOffset = -(pop * 160) % 28; g.beginPath(); g.moveTo(L.x0 + i * L.lw, 60); g.lineTo(L.x0 + i * L.lw, H); g.stroke(); } g.setLineDash([]);
        obs.forEach(function (o) { var x = lanex(o.lane), w = L.lw * 0.4; g.fillStyle = '#5a7a4a'; rr(x - w / 2, o.y - 22 * L.s, w, 44 * L.s, 10); g.fill(); g.fillStyle = '#2a3a22'; g.beginPath(); g.arc(x - w * 0.2, o.y - 6 * L.s, 4 * L.s, 0, 6.283); g.arc(x + w * 0.2, o.y - 6 * L.s, 4 * L.s, 0, 6.283); g.fill(); g.fillStyle = '#e8e0c8'; g.fillRect(x - w * 0.25, o.y + 8 * L.s, w * 0.5, 4 * L.s); });
        if (inv <= 0 || Math.floor(pop * 12) % 2) { g.fillStyle = '#c0392b'; rr(lx - 13 * L.s, L.ply - 20 * L.s, 26 * L.s, 40 * L.s, 8); g.fill(); g.fillStyle = '#ffd88a'; g.beginPath(); g.arc(lx, L.ply - 26 * L.s, 9 * L.s, 0, 6.283); g.fill(); }
        hud(T.h1 + ' ' + Math.floor(dist) + '/' + GOAL, T.h2 + ' ' + lives, lives <= 1);
        fim(st);
      }
    };
  }
});
