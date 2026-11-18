/* Draugr — jogo de sementes (invenção), contra o morto-vivo do monte. */
BTJogo.registrar({
  canvas: 'jogo-draugr',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As sementes do monte",
    "sub": "Toque numa das suas covas, embaixo, para semear no sentido anti-horário. Se a última semente cair no seu depósito, à direita, você joga de novo. Se cair numa cova sua vazia, leva também o que houver na cova oposta. Acaba quando um lado esvazia. Vença o draugr com mais sementes no depósito.",
    "perdeu": "O draugr guardou mais sementes",
    "v1": "O monte ficou em silêncio!",
    "v2": "Na Grettis saga, Kárr, o Velho, é chamado de draugr e jaz num monte de cheiro horrível. O jogo de sementes é invenção.",
    "h1": "Depósito",
    "h2": "Rival"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The seeds of the mound",
    "sub": "Tap one of your pits, at the bottom, to sow counter-clockwise. If the last seed lands in your store, on the right, you play again. If it lands in an empty pit of yours, you also take whatever is in the opposite pit. It ends when one side runs empty. Beat the draugr with more seeds in your store.",
    "perdeu": "The draugr kept more seeds",
    "v1": "The mound fell silent!",
    "v2": "In Grettis saga, Kárr the Old is called a draugr and lies in a mound that reeks horribly. The seed game is invented.",
    "h1": "Store",
    "h2": "Rival"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Frøene i haugen",
    "sub": "Trykk på en av gropene dine, nederst, for å så mot klokka. Lander det siste frøet i lageret ditt, til høyre, spiller du igjen. Lander det i en tom grop hos deg, tar du også det som ligger i gropa rett overfor. Det er over når en side er tom. Slå draugen med flere frø i lageret.",
    "perdeu": "Draugen beholdt flest frø",
    "v1": "Haugen ble stille!",
    "v2": "I Grettis saga kalles Kárr den gamle en draug, og han ligger i en haug som stinker fælt. Frøspillet er oppfunnet.",
    "h1": "Lager",
    "h2": "Rival"
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
    var s = [], turn = 0, aiT = 0, last = -1, over = false;
    function init() { s = []; for (var i = 0; i < 14; i++) s.push(i === 6 || i === 13 ? 0 : 4); }
    function sow(a, i, who) {
      var b = a.slice(), seeds = b[i], j = i, own = who === 0 ? 6 : 13, opp = who === 0 ? 13 : 6, extra = false;
      b[i] = 0; while (seeds > 0) { j = (j + 1) % 14; if (j === opp) continue; b[j]++; seeds--; }
      if (j === own) extra = true;
      else if (((who === 0 && j >= 0 && j <= 5) || (who === 1 && j >= 7 && j <= 12)) && b[j] === 1 && b[12 - j] > 0) { b[own] += b[12 - j] + 1; b[j] = 0; b[12 - j] = 0; }
      var e0 = true, e1 = true, k; for (k = 0; k < 6; k++) { if (b[k]) e0 = false; if (b[7 + k]) e1 = false; }
      var fin = e0 || e1; if (fin) { for (k = 0; k < 6; k++) { b[6] += b[k]; b[k] = 0; b[13] += b[7 + k]; b[7 + k] = 0; } }
      return { b: b, extra: extra && !fin, fin: fin };
    }
    function legal(a, who) { var o = []; for (var k = 0; k < 6; k++) { var i = who === 0 ? k : 7 + k; if (a[i] > 0) o.push(i); } return o; }
    function reset() { init(); turn = 0; aiT = 0; last = -1; over = false; st = 'play'; }
    function play(i) {
      var r = sow(s, i, turn); s = r.b; last = i; if (api.nota) api.nota(240 + i * 12, 0.08, 'triangle', 0.05);
      if (r.fin) { st = s[6] > s[13] ? 'win' : 'lose'; return; }
      if (!r.extra) turn = 1 - turn; aiT = 0;
    }
    function aiPick() {
      var m = legal(s, 1), best = null, bv = -1e9;
      m.forEach(function (i) { var r = sow(s, i, 1), v = (r.b[13] - s[13]) * 2 + (r.extra ? 3 : 0) + Math.random() * 0.8; if (v > bv) { bv = v; best = i; } });
      return best;
    }
    function lay() { var W = api.w, H = api.h, bw = Math.min(W - 16, 560), r = Math.min(36, bw / 14), cw = (bw - 2 * r * 2.2) / 6, bh = Math.min(r * 5.4, H - 150); return { bw: bw, r: r, pr: Math.min(r * 0.9, cw * 0.44), x0: (W - bw) / 2, y0: 86 + Math.max(0, (H - 150 - r * 5.4) / 2), bh: r * 5.4 }; }
    function ppos(i) {
      var L = lay(), cw = (L.bw - 2 * L.r * 2.2) / 6, xs = L.x0 + L.r * 2.2;
      if (i === 6) return { x: L.x0 + L.bw - L.r * 1.1, y: L.y0 + L.bh / 2 };
      if (i === 13) return { x: L.x0 + L.r * 1.1, y: L.y0 + L.bh / 2 };
      if (i < 6) return { x: xs + (i + 0.5) * cw, y: L.y0 + L.bh * 0.73 };
      return { x: xs + (12 - i + 0.5) * cw, y: L.y0 + L.bh * 0.27 };
    }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { var ps = []; for (var i = 0; i < 14; i++) ps.push(ppos(i)); return { st: st, s: s.slice(), turn: turn, pos: ps }; },
      down: function (x, y) { if (menu()) return; if (st !== 'play' || turn !== 0) return; var L = lay(); for (var i = 0; i < 6; i++) { var p = ppos(i); if (s[i] > 0 && Math.abs(x - p.x) < L.pr + 6 && Math.abs(y - p.y) < L.pr + 6) { play(i); return; } } },
      move: function () {}, up: function () {},
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } var n = parseInt(k.replace('Digit', ''), 10); if (n >= 1 && n <= 6 && turn === 0 && s[n - 1] > 0) play(n - 1); },
      update: function (dt) { if (st !== 'play' || turn !== 1) return; aiT += dt; if (aiT > 0.8) { var i = aiPick(); if (i === null) { st = s[6] > s[13] ? 'win' : 'lose'; return; } play(i); } },
      draw: function () {
        var L = lay(), i; bg('#232019', '#0a0906');
        g.fillStyle = 'rgba(240,226,190,.1)'; rr(L.x0, L.y0, L.bw, L.bh, 14); g.fill();
        for (i = 0; i < 14; i++) {
          var p = ppos(i), st2 = i === 6 || i === 13, mine = i < 6;
          g.beginPath(); if (st2) { g.ellipse(p.x, p.y, L.r * 0.85, L.bh * 0.4, 0, 0, 6.2832); } else g.arc(p.x, p.y, L.pr, 0, 6.2832);
          g.fillStyle = i === last ? 'rgba(255,216,138,.28)' : 'rgba(0,0,0,.35)'; g.fill(); g.lineWidth = mine && turn === 0 && s[i] > 0 && st === 'play' ? 2.5 : 1.5; g.strokeStyle = mine && turn === 0 && s[i] > 0 && st === 'play' ? '#ffd88a' : 'rgba(240,226,190,.3)'; g.stroke();
          txt(String(s[i]), p.x, p.y + L.r * 0.3, L.pr * (st2 ? 1.1 : 0.95), st2 ? '#ffd88a' : (mine ? '#f3ecd2' : '#c9b3f2'));
        }
        hud(T.h1 + ' ' + s[6] + ' / ' + s[13], null, false);
        fim(st);
      }
    };

  }
});
