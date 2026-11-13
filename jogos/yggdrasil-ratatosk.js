/* Ratatosk e a árvore — suba pelos galhos levando recados. */
BTJogo.registrar({
  canvas: 'jogo-ratatosk',
  t: {
    pt: {
      titulo: 'Ratatosk e a árvore',
      sub: 'O esquilo Ratatosk leva as ofensas da águia ao dragão Níðhöggr, e de volta. Toque à esquerda ou à direita (ou use as setas) para trocar de galho. Pegue 8 recados e desvie dos galhos podres.',
      toque: 'Toque para começar', recados: 'Recados', vidas: 'Fôlego',
      perdeu: 'Você caiu da árvore', de_novo: 'Toque para tentar de novo',
      v1: 'Recados entregues!',
      v2: 'No Grímnismál e em Snorri, o esquilo Ratatosk corre pela árvore Yggdrasil levando ofensas entre a águia e o dragão Níðhöggr. Os galhos podres e a contagem de recados são invenção do jogo.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: 'Ratatoskr and the tree',
      sub: 'The squirrel Ratatoskr carries the eagle\'s insults to the dragon Níðhöggr, and back. Tap left or right (or use the arrow keys) to change branches. Collect 8 messages and dodge the rotten branches.',
      toque: 'Tap to start', recados: 'Messages', vidas: 'Breath',
      perdeu: 'You fell from the tree', de_novo: 'Tap to try again',
      v1: 'Messages delivered!',
      v2: 'In the Grímnismál and in Snorri, the squirrel Ratatoskr runs along the tree Yggdrasil carrying insults between the eagle and the dragon Níðhöggr. The rotten branches and the message count are made up for the game.',
      jogar: 'Tap to play again'
    },
    no: {
      titulo: 'Ratatosk og treet',
      sub: 'Ekornet Ratatosk bærer ørnens fornærmelser til dragen Nidhogg, og tilbake igjen. Trykk til venstre eller høyre (eller bruk piltastene) for å bytte gren. Samle 8 beskjeder og styr unna de råtne greinene.',
      toque: 'Trykk for å starte', recados: 'Beskjeder', vidas: 'Pust',
      perdeu: 'Du falt ned fra treet', de_novo: 'Trykk for å prøve igjen',
      v1: 'Beskjedene er levert!',
      v2: 'I Grimnismål og hos Snorre løper ekornet Ratatosk langs treet Yggdrasil og bærer fornærmelser mellom ørnen og dragen Nidhogg. De råtne greinene og tellingen av beskjeder er diktet opp for spillet.',
      jogar: 'Trykk for å spille igjen'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt, META = 8;
    var st = 'menu', lane = 1, tx = 1, px = 0, hp = 3, got = 0, inv = 0, spawn = 0, things = [], dist = 0;
    function reset() { st = 'play'; lane = 1; tx = 1; px = 0; hp = 3; got = 0; inv = 0; spawn = 0.6; things = []; dist = 0; }
    function LW() { return Math.min(112, api.w / 3.3); }
    function lx(l) { return api.w / 2 + (l - 1) * LW(); }
    function py() { return api.h * 0.74; }
    function go(d) { if (st === 'play') lane = Math.max(0, Math.min(2, lane + d)); }
    function leaf(o) {
      g.save(); g.translate(lx(o.l), o.y);
      g.fillStyle = '#ffe08a'; g.beginPath(); g.moveTo(-16, 0); g.lineTo(16, 0); g.lineTo(16, 20); g.lineTo(-16, 20); g.closePath(); g.fill();
      g.fillStyle = '#c89a3a'; g.fillRect(-16, 16, 32, 4);
      g.fillStyle = '#4a2f12'; g.fillRect(-10, 5, 20, 2); g.fillRect(-10, 10, 14, 2);
      g.restore();
    }
    function rot(o) {
      g.save(); g.translate(lx(o.l), o.y);
      g.fillStyle = '#4a2a1a'; g.fillRect(-34, -8, 68, 16);
      g.fillStyle = '#2e1a10'; g.fillRect(-34, 2, 68, 6);
      g.fillStyle = '#7a3a8a'; g.beginPath(); g.arc(-18, -8, 6, 0, 6.29); g.fill(); g.beginPath(); g.arc(14, -9, 5, 0, 6.29); g.fill();
      g.strokeStyle = '#a5d06a'; g.lineWidth = 2; g.beginPath(); g.moveTo(-34, 4); g.lineTo(-44, 14); g.moveTo(34, 4); g.lineTo(44, 12); g.stroke();
      g.restore();
    }
    function squirrel() {
      if (inv > 0 && Math.floor(api.clock * 14) % 2) return;
      var x = px, y = py(), b = Math.sin(api.clock * 14) * 3;
      g.save(); g.translate(x, y + b);
      g.fillStyle = '#c4622d'; g.beginPath(); g.ellipse(0, 0, 14, 20, 0, 0, 6.29); g.fill();
      g.beginPath(); g.ellipse(-16, -6, 9, 22, -0.5, 0, 6.29); g.fill();
      g.fillStyle = '#f1d4b0'; g.beginPath(); g.ellipse(2, 4, 7, 12, 0, 0, 6.29); g.fill();
      g.fillStyle = '#c4622d'; g.beginPath(); g.arc(4, -24, 10, 0, 6.29); g.fill();
      g.beginPath(); g.moveTo(-1, -31); g.lineTo(0, -42); g.lineTo(6, -32); g.fill(); g.beginPath(); g.moveTo(8, -31); g.lineTo(12, -41); g.lineTo(14, -29); g.fill();
      g.fillStyle = '#000'; g.beginPath(); g.arc(9, -25, 2, 0, 6.29); g.fill();
      g.restore();
    }
    return {
      pausar: function () {},
      dbg: function () { return { st: st, got: got, hp: hp, lane: lane, things: things, dist: dist, px: px }; },
      down: function (x) { if (st === 'menu' || st === 'lose') reset(); else if (st === 'win') st = 'menu'; else go(x < api.w / 2 ? -1 : 1); },
      key: function (c, d) {
        if (!d) return;
        if (c === 'ArrowLeft' || c === 'KeyA') go(-1); else if (c === 'ArrowRight' || c === 'KeyD') go(1);
        else if ((c === 'Space' || c === 'Enter')) { if (st === 'menu' || st === 'lose') reset(); else if (st === 'win') st = 'menu'; }
      },
      update: function (dt) {
        px += (lx(lane) - px) * Math.min(1, dt * 14);
        if (st !== 'play') { if (st === 'menu') px = lx(1); return; }
        if (inv > 0) inv -= dt;
        var v = 230 + got * 14; dist += v * dt; spawn -= dt;
        if (spawn <= 0) { spawn = (0.62 + Math.random() * 0.4) * (230 / v); var l = Math.floor(Math.random() * 3); things.push({ k: Math.random() < 0.42 ? 'msg' : 'rot', l: l, y: -40 }); }
        for (var i = things.length - 1; i >= 0; i--) {
          var o = things[i]; o.y += v * dt;
          if (o.y > api.h + 60) { things.splice(i, 1); continue; }
          if (o.l === lane && Math.abs(o.y - py()) < 26) {
            if (o.k === 'msg') { got++; things.splice(i, 1); if (got >= META) st = 'win'; }
            else if (inv <= 0) { hp--; inv = 1.1; things.splice(i, 1); if (hp <= 0) st = 'lose'; }
          }
        }
      },
      draw: function () {
        var W = api.w, H = api.h, i;
        var s = g.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#16314a'); s.addColorStop(1, '#0b1a24'); g.fillStyle = s; g.fillRect(0, 0, W, H);
        g.fillStyle = 'rgba(255,255,255,.6)'; for (i = 0; i < 24; i++) g.fillRect((i * 83) % W, (i * 61 + dist * 0.05) % H, 2, 2);
        var tw = LW() * 3 + 40; g.fillStyle = '#3a2a1a'; g.fillRect(W / 2 - tw / 2, 0, tw, H);
        g.fillStyle = 'rgba(0,0,0,.28)'; for (i = 0; i < 12; i++) g.fillRect(W / 2 - tw / 2 + 6 + ((i * 37) % (tw - 12)), ((i * 71 + dist * 0.6) % (H + 40)) - 20, 6, 46);
        for (i = 0; i < 3; i++) { g.fillStyle = '#5a4128'; g.fillRect(lx(i) - 30, 0, 60, H); g.fillStyle = 'rgba(255,255,255,.05)'; g.fillRect(lx(i) - 26, 0, 8, H); }
        things.forEach(function (o) { (o.k === 'msg' ? leaf : rot)(o); });
        if (st !== 'menu') {
          squirrel();
          txt(T.recados + ': ' + got + '/' + META, 24, 34, 15, '#f3ecd2', 'left');
          txt(T.vidas, 24, 60, 15, '#f3ecd2', 'left');
          for (i = 0; i < 3; i++) { g.fillStyle = i < hp ? '#e6554a' : 'rgba(255,255,255,.2)'; g.beginPath(); g.arc(88 + i * 22, 55, 8, 0, 6.29); g.fill(); }
        }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
