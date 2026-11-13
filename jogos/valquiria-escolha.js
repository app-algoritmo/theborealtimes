/* A escolha da valquíria — envie cada guerreiro caído ao salão certo. */
BTJogo.registrar({
  canvas: 'jogo-valquiria',
  t: {
    pt: {
      titulo: 'A escolha da valquíria',
      sub: 'Guerreiros caem do campo de batalha. Quem traz a pena de corvo vai para Valhalla (esquerda); quem traz o colar de ouro vai para Fólkvangr (direita). Toque no lado certo (ou use as setas) antes que cheguem ao chão.',
      toque: 'Toque para começar', acertos: 'Escolhas', erros: 'Erros', sala0: 'Valhalla', sala1: 'Fólkvangr',
      perdeu: 'Almas demais se perderam', de_novo: 'Toque para tentar de novo',
      v1: 'Todos foram levados!',
      v2: 'Nas fontes nórdicas, Odin recebe parte dos mortos em combate em Valhalla, e Freyja escolhe os outros para Fólkvangr. A regra do corvo e do colar é invenção do jogo.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: "The Valkyrie's choice",
      sub: 'Warriors fall from the battlefield. Those with a raven feather go to Valhalla (left); those with a golden necklace go to Fólkvangr (right). Tap the right side (or use the arrow keys) before they hit the ground.',
      toque: 'Tap to start', acertos: 'Chosen', erros: 'Mistakes', sala0: 'Valhalla', sala1: 'Fólkvangr',
      perdeu: 'Too many souls were lost', de_novo: 'Tap to try again',
      v1: 'Every one was carried away!',
      v2: "In the Norse sources, Odin receives part of those killed in battle in Valhalla, and Freyja chooses the others for Fólkvangr. The raven-and-necklace rule is made up for the game.",
      jogar: 'Tap to play again'
    },
    no: {
      titulo: 'Valkyrjens valg',
      sub: 'Krigere faller fra slagmarken. De med ravnefjær går til Valhall (venstre); de med gullhalsbånd går til Folkvang (høyre). Trykk på riktig side (eller bruk piltastene) før de treffer bakken.',
      toque: 'Trykk for å starte', acertos: 'Valgt', erros: 'Feil', sala0: 'Valhall', sala1: 'Folkvang',
      perdeu: 'For mange sjeler gikk tapt', de_novo: 'Trykk for å prøve igjen',
      v1: 'Alle ble ført bort!',
      v2: 'I de norrøne kildene mottar Odin en del av de falne i Valhall, og Frøya velger de andre til Folkvang. Regelen med ravn og halsbånd er diktet opp for spillet.',
      jogar: 'Trykk for å spille igjen'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt, META = 20, MAXE = 4;
    var st = 'menu', ok = 0, err = 0, q = [], sp = 0, flash = 0, fside = 0, fcol = '#fff';
    function reset() { st = 'play'; ok = 0; err = 0; q = []; sp = 0.5; flash = 0; }
    function gy() { return api.h * 0.8; }
    function speed() { return 85 + ok * 4.5; }
    function pick(side) {
      if (st !== 'play') return;
      if (!q.length) return;
      var f = q.shift(); fside = side; flash = 0.25;
      if (f.k === side) { ok++; fcol = '#9be3b4'; if (ok >= META) st = 'win'; }
      else { err++; fcol = '#ff9a8d'; if (err >= MAXE) st = 'lose'; }
    }
    function press(x) {
      if (st === 'menu' || st === 'lose') { reset(); return; }
      if (st === 'win') { st = 'menu'; return; }
      pick(x < api.w / 2 ? 0 : 1);
    }
    function warrior(o) {
      g.save(); g.translate(o.x, o.y);
      g.fillStyle = '#7d8aa3'; g.fillRect(-9, -2, 18, 24); g.fillStyle = '#d8b48a'; g.beginPath(); g.arc(0, -10, 9, 0, 6.29); g.fill();
      g.fillStyle = '#9aa5b8'; g.beginPath(); g.arc(0, -13, 9, 3.14, 6.29); g.fill();
      g.restore(); txt(o.k === 0 ? '🪶' : '📿', o.x, o.y - 30, 22, '#fff');
    }
    return {
      pausar: function () {},
      dbg: function () { return { st: st, ok: ok, err: err, q: q, w: api.w, h: api.h }; },
      down: function (x) { press(x); },
      key: function (c, d) {
        if (!d) return;
        if (c === 'ArrowLeft' || c === 'KeyA') { if (st === 'play') pick(0); }
        else if (c === 'ArrowRight' || c === 'KeyD') { if (st === 'play') pick(1); }
        else if (c === 'Space' || c === 'Enter') { if (st === 'menu' || st === 'lose') reset(); else if (st === 'win') st = 'menu'; }
      },
      update: function (dt) {
        if (flash > 0) flash -= dt;
        if (st !== 'play') return;
        sp -= dt;
        if (sp <= 0 && ok + q.length < META) { sp = Math.max(1.0, 2.1 - ok * 0.05); q.push({ x: api.w / 2 + (Math.random() - 0.5) * 120, y: -30, k: Math.random() < 0.5 ? 0 : 1 }); }
        for (var i = 0; i < q.length; i++) q[i].y += speed() * dt;
        if (q.length && q[0].y > gy()) { q.shift(); err++; fcol = '#ff9a8d'; flash = 0.25; fside = 2; if (err >= MAXE) st = 'lose'; }
      },
      draw: function () {
        var W = api.w, H = api.h, b = gy(), i;
        var s = g.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#1d1630'); s.addColorStop(1, '#3a2a4a'); g.fillStyle = s; g.fillRect(0, 0, W, H);
        g.fillStyle = 'rgba(255,255,255,.07)'; for (i = 0; i < 20; i++) g.fillRect((i * 97) % W, (i * 61) % (H * 0.7), 3, 3);
        g.fillStyle = '#c98a1a'; g.fillRect(0, b, W / 2, H - b); g.fillStyle = '#c0568c'; g.fillRect(W / 2, b, W / 2, H - b);
        g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(W / 2 - 1, b, 2, H - b);
        txt(T.sala0, W / 4, b + 34, 17, '#fff4d6'); txt(T.sala1, W * 3 / 4, b + 34, 17, '#ffe6f2');
        if (flash > 0 && fside < 2) { g.fillStyle = fcol; g.globalAlpha = flash * 1.4; g.fillRect(fside ? W / 2 : 0, b, W / 2, H - b); g.globalAlpha = 1; }
        q.forEach(warrior);
        if (st !== 'menu') {
          txt(T.acertos + ': ' + ok + '/' + META, 24, 34, 15, '#f3ecd2', 'left');
          txt(T.erros + ': ' + err + '/' + MAXE, 24, 56, 13, err ? '#ffb08a' : '#c9b3f2', 'left');
          txt('🪶 → ' + T.sala0 + '    📿 → ' + T.sala1, W / 2, H * 0.1 + 30, 13, '#e6dcff');
        }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
