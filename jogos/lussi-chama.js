/* A chama de Lussi — proteja a vela do vento na noite mais longa. */
BTJogo.registrar({
  canvas: 'jogo-lussi',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A chama de Lussi",
    "sub": "Atravesse o pátio com a vela até a casa. Quando o vento avisar, segure o dedo (ou a barra de espaço) para proteger a chama com as mãos, e solte para andar de novo. As mãos cansam se ficarem fechadas por muito tempo. Se a chama apagar três vezes, o jogo termina.",
    "perdeu": "A chama se apagou",
    "v1": "A casa está iluminada!",
    "v2": "Na tradição popular da Noruega e da Suécia, a noite de 13 de dezembro era a mais longa e perigosa do ano. O vento e a travessia do jogo são invenção.",
    "h1": "Passos",
    "h2": "Apagou"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Lussi's flame",
    "sub": "Cross the yard with the candle to the house. When the wind warns, hold your finger (or the space bar) to shield the flame with your hands, and release to walk again. Your hands tire if kept closed too long. If the flame goes out three times, the game ends.",
    "perdeu": "The flame went out",
    "v1": "The house is lit!",
    "v2": "In Norwegian and Swedish folk tradition, the night of 13 December was the longest and most dangerous of the year. The wind and the crossing in the game are made up.",
    "h1": "Steps",
    "h2": "Blown out"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Lussis flamme",
    "sub": "Gå over gårdsplassen med lyset til huset. Når vinden varsler, hold fingeren (eller mellomromstasten) nede for å skjerme flammen med hendene, og slipp for å gå videre. Hendene blir slitne hvis de holdes lukket for lenge. Hvis flammen slukner tre ganger, er spillet over.",
    "perdeu": "Flammen slokket",
    "v1": "Huset er opplyst!",
    "v2": "I norsk og svensk folketro var natten til 13. desember årets lengste og farligste. Vinden og ferden i spillet er diktet opp.",
    "h1": "Skritt",
    "h2": "Slokket"
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
    var NEED = 40, MAXE = 3, SPD = 1 / 32;
    var p = 0, errs = 0, holding = false, hands = 1, gust = null, nextG = 2.2, relit = 0, fl = 0, sn = [];
    function reset() { st = 'play'; p = 0; errs = 0; holding = false; hands = 1; gust = null; nextG = 2.2; relit = 0; fl = 0; sn = []; for (var i = 0; i < 40; i++) sn.push([Math.random(), Math.random(), Math.random() * 6]); }
    return {
      pausar: function () { holding = false; },
      dbg: function () { return { st: st, p: p, errs: errs, holding: holding, hands: hands, gust: gust ? { w: gust.w, a: gust.a, t: gust.t } : null, relit: relit, steps: Math.floor(p * NEED) }; },
      down: function () { if (menu()) return; holding = true; },
      up: function () { holding = false; },
      key: function (c, d) { if (c !== 'Space' && c !== 'Enter') return; if (d) { if (st !== 'play') menu(); else holding = true; } else holding = false; },
      update: function (dt) {
        if (st !== 'play') return;
        fl = Math.max(0, fl - dt);
        var sh = holding && hands > 0.02 && relit <= 0;
        if (holding && relit <= 0) hands = Math.max(0, hands - dt / 1.6); else hands = Math.min(1, hands + dt / 3.5);
        if (hands <= 0.02) sh = false;
        if (relit > 0) relit -= dt;
        else if (!sh && !(gust && gust.a)) p = Math.min(1, p + SPD * dt);
        if (gust) { gust.t += dt; if (!gust.a && gust.t >= gust.w) { gust.a = true; gust.t = 0; } else if (gust.a) { if (!sh && relit <= 0) { errs++; relit = 1; fl = 0.5; gust = null; nextG = 1.4 + Math.random() * 1.6; if (errs >= MAXE) st = 'lose'; } else if (gust.t >= 0.9) { gust = null; nextG = 1.4 + Math.random() * 1.6; } } }
        else { nextG -= dt; if (nextG <= 0) gust = { t: 0, w: 0.8, a: false, hit: false }; }
        if (p >= 1) st = 'win';
      },
      draw: function () {
        var W = api.w, H = api.h, t = api.clock;
        bg('#0d1a3a', '#1b2a4a'); g.fillStyle = '#e8eef8'; sn.forEach(function (s) { g.globalAlpha = 0.6; g.fillRect(((s[0] * W + t * 20 * (1 + s[2] / 6)) % W), (s[1] * H * 0.9 + t * 14) % H, 2, 2); }); g.globalAlpha = 1;
        g.fillStyle = '#dfe8f5'; g.fillRect(0, H * 0.7, W, H * 0.3);
        var hxp = W * (0.92 - 0.62 * (1 - p) * 0 ) , gx = W * 0.2 + p * W * 0.52, gy = H * 0.7;
        g.fillStyle = '#5a3a2a'; g.fillRect(W * 0.78, H * 0.42, W * 0.18, H * 0.28); g.fillStyle = '#3a2418'; g.beginPath(); g.moveTo(W * 0.76, H * 0.42); g.lineTo(W * 0.87, H * 0.3); g.lineTo(W * 0.98, H * 0.42); g.fill(); g.fillStyle = p > 0.9 ? '#ffe08a' : 'rgba(255,224,138,.35)'; g.fillRect(W * 0.82, H * 0.5, 22, 22); g.fillRect(W * 0.9, H * 0.5, 22, 22);
        var on = relit <= 0, sh = holding && hands > 0.02 && on;
        if (on) { var rg = g.createRadialGradient(gx + 14, gy - 52, 4, gx + 14, gy - 52, sh ? 60 : 90); rg.addColorStop(0, 'rgba(255,214,120,.55)'); rg.addColorStop(1, 'rgba(255,214,120,0)'); g.fillStyle = rg; g.fillRect(gx - 90, gy - 150, 210, 200); }
        g.fillStyle = '#f2f2f2'; g.beginPath(); g.moveTo(gx - 12, gy); g.lineTo(gx + 12, gy); g.lineTo(gx + 6, gy - 52); g.lineTo(gx - 6, gy - 52); g.fill(); g.fillStyle = '#e8c9a0'; g.beginPath(); g.arc(gx, gy - 62, 9, 0, 6.29); g.fill();
        g.fillStyle = '#d9c9a0'; g.fillRect(gx + 10, gy - 52, 6, 14); if (on) { g.fillStyle = sh ? '#ffd88a' : '#ffb84a'; g.beginPath(); g.ellipse(gx + 13, gy - 60 + (gust && gust.a && !sh ? 0 : 0), 3.5, 7 + Math.sin(t * 20) * 1.2, 0, 0, 6.29); g.fill(); } else { g.strokeStyle = 'rgba(200,200,200,.5)'; g.beginPath(); g.moveTo(gx + 13, gy - 52); g.quadraticCurveTo(gx + 6, gy - 66, gx + 16, gy - 78); g.stroke(); }
        if (sh) { g.strokeStyle = '#e8c9a0'; g.lineWidth = 5; g.beginPath(); g.arc(gx + 13, gy - 58, 12, 0.3, 2.9); g.stroke(); }
        if (gust) { var a = gust.a; g.strokeStyle = a ? 'rgba(220,235,255,.8)' : 'rgba(255,200,120,.7)'; g.lineWidth = 2; for (var i = 0; i < 6; i++) { var yy = H * 0.3 + i * H * 0.08, xx = a ? ((t * 900 + i * 90) % (W + 200)) - 100 : W * 0.95 - i * 8; g.beginPath(); g.moveTo(xx, yy); g.lineTo(xx - (a ? 90 : 30), yy + 4); g.stroke(); } if (!a) txt('!', W - 40, H * 0.22, 40, '#ffb84a'); }
        g.fillStyle = 'rgba(255,255,255,.2)'; g.fillRect(22, 70, 120, 7); g.fillStyle = hands < 0.3 ? '#ff8a7a' : '#e8c9a0'; g.fillRect(22, 70, 120 * hands, 7);
        if (fl > 0) { g.fillStyle = 'rgba(255,60,40,' + fl * 0.4 + ')'; g.fillRect(0, 0, W, H); }
        hud(T.h1 + ' ' + Math.floor(p * NEED) + '/' + NEED, T.h2 + ' ' + errs + '/' + MAXE, errs > 0);
        fim(st);
      }
    };
  }
});
