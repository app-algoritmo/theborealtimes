/* Uppsala — ordene as peças do templo. */
BTJogo.registrar({
  canvas: 'jogo-uppsala',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O templo de Uppsala",
    "sub": "Toque numa peça ao lado do espaço vazio para deslizá-la. Coloque as runas na ordem, de 1 a 8, com o espaço vazio no canto de baixo à direita. Você tem 70 jogadas.",
    "perdeu": "As jogadas ou o tempo acabaram",
    "v1": "As peças estão em ordem!",
    "v2": "Adão de Bremen descreveu, por volta de 1070, um grande templo em Uppsala. O quebra-cabeça é invenção.",
    "h1": "Ao lugar",
    "h2": "Jogadas"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The temple at Uppsala",
    "sub": "Tap a piece next to the empty space to slide it. Put the runes in order, from 1 to 8, with the empty space in the bottom-right corner. You have 70 moves.",
    "perdeu": "The moves or the time ran out",
    "v1": "The pieces are in order!",
    "v2": "Adam of Bremen described, around 1070, a great temple at Uppsala. The puzzle is made up.",
    "h1": "In place",
    "h2": "Moves"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Tempelet i Uppsala",
    "sub": "Trykk på en brikke ved siden av den tomme ruten for å skyve den. Legg runene i rekkefølge, fra 1 til 8, med den tomme ruten nederst til høyre. Du har 70 trekk.",
    "perdeu": "Trekkene eller tiden var brukt opp",
    "v1": "Brikkene ligger i rekkefølge!",
    "v2": "Adam av Bremen beskrev rundt 1070 et stort tempel i Uppsala. Gåten er diktet opp.",
    "h1": "På plass",
    "h2": "Trekk"
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
    var N = 3, MAXM = 70, LIM = 240, RUN = ['', 'ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ'];
    var bd = [], br = 2, bc = 2, moves = 0, tmr = LIM, hist = [], anim = null;
    function lay() { var W = api.w, H = api.h, cs = Math.max(60, Math.min((W - 30) / N, (H - 190) / N, 110)); return { cs: cs, x: (W - cs * N) / 2, y: Math.max(90, (H - cs * N) / 2 + 6) }; }
    function inplace() { var n = 0; for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) { var v = bd[r][c]; if (v && v === r * N + c + 1) n++; } return n; }
    var DD = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    function setup() { do { bd = []; for (var r = 0; r < N; r++) { bd.push([]); for (var c = 0; c < N; c++) bd[r].push(r * N + c + 1); } bd[2][2] = 0; br = 2; bc = 2; hist = []; var last = -1, n = 0; while (n < 36) { var d = Math.floor(Math.random() * 4); if (last >= 0 && d === (last ^ 1)) continue; var a = br + DD[d][0], b = bc + DD[d][1]; if (a < 0 || b < 0 || a >= N || b >= N) continue; bd[br][bc] = bd[a][b]; bd[a][b] = 0; br = a; bc = b; hist.push(d); last = d; n++; } } while (inplace() > 3); moves = 0; tmr = LIM; }
    function reset() { setup(); st = 'play'; }
    function slide(r, c) { if (st !== 'play') return; if (Math.abs(r - br) + Math.abs(c - bc) !== 1) return; bd[br][bc] = bd[r][c]; bd[r][c] = 0; br = r; bc = c; moves++; if (api.nota) api.nota(300, 0.04, 'triangle', 0.04); if (inplace() === 8) { st = 'win'; if (api.nota) api.nota(700, 0.2, 'triangle', 0.06); return; } if (moves >= MAXM) st = 'lose'; }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, bd: bd.map(function (r) { return r.slice(); }), br: br, bc: bc, moves: moves, max: MAXM, hist: hist.slice(), tmr: tmr, pos: function (r, c) { return { x: L.x + (c + 0.5) * L.cs, y: L.y + (r + 0.5) * L.cs }; } }; },
      down: function (x, y) { if (menu()) return; var L = lay(), c = Math.floor((x - L.x) / L.cs), r = Math.floor((y - L.y) / L.cs); if (r >= 0 && c >= 0 && r < N && c < N) slide(r, c); },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'ArrowUp') slide(br + 1, bc); else if (k === 'ArrowDown') slide(br - 1, bc); else if (k === 'ArrowLeft') slide(br, bc + 1); else if (k === 'ArrowRight') slide(br, bc - 1); },
      update: function (dt) { if (st !== 'play') return; tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; } },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), r, c;
        bg('#1e1a2a', '#07050c');
        g.fillStyle = 'rgba(0,0,0,.35)'; rr(L.x - 6, L.y - 6, L.cs * N + 12, L.cs * N + 12, 12); g.fill();
        for (r = 0; r < N; r++) for (c = 0; c < N; c++) { var v = bd[r][c]; if (!v) continue; var x = L.x + c * L.cs, y = L.y + r * L.cs, good = v === r * N + c + 1; g.fillStyle = good ? '#7a6a3a' : '#4a4a62'; rr(x + 3, y + 3, L.cs - 6, L.cs - 6, 10); g.fill(); txt(RUN[v], x + L.cs / 2, y + L.cs * 0.6, L.cs * 0.42, '#ffd88a'); txt(String(v), x + L.cs / 2, y + L.cs * 0.86, L.cs * 0.18, 'rgba(255,255,255,.55)'); }
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 40 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + inplace() + '/8', T.h2 + ' ' + moves + '/' + MAXM, moves >= MAXM - 10);
        fim(st);
      }
    };
  }
});
