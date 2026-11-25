/* Lemminkäinen — recolha os pedaços no rio sem ser alcançado pelo cisne. */
BTJogo.registrar({
  canvas: 'jogo-lemminkainen',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O rio de Tuonela",
    "sub": "Mova-se pelos canais do rio. Setas ou WASD, ou toque na direção para onde quer ir. Recolha os 8 pedaços do filho. O cisne negro persegue você: se ele alcançar, você perde uma vida. Você tem 3 vidas.",
    "perdeu": "O cisne negro alcançou você",
    "v1": "Todos os pedaços foram recolhidos!",
    "v2": "No Kalevala, a mãe de Lemminkäinen recolhe do rio de Tuonela os pedaços do filho com um rastelo. O cisne perseguidor do jogo é invenção.",
    "h1": "Pedaços",
    "h2": "Vidas"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The river of Tuonela",
    "sub": "Move through the channels of the river. Arrows or WASD, or tap in the direction you want to go. Collect the 8 pieces of the son. The black swan chases you: if it catches you, you lose a life. You have 3 lives.",
    "perdeu": "The black swan caught you",
    "v1": "All the pieces were gathered!",
    "v2": "In the Kalevala, Lemminkäinen's mother rakes his pieces out of the river of Tuonela. The chasing swan in the game is made up.",
    "h1": "Pieces",
    "h2": "Lives"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Elva i Tuonela",
    "sub": "Beveg deg gjennom elvas kanaler. Piltaster eller WASD, eller trykk i retningen du vil gå. Samle de 8 delene av sønnen. Den svarte svanen jager deg: tar den deg, mister du et liv. Du har 3 liv.",
    "perdeu": "Den svarte svanen tok deg",
    "v1": "Alle delene er samlet!",
    "v2": "I Kalevala river Lemminkäinens mor opp delene hans fra elva i Tuonela. Den jagende svanen i spillet er diktet opp.",
    "h1": "Deler",
    "h2": "Liv"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "El río de Tuonela",
    "sub": "Muévete por los canales del río. Flechas o WASD, o toca la dirección hacia la que quieres ir. Recoge los 8 pedazos del hijo. El cisne negro te persigue: si te alcanza, pierdes una vida. Tienes 3 vidas.",
    "perdeu": "El cisne negro te alcanzó",
    "v1": "¡Se recogieron todos los pedazos!",
    "v2": "En el Kalevala, la madre de Lemminkäinen recoge del río de Tuonela los pedazos de su hijo con un rastrillo. El cisne perseguidor del juego es invención.",
    "h1": "Pedazos",
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
    var MAP = ['###############', '#.............#', '#.###.###.###.#', '#.............#', '#.#.#######.#.#', '#.............#', '#.###.###.###.#', '#.............#', '###############'];
    var NP = 8, MW = 15, MH = 9;
    var P, S, pcs = [], got = 0, lives = 3, inv = 0, want = [0, 0], pop = 0, frz = 0, sp0 = 4.0;
    function open(x, y) { return x >= 0 && y >= 0 && x < MW && y < MH && MAP[y][x] !== '#'; }
    function lay() { var W = api.w, H = api.h, cs = Math.min((W - 16) / MW, (H - 150) / MH, 54); return { cs: cs, x: (W - cs * MW) / 2, y: Math.max(82, (H - cs * MH) / 2 + 10) }; }
    function ent(x, y) { return { cx: x, cy: y, dx: 0, dy: 0, t: 0 }; }
    function ex(e) { return e.cx + e.dx * e.t; } function ey(e) { return e.cy + e.dy * e.t; }
    function setup() { P = ent(7, 7); S = ent(7, 1); got = 0; lives = 3; inv = 0; want = [0, 0]; frz = 1.2; pcs = [];
      var cand = []; for (var y = 0; y < MH; y++) for (var x = 0; x < MW; x++) if (open(x, y) && Math.abs(x - 7) + Math.abs(y - 7) > 3 && Math.abs(x - 7) + Math.abs(y - 1) > 2) cand.push([x, y]);
      for (var i = 0; i < NP; i++) { var k = Math.floor(Math.random() * cand.length); pcs.push({ x: cand[k][0], y: cand[k][1] }); cand.splice(k, 1); } }
    function reset() { setup(); st = 'play'; }
    function stepP(e, dt, sp, pick) {
      var rem = sp * dt, guard = 0;
      while (rem > 0 && guard++ < 8) {
        if (!e.dx && !e.dy) { var d = pick(e); if (!d) return; e.dx = d[0]; e.dy = d[1]; e.t = 0; }
        var need = 1 - e.t; if (rem < need) { e.t += rem; rem = 0; } else { rem -= need; e.cx += e.dx; e.cy += e.dy; e.t = 0; var d2 = pick(e); if (d2) { e.dx = d2[0]; e.dy = d2[1]; } else { e.dx = 0; e.dy = 0; } }
      }
    }
    function pickP(e) { if ((want[0] || want[1]) && open(e.cx + want[0], e.cy + want[1])) return [want[0], want[1]]; if ((e.dx || e.dy) && open(e.cx + e.dx, e.cy + e.dy)) return [e.dx, e.dy]; return null; }
    function pickS(e) {
      var dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]], ok = dirs.filter(function (d) { return open(e.cx + d[0], e.cy + d[1]) && !(d[0] === -e.dx && d[1] === -e.dy && (e.dx || e.dy)); }); if (!ok.length) ok = dirs.filter(function (d) { return open(e.cx + d[0], e.cy + d[1]); });
      if (Math.random() < 0.2) return ok[Math.floor(Math.random() * ok.length)];
      var best = ok[0], bd = 1e9; ok.forEach(function (d) { var q = Math.abs(e.cx + d[0] - ex(P)) + Math.abs(e.cy + d[1] - ey(P)) + Math.random() * 0.5; if (q < bd) { bd = q; best = d; } }); return best;
    }
    function steer(dx, dy) { want = [dx, dy]; if (P.dx === -dx && P.dy === -dy && (dx || dy)) { P.cx += P.dx; P.cy += P.dy; P.dx = dx; P.dy = dy; P.t = 1 - P.t; } else if (!P.dx && !P.dy && open(P.cx + dx, P.cy + dy)) { P.dx = dx; P.dy = dy; P.t = 0; } }
    setup();
    return {
      pausar: function () {},
      dbg: function () { return { st: st, px: ex(P), py: ey(P), pcx: P.cx, pcy: P.cy, pdx: P.dx, pdy: P.dy, sx: ex(S), sy: ey(S), pcs: pcs.map(function (p) { return { x: p.x, y: p.y }; }), got: got, lives: lives, MAP: MAP, inv: inv }; },
      down: function (x, y) { if (menu()) return; var L = lay(), px = L.x + (ex(P) + 0.5) * L.cs, py = L.y + (ey(P) + 0.5) * L.cs, ddx = x - px, ddy = y - py; if (Math.abs(ddx) > Math.abs(ddy)) steer(ddx > 0 ? 1 : -1, 0); else steer(0, ddy > 0 ? 1 : -1); },
      move: function (x, y, pr) { if (pr) this.down(x, y); },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'ArrowUp' || k === 'KeyW') steer(0, -1); else if (k === 'ArrowDown' || k === 'KeyS') steer(0, 1); else if (k === 'ArrowLeft' || k === 'KeyA') steer(-1, 0); else if (k === 'ArrowRight' || k === 'KeyD') steer(1, 0); },
      update: function (dt) {
        pop += dt; if (inv > 0) inv -= dt; if (st !== 'play') return;
        if (frz > 0) { frz -= dt; return; }
        stepP(P, dt, sp0, pickP); stepP(S, dt, 3.8 + got * 0.08, pickS);
        for (var i = pcs.length - 1; i >= 0; i--) if (Math.hypot(pcs[i].x - ex(P), pcs[i].y - ey(P)) < 0.55) { pcs.splice(i, 1); got++; if (api.nota) api.nota(520 + got * 40, 0.1, 'triangle', 0.06); }
        if (got >= NP) { st = 'win'; return; }
        if (inv <= 0 && Math.hypot(ex(S) - ex(P), ey(S) - ey(P)) < 0.6) { lives--; if (api.nota) api.nota(120, 0.25, 'sawtooth', 0.07); if (lives <= 0) { st = 'lose'; return; } inv = 1.5; frz = 1.0; P = ent(7, 7); S = ent(7, 1); want = [0, 0]; }
      },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), x, y;
        bg('#0c1a2a', '#04080e');
        for (y = 0; y < MH; y++) for (x = 0; x < MW; x++) { g.fillStyle = MAP[y][x] === '#' ? '#1c2a1c' : 'rgba(40,90,140,.35)'; g.fillRect(L.x + x * L.cs + 1, L.y + y * L.cs + 1, L.cs - 2, L.cs - 2); }
        pcs.forEach(function (p) { g.fillStyle = '#ffd88a'; g.beginPath(); g.arc(L.x + (p.x + 0.5) * L.cs, L.y + (p.y + 0.5) * L.cs, L.cs * (0.17 + 0.03 * Math.sin(pop * 6)), 0, 6.283); g.fill(); });
        var sx = L.x + (ex(S) + 0.5) * L.cs, sy = L.y + (ey(S) + 0.5) * L.cs; g.fillStyle = '#10101a'; g.beginPath(); g.arc(sx, sy, L.cs * 0.36, 0, 6.283); g.fill(); g.strokeStyle = '#aaa'; g.lineWidth = 2; g.stroke(); g.fillStyle = '#e0a030'; g.fillRect(sx + (S.dx >= 0 ? 4 : -10), sy - 2, 7, 4);
        var qx = L.x + (ex(P) + 0.5) * L.cs, qy = L.y + (ey(P) + 0.5) * L.cs; if (inv <= 0 || Math.floor(pop * 10) % 2) { g.fillStyle = '#ffd88a'; g.beginPath(); g.arc(qx, qy, L.cs * 0.32, 0, 6.283); g.fill(); g.fillStyle = '#4a3a2a'; g.fillRect(qx - L.cs * 0.18, qy - L.cs * 0.05, L.cs * 0.36, L.cs * 0.1); }
        hud(T.h1 + ' ' + got + '/' + NP, T.h2 + ' ' + lives, lives < 2);
        fim(st);
      }
    };
  }
});
