/* A carta trocada — siga com os olhos a carta que Amleth falsificou. */
BTJogo.registrar({
  canvas: 'jogo-amleth',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A carta trocada",
    "sub": "Amleth trocou a carta que o mandava à morte. Veja qual carta tem o selo, siga-a enquanto as três trocam de lugar e toque nela (ou use as teclas 1, 2 e 3). Acerte seis vezes; no terceiro erro o jogo acaba.",
    "perdeu": "Você perdeu a carta de vista",
    "v1": "A carta certa!",
    "v2": "Em Saxo, Amleth troca a mensagem que o levava à morte, e os portadores é que morrem. A troca de cartas é invenção do jogo.",
    "h1": "Cartas",
    "h2": "Erros",
    "ver": "Memorize a carta com o selo",
    "onde": "Onde está a carta?"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The swapped letter",
    "sub": "Amleth swapped the letter that sent him to his death. See which letter has the seal, follow it while the three change places and tap it (or use keys 1, 2 and 3). Get six right; the third mistake ends the game.",
    "perdeu": "You lost sight of the letter",
    "v1": "The right letter!",
    "v2": "In Saxo, Amleth changes the message that would have killed him, and the bearers die instead. The letter swapping is made up for the game.",
    "h1": "Letters",
    "h2": "Mistakes",
    "ver": "Remember the letter with the seal",
    "onde": "Where is the letter?"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Det byttede brevet",
    "sub": "Amleth byttet ut brevet som sendte ham i døden. Se hvilket brev som har seglet, følg det mens de tre bytter plass og trykk på det (eller bruk tastene 1, 2 og 3). Få seks riktige; ved tredje feil er spillet over.",
    "perdeu": "Du mistet brevet av syne",
    "v1": "Rett brev!",
    "v2": "Hos Saxo bytter Amleth ut meldingen som skulle drepe ham, og det er brevbærerne som dør. Brevbyttet er diktet opp for spillet.",
    "h1": "Brev",
    "h2": "Feil",
    "ver": "Husk brevet med seglet",
    "onde": "Hvor er brevet?"
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
    var NEED = 6, MAXE = 3;
    var hits = 0, errs = 0, rd = 0, ph = 'show', pt = 0, slotOf = [0, 1, 2], sws = [], si = 0, st2 = 0, dur = 0.4, cur = 1, ptm = 0, lastOk = true, sh = [{}, {}, {}];
    function xs() { var W = api.w, g2 = Math.min(150, (W - 60) / 3); return [W / 2 - g2, W / 2, W / 2 + g2]; }
    function ly() { return api.h * 0.5; }
    function newRound() {
      var p = [0, 1, 2], k, j, t; for (k = 2; k > 0; k--) { j = Math.floor(Math.random() * (k + 1)); t = p[k]; p[k] = p[j]; p[j] = t; } slotOf = p;
      var n = 4 + 2 * Math.min(5, hits + Math.floor(errs / 2)); sws = []; var last = -1; for (k = 0; k < n; k++) { var a = Math.floor(Math.random() * 3), b = (a + 1 + Math.floor(Math.random() * 2)) % 3; while (a + '' + b === last) { a = Math.floor(Math.random() * 3); b = (a + 1 + Math.floor(Math.random() * 2)) % 3; } sws.push([a, b]); last = a + '' + b; }
      dur = Math.max(0.2, 0.48 - 0.04 * Math.min(6, hits)); si = 0; ph = 'show'; pt = 0; ptm = 0; st2 = 0;
    }
    function setup() { hits = 0; errs = 0; rd = 0; cur = 1; newRound(); }
    function reset() { setup(); st = 'play'; }
    function choose(i) {
      if (st !== 'play' || ph !== 'pick') return; lastOk = (i === slotOf[0]); if (lastOk) hits++; else errs++; ph = 'res'; pt = 0;
    }
    setup();
    return {
      pausar: function () {},
      dbg: function () { return { st: st, ph: ph, target: slotOf[0], hits: hits, errs: errs, xs: xs() }; },
      down: function (x, y) {
        if (menu()) return; if (ph !== 'pick') return; var X = xs(), i, bw = Math.min(80, (X[1] - X[0]) / 2);
        for (i = 0; i < 3; i++) if (Math.abs(x - X[i]) < bw && Math.abs(y - ly()) < 100) { choose(i); return; }
      },
      key: function (c, d) {
        if (!d) return;
        if (c === 'Digit1' || c === 'Numpad1') choose(0); else if (c === 'Digit2' || c === 'Numpad2') choose(1); else if (c === 'Digit3' || c === 'Numpad3') choose(2);
        else if (c === 'ArrowLeft' || c === 'KeyA') cur = Math.max(0, cur - 1); else if (c === 'ArrowRight' || c === 'KeyD') cur = Math.min(2, cur + 1);
        else if (c === 'Space' || c === 'Enter') { if (st !== 'play') menu(); else choose(cur); }
      },
      update: function (dt) {
        if (st !== 'play') return; pt += dt;
        if (ph === 'show') { if (pt > 1.6) { ph = 'flip'; pt = 0; } }
        else if (ph === 'flip') { if (pt > 0.5) { ph = 'shuf'; pt = 0; st2 = 0; } }
        else if (ph === 'shuf') {
          st2 += dt; if (st2 >= dur) { var s = sws[si], q = slotOf.slice(); for (var i = 0; i < 3; i++) { if (slotOf[i] === s[0]) q[i] = s[1]; else if (slotOf[i] === s[1]) q[i] = s[0]; } slotOf = q; si++; st2 = 0; if (si >= sws.length) { ph = 'pick'; pt = 0; } }
        }
        else if (ph === 'pick') { if (pt > 9) { errs++; lastOk = false; ph = 'res'; pt = 0; } }
        else if (ph === 'res') { if (pt > 1.1) { if (hits >= NEED) st = 'win'; else if (errs >= MAXE) st = 'lose'; else newRound(); } }
      },
      draw: function () {
        var W = api.w, H = api.h, X = xs(), Y = ly(), i, k;
        bg('#2a1f14', '#120c07'); g.fillStyle = '#4a3320'; g.fillRect(0, Y + 70, W, H - Y - 70); g.fillStyle = 'rgba(255,200,120,.08)'; g.beginPath(); g.arc(W / 2, Y, Math.min(W, H) * 0.5, 0, 6.29); g.fill();
        /* posicoes das cartas: por slot, com troca animada */
        var pos = [0, 0, 0], yo = [0, 0, 0];
        for (i = 0; i < 3; i++) { pos[slotOf[i]] = X[i]; }
        /* slotOf[id] = slot atual do id */
        for (k = 0; k < 3; k++) pos[k] = X[slotOf[k]];
        if (ph === 'shuf' && sws[si]) { var s = sws[si], e = Math.min(1, st2 / dur), ea = e * e * (3 - 2 * e), a = s[0], b = s[1], ia = slotOf.indexOf(a), ib = slotOf.indexOf(b);
          if (ia >= 0) { pos[ia] = X[a] + (X[b] - X[a]) * ea; yo[ia] = -Math.sin(Math.PI * ea) * 46; } if (ib >= 0) { pos[ib] = X[b] + (X[a] - X[b]) * ea; yo[ib] = Math.sin(Math.PI * ea) * 46; } }
        for (k = 0; k < 3; k++) {
          var cx = pos[k], cy = Y + yo[k], up = (ph === 'show' || ph === 'res') || (ph === 'flip' && pt < 0.25), isT = (k === 0), w = 84, h = 116;
          if (ph === 'pick' && st === 'play' && slotOf[k] === cur) { g.fillStyle = 'rgba(255,255,255,.15)'; rr(cx - w / 2 - 8, cy - h / 2 - 8, w + 16, h + 16, 10); g.fill(); }
          g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(cx - w / 2 + 5, cy - h / 2 + 8, w, h);
          g.fillStyle = up ? '#efe1b8' : '#8a6a42'; rr(cx - w / 2, cy - h / 2, w, h, 6); g.fill(); g.strokeStyle = '#4a321c'; g.lineWidth = 2; g.stroke();
          if (up) { g.strokeStyle = '#7a6a48'; g.lineWidth = 1.5; for (var q = 0; q < 5; q++) { g.beginPath(); g.moveTo(cx - w / 2 + 12, cy - h / 2 + 18 + q * 12); g.lineTo(cx + w / 2 - 12, cy - h / 2 + 18 + q * 12); g.stroke(); }
            if (isT) { g.fillStyle = '#b3261e'; g.beginPath(); g.arc(cx, cy + h / 2 - 22, 13, 0, 6.29); g.fill(); g.fillStyle = '#ffd88a'; g.fillRect(cx - 2, cy + h / 2 - 30, 4, 16); g.fillRect(cx - 8, cy + h / 2 - 24, 16, 4); } }
          else { g.strokeStyle = '#4a321c'; g.lineWidth = 2; g.beginPath(); g.moveTo(cx - w / 2 + 8, cy - h / 2 + 8); g.lineTo(cx + w / 2 - 8, cy + h / 2 - 8); g.moveTo(cx + w / 2 - 8, cy - h / 2 + 8); g.lineTo(cx - w / 2 + 8, cy + h / 2 - 8); g.stroke(); }
          if (ph === 'res' && isT) { g.strokeStyle = lastOk ? '#9dffb6' : '#ff8a7a'; g.lineWidth = 4; rr(cx - w / 2 - 6, cy - h / 2 - 6, w + 12, h + 12, 10); g.stroke(); }
        }
        var msg = ph === 'show' ? T.ver : ph === 'pick' ? T.onde : ''; if (msg) txt(msg, W / 2, Y - 98, 18, '#f3ecd2');
        if (ph === 'pick') bar(W / 2 - 80, Y + 100, 160, 5, 1 - pt / 9, '#ffb04a');
        hud(T.h1 + ' ' + hits + '/' + NEED, T.h2 + ' ' + errs + '/' + MAXE, errs > 0);
        fim(st);
      }
    };
  }
});
