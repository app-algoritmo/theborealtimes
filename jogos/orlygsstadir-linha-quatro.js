/* Örlygsstaðir — alinhe quatro peças antes do rival. */
BTJogo.registrar({
  canvas: 'jogo-orlygsstadir',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O campo de Örlygsstaðir",
    "sub": "Toque numa coluna (ou use ← → e espaço) para soltar sua peça dourada. Alinhe quatro peças, na horizontal, na vertical ou na diagonal, antes que o rival alinhe as dele. Você começa. Vença em até 120 segundos.",
    "perdeu": "O rival alinhou quatro, o tabuleiro encheu ou o tempo acabou",
    "v1": "Você alinhou quatro!",
    "v2": "Em Örlygsstaðir, em 1238, os Sturlungar perderam para os homens de Kolbeinn e Gissur. O jogo de alinhar peças é invenção.",
    "h1": "Jogadas",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The field of Örlygsstaðir",
    "sub": "Tap a column (or use ← → and space) to drop your golden piece. Line up four pieces, horizontally, vertically or diagonally, before the rival lines up his. You start. Win within 120 seconds.",
    "perdeu": "The rival lined up four, the board filled or the time ran out",
    "v1": "You lined up four!",
    "v2": "At Örlygsstaðir, in 1238, the Sturlungs lost to the men of Kolbeinn and Gissur. The game of lining up pieces is made up.",
    "h1": "Moves",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Marken ved Örlygsstaðir",
    "sub": "Trykk på en kolonne (eller bruk ← → og mellomrom) for å slippe den gylne brikken din. Få fire brikker på rad, vannrett, loddrett eller på skrå, før rivalen får sine. Du begynner. Vinn innen 120 sekunder.",
    "perdeu": "Rivalen fikk fire på rad, brettet ble fullt eller tiden gikk ut",
    "v1": "Du fikk fire på rad!",
    "v2": "Ved Örlygsstaðir i 1238 tapte sturlungene mot mennene til Kolbeinn og Gissur. Spillet med brikker på rad er diktet opp.",
    "h1": "Trekk",
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
    var C = 7, R = 6, LIM = 120, ERR = 0.3;
    var b = [], turn = 0, t = 0, aiT = 0, moves = 0, cur = 3, last = -1, win = null;
    function lay() { var W = api.w, H = api.h, cs = Math.max(34, Math.min((W - 24) / C, (H - 170) / (R + 0.6), 74)); return { cs: cs, x: (W - cs * C) / 2, y: Math.max(96, (H - cs * (R + 0.6)) / 2 + 10 + cs * 0.6) }; }
    function setup() { b = []; for (var i = 0; i < C * R; i++) b.push(0); turn = 0; t = 0; aiT = 0; moves = 0; cur = 3; last = -1; win = null; }
    function reset() { setup(); st = 'play'; }
    function rowFor(bb, c) { for (var r = R - 1; r >= 0; r--) if (!bb[r * C + c]) return r; return -1; }
    function four(bb, p) { var D = [[0, 1], [1, 0], [1, 1], [1, -1]]; for (var r = 0; r < R; r++) for (var c = 0; c < C; c++) { if (bb[r * C + c] !== p) continue; for (var d = 0; d < 4; d++) { var cells = [[r, c]], ok = true; for (var k = 1; k < 4; k++) { var rr_ = r + D[d][0] * k, cc = c + D[d][1] * k; if (rr_ < 0 || rr_ >= R || cc < 0 || cc >= C || bb[rr_ * C + cc] !== p) { ok = false; break; } cells.push([rr_, cc]); } if (ok) return cells; } } return null; }
    function full(bb) { for (var c = 0; c < C; c++) if (bb[c] === 0) return false; return true; }
    function evalB(bb) { var s = 0, D = [[0, 1], [1, 0], [1, 1], [1, -1]]; for (var r = 0; r < R; r++) for (var c = 0; c < C; c++) for (var d = 0; d < 4; d++) { var a = 0, bq = 0, ok = true; for (var k = 0; k < 4; k++) { var rr_ = r + D[d][0] * k, cc = c + D[d][1] * k; if (rr_ < 0 || rr_ >= R || cc < 0 || cc >= C) { ok = false; break; } var v = bb[rr_ * C + cc]; if (v === 1) a++; else if (v === 2) bq++; } if (!ok) continue; if (a && !bq) s -= a * a; if (bq && !a) s += bq * bq; } return s; }
    function mm(bb, depth, p, al, be) { if (four(bb, 1)) return -1000 - depth; if (four(bb, 2)) return 1000 + depth; if (full(bb) || depth === 0) return evalB(bb); var best = p === 2 ? -1e9 : 1e9; var order = [3, 2, 4, 1, 5, 0, 6]; for (var i = 0; i < 7; i++) { var c = order[i], r = rowFor(bb, c); if (r < 0) continue; bb[r * C + c] = p; var v = mm(bb, depth - 1, 3 - p, al, be); bb[r * C + c] = 0; if (p === 2) { best = Math.max(best, v); al = Math.max(al, v); } else { best = Math.min(best, v); be = Math.min(be, v); } if (be <= al) break; } return best; }
    function aiPick() { var cols = []; for (var c = 0; c < C; c++) if (rowFor(b, c) >= 0) cols.push(c); if (Math.random() < ERR) return cols[Math.floor(Math.random() * cols.length)]; var best = -1e9, bc = cols[0]; cols.forEach(function (c) { var q = b.slice(), r = rowFor(q, c); q[r * C + c] = 2; var v = mm(q, 3, 1, -1e9, 1e9) + Math.random() * 0.5; if (v > best) { best = v; bc = c; } }); return bc; }
    function put(c, p) { var r = rowFor(b, c); if (r < 0) return false; b[r * C + c] = p; last = r * C + c; if (api.nota) api.nota(p === 1 ? 420 : 300, 0.07, 'triangle', 0.05); var f = four(b, p); if (f) { win = f; st = p === 1 ? 'win' : 'lose'; return true; } if (full(b)) { st = 'lose'; } return true; }
    function mine(c) { if (st !== 'play' || turn !== 0) return; if (put(c, 1)) { moves++; if (st === 'play') { turn = 1; aiT = 0.7; } } }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, b: b.slice(), turn: turn, busy: turn !== 0, moves: moves, t: t, tmr: LIM - t, C: C, R: R, pos: function (c) { return { x: L.x + (c + 0.5) * L.cs, y: L.y + L.cs * 0.5 }; } }; },
      down: function (x, y) { if (menu()) return; var L = lay(), c = Math.floor((x - L.x) / L.cs); if (c >= 0 && c < C) { cur = c; mine(c); } },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'ArrowLeft') cur = (cur + C - 1) % C; else if (k === 'ArrowRight') cur = (cur + 1) % C; else if (k === 'Space' || k === 'Enter' || k === 'ArrowDown') mine(cur); },
      update: function (dt) { if (st !== 'play') return; t += dt; if (t >= LIM) { t = LIM; st = 'lose'; return; } if (turn === 1) { aiT -= dt; if (aiT <= 0) { put(aiPick(), 2); if (st === 'play') turn = 0; } } },
      draw: function () {
        var L = lay(), W = api.w, H = api.h, r, c;
        bg('#1d2a1a', '#060a05');
        g.fillStyle = '#2a4a6a'; rr(L.x - 6, L.y - 6, L.cs * C + 12, L.cs * R + 12, 12); g.fill();
        for (r = 0; r < R; r++) for (c = 0; c < C; c++) { var v = b[r * C + c], cx = L.x + (c + 0.5) * L.cs, cy = L.y + (r + 0.5) * L.cs; g.fillStyle = v === 1 ? '#ffd88a' : v === 2 ? '#c0392b' : '#0a1420'; g.beginPath(); g.arc(cx, cy, L.cs * 0.38, 0, 6.283); g.fill(); }
        if (win) { g.strokeStyle = '#fff'; g.lineWidth = 4; win.forEach(function (q) { g.beginPath(); g.arc(L.x + (q[1] + 0.5) * L.cs, L.y + (q[0] + 0.5) * L.cs, L.cs * 0.42, 0, 6.283); g.stroke(); }); }
        if (st === 'play' && turn === 0) { g.fillStyle = 'rgba(255,216,138,.7)'; g.beginPath(); g.moveTo(L.x + (cur + 0.5) * L.cs, L.y - 10); g.lineTo(L.x + (cur + 0.5) * L.cs - 9, L.y - 26); g.lineTo(L.x + (cur + 0.5) * L.cs + 9, L.y - 26); g.closePath(); g.fill(); }
        bar(W / 2 - 110, H - 14, 220, 5, (LIM - t) / LIM, LIM - t < 20 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + moves, T.h2 + ' ' + Math.ceil(LIM - t), false);
        fim(st);
      }
    };
  }
});
