/* Kullervo — leve os animais ao curral. */
BTJogo.registrar({
  canvas: 'jogo-kullervo',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O rebanho de Kullervo",
    "sub": "Arraste o dedo (ou use as setas / WASD) para mover o pastor. Os animais fogem de você: chegue por trás deles e empurre-os para o curral à direita. Leve os 6 antes que o tempo acabe.",
    "perdeu": "O tempo acabou",
    "v1": "O rebanho está no curral!",
    "v2": "No Kalevala, o pastor Kullervo, escravizado, cuida do rebanho de Ilmarinen. A tarefa de levar os animais ao curral é invenção.",
    "h1": "Rebanho",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Kullervo's flock",
    "sub": "Drag your finger (or use the arrows / WASD) to move the shepherd. The animals run from you: get behind them and push them to the pen on the right. Bring all 6 before time runs out.",
    "perdeu": "Time ran out",
    "v1": "The flock is in the pen!",
    "v2": "In the Kalevala, the enslaved shepherd Kullervo tends Ilmarinen's herd. The task of driving the animals into the pen is made up.",
    "h1": "Flock",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Kullervos flokk",
    "sub": "Dra fingeren (eller bruk piltastene / WASD) for å flytte gjeteren. Dyrene løper fra deg: kom bak dem og skyv dem mot innhegningen til høyre. Få alle 6 inn før tiden er ute.",
    "perdeu": "Tiden gikk ut",
    "v1": "Flokken er i innhegningen!",
    "v2": "I Kalevala steller den slavebundne gjeteren Kullervo Ilmarinens buskap. Oppgaven med å drive dyrene inn i innhegningen er diktet opp.",
    "h1": "Flokk",
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
    var NA = 6, LIM = 45;
    var you = { x: 0, y: 0 }, an = [], tgt = null, tmr = LIM, pop = 0, held = false, K = { l: 0, r: 0, u: 0, d: 0 };
    function lay() { var W = api.w, H = api.h, s = Math.max(0.8, Math.min(1.6, Math.min(W, H) / 450)); var pw = Math.max(90, W * 0.2), ph = Math.min(H * 0.5, 230 * s); return { W: W, H: H, s: s, fx0: 8, fy0: 92, fx1: W - 8, fy1: H - 24, pen: { x0: W - 8 - pw, y0: H / 2 - ph / 2 + 30, x1: W - 8, y1: H / 2 + ph / 2 + 30 } }; }
    function inPen(a, L) { return a.x > L.pen.x0 + 6 && a.x < L.pen.x1 && a.y > L.pen.y0 && a.y < L.pen.y1; }
    function setup() { var L = lay(); you = { x: L.W * 0.12, y: L.H * 0.55 }; an = []; for (var i = 0; i < NA; i++) an.push({ x: L.W * (0.35 + Math.random() * 0.3), y: L.fy0 + 40 + Math.random() * (L.fy1 - L.fy0 - 80), vx: 0, vy: 0, inn: false }); tgt = null; tmr = LIM; }
    function reset() { setup(); st = 'play'; }
    function count() { return an.filter(function (a) { return a.inn; }).length; }
    setup();
    return {
      pausar: function () { held = false; },
      dbg: function () { var L = lay(); return { st: st, you: { x: you.x, y: you.y }, an: an.map(function (a) { return { x: a.x, y: a.y, inn: a.inn }; }), pen: L.pen, tmr: tmr, W: L.W, H: L.H, n: count() }; },
      down: function (x, y) { if (menu()) return; held = true; tgt = { x: x, y: y }; },
      move: function (x, y, pr) { if (held && st === 'play') tgt = { x: x, y: y }; },
      up: function () { held = false; tgt = null; },
      key: function (k, d) { var v = d ? 1 : 0; if (k === 'ArrowLeft' || k === 'KeyA') K.l = v; else if (k === 'ArrowRight' || k === 'KeyD') K.r = v; else if (k === 'ArrowUp' || k === 'KeyW') K.u = v; else if (k === 'ArrowDown' || k === 'KeyS') K.d = v; else if (d && st !== 'play') menu(); },
      update: function (dt) {
        pop += dt; if (st !== 'play') return; var L = lay(), i; tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; return; }
        var sp = 250 * L.s * dt, dx = K.r - K.l, dy = K.d - K.u;
        if (dx || dy) { var m = Math.hypot(dx, dy); you.x += dx / m * sp; you.y += dy / m * sp; tgt = null; } else if (tgt) { var ddx = tgt.x - you.x, ddy = tgt.y - you.y, dd = Math.hypot(ddx, ddy); if (dd > sp) { you.x += ddx / dd * sp; you.y += ddy / dd * sp; } else { you.x = tgt.x; you.y = tgt.y; } }
        you.x = Math.max(L.fx0, Math.min(L.fx1, you.x)); you.y = Math.max(L.fy0, Math.min(L.fy1, you.y));
        for (i = 0; i < an.length; i++) { var a = an[i], px0 = a.x, py0 = a.y;
          if (a.inn) { a.vx += (Math.random() - 0.5) * 60 * dt; a.vy += (Math.random() - 0.5) * 60 * dt; a.vx *= 0.96; a.vy *= 0.96; a.x += a.vx * dt; a.y += a.vy * dt; a.x = Math.max(L.pen.x0 + 12, Math.min(L.pen.x1 - 12, a.x)); a.y = Math.max(L.pen.y0 + 10, Math.min(L.pen.y1 - 10, a.y)); continue; }
          var ex = a.x - you.x, ey = a.y - you.y, d = Math.hypot(ex, ey) || 1, R = 120 * L.s;
          if (d < R) { var f = (1 - d / R) * 150 * L.s + 40 * L.s; a.vx += ex / d * f * dt * 9; a.vy += ey / d * f * dt * 9; }
          a.vx += (Math.random() - 0.5) * 50 * dt; a.vy += (Math.random() - 0.5) * 50 * dt; var vm = Math.hypot(a.vx, a.vy), mx = 195 * L.s; if (vm > mx) { a.vx *= mx / vm; a.vy *= mx / vm; } a.vx *= 0.94; a.vy *= 0.94;
          a.x += a.vx * dt; a.y += a.vy * dt; if (a.x < L.fx0 + 10) { a.x = L.fx0 + 10; a.vx = Math.abs(a.vx) * 0.3; } if (a.y < L.fy0) { a.y = L.fy0; a.vy = Math.abs(a.vy) * 0.3; } if (a.y > L.fy1 - 6) { a.y = L.fy1 - 6; a.vy = -Math.abs(a.vy) * 0.3; } if (a.x > L.fx1 - 10) { a.x = L.fx1 - 10; a.vx = -Math.abs(a.vx) * 0.3; }
          if (inPen(a, L)) { a.inn = true; if (api.nota) api.nota(520 + count() * 60, 0.1, 'triangle', 0.05); }
        }
        if (count() >= NA) st = 'win';
      },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), i;
        bg('#1e3a22', '#0a160c');
        g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(L.fx0, L.fy0, L.fx1 - L.fx0, L.fy1 - L.fy0);
        var p = L.pen; g.strokeStyle = '#8a5a2a'; g.lineWidth = 5; g.setLineDash([10, 6]); g.strokeRect(p.x0, p.y0, p.x1 - p.x0, p.y1 - p.y0); g.setLineDash([]); g.fillStyle = 'rgba(255,216,138,.07)'; g.fillRect(p.x0, p.y0, p.x1 - p.x0, p.y1 - p.y0);
        for (i = 0; i < an.length; i++) { var a = an[i]; g.fillStyle = a.inn ? '#fff0c0' : '#f0e8d8'; g.beginPath(); g.ellipse(a.x, a.y, 14 * L.s, 10 * L.s, 0, 0, 6.283); g.fill(); g.fillStyle = '#3a3a3a'; g.beginPath(); g.arc(a.x + 11 * L.s * (a.vx >= 0 ? 1 : -1), a.y - 3 * L.s, 5 * L.s, 0, 6.283); g.fill(); }
        g.fillStyle = '#c0392b'; g.beginPath(); g.arc(you.x, you.y, 13 * L.s, 0, 6.283); g.fill(); g.fillStyle = '#ffd88a'; g.beginPath(); g.arc(you.x, you.y - 12 * L.s, 7 * L.s, 0, 6.283); g.fill();
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 15 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + count() + '/' + NA, T.h2 + ' ' + Math.ceil(tmr), false);
        fim(st);
      }
    };
  }
});
