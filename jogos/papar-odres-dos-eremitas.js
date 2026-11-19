/* Papar — os odres dos eremitas (invenção). */
BTJogo.registrar({
  canvas: 'jogo-papar',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os odres dos papar",
    "sub": "Você tem dois odres de capacidades diferentes, sem marcas de medida, uma fonte e um ralo. Toque num odre e depois na fonte para enchê-lo, no ralo para esvaziá-lo ou em outro odre para passar a água para ele, até encher o outro ou esvaziar o primeiro. Deixe um dos odres com exatamente a quantidade do alvo. O número de ações e o tempo são limitados. São 3 rodadas.",
    "perdeu": "As ações ou o tempo acabaram",
    "v1": "Medida exata!",
    "v2": "Segundo a Landnámabók, monges irlandeses viveram na Islândia antes dos nórdicos e deixaram livros, sinos e báculos; a arqueologia não comprovou a presença deles. Medir água é invenção.",
    "h1": "Rodada",
    "h2": "Tempo",
    "alvo": "Alvo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The waterskins of the papar",
    "sub": "You have two waterskins of different capacities, with no measuring marks, a spring and a drain. Tap a skin and then the spring to fill it, the drain to empty it, or another skin to pour the water into it, until the other is full or the first is empty. Leave one of the skins with exactly the target amount. The number of actions and the time are limited. There are 3 rounds.",
    "perdeu": "The actions or the time ran out",
    "v1": "Exact measure!",
    "v2": "According to Landnámabók, Irish monks lived in Iceland before the Norse and left books, bells and crosiers; archaeology has not confirmed their presence. Measuring water is invented.",
    "h1": "Round",
    "h2": "Time",
    "alvo": "Target"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Paparenes vannsekker",
    "sub": "Du har to vannsekker med ulik størrelse, uten målestreker, en kilde og et avløp. Trykk på en sekk og så på kilden for å fylle den, på avløpet for å tømme den, eller på en annen sekk for å helle vannet over i den, til den andre er full eller den første er tom. La en av sekkene inneholde nøyaktig målmengden. Antall handlinger og tiden er begrenset. Det er 3 runder.",
    "perdeu": "Handlingene eller tiden tok slutt",
    "v1": "Nøyaktig mål!",
    "v2": "Ifølge Landnámabók bodde irske munker på Island før nordboerne og etterlot seg bøker, klokker og bispestaver; arkeologien har ikke bekreftet at de var der. Å måle vann er oppfunnet.",
    "h1": "Runde",
    "h2": "Tid",
    "alvo": "Mål"
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
    var LV = [[[3, 5], 4], [[4, 9], 6], [[5, 7], 6]], LIM = 360;
    var caps = [], target = 0, vols = [], sel = -1, moves = 0, lim = 0, tapseq = [], ntaps = 0;
    function bfs(cp, tg) {
      var J = cp.length, s0 = []; for (var i = 0; i < J; i++) s0.push(0);
      var key = function (v) { return v.join(','); }, prev = {}, q = [s0], seen = {}; seen[key(s0)] = 1;
      while (q.length) {
        var v = q.shift(); if (v.indexOf(tg) >= 0) { var ops = [], k = key(v); while (prev[k]) { ops.push(prev[k].op); k = prev[k].from; } return ops.reverse(); }
        var nx = [], a, b, w;
        for (a = 0; a < J; a++) {
          w = v.slice(); w[a] = cp[a]; nx.push([w, ['f', a]]);
          w = v.slice(); w[a] = 0; nx.push([w, ['e', a]]);
          for (b = 0; b < J; b++) if (a !== b) { w = v.slice(); var x = Math.min(w[a], cp[b] - w[b]); w[a] -= x; w[b] += x; nx.push([w, ['p', a, b]]); }
        }
        for (var z = 0; z < nx.length; z++) { var kk = key(nx[z][0]); if (!seen[kk]) { seen[kk] = 1; prev[kk] = { from: key(v), op: nx[z][1] }; q.push(nx[z][0]); } }
      }
      return [];
    }
    function load(i) {
      caps = LV[i][0].slice(); target = LV[i][1]; vols = caps.map(function () { return 0; }); sel = -1; moves = 0; ntaps = 0;
      var ops = bfs(caps, target), J = caps.length; tapseq = [];
      ops.forEach(function (o) { if (o[0] === 'f') tapseq.push(o[1], J); else if (o[0] === 'e') tapseq.push(o[1], J + 1); else tapseq.push(o[1], o[2]); });
      lim = ops.length + 3;
    }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function lay() {
      var W = api.w, H = api.h, J = caps.length, mx = Math.max.apply(null, caps), u = Math.min(22, (H - 70 - 150) / mx), w = Math.min(70, (W - 60) / (J + 2)), x0 = W / 2 - (J + 2) * w / 2 * 1.0, base = H - 100;
      return { u: u, w: w, base: base, x: function (k) { return W / 2 + (k - (J + 1) / 2) * (w + 14); } };
    }
    function pos() { var L = lay(), J = caps.length, a = [], k; for (k = 0; k < J; k++) a.push({ x: L.x(k), y: L.base - caps[k] * L.u / 2 }); a.push({ x: L.x(J), y: L.base - 30 }); a.push({ x: L.x(J + 1), y: L.base - 30 }); return a; }
    function tap(k) {
      if (pend > 0 || st !== 'play') return; var J = caps.length; ntaps++;
      if (sel < 0) { if (k < J) sel = k; return; }
      if (k === sel) { sel = -1; return; }
      if (k === J) vols[sel] = caps[sel];
      else if (k === J + 1) vols[sel] = 0;
      else { var x = Math.min(vols[sel], caps[k] - vols[k]); vols[sel] -= x; vols[k] += x; }
      moves++; sel = -1; if (api.nota) api.nota(280, 0.06, 'triangle', 0.04);
      if (vols.indexOf(target) >= 0) lvlUp(); else if (moves >= lim) st = 'lose';
    }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lvl: lvl, pend: pend, tapseq: tapseq.slice(), ntaps: ntaps, pos: pos() }; },
      down: function (x, y) {
        if (menu()) return; var L = lay(), p = pos(), J = caps.length;
        for (var k = 0; k < J + 2; k++) { var hh2 = k < J ? caps[k] * L.u / 2 + 10 : 36; if (Math.abs(x - p[k].x) < L.w / 2 + 8 && Math.abs(y - p[k].y) < hh2) { tap(k); return; } }
      },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) { tick(dt, load); },
      draw: function () {
        var L = lay(), J = caps.length, k; bg('#1f2e36', '#070c10');
        g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, L.base, api.w, api.h - L.base);
        for (k = 0; k < J; k++) {
          var x = L.x(k), h = caps[k] * L.u;
          g.fillStyle = 'rgba(255,255,255,.08)'; rr(x - L.w / 2, L.base - h, L.w, h, 8); g.fill();
          g.fillStyle = vols[k] === target ? '#58b06a' : '#4a8fd8'; if (vols[k] > 0) { g.fillRect(x - L.w / 2 + 3, L.base - vols[k] * L.u, L.w - 6, vols[k] * L.u - 2); }
          if (sel === k) { g.strokeStyle = '#ffd88a'; g.lineWidth = 3; rr(x - L.w / 2, L.base - h, L.w, h, 8); g.stroke(); }
          txt(String(caps[k]), x, L.base + 16, 14, '#c9b3f2');
        }
        g.fillStyle = '#4a8fd8'; g.beginPath(); g.arc(L.x(J), L.base - 30, 24, 0, 7); g.fill(); txt('+', L.x(J), L.base - 29, 24, '#0a1a2a');
        g.fillStyle = '#3a3a44'; g.beginPath(); g.arc(L.x(J + 1), L.base - 30, 24, 0, 7); g.fill(); txt('−', L.x(J + 1), L.base - 29, 24, '#f3ecd2');
        txt(T.alvo + ': ' + target, api.w / 2, 86, 20, '#ffd88a');
        txt(moves + '/' + lim, api.w - 40, 22, 14, moves >= lim - 1 ? '#ff9a8d' : '#c9b3f2');
        foot(); hh(); fim(st);
      }
    };

  }
});
