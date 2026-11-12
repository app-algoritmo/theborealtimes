/* A viagem de Leif — jogo do The Boreal Times.
   Sem dependências, sem cookies, sem coleta de dados. */
(function () {
  'use strict';
  var cv = document.getElementById('jogo-leif');
  if (!cv || !cv.getContext) return;
  var g = cv.getContext('2d');
  var W = 800, H = 450;
  var L = (document.documentElement.lang || 'pt').slice(0, 2) === 'en' ? 'en' : 'pt';
  var T = {
    pt: {
      titulo: 'A viagem de Leif',
      sub: 'Desvie do gelo e das rochas. Colete barris. Chegue à Vinlândia.',
      sub2: 'Arraste para cima e para baixo, ou use as setas.',
      toque: 'Toque, clique ou aperte espaço para zarpar',
      etapas: [
        'Rumo a Helluland, a “terra das pedras planas”',
        'Markland, a “terra da floresta”',
        'Rumo a Vinland'
      ],
      casco: 'Casco', barris: 'Barris',
      fim_perdeu: 'O navio não resistiu',
      de_novo: 'Toque para tentar de novo',
      v1: 'Você chegou a Vinland!',
      v2: 'Segundo a Saga dos Groenlandeses, Leif passou o inverno ali.',
      v3: 'Em L’Anse aux Meadows, no Canadá, a arqueologia confirma nórdicos por volta de 1021,',
      v4: 'mas não prova que aquele seja o lugar que Leif chamou de Vinland.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: "Leif's voyage",
      sub: 'Dodge the ice and rocks. Grab barrels. Reach Vinland.',
      sub2: 'Drag up and down, or use the arrow keys.',
      toque: 'Tap, click or press space to set sail',
      etapas: [
        'Bound for Helluland, the “land of flat stones”',
        'Markland, the “land of forests”',
        'Bound for Vinland'
      ],
      casco: 'Hull', barris: 'Barrels',
      fim_perdeu: 'The ship could not take it',
      de_novo: 'Tap to try again',
      v1: 'You reached Vinland!',
      v2: 'According to the Saga of the Greenlanders, Leif wintered there.',
      v3: 'At L’Anse aux Meadows, in Canada, archaeology confirms Norse people around 1021,',
      v4: 'but it does not prove that was the place Leif called Vinland.',
      jogar: 'Tap to play again'
    }
  }[L];

  var SPR = {};
  function spr(n) {
    if (!SPR[n]) { var i = new Image(); i.src = '/g/img/' + n + '.png'; SPR[n] = i; }
    var i2 = SPR[n]; return i2.complete && i2.naturalWidth ? i2 : null;
  }
  var LEG = 22;                        // segundos por etapa
  var st = 'menu', clock = 0, time = 0, hull = 3, barrels = 0, inv = 0;
  var y = H / 2, target = H / 2, things = [], spawn = 0, banner = 0, leg = 0;
  var keyUp = false, keyDown = false;

  function start() {
    st = 'play'; time = 0; hull = 3; barrels = 0; inv = 0; y = target = H / 2;
    things = []; spawn = 0.6; leg = 0; banner = 3;
  }
  function press() {
    if (st === 'menu' || st === 'lose') start();
    else if (st === 'win') st = 'menu';
  }
  function setTarget(e) {
    var r = cv.getBoundingClientRect();
    target = Math.max(40, Math.min(H - 40, (e.clientY - r.top) * H / r.height));
  }
  var dragging = false;
  cv.addEventListener('pointerdown', function (e) {
    e.preventDefault(); dragging = true; press(); setTarget(e);
    try { cv.setPointerCapture(e.pointerId); } catch (x) {}
  });
  cv.addEventListener('pointermove', function (e) {
    if (dragging || e.pointerType === 'mouse') setTarget(e);
  });
  window.addEventListener('pointerup', function () { dragging = false; });
  window.addEventListener('keydown', function (e) {
    var k = e.code;
    if (k === 'ArrowUp' || k === 'KeyW') { keyUp = true; e.preventDefault(); }
    else if (k === 'ArrowDown' || k === 'KeyS') { keyDown = true; e.preventDefault(); }
    else if (k === 'Space' || k === 'Enter') {
      if (e.target && /input|textarea|button|a/i.test(e.target.tagName || '')) return;
      e.preventDefault(); if (!e.repeat) press();
    }
  });
  window.addEventListener('keyup', function (e) {
    var k = e.code;
    if (k === 'ArrowUp' || k === 'KeyW') keyUp = false;
    if (k === 'ArrowDown' || k === 'KeyS') keyDown = false;
  });

  function speed() { return 230 + leg * 45; }
  function update(dt) {
    clock += dt;
    if (st !== 'play') return;
    time += dt; if (banner > 0) banner -= dt;
    var nl = Math.min(2, Math.floor(time / LEG));
    if (nl !== leg) { leg = nl; banner = 3; }
    if (time >= LEG * 3) { st = 'win'; return; }

    if (keyUp) target -= 330 * dt;
    if (keyDown) target += 330 * dt;
    target = Math.max(40, Math.min(H - 40, target));
    y += (target - y) * Math.min(1, dt * 8);
    if (inv > 0) inv -= dt;

    spawn -= dt;
    if (spawn <= 0) {
      spawn = Math.max(0.42, 1.0 - leg * 0.17) * (0.7 + Math.random() * 0.6);
      var r = Math.random();
      var yy = 50 + Math.random() * (H - 100);
      if (r < 0.22) things.push({ k: 'barrel', x: W + 40, y: yy, r: 16 });
      else if (r < 0.62) things.push({ k: 'ice', x: W + 60, y: yy, r: 30 + Math.random() * 16, s: Math.random() * 9 });
      else things.push({ k: 'rock', x: W + 40, y: yy, r: 20 + Math.random() * 8, s: Math.random() * 9 });
    }
    var v = speed() * dt;
    for (var i = things.length - 1; i >= 0; i--) {
      var o = things[i]; o.x -= v;
      if (o.x < -80) { things.splice(i, 1); continue; }
      var dx = o.x - 150, dy = o.y - y;
      var rr = o.r + (o.k === 'barrel' ? 22 : 18);
      if (dx * dx + dy * dy < rr * rr) {
        if (o.k === 'barrel') {
          barrels++; things.splice(i, 1);
          if (barrels % 5 === 0 && hull < 3) hull++;
        } else if (inv <= 0) {
          hull--; inv = 1.3; things.splice(i, 1);
          if (hull <= 0) st = 'lose';
        }
      }
    }
  }

  var PAL = [
    ['#2c5c78', '#0d2a3d'],
    ['#2a6a70', '#0c3039'],
    ['#2f7a62', '#0e3a2c']
  ];
  function txt(s, x, yy, size, color, align) {
    g.font = (size >= 20 ? 'bold ' : '') + size + 'px Georgia, serif';
    g.textAlign = align || 'center'; g.fillStyle = color || '#fff';
    g.fillText(s, x, yy);
  }
  function veil(a) { g.fillStyle = 'rgba(10,8,25,' + Math.max(a, .72) + ')'; g.fillRect(0, 0, W, H); }

  function sea() {
    var p = PAL[leg];
    var s = g.createLinearGradient(0, 0, 0, H);
    s.addColorStop(0, p[0]); s.addColorStop(1, p[1]);
    g.fillStyle = s; g.fillRect(0, 0, W, H);
    g.strokeStyle = 'rgba(255,255,255,.14)'; g.lineWidth = 2;
    var sp = speed() * 0.6;
    for (var k = 0; k < 9; k++) {
      var yy = 30 + k * 50;
      g.beginPath();
      for (var x = 0; x <= W; x += 12) {
        var yb = yy + Math.sin((x + clock * sp) / 55 + k) * 5;
        if (x === 0) g.moveTo(x, yb); else g.lineTo(x, yb);
      }
      g.stroke();
    }
    // costa ao fundo na última etapa
    if (st === 'play' || st === 'win') {
      var left = LEG * 3 - time;
      if (left < 6) {
        var cx = W - (6 - left) / 6 * 260;
        g.fillStyle = '#245c3c';
        g.beginPath(); g.moveTo(cx + 40, 0); g.lineTo(cx + 40, H);
        g.lineTo(W + 40, H); g.lineTo(W + 40, 0); g.closePath(); g.fill();
        g.fillStyle = '#16402a';
        for (var i = 0; i < 8; i++) {
          var tx = cx + 60 + (i % 2) * 24, ty = 40 + i * 52;
          g.beginPath(); g.moveTo(tx, ty); g.lineTo(tx + 14, ty + 34); g.lineTo(tx - 14, ty + 34); g.fill();
        }
      }
    }
  }
  function ice(o) {
    g.save(); g.translate(o.x, o.y);
    var r = o.r;
    var im = spr('iceberg');
    if (im) { var w = r * 2.6, h = w * im.naturalHeight / im.naturalWidth; g.drawImage(im, -w / 2, -h / 2, w, h); g.restore(); return; }
    g.fillStyle = '#eaf6ff';
    g.beginPath(); g.moveTo(-r, r * .5); g.lineTo(-r * .6, -r * .5); g.lineTo(-r * .1, -r);
    g.lineTo(r * .5, -r * .4); g.lineTo(r, r * .5); g.closePath(); g.fill();
    g.fillStyle = '#b6d8ee';
    g.beginPath(); g.moveTo(-r * .1, -r); g.lineTo(r * .5, -r * .4); g.lineTo(r, r * .5); g.lineTo(r * .1, r * .5); g.closePath(); g.fill();
    g.restore();
  }
  function rock(o) {
    g.save(); g.translate(o.x, o.y);
    var r = o.r;
    var im = spr('rocha');
    if (im) { var w = r * 2.6, h = w * im.naturalHeight / im.naturalWidth; g.drawImage(im, -w / 2, -h / 2, w, h); g.restore(); return; }
    g.fillStyle = '#4c4f57';
    g.beginPath(); g.moveTo(-r, r * .6); g.lineTo(-r * .7, -r * .3); g.lineTo(-r * .1, -r * .8);
    g.lineTo(r * .6, -r * .5); g.lineTo(r, r * .6); g.closePath(); g.fill();
    g.fillStyle = '#6a6e78';
    g.beginPath(); g.moveTo(-r * .1, -r * .8); g.lineTo(r * .6, -r * .5); g.lineTo(r * .2, 0); g.closePath(); g.fill();
    g.restore();
  }
  function barrel(o) {
    g.save(); g.translate(o.x, o.y + Math.sin(clock * 3 + o.x) * 3);
    var im = spr('barril');
    if (im) { var w = 46, h = w * im.naturalHeight / im.naturalWidth; g.drawImage(im, -w / 2, -h / 2, w, h); g.restore(); return; }
    g.fillStyle = '#9b6a35'; g.fillRect(-12, -14, 24, 28);
    g.fillStyle = '#c99a3c'; g.fillRect(-13, -8, 26, 3); g.fillRect(-13, 5, 26, 3);
    g.restore();
  }
  function ship() {
    if (inv > 0 && Math.floor(clock * 14) % 2) return;
    g.save(); g.translate(150, y); g.rotate((target - y) / 600);
    var im = spr('navio');
    if (im) { var w = 180, h = w * im.naturalHeight / im.naturalWidth; g.drawImage(im, -w / 2, -h * 0.7, w, h); g.restore(); return; }
    // casco
    g.fillStyle = '#6b3e1f';
    g.beginPath(); g.moveTo(-50, -6); g.lineTo(54, -6); g.lineTo(34, 14); g.lineTo(-34, 14); g.closePath(); g.fill();
    g.fillStyle = '#a56d36'; g.fillRect(-50, -10, 104, 4);
    // proa dragão
    g.strokeStyle = '#c99a3c'; g.lineWidth = 5; g.lineCap = 'round';
    g.beginPath(); g.moveTo(54, -8); g.quadraticCurveTo(70, -14, 66, -30); g.stroke();
    g.fillStyle = '#c99a3c'; g.beginPath(); g.arc(66, -32, 5, 0, 6.29); g.fill();
    // mastro e vela
    g.fillStyle = '#4a2c14'; g.fillRect(-2, -62, 4, 56);
    g.fillStyle = '#f3ecd2'; g.fillRect(-28, -58, 56, 40);
    g.fillStyle = '#b73a2e';
    for (var i = 0; i < 4; i++) g.fillRect(-28 + i * 14, -58, 7, 40);
    // escudos
    g.fillStyle = '#d4a24a';
    for (var j = 0; j < 5; j++) { g.beginPath(); g.arc(-34 + j * 20, 0, 6, 0, 6.29); g.fill(); }
    g.restore();
  }
  function hud() {
    txt(T.casco, 40, 28, 14, '#f3ecd2', 'left');
    for (var i = 0; i < 3; i++) {
      g.fillStyle = i < hull ? '#e6554a' : 'rgba(255,255,255,.2)';
      g.beginPath(); g.arc(106 + i * 22, 23, 8, 0, 6.29); g.fill();
    }
    txt(T.barris + ': ' + barrels, 40, 52, 14, '#f3ecd2', 'left');
    // progresso
    var px = 300, pw = 200, py = 24;
    g.strokeStyle = 'rgba(255,255,255,.5)'; g.lineWidth = 3;
    g.beginPath(); g.moveTo(px, py); g.lineTo(px + pw, py); g.stroke();
    g.strokeStyle = '#c9b3f2';
    g.beginPath(); g.moveTo(px, py); g.lineTo(px + pw * Math.min(1, time / (LEG * 3)), py); g.stroke();
    for (var k = 0; k < 4; k++) {
      g.fillStyle = k * LEG <= time ? '#c9b3f2' : 'rgba(255,255,255,.5)';
      g.beginPath(); g.arc(px + pw * k / 3, py, 6, 0, 6.29); g.fill();
    }
  }
  function draw() {
    g.clearRect(0, 0, W, H);
    sea();
    things.forEach(function (o) { (o.k === 'ice' ? ice : o.k === 'rock' ? rock : barrel)(o); });
    if (st !== 'menu') { ship(); hud(); }
    if (st === 'play' && banner > 0) {
      g.globalAlpha = Math.min(1, banner);
      txt(T.etapas[leg], W / 2, 100, 24, '#fff');
      g.globalAlpha = 1;
    }
    if (st === 'menu') {
      veil(.5);
      txt(T.titulo, W / 2, 150, 44, '#fff');
      txt(T.sub, W / 2, 205, 19, '#e9e1f7');
      txt(T.sub2, W / 2, 235, 17, '#e9e1f7');
      txt(T.toque, W / 2, 320, 17, '#c9b3f2');
    } else if (st === 'lose') {
      veil(.6);
      txt(T.fim_perdeu, W / 2, 190, 36, '#ff9a8d');
      txt(T.de_novo, W / 2, 250, 18, '#e9e1f7');
    } else if (st === 'win') {
      veil(.55);
      txt(T.v1, W / 2, 130, 32, '#fff');
      txt(T.v2, W / 2, 185, 18, '#e9e1f7');
      txt(T.v3, W / 2, 225, 17, '#e9e1f7');
      txt(T.v4, W / 2, 252, 17, '#e9e1f7');
      txt(T.jogar, W / 2, 330, 17, '#c9b3f2');
    }
  }
  var last = 0;
  function frame(ts) {
    var dt = Math.min(0.05, (ts - last) / 1000 || 0); last = ts;
    update(dt); draw(); requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  window.__leif = { press: press, state: function () { return { st: st, hull: hull, time: time }; }, skip: function (s) { time = s; } };
})();
