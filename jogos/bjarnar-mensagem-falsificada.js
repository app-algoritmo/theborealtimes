/* Bjarnar saga Hítdœlakappa — a mensagem falsificada (invenção). */
BTJogo.registrar({
  canvas: 'jogo-bjarnar',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A mensagem falsificada",
    "sub": "Uma mensagem foi trocada por uma sequência secreta de selos coloridos, e a mesma cor pode se repetir. Toque nas cores para montar um palpite. Ao completar, cada ponto escuro mostra um selo certo no lugar certo, e cada ponto claro, uma cor certa no lugar errado. Descubra a sequência com um número limitado de palpites. Tocar nos palpites em montagem apaga o último selo. O tempo é limitado. São 3 mensagens.",
    "perdeu": "Os palpites ou o tempo acabaram",
    "v1": "Mensagem decifrada!",
    "v2": "Na Bjarnar saga Hítdœlakappa, Þórðr falsifica a mensagem em que Björn pedia Oddný em casamento, espalha que ele morreu e casa com ela. Decifrar selos é invenção.",
    "h1": "Mensagem",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The forged message",
    "sub": "A message was swapped for a secret sequence of coloured seals, and the same colour may repeat. Tap the colours to build a guess. When it is complete, each dark dot shows a right seal in the right place, and each light dot a right colour in the wrong place. Work out the sequence within a limited number of guesses. Tapping the guess being built removes the last seal. Time is limited. There are 3 messages.",
    "perdeu": "The guesses or the time ran out",
    "v1": "Message deciphered!",
    "v2": "In Bjarnar saga Hítdœlakappa, Þórðr falsifies the message in which Björn asked for Oddný’s hand, spreads word that he has died and marries her. Deciphering seals is invented.",
    "h1": "Message",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Den forfalskede meldingen",
    "sub": "En melding er byttet ut med en hemmelig rekke av fargede segl, og den samme fargen kan gjentas. Trykk på fargene for å bygge et gjett. Når det er fullført, viser hver mørk prikk et riktig segl på riktig plass, og hver lys prikk en riktig farge på feil plass. Finn rekken med et begrenset antall gjett. Å trykke på gjettet som bygges, fjerner det siste seglet. Tiden er begrenset. Det er 3 meldinger.",
    "perdeu": "Gjettene eller tiden tok slutt",
    "v1": "Meldingen er tydet!",
    "v2": "I Bjarnar saga Hítdœlakappa forfalsker Þórðr meldingen der Björn friet til Oddný, sprer at han er død og gifter seg med henne. Å tyde segl er oppfunnet.",
    "h1": "Melding",
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
    var LEN = [4, 4, 5], NCOL = [5, 6, 6], MAXG = [8, 9, 10], LIM = 420;
    var COL = ['#e0584a', '#e8b13a', '#5fae5a', '#4a8fd8', '#a56ad6', '#e08a3a'];
    var secret = [], cur = [], rows = [], n = 4, nc = 5, mg = 8;
    function load(i) { n = LEN[i]; nc = NCOL[i]; mg = MAXG[i]; secret = []; for (var k = 0; k < n; k++) secret.push(Math.floor(Math.random() * nc)); cur = []; rows = []; }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function score(a) {
      var b = 0, w = 0, i, cs = [], ca = [];
      for (i = 0; i < nc; i++) { cs.push(0); ca.push(0); }
      for (i = 0; i < n; i++) { if (a[i] === secret[i]) b++; else { cs[secret[i]]++; ca[a[i]]++; } }
      for (i = 0; i < nc; i++) w += Math.min(cs[i], ca[i]);
      return { b: b, w: w };
    }
    function lay() {
      var W = api.w, H = api.h, ph = 52, top = 66, bot = 26, rh = Math.min(44, (H - top - bot - ph - 12) / mg), sl = rh * 0.78, pw = Math.min(54, (W - 24) / nc);
      return { rh: rh, sl: sl, top: top, py: H - bot - ph / 2, pw: pw, px0: (W - pw * nc) / 2, rx0: W / 2 - (n * sl * 1.15 + 70) / 2 };
    }
    function ppos() { var L = lay(), a = []; for (var i = 0; i < nc; i++) a.push({ x: L.px0 + (i + 0.5) * L.pw, y: L.py }); return a; }
    function pick(c) {
      if (pend > 0 || st !== 'play') return;
      cur.push(c); if (api.nota) api.nota(380 + c * 50, 0.05, 'square', 0.03);
      if (cur.length < n) return;
      var sc = score(cur); rows.push({ g: cur.slice(), b: sc.b, w: sc.w }); cur = [];
      if (sc.b === n) lvlUp(); else if (rows.length >= mg) st = 'lose';
    }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lvl: lvl, pend: pend, secret: secret.slice(), cur: cur.slice(), pos: ppos(), nc: nc }; },
      down: function (x, y) {
        if (menu()) return; if (pend > 0) return; var L = lay();
        if (y > L.py - L.pw * 0.6) { var c = Math.floor((x - L.px0) / L.pw); if (c >= 0 && c < nc) pick(c); return; }
        if (cur.length && y > L.top + rows.length * L.rh - 4 && y < L.top + (rows.length + 1) * L.rh + 4) cur.pop();
      },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) { tick(dt, load); },
      draw: function () {
        var L = lay(), i, j; bg('#1d2a38', '#0a0f16');
        for (i = 0; i < mg; i++) {
          var y = L.top + i * L.rh + L.rh / 2, row = rows[i], cu = i === rows.length;
          g.fillStyle = cu ? 'rgba(255,216,138,.10)' : 'rgba(255,255,255,.04)'; rr(L.rx0 - 8, y - L.rh / 2 + 2, n * L.sl * 1.15 + 86, L.rh - 4, 8); g.fill();
          for (j = 0; j < n; j++) {
            var x = L.rx0 + (j + 0.5) * L.sl * 1.15, v = row ? row.g[j] : (cu && cur[j] !== undefined ? cur[j] : -1);
            g.fillStyle = v >= 0 ? COL[v] : 'rgba(0,0,0,.35)'; g.beginPath(); g.arc(x, y, L.sl * 0.42, 0, 7); g.fill();
            if (v >= 0) txt(String(v + 1), x, y + 1, Math.max(10, L.sl * 0.45), '#10151c');
          }
          if (row) { var fx = L.rx0 + n * L.sl * 1.15 + 14; for (j = 0; j < n; j++) { g.fillStyle = j < row.b ? '#f3ecd2' : (j < row.b + row.w ? '#9a8f6a' : 'rgba(255,255,255,.12)'); g.beginPath(); g.arc(fx + (j % 3) * 15, y - 7 + Math.floor(j / 3) * 14, 4.5, 0, 7); g.fill(); } }
        }
        var pp = ppos(); for (i = 0; i < nc; i++) { g.fillStyle = COL[i]; g.beginPath(); g.arc(pp[i].x, pp[i].y, Math.min(20, L.pw * 0.4), 0, 7); g.fill(); txt(String(i + 1), pp[i].x, pp[i].y + 1, 16, '#10151c'); }
        txt(rows.length + '/' + mg, api.w - 40, 22, 14, '#c9b3f2');
        foot(); hh(); fim(st);
      }
    };

  }
});
