/* Os jötnar e os deuses — travessia de rio (invenção). */
BTJogo.registrar({
  canvas: 'jogo-jotnar',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Deuses e jötnar no rio",
    "sub": "Leve os 3 deuses e os 3 jötnar para a outra margem num barco de 2 lugares. Toque numa figura da margem do barco para embarcá-la, depois toque no barco para atravessar. Em nenhuma margem, onde houver deuses, os jötnar podem ser mais numerosos que eles. Até 3 erros e 180 segundos.",
    "perdeu": "Foram erros demais ou o tempo acabou",
    "v1": "Todos chegaram à outra margem!",
    "v2": "Segundo a lista de jötnar consultada, Bestla, mãe de Odin, Fárbauti, pai de Loki, e Jörð, mãe de Thor, estão entre eles. O rio e o barco são invenção.",
    "h1": "Travessias",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Gods and jötnar at the river",
    "sub": "Take the 3 gods and the 3 jötnar to the other bank in a boat for 2. Tap a figure on the boat's bank to board it, then tap the boat to cross. On no bank where there are gods may the jötnar outnumber them. Up to 3 mistakes and 180 seconds.",
    "perdeu": "Too many mistakes or time ran out",
    "v1": "Everyone reached the other bank!",
    "v2": "In the list of jötnar consulted, Bestla, Odin's mother, Fárbauti, Loki's father, and Jörð, Thor's mother, are among them. The river and the boat are invented.",
    "h1": "Crossings",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Guder og jötnar ved elva",
    "sub": "Ta de 3 gudene og de 3 jötnene over til den andre bredden i en båt for 2. Trykk på en figur på båtens bredd for å ta den ombord, og trykk så på båten for å krysse. På ingen bredd med guder må jötnene være flere enn dem. Opptil 3 feil og 180 sekunder.",
    "perdeu": "For mange feil eller tiden tok slutt",
    "v1": "Alle kom over til den andre bredden!",
    "v2": "I listen over jötnar som er brukt, står Bestla, Odins mor, Fárbauti, Lokes far, og Jörð, Tors mor, blant dem. Elva og båten er oppfunnet.",
    "h1": "Kryssinger",
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
    var MAXE = 3, LIM = 180;
    var L = [0, 1, 2, 3, 4, 5], R = [], boat = [], side = 'L', err = 0, cr = 0, t = 0, msg = 0;
    function reset() { L = [0, 1, 2, 3, 4, 5]; R = []; boat = []; side = 'L'; err = 0; cr = 0; t = 0; msg = 0; st = 'play'; }
    function isG(id) { return id < 3; }
    function bad(bank) { var gd = bank.filter(isG).length, gi = bank.length - gd; return gd > 0 && gi > gd; }
    function geo() { var W = api.w, H = api.h, bw = W * 0.26, by = 74, bh = H - 110; return { W: W, H: H, bw: bw, by: by, bh: bh, r: Math.max(13, Math.min(24, bw / 4.2, bh / 9)) }; }
    function slot(bank, id, sideName) { var G2 = geo(), i = bank.indexOf(id), col = i % 2, row = Math.floor(i / 2), x0 = sideName === 'L' ? 0 : G2.W - G2.bw; return { x: x0 + G2.bw * (0.3 + col * 0.4), y: G2.by + 30 + row * G2.r * 2.9 + G2.r }; }
    function boatPos() { var G2 = geo(), bwid = G2.W * 0.2, x = side === 'L' ? G2.bw + 10 : G2.W - G2.bw - 10 - bwid; return { x: x, y: G2.by + G2.bh * 0.62, w: bwid, h: G2.r * 3.1 }; }
    function bslot(i) { var b = boatPos(); return { x: b.x + b.w * (0.3 + 0.4 * i), y: b.y + b.h * 0.42 }; }
    function crossBtn() { var b = boatPos(); return { x: b.x + b.w / 2, y: b.y + b.h + 26, w: Math.max(80, b.w), h: 30 }; }
    function cross() {
      if (st !== 'play' || !boat.length) return;
      var from = side === 'L' ? L : R, to = side === 'L' ? R : L, stay = from.filter(function (x) { return boat.indexOf(x) < 0; }), arr = to.concat(boat);
      if (bad(stay) || bad(arr)) { err++; msg = 1.2; boat = []; if (api.nota) api.nota(110, 0.3, 'sawtooth', 0.07); if (err >= MAXE) st = 'lose'; return; }
      if (side === 'L') { L = stay; R = arr; side = 'R'; } else { R = stay; L = arr; side = 'L'; }
      boat = []; cr++; if (api.nota) api.nota(300, 0.18, 'triangle', 0.06);
      if (R.length === 6) st = 'win';
    }
    function chars() { var out = []; L.forEach(function (id) { var p = slot(L, id, 'L'); out.push({ id: id, g: isG(id), where: 'L', x: p.x, y: p.y }); }); R.forEach(function (id) { var p = slot(R, id, 'R'); out.push({ id: id, g: isG(id), where: 'R', x: p.x, y: p.y }); }); boat.forEach(function (id, i) { var p = bslot(i); out.push({ id: id, g: isG(id), where: 'B', x: p.x, y: p.y }); }); return out; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { var cb = crossBtn(); return { st: st, L: L.slice(), R: R.slice(), boat: boat.slice(), side: side, chars: chars(), cross: cb, err: err, cr: cr, t: t }; },
      down: function (x, y) {
        if (menu()) return; if (st !== 'play') return; var G2 = geo(), cs = chars(), i, c;
        for (i = 0; i < cs.length; i++) { c = cs[i]; var rr0 = G2.r * (c.g ? 1 : 1.3) + 6; if (Math.abs(x - c.x) < rr0 && Math.abs(y - c.y) < rr0) {
          if (c.where === 'B') { boat.splice(boat.indexOf(c.id), 1); return; }
          if (c.where === side && boat.length < 2) boat.push(c.id); return; } }
        var cb = crossBtn(), b = boatPos(); if ((Math.abs(x - cb.x) < cb.w / 2 && Math.abs(y - cb.y) < cb.h / 2) || (x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h)) cross();
      },
      move: function () {}, up: function () {},
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'Space' || k === 'Enter') cross(); },
      update: function (dt) { if (msg > 0) msg -= dt; if (st !== 'play') return; t += dt; if (t >= LIM) st = 'lose'; },
      draw: function () {
        var G2 = geo(), W = G2.W, H = G2.H; bg('#12324a', '#07121c');
        g.fillStyle = '#3d5a3a'; g.fillRect(0, G2.by, G2.bw, G2.bh); g.fillRect(W - G2.bw, G2.by, G2.bw, G2.bh);
        g.fillStyle = 'rgba(120,190,255,.12)'; for (var k = 0; k < 6; k++) g.fillRect(G2.bw, G2.by + 20 + k * (G2.bh / 6), W - G2.bw * 2, 2);
        var b = boatPos(); g.fillStyle = '#8a5a2a'; rr(b.x, b.y, b.w, b.h, 10); g.fill(); g.fillStyle = 'rgba(0,0,0,.25)'; rr(b.x + 5, b.y + 6, b.w - 10, b.h - 12, 8); g.fill();
        var cb = crossBtn(); g.fillStyle = boat.length ? '#ffd88a' : 'rgba(255,255,255,.15)'; rr(cb.x - cb.w / 2, cb.y - cb.h / 2, cb.w, cb.h, 15); g.fill(); txt(side === 'L' ? '→' : '←', cb.x, cb.y + 7, 20, boat.length ? '#2a1c0a' : 'rgba(255,255,255,.4)');
        chars().forEach(function (c) {
          g.beginPath(); g.arc(c.x, c.y, G2.r * (c.g ? 1 : 1.3), 0, 6.2832); g.fillStyle = c.g ? '#f0c15a' : '#7a8ea8'; g.fill(); g.lineWidth = 2; g.strokeStyle = c.where === 'B' ? '#fff' : 'rgba(0,0,0,.35)'; g.stroke();
          if (c.g) { g.fillStyle = '#c0392b'; g.beginPath(); g.moveTo(c.x - G2.r * 0.5, c.y - G2.r * 0.55); g.lineTo(c.x, c.y - G2.r * 1.15); g.lineTo(c.x + G2.r * 0.5, c.y - G2.r * 0.55); g.closePath(); g.fill(); }
          else { g.fillStyle = '#2a3446'; g.fillRect(c.x - G2.r * 0.7, c.y - G2.r * 0.25, G2.r * 1.4, G2.r * 0.22); }
        });
        if (msg > 0) txt('✕', W / 2, 62, 22, '#ff8a7a');
        bar(W / 2 - 110, H - 14, 220, 5, (LIM - t) / LIM, LIM - t < 30 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + cr, T.h2 + ' ' + err + '/' + MAXE, true);
        fim(st);
      }
    };

  }
});
