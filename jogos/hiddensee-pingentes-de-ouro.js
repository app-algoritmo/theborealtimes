/* Hiddensee — os pingentes (invenção). */
BTJogo.registrar({
  canvas: 'jogo-hiddensee',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os pingentes de Hiddensee",
    "sub": "Cada tubo guarda peças coloridas, e cabem 4 em cada um. Toque num tubo e depois em outro para mover a peça de cima do primeiro para o segundo. A peça só entra num tubo vazio ou sobre uma peça da mesma cor, e se houver espaço. Deixe cada tubo com uma cor só, ou vazio, sem passar do número de movimentos mostrado no alto. O tempo é limitado. São 3 mesas.",
    "perdeu": "Movimentos demais ou o tempo acabou",
    "v1": "Peças separadas!",
    "v2": "Em 1873, depois de cheias, foram achados na ilha alemã de Hiddensee 16 pendentes, um broche e um colar, todos de ouro, do século X. Os pendentes combinam o martelo de Thor e a cruz. Separar peças por cor é invenção.",
    "h1": "Mesa",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The Hiddensee pendants",
    "sub": "Each tube holds coloured pieces, and 4 fit in each. Tap a tube, then another, to move the top piece of the first onto the second. A piece can enter only an empty tube or land on a piece of the same colour, and only if there is room. Leave every tube with a single colour, or empty, without passing the number of moves shown at the top. Time is limited. There are 3 tables.",
    "perdeu": "Too many moves or time ran out",
    "v1": "Pieces sorted!",
    "v2": "In 1873, after floods, 16 pendants, a brooch and a neck ring, all of gold and from the 10th century, were found on the German island of Hiddensee. The pendants combine Thor’s hammer and the cross. Sorting pieces by colour is invented.",
    "h1": "Table",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Hiddensee-anheng",
    "sub": "Hvert rør rommer fargede brikker, og det er plass til 4 i hvert. Trykk på et rør og så på et annet for å flytte den øverste brikken fra det første til det andre. En brikke kan bare gå i et tomt rør eller oppå en brikke av samme farge, og bare hvis det er plass. La hvert rør ha én farge, eller være tomt, uten å gå over antall trekk som vises øverst. Tiden er begrenset. Det er 3 bord.",
    "perdeu": "For mange trekk, eller tiden tok slutt",
    "v1": "Brikkene er sortert!",
    "v2": "I 1873, etter flom, ble 16 anheng, en brosje og en halsring, alle av gull og fra 900-tallet, funnet på den tyske øya Hiddensee. Anhengene kombinerer Thors hammer og korset. Å sortere brikker etter farge er oppfunnet.",
    "h1": "Bord",
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
    var CC = [4, 5, 6], CAP = 4, LIM = 300;
    var COL = ['#e85a5a', '#5ab0e8', '#7ed06a', '#f0c850', '#b07ae8', '#f08ac0'];
    var tubes = [], sol = [], sel = -1, k0 = 0, nT = 6, mv = 0, bud = 0;
    function top(a) { return a.length ? a[a.length - 1] : -1; }
    function can(tb, a, b) { return a !== b && tb[a].length > 0 && tb[b].length < CAP && (tb[b].length === 0 || top(tb[b]) === top(tb[a])); }
    function isSolved(tb) { var i, j; for (i = 0; i < tb.length; i++) { if (tb[i].length === 0) continue; if (tb[i].length !== CAP) return false; for (j = 1; j < CAP; j++) if (tb[i][j] !== tb[i][0]) return false; } return true; }
    function gen(c) {
      var k, j, a, b, x, tb, list, tries, s, i, cp, okk;
      nT = c + 2;
      for (;;) {
        tb = []; for (k = 0; k < nT; k++) tb.push([]); for (k = 0; k < c; k++) for (j = 0; j < CAP; j++) tb[k].push(k);
        list = []; tries = 0;
        while (list.length < c * 14 && tries++ < 6000) {
          a = Math.floor(Math.random() * nT); b = Math.floor(Math.random() * nT);
          if (a === b || tb[a].length === 0 || tb[b].length >= CAP) continue;
          x = top(tb[a]); if (!(tb[a].length === 1 || tb[a][tb[a].length - 2] === x)) continue;
          tb[a].pop(); tb[b].push(x); list.push([b, a]);
        }
        if (isSolved(tb)) continue;
        var dis = 0; for (i = 0; i < nT; i++) for (j = 1; j < tb[i].length; j++) if (tb[i][j] !== tb[i][j - 1]) dis++;
        if (dis < c * 2) continue;
        s = list.slice().reverse(); cp = []; for (i = 0; i < nT; i++) cp.push(tb[i].slice()); okk = true;
        for (i = 0; i < s.length; i++) { if (!can(cp, s[i][0], s[i][1])) { okk = false; break; } cp[s[i][1]].push(cp[s[i][0]].pop()); }
        if (okk && isSolved(cp)) { tubes = tb; sol = s; return; }
      }
    }
    function load(i) { gen(CC[i]); sel = -1; k0 = 0; mv = 0; bud = sol.length + 4; }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function L() { return glay(CAP, nT, 80, 40); }
    function pos() { var l = L(), a = [], i; for (i = 0; i < nT; i++) a.push({ x: l.x0 + (i + 0.5) * l.s, y: l.y0 + CAP * l.s / 2 }); return a; }
    function tap(i) {
      if (pend > 0 || st !== 'play') return;
      if (sel < 0) { if (tubes[i].length) sel = i; return; }
      if (sel === i) { sel = -1; return; }
      if (can(tubes, sel, i)) {
        if (k0 < sol.length && sol[k0][0] === sel && sol[k0][1] === i) k0++;
        tubes[i].push(tubes[sel].pop()); sel = -1; if (api.nota) api.nota(360, 0.05, 'triangle', 0.04);
        mv++; if (isSolved(tubes)) lvlUp(); else if (mv >= bud) st = 'lose';
      } else sel = tubes[i].length ? i : -1;
    }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lvl: lvl, pend: pend, sol: sol.slice(), k: k0, sel: sel, pos: pos() }; },
      down: function (x, y) { if (menu()) return; var l = L(), c = Math.floor((x - l.x0) / l.s); if (c < 0 || c >= nT || y < l.y0 - 10 || y > l.y0 + CAP * l.s + 10) return; tap(c); },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) { tick(dt, load); },
      draw: function () {
        var l = L(), s = l.s, i, j; bg('#2a2410', '#0a0803');
        for (i = 0; i < nT; i++) {
          var x = l.x0 + i * s, y = l.y0;
          g.strokeStyle = sel === i ? '#ffd88a' : 'rgba(243,236,210,.4)'; g.lineWidth = sel === i ? 4 : 2; rr(x + s * 0.18, y, s * 0.64, CAP * s, 12); g.stroke();
          for (j = 0; j < tubes[i].length; j++) { g.fillStyle = COL[tubes[i][j]]; g.beginPath(); g.arc(x + s / 2, y + (CAP - 1 - j + 0.5) * s, s * 0.27, 0, 7); g.fill(); }
        }
        txt(mv + ' / ' + bud, api.w / 2, l.y0 - 14, 20, mv >= bud - 4 ? '#ff9a8d' : '#f3ecd2');
        foot(); hh(); fim(st);
      }
    };

  }
});
