/* Fagrskinna, o pergaminho belo — encontre os pares de selos (invenção). */
BTJogo.registrar({
  canvas: 'jogo-fagrskinna',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os selos da Fagrskinna",
    "sub": "Dezesseis folhas de pergaminho estão viradas para baixo, cada uma com um selo que aparece em duas delas. Toque em duas folhas por vez: se os selos forem iguais, o par fica à vista; se não, elas se viram de novo e conta um erro. Encontre os 8 pares com no máximo 9 erros; o décimo erro encerra o jogo.",
    "perdeu": "Os erros passaram do limite antes de todos os pares serem achados",
    "v1": "Todos os pares foram encontrados!",
    "v2": "A Fagrskinna foi escrita por volta de 1220 e narra a história da Noruega desde Halfdan, o Negro, até a batalha de Re, em 1177. O autor não é conhecido. Os selos são invenção.",
    "h1": "Pares",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The seals of Fagrskinna",
    "sub": "Sixteen sheets of parchment lie face down, each with a seal that appears on two of them. Tap two sheets at a time: if the seals match, the pair stays in view; if not, they turn over again and a mistake is counted. Find the 8 pairs with at most 9 mistakes; the tenth mistake ends the game.",
    "perdeu": "The mistakes passed the limit before all the pairs were found",
    "v1": "All the pairs have been found!",
    "v2": "Fagrskinna was written around 1220 and tells the history of Norway from Halfdan the Black to the battle of Re in 1177. The author is not known. The seals are invented.",
    "h1": "Pairs",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Fagrskinnas segl",
    "sub": "Seksten pergamentark ligger med forsiden ned, hvert med et segl som finnes på to av dem. Trykk på to ark om gangen: er seglene like, blir paret liggende synlig; hvis ikke, vendes de igjen og en feil telles. Finn de 8 parene med høyst 9 feil; den tiende feilen avslutter spillet.",
    "perdeu": "Feilene gikk over grensen før alle parene var funnet",
    "v1": "Alle parene er funnet!",
    "v2": "Fagrskinna ble skrevet omkring 1220 og forteller Norges historie fra Halvdan Svarte til slaget ved Re i 1177. Forfatteren er ikke kjent. Seglene er oppfunnet.",
    "h1": "Par",
    "h2": "Feil"
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
    var N = 4, PAIRS = 8, MAXE = 10;
    var COL = ['#d64545', '#e8a33d', '#e6d84a', '#4fa86b', '#4c8fd6', '#9b6bd1', '#d9d9d9', '#e07aa8'];
    var cards = [], first = -1, second = -1, lock = 0, err = 0, pairs = 0;
    function reset() { var v = []; for (var i = 0; i < PAIRS; i++) { v.push(i); v.push(i); } for (i = v.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = v[i]; v[i] = v[j]; v[j] = x; } cards = v.map(function (z) { return { v: z, open: false, done: false }; }); first = -1; second = -1; lock = 0; err = 0; pairs = 0; st = 'play'; }
    function tap(i) {
      if (st !== 'play' || lock > 0 || cards[i].open || cards[i].done) return;
      cards[i].open = true; if (api.nota) api.nota(300 + cards[i].v * 40, 0.1, 'triangle', 0.05);
      if (first < 0) { first = i; return; }
      if (cards[first].v === cards[i].v) { cards[first].done = true; cards[i].done = true; first = -1; pairs++; if (pairs >= PAIRS) st = 'win'; }
      else { second = i; err++; lock = 0.8; }
    }
    function lay() { var W = api.w, H = api.h, cs = Math.max(40, Math.min((W - 40) / N, (H - 130) / N, 96)); return { cs: cs, x0: (W - cs * N) / 2, y0: 72 }; }
    function cpos(i) { var L = lay(); return { x: L.x0 + (i % N + 0.5) * L.cs, y: L.y0 + (Math.floor(i / N) + 0.5) * L.cs }; }
    function shape(v, cx, cy, r, col) {
      g.fillStyle = col; g.strokeStyle = col; g.lineWidth = r * 0.3; g.beginPath();
      if (v === 0) g.arc(cx, cy, r, 0, 6.2832);
      else if (v === 1) g.rect(cx - r * 0.85, cy - r * 0.85, r * 1.7, r * 1.7);
      else if (v === 2) { g.moveTo(cx, cy - r); g.lineTo(cx + r, cy + r * 0.8); g.lineTo(cx - r, cy + r * 0.8); g.closePath(); }
      else if (v === 3) { g.moveTo(cx, cy - r); g.lineTo(cx + r, cy); g.lineTo(cx, cy + r); g.lineTo(cx - r, cy); g.closePath(); }
      else if (v === 4) { g.rect(cx - r * 0.3, cy - r, r * 0.6, r * 2); g.rect(cx - r, cy - r * 0.3, r * 2, r * 0.6); }
      else if (v === 5) { g.arc(cx, cy, r * 0.8, 0, 6.2832); g.fill(); g.globalCompositeOperation = 'destination-out'; g.beginPath(); g.arc(cx, cy, r * 0.4, 0, 6.2832); g.fill(); g.globalCompositeOperation = 'source-over'; return; }
      else if (v === 6) { rr(cx - r, cy - r * 0.4, r * 2, r * 0.8, r * 0.4); }
      else { for (var k = 0; k < 6; k++) { var a = k * 1.0472; g.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); } g.closePath(); }
      g.fill();
    }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, vals: cards.map(function (c) { return c.v; }), open: cards.map(function (c) { return c.open || c.done; }), done: cards.map(function (c) { return c.done; }), err: err, pairs: pairs, lock: lock, cs: L.cs, pos: cards.map(function (c, i) { return cpos(i); }) }; },
      down: function (x, y) { if (menu()) return; var L = lay(), c = Math.floor((x - L.x0) / L.cs), r = Math.floor((y - L.y0) / L.cs); if (c >= 0 && c < N && r >= 0 && r < N) tap(r * N + c); },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) {
        if (lock > 0) { lock -= dt; if (lock <= 0) { cards[first].open = false; cards[second].open = false; first = -1; second = -1; if (err >= MAXE && st === 'play') st = 'lose'; } }
      },
      draw: function () {
        var L = lay(), i; bg('#2a2112', '#0d0a05');
        for (i = 0; i < N * N; i++) {
          var p = cpos(i), c = cards[i], s = L.cs - 8, x = p.x - s / 2, y = p.y - s / 2;
          g.fillStyle = c.done ? 'rgba(255,216,138,.18)' : (c.open ? '#efe2bd' : '#8a6a3a'); rr(x, y, s, s, 8); g.fill();
          if (!c.open && !c.done) { g.strokeStyle = 'rgba(0,0,0,.3)'; g.lineWidth = 2; g.stroke(); }
          if (c.open || c.done) shape(c.v, p.x, p.y, s * 0.28, COL[c.v]);
        }
        hud(T.h1 + ' ' + pairs + '/' + PAIRS, T.h2 + ' ' + err + '/' + MAXE, true);
        fim(st);
      }
    };

  }
});
