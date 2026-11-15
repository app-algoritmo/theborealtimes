/* Os muros de Jomsborg — derrube os muros tijolo a tijolo. */
BTJogo.registrar({
  canvas: 'jogo-jomsvikings',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os muros de Jomsborg",
    "sub": "Arraste o dedo (ou use as setas) para mover o escudo e rebater a bola contra os muros da fortaleza. Derrube todos os blocos. Se a bola cair três vezes, o jogo acaba. O tempo é limitado.",
    "perdeu": "A fortaleza resistiu",
    "v1": "Os muros vieram abaixo!",
    "v2": "Na saga, os jomsvikings guardavam uma fortaleza no Báltico, cuja localização exata é debatida. Os blocos do jogo são invenção.",
    "h1": "Blocos",
    "h2": "Bolas"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The walls of Jomsborg",
    "sub": "Drag a finger (or use the arrows) to move the shield and bat the ball against the fortress walls. Knock down every block. If the ball falls three times, the game ends. Time is limited.",
    "perdeu": "The fortress held",
    "v1": "The walls came down!",
    "v2": "In the saga, the Jomsvikings held a fortress on the Baltic whose exact location is debated. The blocks in the game are made up.",
    "h1": "Blocks",
    "h2": "Balls"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Murene i Jomsborg",
    "sub": "Dra en finger (eller bruk piltastene) for å flytte skjoldet og slå ballen mot festningens murer. Riv alle blokkene. Faller ballen tre ganger, er spillet over. Tiden er begrenset.",
    "perdeu": "Festningen holdt stand",
    "v1": "Murene falt!",
    "v2": "I sagaen holdt jomsvikingene en festning ved Østersjøen, der den nøyaktige plasseringen er omdiskutert. Blokkene i spillet er diktet opp.",
    "h1": "Blokker",
    "h2": "Baller"
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
    var COLS = 8, ROWS = 5, MAXL = 3, LIM = 200, PW = 84, BR = 7;
    var br = [], px = 0, tx = 0, ball = null, lost = 0, tmr = LIM, held = {}, drag = false, serve = 0, left = 0, pop = 0, sp = 300;
    function lay() { var W = api.w, H = api.h, bw = (W - 40) / COLS; return { bw: bw, bh: Math.min(24, (H - 220) / ROWS), x: 20, y: 76 }; }
    function setup() { var i; br = []; for (i = 0; i < COLS * ROWS; i++) br.push(i < COLS * 2 ? 2 : 1); left = br.length; lost = 0; tmr = LIM; px = tx = api.w / 2; held = {}; drag = false; sp = 300; ball = null; serve = 0.8; }
    function reset() { setup(); st = 'play'; }
    function launch() { var a = (Math.random() - 0.5) * 0.9; ball = { x: px, y: api.h - 64, vx: sp * Math.sin(a), vy: -sp * Math.cos(a) }; }
    function step(dt) {
      var L = lay(), W = api.w, H = api.h, Y = H - 50;
      ball.x += ball.vx * dt; ball.y += ball.vy * dt;
      if (ball.x < BR) { ball.x = BR; ball.vx = Math.abs(ball.vx); } if (ball.x > W - BR) { ball.x = W - BR; ball.vx = -Math.abs(ball.vx); } if (ball.y < BR + 56) { ball.y = BR + 56; ball.vy = Math.abs(ball.vy); }
      if (ball.vy > 0 && ball.y >= Y - BR && ball.y <= Y + 10 && Math.abs(ball.x - px) < PW / 2 + BR) { var o = (ball.x - px) / (PW / 2), a = o * 1.0, s = Math.min(480, Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy) * 1.02); ball.vx = s * Math.sin(a); ball.vy = -s * Math.cos(a); ball.y = Y - BR; if (api.nota) api.nota(300, 0.04, 'square', 0.05); }
      var c = Math.floor((ball.x - L.x) / L.bw), r = Math.floor((ball.y - L.y) / L.bh);
      if (r >= 0 && r < ROWS && c >= 0 && c < COLS && br[r * COLS + c] > 0) {
        br[r * COLS + c]--; if (br[r * COLS + c] === 0) { left--; if (api.nota) api.nota(520, 0.06, 'triangle', 0.05); }
        var cx = L.x + (c + 0.5) * L.bw, cy = L.y + (r + 0.5) * L.bh, dx = (ball.x - cx) / L.bw, dy = (ball.y - cy) / L.bh;
        if (Math.abs(dx) > Math.abs(dy)) ball.vx = dx > 0 ? Math.abs(ball.vx) : -Math.abs(ball.vx); else ball.vy = dy > 0 ? Math.abs(ball.vy) : -Math.abs(ball.vy);
        if (left <= 0) st = 'win';
      }
      if (ball.y > H + 10) { lost++; ball = null; serve = 0.8; if (lost >= MAXL) st = 'lose'; }
    }
    setup();
    return {
      pausar: function () { held = {}; drag = false; },
      dbg: function () { return { st: st, ball: ball ? { x: ball.x, y: ball.y, vx: ball.vx, vy: ball.vy } : null, px: px, left: left, lost: lost, W: api.w, H: api.h, PW: PW }; },
      down: function (x, y) { if (menu()) return; drag = true; tx = x; },
      move: function (x, y, pr) { if (drag && pr !== false) tx = x; },
      up: function () { drag = false; },
      key: function (c, d) { held[c] = d; if (d && st !== 'play') menu(); },
      update: function (dt) {
        pop += dt; if (st !== 'play') return; tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; return; }
        var k = (held.ArrowRight || held.KeyD ? 1 : 0) - (held.ArrowLeft || held.KeyA ? 1 : 0); if (k) tx = Math.max(PW / 2, Math.min(api.w - PW / 2, px + k * 200));
        var d = tx - px, m = 760 * dt; px += Math.abs(d) < m ? d : (d > 0 ? m : -m); px = Math.max(PW / 2, Math.min(api.w - PW / 2, px));
        if (!ball) { serve -= dt; if (serve <= 0) launch(); return; }
        for (var i = 0; i < 3 && ball && st === 'play'; i++) step(dt / 3);
      },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), r, c;
        bg('#1c2230', '#080b12');
        for (r = 0; r < ROWS; r++) for (c = 0; c < COLS; c++) { var v = br[r * COLS + c]; if (!v) continue; g.fillStyle = v === 2 ? '#8a6a4a' : (r % 2 ? '#a67c52' : '#b58a5a'); rr(L.x + c * L.bw + 1.5, L.y + r * L.bh + 1.5, L.bw - 3, L.bh - 3, 4); g.fill(); g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(L.x + c * L.bw + 4, L.y + (r + 1) * L.bh - 6, L.bw - 8, 3); }
        g.fillStyle = '#c9c9d9'; rr(px - PW / 2, H - 50, PW, 12, 6); g.fill(); g.fillStyle = '#8a93a8'; g.fillRect(px - PW / 2 + 6, H - 47, PW - 12, 3);
        if (ball) { g.fillStyle = '#ffd88a'; g.beginPath(); g.arc(ball.x, ball.y, BR, 0, 6.283); g.fill(); }
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 40 ? '#c0392b' : '#a67c52');
        hud(T.h1 + ' ' + (COLS * ROWS - left) + '/' + COLS * ROWS, T.h2 + ' ' + lost + '/' + MAXL, lost > 0);
        fim(st);
      }
    };
  }
});
