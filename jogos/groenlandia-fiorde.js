/* A travessia do fiorde — pule de bloco em bloco de gelo até a outra margem. */
BTJogo.registrar({
  canvas: 'jogo-groenlandia',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A travessia do fiorde",
    "sub": "Atravesse o fiorde pulando de bloco em bloco de gelo, da margem de baixo até a de cima. Toque acima, abaixo ou ao lado de você (ou use as setas) para pular. Chegue três vezes à outra margem; no terceiro mergulho o jogo acaba.",
    "perdeu": "O fiorde engoliu você",
    "v1": "Do outro lado!",
    "v2": "Os nórdicos viveram na Groenlândia por séculos, em fazendas à beira de fiordes, como em Hvalsey. A travessia sobre o gelo é invenção do jogo.",
    "h1": "Travessias",
    "h2": "Mergulhos"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Crossing the fjord",
    "sub": "Cross the fjord by hopping from one ice floe to the next, from the bottom shore to the top one. Tap above, below or beside yourself (or use the arrows) to hop. Reach the far shore three times; the third dunking ends the game.",
    "perdeu": "The fjord swallowed you",
    "v1": "On the other side!",
    "v2": "The Norse lived in Greenland for centuries, on farms by the fjords, as at Hvalsey. Crossing on the ice is made up for the game.",
    "h1": "Crossings",
    "h2": "Dunkings"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Over fjorden",
    "sub": "Kryss fjorden ved å hoppe fra isflak til isflak, fra stranden nederst til stranden øverst. Trykk over, under eller ved siden av deg selv (eller bruk piltastene) for å hoppe. Kom deg til den andre stranden tre ganger; ved tredje dukkert er spillet over.",
    "perdeu": "Fjorden slukte deg",
    "v1": "På den andre siden!",
    "v2": "Nordboerne bodde på Grønland i flere hundre år, på gårder ved fjordene, som ved Hvalsey. Isovergangen er diktet opp for spillet.",
    "h1": "Kryssinger",
    "h2": "Dukkerter"
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
    var NEED = 3, MAXE = 3, LIM = 120, ROWS = 7;
    var LN = [{ d: 1, v: 52, P: 250, w: 120, o: 10 }, { d: -1, v: 74, P: 270, w: 100, o: 90 }, { d: 1, v: 62, P: 240, w: 125, o: 40 }, { d: -1, v: 88, P: 280, w: 96, o: 150 }, { d: 1, v: 68, P: 250, w: 112, o: 120 }];
    var row = 0, x = 225, tt = 0, crossed = 0, errs = 0, tmr = LIM, hop = 0, splash = 0, sx = 0, sy = 0;
    function lay() { var H = api.h, rh = Math.min(64, (H - 110) / ROWS); return { rh: rh, y0: (H - rh * ROWS) / 2 + 14 }; }
    function ry(r) { var L = lay(); return L.y0 + (ROWS - 1 - r) * L.rh + L.rh / 2; }
    function off(k) { var l = LN[k]; return l.o + l.d * l.v * tt; }
    function on(r, px, m) { if (r < 1 || r > 5) return true; var l = LN[r - 1], q = (((px - off(r - 1)) % l.P) + l.P) % l.P; return q > m && q < l.w - m; }
    function home() { row = 0; x = api.w / 2; }
    function setup() { crossed = 0; errs = 0; tmr = LIM; tt = 0; hop = 0; splash = 0; home(); }
    function reset() { setup(); st = 'play'; }
    function dunk() { splash = 0.6; sx = x; sy = ry(row); errs++; home(); if (errs >= MAXE) st = 'lose'; }
    function jump(dx, dy) {
      if (st !== 'play') return; hop = 0.12;
      if (dy) { row = Math.max(0, Math.min(ROWS - 1, row + dy)); } if (dx) x = Math.max(14, Math.min(api.w - 14, x + dx * 40));
      if (row === ROWS - 1) { crossed++; if (crossed >= NEED) { st = 'win'; return; } home(); return; }
      if (!on(row, x, 8)) dunk();
    }
    setup();
    return {
      pausar: function () {},
      dbg: function () { return { st: st, row: row, x: x, crossed: crossed, errs: errs, tmr: tmr, W: api.w, safe: function (r, px, m) { return on(r, px, m); }, dir: row >= 1 && row <= 5 ? LN[row - 1].d : 0 }; },
      down: function (px, py) { if (menu()) return; var dx = px - x, dy = py - ry(row); if (Math.abs(dx) > Math.abs(dy) * 1.2) jump(dx > 0 ? 1 : -1, 0); else jump(0, dy < 0 ? 1 : -1); },
      key: function (c, d) {
        if (!d) return;
        if (c === 'ArrowUp' || c === 'KeyW' || c === 'Space') { if (st !== 'play') menu(); else jump(0, 1); } else if (c === 'ArrowDown' || c === 'KeyS') jump(0, -1);
        else if (c === 'ArrowLeft' || c === 'KeyA') jump(-1, 0); else if (c === 'ArrowRight' || c === 'KeyD') jump(1, 0); else if (c === 'Enter' && st !== 'play') menu();
      },
      update: function (dt) {
        if (hop > 0) hop -= dt; if (splash > 0) splash -= dt;
        if (st !== 'play') return; tt += dt; tmr -= dt; if (tmr <= 0) { st = 'lose'; return; }
        if (row >= 1 && row <= 5) { x += LN[row - 1].d * LN[row - 1].v * dt; if (x < 0 || x > api.w) dunk(); }
      },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), r, k, i;
        bg('#0f3550', '#082035');
        for (r = 0; r < ROWS; r++) {
          var y = ry(r) - L.rh / 2;
          if (r === 0 || r === ROWS - 1) { g.fillStyle = r === 0 ? '#5a6a4a' : '#6a7a5a'; g.fillRect(0, y, W, L.rh); g.fillStyle = '#e8eef0'; for (i = 0; i < W; i += 46) g.fillRect(i + (r * 17) % 30, y + 3 + ((i / 46) % 3) * 6, 18, 4); if (r === ROWS - 1) { g.fillStyle = '#c9c2b0'; g.fillRect(W - 90, y - 4, 40, L.rh * 0.8); g.fillStyle = '#6b4a2a'; g.beginPath(); g.moveTo(W - 94, y - 4); g.lineTo(W - 70, y - 22); g.lineTo(W - 46, y - 4); g.fill(); } }
          else {
            var l = LN[r - 1], o = off(r - 1), st0 = Math.floor((-o) / l.P) - 1;
            for (k = st0; (k * l.P + o) < W + 10; k++) { var fx = o + k * l.P; if (fx + l.w < -10) continue; g.fillStyle = '#e4f1f6'; rr(fx, y + L.rh * 0.14, l.w, L.rh * 0.72, 12); g.fill(); g.fillStyle = 'rgba(120,170,200,.45)'; rr(fx + 6, y + L.rh * 0.56, l.w - 12, L.rh * 0.22, 8); g.fill(); }
          }
        }
        var py = ry(row) - (hop > 0 ? Math.sin(hop / 0.12 * Math.PI) * 10 : 0);
        if (splash > 0) { g.strokeStyle = 'rgba(255,255,255,.8)'; g.lineWidth = 3; g.beginPath(); g.arc(sx, sy, 10 + (0.6 - splash) * 60, 0, 6.29); g.stroke(); }
        else if (st !== 'menu') { g.fillStyle = '#b3261e'; g.beginPath(); g.ellipse(x, py + 4, 11, 13, 0, 0, 6.29); g.fill(); g.fillStyle = '#e0b08a'; g.beginPath(); g.arc(x, py - 12, 8, 0, 6.29); g.fill(); g.fillStyle = '#8a8f9a'; g.beginPath(); g.arc(x, py - 15, 8, 3.14, 6.29); g.fill(); }
        bar(W / 2 - 110, H - 16, 220, 5, tmr / LIM, tmr < 20 ? '#c0392b' : '#8ac4e0');
        hud(T.h1 + ' ' + crossed + '/' + NEED, T.h2 + ' ' + errs + '/' + MAXE, errs > 0);
        fim(st);
      }
    };
  }
});
