/* A maré de Clontarf — afunde os navios que fogem pelo estuário. */
BTJogo.registrar({
  canvas: 'jogo-clontarf',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A maré de Clontarf",
    "sub": "Os navios nórdicos fogem pelo estuário com a maré. Toque numa casa da água para atirar uma flecha incendiária: erro, acerto ou navio afundado. Afunde os três navios, de quatro, três e dois quadrados. Na flecha perdida de número vinte e cinco, a maré leva a frota.",
    "perdeu": "A maré levou a frota",
    "v1": "Os navios foram a pique!",
    "v2": "A batalha de Clontarf foi travada em 1014, perto de Dublin. A caça aos navios é invenção do jogo.",
    "h1": "Navios",
    "h2": "Falhas"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The tide at Clontarf",
    "sub": "The Norse ships flee down the estuary with the tide. Tap a square of water to fire a burning arrow: miss, hit or sunk. Sink all three ships, of four, three and two squares. On the twenty-fifth missed arrow, the tide carries the fleet away.",
    "perdeu": "The tide carried the fleet away",
    "v1": "The ships went down!",
    "v2": "The Battle of Clontarf was fought in 1014, near Dublin. The ship hunt is made up for the game.",
    "h1": "Ships",
    "h2": "Misses"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Tidevannet ved Clontarf",
    "sub": "De norrøne skipene flykter nedover elvemunningen med tidevannet. Trykk på en rute med vann for å skyte en brennende pil: bom, treff eller senket. Senk alle tre skipene, på fire, tre og to ruter. Ved den tjuefemte bommen tar tidevannet flåten med seg.",
    "perdeu": "Tidevannet tok flåten med seg",
    "v1": "Skipene gikk ned!",
    "v2": "Slaget ved Clontarf stod i 1014, nær Dublin. Skipsjakten er diktet opp for spillet.",
    "h1": "Skip",
    "h2": "Feilskudd"
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
    var N = 7, LENS = [4, 3, 2], MAXF = 25;
    var ships = [], shot = [], sunk = 0, miss = 0, cur = [3, 3], last = null, fl = 0;
    function lay() { var S = Math.min(api.w - 30, api.h - 120, 400); return { S: S, c: S / N, x: (api.w - S) / 2, y: Math.max(68, (api.h - S) / 2 + 10) }; }
    function place() {
      ships = []; var occ = {};
      LENS.forEach(function (len) {
        for (var tries = 0; tries < 500; tries++) {
          var hz = Math.random() < 0.5, r = Math.floor(Math.random() * (hz ? N : N - len + 1)), c = Math.floor(Math.random() * (hz ? N - len + 1 : N)), cells = [], ok = true;
          for (var i = 0; i < len; i++) { var rr2 = r + (hz ? 0 : i), cc = c + (hz ? i : 0); if (occ[rr2 * N + cc]) ok = false; cells.push(rr2 * N + cc); }
          if (ok) { cells.forEach(function (k) { occ[k] = 1; }); ships.push({ cells: cells, hits: 0 }); break; }
        }
      });
    }
    function setup() { place(); shot = []; for (var i = 0; i < N * N; i++) shot.push(0); sunk = 0; miss = 0; cur = [3, 3]; last = null; fl = 0; }
    function reset() { setup(); st = 'play'; }
    function fire(r, c) {
      if (st !== 'play') return; var k = r * N + c; if (shot[k]) return; var s = null; ships.forEach(function (x) { if (x.cells.indexOf(k) >= 0) s = x; });
      if (s) { shot[k] = 2; s.hits++; last = { r: r, c: c, h: true }; if (s.hits === s.cells.length) { s.sunk = true; sunk++; if (api.nota) api.nota(220, 0.25, 'sawtooth', 0.07); } else if (api.nota) api.nota(520, 0.08, 'triangle', 0.06); if (sunk >= ships.length) st = 'win'; }
      else { shot[k] = 1; miss++; last = { r: r, c: c, h: false }; if (api.nota) api.nota(160, 0.06, 'sine', 0.04); if (miss >= MAXF) st = 'lose'; }
    }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, ships: ships.map(function (s) { return s.cells.slice(); }), shot: shot.slice(), sunk: sunk, miss: miss, x: L.x, y: L.y, c: L.c, N: N }; },
      down: function (x, y) { if (menu()) return; var L = lay(), c = Math.floor((x - L.x) / L.c), r = Math.floor((y - L.y) / L.c); if (c >= 0 && c < N && r >= 0 && r < N) { cur = [r, c]; fire(r, c); } },
      key: function (c, d) {
        if (!d) return; if (c === 'ArrowLeft' || c === 'KeyA') cur[1] = Math.max(0, cur[1] - 1); else if (c === 'ArrowRight' || c === 'KeyD') cur[1] = Math.min(N - 1, cur[1] + 1); else if (c === 'ArrowUp' || c === 'KeyW') cur[0] = Math.max(0, cur[0] - 1); else if (c === 'ArrowDown' || c === 'KeyS') cur[0] = Math.min(N - 1, cur[0] + 1);
        else if (c === 'Space' || c === 'Enter') { if (st !== 'play') menu(); else fire(cur[0], cur[1]); }
      },
      update: function (dt) { fl += dt; },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), r, c, i;
        bg('#16283a', '#08121c');
        g.fillStyle = 'rgba(80,140,200,.18)'; rr(L.x - 8, L.y - 8, L.S + 16, L.S + 16, 10); g.fill();
        for (r = 0; r < N; r++) for (c = 0; c < N; c++) {
          var k = r * N + c, X = L.x + c * L.c, Y = L.y + r * L.c; g.fillStyle = 'rgba(100,160,220,' + (0.16 + 0.05 * Math.sin(fl * 2 + r + c)) + ')'; g.fillRect(X + 2, Y + 2, L.c - 4, L.c - 4);
          if (shot[k] === 1) { g.fillStyle = 'rgba(255,255,255,.45)'; g.beginPath(); g.arc(X + L.c / 2, Y + L.c / 2, L.c * 0.1, 0, 6.29); g.fill(); }
          if (shot[k] === 2) { g.fillStyle = '#d9663a'; g.beginPath(); g.arc(X + L.c / 2, Y + L.c / 2, L.c * 0.3, 0, 6.29); g.fill(); g.fillStyle = '#ffd88a'; g.beginPath(); g.arc(X + L.c / 2, Y + L.c / 2, L.c * 0.14, 0, 6.29); g.fill(); }
        }
        ships.forEach(function (s) { if (!s.sunk) return; s.cells.forEach(function (k) { var X = L.x + (k % N) * L.c, Y = L.y + Math.floor(k / N) * L.c; g.fillStyle = 'rgba(60,40,30,.85)'; rr(X + 4, Y + 4, L.c - 8, L.c - 8, 6); g.fill(); g.fillStyle = '#d9663a'; g.beginPath(); g.arc(X + L.c / 2, Y + L.c / 2, L.c * 0.12, 0, 6.29); g.fill(); }); });
        if (st === 'play') { g.strokeStyle = 'rgba(255,255,255,.8)'; g.lineWidth = 2; g.strokeRect(L.x + cur[1] * L.c + 3, L.y + cur[0] * L.c + 3, L.c - 6, L.c - 6); }
        hud(T.h1 + ' ' + sunk + '/' + ships.length, T.h2 + ' ' + miss + '/' + MAXF, miss > 0);
        fim(st);
      }
    };
  }
});
