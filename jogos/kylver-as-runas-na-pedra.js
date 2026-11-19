/* Kylver — as runas na pedra (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-kylver',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A ordem do futhark",
    "sub": "Uma laje de calcário traz doze runas. Veja a fileira de runas na parte de baixo da tela e toque nas pedras na mesma ordem. Na primeira rodada vêm as seis primeiras runas do futhark, f, u, þ, a, r, k; na segunda, as seis seguintes. Runa fora da ordem é erro. Acerte as 12 runas antes do tempo acabar. Três erros encerram o jogo.",
    "perdeu": "A ordem se perdeu",
    "v1": "O futhark está gravado!",
    "v2": "A Pedra de Kylver, de Gotland, de cerca do ano 400, traz o futhark antigo inteiro em ordem, a mais antiga sequência assim conhecida. O jogo com doze runas é invenção.",
    "h1": "Runas",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador.",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The order of the futhark",
    "sub": "A slab of limestone carries twelve runes. Look at the row of runes at the bottom of the screen and tap the stones in the same order. The first round has the first six runes of the futhark, f, u, þ, a, r, k; the second has the next six. A rune out of order is a mistake. Land all 12 runes before time runs out. Three mistakes end the game.",
    "perdeu": "The order was lost",
    "v1": "The futhark is carved!",
    "v2": "The Kylver Stone from Gotland, from about the year 400, carries the whole Elder Futhark in order, the oldest such sequence known. The game with twelve runes is invented.",
    "h1": "Runes",
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser.",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Futharkens rekkefølge",
    "sub": "En kalksteinshelle har tolv runer. Se på raden med runer nederst på skjermen og trykk på steinene i samme rekkefølge. Første runde har de seks første runene i futharken, f, u, þ, a, r, k; andre runde har de neste seks. En rune i feil rekkefølge er en feil. Treff alle 12 runene før tiden er ute. Tre feil avslutter spillet.",
    "perdeu": "Rekkefølgen gikk tapt",
    "v1": "Futharken er risset inn!",
    "v2": "Kylver-steinen fra Gotland, fra omkring år 400, har hele det eldre futharken i rekkefølge, den eldste slike rekken vi kjenner. Spillet med tolv runer er oppfunnet.",
    "h1": "Runer",
    "h3": "Tid",
    "carregando": "Laster 3D…",
    "sem3d": "Denne enheten kunne ikke vise 3D-grafikk. Prøv en annen nettleser.",
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
    var SRC = '/g/three.min.js?v=1';
    var CFG = {"sky": 1581096, "fog": [40, 100], "hemi": [13160672, 2762784], "sun": 16773328, "sunPos": [10, 40, 20], "cam": [0, 11, 7.5], "look": [0, 0, 0.2], "fov": 58, "fovP": 72, "target": 12, "maxe": 3, "total": 100, "bgA": "#0e2335", "bgB": "#050b12"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-kylver');
    var score = 0, errs = 0, time = 0, shake = 0, flash = 0, G = null;
    var input = { l: false, r: false, ptr: 0 };
    var NP = 320, pGeo, pPos, pCol, pVel, pBase, pLife, pMax, pIdx = 0;
    function stub() { var f = function () {}; return new Proxy(f, { get: function (t, k) { return k === Symbol.toPrimitive ? function () { return 0; } : stub(); }, set: function () { return true; }, apply: function () { return stub(); }, construct: function () { return stub(); } }); }
    function rndr(a, b) { return a + Math.random() * (b - a); }
    function mat(c, o) { o = o || {}; var p = { color: c, flatShading: true }; for (var k in o) p[k] = o[k]; return new TH.MeshPhongMaterial(p); }
    function ctex(w, h, fn) { if (HEAD) return null; var c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d'), w, h); return new TH.CanvasTexture(c); }
    function setCam(px, py, pz, lx, ly, lz) { camera.position.set(px, py, pz); camera.lookAt(lx, ly, lz); }
    function toScr(x, y, z) {
      if (HEAD) return { x: api.w / 2 + x * 40, y: api.h * 0.5 + z * 30 - y * 40 };
      camera.updateMatrixWorld(); var v = new TH.Vector3(x, y, z).project(camera); return { x: (v.x + 1) / 2 * api.w, y: (1 - v.y) / 2 * api.h };
    }
    function nearest(list, x, y, rad) { var b = -1, bd = rad * rad; for (var i = 0; i < list.length; i++) { var d = (list[i].x - x) * (list[i].x - x) + (list[i].y - y) * (list[i].y - y); if (d < bd) { bd = d; b = i; } } return b; }
    function fit() { return api.w / api.h < 0.8 ? 1.9 : 1; }
    function drop(m) { if (!m) return; scene.remove(m); if (m.geometry) m.geometry.dispose(); }

    function loadThree() {
      if (ls >= 1) return; ls = 1;
      function ok() { try { TH = window.THREE; initBase(); G.init(); resize(); ls = 2; } catch (e) { ls = 3; if (window.console) console.warn(e); } }
      if (window.THREE) { ok(); return; }
      var s = document.createElement('script'); s.src = SRC; s.onload = ok; s.onerror = function () { ls = 3; }; document.head.appendChild(s);
    }
    if (cvEl) cvEl.addEventListener('pointerdown', loadThree, { once: true });

    function initBase() {
      R = new TH.WebGLRenderer({ antialias: true, alpha: false });
      scene = new TH.Scene(); scene.background = new TH.Color(CFG.sky); if (CFG.fog) scene.fog = new TH.Fog(CFG.sky, CFG.fog[0], CFG.fog[1]);
      camera = new TH.PerspectiveCamera(CFG.fov || 58, 1, 0.1, 300);
      scene.add(new TH.HemisphereLight(CFG.hemi[0], CFG.hemi[1], 0.85));
      sun = new TH.DirectionalLight(CFG.sun, 0.9); sun.position.set(CFG.sunPos[0], CFG.sunPos[1], CFG.sunPos[2]); scene.add(sun);
      setCam(CFG.cam[0], CFG.cam[1], CFG.cam[2], CFG.look[0], CFG.look[1], CFG.look[2]);
      pPos = new Float32Array(NP * 3); pCol = new Float32Array(NP * 3); pVel = new Float32Array(NP * 3); pBase = new Float32Array(NP * 3); pLife = new Float32Array(NP); pMax = new Float32Array(NP);
      for (var i = 0; i < NP; i++) pPos[i * 3 + 1] = -100;
      pGeo = new TH.BufferGeometry(); pGeo.setAttribute('position', new TH.BufferAttribute(pPos, 3)); pGeo.setAttribute('color', new TH.BufferAttribute(pCol, 3));
      var dt = ctex(32, 32, function (x) { var gr = x.createRadialGradient(16, 16, 0, 16, 16, 16); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = gr; x.fillRect(0, 0, 32, 32); });
      var pts = new TH.Points(pGeo, new TH.PointsMaterial({ size: 0.34, map: dt, vertexColors: true, transparent: true, depthWrite: false, blending: TH.AdditiveBlending })); pts.frustumCulled = false; scene.add(pts);
    }
    function resize() {
      if (!R) return;
      var ratio = Math.min(window.devicePixelRatio || 1, 1.5), W = api.px || 800, H = api.py || 450;
      while (W * H * ratio * ratio > 1800000 && ratio > 0.6) ratio -= 0.1;
      R.setPixelRatio(1); R.setSize(Math.max(64, Math.round(W * ratio)), Math.max(64, Math.round(H * ratio)), false);
      camera.aspect = W / H; camera.fov = W / H < 0.8 ? (CFG.fovP || 72) : (CFG.fov || 58); camera.updateProjectionMatrix(); snap = null; if (G && G.cam) G.cam(0);
    }
    function emit(x, y, z, vx, vy, vz, r, gg, b, life) {
      if (!R) return; var i = pIdx = (pIdx + 1) % NP, k = i * 3;
      pPos[k] = x; pPos[k + 1] = y; pPos[k + 2] = z; pVel[k] = vx; pVel[k + 1] = vy; pVel[k + 2] = vz; pBase[k] = r; pBase[k + 1] = gg; pBase[k + 2] = b; pLife[i] = pMax[i] = life;
    }
    function burst(x, y, z, n, spd, r, gg, b, up) { if (!R) return; for (var q = 0; q < n; q++) { var a = Math.random() * 6.283, e = Math.random(); emit(x, y, z, Math.cos(a) * spd * e, up + Math.random() * spd, Math.sin(a) * spd * e, r, gg, b, 0.6 + Math.random() * 0.6); } }
    function stepParticles(dt) {
      if (!R) return;
      for (var i = 0; i < NP; i++) {
        if (pLife[i] <= 0) continue; var k = i * 3; pLife[i] -= dt;
        if (pLife[i] <= 0) { pPos[k + 1] = -100; continue; }
        pVel[k + 1] -= 9 * dt; pPos[k] += pVel[k] * dt; pPos[k + 1] += pVel[k + 1] * dt; pPos[k + 2] += pVel[k + 2] * dt;
        var f = pLife[i] / pMax[i]; pCol[k] = pBase[k] * f; pCol[k + 1] = pBase[k + 1] * f; pCol[k + 2] = pBase[k + 2] * f;
      }
      pGeo.attributes.position.needsUpdate = true; pGeo.attributes.color.needsUpdate = true;
    }
    function fin(won) { st = won ? 'win' : 'lose'; endT = 0; api.nota(won ? 660 : 130, 0.5, won ? 'triangle' : 'sawtooth', 0.08); }
    function good(n) { score += (n || 1); flash = 0.25; api.nota(988, 0.3, 'sine', 0.09); api.nota(1480, 0.35, 'sine', 0.05); if (score >= CFG.target) fin(true); }
    function prog(n) { score = Math.max(0, score + n); if (score >= CFG.target) fin(true); }
    function bad() { errs++; shake = 0.45; api.nota(90, 0.4, 'sine', 0.2); api.nota(200, 0.2, 'sawtooth', 0.05); if (errs >= CFG.maxe) fin(false); }
    function start() {
      score = 0; errs = 0; time = CFG.total; endT = 0; snap = null; shake = 0; flash = 0; input.l = input.r = false; input.ptr = 0;
      st = 'play'; G.start(); api.nota(98, 0.9, 'sawtooth', 0.05); api.nota(147, 0.9, 'sawtooth', 0.035);
    }
    function menuTap() {
      if (st === 'win') { st = 'menu'; return true; }
      if (st === 'menu' || st === 'lose') { if (ls < 2) { if (ls === 0) loadThree(); return true; } start(); return true; }
      return false;
    }
    function reset() { st = 'menu'; }
    function camShake(dt) { if (shake > 0) { shake -= dt; return (Math.random() - 0.5) * 0.5 * shake; } return 0; }

    G = (function () {
      var RUN = [
        [[[.3, .05], [.3, .95]], [[.3, .3], [.75, .1]], [[.3, .55], [.75, .35]]],
        [[[.25, .95], [.25, .05], [.75, .4], [.75, .95]]],
        [[[.3, .05], [.3, .95]], [[.3, .25], [.75, .5], [.3, .75]]],
        [[[.3, .05], [.3, .95]], [[.3, .1], [.75, .4]], [[.3, .4], [.75, .7]]],
        [[[.3, .05], [.3, .95]], [[.3, .05], [.75, .3], [.3, .55]], [[.3, .55], [.75, .95]]],
        [[[.75, .2], [.3, .5], [.75, .8]]],
        [[[.25, .15], [.75, .85]], [[.75, .15], [.25, .85]]],
        [[[.3, .05], [.3, .95]], [[.3, .05], [.75, .28], [.3, .5]]],
        [[[.25, .05], [.25, .95]], [[.75, .05], [.75, .95]], [[.25, .4], [.75, .6]]],
        [[[.5, .05], [.5, .95]], [[.25, .3], [.75, .7]]],
        [[[.5, .05], [.5, .95]]],
        [[[.65, .08], [.3, .3], [.5, .5], [.7, .7], [.35, .92]]]
      ];
      var rm = [], tiles = [], planes = [], layout = [], done = [], seq = [], k = 0, rnd = 0, P = [];
      function rune(c, r, x, y, s, col, lw) {
        c.strokeStyle = col; c.lineWidth = lw; c.lineCap = 'round'; c.lineJoin = 'round';
        for (var i = 0; i < RUN[r].length; i++) { var pl = RUN[r][i]; c.beginPath(); c.moveTo(x + pl[0][0] * s, y + pl[0][1] * s); for (var j = 1; j < pl.length; j++) c.lineTo(x + pl[j][0] * s, y + pl[j][1] * s); c.stroke(); }
      }
      function cx(i) { return (i % 4 - 1.5) * 2.4; }
      function cz(i) { return (Math.floor(i / 4) - 1) * 2.4; }
      function scr() { var o = []; for (var i = 0; i < 12; i++) o.push(toScr(cx(i), 0.3, cz(i))); return o; }
      function newRound() {
        var a = []; for (var i = 0; i < 12; i++) a.push(i);
        for (i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; }
        layout = a; done = []; for (i = 0; i < 12; i++) done.push(false);
        seq = []; for (i = 0; i < 6; i++) seq.push(rnd * 6 + i); k = 0;
        for (i = 0; i < 12; i++) if (planes[i]) planes[i].material = rm[layout[i]];
      }
      function tap(i) {
        if (done[i]) return;
        if (layout[i] === seq[k]) { done[i] = true; burst(cx(i), 0.8, cz(i), 12, 3, 1, 0.9, 0.5, 3); k++; good(); if (k >= 6 && st === 'play') { rnd++; if (rnd < 2) newRound(); } }
        else bad();
      }
      return {
        init: function () {
          var i, m;
          m = new TH.Mesh(new TH.BoxGeometry(12.5, 0.6, 9.5), mat(0x6a707a)); m.position.set(0, -0.4, 0); scene.add(m);
          m = new TH.Mesh(new TH.PlaneGeometry(90, 90), mat(0x1c2018)); m.rotation.x = -Math.PI / 2; m.position.set(0, -0.8, 0); scene.add(m);
          for (i = 0; i < 12; i++) rm.push(new TH.MeshBasicMaterial({ map: ctex(128, 128, function (c, w, h) { c.fillStyle = '#9aa0a8'; c.fillRect(0, 0, w, h); for (var q = 0; q < 70; q++) { c.fillStyle = 'rgba(60,66,76,' + (Math.random() * 0.25) + ')'; c.fillRect(Math.random() * w, Math.random() * h, 3, 3); } rune(c, rm.length, 22, 12, 84, '#2a303a', 9); }) }));
          for (i = 0; i < 12; i++) {
            var t = new TH.Mesh(new TH.BoxGeometry(2.0, 0.35, 2.0), mat(0x7a808a)); t.position.set(cx(i), 0.05, cz(i)); scene.add(t); tiles.push(t);
            var p = new TH.Mesh(new TH.PlaneGeometry(1.8, 1.8), rm[i]); p.rotation.x = -Math.PI / 2; p.position.set(cx(i), 0.24, cz(i)); scene.add(p); planes.push(p);
          }
        },
        start: function () { rnd = 0; newRound(); P = scr(); },
        logic: function (dt) { },
        down: function (x, y) { if (!P.length) P = scr(); var i = nearest(P, x, y, Math.max(28, 0.1 * Math.min(api.w, api.h))); if (i >= 0) tap(i); },
        cam: function (sk) { var f = fit(); setCam(sk, 11 + 6 * (f - 1), 7.5 + 4 * (f - 1), 0, 0, 0.2); },
        anim: function (dt) { for (var i = 0; i < 12; i++) tiles[i].material.color.setHex(done[i] ? 0x4a7a4a : 0x7a808a); this.cam(camShake(dt)); P = scr(); },
        hud: function () {
          var W = api.w, H = api.h, sz = Math.min(40, (W - 30) / 6.4), y0 = H - sz - 12;
          for (var i = 0; i < 6; i++) {
            var x0 = W / 2 + (i - 3) * (sz * 1.07) + sz * 0.035;
            g.fillStyle = i === k ? 'rgba(255,216,138,.95)' : i < k ? 'rgba(80,120,80,.8)' : 'rgba(200,205,215,.85)'; g.fillRect(x0, y0, sz, sz);
            rune(g, seq[i], x0 + sz * 0.12, y0 + sz * 0.08, sz * 0.76, '#1c2028', Math.max(2, sz * 0.09));
          }
        },
        dbg: function () { return { seq: seq.slice(), k: k, layout: layout.slice(), pos: scr() }; }
      };
    })();

    if (HEAD) { TH = stub(); scene = stub(); camera = stub(); G.init(); }
    return {
      pausar: function () { input.l = input.r = false; input.ptr = 0; if (G.pausar) G.pausar(); },
      resize: resize,
      dbg: function () { var d = G.dbg ? G.dbg() : {}; d.st = st; d.score = score; d.errs = errs; d.time = time; d.target = CFG.target; d.maxe = CFG.maxe; d.ls = ls; d.lvl = 0; d.pend = 0; return d; },
      down: function (x, y) { if (menuTap()) return; if (st === 'play') { input.ptr = x < api.w / 2 ? -1 : 1; if (G.down) G.down(x, y); } },
      move: function (x, y, pr) { if (st === 'play' && pr) { input.ptr = x < api.w / 2 ? -1 : 1; if (G.move) G.move(x, y, pr); } },
      up: function () { input.ptr = 0; if (G.up) G.up(); },
      key: function (c, d) {
        if (c === 'ArrowLeft' || c === 'KeyA') input.l = d; else if (c === 'ArrowRight' || c === 'KeyD') input.r = d;
        else if (d && (c === 'Space' || c === 'Enter') && st !== 'play') { menuTap(); return; }
        if (st === 'play' && G.key) G.key(c, d);
      },
      update: function (dt) {
        if (dt > 0.1) dt = 0.1;
        if (st === 'play') {
          time -= dt; if (time <= 0) { time = 0; fin(false); }
          else { sceneT += dt; G.logic(dt); }
          if (R) { G.anim(dt); stepParticles(dt); }
        } else if (R && (st === 'win' || st === 'lose')) { endT += dt; if (endT < 2.5) { sceneT += dt; G.anim(dt * 0.4); stepParticles(dt); } }
        else if (st === 'win' || st === 'lose') endT += dt;
      },
      draw: function () {
        var W = api.w, H = api.h, live = R && (st === 'play' || ((st === 'win' || st === 'lose') && endT < 2.5));
        if (live || (R && st === 'menu' && ls === 2)) { R.render(scene, camera); g.drawImage(R.domElement, 0, 0, W, H); }
        else if (R && (st === 'win' || st === 'lose')) {
          if (!snap) { snap = document.createElement('canvas'); snap.width = R.domElement.width; snap.height = R.domElement.height; R.render(scene, camera); snap.getContext('2d').drawImage(R.domElement, 0, 0); }
          g.drawImage(snap, 0, 0, W, H);
        } else bg(CFG.bgA, CFG.bgB);
        if (st === 'play') {
          hud(T.h1 + ' ' + Math.floor(Math.min(score, CFG.target)) + '/' + CFG.target, T.h2 + ' ' + errs + '/' + CFG.maxe, true);
          txt(T.h3 + ' ' + Math.max(0, Math.ceil(time)), 22, 76, 13, '#c9b3f2', 'left');
          if (G.hud) G.hud();
        }
        if (st === 'menu') api.cartaz(T.titulo, [ls === 3 ? T.sem3d : T.sub], ls === 1 ? T.carregando : T.toque);
        else fim(st);
      }
    };

  }
});
