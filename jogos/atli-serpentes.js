/* Atlakviða — afaste as serpentes do poço onde está Gunnar. */
BTJogo.registrar({
  canvas: 'jogo-atli',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O poço de serpentes",
    "sub": "Serpentes surgem das 9 aberturas do poço. Toque em cada uma antes que ela morda: se morder, você perde uma das 3 vidas. Afaste 25 serpentes para chegar à manhã.",
    "perdeu": "As serpentes venceram",
    "v1": "Você afastou as serpentes!",
    "v2": "Na Atlakviða, o rei Gunnar é lançado num poço de serpentes. O jogo de afastá-las é invenção.",
    "h1": "Afastadas",
    "h2": "Vidas"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The snake pit",
    "sub": "Snakes rise from the 9 openings of the pit. Tap each one before it bites: if it bites, you lose one of your 3 lives. Drive away 25 snakes to reach the morning.",
    "perdeu": "The snakes won",
    "v1": "You drove the snakes away!",
    "v2": "In the Atlakviða, King Gunnar is thrown into a snake pit. The game of driving them off is made up.",
    "h1": "Driven off",
    "h2": "Lives"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Ormegropen",
    "sub": "Slanger kommer opp fra de 9 åpningene i gropen. Trykk på hver av dem før den biter: hvis den biter, mister du ett av de 3 livene. Jag bort 25 slanger for å nå morgenen.",
    "perdeu": "Slangene vant",
    "v1": "Du jaget slangene bort!",
    "v2": "I Atlakviða blir kong Gunnar kastet i en ormegrop. Spillet med å jage dem bort er diktet opp.",
    "h1": "Jaget bort",
    "h2": "Liv"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "El pozo de serpientes",
    "sub": "Las serpientes salen de las 9 aberturas del pozo. Toca cada una antes de que muerda: si muerde, pierdes una de las 3 vidas. Ahuyenta 25 serpientes para llegar a la mañana.",
    "perdeu": "Las serpientes ganaron",
    "v1": "¡Ahuyentaste a las serpientes!",
    "v2": "En el Atlakviða, el rey Gunnar es arrojado a un pozo de serpientes. El juego de ahuyentarlas es un invento.",
    "h1": "Ahuyentadas",
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
    var GOAL = 25, N = 3;
    var holes = [], lives = 3, kills = 0, tm = 0, spawn = 1, pop = 0, flash = 0, cur = 4;
    function lay() { var W = api.w, H = api.h, cs = Math.max(56, Math.min((W - 24) / N, (H - 170) / N, 120)); return { cs: cs, x: (W - cs * N) / 2, y: Math.max(90, (H - cs * N) / 2 + 8) }; }
    function setup() { holes = []; for (var i = 0; i < N * N; i++) holes.push({ a: 0, life: 0, hit: 0 }); lives = 3; kills = 0; tm = 0; spawn = 0.8; flash = 0; }
    function reset() { setup(); st = 'play'; }
    function hit(i) { if (st !== 'play') return; var h = holes[i]; if (h.a > 0 && h.hit <= 0) { h.hit = 0.25; kills++; if (api.nota) api.nota(420 + (kills % 5) * 50, 0.05, 'triangle', 0.05); if (kills >= GOAL) st = 'win'; } }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, holes: holes.map(function (h) { return { a: h.a, life: h.life, hit: h.hit }; }), lives: lives, kills: kills, goal: GOAL, tm: tm, pos: function (i) { return { x: L.x + (i % N + 0.5) * L.cs, y: L.y + (Math.floor(i / N) + 0.5) * L.cs }; } }; },
      down: function (x, y) { if (menu()) return; var L = lay(), c = Math.floor((x - L.x) / L.cs), r = Math.floor((y - L.y) / L.cs); if (r >= 0 && c >= 0 && r < N && c < N) { cur = r * N + c; hit(cur); } },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'ArrowLeft') cur = cur % N ? cur - 1 : cur + N - 1; else if (k === 'ArrowRight') cur = cur % N < N - 1 ? cur + 1 : cur - N + 1; else if (k === 'ArrowUp') cur = (cur + N * N - N) % (N * N); else if (k === 'ArrowDown') cur = (cur + N) % (N * N); else if (k === 'Space' || k === 'Enter') hit(cur); },
      update: function (dt) {
        pop += dt; if (flash > 0) flash -= dt; if (st !== 'play') return; tm += dt;
        var dif = Math.min(1, kills / GOAL), ttl = 1.15 - dif * 0.5; spawn -= dt;
        if (spawn <= 0) { var act = holes.filter(function (h) { return h.a > 0; }).length; if (act < 3 + (dif > 0.4 ? 1 : 0)) { var free = []; holes.forEach(function (h, i) { if (h.a <= 0 && h.hit <= 0) free.push(i); }); if (free.length) { var h = holes[free[Math.floor(Math.random() * free.length)]]; h.a = 0.01; h.life = ttl; } } spawn = 0.4 - dif * 0.15 + Math.random() * 0.3; }
        holes.forEach(function (h) { if (h.hit > 0) { h.hit -= dt; if (h.hit <= 0) { h.a = 0; h.life = 0; } return; } if (h.a > 0) { h.a = Math.min(1, h.a + dt * 4); h.life -= dt; if (h.life <= 0) { h.a = 0; lives--; flash = 0.4; if (api.nota) api.nota(110, 0.25, 'sawtooth', 0.07); if (lives <= 0) st = 'lose'; } } });
      },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), i;
        bg('#2a1a1a', '#0a0606');
        g.fillStyle = 'rgba(0,0,0,.4)'; rr(L.x - 6, L.y - 6, L.cs * N + 12, L.cs * N + 12, 14); g.fill();
        for (i = 0; i < N * N; i++) { var x = L.x + (i % N + 0.5) * L.cs, y = L.y + (Math.floor(i / N) + 0.5) * L.cs, h = holes[i];
          g.fillStyle = '#120a08'; g.beginPath(); g.ellipse(x, y + L.cs * 0.12, L.cs * 0.36, L.cs * 0.2, 0, 0, 6.283); g.fill();
          if (h.a > 0) { var k = h.hit > 0 ? 0.3 : h.a, hh = L.cs * 0.5 * k; g.fillStyle = h.hit > 0 ? '#9a9a9a' : (h.life < 0.5 ? '#c0392b' : '#6a9a4a'); rr(x - L.cs * 0.1, y + L.cs * 0.1 - hh, L.cs * 0.2, hh, L.cs * 0.1); g.fill(); g.fillStyle = '#ffd88a'; g.beginPath(); g.arc(x - L.cs * 0.04, y + L.cs * 0.1 - hh + L.cs * 0.06, 2.5, 0, 6.283); g.arc(x + L.cs * 0.04, y + L.cs * 0.1 - hh + L.cs * 0.06, 2.5, 0, 6.283); g.fill(); }
          if (cur === i && st === 'play') { g.strokeStyle = 'rgba(255,255,255,.3)'; g.lineWidth = 2; g.beginPath(); g.ellipse(x, y + L.cs * 0.12, L.cs * 0.4, L.cs * 0.24, 0, 0, 6.283); g.stroke(); } }
        if (flash > 0) { g.fillStyle = 'rgba(192,57,43,' + flash * 0.4 + ')'; g.fillRect(0, 0, W, H); }
        hud(T.h1 + ' ' + kills + '/' + GOAL, T.h2 + ' ' + lives, lives <= 1);
        fim(st);
      }
    };
  }
});
