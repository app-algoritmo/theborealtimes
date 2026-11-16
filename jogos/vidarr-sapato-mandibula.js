/* Víðarr, o deus silencioso — pare o marcador na faixa certa para empurrar a mandíbula de Fenrir (invenção). */
BTJogo.registrar({
  canvas: 'jogo-vidarr',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O sapato de Víðarr",
    "sub": "Toque (ou aperte Espaço) para parar o marcador dentro da faixa dourada. Cinco paradas certas empurram a mandíbula de Fenrir. Três paradas erradas, ou três vezes em que o marcador passar sete segundos sem ser parado, e o lobo escapa. A faixa fica mais estreita e o marcador mais rápido a cada acerto.",
    "perdeu": "Fenrir escapou",
    "v1": "A mandíbula cedeu!",
    "v2": "No Ragnarök, Víðarr pisa a mandíbula de Fenrir com um sapato feito de sobras de couro. O marcador é invenção.",
    "h1": "Acertos",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Víðarr's shoe",
    "sub": "Tap (or press Space) to stop the marker inside the golden band. Five right stops push Fenrir's jaw. Three wrong stops, or three times the marker runs seven seconds without being stopped, and the wolf escapes. The band narrows and the marker speeds up with every hit.",
    "perdeu": "Fenrir escaped",
    "v1": "The jaw gave way!",
    "v2": "At Ragnarök, Víðarr steps on the jaw of Fenrir with a shoe made from scraps of leather. The marker is invented.",
    "h1": "Hits",
    "h2": "Misses"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Víðars sko",
    "sub": "Trykk (eller trykk mellomrom) for å stoppe markøren innenfor det gylne feltet. Fem riktige stopp presser Fenrirs kjeve ned. Tre feil stopp, eller tre ganger markøren går sju sekunder uten å bli stoppet, og ulven slipper unna. Feltet blir smalere og markøren raskere for hvert treff.",
    "perdeu": "Fenrir slapp unna",
    "v1": "Kjeven ga etter!",
    "v2": "Under Ragnarok trår Víðarr på kjeven til Fenrir med en sko laget av skinnrester. Markøren er oppfunnet.",
    "h1": "Treff",
    "h2": "Feil"
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
    var NEED = 5, MAXM = 3, TOUT = 7;
    var m = 0, dir = 1, zc = 0.5, zw = 0.18, hits = 0, miss = 0, frz = 0, last = '', rt = 0;
    function newZone() { zw = 0.18 - hits * 0.02; zc = zw / 2 + 0.05 + Math.random() * (0.9 - zw); rt = 0; }
    function reset() { m = 0.05; dir = 1; hits = 0; miss = 0; frz = 0; last = ''; newZone(); st = 'play'; }
    function stop() {
      if (st !== 'play' || frz > 0) return;
      if (Math.abs(m - zc) <= zw / 2) { hits++; last = 'ok'; if (api.nota) api.nota(520 + hits * 80, 0.18, 'triangle', 0.06); } else { miss++; last = 'no'; if (api.nota) api.nota(140, 0.25, 'sawtooth', 0.06); }
      frz = 0.7;
    }
    function lay() { var W = api.w, H = api.h, s = Math.max(0.8, Math.min(1.4, Math.min(W, H) / 450)); return { W: W, H: H, s: s, bx: 30, bw: W - 60, by: H * 0.62, bh: 40 * s }; }
    return {
      pausar: function () {},
      dbg: function () { return { st: st, m: m, zc: zc, zw: zw, hits: hits, miss: miss, frz: frz, need: NEED }; },
      down: function (x, y) { if (menu()) return; stop(); },
      move: function () {}, up: function () {},
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'Space' || k === 'Enter' || k === 'ArrowDown') stop(); },
      update: function (dt) {
        if (st !== 'play') return;
        if (frz > 0) { frz -= dt; if (frz <= 0) { if (hits >= NEED) { st = 'win'; return; } if (miss >= MAXM) { st = 'lose'; return; } newZone(); } return; }
        m += dir * dt * (0.75 + hits * 0.16); if (m > 1) { m = 1; dir = -1; } if (m < 0) { m = 0; dir = 1; }
        rt += dt; if (rt >= TOUT) { miss++; last = 'no'; frz = 0.7; }
      },
      draw: function () {
        var L = lay(), W = L.W, H = L.H, s = L.s, i;
        bg('#1b1530', '#07050f');
        var ox = W / 2, oy = H * 0.34, op = hits / NEED * 0.5;
        g.fillStyle = '#6a6070'; g.beginPath(); g.moveTo(ox - 90 * s, oy); g.lineTo(ox + 90 * s, oy - 24 * s); g.lineTo(ox + 90 * s, oy - 4 * s); g.lineTo(ox - 90 * s, oy + 14 * s); g.closePath(); g.fill();
        g.save(); g.translate(ox - 90 * s, oy + 16 * s); g.rotate(op); g.fillStyle = '#8a8090'; g.beginPath(); g.moveTo(0, 0); g.lineTo(180 * s, -10 * s); g.lineTo(180 * s, 14 * s); g.lineTo(0, 22 * s); g.closePath(); g.fill(); g.restore();
        g.fillStyle = '#e8d8a8'; for (i = 0; i < 6; i++) { g.beginPath(); g.moveTo(ox - 70 * s + i * 28 * s, oy + 2 * s); g.lineTo(ox - 62 * s + i * 28 * s, oy + 16 * s); g.lineTo(ox - 78 * s + i * 28 * s, oy + 16 * s); g.fill(); }
        g.fillStyle = '#7a4a24'; rr(ox - 30 * s, oy - 54 * s - op * 30 * s, 60 * s, 34 * s, 8 * s); g.fill();
        g.fillStyle = 'rgba(0,0,0,.35)'; rr(L.bx, L.by, L.bw, L.bh, 10 * s); g.fill();
        g.fillStyle = frz > 0 && last === 'ok' ? '#6fd3a0' : '#ffd88a'; g.fillRect(L.bx + (zc - zw / 2) * L.bw, L.by, zw * L.bw, L.bh);
        g.fillStyle = frz > 0 && last === 'no' ? '#ff6a58' : '#fff'; g.fillRect(L.bx + m * L.bw - 3, L.by - 8 * s, 6, L.bh + 16 * s);
        for (i = 0; i < NEED; i++) { g.fillStyle = i < hits ? '#6fd3a0' : 'rgba(255,255,255,.2)'; g.beginPath(); g.arc(W / 2 + (i - 2) * 26, L.by + L.bh + 34 * s, 8, 0, 6.283); g.fill(); }
        bar(W / 2 - 110, H - 14, 220, 5, 1 - rt / TOUT, TOUT - rt < 2 ? '#c0392b' : '#c9b3f2');
        hud(T.h1 + ' ' + hits + '/' + NEED, T.h2 + ' ' + miss + '/' + MAXM, miss >= MAXM - 1);
        fim(st);
      }
    };
  }
});
