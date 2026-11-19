/* O gigante sem coração — os irmãos de pedra (invenção). */
BTJogo.registrar({
  canvas: 'jogo-gigante',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os irmãos de pedra",
    "sub": "Cada número só pode aparecer uma vez em cada linha e em cada coluna entre as casas claras. Toque numa casa para virá-la pedra, tirando-a da conta. Duas casas de pedra não podem se tocar pelos lados, e as casas claras devem continuar ligadas num só bloco. O tempo é limitado. São 3 grades.",
    "perdeu": "O tempo acabou",
    "v1": "Irmãos libertados!",
    "v2": "No conto recolhido por Asbjørnsen e Moe, o gigante transforma seis príncipes e suas noivas em pedra. Pintar casas de pedra num quebra-cabeça de números é invenção.",
    "h1": "Grade",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The brothers of stone",
    "sub": "Each number can appear only once in each row and in each column among the light squares. Tap a square to turn it to stone, taking it out of the count. Two stone squares cannot touch along their sides, and the light squares must stay connected in a single block. Time is limited. There are 3 grids.",
    "perdeu": "Time ran out",
    "v1": "Brothers freed!",
    "v2": "In the tale collected by Asbjørnsen and Moe, the giant turns six princes and their brides to stone. Painting squares as stone in a number puzzle is invented.",
    "h1": "Grid",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Brødrene av stein",
    "sub": "Hvert tall kan bare stå én gang i hver rad og hver kolonne blant de lyse rutene. Trykk på en rute for å gjøre den til stein, så den ikke teller med. To steinruter kan ikke berøre hverandre langs sidene, og de lyse rutene må henge sammen i én blokk. Tiden er begrenset. Det er 3 rutenett.",
    "perdeu": "Tiden tok slutt",
    "v1": "Brødrene er frigjort!",
    "v2": "I eventyret som Asbjørnsen og Moe samlet inn, gjør jotunen seks prinser og brudene deres til stein. Å gjøre ruter til stein i et tallpuslespill er oppfunnet.",
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
    var NS = [4, 5, 6], LIM = 300, N = 4, num = [], sol = [], cur = [];
    function range(n) { var a = [], i; for (i = 0; i < n; i++) a.push(i); return a; }
    function latin(n) {
      var rp = sh(range(n)), cp = sh(range(n)), vp = sh(range(n)), out = [], i, j;
      for (i = 0; i < n; i++) { var row = []; for (j = 0; j < n; j++) row.push(vp[(rp[i] + cp[j]) % n] + 1); out.push(row); }
      return out;
    }
    function neigh(q, n) { var a = [], y = Math.floor(q / n), x = q % n; if (y > 0) a.push(q - n); if (y < n - 1) a.push(q + n); if (x > 0) a.push(q - 1); if (x < n - 1) a.push(q + 1); return a; }
    function connected(blk, n) {
      var s = -1, i, tot = 0; for (i = 0; i < n * n; i++) if (!blk[i]) { tot++; if (s < 0) s = i; }
      if (s < 0) return false;
      var seen = {}, stack = [s], c = 0; seen[s] = 1;
      while (stack.length) { var q = stack.pop(); c++; neigh(q, n).forEach(function (z) { if (!blk[z] && !seen[z]) { seen[z] = 1; stack.push(z); } }); }
      return c === tot;
    }
    function gen(n) {
      for (;;) {
        var lat = latin(n), blk = [], i, p, cnt = 0, target = Math.round(n * n * (n === 4 ? 0.22 : 0.25));
        for (i = 0; i < n * n; i++) blk.push(false);
        sh(range(n * n)).forEach(function (q) {
          if (cnt >= target) return;
          if (neigh(q, n).some(function (z) { return blk[z]; })) return;
          blk[q] = true; if (!connected(blk, n)) { blk[q] = false; return; } cnt++;
        });
        var nm = [], okAll = true; for (i = 0; i < n * n; i++) nm.push(lat[Math.floor(i / n)][i % n]);
        for (p = 0; p < n * n && okAll; p++) if (blk[p]) {
          var r = Math.floor(p / n), c = p % n, cands = [], k;
          for (k = 0; k < n; k++) { if (k !== c && !blk[r * n + k]) cands.push(lat[r][k]); if (k !== r && !blk[k * n + c]) cands.push(lat[k][c]); }
          if (!cands.length) okAll = false; else nm[p] = cands[Math.floor(Math.random() * cands.length)];
        }
        if (okAll && cnt >= target - 1 && cnt >= 3) return { nm: nm, blk: blk };
      }
    }
    function valid(cu) {
      var n = N, p, r, c, seen;
      for (p = 0; p < n * n; p++) if (cu[p] && neigh(p, n).some(function (z) { return cu[z]; })) return false;
      for (r = 0; r < n; r++) { seen = {}; for (c = 0; c < n; c++) { p = r * n + c; if (!cu[p]) { if (seen[num[p]]) return false; seen[num[p]] = 1; } } }
      for (c = 0; c < n; c++) { seen = {}; for (r = 0; r < n; r++) { p = r * n + c; if (!cu[p]) { if (seen[num[p]]) return false; seen[num[p]] = 1; } } }
      return connected(cu, n);
    }
    function load(i) { N = NS[i]; var d = gen(N); num = d.nm; sol = d.blk; cur = []; for (var k = 0; k < N * N; k++) cur.push(false); }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function L() { return glay(N, N, 90, 44); }
    function pos() { var l = L(), a = [], i; for (i = 0; i < N * N; i++) a.push({ x: l.x0 + (i % N + 0.5) * l.s, y: l.y0 + (Math.floor(i / N) + 0.5) * l.s }); return a; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lvl: lvl, pend: pend, sol: sol.slice(), cur: cur.slice(), pos: pos() }; },
      down: function (x, y) {
        if (menu()) return; if (pend > 0 || st !== 'play') return;
        var l = L(), c = Math.floor((x - l.x0) / l.s), r = Math.floor((y - l.y0) / l.s);
        if (c < 0 || r < 0 || c >= N || r >= N) return;
        var p = r * N + c; cur[p] = !cur[p]; if (api.nota) api.nota(cur[p] ? 200 : 320, 0.06, 'triangle', 0.05);
        if (valid(cur)) lvlUp();
      },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) { tick(dt, load); },
      draw: function () {
        var l = L(), s = l.s, i; bg('#1b2230', '#070a10');
        for (i = 0; i < N * N; i++) {
          var x = l.x0 + (i % N) * s, y = l.y0 + Math.floor(i / N) * s;
          g.fillStyle = cur[i] ? '#4a4f58' : '#e8dcb6'; rr(x + 2, y + 2, s - 4, s - 4, 8); g.fill();
          if (cur[i]) { g.strokeStyle = 'rgba(255,255,255,.25)'; g.lineWidth = 2; g.beginPath(); g.moveTo(x + s * 0.25, y + s * 0.3); g.lineTo(x + s * 0.55, y + s * 0.2); g.lineTo(x + s * 0.8, y + s * 0.45); g.stroke(); }
          txt(String(num[i]), x + s / 2, y + s / 2 + s * 0.13, Math.max(18, s * 0.42), cur[i] ? '#9aa0a8' : '#2c2414');
        }
        foot(); hh(); fim(st);
      }
    };

  }
});
