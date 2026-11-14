/* A névoa do Draugen — colete as bóias sem ser alcançado. */
BTJogo.registrar({
  canvas: 'jogo-draugen',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A névoa do Draugen",
    "sub": "Na neblina, conduza o barco (arraste, use o mouse ou as setas) até as seis bóias douradas. O Draugen vaga devagar atrás de você e aparece só quando está perto. Não deixe que ele o alcance.",
    "perdeu": "O Draugen alcançou o barco",
    "v1": "Bóias a salvo!",
    "v2": "Na tradição norueguesa, o draug é o espírito de um afogado visto no mar e na neblina. A caça às bóias é invenção do jogo.",
    "h1": "Bóias"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The fog of the Draug",
    "sub": "In the fog, steer the boat (drag, use the mouse or the arrow keys) to the six golden buoys. The Draug drifts slowly behind you and shows only when near. Do not let it catch you.",
    "perdeu": "The Draug caught the boat",
    "v1": "Buoys safe!",
    "v2": "In Norwegian tradition, the draug is the spirit of a drowned man seen at sea and in fog. The buoy hunt is made up for the game.",
    "h1": "Buoys"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Draugens tåke",
    "sub": "I tåka styrer du båten (dra, bruk musa eller piltastene) til de seks gylne bøyene. Draugen driver sakte etter deg og vises bare når den er nær. Ikke la den ta deg igjen.",
    "perdeu": "Draugen tok båten",
    "v1": "Bøyene er i sikkerhet!",
    "v2": "I norsk tradisjon er draugen ånden til en druknet mann, sett på havet og i tåka. Bøyejakten er diktet opp for spillet.",
    "h1": "Bøyer"
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
    var N = 6, PS = 200, grace = 0;
    var p = { x: 0, y: 0 }, d = { x: 0, y: 0 }, tx = 0, ty = 0, buoys = [], got = 0, kx = 0, ky = 0, kk = false;
    function reset() {
      st = 'play'; got = 0; grace = 2.5; p = { x: api.w * 0.5, y: api.h * 0.5 }; tx = p.x; ty = p.y; kk = false; kx = ky = 0;
      d = { x: p.x + (Math.random() < 0.5 ? -1 : 1) * 320, y: p.y + (Math.random() - 0.5) * 100 }; d.x = Math.max(40, Math.min(api.w - 40, d.x));
      buoys = []; for (var i = 0; i < N; i++) { var b, n = 0; do { b = { x: 50 + Math.random() * (api.w - 100), y: 90 + Math.random() * (api.h - 140) }; n++; } while (n < 60 && (Math.hypot(b.x - d.x, b.y - d.y) < 160 || Math.hypot(b.x - p.x, b.y - p.y) < 90)); buoys.push(b); }
    }
    function ds() { return (st === 'play' && grace > 0) ? 0 : 60 + got * 7; }
    return {
      pausar: function () { kx = ky = 0; kk = false; },
      dbg: function () { return { st: st, p: { x: p.x, y: p.y }, d: { x: d.x, y: d.y }, got: got, ds: ds(), w: api.w, h: api.h, buoys: buoys.map(function (b) { return { x: b.x, y: b.y }; }) }; },
      down: function (x, y) { if (menu()) return; tx = x; ty = y; kk = false; },
      move: function (x, y) { if (st === 'play') { tx = x; ty = y; kk = false; } },
      key: function (c, dn) { if (c === 'ArrowLeft' || c === 'KeyA') kx = dn ? -1 : (kx < 0 ? 0 : kx); else if (c === 'ArrowRight' || c === 'KeyD') kx = dn ? 1 : (kx > 0 ? 0 : kx); else if (c === 'ArrowUp' || c === 'KeyW') ky = dn ? -1 : (ky < 0 ? 0 : ky); else if (c === 'ArrowDown' || c === 'KeyS') ky = dn ? 1 : (ky > 0 ? 0 : ky); else if (dn && st !== 'play' && (c === 'Space' || c === 'Enter')) menu(); kk = !!(kx || ky); },
      update: function (dt) {
        if (st !== 'play') return;
        if (kk) { var l = Math.hypot(kx, ky) || 1; p.x += kx / l * PS * dt; p.y += ky / l * PS * dt; tx = p.x; ty = p.y; }
        else { var dx = tx - p.x, dy = ty - p.y, dd = Math.hypot(dx, dy); if (dd > 3) { var m = Math.min(dd, PS * dt); p.x += dx / dd * m; p.y += dy / dd * m; } }
        p.x = Math.max(16, Math.min(api.w - 16, p.x)); p.y = Math.max(16, Math.min(api.h - 16, p.y));
        if (grace > 0) grace -= dt; var ex = p.x - d.x, ey = p.y - d.y, ed = Math.hypot(ex, ey) || 1; d.x += ex / ed * ds() * dt; d.y += ey / ed * ds() * dt;
        if (ed < 24) { st = 'lose'; return; }
        for (var i = buoys.length - 1; i >= 0; i--) if (Math.hypot(buoys[i].x - p.x, buoys[i].y - p.y) < 30) { buoys.splice(i, 1); got++; }
        if (got >= N) st = 'win';
      },
      draw: function () {
        var W = api.w, H = api.h;
        bg('#1b3a46', '#0d1f28');
        buoys.forEach(function (b) { g.fillStyle = '#ffd88a'; g.beginPath(); g.arc(b.x, b.y, 11, 0, 6.29); g.fill(); g.fillStyle = '#c0392b'; g.fillRect(b.x - 11, b.y - 2, 22, 4); });
        var dd = Math.hypot(d.x - p.x, d.y - p.y);
        if (dd < 190) { g.globalAlpha = Math.min(1, (190 - dd) / 80); g.fillStyle = '#6a8a7a'; g.beginPath(); g.arc(d.x, d.y - 8, 18, 0, 6.29); g.fill(); g.fillRect(d.x - 18, d.y - 8, 36, 26); g.fillStyle = '#0a1418'; g.fillRect(d.x - 9, d.y - 12, 5, 5); g.fillRect(d.x + 4, d.y - 12, 5, 5); g.fillStyle = '#4a3a2a'; g.fillRect(d.x - 30, d.y + 18, 60, 8); g.globalAlpha = 1; }
        g.fillStyle = '#8a5a2a'; g.beginPath(); g.moveTo(p.x - 18, p.y); g.lineTo(p.x + 18, p.y); g.lineTo(p.x + 11, p.y + 12); g.lineTo(p.x - 11, p.y + 12); g.fill(); g.fillStyle = '#f3ecd2'; g.fillRect(p.x - 1, p.y - 20, 3, 20); g.fillRect(p.x - 12, p.y - 18, 12, 12);
        var f = g.createRadialGradient(p.x, p.y, 70, p.x, p.y, 190); f.addColorStop(0, 'rgba(180,200,205,0)'); f.addColorStop(1, 'rgba(170,190,196,.93)'); g.fillStyle = f; g.fillRect(0, 0, W, H);
        hud(T.h1 + ' ' + got + '/' + N);
        fim(st);
      }
    };
  }
});
