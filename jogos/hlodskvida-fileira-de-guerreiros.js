/* Hlöðskviða — a fileira de guerreiros (invenção). */
BTJogo.registrar({
  canvas: 'jogo-hlodskvida',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A fileira de guerreiros",
    "sub": "Uma fileira de guerreiros de alturas diferentes está fora de ordem. Toque num guerreiro e depois no vizinho dele para trocar os dois de lugar. Deixe a fileira em ordem, do mais baixo, à esquerda, ao mais alto, à direita. O número de trocas e o tempo são limitados. São 3 fileiras, cada uma maior que a anterior.",
    "perdeu": "As trocas ou o tempo acabaram",
    "v1": "Fileira em ordem!",
    "v2": "A Hlöðskviða conta a guerra entre os irmãos Angantýr e Hlöðr pela herança do rei godo Heiðrekr; Hlöðr foi criado entre os hunos. O poema se preservou dentro da Hervarar saga. Ordenar guerreiros é invenção.",
    "h1": "Fileira",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The line of warriors",
    "sub": "A line of warriors of different heights is out of order. Tap a warrior and then his neighbour to swap the two. Put the line in order, from the shortest, on the left, to the tallest, on the right. The number of swaps and the time are limited. There are 3 lines, each longer than the last.",
    "perdeu": "The swaps or the time ran out",
    "v1": "Line in order!",
    "v2": "Hlöðskviða tells of the war between the brothers Angantýr and Hlöðr over the inheritance of the Gothic king Heiðrekr; Hlöðr was raised among the Huns. The poem is preserved within Hervarar saga. Ordering warriors is invented.",
    "h1": "Line",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Rekken av krigere",
    "sub": "En rekke krigere i ulik høyde står i feil rekkefølge. Trykk på en kriger og så på naboen hans for å bytte plass på de to. Sett rekken i orden, fra den laveste, til venstre, til den høyeste, til høyre. Antall bytter og tiden er begrenset. Det er 3 rekker, hver lengre enn den forrige.",
    "perdeu": "Byttene eller tiden tok slutt",
    "v1": "Rekken er i orden!",
    "v2": "Hlöðskviða forteller om krigen mellom brødrene Angantýr og Hlöðr om arven etter gotarkongen Heiðrekr; Hlöðr vokste opp blant hunerne. Diktet er bevart i Hervarar saga. Å ordne krigere er oppfunnet.",
    "h1": "Rekke",
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
    var NN = [6, 7, 8], INV = [6, 9, 12], NL = 3, LIM = 300;
    var lvl = 0, a = [], sol = [], lim = 0, moves = 0, sel = -1, t = 0, pend = 0;
    function inv(b) { var c = 0, i, j; for (i = 0; i < b.length; i++) for (j = i + 1; j < b.length; j++) if (b[i] > b[j]) c++; return c; }
    function sorted() { for (var i = 1; i < a.length; i++) if (a[i - 1] > a[i]) return false; return true; }
    function load(i) {
      for (;;) {
        var n = NN[i], b = [], k; for (k = 1; k <= n; k++) b.push(k); b.sort(function () { return Math.random() - 0.5; });
        var c = inv(b); if (c < INV[i] || c > INV[i] + 2) continue;
        a = b.slice(); var w = b.slice(), s = [], ch = true; while (ch) { ch = false; for (k = 0; k + 1 < w.length; k++) if (w[k] > w[k + 1]) { var tmp = w[k]; w[k] = w[k + 1]; w[k + 1] = tmp; s.push(k); ch = true; break; } }
        sol = s; lim = c + 3; moves = 0; sel = -1; return;
      }
    }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function lay() { var W = api.w, H = api.h, n = a.length, cw = Math.min((W - 30) / NN[2], 70); return { cw: cw, x0: (W - n * cw) / 2, base: Math.min(H - 90, 80 + 290), hmax: Math.min(240, H - 220) }; }
    function bpos(k) { var L = lay(); return { x: L.x0 + L.cw * (k + 0.5), y: L.base - 40 }; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lvl: lvl, a: a.slice(), sol: sol.slice(), moves: moves, lim: lim, sel: sel, pos: a.map(function (v, k) { return bpos(k); }), pend: pend }; },
      down: function (x, y) {
        if (menu()) return; if (pend > 0) return; var L = lay(), k = Math.floor((x - L.x0) / L.cw); if (k < 0 || k >= a.length) return;
        if (sel < 0) { sel = k; return; }
        if (Math.abs(sel - k) !== 1) { sel = k === sel ? -1 : k; return; }
        var tmp = a[sel]; a[sel] = a[k]; a[k] = tmp; sel = -1; moves++; if (api.nota) api.nota(250, 0.05, 'square', 0.03);
        if (sorted()) { lvl++; pend = 0.9; if (api.nota) api.nota(520, 0.2, 'triangle', 0.07); } else if (moves >= lim) st = 'lose';
      },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) {
        if (st !== 'play') return; t += dt;
        if (pend > 0) { pend -= dt; if (pend <= 0) { if (lvl >= NL) st = 'win'; else load(lvl); } }
        if (st === 'play' && t >= LIM) st = 'lose';
      },
      draw: function () {
        var L = lay(), k, n = a.length; bg('#2a2a3a', '#0a0a12');
        for (k = 0; k < n; k++) {
          var h = 40 + a[k] / n * (L.hmax - 40), x = L.x0 + L.cw * k + L.cw / 2; g.fillStyle = sel === k ? '#ffd88a' : 'hsl(' + (20 + a[k] * 14) + ',40%,52%)'; rr(x - L.cw * 0.36, L.base - h, L.cw * 0.72, h, 8); g.fill();
          txt(String(a[k]), x, L.base - h / 2, L.cw * 0.34, 'rgba(0,0,0,.6)');
        }
        g.fillStyle = '#3a2f26'; g.fillRect(L.x0 - 6, L.base, n * L.cw + 12, 6);
        txt(moves + '/' + lim, api.w / 2, L.base + 34, 18, moves >= lim - 1 ? '#ff9a8d' : '#f3ecd2');
        bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 60 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + Math.min(lvl + 1, NL) + '/' + NL, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };

  }
});
