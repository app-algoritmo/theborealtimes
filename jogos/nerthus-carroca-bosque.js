/* Nerthus e a carroça sagrada — puzzle de blocos deslizantes (invenção). */
BTJogo.registrar({
  canvas: 'jogo-nerthus',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A carroça de Nerthus",
    "sub": "Arraste as peças para frente ou para trás, só na direção em que estão deitadas ou em pé. Abra caminho até a carroça vermelha sair pela direita. Cada deslize conta um lance, e você tem até 24. (Teclado: Tab escolhe a peça, setas movem.)",
    "perdeu": "Os lances acabaram ou o tempo acabou",
    "v1": "A carroça saiu do bosque!",
    "v2": "Tácito conta que Nerthus percorria a terra numa carroça coberta, puxada por vacas, e que a paz reinava enquanto ela passava. O bosque de peças é invenção.",
    "h1": "Lances",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Nerthus's wagon",
    "sub": "Drag the pieces forward or back, only in the direction they lie or stand. Clear a path so the red wagon leaves on the right. Each slide counts as one move, and you have up to 24. (Keyboard: Tab picks the piece, arrows move.)",
    "perdeu": "The moves ran out or the time ran out",
    "v1": "The wagon left the grove!",
    "v2": "Tacitus says Nerthus travelled the land in a covered wagon drawn by heifers, and that peace reigned while she passed. The grove of pieces is invented.",
    "h1": "Moves",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Nerthus’ vogn",
    "sub": "Dra brikkene fram eller tilbake, bare i den retningen de ligger eller står. Rydd vei så den røde vognen kommer ut til høyre. Hvert skyv teller som ett trekk, og du har opptil 24. (Tastatur: Tab velger brikken, piler flytter.)",
    "perdeu": "Trekkene tok slutt eller tiden tok slutt",
    "v1": "Vognen kom ut av lunden!",
    "v2": "Tacitus forteller at Nerthus reiste gjennom landet i en tildekket vogn trukket av kviger, og at freden rådde mens hun fór forbi. Lunden av brikker er oppfunnet.",
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
    var N = 6, LIM = 240, LMOVES = 24;
    var PUZ = [[[2, 2, 2, 1], [1, 0, 2, 1], [4, 3, 2, 1], [0, 4, 3, 0], [5, 1, 2, 1], [3, 2, 2, 0], [4, 0, 2, 1], [2, 1, 2, 0], [2, 0, 2, 0], [1, 5, 3, 0]], [[2, 0, 2, 1], [0, 3, 3, 0], [3, 1, 2, 1], [4, 1, 2, 0], [1, 5, 2, 0], [3, 4, 3, 0], [5, 2, 2, 1]], [[2, 0, 2, 1], [0, 4, 3, 0], [3, 1, 2, 0], [4, 4, 2, 1], [1, 3, 2, 0], [0, 1, 3, 1], [4, 2, 2, 0]], [[2, 0, 2, 1], [1, 5, 3, 0], [4, 2, 3, 1], [1, 2, 3, 0], [5, 1, 2, 1], [5, 4, 2, 1], [2, 4, 2, 0]]];
    var COLS = ['#c0392b', '#d9a93a', '#4a98b8', '#4b8a4b', '#7b3f9e', '#a0763a', '#3f8f78', '#c9893a', '#5b6fb5'];
    var pcs = [], moves = 0, t = 0, drag = null, kidx = 0;
    function reset() { var q = PUZ[Math.floor(Math.random() * PUZ.length)]; pcs = q.map(function (p, i) { return { r: p[0], c: p[1], L: p[2], h: p[3] === 1, dx: 0, i: i }; }); moves = 0; t = 0; drag = null; kidx = 0; st = 'play'; }
    function lay() { var W = api.w, H = api.h, cs = Math.max(34, Math.min((W - 24) / 6, (H - 112) / 6, 72)); return { cs: cs, x0: (W - cs * 6) / 2, y0: 78 }; }
    function grid(skip) { var o = {}; pcs.forEach(function (p) { if (p === skip) return; for (var k = 0; k < p.L; k++) o[(p.h ? p.r : p.r + k) * 6 + (p.h ? p.c + k : p.c)] = 1; }); return o; }
    function range(p) { var o = grid(p), lo = 0, hi = 0; while (true) { var nr = p.h ? p.r : p.r - lo - 1, nc = p.h ? p.c - lo - 1 : p.c; if ((p.h ? nc : nr) < 0 || o[nr * 6 + nc]) break; lo++; } while (true) { var er = p.h ? p.r : p.r + p.L + hi, ec = p.h ? p.c + p.L + hi : p.c; if ((p.h ? ec : er) > 5 || o[er * 6 + ec]) break; hi++; } return { lo: lo, hi: hi }; }
    function pos(p) { var L = lay(); return { x: L.x0 + (p.c + (p.h ? p.L / 2 : 0.5)) * L.cs, y: L.y0 + (p.r + (p.h ? 0.5 : p.L / 2)) * L.cs }; }
    function done() { if (pcs[0].c === 4) { st = 'win'; return true; } return false; }
    function commit(p, d) { if (!d) return; if (p.h) p.c += d; else p.r += d; moves++; if (api.nota) api.nota(260, 0.08, 'triangle', 0.05); if (!done() && moves >= LMOVES) st = 'lose'; }
    function at(x, y) { var L = lay(), c = Math.floor((x - L.x0) / L.cs), r = Math.floor((y - L.y0) / L.cs); if (c < 0 || r < 0 || c > 5 || r > 5) return null; for (var i = 0; i < pcs.length; i++) { var p = pcs[i]; for (var k = 0; k < p.L; k++) if ((p.h ? p.r : p.r + k) === r && (p.h ? p.c + k : p.c) === c) return p; } return null; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, moves: moves, t: t, cs: lay().cs, pcs: pcs.map(function (p) { var q = pos(p); return { r: p.r, c: p.c, L: p.L, h: p.h, x: q.x, y: q.y }; }), limit: LMOVES }; },
      down: function (x, y) { if (menu()) return; var p = at(x, y); if (p) { var L = lay(); drag = { p: p, x: x, y: y, rg: range(p) }; } },
      move: function (x, y) { if (!drag) return; var L = lay(), d = drag.p.h ? x - drag.x : y - drag.y; d = Math.max(-drag.rg.lo * L.cs, Math.min(drag.rg.hi * L.cs, d)); drag.p.dx = d; },
      up: function () { if (!drag) return; var L = lay(), p = drag.p, d = Math.round(p.dx / L.cs); p.dx = 0; drag = null; commit(p, d); },
      key: function (k, d) {
        if (!d) return; if (st !== 'play') { menu(); return; }
        if (k === 'Tab') { kidx = (kidx + 1) % pcs.length; return; }
        var p = pcs[kidx], dir = p.h ? { ArrowLeft: -1, ArrowRight: 1 }[k] : { ArrowUp: -1, ArrowDown: 1 }[k]; if (!dir) return;
        var rg = range(p); if ((dir < 0 && rg.lo > 0) || (dir > 0 && rg.hi > 0)) commit(p, dir);
      },
      update: function (dt) { if (st !== 'play') return; t += dt; if (t >= LIM) st = 'lose'; },
      draw: function () {
        var L = lay(), i; bg('#1d2a1f', '#0a120c');
        g.fillStyle = 'rgba(255,255,255,.07)'; rr(L.x0 - 6, L.y0 - 6, L.cs * 6 + 12, L.cs * 6 + 12, 10); g.fill();
        for (i = 0; i < 36; i++) { g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(L.x0 + (i % 6) * L.cs + 2, L.y0 + Math.floor(i / 6) * L.cs + 2, L.cs - 4, L.cs - 4); }
        g.fillStyle = '#ffd88a'; g.fillRect(L.x0 + L.cs * 6 + 2, L.y0 + L.cs * 2 + 6, 8, L.cs - 12);
        pcs.forEach(function (p, i) {
          var w = p.h ? p.L * L.cs : L.cs, h = p.h ? L.cs : p.L * L.cs, x = L.x0 + p.c * L.cs + (p.h ? p.dx : 0), y = L.y0 + p.r * L.cs + (p.h ? 0 : p.dx);
          g.fillStyle = i === 0 ? '#c0392b' : COLS[1 + (i % 8)]; rr(x + 3, y + 3, w - 6, h - 6, 10); g.fill();
          if (i === kidx && st === 'play') { g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 2; rr(x + 3, y + 3, w - 6, h - 6, 10); g.stroke(); }
          if (i === 0) txt('᛭', x + w / 2, y + h / 2 + 8, 24, '#fff');
        });
        bar(api.w / 2 - 110, api.h - 14, 220, 5, (LIM - t) / LIM, LIM - t < 40 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + moves + '/' + LMOVES, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };

  }
});
