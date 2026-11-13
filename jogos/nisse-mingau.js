/* O nisse e a tigela de mingau — cuide dos animais até o amanhecer. */
BTJogo.registrar({
  canvas: 'jogo-nisse',
  t: {
    pt: {
      titulo: 'O nisse do celeiro', sub: 'Toque onde quer ir (ou use as setas). Quando um animal pedir ajuda, corra até ele antes que o tempo acabe. Cuide de todos até amanhecer.',
      toque: 'Toque para começar', cuidados: 'Cuidados', noite: 'Noite', amanhecer: 'Amanhecer',
      perdeu: 'O celeiro ficou sem cuidado', de_novo: 'Toque para tentar de novo',
      v1: 'Amanheceu!',
      v2: 'A menina chega ao celeiro com a tigela de mingau e manteiga. O nisse tem a sua recompensa. Esta é uma história original, inspirada na tradição escandinava do nisse.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: 'The barn nisse', sub: 'Tap where you want to go (or use the arrow keys). When an animal asks for help, run to it before time runs out. Look after them all until dawn.',
      toque: 'Tap to start', cuidados: 'Care', noite: 'Night', amanhecer: 'Dawn',
      perdeu: 'The barn was left uncared for', de_novo: 'Tap to try again',
      v1: 'Dawn has come!',
      v2: 'The girl arrives at the barn with the bowl of porridge and butter. The nisse gets his reward. This is an original tale, inspired by the Scandinavian nisse tradition.',
      jogar: 'Tap to play again'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt, DUR = 60;
    var ANIM = ['🐄', '🐴', '🐑', '🐖'], NEED = ['🌾', '💧', '🧣'];
    var st = 'menu', time = 0, vidas = 3, nx = 0, ny = 0, tx = 0, ty = 0, stalls = [], gen = 0, kx = 0, ky = 0, kL = 0, kR = 0, kU = 0, kD = 0;
    function layout() {
      var W = api.w, H = api.h, pts = [[.24, .34], [.76, .34], [.24, .72], [.76, .72]];
      stalls = ANIM.map(function (a, i) { var old = stalls[i] || {}; return { a: a, x: W * pts[i][0], y: H * pts[i][1], need: old.need || null, t: old.t || 0, max: old.max || 8 }; });
    }
    function start() { st = 'play'; time = 0; vidas = 3; gen = 1.5; layout(); stalls.forEach(function (s) { s.need = null; }); nx = tx = api.w / 2; ny = ty = api.h / 2; }
    function nisse() {
      var b = Math.sin(api.clock * 10) * (Math.hypot(tx - nx, ty - ny) > 4 ? 2 : 0.6);
      g.save(); g.translate(nx, ny + b);
      g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.ellipse(0, 22, 16, 5, 0, 0, 6.29); g.fill();
      g.fillStyle = '#35508f'; g.fillRect(-10, 0, 20, 22);
      g.fillStyle = '#e8c9a0'; g.beginPath(); g.arc(0, -4, 9, 0, 6.29); g.fill();
      g.fillStyle = '#f2f2f2'; g.beginPath(); g.moveTo(-9, -2); g.quadraticCurveTo(0, 22, 9, -2); g.fill();
      g.fillStyle = '#c0392b'; g.beginPath(); g.moveTo(-12, -6); g.lineTo(0, -34); g.lineTo(12, -6); g.closePath(); g.fill();
      g.restore();
    }
    function fundo() {
      var W = api.w, H = api.h, p = Math.min(1, time / DUR), s = g.createLinearGradient(0, 0, 0, H);
      s.addColorStop(0, '#2b2347'); s.addColorStop(1, '#4a3320'); g.fillStyle = s; g.fillRect(0, 0, W, H);
      g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 2; for (var i = 0; i < W; i += 46) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, H); g.stroke(); }
      g.fillStyle = 'rgba(255,200,120,' + (0.10 + 0.25 * p) + ')'; g.fillRect(0, 0, W, H);
      stalls.forEach(function (s2) { g.fillStyle = 'rgba(120,80,40,.55)'; g.fillRect(s2.x - 54, s2.y - 48, 108, 100); g.strokeStyle = '#8c5a2f'; g.lineWidth = 4; g.strokeRect(s2.x - 54, s2.y - 48, 108, 100); });
    }
    return {
      down: function (x, y) { if (st === 'menu' || st === 'lose') start(); else if (st === 'win') st = 'menu'; else { tx = x; ty = y; } },
      move: function (x, y, premido) { if (st === 'play' && premido) { tx = x; ty = y; } },
      pausar: function () {},
      resize: function () { layout(); },
      key: function (c, d) {
        if (c === 'ArrowLeft' || c === 'KeyA') kL = d; else if (c === 'ArrowRight' || c === 'KeyD') kR = d;
        else if (c === 'ArrowUp' || c === 'KeyW') kU = d; else if (c === 'ArrowDown' || c === 'KeyS') kD = d;
        else if ((c === 'Space' || c === 'Enter') && d) { if (st === 'menu' || st === 'lose') start(); else if (st === 'win') st = 'menu'; }
      },
      update: function (dt) {
        if (st !== 'play') return;
        time += dt; if (time >= DUR) { st = 'win'; return; }
        var dx = (kR ? 1 : 0) - (kL ? 1 : 0), dy = (kD ? 1 : 0) - (kU ? 1 : 0);
        if (dx || dy) { tx = Math.max(30, Math.min(api.w - 30, nx + dx * 60)); ty = Math.max(50, Math.min(api.h - 30, ny + dy * 60)); }
        var d = Math.hypot(tx - nx, ty - ny), v = 230 * dt;
        if (d > 3) { nx += (tx - nx) / d * Math.min(v, d); ny += (ty - ny) / d * Math.min(v, d); }
        gen -= dt;
        var abertos = stalls.filter(function (s) { return s.need; }).length;
        if (gen <= 0 && abertos < (time > 30 ? 3 : 2)) {
          var livres = stalls.filter(function (s) { return !s.need; });
          if (livres.length) { var s = livres[Math.floor(Math.random() * livres.length)]; s.need = NEED[Math.floor(Math.random() * 3)]; s.max = Math.max(5, 9 - time / 12); s.t = s.max; }
          gen = Math.max(1.4, 3 - time / 40);
        }
        stalls.forEach(function (s) {
          if (!s.need) return;
          s.t -= dt;
          if (Math.hypot(nx - s.x, ny - s.y) < 46) { s.need = null; return; }
          if (s.t <= 0) { s.need = null; vidas--; if (vidas <= 0) st = 'lose'; }
        });
      },
      draw: function () {
        fundo();
        stalls.forEach(function (s) {
          g.font = '44px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(s.a, s.x, s.y + 6);
          if (s.need) {
            var f = Math.max(0, s.t / s.max), pulsa = f < 0.35 && Math.floor(api.clock * 8) % 2;
            g.fillStyle = pulsa ? '#ff9a8d' : '#fff'; g.beginPath(); g.arc(s.x + 34, s.y - 40, 22, 0, 6.29); g.fill();
            g.strokeStyle = f < 0.35 ? '#e6554a' : '#3fa05a'; g.lineWidth = 4; g.beginPath(); g.arc(s.x + 34, s.y - 40, 22, -Math.PI / 2, -Math.PI / 2 + f * 6.283); g.stroke();
            g.font = '22px sans-serif'; g.fillStyle = '#000'; g.fillText(s.need, s.x + 34, s.y - 39);
          }
        });
        g.textBaseline = 'alphabetic';
        if (st !== 'menu') {
          nisse();
          txt(T.cuidados, 24, 34, 16, '#fff', 'left');
          for (var i = 0; i < 3; i++) { g.fillStyle = i < vidas ? '#e6554a' : 'rgba(255,255,255,.25)'; g.beginPath(); g.arc(112 + i * 22, 29, 8, 0, 6.29); g.fill(); }
          var pw = Math.min(200, api.w - 48), pr = Math.min(1, time / DUR);
          g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(24, 52, pw, 8); g.fillStyle = '#ffd88a'; g.fillRect(24, 52, pw * pr, 8);
          txt(T.noite, 24, 80, 13, '#e9e1f7', 'left'); txt(T.amanhecer, 24 + pw, 80, 13, '#e9e1f7', 'right');
        }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
