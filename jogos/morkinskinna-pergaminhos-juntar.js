/* Morkinskinna — junte pergaminhos iguais até o 128 (invenção). */
BTJogo.registrar({
  canvas: 'jogo-morkinskinna',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os pergaminhos da Morkinskinna",
    "sub": "Deslize o dedo, ou use as setas, para empurrar todos os pergaminhos para um lado. Dois com o mesmo número se juntam num só, com a soma. Chegue ao pergaminho 128 antes que a mesa fique cheia, em até 300 segundos. (Teclado: setas.)",
    "perdeu": "A mesa encheu ou o tempo acabou",
    "v1": "O pergaminho 128 está pronto!",
    "v2": "Morkinskinna quer dizer \"pergaminho bolorento\": é uma saga de reis da Noruega escrita na Islândia por volta de 1220, com cerca de 270 estrofes de poesia. Os números são invenção.",
    "h1": "Maior",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The parchments of Morkinskinna",
    "sub": "Swipe, or use the arrow keys, to push all the parchments to one side. Two with the same number merge into one, with their sum. Reach parchment 128 before the table fills up, within 300 seconds. (Keyboard: arrows.)",
    "perdeu": "The table filled up or time ran out",
    "v1": "Parchment 128 is ready!",
    "v2": "Morkinskinna means \"mouldy parchment\": it is a kings' saga of Norway written in Iceland around 1220, with some 270 stanzas of skaldic verse. The numbers are invented.",
    "h1": "Largest",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Pergamentene i Morkinskinna",
    "sub": "Sveip, eller bruk piltastene, for å skyve alle pergamentene til én side. To med samme tall slås sammen til ett, med summen. Nå pergament 128 før bordet fylles, innen 300 sekunder. (Tastatur: piler.)",
    "perdeu": "Bordet ble fullt eller tiden tok slutt",
    "v1": "Pergament 128 er klart!",
    "v2": "Morkinskinna betyr «muggent pergament»: det er en kongesaga om Norge skrevet på Island omkring 1220, med rundt 270 strofer skaldekunst. Tallene er oppfunnet.",
    "h1": "Størst",
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
    var N = 4, GOAL = 128, LIM = 300;
    var b = [], t = 0, sx = null, mv = 0, appear = [];
    var COLS = { 2: '#d8c9a0', 4: '#e0b970', 8: '#e39a4d', 16: '#d9743d', 32: '#c0563f', 64: '#a8446a', 128: '#7b3f9e' };
    function spawn() { var e = []; for (var i = 0; i < 16; i++) if (!b[i]) e.push(i); if (!e.length) return; var z = e[Math.floor(Math.random() * e.length)]; b[z] = Math.random() < 0.9 ? 2 : 4; appear.push([z, 0.25]); }
    function reset() { b = []; for (var i = 0; i < 16; i++) b.push(0); appear = []; spawn(); spawn(); t = 0; mv = 0; st = 'play'; }
    function line(a) { var v = a.filter(function (x) { return x; }), o = [], i; for (i = 0; i < v.length; i++) { if (v[i] === v[i + 1]) { o.push(v[i] * 2); i++; } else o.push(v[i]); } while (o.length < 4) o.push(0); return o; }
    function apply(bb, dir) { var nb = bb.slice(), i, k, a; for (i = 0; i < 4; i++) { a = []; for (k = 0; k < 4; k++) a.push(dir === 0 ? bb[i * 4 + k] : dir === 1 ? bb[i * 4 + 3 - k] : dir === 2 ? bb[k * 4 + i] : bb[(3 - k) * 4 + i]); a = line(a); for (k = 0; k < 4; k++) { if (dir === 0) nb[i * 4 + k] = a[k]; else if (dir === 1) nb[i * 4 + 3 - k] = a[k]; else if (dir === 2) nb[k * 4 + i] = a[k]; else nb[(3 - k) * 4 + i] = a[k]; } } return nb; }
    function can() { for (var d = 0; d < 4; d++) if (apply(b, d).join() !== b.join()) return true; return false; }
    function slide(d) {
      if (st !== 'play') return; var nb = apply(b, d); if (nb.join() === b.join()) return;
      b = nb; mv++; if (api.nota) api.nota(240, 0.06, 'triangle', 0.04); spawn();
      if (Math.max.apply(null, b) >= GOAL) st = 'win'; else if (!can()) st = 'lose';
    }
    function lay() { var W = api.w, H = api.h, gs = Math.max(150, Math.min(W - 30, H - 110, 400)); return { gs: gs, cs: gs / 4, x0: (W - gs) / 2, y0: 70 + Math.max(0, (H - 110 - gs) / 2) }; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, b: b.slice(), t: t, mv: mv }; },
      down: function (x, y) { if (menu()) return; sx = { x: x, y: y }; },
      move: function () {},
      up: function (x, y) { if (!sx || x === undefined) { sx = null; return; } var dx = x - sx.x, dy = y - sx.y; sx = null; if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return; if (Math.abs(dx) > Math.abs(dy)) slide(dx < 0 ? 0 : 1); else slide(dy < 0 ? 2 : 3); },
      swipe: function (d) { slide(d); },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } var m = { ArrowLeft: 0, ArrowRight: 1, ArrowUp: 2, ArrowDown: 3 }[k]; if (m !== undefined) slide(m); },
      update: function (dt) { appear = appear.filter(function (p) { p[1] -= dt; return p[1] > 0; }); if (st !== 'play') return; t += dt; if (t >= LIM) st = 'lose'; },
      draw: function () {
        var L = lay(), i; bg('#2a2216', '#0f0b06');
        g.fillStyle = 'rgba(240,226,190,.1)'; rr(L.x0 - 6, L.y0 - 6, L.gs + 12, L.gs + 12, 10); g.fill();
        for (i = 0; i < 16; i++) {
          var x = L.x0 + (i % 4) * L.cs, y = L.y0 + Math.floor(i / 4) * L.cs, v = b[i];
          g.fillStyle = v ? (COLS[v] || '#7b3f9e') : 'rgba(0,0,0,.28)'; rr(x + 3, y + 3, L.cs - 6, L.cs - 6, 8); g.fill();
          if (v) txt(String(v), x + L.cs / 2, y + L.cs / 2 + L.cs * 0.12, L.cs * (v > 99 ? 0.3 : 0.38), v <= 4 ? '#3a2a10' : '#fff');
        }
        bar(api.w / 2 - 110, api.h - 14, 220, 5, (LIM - t) / LIM, LIM - t < 40 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + Math.max.apply(null, b) + '/' + GOAL, T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };

  }
});
