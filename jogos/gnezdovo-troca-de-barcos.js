/* Gnezdovo — a troca de barcos (invenção). */
BTJogo.registrar({
  canvas: 'jogo-gnezdovo',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A troca de barcos",
    "sub": "Dois grupos de barcos se encontram num trecho estreito, com um só lugar vago. Troque os lados: os barcos azuis só vão para a direita e os laranja só para a esquerda. Toque num barco para movê-lo ao lugar vago, ao lado ou saltando por cima de um barco. Se ninguém mais puder andar, acabou. O tempo é limitado. São 3 trechos.",
    "perdeu": "Barcos presos",
    "v1": "Troca feita!",
    "v2": "Gnezdovo é um grande sítio varegue perto de Smolensk. Trocar barcos de lado é invenção.",
    "h1": "Trecho",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The swap of boats",
    "sub": "Two groups of boats meet on a narrow stretch, with a single free place. Swap the sides: the blue boats only go right and the orange ones only go left. Tap a boat to move it into the free place, next to it or jumping over one boat. If no one can move any more, it is over. Time is limited. There are 3 stretches.",
    "perdeu": "Boats stuck",
    "v1": "Swap done!",
    "v2": "Gnezdovo is a large Varangian site near Smolensk. Swapping boats from side to side is invented.",
    "h1": "Stretch",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Båtbyttet",
    "sub": "To grupper båter møtes på en smal strekning med bare én ledig plass. Bytt side: de blå båtene går bare mot høyre, og de oransje bare mot venstre. Trykk på en båt for å flytte den til den ledige plassen, ved siden av eller ved å hoppe over én båt. Hvis ingen kan flytte seg mer, er det slutt. Tiden er begrenset. Det er 3 strekninger.",
    "perdeu": "Båtene sitter fast",
    "v1": "Byttet er gjort!",
    "v2": "Gnezdovo er et stort varjagisk område nær Smolensk. Å bytte båter fra side til side er oppfunnet.",
    "h1": "Strekning",
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
    var NL = 3, lvl = 0, t = 0, pend = 0;
    function lvlUp() { lvl++; pend = 0.9; if (api.nota) api.nota(520, 0.2, 'triangle', 0.07); }
    function tick(dt, load) { if (st !== 'play') return; t += dt; if (pend > 0) { pend -= dt; if (pend <= 0) { if (lvl >= NL) st = 'win'; else load(lvl); } } if (st === 'play' && t >= LIM) st = 'lose'; }
    function foot() { bar(api.w / 2 - 110, api.h - 12, 220, 5, (LIM - t) / LIM, LIM - t < 60 ? '#c0392b' : '#ffd88a'); }
    function hh() { hud(T.h1 + ' ' + Math.min(lvl + 1, NL) + '/' + NL, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false); }
    function glay(R, C, top, bot) { var W = api.w, H = api.h, s = Math.min((W - 24) / C, (H - top - bot) / R, 96); return { s: s, x0: (W - s * C) / 2, y0: top + ((H - top - bot) - s * R) / 2 }; }
    function sh(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
    var NB = [2, 3, 4], LIM = 300, n = 2, cur = [];
    function target(i) {
      var c = cur[i]; if (!c) return -1; var d = c === 1 ? 1 : -1, a = i + d, b = i + 2 * d;
      if (a >= 0 && a < cur.length && cur[a] === 0) return a;
      if (b >= 0 && b < cur.length && cur[a] !== 0 && cur[b] === 0) return b;
      return -1;
    }
    function anyMove() { for (var i = 0; i < cur.length; i++) if (target(i) >= 0) return true; return false; }
    function done() { for (var i = 0; i < cur.length; i++) { var w = i < n ? 2 : i === n ? 0 : 1; if (cur[i] !== w) return false; } return true; }
    function load(i) { n = NB[i]; cur = []; var k; for (k = 0; k < n; k++) cur.push(1); cur.push(0); for (k = 0; k < n; k++) cur.push(2); }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function L() { var W = api.w, H = api.h, m = 2 * n + 1, s = Math.min((W - 24) / m, 84); return { s: s, x0: (W - s * m) / 2, y0: H / 2 - s * 0.5 + 10 }; }
    function pos() { var l = L(), a = [], i; for (i = 0; i < cur.length; i++) a.push({ x: l.x0 + (i + 0.5) * l.s, y: l.y0 + l.s / 2 }); return a; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lvl: lvl, pend: pend, cur: cur.slice(), n: n, pos: pos() }; },
      down: function (x, y) {
        if (menu()) return; if (pend > 0 || st !== 'play') return;
        var l = L(), i = Math.floor((x - l.x0) / l.s); if (i < 0 || i >= cur.length || y < l.y0 - 10 || y > l.y0 + l.s + 10) return;
        var tg = target(i); if (tg < 0) return;
        cur[tg] = cur[i]; cur[i] = 0; if (api.nota) api.nota(260 + tg * 20, 0.07, 'triangle', 0.05);
        if (done()) lvlUp(); else if (!anyMove()) st = 'lose';
      },
      move: function () {}, up: function () {},
      key: function (kk, d) { if (d && st !== 'play') menu(); },
      update: function (dt) { tick(dt, load); },
      draw: function () {
        var l = L(), s = l.s, i; bg('#1a2a1f', '#060c08');
        g.fillStyle = '#2a5a78'; g.fillRect(0, l.y0 - 6, api.w, s + 12);
        for (i = 0; i < cur.length; i++) {
          var x = l.x0 + i * s, y = l.y0; g.fillStyle = 'rgba(255,255,255,.1)'; rr(x + 3, y + 3, s - 6, s - 6, 8); g.fill();
          if (!cur[i]) continue; var dir = cur[i] === 1 ? 1 : -1, cx = x + s / 2, cy = y + s / 2;
          g.fillStyle = cur[i] === 1 ? '#6fb1d9' : '#e0a05a';
          g.beginPath(); g.moveTo(cx - dir * s * 0.34, cy - s * 0.1); g.lineTo(cx + dir * s * 0.22, cy - s * 0.1); g.lineTo(cx + dir * s * 0.4, cy - s * 0.26); g.lineTo(cx + dir * s * 0.3, cy + s * 0.22); g.lineTo(cx - dir * s * 0.26, cy + s * 0.22); g.closePath(); g.fill();
          g.strokeStyle = '#2a1d08'; g.lineWidth = 2; g.beginPath(); g.moveTo(cx, cy - s * 0.1); g.lineTo(cx, cy - s * 0.38); g.stroke();
          g.fillStyle = '#f3ecd2'; g.beginPath(); g.moveTo(cx, cy - s * 0.38); g.lineTo(cx + dir * s * 0.2, cy - s * 0.26); g.lineTo(cx, cy - s * 0.14); g.closePath(); g.fill();
        }
        foot(); hh(); fim(st);
      }
    };

  }
});
