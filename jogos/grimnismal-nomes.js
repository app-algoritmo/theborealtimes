/* Grímnismál — recolha os nomes de Odin entre as chamas. */
BTJogo.registrar({
  canvas: 'jogo-grimnir',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os nomes de Odin",
    "sub": "Guie a faísca pelo salão. Setas ou WASD, ou toque na direção que quer seguir (arrastar também vale). Cada nome recolhido a faz crescer. Recolha 12 nomes sem encostar nas chamas das bordas nem no próprio rastro.",
    "perdeu": "A faísca se apagou nas chamas",
    "v1": "Odin revelou todos os nomes!",
    "v2": "No Grímnismál, Odin disfarçado diz muitos dos seus nomes, entre duas fogueiras. O jogo de recolher nomes é invenção.",
    "h1": "Nomes",
    "h2": "Rastro"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Odin's names",
    "sub": "Guide the spark around the hall. Arrows or WASD, or tap in the direction you want to go (dragging works too). Every name collected makes it grow. Collect 12 names without touching the flames at the edges or your own trail.",
    "perdeu": "The spark died in the flames",
    "v1": "Odin revealed all his names!",
    "v2": "In the Grímnismál, Odin in disguise tells many of his names, between two fires. The name-collecting game is made up.",
    "h1": "Names",
    "h2": "Trail"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Odins navn",
    "sub": "Styr gnisten gjennom salen. Piltaster eller WASD, eller trykk i retningen du vil gå (å dra fungerer også). Hvert navn du samler, får den til å vokse. Samle 12 navn uten å røre flammene i kantene eller ditt eget spor.",
    "perdeu": "Gnisten døde i flammene",
    "v1": "Odin avslørte alle navnene sine!",
    "v2": "I Grímnismál sier Odin i forkledning mange av navnene sine, mellom to bål. Spillet med å samle navn er diktet opp.",
    "h1": "Navn",
    "h2": "Spor"
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
    var GOAL = 12;
    var cols = 16, rows = 10, sn = [], dir = [1, 0], q = [], food = null, got = 0, acc = 0, pop = 0, held = false;
    function lay() { var W = api.w, H = api.h, cs = Math.max(14, Math.min((W - 24) / cols, (H - 150) / rows, 40)); return { cs: cs, x: (W - cs * cols) / 2, y: Math.max(84, (H - cs * rows) / 2 + 12) }; }
    function spd() { return 5 + sn.length * 0.14; }
    function setup() { if (api.w >= api.h) { cols = 16; rows = 10; } else { cols = 10; rows = 15; } var cx = Math.floor(cols / 3), cy = Math.floor(rows / 2); sn = [[cx, cy], [cx - 1, cy], [cx - 2, cy]]; dir = [1, 0]; q = []; got = 0; acc = 0; placeFood(); }
    function free(x, y) { for (var i = 0; i < sn.length; i++) if (sn[i][0] === x && sn[i][1] === y) return false; return true; }
    function placeFood() { var f = []; for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++) if (free(x, y)) f.push([x, y]); food = f[Math.floor(Math.random() * f.length)]; }
    function reset() { setup(); st = 'play'; }
    function turn(dx, dy) { var last = q.length ? q[q.length - 1] : dir; if (dx === -last[0] && dy === -last[1]) return; if (dx === last[0] && dy === last[1]) return; if (q.length < 2) q.push([dx, dy]); }
    function step() {
      if (q.length) dir = q.shift(); var h = sn[0], nx = h[0] + dir[0], ny = h[1] + dir[1];
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) { st = 'lose'; if (api.nota) api.nota(120, 0.25, 'sawtooth', 0.07); return; }
      var eat = food && nx === food[0] && ny === food[1]; var body = eat ? sn : sn.slice(0, sn.length - 1);
      for (var i = 0; i < body.length; i++) if (body[i][0] === nx && body[i][1] === ny) { st = 'lose'; if (api.nota) api.nota(120, 0.25, 'sawtooth', 0.07); return; }
      sn.unshift([nx, ny]); if (eat) { got++; if (api.nota) api.nota(480 + got * 30, 0.1, 'triangle', 0.06); if (got >= GOAL) { st = 'win'; return; } placeFood(); } else sn.pop();
    }
    function aim(x, y) { var L = lay(), h = sn[0], hx = L.x + (h[0] + 0.5) * L.cs, hy = L.y + (h[1] + 0.5) * L.cs, dx = x - hx, dy = y - hy; if (Math.abs(dx) > Math.abs(dy)) turn(dx > 0 ? 1 : -1, 0); else turn(0, dy > 0 ? 1 : -1); }
    setup();
    return {
      pausar: function () { held = false; },
      dbg: function () { return { st: st, sn: sn.map(function (s) { return s.slice(); }), dir: dir.slice(), food: food ? food.slice() : null, cols: cols, rows: rows, got: got, q: q.length }; },
      down: function (x, y) { if (menu()) return; held = true; aim(x, y); },
      move: function (x, y, pr) { if (held && st === 'play') aim(x, y); },
      up: function () { held = false; },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'ArrowUp' || k === 'KeyW') turn(0, -1); else if (k === 'ArrowDown' || k === 'KeyS') turn(0, 1); else if (k === 'ArrowLeft' || k === 'KeyA') turn(-1, 0); else if (k === 'ArrowRight' || k === 'KeyD') turn(1, 0); },
      update: function (dt) { pop += dt; if (st !== 'play') return; acc += dt; var s = 1 / spd(); while (acc >= s && st === 'play') { acc -= s; step(); } },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), i;
        bg('#2a1408', '#0c0402');
        g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(L.x, L.y, L.cs * cols, L.cs * rows);
        for (i = 0; i < cols * 2 + rows * 2; i++) { var px, py; if (i < cols) { px = i; py = -1; } else if (i < cols * 2) { px = i - cols; py = rows; } else if (i < cols * 2 + rows) { px = -1; py = i - cols * 2; } else { px = cols; py = i - cols * 2 - rows; } g.fillStyle = 'rgba(' + (220 + Math.floor(Math.sin(pop * 6 + i) * 30)) + ',' + (90 + Math.floor(Math.sin(pop * 5 + i * 2) * 40)) + ',30,.8)'; g.beginPath(); g.arc(L.x + (px + 0.5) * L.cs, L.y + (py + 0.5) * L.cs, L.cs * (0.32 + 0.08 * Math.sin(pop * 7 + i)), 0, 6.283); g.fill(); }
        if (food) { g.fillStyle = '#ffd88a'; g.beginPath(); g.arc(L.x + (food[0] + 0.5) * L.cs, L.y + (food[1] + 0.5) * L.cs, L.cs * (0.3 + 0.05 * Math.sin(pop * 6)), 0, 6.283); g.fill(); txt('ᚨ', L.x + (food[0] + 0.5) * L.cs, L.y + (food[1] + 0.5) * L.cs + L.cs * 0.22, L.cs * 0.6, 'rgba(0,0,0,.6)'); }
        for (i = sn.length - 1; i >= 0; i--) { g.fillStyle = i === 0 ? '#fff0c0' : 'hsl(' + (36 - Math.min(20, i)) + ',90%,' + (62 - Math.min(26, i * 1.5)) + '%)'; rr(L.x + sn[i][0] * L.cs + 2, L.y + sn[i][1] * L.cs + 2, L.cs - 4, L.cs - 4, 6); g.fill(); }
        hud(T.h1 + ' ' + got + '/' + GOAL, T.h2 + ' ' + sn.length, false);
        fim(st);
      }
    };
  }
});
