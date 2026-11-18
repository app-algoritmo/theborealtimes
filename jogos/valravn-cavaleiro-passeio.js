/* Valravn — o cavaleiro vira corvo: passeio do cavalo num tabuleiro de 5 por 5 (invenção). */
BTJogo.registrar({
  canvas: 'jogo-valravn',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O cavaleiro-corvo",
    "sub": "Passe por todas as 25 casas do tabuleiro, uma vez só cada, movendo-se como o cavalo do xadrez: duas casas numa direção e uma de lado. Toque numa casa marcada para ir até ela, e toque na casa em que está para voltar um passo. Até 300 segundos.",
    "perdeu": "O tempo acabou",
    "v1": "O corvo cobriu o tabuleiro inteiro!",
    "v2": "O valravn é um corvo sobrenatural do folclore dinamarquês, e a balada \"Valravnen\" mais antiga está nas anotações manuscritas de Jens Bille, de 1555 a 1559. O tabuleiro é invenção.",
    "h1": "Casas",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The knight-raven",
    "sub": "Visit all 25 squares of the board, each only once, moving like the chess knight: two squares one way and one to the side. Tap a marked square to go to it, and tap the square you are on to go back one step. Up to 300 seconds.",
    "perdeu": "Time ran out",
    "v1": "The raven covered the whole board!",
    "v2": "The valravn is a supernatural raven of Danish folklore, and the earliest version of the ballad \"Valravnen\" is in Jens Bille's handwritten notes, from 1555 to 1559. The board is invented.",
    "h1": "Squares",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Ridder-ravnen",
    "sub": "Besøk alle 25 rutene på brettet, hver bare én gang, og flytt deg som sjakkspringeren: to ruter i én retning og én til siden. Trykk på en markert rute for å gå dit, og trykk på ruta du står på for å gå ett skritt tilbake. Opptil 300 sekunder.",
    "perdeu": "Tiden tok slutt",
    "v1": "Ravnen dekket hele brettet!",
    "v2": "Valravnen er en overnaturlig ravn i dansk folketro, og den eldste visa «Valravnen» står i Jens Billes håndskrevne notater fra 1555 til 1559. Brettet er oppfunnet.",
    "h1": "Ruter",
    "h2": "Tid"
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
    var N = 5, LIM = 300;
    var path = [], t = 0;
    function reset() { var cs = [0, 4, 20, 24]; path = [cs[Math.floor(Math.random() * 4)]]; t = 0; st = 'play'; }
    function kn(a, b) { var dr = Math.abs(Math.floor(a / N) - Math.floor(b / N)), dc = Math.abs(a % N - b % N); return (dr === 1 && dc === 2) || (dr === 2 && dc === 1); }
    function lay() { var W = api.w, H = api.h, cs = Math.max(34, Math.min((W - 24) / 5, (H - 150) / 5, 70)); return { cs: cs, x0: (W - cs * 5) / 2, y0: 84 + Math.max(0, (H - 140 - cs * 5) / 2) }; }
    function cpos(i) { var L = lay(); return { x: L.x0 + (i % N + 0.5) * L.cs, y: L.y0 + (Math.floor(i / N) + 0.5) * L.cs }; }
    function cur() { return path[path.length - 1]; }
    function tap(i) {
      if (st !== 'play') return;
      if (i === cur()) { if (path.length > 1) path.pop(); return; }
      if (path.indexOf(i) >= 0 || !kn(cur(), i)) return;
      path.push(i); if (api.nota) api.nota(260 + path.length * 14, 0.08, 'triangle', 0.05);
      if (path.length === 25) st = 'win';
    }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { var ps = []; for (var i = 0; i < 25; i++) ps.push(cpos(i)); return { st: st, path: path.slice(), cells: ps, t: t }; },
      down: function (x, y) { if (menu()) return; var L = lay(); for (var i = 0; i < 25; i++) { var p = cpos(i); if (Math.abs(x - p.x) < L.cs / 2 && Math.abs(y - p.y) < L.cs / 2) { tap(i); return; } } },
      move: function () {}, up: function () {},
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'Backspace' && path.length > 1) path.pop(); },
      update: function (dt) { if (st !== 'play') return; t += dt; if (t >= LIM) st = 'lose'; },
      draw: function () {
        var L = lay(), i; bg('#1f1a2c', '#08060f');
        for (i = 0; i < 25; i++) {
          var p = cpos(i), k = path.indexOf(i), ok = st === 'play' && k < 0 && kn(cur(), i);
          g.fillStyle = k >= 0 ? (i === cur() ? '#8a5fd0' : '#4a3a78') : ok ? 'rgba(255,216,138,.35)' : ((Math.floor(i / N) + i % N) % 2 ? 'rgba(240,226,190,.16)' : 'rgba(240,226,190,.08)'); rr(p.x - L.cs / 2 + 2, p.y - L.cs / 2 + 2, L.cs - 4, L.cs - 4, 6); g.fill();
          if (ok) { g.strokeStyle = '#ffd88a'; g.lineWidth = 2; rr(p.x - L.cs / 2 + 2, p.y - L.cs / 2 + 2, L.cs - 4, L.cs - 4, 6); g.stroke(); }
          if (k >= 0) txt(String(k + 1), p.x, p.y + L.cs * 0.12, L.cs * 0.36, '#f3ecd2');
        }
        bar(api.w / 2 - 110, api.h - 14, 220, 5, (LIM - t) / LIM, LIM - t < 40 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + path.length + '/25', T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };

  }
});
