/* A trilha de Stállo — avance enquanto o gigante olha para o outro lado. */
BTJogo.registrar({
  canvas: 'jogo-stallo',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A trilha de Stállo",
    "sub": "Segure o dedo (ou a barra de espaço) para avançar pela trilha. Quando os olhos de Stállo brilham, ele vai olhar para trás: solte! Se ele o vir andando, você volta um trecho e conta um erro. No terceiro erro o jogo acaba. Chegue ao fim da trilha antes que o tempo acabe.",
    "perdeu": "Stállo o pegou na trilha",
    "v1": "Você passou sem ser visto!",
    "v2": "Stállo é um gigante dos contos sámi. A trilha e o olhar do gigante são invenção do jogo.",
    "h1": "Trilha",
    "h2": "Vistas",
    "dica": "segure para avançar, solte quando os olhos brilharem"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Stállo's trail",
    "sub": "Hold your finger (or the space bar) to move along the trail. When the eyes of Stállo glow, he is about to look back: let go! If he sees you moving, you go back a stretch and count a mistake. The third mistake ends the game. Reach the end of the trail before time runs out.",
    "perdeu": "Stállo caught you on the trail",
    "v1": "You slipped by unseen!",
    "v2": "Stállo is a giant of Sámi tales. The trail and the giant’s gaze are made up for the game.",
    "h1": "Trail",
    "h2": "Spotted",
    "dica": "hold to move, let go when the eyes glow"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Stállos sti",
    "sub": "Hold fingeren (eller mellomromstasten) for å gå langs stien. Når øynene til Stállo lyser, skal han se seg tilbake: slipp! Ser han deg gå, må du tilbake et stykke og får en feil. Ved den tredje feilen er spillet over. Kom til enden av stien før tiden er ute.",
    "perdeu": "Stállo tok deg på stien",
    "v1": "Du slapp forbi usett!",
    "v2": "Stállo er en jotun i samiske eventyr. Stien og blikket til jotunen er diktet opp for spillet.",
    "h1": "Sti",
    "h2": "Sett",
    "dica": "hold for å gå, slipp når øynene lyser"
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
    var NEED = 100, LIM = 80, MAXS = 3, SPD = 11;
    var prog = 0, spot = 0, tmr = LIM, ph = 'away', pt = 0, hold = false, key = false, back = 0, shake = 0;
    function newAway() { ph = 'away'; pt = 1.6 + Math.random() * 1.8; }
    function setup() { prog = 0; spot = 0; tmr = LIM; hold = false; key = false; back = 0; shake = 0; newAway(); }
    function reset() { setup(); st = 'play'; }
    function moving() { return hold || key; }
    setup();
    return {
      pausar: function () { hold = false; key = false; },
      dbg: function () { return { st: st, prog: prog, spot: spot, ph: ph, pt: pt, tmr: tmr, moving: moving() }; },
      down: function (x, y) { if (menu()) return; hold = true; },
      up: function () { hold = false; },
      key: function (c, d) { if (c === 'Space' || c === 'ArrowRight' || c === 'ArrowUp' || c === 'KeyD' || c === 'KeyW') { if (st !== 'play') { if (d && c === 'Space') menu(); return; } key = d; } },
      update: function (dt) {
        if (shake > 0) shake -= dt; if (st !== 'play') return;
        tmr -= dt; if (tmr <= 0) { st = 'lose'; return; }
        pt -= dt; if (pt <= 0) { if (ph === 'away') { ph = 'warn'; pt = Math.max(0.45, 0.6 - prog * 0.0015); } else if (ph === 'warn') { ph = 'look'; pt = 1.1 + Math.random() * 0.8; } else newAway(); }
        if (moving()) {
          if (ph === 'look') { spot++; shake = 0.5; prog = Math.max(0, prog - 30); if (api.nota) api.nota(100, 0.25, 'sawtooth', 0.07); if (spot >= MAXS) { st = 'lose'; return; } newAway(); pt += 1.0; hold = false; key = false; }
          else { prog += SPD * dt; if (prog >= NEED) st = 'win'; }
        }
      },
      draw: function () {
        var W = api.w, H = api.h, x0 = 40, x1 = W - 40, ty = H * 0.72, k = Math.min(1, W / 800 + 0.3), i;
        bg('#1f2a3a', '#0b1018'); g.fillStyle = 'rgba(255,255,255,.04)'; for (i = 0; i < 30; i++) g.fillRect((i * 97) % W, (i * 53) % (H * 0.5), 2, 2);
        g.fillStyle = '#1a2a1a'; g.fillRect(0, H * 0.62, W, H * 0.38); g.strokeStyle = '#6a644a'; g.lineWidth = 6; g.beginPath(); g.moveTo(x0, ty); g.lineTo(x1 - 60, ty); g.stroke();
        var gx = x1 - 20, gy = ty - 40 * k, look = ph === 'look', warn = ph === 'warn', sc = Math.max(0.7, Math.min(1.4, H / 450)), sx = (Math.random() - 0.5) * (shake > 0 ? 6 : 0);
        g.fillStyle = '#2a2a34'; g.beginPath(); g.ellipse(gx + sx, gy - 60 * sc, 56 * sc, 94 * sc, 0, 0, 6.29); g.fill(); g.beginPath(); g.arc(gx + sx, gy - 190 * sc, 34 * sc, 0, 6.29); g.fill();
        if (look || warn) { g.fillStyle = look ? '#ff5a3a' : '#ffb04a'; g.beginPath(); g.arc(gx + sx - 14 * sc, gy - 194 * sc, 6 * sc, 0, 6.29); g.arc(gx + sx - 2 * sc, gy - 194 * sc, 6 * sc, 0, 6.29); g.fill(); if (look) { g.fillStyle = 'rgba(255,90,58,.12)'; g.beginPath(); g.moveTo(gx - 10, gy - 194 * sc); g.lineTo(x0, ty + 40); g.lineTo(x0, ty - 120); g.closePath(); g.fill(); } }
        var hx = x0 + (x1 - 60 - x0) * Math.min(1, prog / NEED); g.fillStyle = moving() && !look ? '#ffd88a' : '#c9a23a'; g.beginPath(); g.arc(hx, ty - 14, 11, 0, 6.29); g.fill(); g.fillRect(hx - 6, ty - 3, 12, 14);
        txt(look ? '👁' : warn ? '!' : '', W / 2, H * 0.4, 70, look ? 'rgba(255,90,58,.8)' : 'rgba(255,176,74,.9)');
        txt(T.dica, W / 2, H - 28, 14, 'rgba(255,255,255,.5)'); bar(W / 2 - 110, H - 12, 220, 5, tmr / LIM, tmr < 15 ? '#c0392b' : '#8aa8c0');
        hud(T.h1 + ' ' + Math.floor(prog) + '/' + NEED, T.h2 + ' ' + spot + '/' + MAXS, spot > 0);
        fim(st);
      }
    };
  }
});
