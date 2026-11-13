/* O recitador da lei — toque nas notas no ritmo da recitação. */
BTJogo.registrar({
  canvas: 'jogo-althing',
  t: {
    pt: {
      titulo: 'O recitador da lei',
      sub: 'Do alto da Pedra da Lei, recite a lei no ritmo certo. As palavras caem em três faixas: toque na faixa certa quando chegarem à linha dourada. Três anos de recitação; erre mais de dez e a assembleia perde o fio.',
      toque: 'Toque para começar', ano: 'Ano', erros: 'Erros',
      perdeu: 'A assembleia perdeu o fio', de_novo: 'Toque para tentar de novo',
      v1: 'A lei foi recitada!',
      v2: 'O Althing, fundado por volta de 930, tinha um recitador da lei que dizia as leis de cor na Lögberg. O ritmo do jogo é invenção.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: 'The Lawspeaker',
      sub: 'From atop the Law Rock, recite the law in the right rhythm. Words fall in three lanes: tap the right lane when they reach the golden line. Three years of recitation; miss more than ten and the assembly loses the thread.',
      toque: 'Tap to start', ano: 'Year', erros: 'Mistakes',
      perdeu: 'The assembly lost the thread', de_novo: 'Tap to try again',
      v1: 'The law was recited!',
      v2: 'The Althing, founded around 930, had a lawspeaker who recited the laws by heart at the Lögberg. The rhythm of the game is made up.',
      jogar: 'Tap to play again'
    },
    no: {
      titulo: 'Lovsigemannen',
      sub: 'Fra Lovberget skal du resitere loven i riktig rytme. Ordene faller i tre baner: trykk på riktig bane når de når den gylne linjen. Tre år med resitasjon; bom mer enn ti ganger og forsamlingen mister tråden.',
      toque: 'Trykk for å starte', ano: 'År', erros: 'Feil',
      perdeu: 'Forsamlingen mistet tråden', de_novo: 'Trykk for å prøve igjen',
      v1: 'Loven er resitert!',
      v2: 'Alltinget, grunnlagt rundt 930, hadde en lovsigemann som sa opp lovene utenat på Lovberget. Rytmen i spillet er diktet opp.',
      jogar: 'Trykk for å spille igjen'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt, MAXE = 10, PER = 12, YEARS = 3;
    var st = 'menu', yr = 0, errs = 0, notes = [], t0 = 0, idx = 0, flash = 0, fcol = '', spawn = 0;
    function reset() { st = 'play'; yr = 1; errs = 0; notes = []; idx = 0; spawn = 0; t0 = 1.0; }
    function lane(x) { return Math.max(0, Math.min(2, Math.floor(x / (api.w / 3)))); }
    function lx(l) { return (l + 0.5) * api.w / 3; }
    function zone() { return api.h * 0.78; }
    function spd() { return 150 + yr * 40; }
    function bad() { errs++; flash = 0.2; fcol = '#ff6a5a'; if (errs >= MAXE) st = 'lose'; }
    function tocar(x) {
      if (st === 'menu' || st === 'lose') { reset(); return; }
      if (st === 'win') { st = 'menu'; return; }
      var l = lane(x), best = -1, bd = 1e9;
      notes.forEach(function (n, i) { var d = Math.abs(n.y - zone()); if (n.l === l && d < bd) { bd = d; best = i; } });
      if (best >= 0 && bd < 42) { notes.splice(best, 1); flash = 0.12; fcol = '#6fd08c'; } else bad();
    }
    return {
      pausar: function () {},
      dbg: function () { return { st: st, yr: yr, errs: errs, zone: zone(), notes: notes.map(function (n) { return { l: n.l, x: lx(n.l), y: n.y }; }) }; },
      down: function (x) { tocar(x); },
      key: function (c, d) { if (!d) return; if (st !== 'play') { if (c === 'Space' || c === 'Enter') tocar(0); return; } if (c === 'ArrowLeft' || c === 'KeyA') tocar(1); if (c === 'ArrowDown' || c === 'KeyS' || c === 'Space') tocar(api.w / 2); if (c === 'ArrowRight' || c === 'KeyD') tocar(api.w - 1); },
      update: function (dt) {
        if (flash > 0) flash -= dt; if (st !== 'play') return;
        spawn -= dt;
        if (idx < PER && spawn <= 0) { notes.push({ l: Math.floor(Math.random() * 3), y: -20 }); idx++; spawn = 0.85 - yr * 0.12; }
        for (var i = notes.length - 1; i >= 0; i--) { notes[i].y += spd() * dt; if (notes[i].y > zone() + 50) { notes.splice(i, 1); bad(); if (st !== 'play') return; } }
        if (idx >= PER && !notes.length) { if (yr >= YEARS) st = 'win'; else { yr++; idx = 0; spawn = 1; } }
      },
      draw: function () {
        var W = api.w, H = api.h, i;
        var s = g.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#23415a'); s.addColorStop(1, '#2f4f3a'); g.fillStyle = s; g.fillRect(0, 0, W, H);
        for (i = 1; i < 3; i++) { g.fillStyle = 'rgba(255,255,255,.14)'; g.fillRect(i * W / 3 - 1, 0, 2, H); }
        g.fillStyle = 'rgba(255,216,138,.9)'; g.fillRect(0, zone() - 2, W, 4);
        notes.forEach(function (n) { g.fillStyle = '#f3ecd2'; g.beginPath(); g.arc(lx(n.l), n.y, 24, 0, 6.29); g.fill(); txt('ᚱ', lx(n.l), n.y + 8, 22, '#3a2a14'); });
        if (st !== 'menu') {
          txt(T.ano + ' ' + Math.min(yr, YEARS) + '/' + YEARS, 22, 32, 15, '#f3ecd2', 'left');
          txt(T.erros + ': ' + errs + '/' + MAXE, 22, 54, 13, errs ? '#ffb08a' : '#c9b3f2', 'left');
        }
        if (flash > 0) { g.fillStyle = fcol; g.globalAlpha = flash * 0.4; g.fillRect(0, 0, W, H); g.globalAlpha = 1; }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
