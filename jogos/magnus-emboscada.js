/* Magnus Pés-Descalços, Ulster 1103 — atravesse o campo de emboscadas. */
BTJogo.registrar({
  canvas: 'jogo-magnus-1103',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O campo de emboscadas",
    "sub": "Toque numa casa para abri-la. Cada número diz quantas das 8 casas vizinhas escondem uma emboscada. Abra as 54 casas seguras sem pisar numa emboscada. Use o botão ⚑ para marcar casas suspeitas.",
    "perdeu": "Você caiu numa emboscada",
    "v1": "Você atravessou o campo!",
    "v2": "Magnus Olafsson foi morto numa emboscada na Irlanda em 1103. O campo de números é invenção.",
    "h1": "Seguras",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The ambush field",
    "sub": "Tap a cell to open it. Each number tells how many of the 8 neighbouring cells hide an ambush. Open all 54 safe cells without stepping on an ambush. Use the ⚑ button to mark suspicious cells.",
    "perdeu": "You fell into an ambush",
    "v1": "You crossed the field!",
    "v2": "Magnus Olafsson was killed in an ambush in Ireland in 1103. The number field is made up.",
    "h1": "Safe",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Bakholdsfeltet",
    "sub": "Trykk på en rute for å åpne den. Hvert tall forteller hvor mange av de 8 nabo-rutene som skjuler et bakhold. Åpne alle 54 trygge ruter uten å tråkke på et bakhold. Bruk ⚑-knappen for å merke mistenkelige ruter.",
    "perdeu": "Du gikk i en felle",
    "v1": "Du krysset feltet!",
    "v2": "Magnus Olavsson ble drept i et bakhold i Irland i 1103. Tallfeltet er diktet opp.",
    "h1": "Trygge",
    "h2": "Tid"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "El campo de emboscadas",
    "sub": "Toca una casilla para abrirla. Cada número dice cuántas de las 8 casillas vecinas esconden una emboscada. Abre las 54 casillas seguras sin pisar una emboscada. Usa el botón ⚑ para marcar casillas sospechosas.",
    "perdeu": "Caíste en una emboscada",
    "v1": "¡Cruzaste el campo!",
    "v2": "Magnus Olafsson murió en una emboscada en Irlanda en 1103. El campo de números es un invento.",
    "h1": "Seguras",
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
    var N = 8, NM = 10, LIM = 240;
    var mine = null, rev = [], flag = [], nsafe = N * N - NM, opened = 0, tmr = LIM, fmode = false, hit = null, cur = { r: 0, c: 0 };
    function lay() { var W = api.w, H = api.h, cs = Math.max(34, Math.min((W - 24) / N, (H - 190) / N, 62)); return { cs: cs, x: (W - cs * N) / 2, y: Math.max(86, (H - cs * N) / 2 - 6), bx: W / 2 - 40, by: 0 }; }
    function btn() { var L = lay(); return { x: api.w / 2 - 42, y: L.y + L.cs * N + 16, w: 84, h: 38 }; }
    function setup() { mine = null; rev = []; flag = []; for (var r = 0; r < N; r++) { rev.push(new Array(N).fill(false)); flag.push(new Array(N).fill(false)); } opened = 0; tmr = LIM; fmode = false; hit = null; }
    function reset() { setup(); st = 'play'; }
    function nb(r, c, f) { for (var a = -1; a <= 1; a++) for (var b = -1; b <= 1; b++) { if (!a && !b) continue; var y = r + a, x = c + b; if (y >= 0 && x >= 0 && y < N && x < N) f(y, x); } }
    function cnt(r, c) { var n = 0; nb(r, c, function (y, x) { if (mine[y][x]) n++; }); return n; }
    function place(r0, c0) { mine = []; for (var r = 0; r < N; r++) mine.push(new Array(N).fill(false)); var k = 0; while (k < NM) { var r1 = Math.floor(Math.random() * N), c1 = Math.floor(Math.random() * N); if (mine[r1][c1] || (Math.abs(r1 - r0) <= 1 && Math.abs(c1 - c0) <= 1)) continue; mine[r1][c1] = true; k++; } }
    function open(r, c) { if (rev[r][c] || flag[r][c]) return; rev[r][c] = true; opened++; if (cnt(r, c) === 0) nb(r, c, function (y, x) { open(y, x); }); }
    function tap(r, c) { if (st !== 'play') return; if (fmode) { if (!rev[r][c]) flag[r][c] = !flag[r][c]; return; } if (flag[r][c] || rev[r][c]) return; if (!mine) place(r, c); if (mine[r][c]) { hit = { r: r, c: c }; st = 'lose'; if (api.nota) api.nota(100, 0.3, 'sawtooth', 0.08); return; } open(r, c); if (api.nota) api.nota(380, 0.04, 'triangle', 0.04); if (opened >= nsafe) { st = 'win'; if (api.nota) api.nota(700, 0.2, 'triangle', 0.06); } }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, mine: mine, rev: rev.map(function (r) { return r.slice(); }), opened: opened, nsafe: nsafe, tmr: tmr, fmode: fmode, pos: function (r, c) { return { x: L.x + (c + 0.5) * L.cs, y: L.y + (r + 0.5) * L.cs }; } }; },
      down: function (x, y) { if (menu()) return; var L = lay(), b = btn(); if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) { fmode = !fmode; return; } var c = Math.floor((x - L.x) / L.cs), r = Math.floor((y - L.y) / L.cs); if (r >= 0 && c >= 0 && r < N && c < N) { cur = { r: r, c: c }; tap(r, c); } },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'ArrowUp') cur.r = (cur.r + N - 1) % N; else if (k === 'ArrowDown') cur.r = (cur.r + 1) % N; else if (k === 'ArrowLeft') cur.c = (cur.c + N - 1) % N; else if (k === 'ArrowRight') cur.c = (cur.c + 1) % N; else if (k === 'Space' || k === 'Enter') tap(cur.r, cur.c); else if (k === 'KeyF') fmode = !fmode; },
      update: function (dt) { if (st !== 'play') return; tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; } },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), r, c, b = btn();
        bg('#2a2418', '#0a0804');
        for (r = 0; r < N; r++) for (c = 0; c < N; c++) { var x = L.x + c * L.cs, y = L.y + r * L.cs, o = rev[r][c];
          g.fillStyle = o ? 'rgba(255,255,255,.05)' : 'rgba(150,170,110,.55)'; rr(x + 1.5, y + 1.5, L.cs - 3, L.cs - 3, 5); g.fill();
          if (o && mine) { var n = cnt(r, c); if (n) txt(String(n), x + L.cs / 2, y + L.cs * 0.68, L.cs * 0.5, ['', '#7ab0ff', '#7fd08a', '#ff9a7a', '#c08aff', '#ffd88a', '#ffd88a', '#fff', '#fff'][n]); }
          else if (flag[r][c]) txt('⚑', x + L.cs / 2, y + L.cs * 0.7, L.cs * 0.5, '#ffd88a');
          if (st === 'lose' && mine && mine[r][c]) txt('✖', x + L.cs / 2, y + L.cs * 0.7, L.cs * 0.5, hit && hit.r === r && hit.c === c ? '#ff4a3a' : '#c0392b');
          if (cur.r === r && cur.c === c && st === 'play') { g.strokeStyle = 'rgba(255,255,255,.4)'; g.lineWidth = 2; g.strokeRect(x + 3, y + 3, L.cs - 6, L.cs - 6); } }
        g.fillStyle = fmode ? '#ffd88a' : 'rgba(255,255,255,.14)'; rr(b.x, b.y, b.w, b.h, 10); g.fill(); txt('⚑', b.x + b.w / 2, b.y + b.h * 0.72, 22, fmode ? '#2a1a08' : '#ffd88a');
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 40 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + opened + '/' + nsafe, T.h2 + ' ' + Math.ceil(tmr), false);
        fim(st);
      }
    };
  }
});
