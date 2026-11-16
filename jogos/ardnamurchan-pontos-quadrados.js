/* Ardnamurchan — ligue os pontos e feche mais quadrados que o rival. */
BTJogo.registrar({
  canvas: 'jogo-ardnamurchan',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os pontos de Swordle Bay",
    "sub": "Toque entre dois pontos vizinhos para traçar uma linha. Quem fecha o quarto lado de um quadrado fica com ele e joga de novo. Feche mais quadrados que o rival (5 ou mais, de 9), em até 120 segundos. Você começa.",
    "perdeu": "O rival fechou mais quadrados ou o tempo acabou",
    "v1": "Você fechou mais quadrados!",
    "v2": "Em 2011, arqueólogos acharam em Ardnamurchan, na Escócia, uma sepultura em barco do século X. O jogo de pontos é invenção.",
    "h1": "Quadrados",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The dots of Swordle Bay",
    "sub": "Tap between two neighbouring dots to draw a line. Whoever closes the fourth side of a square keeps it and plays again. Close more squares than the rival (5 or more of 9), within 120 seconds. You start.",
    "perdeu": "The rival closed more squares or the time ran out",
    "v1": "You closed more squares!",
    "v2": "In 2011, archaeologists found a tenth-century boat burial at Ardnamurchan, in Scotland. The game of dots is made up.",
    "h1": "Squares",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Prikkene ved Swordle Bay",
    "sub": "Trykk mellom to nabopunkter for å trekke en strek. Den som lukker den fjerde siden av en rute får den og spiller igjen. Lukk flere ruter enn rivalen (5 eller flere av 9), innen 120 sekunder. Du begynner.",
    "perdeu": "Rivalen lukket flere ruter, eller tiden gikk ut",
    "v1": "Du lukket flere ruter!",
    "v2": "I 2011 fant arkeologer en båtgrav fra 900-tallet ved Ardnamurchan i Skottland. Prikkspillet er diktet opp.",
    "h1": "Ruter",
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
    var NB = 3, LIM = 120, ERR = 0.42;
    var h = [], v = [], own = [], turn = 0, t = 0, aiT = 0, sc = [0, 0], lastL = null;
    function lay() { var W = api.w, H = api.h, cs = Math.max(48, Math.min((W - 60) / NB, (H - 190) / NB, 110)); return { cs: cs, x: (W - cs * NB) / 2, y: Math.max(100, (H - cs * NB) / 2 + 14) }; }
    function setup() { h = new Array(4 * NB).fill(0); v = new Array(NB * 4).fill(0); own = new Array(NB * NB).fill(0); turn = 0; t = 0; aiT = 0; sc = [0, 0]; lastL = null; }
    function reset() { setup(); st = 'play'; }
    function hI(r, c) { return r * NB + c; }
    function vI(r, c) { return r * 4 + c; }
    function sides(r, c) { return (h[hI(r, c)] ? 1 : 0) + (h[hI(r + 1, c)] ? 1 : 0) + (v[vI(r, c)] ? 1 : 0) + (v[vI(r, c + 1)] ? 1 : 0); }
    function lines() { var o = [], r, c; for (r = 0; r < 4; r++) for (c = 0; c < NB; c++) if (!h[hI(r, c)]) o.push({ k: 'h', r: r, c: c }); for (r = 0; r < NB; r++) for (c = 0; c < 4; c++) if (!v[vI(r, c)]) o.push({ k: 'v', r: r, c: c }); return o; }
    function boxesOf(l) { var o = []; if (l.k === 'h') { if (l.r > 0) o.push([l.r - 1, l.c]); if (l.r < NB) o.push([l.r, l.c]); } else { if (l.c > 0) o.push([l.r, l.c - 1]); if (l.c < NB) o.push([l.r, l.c]); } return o; }
    function draw_(l, p) { if (l.k === 'h') h[hI(l.r, l.c)] = p; else v[vI(l.r, l.c)] = p; lastL = l; var got = 0; boxesOf(l).forEach(function (q) { if (!own[q[0] * NB + q[1]] && sides(q[0], q[1]) === 4) { own[q[0] * NB + q[1]] = p; sc[p - 1]++; got++; } }); if (api.nota) api.nota(got ? 620 : 330, 0.07, 'triangle', 0.05); if (sc[0] >= 5) st = 'win'; else if (sc[1] >= 5) st = 'lose'; else if (sc[0] + sc[1] === NB * NB) st = sc[0] > sc[1] ? 'win' : 'lose'; return got; }
    function aiMove() { var L_ = lines(); if (!L_.length) return; var pick = null; if (Math.random() < ERR) pick = L_[Math.floor(Math.random() * L_.length)]; else { var take = L_.filter(function (l) { return boxesOf(l).some(function (q) { return !own[q[0] * NB + q[1]] && sides(q[0], q[1]) === 3; }); }); if (take.length) pick = take[0]; else { var safe = L_.filter(function (l) { return boxesOf(l).every(function (q) { return sides(q[0], q[1]) < 2; }); }); if (safe.length) pick = safe[Math.floor(Math.random() * safe.length)]; else { var best = 1e9; L_.forEach(function (l) { var n = 0; boxesOf(l).forEach(function (q) { if (sides(q[0], q[1]) === 2) n++; }); n += Math.random() * 0.5; if (n < best) { best = n; pick = l; } }); } } } var got = draw_(pick, 2); if (st === 'play') { if (got) aiT = 0.55; else turn = 0; } }
    function mine(l) { if (st !== 'play' || turn !== 0) return; var got = draw_(l, 1); if (st === 'play' && !got) { turn = 1; aiT = 0.6; } }
    function pos(l) { var L = lay(); return l.k === 'h' ? { x: L.x + (l.c + 0.5) * L.cs, y: L.y + l.r * L.cs } : { x: L.x + l.c * L.cs, y: L.y + (l.r + 0.5) * L.cs }; }
    function pick(x, y) { var best = null, bd = 1e9, L = lay(); lines().forEach(function (l) { var p = pos(l), d = Math.hypot(p.x - x, p.y - y); if (d < bd) { bd = d; best = l; } }); return bd < L.cs * 0.42 ? best : null; }
    setup();
    return {
      pausar: function () {},
      dbg: function () { return { st: st, h: h.slice(), v: v.slice(), own: own.slice(), turn: turn, busy: turn !== 0, sc: sc.slice(), t: t, tmr: LIM - t, NB: NB, pos: pos, lines: lines, boxes: boxesOf }; },
      down: function (x, y) { if (menu()) return; var l = pick(x, y); if (l) mine(l); },
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) { if (st !== 'play') return; t += dt; if (t >= LIM) { t = LIM; st = sc[0] > sc[1] ? 'win' : 'lose'; return; } if (turn === 1) { aiT -= dt; if (aiT <= 0) aiMove(); } },
      draw: function () {
        var L = lay(), W = api.w, H = api.h, r, c;
        bg('#1a2a1a', '#050a05');
        for (r = 0; r < NB; r++) for (c = 0; c < NB; c++) { var o = own[r * NB + c]; if (o) { g.fillStyle = o === 1 ? 'rgba(255,216,138,.55)' : 'rgba(192,57,43,.6)'; g.fillRect(L.x + c * L.cs + 4, L.y + r * L.cs + 4, L.cs - 8, L.cs - 8); } }
        for (r = 0; r < 4; r++) for (c = 0; c < NB; c++) { var d = h[hI(r, c)]; g.strokeStyle = d === 1 ? '#ffd88a' : d === 2 ? '#e05a4a' : 'rgba(255,255,255,.16)'; g.lineWidth = d ? 5 : 2; g.beginPath(); g.moveTo(L.x + c * L.cs + 6, L.y + r * L.cs); g.lineTo(L.x + (c + 1) * L.cs - 6, L.y + r * L.cs); g.stroke(); }
        for (r = 0; r < NB; r++) for (c = 0; c < 4; c++) { var d2 = v[vI(r, c)]; g.strokeStyle = d2 === 1 ? '#ffd88a' : d2 === 2 ? '#e05a4a' : 'rgba(255,255,255,.16)'; g.lineWidth = d2 ? 5 : 2; g.beginPath(); g.moveTo(L.x + c * L.cs, L.y + r * L.cs + 6); g.lineTo(L.x + c * L.cs, L.y + (r + 1) * L.cs - 6); g.stroke(); }
        g.fillStyle = '#e8e0d0'; for (r = 0; r < 4; r++) for (c = 0; c < 4; c++) { g.beginPath(); g.arc(L.x + c * L.cs, L.y + r * L.cs, 5, 0, 6.283); g.fill(); }
        bar(W / 2 - 110, H - 14, 220, 5, (LIM - t) / LIM, LIM - t < 20 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + sc[0] + '–' + sc[1], T.h2 + ' ' + Math.ceil(LIM - t), false);
        fim(st);
      }
    };
  }
});
