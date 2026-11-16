/* Cuerdale — separe as moedas do tesouro por origem. */
BTJogo.registrar({
  canvas: 'jogo-cuerdale',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O tesouro de Cuerdale",
    "sub": "Toque numa pilha para pegar a moeda de cima e toque noutra pilha para soltá-la. Só dá para pôr a moeda numa pilha vazia ou sobre uma moeda da mesma cor, e cada pilha guarda até 4. Deixe cada origem sozinha na sua pilha em até 45 jogadas.",
    "perdeu": "As jogadas ou o tempo acabaram",
    "v1": "Cada origem está na sua pilha!",
    "v2": "O tesouro de Cuerdale, achado em 1840 na Inglaterra, tinha milhares de moedas de prata de várias origens. A separação por pilhas é invenção.",
    "h1": "Pilhas prontas",
    "h2": "Jogadas"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The Cuerdale hoard",
    "sub": "Tap a stack to pick up its top coin and tap another stack to drop it. A coin can only go on an empty stack or on a coin of the same colour, and each stack holds up to 4. Leave each origin alone in its own stack within 45 moves.",
    "perdeu": "The moves or the time ran out",
    "v1": "Every origin has its own stack!",
    "v2": "The Cuerdale hoard, found in 1840 in England, held thousands of silver coins of many origins. The sorting into stacks is made up.",
    "h1": "Stacks done",
    "h2": "Moves"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Cuerdale-skatten",
    "sub": "Trykk på en stabel for å ta den øverste mynten, og trykk på en annen stabel for å slippe den. En mynt kan bare legges på en tom stabel eller på en mynt av samme farge, og hver stabel rommer opptil 4. La hver opprinnelse ligge alene i sin stabel på maksimalt 45 trekk.",
    "perdeu": "Trekkene eller tiden var brukt opp",
    "v1": "Hver opprinnelse har sin stabel!",
    "v2": "Cuerdale-skatten, funnet i 1840 i England, inneholdt tusenvis av sølvmynter fra mange opphav. Sorteringen i stabler er diktet opp.",
    "h1": "Ferdige stabler",
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
    var NC = 4, CAP = 4, NT = 6, MAXM = 45, LIM = 180, COL = ['#c0392b', '#4a8ad0', '#7fa86a', '#d8b040'], SYM = ['I', 'II', 'III', 'IV'];
    var tb = [], sel = -1, moves = 0, tmr = LIM, bad = 0, hist = [];
    function lay() { var W = api.w, H = api.h, tw = Math.min(70, (W - 20) / NT), cols = W >= H ? 6 : 3, rows = Math.ceil(NT / cols), cw = Math.min(110, (W - 20) / cols), th = Math.min(200, (H - 190) / rows); return { cols: cols, rows: rows, cw: cw, th: th, tw: Math.min(cw * 0.8, 70), x0: (W - cw * cols) / 2, y0: 92, cr: Math.min(cw * 0.36, th / (CAP + 0.8) * 0.5, 26) }; }
    function tx(L, i) { return L.x0 + (i % L.cols + 0.5) * L.cw; }
    function ty(L, i) { return L.y0 + Math.floor(i / L.cols) * (L.th + 8); }
    function ok(a, b) { if (a === b || !tb[a].length || tb[b].length >= CAP) return false; var c = tb[a][tb[a].length - 1], d = tb[b][tb[b].length - 1]; return d === undefined || d === c; }
    function setup() { var tries = 0; do { tb = []; for (var i = 0; i < NT; i++) tb.push(i < NC ? new Array(CAP).fill(i) : []); hist = []; var n = 0; while (n < 26 && tries++ < 5000) { var a = Math.floor(Math.random() * NT), b = Math.floor(Math.random() * NT); if (a === b || !tb[a].length || tb[b].length >= CAP) continue; var c = tb[a].pop(); tb[b].push(c); var top = tb[a][tb[a].length - 1]; if (top !== undefined && top !== c) { tb[a].push(tb[b].pop()); continue; } hist.push([a, b]); n++; } } while (solved() > 2); sel = -1; moves = 0; tmr = LIM; bad = 0; }
    function solved() { var n = 0; tb.forEach(function (t) { if (t.length === CAP && t.every(function (v) { return v === t[0]; })) n++; }); return n; }
    function reset() { setup(); st = 'play'; }
    function pick(p) { if (st !== 'play') return; if (sel < 0) { if (tb[p].length) sel = p; return; } if (sel === p) { sel = -1; return; } if (!ok(sel, p)) { bad = 0.4; if (api.nota) api.nota(120, 0.15, 'square', 0.05); sel = tb[p].length ? p : -1; return; } var c = tb[sel].pop(); tb[p].push(c); sel = -1; moves++; if (api.nota) api.nota(300 + c * 70, 0.05, 'triangle', 0.04); if (solved() === NC) { st = 'win'; return; } if (moves >= MAXM) st = 'lose'; }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, tb: tb.map(function (t) { return t.slice(); }), sel: sel, moves: moves, max: MAXM, hist: hist.map(function (h) { return h.slice(); }), tmr: tmr, pos: function (i) { return { x: tx(L, i), y: ty(L, i) + L.th / 2 }; } }; },
      down: function (x, y) { if (menu()) return; var L = lay(); for (var i = 0; i < NT; i++) { if (Math.abs(x - tx(L, i)) < L.cw / 2 && y >= ty(L, i) - 6 && y <= ty(L, i) + L.th + 6) { pick(i); return; } } },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } var n = parseInt(String(k).replace('Digit', ''), 10); if (n >= 1 && n <= NT) pick(n - 1); },
      update: function (dt) { if (bad > 0) bad -= dt; if (st !== 'play') return; tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; } },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), i, j;
        bg('#26241a', '#0a0904');
        for (i = 0; i < NT; i++) { var x = tx(L, i), y = ty(L, i); g.fillStyle = sel === i ? 'rgba(255,216,138,.28)' : 'rgba(255,255,255,.08)'; rr(x - L.tw / 2, y, L.tw, L.th, 12); g.fill();
          for (j = 0; j < tb[i].length; j++) { var v = tb[i][j], cy = y + L.th - (j + 0.6) * (L.th / (CAP + 0.4)), lift = (sel === i && j === tb[i].length - 1) ? -L.cr * 0.7 : 0; g.fillStyle = COL[v]; g.beginPath(); g.arc(x, cy + lift, L.cr, 0, 6.283); g.fill(); g.strokeStyle = 'rgba(255,255,255,.4)'; g.lineWidth = 2; g.stroke(); txt(SYM[v], x, cy + lift + L.cr * 0.3, L.cr * 0.8, 'rgba(255,255,255,.9)'); } }
        if (bad > 0) { g.fillStyle = 'rgba(192,57,43,' + bad + ')'; g.fillRect(0, 0, W, 4); }
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 30 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + solved() + '/' + NC, T.h2 + ' ' + moves + '/' + MAXM, moves >= MAXM - 8);
        fim(st);
      }
    };
  }
});
