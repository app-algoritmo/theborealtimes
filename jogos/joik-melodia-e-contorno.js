/* Joik — a melodia e o contorno (invenção). */
BTJogo.registrar({
  canvas: 'jogo-joik',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Ouça e reconheça",
    "sub": "Toque no alto-falante para ouvir uma melodia curta. Depois toque na linha que desenha o sobe e desce dos sons dessa mesma melodia. Em cada etapa, acerte duas melodias. Com três erros o jogo acaba. São 3 etapas.",
    "perdeu": "Muitos erros",
    "v1": "Melodias reconhecidas!",
    "v2": "O joik é um canto sámi que evoca uma pessoa, um animal ou um lugar. As melodias deste jogo são inventadas.",
    "h1": "Etapa",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Listen and recognise",
    "sub": "Tap the speaker to hear a short melody. Then tap the line that draws the rise and fall of the sounds of that same melody. In each stage, get two melodies right. With three mistakes the game ends. There are 3 stages.",
    "perdeu": "Too many mistakes",
    "v1": "Melodies recognised!",
    "v2": "The joik is a Sámi song that evokes a person, an animal or a place. The melodies in this game are invented.",
    "h1": "Stage",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Lytt og kjenn igjen",
    "sub": "Trykk på høyttaleren for å høre en kort melodi. Trykk så på linjen som tegner stigningen og fallet i lydene i den samme melodien. I hvert trinn skal du få to melodier riktige. Med tre feil er spillet slutt. Det er 3 trinn.",
    "perdeu": "For mange feil",
    "v1": "Melodiene er kjent igjen!",
    "v2": "Joik er en samisk sang som kaller fram en person, et dyr eller et sted. Melodiene i dette spillet er oppfunnet.",
    "h1": "Trinn",
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
    var LIM = 300, FR = [262, 294, 330, 392, 440], NEED = 2, MAXE = 3;
    var err = 0, got = 0, n = 4, seq = [], opts = [], ans = 0, playing = false, qi = 0, qt = 0, flash = -1, flashT = 0, heard = false;
    function sgn(a) { var s = '', i; for (i = 1; i < a.length; i++) s += a[i] > a[i - 1] ? 'u' : a[i] < a[i - 1] ? 'd' : 's'; return s; }
    function rndSeq(len) { for (;;) { var a = [], i, seen = {}, dist = 0; for (i = 0; i < len; i++) { var v = Math.floor(Math.random() * 5); a.push(v); if (!seen[v]) { seen[v] = 1; dist++; } } if (dist >= 3) return a; } }
    function play() { playing = true; qi = 0; qt = 0.5; heard = true; }
    function newRound() {
      seq = rndSeq(n); var list = [seq], pats = [sgn(seq)], tries = 0;
      while (list.length < 3 && tries++ < 400) { var c = rndSeq(n), p = sgn(c); if (pats.indexOf(p) < 0) { pats.push(p); list.push(c); } }
      while (list.length < 3) list.push(rndSeq(n));
      var idx = sh([0, 1, 2]); opts = idx.map(function (k) { return list[k]; }); ans = idx.indexOf(0);
      flash = -1; play(); qt = 0.1;
    }
    function load(i) { n = 4 + i; got = 0; newRound(); }
    function reset() { lvl = 0; t = 0; pend = 0; err = 0; playing = false; load(0); st = 'play'; }
    function cards() {
      var W = api.w, H = api.h, r = [], i;
      if (W > H * 1.25) { var cw = Math.min((W - 60) / 3, 230), ch = Math.min(H - 190, 200); for (i = 0; i < 3; i++) r.push({ x: W / 2 - cw * 1.5 - 10 + i * (cw + 10), y: 150 + (H - 150 - 30 - ch) / 2, w: cw, h: ch }); }
      else { var ch2 = Math.min((H - 200 - 40) / 3, 150), cw2 = Math.min(W - 40, 360); for (i = 0; i < 3; i++) r.push({ x: (W - cw2) / 2, y: 160 + i * (ch2 + 12), w: cw2, h: ch2 }); }
      return r;
    }
    function spk() { return { x: api.w / 2, y: 92, r: 32 }; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { var c = cards(); return { st: st, lvl: lvl, pend: pend, err: err, ans: ans, pos: c.map(function (k) { return { x: k.x + k.w / 2, y: k.y + k.h / 2 }; }) }; },
      down: function (x, y) {
        if (menu()) return; if (pend > 0 || st !== 'play') return;
        var s = spk(); if ((x - s.x) * (x - s.x) + (y - s.y) * (y - s.y) <= 46 * 46) { play(); return; }
        var c = cards(), i;
        for (i = 0; i < 3; i++) if (x >= c[i].x && x <= c[i].x + c[i].w && y >= c[i].y && y <= c[i].y + c[i].h) {
          if (i === ans) { got++; flash = i; flashT = 0.4; if (got >= NEED) lvlUp(); else newRound(); }
          else { err++; flash = i; flashT = 0.4; if (api.nota) api.nota(150, 0.25, 'sawtooth', 0.05); if (err >= MAXE) st = 'lose'; }
          return;
        }
      },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) {
        if (flashT > 0) flashT -= dt;
        if (playing && st === 'play') { qt += dt; if (qt >= 0.55) { qt = 0; if (qi < n) { if (api.nota) api.nota(FR[seq[qi]], 0.42, 'sine', 0.09); qi++; } else playing = false; } }
        tick(dt, load);
      },
      draw: function () {
        var W = api.w, H = api.h, s = spk(), c = cards(), i, k; bg('#1a2630', '#060a0e');
        var pulse = playing ? 1 + 0.08 * Math.sin(api.clock * 14) : 1;
        g.fillStyle = playing ? '#ffd88a' : '#d9ae48'; g.beginPath(); g.arc(s.x, s.y, s.r * pulse, 0, 7); g.fill();
        g.fillStyle = '#2a1d08'; g.beginPath(); g.moveTo(s.x - 12, s.y - 6); g.lineTo(s.x - 4, s.y - 6); g.lineTo(s.x + 5, s.y - 14); g.lineTo(s.x + 5, s.y + 14); g.lineTo(s.x - 4, s.y + 6); g.lineTo(s.x - 12, s.y + 6); g.closePath(); g.fill();
        g.strokeStyle = '#2a1d08'; g.lineWidth = 3; g.beginPath(); g.arc(s.x + 6, s.y, 9, -0.9, 0.9); g.stroke(); g.beginPath(); g.arc(s.x + 6, s.y, 16, -0.9, 0.9); g.stroke();
        for (i = 0; i < n; i++) { g.fillStyle = i < qi ? '#ffd88a' : 'rgba(255,255,255,.2)'; g.beginPath(); g.arc(W / 2 - (n - 1) * 9 + i * 18, s.y + 48, 4, 0, 7); g.fill(); }
        for (i = 0; i < 3; i++) {
          var r = c[i], col = flash === i && flashT > 0 ? (i === ans ? 'rgba(120,200,110,.45)' : 'rgba(220,90,70,.45)') : 'rgba(255,255,255,.09)';
          g.fillStyle = col; rr(r.x, r.y, r.w, r.h, 12); g.fill();
          var pd = Math.min(22, r.h * 0.18); g.strokeStyle = '#ffd88a'; g.lineWidth = 3; g.beginPath();
          for (k = 0; k < n; k++) { var px = r.x + pd + k * (r.w - 2 * pd) / (n - 1), py = r.y + r.h - pd - opts[i][k] * (r.h - 2 * pd) / 4; if (k === 0) g.moveTo(px, py); else g.lineTo(px, py); }
          g.stroke(); g.fillStyle = '#f3ecd2';
          for (k = 0; k < n; k++) { g.beginPath(); g.arc(r.x + pd + k * (r.w - 2 * pd) / (n - 1), r.y + r.h - pd - opts[i][k] * (r.h - 2 * pd) / 4, 4.5, 0, 7); g.fill(); }
        }
        foot(); hud(T.h1 + ' ' + Math.min(lvl + 1, NL) + '/' + NL, T.h2 + ' ' + err + '/' + MAXE, true); fim(st);
      }
    };

  }
});
