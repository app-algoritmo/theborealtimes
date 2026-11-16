/* Staraya Ladoga — alinhe cinco contas de vidro. */
BTJogo.registrar({
  canvas: 'jogo-ladoga',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As contas de Ladoga",
    "sub": "Toque numa casa vazia para pôr uma conta dourada; o adversário põe contas azuis. Quem alinhar primeiro cinco contas, na horizontal, na vertical ou na diagonal, vence. Bloqueie as linhas dele. Tempo limitado.",
    "perdeu": "O adversário fechou a linha, ou o tempo acabou",
    "v1": "Cinco contas alinhadas!",
    "v2": "Staraya Ladoga (Aldeigjuborg) foi, desde o século VIII, um centro de comércio e de ofícios. O jogo de alinhar contas é invenção.",
    "h1": "Contas",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The beads of Ladoga",
    "sub": "Tap an empty cell to place a golden bead; your opponent places blue beads. Whoever first lines up five beads, horizontally, vertically or diagonally, wins. Block his lines. Time is limited.",
    "perdeu": "The opponent closed his line, or time ran out",
    "v1": "Five beads in a row!",
    "v2": "Staraya Ladoga (Aldeigjuborg) was, from the 8th century, a centre of trade and crafts. The bead-lining game is made up.",
    "h1": "Beads",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Perlene i Ladoga",
    "sub": "Trykk på en tom rute for å sette en gyllen perle; motstanderen setter blå perler. Den som først får fem perler på rad, vannrett, loddrett eller på skrå, vinner. Blokker linjene hans. Tiden er begrenset.",
    "perdeu": "Motstanderen fullførte raden, eller tiden gikk ut",
    "v1": "Fem perler på rad!",
    "v2": "Staraya Ladoga (Aldeigjuborg) var fra 700-tallet et senter for handel og håndverk. Perlespillet er diktet opp.",
    "h1": "Perler",
    "h2": "Tid"
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
    var N = 9, LIM = 240;
    var b = [], turn = 1, wait = 0, tmr = LIM, nb = 0, pop = 0, lastm = null, hov = null;
    var DIRS = [[0, 1], [1, 0], [1, 1], [1, -1]];
    function lay() { var W = api.w, H = api.h, cs = Math.max(30, Math.min((W - 20) / N, (H - 150) / N, 56)); return { cs: cs, x: (W - cs * N) / 2, y: Math.max(86, (H - cs * N) / 2 + 12) }; }
    function setup() { b = []; for (var r = 0; r < N; r++) b.push(new Array(N).fill(0)); turn = 1; wait = 0; tmr = LIM; nb = 0; lastm = null; }
    function reset() { setup(); st = 'play'; }
    function line(r, c, p, d) { var n = 1, open = 0, k, rr_, cc; for (k = 1; k < 5; k++) { rr_ = r + d[0] * k; cc = c + d[1] * k; if (rr_ < 0 || cc < 0 || rr_ >= N || cc >= N || b[rr_][cc] !== p) break; n++; } rr_ = r + d[0] * k; cc = c + d[1] * k; if (rr_ >= 0 && cc >= 0 && rr_ < N && cc < N && !b[rr_][cc]) open++; for (k = 1; k < 5; k++) { rr_ = r - d[0] * k; cc = c - d[1] * k; if (rr_ < 0 || cc < 0 || rr_ >= N || cc >= N || b[rr_][cc] !== p) break; n++; } rr_ = r - d[0] * k; cc = c - d[1] * k; if (rr_ >= 0 && cc >= 0 && rr_ < N && cc < N && !b[rr_][cc]) open++; return [n, open]; }
    function ev(r, c, p) { var s = 0; DIRS.forEach(function (d) { var x = line(r, c, p, d), n = x[0], o = x[1]; if (n >= 5) s += 100000; else if (n === 4) s += o === 2 ? 8000 : o === 1 ? 1200 : 0; else if (n === 3) s += o === 2 ? 900 : o === 1 ? 90 : 0; else if (n === 2) s += o === 2 ? 60 : o === 1 ? 8 : 0; else s += o * 2; }); return s; }
    function won(r, c, p) { for (var i = 0; i < 4; i++) if (line(r, c, p, DIRS[i])[0] >= 5) return true; return false; }
    function put(r, c, p) { b[r][c] = p; lastm = [r, c]; nb++; if (api.nota) api.nota(p === 1 ? 560 : 400, 0.07, 'triangle', 0.05); if (won(r, c, p)) { st = p === 1 ? 'win' : 'lose'; return true; } var full = true; for (var i = 0; i < N; i++) for (var j = 0; j < N; j++) if (!b[i][j]) full = false; if (full) { st = 'lose'; return true; } return false; }
    function ai() { var best = -1e9, bm = null, cx = (N - 1) / 2, rnd = Math.random() < 0.15, blk = Math.random() < 0.6 ? 0.9 : 0.05; for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) { if (b[r][c]) continue; var a = ev(r, c, 2), d = ev(r, c, 1); var s = rnd ? Math.random() * 100 - (Math.abs(r - cx) + Math.abs(c - cx)) * 3 : a * 0.6 + (d >= 1200 ? d * (Math.random() < 0.9 ? 0.9 : 0.1) : d * blk) + Math.random() * 30 - (Math.abs(r - cx) + Math.abs(c - cx)) * 0.5; if (s > best) { best = s; bm = [r, c]; } } if (bm) put(bm[0], bm[1], 2); turn = 1; }
    function cellAt(x, y) { var L = lay(), c = Math.floor((x - L.x) / L.cs), r = Math.floor((y - L.y) / L.cs); if (r < 0 || c < 0 || r >= N || c >= N) return null; return { r: r, c: c }; }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, turn: turn, b: b.map(function (r) { return r.slice(); }), N: N, ev: ev, tmr: tmr, wait: wait, pos: function (r, c) { return { x: L.x + (c + 0.5) * L.cs, y: L.y + (r + 0.5) * L.cs }; } }; },
      down: function (x, y) { if (menu()) return; if (turn !== 1) return; var p = cellAt(x, y); if (!p || b[p.r][p.c]) return; if (put(p.r, p.c, 1)) return; turn = 2; wait = 0.45; },
      move: function (x, y) { hov = cellAt(x, y); },
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) { pop += dt; if (st !== 'play') return; tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; return; } if (turn === 2) { wait -= dt; if (wait <= 0) ai(); } },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), r, c;
        bg('#1c2a30', '#080e10');
        g.fillStyle = '#8a6a3a'; rr(L.x - 6, L.y - 6, L.cs * N + 12, L.cs * N + 12, 10); g.fill();
        g.strokeStyle = 'rgba(0,0,0,.45)'; g.lineWidth = 1.5; for (r = 0; r < N; r++) { g.beginPath(); g.moveTo(L.x + L.cs / 2, L.y + (r + 0.5) * L.cs); g.lineTo(L.x + (N - 0.5) * L.cs, L.y + (r + 0.5) * L.cs); g.stroke(); g.beginPath(); g.moveTo(L.x + (r + 0.5) * L.cs, L.y + L.cs / 2); g.lineTo(L.x + (r + 0.5) * L.cs, L.y + (N - 0.5) * L.cs); g.stroke(); }
        for (r = 0; r < N; r++) for (c = 0; c < N; c++) if (b[r][c]) { var x = L.x + (c + 0.5) * L.cs, y = L.y + (r + 0.5) * L.cs; g.fillStyle = b[r][c] === 1 ? '#ffd88a' : '#5a8ad0'; g.beginPath(); g.arc(x, y, L.cs * 0.38, 0, 6.283); g.fill(); g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.arc(x - L.cs * 0.1, y - L.cs * 0.1, L.cs * 0.1, 0, 6.283); g.fill(); g.fillStyle = 'rgba(0,0,0,.5)'; g.beginPath(); g.arc(x, y, L.cs * 0.09, 0, 6.283); g.fill(); if (lastm && lastm[0] === r && lastm[1] === c) { g.strokeStyle = '#fff'; g.lineWidth = 2; g.beginPath(); g.arc(x, y, L.cs * 0.44, 0, 6.283); g.stroke(); } }
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 40 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + Math.ceil(nb / 2), T.h2 + ' ' + Math.ceil(tmr), false);
        fim(st);
      }
    };
  }
});
