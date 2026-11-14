/* Antes que o sol nasça — mande os trolls para as cavernas. */
BTJogo.registrar({
  canvas: 'jogo-trolls',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Antes que o sol nasça",
    "sub": "O sol avança da direita para a esquerda. Toque em cada troll para mandá-lo correndo até as cavernas, à esquerda, antes que a luz o alcance e o transforme em pedra. Salve nove dos doze trolls.",
    "perdeu": "Trolls demais viraram pedra",
    "v1": "Os trolls estão a salvo!",
    "v2": "Nos contos escandinavos, os trolls viram pedra se o sol os alcança. É um motivo comum; as cavernas e a corrida são invenção do jogo.",
    "h1": "A salvo",
    "h2": "Pedra"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Before the sun rises",
    "sub": "The sun advances from right to left. Tap each troll to send it running to the caves on the left before the light catches it and turns it to stone. Save nine of the twelve trolls.",
    "perdeu": "Too many trolls turned to stone",
    "v1": "The trolls are safe!",
    "v2": "In Scandinavian tales, trolls turn to stone if the sun reaches them. It is a common motif; the caves and the race are made up for the game.",
    "h1": "Safe",
    "h2": "Stone"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Før solen stiger",
    "sub": "Sola rykker frem fra høyre mot venstre. Trykk på hvert troll for å sende det løpende til hulene til venstre før lyset tar det og gjør det til stein. Berg ni av tolv troll.",
    "perdeu": "For mange troll ble til stein",
    "v1": "Trollene er i sikkerhet!",
    "v2": "I skandinaviske eventyr blir troll til stein hvis sola når dem. Det er et vanlig motiv; hulene og kappløpet er diktet opp for spillet.",
    "h1": "I sikkerhet",
    "h2": "Stein"
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
    var TOTAL = 12, NEED = 9;
    var trolls = [], saved = 0, stone = 0, sunx = 0, sp = 0, spawned = 0, t = 0;
    function reset() { st = 'play'; trolls = []; saved = 0; stone = 0; sunx = api.w + 30; sp = 0.8; spawned = 0; t = 0; }
    function sunv() { return (api.w - 230) / 30; }
    function cave() { return 54; }
    return {
      pausar: function () {},
      dbg: function () { return { st: st, saved: saved, stone: stone, sunx: sunx, spawned: spawned, trolls: trolls.map(function (r) { return { x: r.x, y: r.y, run: r.run, stone: r.stone }; }) }; },
      down: function (x, y) {
        if (menu()) return;
        var best = -1, bd = 1e9;
        trolls.forEach(function (r, i) { if (r.run || r.stone) return; var d = Math.hypot(x - r.x, y - r.y); if (d < 52 && d < bd) { bd = d; best = i; } });
        if (best >= 0) trolls[best].run = true;
      },
      key: function (c, d) { if (d && st !== 'play' && (c === 'Space' || c === 'Enter')) menu(); },
      update: function (dt) {
        if (st !== 'play') return;
        t += dt; sunx -= sunv() * dt; sp -= dt;
        if (spawned < TOTAL && sp <= 0) { var W = api.w, H = api.h, hi = Math.max(190, sunx - 60), lo = Math.max(140, hi - 200); trolls.push({ x: lo + Math.random() * (hi - lo), y: H * 0.32 + Math.random() * H * 0.4, run: false, stone: false, gone: false }); spawned++; sp = 2.15; }
        for (var i = trolls.length - 1; i >= 0; i--) {
          var r = trolls[i];
          if (r.gone) { trolls.splice(i, 1); continue; }
          if (r.stone) continue;
          if (r.run) { r.x -= 250 * dt; if (r.x <= cave()) { saved++; r.gone = true; } }
          if (!r.gone && r.x > sunx) { r.stone = true; r.run = false; stone++; }
        }
        if (stone > TOTAL - NEED) { st = 'lose'; return; }
        if (spawned >= TOTAL && !trolls.some(function (r) { return !r.stone && !r.gone; })) st = saved >= NEED ? 'win' : 'lose';
      },
      draw: function () {
        var W = api.w, H = api.h;
        var k = Math.min(1, Math.max(0, 1 - sunx / W));
        bg('#1f2a52', '#3a4a3a');
        g.fillStyle = 'rgba(255,200,110,' + (0.18 + k * 0.1) + ')'; g.fillRect(sunx, 0, W - sunx, H);
        g.fillStyle = 'rgba(255,230,160,.8)'; g.fillRect(sunx - 2, 0, 3, H);
        g.fillStyle = '#2a2a2a'; g.fillRect(0, H * 0.25, 30, H * 0.6); g.fillStyle = '#0a0a0a'; g.beginPath(); g.arc(24, H * 0.42, 24, 0, 6.29); g.arc(24, H * 0.62, 24, 0, 6.29); g.fill();
        trolls.forEach(function (r) {
          g.fillStyle = r.stone ? '#8a8a8a' : '#4f7a4a'; g.beginPath(); g.arc(r.x, r.y - 20, 15, 0, 6.29); g.fill(); g.fillRect(r.x - 17, r.y - 20, 34, 38);
          g.fillStyle = r.stone ? '#6a6a6a' : '#3a5a38'; g.fillRect(r.x - 4, r.y - 22, 14, 6);
          if (!r.stone) { g.fillStyle = '#ffd88a'; g.fillRect(r.x - 8, r.y - 26, 4, 4); g.fillRect(r.x + 3, r.y - 26, 4, 4); }
        });
        hud(T.h1 + ' ' + saved + '/' + NEED, T.h2 + ' ' + stone, stone > 0);
        fim(st);
      }
    };
  }
});
