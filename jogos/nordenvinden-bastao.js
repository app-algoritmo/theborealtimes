/* O bastão do Vento Norte — bata em quem surgir. */
BTJogo.registrar({
  canvas: 'jogo-nordenvinden',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O bastão do Vento Norte",
    "sub": "Os homens do estalajadeiro espiam pelas janelas. Toque (ou use as teclas de 1 a 9, em grade) em cada ladrão de capuz vermelho antes que ele se esconda, mas poupe os hóspedes de gorro azul. Dê 24 pancadas. Cinco falhas encerram o jogo.",
    "perdeu": "O estalajadeiro escapou",
    "v1": "O estalajadeiro aprendeu a lição!",
    "v2": "No conto de Asbjørnsen e Moe, o rapaz recebe do Vento Norte um bastão que bate por ordem. A casa de janelas é invenção do jogo.",
    "h1": "Acertos",
    "h2": "Falhas"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The North Wind's cudgel",
    "sub": "The innkeeper's men peek out of the windows. Tap (or use the number keys 1 to 9, laid out as a grid) each thief in a red hood before he hides, but spare the guests in blue caps. Land 24 blows. Five misses end the game.",
    "perdeu": "The innkeeper got away",
    "v1": "The innkeeper learned his lesson!",
    "v2": "In the tale collected by Asbjørnsen and Moe, the boy gets a cudgel from the North Wind that strikes on command. The house of windows is made up.",
    "h1": "Hits",
    "h2": "Misses"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Nordavindens kjepp",
    "sub": "Vertens menn titter ut av vinduene. Trykk (eller bruk tastene 1 til 9, lagt ut som et rutenett) på hver tyv med rød hette før han gjemmer seg, men skån gjestene med blå lue. Gi 24 slag. Fem feil avslutter spillet.",
    "perdeu": "Verten slapp unna",
    "v1": "Verten fikk sin lærepenge!",
    "v2": "I eventyret samlet av Asbjørnsen og Moe får gutten en kjeppen av Nordavinden som slår på ordre. Huset med vinduer er diktet opp.",
    "h1": "Treff",
    "h2": "Feil"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "El bastón del Viento del Norte",
    "sub": "Los hombres del posadero se asoman por las ventanas. Toca (o usa las teclas del 1 al 9, en cuadrícula) a cada ladrón de capucha roja antes de que se esconda, pero respeta a los huéspedes de gorro azul. Da 24 golpes. Cinco fallos acaban el juego.",
    "perdeu": "El posadero escapó",
    "v1": "¡El posadero aprendió la lección!",
    "v2": "En el cuento de Asbjørnsen y Moe, el muchacho recibe del Viento del Norte un bastón que golpea por orden. La casa de ventanas es invención del juego.",
    "h1": "Aciertos",
    "h2": "Fallos"
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
    var NEED = 24, MAXF = 5, LIM = 120;
    var hl = [], hits = 0, fails = 0, tmr = LIM, spt = 0.8, spawned = 0, flash = [], pop = 0;
    function lay() { var W = api.w, H = api.h, cs = Math.min((W - 30) / 3, (H - 150) / 3, 118); return { cs: cs, x: (W - cs * 3) / 2, y: Math.max(72, (H - cs * 3) / 2 + 10) }; }
    function setup() { hl = []; flash = []; for (var i = 0; i < 9; i++) { hl.push(null); flash.push(0); } hits = 0; fails = 0; tmr = LIM; spt = 0.8; spawned = 0; }
    function reset() { setup(); st = 'play'; }
    function hitCell(i) { if (st !== 'play') return; var h = hl[i]; if (!h || h.out) return; if (h.good) { fails++; flash[i] = -1; if (api.nota) api.nota(120, 0.2, 'sawtooth', 0.06); } else { hits++; flash[i] = 1; if (api.nota) api.nota(480, 0.07, 'square', 0.06); } hl[i] = null; if (hits >= NEED) st = 'win'; else if (fails >= MAXF) st = 'lose'; }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, hl: hl.map(function (h) { return h ? { good: h.good, age: h.age, life: h.life } : null; }), hits: hits, fails: fails, x: L.x, y: L.y, cs: L.cs }; },
      down: function (x, y) { if (menu()) return; var L = lay(), c = Math.floor((x - L.x) / L.cs), r = Math.floor((y - L.y) / L.cs); if (c >= 0 && c < 3 && r >= 0 && r < 3) hitCell(r * 3 + c); },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } var M = { Digit7: 0, Digit8: 1, Digit9: 2, Digit4: 3, Digit5: 4, Digit6: 5, Digit1: 6, Digit2: 7, Digit3: 8, KeyQ: 0, KeyW: 1, KeyE: 2, KeyA: 3, KeyS: 4, KeyD: 5, KeyZ: 6, KeyX: 7, KeyC: 8, Numpad7: 0, Numpad8: 1, Numpad9: 2, Numpad4: 3, Numpad5: 4, Numpad6: 5, Numpad1: 6, Numpad2: 7, Numpad3: 8 }; if (k in M) hitCell(M[k]); },
      update: function (dt) {
        pop += dt; var i; for (i = 0; i < 9; i++) if (flash[i] !== 0) { flash[i] += (flash[i] > 0 ? -dt * 3 : dt * 3); if (Math.abs(flash[i]) < 0.05) flash[i] = 0; }
        if (st !== 'play') return; tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; return; }
        for (i = 0; i < 9; i++) { var h = hl[i]; if (!h) continue; h.age += dt; if (h.age >= h.life) { if (!h.good) { fails++; if (api.nota) api.nota(110, 0.25, 'sawtooth', 0.06); if (fails >= MAXF) st = 'lose'; } hl[i] = null; } }
        spt -= dt; if (spt <= 0) { var free = []; for (i = 0; i < 9; i++) if (!hl[i]) free.push(i); var act = 9 - free.length; if (free.length && act < 3) { var c = free[Math.floor(Math.random() * free.length)]; spawned++; hl[c] = { good: Math.random() < 0.2, age: 0, life: Math.max(0.65, 1.25 - spawned * 0.02) }; } spt = Math.max(0.4, 0.85 - spawned * 0.015) + Math.random() * 0.2; }
      },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), i;
        bg('#2a2018', '#0c0805');
        for (i = 0; i < 9; i++) {
          var x = L.x + (i % 3) * L.cs, y = L.y + Math.floor(i / 3) * L.cs, h = hl[i];
          g.fillStyle = '#4a3624'; rr(x + 4, y + 4, L.cs - 8, L.cs - 8, 10); g.fill(); g.fillStyle = '#120a06'; rr(x + 12, y + 12, L.cs - 24, L.cs - 24, 8); g.fill();
          if (h) { var k = Math.min(1, h.age / 0.12), cx = x + L.cs / 2, cy = y + L.cs / 2 + (1 - k) * L.cs * 0.3;
            g.fillStyle = '#e8c9a0'; g.beginPath(); g.arc(cx, cy, L.cs * 0.2, 0, 6.283); g.fill(); g.fillStyle = h.good ? '#3a6ab0' : '#c0392b'; g.beginPath(); g.arc(cx, cy - L.cs * 0.06, L.cs * 0.22, Math.PI, 0); g.fill(); g.fillStyle = '#222'; g.fillRect(cx - L.cs * 0.09, cy, 4, 4); g.fillRect(cx + L.cs * 0.05, cy, 4, 4);
            bar(x + 14, y + L.cs - 18, L.cs - 28, 3, 1 - h.age / h.life, h.good ? '#6ab0ff' : '#e06a5a'); }
          if (flash[i]) { g.fillStyle = flash[i] > 0 ? 'rgba(255,230,140,' + flash[i] * 0.5 + ')' : 'rgba(200,40,40,' + (-flash[i]) * 0.5 + ')'; rr(x + 4, y + 4, L.cs - 8, L.cs - 8, 10); g.fill(); }
        }
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 20 ? '#c0392b' : '#c9a07a');
        hud(T.h1 + ' ' + hits + '/' + NEED, T.h2 + ' ' + fails + '/' + MAXF, fails > 0);
        fim(st);
      }
    };
  }
});
