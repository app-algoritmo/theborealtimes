/* Codex Regius — ponha as páginas numeradas em ordem (invenção). */
BTJogo.registrar({
  canvas: 'jogo-codex',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As páginas do Codex",
    "sub": "Toque numa página ao lado do espaço vazio para deslizá-la. Ponha as páginas de 1 a 8 em ordem, com o espaço vazio no canto de baixo à direita, em até 150 segundos. (Teclado: setas movem uma página para o espaço vazio.)",
    "perdeu": "O tempo acabou",
    "v1": "As páginas estão em ordem!",
    "v2": "O Codex Regius, de cerca de 1270, perdeu oito páginas antes de 1643. O quebra-cabeça de deslizar é invenção.",
    "h1": "Páginas no lugar",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The Codex pages",
    "sub": "Tap a page next to the empty space to slide it. Put the pages from 1 to 8 in order, with the empty space at the bottom-right corner, within 150 seconds. (Keyboard: arrows move a page into the empty space.)",
    "perdeu": "Time ran out",
    "v1": "The pages are in order!",
    "v2": "The Codex Regius, from about 1270, lost eight pages before 1643. The sliding puzzle is invented.",
    "h1": "Pages in place",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Kodeksens sider",
    "sub": "Trykk på en side ved siden av det tomme feltet for å skyve den. Sett sidene fra 1 til 8 i rekkefølge, med det tomme feltet i hjørnet nede til høyre, innen 150 sekunder. (Tastatur: piler flytter en side inn i det tomme feltet.)",
    "perdeu": "Tiden tok slutt",
    "v1": "Sidene er i rekkefølge!",
    "v2": "Codex Regius, fra omkring 1270, mistet åtte sider før 1643. Skyvepuslespillet er oppfunnet.",
    "h1": "Sider på plass",
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
    var LIM = 150;
    var gr = [], blank = 8, t = 0, lastMv = 0;
    function lay() { var W = api.w, H = api.h, cs = Math.max(60, Math.min((W - 30) / 3, (H - 130) / 3, 130)); return { cs: cs, x: (W - cs * 3) / 2, y: Math.max(72, (H - cs * 3) / 2 + 14) }; }
    function pos(i) { var L = lay(); return { x: L.x + (i % 3 + 0.5) * L.cs, y: L.y + (Math.floor(i / 3) + 0.5) * L.cs }; }
    function solved() { for (var i = 0; i < 8; i++) if (gr[i] !== i + 1) return false; return true; }
    function nbs(b) { var o = [], r = Math.floor(b / 3), c = b % 3; if (r > 0) o.push(b - 3); if (r < 2) o.push(b + 3); if (c > 0) o.push(b - 1); if (c < 2) o.push(b + 1); return o; }
    function reset() {
      do {
        gr = [1, 2, 3, 4, 5, 6, 7, 8, 0]; blank = 8; var last = -1;
        for (var k = 0; k < 70; k++) { var o = nbs(blank).filter(function (z) { return z !== last; }), z = o[Math.floor(Math.random() * o.length)]; gr[blank] = gr[z]; gr[z] = 0; last = blank; blank = z; }
      } while (solved());
      t = 0; lastMv = 0; st = 'play';
    }
    function slide(i) {
      if (st !== 'play' || i < 0 || i === blank) return; var r = Math.floor(i / 3), c = i % 3, br = Math.floor(blank / 3), bc = blank % 3, step;
      if (r === br) step = c < bc ? 1 : -1; else if (c === bc) step = r < br ? 3 : -3; else return;
      var cur = blank; while (cur !== i) { var nx = cur - step; gr[cur] = gr[nx]; cur = nx; } gr[i] = 0; blank = i; lastMv = 0.15; if (api.nota) api.nota(300, 0.06, 'triangle', 0.05);
      if (solved()) st = 'win';
    }
    function at(x, y) { var L = lay(); for (var i = 0; i < 9; i++) { var p = pos(i); if (Math.abs(x - p.x) < L.cs * 0.5 && Math.abs(y - p.y) < L.cs * 0.5) return i; } return -1; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, g: gr.slice(), blank: blank, t: t, pos: pos }; },
      down: function (x, y) { if (menu()) return; slide(at(x, y)); },
      move: function () {}, up: function () {},
      key: function (k, d) {
        if (!d) return; if (st !== 'play') { menu(); return; } var br = Math.floor(blank / 3), bc = blank % 3;
        if ((k === 'ArrowLeft' || k === 'KeyA') && bc < 2) slide(blank + 1); else if ((k === 'ArrowRight' || k === 'KeyD') && bc > 0) slide(blank - 1);
        else if ((k === 'ArrowUp' || k === 'KeyW') && br < 2) slide(blank + 3); else if ((k === 'ArrowDown' || k === 'KeyS') && br > 0) slide(blank - 3);
      },
      update: function (dt) { if (lastMv > 0) lastMv -= dt; if (st !== 'play') return; t += dt; if (t >= LIM) st = 'lose'; },
      draw: function () {
        var L = lay(), cs = L.cs, i, ok = 0;
        bg('#3a2a1e', '#150e09');
        g.fillStyle = 'rgba(0,0,0,.35)'; rr(L.x - 8, L.y - 8, cs * 3 + 16, cs * 3 + 16, 12); g.fill();
        for (i = 0; i < 9; i++) {
          var v = gr[i]; if (!v) continue; var p = pos(i), x = p.x - cs * 0.47, y = p.y - cs * 0.47, w = cs * 0.94, right = v === i + 1; if (right) ok++;
          g.fillStyle = right ? '#e6d3a0' : '#cdb98a'; rr(x, y, w, w, 8); g.fill(); g.strokeStyle = right ? '#6fb36f' : '#8a7448'; g.lineWidth = right ? 4 : 2; rr(x + 3, y + 3, w - 6, w - 6, 6); g.stroke();
          g.strokeStyle = 'rgba(90,60,30,.35)'; g.lineWidth = 2; for (var q = 0; q < 3; q++) { g.beginPath(); g.moveTo(x + w * 0.2, y + w * (0.2 + q * 0.07)); g.lineTo(x + w * 0.8, y + w * (0.2 + q * 0.07)); g.stroke(); }
          txt(String(v), p.x, p.y + cs * 0.22, cs * 0.5, '#3b2a14');
        }
        bar(api.w / 2 - 110, api.h - 14, 220, 5, (LIM - t) / LIM, LIM - t < 20 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + ok + '/8', T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };
  }
});
