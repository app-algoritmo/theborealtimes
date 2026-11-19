/* Os vættir da Islândia — toque no lado de onde vem o guardião (invenção). */
BTJogo.registrar({
  canvas: 'jogo-vaettir',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os guardiões da ilha",
    "sub": "Você é o feiticeiro em forma de baleia, no centro, e a ilha é guardada nos quatro lados. Cada vez que um guardião aparece, toque no lado dele antes que o tempo se esgote: ave ao norte, dragão a leste, gigante ao sul, touro a oeste. (Teclado: setas.) Repele 20 guardiões com no máximo 2 erros; o terceiro erro, por toque errado ou demora, encerra o jogo.",
    "perdeu": "Os guardiões da ilha expulsaram o feiticeiro",
    "v1": "Os 20 guardiões foram vencidos!",
    "v2": "Na Heimskringla, o rei Harald Dente Azul manda um feiticeiro em forma de baleia espiar a Islândia, e ele é repelido de cada lado: um dragão a leste, uma grande ave ao norte, um touro a oeste e um gigante ao sul. O jogo de reflexos é invenção.",
    "h1": "Guardiões",
    "h2": "Erros",
    "g0": "Ave",
    "g1": "Dragão",
    "g2": "Gigante",
    "g3": "Touro"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The guardians of the island",
    "sub": "You are the sorcerer in whale form, at the centre, and the island is guarded on four sides. Each time a guardian appears, tap its side before time runs out: bird to the north, dragon to the east, giant to the south, bull to the west. (Keyboard: arrow keys.) Face 20 guardians with at most 2 mistakes; the third mistake, by a wrong tap or by being slow, ends the game.",
    "perdeu": "The guardians of the island drove the sorcerer away",
    "v1": "All 20 guardians have been faced!",
    "v2": "In the Heimskringla, King Harald Bluetooth sends a sorcerer in whale form to spy on Iceland, and he is driven off from each side: a dragon in the east, a great bird in the north, a bull in the west and a giant in the south. The reflex game is invented.",
    "h1": "Guardians",
    "h2": "Mistakes",
    "g0": "Bird",
    "g1": "Dragon",
    "g2": "Giant",
    "g3": "Bull"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Øyas voktere",
    "sub": "Du er trollmannen i hvalskikkelse, midt på skjermen, og øya er vokta på fire sider. Hver gang en vokter dukker opp, trykker du på siden hans før tiden går ut: fugl i nord, drage i øst, kjempe i sør, okse i vest. (Tastatur: piltaster.) Møt 20 voktere med høyst 2 feil; den tredje feilen, ved feil trykk eller for treg reaksjon, avslutter spillet.",
    "perdeu": "Øyas voktere drev trollmannen bort",
    "v1": "Alle 20 vokterne er møtt!",
    "v2": "I Heimskringla sender kong Harald Blåtann en trollmann i hvalskikkelse for å speide på Island, og han drives bort fra hver side: en drage i øst, en stor fugl i nord, en okse i vest og en kjempe i sør. Refleksspillet er oppfunnet.",
    "h1": "Voktere",
    "h2": "Feil",
    "g0": "Fugl",
    "g1": "Drage",
    "g2": "Kjempe",
    "g3": "Okse"
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
    var COUNT = 20, MAXE = 3;
    var COL = ['#6fd0e0', '#e0644a', '#a58cd0', '#d8b25a'];
    var n = 0, err = 0, side = -1, tl = 0, tmax = 1, gap = 0.8, flash = 0, fcol = '#fff', fside = -1;
    function rt() { return 1.5 - 0.035 * n; }
    function reset() { n = 0; err = 0; side = -1; gap = 0.8; flash = 0; st = 'play'; }
    function miss(s) { err++; flash = 0.35; fcol = '#ff6a5a'; fside = s; side = -1; gap = 0.5; if (api.nota) api.nota(110, 0.2, 'sawtooth', 0.05); if (err >= MAXE) st = 'lose'; }
    function tap(s) {
      if (st !== 'play' || side < 0) return;
      if (s === side) { n++; flash = 0.25; fcol = '#ffd88a'; fside = s; side = -1; gap = 0.5; if (api.nota) api.nota(300 + s * 60, 0.12, 'triangle', 0.07); if (n >= COUNT) st = 'win'; }
      else miss(s);
    }
    function which(x, y) { var dx = x - api.w / 2, dy = y - api.h / 2; if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? 1 : 3; return dy < 0 ? 0 : 2; }
    function gpos(s) { var W = api.w, H = api.h, ax = W * 0.34, ay = H * 0.30; return [{ x: W / 2, y: H / 2 - ay }, { x: W / 2 + ax, y: H / 2 }, { x: W / 2, y: H / 2 + ay }, { x: W / 2 - ax, y: H / 2 }][s]; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, n: n, err: err, side: side, tl: tl, count: COUNT, pos: [0, 1, 2, 3].map(gpos) }; },
      down: function (x, y) { if (menu()) return; tap(which(x, y)); },
      move: function () {}, up: function () {},
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } var m = { ArrowUp: 0, ArrowRight: 1, ArrowDown: 2, ArrowLeft: 3 }[k]; if (m !== undefined) tap(m); },
      update: function (dt) {
        if (flash > 0) flash -= dt; if (st !== 'play') return;
        if (side < 0) { gap -= dt; if (gap <= 0) { side = Math.floor(Math.random() * 4); tmax = rt(); tl = tmax; } }
        else { tl -= dt; if (tl <= 0) miss(side); }
      },
      draw: function () {
        var W = api.w, H = api.h, s; bg('#0f1a24', '#04080c');
        g.strokeStyle = 'rgba(255,255,255,.08)'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 0); g.lineTo(W, H); g.moveTo(W, 0); g.lineTo(0, H); g.stroke();
        g.fillStyle = '#7fa0b8'; g.beginPath(); g.ellipse(W / 2, H / 2, 36, 18, 0, 0, 6.2832); g.fill(); g.beginPath(); g.moveTo(W / 2 + 32, H / 2); g.lineTo(W / 2 + 54, H / 2 - 14); g.lineTo(W / 2 + 54, H / 2 + 14); g.closePath(); g.fill();
        for (s = 0; s < 4; s++) {
          var p = gpos(s), on = side === s, r = Math.min(48, W * 0.11);
          if (flash > 0 && fside === s) { g.fillStyle = fcol; g.globalAlpha = flash * 1.6; g.beginPath(); g.arc(p.x, p.y, r + 14, 0, 6.2832); g.fill(); g.globalAlpha = 1; }
          g.globalAlpha = on ? 1 : 0.18; g.fillStyle = COL[s]; g.beginPath(); g.arc(p.x, p.y, r, 0, 6.2832); g.fill(); g.globalAlpha = 1;
          if (on) { g.strokeStyle = '#fff'; g.lineWidth = 4; g.beginPath(); g.arc(p.x, p.y, r + 8, -1.5708, -1.5708 + 6.2832 * Math.max(0, tl / tmax)); g.stroke(); txt(T['g' + s], p.x, p.y + 6, Math.min(16, r * 0.4), 'rgba(0,0,0,.75)'); }
        }
        hud(T.h1 + ' ' + n + '/' + COUNT, T.h2 + ' ' + err + '/' + MAXE, true);
        fim(st);
      }
    };

  }
});
