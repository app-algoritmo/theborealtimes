/* Gleipnir — junte as seis coisas que não existem e prenda o lobo Fenrir. */
BTJogo.registrar({
  canvas: 'jogo-fenrir',
  t: {
    pt: {
      titulo: 'Gleipnir, a fita impossível',
      sub: 'Os anões precisam de seis coisas que já não existem. Toque nas bolhas certas, sem tocar nas coisas comuns. Depois, segure a fita no ponto certo para prender o lobo.',
      toque: 'Toque para começar', vidas: 'Erros',
      reais: ['passos de gato', 'barba de mulher', 'raízes de montanha', 'tendões de urso', 'hálito de peixe', 'saliva de pássaro'],
      falsas: ['corrente de ferro', 'anel de ouro', 'fio de lã', 'corda de linho', 'faca de bronze'],
      fase2: 'Segure a fita: mantenha o fio na faixa verde até o lobo se render.',
      segure: 'Segure para apertar, solte para folgar',
      perdeu: 'Fenrir se soltou', de_novo: 'Toque para tentar de novo',
      v1: 'Fenrir está preso!',
      v2: 'Na história de Snorri, quem faz a fita são os anões, e Fenrir só aceita ser preso se um deus puser a mão na sua boca. Týr a põe, e perde a mão quando o lobo vê que foi enganado. No jogo, juntar as seis coisas é invenção.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: 'Gleipnir, the impossible ribbon',
      sub: 'The dwarfs need six things that no longer exist. Tap the right bubbles, and avoid the ordinary things. Then hold the ribbon at the right tension to bind the wolf.',
      toque: 'Tap to start', vidas: 'Mistakes',
      reais: ["a cat's footsteps", "a woman's beard", "a mountain's roots", "a bear's sinews", "a fish's breath", "a bird's spittle"],
      falsas: ['iron chain', 'gold ring', 'wool thread', 'linen rope', 'bronze knife'],
      fase2: 'Hold the ribbon: keep the line in the green zone until the wolf gives in.',
      segure: 'Hold to tighten, release to loosen',
      perdeu: 'Fenrir broke free', de_novo: 'Tap to try again',
      v1: 'Fenrir is bound!',
      v2: 'In Snorri’s account, the dwarfs make the ribbon, and Fenrir only agrees to be bound if a god puts a hand in his mouth. Týr does, and loses his hand when the wolf sees he was tricked. In the game, gathering the six things is made up.',
      jogar: 'Tap to play again'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt;
    var st = 'menu', bolhas = [], pegas = [], vidas = 3, spawn = 0;
    var v = 50, prog = 3, holding = false, tt = 0;
    function reset() { st = 'coleta'; bolhas = []; pegas = []; vidas = 3; spawn = 0.3; v = 50; prog = 3; holding = false; tt = 0; }
    function faltam() { var r = []; for (var i = 0; i < 6; i++) if (pegas.indexOf(i) < 0) r.push(i); return r; }
    function criar() {
      var f = faltam(), real = f.length && Math.random() < 0.58, idx, label;
      if (real) { idx = f[Math.floor(Math.random() * f.length)]; label = T.reais[idx]; }
      else { idx = -1; label = T.falsas[Math.floor(Math.random() * T.falsas.length)]; }
      bolhas.push({ x: 70 + Math.random() * (api.w - 140), y: api.h + 60, v: 80 + Math.random() * 30, idx: idx, label: label, ph: Math.random() * 6 });
    }
    function lobo(cx, cy, esforco) {
      g.save(); g.translate(cx, cy);
      g.fillStyle = '#6b6f7a'; g.beginPath(); g.ellipse(-40, 20, 90, 46, 0, 0, 6.29); g.fill();
      g.fillRect(-110, 40, 14, 44); g.fillRect(-70, 44, 14, 40); g.fillRect(-10, 44, 14, 40);
      g.beginPath(); g.ellipse(60, -8 - esforco * 6, 44, 34, -0.15, 0, 6.29); g.fill();
      g.beginPath(); g.moveTo(40, -34 - esforco * 6); g.lineTo(46, -64 - esforco * 6); g.lineTo(62, -38 - esforco * 6); g.fill();
      g.fillStyle = '#e8b923'; g.beginPath(); g.arc(66, -14 - esforco * 6, 5, 0, 6.29); g.fill();
      g.fillStyle = '#222'; g.beginPath(); g.moveTo(88, -4 - esforco * 6); g.lineTo(104, 2 - esforco * 6); g.lineTo(88, 6 - esforco * 6); g.fill();
      g.restore();
    }
    function fundo() {
      var W = api.w, H = api.h, s = g.createLinearGradient(0, 0, 0, H);
      s.addColorStop(0, st === 'prende' ? '#241a3a' : '#2a1a14'); s.addColorStop(1, '#0d0a12'); g.fillStyle = s; g.fillRect(0, 0, W, H);
      var f = g.createRadialGradient(W / 2, H, 10, W / 2, H, Math.max(W, H) * 0.7); f.addColorStop(0, 'rgba(255,140,40,.35)'); f.addColorStop(1, 'rgba(255,140,40,0)');
      g.fillStyle = f; g.fillRect(0, 0, W, H);
    }
    function down(x, y) {
      if (st === 'menu' || st === 'lose') { reset(); return; }
      if (st === 'win') { st = 'menu'; return; }
      if (st === 'prende') { holding = true; return; }
      for (var i = bolhas.length - 1; i >= 0; i--) {
        var b = bolhas[i], dx = b.x - x, dy = b.y - y;
        if (dx * dx + dy * dy < 56 * 56) {
          bolhas.splice(i, 1);
          if (b.idx >= 0) { if (pegas.indexOf(b.idx) < 0) pegas.push(b.idx); if (pegas.length >= 6) { st = 'prende'; v = 50; prog = 3; tt = 0; } }
          else { vidas--; if (vidas <= 0) st = 'lose'; }
          return;
        }
      }
    }
    return {
      down: down, up: function () { holding = false; }, pausar: function () { holding = false; },
      key: function (c, d) { if (c === 'Space' || c === 'Enter') { if (d) down(-999, -999); else holding = false; } },
      update: function (dt) {
        tt += dt;
        if (st === 'coleta') {
          spawn -= dt; if (spawn <= 0) { spawn = 0.8; criar(); }
          for (var i = bolhas.length - 1; i >= 0; i--) { bolhas[i].y -= bolhas[i].v * dt; if (bolhas[i].y < -70) bolhas.splice(i, 1); }
        } else if (st === 'prende') {
          var pert = 28 * Math.sin(tt * 2.3) + 16 * Math.sin(tt * 5.1 + 1);
          v += ((holding ? 46 : -34) + pert) * dt; v = Math.max(0, Math.min(100, v));
          var dentro = v >= 38 && v <= 66; prog += (dentro ? 1 : -0.7) * dt;
          if (prog >= 9) st = 'win'; else if (prog <= 0) st = 'lose';
        }
      },
      draw: function () {
        var W = api.w, H = api.h, cx = W / 2;
        fundo();
        if (st === 'coleta') {
          bolhas.forEach(function (b) {
            var bx = b.x + Math.sin(api.clock * 1.5 + b.ph) * 14;
            g.fillStyle = 'rgba(200,180,255,.22)'; g.beginPath(); g.arc(bx, b.y, 52, 0, 6.29); g.fill();
            g.strokeStyle = 'rgba(220,205,255,.8)'; g.lineWidth = 2; g.stroke();
            api.quebra(b.label, 86, 14).forEach(function (l, i, a) { txt(l, bx, b.y + 5 + (i - (a.length - 1) / 2) * 16, 14, '#fff'); });
            b.x2 = bx;
          });
          bolhas.forEach(function (b) { b.x = b.x2 || b.x; });
          txt(T.vidas + ': ' + (3 - vidas) + '/3', 24, 34, 15, '#fff', 'left');
          for (var i = 0; i < 6; i++) { g.fillStyle = pegas.indexOf(i) >= 0 ? '#ffd88a' : 'rgba(255,255,255,.2)'; g.beginPath(); g.arc(W / 2 - 75 + i * 30, 62, 9, 0, 6.29); g.fill(); }
        } else if (st === 'prende' || st === 'win' || st === 'lose') {
          var cy = H * 0.5, esf = st === 'prende' ? Math.abs(Math.sin(tt * 4)) * (1 - v / 140) : 0;
          g.fillStyle = '#555a66'; g.fillRect(24, cy - 60, 40, 150);
          lobo(W * 0.62, cy, esf);
          var fim = W * 0.62 + 40;
          g.strokeStyle = '#ffd88a'; g.lineWidth = 2 + v / 25; g.beginPath(); g.moveTo(64, cy + 10); g.quadraticCurveTo((64 + fim) / 2, cy + 10 + (100 - v) * 0.5 - 20, fim, cy + 30); g.stroke();
          var mx = Math.min(W - 70, 420), mx0 = (W - mx) / 2, my = H - 110;
          g.fillStyle = 'rgba(255,255,255,.15)'; g.fillRect(mx0, my, mx, 22);
          g.fillStyle = 'rgba(80,200,120,.55)'; g.fillRect(mx0 + mx * 0.38, my, mx * 0.28, 22);
          g.fillStyle = '#fff'; g.fillRect(mx0 + mx * v / 100 - 4, my - 6, 8, 34);
          txt(T.segure, cx, my + 52, 15, '#e9e1f7');
          g.fillStyle = 'rgba(255,255,255,.2)'; g.fillRect(mx0, 40, mx, 8); g.fillStyle = '#ffd88a'; g.fillRect(mx0, 40, mx * Math.max(0, Math.min(1, prog / 9)), 8);
          if (st === 'prende') api.quebra(T.fase2, W - 60, 15).forEach(function (l, i) { txt(l, cx, 72 + i * 20, 15, '#e9e1f7'); });
        }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
