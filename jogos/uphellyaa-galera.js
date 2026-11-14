/* A galera de Up Helly Aa — monte as peças do navio no lugar certo. */
BTJogo.registrar({
  canvas: 'jogo-uphellyaa',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A galera de Up Helly Aa",
    "sub": "Monte a galera para a festa. Arraste cada peça (ou escolha com as setas e use a barra de espaço) até o lugar certo no desenho. Peça no lugar errado é um engano: três e o jogo acaba. O tempo é curto.",
    "perdeu": "A galera não ficou pronta",
    "v1": "A galera está pronta!",
    "v2": "Em Up Helly Aa, em Lerwick, nas Shetland, uma galera é queimada todo inverno num festival de fogo. A montagem do jogo é invenção.",
    "h1": "Peças",
    "h2": "Enganos",
    "pecas": "Peças",
    "lugares": "Lugares"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The Up Helly Aa galley",
    "sub": "Build the galley for the festival. Drag each part (or choose with the arrows and press Space) to its right place in the drawing. A part in the wrong place is a mistake: three and the game is over. Time is short.",
    "perdeu": "The galley was not finished",
    "v1": "The galley is ready!",
    "v2": "At Up Helly Aa, in Lerwick, Shetland, a galley is burned every winter in a fire festival. The assembly in the game is made up.",
    "h1": "Parts",
    "h2": "Mistakes",
    "pecas": "Parts",
    "lugares": "Places"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Galeien til Up Helly Aa",
    "sub": "Bygg galeien til festen. Dra hver del (eller velg med piltastene og bruk mellomromstasten) til riktig plass på tegningen. En del på feil plass er en feil: Tre, og spillet er over. Tiden er knapp.",
    "perdeu": "Galeien ble ikke ferdig",
    "v1": "Galeien er ferdig!",
    "v2": "På Up Helly Aa i Lerwick på Shetland blir en galei brent hver vinter under en ildfest. Byggingen i spillet er diktet opp.",
    "h1": "Deler",
    "h2": "Feil",
    "pecas": "Deler",
    "lugares": "Plasser"
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
    var NP = 6, MAXE = 3, LIM = 75, SL = [[0, 98], [0, 30], [0, -34], [0, -112], [-106, 12], [150, -8]];
    var placed = [], errs = 0, tmr = LIM, order = [], drag = -1, dx = 0, dy = 0, ox = 0, oy = 0, selP = 0, selS = 0, flashS = -1, flashT = 0, okF = false;
    function lay() { var W = api.w, H = api.h, u = Math.min(W / 460, (H * 0.55) / 290, 1.1), cx = W / 2, cy = 70 + 150 * u, ty = H - 62, sl = [], tr = [], i; for (i = 0; i < NP; i++) sl.push({ x: cx + SL[i][0] * u, y: cy + SL[i][1] * u }); for (i = 0; i < NP; i++) tr.push({ x: W * (i + 0.5) / NP, y: ty, id: order[i] }); return { u: u, sl: sl, tr: tr, r: Math.max(36, 44 * u) }; }
    function setup() { placed = []; for (var i = 0; i < NP; i++) placed.push(false); errs = 0; tmr = LIM; drag = -1; order = [0, 1, 2, 3, 4, 5]; for (var k = 5; k > 0; k--) { var j = Math.floor(Math.random() * (k + 1)), t = order[k]; order[k] = order[j]; order[j] = t; } selP = 0; selS = 0; flashT = 0; nextSel(0); }
    function reset() { setup(); st = 'play'; }
    function nextSel(d) { for (var k = 0; k < NP; k++) { var i = ((selP + d * (k + (d ? 0 : 0)) ) % NP + NP) % NP; if (!placed[order[i]]) { selP = i; return; } } }
    function put(id, s) {
      if (st !== 'play' || placed[id]) return; okF = (id === s); flashS = s; flashT = 0.5;
      if (okF) { placed[id] = true; if (api.nota) api.nota(520, 0.12, 'triangle', 0.08); var all = true; for (var i = 0; i < NP; i++) if (!placed[i]) all = false; if (all) st = 'win'; else nextSel(1); }
      else { errs++; if (errs >= MAXE) st = 'lose'; }
    }
    function part(id, x, y, s, a) {
      g.save(); g.translate(x, y); g.scale(s, s); g.globalAlpha = a;
      if (id === 0) { g.fillStyle = '#5a3a1c'; g.fillRect(-62, -7, 124, 14); g.fillStyle = '#7a5230'; g.fillRect(-62, -7, 124, 4); }
      else if (id === 1) { g.fillStyle = '#8a5a2a'; g.beginPath(); g.moveTo(-72, -14); g.quadraticCurveTo(0, 56, 72, -14); g.lineTo(60, -26); g.lineTo(-60, -26); g.closePath(); g.fill(); g.strokeStyle = '#c9a23a'; g.lineWidth = 3; g.beginPath(); g.moveTo(-60, -20); g.lineTo(60, -20); g.stroke(); }
      else if (id === 2) { g.fillStyle = '#6b4a2a'; g.fillRect(-6, -62, 12, 124); g.fillStyle = '#8a6a3a'; g.fillRect(-6, -62, 4, 124); }
      else if (id === 3) { g.fillStyle = '#b3261e'; g.fillRect(-48, -38, 96, 76); g.fillStyle = '#f0e6cc'; g.fillRect(-48, -14, 96, 12); g.fillRect(-48, 12, 96, 12); }
      else if (id === 4) { g.fillStyle = '#c9a23a'; g.beginPath(); g.arc(0, 0, 34, 0, 6.29); g.fill(); g.fillStyle = '#8a8f9a'; g.beginPath(); g.arc(0, 0, 10, 0, 6.29); g.fill(); g.strokeStyle = '#7a5a1a'; g.lineWidth = 3; g.beginPath(); g.arc(0, 0, 34, 0, 6.29); g.moveTo(-34, 0); g.lineTo(34, 0); g.moveTo(0, -34); g.lineTo(0, 34); g.stroke(); }
      else { g.fillStyle = '#4a8a5a'; g.beginPath(); g.moveTo(-30, 40); g.quadraticCurveTo(-34, -10, -10, -34); g.lineTo(26, -42); g.lineTo(44, -24); g.lineTo(18, -16); g.lineTo(28, -6); g.quadraticCurveTo(6, 4, 10, 40); g.closePath(); g.fill(); g.fillStyle = '#f0e6cc'; g.beginPath(); g.arc(14, -28, 4, 0, 6.29); g.fill(); }
      g.restore();
    }
    setup();
    return {
      pausar: function () { drag = -1; },
      dbg: function () { var L = lay(); return { st: st, placed: placed.slice(), errs: errs, tmr: tmr, tray: L.tr, slots: L.sl, drag: drag }; },
      down: function (x, y) { if (menu()) return; var L = lay(), i; for (i = 0; i < NP; i++) if (!placed[L.tr[i].id] && Math.hypot(x - L.tr[i].x, y - L.tr[i].y) < 36) { drag = L.tr[i].id; selP = i; dx = x; dy = y; return; } },
      move: function (x, y) { if (drag >= 0) { dx = x; dy = y; } },
      up: function () {
        if (drag < 0) return; var L = lay(), b = -1, bd = 1e9, i; for (i = 0; i < NP; i++) { var d = Math.hypot(dx - L.sl[i].x, dy - L.sl[i].y); if (d < bd) { bd = d; b = i; } }
        var id = drag; drag = -1; if (bd <= L.r) put(id, b);
      },
      key: function (c, d) {
        if (!d) return;
        if (c === 'ArrowLeft' || c === 'KeyA') { for (var k = 1; k <= NP; k++) { var i = (selP - k + NP * 2) % NP; if (!placed[order[i]]) { selP = i; break; } } }
        else if (c === 'ArrowRight' || c === 'KeyD') { for (var k2 = 1; k2 <= NP; k2++) { var i2 = (selP + k2) % NP; if (!placed[order[i2]]) { selP = i2; break; } } }
        else if (c === 'ArrowUp' || c === 'KeyW') selS = (selS + NP - 1) % NP; else if (c === 'ArrowDown' || c === 'KeyS') selS = (selS + 1) % NP;
        else if (c === 'Space' || c === 'Enter') { if (st !== 'play') menu(); else put(order[selP], selS); }
      },
      update: function (dt) { if (flashT > 0) flashT -= dt; if (st !== 'play') return; tmr -= dt; if (tmr <= 0) st = 'lose'; },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), i, n = 0;
        bg('#201a2e', '#0d0a14');
        g.fillStyle = 'rgba(255,170,60,.1)'; g.beginPath(); g.arc(W / 2, H * 0.3, Math.min(W, H) * 0.45, 0, 6.29); g.fill();
        for (i = 0; i < NP; i++) {
          var s = L.sl[i]; if (placed[i]) { part(i, s.x, s.y, L.u * 0.9, 1); n++; } else { part(i, s.x, s.y, L.u * 0.9, 0.22); g.strokeStyle = (st === 'play' && selS === i) ? '#fff' : 'rgba(255,255,255,.3)'; g.lineWidth = 2; g.setLineDash([5, 5]); g.beginPath(); g.arc(s.x, s.y, L.r * 0.8, 0, 6.29); g.stroke(); g.setLineDash([]); }
          if (flashT > 0 && flashS === i) { g.strokeStyle = okF ? '#9dffb6' : '#ff8a7a'; g.lineWidth = 4; g.beginPath(); g.arc(s.x, s.y, L.r * 0.8 + (0.5 - flashT) * 20, 0, 6.29); g.stroke(); }
        }
        g.fillStyle = 'rgba(255,255,255,.07)'; g.fillRect(0, H - 108, W, 108);
        for (i = 0; i < NP; i++) { var t = L.tr[i]; if (placed[t.id] || drag === t.id) continue; part(t.id, t.x, t.y, 0.5 * Math.max(0.8, L.u), 1); if (st === 'play' && selP === i) { g.strokeStyle = '#fff'; g.lineWidth = 2; g.strokeRect(t.x - 34, t.y - 34, 68, 68); } }
        if (drag >= 0) part(drag, dx, dy, L.u * 0.9, 0.95);
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 12 ? '#c0392b' : '#e8842a');
        hud(T.h1 + ' ' + n + '/' + NP, T.h2 + ' ' + errs + '/' + MAXE, errs > 0);
        fim(st);
      }
    };
  }
});
