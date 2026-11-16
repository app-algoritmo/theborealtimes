/* Grottasöngr — junte as mós do moinho Grotti até formar a peça de 256. */
BTJogo.registrar({
  canvas: 'jogo-grotti',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As mós de Grotti",
    "sub": "Deslize o dedo (ou use as setas) para empurrar todas as peças para um lado. Duas peças iguais que se encontram viram uma só, com o dobro do valor. Chegue à peça de 256 em até 180 segundos.",
    "perdeu": "Sem jogadas ou sem tempo",
    "v1": "A mó de 256 está pronta!",
    "v2": "No Grottasöngr, Fenja e Menja giram o moinho Grotti para o rei Fróði. A fusão de peças numéricas é invenção.",
    "h1": "Maior",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Grotti's millstones",
    "sub": "Swipe (or use the arrow keys) to push all the pieces to one side. Two equal pieces that meet become one, with double the value. Reach the piece of 256 within 180 seconds.",
    "perdeu": "No moves or no time left",
    "v1": "The millstone of 256 is ready!",
    "v2": "In the Grottasöngr, Fenja and Menja turn the mill Grotti for King Fróði. The merging of numbered pieces is made up.",
    "h1": "Biggest",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Grottis kvernsteiner",
    "sub": "Sveip (eller bruk piltastene) for å skyve alle brikkene til én side. To like brikker som møtes, blir til én med dobbel verdi. Nå brikken med 256 innen 180 sekunder.",
    "perdeu": "Ingen trekk eller ingen tid igjen",
    "v1": "Kvernsteinen på 256 er klar!",
    "v2": "I Grottasöngr dreier Fenja og Menja kvernen Grotti for kong Fróði. Sammenslåingen av nummererte brikker er diktet opp.",
    "h1": "Størst",
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
    var N = 4, GOAL = 256, LIM = 180;
    var b = [], t = 0, sx = 0, sy = 0, down_ = false, used = false, best = 2, slide = 0, cur = 0;
    function lay() { var W = api.w, H = api.h, cs = Math.max(56, Math.min((W - 24) / N, (H - 170) / N, 100)); return { cs: cs, x: (W - cs * N) / 2, y: Math.max(92, (H - cs * N) / 2 + 8) }; }
    function addTile() { var f = []; for (var i = 0; i < 16; i++) if (!b[i]) f.push(i); if (!f.length) return; b[f[Math.floor(Math.random() * f.length)]] = Math.random() < 0.9 ? 2 : 4; }
    function setup() { b = []; for (var i = 0; i < 16; i++) b.push(0); addTile(); addTile(); t = 0; best = 2; slide = 0; }
    function reset() { setup(); st = 'play'; }
    function line(a) { var r = a.filter(function (x) { return x; }), out = [], i = 0; while (i < r.length) { if (i + 1 < r.length && r[i] === r[i + 1]) { out.push(r[i] * 2); i += 2; } else { out.push(r[i]); i++; } } while (out.length < N) out.push(0); return out; }
    function shift(dir) { var nb = b.slice(), moved = false, r, c, k; for (k = 0; k < N; k++) { var idx = []; for (var j = 0; j < N; j++) { if (dir === 0) idx.push(k * N + j); else if (dir === 1) idx.push(k * N + (N - 1 - j)); else if (dir === 2) idx.push(j * N + k); else idx.push((N - 1 - j) * N + k); } var res = line(idx.map(function (i) { return b[i]; })); idx.forEach(function (i, j) { if (nb[i] !== res[j]) moved = true; nb[i] = res[j]; }); } return moved ? nb : null; }
    function canMove() { for (var d = 0; d < 4; d++) if (shift(d)) return true; return false; }
    function push(dir) { if (st !== 'play') return; var nb = shift(dir); if (!nb) return; b = nb; addTile(); slide = 0.12; best = Math.max.apply(null, b); if (api.nota) api.nota(260 + Math.log(best) * 40, 0.05, 'triangle', 0.04); if (best >= GOAL) { st = 'win'; return; } if (!canMove()) st = 'lose'; }
    setup();
    return {
      pausar: function () { down_ = false; },
      dbg: function () { return { st: st, b: b.slice(), best: best, goal: GOAL, t: t, tmr: LIM - t }; },
      down: function (x, y) { if (menu()) return; sx = x; sy = y; down_ = true; used = false; },
      move: function (x, y, pr) { if (st !== 'play' || !down_ || used) return; var dx = x - sx, dy = y - sy; if (Math.abs(dx) > 26 || Math.abs(dy) > 26) { used = true; if (Math.abs(dx) > Math.abs(dy)) push(dx < 0 ? 0 : 1); else push(dy < 0 ? 2 : 3); } },
      up: function () { down_ = false; },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'ArrowLeft' || k === 'KeyA') push(0); else if (k === 'ArrowRight' || k === 'KeyD') push(1); else if (k === 'ArrowUp' || k === 'KeyW') push(2); else if (k === 'ArrowDown' || k === 'KeyS') push(3); },
      update: function (dt) { if (slide > 0) slide -= dt; if (st !== 'play') return; t += dt; if (t >= LIM) { t = LIM; st = 'lose'; } },
      draw: function () {
        var L = lay(), W = api.w, H = api.h, i;
        bg('#1e1e2e', '#07070e');
        g.fillStyle = 'rgba(0,0,0,.4)'; rr(L.x - 6, L.y - 6, L.cs * N + 12, L.cs * N + 12, 12); g.fill();
        for (i = 0; i < 16; i++) { var x = L.x + (i % N) * L.cs, y = L.y + Math.floor(i / N) * L.cs; g.fillStyle = 'rgba(255,255,255,.06)'; rr(x + 3, y + 3, L.cs - 6, L.cs - 6, 10); g.fill(); var v = b[i]; if (v) { var k = Math.log(v) / Math.log(2), hue = 200 - Math.min(k, 8) * 22; g.fillStyle = 'hsl(' + hue + ',45%,' + (32 + k * 3) + '%)'; rr(x + 3, y + 3, L.cs - 6, L.cs - 6, 10); g.fill(); txt(String(v), x + L.cs / 2, y + L.cs * 0.64, L.cs * (v > 99 ? 0.32 : 0.4), '#fff'); } }
        bar(W / 2 - 110, H - 14, 220, 5, (LIM - t) / LIM, LIM - t < 30 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + best + '/' + GOAL, T.h2 + ' ' + Math.ceil(LIM - t), false);
        fim(st);
      }
    };
  }
});
