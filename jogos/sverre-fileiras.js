/* Sverre — monte fileiras compactas como um exército. */
BTJogo.registrar({
  canvas: 'jogo-sverre',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As fileiras de Sverre",
    "sub": "Peças caem e você as encaixa. Setas: esquerda e direita movem, para cima gira, para baixo acelera, espaço solta de vez. No toque, use os botões embaixo. Cada fileira completa some. Feche 6 fileiras antes que a pilha chegue ao topo.",
    "perdeu": "A pilha chegou ao topo",
    "v1": "Suas fileiras estão firmes!",
    "v2": "A Saga de Sverre conta a ascensão de um rei da Noruega. As peças que caem no jogo são invenção.",
    "h1": "Fileiras",
    "h2": "Pilha"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Sverre's ranks",
    "sub": "Pieces fall and you fit them together. Arrows: left and right move, up rotates, down speeds up, Space drops at once. On touch, use the buttons below. Every full row disappears. Clear 6 rows before the stack reaches the top.",
    "perdeu": "The stack reached the top",
    "v1": "Your ranks stand firm!",
    "v2": "Sverris saga tells of a king's rise in Norway. The pieces that fall in the game are made up.",
    "h1": "Rows",
    "h2": "Stack"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Sverres rekker",
    "sub": "Brikker faller, og du setter dem sammen. Piltaster: venstre og høyre flytter, opp roterer, ned øker farten, mellomrom slipper brikken. På berøringsskjerm bruker du knappene nederst. Hver full rad forsvinner. Fjern 6 rader før haugen når toppen.",
    "perdeu": "Haugen nådde toppen",
    "v1": "Rekkene dine holder!",
    "v2": "Sverres saga forteller om en konges vei til makten i Norge. Brikkene som faller i spillet, er diktet opp.",
    "h1": "Rader",
    "h2": "Haug"
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
    var CW = 8, CH = 14, GOAL = 6;
    var KINDS = [[[0, 0], [1, 0], [2, 0], [3, 0]], [[0, 0], [0, 1], [1, 1], [2, 1]], [[2, 0], [0, 1], [1, 1], [2, 1]], [[0, 0], [1, 0], [0, 1], [1, 1]], [[1, 0], [2, 0], [0, 1], [1, 1]], [[1, 0], [0, 1], [1, 1], [2, 1]], [[0, 0], [1, 0], [1, 1], [2, 1]]];
    var COLS = ['#5ab0d8', '#4a6ad8', '#e0a030', '#e0d050', '#5aa05a', '#a05ad8', '#c0392b'];
    var SH = KINDS.map(function (cells) { var out = [], cur = cells; for (var r = 0; r < 4; r++) { var mx = Math.min.apply(null, cur.map(function (c) { return c[0]; })), my = Math.min.apply(null, cur.map(function (c) { return c[1]; })); out.push(cur.map(function (c) { return [c[0] - mx, c[1] - my]; })); cur = cur.map(function (c) { return [-c[1], c[0]]; }); } return out; });
    var bd = [], pc = null, nxt = 0, lines = 0, acc = 0, pop = 0, held = {}, rep = 0, pid = 0, flash = 0;
    function lay() { var W = api.w, H = api.h, cs = Math.max(14, Math.min((W - 20) / (CW + 4), (H - 190) / CH, 30)); return { cs: cs, x: Math.max(10, (W - CW * cs) / 2 - cs * 1.5), y: 78 }; }
    function cells(p) { return SH[p.k][p.r % 4]; }
    function fits(p) { var c = cells(p); for (var i = 0; i < 4; i++) { var x = p.x + c[i][0], y = p.y + c[i][1]; if (x < 0 || x >= CW || y >= CH) return false; if (y >= 0 && bd[y][x] >= 0) return false; } return true; }
    function empty() { var b = []; for (var r = 0; r < CH; r++) { var row = []; for (var c = 0; c < CW; c++) row.push(-1); b.push(row); } return b; }
    function spawn() { pc = { k: nxt, r: 0, x: 0, y: 0 }; nxt = Math.floor(Math.random() * 7); var w = Math.max.apply(null, cells(pc).map(function (c) { return c[0]; })) + 1; pc.x = Math.floor((CW - w) / 2); pid++; if (!fits(pc)) { st = 'lose'; } }
    function setup() { bd = empty(); lines = 0; acc = 0; flash = 0; nxt = Math.floor(Math.random() * 7); pid = 0; spawn(); }
    function reset() { setup(); st = 'play'; }
    function lock() {
      var c = cells(pc); for (var i = 0; i < 4; i++) { var y = pc.y + c[i][1], x = pc.x + c[i][0]; if (y >= 0) bd[y][x] = pc.k; }
      var keep = bd.filter(function (row) { return !row.every(function (v) { return v >= 0; }); }), n = CH - keep.length; while (keep.length < CH) { var row = []; for (var q = 0; q < CW; q++) row.push(-1); keep.unshift(row); } bd = keep;
      lines += n; if (n) { flash = 0.3; if (api.nota) api.nota(500 + n * 80, 0.12, 'triangle', 0.06); } else if (api.nota) api.nota(180, 0.04, 'square', 0.03);
      if (lines >= GOAL) { st = 'win'; return; } spawn();
    }
    function move(dx) { pc.x += dx; if (!fits(pc)) pc.x -= dx; }
    function rot() { var o = pc.r, ox = pc.x; pc.r = (pc.r + 1) % 4; if (fits(pc)) return; pc.x = ox + 1; if (fits(pc)) return; pc.x = ox - 1; if (fits(pc)) return; pc.x = ox + 2; if (fits(pc)) return; pc.x = ox - 2; if (fits(pc)) return; pc.r = o; pc.x = ox; }
    function soft() { pc.y++; if (!fits(pc)) { pc.y--; lock(); return false; } return true; }
    function hard() { while (soft()); }
    function btn(x, y) { var W = api.w, H = api.h, by = H - 64; if (y < by) return -1; var i = Math.floor(x / (W / 5)); return i; }
    setup();
    return {
      pausar: function () { held = {}; },
      dbg: function () { return { st: st, bd: bd.map(function (r) { return r.slice(); }), pc: { k: pc.k, r: pc.r, x: pc.x, y: pc.y }, SH: SH, CW: CW, CH: CH, lines: lines, pid: pid }; },
      down: function (x, y) { if (menu()) return; var b = btn(x, y); if (b === 0) move(-1); else if (b === 1) rot(); else if (b === 2) move(1); else if (b === 3) soft(); else if (b === 4) hard(); },
      key: function (k, d) { held[k] = d; if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'ArrowLeft' || k === 'KeyA') move(-1); else if (k === 'ArrowRight' || k === 'KeyD') move(1); else if (k === 'ArrowUp' || k === 'KeyW') rot(); else if (k === 'ArrowDown' || k === 'KeyS') soft(); else if (k === 'Space' || k === 'Enter') hard(); },
      update: function (dt) {
        pop += dt; if (flash > 0) flash -= dt; if (st !== 'play') return;
        var sp = Math.max(0.25, 0.65 - lines * 0.04); acc += dt * ((held.ArrowDown || held.KeyS) ? 8 : 1); while (acc >= sp && st === 'play') { acc -= sp; soft(); }
      },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), r, c, i;
        bg('#1c2230', '#080a10');
        g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(L.x - 3, L.y - 3, CW * L.cs + 6, CH * L.cs + 6);
        for (r = 0; r < CH; r++) for (c = 0; c < CW; c++) { var v = bd[r][c]; g.fillStyle = v >= 0 ? COLS[v] : 'rgba(255,255,255,.04)'; g.fillRect(L.x + c * L.cs + 1, L.y + r * L.cs + 1, L.cs - 2, L.cs - 2); }
        if (pc && st === 'play') { var cc = cells(pc); g.fillStyle = COLS[pc.k]; for (i = 0; i < 4; i++) g.fillRect(L.x + (pc.x + cc[i][0]) * L.cs + 1, L.y + (pc.y + cc[i][1]) * L.cs + 1, L.cs - 2, L.cs - 2); }
        var nx = L.x + CW * L.cs + 16; if (nx + L.cs * 4 < W) { txt('▸', nx + L.cs * 1.5, L.y + 10, 14, 'rgba(255,255,255,.5)'); SH[nxt][0].forEach(function (q) { g.fillStyle = COLS[nxt]; g.fillRect(nx + q[0] * L.cs * 0.8, L.y + 24 + q[1] * L.cs * 0.8, L.cs * 0.8 - 2, L.cs * 0.8 - 2); }); }
        if (flash > 0) { g.fillStyle = 'rgba(255,255,255,' + flash + ')'; g.fillRect(L.x, L.y, CW * L.cs, CH * L.cs); }
        var lb = ['◀', '⟳', '▶', '▼', '⤓']; for (i = 0; i < 5; i++) { g.fillStyle = 'rgba(255,216,138,.12)'; g.fillRect(i * W / 5 + 3, H - 60, W / 5 - 6, 54); txt(lb[i], (i + 0.5) * W / 5, H - 24, 26, 'rgba(255,255,255,.6)'); }
        var top = CH; for (r = 0; r < CH; r++) if (bd[r].some(function (v) { return v >= 0; })) { top = r; break; }
        hud(T.h1 + ' ' + lines + '/' + GOAL, T.h2 + ' ' + (CH - top) + '/' + CH, CH - top > 10);
        fim(st);
      }
    };
  }
});
