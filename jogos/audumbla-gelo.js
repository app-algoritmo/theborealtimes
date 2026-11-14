/* O gelo de Auðumbla — derreta o gelo e revele o primeiro homem. */
BTJogo.registrar({
  canvas: 'jogo-audumbla',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O gelo de Auðumbla",
    "sub": "Arraste o dedo (ou o mouse; com o teclado, use as setas e segure a barra de espaço) sobre o gelo para lambê-lo e derretê-lo. Sob o gelo há uma forma: primeiro os cabelos, depois a cabeça, por fim o homem inteiro. Revele a forma sem derreter gelo demais ao redor, em vinte e cinco segundos por rodada. Três rodadas perdidas e o jogo termina.",
    "perdeu": "O gelo ficou sem forma",
    "v1": "Búri saiu do gelo!",
    "v2": "Na Edda em Prosa, a vaca Auðumbla lambeu o gelo salgado e, em três dias, surgiu Búri, avô de Odin. As rodadas do jogo são invenção.",
    "h1": "Rodadas",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Auðumbla's ice",
    "sub": "Drag your finger (or the mouse; with the keyboard, use the arrows and hold the space bar) over the ice to lick and melt it. Under the ice is a shape: first the hair, then the head, finally the whole man. Reveal the shape without melting too much ice around it, in twenty-five seconds per round. Three lost rounds end the game.",
    "perdeu": "The ice lost its shape",
    "v1": "Búri came out of the ice!",
    "v2": "In the Prose Edda, the cow Auðumbla licked the salty ice and, in three days, Búri appeared, Odin's grandfather. The rounds in the game are made up.",
    "h1": "Rounds",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Auðumblas is",
    "sub": "Dra fingeren (eller musa; med tastatur bruker du piltastene og holder inne mellomromstasten) over isen for å slikke og smelte den. Under isen ligger en form: først håret, så hodet, til slutt hele mannen. Avdekk formen uten å smelte for mye is rundt, på tjuefem sekunder per runde. Tre tapte runder avslutter spillet.",
    "perdeu": "Isen mistet formen",
    "v1": "Bure kom ut av isen!",
    "v2": "I Snorres Edda slikket kua Auðumbla den salte isen, og på tre dager kom Bure til syne, Odins bestefar. Rundene i spillet er diktet opp.",
    "h1": "Runder",
    "h2": "Feil"
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
    var NR = 3, MAXE = 3, LIM = 25, CELL = 12, BR = 24;
    var rd = 0, errs = 0, tl = 0, cols = 0, rows = 0, ice = [], sil = [], nsil = 0, nout = 0, mel = 0, wst = 0, ax = 0, ay = 0, aw = 0, ah = 0, px = 0, py = 0, press = false, kx = 0, ky = 0, kh = false, fl = 0;
    function inS(r, u, v) {
      /* u,v em [-1,1] dentro da area */
      if (r === 0) { return [-0.35, 0, 0.35].some(function (c) { return Math.pow((u - c) / 0.08, 2) + Math.pow((v + 0.35) / 0.32, 2) < 1; }); }
      if (r === 1) { return Math.pow(u / 0.32, 2) + Math.pow((v + 0.1) / 0.42, 2) < 1 || (Math.abs(u) < 0.12 && v > 0.2 && v < 0.5); }
      return Math.pow(u / 0.18, 2) + Math.pow((v + 0.5) / 0.2, 2) < 1 || (Math.pow(u / 0.28, 2) + Math.pow((v - 0.0) / 0.38, 2) < 1) || (Math.abs(u) < 0.45 && Math.abs(v + 0.1) < 0.08) || (Math.abs(u) < 0.16 && v > 0.3 && v < 0.85);
    }
    function montar() {
      var W = api.w, H = api.h; aw = Math.min(W * 0.84, 560); ah = Math.min(H * 0.7, 360); ax = (W - aw) / 2; ay = H * 0.18; cols = Math.floor(aw / CELL); rows = Math.floor(ah / CELL);
      ice = []; sil = []; nsil = 0; nout = 0; mel = 0; wst = 0;
      for (var j = 0; j < rows; j++) for (var i = 0; i < cols; i++) { var u = (i + 0.5) / cols * 2 - 1, v = (j + 0.5) / rows * 2 - 1, s = inS(rd, u, v); ice.push(true); sil.push(s); if (s) nsil++; else nout++; }
      tl = LIM;
    }
    function reset() { st = 'play'; rd = 0; errs = 0; fl = 0; press = false; px = api.w / 2; py = api.h / 2; montar(); }
    function lamber(x, y) {
      var c0 = Math.floor((x - BR - ax) / CELL), c1 = Math.floor((x + BR - ax) / CELL), r0 = Math.floor((y - BR - ay) / CELL), r1 = Math.floor((y + BR - ay) / CELL);
      for (var j = Math.max(0, r0); j <= Math.min(rows - 1, r1); j++) for (var i = Math.max(0, c0); i <= Math.min(cols - 1, c1); i++) {
        var k = j * cols + i; if (!ice[k]) continue; var cx = ax + (i + 0.5) * CELL, cy = ay + (j + 0.5) * CELL; if (Math.hypot(cx - x, cy - y) <= BR) { ice[k] = false; if (sil[k]) mel++; else wst++; }
      }
    }
    function avaliar() {
      if (mel >= nsil * 0.82) { if (wst <= nout * 0.4) { rd++; fl = 0.8; if (rd >= NR) st = 'win'; else montar(); } else { fal(); } }
    }
    function fal() { errs++; fl = 0.8; if (errs >= MAXE) st = 'lose'; else montar(); }
    return {
      pausar: function () { press = false; kx = ky = 0; kh = false; },
      dbg: function () { var todo = []; for (var j = 0; j < rows; j++) for (var i = 0; i < cols; i++) { var k = j * cols + i; if (sil[k] && ice[k]) todo.push({ x: ax + (i + 0.5) * CELL, y: ay + (j + 0.5) * CELL }); } return { st: st, rd: rd, errs: errs, tl: tl, nsil: nsil, mel: mel, wst: wst, nout: nout, todo: todo, cell: CELL }; },
      down: function (x, y) { if (menu()) return; press = true; px = x; py = y; lamber(x, y); avaliar(); },
      move: function (x, y, pr) { if (st !== 'play') return; px = x; py = y; if (pr) { press = true; lamber(x, y); avaliar(); } },
      up: function () { press = false; },
      key: function (c, d) { if (c === 'ArrowLeft' || c === 'KeyA') kx = d ? -1 : (kx === -1 ? 0 : kx); else if (c === 'ArrowRight' || c === 'KeyD') kx = d ? 1 : (kx === 1 ? 0 : kx); else if (c === 'ArrowUp' || c === 'KeyW') ky = d ? -1 : (ky === -1 ? 0 : ky); else if (c === 'ArrowDown' || c === 'KeyS') ky = d ? 1 : (ky === 1 ? 0 : ky); else if (c === 'Space' || c === 'Enter') { if (d && st !== 'play') menu(); else kh = d; } },
      update: function (dt) {
        if (st !== 'play') return; fl = Math.max(0, fl - dt);
        if (kx || ky) { px = Math.max(0, Math.min(api.w, px + kx * 300 * dt)); py = Math.max(0, Math.min(api.h, py + ky * 300 * dt)); }
        if (kh) { lamber(px, py); avaliar(); }
        tl -= dt; if (tl <= 0 && st === 'play') fal();
      },
      draw: function () {
        var W = api.w, H = api.h;
        bg('#16294a', '#0a1426'); g.fillStyle = 'rgba(255,255,255,.06)'; g.fillRect(ax - 10, ay - 10, aw + 20, ah + 20);
        var sx = ax, sy = ay;
        for (var j = 0; j < rows; j++) for (var i = 0; i < cols; i++) {
          var k = j * cols + i, x = sx + i * CELL, y = sy + j * CELL;
          if (!ice[k]) { g.fillStyle = sil[k] ? '#e8c28a' : '#1b3a52'; g.fillRect(x, y, CELL, CELL); }
          else { g.fillStyle = sil[k] ? 'rgba(190,225,255,.9)' : 'rgba(170,210,245,.88)'; g.fillRect(x, y, CELL - 0.5, CELL - 0.5); if (sil[k] && ((i + j) % 3 === 0)) { g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(x + 3, y + 3, 3, 3); } }
        }
        g.strokeStyle = '#fff'; g.lineWidth = 2; g.beginPath(); g.arc(px, py, BR, 0, 6.29); g.stroke();
        var bw = Math.min(W * 0.84, 560); g.fillStyle = 'rgba(255,255,255,.2)'; g.fillRect((W - bw) / 2, H * 0.92, bw, 7); g.fillStyle = tl < 6 ? '#ff8a7a' : '#c9b3f2'; g.fillRect((W - bw) / 2, H * 0.92, bw * Math.max(0, tl) / LIM, 7);
        g.fillStyle = 'rgba(255,216,138,.8)'; g.fillRect(22, 70, 120 * Math.min(1, mel / (nsil * 0.82)), 6); g.fillStyle = wst > nout * 0.3 ? '#ff8a7a' : 'rgba(255,255,255,.4)'; g.fillRect(22, 80, 120 * Math.min(1, wst / (nout * 0.4)), 6);
        if (fl > 0) { g.fillStyle = 'rgba(255,255,255,' + fl * 0.4 + ')'; g.fillRect(0, 0, W, H); }
        hud(T.h1 + ' ' + rd + '/' + NR, T.h2 + ' ' + errs + '/' + MAXE, errs > 0);
        fim(st);
      }
    };
  }
});
