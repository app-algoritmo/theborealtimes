/* Kormáks saga — semeie as covas e vença o rival (invenção). */
BTJogo.registrar({
  canvas: 'jogo-kormak',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As covas de Kormákr",
    "sub": "Seis covas suas, na fileira de baixo, e seis do rival, na de cima; cada cova começa com 4 sementes. Toque numa cova sua para recolher as sementes e semear uma a uma no sentido anti-horário (para a direita embaixo e para a esquerda em cima), passando pelo seu cofre, à direita, e nunca pelo do rival. Se a última semente cair no seu cofre, você joga de novo. Se cair numa cova sua vazia, você leva essa semente e as da cova oposta. O jogo acaba quando uma fileira esvazia, e quem tiver mais sementes no cofre vence. (Teclado: teclas 1 a 6.)",
    "perdeu": "O rival terminou com tantas sementes quanto você ou mais",
    "v1": "Você levou mais sementes!",
    "v2": "A Kormáks saga conta que Kormákr, poeta islandês do século X, ama Steingerðr; por causa de uma maldição ele chega tarde ao casamento e ela se casa com outro. O jogo de sementes com o rival é invenção.",
    "h1": "Seu cofre",
    "h2": "Tempo",
    "g0": "Rival"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Kormákr's pits",
    "sub": "Six pits are yours, in the bottom row, and six are your rival's, in the top row; each pit starts with 4 seeds. Tap one of your pits to pick up its seeds and sow them one by one counter-clockwise (to the right along the bottom and to the left along the top), passing through your store, on the right, and never your rival's. If the last seed lands in your store, you play again. If it lands in an empty pit of yours, you take that seed and the seeds in the opposite pit. The game ends when a row is empty, and whoever has more seeds in the store wins. (Keyboard: keys 1 to 6.)",
    "perdeu": "The rival finished with as many seeds as you or more",
    "v1": "You took more seeds!",
    "v2": "The Kormáks saga tells how Kormákr, an Icelandic poet of the 10th century, loves Steingerðr; because of a curse he arrives late for the wedding and she marries another man. The seed game with the rival is invented.",
    "h1": "Your store",
    "h2": "Time",
    "g0": "Rival"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Kormáks groper",
    "sub": "Seks groper er dine, i den nederste raden, og seks er rivalens, i den øverste; hver grop starter med 4 frø. Trykk på en av gropene dine for å ta opp frøene og så dem ett og ett mot klokka (til høyre langs bunnen og til venstre langs toppen), gjennom kassa di til høyre og aldri rivalens. Havner det siste frøet i kassa di, spiller du igjen. Havner det i en tom grop hos deg, tar du det frøet og frøene i gropen rett overfor. Spillet er slutt når en rad er tom, og den med flest frø i kassa vinner. (Tastatur: tast 1 til 6.)",
    "perdeu": "Rivalen endte med like mange frø som deg eller flere",
    "v1": "Du tok flest frø!",
    "v2": "Kormáks saga forteller at Kormákr, en islandsk skald fra 900-tallet, elsker Steingerðr; på grunn av en forbannelse kommer han for sent til bryllupet, og hun gifter seg med en annen. Frøspillet mot rivalen er oppfunnet.",
    "h1": "Din kasse",
    "h2": "Tid",
    "g0": "Rival"
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
    var LIM = 360, AID = 3;
    var b = [], turn = 0, aiT = 0, t = 0, over = false;
    function sow(bd, p, pl) {
      bd = bd.slice(); var n = bd[p], i = p, ms = pl === 0 ? 6 : 13, sk = pl === 0 ? 13 : 6; bd[p] = 0;
      while (n > 0) { i = (i + 1) % 14; if (i === sk) continue; bd[i]++; n--; }
      var own = pl === 0 ? i <= 5 : (i >= 7 && i <= 12);
      if (own && i !== ms && bd[i] === 1 && bd[12 - i] > 0) { bd[ms] += bd[i] + bd[12 - i]; bd[i] = 0; bd[12 - i] = 0; }
      return { b: bd, extra: i === ms };
    }
    function sumr(bd, a, z) { var s = 0; for (var i = a; i <= z; i++) s += bd[i]; return s; }
    function fin(bd) { if (sumr(bd, 0, 5) === 0 || sumr(bd, 7, 12) === 0) { bd[6] += sumr(bd, 0, 5); bd[13] += sumr(bd, 7, 12); for (var i = 0; i < 6; i++) { bd[i] = 0; bd[i + 7] = 0; } return true; } return false; }
    function moves(bd, pl) { var o = [], i, a = pl === 0 ? 0 : 7; for (i = a; i < a + 6; i++) if (bd[i] > 0) o.push(i); return o; }
    function mm(bd, pl, d, al, be) {
      if (d === 0) return bd[6] - bd[13];
      var ms = moves(bd, pl), i, best = pl === 0 ? -1e9 : 1e9;
      for (i = 0; i < ms.length; i++) {
        var r = sow(bd, ms[i], pl), nb = r.b, v;
        if (fin(nb)) v = nb[6] - nb[13]; else v = mm(nb, r.extra ? pl : 1 - pl, d - 1, al, be);
        if (pl === 0) { if (v > best) best = v; if (best > al) al = best; } else { if (v < best) best = v; if (best < be) be = best; }
        if (be <= al) break;
      }
      return best;
    }
    function aiMove() {
      var ms = moves(b, 1), i, bestv = 1e9, pick = [];
      for (i = 0; i < ms.length; i++) {
        var r = sow(b, ms[i], 1), nb = r.b, v;
        if (fin(nb)) v = nb[6] - nb[13]; else v = mm(nb, r.extra ? 1 : 0, AID, -1e9, 1e9);
        if (v < bestv) { bestv = v; pick = [ms[i]]; } else if (v === bestv) pick.push(ms[i]);
      }
      var p = pick[Math.floor(Math.random() * pick.length)], r2 = sow(b, p, 1); b = r2.b;
      if (api.nota) api.nota(200, 0.1, 'sine', 0.05);
      if (fin(b)) { endg(); return; }
      if (r2.extra) aiT = 0.8; else turn = 0;
    }
    function endg() { over = true; st = b[6] > b[13] ? 'win' : 'lose'; }
    function reset() { b = [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0]; turn = 0; aiT = 0; t = 0; over = false; st = 'play'; }
    function play(p) {
      if (st !== 'play' || turn !== 0 || b[p] === 0) return;
      var r = sow(b, p, 0); b = r.b; if (api.nota) api.nota(330, 0.1, 'triangle', 0.05);
      if (fin(b)) { endg(); return; }
      if (!r.extra) { turn = 1; aiT = 0.8; }
    }
    function lay() { var W = api.w, H = api.h, sp = Math.min(66, (W - 20) / 8), rad = sp * 0.42; return { sp: sp, rad: rad, cx: W / 2, ty: H * 0.36, by: H * 0.62, sy: H * 0.49, sh: (H * 0.62 - H * 0.36) + rad * 2 }; }
    function ppos(i) { var L = lay(); if (i <= 5) return { x: L.cx + (i - 2.5) * L.sp, y: L.by }; if (i === 6) return { x: L.cx + 3.5 * L.sp, y: L.sy }; if (i === 13) return { x: L.cx - 3.5 * L.sp, y: L.sy }; return { x: L.cx + (12 - i - 2.5) * L.sp, y: L.ty }; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, b: b.slice(), turn: turn, pos: [0, 1, 2, 3, 4, 5].map(ppos), t: t }; },
      down: function (x, y) { if (menu()) return; var L = lay(), i; for (i = 0; i < 6; i++) { var p = ppos(i); if (Math.abs(x - p.x) < L.sp / 2 && Math.abs(y - p.y) < L.sp / 2 + 10) { play(i); return; } } },
      move: function () {}, up: function () {},
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } var m = { Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3, Digit5: 4, Digit6: 5, Numpad1: 0, Numpad2: 1, Numpad3: 2, Numpad4: 3, Numpad5: 4, Numpad6: 5 }[k]; if (m !== undefined) play(m); },
      update: function (dt) {
        if (st !== 'play') return; t += dt;
        if (turn === 1) { aiT -= dt; if (aiT <= 0) aiMove(); }
        if (st === 'play' && t >= LIM) st = 'lose';
      },
      draw: function () {
        var L = lay(), i; bg('#2a2018', '#0e0a07');
        g.fillStyle = 'rgba(90,60,30,.55)'; rr(L.cx - 4.1 * L.sp, L.sy - L.sh / 2, 8.2 * L.sp, L.sh, 18); g.fill();
        for (i = 0; i < 14; i++) {
          var p = ppos(i), store = i === 6 || i === 13;
          g.beginPath();
          if (store) { rr(p.x - L.sp * 0.42, p.y - L.sh / 2 + 8, L.sp * 0.84, L.sh - 16, 14); } else g.arc(p.x, p.y, L.rad, 0, 6.2832);
          g.fillStyle = store ? 'rgba(0,0,0,.35)' : (i <= 5 && turn === 0 && b[i] > 0 && st === 'play' ? 'rgba(255,216,138,.3)' : 'rgba(0,0,0,.4)'); g.fill();
          g.strokeStyle = i <= 6 ? 'rgba(255,216,138,.55)' : 'rgba(201,179,242,.5)'; g.lineWidth = 1.5; g.stroke();
          txt(String(b[i]), p.x, p.y + (store ? 8 : 6), store ? 26 : 20, '#f3ecd2');
        }
        txt(T.g0, ppos(13).x, L.sy - L.sh / 2 - 6, 12, '#c9b3f2');
        bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 60 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + b[6], T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };

  }
});
