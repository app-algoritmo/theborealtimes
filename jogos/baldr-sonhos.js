/* Baldrs draumar — ache os pares de sinais nos sonhos de Baldr. */
BTJogo.registrar({
  canvas: 'jogo-baldr',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os sonhos de Baldr",
    "sub": "Toque numa carta para virá-la e depois noutra. Se os dois sinais forem iguais, o par fica aberto. Ache os 6 pares em até 14 jogadas (cada par de cartas virado conta uma jogada).",
    "perdeu": "As jogadas ou o tempo acabaram",
    "v1": "Você achou todos os pares!",
    "v2": "No Baldrs draumar, Odin desce a Hel para entender os sonhos de Baldr. Os sinais das cartas são invenção.",
    "h1": "Pares",
    "h2": "Jogadas"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Baldr's dreams",
    "sub": "Tap a card to turn it over, then another. If the two signs match, the pair stays open. Find all 6 pairs in 14 moves or fewer (each pair of cards turned counts as one move).",
    "perdeu": "The moves or the time ran out",
    "v1": "You found all the pairs!",
    "v2": "In the Baldrs draumar, Odin goes down to Hel to understand Baldr's dreams. The signs on the cards are made up.",
    "h1": "Pairs",
    "h2": "Moves"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Balders drømmer",
    "sub": "Trykk på et kort for å snu det, og så på et nytt. Hvis de to tegnene er like, blir paret liggende åpent. Finn alle 6 parene på maksimalt 14 trekk (hvert par kort du snur, teller som ett trekk).",
    "perdeu": "Trekkene eller tiden var brukt opp",
    "v1": "Du fant alle parene!",
    "v2": "I Baldrs draumar rir Odin ned til Hel for å forstå Balders drømmer. Tegnene på kortene er diktet opp.",
    "h1": "Par",
    "h2": "Trekk"
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
    var NP = 6, MAXM = 14, LIM = 150, SYM = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ'], COL = ['#c0392b', '#4a8ad0', '#7fa86a', '#d8b040', '#9a6ab0', '#e08a4a'];
    var cd = [], first = -1, second = -1, wait = 0, moves = 0, pairs = 0, tmr = LIM, cur = 0;
    function lay() { var W = api.w, H = api.h, cols = W >= H ? 4 : 3, rows = 12 / cols, cs = Math.max(48, Math.min((W - 24) / cols, (H - 170) / rows, 100)); return { cols: cols, rows: rows, cs: cs, x: (W - cs * cols) / 2, y: Math.max(86, (H - cs * rows) / 2 + 6) }; }
    function setup() { var a = []; for (var i = 0; i < NP; i++) { a.push(i); a.push(i); } a.sort(function () { return Math.random() - 0.5; }); cd = a.map(function (s) { return { s: s, open: false, done: false }; }); first = -1; second = -1; wait = 0; moves = 0; pairs = 0; tmr = LIM; }
    function reset() { setup(); st = 'play'; }
    function flip(i) { if (st !== 'play' || wait > 0 || cd[i].open || cd[i].done) return; cd[i].open = true; if (api.nota) api.nota(300 + cd[i].s * 60, 0.05, 'triangle', 0.04); if (first < 0) { first = i; return; } second = i; moves++; if (cd[first].s === cd[second].s) { cd[first].done = cd[second].done = true; pairs++; first = second = -1; if (api.nota) api.nota(660, 0.1, 'triangle', 0.05); if (pairs >= NP) { st = 'win'; return; } } else wait = 0.8; if (moves >= MAXM && pairs < NP && wait <= 0) st = 'lose'; }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, cards: cd.map(function (c) { return { s: c.s, open: c.open, done: c.done }; }), moves: moves, max: MAXM, pairs: pairs, busy: wait > 0, tmr: tmr, pos: function (i) { return { x: L.x + (i % L.cols + 0.5) * L.cs, y: L.y + (Math.floor(i / L.cols) + 0.5) * L.cs }; } }; },
      down: function (x, y) { if (menu()) return; var L = lay(), c = Math.floor((x - L.x) / L.cs), r = Math.floor((y - L.y) / L.cs); if (c >= 0 && r >= 0 && c < L.cols && r < L.rows) { cur = r * L.cols + c; flip(cur); } },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } var L = lay(); if (k === 'ArrowLeft') cur = (cur + 11) % 12; else if (k === 'ArrowRight') cur = (cur + 1) % 12; else if (k === 'ArrowUp') cur = (cur + 12 - L.cols) % 12; else if (k === 'ArrowDown') cur = (cur + L.cols) % 12; else if (k === 'Space' || k === 'Enter') flip(cur); },
      update: function (dt) { if (st !== 'play') return; tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; return; } if (wait > 0) { wait -= dt; if (wait <= 0) { cd[first].open = false; cd[second].open = false; first = second = -1; if (moves >= MAXM) st = 'lose'; } } },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), i;
        bg('#241a2e', '#08050c');
        for (i = 0; i < 12; i++) { var x = L.x + (i % L.cols) * L.cs, y = L.y + Math.floor(i / L.cols) * L.cs, c = cd[i], show = c.open || c.done;
          g.fillStyle = c.done ? 'rgba(255,255,255,.06)' : show ? '#3a3050' : '#5a4a7a'; rr(x + 4, y + 4, L.cs - 8, L.cs - 8, 10); g.fill();
          if (show) txt(SYM[c.s], x + L.cs / 2, y + L.cs * 0.66, L.cs * 0.5, c.done ? 'rgba(255,255,255,.3)' : COL[c.s]); else { g.strokeStyle = 'rgba(255,255,255,.18)'; g.lineWidth = 2; g.beginPath(); g.arc(x + L.cs / 2, y + L.cs / 2, L.cs * 0.16, 0, 6.283); g.stroke(); }
          if (cur === i && st === 'play') { g.strokeStyle = 'rgba(255,216,138,.6)'; g.lineWidth = 2; g.strokeRect(x + 2, y + 2, L.cs - 4, L.cs - 4); } }
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 30 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + pairs + '/' + NP, T.h2 + ' ' + moves + '/' + MAXM, moves >= MAXM - 3);
        fim(st);
      }
    };
  }
});
