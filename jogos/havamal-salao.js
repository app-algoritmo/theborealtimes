/* Hóspedes no salão — atenda cada hóspede com o que ele pede. */
BTJogo.registrar({
  canvas: 'jogo-havamal',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Hóspedes no salão",
    "sub": "Os hóspedes chegam ao salão e cada um pede algo: fogo, água, comida ou um manto seco. Toque no item certo (ou use as teclas 1 a 4) para atender quem espera há mais tempo por ele. Item errado ou espera longa demais contam como erro. Atenda doze hóspedes com no máximo três erros.",
    "perdeu": "Os hóspedes foram embora",
    "v1": "O salão está em paz!",
    "v2": "O poema Hávamál pede ao anfitrião fogo, água, comida e roupa seca para quem chega de fora. Os hóspedes e as esperas do jogo são invenção.",
    "h1": "Atendidos",
    "h2": "Erros",
    "n1": "Fogo",
    "n2": "Água",
    "n3": "Comida",
    "n4": "Manto"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Guests in the hall",
    "sub": "Guests arrive in the hall and each asks for something: fire, water, food or a dry cloak. Tap the right item (or use keys 1 to 4) to serve whoever has waited longest for it. A wrong item or too long a wait counts as a mistake. Serve twelve guests with at most three mistakes.",
    "perdeu": "The guests left",
    "v1": "The hall is at peace!",
    "v2": "The poem Hávamál asks the host for fire, water, food and dry clothing for whoever comes from outside. The guests and the waits in the game are made up.",
    "h1": "Served",
    "h2": "Mistakes",
    "n1": "Fire",
    "n2": "Water",
    "n3": "Food",
    "n4": "Cloak"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Gjester i hallen",
    "sub": "Gjester kommer inn i hallen, og hver ber om noe: ild, vann, mat eller en tørr kappe. Trykk på riktig ting (eller bruk tastene 1 til 4) for å betjene den som har ventet lengst på den. Feil ting eller for lang ventetid teller som feil. Betjen tolv gjester med høyst tre feil.",
    "perdeu": "Gjestene dro",
    "v1": "Hallen har fred!",
    "v2": "Diktet Håvamål krever av verten ild, vann, mat og tørre klær for den som kommer utenfra. Gjestene og ventetidene i spillet er diktet opp.",
    "h1": "Betjent",
    "h2": "Feil",
    "n1": "Ild",
    "n2": "Vann",
    "n3": "Mat",
    "n4": "Kappe"
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
    var NEED = 12, MAXE = 3, IC = ['🔥', '💧', '🍖', '🧥'], NS = 5;
    var gs = [], served = 0, errs = 0, spawnT = 0, made = 0, fl = 0, fres = 0, fpos = 0;
    function reset() { st = 'play'; gs = []; served = 0; errs = 0; made = 0; spawnT = 0.6; fl = 0; }
    function pat() { return Math.max(2.4, 4.4 - served * 0.22); }
    function serve(k) {
      if (st !== 'play') return; var b = -1, m = 1e9;
      for (var i = 0; i < gs.length; i++) if (gs[i].need === k && gs[i].pat < m) { m = gs[i].pat; b = i; }
      if (b < 0) { errs++; fl = 0.4; fres = -1; fpos = k; if (errs >= MAXE) st = 'lose'; return; }
      gs.splice(b, 1); served++; fl = 0.4; fres = 1; fpos = k; if (served >= NEED) st = 'win';
    }
    return {
      pausar: function () {},
      dbg: function () { return { st: st, served: served, errs: errs, gs: gs.map(function (q) { return { need: q.need, pat: q.pat }; }) }; },
      down: function (x, y) { if (menu()) return; var W = api.w, H = api.h; if (y > H * 0.72) serve(Math.max(0, Math.min(3, Math.floor(x / (W / 4))))); },
      key: function (c, d) { if (!d) return; if (st !== 'play') { if (c === 'Space' || c === 'Enter') menu(); return; } var k = { Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3 }[c]; if (k !== undefined) serve(k); },
      update: function (dt) {
        if (st !== 'play') return; fl = Math.max(0, fl - dt);
        spawnT -= dt; if (spawnT <= 0 && gs.length < NS && made < NEED + 3) { var used = gs.map(function (q) { return q.slot; }), s = 0; while (used.indexOf(s) >= 0) s++; gs.push({ need: Math.floor(Math.random() * 4), pat: pat(), lim: pat(), slot: s }); made++; spawnT = Math.max(0.55, 1.25 - served * 0.06) + Math.random() * 0.45; }
        for (var i = gs.length - 1; i >= 0; i--) { gs[i].pat -= dt; if (gs[i].pat <= 0) { gs.splice(i, 1); errs++; fl = 0.4; fres = -1; fpos = -1; if (errs >= MAXE) st = 'lose'; } }
        if (st === 'play' && gs.length === 0 && made >= NEED + 3 && served < NEED) st = 'lose';
      },
      draw: function () {
        var W = api.w, H = api.h, nm = [T.n1, T.n2, T.n3, T.n4];
        bg('#3a2418', '#150e0a'); g.fillStyle = '#5a3a24'; g.fillRect(0, H * 0.2, W, H * 0.04); g.fillStyle = '#25160e'; g.fillRect(0, H * 0.24, W, H * 0.44);
        var fire = g.createRadialGradient(W / 2, H * 0.62, 4, W / 2, H * 0.62, 90); fire.addColorStop(0, 'rgba(255,180,70,.6)'); fire.addColorStop(1, 'rgba(255,180,70,0)'); g.fillStyle = fire; g.fillRect(W / 2 - 100, H * 0.4, 200, 200);
        gs.forEach(function (q) { var sx = W * (q.slot + 0.5) / NS, sy = H * 0.5; g.fillStyle = '#6b5a48'; g.beginPath(); g.arc(sx, sy, 18, 0, 6.29); g.fill(); g.fillStyle = '#8a3a2a'; g.fillRect(sx - 20, sy + 16, 40, 38); txt(IC[q.need], sx, sy - 34, 30, '#fff'); var bw = Math.min(W / NS * 0.7, 90); g.fillStyle = 'rgba(255,255,255,.2)'; g.fillRect(sx - bw / 2, sy + 62, bw, 6); g.fillStyle = q.pat / q.lim > 0.35 ? '#ffd88a' : '#ff8a7a'; g.fillRect(sx - bw / 2, sy + 62, bw * Math.max(0, q.pat) / q.lim, 6); });
        for (var i = 0; i < 4; i++) { var bx = W * (i + 0.5) / 4, by = H * 0.86; g.fillStyle = fl > 0 && fpos === i ? (fres > 0 ? 'rgba(120,255,160,.4)' : 'rgba(255,100,80,.45)') : 'rgba(255,255,255,.1)'; g.fillRect(bx - W / 8 + 6, H * 0.74, W / 4 - 12, H * 0.24); txt(IC[i], bx, by, 34, '#fff'); txt(nm[i] + ' ' + (i + 1), bx, H * 0.95, 12, '#f3ecd2'); }
        hud(T.h1 + ' ' + served + '/' + NEED, T.h2 + ' ' + errs + '/' + MAXE, errs > 0);
        fim(st);
      }
    };
  }
});
