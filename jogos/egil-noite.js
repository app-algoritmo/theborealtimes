/* A noite de Egil — toque nas palavras que rimam em aliteração antes do amanhecer. */
BTJogo.registrar({
  canvas: 'jogo-egil',
  t: {
    pt: {
      titulo: 'A noite de Egil',
      sub: 'Egil precisa compor um poema antes do amanhecer. Toque só nas palavras que começam com a letra do verso. Cada erro apaga a vela.',
      toque: 'Toque para começar', verso: 'Verso', letra: 'Letra',
      conj: [
        { l: 'M', c: ['mar', 'mão', 'manhã', 'metal'], o: ['lobo', 'fogo', 'noite', 'rei', 'ferro', 'neve', 'vento', 'pedra'] },
        { l: 'N', c: ['noite', 'névoa', 'navio', 'nome'], o: ['mar', 'lua', 'fogo', 'rei', 'ferro', 'sol', 'vento', 'terra'] },
        { l: 'F', c: ['fogo', 'ferro', 'fama', 'força'], o: ['mar', 'lua', 'lobo', 'rei', 'neve', 'sol', 'vento', 'pedra'] },
        { l: 'L', c: ['lobo', 'lança', 'luz', 'lume'], o: ['mar', 'fogo', 'noite', 'rei', 'ferro', 'neve', 'vento', 'pedra'] }
      ],
      perdeu: 'A vela se apagou', de_novo: 'Toque para tentar de novo',
      v1: 'Cabeça salva!',
      v2: 'Segundo a Saga de Egil, ele compôs a "Höfuðlausn", o resgate da cabeça, numa noite, para agradar o rei Eirík. O poema real não aparece aqui. A aliteração é um traço verdadeiro da poesia dos escaldos; o jogo é invenção.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: "Egil's night",
      sub: "Egil must compose a poem before dawn. Tap only the words that start with the verse's letter. Every mistake dims the candle.",
      toque: 'Tap to start', verso: 'Verse', letra: 'Letter',
      conj: [
        { l: 'S', c: ['sea', 'sword', 'storm', 'shield'], o: ['wolf', 'fire', 'night', 'king', 'iron', 'frost', 'wind', 'oak'] },
        { l: 'W', c: ['wolf', 'war', 'wave', 'wind'], o: ['sea', 'fire', 'night', 'king', 'iron', 'frost', 'shield', 'stone'] },
        { l: 'R', c: ['raven', 'rune', 'roar', 'rage'], o: ['sea', 'fire', 'night', 'king', 'iron', 'frost', 'wind', 'stone'] },
        { l: 'F', c: ['fire', 'fame', 'frost', 'fate'], o: ['sea', 'wolf', 'night', 'king', 'iron', 'storm', 'wind', 'stone'] }
      ],
      perdeu: 'The candle went out', de_novo: 'Tap to try again',
      v1: 'Head saved!',
      v2: "According to Egil's Saga, he composed the “Höfuðlausn”, the head-ransom, in one night to win over King Eirík. The real poem isn't reproduced here. Alliteration is a true feature of skaldic poetry; the game is made up.",
      jogar: 'Tap to play again'
    },
    no: {
      titulo: 'Egils natt',
      sub: 'Egil må komponere et dikt før daggry. Trykk bare på ordene som begynner med versets bokstav. Hver feil demper lyset.',
      toque: 'Trykk for å starte', verso: 'Vers', letra: 'Bokstav',
      conj: [
        { l: 'S', c: ['sverd', 'sjø', 'storm', 'skjold'], o: ['ulv', 'ild', 'natt', 'konge', 'jern', 'frost', 'vind', 'eik'] },
        { l: 'V', c: ['vind', 'våpen', 'vann', 'vrede'], o: ['sjø', 'ild', 'natt', 'konge', 'jern', 'frost', 'skjold', 'stein'] },
        { l: 'R', c: ['ravn', 'rune', 'rop', 'raseri'], o: ['sjø', 'ild', 'natt', 'konge', 'jern', 'frost', 'vind', 'stein'] },
        { l: 'F', c: ['flamme', 'frost', 'fjell', 'ferd'], o: ['sjø', 'ulv', 'natt', 'konge', 'jern', 'storm', 'vind', 'stein'] }
      ],
      perdeu: 'Lyset sluknet', de_novo: 'Trykk for å prøve igjen',
      v1: 'Hodet er reddet!',
      v2: 'Ifølge Egils saga komponerte han «Höfuðlausn», hodeløsningen, på én natt for å vinne over kong Erik. Det virkelige diktet er ikke gjengitt her. Stavrim er et ekte trekk ved skaldediktingen; spillet er diktet opp.',
      jogar: 'Trykk for å spille igjen'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt;
    var st = 'menu', verso = 0, ach = 0, vela = 75, pal = [], spawn = 0, conj = null, flash = 0;
    function novoVerso() { conj = T.conj[verso % T.conj.length]; ach = 0; pal = []; spawn = 0.2; }
    function reset() { st = 'jogo'; verso = 0; vela = 75; novoVerso(); }
    function criar() {
      var ok = Math.random() < 0.45, lista = ok ? conj.c : conj.o;
      var w = lista[Math.floor(Math.random() * lista.length)];
      pal.push({ s: w, ok: ok && w.charAt(0).toUpperCase() === conj.l, x: 60 + Math.random() * (api.w - 120), y: -20, v: 70 + Math.random() * 40 + verso * 6, done: false });
    }
    function down(x, y) {
      if (st === 'menu' || st === 'lose') { reset(); return; }
      if (st === 'win') { st = 'menu'; return; }
      for (var i = pal.length - 1; i >= 0; i--) {
        var p = pal[i];
        if (Math.abs(p.x - x) < 55 && Math.abs(p.y - y) < 26) {
          pal.splice(i, 1);
          if (p.ok) { ach++; if (ach >= 3) { verso++; if (verso >= 6) st = 'win'; else novoVerso(); } }
          else { vela -= 4; flash = 0.3; }
          return;
        }
      }
    }
    return {
      down: down, key: function (c, d) { if ((c === 'Space' || c === 'Enter') && d && st !== 'jogo') down(-999, -999); },
      update: function (dt) {
        if (st !== 'jogo') return;
        vela -= dt; if (flash > 0) flash -= dt;
        if (vela <= 0) { st = 'lose'; return; }
        spawn -= dt; if (spawn <= 0) { spawn = 0.75; criar(); }
        for (var i = pal.length - 1; i >= 0; i--) { pal[i].y += pal[i].v * dt; if (pal[i].y > api.h + 30) pal.splice(i, 1); }
      },
      draw: function () {
        var W = api.w, H = api.h, cx = W / 2;
        var f = Math.max(0, vela / 75), s = g.createLinearGradient(0, 0, 0, H);
        s.addColorStop(0, f > 0.25 ? '#16203a' : '#0a0d18'); s.addColorStop(1, f > 0.25 ? '#2a1e22' : '#120c10'); g.fillStyle = s; g.fillRect(0, 0, W, H);
        if (flash > 0) { g.fillStyle = 'rgba(200,40,40,' + flash + ')'; g.fillRect(0, 0, W, H); }
        pal.forEach(function (p) {
          g.font = 'bold 22px sans-serif'; var w = g.measureText(p.s).width + 28;
          g.fillStyle = 'rgba(245,225,170,.92)'; g.beginPath(); g.roundRect ? g.roundRect(p.x - w / 2, p.y - 20, w, 40, 10) : g.rect(p.x - w / 2, p.y - 20, w, 40); g.fill();
          txt(p.s, p.x, p.y + 8, 22, '#3a2410');
        });
        if (st !== 'menu' && conj) {
          txt(T.verso + ' ' + Math.min(verso + 1, 6) + '/6', 24, 34, 15, '#fff', 'left');
          txt(T.letra + ': ' + conj.l, cx, 40, 28, '#ffd88a');
          for (var i = 0; i < 3; i++) { g.fillStyle = i < ach ? '#ffd88a' : 'rgba(255,255,255,.2)'; g.beginPath(); g.arc(cx - 20 + i * 20, 60, 6, 0, 6.29); g.fill(); }
          // vela
          var vx = 30, vh = 70 * f; g.fillStyle = '#e9dfc7'; g.fillRect(vx - 7, 60 + (70 - vh), 14, vh);
          g.fillStyle = f > 0.02 ? '#ffb02e' : '#555'; g.beginPath(); g.ellipse(vx, 56 + (70 - vh), 6, 10, 0, 0, 6.29); g.fill();
        }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
