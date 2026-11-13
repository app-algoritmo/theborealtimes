/* Escavação em Gjermundbu — tire a terra e descubra o capacete (sem chifres). */
BTJogo.registrar({
  canvas: 'jogo-capacete',
  t: {
    pt: {
      titulo: 'Escavação em Gjermundbu',
      sub: 'Em 1943, num túmulo viking em Ringerike, apareceu um capacete de ferro. Passe o dedo (ou o mouse) sobre a terra para limpá-lo com cuidado.',
      toque: 'Toque para começar', limpo: 'Limpo',
      v1: 'Sem chifres!',
      v2: 'O capacete de Gjermundbu é o único capacete viking quase inteiro encontrado até hoje: redondo, de ferro, com proteção para os olhos. Não tem chifres. A escavação do jogo é uma simplificação.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: 'Digging at Gjermundbu',
      sub: 'In 1943, in a Viking grave in Ringerike, an iron helmet turned up. Drag your finger (or mouse) over the soil to carefully clean it.',
      toque: 'Tap to start', limpo: 'Cleaned',
      v1: 'No horns!',
      v2: 'The Gjermundbu helmet is the only nearly complete Viking helmet found so far: round, iron, with eye protection. It has no horns. The digging in the game is a simplification.',
      jogar: 'Tap to play again'
    },
    no: {
      titulo: 'Utgraving ved Gjermundbu',
      sub: 'I 1943 dukket det opp en jernhjelm i en vikinggrav på Ringerike. Dra fingeren (eller musen) over jorden for å rense den forsiktig.',
      toque: 'Trykk for å starte', limpo: 'Renset',
      v1: 'Ingen horn!',
      v2: 'Gjermundbu-hjelmen er den eneste nesten komplette vikinghjelmen som er funnet så langt: rund, av jern, med øyebeskyttelse. Den har ingen horn. Graveprosessen i spillet er en forenkling.',
      jogar: 'Trykk for å spille igjen'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt;
    var st = 'menu', solo = null, sg = null, pct = 0, ant = null, tAm = 0, W0 = 0, H0 = 0, S = 1;
    function novoSolo() {
      var W = api.w, H = api.h, c = document.createElement('canvas');
      S = 0.5; c.width = Math.max(2, Math.round(W * S)); c.height = Math.max(2, Math.round(H * S)); var x = c.getContext('2d');
      x.scale(S, S); x.fillStyle = '#5a4128'; x.fillRect(0, 0, W, H);
      for (var i = 0; i < 700; i++) { x.fillStyle = 'rgba(' + (60 + Math.random() * 60 | 0) + ',' + (40 + Math.random() * 40 | 0) + ',25,.6)'; x.beginPath(); x.arc(Math.random() * W, Math.random() * H, 2 + Math.random() * 7, 0, 6.29); x.fill(); }
      if (solo && W0) { x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = 'destination-out'; x.restore(); }
      solo = c; sg = x; W0 = W; H0 = H; pct = 0;
    }
    function reset() { st = 'jogo'; novoSolo(); }
    function cava(x, y) {
      if (st !== 'jogo' || !sg) return;
      sg.save(); sg.globalCompositeOperation = 'destination-out'; sg.lineCap = 'round'; sg.lineWidth = 76; sg.beginPath();
      if (ant) sg.moveTo(ant[0], ant[1]); else sg.moveTo(x, y); sg.lineTo(x, y); sg.stroke(); sg.restore(); ant = [x, y];
    }
    function mede() {
      var w = 40, h = 40, c = document.createElement('canvas'); c.width = w; c.height = h; var x = c.getContext('2d'); x.drawImage(solo, 0, 0, w, h);
      var d = x.getImageData(0, 0, w, h).data, n = 0; for (var i = 3; i < d.length; i += 4) if (d[i] < 40) n++;
      pct = n / (w * h);
    }
    function capacete(cx, cy, r) {
      g.save(); g.translate(cx, cy);
      var gr = g.createLinearGradient(-r, -r, r, r); gr.addColorStop(0, '#9aa3ad'); gr.addColorStop(1, '#4b535c');
      g.fillStyle = gr; g.beginPath(); g.arc(0, 0, r, Math.PI, 0); g.lineTo(r, r * 0.35); g.lineTo(-r, r * 0.35); g.closePath(); g.fill();
      g.strokeStyle = '#2f353b'; g.lineWidth = 4; g.beginPath(); g.moveTo(0, -r); g.lineTo(0, r * 0.35); g.moveTo(-r, 0); g.lineTo(r, 0); g.stroke();
      g.strokeStyle = '#2f353b'; g.lineWidth = 5; g.beginPath(); g.arc(-r * 0.36, r * 0.12, r * 0.22, 0, 6.29); g.arc(r * 0.36, r * 0.12, r * 0.22, 0, 6.29); g.stroke();
      g.beginPath(); g.moveTo(-r * 0.14, r * 0.12); g.lineTo(r * 0.14, r * 0.12); g.stroke();
      g.restore();
    }
    return {
      down: function (x, y) { if (st === 'menu') reset(); else if (st === 'win') st = 'menu'; else { ant = [x, y]; cava(x, y); } },
      move: function (x, y, p) { if (p) cava(x, y); }, up: function () { ant = null; }, pausar: function () { ant = null; },
      resize: function () { if (st === 'jogo' && solo) { var old = solo; novoSolo(); sg.save(); sg.setTransform(1, 0, 0, 1, 0, 0); sg.globalCompositeOperation = 'source-over'; sg.restore(); void old; } },
      key: function (c, d) { if ((c === 'Space' || c === 'Enter') && d) { if (st === 'menu') reset(); else if (st === 'win') st = 'menu'; } },
      update: function (dt) {
        if (st !== 'jogo') return; tAm += dt;
        if (tAm > 0.3) { tAm = 0; mede(); if (pct >= 0.88) st = 'win'; }
      },
      draw: function () {
        var W = api.w, H = api.h, cx = W / 2, cy = H / 2, r = Math.min(W, H) * 0.28;
        g.fillStyle = '#3a2a1a'; g.fillRect(0, 0, W, H);
        capacete(cx, cy, r);
        if (st === 'jogo' && solo) g.drawImage(solo, 0, 0, W, H);
        else if (st === 'menu') { g.fillStyle = '#5a4128'; g.fillRect(0, 0, W, H); }
        if (st === 'jogo') txt(T.limpo + ': ' + Math.min(100, Math.round(pct / 0.88 * 100)) + '%', 24, 34, 16, '#fff', 'left');
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
