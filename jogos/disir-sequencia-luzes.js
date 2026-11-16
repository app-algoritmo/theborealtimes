/* As dísir, espíritos femininos — repita a sequência de luzes (invenção). */
BTJogo.registrar({
  canvas: 'jogo-disir',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As luzes das dísir",
    "sub": "Veja a sequência de luzes e repita-a tocando nas luzes na mesma ordem. A cada rodada a sequência fica uma luz mais longa. Chegue à rodada 8 sem errar, com 6 segundos por toque e 120 segundos no total. (Teclado: teclas 1 a 4.)",
    "perdeu": "Errou a sequência ou o tempo acabou",
    "v1": "A sequência está completa!",
    "v2": "As dísir são espíritos femininos ligados ao destino, e o dísablót era um sacrifício em sua honra. As luzes são invenção.",
    "h1": "Rodada",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The dísir's lights",
    "sub": "Watch the sequence of lights and repeat it by tapping the lights in the same order. Each round the sequence grows by one light. Reach round 8 without a mistake, with 6 seconds per tap and 120 seconds in all. (Keyboard: keys 1 to 4.)",
    "perdeu": "Wrong sequence or time ran out",
    "v1": "The sequence is complete!",
    "v2": "The dísir are female spirits tied to fate, and the dísablót was a sacrifice in their honour. The lights are invented.",
    "h1": "Round",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Dísenes lys",
    "sub": "Se på rekken av lys og gjenta den ved å trykke på lysene i samme rekkefølge. For hver runde blir rekken ett lys lengre. Nå runde 8 uten feil, med 6 sekunder per trykk og 120 sekunder til sammen. (Tastatur: tast 1 til 4.)",
    "perdeu": "Feil rekke eller tiden tok slutt",
    "v1": "Rekken er fullført!",
    "v2": "Dísene er kvinnelige ånder knyttet til skjebnen, og dísablót var en ofring til deres ære. Lysene er oppfunnet.",
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
    var SEQN = 8, LIM = 120, TIN = 6;
    var COLS = ['#c0563f', '#d9a93a', '#4a98b8', '#4b8a4b'], BR = ['#ff9a8d', '#fff0a8', '#9fe0ff', '#a8f0a0'], TONES = [262, 330, 392, 523];
    var seq = [], round = 1, phase = 'pause', idx = 0, showI = 0, tmr = 0, lit = -1, litT = 0, t = 0, inT = 0;
    function lay() { var W = api.w, H = api.h, ps = Math.max(70, Math.min((W - 40) / 2, (H - 150) / 2, 170)), gp = 14, x0 = (W - ps * 2 - gp) / 2, y0 = Math.max(76, (H - ps * 2 - gp) / 2 + 14); return { ps: ps, gp: gp, x0: x0, y0: y0 }; }
    function pos(i) { var L = lay(); return { x: L.x0 + (i % 2) * (L.ps + L.gp) + L.ps / 2, y: L.y0 + Math.floor(i / 2) * (L.ps + L.gp) + L.ps / 2 }; }
    function reset() { seq = []; for (var i = 0; i < SEQN; i++) seq.push(Math.floor(Math.random() * 4)); round = 1; phase = 'pause'; tmr = 0.8; showI = 0; idx = 0; lit = -1; litT = 0; t = 0; inT = TIN; st = 'play'; }
    function flash(p) { lit = p; litT = 0.28; if (api.nota) api.nota(TONES[p], 0.25, 'sine', 0.07); }
    function press(p) {
      if (st !== 'play' || phase !== 'input') return; flash(p);
      if (p !== seq[idx]) { st = 'lose'; if (api.nota) api.nota(100, 0.4, 'sawtooth', 0.07); return; }
      idx++; inT = TIN;
      if (idx >= round) { round++; if (round > SEQN) st = 'win'; else { phase = 'pause'; tmr = 0.7; } }
    }
    function at(x, y) { var L = lay(); for (var i = 0; i < 4; i++) { var p = pos(i); if (Math.abs(x - p.x) < L.ps / 2 && Math.abs(y - p.y) < L.ps / 2) return i; } return -1; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, phase: phase, seq: seq.slice(), idx: idx, round: round, t: t, pads: [0, 1, 2, 3].map(pos) }; },
      down: function (x, y) { if (menu()) return; var i = at(x, y); if (i >= 0) press(i); },
      move: function () {}, up: function () {},
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } var m = { Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3, Numpad1: 0, Numpad2: 1, Numpad3: 2, Numpad4: 3 }[k]; if (m !== undefined) press(m); },
      update: function (dt) {
        if (litT > 0) { litT -= dt; if (litT <= 0) lit = -1; }
        if (st !== 'play') return; t += dt; if (t >= LIM) { st = 'lose'; return; }
        if (phase === 'pause') { tmr -= dt; if (tmr <= 0) { phase = 'show'; showI = 0; tmr = 0; } }
        else if (phase === 'show') {
          tmr -= dt;
          if (tmr <= 0) { if (showI < round) { var on = Math.max(0.28, 0.5 - round * 0.025); flash(seq[showI]); litT = on; showI++; tmr = on + 0.18; } else { phase = 'input'; idx = 0; inT = TIN; } }
        } else if (phase === 'input') { inT -= dt; if (inT <= 0) st = 'lose'; }
      },
      draw: function () {
        var L = lay(), i;
        bg('#1f2a44', '#0a0f1c');
        for (i = 0; i < 4; i++) {
          var p = pos(i), on = lit === i; g.fillStyle = on ? BR[i] : COLS[i]; g.globalAlpha = on ? 1 : 0.62; rr(p.x - L.ps / 2, p.y - L.ps / 2, L.ps, L.ps, 18); g.fill(); g.globalAlpha = 1;
          txt(String(i + 1), p.x, p.y + 10, 30, on ? '#222' : 'rgba(255,255,255,.55)');
        }
        if (st === 'play' && phase === 'input') bar(api.w / 2 - 80, L.y0 - 18, 160, 5, inT / TIN, inT < 2 ? '#c0392b' : '#6fd3a0');
        bar(api.w / 2 - 110, api.h - 14, 220, 5, (LIM - t) / LIM, LIM - t < 20 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + Math.min(round, SEQN) + '/' + SEQN, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };
  }
});
