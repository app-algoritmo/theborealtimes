/* Hauksbók e o algorismo — chegue ao 24 com quatro números (invenção). */
BTJogo.registrar({
  canvas: 'jogo-hauksbok',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O algorismo de Haukr",
    "sub": "Em cada rodada você recebe quatro números e precisa chegar a 24. Toque num número, depois numa operação (+, − ou ×), depois em outro número: os dois viram o resultado. Repita até sobrar um só. Se não der 24, a rodada recomeça e conta um erro. O botão de desfazer recomeça a rodada sem erro. Vença 5 rodadas com no máximo 2 erros.",
    "perdeu": "Os erros passaram do limite antes de as rodadas terminarem",
    "v1": "Cinco rodadas resolvidas!",
    "v2": "A Hauksbók foi organizada por Haukr Erlendsson, por volta de 1302 a 1310 segundo o estudo da escrita, e reúne a Landnámabók, a Eiríks saga rauða, a Völuspá e uma seção de matemática, o Algorismus. O jogo é invenção.",
    "h1": "Rodadas",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Haukr's algorism",
    "sub": "Each round gives you four numbers and you must reach 24. Tap a number, then an operation (+, − or ×), then another number: the two become the result. Repeat until only one is left. If it is not 24, the round restarts and a mistake is counted. The undo button restarts the round without a mistake. Win 5 rounds with at most 2 mistakes.",
    "perdeu": "The mistakes passed the limit before the rounds were done",
    "v1": "Five rounds solved!",
    "v2": "The Hauksbók was put together by Haukr Erlendsson, around 1302 to 1310 according to the study of the handwriting, and gathers the Landnámabók, Eiríks saga rauða, the Völuspá and a mathematics section, the Algorismus. The game is invented.",
    "h1": "Rounds",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Haukrs algorismus",
    "sub": "Hver runde gir deg fire tall, og du må komme til 24. Trykk på et tall, så på en regneart (+, − eller ×), så på et annet tall: de to blir til resultatet. Gjenta til bare ett er igjen. Hvis det ikke er 24, starter runden på nytt og en feil telles. Angreknappen starter runden på nytt uten feil. Vinn 5 runder med høyst 2 feil.",
    "perdeu": "Feilene gikk over grensen før rundene var ferdige",
    "v1": "Fem runder løst!",
    "v2": "Hauksbók ble satt sammen av Haukr Erlendsson, omkring 1302 til 1310 ifølge studiet av håndskriften, og samler Landnámabók, Eiríks saga rauða, Völuspá og en matematikkdel, Algorismus. Spillet er oppfunnet.",
    "h1": "Runder",
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
    var ROUNDS = 5, MAXE = 3, TARGET = 24;
    var OPS = ['+', '-', '*'], SYM = { '+': '+', '-': '−', '*': '×' };
    var start = [], cards = [], sel = -1, op = null, round = 0, err = 0, flash = 0, fcol = '#fff';
    function ap(a, o, b) { return o === '+' ? a + b : (o === '-' ? a - b : a * b); }
    function merge(l, i, j, o) { var r = ap(l[i], o, l[j]), out = [], lo = Math.min(i, j), hi = Math.max(i, j); for (var k = 0; k < l.length; k++) { if (k === lo) out.push(r); else if (k !== hi) out.push(l[k]); } return out; }
    function solve(l) {
      if (l.length === 1) return l[0] === TARGET ? [] : null;
      for (var i = 0; i < l.length; i++) for (var j = 0; j < l.length; j++) { if (i === j) continue; for (var q = 0; q < 3; q++) { var s = solve(merge(l, i, j, OPS[q])); if (s) return [[i, OPS[q], j]].concat(s); } }
      return null;
    }
    function newRound() { do { start = []; for (var i = 0; i < 4; i++) start.push(1 + Math.floor(Math.random() * 9)); } while (!solve(start)); cards = start.slice(); sel = -1; op = null; }
    function reset() { round = 0; err = 0; flash = 0; newRound(); st = 'play'; }
    function done() {
      if (cards[0] === TARGET) { round++; flash = 0.4; fcol = '#ffd88a'; if (round >= ROUNDS) { st = 'win'; return; } newRound(); }
      else { err++; flash = 0.4; fcol = '#ff6a5a'; if (err >= MAXE) { st = 'lose'; return; } cards = start.slice(); sel = -1; op = null; }
    }
    function tapCard(i) {
      if (st !== 'play') return;
      if (sel < 0 || (sel === i)) { sel = sel === i ? -1 : i; op = null; return; }
      if (op === null) { sel = i; return; }
      cards = merge(cards, sel, i, op); sel = -1; op = null; if (api.nota) api.nota(330, 0.1, 'triangle', 0.06);
      if (cards.length === 1) done();
    }
    function tapOp(o) { if (st !== 'play' || sel < 0) return; op = op === o ? null : o; }
    function lay() { var W = api.w, H = api.h, cw = Math.max(44, Math.min(76, (W - 50) / 4)); return { cw: cw, cy: H * 0.36, oy: H * 0.36 + cw / 2 + 52, ob: Math.min(56, (W - 60) / 4), uy: H - 56 }; }
    function cpos(i) { var L = lay(); return { x: api.w / 2 + (i - (cards.length - 1) / 2) * (L.cw + 12), y: L.cy }; }
    function opos(q) { var L = lay(); return { x: api.w / 2 + (q - 1) * (L.ob + 14), y: L.oy }; }
    function upos() { var L = lay(); return { x: api.w / 2, y: L.uy }; }
    function hit(p, x, y, hw) { return Math.abs(x - p.x) < hw && Math.abs(y - p.y) < hw; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { var s = solve(cards); return { st: st, cards: cards.slice(), start: start.slice(), round: round, err: err, sel: sel, op: op, hint: s && s.length ? s[0] : null, pos: cards.map(function (c, i) { return cpos(i); }), ops: OPS.map(function (o, q) { var p = opos(q); return { op: o, x: p.x, y: p.y }; }), undo: upos() }; },
      down: function (x, y) {
        if (menu()) return; var L = lay(), i, q;
        for (i = 0; i < cards.length; i++) if (hit(cpos(i), x, y, L.cw / 2)) { tapCard(i); return; }
        for (q = 0; q < 3; q++) if (hit(opos(q), x, y, L.ob / 2)) { tapOp(OPS[q]); return; }
        if (hit(upos(), x, y, 34)) { cards = start.slice(); sel = -1; op = null; }
      },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) { if (flash > 0) flash -= dt; },
      draw: function () {
        var L = lay(), i, q; bg('#16202a', '#070a0e');
        txt('= ' + TARGET, api.w / 2, L.cy - L.cw / 2 - 26, 30, '#ffd88a');
        for (i = 0; i < cards.length; i++) { var p = cpos(i); g.fillStyle = sel === i ? '#ffd88a' : '#efe2bd'; rr(p.x - L.cw / 2, p.y - L.cw / 2, L.cw, L.cw, 12); g.fill(); if (flash > 0) { g.strokeStyle = fcol; g.lineWidth = 4; g.stroke(); } txt(String(cards[i]), p.x, p.y + 10, 30, '#2a2112'); }
        for (q = 0; q < 3; q++) { var o = opos(q); g.fillStyle = op === OPS[q] ? '#ffd88a' : 'rgba(255,255,255,.14)'; g.beginPath(); g.arc(o.x, o.y, L.ob / 2, 0, 6.2832); g.fill(); txt(SYM[OPS[q]], o.x, o.y + 9, 26, op === OPS[q] ? '#2a2112' : '#f3ecd2'); }
        var u = upos(); g.strokeStyle = 'rgba(255,255,255,.4)'; g.lineWidth = 2; g.beginPath(); g.arc(u.x, u.y, 20, 0.4, 5.6); g.stroke(); g.fillStyle = 'rgba(255,255,255,.4)'; g.beginPath(); g.moveTo(u.x + 22, u.y - 14); g.lineTo(u.x + 14, u.y - 2); g.lineTo(u.x + 28, u.y - 4); g.closePath(); g.fill();
        hud(T.h1 + ' ' + round + '/' + ROUNDS, T.h2 + ' ' + err + '/' + MAXE, true);
        fim(st);
      }
    };

  }
});
