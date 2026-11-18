/* Heimskringla, o orbe do mundo — solitário de pinos em triângulo (invenção). */
BTJogo.registrar({
  canvas: 'jogo-heimskringla',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os pinos do orbe",
    "sub": "Há 14 pinos e um buraco. Toque num pino e depois no buraco para onde ele deve pular, por cima de um pino vizinho, que sai do tabuleiro. Deixe no máximo 2 pinos antes de acabarem os lances possíveis, em até 240 segundos.",
    "perdeu": "Sobraram pinos demais ou o tempo acabou",
    "v1": "Quase nada sobrou no orbe!",
    "v2": "Heimskringla, atribuída a Snorri Sturluson por volta de 1230, tem o nome tirado das palavras iniciais da Ynglinga saga, \"o orbe da Terra\". Os pinos são invenção.",
    "h1": "Pinos",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The pegs of the orb",
    "sub": "There are 14 pegs and one hole. Tap a peg and then the hole it should jump to, over a neighbouring peg, which leaves the board. Leave at most 2 pegs before the possible moves run out, within 240 seconds.",
    "perdeu": "Too many pegs were left or time ran out",
    "v1": "Almost nothing is left on the orb!",
    "v2": "Heimskringla, attributed to Snorri Sturluson around 1230, takes its name from the opening words of the Ynglinga saga, \"the orb of the Earth\". The pegs are invented.",
    "h1": "Pegs",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Pinnene på kloden",
    "sub": "Det er 14 pinner og ett hull. Trykk på en pinne og deretter på hullet den skal hoppe til, over en nabopinne, som forsvinner fra brettet. La høyst 2 pinner stå igjen før de mulige trekkene er slutt, innen 240 sekunder.",
    "perdeu": "For mange pinner ble igjen eller tiden tok slutt",
    "v1": "Nesten ingenting er igjen på kloden!",
    "v2": "Heimskringla, tilskrevet Snorre Sturluson omkring 1230, har navnet fra åpningsordene i Ynglinga saga, «jordens krets». Pinnene er oppfunnet.",
    "h1": "Pinner",
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
    var LIM = 240, WINMAX = 2;
    var peg = [], sel = -1, t = 0, MV = [];
    var ID = function (r, c) { return r * (r + 1) / 2 + c; };
    (function () { var dirs = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [-1, -1]]; for (var r = 0; r < 5; r++) for (var c = 0; c <= r; c++) dirs.forEach(function (d) { var r1 = r + d[0], c1 = c + d[1], r2 = r + 2 * d[0], c2 = c + 2 * d[1]; if (r2 >= 0 && r2 < 5 && c2 >= 0 && c2 <= r2 && c1 >= 0 && c1 <= r1) MV.push([ID(r, c), ID(r1, c1), ID(r2, c2)]); }); })();
    function reset() { peg = []; for (var i = 0; i < 15; i++) peg.push(i !== 0); sel = -1; t = 0; st = 'play'; }
    function moves(from) { return MV.filter(function (m) { return peg[m[0]] && peg[m[1]] && !peg[m[2]] && (from === undefined || m[0] === from); }); }
    function count() { return peg.filter(Boolean).length; }
    function jump(m) { peg[m[0]] = false; peg[m[1]] = false; peg[m[2]] = true; sel = -1; if (api.nota) api.nota(300 + count() * 20, 0.1, 'triangle', 0.05); if (!moves().length) st = count() <= WINMAX ? 'win' : 'lose'; }
    function lay() { var W = api.w, H = api.h, dx = Math.max(34, Math.min((W - 30) / 5, (H - 130) / 5 / 0.87, 70)), dy = dx * 0.87; return { dx: dx, dy: dy, y0: 84 + Math.max(0, (H - 130 - dy * 4) / 2 - 20) }; }
    function pos(i) { var L = lay(), r = 0; while ((r + 1) * (r + 2) / 2 <= i) r++; var c = i - r * (r + 1) / 2; return { x: api.w / 2 + (c - r / 2) * L.dx, y: L.y0 + r * L.dy, r: Math.min(26, L.dx * 0.42) }; }
    function at(x, y) { for (var i = 0; i < 15; i++) { var p = pos(i); if (Math.abs(x - p.x) < p.r + 6 && Math.abs(y - p.y) < p.r + 6) return i; } return -1; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, peg: peg.slice(), sel: sel, t: t, pos: [].concat.apply([], [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(pos)]), mv: moves() }; },
      down: function (x, y) {
        if (menu()) return; if (st !== 'play') return; var i = at(x, y); if (i < 0) { sel = -1; return; }
        if (peg[i]) { sel = sel === i ? -1 : i; return; }
        if (sel >= 0) { var m = moves(sel).filter(function (q) { return q[2] === i; })[0]; if (m) jump(m); }
      },
      move: function () {}, up: function () {},
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } },
      update: function (dt) { if (st !== 'play') return; t += dt; if (t >= LIM) st = 'lose'; },
      draw: function () {
        var i; bg('#1a2438', '#080c16');
        var A = pos(0), B = pos(10), C = pos(14); g.fillStyle = 'rgba(240,226,190,.1)'; g.beginPath(); g.moveTo(A.x, A.y - 34); g.lineTo(C.x + 38, C.y + 32); g.lineTo(B.x - 38, B.y + 32); g.closePath(); g.fill();
        var tg = sel >= 0 ? moves(sel).map(function (m) { return m[2]; }) : [];
        for (i = 0; i < 15; i++) {
          var p = pos(i); g.beginPath(); g.arc(p.x, p.y, p.r, 0, 6.2832);
          if (peg[i]) { g.fillStyle = i === sel ? '#fff' : '#d9a93a'; g.fill(); g.lineWidth = 2; g.strokeStyle = 'rgba(0,0,0,.35)'; g.stroke(); }
          else { g.fillStyle = tg.indexOf(i) >= 0 ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.35)'; g.fill(); if (tg.indexOf(i) >= 0) { g.strokeStyle = '#fff'; g.lineWidth = 2; g.stroke(); } }
        }
        bar(api.w / 2 - 110, api.h - 14, 220, 5, (LIM - t) / LIM, LIM - t < 40 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + count(), T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };

  }
});
