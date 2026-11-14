/* O salão da montanha — desvie das pedras que caem até achar a saída. */
BTJogo.registrar({
  canvas: 'jogo-bergtatt',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O salão da montanha",
    "sub": "Você foi levado para dentro da montanha. Arraste o dedo para os lados (ou use as setas) para desviar das pedras que caem e atravesse o salão até a saída. Cada batida conta um dano. Na terceira batida, o jogo acaba.",
    "perdeu": "A montanha o prendeu",
    "v1": "Você achou a saída!",
    "v2": "Nas lendas norueguesas, quem é bergtatt, \"levado pela montanha\", pode voltar, mas muda. O salão e as pedras são invenção do jogo.",
    "h1": "Metros",
    "h2": "Batidas"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The mountain hall",
    "sub": "You were taken inside the mountain. Drag sideways (or use the arrows) to dodge the falling stones and cross the hall to the exit. Each hit counts as damage. The third hit ends the game.",
    "perdeu": "The mountain kept you",
    "v1": "You found the way out!",
    "v2": "In Norwegian legends, someone who is bergtatt, \"taken by the mountain\", may return, but changed. The hall and the stones are made up for the game.",
    "h1": "Metres",
    "h2": "Damage"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Fjellhallen",
    "sub": "Du ble tatt inn i fjellet. Dra sidelengs (eller bruk piltastene) for å unngå de fallende steinene og kom deg gjennom hallen til utgangen. Hvert treff teller som skade. Det tredje treffet avslutter spillet.",
    "perdeu": "Fjellet holdt deg igjen",
    "v1": "Du fant veien ut!",
    "v2": "I norske sagn kan den som er bergtatt komme tilbake, men forandret. Hallen og steinene er diktet opp for spillet.",
    "h1": "Meter",
    "h2": "Skader"
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
    var GOAL = 120, MAXH = 3, SP = 460;
    var x = 225, tx = 225, stones = [], dist = 0, hits = 0, spawn = 0, held = {}, drag = false, inv = 0, flash = 0, pop = 0, dust = [];
    function py() { return api.h - 64; }
    function setup() { x = tx = api.w / 2; stones = []; dist = 0; hits = 0; spawn = 0.5; held = {}; drag = false; inv = 0; flash = 0; dust = []; }
    function reset() { setup(); st = 'play'; }
    setup();
    return {
      pausar: function () { held = {}; drag = false; },
      dbg: function () { return { st: st, x: x, y: py(), stones: stones.map(function (s) { return { x: s.x, y: s.y, r: s.r, v: s.v }; }), dist: dist, hits: hits, W: api.w, H: api.h, sp: SP }; },
      down: function (x2, y2) { if (menu()) return; drag = true; tx = x2; },
      move: function (x2, y2, pr) { if (drag && pr !== false) tx = x2; },
      up: function () { drag = false; },
      key: function (c, d) { held[c] = d; if (d && st !== 'play') menu(); },
      update: function (dt) {
        pop += dt; if (flash > 0) flash -= dt; if (inv > 0) inv -= dt;
        dust = dust.filter(function (p) { p.t -= dt; p.x += p.vx * dt; p.y += p.vy * dt; return p.t > 0; });
        if (st !== 'play') return;
        var dir = (held.ArrowRight || held.KeyD ? 1 : 0) - (held.ArrowLeft || held.KeyA ? 1 : 0);
        if (dir) tx = Math.max(20, Math.min(api.w - 20, x + dir * 200));
        var mvx = SP * dt, dx = tx - x; x += Math.abs(dx) < mvx ? dx : (dx > 0 ? mvx : -mvx); x = Math.max(18, Math.min(api.w - 18, x));
        var k = dist / GOAL; dist += dt * 3.2; if (dist >= GOAL) { dist = GOAL; st = 'win'; return; }
        spawn -= dt;
        if (spawn <= 0) {
          spawn = 0.62 - 0.2 * k + Math.random() * 0.2; var aim = Math.random() < 0.35, r = 13 + Math.random() * 12;
          stones.push({ x: aim ? Math.max(r, Math.min(api.w - r, x + (Math.random() - 0.5) * 50)) : r + Math.random() * (api.w - 2 * r), y: -30, r: r, v: 170 + 80 * k + Math.random() * 40, a: 0 });
        }
        for (var i = stones.length - 1; i >= 0; i--) {
          var s = stones[i]; s.y += s.v * dt; s.a += dt * 3;
          if (inv <= 0 && Math.abs(s.y - py()) < s.r + 12 && Math.abs(s.x - x) < s.r + 12) { hits++; inv = 1.1; flash = 0.4; if (api.nota) api.nota(120, 0.25, 'sawtooth', 0.07); for (var j = 0; j < 10; j++) dust.push({ x: s.x, y: s.y, vx: (Math.random() - 0.5) * 240, vy: (Math.random() - 0.7) * 200, t: 0.5 }); stones.splice(i, 1); if (hits >= MAXH) { st = 'lose'; return; } continue; }
          if (s.y > api.h + 40) stones.splice(i, 1);
        }
      },
      draw: function () {
        var W = api.w, H = api.h, Y = py();
        bg('#1a1620', '#08060c');
        g.fillStyle = 'rgba(255,255,255,.04)'; for (var q = 0; q < 8; q++) { var yy = ((pop * 40 * (1 + q * 0.15) + q * 90) % (H + 60)) - 30; g.fillRect(q * W / 8 + 12, yy, 3, 24); }
        g.fillStyle = '#2b2436'; g.fillRect(0, H - 40, W, 40); g.fillStyle = '#4a3f5a'; g.fillRect(0, H - 40, W, 3);
        var gl = dist / GOAL; if (gl > 0.7) { g.fillStyle = 'rgba(255,230,160,' + (gl - 0.7) * 1.4 + ')'; g.fillRect(0, 0, W, 12); }
        stones.forEach(function (s) { g.save(); g.translate(s.x, s.y); g.rotate(s.a); g.fillStyle = '#7a7288'; g.beginPath(); for (var i = 0; i < 7; i++) { var a = i / 7 * 6.283, rr2 = s.r * (0.85 + 0.15 * ((i * 37) % 5) / 4); g.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2); } g.closePath(); g.fill(); g.fillStyle = 'rgba(255,255,255,.2)'; g.fillRect(-s.r * 0.4, -s.r * 0.4, s.r * 0.5, 3); g.restore(); });
        dust.forEach(function (p) { g.fillStyle = 'rgba(200,190,220,' + p.t * 2 + ')'; g.fillRect(p.x, p.y, 3, 3); });
        if (!(inv > 0 && Math.floor(pop * 12) % 2)) { g.fillStyle = '#c9a07a'; g.beginPath(); g.arc(x, Y - 6, 10, 0, 6.283); g.fill(); g.fillStyle = '#5a7a9a'; rr(x - 11, Y + 3, 22, 24, 6); g.fill(); }
        if (flash > 0) { g.fillStyle = 'rgba(200,40,40,' + flash * 0.3 + ')'; g.fillRect(0, 0, W, H); }
        hud(T.h1 + ' ' + Math.floor(dist) + '/' + GOAL, T.h2 + ' ' + hits + '/' + MAXH, hits > 0);
        fim(st);
      }
    };
  }
});
