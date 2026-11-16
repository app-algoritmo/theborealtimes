/* Týr, deus da mão perdida — apague todas as luzes da rede de elos (invenção). */
BTJogo.registrar({
  canvas: 'jogo-tyr',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os elos de Týr",
    "sub": "Toque numa luz para trocar o seu estado e o das quatro vizinhas: acesa vira apagada e apagada vira acesa. Apague todas as luzes da rede dentro do limite de toques e de 100 segundos. (Teclado: setas movem, Espaço toca.)",
    "perdeu": "Os toques ou o tempo acabaram",
    "v1": "Todas as luzes se apagaram!",
    "v2": "Týr pôs a mão na boca de Fenrir para prender o lobo com Gleipnir. A rede de luzes é invenção.",
    "h1": "Luzes acesas",
    "h2": "Toques"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Týr's links",
    "sub": "Tap a light to switch its state and that of its four neighbours: lit turns off and unlit turns on. Put out every light in the net within the tap limit and 100 seconds. (Keyboard: arrows move, Space taps.)",
    "perdeu": "The taps or the time ran out",
    "v1": "Every light is out!",
    "v2": "Týr put his hand in Fenrir's mouth so the wolf could be bound with Gleipnir. The net of lights is invented.",
    "h1": "Lights on",
    "h2": "Taps"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Týrs lenker",
    "sub": "Trykk på et lys for å bytte tilstanden til det og de fire naboene: tent blir slukket og slukket blir tent. Slukk alle lysene i nettet innenfor trykkgrensen og 100 sekunder. (Tastatur: piler flytter, mellomrom trykker.)",
    "perdeu": "Trykkene eller tiden tok slutt",
    "v1": "Alle lysene er slukket!",
    "v2": "Týr la hånden i munnen på Fenrir slik at ulven kunne bindes med Gleipne. Lysnettet er oppfunnet.",
    "h1": "Lys på",
    "h2": "Trykk"
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
    var N = 5, LIM = 100;
    var Ls = [], need = [], presses = 0, maxp = 8, t = 0, cur = 12, flash = 0;
    function lay() { var W = api.w, H = api.h, cs = Math.max(40, Math.min((W - 30) / N, (H - 130) / N, 86)); return { cs: cs, x: (W - cs * N) / 2, y: Math.max(72, (H - cs * N) / 2 + 14) }; }
    function pos(i) { var L = lay(); return { x: L.x + (i % N + 0.5) * L.cs, y: L.y + (Math.floor(i / N) + 0.5) * L.cs }; }
    function tog(c) { var r = Math.floor(c / N), q = c % N; Ls[c] = !Ls[c]; if (r > 0) Ls[c - N] = !Ls[c - N]; if (r < N - 1) Ls[c + N] = !Ls[c + N]; if (q > 0) Ls[c - 1] = !Ls[c - 1]; if (q < N - 1) Ls[c + 1] = !Ls[c + 1]; }
    function lit() { var n = 0; Ls.forEach(function (v) { if (v) n++; }); return n; }
    function reset() {
      for (var tr = 0; tr < 200; tr++) {
        Ls = []; need = []; var i; for (i = 0; i < N * N; i++) { Ls.push(false); need.push(0); }
        var k = 5 + Math.floor(Math.random() * 3), c = 0; while (c < k) { var q = Math.floor(Math.random() * N * N); if (!need[q]) { need[q] = 1; tog(q); c++; } }
        if (lit() >= 6) break;
      }
      var kk = 0; need.forEach(function (v) { kk += v; }); maxp = kk + 6; presses = 0; t = 0; st = 'play';
    }
    function press(c) {
      if (st !== 'play') return; tog(c); need[c] ^= 1; presses++; flash = 0.2; if (api.nota) api.nota(300 + (c % N) * 40, 0.1, 'triangle', 0.05);
      if (lit() === 0) st = 'win'; else if (presses >= maxp) st = 'lose';
    }
    function at(x, y) { var L = lay(); for (var i = 0; i < N * N; i++) { var p = pos(i); if (Math.abs(x - p.x) < L.cs * 0.5 && Math.abs(y - p.y) < L.cs * 0.5) return i; } return -1; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { var nd = []; need.forEach(function (v, i) { if (v) nd.push(i); }); return { st: st, lit: lit(), need: nd, presses: presses, max: maxp, t: t, pos: pos }; },
      down: function (x, y) { if (menu()) return; var i = at(x, y); if (i >= 0) { cur = i; press(i); } },
      move: function () {}, up: function () {},
      key: function (k, d) {
        if (!d) return; if (st !== 'play') { menu(); return; }
        if (k === 'ArrowLeft' || k === 'KeyA') cur = cur % N ? cur - 1 : cur; else if (k === 'ArrowRight' || k === 'KeyD') cur = cur % N < N - 1 ? cur + 1 : cur;
        else if (k === 'ArrowUp' || k === 'KeyW') cur = cur >= N ? cur - N : cur; else if (k === 'ArrowDown' || k === 'KeyS') cur = cur < N * (N - 1) ? cur + N : cur;
        else if (k === 'Space' || k === 'Enter') press(cur);
      },
      update: function (dt) { if (flash > 0) flash -= dt; if (st !== 'play') return; t += dt; if (t >= LIM) st = 'lose'; },
      draw: function () {
        var L = lay(), cs = L.cs, i;
        bg('#241a38', '#0d0a18');
        g.strokeStyle = 'rgba(243,236,210,.12)'; g.lineWidth = 3;
        for (i = 0; i < N * N; i++) { var p = pos(i); if (i % N < N - 1) { g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(p.x + cs, p.y); g.stroke(); } if (i < N * (N - 1)) { g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(p.x, p.y + cs); g.stroke(); } }
        for (i = 0; i < N * N; i++) {
          var q = pos(i), r = cs * 0.36;
          g.fillStyle = Ls[i] ? '#ffd88a' : '#3a2f5a'; g.beginPath(); g.arc(q.x, q.y, r, 0, 6.283); g.fill();
          if (Ls[i]) { g.fillStyle = 'rgba(255,240,200,.55)'; g.beginPath(); g.arc(q.x, q.y, r * 0.55, 0, 6.283); g.fill(); }
          g.strokeStyle = Ls[i] ? '#b8862a' : '#6a5a98'; g.lineWidth = 3; g.beginPath(); g.arc(q.x, q.y, r, 0, 6.283); g.stroke();
          if (st === 'play' && i === cur) { g.strokeStyle = '#fff'; g.lineWidth = 2; g.beginPath(); g.arc(q.x, q.y, r + 5, 0, 6.283); g.stroke(); }
        }
        bar(api.w / 2 - 110, api.h - 14, 220, 5, (LIM - t) / LIM, LIM - t < 15 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + lit(), T.h2 + ' ' + presses + '/' + maxp, presses >= maxp - 2);
        fim(st);
      }
    };
  }
});
