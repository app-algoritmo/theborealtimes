/* Mylingen, alma de criança do folclore nórdico — desvie na estrada à noite (invenção). */
BTJogo.registrar({
  canvas: 'jogo-mylingen',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A estrada dos mylingar",
    "sub": "Você anda sozinho numa estrada à noite. Toque na metade esquerda ou direita da tela (ou use as setas) para mudar de faixa e desviar das almas que correm na sua direção. Chegue ao cemitério, a 300 metros, com no máximo 3 choques.",
    "perdeu": "Almas demais te alcançaram",
    "v1": "Você chegou ao cemitério!",
    "v2": "No folclore escandinavo, o myling é a alma de uma criança morta sem batismo. A estrada e a corrida são invenção.",
    "h1": "Distância",
    "h2": "Choques"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The mylings' road",
    "sub": "You walk alone on a road at night. Tap the left or right half of the screen (or use the arrows) to change lane and dodge the souls running toward you. Reach the cemetery, 300 metres away, with at most 3 bumps.",
    "perdeu": "Too many souls caught up with you",
    "v1": "You reached the cemetery!",
    "v2": "In Scandinavian folklore, the myling is the soul of a child who died unbaptised. The road and the run are invented.",
    "h1": "Distance",
    "h2": "Bumps"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Mylingenes vei",
    "sub": "Du går alene på en vei om natten. Trykk på venstre eller høyre halvdel av skjermen (eller bruk piltastene) for å bytte felt og unngå sjelene som løper mot deg. Kom deg til kirkegården, 300 meter unna, med høyst 3 støt.",
    "perdeu": "For mange sjeler tok deg igjen",
    "v1": "Du nådde kirkegården!",
    "v2": "I skandinavisk folklore er mylingen sjelen til et barn som døde udøpt. Veien og løpet er oppfunnet.",
    "h1": "Distanse",
    "h2": "Støt"
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
    var GOAL = 300, LIM = 75, MAXB = 3;
    var lane = 1, vx = 1, d = 0, obs = [], nextRow = 14, lastFree = 1, bumps = 0, inv = 0, t = 0, shk = 0;
    function speed() { return 9 + 4 * Math.min(1, d / GOAL); }
    function spacing() { return 6 - 1.5 * Math.min(1, d / GOAL); }
    function lay() { var W = api.w, H = api.h, rw = Math.min(W - 20, 360), py = H * 0.78; return { W: W, H: H, rw: rw, lw: rw / 3, x0: (W - rw) / 2, py: py, sc: (py - 70) / 18 }; }
    function fill() {
      while (nextRow < d + 40) {
        var f = lastFree + [-1, 0, 0, 1][Math.floor(Math.random() * 4)]; f = Math.max(0, Math.min(2, f));
        for (var l = 0; l < 3; l++) if (l !== f && Math.random() < 0.8) obs.push({ p: nextRow, l: l });
        lastFree = f; nextRow += spacing();
      }
    }
    function reset() { lane = 1; vx = 1; d = 0; obs = []; nextRow = 14; lastFree = 1; bumps = 0; inv = 0; t = 0; shk = 0; fill(); st = 'play'; }
    function go(dl) { if (st !== 'play') return; var n = Math.max(0, Math.min(2, lane + dl)); if (n !== lane) { lane = n; if (api.nota) api.nota(260, 0.05, 'triangle', 0.04); } }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lane: lane, d: d, goal: GOAL, bumps: bumps, speed: speed(), obs: obs.map(function (o) { return { p: o.p, l: o.l }; }), t: t }; },
      down: function (x, y) { if (menu()) return; go(x < api.w / 2 ? -1 : 1); },
      move: function () {}, up: function () {},
      key: function (k, dn) { if (!dn) return; if (st !== 'play') { menu(); return; } if (k === 'ArrowLeft' || k === 'KeyA') go(-1); else if (k === 'ArrowRight' || k === 'KeyD') go(1); },
      update: function (dt) {
        vx += (lane - vx) * Math.min(1, dt * 14); if (inv > 0) inv -= dt; if (shk > 0) shk -= dt;
        if (st !== 'play') return; t += dt; if (t >= LIM) { st = 'lose'; return; }
        d += speed() * dt; fill();
        for (var i = obs.length - 1; i >= 0; i--) {
          var o = obs[i];
          if (o.p < d - 3) { obs.splice(i, 1); continue; }
          if (inv <= 0 && o.l === lane && Math.abs(o.p - d) < 0.55) { bumps++; inv = 1.2; shk = 0.3; obs.splice(i, 1); if (api.nota) api.nota(110, 0.3, 'sawtooth', 0.07); if (bumps >= MAXB) { st = 'lose'; return; } }
        }
        if (d >= GOAL) st = 'win';
      },
      draw: function () {
        var L = lay(), W = L.W, H = L.H, i;
        bg('#101a2e', '#04070f');
        g.fillStyle = 'rgba(243,236,210,.7)'; g.beginPath(); g.arc(W - 60, 100, 22, 0, 6.283); g.fill();
        var sx = shk > 0 ? Math.sin(shk * 80) * 5 : 0;
        g.fillStyle = '#2a2a30'; g.fillRect(L.x0 + sx, 0, L.rw, H);
        g.strokeStyle = 'rgba(243,236,210,.25)'; g.lineWidth = 3;
        for (i = 1; i < 3; i++) { for (var yy = -((d * L.sc) % 60); yy < H; yy += 60) { g.beginPath(); g.moveTo(L.x0 + i * L.lw + sx, yy); g.lineTo(L.x0 + i * L.lw + sx, yy + 30); g.stroke(); } }
        g.fillStyle = '#1b3a1b'; g.fillRect(0, 0, L.x0, H); g.fillRect(L.x0 + L.rw, 0, W, H);
        obs.forEach(function (o) {
          var y = L.py - (o.p - d) * L.sc; if (y < -40 || y > H + 40) return; var x = L.x0 + (o.l + 0.5) * L.lw + sx, s = 0.6 + 0.4 * Math.min(1, (y - 40) / (L.py - 40));
          g.fillStyle = 'rgba(200,215,255,.22)'; g.beginPath(); g.arc(x, y, 26 * s, 0, 6.283); g.fill();
          g.fillStyle = '#e8eefc'; g.beginPath(); g.arc(x, y - 9 * s, 9 * s, 0, 6.283); g.fill(); g.beginPath(); g.moveTo(x - 11 * s, y + 14 * s); g.lineTo(x - 7 * s, y - 2 * s); g.lineTo(x + 7 * s, y - 2 * s); g.lineTo(x + 11 * s, y + 14 * s); g.closePath(); g.fill();
          g.fillStyle = '#222'; g.fillRect(x - 5 * s, y - 11 * s, 3 * s, 3 * s); g.fillRect(x + 2 * s, y - 11 * s, 3 * s, 3 * s);
        });
        var px = L.x0 + (vx + 0.5) * L.lw + sx, blink = inv > 0 && Math.floor(api.clock * 14) % 2;
        if (!blink) { g.fillStyle = '#c0563f'; g.beginPath(); g.arc(px, L.py, 14, 0, 6.283); g.fill(); g.fillStyle = '#e8c9a0'; g.beginPath(); g.arc(px, L.py - 18, 8, 0, 6.283); g.fill(); g.fillStyle = '#ffd88a'; g.beginPath(); g.arc(px + 15, L.py - 4, 5, 0, 6.283); g.fill(); }
        bar(W / 2 - 110, H - 14, 220, 5, (LIM - t) / LIM, LIM - t < 12 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + Math.floor(d) + '/' + GOAL, T.h2 + ' ' + bumps + '/' + MAXB, bumps >= MAXB - 1);
        fim(st);
      }
    };
  }
});
