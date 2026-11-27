/* Louhi, a senhora de Pohjola — cruze o campo gelado. */
BTJogo.registrar({
  canvas: 'jogo-louhi',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O campo gelado de Pohjola",
    "sub": "Toque acima, abaixo ou ao lado da sua figura para dar um passo (ou use as setas). Atravesse as 6 faixas de rajadas de frio e chegue ao outro lado 3 vezes. Cada rajada que o atinge custa uma de 3 vidas.",
    "perdeu": "As vidas ou o tempo acabaram",
    "v1": "Você atravessou três vezes!",
    "v2": "No Kalevala, Louhi é a senhora de Pohjola, terra do frio e da noite. O campo de rajadas é invenção.",
    "h1": "Travessias",
    "h2": "Vidas"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Pohjola's frozen field",
    "sub": "Tap above, below or beside your figure to take a step (or use the arrow keys). Cross the 6 lanes of cold gusts and reach the far side 3 times. Each gust that hits you costs one of 3 lives.",
    "perdeu": "The lives or the time ran out",
    "v1": "You crossed three times!",
    "v2": "In the Kalevala, Louhi is the mistress of Pohjola, land of cold and night. The field of gusts is made up.",
    "h1": "Crossings",
    "h2": "Lives"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Det frosne feltet i Pohjola",
    "sub": "Trykk over, under eller ved siden av figuren din for å ta et steg (eller bruk piltastene). Kryss de 6 banene med kuldebyger og nå den andre siden 3 ganger. Hver byge som treffer deg koster ett av 3 liv.",
    "perdeu": "Livene eller tiden var brukt opp",
    "v1": "Du krysset tre ganger!",
    "v2": "I Kalevala er Louhi herskerinnen i Pohjola, kuldens og nattens land. Bygefeltet er diktet opp.",
    "h1": "Kryssinger",
    "h2": "Liv"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "El campo helado de Pohjola",
    "sub": "Toca encima, debajo o al lado de tu figura para dar un paso (o usa las flechas). Atraviesa las 6 franjas de ráfagas de frío y llega al otro lado 3 veces. Cada ráfaga que te alcanza cuesta una de 3 vidas.",
    "perdeu": "Se acabaron las vidas o el tiempo",
    "v1": "¡Cruzaste tres veces!",
    "v2": "En el Kalevala, Louhi es la señora de Pohjola, tierra del frío y de la noche. El campo de ráfagas es invención.",
    "h1": "Cruces",
    "h2": "Vidas"
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
    var COLS = 9, ROWS = 8, LIM = 130, GOAL = 3;
    var px = 4, py = 7, lives = 3, cross = 0, tmr = LIM, gusts = [], hurt = 0, pop = 0;
    function lay() { var W = api.w, H = api.h, cs = Math.max(30, Math.min((W - 16) / COLS, (H - 130) / ROWS, 56)); return { cs: cs, x: (W - cs * COLS) / 2, y: Math.max(76, (H - cs * ROWS) / 2 + 24) }; }
    function setup() { gusts = []; for (var r = 1; r <= 6; r++) { var dir = r % 2 ? 1 : -1, sp = (0.9 + Math.random() * 0.7 + r * 0.06) * dir, k = 2; for (var i = 0; i < k; i++) gusts.push({ r: r, x: (COLS / k) * i + Math.random() * 1.2, w: 1.3 + Math.random() * 0.6, v: sp }); } px = 4; py = 7; lives = 3; cross = 0; tmr = LIM; hurt = 0; }
    function reset() { setup(); st = 'play'; }
    function hitq() { for (var i = 0; i < gusts.length; i++) { var q = gusts[i]; if (q.r !== py) continue; var a = q.x, b = q.x + q.w; for (var s = -1; s <= 1; s++) { if (px + 0.15 < b + s * COLS && px + 0.85 > a + s * COLS) return true; } } return false; }
    function step_(dx, dy) { if (st !== 'play') return; var nx = px + dx, ny = py + dy; if (nx < 0 || nx >= COLS || ny > 7) return; px = nx; py = ny; if (api.nota) api.nota(380, 0.03, 'triangle', 0.03); if (py === 0) { cross++; if (api.nota) api.nota(700, 0.15, 'triangle', 0.06); if (cross >= GOAL) { st = 'win'; return; } px = 4; py = 7; } }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, px: px, py: py, lives: lives, cross: cross, goal: GOAL, cols: COLS, tmr: tmr, hurt: hurt, gusts: gusts.map(function (q) { return { r: q.r, x: q.x, w: q.w, v: q.v }; }), pos: function (dx, dy) { return { x: L.x + (px + dx + 0.5) * L.cs, y: L.y + (py + dy + 0.5) * L.cs }; } }; },
      down: function (x, y) { if (menu()) return; var L = lay(), cx = L.x + (px + 0.5) * L.cs, cy = L.y + (py + 0.5) * L.cs, dx = x - cx, dy = y - cy; if (Math.abs(dy) >= Math.abs(dx)) step_(0, dy < 0 ? -1 : 1); else step_(dx < 0 ? -1 : 1, 0); },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'ArrowUp' || k === 'KeyW') step_(0, -1); else if (k === 'ArrowDown' || k === 'KeyS') step_(0, 1); else if (k === 'ArrowLeft' || k === 'KeyA') step_(-1, 0); else if (k === 'ArrowRight' || k === 'KeyD') step_(1, 0); },
      update: function (dt) { pop += dt; if (hurt > 0) hurt -= dt; if (st !== 'play') return; tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; return; } gusts.forEach(function (q) { q.x += q.v * dt; if (q.v > 0 && q.x > COLS) q.x -= COLS; if (q.v < 0 && q.x + q.w < 0) q.x += COLS; }); if (hurt <= 0 && hitq()) { lives--; hurt = 1; if (api.nota) api.nota(110, 0.25, 'sawtooth', 0.07); if (lives <= 0) { st = 'lose'; return; } px = 4; py = 7; } },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), r;
        bg('#16243a', '#060a14');
        for (r = 0; r < ROWS; r++) { g.fillStyle = r === 0 || r === 7 ? 'rgba(255,255,255,.16)' : (r % 2 ? 'rgba(150,200,255,.07)' : 'rgba(150,200,255,.12)'); g.fillRect(L.x, L.y + r * L.cs, L.cs * COLS, L.cs - 2); }
        txt('☆', L.x + L.cs * COLS / 2, L.y + L.cs * 0.72, L.cs * 0.5, '#ffd88a');
        g.save(); g.beginPath(); g.rect(L.x, L.y, L.cs * COLS, L.cs * ROWS); g.clip();
        gusts.forEach(function (q) { for (var s = -1; s <= 1; s++) { var x = L.x + (q.x + s * COLS) * L.cs; g.fillStyle = 'rgba(190,230,255,.85)'; rr(x, L.y + q.r * L.cs + 6, q.w * L.cs, L.cs - 14, 10); g.fill(); g.fillStyle = 'rgba(255,255,255,.7)'; g.fillRect(x + 8, L.y + q.r * L.cs + L.cs * 0.42, q.w * L.cs - 16, 3); } });
        g.restore();
        var cx = L.x + (px + 0.5) * L.cs, cy = L.y + (py + 0.5) * L.cs; g.fillStyle = hurt > 0 && Math.floor(hurt * 12) % 2 ? 'rgba(255,255,255,.3)' : '#ffd88a'; g.beginPath(); g.arc(cx, cy - L.cs * 0.12, L.cs * 0.2, 0, 6.283); g.fill(); g.fillRect(cx - L.cs * 0.13, cy, L.cs * 0.26, L.cs * 0.3);
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 25 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + cross + '/' + GOAL, T.h2 + ' ' + lives, lives <= 1);
        fim(st);
      }
    };
  }
});
