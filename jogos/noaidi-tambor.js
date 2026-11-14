/* O tambor do noaidi — ouça o ritmo e repita no mesmo compasso. */
BTJogo.registrar({
  canvas: 'jogo-noaidi',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O tambor do noaidi",
    "sub": "O noaidi toca um ritmo no tambor. Ouça com atenção e repita tocando na tela (ou na barra de espaço) no mesmo compasso, com batidas curtas e longas. Acerte cinco ritmos, com no máximo dois erros.",
    "perdeu": "O ritmo se perdeu",
    "v1": "O tambor responde!",
    "v2": "Os noaidi, xamãs do povo sámi, usavam tambores de pele decorados. Os ritmos do jogo são invenção.",
    "h1": "Ritmos",
    "h2": "Erros",
    "ouve": "Ouça o ritmo",
    "repete": "Agora você"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The noaidi's drum",
    "sub": "The noaidi plays a rhythm on the drum. Listen closely and repeat it by tapping the screen (or Space) in the same tempo, with short and long beats. Get five rhythms right, with at most two mistakes.",
    "perdeu": "The rhythm was lost",
    "v1": "The drum answers!",
    "v2": "The noaidi, shamans of the Sámi people, used decorated skin drums. The rhythms in the game are made up.",
    "h1": "Rhythms",
    "h2": "Mistakes",
    "ouve": "Listen to the rhythm",
    "repete": "Now you"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Noaidiens tromme",
    "sub": "Noaiden slår en rytme på trommen. Hør godt etter og gjenta den ved å trykke på skjermen (eller mellomromstasten) i samme takt, med korte og lange slag. Få fem rytmer riktig, med høyst to feil.",
    "perdeu": "Rytmen gikk tapt",
    "v1": "Trommen svarer!",
    "v2": "Noaidiene, sjamanene til samene, brukte dekorerte skinntrommer. Rytmene i spillet er diktet opp.",
    "h1": "Rytmer",
    "h2": "Feil",
    "ouve": "Hør rytmen",
    "repete": "Nå du"
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
    var NEED = 5, MAXE = 2, LENS = [3, 4, 4, 5, 5];
    var hits = 0, errs = 0, ph = 'ready', tt = 0, pt = 0, iv = [], tb = [], played = 0, taps = [], flash = 0, lastOk = true;
    function newPat() {
      var len = LENS[Math.min(hits, 4)], k, c = [0.4, 0.8]; iv = []; for (k = 0; k < len - 1; k++) iv.push(c[Math.random() < 0.5 ? 0 : 1]); if (iv.indexOf(0.4) < 0) iv[0] = 0.4; if (iv.indexOf(0.8) < 0) iv[iv.length - 1] = 0.8;
      tb = [0]; for (k = 0; k < iv.length; k++) tb.push(tb[k] + iv[k]); played = 0; taps = []; ph = 'ready'; pt = 0;
    }
    function setup() { hits = 0; errs = 0; flash = 0; newPat(); }
    function reset() { setup(); st = 'play'; }
    function beep(f) { if (api.nota) api.nota(f, 0.18, 'triangle', 0.12); }
    function fail() { errs++; lastOk = false; ph = 'res'; pt = 0; }
    function tap() {
      if (st !== 'play' || ph !== 'echo') return; flash = 0.18; beep(150);
      var n = taps.length; if (n > 0) { var d = tt - taps[n - 1], e = iv[n - 1]; if (Math.abs(d - e) > 0.28 * e + 0.08) { taps.push(tt); fail(); return; } }
      taps.push(tt); if (taps.length === tb.length) { hits++; lastOk = true; ph = 'res'; pt = 0; }
    }
    setup();
    return {
      pausar: function () {},
      dbg: function () { return { st: st, ph: ph, iv: iv.slice(), taps: taps.length, hits: hits, errs: errs }; },
      down: function () { if (menu()) return; tap(); },
      key: function (c, d) { if (!d) return; if (c === 'Space' || c === 'Enter' || c === 'ArrowDown') { if (st !== 'play') menu(); else tap(); } },
      update: function (dt) {
        if (flash > 0) flash -= dt; if (st !== 'play') return; tt += dt; pt += dt;
        if (ph === 'ready') { if (pt > 1.3) { ph = 'listen'; pt = 0; played = 0; } }
        else if (ph === 'listen') { while (played < tb.length && pt >= tb[played]) { flash = 0.18; beep(150); played++; } if (pt > tb[tb.length - 1] + 0.7) { ph = 'echo'; pt = 0; } }
        else if (ph === 'echo') {
          var n = taps.length; if (n === 0) { if (pt > 7) fail(); } else { var e = iv[n - 1]; if (tt - taps[n - 1] > e + 0.28 * e + 0.12) fail(); }
        }
        else if (ph === 'res') { if (pt > 1.2) { if (errs > MAXE) st = 'lose'; else if (hits >= NEED) st = 'win'; else newPat(); } }
      },
      draw: function () {
        var W = api.w, H = api.h, cx = W / 2, cy = H * 0.52, R = Math.min(W, H) * 0.27, i;
        bg('#17202e', '#0a0f17'); g.fillStyle = 'rgba(255,255,255,.04)'; for (i = 0; i < 20; i++) { g.beginPath(); g.arc((i * 83) % W, (i * 57) % H, 2, 0, 6.29); g.fill(); }
        var sc = 1 + (flash > 0 ? flash * 0.6 : 0);
        g.fillStyle = '#6b4a2a'; g.beginPath(); g.arc(cx, cy, R * 1.1 * sc, 0, 6.29); g.fill(); g.fillStyle = flash > 0 ? '#f6e3b8' : '#d9c08c'; g.beginPath(); g.arc(cx, cy, R * sc, 0, 6.29); g.fill();
        g.strokeStyle = '#7a3a1a'; g.lineWidth = 3; g.beginPath(); g.moveTo(cx - R * 0.5, cy + R * 0.3); g.lineTo(cx, cy - R * 0.5); g.lineTo(cx + R * 0.5, cy + R * 0.3); g.moveTo(cx - R * 0.5, cy + R * 0.3); g.lineTo(cx + R * 0.5, cy + R * 0.3); g.stroke(); g.fillStyle = '#7a3a1a'; g.beginPath(); g.arc(cx, cy - R * 0.1, R * 0.1, 0, 6.29); g.fill();
        var msg = ph === 'listen' || ph === 'ready' ? T.ouve : ph === 'echo' ? T.repete : ''; if (msg) txt(msg, cx, cy - R * 1.35, 20, '#f3ecd2');
        if (ph === 'echo' || ph === 'listen') { for (i = 0; i < tb.length; i++) { var ok = ph === 'echo' ? i < taps.length : i < played; g.fillStyle = ok ? '#ffd88a' : 'rgba(255,255,255,.2)'; g.beginPath(); g.arc(cx + (i - (tb.length - 1) / 2) * 30, cy + R * 1.4, 8, 0, 6.29); g.fill(); } }
        if (ph === 'res') txt(lastOk ? '✓' : '✗', cx, cy + R * 1.6, 60, lastOk ? '#9dffb6' : '#ff8a7a');
        hud(T.h1 + ' ' + hits + '/' + NEED, T.h2 + ' ' + errs + '/' + (MAXE + 1), errs > 0);
        fim(st);
      }
    };
  }
});
