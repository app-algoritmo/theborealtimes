/* Harald Hardrada, rei da Noruega — a raposa e os gansos (invenção): prenda a raposa num tabuleiro em cruz. */
BTJogo.registrar({
  canvas: 'jogo-hardrada',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A raposa e os gansos",
    "sub": "Você move os gansos: toque num ganso e depois numa casa livre ao lado dele. A raposa anda uma casa ou pula sobre um ganso se houver casa livre atrás dele. Prenda a raposa, sem que ela coma 7 gansos, em até 240 segundos. (Teclado: setas movem o cursor, Espaço escolhe.)",
    "perdeu": "A raposa escapou",
    "v1": "A raposa está presa!",
    "v2": "Harald Hardrada serviu em Kiev e em Constantinopla e voltou para ser rei da Noruega. A raposa e os gansos são invenção.",
    "h1": "Gansos",
    "h2": "Comidos"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The fox and the geese",
    "sub": "You move the geese: tap a goose, then a free hole next to it. The fox steps one hole or jumps over a goose if the hole behind it is free. Trap the fox without it eating 7 geese, within 240 seconds. (Keyboard: arrows move the cursor, Space picks.)",
    "perdeu": "The fox escaped",
    "v1": "The fox is trapped!",
    "v2": "Harald Hardrada served in Kyiv and in Constantinople and came back to be king of Norway. The fox and geese game is invented.",
    "h1": "Geese",
    "h2": "Eaten"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Reven og gjessene",
    "sub": "Du flytter gjessene: trykk på en gås, så på et ledig hull ved siden av den. Reven går ett hull eller hopper over en gås hvis hullet bak er ledig. Fang reven uten at den spiser 7 gjess, innen 240 sekunder. (Tastatur: piler flytter markøren, mellomrom velger.)",
    "perdeu": "Reven slapp unna",
    "v1": "Reven er fanget!",
    "v2": "Harald Hardråde tjenestegjorde i Kiev og i Konstantinopel og vendte hjem for å bli konge av Norge. Rev og gjess-spillet er oppfunnet.",
    "h1": "Gjess",
    "h2": "Spist"
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
    var LOSS = 7, LIM = 240, D = [[0, -1], [0, 1], [-1, 0], [1, 0]];
    var gs = [], fox = [3, 3], sel = null, caught = 0, t = 0, turn = 'p', ft = 0, kr = 4, kc = 3, last = null;
    function valid(r, c) { return r >= 0 && c >= 0 && r < 7 && c < 7 && ((r >= 2 && r <= 4) || (c >= 2 && c <= 4)); }
    function gi(r, c) { for (var i = 0; i < gs.length; i++) if (gs[i][0] === r && gs[i][1] === c) return i; return -1; }
    function empty(r, c) { return valid(r, c) && gi(r, c) < 0 && !(fox[0] === r && fox[1] === c); }
    function gmoves(i) { var r = gs[i][0], c = gs[i][1], o = []; D.forEach(function (d) { if (empty(r + d[0], c + d[1])) o.push([r + d[0], c + d[1]]); }); return o; }
    function fjumps() { var o = []; D.forEach(function (d) { var r1 = fox[0] + d[0], c1 = fox[1] + d[1], r2 = r1 + d[0], c2 = c1 + d[1]; if (gi(r1, c1) >= 0 && empty(r2, c2)) o.push([r2, c2, r1, c1]); }); return o; }
    function fsteps() { var o = []; D.forEach(function (d) { if (empty(fox[0] + d[0], fox[1] + d[1])) o.push([fox[0] + d[0], fox[1] + d[1]]); }); return o; }
    function anyGoose() { for (var i = 0; i < gs.length; i++) if (gmoves(i).length) return true; return false; }
    function reset() {
      gs = []; for (var r = 4; r <= 6; r++) for (var c = 0; c < 7; c++) if (valid(r, c)) gs.push([r, c]);
      fox = [3, 3]; sel = null; caught = 0; t = 0; turn = 'p'; ft = 0; kr = 4; kc = 3; last = null; st = 'play';
    }
    function score(r, c) {
      var s = Math.random() * 4, n = 0; D.forEach(function (d) { var r1 = r + d[0], c1 = c + d[1], r2 = r1 + d[0], c2 = c1 + d[1]; if (valid(r1, c1) && gi(r1, c1) >= 0) { s += 0.6; if (empty(r2, c2)) s += 2.2; } if (empty(r1, c1)) n++; });
      return s + n * 0.5;
    }
    function foxMove() {
      var j = fjumps(), pick;
      if (j.length && Math.random() < 0.12) { var q = j[Math.floor(Math.random() * j.length)]; gs.splice(gi(q[2], q[3]), 1); fox = [q[0], q[1]]; caught++; if (api.nota) api.nota(150, 0.25, 'sawtooth', 0.06); if (caught >= LOSS) { st = 'lose'; return; } }
      else { var s = fsteps(); if (!s.length) { st = 'win'; return; } var b = -1; s.forEach(function (p) { var v = score(p[0], p[1]); if (v > b) { b = v; pick = p; } }); fox = [pick[0], pick[1]]; }
      turn = 'p'; if (!fjumps().length && !fsteps().length) { st = 'win'; return; }
      if (!anyGoose()) { turn = 'f'; ft = 0.5; }
    }
    function after() {
      sel = null; if (!fjumps().length && !fsteps().length) { if (api.nota) api.nota(700, 0.3, 'sine', 0.06); st = 'win'; return; }
      turn = 'f'; ft = 0.5;
    }
    function act(r, c) {
      if (st !== 'play' || turn !== 'p' || !valid(r, c)) return;
      var i = gi(r, c);
      if (i >= 0) { sel = gmoves(i).length ? i : null; return; }
      if (sel !== null) { var mv = gmoves(sel); for (var k = 0; k < mv.length; k++) if (mv[k][0] === r && mv[k][1] === c) { gs[sel] = [r, c]; last = [r, c]; if (api.nota) api.nota(400, 0.08, 'triangle', 0.05); after(); return; } sel = null; }
    }
    function lay() { var W = api.w, H = api.h, cs = Math.max(34, Math.min((W - 16) / 7, (H - 110) / 7, 80)); return { W: W, H: H, cs: cs, x: (W - cs * 7) / 2, y: Math.max(66, (H - cs * 7) / 2 + 14) }; }
    function pos(r, c) { var L = lay(); return { x: L.x + (c + 0.5) * L.cs, y: L.y + (r + 0.5) * L.cs }; }
    function moveCur(dr, dc) { var r = kr + dr, c = kc + dc; while (r >= 0 && c >= 0 && r < 7 && c < 7 && !valid(r, c)) { r += dr; c += dc; } if (valid(r, c)) { kr = r; kc = c; } }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () {
        var mv = []; for (var i = 0; i < gs.length; i++) gmoves(i).forEach(function (p) { mv.push({ from: gs[i].slice(), to: p }); });
        return { st: st, geese: gs.map(function (a) { return a.slice(); }), fox: fox.slice(), moves: mv, pos: pos, caught: caught, loss: LOSS, turn: turn, t: t, sel: sel };
      },
      down: function (x, y) { if (menu()) return; var L = lay(), c = Math.floor((x - L.x) / L.cs), r = Math.floor((y - L.y) / L.cs); act(r, c); },
      move: function () {}, up: function () {},
      key: function (k, d) {
        if (!d) return; if (st !== 'play') { menu(); return; }
        if (k === 'ArrowLeft' || k === 'KeyA') moveCur(0, -1); else if (k === 'ArrowRight' || k === 'KeyD') moveCur(0, 1); else if (k === 'ArrowUp' || k === 'KeyW') moveCur(-1, 0); else if (k === 'ArrowDown' || k === 'KeyS') moveCur(1, 0); else if (k === 'Space' || k === 'Enter') act(kr, kc);
      },
      update: function (dt) { if (st !== 'play') return; t += dt; if (t >= LIM) { st = 'lose'; return; } if (turn === 'f') { ft -= dt; if (ft <= 0) foxMove(); } },
      draw: function () {
        var L = lay(), cs = L.cs, r, c, i;
        bg('#1a2a1f', '#08120c');
        g.strokeStyle = 'rgba(200,180,120,.35)'; g.lineWidth = 2;
        for (r = 0; r < 7; r++) for (c = 0; c < 7; c++) if (valid(r, c)) { var p = pos(r, c); if (valid(r, c + 1)) { var q = pos(r, c + 1); g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(q.x, q.y); g.stroke(); } if (valid(r + 1, c)) { q = pos(r + 1, c); g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(q.x, q.y); g.stroke(); } }
        for (r = 0; r < 7; r++) for (c = 0; c < 7; c++) if (valid(r, c)) { p = pos(r, c); g.fillStyle = '#3a3220'; g.beginPath(); g.arc(p.x, p.y, cs * 0.17, 0, 6.283); g.fill(); }
        if (st === 'play' && turn === 'p') { var cp = pos(kr, kc); g.strokeStyle = 'rgba(255,216,138,.5)'; g.lineWidth = 2; g.strokeRect(cp.x - cs * 0.42, cp.y - cs * 0.42, cs * 0.84, cs * 0.84); }
        if (sel !== null) { gmoves(sel).forEach(function (m) { var pp = pos(m[0], m[1]); g.fillStyle = 'rgba(255,216,138,.75)'; g.beginPath(); g.arc(pp.x, pp.y, cs * 0.14, 0, 6.283); g.fill(); }); }
        for (i = 0; i < gs.length; i++) { p = pos(gs[i][0], gs[i][1]); g.fillStyle = i === sel ? '#fff3b8' : '#ece8e0'; g.beginPath(); g.arc(p.x, p.y, cs * 0.34, 0, 6.283); g.fill(); g.fillStyle = '#e8963a'; g.beginPath(); g.moveTo(p.x - 5, p.y - cs * 0.3); g.lineTo(p.x + 5, p.y - cs * 0.3); g.lineTo(p.x, p.y - cs * 0.46); g.fill(); g.fillStyle = '#2a2438'; g.beginPath(); g.arc(p.x - cs * 0.1, p.y - cs * 0.06, 2.5, 0, 6.283); g.arc(p.x + cs * 0.1, p.y - cs * 0.06, 2.5, 0, 6.283); g.fill(); }
        p = pos(fox[0], fox[1]); g.fillStyle = '#d9772a'; g.beginPath(); g.arc(p.x, p.y, cs * 0.34, 0, 6.283); g.fill(); g.beginPath(); g.moveTo(p.x - cs * 0.3, p.y - cs * 0.15); g.lineTo(p.x - cs * 0.22, p.y - cs * 0.5); g.lineTo(p.x - cs * 0.04, p.y - cs * 0.3); g.moveTo(p.x + cs * 0.3, p.y - cs * 0.15); g.lineTo(p.x + cs * 0.22, p.y - cs * 0.5); g.lineTo(p.x + cs * 0.04, p.y - cs * 0.3); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(p.x, p.y + cs * 0.12, cs * 0.14, 0, 6.283); g.fill(); g.fillStyle = '#2a2438'; g.beginPath(); g.arc(p.x - cs * 0.1, p.y - cs * 0.05, 2.5, 0, 6.283); g.arc(p.x + cs * 0.1, p.y - cs * 0.05, 2.5, 0, 6.283); g.fill();
        bar(api.w / 2 - 110, api.h - 14, 220, 5, (LIM - t) / LIM, LIM - t < 20 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + gs.length, T.h2 + ' ' + caught + '/' + LOSS, caught >= LOSS - 2);
        fim(st);
      }
    };
  }
});
