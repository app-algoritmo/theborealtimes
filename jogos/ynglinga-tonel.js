/* Os tonéis de Fróði — passe o hidromel até cada tonel ter uma só cor. */
BTJogo.registrar({
  canvas: 'jogo-ynglinga',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os tonéis de Fróði",
    "sub": "Toque num tonel e depois em outro para passar o hidromel de cima. Só se despeja em tonel vazio ou sobre a mesma cor, e se houver lugar. Deixe cada tonel com uma só cor, cheio. Há um limite de movimentos e de tempo.",
    "perdeu": "O salão ficou em desordem",
    "v1": "Cada tonel tem a sua cor!",
    "v2": "Na saga dos Ynglingar, o rei Fróði morre num tonel de hidromel. A mistura de cores do jogo é invenção.",
    "h1": "Tonéis",
    "h2": "Movimentos"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Fróði's vats",
    "sub": "Tap a vat and then another to pour the mead on top. You may only pour into an empty vat or onto the same colour, and only if there is room. Leave every vat full with a single colour. There is a limit on moves and time.",
    "perdeu": "The hall stayed in disorder",
    "v1": "Every vat has its colour!",
    "v2": "In the saga of the Ynglings, King Fróði dies in a vat of mead. The mix of colours in the game is made up.",
    "h1": "Vats",
    "h2": "Moves"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Fróðes tønner",
    "sub": "Trykk på en tønne og så på en annen for å helle over mjøden øverst. Du kan bare helle i en tom tønne eller oppå samme farge, og bare hvis det er plass. La hver tønne være full med én farge. Det er en grense for trekk og tid.",
    "perdeu": "Hallen ble liggende i uorden",
    "v1": "Hver tønne har sin farge!",
    "v2": "I Ynglingesagaen dør kong Fróði i en tønne med mjød. Fargeblandingen i spillet er diktet opp.",
    "h1": "Tønner",
    "h2": "Trekk"
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
    var NC = 4, CAP = 4, NT = 6, MAXM = 24, LIM = 200, COL = ['#e0a030', '#c0392b', '#4a90c0', '#5aa05a'];
    var tu = [], sel = -1, moves = 0, tmr = LIM, pop = 0;
    function lay() { var W = api.w, H = api.h, tw = Math.min(58, (W - 30) / NT - 8), cs = Math.min(tw * 0.85, (H - 160) / CAP), gap = 8; var tot = NT * tw + (NT - 1) * gap; return { tw: tw, cs: cs, gap: gap, x: (W - tot) / 2, y: Math.max(76, (H - CAP * cs) / 2 + 10) }; }
    function done(t) { return t.length === CAP && t.every(function (v) { return v === t[0]; }); }
    function nDone() { return tu.filter(done).length; }
    function solved() { return tu.every(function (t) { return t.length === 0 || done(t); }); }
    function setup() {
      var a = [], i, k; for (i = 0; i < NC; i++) for (k = 0; k < CAP; k++) a.push(i);
      do { for (i = a.length - 1; i > 0; i--) { k = Math.floor(Math.random() * (i + 1)); var s = a[i]; a[i] = a[k]; a[k] = s; } tu = []; for (i = 0; i < NT; i++) tu.push([]); for (i = 0; i < a.length; i++) tu[Math.floor(i / CAP)].push(a[i]); } while (nDone() > 0);
      sel = -1; moves = 0; tmr = LIM;
    }
    function reset() { setup(); st = 'play'; }
    function pour(f, t) {
      var A = tu[f], B = tu[t]; if (!A.length || f === t) return false; var c = A[A.length - 1];
      if (B.length && B[B.length - 1] !== c) return false; if (B.length >= CAP) return false;
      var n = 0; while (A.length && A[A.length - 1] === c && B.length < CAP) { B.push(A.pop()); n++; } moves++; if (api.nota) api.nota(300 + n * 60, 0.07, 'triangle', 0.05);
      if (solved()) st = 'win'; else if (moves >= MAXM) st = 'lose'; return true;
    }
    function pick(i) { if (st !== 'play') return; if (sel < 0) { if (tu[i].length) sel = i; } else { if (sel === i) sel = -1; else { if (!pour(sel, i) && tu[i].length) sel = i; else sel = -1; } } }
    var cur = 0;
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, tu: tu.map(function (t) { return t.slice(); }), sel: sel, moves: moves, cx: function (i) { return L.x + i * (L.tw + L.gap) + L.tw / 2; }, cy: L.y + L.cs * CAP / 2 }; },
      down: function (x, y) { if (menu()) return; var L = lay(), i = Math.floor((x - L.x + L.gap / 2) / (L.tw + L.gap)); if (i >= 0 && i < NT) { cur = i; pick(i); } },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'ArrowLeft' || k === 'KeyA') cur = (cur + NT - 1) % NT; else if (k === 'ArrowRight' || k === 'KeyD') cur = (cur + 1) % NT; else if (k === 'Space' || k === 'Enter' || k === 'ArrowDown') pick(cur); else if (/^Digit[1-6]$/.test(k)) pick(+k.slice(5) - 1); },
      update: function (dt) { pop += dt; if (st === 'play') { tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; } } },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), i, k;
        bg('#2a1d12', '#0d0804');
        for (i = 0; i < NT; i++) {
          var x = L.x + i * (L.tw + L.gap), y = L.y, h = CAP * L.cs, lift = sel === i ? -10 : 0;
          g.fillStyle = 'rgba(255,255,255,.07)'; rr(x, y + lift, L.tw, h + 8, 10); g.fill();
          for (k = 0; k < tu[i].length; k++) {
            var v = tu[i][k], cy = y + lift + h - (k + 1) * L.cs + 4, cx = x + L.tw / 2; g.fillStyle = COL[v]; rr(x + 3, cy + 1, L.tw - 6, L.cs - 2, 7); g.fill();
            g.fillStyle = 'rgba(0,0,0,.45)'; g.beginPath(); if (v === 0) g.arc(cx, cy + L.cs / 2, 5, 0, 6.283); else if (v === 1) g.rect(cx - 5, cy + L.cs / 2 - 5, 10, 10); else if (v === 2) { g.moveTo(cx, cy + L.cs / 2 - 6); g.lineTo(cx + 6, cy + L.cs / 2 + 5); g.lineTo(cx - 6, cy + L.cs / 2 + 5); g.closePath(); } else { g.moveTo(cx, cy + L.cs / 2 - 7); g.lineTo(cx + 6, cy + L.cs / 2); g.lineTo(cx, cy + L.cs / 2 + 7); g.lineTo(cx - 6, cy + L.cs / 2); g.closePath(); } g.fill();
          }
          g.strokeStyle = i === sel ? '#ffd88a' : (i === cur ? 'rgba(255,216,138,.5)' : 'rgba(255,255,255,.35)'); g.lineWidth = i === sel ? 3 : 2; rr(x, y + lift, L.tw, h + 8, 10); g.stroke();
          if (done(tu[i])) txt('✓', x + L.tw / 2, y + h + 32, 20, '#9bd49b');
        }
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 40 ? '#c0392b' : '#e0a030');
        hud(T.h1 + ' ' + nDone() + '/' + NC, T.h2 + ' ' + moves + '/' + MAXM, moves > MAXM - 12);
        fim(st);
      }
    };
  }
});
