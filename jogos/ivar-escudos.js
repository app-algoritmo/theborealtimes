/* A muralha de escudos — rebata a bola e derrube os escudos. */
BTJogo.registrar({
  canvas: 'jogo-ivar',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A muralha de escudos",
    "sub": "Ivar quer romper a muralha de escudos. Mova o machado (arraste, ou use as setas) para rebater a bola e derrubar todos os escudos. Se a bola cair três vezes, a muralha vence. A bola parte sozinha depois de dois segundos.",
    "perdeu": "A muralha resistiu",
    "v1": "A muralha caiu!",
    "v2": "Ivar, o Sem-Ossos, foi um dos chefes do Grande Exército pagão que invadiu a Inglaterra, por volta de 865. A muralha do jogo é invenção.",
    "h1": "Escudos",
    "h2": "Quedas"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The shield wall",
    "sub": "Ivar wants to break the shield wall. Move the axe (drag, or use the arrows) to bounce the ball and knock down every shield. If the ball falls three times, the wall wins. The ball launches by itself after two seconds.",
    "perdeu": "The wall held",
    "v1": "The wall fell!",
    "v2": "Ivar the Boneless was one of the leaders of the Great Heathen Army that invaded England around 865. The wall in the game is made up.",
    "h1": "Shields",
    "h2": "Drops"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Skjoldmuren",
    "sub": "Ivar vil bryte skjoldmuren. Flytt øksen (dra, eller bruk piltastene) for å sprette ballen og slå ned alle skjoldene. Faller ballen tre ganger, vinner muren. Ballen skytes ut av seg selv etter to sekunder.",
    "perdeu": "Muren holdt",
    "v1": "Muren falt!",
    "v2": "Ivar Beinløs var en av lederne for den store hedenske hæren som invaderte England omkring 865. Muren i spillet er diktet opp.",
    "h1": "Skjold",
    "h2": "Tapte"
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
    var COLS = 8, ROWS = 4, MAXE = 3, TOT = COLS * ROWS, PC = ['#b3261e', '#c9a23a', '#3a6aa8', '#4a8a5a'];
    var br = [], broken = 0, errs = 0, px = 225, pw = 96, bx = 0, by = 0, vx = 0, vy = 0, stuck = true, stT = 0, kx = 0, sp = 250;
    function lay() { var W = api.w, H = api.h, bw = (W - 40) / COLS; return { bw: bw, bh: 22, l: 20, t: 84, py: H - 46, ph: 12 }; }
    function setup() { br = []; for (var r = 0; r < ROWS; r++) for (var c = 0; c < COLS; c++) br.push({ c: c, r: r, a: true }); broken = 0; errs = 0; px = api.w / 2; pw = Math.max(80, Math.min(112, api.w * 0.2)); stuck = true; stT = 0; sp = 250; }
    function reset() { setup(); st = 'play'; }
    function launch() { if (!stuck) return; stuck = false; var a = (Math.random() - 0.5) * 0.8; vx = sp * Math.sin(a); vy = -sp * Math.cos(a); }
    function norm() { var m = Math.hypot(vx, vy) || 1; sp = 250 + Math.min(120, broken * 4.5); vx = vx / m * sp; vy = vy / m * sp; if (Math.abs(vy) < sp * 0.32) { vy = (vy < 0 ? -1 : 1) * sp * 0.32; m = Math.hypot(vx, vy); vx = vx / m * sp; vy = vy / m * sp; } }
    setup();
    return {
      pausar: function () { kx = 0; },
      dbg: function () { return { st: st, bx: bx, by: by, vx: vx, vy: vy, px: px, pw: pw, broken: broken, errs: errs, stuck: stuck }; },
      down: function (x, y) { if (menu()) return; px = x; launch(); },
      move: function (x, y) { if (st === 'play') px = Math.max(pw / 2, Math.min(api.w - pw / 2, x)); },
      key: function (c, d) {
        if (c === 'ArrowLeft' || c === 'KeyA') kx = d ? -1 : (kx === -1 ? 0 : kx); else if (c === 'ArrowRight' || c === 'KeyD') kx = d ? 1 : (kx === 1 ? 0 : kx);
        else if ((c === 'Space' || c === 'Enter' || c === 'ArrowUp') && d) { if (st !== 'play') menu(); else launch(); }
      },
      update: function (dt) {
        if (st !== 'play') return; var L = lay(), W = api.w, H = api.h;
        px = Math.max(pw / 2, Math.min(W - pw / 2, px + kx * 420 * dt));
        if (stuck) { bx = px; by = L.py - 10; stT += dt; if (stT > 2) launch(); return; }
        var n = Math.max(1, Math.ceil(sp * dt / 4)), s, i, dd = dt / n;
        for (s = 0; s < n; s++) {
          bx += vx * dd; by += vy * dd;
          if (bx < 8) { bx = 8; vx = Math.abs(vx); norm(); } else if (bx > W - 8) { bx = W - 8; vx = -Math.abs(vx); norm(); }
          if (by < 8) { by = 8; vy = Math.abs(vy); norm(); }
          if (vy > 0 && by + 8 >= L.py && by + 8 <= L.py + L.ph + 12 && bx >= px - pw / 2 - 6 && bx <= px + pw / 2 + 6) { by = L.py - 8; var a = (bx - px) / (pw / 2) * 1.05 + (Math.random() - 0.5) * 0.3; if (Math.abs(a) < 0.14) a = (Math.random() < 0.5 ? -1 : 1) * (0.14 + Math.random() * 0.2); a = Math.max(-1.05, Math.min(1.05, a)); vx = sp * Math.sin(a); vy = -sp * Math.cos(a); }
          for (i = 0; i < br.length; i++) {
            var b = br[i]; if (!b.a) continue; var x = L.l + b.c * L.bw, y = L.t + b.r * (L.bh + 4), cx = Math.max(x, Math.min(x + L.bw - 3, bx)), cy = Math.max(y, Math.min(y + L.bh, by));
            if ((bx - cx) * (bx - cx) + (by - cy) * (by - cy) < 64) {
              b.a = false; broken++; if (Math.abs(bx - (x + L.bw / 2)) / L.bw > Math.abs(by - (y + L.bh / 2)) / L.bh) vx = (bx < x + L.bw / 2 ? -1 : 1) * Math.abs(vx); else vy = (by < y + L.bh / 2 ? -1 : 1) * Math.abs(vy);
              norm(); if (api.nota) api.nota(300 + b.r * 70, 0.08, 'square', 0.03); break;
            }
          }
          if (broken >= TOT) { st = 'win'; return; }
          if (by > H + 10) { errs++; if (errs >= MAXE) { st = 'lose'; return; } stuck = true; stT = 0; return; }
        }
      },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), i;
        bg('#1b2230', '#0b0e14');
        for (i = 0; i < br.length; i++) { var b = br[i]; if (!b.a) continue; var x = L.l + b.c * L.bw, y = L.t + b.r * (L.bh + 4); g.fillStyle = PC[b.r]; rr(x + 1, y, L.bw - 4, L.bh, 5); g.fill(); g.fillStyle = 'rgba(255,255,255,.55)'; g.beginPath(); g.arc(x + L.bw / 2 - 1, y + L.bh / 2, 4, 0, 6.29); g.fill(); }
        g.fillStyle = '#8a8f9a'; g.fillRect(px - pw / 2, L.py, pw, L.ph); g.fillStyle = '#6b4a2a'; g.fillRect(px - pw / 2 + 4, L.py + 4, pw - 8, L.ph - 4); g.fillStyle = '#c9ced8'; g.beginPath(); g.moveTo(px - 12, L.py); g.lineTo(px, L.py - 12); g.lineTo(px + 12, L.py); g.fill();
        g.fillStyle = '#f3ecd2'; g.beginPath(); g.arc(bx, by, 8, 0, 6.29); g.fill();
        if (stuck && st === 'play') txt('▲', px, L.py - 24, 16, 'rgba(255,255,255,.4)');
        hud(T.h1 + ' ' + broken + '/' + TOT, T.h2 + ' ' + errs + '/' + MAXE, errs > 0);
        fim(st);
      }
    };
  }
});
