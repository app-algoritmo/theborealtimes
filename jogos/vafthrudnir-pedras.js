/* O duelo das pedras — o jogo de Nim contra o gigante sábio. */
BTJogo.registrar({
  canvas: 'jogo-vafthrudnir',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O duelo das pedras",
    "sub": "Vafþrúðnir joga Nim com você. Há três pilhas de pedras. Na sua vez, toque numa pedra para tirá-la, junto com as que estão acima dela, em uma só pilha. Quem tirar a última pedra vence a rodada. Ganhe 2 rodadas antes de perder 2. (Teclado: setas para escolher a pilha e a quantidade, espaço para confirmar.)",
    "perdeu": "O gigante contou melhor",
    "v1": "Você venceu o gigante!",
    "v2": "No Vafþrúðnismál, Odin vence o gigante com uma pergunta que só ele sabia responder. O jogo de pedras é invenção do jogo.",
    "h1": "Rodadas",
    "h2": "Falhas",
    "vez": "Sua vez",
    "pensa": "Vafþrúðnir pensa…",
    "ganhou": "Rodada ganha",
    "perdida": "Rodada perdida"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The duel of the stones",
    "sub": "Vafþrúðnir plays Nim with you. There are three piles of stones. On your turn, tap a stone to take it, along with those above it, from one pile. Whoever takes the last stone wins the round. Win 2 rounds before losing 2. (Keyboard: arrows to choose the pile and the amount, Space to confirm.)",
    "perdeu": "The giant counted better",
    "v1": "You beat the giant!",
    "v2": "In the Vafþrúðnismál, Odin beats the giant with a question only he could answer. The game of stones is made up.",
    "h1": "Rounds",
    "h2": "Failures",
    "vez": "Your turn",
    "pensa": "Vafþrúðnir is thinking…",
    "ganhou": "Round won",
    "perdida": "Round lost"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Steinduellen",
    "sub": "Vaftrudne spiller nim med deg. Det er tre hauger med steiner. På din tur trykker du på en stein for å ta den, sammen med de over, fra én haug. Den som tar den siste steinen, vinner runden. Vinn 2 runder før du taper 2. (Tastatur: piler for å velge haug og antall, mellomrom for å bekrefte.)",
    "perdeu": "Jotunen telte bedre",
    "v1": "Du slo jotunen!",
    "v2": "I Vaftrudnismål slår Odin jotunen med et spørsmål bare han kunne svare på. Steinspillet er diktet opp.",
    "h1": "Runder",
    "h2": "Feil",
    "vez": "Din tur",
    "pensa": "Vaftrudne tenker…",
    "ganhou": "Runde vunnet",
    "perdida": "Runde tapt"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "El duelo de las piedras",
    "sub": "Vafþrúðnir juega al Nim contigo. Hay tres montones de piedras. En tu turno, toca una piedra para quitarla, junto con las que están encima, de un solo montón. Quien quite la última piedra gana la ronda. Gana 2 rondas antes de perder 2. (Teclado: flechas para elegir el montón y la cantidad, espacio para confirmar.)",
    "perdeu": "El gigante contó mejor",
    "v1": "¡Has vencido al gigante!",
    "v2": "En el Vafþrúðnismál, Odín vence al gigante con una pregunta que solo él sabía responder. El juego de piedras es invención del juego.",
    "h1": "Rondas",
    "h2": "Fallos",
    "vez": "Tu turno",
    "pensa": "Vafþrúðnir piensa…",
    "ganhou": "Ronda ganada",
    "perdida": "Ronda perdida"
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
    var heaps = [], turn = 'p', wins = 0, loses = 0, wait = 0, sel = 0, take = 1, tmr = 25, msg = '', hov = null, pop = 0, prs = false;
    function lay() { var W = api.w, H = api.h, P = Math.min(W / 3.3, 150), s = Math.min(P * 0.3, (H - 190) / 9, 36); return { P: P, s: s, x0: W / 2, y0: H - 70 }; }
    function sp(i, k) { var L = lay(); return { x: L.x0 + (i - 1) * L.P, y: L.y0 - k * (L.s * 1.08) - L.s * 0.5 }; }
    function nimsum(h) { return h[0] ^ h[1] ^ h[2]; }
    function newRound() { var h; do { h = [2 + Math.floor(Math.random() * 5), 2 + Math.floor(Math.random() * 5), 1 + Math.floor(Math.random() * 5)]; } while (nimsum(h) === 0); heaps = h; turn = 'p'; wait = 0; sel = 0; take = 1; tmr = 25; msg = ''; hov = null; }
    function setup() { wins = 0; loses = 0; newRound(); }
    function reset() { setup(); st = 'play'; }
    function total() { return heaps[0] + heaps[1] + heaps[2]; }
    function roundEnd(playerWon) { msg = playerWon ? T.ganhou : T.perdida; if (playerWon) wins++; else loses++; wait = 1.4; turn = 'x'; if (wins >= 2) { st = 'win'; } else if (loses >= 2) { st = 'lose'; } }
    function doTake(i, n, who) { heaps[i] = Math.max(0, heaps[i] - n); if (api.nota) api.nota(who === 'p' ? 300 : 220, 0.08, 'square', 0.05); if (total() === 0) { roundEnd(who === 'p'); return; } if (who === 'p') { turn = 'a'; wait = 0.9; } else { turn = 'p'; tmr = 25; take = Math.min(take, Math.max(1, heaps[sel])); } }
    function ai() {
      var ns = nimsum(heaps), mv = null, i;
      if (ns !== 0 && Math.random() < 0.72) { for (i = 0; i < 3; i++) { var t = heaps[i] ^ ns; if (t < heaps[i]) { mv = [i, heaps[i] - t]; break; } } }
      if (!mv) { var o = []; for (i = 0; i < 3; i++) if (heaps[i] > 0) o.push(i); i = o[Math.floor(Math.random() * o.length)]; mv = [i, 1 + Math.floor(Math.random() * Math.min(heaps[i], 3))]; }
      doTake(mv[0], mv[1], 'a');
    }
    function pick(x, y) { var L = lay(); for (var i = 0; i < 3; i++) for (var k = 0; k < heaps[i]; k++) { var p = sp(i, k); if (Math.abs(x - p.x) < L.s * 0.75 && Math.abs(y - p.y) < L.s * 0.6) return [i, k]; } return null; }
    setup();
    return {
      pausar: function () { prs = false; },
      dbg: function () { return { st: st, heaps: heaps.slice(), turn: turn, wins: wins, loses: loses, wait: wait, pos: sp, s: lay().s }; },
      down: function (x, y) { if (menu()) return; if (turn !== 'p' || wait > 0) return; var p = pick(x, y); if (p) { sel = p[0]; doTake(p[0], heaps[p[0]] - p[1], 'p'); } },
      move: function (x, y, pr) { hov = turn === 'p' ? pick(x, y) : null; },
      key: function (c, d) {
        if (!d) return; if (st !== 'play') { menu(); return; } if (turn !== 'p' || wait > 0) return;
        if (c === 'ArrowLeft' || c === 'KeyA') { do { sel = (sel + 2) % 3; } while (heaps[sel] === 0); take = Math.min(take, heaps[sel]); }
        else if (c === 'ArrowRight' || c === 'KeyD') { do { sel = (sel + 1) % 3; } while (heaps[sel] === 0); take = Math.min(take, heaps[sel]); }
        else if (c === 'ArrowUp' || c === 'KeyW') take = Math.min(heaps[sel], take + 1);
        else if (c === 'ArrowDown' || c === 'KeyS') take = Math.max(1, take - 1);
        else if (c === 'Space' || c === 'Enter') { if (heaps[sel] > 0) doTake(sel, take, 'p'); }
      },
      update: function (dt) {
        pop += dt; if (st === 'menu') return;
        if (wait > 0) { wait -= dt; if (wait <= 0) { wait = 0; if (turn === 'a') ai(); else if (turn === 'x' && st === 'play') newRound(); } return; }
        if (st === 'play' && turn === 'p') { tmr -= dt; if (tmr <= 0) { roundEnd(false); } }
      },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), i, k;
        bg('#1d1a2e', '#0c0a16');
        g.fillStyle = '#2b2740'; g.fillRect(0, H - 56, W, 56);
        for (i = 0; i < 3; i++) {
          for (k = 0; k < heaps[i]; k++) {
            var p = sp(i, k), hi = (hov && hov[0] === i && k >= hov[1]) || (!hov && turn === 'p' && sel === i && k >= heaps[i] - take);
            g.fillStyle = hi ? '#ffd88a' : '#8a93a8'; g.beginPath(); g.ellipse ? g.ellipse(p.x, p.y, L.s * 0.62, L.s * 0.48, 0, 0, 6.283) : g.arc(p.x, p.y, L.s * 0.5, 0, 6.283); g.fill();
            g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(p.x - L.s * 0.3, p.y - L.s * 0.3, L.s * 0.3, 3);
          }
          if (turn === 'p' && sel === i) { g.fillStyle = 'rgba(255,216,138,.8)'; g.fillRect(sp(i, 0).x - 22, H - 52, 44, 4); }
        }
        txt(turn === 'a' ? T.pensa : (turn === 'p' ? T.vez + ' · ' + Math.ceil(tmr) : msg), W / 2, 96, 17, turn === 'x' ? '#ffd88a' : '#c9b3f2');
        hud(T.h1 + ' ' + wins + '/2', T.h2 + ' ' + loses + '/2', loses > 0);
        fim(st);
      }
    };
  }
});
