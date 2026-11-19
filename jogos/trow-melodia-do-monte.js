/* Trow — a melodia do monte (invenção). */
BTJogo.registrar({
  canvas: 'jogo-trow',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A melodia dos trows",
    "sub": "Quatro pedras acendem em uma ordem e tocam cada uma um som. Observe a sequência e repita-a tocando nas pedras na mesma ordem. Um toque errado faz você perder. O tempo é limitado. São 3 melodias, cada uma mais longa que a anterior.",
    "perdeu": "Pedra errada ou o tempo acabou",
    "v1": "Melodia repetida!",
    "v2": "Os trows são espíritos de Orkney e Shetland que vivem em montes, saem à noite e, diz o folclore, gostam de música de violino e levam violinistas. Repetir sequências de sons é invenção.",
    "h1": "Melodia",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The melody of the trows",
    "sub": "Four stones light up in an order, each playing a sound. Watch the sequence and repeat it by tapping the stones in the same order. A wrong tap makes you lose. Time is limited. There are 3 melodies, each longer than the last.",
    "perdeu": "Wrong stone or time ran out",
    "v1": "Melody repeated!",
    "v2": "Trows are spirits of Orkney and Shetland that live in mounds and come out at night and, folklore says, love fiddle music and take fiddlers. Repeating sequences of sounds is invented.",
    "h1": "Melody",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Trollenes melodi",
    "sub": "Fire steiner lyser opp i en rekkefølge, og hver spiller en lyd. Se på rekkefølgen og gjenta den ved å trykke på steinene i samme rekkefølge. Et feil trykk gjør at du taper. Tiden er begrenset. Det er 3 melodier, hver lengre enn den forrige.",
    "perdeu": "Feil stein, eller tiden tok slutt",
    "v1": "Melodien er gjentatt!",
    "v2": "Trow er ånder på Orknøy og Shetland som bor i hauger og kommer ut om natten og, ifølge folketroen, elsker felemusikk og tar med seg felespillere. Å gjenta rekker av lyder er oppfunnet.",
    "h1": "Melodi",
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
    var SL = [4, 6, 8], LIM = 180;
    var COL = ['#e85a5a', '#5ab0e8', '#7ed06a', '#f0c850'], TON = [262, 330, 392, 523];
    var seq = [], idx = 0, phase = 'show', showI = 0, showT = 0.8, lit = -1, litT = 0;
    function load(i) { var k; seq = []; for (k = 0; k < SL[i]; k++) seq.push(Math.floor(Math.random() * 4)); idx = 0; phase = 'show'; showI = 0; showT = 0.8; lit = -1; litT = 0; }
    function reset() { lvl = 0; t = 0; pend = 0; load(0); st = 'play'; }
    function L() { return glay(2, 2, 70, 40); }
    function pos() { var l = L(), a = [], i; for (i = 0; i < 4; i++) a.push({ x: l.x0 + (i % 2 + 0.5) * l.s, y: l.y0 + (Math.floor(i / 2) + 0.5) * l.s }); return a; }
    function ping(p) { lit = p; litT = 0.3; if (api.nota) api.nota(TON[p], 0.25, 'triangle', 0.06); }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, lvl: lvl, pend: Math.max(pend, phase === 'show' ? 1 : 0), seq: seq.slice(), idx: idx, pos: pos() }; },
      down: function (x, y) {
        if (menu()) return; if (pend > 0 || st !== 'play' || phase !== 'in') return;
        var l = L(), c = Math.floor((x - l.x0) / l.s), r = Math.floor((y - l.y0) / l.s); if (c < 0 || r < 0 || c >= 2 || r >= 2) return;
        var p = r * 2 + c; ping(p);
        if (p === seq[idx]) { idx++; if (idx >= seq.length) lvlUp(); } else st = 'lose';
      },
      move: function () {}, up: function () {},
      key: function (k, d) { if (d && st !== 'play') menu(); },
      update: function (dt) {
        if (litT > 0) { litT -= dt; if (litT <= 0) lit = -1; }
        if (phase === 'show' && st === 'play' && pend <= 0) {
          showT -= dt;
          if (showT <= 0) { if (showI < seq.length) { ping(seq[showI]); showI++; showT = 0.7; } else phase = 'in'; }
        }
        tick(dt, load);
      },
      draw: function () {
        var l = L(), s = l.s, i; bg('#221a2c', '#07040b');
        for (i = 0; i < 4; i++) {
          var x = l.x0 + (i % 2) * s, y = l.y0 + Math.floor(i / 2) * s;
          g.globalAlpha = lit === i ? 1 : 0.35; g.fillStyle = COL[i]; rr(x + 5, y + 5, s - 10, s - 10, 14); g.fill(); g.globalAlpha = 1;
        }
        foot(); hh(); fim(st);
      }
    };

  }
});
