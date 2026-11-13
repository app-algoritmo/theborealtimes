/* Arrastar o navio — puxe no ritmo certo para levar o barco por terra até Constantinopla. */
BTJogo.registrar({
  canvas: 'jogo-arrasto',
  t: {
    pt: {
      titulo: 'Arrastar o navio',
      sub: 'Entre rios, os vikings arrastavam o barco por terra. Toque (ou use a barra de espaço) quando o marcador passar pela faixa verde para puxar a corda. No centro, a puxada é perfeita. Chegue a Constantinopla antes do anoitecer.',
      toque: 'Toque para começar', tempo: 'Tempo', ok: 'Força!', perf: 'Perfeito!', erro: 'Escorregou!',
      perdeu: 'Anoiteceu', p1: 'O navio ficou pelo caminho.', de_novo: 'Toque para tentar de novo',
      v1: 'Constantinopla à vista!',
      v2: 'Os rus carregavam ou arrastavam os barcos por terra nas corredeiras dos rios, como descreveu o imperador Constantino VII por volta de 950. O ritmo, o tempo e a corda são invenção do jogo.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: 'Drag the ship',
      sub: 'Between rivers, the Vikings dragged their boats overland. Tap (or use the space bar) when the marker passes the green zone to pull the rope. In the centre, the pull is perfect. Reach Constantinople before nightfall.',
      toque: 'Tap to start', tempo: 'Time', ok: 'Heave!', perf: 'Perfect!', erro: 'Slipped!',
      perdeu: 'Night has fallen', p1: 'The ship stayed on the road.', de_novo: 'Tap to try again',
      v1: 'Constantinople in sight!',
      v2: 'The Rus carried or dragged their boats overland at the river rapids, as Emperor Constantine VII described around 950. The rhythm, the clock and the rope are made up for the game.',
      jogar: 'Tap to play again'
    },
    no: {
      titulo: 'Dra skipet',
      sub: 'Mellom elvene dro vikingene båtene sine over land. Trykk (eller bruk mellomromstasten) når markøren passerer den grønne sonen for å dra i tauet. I midten er draget perfekt. Nå Konstantinopel før natten faller på.',
      toque: 'Trykk for å starte', tempo: 'Tid', ok: 'Dra!', perf: 'Perfekt!', erro: 'Gled!',
      perdeu: 'Natten har falt på', p1: 'Skipet ble stående på veien.', de_novo: 'Trykk for å prøve igjen',
      v1: 'Konstantinopel i sikte!',
      v2: 'Rusene bar eller dro båtene sine over land ved strykene i elvene, slik keiser Konstantin VII beskrev omkring 950. Rytmen, klokken og tauet er diktet opp for spillet.',
      jogar: 'Trykk for å spille igjen'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt, TEMPO = 90;
    var st = 'menu', t = 0, prog = 0, fase = 0, msg = '', msgT = 0, msgC = '#fff', rolo = 0;
    function reset() { st = 'jogo'; t = 0; prog = 0; fase = 0; msg = ''; msgT = 0; }
    function agulha() { return 0.5 + 0.5 * Math.sin(fase); }
    function puxa() {
      var d = Math.abs(agulha() - 0.5);
      if (d < 0.08) { prog += 0.085; msg = T.perf; msgC = '#ffe28a'; }
      else if (d < 0.22) { prog += 0.05; msg = T.ok; msgC = '#9dffb0'; }
      else { prog = Math.max(0, prog - 0.02); msg = T.erro; msgC = '#ff9a8d'; }
      msgT = 0.7; rolo += 1;
      if (prog >= 1) { prog = 1; st = 'win'; }
    }
    function acao() { if (st === 'menu' || st === 'lose') reset(); else if (st === 'win') st = 'menu'; else puxa(); }
    return {
      pausar: function () {}, down: acao,
      key: function (c, d) { if (d && (c === 'Space' || c === 'Enter')) acao(); },
      update: function (dt) {
        if (msgT > 0) msgT -= dt;
        if (st !== 'jogo') return;
        t += dt; fase += (3.1 + prog * 1.7) * dt; prog = Math.max(0, prog - 0.01 * dt);
        if (t >= TEMPO) st = 'lose';
      },
      draw: function () {
        var W = api.w, H = api.h, c = api.clock, noite = Math.min(1, t / TEMPO);
        var hor = H * 0.5;
        function mix(a, b, k) { return Math.round(a + (b - a) * k); }
        var s = g.createLinearGradient(0, 0, 0, hor);
        s.addColorStop(0, 'rgb(' + mix(90, 20, noite) + ',' + mix(160, 14, noite) + ',' + mix(220, 50, noite) + ')');
        s.addColorStop(1, 'rgb(' + mix(250, 230, noite) + ',' + mix(220, 110, noite) + ',' + mix(170, 70, noite) + ')');
        g.fillStyle = s; g.fillRect(0, 0, W, hor);
        // Constantinopla ao longe, cresce com o progresso
        var esc = 0.35 + prog * 0.75, bx = W * 0.82, by = hor;
        g.save(); g.translate(bx, by); g.scale(esc, esc); g.fillStyle = 'rgba(40,30,70,' + (0.6 + prog * 0.4) + ')';
        g.fillRect(-120, -34, 240, 34);
        [[-70, 48], [0, 70], [64, 44]].forEach(function (d) { g.beginPath(); g.arc(d[0], -34, d[1] / 2 + 12, 3.14, 6.29); g.fill(); g.fillRect(d[0] - 3, -34 - d[1] / 2 - 26, 6, 18); });
        g.fillStyle = '#ffd88a'; g.beginPath(); g.arc(0, -34 - 41, 5, 0, 6.29); g.fill();
        g.restore();
        // chão
        g.fillStyle = '#4c6a38'; g.fillRect(0, hor, W, H - hor);
        g.fillStyle = '#6f5a3a'; g.fillRect(0, hor + (H - hor) * 0.38, W, (H - hor) * 0.34);
        // navio sobre rolos
        var sx = W * 0.1 + prog * W * 0.52, sy = hor + (H - hor) * 0.36;
        g.fillStyle = '#4a2f18';
        for (var i = -2; i < 4; i++) { var rx = sx + i * 54 - (rolo * 18 % 54); g.beginPath(); g.ellipse(rx, sy + 50, 9, 14, 0, 0, 6.29); g.fill(); }
        g.fillStyle = '#7a4e24'; g.beginPath(); g.moveTo(sx - 20, sy); g.lineTo(sx + 170, sy); g.lineTo(sx + 140, sy + 40); g.lineTo(sx + 10, sy + 40); g.closePath(); g.fill();
        g.fillStyle = '#a8442c'; g.beginPath(); g.moveTo(sx + 170, sy); g.lineTo(sx + 190, sy - 26); g.lineTo(sx + 180, sy); g.fill();
        for (var j = 0; j < 6; j++) { g.fillStyle = j % 2 ? '#e8c46a' : '#a8442c'; g.beginPath(); g.arc(sx + 20 + j * 24, sy + 6, 8, 0, 6.29); g.fill(); }
        // vikings puxando
        for (var v = 0; v < 3; v++) {
          var vx = sx + 190 + 40 + v * 30, bob = Math.sin(c * 6 + v) * 2;
          g.strokeStyle = '#2b1a0a'; g.lineWidth = 2; g.beginPath(); g.moveTo(sx + 190, sy + 4); g.lineTo(vx, sy + 20 + bob); g.stroke();
          g.fillStyle = '#b8bcc4'; g.beginPath(); g.arc(vx, sy + 4 + bob, 7, 3.14, 6.29); g.fill();
          g.fillStyle = '#9a3a2a'; g.fillRect(vx - 6, sy + 6 + bob, 12, 18);
        }
        if (st !== 'menu') {
          txt(T.tempo + ' ' + Math.max(0, Math.ceil(TEMPO - t)), 24, 34, 16, '#fff', 'left');
          g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(24, 44, 150, 8); g.fillStyle = '#ffd88a'; g.fillRect(24, 44, 150 * prog, 8);
          // medidor
          var mw = Math.min(W - 60, 340), mx = (W - mw) / 2, my = H - 64;
          g.fillStyle = 'rgba(0,0,0,.5)'; g.fillRect(mx, my, mw, 22);
          g.fillStyle = '#3f9a52'; g.fillRect(mx + mw * 0.28, my, mw * 0.44, 22);
          g.fillStyle = '#ffe28a'; g.fillRect(mx + mw * 0.42, my, mw * 0.16, 22);
          g.fillStyle = '#fff'; g.fillRect(mx + mw * agulha() - 3, my - 6, 6, 34);
          if (msgT > 0) { g.globalAlpha = Math.min(1, msgT * 2); txt(msg, W / 2, my - 22, 22, msgC); g.globalAlpha = 1; }
        }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [T.p1], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
