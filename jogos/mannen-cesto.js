/* O homem que ia cuidar da casa — pegue os afazeres e fuja do porco. */
BTJogo.registrar({
  canvas: 'jogo-mannen',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O homem e os afazeres da casa",
    "sub": "Mova o cesto (arraste o dedo ou use ← → / A D) para pegar o que cai: pão, leite, lã e ovos. Não pegue o porco! Colete 25 itens antes de cometer 3 erros ou o tempo acabar.",
    "perdeu": "Três erros, ou o tempo acabou",
    "v1": "A casa está em ordem!",
    "v2": "No conto de Asbjørnsen e Moe, o marido troca de lugar com a mulher e tudo dá errado, até a vaca no telhado. O jogo do cesto é invenção.",
    "h1": "Coletados",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The man and the housework",
    "sub": "Move the basket (drag your finger or use ← → / A D) to catch what falls: bread, milk, wool and eggs. Do not catch the pig! Collect 25 items before making 3 mistakes or time runs out.",
    "perdeu": "Three mistakes, or time ran out",
    "v1": "The house is in order!",
    "v2": "In the tale by Asbjørnsen and Moe, the husband swaps places with his wife and everything goes wrong, even the cow on the roof. The basket game is made up.",
    "h1": "Collected",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Mannen og husarbeidet",
    "sub": "Flytt kurven (dra fingeren eller bruk ← → / A D) for å fange det som faller: brød, melk, ull og egg. Ikke ta grisen! Samle 25 ting før du gjør 3 feil eller tiden går ut.",
    "perdeu": "Tre feil, eller tiden gikk ut",
    "v1": "Huset er i orden!",
    "v2": "I eventyret til Asbjørnsen og Moe bytter mannen plass med kona, og alt går galt, til og med kua på taket. Kurvspillet er diktet opp.",
    "h1": "Fanget",
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
    var GOAL = 25, LIM = 60;
    var bx = 0, tx = 0, items = [], got = 0, errs = 0, tmr = LIM, nxt = 0.5, pop = 0, KL = 0, KR = 0, flash = 0;
    var KIND = ['🍞', '🥛', '🧶', '🥚'];
    function lay() { var W = api.w, H = api.h, s = Math.max(0.8, Math.min(1.5, Math.min(W, H) / 450)); return { W: W, H: H, s: s, by: H - 56 * s, bw: 96 * s }; }
    function setup() { var L = lay(); bx = L.W / 2; tx = bx; items = []; got = 0; errs = 0; tmr = LIM; nxt = 0.5; flash = 0; }
    function reset() { setup(); st = 'play'; }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, bx: bx, by: L.by, bw: L.bw, items: items.map(function (i) { return { x: i.x, y: i.y, pig: i.pig, v: i.v }; }), got: got, errs: errs, tmr: tmr, W: L.W }; },
      down: function (x, y) { if (menu()) return; tx = x; },
      move: function (x, y, pr) { if (pr && st === 'play') tx = x; },
      key: function (k, d) { if (k === 'ArrowLeft' || k === 'KeyA') KL = d ? 1 : 0; else if (k === 'ArrowRight' || k === 'KeyD') KR = d ? 1 : 0; else if (d && st !== 'play') menu(); },
      update: function (dt) {
        pop += dt; if (flash > 0) flash -= dt; if (st !== 'play') return; var L = lay(); tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; return; }
        if (KL) tx = bx - 160; if (KR) tx = bx + 160; tx = Math.max(L.bw / 2, Math.min(L.W - L.bw / 2, tx)); var m = 520 * L.s * dt; if (Math.abs(tx - bx) <= m) bx = tx; else bx += m * (tx > bx ? 1 : -1);
        nxt -= dt; if (nxt <= 0) { nxt = 0.45 + Math.random() * 0.3; var pig = Math.random() < 0.22; items.push({ x: 30 + Math.random() * (L.W - 60), y: 70, pig: pig, v: Math.floor(Math.random() * 4) }); }
        var sp = (170 + got * 6) * L.s; items.forEach(function (i) { i.y += sp * dt; });
        items = items.filter(function (i) { if (i.y > L.H + 30) return false; if (i.y > L.by - 16 * L.s && i.y < L.by + 26 * L.s && Math.abs(i.x - bx) < L.bw / 2 + 6) { if (i.pig) { errs++; flash = 0.4; if (api.nota) api.nota(100, 0.25, 'sawtooth', 0.07); if (errs >= 3) st = 'lose'; } else { got++; if (api.nota) api.nota(520 + got * 15, 0.07, 'triangle', 0.05); if (got >= GOAL) st = 'win'; } return false; } return true; });
      },
      draw: function () {
        var W = api.w, H = api.h, L = lay();
        bg('#3a2a1a', '#120a04');
        g.fillStyle = '#5a3a1a'; g.fillRect(0, H - 22 * L.s, W, 22 * L.s);
        items.forEach(function (i) { txt(i.pig ? '🐖' : KIND[i.v], i.x, i.y + 10 * L.s, 30 * L.s, '#fff'); });
        g.fillStyle = flash > 0 ? '#c0392b' : '#a0703a'; g.beginPath(); g.moveTo(bx - L.bw / 2, L.by - 6 * L.s); g.lineTo(bx + L.bw / 2, L.by - 6 * L.s); g.lineTo(bx + L.bw * 0.4, L.by + 24 * L.s); g.lineTo(bx - L.bw * 0.4, L.by + 24 * L.s); g.closePath(); g.fill(); g.strokeStyle = 'rgba(0,0,0,.3)'; g.lineWidth = 2; for (var k = -2; k <= 2; k++) { g.beginPath(); g.moveTo(bx + k * L.bw * 0.18, L.by - 4 * L.s); g.lineTo(bx + k * L.bw * 0.14, L.by + 22 * L.s); g.stroke(); }
        bar(W / 2 - 110, H - 14 * L.s - 2, 220, 5, tmr / LIM, tmr < 12 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + got + '/' + GOAL, T.h2 + ' ' + errs + '/3', errs >= 2);
        fim(st);
      }
    };
  }
});
