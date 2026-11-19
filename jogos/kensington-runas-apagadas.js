/* Pedra de Kensington — apague as runas repetidas (invenção). */
BTJogo.registrar({
  canvas: 'jogo-kensington',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As runas apagadas",
    "sub": "Toque numa casa para escurecê-la, e de novo para clareá-la. Escureça casas até que nenhum número se repita na mesma linha ou na mesma coluna entre as casas claras. Casas escuras não podem ser vizinhas pelos lados, e as casas claras precisam formar um só bloco ligado. São 3 pedras, e o tempo é limitado.",
    "perdeu": "O tempo acabou antes de a pedra ser decifrada",
    "v1": "Pedra decifrada!",
    "v2": "A Pedra de Kensington, relatada em 1898 por Olof Ohman em Minnesota, traz uma inscrição rúnica que fala do ano de 1362. A maioria dos estudiosos a considera uma falsificação do século XIX. Apagar números é invenção.",
    "h1": "Inscrição",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The erased runes",
    "sub": "Tap a square to darken it, and again to lighten it. Darken squares until no number repeats in the same row or the same column among the light squares. Dark squares cannot touch side by side, and the light squares must form one connected block. There are 3 stones, and time is limited.",
    "perdeu": "Time ran out before the stone was deciphered",
    "v1": "Stone deciphered!",
    "v2": "The Kensington Runestone, reported in 1898 by Olof Ohman in Minnesota, bears a runic inscription dated 1362. Most scholars regard it as a 19th-century hoax. Blacking out numbers is invented.",
    "h1": "Inscription",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "De utslettede runene",
    "sub": "Trykk på en rute for å gjøre den mørk, og igjen for å gjøre den lys. Gjør ruter mørke til ingen tall gjentar seg i samme rad eller samme kolonne blant de lyse rutene. Mørke ruter kan ikke ligge side om side, og de lyse rutene må danne én sammenhengende blokk. Det er 3 steiner, og tiden er begrenset.",
    "perdeu": "Tiden gikk ut før steinen var tydd",
    "v1": "Steinen er tydd!",
    "v2": "Kensington-runesteinen, meldt funnet i 1898 av Olof Ohman i Minnesota, har en runeinnskrift datert 1362. De fleste forskere mener den er en forfalskning fra 1800-tallet. Å sverte ut tall er oppfunnet.",
    "h1": "Innskrift",
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
    var LV = [5, 5, 6], NL = 3, LIM = 360;
    var lvl = 0, n = 5, val = [], blk = [], sol = [], t = 0, pend = 0;
    function nbs(i) { var x = i % n, y = (i / n) | 0, o = []; if (x > 0) o.push(i - 1); if (x < n - 1) o.push(i + 1); if (y > 0) o.push(i - n); if (y < n - 1) o.push(i + n); return o; }
    function connected(b) { var f = -1, i, tot = 0; for (i = 0; i < n * n; i++) if (!b[i]) { tot++; if (f < 0) f = i; } if (f < 0) return true; var seen = {}, st2 = [f], c = 1; seen[f] = 1; while (st2.length) { var m = st2.pop(); nbs(m).forEach(function (z) { if (!b[z] && !seen[z]) { seen[z] = 1; c++; st2.push(z); } }); } return c === tot; }
    function rules(b, v) {
      var i, j; for (i = 0; i < n * n; i++) if (b[i]) { var ns = nbs(i); for (j = 0; j < ns.length; j++) if (b[ns[j]]) return false; }
      for (i = 0; i < n; i++) { var sr = {}, sc = {}; for (j = 0; j < n; j++) { var a = i * n + j, c = j * n + i; if (!b[a]) { if (sr[v[a]]) return false; sr[v[a]] = 1; } if (!b[c]) { if (sc[v[c]]) return false; sc[v[c]] = 1; } } }
      return connected(b);
    }
    function count(v) {
      var b = [], c = 0, i; for (i = 0; i < n * n; i++) b.push(0);
      (function go(k) {
        if (c > 1) return; if (k === n * n) { if (connected(b)) c++; return; }
        var x = k % n, y = (k / n) | 0, j, ok;
        ok = true; for (j = 0; j < x; j++) if (!b[y * n + j] && v[y * n + j] === v[k]) ok = false; for (j = 0; j < y; j++) if (!b[j * n + x] && v[j * n + x] === v[k]) ok = false; if (ok) { b[k] = 0; go(k + 1); }
        ok = true; if (x > 0 && b[k - 1]) ok = false; if (y > 0 && b[k - n]) ok = false; if (ok) { b[k] = 1; go(k + 1); b[k] = 0; }
      })(0); return c;
    }
    function shuf(m) { var a = [], i; for (i = 0; i < m; i++) a.push(i); a.sort(function () { return Math.random() - 0.5; }); return a; }
    function gen(i) {
      n = LV[i];
      for (var tries = 0; tries < 3000; tries++) {
        var pr = shuf(n), pc = shuf(n), pv = shuf(n), v = [], b = [], r, c, k;
        for (r = 0; r < n; r++) for (c = 0; c < n; c++) { v.push(pv[(pr[r] + pc[c]) % n] + 1); b.push(0); }
        var order = shuf(n * n), target = Math.round(n * n * 0.26), cnt = 0;
        for (k = 0; k < order.length && cnt < target; k++) { var m = order[k], ns = nbs(m), ok = true; ns.forEach(function (z) { if (b[z]) ok = false; }); if (!ok) continue; b[m] = 1; if (!connected(b)) { b[m] = 0; continue; } cnt++; }
        for (k = 0; k < n * n; k++) if (b[k]) { var cand = []; for (r = 0; r < n; r++) { var a1 = ((k / n) | 0) * n + r, a2 = r * n + (k % n); if (a1 !== k && !b[a1]) cand.push(v[a1]); if (a2 !== k && !b[a2]) cand.push(v[a2]); } v[k] = cand[(Math.random() * cand.length) | 0]; }
        if (!rules(b, v)) continue;
        if (count(v) === 1) { val = v; sol = b.slice(); blk = []; for (k = 0; k < n * n; k++) blk.push(0); return; }
      }
    }
    function reset() { lvl = 0; t = 0; pend = 0; gen(0); st = 'play'; }
    function lay() { var W = api.w, H = api.h, s = Math.min((W - 20) / n, (H - 130) / n, 64); return { s: s, x0: (W - s * n) / 2, y0: 72 }; }
    function cc(i) { var L = lay(); return { x: L.x0 + (i % n) * L.s + L.s / 2, y: L.y0 + ((i / n) | 0) * L.s + L.s / 2 }; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { var p = [], i; for (i = 0; i < n * n; i++) p.push(cc(i)); return { st: st, lvl: lvl, n: n, val: val.slice(), cur: blk.slice(), sol: sol.slice(), pos: p, t: t, pend: pend }; },
      down: function (x, y) {
        if (menu()) return; if (pend > 0) return; var L = lay(), c = Math.floor((x - L.x0) / L.s), r = Math.floor((y - L.y0) / L.s);
        if (c < 0 || c >= n || r < 0 || r >= n) return; var i = r * n + c; blk[i] = blk[i] ? 0 : 1; if (api.nota) api.nota(blk[i] ? 200 : 300, 0.05, 'square', 0.03);
        if (rules(blk, val)) { lvl++; pend = 0.9; if (api.nota) api.nota(520, 0.2, 'triangle', 0.07); }
      },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) {
        if (st !== 'play') return; t += dt;
        if (pend > 0) { pend -= dt; if (pend <= 0) { if (lvl >= NL) st = 'win'; else gen(lvl); } }
        if (st === 'play' && t >= LIM) st = 'lose';
      },
      draw: function () {
        var L = lay(), i; bg('#1b2230', '#07090e');
        for (i = 0; i < n * n; i++) {
          var x = L.x0 + (i % n) * L.s, y = L.y0 + ((i / n) | 0) * L.s, b = blk[i], p = cc(i);
          g.fillStyle = b ? '#0d1017' : '#b9b3a2'; rr(x + 2, y + 2, L.s - 4, L.s - 4, 6); g.fill();
          g.strokeStyle = 'rgba(255,255,255,.18)'; g.lineWidth = 1; rr(x + 2, y + 2, L.s - 4, L.s - 4, 6); g.stroke();
          txt(String(val[i]), p.x, p.y + 1, L.s * 0.46, b ? '#4a5266' : '#1c2230');
        }
        bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 60 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + Math.min(lvl + 1, NL) + '/' + NL, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };

  }
});
