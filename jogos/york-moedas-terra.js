/* Tesouro do Vale de York — ache as moedas de prata que surgem na terra (invenção). */
BTJogo.registrar({
  canvas: 'jogo-york',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As moedas do Vale de York",
    "sub": "Moedas de prata surgem nos buracos da terra e somem depressa. Toque numa moeda para pegá-la antes que ela afunde. Pegue 25 moedas, sem deixar mais de 5 sumirem, em até 90 segundos. (Teclado: teclas 1 a 9, como num teclado numérico.)",
    "perdeu": "Moedas demais sumiram ou o tempo acabou",
    "v1": "O tesouro foi achado!",
    "v2": "Em 2007, perto de Harrogate, um pai e um filho acharam 617 moedas de prata enterradas. A caça às moedas é invenção.",
    "h1": "Moedas",
    "h2": "Perdidas"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The Vale of York coins",
    "sub": "Silver coins pop up from holes in the ground and vanish fast. Tap a coin to take it before it sinks. Collect 25 coins without letting more than 5 vanish, within 90 seconds. (Keyboard: keys 1 to 9, as on a number pad.)",
    "perdeu": "Too many coins vanished or time ran out",
    "v1": "The hoard is found!",
    "v2": "In 2007, near Harrogate, a father and son found 617 buried silver coins. The coin hunt is invented.",
    "h1": "Coins",
    "h2": "Lost"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Myntene i Vale of York",
    "sub": "Sølvmynter dukker opp fra hull i bakken og forsvinner fort. Trykk på en mynt for å ta den før den synker. Samle 25 mynter uten å la mer enn 5 forsvinne, innen 90 sekunder. (Tastatur: tast 1 til 9, som på et tastatur med tall.)",
    "perdeu": "For mange mynter forsvant eller tiden tok slutt",
    "v1": "Skatten er funnet!",
    "v2": "I 2007, nær Harrogate, fant en far og en sønn 617 nedgravde sølvmynter. Myntjakten er oppfunnet.",
    "h1": "Mynter",
    "h2": "Tapt"
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
    var GOAL = 25, MAXL = 5, LIM = 90;
    var holes = [], got = 0, lost = 0, t = 0, spawnT = 1, fx = [];
    function lay() { var W = api.w, H = api.h, cs = Math.max(60, Math.min((W - 30) / 3, (H - 150) / 3, 130)); return { cs: cs, x: (W - cs * 3) / 2, y: Math.max(76, (H - cs * 3) / 2 + 14) }; }
    function pos(i) { var L = lay(); return { x: L.x + (i % 3 + 0.5) * L.cs, y: L.y + (Math.floor(i / 3) + 0.5) * L.cs }; }
    function prog() { return Math.min(1, got / GOAL); }
    function reset() { holes = []; for (var i = 0; i < 9; i++) holes.push({ on: false, age: 0, life: 1 }); got = 0; lost = 0; t = 0; spawnT = 1; fx = []; st = 'play'; }
    function take(i) {
      if (st !== 'play' || i < 0 || !holes[i].on) return; holes[i].on = false; got++; fx.push({ i: i, a: 0.4 }); if (api.nota) api.nota(700 + (got % 5) * 60, 0.12, 'sine', 0.06);
      if (got >= GOAL) st = 'win';
    }
    function at(x, y) { var L = lay(); for (var i = 0; i < 9; i++) { var p = pos(i); if (Math.abs(x - p.x) < L.cs * 0.5 && Math.abs(y - p.y) < L.cs * 0.5) return i; } return -1; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { var c = []; holes.forEach(function (h, i) { if (h.on) { var p = pos(i); c.push({ i: i, x: p.x, y: p.y, age: h.age, life: h.life }); } }); return { st: st, coins: c, got: got, lost: lost, t: t }; },
      down: function (x, y) { if (menu()) return; take(at(x, y)); },
      move: function () {}, up: function () {},
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } var m = /^(Digit|Numpad)([1-9])$/.exec(k); if (m) take(parseInt(m[2], 10) - 1); },
      update: function (dt) {
        fx.forEach(function (f) { f.a -= dt; }); fx = fx.filter(function (f) { return f.a > 0; });
        if (st !== 'play') return; t += dt; if (t >= LIM) { st = 'lose'; return; }
        holes.forEach(function (h) { if (h.on) { h.age += dt; if (h.age >= h.life) { h.on = false; lost++; if (api.nota) api.nota(150, 0.2, 'sawtooth', 0.05); } } });
        if (lost >= MAXL) { st = 'lose'; return; }
        spawnT -= dt;
        if (spawnT <= 0) {
          var act = holes.filter(function (h) { return h.on; }).length, free = [];
          holes.forEach(function (h, i) { if (!h.on) free.push(i); });
          if (act < 3 && free.length) { var i = free[Math.floor(Math.random() * free.length)]; holes[i].on = true; holes[i].age = 0; holes[i].life = 1.9 - 0.8 * prog(); }
          spawnT = 1.15 - 0.45 * prog() + Math.random() * 0.2;
        }
      },
      draw: function () {
        var L = lay(), cs = L.cs, i;
        bg('#34502e', '#101c0e');
        for (i = 0; i < 9; i++) {
          var p = pos(i), h = holes[i];
          g.fillStyle = '#2a1f14'; g.beginPath(); g.ellipse(p.x, p.y + cs * 0.12, cs * 0.38, cs * 0.17, 0, 0, 6.283); g.fill();
          if (h.on) {
            var k = Math.min(1, h.age / 0.15), fade = h.life - h.age < 0.4 ? (Math.floor(api.clock * 14) % 2 ? 0.4 : 1) : 1, r = cs * 0.27 * (h.life - h.age < 0.5 ? (h.life - h.age) / 0.5 * 0.5 + 0.5 : 1);
            g.globalAlpha = fade; g.fillStyle = '#dfe3ea'; g.beginPath(); g.arc(p.x, p.y + cs * 0.1 - k * cs * 0.18, r, 0, 6.283); g.fill(); g.strokeStyle = '#9aa5b0'; g.lineWidth = 3; g.stroke();
            g.strokeStyle = '#9aa5b0'; g.lineWidth = 2; g.beginPath(); g.arc(p.x, p.y + cs * 0.1 - k * cs * 0.18, r * 0.55, 0, 6.283); g.stroke(); g.globalAlpha = 1;
          }
          txt(String(i + 1), p.x, p.y + cs * 0.42, 12, 'rgba(255,255,255,.3)');
        }
        fx.forEach(function (f) { var p = pos(f.i); txt('✦', p.x, p.y - (0.4 - f.a) * 60, 26, '#ffd88a'); });
        bar(api.w / 2 - 110, api.h - 14, 220, 5, (LIM - t) / LIM, LIM - t < 15 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + got + '/' + GOAL, T.h2 + ' ' + lost + '/' + MAXL, lost >= MAXL - 2);
        fim(st);
      }
    };
  }
});
