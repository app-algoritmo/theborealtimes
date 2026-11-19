/* Magni, filho de Thor — gire os quadrantes até as peças ficarem em ordem (invenção). */
BTJogo.registrar({
  canvas: 'jogo-magni',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O giro de Magni",
    "sub": "Nove peças numeradas estão fora de ordem. Em cada encontro de quatro peças há um botão redondo: toque na metade direita dele para girar as quatro peças no sentido horário, ou na metade esquerda para girá-las no sentido anti-horário. Ponha os números em ordem, de 1 a 9, linha por linha. O número de giros e o tempo são limitados. São 3 rodadas.",
    "perdeu": "Os giros ou o tempo acabaram",
    "v1": "Tudo em ordem!",
    "v2": "Na Edda em prosa, Magni, filho de Thor, tem três noites de vida quando tira o pé do gigante Hrungnir de cima do pescoço do pai. Girar quadrantes é invenção.",
    "h1": "Rodada",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Magni’s turn",
    "sub": "Nine numbered pieces are out of order. Where four pieces meet there is a round button: tap its right half to turn the four pieces clockwise, or its left half to turn them counter-clockwise. Put the numbers in order, from 1 to 9, row by row. The number of turns and the time are limited. There are 3 rounds.",
    "perdeu": "The turns or the time ran out",
    "v1": "Everything in order!",
    "v2": "In the Prose Edda, Magni, Thor’s son, is three nights old when he lifts the giant Hrungnir’s foot off his father’s neck. Turning quadrants is invented.",
    "h1": "Round",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Magnis dreining",
    "sub": "Ni nummererte brikker ligger i feil rekkefølge. Der fire brikker møtes, er det en rund knapp: trykk på høyre halvdel for å dreie de fire brikkene med klokken, eller på venstre halvdel for å dreie dem mot klokken. Legg tallene i rekkefølge, fra 1 til 9, rad for rad. Antall dreininger og tiden er begrenset. Det er 3 runder.",
    "perdeu": "Dreiningene eller tiden tok slutt",
    "v1": "Alt i orden!",
    "v2": "I Snorres Edda er Magni, Tors sønn, tre netter gammel da han løfter foten til jotunen Hrungnir av nakken til faren. Å dreie kvadranter er oppfunnet.",
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
    var BL = [[0, 1, 4, 3], [1, 2, 5, 4], [3, 4, 7, 6], [4, 5, 8, 7]], NR = 3, LIM = 300, K = [6, 7, 8];
    var rd = 0, a = [], hist = [], lim = 0, moves = 0, t = 0, pend = 0, sol = [], fl = 0;
    function rot(arr, b, dir) {
      var c = BL[b], i, v = arr.slice();
      if (dir > 0) { arr[c[1]] = v[c[0]]; arr[c[2]] = v[c[1]]; arr[c[3]] = v[c[2]]; arr[c[0]] = v[c[3]]; }
      else { arr[c[0]] = v[c[1]]; arr[c[1]] = v[c[2]]; arr[c[2]] = v[c[3]]; arr[c[3]] = v[c[0]]; }
    }
    function solved(arr) { for (var i = 0; i < 9; i++) if (arr[i] !== i + 1) return false; return true; }
    function load(i) {
      for (;;) {
        a = [1, 2, 3, 4, 5, 6, 7, 8, 9]; var seq = [], k, last = -1;
        for (k = 0; k < K[i]; k++) { var b, d; do { b = (Math.random() * 4) | 0; d = Math.random() < 0.5 ? 1 : -1; } while (seq.length && seq[seq.length - 1][0] === b && seq[seq.length - 1][1] === -d); rot(a, b, d); seq.push([b, d]); }
        if (!solved(a)) { sol = seq.slice().reverse().map(function (m) { return [m[0], -m[1]]; }); break; }
      }
      lim = K[i] + 5; moves = 0;
    }
    function reset() { rd = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function lay() { var W = api.w, H = api.h, s = Math.min((W - 30) / 3, (H - 170) / 3, 96); return { s: s, x0: (W - 3 * s) / 2, y0: 76 }; }
    function knob(b) { var L = lay(), c = BL[b], x = (c[0] % 3 + c[1] % 3 + c[2] % 3 + c[3] % 3) / 4 + 0.5, y = (((c[0] / 3) | 0) + ((c[1] / 3) | 0) + ((c[2] / 3) | 0) + ((c[3] / 3) | 0)) / 4 + 0.5; return { x: L.x0 + x * L.s, y: L.y0 + y * L.s }; }
    function turn(b, d) {
      if (st !== 'play' || pend > 0) return; rot(a, b, d); moves++; if (api.nota) api.nota(220, 0.05, 'square', 0.03);
      if (solved(a)) { rd++; pend = 0.9; if (api.nota) api.nota(520, 0.2, 'triangle', 0.07); }
      else if (moves >= lim) { st = 'lose'; }
    }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { var p = [], i; for (i = 0; i < 4; i++) p.push(knob(i)); return { st: st, rd: rd, a: a.slice(), sol: sol.map(function (m) { return m.slice(); }), moves: moves, lim: lim, pos: p, pend: pend }; },
      down: function (x, y) {
        if (menu()) return; if (pend > 0) return; var i, L = lay();
        for (i = 0; i < 4; i++) { var k = knob(i); if (Math.hypot(x - k.x, y - k.y) < L.s * 0.34) { turn(i, x >= k.x ? 1 : -1); return; } }
      },
      move: function () {}, up: function () {},
      key: function (kk, d) { if (d && st !== 'play') menu(); },
      update: function (dt) {
        if (st !== 'play') return; t += dt;
        if (pend > 0) { pend -= dt; if (pend <= 0) { if (rd >= NR) st = 'win'; else load(rd); } }
        if (st === 'play' && t >= LIM) st = 'lose';
      },
      draw: function () {
        var L = lay(), i; bg('#1a2230', '#070a10');
        for (i = 0; i < 9; i++) {
          var x = L.x0 + (i % 3) * L.s, y = L.y0 + ((i / 3) | 0) * L.s, v = a[i], ok = v === i + 1;
          g.fillStyle = ok ? '#6c8a58' : '#3d5a7a'; rr(x + 3, y + 3, L.s - 6, L.s - 6, 10); g.fill(); g.strokeStyle = 'rgba(255,255,255,.25)'; g.lineWidth = 2; rr(x + 3, y + 3, L.s - 6, L.s - 6, 10); g.stroke();
          txt(String(v), x + L.s / 2, y + L.s / 2 + 1, L.s * 0.42, '#f3ecd2');
        }
        for (i = 0; i < 4; i++) { var k = knob(i); g.fillStyle = 'rgba(20,24,36,.92)'; g.beginPath(); g.arc(k.x, k.y, L.s * 0.2, 0, 6.2832); g.fill(); g.strokeStyle = '#ffd88a'; g.lineWidth = 2; g.stroke(); txt('↺', k.x - L.s * 0.08, k.y + 1, L.s * 0.2, '#ffd88a'); txt('↻', k.x + L.s * 0.08, k.y + 1, L.s * 0.2, '#ffd88a'); }
        txt(moves + '/' + lim, api.w / 2, L.y0 + 3 * L.s + 28, 18, moves >= lim - 2 ? '#ff9a8d' : '#f3ecd2');
        bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 60 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + Math.min(rd + 1, NR) + '/' + NR, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };

  }
});
