/* Hermóðr cavalga até Hel — toque no instante certo, nove noites (invenção). */
BTJogo.registrar({
  canvas: 'jogo-hermodr',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Nove noites de Hermóðr",
    "sub": "Hermóðr cavalga Sleipnir rumo a Hel. Em cada noite, uma marca corre de um lado a outro da trilha. Toque (ou use Espaço) quando a marca estiver dentro da faixa dourada. Cada noite a faixa fica mais estreita e a marca mais veloz. Atravesse as nove noites com no máximo 2 erros; o terceiro erro encerra a cavalgada.",
    "perdeu": "Hermóðr errou o salto vezes demais e a cavalgada acabou",
    "v1": "Hermóðr chegou ao portão de Hel!",
    "v2": "Na Gylfaginning, Hermóðr cavalga o Sleipnir de Odin por nove noites, passa pela ponte Gjöll e salta o portão de Hel. A trilha de marcas é invenção.",
    "h1": "Noites",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Hermóðr's nine nights",
    "sub": "Hermóðr rides Sleipnir towards Hel. Each night a marker runs back and forth along the track. Tap (or press Space) when the marker is inside the gold band. Each night the band narrows and the marker speeds up. Get through the nine nights with at most 2 mistakes; the third mistake ends the ride.",
    "perdeu": "Hermóðr missed the leap too many times and the ride was over",
    "v1": "Hermóðr has reached the gate of Hel!",
    "v2": "In the Gylfaginning, Hermóðr rides Odin's Sleipnir for nine nights, passes the Gjöll bridge and leaps Hel's gate. The track of markers is invented.",
    "h1": "Nights",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Hermóðs ni netter",
    "sub": "Hermóð rir Sleipnir mot Hel. Hver natt løper en markør fram og tilbake langs stien. Trykk (eller bruk mellomrom) når markøren er inne i det gylne båndet. For hver natt blir båndet smalere og markøren raskere. Kom deg gjennom de ni nettene med høyst 2 feil; den tredje feilen avslutter ferden.",
    "perdeu": "Hermóð bommet på hoppet for mange ganger, og ferden var over",
    "v1": "Hermóð har nådd porten til Hel!",
    "v2": "I Gylfaginning rir Hermóð Odins Sleipnir i ni netter, forbi Gjallarbrua og hopper over porten til Hel. Stien med markører er oppfunnet.",
    "h1": "Netter",
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
    var NIGHTS = 9, MAXE = 3;
    var n = 0, err = 0, pos = 0, dir = 1, z0 = 0.4, zw = 0.2, flash = 0, fcol = '#fff', t = 0;
    function newZone() { zw = 0.22 - 0.012 * n; z0 = 0.08 + Math.random() * (0.84 - zw); }
    function speed() { return 0.55 + 0.11 * n; }
    function reset() { n = 0; err = 0; pos = 0; dir = 1; t = 0; flash = 0; newZone(); st = 'play'; }
    function tap() {
      if (st !== 'play') return;
      if (pos >= z0 && pos <= z0 + zw) { n++; flash = 0.3; fcol = '#ffd88a'; if (api.nota) api.nota(300 + n * 40, 0.14, 'triangle', 0.07); if (n >= NIGHTS) st = 'win'; else newZone(); }
      else { err++; flash = 0.3; fcol = '#ff6a5a'; if (api.nota) api.nota(120, 0.2, 'sawtooth', 0.05); if (err >= MAXE) st = 'lose'; }
    }
    function lay() { var W = api.w, H = api.h; return { x0: 30, x1: W - 30, y: H * 0.52, h: Math.max(34, Math.min(60, H * 0.14)) }; }
    reset(); st = 'menu';
    return {
      pausar: function () {},
      dbg: function () { return { st: st, n: n, err: err, pos: pos, z0: z0, zw: zw, nights: NIGHTS, maxe: MAXE }; },
      down: function () { if (menu()) return; tap(); },
      move: function () {}, up: function () {},
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'Space' || k === 'Enter') tap(); },
      update: function (dt) { if (flash > 0) flash -= dt; if (st !== 'play') return; t += dt; pos += dir * speed() * dt; if (pos > 1) { pos = 1; dir = -1; } if (pos < 0) { pos = 0; dir = 1; } },
      draw: function () {
        var L = lay(), W = api.w, i; bg('#0e1420', '#04060b');
        for (i = 0; i < NIGHTS; i++) { var cx = W / 2 + (i - (NIGHTS - 1) / 2) * Math.min(26, (W - 60) / NIGHTS); g.beginPath(); g.arc(cx, L.y - L.h - 24, 6, 0, 6.2832); if (i < n) { g.fillStyle = '#ffd88a'; g.fill(); } else { g.strokeStyle = 'rgba(255,255,255,.3)'; g.lineWidth = 1.5; g.stroke(); } }
        g.fillStyle = 'rgba(255,255,255,.08)'; rr(L.x0, L.y - L.h / 2, L.x1 - L.x0, L.h, 10); g.fill();
        g.fillStyle = flash > 0 ? fcol : '#e0b45a'; g.globalAlpha = 0.85; g.fillRect(L.x0 + z0 * (L.x1 - L.x0), L.y - L.h / 2, zw * (L.x1 - L.x0), L.h); g.globalAlpha = 1;
        var mx = L.x0 + pos * (L.x1 - L.x0); g.fillStyle = '#f3ecd2'; g.fillRect(mx - 4, L.y - L.h / 2 - 8, 8, L.h + 16);
        hud(T.h1 + ' ' + n + '/' + NIGHTS, T.h2 + ' ' + err + '/' + MAXE, true);
        fim(st);
      }
    };

  }
});
