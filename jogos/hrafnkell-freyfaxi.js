/* O cavalo de Freyr — toque só em quem monta Freyfaxi. */
BTJogo.registrar({
  canvas: 'jogo-hrafnkell',
  t: {
    pt: {
      titulo: 'O cavalo de Freyr',
      sub: 'Hrafnkell jurou punir quem montasse Freyfaxi. Pastores passam pelo campo: toque apenas em quem estiver montando o cavalo de crina clara. Pegue 8 montadores; três erros (tocar num inocente ou deixar passar um montador) e você perde o juramento.',
      toque: 'Toque para começar', pegos: 'Pegos', erros: 'Erros',
      perdeu: 'O juramento se quebrou', de_novo: 'Toque para tentar de novo',
      v1: 'O juramento foi cumprido!',
      v2: 'Na saga, Hrafnkell mata o pastor que montou Freyfaxi e isso desencadeia a sua queda. O jogo é uma simplificação e inverte o dilema: aqui a pergunta é quem é culpado.',
      jogar: 'Toque para jogar de novo'
    },
    en: {
      titulo: "Freyr's horse",
      sub: 'Hrafnkell swore to punish anyone who rode Freyfaxi. Shepherds cross the field: tap only the one riding the pale-maned horse. Catch 8 riders; three mistakes (tapping an innocent or letting a rider pass) and you break the oath.',
      toque: 'Tap to start', pegos: 'Caught', erros: 'Mistakes',
      perdeu: 'The oath was broken', de_novo: 'Tap to try again',
      v1: 'The oath was kept!',
      v2: 'In the saga, Hrafnkell kills the shepherd who rode Freyfaxi and this sets off his fall. The game is a simplification and turns the dilemma round: here the question is who is guilty.',
      jogar: 'Tap to play again'
    },
    no: {
      titulo: 'Frøys hest',
      sub: 'Hrafnkel sverget å straffe den som red Frøyfaks. Gjetere krysser marken: trykk bare på den som rir hesten med lys manke. Ta 8 ryttere; tre feil (trykk på en uskyldig eller la en rytter passere) og du bryter eden.',
      toque: 'Trykk for å starte', pegos: 'Tatt', erros: 'Feil',
      perdeu: 'Eden ble brutt', de_novo: 'Trykk for å prøve igjen',
      v1: 'Eden ble holdt!',
      v2: 'I sagaen dreper Hrafnkel gjeteren som red Frøyfaks, og det utløser fallet hans. Spillet er en forenkling og snur dilemmaet: her er spørsmålet hvem som er skyldig.',
      jogar: 'Trykk for å spille igjen'
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt, GOAL = 8, MAXE = 3;
    var st = 'menu', caught = 0, errs = 0, ents = [], nxt = 0, flash = 0, spawned = 0;
    function reset() { st = 'play'; caught = 0; errs = 0; ents = []; nxt = 0.8; spawned = 0; flash = 0; }
    function sp() { return 150 + caught * 14; }
    return {
      pausar: function () {},
      dbg: function () { return { st: st, caught: caught, errs: errs, ents: ents.map(function (e) { return { x: e.x, y: e.y, rider: e.rider }; }) }; },
      down: function (x, y) {
        if (st === 'menu' || st === 'lose') { reset(); return; }
        if (st === 'win') { st = 'menu'; return; }
        for (var i = 0; i < ents.length; i++) {
          var e = ents[i];
          if (Math.abs(x - e.x) < 46 && Math.abs(y - e.y) < 52) {
            if (e.rider) { caught++; flash = 0.15; ents.splice(i, 1); if (caught >= GOAL) st = 'win'; }
            else { errs++; flash = -0.25; ents.splice(i, 1); if (errs >= MAXE) st = 'lose'; }
            return;
          }
        }
      },
      key: function (c, d) { if (d && (c === 'Space' || c === 'Enter') && st !== 'play') this.down(0, 0); },
      update: function (dt) {
        if (flash > 0) flash -= dt; else if (flash < 0) flash += dt;
        if (st !== 'play') return;
        nxt -= dt;
        if (nxt <= 0) { spawned++; var rider = Math.random() < 0.45 || (spawned % 4 === 0); ents.push({ x: api.w + 50, y: api.h * 0.58 + (Math.random() - 0.5) * api.h * 0.14, rider: rider }); nxt = (150 / sp()) * (0.9 + Math.random() * 0.7); }
        for (var i = ents.length - 1; i >= 0; i--) {
          var e = ents[i]; e.x -= sp() * dt;
          if (e.x < -60) { if (e.rider) { errs++; flash = -0.25; if (errs >= MAXE) st = 'lose'; } ents.splice(i, 1); }
        }
      },
      draw: function () {
        var W = api.w, H = api.h;
        var s = g.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#6aa6d6'); s.addColorStop(0.5, '#d8e6f0'); s.addColorStop(0.5, '#4b7a3a'); s.addColorStop(1, '#2f5a2a'); g.fillStyle = s; g.fillRect(0, 0, W, H);
        g.fillStyle = '#6b6b78'; g.beginPath(); g.moveTo(0, H * 0.5); g.lineTo(W * 0.2, H * 0.32); g.lineTo(W * 0.42, H * 0.5); g.lineTo(W * 0.7, H * 0.36); g.lineTo(W, H * 0.5); g.fill();
        ents.forEach(function (e) {
          txt(e.rider ? '🏇' : '🚶', e.x, e.y, 46, '#fff');
          if (!e.rider) txt('🐑', e.x + 34, e.y + 14, 22, '#fff');
        });
        if (flash !== 0) { g.fillStyle = flash > 0 ? 'rgba(120,255,160,' + flash + ')' : 'rgba(255,90,70,' + (-flash) + ')'; g.fillRect(0, 0, W, H); }
        if (st !== 'menu') {
          txt(T.pegos + ': ' + caught + '/' + GOAL, 22, 32, 15, '#fff', 'left');
          txt(T.erros + ': ' + errs + '/' + MAXE, 22, 54, 13, errs ? '#ffb08a' : '#f0f0f0', 'left');
        }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
