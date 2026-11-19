/* L'Anse aux Meadows — sondagem do terreno (invenção). */
BTJogo.registrar({
  canvas: 'jogo-lanse',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A sondagem em L'Anse aux Meadows",
    "sub": "O terreno está dividido em 49 quadrados e esconde 6 charcos. Toque num quadrado para sondá-lo. O número que aparece diz quantos dos oito vizinhos escondem um charco. O primeiro toque é sempre seguro. Sonde todos os quadrados sem charco; cair em um charco conta um erro, e o terceiro encerra a sondagem.",
    "perdeu": "Os charcos engoliram a sondagem",
    "v1": "Todo o terreno firme foi sondado!",
    "v2": "Helge e Anne Stine Ingstad escavaram L'Anse aux Meadows entre 1961 e 1968. Há restos de oito edifícios, e um estudo de 2021 apontou o ano de 1021 como o de uma atividade nórdica no local. Os charcos são invenção.",
    "h1": "Casas",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The survey at L'Anse aux Meadows",
    "sub": "The ground is divided into 49 squares and hides 6 bog pools. Tap a square to probe it. The number that appears says how many of the eight neighbours hide a pool. The first tap is always safe. Probe every square without a pool; hitting a pool counts as a mistake, and the third one ends the survey.",
    "perdeu": "The bog pools swallowed the survey",
    "v1": "All the firm ground has been probed!",
    "v2": "Helge and Anne Stine Ingstad excavated L'Anse aux Meadows between 1961 and 1968. There are remains of eight buildings, and a 2021 study pointed to the year 1021 as one of Norse activity at the site. The pools are invented.",
    "h1": "Squares",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Undersøkelsen på L'Anse aux Meadows",
    "sub": "Terrenget er delt i 49 ruter og skjuler 6 myrhull. Trykk på en rute for å undersøke den. Tallet som dukker opp, sier hvor mange av de åtte naboene som skjuler et myrhull. Det første trykket er alltid trygt. Undersøk alle rutene uten myrhull; havner du i et myrhull, telles det som en feil, og den tredje avslutter undersøkelsen.",
    "perdeu": "Myrhullene slukte undersøkelsen",
    "v1": "All fast mark er undersøkt!",
    "v2": "Helge og Anne Stine Ingstad gravde ut L'Anse aux Meadows mellom 1961 og 1968. Det finnes rester av åtte bygninger, og en studie fra 2021 pekte på året 1021 som et år med norrøn aktivitet på stedet. Myrhullene er oppfunnet.",
    "h1": "Ruter",
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
    var N = 7, M = 6, MAXE = 3, TOTAL = N * N - M;
    var mine = [], rev = [], hit = [], first = true, err = 0, opened = 0;
    function nb(i) { var r = Math.floor(i / N), c = i % N, o = []; for (var a = -1; a <= 1; a++) for (var b = -1; b <= 1; b++) { if (!a && !b) continue; var rr2 = r + a, cc = c + b; if (rr2 >= 0 && rr2 < N && cc >= 0 && cc < N) o.push(rr2 * N + cc); } return o; }
    function cnt(i) { return nb(i).filter(function (z) { return mine[z]; }).length; }
    function reset() { mine = []; rev = []; hit = []; for (var i = 0; i < N * N; i++) { mine.push(0); rev.push(0); hit.push(0); } first = true; err = 0; opened = 0; st = 'play'; }
    function place(i) { var bad = nb(i).concat([i]), k = 0; while (k < M) { var z = Math.floor(Math.random() * N * N); if (bad.indexOf(z) < 0 && !mine[z]) { mine[z] = 1; k++; } } }
    function open(i) { var q = [i]; while (q.length) { var j = q.pop(); if (rev[j] || mine[j]) continue; rev[j] = 1; opened++; if (cnt(j) === 0) nb(j).forEach(function (z) { q.push(z); }); } }
    function tap(i) {
      if (st !== 'play' || rev[i] || hit[i]) return;
      if (first) { place(i); first = false; }
      if (mine[i]) { hit[i] = 1; err++; if (api.nota) api.nota(110, 0.25, 'sawtooth', 0.06); if (err >= MAXE) st = 'lose'; return; }
      open(i); if (api.nota) api.nota(360, 0.08, 'triangle', 0.05); if (opened >= TOTAL) st = 'win';
    }
    function lay() { var W = api.w, H = api.h, gs = Math.max(140, Math.min(W - 30, H - 110, 420)); return { gs: gs, cs: gs / N, x0: (W - gs) / 2, y0: 70 }; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, N: N, mines: first ? [] : mine.slice(), rev: rev.slice(), hit: hit.slice(), err: err, opened: opened, total: TOTAL, cs: L.cs, pos: mine.map(function (z, i) { return { x: L.x0 + (i % N + 0.5) * L.cs, y: L.y0 + (Math.floor(i / N) + 0.5) * L.cs }; }) }; },
      down: function (x, y) { if (menu()) return; var L = lay(), c = Math.floor((x - L.x0) / L.cs), r = Math.floor((y - L.y0) / L.cs); if (c >= 0 && c < N && r >= 0 && r < N) tap(r * N + c); },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function () {},
      draw: function () {
        var L = lay(), i, NC = ['', '#5fb4ff', '#6fd08a', '#ffd23e', '#ff9a5a', '#ff6a5a', '#d07af0', '#fff', '#fff']; bg('#10202a', '#050a0d');
        for (i = 0; i < N * N; i++) {
          var x = L.x0 + (i % N) * L.cs, y = L.y0 + Math.floor(i / N) * L.cs, s = L.cs - 3;
          if (rev[i]) { g.fillStyle = '#26404a'; rr(x + 1.5, y + 1.5, s, s, 6); g.fill(); var c = cnt(i); if (c) txt(String(c), x + L.cs / 2, y + L.cs / 2 + 7, Math.min(22, L.cs * 0.5), NC[c]); }
          else if (hit[i]) { g.fillStyle = '#5a1a16'; rr(x + 1.5, y + 1.5, s, s, 6); g.fill(); txt('×', x + L.cs / 2, y + L.cs / 2 + 8, Math.min(26, L.cs * 0.6), '#ff9a8d'); }
          else { g.fillStyle = st === 'lose' && mine[i] ? '#3a2a26' : '#4a7a6a'; rr(x + 1.5, y + 1.5, s, s, 6); g.fill(); }
        }
        hud(T.h1 + ' ' + opened + '/' + TOTAL, T.h2 + ' ' + err + '/' + MAXE, true);
        fim(st);
      }
    };

  }
});
