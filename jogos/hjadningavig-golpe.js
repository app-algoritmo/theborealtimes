/* A batalha sem fim — rebata o golpe antes que passe. */
BTJogo.registrar({
  canvas: 'jogo-hjadningavig',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A batalha sem fim",
    "sub": "Hild e os Hjaðningar lutam sem parar. Mova sua lâmina (arraste, setas ou W e S) para rebater o golpe de volta. Quem acerta o outro lado ganha um ponto; o primeiro a sete vence. No terceiro golpe que passar por você, o jogo acaba.",
    "perdeu": "O golpe passou, e a batalha seguiu",
    "v1": "A batalha acabou, por hoje!",
    "v2": "Segundo o Skáldskaparmál, os Hjaðningar lutam sem fim, noite após noite. A partida do jogo é invenção.",
    "h1": "Pontos",
    "h2": "Sofridos"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The battle without end",
    "sub": "Hild and the Hjaðningar fight on without rest. Move your blade (drag, arrows or W and S) to parry the blow back. Hit the far side to score; first to seven wins. The third blow that gets past you ends the game.",
    "perdeu": "The blow got through, and the battle went on",
    "v1": "The battle is over, for today!",
    "v2": "According to the Skáldskaparmál, the Hjaðningar fight without end, night after night. The match in the game is made up.",
    "h1": "Points",
    "h2": "Conceded"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Slaget uten ende",
    "sub": "Hild og hjadningene kjemper uten stans. Flytt bladet ditt (dra, piltaster eller W og S) for å parere slaget tilbake. Treffer du den andre siden, får du ett poeng; først til sju vinner. Det tredje slaget som slipper forbi, avslutter spillet.",
    "perdeu": "Slaget slapp forbi, og kampen fortsatte",
    "v1": "Slaget er over, for i dag!",
    "v2": "Ifølge Skáldskaparmál kjemper hjadningene uten ende, natt etter natt. Kampen i spillet er diktet opp.",
    "h1": "Poeng",
    "h2": "Sluppet inn"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "La batalla sin fin",
    "sub": "Hild y los Hjaðningar luchan sin parar. Mueve tu hoja (arrastra, flechas o W y S) para devolver el golpe. Quien acierta en el otro lado gana un punto; el primero en llegar a siete gana. Al tercer golpe que pase por tu lado, el juego termina.",
    "perdeu": "El golpe pasó, y la batalla siguió",
    "v1": "¡La batalla terminó, por hoy!",
    "v2": "Según el Skáldskaparmál, los Hjaðningar luchan sin fin, noche tras noche. La partida del juego es invención.",
    "h1": "Puntos",
    "h2": "Recibidos"
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
    var WINP = 7, MAXE = 3, PH = 46, AH = 38, BR = 9, KS = 520;
    var Lg = 0, Sh = 0, land = true, PX0 = 10, PY0 = 72, pts = 0, errs = 0, u = 0, v = 0, vu = 0, vv = 0, sp = 330, pv = 0, tv = 0, av = 0, ao = 0, wait = 0, dirn = -1, kd = 0, lastBy = 0;
    function dims() { land = api.w >= api.h; PX0 = 10; PY0 = 72; var pw = api.w - 20, ph = api.h - PY0 - 10; Lg = land ? pw : ph; Sh = land ? ph : pw; }
    function toXY(uu, vv2) { return land ? { x: PX0 + uu, y: PY0 + vv2 } : { x: PX0 + vv2, y: PY0 + Lg - uu }; }
    function serve() { var a = (Math.random() - 0.5) * 1.1; sp = 330; u = Lg / 2; v = Sh / 2; vu = Math.cos(a) * sp * dirn; vv = Math.sin(a) * sp; if (Math.abs(vv) < 50) vv = 50 * (Math.random() < 0.5 ? -1 : 1); ao = (Math.random() * 2 - 1) * AH * 0.8; }
    function setup() { dims(); pts = 0; errs = 0; pv = Sh / 2; tv = pv; av = Sh / 2; wait = 0.8; dirn = -1; kd = 0; serve(); }
    function reset() { setup(); st = 'play'; }
    function hit(side) {
      sp = Math.min(KS, sp + 16); var half = side === 0 ? PH : AH, pad = side === 0 ? pv : av, rel = Math.max(-1, Math.min(1, (v - pad) / (half + BR))), a = rel * 0.95;
      vu = Math.cos(a) * sp * (side === 0 ? 1 : -1); vv = Math.sin(a) * sp; if (Math.abs(vv) < 40) vv = 40 * (Math.random() < 0.5 ? -1 : 1);
      if (side === 0) ao = (Math.random() * 2 - 1) * AH * 0.85; if (api.nota) api.nota(side === 0 ? 420 : 300, 0.05, 'square', 0.05);
    }
    setup();
    return {
      pausar: function () { kd = 0; },
      dbg: function () { dims(); var b = toXY(u, v); return { st: st, pts: pts, errs: errs, land: land, PX0: PX0, PY0: PY0, u: u, v: v, vu: vu, vv: vv, pv: pv, av: av, bx: b.x, by: b.y, wait: wait }; },
      down: function (x, y) { if (menu()) return; tv = Math.max(PH, Math.min(Sh - PH, (land ? y - PY0 : x - PX0))); },
      move: function (x, y) { if (st === 'play') tv = Math.max(PH, Math.min(Sh - PH, (land ? y - PY0 : x - PX0))); },
      key: function (c, d) {
        if (c === 'ArrowUp' || c === 'KeyW' || c === 'ArrowLeft' || c === 'KeyA') kd = d ? -1 : (kd === -1 ? 0 : kd); else if (c === 'ArrowDown' || c === 'KeyS' || c === 'ArrowRight' || c === 'KeyD') kd = d ? 1 : (kd === 1 ? 0 : kd);
        else if ((c === 'Space' || c === 'Enter') && d && st !== 'play') menu();
      },
      update: function (dt) {
        if (st !== 'play') return; dims();
        if (kd) tv = Math.max(PH, Math.min(Sh - PH, tv + kd * 460 * dt));
        var dd = tv - pv, mx = 900 * dt; pv += Math.max(-mx, Math.min(mx, dd));
        var tgt = vu > 0 ? v + ao : Sh / 2, da = tgt - av, ma = 270 * dt; av += Math.max(-ma, Math.min(ma, da)); av = Math.max(AH, Math.min(Sh - AH, av));
        if (wait > 0) { wait -= dt; return; }
        u += vu * dt; v += vv * dt;
        if (v < BR) { v = BR; vv = Math.abs(vv); } else if (v > Sh - BR) { v = Sh - BR; vv = -Math.abs(vv); }
        if (vu < 0 && u - BR <= 22 && u > 8 && Math.abs(v - pv) <= PH + BR) { u = 22 + BR; hit(0); }
        else if (vu > 0 && u + BR >= Lg - 22 && u < Lg - 8 && Math.abs(v - av) <= AH + BR) { u = Lg - 22 - BR; hit(1); }
        if (u < -BR) { errs++; dirn = -1; wait = 0.9; if (errs >= MAXE) { st = 'lose'; return; } serve(); }
        else if (u > Lg + BR) { pts++; dirn = 1; wait = 0.9; if (pts >= WINP) { st = 'win'; return; } serve(); }
      },
      draw: function () {
        var W = api.w, H = api.h, a, b, p;
        bg('#2c2230', '#100b12'); dims();
        g.strokeStyle = 'rgba(255,255,255,.12)'; g.lineWidth = 2; a = toXY(0, 0); b = toXY(Lg, Sh); g.strokeRect(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.abs(b.x - a.x), Math.abs(b.y - a.y));
        g.setLineDash && g.setLineDash([8, 10]); a = toXY(Lg / 2, 0); b = toXY(Lg / 2, Sh); g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke(); g.setLineDash && g.setLineDash([]);
        function blade(uu, c, half, col) { var p1 = toXY(uu, c - half), p2 = toXY(uu, c + half); g.strokeStyle = col; g.lineWidth = 10; g.lineCap = 'round'; g.beginPath(); g.moveTo(p1.x, p1.y); g.lineTo(p2.x, p2.y); g.stroke(); g.lineCap = 'butt'; }
        blade(22, pv, PH, '#d8d8e8'); blade(Lg - 22, av, AH, '#d97a6a');
        p = toXY(u, v); g.fillStyle = wait > 0 ? 'rgba(255,216,138,.5)' : '#ffd88a'; g.beginPath(); g.arc(p.x, p.y, BR, 0, 6.29); g.fill();
        hud(T.h1 + ' ' + pts + '/' + WINP, T.h2 + ' ' + errs + '/' + MAXE, errs > 0);
        fim(st);
      }
    };
  }
});
