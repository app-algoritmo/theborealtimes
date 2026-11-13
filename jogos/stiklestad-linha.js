/* Segure a linha em Stiklestad — resista até o sol escurecer. */
BTJogo.registrar({
  canvas: 'jogo-stiklestad',
  t: {
    pt: {
      titulo: 'Segure a linha em Stiklestad',
      sub: 'A linha do rei Olavo é empurrada pelo inimigo. Toque para empurrar de volta, mas cada empurrão gasta fôlego, que volta aos poucos. Guarde forças para as investidas. Aguente até o sol escurecer.',
      toque: 'Toque para começar', folego: 'Fôlego', linha: 'A linha', dia: 'Até o escurecer',
      perdeu: 'A linha se rompeu', de_novo: 'Toque para tentar de novo',
      v1: 'A linha resistiu!',
      v2: 'A batalha de Stiklestad, em 1030, custou a vida ao rei Olavo Haraldsson. As sagas dizem que o sol escureceu durante o combate; se foi um eclipse, os estudiosos discutem. O jogo é uma simplificação.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: 'Hold the line at Stiklestad',
      sub: "King Olaf's line is being pushed back by the enemy. Tap to push back, but each push costs breath, which returns slowly. Save your strength for the surges. Hold out until the sun darkens.",
      toque: 'Tap to start', folego: 'Breath', linha: 'The line', dia: 'Until dark',
      perdeu: 'The line broke', de_novo: 'Tap to try again',
      v1: 'The line held!',
      v2: "The battle of Stiklestad, in 1030, cost King Olaf Haraldsson his life. The sagas say the sun darkened during the fight; whether it was an eclipse, scholars debate. The game is a simplification.",
      jogar: 'Tap to play again'
    },
    no: {
      titulo: 'Hold linjen ved Stiklestad',
      sub: 'Kong Olavs linje blir presset tilbake av fienden. Trykk for å presse tilbake, men hvert press koster pust, som kommer sakte tilbake. Spar kreftene til angrepsbølgene. Hold ut til solen mørkner.',
      toque: 'Trykk for å starte', folego: 'Pust', linha: 'Linjen', dia: 'Til det mørkner',
      perdeu: 'Linjen brast', de_novo: 'Trykk for å prøve igjen',
      v1: 'Linjen holdt!',
      v2: 'Slaget ved Stiklestad i 1030 kostet kong Olav Haraldsson livet. Sagaene sier at solen mørknet under kampen; om det var en solformørkelse, diskuterer forskerne. Spillet er en forenkling.',
      jogar: 'Trykk for å spille igjen'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt, DUR = 30;
    var st = 'menu', time = 0, p = 0.35, sta = 1, surge = 0, nextS = 0, warn = 0, ex = 0;
    function reset() { st = 'play'; time = 0; p = 0.35; sta = 1; surge = 0; nextS = 4; warn = 0; ex = 0; }
    function push() { if (ex > 0) return; if (sta > 0.07) { sta -= 0.07; p = Math.max(0, p - 0.05); } else ex = 1.2; }
    function press() { if (st === 'menu' || st === 'lose') { reset(); return; } if (st === 'win') { st = 'menu'; return; } push(); }
    return {
      pausar: function () {},
      dbg: function () { return { st: st, time: time, p: p, sta: sta, surge: surge, warn: warn, ex: ex }; },
      down: function () { press(); },
      key: function (c, d) { if (d && (c === 'Space' || c === 'Enter')) press(); },
      update: function (dt) {
        if (st !== 'play') return;
        time += dt; if (ex > 0) ex -= dt; else sta = Math.min(1, sta + 0.2 * dt);
        nextS -= dt;
        if (nextS <= 0 && surge <= 0 && warn <= 0) warn = 0.8;
        if (warn > 0) { warn -= dt; if (warn <= 0) { surge = 1.6; nextS = 3.5 + Math.random() * 2; } }
        if (surge > 0) surge -= dt;
        p += (surge > 0 ? 0.28 : 0.085) * dt;
        if (p >= 1) { st = 'lose'; return; }
        if (time >= DUR) st = 'win';
      },
      draw: function () {
        var W = api.w, H = api.h, i, k = Math.min(1, time / DUR);
        var s = g.createLinearGradient(0, 0, 0, H);
        s.addColorStop(0, 'rgb(' + Math.round(120 - 105 * k) + ',' + Math.round(170 - 150 * k) + ',' + Math.round(210 - 170 * k) + ')'); s.addColorStop(1, '#3b4a32'); g.fillStyle = s; g.fillRect(0, 0, W, H);
        var sx = W * 0.8, sy = H * 0.14; g.fillStyle = 'rgb(' + Math.round(255 - 200 * k) + ',' + Math.round(225 - 190 * k) + ',' + Math.round(120 - 90 * k) + ')'; g.beginPath(); g.arc(sx, sy, 30, 0, 6.29); g.fill();
        if (k > 0.55) { g.fillStyle = 'rgba(10,10,20,' + Math.min(0.95, (k - 0.55) * 2.2) + ')'; g.beginPath(); g.arc(sx + 12 - (k - 0.55) * 20, sy, 30, 0, 6.29); g.fill(); }
        var lx = W * (0.18 + p * 0.64);
        g.fillStyle = '#2a3a22'; g.fillRect(0, H * 0.62, W, H * 0.38);
        for (i = 0; i < 5; i++) { g.fillStyle = '#5a7ab8'; g.fillRect(lx - 30 - i * 14, H * 0.62 + i * 20, 12, 38); g.fillStyle = '#d8b48a'; g.beginPath(); g.arc(lx - 24 - i * 14, H * 0.62 + i * 20 - 6, 7, 0, 6.29); g.fill(); }
        for (i = 0; i < 5; i++) { g.fillStyle = '#a8423a'; g.fillRect(lx + 20 + i * 14, H * 0.62 + i * 20, 12, 38); g.fillStyle = '#d8b48a'; g.beginPath(); g.arc(lx + 26 + i * 14, H * 0.62 + i * 20 - 6, 7, 0, 6.29); g.fill(); }
        if (warn > 0 || surge > 0) txt('⚠', W * 0.86, H * 0.5, 34, '#ffd88a');
        g.fillStyle = 'rgba(255,255,255,.2)'; g.fillRect(W * 0.18, H * 0.58, W * 0.64, 4); g.fillStyle = '#fff'; g.fillRect(lx - 3, H * 0.55, 6, 12);
        if (st !== 'menu') {
          var pw = Math.min(220, W - 48);
          txt(T.folego, 24, 34, 14, '#f3ecd2', 'left'); g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(24, 42, pw, 8); g.fillStyle = ex > 0 ? '#e6554a' : sta > 0.25 ? '#9be3b4' : '#ffb08a'; g.fillRect(24, 42, pw * sta, 8);
          txt(T.dia, 24, 72, 12, '#cfe', 'left'); g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(24, 78, pw, 6); g.fillStyle = '#ffd88a'; g.fillRect(24, 78, pw * k, 6);
        }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
