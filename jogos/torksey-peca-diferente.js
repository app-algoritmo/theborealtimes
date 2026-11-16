/* Torksey, acampamento do Grande Exército — ache a peça de jogo diferente, em rodadas cada vez mais difíceis (invenção). */
BTJogo.registrar({
  canvas: 'jogo-torksey',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A peça diferente de Torksey",
    "sub": "Em cada rodada aparecem peças de jogo quase iguais: uma delas tem um tom um pouco diferente. Toque nela antes que o tempo da rodada acabe. A cada rodada há mais peças e a diferença fica menor. Complete 10 rodadas com no máximo 2 erros. Errar ou deixar o tempo acabar conta como erro. (Teclado: setas movem o cursor, Espaço escolhe.)",
    "perdeu": "Erros demais",
    "v1": "Você viu todas as diferenças!",
    "v2": "No inverno de 872–873, o Grande Exército acampou em Torksey, Lincolnshire, e deixou mais de 300 peças de jogo de chumbo. As rodadas são invenção.",
    "h1": "Rodadas",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Torksey's odd piece",
    "sub": "Each round shows almost identical gaming pieces: one of them has a slightly different shade. Tap it before the round time runs out. Every round brings more pieces and a smaller difference. Complete 10 rounds with at most 2 mistakes. A wrong tap or running out of time counts as a mistake. (Keyboard: arrows move the cursor, Space picks.)",
    "perdeu": "Too many mistakes",
    "v1": "You spotted every difference!",
    "v2": "In the winter of 872–873, the Great Army camped at Torksey, Lincolnshire, and left more than 300 lead gaming pieces. The rounds are invented.",
    "h1": "Rounds",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Den avvikende brikken i Torksey",
    "sub": "Hver runde viser nesten like spillebrikker: én av dem har en litt annen nyanse. Trykk på den før rundetiden går ut. Hver runde får flere brikker og mindre forskjell. Fullfør 10 runder med høyst 2 feil. Å trykke feil eller la tiden gå ut teller som en feil. (Tastatur: piler flytter markøren, mellomrom velger.)",
    "perdeu": "For mange feil",
    "v1": "Du så alle forskjellene!",
    "v2": "Vinteren 872–873 slo Den store hæren leir ved Torksey i Lincolnshire og etterlot mer enn 300 spillebrikker av bly. Rundene er oppfunnet.",
    "h1": "Runder",
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
    var RN = 10, MAXE = 2;
    var round = 1, err = 0, n = 3, odd = 0, hue = 0, dl = 20, rt = 0, rmax = 8, kc = 0, flash = 0, fcol = '', t = 0;
    function dims(r) { return r <= 3 ? 3 : r <= 6 ? 4 : 5; }
    function newRound() { n = dims(round); odd = Math.floor(Math.random() * n * n); hue = Math.floor(Math.random() * 360); dl = Math.max(6, 24 - (round - 1) * 2); rmax = Math.max(5, 9 - round * 0.4); rt = 0; kc = 0; }
    function reset() { round = 1; err = 0; flash = 0; t = 0; newRound(); st = 'play'; }
    function lay() { var W = api.w, H = api.h, cs = Math.max(40, Math.min((W - 24) / n, (H - 150) / n, 96)); return { W: W, H: H, cs: cs, x: (W - cs * n) / 2, y: Math.max(76, (H - cs * n) / 2 + 8) }; }
    function pos(i) { var L = lay(); return { x: L.x + ((i % n) + 0.5) * L.cs, y: L.y + (Math.floor(i / n) + 0.5) * L.cs }; }
    function bad() { err++; flash = 0.4; fcol = '#c0392b'; if (api.nota) api.nota(110, 0.25, 'sawtooth', 0.06); if (err > MAXE) { st = 'lose'; return; } newRound(); }
    function pick(i) {
      if (st !== 'play' || i < 0 || i >= n * n) return;
      if (i === odd) { flash = 0.25; fcol = '#3a8a5a'; if (api.nota) api.nota(500 + round * 40, 0.1, 'triangle', 0.05); round++; if (round > RN) { st = 'win'; return; } newRound(); } else bad();
    }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { var p = pos(odd); return { st: st, round: round, err: err, odd: { x: p.x, y: p.y }, dl: dl, n: n, pos: pos, rt: rt, rmax: rmax }; },
      down: function (x, y) { if (menu()) return; var L = lay(), c = Math.floor((x - L.x) / L.cs), r = Math.floor((y - L.y) / L.cs); if (c >= 0 && c < n && r >= 0 && r < n) pick(r * n + c); },
      move: function () {}, up: function () {},
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'ArrowLeft' || k === 'KeyA') kc = kc % n ? kc - 1 : kc; else if (k === 'ArrowRight' || k === 'KeyD') kc = kc % n < n - 1 ? kc + 1 : kc; else if (k === 'ArrowUp' || k === 'KeyW') kc = kc >= n ? kc - n : kc; else if (k === 'ArrowDown' || k === 'KeyS') kc = kc < n * n - n ? kc + n : kc; else if (k === 'Space' || k === 'Enter') pick(kc); },
      update: function (dt) { if (flash > 0) flash -= dt; if (st !== 'play') return; t += dt; rt += dt; if (rt >= rmax) bad(); },
      draw: function () {
        var L = lay(), cs = L.cs, i;
        bg('#1e2630', '#080b10'); if (flash > 0) { g.fillStyle = fcol; g.globalAlpha = flash * 0.4; g.fillRect(0, 0, L.W, L.H); g.globalAlpha = 1; }
        for (i = 0; i < n * n; i++) { var p = pos(i), r = cs * 0.38, l = 46 + (i === odd ? dl : 0); g.fillStyle = 'hsl(' + hue + ',42%,' + l + '%)'; g.beginPath(); g.arc(p.x, p.y, r, 0, 6.283); g.fill(); g.strokeStyle = 'hsl(' + hue + ',42%,' + (l - 14) + '%)'; g.lineWidth = 3; g.beginPath(); g.arc(p.x, p.y, r * 0.62, 0, 6.283); g.stroke(); if (i === kc && st === 'play') { g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = 2; g.strokeRect(p.x - cs / 2 + 2, p.y - cs / 2 + 2, cs - 4, cs - 4); } }
        bar(api.w / 2 - 110, api.h - 14, 220, 5, 1 - rt / rmax, rmax - rt < 2 ? '#c0392b' : '#c9b3f2');
        hud(T.h1 + ' ' + Math.min(round, RN) + '/' + RN, T.h2 + ' ' + err + '/' + (MAXE + 1), err >= MAXE);
        fim(st);
      }
    };
  }
});
