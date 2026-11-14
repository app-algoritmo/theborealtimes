/* Moscas na forja — espante Loki, o inseto que quer estragar o martelo. */
BTJogo.registrar({
  canvas: 'jogo-mjolnir',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Moscas na forja",
    "sub": "Loki, em forma de mosca, quer picar Brokkr e estragar o martelo. Toque nas moscas (ou mova a mira com as setas e use a barra de espaço) antes que cheguem à mão dele. Acerte vinte moscas; na terceira picada o jogo acaba.",
    "perdeu": "A mosca estragou o martelo",
    "v1": "O Mjölnir está pronto!",
    "v2": "Segundo Snorri, Loki picou Brokkr para estragar a forja, e o cabo saiu curto.",
    "h1": "Moscas",
    "h2": "Picadas"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Flies at the forge",
    "sub": "Loki, as a fly, wants to bite Brokkr and spoil the hammer. Tap the flies (or move the crosshair with the arrows and press Space) before they reach his hand. Swat twenty flies; the third bite ends the game.",
    "perdeu": "The fly spoiled the hammer",
    "v1": "Mjölnir is ready!",
    "v2": "According to Snorri, Loki bit Brokkr to spoil the forging, and the handle came out short.",
    "h1": "Flies",
    "h2": "Bites"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Fluer i smia",
    "sub": "Loke, som flue, vil stikke Brokk og ødelegge hammeren. Trykk på fluene (eller flytt siktet med piltastene og bruk mellomromstasten) før de når hånden hans. Slå ned tjue fluer; ved tredje stikk er spillet over.",
    "perdeu": "Fluen ødela hammeren",
    "v1": "Mjølner er ferdig!",
    "v2": "Ifølge Snorre stakk Loke Brokk for å ødelegge smiingen, og skaftet ble kort.",
    "h1": "Fluer",
    "h2": "Stikk"
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
    var NEED = 20, MAXE = 3;
    var hits = 0, errs = 0, fl = [], sp = 0, cx = 225, cy = 200, kx = 0, ky = 0, splat = [], bit = 0;
    function hand() { return { x: api.w / 2, y: api.h * 0.62 }; }
    function setup() { hits = 0; errs = 0; fl = []; sp = 0.4; splat = []; bit = 0; var h = hand(); cx = h.x; cy = h.y - 90; }
    function reset() { setup(); st = 'play'; }
    function spawn() {
      var W = api.w, H = api.h, s = Math.floor(Math.random() * 3), x, y;
      if (s === 0) { x = Math.random() * W; y = -14; } else if (s === 1) { x = -14; y = Math.random() * H * 0.55; } else { x = W + 14; y = Math.random() * H * 0.55; }
      fl.push({ x: x, y: y, ph: Math.random() * 6, v: 64 + Math.min(40, hits * 2) + Math.random() * 22 });
    }
    function swat(x, y) {
      var b = -1, bd = 1e9, i;
      for (i = 0; i < fl.length; i++) { var d = Math.hypot(fl[i].x - x, fl[i].y - y); if (d < bd) { bd = d; b = i; } }
      if (b >= 0 && bd <= 38) { splat.push({ x: fl[b].x, y: fl[b].y, l: 0.45 }); fl.splice(b, 1); hits++; }
      else splat.push({ x: x, y: y, l: 0.2, miss: 1 });
    }
    setup();
    return {
      pausar: function () { kx = 0; ky = 0; },
      dbg: function () { return { st: st, hits: hits, errs: errs, fl: fl.map(function (f) { return { x: f.x, y: f.y }; }), hand: hand(), cx: cx, cy: cy }; },
      down: function (x, y) { if (menu()) return; cx = x; cy = y; swat(x, y); },
      move: function (x, y) { if (st === 'play') { cx = x; cy = y; } },
      key: function (c, d) {
        if (c === 'ArrowLeft' || c === 'KeyA') kx = d ? -1 : (kx === -1 ? 0 : kx); else if (c === 'ArrowRight' || c === 'KeyD') kx = d ? 1 : (kx === 1 ? 0 : kx);
        else if (c === 'ArrowUp' || c === 'KeyW') ky = d ? -1 : (ky === -1 ? 0 : ky); else if (c === 'ArrowDown' || c === 'KeyS') ky = d ? 1 : (ky === 1 ? 0 : ky);
        else if ((c === 'Space' || c === 'Enter') && d) { if (st !== 'play') menu(); else swat(cx, cy); }
      },
      update: function (dt) {
        var i, h = hand();
        for (i = splat.length - 1; i >= 0; i--) { splat[i].l -= dt; if (splat[i].l <= 0) splat.splice(i, 1); }
        if (bit > 0) bit -= dt;
        if (st !== 'play') return;
        cx = Math.max(0, Math.min(api.w, cx + kx * 300 * dt)); cy = Math.max(0, Math.min(api.h, cy + ky * 300 * dt));
        sp -= dt; if (sp <= 0 && fl.length < 6) { spawn(); sp = Math.max(0.5, 1.05 - hits * 0.028) * (0.8 + Math.random() * 0.4); }
        for (i = fl.length - 1; i >= 0; i--) {
          var f = fl[i]; f.ph += dt * 7; var dx = h.x - f.x, dy = h.y - f.y, d = Math.hypot(dx, dy) || 1, w = Math.sin(f.ph) * 55;
          f.x += dx / d * f.v * dt - dy / d * w * dt; f.y += dy / d * f.v * dt + dx / d * w * dt;
          if (d < 26) { fl.splice(i, 1); errs++; bit = 0.5; }
        }
        if (hits >= NEED) st = 'win'; else if (errs >= MAXE) st = 'lose';
      },
      draw: function () {
        var W = api.w, H = api.h, h = hand(), t = api.clock, i;
        bg('#2a1710', '#0e0806');
        var gl = g.createRadialGradient(W * 0.5, H * 0.95, 10, W * 0.5, H * 0.95, Math.max(W, H) * 0.75); gl.addColorStop(0, 'rgba(255,140,40,.55)'); gl.addColorStop(1, 'rgba(255,140,40,0)'); g.fillStyle = gl; g.fillRect(0, 0, W, H);
        g.fillStyle = '#3b3b44'; g.fillRect(W / 2 - 70, H * 0.86, 140, 20); g.fillRect(W / 2 - 28, H * 0.86 + 20, 56, 26); g.fillStyle = '#55555f'; g.fillRect(W / 2 - 92, H * 0.86 - 12, 184, 14);
        var fr = Math.min(1, hits / NEED); g.fillStyle = 'rgb(255,' + Math.round(120 + 90 * fr) + ',' + Math.round(40 + 60 * fr) + ')'; g.fillRect(W / 2 - 40, H * 0.86 - 22, 80 * fr, 10);
        g.fillStyle = '#6b4a2a'; g.beginPath(); g.moveTo(h.x - 62, h.y + 12); g.lineTo(h.x + 62, h.y + 12); g.lineTo(h.x + 38, h.y + 74); g.lineTo(h.x - 38, h.y + 74); g.fill();
        g.fillStyle = '#4a321c'; g.fillRect(h.x - 70, h.y + 4, 140, 10);
        g.fillStyle = bit > 0 ? '#ff8a7a' : '#e0b08a'; g.beginPath(); g.arc(h.x, h.y, 21, 0, 6.29); g.fill();
        g.fillStyle = '#c99a72'; g.fillRect(h.x - 26, h.y - 5, 52, 6);
        /* martelo que vai ficando pronto */
        var hx = W - 78, hy = 70; g.fillStyle = fr >= 1 ? '#ffd88a' : '#8a8f9a'; g.fillRect(hx - 6, hy + 22, 12, 62); g.fillRect(hx - 32, hy, 64, 28); bar(hx - 40, hy + 96, 80, 7, fr, '#ffb04a');
        for (i = 0; i < fl.length; i++) {
          var f = fl[i], fw = Math.sin(t * 60 + i) * 0.5 + 0.5;
          g.fillStyle = 'rgba(255,255,255,' + (0.35 + fw * 0.3) + ')'; g.beginPath(); g.ellipse(f.x - 5, f.y - 6, 7, 3 + fw * 3, -0.5, 0, 6.29); g.fill(); g.beginPath(); g.ellipse(f.x + 5, f.y - 6, 7, 3 + fw * 3, 0.5, 0, 6.29); g.fill();
          g.fillStyle = '#111'; g.beginPath(); g.ellipse(f.x, f.y, 5, 7, 0, 0, 6.29); g.fill(); g.fillStyle = '#d33'; g.fillRect(f.x - 2, f.y - 8, 4, 2);
        }
        for (i = 0; i < splat.length; i++) { var s = splat[i]; g.strokeStyle = s.miss ? 'rgba(255,255,255,.4)' : '#ffd88a'; g.lineWidth = 3; g.beginPath(); g.arc(s.x, s.y, 8 + (0.45 - s.l) * 50, 0, 6.29); g.stroke(); }
        if (st === 'play') { g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 2; g.beginPath(); g.arc(cx, cy, 20, 0, 6.29); g.moveTo(cx - 26, cy); g.lineTo(cx - 12, cy); g.moveTo(cx + 12, cy); g.lineTo(cx + 26, cy); g.moveTo(cx, cy - 26); g.lineTo(cx, cy - 12); g.moveTo(cx, cy + 12); g.lineTo(cx, cy + 26); g.stroke(); }
        hud(T.h1 + ' ' + hits + '/' + NEED, T.h2 + ' ' + errs + '/' + MAXE, errs > 0);
        fim(st);
      }
    };
  }
});
