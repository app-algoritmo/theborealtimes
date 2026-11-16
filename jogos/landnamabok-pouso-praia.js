/* Landnámabók, o livro dos assentamentos — pouse o navio na praia com pouco combustível (invenção). */
BTJogo.registrar({
  canvas: 'jogo-landnamabok',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Pouso na praia",
    "sub": "O navio cai sozinho. Segure o dedo na tela (ou a tecla Espaço) para acionar o impulso, que gasta combustível, e arraste o dedo (ou use ← →) para levar o navio até a praia dourada. Pouse sobre a praia devagar o bastante: velocidade abaixo da marca verde na barra. Bater ou cair na pedra e no mar acaba a viagem.",
    "perdeu": "O navio se perdeu",
    "v1": "O navio pousou!",
    "v2": "A Landnámabók conta quem chegou à Islândia e onde se instalou. O pouso com combustível limitado é invenção.",
    "h1": "Combustível",
    "h2": "Velocidade"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Landing on the beach",
    "sub": "The ship falls by itself. Hold your finger on the screen (or the Space key) to fire the thrust, which burns fuel, and drag your finger (or use ← →) to take the ship to the golden beach. Land on the beach slowly enough: speed below the green mark on the bar. Hitting the rocks or falling in the sea ends the voyage.",
    "perdeu": "The ship was lost",
    "v1": "The ship landed!",
    "v2": "The Landnámabók tells who arrived in Iceland and where they settled. The landing with limited fuel is invented.",
    "h1": "Fuel",
    "h2": "Speed"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Landing på stranda",
    "sub": "Skipet faller av seg selv. Hold fingeren på skjermen (eller mellomromstasten) for å starte skyvet, som bruker drivstoff, og dra fingeren (eller bruk ← →) for å føre skipet til den gylne stranda. Lande på stranda sakte nok: fart under det grønne merket på linjen. Treffer du steinene eller faller i sjøen, er turen over.",
    "perdeu": "Skipet gikk tapt",
    "v1": "Skipet landet!",
    "v2": "Landnámabók forteller hvem som kom til Island og hvor de slo seg ned. Landingen med begrenset drivstoff er oppfunnet.",
    "h1": "Drivstoff",
    "h2": "Fart"
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
    var FUEL = 34, G = 95, A = 230, SAFEV = 62, SAFEH = 45;
    var x = 0, y = 0, vx = 0, vy = 0, fuel = FUEL, thr = false, tx = 0, px = 0, kl = 0, kr = 0, dn = false, t = 0, burn = 0;
    function lay() { var W = api.w, H = api.h, s = Math.max(0.8, Math.min(1.4, Math.min(W, H) / 450)); return { W: W, H: H, s: s, gy: H - 56 * s, pw: 96 * s, sh: 14 * s }; }
    function reset() { var L = lay(), s = L.s; px = L.W * (0.25 + Math.random() * 0.5); x = Math.max(40, Math.min(L.W - 40, px + (Math.random() - 0.5) * 220)); y = L.gy - 320 * s; vx = 0; vy = 0; fuel = FUEL; thr = false; tx = x; t = 0; burn = 0; st = 'play'; }
    function setThr(v) { thr = v; }
    px = 400; x = 400; y = 70;
    return {
      pausar: function () { thr = false; dn = false; kl = kr = 0; },
      dbg: function () { var L = lay(); return { st: st, x: x, y: y, vx: vx, vy: vy, fuel: fuel, pad: px, pw: L.pw, gy: L.gy, sh: L.sh, safev: SAFEV, thr: thr }; },
      down: function (x_, y_) { if (menu()) return; dn = true; tx = x_; thr = true; },
      move: function (x_, y_, pr) { if (dn && pr) tx = x_; },
      up: function () { dn = false; thr = false; },
      key: function (k, d) { if (k === 'ArrowLeft' || k === 'KeyA') kl = d ? 1 : 0; else if (k === 'ArrowRight' || k === 'KeyD') kr = d ? 1 : 0; else if (k === 'Space' || k === 'ArrowUp' || k === 'KeyW') { if (st === 'play') thr = !!d; else if (d) menu(); } else if (d && st !== 'play') menu(); },
      update: function (dt) {
        if (st !== 'play') return; var L = lay(); t += dt;
        if (kl || kr) tx = Math.max(20, Math.min(L.W - 20, x + (kr - kl) * 90));
        var ax = Math.max(-230, Math.min(230, 5.5 * (tx - x) - 3.4 * vx));
        vx += ax * dt; var a = G; if (thr && fuel > 0) { a -= A; fuel = Math.max(0, fuel - 12 * dt); burn = 0.1; } vy += a * dt; x += vx * dt; y += vy * dt; if (burn > 0) burn -= dt;
        if (x < 10) { x = 10; vx = 0; } if (x > L.W - 10) { x = L.W - 10; vx = 0; }
        if (y + L.sh >= L.gy) { y = L.gy - L.sh; var onpad = Math.abs(x - px) <= L.pw / 2 - 6; st = (onpad && vy <= SAFEV && Math.abs(vx) <= SAFEH) ? 'win' : 'lose'; if (api.nota) api.nota(st === 'win' ? 600 : 90, 0.3, st === 'win' ? 'sine' : 'sawtooth', 0.07); }
      },
      draw: function () {
        var L = lay(), W = L.W, H = L.H, s = L.s, i;
        bg('#0f2a44', '#1d4a66');
        g.fillStyle = 'rgba(255,255,255,.5)'; for (i = 0; i < 18; i++) g.fillRect((i * 97) % W, (i * 53) % (H * 0.5), 2, 2);
        g.fillStyle = '#14384f'; g.fillRect(0, L.gy, W, H - L.gy);
        g.fillStyle = '#4a4a52'; g.fillRect(0, L.gy - 6, W, 14 * s); g.fillStyle = '#e8c878'; rr(px - L.pw / 2, L.gy - 8, L.pw, 12 * s, 4); g.fill();
        g.fillStyle = 'rgba(111,211,160,.8)'; g.fillRect(px - 4, L.gy - 30 * s, 8, 22 * s);
        g.save(); g.translate(x, y); g.fillStyle = '#7a4a24'; g.beginPath(); g.moveTo(-26 * s, 0); g.lineTo(26 * s, 0); g.lineTo(16 * s, 14 * s); g.lineTo(-16 * s, 14 * s); g.closePath(); g.fill();
        g.fillStyle = '#d8d0b8'; g.fillRect(-1.5, -24 * s, 3, 24 * s); g.beginPath(); g.moveTo(1.5, -24 * s); g.lineTo(18 * s, -6 * s); g.lineTo(1.5, -6 * s); g.fill();
        if (st === 'play' && thr && fuel > 0) { g.fillStyle = '#ffb040'; g.beginPath(); g.moveTo(-8 * s, 14 * s); g.lineTo(8 * s, 14 * s); g.lineTo(0, 14 * s + 18 * s + Math.random() * 8); g.fill(); } g.restore();
        var bx = W / 2 - 110, by = H - 16; bar(bx, by, 220, 6, fuel / FUEL, fuel < 12 ? '#c0392b' : '#6fd3a0');
        var vf = Math.max(0, Math.min(1, vy / 240)); g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(bx, by - 12, 220, 6); g.fillStyle = vy <= SAFEV ? '#6fd3a0' : '#ff9a8d'; g.fillRect(bx, by - 12, 220 * vf, 6); g.fillStyle = '#fff'; g.fillRect(bx + 220 * SAFEV / 240 - 1, by - 15, 2, 12);
        hud(T.h1 + ' ' + Math.round(fuel), T.h2 + ' ' + Math.max(0, Math.round(vy)), vy > SAFEV);
        fim(st);
      }
    };
  }
});
