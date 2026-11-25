/* As runas de Ingvar — grave as casas certas segundo as pistas. */
BTJogo.registrar({
  canvas: 'jogo-ingvar',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As runas na pedra",
    "sub": "Os números de cada linha e de cada coluna dizem quantas casas seguidas devem ser gravadas. Toque numa casa para gravar a runa (ou use as setas e o espaço). Se a casa estiver errada, conta um erro. No terceiro erro, o jogo acaba.",
    "perdeu": "A pedra se quebrou",
    "v1": "A pedra está gravada!",
    "v2": "Há mais de vinte pedras rúnicas suecas que lembram os homens da expedição de Ingvar ao leste. As pistas do jogo são invenção.",
    "h1": "Runas",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Runes on the stone",
    "sub": "The numbers for each row and column say how many squares in a row must be carved. Tap a square to carve the rune (or use the arrows and Space). If the square is wrong, it counts as a mistake. The third mistake ends the game.",
    "perdeu": "The stone broke",
    "v1": "The stone is carved!",
    "v2": "More than twenty Swedish runestones remember the men of the Ingvar expedition to the east. The clues in the game are made up.",
    "h1": "Runes",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Runer på steinen",
    "sub": "Tallene for hver rad og kolonne sier hvor mange ruter på rad som skal risses. Trykk på en rute for å risse runen (eller bruk piltastene og mellomrom). Er ruta feil, teller det som en feil. Den tredje feilen avslutter spillet.",
    "perdeu": "Steinen sprakk",
    "v1": "Steinen er risset!",
    "v2": "Over tjue svenske runesteiner minnes mennene på Ingvars ferd mot øst. Hintene i spillet er diktet opp.",
    "h1": "Runer",
    "h2": "Feil"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "Las runas en la piedra",
    "sub": "Los números de cada fila y de cada columna dicen cuántas casillas seguidas hay que grabar. Toca una casilla para grabar la runa (o usa las flechas y el espacio). Si la casilla es incorrecta, cuenta un error. Al tercer error, el juego termina.",
    "perdeu": "La piedra se rompió",
    "v1": "¡La piedra está grabada!",
    "v2": "Hay más de veinte piedras rúnicas suecas que recuerdan a los hombres de la expedición de Ingvar al este. Las pistas del juego son invención.",
    "h1": "Runas",
    "h2": "Errores"
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
    var N = 5, MAXE = 3, LIM = 240;
    var sol = [], rc = [], cc = [], mk = [], errs = 0, got = 0, tot = 0, tmr = LIM, cur = [0, 0], flash = 0, fcell = null;
    function lay() { var W = api.w, H = api.h, cs = Math.min((W - 30) / (N + 1.6), (H - 170) / (N + 1.6), 62); return { cs: cs, x: (W - cs * (N + 1.4)) / 2 + cs * 1.4, y: Math.max(70, (H - cs * (N + 1.4)) / 2 + cs * 1.4 + 10) }; }
    function clues(a) { var o = [], n = 0; a.forEach(function (v) { if (v) n++; else if (n) { o.push(n); n = 0; } }); if (n) o.push(n); return o.length ? o : [0]; }
    function eq(a, b) { return a.length === b.length && a.every(function (v, i) { return v === b[i]; }); }
    function countSols(R, C) {
      var pats = []; for (var m = 0; m < (1 << N); m++) { var a = []; for (var k = 0; k < N; k++) a.push((m >> k) & 1); pats.push(a); }
      var cand = R.map(function (cl) { return pats.filter(function (p) { return eq(clues(p), cl); }); }), n = 0;
      (function dfs(r, rows) { if (n > 1) return; if (r === N) { for (var c = 0; c < N; c++) { if (!eq(clues(rows.map(function (x) { return x[c]; })), C[c])) return; } n++; return; } cand[r].forEach(function (p) { dfs(r + 1, rows.concat([p])); }); })(0, []);
      return n;
    }
    function setup() {
      var tries = 0, ok = false;
      while (!ok && tries++ < 300) {
        sol = []; for (var r = 0; r < N; r++) { sol.push([]); for (var c = 0; c < N; c++) sol[r].push(Math.random() < 0.55 ? 1 : 0); }
        rc = sol.map(clues); cc = []; for (c = 0; c < N; c++) cc.push(clues(sol.map(function (x) { return x[c]; })));
        tot = 0; sol.forEach(function (x) { x.forEach(function (v) { tot += v; }); });
        ok = tot >= 11 && tot <= 17 && countSols(rc, cc) === 1;
      }
      mk = []; for (r = 0; r < N; r++) { mk.push([]); for (c = 0; c < N; c++) mk[r].push(0); }
      errs = 0; got = 0; tmr = LIM; cur = [0, 0]; flash = 0;
    }
    function reset() { setup(); st = 'play'; }
    function tap(r, c) {
      if (st !== 'play' || mk[r][c]) return;
      if (sol[r][c]) { mk[r][c] = 1; got++; if (api.nota) api.nota(380 + got * 15, 0.08, 'triangle', 0.05); if (got >= tot) st = 'win'; }
      else { mk[r][c] = 2; errs++; flash = 0.5; fcell = [r, c]; if (errs >= MAXE) st = 'lose'; }
    }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, sol: sol.map(function (r) { return r.slice(); }), got: got, tot: tot, errs: errs, x: L.x, y: L.y, cs: L.cs }; },
      down: function (x, y) { if (menu()) return; var L = lay(), c = Math.floor((x - L.x) / L.cs), r = Math.floor((y - L.y) / L.cs); if (r >= 0 && r < N && c >= 0 && c < N) { cur = [r, c]; tap(r, c); } },
      key: function (k, d) {
        if (!d) return; if (st !== 'play') { menu(); return; }
        if (k === 'ArrowLeft' || k === 'KeyA') cur[1] = Math.max(0, cur[1] - 1); else if (k === 'ArrowRight' || k === 'KeyD') cur[1] = Math.min(N - 1, cur[1] + 1);
        else if (k === 'ArrowUp' || k === 'KeyW') cur[0] = Math.max(0, cur[0] - 1); else if (k === 'ArrowDown' || k === 'KeyS') cur[0] = Math.min(N - 1, cur[0] + 1);
        else if (k === 'Space' || k === 'Enter') tap(cur[0], cur[1]);
      },
      update: function (dt) { if (flash > 0) flash -= dt; if (st === 'play') { tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; } } },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), r, c, i;
        bg('#2a2a30', '#0f0f14');
        g.fillStyle = '#4a4a52'; rr(L.x - 8, L.y - 8, L.cs * N + 16, L.cs * N + 16, 10); g.fill();
        for (r = 0; r < N; r++) for (c = 0; c < N; c++) {
          var x = L.x + c * L.cs, y = L.y + r * L.cs;
          g.fillStyle = mk[r][c] === 1 ? '#c9a45a' : (mk[r][c] === 2 ? '#7a3a3a' : ((r + c) % 2 ? '#5a5a64' : '#54545e')); g.fillRect(x + 1, y + 1, L.cs - 2, L.cs - 2);
          if (mk[r][c] === 1) txt('ᚱ', x + L.cs / 2, y + L.cs / 2 + L.cs * 0.18, L.cs * 0.6, '#2a1a08'); else if (mk[r][c] === 2) txt('×', x + L.cs / 2, y + L.cs / 2 + L.cs * 0.16, L.cs * 0.6, '#f3ecd2');
        }
        for (i = 0; i < N; i++) {
          txt(rc[i].join(' '), L.x - 10, L.y + i * L.cs + L.cs * 0.62, Math.max(13, L.cs * 0.34), '#f3ecd2', 'right');
          var cl = cc[i]; for (var k = 0; k < cl.length; k++) txt(String(cl[k]), L.x + i * L.cs + L.cs / 2, L.y - 12 - (cl.length - 1 - k) * Math.max(15, L.cs * 0.36), Math.max(13, L.cs * 0.34), '#f3ecd2');
        }
        if (st === 'play') { g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = 2; g.strokeRect(L.x + cur[1] * L.cs + 3, L.y + cur[0] * L.cs + 3, L.cs - 6, L.cs - 6); }
        if (flash > 0 && fcell) { g.fillStyle = 'rgba(200,40,40,' + flash * 0.4 + ')'; g.fillRect(0, 0, W, H); }
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 40 ? '#c0392b' : '#c9a45a');
        hud(T.h1 + ' ' + got + '/' + tot, T.h2 + ' ' + errs + '/' + MAXE, errs > 0);
        fim(st);
      }
    };
  }
});
