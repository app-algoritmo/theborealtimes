/* Os thralls e os jarros — problema clássico de medidas 8, 5 e 3 (invenção). */
BTJogo.registrar({
  canvas: 'jogo-thralls',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os jarros do thrall",
    "sub": "Três jarros guardam 8, 5 e 3 medidas, e só o maior começa cheio. Toque num jarro e depois em outro para despejar até esvaziar o primeiro ou encher o segundo. Deixe exatamente 4 medidas no jarro de 8 e 4 no de 5, em até 14 despejos e 240 segundos.",
    "perdeu": "Os despejos acabaram ou o tempo esgotou",
    "v1": "Quatro e quatro, sem sobra!",
    "v2": "Thrall (þræll) era o escravizado da Era Viking, abaixo do karl, o homem livre, e do jarl, segundo o poema Rígsþula; a palavra vem de uma raiz germânica que significa \"corredor\". Os jarros são invenção.",
    "h1": "Despejos",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The thrall's jugs",
    "sub": "Three jugs hold 8, 5 and 3 measures, and only the largest starts full. Tap a jug and then another to pour until the first is empty or the second is full. Leave exactly 4 measures in the 8-jug and 4 in the 5-jug, in up to 14 pours and 240 seconds.",
    "perdeu": "The pours ran out or time ran out",
    "v1": "Four and four, nothing left over!",
    "v2": "A thrall (þræll) was an enslaved person of the Viking Age, below the karl, the freeman, and the jarl, according to the poem Rígsþula; the word comes from a Germanic root meaning \"runner\". The jugs are invented.",
    "h1": "Pours",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Trellens krukker",
    "sub": "Tre krukker rommer 8, 5 og 3 mål, og bare den største er full i starten. Trykk på en krukke og så på en annen for å helle til den første er tom eller den andre full. La nøyaktig 4 mål bli igjen i 8-krukka og 4 i 5-krukka, på opptil 14 helleomganger og 240 sekunder.",
    "perdeu": "Hellingene tok slutt eller tiden gikk ut",
    "v1": "Fire og fire, uten rest!",
    "v2": "En trell (þræll) var en slavebundet person i vikingtiden, under karlen, den frie mannen, og jarlen, ifølge diktet Rígsþula; ordet kommer fra en germansk rot som betyr «løper». Krukkene er oppfunnet.",
    "h1": "Helling",
    "h2": "Tid"
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
    var CAP = [8, 5, 3], MAXM = 14, LIM = 240;
    var jug = [8, 0, 0], sel = -1, mv = 0, t = 0;
    function reset() { jug = [8, 0, 0]; sel = -1; mv = 0; t = 0; st = 'play'; }
    function lay() { var W = api.w, H = api.h, u = Math.max(14, Math.min((W - 60) / 24, (H - 190) / 9, 30)); return { u: u, base: 100 + u * 9 + Math.max(0, (H - 190 - u * 9) / 2), gap: u * 1.6 }; }
    function jbox(i) { var L = lay(), tot = (8 + 5 + 3) * 1.0, x = api.w / 2 - (CAP[0] + CAP[1] + CAP[2]) * L.u / 2 - L.gap, k; for (k = 0; k < i; k++) x += CAP[k] * L.u + L.gap; return { x: x, w: CAP[i] * L.u * 0.95, y: L.base - CAP[i] * L.u, h: CAP[i] * L.u }; }
    function pour(a, b) { var amt = Math.min(jug[a], CAP[b] - jug[b]); if (amt <= 0) return false; jug[a] -= amt; jug[b] += amt; mv++; if (api.nota) api.nota(260 + jug[b] * 30, 0.12, 'sine', 0.06); if (jug[0] === 4 && jug[1] === 4) st = 'win'; else if (mv >= MAXM) st = 'lose'; return true; }
    function at(x, y) { for (var i = 0; i < 3; i++) { var b = jbox(i); if (x > b.x - 8 && x < b.x + b.w + 8 && y > b.y - 24 && y < b.y + b.h + 24) return i; } return -1; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { var ps = []; for (var i = 0; i < 3; i++) { var b = jbox(i); ps.push({ x: b.x + b.w / 2, y: b.y + b.h / 2 }); } return { st: st, jug: jug.slice(), sel: sel, mv: mv, t: t, pos: ps }; },
      down: function (x, y) { if (menu()) return; if (st !== 'play') return; var i = at(x, y); if (i < 0) { sel = -1; return; } if (sel < 0) { if (jug[i] > 0) sel = i; return; } if (sel === i) { sel = -1; return; } pour(sel, i); sel = -1; },
      move: function () {}, up: function () {},
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } },
      update: function (dt) { if (st !== 'play') return; t += dt; if (t >= LIM) st = 'lose'; },
      draw: function () {
        var L = lay(), i; bg('#1d2a38', '#080d14');
        for (i = 0; i < 3; i++) {
          var b = jbox(i), wh = jug[i] * L.u;
          g.fillStyle = 'rgba(240,226,190,.1)'; rr(b.x, b.y, b.w, b.h, 6); g.fill();
          g.fillStyle = i === sel ? '#ffe6a8' : '#d9a93a'; if (wh > 0) { rr(b.x, b.y + b.h - wh, b.w, wh, 6); g.fill(); }
          g.lineWidth = i === sel ? 3 : 2; g.strokeStyle = i === sel ? '#fff' : 'rgba(240,226,190,.5)'; rr(b.x, b.y, b.w, b.h, 6); g.stroke();
          txt(String(jug[i]), b.x + b.w / 2, b.y - 8, 16, '#f3ecd2'); txt('/' + CAP[i], b.x + b.w / 2, b.y + b.h + 20, 12, 'rgba(243,236,210,.6)');
        }
        bar(api.w / 2 - 110, api.h - 14, 220, 5, (LIM - t) / LIM, LIM - t < 40 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + mv + '/' + MAXM, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };

  }
});
