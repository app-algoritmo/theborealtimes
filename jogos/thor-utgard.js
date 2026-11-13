/* Os desafios de Útgarða-Loki — três provas, três ilusões. */
BTJogo.registrar({
  canvas: 'jogo-utgard',
  t: {
    pt: {
      titulo: 'Os desafios de Útgarða-Loki',
      sub: 'Três provas no salão do gigante: beba do chifre, levante o gato e lute com a velha. Nada é o que parece, mas a força de Thor vale mesmo assim.',
      toque: 'Toque para começar', tempo: 'Tempo',
      p1: 'Prova 1: o chifre', d1: 'Segure para beber. Solte para respirar.',
      p2: 'Prova 2: o gato', d2: 'Toque rápido para erguer o gato!',
      p3: 'Prova 3: a velha Elli', d3: 'Toque alternando esquerda e direita!',
      perdeu: 'O gigante riu de você', de_novo: 'Toque para tentar de novo',
      v1: 'Thor quase venceu o impossível!',
      v2: 'Na Edda em Prosa, o chifre ligava ao mar, o gato era a serpente Jörmungandr e Elli era a Velhice. Aqui você consegue, o que não acontece no mito.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: "Útgarða-Loki's challenges",
      sub: "Three tests in the giant's hall: drink from the horn, lift the cat and wrestle the old woman. Nothing is what it seems, but Thor's strength counts all the same.",
      toque: 'Tap to start', tempo: 'Time',
      p1: 'Test 1: the horn', d1: 'Hold to drink. Release to breathe.',
      p2: 'Test 2: the cat', d2: 'Tap fast to lift the cat!',
      p3: 'Test 3: old Elli', d3: 'Tap alternating left and right!',
      perdeu: 'The giant laughed at you', de_novo: 'Tap to try again',
      v1: 'Thor nearly beat the impossible!',
      v2: 'In the Prose Edda, the horn was linked to the sea, the cat was the serpent Jörmungandr and Elli was Old Age. Here you succeed, which does not happen in the myth.',
      jogar: 'Tap to play again'
    },
    no: {
      titulo: 'Utgard-Lokes prøver',
      sub: 'Tre prøver i jotunens sal: drikk av hornet, løft katten og bryt med den gamle kvinnen. Ingenting er som det ser ut, men Tors styrke teller likevel.',
      toque: 'Trykk for å starte', tempo: 'Tid',
      p1: 'Prøve 1: hornet', d1: 'Hold for å drikke. Slipp for å puste.',
      p2: 'Prøve 2: katten', d2: 'Trykk raskt for å løfte katten!',
      p3: 'Prøve 3: gamle Elle', d3: 'Trykk vekselvis venstre og høyre!',
      perdeu: 'Jotunen lo av deg', de_novo: 'Trykk for å prøve igjen',
      v1: 'Tor klarte nesten det umulige!',
      v2: 'I Snorres Edda var hornet knyttet til havet, katten var Midgardsormen og Elle var Alderdommen. Her klarer du det, noe som ikke skjer i myten.',
      jogar: 'Trykk for å spille igjen'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt;
    var st = 'menu', ph = 0, val = 0, breath = 1, held = false, forced = false, time = 0, banner = 0, last = 0;
    var TL = [12, 10, 12];
    function reset() { st = 'play'; ph = 1; begin(); }
    function begin() { val = 0; breath = 1; held = false; forced = false; time = TL[ph - 1]; banner = 1.6; last = 0; }
    function chk() { if (val >= 0.999) { if (ph >= 3) st = 'win'; else { ph++; begin(); } return true; } return false; }
    function tap(x) {
      if (st !== 'play' || banner > 0) return;
      if (ph === 1) { held = true; }
      else if (ph === 2) { val = Math.min(1, val + 0.06); }
      else { var side = x < api.w / 2 ? 1 : 2; if (side !== last) val = Math.min(1, val + 0.05); else val = Math.max(0, val - 0.02); last = side; }
      if (ph > 1) chk();
    }
    return {
      pausar: function () { held = false; },
      dbg: function () { return { st: st, ph: ph, val: val, breath: breath, time: time, banner: banner }; },
      down: function (x, y) {
        if (st === 'menu' || st === 'lose') { reset(); return; }
        if (st === 'win') { st = 'menu'; return; }
        tap(x);
      },
      up: function () { held = false; },
      key: function (c, d) {
        if (!d) { if (c === 'Space') held = false; return; }
        if (st !== 'play') { if (c === 'Space' || c === 'Enter') this.down(0, 0); return; }
        if (c === 'Space') tap(api.w / 2);
        if (c === 'ArrowLeft' || c === 'KeyA') tap(0);
        if (c === 'ArrowRight' || c === 'KeyD') tap(api.w);
      },
      update: function (dt) {
        if (st !== 'play') return;
        if (banner > 0) { banner -= dt; return; }
        time -= dt;
        if (ph === 1) {
          if (forced && breath >= 0.35) forced = false;
          if (held && !forced) { val += 0.3 * dt; breath -= 0.5 * dt; if (breath <= 0) { breath = 0; forced = true; } }
          else breath = Math.min(1, breath + 0.7 * dt);
        } else if (ph === 2) val = Math.max(0, val - 0.15 * dt);
        else val = Math.max(0, val - 0.12 * dt);
        if (chk()) return;
        if (time <= 0) st = 'lose';
      },
      draw: function () {
        var W = api.w, H = api.h, cx = W / 2, i;
        var s = g.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#2a1e33'); s.addColorStop(1, '#14101d'); g.fillStyle = s; g.fillRect(0, 0, W, H);
        g.fillStyle = 'rgba(255,170,60,.16)'; for (i = 0; i < 4; i++) { g.beginPath(); g.arc(W * (0.15 + i * 0.23), 70, 36 + Math.sin(api.clock * 3 + i) * 4, 0, 6.29); g.fill(); }
        if (st === 'play' || st === 'win') {
          var p = Math.min(ph, 3), by = H * 0.38, fy = H * 0.7;
          if (p === 1) {
            txt('🐂', cx, by, 90, '#fff');
            g.fillStyle = '#e8d9b0'; g.fillRect(cx - 70, by + 40, 140, 150); g.fillStyle = '#2a6d8f'; var hh = 150 * (1 - val); g.fillRect(cx - 70, by + 40 + hh, 140, 150 - hh);
            g.fillStyle = '#6ecb8c'; g.fillRect(cx - 110, by + 200, 220, 10); g.fillStyle = forced ? '#ff6a5a' : '#ffd88a'; g.fillRect(cx - 110, by + 200, 220 * breath, 10);
          } else if (p === 2) {
            txt('🐈‍⬛', cx, by + 40 - val * 70, 110, '#fff');
            g.fillStyle = '#e8d9b0'; g.fillRect(cx - 80, by + 120, 160, 8);
          } else {
            txt('👵', cx + (val - 0.5) * 160, by + 30, 100, '#fff'); txt('💪', cx - (val - 0.5) * 160 - 90, by + 30, 80, '#fff');
            g.fillStyle = 'rgba(255,255,255,.15)'; g.fillRect(0, 0, W / 2, H); g.fillStyle = 'rgba(255,255,255,.07)'; g.fillRect(W / 2, 0, W / 2, H);
          }
          g.fillStyle = 'rgba(255,255,255,.2)'; g.fillRect(20, H - 44, W - 40, 12); g.fillStyle = '#ffd88a'; g.fillRect(20, H - 44, (W - 40) * val, 12);
          txt(T.tempo + ': ' + Math.max(0, Math.ceil(time)), 22, 32, 15, '#f3ecd2', 'left');
          if (banner > 0 && st === 'play') api.cartaz(T['p' + p], [T['d' + p]], '', '#ffd88a');
        }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
