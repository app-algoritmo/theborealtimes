/* Constantinopla, 860 — repita a sequência dos sinos. */
BTJogo.registrar({
  canvas: 'jogo-sinos',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os sinos de Constantinopla",
    "sub": "Os quatro sinos tocam numa ordem. Quando terminar, toque nos sinos na mesma ordem (ou use as teclas 1 a 4). A cada rodada a sequência cresce. Repita 9 toques sem errar.",
    "perdeu": "Você errou a ordem dos sinos",
    "v1": "A cidade ouviu os sinos!",
    "v2": "Em 860, os Rus atacaram Constantinopla. A tradição de sinos e de sequências é invenção do jogo.",
    "h1": "Sequência",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The bells of Constantinople",
    "sub": "The four bells ring in an order. When they finish, tap the bells in the same order (or use keys 1 to 4). Each round the sequence grows. Repeat 9 taps without a mistake.",
    "perdeu": "You got the order of the bells wrong",
    "v1": "The city heard the bells!",
    "v2": "In 860 the Rus attacked Constantinople. The bells and the sequences are made up for the game.",
    "h1": "Sequence",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Klokkene i Konstantinopel",
    "sub": "De fire klokkene ringer i en rekkefølge. Når de er ferdige, trykk på klokkene i samme rekkefølge (eller bruk tastene 1 til 4). For hver runde vokser rekken. Gjenta 9 trykk uten å gjøre feil.",
    "perdeu": "Du tok feil av rekkefølgen",
    "v1": "Byen hørte klokkene!",
    "v2": "I 860 angrep Rus Konstantinopel. Klokkene og rekkene er diktet opp for spillet.",
    "h1": "Rekke",
    "h2": "Tid"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "Las campanas de Constantinopla",
    "sub": "Las cuatro campanas suenan en un orden. Cuando terminen, toca las campanas en el mismo orden (o usa las teclas 1 a 4). En cada ronda la secuencia crece. Repite 9 toques sin fallar.",
    "perdeu": "Fallaste el orden de las campanas",
    "v1": "¡La ciudad oyó las campanas!",
    "v2": "En 860, los rus atacaron Constantinopla. La tradición de campanas y de secuencias es un invento del juego.",
    "h1": "Secuencia",
    "h2": "Tiempo"
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
    var GOAL = 9, LIM = 150, COLS = ['#d8493a', '#4a8ad0', '#7fc06a', '#e0b840'], FR = [262, 330, 392, 523];
    var seq = [], phase = 'show', idx = 0, tm = 0, lit = -1, litT = 0, inp = 0, t = 0, cur = 0;
    function lay() { var W = api.w, H = api.h, s = Math.max(70, Math.min((W - 40) / 2, (H - 170) / 2, 130)); return { s: s, x: W / 2 - s - 6, y: Math.max(92, (H - 2 * s) / 2 + 12) }; }
    function setup() { seq = []; for (var i = 0; i < GOAL; i++) seq.push(Math.floor(Math.random() * 4)); idx = 0; inp = 0; phase = 'show'; tm = 0; t = 0; lit = -1; round = 1; }
    var round = 1;
    function reset() { setup(); st = 'play'; }
    function ring(b) { lit = b; litT = 0.3; if (api.nota) api.nota(FR[b], 0.28, 'triangle', 0.08); }
    function press(b) { if (st !== 'play' || phase !== 'input') return; ring(b); if (b !== seq[inp]) { st = 'lose'; if (api.nota) api.nota(100, 0.4, 'sawtooth', 0.07); return; } inp++; tm = 0; if (inp >= round) { if (round >= GOAL) { st = 'win'; return; } round++; phase = 'show'; idx = 0; tm = -0.6; inp = 0; } }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, seq: seq.slice(), phase: phase, round: round, inp: inp, goal: GOAL, t: t, pos: function (b) { return { x: L.x + (b % 2) * (L.s + 12) + L.s / 2, y: L.y + Math.floor(b / 2) * (L.s + 12) + L.s / 2 }; } }; },
      down: function (x, y) { if (menu()) return; var L = lay(); for (var b = 0; b < 4; b++) { var bx = L.x + (b % 2) * (L.s + 12), by = L.y + Math.floor(b / 2) * (L.s + 12); if (x >= bx && x <= bx + L.s && y >= by && y <= by + L.s) { cur = b; press(b); } } },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'Digit1' || k === 'Digit2' || k === 'Digit3' || k === 'Digit4') { cur = +k.slice(5) - 1; press(cur); } else if (k === 'ArrowLeft') cur = cur ^ 1; else if (k === 'ArrowRight') cur = cur ^ 1; else if (k === 'ArrowUp' || k === 'ArrowDown') cur = cur ^ 2; else if (k === 'Space' || k === 'Enter') press(cur); },
      update: function (dt) { if (litT > 0) { litT -= dt; if (litT <= 0) lit = -1; } if (st !== 'play') return; t += dt; if (t >= LIM) { st = 'lose'; return; }
        tm += dt; if (phase === 'show') { if (tm >= 0.7) { tm = 0; if (idx < round) { ring(seq[idx]); idx++; } else { phase = 'input'; inp = 0; } } } else if (tm > 6) { st = 'lose'; } },
      draw: function () {
        var L = lay(), W = api.w, H = api.h, b;
        bg('#2a2230', '#08060c');
        for (b = 0; b < 4; b++) { var bx = L.x + (b % 2) * (L.s + 12), by = L.y + Math.floor(b / 2) * (L.s + 12); g.globalAlpha = lit === b ? 1 : 0.45; g.fillStyle = COLS[b]; rr(bx, by, L.s, L.s, 16); g.fill(); g.globalAlpha = 1; txt('🔔', bx + L.s / 2, by + L.s * 0.65, L.s * 0.42, '#fff'); if (cur === b && st === 'play' && phase === 'input') { g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 2; rr(bx + 3, by + 3, L.s - 6, L.s - 6, 14); g.stroke(); } }
        txt(phase === 'show' ? '…' : '▶', W / 2, L.y - 10, 20, '#ffd88a');
        hud(T.h1 + ' ' + (phase === 'input' ? round : round - 1) + '/' + GOAL, T.h2 + ' ' + Math.ceil(LIM - t), false);
        fim(st);
      }
    };
  }
});
