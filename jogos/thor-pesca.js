/* A pesca de Thor — jogo do The Boreal Times.
   Sem dependências, sem cookies, sem coleta de dados. */
(function () {
  'use strict';
  var cv = document.getElementById('jogo-thor');
  if (!cv || !cv.getContext) return;
  var g = cv.getContext('2d');
  var W = 800, H = 450;
  var L = (document.documentElement.lang || 'pt').slice(0, 2) === 'en' ? 'en' : 'pt';
  var T = {
    pt: {
      titulo: 'A pesca de Thor',
      sub: 'Segure para puxar a linha. Solte quando a serpente investir.',
      toque: 'Toque, clique ou aperte espaço para começar',
      tensao: 'Linha', dist: 'Profundidade',
      aviso: 'Ela vai puxar! Solte!',
      rodada: 'Rodada',
      arrebentou: 'A linha arrebentou',
      fugiu: 'A serpente voltou ao fundo',
      de_novo: 'Toque para tentar de novo',
      proxima: 'Rodada vencida! Toque para a próxima',
      fim1: 'Thor trouxe Jörmungandr à superfície.',
      fim2: 'Segundo Snorri, porém, Hymir teve medo e cortou a linha:',
      fim3: 'a serpente voltou ao mar e o duelo ficou para o Ragnarök.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: "Thor's fishing trip",
      sub: 'Hold to reel in. Let go when the serpent lunges.',
      toque: 'Tap, click or press space to start',
      tensao: 'Line', dist: 'Depth',
      aviso: "It's going to pull! Let go!",
      rodada: 'Round',
      arrebentou: 'The line snapped',
      fugiu: 'The serpent sank back down',
      de_novo: 'Tap to try again',
      proxima: 'Round won! Tap for the next one',
      fim1: 'Thor brought Jörmungandr to the surface.',
      fim2: 'But in Snorri’s telling, Hymir panicked and cut the line:',
      fim3: 'the serpent sank, and the duel was left for Ragnarök.',
      jogar: 'Tap to play again'
    }
  }[L];

  var SPR = {};
  function spr(n) {
    if (!SPR[n]) { var i = new Image(); i.src = '/g/img/' + n + '.png'; SPR[n] = i; }
    var i2 = SPR[n]; return i2.complete && i2.naturalWidth ? i2 : null;
  }
  var R = [null,
    { reel: 11, drift: 3, gap: [3.2, 5], tens: 26 },
    { reel: 9.5, drift: 4.5, gap: [2.6, 4], tens: 30 },
    { reel: 8.5, drift: 6, gap: [2, 3.3], tens: 34 }
  ];
  var st = 'menu', round = 1, holding = false, clock = 0;
  var dist = 70, tension = 15, surge = 0, warn = 0, nextSurge = 2, lost = '';

  function start(r) {
    round = r; dist = 70; tension = 15; surge = 0; warn = 0;
    nextSurge = 2 + Math.random() * 1.5; st = 'play';
  }
  function press() {
    if (st === 'menu') start(1);
    else if (st === 'lose') start(round);
    else if (st === 'next') start(round + 1);
    else if (st === 'end') { st = 'menu'; }
    else if (st === 'play') holding = true;
  }
  function release() { holding = false; }

  cv.addEventListener('pointerdown', function (e) { e.preventDefault(); press(); });
  window.addEventListener('pointerup', release);
  window.addEventListener('pointercancel', release);
  window.addEventListener('blur', release);
  window.addEventListener('keydown', function (e) {
    if (e.code === 'Space' || e.code === 'Enter') {
      if (e.target && /input|textarea|button|a/i.test(e.target.tagName || '')) return;
      e.preventDefault(); if (!e.repeat) press();
    }
  });
  window.addEventListener('keyup', function (e) {
    if (e.code === 'Space' || e.code === 'Enter') release();
  });

  function update(dt) {
    clock += dt;
    if (st !== 'play') return;
    var c = R[round];
    if (warn > 0) {
      warn -= dt; if (warn <= 0) surge = 1.1;
    } else if (surge > 0) {
      surge -= dt;
      if (surge <= 0) nextSurge = c.gap[0] + Math.random() * (c.gap[1] - c.gap[0]);
    } else {
      nextSurge -= dt; if (nextSurge <= 0) warn = 0.75;
    }
    var pulling = surge > 0;
    if (holding) {
      dist -= (pulling ? c.reel * 0.35 : c.reel) * dt;
      tension += (c.tens + (pulling ? 60 : 0)) * dt;
    } else {
      tension -= 38 * dt;
      dist += c.drift * dt;
    }
    if (pulling) dist += 14 * dt;
    if (tension < 0) tension = 0;
    if (tension >= 100) { tension = 100; lost = T.arrebentou; st = 'lose'; holding = false; }
    else if (dist >= 100) { dist = 100; lost = T.fugiu; st = 'lose'; holding = false; }
    else if (dist <= 0) { dist = 0; holding = false; st = round >= 3 ? 'end' : 'next'; }
  }

  /* ---------- desenho ---------- */
  var WATER = 190;
  function sky() {
    var s = g.createLinearGradient(0, 0, 0, WATER);
    s.addColorStop(0, '#1f1b3a'); s.addColorStop(1, '#4b2a7b');
    g.fillStyle = s; g.fillRect(0, 0, W, WATER);
    g.fillStyle = 'rgba(255,255,255,.75)';
    for (var i = 0; i < 40; i++) {
      var x = (i * 197) % W, y = (i * 53) % (WATER - 40);
      g.fillRect(x, y, 2, 2);
    }
    g.fillStyle = '#e9e1f7'; g.beginPath(); g.arc(660, 62, 22, 0, 6.29); g.fill();
  }
  function sea() {
    var s = g.createLinearGradient(0, WATER, 0, H);
    s.addColorStop(0, '#1d5a73'); s.addColorStop(1, '#07202e');
    g.fillStyle = s; g.fillRect(0, WATER, W, H - WATER);
    g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 2;
    for (var k = 0; k < 3; k++) {
      g.beginPath();
      for (var x = 0; x <= W; x += 10) {
        var y = WATER + 4 + k * 9 + Math.sin(x / 40 + clock * (1.4 + k * .3) + k) * 3;
        if (x === 0) g.moveTo(x, y); else g.lineTo(x, y);
      }
      g.stroke();
    }
  }
  function boat(bx, by) {
    g.save(); g.translate(bx, by);
    g.rotate(Math.sin(clock * 1.6) * 0.04);
    var im = spr('thor-barco');
    if (im) { var w = 230, h = w * im.naturalHeight / im.naturalWidth; g.drawImage(im, -w / 2, 24 - h, w, h); g.restore(); return; }
    g.fillStyle = '#6b3e1f';
    g.beginPath(); g.moveTo(-70, -6); g.lineTo(70, -6); g.lineTo(52, 22); g.lineTo(-52, 22); g.closePath(); g.fill();
    g.fillStyle = '#8c5a2f'; g.fillRect(-70, -10, 140, 5);
    g.fillStyle = '#c99a3c'; g.beginPath(); g.arc(-70, -9, 6, 0, 6.29); g.fill();
    // Thor
    g.fillStyle = '#c0392b'; g.fillRect(-14, -50, 28, 44);                 // túnica
    g.fillStyle = '#e8c9a0'; g.beginPath(); g.arc(0, -62, 12, 0, 6.29); g.fill(); // rosto
    g.fillStyle = '#d4731c'; g.beginPath(); g.arc(0, -56, 11, 0.1, 3.04); g.fill(); // barba
    g.fillRect(-13, -76, 26, 8);                                            // cabelo
    g.fillStyle = '#f2f2f2'; g.fillRect(-6, -65, 3, 3); g.fillRect(3, -65, 3, 3);
    g.fillStyle = '#222'; g.fillRect(-5, -64, 1.5, 2); g.fillRect(4, -64, 1.5, 2);
    // braço e vara
    var pull = holding ? 1 : 0;
    g.strokeStyle = '#8c5a2f'; g.lineWidth = 4;
    g.beginPath(); g.moveTo(10, -36); g.lineTo(46 + pull * 4, -52 - pull * 4); g.stroke();
    g.restore();
  }
  function line(hx, hy) {
    var danger = tension > 75;
    g.strokeStyle = danger && Math.floor(clock * 10) % 2 ? '#ff5b4d' : '#f3ecd2';
    g.lineWidth = danger ? 3 : 2;
    g.beginPath(); g.moveTo(404 + 56, 150 - 48);
    g.lineTo(hx, hy); g.stroke();
  }
  function serpent(hx, hy) {
    var thrash = surge > 0, alert = warn > 0;
    g.lineCap = 'round'; g.lineJoin = 'round';
    // corpo: onda descendo do pescoço
    var pts = [];
    for (var i = 0; i <= 14; i++) {
      var yy = hy + i * 26;
      var xx = hx + Math.sin(i * 0.9 + clock * (thrash ? 7 : 2.2)) * (22 + i * 4);
      pts.push([xx, yy]);
    }
    g.strokeStyle = '#1e6b45'; g.lineWidth = 30;
    g.beginPath(); pts.forEach(function (p, i) { if (i) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); }); g.stroke();
    g.strokeStyle = '#2f9a64'; g.lineWidth = 20;
    g.beginPath(); pts.forEach(function (p, i) { if (i) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); }); g.stroke();
    g.strokeStyle = 'rgba(210,235,160,.5)'; g.lineWidth = 3; g.setLineDash([2, 12]);
    g.beginPath(); pts.forEach(function (p, i) { if (i) g.lineTo(p[0], p[1] + 4); else g.moveTo(p[0], p[1] + 4); }); g.stroke();
    g.setLineDash([]);
    // cabeça
    g.save(); g.translate(hx, hy);
    var hi = spr('serpente-cabeca');
    if (hi) { var hw = 110, hh = hw * hi.naturalHeight / hi.naturalWidth; g.drawImage(hi, -hw / 2, -hh / 2, hw, hh); g.restore(); return; }
    g.fillStyle = '#2f9a64'; g.beginPath(); g.ellipse(0, 0, 30, 22, 0, 0, 6.29); g.fill();
    g.fillStyle = '#1e6b45'; g.beginPath(); g.moveTo(-14, -18); g.lineTo(-6, -34); g.lineTo(0, -18); g.fill();
    g.beginPath(); g.moveTo(2, -19); g.lineTo(11, -34); g.lineTo(16, -17); g.fill();
    g.fillStyle = alert || thrash ? '#ff3b30' : '#ffd84a';
    g.beginPath(); g.arc(-10, -4, 5, 0, 6.29); g.arc(10, -4, 5, 0, 6.29); g.fill();
    g.fillStyle = '#000'; g.fillRect(-11, -8, 2, 8); g.fillRect(9, -8, 2, 8);
    g.strokeStyle = '#0d3a25'; g.lineWidth = 3;
    g.beginPath(); g.moveTo(-14, 10); g.quadraticCurveTo(0, thrash ? 20 : 14, 14, 10); g.stroke();
    g.restore();
  }
  function bar(x, y, w, h, v, label, zones) {
    g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(x, y, w, h);
    if (zones) {
      g.fillStyle = 'rgba(80,200,120,.35)'; g.fillRect(x, y + h * 0.25, w, h * 0.5);
      g.fillStyle = 'rgba(230,70,60,.4)'; g.fillRect(x, y, w, h * 0.25);
    }
    g.fillStyle = zones && v > 75 ? '#ff5b4d' : '#c9b3f2';
    var fh = h * v / 100; g.fillRect(x, y + h - fh, w, fh);
    g.strokeStyle = '#f3ecd2'; g.lineWidth = 2; g.strokeRect(x, y, w, h);
    g.fillStyle = '#f3ecd2'; g.font = '13px sans-serif'; g.textAlign = 'center';
    g.fillText(label, x + w / 2, y - 6);
  }
  function txt(s, x, y, size, color, align) {
    g.font = (size >= 20 ? 'bold ' : '') + size + 'px Georgia, serif';
    g.textAlign = align || 'center'; g.fillStyle = color || '#fff';
    g.fillText(s, x, y);
  }
  function veil(a) { g.fillStyle = 'rgba(10,8,25,' + Math.max(a, .7) + ')'; g.fillRect(0, 0, W, H); }

  function draw() {
    g.clearRect(0, 0, W, H);
    sky(); sea();
    var shake = surge > 0 ? (Math.random() - .5) * 5 : 0;
    g.save(); g.translate(shake, shake);
    var hy = WATER + 40 + dist * 2.2;
    var hx = 404 + Math.sin(clock * 1.3) * 12 + (surge > 0 ? Math.sin(clock * 30) * 8 : 0);
    if (st === 'end') hy = WATER - 10;
    serpent(hx, hy);
    line(hx, hy - 20);
    boat(404, 150);
    g.restore();
    if (st !== 'menu') {
      bar(40, 90, 26, 280, tension, T.tensao, true);
      bar(734, 90, 26, 280, 100 - dist, T.dist, false);
      txt(T.rodada + ' ' + round + '/3', W / 2, 28, 16, '#f3ecd2');
    }
    if (warn > 0) txt(T.aviso, W / 2, 70, 24, '#ff7a6b');

    if (st === 'menu') {
      veil(.55);
      txt(T.titulo, W / 2, 150, 44, '#fff');
      txt(T.sub, W / 2, 205, 19, '#e9e1f7');
      txt(T.toque, W / 2, 300, 17, '#c9b3f2');
    } else if (st === 'lose') {
      veil(.6);
      txt(lost, W / 2, 190, 36, '#ff9a8d');
      txt(T.de_novo, W / 2, 250, 18, '#e9e1f7');
    } else if (st === 'next') {
      veil(.5);
      txt(T.proxima, W / 2, 215, 26, '#fff');
    } else if (st === 'end') {
      veil(.55);
      txt(T.fim1, W / 2, 150, 28, '#fff');
      txt(T.fim2, W / 2, 205, 20, '#e9e1f7');
      txt(T.fim3, W / 2, 235, 20, '#e9e1f7');
      txt(T.jogar, W / 2, 310, 17, '#c9b3f2');
    }
  }

  var last = 0;
  function frame(ts) {
    var dt = Math.min(0.05, (ts - last) / 1000 || 0); last = ts;
    update(dt); draw(); requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  window.__thor = { press: press, release: release, state: function () { return { st: st, dist: dist, tension: tension, round: round }; } };
})();
