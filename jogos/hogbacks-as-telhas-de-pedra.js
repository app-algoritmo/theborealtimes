/* Hogbacks — as telhas de pedra (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-hogbacks',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As telhas de pedra",
    "sub": "O escultor está cobrindo o telhado de um hogback com telhas em padrão repetido. Olhe a fileira de peças: falta a última. Toque, na mesa, na peça que continua o padrão, ou use as teclas 1, 2 e 3. Peça errada é erro, e deixar o tempo da rodada acabar também é erro. Complete 12 fileiras antes do tempo acabar. Três erros encerram o jogo.",
    "perdeu": "O telhado ficou torto",
    "v1": "Padrão certo!",
    "v2": "Os hogbacks são lápides em forma de casa feitas entre os séculos X e XII no norte da Inglaterra e no sudoeste da Escócia, muitas com telhas esculpidas nos lados. Os padrões de peças do jogo são invenção.",
    "h1": "Fileiras",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador.",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The stone tiles",
    "sub": "The sculptor is covering the roof of a hogback with tiles in a repeating pattern. Look at the row of pieces: the last one is missing. Tap, on the table, the piece that continues the pattern, or use keys 1, 2 and 3. A wrong piece is a mistake, and letting the round time run out is also a mistake. Complete 12 rows before time runs out. Three mistakes end the game.",
    "perdeu": "The roof came out crooked",
    "v1": "Pattern right!",
    "v2": "Hogbacks are house-shaped gravestones made between the tenth and twelfth centuries in northern England and southwest Scotland, many with carved shingles on the sides. The patterns of pieces in the game are invention.",
    "h1": "Rows",
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser.",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Steinsinglene",
    "sub": "Billedhuggeren dekker taket på en hogback med singler i et gjentatt mønster. Se på rekken med brikker: den siste mangler. Trykk på bordet på brikken som fortsetter mønsteret, eller bruk tastene 1, 2 og 3. En feil brikke er en feil, og å la rundens tid gå ut er også en feil. Fullfør 12 rekker før tiden er ute. Tre feil avslutter spillet.",
    "perdeu": "Taket ble skjevt",
    "v1": "Riktig mønster!",
    "v2": "Hogbacks er hus-formede gravsteiner laget mellom 900- og 1100-tallet i Nord-England og Sørvest-Skottland, mange med utskårne singler på sidene. Mønstrene av brikker i spillet er oppdiktet.",
    "h1": "Rekker",
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
    var CFG = {"sky": 4082274, "fog": [30, 90], "hemi": [14739700, 4209200], "sun": 16773336, "sunPos": [-8, 28, 12], "cam": [0, 7, 9], "look": [0, 1.4, -0.5], "fov": 58, "fovP": 72, "target": 12, "maxe": 3, "total": 110, "bgA": "#0e2335", "bgB": "#050b12"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-hogbacks');
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
      var COL = [0xc84a3a, 0x3a7ad8, 0xe8b43a], seq = [], ans = 0, nT = 0, nLim = 7, gap = 0.7, active = false, slots = [], P = [], prev = '';
      function cx(i) { return (i - 2.5) * 1.9; }
      function px(i) { return (i - 1) * 3.2; }
      function scr() { var o = []; for (var i = 0; i < 3; i++) o.push(toScr(px(i), 0.9, 2.2)); return o; }
      function piece(k, sc) {
        var m;
        if (k === 0) m = new TH.Mesh(new TH.ConeGeometry(0.7, 1.4, 5), mat(COL[0]));
        else if (k === 1) m = new TH.Mesh(new TH.BoxGeometry(1.1, 1.1, 1.1), mat(COL[1]));
        else m = new TH.Mesh(new TH.SphereGeometry(0.62, 10, 8), mat(COL[2]));
        m.scale.setScalar(sc); return m;
      }
      function newQ() {
        var p = Math.random() < 0.5 ? 2 : 3, base = [0, 1, 2], i, j, t;
        for (i = 2; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); t = base[i]; base[i] = base[j]; base[j] = t; }
        var key; seq = []; for (i = 0; i < 6; i++) seq.push(base[i % p]); ans = seq[5];
        key = seq.join(''); if (key === prev) { return newQ(); } prev = key;
        active = true; nT = 0;
        for (i = 0; i < 6; i++) { var m = slots[i]; if (m.userData.mesh) { m.remove(m.userData.mesh); m.userData.mesh = null; } if (i < 5) { var pc = piece(seq[i], 1); pc.position.y = 0.7; m.add(pc); m.userData.mesh = pc; } }
      }
      function pick(i) {
        if (!active) return;
        if (i === ans) { burst(cx(5), 2, -2.4, 18, 3, 1, 0.9, 0.5, 3); var m = slots[5], pc = piece(ans, 1); pc.position.y = 0.7; m.add(pc); m.userData.mesh = pc; active = false; gap = 0.6; good(); }
        else bad();
      }
      return {
        init: function () {
          var i, m;
          m = new TH.Mesh(new TH.PlaneGeometry(70, 50), mat(0x6a7a58)); m.rotation.x = -Math.PI / 2; m.position.set(0, 0, -6); scene.add(m);
          m = new TH.Mesh(new TH.SphereGeometry(1, 14, 10, 0, 6.283, 0, 1.5708), mat(0x8a8a90)); m.scale.set(6.6, 1.6, 2.4); m.position.set(0, 0.2, -2.4); scene.add(m);
          for (i = 0; i < 6; i++) { var s = new TH.Group(), b = new TH.Mesh(new TH.BoxGeometry(1.6, 0.2, 1.6), mat(0x5a5a62)); b.position.y = 1.5; s.add(b); s.position.set(cx(i), 0.9, -2.4); scene.add(s); slots.push(s); s.children[0].position.y = 0.9; s.userData = {}; }
          for (i = 0; i < 3; i++) { m = new TH.Mesh(new TH.BoxGeometry(2.4, 0.4, 2.4), mat(0x6a5a48)); m.position.set(px(i), 0.2, 2.2); scene.add(m); var pc = piece(i, 1); pc.position.set(px(i), 1.0, 2.2); scene.add(pc); }
          m = new TH.Mesh(new TH.BoxGeometry(5, 0.5, 4), mat(0x5a4a38)); m.position.set(0, 0.0, 2.2); m.scale.x = 2.6; scene.add(m);
        },
        start: function () { active = false; gap = 0.8; prev = ''; for (var i = 0; i < 6; i++) { var m = slots[i]; if (m.userData.mesh) { m.remove(m.userData.mesh); m.userData.mesh = null; } } P = scr(); },
        logic: function (dt) {
          nLim = Math.max(4.4, 7 - score * 0.2);
          if (active) { nT += dt; if (nT >= nLim) { active = false; gap = 0.7; bad(); } }
          else { gap -= dt; if (gap <= 0) newQ(); }
        },
        down: function (x, y) { if (!P.length) P = scr(); var i = nearest(P, x, y, Math.max(34, 0.13 * Math.min(api.w, api.h))); if (i >= 0) pick(i); },
        key: function (c, d) { if (!d) return; var n = { Digit1: 0, Digit2: 1, Digit3: 2 }[c]; if (n !== undefined) pick(n); },
        cam: function (sk) { var f = fit(); setCam(sk, 7 + 3 * (f - 1), 9 * f, 0, 1.2, -0.5); },
        anim: function (dt) {
          for (var i = 0; i < 6; i++) { var m = slots[i]; m.children[0].material.color.setHex(i === 5 && active ? 0xffd870 : 0x5a5a62); }
          this.cam(camShake(dt)); P = scr();
        },
        dbg: function () { return { need: active ? ans : -1, pos: scr() }; }
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
