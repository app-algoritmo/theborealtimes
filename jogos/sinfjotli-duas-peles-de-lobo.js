/* Völsunga saga — as duas peles de lobo (invenção). */
BTJogo.registrar({
  canvas: 'jogo-sinfjotli',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As duas peles de lobo",
    "sub": "Duas peles de lobo se cruzam e dividem duas contas. As contas estão fora do lugar. Use os quatro botões para girar uma pele, de A ou de B, para um lado ou para o outro. Leve as contas às cores certas: um lado de uma cor, o outro de outra, e as duas contas do cruzamento douradas, como mostra a pequena imagem. O número de giros e o tempo são limitados. São 3 rodadas.",
    "perdeu": "Os giros ou o tempo acabaram",
    "v1": "Peles em ordem!",
    "v2": "Na Völsunga saga, Sinfjötli e Sigmund vestem peles de lobo amaldiçoadas e ficam sob uma maldição de licantropia. Girar anéis de contas é invenção.",
    "h1": "Rodada",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The two wolfskins",
    "sub": "Two wolfskins cross and share two beads. The beads are out of place. Use the four buttons to turn one skin, A or B, one way or the other. Bring the beads to the right colours: one side one colour, the other side another, and the two beads at the crossing golden, as the small picture shows. The number of turns and the time are limited. There are 3 rounds.",
    "perdeu": "The turns or the time ran out",
    "v1": "Skins in order!",
    "v2": "In Völsunga saga, Sinfjötli and Sigmund put on cursed wolfskins and fall under a curse of lycanthropy. Turning rings of beads is invented.",
    "h1": "Round",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "De to ulveskinnene",
    "sub": "To ulveskinn krysser hverandre og deler to perler. Perlene er på feil plass. Bruk de fire knappene for å dreie ett skinn, A eller B, den ene eller den andre veien. Få perlene til de riktige fargene: én side i én farge, den andre i en annen, og de to perlene i krysset gylne, som det lille bildet viser. Antall dreininger og tiden er begrenset. Det er 3 runder.",
    "perdeu": "Dreiningene eller tiden tok slutt",
    "v1": "Skinnene er i orden!",
    "v2": "I Völsunga saga tar Sinfjötli og Sigmund på seg forbannede ulveskinn og kommer under en forbannelse om varulv. Å dreie perleringer er oppfunnet.",
    "h1": "Runde",
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
    var SC = [4, 6, 8], LIM = 300, COL = ['#d9604a', '#e0a44a', '#58b0a0', '#4a7fd8', '#f0cd6a'];
    var RA = [], RB = [], TG = [], a = [], sol = [], moves = 0, lim = 0;
    (function () { var k, nx = 12; for (k = 0; k < 12; k++) RA.push(k); for (k = 0; k < 12; k++) RB.push(k === 4 ? 2 : (k === 8 ? 10 : nx++)); })();
    (function () {
      var k; for (k = 0; k < 22; k++) TG.push(0);
      for (k = 0; k < 12; k++) { if (k === 2 || k === 10) TG[RA[k]] = 4; else TG[RA[k]] = k < 6 ? 0 : 1; }
      for (k = 0; k < 12; k++) { if (k === 4 || k === 8) continue; TG[RB[k]] = k < 6 ? 2 : 3; }
    })();
    function rot(b, ring, cw) { var c = b.slice(), k; for (k = 0; k < 12; k++) { var from = ring[k], to = ring[cw ? (k + 1) % 12 : (k + 11) % 12]; c[to] = b[from]; } return c; }
    function app(b, m) { return rot(b, m < 2 ? RA : RB, m % 2 === 1); }
    function same(x, y) { for (var i = 0; i < x.length; i++) if (x[i] !== y[i]) return false; return true; }
    function load(i) {
      for (;;) {
        var b = TG.slice(), mv = [], k, m, last = -1;
        for (k = 0; k < SC[i]; k++) { do { m = Math.floor(Math.random() * 4); } while (last >= 0 && m === (last ^ 1)); mv.push(m); b = app(b, m); last = m; }
        if (!same(b, TG)) { a = b; sol = mv.slice().reverse().map(function (x) { return x ^ 1; }); break; }
      }
      moves = 0; lim = SC[i] + 2;
    }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function geo() { var W = api.w, H = api.h, r = Math.min((W - 30) / 3, (H - 70 - 40 - 90) / 2, 120), cy = 70 + (H - 70 - 40 - 90) / 2; return { r: r, cy: cy, ax: W / 2 - r / 2, bx: W / 2 + r / 2 }; }
    function cellPos() {
      var G0 = geo(), p = [], k; for (k = 0; k < 22; k++) p.push({ x: 0, y: 0 });
      for (k = 0; k < 12; k++) { var an = k * Math.PI / 6; p[RA[k]] = { x: G0.ax + G0.r * Math.cos(an), y: G0.cy + G0.r * Math.sin(an) }; }
      for (k = 0; k < 12; k++) { if (k === 4 || k === 8) continue; var an2 = k * Math.PI / 6; p[RB[k]] = { x: G0.bx + G0.r * Math.cos(an2), y: G0.cy + G0.r * Math.sin(an2) }; }
      return p;
    }
    function bpos() { var H = api.h, W = api.w, y = H - 62, a2 = []; for (var i = 0; i < 4; i++) a2.push({ x: W / 2 + (i - 1.5) * 64, y: y }); return a2; }
    function tap(m) { if (pend > 0 || st !== 'play') return; a = app(a, m); moves++; if (api.nota) api.nota(330, 0.05, 'square', 0.03); if (same(a, TG)) lvlUp(); else if (moves >= lim) st = 'lose'; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lvl: lvl, pend: pend, sol: sol.slice(), moves: moves, lim: lim, pos: bpos() }; },
      down: function (x, y) { if (menu()) return; var bp = bpos(); for (var i = 0; i < 4; i++) if (Math.abs(x - bp[i].x) < 30 && Math.abs(y - bp[i].y) < 30) { tap(i); return; } },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) { tick(dt, load); },
      draw: function () {
        var G0 = geo(), cp = cellPos(), k, br = G0.r * 0.15; bg('#1f2a2c', '#080c0d');
        g.lineWidth = 3; g.strokeStyle = 'rgba(214,96,74,.45)'; g.beginPath(); g.arc(G0.ax, G0.cy, G0.r, 0, 7); g.stroke();
        g.strokeStyle = 'rgba(74,127,216,.45)'; g.beginPath(); g.arc(G0.bx, G0.cy, G0.r, 0, 7); g.stroke();
        for (k = 0; k < 22; k++) { g.fillStyle = COL[a[k]]; g.beginPath(); g.arc(cp[k].x, cp[k].y, br, 0, 7); g.fill(); g.strokeStyle = 'rgba(0,0,0,.4)'; g.lineWidth = 2; g.stroke(); }
        var bp = bpos(), lb = ['↺ A', 'A ↻', '↺ B', 'B ↻'];
        for (k = 0; k < 4; k++) { g.fillStyle = k < 2 ? 'rgba(214,96,74,.55)' : 'rgba(74,127,216,.55)'; rr(bp[k].x - 29, bp[k].y - 22, 58, 44, 10); g.fill(); txt(lb[k], bp[k].x, bp[k].y + 1, 17, '#f3ecd2'); }
        var mx = 22, my = api.h - 14, ms = 4;
        txt(moves + '/' + lim, api.w - 40, 22, 14, moves >= lim - 1 ? '#ff9a8d' : '#c9b3f2');
        var px = api.w - 50, py = 92, mr = 16, an3;
        for (k = 0; k < 12; k++) { an3 = k * Math.PI / 6; g.fillStyle = COL[TG[RA[k]]]; g.beginPath(); g.arc(px - mr / 2 + mr * Math.cos(an3), py + mr * Math.sin(an3), 3, 0, 7); g.fill(); if (k !== 4 && k !== 8) { g.fillStyle = COL[TG[RB[k]]]; g.beginPath(); g.arc(px + mr / 2 + mr * Math.cos(an3), py + mr * Math.sin(an3), 3, 0, 7); g.fill(); } }
        foot(); hh(); fim(st);
      }
    };

  }
});
