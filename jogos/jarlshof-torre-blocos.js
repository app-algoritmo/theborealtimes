/* Jarlshof, Shetland — empilhe blocos que deslizam até formar uma torre (invenção). */
BTJogo.registrar({
  canvas: 'jogo-jarlshof',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A torre de Jarlshof",
    "sub": "Um bloco desliza de um lado para o outro. Toque (ou aperte Espaço) para soltá-lo sobre a torre: a parte que sobrar para fora é cortada, e o próximo bloco fica mais estreito. Se errar por pouco, o bloco encaixa inteiro. Empilhe 10 andares em 90 segundos sem perder o bloco todo.",
    "perdeu": "O bloco caiu fora da torre ou o tempo acabou",
    "v1": "A torre está de pé!",
    "v2": "Em Jarlshof, nas Shetland, casas de épocas diferentes foram construídas umas sobre as outras. A torre de blocos é invenção.",
    "h1": "Andares",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The tower of Jarlshof",
    "sub": "A block slides from side to side. Tap (or press Space) to drop it on the tower: any part that sticks out is cut off, and the next block is narrower. If you miss by a little, the block fits whole. Stack 10 floors in 90 seconds without losing the whole block.",
    "perdeu": "The block fell off the tower or time ran out",
    "v1": "The tower stands!",
    "v2": "At Jarlshof, in Shetland, houses of different ages were built on top of one another. The tower of blocks is invented.",
    "h1": "Floors",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Tårnet i Jarlshof",
    "sub": "En blokk glir fra side til side. Trykk (eller trykk mellomrom) for å slippe den på tårnet: det som stikker ut, kappes av, og neste blokk blir smalere. Bommer du litt, passer blokka hel. Stable 10 etasjer på 90 sekunder uten å miste hele blokka.",
    "perdeu": "Blokka falt utenfor tårnet eller tiden tok slutt",
    "v1": "Tårnet står!",
    "v2": "I Jarlshof på Shetland ble hus fra ulike tider bygd oppå hverandre. Blokktårnet er oppfunnet.",
    "h1": "Etasjer",
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
    var GOAL = 10, LIM = 90, TOL = 7;
    var layers = [], mx = 0, mw = 0, dir = 1, t = 0, cam = 0, cut = null, pf = 0;
    function lay() { var W = api.w, H = api.h, s = Math.max(0.8, Math.min(1.4, Math.min(W, H) / 450)); return { W: W, H: H, s: s, lh: 28 * s, by: H - 50 }; }
    function speed() { return (150 + 15 * (layers.length - 1)) * lay().s; }
    function reset() { var L = lay(), w0 = Math.max(110, Math.min(300, L.W * 0.42)); layers = [{ x: (L.W - w0) / 2, w: w0 }]; mw = w0; mx = 0; dir = 1; t = 0; cam = 0; cut = null; pf = 0; st = 'play'; }
    function drop() {
      if (st !== 'play') return; var top = layers[layers.length - 1], dx = mx - top.x;
      if (Math.abs(dx) <= TOL) { layers.push({ x: top.x, w: top.w }); pf = 0.4; if (api.nota) api.nota(700, 0.15, 'sine', 0.06); }
      else { var ov = top.w - Math.abs(dx); if (ov <= 4) { cut = { x: mx, w: mw, y: 0 }; st = 'lose'; return; } var nx = Math.max(mx, top.x); layers.push({ x: nx, w: ov }); cut = { x: dx > 0 ? top.x + top.w : mx, w: Math.abs(dx), y: 0 }; if (api.nota) api.nota(380, 0.1, 'triangle', 0.05); }
      mw = layers[layers.length - 1].w; mx = dir > 0 ? 0 : lay().W - mw;
      if (layers.length - 1 >= GOAL) st = 'win';
    }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { var top = layers[layers.length - 1]; return { st: st, mx: mx, mw: mw, tx: top.x, tw: top.w, n: layers.length - 1, t: t }; },
      down: function () { if (menu()) return; drop(); },
      move: function () {}, up: function () {},
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'Space' || k === 'Enter' || k === 'ArrowDown') drop(); },
      update: function (dt) {
        var L = lay(), tc = Math.max(0, layers.length - 6) * L.lh; cam += (tc - cam) * Math.min(1, dt * 6); if (pf > 0) pf -= dt;
        if (cut && cut.y < 400) { cut.y += dt * 260; }
        if (st !== 'play') return; t += dt; if (t >= LIM) { st = 'lose'; return; }
        mx += dir * speed() * dt; if (mx + mw > L.W) { mx = L.W - mw; dir = -1; } if (mx < 0) { mx = 0; dir = 1; }
      },
      draw: function () {
        var L = lay(), W = L.W, H = L.H, i;
        bg('#3b4a5c', '#101a26');
        g.fillStyle = '#2a3b2a'; g.fillRect(0, L.by + L.lh - cam, W, H);
        for (i = 0; i < layers.length; i++) { var y = L.by - i * L.lh + cam, c = layers[i]; g.fillStyle = i % 2 ? '#8a8f96' : '#767c84'; g.fillRect(c.x, y, c.w, L.lh - 2); g.fillStyle = 'rgba(255,255,255,.14)'; g.fillRect(c.x, y, c.w, 4); }
        if (cut) { var cy = L.by - (layers.length - 1) * L.lh + cam + cut.y; g.fillStyle = '#767c84'; g.fillRect(cut.x, cy, cut.w, L.lh - 2); }
        if (st === 'play') { var my = L.by - layers.length * L.lh + cam; g.fillStyle = '#b8a37a'; g.fillRect(mx, my, mw, L.lh - 2); g.fillStyle = 'rgba(255,255,255,.2)'; g.fillRect(mx, my, mw, 4); }
        if (pf > 0) txt('✦', W / 2, L.by - (layers.length - 1) * L.lh + cam - 8, 20, '#ffd88a');
        bar(W / 2 - 110, H - 14, 220, 5, (LIM - t) / LIM, LIM - t < 15 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + (layers.length - 1) + '/' + GOAL, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };
  }
});
