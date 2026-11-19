/* Selkie — as focas nas rochas (invenção). */
BTJogo.registrar({
  canvas: 'jogo-selkie',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As focas das rochas",
    "sub": "Focas surgem nas rochas e somem logo. Toque na foca antes de ela sumir. Foca que some e toque numa rocha vazia contam como erros. Há um limite de erros. O tempo é limitado. São 3 rodadas, com mais focas pedidas a cada uma.",
    "perdeu": "Erros demais ou o tempo acabou",
    "v1": "Rodada vencida!",
    "v2": "Os selkies são, no folclore, focas que tiram a pele e viram gente, sobretudo nas ilhas do norte da Escócia; o nome vem do escocês \"selch\", foca-cinzenta. Tocar focas que surgem é invenção.",
    "h1": "Rodada",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The seals on the rocks",
    "sub": "Seals appear on the rocks and soon vanish. Tap a seal before it vanishes. A seal that vanishes and a tap on an empty rock count as mistakes. There is a limit of mistakes. Time is limited. There are 3 rounds, with more seals asked in each.",
    "perdeu": "Too many mistakes or time ran out",
    "v1": "Round won!",
    "v2": "Selkies are, in folklore, seals that shed their skin and become people, mostly in the Northern Isles of Scotland; the name comes from Scots \"selch\", grey seal. Tapping seals that appear is invented.",
    "h1": "Round",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Selene på skjærene",
    "sub": "Seler dukker opp på skjærene og forsvinner snart. Trykk på selen før den forsvinner. En sel som forsvinner og et trykk på et tomt skjær teller som feil. Det er en grense for feil. Tiden er begrenset. Det er 3 runder, med flere seler for hver.",
    "perdeu": "For mange feil, eller tiden tok slutt",
    "v1": "Runden er vunnet!",
    "v2": "Selkier er i folketroen seler som tar av seg skinnet og blir mennesker, særlig på de nordlige øyene av Skottland; navnet kommer fra skotsk «selch», gråsel. Å trykke på seler som dukker opp er oppfunnet.",
    "h1": "Runde",
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
    var HN = [8, 10, 12], DU = [1.5, 1.2, 1.0], IV = [0.9, 0.75, 0.65], MX = 4, LIM = 120;
    var up = [], hits = 0, need = 8, err = 0, nxt = 0.6, dur = 1.5, iv = 0.9;
    function load(i) { var k; need = HN[i]; hits = 0; dur = DU[i]; iv = IV[i]; nxt = 0.6; up = []; for (k = 0; k < 9; k++) up.push(0); }
    function reset() { lvl = 0; t = 0; pend = 0; err = 0; load(0); st = 'play'; }
    function L() { return glay(3, 3, 70, 40); }
    function pos() { var l = L(), a = [], i; for (i = 0; i < 9; i++) a.push({ x: l.x0 + (i % 3 + 0.5) * l.s, y: l.y0 + (Math.floor(i / 3) + 0.5) * l.s }); return a; }
    function bump() { err++; if (api.nota) api.nota(170, 0.12, 'sawtooth', 0.05); if (err > MX) st = 'lose'; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { var u = [], k; for (k = 0; k < 9; k++) u.push(up[k] > 0); return { st: st, lvl: lvl, pend: pend, up: u, err: err, pos: pos() }; },
      down: function (x, y) {
        if (menu()) return; if (pend > 0 || st !== 'play') return;
        var l = L(), c = Math.floor((x - l.x0) / l.s), r = Math.floor((y - l.y0) / l.s); if (c < 0 || r < 0 || c >= 3 || r >= 3) return;
        var i = r * 3 + c;
        if (up[i] > 0) { up[i] = 0; hits++; if (api.nota) api.nota(400 + hits * 25, 0.06, 'triangle', 0.05); if (hits >= need) lvlUp(); } else bump();
      },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) {
        var k, live = 0, fr = [];
        if (st === 'play' && pend <= 0) {
          for (k = 0; k < 9; k++) if (up[k] > 0) { up[k] -= dt; if (up[k] <= 0) { up[k] = 0; if (st === 'play') bump(); } }
          nxt -= dt;
          if (nxt <= 0 && st === 'play') {
            for (k = 0; k < 9; k++) { if (up[k] > 0) live++; else fr.push(k); }
            if (live < 2 && fr.length) { up[fr[Math.floor(Math.random() * fr.length)]] = dur; nxt = iv * (0.8 + Math.random() * 0.4); } else nxt = 0.1;
          }
        }
        tick(dt, load);
      },
      draw: function () {
        var l = L(), s = l.s, i; bg('#14232c', '#04090c');
        for (i = 0; i < 9; i++) {
          var cx = l.x0 + (i % 3 + 0.5) * s, cy = l.y0 + (Math.floor(i / 3) + 0.5) * s;
          g.fillStyle = '#3a4650'; g.beginPath(); g.ellipse(cx, cy + s * 0.12, s * 0.42, s * 0.3, 0, 0, 7); g.fill();
          if (up[i] > 0) {
            g.fillStyle = '#aab4bc'; g.beginPath(); g.ellipse(cx, cy, s * 0.3, s * 0.27, 0, 0, 7); g.fill();
            g.fillStyle = '#10181d'; g.beginPath(); g.arc(cx - s * 0.1, cy - s * 0.05, s * 0.04, 0, 7); g.arc(cx + s * 0.1, cy - s * 0.05, s * 0.04, 0, 7); g.arc(cx, cy + s * 0.04, s * 0.045, 0, 7); g.fill();
          }
        }
        txt(hits + ' / ' + need, api.w / 2, l.y0 - 14, 22, '#f3ecd2');
        foot(); hud(T.h1 + ' ' + Math.min(lvl + 1, NL) + '/' + NL, T.h2 + ' ' + err + '/' + (MX + 1), true); fim(st);
      }
    };

  }
});
