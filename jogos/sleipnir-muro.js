/* O muro de Asgard — distraia o cavalo do construtor antes que o muro termine. */
BTJogo.registrar({
  canvas: 'jogo-sleipnir',
  t: {
    pt: {
      titulo: 'O muro de Asgard',
      sub: 'O construtor tem até o primeiro dia do verão para terminar o muro, com a ajuda do cavalo Svaðilfari. Você é Loki, disfarçado de égua: toque nas bolhas de coração para distrair o cavalo e atrasar a obra.',
      toque: 'Toque para começar', muro: 'Muro', dia: 'Dias até o verão',
      perdeu: 'O muro ficou pronto', de_novo: 'Toque para tentar de novo',
      v1: 'O verão chegou!',
      v2: 'No relato de Snorri, o construtor pedia como pagamento Freyja, o Sol e a Lua, e os deuses só aceitaram se o muro ficasse pronto num único inverno. Loki, como égua, atraiu o cavalo, e dessa união nasceu Sleipnir, o cavalo de oito patas de Odin. O jogo é uma simplificação.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: 'The wall of Asgard',
      sub: "The builder has until the first day of summer to finish the wall, with the help of the horse Svaðilfari. You are Loki, disguised as a mare: tap the heart bubbles to distract the horse and delay the work.",
      toque: 'Tap to start', muro: 'Wall', dia: 'Days until summer',
      perdeu: 'The wall was finished', de_novo: 'Tap to try again',
      v1: 'Summer has come!',
      v2: "In Snorri's account, the builder asked for Freyja, the Sun and the Moon as payment, and the gods only agreed if the wall was done in a single winter. Loki, as a mare, lured the horse away, and from that union Sleipnir, Odin's eight-legged horse, was born. The game is a simplification.",
      jogar: 'Tap to play again'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt;
    var st = 'menu', muro = 0, tempo = 0, pausa = 0, bolhas = [], spawn = 0, flash = 0, DUR = 60;
    function reset() { st = 'jogo'; muro = 0; tempo = 0; pausa = 0; bolhas = []; spawn = 1; flash = 0; }
    function down(x, y) {
      if (st === 'menu' || st === 'lose') { reset(); return; }
      if (st === 'win') { st = 'menu'; return; }
      for (var i = bolhas.length - 1; i >= 0; i--) {
        var b = bolhas[i];
        if (Math.hypot(b.x - x, b.y - y) < 46) { bolhas.splice(i, 1); pausa = Math.min(5, pausa + 3); flash = 0.3; return; }
      }
    }
    return {
      down: down, key: function (c, d) { if ((c === 'Space' || c === 'Enter') && d && st !== 'jogo') down(-999, -999); },
      update: function (dt) {
        if (st !== 'jogo') return;
        tempo += dt; if (flash > 0) flash -= dt;
        if (pausa > 0) pausa -= dt; else muro += 2.0 * dt;
        spawn -= dt; if (spawn <= 0 && bolhas.length < 3) { spawn = 2; bolhas.push({ x: 60 + Math.random() * (api.w - 120), y: api.h * 0.35 + Math.random() * (api.h * 0.4), t: 2.4 }); }
        for (var i = bolhas.length - 1; i >= 0; i--) { bolhas[i].t -= dt; if (bolhas[i].t <= 0) bolhas.splice(i, 1); }
        if (muro >= 100) st = 'lose'; else if (tempo >= DUR) st = 'win';
      },
      draw: function () {
        var W = api.w, H = api.h, cx = W / 2, f = tempo / DUR;
        var s = g.createLinearGradient(0, 0, 0, H); s.addColorStop(0, f > 0.8 ? '#6aa0c8' : '#3b4a66'); s.addColorStop(1, f > 0.8 ? '#cfe3d0' : '#e6edf5'); g.fillStyle = s; g.fillRect(0, 0, W, H);
        g.fillStyle = '#f4f7fb'; g.fillRect(0, H * 0.72, W, H * 0.28);
        // muro
        var alt = H * 0.5 * Math.min(1, muro / 100), mw = W * 0.8, mx = (W - mw) / 2, my = H * 0.72;
        g.fillStyle = '#7a7f88'; g.fillRect(mx, my - alt, mw, alt);
        g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 2;
        for (var yy = my - 22; yy > my - alt; yy -= 22) { g.beginPath(); g.moveTo(mx, yy); g.lineTo(mx + mw, yy); g.stroke(); }
        // cavalo
        var hx = cx + Math.sin(api.clock * (pausa > 0 ? 0.6 : 2)) * 30, hy = H * 0.8;
        g.fillStyle = '#8c8f96'; g.beginPath(); g.ellipse(hx, hy, 60, 28, 0, 0, 6.29); g.fill(); g.beginPath(); g.ellipse(hx + 52, hy - 22, 20, 14, -0.4, 0, 6.29); g.fill();
        g.fillRect(hx - 40, hy + 14, 8, 30); g.fillRect(hx + 28, hy + 14, 8, 30);
        if (pausa > 0) txt('♥', hx + 52, hy - 46, 28, '#ff6b8a');
        else { g.fillStyle = '#6b6f78'; g.fillRect(hx - 100, hy - 6, 40, 8); }
        bolhas.forEach(function (b) {
          g.fillStyle = 'rgba(255,140,170,.85)'; g.beginPath(); g.arc(b.x, b.y, 42, 0, 6.29); g.fill();
          g.strokeStyle = '#fff'; g.lineWidth = 3; g.beginPath(); g.arc(b.x, b.y, 42, -1.57, -1.57 + 6.29 * (b.t / 2.4)); g.stroke();
          txt('♥', b.x, b.y + 12, 34, '#fff');
        });
        if (st !== 'menu') {
          txt(T.muro + ': ' + Math.min(100, Math.round(muro)) + '%', 24, 34, 15, '#fff', 'left');
          txt(T.dia + ': ' + Math.max(0, Math.ceil(DUR - tempo)), 24, 56, 13, '#fff', 'left');
        }
        if (flash > 0) { g.fillStyle = 'rgba(255,255,255,' + flash + ')'; g.fillRect(0, 0, W, H); }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
