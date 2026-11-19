/* Brávellir — a frota escondida (invenção). */
BTJogo.registrar({
  canvas: 'jogo-bravellir',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A frota de Brávellir",
    "sub": "Navios estão escondidos no mapa, em linha, sem se tocar. Os números nas bordas dizem quantas casas de navio há em cada linha e coluna. Toque numa casa para atacá-la: se houver navio, ele aparece. Afunde todas as casas de navio com um número limitado de ataques. O tempo é limitado. São 3 mapas.",
    "perdeu": "Os ataques ou o tempo acabaram",
    "v1": "Frota encontrada!",
    "v2": "Segundo as fontes, os suecos teriam construído 3.000 navios para Brávellir, um número lendário; a batalha é de existência incerta. Achar navios escondidos é invenção.",
    "h1": "Mapa",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The fleet of Brávellir",
    "sub": "Ships are hidden on the map, in straight lines, never touching. The numbers on the edges say how many ship squares there are in each row and column. Tap a square to attack it: if there is a ship, it shows. Sink every ship square with a limited number of attacks. Time is limited. There are 3 maps.",
    "perdeu": "The attacks or the time ran out",
    "v1": "Fleet found!",
    "v2": "According to the sources, the Swedes built 3,000 ships for Brávellir, a legendary number; the battle’s existence is uncertain. Finding hidden ships is invented.",
    "h1": "Map",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Flåten ved Brávellir",
    "sub": "Skip er skjult på kartet, i rette linjer, uten å røre hverandre. Tallene i kantene forteller hvor mange skipsruter det er i hver rad og kolonne. Trykk på en rute for å angripe den: ligger det et skip der, kommer det til syne. Senk alle skipsrutene med et begrenset antall angrep. Tiden er begrenset. Det er 3 kart.",
    "perdeu": "Angrepene eller tiden tok slutt",
    "v1": "Flåten er funnet!",
    "v2": "Ifølge kildene skal svenskene ha bygd 3000 skip til Brávellir, et legendarisk tall; slaget er av usikker eksistens. Å finne skjulte skip er oppfunnet.",
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
    var NS = [6, 7, 8], FL = [[3, 2, 2], [3, 3, 2, 2], [4, 3, 3, 2]], EX = [9, 10, 12], LIM = 360;
    var n = 6, ship = [], shot = [], left = 0, rc = [], cc = [], tot = 0;
    function place(N, fl) {
      for (var tries = 0; tries < 2000; tries++) {
        var b = [], i, ok = true; for (i = 0; i < N * N; i++) b.push(0);
        for (var f = 0; f < fl.length && ok; f++) {
          var len = fl[f], placed = false;
          for (var q = 0; q < 60 && !placed; q++) {
            var hz = Math.random() < 0.5, x = Math.floor(Math.random() * (hz ? N - len + 1 : N)), y = Math.floor(Math.random() * (hz ? N : N - len + 1)), cs = [], good = true, k;
            for (k = 0; k < len; k++) cs.push(hz ? y * N + x + k : (y + k) * N + x);
            for (k = 0; k < len && good; k++) { var cx = cs[k] % N, cy = Math.floor(cs[k] / N); for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) { var nx = cx + dx, ny = cy + dy; if (nx >= 0 && ny >= 0 && nx < N && ny < N && b[ny * N + nx]) good = false; } }
            if (good) { for (k = 0; k < len; k++) b[cs[k]] = 1; placed = true; }
          }
          if (!placed) ok = false;
        }
        if (ok) return b;
      }
      return null;
    }
    function load(i) {
      n = NS[i]; ship = place(n, FL[i]); shot = []; rc = []; cc = []; tot = 0; var k, x, y;
      for (k = 0; k < n * n; k++) { shot.push(0); tot += ship[k]; }
      for (y = 0; y < n; y++) { var a = 0; for (x = 0; x < n; x++) a += ship[y * n + x]; rc.push(a); }
      for (x = 0; x < n; x++) { var b = 0; for (y = 0; y < n; y++) b += ship[y * n + x]; cc.push(b); }
      left = tot + EX[i];
    }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function hits() { var h = 0; for (var i = 0; i < n * n; i++) if (shot[i] === 2) h++; return h; }
    function tap(i) {
      if (pend > 0 || st !== 'play' || shot[i]) return;
      shot[i] = ship[i] ? 2 : 1; left--; if (api.nota) api.nota(ship[i] ? 520 : 240, 0.06, 'square', 0.04);
      if (hits() === tot) lvlUp(); else if (left <= 0) st = 'lose';
    }
    function pos() { var L = glay(n + 1, n + 1, 70, 30), a = []; for (var i = 0; i < n * n; i++) a.push({ x: L.x0 + (i % n + 1.5) * L.s, y: L.y0 + (Math.floor(i / n) + 1.5) * L.s }); return a; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lvl: lvl, pend: pend, ship: ship.slice(), shot: shot.slice(), left: left, pos: pos() }; },
      down: function (x, y) { if (menu()) return; var L = glay(n + 1, n + 1, 70, 30), c = Math.floor((x - L.x0) / L.s) - 1, r = Math.floor((y - L.y0) / L.s) - 1; if (c < 0 || r < 0 || c >= n || r >= n) return; tap(r * n + c); },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) { tick(dt, load); },
      draw: function () {
        var L = glay(n + 1, n + 1, 70, 30), s = L.s, i; bg('#12283a', '#050d16');
        for (i = 0; i < n; i++) { txt(String(rc[i]), L.x0 + s * 0.5, L.y0 + (i + 1.5) * s, Math.max(11, s * 0.42), '#c9b3f2'); txt(String(cc[i]), L.x0 + (i + 1.5) * s, L.y0 + s * 0.5, Math.max(11, s * 0.42), '#c9b3f2'); }
        for (i = 0; i < n * n; i++) {
          var x = L.x0 + (i % n + 1) * s, y = L.y0 + (Math.floor(i / n) + 1) * s;
          g.fillStyle = shot[i] === 2 ? '#8a5a2a' : (shot[i] === 1 ? 'rgba(80,140,200,.35)' : 'rgba(255,255,255,.08)'); rr(x + 2, y + 2, s - 4, s - 4, 6); g.fill();
          if (shot[i] === 2) { g.fillStyle = '#d9a050'; rr(x + s * 0.18, y + s * 0.3, s * 0.64, s * 0.4, 8); g.fill(); }
          if (shot[i] === 1) { g.fillStyle = 'rgba(200,225,255,.55)'; g.beginPath(); g.arc(x + s / 2, y + s / 2, s * 0.08, 0, 7); g.fill(); }
        }
        txt(String(left), api.w / 2, api.h - 20, 16, left <= 3 ? '#ff9a8d' : '#f3ecd2');
        foot(); hh(); fim(st);
      }
    };

  }
});
