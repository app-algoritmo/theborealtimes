/* Galloway Hoard — separe as peças do tesouro por material (invenção). */
BTJogo.registrar({
  canvas: 'jogo-galloway',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O tesouro de Galloway",
    "sub": "Seis cofres guardam peças de quatro materiais misturados. Toque num cofre para pegar a peça de cima e toque noutro para soltá-la: só cabe em cofre vazio ou sobre uma peça do mesmo material, e cada cofre leva até 4 peças. Deixe cada material num cofre só, em até 35 lances. (Teclado: 1 a 6.)",
    "perdeu": "Os lances ou o tempo acabaram com as peças ainda misturadas",
    "v1": "Cada material está no seu cofre!",
    "v2": "Em setembro de 2014, o detectorista Derek McLennan achou o primeiro objeto do tesouro de Galloway. O Museu Nacional da Escócia o comprou em 2017 por 1,98 milhão de libras. O jogo é invenção.",
    "h1": "Lances",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The Galloway hoard",
    "sub": "Six chests hold pieces of four mixed materials. Tap a chest to pick up its top piece and tap another to put it down: it fits only in an empty chest or on a piece of the same material, and each chest takes up to 4 pieces. Leave each material in a single chest, in up to 35 moves. (Keyboard: 1 to 6.)",
    "perdeu": "The moves or the time ran out with the pieces still mixed",
    "v1": "Each material is in its own chest!",
    "v2": "In September 2014, the metal detectorist Derek McLennan found the first object of the Galloway hoard. The National Museum of Scotland acquired it in 2017 for £1.98 million. The game is invented.",
    "h1": "Moves",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Galloway-skatten",
    "sub": "Seks kister inneholder deler av fire blandede materialer. Trykk på en kiste for å ta den øverste delen, og trykk på en annen for å legge den fra deg: den passer bare i en tom kiste eller oppå en del av samme materiale, og hver kiste rommer opptil 4 deler. La hvert materiale ligge i én kiste, på opptil 35 trekk. (Tastatur: 1 til 6.)",
    "perdeu": "Trekkene eller tiden tok slutt mens delene fortsatt var blandet",
    "v1": "Hvert materiale ligger i sin kiste!",
    "v2": "I september 2014 fant metalldetektoristen Derek McLennan den første gjenstanden i Galloway-skatten. Skottlands nasjonalmuseum kjøpte den i 2017 for 1,98 millioner pund. Spillet er oppfunnet.",
    "h1": "Trekk",
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
    var NT = 6, CAP = 4, NC = 4, LIMIT = 35, LIM = 180;
    var COL = ['#c9ced6', '#e6b94a', '#6fd0e0', '#b0482f'];
    var tubes = [], sel = -1, moves = 0, t = 0;
    function solved() { return tubes.every(function (b) { return b.length === 0 || (b.length === CAP && b.every(function (v) { return v === b[0]; })); }); }
    function reset() {
      var p, ok;
      do { p = []; for (var c = 0; c < NC; c++) for (var k = 0; k < CAP; k++) p.push(c); for (var i = p.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = p[i]; p[i] = p[j]; p[j] = x; }
        tubes = []; for (i = 0; i < NT; i++) tubes.push(i < NC ? p.slice(i * CAP, i * CAP + CAP) : []);
        ok = !tubes.some(function (b) { return b.length === CAP && b.every(function (v) { return v === b[0]; }); }); } while (!ok);
      sel = -1; moves = 0; t = 0; st = 'play';
    }
    function tap(i) {
      if (st !== 'play') return;
      if (sel < 0) { if (tubes[i].length) sel = i; return; }
      if (sel === i) { sel = -1; return; }
      var a = tubes[sel], b = tubes[i], c = a[a.length - 1];
      if (b.length < CAP && (!b.length || b[b.length - 1] === c)) { b.push(a.pop()); moves++; sel = -1; if (api.nota) api.nota(240 + c * 70, 0.1, 'triangle', 0.06); if (solved()) st = 'win'; else if (moves >= LIMIT) st = 'lose'; }
      else { sel = -1; if (api.nota) api.nota(110, 0.12, 'sawtooth', 0.04); }
    }
    function lay() { var W = api.w, H = api.h, tw = Math.max(34, Math.min(60, (W - 30) / NT - 8)), pitch = Math.max(24, Math.min(tw - 4, (H - 170) / CAP)), th = CAP * pitch + 14; return { tw: tw, pitch: pitch, th: th, gap: 8, x0: (W - (tw * NT + 8 * (NT - 1))) / 2, y0: 84 }; }
    function tpos(i) { var L = lay(); return { x: L.x0 + i * (L.tw + L.gap) + L.tw / 2, y: L.y0 + L.th / 2 }; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, tubes: tubes.map(function (b) { return b.slice(); }), sel: sel, moves: moves, limit: LIMIT, t: t, cap: CAP, pos: tubes.map(function (b, i) { return tpos(i); }) }; },
      down: function (x, y) { if (menu()) return; var L = lay(); for (var i = 0; i < NT; i++) { var p = tpos(i); if (Math.abs(x - p.x) < L.tw / 2 + 4 && y > L.y0 - 16 && y < L.y0 + L.th + 16) { tap(i); return; } } },
      move: function () {}, up: function () {},
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } var m = { Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3, Digit5: 4, Digit6: 5 }[k]; if (m !== undefined) tap(m); },
      update: function (dt) { if (st !== 'play') return; t += dt; if (t >= LIM) st = 'lose'; },
      draw: function () {
        var L = lay(), i, j; bg('#1d2318', '#080a06');
        for (i = 0; i < NT; i++) {
          var p = tpos(i), x = p.x - L.tw / 2, y = L.y0 - (sel === i ? 14 : 0);
          g.fillStyle = 'rgba(255,255,255,.07)'; rr(x, y, L.tw, L.th, 10); g.fill(); g.strokeStyle = sel === i ? '#ffd88a' : 'rgba(255,255,255,.3)'; g.lineWidth = sel === i ? 3 : 1.5; g.stroke();
          for (j = 0; j < tubes[i].length; j++) { g.fillStyle = COL[tubes[i][j]]; g.beginPath(); g.arc(p.x, y + L.th - 7 - L.pitch * (j + 0.5), Math.min(L.tw, L.pitch) * 0.42, 0, 6.2832); g.fill(); g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 1.5; g.stroke(); }
          txt(String(i + 1), p.x, L.y0 + L.th + 26, 13, 'rgba(255,255,255,.45)');
        }
        bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 30 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + moves + '/' + LIMIT, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };

  }
});
