/* As taças de Ægir — alinhe quatro taças antes de Loki. */
BTJogo.registrar({
  canvas: 'jogo-lokasenna',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As taças de Ægir",
    "sub": "Você e Loki servem taças no salão de Ægir. Toque numa coluna (ou use as setas e o espaço) para soltar uma taça dourada. Alinhe quatro, na horizontal, na vertical ou na diagonal, antes que Loki alinhe as dele. Empate conta como derrota. O tempo é limitado.",
    "perdeu": "Loki levou a melhor",
    "v1": "Você calou Loki!",
    "v2": "No Lokasenna, Loki insulta os deuses no banquete de Ægir, até que Thor chega. A partida de taças é invenção do jogo.",
    "h1": "Sequência",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Ægir's cups",
    "sub": "You and Loki serve cups in Ægir's hall. Tap a column (or use the arrows and Space) to drop a golden cup. Line up four, across, down or diagonally, before Loki lines up his. A draw counts as a defeat. Time is limited.",
    "perdeu": "Loki got the better of you",
    "v1": "You silenced Loki!",
    "v2": "In the Lokasenna, Loki insults the gods at Ægir's feast until Thor arrives. The match of cups is made up for the game.",
    "h1": "Streak",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Ægers begre",
    "sub": "Du og Loke setter fram begre i Ægers hall. Trykk på en kolonne (eller bruk piltastene og mellomrom) for å slippe et gyllent beger. Få fire på rad, vannrett, loddrett eller på skrå, før Loke får sine. Uavgjort teller som tap. Tiden er begrenset.",
    "perdeu": "Loke fikk overtaket",
    "v1": "Du tiet Loke ned!",
    "v2": "I Lokasenna håner Loke gudene ved Ægers gjestebud til Tor kommer. Begerspillet er diktet opp for spillet.",
    "h1": "Rekke",
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
    var C = 7, R = 6, LIM = 300;
    var b = [], turn = 1, wait = 0, tmr = LIM, cur = 3, drop = null, best = 0, pop = 0, win = null;
    function lay() { var W = api.w, H = api.h, cs = Math.min((W - 30) / C, (H - 130) / R); return { cs: cs, x: (W - cs * C) / 2, y: Math.max(72, (H - cs * R) / 2 + 24) }; }
    function setup() { b = []; for (var r = 0; r < R; r++) { b.push([]); for (var c = 0; c < C; c++) b[r].push(0); } turn = 1; wait = 0; tmr = LIM; cur = 3; drop = null; best = 0; win = null; }
    function reset() { setup(); st = 'play'; }
    function rowFor(bb, c) { for (var r = R - 1; r >= 0; r--) if (!bb[r][c]) return r; return -1; }
    function line(bb, r, c, p) {
      var best2 = 0, D = [[0, 1], [1, 0], [1, 1], [1, -1]];
      for (var d = 0; d < 4; d++) { var n = 1, k; for (k = 1; k < 4; k++) { var rr2 = r + D[d][0] * k, cc = c + D[d][1] * k; if (rr2 < 0 || rr2 >= R || cc < 0 || cc >= C || bb[rr2][cc] !== p) break; n++; } for (k = 1; k < 4; k++) { var r3 = r - D[d][0] * k, c3 = c - D[d][1] * k; if (r3 < 0 || r3 >= R || c3 < 0 || c3 >= C || bb[r3][c3] !== p) break; n++; } if (n > best2) best2 = n; }
      return best2;
    }
    function full(bb) { for (var c = 0; c < C; c++) if (bb[0][c] === 0) return false; return true; }
    function score(bb, p) { var s = 0; for (var r = 0; r < R; r++) for (var c = 0; c < C; c++) if (bb[r][c]) { var l = line(bb, r, c, bb[r][c]); s += (bb[r][c] === p ? 1 : -1) * (l * l) + (bb[r][c] === p ? 1 : -1) * (3 - Math.abs(c - 3)); } return s; }
    function minimax(bb, p, dep, me) {
      var cols = [], c;
      for (c = 0; c < C; c++) if (rowFor(bb, c) >= 0) cols.push(c);
      if (!cols.length || dep === 0) return score(bb, me);
      var bestV = p === me ? -1e9 : 1e9;
      for (var i = 0; i < cols.length; i++) { c = cols[i]; var r = rowFor(bb, c); bb[r][c] = p; var v; if (line(bb, r, c, p) >= 4) v = (p === me ? 1 : -1) * (10000 + dep); else v = minimax(bb, -p, dep - 1, me); bb[r][c] = 0; if (p === me ? v > bestV : v < bestV) bestV = v; }
      return bestV;
    }
    function aiMove() {
      var cols = [], c; for (c = 0; c < C; c++) if (rowFor(b, c) >= 0) cols.push(c);
      var pick; if (Math.random() < 0.22) pick = cols[Math.floor(Math.random() * cols.length)]; else {
        var bs = -1e9; cols.forEach(function (cc) { var r = rowFor(b, cc); b[r][cc] = -1; var v = line(b, r, cc, -1) >= 4 ? 1e6 : minimax(b, 1, 2, -1); b[r][cc] = 0; v += Math.random(); if (v > bs) { bs = v; pick = cc; } });
      }
      place(pick, -1);
    }
    function place(c, p) {
      var r = rowFor(b, c); if (r < 0) return; b[r][c] = p; drop = { r: r, c: c, p: p, t: 0 }; wait = 0.4; if (api.nota) api.nota(p === 1 ? 330 : 220, 0.08, 'square', 0.05);
      var l = line(b, r, c, p); if (p === 1) best = Math.max(best, l);
      if (l >= 4) { st = p === 1 ? 'win' : 'lose'; win = true; return; }
      if (full(b)) { st = 'lose'; return; }
      turn = -p;
    }
    function human(c) { if (st !== 'play' || turn !== 1 || wait > 0) return; if (rowFor(b, c) < 0) return; place(c, 1); }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, b: b.map(function (r) { return r.slice(); }), turn: turn, wait: wait, x: L.x, y: L.y, cs: L.cs, best: best }; },
      down: function (x, y) { if (menu()) return; var L = lay(), c = Math.floor((x - L.x) / L.cs); if (c >= 0 && c < C) { cur = c; human(c); } },
      move: function (x, y, pr) { var L = lay(), c = Math.floor((x - L.x) / L.cs); if (c >= 0 && c < C) cur = c; },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'ArrowLeft' || k === 'KeyA') cur = Math.max(0, cur - 1); else if (k === 'ArrowRight' || k === 'KeyD') cur = Math.min(C - 1, cur + 1); else if (k === 'Space' || k === 'Enter' || k === 'ArrowDown') human(cur); },
      update: function (dt) {
        pop += dt; if (st !== 'play') { if (drop) drop.t += dt; return; } tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; return; }
        if (drop) drop.t += dt;
        if (wait > 0) { wait -= dt; if (wait <= 0) { wait = 0; drop = null; if (turn === -1 && st === 'play') aiMove(); } }
      },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), r, c;
        bg('#2a2010', '#0e0a05');
        g.fillStyle = '#4a3418'; rr(L.x - 8, L.y - 8, L.cs * C + 16, L.cs * R + 16, 12); g.fill();
        for (r = 0; r < R; r++) for (c = 0; c < C; c++) {
          var x = L.x + c * L.cs + L.cs / 2, y = L.y + r * L.cs + L.cs / 2, v = b[r][c];
          if (drop && drop.r === r && drop.c === c) { var k = Math.min(1, drop.t / 0.25); y = L.y - L.cs / 2 + (y - (L.y - L.cs / 2)) * k * k; }
          g.fillStyle = v === 1 ? '#ffd88a' : (v === -1 ? '#d9573a' : '#1a1208'); g.beginPath(); g.arc(x, y, L.cs * 0.4, 0, 6.283); g.fill();
          if (v) { g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 2; g.beginPath(); g.arc(x, y, L.cs * 0.28, 0, 6.283); g.stroke(); }
        }
        if (st === 'play' && turn === 1 && wait <= 0) { g.fillStyle = 'rgba(255,216,138,.8)'; g.beginPath(); g.arc(L.x + cur * L.cs + L.cs / 2, L.y - 14, 8, 0, 6.283); g.fill(); }
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 60 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + best + '/4', T.h2 + ' ' + Math.ceil(tmr), false);
        fim(st);
      }
    };
  }
});
