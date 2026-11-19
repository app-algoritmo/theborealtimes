/* Batalha de Tettenhall — saqueadores escondidos (invenção). */
BTJogo.registrar({
  canvas: 'jogo-tettenhall',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os saqueadores escondidos",
    "sub": "Em cada campo há saqueadores escondidos. Toque numa casa para revelá-la: o número mostra quantos saqueadores estão nas casas vizinhas, contando as diagonais. Se a casa tiver um saqueador, ele é descoberto e conta como um erro. Revele todas as casas sem saqueador para vencer. A primeira casa nunca tem saqueador. Três erros encerram a partida. São 3 campos.",
    "perdeu": "Três erros",
    "v1": "Campo limpo!",
    "v2": "Em 5 de agosto de 910, um exército de Wessex e da Mércia venceu os vikings da Nortúmbria perto de Tettenhall, e três reis vikings morreram, segundo o relato. Os saqueadores escondidos são invenção.",
    "h1": "Campo",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The hidden raiders",
    "sub": "Each field hides raiders. Tap a square to reveal it: the number shows how many raiders are in the neighbouring squares, diagonals included. If the square holds a raider, he is found and counts as a mistake. Reveal every square without a raider to win. The first square never holds a raider. Three mistakes end the game. There are 3 fields.",
    "perdeu": "Three mistakes",
    "v1": "Field cleared!",
    "v2": "On 5 August 910, an army of Wessex and Mercia defeated the Northumbrian Vikings near Tettenhall, and three Viking kings died, according to the account. The hidden raiders are invented.",
    "h1": "Field",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "De skjulte raiderne",
    "sub": "Hvert jorde skjuler raidere. Trykk på en rute for å avsløre den: tallet viser hvor mange raidere som finnes i naborutene, diagonalene medregnet. Hvis ruten har en raider, blir han funnet og teller som en feil. Avslør alle ruter uten raider for å vinne. Den første ruten har aldri en raider. Tre feil avslutter spillet. Det er 3 jorder.",
    "perdeu": "Tre feil",
    "v1": "Jordet er ryddet!",
    "v2": "5. august 910 beseiret en hær fra Wessex og Mercia vikingene fra Northumbria nær Tettenhall, og tre vikingkonger døde, ifølge beretningen. De skjulte raiderne er oppfunnet.",
    "h1": "Jorde",
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
    var NS = [6, 7, 8], NM = [5, 7, 9], NL = 3, MAXE = 3;
    var lvl = 0, n = 0, mines = [], rev = [], cnt = [], started = false, err = 0, pend = 0;
    function nbrs(k) { var r = [], x = k % n, y = (k / n) | 0, dx, dy; for (dy = -1; dy <= 1; dy++) for (dx = -1; dx <= 1; dx++) { if (!dx && !dy) continue; var nx = x + dx, ny = y + dy; if (nx >= 0 && ny >= 0 && nx < n && ny < n) r.push(ny * n + nx); } return r; }
    function load(i) { n = NS[i]; mines = []; rev = []; cnt = []; started = false; for (var k = 0; k < n * n; k++) { mines[k] = 0; rev[k] = 0; cnt[k] = 0; } }
    function place(first) {
      var safe = [first].concat(nbrs(first)), c = 0; while (c < NM[lvl]) { var k = (Math.random() * n * n) | 0; if (mines[k] || safe.indexOf(k) >= 0) continue; mines[k] = 1; c++; }
      for (var q = 0; q < n * n; q++) cnt[q] = nbrs(q).filter(function (z) { return mines[z]; }).length; started = true;
    }
    function open(k) {
      var stack = [k]; while (stack.length) { var c = stack.pop(); if (rev[c]) continue; rev[c] = 1; if (!mines[c] && cnt[c] === 0) nbrs(c).forEach(function (z) { if (!rev[z]) stack.push(z); }); }
    }
    function cleared() { for (var k = 0; k < n * n; k++) if (!mines[k] && !rev[k]) return false; return true; }
    function reset() { lvl = 0; err = 0; pend = 0; load(0); st = 'play'; }
    function lay() { var W = api.w, H = api.h, cs = Math.min((W - 30) / NS[2], (H - 150) / NS[2], 54); return { cs: cs, x0: (W - n * cs) / 2, y0: 78 }; }
    function cpos(k) { var L = lay(); return { x: L.x0 + (k % n) * L.cs + L.cs / 2, y: L.y0 + ((k / n) | 0) * L.cs + L.cs / 2 }; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { var p = [], k; for (k = 0; k < n * n; k++) p.push(cpos(k)); return { st: st, lvl: lvl, n: n, mines: mines.slice(), rev: rev.slice(), started: started, err: err, pos: p, pend: pend }; },
      down: function (x, y) {
        if (menu()) return; if (pend > 0) return; var L = lay(), cx = Math.floor((x - L.x0) / L.cs), cy = Math.floor((y - L.y0) / L.cs);
        if (cx < 0 || cy < 0 || cx >= n || cy >= n) return; var k = cy * n + cx; if (rev[k]) return;
        if (!started) place(k);
        if (mines[k]) { rev[k] = 1; err++; if (api.nota) api.nota(120, 0.2, 'sawtooth', 0.06); if (err >= MAXE) { st = 'lose'; return; } }
        else { open(k); if (api.nota) api.nota(380, 0.04, 'square', 0.03); }
        if (cleared()) { lvl++; pend = 0.9; if (api.nota) api.nota(520, 0.2, 'triangle', 0.07); }
      },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) {
        if (st !== 'play') return;
        if (pend > 0) { pend -= dt; if (pend <= 0) { if (lvl >= NL) st = 'win'; else load(lvl); } }
      },
      draw: function () {
        var L = lay(), k; bg('#26301f', '#0a0e07'); var CL = ['', '#7ab8e8', '#8fe0a0', '#ff9a8d', '#c8a0f0', '#ffb070', '#70e0d0', '#f0e070', '#d0d0d0'];
        for (k = 0; k < n * n; k++) {
          var x = L.x0 + (k % n) * L.cs, y = L.y0 + ((k / n) | 0) * L.cs;
          g.fillStyle = rev[k] ? (mines[k] ? '#7a3a30' : 'rgba(255,255,255,.1)') : '#4f6a3a'; rr(x + 2, y + 2, L.cs - 4, L.cs - 4, 6); g.fill();
          if (rev[k]) { if (mines[k]) txt('⚔', x + L.cs / 2, y + L.cs / 2 + 1, L.cs * 0.5, '#ffd88a'); else if (cnt[k]) txt(String(cnt[k]), x + L.cs / 2, y + L.cs / 2 + 1, L.cs * 0.5, CL[cnt[k]]); }
        }
        hud(T.h1 + ' ' + Math.min(lvl + 1, NL) + '/' + NL, T.h2 + ' ' + err + '/' + MAXE, true);
        fim(st);
      }
    };

  }
});
