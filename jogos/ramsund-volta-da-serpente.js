/* Ramsund — a volta da serpente (invenção). */
BTJogo.registrar({
  canvas: 'jogo-ramsund',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A volta da serpente",
    "sub": "Os pontos formam uma grade. Toque entre dois pontos para traçar ou apagar um traço. Feche um único laço, sem cruzamentos nem pontas soltas. Cada número diz quantos lados daquela casa fazem parte do laço. O tempo é limitado. São 3 grades.",
    "perdeu": "O tempo acabou",
    "v1": "Serpente fechada!",
    "v2": "O entalhe de Ramsund, na Suécia, mostra a lenda de Sigurd dentro de uma faixa de serpente. Traçar um laço com números é invenção.",
    "h1": "Grade",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The loop of the serpent",
    "sub": "The dots form a grid. Tap between two dots to draw or erase a line. Close a single loop, with no crossings and no loose ends. Each number says how many sides of that square are part of the loop. Time is limited. There are 3 grids.",
    "perdeu": "Time ran out",
    "v1": "Serpent closed!",
    "v2": "The Ramsund carving, in Sweden, shows the legend of Sigurd inside a serpent band. Drawing a loop with numbers is invented.",
    "h1": "Grid",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Slangens sløyfe",
    "sub": "Prikkene danner et rutenett. Trykk mellom to prikker for å tegne eller viske ut en strek. Lukk én enkelt sløyfe, uten kryss og uten løse ender. Hvert tall sier hvor mange sider av ruten som er med i sløyfen. Tiden er begrenset. Det er 3 rutenett.",
    "perdeu": "Tiden tok slutt",
    "v1": "Slangen er lukket!",
    "v2": "Ramsundristningen i Sverige viser Sigurd-sagnet inne i et slangeband. Å tegne en sløyfe med tall er oppfunnet.",
    "h1": "Rutenett",
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
    var NL = 3, lvl = 0, t = 0, pend = 0;
    function lvlUp() { lvl++; pend = 0.9; if (api.nota) api.nota(520, 0.2, 'triangle', 0.07); }
    function tick(dt, load) { if (st !== 'play') return; t += dt; if (pend > 0) { pend -= dt; if (pend <= 0) { if (lvl >= NL) st = 'win'; else load(lvl); } } if (st === 'play' && t >= LIM) st = 'lose'; }
    function foot() { bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 60 ? '#c0392b' : '#ffd88a'); }
    function hh() { hud(T.h1 + ' ' + Math.min(lvl + 1, NL) + '/' + NL, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false); }
    function glay(R, C, top, bot) { var W = api.w, H = api.h, s = Math.min((W - 24) / C, (H - top - bot) / R, 96); return { s: s, x0: (W - s * C) / 2, y0: top + ((H - top - bot) - s * R) / 2 }; }
    function sh(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
    var SZ = [[3, 3, 0.8], [4, 4, 0.7], [5, 5, 0.6]], LIM = 300, R = 3, C = 3, NE = 0, ED = [], sol = [], cur = [], clue = [], shown = [];
    function hI(r, c) { return r * C + c; }
    function vI(r, c) { return (R + 1) * C + r * (C + 1) + c; }
    function build_() {
      NE = (R + 1) * C + R * (C + 1); ED = [];
      var r, c;
      for (r = 0; r <= R; r++) for (c = 0; c < C; c++) ED.push({ a: r * (C + 1) + c, b: r * (C + 1) + c + 1, x: c + 0.5, y: r });
      for (r = 0; r < R; r++) for (c = 0; c <= C; c++) ED.push({ a: r * (C + 1) + c, b: (r + 1) * (C + 1) + c, x: c, y: r + 0.5 });
    }
    function cellEdges(r, c) { return [hI(r, c), hI(r + 1, c), vI(r, c), vI(r, c + 1)]; }
    function loopOk(es) {
      var deg = {}, i, tot = 0, first = -1;
      for (i = 0; i < NE; i++) if (es[i]) { tot++; deg[ED[i].a] = (deg[ED[i].a] || 0) + 1; deg[ED[i].b] = (deg[ED[i].b] || 0) + 1; if (first < 0) first = i; }
      if (!tot) return false;
      for (var k in deg) if (deg[k] !== 2) return false;
      var seen = {}, stack = [ED[first].a], cnt = 0; seen[ED[first].a] = 1;
      while (stack.length) { var v = stack.pop(); cnt++; for (i = 0; i < NE; i++) if (es[i]) { var o = ED[i].a === v ? ED[i].b : ED[i].b === v ? ED[i].a : -1; if (o >= 0 && !seen[o]) { seen[o] = 1; stack.push(o); } } }
      return cnt === Object.keys(deg).length;
    }
    function inR(reg, r, c) { return r >= 0 && c >= 0 && r < R && c < C && reg[r * C + c]; }
    function gen() {
      for (var tries = 0; tries < 2000; tries++) {
        var reg = [], i, r, c; for (i = 0; i < R * C; i++) reg.push(false);
        var s0 = Math.floor(Math.random() * R * C); reg[s0] = true; var size = 1, target = Math.ceil(R * C * 0.55);
        while (size < target) {
          var cand = []; for (r = 0; r < R; r++) for (c = 0; c < C; c++) if (!reg[r * C + c] && (inR(reg, r - 1, c) || inR(reg, r + 1, c) || inR(reg, r, c - 1) || inR(reg, r, c + 1))) cand.push(r * C + c);
          var z = cand[Math.floor(Math.random() * cand.length)]; reg[z] = true; size++;
        }
        var es = []; for (i = 0; i < NE; i++) es.push(false);
        for (r = 0; r <= R; r++) for (c = 0; c < C; c++) es[hI(r, c)] = inR(reg, r - 1, c) !== inR(reg, r, c);
        for (r = 0; r < R; r++) for (c = 0; c <= C; c++) es[vI(r, c)] = inR(reg, r, c - 1) !== inR(reg, r, c);
        if (loopOk(es)) return es;
      }
      return null;
    }
    function check(es) { if (!loopOk(es)) return false; for (var i = 0; i < R * C; i++) if (shown[i]) { var n = 0; cellEdges(Math.floor(i / C), i % C).forEach(function (e) { if (es[e]) n++; }); if (n !== clue[i]) return false; } return true; }
    function load(i) {
      R = SZ[i][0]; C = SZ[i][1]; build_(); sol = gen();
      if (!sol) { sol = []; for (var k = 0; k < NE; k++) sol.push(false); }
      cur = []; clue = []; shown = [];
      for (var q = 0; q < NE; q++) cur.push(false);
      for (q = 0; q < R * C; q++) { var n = 0; cellEdges(Math.floor(q / C), q % C).forEach(function (e) { if (sol[e]) n++; }); clue.push(n); shown.push(Math.random() < SZ[i][2]); }
    }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function L() { var W = api.w, H = api.h, s = Math.min((W - 40) / C, (H - 130) / R, 84); return { s: s, x0: (W - s * C) / 2, y0: 84 + (H - 84 - 30 - s * R) / 2 }; }
    function pt(l, e) { return { x: l.x0 + ED[e].x * l.s, y: l.y0 + ED[e].y * l.s }; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { var l = L(); return { st: st, lvl: lvl, pend: pend, sol: sol.slice(), cur: cur.slice(), pos: ED.map(function (e, i) { return pt(l, i); }) }; },
      down: function (x, y) {
        if (menu()) return; if (pend > 0 || st !== 'play') return;
        var l = L(), best = -1, bd = l.s * 0.34, i;
        for (i = 0; i < NE; i++) { var p = pt(l, i), d = Math.sqrt((p.x - x) * (p.x - x) + (p.y - y) * (p.y - y)); if (d < bd) { bd = d; best = i; } }
        if (best < 0) return; cur[best] = !cur[best]; if (api.nota) api.nota(cur[best] ? 330 : 240, 0.05, 'triangle', 0.04);
        if (check(cur)) lvlUp();
      },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) { tick(dt, load); },
      draw: function () {
        var l = L(), s = l.s, i, r, c; bg('#1a2a24', '#060c09');
        for (i = 0; i < NE; i++) if (cur[i]) {
          var a = ED[i], ax = l.x0 + (a.a % (C + 1)) * s, ay = l.y0 + Math.floor(a.a / (C + 1)) * s, bx = l.x0 + (a.b % (C + 1)) * s, by = l.y0 + Math.floor(a.b / (C + 1)) * s;
          g.strokeStyle = '#ffd88a'; g.lineWidth = Math.max(4, s * 0.09); g.lineCap = 'round'; g.beginPath(); g.moveTo(ax, ay); g.lineTo(bx, by); g.stroke();
        }
        for (r = 0; r <= R; r++) for (c = 0; c <= C; c++) { g.fillStyle = '#e8dcb6'; g.beginPath(); g.arc(l.x0 + c * s, l.y0 + r * s, Math.max(3, s * 0.06), 0, 7); g.fill(); }
        for (i = 0; i < R * C; i++) if (shown[i]) {
          var n = 0; cellEdges(Math.floor(i / C), i % C).forEach(function (e) { if (cur[e]) n++; });
          txt(String(clue[i]), l.x0 + (i % C + 0.5) * s, l.y0 + (Math.floor(i / C) + 0.5) * s + s * 0.12, Math.max(16, s * 0.36), n === clue[i] ? '#8fcf7a' : n > clue[i] ? '#ff9a8d' : '#f3ecd2');
        }
        foot(); hh(); fim(st);
      }
    };

  }
});
