/* O braço de Grendel — puxe até arrancar o braço do monstro. */
BTJogo.registrar({
  canvas: 'jogo-beowulf',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O braço de Grendel",
    "sub": "Beowulf segura o braço de Grendel sem arma nenhuma. Toque rápido (ou martele a barra de espaço) para puxar. Quando o monstro se debater, a tela avisa e depois treme: nessa hora, não puxe! Puxar durante o tranco faz Beowulf escorregar. Arranque o braço antes de três escorregões.",
    "perdeu": "Grendel escapou",
    "v1": "O braço foi arrancado!",
    "v2": "No poema Beowulf, o herói luta sem armas contra Grendel no salão de Heorot e arranca o braço do monstro. A luta de força do jogo é invenção.",
    "h1": "Braço",
    "h2": "Escorregões"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Grendel's arm",
    "sub": "Beowulf grips Grendel's arm with no weapon at all. Tap fast (or hammer the space bar) to pull. When the monster thrashes, the screen warns and then shakes: do not pull then! Pulling during the jerk makes Beowulf slip. Tear the arm off before three slips.",
    "perdeu": "Grendel escaped",
    "v1": "The arm is torn off!",
    "v2": "In the poem Beowulf, the hero fights Grendel unarmed in the hall of Heorot and tears off the monster's arm. The test of strength in the game is made up.",
    "h1": "Arm",
    "h2": "Slips"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Grendels arm",
    "sub": "Beowulf holder Grendels arm uten noe våpen. Trykk fort (eller hamre på mellomromstasten) for å dra. Når monsteret slår om seg, varsler skjermen og rister så: Ikke dra da! Å dra under rykket får Beowulf til å skli. Riv av armen før tre sklier.",
    "perdeu": "Grendel slapp unna",
    "v1": "Armen er revet av!",
    "v2": "I diktet Beowulf kjemper helten ubevæpnet mot Grendel i hallen Heorot og river av monsterets arm. Kraftprøven i spillet er diktet opp.",
    "h1": "Arm",
    "h2": "Sklier"
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
    var MAXE = 3;
    var p = 0, errs = 0, thr = null, nextT = 2.2, sh = 0, slipT = 0, tapT = 0;
    function reset() { st = 'play'; p = 0.2; errs = 0; thr = null; nextT = 0.4; sh = 0; slipT = 0; }
    function puxar() {
      if (st !== 'play') return;
      if (thr && thr.a) { errs++; p = Math.max(0.04, p - 0.1); slipT = 0.4; thr.hit = true; if (errs >= MAXE) st = 'lose'; return; }
      p = Math.min(1, p + 0.06); tapT = 0.12; if (p >= 1) st = 'win';
    }
    return {
      pausar: function () {},
      dbg: function () { return { st: st, p: p, errs: errs, thr: thr ? { a: thr.a, t: thr.t, w: thr.w } : null }; },
      down: function () { if (menu()) return; puxar(); },
      key: function (c, d) { if (!d) return; if (c !== 'Space' && c !== 'Enter') return; if (st !== 'play') menu(); else puxar(); },
      update: function (dt) {
        if (st !== 'play') return;
        slipT = Math.max(0, slipT - dt); tapT = Math.max(0, tapT - dt);
        var res = 0.16 + p * 0.1;
        if (thr) { thr.t += dt; if (!thr.a && thr.t >= thr.w) { thr.a = true; thr.t = 0; } else if (thr.a) { res = 0.3; sh = 1; if (thr.t >= 0.75) { thr = null; nextT = 1.2 + Math.random() * 1.2; } } }
        else { nextT -= dt; if (nextT <= 0) thr = { t: 0, w: 0.5, a: false, hit: false }; }
        if (!(thr && thr.a)) sh = Math.max(0, sh - dt * 4);
        p -= res * dt;
        if (p >= 1) st = 'win'; else if (p <= 0) st = 'lose';
      },
      draw: function () {
        var W = api.w, H = api.h, t = api.clock, shk = (thr && !thr.a ? 3 : 0) + sh * 6, ox = (Math.random() - 0.5) * shk, oy = (Math.random() - 0.5) * shk;
        bg('#2a1810', '#0c0806'); g.save(); g.translate(ox, oy);
        g.fillStyle = '#4a2f1c'; g.fillRect(0, H * 0.78, W, H * 0.22); g.fillStyle = 'rgba(255,160,60,.15)'; g.fillRect(W * 0.3, H * 0.05, W * 0.4, H * 0.7);
        var ax = W * 0.18, gx = W * 0.82, mx = ax + (gx - ax) * (1 - p) * 0.55 + (gx - ax) * 0.2, cy = H * 0.52;
        g.fillStyle = '#e8c9a0'; g.beginPath(); g.arc(ax, cy - 40, 18, 0, 6.29); g.fill(); g.fillStyle = '#7a8a9a'; g.fillRect(ax - 20, cy - 22, 40, 80);
        g.fillStyle = thr && !thr.a ? '#6a4a4a' : '#4a5a3a'; g.fillRect(gx - 50, cy - 70, 110, 150); g.beginPath(); g.arc(gx, cy - 90, 34, 0, 6.29); g.fill(); g.fillStyle = '#ff6a4a'; g.fillRect(gx - 14, cy - 98, 8, 8); g.fillRect(gx + 8, cy - 98, 8, 8);
        g.strokeStyle = '#6a7a4a'; g.lineWidth = 16; g.lineCap = 'round'; g.beginPath(); g.moveTo(gx - 40, cy - 20); g.lineTo(mx, cy - 10); g.stroke(); g.strokeStyle = '#e8c9a0'; g.lineWidth = 8; g.beginPath(); g.moveTo(ax + 20, cy - 8); g.lineTo(mx - 8, cy - 10); g.stroke();
        g.restore();
        var bw = Math.min(W * 0.6, 360), bx = (W - bw) / 2, by = H * 0.9; g.fillStyle = 'rgba(255,255,255,.2)'; g.fillRect(bx, by, bw, 12); g.fillStyle = p > 0.2 ? '#ffd88a' : '#ff8a7a'; g.fillRect(bx, by, bw * p, 12);
        if (thr && !thr.a) txt('!', W / 2, H * 0.2, 60, '#ff6a4a'); if (thr && thr.a) txt('✋', W / 2, H * 0.2, 54, '#ff9a8d');
        if (slipT > 0) { g.fillStyle = 'rgba(255,60,40,' + slipT * 0.5 + ')'; g.fillRect(0, 0, W, H); }
        hud(T.h1 + ' ' + Math.floor(p * 20) + '/20', T.h2 + ' ' + errs + '/' + MAXE, errs > 0);
        fim(st);
      }
    };
  }
});
