/* Decifrar a Pedra de Rök — grave palavras tocando nas runas. */
BTJogo.registrar({
  canvas: 'jogo-rok',
  t: {
    pt: {
      titulo: 'Decifrar a Pedra de Rök',
      sub: 'Grave cada palavra na pedra tocando nas runas do futhark recente, na ordem das letras. Cada runa mostra a letra que representa. Cinco palavras, dez segundos cada; três erros e o cinzel escorrega.',
      toque: 'Toque para começar', palavra: 'Palavra', erros: 'Erros',
      perdeu: 'O cinzel escorregou', de_novo: 'Toque para tentar de novo',
      v1: 'Palavras gravadas!',
      v2: 'A Pedra de Rök, do século IX, tem cerca de 725 runas. As grafias do jogo estão simplificadas, e as palavras são nomes e termos do mundo nórdico.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: 'Decode the Rök Stone',
      sub: 'Carve each word on the stone by tapping the runes of the younger futhark, in the order of the letters. Each rune shows the letter it stands for. Five words, ten seconds each; three mistakes and the chisel slips.',
      toque: 'Tap to start', palavra: 'Word', erros: 'Mistakes',
      perdeu: 'The chisel slipped', de_novo: 'Tap to try again',
      v1: 'Words carved!',
      v2: 'The Rök Stone, from the 9th century, has about 725 runes. The spellings in the game are simplified, and the words are names and terms from the Norse world.',
      jogar: 'Tap to play again'
    },
    no: {
      titulo: 'Tyd Rökstenen',
      sub: 'Rist hvert ord på steinen ved å trykke på runene i det yngre futharken, i bokstavenes rekkefølge. Hver rune viser bokstaven den står for. Fem ord, ti sekunder hver; tre feil og meiselen glipper.',
      toque: 'Trykk for å starte', palavra: 'Ord', erros: 'Feil',
      perdeu: 'Meiselen glapp', de_novo: 'Trykk for å prøve igjen',
      v1: 'Ordene er risset!',
      v2: 'Rökstenen, fra 800-tallet, har omtrent 725 runer. Stavemåtene i spillet er forenklet, og ordene er navn og begreper fra den norrøne verden.',
      jogar: 'Trykk for å spille igjen'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt, MAXE = 3;
    var R = [['ᚠ', 'f'], ['ᚢ', 'u'], ['ᚦ', 'þ'], ['ᚬ', 'o'], ['ᚱ', 'r'], ['ᚴ', 'k'], ['ᚼ', 'h'], ['ᚾ', 'n'], ['ᛁ', 'i'], ['ᛅ', 'a'], ['ᛋ', 's'], ['ᛏ', 't'], ['ᛒ', 'b'], ['ᛘ', 'm'], ['ᛚ', 'l'], ['ᛦ', 'y']];
    var W5 = ['sol', 'ull', 'þor', 'loki', 'ask'];
    var st = 'menu', wi = 0, pos = 0, errs = 0, time = 0, flash = 0, fcol = '';
    function reset() { st = 'play'; wi = 0; errs = 0; nw(); }
    function nw() { pos = 0; time = 10; }
    function geo(k) { var w = api.w, h = api.h, cols = w >= 620 ? 8 : 4, cw = Math.min((w - 24) / cols, 84), rows = 16 / cols; return { x: w / 2 + ((k % cols) - (cols - 1) / 2) * cw, y: h - 30 - (rows - Math.floor(k / cols)) * (cw + 8) + cw / 2, r: cw * 0.42 }; }
    function bad() { errs++; flash = 0.3; fcol = '#ff6a5a'; if (errs >= MAXE) st = 'lose'; }
    return {
      pausar: function () {},
      dbg: function () { return { st: st, wi: wi, pos: pos, errs: errs, time: time, word: W5[wi], keys: R.map(function (r, k) { var G = geo(k); return { l: r[1], x: G.x, y: G.y }; }) }; },
      down: function (x, y) {
        if (st === 'menu' || st === 'lose') { reset(); return; }
        if (st === 'win') { st = 'menu'; return; }
        for (var k = 0; k < R.length; k++) {
          var G = geo(k);
          if (Math.hypot(x - G.x, y - G.y) < G.r * 1.15) {
            if (R[k][1] === W5[wi][pos]) { pos++; flash = 0.15; fcol = '#6fd08c'; if (pos >= W5[wi].length) { wi++; if (wi >= W5.length) st = 'win'; else nw(); } }
            else bad();
            return;
          }
        }
      },
      key: function (c, d) { if (d && (c === 'Space' || c === 'Enter') && st !== 'play') this.down(0, 0); },
      update: function (dt) { if (flash > 0) flash -= dt; if (st !== 'play') return; time -= dt; if (time <= 0) { bad(); if (st === 'play') nw(); } },
      draw: function () {
        var W = api.w, H = api.h, k;
        var s = g.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#3a3d44'); s.addColorStop(1, '#202226'); g.fillStyle = s; g.fillRect(0, 0, W, H);
        if (st === 'play') {
          var wd = W5[wi].toUpperCase();
          g.fillStyle = '#6f727a'; g.fillRect(W / 2 - 150, H * 0.1, 300, H * 0.2);
          for (k = 0; k < wd.length; k++) {
            var done = k < pos, rx = W / 2 + (k - (wd.length - 1) / 2) * 50;
            txt(wd[k], rx, H * 0.1 + 36, 24, '#e8e2d0');
            txt(done ? R.filter(function (r) { return r[1] === W5[wi][k]; })[0][0] : '▫', rx, H * 0.1 + H * 0.2 - 14, 30, done ? '#ffd88a' : '#444');
          }
          for (k = 0; k < R.length; k++) { var G = geo(k); g.fillStyle = '#4b4e57'; g.beginPath(); g.arc(G.x, G.y, G.r, 0, 6.29); g.fill(); txt(R[k][0], G.x, G.y + 4, 28, '#f3ecd2'); txt(R[k][1], G.x, G.y + G.r - 6, 12, '#c9b3f2'); }
          g.fillStyle = '#ffd88a'; g.fillRect(0, 0, W * Math.max(0, time) / 10, 6);
          txt(T.palavra + ' ' + (wi + 1) + '/' + W5.length, 22, 32, 15, '#f3ecd2', 'left');
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
