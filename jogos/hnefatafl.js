/* Hnefatafl em miniatura (7×7) — leve o rei até um canto. */
BTJogo.registrar({
  canvas: 'jogo-tafl',
  t: {
    pt: {
      titulo: 'Hnefatafl em miniatura',
      sub: 'Você comanda o rei e quatro defensores, de roxo. Leve o rei a um dos quatro cantos. Os atacantes, de vermelho, tentam cercá-lo. Toque numa peça e depois no destino.',
      toque: 'Toque para começar', sua: 'Sua vez', pensa: 'Os atacantes pensam...', pecas: 'Defensores',
      perdeu: 'O rei foi cercado', de_novo: 'Toque para tentar de novo',
      v1: 'O rei escapou!',
      v2: 'Hnefatafl era jogado nos tempos vikings, e tabuleiros foram achados em lugares como o navio de Gokstad. As regras originais se perderam e foram reconstruídas; este tabuleiro 7×7 é uma versão simplificada, e o rei aqui só é capturado por quatro lados.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: 'Hnefatafl in miniature',
      sub: 'You command the king and four defenders, in purple. Take the king to one of the four corners. The attackers, in red, try to surround him. Tap a piece, then its destination.',
      toque: 'Tap to start', sua: 'Your turn', pensa: 'The attackers are thinking...', pecas: 'Defenders',
      perdeu: 'The king was surrounded', de_novo: 'Tap to try again',
      v1: 'The king escaped!',
      v2: 'Hnefatafl was played in Viking times, and boards have been found in places like the Gokstad ship. The original rules were lost and have been reconstructed; this 7×7 board is a simplified version, and here the king is only captured on four sides.',
      jogar: 'Tap to play again'
    },
    no: {
      titulo: 'Hnefatafl i miniatyr',
      sub: 'Du leder kongen og fire forsvarere, i lilla. Før kongen til et av de fire hjørnene. Angriperne, i rødt, prøver å omringe ham. Trykk på en brikke, så på målet.',
      toque: 'Trykk for å starte', sua: 'Din tur', pensa: 'Angriperne tenker...', pecas: 'Forsvarere',
      perdeu: 'Kongen ble omringet', de_novo: 'Trykk for å prøve igjen',
      v1: 'Kongen slapp unna!',
      v2: 'Hnefatafl ble spilt i vikingtiden, og brett er funnet på steder som Gokstadskipet. De opprinnelige reglene gikk tapt og er rekonstruert; dette brettet på 7×7 ruter er en forenklet versjon, og her blir kongen bare tatt på fire sider.',
      jogar: 'Trykk for å spille igjen'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt;
    var N = 7, st = 'menu', b, sel = null, vez = 'D', espera = 0, ult = null;
    // b[y][x]: 0 vazio, 'A' atacante, 'D' defensor, 'K' rei
    function inicio() {
      b = []; for (var y = 0; y < N; y++) { b.push([]); for (var x = 0; x < N; x++) b[y].push(0); }
      b[3][3] = 'K'; [[2, 3], [4, 3], [3, 2], [3, 4]].forEach(function (p) { b[p[1]][p[0]] = 'D'; });
      [[3, 0], [3, 1], [3, 5], [3, 6], [0, 3], [1, 3], [5, 3], [6, 3]].forEach(function (p) { b[p[1]][p[0]] = 'A'; });
    }
    function canto(x, y) { return (x === 0 || x === N - 1) && (y === 0 || y === N - 1); }
    function trono(x, y) { return x === 3 && y === 3; }
    function lado(p) { return p === 'A' ? 'A' : (p ? 'D' : null); }
    function movs(bd, x, y) {
      var p = bd[y][x], r = [], rei = p === 'K', dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      dirs.forEach(function (d) {
        var nx = x + d[0], ny = y + d[1];
        while (nx >= 0 && ny >= 0 && nx < N && ny < N && !bd[ny][nx]) {
          if (!((canto(nx, ny) || trono(nx, ny)) && !rei)) r.push([nx, ny]);
          nx += d[0]; ny += d[1];
        }
      });
      return r;
    }
    function hostil(bd, x, y, inimigo) {
      if (x < 0 || y < 0 || x >= N || y >= N) return false;
      var p = bd[y][x];
      if (p) return lado(p) === inimigo;
      return canto(x, y) || (trono(x, y));
    }
    function mover(bd, x, y, nx, ny) {
      var p = bd[y][x]; bd[y][x] = 0; bd[ny][nx] = p; var meu = lado(p), ini = meu === 'A' ? 'D' : 'A', cap = 0;
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) {
        var ax = nx + d[0], ay = ny + d[1], bx = nx + 2 * d[0], by = ny + 2 * d[1];
        if (ax < 0 || ay < 0 || ax >= N || ay >= N) return;
        var alvo = bd[ay][ax]; if (!alvo || lado(alvo) !== ini || alvo === 'K') return;
        var amigo = false;
        if (bx >= 0 && by >= 0 && bx < N && by < N) { var q = bd[by][bx]; amigo = q ? lado(q) === meu : (canto(bx, by) || (trono(bx, by) && bd[3][3] === 0)); }
        if (amigo) { bd[ay][ax] = 0; cap++; }
      });
      return cap;
    }
    function achaRei(bd) { for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) if (bd[y][x] === 'K') return [x, y]; return null; }
    function reiCapturado(bd) {
      var r = achaRei(bd); if (!r) return true;
      var x = r[0], y = r[1], n = 0;
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) {
        var ax = x + d[0], ay = y + d[1];
        if (ax < 0 || ay < 0 || ax >= N || ay >= N) { n += 0; return; }
        var p = bd[ay][ax]; if (p === 'A' || (!p && trono(ax, ay)) || (!p && canto(ax, ay))) n++;
      });
      var bordas = 0; [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]].forEach(function (q) { if (q[0] < 0 || q[1] < 0 || q[0] >= N || q[1] >= N) bordas++; });
      return bordas === 0 && n >= 4;
    }
    function reiLivre(bd) { var r = achaRei(bd); return r && canto(r[0], r[1]); }
    function copia(bd) { return bd.map(function (l) { return l.slice(); }); }
    function todos(bd, quem) { var r = []; for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) if (lado(bd[y][x]) === quem) movs(bd, x, y).forEach(function (m) { r.push([x, y, m[0], m[1]]); }); return r; }
    function caminhosCanto(bd) { // quantos cantos o rei alcança em um movimento
      var r = achaRei(bd); if (!r) return 0; return movs(bd, r[0], r[1]).filter(function (m) { return canto(m[0], m[1]); }).length;
    }
    function aval(bd) { // do ponto de vista dos atacantes
      var s = 0, r = achaRei(bd); if (!r) return 9999;
      if (reiCapturado(bd)) return 9000; if (canto(r[0], r[1])) return -9000;
      var a = 0, d = 0; for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) { if (bd[y][x] === 'A') a++; else if (bd[y][x] === 'D') d++; }
      s += a * 14 - d * 20 - caminhosCanto(bd) * 400;
      var viz = 0; [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (q) { var ax = r[0] + q[0], ay = r[1] + q[1]; if (ax >= 0 && ay >= 0 && ax < N && ay < N && bd[ay][ax] === 'A') viz++; });
      s += viz * 18; s -= Math.min(r[0], N - 1 - r[0]) + Math.min(r[1], N - 1 - r[1]) < 3 ? 12 : 0;
      return s;
    }
    function ia() {
      var ms = todos(b, 'A'); if (!ms.length) { st = 'win'; return; }
      var melhor = [], bs = -1e9;
      ms.forEach(function (m) {
        var c = copia(b); mover(c, m[0], m[1], m[2], m[3]);
        var sc = aval(c);
        if (sc < 9000) { // resposta do jogador
          var pior = 1e9; todos(c, 'D').forEach(function (r) { var c2 = copia(c); mover(c2, r[0], r[1], r[2], r[3]); var v = aval(c2); if (v < pior) pior = v; }); if (pior < 1e9) sc = pior * 0.7 + sc * 0.3;
        }
        sc += Math.random() * 10;
        if (sc > bs) { bs = sc; melhor = m; }
      });
      ult = [melhor[2], melhor[3]]; mover(b, melhor[0], melhor[1], melhor[2], melhor[3]);
      if (reiCapturado(b)) st = 'lose'; else if (!todos(b, 'D').length) st = 'lose'; else vez = 'D';
    }
    function reset() { st = 'jogo'; inicio(); sel = null; vez = 'D'; ult = null; }
    function geo() { var W = api.w, H = api.h, s = Math.min(W - 24, H - 150, 560) / N; return { s: s, x0: (W - s * N) / 2, y0: (H - s * N) / 2 + 10 }; }
    function down(x, y) {
      if (st === 'menu' || st === 'lose') { reset(); return; }
      if (st === 'win') { st = 'menu'; return; }
      if (vez !== 'D') return;
      var G = geo(), cx = Math.floor((x - G.x0) / G.s), cy = Math.floor((y - G.y0) / G.s);
      if (cx < 0 || cy < 0 || cx >= N || cy >= N) { sel = null; return; }
      var p = b[cy][cx];
      if (lado(p) === 'D') { sel = [cx, cy]; return; }
      if (sel) {
        var ok = movs(b, sel[0], sel[1]).some(function (m) { return m[0] === cx && m[1] === cy; });
        if (ok) { mover(b, sel[0], sel[1], cx, cy); sel = null; ult = null; if (reiLivre(b)) { st = 'win'; return; } vez = 'A'; espera = 0.7; }
      }
    }
    return {
      down: down,
      update: function (dt) { if (st === 'jogo' && vez === 'A') { espera -= dt; if (espera <= 0) ia(); } },
      key: function (c, d) { if ((c === 'Space' || c === 'Enter') && d && st !== 'jogo') down(-999, -999); },
      draw: function () {
        var W = api.w, H = api.h, G = geo(), s = G.s;
        var bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#2a1d12'); bg.addColorStop(1, '#14100b'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
        if (!b) inicio();
        for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) {
          g.fillStyle = (x + y) % 2 ? '#b98a54' : '#caa070'; if (canto(x, y)) g.fillStyle = '#e0c24a'; else if (trono(x, y)) g.fillStyle = '#8a5a2b';
          g.fillRect(G.x0 + x * s, G.y0 + y * s, s, s);
        }
        if (sel && st === 'jogo') movs(b, sel[0], sel[1]).forEach(function (m) { g.fillStyle = 'rgba(80,200,120,.55)'; g.beginPath(); g.arc(G.x0 + (m[0] + .5) * s, G.y0 + (m[1] + .5) * s, s * 0.14, 0, 6.29); g.fill(); });
        if (ult) { g.strokeStyle = '#fff'; g.lineWidth = 3; g.strokeRect(G.x0 + ult[0] * s + 3, G.y0 + ult[1] * s + 3, s - 6, s - 6); }
        var nd = 0;
        for (y = 0; y < N; y++) for (x = 0; x < N; x++) {
          var p = b[y][x]; if (!p) continue; if (p === 'D') nd++;
          var px = G.x0 + (x + .5) * s, py = G.y0 + (y + .5) * s;
          g.fillStyle = p === 'A' ? '#b32d2d' : '#6a3fa8'; g.beginPath(); g.arc(px, py, s * 0.36, 0, 6.29); g.fill();
          g.strokeStyle = sel && sel[0] === x && sel[1] === y ? '#fff' : 'rgba(0,0,0,.45)'; g.lineWidth = 3; g.stroke();
          if (p === 'K') { g.fillStyle = '#ffd84a'; g.beginPath(); g.moveTo(px - s * .2, py + s * .08); g.lineTo(px - s * .2, py - s * .14); g.lineTo(px - s * .08, py - s * .02); g.lineTo(px, py - s * .18); g.lineTo(px + s * .08, py - s * .02); g.lineTo(px + s * .2, py - s * .14); g.lineTo(px + s * .2, py + s * .08); g.closePath(); g.fill(); }
        }
        if (st !== 'menu') {
          txt(vez === 'D' ? T.sua : T.pensa, W / 2, G.y0 - 18, 16, '#ffd88a');
          txt(T.pecas + ': ' + nd, 24, 34, 14, '#fff', 'left');
        }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
