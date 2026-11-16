/* Haakon, jarl de Lade — ocupe o tabuleiro cercando as peças do rival (invenção). */
BTJogo.registrar({
  canvas: 'jogo-haakon',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O tabuleiro de Haakon",
    "sub": "Você joga com as peças claras. Toque numa casa marcada para pôr uma peça: as peças do rival que ficarem entre ela e outra sua viram suas. Quem tiver mais peças quando não houver mais jogadas vence; empate conta como derrota. Você tem 150 segundos. (Teclado: setas movem, Espaço joga.)",
    "perdeu": "O rival ficou com mais peças ou o tempo acabou",
    "v1": "O tabuleiro é seu!",
    "v2": "Haakon Sigurdsson governou a Noruega do norte como jarl de Lade e morreu por volta de 995. O tabuleiro é invenção.",
    "h1": "Suas peças",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Haakon's board",
    "sub": "You play the light discs. Tap a marked square to place a disc: the rival discs between it and another of yours turn to yours. Whoever has more discs when no moves are left wins; a tie counts as a loss. You have 150 seconds. (Keyboard: arrows move, Space plays.)",
    "perdeu": "The rival has more discs or time ran out",
    "v1": "The board is yours!",
    "v2": "Haakon Sigurdsson ruled northern Norway as Earl of Lade and died around 995. The board is invented.",
    "h1": "Your discs",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Håkons brett",
    "sub": "Du spiller de lyse brikkene. Trykk på et merket felt for å sette en brikke: motstanderens brikker mellom den og en annen av dine blir dine. Den som har flest brikker når det ikke er flere trekk, vinner; uavgjort teller som tap. Du har 150 sekunder. (Tastatur: piler flytter, mellomrom spiller.)",
    "perdeu": "Motstanderen fikk flest brikker eller tiden tok slutt",
    "v1": "Brettet er ditt!",
    "v2": "Håkon Sigurdsson styrte Nord-Norge som jarl av Lade og døde omkring 995. Brettet er oppfunnet.",
    "h1": "Dine brikker",
    "h2": "Tid"
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
    var N = 6, LIM = 150, DIRS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    var b = [], turn = 'p', t = 0, aiT = 0, passMsg = 0, cur = 14;
    function lay() { var W = api.w, H = api.h, cs = Math.max(40, Math.min((W - 30) / N, (H - 140) / N, 82)); return { cs: cs, x: (W - cs * N) / 2, y: Math.max(74, (H - cs * N) / 2 + 16) }; }
    function pos(i) { var L = lay(); return { x: L.x + (i % N + 0.5) * L.cs, y: L.y + (Math.floor(i / N) + 0.5) * L.cs }; }
    function flips(bd, i, pl) {
      if (bd[i]) return []; var r = Math.floor(i / N), c = i % N, out = [];
      DIRS.forEach(function (d) { var line = [], rr2 = r + d[0], cc = c + d[1]; while (rr2 >= 0 && cc >= 0 && rr2 < N && cc < N && bd[rr2 * N + cc] === 3 - pl) { line.push(rr2 * N + cc); rr2 += d[0]; cc += d[1]; } if (line.length && rr2 >= 0 && cc >= 0 && rr2 < N && cc < N && bd[rr2 * N + cc] === pl) out = out.concat(line); });
      return out;
    }
    function moves(bd, pl) { var o = []; for (var i = 0; i < N * N; i++) { var f = flips(bd, i, pl); if (f.length) o.push({ i: i, f: f }); } return o; }
    function count(pl) { return b.filter(function (v) { return v === pl; }).length; }
    function finish() { st = count(1) > count(2) ? 'win' : 'lose'; }
    function reset() { b = []; for (var i = 0; i < N * N; i++) b.push(0); b[14] = 2; b[15] = 1; b[20] = 1; b[21] = 2; turn = 'p'; t = 0; aiT = 0; passMsg = 0; cur = 14; st = 'play'; }
    function after(who) {
      var other = who === 'p' ? 'a' : 'p';
      if (moves(b, other === 'p' ? 1 : 2).length) { turn = other; aiT = 0.8; return; }
      if (moves(b, who === 'p' ? 1 : 2).length) { turn = who; aiT = 0.8; passMsg = 1.2; return; }
      finish();
    }
    function play(i, pl) { var f = flips(b, i, pl); if (!f.length) return false; b[i] = pl; f.forEach(function (k) { b[k] = pl; }); if (api.nota) api.nota(pl === 1 ? 420 : 330, 0.1, 'triangle', 0.05); return true; }
    function tryP(i) { if (st !== 'play' || turn !== 'p') return; if (play(i, 1)) { if (st === 'play') after('p'); } }
    function ai() {
      var mv = moves(b, 2); if (!mv.length) { after('a'); return; }
      var pick; if (Math.random() < 0.4) pick = mv[Math.floor(Math.random() * mv.length)]; else { var bs = -1; mv.forEach(function (m) { var sc = m.f.length + ([0, 5, 30, 35].indexOf(m.i) >= 0 ? 5 : 0) + Math.random() * 0.5; if (sc > bs) { bs = sc; pick = m; } }); }
      play(pick.i, 2); after('a');
    }
    function at(x, y) { var L = lay(); for (var i = 0; i < N * N; i++) { var p = pos(i); if (Math.abs(x - p.x) < L.cs * 0.5 && Math.abs(y - p.y) < L.cs * 0.5) return i; } return -1; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, turn: turn, b: b.slice(), mv: moves(b, 1).map(function (m) { return m.i; }), pos: pos, pc: count(1), ac: count(2), t: t }; },
      down: function (x, y) { if (menu()) return; var i = at(x, y); if (i >= 0) { cur = i; tryP(i); } },
      move: function () {}, up: function () {},
      key: function (k, d) {
        if (!d) return; if (st !== 'play') { menu(); return; }
        if (k === 'ArrowLeft' || k === 'KeyA') cur = cur % N ? cur - 1 : cur; else if (k === 'ArrowRight' || k === 'KeyD') cur = cur % N < N - 1 ? cur + 1 : cur;
        else if (k === 'ArrowUp' || k === 'KeyW') cur = cur >= N ? cur - N : cur; else if (k === 'ArrowDown' || k === 'KeyS') cur = cur < N * (N - 1) ? cur + N : cur;
        else if (k === 'Space' || k === 'Enter') tryP(cur);
      },
      update: function (dt) { if (passMsg > 0) passMsg -= dt; if (st !== 'play') return; t += dt; if (t >= LIM) { st = 'lose'; return; } if (turn === 'a') { aiT -= dt; if (aiT <= 0) ai(); } },
      draw: function () {
        var L = lay(), cs = L.cs, i, mv = turn === 'p' ? moves(b, 1) : [];
        bg('#1d3a32', '#0a1814');
        g.fillStyle = '#2f6b50'; rr(L.x - 6, L.y - 6, cs * N + 12, cs * N + 12, 10); g.fill();
        for (i = 0; i < N * N; i++) {
          var p = pos(i); g.fillStyle = (Math.floor(i / N) + i % N) % 2 ? '#3a7a5c' : '#337054'; g.fillRect(p.x - cs / 2, p.y - cs / 2, cs, cs);
          if (b[i]) { g.fillStyle = b[i] === 1 ? '#f3ecd2' : '#2a2438'; g.beginPath(); g.arc(p.x, p.y, cs * 0.38, 0, 6.283); g.fill(); g.strokeStyle = b[i] === 1 ? '#bba97a' : '#6a5a98'; g.lineWidth = 2; g.stroke(); }
          else if (st === 'play' && mv.some(function (m) { return m.i === i; })) { g.fillStyle = 'rgba(255,216,138,.55)'; g.beginPath(); g.arc(p.x, p.y, cs * 0.11, 0, 6.283); g.fill(); }
          if (st === 'play' && i === cur && turn === 'p') { g.strokeStyle = '#ffd88a'; g.lineWidth = 3; g.strokeRect(p.x - cs / 2 + 2, p.y - cs / 2 + 2, cs - 4, cs - 4); }
        }
        var rx = L.x + cs * N; g.fillStyle = '#2a2438'; g.beginPath(); g.arc(rx - 10, L.y - 17, 9, 0, 6.283); g.fill(); g.strokeStyle = '#6a5a98'; g.lineWidth = 2; g.stroke(); txt(String(count(2)), rx - 26, L.y - 11, 15, '#c9b3f2', 'right');
        if (turn === 'a' && st === 'play') txt('…', api.w / 2, L.y - 14, 22, '#c9b3f2');
        bar(api.w / 2 - 110, api.h - 14, 220, 5, (LIM - t) / LIM, LIM - t < 20 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + count(1) + '/' + (N * N), T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };
  }
});
