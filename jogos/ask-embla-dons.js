/* Ask e Embla — junte os blocos dois a dois. */
BTJogo.registrar({
  canvas: 'jogo-ask',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os dons dos deuses",
    "sub": "Deslize o dedo (ou use as setas) para mover todos os blocos. Dois blocos iguais se juntam num só, com o dobro do valor. Forme o bloco 128 antes do tempo acabar.",
    "perdeu": "Não restaram jogadas ou o tempo acabou",
    "v1": "Ask e Embla ganharam vida!",
    "v2": "Na Völuspá e em Snorri, dois troncos recebem dons dos deuses e viram o primeiro casal. O jogo de juntar blocos é invenção.",
    "h1": "Maior",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The gods' gifts",
    "sub": "Swipe (or use the arrows) to move all the blocks. Two equal blocks merge into one with double the value. Make the 128 block before time runs out.",
    "perdeu": "No moves were left or time ran out",
    "v1": "Ask and Embla came to life!",
    "v2": "In the Völuspá and in Snorri, two logs receive gifts from the gods and become the first couple. The block-merging game is made up.",
    "h1": "Highest",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Gudenes gaver",
    "sub": "Sveip (eller bruk piltastene) for å flytte alle blokkene. To like blokker slås sammen til én med dobbel verdi. Lag blokken 128 før tiden er ute.",
    "perdeu": "Det var ingen trekk igjen, eller tiden gikk ut",
    "v1": "Ask og Embla fikk liv!",
    "v2": "I Vǫluspá og hos Snorre får to trestammer gaver av gudene og blir det første paret. Spillet med sammenslåing av blokker er diktet opp.",
    "h1": "Høyeste",
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
    var N = 4, GOAL = 128, LIM = 150;
    var gr = [], tmr = LIM, pop = 0, sx = 0, sy = 0, down_ = false, pops = [], best = 0;
    var COL = { 2: '#8a7a5a', 4: '#a08a5a', 8: '#c08a40', 16: '#d07a30', 32: '#d0603a', 64: '#c04030', 128: '#c8b040', 256: '#ffd88a' };
    function lay() { var W = api.w, H = api.h, s = Math.min(W - 24, H - 170, 420); return { s: s, c: s / N, x: (W - s) / 2, y: Math.max(90, (H - s) / 2 + 14) }; }
    function empty() { var r = []; for (var i = 0; i < N; i++) r.push([0, 0, 0, 0]); return r; }
    function addTile() { var f = []; for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) if (!gr[r][c]) f.push([r, c]); if (!f.length) return; var p = f[Math.floor(Math.random() * f.length)]; gr[p[0]][p[1]] = Math.random() < 0.9 ? 2 : 4; pops.push({ r: p[0], c: p[1], t: 0.2 }); }
    function setup() { gr = empty(); addTile(); addTile(); tmr = LIM; pops = []; best = 4; }
    function reset() { setup(); st = 'play'; }
    function line(a) { var v = a.filter(function (x) { return x; }), out = [], i = 0, gain = 0; while (i < v.length) { if (i + 1 < v.length && v[i] === v[i + 1]) { out.push(v[i] * 2); gain++; i += 2; } else { out.push(v[i]); i++; } } while (out.length < N) out.push(0); return out; }
    function mv(dir, grid) { var moved = false, r, c, a, o; var G2 = grid.map(function (x) { return x.slice(); });
      for (var i = 0; i < N; i++) { if (dir === 0 || dir === 1) { a = []; for (r = 0; r < N; r++) a.push(G2[r][i]); if (dir === 1) a.reverse(); o = line(a); if (dir === 1) o.reverse(); for (r = 0; r < N; r++) { if (G2[r][i] !== o[r]) moved = true; G2[r][i] = o[r]; } } else { a = G2[i].slice(); if (dir === 3) a.reverse(); o = line(a); if (dir === 3) o.reverse(); for (c = 0; c < N; c++) { if (G2[i][c] !== o[c]) moved = true; G2[i][c] = o[c]; } } }
      return { g: G2, moved: moved }; }
    function can() { for (var d = 0; d < 4; d++) if (mv(d, gr).moved) return true; return false; }
    function slide(dir) { if (st !== 'play') return; var m = mv(dir, gr); if (!m.moved) return; gr = m.g; if (api.nota) api.nota(260, 0.04, 'triangle', 0.04); addTile(); var mx = 0; gr.forEach(function (row) { row.forEach(function (v) { if (v > mx) mx = v; }); }); best = mx; if (mx >= GOAL) { st = 'win'; return; } if (!can()) st = 'lose'; }
    setup();
    return {
      pausar: function () { down_ = false; },
      dbg: function () { return { st: st, gr: gr.map(function (r) { return r.slice(); }), best: best, tmr: tmr }; },
      down: function (x, y) { if (menu()) return; sx = x; sy = y; down_ = true; },
      move: function (x, y, pr) { if (!down_ || st !== 'play') return; var dx = x - sx, dy = y - sy; if (Math.max(Math.abs(dx), Math.abs(dy)) > 28) { if (Math.abs(dx) > Math.abs(dy)) slide(dx > 0 ? 3 : 2); else slide(dy > 0 ? 1 : 0); down_ = false; } },
      up: function () { down_ = false; },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'ArrowUp' || k === 'KeyW') slide(0); else if (k === 'ArrowDown' || k === 'KeyS') slide(1); else if (k === 'ArrowLeft' || k === 'KeyA') slide(2); else if (k === 'ArrowRight' || k === 'KeyD') slide(3); },
      update: function (dt) { pop += dt; pops = pops.filter(function (p) { p.t -= dt; return p.t > 0; }); if (st !== 'play') return; tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; } },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), r, c;
        bg('#2a2018', '#0c0804');
        g.fillStyle = 'rgba(0,0,0,.35)'; rr(L.x - 6, L.y - 6, L.s + 12, L.s + 12, 12); g.fill();
        for (r = 0; r < N; r++) for (c = 0; c < N; c++) { var v = gr[r][c], x = L.x + c * L.c, y = L.y + r * L.c; g.fillStyle = v ? (COL[v] || '#ffd88a') : 'rgba(255,255,255,.07)'; var pp = 0; pops.forEach(function (p) { if (p.r === r && p.c === c) pp = p.t * 12; }); rr(x + 4 + pp, y + 4 + pp, L.c - 8 - pp * 2, L.c - 8 - pp * 2, 10); g.fill(); if (v) txt(String(v), x + L.c / 2, y + L.c / 2 + L.c * 0.12, v > 99 ? L.c * 0.32 : L.c * 0.4, v > 4 ? '#fff' : '#2a2018'); }
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 30 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + best, T.h2 + ' ' + Math.ceil(tmr), false);
        fim(st);
      }
    };
  }
});
