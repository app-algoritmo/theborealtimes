/* Heiðarvíga saga — procure os grupos escondidos na charneca (invenção). */
BTJogo.registrar({
  canvas: 'jogo-heidarviga',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A charneca dos combates",
    "sub": "Quatro grupos de homens se escondem na charneca: um de 4 casas, dois de 3 e um de 2, em linha reta, na horizontal ou na vertical, sem se tocar de lado. Toque numa casa para investigar: um ponto cinza é charneca vazia e um marcador vermelho é um homem encontrado. Quando todas as casas de um grupo são achadas, ele é desfeito. Encontre os quatro grupos em até 42 toques.",
    "perdeu": "Os toques ou o tempo acabaram antes de achar todos os grupos",
    "v1": "A charneca está limpa!",
    "v2": "A Heiðarvíga saga, a história dos combates da charneca, segue descendentes de Egill Skallagrímsson em disputas que terminam em mortes numa charneca. Ela chegou mal conservada: doze folhas do único manuscrito queimaram em Copenhague, em 1728. Os grupos escondidos são invenção.",
    "h1": "Toques",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The heath of the fights",
    "sub": "Four bands of men hide on the heath: one of 4 squares, two of 3 and one of 2, in a straight line, horizontal or vertical, never touching along a side. Tap a square to search it: a grey dot is empty heath and a red marker is a man found. When every square of a band is found, the band is broken. Find all four bands in up to 42 taps.",
    "perdeu": "The taps or the time ran out before all the bands were found",
    "v1": "The heath is clear!",
    "v2": "The Heiðarvíga saga, the story of the heath-slayings, follows descendants of Egill Skallagrímsson in disputes that end in killings on a heath. It survives badly: twelve leaves of its only manuscript burned in Copenhagen in 1728. The hidden bands are invented.",
    "h1": "Taps",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Heia der de kjempet",
    "sub": "Fire grupper menn gjemmer seg på heia: én på 4 ruter, to på 3 og én på 2, på rett linje, vannrett eller loddrett, uten å røre hverandre langs en side. Trykk på en rute for å lete: en grå prikk er tom hei og en rød markør er en funnet mann. Når alle rutene i en gruppe er funnet, er gruppen oppløst. Finn alle fire gruppene på opptil 42 trykk.",
    "perdeu": "Trykkene eller tiden tok slutt før alle gruppene var funnet",
    "v1": "Heia er ryddet!",
    "v2": "Heiðarvíga saga, fortellingen om heidrapene, følger etterkommere av Egill Skallagrímsson i stridigheter som ender med drap på en hei. Den er dårlig bevart: tolv blad av det eneste manuskriptet brant i København i 1728. De skjulte gruppene er oppfunnet.",
    "h1": "Trykk",
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
    var N = 8, MAXS = 42, LIM = 300, SIZES = [4, 3, 3, 2];
    var ship = [], rev = [], sunk = [], groups = [], shots = 0, t = 0, fl = 0;
    function place() {
      for (;;) {
        var occ = [], gs = [], ok = true, i, k;
        for (i = 0; i < N * N; i++) occ.push(-1);
        for (k = 0; k < SIZES.length && ok; k++) {
          var tries = 0, done = false;
          while (!done && tries < 200) {
            tries++; var hz = Math.random() < 0.5, x = Math.floor(Math.random() * (hz ? N - SIZES[k] + 1 : N)), y = Math.floor(Math.random() * (hz ? N : N - SIZES[k] + 1)), cells = [], good = true, j;
            for (j = 0; j < SIZES[k]; j++) cells.push((hz ? y : y + j) * N + (hz ? x + j : x));
            for (j = 0; j < cells.length && good; j++) { var cx = cells[j] % N, cy = (cells[j] - cx) / N; for (var dx = -1; dx <= 1; dx++) for (var dy = -1; dy <= 1; dy++) { var nx = cx + dx, ny = cy + dy; if (nx >= 0 && nx < N && ny >= 0 && ny < N && occ[ny * N + nx] >= 0) good = false; } }
            if (good) { for (j = 0; j < cells.length; j++) occ[cells[j]] = k; gs.push(cells); done = true; }
          }
          if (!done) ok = false;
        }
        if (ok) { ship = occ; groups = gs; return; }
      }
    }
    function reset() { place(); rev = []; sunk = []; for (var i = 0; i < N * N; i++) { rev.push(0); sunk.push(false); } shots = 0; t = 0; fl = 0; st = 'play'; }
    function shoot(i) {
      if (st !== 'play' || rev[i]) return; shots++;
      if (ship[i] >= 0) { rev[i] = 2; if (api.nota) api.nota(180, 0.15, 'sawtooth', 0.05); var gr = groups[ship[i]], all = true, j; for (j = 0; j < gr.length; j++) if (rev[gr[j]] !== 2) all = false; if (all) { for (j = 0; j < gr.length; j++) sunk[gr[j]] = true; if (api.nota) api.nota(520, 0.2, 'triangle', 0.07); } }
      else { rev[i] = 1; if (api.nota) api.nota(320, 0.06, 'sine', 0.04); }
      var left = false; for (var q = 0; q < groups.length; q++) for (var w = 0; w < groups[q].length; w++) if (rev[groups[q][w]] !== 2) left = true;
      if (!left) st = 'win'; else if (shots >= MAXS) st = 'lose';
    }
    function lay() { var W = api.w, H = api.h, s = Math.min(W - 24, H - 130, 440); return { s: s, c: s / N, x0: (W - s) / 2, y0: 70 }; }
    function cp() { var L = lay(), o = [], i; for (i = 0; i < N * N; i++) o.push({ x: L.x0 + (i % N) * L.c + L.c / 2, y: L.y0 + ((i / N) | 0) * L.c + L.c / 2 }); return o; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, rev: rev.slice(), sunk: sunk.slice(), shots: shots, max: MAXS, pos: cp(), N: N, t: t }; },
      down: function (x, y) { if (menu()) return; var L = lay(), p = cp(), i; for (i = 0; i < N * N; i++) if (Math.abs(x - p[i].x) < L.c / 2 && Math.abs(y - p[i].y) < L.c / 2) { shoot(i); return; } },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) { if (st !== 'play') return; t += dt; if (t >= LIM) st = 'lose'; },
      draw: function () {
        var L = lay(), p = cp(), i; bg('#1f2a22', '#0a100c');
        for (i = 0; i < N * N; i++) {
          var x = p[i].x - L.c / 2, y = p[i].y - L.c / 2;
          g.fillStyle = ((i % N) + ((i / N) | 0)) % 2 ? 'rgba(255,255,255,.07)' : 'rgba(255,255,255,.12)'; g.fillRect(x, y, L.c, L.c);
          if (rev[i] === 1) { g.beginPath(); g.arc(p[i].x, p[i].y, L.c * 0.12, 0, 6.2832); g.fillStyle = 'rgba(200,200,210,.6)'; g.fill(); }
          if (rev[i] === 2) { g.beginPath(); g.arc(p[i].x, p[i].y, L.c * 0.3, 0, 6.2832); g.fillStyle = sunk[i] ? '#5a2a26' : '#d64545'; g.fill(); g.strokeStyle = sunk[i] ? '#8a5a54' : '#ffd88a'; g.lineWidth = 2; g.stroke(); }
        }
        g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 1.5; g.strokeRect(L.x0, L.y0, L.s, L.s);
        bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 60 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + shots + '/' + MAXS, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };

  }
});
