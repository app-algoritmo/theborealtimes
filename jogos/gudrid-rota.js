/* A rota de Gudríð — desvie o navio dos blocos de gelo. */
BTJogo.registrar({
  canvas: 'jogo-gudrid',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A rota de Gudríð",
    "sub": "Guie o navio para a esquerda e para a direita (arraste, use o mouse ou as setas) e desvie dos blocos de gelo. Aguente a travessia até avistar terra. Três batidas e o navio não resiste.",
    "perdeu": "O gelo venceu a travessia",
    "v1": "Terra à vista!",
    "v2": "As sagas contam que Gudríð cruzou o Atlântico até a Groenlândia e a Vinlândia. Os blocos de gelo do jogo são invenção.",
    "h1": "Travessia",
    "h2": "Casco"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Gudríð's route",
    "sub": "Steer the ship left and right (drag, use the mouse or the arrow keys) and dodge the ice floes. Hold out until land is sighted. Three hits and the ship cannot take more.",
    "perdeu": "The ice won the crossing",
    "v1": "Land ahead!",
    "v2": "The sagas say Gudríð crossed the Atlantic to Greenland and Vinland. The ice floes in the game are made up.",
    "h1": "Crossing",
    "h2": "Hull"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Gudrids rute",
    "sub": "Styr skipet til venstre og høyre (dra, bruk musa eller piltastene) og unngå isflakene. Hold ut til land er i sikte. Tre treff og skipet tåler ikke mer.",
    "perdeu": "Isen vant overfarten",
    "v1": "Land i sikte!",
    "v2": "Sagaene forteller at Gudrid krysset Atlanterhavet til Grønland og Vinland. Isflakene i spillet er diktet opp.",
    "h1": "Overfart",
    "h2": "Skrog"
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
    var GOAL = 28, HP = 3;
    var x = 0, tx = 0, t = 0, ice = [], sp = 0, hp = HP, inv = 0, kl = 0, kr = 0;
    function sy() { return api.h - 80; }
    function reset() { st = 'play'; x = tx = api.w / 2; t = 0; ice = []; sp = 1; hp = HP; inv = 0; }
    return {
      pausar: function () { kl = kr = 0; },
      dbg: function () { return { st: st, x: x, sy: sy(), hp: hp, t: t, goal: GOAL, w: api.w, ice: ice.map(function (i) { return { x: i.x, y: i.y, r: i.r, vy: i.vy }; }) }; },
      down: function (px) { if (menu()) return; tx = px; },
      move: function (px) { if (st === 'play') tx = px; },
      key: function (c, d) { if (c === 'ArrowLeft' || c === 'KeyA') kl = d ? 1 : 0; else if (c === 'ArrowRight' || c === 'KeyD') kr = d ? 1 : 0; else if (d && st !== 'play' && (c === 'Space' || c === 'Enter')) menu(); },
      update: function (dt) {
        if (st !== 'play') return;
        t += dt; if (inv > 0) inv -= dt;
        tx = Math.max(30, Math.min(api.w - 30, tx + (kr - kl) * 380 * dt));
        var d = tx - x, m = 360 * dt; x += Math.abs(d) < m ? d : (d > 0 ? m : -m);
        sp -= dt; if (sp <= 0) { sp = Math.max(0.5, 0.95 - t * 0.012); ice.push({ x: Math.random() < 0.4 ? Math.max(30, Math.min(api.w - 30, x + (Math.random() - 0.5) * 120)) : 30 + Math.random() * (api.w - 60), y: -40, r: 18 + Math.random() * 16, vy: 130 + t * 2.5 }); }
        for (var i = ice.length - 1; i >= 0; i--) {
          var c = ice[i]; c.y += c.vy * dt;
          if (c.y > api.h + 50) { ice.splice(i, 1); continue; }
          if (inv <= 0 && Math.hypot(c.x - x, c.y - sy()) < c.r + 13) { hp--; inv = 1.2; ice.splice(i, 1); if (hp <= 0) { st = 'lose'; return; } }
        }
        if (t >= GOAL) st = 'win';
      },
      draw: function () {
        var W = api.w, H = api.h;
        bg('#1d3a55', '#0e2236');
        g.strokeStyle = 'rgba(255,255,255,.08)'; g.lineWidth = 2; for (var k = 0; k < 8; k++) { g.beginPath(); g.moveTo(0, (k * 97 + t * 40) % H); g.lineTo(W, (k * 97 + t * 40) % H + 12); g.stroke(); }
        ice.forEach(function (c) { g.fillStyle = '#e6f3fb'; g.beginPath(); g.moveTo(c.x - c.r, c.y + c.r * 0.4); g.lineTo(c.x - c.r * 0.5, c.y - c.r); g.lineTo(c.x + c.r * 0.3, c.y - c.r * 0.7); g.lineTo(c.x + c.r, c.y + c.r * 0.5); g.lineTo(c.x, c.y + c.r); g.fill(); });
        if (inv <= 0 || Math.floor(api.clock * 10) % 2) { var Y = sy(); g.fillStyle = '#8a5a2a'; g.beginPath(); g.moveTo(x - 30, Y); g.lineTo(x + 30, Y); g.lineTo(x + 18, Y + 20); g.lineTo(x - 18, Y + 20); g.fill(); g.fillStyle = '#c0392b'; g.fillRect(x - 3, Y - 40, 6, 40); g.fillRect(x - 24, Y - 38, 48, 26); g.fillStyle = '#f3ecd2'; g.fillRect(x - 24, Y - 28, 48, 8); }
        g.fillStyle = 'rgba(255,255,255,.2)'; g.fillRect(0, H - 8, W, 8); g.fillStyle = '#ffd88a'; g.fillRect(0, H - 8, W * Math.min(1, t / GOAL), 8);
        hud(T.h1 + ' ' + Math.round(Math.min(1, t / GOAL) * 100) + '%', T.h2 + ' ' + hp + '/' + HP, hp < HP);
        fim(st);
      }
    };
  }
});
