/* Os pilares de Ingólfr — lance o pilar do assento de honra na baía certa. */
BTJogo.registrar({
  canvas: 'jogo-ingolfr',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os pilares de Ingólfr",
    "sub": "Toque (ou use a barra de espaço) para lançar o pilar. O marcador na água mostra onde ele cairia sem vento; a seta mostra para onde o vento o empurra. Acerte a baía dourada quatro vezes, com no máximo três erros.",
    "perdeu": "Os pilares se perderam no mar",
    "v1": "Terra à vista!",
    "v2": "Segundo o Livro dos Assentamentos, Ingólfr lançou os pilares ao mar e se fixou onde eles pararam. A baía, o vento e o marcador do jogo são invenção.",
    "h1": "Acertos",
    "h2": "Erros",
    "vento": "vento"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Ingólfr's pillars",
    "sub": "Tap (or press Space) to throw the pillar. The marker on the water shows where it would land without wind; the arrow shows where the wind pushes it. Hit the golden bay four times, with at most three misses.",
    "perdeu": "The pillars were lost at sea",
    "v1": "Land ahead!",
    "v2": "According to the Book of Settlements, Ingólfr threw the pillars into the sea and settled where they came to rest. The bay, the wind and the marker in the game are made up.",
    "h1": "Hits",
    "h2": "Misses",
    "vento": "wind"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Ingolfs høysetestolper",
    "sub": "Trykk (eller bruk mellomromstasten) for å kaste stolpen. Merket på vannet viser hvor den ville landet uten vind; pilen viser hvor vinden skyver den. Treff den gylne bukta fire ganger, med høyst tre bom.",
    "perdeu": "Stolpene ble borte på havet",
    "v1": "Land i sikte!",
    "v2": "Ifølge Landnámabók kastet Ingolf stolpene på sjøen og slo seg ned der de kom til ro. Bukta, vinden og merket i spillet er diktet opp.",
    "h1": "Treff",
    "h2": "Feil",
    "vento": "vind"
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
    var NEED = 4, MAXE = 3;
    var hits = 0, errs = 0, ph = 0, wind = 0, tc = 0, hw = 46, fly = null, rest = 0, res = 0, ghost = null;
    function geo() { var W = api.w, H = api.h; return { x0: W * 0.14, xr: W * 0.9, sy: H * 0.64 }; }
    function pw() { return (1 - Math.cos(ph * 2.9)) / 2; }
    function base(p) { var q = geo(); return q.x0 + (q.xr - q.x0) * (0.18 + 0.78 * p); }
    function landX(p) { var q = geo(); return base(p) + wind * (q.xr - q.x0) * 0.09; }
    function round() { var q = geo(); wind = (Math.random() * 2 - 1) * 1.0; tc = q.x0 + (q.xr - q.x0) * (0.42 + Math.random() * 0.4); hw = Math.max(24, 40 - hits * 4); fly = null; ghost = null; }
    function reset() { st = 'play'; hits = 0; errs = 0; rest = 0; res = 0; round(); }
    function lanz() { if (st !== 'play' || fly || rest > 0) return; fly = { t: 0, lx: landX(pw()) }; }
    return {
      pausar: function () {},
      dbg: function () { return { st: st, hits: hits, errs: errs, p: pw(), lx: landX(pw()), tc: tc, hw: hw, fly: !!fly, rest: rest }; },
      down: function () { if (menu()) return; lanz(); },
      key: function (c, d) { if (!d) return; if (c === 'Space' || c === 'Enter') { if (st !== 'play') menu(); else lanz(); } },
      update: function (dt) {
        if (st !== 'play') return;
        ph += dt;
        if (rest > 0) { rest -= dt; if (rest <= 0) { if (hits >= NEED) st = 'win'; else if (errs >= MAXE) st = 'lose'; else round(); } return; }
        if (fly) { fly.t += dt; if (fly.t >= 1) { if (Math.abs(fly.lx - tc) <= hw) { hits++; res = 1; } else { errs++; res = -1; } ghost = fly.lx; rest = 0.9; fly = null; } }
      },
      draw: function () {
        var W = api.w, H = api.h, q = geo(), t = api.clock;
        bg('#1d2f52', '#0c1424');
        g.fillStyle = '#26364f'; g.beginPath(); g.moveTo(W * 0.62, q.sy); g.lineTo(W * 0.78, H * 0.3); g.lineTo(W * 0.88, q.sy * 0.74); g.lineTo(W * 0.96, H * 0.4); g.lineTo(W, q.sy); g.fill();
        var sg = g.createLinearGradient(0, q.sy, 0, H); sg.addColorStop(0, '#17566e'); sg.addColorStop(1, '#0a2636'); g.fillStyle = sg; g.fillRect(0, q.sy, W, H - q.sy);
        g.strokeStyle = 'rgba(255,255,255,.14)'; g.lineWidth = 1.5; for (var i = 0; i < 6; i++) { var wy = q.sy + 14 + i * 16; g.beginPath(); for (var x = 0; x <= W; x += 16) g.lineTo(x, wy + Math.sin(x * 0.04 + t * 1.4 + i) * 2.5); g.stroke(); }
        /* baía alvo */
        g.fillStyle = 'rgba(255,216,138,' + (0.22 + 0.1 * Math.sin(t * 3)) + ')'; g.fillRect(tc - hw, q.sy + 4, hw * 2, 26);
        g.strokeStyle = '#ffd88a'; g.lineWidth = 2.5; g.strokeRect(tc - hw, q.sy + 4, hw * 2, 26);
        if (ghost !== null) { g.fillStyle = res > 0 ? '#9dffb6' : '#ff8a7a'; g.beginPath(); g.arc(ghost, q.sy + 17, 7, 0, 6.29); g.fill(); }
        /* marcador sem vento + vento */
        if (st === 'play' && !fly && rest <= 0) { var mx = base(pw()); g.fillStyle = '#fff'; g.beginPath(); g.moveTo(mx, q.sy + 2); g.lineTo(mx - 8, q.sy - 12); g.lineTo(mx + 8, q.sy - 12); g.fill(); }
        /* barco */
        g.fillStyle = '#6b4a2a'; g.beginPath(); g.moveTo(q.x0 - 52, q.sy - 22); g.lineTo(q.x0 + 56, q.sy - 22); g.lineTo(q.x0 + 34, q.sy + 6); g.lineTo(q.x0 - 34, q.sy + 6); g.fill();
        g.fillStyle = '#e8d9a8'; g.fillRect(q.x0 - 4, q.sy - 78, 5, 56); g.fillStyle = '#b8352f'; g.fillRect(q.x0 - 38, q.sy - 74, 34, 30);
        /* pilar em voo */
        if (fly) { var k = Math.min(1, fly.t), px = q.x0 + 30 + (fly.lx - q.x0 - 30) * k, py = q.sy - 30 - Math.sin(Math.PI * k) * H * 0.32; g.save(); g.translate(px, py); g.rotate(k * 9); g.fillStyle = '#c28a3a'; g.fillRect(-4, -20, 8, 40); g.fillStyle = '#7a4f1c'; g.fillRect(-6, -20, 12, 6); g.restore(); }
        /* vento */
        var cx = W / 2; txt(T.vento, cx, 30, 13, '#cfe4ff'); g.strokeStyle = '#cfe4ff'; g.fillStyle = '#cfe4ff'; g.lineWidth = 3; var L2 = wind * 64; g.beginPath(); g.moveTo(cx, 46); g.lineTo(cx + L2, 46); g.stroke(); g.beginPath(); var d = L2 >= 0 ? 1 : -1; g.moveTo(cx + L2 + d * 10, 46); g.lineTo(cx + L2, 40); g.lineTo(cx + L2, 52); g.fill();
        /* barra de força */
        var bw = Math.min(W * 0.5, 320), bx = (W - bw) / 2, by = H - 30; g.fillStyle = 'rgba(255,255,255,.2)'; g.fillRect(bx, by, bw, 9); g.fillStyle = '#ffd88a'; g.fillRect(bx + bw * pw() - 3, by - 5, 6, 19);
        hud(T.h1 + ' ' + hits + '/' + NEED, T.h2 + ' ' + errs + '/' + MAXE, errs > 0);
        fim(st);
      }
    };
  }
});
