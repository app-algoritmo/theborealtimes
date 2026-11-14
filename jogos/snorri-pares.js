/* Os pares de Snorri — jogo da memória com runas. */
BTJogo.registrar({
  canvas: 'jogo-snorri',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os pares de Snorri",
    "sub": "Viradas as cartas, encontre os seis pares de runas. Toque em duas cartas por vez; se forem iguais, ficam abertas. Você tem catorze jogadas para provar a memória de um escaldo.",
    "perdeu": "A memória falhou",
    "v1": "Memória de escaldo!",
    "v2": "Snorri Sturluson reuniu os mitos nórdicos na Edda em Prosa, por volta de 1220. As cartas e as jogadas do jogo são invenção.",
    "h1": "Jogadas"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Snorri's pairs",
    "sub": "Cards face down, find the six pairs of runes. Tap two cards at a time; if they match, they stay open. You have fourteen moves to prove a skald's memory.",
    "perdeu": "Your memory failed",
    "v1": "A skald's memory!",
    "v2": "Snorri Sturluson gathered the Norse myths in the Prose Edda, around 1220. The cards and moves in the game are made up.",
    "h1": "Moves"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Snorres par",
    "sub": "Med kortene vendt ned finner du de seks parene av runer. Trykk på to kort om gangen; er de like, blir de liggende åpne. Du har fjorten trekk til å vise en skalds hukommelse.",
    "perdeu": "Hukommelsen sviktet",
    "v1": "En skalds hukommelse!",
    "v2": "Snorre Sturlason samlet de norrøne mytene i Snorres Edda rundt 1220. Kortene og trekkene i spillet er diktet opp.",
    "h1": "Trekk"
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
    var RU = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ'], MAXM = 14;
    var cards = [], moves = 0, a = -1, b = -1, wait = 0;
    function reset() {
      st = 'play'; moves = 0; a = b = -1; wait = 0; cards = [];
      var v = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5].sort(function () { return Math.random() - 0.5; });
      v.forEach(function (x) { cards.push({ v: x, open: false, done: false }); });
    }
    function geo(i) {
      var w = api.w, h = api.h, cols = w >= h ? 4 : 3, rows = 12 / cols, s = Math.min((w - 40) / cols, (h - 120) / rows), cw = s - 12;
      return { x: w / 2 + ((i % cols) - (cols - 1) / 2) * s, y: h / 2 + 24 + (Math.floor(i / cols) - (rows - 1) / 2) * s, cw: cw };
    }
    function pick(i) {
      if (wait > 0 || cards[i].open || cards[i].done) return;
      cards[i].open = true;
      if (a < 0) a = i; else { b = i; moves++; wait = 0.7; }
    }
    return {
      pausar: function () {},
      dbg: function () { return { st: st, moves: moves, wait: wait, a: a, cards: cards.map(function (c, i) { var G = geo(i); return { v: c.v, open: c.open, done: c.done, x: G.x, y: G.y }; }) }; },
      down: function (x, y) {
        if (menu()) return;
        for (var i = 0; i < cards.length; i++) { var G = geo(i); if (Math.abs(x - G.x) < G.cw / 2 && Math.abs(y - G.y) < G.cw / 2) { pick(i); return; } }
      },
      key: function (c, d) { if (d && st !== 'play' && (c === 'Space' || c === 'Enter')) menu(); },
      update: function (dt) {
        if (st !== 'play' || wait <= 0) return;
        wait -= dt;
        if (wait <= 0) {
          if (cards[a].v === cards[b].v) { cards[a].done = cards[b].done = true; } else { cards[a].open = cards[b].open = false; }
          a = b = -1;
          if (cards.every(function (c) { return c.done; })) st = 'win'; else if (moves >= MAXM) st = 'lose';
        }
      },
      draw: function () {
        var W = api.w, H = api.h;
        bg('#2a2438', '#15121f');
        cards.forEach(function (c, i) {
          var G = geo(i), s = G.cw; g.fillStyle = c.done ? '#3a5a3a' : c.open ? '#f3ecd2' : '#5b3a8a'; g.fillRect(G.x - s / 2, G.y - s / 2, s, s);
          g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 2; g.strokeRect(G.x - s / 2, G.y - s / 2, s, s);
          if (c.open || c.done) txt(RU[c.v], G.x, G.y + s * 0.18, Math.round(s * 0.55), c.done ? '#bfe6bf' : '#3a2a14'); else txt('ᛟ', G.x, G.y + s * 0.15, Math.round(s * 0.4), 'rgba(255,255,255,.35)');
        });
        hud(T.h1 + ' ' + moves + '/' + MAXM, '', false);
        fim(st);
      }
    };
  }
});
