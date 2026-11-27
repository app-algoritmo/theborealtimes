/* Gylfaginning — derrube o salão que é só ilusão. */
BTJogo.registrar({
  canvas: 'jogo-gylfi',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O salão de Gylfi",
    "sub": "Mova a barra (arraste o dedo ou use ← →) para a bola não cair e derrube todos os tijolos do salão, que é uma ilusão dos deuses. Você tem 3 bolas.",
    "perdeu": "As bolas acabaram",
    "v1": "O salão se desfez!",
    "v2": "Na Gylfaginning, o palácio dos deuses desaparece diante do rei Gylfi. O jogo de derrubar tijolos é invenção.",
    "h1": "Derrubados",
    "h2": "Bolas"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Gylfi's hall",
    "sub": "Move the paddle (drag your finger or use ← →) so the ball does not fall and knock down all the bricks of the hall, which is an illusion of the gods. You have 3 balls.",
    "perdeu": "The balls ran out",
    "v1": "The hall dissolved!",
    "v2": "In the Gylfaginning, the palace of the gods vanishes before King Gylfi. The brick-breaking game is made up.",
    "h1": "Knocked down",
    "h2": "Balls"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Gylfes hall",
    "sub": "Flytt racketen (dra fingeren eller bruk ← →) slik at ballen ikke faller, og slå ned alle murstein i hallen, som er en illusjon fra gudene. Du har 3 baller.",
    "perdeu": "Ballene var brukt opp",
    "v1": "Hallen oppløste seg!",
    "v2": "I Gylfaginning forsvinner gudenes palass foran kong Gylfe. Spillet med å slå ned murstein er diktet opp.",
    "h1": "Nedslått",
    "h2": "Baller"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "El salón de Gylfi",
    "sub": "Mueve la barra (arrastra el dedo o usa ← →) para que la bola no caiga y derriba todos los ladrillos del salón, que es una ilusión de los dioses. Tienes 3 bolas.",
    "perdeu": "Se acabaron las bolas",
    "v1": "¡El salón se deshizo!",
    "v2": "En la Gylfaginning, el palacio de los dioses desaparece ante el rey Gylfi. El juego de derribar ladrillos es invención.",
    "h1": "Derribados",
    "h2": "Bolas"
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
    var ROWS = 4, COLS = 8, TOT = 32;
    var br = [], px = 0, tx = 0, bx = 0, by = 0, vx = 0, vy = 0, stuck = 0, lives = 3, kills = 0, pop = 0, KL = 0, KR = 0, flash = 0;
    function lay() { var W = api.w, H = api.h, s = Math.max(0.8, Math.min(1.6, Math.min(W, H) / 450)), cols = W >= H ? 8 : 6; var bw = (W - 24) / cols; return { W: W, H: H, s: s, cols: cols, bw: bw, bh: 20 * s, top: 96, pw: 92 * s, py: H - 44 * s, r: 7 * s }; }
    function build_() { var L = lay(); br = []; ROWS = L.cols === 8 ? 4 : 5; for (var r = 0; r < ROWS; r++) for (var c = 0; c < L.cols; c++) br.push({ r: r, c: c, a: true }); TOT = br.length; }
    function launch() { var L = lay(); bx = px; by = L.py - 14 * L.s; stuck = 0.8; var a = -1.57 + (Math.random() - 0.5) * 0.7, sp = 300 * L.s; vx = Math.cos(a) * sp; vy = Math.sin(a) * sp; }
    function setup() { var L = lay(); build_(); px = L.W / 2; tx = px; lives = 3; kills = 0; launch(); }
    function reset() { setup(); st = 'play'; }
    function bdbg() { return br.filter(function (b) { return b.a; }).length; }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, bx: bx, by: by, vx: vx, vy: vy, px: px, pw: L.pw, py: L.py, lives: lives, kills: kills, tot: TOT, stuck: stuck, W: L.W }; },
      down: function (x, y) { if (menu()) return; tx = x; },
      move: function (x, y, pr) { if (st === 'play') tx = x; },
      key: function (k, d) { if (k === 'ArrowLeft' || k === 'KeyA') KL = d ? 1 : 0; else if (k === 'ArrowRight' || k === 'KeyD') KR = d ? 1 : 0; else if (d && st !== 'play') menu(); },
      update: function (dt) {
        pop += dt; if (flash > 0) flash -= dt; if (st !== 'play') return; var L = lay();
        if (KL) tx = px - 200; if (KR) tx = px + 200; tx = Math.max(L.pw / 2 + 4, Math.min(L.W - L.pw / 2 - 4, tx)); var m = 640 * L.s * dt; if (Math.abs(tx - px) <= m) px = tx; else px += m * (tx > px ? 1 : -1);
        if (stuck > 0) { stuck -= dt; bx = px; by = L.py - 14 * L.s; return; }
        var k = 1 + kills * 0.012, n = 4;
        for (var s = 0; s < n && st === 'play'; s++) { var h = dt / n; bx += vx * k * h; by += vy * k * h;
          if (bx < L.r) { bx = L.r; vx = Math.abs(vx); } if (bx > L.W - L.r) { bx = L.W - L.r; vx = -Math.abs(vx); } if (by < 66 + L.r) { by = 66 + L.r; vy = Math.abs(vy); }
          if (vy > 0 && by + L.r >= L.py && by - L.r <= L.py + 10 * L.s && Math.abs(bx - px) < L.pw / 2 + L.r) { var q = (bx - px) / (L.pw / 2), sp = Math.hypot(vx, vy); var a = -1.57 + q * 1.0; vx = Math.cos(a) * sp; vy = Math.sin(a) * sp; by = L.py - L.r; if (api.nota) api.nota(260, 0.04, 'square', 0.03); }
          for (var i = 0; i < br.length; i++) { var b = br[i]; if (!b.a) continue; var x0 = 12 + b.c * L.bw, y0 = L.top + b.r * (L.bh + 4); if (bx + L.r > x0 && bx - L.r < x0 + L.bw - 3 && by + L.r > y0 && by - L.r < y0 + L.bh) { b.a = false; kills++; if (api.nota) api.nota(420 + b.r * 70, 0.05, 'triangle', 0.04); var ox = Math.min(bx + L.r - x0, x0 + L.bw - 3 - (bx - L.r)), oy = Math.min(by + L.r - y0, y0 + L.bh - (by - L.r)); if (ox < oy) vx = -vx; else vy = -vy; if (kills >= TOT) { st = 'win'; return; } break; } }
          if (by - L.r > L.H) { lives--; flash = 0.4; if (api.nota) api.nota(110, 0.25, 'sawtooth', 0.07); if (lives <= 0) { st = 'lose'; return; } launch(); return; } }
      },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), i;
        bg('#2a2030', '#0a060e');
        for (i = 0; i < br.length; i++) { var b = br[i]; if (!b.a) continue; g.fillStyle = ['#c0392b', '#d08a2a', '#c8b040', '#4a8ad0', '#9a6ab0'][b.r % 5]; rr(12 + b.c * L.bw + 1, L.top + b.r * (L.bh + 4), L.bw - 5, L.bh, 5); g.fill(); }
        g.fillStyle = flash > 0 ? '#c0392b' : '#ffd88a'; rr(px - L.pw / 2, L.py, L.pw, 10 * L.s, 5); g.fill();
        g.fillStyle = '#fff'; g.beginPath(); g.arc(bx, by, L.r, 0, 6.283); g.fill();
        hud(T.h1 + ' ' + kills + '/' + TOT, T.h2 + ' ' + lives, lives <= 1);
        fim(st);
      }
    };
  }
});
