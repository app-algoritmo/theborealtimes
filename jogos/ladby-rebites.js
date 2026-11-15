/* Os rebites de Ladby — salte por cima do vizinho até restar um. */
BTJogo.registrar({
  canvas: 'jogo-ladby',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os rebites de Ladby",
    "sub": "Quinze rebites prendem as tábuas do casco, e um deles está solto. Toque num rebite e depois no buraco vazio, do outro lado de um vizinho: o vizinho sai. Tire todos até restar só um. Você pode desfazer 3 jogadas, pelo botão ou pela tecla U.",
    "perdeu": "Sobraram rebites demais",
    "v1": "Só restou um rebite!",
    "v2": "O navio de Ladby, na Dinamarca, era uma sepultura de um chefe viking, com o casco preso por rebites. O jogo de saltos é invenção.",
    "h1": "Rebites",
    "h2": "Desfeitos"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Ladby's rivets",
    "sub": "Fifteen rivets hold the hull planks, and one of them is loose. Tap a rivet and then the empty hole on the other side of a neighbour: the neighbour comes out. Remove them all until only one is left. You can undo 3 moves, with the button or the U key.",
    "perdeu": "Too many rivets were left",
    "v1": "Only one rivet remains!",
    "v2": "The Ladby ship in Denmark was a Viking chieftain's grave, its hull held by rivets. The jumping game is made up.",
    "h1": "Rivets",
    "h2": "Undone"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Ladby-naglene",
    "sub": "Femten nagler holder skrogplankene, og én av dem er løs. Trykk på en nagle og så på det tomme hullet på den andre siden av en nabo: naboen tas ut. Fjern alle til bare én er igjen. Du kan angre 3 trekk, med knappen eller tasten U.",
    "perdeu": "For mange nagler ble igjen",
    "v1": "Bare én nagle er igjen!",
    "v2": "Ladbyskipet i Danmark var en vikinghøvdings grav, med skroget holdt av nagler. Hoppespillet er diktet opp.",
    "h1": "Nagler",
    "h2": "Angret"
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
    var NP = 15, MAXU = 3, LIM = 240, JM = [], DIRS = [[0, -1], [0, 1], [-1, -1], [-1, 0], [1, 0], [1, 1]];
    function id(r, c) { return r * (r + 1) / 2 + c; }
    (function () { for (var r = 0; r < 5; r++) for (var c = 0; c <= r; c++) DIRS.forEach(function (d) { var r1 = r + d[0], c1 = c + d[1], r2 = r + 2 * d[0], c2 = c + 2 * d[1]; if (r2 < 0 || r2 > 4 || c2 < 0 || c2 > r2 || c1 < 0 || c1 > r1) return; JM.push([id(r, c), id(r1, c1), id(r2, c2)]); }); })();
    var pg = [], hist = [], sel = -1, cur = 0, undos = 0, tmr = LIM, pop = 0;
    function cnt(p) { var n = 0; for (var i = 0; i < NP; i++) if (p[i]) n++; return n; }
    function legal(p) { return JM.filter(function (j) { return p[j[0]] && p[j[1]] && !p[j[2]]; }); }
    function solvable(p, seen) { if (cnt(p) === 1) return true; var k = p.join(''); if (seen[k]) return false; seen[k] = 1; var L = legal(p); for (var i = 0; i < L.length; i++) { var q = p.slice(); q[L[i][0]] = 0; q[L[i][1]] = 0; q[L[i][2]] = 1; if (solvable(q, seen)) return true; } return false; }
    function setup() { var h, p; do { h = Math.floor(Math.random() * NP); p = []; for (var i = 0; i < NP; i++) p.push(i === h ? 0 : 1); } while (!solvable(p.slice(), {})); pg = p; hist = []; sel = -1; cur = 0; undos = 0; tmr = LIM; }
    function reset() { setup(); st = 'play'; }
    function jump(a, b) { var j = null; for (var i = 0; i < JM.length; i++) if (JM[i][0] === a && JM[i][2] === b && pg[a] && pg[JM[i][1]] && !pg[b]) j = JM[i]; if (!j) return false; hist.push(pg.slice()); pg[a] = 0; pg[j[1]] = 0; pg[b] = 1; if (api.nota) api.nota(300 + cnt(pg) * 20, 0.06, 'triangle', 0.05); if (cnt(pg) === 1) st = 'win'; else if (!legal(pg).length && undos >= MAXU) st = 'lose'; return true; }
    function pick(i) { if (st !== 'play') return; if (sel < 0) { if (pg[i]) sel = i; } else if (sel === i) sel = -1; else if (jump(sel, i)) sel = -1; else if (pg[i]) sel = i; else sel = -1; }
    function undo() { if (st !== 'play' || !hist.length || undos >= MAXU) return; pg = hist.pop(); undos++; sel = -1; }
    function lay() { var W = api.w, H = api.h, sp = Math.min(74, (W - 40) / 4.6, (H - 180) / (4 * 0.86)); return { sp: sp, y0: Math.max(84, (H - 4 * 0.86 * sp) / 2 - 8) }; }
    function pos(i) { var L = lay(), r = 0; while ((r + 1) * (r + 2) / 2 <= i) r++; var c = i - r * (r + 1) / 2; return { x: api.w / 2 + (c - r / 2) * L.sp, y: L.y0 + r * L.sp * 0.86 }; }
    function btn() { return { x: api.w / 2 - 38, y: api.h - 48, w: 76, h: 30 }; }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var b = btn(); return { st: st, pg: pg.slice(), sel: sel, undos: undos, cnt: cnt(pg), legal: legal(pg), pos: pos, bx: b.x + b.w / 2, by: b.y + b.h / 2, hist: hist.length }; },
      down: function (x, y) { if (menu()) return; var b = btn(); if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) { undo(); return; } var L = lay(), best = -1, bd = 1e9; for (var i = 0; i < NP; i++) { var p = pos(i), d = Math.hypot(p.x - x, p.y - y); if (d < bd) { bd = d; best = i; } } if (bd < L.sp * 0.5) { cur = best; pick(best); } },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'KeyU' || k === 'Backspace') undo(); else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'KeyA' || k === 'KeyW') cur = (cur + NP - 1) % NP; else if (k === 'ArrowRight' || k === 'ArrowDown' || k === 'KeyD' || k === 'KeyS') cur = (cur + 1) % NP; else if (k === 'Space' || k === 'Enter') pick(cur); },
      update: function (dt) { pop += dt; if (st === 'play') { tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; } } },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), i, b = btn();
        bg('#1e2a30', '#070b0e');
        for (i = 0; i < NP; i++) { var p = pos(i), r = L.sp * 0.3; g.fillStyle = 'rgba(0,0,0,.4)'; g.beginPath(); g.arc(p.x, p.y, r + 3, 0, 6.283); g.fill();
          if (pg[i]) { var gr = g.createRadialGradient(p.x - r * 0.3, p.y - r * 0.3, 2, p.x, p.y, r); gr.addColorStop(0, '#e8e0d0'); gr.addColorStop(1, '#8a8478'); g.fillStyle = gr; g.beginPath(); g.arc(p.x, p.y, r, 0, 6.283); g.fill(); }
          if (i === sel) { g.strokeStyle = '#ffd88a'; g.lineWidth = 4; g.beginPath(); g.arc(p.x, p.y, r + 5, 0, 6.283); g.stroke(); }
          else if (i === cur && st === 'play') { g.strokeStyle = 'rgba(255,216,138,.5)'; g.lineWidth = 2; g.beginPath(); g.arc(p.x, p.y, r + 5, 0, 6.283); g.stroke(); } }
        if (sel >= 0) legal(pg).forEach(function (j) { if (j[0] === sel) { var q = pos(j[2]); g.fillStyle = 'rgba(155,212,155,.5)'; g.beginPath(); g.arc(q.x, q.y, L.sp * 0.14, 0, 6.283); g.fill(); } });
        var stuck = st === 'play' && !legal(pg).length;
        g.fillStyle = undos >= MAXU ? 'rgba(255,255,255,.08)' : (stuck && Math.floor(pop * 3) % 2 ? '#ffd88a' : 'rgba(255,255,255,.2)'); rr(b.x, b.y, b.w, b.h, 8); g.fill(); txt('↶', b.x + b.w / 2, b.y + b.h - 7, 20, undos >= MAXU ? 'rgba(255,255,255,.3)' : '#fff');
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 40 ? '#c0392b' : '#8a93a8');
        hud(T.h1 + ' ' + (NP - cnt(pg)) + '/' + 14, T.h2 + ' ' + undos + '/' + MAXU, undos > 0);
        fim(st);
      }
    };
  }
});
