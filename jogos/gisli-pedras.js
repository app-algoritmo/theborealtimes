/* O esconderijo de Gísli — empurre as pedras até as marcas no chão. */
BTJogo.registrar({
  canvas: 'jogo-gisli',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O esconderijo de Gísli",
    "sub": "Gísli, fora da lei, fecha o esconderijo com pedras. Empurre cada pedra até uma marca no chão. Só dá para empurrar, nunca puxar. Setas, WASD ou toque ao lado do herói para andar; R recomeça a fase. São três fases e o tempo é limitado.",
    "perdeu": "Os perseguidores chegaram antes",
    "v1": "O esconderijo está fechado!",
    "v2": "Na Saga de Gísli, o herói vive anos como fora da lei na Islândia. As pedras e as fases do jogo são invenção.",
    "h1": "Fases",
    "h2": "Tempo",
    "dica": "R recomeça a fase"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Gísli's hideout",
    "sub": "Gísli, an outlaw, closes his hideout with stones. Push each stone onto a mark on the floor. You can only push, never pull. Arrows, WASD or a tap beside the hero to walk; R restarts the level. Three levels, and limited time.",
    "perdeu": "The pursuers arrived first",
    "v1": "The hideout is closed!",
    "v2": "In Gísli's Saga, the hero lives for years as an outlaw in Iceland. The stones and the levels are made up for the game.",
    "h1": "Levels",
    "h2": "Time",
    "dica": "R restarts the level"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Gislis skjulested",
    "sub": "Gisli, fredløs, stenger skjulestedet med steiner. Skyv hver stein på en markering i gulvet. Du kan bare skyve, aldri trekke. Piler, WASD eller et trykk ved siden av helten for å gå; R starter nivået på nytt. Tre nivåer, og begrenset tid.",
    "perdeu": "Forfølgerne kom først",
    "v1": "Skjulestedet er stengt!",
    "v2": "I Gisle Surssons saga lever helten i årevis som fredløs på Island. Steinene og nivåene er diktet opp for spillet.",
    "h1": "Nivåer",
    "h2": "Tid",
    "dica": "R starter nivået på nytt"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "El escondite de Gísli",
    "sub": "Gísli, proscrito, cierra el escondite con piedras. Empuja cada piedra hasta una marca del suelo. Solo se puede empujar, nunca tirar. Flechas, WASD o toque junto al héroe para andar; R reinicia el nivel. Son tres niveles y el tiempo es limitado.",
    "perdeu": "Los perseguidores llegaron antes",
    "v1": "¡El escondite está cerrado!",
    "v2": "En la saga de Gísli, el héroe vive años como proscrito en Islandia. Las piedras y los niveles del juego son invención.",
    "h1": "Niveles",
    "h2": "Tiempo",
    "dica": "R reinicia el nivel"
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
    var LV = [
      ['######', '#    #', '# #@ #', '# $* #', '# .* #', '#    #', '######'],
      [' ####', ' # .#', ' #  ###', ' #*@  #', ' #  $ #', ' #  ###', ' ####'],
      ['#######', '#.    #', '#$.$@##', '#  $# #', '# .   #', '#######']], LIM = 240;
    var lv = 0, wall = [], goal = [], box = [], px = 0, py = 0, W0 = 0, H0 = 0, tmr = LIM, moves = 0, fl = 0;
    function load(i) {
      var rows = LV[i]; H0 = rows.length; W0 = 0; rows.forEach(function (r) { W0 = Math.max(W0, r.length); }); wall = []; goal = []; box = [];
      for (var y = 0; y < H0; y++) for (var x = 0; x < W0; x++) { var ch = rows[y][x] || ' '; var k = y * W0 + x; wall[k] = ch === '#'; goal[k] = ch === '.' || ch === '*' || ch === '+'; box[k] = ch === '$' || ch === '*'; if (ch === '@' || ch === '+') { px = x; py = y; } }
      moves = 0;
    }
    function setup() { lv = 0; tmr = LIM; fl = 0; load(0); }
    function reset() { setup(); st = 'play'; }
    function lay() { var c = Math.min((api.w - 24) / W0, (api.h - 130) / H0, 58); return { c: c, x: (api.w - c * W0) / 2, y: Math.max(70, (api.h - c * H0) / 2 + 10) }; }
    function solved() { for (var k = 0; k < W0 * H0; k++) if (goal[k] && !box[k]) return false; return true; }
    function go(dx, dy) {
      if (st !== 'play') return; var nx = px + dx, ny = py + dy; if (nx < 0 || ny < 0 || nx >= W0 || ny >= H0) return; var n = ny * W0 + nx; if (wall[n]) return;
      if (box[n]) { var bx = nx + dx, by = ny + dy; if (bx < 0 || by < 0 || bx >= W0 || by >= H0) return; var b = by * W0 + bx; if (wall[b] || box[b]) return; box[n] = false; box[b] = true; if (api.nota) api.nota(180, 0.06, 'square', 0.04); }
      px = nx; py = ny; moves++;
      if (solved()) { lv++; if (api.nota) api.nota(660, 0.15, 'triangle', 0.06); if (lv >= LV.length) st = 'win'; else load(lv); }
    }
    setup();
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lv: lv, levels: LV, px: px, py: py, tmr: tmr, moves: moves }; },
      down: function (x, y) { if (menu()) return; var L = lay(), dx = x - (L.x + (px + 0.5) * L.c), dy = y - (L.y + (py + 0.5) * L.c); if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return; if (Math.abs(dx) > Math.abs(dy)) go(dx > 0 ? 1 : -1, 0); else go(0, dy > 0 ? 1 : -1); },
      key: function (c, d) {
        if (!d) return; if (c === 'ArrowLeft' || c === 'KeyA') go(-1, 0); else if (c === 'ArrowRight' || c === 'KeyD') go(1, 0); else if (c === 'ArrowUp' || c === 'KeyW') go(0, -1); else if (c === 'ArrowDown' || c === 'KeyS') go(0, 1);
        else if (c === 'KeyR') { if (st === 'play') load(lv); } else if ((c === 'Space' || c === 'Enter') && st !== 'play') menu();
      },
      update: function (dt) { if (st !== 'play') return; tmr -= dt; if (tmr <= 0) st = 'lose'; },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), x, y;
        bg('#2a2620', '#100e0b');
        for (y = 0; y < H0; y++) for (x = 0; x < W0; x++) {
          var k = y * W0 + x, X = L.x + x * L.c, Y = L.y + y * L.c;
          if (wall[k]) { g.fillStyle = '#5a4a3a'; g.fillRect(X, Y, L.c, L.c); g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(X + 3, Y + 3, L.c - 6, 5); g.strokeStyle = 'rgba(0,0,0,.4)'; g.strokeRect(X, Y, L.c, L.c); continue; }
          var row = LV[lv][y]; if ((row[x] || ' ') === ' ' && !goal[k] && !box[k] && !(x === px && y === py)) { var inside = false; for (var xx = 0; xx < x; xx++) if (LV[lv][y][xx] === '#') inside = true; var any = false; for (xx = x + 1; xx < W0; xx++) if (LV[lv][y][xx] === '#') any = true; if (!(inside && any)) continue; }
          g.fillStyle = '#3a3226'; g.fillRect(X, Y, L.c, L.c); g.strokeStyle = 'rgba(255,255,255,.05)'; g.strokeRect(X, Y, L.c, L.c);
          if (goal[k]) { g.strokeStyle = '#ffd88a'; g.lineWidth = 3; g.beginPath(); g.arc(X + L.c / 2, Y + L.c / 2, L.c * 0.2, 0, 6.29); g.stroke(); }
        }
        for (y = 0; y < H0; y++) for (x = 0; x < W0; x++) if (box[y * W0 + x]) { var X2 = L.x + x * L.c, Y2 = L.y + y * L.c, on = goal[y * W0 + x]; g.fillStyle = on ? '#9aa86a' : '#8a8a98'; rr(X2 + 4, Y2 + 4, L.c - 8, L.c - 8, 8); g.fill(); g.strokeStyle = 'rgba(0,0,0,.45)'; g.lineWidth = 2; g.stroke(); g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(X2 + 9, Y2 + 9, L.c * 0.3, 5); }
        var HX = L.x + (px + 0.5) * L.c, HY = L.y + (py + 0.5) * L.c; g.fillStyle = '#c9a23a'; g.beginPath(); g.arc(HX, HY, L.c * 0.32, 0, 6.29); g.fill(); g.fillStyle = '#8a6a2a'; g.beginPath(); g.arc(HX, HY - 2, L.c * 0.32, 3.14, 6.29); g.fill(); g.fillStyle = '#222'; g.fillRect(HX - 5, HY, 3, 4); g.fillRect(HX + 3, HY, 3, 4);
        txt(T.dica, W / 2, L.y + L.c * H0 + 30, 14, 'rgba(255,255,255,.5)');
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 40 ? '#c0392b' : '#c9a23a');
        hud(T.h1 + ' ' + lv + '/' + LV.length, T.h2 + ' ' + Math.max(0, Math.ceil(tmr)), false);
        fim(st);
      }
    };
  }
});
