/* A forja dos anões — repita a sequência de golpes e termine o colar. */
BTJogo.registrar({
  canvas: 'jogo-freyja',
  t: {
    pt: {
      titulo: 'A forja dos anões',
      sub: 'Quatro anões forjam o colar de Freyja. Observe a ordem em que as bigornas brilham e repita os golpes. Cada rodada acrescenta mais um.',
      toque: 'Toque para começar', cont: 'Contas', erros: 'Erros', olhe: 'Observe...', sua: 'Sua vez!',
      nomes: ['Alfrigg', 'Dvalin', 'Berling', 'Grer'],
      perdeu: 'O colar não ficou pronto', de_novo: 'Toque para tentar de novo',
      v1: 'O colar está pronto!',
      v2: 'Na Sörla þáttr, os quatro anões se chamam Alfrigg, Dvalin, Berling e Grer, e é deles o colar que Freyja deseja. A forja em ritmo é invenção do jogo.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: "The dwarfs' forge",
      sub: "Four dwarfs forge Freyja's necklace. Watch the order in which the anvils glow and repeat the strikes. Each round adds one more.",
      toque: 'Tap to start', cont: 'Beads', erros: 'Mistakes', olhe: 'Watch...', sua: 'Your turn!',
      nomes: ['Alfrigg', 'Dvalin', 'Berling', 'Grer'],
      perdeu: 'The necklace was not finished', de_novo: 'Tap to try again',
      v1: 'The necklace is finished!',
      v2: "In the Sörla þáttr, the four dwarfs are called Alfrigg, Dvalin, Berling and Grer, and theirs is the necklace Freyja wants. The rhythm forge is made up for the game.",
      jogar: 'Tap to play again'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt;
    var cores = ['#e0653a', '#4fa3d9', '#7fbf5a', '#d9b43a'];
    var st = 'menu', seq = [], passo = 0, fase = 'mostra', tm = 0, acende = -1, erros = 0, rodada = 0, pads = [];
    var ALVO = 8;
    function layout() {
      var W = api.w, H = api.h, tam = Math.min(W, H) * 0.34, gap = tam * 0.12, cx = W / 2, cy = H * 0.55;
      if (W > H * 1.3) { pads = [0, 1, 2, 3].map(function (i) { return { x: cx + (i - 1.5) * (tam + gap), y: cy, s: tam }; }); tam = Math.min(tam, W / 4.6); pads.forEach(function (p, i) { p.s = tam; p.x = cx + (i - 1.5) * (tam * 1.12); }); }
      else pads = [0, 1, 2, 3].map(function (i) { return { x: cx + ((i % 2) - 0.5) * (tam + gap), y: cy + (Math.floor(i / 2) - 0.5) * (tam + gap), s: tam }; });
    }
    function proxima() { seq.push(Math.floor(Math.random() * 4)); passo = 0; fase = 'mostra'; tm = -0.8; }
    function reset() { st = 'jogo'; seq = []; erros = 0; rodada = 0; layout(); proxima(); }
    function dentro(p, x, y) { return Math.abs(x - p.x) < p.s / 2 && Math.abs(y - p.y) < p.s / 2; }
    function down(x, y) {
      if (st === 'menu' || st === 'lose') { reset(); return; }
      if (st === 'win') { st = 'menu'; return; }
      if (fase !== 'entrada') return;
      for (var i = 0; i < 4; i++) if (dentro(pads[i], x, y)) {
        acende = i; tm = 0.25;
        if (i === seq[passo]) { passo++; if (passo >= seq.length) { rodada++; if (rodada >= ALVO) { st = 'win'; } else { fase = 'pausa'; tm = -0.8; } } }
        else { erros++; if (erros >= 3) { st = 'lose'; } else { passo = 0; fase = 'mostra'; tm = -0.8; } }
        return;
      }
    }
    return {
      down: down, resize: layout,
      key: function (c, d) { if (!d) return; var m = { Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3 }; if (c in m && pads.length) down(pads[m[c]].x, pads[m[c]].y); else if ((c === 'Space' || c === 'Enter') && st !== 'jogo') down(-999, -999); },
      update: function (dt) {
        if (st !== 'jogo') return;
        if (acende >= 0 && fase === 'entrada') { tm -= dt; if (tm <= 0) acende = -1; }
        if (fase === 'mostra') {
          tm += dt; var idx = Math.floor(tm / 0.65);
          if (tm < 0) acende = -1;
          else if (idx >= seq.length) { fase = 'entrada'; acende = -1; }
          else acende = (tm % 0.65) < 0.45 ? seq[idx] : -1;
        } else if (fase === 'pausa') { tm += dt; if (tm >= 0) proxima(); }
      },
      draw: function () {
        var W = api.w, H = api.h, cx = W / 2;
        if (!pads.length) layout();
        var s = g.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#20141a'); s.addColorStop(1, '#3a1d14'); g.fillStyle = s; g.fillRect(0, 0, W, H);
        pads.forEach(function (p, i) {
          var on = acende === i;
          g.fillStyle = on ? cores[i] : 'rgba(255,255,255,.1)'; g.fillRect(p.x - p.s / 2, p.y - p.s / 2, p.s, p.s);
          g.strokeStyle = cores[i]; g.lineWidth = 4; g.strokeRect(p.x - p.s / 2, p.y - p.s / 2, p.s, p.s);
          g.fillStyle = on ? '#2a1a10' : '#6b5a4a'; g.fillRect(p.x - p.s * 0.32, p.y - p.s * 0.08, p.s * 0.64, p.s * 0.2); g.fillRect(p.x - p.s * 0.14, p.y + p.s * 0.1, p.s * 0.28, p.s * 0.16);
          txt(T.nomes[i], p.x, p.y - p.s * 0.28, Math.max(13, p.s * 0.1), on ? '#fff' : '#d9c7a8');
        });
        if (st !== 'menu') {
          txt(T.cont + ': ' + rodada + '/' + ALVO, 24, 34, 15, '#fff', 'left');
          txt(T.erros + ': ' + erros + '/3', 24, 56, 13, '#e9c9b0', 'left');
          for (var i = 0; i < ALVO; i++) { g.fillStyle = i < rodada ? '#ffd88a' : 'rgba(255,255,255,.2)'; g.beginPath(); g.arc(cx - (ALVO - 1) * 11 + i * 22, 96, 7, 0, 6.29); g.fill(); }
          if (st === 'jogo') txt(fase === 'entrada' ? T.sua : T.olhe, cx, 140, 18, '#ffd88a');
        }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
