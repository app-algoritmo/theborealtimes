/* Heimskringla — semeie pedras pelas casas até guardar mais que o rival. */
BTJogo.registrar({
  canvas: 'jogo-landvaettir',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A semeadura dos guardiões",
    "sub": "Toque numa de suas 6 casas (embaixo) para pegar as pedras e semeá-las, uma por casa, para a direita e depois pelas casas do rival. Se a última cair no seu depósito, jogue de novo; se cair numa casa sua vazia, capture as pedras da casa oposta. Guarde mais que o rival.",
    "perdeu": "O rival guardou mais",
    "v1": "Você guardou mais pedras!",
    "v2": "Na Heimskringla, quatro guardiões protegem a Islândia de uma invasão. O jogo de semeadura é invenção.",
    "h1": "Placar",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The sowing of the guardians",
    "sub": "Tap one of your 6 pits (bottom) to pick up its stones and sow them, one per pit, to the right and then around the rival's pits. If the last one lands in your store, play again; if it lands in an empty pit of yours, capture the stones in the pit opposite. Store more than your rival.",
    "perdeu": "The rival stored more",
    "v1": "You stored more stones!",
    "v2": "In the Heimskringla, four guardians protect Iceland from an invasion. The sowing game is made up.",
    "h1": "Score",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Vernernes såing",
    "sub": "Trykk på en av dine 6 groper (nederst) for å ta steinene og så dem, én i hver grop, mot høyre og så rundt rivalens groper. Lander den siste i lageret ditt, spiller du på nytt; lander den i en tom grop hos deg, tar du steinene i gropen rett overfor. Lagre mer enn rivalen.",
    "perdeu": "Rivalen lagret mer",
    "v1": "Du lagret flere steiner!",
    "v2": "I Heimskringla vokter fire vesener Island mot en invasjon. Såespillet er diktet opp.",
    "h1": "Stilling",
    "h2": "Tid"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "La siembra de los guardianes",
    "sub": "Toca una de tus 6 casillas (abajo) para coger las piedras y sembrarlas, una por casilla, hacia la derecha y después por las casillas del rival. Si la última cae en tu depósito, juegas de nuevo; si cae en una casilla tuya vacía, capturas las piedras de la casilla opuesta. Guarda más que el rival.",
    "perdeu": "El rival guardó más",
    "v1": "¡Guardaste más piedras!",
    "v2": "En la Heimskringla, cuatro guardianes protegen Islandia de una invasión. El juego de siembra es un invento.",
    "h1": "Marcador",
    "h2": "Tiempo"
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
    var LIM = 240;
    var b = [], turn = 0, t = 0, aiT = 0, last = -1, lastT = 0, cur = 0, msg = '';
    function init() { b = []; for (var i = 0; i < 14; i++) b.push(i === 6 || i === 13 ? 0 : 4); }
    function sideEmpty(bb, s) { var lo = s ? 7 : 0, e = true; for (var i = lo; i < lo + 6; i++) if (bb[i]) e = false; return e; }
    function play(bb, i, s) { var n = bb[i], skip = s ? 6 : 13, store = s ? 13 : 6, p = i, extra = false; bb[i] = 0; while (n > 0) { p = (p + 1) % 14; if (p === skip) continue; bb[p]++; n--; } if (p === store) extra = true; else { var mine = s ? (p >= 7 && p <= 12) : (p >= 0 && p <= 5); if (mine && bb[p] === 1 && bb[12 - p] > 0) { bb[store] += bb[p] + bb[12 - p]; bb[p] = 0; bb[12 - p] = 0; } } return { p: p, extra: extra }; }
    function finish(bb) { if (sideEmpty(bb, 0) || sideEmpty(bb, 1)) { for (var i = 0; i < 6; i++) { bb[6] += bb[i]; bb[i] = 0; bb[13] += bb[7 + i]; bb[7 + i] = 0; } return true; } return false; }
    function ev(bb) { return bb[6] - bb[13]; }
    function ai() { var best = -1e9, cand = []; for (var i = 7; i <= 12; i++) { if (!b[i]) continue; var q = b.slice(), r = play(q, i, 1), sc = q[13] - q[6] + (r.extra ? 2.5 : 0); if (!r.extra) { var worst = 1e9; for (var j = 0; j < 6; j++) { if (!q[j]) continue; var q2 = q.slice(), r2 = play(q2, j, 0); worst = Math.min(worst, q2[13] - q2[6] - (r2.extra ? 2 : 0)); } if (worst < 1e9) sc = 0.5 * sc + 0.5 * worst; } sc += Math.random() * 3.5; cand.push([sc, i]); } cand.sort(function (a, c) { return c[0] - a[0]; }); return cand.length ? cand[0][1] : -1; }
    function setup() { init(); turn = 0; t = 0; aiT = 0; last = -1; lastT = 0; }
    function reset() { setup(); st = 'play'; }
    function endCheck() { if (finish(b)) { st = b[6] > b[13] ? 'win' : 'lose'; return true; } return false; }
    function mine(i) { if (st !== 'play' || turn !== 0 || !b[i]) return; var r = play(b, i, 0); last = r.p; lastT = 0.6; if (api.nota) api.nota(300 + b[6] * 10, 0.06, 'triangle', 0.05); if (endCheck()) return; if (!r.extra) { turn = 1; aiT = 0.9; } }
    setup();
    function lay() { var W = api.w, H = api.h, cs = Math.max(36, Math.min((W - 24) / 8, (H - 190) / 2.6, 84)); return { cs: cs, x: (W - cs * 8) / 2, y: Math.max(96, (H - cs * 2.4) / 2 + 6) }; }
    function pitPos(i) { var L = lay(); if (i === 6) return { x: L.x + 7.5 * L.cs, y: L.y + L.cs * 1.1 }; if (i === 13) return { x: L.x + 0.5 * L.cs, y: L.y + L.cs * 1.1 }; if (i < 6) return { x: L.x + (i + 1.5) * L.cs, y: L.y + L.cs * 1.7 }; return { x: L.x + (12 - i + 1.5) * L.cs, y: L.y + L.cs * 0.5 }; }
    return {
      pausar: function () {},
      dbg: function () { return { st: st, b: b.slice(), turn: turn, busy: turn !== 0, t: t, tmr: LIM - t, pos: pitPos }; },
      down: function (x, y) { if (menu()) return; var L = lay(); for (var i = 0; i < 6; i++) { var p = pitPos(i); if (Math.hypot(p.x - x, p.y - y) < L.cs * 0.5) { cur = i; mine(i); return; } } },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'ArrowLeft') cur = (cur + 5) % 6; else if (k === 'ArrowRight') cur = (cur + 1) % 6; else if (/^Digit[1-6]$/.test(k)) { cur = +k.slice(5) - 1; mine(cur); } else if (k === 'Space' || k === 'Enter') mine(cur); },
      update: function (dt) { if (lastT > 0) lastT -= dt; if (st !== 'play') return; t += dt; if (t >= LIM) { t = LIM; st = 'lose'; return; } if (turn === 1) { aiT -= dt; if (aiT <= 0) { var i = ai(); if (i < 0) { turn = 0; endCheck(); return; } var r = play(b, i, 1); last = r.p; lastT = 0.6; if (endCheck()) return; if (r.extra && !sideEmpty(b, 1)) aiT = 0.9; else turn = 0; if (turn === 0 && sideEmpty(b, 0)) endCheck(); } } },
      draw: function () {
        var L = lay(), W = api.w, H = api.h, i;
        bg('#1a2a2a', '#050a0a');
        g.fillStyle = 'rgba(0,0,0,.35)'; rr(L.x, L.y, L.cs * 8, L.cs * 2.2, 18); g.fill();
        for (i = 0; i < 14; i++) { var p = pitPos(i), store = i === 6 || i === 13, rw = store ? L.cs * 0.8 : L.cs * 0.84, rh = store ? L.cs * 1.7 : L.cs * 0.84;
          g.fillStyle = i < 6 ? 'rgba(127,168,106,.3)' : i < 13 && i > 6 ? 'rgba(192,57,43,.28)' : 'rgba(255,255,255,.1)'; rr(p.x - rw / 2, p.y - rh / 2, rw, rh, 14); g.fill();
          if (last === i && lastT > 0) { g.strokeStyle = '#ffd88a'; g.lineWidth = 3; rr(p.x - rw / 2, p.y - rh / 2, rw, rh, 14); g.stroke(); }
          if (cur === i && i < 6 && st === 'play' && turn === 0) { g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 2; rr(p.x - rw / 2 - 2, p.y - rh / 2 - 2, rw + 4, rh + 4, 16); g.stroke(); }
          txt(String(b[i]), p.x, p.y + L.cs * 0.12, L.cs * (store ? 0.5 : 0.42), b[i] ? '#fff' : 'rgba(255,255,255,.3)'); }
        hud(T.h1 + ' ' + b[6] + ' – ' + b[13], T.h2 + ' ' + Math.ceil(LIM - t), false);
        fim(st);
      }
    };
  }
});
