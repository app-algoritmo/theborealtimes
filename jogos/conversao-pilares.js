/* A conversão da Islândia — mova os blocos de pilar em pilar. */
BTJogo.registrar({
  canvas: 'jogo-conversao-1000',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os quatro blocos",
    "sub": "Toque num pilar para pegar o bloco de cima e toque noutro pilar para soltá-lo. Nunca ponha um bloco maior sobre um menor. Leve os 4 blocos para o pilar da direita em até 22 jogadas.",
    "perdeu": "As jogadas ou o tempo acabaram",
    "v1": "Os blocos estão todos no pilar!",
    "v2": "No ano 1000, o Althing da Islândia decidiu que todos aceitariam o cristianismo. O quebra-cabeça dos pilares é invenção.",
    "h1": "No pilar",
    "h2": "Jogadas"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The four blocks",
    "sub": "Tap a pillar to pick up its top block and tap another pillar to drop it. Never put a larger block on a smaller one. Take all 4 blocks to the right-hand pillar in 22 moves or fewer.",
    "perdeu": "The moves or the time ran out",
    "v1": "All the blocks are on the pillar!",
    "v2": "In the year 1000, the Icelandic Althing decided that everyone would accept Christianity. The pillar puzzle is made up.",
    "h1": "On pillar",
    "h2": "Moves"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "De fire blokkene",
    "sub": "Trykk på en pilar for å ta den øverste blokken, og trykk på en annen pilar for å slippe den. Legg aldri en større blokk oppå en mindre. Flytt alle 4 blokkene til pilaren til høyre på maksimalt 22 trekk.",
    "perdeu": "Trekkene eller tiden var brukt opp",
    "v1": "Alle blokkene står på pilaren!",
    "v2": "I år 1000 bestemte det islandske Altinget at alle skulle ta imot kristendommen. Pilargåten er diktet opp.",
    "h1": "På pilaren",
    "h2": "Trekk"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "Los cuatro bloques",
    "sub": "Toca un pilar para coger el bloque de arriba y toca otro pilar para soltarlo. Nunca pongas un bloque mayor sobre uno menor. Lleva los 4 bloques al pilar de la derecha en un máximo de 22 jugadas.",
    "perdeu": "Se acabaron las jugadas o el tiempo",
    "v1": "¡Todos los bloques están en el pilar!",
    "v2": "En el año 1000, el Althing de Islandia decidió que todos aceptarían el cristianismo. El rompecabezas de los pilares es invención.",
    "h1": "En el pilar",
    "h2": "Jugadas"
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
    var ND = 4, MAXM = 22, LIM = 150;
    var tw = [[4, 3, 2, 1], [], []], sel = -1, moves = 0, tmr = LIM, bad = 0, pop = 0;
    function lay() { var W = api.w, H = api.h, pw = Math.min(190, (W - 20) / 3), bh = Math.max(24, Math.min(40, (H - 220) / 5)); return { pw: pw, bh: bh, by: H - 70, xs: [W / 2 - pw, W / 2, W / 2 + pw] }; }
    function setup() { tw = [[4, 3, 2, 1], [], []]; sel = -1; moves = 0; tmr = LIM; bad = 0; }
    function reset() { setup(); st = 'play'; }
    function pick(p) { if (st !== 'play') return; if (sel < 0) { if (tw[p].length) sel = p; return; } if (sel === p) { sel = -1; return; } var top = tw[sel][tw[sel].length - 1], dst = tw[p][tw[p].length - 1]; if (dst && dst < top) { bad = 0.4; if (api.nota) api.nota(120, 0.15, 'square', 0.05); sel = -1; return; } tw[p].push(tw[sel].pop()); sel = -1; moves++; if (api.nota) api.nota(300 + top * 40, 0.05, 'triangle', 0.04); if (tw[2].length === ND) { st = 'win'; return; } if (moves >= MAXM) st = 'lose'; }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, tw: tw.map(function (a) { return a.slice(); }), sel: sel, moves: moves, max: MAXM, tmr: tmr, pos: function (p) { return { x: L.xs[p], y: L.by - 60 }; } }; },
      down: function (x, y) { if (menu()) return; var L = lay(), best = 0; for (var i = 1; i < 3; i++) if (Math.abs(x - L.xs[i]) < Math.abs(x - L.xs[best])) best = i; pick(best); },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'Digit1' || k === '1') pick(0); else if (k === 'Digit2' || k === '2') pick(1); else if (k === 'Digit3' || k === '3') pick(2); },
      update: function (dt) { pop += dt; if (bad > 0) bad -= dt; if (st !== 'play') return; tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; } },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), p, i;
        bg('#1a2230', '#06080e');
        for (p = 0; p < 3; p++) { g.fillStyle = sel === p ? '#ffd88a' : '#6a6a72'; g.fillRect(L.xs[p] - 5, L.by - L.bh * 5.4, 10, L.bh * 5.4); g.fillStyle = '#4a4a52'; rr(L.xs[p] - L.pw * 0.46, L.by, L.pw * 0.92, 10, 4); g.fill();
          for (i = 0; i < tw[p].length; i++) { var v = tw[p][i], w = Math.min(L.pw * 0.9, 30 + v * 34) * (0.55 + 0.45 * v / 4) + 6, y = L.by - (i + 1) * (L.bh + 2), lift = (sel === p && i === tw[p].length - 1) ? -L.bh * 0.5 : 0; g.fillStyle = ['', '#c0392b', '#d08a2a', '#4a8ad0', '#7fa86a'][v]; rr(L.xs[p] - w / 2, y + lift, w, L.bh, 7); g.fill(); g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(L.xs[p] - w / 2 + 6, y + lift + 4, w - 12, 3); } }
        if (bad > 0) { g.fillStyle = 'rgba(192,57,43,' + bad + ')'; g.fillRect(0, 0, W, 4); }
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 30 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + tw[2].length + '/' + ND, T.h2 + ' ' + moves + '/' + MAXM, moves >= MAXM - 5);
        fim(st);
      }
    };
  }
});
