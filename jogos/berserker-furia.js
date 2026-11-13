/* Fúria de berserker — acumule a fúria certa antes do golpe. */
BTJogo.registrar({
  canvas: 'jogo-berserker',
  t: {
    pt: {
      titulo: 'Fúria de berserker',
      sub: 'Segure o dedo (ou a barra de espaço) para a fúria subir; solte para ela descer. Quando o inimigo chegar ao alcance, a fúria precisa estar na faixa vermelha: pouca, e você é ferido; demais, e a fúria queima você. Derrube 12 inimigos.',
      toque: 'Toque para começar', derrotas: 'Derrotados', vidas: 'Vidas', furia: 'Fúria',
      perdeu: 'A fúria te venceu', de_novo: 'Toque para tentar de novo',
      v1: 'A fúria passou!',
      v2: 'As sagas descrevem berserkers que uivavam, mordiam os escudos e não sentiam o ferro. Os historiadores discutem o que isso era de fato; o medidor de fúria é invenção do jogo.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: 'Berserker fury',
      sub: 'Hold your finger (or the space bar) to raise the fury; release to let it fall. When the enemy comes into range, the fury must be in the red band: too little and you are wounded; too much and the fury burns you. Defeat 12 enemies.',
      toque: 'Tap to start', derrotas: 'Defeated', vidas: 'Lives', furia: 'Fury',
      perdeu: 'The fury beat you', de_novo: 'Tap to try again',
      v1: 'The fury has passed!',
      v2: 'The sagas describe berserkers who howled, bit their shields and felt no iron. Historians debate what that really was; the fury gauge is made up for the game.',
      jogar: 'Tap to play again'
    },
    no: {
      titulo: 'Berserkens raseri',
      sub: 'Hold fingeren (eller mellomromstasten) inne for å få raseriet til å stige; slipp for å la det synke. Når fienden kommer innen rekkevidde, må raseriet være i det røde feltet: for lite, og du blir såret; for mye, og raseriet brenner deg. Fell 12 fiender.',
      toque: 'Trykk for å starte', derrotas: 'Felt', vidas: 'Liv', furia: 'Raseri',
      perdeu: 'Raseriet slo deg', de_novo: 'Trykk for å prøve igjen',
      v1: 'Raseriet har lagt seg!',
      v2: 'Sagaene beskriver berserker som uler, biter i skjoldene og ikke kjenner jern. Historikere diskuterer hva det egentlig var; raserimåleren er diktet opp for spillet.',
      jogar: 'Trykk for å spille igjen'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt, META = 12, LO = 60, HI = 88;
    var st = 'menu', fury = 0, hold = false, hp = 3, kills = 0, foe = null, wait = 0, flash = 0, hurt = 0, puffs = [];
    function reset() { st = 'play'; fury = 0; hold = false; hp = 3; kills = 0; foe = null; wait = 1; flash = 0; hurt = 0; puffs = []; }
    function hx() { return api.w * 0.3; }
    function gy() { return api.h * 0.62; }
    function dmg() { hp--; hurt = 0.4; if (hp <= 0) st = 'lose'; }
    function press(d) { if (st === 'menu' || st === 'lose') { if (d) reset(); return; } if (st === 'win') { if (d) st = 'menu'; return; } hold = d; }
    return {
      pausar: function () { hold = false; },
      dbg: function () { return { st: st, fury: fury, hp: hp, kills: kills, foe: foe, LO: LO, HI: HI, reach: reach() }; },
      down: function () { press(true); }, up: function () { press(false); },
      key: function (c, d) { if (c === 'Space' || c === 'Enter' || c === 'ArrowUp') press(d); },
      update: function (dt) {
        if (hurt > 0) hurt -= dt; if (flash > 0) flash -= dt;
        puffs.forEach(function (p) { p.t -= dt; }); puffs = puffs.filter(function (p) { return p.t > 0; });
        if (st !== 'play') return;
        fury = Math.max(0, Math.min(100, fury + (hold ? 52 : -46) * dt));
        if (fury >= 100) { fury = 0; hold = false; dmg(); flash = 0.3; }
        if (!foe) { wait -= dt; if (wait <= 0) foe = { x: api.w + 40, sp: 150 + kills * 6 }; }
        else {
          foe.x -= foe.sp * dt;
          if (foe.x - hx() < 70) {
            if (fury >= LO && fury <= HI) { kills++; flash = 0.2; puffs.push({ x: foe.x, y: gy() - 40, t: 0.4 }); if (kills >= META) st = 'win'; }
            else dmg();
            foe = null; wait = 0.9;
          }
        }
      },
      draw: function () {
        var W = api.w, H = api.h, b = gy(), x = hx(), i;
        var s = g.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#1c2a24'); s.addColorStop(1, '#0b130f'); g.fillStyle = s; g.fillRect(0, 0, W, H);
        g.fillStyle = '#10201a'; for (i = 0; i < 9; i++) { var tx = i * W / 8; g.beginPath(); g.moveTo(tx - 30, b); g.lineTo(tx, b - 160 - (i % 3) * 30); g.lineTo(tx + 30, b); g.fill(); }
        g.fillStyle = '#1a1f1a'; g.fillRect(0, b, W, H - b);
        var rage = fury / 100, inz = fury >= LO && fury <= HI;
        if (rage > 0.05) { g.fillStyle = 'rgba(220,40,20,' + (rage * 0.35) + ')'; g.fillRect(0, 0, W, H); }
        var sh = rage * 3; g.save(); g.translate(x + (Math.random() - 0.5) * sh, b + (Math.random() - 0.5) * sh);
        g.fillStyle = hurt > 0 ? '#fff' : '#d8b48a'; g.beginPath(); g.arc(0, -56, 10, 0, 6.29); g.fill();
        g.fillStyle = '#6a3a1a'; g.fillRect(-10, -46, 20, 30); g.fillStyle = '#3a2a1a'; g.fillRect(-9, -16, 7, 16); g.fillRect(2, -16, 7, 16);
        g.fillStyle = '#7a4a22'; g.beginPath(); g.moveTo(-12, -58); g.lineTo(-4, -78 - rage * 10); g.lineTo(4, -60); g.lineTo(12, -80 - rage * 10); g.lineTo(12, -58); g.fill();
        g.fillStyle = inz ? '#ffef6a' : '#fff'; g.fillRect(-5, -58, 3, 3); g.fillRect(3, -58, 3, 3);
        g.strokeStyle = '#cfd3da'; g.lineWidth = 4; g.beginPath(); g.moveTo(8, -34); g.lineTo(8 + 30 + rage * 8, -50 - rage * 14); g.stroke();
        g.restore();
        if (foe) { g.fillStyle = '#8a8f98'; g.fillRect(foe.x - 8, b - 44, 16, 28); g.fillStyle = '#d8b48a'; g.beginPath(); g.arc(foe.x, b - 52, 8, 0, 6.29); g.fill(); g.fillStyle = '#6a6e78'; g.beginPath(); g.arc(foe.x, b - 54, 8, Math.PI, 0); g.fill(); g.fillStyle = '#3a2a1a'; g.fillRect(foe.x - 7, b - 16, 5, 16); g.fillRect(foe.x + 2, b - 16, 5, 16); g.strokeStyle = '#cfd3da'; g.lineWidth = 3; g.beginPath(); g.moveTo(foe.x - 8, b - 36); g.lineTo(foe.x - 26, b - 52); g.stroke(); }
        puffs.forEach(function (p) { g.fillStyle = 'rgba(255,230,180,' + p.t + ')'; g.beginPath(); g.arc(p.x, p.y, 28 * (1 - p.t), 0, 6.29); g.fill(); });
        if (flash > 0) { g.fillStyle = 'rgba(255,255,255,' + flash + ')'; g.fillRect(0, 0, W, H); }
        if (st !== 'menu') {
          var gw = Math.min(260, W - 48), gx = 24, gyy = 82;
          g.fillStyle = 'rgba(255,255,255,.15)'; g.fillRect(gx, gyy, gw, 16);
          g.fillStyle = 'rgba(220,50,40,.55)'; g.fillRect(gx + gw * LO / 100, gyy, gw * (HI - LO) / 100, 16);
          g.fillStyle = inz ? '#ffe36a' : '#f3ecd2'; g.fillRect(gx, gyy + 2, gw * fury / 100, 12);
          g.strokeStyle = '#fff'; g.lineWidth = 2; g.strokeRect(gx, gyy, gw, 16);
          txt(T.furia, gx, gyy - 8, 13, '#f3ecd2', 'left');
          txt(T.derrotas + ': ' + kills + '/' + META, 24, 34, 15, '#f3ecd2', 'left');
          txt(T.vidas, 24, 58, 15, '#f3ecd2', 'left');
          for (i = 0; i < 3; i++) { g.fillStyle = i < hp ? '#e6554a' : 'rgba(255,255,255,.2)'; g.beginPath(); g.arc(84 + i * 22, 53, 8, 0, 6.29); g.fill(); }
        }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
    function reach() { return hx() + 70; }
  }
});
