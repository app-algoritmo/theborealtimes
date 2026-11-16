/* Þormóðr — acerte os alvos com o vento contra você. */
BTJogo.registrar({
  canvas: 'jogo-thormod',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O arco de Thormod",
    "sub": "Mova o ponteiro (ou ↑ ↓) para mirar. Segure o toque (ou o espaço) para carregar a força e solte para atirar. O vento muda a cada flecha: observe a bandeira. Acerte 5 alvos com 8 flechas.",
    "perdeu": "As flechas acabaram",
    "v1": "Cinco alvos atingidos!",
    "v2": "Na Fóstbrœðra saga, Thormod luta em Stiklestad ao lado de Olavo e depois compõe versos. As flechas do jogo são invenção.",
    "h1": "Alvos",
    "h2": "Flechas",
    "w": "Vento"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Thormod's bow",
    "sub": "Move the pointer (or ↑ ↓) to aim. Hold the touch (or Space) to charge power and release to shoot. The wind changes with every arrow: watch the flag. Hit 5 targets with 8 arrows.",
    "perdeu": "The arrows ran out",
    "v1": "Five targets hit!",
    "v2": "In Fóstbrœðra saga, Thormod fights at Stiklestad beside Olaf and later composes verses. The arrows in the game are made up.",
    "h1": "Targets",
    "h2": "Arrows",
    "w": "Wind"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Tormods bue",
    "sub": "Flytt pekeren (eller ↑ ↓) for å sikte. Hold nede trykket (eller mellomrom) for å lade styrken, og slipp for å skyte. Vinden skifter for hver pil: se på flagget. Treff 5 skiver med 8 piler.",
    "perdeu": "Pilene var brukt opp",
    "v1": "Fem skiver truffet!",
    "v2": "I Fóstbrœðra saga kjemper Tormod ved Stiklestad ved siden av Olav og lager senere vers. Pilene i spillet er diktet opp.",
    "h1": "Skiver",
    "h2": "Piler",
    "w": "Vind"
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
    var GOAL = 5, ARROWS = 8;
    var hits = 0, left = ARROWS, ang = 0.7, ch = 0, charging = false, phase = 'ready', ar = null, wind = 0, tx = 0, ty = 0, wait = 0, pop = 0, flash = 0, trail = [];
    function lay() { var W = api.w, H = api.h, s = Math.min(W, H) / 450; return { W: W, H: H, s: s, ax: W * 0.09, ay: H * 0.8, gnd: H * 0.87, vmax: W * 1.1, grav: W * 0.9, r: 26 * s }; }
    function newTarget() { var L = lay(); tx = L.W * (0.5 + Math.random() * 0.4); ty = L.ay - (50 + Math.random() * 170) * L.s; }
    function newWind() { var L = lay(); wind = (Math.random() * 2 - 1) * L.W * 0.12; }
    function setup() { hits = 0; left = ARROWS; ang = 0.7; ch = 0; charging = false; phase = 'ready'; ar = null; wait = 0; flash = 0; trail = []; newTarget(); newWind(); }
    function reset() { setup(); st = 'play'; }
    function sim(a, p) { var L = lay(), x = L.ax, y = L.ay, vx = Math.cos(a) * L.vmax * p, vy = -Math.sin(a) * L.vmax * p, t = 0, md = 1e9, dt = 1 / 120; while (t < 5) { vx += wind * dt; vy += L.grav * dt; x += vx * dt; y += vy * dt; t += dt; var d = Math.hypot(x - tx, y - ty); if (d < md) md = d; if (y > L.gnd || x > L.W * 1.2 || x < -50) break; } return md; }
    function fire() { if (phase !== 'charge') return; var L = lay(), p = Math.max(0.25, ch); ar = { x: L.ax, y: L.ay, vx: Math.cos(ang) * L.vmax * p, vy: -Math.sin(ang) * L.vmax * p }; trail = []; phase = 'fly'; charging = false; ch = 0; left--; if (api.nota) api.nota(300, 0.08, 'triangle', 0.05); }
    function aim(x, y) { var L = lay(); ang = Math.max(0.05, Math.min(1.4, Math.atan2(L.ay - y, x - L.ax))); }
    function endShot(hit) { ar = null; phase = 'wait'; wait = 0.7; if (hit) { hits++; flash = 0.6; if (api.nota) api.nota(700, 0.15, 'triangle', 0.06); if (hits >= GOAL) { st = 'win'; return; } newTarget(); } newWind(); if (!hit && left <= 0) st = 'lose'; if (hit && left <= 0 && hits < GOAL) st = 'lose'; }
    setup();
    return {
      pausar: function () { if (phase === 'charge') { phase = 'ready'; charging = false; ch = 0; } },
      dbg: function () { var L = lay(); return { st: st, phase: phase, hits: hits, left: left, ax: L.ax, ay: L.ay, tx: tx, ty: ty, r: L.r, wind: wind, ang: ang, ch: ch, sim: sim }; },
      down: function (x, y) { if (menu()) return; if (phase !== 'ready') return; aim(x, y); phase = 'charge'; charging = true; ch = 0; },
      move: function (x, y, pr) { if (st === 'play' && (phase === 'ready' || phase === 'charge')) aim(x, y); },
      up: function () { fire(); },
      key: function (k, d) { if (!d && k === 'Space') { fire(); return; } if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'ArrowUp' || k === 'KeyW') ang = Math.min(1.4, ang + 0.03); else if (k === 'ArrowDown' || k === 'KeyS') ang = Math.max(0.05, ang - 0.03); else if (k === 'Space' && phase === 'ready') { phase = 'charge'; charging = true; ch = 0; } },
      update: function (dt) {
        pop += dt; if (flash > 0) flash -= dt; if (st !== 'play' && st !== 'win' && st !== 'lose') return;
        if (phase === 'charge') ch = Math.min(1, ch + dt * 0.8);
        if (phase === 'wait') { wait -= dt; if (wait <= 0 && st === 'play') phase = 'ready'; }
        if (phase === 'fly' && ar && st === 'play') { var L = lay(), n = 4, i; for (i = 0; i < n; i++) { var h = dt / n; ar.vx += wind * h; ar.vy += L.grav * h; ar.x += ar.vx * h; ar.y += ar.vy * h; if (Math.hypot(ar.x - tx, ar.y - ty) < L.r) { endShot(true); return; } if (ar.y > L.gnd || ar.x > L.W + 40 || ar.x < -40) { endShot(false); return; } } trail.push([ar.x, ar.y]); if (trail.length > 30) trail.shift(); }
      },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), i;
        bg('#1a2f45', '#0a1420');
        g.fillStyle = '#2a3a2a'; g.fillRect(0, L.gnd, W, H - L.gnd);
        for (i = 0; i < 3; i++) { g.fillStyle = 'rgba(255,255,255,.05)'; g.beginPath(); g.arc(W * (0.2 + i * 0.3), L.gnd, 90 * L.s, Math.PI, 0); g.fill(); }
        // alvo
        var rr0 = L.r; [1, 0.72, 0.44, 0.2].forEach(function (f, k) { g.fillStyle = k % 2 ? '#e8e0c8' : '#c0392b'; if (flash > 0 && k === 3) g.fillStyle = '#ffd88a'; g.beginPath(); g.arc(tx, ty, rr0 * f, 0, 6.283); g.fill(); });
        g.strokeStyle = '#6a4a2a'; g.lineWidth = 4; g.beginPath(); g.moveTo(tx, ty + rr0); g.lineTo(tx, L.gnd); g.stroke();
        // arqueiro
        g.fillStyle = '#d8c8a0'; g.beginPath(); g.arc(L.ax, L.ay - 18 * L.s, 8 * L.s, 0, 6.283); g.fill(); g.fillStyle = '#6a4a2a'; g.fillRect(L.ax - 6 * L.s, L.ay - 10 * L.s, 12 * L.s, 30 * L.s);
        g.strokeStyle = '#c8a060'; g.lineWidth = 3; g.beginPath(); g.arc(L.ax, L.ay, 24 * L.s, -ang - 1.1, -ang + 1.1); g.stroke();
        if (phase === 'ready' || phase === 'charge') { g.strokeStyle = 'rgba(255,216,138,.55)'; g.lineWidth = 2; g.setLineDash([6, 6]); g.beginPath(); g.moveTo(L.ax, L.ay); g.lineTo(L.ax + Math.cos(ang) * 70 * L.s, L.ay - Math.sin(ang) * 70 * L.s); g.stroke(); g.setLineDash([]); }
        if (ar) { g.strokeStyle = 'rgba(255,255,255,.25)'; g.lineWidth = 2; g.beginPath(); trail.forEach(function (p, k) { if (k) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); }); g.stroke(); var a2 = Math.atan2(ar.vy, ar.vx); g.strokeStyle = '#fff'; g.lineWidth = 3; g.beginPath(); g.moveTo(ar.x - Math.cos(a2) * 16, ar.y - Math.sin(a2) * 16); g.lineTo(ar.x + Math.cos(a2) * 6, ar.y + Math.sin(a2) * 6); g.stroke(); }
        // bandeira de vento
        var wx = W - 90 * L.s - 10, wy = 100; g.strokeStyle = '#ccc'; g.lineWidth = 2; g.beginPath(); g.moveTo(wx, wy + 30); g.lineTo(wx, wy - 10); g.stroke(); var fl = wind / (W * 0.12); g.fillStyle = '#ffd88a'; g.beginPath(); g.moveTo(wx, wy - 10); g.lineTo(wx + fl * 40 + (fl >= 0 ? 4 : -4), wy - 2 + Math.sin(pop * 6) * 2); g.lineTo(wx, wy + 6); g.closePath(); g.fill(); txt(T.w, wx, wy + 50, 12, '#cfd8dc');
        bar(L.ax - 30, L.ay + 34 * L.s, 60, 6, ch, '#ffd88a');
        hud(T.h1 + ' ' + hits + '/' + GOAL, T.h2 + ' ' + left, left <= 2 && hits < GOAL - 1);
        fim(st);
      }
    };
  }
});
