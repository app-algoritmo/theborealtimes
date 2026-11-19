/* Gull-Þóris saga — as moedas do dragão (invenção). */
BTJogo.registrar({
  canvas: 'jogo-gullthoris',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As moedas do dragão",
    "sub": "Moedas de ouro estão espalhadas por um tabuleiro. Toque numa moeda e depois numa casa vazia, a duas casas de distância em linha reta, com uma moeda no meio: a moeda salta e leva a do meio embora. Deixe só uma moeda no tabuleiro. O tempo é limitado. São 3 tabuleiros. Se não houver mais saltos, o tabuleiro recomeça.",
    "perdeu": "O tempo acabou",
    "v1": "Só uma moeda restou!",
    "v2": "Na Gull-Þóris saga, Þórir obtém ouro de dragões numa caverna e depois briga com Hallr pela partilha; no fim, corre o boato de que virou dragão. Saltar moedas é invenção.",
    "h1": "Tabuleiro",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The dragon’s coins",
    "sub": "Gold coins are scattered over a board. Tap a coin and then an empty square two squares away in a straight line, with a coin in between: the coin jumps and takes the middle one away. Leave only one coin on the board. Time is limited. There are 3 boards. If no jumps remain, the board starts over.",
    "perdeu": "Time ran out",
    "v1": "Only one coin left!",
    "v2": "In Gull-Þóris saga, Þórir obtains gold from dragons in a cave and later quarrels with Hallr over its division; at the end, a rumour says he became a dragon. Jumping coins is invented.",
    "h1": "Board",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Dragens mynter",
    "sub": "Gullmynter ligger spredt utover et brett. Trykk på en mynt og så på en tom rute to ruter unna i rett linje, med en mynt imellom: mynten hopper og tar med seg den i midten. La bare én mynt bli igjen på brettet. Tiden er begrenset. Det er 3 brett. Hvis det ikke er flere hopp, starter brettet på nytt.",
    "perdeu": "Tiden tok slutt",
    "v1": "Bare én mynt igjen!",
    "v2": "I Gull-Þóris saga henter Þórir gull fra drager i en hule og krangler siden med Hallr om delingen; til slutt går det rykter om at han ble en drage. Å hoppe mynter er oppfunnet.",
    "h1": "Brett",
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
    var NL = 3, lvl = 0, t = 0, pend = 0;
    function lvlUp() { lvl++; pend = 0.9; if (api.nota) api.nota(520, 0.2, 'triangle', 0.07); }
    function tick(dt, load) { if (st !== 'play') return; t += dt; if (pend > 0) { pend -= dt; if (pend <= 0) { if (lvl >= NL) st = 'win'; else load(lvl); } } if (st === 'play' && t >= LIM) st = 'lose'; }
    function foot() { bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 60 ? '#c0392b' : '#ffd88a'); }
    function hh() { hud(T.h1 + ' ' + Math.min(lvl + 1, NL) + '/' + NL, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false); }
    function glay(R, C, top, bot) { var W = api.w, H = api.h, s = Math.min((W - 24) / C, (H - top - bot) / R, 96); return { s: s, x0: (W - s * C) / 2, y0: top + ((H - top - bot) - s * R) / 2 }; }
    function sh(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
    var NS = [[5, 5, 5], [6, 6, 7], [7, 7, 9]], LIM = 420, DX = [0, 1, 0, -1], DY = [-1, 0, 1, 0];
    var R = 5, C = 5, cell = [], init = [], sol = [], moves = 0, sel = -1;
    function gen(R0, C0, k) {
      for (var tries = 0; tries < 800; tries++) {
        var b = [], i, d; for (i = 0; i < R0 * C0; i++) b.push(0);
        b[Math.floor(Math.random() * R0 * C0)] = 1; var rev = [], cnt = 1;
        while (cnt < k) {
          var opts = [];
          for (i = 0; i < R0 * C0; i++) if (b[i]) {
            var x = i % C0, y = Math.floor(i / C0);
            for (d = 0; d < 4; d++) {
              var cx = x + 2 * DX[d], cy = y + 2 * DY[d]; if (cx < 0 || cy < 0 || cx >= C0 || cy >= R0) continue;
              var bi = (y + DY[d]) * C0 + x + DX[d], ci = cy * C0 + cx; if (!b[bi] && !b[ci]) opts.push([i, bi, ci]);
            }
          }
          if (!opts.length) break;
          var o = opts[Math.floor(Math.random() * opts.length)]; b[o[0]] = 0; b[o[1]] = 1; b[o[2]] = 1; cnt++; rev.push([o[2], o[0]]);
        }
        if (cnt === k) { rev.reverse(); return { b: b, sol: rev }; }
      }
      return null;
    }
    function load(i) { var s = NS[i], p; R = s[0]; C = s[1]; p = gen(R, C, s[2]); init = p.b.slice(); sol = p.sol; cell = init.slice(); moves = 0; sel = -1; }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function pegs() { var n = 0; for (var i = 0; i < cell.length; i++) n += cell[i]; return n; }
    function canJump(a, b) {
      var ax = a % C, ay = Math.floor(a / C), bx = b % C, by = Math.floor(b / C), dx = bx - ax, dy = by - ay;
      if (!((Math.abs(dx) === 2 && dy === 0) || (Math.abs(dy) === 2 && dx === 0))) return -1;
      var m = (ay + dy / 2) * C + ax + dx / 2; return cell[a] && !cell[b] && cell[m] ? m : -1;
    }
    function anyMove() { for (var a = 0; a < cell.length; a++) if (cell[a]) for (var b = 0; b < cell.length; b++) if (canJump(a, b) >= 0) return true; return false; }
    function tap(i) {
      if (pend > 0 || st !== 'play') return;
      if (sel < 0) { if (cell[i]) sel = i; return; }
      if (i === sel) { sel = -1; return; }
      if (cell[i]) { sel = i; return; }
      var m = canJump(sel, i); if (m < 0) { sel = -1; return; }
      cell[sel] = 0; cell[m] = 0; cell[i] = 1; moves++; sel = -1; if (api.nota) api.nota(300, 0.05, 'square', 0.03);
      if (pegs() === 1) lvlUp(); else if (!anyMove()) { cell = init.slice(); moves = 0; }
    }
    function pos() { var L = glay(R, C, 70, 30), a = []; for (var i = 0; i < R * C; i++) a.push({ x: L.x0 + (i % C + 0.5) * L.s, y: L.y0 + (Math.floor(i / C) + 0.5) * L.s }); return a; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lvl: lvl, pend: pend, sol: sol.map(function (m) { return m.slice(); }), moves: moves, sel: sel, pos: pos() }; },
      down: function (x, y) { if (menu()) return; var L = glay(R, C, 70, 30), c = Math.floor((x - L.x0) / L.s), r = Math.floor((y - L.y0) / L.s); if (c < 0 || r < 0 || c >= C || r >= R) return; tap(r * C + c); },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) { tick(dt, load); },
      draw: function () {
        var L = glay(R, C, 70, 30), i, s = L.s; bg('#3a2a1a', '#120c06');
        for (i = 0; i < R * C; i++) {
          var cx = L.x0 + (i % C + 0.5) * s, cy = L.y0 + (Math.floor(i / C) + 0.5) * s;
          g.fillStyle = 'rgba(0,0,0,.45)'; g.beginPath(); g.arc(cx, cy, s * 0.4, 0, 7); g.fill();
          if (cell[i]) {
            g.fillStyle = sel === i ? '#fff0b0' : '#e0b040'; g.beginPath(); g.arc(cx, cy, s * 0.32, 0, 7); g.fill();
            g.strokeStyle = '#8a6418'; g.lineWidth = 3; g.beginPath(); g.arc(cx, cy, s * 0.32, 0, 7); g.stroke();
            g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.arc(cx - s * 0.09, cy - s * 0.09, s * 0.09, 0, 7); g.fill();
          } else if (sel >= 0 && canJump(sel, i) >= 0) { g.fillStyle = 'rgba(255,216,138,.55)'; g.beginPath(); g.arc(cx, cy, s * 0.12, 0, 7); g.fill(); }
        }
        txt(String(pegs()), api.w / 2, api.h - 20, 16, '#f3ecd2');
        foot(); hh(); fim(st);
      }
    };

  }
});
