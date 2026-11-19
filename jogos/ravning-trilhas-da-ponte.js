/* Ponte de Ravning Enge — as trilhas da ponte (invenção). */
BTJogo.registrar({
  canvas: 'jogo-ravning',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As trilhas da ponte",
    "sub": "Cada cor tem duas pontas marcadas com um círculo. Arraste o dedo de uma ponta até a outra, passando por casas vazias, para desenhar a trilha daquela cor. As trilhas não podem se cruzar nem passar por casas ocupadas por outra cor. Ligue todos os pares. Para refazer uma trilha, comece de novo por uma das pontas dela. O tempo é limitado. São 3 quadros.",
    "perdeu": "O tempo acabou antes de as trilhas se ligarem",
    "v1": "Todas as trilhas ligadas!",
    "v2": "A ponte de Ravning Enge, no vale do rio Vejle, na Dinamarca, tinha cerca de 760 metros e 280 vãos de carvalho; a madeira foi cortada na década de 980, e a obra é atribuída a Harald Dente Azul. Ligar trilhas é invenção.",
    "h1": "Quadro",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The paths of the bridge",
    "sub": "Each colour has two ends marked with a circle. Drag your finger from one end to the other, through empty squares, to draw that colour’s path. Paths cannot cross or pass through squares held by another colour. Join every pair. To redo a path, start again from one of its ends. Time is limited. There are 3 boards.",
    "perdeu": "Time ran out before the paths were joined",
    "v1": "Every path joined!",
    "v2": "The Ravning Enge bridge, in the Vejle river valley in Denmark, was about 760 metres long with 280 oak spans; the timber was felled in the 980s, and the work is attributed to Harald Bluetooth. Joining paths is invented.",
    "h1": "Board",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Stiene på broen",
    "sub": "Hver farge har to ender merket med en sirkel. Dra fingeren fra den ene enden til den andre, gjennom tomme ruter, for å tegne stien til den fargen. Stiene kan ikke krysse hverandre eller gå gjennom ruter som en annen farge har tatt. Knytt sammen alle parene. For å gjøre en sti om, begynn på nytt fra en av endene. Tiden er begrenset. Det er 3 brett.",
    "perdeu": "Tiden gikk ut før stiene var knyttet sammen",
    "v1": "Alle stiene er knyttet sammen!",
    "v2": "Broen ved Ravning Enge, i Vejle-dalen i Danmark, var omtrent 760 meter lang med 280 spenn i eik; tømmeret ble felt på 980-tallet, og verket tilskrives Harald Blåtann. Å knytte sammen stier er oppfunnet.",
    "h1": "Brett",
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
    var NS = [4, 5, 6], NP = [3, 4, 5], NL = 3, LIM = 300, COL = ['#e07a6a', '#6aa8e0', '#7cc47a', '#e0c25a', '#b080e0'], DXY = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    var lvl = 0, n = 0, sol = [], ends = [], paths = [], cur = -1, t = 0, pend = 0, down_ = false;
    function genPaths(N, K) {
      var used = [], out = [], k, tries;
      for (k = 0; k < N * N; k++) used[k] = 0;
      for (var c = 0; c < K; c++) {
        var ok = false;
        for (tries = 0; tries < 400 && !ok; tries++) {
          var s = (Math.random() * N * N) | 0; if (used[s]) continue; var len = 3 + ((Math.random() * (N - 1)) | 0), p = [s], loc = {}; loc[s] = 1;
          while (p.length < len) {
            var l = p[p.length - 1], o = [0, 1, 2, 3].sort(function () { return Math.random() - 0.5; }), moved = false;
            for (var i = 0; i < 4; i++) { var x = l % N + DXY[o[i]][0], y = ((l / N) | 0) + DXY[o[i]][1]; if (x < 0 || y < 0 || x >= N || y >= N) continue; var q = y * N + x; if (used[q] || loc[q]) continue; p.push(q); loc[q] = 1; moved = true; break; }
            if (!moved) break;
          }
          var a = p[0], b = p[p.length - 1], md = Math.abs(a % N - b % N) + Math.abs(((a / N) | 0) - ((b / N) | 0));
          if (p.length >= 3 && md >= 2) { p.forEach(function (q) { used[q] = 1; }); out.push(p); ok = true; }
        }
        if (!ok) return null;
      }
      return out;
    }
    function owner(k) { for (var c = 0; c < paths.length; c++) if (paths[c].indexOf(k) >= 0) return c; return -1; }
    function endOf(k) { for (var c = 0; c < ends.length; c++) if (ends[c][0] === k || ends[c][1] === k) return c; return -1; }
    function complete(c) { var p = paths[c]; return p.length > 1 && endOf(p[p.length - 1]) === c && p[p.length - 1] !== p[0]; }
    function allDone() { for (var c = 0; c < ends.length; c++) if (!complete(c)) return false; return true; }
    function load(i) {
      n = NS[i]; var p = null; while (!p) p = genPaths(n, NP[i]);
      sol = p; ends = p.map(function (q) { return [q[0], q[q.length - 1]]; }); paths = ends.map(function () { return []; }); cur = -1;
    }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function lay() { var W = api.w, H = api.h, cs = Math.min((W - 30) / NS[2], (H - 150) / NS[2], 64); return { cs: cs, x0: (W - n * cs) / 2, y0: 78 }; }
    function cpos(k) { var L = lay(); return { x: L.x0 + (k % n) * L.cs + L.cs / 2, y: L.y0 + ((k / n) | 0) * L.cs + L.cs / 2 }; }
    function cellAt(x, y) { var L = lay(), cx = Math.floor((x - L.x0) / L.cs), cy = Math.floor((y - L.y0) / L.cs); if (cx < 0 || cy < 0 || cx >= n || cy >= n) return -1; return cy * n + cx; }
    function adj(a, b) { return Math.abs(a % n - b % n) + Math.abs(((a / n) | 0) - ((b / n) | 0)) === 1; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { var p = [], k; for (k = 0; k < n * n; k++) p.push(cpos(k)); return { st: st, lvl: lvl, n: n, sol: sol.map(function (q) { return q.slice(); }), paths: paths.map(function (q) { return q.slice(); }), pos: p, pend: pend }; },
      down: function (x, y) {
        if (menu()) return; if (pend > 0) return; var k = cellAt(x, y); if (k < 0) return; var e = endOf(k);
        if (e >= 0) { paths[e] = [k]; cur = e; }
        else { var o = owner(k); if (o >= 0) { paths[o] = paths[o].slice(0, paths[o].indexOf(k) + 1); cur = o; } }
      },
      move: function (x, y) {
        if (cur < 0 || pend > 0 || st !== 'play') return; var k = cellAt(x, y); if (k < 0) return; var p = paths[cur], last = p[p.length - 1]; if (k === last || !adj(last, k)) return;
        if (p.length > 1 && p[p.length - 2] === k) { p.pop(); return; }
        if (complete(cur)) return; var i = p.indexOf(k); if (i >= 0) { paths[cur] = p.slice(0, i + 1); return; }
        var e = endOf(k); if (e >= 0 && e !== cur) return; var o = owner(k); if (o >= 0 && o !== cur) return; p.push(k);
        if (api.nota) api.nota(300 + p.length * 20, 0.03, 'sine', 0.03);
      },
      up: function () { cur = -1; if (st === 'play' && pend <= 0 && allDone()) { lvl++; pend = 0.9; if (api.nota) api.nota(520, 0.2, 'triangle', 0.07); } },
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) {
        if (st !== 'play') return; t += dt;
        if (pend > 0) { pend -= dt; if (pend <= 0) { if (lvl >= NL) st = 'win'; else load(lvl); } }
        if (st === 'play' && t >= LIM) st = 'lose';
      },
      draw: function () {
        var L = lay(), k, c, j; bg('#1f2a30', '#070c10');
        for (k = 0; k < n * n; k++) { var x = L.x0 + (k % n) * L.cs, y = L.y0 + ((k / n) | 0) * L.cs; g.fillStyle = 'rgba(255,255,255,.06)'; rr(x + 2, y + 2, L.cs - 4, L.cs - 4, 6); g.fill(); }
        for (c = 0; c < paths.length; c++) {
          var p = paths[c]; if (p.length > 1) { g.strokeStyle = COL[c]; g.lineWidth = L.cs * 0.3; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); for (j = 0; j < p.length; j++) { var q = cpos(p[j]); g[j ? 'lineTo' : 'moveTo'](q.x, q.y); } g.stroke(); g.lineCap = 'butt'; }
          [ends[c][0], ends[c][1]].forEach(function (e) { var q = cpos(e); g.fillStyle = COL[c]; g.beginPath(); g.arc(q.x, q.y, L.cs * 0.3, 0, 6.2832); g.fill(); g.strokeStyle = '#f3ecd2'; g.lineWidth = 2; g.stroke(); });
        }
        bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 60 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + Math.min(lvl + 1, NL) + '/' + NL, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };

  }
});
