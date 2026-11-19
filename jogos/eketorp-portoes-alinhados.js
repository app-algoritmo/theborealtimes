/* Eketorp — os portões alinhados (invenção). */
BTJogo.registrar({
  canvas: 'jogo-eketorp',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os portões de Eketorp",
    "sub": "Cada anel do forte tem uma abertura. Toque num anel do lado esquerdo para girá-lo um passo para a esquerda, ou do lado direito para girá-lo para a direita. Alinhe as aberturas de todos os anéis num só caminho até o centro, sem passar do número de giros. O tempo é limitado. São 3 fortes.",
    "perdeu": "Giros demais",
    "v1": "Portões alinhados!",
    "v2": "Eketorp é um forte circular de Öland, na Suécia, usado da Idade do Ferro ao século XIII. Girar anéis é invenção.",
    "h1": "Forte",
    "h2": "Giros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The gates of Eketorp",
    "sub": "Each ring of the fort has an opening. Tap a ring on its left side to turn it one step to the left, or on its right side to turn it to the right. Line up the openings of all the rings in a single path to the centre, without going over the number of turns. Time is limited. There are 3 forts.",
    "perdeu": "Too many turns",
    "v1": "Gates aligned!",
    "v2": "Eketorp is a circular fort on Öland, in Sweden, used from the Iron Age to the 13th century. Turning rings is invented.",
    "h1": "Fort",
    "h2": "Turns"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Portene i Eketorp",
    "sub": "Hver ring i borgen har en åpning. Trykk på en ring på venstre side for å vri den ett steg til venstre, eller på høyre side for å vri den til høyre. Få åpningene i alle ringene på linje i én vei inn til sentrum, uten å gå over antall vridd. Tiden er begrenset. Det er 3 borger.",
    "perdeu": "For mange vridd",
    "v1": "Portene er på linje!",
    "v2": "Eketorp er en rund borg på Öland i Sverige, brukt fra jernalderen til 1200-tallet. Å vri ringer er oppfunnet.",
    "h1": "Borg",
    "h2": "Vridd"
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
    var KK = [3, 4, 5], S = 8, LIM = 300, K = 3, gate = [], used = 0, lim = 0;
    function circ(a, b) { var d = ((a - b) % S + S) % S; return Math.min(d, S - d); }
    function optimum() { var best = 1e9, tg, i; for (tg = 0; tg < S; tg++) { var s = 0; for (i = 0; i < K; i++) s += circ(gate[i], tg); if (s < best) best = s; } return best; }
    function solved() { for (var i = 1; i < K; i++) if (gate[i] !== gate[0]) return false; return true; }
    function load(i) {
      K = KK[i]; used = 0;
      do { gate = []; for (var k = 0; k < K; k++) gate.push(Math.floor(Math.random() * S)); } while (solved() || optimum() < K + 1);
      lim = optimum() + 4;
    }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function geo() { var W = api.w, H = api.h, R0 = Math.min(W - 20, H - 120) / 2, r0 = R0 * 0.2; return { cx: W / 2, cy: 82 + (H - 82 - 30) / 2, R0: R0, r0: r0, th: (R0 - r0) / K }; }
    function pos() { var q = geo(), a = [], i; for (i = 0; i < K; i++) { var rm = q.r0 + (i + 0.5) * q.th; a.push([{ x: q.cx + rm, y: q.cy }, { x: q.cx - rm, y: q.cy }]); } return a; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lvl: lvl, pend: pend, gate: gate.slice(), S: S, K: K, used: used, lim: lim, pos: pos() }; },
      down: function (x, y) {
        if (menu()) return; if (pend > 0 || st !== 'play') return;
        var q = geo(), dx = x - q.cx, dy = y - q.cy, d = Math.sqrt(dx * dx + dy * dy);
        if (d < q.r0 || d >= q.r0 + K * q.th) return;
        var i = Math.floor((d - q.r0) / q.th); gate[i] = ((gate[i] + (dx < 0 ? -1 : 1)) % S + S) % S; used++;
        if (api.nota) api.nota(220 + i * 40, 0.06, 'triangle', 0.05);
        if (solved()) lvlUp(); else if (used >= lim) st = 'lose';
      },
      move: function () {}, up: function () {},
      key: function (kk, d) { if (d && st !== 'play') menu(); },
      update: function (dt) { tick(dt, load); },
      draw: function () {
        var q = geo(), i, j; bg('#22201c', '#090806');
        for (i = K - 1; i >= 0; i--) {
          var ri = q.r0 + i * q.th, ro = ri + q.th;
          for (j = 0; j < S; j++) {
            var a0 = (j - gate[i]) * 6.2832 / S - 1.5708 + 0.04 - 6.2832 / S * 0, a1 = a0 + 6.2832 / S - 0.08;
            a0 = (j) * 6.2832 / S - 1.5708 + 0.04; a1 = a0 + 6.2832 / S - 0.08;
            var isGate = j === gate[i];
            if (isGate) continue;
            g.fillStyle = 'hsl(' + (28 + i * 8) + ',12%,' + (34 + ((j + i) % 2) * 6) + '%)';
            g.beginPath(); g.arc(q.cx, q.cy, ro - 2, a0, a1); g.arc(q.cx, q.cy, ri + 2, a1, a0, true); g.closePath(); g.fill();
          }
          var ga = gate[i] * 6.2832 / S - 1.5708 + 3.1416 / S; g.fillStyle = '#ffd88a'; g.beginPath(); g.arc(q.cx + Math.cos(ga) * (ri + q.th / 2), q.cy + Math.sin(ga) * (ri + q.th / 2), Math.max(3, q.th * 0.12), 0, 7); g.fill();
        }
        g.fillStyle = '#4a8fb8'; g.beginPath(); g.arc(q.cx, q.cy, q.r0 * 0.8, 0, 7); g.fill();
        foot(); hud(T.h1 + ' ' + Math.min(lvl + 1, NL) + '/' + NL, T.h2 + ' ' + used + '/' + lim, true); fim(st);
      }
    };

  }
});
