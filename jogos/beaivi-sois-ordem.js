/* Beaivi, o Sol dos sámi — toque nos 16 sóis na ordem, o mais depressa que puder (invenção). */
BTJogo.registrar({
  canvas: 'jogo-beaivi',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os sóis de Beaivi",
    "sub": "Dezesseis sóis numerados aparecem fora de ordem. Toque neles na ordem, de 1 a 16, o mais depressa que puder. Tocar num sol errado conta como erro: no terceiro erro, ou passados 30 segundos, o sol se põe. (Teclado: setas movem o cursor, Espaço toca.)",
    "perdeu": "O sol se pôs",
    "v1": "O Sol subiu inteiro!",
    "v2": "Entre os sámi, o Sol é também uma divindade, ligada à primavera e às renas. Os dezesseis sóis numerados são invenção.",
    "h1": "Sóis",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Beaivi's suns",
    "sub": "Sixteen numbered suns appear out of order. Tap them in order, from 1 to 16, as fast as you can. Tapping the wrong sun counts as a mistake: on the third mistake, or after 30 seconds, the sun sets. (Keyboard: arrows move the cursor, Space taps.)",
    "perdeu": "The sun has set",
    "v1": "The Sun is fully up!",
    "v2": "Among the Sámi, the Sun is also a deity, tied to spring and reindeer. The sixteen numbered suns are invented.",
    "h1": "Suns",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Beaivis soler",
    "sub": "Seksten nummererte soler vises i tilfeldig rekkefølge. Trykk på dem i rekkefølge, fra 1 til 16, så fort du kan. Å trykke på feil sol teller som en feil: ved den tredje feilen, eller etter 30 sekunder, går sola ned. (Tastatur: piler flytter markøren, mellomrom trykker.)",
    "perdeu": "Sola har gått ned",
    "v1": "Sola står helt oppe!",
    "v2": "Blant samene er sola også en guddom, knyttet til våren og reinen. De seksten nummererte solene er oppfunnet.",
    "h1": "Soler",
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
    var LIM = 30, MAXE = 2;
    var nums = [], next = 1, err = 0, t = 0, kc = 0, flash = 0, done = {};
    function lay() { var W = api.w, H = api.h, cs = Math.max(48, Math.min((W - 24) / 4, (H - 130) / 4, 110)); return { W: W, H: H, cs: cs, x: (W - cs * 4) / 2, y: Math.max(72, (H - cs * 4) / 2 + 10) }; }
    function reset() { nums = []; for (var i = 1; i <= 16; i++) nums.push(i); for (i = 15; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), q = nums[i]; nums[i] = nums[j]; nums[j] = q; } next = 1; err = 0; t = 0; kc = 0; flash = 0; done = {}; st = 'play'; }
    function tap(i) {
      if (st !== 'play' || i < 0 || i > 15) return; var n = nums[i]; if (done[n]) return;
      if (n === next) { done[n] = 1; next++; if (api.nota) api.nota(300 + n * 28, 0.08, 'triangle', 0.05); if (next > 16) { st = 'win'; if (api.nota) api.nota(900, 0.3, 'sine', 0.06); } }
      else { err++; flash = 0.35; if (api.nota) api.nota(110, 0.2, 'sawtooth', 0.06); if (err > MAXE) st = 'lose'; }
    }
    function pos(i) { var L = lay(); return { x: L.x + ((i % 4) + 0.5) * L.cs, y: L.y + (Math.floor(i / 4) + 0.5) * L.cs }; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { var ps = []; for (var i = 0; i < 16; i++) { var p = pos(i); ps.push({ x: p.x, y: p.y, n: nums[i] }); } return { st: st, next: next, suns: ps, err: err, t: t }; },
      down: function (x, y) { if (menu()) return; var L = lay(), c = Math.floor((x - L.x) / L.cs), r = Math.floor((y - L.y) / L.cs); if (c >= 0 && c < 4 && r >= 0 && r < 4) tap(r * 4 + c); },
      move: function () {}, up: function () {},
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'ArrowLeft' || k === 'KeyA') kc = kc % 4 ? kc - 1 : kc; else if (k === 'ArrowRight' || k === 'KeyD') kc = kc % 4 < 3 ? kc + 1 : kc; else if (k === 'ArrowUp' || k === 'KeyW') kc = kc >= 4 ? kc - 4 : kc; else if (k === 'ArrowDown' || k === 'KeyS') kc = kc < 12 ? kc + 4 : kc; else if (k === 'Space' || k === 'Enter') tap(kc); },
      update: function (dt) { if (flash > 0) flash -= dt; if (st !== 'play') return; t += dt; if (t >= LIM) st = 'lose'; },
      draw: function () {
        var L = lay(), cs = L.cs, i;
        bg('#2a1f3a', '#0c0814');
        for (i = 0; i < 16; i++) { var p = pos(i), n = nums[i], dn = done[n], r = cs * 0.33;
          g.strokeStyle = dn ? 'rgba(255,216,138,.25)' : '#ffb040'; g.lineWidth = 3; for (var k = 0; k < 12; k++) { var a = k * 0.5236 + api.clock * 0.3; g.beginPath(); g.moveTo(p.x + Math.cos(a) * r * 1.2, p.y + Math.sin(a) * r * 1.2); g.lineTo(p.x + Math.cos(a) * r * 1.55, p.y + Math.sin(a) * r * 1.55); g.stroke(); }
          g.fillStyle = dn ? '#5a4a30' : '#ffd88a'; g.beginPath(); g.arc(p.x, p.y, r, 0, 6.283); g.fill();
          txt(String(n), p.x, p.y + r * 0.38, r * 1.1, dn ? '#8a7a5a' : '#3a2a10');
          if (i === kc && st === 'play') { g.strokeStyle = 'rgba(255,255,255,.8)'; g.lineWidth = 2; g.strokeRect(p.x - cs / 2 + 2, p.y - cs / 2 + 2, cs - 4, cs - 4); } }
        if (flash > 0) { g.fillStyle = 'rgba(192,57,43,' + flash * 0.5 + ')'; g.fillRect(0, 0, api.w, api.h); }
        bar(api.w / 2 - 110, api.h - 14, 220, 5, (LIM - t) / LIM, LIM - t < 10 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + Math.min(next - 1, 16) + '/16', T.h2 + ' ' + Math.max(0, Math.ceil(LIM - t)), false);
        fim(st);
      }
    };
  }
});
