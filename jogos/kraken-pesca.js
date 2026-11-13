/* Pesca sobre o Kraken — até onde vale arriscar? */
BTJogo.registrar({
  canvas: 'jogo-kraken',
  t: {
    pt: {
      titulo: 'Pesca sobre o Kraken',
      sub: 'Há peixe demais num ponto do mar, e ele fica sobre um kraken. Segure o dedo (ou a barra de espaço) para pescar; solte para guardar a pesca. Se o monstro subir, você perde o que pegou nesta rodada. Junte 90 peixes em 5 rodadas.',
      toque: 'Toque para começar', rodada: 'Rodada', guardado: 'Guardado', no_barco: 'No barco', agua: 'A água borbulha...',
      perdeu: 'Faltou peixe', de_novo: 'Toque para tentar de novo',
      v1: 'Barco cheio!',
      v2: 'Pontoppidan, bispo de Bergen, descreveu em 1752 o kraken como um monstro enorme que a pesca farta denunciaria: onde os peixes se juntam demais, ele estaria embaixo. O jogo é invenção.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: 'Fishing over the Kraken',
      sub: 'There is far too much fish at one spot at sea, and it sits over a kraken. Hold your finger (or the space bar) to fish; release to keep your catch. If the monster rises, you lose what you caught this round. Gather 90 fish in 5 rounds.',
      toque: 'Tap to start', rodada: 'Round', guardado: 'Kept', no_barco: 'In the boat', agua: 'The water is bubbling...',
      perdeu: 'Not enough fish', de_novo: 'Tap to try again',
      v1: 'Boat full!',
      v2: 'Pontoppidan, bishop of Bergen, described the kraken in 1752 as an enormous monster that unusually rich fishing would give away: where fish gather too thickly, it would be beneath. The game is made up.',
      jogar: 'Tap to play again'
    },
    no: {
      titulo: 'Fiske over krakenen',
      sub: 'Det er altfor mye fisk på ett sted på havet, og det ligger over en kraken. Hold fingeren (eller mellomromstasten) inne for å fiske; slipp for å beholde fangsten. Hvis udyret stiger opp, mister du det du fikk denne runden. Samle 90 fisk på 5 runder.',
      toque: 'Trykk for å starte', rodada: 'Runde', guardado: 'Beholdt', no_barco: 'I båten', agua: 'Vannet bobler...',
      perdeu: 'For lite fisk', de_novo: 'Trykk for å prøve igjen',
      v1: 'Båten er full!',
      v2: 'Pontoppidan, biskop av Bergen, beskrev i 1752 krakenen som et veldig udyr som uvanlig rikt fiske kunne røpe: der fisken samler seg for tett, skulle den ligge under. Spillet er diktet opp.',
      jogar: 'Trykk for å spille igjen'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt, ROUNDS = 5, GOAL = 90, RATE = 10;
    var st = 'menu', rnd = 1, bank = 0, held = 0, hold = false, thr = 3, phase = 'idle', pt = 0, rise = 0, fish = [], bub = [];
    function newThr() { thr = 1.3 + Math.random() * 3.7; held = 0; }
    function reset() { st = 'play'; rnd = 1; bank = 0; phase = 'idle'; hold = false; newThr(); pt = 0; rise = 0; }
    function endRound() { if (rnd >= ROUNDS) { st = bank >= GOAL ? 'win' : 'lose'; } else { rnd++; newThr(); phase = 'idle'; } }
    function press(d) {
      if (st === 'menu' || st === 'lose') { if (d) reset(); return; } if (st === 'win') { if (d) st = 'menu'; return; }
      if (phase === 'monster') return;
      if (d && phase === 'idle') { phase = 'fishing'; hold = true; }
      else if (!d && phase === 'fishing') { hold = false; bank += Math.floor(held * RATE); pt = 0.7; phase = 'bank'; }
    }
    return {
      pausar: function () { if (phase === 'fishing') press(false); },
      dbg: function () { return { st: st, rnd: rnd, bank: bank, held: held, thr: thr, phase: phase }; },
      down: function () { press(true); }, up: function () { press(false); },
      key: function (c, d) { if (c === 'Space' || c === 'Enter' || c === 'ArrowDown') press(d); },
      update: function (dt) {
        if (st !== 'play') return;
        if (phase === 'fishing') {
          held += dt;
          if (Math.random() < dt * 14) bub.push({ x: Math.random(), y: 1, v: 0.4 + Math.random() * 0.6 });
          if (held >= thr) { phase = 'monster'; hold = false; held = 0; pt = 1.6; rise = 0; }
        } else if (phase === 'monster') { rise += dt; pt -= dt; if (pt <= 0) { phase = 'idle'; endRound(); if (st === 'play') phase = 'idle'; } }
        else if (phase === 'bank') { pt -= dt; if (pt <= 0) endRound(); if (st === 'play' && pt <= 0) phase = 'idle'; }
        bub.forEach(function (b) { b.y -= dt * b.v; }); bub = bub.filter(function (b) { return b.y > 0; });
      },
      draw: function () {
        var W = api.w, H = api.h, i, sea = H * 0.42, sh = phase === 'fishing' && held > thr * 0.55 ? (held / thr - 0.55) * 6 : 0;
        var s = g.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#a8c4d8'); s.addColorStop(0.4, '#cfe0ea'); s.addColorStop(0.42, '#1f5a7a'); s.addColorStop(1, '#06182a'); g.fillStyle = s; g.fillRect(0, 0, W, H);
        g.fillStyle = 'rgba(255,255,255,.14)'; for (i = 0; i < 5; i++) g.fillRect((i * 173 + api.clock * 12) % W, sea + 8 + i * 6, 46, 3);
        var kx = W / 2, mk = phase === 'monster' ? Math.min(1, rise / 0.9) : (phase === 'fishing' ? Math.max(0, (held / thr - 0.55)) * 0.3 : 0);
        if (mk > 0) { g.fillStyle = 'rgba(40,60,50,' + (phase === 'monster' ? 1 : 0.45) + ')'; g.beginPath(); g.ellipse(kx, sea + 60 - mk * 110, 90 + mk * 50, 50 + mk * 40, 0, 0, 6.29); g.fill(); if (phase === 'monster') { for (i = -2; i <= 2; i++) { g.strokeStyle = '#2f4a3a'; g.lineWidth = 12; g.beginPath(); g.moveTo(kx + i * 36, sea - 20); g.quadraticCurveTo(kx + i * 70, sea - 120 - mk * 30, kx + i * 90 + Math.sin(api.clock * 5 + i) * 14, sea - 160 * mk); g.stroke(); } g.fillStyle = '#ffd54a'; g.beginPath(); g.arc(kx - 30, sea - 10, 8, 0, 6.29); g.arc(kx + 30, sea - 10, 8, 0, 6.29); g.fill(); } }
        fish.length = 0; if (phase === 'fishing') for (i = 0; i < Math.min(20, Math.floor(held * RATE)); i++) { var fx = W * (0.15 + ((i * 53) % 70) / 100), fy = sea + 40 + ((i * 37) % 120); g.fillStyle = '#f2b84a'; g.beginPath(); g.ellipse(fx, fy, 9, 4, 0, 0, 6.29); g.fill(); g.beginPath(); g.moveTo(fx + 8, fy); g.lineTo(fx + 15, fy - 4); g.lineTo(fx + 15, fy + 4); g.fill(); }
        g.fillStyle = 'rgba(255,255,255,.5)'; bub.forEach(function (b) { g.beginPath(); g.arc(W * (0.3 + b.x * 0.4), sea + 40 + b.y * (H - sea - 60), 3 + b.x * 3, 0, 6.29); g.fill(); });
        var bx = W / 2 + (Math.random() - 0.5) * sh, by = sea - 4 + Math.sin(api.clock * 2) * 3 + (Math.random() - 0.5) * sh;
        g.fillStyle = '#6b3e1f'; g.beginPath(); g.moveTo(bx - 60, by - 16); g.lineTo(bx + 60, by - 16); g.lineTo(bx + 40, by + 12); g.lineTo(bx - 40, by + 12); g.closePath(); g.fill();
        g.fillStyle = '#d8b48a'; g.beginPath(); g.arc(bx, by - 36, 8, 0, 6.29); g.fill(); g.fillStyle = '#2f5a8a'; g.fillRect(bx - 8, by - 28, 16, 14);
        if (phase === 'fishing') { g.strokeStyle = '#eee'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(bx + 8, by - 30); g.lineTo(bx + 40, by - 60); g.lineTo(bx + 40, sea + 60 + held * 30); g.stroke(); }
        if (st !== 'menu') {
          txt(T.rodada + ' ' + rnd + '/' + ROUNDS, 24, 34, 15, '#10222c', 'left');
          txt(T.guardado + ': ' + bank + '/' + GOAL, 24, 58, 15, '#10222c', 'left');
          if (phase === 'fishing') { txt(T.no_barco + ': ' + Math.floor(held * RATE), W / 2, H * 0.86, 22, '#ffe9a8'); if (held > thr * 0.5) txt(T.agua, W / 2, H * 0.93, 15, '#bfe6ff'); }
        }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
