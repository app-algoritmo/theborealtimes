/* Kalevala, Runo 4 — salte de pedra em pedra até restar uma só. */
BTJogo.registrar({
  canvas: 'jogo-aino',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As pedras do lago",
    "sub": "Há 14 marcas ocupadas e 1 vazia num triângulo. Toque numa marca e depois na casa vazia, do outro lado de uma vizinha: você salta por cima e retira a vizinha. Deixe uma só marca, em até 150 segundos.",
    "perdeu": "Não deu para continuar",
    "v1": "Sobrou uma só!",
    "v2": "No Kalevala, Aino se joga no lago para escapar do casamento. O jogo de saltos num triângulo é invenção.",
    "h1": "Restam",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The stones of the lake",
    "sub": "A triangle has 14 occupied marks and 1 empty. Tap a mark and then the empty hole on the far side of a neighbour: you jump over it and remove it. Leave a single mark, within 150 seconds.",
    "perdeu": "No way to go on",
    "v1": "Only one is left!",
    "v2": "In the Kalevala, Aino throws herself into the lake to escape a marriage. The jumping game on a triangle is made up.",
    "h1": "Left",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Steinene i sjøen",
    "sub": "En trekant har 14 opptatte merker og 1 tomt. Trykk på et merke og så på det tomme hullet på den andre siden av en nabo: du hopper over og fjerner naboen. La ett eneste merke bli igjen, innen 150 sekunder.",
    "perdeu": "Ingen vei videre",
    "v1": "Bare ett er igjen!",
    "v2": "I Kalevala kaster Aino seg i sjøen for å slippe unna et giftermål. Hoppespillet på en trekant er diktet opp.",
    "h1": "Igjen",
    "h2": "Tid"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "Las piedras del lago",
    "sub": "Hay 14 marcas ocupadas y 1 vacía en un triángulo. Toca una marca y luego la casilla vacía, al otro lado de una vecina: saltas por encima y retiras la vecina. Deja una sola marca, en un máximo de 150 segundos.",
    "perdeu": "No se puede continuar",
    "v1": "¡Solo queda una!",
    "v2": "En el Kalevala, Aino se arroja al lago para escapar del matrimonio. El juego de saltos en un triángulo es un invento.",
    "h1": "Quedan",
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
    var R = 5, LIM = 150, DIRS = [[0, 1], [0, -1], [1, 0], [1, 1], [-1, 0], [-1, -1]];
    var peg = [], sel = -1, t = 0, sol = [], cur = 0, hist = [];
    function id(r, c) { return r * (r + 1) / 2 + c; }
    function valid(r, c) { return r >= 0 && r < R && c >= 0 && c <= r; }
    function rc(i) { var r = 0; while ((r + 1) * (r + 2) / 2 <= i) r++; return [r, i - r * (r + 1) / 2]; }
    function moves(p) { var out = []; for (var i = 0; i < 15; i++) { if (!p[i]) continue; var a = rc(i); DIRS.forEach(function (d) { var r1 = a[0] + d[0], c1 = a[1] + d[1], r2 = a[0] + 2 * d[0], c2 = a[1] + 2 * d[1]; if (valid(r2, c2) && valid(r1, c1) && p[id(r1, c1)] && !p[id(r2, c2)]) out.push([i, id(r1, c1), id(r2, c2)]); }); } return out; }
    function solve(p, memo) { var n = p.reduce(function (a, b) { return a + b; }, 0); if (n === 1) return []; var k = p.join(''); if (memo[k]) return null; var ms = moves(p); for (var i = 0; i < ms.length; i++) { var m = ms[i], q = p.slice(); q[m[0]] = 0; q[m[1]] = 0; q[m[2]] = 1; var r = solve(q, memo); if (r) return [m].concat(r); } memo[k] = 1; return null; }
    function gen() { var cands = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].sort(function () { return Math.random() - 0.5; }); for (var i = 0; i < cands.length; i++) { var p = []; for (var j = 0; j < 15; j++) p.push(j === cands[i] ? 0 : 1); var s = solve(p, {}); if (s) { peg = p; sol = s; return; } } peg = []; for (var j = 0; j < 15; j++) peg.push(j === 0 ? 0 : 1); sol = solve(peg, {}) || []; }
    function setup() { gen(); sel = -1; t = 0; hist = []; }
    function reset() { setup(); st = 'play'; }
    function count() { return peg.reduce(function (a, b) { return a + b; }, 0); }
    function press(i) { if (st !== 'play') return; if (peg[i]) { sel = sel === i ? -1 : i; return; } if (sel < 0) return; var m = moves(peg).filter(function (x) { return x[0] === sel && x[2] === i; })[0]; if (!m) { sel = -1; return; } peg[m[0]] = 0; peg[m[1]] = 0; peg[m[2]] = 1; sel = -1; if (api.nota) api.nota(380 + count() * 20, 0.07, 'triangle', 0.05); if (count() === 1) { st = 'win'; return; } if (!moves(peg).length) st = 'lose'; }
    function lay() { var W = api.w, H = api.h, cs = Math.max(40, Math.min((W - 30) / R, (H - 170) / (R * 0.88), 84)); return { cs: cs, cx: W / 2, y: Math.max(96, (H - cs * 0.866 * (R - 1)) / 2 + 6) }; }
    function pos(i) { var L = lay(), a = rc(i); return { x: L.cx + (a[1] - a[0] / 2) * L.cs, y: L.y + a[0] * L.cs * 0.866 }; }
    setup();
    return {
      pausar: function () {},
      dbg: function () { return { st: st, peg: peg.slice(), sol: sol.map(function (m) { return m.slice(); }), left: count(), sel: sel, t: t, tmr: LIM - t, pos: pos }; },
      down: function (x, y) { if (menu()) return; var L = lay(), best = -1, bd = 1e9; for (var i = 0; i < 15; i++) { var p = pos(i), d = Math.hypot(p.x - x, p.y - y); if (d < bd) { bd = d; best = i; } } if (bd < L.cs * 0.5) { cur = best; press(best); } },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } var a = rc(cur), r = a[0], c = a[1]; if (k === 'ArrowLeft') { if (c > 0) cur--; } else if (k === 'ArrowRight') { if (c < r) cur++; } else if (k === 'ArrowUp') { if (r > 0) cur = id(r - 1, Math.min(c, r - 1)); } else if (k === 'ArrowDown') { if (r < R - 1) cur = id(r + 1, c); } else if (k === 'Space' || k === 'Enter') press(cur); },
      update: function (dt) { if (st !== 'play') return; t += dt; if (t >= LIM) { t = LIM; st = 'lose'; } },
      draw: function () {
        var L = lay(), W = api.w, H = api.h, i;
        bg('#12263a', '#04080e');
        g.fillStyle = 'rgba(160,200,230,.08)'; g.beginPath(); g.moveTo(L.cx, L.y - L.cs * 0.6); g.lineTo(L.cx + (R / 2) * L.cs + L.cs * 0.5, L.y + (R - 1) * L.cs * 0.866 + L.cs * 0.5); g.lineTo(L.cx - (R / 2) * L.cs - L.cs * 0.5, L.y + (R - 1) * L.cs * 0.866 + L.cs * 0.5); g.closePath(); g.fill();
        for (i = 0; i < 15; i++) { var p = pos(i); g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.arc(p.x, p.y, L.cs * 0.3, 0, 6.283); g.fill(); if (peg[i]) { g.fillStyle = sel === i ? '#ffd88a' : '#8aa0b4'; g.beginPath(); g.arc(p.x, p.y, L.cs * 0.26, 0, 6.283); g.fill(); g.fillStyle = 'rgba(255,255,255,.25)'; g.beginPath(); g.arc(p.x - L.cs * 0.07, p.y - L.cs * 0.07, L.cs * 0.08, 0, 6.283); g.fill(); }
          if (cur === i && st === 'play') { g.strokeStyle = 'rgba(255,216,138,.7)'; g.lineWidth = 2; g.beginPath(); g.arc(p.x, p.y, L.cs * 0.34, 0, 6.283); g.stroke(); } }
        bar(W / 2 - 110, H - 14, 220, 5, (LIM - t) / LIM, LIM - t < 30 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + count(), T.h2 + ' ' + Math.ceil(LIM - t), false);
        fim(st);
      }
    };
  }
});
