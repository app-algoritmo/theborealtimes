/* Os cacos do Sampo — recomponha o moinho que se partiu no mar. */
BTJogo.registrar({
  canvas: 'jogo-sampo',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os cacos do Sampo",
    "sub": "O Sampo se partiu em nove pedaços e um deles sumiu no mar. Toque numa peça ao lado do vazio para deslizá-la (ou use as setas) e recomponha a imagem antes que o tempo acabe.",
    "perdeu": "O Sampo se perdeu nas ondas",
    "v1": "O Sampo está inteiro!",
    "v2": "No Kalevala, o Sampo se parte no mar e os cacos trazem fartura à Finlândia. O quebra-cabeça é invenção do jogo.",
    "h1": "Peças",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The shards of the Sampo",
    "sub": "The Sampo broke into nine pieces and one of them is lost at sea. Tap a piece next to the gap to slide it (or use the arrows) and restore the picture before time runs out.",
    "perdeu": "The Sampo was lost in the waves",
    "v1": "The Sampo is whole!",
    "v2": "In the Kalevala, the Sampo breaks at sea and the shards bring plenty to Finland. The puzzle is made up for the game.",
    "h1": "Pieces",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Bitene av Sampo",
    "sub": "Sampo gikk i ni stykker, og ett av dem forsvant i havet. Trykk på en brikke ved siden av tomrommet for å skyve den (eller bruk piltastene) og sett sammen bildet før tiden er ute.",
    "perdeu": "Sampo gikk tapt i bølgene",
    "v1": "Sampo er hel!",
    "v2": "I Kalevala går Sampo i stykker på havet, og bitene gir Finland overflod. Puslespillet er diktet opp for spillet.",
    "h1": "Brikker",
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
    var LIM = 180, SC = 26;
    var tl = [], bl = 8, hist = [], mv = 0, tmr = LIM, ds = {};
    function lay() { var W = api.w, H = api.h, S = Math.min(W - 40, H * 0.72, 400); return { S: S, c: S / 3, x: (W - S) / 2, y: Math.max(70, (H - S) / 2 + 14) }; }
    function nb(i) { var r = Math.floor(i / 3), c = i % 3, o = []; if (r > 0) o.push(i - 3); if (r < 2) o.push(i + 3); if (c > 0) o.push(i - 1); if (c < 2) o.push(i + 1); return o; }
    function placed() { var n = 0; for (var i = 0; i < 9; i++) if (tl[i] === i + 1) n++; return n; }
    function slide(i) { if (st !== 'play') return false; if (nb(i).indexOf(bl) < 0) return false; tl[bl] = tl[i]; tl[i] = 0; bl = i; mv++; if (placed() === 8) st = 'win'; return true; }
    function setup() {
      tl = [1, 2, 3, 4, 5, 6, 7, 8, 0]; bl = 8; hist = []; mv = 0; tmr = LIM; var prev = -1;
      for (var k = 0; k < SC; k++) { var o = nb(bl).filter(function (q) { return q !== prev; }), q = o[Math.floor(Math.random() * o.length)]; hist.push(bl); tl[bl] = tl[q]; tl[q] = 0; prev = bl; bl = q; }
      if (placed() === 8) { setup(); return; }
      ds = {}; var L = lay(); for (var i = 0; i < 9; i++) if (tl[i]) ds[tl[i]] = { x: L.x + (i % 3) * L.c, y: L.y + Math.floor(i / 3) * L.c };
    }
    function reset() { setup(); st = 'play'; }
    function art(x, y, S) {
      var cx = x + S / 2, cy = y + S / 2, i, cols = ['#d94a3a', '#e8a23a', '#f0d24a', '#5ab26a', '#3a9ad9', '#6a5ad9', '#b05ad9', '#e0508a'];
      g.fillStyle = '#12303a'; g.fillRect(x, y, S, S);
      g.fillStyle = '#1d4a56'; g.beginPath(); g.arc(cx, cy, S * 0.48, 0, 6.29); g.fill();
      for (i = 0; i < 8; i++) { g.fillStyle = cols[i]; g.beginPath(); g.moveTo(cx, cy); g.arc(cx, cy, S * 0.4, i * 0.7854 - 0.3927, (i + 1) * 0.7854 - 0.3927); g.closePath(); g.fill(); }
      g.strokeStyle = '#ffd88a'; g.lineWidth = S * 0.025; g.beginPath(); g.arc(cx, cy, S * 0.4, 0, 6.29); g.stroke(); g.beginPath(); g.arc(cx, cy, S * 0.22, 0, 6.29); g.stroke();
      g.fillStyle = '#ffd88a'; g.beginPath(); g.arc(cx, cy, S * 0.09, 0, 6.29); g.fill();
      g.fillStyle = '#7a5a2a'; g.fillRect(x + S * 0.08, y + S * 0.9, S * 0.84, S * 0.06); g.fillRect(x + S * 0.04, y + S * 0.04, S * 0.06, S * 0.2); g.fillRect(x + S * 0.9, y + S * 0.76, S * 0.06, S * 0.2);
    }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, tl: tl.slice(), bl: bl, inPlace: placed(), tmr: tmr, hist: hist.slice(), c: L.c, x: L.x, y: L.y, mv: mv }; },
      down: function (x, y) { if (menu()) return; var L = lay(), c = Math.floor((x - L.x) / L.c), r = Math.floor((y - L.y) / L.c); if (c >= 0 && c < 3 && r >= 0 && r < 3) slide(r * 3 + c); },
      key: function (c, d) {
        if (!d) return; if (c === 'Space' || c === 'Enter') { menu(); return; }
        var r = Math.floor(bl / 3), cc = bl % 3, q = -1;
        if (c === 'ArrowLeft' || c === 'KeyA') { if (cc < 2) q = bl + 1; } else if (c === 'ArrowRight' || c === 'KeyD') { if (cc > 0) q = bl - 1; }
        else if (c === 'ArrowUp' || c === 'KeyW') { if (r < 2) q = bl + 3; } else if (c === 'ArrowDown' || c === 'KeyS') { if (r > 0) q = bl - 3; }
        if (q >= 0) slide(q);
      },
      update: function (dt) {
        var L = lay(), v, k = Math.min(1, dt * 14);
        for (var i = 0; i < 9; i++) { v = tl[i]; if (v) { var d = ds[v] || (ds[v] = { x: L.x, y: L.y }), tx = L.x + (i % 3) * L.c, ty = L.y + Math.floor(i / 3) * L.c; d.x += (tx - d.x) * k; d.y += (ty - d.y) * k; } }
        if (st !== 'play') return; tmr -= dt; if (tmr <= 0) st = 'lose';
      },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), i, v;
        bg('#0d2229', '#1a2f44');
        g.fillStyle = 'rgba(255,255,255,.07)'; rr(L.x - 10, L.y - 10, L.S + 20, L.S + 20, 14); g.fill();
        for (i = 0; i < 9; i++) {
          v = tl[i]; if (!v) continue; var d = ds[v] || { x: L.x, y: L.y }, sr = Math.floor((v - 1) / 3), sc = (v - 1) % 3;
          g.save(); g.beginPath(); g.rect(d.x + 2, d.y + 2, L.c - 4, L.c - 4); g.clip(); art(d.x - sc * L.c, d.y - sr * L.c, L.S); g.restore();
          g.strokeStyle = v === i + 1 ? '#ffd88a' : 'rgba(255,255,255,.35)'; g.lineWidth = v === i + 1 ? 3 : 1.5; g.strokeRect(d.x + 2, d.y + 2, L.c - 4, L.c - 4);
          txt(String(v), d.x + 14, d.y + 24, 15, 'rgba(255,255,255,.8)', 'left');
        }
        bar(W / 2 - 110, H - 22, 220, 6, tmr / LIM, tmr < 25 ? '#c0392b' : '#4aa3b8');
        hud(T.h1 + ' ' + placed() + '/8', T.h2 + ' ' + Math.max(0, Math.ceil(tmr)), false);
        fim(st);
      }
    };
  }
});
