/* Os cacos de Hrungnir — corte as pedras que voam antes que caiam. */
BTJogo.registrar({
  canvas: 'jogo-hrungnir',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os cacos de Hrungnir",
    "sub": "O gigante de pedra se despedaça, e os cacos voam. Passe o dedo (ou o mouse) por cima deles para cortá-los; com o teclado, mova a mira e use a barra de espaço. Corte vinte e cinco cacos. Se três caírem, o jogo acaba.",
    "perdeu": "Os cacos caíram sobre o deus",
    "v1": "O gigante caiu!",
    "v2": "Segundo Snorri, um caco da pedra de amolar de Hrungnir ficou cravado na cabeça de Thor. A chuva de cacos é invenção do jogo.",
    "h1": "Cacos",
    "h2": "Perdidos"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Hrungnir's shards",
    "sub": "The stone giant shatters, and the shards fly. Swipe your finger (or mouse) across them to cut them; with the keyboard, move the crosshair and press Space. Cut twenty-five shards. If three fall, the game is over.",
    "perdeu": "The shards fell on the god",
    "v1": "The giant has fallen!",
    "v2": "According to Snorri, a shard of Hrungnir's whetstone stayed lodged in Thor's head. The rain of shards is made up for the game.",
    "h1": "Shards",
    "h2": "Missed"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Hrungnes skår",
    "sub": "Steinjotunen knuses, og skårene flyr. Dra fingeren (eller musa) over dem for å skjære dem; med tastatur flytter du siktet og bruker mellomromstasten. Skjær tjuefem skår. Faller tre, er spillet over.",
    "perdeu": "Skårene falt på guden",
    "v1": "Jotunen er falt!",
    "v2": "Ifølge Snorre ble et skår av Hrungnes bryne sittende fast i hodet til Tor. Skårregnet er diktet opp for spillet.",
    "h1": "Skår",
    "h2": "Mistet"
  }
},
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt;
    var st = 'menu';
    function menu() { if (st === 'menu' || st === 'lose') { reset(); return true; } if (st === 'win') { st = 'menu'; return true; } return false; }
    function fim(s) {
      if (s === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
      else if (s === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
      else if (s === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
    }
    function bg(a, b) { var s = g.createLinearGradient(0, 0, 0, api.h); s.addColorStop(0, a); s.addColorStop(1, b); g.fillStyle = s; g.fillRect(0, 0, api.w, api.h); }
    function hud(a, b, bad) { if (st === 'menu') return; txt(a, 22, 32, 15, '#f3ecd2', 'left'); if (b) txt(b, 22, 54, 13, bad ? '#ffb08a' : '#c9b3f2', 'left'); }
    function rr(x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
    function bar(x, y, w, h, f, c) { g.fillStyle = 'rgba(0,0,0,.28)'; g.fillRect(x, y, w, h); g.fillStyle = c; g.fillRect(x, y, w * Math.max(0, Math.min(1, f)), h); }
    var NEED = 25, MAXE = 3, GR = 520;
    var sh = [], hits = 0, errs = 0, sp = 0, px = 0, py = 0, pr = false, cx = 225, cy = 200, kx = 0, ky = 0, hv = [];
    function setup() { sh = []; hits = 0; errs = 0; sp = 0.6; pr = false; hv = []; cx = api.w / 2; cy = api.h / 2; }
    function reset() { setup(); st = 'play'; }
    function spawn() {
      var W = api.w, H = api.h, x = W * (0.15 + Math.random() * 0.7), h = H * (0.5 + Math.random() * 0.3), vy = -Math.sqrt(2 * GR * h);
      sh.push({ x: x, y: H + 24, vx: (W / 2 - x) * 0.22 + (Math.random() - 0.5) * 80, vy: vy, r: 28 + Math.random() * 8, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 5 });
    }
    function cut(ax, ay, bx, by) {
      var dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy;
      for (var i = sh.length - 1; i >= 0; i--) {
        var s = sh[i], t = L2 ? Math.max(0, Math.min(1, ((s.x - ax) * dx + (s.y - ay) * dy) / L2)) : 0, qx = ax + dx * t, qy = ay + dy * t;
        if (Math.hypot(s.x - qx, s.y - qy) <= s.r + 8) { hv.push({ x: s.x, y: s.y, vx: s.vx - 90, vy: s.vy, l: 0.8, r: s.r, s: -1 }); hv.push({ x: s.x, y: s.y, vx: s.vx + 90, vy: s.vy, l: 0.8, r: s.r, s: 1 }); sh.splice(i, 1); hits++; if (api.nota) api.nota(500 + (hits % 5) * 60, 0.07, 'square', 0.04); }
      }
      if (hits >= NEED && st === 'play') st = 'win';
    }
    setup();
    return {
      pausar: function () { pr = false; kx = 0; ky = 0; },
      dbg: function () { return { st: st, hits: hits, errs: errs, sh: sh.map(function (s) { return { x: s.x, y: s.y, vy: s.vy }; }), H: api.h }; },
      down: function (x, y) { if (menu()) return; pr = true; px = x; py = y; cx = x; cy = y; cut(x, y, x, y); },
      move: function (x, y, p) { cx = x; cy = y; if (pr && st === 'play') { cut(px, py, x, y); px = x; py = y; } },
      up: function () { pr = false; },
      key: function (c, d) {
        if (c === 'ArrowLeft' || c === 'KeyA') kx = d ? -1 : (kx === -1 ? 0 : kx); else if (c === 'ArrowRight' || c === 'KeyD') kx = d ? 1 : (kx === 1 ? 0 : kx);
        else if (c === 'ArrowUp' || c === 'KeyW') ky = d ? -1 : (ky === -1 ? 0 : ky); else if (c === 'ArrowDown' || c === 'KeyS') ky = d ? 1 : (ky === 1 ? 0 : ky);
        else if ((c === 'Space' || c === 'Enter') && d) { if (st !== 'play') menu(); else cut(cx - 50, cy, cx + 50, cy); }
      },
      update: function (dt) {
        var i; for (i = hv.length - 1; i >= 0; i--) { var h = hv[i]; h.l -= dt; h.vy += GR * dt; h.x += h.vx * dt; h.y += h.vy * dt; if (h.l <= 0) hv.splice(i, 1); }
        if (st !== 'play') return; cx = Math.max(0, Math.min(api.w, cx + kx * 360 * dt)); cy = Math.max(0, Math.min(api.h, cy + ky * 360 * dt));
        sp -= dt; if (sp <= 0) { spawn(); if (hits > 5 && Math.random() < 0.4) spawn(); sp = Math.max(0.4, 0.95 - hits * 0.03); }
        for (i = sh.length - 1; i >= 0; i--) { var s = sh[i]; s.vy += GR * dt; s.x += s.vx * dt; s.y += s.vy * dt; s.rot += s.vr * dt; if (s.vy > 0 && s.y > api.h + 30) { sh.splice(i, 1); errs++; if (errs >= MAXE) { st = 'lose'; return; } } }
      },
      draw: function () {
        var W = api.w, H = api.h, i;
        bg('#241c2e', '#0c0910');
        g.fillStyle = 'rgba(255,200,120,.05)'; g.beginPath(); g.arc(W / 2, H * 0.4, Math.min(W, H) * 0.5, 0, 6.29); g.fill();
        for (i = 0; i < hv.length; i++) { var h = hv[i]; g.globalAlpha = Math.max(0, h.l / 0.8); g.fillStyle = '#a8a8b8'; g.beginPath(); g.arc(h.x, h.y, h.r * 0.7, h.s < 0 ? 1.6 : -1.6, h.s < 0 ? 4.7 : 1.6); g.fill(); g.globalAlpha = 1; }
        for (i = 0; i < sh.length; i++) { var s = sh[i]; g.save(); g.translate(s.x, s.y); g.rotate(s.rot); g.fillStyle = '#9a9aac'; g.beginPath(); for (var k = 0; k < 7; k++) { var a = k * 0.898, r = s.r * (0.78 + 0.22 * Math.sin(k * 2.3 + i)); g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.closePath(); g.fill(); g.strokeStyle = '#d8d8e8'; g.lineWidth = 2; g.stroke(); g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(-s.r * 0.3, -s.r * 0.3, s.r * 0.35, s.r * 0.2); g.restore(); }
        if (st === 'play') { g.strokeStyle = pr ? '#ffd88a' : 'rgba(255,255,255,.5)'; g.lineWidth = 2; g.beginPath(); g.arc(cx, cy, 14, 0, 6.29); g.moveTo(cx - 22, cy); g.lineTo(cx + 22, cy); g.stroke(); }
        hud(T.h1 + ' ' + hits + '/' + NEED, T.h2 + ' ' + errs + '/' + MAXE, errs > 0);
        fim(st);
      }
    };
  }
});
