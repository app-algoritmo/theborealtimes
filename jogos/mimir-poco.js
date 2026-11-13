/* O poço de Mímir — a cabeça sábia faz cinco perguntas sobre a própria história. */
BTJogo.registrar({
  canvas: 'jogo-mimir',
  t: {
    pt: {
      titulo: 'O poço de Mímir',
      sub: 'A cabeça de Mímir fala do fundo do poço e testa o que você aprendeu na história. Responda cinco perguntas; com três erros, a água turva.',
      toque: 'Toque para começar', pergunta: 'Pergunta', erros: 'Erros',
      perdeu: 'A água turvou', de_novo: 'Toque para tentar de novo',
      v1: 'Você bebeu do poço!',
      v2: 'As perguntas vêm da matéria sobre Mímir. A cabeça que fala aparece na Ynglinga saga e o poço sob a raiz, na Gylfaginning.',
      jogar: 'Toque para jogar de novo',
      q: [
        ['Onde fica o poço de Mímir?', ['Sob uma raiz de Yggdrasil', 'No topo de Asgard', 'Dentro de Valhalla'], 0],
        ['O que Odin deixou no poço, como penhor?', ['Um olho', 'A lança', 'Um corvo'], 0],
        ['Quem cortou a cabeça de Mímir?', ['Os Vanir', 'Os gigantes de gelo', 'Loki'], 0],
        ['Como Odin preservou a cabeça?', ['Com ervas e encantamentos', 'Com gelo', 'Com ouro'], 0],
        ['O que o nome Mímir sugere?', ['Aquele que se lembra', 'O mais forte', 'O viajante'], 0]
      ]
    },
    en: {
      titulo: "Mímir's well",
      sub: "Mímir's head speaks from the bottom of the well and tests what you learned in the story. Answer five questions; with three mistakes, the water clouds over.",
      toque: 'Tap to start', pergunta: 'Question', erros: 'Mistakes',
      perdeu: 'The water clouded over', de_novo: 'Tap to try again',
      v1: 'You drank from the well!',
      v2: 'The questions come from the article on Mímir. The talking head appears in the Ynglinga saga and the well under the root in the Gylfaginning.',
      jogar: 'Tap to play again',
      q: [
        ["Where is Mímir's well?", ['Under a root of Yggdrasil', 'On top of Asgard', 'Inside Valhalla'], 0],
        ['What did Odin leave in the well, as a pledge?', ['An eye', 'His spear', 'A raven'], 0],
        ["Who cut off Mímir's head?", ['The Vanir', 'The frost giants', 'Loki'], 0],
        ['How did Odin preserve the head?', ['With herbs and spells', 'With ice', 'With gold'], 0],
        ['What does the name Mímir suggest?', ['The one who remembers', 'The strongest', 'The traveller'], 0]
      ]
    },
    no: {
      titulo: 'Mimes brønn',
      sub: 'Mimes hode taler fra bunnen av brønnen og tester det du lærte i historien. Svar på fem spørsmål; med tre feil blir vannet grumsete.',
      toque: 'Trykk for å starte', pergunta: 'Spørsmål', erros: 'Feil',
      perdeu: 'Vannet ble grumsete', de_novo: 'Trykk for å prøve igjen',
      v1: 'Du drakk av brønnen!',
      v2: 'Spørsmålene kommer fra artikkelen om Mime. Det talende hodet står i Ynglingesaga og brønnen under roten i Gylfaginning.',
      jogar: 'Trykk for å spille igjen',
      q: [
        ['Hvor ligger Mimes brønn?', ['Under en rot av Yggdrasil', 'På toppen av Åsgard', 'Inne i Valhall'], 0],
        ['Hva la Odin igjen i brønnen som pant?', ['Et øye', 'Spydet', 'En ravn'], 0],
        ['Hvem hogde hodet av Mime?', ['Vanene', 'Frostjotnene', 'Loke'], 0],
        ['Hvordan bevarte Odin hodet?', ['Med urter og trolldom', 'Med is', 'Med gull'], 0],
        ['Hva antyder navnet Mime?', ['Den som husker', 'Den sterkeste', 'Den reisende'], 0]
      ]
    }
  },
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt, MAXE = 3;
    var st = 'menu', qi = 0, errs = 0, ord = [], sel = -1, wait = 0, flash = 0, tt = 0;
    function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
    function reset() { st = 'play'; qi = 0; errs = 0; sel = -1; wait = 0; mk(); }
    function mk() { ord = shuffle([0, 1, 2]); sel = -1; wait = 0; tt = 0; }
    function geo(k) {
      var w = api.w, h = api.h, bw = Math.min(w - 40, 520), bh = 52, y0 = Math.max(h * 0.5, 215);
      return { x: (w - bw) / 2, y: y0 + k * (bh + 12), w: bw, h: bh };
    }
    function tocar(x, y) {
      if (st === 'menu' || st === 'lose') { reset(); return; }
      if (st === 'win') { st = 'menu'; return; }
      if (wait > 0) return;
      for (var k = 0; k < 3; k++) {
        var G = geo(k);
        if (x >= G.x && x <= G.x + G.w && y >= G.y && y <= G.y + G.h) {
          sel = k; flash = 0.25;
          if (ord[k] !== T.q[qi][2]) { errs++; wait = 0.9; } else wait = 0.6;
          return;
        }
      }
    }
    return {
      pausar: function () {},
      dbg: function () { var p = []; for (var k = 0; k < 3; k++) { var G = geo(k); p.push({ x: G.x + G.w / 2, y: G.y + G.h / 2, ok: ord[k] === T.q[Math.min(qi, T.q.length - 1)][2] }); } return { st: st, qi: qi, errs: errs, opts: p, wait: wait }; },
      down: function (x, y) { tocar(x, y); },
      key: function (c, d) { if (!d) return; if (st !== 'play') { if (c === 'Space' || c === 'Enter') tocar(0, 0); return; } var n = c === 'Digit1' ? 0 : c === 'Digit2' ? 1 : c === 'Digit3' ? 2 : -1; if (n >= 0) { var G = geo(n); tocar(G.x + 2, G.y + 2); } },
      update: function (dt) {
        tt += dt; if (flash > 0) flash -= dt;
        if (st !== 'play' || wait <= 0) return;
        wait -= dt;
        if (wait <= 0) {
          if (errs >= MAXE) { st = 'lose'; return; }
          qi++; if (qi >= T.q.length) { st = 'win'; return; }
          mk();
        }
      },
      draw: function () {
        var W = api.w, H = api.h, i;
        var s = g.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#0f2236'); s.addColorStop(1, '#14352f'); g.fillStyle = s; g.fillRect(0, 0, W, H);
        /* poço */
        var cx = W / 2, wy = Math.min(H * 0.3, 170);
        g.fillStyle = '#2b2f3a'; g.beginPath(); g.ellipse(cx, wy + 40, 90, 26, 0, 0, 6.29); g.fill();
        g.fillStyle = errs >= 2 ? '#5b5a3c' : '#2a6d8f'; g.beginPath(); g.ellipse(cx, wy + 38, 76, 19, 0, 0, 6.29); g.fill();
        txt('🗣️', cx, wy + 34 + Math.sin(tt * 2) * 3, 36, '#fff');
        for (i = 0; i < 7; i++) { g.fillStyle = 'rgba(180,230,255,.18)'; g.fillRect((i * 97 + api.clock * 12) % W, (i * 61 + api.clock * 20) % H, 2, 2); }
        if (st !== 'menu') {
          txt(T.pergunta + ' ' + Math.min(qi + 1, T.q.length) + '/' + T.q.length, 22, 32, 15, '#f3ecd2', 'left');
          txt(T.erros + ': ' + errs + '/' + MAXE, 22, 54, 13, errs ? '#ffb08a' : '#c9b3f2', 'left');
        }
        if (st === 'play') {
          var q = T.q[qi], ls = api.quebra(q[0], Math.min(W - 40, 560), 22, true), y = wy + 96;
          ls.forEach(function (l) { txt(l, W / 2, y, 22, '#fff'); y += 28; });
          for (var k = 0; k < 3; k++) {
            var G = geo(k), cor = '#3b3a63';
            if (sel >= 0 && wait > 0) { if (ord[k] === q[2]) cor = '#1f8a4c'; else if (k === sel) cor = '#a8362e'; }
            g.fillStyle = cor; g.beginPath(); g.roundRect ? g.roundRect(G.x, G.y, G.w, G.h, 14) : g.rect(G.x, G.y, G.w, G.h); g.fill();
            txt(q[1][ord[k]], G.x + G.w / 2, G.y + G.h / 2 + 6, 17, '#fff');
          }
        }
        if (st === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
        else if (st === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
        else if (st === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
      }
    };
  }
});
