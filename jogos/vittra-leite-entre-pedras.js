/* Vittra — o leite entre as pedras (invenção). */
BTJogo.registrar({
  canvas: 'jogo-vittra',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O leite da vittra",
    "sub": "Uma vittra faz jarras de leite e pedras descerem por uma trilha de três faixas. Você está na parte de baixo. Toque à esquerda ou à direita de onde você está para mudar de faixa, ou use as setas do teclado. Pegue as jarras de leite e desvie das pedras. Junte 14 jarras. Bater em uma pedra conta como erro, e três erros encerram a partida.",
    "perdeu": "Três erros",
    "v1": "Leite recolhido!",
    "v2": "As vittror são seres do norte da Suécia que vivem sob a terra e têm gado próprio; podem ficar perigosas se forem desrespeitadas. Recolher leite entre pedras é invenção.",
    "h1": "Leite",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The vittra’s milk",
    "sub": "A vittra sends milk jars and rocks down a path of three lanes. You stand at the bottom. Tap left or right of where you are to change lane, or use the keyboard arrows. Catch the milk jars and dodge the rocks. Collect 14 jars. Hitting a rock counts as a mistake, and three mistakes end the game.",
    "perdeu": "Three mistakes",
    "v1": "Milk gathered!",
    "v2": "The vittror are beings of northern Sweden who live underground and have their own cattle; they can turn dangerous if they are disrespected. Gathering milk among rocks is invented.",
    "h1": "Milk",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Vittraens melk",
    "sub": "En vittra lar melkekrukker og steiner falle nedover en sti med tre felt. Du står nederst. Trykk til venstre eller høyre for der du er for å bytte felt, eller bruk piltastene. Fang melkekrukkene og unngå steinene. Samle 14 krukker. Å treffe en stein teller som en feil, og tre feil avslutter spillet.",
    "perdeu": "Tre feil",
    "v1": "Melken er samlet!",
    "v2": "Vittrene er vesener i Nord-Sverige som bor under jorden og har sin egen buskap; de kan bli farlige hvis de ikke blir vist respekt. Å samle melk mellom steiner er oppfunnet.",
    "h1": "Melk",
    "h2": "Feil"
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
    var NEED = 14, MAXE = 3;
    var lane = 1, items = [], score = 0, err = 0, sp = 0, spd = 0, fl = 0;
    function lay() { var W = api.w, H = api.h, lw = Math.min(W / 3 - 6, 120); return { lw: lw, x0: W / 2 - lw * 1.5, py: H - 66, top: 70 }; }
    function lx(i) { var L = lay(); return L.x0 + L.lw * (i + 0.5); }
    function mv(d) { if (st !== 'play') return; lane = Math.max(0, Math.min(2, lane + d)); }
    function reset() { lane = 1; items = []; score = 0; err = 0; sp = 0.5; spd = 0; fl = 0; st = 'play'; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lane: lane, score: score, err: err, items: items.map(function (o) { return { lane: o.lane, y: o.y, k: o.k }; }), py: lay().py, lpos: [0, 1, 2].map(lx) }; },
      down: function (x, y) { if (menu()) return; var tl = Math.max(0, Math.min(2, Math.floor((x - lay().x0) / lay().lw))); if (tl < lane) mv(-1); else if (tl > lane) mv(1); },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') { menu(); return; } if (!d) return; if (k === 'ArrowLeft') mv(-1); if (k === 'ArrowRight') mv(1); },
      update: function (dt) {
        if (st !== 'play') return; var L = lay(); spd += dt; sp -= dt; if (fl > 0) fl -= dt;
        if (sp <= 0) { sp = 0.62 + Math.random() * 0.3; items.push({ lane: (Math.random() * 3) | 0, y: L.top - 20, k: Math.random() < 0.6 ? 0 : 1 }); }
        var v = Math.min(330, 230 + spd * 4), i;
        for (i = items.length - 1; i >= 0; i--) {
          var o = items[i]; o.y += v * dt;
          if (o.lane === lane && o.y >= L.py - 24 && o.y <= L.py + 24) {
            if (o.k === 0) { score++; if (api.nota) api.nota(560, 0.08, 'triangle', 0.05); } else { err++; fl = 0.3; if (api.nota) api.nota(120, 0.2, 'sawtooth', 0.06); }
            items.splice(i, 1); continue;
          }
          if (o.y > api.h + 30) items.splice(i, 1);
        }
        if (score >= NEED) st = 'win'; else if (err >= MAXE) st = 'lose';
      },
      draw: function () {
        var L = lay(), i; bg('#1f2c26', '#060d09');
        for (i = 0; i < 3; i++) { g.fillStyle = 'rgba(255,255,255,.05)'; rr(L.x0 + L.lw * i + 3, L.top - 10, L.lw - 6, api.h - L.top, 12); g.fill(); }
        items.forEach(function (o) { var x = lx(o.lane); if (o.k === 0) { g.fillStyle = '#f3ecd2'; rr(x - 13, o.y - 17, 26, 34, 8); g.fill(); g.fillStyle = '#9ab4d8'; g.fillRect(x - 13, o.y - 4, 26, 8); } else { g.fillStyle = '#6a7078'; g.beginPath(); g.arc(x, o.y, 19, 0, 6.2832); g.fill(); g.fillStyle = 'rgba(255,255,255,.15)'; g.beginPath(); g.arc(x - 6, o.y - 6, 6, 0, 6.2832); g.fill(); } });
        g.fillStyle = fl > 0 ? '#ff9a8d' : '#8fb4e0'; g.beginPath(); g.arc(lx(lane), L.py, 24, 0, 6.2832); g.fill(); g.fillStyle = '#1a2230'; g.beginPath(); g.arc(lx(lane) - 8, L.py - 5, 3, 0, 6.2832); g.arc(lx(lane) + 8, L.py - 5, 3, 0, 6.2832); g.fill();
        bar(api.w / 2 - 110, api.h - 12, 220, 5, score / NEED, '#8fe0a0');
        hud(T.h1 + ' ' + score + '/' + NEED, T.h2 + ' ' + err + '/' + MAXE, true);
        fim(st);
      }
    };

  }
});
