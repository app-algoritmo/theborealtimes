/* Höðr e Loki — quem diz a verdade e quem mente (invenção). */
BTJogo.registrar({
  canvas: 'jogo-hodr',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Quem mente?",
    "sub": "Cada personagem faz uma declaração sobre os outros. Quem diz a verdade sempre fala verdades, e quem mente sempre fala mentiras. Toque numa linha para marcar a pessoa: ? (não sei), ✓ (diz a verdade) ou ✗ (mente). Quando todas estiverem marcadas, toque em Confirmar. Há uma única resposta certa por rodada. Três confirmações erradas encerram o jogo. São 5 rodadas.",
    "perdeu": "Três confirmações erradas",
    "v1": "Todas as mentiras desmascaradas!",
    "v2": "Na Edda em prosa, Loki guia a mão do deus cego Höðr, que atira o ramo de visco que mata Baldr. Saber quem mente e quem diz a verdade nesta mesa é invenção.",
    "h1": "Rodada",
    "h2": "Erros",
    "conf": "Confirmar",
    "s0": "{A} diz a verdade.",
    "s1": "{A} mente.",
    "s2": "{A} e {B} são do mesmo tipo.",
    "s3": "{A} e {B} são de tipos diferentes.",
    "s4": "Pelo menos um entre {A} e {B} mente.",
    "s5": "{A} e {B} dizem a verdade.",
    "marca0": "?",
    "falta": "Marque todos antes de confirmar"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Who is lying?",
    "sub": "Each character makes a statement about the others. A truth-teller always speaks truths, and a liar always speaks lies. Tap a row to mark the person: ? (unknown), ✓ (tells the truth) or ✗ (lies). When all are marked, tap Confirm. Each round has exactly one correct answer. Three wrong confirmations end the game. There are 5 rounds.",
    "perdeu": "Three wrong confirmations",
    "v1": "Every lie unmasked!",
    "v2": "In the Prose Edda, Loki guides the hand of the blind god Höðr, who shoots the mistletoe dart that kills Baldr. Working out who lies and who tells the truth at this table is invented.",
    "h1": "Round",
    "h2": "Mistakes",
    "conf": "Confirm",
    "s0": "{A} tells the truth.",
    "s1": "{A} lies.",
    "s2": "{A} and {B} are the same type.",
    "s3": "{A} and {B} are different types.",
    "s4": "At least one of {A} and {B} lies.",
    "s5": "{A} and {B} both tell the truth.",
    "marca0": "?",
    "falta": "Mark everyone before confirming"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Hvem lyver?",
    "sub": "Hver person kommer med en påstand om de andre. Den som snakker sant, sier alltid sannheten, og den som lyver, sier alltid løgn. Trykk på en rad for å markere personen: ? (vet ikke), ✓ (snakker sant) eller ✗ (lyver). Når alle er markert, trykk på Bekreft. Hver runde har nøyaktig ett riktig svar. Tre gale bekreftelser avslutter spillet. Det er 5 runder.",
    "perdeu": "Tre gale bekreftelser",
    "v1": "Alle løgnene avslørt!",
    "v2": "I Snorres Edda leder Loki hånden til den blinde guden Höðr, som skyter mistelteinpilen som dreper Baldr. Å finne ut hvem som lyver og hvem som snakker sant ved dette bordet er oppfunnet.",
    "h1": "Runde",
    "h2": "Feil",
    "conf": "Bekreft",
    "s0": "{A} snakker sant.",
    "s1": "{A} lyver.",
    "s2": "{A} og {B} er av samme type.",
    "s3": "{A} og {B} er av ulik type.",
    "s4": "Minst én av {A} og {B} lyver.",
    "s5": "{A} og {B} snakker begge sant.",
    "marca0": "?",
    "falta": "Marker alle før du bekrefter"
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
    var NM = ['Höðr', 'Loki', 'Váli', 'Frigg'], COL = ['#8aa6ff', '#ff9a6a', '#8fe0a0', '#e7b6ff'];
    var ROUNDS = 5, MAXE = 3, round = 0, err = 0, N = 3, stm = [], mark = [], sol = [], fl = 0, pend = 0, aviso = 0;
    function ev(s, a) { switch (s.k) { case 0: return a[s.a] === 1; case 1: return a[s.a] === 0; case 2: return a[s.a] === a[s.b]; case 3: return a[s.a] !== a[s.b]; case 4: return a[s.a] === 0 || a[s.b] === 0; default: return a[s.a] === 1 && a[s.b] === 1; } }
    function sols(S, n) { var out = [], m, i, a, ok; for (m = 0; m < (1 << n); m++) { a = []; ok = true; for (i = 0; i < n; i++) a.push((m >> i) & 1); for (i = 0; i < n && ok; i++) if (ev(S[i], a) !== (a[i] === 1)) ok = false; if (ok) out.push(a); } return out; }
    function gen() {
      N = round < 2 ? 3 : 4;
      for (var tries = 0; tries < 8000; tries++) {
        var S = [], i, j;
        for (i = 0; i < N; i++) { var o = []; for (j = 0; j < N; j++) if (j !== i) o.push(j); o.sort(function () { return Math.random() - 0.5; }); S.push({ k: (Math.random() * 6) | 0, a: o[0], b: o[1] }); }
        var r = sols(S, N), kinds = {}; S.forEach(function (s) { kinds[s.k] = 1; });
        if (r.length === 1 && Object.keys(kinds).length >= 2) { stm = S; sol = r[0]; mark = []; for (i = 0; i < N; i++) mark.push(-1); return; }
      }
      stm = [{ k: 1, a: 1, b: 2 }, { k: 0, a: 2, b: 0 }, { k: 1, a: 0, b: 1 }]; sol = sols(stm, 3)[0] || [0, 1, 1]; mark = [-1, -1, -1];
    }
    function reset() { round = 0; err = 0; pend = 0; fl = 0; gen(); st = 'play'; }
    function say(i) { var s = stm[i], t = T['s' + s.k]; return t.replace('{A}', NM[s.a]).replace('{B}', NM[s.b]); }
    function lay() { var W = api.w, H = api.h, rh = Math.min(74, (H - 190) / N); return { rh: rh, x0: 14, w: W - 28, y0: 74, by: 74 + rh * N + 16 }; }
    function rowC(i) { var L = lay(); return { x: L.x0 + L.w / 2, y: L.y0 + L.rh * i + L.rh / 2 }; }
    function confC() { var L = lay(); return { x: api.w / 2, y: L.by + 24 }; }
    function conf() {
      if (st !== 'play' || pend > 0) return; var i;
      for (i = 0; i < N; i++) if (mark[i] < 0) { aviso = 1.4; return; }
      for (i = 0; i < N; i++) if (mark[i] !== sol[i]) { err++; fl = 0.5; if (api.nota) api.nota(120, 0.2, 'sawtooth', 0.05); if (err >= MAXE) st = 'lose'; return; }
      round++; pend = 0.9; if (api.nota) api.nota(520, 0.2, 'triangle', 0.07);
    }
    function tapRow(i) { if (st !== 'play' || pend > 0) return; mark[i] = mark[i] < 0 ? 1 : mark[i] === 1 ? 0 : -1; if (api.nota) api.nota(300, 0.04, 'square', 0.03); }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { var p = [], i; for (i = 0; i < N; i++) p.push(rowC(i)); return { st: st, round: round, err: err, N: N, mark: mark.slice(), sol: sol.slice(), pos: p, conf: confC(), pend: pend }; },
      down: function (x, y) {
        if (menu()) return; if (pend > 0) return; var L = lay(), i;
        for (i = 0; i < N; i++) { var c = rowC(i); if (Math.abs(x - c.x) < L.w / 2 && Math.abs(y - c.y) < L.rh / 2) { tapRow(i); return; } }
        var k = confC(); if (Math.abs(x - k.x) < 90 && Math.abs(y - k.y) < 26) conf();
      },
      move: function () {}, up: function () {},
      key: function (kk, d) {
        if (!d) return; if (st !== 'play') { menu(); return; }
        if (kk === 'Enter' || kk === 'Space') conf(); else { var n = parseInt(String(kk).replace('Digit', ''), 10); if (n >= 1 && n <= N) tapRow(n - 1); }
      },
      update: function (dt) {
        if (fl > 0) fl -= dt; if (aviso > 0) aviso -= dt;
        if (pend > 0) { pend -= dt; if (pend <= 0) { if (round >= ROUNDS) st = 'win'; else gen(); } }
      },
      draw: function () {
        var L = lay(), i; bg('#171a2e', '#07080f');
        for (i = 0; i < N; i++) {
          var c = rowC(i), x = L.x0, y = c.y - L.rh / 2 + 3, s = stm[i];
          g.fillStyle = 'rgba(255,255,255,.07)'; rr(x, y, L.w, L.rh - 6, 10); g.fill();
          g.fillStyle = COL[i]; g.beginPath(); g.arc(x + 28, c.y, 18, 0, 6.2832); g.fill(); txt(NM[i].charAt(0), x + 28, c.y + 1, 18, '#10131f');
          txt(NM[i], x + 58, c.y - 12, 15, '#f3ecd2', 'left'); txt('“' + say(i) + '”', x + 58, c.y + 10, 13, '#cfd6ee', 'left');
          var m = mark[i], bc = m < 0 ? 'rgba(255,255,255,.35)' : m === 1 ? '#8fe0a0' : '#ff9a8d';
          g.strokeStyle = bc; g.lineWidth = 2; g.beginPath(); g.arc(x + L.w - 30, c.y, 18, 0, 6.2832); g.stroke();
          txt(m < 0 ? '?' : m === 1 ? '✓' : '✗', x + L.w - 30, c.y + 1, 20, bc);
        }
        var k = confC(), okc = fl > 0 ? '#ff9a8d' : '#ffd88a';
        g.fillStyle = 'rgba(0,0,0,.35)'; rr(k.x - 90, k.y - 22, 180, 44, 12); g.fill(); g.strokeStyle = okc; g.lineWidth = 2; rr(k.x - 90, k.y - 22, 180, 44, 12); g.stroke(); txt(T.conf, k.x, k.y + 1, 18, okc);
        if (aviso > 0) txt(T.falta, api.w / 2, k.y + 44, 13, '#ffb08a');
        hud(T.h1 + ' ' + Math.min(round + 1, ROUNDS) + '/' + ROUNDS, T.h2 + ' ' + err + '/' + MAXE, true);
        fim(st);
      }
    };

  }
});
