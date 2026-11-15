/* O caminho de Sigurd — ligue uma margem do tabuleiro à outra. */
BTJogo.registrar({
  canvas: 'jogo-sigurd',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O caminho de Sigurd",
    "sub": "Toque numa casa vazia para pôr uma pedra dourada. Ligue a margem da esquerda à da direita com uma corrente de pedras vizinhas. O rival, em azul, tenta ligar o alto ao fundo. Quem fechar a ligação primeiro vence. O tempo é limitado.",
    "perdeu": "O rival fechou o caminho primeiro",
    "v1": "Você abriu o caminho de ponta a ponta!",
    "v2": "Segundo as sagas, o rei Sigurd cruzou a Europa até Jerusalém. O jogo de ligar margens é invenção.",
    "h1": "Ligação",
    "h2": "Tempo"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Sigurd's road",
    "sub": "Tap an empty cell to place a golden stone. Connect the left edge to the right with a chain of neighbouring stones. The rival, in blue, tries to connect top to bottom. Whoever completes the link first wins. Time is limited.",
    "perdeu": "The rival closed the road first",
    "v1": "You opened the road from end to end!",
    "v2": "According to the sagas, King Sigurd crossed Europe to Jerusalem. The edge-connecting game is made up.",
    "h1": "Link",
    "h2": "Time"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Sigurds vei",
    "sub": "Trykk på en tom rute for å sette en gyllen stein. Knytt venstre kant til høyre med en kjede av nabosteiner. Motstanderen, i blått, prøver å knytte topp til bunn. Den som fullfører forbindelsen først, vinner. Tiden er begrenset.",
    "perdeu": "Motstanderen stengte veien først",
    "v1": "Du åpnet veien fra ende til annen!",
    "v2": "Ifølge sagaene krysset kong Sigurd Europa til Jerusalem. Spillet om å knytte kanter er diktet opp.",
    "h1": "Lenke",
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
    var N = 7, LIM = 300;
    var bd = [], turn = 1, wait = 0, tmr = LIM, cur = 24, pop = 0, nmoves = 0;
    function lay() { var W = api.w, H = api.h, s = Math.min((W - 30) / (10 * 1.732 + 1), (H - 190) / (1.5 * N + 0.5), 34); return { s: s, w: s * 1.732, h: s * 1.5, x0: (W - (N + (N - 1) / 2) * s * 1.732) / 2 + s * 0.866, y0: Math.max(84, (H - 1.5 * N * s) / 2 + 20) }; }
    function cpos(r, c) { var L = lay(); return { x: L.x0 + (c + r / 2) * L.w, y: L.y0 + r * L.h }; }
    function nb(r, c) { return [[r, c - 1], [r, c + 1], [r - 1, c], [r - 1, c + 1], [r + 1, c], [r + 1, c - 1]].filter(function (p) { return p[0] >= 0 && p[0] < N && p[1] >= 0 && p[1] < N; }); }
    function dist(b, who) { /* número de casas vazias a preencher para ligar */
      var INF = 99, d = [], q = [], i, r, c; for (i = 0; i < N * N; i++) d.push(INF);
      var starts = []; for (i = 0; i < N; i++) starts.push(who === 1 ? [i, 0] : [0, i]);
      var dq = []; starts.forEach(function (p) { var v = b[p[0] * N + p[1]]; if (v === -who || (who === 1 ? v === 2 : v === 1)) return; var w = v === who ? 0 : 1; d[p[0] * N + p[1]] = w; dq.push([p[0], p[1], w]); });
      var done = {}; while (dq.length) { dq.sort(function (a, b2) { return a[2] - b2[2]; }); var t = dq.shift(), key = t[0] * N + t[1]; if (done[key]) continue; done[key] = 1; nb(t[0], t[1]).forEach(function (p) { var v = b[p[0] * N + p[1]]; var other = who === 1 ? 2 : 1; if (v === other) return; var w = t[2] + (v === who ? 0 : 1); if (w < d[p[0] * N + p[1]]) { d[p[0] * N + p[1]] = w; dq.push([p[0], p[1], w]); } }); }
      var best = INF; for (i = 0; i < N; i++) { var e = who === 1 ? d[i * N + N - 1] : d[(N - 1) * N + i]; if (e < best) best = e; } return best;
    }
    function setup() { bd = []; for (var i = 0; i < N * N; i++) bd.push(0); turn = 1; wait = 0; tmr = LIM; cur = 24; nmoves = 0; }
    function reset() { setup(); st = 'play'; }
    function place(r, c, who) { if (bd[r * N + c]) return false; bd[r * N + c] = who; nmoves++; if (api.nota) api.nota(who === 1 ? 420 : 300, 0.06, 'triangle', 0.05); if (dist(bd, 1) === 0) st = 'win'; else if (dist(bd, 2) === 0) st = 'lose'; else { turn = who === 1 ? 2 : 1; wait = who === 1 ? 0.5 : 0; } return true; }
    function aiMove() {
      var c0 = [], i; for (i = 0; i < N * N; i++) if (!bd[i]) c0.push(i);
      var sc = c0.map(function (k) { bd[k] = 2; var s = dist(bd, 1) - dist(bd, 2); bd[k] = 0; var r = Math.floor(k / N), c = k % N; return { k: k, s: s + Math.random() * 0.6 - (Math.abs(r - 3) + Math.abs(c - 3)) * 0.02 }; });
      sc.sort(function (a, b) { return b.s - a.s; }); var pick = Math.random() < 0.3 ? sc[Math.floor(Math.random() * Math.min(6, sc.length))] : sc[0]; return pick.k;
    }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, bd: bd.slice(), turn: turn, wait: wait, N: N, pos: cpos, dist: dist }; },
      down: function (x, y) { if (menu()) return; if (turn !== 1 || wait > 0) return; var L = lay(), best = -1, bd2 = 1e9; for (var i = 0; i < N * N; i++) { if (bd[i]) continue; var p = cpos(Math.floor(i / N), i % N), d = Math.hypot(p.x - x, p.y - y); if (d < bd2) { bd2 = d; best = i; } } if (best >= 0 && bd2 < L.s * 1.0) { cur = best; place(Math.floor(best / N), best % N, 1); } },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } var r = Math.floor(cur / N), c = cur % N; if (k === 'ArrowUp' || k === 'KeyW') r = Math.max(0, r - 1); else if (k === 'ArrowDown' || k === 'KeyS') r = Math.min(N - 1, r + 1); else if (k === 'ArrowLeft' || k === 'KeyA') c = Math.max(0, c - 1); else if (k === 'ArrowRight' || k === 'KeyD') c = Math.min(N - 1, c + 1); else if (k === 'Space' || k === 'Enter') { if (turn === 1 && wait <= 0) place(r, c, 1); return; } cur = r * N + c; },
      update: function (dt) { pop += dt; if (st !== 'play') return; tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; return; } if (wait > 0) { wait -= dt; return; } if (turn === 2) { var k = aiMove(); place(Math.floor(k / N), k % N, 2); } },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), r, c, i, a;
        bg('#142234', '#060b12');
        var p0 = cpos(0, 0), p1 = cpos(N - 1, N - 1);
        g.lineWidth = 6; g.lineCap = 'round'; g.strokeStyle = '#ffd88a'; g.beginPath(); g.moveTo(cpos(0, 0).x - L.w * 0.7, cpos(0, 0).y - L.s * 0.4); g.lineTo(cpos(N - 1, 0).x - L.w * 0.7, cpos(N - 1, 0).y + L.s * 0.4); g.stroke(); g.beginPath(); g.moveTo(cpos(0, N - 1).x + L.w * 0.7, cpos(0, N - 1).y - L.s * 0.4); g.lineTo(cpos(N - 1, N - 1).x + L.w * 0.7, cpos(N - 1, N - 1).y + L.s * 0.4); g.stroke();
        g.strokeStyle = '#6aa0d8'; g.beginPath(); g.moveTo(cpos(0, 0).x - L.w * 0.5, cpos(0, 0).y - L.s * 1.1); g.lineTo(cpos(0, N - 1).x + L.w * 0.5, cpos(0, N - 1).y - L.s * 1.1); g.stroke(); g.beginPath(); g.moveTo(cpos(N - 1, 0).x - L.w * 0.5, cpos(N - 1, 0).y + L.s * 1.1); g.lineTo(cpos(N - 1, N - 1).x + L.w * 0.5, cpos(N - 1, N - 1).y + L.s * 1.1); g.stroke();
        for (r = 0; r < N; r++) for (c = 0; c < N; c++) { var p = cpos(r, c), v = bd[r * N + c]; g.beginPath(); for (a = 0; a < 6; a++) { var an = Math.PI / 6 + a * Math.PI / 3, px = p.x + Math.cos(an) * L.s * 0.95, py = p.y + Math.sin(an) * L.s * 0.95; if (a) g.lineTo(px, py); else g.moveTo(px, py); } g.closePath(); g.fillStyle = v === 1 ? '#ffd88a' : (v === 2 ? '#5a90d0' : 'rgba(255,255,255,.08)'); g.fill(); g.strokeStyle = r * N + c === cur && st === 'play' ? '#fff' : 'rgba(255,255,255,.25)'; g.lineWidth = r * N + c === cur ? 3 : 1.5; g.stroke(); }
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 40 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + (N - dist(bd, 1)) + '/' + N, T.h2 + ' ' + Math.ceil(tmr), false);
        fim(st);
      }
    };
  }
});
