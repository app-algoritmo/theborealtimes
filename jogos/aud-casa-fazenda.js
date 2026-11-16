/* Laxdæla saga — erga a casa da fazenda de Aud, tábua sobre tábua. */
BTJogo.registrar({
  canvas: 'jogo-aud',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A casa de Aud",
    "sub": "Uma tábua vai e vem no alto. Toque (ou use a barra de espaço) para soltá-la sobre a anterior: o que sobrar para fora é cortado. Empilhe 12 tábuas antes que o tempo acabe.",
    "perdeu": "A tábua caiu ou o tempo acabou",
    "v1": "A casa está de pé!",
    "v2": "Na Laxdæla saga, Aud, a Profunda, funda uma fazenda na Islândia. A construção por tábuas empilhadas é invenção.",
    "h1": "Tábuas",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Aud's house",
    "sub": "A plank slides back and forth above. Tap (or press the space bar) to drop it on the previous one: whatever hangs over is cut off. Stack 12 planks before the time runs out.",
    "perdeu": "The plank fell or the time ran out",
    "v1": "The house is standing!",
    "v2": "In the Laxdæla saga, Aud the Deep-Minded founds a farm in Iceland. The building by stacked planks is made up.",
    "h1": "Planks",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Auds hus",
    "sub": "En planke glir fram og tilbake oppe. Trykk (eller bruk mellomromstasten) for å slippe den ned på den forrige: det som stikker utenfor, kappes bort. Stable 12 planker før tiden går ut.",
    "perdeu": "Planken falt eller tiden gikk ut",
    "v1": "Huset står!",
    "v2": "I Laxdæla saga grunnlegger Aud den djuptenkte en gård på Island. Byggingen med stablede planker er diktet opp.",
    "h1": "Planker",
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
    var GOAL = 12, LIM = 70, START = 150;
    var stack = [], cx = 0, dir = 1, w = START, t = 0, fall = null, snapT = 0;
    function lay() { var W = api.w, H = api.h, s = Math.max(0.8, Math.min(1.4, Math.min(W, H) / 450)); return { W: W, H: H, s: s, th: 26 * s, floor: H - 30, span: Math.min(W - 40, 460) }; }
    function setup() { var L = lay(); stack = [{ x: L.W / 2, w: START * L.s }]; w = START * L.s; cx = L.W / 2 - L.span / 2; dir = 1; t = 0; fall = null; snapT = 0; }
    function reset() { setup(); st = 'play'; }
    function speed() { var L = lay(); return (170 + stack.length * 30) * L.s; }
    function drop() { if (st !== 'play') return; var L = lay(), top = stack[stack.length - 1], a = Math.max(cx - w / 2, top.x - top.w / 2), b = Math.min(cx + w / 2, top.x + top.w / 2);
      var off = Math.abs(cx - top.x); var nw, nx; if (off < 7 * L.s) { nw = top.w; nx = top.x; snapT = 0.4; } else { nw = b - a; nx = (a + b) / 2; }
      if (nw < 6) { st = 'lose'; fall = { x: cx, w: w }; if (api.nota) api.nota(110, 0.3, 'sawtooth', 0.07); return; }
      stack.push({ x: nx, w: nw }); w = nw; if (api.nota) api.nota(300 + stack.length * 25, 0.07, 'triangle', 0.05);
      if (stack.length - 1 >= GOAL) { st = 'win'; return; } }
    setup();
    return {
      pausar: function () {},
      dbg: function () { return { st: st, cx: cx, w: w, topx: stack[stack.length - 1].x, topw: stack[stack.length - 1].w, n: stack.length - 1, goal: GOAL, t: t, tmr: LIM - t }; },
      down: function (x, y) { if (menu()) return; drop(); },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'Space' || k === 'Enter' || k === 'ArrowDown') drop(); },
      update: function (dt) { if (snapT > 0) snapT -= dt; if (st !== 'play') return; t += dt; if (t >= LIM) { st = 'lose'; return; } var L = lay(), lo = L.W / 2 - L.span / 2, hi = L.W / 2 + L.span / 2; cx += dir * speed() * dt; if (cx > hi) { cx = hi; dir = -1; } if (cx < lo) { cx = lo; dir = 1; } },
      draw: function () {
        var L = lay(), W = L.W, H = L.H, i;
        bg('#16212e', '#05080c');
        var n = stack.length, shift = Math.max(0, (n - 9)) * L.th;
        g.fillStyle = '#2a3a2a'; g.fillRect(0, L.floor + L.th + shift, W, H);
        for (i = 0; i < n; i++) { var p = stack[i], y = L.floor - i * L.th + shift; g.fillStyle = i % 2 ? '#a07a4a' : '#8a6a3c'; g.fillRect(p.x - p.w / 2, y, p.w, L.th - 2); g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(p.x - p.w / 2, y + L.th - 6, p.w, 4); }
        if (st === 'play') { var y2 = L.floor - n * L.th + shift; g.fillStyle = '#c9a060'; g.fillRect(cx - w / 2, y2, w, L.th - 2); }
        if (fall) { g.fillStyle = '#c9a060'; g.fillRect(fall.x - fall.w / 2, L.floor - n * L.th + shift + 30, fall.w, L.th - 2); }
        if (snapT > 0) { g.strokeStyle = 'rgba(255,216,138,' + snapT * 2 + ')'; g.lineWidth = 3; g.strokeRect(stack[n - 1].x - stack[n - 1].w / 2, L.floor - (n - 1) * L.th + shift, stack[n - 1].w, L.th - 2); }
        hud(T.h1 + ' ' + (n - 1) + '/' + GOAL, T.h2 + ' ' + Math.ceil(LIM - t), false);
        fim(st);
      }
    };
  }
});
