/* Wulfstan — preencha a grade de quatro marcas de rota sem repetir. */
BTJogo.registrar({
  canvas: 'jogo-wulfstan',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As marcas da rota",
    "sub": "Toque numa casa vazia e depois numa das quatro marcas embaixo. Cada marca deve aparecer uma só vez em cada linha, em cada coluna e em cada bloco de 2 por 2. Preencha a grade inteira em até 150 segundos.",
    "perdeu": "O tempo acabou",
    "v1": "A rota está completa!",
    "v2": "Em c. 880, Wulfstan navegou de Hedeby a Truso em sete dias e noites. A grade e as marcas são invenção do jogo.",
    "h1": "Casas",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The route marks",
    "sub": "Tap an empty square and then one of the four marks below. Each mark must appear only once in each row, each column and each 2-by-2 block. Fill the whole grid within 150 seconds.",
    "perdeu": "The time ran out",
    "v1": "The route is complete!",
    "v2": "Around 880, Wulfstan sailed from Hedeby to Truso in seven days and nights. The grid and the marks are made up for the game.",
    "h1": "Squares",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Rutemerkene",
    "sub": "Trykk på en tom rute og så på ett av de fire merkene nederst. Hvert merke må forekomme bare én gang i hver rad, hver kolonne og hver blokk på 2 ganger 2. Fyll hele rutenettet på 150 sekunder.",
    "perdeu": "Tiden gikk ut",
    "v1": "Ruten er fullført!",
    "v2": "Omkring 880 seilte Wulfstan fra Hedeby til Truso på sju dager og netter. Rutenettet og merkene er diktet opp for spillet.",
    "h1": "Ruter",
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
    var LIM = 150, SYM = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ'], COL = ['#d8493a', '#4a8ad0', '#7fc06a', '#e0b840'];
    var sol = [], gv = [], fixed = [], t = 0, cur = 0;
    function lay() { var W = api.w, H = api.h, cs = Math.max(44, Math.min((W - 24) / 4, (H - 230) / 4, 84)); return { cs: cs, x: (W - cs * 4) / 2, y: Math.max(92, (H - cs * 4 - cs - 30) / 2 + 8), by: 0 }; }
    function ok(g_, i, v) { var r = Math.floor(i / 4), c = i % 4, br = r - r % 2, bc = c - c % 2; for (var k = 0; k < 16; k++) { if (k === i || g_[k] !== v) continue; var rr_ = Math.floor(k / 4), cc = k % 4; if (rr_ === r || cc === c || (rr_ - rr_ % 2 === br && cc - cc % 2 === bc)) return false; } return true; }
    function fill(g_, i) { if (i === 16) return true; var vs = [1, 2, 3, 4].sort(function () { return Math.random() - 0.5; }); for (var k = 0; k < 4; k++) { if (ok(g_, i, vs[k])) { g_[i] = vs[k]; if (fill(g_, i + 1)) return true; g_[i] = 0; } } return false; }
    function count(g_, i, lim) { if (i === 16) return 1; if (g_[i]) return count(g_, i + 1, lim); var n = 0; for (var v = 1; v <= 4 && n < lim; v++) { if (ok(g_, i, v)) { g_[i] = v; n += count(g_, i + 1, lim - n); g_[i] = 0; } } return n; }
    function setup() { var s = new Array(16).fill(0); fill(s, 0); sol = s; var p = []; for (var i = 0; i < 16; i++) p.push(i); p.sort(function () { return Math.random() - 0.5; }); var g_ = s.slice(); var keep = 16; for (var j = 0; j < 16 && keep > 6; j++) { var v = g_[p[j]]; g_[p[j]] = 0; var cp = g_.slice(); if (count(cp, 0, 2) !== 1) g_[p[j]] = v; else keep--; } gv = g_; fixed = g_.map(function (v) { return v > 0; }); t = 0; cur = 0; }
    function reset() { setup(); st = 'play'; }
    function filled() { return gv.filter(function (v) { return v > 0; }).length; }
    function done() { for (var i = 0; i < 16; i++) if (gv[i] !== sol[i]) return false; return true; }
    function setv(v) { if (st !== 'play' || fixed[cur]) return; gv[cur] = v; if (api.nota) api.nota(300 + v * 60, 0.05, 'triangle', 0.04); if (done()) { st = 'win'; if (api.nota) api.nota(700, 0.2, 'triangle', 0.06); } }
    function conflict(i) { var v = gv[i]; return v > 0 && !ok(gv, i, v); }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, gv: gv.slice(), sol: sol.slice(), fixed: fixed.slice(), t: t, tmr: LIM - t, pos: function (i) { return { x: L.x + (i % 4 + 0.5) * L.cs, y: L.y + (Math.floor(i / 4) + 0.5) * L.cs }; }, btn: function (k) { return { x: L.x + (k + 0.5) * L.cs, y: L.y + L.cs * 4 + 26 + L.cs * 0.5 }; } }; },
      down: function (x, y) { if (menu()) return; var L = lay(), c = Math.floor((x - L.x) / L.cs), r = Math.floor((y - L.y) / L.cs); if (r >= 0 && r < 4 && c >= 0 && c < 4) { cur = r * 4 + c; return; } var by = L.y + L.cs * 4 + 26; if (y >= by && y <= by + L.cs && c >= 0 && c < 4) setv(c + 1); },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'ArrowLeft') cur = cur % 4 ? cur - 1 : cur + 3; else if (k === 'ArrowRight') cur = cur % 4 < 3 ? cur + 1 : cur - 3; else if (k === 'ArrowUp') cur = (cur + 12) % 16; else if (k === 'ArrowDown') cur = (cur + 4) % 16; else if (/^Digit[1-4]$/.test(k)) setv(+k.slice(5)); else if (k === 'Backspace' || k === 'Digit0' || k === 'Delete') setv(0); },
      update: function (dt) { if (st !== 'play') return; t += dt; if (t >= LIM) { t = LIM; st = 'lose'; } },
      draw: function () {
        var L = lay(), W = api.w, H = api.h, i;
        bg('#1a2a3a', '#050a10');
        g.fillStyle = 'rgba(0,0,0,.35)'; rr(L.x - 5, L.y - 5, L.cs * 4 + 10, L.cs * 4 + 10, 10); g.fill();
        for (i = 0; i < 16; i++) { var x = L.x + (i % 4) * L.cs, y = L.y + Math.floor(i / 4) * L.cs; g.fillStyle = fixed[i] ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.05)'; g.fillRect(x + 1, y + 1, L.cs - 2, L.cs - 2); if (gv[i]) txt(SYM[gv[i] - 1], x + L.cs / 2, y + L.cs * 0.68, L.cs * 0.5, conflict(i) ? '#ff6a5a' : (fixed[i] ? '#fff' : COL[gv[i] - 1])); if (cur === i && st === 'play') { g.strokeStyle = 'rgba(255,216,138,.8)'; g.lineWidth = 2; g.strokeRect(x + 2, y + 2, L.cs - 4, L.cs - 4); } }
        g.strokeStyle = 'rgba(255,216,138,.5)'; g.lineWidth = 2; g.beginPath(); g.moveTo(L.x + L.cs * 2, L.y); g.lineTo(L.x + L.cs * 2, L.y + L.cs * 4); g.moveTo(L.x, L.y + L.cs * 2); g.lineTo(L.x + L.cs * 4, L.y + L.cs * 2); g.stroke();
        for (i = 0; i < 4; i++) { var bx = L.x + i * L.cs, by = L.y + L.cs * 4 + 26; g.fillStyle = 'rgba(255,255,255,.1)'; rr(bx + 4, by + 2, L.cs - 8, L.cs - 4, 10); g.fill(); txt(SYM[i], bx + L.cs / 2, by + L.cs * 0.68, L.cs * 0.5, COL[i]); }
        hud(T.h1 + ' ' + filled() + '/16', T.h2 + ' ' + Math.ceil(LIM - t), false);
        fim(st);
      }
    };
  }
});
