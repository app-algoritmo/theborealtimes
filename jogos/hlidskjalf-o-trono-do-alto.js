/* Hliðskjálf — o trono do alto (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-hlidskjalf',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O trono do alto",
    "sub": "Do alto do trono, vigie as cabanas do vale. Quando uma lanterna acender, toque nela antes que apague. Tocar numa cabana apagada é erro, e deixar a luz apagar sozinha também. Acerte 10 luzes antes do tempo acabar. Três erros encerram o jogo.",
    "perdeu": "A vigília falhou",
    "v1": "Nada escapou do trono!",
    "v2": "Nos textos, Odin vê os mundos do assento Hliðskjálf, e Freyr, ao se sentar nele, vê Gerðr. As luzes do vale são invenção.",
    "h1": "Luzes",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador.",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The high seat",
    "sub": "From the high seat, watch the huts of the valley. When a lantern lights up, tap it before it goes out. Tapping a dark hut is a mistake, and letting the light go out alone is one too. Catch 10 lights before time runs out. Three mistakes end the game.",
    "perdeu": "The watch failed",
    "v1": "Nothing escaped the seat!",
    "v2": "In the texts, Odin sees the worlds from the seat Hliðskjálf, and Freyr, sitting in it, sees Gerðr. The lights in the valley are invented.",
    "h1": "Lights",
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser.",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Høysetet",
    "sub": "Fra høysetet følger du med på hyttene i dalen. Når en lykt tennes, trykk på den før den slukker. Å trykke på en mørk hytte er en feil, og det er også å la lyset slukke av seg selv. Fang 10 lys før tiden er ute. Tre feil avslutter spillet.",
    "perdeu": "Vakten sviktet",
    "v1": "Ingenting slapp unna setet!",
    "v2": "I tekstene ser Odin verdenene fra setet Hliðskjálf, og Frøy ser Gerd når han setter seg der. Lysene i dalen er oppfunnet.",
    "h1": "Lys",
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
    var CFG = {"sky": 661040, "fog": [30, 90], "hemi": [8362704, 1054760], "sun": 12110079, "sunPos": [-20, 30, 10], "cam": [0, 6.5, 9], "look": [0, 0, -9], "fov": 58, "fovP": 72, "target": 10, "maxe": 3, "total": 75, "bgA": "#0e2335", "bgB": "#050b12"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-hlidskjalf');
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
      camera.aspect = W / H; camera.fov = W / H < 0.8 ? (CFG.fovP || 72) : (CFG.fov || 58); camera.updateProjectionMatrix(); snap = null;
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
      var hut = [], glow = [], lamp = [], lit = -1, litT = 0, gap = 1, prev = -1, P = [];
      var HP = [[-9, -12], [-4.5, -12], [0, -12], [4.5, -12], [9, -12], [-11, -21], [-5.5, -21], [0, -21], [5.5, -21], [11, -21]];
      function scr() { var o = []; for (var i = 0; i < HP.length; i++) o.push(toScr(HP[i][0], 1.1, HP[i][1])); return o; }
      return {
        init: function () {
          var i, m;
          m = new TH.Mesh(new TH.PlaneGeometry(120, 90), mat(0x1c2f24)); m.rotation.x = -Math.PI / 2; m.position.set(0, -0.2, -25); scene.add(m);
          for (i = 0; i < 12; i++) { m = new TH.Mesh(new TH.ConeGeometry(9 + (i % 3) * 3, 16 + (i % 4) * 5, 5), mat(0x2b3a58)); m.position.set(-60 + i * 11, 4, -52 - (i % 2) * 8); scene.add(m); }
          for (i = 0; i < 10; i++) {
            var g0 = new TH.Group(), b = new TH.Mesh(new TH.BoxGeometry(2.2, 1.4, 2), mat(0x6b4a2c)); b.position.y = 0.7; g0.add(b);
            var r0 = new TH.Mesh(new TH.ConeGeometry(1.9, 1.2, 4), mat(0x3b2a1a)); r0.position.y = 2; r0.rotation.y = Math.PI / 4; g0.add(r0);
            var l0 = new TH.Mesh(new TH.SphereGeometry(0.32, 8, 6), new TH.MeshBasicMaterial({ color: 0x3a3a44 })); l0.position.set(0, 1.1, 1.05); g0.add(l0);
            g0.position.set(HP[i][0], 0, HP[i][1]); scene.add(g0); hut.push(g0); lamp.push(l0);
            var h0 = new TH.Mesh(new TH.SphereGeometry(1.6, 12, 8), new TH.MeshBasicMaterial({ color: 0xffc860, transparent: true, opacity: 0.0, depthWrite: false })); h0.position.set(HP[i][0], 1.1, HP[i][1] + 1.1); scene.add(h0); glow.push(h0);
          }
          var rail = new TH.Mesh(new TH.BoxGeometry(30, 0.5, 0.6), mat(0x4a2f1a)); rail.position.set(0, 3.2, 3.5); scene.add(rail);
          for (i = -2; i <= 2; i++) { var pst = new TH.Mesh(new TH.BoxGeometry(0.5, 2.6, 0.5), mat(0x4a2f1a)); pst.position.set(i * 6, 2, 3.5); scene.add(pst); }
          var sg = new TH.BufferGeometry(), sp = []; for (i = 0; i < 300; i++) { var a = Math.random() * 6.283; sp.push(Math.cos(a) * 150, 25 + Math.random() * 90, -70 - Math.abs(Math.sin(a)) * 60); }
          sg.setAttribute('position', new TH.Float32BufferAttribute(sp, 3)); scene.add(new TH.Points(sg, new TH.PointsMaterial({ color: 0xffffff, size: 1.4, sizeAttenuation: false, fog: false })));
        },
        start: function () { lit = -1; gap = 1; prev = -1; P = scr(); for (var i = 0; i < 10; i++) { lamp[i].material.color.setHex(0x3a3a44); glow[i].material.opacity = 0; } },
        logic: function (dt) {
          var lt = Math.max(1.25, 2.1 - score * 0.07);
          if (lit >= 0) { litT -= dt; if (litT <= 0) { lamp[lit].material.color.setHex(0x3a3a44); glow[lit].material.opacity = 0; lit = -1; gap = 0.7; bad(); } }
          else { gap -= dt; if (gap <= 0) { var k; do { k = Math.floor(Math.random() * 10); } while (k === prev); prev = k; lit = k; litT = lt; lamp[k].material.color.setHex(0xffe08a); glow[k].material.opacity = 0.45; api.nota(520 + k * 40, 0.15, 'triangle', 0.05); } }
        },
        down: function (x, y) {
          if (!P.length) P = scr();
          var i = nearest(P, x, y, Math.max(34, 0.13 * Math.min(api.w, api.h)));
          if (i < 0) return;
          if (i === lit) { burst(HP[i][0], 1.6, HP[i][1] + 1, 26, 4.5, 1, 0.85, 0.4, 3); lamp[i].material.color.setHex(0x3a3a44); glow[i].material.opacity = 0; lit = -1; gap = 0.6; good(); }
          else bad();
        },
        anim: function (dt) {
          if (lit >= 0) glow[lit].material.opacity = 0.35 + 0.15 * Math.sin(sceneT * 9);
          var sk = camShake(dt); setCam(sk, 6.5, 9, 0, 0.6, -9);
          P = scr();
        },
        dbg: function () { return { lit: lit, pos: scr() }; }
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
