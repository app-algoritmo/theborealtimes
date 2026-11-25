/* Alvíssmál — empilhe as perguntas até o sol nascer. */
BTJogo.registrar({
  canvas: 'jogo-alvissmal',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As perguntas de Thor",
    "sub": "Um bloco de pergunta corre de um lado a outro. Toque (ou use o espaço) para soltá-lo sobre a torre: o que ficar fora do bloco de baixo é cortado. Empilhe 14 perguntas antes do sol nascer, sem deixar a torre sumir.",
    "perdeu": "O sol nasceu primeiro",
    "v1": "Você segurou o anão até o amanhecer!",
    "v2": "No poema Alvíssmál, Thor segura o anão com perguntas até a luz entrar. O jogo de empilhar é invenção.",
    "h1": "Perguntas",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Thor's questions",
    "sub": "A question block slides from side to side. Tap (or press Space) to drop it on the tower: whatever sticks out past the block below is cut off. Stack 14 questions before the sun rises, without letting the tower vanish.",
    "perdeu": "The sun rose first",
    "v1": "You kept the dwarf talking until dawn!",
    "v2": "In the poem Alvíssmál, Thor holds the dwarf with questions until the light comes in. The stacking game is made up.",
    "h1": "Questions",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Tors spørsmål",
    "sub": "En spørsmålsblokk glir fra side til side. Trykk (eller mellomrom) for å slippe den på tårnet: det som stikker utenfor blokken under, kuttes av. Stable 14 spørsmål før sola står opp, uten at tårnet forsvinner.",
    "perdeu": "Sola stod opp først",
    "v1": "Du holdt dvergen i prat til daggry!",
    "v2": "I diktet Alvíssmál holder Tor dvergen fast med spørsmål til lyset kommer inn. Stablespillet er diktet opp.",
    "h1": "Spørsmål",
    "h2": "Tid"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "Las preguntas de Thor",
    "sub": "Un bloque de pregunta corre de un lado a otro. Toca (o usa el espacio) para soltarlo sobre la torre: lo que quede fuera del bloque de abajo se corta. Apila 14 preguntas antes de que salga el sol, sin dejar que la torre desaparezca.",
    "perdeu": "El sol salió primero",
    "v1": "¡Retuviste al enano hasta el amanecer!",
    "v2": "En el poema Alvíssmál, Thor retiene al enano con preguntas hasta que entra la luz. El juego de apilar es invención.",
    "h1": "Preguntas",
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
    var GOAL = 14, LIM = 80, BH = 24;
    var tw = [], bx2 = 0, bw = 0, dir = 1, lvl = 0, tmr = LIM, cut = [], pop = 0, spd = 150, flashp = 0;
    function lay() { var W = api.w, H = api.h; return { W: W, base: H - 58, cam: Math.max(0, (lvl + 1) * BH - (H - 250)) }; }
    function setup() { var W = api.w, w0 = Math.min(150, W * 0.38); tw = [{ x: (W - w0) / 2, w: w0 }]; lvl = 0; bw = w0; bx2 = 0; dir = 1; tmr = LIM; cut = []; spd = 170; flashp = 0; }
    function reset() { setup(); st = 'play'; }
    function drop() {
      if (st !== 'play') return; var top = tw[tw.length - 1], x = bx2, ov = Math.min(x + bw, top.x + top.w) - Math.max(x, top.x);
      if (ov <= 2) { cut.push({ x: x, w: bw, y: 0, v: 0, lv: lvl + 1 }); st = 'lose'; return; }
      var nx, nw; if (Math.abs(x - top.x) < 5) { nx = top.x; nw = top.w; flashp = 0.4; if (api.nota) api.nota(700, 0.1, 'triangle', 0.06); }
      else { nx = Math.max(x, top.x); nw = ov; if (x < top.x) cut.push({ x: x, w: top.x - x, y: 0, v: 0, lv: lvl + 1 }); else cut.push({ x: top.x + top.w, w: x + bw - top.x - top.w, y: 0, v: 0, lv: lvl + 1 }); if (api.nota) api.nota(360, 0.06, 'square', 0.05); }
      tw.push({ x: nx, w: nw }); lvl++; bw = nw; spd = 170 + lvl * 18; if (lvl >= GOAL) { st = 'win'; return; }
    }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var top = tw[tw.length - 1]; return { st: st, x: bx2, w: bw, topx: top.x, topw: top.w, lvl: lvl, spd: spd, dir: dir }; },
      down: function (x, y) { if (menu()) return; drop(); },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'Space' || k === 'Enter' || k === 'ArrowDown' || k === 'ArrowUp') drop(); },
      update: function (dt) {
        pop += dt; if (flashp > 0) flashp -= dt; cut.forEach(function (c) { c.v += 900 * dt; c.y += c.v * dt; }); cut = cut.filter(function (c) { return c.y < 600; });
        if (st !== 'play') return; tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; return; }
        var W = api.w; bx2 += dir * spd * dt; if (bx2 < 0) { bx2 = 0; dir = 1; } if (bx2 + bw > W) { bx2 = W - bw; dir = -1; }
      },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), i, k = lvl / GOAL;
        var g1 = g.createLinearGradient(0, 0, 0, H); g1.addColorStop(0, 'rgb(' + Math.floor(20 + 200 * k) + ',' + Math.floor(20 + 110 * k) + ',' + Math.floor(50 + 20 * k) + ')'); g1.addColorStop(1, '#0a0a14'); g.fillStyle = g1; g.fillRect(0, 0, W, H);
        g.fillStyle = 'rgba(255,200,90,' + (0.15 + 0.7 * k) + ')'; g.beginPath(); g.arc(W / 2, H - 120 - k * (H - 260), 28 + 10 * k, 0, 6.283); g.fill();
        for (i = 0; i < tw.length; i++) { var b = tw[i], y = L.base - i * BH + L.cam; g.fillStyle = i === 0 ? '#5a4a3a' : 'hsl(' + (30 + i * 9) + ',45%,' + (46 + (flashp > 0 && i === tw.length - 1 ? 14 : 0)) + '%)'; rr(b.x, y, b.w, BH - 2, 4); g.fill(); if (i > 0 && b.w > 20) txt('?', b.x + b.w / 2, y + BH - 7, 15, 'rgba(0,0,0,.45)'); }
        if (st === 'play') { var yy = L.base - tw.length * BH + L.cam; g.fillStyle = '#ffd88a'; rr(bx2, yy, bw, BH - 2, 4); g.fill(); txt('?', bx2 + bw / 2, yy + BH - 7, 15, 'rgba(0,0,0,.5)'); }
        cut.forEach(function (c) { var yy2 = L.base - (c.lv) * BH + L.cam + c.y; g.fillStyle = 'rgba(255,216,138,.7)'; g.fillRect(c.x, yy2, c.w, BH - 2); });
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 15 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + lvl + '/' + GOAL, T.h2 + ' ' + Math.ceil(tmr), false);
        fim(st);
      }
    };
  }
});
