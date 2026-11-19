/* Urnes — as tábuas do portal (invenção). */
BTJogo.registrar({
  canvas: 'jogo-urnes',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As tábuas do portal",
    "sub": "As tábuas entalhadas do portal estão fora de ordem. Deslize-as até ficarem em sequência, com a casa vazia no canto de baixo à direita. Toque numa tábua ao lado da casa vazia para movê-la. O tempo é limitado. São 3 portais.",
    "perdeu": "O tempo acabou",
    "v1": "Portal montado!",
    "v2": "O portal norte da igreja de Urnes tem animais entrelaçados e deu nome ao estilo Urnes. Deslizar tábuas até a ordem certa é invenção.",
    "h1": "Portal",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The planks of the portal",
    "sub": "The carved planks of the portal are out of order. Slide them until they are in sequence, with the empty square in the bottom right corner. Tap a plank next to the empty square to move it. Time is limited. There are 3 portals.",
    "perdeu": "Time ran out",
    "v1": "Portal assembled!",
    "v2": "The north portal of the church of Urnes has interlaced animals and gave the Urnes style its name. Sliding planks into the right order is invented.",
    "h1": "Portal",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Plankene i portalen",
    "sub": "De utskårne plankene i portalen er ute av rekkefølge. Skyv dem til de ligger i rekkefølge, med den tomme ruten nede i høyre hjørne. Trykk på en planke ved siden av den tomme ruten for å flytte den. Tiden er begrenset. Det er 3 portaler.",
    "perdeu": "Tiden tok slutt",
    "v1": "Portalen er satt sammen!",
    "v2": "Nordportalen i Urnes stavkirke har sammenflettede dyr og ga navn til urnesstilen. Å skyve planker i riktig rekkefølge er oppfunnet.",
    "h1": "Portal",
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
    var LV = [[3, 3, 24], [3, 4, 32], [4, 4, 40]], LIM = 300, R = 3, C = 3, tile = [], blank = 0, solp = [], moves = 0;
    function isSolved() { for (var i = 0; i < R * C - 1; i++) if (tile[i] !== i + 1) return false; return tile[R * C - 1] === 0; }
    function adj(q) { var a = [], y = Math.floor(q / C), x = q % C; if (y > 0) a.push(q - C); if (y < R - 1) a.push(q + C); if (x > 0) a.push(q - 1); if (x < C - 1) a.push(q + 1); return a; }
    function load(i) {
      R = LV[i][0]; C = LV[i][1]; var n = R * C, k; tile = []; for (k = 0; k < n - 1; k++) tile.push(k + 1); tile.push(0);
      blank = n - 1; var prev = -1, bh = [blank];
      for (k = 0; k < LV[i][2]; k++) {
        var cs = adj(blank).filter(function (c) { return c !== prev; }), m = cs[Math.floor(Math.random() * cs.length)];
        tile[blank] = tile[m]; tile[m] = 0; prev = blank; blank = m; bh.push(blank);
      }
      solp = []; for (k = bh.length - 2; k >= 0; k--) solp.push(bh[k]);
      moves = 0; if (isSolved()) load(i);
    }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function L() { return glay(R, C, 90, 44); }
    function pos() { var l = L(), a = [], i; for (i = 0; i < R * C; i++) a.push({ x: l.x0 + (i % C + 0.5) * l.s, y: l.y0 + (Math.floor(i / C) + 0.5) * l.s }); return a; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lvl: lvl, pend: pend, sol: solp.slice(), k: moves, pos: pos() }; },
      down: function (x, y) {
        if (menu()) return; if (pend > 0 || st !== 'play') return;
        var l = L(), c = Math.floor((x - l.x0) / l.s), r = Math.floor((y - l.y0) / l.s);
        if (c < 0 || r < 0 || c >= C || r >= R) return;
        var q = r * C + c; if (adj(blank).indexOf(q) < 0) return;
        tile[blank] = tile[q]; tile[q] = 0; blank = q; moves++; if (api.nota) api.nota(260, 0.05, 'triangle', 0.05);
        if (isSolved()) lvlUp();
      },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) { tick(dt, load); },
      draw: function () {
        var l = L(), s = l.s, i; bg('#1c1810', '#080604');
        g.fillStyle = 'rgba(255,255,255,.06)'; rr(l.x0 - 6, l.y0 - 6, s * C + 12, s * R + 12, 10); g.fill();
        for (i = 0; i < R * C; i++) {
          var v = tile[i]; if (!v) continue;
          var x = l.x0 + (i % C) * s, y = l.y0 + Math.floor(i / C) * s, hue = 24 + v * 7;
          g.fillStyle = 'hsl(' + hue + ',42%,' + (30 + (v % 3) * 4) + '%)'; rr(x + 3, y + 3, s - 6, s - 6, 8); g.fill();
          g.strokeStyle = 'rgba(255,230,170,.55)'; g.lineWidth = 2; g.beginPath();
          var ph = v * 0.9, k;
          for (k = 0; k <= 16; k++) { var u = k / 16, px = x + s * (0.18 + 0.64 * u), py = y + s * (0.5 + 0.2 * Math.sin(u * 6.28 + ph)); if (k === 0) g.moveTo(px, py); else g.lineTo(px, py); }
          g.stroke(); g.beginPath();
          for (k = 0; k <= 16; k++) { var u2 = k / 16, px2 = x + s * (0.18 + 0.64 * u2), py2 = y + s * (0.5 - 0.2 * Math.sin(u2 * 6.28 + ph)); if (k === 0) g.moveTo(px2, py2); else g.lineTo(px2, py2); }
          g.stroke();
          txt(String(v), x + s / 2, y + s * 0.3, Math.max(14, s * 0.22), '#ffe9b0');
        }
        foot(); hh(); fim(st);
      }
    };

  }
});
