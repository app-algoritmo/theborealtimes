/* O muro do Danevirke — posicione guardas em cada faixa. */
BTJogo.registrar({
  canvas: 'jogo-danevirke',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O muro do Danevirke",
    "sub": "Invasores avançam em cinco faixas até o muro, à esquerda. Toque numa casa vazia para pôr um guarda, que gasta 2 moedas e lança dardos ao longo da faixa. As moedas chegam com o tempo. Derrote os 22 invasores. Se 3 passarem pelo muro, o jogo acaba. Teclado: setas e espaço.",
    "perdeu": "O muro foi vencido",
    "v1": "O muro do Danevirke resistiu!",
    "v2": "O Danevirke era uma muralha de terra e madeira no sul da Dinamarca, ampliada ao longo dos séculos. A defesa em faixas é invenção do jogo.",
    "h1": "Invasores",
    "h2": "Brechas"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The Danevirke wall",
    "sub": "Invaders advance along five lanes toward the wall on the left. Tap an empty square to place a guard, which costs 2 coins and throws darts along the lane. Coins arrive over time. Defeat all 22 invaders. If 3 get past the wall, the game ends. Keyboard: arrows and Space.",
    "perdeu": "The wall was overcome",
    "v1": "The Danevirke held!",
    "v2": "The Danevirke was an earth-and-timber rampart in southern Denmark, extended over the centuries. The lane defence is made up for the game.",
    "h1": "Invaders",
    "h2": "Breaches"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Danevirke-muren",
    "sub": "Inntrengere rykker fram i fem felt mot muren til venstre. Trykk på en tom rute for å sette ned en vakt, som koster 2 mynter og kaster spyd langs feltet. Myntene kommer etter hvert. Beseir alle 22 inntrengerne. Kommer 3 forbi muren, er spillet over. Tastatur: piltaster og mellomrom.",
    "perdeu": "Muren ble overmannet",
    "v1": "Danevirke holdt stand!",
    "v2": "Danevirke var en voll av jord og tre i Sør-Danmark, utvidet gjennom århundrene. Feltforsvaret er diktet opp for spillet.",
    "h1": "Inntrengere",
    "h2": "Brudd"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "El muro del Danevirke",
    "sub": "Los invasores avanzan por cinco carriles hasta el muro, a la izquierda. Toca una casilla vacía para colocar un guardia, que gasta 2 monedas y lanza dardos a lo largo del carril. Las monedas llegan con el tiempo. Derrota a los 22 invasores. Si 3 cruzan el muro, el juego termina. Teclado: flechas y espacio.",
    "perdeu": "El muro fue vencido",
    "v1": "¡El muro del Danevirke resistió!",
    "v2": "El Danevirke era una muralla de tierra y madera en el sur de Dinamarca, ampliada a lo largo de los siglos. La defensa por carriles es invención del juego.",
    "h1": "Invasores",
    "h2": "Brechas"
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
    var NR = 5, NC = 8, TOTAL = 22, MAXB = 3, COST = 2;
    var gd = [], en = [], coins = 4, inc = 0, spawned = 0, spt = 3, beaches = 0, killed = 0, cr = 2, cc = 3, pop = 0, shots = [];
    function lay() { var W = api.w, H = api.h, cs = Math.min((W - 20) / NC, (H - 170) / NR); return { cs: cs, x: (W - cs * NC) / 2, y: Math.max(70, (H - cs * NR) / 2 + 6) }; }
    function setup() { gd = []; en = []; coins = 4; inc = 0; spawned = 0; spt = 3; beaches = 0; killed = 0; shots = []; cr = 2; cc = 3; }
    function reset() { setup(); st = 'play'; }
    function guardAt(r, c) { for (var i = 0; i < gd.length; i++) if (gd[i].r === r && gd[i].c === c) return gd[i]; return null; }
    function place(r, c) { if (st !== 'play' || c < 1 || c >= NC || r < 0 || r >= NR || guardAt(r, c) || coins < COST) return false; gd.push({ r: r, c: c, hp: 3, cd: 0.4 }); coins -= COST; if (api.nota) api.nota(260, 0.08, 'triangle', 0.05); return true; }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, gd: gd.map(function (q) { return { r: q.r, c: q.c, hp: q.hp }; }), en: en.map(function (e) { return { r: e.r, x: e.x, hp: e.hp }; }), coins: coins, killed: killed, beaches: beaches, spawned: spawned, x: L.x, y: L.y, cs: L.cs }; },
      down: function (x, y) { if (menu()) return; var L = lay(), c = Math.floor((x - L.x) / L.cs), r = Math.floor((y - L.y) / L.cs); if (c >= 0 && c < NC && r >= 0 && r < NR) { cr = r; cc = Math.max(1, c); place(r, c); } },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'ArrowUp' || k === 'KeyW') cr = (cr + NR - 1) % NR; else if (k === 'ArrowDown' || k === 'KeyS') cr = (cr + 1) % NR; else if (k === 'ArrowLeft' || k === 'KeyA') cc = Math.max(1, cc - 1); else if (k === 'ArrowRight' || k === 'KeyD') cc = Math.min(NC - 1, cc + 1); else if (k === 'Space' || k === 'Enter') place(cr, cc); },
      update: function (dt) {
        pop += dt; var i, j; for (i = shots.length - 1; i >= 0; i--) { shots[i].t -= dt; if (shots[i].t <= 0) shots.splice(i, 1); }
        if (st !== 'play') return;
        inc += dt; if (inc >= 2.6) { inc -= 2.6; coins = Math.min(9, coins + 1); }
        spt -= dt; if (spawned < TOTAL && spt <= 0) { en.push({ r: Math.floor(Math.random() * NR), x: NC + 0.2, hp: 4, v: 0.42 + Math.random() * 0.14 }); spawned++; spt = Math.max(1.6, 4.4 - spawned * 0.16) + Math.random(); }
        for (i = 0; i < en.length; i++) {
          var e = en[i], gc = null; for (j = 0; j < gd.length; j++) if (gd[j].r === e.r && Math.abs(gd[j].c + 0.5 - e.x) < 0.45) gc = gd[j];
          if (gc) { gc.hp -= dt * 0.7; } else e.x -= e.v * dt;
        }
        for (j = gd.length - 1; j >= 0; j--) if (gd[j].hp <= 0) gd.splice(j, 1);
        for (j = 0; j < gd.length; j++) { var q = gd[j]; q.cd -= dt; if (q.cd <= 0) { var t = null; for (i = 0; i < en.length; i++) if (en[i].r === q.r && en[i].x > q.c + 0.3 && en[i].x < NC + 0.5 && (!t || en[i].x < t.x)) t = en[i]; if (t) { t.hp--; q.cd = 0.9; shots.push({ r: q.r, a: q.c + 0.7, b: t.x, t: 0.12 }); if (api.nota) api.nota(520, 0.03, 'square', 0.03); } else q.cd = 0.1; } }
        for (i = en.length - 1; i >= 0; i--) { if (en[i].hp <= 0) { en.splice(i, 1); killed++; if (api.nota) api.nota(180, 0.1, 'sawtooth', 0.05); } else if (en[i].x < 0.6) { en.splice(i, 1); beaches++; if (api.nota) api.nota(100, 0.3, 'sawtooth', 0.07); } }
        if (beaches >= MAXB) st = 'lose'; else if (killed + beaches >= TOTAL && !en.length) st = 'win';
      },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), r, c, i;
        bg('#1e2a20', '#08100a');
        for (r = 0; r < NR; r++) for (c = 0; c < NC; c++) { g.fillStyle = c === 0 ? '#6a5236' : ((r + c) % 2 ? '#2f4a30' : '#2a432c'); g.fillRect(L.x + c * L.cs, L.y + r * L.cs, L.cs - 1, L.cs - 1); }
        g.fillStyle = '#8a6a44'; for (r = 0; r < NR; r++) { g.fillRect(L.x + 4, L.y + r * L.cs + 4, L.cs - 9, L.cs - 9); }
        for (i = 0; i < shots.length; i++) { var s = shots[i]; g.strokeStyle = '#ffe8a8'; g.lineWidth = 3; g.beginPath(); g.moveTo(L.x + s.a * L.cs, L.y + (s.r + 0.5) * L.cs); g.lineTo(L.x + s.b * L.cs, L.y + (s.r + 0.5) * L.cs); g.stroke(); }
        for (i = 0; i < gd.length; i++) { var q = gd[i], x = L.x + q.c * L.cs, y = L.y + q.r * L.cs; g.fillStyle = '#d9b97a'; g.beginPath(); g.arc(x + L.cs / 2, y + L.cs * 0.38, L.cs * 0.2, 0, 6.283); g.fill(); g.fillStyle = '#4a6a9a'; rr(x + L.cs * 0.25, y + L.cs * 0.55, L.cs * 0.5, L.cs * 0.35, 6); g.fill(); bar(x + 6, y + L.cs - 7, L.cs - 12, 3, q.hp / 3, '#9bd49b'); }
        for (i = 0; i < en.length; i++) { var e = en[i], ex = L.x + e.x * L.cs, ey = L.y + e.r * L.cs; g.fillStyle = '#b0443a'; rr(ex - L.cs * 0.3, ey + L.cs * 0.2, L.cs * 0.6, L.cs * 0.6, 8); g.fill(); g.fillStyle = '#3a1a14'; g.fillRect(ex - L.cs * 0.12, ey + L.cs * 0.38, L.cs * 0.24, 4); bar(ex - L.cs * 0.28, ey + L.cs * 0.12, L.cs * 0.56, 3, e.hp / 4, '#e06a5a'); }
        if (st === 'play') { g.strokeStyle = 'rgba(255,216,138,.8)'; g.lineWidth = 2; g.strokeRect(L.x + cc * L.cs + 2, L.y + cr * L.cs + 2, L.cs - 4, L.cs - 4); }
        for (i = 0; i < 9; i++) { g.fillStyle = i < coins ? '#ffd88a' : 'rgba(255,255,255,.12)'; g.beginPath(); g.arc(W / 2 - 80 + i * 20, H - 26, 7, 0, 6.283); g.fill(); }
        hud(T.h1 + ' ' + killed + '/' + TOTAL, T.h2 + ' ' + beaches + '/' + MAXB, beaches > 0);
        fim(st);
      }
    };
  }
});
