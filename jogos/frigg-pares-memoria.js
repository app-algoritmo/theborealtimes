/* Frigg, esposa de Odin — jogo de pares de memória (invenção). */
BTJogo.registrar({
  canvas: 'jogo-frigg-pares',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os pares de Frigg",
    "sub": "Toque numa peça para virá-la e toque noutra para achar o par. Se forem iguais, ficam viradas; se não, desviram. Ache os 8 pares em até 20 tentativas e 120 segundos. (Teclado: setas movem, Espaço vira.)",
    "perdeu": "As tentativas ou o tempo acabaram",
    "v1": "Os oito pares foram achados!",
    "v2": "Frigg é a esposa de Odin e vive em Fensalir. O jogo de pares é invenção.",
    "h1": "Pares",
    "h2": "Tentativas"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Frigg's pairs",
    "sub": "Tap a piece to turn it over and tap another to find its match. If they match, they stay face up; if not, they turn back. Find the 8 pairs within 20 tries and 120 seconds. (Keyboard: arrows move, Space flips.)",
    "perdeu": "The tries or the time ran out",
    "v1": "All eight pairs are found!",
    "v2": "Frigg is Odin's wife and lives at Fensalir. The matching game is invented.",
    "h1": "Pairs",
    "h2": "Tries"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Friggs par",
    "sub": "Trykk på en brikke for å snu den og trykk på en annen for å finne paret. Er de like, blir de liggende; hvis ikke, snur de seg tilbake. Finn de 8 parene på 20 forsøk og 120 sekunder. (Tastatur: piler flytter, mellomrom snur.)",
    "perdeu": "Forsøkene eller tiden tok slutt",
    "v1": "Alle åtte parene er funnet!",
    "v2": "Frigg er Odins kone og bor i Fensalir. Parspillet er oppfunnet.",
    "h1": "Par",
    "h2": "Forsøk"
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
    var NP = 8, MAXT = 20, LIM = 120;
    var SYM = ['🌙', '☀️', '❄️', '⚓', '🔥', '🌲', '🐺', '🦅'], COL = ['#5b6fb5', '#c9893a', '#4a98b8', '#3f8f78', '#c0563f', '#4b8a4b', '#7b6a9a', '#a0763a'];
    var cards = [], first = -1, second = -1, lockT = 0, tries = 0, pairs = 0, t = 0, cur = 0;
    function lay() { var W = api.w, H = api.h, cs = Math.max(40, Math.min((W - 30) / 4, (H - 120) / 4, 100)); return { cs: cs, x: (W - cs * 4) / 2, y: Math.max(70, (H - cs * 4) / 2 + 14) }; }
    function pos(i) { var L = lay(); return { x: L.x + (i % 4 + 0.5) * L.cs, y: L.y + (Math.floor(i / 4) + 0.5) * L.cs }; }
    function reset() {
      var v = [], i; for (i = 0; i < NP; i++) v.push(i, i);
      for (i = v.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), tmp = v[i]; v[i] = v[j]; v[j] = tmp; }
      cards = v.map(function (a) { return { v: a, open: false, done: false }; }); first = second = -1; lockT = 0; tries = 0; pairs = 0; t = 0; st = 'play';
    }
    function flip(i) {
      if (st !== 'play' || lockT > 0 || i < 0 || cards[i].open || cards[i].done) return;
      cards[i].open = true; if (api.nota) api.nota(400 + cards[i].v * 40, 0.1, 'triangle', 0.05);
      if (first < 0) { first = i; return; }
      second = i; tries++;
      if (cards[first].v === cards[second].v) {
        cards[first].done = true; cards[second].done = true; pairs++; first = second = -1; if (api.nota) api.nota(700, 0.2, 'sine', 0.06);
        if (pairs >= NP) st = 'win'; else if (tries >= MAXT) st = 'lose';
      } else lockT = 0.8;
    }
    function at(x, y) { var L = lay(); for (var i = 0; i < 16; i++) { var p = pos(i); if (Math.abs(x - p.x) < L.cs * 0.46 && Math.abs(y - p.y) < L.cs * 0.46) return i; } return -1; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, tries: tries, max: MAXT, pairs: pairs, t: t, lock: lockT > 0, cards: cards.map(function (c, i) { var p = pos(i); return { v: c.v, open: c.open, done: c.done, x: p.x, y: p.y }; }) }; },
      down: function (x, y) { if (menu()) return; cur = Math.max(0, at(x, y)); flip(at(x, y)); },
      move: function () {}, up: function () {},
      key: function (k, d) {
        if (!d) return; if (st !== 'play') { menu(); return; }
        if (k === 'ArrowLeft' || k === 'KeyA') cur = (cur + 15) % 16; else if (k === 'ArrowRight' || k === 'KeyD') cur = (cur + 1) % 16;
        else if (k === 'ArrowUp' || k === 'KeyW') cur = (cur + 12) % 16; else if (k === 'ArrowDown' || k === 'KeyS') cur = (cur + 4) % 16;
        else if (k === 'Space' || k === 'Enter') flip(cur);
      },
      update: function (dt) {
        if (lockT > 0) { lockT -= dt; if (lockT <= 0) { cards[first].open = false; cards[second].open = false; first = second = -1; if (st === 'play' && tries >= MAXT) st = 'lose'; } }
        if (st !== 'play') return; t += dt; if (t >= LIM) st = 'lose';
      },
      draw: function () {
        var L = lay(), cs = L.cs, i;
        bg('#2a2347', '#120f24');
        for (i = 0; i < 16; i++) {
          var p = pos(i), c = cards[i], x = p.x - cs * 0.45, y = p.y - cs * 0.45, w = cs * 0.9;
          if (c.open || c.done) { g.fillStyle = c.done ? '#2f5a45' : COL[c.v]; rr(x, y, w, w, 10); g.fill(); txt(SYM[c.v], p.x, p.y + cs * 0.17, cs * 0.5, '#fff'); }
          else { g.fillStyle = '#4a3d78'; rr(x, y, w, w, 10); g.fill(); g.strokeStyle = 'rgba(243,236,210,.35)'; g.lineWidth = 2; rr(x + 5, y + 5, w - 10, w - 10, 7); g.stroke(); txt('✦', p.x, p.y + cs * 0.13, cs * 0.36, 'rgba(243,236,210,.55)'); }
          if (st === 'play' && i === cur) { g.strokeStyle = '#ffd88a'; g.lineWidth = 3; rr(x - 2, y - 2, w + 4, w + 4, 11); g.stroke(); }
        }
        bar(api.w / 2 - 110, api.h - 14, 220, 5, (LIM - t) / LIM, LIM - t < 20 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + pairs + '/' + NP, T.h2 + ' ' + tries + '/' + MAXT, tries >= MAXT - 3);
        fim(st);
      }
    };
  }
});
