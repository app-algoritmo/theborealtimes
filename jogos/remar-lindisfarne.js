/* Remar até Lindisfarne — toque no ritmo certo para chegar à ilha. */
BTJogo.registrar({
  canvas: 'jogo-remar',
  t: {
    pt: {
      titulo: 'Remar até Lindisfarne',
      sub: 'O navio cruza o mar do Norte rumo à ilha. Toque quando o marcador passar pela zona dourada para dar uma remada certeira. Remadas fora do tempo atrasam o barco. Faça vinte remadas.',
      toque: 'Toque para começar', remadas: 'Remadas', erros: 'Erros',
      perdeu: 'O barco não chegou a tempo', de_novo: 'Toque para tentar de novo',
      v1: 'Terra à vista!',
      v2: 'Em 8 de junho de 793, vikings atacaram o mosteiro de Lindisfarne, na Nortúmbria. Os detalhes da travessia e o ritmo das remadas são invenção do jogo.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: 'Row to Lindisfarne',
      sub: 'The ship crosses the North Sea toward the island. Tap when the marker passes through the golden zone for a clean stroke. Strokes out of time slow the boat. Make twenty strokes.',
      toque: 'Tap to start', remadas: 'Strokes', erros: 'Misses',
      perdeu: 'The boat did not arrive in time', de_novo: 'Tap to try again',
      v1: 'Land ahead!',
      v2: 'On 8 June 793, Vikings attacked the monastery of Lindisfarne, in Northumbria. The details of the crossing and the rowing rhythm are made up for the game.',
      jogar: 'Tap to play again'
    },
    no: {
      titulo: 'Ro til Lindisfarne',
      sub: 'Skipet krysser Nordsjøen mot øya. Trykk når markøren passerer den gylne sonen for et rent åretak. Åretak ute av takt bremser båten. Ta tjue åretak.',
      toque: 'Trykk for å starte', remadas: 'Åretak', erros: 'Bom',
      perdeu: 'Båten kom ikke fram i tide', de_novo: 'Trykk for å prøve igjen',
      v1: 'Land i sikte!',
      v2: 'Den 8. juni 793 angrep vikinger klosteret på Lindisfarne i Northumbria. Detaljene om overfarten og åretaktene er diktet opp for spillet.',
      jogar: 'Trykk for å spille igjen'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt, META = 20, MAXE = 5, LIM = 45;
    var st = 'menu', n = 0, err = 0, m = 0, dir = 1, time = 0, cool = 0, boat = 0, kick = 0, fl = 0, fc = '#fff';
    function reset() { st = 'play'; n = 0; err = 0; m = 0; dir = 1; time = 0; cool = 0; boat = 0; kick = 0; fl = 0; }
    function sp() { return 0.9 + n * 0.035; }
    function tap() {
      if (st === 'menu' || st === 'lose') { reset(); return; }
      if (st === 'win') { st = 'menu'; return; }
      if (cool > 0) return; cool = 0.25;
      if (Math.abs(m - 0.5) < 0.11) { n++; kick = 0.5; fl = 0.25; fc = '#ffd88a'; if (n >= META) st = 'win'; }
      else { err++; fl = 0.25; fc = '#ff9a8d'; if (err >= MAXE) st = 'lose'; }
    }
    return {
      pausar: function () {},
      dbg: function () { return { st: st, n: n, err: err, m: m, time: time }; },
      down: function () { tap(); },
      key: function (c, d) { if (d && (c === 'Space' || c === 'Enter' || c === 'ArrowDown')) tap(); },
      update: function (dt) {
        if (fl > 0) fl -= dt; if (kick > 0) kick -= dt;
        if (st !== 'play') return;
        time += dt; if (cool > 0) cool -= dt;
        m += dir * sp() * dt; if (m >= 1) { m = 1; dir = -1; } else if (m <= 0) { m = 0; dir = 1; }
        boat += ((n / META) - boat) * Math.min(1, dt * 3);
        if (time >= LIM) st = 'lose';
      },
      draw: function () {
        var W = api.w, H = api.h, i;
        var s = g.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#7aa6c4'); s.addColorStop(0.42, '#cfe0ea'); s.addColorStop(0.43, '#2f5f7e'); s.addColorStop(1, '#0f2a3c'); g.fillStyle = s; g.fillRect(0, 0, W, H);
        var ix = W * (0.3 + 0.55 * boat * boat);
        g.fillStyle = '#4a6b4a'; g.beginPath(); g.moveTo(W * 0.62 + (1 - boat) * 140, H * 0.43); g.lineTo(W * 0.74 + (1 - boat) * 140, H * 0.36); g.lineTo(W * 0.9 + (1 - boat) * 140, H * 0.43); g.fill();
        g.fillStyle = '#8c8c92'; g.fillRect(W * 0.76 + (1 - boat) * 140, H * 0.35, 12, 14);
        g.strokeStyle = 'rgba(255,255,255,.14)'; g.lineWidth = 2;
        for (i = 0; i < 8; i++) { g.beginPath(); for (var x = 0; x <= W; x += 16) { var y = H * 0.47 + i * 22 + Math.sin((x + i * 40 - api.clock * 60) / 30) * 3; if (x === 0) g.moveTo(x, y); else g.lineTo(x, y); } g.stroke(); }
        var bx = W * 0.14 + W * 0.3 * boat, by = H * 0.52 + Math.sin(api.clock * 3) * 3;
        g.save(); g.translate(bx, by);
        g.fillStyle = '#6b3e1f'; g.beginPath(); g.moveTo(-60, -10); g.lineTo(60, -10); g.lineTo(46, 16); g.lineTo(-46, 16); g.closePath(); g.fill();
        g.fillStyle = '#f3ecd2'; g.fillRect(-6, -62, 12, 52); g.fillRect(-26, -62, 52, 30); g.fillStyle = '#b73a2e'; g.fillRect(-26, -62, 17, 30); g.fillRect(9, -62, 17, 30);
        g.strokeStyle = '#d8b48a'; g.lineWidth = 3; var sw = kick > 0 ? Math.sin(kick * 12) * 12 : 0; for (i = -2; i <= 2; i++) { g.beginPath(); g.moveTo(i * 20, 6); g.lineTo(i * 20 - 12 + sw, 34); g.stroke(); }
        g.restore();
        var bw = Math.min(W - 80, 420), bx0 = W / 2 - bw / 2, byy = H * 0.84;
        g.fillStyle = 'rgba(255,255,255,.16)'; g.fillRect(bx0, byy, bw, 18);
        g.fillStyle = '#e8a900'; g.fillRect(bx0 + bw * 0.39, byy - 3, bw * 0.22, 24);
        g.fillStyle = '#fff'; g.fillRect(bx0 + bw * m - 3, byy - 8, 6, 34);
        if (fl > 0) { g.fillStyle = fc; g.globalAlpha = fl * 1.5; g.fillRect(bx0, byy - 3, bw, 24); g.globalAlpha = 1; }
        if (st !== 'menu') {
          txt(T.remadas + ': ' + n + '/' + META, 24, 34, 15, '#10222e', 'left');
          txt(T.erros + ': ' + err + '/' + MAXE, 24, 56, 13, err ? '#a8322a' : '#17364a', 'left');
          var pw = Math.min(220, W - 48); g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(24, 66, pw, 6); g.fillStyle = '#fff'; g.fillRect(24, 66, pw * (1 - Math.min(1, time / LIM)), 6);
        }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
