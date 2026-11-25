/* Kong Lindorm — acerte o chicote no instante certo. */
BTJogo.registrar({
  canvas: 'jogo-lindorm',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O chicote da noiva",
    "sub": "Um marcador corre de um lado a outro da barra. Toque (ou use espaço) quando ele estiver na faixa dourada: a pancada acerta e uma pele do verme cai. A faixa fica mais estreita e o marcador mais rápido. Tire as 10 peles. Três erros e acaba.",
    "perdeu": "O verme ficou com a pele",
    "v1": "As dez peles caíram!",
    "v2": "No conto dinamarquês Kong Lindorm, a noiva precisa enfrentar o rei-verme e livrá-lo da pele. Os golpes do jogo são invenção.",
    "h1": "Peles",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The bride's whip",
    "sub": "A marker runs from side to side along the bar. Tap (or press Space) when it is inside the golden strip: the lash lands and a skin of the worm falls off. The strip narrows and the marker speeds up. Remove all 10 skins. Three mistakes and it is over.",
    "perdeu": "The worm kept its skin",
    "v1": "All ten skins fell!",
    "v2": "In the Danish tale Kong Lindorm, the bride has to face the worm king and free him from his skin. The lashes in the game are made up.",
    "h1": "Skins",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Brudens pisk",
    "sub": "En markør løper fra side til side langs linjen. Trykk (eller mellomrom) når den er innenfor det gylne feltet: slaget treffer, og et skinn faller av ormen. Feltet blir smalere og markøren raskere. Ta av alle 10 skinn. Tre feil, og det er slutt.",
    "perdeu": "Ormen beholdt skinnet",
    "v1": "Alle ti skinnene falt!",
    "v2": "I det danske eventyret Kong Lindorm må bruden møte ormekongen og befri ham fra skinnet. Slagene i spillet er diktet opp.",
    "h1": "Skinn",
    "h2": "Feil"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "El látigo de la novia",
    "sub": "Un marcador corre de un lado a otro de la barra. Toca (o usa el espacio) cuando esté en la franja dorada: el golpe acierta y cae una piel del gusano. La franja se estrecha y el marcador se acelera. Quita las 10 pieles. Con tres errores se acaba.",
    "perdeu": "El gusano se quedó con la piel",
    "v1": "¡Las diez pieles cayeron!",
    "v2": "En el cuento danés Kong Lindorm, la novia debe enfrentarse al rey-gusano y librarlo de la piel. Los golpes del juego son invención.",
    "h1": "Pieles",
    "h2": "Errores"
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
    var GOAL = 10, MAXERR = 3;
    var pos = 0, dir = 1, spd = 1.1, zc = 0.5, zw = 0.3, got = 0, err = 0, passes = 0, pop = 0, fl = 0, res = 0, crack = 0, shed = [];
    function newZone() { zw = Math.max(0.12, 0.3 - got * 0.018); zc = 0.15 + Math.random() * 0.7; zc = Math.max(zw / 2 + 0.03, Math.min(1 - zw / 2 - 0.03, zc)); spd = 1.1 + got * 0.12; }
    function setup() { pos = 0; dir = 1; got = 0; err = 0; passes = 0; fl = 0; res = 0; crack = 0; shed = []; newZone(); }
    function reset() { setup(); st = 'play'; }
    function lash() {
      if (st !== 'play') return; crack = 0.25; passes = 0;
      if (Math.abs(pos - zc) <= zw / 2) { got++; res = 1; shed.push({ t: 1, a: Math.random() * 6.28 }); if (api.nota) api.nota(520 + got * 30, 0.12, 'triangle', 0.07); if (got >= GOAL) { st = 'win'; return; } newZone(); }
      else { err++; res = -1; fl = 0.4; if (api.nota) api.nota(130, 0.2, 'sawtooth', 0.06); if (err >= MAXERR) st = 'lose'; }
    }
    setup();
    return {
      pausar: function () {},
      dbg: function () { return { st: st, pos: pos, zc: zc, zw: zw, got: got, err: err, spd: spd }; },
      down: function (x, y) { if (menu()) return; lash(); },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'Space' || k === 'Enter' || k === 'ArrowDown' || k === 'ArrowUp') lash(); },
      update: function (dt) {
        pop += dt; if (fl > 0) fl -= dt; if (crack > 0) crack -= dt; shed.forEach(function (s) { s.t -= dt; }); shed = shed.filter(function (s) { return s.t > 0; });
        if (st !== 'play') return; pos += dir * spd * dt; if (pos >= 1) { pos = 1; dir = -1; passes++; } else if (pos <= 0) { pos = 0; dir = 1; passes++; }
        if (passes >= 4) { passes = 0; err++; res = -1; fl = 0.4; if (api.nota) api.nota(130, 0.2, 'sawtooth', 0.06); if (err >= MAXERR) st = 'lose'; }
      },
      draw: function () {
        var W = api.w, H = api.h, i;
        bg('#2a1a22', '#0c0508');
        var cx = W / 2, cy = H * 0.42, n = GOAL - got;
        for (i = 0; i < 9; i++) { var a = pop * 1.2 + i * 0.7, x = cx + (i - 4) * Math.min(40, W / 12), y = cy + Math.sin(a) * 18; g.fillStyle = 'hsl(' + (140 - i * 4) + ',35%,' + (22 + (i % 2) * 5) + '%)'; g.beginPath(); g.arc(x, y, 26 - Math.abs(i - 4) * 1.5, 0, 6.283); g.fill(); }
        g.fillStyle = '#6a3a3a'; g.beginPath(); g.arc(cx + 5 * Math.min(40, W / 12), cy + Math.sin(pop * 1.2 + 9 * 0.7) * 18, 22, 0, 6.283); g.fill(); g.fillStyle = '#ffd88a'; g.fillRect(cx + 5 * Math.min(40, W / 12) + 4, cy + Math.sin(pop * 1.2 + 6.3) * 18 - 6, 5, 5);
        for (i = 0; i < GOAL; i++) { g.fillStyle = i < n ? 'rgba(210,190,150,.85)' : 'rgba(255,255,255,.12)'; g.fillRect(cx - GOAL * 11 + i * 22 + 2, cy + 48, 18, 10); }
        shed.forEach(function (s) { g.fillStyle = 'rgba(210,190,150,' + s.t + ')'; g.fillRect(cx + Math.cos(s.a) * 60 * (1.2 - s.t) - 8, cy - 20 - (1 - s.t) * 60, 16, 8); });
        if (crack > 0) { g.strokeStyle = 'rgba(255,255,255,' + crack * 3 + ')'; g.lineWidth = 3; g.beginPath(); g.moveTo(cx - 100, cy - 60); g.quadraticCurveTo(cx, cy - 110, cx + 90, cy - 20); g.stroke(); }
        var bw = Math.min(W - 60, 560), bx = (W - bw) / 2, by = H - 100;
        g.fillStyle = 'rgba(255,255,255,.12)'; rr(bx, by, bw, 22, 11); g.fill(); g.fillStyle = 'rgba(255,216,138,.85)'; g.fillRect(bx + (zc - zw / 2) * bw, by, zw * bw, 22);
        g.fillStyle = fl > 0 ? '#c0392b' : '#fff'; g.fillRect(bx + pos * bw - 3, by - 8, 6, 38);
        if (res !== 0 && (fl > 0 || crack > 0)) txt(res > 0 ? '✓' : '✗', W / 2, by - 24, 26, res > 0 ? '#7ad07a' : '#c0392b');
        hud(T.h1 + ' ' + got + '/' + GOAL, T.h2 + ' ' + err + '/' + MAXERR, err > 0);
        fim(st);
      }
    };
  }
});
