/* Skuldelev — encontre os cinco navios afundados no fiorde. */
BTJogo.registrar({
  canvas: 'jogo-skuldelev',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os cinco navios do fiorde",
    "sub": "Cinco navios estão escondidos na água. Toque numa casa para atirar (ou use as setas e o espaço). Água é água; acerto mostra um casco. Afunde os cinco antes que os tiros acabem.",
    "perdeu": "Os tiros acabaram",
    "v1": "Você achou os cinco navios!",
    "v2": "No fiorde de Roskilde foram achados restos de cinco navios afundados. Os tiros do jogo são invenção.",
    "h1": "Navios",
    "h2": "Tiros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The fjord's five ships",
    "sub": "Five ships are hidden in the water. Tap a cell to shoot (or use the arrows and Space). Water is water; a hit shows a hull. Sink all five before your shots run out.",
    "perdeu": "Your shots ran out",
    "v1": "You found all five ships!",
    "v2": "In Roskilde Fjord the remains of five sunken ships were found. The shots in the game are made up.",
    "h1": "Ships",
    "h2": "Shots"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Fjordens fem skip",
    "sub": "Fem skip er skjult i vannet. Trykk på en rute for å skyte (eller bruk piltastene og mellomrom). Vann er vann; et treff viser et skrog. Senk alle fem før skuddene er brukt opp.",
    "perdeu": "Skuddene var oppbrukt",
    "v1": "Du fant alle fem skipene!",
    "v2": "I Roskildefjorden ble restene av fem senkede skip funnet. Skuddene i spillet er diktet opp.",
    "h1": "Skip",
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
    var N = 8, SHOTS = 46, LENS = [5, 4, 3, 3, 2];
    var sh = [], shots = [], used = 0, sunk = 0, cur = 0, pop = 0, fx = [], ships = [];
    function lay() { var W = api.w, H = api.h, cs = Math.min((W - 30) / N, (H - 170) / N, 54); return { cs: cs, x: (W - cs * N) / 2, y: Math.max(80, (H - cs * N) / 2 + 12) }; }
    function place() { sh = []; for (var i = 0; i < N * N; i++) sh.push(-1); ships = [];
      LENS.forEach(function (len, id) { for (var t = 0; t < 400; t++) { var hz = Math.random() < 0.5, r = Math.floor(Math.random() * (hz ? N : N - len + 1)), c = Math.floor(Math.random() * (hz ? N - len + 1 : N)), ok = true, cl = [], k; for (k = 0; k < len; k++) { var rr2 = hz ? r : r + k, cc2 = hz ? c + k : c; if (sh[rr2 * N + cc2] >= 0) ok = false; cl.push(rr2 * N + cc2); } if (ok) { cl.forEach(function (q) { sh[q] = id; }); ships.push(cl); break; } } }); }
    function setup() { place(); shots = []; for (var i = 0; i < N * N; i++) shots.push(0); used = 0; sunk = 0; cur = 0; fx = []; }
    function reset() { setup(); st = 'play'; }
    function fire(i) {
      if (st !== 'play' || shots[i]) return; shots[i] = sh[i] >= 0 ? 2 : 1; used++; var L = lay(); fx.push({ x: L.x + (i % N + 0.5) * L.cs, y: L.y + (Math.floor(i / N) + 0.5) * L.cs, t: 0.5, h: sh[i] >= 0 });
      if (sh[i] >= 0) { var id = sh[i]; if (ships[id].every(function (q) { return shots[q] === 2; })) { sunk++; if (api.nota) api.nota(660, 0.2, 'triangle', 0.07); } else if (api.nota) api.nota(440, 0.08, 'triangle', 0.05); } else if (api.nota) api.nota(200, 0.05, 'sine', 0.04);
      if (sunk === 5) st = 'win'; else if (used >= SHOTS) st = 'lose';
    }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, shots: shots.slice(), used: used, sunk: sunk, N: N, x: L.x, y: L.y, cs: L.cs, lens: LENS }; },
      down: function (x, y) { if (menu()) return; var L = lay(), c = Math.floor((x - L.x) / L.cs), r = Math.floor((y - L.y) / L.cs); if (c >= 0 && c < N && r >= 0 && r < N) { cur = r * N + c; fire(cur); } },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } var r = Math.floor(cur / N), c = cur % N; if (k === 'ArrowUp' || k === 'KeyW') r = (r + N - 1) % N; else if (k === 'ArrowDown' || k === 'KeyS') r = (r + 1) % N; else if (k === 'ArrowLeft' || k === 'KeyA') c = (c + N - 1) % N; else if (k === 'ArrowRight' || k === 'KeyD') c = (c + 1) % N; else if (k === 'Space' || k === 'Enter') { fire(cur); return; } cur = r * N + c; },
      update: function (dt) { pop += dt; fx = fx.filter(function (f) { f.t -= dt; return f.t > 0; }); },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), r, c, i;
        bg('#0e3048', '#040e18');
        for (r = 0; r < N; r++) for (c = 0; c < N; c++) { i = r * N + c; var s = shots[i], x = L.x + c * L.cs, y = L.y + r * L.cs; g.fillStyle = s === 2 ? '#8a5a3a' : (s === 1 ? 'rgba(90,150,200,.35)' : 'rgba(255,255,255,.07)'); g.fillRect(x + 1.5, y + 1.5, L.cs - 3, L.cs - 3);
          if (s === 2) { g.fillStyle = 'rgba(255,200,120,.8)'; g.fillRect(x + L.cs * 0.2, y + L.cs * 0.38, L.cs * 0.6, L.cs * 0.24); } if (s === 1) txt('·', x + L.cs / 2, y + L.cs * 0.7, L.cs * 0.7, 'rgba(255,255,255,.5)');
          if (i === cur && st === 'play') { g.strokeStyle = '#ffd88a'; g.lineWidth = 3; g.strokeRect(x + 2, y + 2, L.cs - 4, L.cs - 4); } }
        for (i = 0; i < fx.length; i++) { g.strokeStyle = fx[i].h ? 'rgba(255,160,60,' + fx[i].t * 2 + ')' : 'rgba(150,200,255,' + fx[i].t * 2 + ')'; g.lineWidth = 3; g.beginPath(); g.arc(fx[i].x, fx[i].y, L.cs * (1.1 - fx[i].t), 0, 6.283); g.stroke(); }
        ships.forEach(function (cl, id) { if (cl.every(function (q) { return shots[q] === 2; })) { cl.forEach(function (q) { var x = L.x + (q % N) * L.cs, y = L.y + Math.floor(q / N) * L.cs; g.strokeStyle = '#ffd88a'; g.lineWidth = 2; g.strokeRect(x + 3, y + 3, L.cs - 6, L.cs - 6); }); } });
        hud(T.h1 + ' ' + sunk + '/5', T.h2 + ' ' + used + '/' + SHOTS, used > SHOTS - 10);
        fim(st);
      }
    };
  }
});
