/* O nome do Nøkken — toque nas letras do nome, na ordem, antes que ele chegue. */
BTJogo.registrar({
  canvas: 'jogo-nokken',
  t: {
    pt: {
      titulo: 'O nome do Nøkken',
      sub: 'O nøkken sobe do lago na direção da criança. Toque nas letras N, Ø, K, K, nessa ordem, enquanto flutuam na água. Letra errada o faz avançar. Espante-o três vezes.',
      toque: 'Toque para começar', rodada: 'Rodada', nome: 'O nome',
      perdeu: 'O nøkken alcançou a criança', de_novo: 'Toque para tentar de novo',
      v1: 'O nøkken fugiu!',
      v2: 'Em alguns relatos folclóricos, saber o nome do nøkken ou usar ferro o afasta. A brincadeira com as letras é invenção do jogo.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: "The Nøkken's name",
      sub: 'The nøkken rises from the lake toward the child. Tap the letters N, Ø, K, K, in that order, while they float on the water. A wrong letter makes it advance. Drive it off three times.',
      toque: 'Tap to start', rodada: 'Round', nome: 'The name',
      perdeu: 'The nøkken reached the child', de_novo: 'Tap to try again',
      v1: 'The nøkken fled!',
      v2: 'In some folklore accounts, knowing the nøkken\'s name or using iron drives it off. The letter game is made up.',
      jogar: 'Tap to play again'
    },
    no: {
      titulo: 'Nøkkens navn',
      sub: 'Nøkken stiger opp av innsjøen mot barnet. Trykk på bokstavene N, Ø, K, K, i den rekkefølgen, mens de flyter på vannet. En feil bokstav får den til å rykke fram. Jag den bort tre ganger.',
      toque: 'Trykk for å starte', rodada: 'Runde', nome: 'Navnet',
      perdeu: 'Nøkken nådde barnet', de_novo: 'Trykk for å prøve igjen',
      v1: 'Nøkken flyktet!',
      v2: 'I noen folketroberetninger jager det nøkken bort å kjenne navnet dens eller bruke jern. Bokstavspillet er diktet opp.',
      jogar: 'Trykk for å spille igjen'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt, R = 3, NAME = ['N', 'Ø', 'K', 'K'];
    var st = 'menu', rnd = 0, idx = 0, d = 0, bub = [], t = 0, shake = 0;
    function newRound() {
      rnd++; idx = 0; d = 0; t = 0;
      var chars = NAME.slice().sort(function () { return Math.random() - 0.5; });
      bub = chars.map(function (c, i) { return { ch: c, used: false, bx: api.w * (0.15 + 0.7 * (i + 0.5) / 4), by: api.h * (0.3 + 0.3 * ((i * 7 + rnd) % 4) / 3), ph: Math.random() * 6, sp: 0.7 + rnd * 0.25, am: 24 + Math.random() * 20, x: 0, y: 0 }; });
      pos();
    }
    function pos() { bub.forEach(function (b) { b.x = b.bx + Math.sin(t * b.sp + b.ph) * b.am * 2; b.y = b.by + Math.cos(t * b.sp * 1.3 + b.ph) * b.am; }); }
    function reset() { st = 'play'; rnd = 0; shake = 0; newRound(); }
    function tocar(x, y) {
      if (st === 'menu' || st === 'lose') { reset(); return; }
      if (st === 'win') { st = 'menu'; return; }
      var k = -1; bub.forEach(function (b, i) { if (!b.used && Math.hypot(x - b.x, y - b.y) < 36) k = i; });
      if (k < 0) return;
      if (bub[k].ch === NAME[idx]) { bub[k].used = true; idx++; if (idx >= 4) { if (rnd >= R) st = 'win'; else newRound(); } }
      else { d = Math.min(1, d + 0.15); shake = 0.3; }
    }
    return {
      pausar: function () {},
      dbg: function () { return { st: st, rnd: rnd, idx: idx, d: d, bub: bub, name: NAME }; },
      down: function (x, y) { tocar(x, y); },
      key: function (c, k) { if (k && (c === 'Space' || c === 'Enter') && st !== 'play') tocar(0, 0); },
      update: function (dt) {
        if (shake > 0) shake -= dt;
        if (st !== 'play') return;
        t += dt; pos(); d += (0.085 + rnd * 0.015) * dt;
        if (d >= 1) st = 'lose';
      },
      draw: function () {
        var W = api.w, H = api.h, i, wy = H * 0.2;
        var s = g.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#2a3b4f'); s.addColorStop(0.2, '#1a2a3a'); s.addColorStop(1, '#07121c'); g.fillStyle = s; g.fillRect(0, 0, W, H);
        g.fillStyle = '#12261c'; g.fillRect(0, 0, W, wy);
        g.fillStyle = '#d8b48a'; g.beginPath(); g.arc(W / 2, wy - 22, 9, 0, 6.29); g.fill(); g.fillStyle = '#c8553a'; g.fillRect(W / 2 - 9, wy - 14, 18, 14);
        g.strokeStyle = 'rgba(255,255,255,.08)'; g.lineWidth = 2; for (i = 0; i < 7; i++) { g.beginPath(); g.moveTo(0, wy + 30 + i * 38); g.lineTo(W, wy + 30 + i * 38 + Math.sin(api.clock + i) * 4); g.stroke(); }
        var ny = H - d * (H - wy - 26), nx = W / 2 + (shake > 0 ? Math.sin(api.clock * 60) * 4 : 0);
        if (st !== 'menu') {
          g.fillStyle = '#3d6a4a'; g.beginPath(); g.arc(nx, ny, 26, 3.14, 6.29); g.fill(); g.fillRect(nx - 26, ny, 52, 40);
          g.fillStyle = '#e6ff7a'; g.beginPath(); g.arc(nx - 9, ny - 8, 4, 0, 6.29); g.arc(nx + 9, ny - 8, 4, 0, 6.29); g.fill();
        }
        bub.forEach(function (b) { if (b.used) return; g.fillStyle = 'rgba(200,225,255,.22)'; g.beginPath(); g.arc(b.x, b.y, 30, 0, 6.29); g.fill(); g.strokeStyle = 'rgba(220,240,255,.6)'; g.lineWidth = 2; g.stroke(); txt(b.ch, b.x, b.y + 9, 28, '#fff'); });
        if (st !== 'menu') {
          txt(T.rodada + ' ' + rnd + '/' + R, 24, 34, 15, '#f3ecd2', 'left');
          txt(T.nome + ':', W / 2 - 60, 54 + 0, 14, '#c9b3f2', 'left');
          for (i = 0; i < 4; i++) txt(NAME[i], W / 2 + 10 + i * 24, 56, 22, i < idx ? '#9be3b4' : 'rgba(255,255,255,.5)');
        }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
