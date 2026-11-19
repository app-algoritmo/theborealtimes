/* A montanha de vidro — suba a encosta e colha as três maçãs de ouro (invenção). */
BTJogo.registrar({
  canvas: 'jogo-glassberget',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A subida da montanha de vidro",
    "sub": "O cavaleiro sobe a montanha de vidro por três pistas. Toque na pista, ou use as setas do teclado, para mudar de lugar e desviar das pedras que descem. Colha as três maçãs de ouro, que aparecem uma de cada vez. Bater numa pedra é um erro, e três erros encerram a subida.",
    "perdeu": "Três pedras acertaram o cavaleiro, ou o tempo acabou",
    "v1": "As três maçãs estão com você!",
    "v2": "Em «A princesa na montanha de vidro», recolhida por Asbjørnsen e Moe, o filho mais novo vigia o prado na noite de São João e ganha um cavalo; depois de três tentativas, com armadura de latão, de prata e de ouro, sobe a montanha e pega as três maçãs de ouro da princesa. A subida em pistas é invenção.",
    "h1": "Maçãs",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The climb of the glass mountain",
    "sub": "The rider climbs the glass mountain along three lanes. Tap a lane, or use the keyboard arrows, to change place and dodge the stones coming down. Collect the three golden apples, which appear one at a time. Hitting a stone is a mistake, and three mistakes end the climb.",
    "perdeu": "Three stones hit the rider, or the time ran out",
    "v1": "The three apples are yours!",
    "v2": "In “The Princess on the Glass Hill”, collected by Asbjørnsen and Moe, the youngest son keeps watch over the meadow on Midsummer Eve and wins a horse; after three attempts, in brass, silver and gold armour, he climbs the hill and takes the princess’s three golden apples. The climb in lanes is invented.",
    "h1": "Apples",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Oppstigningen på glassberget",
    "sub": "Rytteren rir opp glassberget i tre felt. Trykk på et felt, eller bruk piltastene, for å bytte plass og unngå steinene som kommer ned. Plukk de tre gulleplene, som dukker opp ett om gangen. Å treffe en stein er en feil, og tre feil avslutter oppstigningen.",
    "perdeu": "Tre steiner traff rytteren, eller tiden tok slutt",
    "v1": "De tre eplene er dine!",
    "v2": "I «Jomfruen på glassberget», samlet av Asbjørnsen og Moe, vokter den yngste sønnen enga på St. Hans-natten og får en hest; etter tre forsøk, i messing-, sølv- og gullrustning, rir han opp berget og tar prinsessens tre gulleple. Oppstigningen i felt er oppfunnet.",
    "h1": "Epler",
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
    var MAXE = 3, NAP = 3, LIM = 140;
    var lane = 1, objs = [], apples = 0, err = 0, t = 0, spT = 0, apT = 0, fl = 0, apOn = false;
    function vy() { return api.h * 0.42; }
    function hy() { return api.h * 0.8; }
    function reset() { lane = 1; objs = []; apples = 0; err = 0; t = 0; spT = 0.6; apT = 3; fl = 0; apOn = false; st = 'play'; }
    function spawn() {
      var a = Math.floor(Math.random() * 3); objs.push({ lane: a, y: 70, k: 'o' });
      if (Math.random() < 0.3) { var b = (a + 1 + Math.floor(Math.random() * 2)) % 3; objs.push({ lane: b, y: 70, k: 'o' }); }
    }
    function lay() { var W = api.w, lw = Math.min(110, (W - 30) / 3); return { lw: lw, x0: W / 2 - lw * 1.5 }; }
    function lx(i) { var L = lay(); return L.x0 + i * L.lw + L.lw / 2; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lane: lane, objs: objs.map(function (o) { return { lane: o.lane, y: o.y, k: o.k }; }), hy: hy(), H: api.h, apples: apples, err: err, lx: [0, 1, 2].map(lx), t: t }; },
      down: function (x, y) { if (menu()) return; var L = lay(); var i = Math.floor((x - L.x0) / L.lw); if (i >= 0 && i < 3) lane = i; else lane = x < api.w / 2 ? Math.max(0, lane - 1) : Math.min(2, lane + 1); },
      move: function () {}, up: function () {},
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'ArrowLeft' || k === 'KeyA') lane = Math.max(0, lane - 1); else if (k === 'ArrowRight' || k === 'KeyD') lane = Math.min(2, lane + 1); },
      update: function (dt) {
        if (st !== 'play') return; t += dt; if (fl > 0) fl -= dt;
        var v = vy() * (1 + t / 120), i;
        spT -= dt; if (spT <= 0) { spawn(); spT = 0.95; }
        apT -= dt; if (apT <= 0 && !apOn && apples < NAP) { objs.push({ lane: Math.floor(Math.random() * 3), y: 70, k: 'a' }); apOn = true; apT = 4; }
        for (i = objs.length - 1; i >= 0; i--) {
          var o = objs[i]; o.y += v * dt;
          if (o.lane === lane && Math.abs(o.y - hy()) < api.h * 0.06) {
            if (o.k === 'a') { apples++; apOn = false; objs.splice(i, 1); if (api.nota) api.nota(520 + apples * 90, 0.18, 'triangle', 0.07); if (apples >= NAP) st = 'win'; }
            else { err++; fl = 0.5; objs.splice(i, 1); if (api.nota) api.nota(120, 0.2, 'sawtooth', 0.05); if (err >= MAXE) st = 'lose'; }
            continue;
          }
          if (o.y > api.h + 30) { if (o.k === 'a') apOn = false; objs.splice(i, 1); }
        }
        if (st === 'play' && t >= LIM) st = 'lose';
      },
      draw: function () {
        var L = lay(), i, H = api.h; bg('#18243a', '#070b14');
        var gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, 'rgba(180,220,255,.05)'); gr.addColorStop(1, 'rgba(180,220,255,.2)'); g.fillStyle = gr; g.fillRect(L.x0, 0, L.lw * 3, H);
        g.strokeStyle = 'rgba(200,230,255,.3)'; g.lineWidth = 2; for (i = 0; i <= 3; i++) { g.beginPath(); g.moveTo(L.x0 + i * L.lw, 0); g.lineTo(L.x0 + i * L.lw, H); g.stroke(); }
        for (i = 0; i < objs.length; i++) {
          var o = objs[i], x = lx(o.lane);
          if (o.k === 'a') { g.beginPath(); g.arc(x, o.y, 16, 0, 6.2832); g.fillStyle = '#ffd88a'; g.fill(); g.strokeStyle = '#fff3c4'; g.lineWidth = 2; g.stroke(); }
          else { g.beginPath(); g.moveTo(x - 26, o.y + 16); g.lineTo(x - 14, o.y - 18); g.lineTo(x + 12, o.y - 20); g.lineTo(x + 26, o.y + 14); g.closePath(); g.fillStyle = '#6b7388'; g.fill(); g.strokeStyle = '#aab3c8'; g.lineWidth = 2; g.stroke(); }
        }
        var hx = lx(lane), hyy = hy(); g.fillStyle = fl > 0 ? '#e5736a' : '#c8a46a'; g.beginPath(); g.ellipse ? g.ellipse(hx, hyy, 22, 30, 0, 0, 6.2832) : g.arc(hx, hyy, 26, 0, 6.2832); g.fill(); g.strokeStyle = '#f3ecd2'; g.lineWidth = 3; g.stroke();
        g.beginPath(); g.arc(hx, hyy - 34, 11, 0, 6.2832); g.fillStyle = '#e8e2cf'; g.fill();
        bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 30 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + apples + '/' + NAP, T.h2 + ' ' + err + '/' + MAXE, true);
        fim(st);
      }
    };

  }
});
