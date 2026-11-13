/* A tigela de Sigyn — aparar o veneno que pinga sobre Loki. */
BTJogo.registrar({
  canvas: 'jogo-sigyn',
  t: {
    pt: {
      titulo: 'A tigela de Sigyn',
      sub: 'Loki está preso, e uma serpente pinga veneno sobre ele. Arraste a tigela (ou use as setas) para aparar as gotas. Quando encher, leve-a até a jarra, na borda da tela, para esvaziar. Cada gota que cair em Loki faz a terra tremer.',
      toque: 'Toque para começar', gotas: 'Tigela', tremores: 'Tremores', jarra: 'Jarra',
      perdeu: 'A terra tremeu demais', de_novo: 'Toque para tentar de novo',
      v1: 'Você aguentou até o fim!',
      v2: 'Na Edda em Prosa de Snorri, Sigyn segura uma tigela sobre Loki e, quando vai esvaziá-la, o veneno cai nele, que se debate e faz a terra tremer. O jogo é uma simplificação.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: 'Sigyn\'s bowl',
      sub: 'Loki is bound, and a serpent drips venom on him. Drag the bowl (or use the arrow keys) to catch the drops. When it fills, take it to the jar at the edge of the screen to empty it. Every drop that falls on Loki makes the earth shake.',
      toque: 'Tap to start', gotas: 'Bowl', tremores: 'Tremors', jarra: 'Jar',
      perdeu: 'The earth shook too much', de_novo: 'Tap to try again',
      v1: 'You held out to the end!',
      v2: 'In Snorri\'s Prose Edda, Sigyn holds a bowl over Loki and, when she goes to empty it, the venom falls on him, and he struggles and makes the earth shake. The game is a simplification.',
      jogar: 'Tap to play again'
    },
    no: {
      titulo: 'Sigyns skål',
      sub: 'Loke er bundet, og en slange drypper gift på ham. Dra skålen (eller bruk piltastene) for å fange dråpene. Når den er full, tar du den til krukken ved kanten av skjermen for å tømme den. Hver dråpe som faller på Loke, får jorden til å skjelve.',
      toque: 'Trykk for å starte', gotas: 'Skål', tremores: 'Skjelv', jarra: 'Krukke',
      perdeu: 'Jorden skalv for mye', de_novo: 'Trykk for å prøve igjen',
      v1: 'Du holdt ut til slutten!',
      v2: 'I Snorres Edda holder Sigyn en skål over Loke, og når hun går for å tømme den, faller giften på ham, og han vrir seg og får jorden til å skjelve. Spillet er en forenkling.',
      jogar: 'Trykk for å spille igjen'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt, META = 40, CAP = 5, MAXT = 4;
    var st = 'menu', time = 0, bx = 0, tgt = 0, fill = 0, tremor = 0, spawn = 0, drops = [], sway = 0, shake = 0, kL = false, kR = false, empt = 0;
    function cx() { return api.w / 2; }
    function by() { return api.h * 0.62; }
    function ly() { return api.h * 0.84; }
    function reset() { st = 'play'; time = 0; bx = cx(); tgt = cx(); fill = 0; tremor = 0; spawn = 1.2; drops = []; shake = 0; empt = 0; }
    function jar() { return Math.min(72, api.w * 0.12); }
    function hit() { tremor++; shake = 0.5; if (tremor >= MAXT) st = 'lose'; }
    return {
      pausar: function () {},
      dbg: function () { return { st: st, time: time, bx: bx, fill: fill, tremor: tremor, drops: drops, cx: cx(), by: by(), ly: ly() }; },
      down: function (x) { if (st === 'menu' || st === 'lose') reset(); else if (st === 'win') st = 'menu'; else tgt = x; },
      move: function (x, y, premido) { if (st === 'play' && premido) tgt = x; },
      key: function (c, d) {
        if (c === 'ArrowLeft' || c === 'KeyA') kL = d; else if (c === 'ArrowRight' || c === 'KeyD') kR = d;
        else if (d && (c === 'Space' || c === 'Enter')) { if (st === 'menu' || st === 'lose') reset(); else if (st === 'win') st = 'menu'; }
      },
      update: function (dt) {
        if (shake > 0) shake -= dt;
        if (st !== 'play') return;
        time += dt; if (time >= META) { st = 'win'; return; }
        if (kL) tgt -= 520 * dt; if (kR) tgt += 520 * dt; tgt = Math.max(30, Math.min(api.w - 30, tgt));
        var d = tgt - bx, m = 560 * dt; bx += Math.abs(d) < m ? d : (d > 0 ? m : -m);
        sway = Math.sin(time * 1.3) * 26;
        spawn -= dt;
        if (spawn <= 0) { spawn = 1.5 + Math.random() * 0.6; drops.push({ x: cx() + sway, y: api.h * 0.2, vy: 0 }); }
        if (empt > 0) empt -= dt;
        if (fill > 0 && (bx < jar() + 26 || bx > api.w - jar() - 26)) { fill = 0; empt = 0.35; }
        for (var i = drops.length - 1; i >= 0; i--) {
          var o = drops[i]; o.vy += 330 * dt; o.y += o.vy * dt;
          if (o.y >= by() - 8 && o.y <= by() + 16 && Math.abs(o.x - bx) < 38) {
            if (fill < CAP) { fill++; } else { hit(); }
            drops.splice(i, 1);
          } else if (o.y >= ly() - 10) { drops.splice(i, 1); hit(); }
        }
      },
      draw: function () {
        var W = api.w, H = api.h, i, sx = shake > 0 ? (Math.random() - 0.5) * 14 : 0, sy = shake > 0 ? (Math.random() - 0.5) * 10 : 0;
        g.save(); g.translate(sx, sy);
        var s = g.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#1b1424'); s.addColorStop(1, '#0a0710'); g.fillStyle = s; g.fillRect(-20, -20, W + 40, H + 40);
        g.fillStyle = '#2d2433'; g.fillRect(-20, H * 0.9, W + 40, H);
        g.fillStyle = '#3a2f42'; g.beginPath(); g.ellipse(cx(), ly() + 18, 130, 22, 0, 0, 6.29); g.fill();
        g.fillStyle = '#6a4f3a'; g.beginPath(); g.arc(cx(), ly() - 6, 22, 0, 6.29); g.fill();
        g.fillStyle = '#e9d7bd'; g.fillRect(cx() - 24, ly() - 4, 48, 16);
        g.fillStyle = '#e6554a'; g.fillRect(cx() - 26, ly() + 8, 52, 6);
        g.fillStyle = '#1a1520'; g.fillRect(cx() - 14, ly() - 12, 8, 4); g.fillRect(cx() + 6, ly() - 12, 8, 4);
        var sxs = cx() + sway;
        g.strokeStyle = '#3d7a3a'; g.lineWidth = 12; g.lineCap = 'round'; g.beginPath(); g.moveTo(cx() - 60, 0); g.quadraticCurveTo(cx() - 50, H * 0.1, sxs, H * 0.17); g.stroke();
        g.fillStyle = '#4c9a46'; g.beginPath(); g.ellipse(sxs, H * 0.19, 16, 12, 0, 0, 6.29); g.fill();
        g.fillStyle = '#ffd54a'; g.beginPath(); g.arc(sxs - 6, H * 0.185, 2.5, 0, 6.29); g.arc(sxs + 6, H * 0.185, 2.5, 0, 6.29); g.fill();
        g.fillStyle = '#9be36a'; drops.forEach(function (o) { g.beginPath(); g.moveTo(o.x, o.y - 12); g.quadraticCurveTo(o.x + 8, o.y + 2, o.x, o.y + 6); g.quadraticCurveTo(o.x - 8, o.y + 2, o.x, o.y - 12); g.fill(); });
        var jw = jar();
        [0, 1].forEach(function (k) { var jx = k ? W - jw / 2 - 6 : jw / 2 + 6; g.fillStyle = '#7a5a3a'; g.fillRect(jx - jw / 2 + 8, by() - 6, jw - 16, 64); g.fillStyle = '#5a4028'; g.fillRect(jx - jw / 2 + 4, by() - 12, jw - 8, 10); if (empt > 0 && (bx < W / 2) === !k) { g.fillStyle = '#9be36a'; g.fillRect(jx - 4, by() - 4, 8, 50); } });
        txt(T.jarra, jw / 2 + 6, by() + 82, 12, '#cdbfa6'); txt(T.jarra, W - jw / 2 - 6, by() + 82, 12, '#cdbfa6');
        g.fillStyle = '#8a6a44'; g.beginPath(); g.moveTo(bx - 36, by()); g.lineTo(bx + 36, by()); g.quadraticCurveTo(bx + 30, by() + 36, bx, by() + 36); g.quadraticCurveTo(bx - 30, by() + 36, bx - 36, by()); g.closePath(); g.fill();
        g.fillStyle = '#9be36a'; var hh = 28 * fill / CAP; g.fillRect(bx - 31, by() + 32 - hh, 62, hh);
        g.restore();
        if (st !== 'menu') {
          txt(T.gotas + ': ' + fill + '/' + CAP, 24, 34, 15, '#f3ecd2', 'left');
          txt(T.tremores + ': ' + tremor + '/' + MAXT, 24, 60, 15, '#ffb08a', 'left');
          var pw = Math.min(220, W - 48); g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(24, 74, pw, 7); g.fillStyle = '#c9b3f2'; g.fillRect(24, 74, pw * Math.min(1, time / META), 7);
        }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
