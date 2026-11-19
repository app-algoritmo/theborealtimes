/* Seiðr — o fio (invenção). */
BTJogo.registrar({
  canvas: 'jogo-seidr',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O fio do seiðr",
    "sub": "Há vários fios de contas. Na sua vez, toque numa conta para tirar essa conta e todas as que estão à direita dela, no mesmo fio. Depois joga o adversário, que também tira contas de um fio só. Quem tirar a última conta vence. O tempo é limitado. São 3 rodadas, com mais fios a cada uma.",
    "perdeu": "O adversário tirou a última conta, ou o tempo acabou",
    "v1": "Última conta sua!",
    "v2": "Seiðr é uma prática de magia nórdica; a palavra é glosada como \"corda, fio, laço\", e quem a praticava segurava uma roca ritual. Tirar contas de fios é invenção.",
    "h1": "Rodada",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The thread of seiðr",
    "sub": "There are several threads of beads. On your turn, tap a bead to take that bead and all those to its right, on the same thread. Then the opponent plays, also taking beads from a single thread. Whoever takes the last bead wins. Time is limited. There are 3 rounds, with more threads each time.",
    "perdeu": "The opponent took the last bead, or time ran out",
    "v1": "The last bead is yours!",
    "v2": "Seiðr is a Norse magic practice; the word is glossed as \"cord, string, snare\", and its practitioner held a ritual distaff. Taking beads from threads is invented.",
    "h1": "Round",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Seiðr-tråden",
    "sub": "Det er flere perlerekker. Når det er din tur, trykker du på en perle for å ta den og alle perlene til høyre for den, på samme rekke. Så spiller motstanderen, som også tar perler fra én rekke. Den som tar den siste perlen, vinner. Tiden er begrenset. Det er 3 runder, med flere rekker for hver.",
    "perdeu": "Motstanderen tok den siste perlen, eller tiden tok slutt",
    "v1": "Den siste perlen er din!",
    "v2": "Seiðr er en nordisk magisk praksis; ordet gjengis som «snor, tråd, snare», og utøveren holdt en rituell rokk. Å ta perler fra rekker er oppfunnet.",
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
    var PL = [3, 4, 4], MXP = 6, LIM = 240;
    var p = [], ai = 0;
    function xr(a) { var x = 0, i; for (i = 0; i < a.length; i++) x ^= a[i]; return x; }
    function total() { var s = 0, i; for (i = 0; i < p.length; i++) s += p[i]; return s; }
    function load(i) { var k; do { p = []; for (k = 0; k < PL[i]; k++) p.push(1 + Math.floor(Math.random() * MXP)); } while (xr(p) === 0); ai = 0; }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function aiMove() {
      var x = xr(p), r, k, c = [];
      if (x > 0) { for (r = 0; r < p.length; r++) if ((p[r] ^ x) < p[r]) { p[r] = p[r] ^ x; break; } }
      else { for (r = 0; r < p.length; r++) if (p[r] > 0) c.push(r); r = c[Math.floor(Math.random() * c.length)]; p[r] -= 1 + Math.floor(Math.random() * p[r]); }
      if (api.nota) api.nota(240, 0.08, 'square', 0.04);
      if (total() === 0) st = 'lose';
    }
    function L() { return glay(p.length, MXP, 70, 40); }
    function pos() { var l = L(), a = [], r, k; for (r = 0; r < p.length; r++) { var row = []; for (k = 0; k < p[r]; k++) row.push({ x: l.x0 + (k + 0.5) * l.s, y: l.y0 + (r + 0.5) * l.s }); a.push(row); } return a; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lvl: lvl, pend: Math.max(pend, ai), p: p.slice(), pos: pos() }; },
      down: function (x, y) {
        if (menu()) return; if (pend > 0 || ai > 0 || st !== 'play') return;
        var l = L(), c = Math.floor((x - l.x0) / l.s), r = Math.floor((y - l.y0) / l.s);
        if (c < 0 || r < 0 || r >= p.length || c >= p[r]) return;
        p[r] = c; if (api.nota) api.nota(420, 0.05, 'triangle', 0.04);
        if (total() === 0) lvlUp(); else ai = 0.7;
      },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) { if (ai > 0 && st === 'play') { ai -= dt; if (ai <= 0) aiMove(); } tick(dt, load); },
      draw: function () {
        var l = L(), s = l.s, r, k; bg('#1a1628', '#07050d');
        for (r = 0; r < p.length; r++) {
          g.strokeStyle = 'rgba(201,179,242,.35)'; g.lineWidth = 3; g.beginPath(); g.moveTo(l.x0, l.y0 + (r + 0.5) * s); g.lineTo(l.x0 + MXP * s, l.y0 + (r + 0.5) * s); g.stroke();
          for (k = 0; k < p[r]; k++) { g.fillStyle = 'hsl(' + (r * 70 + 20) + ',60%,62%)'; g.beginPath(); g.arc(l.x0 + (k + 0.5) * s, l.y0 + (r + 0.5) * s, s * 0.34, 0, 7); g.fill(); }
        }
        foot(); hh(); fim(st);
      }
    };

  }
});
