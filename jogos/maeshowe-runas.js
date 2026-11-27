/* Maeshowe — decifre a sequência secreta de runas. */
BTJogo.registrar({
  canvas: 'jogo-maeshowe',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A câmara de Maeshowe",
    "sub": "Há uma sequência secreta de 4 runas, de 6 tipos possíveis (podem repetir). Toque numa runa abaixo para pô-la na próxima casa e toque em Tentar. Pino dourado: runa certa no lugar certo. Pino claro: runa certa no lugar errado. Você tem 7 tentativas.",
    "perdeu": "As tentativas ou o tempo acabaram",
    "v1": "Você decifrou a sequência!",
    "v2": "Em Maeshowe, nas ilhas Órcades, vikings deixaram inscrições rúnicas nas paredes. A sequência secreta é invenção.",
    "h1": "Tentativas",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The chamber of Maeshowe",
    "sub": "There is a secret sequence of 4 runes, from 6 possible kinds (they may repeat). Tap a rune below to put it in the next slot and tap Try. Gold peg: right rune in the right place. Light peg: right rune in the wrong place. You have 7 tries.",
    "perdeu": "The tries or the time ran out",
    "v1": "You deciphered the sequence!",
    "v2": "In Maeshowe, in the Orkney Islands, Vikings left runic inscriptions on the walls. The secret sequence is made up.",
    "h1": "Tries",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Kammeret i Maeshowe",
    "sub": "Det finnes en hemmelig rekkefølge av 4 runer, av 6 mulige typer (de kan gjentas). Trykk på en rune nedenfor for å sette den i neste rute, og trykk Prøv. Gull-pinne: rett rune på rett sted. Lys pinne: rett rune på feil sted. Du har 7 forsøk.",
    "perdeu": "Forsøkene eller tiden var brukt opp",
    "v1": "Du knekte rekkefølgen!",
    "v2": "I Maeshowe på Orknøyene la vikinger igjen runeinnskrifter på veggene. Den hemmelige rekkefølgen er diktet opp.",
    "h1": "Forsøk",
    "h2": "Tid"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "La cámara de Maeshowe",
    "sub": "Hay una secuencia secreta de 4 runas, de 6 tipos posibles (pueden repetirse). Toca una runa de abajo para ponerla en la siguiente casilla y toca Probar. Clavija dorada: runa correcta en el lugar correcto. Clavija clara: runa correcta en el lugar equivocado. Tienes 7 intentos.",
    "perdeu": "Se acabaron los intentos o el tiempo",
    "v1": "¡Descifraste la secuencia!",
    "v2": "En Maeshowe, en las islas Orcadas, los vikingos dejaron inscripciones rúnicas en las paredes. La secuencia secreta es un invento.",
    "h1": "Intentos",
    "h2": "Tiempo"
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
    var NS = 4, NR = 6, MAXT = 7, LIM = 240, RUN = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ'];
    var secret = [], rows = [], cur = [], tmr = LIM, cs = 0;
    function lay() { var W = api.w, H = api.h, rh = Math.max(22, Math.min(34, (H - 270) / MAXT)); return { rh: rh, top: 84, x: W / 2 - 150, pw: 300, py: H - 108, ph: 46 }; }
    function setup() { secret = []; for (var i = 0; i < NS; i++) secret.push(Math.floor(Math.random() * NR)); rows = []; cur = []; tmr = LIM; }
    function reset() { setup(); st = 'play'; }
    function score(a, s) { var ex = 0, tmp = s.slice(), ag = a.slice(), i; for (i = 0; i < NS; i++) if (ag[i] === tmp[i]) { ex++; ag[i] = -1; tmp[i] = -2; } var ne = 0; for (i = 0; i < NS; i++) if (ag[i] >= 0) { var k = tmp.indexOf(ag[i]); if (k >= 0) { ne++; tmp[k] = -2; } } return { ex: ex, ne: ne }; }
    function add(k) { if (st !== 'play' || cur.length >= NS) return; cur.push(k); if (api.nota) api.nota(300 + k * 50, 0.04, 'triangle', 0.04); }
    function del() { cur.pop(); }
    function submit() { if (st !== 'play' || cur.length < NS) return; var sc = score(cur, secret); rows.push({ g: cur.slice(), ex: sc.ex, ne: sc.ne }); cur = []; if (sc.ex === NS) { st = 'win'; if (api.nota) api.nota(700, 0.2, 'triangle', 0.06); return; } if (rows.length >= MAXT) st = 'lose'; }
    function pal() { var L = lay(), w = 44, gap = 8, tot = NR * w + (NR - 1) * gap, x0 = api.w / 2 - tot / 2, a = []; for (var i = 0; i < NR; i++) a.push({ x: x0 + i * (w + gap), y: L.py, w: w, h: L.ph, k: i }); return a; }
    function btns() { var L = lay(), y = L.py + L.ph + 12; return { del: { x: api.w / 2 - 120, y: y, w: 100, h: 34 }, ok: { x: api.w / 2 + 20, y: y, w: 100, h: 34 } }; }
    function inb(b, x, y) { return x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h; }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var p = pal(), b = btns(); return { st: st, secret: secret.slice(), rows: rows.length, cur: cur.slice(), tmr: tmr, rune: function (k) { return { x: p[k].x + p[k].w / 2, y: p[k].y + p[k].h / 2 }; }, ok: { x: b.ok.x + 50, y: b.ok.y + 17 }, del: { x: b.del.x + 50, y: b.del.y + 17 }, hist: rows.map(function (r) { return { g: r.g.slice(), ex: r.ex, ne: r.ne }; }) }; },
      down: function (x, y) { if (menu()) return; var p = pal(), b = btns(); for (var i = 0; i < NR; i++) if (inb(p[i], x, y)) { add(i); return; } if (inb(b.ok, x, y)) submit(); else if (inb(b.del, x, y)) del(); },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } var n = parseInt(String(k).replace('Digit', ''), 10); if (n >= 1 && n <= NR) add(n - 1); else if (k === 'Enter' || k === 'Space') submit(); else if (k === 'Backspace') del(); },
      update: function (dt) { if (st !== 'play') return; tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; } },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), i, j, p = pal(), b = btns();
        bg('#2a1f2a', '#0a060a');
        for (i = 0; i < MAXT; i++) { var y = L.top + i * L.rh, r = rows[i]; g.fillStyle = 'rgba(255,255,255,.05)'; rr(L.x, y, L.pw, L.rh - 3, 6); g.fill();
          for (j = 0; j < NS; j++) { var v = r ? r.g[j] : (i === rows.length && st === 'play' && j < cur.length ? cur[j] : -1); if (v >= 0) txt(RUN[v], L.x + 28 + j * 38, y + L.rh * 0.75, L.rh * 0.8, r ? '#ffd88a' : '#fff'); else { g.fillStyle = 'rgba(255,255,255,.12)'; g.beginPath(); g.arc(L.x + 28 + j * 38, y + (L.rh - 3) / 2, 4, 0, 6.283); g.fill(); } }
          if (r) { for (j = 0; j < NS; j++) { g.fillStyle = j < r.ex ? '#ffd88a' : j < r.ex + r.ne ? '#d8d8d8' : 'rgba(255,255,255,.1)'; g.beginPath(); g.arc(L.x + 200 + (j % 2) * 18 + 20, y + (L.rh - 3) / 2 + (j < 2 ? -6 : 6) * (L.rh > 26 ? 1 : 0.6), 5, 0, 6.283); g.fill(); } } }
        for (i = 0; i < NR; i++) { g.fillStyle = 'rgba(255,255,255,.14)'; rr(p[i].x, p[i].y, p[i].w, p[i].h, 8); g.fill(); txt(RUN[i], p[i].x + p[i].w / 2, p[i].y + p[i].h * 0.72, 30, '#ffd88a'); }
        g.fillStyle = 'rgba(255,255,255,.14)'; rr(b.del.x, b.del.y, b.del.w, b.del.h, 8); g.fill(); txt('⌫', b.del.x + 50, b.del.y + 25, 22, '#fff');
        g.fillStyle = cur.length >= NS ? '#ffd88a' : 'rgba(255,216,138,.3)'; rr(b.ok.x, b.ok.y, b.ok.w, b.ok.h, 8); g.fill(); txt('✓', b.ok.x + 50, b.ok.y + 26, 24, '#2a1a08');
        bar(W / 2 - 110, H - 10, 220, 4, tmr / LIM, tmr < 40 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + rows.length + '/' + MAXT, T.h2 + ' ' + Math.ceil(tmr), rows.length >= MAXT - 2);
        fim(st);
      }
    };
  }
});
