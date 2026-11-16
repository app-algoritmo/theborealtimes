/* Åsgårdsreia, a Caçada Selvagem — capture as peças do rival num tabuleiro de 6 por 6 (invenção). */
BTJogo.registrar({
  canvas: 'jogo-asgardsreia',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A caçada de Åsgårdsreia",
    "sub": "Você joga com as peças claras, que sobem. Toque numa peça e depois na casa escura de destino: as peças andam uma casa na diagonal para a frente. Para capturar, pule sobre uma peça do rival para a casa vazia logo atrás; a captura é obrigatória. A peça que chega à última fileira vira rainha e anda também para trás. Deixe o rival sem peças ou sem jogadas, em até 240 segundos. (Teclado: setas movem o cursor, Espaço escolhe.)",
    "perdeu": "A caçada acabou para você",
    "v1": "O bando do rival se dispersou!",
    "v2": "Cavaleiros fantasmas, cães e tempestade formam a Caçada Selvagem, no Norte chamada Åsgårdsreia ou Oskoreia. O tabuleiro de capturas é invenção.",
    "h1": "Suas peças",
    "h2": "Tempo",
    "rv": "Rival"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The Åsgårdsreia hunt",
    "sub": "You play the light pieces, which go up. Tap a piece and then the dark square to go to: pieces step one square diagonally forward. To capture, jump over a rival piece to the empty square right behind it; capturing is compulsory. A piece that reaches the last row becomes a queen and also moves backwards. Leave the rival without pieces or without moves, within 240 seconds. (Keyboard: arrows move the cursor, Space picks.)",
    "perdeu": "The hunt is over for you",
    "v1": "The rival's band scattered!",
    "v2": "Ghostly riders, hounds and storm make up the Wild Hunt, called Åsgårdsreia or Oskoreia in the North. The capture board is invented.",
    "h1": "Your pieces",
    "h2": "Time",
    "rv": "Rival"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Åsgårdsreia-jakten",
    "sub": "Du spiller de lyse brikkene, som går oppover. Trykk på en brikke og så på det mørke feltet du vil til: brikkene går ett felt på skrå framover. For å ta, hopp over en motstanderbrikke til det tomme feltet rett bak; å ta er tvungent. En brikke som når siste rad, blir dronning og går også bakover. La motstanderen stå uten brikker eller trekk, innen 240 sekunder. (Tastatur: piler flytter markøren, mellomrom velger.)",
    "perdeu": "Jakten er over for deg",
    "v1": "Motstanderens flokk spredte seg!",
    "v2": "Spøkelsesryttere, hunder og storm utgjør Villjakta, kalt Åsgårdsreia eller Oskoreia i Norden. Brettet med tak er oppfunnet.",
    "h1": "Dine brikker",
    "h2": "Tid",
    "rv": "Motstander"
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
    var LIM = 240;
    var b = [], turn = 'p', sel = null, rt = 0, t = 0, kr = 4, kc = 1, lastm = null, mvs = [];
    function inb(r, c) { return r >= 0 && c >= 0 && r < 6 && c < 6; }
    function dirsOf(p) { var s = p > 0 ? -1 : 1; return Math.abs(p) === 2 ? [[-1, -1], [-1, 1], [1, -1], [1, 1]] : [[s, -1], [s, 1]]; }
    function hasCap(caps, r, c) { for (var i = 0; i < caps.length; i++) if (caps[i][0] === r && caps[i][1] === c) return true; return false; }
    function jumps(bd, r, c, p, caps, path, out) {
      var side = p > 0 ? 1 : -1, found = false, ds = dirsOf(p), i;
      for (i = 0; i < ds.length; i++) { var mr = r + ds[i][0], mc = c + ds[i][1], lr = r + 2 * ds[i][0], lc = c + 2 * ds[i][1];
        if (inb(lr, lc) && bd[mr][mc] * side < 0 && !bd[lr][lc] && !hasCap(caps, mr, mc)) { found = true; var c2 = caps.concat([[mr, mc]]), p2 = path.concat([[lr, lc]]); if (Math.abs(p) === 1 && lr === (side > 0 ? 0 : 5)) out.push({ path: p2, caps: c2 }); else jumps(bd, lr, lc, p, c2, p2, out); } }
      if (!found && path.length > 1) out.push({ path: path, caps: caps });
    }
    function gen(bd, side) {
      var out = [], r, c, i;
      for (r = 0; r < 6; r++) for (c = 0; c < 6; c++) { var p = bd[r][c]; if (p * side > 0) { var b2 = bd.map(function (x) { return x.slice(); }); b2[r][c] = 0; jumps(b2, r, c, p, [], [[r, c]], out); } }
      if (out.length) return out;
      for (r = 0; r < 6; r++) for (c = 0; c < 6; c++) { p = bd[r][c]; if (p * side > 0) { var ds = dirsOf(p); for (i = 0; i < ds.length; i++) { var nr = r + ds[i][0], nc = c + ds[i][1]; if (inb(nr, nc) && !bd[nr][nc]) out.push({ path: [[r, c], [nr, nc]], caps: [] }); } } }
      return out;
    }
    function apply(bd, m) {
      var b2 = bd.map(function (x) { return x.slice(); }), f = m.path[0], to = m.path[m.path.length - 1], p = b2[f[0]][f[1]]; b2[f[0]][f[1]] = 0;
      m.caps.forEach(function (c) { b2[c[0]][c[1]] = 0; });
      if (Math.abs(p) === 1 && to[0] === (p > 0 ? 0 : 5)) p *= 2; b2[to[0]][to[1]] = p; return b2;
    }
    function count(bd, side) { var n = 0; for (var r = 0; r < 6; r++) for (var c = 0; c < 6; c++) if (bd[r][c] * side > 0) n++; return n; }
    function reset() {
      b = []; for (var r = 0; r < 6; r++) { var row = []; for (var c = 0; c < 6; c++) row.push(0); b.push(row); }
      for (r = 0; r < 2; r++) for (c = 0; c < 6; c++) if ((r + c) % 2 === 1) b[r][c] = -1;
      for (r = 4; r < 6; r++) for (c = 0; c < 6; c++) if ((r + c) % 2 === 1) b[r][c] = 1;
      turn = 'p'; sel = null; rt = 0; t = 0; kr = 4; kc = 1; lastm = null; mvs = gen(b, 1); st = 'play';
    }
    function finish(mover) {
      var nx = gen(b, mover === 'p' ? -1 : 1); if (!nx.length) { st = mover === 'p' ? 'win' : 'lose'; if (api.nota) api.nota(st === 'win' ? 700 : 100, 0.3, st === 'win' ? 'sine' : 'sawtooth', 0.07); return true; } return false;
    }
    function doMove(m, who) { b = apply(b, m); lastm = m; if (api.nota) api.nota(who === 'p' ? 380 : 300, 0.1, m.caps.length ? 'sawtooth' : 'triangle', 0.05); sel = null; if (finish(who)) return; if (who === 'p') { turn = 'r'; rt = 0.7; } else { turn = 'p'; mvs = gen(b, 1); } }
    function rival() {
      var ms = gen(b, -1); if (!ms.length) { st = 'win'; return; }
      var pick = ms[Math.floor(Math.random() * ms.length)];
      if (Math.random() < 0.3) { var safe = ms.filter(function (m) { var nb = apply(b, m), pm = gen(nb, 1); return !(pm.length && pm[0].caps.length); }); if (safe.length) pick = safe[Math.floor(Math.random() * safe.length)]; }
      doMove(pick, 'r');
    }
    function act(r, c) {
      if (st !== 'play' || turn !== 'p' || !inb(r, c)) return;
      var i; if (b[r][c] > 0) { var any = mvs.some(function (m) { return m.path[0][0] === r && m.path[0][1] === c; }); sel = any ? [r, c] : null; return; }
      if (sel) { for (i = 0; i < mvs.length; i++) { var m = mvs[i], to = m.path[m.path.length - 1]; if (m.path[0][0] === sel[0] && m.path[0][1] === sel[1] && to[0] === r && to[1] === c) { doMove(m, 'p'); return; } } sel = null; }
    }
    function lay() { var W = api.w, H = api.h, cs = Math.max(34, Math.min((W - 16) / 6, (H - 120) / 6, 84)); return { W: W, H: H, cs: cs, x: (W - cs * 6) / 2, y: Math.max(68, (H - cs * 6) / 2 + 14) }; }
    function pos(r, c) { var L = lay(); return { x: L.x + (c + 0.5) * L.cs, y: L.y + (r + 0.5) * L.cs }; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, board: b.map(function (x) { return x.slice(); }), turn: turn, moves: mvs, gen: gen, apply: apply, pos: pos, t: t, sel: sel }; },
      down: function (x, y) { if (menu()) return; var L = lay(); act(Math.floor((y - L.y) / L.cs), Math.floor((x - L.x) / L.cs)); },
      move: function () {}, up: function () {},
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'ArrowLeft' || k === 'KeyA') kc = Math.max(0, kc - 1); else if (k === 'ArrowRight' || k === 'KeyD') kc = Math.min(5, kc + 1); else if (k === 'ArrowUp' || k === 'KeyW') kr = Math.max(0, kr - 1); else if (k === 'ArrowDown' || k === 'KeyS') kr = Math.min(5, kr + 1); else if (k === 'Space' || k === 'Enter') act(kr, kc); },
      update: function (dt) { if (st !== 'play') return; t += dt; if (t >= LIM) { st = 'lose'; return; } if (turn === 'r') { rt -= dt; if (rt <= 0) rival(); } },
      draw: function () {
        var L = lay(), cs = L.cs, r, c, i;
        bg('#1a1f2e', '#07090f');
        for (r = 0; r < 6; r++) for (c = 0; c < 6; c++) { g.fillStyle = (r + c) % 2 ? '#4a4a6a' : '#cfc8b0'; g.fillRect(L.x + c * cs, L.y + r * cs, cs, cs); }
        if (sel) { g.fillStyle = 'rgba(255,216,138,.35)'; g.fillRect(L.x + sel[1] * cs, L.y + sel[0] * cs, cs, cs); mvs.forEach(function (m) { if (m.path[0][0] === sel[0] && m.path[0][1] === sel[1]) { var to = m.path[m.path.length - 1]; g.fillStyle = 'rgba(111,211,160,.65)'; g.beginPath(); g.arc(L.x + (to[1] + 0.5) * cs, L.y + (to[0] + 0.5) * cs, cs * 0.13, 0, 6.283); g.fill(); } }); }
        for (r = 0; r < 6; r++) for (c = 0; c < 6; c++) { var p = b[r][c]; if (!p) continue; var q = pos(r, c); g.fillStyle = p > 0 ? '#f3ecd2' : '#2a1f3a'; g.beginPath(); g.arc(q.x, q.y, cs * 0.36, 0, 6.283); g.fill(); g.strokeStyle = p > 0 ? '#a69660' : '#8a6ad0'; g.lineWidth = 3; g.stroke(); if (Math.abs(p) === 2) { g.fillStyle = p > 0 ? '#a67c2a' : '#c9b3f2'; g.beginPath(); g.moveTo(q.x - cs * 0.18, q.y + cs * 0.1); g.lineTo(q.x - cs * 0.18, q.y - cs * 0.12); g.lineTo(q.x - cs * 0.06, q.y); g.lineTo(q.x, q.y - cs * 0.16); g.lineTo(q.x + cs * 0.06, q.y); g.lineTo(q.x + cs * 0.18, q.y - cs * 0.12); g.lineTo(q.x + cs * 0.18, q.y + cs * 0.1); g.closePath(); g.fill(); } }
        if (st === 'play' && turn === 'p') { g.strokeStyle = 'rgba(255,216,138,.8)'; g.lineWidth = 2; g.strokeRect(L.x + kc * cs + 2, L.y + kr * cs + 2, cs - 4, cs - 4); }
        bar(api.w / 2 - 110, api.h - 14, 220, 5, (LIM - t) / LIM, LIM - t < 20 ? '#c0392b' : '#ffd88a');
        txt(T.rv + ': ' + count(b, -1), api.w - 20, 32, 15, '#c9b3f2', 'right'); hud(T.h1 + ' ' + count(b, 1), T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };
  }
});
