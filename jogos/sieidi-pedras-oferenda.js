/* Sieidi — lance pedras de oferenda até a pedra sagrada. */
BTJogo.registrar({
  canvas: 'jogo-sieidi',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A pedra sagrada",
    "sub": "Toque e arraste a partir da pessoa: a direção dá o ângulo e a distância dá a força; solte para lançar (no teclado, ↑↓ ângulo, ←→ força, espaço lança). Acerte a pedra sagrada 5 vezes com 8 pedras, em até 150 segundos.",
    "perdeu": "As pedras ou o tempo acabaram",
    "v1": "A oferenda foi aceita!",
    "v2": "Entre os sámi, o sieidi era um lugar de oferenda e respeito. O lançamento de pedras é invenção do jogo.",
    "h1": "Acertos",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The sacred stone",
    "sub": "Touch and drag from the person: the direction gives the angle and the distance gives the force; let go to throw (on the keyboard, ↑↓ angle, ←→ force, space throws). Hit the sacred stone 5 times with 8 stones, within 150 seconds.",
    "perdeu": "The stones or the time ran out",
    "v1": "The offering was accepted!",
    "v2": "Among the Sámi, the sieidi was a place of offering and respect. The throwing of stones is made up for the game.",
    "h1": "Hits",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Den hellige steinen",
    "sub": "Trykk og dra fra personen: retningen gir vinkelen og avstanden gir kraften; slipp for å kaste (på tastaturet: ↑↓ vinkel, ←→ kraft, mellomrom kaster). Treff den hellige steinen 5 ganger med 8 steiner, innen 150 sekunder.",
    "perdeu": "Steinene eller tiden tok slutt",
    "v1": "Offeret ble tatt imot!",
    "v2": "Blant samene var sieidien et sted for offer og respekt. Steinkastingen er diktet opp for spillet.",
    "h1": "Treff",
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
    var GOAL = 5, NS = 8, LIM = 150, GR = 900;
    var hits = 0, left = NS, t = 0, ang = 0.8, pw = 0.6, fly = null, tx = 0, msg = 0, aiming = false, ok = 0;
    function lay() { var W = api.w, H = api.h, s = Math.max(0.8, Math.min(1.3, Math.min(W, H) / 450)); var gy = H - 60 * s; return { W: W, H: H, s: s, gy: gy, ox: 50 * s, oy: gy - 30 * s, vmax: Math.sqrt(0.95 * (W - 100 * s) * GR) }; }
    function newT() { var L = lay(); tx = L.W * (0.38 + Math.random() * 0.5); if (tx < L.ox + 160 * L.s) tx = L.ox + 160 * L.s; }
    function setup() { hits = 0; left = NS; t = 0; ang = 0.8; pw = 0.6; fly = null; msg = 0; aiming = false; newT(); }
    function reset() { setup(); st = 'play'; }
    function throwIt() { if (st !== 'play' || fly || left <= 0) return; var L = lay(), v = pw * L.vmax; fly = { x: L.ox, y: L.oy, vx: Math.cos(ang) * v, vy: -Math.sin(ang) * v, hit: false }; left--; if (api.nota) api.nota(260, 0.08, 'triangle', 0.05); }
    function aimFrom(x, y) { var L = lay(), dx = x - L.ox, dy = L.oy - y; if (dx < 10) dx = 10; ang = Math.max(0.2, Math.min(1.35, Math.atan2(dy, dx))); pw = Math.max(0.2, Math.min(1, Math.hypot(dx, dy) / (L.W * 0.5))); }
    setup();
    return {
      pausar: function () { aiming = false; },
      dbg: function () { var L = lay(); return { st: st, hits: hits, left: left, goal: GOAL, fly: !!fly, tx: tx, ty: L.gy - 22 * L.s, ox: L.ox, oy: L.oy, g: GR, vmax: L.vmax, ang: ang, pw: pw, t: t, tmr: LIM - t, aim: function (a, p) { ang = a; pw = p; }, rad: 20 * L.s + 6 * L.s }; },
      down: function (x, y) { if (menu()) return; if (st !== 'play') return; aiming = true; aimFrom(x, y); },
      move: function (x, y, pr) { if (aiming && pr) aimFrom(x, y); },
      up: function () { if (aiming) { aiming = false; throwIt(); } },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'ArrowUp') ang = Math.min(1.35, ang + 0.04); else if (k === 'ArrowDown') ang = Math.max(0.2, ang - 0.04); else if (k === 'ArrowRight') pw = Math.min(1, pw + 0.03); else if (k === 'ArrowLeft') pw = Math.max(0.2, pw - 0.03); else if (k === 'Space' || k === 'Enter') throwIt(); },
      update: function (dt) {
        if (msg > 0) msg -= dt; if (st !== 'play') return; var L = lay(); t += dt; if (t >= LIM) { t = LIM; st = 'lose'; return; }
        if (fly) { var n = 3; for (var k = 0; k < n && fly; k++) { var h = dt / n; fly.vy += GR * h; fly.x += fly.vx * h; fly.y += fly.vy * h; var tcy = L.gy - 22 * L.s; if (Math.hypot(fly.x - tx, fly.y - tcy) < 26 * L.s) { hits++; ok = 1; msg = 0.6; if (api.nota) api.nota(640, 0.15, 'triangle', 0.07); fly = null; if (hits >= GOAL) { st = 'win'; return; } newT(); } else if (fly.y >= L.gy || fly.x > L.W + 20) { fly = null; ok = 0; msg = 0.4; if (api.nota) api.nota(160, 0.08, 'square', 0.04); } }
          if (!fly && left <= 0 && hits < GOAL) { st = 'lose'; } }
      },
      draw: function () {
        var L = lay(), W = L.W, H = L.H, s = L.s, i;
        bg('#2a3a4a', '#0c1218');
        g.fillStyle = '#3a4a3a'; g.fillRect(0, L.gy, W, H - L.gy);
        g.fillStyle = '#6a6a72'; g.beginPath(); g.moveTo(tx - 24 * s, L.gy); g.quadraticCurveTo(tx - 28 * s, L.gy - 40 * s, tx - 8 * s, L.gy - 56 * s); g.quadraticCurveTo(tx + 8 * s, L.gy - 62 * s, tx + 20 * s, L.gy - 40 * s); g.quadraticCurveTo(tx + 30 * s, L.gy - 15 * s, tx + 26 * s, L.gy); g.closePath(); g.fill(); g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(tx - 6 * s, L.gy - 44 * s, 10 * s, 14 * s);
        g.fillStyle = '#4a8ad0'; rr(L.ox - 10 * s, L.oy - 4 * s, 20 * s, 34 * s, 6); g.fill(); g.fillStyle = '#e8c9a0'; g.beginPath(); g.arc(L.ox, L.oy - 12 * s, 8 * s, 0, 6.283); g.fill();
        if (st === 'play' && !fly) { var v = pw * L.vmax; g.fillStyle = 'rgba(255,216,138,.55)'; for (i = 1; i <= 7; i++) { var tt = i * 0.05, px_ = L.ox + Math.cos(ang) * v * tt, py_ = L.oy - Math.sin(ang) * v * tt + 0.5 * GR * tt * tt; g.beginPath(); g.arc(px_, py_, 2.5 * s, 0, 6.283); g.fill(); } }
        if (fly) { g.fillStyle = '#c8c0b0'; g.beginPath(); g.arc(fly.x, fly.y, 6 * s, 0, 6.283); g.fill(); }
        bar(84, H - 24 * s + 6, 110 * s, 6, pw, '#ffd88a');
        for (i = 0; i < left; i++) { g.fillStyle = '#c8c0b0'; g.beginPath(); g.arc(W - 22 - i * 16 * s, H - 24 * s + 9, 5 * s, 0, 6.283); g.fill(); }
        if (msg > 0) txt(ok ? '✓' : '·', tx, L.gy - 72 * s, 26 * s, ok ? '#7fe08a' : '#aaa');
        hud(T.h1 + ' ' + hits + '/' + GOAL, T.h2 + ' ' + Math.ceil(LIM - t), false);
        fim(st);
      }
    };
  }
});
