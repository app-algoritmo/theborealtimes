/* O relato de Ibn Fadlan — o que o cronista escreveu e o que foi inventado depois. */
BTJogo.registrar({
  canvas: 'jogo-fadlan',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O relato de Ibn Fadlan",
    "sub": "Leia cada frase e decida: está no relato do viajante de Bagdá ou foi inventada depois, em filmes e lendas? Oito frases; três erros e o califa perde a paciência.",
    "perdeu": "O califa perdeu a paciência",
    "v1": "Cronista aprovado!",
    "v2": "O relato de Ibn Fadlan, de 921–922, descreve os Rus' do Volga. As frases do jogo foram escritas para ele.",
    "h1": "Frase",
    "h2": "Erros",
    "sim": "Está no relato",
    "nao": "Foi inventado",
    "q": [
      "Os Rus' lavavam o rosto de manhã numa mesma bacia.",
      "Ibn Fadlan viajou a mando do califa de Bagdá.",
      "Os homens do Norte usavam elmos com chifres.",
      "O relato descreve tatuagens verdes dos dedos ao pescoço.",
      "Monstros atacavam o acampamento à noite.",
      "O relato descreve o funeral de um chefe num navio.",
      "Ibn Fadlan era o rei dos búlgaros.",
      "Ibn Fadlan chama os mercadores de \"vikings\"."
    ]
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Ibn Fadlan's account",
    "sub": "Read each sentence and decide: is it in the Baghdad traveller's account, or was it invented later in films and legends? Eight sentences; three mistakes and the caliph loses patience.",
    "perdeu": "The caliph lost patience",
    "v1": "Chronicler approved!",
    "v2": "Ibn Fadlan's account, from 921–922, describes the Rus' of the Volga. The sentences in the game were written for it.",
    "h1": "Sentence",
    "h2": "Mistakes",
    "sim": "In the account",
    "nao": "Invented",
    "q": [
      "The Rus' washed their faces in the morning in the same basin.",
      "Ibn Fadlan travelled on the orders of the caliph of Baghdad.",
      "The Northern men wore horned helmets.",
      "The account describes green tattoos from fingers to neck.",
      "Monsters attacked the camp at night.",
      "The account describes a chief's funeral in a ship.",
      "Ibn Fadlan was the king of the Bulgars.",
      "Ibn Fadlan calls the merchants \"Vikings\"."
    ]
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Ibn Fadlans beretning",
    "sub": "Les hver setning og avgjør: står den i beretningen til den reisende fra Bagdad, eller ble den funnet på senere i filmer og sagn? Åtte setninger; tre feil og kalifen mister tålmodigheten.",
    "perdeu": "Kalifen mistet tålmodigheten",
    "v1": "Kronikør godkjent!",
    "v2": "Ibn Fadlans beretning fra 921–922 beskriver Rus' ved Volga. Setningene i spillet er skrevet til det.",
    "h1": "Setning",
    "h2": "Feil",
    "sim": "Står i beretningen",
    "nao": "Funnet på",
    "q": [
      "Rus' vasket ansiktet om morgenen i samme fat.",
      "Ibn Fadlan reiste på ordre fra kalifen i Bagdad.",
      "Mennene fra Norden brukte hjelmer med horn.",
      "Beretningen beskriver grønne tatoveringer fra fingrene til halsen.",
      "Monstre angrep leiren om natten.",
      "Beretningen beskriver en høvdings begravelse i et skip.",
      "Ibn Fadlan var bulgarenes konge.",
      "Ibn Fadlan kaller kjøpmennene «vikinger»."
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
    var A = [1, 1, 0, 1, 0, 1, 0, 0], MAXE = 3;
    var i = 0, errs = 0, wait = 0, last = -1;
    function reset() { st = 'play'; i = 0; errs = 0; wait = 0; last = -1; }
    function bt(k) { var w = api.w, h = api.h, bw = Math.min(w / 2 - 24, 190); return { x: w / 2 + (k ? 1 : -1) * (bw / 2 + 8), y: h - 62, w: bw, h: 56 }; }
    function ans(v) {
      if (wait > 0) return; last = v === A[i] ? 1 : 0; if (!last) errs++; wait = 0.8;
    }
    return {
      pausar: function () {},
      dbg: function () { return { st: st, i: i, ok: A[i], errs: errs, wait: wait, yes: bt(0), no: bt(1) }; },
      down: function (x, y) {
        if (menu()) return; if (wait > 0) return;
        for (var k = 0; k < 2; k++) { var b = bt(k); if (Math.abs(x - b.x) < b.w / 2 && Math.abs(y - b.y) < b.h / 2) { ans(k === 0 ? 1 : 0); return; } }
      },
      key: function (c, d) { if (!d) return; if (st !== 'play') { if (c === 'Space' || c === 'Enter') menu(); return; } if (c === 'ArrowLeft' || c === 'KeyA' || c === 'Digit1') ans(1); if (c === 'ArrowRight' || c === 'KeyD' || c === 'Digit2') ans(0); },
      update: function (dt) {
        if (st !== 'play' || wait <= 0) return; wait -= dt;
        if (wait <= 0) { if (errs >= MAXE) st = 'lose'; else if (i >= A.length - 1) st = 'win'; else { i++; last = -1; } }
      },
      draw: function () {
        var W = api.w, H = api.h;
        bg('#3a2f1e', '#1b1610');
        if (st === 'play') {
          var cw = Math.min(W - 40, 560), ch = Math.min(H * 0.4, 200), y0 = H * 0.2;
          g.fillStyle = last === 1 ? '#cfe6c9' : last === 0 ? '#f0c9c0' : '#f1e4c4'; g.fillRect(W / 2 - cw / 2, y0, cw, ch);
          g.strokeStyle = '#8a6a3a'; g.lineWidth = 3; g.strokeRect(W / 2 - cw / 2, y0, cw, ch);
          var ls = api.quebra(T.q[i], cw - 40, 20, false), yy = y0 + ch / 2 - (ls.length - 1) * 14 + 6;
          ls.forEach(function (l, k) { txt(l, W / 2, yy + k * 28, 20, '#2a1c0a'); });
          if (last >= 0) txt(last ? '✓' : '✗', W / 2, y0 + ch + 38, 34, last ? '#6fd08c' : '#ff8a7a');
          [0, 1].forEach(function (k) { var b = bt(k); g.fillStyle = k ? '#7a3a3a' : '#3a6a4a'; g.fillRect(b.x - b.w / 2, b.y - b.h / 2, b.w, b.h); txt(k ? T.nao : T.sim, b.x, b.y + 6, 16, '#fff'); });
        }
        hud(T.h1 + ' ' + (i + 1) + '/' + A.length, T.h2 + ' ' + errs + '/' + MAXE, errs > 0);
        fim(st);
      }
    };
  }
});
