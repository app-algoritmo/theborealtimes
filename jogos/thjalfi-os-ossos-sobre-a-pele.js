/* Thjálfi e Röskva — os ossos sobre a pele (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-thjalfi',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os ossos sobre a pele",
    "sub": "Thor pediu que os ossos dos bodes fossem postos sobre as peles. Os ossos passam pela mesa. Toque nos ossos curtos e brancos para pô-los sobre a pele. O osso da coxa é o longo, com pontas vermelhas: não toque nele, porque Thjálfi o quebrou. Tocar no osso da coxa é erro. Ponha 14 ossos sobre a pele antes do tempo acabar. Três erros encerram o jogo.",
    "perdeu": "O osso foi quebrado",
    "v1": "As peles estão cobertas!",
    "v2": "Na Edda em prosa, Thjálfi quebra o osso da coxa de um dos bodes de Thor, e por isso Thor leva Thjálfi e Röskva como servos. Os ossos que passam pela mesa e o ritmo do jogo são invenção.",
    "h1": "Ossos",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador.",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The bones on the hide",
    "sub": "Thor asked that the bones of the goats be laid on the hides. The bones pass along the table. Tap the short white bones to lay them on the hide. The thigh bone is the long one with red ends: do not touch it, because Thjálfi broke it. Tapping the thigh bone is a mistake. Lay 14 bones on the hide before time runs out. Three mistakes end the game.",
    "perdeu": "The bone was broken",
    "v1": "The hides are covered!",
    "v2": "In the Prose Edda, Thjálfi breaks the thigh bone of one of Thor's goats, and for that Thor takes Thjálfi and Röskva as servants. The bones passing along the table and the rhythm of the game are invention.",
    "h1": "Bones",
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser.",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Beina på skinnet",
    "sub": "Tor ba om at beina fra bukkene ble lagt på skinnene. Beina passerer langs bordet. Trykk på de korte hvite beina for å legge dem på skinnet. Lårbeinet er det lange med røde ender: ikke rør det, for Thjálfi knuste det. Å trykke på lårbeinet er en feil. Legg 14 bein på skinnet før tiden er ute. Tre feil avslutter spillet.",
    "perdeu": "Beinet ble knust",
    "v1": "Skinnene er dekket!",
    "v2": "I Snorres Edda knuser Thjálfi lårbeinet til en av Tors bukker, og derfor tar Tor Thjálfi og Röskva som tjenere. Beina som passerer langs bordet, og rytmen i spillet er oppdiktet.",
    "h1": "Bein",
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
    var CFG = {"sky": 2759700, "fog": [30, 80], "hemi": [16767392, 2759700], "sun": 16763008, "sunPos": [4, 22, 14], "cam": [0, 5.2, 7.2], "look": [0, 0.5, 0.6], "fov": 58, "fovP": 72, "target": 14, "maxe": 3, "total": 120, "bgA": "#0e2335", "bgB": "#050b12"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-thjalfi');
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
      var B = [], spT = 0.6, P = [];
      function sp() { return 1.9 + Math.min(score, 12) * 0.07; }
      function mkBone(k) {
        var gr = new TH.Group(), m;
        if (k === 0) {
          m = new TH.Mesh(new TH.CylinderGeometry(0.13, 0.13, 1.0, 7), mat(0xf4efe0)); m.rotation.z = Math.PI / 2; gr.add(m);
          m = new TH.Mesh(new TH.SphereGeometry(0.22, 6, 5), mat(0xf4efe0)); m.position.x = 0.5; gr.add(m);
          m = new TH.Mesh(new TH.SphereGeometry(0.22, 6, 5), mat(0xf4efe0)); m.position.x = -0.5; gr.add(m);
        } else {
          m = new TH.Mesh(new TH.CylinderGeometry(0.2, 0.2, 2.1, 7), mat(0xe8dcb8)); m.rotation.z = Math.PI / 2; gr.add(m);
          m = new TH.Mesh(new TH.SphereGeometry(0.36, 6, 5), mat(0xc83a2a)); m.position.x = 1.05; gr.add(m);
          m = new TH.Mesh(new TH.SphereGeometry(0.36, 6, 5), mat(0xc83a2a)); m.position.x = -1.05; gr.add(m);
        }
        gr.scale.set(1.3, 1.3, 1.3); return gr;
      }
      function scr() { var o = []; for (var i = 0; i < B.length; i++) o.push(toScr(B[i].x, 0.5, B[i].z)); return o; }
      return {
        init: function () {
          var m;
          m = new TH.Mesh(new TH.PlaneGeometry(60, 40), mat(0x3a2a1c)); m.rotation.x = -Math.PI / 2; m.position.set(0, -0.05, -4); scene.add(m);
          m = new TH.Mesh(new TH.BoxGeometry(13, 0.3, 4.6), mat(0x7a5230)); m.position.set(0, 0.0, 0.4); scene.add(m);
          m = new TH.Mesh(new TH.BoxGeometry(11, 0.12, 2.0), mat(0xa89068)); m.position.set(0, 0.2, 4.4); scene.add(m);
          m = new TH.Mesh(new TH.PlaneGeometry(40, 14), mat(0x24160e)); m.position.set(0, 6, -8); scene.add(m);
          m = new TH.Mesh(new TH.SphereGeometry(1.5, 10, 6, 0, 6.283, 0, 1.5708), mat(0x3a3a42)); m.position.set(-9, 0, -4); scene.add(m);
          m = new TH.Mesh(new TH.SphereGeometry(0.7, 8, 6), new TH.MeshBasicMaterial({ color: 0xff9a30 })); m.position.set(-9, 1.3, -4); scene.add(m);
        },
        start: function () { for (var i = 0; i < B.length; i++) drop(B[i].m); B = []; spT = 0.6; P = []; },
        logic: function (dt) {
          var i;
          spT -= dt;
          if (spT <= 0) {
            var k = Math.random() < 0.55 ? 1 : 0, z = Math.random() < 0.5 ? -0.8 : 1.5, m = mkBone(k);
            m.position.set(-5.8, 0.5, z); scene.add(m); B.push({ m: m, x: -5.8, z: z, k: k }); spT = Math.max(0.5, 0.95 - score * 0.035);
          }
          for (i = B.length - 1; i >= 0; i--) { B[i].x += sp() * dt; if (B[i].x > 5.8) { drop(B[i].m); B.splice(i, 1); } }
        },
        down: function (x, y) {
          var P2 = scr(), i = nearest(P2, x, y, Math.max(40, 0.12 * Math.min(api.w, api.h)));
          if (i < 0) return; var b = B[i];
          if (b.k === 0) { burst(b.x, 0.8, b.z, 12, 2.2, 1, 0.95, 0.8, 3); good(); } else { burst(b.x, 0.8, b.z, 14, 2.6, 1, 0.3, 0.2, 3); bad(); }
          drop(b.m); B.splice(i, 1);
        },
        cam: function (sk) { var f = fit(); setCam(sk, 5.2 + 3 * (f - 1), 7.2 * f, 0, 0.5, 0.6); },
        anim: function (dt) { for (var i = 0; i < B.length; i++) { B[i].m.position.set(B[i].x, 0.5 + Math.abs(Math.sin(sceneT * 5 + i)) * 0.05, B[i].z); } this.cam(camShake(dt)); },
        dbg: function () {
          var pos = scr(), ord = [];
          for (var i = 0; i < B.length; i++) if (B[i].k === 0 && Math.abs(B[i].x) < 4.6) ord.push(pos[i]);
          if (!pos.length) pos = [{ x: api.w / 2, y: api.h / 2 }];
          return { pos: pos, ord: ord };
        }
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
