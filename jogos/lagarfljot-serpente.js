/* A serpente do Lagarfljót — recolha o ouro e cresça sem bater nas margens. */
BTJogo.registrar({
  canvas: 'jogo-lagarfljot',
  t: {
    pt: {
      titulo: 'A serpente do Lagarfljót',
      sub: 'O verme cresce no fundo do lago. Toque na metade esquerda da tela para virar à esquerda e na direita para virar à direita (ou use as setas). Recolha 12 moedas de ouro sem bater nas margens nem no próprio corpo.',
      toque: 'Toque para começar', ouro: 'Ouro',
      perdeu: 'O verme se enroscou', de_novo: 'Toque para tentar de novo',
      v1: 'O verme cresceu!',
      v2: 'No folclore islandês, o verme cresceu depois de ser jogado no lago com o ouro e foi amarrado por feiticeiros. O jogo é uma invenção.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: 'The Lagarfljót worm',
      sub: 'The worm grows at the bottom of the lake. Tap the left half of the screen to turn left and the right half to turn right (or use the arrow keys). Collect 12 gold coins without hitting the shores or your own body.',
      toque: 'Tap to start', ouro: 'Gold',
      perdeu: 'The worm tangled itself', de_novo: 'Tap to try again',
      v1: 'The worm has grown!',
      v2: 'In Icelandic folklore, the worm grew after being thrown into the lake with the gold, and was bound by sorcerers. The game is made up.',
      jogar: 'Tap to play again'
    },
    no: {
      titulo: 'Lagarfljót-ormen',
      sub: 'Ormen vokser på bunnen av innsjøen. Trykk på venstre halvdel av skjermen for å svinge til venstre og på høyre for å svinge til høyre (eller bruk piltastene). Samle 12 gullmynter uten å treffe breddene eller din egen kropp.',
      toque: 'Trykk for å starte', ouro: 'Gull',
      perdeu: 'Ormen floket seg', de_novo: 'Trykk for å prøve igjen',
      v1: 'Ormen har vokst!',
      v2: 'I islandsk folketro vokste ormen etter at den ble kastet i innsjøen med gullet og bundet av trollmenn. Spillet er diktet opp.',
      jogar: 'Trykk for å spille igjen'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt, GOAL = 12, CS = 26;
    var st = 'menu', body = [], dir = 0, ndir = 0, gold = null, got = 0, acc = 0, cols = 0, rows = 0, ox = 0, oy = 0, flash = 0;
    var DX = [1, 0, -1, 0], DY = [0, 1, 0, -1]; /* 0 E,1 S,2 W,3 N */
    function layout() { cols = Math.max(10, Math.floor((api.w - 16) / CS)); rows = Math.max(10, Math.floor((api.h - 70) / CS)); ox = (api.w - cols * CS) / 2; oy = 52 + (api.h - 52 - rows * CS) / 2; }
    function reset() { layout(); st = 'play'; got = 0; dir = ndir = 0; var cx = Math.floor(cols / 3), cy = Math.floor(rows / 2); body = [[cx, cy], [cx - 1, cy], [cx - 2, cy]]; acc = 0; place(); }
    function place() { var tries = 0; do { gold = [Math.floor(Math.random() * cols), Math.floor(Math.random() * rows)]; tries++; } while (tries < 200 && body.some(function (b) { return b[0] === gold[0] && b[1] === gold[1]; })); }
    function turn(k) { if (st !== 'play') return; ndir = (dir + k + 4) % 4; }
    function setdir(d) { if (st !== 'play') return; if ((d + 2) % 4 !== dir) ndir = d; }
    function tick() {
      dir = ndir; var h = body[0], nx = h[0] + DX[dir], ny = h[1] + DY[dir];
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows || body.some(function (b, i) { return i < body.length - 1 && b[0] === nx && b[1] === ny; })) { st = 'lose'; return; }
      body.unshift([nx, ny]);
      if (gold && nx === gold[0] && ny === gold[1]) { got++; flash = 0.2; if (got >= GOAL) { st = 'win'; return; } place(); } else body.pop();
    }
    return {
      pausar: function () {},
      dbg: function () { return { st: st, got: got, dir: dir, body: body.slice(), gold: gold, cols: cols, rows: rows }; },
      down: function (x) {
        if (st === 'menu' || st === 'lose') { reset(); return; }
        if (st === 'win') { st = 'menu'; return; }
        turn(x < api.w / 2 ? 3 : 1);
      },
      key: function (c, d) {
        if (!d) return;
        if (st !== 'play') { if (c === 'Space' || c === 'Enter') this.down(0, 0); return; }
        var m = { ArrowRight: 0, KeyD: 0, ArrowDown: 1, KeyS: 1, ArrowLeft: 2, KeyA: 2, ArrowUp: 3, KeyW: 3 }[c]; if (m !== undefined) setdir(m);
      },
      resize: function () { if (st === 'play') { layout(); } },
      update: function (dt) { if (flash > 0) flash -= dt; if (st !== 'play') return; acc += dt; var iv = Math.max(0.09, 0.2 - got * 0.008); while (acc >= iv && st === 'play') { acc -= iv; tick(); } },
      draw: function () {
        var W = api.w, H = api.h;
        var s = g.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#2c4a5e'); s.addColorStop(1, '#16293a'); g.fillStyle = s; g.fillRect(0, 0, W, H);
        if (st === 'play' || st === 'win' || st === 'lose') {
          g.fillStyle = '#3a6a82'; g.fillRect(ox, oy, cols * CS, rows * CS);
          g.strokeStyle = '#8ab0c0'; g.lineWidth = 3; g.strokeRect(ox, oy, cols * CS, rows * CS);
          if (gold) txt('🪙', ox + (gold[0] + 0.5) * CS, oy + (gold[1] + 0.5) * CS + 8, 22, '#fff');
          body.forEach(function (b, i) { g.fillStyle = i === 0 ? '#e8c860' : (i % 2 ? '#6ecb8c' : '#4aa86a'); g.beginPath(); g.arc(ox + (b[0] + 0.5) * CS, oy + (b[1] + 0.5) * CS, CS * 0.46, 0, 6.29); g.fill(); });
          txt(T.ouro + ': ' + got + '/' + GOAL, 22, 32, 15, '#f3ecd2', 'left');
        }
        if (flash > 0) { g.fillStyle = 'rgba(255,216,138,' + flash * 0.5 + ')'; g.fillRect(0, 0, W, H); }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
