/* Folclore de Orkney — a porta do monte (invenção). */
BTJogo.registrar({
  canvas: 'jogo-hogboon',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A porta do monte",
    "sub": "A porta do monte está escondida numa casa do mapa. Toque numa casa para sondá-la: o número mostra a distância até a porta, contando passos para cima, para baixo e para os lados, sem diagonais. Zero é a porta. Ache a porta com um número limitado de sondagens. O tempo é limitado. São 3 mapas, cada um maior que o anterior.",
    "perdeu": "As sondagens ou o tempo acabaram",
    "v1": "Porta encontrada!",
    "v2": "No folclore de Orkney, o hogboon, ou hogboy, é um espírito de montes; contos avisam contra escavá-los, e tempestades depois de escavações são ligadas a isso. Procurar a porta é invenção.",
    "h1": "Mapa",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The door of the mound",
    "sub": "The door of the mound is hidden in one square of the map. Tap a square to probe it: the number shows the distance to the door, counting steps up, down and sideways, with no diagonals. Zero is the door. Find the door with a limited number of probes. Time is limited. There are 3 maps, each larger than the last.",
    "perdeu": "The probes or the time ran out",
    "v1": "Door found!",
    "v2": "In Orkney folklore, the hogboon, or hogboy, is a spirit of mounds; tales warn against digging them, and storms after excavations are linked to this. Searching for the door is invented.",
    "h1": "Map",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Porten i haugen",
    "sub": "Porten i haugen er skjult i én rute på kartet. Trykk på en rute for å lodde den: tallet viser avstanden til porten, regnet i steg opp, ned og sideveis, uten diagonaler. Null er porten. Finn porten med et begrenset antall lodd. Tiden er begrenset. Det er 3 kart, hvert større enn det forrige.",
    "perdeu": "Loddene eller tiden tok slutt",
    "v1": "Porten er funnet!",
    "v2": "I folketroen på Orknøyene er hogboon, eller hogboy, en ånd i hauger; fortellinger advarer mot å grave i dem, og stormer etter utgravinger knyttes til dette. Å lete etter porten er oppfunnet.",
    "h1": "Kart",
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
    var NL = 3, lvl = 0, t = 0, pend = 0;
    function lvlUp() { lvl++; pend = 0.9; if (api.nota) api.nota(520, 0.2, 'triangle', 0.07); }
    function tick(dt, load) { if (st !== 'play') return; t += dt; if (pend > 0) { pend -= dt; if (pend <= 0) { if (lvl >= NL) st = 'win'; else load(lvl); } } if (st === 'play' && t >= LIM) st = 'lose'; }
    function foot() { bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 60 ? '#c0392b' : '#ffd88a'); }
    function hh() { hud(T.h1 + ' ' + Math.min(lvl + 1, NL) + '/' + NL, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false); }
    function glay(R, C, top, bot) { var W = api.w, H = api.h, s = Math.min((W - 24) / C, (H - top - bot) / R, 96); return { s: s, x0: (W - s * C) / 2, y0: top + ((H - top - bot) - s * R) / 2 }; }
    function sh(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
    var NS = [6, 7, 8], PR = [5, 6, 6], LIM = 300;
    var n = 6, door = 0, val = [], left = 0;
    function load(i) { n = NS[i]; door = Math.floor(Math.random() * n * n); val = []; for (var k = 0; k < n * n; k++) val.push(-1); left = PR[i]; }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function tap(i) {
      if (pend > 0 || st !== 'play' || val[i] >= 0) return;
      val[i] = Math.abs(i % n - door % n) + Math.abs(Math.floor(i / n) - Math.floor(door / n)); left--; if (api.nota) api.nota(220 + (12 - Math.min(12, val[i])) * 30, 0.06, 'square', 0.04);
      if (val[i] === 0) lvlUp(); else if (left <= 0) st = 'lose';
    }
    function pos() { var L = glay(n, n, 70, 40), a = []; for (var i = 0; i < n * n; i++) a.push({ x: L.x0 + (i % n + 0.5) * L.s, y: L.y0 + (Math.floor(i / n) + 0.5) * L.s }); return a; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lvl: lvl, pend: pend, door: door, left: left, pos: pos() }; },
      down: function (x, y) { if (menu()) return; var L = glay(n, n, 70, 40), c = Math.floor((x - L.x0) / L.s), r = Math.floor((y - L.y0) / L.s); if (c < 0 || r < 0 || c >= n || r >= n) return; tap(r * n + c); },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) { tick(dt, load); },
      draw: function () {
        var L = glay(n, n, 70, 40), s = L.s, i; bg('#1f2a1a', '#070a05');
        for (i = 0; i < n * n; i++) {
          var x = L.x0 + (i % n) * s, y = L.y0 + Math.floor(i / n) * s, v = val[i];
          g.fillStyle = v < 0 ? 'rgba(255,255,255,.08)' : (v === 0 ? '#e0b040' : 'hsl(' + Math.max(0, 210 - v * 22) + ',55%,' + (v < 3 ? 52 : 38) + '%)'); rr(x + 2, y + 2, s - 4, s - 4, 8); g.fill();
          if (v >= 0) txt(v === 0 ? '⌂' : String(v), x + s / 2, y + s / 2 + 1, Math.max(12, s * 0.42), '#f3ecd2');
        }
        txt(String(left), api.w / 2, api.h - 22, 16, left <= 1 ? '#ff9a8d' : '#f3ecd2');
        foot(); hh(); fim(st);
      }
    };

  }
});
