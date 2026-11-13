/* Os três bodes Bruse — corra pela ponte e pule os buracos e as mãos do troll. */
BTJogo.registrar({
  canvas: 'jogo-bodes',
  t: {
    pt: {
      titulo: 'Os três bodes Bruse', sub: 'Toque (ou espaço) para pular. Atravesse a ponte com os três bodes, do menor ao maior.',
      toque: 'Toque para começar', vidas: 'Vidas',
      etapas: ['O menor dos bodes', 'O bode do meio', 'O grande bode Bruse'],
      perdeu: 'O troll ficou com a ponte', de_novo: 'Toque para tentar de novo',
      v1: 'O grande bode jogou o troll no rio!',
      v2: 'Os três bodes chegaram à pastagem e engordaram. No conto de Asbjørnsen e Moe, a história termina assim: “Snipp, snapp, snute, så er eventyret ute.” As corridas pela ponte são invenção do jogo.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: 'The Three Billy Goats Bruse', sub: 'Tap (or press space) to jump. Cross the bridge with all three goats, smallest to biggest.',
      toque: 'Tap to start', vidas: 'Lives',
      etapas: ['The smallest goat', 'The middle goat', 'The great goat Bruse'],
      perdeu: 'The troll kept the bridge', de_novo: 'Tap to try again',
      v1: 'The great goat threw the troll into the river!',
      v2: 'The three goats reached the pasture and grew fat. In the tale collected by Asbjørnsen and Moe it ends: “Snipp, snapp, snute, så er eventyret ute.” The bridge run is made up for the game.',
      jogar: 'Tap to play again'
    },
    no: {
      titulo: 'De tre bukkene Bruse', sub: 'Trykk (eller mellomrom) for å hoppe. Kryss brua med alle tre bukkene, fra minst til størst.',
      toque: 'Trykk for å starte', vidas: 'Liv',
      etapas: ['Den minste bukken', 'Den mellomste bukken', 'Den store bukken Bruse'],
      perdeu: 'Trollet beholdt brua', de_novo: 'Trykk for å prøve igjen',
      v1: 'Den store bukken kastet trollet i elva!',
      v2: 'De tre bukkene nådde setra og ble tjukke. I eventyret samlet av Asbjørnsen og Moe slutter det slik: «Snipp, snapp, snute, så er eventyret ute.» Brueløpet er diktet opp for spillet.',
      jogar: 'Trykk for å spille igjen'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt, LEG = 16;
    var st = 'menu', time = 0, vidas = 3, inv = 0, leg = 0, banner = 0;
    var gy = 0, vy = 0, noChao = true, obs = [], dist = 0, prox = 400, scroll = 0, GX = 120;
    var SZ = [0.7, 1.0, 1.4], JV = [-600, -650, -690], SP = [240, 285, 330];
    function ground() { return api.h * 0.64; }
    function start() { st = 'play'; time = 0; vidas = 3; inv = 0; leg = 0; banner = 3; obs = []; dist = 0; prox = 500; gy = ground(); vy = 0; noChao = true; }
    function pula() { if (st !== 'play') return; if (noChao) { vy = JV[leg]; noChao = false; } }
    function cena() {
      var W = api.w, H = api.h, G = ground(), s = g.createLinearGradient(0, 0, 0, G);
      s.addColorStop(0, '#9fd3f0'); s.addColorStop(1, '#e8f4fb'); g.fillStyle = s; g.fillRect(0, 0, W, G);
      g.fillStyle = '#7a8fa8'; for (var m = -1; m < W / 220 + 1; m++) { var mx = m * 220 - (scroll * 0.1) % 220; g.beginPath(); g.moveTo(mx, G - 40); g.lineTo(mx + 110, G - 190); g.lineTo(mx + 220, G - 40); g.fill(); }
      g.fillStyle = '#e8f4fb'; for (var m2 = -1; m2 < W / 220 + 1; m2++) { var mx2 = m2 * 220 - (scroll * 0.1) % 220; g.beginPath(); g.moveTo(mx2 + 90, G - 150); g.lineTo(mx2 + 110, G - 190); g.lineTo(mx2 + 130, G - 150); g.fill(); }
      var r = g.createLinearGradient(0, G, 0, H); r.addColorStop(0, '#2f7aa8'); r.addColorStop(1, '#0d3350');
      g.fillStyle = r; g.fillRect(0, G, W, H - G);
      g.strokeStyle = 'rgba(255,255,255,.25)'; g.lineWidth = 2;
      for (var k = 0; k < 4; k++) { g.beginPath(); for (var x = 0; x <= W; x += 14) { var y = G + 60 + k * 40 + Math.sin((x + scroll * 0.6) / 40 + k) * 4; if (!x) g.moveTo(x, y); else g.lineTo(x, y); } g.stroke(); }
      // ponte (com buracos)
      g.fillStyle = '#8c5a2f'; g.fillRect(0, G, W, 18); g.fillStyle = '#6b3e1f'; for (var p = 0; p < W + 40; p += 40) { var px = p - scroll % 40; g.fillRect(px, G, 3, 18); }
      obs.forEach(function (o) {
        var ox = o.x;
        if (o.k === 'gap') { g.fillStyle = '#0d3350'; g.fillRect(ox, G - 2, o.w, 24); g.fillStyle = '#ffd84a'; g.fillRect(ox + o.w / 2 - 12, G + 8, 6, 6); g.fillRect(ox + o.w / 2 + 6, G + 8, 6, 6); }
        else { g.fillStyle = '#5b7a3a'; g.beginPath(); g.moveTo(ox, G); g.lineTo(ox + 8, G - 46); g.lineTo(ox + 18, G - 20); g.lineTo(ox + 28, G - 52); g.lineTo(ox + 38, G); g.closePath(); g.fill(); g.fillStyle = '#3f5a26'; g.fillRect(ox + 4, G - 8, 30, 8); }
      });
    }
    function bode() {
      var s = SZ[leg], x = GX, y = gy, c = api.clock;
      if (inv > 0 && Math.floor(c * 14) % 2) return;
      g.save(); g.translate(x, y); g.scale(s, s);
      var ph = noChao ? Math.sin(c * 16) * 7 : 5;
      g.fillStyle = '#f2efe8'; g.beginPath(); g.ellipse(0, -26, 30, 17, 0, 0, 6.29); g.fill();
      g.fillRect(-22, -14, 6, 14 + ph / 3); g.fillRect(-8, -14, 6, 14 - ph / 3); g.fillRect(10, -14, 6, 14 + ph / 3); g.fillRect(22, -14, 6, 14 - ph / 3);
      g.beginPath(); g.ellipse(30, -42, 11, 9, 0.3, 0, 6.29); g.fill();
      g.fillStyle = '#6b6b6b'; g.beginPath(); g.moveTo(26, -50); g.quadraticCurveTo(24, -66, 36, -62); g.quadraticCurveTo(30, -58, 32, -49); g.fill();
      g.fillStyle = '#222'; g.beginPath(); g.arc(34, -44, 1.8, 0, 6.29); g.fill();
      g.fillStyle = '#e3d7bd'; g.beginPath(); g.moveTo(34, -34); g.lineTo(38, -22); g.lineTo(30, -34); g.fill();
      g.restore();
    }
    return {
      down: function () { if (st === 'menu' || st === 'lose') start(); else if (st === 'win') st = 'menu'; else pula(); },
      pausar: function () {},
      key: function (c, d) { if ((c === 'Space' || c === 'ArrowUp' || c === 'KeyW' || c === 'Enter') && d) { if (st === 'play') pula(); else if (st === 'menu' || st === 'lose') start(); else if (st === 'win') st = 'menu'; } },
      resize: function () { if (st !== 'play') gy = ground(); },
      update: function (dt) {
        scroll += (st === 'play' ? SP[leg] : 80) * dt;
        if (st !== 'play') return;
        time += dt; if (banner > 0) banner -= dt; if (inv > 0) inv -= dt;
        var nl = Math.min(2, Math.floor(time / LEG)); if (nl !== leg) { leg = nl; banner = 3; }
        if (time >= LEG * 3) { st = 'win'; return; }
        var v = SP[leg] * dt; dist += v; prox -= v;
        if (prox <= 0) { prox = 330 + Math.random() * 230 + leg * 20; if (Math.random() < 0.5) obs.push({ k: 'gap', x: api.w + 40, w: 80 + Math.random() * 50 }); else obs.push({ k: 'fist', x: api.w + 40, w: 38 }); }
        var G = ground(); vy += 1900 * dt; gy += vy * dt;
        var sobre = false; obs.forEach(function (o) { if (o.k === 'gap' && GX + 8 > o.x && GX - 8 < o.x + o.w) sobre = true; });
        if (gy >= G && !sobre && vy >= 0) { gy = G; vy = 0; noChao = true; }
        if (gy > G + 120) { gy = G; vy = 0; noChao = true; if (inv <= 0) { vidas--; inv = 1.4; if (vidas <= 0) { st = 'lose'; return; } } }
        for (var i = obs.length - 1; i >= 0; i--) {
          var o = obs[i]; o.x -= v;
          if (o.x < -160) { obs.splice(i, 1); continue; }
          if (o.k === 'fist' && inv <= 0 && GX + 22 * SZ[leg] > o.x && GX - 22 * SZ[leg] < o.x + o.w && gy > G - 44) { vidas--; inv = 1.4; obs.splice(i, 1); if (vidas <= 0) { st = 'lose'; return; } }
        }
      },
      draw: function () {
        cena(); if (st !== 'menu') bode();
        if (st !== 'menu') {
          txt(T.vidas, 24, 34, 16, '#16212d', 'left');
          for (var i = 0; i < 3; i++) { g.fillStyle = i < vidas ? '#e6554a' : 'rgba(0,0,0,.2)'; g.beginPath(); g.arc(88 + i * 22, 29, 8, 0, 6.29); g.fill(); }
          if (banner > 0) { g.globalAlpha = Math.min(1, banner); txt(T.etapas[leg], api.w / 2, 120, 26, '#16212d'); g.globalAlpha = 1; }
        }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd84a');
      }
    };
  }
});
