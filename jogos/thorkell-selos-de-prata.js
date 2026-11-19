/* Thorkell, o Alto — os selos de prata (invenção). */
BTJogo.registrar({
  canvas: 'jogo-thorkell',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os selos de prata",
    "sub": "Em cada quadro de 4 por 4, preencha as casas vazias com números de 1 a 4, de modo que cada linha, cada coluna e cada bloco de 2 por 2 tenha os quatro números, sem repetir. Cada toque numa casa vazia avança o número: 1, 2, 3, 4 e vazio de novo. Números repetidos ficam em vermelho. O tempo é limitado. São 3 quadros.",
    "perdeu": "O tempo acabou antes de os selos estarem certos",
    "v1": "Selos no lugar!",
    "v2": "Thorkell, o Alto, foi um chefe de guerra dinamarquês que liderou ataques à Inglaterra a partir de 1009, serviu depois o rei Æthelred e, mais tarde, Canuto, que o fez conde da Ânglia Oriental. Preencher selos é invenção.",
    "h1": "Quadro",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The silver seals",
    "sub": "On each 4-by-4 board, fill the empty squares with numbers from 1 to 4, so that every row, every column and every 2-by-2 block holds all four numbers, with no repeats. Each tap on an empty square advances the number: 1, 2, 3, 4 and empty again. Repeated numbers turn red. Time is limited. There are 3 boards.",
    "perdeu": "Time ran out before the seals were right",
    "v1": "Seals in place!",
    "v2": "Thorkell the Tall was a Danish warlord who led attacks on England from 1009, later served King Æthelred and, later still, Cnut, who made him earl of East Anglia. Filling seals is invented.",
    "h1": "Board",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Sølvseglene",
    "sub": "På hvert brett på 4 ganger 4 fyller du de tomme rutene med tall fra 1 til 4, slik at hver rad, hver kolonne og hver blokk på 2 ganger 2 har alle fire tallene, uten gjentakelser. Hvert trykk på en tom rute går videre til neste tall: 1, 2, 3, 4 og tom igjen. Gjentatte tall blir røde. Tiden er begrenset. Det er 3 brett.",
    "perdeu": "Tiden gikk ut før seglene var riktige",
    "v1": "Seglene er på plass!",
    "v2": "Thorkell den høye var en dansk krigsherre som ledet angrep på England fra 1009, tjente senere kong Æthelred og enda senere Knut, som gjorde ham til jarl av Øst-Anglia. Å fylle segl er oppfunnet.",
    "h1": "Brett",
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
    var GIV = [9, 7, 6], NL = 3, LIM = 300;
    var lvl = 0, sol = [], giv = [], cur = [], t = 0, pend = 0;
    function okAt(b, k, v) { var r = (k / 4) | 0, c = k % 4, i; for (i = 0; i < 4; i++) { if (b[r * 4 + i] === v && r * 4 + i !== k) return false; if (b[i * 4 + c] === v && i * 4 + c !== k) return false; } var br = r - r % 2, bc = c - c % 2, y, x; for (y = 0; y < 2; y++) for (x = 0; x < 2; x++) { var q = (br + y) * 4 + bc + x; if (q !== k && b[q] === v) return false; } return true; }
    function count(b, lim) {
      var k = b.indexOf(0); if (k < 0) return 1; var tot = 0;
      for (var v = 1; v <= 4 && tot < lim; v++) if (okAt(b, k, v)) { b[k] = v; tot += count(b, lim - tot); b[k] = 0; }
      return tot;
    }
    function fill(b) { var k = b.indexOf(0); if (k < 0) return true; var o = [1, 2, 3, 4].sort(function () { return Math.random() - 0.5; }); for (var i = 0; i < 4; i++) if (okAt(b, k, o[i])) { b[k] = o[i]; if (fill(b)) return true; b[k] = 0; } return false; }
    function load(i) {
      var b = []; for (var k = 0; k < 16; k++) b[k] = 0; fill(b); sol = b.slice(); giv = b.slice();
      var ord = []; for (k = 0; k < 16; k++) ord.push(k); ord.sort(function () { return Math.random() - 0.5; });
      var left = 16; for (var j = 0; j < 16 && left > GIV[i]; j++) { var v = giv[ord[j]]; giv[ord[j]] = 0; if (count(giv.slice(), 2) !== 1) giv[ord[j]] = v; else left--; }
      cur = giv.slice();
    }
    function bad(k) { var v = cur[k]; return v && !okAt(cur, k, v); }
    function done() { for (var k = 0; k < 16; k++) if (cur[k] !== sol[k]) return false; return true; }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function lay() { var W = api.w, H = api.h, s = Math.min((W - 30) / 4, (H - 160) / 4, 90); return { s: s, x0: (W - 4 * s) / 2, y0: 78 }; }
    function cpos(k) { var L = lay(); return { x: L.x0 + (k % 4) * L.s + L.s / 2, y: L.y0 + ((k / 4) | 0) * L.s + L.s / 2 }; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { var p = [], k; for (k = 0; k < 16; k++) p.push(cpos(k)); return { st: st, lvl: lvl, sol: sol.slice(), giv: giv.slice(), cur: cur.slice(), pos: p, pend: pend }; },
      down: function (x, y) {
        if (menu()) return; if (pend > 0) return; var L = lay(), cx = Math.floor((x - L.x0) / L.s), cy = Math.floor((y - L.y0) / L.s);
        if (cx < 0 || cy < 0 || cx > 3 || cy > 3) return; var k = cy * 4 + cx; if (giv[k]) return;
        cur[k] = (cur[k] + 1) % 5; if (api.nota) api.nota(300 + cur[k] * 40, 0.04, 'square', 0.03);
        if (done()) { lvl++; pend = 0.9; if (api.nota) api.nota(520, 0.2, 'triangle', 0.07); }
      },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) {
        if (st !== 'play') return; t += dt;
        if (pend > 0) { pend -= dt; if (pend <= 0) { if (lvl >= NL) st = 'win'; else load(lvl); } }
        if (st === 'play' && t >= LIM) st = 'lose';
      },
      draw: function () {
        var L = lay(), k; bg('#2a2a30', '#0b0b0f');
        for (k = 0; k < 16; k++) {
          var x = L.x0 + (k % 4) * L.s, y = L.y0 + ((k / 4) | 0) * L.s, b = bad(k);
          g.fillStyle = giv[k] ? '#6a6f7a' : 'rgba(255,255,255,.08)'; rr(x + 3, y + 3, L.s - 6, L.s - 6, 10); g.fill();
          if (cur[k]) { g.fillStyle = giv[k] ? '#c8ccd6' : (b ? '#c05a4a' : '#9ab4d8'); g.beginPath(); g.arc(x + L.s / 2, y + L.s / 2, L.s * 0.32, 0, 6.2832); g.fill(); txt(String(cur[k]), x + L.s / 2, y + L.s / 2 + 1, L.s * 0.36, '#1a1a22'); }
        }
        g.strokeStyle = '#ffd88a'; g.lineWidth = 3; g.strokeRect(L.x0 + 2, L.y0 + 2, 4 * L.s - 4, 4 * L.s - 4); g.beginPath(); g.moveTo(L.x0 + 2 * L.s, L.y0); g.lineTo(L.x0 + 2 * L.s, L.y0 + 4 * L.s); g.moveTo(L.x0, L.y0 + 2 * L.s); g.lineTo(L.x0 + 4 * L.s, L.y0 + 2 * L.s); g.stroke();
        bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 60 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + Math.min(lvl + 1, NL) + '/' + NL, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };

  }
});
