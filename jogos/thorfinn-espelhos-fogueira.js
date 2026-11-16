/* Thorfinn Sigurdsson, conde das Órcades — leve a luz de uma fogueira à outra virando espelhos (invenção). */
BTJogo.registrar({
  canvas: 'jogo-thorfinn',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os espelhos de Thorfinn",
    "sub": "A luz sai da fogueira da esquerda e anda em linha reta até bater num espelho. Toque num espelho para virá-lo (de / para \\ e vice-versa). Faça o raio chegar à outra fogueira, na borda do tabuleiro, virando espelhos no máximo o número de vezes indicado, em até 75 segundos. (Teclado: setas movem o cursor, Espaço vira.)",
    "perdeu": "Sem viradas ou sem tempo",
    "v1": "As fogueiras se encontraram!",
    "v2": "A Orkneyinga saga faz de Thorfinn Sigurdsson um conde-guerreiro com terras na Escócia. Os espelhos e as fogueiras são invenção.",
    "h1": "Viradas",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Thorfinn's mirrors",
    "sub": "The light leaves the left bonfire and travels straight until it hits a mirror. Tap a mirror to flip it (from / to \\ and back). Make the beam reach the other bonfire, at the edge of the board, flipping mirrors no more than the number shown, within 75 seconds. (Keyboard: arrows move the cursor, Space flips.)",
    "perdeu": "Out of flips or out of time",
    "v1": "The bonfires met!",
    "v2": "The Orkneyinga saga makes Thorfinn Sigurdsson a warrior earl with lands in Scotland. The mirrors and the bonfires are invented.",
    "h1": "Flips",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Torfinns speil",
    "sub": "Lyset går ut fra bålet til venstre og går rett fram til det treffer et speil. Trykk på et speil for å vende det (fra / til \\ og tilbake). Få strålen fram til det andre bålet, ved kanten av brettet, ved å vende speil høyst det antallet ganger som vises, innen 75 sekunder. (Tastatur: piler flytter markøren, mellomrom vender.)",
    "perdeu": "Tom for vendinger eller tid",
    "v1": "Bålene møttes!",
    "v2": "Orknøyingenes saga gjør Torfinn Sigurdsson til en krigerjarl med land i Skottland. Speilene og bålene er oppfunnet.",
    "h1": "Vendinger",
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
    var N = 7, LIM = 75;
    var mir = {}, sol = {}, sr = 3, tgt = null, flips = 0, maxf = 5, t = 0, kx = 3, ky = 3, fix = [];
    function lay() { var W = api.w, H = api.h, cs = Math.max(36, Math.min((W - 90) / N, (H - 130) / N, 76)); return { W: W, H: H, cs: cs, x: (W - cs * N) / 2, y: Math.max(70, (H - cs * N) / 2 + 12) }; }
    function trace(m) {
      var x = -1, y = sr, dx = 1, dy = 0, path = [[x, y]], n = 0, ex = -1, ey = sr;
      while (n++ < 200) { x += dx; y += dy; path.push([x, y]); if (x < 0 || y < 0 || x >= N || y >= N) { ex = x - dx; ey = y - dy; break; } var k = m[x + ',' + y]; if (k) { var ndx, ndy; if (k === 1) { ndx = -dy; ndy = -dx; } else { ndx = dy; ndy = dx; } dx = ndx; dy = ndy; } }
      return { path: path, ex: ex, ey: ey, dx: dx, dy: dy, mc: path.filter(function (p) { return m[p[0] + ',' + p[1]]; }).length };
    }
    function setup() {
      for (var tr = 0; tr < 400; tr++) {
        sol = {}; sr = 1 + Math.floor(Math.random() * (N - 2)); var i, n = 10 + Math.floor(Math.random() * 4);
        for (i = 0; i < n; i++) sol[Math.floor(Math.random() * N) + ',' + Math.floor(Math.random() * N)] = 1 + Math.floor(Math.random() * 2);
        var r = trace(sol); if (r.mc < 4 || r.path.length < 8 || r.ex === 0 && false) continue; if (r.dx === -1) continue;
        tgt = { x: r.ex, y: r.ey, dx: r.dx, dy: r.dy };
        var onp = []; r.path.forEach(function (p) { var k = p[0] + ',' + p[1]; if (sol[k] && onp.indexOf(k) < 0) onp.push(k); });
        var kk = 3; mir = {}; for (var q in sol) mir[q] = sol[q]; fix = [];
        for (i = 0; i < kk && onp.length; i++) { var j = Math.floor(Math.random() * onp.length), c = onp.splice(j, 1)[0]; mir[c] = 3 - mir[c]; fix.push(c); }
        var r2 = trace(mir); if (r2.ex === tgt.x && r2.ey === tgt.y && r2.dx === tgt.dx && r2.dy === tgt.dy) continue;
        maxf = fix.length + 3; break;
      }
      flips = 0; t = 0; kx = 3; ky = 3;
    }
    function reset() { setup(); st = 'play'; }
    function solved() { var r = trace(mir); return r.ex === tgt.x && r.ey === tgt.y && r.dx === tgt.dx && r.dy === tgt.dy; }
    function flip(x, y) {
      if (st !== 'play') return; var k = x + ',' + y; if (!mir[k]) return;
      mir[k] = 3 - mir[k]; flips++; var i = fix.indexOf(k); if (i >= 0) fix.splice(i, 1); else fix.push(k); if (api.nota) api.nota(420, 0.08, 'triangle', 0.05);
      if (solved()) { st = 'win'; if (api.nota) api.nota(700, 0.3, 'sine', 0.06); } else if (flips >= maxf) st = 'lose';
    }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, fix: fix.slice(), flips: flips, max: maxf, t: t, pos: function (x, y) { return { x: L.x + (x + 0.5) * L.cs, y: L.y + (y + 0.5) * L.cs }; } }; },
      down: function (x, y) { if (menu()) return; var L = lay(); flip(Math.floor((x - L.x) / L.cs), Math.floor((y - L.y) / L.cs)); },
      move: function () {}, up: function () {},
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'ArrowLeft' || k === 'KeyA') kx = Math.max(0, kx - 1); else if (k === 'ArrowRight' || k === 'KeyD') kx = Math.min(N - 1, kx + 1); else if (k === 'ArrowUp' || k === 'KeyW') ky = Math.max(0, ky - 1); else if (k === 'ArrowDown' || k === 'KeyS') ky = Math.min(N - 1, ky + 1); else if (k === 'Space' || k === 'Enter') flip(kx, ky); },
      update: function (dt) { if (st !== 'play') return; t += dt; if (t >= LIM) st = 'lose'; },
      draw: function () {
        var L = lay(), cs = L.cs, i, j;
        bg('#1c1a2e', '#07060f');
        g.fillStyle = '#2a2740'; g.fillRect(L.x, L.y, cs * N, cs * N); g.strokeStyle = 'rgba(255,255,255,.07)'; g.lineWidth = 1; for (i = 0; i <= N; i++) { g.beginPath(); g.moveTo(L.x + i * cs, L.y); g.lineTo(L.x + i * cs, L.y + N * cs); g.moveTo(L.x, L.y + i * cs); g.lineTo(L.x + N * cs, L.y + i * cs); g.stroke(); }
        var r = trace(mir); g.strokeStyle = '#ffd88a'; g.lineWidth = 4; g.shadowColor = '#ffb040'; g.shadowBlur = 10; g.beginPath(); r.path.forEach(function (p, k) { var px = L.x + (p[0] + 0.5) * cs, py = L.y + (p[1] + 0.5) * cs; if (k) g.lineTo(px, py); else g.moveTo(px, py); }); g.stroke(); g.shadowBlur = 0;
        for (var key in mir) { var q = key.split(','), cx = L.x + (+q[0] + 0.5) * cs, cy = L.y + (+q[1] + 0.5) * cs, h = cs * 0.36; g.strokeStyle = '#9fd4f0'; g.lineWidth = 6; g.beginPath(); if (mir[key] === 1) { g.moveTo(cx - h, cy + h); g.lineTo(cx + h, cy - h); } else { g.moveTo(cx - h, cy - h); g.lineTo(cx + h, cy + h); } g.stroke(); }
        function fire(x, y, c) { g.fillStyle = c; g.beginPath(); g.moveTo(x, y - cs * 0.3); g.quadraticCurveTo(x + cs * 0.3, y, x, y + cs * 0.26); g.quadraticCurveTo(x - cs * 0.3, y, x, y - cs * 0.3); g.fill(); }
        fire(L.x - cs * 0.5, L.y + (sr + 0.5) * cs, '#ff9a3a'); fire(L.x + (tgt.x + tgt.dx + 0.5) * cs, L.y + (tgt.y + tgt.dy + 0.5) * cs, st === 'win' ? '#ff9a3a' : '#7a7a90');
        if (st === 'play') { g.strokeStyle = 'rgba(255,216,138,.55)'; g.lineWidth = 2; g.strokeRect(L.x + kx * cs + 3, L.y + ky * cs + 3, cs - 6, cs - 6); }
        bar(api.w / 2 - 110, api.h - 14, 220, 5, (LIM - t) / LIM, LIM - t < 15 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + flips + '/' + maxf, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };
  }
});
