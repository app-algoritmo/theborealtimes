/* Hœnsa-Þóris saga — os fardos de feno (invenção). */
BTJogo.registrar({
  canvas: 'jogo-haensa',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os fardos de feno",
    "sub": "Fardos de feno de tipos diferentes estão misturados em estacas. Toque numa estaca para erguer o fardo de cima e toque em outra para pousá-lo. Só dá para pousar num lugar vazio, ou sobre um fardo do mesmo tipo, e cada estaca comporta quatro fardos. Deixe cada estaca com um só tipo. O número de movimentos e o tempo são limitados. São 3 rodadas.",
    "perdeu": "Os movimentos ou o tempo acabaram",
    "v1": "Feno bem guardado!",
    "v2": "Na Hœnsa-Þóris saga, o mercador enriquecido Hœnsa-Þórir se recusa a vender feno aos vizinhos num inverno; eles o tomam, e ele os queima vivos numa casa de fazenda. Empilhar fardos é invenção.",
    "h1": "Rodada",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The hay bales",
    "sub": "Hay bales of different kinds are mixed on posts. Tap a post to lift its top bale and tap another to set it down. You can only set a bale on an empty post or on a bale of the same kind, and each post holds four bales. Leave each post with a single kind. The number of moves and the time are limited. There are 3 rounds.",
    "perdeu": "The moves or the time ran out",
    "v1": "Hay well stored!",
    "v2": "In Hœnsa-Þóris saga, the enriched merchant Hœnsa-Þórir refuses to sell hay to his neighbours one winter; they take it, and he burns them alive in a farmhouse. Stacking bales is invented.",
    "h1": "Round",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Høyballene",
    "sub": "Høyballer av ulike slag ligger blandet på staker. Trykk på en stake for å løfte den øverste ballen og trykk på en annen for å sette den ned. Du kan bare sette en ball på en tom stake eller på en ball av samme slag, og hver stake rommer fire baller. La hver stake ha bare ett slag. Antall trekk og tiden er begrenset. Det er 3 runder.",
    "perdeu": "Trekkene eller tiden tok slutt",
    "v1": "Høyet er godt lagret!",
    "v2": "I Hœnsa-Þóris saga nekter den rike kjøpmannen Hœnsa-Þórir å selge høy til naboene en vinter; de tar det, og han brenner dem inne på en gård. Å stable baller er oppfunnet.",
    "h1": "Runde",
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
    var NC = [3, 4, 5], NL = 3, LIM = 420, CAP = 4, COL = ['#d9b44a', '#c0723a', '#8a9a4a', '#9a6ab0', '#5a8ab0'], SYM = ['●', '■', '▲', '◆', '★'];
    var lvl = 0, tb = [], sol = [], lim = 0, moves = 0, sel = -1, t = 0, pend = 0;
    function canMove(a, b) { if (a === b || !tb[a].length || tb[b].length >= CAP) return false; return !tb[b].length || tb[b][tb[b].length - 1] === tb[a][tb[a].length - 1]; }
    function done() { for (var i = 0; i < tb.length; i++) { var q = tb[i]; if (!q.length) continue; if (q.length !== CAP) return false; for (var j = 1; j < CAP; j++) if (q[j] !== q[0]) return false; } return true; }
    function load(i) {
      for (;;) {
        var nc = NC[i], k, j; tb = []; for (k = 0; k < nc; k++) { var q = []; for (j = 0; j < CAP; j++) q.push(k); tb.push(q); } tb.push([]); tb.push([]);
        var seq = [], steps = 22 + i * 10, tries = 0;
        while (seq.length < steps && tries++ < 2000) {
          var B = (Math.random() * tb.length) | 0, A = (Math.random() * tb.length) | 0; if (A === B || !tb[B].length || tb[A].length >= CAP) continue;
          if (tb[B].length > 1 && tb[B][tb[B].length - 2] !== tb[B][tb[B].length - 1]) continue;
          if (seq.length && seq[seq.length - 1][0] === A && seq[seq.length - 1][1] === B) continue;
          tb[A].push(tb[B].pop()); seq.push([B, A]);
        }
        if (!done()) { sol = seq.slice().reverse().map(function (m) { return [m[1], m[0]]; }); break; }
      }
      lim = sol.length + 8; moves = 0; sel = -1;
    }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function lay() { var W = api.w, H = api.h, nt = NC[2] + 2, tw = Math.min((W - 20) / nt, 84), bh = Math.min(34, (H - 190) / CAP); return { tw: tw, bh: bh, x0: (W - tw * tb.length) / 2, base: Math.min(H - 70, 80 + CAP * bh + 24) }; }
    function tpos(k) { var L = lay(); return { x: L.x0 + L.tw * (k + 0.5), y: L.base - L.bh * 1.5 }; }
    function tap(k) {
      if (pend > 0 || st !== 'play') return;
      if (sel < 0) { if (tb[k].length) sel = k; return; }
      if (sel === k) { sel = -1; return; }
      if (!canMove(sel, k)) { sel = -1; return; }
      tb[k].push(tb[sel].pop()); moves++; sel = -1; if (api.nota) api.nota(260, 0.05, 'square', 0.03);
      if (done()) { lvl++; pend = 0.9; if (api.nota) api.nota(520, 0.2, 'triangle', 0.07); } else if (moves >= lim) st = 'lose';
    }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lvl: lvl, tb: tb.map(function (q) { return q.slice(); }), sol: sol.map(function (m) { return m.slice(); }), moves: moves, lim: lim, sel: sel, pos: tb.map(function (q, k) { return tpos(k); }), pend: pend }; },
      down: function (x, y) { if (menu()) return; var L = lay(), k = Math.floor((x - L.x0) / L.tw); if (k < 0 || k >= tb.length) return; tap(k); },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) {
        if (st !== 'play') return; t += dt;
        if (pend > 0) { pend -= dt; if (pend <= 0) { if (lvl >= NL) st = 'win'; else load(lvl); } }
        if (st === 'play' && t >= LIM) st = 'lose';
      },
      draw: function () {
        var L = lay(), k, j; bg('#2c2a1c', '#0d0c06');
        for (k = 0; k < tb.length; k++) {
          var x = L.x0 + L.tw * k + L.tw / 2;
          g.fillStyle = 'rgba(255,255,255,.06)'; rr(x - L.tw * 0.38, L.base - CAP * L.bh - 8, L.tw * 0.76, CAP * L.bh + 14, 10); g.fill();
          if (sel === k) { g.strokeStyle = '#ffd88a'; g.lineWidth = 3; rr(x - L.tw * 0.38, L.base - CAP * L.bh - 8, L.tw * 0.76, CAP * L.bh + 14, 10); g.stroke(); }
          for (j = 0; j < tb[k].length; j++) { var c = tb[k][j]; g.fillStyle = COL[c]; rr(x - L.tw * 0.32, L.base - (j + 1) * L.bh, L.tw * 0.64, L.bh - 4, 7); g.fill(); txt(SYM[c], x, L.base - (j + 0.5) * L.bh - 2, L.bh * 0.5, 'rgba(0,0,0,.55)'); }
        }
        txt(moves + '/' + lim, api.w / 2, L.base + 34, 18, moves >= lim - 2 ? '#ff9a8d' : '#f3ecd2');
        bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 60 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + Math.min(lvl + 1, NL) + '/' + NL, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };

  }
});
