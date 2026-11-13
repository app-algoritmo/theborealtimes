/* O pente de Rögnvald — desembarace os dez anos de cabelo de Harald. */
BTJogo.registrar({
  canvas: 'jogo-harald',
  t: {
    pt: {
      titulo: 'O pente de Rögnvald', sub: 'Harald jurou não cortar nem pentear o cabelo até reinar sobre toda a Noruega. Passe o dedo (ou o mouse) sobre os nós para desembaraçar.',
      toque: 'Toque para começar', nos: 'Nós',
      v1: 'Cabelo Belo!',
      v2: 'Segundo a Heimskringla, de Snorri Sturluson, depois da vitória em Hafrsfjord Harald cortou o cabelo, e Rögnvald o penteou. Daí o apelido. Os historiadores veem a cena do juramento com cautela, e o jogo simplifica tudo.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: "Rögnvald's comb", sub: 'Harald swore not to cut or comb his hair until he ruled all of Norway. Drag your finger (or mouse) over the knots to untangle them.',
      toque: 'Tap to start', nos: 'Knots',
      v1: 'Fairhair!',
      v2: 'According to Snorri Sturluson’s Heimskringla, after the victory at Hafrsfjord Harald cut his hair, and Rögnvald combed it. Hence the nickname. Historians view the oath scene with caution, and the game simplifies everything.',
      jogar: 'Tap to play again'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt;
    var st = 'menu', nos = [], total = 0, ant = null, premido = false, strands = 17;
    function layout() {
      var W = api.w, H = api.h; nos = []; var topo = Math.min(210, H * 0.3), alvo = 22;
      for (var i = 0; i < alvo; i++) {
        var s = i % strands, f = (s + 0.5) / strands;
        nos.push({ x: W * 0.12 + W * 0.76 * f + (Math.random() - .5) * 20, y: topo + 40 + ((i * 53) % 100) / 100 * (H - topo - 100), l: 1 });
      }
      total = nos.length;
    }
    function reset() { st = 'jogo'; layout(); }
    function restantes() { return nos.filter(function (n) { return n.l > 0; }).length; }
    function limpar(x, y) {
      if (st !== 'jogo') return;
      if (ant) {
        var d = Math.hypot(x - ant[0], y - ant[1]);
        nos.forEach(function (n) { if (n.l > 0 && Math.hypot(n.x - x, n.y - y) < 42) n.l -= d / 75; });
        if (restantes() === 0) st = 'win';
      }
      ant = [x, y];
    }
    return {
      down: function (x, y) { if (st === 'menu') reset(); else if (st === 'win') st = 'menu'; else { premido = true; ant = [x, y]; } },
      move: function (x, y, p) { if (p) limpar(x, y); },
      up: function () { premido = false; ant = null; }, pausar: function () { ant = null; },
      resize: function () { if (st !== 'jogo') layout(); },
      key: function (c, d) { if ((c === 'Space' || c === 'Enter') && d) { if (st === 'menu') reset(); else if (st === 'win') st = 'menu'; } },
      update: function () {},
      draw: function () {
        var W = api.w, H = api.h, topo = Math.min(210, H * 0.3);
        var s = g.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#2a3a5c'); s.addColorStop(1, '#101828'); g.fillStyle = s; g.fillRect(0, 0, W, H);
        if (st === 'menu' && !nos.length) layout();
        var rest = st === 'win' ? 0 : restantes(), f = total ? rest / total : 1;
        var c = api.clock;
        for (var i = 0; i < strands; i++) {
          var x0 = W * 0.12 + W * 0.76 * ((i + 0.5) / strands);
          g.strokeStyle = i % 2 ? '#e3b73c' : '#f0cc5a'; g.lineWidth = 7; g.lineCap = 'round'; g.beginPath();
          for (var y = topo; y <= H; y += 14) {
            var amp = 4 + 26 * f, xx = x0 + Math.sin(y / 38 + i * 1.7 + c * 0.8) * amp + Math.sin(y / 17 + i) * amp * 0.5;
            if (y === topo) g.moveTo(xx, y); else g.lineTo(xx, y);
          }
          g.stroke();
        }
        nos.forEach(function (n) {
          if (n.l <= 0) return;
          g.strokeStyle = '#5a3a14'; g.lineWidth = 3; g.beginPath();
          for (var a = 0; a < 14; a += 0.4) { var r = (4 + a * 1.6) * Math.min(1, n.l + 0.3); g.lineTo(n.x + Math.cos(a * 1.6) * r, n.y + Math.sin(a * 1.6) * r); }
          g.stroke();
        });
        // rosto
        var cx = W / 2;
        g.fillStyle = '#e3b73c'; g.beginPath(); g.ellipse(cx, topo - 36, 70, 56, 0, 0, 6.29); g.fill();
        g.fillStyle = '#e8c9a0'; g.beginPath(); g.ellipse(cx, topo - 30, 50, 44, 0, 0, 6.29); g.fill();
        g.fillStyle = '#222'; g.beginPath(); g.arc(cx - 16, topo - 38, 4, 0, 6.29); g.arc(cx + 16, topo - 38, 4, 0, 6.29); g.fill();
        g.fillStyle = '#d4731c'; g.beginPath(); g.ellipse(cx, topo - 6, 36, 22, 0, 0, Math.PI); g.fill();
        if (st === 'win') { g.fillStyle = '#ffd84a'; g.beginPath(); g.moveTo(cx - 40, topo - 76); g.lineTo(cx - 30, topo - 104); g.lineTo(cx - 10, topo - 84); g.lineTo(cx, topo - 108); g.lineTo(cx + 10, topo - 84); g.lineTo(cx + 30, topo - 104); g.lineTo(cx + 40, topo - 76); g.closePath(); g.fill(); }
        if (st !== 'menu') txt(T.nos + ': ' + rest + '/' + total, 24, 34, 16, '#fff', 'left');
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd84a');
      }
    };
  }
});
