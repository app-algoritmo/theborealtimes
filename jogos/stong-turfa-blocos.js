/* Stöng, fazenda soterrada pelo Hekla — corte blocos de turfa sem ficar com o último (invenção). */
BTJogo.registrar({
  canvas: 'jogo-stong',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os blocos de turfa",
    "sub": "Toque num bloco: ele e todos os blocos acima e à direita dele são cortados. Depois joga o rival. Quem for obrigado a pegar o bloco escuro, no canto de baixo à esquerda, perde. Você começa. Vença em até 120 segundos. (Teclado: setas movem o cursor, Espaço corta.)",
    "perdeu": "Você ficou com o último bloco",
    "v1": "O rival ficou com o último bloco!",
    "v2": "No vale de Þjórsárdalur, a cinza do Hekla cobriu fazendas medievais. O jogo de cortar blocos de turfa é invenção.",
    "h1": "Blocos",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The turf blocks",
    "sub": "Tap a block: it and every block above and to the right of it are cut away. Then the rival plays. Whoever is forced to take the dark block, in the bottom-left corner, loses. You start. Win within 120 seconds. (Keyboard: arrows move the cursor, Space cuts.)",
    "perdeu": "You were left with the last block",
    "v1": "The rival got the last block!",
    "v2": "In the valley of Þjórsárdalur, ash from Hekla covered medieval farms. The game of cutting turf blocks is invented.",
    "h1": "Blocks",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Torvblokkene",
    "sub": "Trykk på en blokk: den og alle blokker over og til høyre for den skjæres bort. Så spiller motstanderen. Den som må ta den mørke blokka, nede i venstre hjørne, taper. Du begynner. Vinn innen 120 sekunder. (Tastatur: piler flytter markøren, mellomrom skjærer.)",
    "perdeu": "Du satt igjen med den siste blokka",
    "v1": "Motstanderen fikk den siste blokka!",
    "v2": "I dalen Þjórsárdalur dekket aske fra Hekla middelalderske gårder. Spillet med å skjære torvblokker er oppfunnet.",
    "h1": "Blokker",
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
    var R = 5, C = 6, LIM = 120, memo = {};
    var h = [], turn = 'p', rt = 0, t = 0, kr = 2, kc = 3, lastc = null;
    function key(a) { return a.join(''); }
    function cut(a, r, c) { var b = a.slice(); for (var i = c; i < C; i++) b[i] = Math.min(b[i], r); return b; }
    function moves(a) { var o = []; for (var c = 0; c < C; c++) for (var r = 0; r < a[c]; r++) o.push([r, c]); return o; }
    function winning(a) { var k = key(a); if (memo[k] !== undefined) return memo[k]; var w = false, ms = moves(a); for (var i = 0; i < ms.length; i++) { if (ms[i][0] === 0 && ms[i][1] === 0) continue; if (!winning(cut(a, ms[i][0], ms[i][1]))) { w = true; break; } } memo[k] = w; return w; }
    function winmove(a) { var ms = moves(a); for (var i = 0; i < ms.length; i++) { if (ms[i][0] === 0 && ms[i][1] === 0) continue; if (!winning(cut(a, ms[i][0], ms[i][1]))) return ms[i]; } return null; }
    function reset() { h = []; for (var i = 0; i < C; i++) h.push(R); turn = 'p'; rt = 0; t = 0; kr = 2; kc = 3; st = 'play'; }
    function total() { var n = 0; for (var i = 0; i < C; i++) n += h[i]; return n; }
    function take(r, c, who) {
      if (r < 0 || c < 0 || c >= C || r >= h[c]) return false;
      if (r === 0 && c === 0) { st = who === 'p' ? 'lose' : 'win'; if (api.nota) api.nota(st === 'win' ? 700 : 100, 0.3, st === 'win' ? 'sine' : 'sawtooth', 0.07); return true; }
      h = cut(h, r, c); lastc = [r, c]; if (api.nota) api.nota(who === 'p' ? 380 : 300, 0.1, 'triangle', 0.05);
      if (who === 'p') { turn = 'r'; rt = 0.7; } else turn = 'p'; return true;
    }
    function rival() {
      var m = null; if (winning(h) && Math.random() < 0.6) m = winmove(h);
      if (!m) { var ms = moves(h).filter(function (p) { return !(p[0] === 0 && p[1] === 0); }); m = ms.length ? ms[Math.floor(Math.random() * ms.length)] : [0, 0]; }
      take(m[0], m[1], 'r');
    }
    function lay() { var W = api.w, H = api.h, cs = Math.max(34, Math.min((W - 30) / C, (H - 140) / R, 72)); return { W: W, H: H, cs: cs, x: (W - cs * C) / 2, y: Math.max(78, (H - cs * R) / 2 + 14), by: 0 }; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, h: h.slice(), R: R, C: C, turn: turn, t: t, pos: function (r, c) { return { x: L.x + (c + 0.5) * L.cs, y: L.y + (R - 1 - r + 0.5) * L.cs }; } }; },
      down: function (x, y) { if (menu()) return; if (st !== 'play' || turn !== 'p') return; var L = lay(); take(R - 1 - Math.floor((y - L.y) / L.cs), Math.floor((x - L.x) / L.cs), 'p'); },
      move: function () {}, up: function () {},
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'ArrowLeft' || k === 'KeyA') kc = Math.max(0, kc - 1); else if (k === 'ArrowRight' || k === 'KeyD') kc = Math.min(C - 1, kc + 1); else if (k === 'ArrowUp' || k === 'KeyW') kr = Math.min(R - 1, kr + 1); else if (k === 'ArrowDown' || k === 'KeyS') kr = Math.max(0, kr - 1); else if ((k === 'Space' || k === 'Enter') && turn === 'p') take(kr, kc, 'p'); },
      update: function (dt) { if (st !== 'play') return; t += dt; if (t >= LIM) { st = 'lose'; return; } if (turn === 'r') { rt -= dt; if (rt <= 0) rival(); } },
      draw: function () {
        var L = lay(), cs = L.cs, r, c;
        bg('#2a3a2a', '#0c140c');
        g.fillStyle = '#d8d0b8'; g.fillRect(0, L.y + R * cs + 8, api.w, 3);
        for (c = 0; c < C; c++) for (r = 0; r < h[c]; r++) { var x = L.x + c * cs, y = L.y + (R - 1 - r) * cs; g.fillStyle = (r === 0 && c === 0) ? '#5a1f1f' : ((r + c) % 2 ? '#6f5a32' : '#7a6438'); rr(x + 2, y + 2, cs - 4, cs - 4, 6); g.fill(); g.fillStyle = (r === 0 && c === 0) ? '#a0463a' : '#4f8a3a'; g.fillRect(x + 4, y + 3, cs - 8, 7); if (r === 0 && c === 0) { txt('×', x + cs / 2, y + cs / 2 + 12, 34, '#f3ecd2'); } }
        if (st === 'play' && turn === 'p') { g.strokeStyle = 'rgba(255,216,138,.8)'; g.lineWidth = 2; if (kr < h[kc]) g.strokeRect(L.x + kc * cs + 1, L.y + (R - 1 - kr) * cs + 1, cs - 2, cs - 2); }
        txt(turn === 'p' ? '▶' : '…', api.w - 30, 34, 20, '#ffd88a');
        bar(api.w / 2 - 110, api.h - 14, 220, 5, (LIM - t) / LIM, LIM - t < 15 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + total(), T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };
  }
});
