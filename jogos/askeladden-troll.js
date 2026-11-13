/* Askeladden e o troll — esconda o mingau no saco sem que o troll veja. */
BTJogo.registrar({
  canvas: 'jogo-troll',
  t: {
    pt: {
      titulo: 'Askeladden e o troll',
      sub: 'Askeladden disputa quem come mais com um troll. Segure o dedo (ou a barra de espaço) para despejar o mingau no saco escondido, e solte quando o troll olhar!',
      toque: 'Toque para começar', saco: 'Saco', erros: 'Flagras',
      segure: 'Segure para esconder, solte quando ele olhar', olha: 'Ele está olhando!',
      perdeu: 'O troll descobriu o truque', de_novo: 'Toque para tentar de novo',
      v1: 'Askeladden venceu!',
      v2: 'No conto recolhido por Asbjørnsen e Moe, Askeladden engana o troll com truques de esperteza, e as versões do concurso de comida variam. A mecânica do jogo é invenção.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: 'Askeladden and the troll',
      sub: 'Askeladden has an eating contest with a troll. Hold your finger (or the space bar) to pour porridge into the hidden bag, and let go when the troll looks!',
      toque: 'Tap to start', saco: 'Bag', erros: 'Caught',
      segure: 'Hold to hide, release when he looks', olha: 'He is looking!',
      perdeu: 'The troll found the trick', de_novo: 'Tap to try again',
      v1: 'Askeladden wins!',
      v2: 'In the tale collected by Asbjørnsen and Moe, Askeladden tricks the troll with cunning, and versions of the eating contest vary. The game mechanic is made up.',
      jogar: 'Tap to play again'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt;
    var st = 'menu', holding = false, saco = 0, erros = 0, olhando = false, aviso = 0, espera = 2, dur = 0, flash = 0, cd = 0;
    function reset() { st = 'jogo'; holding = false; saco = 0; erros = 0; olhando = false; aviso = 0; espera = 1.8; dur = 0; flash = 0; cd = 0; }
    function down() { if (st === 'menu' || st === 'lose') { reset(); return; } if (st === 'win') { st = 'menu'; return; } holding = true; }
    return {
      down: down, up: function () { holding = false; }, pausar: function () { holding = false; },
      key: function (c, d) { if (c === 'Space' || c === 'Enter') { if (d) down(); else holding = false; } },
      update: function (dt) {
        if (st !== 'jogo') return;
        if (flash > 0) flash -= dt; if (cd > 0) cd -= dt;
        if (olhando) { dur -= dt; if (dur <= 0) { olhando = false; espera = 1.2 + Math.random() * 1.6; } }
        else if (aviso > 0) { aviso -= dt; if (aviso <= 0) { olhando = true; dur = 1 + Math.random() * 0.8; } }
        else { espera -= dt; if (espera <= 0) aviso = 0.6; }
        if (holding) {
          if (olhando && cd <= 0) { erros++; flash = 0.4; cd = 1; saco = Math.max(0, saco - 0.1); if (erros >= 3) st = 'lose'; }
          else if (!olhando) { saco += 0.13 * dt; if (saco >= 1) st = 'win'; }
        }
      },
      draw: function () {
        var W = api.w, H = api.h, cx = W / 2;
        var s = g.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#2c3a2a'); s.addColorStop(1, '#14200f'); g.fillStyle = s; g.fillRect(0, 0, W, H);
        // troll
        var ty = H * 0.38, r = Math.min(W, H) * 0.2, vendo = olhando || aviso > 0;
        g.fillStyle = '#6a7a4a'; g.beginPath(); g.ellipse(cx, ty + r * 0.9, r * 1.2, r * 0.9, 0, 0, 6.29); g.fill();
        g.beginPath(); g.ellipse(cx, ty, r * 0.8, r * 0.75, 0, 0, 6.29); g.fill();
        g.beginPath(); g.ellipse(cx, ty + r * 0.1, r * 0.28, r * 0.22, 0, 0, 6.29); g.fillStyle = '#586a3c'; g.fill();
        g.fillStyle = vendo ? '#fff' : '#cfd6b8';
        if (vendo) { g.beginPath(); g.arc(cx - r * 0.3, ty - r * 0.2, r * 0.17, 0, 6.29); g.arc(cx + r * 0.3, ty - r * 0.2, r * 0.17, 0, 6.29); g.fill(); g.fillStyle = olhando ? '#d62b2b' : '#222'; g.beginPath(); g.arc(cx - r * 0.3, ty - r * 0.2, r * 0.07, 0, 6.29); g.arc(cx + r * 0.3, ty - r * 0.2, r * 0.07, 0, 6.29); g.fill(); }
        else { g.fillRect(cx - r * 0.45, ty - r * 0.2, r * 0.3, 5); g.fillRect(cx + r * 0.15, ty - r * 0.2, r * 0.3, 5); }
        if (aviso > 0 && !olhando) txt('!', cx, ty - r * 0.95, 40, '#ffd84a');
        if (olhando) txt(T.olha, cx, ty - r * 0.95, 20, '#ff9a8d');
        // tigela e saco
        var by = H * 0.72;
        g.fillStyle = '#d9c9a0'; g.beginPath(); g.ellipse(cx - 70, by, 56, 22, 0, 0, Math.PI); g.fill(); g.fillStyle = '#f2e9c9'; g.beginPath(); g.ellipse(cx - 70, by, 56, 12, 0, 0, 6.29); g.fill();
        var sh = 30 + saco * 70; g.fillStyle = '#8a5a2b'; g.beginPath(); g.ellipse(cx + 80, by + 20 - sh * 0.3, 40 + saco * 14, sh, 0, 0, 6.29); g.fill();
        if (holding && !olhando) { g.strokeStyle = '#f2e9c9'; g.lineWidth = 6; g.beginPath(); g.moveTo(cx - 70, by - 6); g.quadraticCurveTo(cx, by - 70, cx + 80, by - sh * 0.5); g.stroke(); }
        if (st !== 'menu') {
          txt(T.saco + ': ' + Math.round(saco * 100) + '%', 24, 34, 15, '#fff', 'left'); txt(T.erros + ': ' + erros + '/3', 24, 56, 13, '#e9c9b0', 'left');
          if (st === 'jogo') txt(T.segure, cx, H - 40, 15, '#e9e1c7');
        }
        if (flash > 0) { g.fillStyle = 'rgba(220,40,40,' + flash * 0.6 + ')'; g.fillRect(0, 0, W, H); }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
