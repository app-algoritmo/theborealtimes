/* Starkaðr — o sorteio de Odin (invenção). */
BTJogo.registrar({
  canvas: 'jogo-starkad',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O sorteio de Odin",
    "sub": "Uma pedra de sorteio aparece sob um copo. Depois todos os copos descem, e eles trocam de lugar. Acompanhe com os olhos o copo da pedra e, quando os copos pararem, toque nele. Um copo errado encerra a partida. Os copos ficam mais numerosos e mais rápidos a cada rodada. São 3 rodadas.",
    "perdeu": "Você tocou no copo errado",
    "v1": "Sorteio acertado!",
    "v2": "Na Gautreks saga, Starkad é criado junto de Vikar, e o sorteio de Odin recai sobre Vikar, que é sacrificado. Esconder a pedra sob copos é invenção.",
    "h1": "Rodada",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Odin’s lots",
    "sub": "A lot-stone shows under one cup. Then all the cups come down and swap places. Follow the cup with the stone with your eyes and, when the cups stop, tap it. A wrong cup ends the game. The cups grow more numerous and faster each round. There are 3 rounds.",
    "perdeu": "You tapped the wrong cup",
    "v1": "Lot guessed right!",
    "v2": "In Gautreks saga, Starkad is raised alongside Vikar, and Odin’s lot falls on Vikar, who is sacrificed. Hiding the stone under cups is invented.",
    "h1": "Round",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Odins lodd",
    "sub": "En loddstein vises under en kopp. Så går alle koppene ned og bytter plass. Følg koppen med steinen med øynene, og trykk på den når koppene stopper. En feil kopp avslutter spillet. Koppene blir flere og raskere for hver runde. Det er 3 runder.",
    "perdeu": "Du trykket på feil kopp",
    "v1": "Loddet er gjettet riktig!",
    "v2": "I Gautreks saga blir Starkad oppdratt sammen med Vikar, og Odins lodd faller på Vikar, som blir ofret. Å skjule steinen under kopper er oppfunnet.",
    "h1": "Runde",
    "h2": "Tid"
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
    var NL = 3, lvl = 0, t = 0, pend = 0;
    function lvlUp() { lvl++; pend = 0.9; if (api.nota) api.nota(520, 0.2, 'triangle', 0.07); }
    function tick(dt, load) { if (st !== 'play') return; t += dt; if (pend > 0) { pend -= dt; if (pend <= 0) { if (lvl >= NL) st = 'win'; else load(lvl); } } if (st === 'play' && t >= LIM) st = 'lose'; }
    function foot() { bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 60 ? '#c0392b' : '#ffd88a'); }
    function hh() { hud(T.h1 + ' ' + Math.min(lvl + 1, NL) + '/' + NL, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false); }
    function glay(R, C, top, bot) { var W = api.w, H = api.h, s = Math.min((W - 24) / C, (H - top - bot) / R, 96); return { s: s, x0: (W - s * C) / 2, y0: top + ((H - top - bot) - s * R) / 2 }; }
    function sh(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
    var NC = [5, 6, 7], NSW = [6, 8, 10], SWT = [0.55, 0.42, 0.34], LIM = 240;
    var n = 5, slotOf = [], sc = 0, ph = 'show', pt = 0, swl = [], swi = 0, ca = 0, cb = 0, res = 0;
    function sx(k) { var W = api.w, sp = Math.min(96, (W - 40) / n); return (W - sp * (n - 1)) / 2 + k * sp; }
    function cy0() { return api.h * 0.55; }
    function load(i) {
      n = NC[i]; slotOf = []; for (var k = 0; k < n; k++) slotOf.push(k);
      sc = Math.floor(Math.random() * n); swl = []; for (k = 0; k < NSW[i]; k++) { var a = Math.floor(Math.random() * n), b; do { b = Math.floor(Math.random() * n); } while (b === a); swl.push([a, b]); }
      ph = 'show'; pt = 0; swi = 0; res = 0;
    }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function cupAt(slot) { for (var k = 0; k < n; k++) if (slotOf[k] === slot) return k; return -1; }
    function xOf(k) {
      if (ph === 'shuf' && swi < swl.length) {
        var u = Math.min(1, pt / SWT[Math.min(lvl, 2)]), e = u * u * (3 - 2 * u), a = swl[swi][0], b = swl[swi][1];
        if (slotOf[k] === a) return sx(a) + (sx(b) - sx(a)) * e;
        if (slotOf[k] === b) return sx(b) + (sx(a) - sx(b)) * e;
      }
      return sx(slotOf[k]);
    }
    function pos() { var a = []; for (var k = 0; k < n; k++) a.push({ x: sx(k), y: cy0() }); return a; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lvl: lvl, pend: pend, ph: ph, ans: slotOf[sc], pos: pos() }; },
      down: function (x, y) {
        if (menu()) return; if (ph !== 'pick' || pend > 0 || st !== 'play') return;
        var best = -1, bd = 1e9; for (var k = 0; k < n; k++) { var d = Math.abs(x - sx(k)); if (d < bd) { bd = d; best = k; } }
        if (bd > 60 || Math.abs(y - cy0()) > 80) return;
        var c = cupAt(best); ph = 'res'; res = 0.9;
        if (c === sc) { lvlUp(); } else { st = 'lose'; }
      },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) {
        tick(dt, load); if (st !== 'play' || pend > 0) return;
        if (ph === 'show') { pt += dt; if (pt > 1.4) { ph = 'shuf'; pt = 0; swi = 0; } }
        else if (ph === 'shuf') { pt += dt; if (pt >= SWT[Math.min(lvl, 2)]) { var a = swl[swi][0], b = swl[swi][1], ka = cupAt(a), kb = cupAt(b); slotOf[ka] = b; slotOf[kb] = a; swi++; pt = 0; if (api.nota) api.nota(200, 0.04, 'triangle', 0.03); if (swi >= swl.length) ph = 'pick'; } }
      },
      draw: function () {
        var k, y0 = cy0(); bg('#2a1f3a', '#0b0714');
        g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, y0 + 46, api.w, 6);
        for (k = 0; k < n; k++) {
          var x = xOf(k), lift = 0;
          if ((ph === 'show' && k === sc) || ph === 'res' || st === 'lose') lift = 34;
          if (k === sc && (lift > 0 || (ph === 'show'))) { g.fillStyle = '#ffd88a'; g.beginPath(); g.arc(x, y0 + 36, 12, 0, 7); g.fill(); txt('ᚨ', x, y0 + 37, 14, '#5a3a10'); }
          g.fillStyle = '#7a5a8a'; g.beginPath(); g.moveTo(x - 30, y0 + 46 - lift); g.lineTo(x - 20, y0 - 30 - lift); g.lineTo(x + 20, y0 - 30 - lift); g.lineTo(x + 30, y0 + 46 - lift); g.closePath(); g.fill();
          g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(x - 14, y0 - 24 - lift, 6, 56);
        }
        if (ph === 'pick' && st === 'play') txt('?', api.w / 2, y0 - 90, 28, '#ffd88a');
        foot(); hh(); fim(st);
      }
    };

  }
});
