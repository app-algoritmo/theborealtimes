/* Garmr uiva diante de Gnipahellir — repita a sequência de uivos (invenção). */
BTJogo.registrar({
  canvas: 'jogo-garmr',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os uivos de Garmr",
    "sub": "Quatro pedras ecoam na boca da caverna, cada uma com um som e uma cor. Observe a sequência e repita-a tocando nas pedras na mesma ordem. A cada rodada a sequência cresce um uivo. Chegue a 8 uivos com no máximo 2 erros; o terceiro erro encerra o jogo. (Teclado: teclas 1 a 4.)",
    "perdeu": "A sequência se perdeu na caverna",
    "v1": "Garmr se calou: a sequência inteira foi repetida!",
    "v2": "Na Völuspá, o uivo de Garmr diante de Gnipahellir se repete como um refrão e anuncia o Ragnarök. O jogo de eco é invenção.",
    "h1": "Uivos",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Garmr's howls",
    "sub": "Four stones echo at the cave mouth, each with a sound and a colour. Watch the sequence and repeat it by tapping the stones in the same order. Each round the sequence grows by one howl. Reach 8 howls with at most 2 mistakes; the third mistake ends the game. (Keyboard: keys 1 to 4.)",
    "perdeu": "The sequence was lost in the cave",
    "v1": "Garmr has fallen silent: the whole sequence was repeated!",
    "v2": "In the Völuspá, Garmr's howl before Gnipahellir returns like a refrain and announces Ragnarök. The echo game is invented.",
    "h1": "Howls",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Garms hyl",
    "sub": "Fire steiner gir gjenlyd ved hulemunnen, hver med en lyd og en farge. Se på rekkefølgen og gjenta den ved å trykke på steinene i samme rekkefølge. For hver runde vokser rekken med ett hyl. Nå 8 hyl med høyst 2 feil; den tredje feilen avslutter spillet. (Tastatur: tast 1 til 4.)",
    "perdeu": "Rekkefølgen gikk tapt i hulen",
    "v1": "Garm har tiet: hele rekkefølgen ble gjentatt!",
    "v2": "I Völuspá vender Garms hyl foran Gnipahelleren tilbake som et refreng og varsler ragnarok. Ekkospillet er oppfunnet.",
    "h1": "Hyl",
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
    var FINAL = 8, START = 3, MAXE = 3;
    var COL = ['#d64545', '#e8a33d', '#4fa86b', '#4c8fd6'], FR = [196, 247, 311, 392];
    var seq = [], pos = 0, err = 0, ph = 'show', si = 0, sT = 0, lit = -1, litT = 0;
    function extend() { seq.push(Math.floor(Math.random() * 4)); }
    function startShow() { ph = 'show'; si = 0; sT = -0.8; pos = 0; lit = -1; }
    function reset() { seq = []; for (var i = 0; i < START; i++) extend(); err = 0; st = 'play'; startShow(); }
    function flashPad(k) { lit = k; litT = 0.3; if (api.nota) api.nota(FR[k], 0.28, 'triangle', 0.08); }
    function tap(k) {
      if (st !== 'play' || ph !== 'input') return; flashPad(k);
      if (seq[pos] === k) { pos++; if (pos >= seq.length) { if (seq.length >= FINAL) st = 'win'; else { extend(); startShow(); } } }
      else { err++; if (api.nota) api.nota(100, 0.3, 'sawtooth', 0.06); if (err >= MAXE) st = 'lose'; else startShow(); }
    }
    function lay() { var W = api.w, H = api.h, s = Math.max(70, Math.min((W - 50) / 2, (H - 140) / 2, 150)); return { s: s, x0: W / 2 - s - 6, y0: 76 }; }
    function ppos(k) { var L = lay(); return { x: L.x0 + (k % 2) * (L.s + 12) + L.s / 2, y: L.y0 + Math.floor(k / 2) * (L.s + 12) + L.s / 2 }; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, ph: ph, seq: seq.slice(), pos: pos, err: err, final: FINAL, pads: [0, 1, 2, 3].map(ppos) }; },
      down: function (x, y) { if (menu()) return; var L = lay(); for (var k = 0; k < 4; k++) { var p = ppos(k); if (Math.abs(x - p.x) < L.s / 2 && Math.abs(y - p.y) < L.s / 2) { tap(k); return; } } },
      move: function () {}, up: function () {},
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } var m = { Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3, Numpad1: 0, Numpad2: 1, Numpad3: 2, Numpad4: 3 }[k]; if (m !== undefined) tap(m); },
      update: function (dt) {
        if (litT > 0) { litT -= dt; if (litT <= 0) lit = -1; }
        if (st !== 'play' || ph !== 'show') return;
        sT += dt;
        if (sT >= 0.7) { sT = 0; if (si < seq.length) { flashPad(seq[si]); si++; } else { ph = 'input'; pos = 0; } }
      },
      draw: function () {
        var L = lay(), k; bg('#12161f', '#06080c');
        for (k = 0; k < 4; k++) { var p = ppos(k); g.globalAlpha = lit === k ? 1 : 0.38; g.fillStyle = COL[k]; rr(p.x - L.s / 2, p.y - L.s / 2, L.s, L.s, 18); g.fill(); g.globalAlpha = 1; txt(String(k + 1), p.x, p.y + 8, 24, 'rgba(255,255,255,.6)'); }
        txt(ph === 'show' ? '· · ·' : '▸', api.w / 2, api.h - 16, 16, 'rgba(255,255,255,.5)');
        hud(T.h1 + ' ' + seq.length + '/' + FINAL, T.h2 + ' ' + err + '/' + MAXE, true);
        fim(st);
      }
    };

  }
});
