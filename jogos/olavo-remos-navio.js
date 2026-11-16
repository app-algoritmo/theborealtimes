/* Olavo Tryggvason — atravesse os remos do navio no tempo certo (invenção). */
BTJogo.registrar({
  canvas: 'jogo-olavo',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os remos de Olavo",
    "sub": "Os remos sobem e descem. Toque (ou aperte Espaço) para pular para o remo da frente, que precisa estar erguido quando você chegar. Um remo que desce com você em cima também derruba. Atravesse os 8 saltos com no máximo 3 quedas, em 80 segundos.",
    "perdeu": "Quedas demais ou o tempo acabou",
    "v1": "O navio foi atravessado!",
    "v2": "Olavo Tryggvason foi rei da Noruega de 995 a 1000 e desapareceu em Svolder. A corrida sobre os remos é invenção do jogo.",
    "h1": "Remos",
    "h2": "Quedas"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Olaf's oars",
    "sub": "The oars rise and fall. Tap (or press Space) to jump to the next oar, which must be raised when you arrive. An oar that goes down with you on it also drops you. Cross all 8 jumps with at most 3 falls, in 80 seconds.",
    "perdeu": "Too many falls or time ran out",
    "v1": "The ship is crossed!",
    "v2": "Olaf Tryggvason was king of Norway from 995 to 1000 and vanished at Svolder. The run across the oars is an invention of the game.",
    "h1": "Oars",
    "h2": "Falls"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Olavs årer",
    "sub": "Årene hever og senker seg. Trykk (eller trykk mellomrom) for å hoppe til neste åre, som må være hevet når du lander. En åre som går ned med deg på, feller deg også. Kom deg over alle 8 hoppene med høyst 3 fall, på 80 sekunder.",
    "perdeu": "For mange fall eller tiden tok slutt",
    "v1": "Skipet er krysset!",
    "v2": "Olav Tryggvason var konge av Norge fra 995 til 1000 og forsvant ved Svolder. Løpet over årene er oppfunnet i spillet.",
    "h1": "Årer",
    "h2": "Fall"
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
    var NO = 9, LIM = 80, MAXF = 3, P = 2.4, UPF = 0.58, J = 0.3;
    var ph = [], cur = 0, tgt = -1, jt = 0, falls = 0, t = 0, grace = 1, splash = 0;
    function isUp(i, tt) { return (((tt / P + ph[i]) % 1) + 1) % 1 < UPF; }
    function lay() { var W = api.w, H = api.h, s = Math.max(0.8, Math.min(1.4, Math.min(W, H) / 450)); return { W: W, H: H, s: s, x0: 44, dx: (W - 88) / (NO - 1), y: H * 0.56, dn: 34 * s }; }
    function reset() { ph = []; for (var i = 0; i < NO; i++) ph.push(Math.random()); ph[0] = 0; cur = 0; tgt = -1; jt = 0; falls = 0; t = 0; grace = 1; splash = 0; st = 'play'; }
    function fall() { falls++; splash = 0.6; tgt = -1; if (api.nota) api.nota(140, 0.3, 'sawtooth', 0.06); if (falls >= MAXF) st = 'lose'; else grace = 0.9; }
    function jump() { if (st !== 'play' || tgt >= 0 || cur >= NO - 1) return; tgt = cur + 1; jt = J; if (api.nota) api.nota(440, 0.1, 'triangle', 0.05); }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, cur: cur, t: t, falls: falls, grace: grace, jumping: tgt >= 0, J: J, no: NO, up: isUp }; },
      down: function () { if (menu()) return; jump(); },
      move: function () {}, up: function () {},
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'Space' || k === 'Enter' || k === 'ArrowUp' || k === 'ArrowRight') jump(); },
      update: function (dt) {
        if (splash > 0) splash -= dt; if (st !== 'play') return; t += dt; if (t >= LIM) { st = 'lose'; return; }
        if (tgt >= 0) {
          jt -= dt;
          if (jt <= 0) { if (isUp(tgt, t)) { cur = tgt; tgt = -1; grace = 0.45; if (api.nota) api.nota(520, 0.1, 'sine', 0.05); if (cur >= NO - 1) st = 'win'; } else fall(); }
        } else { if (grace > 0) grace -= dt; if (grace <= 0 && !isUp(cur, t)) fall(); }
      },
      draw: function () {
        var L = lay(), W = L.W, H = L.H, s = L.s, i;
        bg('#35516b', '#0c1a28');
        g.fillStyle = 'rgba(120,170,200,.18)'; g.fillRect(0, L.y + L.dn + 28 * s, W, H);
        g.strokeStyle = 'rgba(160,210,235,.25)'; g.lineWidth = 2; for (i = 0; i < 3; i++) { g.beginPath(); for (var x = 0; x <= W; x += 20) { var y = L.y + L.dn + 40 * s + i * 20 + Math.sin(x / 30 + api.clock * 1.5 + i) * 4; if (x) g.lineTo(x, y); else g.moveTo(x, y); } g.stroke(); }
        g.fillStyle = '#6b4a2a'; g.beginPath(); g.moveTo(10, L.y + L.dn); g.quadraticCurveTo(W / 2, L.y + L.dn + 70 * s, W - 10, L.y + L.dn); g.lineTo(W - 10, L.y + L.dn - 8); g.lineTo(10, L.y + L.dn - 8); g.closePath(); g.fill();
        for (i = 0; i < NO; i++) {
          var up = isUp(i, t), x2 = L.x0 + i * L.dx, w = L.dx * 0.62, y2 = up ? L.y : L.y + L.dn, near = !up && isUp(i, t + 0.4) ? 0 : 1;
          g.fillStyle = up ? '#d9b36a' : '#8a6a3a'; rr(x2 - w / 2, y2, w, 10 * s, 5); g.fill();
          g.fillStyle = up ? '#a67c2a' : '#5a4528'; g.fillRect(x2 - 3, y2 + 10 * s, 6, L.dn + 8 * s - (up ? 0 : L.dn - 14 * s));
          if (!up && near === 0) { g.strokeStyle = 'rgba(255,216,138,.5)'; g.lineWidth = 2; rr(x2 - w / 2 - 2, L.y - 2, w + 4, 14 * s, 6); g.stroke(); }
        }
        var px, py; if (tgt >= 0) { var f = 1 - jt / J, ax = L.x0 + cur * L.dx, bx = L.x0 + tgt * L.dx; px = ax + (bx - ax) * f; py = L.y - 6 - Math.sin(f * 3.1416) * 46 * s - (isUp(cur, t) ? 0 : -L.dn * (1 - f)); } else { px = L.x0 + cur * L.dx; py = (isUp(cur, t) ? L.y : L.y + L.dn) - 6; }
        if (splash > 0 && tgt < 0 && grace > 0.4) { py = L.y + L.dn + 46 * s - splash * 20; }
        g.fillStyle = '#b8403a'; g.beginPath(); g.arc(px, py - 14 * s, 11 * s, 0, 6.283); g.fill(); g.fillStyle = '#e8c9a0'; g.beginPath(); g.arc(px, py - 28 * s, 7 * s, 0, 6.283); g.fill(); g.fillStyle = '#9aa5ae'; g.fillRect(px - 7 * s, py - 38 * s, 14 * s, 5 * s);
        bar(W / 2 - 110, H - 14, 220, 5, (LIM - t) / LIM, LIM - t < 15 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + cur + '/' + (NO - 1), T.h2 + ' ' + falls + '/' + MAXF, falls >= MAXF - 1);
        fim(st);
      }
    };
  }
});
