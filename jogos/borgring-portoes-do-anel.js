/* Borgring — ligue todos os caminhos ao centro da fortaleza (invenção). */
BTJogo.registrar({
  canvas: 'jogo-borgring',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os caminhos de Borgring",
    "sub": "Cada quadrado do tabuleiro 5 por 5 tem trechos de caminho. Toque num quadrado para girá-lo um quarto de volta. Ligue todos os quadrados ao centro, onde fica o anel da fortaleza: os caminhos ligados ao centro ficam dourados. Faça isso em até 60 giros.",
    "perdeu": "Os giros ou o tempo acabaram antes de todos os caminhos chegarem ao centro",
    "v1": "Todos os caminhos chegam ao anel!",
    "v2": "Borgring, perto de Køge, na Zelândia, é um forte circular de cerca de 145 metros de largura, com um muro de 10 a 11 metros coroado por uma paliçada. As escavações de 2014 o datam do século X e acharam as portas norte e leste onde um traçado do tipo trelleborg previa. Os caminhos girando são invenção.",
    "h1": "Giros",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The paths of Borgring",
    "sub": "Each square of the 5-by-5 board has stretches of path. Tap a square to turn it a quarter turn. Connect every square to the centre, where the ring of the fortress stands: the paths linked to the centre turn gold. Do it in up to 60 turns.",
    "perdeu": "The turns or the time ran out before every path reached the centre",
    "v1": "Every path reaches the ring!",
    "v2": "Borgring, near Køge on Zealand, is a circular fort about 145 metres across, with a rampart 10 to 11 metres wide topped by a palisade. The 2014 excavations dated it to the 10th century and found the north and east gates where a trelleborg layout predicted them. The turning paths are invented.",
    "h1": "Turns",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Stiene i Borgring",
    "sub": "Hver rute på brettet på 5 ganger 5 har stykker av sti. Trykk på en rute for å vri den en kvart omdreining. Koble alle rutene til sentrum, der ringen til festningen ligger: stiene som henger sammen med sentrum blir gylne. Gjør det på opptil 60 vridninger.",
    "perdeu": "Vridningene eller tiden tok slutt før alle stiene nådde sentrum",
    "v1": "Alle stiene når ringen!",
    "v2": "Borgring, nær Køge på Sjælland, er en rund festning på rundt 145 meter på tvers, med en voll på 10 til 11 meter, kronet av en palisade. Utgravingene i 2014 datert den til 900-tallet og fant nord- og østporten der en trelleborg-planløsning ville forutsi dem. Stiene som vris er oppfunnet.",
    "h1": "Vridninger",
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
    var N = 5, MAXT = 60, LIM = 300, D = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    var sol = [], cur = [], turns = 0, t = 0;
    function rot(m) { return ((m << 1) | (m >> 3)) & 15; }
    function need(a, b) { var k = 0, m = a; while (m !== b && k < 4) { m = rot(m); k++; } return k; }
    function gen() {
      for (;;) {
        var m = [], seen = [], i, st2 = [12], x, y, cands, j;
        for (i = 0; i < N * N; i++) { m.push(0); seen.push(false); } seen[12] = true;
        while (st2.length) {
          var c = st2[st2.length - 1]; x = c % N; y = (c - x) / N; cands = [];
          for (j = 0; j < 4; j++) { var nx = x + D[j][0], ny = y + D[j][1]; if (nx >= 0 && nx < N && ny >= 0 && ny < N && !seen[ny * N + nx]) cands.push(j); }
          if (!cands.length) { st2.pop(); continue; }
          j = cands[Math.floor(Math.random() * cands.length)]; var n2 = (y + D[j][1]) * N + x + D[j][0]; m[c] |= 1 << j; m[n2] |= 1 << ((j + 2) % 4); seen[n2] = true; st2.push(n2);
        }
        var cu = [], tot = 0; for (i = 0; i < N * N; i++) { var k = Math.floor(Math.random() * 4), v = m[i]; while (k-- > 0) v = rot(v); cu.push(v); tot += need(cu[i], m[i]); }
        if (tot >= 22 && tot <= 40) { sol = m; cur = cu; return; }
      }
    }
    function conn() {
      var seen = [], q = [12], i; for (i = 0; i < N * N; i++) seen.push(false); seen[12] = true;
      while (q.length) { var c = q.pop(), x = c % N, y = (c - x) / N; for (var j = 0; j < 4; j++) { if (!(cur[c] & (1 << j))) continue; var nx = x + D[j][0], ny = y + D[j][1]; if (nx < 0 || nx >= N || ny < 0 || ny >= N) continue; var n2 = ny * N + nx; if (!seen[n2] && (cur[n2] & (1 << ((j + 2) % 4)))) { seen[n2] = true; q.push(n2); } } }
      return seen;
    }
    function ncon() { var s = conn(), n = 0; for (var i = 0; i < N * N; i++) if (s[i]) n++; return n; }
    function reset() { gen(); turns = 0; t = 0; st = 'play'; }
    function tap(i) { if (st !== 'play') return; cur[i] = rot(cur[i]); turns++; if (api.nota) api.nota(240, 0.05, 'square', 0.025); if (ncon() === N * N) st = 'win'; else if (turns >= MAXT) st = 'lose'; }
    function lay() { var W = api.w, H = api.h, s = Math.min(W - 24, H - 130, 440); return { s: s, c: s / N, x0: (W - s) / 2, y0: 70 }; }
    function cp() { var L = lay(), o = [], i; for (i = 0; i < N * N; i++) o.push({ x: L.x0 + (i % N) * L.c + L.c / 2, y: L.y0 + ((i / N) | 0) * L.c + L.c / 2 }); return o; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, cur: cur.slice(), sol: sol.slice(), pos: cp(), turns: turns, max: MAXT, t: t }; },
      down: function (x, y) { if (menu()) return; var L = lay(), p = cp(), i; for (i = 0; i < N * N; i++) if (Math.abs(x - p[i].x) < L.c / 2 && Math.abs(y - p[i].y) < L.c / 2) { tap(i); return; } },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) { if (st !== 'play') return; t += dt; if (t >= LIM) st = 'lose'; },
      draw: function () {
        var L = lay(), p = cp(), s = conn(), i, j; bg('#1c2630', '#080c10');
        for (i = 0; i < N * N; i++) {
          var x = p[i].x - L.c / 2, y = p[i].y - L.c / 2;
          g.fillStyle = 'rgba(255,255,255,.06)'; g.fillRect(x + 1, y + 1, L.c - 2, L.c - 2);
          g.strokeStyle = s[i] ? '#ffd88a' : '#6f86a8'; g.lineWidth = Math.max(4, L.c * 0.11);
          for (j = 0; j < 4; j++) if (cur[i] & (1 << j)) { g.beginPath(); g.moveTo(p[i].x, p[i].y); g.lineTo(p[i].x + D[j][0] * L.c / 2, p[i].y + D[j][1] * L.c / 2); g.stroke(); }
          g.beginPath(); g.arc(p[i].x, p[i].y, L.c * 0.09, 0, 6.2832); g.fillStyle = s[i] ? '#ffd88a' : '#6f86a8'; g.fill();
        }
        g.beginPath(); g.arc(p[12].x, p[12].y, L.c * 0.3, 0, 6.2832); g.strokeStyle = '#ffd88a'; g.lineWidth = 3; g.stroke();
        g.beginPath(); g.arc(p[12].x, p[12].y, L.c * 0.18, 0, 6.2832); g.fillStyle = '#ffd88a'; g.fill();
        bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 60 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + turns + '/' + MAXT, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };

  }
});
