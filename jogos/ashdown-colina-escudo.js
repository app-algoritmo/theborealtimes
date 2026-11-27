/* Ashdown — defenda a colina contra as fileiras que descem. */
BTJogo.registrar({
  canvas: 'jogo-ashdown',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A colina de Ashdown",
    "sub": "Arraste o dedo (ou use ← →) para mover seu guerreiro; ele lança uma lança a cada instante. Derrube as 18 figuras que descem em fileiras e desvie das lanças delas. Você tem 3 vidas; não deixe as fileiras chegarem à sua altura.",
    "perdeu": "A colina caiu",
    "v1": "A colina está defendida!",
    "v2": "Em janeiro de 871, os saxões do Oeste venceram os vikings em Ashdown. O jogo de atirar de baixo é invenção.",
    "h1": "Derrubados",
    "h2": "Vidas"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The hill of Ashdown",
    "sub": "Drag your finger (or use ← →) to move your warrior; he throws a spear all the time. Bring down the 18 figures coming down in rows and dodge their spears. You have 3 lives; do not let the rows reach your level.",
    "perdeu": "The hill fell",
    "v1": "The hill is defended!",
    "v2": "In January 871, the West Saxons defeated the Vikings at Ashdown. The game of firing from below is made up.",
    "h1": "Downed",
    "h2": "Lives"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Høyden ved Ashdown",
    "sub": "Dra fingeren (eller bruk ← →) for å flytte krigeren din; han kaster et spyd hele tiden. Fell de 18 figurene som kommer nedover i rader, og unngå spydene deres. Du har 3 liv; ikke la radene nå ned til deg.",
    "perdeu": "Høyden falt",
    "v1": "Høyden er forsvart!",
    "v2": "I januar 871 beseiret vestsakserne vikingene ved Ashdown. Spillet med å skyte nedenfra er diktet opp.",
    "h1": "Felt",
    "h2": "Liv"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "La colina de Ashdown",
    "sub": "Arrastra el dedo (o usa ← →) para mover a tu guerrero; lanza una lanza a cada instante. Derriba las 18 figuras que bajan en filas y esquiva sus lanzas. Tienes 3 vidas; no dejes que las filas lleguen a tu altura.",
    "perdeu": "La colina cayó",
    "v1": "¡La colina está defendida!",
    "v2": "En enero de 871, los sajones occidentales vencieron a los vikingos en Ashdown. El juego de lanzar desde abajo es un invento.",
    "h1": "Derribados",
    "h2": "Vidas"
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
    var NR = 3, NC = 6, GOAL = NR * NC;
    var inv = [], px = 0, tgt = 0, shots = [], bombs = [], lives = 3, dir = 1, off = 0, yoff = 0, fire = 0, bomb = 0, kl = 0, kr = 0, kills = 0, flash = 0, inv_t = 0;
    function lay() { var W = api.w, H = api.h, s = Math.max(0.8, Math.min(1.4, Math.min(W, H) / 450)); return { W: W, H: H, s: s, py: H - 50 * s, top: 96, gx: 58 * s, gy: 34 * s }; }
    function setup() { var L = lay(); inv = []; for (var r = 0; r < NR; r++) for (var c = 0; c < NC; c++) inv.push({ r: r, c: c, a: true }); px = tgt = L.W / 2; shots = []; bombs = []; lives = 3; dir = 1; off = 0; yoff = 0; fire = 0; bomb = 1.5; kills = 0; flash = 0; inv_t = 0; }
    function reset() { setup(); st = 'play'; }
    function ipos(i) { var L = lay(); var gw = (NC - 1) * L.gx; return { x: L.W / 2 - gw / 2 + i.c * L.gx + off, y: L.top + i.r * L.gy + yoff }; }
    setup();
    return {
      pausar: function () { kl = kr = 0; },
      dbg: function () { var L = lay(); return { st: st, px: px, py: L.py, inv: inv.filter(function (i) { return i.a; }).map(function (i) { var p = ipos(i); return { x: p.x, y: p.y }; }), bombs: bombs.map(function (b) { return { x: b.x, y: b.y }; }), shots: shots.length, lives: lives, kills: kills, goal: GOAL, W: L.W }; },
      down: function (x, y) { if (menu()) return; tgt = x; },
      move: function (x, y, pr) { if (st === 'play' && pr) tgt = x; },
      up: function () {},
      key: function (k, d) { if (k === 'ArrowLeft' || k === 'KeyA') kl = d ? 1 : 0; else if (k === 'ArrowRight' || k === 'KeyD') kr = d ? 1 : 0; else if (d && st !== 'play') menu(); },
      update: function (dt) {
        if (flash > 0) flash -= dt; if (st !== 'play') return; var L = lay(); inv_t += dt;
        if (kl || kr) tgt = Math.max(20, Math.min(L.W - 20, tgt + (kr - kl) * 520 * L.s * dt)); var d = tgt - px, mx = 560 * L.s * dt; px += Math.max(-mx, Math.min(mx, d));
        fire -= dt; if (fire <= 0) { shots.push({ x: px, y: L.py - 16 * L.s }); fire = 0.55; }
        var alive = inv.filter(function (i) { return i.a; }); var sp = (26 + (GOAL - alive.length) * 3.2) * L.s; off += dir * sp * dt; yoff += 7 * L.s * dt; var minx = 1e9, maxx = -1e9, maxy = 0; alive.forEach(function (i) { var p = ipos(i); minx = Math.min(minx, p.x); maxx = Math.max(maxx, p.x); maxy = Math.max(maxy, p.y); });
        if (maxx > L.W - 24 || minx < 24) { dir = -dir; off += dir * 6; yoff += 14 * L.s; }
        if (maxy >= L.py - 18 * L.s) { st = 'lose'; if (api.nota) api.nota(110, 0.4, 'sawtooth', 0.07); return; }
        bomb -= dt; if (bomb <= 0 && alive.length) { var a = alive[Math.floor(Math.random() * alive.length)], p = ipos(a); bombs.push({ x: p.x, y: p.y + 10 }); bomb = 0.9 - Math.min(0.4, kills * 0.02) + Math.random() * 0.6; }
        for (var i = shots.length - 1; i >= 0; i--) { var s = shots[i]; s.y -= 420 * L.s * dt; var hitI = null; for (var k = 0; k < inv.length; k++) { var v = inv[k]; if (!v.a) continue; var q = ipos(v); if (Math.abs(q.x - s.x) < 13 * L.s && Math.abs(q.y - s.y) < 14 * L.s) { hitI = v; break; } } if (hitI) { hitI.a = false; kills++; shots.splice(i, 1); if (api.nota) api.nota(480 + kills * 20, 0.06, 'triangle', 0.05); if (kills >= GOAL) { st = 'win'; return; } } else if (s.y < 0) shots.splice(i, 1); }
        for (var j = bombs.length - 1; j >= 0; j--) { var bb = bombs[j]; bb.y += 190 * L.s * dt; if (Math.abs(bb.x - px) < 16 * L.s && Math.abs(bb.y - L.py) < 14 * L.s) { bombs.splice(j, 1); lives--; flash = 0.4; if (api.nota) api.nota(110, 0.25, 'sawtooth', 0.07); if (lives <= 0) { st = 'lose'; return; } } else if (bb.y > L.H) bombs.splice(j, 1); }
      },
      draw: function () {
        var L = lay(), W = L.W, H = L.H, s = L.s, i;
        bg('#1e2a3a', '#06090e');
        g.fillStyle = '#2a3a2a'; g.beginPath(); g.moveTo(0, H); g.lineTo(0, H - 30 * s); g.quadraticCurveTo(W / 2, H - 70 * s, W, H - 30 * s); g.lineTo(W, H); g.closePath(); g.fill();
        inv.forEach(function (v) { if (!v.a) return; var p = ipos(v); g.fillStyle = '#8a2a2a'; rr(p.x - 14 * s, p.y - 10 * s, 28 * s, 20 * s, 6); g.fill(); g.fillStyle = '#c9a050'; g.beginPath(); g.arc(p.x, p.y - 12 * s, 7 * s, 0, 6.283); g.fill(); g.fillStyle = '#fff'; g.fillRect(p.x - 6 * s, p.y - 3 * s, 3 * s, 3 * s); g.fillRect(p.x + 3 * s, p.y - 3 * s, 3 * s, 3 * s); });
        g.fillStyle = '#ffd88a'; shots.forEach(function (q) { g.fillRect(q.x - 1.5 * s, q.y - 8 * s, 3 * s, 14 * s); });
        g.fillStyle = '#e06a4a'; bombs.forEach(function (q) { g.fillRect(q.x - 2 * s, q.y - 6 * s, 4 * s, 12 * s); });
        g.fillStyle = '#4a8ad0'; rr(px - 14 * s, L.py - 8 * s, 28 * s, 22 * s, 6); g.fill(); g.fillStyle = '#e8c9a0'; g.beginPath(); g.arc(px, L.py - 12 * s, 7 * s, 0, 6.283); g.fill(); g.fillStyle = '#ffd88a'; g.fillRect(px - 1.5 * s, L.py - 30 * s, 3 * s, 20 * s);
        if (flash > 0) { g.fillStyle = 'rgba(192,57,43,' + flash * 0.4 + ')'; g.fillRect(0, 0, W, H); }
        hud(T.h1 + ' ' + kills + '/' + GOAL, T.h2 + ' ' + lives, lives <= 1);
        fim(st);
      }
    };
  }
});
