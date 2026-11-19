/* Holger Danske — qual forma sumiu (invenção). */
BTJogo.registrar({
  canvas: 'jogo-holger',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A forma que sumiu",
    "sub": "Algumas formas coloridas aparecem por alguns segundos. Memorize quais são e onde estão. Depois uma delas desaparece, e você escolhe, entre quatro opções, a forma que sumiu. Acertar seis rodadas vence o jogo. Três erros encerram a partida.",
    "perdeu": "Três erros",
    "v1": "Memória de guerreiro!",
    "v2": "Holger Danske, ou Ogier, o Dinamarquês, aparece já na Chanson de Roland, por volta de 1060. Segundo a lenda dinamarquesa, ele dorme sob o castelo de Kronborg e desperta quando a Dinamarca está em perigo. Lembrar formas é invenção.",
    "h1": "Rodada",
    "h2": "Erros",
    "memo": "Memorize as formas",
    "pergunta": "Qual forma sumiu?"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The shape that vanished",
    "sub": "Some coloured shapes appear for a few seconds. Memorise which ones they are and where they are. Then one of them disappears, and you pick, from four options, the shape that vanished. Getting six rounds right wins the game. Three mistakes end the game.",
    "perdeu": "Three mistakes",
    "v1": "A warrior’s memory!",
    "v2": "Holger Danske, or Ogier the Dane, already appears in the Chanson de Roland, around 1060. According to Danish legend, he sleeps beneath Kronborg Castle and wakes when Denmark is in danger. Remembering shapes is invented.",
    "h1": "Round",
    "h2": "Mistakes",
    "memo": "Memorise the shapes",
    "pergunta": "Which shape vanished?"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Figuren som forsvant",
    "sub": "Noen fargede figurer dukker opp i noen sekunder. Husk hvilke de er og hvor de står. Så forsvinner én av dem, og du velger blant fire alternativer figuren som forsvant. Seks riktige runder vinner spillet. Tre feil avslutter spillet.",
    "perdeu": "Tre feil",
    "v1": "Krigerens hukommelse!",
    "v2": "Holger Danske, eller Ogier danskeren, dukker allerede opp i Rolandskvadet, rundt 1060. Ifølge dansk sagn sover han under Kronborg slott og våkner når Danmark er i fare. Å huske figurer er oppfunnet.",
    "h1": "Runde",
    "h2": "Feil",
    "memo": "Husk figurene",
    "pergunta": "Hvilken figur forsvant?"
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
    var NR = 6, MAXE = 3, CNT = [6, 6, 7, 7, 8, 8], COLS = ['#e07a6a', '#6aa8e0', '#7cc47a', '#e0c25a'];
    var round = 0, err = 0, items = [], slot = [], miss = 0, ph = 'show', tm = 0, tm0 = 1, opts = [], ans = 0, fb = 0, fbOk = true;
    function shuf(a) { return a.sort(function () { return Math.random() - 0.5; }); }
    function shape(k, c, x, y, r) {
      g.fillStyle = COLS[c]; g.strokeStyle = 'rgba(0,0,0,.55)'; g.lineWidth = 2; g.beginPath();
      if (k === 0) g.arc(x, y, r, 0, 6.2832);
      else if (k === 1) g.rect(x - r * 0.85, y - r * 0.85, r * 1.7, r * 1.7);
      else if (k === 2) { g.moveTo(x, y - r); g.lineTo(x + r, y + r * 0.8); g.lineTo(x - r, y + r * 0.8); g.closePath(); }
      else if (k === 3) { g.moveTo(x, y - r); g.lineTo(x + r, y); g.lineTo(x, y + r); g.lineTo(x - r, y); g.closePath(); }
      else if (k === 4) { for (var i = 0; i < 10; i++) { var rad = i % 2 ? r * 0.45 : r, an = -1.5708 + i * 0.6283; g[i ? 'lineTo' : 'moveTo'](x + rad * Math.cos(an), y + rad * Math.sin(an)); } g.closePath(); }
      else { var q = r * 0.34; g.moveTo(x - q, y - r); g.lineTo(x + q, y - r); g.lineTo(x + q, y - q); g.lineTo(x + r, y - q); g.lineTo(x + r, y + q); g.lineTo(x + q, y + q); g.lineTo(x + q, y + r); g.lineTo(x - q, y + r); g.lineTo(x - q, y + q); g.lineTo(x - r, y + q); g.lineTo(x - r, y - q); g.lineTo(x - q, y - q); g.closePath(); }
      g.fill(); g.stroke();
    }
    function newRound() {
      var N = CNT[round], all = [], k, c; for (k = 0; k < 6; k++) for (c = 0; c < 4; c++) all.push([k, c]); shuf(all);
      items = all.slice(0, N); var dis = all.slice(N, N + 3);
      slot = []; for (k = 0; k < N; k++) slot.push(k); shuf(slot);
      miss = (Math.random() * N) | 0; opts = shuf([items[miss]].concat(dis)); ans = -1; opts.forEach(function (o, i) { if (o === items[miss]) ans = i; });
      ph = 'show'; tm0 = tm = 0.7 * N + 1.5;
    }
    function reset() { round = 0; err = 0; fb = 0; newRound(); st = 'play'; }
    function lay() { var W = api.w, H = api.h, cs = Math.min((W - 24) / 4, (H - 230) / 2, 92); return { cs: cs, x0: (W - cs * 4) / 2, y0: 86, ow: Math.min((W - 30) / 4, 96) }; }
    function sp(si) { var L = lay(); return { x: L.x0 + (si % 4) * L.cs + L.cs / 2, y: L.y0 + ((si / 4) | 0) * L.cs + L.cs / 2 }; }
    function op(i) { var L = lay(); return { x: api.w / 2 + (i - 1.5) * (L.ow + 6), y: L.y0 + 2 * L.cs + 70 }; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, round: round, err: err, ph: ph, ans: ans, pos: [0, 1, 2, 3].map(op), fb: fb }; },
      down: function (x, y) {
        if (menu()) return; if (ph !== 'ask' || fb > 0) return; var L = lay(), i;
        for (i = 0; i < 4; i++) { var p = op(i); if (Math.abs(x - p.x) < L.ow / 2 && Math.abs(y - p.y) < L.ow / 2) { fbOk = i === ans; if (fbOk) round++; else err++; fb = 0.9; if (api.nota) api.nota(fbOk ? 520 : 120, 0.2, fbOk ? 'triangle' : 'sawtooth', 0.06); return; } }
      },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) {
        if (st !== 'play') return;
        if (ph === 'show') { tm -= dt; if (tm <= 0) ph = 'ask'; }
        if (fb > 0) { fb -= dt; if (fb <= 0) { if (round >= NR) st = 'win'; else if (err >= MAXE) st = 'lose'; else newRound(); } }
      },
      draw: function () {
        var L = lay(), i; bg('#1b1e30', '#07080f');
        for (i = 0; i < CNT[round]; i++) { var s = sp(i); g.fillStyle = 'rgba(255,255,255,.06)'; rr(s.x - L.cs / 2 + 3, s.y - L.cs / 2 + 3, L.cs - 6, L.cs - 6, 10); g.fill(); }
        for (i = 0; i < items.length; i++) { var p = sp(slot[i]); if (ph === 'ask' && i === miss) { txt('?', p.x, p.y + 1, L.cs * 0.5, '#ffd88a'); continue; } shape(items[i][0], items[i][1], p.x, p.y, L.cs * 0.32); }
        if (ph === 'show') { txt(T.memo, api.w / 2, L.y0 + 2 * L.cs + 30, 16, '#f3ecd2'); bar(api.w / 2 - 110, L.y0 + 2 * L.cs + 52, 220, 6, tm / tm0, '#ffd88a'); }
        else {
          txt(T.pergunta, api.w / 2, L.y0 + 2 * L.cs + 24, 16, '#f3ecd2');
          for (i = 0; i < 4; i++) { var o = op(i), bc = fb > 0 ? (i === ans ? '#8fe0a0' : 'rgba(255,255,255,.2)') : 'rgba(255,255,255,.4)'; g.fillStyle = 'rgba(255,255,255,.08)'; rr(o.x - L.ow / 2, o.y - L.ow / 2, L.ow, L.ow, 12); g.fill(); g.strokeStyle = bc; g.lineWidth = 2; rr(o.x - L.ow / 2, o.y - L.ow / 2, L.ow, L.ow, 12); g.stroke(); shape(opts[i][0], opts[i][1], o.x, o.y, L.ow * 0.3); }
        }
        hud(T.h1 + ' ' + Math.min(round + 1, NR) + '/' + NR, T.h2 + ' ' + err + '/' + MAXE, true);
        fim(st);
      }
    };

  }
});
