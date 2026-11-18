/* Gulating — pagar a quantia exata com fichas (invenção). */
BTJogo.registrar({
  canvas: 'jogo-gulating',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As contas do Gulating",
    "sub": "Cada rodada pede uma quantia exata. Toque nas fichas para somar até chegar nela, e toque de novo numa ficha para tirá-la. Passar da quantia conta um erro e devolve as fichas. Vença 5 rodadas com até 3 erros e em até 240 segundos.",
    "perdeu": "Foram erros demais ou o tempo acabou",
    "v1": "Todas as contas fecharam!",
    "v2": "O Gulating foi uma assembleia anual do oeste da Noruega, de cerca de 900 a 1300, e a Gulatingslova mais antiga é o registro mais antigo de lei norueguesa. As fichas são invenção.",
    "h1": "Rodadas",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The accounts of the Gulating",
    "sub": "Each round asks for an exact sum. Tap the tokens to add up to it, and tap a token again to take it back. Going over the sum counts a mistake and returns the tokens. Win 5 rounds with up to 3 mistakes and within 240 seconds.",
    "perdeu": "Too many mistakes or time ran out",
    "v1": "Every account balanced!",
    "v2": "The Gulating was a yearly assembly in western Norway, from about 900 to 1300, and the Older Gulating Law is the oldest record of Norwegian law. The tokens are invented.",
    "h1": "Rounds",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Regnskapet på Gulating",
    "sub": "Hver runde krever en nøyaktig sum. Trykk på brikkene for å legge sammen til den, og trykk på en brikke igjen for å ta den tilbake. Å gå over summen teller som en feil og gir brikkene tilbake. Vinn 5 runder med opptil 3 feil og innen 240 sekunder.",
    "perdeu": "For mange feil eller tiden tok slutt",
    "v1": "Alle regnskap gikk opp!",
    "v2": "Gulating var en årlig forsamling på Vestlandet, fra omkring 900 til 1300, og eldre Gulatingslova er den eldste skriftlige norske loven. Brikkene er oppfunnet.",
    "h1": "Runder",
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
    var ROUNDS = 5, MAXE = 3, LIM = 240;
    var vals = [], sel = [], target = 0, rd = 0, err = 0, t = 0, flash = 0, shk = 0;
    function newRound() {
      vals = []; sel = [];
      while (vals.length < 8) vals.push(1 + Math.floor(Math.random() * 12));
      var idx = [0, 1, 2, 3, 4, 5, 6, 7].sort(function () { return Math.random() - 0.5; }).slice(0, 3 + Math.floor(Math.random() * 2));
      target = idx.reduce(function (a, i) { return a + vals[i]; }, 0);
    }
    function reset() { rd = 0; err = 0; t = 0; flash = 0; shk = 0; newRound(); st = 'play'; }
    function sum() { return sel.reduce(function (a, i) { return a + vals[i]; }, 0); }
    function lay() { var W = api.w, H = api.h, r = Math.max(22, Math.min(36, (W - 40) / 9, (H - 190) / 5)); return { r: r, y0: 150 + Math.max(0, (H - 190 - r * 4.6) / 2) }; }
    function pos(i) { var L = lay(), col = i % 4, row = Math.floor(i / 4); return { x: api.w / 2 + (col - 1.5) * L.r * 2.5, y: L.y0 + row * L.r * 2.5 + L.r }; }
    function tap(i) {
      if (st !== 'play') return; var k = sel.indexOf(i);
      if (k >= 0) { sel.splice(k, 1); return; }
      sel.push(i); if (api.nota) api.nota(300 + vals[i] * 25, 0.08, 'triangle', 0.05);
      var s = sum();
      if (s === target) { rd++; flash = 0.5; if (api.nota) api.nota(520, 0.2, 'triangle', 0.07); if (rd >= ROUNDS) st = 'win'; else newRound(); }
      else if (s > target) { err++; shk = 0.35; sel = []; if (api.nota) api.nota(110, 0.25, 'sawtooth', 0.06); if (err >= MAXE) st = 'lose'; }
    }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { var ps = []; for (var i = 0; i < 8; i++) ps.push(pos(i)); return { st: st, vals: vals.slice(), sel: sel.slice(), target: target, rd: rd, err: err, t: t, pos: ps }; },
      down: function (x, y) { if (menu()) return; var L = lay(); for (var i = 0; i < 8; i++) { var p = pos(i); if (Math.abs(x - p.x) < L.r + 4 && Math.abs(y - p.y) < L.r + 4) { tap(i); return; } } },
      move: function () {}, up: function () {},
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } },
      update: function (dt) { if (flash > 0) flash -= dt; if (shk > 0) shk -= dt; if (st !== 'play') return; t += dt; if (t >= LIM) st = 'lose'; },
      draw: function () {
        var L = lay(), W = api.w, H = api.h, i; bg('#2b2418', '#0e0a05');
        txt(String(target), W / 2, 112, 44, flash > 0 ? '#fff' : '#ffd88a');
        txt(sum() + ' / ' + target, W / 2, 134, 14, '#f3ecd2');
        for (i = 0; i < 8; i++) {
          var p = pos(i), on = sel.indexOf(i) >= 0, dx = (shk > 0 && !on) ? Math.sin(shk * 60) * 3 : 0;
          g.beginPath(); g.arc(p.x + dx, p.y, L.r, 0, 6.2832); g.fillStyle = on ? '#ffd88a' : '#8a6a3a'; g.fill(); g.lineWidth = 2; g.strokeStyle = on ? '#fff' : 'rgba(0,0,0,.4)'; g.stroke();
          txt(String(vals[i]), p.x + dx, p.y + L.r * 0.33, L.r * 0.9, on ? '#2a1c0a' : '#fff');
        }
        bar(W / 2 - 110, H - 14, 220, 5, (LIM - t) / LIM, LIM - t < 40 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + rd + '/' + ROUNDS, T.h2 + ' ' + err + '/' + MAXE, true);
        fim(st);
      }
    };

  }
});
