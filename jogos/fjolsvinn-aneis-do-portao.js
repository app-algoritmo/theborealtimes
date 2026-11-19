/* Fjölsvinnsmál — os anéis do portão (invenção). */
BTJogo.registrar({
  canvas: 'jogo-fjolsvinnsmal',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os anéis do portão",
    "sub": "O portão do castelo tem três hastes e uma pilha de anéis de tamanhos diferentes na haste da esquerda. Leve toda a pilha para a haste da direita. Toque numa haste para pegar o anel de cima e toque em outra para soltá-lo. Nunca ponha um anel maior sobre um menor. O número de movimentos e o tempo são limitados. São 3 rodadas, com 3, 4 e 5 anéis.",
    "perdeu": "Os movimentos ou o tempo acabaram",
    "v1": "O portão se abriu!",
    "v2": "Em Fjölsvinnsmál, o vigia Fjölsviðr pergunta o nome de Svipdagr, que o esconde até o fim; quando ele o diz, os portões se abrem e Menglöð o saúda. Mover anéis entre hastes é invenção.",
    "h1": "Rodada",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The rings of the gate",
    "sub": "The castle gate has three posts and a stack of rings of different sizes on the left post. Carry the whole stack to the right post. Tap a post to pick up its top ring and tap another to drop it. Never put a larger ring on a smaller one. The number of moves and the time are limited. There are 3 rounds, with 3, 4 and 5 rings.",
    "perdeu": "The moves or the time ran out",
    "v1": "The gate opened!",
    "v2": "In Fjölsvinnsmál, the watchman Fjölsviðr asks Svipdagr’s name, and Svipdagr hides it until the end; when he gives it, the gates open and Menglöð greets him. Moving rings between posts is invented.",
    "h1": "Round",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Portens ringer",
    "sub": "Slottsporten har tre stolper og en stabel med ringer i ulike størrelser på stolpen til venstre. Flytt hele stabelen til stolpen til høyre. Trykk på en stolpe for å ta den øverste ringen og trykk på en annen for å slippe den. Legg aldri en større ring oppå en mindre. Antall trekk og tiden er begrenset. Det er 3 runder, med 3, 4 og 5 ringer.",
    "perdeu": "Trekkene eller tiden tok slutt",
    "v1": "Porten åpnet seg!",
    "v2": "I Fjölsvinnsmál spør vokteren Fjölsviðr om Svipdagrs navn, og Svipdagr skjuler det til slutt; når han sier det, åpner portene seg og Menglöð hilser ham. Å flytte ringer mellom stolper er oppfunnet.",
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
    var ND = [3, 4, 5], NL = 3, LIM = 420;
    var lvl = 0, n = 0, peg = [[], [], []], sol = [], lim = 0, moves = 0, sel = -1, t = 0, pend = 0;
    function hn(k, a, b, c) { return k ? hn(k - 1, a, c, b).concat([[a, b]], hn(k - 1, c, b, a)) : []; }
    function load(i) { n = ND[i]; peg = [[], [], []]; for (var k = n; k >= 1; k--) peg[0].push(k); sol = hn(n, 0, 2, 1); lim = sol.length + 6; moves = 0; sel = -1; }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function lay() { var W = api.w, H = api.h, pw = Math.min((W - 20) / 3, 230); return { pw: pw, x0: (W - 3 * pw) / 2, base: H - 62, dh: Math.min(28, (H - 200) / (ND[2] + 1)), maxw: pw - 20 }; }
    function px(k) { var L = lay(); return { x: L.x0 + L.pw * (k + 0.5), y: L.base - 70 }; }
    function tap(k) {
      if (pend > 0 || st !== 'play') return;
      if (sel < 0) { if (peg[k].length) sel = k; return; }
      if (sel === k) { sel = -1; return; }
      var a = peg[sel], b = peg[k], d = a[a.length - 1];
      if (b.length && b[b.length - 1] < d) { sel = -1; return; }
      b.push(a.pop()); moves++; sel = -1; if (api.nota) api.nota(260, 0.05, 'square', 0.03);
      if (peg[2].length === n) { lvl++; pend = 0.9; if (api.nota) api.nota(520, 0.2, 'triangle', 0.07); }
      else if (moves >= lim) st = 'lose';
    }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lvl: lvl, peg: peg.map(function (p) { return p.slice(); }), sol: sol.map(function (m) { return m.slice(); }), moves: moves, lim: lim, sel: sel, pos: [0, 1, 2].map(px), pend: pend }; },
      down: function (x, y) { if (menu()) return; var L = lay(); tap(Math.max(0, Math.min(2, Math.floor((x - L.x0) / L.pw)))); },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) {
        if (st !== 'play') return; t += dt;
        if (pend > 0) { pend -= dt; if (pend <= 0) { if (lvl >= NL) st = 'win'; else load(lvl); } }
        if (st === 'play' && t >= LIM) st = 'lose';
      },
      draw: function () {
        var L = lay(), k, j; bg('#222a3a', '#090c14');
        g.fillStyle = '#3a2f26'; g.fillRect(0, L.base, api.w, api.h - L.base);
        for (k = 0; k < 3; k++) {
          var p = px(k); g.fillStyle = k === 2 ? '#8a6f3a' : '#6b5a45'; g.fillRect(p.x - 5, L.base - (ND[2] + 1) * L.dh - 10, 10, (ND[2] + 1) * L.dh + 10);
          if (k === 2) txt('★', p.x, L.base - (ND[2] + 1) * L.dh - 22, 18, '#ffd88a');
          for (j = 0; j < peg[k].length; j++) {
            var d = peg[k][j], w = 38 + d * (L.maxw - 38) / n, top = j === peg[k].length - 1;
            g.fillStyle = 'hsl(' + (200 + d * 28) + ',45%,52%)'; rr(p.x - w / 2, L.base - (j + 1) * L.dh, w, L.dh - 3, 7); g.fill();
            if (sel === k && top) { g.strokeStyle = '#ffd88a'; g.lineWidth = 3; rr(p.x - w / 2, L.base - (j + 1) * L.dh, w, L.dh - 3, 7); g.stroke(); }
          }
        }
        txt(moves + '/' + lim, api.w / 2, L.base + 22, 18, moves >= lim - 2 ? '#ff9a8d' : '#f3ecd2');
        bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 60 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + Math.min(lvl + 1, NL) + '/' + NL, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };

  }
});
