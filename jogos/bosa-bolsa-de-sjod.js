/* Bósa saga — a bolsa de Sjód (invenção). */
BTJogo.registrar({
  canvas: 'jogo-bosa',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A bolsa de Sjód",
    "sub": "Cada moeda tem um valor. Toque nas moedas para colocá-las na bolsa até a soma ser igual ao valor pedido, mostrado no alto. Uma moeda posta na bolsa não sai. Se a soma passar do valor, a bolsa se esvazia e você erra. Há um limite de erros. O tempo é limitado. São 3 bolsas.",
    "perdeu": "Erros demais ou o tempo acabou",
    "v1": "Bolsa cheia!",
    "v2": "Na Bósa saga ok Herrauðs, Sjód é o tesoureiro e cobrador de impostos do rei Hring, e a saga diz que a palavra \"sjóðr\", \"bolsa\", vem do nome dele. Somar moedas até um valor exato é invenção.",
    "h1": "Bolsa",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Sjód’s purse",
    "sub": "Each coin has a value. Tap coins to put them in the purse until the sum equals the requested value, shown at the top. A coin put in the purse does not come out. If the sum passes the value, the purse is emptied and you make a mistake. There is a limit of mistakes. Time is limited. There are 3 purses.",
    "perdeu": "Too many mistakes or time ran out",
    "v1": "Purse full!",
    "v2": "In Bósa saga ok Herrauðs, Sjód is the treasurer and tax collector of King Hring, and the saga says the word \"sjóðr\", \"purse\", comes from his name. Adding coins to an exact value is invented.",
    "h1": "Purse",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Sjóds pung",
    "sub": "Hver mynt har en verdi. Trykk på mynter for å legge dem i pungen til summen er lik verdien som er bedt om, vist øverst. En mynt som er lagt i pungen kommer ikke ut. Hvis summen går over verdien, tømmes pungen og du gjør en feil. Det er en grense for feil. Tiden er begrenset. Det er 3 punger.",
    "perdeu": "For mange feil, eller tiden tok slutt",
    "v1": "Pungen er full!",
    "v2": "I Bósa saga ok Herrauðs er Sjód kong Hrings skattmester og skatteoppkrever, og sagaen sier at ordet «sjóðr», «pung», kommer fra navnet hans. Å legge sammen mynter til en nøyaktig verdi er oppfunnet.",
    "h1": "Pung",
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
    function rr(x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
    function bar(x, y, w, h, f, c) { g.fillStyle = 'rgba(0,0,0,.28)'; g.fillRect(x, y, w, h); g.fillStyle = c; g.fillRect(x, y, w * Math.max(0, Math.min(1, f)), h); }
    var NL = 3, lvl = 0, t = 0, pend = 0;
    function lvlUp() { lvl++; pend = 0.9; if (api.nota) api.nota(520, 0.2, 'triangle', 0.07); }
    function tick(dt, load) { if (st !== 'play') return; t += dt; if (pend > 0) { pend -= dt; if (pend <= 0) { if (lvl >= NL) st = 'win'; else load(lvl); } } if (st === 'play' && t >= LIM) st = 'lose'; }
    function foot() { bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 60 ? '#c0392b' : '#ffd88a'); }
    function hh() { hud(T.h1 + ' ' + Math.min(lvl + 1, NL) + '/' + NL, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false); }
    function glay(R, C, top, bot) { var W = api.w, H = api.h, s = Math.min((W - 24) / C, (H - top - bot) / R, 96); return { s: s, x0: (W - s * C) / 2, y0: top + ((H - top - bot) - s * R) / 2 }; }
    function sh(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
    var NC = [6, 7, 8], KS = [3, 4, 4], MX = 1, LIM = 240;
    var val = [], taken = [], sum = 0, target = 0, sol = [], err = 0, cols = 3;
    function load(i) {
      var n = NC[i], k, a;
      cols = n <= 6 ? 3 : 4;
      for (;;) {
        val = []; for (k = 0; k < n; k++) val.push(1 + Math.floor(Math.random() * 9));
        a = []; for (k = 0; k < n; k++) a.push(k); a = sh(a); sol = a.slice(0, KS[i]); target = 0; for (k = 0; k < sol.length; k++) target += val[sol[k]];
        if (target >= 8) break;
      }
      taken = []; for (k = 0; k < n; k++) taken.push(false); sum = 0;
    }
    function reset() { lvl = 0; t = 0; pend = 0; err = 0; load(0); st = 'play'; }
    function L() { return glay(2, cols, 100, 40); }
    function pos() { var l = L(), a = [], i; for (i = 0; i < val.length; i++) a.push({ x: l.x0 + (i % cols + 0.5) * l.s, y: l.y0 + (Math.floor(i / cols) + 0.5) * l.s }); return a; }
    function tap(i) {
      if (pend > 0 || st !== 'play' || taken[i]) return;
      taken[i] = true; sum += val[i]; if (api.nota) api.nota(300 + val[i] * 40, 0.05, 'triangle', 0.04);
      if (sum === target) { lvlUp(); return; }
      if (sum > target) { err++; sum = 0; for (var k = 0; k < taken.length; k++) taken[k] = false; if (api.nota) api.nota(170, 0.12, 'sawtooth', 0.05); if (err > MX) st = 'lose'; }
    }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lvl: lvl, pend: pend, sol: sol.slice(), taken: taken.slice(), err: err, pos: pos() }; },
      down: function (x, y) { if (menu()) return; var l = L(), c = Math.floor((x - l.x0) / l.s), r = Math.floor((y - l.y0) / l.s); if (c < 0 || r < 0 || c >= cols || r >= 2) return; var i = r * cols + c; if (i < val.length) tap(i); },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) { tick(dt, load); },
      draw: function () {
        var l = L(), s = l.s, i; bg('#262010', '#0a0803');
        for (i = 0; i < val.length; i++) {
          var cx = l.x0 + (i % cols + 0.5) * s, cy = l.y0 + (Math.floor(i / cols) + 0.5) * s;
          g.fillStyle = taken[i] ? 'rgba(255,255,255,.08)' : '#d9ae48'; g.beginPath(); g.arc(cx, cy, s * 0.38, 0, 7); g.fill();
          if (!taken[i]) { g.strokeStyle = '#7a5a18'; g.lineWidth = 3; g.beginPath(); g.arc(cx, cy, s * 0.3, 0, 7); g.stroke(); }
          txt(String(val[i]), cx, cy + 1, Math.max(16, s * 0.34), taken[i] ? '#6a6050' : '#3a2a08');
        }
        txt(sum + ' / ' + target, api.w / 2, l.y0 - 14, 22, '#f3ecd2');
        foot(); hud(T.h1 + ' ' + Math.min(lvl + 1, NL) + '/' + NL, T.h2 + ' ' + err + '/' + (MX + 1), true); fim(st);
      }
    };

  }
});
