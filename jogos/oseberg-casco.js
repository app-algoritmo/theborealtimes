/* Casco de Oseberg — empilhe as tábuas de carvalho sobrepostas. */
BTJogo.registrar({
  canvas: 'jogo-oseberg',
  t: {
    pt: {
      titulo: 'O casco de Oseberg',
      sub: 'Os navios vikings tinham casco de tábuas sobrepostas, presas com rebites. Toque para soltar cada tábua em cima da anterior. O que passar do apoio é cortado.',
      toque: 'Toque para começar', tab: 'Tábuas',
      perdeu: 'A tábua caiu fora', de_novo: 'Toque para tentar de novo',
      v1: 'Casco pronto!',
      v2: 'Os navios de Oseberg e Gokstad foram feitos assim, em carvalho, com tábuas sobrepostas e rebitadas (a técnica de "clinker"). No jogo, empilhar com o toque é invenção.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: 'The Oseberg hull',
      sub: 'Viking ships had hulls of overlapping planks, held with rivets. Tap to drop each plank onto the one below. Whatever overhangs is cut off.',
      toque: 'Tap to start', tab: 'Planks',
      perdeu: 'The plank fell off', de_novo: 'Tap to try again',
      v1: 'Hull complete!',
      v2: 'The Oseberg and Gokstad ships were built this way, in oak, with overlapping riveted planks (the “clinker” technique). Stacking with taps in the game is made up.',
      jogar: 'Tap to play again'
    },
    no: {
      titulo: 'Osebergskroget',
      sub: 'Vikingskip hadde skrog av overlappende planker, festet med nagler. Trykk for å slippe hver planke ned på den under. Det som stikker utenfor, kappes av.',
      toque: 'Trykk for å starte', tab: 'Planker',
      perdeu: 'Planken falt av', de_novo: 'Trykk for å prøve igjen',
      v1: 'Skroget er ferdig!',
      v2: 'Oseberg- og Gokstadskipene ble bygget slik, i eik, med overlappende naglede planker («klinkbygging»). Stablingen med trykk i spillet er diktet opp.',
      jogar: 'Trykk for å spille igjen'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt;
    var st = 'menu', pilha = [], atual = null, N = 10, dir = 1;
    var BH = 26;
    function larg0() { return Math.min(api.w * 0.7, 380); }
    function reset() { st = 'jogo'; var w = larg0(); pilha = [{ x: (api.w - w) / 2, w: w }]; novo(); }
    function novo() {
      var t = pilha[pilha.length - 1];
      atual = { w: t.w, x: dir > 0 ? -t.w : api.w, v: (150 + pilha.length * 22) * dir };
    }
    function solta() {
      if (st === 'menu' || st === 'lose') { reset(); return; }
      if (st === 'win') { st = 'menu'; return; }
      var t = pilha[pilha.length - 1], a = atual;
      var l = Math.max(t.x, a.x), r = Math.min(t.x + t.w, a.x + a.w);
      if (r - l < 6) { st = 'lose'; return; }
      pilha.push({ x: l, w: r - l });
      if (pilha.length > N) { st = 'win'; return; }
      dir = -dir; novo();
    }
    return {
      down: function () { solta(); }, key: function (c, d) { if ((c === 'Space' || c === 'Enter') && d) solta(); },
      update: function (dt) {
        if (st !== 'jogo' || !atual) return;
        atual.x += atual.v * dt;
        if (atual.x < -atual.w - 20 && atual.v < 0) { atual.v = -atual.v; }
        if (atual.x > api.w + 20 && atual.v > 0) { atual.v = -atual.v; }
      },
      draw: function () {
        var W = api.w, H = api.h, cx = W / 2;
        var s = g.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#2c4a63'); s.addColorStop(1, '#16283a'); g.fillStyle = s; g.fillRect(0, 0, W, H);
        g.fillStyle = '#1d3a52'; g.fillRect(0, H - 60, W, 60);
        var base = H - 70;
        function tabua(x, y, w, cor) {
          g.fillStyle = cor; g.fillRect(x, y, w, BH - 2); g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 2; g.strokeRect(x, y, w, BH - 2);
          g.fillStyle = 'rgba(0,0,0,.4)'; for (var k = x + 10; k < x + w - 4; k += 26) { g.beginPath(); g.arc(k, y + BH / 2 - 1, 2.2, 0, 6.29); g.fill(); }
        }
        pilha.forEach(function (p, i) { tabua(p.x, base - i * (BH - 6), p.w, i % 2 ? '#8a5a2b' : '#a06a34'); });
        if (st === 'jogo' && atual) tabua(atual.x, base - pilha.length * (BH - 6), atual.w, '#c48a4c');
        if (st === 'win') {
          var t = pilha[pilha.length - 1], y = base - pilha.length * (BH - 6) + 14;
          g.fillStyle = '#c48a4c'; g.beginPath(); g.moveTo(t.x + t.w, y); g.quadraticCurveTo(t.x + t.w + 40, y - 40, t.x + t.w + 20, y - 90); g.lineTo(t.x + t.w - 6, y - 8); g.fill();
        }
        if (st !== 'menu') txt(T.tab + ': ' + Math.min(pilha.length - 1, N) + '/' + N, 24, 34, 16, '#fff', 'left');
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
