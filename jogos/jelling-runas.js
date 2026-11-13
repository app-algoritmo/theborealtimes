/* Runas de Jelling — arraste de ponto a ponto para gravar cada runa. */
BTJogo.registrar({
  canvas: 'jogo-runas',
  t: {
    pt: {
      titulo: 'Gravar as runas',
      sub: 'Harald Dente Azul manda gravar uma pedra em Jelling. Arraste o dedo (ou o mouse) de um ponto ao outro, seguindo o traço que brilha, para gravar cada runa.',
      toque: 'Toque para começar', runa: 'Runa',
      nomes: ['fé', 'þurs', 'kaun', 'hagall', 'nauðr'],
      v1: 'A pedra está gravada!',
      v2: 'A grande pedra de Jelling, ligada a Harald Dente Azul e datada por volta de 965, usa as runas do futhark recente. Os desenhos do jogo são simplificados, e a escolha das cinco runas é nossa.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: 'Carve the runes',
      sub: 'Harald Bluetooth orders a stone carved at Jelling. Drag your finger (or mouse) from one dot to the next, following the glowing line, to carve each rune.',
      toque: 'Tap to start', runa: 'Rune',
      nomes: ['fé', 'þurs', 'kaun', 'hagall', 'nauðr'],
      v1: 'The stone is carved!',
      v2: 'The great Jelling stone, linked to Harald Bluetooth and dated to around 965, uses the Younger Futhark runes. The drawings in the game are simplified, and the choice of the five runes is ours.',
      jogar: 'Tap to play again'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt;
    // cada runa: lista de traços [x1,y1,x2,y2] em grade 0..1 (x) por 0..3 (y)
    var RUNAS = [
      [[0, 0, 0, 3], [0, 1, 1, 0], [0, 2, 1, 1]],
      [[0, 0, 0, 3], [0, 1, 1, 1.5], [1, 1.5, 0, 2]],
      [[0, 0, 0, 3], [0, 1.5, 1, 0.5]],
      [[0, 0, 0, 3], [1, 0, 1, 3], [0, 1, 1, 2]],
      [[0, 0, 0, 3], [-0.6, 1, 0.6, 2]]
    ];
    var st = 'menu', ri = 0, feitos = [], pontoIni = null, pos = null, gravadas = [];
    function reset() { st = 'jogo'; ri = 0; feitos = []; pontoIni = null; gravadas = []; }
    function mapa() {
      var W = api.w, H = api.h, s = Math.min(W * 0.5, H * 0.14), x0 = W / 2 - s * 0.5, y0 = H / 2 - s * 1.5 + 10; return { s: s, x0: x0, y0: y0 };
    }
    function pt(x, y) { var m = mapa(); return [m.x0 + x * m.s, m.y0 + y * m.s]; }
    function proximoTraco() { var tr = RUNAS[ri]; for (var i = 0; i < tr.length; i++) if (feitos.indexOf(i) < 0) return i; return -1; }
    function down(x, y) {
      if (st === 'menu') { reset(); return; } if (st === 'win') { st = 'menu'; return; }
      var i = proximoTraco(); if (i < 0) return; var t = RUNAS[ri][i], p = pt(t[0], t[1]);
      if (Math.hypot(p[0] - x, p[1] - y) < 40) pontoIni = i;
    }
    function move(x, y, p) {
      pos = [x, y]; if (!p || pontoIni === null || st !== 'jogo') return;
      var t = RUNAS[ri][pontoIni], q = pt(t[2], t[3]);
      if (Math.hypot(q[0] - x, q[1] - y) < 36) { feitos.push(pontoIni); pontoIni = null; if (proximoTraco() < 0) { gravadas.push(ri); ri++; feitos = []; if (ri >= RUNAS.length) st = 'win'; } }
    }
    return {
      down: function (x, y) { pos = [x, y]; down(x, y); }, move: move, up: function () { pontoIni = null; }, pausar: function () { pontoIni = null; },
      key: function (c, d) { if ((c === 'Space' || c === 'Enter') && d && st !== 'jogo') down(-999, -999); },
      update: function () {},
      draw: function () {
        var W = api.w, H = api.h, cx = W / 2;
        var s = g.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#5f7a52'); s.addColorStop(1, '#2d3d28'); g.fillStyle = s; g.fillRect(0, 0, W, H);
        var pw = Math.min(W * 0.78, 360), ph = H * 0.74, px = (W - pw) / 2, py = H * 0.13;
        g.fillStyle = '#8a8d92'; g.beginPath(); g.moveTo(px + 30, py + ph); g.lineTo(px, py + 40); g.quadraticCurveTo(px + pw / 2, py - 20, px + pw, py + 40); g.lineTo(px + pw - 30, py + ph); g.closePath(); g.fill();
        g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 3; g.stroke();
        if (st !== 'menu') {
          // runas já gravadas, pequenas, à esquerda; runa atual grande
          var ms = mapa();
          if (st === 'jogo') {
            RUNAS[ri].forEach(function (t, i) {
              var a = pt(t[0], t[1]), b = pt(t[2], t[3]), feito = feitos.indexOf(i) >= 0, prox = i === proximoTraco();
              g.strokeStyle = feito ? '#2a1a10' : prox ? 'rgba(255,230,120,.9)' : 'rgba(255,255,255,.35)'; g.lineWidth = feito ? 7 : 4; g.lineCap = 'round'; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
              if (!feito) { [a, b].forEach(function (p, k) { g.fillStyle = prox ? (k === 0 ? '#ffe678' : '#fff') : 'rgba(255,255,255,.5)'; g.beginPath(); g.arc(p[0], p[1], prox ? 11 : 7, 0, 6.29); g.fill(); }); }
            });
          }
          // miniaturas gravadas
          for (var k = 0; k < RUNAS.length; k++) {
            var gx = cx - (RUNAS.length - 1) * 20 + k * 40, gy = H * 0.9;
            g.strokeStyle = (k < gravadas.length || st === 'win') ? '#2a1a10' : 'rgba(255,255,255,.35)'; g.lineWidth = 3;
            RUNAS[k].forEach(function (t) { g.beginPath(); g.moveTo(gx + t[0] * 10, gy - 15 + t[1] * 10); g.lineTo(gx + t[2] * 10, gy - 15 + t[3] * 10); g.stroke(); });
          }
          if (st === 'jogo') txt(T.runa + ' ' + (ri + 1) + '/' + RUNAS.length + ' · ' + T.nomes[ri], 24, 34, 15, '#fff', 'left');
          if (pontoIni !== null && pos) { var t = RUNAS[ri][pontoIni], a2 = pt(t[0], t[1]); g.strokeStyle = '#ffe678'; g.lineWidth = 5; g.beginPath(); g.moveTo(a2[0], a2[1]); g.lineTo(pos[0], pos[1]); g.stroke(); }
        }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
