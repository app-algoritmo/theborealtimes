/* As chamas de Hervör — repita a ordem exata das chamas e das runas. */
BTJogo.registrar({
  canvas: 'jogo-hervor',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As chamas de Hervör",
    "sub": "Quatro chamas com runas acendem numa ordem. Memorize e repita a ordem tocando nas chamas (ou use as setas, ou as teclas 1 a 4). A cada rodada a sequência cresce. Complete 8 rodadas. No terceiro erro, o jogo acaba.",
    "perdeu": "As chamas se apagaram",
    "v1": "Você chegou ao túmulo!",
    "v2": "Na Saga de Hervör, as chamas e os fantasmas rondam o túmulo de Angantýr. A ordem das chamas é invenção do jogo.",
    "h1": "Rodadas",
    "h2": "Erros",
    "olhe": "Olhe",
    "agora": "Sua vez"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Hervör's flames",
    "sub": "Four flames with runes light up in an order. Memorise it and repeat the order by tapping the flames (or use the arrows, or keys 1 to 4). Each round the sequence grows. Complete 8 rounds. The third mistake ends the game.",
    "perdeu": "The flames went out",
    "v1": "You reached the mound!",
    "v2": "In Hervör's saga, flames and ghosts haunt Angantýr's mound. The order of the flames is made up for the game.",
    "h1": "Rounds",
    "h2": "Mistakes",
    "olhe": "Watch",
    "agora": "Your turn"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Hervors flammer",
    "sub": "Fire flammer med runer lyser opp i en rekkefølge. Husk den og gjenta rekkefølgen ved å trykke på flammene (eller bruk piltastene, eller tastene 1 til 4). For hver runde vokser rekken. Fullfør 8 runder. Den tredje feilen avslutter spillet.",
    "perdeu": "Flammene sluknet",
    "v1": "Du nådde haugen!",
    "v2": "I Hervors saga farer flammer og spøkelser rundt Angantyrs haug. Rekkefølgen på flammene er diktet opp for spillet.",
    "h1": "Runder",
    "h2": "Feil",
    "olhe": "Se",
    "agora": "Din tur"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "Las llamas de Hervör",
    "sub": "Cuatro llamas con runas se encienden en un orden. Memorízalo y repítelo tocando las llamas (o usa las flechas, o las teclas del 1 al 4). En cada ronda la secuencia crece. Completa 8 rondas. Al tercer error, el juego termina.",
    "perdeu": "Las llamas se apagaron",
    "v1": "¡Llegaste al túmulo!",
    "v2": "En la Saga de Hervör, las llamas y los fantasmas rondan el túmulo de Angantýr. El orden de las llamas es invención del juego.",
    "h1": "Rondas",
    "h2": "Errores",
    "olhe": "Mira",
    "agora": "Tu turno"
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
    var NEED = 8, MAXE = 3, COL = ['#e0503a', '#f0a030', '#4aa0e0', '#5ac07a'], RUN = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ'], FQ = [262, 330, 392, 523];
    var seq = [], len = 1, ph = 'show', si = 0, st0 = 0, idx = 0, errs = 0, lit = -1, litT = 0, tmr = 8, wait = 0, flashBad = 0, pop = 0;
    function lay() { var W = api.w, H = api.h, S = Math.min(W - 40, H - 150, 380), c = S / 2, x = (W - S) / 2, y = Math.max(76, (H - S) / 2 + 20); return { S: S, c: c, x: x, y: y }; }
    function padRect(i) { var L = lay(); return { x: L.x + (i % 2) * L.c, y: L.y + Math.floor(i / 2) * L.c, w: L.c, h: L.c }; }
    function setup() { seq = []; for (var i = 0; i < NEED; i++) seq.push(Math.floor(Math.random() * 4)); len = 1; errs = 0; startShow(); }
    function startShow() { ph = 'show'; si = 0; st0 = 0.8; idx = 0; lit = -1; wait = 0; }
    function reset() { setup(); st = 'play'; }
    function light(i, d) { lit = i; litT = d; if (api.nota) api.nota(FQ[i], d, 'sine', 0.08); }
    function press(i) {
      if (st !== 'play' || ph !== 'input') return;
      light(i, 0.25);
      if (i === seq[idx]) { idx++; tmr = 8; if (idx >= len) { if (len >= NEED) { len++; st = 'win'; return; } len++; ph = 'wait'; wait = 0.9; } }
      else { errs++; flashBad = 0.5; if (errs >= MAXE) { st = 'lose'; return; } ph = 'wait'; wait = 1.0; idx = 0; }
    }
    function padAt(x, y) { for (var i = 0; i < 4; i++) { var r = padRect(i); if (x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h) return i; } return -1; }
    setup();
    return {
      pausar: function () {},
      dbg: function () { return { st: st, seq: seq.slice(0, len), ph: ph, idx: idx, len: len, errs: errs }; },
      down: function (x, y) { if (menu()) return; var i = padAt(x, y); if (i >= 0) press(i); },
      key: function (c, d) {
        if (!d) return; if (st !== 'play') { menu(); return; }
        var m = { Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3, ArrowUp: 0, ArrowRight: 1, ArrowDown: 2, ArrowLeft: 3, KeyW: 0, KeyD: 1, KeyS: 2, KeyA: 3 };
        if (c in m) press(m[c]);
      },
      update: function (dt) {
        pop += dt; if (flashBad > 0) flashBad -= dt; if (litT > 0) { litT -= dt; if (litT <= 0) lit = -1; }
        if (st !== 'play') return;
        if (ph === 'show') { st0 -= dt; if (st0 <= 0) { if (si < len) { light(seq[si], 0.45); si++; st0 = 0.75; } else { ph = 'input'; idx = 0; tmr = 8; } } }
        else if (ph === 'wait') { wait -= dt; if (wait <= 0) startShow(); }
        else if (ph === 'input') { tmr -= dt; if (tmr <= 0) { errs++; flashBad = 0.5; if (errs >= MAXE) st = 'lose'; else { ph = 'wait'; wait = 1.0; idx = 0; } } }
      },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), i;
        bg('#1a1020', '#0a060d');
        for (i = 0; i < 4; i++) {
          var r = padRect(i), on = lit === i;
          g.fillStyle = on ? COL[i] : 'rgba(255,255,255,.07)'; rr(r.x + 5, r.y + 5, r.w - 10, r.h - 10, 18); g.fill();
          g.strokeStyle = COL[i]; g.lineWidth = on ? 4 : 2; rr(r.x + 5, r.y + 5, r.w - 10, r.h - 10, 18); g.stroke();
          txt(RUN[i], r.x + r.w / 2, r.y + r.h / 2 + 18, 54, on ? '#1a1020' : COL[i]);
        }
        txt(ph === 'input' ? T.agora : (ph === 'show' ? T.olhe : ''), W / 2, L.y + L.S + 34, 18, '#c9b3f2');
        if (ph === 'input') bar(W / 2 - 80, L.y + L.S + 48, 160, 5, tmr / 8, '#f0a030');
        if (flashBad > 0) { g.fillStyle = 'rgba(200,40,40,' + flashBad * 0.3 + ')'; g.fillRect(0, 0, W, H); }
        hud(T.h1 + ' ' + (len - 1) + '/' + NEED, T.h2 + ' ' + errs + '/' + MAXE, errs > 0);
        fim(st);
      }
    };
  }
});
