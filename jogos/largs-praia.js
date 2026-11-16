/* Largs 1263 — defenda a praia dos navios que encalham. */
BTJogo.registrar({
  canvas: 'jogo-largs',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A praia de Largs",
    "sub": "Deslize o dedo (ou use ← → / A D) para mover o seu navio; ele atira sozinho. Derrube os 18 barcos atacantes antes que cheguem à praia. Cuidado com as flechas deles: você tem 3 navios.",
    "perdeu": "A praia foi tomada",
    "v1": "Os atacantes foram repelidos!",
    "v2": "Em 1263 a frota do rei Haakon, atingida por tempestades, lutou em terra perto de Largs. A defesa da praia no jogo é invenção.",
    "h1": "Abatidos",
    "h2": "Navios"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The beach at Largs",
    "sub": "Slide your finger (or use ← → / A D) to move your ship; it fires by itself. Bring down the 18 attacking boats before they reach the beach. Watch their arrows: you have 3 ships.",
    "perdeu": "The beach was taken",
    "v1": "The attackers were beaten back!",
    "v2": "In 1263 King Haakon's fleet, battered by storms, fought ashore near Largs. The beach defence in the game is made up.",
    "h1": "Downed",
    "h2": "Ships"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Stranden ved Largs",
    "sub": "Skyv fingeren (eller bruk ← → / A D) for å flytte skipet ditt; det skyter av seg selv. Skyt ned de 18 angripende båtene før de når stranden. Pass på pilene deres: du har 3 skip.",
    "perdeu": "Stranden ble inntatt",
    "v1": "Angriperne ble slått tilbake!",
    "v2": "I 1263 kjempet kong Håkons flåte, hardt rammet av storm, på land ved Largs. Strandforsvaret i spillet er diktet opp.",
    "h1": "Nedskutt",
    "h2": "Skip"
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
    var COLS = 6, ROWS = 3, TOT = COLS * ROWS;
    var en = [], fx = 0, fy = 0, fdir = 1, px = 0, tx = 0, shots = [], eshots = [], lives = 3, inv = 0, kills = 0, cd = 0, ecd = 1.2, pop = 0, keyL = false, keyR = false;
    function lay() { var W = api.w, H = api.h, s = Math.min(W / 800, H / 450) * 1.0; s = Math.max(0.7, Math.min(1.6, s)); var sp = Math.min(W / (COLS + 1.6), 66 * s * 1.2); return { W: W, H: H, s: s, sp: sp, fw: sp * COLS, ply: H - 56 * s, top: 90 }; }
    function setup() { var L = lay(); en = []; for (var r = 0; r < ROWS; r++) for (var c = 0; c < COLS; c++) en.push({ c: c, r: r, a: true }); fx = (L.W - L.fw) / 2; fy = L.top + 10; fdir = 1; px = L.W / 2; tx = px; shots = []; eshots = []; lives = 3; inv = 0; kills = 0; cd = 0; ecd = 1.2; }
    function reset() { setup(); st = 'play'; }
    function epos(e) { var L = lay(); return { x: fx + e.c * L.sp + L.sp / 2, y: fy + e.r * L.sp * 0.8 }; }
    function alive() { return en.filter(function (e) { return e.a; }); }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, px: px, W: L.W, ply: L.ply, lives: lives, kills: kills, en: alive().map(function (e) { var p = epos(e); return { x: p.x, y: p.y, c: e.c }; }), es: eshots.map(function (b) { return { x: b.x, y: b.y }; }), sp: L.sp }; },
      down: function (x, y) { if (menu()) return; tx = x; },
      move: function (x, y, pr) { if (pr && st === 'play') tx = x; },
      key: function (k, d) { if (k === 'ArrowLeft' || k === 'KeyA') keyL = d; else if (k === 'ArrowRight' || k === 'KeyD') keyR = d; else if (d && st !== 'play') menu(); },
      update: function (dt) {
        pop += dt; if (st !== 'play') return; var L = lay(), i;
        if (keyL) tx = px - 200; if (keyR) tx = px + 200; tx = Math.max(24, Math.min(L.W - 24, tx));
        var mvp = 330 * L.s * dt; if (Math.abs(tx - px) <= mvp) px = tx; else px += mvp * (tx > px ? 1 : -1);
        cd -= dt; if (cd <= 0) { cd = 0.42; shots.push({ x: px, y: L.ply - 14 }); if (api.nota) api.nota(500, 0.03, 'square', 0.015); }
        var al = alive(); var spd = (26 + kills * 3.2) * L.s; fx += fdir * spd * dt; var minc = 9, maxc = -1; al.forEach(function (e) { if (e.c < minc) minc = e.c; if (e.c > maxc) maxc = e.c; });
        if (al.length) { if (fx + maxc * L.sp + L.sp > L.W - 8 && fdir > 0) { fdir = -1; fy += 14 * L.s; } else if (fx + minc * L.sp < 8 && fdir < 0) { fdir = 1; fy += 14 * L.s; } }
        ecd -= dt; if (ecd <= 0 && al.length) { ecd = 0.8 + Math.random() * 0.7; var bot = {}; al.forEach(function (e) { if (!bot[e.c] || e.r > bot[e.c].r) bot[e.c] = e; }); var ks = Object.keys(bot); var pe = bot[ks[Math.floor(Math.random() * ks.length)]]; var p = epos(pe); eshots.push({ x: p.x, y: p.y + 10 }); }
        shots.forEach(function (b) { b.y -= 420 * L.s * dt; }); eshots.forEach(function (b) { b.y += 190 * L.s * dt; });
        shots = shots.filter(function (b) { if (b.y < 60) return false; for (var k = 0; k < en.length; k++) { var e = en[k]; if (!e.a) continue; var p = epos(e); if (Math.abs(b.x - p.x) < L.sp * 0.4 && Math.abs(b.y - p.y) < L.sp * 0.32) { e.a = false; kills++; if (api.nota) api.nota(220, 0.1, 'sawtooth', 0.05); return false; } } return true; });
        if (kills >= TOT) { st = 'win'; return; }
        if (inv > 0) inv -= dt;
        eshots = eshots.filter(function (b) { if (b.y > L.H) return false; if (inv <= 0 && Math.abs(b.x - px) < 20 * L.s && Math.abs(b.y - L.ply) < 18 * L.s) { lives--; inv = 1.2; if (api.nota) api.nota(110, 0.25, 'sawtooth', 0.07); if (lives <= 0) st = 'lose'; return false; } return true; });
        al = alive(); for (i = 0; i < al.length; i++) { if (epos(al[i]).y > L.ply - 30 * L.s) { st = 'lose'; return; } }
      },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), i;
        bg('#14344a', '#08141e');
        g.fillStyle = '#c8b480'; g.fillRect(0, H - 34 * L.s, W, 34 * L.s);
        for (i = 0; i < en.length; i++) { var e = en[i]; if (!e.a) continue; var p = epos(e), w = L.sp * 0.62; g.fillStyle = '#7a3a2a'; g.beginPath(); g.moveTo(p.x - w / 2, p.y); g.lineTo(p.x + w / 2, p.y); g.lineTo(p.x + w * 0.3, p.y + w * 0.35); g.lineTo(p.x - w * 0.3, p.y + w * 0.35); g.closePath(); g.fill(); g.fillStyle = '#e8e0c8'; g.fillRect(p.x - 1.5, p.y - w * 0.5, 3, w * 0.5); g.fillStyle = '#c0392b'; g.fillRect(p.x + 1.5, p.y - w * 0.5, w * 0.3, w * 0.32); }
        shots.forEach(function (b) { g.fillStyle = '#ffd88a'; g.fillRect(b.x - 2, b.y - 8, 4, 12); }); eshots.forEach(function (b) { g.strokeStyle = '#e8c0c0'; g.lineWidth = 2; g.beginPath(); g.moveTo(b.x, b.y - 8); g.lineTo(b.x, b.y + 6); g.stroke(); });
        if (inv <= 0 || Math.floor(pop * 12) % 2) { g.fillStyle = '#4a6a8a'; g.beginPath(); g.moveTo(px - 24 * L.s, L.ply); g.lineTo(px + 24 * L.s, L.ply); g.lineTo(px + 14 * L.s, L.ply + 16 * L.s); g.lineTo(px - 14 * L.s, L.ply + 16 * L.s); g.closePath(); g.fill(); g.fillStyle = '#e8e0c8'; g.fillRect(px - 1.5, L.ply - 22 * L.s, 3, 22 * L.s); g.fillStyle = '#ffd88a'; g.fillRect(px + 1.5, L.ply - 22 * L.s, 14 * L.s, 12 * L.s); }
        hud(T.h1 + ' ' + kills + '/' + TOT, T.h2 + ' ' + lives, lives <= 1);
        fim(st);
      }
    };
  }
});
