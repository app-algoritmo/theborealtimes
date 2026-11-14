/* A catapulta de Paris — afunde os barcos vikings antes que cheguem à ponte. */
BTJogo.registrar({
  canvas: 'jogo-paris',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A catapulta de Paris",
    "sub": "Barcos vikings descem o Sena rumo à ponte. Toque na água para lançar uma pedra: ela cai após um instante, então mire um pouco à frente do barco. Afunde-os antes que três passem.",
    "perdeu": "Os barcos passaram pela ponte",
    "v1": "Paris resistiu!",
    "v2": "No cerco de 885–886, os parisienses defenderam a ponte contra uma grande frota viking. A catapulta e a pontaria do jogo são invenção.",
    "h1": "Afundados",
    "h2": "Passaram"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The catapult of Paris",
    "sub": "Viking boats come down the Seine toward the bridge. Tap the water to launch a stone: it lands after a moment, so aim slightly ahead of the boat. Sink them before three get past.",
    "perdeu": "The boats got past the bridge",
    "v1": "Paris held!",
    "v2": "In the siege of 885–886, the Parisians defended the bridge against a great Viking fleet. The catapult and the aiming in the game are made up.",
    "h1": "Sunk",
    "h2": "Passed"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Parisers katapult",
    "sub": "Vikingbåter kommer ned Seinen mot broen. Trykk på vannet for å skyte en stein: den lander etter et øyeblikk, så sikt litt foran båten. Senk dem før tre kommer forbi.",
    "perdeu": "Båtene kom forbi broen",
    "v1": "Paris holdt stand!",
    "v2": "Under beleiringen i 885–886 forsvarte parisere broen mot en stor vikingflåte. Katapulten og siktingen i spillet er diktet opp.",
    "h1": "Senket",
    "h2": "Forbi"
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
    var TOTAL = 11, NEED = 9, MAXL = 3, FL = 0.45;
    var boats = [], stones = [], sunk = 0, leaks = 0, spawned = 0, sp = 0, cool = 0, splash = [];
    function reset() { st = 'play'; boats = []; stones = []; sunk = 0; leaks = 0; spawned = 0; sp = 1; cool = 0; splash = []; }
    function bx() { return 90; }
    return {
      pausar: function () {},
      dbg: function () { return { st: st, sunk: sunk, leaks: leaks, cool: cool, spawned: spawned, fl: FL, boats: boats.map(function (b) { return { x: b.x, y: b.y, v: b.v }; }) }; },
      down: function (x, y) { if (menu()) return; if (cool > 0) return; cool = 0.35; stones.push({ x: x, y: y, t: FL }); },
      key: function (c, d) { if (d && st !== 'play' && (c === 'Space' || c === 'Enter')) menu(); },
      update: function (dt) {
        if (st !== 'play') return;
        if (cool > 0) cool -= dt;
        sp -= dt; if (spawned < TOTAL && sp <= 0) { var H = api.h; boats.push({ x: api.w + 40, y: H * 0.36 + Math.random() * H * 0.3, v: 42 + spawned * 2.5 }); spawned++; sp = 2.2; }
        for (var i = boats.length - 1; i >= 0; i--) { boats[i].x -= boats[i].v * dt; if (boats[i].x < bx() + 20) { boats.splice(i, 1); leaks++; if (leaks >= MAXL) { st = 'lose'; return; } } }
        for (var j = stones.length - 1; j >= 0; j--) { var s = stones[j]; s.t -= dt; if (s.t <= 0) { splash.push({ x: s.x, y: s.y, t: 0.4 }); for (var k = boats.length - 1; k >= 0; k--) if (Math.hypot(boats[k].x - s.x, boats[k].y - s.y) < 46) { boats.splice(k, 1); sunk++; } stones.splice(j, 1); } }
        for (var m = splash.length - 1; m >= 0; m--) { splash[m].t -= dt; if (splash[m].t <= 0) splash.splice(m, 1); }
        if (spawned >= TOTAL && !boats.length) st = sunk >= NEED ? 'win' : 'lose';
      },
      draw: function () {
        var W = api.w, H = api.h;
        bg('#47617a', '#2a3a4a');
        g.fillStyle = '#2f6d8a'; g.fillRect(0, H * 0.28, W, H * 0.5);
        g.fillStyle = '#7a6a5a'; g.fillRect(bx() - 26, H * 0.2, 40, H * 0.66); g.fillStyle = '#5a4a3a'; g.fillRect(bx() - 40, H * 0.2, 14, H * 0.66);
        boats.forEach(function (b) { g.fillStyle = '#6b4a2e'; g.beginPath(); g.moveTo(b.x - 30, b.y); g.lineTo(b.x + 30, b.y); g.lineTo(b.x + 18, b.y + 14); g.lineTo(b.x - 18, b.y + 14); g.fill(); g.fillStyle = '#c0392b'; g.fillRect(b.x - 12, b.y - 24, 24, 20); g.fillStyle = '#4a2a1a'; g.fillRect(b.x - 2, b.y - 30, 3, 30); });
        stones.forEach(function (s) { g.strokeStyle = 'rgba(255,216,138,.8)'; g.lineWidth = 2; g.beginPath(); g.arc(s.x, s.y, 46 * (1 - s.t / FL) + 6, 0, 6.29); g.stroke(); });
        splash.forEach(function (s) { g.fillStyle = 'rgba(255,255,255,' + s.t * 1.5 + ')'; g.beginPath(); g.arc(s.x, s.y, 46 * (1 - s.t / 0.4) + 10, 0, 6.29); g.fill(); });
        hud(T.h1 + ' ' + sunk + '/' + NEED, T.h2 + ' ' + leaks + '/' + MAXL, leaks > 0);
        fim(st);
      }
    };
  }
});
