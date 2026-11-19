/* Kalevipoeg — escolha as pedras que cabem no saco (invenção). */
BTJogo.registrar({
  canvas: 'jogo-kalevipoeg',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As pedras de Kalevipoeg",
    "sub": "Cada pedra mostra o peso (número grande) e o valor (número com estrela). Toque nas pedras para pôr ou tirar do saco. O saco aguenta um peso máximo, e você precisa juntar pelo menos o valor da meta sem passar desse peso. Há uma escolha que alcança a meta. São 3 rodadas, e o tempo é limitado.",
    "perdeu": "O tempo acabou antes de o saco ficar certo",
    "v1": "Saco bem escolhido!",
    "v2": "O Kalevipoeg, epopeia estoniana organizada por Friedrich Reinhold Kreutzwald depois de 1850, narra as façanhas de um herói gigante, entre elas o arremesso de pedras. Escolher pedras para o saco é invenção.",
    "h1": "Rodada",
    "h2": "Tempo",
    "peso": "Peso",
    "valor": "Valor",
    "max": "máx.",
    "meta": "meta"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Kalevipoeg’s stones",
    "sub": "Each stone shows its weight (large number) and its value (number with a star). Tap stones to put them in or take them out of the sack. The sack holds a maximum weight, and you must gather at least the target value without going over that weight. There is a choice that reaches the target. There are 3 rounds, and time is limited.",
    "perdeu": "Time ran out before the sack was right",
    "v1": "Well-chosen sack!",
    "v2": "The Kalevipoeg, an Estonian epic compiled by Friedrich Reinhold Kreutzwald after 1850, tells of the deeds of a giant hero, among them stone-throwing. Choosing stones for the sack is invented.",
    "h1": "Round",
    "h2": "Time",
    "peso": "Weight",
    "valor": "Value",
    "max": "max.",
    "meta": "target"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Kalevipoegs steiner",
    "sub": "Hver stein viser vekten (stort tall) og verdien (tall med stjerne). Trykk på steinene for å legge dem i eller ta dem ut av sekken. Sekken tåler en maksimal vekt, og du må samle minst målverdien uten å gå over den vekten. Det finnes ett utvalg som når målet. Det er 3 runder, og tiden er begrenset.",
    "perdeu": "Tiden gikk ut før sekken var riktig",
    "v1": "Godt valgt sekk!",
    "v2": "Kalevipoeg, et estisk epos satt sammen av Friedrich Reinhold Kreutzwald etter 1850, forteller om en kjempehelts bragder, blant dem steinkasting. Å velge steiner til sekken er oppfunnet.",
    "h1": "Runde",
    "h2": "Tid",
    "peso": "Vekt",
    "valor": "Verdi",
    "max": "maks.",
    "meta": "mål"
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
    var NN = [7, 8, 9], NL = 3, LIM = 300;
    var lvl = 0, it = [], sel = [], cap = 0, target = 0, sol = [], t = 0, pend = 0;
    function gen(i) {
      var n = NN[i];
      for (var tries = 0; tries < 5000; tries++) {
        var a = [], k, sw = 0; for (k = 0; k < n; k++) { var w = 2 + ((Math.random() * 8) | 0); a.push({ w: w, v: 3 + ((Math.random() * 18) | 0) }); sw += w; }
        var c = Math.round(sw * 0.42), best = -1, cnt = 0, bm = 0, m;
        for (m = 0; m < (1 << n); m++) { var W = 0, V = 0; for (k = 0; k < n; k++) if ((m >> k) & 1) { W += a[k].w; V += a[k].v; } if (W > c) continue; if (V > best) { best = V; cnt = 1; bm = m; } else if (V === best) cnt++; }
        if (cnt !== 1) continue; var sz = 0; for (k = 0; k < n; k++) if ((bm >> k) & 1) sz++; if (sz < 3 || sz > n - 3) continue;
        it = a; cap = c; target = best; sol = []; for (k = 0; k < n; k++) if ((bm >> k) & 1) sol.push(k); sel = a.map(function () { return 0; }); return;
      }
    }
    function totals() { var W = 0, V = 0; it.forEach(function (o, k) { if (sel[k]) { W += o.w; V += o.v; } }); return { W: W, V: V }; }
    function reset() { lvl = 0; t = 0; pend = 0; gen(0); st = 'play'; }
    function lay() { var W = api.w, H = api.h, n = it.length, cols = W > H ? 5 : 3, rows = Math.ceil(n / cols), s = Math.min((W - 24) / cols, (H - 190) / rows, 92); return { cols: cols, s: s, x0: (W - cols * s) / 2, y0: 84 }; }
    function cc(i) { var L = lay(); return { x: L.x0 + (i % L.cols) * L.s + L.s / 2, y: L.y0 + ((i / L.cols) | 0) * L.s + L.s / 2 }; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lvl: lvl, n: it.length, sol: sol.slice(), cur: sel.slice(), cap: cap, target: target, pos: it.map(function (o, i) { return cc(i); }), t: t, pend: pend }; },
      down: function (x, y) {
        if (menu()) return; if (pend > 0) return; var L = lay(), i;
        for (i = 0; i < it.length; i++) { var p = cc(i); if (Math.hypot(x - p.x, y - p.y) < L.s * 0.45) { sel[i] = sel[i] ? 0 : 1; if (api.nota) api.nota(sel[i] ? 300 : 220, 0.05, 'square', 0.03); var s = totals(); if (s.W <= cap && s.V >= target) { lvl++; pend = 0.9; if (api.nota) api.nota(520, 0.2, 'triangle', 0.07); } return; } }
      },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) {
        if (st !== 'play') return; t += dt;
        if (pend > 0) { pend -= dt; if (pend <= 0) { if (lvl >= NL) st = 'win'; else gen(lvl); } }
        if (st === 'play' && t >= LIM) st = 'lose';
      },
      draw: function () {
        var L = lay(), i, s = totals(); bg('#242028', '#09070c');
        for (i = 0; i < it.length; i++) {
          var p = cc(i), r = L.s * 0.4, on = sel[i];
          g.fillStyle = on ? '#8a7a5a' : '#59606e'; g.beginPath(); g.ellipse ? g.ellipse(p.x, p.y, r, r * 0.88, 0, 0, 6.2832) : g.arc(p.x, p.y, r, 0, 6.2832); g.fill(); g.strokeStyle = on ? '#ffd88a' : 'rgba(255,255,255,.3)'; g.lineWidth = on ? 4 : 2; g.stroke();
          txt(String(it[i].w), p.x, p.y - r * 0.12, L.s * 0.34, '#f3ecd2'); txt('★' + it[i].v, p.x, p.y + r * 0.52, L.s * 0.2, '#ffd88a');
        }
        var yy = L.y0 + Math.ceil(it.length / L.cols) * L.s + 22;
        txt(T.peso + ' ' + s.W + ' / ' + T.max + ' ' + cap, api.w / 2, yy, 16, s.W > cap ? '#ff9a8d' : '#f3ecd2');
        txt(T.valor + ' ' + s.V + ' / ' + T.meta + ' ' + target, api.w / 2, yy + 24, 16, s.V >= target ? '#8fe0a0' : '#f3ecd2');
        bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 60 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + Math.min(lvl + 1, NL) + '/' + NL, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };

  }
});
