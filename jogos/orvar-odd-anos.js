/* Os anos de Odd — junte números iguais até somar a idade certa. */
BTJogo.registrar({
  canvas: 'jogo-orvar',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os anos de Odd",
    "sub": "Örvar-Oddr viveu muitos anos. Deslize o dedo (ou use as setas) para mover todos os números. Quando dois iguais se encontram, eles se somam. Chegue ao número 128 antes que o tempo acabe ou que o tabuleiro encha.",
    "perdeu": "Os anos se acabaram",
    "v1": "Odd chegou aos 128!",
    "v2": "A tradição islandesa dá a Örvar-Oddr cerca de 300 anos de vida. Os números do jogo são invenção.",
    "h1": "Maior",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Odd's years",
    "sub": "Örvar-Oddr lived many years. Swipe (or use the arrows) to move all the numbers. When two equal ones meet, they add up. Reach the number 128 before time runs out or the board fills up.",
    "perdeu": "The years ran out",
    "v1": "Odd reached 128!",
    "v2": "Icelandic tradition gives Örvar-Oddr about 300 years of life. The numbers in the game are made up.",
    "h1": "Highest",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Odds år",
    "sub": "Örvar-Oddr levde mange år. Sveip (eller bruk piltastene) for å flytte alle tallene. Når to like møtes, legges de sammen. Nå tallet 128 før tiden går ut eller brettet fylles.",
    "perdeu": "Årene tok slutt",
    "v1": "Odd nådde 128!",
    "v2": "Islandsk tradisjon gir Örvar-Oddr omtrent 300 års liv. Tallene i spillet er diktet opp.",
    "h1": "Høyest",
    "h2": "Tid"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "Los años de Odd",
    "sub": "Örvar-Oddr vivió muchos años. Desliza el dedo (o usa las flechas) para mover todos los números. Cuando dos iguales se encuentran, se suman. Llega al número 128 antes de que se acabe el tiempo o de que se llene el tablero.",
    "perdeu": "Los años se acabaron",
    "v1": "¡Odd llegó a los 128!",
    "v2": "La tradición islandesa atribuye a Örvar-Oddr unos 300 años de vida. Los números del juego son invención.",
    "h1": "Mayor",
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
    var N = 4, GOAL = 128, LIM = 200;
    var b = [], tmr = LIM, sx = 0, sy = 0, down0 = false, pop = [], mx = 2;
    var COLS = { 2: '#e6d9b8', 4: '#e8c98a', 8: '#f0a05a', 16: '#e87a4a', 32: '#e0553a', 64: '#d03a3a', 128: '#e8c04a', 128: '#ffd84a' };
    function lay() { var W = api.w, H = api.h, S = Math.min(W - 30, H - 150, 400); return { S: S, c: S / N, x: (W - S) / 2, y: Math.max(70, (H - S) / 2 + 18) }; }
    function spawn() { var e = [], r, c; for (r = 0; r < N; r++) for (c = 0; c < N; c++) if (!b[r][c]) e.push([r, c]); if (!e.length) return; var p = e[Math.floor(Math.random() * e.length)]; b[p[0]][p[1]] = Math.random() < 0.9 ? 2 : 4; pop[p[0] * N + p[1]] = 0.2; }
    function setup() { b = []; pop = []; for (var r = 0; r < N; r++) { b.push([]); for (var c = 0; c < N; c++) b[r].push(0); } spawn(); spawn(); tmr = LIM; mx = 2; }
    function reset() { setup(); st = 'play'; }
    function slide(line) { var a = line.filter(function (v) { return v; }), o = [], i; for (i = 0; i < a.length; i++) { if (a[i] === a[i + 1]) { o.push(a[i] * 2); i++; } else o.push(a[i]); } while (o.length < N) o.push(0); return o; }
    function apply(dir, bb) {
      var r, c, ch = false, nb = [];
      for (r = 0; r < N; r++) nb.push(bb[r].slice());
      for (var i = 0; i < N; i++) {
        var line = []; for (var k = 0; k < N; k++) line.push(dir === 0 ? nb[i][k] : dir === 1 ? nb[i][N - 1 - k] : dir === 2 ? nb[k][i] : nb[N - 1 - k][i]);
        var o = slide(line);
        for (k = 0; k < N; k++) { var v = o[k]; if (dir === 0) { if (nb[i][k] !== v) ch = true; nb[i][k] = v; } else if (dir === 1) { if (nb[i][N - 1 - k] !== v) ch = true; nb[i][N - 1 - k] = v; } else if (dir === 2) { if (nb[k][i] !== v) ch = true; nb[k][i] = v; } else { if (nb[N - 1 - k][i] !== v) ch = true; nb[N - 1 - k][i] = v; } }
      }
      return { b: nb, ch: ch };
    }
    function canMove() { for (var d = 0; d < 4; d++) if (apply(d, b).ch) return true; return false; }
    function mv(d) {
      if (st !== 'play') return; var r = apply(d, b); if (!r.ch) return; b = r.b; spawn(); if (api.nota) api.nota(260, 0.04, 'triangle', 0.04);
      var m = 0; b.forEach(function (row) { row.forEach(function (v) { if (v > m) m = v; }); }); mx = m;
      if (m >= GOAL) st = 'win'; else if (!canMove()) st = 'lose';
    }
    setup();
    return {
      pausar: function () { down0 = false; },
      dbg: function () { return { st: st, b: b.map(function (r) { return r.slice(); }), mx: mx, tmr: tmr }; },
      down: function (x, y) { if (menu()) return; down0 = true; sx = x; sy = y; },
      up: function () { },
      move: function (x, y, pr) { if (!down0 || pr === false) return; var dx = x - sx, dy = y - sy; if (Math.abs(dx) > 30 || Math.abs(dy) > 30) { if (Math.abs(dx) > Math.abs(dy)) mv(dx < 0 ? 0 : 1); else mv(dy < 0 ? 2 : 3); down0 = false; } },
      key: function (c, d) {
        if (!d) return; if (st !== 'play') { menu(); return; }
        if (c === 'ArrowLeft' || c === 'KeyA') mv(0); else if (c === 'ArrowRight' || c === 'KeyD') mv(1); else if (c === 'ArrowUp' || c === 'KeyW') mv(2); else if (c === 'ArrowDown' || c === 'KeyS') mv(3);
      },
      update: function (dt) { for (var k in pop) if (pop[k] > 0) pop[k] -= dt; if (st === 'play') { tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; } } },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), r, c;
        bg('#1b2230', '#0b0f17');
        g.fillStyle = 'rgba(255,255,255,.07)'; rr(L.x - 6, L.y - 6, L.S + 12, L.S + 12, 12); g.fill();
        for (r = 0; r < N; r++) for (c = 0; c < N; c++) {
          var v = b[r][c], x = L.x + c * L.c + 4, y = L.y + r * L.c + 4, s = L.c - 8, k = pop[r * N + c] > 0 ? 1 - pop[r * N + c] : 1;
          g.fillStyle = v ? (COLS[v] || '#ffd84a') : 'rgba(255,255,255,.06)'; var sc = v ? (0.8 + 0.2 * Math.min(1, k * 3)) : 1; rr(x + s * (1 - sc) / 2, y + s * (1 - sc) / 2, s * sc, s * sc, 10); g.fill();
          if (v) txt(String(v), x + s / 2, y + s / 2 + (v > 99 ? 8 : 10), v > 99 ? 24 : 30, v >= 8 ? '#fff6e0' : '#3a2a14');
        }
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 40 ? '#c0392b' : '#8ac0e8');
        hud(T.h1 + ' ' + mx + '/' + GOAL, T.h2 + ' ' + Math.ceil(tmr), false);
        fim(st);
      }
    };
  }
});
