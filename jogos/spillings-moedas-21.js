/* Spillings, tesouro de prata de Gotland — some moedas até chegar o mais perto possível de 21, sem passar (invenção). */
BTJogo.registrar({
  canvas: 'jogo-spillings',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As moedas de Spillings",
    "sub": "Em cada rodada aparecem sete moedas com valores. Toque nas moedas para somá-las, tentando chegar o mais perto possível de 21, sem passar. Quando achar a melhor soma possível, toque em Parar. Passar de 21 ou parar numa soma que podia ser maior conta como erro. Faça 6 rodadas com no máximo 2 erros e em até 100 segundos. (Teclado: setas movem o cursor, Espaço escolhe, Enter para.)",
    "perdeu": "Erros ou tempo demais",
    "v1": "O tesouro está contado!",
    "v2": "Em 1999, arqueólogos acharam em Gotland mais de 14 mil moedas e quase 500 braceletes de prata. O jogo de somar até 21 é invenção.",
    "h1": "Rodadas",
    "h2": "Erros",
    "b1": "Parar",
    "s": "Soma"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Spillings' coins",
    "sub": "Each round shows seven coins with values. Tap coins to add them up, trying to get as close as possible to 21 without going over. When you find the best possible sum, tap Stop. Going over 21 or stopping on a sum that could have been higher counts as a mistake. Play 6 rounds with at most 2 mistakes and within 100 seconds. (Keyboard: arrows move the cursor, Space picks, Enter stops.)",
    "perdeu": "Mistakes or too much time",
    "v1": "The hoard is counted!",
    "v2": "In 1999, archaeologists found in Gotland more than 14,000 coins and almost 500 silver arm-rings. The game of adding up to 21 is invented.",
    "h1": "Rounds",
    "h2": "Mistakes",
    "b1": "Stop",
    "s": "Sum"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Spillings-myntene",
    "sub": "Hver runde viser sju mynter med verdier. Trykk på myntene for å legge dem sammen, og prøv å komme så nær 21 som mulig uten å gå over. Når du har funnet den beste mulige summen, trykk på Stopp. Å gå over 21 eller stoppe på en sum som kunne vært høyere, teller som en feil. Spill 6 runder med høyst 2 feil og innen 100 sekunder. (Tastatur: piler flytter markøren, mellomrom velger, Enter stopper.)",
    "perdeu": "Feil eller for lang tid",
    "v1": "Skatten er telt!",
    "v2": "I 1999 fant arkeologer på Gotland mer enn 14 000 mynter og nesten 500 sølvarmringer. Spillet med å legge sammen til 21 er oppfunnet.",
    "h1": "Runder",
    "h2": "Feil",
    "b1": "Stopp",
    "s": "Sum"
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
    var RN = 6, MAXE = 2, LIM = 100;
    var coins = [], sel = [], best = 0, round = 1, err = 0, t = 0, kc = 0, flash = 0, fcol = '';
    function bestSum(a) { var b = 0, n = a.length; for (var m = 0; m < (1 << n); m++) { var s = 0; for (var i = 0; i < n; i++) if (m & (1 << i)) s += a[i]; if (s <= 21 && s > b) b = s; } return b; }
    function deal() { do { coins = []; for (var i = 0; i < 7; i++) coins.push(2 + Math.floor(Math.random() * 8)); best = bestSum(coins); } while (best < 20); sel = [0, 0, 0, 0, 0, 0, 0]; kc = 0; }
    function sum() { var s = 0; for (var i = 0; i < 7; i++) if (sel[i]) s += coins[i]; return s; }
    function reset() { round = 1; err = 0; t = 0; flash = 0; deal(); st = 'play'; }
    function stop() {
      if (st !== 'play') return; var s = sum(); if (s === 0) return;
      if (s === best) { flash = 0.5; fcol = '#6fd3a0'; if (api.nota) api.nota(660, 0.2, 'sine', 0.06); round++; if (round > RN) { st = 'win'; return; } deal(); }
      else { err++; flash = 0.5; fcol = '#ff6a58'; if (api.nota) api.nota(120, 0.25, 'sawtooth', 0.06); if (err > MAXE) { st = 'lose'; return; } deal(); }
    }
    function toggle(i) { if (st !== 'play' || i < 0 || i > 6) return; sel[i] = sel[i] ? 0 : 1; if (api.nota) api.nota(400 + coins[i] * 30, 0.06, 'triangle', 0.04); }
    function lay() { var W = api.w, H = api.h, s = Math.max(0.8, Math.min(1.4, Math.min(W, H) / 450)), r = Math.min(34 * s, (W - 40) / 8 / 1.2), cols = W > 600 ? 7 : 4, bw = Math.min(190 * s, W - 60); return { W: W, H: H, s: s, r: r, cols: cols, bw: bw, bh: 52 * s, by: H - 52 * s - 26 * s }; }
    function cpos(i) { var L = lay(), cols = L.cols, row = Math.floor(i / cols), n = Math.min(cols, 7 - row * cols), col = i - row * cols, gap = L.r * 2.5; return { x: L.W / 2 + (col - (n - 1) / 2) * gap, y: Math.max(140, L.H * 0.3) + row * gap }; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, coins: coins.slice(), sel: sel.slice(), sum: sum(), best: best, round: round, err: err, t: t, pos: cpos, stop: { x: L.W / 2, y: L.by + L.bh / 2 } }; },
      down: function (x, y) { if (menu()) return; var L = lay(); if (x >= L.W / 2 - L.bw / 2 && x <= L.W / 2 + L.bw / 2 && y >= L.by && y <= L.by + L.bh) { stop(); return; } for (var i = 0; i < 7; i++) { var p = cpos(i); if (Math.hypot(x - p.x, y - p.y) <= L.r * 1.15) { toggle(i); return; } } },
      move: function () {}, up: function () {},
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'ArrowLeft' || k === 'KeyA') kc = (kc + 6) % 7; else if (k === 'ArrowRight' || k === 'KeyD') kc = (kc + 1) % 7; else if (k === 'ArrowUp' || k === 'KeyW') kc = (kc + 3) % 7; else if (k === 'ArrowDown' || k === 'KeyS') kc = (kc + 4) % 7; else if (k === 'Space') toggle(kc); else if (k === 'Enter') stop(); },
      update: function (dt) { if (flash > 0) flash -= dt; if (st !== 'play') return; t += dt; if (t >= LIM) st = 'lose'; },
      draw: function () {
        var L = lay(), W = L.W, H = L.H, s = L.s, i;
        bg('#2a2236', '#0d0a14'); if (flash > 0) { g.fillStyle = fcol; g.globalAlpha = flash * 0.3; g.fillRect(0, 0, W, H); g.globalAlpha = 1; }
        for (i = 0; i < 7; i++) { var p = cpos(i); g.fillStyle = sel[i] ? '#ffd88a' : '#b9bcc8'; g.beginPath(); g.arc(p.x, p.y - (sel[i] ? 8 : 0), L.r, 0, 6.283); g.fill(); g.strokeStyle = sel[i] ? '#a67c2a' : '#7a7d88'; g.lineWidth = 3; g.stroke(); txt(String(coins[i]), p.x, p.y + L.r * 0.34 - (sel[i] ? 8 : 0), L.r * 0.95, '#2a2438'); if (i === kc && st === 'play') { g.strokeStyle = 'rgba(255,216,138,.8)'; g.lineWidth = 2; g.beginPath(); g.arc(p.x, p.y, L.r + 6, 0, 6.283); g.stroke(); } }
        var sm = sum(); txt(T.s + ': ' + sm + ' / 21', W / 2, H * 0.27 - 28 * s, 30 * s, sm > 21 ? '#ff8a7a' : '#f3ecd2');
        g.fillStyle = sm > 0 ? '#3a6f9a' : '#4a4a5a'; rr(W / 2 - L.bw / 2, L.by, L.bw, L.bh, 12 * s); g.fill(); txt(T.b1, W / 2, L.by + L.bh / 2 + 7 * s, 22 * s, '#fff');
        bar(W / 2 - 110, H - 14, 220, 5, (LIM - t) / LIM, LIM - t < 15 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + Math.min(round, RN) + '/' + RN, T.h2 + ' ' + err + '/' + (MAXE + 1), err >= MAXE);
        fim(st);
      }
    };
  }
});
