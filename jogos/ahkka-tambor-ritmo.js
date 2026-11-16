/* As Áhkká, deusas sámi do parto — toque no ritmo do tambor (invenção). */
BTJogo.registrar({
  canvas: 'jogo-ahkka',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O tambor das Áhkká",
    "sub": "Anéis encolhem em direção ao centro do tambor. Toque em qualquer lugar (ou aperte Espaço) no instante em que o anel chega ao centro. Toques sem anel perto também contam como falha. Acerte 20 batidas com no máximo 3 falhas.",
    "perdeu": "Falhas demais no ritmo",
    "v1": "O ritmo está completo!",
    "v2": "Para os sámi, Máttaráhkká e as filhas Sáráhkká, Juoksáhkká e Uksáhkká cuidavam do parto. O tambor e o ritmo são invenção.",
    "h1": "Batidas",
    "h2": "Falhas"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The Áhkká's drum",
    "sub": "Rings shrink toward the centre of the drum. Tap anywhere (or press Space) at the instant the ring reaches the centre. Taps with no ring near also count as a miss. Hit 20 beats with at most 3 misses.",
    "perdeu": "Too many misses in the rhythm",
    "v1": "The rhythm is complete!",
    "v2": "For the Sámi, Máttaráhkká and her daughters Sáráhkká, Juoksáhkká and Uksáhkká looked after birth. The drum and the rhythm are invented.",
    "h1": "Beats",
    "h2": "Misses"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Áhkká-trommen",
    "sub": "Ringer krymper mot midten av trommen. Trykk hvor som helst (eller trykk mellomrom) i øyeblikket ringen når midten. Trykk uten ring i nærheten teller også som feil. Treff 20 slag med høyst 3 feil.",
    "perdeu": "For mange feil i rytmen",
    "v1": "Rytmen er fullført!",
    "v2": "For samene tok Máttaráhkká og døtrene Sáráhkká, Juoksáhkká og Uksáhkká seg av fødselen. Trommen og rytmen er oppfunnet.",
    "h1": "Slag",
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
    var NB = 20, MAXM = 3, WIN = 0.15, STRAY = 0.35, LEAD = 1.3;
    var beats = [], now = 0, hits = 0, misses = 0, fx = [];
    function lay() { var W = api.w, H = api.h, R = Math.max(34, Math.min(W, H) * 0.12); return { W: W, H: H, cx: W / 2, cy: H * 0.52, R: R }; }
    function reset() {
      beats = []; var tm = 2, iv = [0.9, 0.6, 0.9, 0.75]; for (var i = 0; i < NB; i++) { beats.push({ t: tm, j: 0 }); tm += iv[Math.floor(Math.random() * iv.length)]; }
      now = 0; hits = 0; misses = 0; fx = []; st = 'play';
    }
    function judge(b, ok) { if (ok) { b.j = 1; hits++; fx.push({ a: 0.35, ok: 1 }); if (api.nota) api.nota(260, 0.16, 'sine', 0.08); } else { b.j = 2; misses++; fx.push({ a: 0.35, ok: 0 }); if (api.nota) api.nota(110, 0.2, 'sawtooth', 0.05); } }
    function chk() { if (misses >= MAXM) { st = 'lose'; return; } if (beats.every(function (b) { return b.j; })) st = 'win'; }
    function tap() {
      if (st !== 'play') return; var best = null, bd = 1e9;
      beats.forEach(function (b) { if (!b.j) { var dd = Math.abs(now - b.t); if (dd < bd) { bd = dd; best = b; } } });
      if (best && bd <= STRAY) judge(best, bd <= WIN); else { misses++; fx.push({ a: 0.35, ok: 0 }); if (api.nota) api.nota(110, 0.2, 'sawtooth', 0.05); }
      chk();
    }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, now: now, beats: beats.map(function (b) { return { t: b.t, j: b.j }; }), hits: hits, misses: misses }; },
      down: function () { if (menu()) return; tap(); },
      move: function () {}, up: function () {},
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'Space' || k === 'Enter' || k === 'KeyF' || k === 'KeyJ') tap(); },
      update: function (dt) {
        fx.forEach(function (f) { f.a -= dt; }); fx = fx.filter(function (f) { return f.a > 0; });
        if (st !== 'play') return; now += dt;
        beats.forEach(function (b) { if (!b.j && now > b.t + WIN) judge(b, false); }); chk();
      },
      draw: function () {
        var L = lay(), i;
        bg('#2c2238', '#0e0a14');
        g.fillStyle = '#7a4a2a'; g.beginPath(); g.arc(L.cx, L.cy, L.R * 1.25, 0, 6.283); g.fill(); g.fillStyle = '#e0c9a0'; g.beginPath(); g.arc(L.cx, L.cy, L.R * 1.12, 0, 6.283); g.fill();
        g.strokeStyle = '#7a4a2a'; g.lineWidth = 3; g.beginPath(); g.arc(L.cx, L.cy, L.R, 0, 6.283); g.stroke();
        g.fillStyle = 'rgba(120,70,30,.35)'; g.beginPath(); g.arc(L.cx, L.cy, L.R * 0.2, 0, 6.283); g.fill();
        beats.forEach(function (b) {
          var dtm = b.t - now; if (b.j || dtm > LEAD || dtm < -0.2) return; var r = L.R * (1 + 2.4 * Math.max(0, dtm) / LEAD), near = Math.abs(dtm) <= WIN;
          g.strokeStyle = near ? '#6fd3a0' : '#ffd88a'; g.lineWidth = near ? 6 : 4; g.globalAlpha = 1 - Math.max(0, dtm) / LEAD * 0.6; g.beginPath(); g.arc(L.cx, L.cy, r, 0, 6.283); g.stroke(); g.globalAlpha = 1;
        });
        fx.forEach(function (f) { g.strokeStyle = f.ok ? '#6fd3a0' : '#ff7a6a'; g.lineWidth = 4; g.globalAlpha = f.a / 0.35; g.beginPath(); g.arc(L.cx, L.cy, L.R * (1 + (0.35 - f.a) * 2), 0, 6.283); g.stroke(); g.globalAlpha = 1; });
        hud(T.h1 + ' ' + hits + '/' + NB, T.h2 + ' ' + misses + '/' + MAXM, misses >= MAXM - 1);
        fim(st);
      }
    };
  }
});
