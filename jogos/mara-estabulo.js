/* O estábulo da Mara — ache as cinco diferenças entre os dois desenhos. */
BTJogo.registrar({
  canvas: 'jogo-mara',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O estábulo da Mara",
    "sub": "Depois da visita da mara, o estábulo ficou diferente. Há cinco diferenças entre os dois desenhos. Toque onde achar cada uma (ou mova a mira com as setas e use a barra de espaço). Três toques errados e o jogo acaba. O tempo é curto.",
    "perdeu": "A mara embaralhou tudo",
    "v1": "Todas as diferenças!",
    "v2": "Na tradição escandinava, a mara é um espírito que monta no peito de quem dorme, e dizem que embaraça as crinas dos cavalos. O jogo é invenção.",
    "h1": "Diferenças",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The mara's stable",
    "sub": "After the mara’s visit, the stable looks different. There are five differences between the two drawings. Tap where you spot each one (or move the crosshair with the arrows and press Space). Three wrong taps and the game is over. Time is short.",
    "perdeu": "The mara mixed everything up",
    "v1": "All the differences!",
    "v2": "In Scandinavian tradition, the mara is a spirit that sits on the chest of sleepers, and is said to tangle horses’ manes. The game is made up.",
    "h1": "Differences",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Marens stall",
    "sub": "Etter marens besøk ser stallen annerledes ut. Det er fem forskjeller mellom de to tegningene. Trykk der du finner hver av dem (eller flytt siktet med piltastene og bruk mellomromstasten). Tre feil trykk, og spillet er over. Tiden er knapp.",
    "perdeu": "Mara rotet til alt",
    "v1": "Alle forskjellene!",
    "v2": "I skandinavisk tradisjon er mara en ånd som rir på brystet til folk som sover, og man sier at den floker hestemanker. Spillet er diktet opp.",
    "h1": "Forskjeller",
    "h2": "Feil"
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
    var NEED = 5, MAXE = 3, LIM = 90;
    var DF = [[320, 70], [190, 150], [80, 80], [300, 232], [360, 205], [250, 42], [205, 112], [149, 183]];
    var sel = [], found = [], errs = 0, tmr = LIM, cx = 225, cy = 200, kx = 0, ky = 0, mk = 0;
    function lay() {
      var W = api.w, H = api.h, land = W >= H * 1.15, pw, ph, a, b;
      if (land) { pw = Math.min((W - 50) / 2, (H - 100) * 4 / 3); ph = pw * 0.75; var y = (H - ph) / 2 + 16; a = { x: (W - pw * 2 - 20) / 2, y: y }; b = { x: a.x + pw + 20, y: y }; }
      else { pw = Math.min(W - 30, ((H - 120) / 2) * 4 / 3); ph = pw * 0.75; a = { x: (W - pw) / 2, y: 68 }; b = { x: a.x, y: 68 + ph + 14 }; }
      return { pw: pw, ph: ph, s: pw / 400, a: a, b: b };
    }
    function setup() { var p = [0, 1, 2, 3, 4, 5, 6, 7]; for (var k = 7; k > 0; k--) { var j = Math.floor(Math.random() * (k + 1)), t = p[k]; p[k] = p[j]; p[j] = t; } sel = p.slice(0, 5); found = [false, false, false, false, false]; errs = 0; tmr = LIM; mk = 0; var L = lay(); cx = L.a.x + L.pw / 2; cy = L.a.y + L.ph / 2; }
    function reset() { setup(); st = 'play'; }
    function has(id) { return sel.indexOf(id) >= 0; }
    function scene(ox, oy, s, B) {
      g.save(); g.beginPath(); g.rect(ox, oy, 400 * s, 300 * s); g.clip(); g.translate(ox, oy); g.scale(s, s);
      g.fillStyle = '#6e4a2c'; g.fillRect(0, 0, 400, 300); g.fillStyle = '#5a3c22'; for (var i = 0; i < 400; i += 40) g.fillRect(i, 0, 3, 250);
      g.fillStyle = '#3c2814'; g.fillRect(0, 250, 400, 50); g.fillStyle = '#4a331f'; g.fillRect(0, 36, 400, 10); g.fillRect(0, 130, 400, 6);
      /* janela: 0=lanterna(320,70) 2=janela(80,80) */
      g.fillStyle = '#1c2a44'; g.fillRect(56, 56, 48, 48); g.strokeStyle = '#3a2a18'; g.lineWidth = 4; g.strokeRect(56, 56, 48, 48); g.beginPath(); g.moveTo(80, 56); g.lineTo(80, 104); if (!(B && has(2))) { g.moveTo(56, 80); g.lineTo(104, 80); } g.stroke();
      if (!(B && has(0))) { g.strokeStyle = '#2a2a2a'; g.lineWidth = 2; g.beginPath(); g.moveTo(320, 46); g.lineTo(320, 58); g.stroke(); g.fillStyle = '#ffcf5a'; g.fillRect(310, 58, 20, 24); g.strokeStyle = '#2a2a2a'; g.strokeRect(310, 58, 20, 24); }
      if (!(B && has(5))) { g.fillStyle = '#222'; g.beginPath(); g.ellipse(250, 34, 16, 9, 0, 0, 6.29); g.fill(); g.beginPath(); g.moveTo(240, 28); g.lineTo(242, 18); g.lineTo(248, 26); g.moveTo(252, 26); g.lineTo(258, 18); g.lineTo(260, 28); g.fill(); }
      if (!(B && has(6))) { g.strokeStyle = '#c9ced8'; g.lineWidth = 4; g.beginPath(); g.arc(205, 112, 12, 0.6, 5.7); g.stroke(); }
      /* cavalo e manta */
      g.fillStyle = '#8a5a2a'; g.beginPath(); g.ellipse(150, 200, 50, 28, 0, 0, 6.29); g.fill(); g.fillRect(190, 150, 22, 56); g.beginPath(); g.ellipse(208, 150, 22, 14, -0.4, 0, 6.29); g.fill(); g.fillRect(112, 214, 8, 36); g.fillRect(172, 214, 8, 36);
      g.fillStyle = (B && has(1)) ? '#e8e0cc' : '#2a1a0c'; g.fillRect(186, 136, 8, 30); g.beginPath(); g.moveTo(104, 190); g.lineTo(92, 230); g.lineTo(110, 216); g.fill();
      g.fillStyle = (B && has(7)) ? '#3a6aa8' : '#b3261e'; g.fillRect(122, 172, 54, 22);
      if (!(B && has(3))) { g.fillStyle = '#8a8f9a'; g.fillRect(288, 222, 24, 22); g.strokeStyle = '#4a4a50'; g.lineWidth = 2; g.beginPath(); g.arc(300, 222, 12, 3.14, 6.29); g.stroke(); }
      if (!(B && has(4))) { g.strokeStyle = '#6b4a2a'; g.lineWidth = 4; g.beginPath(); g.moveTo(350, 250); g.lineTo(366, 170); g.stroke(); g.lineWidth = 3; g.beginPath(); g.moveTo(360, 176); g.lineTo(372, 172); g.moveTo(364, 188); g.lineTo(376, 184); g.stroke(); }
      g.fillStyle = '#c9a23a'; g.fillRect(40, 232, 52, 22); g.fillRect(48, 214, 36, 20);
      g.restore();
    }
    function tapAt(x, y) {
      if (st !== 'play') return; var L = lay(), P = null, i;
      if (x >= L.a.x && x <= L.a.x + L.pw && y >= L.a.y && y <= L.a.y + L.ph) P = L.a; else if (x >= L.b.x && x <= L.b.x + L.pw && y >= L.b.y && y <= L.b.y + L.ph) P = L.b; if (!P) return;
      var sx = (x - P.x) / L.s, sy = (y - P.y) / L.s;
      for (i = 0; i < 5; i++) if (!found[i] && Math.hypot(sx - DF[sel[i]][0], sy - DF[sel[i]][1]) <= 34) { found[i] = true; var all = true; for (var k = 0; k < 5; k++) if (!found[k]) all = false; if (all) st = 'win'; return; }
      errs++; mk = 0.4; if (errs >= MAXE) st = 'lose';
    }
    setup();
    return {
      pausar: function () { kx = 0; ky = 0; },
      dbg: function () { var L = lay(), p = []; for (var i = 0; i < 5; i++) if (!found[i]) p.push({ x: L.b.x + DF[sel[i]][0] * L.s, y: L.b.y + DF[sel[i]][1] * L.s }); return { st: st, pts: p, errs: errs, tmr: tmr, found: found.filter(Boolean).length, rad: 34 * L.s, panel: L.a, pw: L.pw, ph: L.ph }; },
      down: function (x, y) { if (menu()) return; cx = x; cy = y; tapAt(x, y); },
      move: function (x, y) { if (st === 'play') { cx = x; cy = y; } },
      key: function (c, d) {
        if (c === 'ArrowLeft' || c === 'KeyA') kx = d ? -1 : (kx === -1 ? 0 : kx); else if (c === 'ArrowRight' || c === 'KeyD') kx = d ? 1 : (kx === 1 ? 0 : kx);
        else if (c === 'ArrowUp' || c === 'KeyW') ky = d ? -1 : (ky === -1 ? 0 : ky); else if (c === 'ArrowDown' || c === 'KeyS') ky = d ? 1 : (ky === 1 ? 0 : ky);
        else if ((c === 'Space' || c === 'Enter') && d) { if (st !== 'play') menu(); else tapAt(cx, cy); }
      },
      update: function (dt) { if (mk > 0) mk -= dt; if (st !== 'play') return; cx = Math.max(0, Math.min(api.w, cx + kx * 300 * dt)); cy = Math.max(0, Math.min(api.h, cy + ky * 300 * dt)); tmr -= dt; if (tmr <= 0) st = 'lose'; },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), i;
        bg('#241a12', '#0e0a07'); scene(L.a.x, L.a.y, L.s, false); scene(L.b.x, L.b.y, L.s, true);
        g.strokeStyle = '#ffd88a'; g.lineWidth = 3; g.strokeRect(L.a.x, L.a.y, L.pw, L.ph); g.strokeRect(L.b.x, L.b.y, L.pw, L.ph);
        g.strokeStyle = '#9dffb6'; g.lineWidth = 3; for (i = 0; i < 5; i++) if (found[i]) { var d = DF[sel[i]]; g.beginPath(); g.arc(L.a.x + d[0] * L.s, L.a.y + d[1] * L.s, 30 * L.s, 0, 6.29); g.stroke(); g.beginPath(); g.arc(L.b.x + d[0] * L.s, L.b.y + d[1] * L.s, 30 * L.s, 0, 6.29); g.stroke(); }
        if (st === 'play') { g.strokeStyle = mk > 0 ? '#ff8a7a' : 'rgba(255,255,255,.6)'; g.lineWidth = 2; g.beginPath(); g.arc(cx, cy, 14, 0, 6.29); g.moveTo(cx - 20, cy); g.lineTo(cx - 8, cy); g.moveTo(cx + 8, cy); g.lineTo(cx + 20, cy); g.moveTo(cx, cy - 20); g.lineTo(cx, cy - 8); g.moveTo(cx, cy + 8); g.lineTo(cx, cy + 20); g.stroke(); }
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 15 ? '#c0392b' : '#b09ad0');
        hud(T.h1 + ' ' + found.filter(Boolean).length + '/' + NEED, T.h2 + ' ' + errs + '/' + MAXE, errs > 0);
        fim(st);
      }
    };
  }
});
