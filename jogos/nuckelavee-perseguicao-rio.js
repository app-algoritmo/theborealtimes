/* Nuckelavee — fuga até a água doce corrente (invenção). */
BTJogo.registrar({
  canvas: 'jogo-nuckelavee',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O nuckelavee na charneca",
    "sub": "Chegue ao rio, na coluna da direita, antes que o nuckelavee o alcance. Ele dá um passo atrás de você a cada passo seu e não entra na água. Toque numa casa vizinha ou use as setas. As pedras barram os dois. Até 30 passos.",
    "perdeu": "O nuckelavee alcançou você",
    "v1": "A água corrente está entre vocês!",
    "v2": "O nuckelavee é uma criatura de Orkney, escocesa, que não suporta água doce corrente, e a vítima pode escapar atravessando um rio ou riacho; o registro escrito mais antigo vem de Walter Traill Dennison, entre 1880 e 1894. A charneca é invenção.",
    "h1": "Passos",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The nuckelavee on the moor",
    "sub": "Reach the river, in the right-hand column, before the nuckelavee catches you. It takes one step after you for each of yours and will not enter the water. Tap a neighbouring square or use the arrows. Stones block both of you. Up to 30 steps.",
    "perdeu": "The nuckelavee caught you",
    "v1": "Running water lies between you!",
    "v2": "The nuckelavee is a creature of Orkney, in Scotland, that cannot bear fresh running water, and a victim can escape by crossing a river or stream; the main early written record is by Walter Traill Dennison, between 1880 and 1894. The moor is invented.",
    "h1": "Steps",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Nuckelaveen på heia",
    "sub": "Nå elva, i kolonnen til høyre, før nuckelaveen tar deg igjen. Den tar ett skritt etter deg for hvert av dine og går ikke ut i vannet. Trykk på en nabo-rute eller bruk piltastene. Steiner stenger for dere begge. Opptil 30 skritt.",
    "perdeu": "Nuckelaveen tok deg igjen",
    "v1": "Rennende vann ligger mellom dere!",
    "v2": "Nuckelaveen er et vesen fra Orknøyene i Skottland som ikke tåler rennende ferskvann, og et offer kan slippe unna ved å krysse en elv eller bekk; den viktigste tidlige skriftlige kilden er Walter Traill Dennison, mellom 1880 og 1894. Heia er oppfunnet.",
    "h1": "Skritt",
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
    var N = 7, MAXS = 30, LIM = 240;
    var walls = [], P = [3, 0], M = [3, 4], steps = 0, t = 0, sol = [], caught = 0;
    var DR = [-1, 1, 0, 0], DC = [0, 0, -1, 1], KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    function isW(w, r, c) { return w[r * N + c]; }
    function mstep(w, p, m) {
      var best = null, bd = 1e9;
      for (var d = 0; d < 4; d++) { var r = m[0] + DR[d], c = m[1] + DC[d]; if (r < 0 || r >= N || c < 0 || c >= N - 1 || isW(w, r, c)) continue; var dd = Math.abs(r - p[0]) + Math.abs(c - p[1]); if (dd < bd) { bd = dd; best = [r, c]; } }
      return best || m;
    }
    function solve(w, p0, m0) {
      var seen = {}, q = [[p0, m0, []]]; seen[p0 + ';' + m0] = 1;
      while (q.length) {
        var nq = [];
        for (var k = 0; k < q.length; k++) {
          var cur = q[k];
          for (var d = 0; d < 4; d++) {
            var r = cur[0][0] + DR[d], c = cur[0][1] + DC[d]; if (r < 0 || r >= N || c < 0 || c >= N || isW(w, r, c)) continue;
            if (r === cur[1][0] && c === cur[1][1]) continue;
            var path = cur[2].concat([d]); if (c === N - 1) return path;
            var nm = mstep(w, [r, c], cur[1]); if (nm[0] === r && nm[1] === c) continue;
            var key = r + ',' + c + ';' + nm; if (seen[key] || path.length >= MAXS - 2) continue; seen[key] = 1; nq.push([[r, c], nm, path]);
          }
        }
        q = nq;
      }
      return null;
    }
    function gen() {
      for (var tr = 0; tr < 3000; tr++) {
        var w = []; for (var i = 0; i < N * N; i++) w.push(0);
        var nw = 8 + Math.floor(Math.random() * 5);
        for (var k = 0; k < nw; k++) { var r = Math.floor(Math.random() * N), c = 1 + Math.floor(Math.random() * (N - 2)); w[r * N + c] = 1; }
        var p0 = [Math.floor(Math.random() * N), 0], m0 = [Math.floor(Math.random() * N), 3 + Math.floor(Math.random() * 2)];
        if (isW(w, p0[0], p0[1]) || isW(w, m0[0], m0[1])) continue;
        var s = solve(w, p0, m0);
        if (s && s.length >= 9 && s.length <= 16) { walls = w; P = p0; M = m0; sol = s; return; }
      }
      walls = []; for (var j = 0; j < N * N; j++) walls.push(0); P = [3, 0]; M = [3, 4]; sol = solve(walls, P, M) || [];
    }
    function reset() { gen(); steps = 0; t = 0; caught = 0; st = 'play'; }
    function lay() { var W = api.w, H = api.h, cs = Math.max(30, Math.min((W - 24) / N, (H - 150) / N, 62)); return { cs: cs, x0: (W - cs * N) / 2, y0: 80 + Math.max(0, (H - 140 - cs * N) / 2) }; }
    function cpos(r, c) { var L = lay(); return { x: L.x0 + (c + 0.5) * L.cs, y: L.y0 + (r + 0.5) * L.cs }; }
    function go(d) {
      if (st !== 'play') return; var r = P[0] + DR[d], c = P[1] + DC[d]; if (r < 0 || r >= N || c < 0 || c >= N || isW(walls, r, c)) return;
      if (r === M[0] && c === M[1]) { st = 'lose'; return; }
      P = [r, c]; steps++; if (api.nota) api.nota(260, 0.05, 'triangle', 0.04);
      if (c === N - 1) { st = 'win'; return; }
      M = mstep(walls, P, M); if (M[0] === P[0] && M[1] === P[1]) { st = 'lose'; return; }
      if (steps >= MAXS) st = 'lose';
    }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, P: P.slice(), M: M.slice(), walls: walls.slice(), steps: steps, t: t, sol: sol.slice(), keys: KEYS }; },
      down: function (x, y) { if (menu()) return; if (st !== 'play') return; var L = lay(), c = Math.floor((x - L.x0) / L.cs), r = Math.floor((y - L.y0) / L.cs); if (r < 0 || r >= N || c < 0 || c >= N) return; for (var d = 0; d < 4; d++) if (P[0] + DR[d] === r && P[1] + DC[d] === c) { go(d); return; } },
      move: function () {}, up: function () {},
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } var i = KEYS.indexOf(k); if (i >= 0) go(i); },
      update: function (dt) { if (st !== 'play') return; t += dt; if (t >= LIM) st = 'lose'; },
      draw: function () {
        var L = lay(), r, c; bg('#1b2a2a', '#070d0d');
        for (r = 0; r < N; r++) for (c = 0; c < N; c++) {
          var p = cpos(r, c); g.fillStyle = c === N - 1 ? '#2a6aa8' : isW(walls, r, c) ? '#5a5a5a' : ((r + c) % 2 ? '#2f4a2c' : '#35542f'); rr(p.x - L.cs / 2 + 1, p.y - L.cs / 2 + 1, L.cs - 2, L.cs - 2, 4); g.fill();
        }
        var a = cpos(P[0], P[1]), m = cpos(M[0], M[1]);
        g.beginPath(); g.arc(a.x, a.y, L.cs * 0.32, 0, 6.2832); g.fillStyle = '#f0c15a'; g.fill();
        g.beginPath(); g.arc(m.x, m.y, L.cs * 0.36, 0, 6.2832); g.fillStyle = '#a8322c'; g.fill(); g.fillStyle = '#ffdd55'; g.beginPath(); g.arc(m.x, m.y - L.cs * 0.05, L.cs * 0.09, 0, 6.2832); g.fill();
        bar(api.w / 2 - 110, api.h - 14, 220, 5, (LIM - t) / LIM, LIM - t < 40 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + steps + '/' + MAXS, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };

  }
});
