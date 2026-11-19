/* Borre — percorra cada fio do nó exatamente uma vez (invenção). */
BTJogo.registrar({
  canvas: 'jogo-borre',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O nó de Borre",
    "sub": "Um nó de fios liga os pontos do quadro. Toque num ponto para começar e depois, um a um, nos pontos vizinhos para percorrer os fios: cada fio deve ser percorrido uma vez, nem mais nem menos, sem tirar o dedo do traço. Tocar num ponto sem fio livre até ele, ou ficar preso num ponto sem fio livre, é um erro e o nó é desfeito. Três erros encerram o jogo.",
    "perdeu": "Três erros: o nó se desfez",
    "v1": "O nó está fechado!",
    "v2": "O cemitério de Borre, em Vestfold, na Noruega, tem sete grandes montes e 21 menores. O estilo Borre, ligado ao local, é conhecido por enfeites de animais e nós, usados muitas vezes em arreios. O nó de um só traço é invenção.",
    "h1": "Fios",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Borre's knot",
    "sub": "A knot of threads joins the points on the board. Tap a point to start and then, one by one, the neighbouring points to run along the threads: each thread must be run exactly once, no more and no less, without lifting your finger from the line. Tapping a point with no free thread leading to it, or getting stuck at a point with no free thread, is a mistake and the knot is undone. Three mistakes end the game.",
    "perdeu": "Three mistakes: the knot came undone",
    "v1": "The knot is closed!",
    "v2": "The Borre mound cemetery, in Vestfold, Norway, has seven large mounds and 21 smaller ones. The Borre style, tied to the place, is known for animal and knot ornaments, often used on harnesses. The one-stroke knot is invented.",
    "h1": "Threads",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Borreknuten",
    "sub": "En knute av tråder knytter sammen punktene på brettet. Trykk på et punkt for å begynne og deretter, ett etter ett, på nabopunktene for å følge trådene: hver tråd skal følges nøyaktig én gang, verken mer eller mindre, uten å løfte fingeren fra streken. Å trykke på et punkt uten fri tråd dit, eller å bli sittende fast i et punkt uten fri tråd, er en feil, og knuten løses opp. Tre feil avslutter spillet.",
    "perdeu": "Tre feil: knuten løste seg opp",
    "v1": "Knuten er lukket!",
    "v2": "Gravfeltet ved Borre i Vestfold i Norge har sju store hauger og 21 mindre. Borrestilen, knyttet til stedet, er kjent for dyre- og knuteornamenter, ofte brukt på seletøy. Knuten i én strek er oppfunnet.",
    "h1": "Tråder",
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
    var MAXE = 3;
    var GRS = [];
    GRS.push({ v: [[0.2, 0.45], [0.8, 0.45], [0.2, 0.9], [0.8, 0.9], [0.5, 0.1]], e: [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3], [0, 4], [1, 4]] });
    (function () {
      var v = [], e = [], i, a;
      for (i = 0; i < 5; i++) { a = -Math.PI / 2 + i * 2 * Math.PI / 5; v.push([0.5 + 0.42 * Math.cos(a), 0.52 + 0.42 * Math.sin(a)]); }
      for (i = 0; i < 5; i++) { e.push([i, (i + 1) % 5]); e.push([i, (i + 2) % 5]); }
      GRS.push({ v: v, e: e }); v = []; e = [];
      for (i = 0; i < 8; i++) { a = -Math.PI / 2 + i * 2 * Math.PI / 8; v.push([0.5 + 0.42 * Math.cos(a), 0.52 + 0.42 * Math.sin(a)]); }
      for (i = 0; i < 8; i++) { e.push([i, (i + 1) % 8]); e.push([i, (i + 3) % 8]); }
      GRS.push({ v: v, e: e });
    })();
    var gi = 0, V = [], E = [], used = [], cur = -1, nused = 0, err = 0, fl = 0, sol = [];
    function euler() {
      var adj = V.map(function () { return []; }), i, deg, s = 0;
      for (i = 0; i < E.length; i++) { adj[E[i][0]].push(i); adj[E[i][1]].push(i); }
      for (i = 0; i < V.length; i++) if (adj[i].length % 2) { s = i; break; }
      var u = E.map(function () { return false; }), stack = [s], res = [];
      while (stack.length) { var x = stack[stack.length - 1], e = -1, k; for (k = 0; k < adj[x].length; k++) if (!u[adj[x][k]]) { e = adj[x][k]; break; } if (e < 0) res.push(stack.pop()); else { u[e] = true; stack.push(E[e][0] === x ? E[e][1] : E[e][0]); } }
      return res.reverse();
    }
    function undo() { used = E.map(function () { return false; }); cur = -1; nused = 0; }
    function reset() { gi = Math.floor(Math.random() * GRS.length); V = GRS[gi].v; E = GRS[gi].e; undo(); err = 0; fl = 0; sol = euler(); st = 'play'; }
    function mistake() { err++; fl = 0.5; if (api.nota) api.nota(120, 0.2, 'sawtooth', 0.05); if (err >= MAXE) st = 'lose'; }
    function tap(v) {
      if (st !== 'play') return; if (cur < 0) { cur = v; if (api.nota) api.nota(300, 0.08, 'sine', 0.05); return; } if (v === cur) return;
      var e = -1, i; for (i = 0; i < E.length; i++) if (!used[i] && ((E[i][0] === cur && E[i][1] === v) || (E[i][1] === cur && E[i][0] === v))) e = i;
      if (e < 0) { mistake(); return; }
      used[e] = true; cur = v; nused++; if (api.nota) api.nota(300 + nused * 25, 0.08, 'triangle', 0.05);
      if (nused === E.length) { st = 'win'; return; }
      var has = false; for (i = 0; i < E.length; i++) if (!used[i] && (E[i][0] === cur || E[i][1] === cur)) has = true;
      if (!has) { mistake(); if (st === 'play') undo(); }
    }
    function lay() { var W = api.w, H = api.h, s = Math.min(W - 30, H - 140, 420); return { s: s, x0: (W - s) / 2, y0: 70 }; }
    function vp() { var L = lay(); return V.map(function (p) { return { x: L.x0 + p[0] * L.s, y: L.y0 + p[1] * L.s }; }); }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, sol: sol.slice(), pos: vp(), cur: cur, used: used.slice(), err: err, maxe: MAXE, n: E.length, nused: nused }; },
      down: function (x, y) { if (menu()) return; var p = vp(), i; for (i = 0; i < p.length; i++) if (Math.hypot(x - p[i].x, y - p[i].y) < 26) { tap(i); return; } },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) { if (fl > 0) fl -= dt; },
      draw: function () {
        var p = vp(), i, L = lay(); bg('#1d1a14', '#090805');
        g.strokeStyle = 'rgba(255,216,138,.12)'; g.lineWidth = 2; g.strokeRect(L.x0 - 6, L.y0 - 6, L.s + 12, L.s + 12);
        for (i = 0; i < E.length; i++) { g.beginPath(); g.moveTo(p[E[i][0]].x, p[E[i][0]].y); g.lineTo(p[E[i][1]].x, p[E[i][1]].y); g.strokeStyle = used[i] ? '#ffd88a' : 'rgba(150,170,200,.55)'; g.lineWidth = used[i] ? 6 : 3; g.stroke(); }
        for (i = 0; i < p.length; i++) { g.beginPath(); g.arc(p[i].x, p[i].y, i === cur ? 17 : 12, 0, 6.2832); g.fillStyle = i === cur ? '#ffd88a' : '#2b3345'; g.fill(); g.strokeStyle = fl > 0 ? '#ff5a4a' : '#e8e2cf'; g.lineWidth = 2.5; g.stroke(); }
        hud(T.h1 + ' ' + nused + '/' + E.length, T.h2 + ' ' + err + '/' + MAXE, true);
        fim(st);
      }
    };

  }
});
