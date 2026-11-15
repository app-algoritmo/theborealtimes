/* Ellide na tempestade — atravesse as ondas sem bater. */
BTJogo.registrar({
  canvas: 'jogo-fridtjof',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Ellide na tempestade",
    "sub": "As feiticeiras levantaram ondas contra o Ellide. Toque ao lado do navio, ou deslize o dedo (ou use as setas), para avançar, recuar ou andar de lado. Cruze as faixas de ondas até a ilha do alto, três vezes. Na quarta batida, o jogo acaba.",
    "perdeu": "O Ellide foi engolido pelas ondas",
    "v1": "O Ellide atravessou a tempestade!",
    "v2": "Na saga, o Ellide resiste a uma tempestade levantada por duas feiticeiras. As faixas de ondas do jogo são invenção.",
    "h1": "Travessias",
    "h2": "Batidas"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Ellide in the storm",
    "sub": "The sorceresses have raised waves against the Ellide. Tap beside the ship, or swipe (or use the arrows), to go forward, back or sideways. Cross the bands of waves to the island at the top, three times. The fourth collision ends the game.",
    "perdeu": "The Ellide was swallowed by the waves",
    "v1": "The Ellide crossed the storm!",
    "v2": "In the saga, the Ellide withstands a storm raised by two sorceresses. The bands of waves in the game are made up.",
    "h1": "Crossings",
    "h2": "Collisions"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Ellide i stormen",
    "sub": "Trollkvinnene har reist bølger mot Ellide. Trykk ved siden av skipet, eller sveip (eller bruk piltastene), for å gå fram, tilbake eller sidelengs. Kryss bølgebeltene til øya øverst, tre ganger. Den fjerde kollisjonen avslutter spillet.",
    "perdeu": "Ellide ble slukt av bølgene",
    "v1": "Ellide kom seg gjennom stormen!",
    "v2": "I sagaen tåler Ellide en storm som to trollkvinner har reist. Bølgebeltene i spillet er diktet opp.",
    "h1": "Kryssinger",
    "h2": "Kollisjoner"
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
    var NEED = 3, MAXH = 4, LIM = 170, NR = 9;
    var cols = 11, sc = 0, sr = 0, ships = 0, lanes = [], hits = 0, tmr = LIM, inv = 0, flash = 0, sx = 0, sy = 0, dn = false, pop = 0, cross = 0;
    function lay() { var W = api.w, H = api.h, cs = Math.min((W - 20) / cols, (H - 96) / NR); return { cs: cs, x: (W - cs * cols) / 2, y: Math.max(66, (H - cs * NR) / 2 + 24) }; }
    function build2() {
      lanes = []; for (var r = 1; r < NR - 1; r++) { var dir = r % 2 ? 1 : -1, v = (0.6 + Math.random() * 0.7 + cross * 0.15) * dir, obs = [], k = 0, x = Math.random() * cols; var n = cols > 8 ? 2 : 1; for (k = 0; k < n; k++) obs.push({ x: (x + k * cols / n) % cols, len: 1 + Math.floor(Math.random() * 2) }); lanes.push({ v: v, obs: obs }); }
    }
    function setup() { cols = api.w >= api.h ? 11 : 7; cross = 0; build2(); sc = Math.floor(cols / 2); sr = 0; sx = sc; hits = 0; tmr = LIM; inv = 0; flash = 0; dn = false; }
    function reset() { setup(); st = 'play'; }
    function hitAt(c, r, t) { if (r < 1 || r > NR - 2) return false; var ln = lanes[r - 1]; for (var i = 0; i < ln.obs.length; i++) { var o = ln.obs[i], x = ((o.x + ln.v * t) % cols + cols) % cols; var d1 = ((c + 0.5 - x) % cols + cols) % cols, d2 = ((x + o.len - c - 0.5) % cols + cols) % cols; if (d1 < o.len + 0.45 && d1 > -0.45 || (c + 0.5 >= x - 0.15 && c + 0.5 <= x + o.len + 0.15) || (x + o.len > cols && c + 0.5 <= x + o.len - cols + 0.15)) return true; } return false; }
    function go(dc, dr) { if (st !== 'play') return; var nc = Math.max(0, Math.min(cols - 1, sx + dc)), nr = Math.max(0, Math.min(NR - 1, sr + dr)); sx = nc; sr = nr; if (api.nota) api.nota(380, 0.04, 'triangle', 0.04); if (sr === NR - 1) { cross++; if (cross >= NEED) { st = 'win'; return; } if (api.nota) api.nota(620, 0.12, 'triangle', 0.06); sr = 0; sx = Math.floor(cols / 2); build2(); } }
    var clk = 0;
    setup();
    return {
      pausar: function () { dn = false; },
      dbg: function () { var L = lay(); return { st: st, sx: sx, sr: sr, cols: cols, NR: NR, lanes: lanes.map(function (l) { return { v: l.v, obs: l.obs.map(function (o) { return { x: o.x, len: o.len }; }) }; }), hits: hits, cross: cross, inv: inv, t0: clk, x: L.x, y: L.y, cs: L.cs }; },
      down: function (x, y) { if (menu()) return; var L = lay(), cx = L.x + (sx + 0.5) * L.cs, cy = L.y + (NR - 1 - sr + 0.5) * L.cs, dx = x - cx, dy = y - cy; if (Math.abs(dx) > Math.abs(dy)) go(dx > 0 ? 1 : -1, 0); else go(0, dy < 0 ? 1 : -1); },
      up: function () { dn = false; },
      key: function (c, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (c === 'ArrowLeft' || c === 'KeyA') go(-1, 0); else if (c === 'ArrowRight' || c === 'KeyD') go(1, 0); else if (c === 'ArrowUp' || c === 'KeyW') go(0, 1); else if (c === 'ArrowDown' || c === 'KeyS') go(0, -1); },
      update: function (dt) {
        pop += dt; clk += dt; if (flash > 0) flash -= dt; if (inv > 0) inv -= dt; if (st !== 'play') return; tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; return; }
        for (var i = 0; i < lanes.length; i++) lanes[i].obs.forEach(function (o) { o.x = ((o.x + lanes[i].v * dt) % cols + cols) % cols; });
        if (inv <= 0 && sr >= 1 && sr <= NR - 2) { var ln = lanes[sr - 1]; for (var j = 0; j < ln.obs.length; j++) { var o = ln.obs[j]; for (var w = -1; w <= 1; w++) { var a = o.x + w * cols, b2 = a + o.len; if (sx + 0.15 < b2 && sx + 0.85 > a) { hits++; inv = 1; flash = 0.4; sr = 0; sx = Math.floor(cols / 2); if (api.nota) api.nota(130, 0.25, 'sawtooth', 0.07); if (hits >= MAXH) st = 'lose'; j = 99; break; } } } }
      },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), r, c;
        bg('#10202e', '#050a10');
        for (r = 0; r < NR; r++) { var y = L.y + (NR - 1 - r) * L.cs; g.fillStyle = r === 0 ? '#2a3a2a' : (r === NR - 1 ? '#3a5a3a' : (r % 2 ? '#183a58' : '#14304a')); g.fillRect(L.x, y, L.cs * cols, L.cs); }
        for (r = 1; r < NR - 1; r++) lanes[r - 1].obs.forEach(function (o) { for (var w = -1; w <= 1; w++) { var x = L.x + (o.x + w * cols) * L.cs; if (x + o.len * L.cs < L.x - 2 || x > L.x + cols * L.cs + 2) continue; g.fillStyle = '#d9e8f2'; rr(Math.max(x, L.x - 0), L.y + (NR - 1 - r) * L.cs + L.cs * 0.12, o.len * L.cs, L.cs * 0.76, 10); g.fill(); g.fillStyle = 'rgba(80,140,190,.6)'; g.fillRect(x + 6, L.y + (NR - 1 - r) * L.cs + L.cs * 0.4, Math.max(4, o.len * L.cs - 12), 3); } });
        txt('⚓', L.x + L.cs * cols / 2, L.y + L.cs * 0.7, L.cs * 0.6, '#cfe8cf');
        if (!(inv > 0 && Math.floor(pop * 12) % 2)) { var sx2 = L.x + sx * L.cs, sy2 = L.y + (NR - 1 - sr) * L.cs; g.fillStyle = '#c9a07a'; rr(sx2 + L.cs * 0.12, sy2 + L.cs * 0.3, L.cs * 0.76, L.cs * 0.4, 8); g.fill(); g.fillStyle = '#f3ecd2'; g.fillRect(sx2 + L.cs * 0.46, sy2 + L.cs * 0.08, 3, L.cs * 0.3); g.fillStyle = '#d9573a'; g.fillRect(sx2 + L.cs * 0.3, sy2 + L.cs * 0.1, L.cs * 0.3, L.cs * 0.2); }
        if (flash > 0) { g.fillStyle = 'rgba(200,40,40,' + flash * 0.3 + ')'; g.fillRect(0, 0, W, H); }
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 30 ? '#c0392b' : '#4a90c0');
        hud(T.h1 + ' ' + cross + '/' + NEED, T.h2 + ' ' + hits + '/' + MAXH, hits > 0);
        fim(st);
      }
    };
  }
});
