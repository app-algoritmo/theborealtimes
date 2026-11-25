/* As luzes do céu — apague todas as luzes da aurora. */
BTJogo.registrar({
  canvas: 'jogo-aurora',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As luzes do céu",
    "sub": "A aurora acendeu o céu. Ao tocar numa luz, ela e as quatro vizinhas (cima, baixo, esquerda e direita) trocam: acesas apagam, apagadas acendem. Apague todas as 25 luzes. Há um limite de toques e de tempo.",
    "perdeu": "O céu continuou aceso",
    "v1": "O céu ficou escuro e calmo!",
    "v2": "O Speculum Regale, texto norueguês do século XIII, tenta explicar a aurora boreal. O jogo de luzes é invenção.",
    "h1": "Luzes",
    "h2": "Toques"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The lights of the sky",
    "sub": "The aurora has lit the sky. Tapping a light switches it and its four neighbours (up, down, left and right): lit ones go out, dark ones light up. Put out all 25 lights. There is a limit on taps and on time.",
    "perdeu": "The sky stayed lit",
    "v1": "The sky is dark and calm!",
    "v2": "The Speculum Regale, a 13th-century Norwegian text, tries to explain the northern lights. The light game is made up.",
    "h1": "Lights",
    "h2": "Taps"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Himmelens lys",
    "sub": "Nordlyset har tent himmelen. Når du trykker på et lys, bytter det og de fire naboene (opp, ned, venstre og høyre): tente slukker, slukte tennes. Slukk alle 25 lysene. Det er en grense for trykk og tid.",
    "perdeu": "Himmelen forble tent",
    "v1": "Himmelen ble mørk og rolig!",
    "v2": "Konungs skuggsjá, en norsk tekst fra 1200-tallet, prøver å forklare nordlyset. Lysspillet er diktet opp.",
    "h1": "Lys",
    "h2": "Trykk"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "Las luces del cielo",
    "sub": "La aurora ha encendido el cielo. Al tocar una luz, ella y las cuatro vecinas (arriba, abajo, izquierda y derecha) cambian: las encendidas se apagan y las apagadas se encienden. Apaga las 25 luces. Hay un límite de toques y de tiempo.",
    "perdeu": "El cielo siguió encendido",
    "v1": "¡El cielo quedó oscuro y en calma!",
    "v2": "El Speculum Regale, texto noruego del siglo XIII, intenta explicar la aurora boreal. El juego de luces es invención.",
    "h1": "Luces",
    "h2": "Toques"
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
    var N = 5, MAXM = 28, LIM = 200;
    var lt = [], moves = 0, tmr = LIM, cur = 12, pop = 0;
    function lay() { var W = api.w, H = api.h, S = Math.min(W - 30, H - 160, 340), cs = S / N; return { S: S, cs: cs, x: (W - S) / 2, y: Math.max(72, (H - S) / 2 + 8) }; }
    function tog(i) { var x = i % N, y = Math.floor(i / N); [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) { var a = x + d[0], b = y + d[1]; if (a >= 0 && b >= 0 && a < N && b < N) lt[b * N + a] ^= 1; }); }
    function nOn() { var n = 0; for (var i = 0; i < N * N; i++) n += lt[i]; return n; }
    function setup() { do { lt = []; for (var i = 0; i < N * N; i++) lt.push(0); for (i = 0; i < N * N; i++) if (Math.random() < 0.5) tog(i); } while (nOn() < 8); moves = 0; tmr = LIM; cur = 12; }
    function reset() { setup(); st = 'play'; }
    function press(i) { if (st !== 'play') return; tog(i); moves++; if (api.nota) api.nota(260 + (i % N) * 40, 0.06, 'triangle', 0.05); if (nOn() === 0) st = 'win'; else if (moves >= MAXM) st = 'lose'; }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, lt: lt.slice(), moves: moves, x: L.x, y: L.y, cs: L.cs, N: N }; },
      down: function (x, y) { if (menu()) return; var L = lay(), c = Math.floor((x - L.x) / L.cs), r = Math.floor((y - L.y) / L.cs); if (c >= 0 && c < N && r >= 0 && r < N) { cur = r * N + c; press(cur); } },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } var r = Math.floor(cur / N), c = cur % N; if (k === 'ArrowUp' || k === 'KeyW') r = Math.max(0, r - 1); else if (k === 'ArrowDown' || k === 'KeyS') r = Math.min(N - 1, r + 1); else if (k === 'ArrowLeft' || k === 'KeyA') c = Math.max(0, c - 1); else if (k === 'ArrowRight' || k === 'KeyD') c = Math.min(N - 1, c + 1); else if (k === 'Space' || k === 'Enter') { press(cur); return; } cur = r * N + c; },
      update: function (dt) { pop += dt; if (st === 'play') { tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; } } },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), i, k;
        bg('#0c1830', '#03060e');
        for (k = 0; k < 30; k++) { g.fillStyle = 'rgba(255,255,255,' + (0.2 + 0.2 * Math.sin(pop * 2 + k)) + ')'; g.fillRect((k * 97) % W, 56 + (k * 53) % (H - 80), 2, 2); }
        for (i = 0; i < N * N; i++) {
          var x = L.x + (i % N) * L.cs, y = L.y + Math.floor(i / N) * L.cs, on = lt[i];
          if (on) { var gr = g.createLinearGradient(x, y, x, y + L.cs); gr.addColorStop(0, '#7affb0'); gr.addColorStop(1, '#2ab07a'); g.fillStyle = gr; } else g.fillStyle = '#16263e';
          rr(x + 3, y + 3, L.cs - 6, L.cs - 6, 10); g.fill();
          if (on) { g.strokeStyle = 'rgba(180,255,220,.5)'; g.lineWidth = 2; g.beginPath(); g.moveTo(x + L.cs * 0.3, y + L.cs * 0.7); g.quadraticCurveTo(x + L.cs * 0.5, y + L.cs * 0.2 + Math.sin(pop * 3 + i) * 4, x + L.cs * 0.7, y + L.cs * 0.7); g.stroke(); }
          if (i === cur && st === 'play') { g.strokeStyle = 'rgba(255,216,138,.8)'; g.lineWidth = 2; rr(x + 3, y + 3, L.cs - 6, L.cs - 6, 10); g.stroke(); }
        }
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 40 ? '#c0392b' : '#7affb0');
        hud(T.h1 + ' ' + (N * N - nOn()) + '/' + N * N, T.h2 + ' ' + moves + '/' + MAXM, moves > MAXM - 8);
        fim(st);
      }
    };
  }
});
