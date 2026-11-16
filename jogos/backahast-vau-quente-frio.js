/* Bäckahäst, o cavalo do riacho — ache o vau escondido guiado por pistas de quente e frio (invenção). */
BTJogo.registrar({
  canvas: 'jogo-backahast',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O vau do cavalo do riacho",
    "sub": "O cavalo do riacho espera num vau escondido no rio. Toque numa pedra para pisar nela: a cor mostra se o vau está longe ou perto (azul frio, amarelo morno, laranja quente, vermelho fervendo). Ache o vau em até 7 tentativas e 90 segundos. (Teclado: setas movem o cursor, Espaço pisa.)",
    "perdeu": "A névoa engoliu você",
    "v1": "Você achou o vau!",
    "v2": "Na tradição sueca, o cavalo do riacho espera junto à água e quem sobe nele não desce mais. O vau escondido e as pistas são invenção.",
    "h1": "Tentativas",
    "h2": "Tempo",
    "c1": "Frio",
    "c2": "Morno",
    "c3": "Quente",
    "c4": "Fervendo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The brook horse's ford",
    "sub": "The brook horse waits at a hidden ford in the river. Tap a stone to step on it: the colour shows whether the ford is far or near (blue cold, yellow mild, orange warm, red boiling). Find the ford within 7 tries and 90 seconds. (Keyboard: arrows move the cursor, Space steps.)",
    "perdeu": "The mist swallowed you",
    "v1": "You found the ford!",
    "v2": "In Swedish tradition, the brook horse waits by the water and whoever climbs on it never comes down. The hidden ford and the clues are invented.",
    "h1": "Tries",
    "h2": "Time",
    "c1": "Cold",
    "c2": "Mild",
    "c3": "Warm",
    "c4": "Boiling"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Bekkehestens vadested",
    "sub": "Bekkehesten venter ved et skjult vadested i elva. Trykk på en stein for å tråkke på den: fargen viser om vadestedet er langt eller nær (blå kald, gul lunken, oransje varm, rød kokende). Finn vadestedet på 7 forsøk og 90 sekunder. (Tastatur: piler flytter markøren, mellomrom tråkker.)",
    "perdeu": "Tåka slukte deg",
    "v1": "Du fant vadestedet!",
    "v2": "I svensk tradisjon venter bekkehesten ved vannet, og den som setter seg på, kommer aldri ned igjen. Det skjulte vadestedet og hintene er oppfunnet.",
    "h1": "Forsøk",
    "h2": "Tid",
    "c1": "Kald",
    "c2": "Lunken",
    "c3": "Varm",
    "c4": "Kokende"
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
    var NC = 8, NR = 5, TRY = 7, LIM = 90;
    var hx = 0, hy = 0, res = {}, tries = 0, t = 0, kx = 3, ky = 2, flash = 0, fcol = '', sx = 3, sy = 2;
    var COL = ['#4a8ac8', '#d8c84a', '#e8913a', '#d8453a'];
    function cat(d) { return d <= 2 ? 3 : d <= 4 ? 2 : d <= 6 ? 1 : 0; }
    function reset() { hx = Math.floor(Math.random() * NC); hy = Math.floor(Math.random() * NR); res = {}; tries = 0; t = 0; kx = 3; ky = 2; flash = 0; st = 'play'; }
    function lay() { var W = api.w, H = api.h, cs = Math.max(34, Math.min((W - 16) / NC, (H - 160) / NR, 80)); return { W: W, H: H, cs: cs, x: (W - cs * NC) / 2, y: Math.max(76, (H - cs * NR) / 2) }; }
    function step(x, y) {
      if (st !== 'play' || x < 0 || y < 0 || x >= NC || y >= NR || res[x + ',' + y] !== undefined) return;
      tries++; var d = Math.abs(x - hx) + Math.abs(y - hy);
      if (d === 0) { res[x + ',' + y] = 4; st = 'win'; if (api.nota) api.nota(700, 0.3, 'sine', 0.06); return; }
      res[x + ',' + y] = cat(d); if (api.nota) api.nota(220 + cat(d) * 120, 0.12, 'triangle', 0.05);
      if (tries >= TRY) st = 'lose';
    }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, res: res, tries: tries, max: TRY, nc: NC, nr: NR, t: t, pos: function (x, y) { return { x: L.x + (x + 0.5) * L.cs, y: L.y + (y + 0.5) * L.cs }; } }; },
      down: function (x, y) { if (menu()) return; var L = lay(); step(Math.floor((x - L.x) / L.cs), Math.floor((y - L.y) / L.cs)); },
      move: function () {}, up: function () {},
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'ArrowLeft' || k === 'KeyA') kx = Math.max(0, kx - 1); else if (k === 'ArrowRight' || k === 'KeyD') kx = Math.min(NC - 1, kx + 1); else if (k === 'ArrowUp' || k === 'KeyW') ky = Math.max(0, ky - 1); else if (k === 'ArrowDown' || k === 'KeyS') ky = Math.min(NR - 1, ky + 1); else if (k === 'Space' || k === 'Enter') step(kx, ky); },
      update: function (dt) { if (st !== 'play') return; t += dt; if (t >= LIM) st = 'lose'; },
      draw: function () {
        var L = lay(), cs = L.cs, i, j, W = L.W;
        bg('#2a3a4a', '#0e1822');
        g.fillStyle = 'rgba(180,210,230,.1)'; for (i = 0; i < 5; i++) g.fillRect(0, L.y + i * cs * 1.2 + Math.sin(api.clock + i) * 6, W, 8);
        for (i = 0; i < NC; i++) for (j = 0; j < NR; j++) { var k = i + ',' + j, v = res[k], x = L.x + i * cs, y = L.y + j * cs; g.fillStyle = v === undefined ? '#6a7a86' : (v === 4 ? '#6fd3a0' : COL[v]); rr(x + 3, y + 3, cs - 6, cs - 6, cs * 0.3); g.fill(); if (v === undefined) { g.fillStyle = 'rgba(255,255,255,.12)'; g.beginPath(); g.arc(x + cs * 0.4, y + cs * 0.38, cs * 0.12, 0, 6.283); g.fill(); } }
        if (st === 'play') { g.strokeStyle = 'rgba(255,255,255,.8)'; g.lineWidth = 2; g.strokeRect(L.x + kx * cs + 1, L.y + ky * cs + 1, cs - 2, cs - 2); }
        if (st === 'lose') { var hp = [hx, hy]; g.fillStyle = '#f3ecd2'; g.beginPath(); g.arc(L.x + (hp[0] + 0.5) * cs, L.y + (hp[1] + 0.5) * cs, cs * 0.3, 0, 6.283); g.fill(); }
        var ly = L.y + NR * cs + 28, names = [T.c1, T.c2, T.c3, T.c4], lw = Math.min(W / 4, 130);
        for (i = 0; i < 4; i++) { var lx = W / 2 + (i - 1.5) * lw; g.fillStyle = COL[i]; g.fillRect(lx - lw / 2 + 8, ly - 10, 14, 14); txt(names[i], lx + 8, ly + 2, 13, '#f3ecd2'); }
        bar(W / 2 - 110, api.h - 14, 220, 5, (LIM - t) / LIM, LIM - t < 15 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + tries + '/' + TRY, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };
  }
});
