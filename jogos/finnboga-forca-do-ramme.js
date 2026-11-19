/* Finnboga saga ramma — a força de Finnbogi (invenção). */
BTJogo.registrar({
  canvas: 'jogo-finnboga',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A força de Finnbogi",
    "sub": "Uma barra tem um marcador que vai e volta. Toque quando o marcador estiver dentro da zona dourada. Cada acerto estreita a zona e muda o lugar dela. Tocar fora da zona é um erro. Há um limite de erros. O tempo é limitado. São 3 provas, com mais acertos pedidos a cada uma.",
    "perdeu": "Erros demais ou o tempo acabou",
    "v1": "Prova vencida!",
    "v2": "Na Finnboga saga ramma, o imperador João I Tzimisces dá a Finnbogi o epíteto \"rammi\", \"o Forte\". Acertar o momento do golpe é invenção.",
    "h1": "Prova",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Finnbogi’s strength",
    "sub": "A bar has a marker that moves back and forth. Tap when the marker is inside the golden zone. Each hit narrows the zone and moves it. Tapping outside the zone is a mistake. There is a limit of mistakes. Time is limited. There are 3 trials, with more hits asked in each.",
    "perdeu": "Too many mistakes or time ran out",
    "v1": "Trial won!",
    "v2": "In Finnboga saga ramma, Emperor John I Tzimisces gives Finnbogi the epithet \"rammi\", \"the Strong\". Timing the blow is invented.",
    "h1": "Trial",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Finnbogis styrke",
    "sub": "En stolpe har en markør som går fram og tilbake. Trykk når markøren er inne i den gylne sonen. Hvert treff gjør sonen smalere og flytter den. Å trykke utenfor sonen er en feil. Det er en grense for feil. Tiden er begrenset. Det er 3 prøver, med flere treff for hver.",
    "perdeu": "For mange feil, eller tiden tok slutt",
    "v1": "Prøven er bestått!",
    "v2": "I Finnboga saga ramma gir keiser Johannes I Tzimiskes Finnbogi tilnavnet «rammi», «den sterke». Å time slaget er oppfunnet.",
    "h1": "Prøve",
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
    var HN = [4, 5, 6], ZW = [0.30, 0.24, 0.18], SP = [2.0, 2.4, 2.8], MX = 2, LIM = 180;
    var ph = 0, sp = 2, lo = 0.4, hi = 0.6, hits = 0, need = 4, err = 0, cd = 0, zw = 0.3, fl = 0;
    function mpos() { return 0.5 + 0.5 * Math.sin(ph); }
    function newz() { var c = 0.2 + Math.random() * 0.6; lo = c - zw / 2; hi = c + zw / 2; }
    function load(i) { need = HN[i]; hits = 0; zw = ZW[i]; sp = SP[i]; ph = Math.random() * 6; cd = 0; newz(); }
    function reset() { lvl = 0; t = 0; pend = 0; err = 0; load(0); st = 'play'; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lvl: lvl, pend: Math.max(pend, cd), m: mpos(), lo: lo, hi: hi, err: err, pos: [{ x: api.w / 2, y: api.h / 2 }] }; },
      down: function (x, y) {
        if (menu()) return; if (pend > 0 || st !== 'play' || cd > 0) return;
        var m = mpos(); cd = 0.35;
        if (m >= lo && m <= hi) { hits++; zw *= 0.92; fl = 0.2; if (api.nota) api.nota(420 + hits * 40, 0.08, 'triangle', 0.05); if (hits >= need) lvlUp(); else newz(); }
        else { err++; if (api.nota) api.nota(170, 0.12, 'sawtooth', 0.05); if (err > MX) st = 'lose'; }
      },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) { ph += dt * sp; if (cd > 0) cd -= dt; if (fl > 0) fl -= dt; tick(dt, load); },
      draw: function () {
        var W = api.w, H = api.h, bx = 40, bw = W - 80, by = H / 2 - 22, bh = 44, mx = bx + mpos() * bw; bg('#202830', '#05080b');
        g.fillStyle = 'rgba(255,255,255,.1)'; rr(bx, by, bw, bh, 10); g.fill();
        g.fillStyle = fl > 0 ? '#fff2b0' : '#d9ae48'; g.fillRect(bx + lo * bw, by, (hi - lo) * bw, bh);
        g.fillStyle = '#f3ecd2'; g.fillRect(mx - 3, by - 10, 6, bh + 20);
        txt(hits + ' / ' + need, W / 2, by + bh + 40, 22, '#f3ecd2');
        foot(); hud(T.h1 + ' ' + Math.min(lvl + 1, NL) + '/' + NL, T.h2 + ' ' + err + '/' + (MX + 1), true); fim(st);
      }
    };

  }
});
