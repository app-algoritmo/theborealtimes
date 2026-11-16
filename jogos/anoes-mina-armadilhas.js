/* Os anões (dvergar) — cave a mina guiado pelos números, sem pisar nas armadilhas (invenção). */
BTJogo.registrar({
  canvas: 'jogo-anoes',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A mina dos anões",
    "sub": "Toque numa casa para cavar. Cada número diz quantas das casas vizinhas escondem uma armadilha. Use os números para achar as casas seguras e cave todas. Duas armadilhas pisadas ou 180 segundos acabam o jogo. Use o botão para alternar entre cavar e marcar uma casa. (Teclado: setas movem, Espaço cava, F marca.)",
    "perdeu": "Armadilhas demais ou o tempo acabou",
    "v1": "A mina está limpa!",
    "v2": "Nas fontes nórdicas, os anões são ferreiros de joias e armas dos deuses. A mina e as armadilhas são invenção.",
    "h1": "Casas livres",
    "h2": "Armadilhas",
    "b1": "Cavar",
    "b2": "Marcar"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The dwarfs' mine",
    "sub": "Tap a square to dig. Each number tells how many of the neighbouring squares hide a trap. Use the numbers to find the safe squares and dig them all. Two traps stepped on or 180 seconds end the game. Use the button to switch between digging and marking a square. (Keyboard: arrows move, Space digs, F marks.)",
    "perdeu": "Too many traps or the time ran out",
    "v1": "The mine is clear!",
    "v2": "In the Norse sources, dwarfs are smiths of the gods' jewels and weapons. The mine and the traps are invented.",
    "h1": "Safe squares",
    "h2": "Traps",
    "b1": "Dig",
    "b2": "Mark"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Dvergenes gruve",
    "sub": "Trykk på en rute for å grave. Hvert tall sier hvor mange av naborutene som skjuler en felle. Bruk tallene til å finne de trygge rutene og grav dem alle. To feller du trår på, eller 180 sekunder, avslutter spillet. Bruk knappen for å bytte mellom å grave og å merke en rute. (Tastatur: piler flytter, mellomrom graver, F merker.)",
    "perdeu": "For mange feller eller tiden tok slutt",
    "v1": "Gruva er ryddet!",
    "v2": "I de norrøne kildene er dvergene smeder av gudenes smykker og våpen. Gruva og fellene er oppfunnet.",
    "h1": "Trygge ruter",
    "h2": "Feller",
    "b1": "Grav",
    "b2": "Merk"
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
    var N = 8, NM = 9, LIM = 180, MAXH = 2;
    var cells = [], gen = false, revd = 0, hits = 0, t = 0, mode = 'dig', cur = 0;
    var NC = ['', '#6fb3ff', '#6fd3a0', '#ff9a8d', '#b49cf2', '#ffb870', '#6fd8d8', '#eee', '#999'];
    function lay() { var W = api.w, H = api.h, cs = Math.max(32, Math.min((W - 24) / N, (H - 150) / N, 64)), gy = Math.max(72, (H - cs * N - 70) / 2 + 12), bw = Math.min(200, W - 40); return { cs: cs, x: (W - cs * N) / 2, y: gy, bx: W / 2 - bw / 2, by: gy + cs * N + 10, bw: bw, bh: 44 }; }
    function pos(i) { var L = lay(); return { x: L.x + (i % N + 0.5) * L.cs, y: L.y + (Math.floor(i / N) + 0.5) * L.cs }; }
    function nb(i) { var r = Math.floor(i / N), c = i % N, o = []; for (var a = -1; a <= 1; a++) for (var b = -1; b <= 1; b++) { if (!a && !b) continue; var rr2 = r + a, cc = c + b; if (rr2 >= 0 && cc >= 0 && rr2 < N && cc < N) o.push(rr2 * N + cc); } return o; }
    function reset() { cells = []; for (var i = 0; i < N * N; i++) cells.push({ mine: false, rev: false, flag: false, n: 0, boom: false }); gen = false; revd = 0; hits = 0; t = 0; mode = 'dig'; st = 'play'; }
    function place(i) {
      var safe = {}; safe[i] = 1; nb(i).forEach(function (k) { safe[k] = 1; }); var c = 0;
      while (c < NM) { var q = Math.floor(Math.random() * N * N); if (!safe[q] && !cells[q].mine) { cells[q].mine = true; c++; } }
      cells.forEach(function (cl, k) { cl.n = nb(k).filter(function (z) { return cells[z].mine; }).length; }); gen = true;
    }
    function dig(i) {
      if (st !== 'play' || cells[i].rev || cells[i].flag) return; if (!gen) place(i);
      if (cells[i].mine) { cells[i].rev = true; cells[i].boom = true; hits++; if (api.nota) api.nota(110, 0.35, 'sawtooth', 0.07); if (hits >= MAXH) st = 'lose'; return; }
      var stack = [i]; if (api.nota) api.nota(380, 0.08, 'triangle', 0.05);
      while (stack.length) { var k = stack.pop(); if (cells[k].rev || cells[k].mine) continue; cells[k].rev = true; cells[k].flag = false; revd++; if (cells[k].n === 0) nb(k).forEach(function (z) { if (!cells[z].rev) stack.push(z); }); }
      if (revd >= N * N - NM) st = 'win';
    }
    function mark(i) { if (st === 'play' && !cells[i].rev) cells[i].flag = !cells[i].flag; }
    function at(x, y) { var L = lay(); for (var i = 0; i < N * N; i++) { var p = pos(i); if (Math.abs(x - p.x) < L.cs * 0.5 && Math.abs(y - p.y) < L.cs * 0.5) return i; } return -1; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, mode: mode, hits: hits, revd: revd, t: t, btn: { x: L.bx + L.bw / 2, y: L.by + L.bh / 2 }, cells: cells.map(function (c, i) { var p = pos(i); return { mine: c.mine, rev: c.rev, flag: c.flag, n: c.n, boom: c.boom, x: p.x, y: p.y }; }) }; },
      down: function (x, y) {
        if (menu()) return; var L = lay();
        if (x >= L.bx && x <= L.bx + L.bw && y >= L.by && y <= L.by + L.bh) { mode = mode === 'dig' ? 'mark' : 'dig'; return; }
        var i = at(x, y); if (i < 0) return; cur = i; if (mode === 'dig') dig(i); else mark(i);
      },
      move: function () {}, up: function () {},
      key: function (k, d) {
        if (!d) return; if (st !== 'play') { menu(); return; }
        if (k === 'ArrowLeft' || k === 'KeyA') cur = cur % N ? cur - 1 : cur; else if (k === 'ArrowRight' || k === 'KeyD') cur = cur % N < N - 1 ? cur + 1 : cur;
        else if (k === 'ArrowUp' || k === 'KeyW') cur = cur >= N ? cur - N : cur; else if (k === 'ArrowDown' || k === 'KeyS') cur = cur < N * (N - 1) ? cur + N : cur;
        else if (k === 'Space' || k === 'Enter') dig(cur); else if (k === 'KeyF') mark(cur);
      },
      update: function (dt) { if (st !== 'play') return; t += dt; if (t >= LIM) st = 'lose'; },
      draw: function () {
        var L = lay(), cs = L.cs, i;
        bg('#2b2118', '#120d09');
        for (i = 0; i < N * N; i++) {
          var c = cells[i], p = pos(i), x = p.x - cs * 0.48, y = p.y - cs * 0.48, w = cs * 0.96;
          if (c.rev) { g.fillStyle = c.boom ? '#8a2d22' : '#4a3a2a'; rr(x, y, w, w, 6); g.fill(); if (c.boom) txt('✹', p.x, p.y + cs * 0.15, cs * 0.5, '#ffd88a'); else if (c.n) txt(String(c.n), p.x, p.y + cs * 0.17, cs * 0.5, NC[c.n]); }
          else { g.fillStyle = '#8b6b44'; rr(x, y, w, w, 6); g.fill(); g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(x + 3, y + 3, w - 6, 4); if (c.flag) txt('⚑', p.x, p.y + cs * 0.17, cs * 0.5, '#ff9a8d'); else if (st === 'lose' && c.mine) txt('✹', p.x, p.y + cs * 0.15, cs * 0.45, '#ffb08a'); }
          if (st === 'play' && i === cur) { g.strokeStyle = '#ffd88a'; g.lineWidth = 3; rr(x - 1, y - 1, w + 2, w + 2, 7); g.stroke(); }
        }
        g.fillStyle = mode === 'dig' ? '#a67c2a' : '#7a3a5a'; rr(L.bx, L.by, L.bw, L.bh, 12); g.fill(); txt((mode === 'dig' ? '⛏ ' + T.b1 : '⚑ ' + T.b2), L.bx + L.bw / 2, L.by + L.bh / 2 + 7, 20, '#fff');
        bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 20 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + revd + '/' + (N * N - NM), T.h2 + ' ' + hits + '/' + MAXH, hits > 0);
        fim(st);
      }
    };
  }
});
