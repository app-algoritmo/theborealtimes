/* A floresta de Tapio — atravesse sem se perder. */
BTJogo.registrar({
  canvas: 'jogo-tapio',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A floresta de Tapio",
    "sub": "Cada casa esconde um trecho de mata. Toque para pisar: o número diz quantos desvios enganosos há ao redor. Pise em todos os trechos seguros. O botão de bandeira (ou a tecla F) marca um desvio suspeito. Dois desvios e você se perde.",
    "perdeu": "Você se perdeu na floresta",
    "v1": "Você cruzou a floresta de Tapio!",
    "v2": "Na tradição finlandesa, Tapio é o senhor da floresta e dos animais caçados. Os desvios enganosos do jogo são invenção.",
    "h1": "Trilha",
    "h2": "Desvios"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Tapio's forest",
    "sub": "Each square hides a stretch of woodland. Tap to step: the number tells how many misleading detours lie around it. Step on every safe stretch. The flag button (or the F key) marks a suspected detour. Two detours and you are lost.",
    "perdeu": "You got lost in the forest",
    "v1": "You crossed Tapio's forest!",
    "v2": "In Finnish tradition, Tapio is the lord of the forest and of the game animals. The misleading detours in the game are made up.",
    "h1": "Path",
    "h2": "Detours"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Tapios skog",
    "sub": "Hver rute skjuler et stykke skog. Trykk for å tråkke: tallet sier hvor mange villedende omveier som ligger rundt. Tråkk på alle trygge stykker. Flaggknappen (eller tasten F) merker en mistenkt omvei. To omveier og du er fortapt.",
    "perdeu": "Du gikk deg vill i skogen",
    "v1": "Du kom deg gjennom Tapios skog!",
    "v2": "I finsk tradisjon er Tapio herre over skogen og viltet. De villedende omveiene i spillet er diktet opp.",
    "h1": "Sti",
    "h2": "Omveier"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "El bosque de Tapio",
    "sub": "Cada casilla esconde un tramo de monte. Toca para pisar: el número dice cuántos desvíos engañosos hay alrededor. Pisa todos los tramos seguros. El botón de bandera (o la tecla F) marca un desvío sospechoso. Con dos desvíos te pierdes.",
    "perdeu": "Te perdiste en el bosque",
    "v1": "¡Cruzaste el bosque de Tapio!",
    "v2": "En la tradición finlandesa, Tapio es el señor del bosque y de los animales de caza. Los desvíos engañosos del juego son invención.",
    "h1": "Sendero",
    "h2": "Desvíos"
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
    var N = 8, MINES = 10, MAXD = 2, LIM = 240, NUMC = ['', '#6ab0ff', '#7ad07a', '#ff8a7a', '#b08aff', '#ffb060', '#60d0d0', '#fff', '#aaa'];
    var mn = null, rv = [], fl = [], nb = [], det = 0, fmode = false, tmr = LIM, cx = 0, cy = 0, pop = 0, safeLeft = 0;
    function lay() { var W = api.w, H = api.h, S = Math.min(W - 24, H - 170, 340), cs = S / N; return { S: S, cs: cs, x: (W - S) / 2, y: Math.max(70, (H - S) / 2 + 2) }; }
    function setup() { mn = null; rv = []; fl = []; nb = []; for (var i = 0; i < N * N; i++) { rv.push(0); fl.push(0); nb.push(0); } det = 0; fmode = false; tmr = LIM; cx = cy = 3; safeLeft = N * N - MINES; }
    function reset() { setup(); st = 'play'; }
    function around(i, f) { var x = i % N, y = Math.floor(i / N); for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) { if (!dx && !dy) continue; var a = x + dx, b = y + dy; if (a >= 0 && b >= 0 && a < N && b < N) f(b * N + a); } }
    function place(first) { mn = []; for (var i = 0; i < N * N; i++) mn.push(0); var ban = {}; ban[first] = 1; around(first, function (j) { ban[j] = 1; }); var n = 0; while (n < MINES) { var k = Math.floor(Math.random() * N * N); if (!mn[k] && !ban[k]) { mn[k] = 1; n++; } } for (i = 0; i < N * N; i++) { var c = 0; around(i, function (j) { c += mn[j]; }); nb[i] = c; } }
    function open(i) { var q = [i]; while (q.length) { var k = q.pop(); if (rv[k] || fl[k] || mn[k]) continue; rv[k] = 1; safeLeft--; if (nb[k] === 0) around(k, function (j) { if (!rv[j]) q.push(j); }); } }
    function step(i) {
      if (st !== 'play' || rv[i]) return; if (fmode) { fl[i] = fl[i] ? 0 : 1; return; } if (fl[i]) return;
      if (!mn) place(i);
      if (mn[i]) { rv[i] = 2; det++; if (api.nota) api.nota(120, 0.25, 'sawtooth', 0.07); if (det >= MAXD) st = 'lose'; return; }
      open(i); if (api.nota) api.nota(380, 0.04, 'triangle', 0.04); if (safeLeft <= 0) st = 'win';
    }
    function fbtn() { var W = api.w, H = api.h; return { x: W / 2 - 38, y: H - 48, w: 76, h: 30 }; }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(), b = fbtn(); return { st: st, mn: mn ? mn.slice() : null, rv: rv.slice(), nb: nb.slice(), det: det, safeLeft: safeLeft, x: L.x, y: L.y, cs: L.cs, N: N }; },
      down: function (x, y) { if (menu()) return; var b = fbtn(); if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) { fmode = !fmode; return; } var L = lay(), c = Math.floor((x - L.x) / L.cs), r = Math.floor((y - L.y) / L.cs); if (c >= 0 && c < N && r >= 0 && r < N) { cx = c; cy = r; step(r * N + c); } },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'KeyF') fmode = !fmode; else if (k === 'ArrowLeft' || k === 'KeyA') cx = Math.max(0, cx - 1); else if (k === 'ArrowRight' || k === 'KeyD') cx = Math.min(N - 1, cx + 1); else if (k === 'ArrowUp' || k === 'KeyW') cy = Math.max(0, cy - 1); else if (k === 'ArrowDown' || k === 'KeyS') cy = Math.min(N - 1, cy + 1); else if (k === 'Space' || k === 'Enter') step(cy * N + cx); },
      update: function (dt) { pop += dt; if (st === 'play') { tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; } } },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), i, b = fbtn();
        bg('#12261a', '#050c07');
        for (i = 0; i < N * N; i++) {
          var x = L.x + (i % N) * L.cs, y = L.y + Math.floor(i / N) * L.cs, v = rv[i];
          g.fillStyle = v === 1 ? '#233a2a' : (v === 2 ? '#7a2a22' : '#2f5a38'); rr(x + 1.5, y + 1.5, L.cs - 3, L.cs - 3, 5); g.fill();
          if (v === 1 && nb[i]) txt(String(nb[i]), x + L.cs / 2, y + L.cs / 2 + 9, L.cs * 0.5, NUMC[nb[i]]);
          else if (v === 2) txt('✗', x + L.cs / 2, y + L.cs / 2 + 8, L.cs * 0.5, '#ffb0a0');
          else if (!v) { g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.moveTo(x + L.cs / 2, y + L.cs * 0.22); g.lineTo(x + L.cs * 0.72, y + L.cs * 0.72); g.lineTo(x + L.cs * 0.28, y + L.cs * 0.72); g.closePath(); g.fill(); if (fl[i]) txt('⚑', x + L.cs / 2, y + L.cs / 2 + 8, L.cs * 0.5, '#ffd88a'); }
        }
        if (st === 'play') { g.strokeStyle = 'rgba(255,216,138,.7)'; g.lineWidth = 2; g.strokeRect(L.x + cx * L.cs + 2, L.y + cy * L.cs + 2, L.cs - 4, L.cs - 4); }
        g.fillStyle = fmode ? '#ffd88a' : 'rgba(255,255,255,.2)'; rr(b.x, b.y, b.w, b.h, 8); g.fill(); txt('⚑', b.x + b.w / 2, b.y + b.h - 7, 18, fmode ? '#222' : '#fff');
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 40 ? '#c0392b' : '#5aa05a');
        hud(T.h1 + ' ' + (N * N - MINES - safeLeft) + '/' + (N * N - MINES), T.h2 + ' ' + det + '/' + MAXD, det > 0);
        fim(st);
      }
    };
  }
});
