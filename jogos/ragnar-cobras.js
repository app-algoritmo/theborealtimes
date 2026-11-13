/* O poço das cobras — memorize a ordem em que as serpentes se erguem. */
BTJogo.registrar({
  canvas: 'jogo-ragnar',
  t: {
    pt: {
      titulo: 'O poço das cobras',
      sub: 'Ragnar está no poço do rei Ælla. As cobras se erguem uma a uma: memorize a ordem e toque nas tocas na mesma sequência. Sobreviva a sete rodadas.',
      toque: 'Toque para começar', rodada: 'Rodada', observe: 'Observe...', vez: 'Sua vez',
      perdeu: 'A cobra mordeu', de_novo: 'Toque para tentar de novo',
      v1: 'Ragnar cantou até o fim!',
      v2: 'Nas sagas, Ragnar morre no poço de cobras do rei Ælla, cantando. O jogo de memória é invenção, e a cena é lenda, não registro histórico.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: 'The snake pit',
      sub: 'Ragnar is in King Ælla\'s pit. The snakes rise one by one: memorise the order and tap the holes in the same sequence. Survive seven rounds.',
      toque: 'Tap to start', rodada: 'Round', observe: 'Watch...', vez: 'Your turn',
      perdeu: 'The snake bit', de_novo: 'Tap to try again',
      v1: 'Ragnar sang to the end!',
      v2: 'In the sagas, Ragnar dies in King Ælla\'s snake pit, singing. The memory game is made up, and the scene is legend, not historical record.',
      jogar: 'Tap to play again'
    },
    no: {
      titulo: 'Slangegropen',
      sub: 'Ragnar er i kong Ællas grav. Slangene reiser seg én etter én: husk rekkefølgen og trykk på hullene i samme rekkefølge. Overlev sju runder.',
      toque: 'Trykk for å starte', rodada: 'Runde', observe: 'Se på...', vez: 'Din tur',
      perdeu: 'Slangen bet', de_novo: 'Trykk for å prøve igjen',
      v1: 'Ragnar sang til slutten!',
      v2: 'I sagaene dør Ragnar i kong Ællas slangegrav, syngende. Hukommelsesspillet er diktet opp, og scenen er legende, ikke historisk opptegnelse.',
      jogar: 'Trykk for å spille igjen'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt, RODADAS = 7;
    var COR = ['#5bbf5a', '#e8913a', '#4aa3df', '#b56ad9'], FREQ = [196, 247, 294, 370], ctx = null;
    var st = 'menu', seq = [], rnd = 0, showI = 0, showT = 0, inI = 0, lit = -1, litT = 0, flash = 0, msg = 0;
    function som(i, f) {
      try {
        if (!ctx) { var A = window.AudioContext || window.webkitAudioContext; if (!A) return; ctx = new A(); }
        if (ctx.state === 'suspended') ctx.resume();
        var o = ctx.createOscillator(), v = ctx.createGain(), n = ctx.currentTime;
        o.type = 'triangle'; o.frequency.value = f || FREQ[i];
        v.gain.setValueAtTime(0.0001, n); v.gain.exponentialRampToValueAtTime(0.18, n + 0.03); v.gain.exponentialRampToValueAtTime(0.0001, n + 0.4);
        o.connect(v); v.connect(ctx.destination); o.start(n); o.stop(n + 0.45);
      } catch (e) {}
    }
    function geo() {
      var w = api.w, h = api.h, cols = w >= h * 1.15 ? 4 : 2, rows = 4 / cols;
      var cw = Math.min((w - 40) / cols, (h - 150) / rows, 190), r = cw * 0.38;
      var x0 = w / 2 - cw * cols / 2, y0 = h / 2 - cw * rows / 2 + 30, pts = [];
      for (var i = 0; i < 4; i++) pts.push({ x: x0 + (i % cols + 0.5) * cw, y: y0 + (Math.floor(i / cols) + 0.5) * cw });
      return { pts: pts, r: r };
    }
    function reset() { st = 'show'; seq = []; rnd = 1; add(); add(); showI = 0; showT = 0.9; inI = 0; lit = -1; }
    function add() { seq.push(Math.floor(Math.random() * 4)); }
    function ligar(i) { lit = i; litT = 0.42; som(i); }
    function tocar(x, y) {
      var G = geo(), k = -1;
      G.pts.forEach(function (p, i) { if (Math.hypot(x - p.x, y - p.y) < G.r * 1.25) k = i; });
      if (k < 0) return;
      ligar(k);
      if (seq[inI] !== k) { st = 'lose'; som(0, 90); return; }
      inI++;
      if (inI >= seq.length) {
        if (rnd >= RODADAS) { st = 'win'; return; }
        rnd++; add(); st = 'show'; showI = 0; showT = 1.0; inI = 0;
      }
    }
    return {
      pausar: function () {},
      dbg: function () { return { st: st, seq: seq, rnd: rnd, geo: geo(), inI: inI }; },
      down: function (x, y) { if (st === 'menu' || st === 'lose') reset(); else if (st === 'win') st = 'menu'; else if (st === 'in') tocar(x, y); },
      key: function (c, d) {
        if (!d) return;
        if (c === 'Space' || c === 'Enter') { if (st === 'menu' || st === 'lose') reset(); else if (st === 'win') st = 'menu'; return; }
        var m = { Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3, KeyA: 0, KeyS: 1, KeyD: 2, KeyF: 3 }[c];
        if (m !== undefined && st === 'in') { var p = geo().pts[m]; tocar(p.x, p.y); }
      },
      update: function (dt) {
        if (litT > 0) { litT -= dt; if (litT <= 0) lit = -1; }
        if (st === 'show') {
          showT -= dt;
          if (showT <= 0) {
            if (showI >= seq.length) { st = 'in'; inI = 0; return; }
            ligar(seq[showI]); showI++; showT = Math.max(0.42, 0.78 - rnd * 0.05);
          }
        }
      },
      draw: function () {
        var W = api.w, H = api.h, G = geo(), i;
        var s = g.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#2b2430'); s.addColorStop(1, '#120e16'); g.fillStyle = s; g.fillRect(0, 0, W, H);
        g.fillStyle = '#3a3039'; for (i = 0; i < 18; i++) g.fillRect((i * 71) % W, (i * 43) % H, 38, 20);
        G.pts.forEach(function (p, k) {
          var on = lit === k;
          g.fillStyle = '#0a070d'; g.beginPath(); g.ellipse(p.x, p.y + 8, G.r * 1.15, G.r * 0.62, 0, 0, 6.29); g.fill();
          g.strokeStyle = '#4c4050'; g.lineWidth = 5; g.stroke();
          if (on) {
            g.fillStyle = COR[k]; var h = G.r * 1.7;
            g.beginPath(); g.moveTo(p.x - G.r * 0.34, p.y + 8); g.quadraticCurveTo(p.x - G.r * 0.5, p.y - h * 0.5, p.x, p.y - h); g.quadraticCurveTo(p.x + G.r * 0.5, p.y - h * 0.5, p.x + G.r * 0.34, p.y + 8); g.closePath(); g.fill();
            g.fillStyle = '#fff'; g.beginPath(); g.arc(p.x - 7, p.y - h + 14, 4, 0, 6.29); g.arc(p.x + 7, p.y - h + 14, 4, 0, 6.29); g.fill();
            g.fillStyle = '#111'; g.beginPath(); g.arc(p.x - 7, p.y - h + 15, 2, 0, 6.29); g.arc(p.x + 7, p.y - h + 15, 2, 0, 6.29); g.fill();
            g.strokeStyle = '#e24a4a'; g.lineWidth = 2; g.beginPath(); g.moveTo(p.x, p.y - h + 28); g.lineTo(p.x, p.y - h + 40); g.stroke();
          } else { g.fillStyle = COR[k]; g.globalAlpha = 0.28; g.beginPath(); g.ellipse(p.x, p.y + 8, G.r * 0.8, G.r * 0.4, 0, 0, 6.29); g.fill(); g.globalAlpha = 1; }
        });
        if (st !== 'menu') {
          txt(T.rodada + ' ' + rnd + '/' + RODADAS, 24, 34, 15, '#f3ecd2', 'left');
          if (st === 'show') txt(T.observe, W / 2, 64, 20, '#c9b3f2'); else if (st === 'in') txt(T.vez, W / 2, 64, 20, '#ffd88a');
          for (i = 0; i < seq.length; i++) { g.fillStyle = i < inI && st === 'in' ? '#ffd88a' : 'rgba(255,255,255,.25)'; g.beginPath(); g.arc(W / 2 - seq.length * 7 + i * 14 + 7, H - 36, 4, 0, 6.29); g.fill(); }
        }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
