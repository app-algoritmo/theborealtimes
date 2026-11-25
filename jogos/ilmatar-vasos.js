/* Ilmatar — meça a água exata com dois vasos. */
BTJogo.registrar({
  canvas: 'jogo-ilmatar',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os vasos de Ilmatar",
    "sub": "Há dois vasos de tamanhos diferentes e nenhuma marca de medida. Toque nos botões: encher (▲), esvaziar (▼) ou despejar um vaso no outro (→ ←). Deixe um dos vasos com exatamente a quantidade pedida. São 3 desafios, com número limitado de jogadas.",
    "perdeu": "As jogadas ou o tempo acabaram",
    "v1": "A água está na medida certa!",
    "v2": "No Kalevala, a criação do mundo parte de um ovo que se parte sobre o mar. Os vasos e medidas do jogo são invenção.",
    "h1": "Desafio",
    "h2": "Jogadas"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Ilmatar's vessels",
    "sub": "There are two vessels of different sizes and no measuring marks. Tap the buttons: fill (▲), empty (▼) or pour one vessel into the other (→ ←). Leave one of the vessels with exactly the amount asked for. There are 3 puzzles, with a limited number of moves.",
    "perdeu": "The moves or the time ran out",
    "v1": "The water is exactly right!",
    "v2": "In the Kalevala, the creation of the world comes from an egg that breaks over the sea. The vessels and measures in the game are made up.",
    "h1": "Puzzle",
    "h2": "Moves"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Ilmatars kar",
    "sub": "Det er to kar i ulik størrelse og ingen målestreker. Trykk på knappene: fyll (▲), tøm (▼) eller hell det ene karet over i det andre (→ ←). La ett av karene inneholde nøyaktig så mye som oppgaven ber om. Det er 3 oppgaver med begrenset antall trekk.",
    "perdeu": "Trekkene eller tiden var brukt opp",
    "v1": "Vannet er nøyaktig riktig!",
    "v2": "I Kalevala oppstår verden av et egg som brytes over havet. Karene og målene i spillet er diktet opp.",
    "h1": "Oppgave",
    "h2": "Trekk"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "Los vasos de Ilmatar",
    "sub": "Hay dos vasos de tamaños distintos y ninguna marca de medida. Toca los botones: llenar (▲), vaciar (▼) o verter un vaso en el otro (→ ←). Deja uno de los vasos con exactamente la cantidad pedida. Son 3 desafíos, con un número limitado de jugadas.",
    "perdeu": "Se acabaron las jugadas o el tiempo",
    "v1": "¡El agua está en la medida justa!",
    "v2": "En el Kalevala, la creación del mundo parte de un huevo que se rompe sobre el mar. Los vasos y las medidas del juego son invención.",
    "h1": "Desafío",
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
    var LV = [[3, 5, 4, 12], [4, 9, 6, 15], [5, 7, 6, 18]], LIM = 240;
    var lv = 0, a = 0, b = 0, moves = 0, tmr = LIM, pop = 0, hold = 0, bt = [], flash = 0;
    function cap(i) { return LV[lv][i]; }
    function lay() { var W = api.w, H = api.h, u = Math.min((W - 80) / 14, (H - 250) / 9, 30), cy = Math.max(110, (H - 9 * u) / 2 - 20), r = {}; r.u = u; r.base = cy + 9 * u; r.xa = W / 2 - 2.6 * u - 3 * u; r.xb = W / 2 + 2.6 * u - 2 * u + 0; r.bw = Math.max(34, u * 2.3); r.by = r.base + 18; return r; }
    function btns() { var L = lay(), W = api.w, o = [], w = L.bw, ya = L.by, xa = W / 2 - L.u * 6, xb = W / 2 + L.u * 6;
      o.push({ id: 'f0', x: xa - w * 0.6, y: ya, w: w, h: w * 0.8, t: '▲' }); o.push({ id: 'e0', x: xa + w * 0.6, y: ya, w: w, h: w * 0.8, t: '▼' });
      o.push({ id: 'f1', x: xb - w * 0.6, y: ya, w: w, h: w * 0.8, t: '▲' }); o.push({ id: 'e1', x: xb + w * 0.6, y: ya, w: w, h: w * 0.8, t: '▼' });
      o.push({ id: 'p01', x: W / 2, y: ya - w * 0.5, w: w, h: w * 0.8, t: '→' }); o.push({ id: 'p10', x: W / 2, y: ya + w * 0.5, w: w, h: w * 0.8, t: '←' }); return o; }
    function setup() { lv = 0; a = 0; b = 0; moves = 0; tmr = LIM; flash = 0; }
    function reset() { setup(); st = 'play'; }
    function act(id) {
      if (st !== 'play') return; var A = cap(0), B = cap(1), ok = true;
      if (id === 'f0') a = A; else if (id === 'f1') b = B; else if (id === 'e0') a = 0; else if (id === 'e1') b = 0; else if (id === 'p01') { var p = Math.min(a, B - b); a -= p; b += p; } else if (id === 'p10') { var q = Math.min(b, A - a); b -= q; a += q; } else ok = false;
      if (!ok) return; moves++; if (api.nota) api.nota(300, 0.05, 'sine', 0.05);
      if (a === LV[lv][2] || b === LV[lv][2]) { flash = 0.5; if (api.nota) api.nota(660, 0.15, 'triangle', 0.07); lv++; if (lv >= LV.length) { st = 'win'; lv = LV.length - 1; return; } a = 0; b = 0; moves = 0; return; }
      if (moves >= LV[lv][3]) st = 'lose';
    }
    setup();
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lv: lv, a: a, b: b, moves: moves, caps: [cap(0), cap(1)], target: LV[lv][2], maxm: LV[lv][3], btns: btns() }; },
      down: function (x, y) { if (menu()) return; btns().forEach(function (q) { if (Math.abs(x - q.x) < q.w / 2 + 4 && Math.abs(y - q.y) < q.h / 2 + 4) act(q.id); }); },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } var m = { Digit1: 'f0', Digit2: 'e0', Digit3: 'f1', Digit4: 'e1', Digit5: 'p01', Digit6: 'p10' }; if (m[k]) act(m[k]); },
      update: function (dt) { pop += dt; if (flash > 0) flash -= dt; if (st !== 'play') return; tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; } },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), i, c;
        bg('#102a3a', '#050d14');
        var T0 = LV[lv][2];
        for (i = 0; i < 2; i++) { var cp = cap(i), amt = i ? b : a, x = W / 2 + (i ? 1 : -1) * L.u * 6, w = L.u * 3, h = cp * L.u * 0.95;
          g.fillStyle = 'rgba(255,255,255,.08)'; rr(x - w / 2, L.base - h, w, h, 6); g.fill(); g.fillStyle = 'rgba(90,170,230,.8)'; g.fillRect(x - w / 2 + 3, L.base - amt * L.u * 0.95, w - 6, amt * L.u * 0.95 - 2);
          g.strokeStyle = 'rgba(255,255,255,.5)'; g.lineWidth = 3; g.beginPath(); g.moveTo(x - w / 2, L.base - h); g.lineTo(x - w / 2, L.base); g.lineTo(x + w / 2, L.base); g.lineTo(x + w / 2, L.base - h); g.stroke();
          txt(String(cp), x, L.base - h - 12, 18, 'rgba(255,255,255,.7)'); if (amt > 0) txt(String(amt), x, L.base - amt * L.u * 0.95 / 2 + 6, 20, '#fff'); }
        txt('= ' + T0, W / 2, L.base - 4.5 * L.u, 30, flash > 0 ? '#7ad07a' : '#ffd88a');
        btns().forEach(function (q) { g.fillStyle = 'rgba(255,216,138,.16)'; rr(q.x - q.w / 2, q.y - q.h / 2, q.w, q.h, 8); g.fill(); txt(q.t, q.x, q.y + q.h * 0.18, q.h * 0.55, 'rgba(255,255,255,.8)'); });
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 40 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + (lv + 1) + '/' + LV.length, T.h2 + ' ' + moves + '/' + LV[lv][3], moves > LV[lv][3] - 4);
        fim(st);
      }
    };
  }
});
