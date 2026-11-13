/* Vinte e cinco navios — leve a frota de Eirik à Groenlândia. */
BTJogo.registrar({
  canvas: 'jogo-eirik',
  t: {
    pt: {
      titulo: 'Vinte e cinco navios',
      sub: 'Eirik leva uma frota de colonos rumo à Groenlândia. Arraste para guiar o navio da frente (ou use as setas): os outros seguem o rastro dele. Gelo e rochas afundam navios. Chegue com 14 ou mais.',
      toque: 'Toque para zarpar', navios: 'Navios', chegada: 'Groenlândia',
      perdeu: 'Navios demais se perderam', de_novo: 'Toque para tentar de novo',
      v1: 'Terra à vista!',
      v2: 'Segundo a Saga de Eirik, o Vermelho, partiram 25 navios da Islândia e 14 chegaram à Groenlândia. As rotas, o gelo e o tempo de travessia são invenção do jogo.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: 'Twenty-five ships',
      sub: 'Eirik leads a fleet of settlers toward Greenland. Drag to steer the front ship (or use the arrow keys): the others follow its wake. Ice and rocks sink ships. Arrive with 14 or more.',
      toque: 'Tap to set sail', navios: 'Ships', chegada: 'Greenland',
      perdeu: 'Too many ships were lost', de_novo: 'Tap to try again',
      v1: 'Land ahead!',
      v2: 'According to Eirik the Red\'s Saga, 25 ships set out from Iceland and 14 reached Greenland. The routes, the ice and the crossing time are made up for the game.',
      jogar: 'Tap to play again'
    },
    no: {
      titulo: 'Tjuefem skip',
      sub: 'Eirik fører en flåte med nybyggere mot Grønland. Dra for å styre skipet foran (eller bruk piltastene): de andre følger kjølvannet. Is og skjær senker skip. Kom fram med 14 eller flere.',
      toque: 'Trykk for å sette seil', navios: 'Skip', chegada: 'Grønland',
      perdeu: 'For mange skip gikk tapt', de_novo: 'Trykk for å prøve igjen',
      v1: 'Land i sikte!',
      v2: 'Ifølge sagaen om Eirik Raude la 25 skip ut fra Island, og 14 kom fram til Grønland. Rutene, isen og tiden over havet er diktet opp for spillet.',
      jogar: 'Trykk for å spille igjen'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt, TOTAL = 25, MIN = 14, DUR = 36;
    var st = 'menu', time = 0, lead = 0, tgt = 0, trail = [], trT = 0, ships = 0, obs = [], spawn = 0, kL = false, kR = false, wake = 0;
    function reset() { st = 'play'; time = 0; ships = TOTAL; lead = tgt = api.w / 2; trail = []; for (var i = 0; i < 90; i++) trail.push(lead); trT = 0; obs = []; spawn = 0.8; }
    function baseY() { return api.h * 0.16; }
    function shipX(j) { return trail[Math.min(trail.length - 1, j * 3)]; }
    function shipY(j) { return baseY() + j * Math.min(10, (api.h * 0.62) / TOTAL); }
    function drawShip(x, y, s) {
      g.save(); g.translate(x, y); g.scale(s, s);
      g.fillStyle = '#6b3e1f'; g.beginPath(); g.moveTo(-9, -3); g.lineTo(9, -3); g.lineTo(6, 8); g.lineTo(-6, 8); g.closePath(); g.fill();
      g.fillStyle = '#f3ecd2'; g.fillRect(-6, -12, 12, 9); g.fillStyle = '#b73a2e'; g.fillRect(-6, -12, 4, 9); g.fillRect(2, -12, 4, 9);
      g.restore();
    }
    return {
      pausar: function () {},
      dbg: function () { return { st: st, time: time, ships: ships, lead: lead, obs: obs, w: api.w, h: api.h, sy: shipY, sx: shipX }; },
      down: function (x) { if (st === 'menu' || st === 'lose') reset(); else if (st === 'win') st = 'menu'; else tgt = x; },
      move: function (x, y, premido) { if (st === 'play' && premido) tgt = x; },
      key: function (c, d) {
        if (c === 'ArrowLeft' || c === 'KeyA') kL = d; else if (c === 'ArrowRight' || c === 'KeyD') kR = d;
        else if (d && (c === 'Space' || c === 'Enter')) { if (st === 'menu' || st === 'lose') reset(); else if (st === 'win') st = 'menu'; }
      },
      update: function (dt) {
        wake += dt;
        if (st !== 'play') return;
        time += dt;
        if (kL) tgt -= 340 * dt; if (kR) tgt += 340 * dt; tgt = Math.max(24, Math.min(api.w - 24, tgt));
        var d = tgt - lead, m = 330 * dt; lead += Math.abs(d) < m ? d : (d > 0 ? m : -m);
        trT += dt; while (trT >= 0.03) { trT -= 0.03; trail.unshift(lead); if (trail.length > 140) trail.pop(); }
        if (time >= DUR) { st = ships >= MIN ? 'win' : 'lose'; return; }
        var v = 150 + time * 2.2; spawn -= dt;
        if (spawn <= 0) {
          spawn = (0.7 + Math.random() * 0.5) * (170 / v);
          var rock = Math.random() < 0.4;
          obs.push({ x: 40 + Math.random() * (api.w - 80), y: -40, r: rock ? 15 + Math.random() * 8 : 22 + Math.random() * 12, k: rock ? 'rock' : 'ice', left: 2 });
        }
        for (var i = obs.length - 1; i >= 0; i--) {
          var o = obs[i]; o.y += v * dt;
          if (o.y > api.h + 50) { obs.splice(i, 1); continue; }
          for (var j = ships - 1; j >= 0 && o.left > 0; j--) {
            if (Math.hypot(shipX(j) - o.x, shipY(j) - o.y) < o.r + 8) { ships--; o.left--; if (j < ships) { /* navio perdido some do rastro */ } }
          }
          if (o.left <= 0) obs.splice(i, 1);
        }
        if (ships < MIN) st = 'lose';
      },
      draw: function () {
        var W = api.w, H = api.h, i;
        var s = g.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#2c5c78'); s.addColorStop(1, '#0d2a3d'); g.fillStyle = s; g.fillRect(0, 0, W, H);
        g.strokeStyle = 'rgba(255,255,255,.12)'; g.lineWidth = 2;
        for (var k = 0; k < 9; k++) { g.beginPath(); for (var x = 0; x <= W; x += 14) { var y = ((k * 53 + wake * 40) % (H + 40)) - 20 + Math.sin((x + k * 30) / 40) * 4; if (x === 0) g.moveTo(x, y); else g.lineTo(x, y); } g.stroke(); }
        if (st !== 'menu' && DUR - time < 5) {
          var cy = H - (5 - (DUR - time)) / 5 * (H * 0.22);
          g.fillStyle = '#245c3c'; g.fillRect(0, cy, W, H - cy + 10); g.fillStyle = '#e9f4ff';
          for (i = 0; i < 7; i++) { g.beginPath(); g.moveTo(i * W / 6 - 40, cy + 6); g.lineTo(i * W / 6, cy - 26 - (i % 3) * 8); g.lineTo(i * W / 6 + 40, cy + 6); g.fill(); }
        }
        obs.forEach(function (o) {
          g.save(); g.translate(o.x, o.y);
          if (o.k === 'ice') { g.fillStyle = '#eaf6ff'; g.beginPath(); g.moveTo(-o.r, o.r * 0.5); g.lineTo(-o.r * 0.6, -o.r * 0.5); g.lineTo(-o.r * 0.1, -o.r); g.lineTo(o.r * 0.5, -o.r * 0.4); g.lineTo(o.r, o.r * 0.5); g.closePath(); g.fill(); g.fillStyle = '#b6d8ee'; g.beginPath(); g.moveTo(-o.r * 0.1, -o.r); g.lineTo(o.r * 0.5, -o.r * 0.4); g.lineTo(o.r, o.r * 0.5); g.lineTo(o.r * 0.1, o.r * 0.5); g.closePath(); g.fill(); }
          else { g.fillStyle = '#4c4f57'; g.beginPath(); g.moveTo(-o.r, o.r * 0.6); g.lineTo(-o.r * 0.7, -o.r * 0.3); g.lineTo(-o.r * 0.1, -o.r * 0.8); g.lineTo(o.r * 0.6, -o.r * 0.5); g.lineTo(o.r, o.r * 0.6); g.closePath(); g.fill(); g.fillStyle = '#6a6e78'; g.beginPath(); g.moveTo(-o.r * 0.1, -o.r * 0.8); g.lineTo(o.r * 0.6, -o.r * 0.5); g.lineTo(o.r * 0.2, 0); g.closePath(); g.fill(); }
          g.restore();
        });
        if (st !== 'menu') {
          for (i = ships - 1; i >= 0; i--) drawShip(shipX(i), shipY(i), i === 0 ? 1.5 : 1);
          txt(T.navios + ': ' + ships + '/' + TOTAL, 24, 34, 15, '#f3ecd2', 'left');
          txt('≥ ' + MIN, 24, 56, 13, ships > MIN + 2 ? '#c9b3f2' : '#ffb08a', 'left');
          var pw = Math.min(220, W - 48); g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(24, 68, pw, 7); g.fillStyle = '#9be3b4'; g.fillRect(24, 68, pw * Math.min(1, time / DUR), 7);
          txt(T.chegada, 24 + pw + 8, 76, 12, '#cfe', 'left');
        }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
