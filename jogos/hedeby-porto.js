/* O porto de Hedeby — empilhe as caixas no cais. */
BTJogo.registrar({
  canvas: 'jogo-hedeby',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O porto de Hedeby",
    "sub": "O guindaste balança a caixa. Toque para soltá-la sobre a pilha: a parte que sobra para fora cai no mar. Empilhe oito caixas sem errar o cais por completo.",
    "perdeu": "A carga caiu no mar",
    "v1": "Carga em ordem!",
    "v2": "Hedeby foi um grande porto de comércio, ativo entre o século VIII e meados do XI. A pilha e o guindaste do jogo são invenção.",
    "h1": "Caixas"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The port of Hedeby",
    "sub": "The crane swings a crate. Tap to drop it onto the stack: any part that overhangs falls into the sea. Stack eight crates without missing the quay entirely.",
    "perdeu": "The cargo fell into the sea",
    "v1": "Cargo in order!",
    "v2": "Hedeby was a great trading port, active from the 8th century to the mid-11th. The stack and the crane in the game are made up.",
    "h1": "Crates"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Havnen i Hedeby",
    "sub": "Kranen svinger en kasse. Trykk for å slippe den på stabelen: det som henger utenfor, faller i sjøen. Stable åtte kasser uten å bomme helt på kaia.",
    "perdeu": "Lasten falt i sjøen",
    "v1": "Lasten er i orden!",
    "v2": "Hedeby var en stor handelshavn, i bruk fra 700-tallet til midten av 1000-tallet. Stabelen og kranen i spillet er diktet opp.",
    "h1": "Kasser"
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
    var GOAL = 8, BH = 32;
    var stack = [], t = 0, cw = 0, drop = 0, fall = null;
    function amp() { return Math.min(api.w * 0.34, 260); }
    function sx() { return api.w / 2 + Math.sin(t * (1.5 + stack.length * 0.18)) * amp(); }
    function gnd() { return api.h - 40; }
    function reset() { st = 'play'; t = 0; stack = [{ x: api.w / 2, w: 190 }]; cw = 190; fall = null; }
    function place() {
      if (fall) return;
      var top = stack[stack.length - 1], cx = sx(), l = Math.max(cx - cw / 2, top.x - top.w / 2), r = Math.min(cx + cw / 2, top.x + top.w / 2), ov = r - l;
      if (ov < 8) { st = 'lose'; return; }
      var nx = (l + r) / 2, nw = ov;
      if (Math.abs(cx - top.x) < 6) { nx = top.x; nw = cw; }
      stack.push({ x: nx, w: nw }); cw = nw;
      if (stack.length - 1 >= GOAL) st = 'win';
    }
    return {
      pausar: function () {},
      dbg: function () { return { st: st, sx: sx(), topx: stack[stack.length - 1].x, topw: stack[stack.length - 1].w, cw: cw, n: stack.length - 1 }; },
      down: function () { if (menu()) return; place(); },
      key: function (c, d) { if (!d) return; if (st !== 'play') { if (c === 'Space' || c === 'Enter') menu(); return; } if (c === 'Space' || c === 'ArrowDown') place(); },
      update: function (dt) { if (st === 'play') t += dt; },
      draw: function () {
        var W = api.w, H = api.h, G = gnd();
        bg('#3a5f7a', '#a8c4d4');
        g.fillStyle = '#25506a'; g.fillRect(0, G, W, H - G); g.fillStyle = '#6b4a2e'; g.fillRect(W / 2 - 130, G - 6, 260, 10);
        stack.forEach(function (b, i) { if (i === 0) return; var y = G - i * BH - 6; g.fillStyle = i % 2 ? '#b07a3a' : '#9a6a2e'; g.fillRect(b.x - b.w / 2, y, b.w, BH - 2); g.strokeStyle = '#5a3a14'; g.lineWidth = 2; g.strokeRect(b.x - b.w / 2, y, b.w, BH - 2); g.beginPath(); g.moveTo(b.x - b.w / 2, y); g.lineTo(b.x + b.w / 2, y + BH - 2); g.stroke(); });
        if (st === 'play') { var y = G - stack.length * BH - 6 - 40, x = sx(); g.strokeStyle = '#3a2a14'; g.lineWidth = 3; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, y); g.stroke(); g.fillStyle = '#b07a3a'; g.fillRect(x - cw / 2, y, cw, BH - 2); g.strokeStyle = '#5a3a14'; g.strokeRect(x - cw / 2, y, cw, BH - 2); }
        hud(T.h1 + ' ' + (stack.length - 1) + '/' + GOAL);
        fim(st);
      }
    };
  }
});
