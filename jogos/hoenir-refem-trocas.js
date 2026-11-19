/* Hœnir entre os vanir — dez rodadas de troca com um parceiro que repete a sua última escolha (invenção). */
BTJogo.registrar({
  canvas: 'jogo-hoenir',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O refém e as trocas",
    "sub": "Como Hœnir entre os vanir, você faz trocas com um parceiro durante 10 rodadas. Em cada uma, escolha Entregar (dividir a oferta) ou Guardar (ficar com ela). Os dois entregam: 3 pontos para cada. Você guarda e ele entrega: 5 para você e 0 para ele. Você entrega e ele guarda: 0 para você e 5 para ele. Os dois guardam: 1 ponto para cada. O parceiro começa entregando e depois repete a sua escolha da rodada anterior. Chegue a 28 pontos. (Teclado: 1 entrega, 2 guarda.)",
    "perdeu": "As rodadas ou o tempo acabaram antes dos 28 pontos",
    "v1": "Trocas concluídas!",
    "v2": "Na Ynglinga saga, depois da guerra entre os æsir e os vanir, Hœnir e Mímir são enviados aos vanir como reféns; Hœnir é logo feito chefe, mas depende de Mímir para decidir. As rodadas de troca são invenção.",
    "h1": "Rodada",
    "h2": "Tempo",
    "g0": "Entregar",
    "g1": "Guardar",
    "g2": "Você",
    "g3": "Parceiro",
    "g4": "Meta"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The hostage and the exchanges",
    "sub": "Like Hœnir among the Vanir, you trade with a partner for 10 rounds. In each one, choose Share (split the offering) or Keep (hold on to it). Both share: 3 points each. You keep and they share: 5 for you and 0 for them. You share and they keep: 0 for you and 5 for them. Both keep: 1 point each. The partner starts by sharing and then repeats your choice from the previous round. Reach 28 points. (Keyboard: 1 shares, 2 keeps.)",
    "perdeu": "The rounds or the time ran out before 28 points",
    "v1": "Exchanges complete!",
    "v2": "In the Ynglinga saga, after the war between the Æsir and the Vanir, Hœnir and Mímir are sent to the Vanir as hostages; Hœnir is soon made chief but depends on Mímir to decide. The rounds of exchange are invented.",
    "h1": "Round",
    "h2": "Time",
    "g0": "Share",
    "g1": "Keep",
    "g2": "You",
    "g3": "Partner",
    "g4": "Goal"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Gisselen og byttene",
    "sub": "Som Hønir blant vanene bytter du med en partner i 10 runder. I hver runde velger du Gi (dele offeret) eller Beholde (ta det for deg selv). Begge gir: 3 poeng til hver. Du beholder og partneren gir: 5 til deg og 0 til partneren. Du gir og partneren beholder: 0 til deg og 5 til partneren. Begge beholder: 1 poeng til hver. Partneren begynner med å gi og gjentar deretter valget ditt fra forrige runde. Kom til 28 poeng. (Tastatur: 1 gir, 2 beholder.)",
    "perdeu": "Rundene eller tiden tok slutt før 28 poeng",
    "v1": "Byttene er fullført!",
    "v2": "I Ynglingesaga blir Hønir og Mímir sendt til vanene som gisler etter krigen mellom æsene og vanene; Hønir blir straks gjort til høvding, men er avhengig av Mímir for å bestemme. Byttene er oppfunnet.",
    "h1": "Runde",
    "h2": "Tid",
    "g0": "Gi",
    "g1": "Beholde",
    "g2": "Du",
    "g3": "Partner",
    "g4": "Mål"
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
    var ROUNDS = 10, GOAL = 28, LIM = 150;
    var r = 0, score = 0, hist = [], lock = 0, last = null, t = 0, prev = 1;
    function reset() { r = 0; score = 0; hist = []; lock = 0; last = null; t = 0; prev = 1; st = 'play'; }
    function pay(a, b) { return a && b ? 3 : (!a && b ? 5 : (a && !b ? 0 : 1)); }
    function choose(a) {
      if (st !== 'play' || lock > 0 || r >= ROUNDS) return;
      var b = prev; score += pay(a, b); hist.push([a, b]); prev = a; last = [a, b]; lock = 0.8; r++;
      if (api.nota) api.nota(a ? 440 : 180, 0.12, 'triangle', 0.05);
    }
    function lay() { var W = api.w, H = api.h, bw = Math.min(230, (W - 60) / 2), bh = Math.max(50, Math.min(70, H * 0.15)); return { bw: bw, bh: bh, y: H - bh - 36, x0: W / 2 - bw - 10, x1: W / 2 + 10 }; }
    function pos() { var L = lay(); return [{ x: L.x0 + L.bw / 2, y: L.y + L.bh / 2 }, { x: L.x1 + L.bw / 2, y: L.y + L.bh / 2 }]; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, r: r, score: score, goal: GOAL, hist: hist.map(function (h) { return h.slice(); }), pos: pos(), lock: lock, rounds: ROUNDS, t: t }; },
      down: function (x, y) {
        if (menu()) return; var L = lay();
        if (y < L.y || y > L.y + L.bh) return;
        if (x >= L.x0 && x <= L.x0 + L.bw) choose(1); else if (x >= L.x1 && x <= L.x1 + L.bw) choose(0);
      },
      move: function () {}, up: function () {},
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'Digit1' || k === 'Numpad1' || k === 'ArrowLeft' || k === 'KeyA') choose(1); else if (k === 'Digit2' || k === 'Numpad2' || k === 'ArrowRight' || k === 'KeyD') choose(0); },
      update: function (dt) {
        if (st !== 'play') return; t += dt;
        if (lock > 0) { lock -= dt; if (lock <= 0 && r >= ROUNDS) st = score >= GOAL ? 'win' : 'lose'; }
        if (st === 'play' && t >= LIM) st = 'lose';
      },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), i; bg('#1b2433', '#0b1019');
        var sp = Math.min(46, (W - 40) / ROUNDS), y0 = 96;
        txt(T.g2 + ' (↑)  ·  ' + T.g3 + ' (↓)', W / 2, y0 - 22, 12, '#c9b3f2');
        for (i = 0; i < ROUNDS; i++) {
          var x = W / 2 + (i - (ROUNDS - 1) / 2) * sp;
          for (var j = 0; j < 2; j++) {
            g.beginPath(); g.arc(x, y0 + j * 22, 8, 0, 6.2832);
            if (i < hist.length) { g.fillStyle = hist[i][j] ? '#6fcf97' : '#e5736a'; g.fill(); } else { g.strokeStyle = 'rgba(255,255,255,.25)'; g.lineWidth = 1.5; g.stroke(); }
          }
        }
        txt(String(score), W / 2, H * 0.5 + 10, 60, '#ffd88a');
        txt(T.g4 + ' ' + GOAL, W / 2, H * 0.5 + 40, 15, '#c9b3f2');
        if (last && lock > 0) txt('+' + pay(last[0], last[1]), W / 2, H * 0.5 - 56, 24, '#f3ecd2');
        var cols = ['#2f7d52', '#a3433a'], labs = [T.g0, T.g1];
        for (i = 0; i < 2; i++) {
          var bx = i === 0 ? L.x0 : L.x1; g.fillStyle = lock > 0 ? 'rgba(80,80,90,.7)' : cols[i]; rr(bx, L.y, L.bw, L.bh, 12); g.fill();
          g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 1.5; rr(bx, L.y, L.bw, L.bh, 12); g.stroke();
          txt(labs[i], bx + L.bw / 2, L.y + L.bh / 2 + 6, 19, '#fff');
        }
        bar(W / 2 - 110, H - 12, 220, 5, (LIM - t) / LIM, LIM - t < 30 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + Math.min(r + 1, ROUNDS) + '/' + ROUNDS, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };

  }
});
