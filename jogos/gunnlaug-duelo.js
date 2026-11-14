/* O duelo de Gunnlaug — defenda os golpes alto e baixo. */
BTJogo.registrar({
  canvas: 'jogo-gunnlaug',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O duelo de Gunnlaug",
    "sub": "Hrafn ataca de cima ou de baixo. Toque na metade de cima da tela para defender um golpe alto e na de baixo para um golpe baixo, antes que o tempo acabe. Defenda oito golpes; três feridas e o duelo termina.",
    "perdeu": "Você caiu em Dingenes",
    "v1": "Você venceu o duelo!",
    "v2": "Segundo a Saga de Gunnlaug Língua-de-Serpente, o duelo terminou com a morte dos dois. No jogo, só um sobrevive; os golpes são invenção.",
    "h1": "Defesas",
    "h2": "Feridas"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Gunnlaug's duel",
    "sub": "Hrafn strikes from above or below. Tap the upper half of the screen to block a high blow and the lower half for a low blow, before time runs out. Block eight blows; three wounds and the duel is over.",
    "perdeu": "You fell at Dingenes",
    "v1": "You won the duel!",
    "v2": "According to Gunnlaug Serpent-Tongue's Saga, both men died in the duel. In the game only one survives; the blows are made up.",
    "h1": "Blocks",
    "h2": "Wounds"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Gunnlaugs duell",
    "sub": "Hrafn slår ovenfra eller nedenfra. Trykk på øvre halvdel av skjermen for å parere et høyt hogg og på nedre halvdel for et lavt, før tiden går ut. Parer åtte hogg; tre sår og duellen er over.",
    "perdeu": "Du falt på Dingenes",
    "v1": "Du vant duellen!",
    "v2": "Ifølge Sagaen om Gunnlaug Ormstunge døde begge i duellen. I spillet overlever bare én; hoggene er diktet opp.",
    "h1": "Paringer",
    "h2": "Sår"
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
    var GOAL = 8, HP = 3;
    var hits = 0, wounds = 0, att = null, gap = 0, flash = 0, fc = '';
    function reset() { st = 'play'; hits = 0; wounds = 0; att = null; gap = 0.7; flash = 0; }
    function win() { return Math.max(0.6, 1.1 - hits * 0.06); }
    function hurt() { wounds++; flash = 0.25; fc = '#ff6a5a'; att = null; gap = 0.7; if (wounds >= HP) st = 'lose'; }
    function block(dir) { if (!att) return; if (dir === att.dir) { hits++; flash = 0.2; fc = '#6fd08c'; att = null; gap = 0.6; if (hits >= GOAL) st = 'win'; } else hurt(); }
    return {
      pausar: function () {},
      dbg: function () { return { st: st, hits: hits, wounds: wounds, att: att ? { dir: att.dir, t: att.t, w: att.w } : null, h: api.h }; },
      down: function (x, y) { if (menu()) return; block(y < api.h / 2 ? 0 : 1); },
      key: function (c, d) { if (!d) return; if (st !== 'play') { if (c === 'Space' || c === 'Enter') menu(); return; } if (c === 'ArrowUp' || c === 'KeyW') block(0); if (c === 'ArrowDown' || c === 'KeyS') block(1); },
      update: function (dt) {
        if (flash > 0) flash -= dt; if (st !== 'play') return;
        if (att) { att.t -= dt; if (att.t <= 0) hurt(); }
        else { gap -= dt; if (gap <= 0) { var w = win(); att = { dir: Math.random() < 0.5 ? 0 : 1, t: w, w: w }; } }
      },
      draw: function () {
        var W = api.w, H = api.h;
        bg('#35405a', '#1c2230');
        g.fillStyle = '#2b2f3a'; g.fillRect(0, H * 0.72, W, H * 0.28);
        g.strokeStyle = 'rgba(255,255,255,.18)'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, H / 2); g.lineTo(W, H / 2); g.stroke();
        g.fillStyle = '#5a6f9a'; g.fillRect(W * 0.18, H * 0.38, 46, H * 0.34); g.fillStyle = '#e8c9a0'; g.beginPath(); g.arc(W * 0.18 + 23, H * 0.34, 20, 0, 6.29); g.fill();
        g.fillStyle = '#8a4a3a'; g.fillRect(W * 0.78, H * 0.38, 46, H * 0.34); g.fillStyle = '#e8c9a0'; g.beginPath(); g.arc(W * 0.78 + 23, H * 0.34, 20, 0, 6.29); g.fill();
        if (att) {
          var sy = att.dir === 0 ? H * 0.28 : H * 0.62, k = 1 - att.t / att.w;
          g.strokeStyle = '#e8edf5'; g.lineWidth = 6; g.beginPath(); g.moveTo(W * 0.78 - 10, H * 0.5); g.lineTo(W * 0.78 - 10 - 130 * (0.4 + k * 0.6), sy); g.stroke();
          txt(att.dir === 0 ? '▲' : '▼', W / 2, att.dir === 0 ? H * 0.22 : H * 0.88, 40, '#ffd88a');
          g.fillStyle = '#ffd88a'; g.fillRect(W * 0.25, H - 10, W * 0.5 * Math.max(0, att.t / att.w), 6);
        }
        if (flash > 0) { g.fillStyle = fc; g.globalAlpha = flash * 0.5; g.fillRect(0, 0, W, H); g.globalAlpha = 1; }
        hud(T.h1 + ' ' + hits + '/' + GOAL, T.h2 + ' ' + wounds + '/' + HP, wounds > 0);
        fim(st);
      }
    };
  }
});
