/* Os remos de Rurik — reme pelo rio sem encostar nas margens. */
BTJogo.registrar({
  canvas: 'jogo-rurik',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os remos de Rurik",
    "sub": "Rurik e os seus remam rio acima. Toque (ou use as setas) na esquerda e na direita, alternando, para dar as remadas: cada toque alternado dá força total. Repetir o mesmo lado dá menos força, mas desvia o barco para ele. A correnteza empurra o barco; no terceiro encontrão na margem, o jogo acaba. Chegue ao fim do rio antes que o tempo acabe.",
    "perdeu": "O barco ficou preso na margem",
    "v1": "O rio ficou para trás!",
    "v2": "A Crônica Primária conta que Rurik chegou a Ládoga e Nóvgorod por volta de 862. As remadas do jogo são invenção.",
    "h1": "Rio",
    "h2": "Encostadas",
    "dica": "toque na esquerda e na direita, alternando"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Rurik's oars",
    "sub": "Rurik and his men row upriver. Tap (or use the arrows) on the left and on the right, alternating, to take strokes: each alternate tap gives full power. Repeating the same side gives less power but turns the boat toward it. The current pushes the boat; the third bump on the bank ends the game. Reach the end of the river before time runs out.",
    "perdeu": "The boat was stuck on the bank",
    "v1": "The river is behind you!",
    "v2": "The Primary Chronicle says Rurik arrived at Ladoga and Novgorod around 862. The strokes in the game are made up.",
    "h1": "River",
    "h2": "Bumps",
    "dica": "tap left and right, alternating"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Rurik sine årer",
    "sub": "Rurik og mennene hans ror oppover elva. Trykk (eller bruk piltastene) til venstre og høyre, vekselvis, for å ta tak: hvert vekslende trykk gir full kraft. Gjentar du samme side, gir det mindre kraft, men svinger båten mot den. Strømmen skyver båten; ved det tredje støtet mot bredden er spillet over. Kom til enden av elva før tiden er ute.",
    "perdeu": "Båten satt fast på bredden",
    "v1": "Elva er bak deg!",
    "v2": "Nestorkrøniken forteller at Rurik kom til Ladoga og Novgorod omkring 862. Åretakene i spillet er diktet opp.",
    "h1": "Elv",
    "h2": "Støt",
    "dica": "trykk til venstre og høyre, vekselvis"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "Los remos de Rurik",
    "sub": "Rurik y los suyos reman río arriba. Toca (o usa las flechas) a la izquierda y a la derecha, alternando, para dar las remadas: cada toque alternado da fuerza total. Repetir el mismo lado da menos fuerza, pero desvía el barco hacia él. La corriente empuja el barco; al tercer golpe contra la orilla, el juego termina. Llega al final del río antes de que se acabe el tiempo.",
    "perdeu": "El barco quedó atrapado en la orilla",
    "v1": "¡El río quedó atrás!",
    "v2": "La Crónica Primaria cuenta que Rurik llegó a Ládoga y Nóvgorod hacia 862. Las remadas del juego son invención.",
    "h1": "Río",
    "h2": "Roces",
    "dica": "toca a la izquierda y a la derecha, alternando"
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
    var TARGET = 1800, LIM = 50, MAXB = 3, VM = 90;
    var dist = 0, v = 0, lat = 0, bump = 0, tmr = LIM, last = 0, t = 0, ph = 0, fl = [0, 0], bf = 0;
    function setup() { dist = 0; v = 0; lat = 0; bump = 0; tmr = LIM; last = 0; t = 0; ph = Math.random() * 6.28; fl = [0, 0]; bf = 0; }
    function reset() { setup(); st = 'play'; }
    function stroke(s) {
      if (st !== 'play') return; if (s === last) { v = Math.min(VM, v + 5); lat += s * 0.12; } else { v = Math.min(VM, v + 15); lat += s * 0.03; }
      last = s; fl[s < 0 ? 0 : 1] = 0.15; if (api.nota) api.nota(s < 0 ? 200 : 240, 0.04, 'sine', 0.04);
    }
    function RW() { return api.w * 0.34; }
    setup();
    return {
      pausar: function () {},
      dbg: function () { return { st: st, dist: dist, v: v, lat: lat, bump: bump, tmr: tmr, last: last }; },
      down: function (x, y) { if (menu()) return; stroke(x < api.w / 2 ? -1 : 1); },
      key: function (c, d) {
        if (!d) return; if (c === 'ArrowLeft' || c === 'KeyA') stroke(-1); else if (c === 'ArrowRight' || c === 'KeyD') stroke(1); else if ((c === 'Space' || c === 'Enter') && st !== 'play') menu();
      },
      update: function (dt) {
        if (bf > 0) bf -= dt; fl[0] = Math.max(0, fl[0] - dt); fl[1] = Math.max(0, fl[1] - dt); if (st !== 'play') return;
        t += dt; tmr -= dt; if (tmr <= 0) { st = 'lose'; return; }
        v -= v * 0.9 * dt; dist += v * dt; lat += (0.3 * Math.sin(0.8 * t + ph) + 0.1 * Math.sin(1.9 * t)) * dt;
        if (Math.abs(lat) > 1) { bump++; bf = 0.4; lat = lat > 0 ? 0.5 : -0.5; v *= 0.3; if (api.nota) api.nota(110, 0.2, 'sawtooth', 0.06); if (bump >= MAXB) { st = 'lose'; return; } }
        if (dist >= TARGET) st = 'win';
      },
      draw: function () {
        var W = api.w, H = api.h, R = RW(), cx = W / 2, i;
        bg('#1b3a3a', '#0a1a1a'); g.fillStyle = '#2d5a6a'; g.fillRect(cx - R, 0, 2 * R, H);
        for (i = 0; i < 14; i++) { var y = ((i * 60 + dist * 1.2) % (H + 60)), x = cx - R + 14 + ((i * 97) % Math.max(10, 2 * R - 28)); g.strokeStyle = 'rgba(255,255,255,.12)'; g.lineWidth = 2; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 20, y + 4); g.stroke(); }
        g.fillStyle = '#3f6a3a'; g.fillRect(0, 0, cx - R, H); g.fillRect(cx + R, 0, W - cx - R, H);
        g.fillStyle = '#2a4a28'; for (i = 0; i < 10; i++) { var yy = ((i * 80 + dist * 1.6) % (H + 80)) - 30; g.beginPath(); g.arc(cx - R - 18 - (i % 3) * 10, yy, 16, 0, 6.29); g.arc(cx + R + 18 + (i % 3) * 10, yy + 20, 16, 0, 6.29); g.fill(); }
        var bx = cx + lat * R, by = H * 0.74;
        if (bf > 0) { g.fillStyle = 'rgba(255,120,100,' + bf + ')'; g.fillRect(0, 0, W, H); }
        g.save(); g.translate(bx, by); g.rotate(Math.sin(t * 3) * 0.03 + lat * 0.1); g.fillStyle = '#8a5a2a'; g.beginPath(); g.moveTo(0, -48); g.quadraticCurveTo(22, -10, 14, 46); g.lineTo(-14, 46); g.quadraticCurveTo(-22, -10, 0, -48); g.fill(); g.fillStyle = '#d8d8e8'; g.fillRect(-2, -30, 4, 60);
        g.strokeStyle = '#6a4a22'; g.lineWidth = 4; g.beginPath(); g.moveTo(-14, 0 + fl[0] * 80); g.lineTo(-46, 12 - fl[0] * 80); g.moveTo(14, 0 + fl[1] * 80); g.lineTo(46, 12 - fl[1] * 80); g.stroke(); g.restore();
        txt(T.dica, W / 2, H - 20, 14, 'rgba(255,255,255,.55)'); bar(W / 2 - 110, H - 10, 220, 5, tmr / LIM, tmr < 15 ? '#c0392b' : '#6ab0c0');
        hud(T.h1 + ' ' + Math.floor(dist) + '/' + TARGET, T.h2 + ' ' + bump + '/' + MAXB, bump > 0);
        fim(st);
      }
    };
  }
});
