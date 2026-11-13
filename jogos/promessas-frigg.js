/* As promessas de Frigg — toque nas coisas do mundo para colher o juramento de cada uma. */
BTJogo.registrar({
  canvas: 'jogo-frigg',
  t: {
    pt: {
      titulo: 'As promessas de Frigg',
      sub: 'Frigg precisa que todas as coisas jurem não ferir Baldr. Toque nas coisas que aparecem para colher o juramento de cada uma. Reúna 12 juramentos antes que o tempo acabe, e fique de olho em tudo.',
      toque: 'Toque para começar', jur: 'Juramentos', tempo: 'Tempo',
      perdeu: 'O tempo acabou', de_novo: 'Toque para tentar de novo',
      va1: 'Você lembrou do visco!',
      va2: 'No mito, Frigg achou o broto de visco novo demais para pedir o juramento, e foi com ele que Baldr morreu. No jogo, você o lembrou: esse final é invenção.',
      vb1: 'Doze juramentos!',
      vb2: 'Mas, no mito, Frigg deixou o visco de fora, por achá-lo novo demais, e foi com ele que Baldr morreu. O número doze é invenção do jogo.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: "Frigg's oaths",
      sub: 'Frigg needs every thing to swear not to harm Baldr. Tap the things that appear to collect each one\'s oath. Gather 12 oaths before time runs out, and keep an eye on everything.',
      toque: 'Tap to start', jur: 'Oaths', tempo: 'Time',
      perdeu: 'Time is up', de_novo: 'Tap to try again',
      va1: 'You remembered the mistletoe!',
      va2: 'In the myth, Frigg thought the mistletoe sprout too young to ask for an oath, and it was with that sprout that Baldr died. In the game you remembered it: that ending is made up.',
      vb1: 'Twelve oaths!',
      vb2: 'But in the myth, Frigg left the mistletoe out, thinking it too young, and it was with that sprout that Baldr died. The number twelve is made up for the game.',
      jogar: 'Tap to play again'
    },
    no: {
      titulo: 'Friggs eder',
      sub: 'Frigg må få alle ting til å sverge på å ikke skade Balder. Trykk på tingene som dukker opp for å samle hver enkelts ed. Samle 12 eder før tiden løper ut, og hold øye med alt.',
      toque: 'Trykk for å starte', jur: 'Eder', tempo: 'Tid',
      perdeu: 'Tiden er ute', de_novo: 'Trykk for å prøve igjen',
      va1: 'Du husket misteltein!',
      va2: 'I myten mente Frigg at misteltein-skuddet var for ungt til å be om ed, og det var med det skuddet Balder døde. I spillet husket du det: den slutten er diktet opp.',
      vb1: 'Tolv eder!',
      vb2: 'Men i myten utelot Frigg misteltein fordi hun mente den var for ung, og det var med det skuddet Balder døde. Tallet tolv er diktet opp for spillet.',
      jogar: 'Trykk for å spille igjen'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt, META = 12, TEMPO = 50;
    var EMO = ['🔥', '💧', '⛓', '⛰', '🌳', '🐦', '🐍', '❄'];
    var st = 'menu', t = 0, itens = [], ef = [], jur = 0, spawn = 0, visco = null, viscoVisto = false, viscoPego = false;
    function rnd(a, b) { return a + Math.random() * (b - a); }
    function reset() { st = 'play'; t = 0; itens = []; ef = []; jur = 0; spawn = 0.2; visco = null; viscoVisto = false; viscoPego = false; }
    function area() { return { x0: 52, x1: api.w - 52, y0: 100, y1: api.h - 170 }; }
    function novo() {
      var a = area();
      itens.push({ x: rnd(a.x0, a.x1), y: rnd(a.y0, Math.max(a.y0 + 40, a.y1)), vida: 3.6, e: EMO[Math.floor(Math.random() * EMO.length)], ph: Math.random() * 6 });
    }
    function colher(x, y, cor) { ef.push({ x: x, y: y, t: 0, cor: cor || '#ffe59a' }); }
    return {
      pausar: function () {},
      down: function (x, y) {
        if (st === 'menu' || st === 'lose') { reset(); return; }
        if (st === 'win') { st = 'menu'; return; }
        if (visco && Math.hypot(x - visco.x, y - visco.y) < 42) { colher(visco.x, visco.y, '#9dffb0'); visco = null; viscoPego = true; jur++; }
        else {
          var k = -1, d = 40;
          itens.forEach(function (it, i) { var dd = Math.hypot(x - it.x, y - (it.y + Math.sin(api.clock * 2 + it.ph) * 6)); if (dd < d) { d = dd; k = i; } });
          if (k >= 0) { colher(itens[k].x, itens[k].y); itens.splice(k, 1); jur++; }
        }
        if (jur >= META) st = 'win';
      },
      update: function (dt) {
        ef.forEach(function (e) { e.t += dt; }); ef = ef.filter(function (e) { return e.t < 0.7; });
        if (st !== 'play') return;
        t += dt; spawn -= dt;
        if (spawn <= 0 && itens.length < 6) { novo(); spawn = 0.55; }
        itens.forEach(function (it) { it.vida -= dt; }); itens = itens.filter(function (it) { return it.vida > 0; });
        if (jur >= 6 && !viscoVisto) {
          viscoVisto = true; var w = api.w, h = api.h, a = area();
          visco = { x: Math.random() < 0.5 ? rnd(34, 80) : rnd(w - 80, w - 34), y: rnd(a.y0 + 30, a.y1), vida: 12 };
        }
        if (visco) { visco.vida -= dt; if (visco.vida <= 0) visco = null; }
        if (t >= TEMPO) st = 'lose';
      },
      draw: function () {
        var W = api.w, H = api.h, cx = W / 2, c = api.clock;
        var s = g.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#2b1458'); s.addColorStop(0.55, '#7a3a7a'); s.addColorStop(1, '#e8a85c'); g.fillStyle = s; g.fillRect(0, 0, W, H);
        // colunas do salão
        g.fillStyle = 'rgba(30,12,50,.55)';
        for (var i = 0; i < 5; i++) { var px = (i + 0.5) * W / 5; g.fillRect(px - 14, H * 0.28, 28, H); g.fillRect(px - 22, H * 0.28, 44, 12); }
        g.fillStyle = 'rgba(30,12,50,.8)'; g.fillRect(0, H - 56, W, 56);
        // Baldr
        var by = H - 112, pulso = 1 + Math.sin(c * 2.4) * 0.05;
        var r = g.createRadialGradient(cx, by, 6, cx, by, 90 * pulso); r.addColorStop(0, 'rgba(255,240,170,.95)'); r.addColorStop(1, 'rgba(255,220,120,0)');
        g.fillStyle = r; g.beginPath(); g.arc(cx, by, 90 * pulso, 0, 6.29); g.fill();
        g.fillStyle = '#ffe7a8'; g.beginPath(); g.arc(cx, by - 18, 18, 0, 6.29); g.fill();
        g.fillStyle = '#f5c94e'; g.fillRect(cx - 20, by - 2, 40, 48);
        g.fillStyle = '#6a3a1c'; g.beginPath(); g.arc(cx - 6, by - 20, 2.2, 0, 6.29); g.arc(cx + 6, by - 20, 2.2, 0, 6.29); g.fill();
        // itens
        g.textAlign = 'center'; g.textBaseline = 'middle';
        itens.forEach(function (it) {
          var yy = it.y + Math.sin(c * 2 + it.ph) * 6, k = Math.min(1, it.vida / 0.8);
          g.globalAlpha = k; var gl = g.createRadialGradient(it.x, yy, 4, it.x, yy, 34); gl.addColorStop(0, 'rgba(255,255,255,.5)'); gl.addColorStop(1, 'rgba(255,255,255,0)');
          g.fillStyle = gl; g.beginPath(); g.arc(it.x, yy, 34, 0, 6.29); g.fill();
          g.font = '34px serif'; g.fillStyle = '#fff'; g.fillText(it.e, it.x, yy + 2); g.globalAlpha = 1;
        });
        if (visco) {
          var pv = 1 + Math.sin(c * 5) * 0.25, k2 = Math.min(1, visco.vida / 1.5);
          g.globalAlpha = k2; var gv = g.createRadialGradient(visco.x, visco.y, 2, visco.x, visco.y, 30 * pv); gv.addColorStop(0, 'rgba(157,255,176,.8)'); gv.addColorStop(1, 'rgba(157,255,176,0)');
          g.fillStyle = gv; g.beginPath(); g.arc(visco.x, visco.y, 30 * pv, 0, 6.29); g.fill();
          g.font = '17px serif'; g.fillStyle = '#fff'; g.fillText('🌿', visco.x, visco.y + 1); g.globalAlpha = 1;
        }
        g.textBaseline = 'alphabetic';
        ef.forEach(function (e) { g.globalAlpha = 1 - e.t / 0.7; g.strokeStyle = e.cor; g.lineWidth = 3; g.beginPath(); g.arc(e.x, e.y, 14 + e.t * 90, 0, 6.29); g.stroke(); g.globalAlpha = 1; });
        if (st !== 'menu') {
          txt(T.jur + ' ' + jur + '/' + META, 24, 34, 16, '#fff', 'left');
          txt(T.tempo + ' ' + Math.max(0, Math.ceil(TEMPO - t)), 24, 58, 14, '#ffe6b0', 'left');
        }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(viscoPego ? T.va1 : T.vb1, [viscoPego ? T.va2 : T.vb2], T.jogar, '#ffd88a');
      }
    };
  }
});
