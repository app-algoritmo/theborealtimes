/* A viagem de Leif — desvie do gelo e das rochas até Vinland.
   Em paisagem o navio segue para a direita; em retrato, para cima. */
BTJogo.registrar({
  canvas: 'jogo-leif',
  t: {
    pt: {
      titulo: 'A viagem de Leif',
      sub: 'Desvie do gelo e das rochas. Colete barris. Chegue à Vinlândia.',
      sub2: 'Arraste o dedo ou o mouse, ou use as setas.',
      toque: 'Toque para zarpar',
      etapas: ['Rumo a Helluland, a “terra das pedras planas”', 'Markland, a “terra da floresta”', 'Rumo a Vinland'],
      casco: 'Casco', barris: 'Barris', perdeu: 'O navio não resistiu', de_novo: 'Toque para tentar de novo',
      v1: 'Você chegou a Vinland!',
      v2: 'Segundo a Saga dos Groenlandeses, Leif passou o inverno ali.',
      v3: 'Em L’Anse aux Meadows, no Canadá, a arqueologia confirma nórdicos por volta de 1021, mas não prova que aquele seja o lugar que Leif chamou de Vinland.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: "Leif's voyage",
      sub: 'Dodge the ice and rocks. Grab barrels. Reach Vinland.',
      sub2: 'Drag your finger or mouse, or use the arrow keys.',
      toque: 'Tap to set sail',
      etapas: ['Bound for Helluland, the “land of flat stones”', 'Markland, the “land of forests”', 'Bound for Vinland'],
      casco: 'Hull', barris: 'Barrels', perdeu: 'The ship could not take it', de_novo: 'Tap to try again',
      v1: 'You reached Vinland!',
      v2: 'According to the Saga of the Greenlanders, Leif wintered there.',
      v3: 'At L’Anse aux Meadows, in Canada, archaeology confirms Norse people around 1021, but it does not prove that was the place Leif called Vinland.',
      jogar: 'Tap to play again'
    },
    no: {
      titulo: 'Leivs reise',
      sub: 'Unngå isen og skjærene. Ta tønner. Nå Vinland.',
      sub2: 'Dra fingeren eller musen, eller bruk piltastene.',
      toque: 'Trykk for å sette seil',
      etapas: ['Kurs mot Helluland, «landet med flate steiner»', 'Markland, «skoglandet»', 'Kurs mot Vinland'],
      casco: 'Skrog', barris: 'Tønner', perdeu: 'Skipet holdt ikke', de_novo: 'Trykk for å prøve igjen',
      v1: 'Du nådde Vinland!',
      v2: 'Ifølge Grønlendingenes saga overvintret Leiv der.',
      v3: 'Ved L’Anse aux Meadows i Canada bekrefter arkeologien nordboer omkring 1021, men det beviser ikke at det var stedet Leiv kalte Vinland.',
      jogar: 'Trykk for å spille igjen'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt, LEG = 22;
    var st = 'menu', time = 0, hull = 3, barrels = 0, inv = 0, leg = 0, banner = 0, spawn = 0;
    var sc = 225, tc = 225, things = [], kUp = false, kDown = false;
    var SHIP = 150;                      // posição do navio ao longo do percurso

    function land() { return api.w >= api.h; }
    function LA() { return land() ? api.w : api.h; }    // comprimento do percurso
    function LC() { return land() ? api.h : api.w; }    // largura (eixo transversal)
    function P(a, c) { return land() ? [a, c] : [c, LA() - a]; }
    function clampC(v) { return Math.max(44, Math.min(LC() - 44, v)); }
    function start() { st = 'play'; time = 0; hull = 3; barrels = 0; inv = 0; leg = 0; banner = 3; things = []; spawn = 0.6; sc = tc = LC() / 2; }
    function speed() { return 230 + leg * 45; }

    function ice(o) {
      var p = P(o.a, o.c), r = o.r; g.save(); g.translate(p[0], p[1]);
      var im = api.sprite('iceberg');
      if (im) { var w = r * 2.6, h = w * im.naturalHeight / im.naturalWidth; g.drawImage(im, -w / 2, -h / 2, w, h); g.restore(); return; }
      g.fillStyle = '#eaf6ff';
      g.beginPath(); g.moveTo(-r, r * .5); g.lineTo(-r * .6, -r * .5); g.lineTo(-r * .1, -r); g.lineTo(r * .5, -r * .4); g.lineTo(r, r * .5); g.closePath(); g.fill();
      g.fillStyle = '#b6d8ee';
      g.beginPath(); g.moveTo(-r * .1, -r); g.lineTo(r * .5, -r * .4); g.lineTo(r, r * .5); g.lineTo(r * .1, r * .5); g.closePath(); g.fill();
      g.restore();
    }
    function rock(o) {
      var p = P(o.a, o.c), r = o.r; g.save(); g.translate(p[0], p[1]);
      var im = api.sprite('rocha');
      if (im) { var w = r * 2.6, h = w * im.naturalHeight / im.naturalWidth; g.drawImage(im, -w / 2, -h / 2, w, h); g.restore(); return; }
      g.fillStyle = '#4c4f57';
      g.beginPath(); g.moveTo(-r, r * .6); g.lineTo(-r * .7, -r * .3); g.lineTo(-r * .1, -r * .8); g.lineTo(r * .6, -r * .5); g.lineTo(r, r * .6); g.closePath(); g.fill();
      g.fillStyle = '#6a6e78';
      g.beginPath(); g.moveTo(-r * .1, -r * .8); g.lineTo(r * .6, -r * .5); g.lineTo(r * .2, 0); g.closePath(); g.fill();
      g.restore();
    }
    function barrel(o) {
      var p = P(o.a, o.c); g.save(); g.translate(p[0], p[1] + Math.sin(api.clock * 3 + o.a) * 3);
      var im = api.sprite('barril');
      if (im) { var w = 46, h = w * im.naturalHeight / im.naturalWidth; g.drawImage(im, -w / 2, -h / 2, w, h); g.restore(); return; }
      g.fillStyle = '#9b6a35'; g.fillRect(-12, -14, 24, 28);
      g.fillStyle = '#c99a3c'; g.fillRect(-13, -8, 26, 3); g.fillRect(-13, 5, 26, 3);
      g.restore();
    }
    function ship() {
      if (inv > 0 && Math.floor(api.clock * 14) % 2) return;
      var p = P(SHIP, sc); g.save(); g.translate(p[0], p[1]);
      if (!land()) g.rotate(-Math.PI / 2);
      g.rotate((tc - sc) / 600);
      var im = api.sprite('navio');
      if (im) { var w = 180, h = w * im.naturalHeight / im.naturalWidth; g.drawImage(im, -w / 2, -h * 0.7, w, h); g.restore(); return; }
      g.fillStyle = '#6b3e1f';
      g.beginPath(); g.moveTo(-50, -6); g.lineTo(54, -6); g.lineTo(34, 14); g.lineTo(-34, 14); g.closePath(); g.fill();
      g.fillStyle = '#a56d36'; g.fillRect(-50, -10, 104, 4);
      g.strokeStyle = '#c99a3c'; g.lineWidth = 5; g.lineCap = 'round';
      g.beginPath(); g.moveTo(54, -8); g.quadraticCurveTo(70, -14, 66, -30); g.stroke();
      g.fillStyle = '#c99a3c'; g.beginPath(); g.arc(66, -32, 5, 0, 6.29); g.fill();
      g.fillStyle = '#4a2c14'; g.fillRect(-2, -62, 4, 56);
      g.fillStyle = '#f3ecd2'; g.fillRect(-28, -58, 56, 40);
      g.fillStyle = '#b73a2e'; for (var i = 0; i < 4; i++) g.fillRect(-28 + i * 14, -58, 7, 40);
      g.fillStyle = '#d4a24a'; for (var j = 0; j < 5; j++) { g.beginPath(); g.arc(-34 + j * 20, 0, 6, 0, 6.29); g.fill(); }
      g.restore();
    }
    var PAL = [['#2c5c78', '#0d2a3d'], ['#2a6a70', '#0c3039'], ['#2f7a62', '#0e3a2c']];
    function sea() {
      var W = api.w, H = api.h, p = PAL[leg], s = g.createLinearGradient(0, 0, land() ? 0 : W, land() ? H : 0);
      s.addColorStop(0, p[0]); s.addColorStop(1, p[1]); g.fillStyle = s; g.fillRect(0, 0, W, H);
      g.strokeStyle = 'rgba(255,255,255,.14)'; g.lineWidth = 2;
      var sp = speed() * 0.6, n = Math.ceil(LC() / 50);
      for (var k = 0; k < n; k++) {
        g.beginPath();
        for (var a = 0; a <= LA(); a += 12) {
          var c = 30 + k * 50 + Math.sin((a + api.clock * sp) / 55 + k) * 5, q = P(a, c);
          if (a === 0) g.moveTo(q[0], q[1]); else g.lineTo(q[0], q[1]);
        }
        g.stroke();
      }
      var left = LEG * 3 - time;
      if (st !== 'menu' && left < 6) {
        var ca = LA() - (6 - left) / 6 * 260, q1 = P(ca + 40, 0), q2 = P(ca + 40, LC()), q3 = P(LA() + 60, LC()), q4 = P(LA() + 60, 0);
        g.fillStyle = '#245c3c'; g.beginPath(); g.moveTo(q1[0], q1[1]); g.lineTo(q2[0], q2[1]); g.lineTo(q3[0], q3[1]); g.lineTo(q4[0], q4[1]); g.closePath(); g.fill();
        g.fillStyle = '#16402a';
        for (var i = 0; i * 52 < LC(); i++) {
          var t = P(ca + 70 + (i % 2) * 24, 36 + i * 52);
          g.beginPath(); g.moveTo(t[0], t[1]); g.lineTo(t[0] + 14, t[1] + 34); g.lineTo(t[0] - 14, t[1] + 34); g.fill();
        }
      }
    }
    function hud() {
      txt(T.casco, 24, 34, 15, '#f3ecd2', 'left');
      for (var i = 0; i < 3; i++) { g.fillStyle = i < hull ? '#e6554a' : 'rgba(255,255,255,.2)'; g.beginPath(); g.arc(92 + i * 22, 29, 8, 0, 6.29); g.fill(); }
      txt(T.barris + ': ' + barrels, 24, 60, 15, '#f3ecd2', 'left');
      var px = 24, pw = Math.min(200, api.w - 150), py = 84;
      g.strokeStyle = 'rgba(255,255,255,.5)'; g.lineWidth = 3; g.beginPath(); g.moveTo(px, py); g.lineTo(px + pw, py); g.stroke();
      g.strokeStyle = '#c9b3f2'; g.beginPath(); g.moveTo(px, py); g.lineTo(px + pw * Math.min(1, time / (LEG * 3)), py); g.stroke();
      for (var k = 0; k < 4; k++) { g.fillStyle = k * LEG <= time ? '#c9b3f2' : 'rgba(255,255,255,.5)'; g.beginPath(); g.arc(px + pw * k / 3, py, 6, 0, 6.29); g.fill(); }
    }
    function setC(x, y) { tc = clampC(land() ? y : x); }

    return {
      down: function (x, y) { if (st === 'menu' || st === 'lose') start(); else if (st === 'win') st = 'menu'; else setC(x, y); },
      move: function (x, y, premido) { if (st === 'play' && premido) setC(x, y); },
      pausar: function () {},
      key: function (code, d) {
        if (code === 'ArrowUp' || code === 'KeyW' || code === 'ArrowLeft' || code === 'KeyA') kUp = d;
        else if (code === 'ArrowDown' || code === 'KeyS' || code === 'ArrowRight' || code === 'KeyD') kDown = d;
        else if ((code === 'Space' || code === 'Enter') && d) { if (st === 'menu' || st === 'lose') start(); else if (st === 'win') st = 'menu'; }
      },
      resize: function () { sc = tc = clampC(sc); },
      update: function (dt) {
        if (st !== 'play') return;
        time += dt; if (banner > 0) banner -= dt;
        var nl = Math.min(2, Math.floor(time / LEG));
        if (nl !== leg) { leg = nl; banner = 3; }
        if (time >= LEG * 3) { st = 'win'; return; }
        if (kUp) tc -= 330 * dt; if (kDown) tc += 330 * dt; tc = clampC(tc);
        sc += (tc - sc) * Math.min(1, dt * 8); if (inv > 0) inv -= dt;
        spawn -= dt;
        if (spawn <= 0) {
          spawn = Math.max(0.42, 1.0 - leg * 0.17) * (0.7 + Math.random() * 0.6) * (land() ? 1 : 0.9);
          var r = Math.random(), c = 50 + Math.random() * (LC() - 100), a = LA() + 60;
          if (r < 0.22) things.push({ k: 'barrel', a: a, c: c, r: 16 });
          else if (r < 0.62) things.push({ k: 'ice', a: a, c: c, r: 30 + Math.random() * 16 });
          else things.push({ k: 'rock', a: a, c: c, r: 20 + Math.random() * 8 });
        }
        var v = speed() * dt;
        for (var i = things.length - 1; i >= 0; i--) {
          var o = things[i]; o.a -= v;
          if (o.a < -90) { things.splice(i, 1); continue; }
          var da = o.a - SHIP, dc = o.c - sc, rr = o.r + (o.k === 'barrel' ? 22 : 18);
          if (da * da + dc * dc < rr * rr) {
            if (o.k === 'barrel') { barrels++; things.splice(i, 1); if (barrels % 5 === 0 && hull < 3) hull++; }
            else if (inv <= 0) { hull--; inv = 1.3; things.splice(i, 1); if (hull <= 0) st = 'lose'; }
          }
        }
      },
      draw: function () {
        sea();
        things.forEach(function (o) { (o.k === 'ice' ? ice : o.k === 'rock' ? rock : barrel)(o); });
        if (st !== 'menu') { ship(); hud(); }
        if (st === 'play' && banner > 0) {
          g.globalAlpha = Math.min(1, banner);
          api.quebra(T.etapas[leg], api.w - 60, 24, true).forEach(function (l, i) { txt(l, api.w / 2, 128 + i * 30, 24, '#fff'); });
          g.globalAlpha = 1;
        }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub, T.sub2], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2, T.v3], T.jogar);
      }
    };
  }
});
