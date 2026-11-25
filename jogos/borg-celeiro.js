/* Borg — reparta os grãos da colheita pelos depósitos. */
BTJogo.registrar({
  canvas: 'jogo-borg',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os grãos do chefe",
    "sub": "Cada depósito tem 4 grãos. Escolha um dos seus (embaixo) e os grãos são repartidos, um por depósito, para a direita. Se o último cair no seu celeiro (à direita), jogue de novo. Se cair num depósito seu vazio, você leva também os grãos do depósito em frente. Termine com mais grãos no celeiro do que o rival.",
    "perdeu": "O rival guardou mais grãos",
    "v1": "O celeiro do chefe está cheio!",
    "v2": "Em Borg, nas Lofoten, foi escavada uma grande casa longa de chefe. O jogo de repartir grãos é invenção.",
    "h1": "Celeiro",
    "h2": "Rival"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The chief's grain",
    "sub": "Every store-room holds 4 grains. Pick one of yours (bottom row) and the grains are sown one per room, towards the right. If the last one lands in your granary (right), play again. If it lands in an empty room of yours, you also take the grains in the room opposite. End with more grain in your granary than your rival.",
    "perdeu": "The rival stored more grain",
    "v1": "The chief's granary is full!",
    "v2": "At Borg, in the Lofoten Islands, a great chieftain longhouse was excavated. The grain-sowing game is made up.",
    "h1": "Granary",
    "h2": "Rival"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Høvdingens korn",
    "sub": "Hvert lagerrom har 4 korn. Velg ett av dine (nederst), og kornene fordeles ett for hvert rom, mot høyre. Hvis det siste havner i kornloftet ditt (til høyre), spiller du igjen. Havner det i et tomt rom hos deg, tar du også kornene i rommet rett overfor. Avslutt med mer korn i kornloftet enn motstanderen.",
    "perdeu": "Motstanderen lagret mest korn",
    "v1": "Høvdingens kornloft er fullt!",
    "v2": "På Borg i Lofoten er et stort høvdinghus gravd ut. Kornspillet er diktet opp.",
    "h1": "Kornloft",
    "h2": "Rival"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "Los granos del jefe",
    "sub": "Cada depósito tiene 4 granos. Elige uno de los tuyos (abajo) y los granos se reparten, uno por depósito, hacia la derecha. Si el último cae en tu granero (a la derecha), juegas otra vez. Si cae en un depósito tuyo vacío, te llevas también los granos del depósito de enfrente. Termina con más granos en el granero que el rival.",
    "perdeu": "El rival guardó más granos",
    "v1": "¡El granero del jefe está lleno!",
    "v2": "En Borg, en las Lofoten, se excavó una gran casa larga de jefe. El juego de repartir granos es invención.",
    "h1": "Granero",
    "h2": "Rival"
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
    var LIM = 300;
    var b = [], turn = 1, wait = 0, tmr = LIM, cur = 0, pop = 0, lastp = -1, msg = '', msgt = 0;
    function lay() { var W = api.w, H = api.h, cw = Math.min((W - 40) / 8, 84), ch = Math.min(110, (H - 190) / 2.2); return { cw: cw, ch: ch, x: (W - cw * 8) / 2, y: Math.max(88, (H - ch * 2.2) / 2 + 4) }; }
    function pos(i) { var L = lay(), col, row; if (i < 6) { col = i + 1; row = 1; } else if (i === 6) { col = 7; row = 0.5; } else if (i < 13) { col = 12 - i + 1; row = 0; } else { col = 0; row = 0.5; }
      if (i === 6 || i === 13) return { x: L.x + (col + 0.5) * L.cw, y: L.y + L.ch * 0.6 + L.ch / 2, w: L.cw * 0.9, h: L.ch * 1.4 }; return { x: L.x + (col + 0.5) * L.cw, y: L.y + row * L.ch * 1.2 + L.ch / 2, w: L.cw * 0.9, h: L.ch * 0.95 }; }
    function sow(bb, i, who) { var n = bb[i], skip = who === 1 ? 13 : 6, mine = who === 1 ? 6 : 13, k = i; bb[i] = 0; while (n > 0) { k = (k + 1) % 14; if (k === skip) continue; bb[k]++; n--; }
      var extra = k === mine, cap = 0; var own = who === 1 ? (k >= 0 && k <= 5) : (k >= 7 && k <= 12); if (!extra && own && bb[k] === 1 && bb[12 - k] > 0) { cap = bb[12 - k] + 1; bb[mine] += cap; bb[k] = 0; bb[12 - k] = 0; } return { extra: extra, cap: cap, last: k }; }
    function over() { var a = 0, c = 0, i; for (i = 0; i < 6; i++) { a += b[i]; c += b[i + 7]; } return a === 0 || c === 0; }
    function finish() { var i; for (i = 0; i < 6; i++) { b[6] += b[i]; b[i] = 0; b[13] += b[i + 7]; b[i + 7] = 0; } st = b[6] > b[13] ? 'win' : 'lose'; }
    function setup() { b = []; for (var i = 0; i < 14; i++) b.push(i === 6 || i === 13 ? 0 : 4); turn = 1; wait = 0; tmr = LIM; cur = 0; msg = ''; lastp = -1; }
    function reset() { setup(); st = 'play'; }
    function move(i, who) { if (st !== 'play' || b[i] === 0) return false; var r = sow(b, i, who); lastp = r.last; if (api.nota) api.nota(r.cap ? 600 : 320, 0.07, 'triangle', 0.05); if (r.cap) { msg = '+' + r.cap; msgt = 1; } else if (r.extra) { msg = '↻'; msgt = 0.8; }
      if (over()) { finish(); return true; } if (r.extra) { wait = who === 2 ? 0.7 : 0; } else { turn = who === 1 ? 2 : 1; wait = who === 1 ? 0.6 : 0.5; } return true; }
    function aiPick() { var best = -1, bs = -1e9, i; var opts = []; for (i = 7; i < 13; i++) if (b[i] > 0) { var c = b.slice(), r = sow(c, i, 2), s = (c[13] - b[13]) * 2 + (r.extra ? 3 : 0); opts.push({ i: i, s: s + Math.random() * 1.5 }); } opts.sort(function (x, y) { return y.s - x.s; }); if (Math.random() < 0.2) return opts[Math.floor(Math.random() * opts.length)].i; return opts[0].i; }
    setup();
    return {
      pausar: function () {},
      dbg: function () { return { st: st, b: b.slice(), turn: turn, wait: wait, pos: pos, tmr: tmr }; },
      down: function (x, y) { if (menu()) return; if (turn !== 1 || wait > 0) return; for (var i = 0; i < 6; i++) { var p = pos(i); if (Math.abs(x - p.x) < p.w / 2 + 4 && Math.abs(y - p.y) < p.h / 2 + 6) { cur = i; move(i, 1); return; } } },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'ArrowLeft' || k === 'KeyA') cur = (cur + 5) % 6; else if (k === 'ArrowRight' || k === 'KeyD') cur = (cur + 1) % 6; else if ((k === 'Space' || k === 'Enter') && turn === 1 && wait <= 0) move(cur, 1); },
      update: function (dt) { pop += dt; if (msgt > 0) msgt -= dt; if (st !== 'play') return; tmr -= dt; if (tmr <= 0) { tmr = 0; finish(); st = b[6] > b[13] ? 'win' : 'lose'; return; } if (wait > 0) { wait -= dt; return; } if (turn === 2) move(aiPick(), 2); },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), i;
        bg('#3a2a1a', '#120c06');
        g.fillStyle = 'rgba(0,0,0,.3)'; rr(L.x - 6, L.y - 6, L.cw * 8 + 12, L.ch * 2.2 + 12, 14); g.fill();
        for (i = 0; i < 14; i++) { var p = pos(i), big = i === 6 || i === 13; g.fillStyle = big ? 'rgba(255,216,138,.16)' : (i < 6 ? 'rgba(255,216,138,.10)' : 'rgba(138,166,216,.10)'); rr(p.x - p.w / 2, p.y - p.h / 2, p.w, p.h, 12); g.fill();
          if (i === cur && turn === 1 && st === 'play') { g.strokeStyle = '#ffd88a'; g.lineWidth = 3; rr(p.x - p.w / 2, p.y - p.h / 2, p.w, p.h, 12); g.stroke(); }
          if (i === lastp) { g.strokeStyle = 'rgba(255,255,255,.5)'; g.lineWidth = 2; rr(p.x - p.w / 2 + 2, p.y - p.h / 2 + 2, p.w - 4, p.h - 4, 10); g.stroke(); }
          var n = b[i]; if (n > 0) { var m = Math.min(n, 12); for (var k = 0; k < m; k++) { var a = k * 2.4, rd = 4 + (k % 4) * 5; g.fillStyle = i < 7 ? '#ffd88a' : '#a8c0f0'; g.beginPath(); g.arc(p.x + Math.cos(a) * rd * 1.4, p.y - 6 + Math.sin(a) * rd, 5, 0, 6.283); g.fill(); } txt(String(n), p.x, p.y + p.h / 2 - 6, 16, 'rgba(255,255,255,.85)'); } }
        txt(turn === 1 ? '▶' : '…', W / 2, L.y + L.ch * 2.2 + 36, 18, 'rgba(255,255,255,.5)'); if (msgt > 0) txt(msg, W / 2, L.y - 14, 26, 'rgba(255,216,138,' + Math.min(1, msgt) + ')');
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 40 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + b[6], T.h2 + ' ' + b[13], b[13] > b[6]);
        fim(st);
      }
    };
  }
});
