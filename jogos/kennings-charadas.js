/* Charadas de kennings — descubra o que o escaldo quer dizer. */
BTJogo.registrar({
  canvas: 'jogo-kennings',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Charadas de kennings",
    "sub": "Os escaldos diziam as coisas por rodeios. Leia cada expressão e toque na resposta certa (ou use as teclas 1, 2 e 3). Cada charada tem dez segundos. São sete; três erros e o jogo termina.",
    "perdeu": "O rei não gostou dos versos",
    "v1": "O rei aplaude!",
    "v2": "Snorri Sturluson explicou os kennings na Edda em Prosa, por volta de 1220. As charadas do jogo usam expressões desse tipo, escritas para ele.",
    "h1": "Charadas",
    "h2": "Erros",
    "q": [
      [
        "cabelo de Sif",
        "ouro",
        "trigo",
        "fogo"
      ],
      [
        "hidromel de Odin",
        "poesia",
        "guerra",
        "mar"
      ],
      [
        "tempestade de Odin",
        "batalha",
        "inverno",
        "navio"
      ],
      [
        "cavalo do mar",
        "navio",
        "baleia",
        "onda"
      ],
      [
        "estrada da baleia",
        "mar",
        "ponte",
        "trilha na montanha"
      ],
      [
        "fogo de Ægir",
        "ouro",
        "sol",
        "cerveja"
      ],
      [
        "árvore da batalha",
        "guerreiro",
        "lança",
        "floresta"
      ]
    ]
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Kenning riddles",
    "sub": "The skalds said things in roundabout ways. Read each expression and tap the right answer (or use keys 1, 2 and 3). Each riddle has ten seconds. There are seven; three mistakes end the game.",
    "perdeu": "The king disliked the verses",
    "v1": "The king applauds!",
    "v2": "Snorri Sturluson explained kennings in the Prose Edda, around 1220. The riddles in the game use expressions of that kind, written for it.",
    "h1": "Riddles",
    "h2": "Mistakes",
    "q": [
      [
        "Sif's hair",
        "gold",
        "wheat",
        "fire"
      ],
      [
        "Odin's mead",
        "poetry",
        "war",
        "sea"
      ],
      [
        "Odin's storm",
        "battle",
        "winter",
        "ship"
      ],
      [
        "sea-horse",
        "ship",
        "whale",
        "wave"
      ],
      [
        "whale-road",
        "sea",
        "bridge",
        "mountain path"
      ],
      [
        "Ægir's fire",
        "gold",
        "sun",
        "beer"
      ],
      [
        "tree of battle",
        "warrior",
        "spear",
        "forest"
      ]
    ]
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Kenning-gåter",
    "sub": "Skaldene sa ting på omvei. Les hvert uttrykk og trykk på riktig svar (eller bruk tastene 1, 2 og 3). Hver gåte har ti sekunder. Det er sju; tre feil avslutter spillet.",
    "perdeu": "Kongen likte ikke versene",
    "v1": "Kongen applauderer!",
    "v2": "Snorre Sturlason forklarte kenninger i Snorres Edda, rundt 1220. Gåtene i spillet bruker uttrykk av den typen, skrevet til det.",
    "h1": "Gåter",
    "h2": "Feil",
    "q": [
      [
        "Sifs hår",
        "gull",
        "hvete",
        "ild"
      ],
      [
        "Odins mjød",
        "poesi",
        "krig",
        "hav"
      ],
      [
        "Odins storm",
        "slag",
        "vinter",
        "skip"
      ],
      [
        "havets hest",
        "skip",
        "hval",
        "bølge"
      ],
      [
        "hvalveien",
        "hav",
        "bro",
        "fjellsti"
      ],
      [
        "Ægirs ild",
        "gull",
        "sol",
        "øl"
      ],
      [
        "slagets tre",
        "kriger",
        "spyd",
        "skog"
      ]
    ]
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
    var QS = T.q, N = QS.length, MAXE = 3, LIM = 10;
    var qi = 0, errs = 0, opts = [], tl = 0, fl = 0, fres = 0, pick = -1, ok = 0;
    function novo() { var q = QS[qi], o = [q[1], q[2], q[3]]; for (var i = 2; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = o[i]; o[i] = o[j]; o[j] = t; } opts = o; tl = LIM; }
    function reset() { st = 'play'; qi = 0; errs = 0; ok = 0; fl = 0; novo(); }
    function resp(i) {
      if (st !== 'play' || fl > 0) return; pick = i; var c = opts[i] === QS[qi][1];
      if (c) { ok++; fres = 1; } else { errs++; fres = -1; }
      fl = 0.9; if (errs >= MAXE) { st = 'lose'; }
    }
    return {
      pausar: function () {},
      dbg: function () { var c = opts.indexOf(QS[Math.min(qi, N - 1)][1]); return { st: st, qi: qi, errs: errs, ok: ok, c: c, tl: tl, fl: fl }; },
      down: function (x, y) { if (menu()) return; var H = api.h, W = api.w; var top = H * 0.4, bh = H * 0.15, gp = H * 0.03; for (var i = 0; i < 3; i++) { var yy = top + i * (bh + gp); if (y >= yy && y <= yy + bh) { resp(i); return; } } },
      key: function (c, d) { if (!d) return; if (st !== 'play') { if (c === 'Space' || c === 'Enter') menu(); return; } var k = { Digit1: 0, Digit2: 1, Digit3: 2 }[c]; if (k !== undefined) resp(k); },
      update: function (dt) {
        if (st !== 'play') return;
        if (fl > 0) { fl -= dt; if (fl <= 0 && st === 'play') { if (fres > 0 || true) { qi++; if (qi >= N) { st = 'win'; } else novo(); } } return; }
        tl -= dt; if (tl <= 0) { errs++; fres = -1; pick = -1; fl = 0.9; if (errs >= MAXE) st = 'lose'; }
      },
      draw: function () {
        var W = api.w, H = api.h, q = QS[Math.min(qi, N - 1)];
        bg('#2a1a44', '#120b22'); g.fillStyle = 'rgba(255,216,138,.12)'; g.fillRect(0, H * 0.14, W, H * 0.2);
        txt(q[0], W / 2, H * 0.27, Math.min(36, W / (q[0].length * 0.5 + 2)), '#ffd88a');
        var top = H * 0.4, bh = H * 0.15, gp = H * 0.03, bw = Math.min(W * 0.8, 520), bx = (W - bw) / 2;
        for (var i = 0; i < 3; i++) {
          var yy = top + i * (bh + gp), c = opts[i] === q[1], col = 'rgba(255,255,255,.12)';
          if (fl > 0 && (c || i === pick)) col = c ? 'rgba(110,255,160,.4)' : 'rgba(255,100,80,.45)';
          g.fillStyle = col; g.fillRect(bx, yy, bw, bh); g.strokeStyle = 'rgba(255,255,255,.3)'; g.lineWidth = 2; g.strokeRect(bx, yy, bw, bh);
          txt((i + 1) + '  ' + opts[i], W / 2, yy + bh * 0.62, 20, '#f3ecd2');
        }
        g.fillStyle = 'rgba(255,255,255,.2)'; g.fillRect(bx, H * 0.92, bw, 6); g.fillStyle = tl < 3 ? '#ff8a7a' : '#c9b3f2'; g.fillRect(bx, H * 0.92, bw * Math.max(0, tl) / LIM, 6);
        hud(T.h1 + ' ' + ok + '/' + N, T.h2 + ' ' + errs + '/' + MAXE, errs > 0);
        fim(st);
      }
    };
  }
});
