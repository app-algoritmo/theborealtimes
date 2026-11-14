/* Os bolos de Alfredo — vire os bolos na hora certa. */
BTJogo.registrar({
  canvas: 'jogo-bolos',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os bolos de Alfredo",
    "sub": "Três bolos assam na pedra quente. Toque em cada um quando estiver dourado (a barra na zona clara). Cedo demais fica cru; tarde demais, queima. Salve dez bolos com no máximo três erros.",
    "perdeu": "Os bolos queimaram",
    "v1": "Nenhum bolo queimado!",
    "v2": "A história dos bolos queimados é uma tradição tardia, que não aparece nos textos mais antigos sobre Alfredo. O jogo é invenção.",
    "h1": "Salvos",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Alfred's cakes",
    "sub": "Three cakes bake on the hot stone. Tap each one when it is golden (the bar in the bright zone). Too early and it is raw; too late and it burns. Save ten cakes with at most three mistakes.",
    "perdeu": "The cakes burned",
    "v1": "No cake burned!",
    "v2": "The story of the burnt cakes is a late tradition, absent from the earliest texts about Alfred. The game is made up.",
    "h1": "Saved",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Alfreds kaker",
    "sub": "Tre kaker steker på den varme steinen. Trykk på hver når den er gyllen (stolpen i den lyse sonen). For tidlig er den rå; for sent brenner den. Berg ti kaker med høyst tre feil.",
    "perdeu": "Kakene brant",
    "v1": "Ingen kake brant!",
    "v2": "Fortellingen om de brente kakene er en sen tradisjon som ikke finnes i de eldste tekstene om Alfred. Spillet er diktet opp.",
    "h1": "Berget",
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
    var NEED = 10, MAXE = 3, LO = 0.6, HI = 0.86;
    var cakes = [], saved = 0, errs = 0;
    function mkc(i) { return { i: i, v: Math.random() * 0.3, rest: 0, res: 0 }; }
    function reset() { st = 'play'; saved = 0; errs = 0; cakes = [mkc(0), mkc(1), mkc(2)]; }
    function spd() { return 0.2 + Math.min(saved, 8) * 0.014; }
    function pos(i) { var w = api.w, h = api.h, s = Math.min(w / 3.2, 150); return { x: w / 2 + (i - 1) * s * 1.1, y: h / 2 + 10, r: s * 0.42 }; }
    function tapc(c) {
      if (c.rest > 0) return;
      if (c.v >= LO && c.v <= HI) { saved++; c.res = 1; } else { errs++; c.res = -1; }
      c.rest = 0.6;
      if (saved >= NEED) st = 'win'; else if (errs >= MAXE) st = 'lose';
    }
    return {
      pausar: function () {},
      dbg: function () { return { st: st, saved: saved, errs: errs, lo: LO, hi: HI, cakes: cakes.map(function (c) { var p = pos(c.i); return { x: p.x, y: p.y, v: c.v, rest: c.rest }; }) }; },
      down: function (x, y) {
        if (menu()) return;
        for (var i = 0; i < cakes.length; i++) { var p = pos(cakes[i].i); if (Math.hypot(x - p.x, y - p.y) < p.r * 1.3) { tapc(cakes[i]); return; } }
      },
      key: function (c, d) { if (!d) return; if (st !== 'play') { if (c === 'Space' || c === 'Enter') menu(); return; } var k = { Digit1: 0, Digit2: 1, Digit3: 2, KeyA: 0, KeyS: 1, KeyD: 2, ArrowLeft: 0, ArrowDown: 1, ArrowRight: 2 }[c]; if (k !== undefined) tapc(cakes[k]); },
      update: function (dt) {
        if (st !== 'play') return;
        cakes.forEach(function (c) {
          if (c.rest > 0) { c.rest -= dt; if (c.rest <= 0) { c.v = 0; c.res = 0; } return; }
          c.v += spd() * dt;
          if (c.v >= 1 && st === 'play') { errs++; c.res = -1; c.rest = 0.6; if (errs >= MAXE) st = 'lose'; }
        });
      },
      draw: function () {
        var W = api.w, H = api.h;
        bg('#3a2a20', '#1c140f');
        g.fillStyle = '#6a625a'; g.fillRect(0, H * 0.3, W, H * 0.45);
        cakes.forEach(function (c) {
          var p = pos(c.i), k = Math.min(1, c.v), col = c.rest > 0 ? (c.res > 0 ? '#e0b050' : '#2a1a14') : k < LO ? '#e8d9a8' : k <= HI ? '#e0a83a' : '#4a2a14';
          g.fillStyle = col; g.beginPath(); g.arc(p.x, p.y, p.r, 0, 6.29); g.fill(); g.strokeStyle = 'rgba(0,0,0,.4)'; g.lineWidth = 3; g.stroke();
          var bw = p.r * 2; g.fillStyle = 'rgba(255,255,255,.2)'; g.fillRect(p.x - bw / 2, p.y + p.r + 12, bw, 8); g.fillStyle = 'rgba(255,216,138,.6)'; g.fillRect(p.x - bw / 2 + bw * LO, p.y + p.r + 12, bw * (HI - LO), 8); g.fillStyle = '#fff'; g.fillRect(p.x - bw / 2 + bw * k - 2, p.y + p.r + 8, 4, 16);
          if (c.rest > 0) txt(c.res > 0 ? '✓' : '✗', p.x, p.y + 10, 30, c.res > 0 ? '#3a2a14' : '#ff8a7a');
        });
        hud(T.h1 + ' ' + saved + '/' + NEED, T.h2 + ' ' + errs + '/' + MAXE, errs > 0);
        fim(st);
      }
    };
  }
});
