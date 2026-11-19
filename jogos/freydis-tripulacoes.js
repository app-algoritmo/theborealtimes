/* Freydís e a Vinlândia — funda tripulações iguais até formar a de 256 homens (invenção). */
BTJogo.registrar({
  canvas: 'jogo-freydis',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As tripulações de Freydís",
    "sub": "Cada casa do quadro 4 por 4 leva uma tripulação com certo número de homens. Deslize todas elas com as setas do teclado ou com um arrastar do dedo: duas tripulações iguais que se encontram viram uma só, com o dobro de homens, e a cada lance surge uma tripulação nova de 2 ou 4. Forme uma tripulação de 256 homens antes de o quadro encher sem lances possíveis.",
    "perdeu": "O quadro encheu sem lances possíveis, ou o tempo acabou",
    "v1": "A tripulação de 256 está pronta!",
    "v2": "Na Saga dos Groenlandeses, Freydís faz um acordo de lucros iguais com os irmãos islandeses Helgi e Finnbogi para uma viagem à Vinlândia e leva em segredo mais homens do que o combinado; na Saga de Érico, o Vermelho, ela aparece uma só vez, no ataque dos skrælingar. As tripulações que se fundem são invenção.",
    "h1": "Maior",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Freydís's crews",
    "sub": "Each square of the 4-by-4 board holds a crew with a certain number of men. Slide them all with the keyboard arrows or with a swipe of the finger: two equal crews that meet become one, with double the men, and after every move a new crew of 2 or 4 appears. Form a crew of 256 men before the board fills up with no moves left.",
    "perdeu": "The board filled up with no moves left, or the time ran out",
    "v1": "The crew of 256 is ready!",
    "v2": "In the Saga of the Greenlanders, Freydís makes a deal to share profits equally with the Icelandic brothers Helgi and Finnbogi for a voyage to Vinland and secretly brings more men than agreed; in the Saga of Erik the Red, she appears only once, in the attack by the Skrælingar. The merging crews are invented.",
    "h1": "Largest",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Freydís’ mannskaper",
    "sub": "Hver rute på brettet på 4 ganger 4 har et mannskap med et visst antall menn. Skyv alle sammen med piltastene eller med et sveip med fingeren: to like mannskaper som møtes blir ett, med dobbelt så mange menn, og etter hvert trekk dukker det opp et nytt mannskap på 2 eller 4. Lag et mannskap på 256 menn før brettet fylles uten flere trekk.",
    "perdeu": "Brettet ble fullt uten flere trekk, eller tiden tok slutt",
    "v1": "Mannskapet på 256 er klart!",
    "v2": "I Grønlendingenes saga inngår Freydís en avtale om å dele fortjenesten likt med de islandske brødrene Helgi og Finnbogi for en reise til Vinland, og tar i hemmelighet med flere menn enn avtalt; i Eirik Raudes saga dukker hun bare opp én gang, i angrepet fra skrælingene. Mannskapene som smelter sammen er oppfunnet.",
    "h1": "Størst",
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
    var TARGET = 256, LIM = 600;
    var grid = [], t = 0, best = 0, sx = 0, sy = 0, dn = false;
    var COLS = { 2: '#7a6a52', 4: '#8f7a4e', 8: '#b8843c', 16: '#c46a32', 32: '#c24d36', 64: "#b0344a", 128: "#c8963a", 256: "#e6c15a" };
    function spawn() { var e = [], i; for (i = 0; i < 16; i++) if (!grid[i]) e.push(i); if (!e.length) return; grid[e[Math.floor(Math.random() * e.length)]] = Math.random() < 0.9 ? 2 : 4; }
    function reset() { grid = []; for (var i = 0; i < 16; i++) grid.push(0); spawn(); spawn(); best = 0; t = 0; st = 'play'; }
    function slide(line) { var a = [], out = [], i; for (i = 0; i < 4; i++) if (line[i]) a.push(line[i]); for (i = 0; i < a.length; i++) { if (a[i] === a[i + 1]) { out.push(a[i] * 2); i++; } else out.push(a[i]); } while (out.length < 4) out.push(0); return out; }
    function can() { var i; for (i = 0; i < 16; i++) { if (!grid[i]) return true; if (i % 4 < 3 && grid[i] === grid[i + 1]) return true; if (i < 12 && grid[i] === grid[i + 4]) return true; } return false; }
    function mv(dir) {
      if (st !== 'play') return; var moved = false, i, j, line, res, idx;
      for (i = 0; i < 4; i++) {
        line = []; for (j = 0; j < 4; j++) line.push(dir < 2 ? grid[i * 4 + (dir === 0 ? j : 3 - j)] : grid[(dir === 2 ? j : 3 - j) * 4 + i]);
        res = slide(line);
        for (j = 0; j < 4; j++) { idx = dir < 2 ? i * 4 + (dir === 0 ? j : 3 - j) : (dir === 2 ? j : 3 - j) * 4 + i; if (grid[idx] !== res[j]) { moved = true; grid[idx] = res[j]; } }
      }
      if (!moved) return; spawn(); if (api.nota) api.nota(260, 0.06, 'sine', 0.04);
      best = 0; for (i = 0; i < 16; i++) if (grid[i] > best) best = grid[i];
      if (best >= TARGET) st = 'win'; else if (!can()) st = 'lose';
    }
    function lay() { var W = api.w, H = api.h, s = Math.min(W - 24, H - 130, 420); return { s: s, c: s / 4, x0: (W - s) / 2, y0: 70 }; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, grid: grid.slice(), best: best, target: TARGET, t: t }; },
      down: function (x, y) { if (menu()) return; sx = x; sy = y; dn = true; },
      move: function () {},
      up: function (x, y) {
        if (!dn) return; dn = false; if (x === undefined) return; var dx = x - sx, dy = y - sy;
        if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
        if (Math.abs(dx) > Math.abs(dy)) mv(dx < 0 ? 0 : 1); else mv(dy < 0 ? 2 : 3);
      },
      key: function (k, d) {
        if (!d) return; if (st !== 'play') { menu(); return; }
        var m = { ArrowLeft: 0, KeyA: 0, ArrowRight: 1, KeyD: 1, ArrowUp: 2, KeyW: 2, ArrowDown: 3, KeyS: 3 }[k]; if (m !== undefined) mv(m);
      },
      update: function (dt) { if (st !== 'play') return; t += dt; if (t >= LIM) st = 'lose'; },
      draw: function () {
        var L = lay(), i; bg('#2b2118', '#0d0a07');
        g.fillStyle = 'rgba(0,0,0,.35)'; rr(L.x0 - 4, L.y0 - 4, L.s + 8, L.s + 8, 12); g.fill();
        for (i = 0; i < 16; i++) {
          var x = L.x0 + (i % 4) * L.c + 3, y = L.y0 + ((i / 4) | 0) * L.c + 3, v = grid[i];
          g.fillStyle = v ? (COLS[v] || '#d8b04a') : 'rgba(255,255,255,.07)'; rr(x, y, L.c - 6, L.c - 6, 8); g.fill();
          if (v) txt(String(v), x + (L.c - 6) / 2, y + (L.c - 6) / 2 + 8, v > 99 ? 26 : 30, '#fff');
        }
        bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 60 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + best, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };

  }
});
