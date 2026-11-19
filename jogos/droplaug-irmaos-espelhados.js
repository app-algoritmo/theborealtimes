/* Droplaugarsona saga — os irmãos em espelho (invenção). */
BTJogo.registrar({
  canvas: 'jogo-droplaug',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os irmãos espelhados",
    "sub": "Dois irmãos andam ao mesmo tempo, cada um no seu campo. Toque na tela para mover: o irmão da esquerda vai para o lado que você tocou, e o da direita vai para o lado oposto quando o movimento é para a esquerda ou para a direita, e para o mesmo lado quando é para cima ou para baixo. Pedras bloqueiam o caminho. Leve cada irmão à sua estrela ao mesmo tempo. O número de movimentos e o tempo são limitados. São 3 campos. Você também pode usar as setas do teclado.",
    "perdeu": "Os movimentos ou o tempo acabaram",
    "v1": "Os dois chegaram juntos!",
    "v2": "Na Droplaugarsona saga, os irmãos Grímr e Helgi, filhos da viúva Droplaug, vivem perto do Lagarfljót, no leste da Islândia, por volta do ano 1000. Helgi morre e Grímr o vinga. Mover irmãos em espelho é invenção.",
    "h1": "Campo",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The mirrored brothers",
    "sub": "Two brothers walk at the same time, each in his own field. Tap the screen to move: the brother on the left goes the way you tapped, and the one on the right goes the opposite way when the move is left or right, and the same way when it is up or down. Rocks block the way. Bring each brother to his star at the same time. The number of moves and the time are limited. There are 3 fields. You can also use the keyboard arrows.",
    "perdeu": "The moves or the time ran out",
    "v1": "Both arrived together!",
    "v2": "In Droplaugarsona saga, the brothers Grímr and Helgi, sons of the widow Droplaug, live near Lagarfljót in eastern Iceland around the year 1000. Helgi is killed and Grímr avenges him. Moving brothers in mirror is invented.",
    "h1": "Field",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "De speilvendte brødrene",
    "sub": "To brødre går samtidig, hver på sitt jorde. Trykk på skjermen for å flytte: broren til venstre går den veien du trykket, og broren til høyre går motsatt vei når trekket er til venstre eller høyre, og samme vei når det er opp eller ned. Steiner sperrer veien. Før hver bror til sin stjerne samtidig. Antall trekk og tiden er begrenset. Det er 3 jorder. Du kan også bruke piltastene.",
    "perdeu": "Trekkene eller tiden tok slutt",
    "v1": "Begge kom frem samtidig!",
    "v2": "I Droplaugarsona saga bor brødrene Grímr og Helgi, sønner av enken Droplaug, ved Lagarfljót på Øst-Island omkring år 1000. Helgi blir drept, og Grímr hevner ham. Å flytte brødre i speil er oppfunnet.",
    "h1": "Jorde",
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
    var NS = [5, 5, 6], NL = 3, LIM = 300, DXY = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    var lvl = 0, n = 0, bl = [[], []], gl = [0, 0], pa = 0, pb = 0, sol = [], lim = 0, moves = 0, t = 0, pend = 0;
    function mirror(d) { return d === 1 ? 3 : d === 3 ? 1 : d; }
    function step(p, d, blk) { var x = p % n + DXY[d][0], y = ((p / n) | 0) + DXY[d][1]; if (x < 0 || y < 0 || x >= n || y >= n || blk[y * n + x]) return p; return y * n + x; }
    function bfs(a0, b0) {
      var seen = {}, q = [[a0, b0, []]]; seen[a0 * 100 + b0] = 1;
      while (q.length) {
        var c = q.shift(); if (c[0] === gl[0] && c[1] === gl[1]) return c[2];
        for (var d = 0; d < 4; d++) { var na = step(c[0], d, bl[0]), nb = step(c[1], mirror(d), bl[1]); if (seen[na * 100 + nb]) continue; seen[na * 100 + nb] = 1; q.push([na, nb, c[2].concat([d])]); }
      }
      return null;
    }
    function load(i) {
      n = NS[i];
      for (;;) {
        var s, k; bl = [[], []];
        for (s = 0; s < 2; s++) for (k = 0; k < n * n; k++) bl[s][k] = Math.random() < 0.27 ? 1 : 0;
        pa = (n - 1) * n; pb = n * n - 1; bl[0][pa] = 0; bl[1][pb] = 0;
        gl = [(Math.random() * n * 2) | 0, (Math.random() * n * 2) | 0]; if (gl[0] >= n * n || gl[1] >= n * n) continue;
        if (bl[0][gl[0]] || bl[1][gl[1]] || gl[0] === pa || gl[1] === pb) continue;
        var r = bfs(pa, pb); if (r && r.length >= 8 + i * 2 && r.length <= 20) { sol = r; break; }
      }
      lim = sol.length + 6; moves = 0;
    }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function lay() { var W = api.w, H = api.h, cs = Math.min((W - 44) / (2 * NS[2]), (H - 160) / NS[2], 56); return { cs: cs, x0: (W - 2 * n * cs - 24) / 2, y0: 78 }; }
    function dpos() { var L = lay(), cx = api.w / 2, cy = L.y0 + n * L.cs / 2; return [{ x: cx, y: cy - 70 }, { x: cx + 70, y: cy }, { x: cx, y: cy + 70 }, { x: cx - 70, y: cy }]; }
    function move(d) {
      if (st !== 'play' || pend > 0) return; pa = step(pa, d, bl[0]); pb = step(pb, mirror(d), bl[1]); moves++; if (api.nota) api.nota(250, 0.04, 'square', 0.03);
      if (pa === gl[0] && pb === gl[1]) { lvl++; pend = 0.9; if (api.nota) api.nota(520, 0.2, 'triangle', 0.07); } else if (moves >= lim) st = 'lose';
    }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lvl: lvl, sol: sol.slice(), moves: moves, lim: lim, dpos: dpos(), pend: pend, pa: pa, pb: pb }; },
      down: function (x, y) {
        if (menu()) return; var L = lay(), cx = api.w / 2, cy = L.y0 + n * L.cs / 2, dx = x - cx, dy = y - cy;
        move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0));
      },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') { menu(); return; } if (!d) return; var m = { ArrowUp: 0, ArrowRight: 1, ArrowDown: 2, ArrowLeft: 3 }[k]; if (m !== undefined) move(m); },
      update: function (dt) {
        if (st !== 'play') return; t += dt;
        if (pend > 0) { pend -= dt; if (pend <= 0) { if (lvl >= NL) st = 'win'; else load(lvl); } }
        if (st === 'play' && t >= LIM) st = 'lose';
      },
      draw: function () {
        var L = lay(), s, k; bg('#2a2230', '#0b0810');
        for (s = 0; s < 2; s++) {
          var gx = L.x0 + s * (n * L.cs + 24);
          for (k = 0; k < n * n; k++) {
            var x = gx + (k % n) * L.cs, y = L.y0 + ((k / n) | 0) * L.cs;
            g.fillStyle = bl[s][k] ? '#4a4452' : 'rgba(255,255,255,.07)'; rr(x + 2, y + 2, L.cs - 4, L.cs - 4, 6); g.fill();
            if (k === gl[s]) txt('★', x + L.cs / 2, y + L.cs / 2 + 1, L.cs * 0.55, '#ffd88a');
          }
          var p = s ? pb : pa; g.fillStyle = s ? '#ff9a6a' : '#8aa6ff'; g.beginPath(); g.arc(gx + (p % n) * L.cs + L.cs / 2, L.y0 + ((p / n) | 0) * L.cs + L.cs / 2, L.cs * 0.3, 0, 6.2832); g.fill();
        }
        txt(moves + '/' + lim, api.w / 2, L.y0 + n * L.cs + 28, 18, moves >= lim - 2 ? '#ff9a8d' : '#f3ecd2');
        bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 60 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + Math.min(lvl + 1, NL) + '/' + NL, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };

  }
});
