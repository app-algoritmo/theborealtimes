/* Os treze Jólasveinar — proteja a despensa durante as treze noites. */
BTJogo.registrar({
  canvas: 'jogo-gryla',
  t: {
    pt: {
      titulo: 'Os treze Jólasveinar',
      sub: 'Treze noites, um filho de Grýla por noite. Cada um tenta levar o seu alvo favorito: toque no item antes que o anel se feche. Se cinco coisas forem levadas, a despensa está perdida.',
      toque: 'Toque para começar', noite: 'Noite', levados: 'Levados',
      perdeu: 'A despensa foi esvaziada', de_novo: 'Toque para tentar de novo',
      v1: 'Natal salvo!',
      v2: 'Segundo o folclore islandês, os treze Jólasveinar chegam um por noite a partir de 12 de dezembro. As listas variam e o jogo é uma invenção.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: 'The thirteen Yule Lads',
      sub: "Thirteen nights, one of Grýla's sons each night. Each tries to take his favourite target: tap the item before the ring closes. If five things are taken, the pantry is lost.",
      toque: 'Tap to start', noite: 'Night', levados: 'Taken',
      perdeu: 'The pantry was emptied', de_novo: 'Tap to try again',
      v1: 'Christmas saved!',
      v2: 'According to Icelandic folklore, the thirteen Yule Lads arrive one a night from 12 December. The lists vary and the game is made up.',
      jogar: 'Tap to play again'
    },
    no: {
      titulo: 'De tretten julegutta',
      sub: 'Tretten netter, én av Grýlas sønner hver natt. Hver prøver å ta sitt favorittmål: trykk på tingen før ringen lukker seg. Blir fem ting tatt, er spiskammeret tapt.',
      toque: 'Trykk for å starte', noite: 'Natt', levados: 'Tatt',
      perdeu: 'Spiskammeret ble tømt', de_novo: 'Trykk for å prøve igjen',
      v1: 'Julen er reddet!',
      v2: 'Ifølge islandsk folketro kommer de tretten juleguttene én hver natt fra 12. desember. Listene varierer, og spillet er diktet opp.',
      jogar: 'Trykk for å spille igjen'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt, N = 13, MAXS = 5;
    var LADS = [['Stekkjastaur', '🐑'], ['Giljagaur', '🥛'], ['Stúfur', '🍳'], ['Þvörusleikir', '🥄'], ['Pottaskefill', '🍲'], ['Askasleikir', '🥣'], ['Hurðaskellir', '🚪'], ['Skyrgámur', '🍶'], ['Bjúgnakrækir', '🌭'], ['Gluggagægir', '👀'], ['Gáttaþefur', '🍞'], ['Ketkrókur', '🥩'], ['Kertasníkir', '🕯️']];
    var st = 'menu', night = 0, stolen = 0, raids = [], todo = 0, nxt = 0, gap = 0, flash = 0, banner = 0;
    function reset() { st = 'play'; night = 0; stolen = 0; raids = []; startNight(); }
    function startNight() { night++; todo = 3 + (night > 6 ? 1 : 0) + (night > 10 ? 1 : 0); nxt = 1.2; banner = 1.6; }
    function life() { return Math.max(0.85, 1.9 - night * 0.08); }
    function geo(i) {
      var w = api.w, h = api.h, cols = w >= h * 1.1 ? 3 : 2, rows = 6 / cols, cw = Math.min((w - 40) / cols, (h - 170) / rows, 150);
      return { x: w / 2 + ((i % cols) - (cols - 1) / 2) * cw, y: h / 2 + 20 + (Math.floor(i / cols) - (rows - 1) / 2) * cw, r: cw * 0.4 };
    }
    function spawn() {
      var used = raids.map(function (r) { return r.i; }), free = [0, 1, 2, 3, 4, 5].filter(function (i) { return used.indexOf(i) < 0; });
      if (!free.length) return; todo--;
      raids.push({ i: free[Math.floor(Math.random() * free.length)], t: life(), max: life() });
    }
    function tocar(x, y) {
      if (st === 'menu' || st === 'lose') { reset(); return; }
      if (st === 'win') { st = 'menu'; return; }
      for (var k = 0; k < raids.length; k++) { var G = geo(raids[k].i); if (Math.hypot(x - G.x, y - G.y) < G.r * 1.3) { raids.splice(k, 1); flash = 0.15; return; } }
    }
    return {
      pausar: function () {},
      dbg: function () { return { st: st, night: night, stolen: stolen, raids: raids.map(function (r) { var G = geo(r.i); return { x: G.x, y: G.y, t: r.t }; }) }; },
      down: function (x, y) { tocar(x, y); },
      key: function (c, d) { if (d && (c === 'Space' || c === 'Enter') && st !== 'play') tocar(0, 0); },
      update: function (dt) {
        if (flash > 0) flash -= dt; if (banner > 0) banner -= dt;
        if (st !== 'play') return;
        nxt -= dt;
        if (todo > 0 && nxt <= 0 && raids.length < (night > 6 ? 2 : 1)) { spawn(); nxt = night > 6 ? life() * 0.5 : 0.5 + life() * 0.2; }
        for (var i = raids.length - 1; i >= 0; i--) { raids[i].t -= dt; if (raids[i].t <= 0) { raids.splice(i, 1); stolen++; flash = 0.2; if (stolen >= MAXS) { st = 'lose'; return; } } }
        if (todo <= 0 && !raids.length) { if (night >= N) st = 'win'; else startNight(); }
      },
      draw: function () {
        var W = api.w, H = api.h, i, lad = LADS[Math.max(0, night - 1)] || LADS[0];
        var s = g.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#1a2a44'); s.addColorStop(1, '#2d1f1a'); g.fillStyle = s; g.fillRect(0, 0, W, H);
        g.fillStyle = 'rgba(255,255,255,.14)'; for (i = 0; i < 24; i++) g.fillRect((i * 83 + api.clock * 8) % W, (i * 47 + api.clock * 14) % H, 2, 2);
        for (i = 0; i < 6; i++) { var G = geo(i); g.fillStyle = '#4a3322'; g.beginPath(); g.arc(G.x, G.y, G.r * 1.1, 0, 6.29); g.fill(); g.fillStyle = '#6b4a2e'; g.beginPath(); g.arc(G.x, G.y, G.r, 0, 6.29); g.fill(); }
        raids.forEach(function (r) {
          var G = geo(r.i), k = r.t / r.max;
          g.strokeStyle = k > 0.4 ? '#ffd88a' : '#ff6a5a'; g.lineWidth = 6; g.beginPath(); g.arc(G.x, G.y, G.r * 1.2, -1.57, -1.57 + 6.29 * k); g.stroke();
          txt(lad[1], G.x, G.y + 11, 34, '#fff');
        });
        if (flash > 0) { g.fillStyle = 'rgba(255,255,255,' + flash + ')'; g.fillRect(0, 0, W, H); }
        if (st !== 'menu') {
          txt(T.noite + ' ' + night + '/' + N, 24, 34, 15, '#f3ecd2', 'left');
          txt(T.levados + ': ' + stolen + '/' + MAXS, 24, 56, 13, stolen ? '#ffb08a' : '#c9b3f2', 'left');
          txt(lad[1] + ' ' + lad[0], W / 2, H * 0.1 + 34, banner > 0 ? 24 : 17, '#ffd88a');
        }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
