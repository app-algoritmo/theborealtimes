/* Desvie a estrada — trace o caminho sem tocar nas rochas dos elfos. */
BTJogo.registrar({
  canvas: 'jogo-huldu',
  t: {
    pt: {
      titulo: 'Desvie a estrada',
      sub: 'Arraste o dedo (ou o mouse) do ponto verde ao ponto vermelho para traçar a estrada, sem encostar nas rochas onde mora o povo oculto. Se encostar, a estrada recomeça. Quatro trechos; cinco encostões e a obra é embargada.',
      toque: 'Toque para começar', trecho: 'Trecho', toques: 'Encostões',
      perdeu: 'A obra foi embargada', de_novo: 'Toque para tentar de novo',
      v1: 'A estrada foi aberta!',
      v2: 'Na Islândia, obras já foram discutidas por causa de pedras tidas como moradas do povo oculto. O jogo é uma brincadeira com essa ideia.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: 'Reroute the road',
      sub: 'Drag your finger (or mouse) from the green dot to the red dot to draw the road, without touching the rocks where the hidden people live. If you touch one, the road starts over. Four stretches; five touches and the work is halted.',
      toque: 'Tap to start', trecho: 'Stretch', toques: 'Touches',
      perdeu: 'The work was halted', de_novo: 'Tap to try again',
      v1: 'The road is open!',
      v2: 'In Iceland, works have been argued over because of rocks said to be homes of the hidden people. The game plays with that idea.',
      jogar: 'Tap to play again'
    },
    no: {
      titulo: 'Led veien utenom',
      sub: 'Dra fingeren (eller musen) fra den grønne prikken til den røde for å tegne veien, uten å røre steinene der det skjulte folket bor. Rører du en, starter veien på nytt. Fire strekninger; fem berøringer og arbeidet stanses.',
      toque: 'Trykk for å starte', trecho: 'Strekning', toques: 'Berøringer',
      perdeu: 'Arbeidet ble stanset', de_novo: 'Trykk for å prøve igjen',
      v1: 'Veien er åpnet!',
      v2: 'På Island har bygging vært diskutert på grunn av steiner som sies å være hjem for det skjulte folket. Spillet leker med den tanken.',
      jogar: 'Trykk for å spille igjen'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt, MAXH = 5, RR = 30, HW = 5;
    var LV = [
      [[0.5, 0.5], [0.3, 0.3]],
      [[0.25, 0.7], [0.5, 0.5], [0.75, 0.3], [0.5, 0.85], [0.3, 0.25]],
      [[0.2, 0.6], [0.35, 0.35], [0.5, 0.65], [0.62, 0.4], [0.8, 0.6], [0.5, 0.2], [0.25, 0.85]],
      [[0.2, 0.7], [0.35, 0.5], [0.5, 0.75], [0.5, 0.3], [0.65, 0.55], [0.8, 0.75], [0.8, 0.35], [0.3, 0.2], [0.65, 0.15]]
    ];
    var st = 'menu', lv = 0, hits = 0, path = [], drawing = false, flash = 0;
    function S() { return { x: api.w * 0.08, y: api.h * 0.88 }; }
    function E() { return { x: api.w * 0.92, y: api.h * 0.12 }; }
    function rocks() { return LV[lv - 1].map(function (r) { return { x: r[0] * api.w, y: r[1] * api.h }; }); }
    function reset() { st = 'play'; lv = 1; hits = 0; path = []; drawing = false; }
    function collide(x, y) { return rocks().some(function (r) { return Math.hypot(x - r.x, y - r.y) < RR + HW; }); }
    function fail() { hits++; flash = 0.3; path = []; drawing = false; if (hits >= MAXH) st = 'lose'; }
    function addp(x, y) {
      var l = path[path.length - 1], d = Math.hypot(x - l.x, y - l.y), k = Math.max(1, Math.ceil(d / 6));
      for (var i = 1; i <= k; i++) { var px = l.x + (x - l.x) * i / k, py = l.y + (y - l.y) * i / k; if (collide(px, py)) { fail(); return; } path.push({ x: px, y: py }); }
      var e = E(); if (Math.hypot(x - e.x, y - e.y) < 26) { flash = 0.25; if (lv >= 4) st = 'win'; else { lv++; path = []; drawing = false; } }
    }
    return {
      pausar: function () { drawing = false; path = []; },
      dbg: function () { return { st: st, lv: lv, hits: hits, S: S(), E: E(), rocks: st === 'play' ? rocks() : [], RR: RR, HW: HW, w: api.w, h: api.h }; },
      down: function (x, y) {
        if (st === 'menu' || st === 'lose') { reset(); return; }
        if (st === 'win') { st = 'menu'; return; }
        var s = S(); if (Math.hypot(x - s.x, y - s.y) < 40) { drawing = true; path = [{ x: s.x, y: s.y }]; }
      },
      move: function (x, y, p) { if (st === 'play' && drawing && p && path.length) addp(x, y); },
      up: function () { if (st === 'play' && drawing) { drawing = false; path = []; } },
      key: function (c, d) { if (d && (c === 'Space' || c === 'Enter') && st !== 'play') this.down(0, 0); },
      update: function (dt) { if (flash > 0) flash -= dt; },
      draw: function () {
        var W = api.w, H = api.h, s = S(), e = E();
        var bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#5f7a52'); bg.addColorStop(1, '#3d5236'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
        if (st === 'play' || st === 'win') {
          if (st === 'play') rocks().forEach(function (r) { g.fillStyle = '#4a4f55'; g.beginPath(); g.arc(r.x, r.y, RR, 0, 6.29); g.fill(); g.fillStyle = 'rgba(255,230,160,.25)'; g.beginPath(); g.arc(r.x, r.y, RR + 6 + Math.sin(api.clock * 3 + r.x) * 2, 0, 6.29); g.fill(); txt('✨', r.x, r.y + 6, 18, '#fff'); });
          g.fillStyle = '#6ecb8c'; g.beginPath(); g.arc(s.x, s.y, 14, 0, 6.29); g.fill(); g.fillStyle = '#ff6a5a'; g.beginPath(); g.arc(e.x, e.y, 14, 0, 6.29); g.fill();
          if (path.length > 1) { g.strokeStyle = '#d8d0b8'; g.lineWidth = HW * 2; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); g.moveTo(path[0].x, path[0].y); for (var i = 1; i < path.length; i++) g.lineTo(path[i].x, path[i].y); g.stroke(); }
          txt(T.trecho + ' ' + Math.min(lv, 4) + '/4', 22, 32, 15, '#f3ecd2', 'left');
          txt(T.toques + ': ' + hits + '/' + MAXH, 22, 54, 13, hits ? '#ffb08a' : '#e0ecd8', 'left');
        }
        if (flash > 0) { g.fillStyle = 'rgba(255,255,255,' + flash * 0.4 + ')'; g.fillRect(0, 0, W, H); }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
