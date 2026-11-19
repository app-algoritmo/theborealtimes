/* Íslendingabók — mova a pilha de rolos de um suporte a outro (invenção). */
BTJogo.registrar({
  canvas: 'jogo-islendingabok',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os rolos de Ari",
    "sub": "Quatro rolos de tamanhos diferentes estão empilhados no primeiro suporte. Leve a pilha inteira para o terceiro suporte. Toque num suporte para pegar o rolo de cima e toque noutro para soltá-lo. Nunca ponha um rolo maior sobre um menor. Você tem 25 lances. (Teclado: 1, 2 e 3.)",
    "perdeu": "Os lances ou o tempo acabaram antes de a pilha chegar ao terceiro suporte",
    "v1": "A pilha chegou ao terceiro suporte!",
    "v2": "A Íslendingabók foi escrita pelo padre Ari Þorgilsson, entre 1122 e 1133, segundo a data deduzida dos bispos citados no prólogo. A cópia medieval se perdeu, e o texto vem de cópias do século XVII. O jogo é invenção.",
    "h1": "Lances",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Ari's scrolls",
    "sub": "Four scrolls of different sizes are stacked on the first stand. Move the whole stack to the third stand. Tap a stand to pick up the top scroll and tap another to put it down. Never place a larger scroll on a smaller one. You have 25 moves. (Keyboard: 1, 2 and 3.)",
    "perdeu": "The moves or the time ran out before the stack reached the third stand",
    "v1": "The stack has reached the third stand!",
    "v2": "The Íslendingabók was written by the priest Ari Þorgilsson, between 1122 and 1133, going by the date worked out from the bishops named in the prologue. The medieval copy is lost, and the text comes from 17th-century copies. The game is invented.",
    "h1": "Moves",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Aris ruller",
    "sub": "Fire ruller i ulik størrelse ligger stablet på det første stativet. Flytt hele stabelen til det tredje stativet. Trykk på et stativ for å ta den øverste rullen, og trykk på et annet for å legge den fra deg. Legg aldri en større rull oppå en mindre. Du har 25 trekk. (Tastatur: 1, 2 og 3.)",
    "perdeu": "Trekkene eller tiden tok slutt før stabelen nådde det tredje stativet",
    "v1": "Stabelen har nådd det tredje stativet!",
    "v2": "Íslendingabók ble skrevet av presten Ari Þorgilsson, mellom 1122 og 1133, ut fra dateringen som kan utledes av biskopene i prologen. Middelalderkopien er tapt, og teksten bygger på kopier fra 1600-tallet. Spillet er oppfunnet.",
    "h1": "Trekk",
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
    var ND = 4, LIMIT = 25, LIM = 180;
    var pegs = [[], [], []], sel = -1, moves = 0, t = 0;
    function reset() { pegs = [[4, 3, 2, 1], [], []]; sel = -1; moves = 0; t = 0; st = 'play'; }
    function tap(p) {
      if (st !== 'play') return;
      if (sel < 0) { if (pegs[p].length) sel = p; return; }
      if (sel === p) { sel = -1; return; }
      var d = pegs[sel][pegs[sel].length - 1], top = pegs[p].length ? pegs[p][pegs[p].length - 1] : 99;
      if (d < top) { pegs[p].push(pegs[sel].pop()); moves++; sel = -1; if (api.nota) api.nota(220 + d * 60, 0.12, 'triangle', 0.06); if (pegs[2].length === ND) st = 'win'; else if (moves >= LIMIT) st = 'lose'; }
      else { sel = -1; if (api.nota) api.nota(110, 0.15, 'sawtooth', 0.04); }
    }
    function lay() { var W = api.w, H = api.h, pw = Math.min(W / 3 - 10, 150), ph = Math.min(H - 150, 240); return { pw: pw, ph: ph, y1: 80 + ph, cw: W / 3 }; }
    function ppos(i) { var L = lay(); return { x: L.cw * (i + 0.5), y: L.y1 - L.ph / 2 }; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, pegs: pegs.map(function (p) { return p.slice(); }), sel: sel, moves: moves, limit: LIMIT, t: t, pos: [0, 1, 2].map(ppos) }; },
      down: function (x, y) { if (menu()) return; var L = lay(); if (y > 60 && y < L.y1 + 40) tap(Math.max(0, Math.min(2, Math.floor(x / L.cw)))); },
      move: function () {}, up: function () {},
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } var m = { Digit1: 0, Digit2: 1, Digit3: 2, Numpad1: 0, Numpad2: 1, Numpad3: 2 }[k]; if (m !== undefined) tap(m); },
      update: function (dt) { if (st !== 'play') return; t += dt; if (t >= LIM) st = 'lose'; },
      draw: function () {
        var L = lay(), i, j; bg('#2a2016', '#0c0805');
        for (i = 0; i < 3; i++) {
          var cx = L.cw * (i + 0.5);
          g.fillStyle = sel === i ? '#ffd88a' : 'rgba(255,255,255,.22)'; g.fillRect(cx - 4, L.y1 - L.ph, 8, L.ph); g.fillRect(cx - L.pw / 2, L.y1, L.pw, 8);
          for (j = 0; j < pegs[i].length; j++) {
            var d = pegs[i][j], w = 26 + d * ((L.pw - 30) / ND), lift = sel === i && j === pegs[i].length - 1 ? 18 : 0;
            g.fillStyle = ['#c9a45a', '#b98a4e', '#a87348', '#8f5c3e'][d - 1]; rr(cx - w / 2, L.y1 - (j + 1) * 24 - lift, w, 20, 8); g.fill(); g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 1.5; g.stroke();
          }
          txt(String(i + 1), cx, L.y1 + 30, 14, 'rgba(255,255,255,.5)');
        }
        bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 30 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + moves + '/' + LIMIT, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };

  }
});
