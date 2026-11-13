/* A travessia dos Birkebeiner — desça a montanha entre as árvores com o príncipe. */
BTJogo.registrar({
  canvas: 'jogo-esqui',
  t: {
    pt: {
      titulo: 'A travessia dos Birkebeiner',
      sub: 'Inverno de 1206. Leve o pequeno príncipe Haakon montanha abaixo até a segurança. Arraste o dedo (ou use as setas) para desviar das árvores e das pedras.',
      toque: 'Toque para começar', trecho: 'Caminho', batidas: 'Batidas',
      perdeu: 'O esqui bateu forte demais', de_novo: 'Toque para tentar de novo',
      v1: 'O príncipe está a salvo!',
      v2: 'Segundo a saga de Haakon Haakonsson, escrita por Sturla Þórðarson, dois Birkebeiner levaram o pequeno menino pelas montanhas, até Trondheim. Ele viria a ser o rei Haakon IV. O percurso do jogo é uma simplificação.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: 'The Birkebeiner crossing',
      sub: 'Winter of 1206. Carry little Prince Haakon down the mountain to safety. Drag your finger (or use the arrow keys) to dodge the trees and rocks.',
      toque: 'Tap to start', trecho: 'Path', batidas: 'Hits',
      perdeu: 'The ski hit too hard', de_novo: 'Tap to try again',
      v1: 'The prince is safe!',
      v2: "According to the saga of Haakon Haakonsson, written by Sturla Þórðarson, two Birkebeiner carried the little boy through the mountains, to Trondheim. He would become King Haakon IV. The route in the game is a simplification.",
      jogar: 'Tap to play again'
    },
    no: {
      titulo: 'Birkebeinerferden',
      sub: 'Vinteren 1206. Bær den lille prins Håkon nedover fjellet i sikkerhet. Dra fingeren (eller bruk piltastene) for å unngå trær og steiner.',
      toque: 'Trykk for å starte', trecho: 'Løype', batidas: 'Treff',
      perdeu: 'Skien tok for hardt imot', de_novo: 'Trykk for å prøve igjen',
      v1: 'Prinsen er i sikkerhet!',
      v2: 'Ifølge Håkon Håkonssons saga, skrevet av Sturla Þórðarson, bar to birkebeinere den lille gutten gjennom fjellene til Trondheim. Han skulle bli kong Håkon IV. Ruten i spillet er en forenkling.',
      jogar: 'Trykk for å spille igjen'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt;
    var st = 'menu', px = 0, alvo = null, obs = [], dist = 0, bat = 0, inv = 0, spawn = 0, teclas = { l: false, r: false }, DIST = 2600, flash = 0;
    function reset() { st = 'jogo'; px = api.w / 2; alvo = null; obs = []; dist = 0; bat = 0; inv = 0; spawn = 0.2; flash = 0; }
    function down(x, y) { if (st === 'menu' || st === 'lose') { reset(); return; } if (st === 'win') { st = 'menu'; return; } alvo = x; }
    return {
      down: down, move: function (x, y, p) { if (p && st === 'jogo') alvo = x; }, up: function () { alvo = null; }, pausar: function () { alvo = null; teclas.l = teclas.r = false; },
      key: function (c, d) { if (c === 'ArrowLeft' || c === 'KeyA') teclas.l = d; else if (c === 'ArrowRight' || c === 'KeyD') teclas.r = d; else if ((c === 'Space' || c === 'Enter') && d && st !== 'jogo') down(-999, -999); },
      update: function (dt) {
        if (st !== 'jogo') return;
        var vel = 260 + dist / DIST * 140; dist += vel * dt; if (inv > 0) inv -= dt; if (flash > 0) flash -= dt;
        if (teclas.l) px -= 300 * dt; if (teclas.r) px += 300 * dt;
        if (alvo !== null) { var d = alvo - px; px += Math.max(-420 * dt, Math.min(420 * dt, d)); }
        px = Math.max(24, Math.min(api.w - 24, px));
        spawn -= dt; if (spawn <= 0) { spawn = 0.45 - dist / DIST * 0.12; var n = 1 + (Math.random() < 0.35 ? 1 : 0); for (var i = 0; i < n; i++) obs.push({ x: 30 + Math.random() * (api.w - 60), y: -40, t: Math.random() < 0.7 ? 'p' : 'r' }); }
        var py = api.h * 0.72;
        for (i = obs.length - 1; i >= 0; i--) {
          var o = obs[i]; o.y += vel * dt; if (o.y > api.h + 50) { obs.splice(i, 1); continue; }
          if (inv <= 0 && Math.abs(o.x - px) < 26 && Math.abs(o.y - py) < 30) { bat++; inv = 1.2; flash = 0.3; obs.splice(i, 1); if (bat >= 3) st = 'lose'; }
        }
        if (dist >= DIST) st = 'win';
      },
      draw: function () {
        var W = api.w, H = api.h, py = H * 0.72;
        var s = g.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#dfeaf5'); s.addColorStop(1, '#f6fafd'); g.fillStyle = s; g.fillRect(0, 0, W, H);
        g.strokeStyle = 'rgba(150,170,200,.4)'; g.lineWidth = 2; for (var k = 0; k < 8; k++) { var yy = ((dist * 0.6 + k * 120) % (H + 60)); g.beginPath(); g.moveTo(0, yy); g.lineTo(W, yy + 20); g.stroke(); }
        obs.forEach(function (o) {
          if (o.t === 'p') { g.fillStyle = '#5b3f26'; g.fillRect(o.x - 4, o.y + 10, 8, 18); g.fillStyle = '#2f6b4a'; for (var j = 0; j < 3; j++) { g.beginPath(); g.moveTo(o.x - 22 + j * 3, o.y + 14 - j * 18); g.lineTo(o.x, o.y - 28 - j * 18 + 18); g.lineTo(o.x + 22 - j * 3, o.y + 14 - j * 18); g.fill(); } }
          else { g.fillStyle = '#7b8088'; g.beginPath(); g.ellipse(o.x, o.y, 24, 16, 0, 0, 6.29); g.fill(); }
        });
        if (st !== 'menu' && !(inv > 0 && Math.floor(inv * 10) % 2)) {
          g.fillStyle = '#6b4a2a'; g.fillRect(px - 14, py + 6, 6, 34); g.fillRect(px + 8, py + 6, 6, 34);
          g.fillStyle = '#3b3b4a'; g.beginPath(); g.ellipse(px, py - 6, 12, 18, 0, 0, 6.29); g.fill();
          g.fillStyle = '#e8c9a0'; g.beginPath(); g.arc(px, py - 28, 8, 0, 6.29); g.fill();
          g.fillStyle = '#c9a0d8'; g.beginPath(); g.arc(px + 12, py - 8, 9, 0, 6.29); g.fill();
        }
        if (flash > 0) { g.fillStyle = 'rgba(220,40,40,' + flash * 0.5 + ')'; g.fillRect(0, 0, W, H); }
        if (st !== 'menu') {
          g.fillStyle = 'rgba(16,36,60,.25)'; g.fillRect(24, 50, Math.min(220, W - 120), 8); g.fillStyle = '#2f6bd8'; g.fillRect(24, 50, Math.min(220, W - 120) * Math.min(1, dist / DIST), 8);
          txt(T.trecho, 24, 40, 14, '#10243c', 'left'); txt(T.batidas + ': ' + bat + '/3', 24, 78, 13, '#10243c', 'left');
        }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
