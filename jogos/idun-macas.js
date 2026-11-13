/* Idun e as maçãs — pegue as maçãs douradas e desvie da águia. */
BTJogo.registrar({
  canvas: 'jogo-idun',
  t: {
    pt: {
      titulo: 'Idun e as maçãs', sub: 'Mova a cesta para pegar as maçãs douradas antes que caiam no chão. Cuidado com a sombra da águia!',
      toque: 'Toque para começar', macas: 'Maçãs', juv: 'Juventude',
      perdeu: 'Os deuses envelheceram', de_novo: 'Toque para tentar de novo',
      v1: 'Os deuses continuam jovens!',
      v2: 'No mito, o gigante Thjazi, em forma de águia, rapta Idun, e Loki a traz de volta. No jogo, é você quem protege as maçãs.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: 'Idun and the apples', sub: "Move the basket to catch the golden apples before they hit the ground. Watch the eagle's shadow!",
      toque: 'Tap to start', macas: 'Apples', juv: 'Youth',
      perdeu: 'The gods grew old', de_novo: 'Tap to try again',
      v1: 'The gods stay young!',
      v2: 'In the myth, the giant Thjazi, in eagle form, abducts Idun, and Loki brings her back. In the game, you protect the apples yourself.',
      jogar: 'Tap to play again'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt, META = 30;
    var st = 'menu', bx = 225, tx = 225, apples = [], score = 0, vidas = 5, spawn = 0, stun = 0;
    var eagle = { ph: 'idle', x: 0, y: -60, t: 6 }, kL = false, kR = false;
    function reset() { st = 'play'; score = 0; vidas = 5; apples = []; spawn = 0.5; stun = 0; eagle = { ph: 'idle', x: 0, y: -60, t: 6 }; bx = tx = api.w / 2; }
    function ground() { return api.h - 40; }
    function by() { return api.h - 86; }
    function bg() {
      var W = api.w, H = api.h, s = g.createLinearGradient(0, 0, 0, H);
      s.addColorStop(0, '#2d1b5e'); s.addColorStop(0.6, '#c97a4b'); s.addColorStop(1, '#5a3a1e');
      g.fillStyle = s; g.fillRect(0, 0, W, H);
      g.fillStyle = '#16402a'; g.fillRect(0, ground(), W, H - ground());
      g.fillStyle = '#0f2f1f';
      for (var i = 0; i < W; i += 36) { g.beginPath(); g.moveTo(i, ground()); g.lineTo(i + 12, ground() - 14); g.lineTo(i + 24, ground()); g.fill(); }
      [W * 0.12, W * 0.88].forEach(function (x) {
        g.fillStyle = '#3b2412'; g.fillRect(x - 12, H * 0.25, 24, ground() - H * 0.25);
        g.fillStyle = '#1f5a38'; g.beginPath(); g.arc(x, H * 0.25, 70, 0, 6.29); g.fill();
      });
    }
    function idun(x) {
      var y = by();
      g.fillStyle = '#3d6fb5'; g.beginPath(); g.moveTo(x - 20, y + 60); g.lineTo(x + 20, y + 60); g.lineTo(x + 12, y + 8); g.lineTo(x - 12, y + 8); g.fill();
      g.fillStyle = '#e8c9a0'; g.beginPath(); g.arc(x, y - 2, 12, 0, 6.29); g.fill();
      g.fillStyle = '#e3b73c'; g.beginPath(); g.arc(x, y - 6, 13, Math.PI, 0); g.fill(); g.fillRect(x - 13, y - 6, 5, 28); g.fillRect(x + 8, y - 6, 5, 28);
      g.fillStyle = '#8a5a2b'; g.beginPath(); g.moveTo(x - 46, y + 20); g.lineTo(x + 46, y + 20); g.lineTo(x + 36, y + 48); g.lineTo(x - 36, y + 48); g.closePath(); g.fill();
      g.strokeStyle = '#c99a3c'; g.lineWidth = 3; g.strokeRect(x - 46, y + 18, 92, 4);
    }
    function apple(a) {
      g.fillStyle = '#e8b923'; g.beginPath(); g.arc(a.x, a.y, 14, 0, 6.29); g.fill();
      g.fillStyle = 'rgba(255,255,255,.55)'; g.beginPath(); g.arc(a.x - 5, a.y - 5, 4, 0, 6.29); g.fill();
      g.fillStyle = '#3fa05a'; g.beginPath(); g.ellipse(a.x + 5, a.y - 15, 6, 3, -0.5, 0, 6.29); g.fill();
    }
    function aguia(x, y, abertas) {
      g.save(); g.translate(x, y);
      g.fillStyle = '#4a3320';
      g.beginPath(); g.moveTo(-70, abertas ? -16 : -4); g.quadraticCurveTo(-30, 8, 0, 6); g.quadraticCurveTo(30, 8, 70, abertas ? -16 : -4); g.quadraticCurveTo(30, -14, 0, -10); g.quadraticCurveTo(-30, -14, -70, abertas ? -16 : -4); g.fill();
      g.fillStyle = '#f2f2f2'; g.beginPath(); g.arc(0, -12, 10, 0, 6.29); g.fill();
      g.fillStyle = '#e8b923'; g.beginPath(); g.moveTo(-3, -10); g.lineTo(3, -10); g.lineTo(0, -2); g.fill();
      g.restore();
    }
    function mexe(x) { tx = Math.max(50, Math.min(api.w - 50, x)); }
    return {
      down: function (x) { if (st === 'menu' || st === 'lose') reset(); else if (st === 'win') st = 'menu'; else mexe(x); },
      move: function (x) { if (st === 'play') mexe(x); },
      pausar: function () {},
      key: function (c, d) {
        if (c === 'ArrowLeft' || c === 'KeyA') kL = d; else if (c === 'ArrowRight' || c === 'KeyD') kR = d;
        else if ((c === 'Space' || c === 'Enter') && d) { if (st === 'menu' || st === 'lose') reset(); else if (st === 'win') st = 'menu'; }
      },
      update: function (dt) {
        if (st !== 'play') return;
        if (kL) tx -= 420 * dt; if (kR) tx += 420 * dt; tx = Math.max(50, Math.min(api.w - 50, tx));
        bx += (tx - bx) * Math.min(1, dt * 14); if (stun > 0) stun -= dt;
        spawn -= dt;
        if (spawn <= 0) { spawn = Math.max(0.42, 0.95 - score * 0.015); apples.push({ x: 40 + Math.random() * (api.w - 80), y: -20, v: 150 + score * 4 }); }
        for (var i = apples.length - 1; i >= 0; i--) {
          var a = apples[i]; a.y += a.v * dt;
          if (stun <= 0 && Math.abs(a.x - bx) < 52 && a.y > by() + 4 && a.y < by() + 40) { apples.splice(i, 1); score++; if (score >= META) { st = 'win'; return; } }
          else if (a.y > ground()) { apples.splice(i, 1); vidas--; if (vidas <= 0) { st = 'lose'; return; } }
        }
        if (eagle.ph === 'idle') { eagle.t -= dt; if (eagle.t <= 0) { eagle.ph = 'warn'; eagle.t = 1.2; eagle.x = Math.max(60, Math.min(api.w - 60, bx + (Math.random() - .5) * 300)); eagle.y = 40; } }
        else if (eagle.ph === 'warn') { eagle.t -= dt; if (eagle.t <= 0) { eagle.ph = 'dive'; eagle.t = 0.45; } }
        else if (eagle.ph === 'dive') {
          eagle.t -= dt; eagle.y = 40 + (1 - eagle.t / 0.45) * (by() - 20);
          if (eagle.t <= 0) { if (Math.abs(bx - eagle.x) < 60 && stun <= 0) { vidas--; stun = 1.2; if (vidas <= 0) { st = 'lose'; return; } } eagle.ph = 'rise'; eagle.t = 0.8; }
        } else if (eagle.ph === 'rise') { eagle.t -= dt; eagle.y -= 420 * dt; if (eagle.t <= 0) { eagle.ph = 'idle'; eagle.t = Math.max(3.5, 8 - score * 0.1); } }
      },
      draw: function () {
        var W = api.w;
        bg();
        if (eagle.ph === 'warn' || eagle.ph === 'dive') {
          g.fillStyle = 'rgba(0,0,0,' + (eagle.ph === 'warn' ? 0.25 + 0.2 * Math.sin(api.clock * 20) : 0.5) + ')'; g.fillRect(eagle.x - 60, 0, 120, ground());
        }
        apples.forEach(apple);
        if (eagle.ph !== 'idle') aguia(eagle.x, eagle.y, eagle.ph !== 'dive');
        if (!(stun > 0 && Math.floor(api.clock * 14) % 2)) idun(bx);
        if (st !== 'menu') {
          txt(T.macas + ': ' + score + '/' + META, 24, 34, 16, '#fff', 'left');
          txt(T.juv, 24, 60, 16, '#fff', 'left');
          for (var i = 0; i < 5; i++) { g.fillStyle = i < vidas ? '#e8b923' : 'rgba(255,255,255,.25)'; g.beginPath(); g.arc(104 + i * 20, 55, 7, 0, 6.29); g.fill(); }
        }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd84a');
      }
    };
  }
});
