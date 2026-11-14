/* As cores de Bifröst — repita a sequência que Heimdall toca no chifre. */
BTJogo.registrar({
  canvas: 'jogo-bifrost',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As cores de Bifröst",
    "sub": "Heimdall sopra o Gjallarhorn e as cores da ponte acendem em sequência. Repita a ordem tocando nas cores. A cada rodada a sequência cresce; seis rodadas e a ponte está guardada.",
    "perdeu": "A ponte ficou sem guarda",
    "v1": "Bifröst está guardada!",
    "v2": "Heimdall guarda a ponte Bifröst e, no Ragnarök, soprará o Gjallarhorn. As cores e a sequência do jogo são invenção.",
    "h1": "Rodada"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The colours of Bifröst",
    "sub": "Heimdall blows the Gjallarhorn and the bridge's colours light up in sequence. Repeat the order by tapping the colours. Each round the sequence grows; six rounds and the bridge is guarded.",
    "perdeu": "The bridge was left unguarded",
    "v1": "Bifröst is guarded!",
    "v2": "Heimdall guards the bridge Bifröst and, at Ragnarök, will blow the Gjallarhorn. The colours and the sequence in the game are made up.",
    "h1": "Round"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Bifrosts farger",
    "sub": "Heimdall blåser i Gjallarhorn og brofargene lyser i rekkefølge. Gjenta rekkefølgen ved å trykke på fargene. Hver runde vokser rekken; seks runder og broen er vokta.",
    "perdeu": "Broen ble stående uten vakt",
    "v1": "Bifrost er vokta!",
    "v2": "Heimdall vokter broen Bifrost og skal under Ragnarok blåse i Gjallarhorn. Fargene og rekkefølgen i spillet er diktet opp.",
    "h1": "Runde"
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
    var COL = ['#e0524f', '#f0b84a', '#58b86a', '#4f8fe0'], N = 6;
    var seq = [], ph = 'show', idx = 0, lit = -1, tm = 0, inp = 0, round = 0;
    function reset() { st = 'play'; seq = []; round = 0; nxt(); }
    function nxt() { round++; seq.push(Math.floor(Math.random() * 4)); ph = 'show'; idx = 0; lit = -1; tm = 0.8; }
    function geo(i) { var d = Math.min(api.w, api.h) * 0.2, a = [[-1, -1], [1, -1], [-1, 1], [1, 1]][i]; return { x: api.w / 2 + a[0] * d * 1.05, y: api.h / 2 + 10 + a[1] * d * 1.05, r: d * 0.95 }; }
    return {
      pausar: function () {},
      dbg: function () { return { st: st, ph: ph, seq: seq.slice(), inp: inp, round: round, pads: [0, 1, 2, 3].map(geo) }; },
      down: function (x, y) {
        if (menu()) return; if (ph !== 'in') return;
        for (var i = 0; i < 4; i++) { var G = geo(i); if ((x - G.x) * (x - G.x) + (y - G.y) * (y - G.y) < G.r * G.r) {
          lit = i; tm = 0.25;
          if (i === seq[inp]) { inp++; if (inp >= seq.length) { ph = 'ok'; tm = 0.7; } } else st = 'lose';
          return; } }
      },
      key: function (c, d) { if (!d) return; if (st !== 'play') { if (c === 'Space' || c === 'Enter') menu(); return; } var m = { KeyQ: 0, KeyW: 1, KeyA: 2, KeyS: 3, Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3 }[c]; if (m !== undefined) { var G = geo(m); this.down(G.x, G.y); } },
      update: function (dt) {
        if (st !== 'play') return;
        if (ph === 'show') { tm -= dt; if (tm <= 0) { if (lit >= 0) { lit = -1; idx++; tm = 0.25; if (idx >= seq.length) { ph = 'in'; inp = 0; } } else if (idx < seq.length) { lit = seq[idx]; tm = 0.55; } } }
        else if (ph === 'in' && lit >= 0) { tm -= dt; if (tm <= 0) lit = -1; }
        else if (ph === 'ok') { tm -= dt; if (tm <= 0) { if (round >= N) st = 'win'; else nxt(); } }
      },
      draw: function () {
        var W = api.w, H = api.h, i;
        bg('#1b2144', '#0d1226');
        g.lineWidth = 8; ['#e0524f', '#f0b84a', '#58b86a', '#4f8fe0'].forEach(function (c, k) { g.strokeStyle = c; g.globalAlpha = 0.35; g.beginPath(); g.arc(W / 2, H * 0.24 + 60, W * 0.28 + k * 9, 3.3, 6.12); g.stroke(); }); g.globalAlpha = 1;
        for (i = 0; i < 4; i++) { var G = geo(i); g.globalAlpha = lit === i ? 1 : 0.42; g.fillStyle = COL[i]; g.beginPath(); g.arc(G.x, G.y, G.r, 0, 6.29); g.fill(); g.globalAlpha = 1; g.strokeStyle = 'rgba(255,255,255,.5)'; g.lineWidth = 3; g.beginPath(); g.arc(G.x, G.y, G.r, 0, 6.29); g.stroke(); }
        hud(T.h1 + ' ' + Math.min(round, N) + '/' + N, ph === 'show' ? '♪' : '');
        fim(st);
      }
    };
  }
});
