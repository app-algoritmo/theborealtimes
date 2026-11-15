/* Færeyinga saga — atravesse a nado o braço de mar. */
BTJogo.registrar({
  canvas: 'jogo-foroyinga',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A nado entre as ilhas",
    "sub": "Alterne as braçadas: toque no lado esquerdo e no direito da tela, um de cada vez (ou use A e D, ou as setas). Duas braçadas seguidas do mesmo lado gastam o fôlego sem avançar. Se o fôlego acabar, você quase não avança. Percorra 120 metros antes do tempo acabar.",
    "perdeu": "As ondas venceram o nadador",
    "v1": "Você chegou à outra ilha!",
    "v2": "A Saga dos Faroeses fala de um homem que escapou a nado. O trajeto e as medidas do jogo são invenção.",
    "h1": "Distância",
    "h2": "Fôlego"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Swimming between the islands",
    "sub": "Alternate your strokes: tap the left and the right side of the screen, one after the other (or use A and D, or the arrows). Two strokes in a row on the same side waste breath without moving you. When breath runs out you barely move. Cover 120 metres before time runs out.",
    "perdeu": "The waves beat the swimmer",
    "v1": "You reached the other island!",
    "v2": "The Saga of the Faroe Islanders tells of a man who escaped by swimming. The route and the distances in the game are made up.",
    "h1": "Distance",
    "h2": "Breath"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Svømming mellom øyene",
    "sub": "Bytt mellom tak: trykk på venstre og høyre side av skjermen, én om gangen (eller bruk A og D, eller piltastene). To tak på rad på samme side bruker opp pusten uten å flytte deg. Når pusten er tom, kommer du nesten ingen vei. Svøm 120 meter før tiden er ute.",
    "perdeu": "Bølgene vant over svømmeren",
    "v1": "Du nådde den andre øya!",
    "v2": "Færøyingenes saga forteller om en mann som slapp unna ved å svømme. Ruten og målene i spillet er diktet opp.",
    "h1": "Distanse",
    "h2": "Pust"
  }
},
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt;
    var st = 'menu';
    function menu() { if (st === 'menu' || st === 'lose') { reset(); return true; } if (st === 'win') { st = 'menu'; return true; } return false; }
    function fim(s) {
      if (s === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
      else if (s === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
      else if (s === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
    }
    function bg(a, b) { var s = g.createLinearGradient(0, 0, 0, api.h); s.addColorStop(0, a); s.addColorStop(1, b); g.fillStyle = s; g.fillRect(0, 0, api.w, api.h); }
    function hud(a, b, bad) { if (st === 'menu') return; txt(a, 22, 32, 15, '#f3ecd2', 'left'); if (b) txt(b, 22, 54, 13, bad ? '#ffb08a' : '#c9b3f2', 'left'); }
    function rr(x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
    function bar(x, y, w, h, f, c) { g.fillStyle = 'rgba(0,0,0,.28)'; g.fillRect(x, y, w, h); g.fillStyle = c; g.fillRect(x, y, w * Math.max(0, Math.min(1, f)), h); }
    var GOAL = 120, LIM = 50;
    var dist = 0, breath = 100, last = 0, tmr = LIM, pop = 0, shake = 0, arm = [0, 0], wob = 0, flash = 0;
    function setup() { dist = 0; breath = 100; last = 0; tmr = LIM; shake = 0; arm = [0, 0]; flash = 0; }
    function reset() { setup(); st = 'play'; }
    function stroke(side) {
      if (st !== 'play') return; arm[side - 1] = 0.25;
      if (side === last) { breath = Math.max(0, breath - 7); shake = 0.3; flash = 0.3; if (api.nota) api.nota(140, 0.08, 'sawtooth', 0.05); return; }
      var gain = 1.5 * (breath > 8 ? 0.5 + breath / 200 : 0.2); dist += gain; breath = Math.max(0, breath - 2.4); last = side;
      if (api.nota) api.nota(380 + (side === 1 ? 0 : 60), 0.05, 'triangle', 0.04);
      if (dist >= GOAL) { dist = GOAL; st = 'win'; }
    }
    setup();
    return {
      pausar: function () {},
      dbg: function () { return { st: st, dist: dist, breath: breath, last: last, tmr: tmr, W: api.w }; },
      down: function (x, y) { if (menu()) return; stroke(x < api.w / 2 ? 1 : 2); },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'ArrowLeft' || k === 'KeyA') stroke(1); else if (k === 'ArrowRight' || k === 'KeyD') stroke(2); },
      update: function (dt) {
        pop += dt; wob += dt; if (shake > 0) shake -= dt; if (flash > 0) flash -= dt; arm[0] = Math.max(0, arm[0] - dt); arm[1] = Math.max(0, arm[1] - dt);
        if (st !== 'play') return; tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; return; }
        dist = Math.max(0, dist - 0.35 * dt); breath = Math.min(100, breath + 6 * dt);
      },
      draw: function () {
        var W = api.w, H = api.h, i, k = dist / GOAL;
        bg('#0f3a5a', '#04121e');
        for (i = 0; i < 9; i++) { var yy = 120 + i * (H - 210) / 9; g.strokeStyle = 'rgba(255,255,255,' + (0.06 + 0.03 * (i % 3)) + ')'; g.lineWidth = 2; g.beginPath(); for (var x = 0; x <= W; x += 14) { var y2 = yy + Math.sin(x * 0.03 + wob * 2 + i) * 5; if (x) g.lineTo(x, y2); else g.moveTo(x, y2); } g.stroke(); }
        var by = 78, bw2 = W - 80; g.fillStyle = 'rgba(255,255,255,.12)'; rr(40, by + 8, bw2, 12, 6); g.fill(); g.fillStyle = '#4a7a3a'; g.fillRect(36, by - 2, 14, 30); g.fillStyle = '#6a9a4a'; g.fillRect(W - 50, by - 2, 14, 30);
        var sx = 46 + k * (bw2 - 12), sy = H / 2 + 20 + Math.sin(wob * 3) * 4 + (shake > 0 ? Math.sin(wob * 60) * 4 : 0);
        var px = 70 + k * (W - 170);
        g.fillStyle = '#ffd88a'; g.beginPath(); g.arc(px, sy, 12, 0, 6.283); g.fill(); g.fillStyle = '#3a6a9a'; g.fillRect(px - 8, sy + 8, 24, 8);
        g.strokeStyle = flash > 0 ? '#c0392b' : '#ffd88a'; g.lineWidth = 5; g.lineCap = 'round';
        g.beginPath(); g.moveTo(px - 2, sy + 4); g.lineTo(px - 18 - arm[0] * 90, sy - 10 + arm[0] * 40); g.stroke(); g.beginPath(); g.moveTo(px + 2, sy + 4); g.lineTo(px + 18 + arm[1] * 90, sy - 10 + arm[1] * 40); g.stroke();
        g.fillStyle = 'rgba(255,216,138,.9)'; g.beginPath(); g.arc(sx + 6, by + 14, 6, 0, 6.283); g.fill();
        g.fillStyle = last === 1 ? 'rgba(255,255,255,.04)' : 'rgba(255,216,138,.10)'; g.fillRect(0, H - 90, W / 2, 90); g.fillStyle = last === 2 ? 'rgba(255,255,255,.04)' : 'rgba(255,216,138,.10)'; g.fillRect(W / 2, H - 90, W / 2, 90);
        txt('◀', W / 4, H - 40, 28, 'rgba(255,255,255,.45)'); txt('▶', W * 3 / 4, H - 40, 28, 'rgba(255,255,255,.45)');
        bar(W / 2 - 110, H - 104, 220, 7, breath / 100, breath < 25 ? '#c0392b' : '#5ab0d8');
        hud(T.h1 + ' ' + Math.floor(dist) + '/' + GOAL, T.h2 + ' ' + Math.round(breath) + '%', false);
        fim(st);
      }
    };
  }
});
