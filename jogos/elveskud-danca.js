/* Herr Oluf — dance no compasso do canto das elfas. */
BTJogo.registrar({
  canvas: 'jogo-elveskud',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A dança das elfas",
    "sub": "Notas descem por 4 pistas. Toque na pista (ou use ← ↓ ↑ →) quando a nota chegar à linha dourada. Cada acerto enche o fôlego; cada nota perdida o esvazia. Dance até o fim da canção sem ficar sem fôlego.",
    "perdeu": "O fôlego acabou",
    "v1": "Você dançou até o amanhecer!",
    "v2": "Na balada dinamarquesa de Herr Oluf, as elfas convidam o cavaleiro para dançar até o amanhecer. A melodia do jogo é invenção.",
    "h1": "Acertos",
    "h2": "Fôlego"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The dance of the elves",
    "sub": "Notes fall down 4 lanes. Tap the lane (or use ← ↓ ↑ →) when a note reaches the golden line. Each hit fills your breath; each missed note drains it. Dance to the end of the song without running out of breath.",
    "perdeu": "You ran out of breath",
    "v1": "You danced until dawn!",
    "v2": "In the Danish ballad of Sir Olaf, the elves invite the knight to dance until dawn. The melody of the game is made up.",
    "h1": "Hits",
    "h2": "Breath"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Alvenes dans",
    "sub": "Noter faller nedover 4 baner. Trykk på banen (eller bruk ← ↓ ↑ →) når en note når den gylne linjen. Hvert treff fyller pusten; hver tapte note tømmer den. Dans til slutten av sangen uten å gå tom for pust.",
    "perdeu": "Du gikk tom for pust",
    "v1": "Du danset til daggry!",
    "v2": "I den danske balladen om Herr Oluf inviterer alvene ridderen til å danse til daggry. Spillets melodi er diktet opp.",
    "h1": "Treff",
    "h2": "Pust"
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
    var SONG = 38, FALL = 1.5, WIN_ = 0.2;
    var notes = [], t = 0, breath = 60, hits = 0, total = 0, flash = [0, 0, 0, 0], pop = 0, fb = [0, 0, 0, 0];
    function lay() { var W = api.w, H = api.h, lw = Math.min(84, (W - 24) / 4), zone = H - 90; return { lw: lw, x0: (W - lw * 4) / 2, zone: zone, top: 70 }; }
    function setup() { notes = []; var tt = 2, lane = 1; while (tt < SONG - 1.5) { lane = Math.random() < 0.35 ? lane : Math.floor(Math.random() * 4); notes.push({ t: tt, lane: lane, d: false }); tt += 0.5 + (Math.random() < 0.5 ? 0.25 : 0) + (Math.random() < 0.2 ? 0.5 : 0); } total = notes.length; t = 0; breath = 60; hits = 0; flash = [0, 0, 0, 0]; }
    function reset() { setup(); st = 'play'; }
    function tapl(l) { if (st !== 'play') return; var best = null; notes.forEach(function (n) { if (!n.d && n.lane === l && Math.abs(n.t - t) < WIN_ && (!best || Math.abs(n.t - t) < Math.abs(best.t - t))) best = n; }); if (best) { best.d = true; hits++; breath = Math.min(100, breath + 5); fb[l] = 0.2; if (api.nota) api.nota([330, 392, 494, 587][l], 0.12, 'triangle', 0.06); } else { breath -= 4; flash[l] = 0.2; if (api.nota) api.nota(110, 0.08, 'square', 0.04); if (breath <= 0) { breath = 0; st = 'lose'; } } }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, t: t, breath: breath, hits: hits, total: total, notes: notes.filter(function (n) { return !n.d && n.t > t - 0.4 && n.t < t + 3; }).map(function (n) { return { lane: n.lane, dt: n.t - t }; }), lane: function (l) { return { x: L.x0 + (l + 0.5) * L.lw, y: L.zone - 20 }; } }; },
      down: function (x, y) { if (menu()) return; var L = lay(), l = Math.floor((x - L.x0) / L.lw); if (l >= 0 && l < 4) tapl(l); },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } var m = { ArrowLeft: 0, ArrowDown: 1, ArrowUp: 2, ArrowRight: 3, KeyD: 0, KeyF: 1, KeyJ: 2, KeyK: 3, Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3 }[k]; if (m !== undefined) tapl(m); },
      update: function (dt) { pop += dt; for (var i = 0; i < 4; i++) { if (flash[i] > 0) flash[i] -= dt; if (fb[i] > 0) fb[i] -= dt; } if (st !== 'play') return; t += dt; notes.forEach(function (n) { if (!n.d && n.t < t - WIN_) { n.d = true; breath -= 12; flash[n.lane] = 0.3; if (api.nota) api.nota(100, 0.1, 'sawtooth', 0.05); } }); if (breath <= 0) { breath = 0; st = 'lose'; return; } if (t >= SONG) st = 'win'; },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), l;
        bg('#2a1a3a', '#0a0612');
        for (l = 0; l < 4; l++) { g.fillStyle = flash[l] > 0 ? 'rgba(192,57,43,.3)' : fb[l] > 0 ? 'rgba(255,216,138,.3)' : 'rgba(255,255,255,.06)'; g.fillRect(L.x0 + l * L.lw + 2, L.top, L.lw - 4, L.zone - L.top + 30); }
        g.fillStyle = '#ffd88a'; g.fillRect(L.x0, L.zone, L.lw * 4, 3);
        notes.forEach(function (n) { if (n.d) return; var y = L.zone - (n.t - t) / FALL * (L.zone - L.top); if (y < L.top - 20 || y > H) return; g.fillStyle = ['#c0392b', '#7fa86a', '#4a8ad0', '#d8b040'][n.lane]; g.beginPath(); g.arc(L.x0 + (n.lane + 0.5) * L.lw, y, Math.min(24, L.lw * 0.32), 0, 6.283); g.fill(); g.strokeStyle = 'rgba(255,255,255,.5)'; g.lineWidth = 2; g.stroke(); });
        bar(L.x0, H - 36, L.lw * 4, 8, breath / 100, breath < 25 ? '#c0392b' : '#7fd08a');
        bar(L.x0, H - 18, L.lw * 4, 4, t / SONG, '#ffd88a');
        hud(T.h1 + ' ' + hits + '/' + total, T.h2 + ' ' + Math.ceil(breath), breath < 25);
        fim(st);
      }
    };
  }
});
