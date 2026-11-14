/* As três casas — leve cada família à casa que combina com a sua ferramenta. */
BTJogo.registrar({
  canvas: 'jogo-rigs',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As três casas",
    "sub": "Heimdall, como Ríg, visita três casas. Cada família chega com uma ferramenta: o cesto e a corda são da casa do servo, o grão e o boi são da casa do camponês, o escudo e o arco são da casa do jarl. Toque na casa certa (ou use as teclas 1, 2 e 3) antes que o tempo acabe. Atenda doze famílias com no máximo três erros.",
    "perdeu": "A ordem das casas se perdeu",
    "v1": "As três casas estão em ordem!",
    "v2": "No poema Rígsþula, Heimdall, como Ríg, visita três casas e dá origem ao servo, ao camponês e ao jarl. As famílias e as ferramentas do jogo são invenção.",
    "h1": "Famílias",
    "h2": "Erros",
    "servo": "Servo",
    "camp": "Camponês",
    "jarl": "Jarl"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The three houses",
    "sub": "Heimdall, as Ríg, visits three houses. Each family arrives with a tool: the basket and the rope belong to the thrall's house, the grain and the ox to the farmer's house, the shield and the bow to the jarl's house. Tap the right house (or use keys 1, 2 and 3) before time runs out. Serve twelve families with at most three mistakes.",
    "perdeu": "The order of the houses was lost",
    "v1": "The three houses are in order!",
    "v2": "In the poem Rígsþula, Heimdall, as Ríg, visits three houses and gives rise to the thrall, the farmer and the jarl. The families and tools in the game are made up.",
    "h1": "Families",
    "h2": "Mistakes",
    "servo": "Thrall",
    "camp": "Farmer",
    "jarl": "Jarl"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "De tre husene",
    "sub": "Heimdall, som Rig, besøker tre hus. Hver familie kommer med et redskap: Kurven og tauet hører til trellens hus, kornet og oksen til bondens hus, skjoldet og buen til jarlens hus. Trykk på riktig hus (eller bruk tastene 1, 2 og 3) før tiden går ut. Ta imot tolv familier med høyst tre feil.",
    "perdeu": "Husenes orden gikk tapt",
    "v1": "De tre husene er i orden!",
    "v2": "I diktet Rigstula besøker Heimdall, som Rig, tre hus og gir opphav til trellen, bonden og jarlen. Familiene og redskapene i spillet er diktet opp.",
    "h1": "Familier",
    "h2": "Feil",
    "servo": "Trell",
    "camp": "Bonde",
    "jarl": "Jarl"
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
    var NEED = 12, MAXE = 3, TOOLS = [['🧺', '🪢'], ['🌾', '🐂'], ['🛡️', '🏹']];
    var n = 0, errs = 0, fam = null, tl = 0, lim = 4, fl = 0, fres = 0, gap = 0;
    function novo() { var k = Math.floor(Math.random() * 3); fam = { k: k, tool: TOOLS[k][Math.floor(Math.random() * 2)], a: 0 }; lim = Math.max(1.9, 3.8 - n * 0.16); tl = lim; }
    function reset() { st = 'play'; n = 0; errs = 0; fl = 0; gap = 0; novo(); }
    function esc(i) {
      if (st !== 'play' || fl > 0 || !fam) return;
      if (i === fam.k) { n++; fres = 1; } else { errs++; fres = -1; }
      fl = 0.45; fam = null;
      if (n >= NEED) st = 'win'; else if (errs >= MAXE) st = 'lose';
    }
    return {
      pausar: function () {},
      dbg: function () { return { st: st, n: n, errs: errs, k: fam ? fam.k : -1, tl: tl, lim: lim, fl: fl }; },
      down: function (x) { if (menu()) return; esc(Math.max(0, Math.min(2, Math.floor(x / (api.w / 3))))); },
      key: function (c, d) { if (!d) return; if (st !== 'play') { if (c === 'Space' || c === 'Enter') menu(); return; } var k = { Digit1: 0, Digit2: 1, Digit3: 2, ArrowLeft: 0, ArrowDown: 1, ArrowRight: 2 }[c]; if (k !== undefined) esc(k); },
      update: function (dt) {
        if (st !== 'play') return;
        if (fl > 0) { fl -= dt; if (fl <= 0 && st === 'play') novo(); return; }
        if (fam) { fam.a = Math.min(1, fam.a + dt * 5); tl -= dt; if (tl <= 0) { errs++; fres = -1; fam = null; fl = 0.45; if (errs >= MAXE) st = 'lose'; } }
      },
      draw: function () {
        var W = api.w, H = api.h, nm = [T.servo, T.camp, T.jarl], col = ['#6b5a48', '#8a6a3a', '#7a2f3a'];
        bg('#2b2a4a', '#171627');
        for (var i = 0; i < 3; i++) {
          var cx = W * (i + 0.5) / 3, hw2 = Math.min(W / 3 * 0.38, 110), hy = H * 0.62, hh = H * 0.28;
          g.fillStyle = col[i]; g.fillRect(cx - hw2, hy, hw2 * 2, hh); g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.moveTo(cx - hw2 - 10, hy); g.lineTo(cx, hy - hh * (0.45 + i * 0.12)); g.lineTo(cx + hw2 + 10, hy); g.fill();
          g.fillStyle = '#ffd88a'; g.fillRect(cx - 10, hy + hh * 0.35, 20, hh * 0.65);
          txt(nm[i], cx, hy + hh + 22, 15, '#f3ecd2'); txt(TOOLS[i][0] + ' ' + TOOLS[i][1], cx, hy + hh * 0.22, 22, '#fff');
          txt(String(i + 1), cx, hy - hh * 0.6 - 6, 13, '#c9b3f2');
        }
        if (fam) { var fx = W / 2, fy = H * 0.3 + (1 - fam.a) * -40; g.fillStyle = '#e8d9a8'; g.beginPath(); g.arc(fx - 22, fy, 14, 0, 6.29); g.arc(fx + 22, fy, 14, 0, 6.29); g.fill(); g.beginPath(); g.arc(fx, fy + 6, 10, 0, 6.29); g.fill(); txt(fam.tool, fx, fy + 52, 44, '#fff'); var bw = Math.min(W * 0.4, 220); g.fillStyle = 'rgba(255,255,255,.2)'; g.fillRect(fx - bw / 2, fy - 38, bw, 6); g.fillStyle = tl / lim > 0.35 ? '#ffd88a' : '#ff8a7a'; g.fillRect(fx - bw / 2, fy - 38, bw * Math.max(0, tl) / lim, 6); }
        if (fl > 0) txt(fres > 0 ? '✓' : '✗', W / 2, H * 0.34, 58, fres > 0 ? '#9dffb6' : '#ff8a7a');
        hud(T.h1 + ' ' + n + '/' + NEED, T.h2 + ' ' + errs + '/' + MAXE, errs > 0);
        fim(st);
      }
    };
  }
});
