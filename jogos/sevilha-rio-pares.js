/* Sevilha, 844 — ligue os pares do mapa do rio sem cruzar caminhos. */
BTJogo.registrar({
  canvas: 'jogo-sevilha',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O mapa do rio",
    "sub": "Arraste do ponto de uma cor até o outro ponto da mesma cor, passando por casas vizinhas. Os caminhos não podem se cruzar: um novo caminho corta o que estiver no seu trajeto. Ligue os 5 pares em até 90 segundos.",
    "perdeu": "O tempo acabou",
    "v1": "Todos os pares estão ligados!",
    "v2": "Em 844, os vikings subiram o rio Guadalquivir até Sevilha. O mapa e os pares são invenção do jogo.",
    "h1": "Pares",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The river map",
    "sub": "Drag from a dot of one colour to the other dot of the same colour through neighbouring squares. Paths cannot cross: a new path cuts whatever lies in its way. Connect all 5 pairs within 90 seconds.",
    "perdeu": "The time ran out",
    "v1": "Every pair is connected!",
    "v2": "In 844 the Vikings sailed up the Guadalquivir river to Seville. The map and the pairs are made up for the game.",
    "h1": "Pairs",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Elvekartet",
    "sub": "Dra fra en prikk av én farge til den andre prikken av samme farge gjennom nabo-ruter. Stiene kan ikke krysse hverandre: en ny sti kapper det som ligger i veien. Koble alle 5 parene på 90 sekunder.",
    "perdeu": "Tiden gikk ut",
    "v1": "Alle parene er koblet!",
    "v2": "I 844 seilte vikingene opp elven Guadalquivir til Sevilla. Kartet og parene er diktet opp for spillet.",
    "h1": "Par",
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
    var N = 6, K = 5, LIM = 90, COLS = ['#d8493a', '#4a8ad0', '#7fc06a', '#e0b840', '#b06ac0'];
    var ends = [], sol = [], paths = [], act = -1, t = 0, cur = { r: 0, c: 0 }, kdraw = false, done = 0;
    function lay() { var W = api.w, H = api.h, cs = Math.max(40, Math.min((W - 24) / N, (H - 170) / N, 80)); return { cs: cs, x: (W - cs * N) / 2, y: Math.max(90, (H - cs * N) / 2 + 8) }; }
    function gen() { for (var tr = 0; tr < 4000; tr++) { var gr = []; for (var i = 0; i < N * N; i++) gr.push(-1); var ps = [], okk = true; for (var k = 0; k < K && okk; k++) { var fr = []; gr.forEach(function (v, i) { if (v < 0) fr.push(i); }); var s = fr[Math.floor(Math.random() * fr.length)], p = [s]; gr[s] = k; var maxl = 5 + Math.floor(Math.random() * 6); while (p.length < maxl) { var c = p[p.length - 1], r0 = Math.floor(c / N), c0 = c % N, nb = []; [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) { var rr_ = r0 + d[0], cc = c0 + d[1]; if (rr_ >= 0 && cc >= 0 && rr_ < N && cc < N && gr[rr_ * N + cc] < 0) nb.push(rr_ * N + cc); }); if (!nb.length) break; var nx = nb[Math.floor(Math.random() * nb.length)]; gr[nx] = k; p.push(nx); } if (p.length < 4) okk = false; ps.push(p); } var cov = gr.filter(function (v) { return v >= 0; }).length; if (okk && cov >= 28) { sol = ps; ends = ps.map(function (p) { return [p[0], p[p.length - 1]]; }); return; } } }
    function setup() { gen(); paths = ends.map(function () { return []; }); act = -1; t = 0; done = 0; kdraw = false; }
    function reset() { setup(); st = 'play'; }
    function cellAt(x, y) { var L = lay(), c = Math.floor((x - L.x) / L.cs), r = Math.floor((y - L.y) / L.cs); if (r < 0 || c < 0 || r >= N || c >= N) return -1; return r * N + c; }
    function owner(ci) { for (var k = 0; k < K; k++) if (paths[k].indexOf(ci) >= 0) return k; return -1; }
    function endOf(ci) { for (var k = 0; k < K; k++) if (ends[k][0] === ci || ends[k][1] === ci) return k; return -1; }
    function complete(k) { var p = paths[k]; return p.length > 1 && ((p[0] === ends[k][0] && p[p.length - 1] === ends[k][1]) || (p[0] === ends[k][1] && p[p.length - 1] === ends[k][0])); }
    function count() { var n = 0; for (var k = 0; k < K; k++) if (complete(k)) n++; return n; }
    function adj(a, b) { var d = Math.abs(a - b); return (d === N) || (d === 1 && Math.floor(a / N) === Math.floor(b / N)); }
    function begin(ci) { var k = endOf(ci); if (k < 0) { var o = owner(ci); if (o < 0) return; k = o; var i = paths[k].indexOf(ci); paths[k] = paths[k].slice(0, i + 1); act = k; return; } paths[k] = [ci]; act = k; }
    function extend(ci) { if (act < 0) return; var p = paths[act], last = p[p.length - 1]; if (ci === last) return; if (!adj(last, ci)) return; var i = p.indexOf(ci); if (i >= 0) { paths[act] = p.slice(0, i + 1); return; }
      var e = endOf(ci); if (e >= 0 && e !== act) return; if (complete(act)) return;
      var o = owner(ci); if (o >= 0 && o !== act) { var q = paths[o], j = q.indexOf(ci); paths[o] = q.slice(0, j); if (paths[o].length < 2 && paths[o].length) paths[o] = [paths[o][0]]; }
      paths[act].push(ci); if (api.nota) api.nota(300 + paths[act].length * 30, 0.03, 'triangle', 0.03); }
    function check() { var n = count(); if (n > done && api.nota) api.nota(660, 0.12, 'triangle', 0.05); done = n; if (n >= K) { st = 'win'; act = -1; } }
    setup();
    return {
      pausar: function () { act = -1; },
      dbg: function () { var L = lay(); return { st: st, ends: ends.map(function (e) { return e.slice(); }), sol: sol.map(function (p) { return p.slice(); }), paths: paths.map(function (p) { return p.slice(); }), done: count(), tmr: LIM - t, pos: function (ci) { return { x: L.x + (ci % N + 0.5) * L.cs, y: L.y + (Math.floor(ci / N) + 0.5) * L.cs }; } }; },
      down: function (x, y) { if (menu()) return; var ci = cellAt(x, y); if (ci >= 0) { cur = { r: Math.floor(ci / N), c: ci % N }; begin(ci); } },
      move: function (x, y, pr) { if (st !== 'play' || act < 0 || !pr) return; var ci = cellAt(x, y); if (ci >= 0) { extend(ci); check(); } },
      up: function () { act = -1; },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'Space' || k === 'Enter') { if (act >= 0) { act = -1; kdraw = false; } else { begin(cur.r * N + cur.c); kdraw = act >= 0; } return; }
        var dr = 0, dc = 0; if (k === 'ArrowUp') dr = -1; else if (k === 'ArrowDown') dr = 1; else if (k === 'ArrowLeft') dc = -1; else if (k === 'ArrowRight') dc = 1; else return;
        var nr = cur.r + dr, nc = cur.c + dc; if (nr < 0 || nc < 0 || nr >= N || nc >= N) return; cur = { r: nr, c: nc }; if (act >= 0) { extend(nr * N + nc); check(); } },
      update: function (dt) { if (st !== 'play') return; t += dt; if (t >= LIM) { t = LIM; st = 'lose'; } },
      draw: function () {
        var L = lay(), W = L.W || api.w, H = api.h, r, c, k, i;
        bg('#14283a', '#050a10');
        g.fillStyle = 'rgba(0,0,0,.35)'; rr(L.x - 5, L.y - 5, L.cs * N + 10, L.cs * N + 10, 10); g.fill();
        for (r = 0; r < N; r++) for (c = 0; c < N; c++) { g.fillStyle = 'rgba(255,255,255,.05)'; g.fillRect(L.x + c * L.cs + 1, L.y + r * L.cs + 1, L.cs - 2, L.cs - 2); }
        for (k = 0; k < K; k++) { var p = paths[k]; if (p.length > 1) { g.strokeStyle = COLS[k]; g.lineWidth = L.cs * 0.34; g.lineCap = 'round'; g.lineJoin = 'round'; g.globalAlpha = complete(k) ? 1 : 0.8; g.beginPath(); for (i = 0; i < p.length; i++) { var x = L.x + (p[i] % N + 0.5) * L.cs, y = L.y + (Math.floor(p[i] / N) + 0.5) * L.cs; if (i) g.lineTo(x, y); else g.moveTo(x, y); } g.stroke(); g.globalAlpha = 1; } }
        for (k = 0; k < K; k++) ends[k].forEach(function (ci) { g.fillStyle = COLS[k]; g.beginPath(); g.arc(L.x + (ci % N + 0.5) * L.cs, L.y + (Math.floor(ci / N) + 0.5) * L.cs, L.cs * 0.28, 0, 6.283); g.fill(); g.strokeStyle = 'rgba(255,255,255,.6)'; g.lineWidth = 2; g.stroke(); });
        if (st === 'play') { g.strokeStyle = 'rgba(255,216,138,.7)'; g.lineWidth = 2; g.strokeRect(L.x + cur.c * L.cs + 2, L.y + cur.r * L.cs + 2, L.cs - 4, L.cs - 4); }
        bar(W / 2 - 110, H - 14, 220, 5, (LIM - t) / LIM, LIM - t < 20 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + count() + '/' + K, T.h2 + ' ' + Math.ceil(LIM - t), false);
        fim(st);
      }
    };
  }
});
