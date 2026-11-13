/* A batalha de Svolder — retese o arco no ponto certo, sem quebrá-lo. */
BTJogo.registrar({
  canvas: 'jogo-svolder',
  t: {
    pt: {
      titulo: 'A batalha de Svolder',
      sub: 'Segure para retesar o arco e solte quando a barra estiver na faixa dourada. Soltar cedo demais falha o tiro; esticar além do limite quebra o arco, como na saga. Acerte 8 navios; quatro tiros falhos e a Serpente Longa cai.',
      toque: 'Toque e segure para começar', acertos: 'Acertos', falhas: 'Falhas',
      perdeu: 'A Serpente Longa foi tomada', quebrou: 'O arco quebrou', de_novo: 'Toque para tentar de novo',
      v1: 'Svolder resistiu!',
      v2: 'Na Heimskringla, uma flecha parte o arco de Einarr Þambarskelfir e o rei pergunta o que se quebrou. O jogo é uma invenção; a batalha real terminou com a queda de Olaf Tryggvason.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: 'The battle of Svolder',
      sub: 'Hold to draw the bow and release when the bar is in the golden band. Releasing too early misses; stretching past the limit breaks the bow, as in the saga. Hit 8 ships; four missed shots and the Long Serpent falls.',
      toque: 'Tap and hold to start', acertos: 'Hits', falhas: 'Misses',
      perdeu: 'The Long Serpent was taken', quebrou: 'The bow broke', de_novo: 'Tap to try again',
      v1: 'Svolder held!',
      v2: "In the Heimskringla, an arrow splits Einarr Þambarskelfir's bow and the king asks what broke. The game is made up; the real battle ended with the fall of Olaf Tryggvason.",
      jogar: 'Tap to play again'
    },
    no: {
      titulo: 'Slaget ved Svolder',
      sub: 'Hold for å spenne buen og slipp når linjen er i det gylne feltet. Slipper du for tidlig, bommer du; strekker du forbi grensen, brekker buen, som i sagaen. Treff 8 skip; fire bom og Ormen Lange faller.',
      toque: 'Trykk og hold for å starte', acertos: 'Treff', falhas: 'Bom',
      perdeu: 'Ormen Lange ble tatt', quebrou: 'Buen brakk', de_novo: 'Trykk for å prøve igjen',
      v1: 'Svolder holdt!',
      v2: 'I Heimskringla splitter en pil buen til Einar Tambarskjelve, og kongen spør hva som brast. Spillet er diktet opp; det virkelige slaget endte med Olav Tryggvasons fall.',
      jogar: 'Trykk for å spille igjen'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt, GOAL = 8, MAXF = 4, LO = 0.68, HI = 0.92;
    var st = 'menu', hits = 0, miss = 0, draw = 0, held = false, ships = [], msg = '', msgt = 0, broke = false, arrow = null;
    function reset() { st = 'play'; hits = 0; miss = 0; draw = 0; held = false; ships = []; msg = ''; broke = false; arrow = null; addShip(); }
    function addShip() { ships.push({ x: api.w * 0.78, y: api.h * 0.4 + (Math.random() - 0.5) * 50, hp: 1 }); }
    function release() {
      if (st !== 'play' || !held) return; held = false;
      if (draw < 0.15) { draw = 0; return; }
      var ok = draw >= LO && draw <= HI; arrow = { t: 0, ok: ok };
      if (ok) { hits++; msg = '✔'; if (hits >= GOAL) { st = 'win'; return; } }
      else { miss++; msg = '✖'; if (miss >= MAXF) { st = 'lose'; broke = false; } }
      msgt = 0.6; draw = 0;
    }
    return {
      pausar: function () { held = false; draw = 0; },
      dbg: function () { return { st: st, hits: hits, miss: miss, draw: draw, held: held, LO: LO, HI: HI, broke: broke }; },
      down: function () {
        if (st === 'menu' || st === 'lose') { reset(); held = true; return; }
        if (st === 'win') { st = 'menu'; return; }
        held = true;
      },
      up: function () { release(); },
      key: function (c, d) { if (c !== 'Space' && c !== 'Enter') return; if (d) this.down(0, 0); else release(); },
      update: function (dt) {
        if (msgt > 0) msgt -= dt;
        if (arrow) { arrow.t += dt; if (arrow.t > 0.5) { if (arrow.ok) { ships.shift(); addShip(); } arrow = null; } }
        if (st !== 'play') return;
        if (held) { draw += dt / 1.3; if (draw > 1) { held = false; draw = 0; broke = true; st = 'lose'; } }
      },
      draw: function () {
        var W = api.w, H = api.h, i;
        var s = g.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#506f8a'); s.addColorStop(0.55, '#8aa6b8'); s.addColorStop(0.55, '#254b63'); s.addColorStop(1, '#10283a'); g.fillStyle = s; g.fillRect(0, 0, W, H);
        g.strokeStyle = 'rgba(255,255,255,.12)'; for (i = 0; i < 9; i++) { var y = H * 0.58 + i * 22; g.beginPath(); g.moveTo(0, y); for (var x = 0; x <= W; x += 20) g.lineTo(x, y + Math.sin(x * 0.05 + api.clock * 2 + i) * 3); g.stroke(); }
        txt('🛶', W * 0.16, H * 0.5, 54, '#fff');
        ships.forEach(function (sh) { txt('⛵', sh.x, sh.y + 20, 58, '#fff'); });
        if (arrow) { var k = arrow.t / 0.5, ax = W * 0.2 + (W * 0.58) * k, ay = H * 0.45 - Math.sin(k * Math.PI) * 60; g.fillStyle = '#e8d9b0'; g.fillRect(ax, ay, 22, 3); }
        if (st !== 'menu') {
          txt(T.acertos + ': ' + hits + '/' + GOAL, 22, 32, 15, '#fff', 'left');
          txt(T.falhas + ': ' + miss + '/' + MAXF, 22, 54, 13, miss ? '#ffb08a' : '#e0ecf4', 'left');
          var bx = W / 2 - 150, by = H - 60;
          g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(bx, by, 300, 20);
          g.fillStyle = 'rgba(255,200,60,.55)'; g.fillRect(bx + 300 * LO, by, 300 * (HI - LO), 20);
          g.fillStyle = draw > HI ? '#ff6a5a' : '#fff'; g.fillRect(bx, by, 300 * Math.min(1, draw), 20);
          if (msgt > 0) txt(msg, W / 2, H * 0.3, 42, msg === '✔' ? '#6fd08c' : '#ff8a7a');
        }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(broke ? T.quebrou : T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
