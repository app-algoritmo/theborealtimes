/* Kari Trestakk — o boi empurra as caixas até as marcas (invenção). */
BTJogo.registrar({
  canvas: 'jogo-karitrestakk',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O boi e as caixas",
    "sub": "O boi pardo empurra caixas até as marcas douradas do chão. Use as setas do teclado, ou toque ao lado do boi, na direção em que quer andar. Ele só empurra, nunca puxa, e uma caixa por vez; caixas não passam por paredes nem por outras caixas. O botão ↺ recomeça a fase. São 3 fases.",
    "perdeu": "O tempo acabou antes de as caixas chegarem às marcas",
    "v1": "Todas as caixas no lugar!",
    "v2": "Em Kari Trestakk, de Asbjørnsen e Moe, um boi pardo dá comida à menina e foge com ela da madrasta; nas florestas de cobre, prata e ouro ele luta contra um troll em cada uma, e a menina leva folhas e uma maçã de ouro. Empurrar caixas é invenção.",
    "h1": "Fase",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The bull and the crates",
    "sub": "The dun bull pushes crates onto the golden marks on the floor. Use the keyboard arrows, or tap beside the bull in the direction you want to walk. He only pushes, never pulls, and one crate at a time; crates do not pass through walls or other crates. The ↺ button restarts the level. There are 3 levels.",
    "perdeu": "The time ran out before the crates reached the marks",
    "v1": "Every crate in place!",
    "v2": "In Kari Trestakk, by Asbjørnsen and Moe, a dun bull gives the girl food and flees with her from the stepmother; in the copper, silver and golden woods he fights a troll in each, and the girl takes leaves and a golden apple. Pushing crates is invented.",
    "h1": "Level",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Oksen og kassene",
    "sub": "Den gråbrune oksen skyver kasser til de gylne merkene på gulvet. Bruk piltastene, eller trykk ved siden av oksen i retningen du vil gå. Han bare skyver, aldri drar, og én kasse om gangen; kasser går ikke gjennom vegger eller andre kasser. Knappen ↺ starter brettet på nytt. Det er 3 brett.",
    "perdeu": "Tiden tok slutt før kassene nådde merkene",
    "v1": "Alle kassene på plass!",
    "v2": "I Kari Trestakk av Asbjørnsen og Moe gir en gråbrun okse jenta mat og flykter med henne fra stemoren; i kobber-, sølv- og gullskogen kjemper han mot et troll i hver, og jenta tar med blader og et gulleple. Å skyve kasser er oppfunnet.",
    "h1": "Brett",
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
    var LV = [['#######', '#     #', '#. $@ #', '#     #', '#######'], ['########', '#.  #  #', '#  $   #', '# .$@  #', '#      #', '########'], ['#########', '#   #   #', '# . $ . #', '#  $@$  #', '# .     #', '#########']];
    var NL = 3, LIM = 420, DX = [0, 1, 0, -1], DY = [-1, 0, 1, 0];
    var lvl = 0, cols = 0, rows = 0, wall = [], tgt = [], boxes = [], pl = 0, moves = 0, t = 0, pend = 0, sol = [];
    function solve() {
      var key = function (p, b) { return p + ':' + b.slice().sort(function (x, y) { return x - y; }).join(','); }, start = { p: pl, b: boxes.slice(), prev: null, d: -1 };
      var seen = {}, q = [start], h = 0; seen[key(pl, boxes)] = 1;
      function goal(b) { for (var i = 0; i < b.length; i++) if (!tgt[b[i]]) return false; return true; }
      while (h < q.length) {
        var s = q[h++];
        if (goal(s.b)) { var out = []; while (s.prev) { out.unshift(s.d); s = s.prev; } return out; }
        for (var d = 0; d < 4; d++) {
          var x = s.p % cols + DX[d], y = ((s.p / cols) | 0) + DY[d], np = y * cols + x;
          if (wall[np]) continue; var nb = s.b, bi = s.b.indexOf(np);
          if (bi >= 0) { var n2 = (y + DY[d]) * cols + x + DX[d]; if (wall[n2] || s.b.indexOf(n2) >= 0) continue; nb = s.b.slice(); nb[bi] = n2; }
          var k = key(np, nb); if (seen[k]) continue; seen[k] = 1; q.push({ p: np, b: nb, prev: s, d: d });
        }
      }
      return [];
    }
    function load(i) {
      var l = LV[i], r, c; rows = l.length; cols = 0; for (r = 0; r < rows; r++) cols = Math.max(cols, l[r].length);
      wall = []; tgt = []; boxes = [];
      for (r = 0; r < rows; r++) for (c = 0; c < cols; c++) { var ch = l[r][c] || '#', ix = r * cols + c; wall[ix] = ch === '#'; tgt[ix] = ch === '.' || ch === '*' || ch === '+'; if (ch === '$' || ch === '*') boxes.push(ix); if (ch === '@' || ch === '+') pl = ix; }
      moves = 0; sol = solve();
    }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function mv(d) {
      if (st !== 'play' || pend > 0) return;
      var x = pl % cols + DX[d], y = ((pl / cols) | 0) + DY[d], np = y * cols + x; if (wall[np]) return;
      var bi = boxes.indexOf(np);
      if (bi >= 0) { var n2 = (y + DY[d]) * cols + x + DX[d]; if (wall[n2] || boxes.indexOf(n2) >= 0) return; boxes[bi] = n2; }
      pl = np; moves++; if (api.nota) api.nota(180 + (bi >= 0 ? 60 : 0), 0.05, 'square', 0.03);
      for (var i = 0; i < boxes.length; i++) if (!tgt[boxes[i]]) return;
      lvl++; pend = 0.8; if (api.nota) api.nota(520, 0.2, 'triangle', 0.07);
    }
    function lay() { var W = api.w, H = api.h, s = Math.min((W - 20) / cols, (H - 150) / rows, 58); return { s: s, x0: (W - s * cols) / 2, y0: 70 }; }
    function cc(ix) { var L = lay(); return { x: L.x0 + (ix % cols) * L.s + L.s / 2, y: L.y0 + ((ix / cols) | 0) * L.s + L.s / 2 }; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lvl: lvl, sol: sol.slice(), moves: moves, pend: pend, pl: cc(pl), t: t }; },
      down: function (x, y) {
        if (menu()) return;
        if (x < 90 && y > api.h - 60) { load(lvl); return; }
        var p = cc(pl), L = lay(), dx = x - p.x, dy = y - p.y; if (Math.abs(dx) < L.s / 2 && Math.abs(dy) < L.s / 2) return;
        if (Math.abs(dx) > Math.abs(dy)) mv(dx < 0 ? 3 : 1); else mv(dy < 0 ? 0 : 2);
      },
      move: function () {}, up: function () {},
      key: function (k, d) {
        if (!d) return; if (st !== 'play') { menu(); return; }
        var m = { ArrowUp: 0, KeyW: 0, ArrowRight: 1, KeyD: 1, ArrowDown: 2, KeyS: 2, ArrowLeft: 3, KeyA: 3 }[k]; if (m !== undefined) mv(m); else if (k === 'KeyR') load(lvl);
      },
      update: function (dt) {
        if (st !== 'play') return; t += dt;
        if (pend > 0) { pend -= dt; if (pend <= 0) { if (lvl >= NL) st = 'win'; else load(lvl); } }
        if (st === 'play' && t >= LIM) st = 'lose';
      },
      draw: function () {
        var L = lay(), i, r, c; bg('#1b2a22', '#08100c');
        for (r = 0; r < rows; r++) for (c = 0; c < cols; c++) {
          var ix = r * cols + c, x = L.x0 + c * L.s, y = L.y0 + r * L.s;
          if (wall[ix]) { g.fillStyle = '#3a4a42'; g.fillRect(x, y, L.s - 1, L.s - 1); g.strokeStyle = 'rgba(255,255,255,.15)'; g.strokeRect(x + 3, y + 3, L.s - 7, L.s - 7); }
          else { g.fillStyle = 'rgba(255,255,255,.06)'; g.fillRect(x, y, L.s - 1, L.s - 1); }
          if (tgt[ix]) { g.beginPath(); g.moveTo(x + L.s / 2, y + L.s * 0.25); g.lineTo(x + L.s * 0.75, y + L.s / 2); g.lineTo(x + L.s / 2, y + L.s * 0.75); g.lineTo(x + L.s * 0.25, y + L.s / 2); g.closePath(); g.strokeStyle = '#ffd88a'; g.lineWidth = 2.5; g.stroke(); }
        }
        for (i = 0; i < boxes.length; i++) { var p = cc(boxes[i]), on = tgt[boxes[i]]; g.fillStyle = on ? '#d8b04a' : '#a8743a'; rr(p.x - L.s * 0.38, p.y - L.s * 0.38, L.s * 0.76, L.s * 0.76, 6); g.fill(); g.strokeStyle = 'rgba(0,0,0,.4)'; g.lineWidth = 2; g.beginPath(); g.moveTo(p.x - L.s * 0.3, p.y - L.s * 0.3); g.lineTo(p.x + L.s * 0.3, p.y + L.s * 0.3); g.moveTo(p.x + L.s * 0.3, p.y - L.s * 0.3); g.lineTo(p.x - L.s * 0.3, p.y + L.s * 0.3); g.stroke(); }
        var q = cc(pl); g.fillStyle = '#7a6a58'; g.beginPath(); g.arc(q.x, q.y, L.s * 0.32, 0, 6.2832); g.fill();
        g.strokeStyle = '#e8e2cf'; g.lineWidth = 3; g.beginPath(); g.moveTo(q.x - L.s * 0.2, q.y - L.s * 0.22); g.quadraticCurveTo(q.x - L.s * 0.42, q.y - L.s * 0.4, q.x - L.s * 0.38, q.y - L.s * 0.52); g.moveTo(q.x + L.s * 0.2, q.y - L.s * 0.22); g.quadraticCurveTo(q.x + L.s * 0.42, q.y - L.s * 0.4, q.x + L.s * 0.38, q.y - L.s * 0.52); g.stroke();
        g.fillStyle = 'rgba(0,0,0,.35)'; rr(12, api.h - 58, 70, 34, 8); g.fill(); g.strokeStyle = 'rgba(255,216,138,.5)'; g.lineWidth = 1.5; rr(12, api.h - 58, 70, 34, 8); g.stroke(); txt('↺', 47, api.h - 34, 20, '#ffd88a');
        bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 60 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + Math.min(lvl + 1, NL) + '/' + NL, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };

  }
});
