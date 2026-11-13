/* Os olhos de Glámr — golpeie só quando as nuvens cobrirem a lua. */
BTJogo.registrar({
  canvas: 'jogo-glamr',
  t: {
    pt: {
      titulo: 'Os olhos de Glámr',
      sub: 'Grettir enfrenta o morto-vivo Glámr numa noite de lua. Enquanto a lua brilha, o olhar de Glámr paralisa: não ataque. Toque para golpear só quando as nuvens a cobrirem. Acerte seis golpes.',
      toque: 'Toque para começar', golpes: 'Golpes', coragem: 'Coragem',
      perdeu: 'O olhar de Glámr venceu', de_novo: 'Toque para tentar de novo',
      v1: 'Glámr caiu!',
      v2: 'Na Saga de Grettir, Glámr tem um olhar que paralisa de medo, e a luta acontece numa noite de lua entre nuvens. A mecânica do jogo é invenção.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: "Glámr's eyes",
      sub: "Grettir faces the undead Glámr on a moonlit night. While the moon shines, Glámr's gaze paralyses: do not attack. Tap to strike only when the clouds cover it. Land six blows.",
      toque: 'Tap to start', golpes: 'Blows', coragem: 'Courage',
      perdeu: "Glámr's gaze won", de_novo: 'Tap to try again',
      v1: 'Glámr has fallen!',
      v2: "In Grettir's saga, Glámr has a gaze that freezes people with fear, and the fight takes place on a moonlit night among clouds. The game mechanic is made up.",
      jogar: 'Tap to play again'
    },
    no: {
      titulo: 'Glåms øyne',
      sub: 'Grette møter den vandøde Glåm en måneskinnsnatt. Mens månen skinner, lammer Glåms blikk: ikke angrip. Trykk for å slå bare når skyene dekker den. Land seks slag.',
      toque: 'Trykk for å starte', golpes: 'Slag', coragem: 'Mot',
      perdeu: 'Glåms blikk vant', de_novo: 'Trykk for å prøve igjen',
      v1: 'Glåm falt!',
      v2: 'I Grettes saga har Glåm et blikk som lammer av redsel, og kampen skjer en måneskinnsnatt mellom skyer. Spillmekanikken er diktet opp.',
      jogar: 'Trykk for å spille igjen'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt, META = 6;
    var st = 'menu', hits = 0, hp = 3, dark = false, ph = 0, dur = 0, dist = 0, hitDone = false, shake = 0, flash = 0;
    function reset() { st = 'play'; hits = 0; hp = 3; dark = false; ph = 0; dur = 2.2; dist = 0.2; hitDone = false; shake = 0; flash = 0; }
    function strike() {
      if (dark && ph > 0.18 && !hitDone) { hitDone = true; hits++; dist = Math.max(0, dist - 0.4); flash = 0.3; if (hits >= META) st = 'win'; }
      else if (!dark) { hp--; shake = 0.4; dist = Math.max(0.2, dist - 0.2); if (hp <= 0) st = 'lose'; }
    }
    function press() { if (st === 'menu' || st === 'lose') { reset(); return; } if (st === 'win') { st = 'menu'; return; } strike(); }
    return {
      pausar: function () {},
      dbg: function () { return { st: st, hits: hits, hp: hp, dark: dark, ph: ph, dist: dist }; },
      down: function () { press(); },
      key: function (c, d) { if (d && (c === 'Space' || c === 'Enter')) press(); },
      update: function (dt) {
        if (shake > 0) shake -= dt; if (flash > 0) flash -= dt;
        if (st !== 'play') return;
        ph += dt;
        if (ph >= dur) { dark = !dark; ph = 0; hitDone = false; dur = dark ? Math.max(0.9, 1.5 - hits * 0.08) : 1.6 + Math.random() * 1.6; }
        if (!dark) { dist += dt * 0.1; if (dist >= 1) { hp--; shake = 0.4; dist = 0.4; if (hp <= 0) st = 'lose'; } }
      },
      draw: function () {
        var W = api.w, H = api.h, i, ox = shake > 0 ? Math.sin(api.clock * 60) * 5 : 0;
        var s = g.createLinearGradient(0, 0, 0, H); s.addColorStop(0, dark ? '#05070d' : '#16254a'); s.addColorStop(1, '#0a0e18'); g.fillStyle = s; g.fillRect(0, 0, W, H);
        var mx = W * 0.72, my = H * 0.2;
        g.fillStyle = dark ? '#1c2438' : '#f1efd8'; g.beginPath(); g.arc(mx, my, 40, 0, 6.29); g.fill();
        g.fillStyle = dark ? '#0b0f1a' : '#a8a58c'; g.globalAlpha = 0.5;
        if (dark) { g.fillStyle = '#243049'; g.globalAlpha = 1; for (i = 0; i < 3; i++) { g.beginPath(); g.arc(mx - 50 + i * 40, my + (i % 2) * 14, 38, 0, 6.29); g.fill(); } }
        g.globalAlpha = 1;
        g.fillStyle = '#0d1620'; g.fillRect(0, H * 0.78, W, H * 0.22);
        var gx = W / 2 + ox - 60 + dist * 120 * 0 , gy = H * 0.78, sc = 1 + dist * 0.9;
        g.save(); g.translate(W / 2 + ox, gy); g.scale(sc, sc);
        g.fillStyle = '#2a3a4a'; g.fillRect(-24, -110, 48, 110); g.fillStyle = '#3d5260'; g.beginPath(); g.arc(0, -126, 22, 0, 6.29); g.fill();
        g.fillStyle = dark ? '#51606e' : '#d6ff6a'; g.beginPath(); g.arc(-8, -128, 4.5, 0, 6.29); g.arc(8, -128, 4.5, 0, 6.29); g.fill();
        g.restore();
        if (!dark) { g.fillStyle = 'rgba(214,255,106,.10)'; g.fillRect(0, 0, W, H); }
        if (flash > 0) { g.fillStyle = 'rgba(255,255,255,' + flash + ')'; g.fillRect(0, 0, W, H); }
        if (st !== 'menu') {
          txt(T.golpes + ': ' + hits + '/' + META, 24, 34, 15, '#f3ecd2', 'left');
          txt(T.coragem, 24, 56, 13, '#c9b3f2', 'left');
          for (i = 0; i < 3; i++) { g.fillStyle = i < hp ? '#e6554a' : 'rgba(255,255,255,.2)'; g.beginPath(); g.arc(98 + i * 20, 52, 7, 0, 6.29); g.fill(); }
          if (st === 'play') txt(dark ? '⚔' : '👁', W / 2, H * 0.1, 30, '#fff');
        }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
