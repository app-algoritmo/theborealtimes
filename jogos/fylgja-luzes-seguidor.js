/* Fylgja — conduza o espírito acompanhante e recolha as luzes. */
BTJogo.registrar({
  canvas: 'jogo-fylgja',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O espírito que segue",
    "sub": "Deslize o dedo (ou use as setas) para conduzir o espírito. Cada luz o faz crescer. Recolha 12 luzes sem encostar nas bordas nem no próprio corpo do espírito, em até 120 segundos.",
    "perdeu": "O espírito bateu ou o tempo acabou",
    "v1": "Doze luzes recolhidas!",
    "v2": "Nas sagas, a fylgja é um espírito que acompanha uma pessoa. A condução de luzes é invenção do jogo.",
    "h1": "Luzes",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The spirit that follows",
    "sub": "Swipe your finger (or use the arrow keys) to lead the spirit. Each light makes it grow. Gather 12 lights without touching the edges or the spirit's own body, within 120 seconds.",
    "perdeu": "The spirit hit something or the time ran out",
    "v1": "Twelve lights gathered!",
    "v2": "In the sagas, the fylgja is a spirit that accompanies a person. Leading it to lights is made up for the game.",
    "h1": "Lights",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Ånden som følger",
    "sub": "Sveip fingeren (eller bruk piltastene) for å lede ånden. Hvert lys får den til å vokse. Samle 12 lys uten å røre kantene eller åndens egen kropp, innen 120 sekunder.",
    "perdeu": "Ånden traff noe, eller tiden gikk ut",
    "v1": "Tolv lys samlet!",
    "v2": "I sagaene er fylgjaen en ånd som følger et menneske. Å lede den til lys er diktet opp for spillet.",
    "h1": "Lys",
    "h2": "Tid"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "El espíritu que sigue",
    "sub": "Desliza el dedo (o usa las flechas) para conducir al espíritu. Cada luz lo hace crecer. Recoge 12 luces sin tocar los bordes ni el propio cuerpo del espíritu, en un máximo de 120 segundos.",
    "perdeu": "El espíritu chocó o se acabó el tiempo",
    "v1": "¡Doce luces recogidas!",
    "v2": "En las sagas, la fylgja es un espíritu que acompaña a una persona. La conducción de luces es un invento del juego.",
    "h1": "Luces",
    "h2": "Tiempo"
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
    var NC = 14, GOAL = 12, LIM = 120;
    var body = [], dir = [1, 0], q = [], light = null, acc = 0, t = 0, lights = 0, sx = 0, sy = 0, sw = false;
    function lay() { var W = api.w, H = api.h, cs = Math.max(16, Math.min((W - 24) / NC, (H - 150) / NC, 40)); return { cs: cs, x: (W - cs * NC) / 2, y: Math.max(88, (H - cs * NC) / 2 + 8) }; }
    function setup() { body = [[3, 7], [2, 7], [1, 7]]; dir = [1, 0]; q = []; acc = 0; t = 0; lights = 0; place(); }
    function reset() { setup(); st = 'play'; }
    function place() { var f; do { f = [Math.floor(Math.random() * NC), Math.floor(Math.random() * NC)]; } while (body.some(function (b) { return b[0] === f[0] && b[1] === f[1]; })); light = f; }
    function turn(d) { var last = q.length ? q[q.length - 1] : dir; if (d[0] === -last[0] && d[1] === -last[1]) return; if (d[0] === last[0] && d[1] === last[1]) return; if (q.length < 2) q.push(d); }
    function step() { if (q.length) dir = q.shift(); var h = [body[0][0] + dir[0], body[0][1] + dir[1]]; if (h[0] < 0 || h[1] < 0 || h[0] >= NC || h[1] >= NC) { st = 'lose'; if (api.nota) api.nota(110, 0.4, 'sawtooth', 0.07); return; } var grow = h[0] === light[0] && h[1] === light[1]; var chk = grow ? body : body.slice(0, -1); if (chk.some(function (b) { return b[0] === h[0] && b[1] === h[1]; })) { st = 'lose'; if (api.nota) api.nota(110, 0.4, 'sawtooth', 0.07); return; } body.unshift(h); if (grow) { lights++; if (api.nota) api.nota(500 + lights * 30, 0.08, 'triangle', 0.06); if (lights >= GOAL) { st = 'win'; return; } place(); } else body.pop(); }
    setup();
    return {
      pausar: function () { sw = false; },
      dbg: function () { return { st: st, body: body.map(function (b) { return b.slice(); }), dir: dir.slice(), q: q.length, light: light.slice(), lights: lights, NC: NC, t: t, tmr: LIM - t }; },
      down: function (x, y) { if (menu()) return; sx = x; sy = y; sw = true; },
      move: function (x, y, pr) { if (!sw || !pr || st !== 'play') return; var dx = x - sx, dy = y - sy; if (Math.max(Math.abs(dx), Math.abs(dy)) > 22) { if (Math.abs(dx) > Math.abs(dy)) turn([dx > 0 ? 1 : -1, 0]); else turn([0, dy > 0 ? 1 : -1]); sx = x; sy = y; } },
      up: function () { sw = false; },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'ArrowLeft' || k === 'KeyA') turn([-1, 0]); else if (k === 'ArrowRight' || k === 'KeyD') turn([1, 0]); else if (k === 'ArrowUp' || k === 'KeyW') turn([0, -1]); else if (k === 'ArrowDown' || k === 'KeyS') turn([0, 1]); },
      update: function (dt) { if (st !== 'play') return; t += dt; if (t >= LIM) { t = LIM; st = 'lose'; return; } acc += dt; var iv = Math.max(0.1, 0.19 - lights * 0.006); while (acc >= iv && st === 'play') { acc -= iv; step(); } },
      draw: function () {
        var L = lay(), W = api.w, H = api.h, i;
        bg('#0f1c26', '#03070a');
        g.fillStyle = 'rgba(255,255,255,.04)'; rr(L.x - 4, L.y - 4, L.cs * NC + 8, L.cs * NC + 8, 8); g.fill(); g.strokeStyle = 'rgba(255,216,138,.35)'; g.lineWidth = 2; g.strokeRect(L.x, L.y, L.cs * NC, L.cs * NC);
        g.fillStyle = '#ffe9a0'; g.beginPath(); g.arc(L.x + (light[0] + 0.5) * L.cs, L.y + (light[1] + 0.5) * L.cs, L.cs * 0.3 + Math.sin(Date.now() / 150) * 1.5, 0, 6.283); g.fill();
        for (i = body.length - 1; i >= 0; i--) { var b = body[i], f = 1 - i / (body.length + 3); g.fillStyle = i === 0 ? '#bfeaff' : 'rgba(127,192,208,' + (0.35 + 0.55 * f) + ')'; rr(L.x + b[0] * L.cs + 2, L.y + b[1] * L.cs + 2, L.cs - 4, L.cs - 4, 6); g.fill(); }
        bar(W / 2 - 110, H - 14, 220, 5, (LIM - t) / LIM, LIM - t < 20 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + lights + '/' + GOAL, T.h2 + ' ' + Math.ceil(LIM - t), false);
        fim(st);
      }
    };
  }
});
