/* Os três goles — solte na marca dourada para esvaziar cada recipiente. */
BTJogo.registrar({
  canvas: 'jogo-hidromel',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os três goles",
    "sub": "Mantenha o dedo (ou a barra de espaço) pressionado para Odin beber: o nível sobe cada vez mais rápido. Solte quando chegar à marca dourada. Passar dela ou ficar aquém derrama o hidromel. Esvazie os três recipientes com no máximo três erros.",
    "perdeu": "O hidromel se derramou",
    "v1": "A águia levanta voo!",
    "v2": "Na Edda em Prosa, Odin bebe o hidromel dos poetas em três goles, esvaziando três recipientes. A barra e as marcas do jogo são invenção.",
    "h1": "Goles",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The three draughts",
    "sub": "Hold your finger (or the space bar) down for Odin to drink: the level rises faster and faster. Release when it reaches the golden mark. Overshooting or falling short spills the mead. Empty the three vessels with at most three mistakes.",
    "perdeu": "The mead was spilled",
    "v1": "The eagle takes flight!",
    "v2": "In the Prose Edda, Odin drinks the poets' mead in three draughts, emptying three vessels. The bar and the marks in the game are made up.",
    "h1": "Draughts",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "De tre slurkene",
    "sub": "Hold fingeren (eller mellomromstasten) nede for at Odin skal drikke: Nivået stiger stadig raskere. Slipp når det når det gylne merket. Å gå forbi eller bli kort søler mjøden. Tøm de tre karene med høyst tre feil.",
    "perdeu": "Mjøden ble sølt",
    "v1": "Ørnen letter!",
    "v2": "I Snorres Edda drikker Odin skaldemjøden i tre slurker og tømmer tre kar. Linjen og merkene i spillet er diktet opp.",
    "h1": "Slurker",
    "h2": "Feil"
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
    var NEED = 3, MAXE = 3, ZS = [0.72, 0.82, 0.9], TS = [0.09, 0.075, 0.06], NM = ['Óðrerir', 'Boðn', 'Són'];
    var vi = 0, L = 0, holding = false, ht = 0, errs = 0, done = 0, fl = 0, fres = 0;
    function reset() { st = 'play'; vi = 0; L = 0; holding = false; ht = 0; errs = 0; done = 0; fl = 0; }
    function soltar() {
      if (!holding || st !== 'play') { holding = false; return; }
      holding = false; if (L < 0.05) { ht = 0; return; }
      if (Math.abs(L - ZS[vi]) <= TS[vi]) { done++; vi++; fres = 1; if (done >= NEED) st = 'win'; } else { errs++; fres = -1; if (errs >= MAXE) st = 'lose'; }
      L = 0; ht = 0; fl = 0.6;
    }
    return {
      pausar: function () { holding = false; },
      dbg: function () { return { st: st, vi: vi, L: L, z: ZS[Math.min(vi, 2)], tol: TS[Math.min(vi, 2)], holding: holding, errs: errs, done: done }; },
      down: function () { if (menu()) return; if (fl <= 0) holding = true; },
      up: function () { soltar(); },
      key: function (c, d) { if (c !== 'Space' && c !== 'Enter') return; if (d) { if (st !== 'play') menu(); else if (fl <= 0) holding = true; } else soltar(); },
      update: function (dt) {
        if (st !== 'play') return;
        if (fl > 0) { fl -= dt; if (fl <= 0 && holding === false) {} }
        if (holding) { ht += dt; L += (0.26 + 0.3 * ht) * dt; if (L >= 1) { errs++; fres = -1; holding = false; L = 0; ht = 0; fl = 0.6; if (errs >= MAXE) st = 'lose'; } }
      },
      draw: function () {
        var W = api.w, H = api.h;
        bg('#2a1a12', '#0e0a10');
        g.fillStyle = '#3a2a22'; g.beginPath(); g.moveTo(0, H); g.lineTo(0, H * 0.3); g.lineTo(W * 0.2, H * 0.08); g.lineTo(W * 0.8, H * 0.08); g.lineTo(W, H * 0.3); g.lineTo(W, H); g.fill();
        g.fillStyle = 'rgba(255,170,60,.08)'; g.beginPath(); g.arc(W / 2, H * 0.5, Math.min(W, H) * 0.5, 0, 6.29); g.fill();
        for (var i = 0; i < 3; i++) {
          var cx = W * (0.2 + 0.3 * i), act = i === Math.min(vi, 2) && st === 'play', jh = act ? H * 0.58 : H * 0.34, jw = act ? Math.min(W * 0.2, 96) : Math.min(W * 0.12, 60), jy = H * 0.86 - jh;
          g.fillStyle = '#6b4a2a'; g.fillRect(cx - jw / 2, jy, jw, jh); g.fillStyle = '#4a2f18'; g.fillRect(cx - jw / 2 - 4, jy - 6, jw + 8, 8);
          var lev = act ? L : i < done ? 0 : 0; g.fillStyle = i < done ? 'rgba(255,255,255,.1)' : '#e0a83a'; if (i >= done) g.fillRect(cx - jw / 2 + 4, jy + jh - 4 - (jh - 8) * (act ? lev : 1), jw - 8, (jh - 8) * (act ? lev : 1));
          if (act) { var zy = jy + jh - 4 - (jh - 8) * ZS[i], zh = (jh - 8) * TS[i] * 2; g.fillStyle = 'rgba(255,255,255,.28)'; g.fillRect(cx - jw / 2 - 10, zy - zh / 2, jw + 20, zh); g.strokeStyle = '#fff2c4'; g.lineWidth = 2; g.strokeRect(cx - jw / 2 - 10, zy - zh / 2, jw + 20, zh); }
          txt(NM[i], cx, H * 0.9, 12, i < done ? '#9dffb6' : '#f3ecd2');
        }
        if (fl > 0 && fres !== 0) txt(fres > 0 ? '✓' : '✗', W / 2, H * 0.3, 54, fres > 0 ? '#9dffb6' : '#ff8a7a');
        hud(T.h1 + ' ' + done + '/' + NEED, T.h2 + ' ' + errs + '/' + MAXE, errs > 0);
        fim(st);
      }
    };
  }
});
