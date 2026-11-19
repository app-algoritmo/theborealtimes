/* Króka-Refs saga — as caixas de Ref (invenção). */
BTJogo.registrar({
  canvas: 'jogo-krokaref',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As caixas de Ref",
    "sub": "Toque numa casa vizinha ao seu personagem para andar até ela. Se houver uma caixa nessa casa, você a empurra uma casa adiante, e ela não anda se houver parede ou outra caixa atrás. Leve todas as caixas para as marcas douradas. Tocar no próprio personagem recomeça o mapa. O tempo é limitado. São 3 mapas.",
    "perdeu": "O tempo acabou",
    "v1": "Caixas no lugar!",
    "v2": "Na Króka-Refs saga, Ref constrói um navio notável e recebe do rei Harald Hardrada o apelido de \"Ref, o Astuto\". Empurrar caixas até as marcas é invenção.",
    "h1": "Mapa",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Ref’s crates",
    "sub": "Tap a square next to your character to walk to it. If there is a crate on that square, you push it one square ahead, and it will not move if there is a wall or another crate behind it. Bring all the crates to the golden marks. Tapping your own character restarts the map. Time is limited. There are 3 maps.",
    "perdeu": "Time ran out",
    "v1": "Crates in place!",
    "v2": "In the Króka-Refs saga, Ref builds a notable ship and is given the nickname \"Ref the Sly\" by King Harald Hardrada. Pushing crates onto marks is invented.",
    "h1": "Map",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Refs kasser",
    "sub": "Trykk på en rute ved siden av figuren din for å gå dit. Hvis det står en kasse der, skyver du den én rute fremover, og den flytter seg ikke hvis det er en vegg eller en annen kasse bak den. Få alle kassene til de gylne merkene. Å trykke på figuren din starter kartet på nytt. Tiden er begrenset. Det er 3 kart.",
    "perdeu": "Tiden tok slutt",
    "v1": "Kassene er på plass!",
    "v2": "I Króka-Refs saga bygger Ref et bemerkelsesverdig skip og får tilnavnet «Ref den lure» av kong Harald Hardråde. Å skyve kasser til merker er oppfunnet.",
    "h1": "Kart",
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
    var NS = [6, 7, 7], NB = [2, 2, 3], STP = [26, 34, 44], LIM = 300;
    var N = 6, wall = [], box = [], goal = [], pl = 0, sol = [], k = 0, b0 = [], p0 = 0;
    var DX = [0, 1, 0, -1], DY = [-1, 0, 1, 0];
    function nb(p, d) { var x = p % N + DX[d], y = Math.floor(p / N) + DY[d]; if (x < 0 || y < 0 || x >= N || y >= N) return -1; return y * N + x; }
    function rnd(a) { return a[Math.floor(Math.random() * a.length)]; }
    function gen(i) {
      var c, fr, goals, bx, P, mv, s, d, Q, B, pull, pc, w;
      N = NS[i];
      for (;;) {
        wall = []; for (c = 0; c < N * N; c++) wall.push(c % N === 0 || c % N === N - 1 || c < N || c >= N * (N - 1));
        for (w = 0; w < 3; w++) { c = N + 1 + Math.floor(Math.random() * (N * (N - 2) - 2)); if (!wall[c] && c % N > 1 && c % N < N - 2) wall[c] = true; }
        fr = []; for (c = 0; c < N * N; c++) if (!wall[c]) fr.push(c); sh(fr);
        goals = fr.slice(0, NB[i]); bx = goals.slice(); P = fr[NB[i]];
        mv = []; pc = 0;
        for (s = 0; s < STP[i] * 6 && mv.length < STP[i]; s++) {
          d = Math.floor(Math.random() * 4); Q = nb(P, d); if (Q < 0 || wall[Q] || bx.indexOf(Q) >= 0) continue;
          B = nb(P, (d + 2) % 4); pull = B >= 0 && bx.indexOf(B) >= 0 && Math.random() < 0.75;
          if (pull) { bx[bx.indexOf(B)] = P; pc++; } P = Q; mv.push((d + 2) % 4);
        }
        var off = 0; for (c = 0; c < bx.length; c++) if (goals.indexOf(bx[c]) < 0) off++;
        if (pc < 3 || off < 1) continue;
        goal = goals; box = bx.slice(); b0 = bx.slice(); pl = P; p0 = P; sol = mv.reverse(); k = 0;
        if (check()) return;
      }
    }
    function check() { // simula a solucao
      var bb = box.slice(), pp = pl, i, d, Q, R, bi;
      for (i = 0; i < sol.length; i++) {
        d = sol[i]; Q = nb(pp, d); if (Q < 0 || wall[Q]) return false; bi = bb.indexOf(Q);
        if (bi >= 0) { R = nb(Q, d); if (R < 0 || wall[R] || bb.indexOf(R) >= 0) return false; bb[bi] = R; } pp = Q;
      }
      for (i = 0; i < bb.length; i++) if (goal.indexOf(bb[i]) < 0) return false; return true;
    }
    function load(i) { gen(i); }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function L() { return glay(N, N, 70, 40); }
    function pos() { var l = L(), a = [], i; for (i = 0; i < N * N; i++) a.push({ x: l.x0 + (i % N + 0.5) * l.s, y: l.y0 + (Math.floor(i / N) + 0.5) * l.s }); return a; }
    function solved() { for (var i = 0; i < box.length; i++) if (goal.indexOf(box[i]) < 0) return false; return true; }
    function go(d) {
      var Q = nb(pl, d), R, bi; if (Q < 0 || wall[Q]) return; bi = box.indexOf(Q);
      if (bi >= 0) { R = nb(Q, d); if (R < 0 || wall[R] || box.indexOf(R) >= 0) return; box[bi] = R; if (api.nota) api.nota(200, 0.05, 'square', 0.04); } else if (api.nota) api.nota(320, 0.03, 'triangle', 0.03);
      pl = Q; k++; if (solved()) lvlUp();
    }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lvl: lvl, pend: pend, sol: sol.slice(), k: k, next: k < sol.length ? nb(pl, sol[k]) : -1, pos: pos() }; },
      down: function (x, y) {
        if (menu()) return; if (pend > 0 || st !== 'play') return;
        var l = L(), c = Math.floor((x - l.x0) / l.s), r = Math.floor((y - l.y0) / l.s), i, d; if (c < 0 || r < 0 || c >= N || r >= N) return; i = r * N + c;
        if (i === pl) { box = b0.slice(); pl = p0; k = 0; return; }
        for (d = 0; d < 4; d++) if (nb(pl, d) === i) { go(d); return; }
      },
      move: function () {}, up: function () {},
      key: function (kk, d) { if (d && st !== 'play') menu(); },
      update: function (dt) { tick(dt, load); },
      draw: function () {
        var l = L(), s = l.s, i; bg('#262018', '#0a0805');
        for (i = 0; i < N * N; i++) {
          var x = l.x0 + (i % N) * s, y = l.y0 + Math.floor(i / N) * s;
          g.fillStyle = wall[i] ? '#4a4034' : 'rgba(255,255,255,.07)'; rr(x + 1, y + 1, s - 2, s - 2, 5); g.fill();
          if (goal.indexOf(i) >= 0) { g.strokeStyle = '#ffd88a'; g.lineWidth = 3; g.beginPath(); g.arc(x + s / 2, y + s / 2, s * 0.22, 0, 7); g.stroke(); }
        }
        for (i = 0; i < box.length; i++) { var bx = l.x0 + (box[i] % N) * s, by = l.y0 + Math.floor(box[i] / N) * s; g.fillStyle = goal.indexOf(box[i]) >= 0 ? '#c9a45a' : '#8a6a3a'; rr(bx + 5, by + 5, s - 10, s - 10, 6); g.fill(); g.strokeStyle = '#3a2a14'; g.lineWidth = 2; rr(bx + 5, by + 5, s - 10, s - 10, 6); g.stroke(); }
        g.fillStyle = '#5a9fd0'; g.beginPath(); g.arc(l.x0 + (pl % N + 0.5) * s, l.y0 + (Math.floor(pl / N) + 0.5) * s, s * 0.3, 0, 7); g.fill();
        foot(); hh(); fim(st);
      }
    };

  }
});
