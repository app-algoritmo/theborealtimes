/* Os sonhos de Gudrún — lembre a ordem dos quatro maridos. */
BTJogo.registrar({
  canvas: 'jogo-gudrun',
  t: {
    pt: {
      titulo: 'Os sonhos de Gudrún',
      sub: 'Gudrún teve quatro maridos. Memorize a ordem dos casamentos e depois toque nos nomes na sequência certa. Três rodadas, cada uma com menos pistas; três erros e o sonho se desfaz.',
      toque: 'Toque para começar', rodada: 'Rodada', erros: 'Erros', mem: 'Memorize a ordem', qual: 'Toque nos maridos, na ordem dos casamentos',
      perdeu: 'O sonho se desfez', de_novo: 'Toque para tentar de novo',
      v1: 'Você lembrou de todos!',
      v2: 'Segundo a Laxdæla saga, a ordem é Þorvaldr, Þórðr, Bolli e Þorkell. Os sonhos da saga são outros; este jogo é invenção.',
      jogar: 'Toque para jogar de novo',
      nm: ['Þorvaldr', 'Þórðr', 'Bolli', 'Þorkell']
    },
    en: {
      titulo: "Gudrún's dreams",
      sub: 'Gudrún had four husbands. Memorise the order of the marriages and then tap the names in the right sequence. Three rounds, each with fewer clues; three mistakes and the dream fades.',
      toque: 'Tap to start', rodada: 'Round', erros: 'Mistakes', mem: 'Memorise the order', qual: 'Tap the husbands in the order of the marriages',
      perdeu: 'The dream faded', de_novo: 'Tap to try again',
      v1: 'You remembered them all!',
      v2: "According to the Laxdæla saga, the order is Þorvaldr, Þórðr, Bolli and Þorkell. The saga's dreams are different; this game is made up.",
      jogar: 'Tap to play again',
      nm: ['Þorvaldr', 'Þórðr', 'Bolli', 'Þorkell']
    },
    no: {
      titulo: 'Gudruns drømmer',
      sub: 'Gudrun hadde fire menn. Memorer rekkefølgen på ekteskapene og trykk så på navnene i riktig rekkefølge. Tre runder, hver med færre hint; tre feil og drømmen forsvinner.',
      toque: 'Trykk for å starte', rodada: 'Runde', erros: 'Feil', mem: 'Memorer rekkefølgen', qual: 'Trykk på mennene i ekteskapenes rekkefølge',
      perdeu: 'Drømmen forsvant', de_novo: 'Trykk for å prøve igjen',
      v1: 'Du husket alle!',
      v2: 'Ifølge Laksdøla saga er rekkefølgen Torvald, Tord, Bolle og Torkjell. Sagaens drømmer er andre; dette spillet er diktet opp.',
      jogar: 'Trykk for å spille igjen',
      nm: ['Torvald', 'Tord', 'Bolle', 'Torkjell']
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt, N = 3, MAXE = 3;
    var st = 'menu', rnd = 0, errs = 0, pos = [], nxt = 0, ph = 'mem', tm = 0, flash = [0, 0, 0, 0];
    function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
    function reset() { st = 'play'; rnd = 0; errs = 0; next(); }
    function next() { rnd++; ph = 'mem'; tm = 4.5 - rnd * 0.8; nxt = 0; pos = [0, 1, 2, 3]; flash = [0, 0, 0, 0]; }
    function geo(k) { var w = api.w, h = api.h, cols = w >= 520 ? 4 : 2, cw = Math.min((w - 30) / cols, 150); return { x: w / 2 + ((k % cols) - (cols - 1) / 2) * cw, y: h * 0.5 + (Math.floor(k / cols) - (cols === 4 ? 0 : 0.5)) * cw * 1.05, r: cw * 0.44 }; }
    function slot(h) { return pos.indexOf(h); }
    return {
      pausar: function () {},
      dbg: function () { return { st: st, rnd: rnd, errs: errs, ph: ph, nxt: nxt, tm: tm, at: [0, 1, 2, 3].map(function (h) { var G = geo(slot(h)); return { x: G.x, y: G.y }; }) }; },
      down: function (x, y) {
        if (st === 'menu' || st === 'lose') { reset(); return; }
        if (st === 'win') { st = 'menu'; return; }
        if (ph === 'mem') { tm = 0; return; }
        for (var k = 0; k < 4; k++) {
          var G = geo(k);
          if (Math.hypot(x - G.x, y - G.y) < G.r * 1.15) {
            var h = pos[k];
            if (h === nxt) { flash[h] = 0.4; nxt++; if (nxt >= 4) { if (rnd >= N) st = 'win'; else next(); } }
            else { errs++; flash[h] = -0.4; if (errs >= MAXE) st = 'lose'; }
            return;
          }
        }
      },
      key: function (c, d) { if (d && (c === 'Space' || c === 'Enter') && st !== 'play') this.down(0, 0); },
      update: function (dt) {
        for (var k = 0; k < 4; k++) { if (flash[k] > 0) flash[k] -= dt; else if (flash[k] < 0) flash[k] += dt; }
        if (st !== 'play') return;
        if (ph === 'mem') { tm -= dt; if (tm <= 0) { ph = 'pick'; pos = shuffle([0, 1, 2, 3]); } }
      },
      draw: function () {
        var W = api.w, H = api.h, i;
        var s = g.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#2a2147'); s.addColorStop(1, '#191a33'); g.fillStyle = s; g.fillRect(0, 0, W, H);
        for (i = 0; i < 20; i++) { g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect((i * 89 + api.clock * 6) % W, (i * 53) % H, 2, 2); }
        if (st !== 'menu') {
          txt(T.rodada + ' ' + Math.min(rnd, N) + '/' + N, 22, 32, 15, '#f3ecd2', 'left');
          txt(T.erros + ': ' + errs + '/' + MAXE, 22, 54, 13, errs ? '#ffb08a' : '#c9b3f2', 'left');
        }
        if (st === 'play') {
          txt(ph === 'mem' ? T.mem : T.qual, W / 2, H * 0.17, 18, '#ffd88a');
          for (var k = 0; k < 4; k++) {
            var G = geo(k), h = pos[k], f = flash[h];
            g.fillStyle = f > 0 ? '#1f8a4c' : f < 0 ? '#a8362e' : (ph === 'pick' && h < nxt ? '#2b4a3a' : '#3b3a63');
            g.beginPath(); g.arc(G.x, G.y, G.r, 0, 6.29); g.fill();
            txt('🧑', G.x, G.y + 4, 34, '#fff');
            var lab = ph === 'mem' ? (h + 1) + '. ' + T.nm[h] : (rnd >= 3 ? T.nm[h].charAt(0) : T.nm[h]);
            txt(lab, G.x, G.y + G.r + 20, 15, '#fff');
          }
        }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
