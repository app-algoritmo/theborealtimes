/* Wedmore, 878 — empurre as caixas até as marcas. */
BTJogo.registrar({
  canvas: 'jogo-guthrum',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As caixas de Wedmore",
    "sub": "Use as setas (ou toque ao lado do guerreiro) para andar e empurrar as caixas até as marcas no chão. Só dá para empurrar, não puxar. Se travar, toque em ↺ ou aperte R. Vença os 3 níveis em até 150 segundos.",
    "perdeu": "O tempo acabou",
    "v1": "Os três níveis estão feitos!",
    "v2": "Em 878, após Edington, o rei Guthrum foi batizado perto de Wedmore. As caixas e as marcas são invenção do jogo.",
    "h1": "Nível",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The crates of Wedmore",
    "sub": "Use the arrow keys (or tap beside the warrior) to walk and push crates onto the marks on the floor. You can only push, not pull. If you get stuck, tap ↺ or press R. Clear all 3 levels within 150 seconds.",
    "perdeu": "The time ran out",
    "v1": "All three levels are done!",
    "v2": "In 878, after Edington, King Guthrum was baptised near Wedmore. The crates and the marks are made up for the game.",
    "h1": "Level",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Kassene i Wedmore",
    "sub": "Bruk piltastene (eller trykk ved siden av krigeren) for å gå og skyve kasser til merkene på gulvet. Du kan bare skyve, ikke trekke. Står du fast, trykk på ↺ eller trykk R. Klar alle 3 nivåene på 150 sekunder.",
    "perdeu": "Tiden gikk ut",
    "v1": "Alle tre nivåene er klare!",
    "v2": "I 878, etter Edington, ble kong Guthrum døpt nær Wedmore. Kassene og merkene er diktet opp for spillet.",
    "h1": "Nivå",
    "h2": "Tid"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "Las cajas de Wedmore",
    "sub": "Usa las flechas (o toca junto al guerrero) para andar y empujar las cajas hasta las marcas del suelo. Solo se puede empujar, no tirar. Si te atascas, toca ↺ o pulsa R. Supera los 3 niveles en un máximo de 150 segundos.",
    "perdeu": "Se acabó el tiempo",
    "v1": "¡Los tres niveles están hechos!",
    "v2": "En 878, tras Edington, el rey Guthrum fue bautizado cerca de Wedmore. Las cajas y las marcas son un invento del juego.",
    "h1": "Nivel",
    "h2": "Tiempo"
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
    var LVS = [
      ['########', '#      #', '# @ $ .#', '#  ##  #', '########'],
      ['#########', '#   #   #', '# $ # . #', '# @   $.#', '#   #   #', '#########'],
      ['#########', '#       #', '# .$  . #', '# #$@$# #', '# . $ . #', '#########']
    ];
    var LIM = 150, lv = 0, walls = [], goals = [], boxes = [], pl = { x: 0, y: 0 }, W_ = 0, H_ = 0, t = 0, flash = 0;
    function load(n) { var rows = LVS[n]; H_ = rows.length; W_ = rows[0].length; walls = []; goals = []; boxes = []; for (var y = 0; y < H_; y++) { walls.push([]); goals.push([]); for (var x = 0; x < W_; x++) { var ch = rows[y][x]; walls[y].push(ch === '#'); goals[y].push(ch === '.'); if (ch === '$') boxes.push({ x: x, y: y }); if (ch === '@') pl = { x: x, y: y }; } } }
    function lay() { var W = api.w, H = api.h, cs = Math.max(30, Math.min((W - 24) / W_, (H - 170) / H_, 70)); return { cs: cs, x: (W - cs * W_) / 2, y: Math.max(88, (H - cs * H_) / 2 + 6) }; }
    function setup() { lv = 0; load(0); t = 0; flash = 0; }
    function reset() { setup(); st = 'play'; }
    function boxAt(x, y) { for (var i = 0; i < boxes.length; i++) if (boxes[i].x === x && boxes[i].y === y) return i; return -1; }
    function step(dx, dy) { if (st !== 'play') return; var nx = pl.x + dx, ny = pl.y + dy; if (walls[ny][nx]) return; var bi = boxAt(nx, ny); if (bi >= 0) { var mx = nx + dx, my = ny + dy; if (walls[my][mx] || boxAt(mx, my) >= 0) return; boxes[bi].x = mx; boxes[bi].y = my; if (api.nota) api.nota(220, 0.04, 'square', 0.03); } pl.x = nx; pl.y = ny; var all = boxes.every(function (b) { return goals[b.y][b.x]; });
      if (all) { if (api.nota) api.nota(660, 0.15, 'triangle', 0.06); if (lv >= LVS.length - 1) { st = 'win'; return; } lv++; load(lv); flash = 0.6; } }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, lv: lv, nlv: LVS.length, rows: LVS[lv], walls: walls.map(function (r) { return r.slice(); }), goals: goals.map(function (r) { return r.slice(); }), boxes: boxes.map(function (b) { return { x: b.x, y: b.y }; }), pl: { x: pl.x, y: pl.y }, w: W_, h: H_, t: t, tmr: LIM - t }; },
      down: function (x, y) { if (menu()) return; var L = lay(); if (x > api.w - 54 && y > api.h - 54) { load(lv); return; } var px = L.x + (pl.x + 0.5) * L.cs, py = L.y + (pl.y + 0.5) * L.cs, dx = x - px, dy = y - py; if (Math.abs(dx) < 4 && Math.abs(dy) < 4) return; if (Math.abs(dx) > Math.abs(dy)) step(dx > 0 ? 1 : -1, 0); else step(0, dy > 0 ? 1 : -1); },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'ArrowLeft' || k === 'KeyA') step(-1, 0); else if (k === 'ArrowRight' || k === 'KeyD') step(1, 0); else if (k === 'ArrowUp' || k === 'KeyW') step(0, -1); else if (k === 'ArrowDown' || k === 'KeyS') step(0, 1); else if (k === 'KeyR') load(lv); },
      update: function (dt) { if (flash > 0) flash -= dt; if (st !== 'play') return; t += dt; if (t >= LIM) { t = LIM; st = 'lose'; } },
      draw: function () {
        var L = lay(), W = api.w, H = api.h, x, y, i;
        bg('#2a2418', '#0a0804');
        for (y = 0; y < H_; y++) for (x = 0; x < W_; x++) { var px = L.x + x * L.cs, py = L.y + y * L.cs; if (walls[y][x]) { g.fillStyle = '#5a4a38'; g.fillRect(px, py, L.cs, L.cs); g.fillStyle = 'rgba(255,255,255,.07)'; g.fillRect(px, py, L.cs, 3); } else { g.fillStyle = 'rgba(255,255,255,.04)'; g.fillRect(px + 1, py + 1, L.cs - 2, L.cs - 2); if (goals[y][x]) { g.strokeStyle = '#ffd88a'; g.lineWidth = 3; g.beginPath(); g.arc(px + L.cs / 2, py + L.cs / 2, L.cs * 0.18, 0, 6.283); g.stroke(); } } }
        for (i = 0; i < boxes.length; i++) { var b = boxes[i], on = goals[b.y][b.x]; g.fillStyle = on ? '#7fa84a' : '#a07a4a'; rr(L.x + b.x * L.cs + 4, L.y + b.y * L.cs + 4, L.cs - 8, L.cs - 8, 6); g.fill(); g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 2; g.beginPath(); g.moveTo(L.x + b.x * L.cs + 6, L.y + b.y * L.cs + 6); g.lineTo(L.x + (b.x + 1) * L.cs - 6, L.y + (b.y + 1) * L.cs - 6); g.stroke(); }
        g.fillStyle = '#c0392b'; g.beginPath(); g.arc(L.x + (pl.x + 0.5) * L.cs, L.y + (pl.y + 0.5) * L.cs, L.cs * 0.3, 0, 6.283); g.fill(); g.fillStyle = '#e8c9a0'; g.beginPath(); g.arc(L.x + (pl.x + 0.5) * L.cs, L.y + (pl.y + 0.35) * L.cs, L.cs * 0.16, 0, 6.283); g.fill();
        txt('↺', W - 30, H - 22, 26, '#ffd88a');
        if (flash > 0) { g.fillStyle = 'rgba(255,216,138,' + flash * 0.5 + ')'; g.fillRect(0, 0, W, H); }
        hud(T.h1 + ' ' + (lv + 1) + '/' + LVS.length, T.h2 + ' ' + Math.ceil(LIM - t), false);
        fim(st);
      }
    };
  }
});
