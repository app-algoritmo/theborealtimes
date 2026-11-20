/* Osborn — as lebres do rei (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-osborn',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As lebres do rei",
    "sub": "Osborn guarda as lebres do rei no campo. De vez em quando uma lebre fica alaranjada e corre para a beira do campo. Toque nela, ou use as teclas de 1 a 5, para chamá-la de volta com a flauta. Tocar numa lebre que está quieta espanta o rebanho e é erro. Lebre que chega à beira do campo também é erro. Chame de volta 12 lebres antes do tempo acabar. Três erros encerram o jogo.",
    "perdeu": "As lebres fugiram",
    "v1": "Lebres de volta!",
    "v2": "No conto de Asbjørnsen na tradução de Dasent, Osborn guarda as lebres do rei com uma flauta mágica que dispersa e reúne o que ele quiser. As lebres que fogem para a beira do campo são invenção.",
    "h1": "Lebres",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador.",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The king's hares",
    "sub": "Osborn keeps the king's hares in the field. Now and then a hare turns orange and runs for the edge of the field. Tap it, or use keys 1 to 5, to call it back with the pipe. Tapping a hare that is resting scares the herd and is a mistake. A hare that reaches the edge of the field is also a mistake. Call back 12 hares before time runs out. Three mistakes end the game.",
    "perdeu": "The hares ran off",
    "v1": "Hares called back!",
    "v2": "In Asbjørnsen's tale in Dasent's translation, Osborn keeps the king's hares with a magic pipe that scatters and gathers whatever he wishes. The hares that run for the edge of the field are invention.",
    "h1": "Hares",
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser.",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Kongens harer",
    "sub": "Osborn vokter kongens harer på marka. Av og til blir en hare oransje og løper mot kanten av marka. Trykk på den, eller bruk tastene 1 til 5, for å kalle den tilbake med pipa. Å trykke på en hare som hviler, skremmer flokken og er en feil. En hare som kommer til kanten av marka, er også en feil. Kall tilbake 12 harer før tiden er ute. Tre feil avslutter spillet.",
    "perdeu": "Harene stakk av",
    "v1": "Harene er kalt tilbake!",
    "v2": "I Asbjørnsens eventyr i Dasents oversettelse vokter Osborn kongens harer med en magisk pipe som sprer og samler det han vil. Harene som løper mot kanten av marka, er oppdiktet.",
    "h1": "Harer",
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
    var CFG = {"sky": 4086408, "fog": [30, 90], "hemi": [14741759, 4217392], "sun": 16774352, "sunPos": [8, 30, 10], "cam": [0, 7, 9], "look": [0, 0.6, -0.5], "fov": 58, "fovP": 72, "target": 12, "maxe": 3, "total": 100, "bgA": "#0e2335", "bgB": "#050b12"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-osborn');
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
      var EDGE = 8.6, HX = [-6, -3, 0, 3, 6], HZ = [-1.6, 0.9, -0.4, 1.4, -1.2], hares = [], spawn = 0, P = [];
      function scr() { var o = []; for (var i = 0; i < 5; i++) o.push(toScr(hares.length ? hares[i].x : HX[i], 0.9, HZ[i])); return o; }
      function tap(i) {
        var h = hares[i];
        if (!h || h.cd > 0) return;
        if (h.flee) { h.flee = false; h.x = HX[i] + (Math.random() - 0.5) * 1.5; burst(h.x, 1, HZ[i], 14, 2.6, 0.6, 0.9, 1, 3); good(); }
        else { h.cd = 0.5; burst(h.x, 1, HZ[i], 8, 2, 1, 0.5, 0.4, 2); bad(); }
      }
      return {
        init: function () {
          var i, m;
          m = new TH.Mesh(new TH.PlaneGeometry(90, 60), mat(0x4f8a3a)); m.rotation.x = -Math.PI / 2; m.position.set(0, -0.05, -12); scene.add(m);
          m = new TH.Mesh(new TH.PlaneGeometry(19, 6.4), mat(0x62a04a)); m.rotation.x = -Math.PI / 2; m.position.set(0, 0, -0.1); scene.add(m);
          for (i = 0; i < 12; i++) { m = new TH.Mesh(new TH.BoxGeometry(0.2, 0.9, 0.2), mat(0x7a5a38)); m.position.set(-9.6 + i * 1.75, 0.45, 3.4); scene.add(m); }
          m = new TH.Mesh(new TH.BoxGeometry(5, 4, 3), mat(0xb8b4a8)); m.position.set(0, 2, -13); scene.add(m);
          for (i = 0; i < 4; i++) { m = new TH.Mesh(new TH.BoxGeometry(1.2, 6, 1.2), mat(0xa8a498)); m.position.set(-3 + i * 2, 4.5, -13); scene.add(m); }
          for (i = 0; i < 5; i++) {
            var hr = new TH.Group(), b = new TH.Mesh(new TH.SphereGeometry(0.7, 8, 6), mat(0xd8d0c0)); b.scale.set(1.2, 0.9, 1); b.position.y = 0.7; hr.add(b);
            var hd = new TH.Mesh(new TH.SphereGeometry(0.38, 8, 6), mat(0xd8d0c0)); hd.position.set(0.85, 1.1, 0); hr.add(hd);
            for (var s = -1; s <= 1; s += 2) { var e = new TH.Mesh(new TH.ConeGeometry(0.14, 0.9, 4), mat(0xd8d0c0)); e.position.set(0.8, 1.8, s * 0.16); hr.add(e); }
            hr.position.set(HX[i], 0, HZ[i]); scene.add(hr); hares.push({ g: hr, body: b, x: HX[i], flee: false, dir: 1, cd: 0 });
          }
        },
        start: function () { for (var i = 0; i < 5; i++) { hares[i].x = HX[i]; hares[i].flee = false; hares[i].cd = 0; } spawn = 1.0; P = scr(); },
        logic: function (dt) {
          spawn -= dt;
          if (spawn <= 0) { var c = []; for (var i = 0; i < 5; i++) if (!hares[i].flee) c.push(i); if (c.length > 2) { var k = c[Math.floor(Math.random() * c.length)]; hares[k].flee = true; hares[k].dir = hares[k].x >= 0 ? 1 : -1; } spawn = Math.max(0.85, 1.5 - score * 0.05); }
          for (i = 0; i < 5; i++) {
            var h = hares[i]; if (h.cd > 0) h.cd -= dt;
            if (h.flee) { h.x += h.dir * (2.9 + Math.min(score, 12) * 0.1) * dt; if (Math.abs(h.x) > EDGE) { h.flee = false; h.x = HX[i]; bad(); } }
          }
        },
        down: function (x, y) { P = scr(); var i = nearest(P, x, y, Math.max(34, 0.1 * Math.min(api.w, api.h))); if (i >= 0) tap(i); },
        key: function (c, d) { if (!d) return; var n = { Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3, Digit5: 4 }[c]; if (n !== undefined) tap(n); },
        cam: function (sk) { var f = fit(); setCam(sk, 7 + 3 * (f - 1), 9 * f, 0, 0.6, -0.5); },
        anim: function (dt) {
          for (var i = 0; i < 5; i++) { var h = hares[i]; h.g.position.x = h.x; h.g.rotation.y = h.flee ? (h.dir > 0 ? 0 : Math.PI) : Math.sin(sceneT + i) * 0.4; h.g.position.y = h.flee ? Math.abs(Math.sin(sceneT * 14 + i)) * 0.35 : 0; h.body.material.color.setHex(h.flee ? 0xe8883a : 0xd8d0c0); }
          this.cam(camShake(dt)); P = scr();
        },
        dbg: function () { var f = []; for (var i = 0; i < 5; i++) if (hares[i].flee) f.push(i); return { flee: f, pos: scr() }; }
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
