/* O Vento Norte — voe pelas nuvens de tempestade. */
BTJogo.registrar({
  canvas: 'jogo-ventonorte',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O Vento Norte",
    "sub": "Toque (ou use a barra de espaço) para o Vento Norte dar um impulso para cima. Passe pelas aberturas entre as nuvens de tempestade sem tocar nelas nem cair no mar. Oito aberturas até o castelo.",
    "perdeu": "O vento perdeu o fôlego",
    "v1": "Castelo à vista!",
    "v2": "No conto, o Vento Norte leva a jovem ao castelo a leste do sol e a oeste da lua. As nuvens do jogo são invenção.",
    "h1": "Aberturas"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The North Wind",
    "sub": "Tap (or press Space) to give the North Wind a lift upward. Fly through the gaps between the storm clouds without touching them or falling into the sea. Eight gaps to the castle.",
    "perdeu": "The wind ran out of breath",
    "v1": "The castle at last!",
    "v2": "In the tale, the North Wind carries the girl to the castle east of the sun and west of the moon. The clouds in the game are made up.",
    "h1": "Gaps"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Nordavinden",
    "sub": "Trykk (eller bruk mellomromstasten) for å gi Nordavinden et løft oppover. Fly gjennom åpningene mellom stormskyene uten å røre dem eller falle i havet. Åtte åpninger til slottet.",
    "perdeu": "Vinden gikk tom for pust",
    "v1": "Slottet i sikte!",
    "v2": "I eventyret bærer Nordavinden jenta til slottet østenfor sol og vestenfor måne. Skyene i spillet er diktet opp.",
    "h1": "Åpninger"
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
    var GOAL = 8, GAP = 200, PW = 56, BX = 130, SPD = 135;
    var y = 0, vy = 0, pipes = [], passed = 0, nx = 0, lastc = 0;
    function reset() { st = 'play'; y = api.h / 2; vy = 0; pipes = []; passed = 0; nx = api.w + 80; lastc = api.h / 2; spawnp(); }
    function spawnp() {
      var h = api.h, lo = GAP / 2 + 50, hi = h - GAP / 2 - 60, c = Math.max(lo, Math.min(hi, lastc + (Math.random() - 0.5) * 170)); lastc = c;
      pipes.push({ x: nx, c: c, done: false }); nx += 290;
    }
    function flap() { vy = -280; }
    return {
      pausar: function () {},
      dbg: function () { return { st: st, y: y, vy: vy, passed: passed, gap: GAP, bx: BX, pw: PW, pipes: pipes.map(function (p) { return { x: p.x, c: p.c }; }) }; },
      down: function () { if (menu()) return; flap(); },
      key: function (c, d) { if (!d) return; if (st !== 'play') { if (c === 'Space' || c === 'Enter') menu(); return; } if (c === 'Space' || c === 'ArrowUp' || c === 'KeyW') flap(); },
      update: function (dt) {
        if (st !== 'play') return;
        vy += 680 * dt; y += vy * dt; if (y < 14) { y = 14; if (vy < 0) vy = 0; }
        if (y > api.h - 24) { st = 'lose'; return; }
        pipes.forEach(function (p) { p.x -= SPD * dt; });
        nx -= SPD * dt;
        if (nx < api.w + 60 && passed + pipes.length < GOAL + 1) spawnp();
        for (var i = 0; i < pipes.length; i++) {
          var p = pipes[i];
          if (BX + 13 > p.x - PW / 2 && BX - 13 < p.x + PW / 2 && (y - 13 < p.c - GAP / 2 || y + 13 > p.c + GAP / 2)) { st = 'lose'; return; }
          if (!p.done && p.x + PW / 2 < BX - 13) { p.done = true; passed++; if (passed >= GOAL) { st = 'win'; return; } }
        }
        while (pipes.length && pipes[0].x < -60) pipes.shift();
      },
      draw: function () {
        var W = api.w, H = api.h;
        bg('#2a3a66', '#6a7ca8');
        g.fillStyle = '#1a2a4a'; g.fillRect(0, H - 24, W, 24);
        pipes.forEach(function (p) { g.fillStyle = '#4a4f66'; g.fillRect(p.x - PW / 2, 0, PW, p.c - GAP / 2); g.fillRect(p.x - PW / 2, p.c + GAP / 2, PW, H); g.fillStyle = '#6a7090'; g.fillRect(p.x - PW / 2 - 6, p.c - GAP / 2 - 18, PW + 12, 18); g.fillRect(p.x - PW / 2 - 6, p.c + GAP / 2, PW + 12, 18); });
        g.fillStyle = '#e9f1ff'; g.beginPath(); g.arc(BX, y, 16, 0, 6.29); g.fill(); g.fillStyle = '#2a3a66'; g.beginPath(); g.arc(BX + 5, y - 4, 3, 0, 6.29); g.fill(); g.strokeStyle = '#e9f1ff'; g.lineWidth = 3; g.beginPath(); g.moveTo(BX - 16, y); g.quadraticCurveTo(BX - 36, y + 6 + Math.sin(api.clock * 12) * 4, BX - 52, y + 2); g.stroke();
        hud(T.h1 + ' ' + passed + '/' + GOAL);
        fim(st);
      }
    };
  }
});
