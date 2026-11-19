/* Tatterhood — vire a pilha de trapos até ficarem em ordem (invenção). */
BTJogo.registrar({
  canvas: 'jogo-tatterhood',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os trapos de Tatterhood",
    "sub": "Seis trapos de comprimentos diferentes estão empilhados. Toque num trapo para virar ele e todos os que estão acima dele, de uma só vez: a ordem dessa parte da pilha se inverte. Deixe a pilha em ordem, com o trapo mais curto no topo e o mais comprido embaixo, em até 10 viradas. (Teclado: teclas 2 a 6 viram a partir daquela posição.)",
    "perdeu": "As viradas ou o tempo acabaram antes de a pilha ficar em ordem",
    "v1": "A pilha está em ordem!",
    "v2": "Em Tatterhood (Lurvehette), de Asbjørnsen e Moe, uma princesa feia, que anda numa cabra e leva uma colher de pau, vai com a irmã à ilha dos trolls e recupera a cabeça dela; no dia do casamento, a cabra, a colher e o capuz viram um cavalo, uma varinha ou um leque, conforme a versão, e uma coroa de ouro. A pilha de trapos é invenção.",
    "h1": "Viradas",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Tatterhood's rags",
    "sub": "Six rags of different lengths lie in a stack. Tap a rag to flip it and all the rags above it at once: the order of that part of the stack is reversed. Leave the stack in order, with the shortest rag on top and the longest at the bottom, in up to 10 flips. (Keyboard: keys 2 to 6 flip from that position.)",
    "perdeu": "The flips or the time ran out before the stack was in order",
    "v1": "The stack is in order!",
    "v2": "In Tatterhood (Lurvehette), by Asbjørnsen and Moe, an ugly princess who rides a goat and carries a wooden spoon goes with her sister to the trolls’ island and recovers her sister’s head; on the wedding day, the goat, the spoon and the hood become a horse, a wand or a fan depending on the version, and a golden crown. The stack of rags is invented.",
    "h1": "Flips",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Lurvehettes filler",
    "sub": "Seks filler av ulik lengde ligger i en stabel. Trykk på en fille for å snu den og alle fillene over den på én gang: rekkefølgen på den delen av stabelen snus. La stabelen ligge i orden, med den korteste fillen øverst og den lengste nederst, på opptil 10 snuinger. (Tastatur: tast 2 til 6 snur fra den posisjonen.)",
    "perdeu": "Snuingene eller tiden tok slutt før stabelen var i orden",
    "v1": "Stabelen er i orden!",
    "v2": "I Lurvehette av Asbjørnsen og Moe drar en stygg prinsesse, som rir på en geit og har en tresleiv, sammen med søsteren til trollenes øy og henter tilbake hodet hennes; på bryllupsdagen blir geita, sleiva og hetta til en hest, en tryllestav eller en vifte etter versjonen, og en gullkrone. Stabelen av filler er oppfunnet.",
    "h1": "Snuinger",
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
    var N = 6, MAXF = 10, LIM = 240;
    var arr = [], flips = 0, t = 0, sol = [], fl = -1, ft = 0;
    var COL = ['#c75a50', '#d8943a', '#d8c24a', '#4fa86b', '#4c8fd6', '#9b6bd1'];
    function sorted(a) { for (var i = 0; i < N; i++) if (a[i] !== i + 1) return false; return true; }
    function fp(a, i) { var b = a.slice(), l = 0, r = i, x; while (l < r) { x = b[l]; b[l] = b[r]; b[r] = x; l++; r--; } return b; }
    function bfs(a) {
      var key = function (x) { return x.join(''); }, seen = {}, q = [{ a: a, prev: null, i: -1 }], h = 0; seen[key(a)] = 1;
      while (h < q.length) { var s = q[h++]; if (sorted(s.a)) { var out = []; while (s.prev) { out.unshift(s.i); s = s.prev; } return out; } for (var i = 1; i < N; i++) { var b = fp(s.a, i), k = key(b); if (!seen[k]) { seen[k] = 1; q.push({ a: b, prev: s, i: i }); } } }
      return [];
    }
    function reset() {
      for (;;) { var a = [1, 2, 3, 4, 5, 6], i, j, x; for (i = 5; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); x = a[i]; a[i] = a[j]; a[j] = x; } var s = bfs(a); if (s.length >= 4 && s.length <= MAXF - 2) { arr = a; sol = s; break; } }
      flips = 0; t = 0; fl = -1; ft = 0; st = 'play';
    }
    function flip(i) {
      if (st !== 'play' || i < 1) return; arr = fp(arr, i); flips++; fl = i; ft = 0.4; if (api.nota) api.nota(200 + i * 40, 0.08, 'triangle', 0.05);
      if (sorted(arr)) st = 'win'; else if (flips >= MAXF) st = 'lose';
    }
    function lay() { var W = api.w, H = api.h, bh = Math.max(26, Math.min(50, (H - 170) / N)); return { bh: bh, y0: 84, wmax: Math.min(W - 40, 420) }; }
    function bp() { var L = lay(), o = [], i; for (i = 0; i < N; i++) o.push({ x: api.w / 2, y: L.y0 + i * (L.bh + 6) + L.bh / 2 }); return o; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, arr: arr.slice(), sol: sol.slice(), pos: bp(), flips: flips, max: MAXF, t: t }; },
      down: function (x, y) { if (menu()) return; var L = lay(), p = bp(), i; for (i = 0; i < N; i++) if (Math.abs(y - p[i].y) < L.bh / 2 + 3) { flip(i); return; } },
      move: function () {}, up: function () {},
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } var m = { Digit2: 1, Digit3: 2, Digit4: 3, Digit5: 4, Digit6: 5, Numpad2: 1, Numpad3: 2, Numpad4: 3, Numpad5: 4, Numpad6: 5 }[k]; if (m !== undefined) flip(m); },
      update: function (dt) { if (st !== 'play') return; t += dt; if (ft > 0) ft -= dt; if (t >= LIM) st = 'lose'; },
      draw: function () {
        var L = lay(), p = bp(), i; bg('#2a1d2e', '#0d0810');
        for (i = 0; i < N; i++) {
          var w = L.wmax * (0.22 + 0.13 * arr[i]), x = p[i].x - w / 2, y = p[i].y - L.bh / 2;
          g.fillStyle = COL[arr[i] - 1]; rr(x, y, w, L.bh, 8); g.fill();
          g.strokeStyle = fl >= 0 && i <= fl && ft > 0 ? '#fff' : 'rgba(0,0,0,.35)'; g.lineWidth = 2; rr(x, y, w, L.bh, 8); g.stroke();
          txt(String(arr[i]), p[i].x, p[i].y + 6, 16, 'rgba(0,0,0,.6)');
        }
        txt('▲', api.w / 2, L.y0 - 8, 12, '#c9b3f2');
        bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 40 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + flips + '/' + MAXF, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };

  }
});
