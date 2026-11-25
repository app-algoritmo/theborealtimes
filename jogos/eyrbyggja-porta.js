/* Os acusados à porta — descubra a ordem certa dos quatro acusados. */
BTJogo.registrar({
  canvas: 'jogo-eyrbyggja',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os acusados à porta",
    "sub": "Quatro dos seis acusados esperam à porta, numa ordem secreta. Toque nos rostos para montar um palpite (ou use as teclas 1 a 6) e confirme. Pino dourado: certo e no lugar certo. Pino claro: certo, mas no lugar errado. Descubra a ordem em 8 tentativas.",
    "perdeu": "O tribunal se encerrou sem resposta",
    "v1": "A ordem foi descoberta!",
    "v2": "Na Saga de Eyrbyggja, o tribunal da porta julgou os mortos que voltavam à casa de Fróðá. Os acusados do jogo são invenção.",
    "h1": "Certos",
    "h2": "Tentativas",
    "ok": "OK"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The accused at the door",
    "sub": "Four of the six accused wait at the door, in a secret order. Tap the faces to build a guess (or use keys 1 to 6) and confirm. Gold pin: right one in the right place. Pale pin: right one, wrong place. Find the order in 8 tries.",
    "perdeu": "The court closed without an answer",
    "v1": "The order is found!",
    "v2": "In the Eyrbyggja saga, the door court judged the dead who returned to the farm at Fróðá. The accused in the game are made up.",
    "h1": "Correct",
    "h2": "Tries",
    "ok": "OK"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "De anklagede ved døra",
    "sub": "Fire av de seks anklagede venter ved døra, i en hemmelig rekkefølge. Trykk på ansiktene for å lage et gjett (eller bruk tastene 1 til 6) og bekreft. Gull-pinne: riktig og på riktig plass. Lys pinne: riktig, men feil plass. Finn rekkefølgen på 8 forsøk.",
    "perdeu": "Retten ble hevet uten svar",
    "v1": "Rekkefølgen er funnet!",
    "v2": "I Eyrbyggja saga dømte dørretten de døde som vendte tilbake til gården på Fróðá. De anklagede i spillet er diktet opp.",
    "h1": "Riktige",
    "h2": "Forsøk",
    "ok": "OK"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "Los acusados a la puerta",
    "sub": "Cuatro de los seis acusados esperan a la puerta, en un orden secreto. Toca los rostros para formar una apuesta (o usa las teclas del 1 al 6) y confírmala. Clavija dorada: acierto y en el lugar correcto. Clavija clara: acierto, pero en el lugar equivocado. Descubre el orden en 8 intentos.",
    "perdeu": "El tribunal se cerró sin respuesta",
    "v1": "¡Descubriste el orden!",
    "v2": "En la Saga de Eyrbyggja, el tribunal de la puerta juzgó a los muertos que volvían a la casa de Fróðá. Los acusados del juego son invención.",
    "h1": "Aciertos",
    "h2": "Intentos",
    "ok": "OK"
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
    var NS = 6, NP = 4, MAXT = 8, LIM = 240, COL = ['#e0503a', '#f0a030', '#e8d44a', '#5ac07a', '#4aa0e0', '#a070d0'];
    var code = [], rows = [], cur = [], tmr = LIM, best = 0, pop = 0, shake = 0;
    function lay() { var W = api.w, H = api.h, rh = Math.min(36, (H - 190) / MAXT), s = Math.min(rh * 0.85, 30), pw = Math.min(W / 7.5, 58); return { rh: rh, s: s, bx: W / 2 - 90, y0: 72, pw: pw, py: 72 + MAXT * rh + 18 }; }
    function slotXY(r, k) { var L = lay(); return { x: L.bx + k * (L.s + 8) + L.s / 2, y: L.y0 + r * L.rh + L.rh / 2 }; }
    function palXY(i) { var L = lay(), W = api.w; return { x: W / 2 - (NS * L.pw) / 2 + i * L.pw + L.pw / 2, y: L.py + L.pw / 2 }; }
    function okXY() { var L = lay(); return { x: slotXY(rows.length, 3).x + L.s + 40, y: slotXY(rows.length, 0).y }; }
    function setup() { var a = [0, 1, 2, 3, 4, 5]; for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } code = a.slice(0, NP); rows = []; cur = []; tmr = LIM; best = 0; shake = 0; }
    function reset() { setup(); st = 'play'; }
    function score(gs, cd) { var ex = 0, co = 0, i; for (i = 0; i < NP; i++) { if (gs[i] === cd[i]) ex++; else if (cd.indexOf(gs[i]) >= 0) co++; } return [ex, co]; }
    function add(i) { if (st !== 'play' || cur.length >= NP || cur.indexOf(i) >= 0) return; cur.push(i); if (api.nota) api.nota(300 + i * 40, 0.06, 'triangle', 0.05); }
    function submit() {
      if (st !== 'play' || cur.length < NP) return; var sc = score(cur, code); rows.push({ g: cur.slice(), ex: sc[0], co: sc[1] }); best = sc[0]; cur = [];
      if (sc[0] === NP) st = 'win'; else if (rows.length >= MAXT) st = 'lose'; else if (api.nota) api.nota(220, 0.08, 'square', 0.04);
    }
    setup();
    return {
      pausar: function () {},
      dbg: function () { return { st: st, code: code.slice(), rows: rows.map(function (r) { return { g: r.g.slice(), ex: r.ex, co: r.co }; }), cur: cur.slice(), tries: rows.length }; },
      down: function (x, y) {
        if (menu()) return;
        var L = lay(), i, p;
        for (i = 0; i < NS; i++) { p = palXY(i); if (Math.abs(x - p.x) < L.pw / 2 && Math.abs(y - p.y) < L.pw / 2) { add(i); return; } }
        for (i = 0; i < cur.length; i++) { p = slotXY(rows.length, i); if (Math.abs(x - p.x) < L.s && Math.abs(y - p.y) < L.rh / 2) { cur.splice(i, 1); return; } }
        if (cur.length === NP) { p = okXY(); if (Math.abs(x - p.x) < 44 && Math.abs(y - p.y) < L.rh) submit(); }
      },
      key: function (c, d) {
        if (!d) return; if (st !== 'play') { menu(); return; }
        var m = /^Digit([1-6])$/.exec(c); if (m) { add(+m[1] - 1); return; }
        if (c === 'Backspace' || c === 'Delete') cur.pop(); else if (c === 'Enter' || c === 'Space') submit();
      },
      update: function (dt) { pop += dt; if (st === 'play') { tmr -= dt; if (tmr <= 0) st = 'lose'; } },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), r, k, p;
        bg('#241a14', '#0e0906');
        for (r = 0; r < MAXT; r++) {
          var row = rows[r], act = r === rows.length && st === 'play';
          g.fillStyle = act ? 'rgba(255,216,138,.10)' : 'rgba(255,255,255,.04)'; rr(L.bx - 14, L.y0 + r * L.rh + 2, 270, L.rh - 4, 8); g.fill();
          for (k = 0; k < NP; k++) {
            p = slotXY(r, k); var v = row ? row.g[k] : (act ? cur[k] : undefined);
            if (v === undefined) { g.strokeStyle = 'rgba(255,255,255,.25)'; g.lineWidth = 1.5; g.beginPath(); g.arc(p.x, p.y, L.s / 2 - 1, 0, 6.283); g.stroke(); }
            else { g.fillStyle = COL[v]; g.beginPath(); g.arc(p.x, p.y, L.s / 2, 0, 6.283); g.fill(); txt(String(v + 1), p.x, p.y + 5, 13, '#1a1208'); }
          }
          if (row) { for (k = 0; k < NP; k++) { var px = L.bx + 4 * (L.s + 8) + 10 + (k % 2) * 14, py = L.y0 + r * L.rh + L.rh / 2 - 7 + Math.floor(k / 2) * 14; g.fillStyle = k < row.ex ? '#ffd88a' : (k < row.ex + row.co ? '#c9c9d9' : 'rgba(255,255,255,.12)'); g.beginPath(); g.arc(px, py, 5, 0, 6.283); g.fill(); } }
        }
        if (st === 'play' && cur.length === NP) { p = okXY(); g.fillStyle = '#ffd88a'; rr(p.x - 38, p.y - L.rh / 2 + 3, 76, L.rh - 6, 10); g.fill(); txt(T.ok, p.x, p.y + 6, 16, '#2a1a08'); }
        for (k = 0; k < NS; k++) { p = palXY(k); g.fillStyle = COL[k]; g.beginPath(); g.arc(p.x, p.y, L.pw * 0.38, 0, 6.283); g.fill(); g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.arc(p.x - 5, p.y - 6, L.pw * 0.1, 0, 6.283); g.fill(); txt(String(k + 1), p.x, p.y + 6, 16, '#1a1208'); }
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 40 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + best + '/' + NP, T.h2 + ' ' + rows.length + '/' + MAXT, true);
        fim(st);
      }
    };
  }
});
