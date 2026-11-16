/* Assandun, 1016 — ache os grupos escondidos no campo de seis por seis casas. */
BTJogo.registrar({
  canvas: 'jogo-assandun',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O campo de Assandun",
    "sub": "Três grupos de guerreiros (de 2, 3 e 3 casas) estão escondidos num campo de 6 por 6 casas. Toque numa casa para disparar: uma mancha vermelha é acerto, um ponto é água. Ache os três grupos com no máximo 24 disparos.",
    "perdeu": "Os disparos acabaram",
    "v1": "Você achou todos os grupos!",
    "v2": "Em Assandun, em 1016, Canuto venceu Edmundo Ironside. O campo, os grupos e os disparos são invenção do jogo.",
    "h1": "Achados",
    "h2": "Disparos"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The field of Assandun",
    "sub": "Three groups of warriors (of 2, 3 and 3 squares) are hidden in a 6-by-6 field. Tap a square to fire: a red mark is a hit, a dot is water. Find all three groups in 24 shots or fewer.",
    "perdeu": "The shots ran out",
    "v1": "You found every group!",
    "v2": "At Assandun, in 1016, Cnut defeated Edmund Ironside. The field, the groups and the shots are made up for the game.",
    "h1": "Found",
    "h2": "Shots"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Marken ved Assandun",
    "sub": "Tre grupper med krigere (på 2, 3 og 3 ruter) er skjult i en mark på 6 ganger 6 ruter. Trykk på en rute for å skyte: et rødt merke er treff, en prikk er vann. Finn alle tre gruppene på høyst 24 skudd.",
    "perdeu": "Skuddene tok slutt",
    "v1": "Du fant alle gruppene!",
    "v2": "Ved Assandun i 1016 beseiret Knut Edmund Jernside. Marken, gruppene og skuddene er diktet opp for spillet.",
    "h1": "Funnet",
    "h2": "Skudd"
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
    var N = 6, SH = [2, 3, 3], MAXS = 24;
    var ships = [], shots = [], used = 0, found = 0, cur = 0;
    function lay() { var W = api.w, H = api.h, cs = Math.max(40, Math.min((W - 24) / N, (H - 170) / N, 80)); return { cs: cs, x: (W - cs * N) / 2, y: Math.max(90, (H - cs * N) / 2 + 8) }; }
    function place() { for (var tr = 0; tr < 500; tr++) { var occ = {}, ss = [], ok = true; for (var k = 0; k < SH.length && ok; k++) { var done = false; for (var a = 0; a < 80 && !done; a++) { var h = Math.random() < 0.5, x = Math.floor(Math.random() * (h ? N - SH[k] + 1 : N)), y = Math.floor(Math.random() * (h ? N : N - SH[k] + 1)), cells = [], good = true; for (var j = 0; j < SH[k]; j++) { var c = (h ? y : y + j) * N + (h ? x + j : x); if (occ[c]) good = false; cells.push(c); } if (good) { cells.forEach(function (c) { occ[c] = 1; }); ss.push(cells); done = true; } } if (!done) ok = false; } if (ok) { ships = ss; return; } } }
    function setup() { place(); shots = []; for (var i = 0; i < N * N; i++) shots.push(0); used = 0; found = 0; }
    function reset() { setup(); st = 'play'; }
    function sunk(s) { return s.every(function (c) { return shots[c] === 2; }); }
    function fire(i) { if (st !== 'play' || shots[i]) return; used++; var hit = ships.some(function (s) { return s.indexOf(i) >= 0; }); shots[i] = hit ? 2 : 1; if (api.nota) api.nota(hit ? 520 : 200, 0.08, 'triangle', 0.05); found = ships.filter(sunk).length; if (found >= ships.length) { st = 'win'; return; } if (used >= MAXS) st = 'lose'; }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, shots: shots.slice(), ships: ships.map(function (s) { return s.slice(); }), used: used, max: MAXS, found: found, pos: function (i) { return { x: L.x + (i % N + 0.5) * L.cs, y: L.y + (Math.floor(i / N) + 0.5) * L.cs }; } }; },
      down: function (x, y) { if (menu()) return; var L = lay(), c = Math.floor((x - L.x) / L.cs), r = Math.floor((y - L.y) / L.cs); if (r >= 0 && c >= 0 && r < N && c < N) { cur = r * N + c; fire(cur); } },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'ArrowLeft') cur = cur % N ? cur - 1 : cur + N - 1; else if (k === 'ArrowRight') cur = cur % N < N - 1 ? cur + 1 : cur - N + 1; else if (k === 'ArrowUp') cur = (cur + N * N - N) % (N * N); else if (k === 'ArrowDown') cur = (cur + N) % (N * N); else if (k === 'Space' || k === 'Enter') fire(cur); },
      update: function () {},
      draw: function () {
        var L = lay(), W = api.w, H = api.h, i;
        bg('#1d2a1a', '#060a05');
        g.fillStyle = 'rgba(0,0,0,.35)'; rr(L.x - 5, L.y - 5, L.cs * N + 10, L.cs * N + 10, 10); g.fill();
        for (i = 0; i < N * N; i++) { var x = L.x + (i % N) * L.cs, y = L.y + Math.floor(i / N) * L.cs; g.fillStyle = 'rgba(160,190,120,.18)'; g.fillRect(x + 1, y + 1, L.cs - 2, L.cs - 2);
          if (shots[i] === 1) { g.fillStyle = 'rgba(255,255,255,.5)'; g.beginPath(); g.arc(x + L.cs / 2, y + L.cs / 2, L.cs * 0.1, 0, 6.283); g.fill(); }
          if (shots[i] === 2) { g.fillStyle = '#c0392b'; rr(x + L.cs * 0.14, y + L.cs * 0.14, L.cs * 0.72, L.cs * 0.72, 8); g.fill(); g.fillStyle = '#ffd88a'; g.beginPath(); g.arc(x + L.cs / 2, y + L.cs / 2, L.cs * 0.1, 0, 6.283); g.fill(); }
          if (cur === i && st === 'play') { g.strokeStyle = 'rgba(255,216,138,.7)'; g.lineWidth = 2; g.strokeRect(x + 2, y + 2, L.cs - 4, L.cs - 4); } }
        bar(W / 2 - 110, H - 14, 220, 5, (MAXS - used) / MAXS, MAXS - used < 6 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + found + '/' + ships.length, T.h2 + ' ' + used + '/' + MAXS, MAXS - used < 6);
        fim(st);
      }
    };
  }
});
