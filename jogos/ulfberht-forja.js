/* A lâmina Ulfberht — golpeie o ferro quente no ponto certo. */
BTJogo.registrar({
  canvas: 'jogo-ulfberht',
  t: {
    pt: {
      titulo: 'A lâmina Ulfberht',
      sub: 'Toque (ou use a barra de espaço) quando o marcador passar pela faixa dourada, com o ferro no ponto. Oito golpes certos forjam a espada. Três erros estragam a lâmina.',
      toque: 'Toque para começar', golpes: 'Golpes', erros: 'Erros',
      perdeu: 'A lâmina rachou', de_novo: 'Toque para tentar de novo',
      v1: 'Espada forjada!',
      v2: 'Cerca de 170 espadas dos séculos IX a XI trazem o nome VLFBERHT gravado, e algumas têm aço de qualidade excepcional. A forja do jogo é uma simplificação.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: 'The Ulfberht blade',
      sub: 'Tap (or press the space bar) when the marker crosses the golden zone, with the iron at the right heat. Eight good strikes forge the sword. Three mistakes ruin the blade.',
      toque: 'Tap to start', golpes: 'Strikes', erros: 'Mistakes',
      perdeu: 'The blade cracked', de_novo: 'Tap to try again',
      v1: 'Sword forged!',
      v2: 'About 170 swords from the 9th to 11th centuries bear the name VLFBERHT, and some have exceptional steel. The forging in the game is a simplification.',
      jogar: 'Tap to play again'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt;
    var st = 'menu', pos = 0, dir = 1, vel = 0.9, certos = 0, erros = 0, flash = 0, flashOk = true, ALVO = 8;
    function reset() { st = 'jogo'; pos = 0; dir = 1; vel = 0.9; certos = 0; erros = 0; flash = 0; }
    function bate() {
      if (st === 'menu' || st === 'lose') { reset(); return; }
      if (st === 'win') { st = 'menu'; return; }
      var ctr = 0.5, larg = 0.14 - certos * 0.006;
      if (Math.abs(pos - ctr) <= larg / 2) { certos++; flashOk = true; flash = 0.35; vel += 0.12; if (certos >= ALVO) st = 'win'; }
      else { erros++; flashOk = false; flash = 0.35; if (erros >= 3) st = 'lose'; }
    }
    return {
      down: bate, key: function (c, d) { if ((c === 'Space' || c === 'Enter') && d) bate(); },
      update: function (dt) {
        if (st !== 'jogo') return;
        if (flash > 0) flash -= dt;
        pos += dir * vel * dt; if (pos > 1) { pos = 1; dir = -1; } if (pos < 0) { pos = 0; dir = 1; }
      },
      draw: function () {
        var W = api.w, H = api.h, cx = W / 2;
        var s = g.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#1b1613'); s.addColorStop(1, '#3a1e10'); g.fillStyle = s; g.fillRect(0, 0, W, H);
        var f = g.createRadialGradient(cx, H * 0.55, 10, cx, H * 0.55, Math.max(W, H) * 0.55); f.addColorStop(0, 'rgba(255,120,30,.35)'); f.addColorStop(1, 'rgba(255,120,30,0)'); g.fillStyle = f; g.fillRect(0, 0, W, H);
        // bigorna
        var ay = H * 0.62; g.fillStyle = '#5a5f66'; g.fillRect(cx - 90, ay, 180, 26); g.fillRect(cx - 40, ay + 26, 80, 50); g.fillRect(cx - 110, ay - 14, 120, 16);
        // lâmina cresce com os golpes
        var comp = 40 + certos * Math.min(34, (W - 140) / ALVO / 1.2), lx = cx - comp / 2, ly = ay - 26;
        var calor = flash > 0 && flashOk ? '#ffe9b0' : '#ff7a2a';
        g.fillStyle = calor; g.fillRect(lx, ly, comp, 12); g.beginPath(); g.moveTo(lx + comp, ly); g.lineTo(lx + comp + 22, ly + 6); g.lineTo(lx + comp, ly + 12); g.fill();
        if (st === 'win') { g.fillStyle = '#c9ced6'; g.fillRect(lx, ly, comp, 12); g.fillStyle = '#6b4a22'; g.fillRect(lx - 14, ly - 6, 14, 24); g.fillRect(lx - 40, ly + 2, 30, 8); txt('+VLFBERH+T', cx, ly - 22, 18, '#ffd88a'); }
        // barra de ritmo
        var bw = Math.min(W - 60, 460), bx = (W - bw) / 2, by = H * 0.3, larg = 0.14 - certos * 0.006;
        g.fillStyle = 'rgba(255,255,255,.14)'; g.fillRect(bx, by, bw, 26);
        g.fillStyle = '#e8b923'; g.fillRect(bx + bw * (0.5 - larg / 2), by, bw * larg, 26);
        g.fillStyle = '#fff'; g.fillRect(bx + bw * pos - 4, by - 8, 8, 42);
        if (flash > 0) { g.fillStyle = flashOk ? 'rgba(255,220,120,' + flash * 0.4 + ')' : 'rgba(220,40,40,' + flash * 0.6 + ')'; g.fillRect(0, 0, W, H); }
        if (st !== 'menu') { txt(T.golpes + ': ' + certos + '/' + ALVO, 24, 34, 15, '#fff', 'left'); txt(T.erros + ': ' + erros + '/3', 24, 56, 13, '#e9c9b0', 'left'); }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
