/* Peças de Lewis — passeie de cavalo por todas as casas. */
BTJogo.registrar({
  canvas: 'jogo-lewis',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O passeio do cavalo",
    "sub": "O cavalo anda em L: duas casas numa direção e uma na outra. Toque numa casa marcada para saltar até ela. Visite todas as 25 casas, sem repetir nenhuma. Para voltar um salto, toque no cavalo (ou use Backspace). O tempo é limitado.",
    "perdeu": "O tempo acabou antes do fim do passeio",
    "v1": "O cavalo visitou todas as casas!",
    "v2": "Entre as peças de Lewis há cavaleiros e peões esculpidos em marfim de morsa. O passeio no tabuleiro é invenção.",
    "h1": "Casas",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The knight's tour",
    "sub": "The knight moves in an L: two squares one way and one the other. Tap a marked square to jump there. Visit all 25 squares, without repeating any. To undo a jump, tap the knight (or press Backspace). Time is limited.",
    "perdeu": "Time ran out before the tour ended",
    "v1": "The knight visited every square!",
    "v2": "Among the Lewis chessmen are knights and pawns carved in walrus ivory. The tour on the board is made up.",
    "h1": "Squares",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Springerens tur",
    "sub": "Springeren går i L: to ruter én vei og én rute til siden. Trykk på en markert rute for å hoppe dit. Besøk alle 25 rutene uten å gjenta noen. For å angre et hopp, trykk på springeren (eller bruk Backspace). Tiden er begrenset.",
    "perdeu": "Tiden gikk ut før turen var ferdig",
    "v1": "Springeren besøkte alle rutene!",
    "v2": "Blant Lewis-sjakkbrikkene er det riddere og bønder skåret i hvalrosstann. Turen på brettet er diktet opp.",
    "h1": "Ruter",
    "h2": "Tid"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "El paseo del caballo",
    "sub": "El caballo se mueve en L: dos casillas en una dirección y una en la otra. Toca una casilla marcada para saltar hasta ella. Visita las 25 casillas, sin repetir ninguna. Para retroceder un salto, toca el caballo (o usa Retroceso). El tiempo es limitado.",
    "perdeu": "El tiempo se acabó antes del final del paseo",
    "v1": "¡El caballo visitó todas las casillas!",
    "v2": "Entre las piezas de Lewis hay caballeros y peones tallados en marfil de morsa. El paseo por el tablero es invención.",
    "h1": "Casillas",
    "h2": "Tiempo"
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
    var N = 5, LIM = 150;
    var vis = [], path = [], tmr = LIM, pop = 0, cur = 12, bump = 0;
    var MV = [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]];
    function lay() { var W = api.w, H = api.h, cs = Math.min((W - 30) / N, (H - 180) / N, 70); return { cs: cs, x: (W - cs * N) / 2, y: Math.max(90, (H - cs * N) / 2 + 12) }; }
    function opts(i) { var r = Math.floor(i / N), c = i % N, o = []; MV.forEach(function (m) { var a = r + m[0], b = c + m[1]; if (a >= 0 && a < N && b >= 0 && b < N && !vis[a * N + b]) o.push(a * N + b); }); return o; }
    function setup() { vis = []; for (var i = 0; i < N * N; i++) vis.push(0); path = [0]; vis[0] = 1; tmr = LIM; cur = 12; bump = 0; }
    function reset() { setup(); st = 'play'; }
    function jump(k) {
      if (st !== 'play') return; var last = path[path.length - 1];
      if (k === last) { if (path.length > 1) { vis[last] = 0; path.pop(); } return; }
      if (opts(last).indexOf(k) < 0) { bump = 0.3; return; }
      path.push(k); vis[k] = 1; if (api.nota) api.nota(280 + path.length * 12, 0.06, 'triangle', 0.05);
      if (path.length === N * N) st = 'win';
    }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, vis: vis.slice(), path: path.slice(), N: N, x: L.x, y: L.y, cs: L.cs, opts: opts, tmr: tmr }; },
      down: function (x, y) { if (menu()) return; var L = lay(), c = Math.floor((x - L.x) / L.cs), r = Math.floor((y - L.y) / L.cs); if (c >= 0 && c < N && r >= 0 && r < N) { cur = r * N + c; jump(cur); } },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'Backspace' || k === 'KeyZ') { var last = path[path.length - 1]; if (path.length > 1) { vis[last] = 0; path.pop(); } return; }
        var r = Math.floor(cur / N), c = cur % N; if (k === 'ArrowUp' || k === 'KeyW') r = Math.max(0, r - 1); else if (k === 'ArrowDown' || k === 'KeyS') r = Math.min(N - 1, r + 1); else if (k === 'ArrowLeft' || k === 'KeyA') c = Math.max(0, c - 1); else if (k === 'ArrowRight' || k === 'KeyD') c = Math.min(N - 1, c + 1); else if (k === 'Space' || k === 'Enter') { jump(cur); return; } cur = r * N + c; },
      update: function (dt) { pop += dt; if (bump > 0) bump -= dt; if (st !== 'play') return; tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; } },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), r, c, i, last = path[path.length - 1], op = opts(last);
        bg('#2a2230', '#0c0a10');
        for (r = 0; r < N; r++) for (c = 0; c < N; c++) { i = r * N + c; var x = L.x + c * L.cs, y = L.y + r * L.cs; g.fillStyle = vis[i] ? ((r + c) % 2 ? 'rgba(255,216,138,.55)' : 'rgba(255,216,138,.7)') : ((r + c) % 2 ? 'rgba(255,255,255,.10)' : 'rgba(255,255,255,.20)'); g.fillRect(x, y, L.cs - 1, L.cs - 1);
          if (vis[i]) txt(String(path.indexOf(i) + 1), x + L.cs / 2, y + L.cs * 0.62, L.cs * 0.34, 'rgba(0,0,0,.5)');
          if (st === 'play' && op.indexOf(i) >= 0) { g.fillStyle = 'rgba(120,230,150,' + (0.45 + 0.2 * Math.sin(pop * 5)) + ')'; g.beginPath(); g.arc(x + L.cs / 2, y + L.cs / 2, L.cs * 0.18, 0, 6.283); g.fill(); }
          if (i === cur && st === 'play') { g.strokeStyle = '#fff'; g.lineWidth = 2; g.strokeRect(x + 2, y + 2, L.cs - 5, L.cs - 5); } }
        var lx = L.x + (last % N + 0.5) * L.cs, ly = L.y + (Math.floor(last / N) + 0.5) * L.cs; txt('♞', lx, ly + L.cs * 0.3, L.cs * 0.8, bump > 0 || (!op.length && st === 'play') ? '#c0392b' : '#fff');
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 30 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + path.length + '/' + (N * N), T.h2 + ' ' + Math.ceil(tmr), false);
        fim(st);
      }
    };
  }
});
