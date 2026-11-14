/* Os escudos de Fitjar — retire os grupos de escudos da mesma cor. */
BTJogo.registrar({
  canvas: 'jogo-hakon',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os escudos de Fitjar",
    "sub": "Os escudos cobrem a praia depois da batalha. Toque num grupo de dois ou mais escudos da mesma cor, vizinhos, para retirá-los; os de cima caem. Retire pelo menos trinta e nove dos quarenta e nove antes que o tempo acabe. Sem grupos, o jogo acaba.",
    "perdeu": "Os escudos ficaram na praia",
    "v1": "A praia está limpa!",
    "v2": "Em Fitjar, por volta de 961, o rei Håkon derrotou os filhos de Eirik, segundo a tradição. A limpeza dos escudos é invenção do jogo.",
    "h1": "Retirados",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The shields of Fitjar",
    "sub": "Shields cover the beach after the battle. Tap a group of two or more neighbouring shields of the same colour to remove them; those above fall. Remove at least thirty-nine of the forty-nine before time runs out. With no groups left, the game is over.",
    "perdeu": "The shields stayed on the beach",
    "v1": "The beach is clear!",
    "v2": "At Fitjar, around 961, King Håkon defeated Eirik's sons, according to tradition. The shield clearing is made up for the game.",
    "h1": "Removed",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Skjoldene ved Fitjar",
    "sub": "Skjold dekker stranda etter slaget. Trykk på en gruppe på to eller flere nabo-skjold i samme farge for å fjerne dem; de over faller ned. Fjern minst trettini av førtini før tiden er ute. Uten grupper igjen er spillet over.",
    "perdeu": "Skjoldene ble liggende på stranda",
    "v1": "Stranda er ryddet!",
    "v2": "Ved Fitjar, omkring 961, beseiret kong Håkon Eiriks sønner, ifølge tradisjonen. Skjoldryddingen er diktet opp for spillet.",
    "h1": "Fjernet",
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
    var N = 7, K = 5, NEED = 39, LIM = 150, COL = ['#b3261e', '#c9a23a', '#3a6aa8', '#4a8a5a', '#8a5aa8'];
    var gr = [], rem = 0, tmr = LIM, cur = [3, 3], fl = [];
    function lay() { var W = api.w, H = api.h, S = Math.min(W - 40, H * 0.74, 380); return { S: S, c: S / N, x: (W - S) / 2, y: Math.max(66, (H - S) / 2 + 12) }; }
    function setup() { gr = []; for (var r = 0; r < N; r++) { var row = []; for (var c = 0; c < N; c++) row.push(Math.floor(Math.random() * K)); gr.push(row); } rem = 0; tmr = LIM; cur = [3, 3]; fl = []; }
    function reset() { setup(); st = 'play'; }
    function group(r, c) {
      var v = gr[r][c]; if (v < 0) return []; var seen = {}, q = [[r, c]], k = 0; seen[r * N + c] = 1;
      while (k < q.length) { var p = q[k++], d = [[1, 0], [-1, 0], [0, 1], [0, -1]]; for (var i = 0; i < 4; i++) { var a = p[0] + d[i][0], b = p[1] + d[i][1]; if (a >= 0 && a < N && b >= 0 && b < N && !seen[a * N + b] && gr[a][b] === v) { seen[a * N + b] = 1; q.push([a, b]); } } }
      return q;
    }
    function anyMove() { for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) if (gr[r][c] >= 0 && group(r, c).length >= 2) return true; return false; }
    function left() { var n = 0; for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) if (gr[r][c] >= 0) n++; return n; }
    function take(r, c) {
      if (st !== 'play') return; var q = group(r, c); if (q.length < 2) { fl.push({ r: r, c: c, l: 0.3 }); return; }
      q.forEach(function (p) { gr[p[0]][p[1]] = -1; }); rem += q.length; if (api.nota) api.nota(380 + q.length * 25, 0.08, 'triangle', 0.05);
      for (var c2 = 0; c2 < N; c2++) { var col = []; for (var r2 = N - 1; r2 >= 0; r2--) if (gr[r2][c2] >= 0) col.push(gr[r2][c2]); for (r2 = N - 1; r2 >= 0; r2--) gr[r2][c2] = col.length ? col.shift() : -1; }
      var cols = []; for (c2 = 0; c2 < N; c2++) { var ok = false; for (r2 = 0; r2 < N; r2++) if (gr[r2][c2] >= 0) ok = true; if (ok) { var cc = []; for (r2 = 0; r2 < N; r2++) cc.push(gr[r2][c2]); cols.push(cc); } }
      for (c2 = 0; c2 < N; c2++) for (r2 = 0; r2 < N; r2++) gr[r2][c2] = c2 < cols.length ? cols[c2][r2] : -1;
      if (rem >= NEED) st = 'win'; else if (!anyMove()) st = 'lose';
    }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, gr: gr.map(function (r) { return r.slice(); }), rem: rem, tmr: tmr, x: L.x, y: L.y, c: L.c }; },
      down: function (x, y) { if (menu()) return; var L = lay(), c = Math.floor((x - L.x) / L.c), r = Math.floor((y - L.y) / L.c); if (c >= 0 && c < N && r >= 0 && r < N) { cur = [r, c]; take(r, c); } },
      key: function (c, d) {
        if (!d) return; if (c === 'ArrowLeft' || c === 'KeyA') cur[1] = Math.max(0, cur[1] - 1); else if (c === 'ArrowRight' || c === 'KeyD') cur[1] = Math.min(N - 1, cur[1] + 1);
        else if (c === 'ArrowUp' || c === 'KeyW') cur[0] = Math.max(0, cur[0] - 1); else if (c === 'ArrowDown' || c === 'KeyS') cur[0] = Math.min(N - 1, cur[0] + 1);
        else if (c === 'Space' || c === 'Enter') { if (st !== 'play') menu(); else take(cur[0], cur[1]); }
      },
      update: function (dt) { for (var i = fl.length - 1; i >= 0; i--) { fl[i].l -= dt; if (fl[i].l <= 0) fl.splice(i, 1); } if (st !== 'play') return; tmr -= dt; if (tmr <= 0) st = 'lose'; },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), r, c, i;
        bg('#2a3238', '#12171b');
        g.fillStyle = '#6a644a'; g.fillRect(0, H * 0.9, W, H * 0.1);
        g.fillStyle = 'rgba(255,255,255,.07)'; rr(L.x - 8, L.y - 8, L.S + 16, L.S + 16, 10); g.fill();
        var hv = (st === 'play') ? group(cur[0], cur[1]) : [];
        for (r = 0; r < N; r++) for (c = 0; c < N; c++) { var v = gr[r][c]; if (v < 0) continue; var x = L.x + c * L.c + L.c / 2, y = L.y + r * L.c + L.c / 2, R = L.c * 0.42; g.fillStyle = COL[v]; g.beginPath(); g.arc(x, y, R, 0, 6.29); g.fill(); g.fillStyle = 'rgba(255,255,255,.45)'; g.beginPath(); g.arc(x, y, R * 0.28, 0, 6.29); g.fill(); g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 2; g.beginPath(); g.arc(x, y, R * 0.78, 0, 6.29); g.stroke(); }
        if (hv.length >= 2) { g.strokeStyle = '#fff'; g.lineWidth = 3; hv.forEach(function (p) { g.beginPath(); g.arc(L.x + p[1] * L.c + L.c / 2, L.y + p[0] * L.c + L.c / 2, L.c * 0.46, 0, 6.29); g.stroke(); }); }
        if (st === 'play') { g.strokeStyle = 'rgba(255,255,255,.8)'; g.lineWidth = 2; g.strokeRect(L.x + cur[1] * L.c + 3, L.y + cur[0] * L.c + 3, L.c - 6, L.c - 6); }
        for (i = 0; i < fl.length; i++) { g.fillStyle = 'rgba(255,120,100,' + fl[i].l * 2 + ')'; g.fillRect(L.x + fl[i].c * L.c + 3, L.y + fl[i].r * L.c + 3, L.c - 6, L.c - 6); }
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 20 ? '#c0392b' : '#8aa8c0');
        hud(T.h1 + ' ' + rem + '/' + NEED, T.h2 + ' ' + Math.max(0, Math.ceil(tmr)), false);
        fim(st);
      }
    };
  }
});
