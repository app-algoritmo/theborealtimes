/* Os navios de Magnus — conte os navios que surgem e somem no mar. */
BTJogo.registrar({
  canvas: 'jogo-magnus',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os navios de Magnus",
    "sub": "Navios surgem e somem no mar, um de cada vez. Conte só os navios, sem as pedras, e depois toque no número certo (ou use as teclas 1 a 4). São seis contagens, com no máximo dois erros.",
    "perdeu": "A conta não fechou",
    "v1": "Contagem certa!",
    "v2": "Magnus Erlendsson é morto na ilha de Egilsay, por volta de 1117, e depois é lembrado como santo. As contagens são invenção do jogo.",
    "h1": "Contagens",
    "h2": "Erros",
    "conte": "Conte só os navios",
    "quanto": "Quantos navios?"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Magnus's ships",
    "sub": "Ships appear and vanish at sea, one at a time. Count only the ships, not the rocks, then tap the right number (or use keys 1 to 4). Six counts, with at most two mistakes.",
    "perdeu": "The count didn't add up",
    "v1": "Right count!",
    "v2": "Magnus Erlendsson was killed on the island of Egilsay, around 1117, and later remembered as a saint. The counting is made up for the game.",
    "h1": "Counts",
    "h2": "Mistakes",
    "conte": "Count only the ships",
    "quanto": "How many ships?"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Magnus’ skip",
    "sub": "Skip dukker opp og forsvinner på havet, ett om gangen. Tell bare skipene, ikke skjærene, og trykk så på riktig tall (eller bruk tastene 1 til 4). Seks tellinger, med høyst to feil.",
    "perdeu": "Regnestykket gikk ikke opp",
    "v1": "Rett telling!",
    "v2": "Magnus Erlendsson ble drept på øya Egilsay, omkring 1117, og senere husket som helgen. Tellingene er diktet opp for spillet.",
    "h1": "Tellinger",
    "h2": "Feil",
    "conte": "Tell bare skipene",
    "quanto": "Hvor mange skip?"
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
    var TOT = 6, MAXE = 2;
    var hits = 0, errs = 0, tr = 0, ph = 'ready', pt = 0, seq = [], n = 0, ch = [], res = 0, lastOk = true, cur = 0;
    function btns() { var W = api.w, H = api.h, o = [], s = Math.min(78, (W - 50) / 4), g2 = s + 12, x0 = W / 2 - g2 * 1.5; for (var i = 0; i < 4; i++) o.push({ x: x0 + i * g2, y: H * 0.86, r: s / 2, v: ch[i] }); return o; }
    function vis() { return Math.max(0.24, 0.46 - 0.035 * tr); }
    function gap() { return Math.max(0.14, 0.26 - 0.02 * tr); }
    function newTrial() {
      n = 3 + tr; seq = []; var k, rocks = tr >= 2 ? Math.min(3, tr - 1) : 0, tot = n + rocks, kinds = [];
      for (k = 0; k < n; k++) kinds.push(0); for (k = 0; k < rocks; k++) kinds.push(1);
      for (k = kinds.length - 1; k > 0; k--) { var j = Math.floor(Math.random() * (k + 1)), q = kinds[k]; kinds[k] = kinds[j]; kinds[j] = q; }
      var lx = -1, ly = -1; for (k = 0; k < tot; k++) { var fx, fy, tries = 0; do { fx = 0.12 + Math.random() * 0.76; fy = 0.18 + Math.random() * 0.46; tries++; } while (tries < 20 && Math.hypot(fx - lx, fy - ly) < 0.25); lx = fx; ly = fy; seq.push({ fx: fx, fy: fy, rock: kinds[k] }); }
      var c = [n], d = 1; while (c.length < 4) { var v = n + (Math.random() < 0.5 ? -d : d); if (v >= 1 && c.indexOf(v) < 0) c.push(v); else if (Math.random() < 0.5) d++; if (d > 6) d = 1; }
      for (k = 3; k > 0; k--) { var j2 = Math.floor(Math.random() * (k + 1)), q2 = c[k]; c[k] = c[j2]; c[j2] = q2; } ch = c; ph = 'ready'; pt = 0; cur = 0;
    }
    function setup() { hits = 0; errs = 0; tr = 0; newTrial(); }
    function reset() { setup(); st = 'play'; }
    function choose(i) { if (st !== 'play' || ph !== 'pick' || i < 0 || i > 3) return; lastOk = ch[i] === n; if (lastOk) hits++; else errs++; tr++; ph = 'res'; pt = 0; }
    setup();
    return {
      pausar: function () {},
      dbg: function () { return { st: st, ph: ph, n: n, ch: ch.slice(), b: btns(), hits: hits, errs: errs, tr: tr }; },
      down: function (x, y) { if (menu()) return; if (ph !== 'pick') return; var b = btns(); for (var i = 0; i < 4; i++) if (Math.hypot(x - b[i].x, y - b[i].y) < b[i].r + 8) { choose(i); return; } },
      key: function (c, d) {
        if (!d) return; var m = /^(Digit|Numpad)([1-4])$/.exec(c); if (m) { choose(+m[2] - 1); return; }
        if (c === 'ArrowLeft' || c === 'KeyA') cur = Math.max(0, cur - 1); else if (c === 'ArrowRight' || c === 'KeyD') cur = Math.min(3, cur + 1); else if (c === 'Space' || c === 'Enter') { if (st !== 'play') menu(); else choose(cur); }
      },
      update: function (dt) {
        if (st !== 'play') return; pt += dt;
        if (ph === 'ready') { if (pt > 1.5) { ph = 'show'; pt = 0; } }
        else if (ph === 'show') { if (pt > seq.length * (vis() + gap()) + 0.2) { ph = 'pick'; pt = 0; } }
        else if (ph === 'pick') { if (pt > 12) { errs++; tr++; lastOk = false; ph = 'res'; pt = 0; } }
        else if (ph === 'res') { if (pt > 1.2) { if (errs > MAXE) st = 'lose'; else if (tr >= TOT) st = 'win'; else newTrial(); } }
      },
      draw: function () {
        var W = api.w, H = api.h, t = api.clock, i;
        bg('#0f2a3d', '#071722');
        g.fillStyle = 'rgba(255,255,255,.06)'; for (i = 0; i < 9; i++) { var wy = H * (0.2 + i * 0.075); g.beginPath(); for (var x = 0; x <= W; x += 20) g.lineTo(x, wy + Math.sin(x * 0.03 + t * 1.5 + i) * 4); g.lineTo(W, wy + 8); g.lineTo(0, wy + 8); g.fill(); }
        if (ph === 'show') {
          var per = vis() + gap(), k = Math.floor(pt / per), w = pt - k * per;
          if (k < seq.length && w < vis()) {
            var s = seq[k], x2 = s.fx * W, y2 = s.fy * H;
            if (s.rock) { g.fillStyle = '#6b6e78'; g.beginPath(); g.moveTo(x2 - 24, y2 + 14); g.lineTo(x2 - 12, y2 - 14); g.lineTo(x2 + 6, y2 - 20); g.lineTo(x2 + 26, y2 + 14); g.fill(); g.fillStyle = '#8a8d98'; g.fillRect(x2 - 8, y2 - 10, 12, 6); }
            else { g.fillStyle = '#7a5230'; g.beginPath(); g.moveTo(x2 - 34, y2); g.quadraticCurveTo(x2, y2 + 24, x2 + 34, y2); g.lineTo(x2 + 26, y2 - 6); g.lineTo(x2 - 26, y2 - 6); g.fill(); g.fillStyle = '#e8e0cc'; g.fillRect(x2 - 1, y2 - 38, 3, 34); g.beginPath(); g.moveTo(x2 + 2, y2 - 38); g.lineTo(x2 + 24, y2 - 18); g.lineTo(x2 + 2, y2 - 12); g.fill(); g.fillStyle = '#b3261e'; g.fillRect(x2 + 4, y2 - 30, 12, 6); }
          }
        }
        var msg = ph === 'ready' ? T.conte : ph === 'pick' ? T.quanto : ''; if (msg) txt(msg, W / 2, H * 0.4, 20, '#f3ecd2');
        if (ph === 'pick' || ph === 'res') {
          var b = btns();
          for (i = 0; i < 4; i++) {
            var good = ph === 'res' && b[i].v === n; g.fillStyle = good ? '#2f7a4a' : (i === cur && ph === 'pick' ? '#3d6a8a' : '#24425a'); g.beginPath(); g.arc(b[i].x, b[i].y, b[i].r, 0, 6.29); g.fill();
            g.strokeStyle = good ? '#9dffb6' : '#8ab6d6'; g.lineWidth = 3; g.stroke(); txt(String(b[i].v), b[i].x, b[i].y + 9, 26, '#fff');
          }
          if (ph === 'res') txt(lastOk ? '✓' : '✗', W / 2, H * 0.5, 70, lastOk ? '#9dffb6' : '#ff8a7a');
        }
        hud(T.h1 + ' ' + hits + '/' + TOT, T.h2 + ' ' + errs + '/' + (MAXE + 1), errs > 0);
        fim(st);
      }
    };
  }
});
