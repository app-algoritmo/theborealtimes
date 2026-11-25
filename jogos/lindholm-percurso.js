/* Lindholm Høje — percorra o barco de pedra sem repetir nenhuma. */
BTJogo.registrar({
  canvas: 'jogo-lindholm',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O contorno do barco",
    "sub": "Comece pela marca dourada. Toque numa marca vizinha (ao lado, em cima ou embaixo) para avançar. Passe por todas, uma única vez cada. Para voltar um passo, toque na marca onde está (ou use Backspace). Setas também movem. O tempo é limitado.",
    "perdeu": "O tempo acabou no meio do caminho",
    "v1": "Você percorreu o barco inteiro!",
    "v2": "Em Lindholm Høje há sepulturas com pedras postas em forma de barco. O percurso do jogo é invenção.",
    "h1": "Percurso",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The ship's outline",
    "sub": "Start at the golden mark. Tap a neighbouring mark (beside, above or below) to move on. Pass through all of them, once each. To step back, tap the mark you are on (or press Backspace). Arrows move too. Time is limited.",
    "perdeu": "Time ran out halfway along the route",
    "v1": "You walked the whole ship!",
    "v2": "At Lindholm Høje there are graves with markers set in the shape of a ship. The route in the game is made up.",
    "h1": "Route",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Skipets omriss",
    "sub": "Start ved det gylne merket. Trykk på et nabomerke (ved siden av, over eller under) for å gå videre. Gå innom alle, én gang hver. For å gå ett steg tilbake, trykk på merket du står på (eller bruk Backspace). Piltastene flytter også. Tiden er begrenset.",
    "perdeu": "Tiden gikk ut midt på ruta",
    "v1": "Du gikk hele skipet rundt!",
    "v2": "På Lindholm Høje finnes graver med markeringer lagt i form av et skip. Ruten i spillet er diktet opp.",
    "h1": "Rute",
    "h2": "Tid"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "El contorno del barco",
    "sub": "Empieza por la marca dorada. Toca una marca vecina (al lado, arriba o abajo) para avanzar. Pasa por todas, una sola vez cada una. Para retroceder un paso, toca la marca donde estás (o usa Retroceso). Las flechas también mueven. El tiempo es limitado.",
    "perdeu": "El tiempo se acabó a mitad de camino",
    "v1": "¡Recorriste el barco entero!",
    "v2": "En Lindholm Høje hay sepulturas con piedras dispuestas en forma de barco. El recorrido del juego es invención.",
    "h1": "Recorrido",
    "h2": "Tiempo"
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
    var LIM = 150;
    var MASKS = [['.XXXXXXX.', 'XXXXXXXXX', '..XXXXX..'], ['XXXXXXXX.', 'XXXXXXXXX', '..XXXXX..']];
    var cells = [], idx = {}, path = [], start = 0, tmr = LIM, pop = 0, mw = 9, mh = 3, flip = false, cur = 0, bump = 0;
    function lay() { var W = api.w, H = api.h, cs = Math.min((W - 40) / mw, (H - 190) / (mh + 1), 70); return { cs: cs, x: (W - cs * mw) / 2, y: Math.max(100, (H - cs * mh) / 2 + 10) }; }
    function cp(i) { var L = lay(), c = cells[i]; return { x: L.x + (c[1] + 0.5) * L.cs, y: L.y + (c[0] + 0.5) * L.cs }; }
    function nbrs(i) { var c = cells[i], o = []; [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) { var k = idx[(c[0] + d[0]) + ',' + (c[1] + d[1])]; if (k !== undefined) o.push(k); }); return o; }
    function solveFrom(s) { var vis = {}, n = cells.length, cnt = 0; vis[s] = 1; function d(p, k) { if (k === n) return true; if (++cnt > 60000) return false; var a = nbrs(p); for (var j = 0; j < a.length; j++) if (!vis[a[j]]) { vis[a[j]] = 1; if (d(a[j], k + 1)) return true; vis[a[j]] = 0; } return false; } return d(s, 1); }
    function setup() { var m = MASKS[Math.floor(Math.random() * MASKS.length)]; flip = Math.random() < 0.5; mh = m.length; mw = m[0].length; cells = []; idx = {};
      for (var r = 0; r < mh; r++) for (var c = 0; c < mw; c++) if (m[flip ? mh - 1 - r : r][c] === 'X') { idx[r + ',' + c] = cells.length; cells.push([r, c]); }
      var ok = []; for (var i = 0; i < cells.length; i++) if (solveFrom(i)) ok.push(i); start = ok[Math.floor(Math.random() * ok.length)]; path = [start]; cur = start; tmr = LIM; bump = 0; }
    function reset() { setup(); st = 'play'; }
    function stepTo(k) {
      if (st !== 'play') return; var last = path[path.length - 1];
      if (k === last) { if (path.length > 1) { path.pop(); cur = path[path.length - 1]; } return; }
      if (path.indexOf(k) >= 0) { bump = 0.3; return; } if (nbrs(last).indexOf(k) < 0) { bump = 0.3; return; }
      path.push(k); cur = k; if (api.nota) api.nota(300 + path.length * 14, 0.06, 'triangle', 0.05); if (path.length === cells.length) st = 'win';
    }
    setup();
    return {
      pausar: function () {},
      dbg: function () { return { st: st, cells: cells, path: path.slice(), nbrs: nbrs, pos: cp, start: start, tmr: tmr }; },
      down: function (x, y) { if (menu()) return; var best = -1, bd = 1e9, L = lay(); for (var i = 0; i < cells.length; i++) { var p = cp(i), d = Math.hypot(p.x - x, p.y - y); if (d < bd) { bd = d; best = i; } } if (best >= 0 && bd < L.cs * 0.6) stepTo(best); },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } var last = path[path.length - 1], c = cells[last], dr = 0, dc = 0;
        if (k === 'Backspace' || k === 'KeyZ') { if (path.length > 1) { path.pop(); cur = path[path.length - 1]; } return; }
        if (k === 'ArrowUp' || k === 'KeyW') dr = -1; else if (k === 'ArrowDown' || k === 'KeyS') dr = 1; else if (k === 'ArrowLeft' || k === 'KeyA') dc = -1; else if (k === 'ArrowRight' || k === 'KeyD') dc = 1; else return;
        var q = idx[(c[0] + dr) + ',' + (c[1] + dc)]; if (q !== undefined) stepTo(q); else bump = 0.3; },
      update: function (dt) { pop += dt; if (bump > 0) bump -= dt; if (st !== 'play') return; tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; } },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), i;
        bg('#1a2a30', '#070d10');
        g.strokeStyle = 'rgba(255,255,255,.1)'; g.lineWidth = 2; for (i = 0; i < cells.length; i++) nbrs(i).forEach(function (j) { if (j > i) { var a = cp(i), b = cp(j); g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke(); } });
        g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = '#ffd88a'; g.lineWidth = 7; g.beginPath(); path.forEach(function (k, n) { var p = cp(k); if (n) g.lineTo(p.x, p.y); else g.moveTo(p.x, p.y); }); g.stroke();
        for (i = 0; i < cells.length; i++) { var p = cp(i), vis = path.indexOf(i) >= 0, rd = L.cs * 0.3; g.fillStyle = vis ? '#ffd88a' : '#7a8a90'; g.beginPath(); g.arc(p.x, p.y, rd, 0, 6.283); g.fill(); if (i === start) { g.strokeStyle = '#fff'; g.lineWidth = 3; g.beginPath(); g.arc(p.x, p.y, rd + 5 + Math.sin(pop * 4) * 2, 0, 6.283); g.stroke(); }
          if (i === path[path.length - 1] && st === 'play') { g.strokeStyle = bump > 0 ? '#c0392b' : '#fff'; g.lineWidth = 3; g.beginPath(); g.arc(p.x, p.y, rd + 3, 0, 6.283); g.stroke(); } }
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 30 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + path.length + '/' + cells.length, T.h2 + ' ' + Math.ceil(tmr), false);
        fim(st);
      }
    };
  }
});
