/* A calçada de Maldon — a maré abre e fecha o caminho; barre os invasores. */
BTJogo.registrar({
  canvas: 'jogo-maldon',
  t: {
    pt: {
      titulo: 'A calçada de Maldon',
      sub: 'A maré baixa deixa a calçada livre, e os vikings tentam atravessar. Toque em cada invasor para barrá-lo antes que chegue à margem inglesa. Repila 12 invasores; três passagens e a Inglaterra paga o tributo.',
      toque: 'Toque para começar', barrados: 'Barrados', passaram: 'Passaram',
      perdeu: 'Os vikings atravessaram', de_novo: 'Toque para tentar de novo',
      v1: 'A calçada foi defendida!',
      v2: 'Em 991, em Maldon, Byrhtnoth deixou os vikings atravessar e perdeu a batalha; o poema chama isso de ofermōd. O jogo inventa a defesa vitoriosa.',
      jogar: 'Toque para jogar de novo', mare: 'Maré'
    },
    en: {
      titulo: 'The Maldon causeway',
      sub: 'Low tide leaves the causeway clear, and the Vikings try to cross. Tap each invader to stop him before he reaches the English shore. Repel 12 invaders; three get through and England pays the tribute.',
      toque: 'Tap to start', barrados: 'Stopped', passaram: 'Through',
      perdeu: 'The Vikings crossed', de_novo: 'Tap to try again',
      v1: 'The causeway was held!',
      v2: 'In 991, at Maldon, Byrhtnoth let the Vikings cross and lost the battle; the poem calls this ofermōd. The game invents the winning defence.',
      jogar: 'Tap to play again', mare: 'Tide'
    },
    no: {
      titulo: 'Veien ved Maldon',
      sub: 'Lavvann gjør veien fri, og vikingene prøver å krysse. Trykk på hver inntrenger for å stoppe ham før han når den engelske bredden. Slå tilbake 12 inntrengere; tre kommer gjennom og England betaler skatten.',
      toque: 'Trykk for å starte', barrados: 'Stoppet', passaram: 'Gjennom',
      perdeu: 'Vikingene krysset', de_novo: 'Trykk for å prøve igjen',
      v1: 'Veien ble holdt!',
      v2: 'I 991, ved Maldon, lot Byrhtnoth vikingene krysse og tapte slaget; diktet kaller det ofermōd. Spillet finner opp det seirende forsvaret.',
      jogar: 'Trykk for å spille igjen', mare: 'Tidevann'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt, GOAL = 12, MAXP = 3, PER = 6.5;
    var st = 'menu', stopped = 0, through = 0, vk = [], tide = 0, nxt = 0, flash = 0, spawned = 0;
    function reset() { st = 'play'; stopped = 0; through = 0; vk = []; tide = 0; nxt = 0.5; flash = 0; spawned = 0; }
    function low() { return Math.cos(tide * 6.283 / PER) < -0.2; }
    function cy() { return api.h * 0.52; }
    function x0() { return api.w * 0.12; }
    function x1() { return api.w * 0.88; }
    return {
      pausar: function () {},
      dbg: function () { return { st: st, stopped: stopped, through: through, low: low(), tide: tide, vk: vk.map(function (v) { return { x: v.x, y: cy() }; }) }; },
      down: function (x, y) {
        if (st === 'menu' || st === 'lose') { reset(); return; }
        if (st === 'win') { st = 'menu'; return; }
        for (var i = 0; i < vk.length; i++) { var v = vk[i]; if (Math.abs(x - v.x) < 38 && Math.abs(y - cy()) < 60) { vk.splice(i, 1); stopped++; flash = 0.12; if (stopped >= GOAL) st = 'win'; return; } }
      },
      key: function (c, d) { if (d && (c === 'Space' || c === 'Enter') && st !== 'play') this.down(0, 0); },
      update: function (dt) {
        if (flash > 0) flash -= dt; if (st !== 'play') return;
        tide += dt; nxt -= dt;
        if (low() && nxt <= 0 && spawned < GOAL + 6) { vk.push({ x: x0() }); spawned++; nxt = 0.9 - Math.min(0.4, stopped * 0.03); }
        var sp = 95 + stopped * 5;
        for (var i = vk.length - 1; i >= 0; i--) { vk[i].x += sp * dt; if (vk[i].x >= x1()) { vk.splice(i, 1); through++; flash = 0.25; if (through >= MAXP) { st = 'lose'; return; } } }
        if (spawned >= GOAL + 6 && !vk.length && stopped < GOAL) { spawned = 0; }
      },
      draw: function () {
        var W = api.w, H = api.h, lv = (Math.cos(tide * 6.283 / PER) + 1) / 2;
        var s = g.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#9fb8c8'); s.addColorStop(1, '#5d7d8c'); g.fillStyle = s; g.fillRect(0, 0, W, H);
        g.fillStyle = '#3f6f8f'; g.fillRect(0, cy() - 30 - lv * 80, W, H);
        g.fillStyle = '#7a6a4a'; g.fillRect(0, cy() - 100, x0() - 20, H); g.fillRect(x1() + 20, cy() - 100, W, H);
        g.fillStyle = '#9a8a62'; g.fillRect(x0() - 20, cy() + 22, x1() - x0() + 40, 14);
        g.fillStyle = 'rgba(40,110,160,' + (0.25 + lv * 0.6) + ')'; g.fillRect(x0() - 20, cy() + 8, x1() - x0() + 40, 40);
        txt('🏴', x0() - 40, cy() - 20, 36, '#fff'); txt('🛡️', x1() + 40, cy() - 10, 36, '#fff');
        vk.forEach(function (v) { txt('⚔️', v.x, cy() + 10, 36, '#fff'); });
        if (st !== 'menu') {
          txt(T.barrados + ': ' + stopped + '/' + GOAL, 22, 32, 15, '#10222c', 'left');
          txt(T.passaram + ': ' + through + '/' + MAXP, 22, 54, 13, through ? '#8a2a1a' : '#10222c', 'left');
          g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(22, 68, 100, 10); g.fillStyle = low() ? '#6fd08c' : '#2a6d8f'; g.fillRect(22, 68, 100 * (1 - lv), 10);
          txt(T.mare, 128, 77, 12, '#10222c', 'left');
        }
        if (flash > 0 && through > 0 && flash > 0.15) { g.fillStyle = 'rgba(255,60,40,' + flash * 0.5 + ')'; g.fillRect(0, 0, W, H); }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
