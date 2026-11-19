/* Gjellestad — a travessia do navio (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-gjellestad',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A travessia do navio",
    "sub": "Conduza o navio pelo mar do norte. Segure o lado esquerdo ou o direito da tela para virar, ou use as setas, A e D. Colete as runas douradas e desvie das rochas e do gelo à deriva. Reúna 10 runas antes do tempo acabar. Três erros afundam o navio.",
    "perdeu": "A travessia falhou",
    "v1": "Terra à vista!",
    "v2": "Em Gjellestad, na Noruega, um georadar achou um navio viking enterrado. A travessia pelo mar é invenção.",
    "h1": "Runas",
    "h2": "Erros",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador."
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The ship crossing",
    "sub": "Steer the ship across the northern sea. Hold the left or right side of the screen to turn, or use the arrow keys, A and D. Collect the golden runes and dodge the drifting rocks and ice. Gather 10 runes before time runs out. Three mistakes sink the ship.",
    "perdeu": "The crossing failed",
    "v1": "Land in sight!",
    "v2": "At Gjellestad, in Norway, a georadar found a buried Viking ship. The sea crossing is invented.",
    "h1": "Runes",
    "h2": "Mistakes",
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser."
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Seilasen over havet",
    "sub": "Styr skipet over det nordlige havet. Hold på venstre eller høyre side av skjermen for å svinge, eller bruk piltastene, A og D. Samle de gylne runene og styr unna drivende steiner og is. Samle 10 runer før tiden er ute. Tre feil senker skipet.",
    "perdeu": "Overfarten mislyktes",
    "v1": "Land i sikte!",
    "v2": "På Gjellestad i Norge fant georadar et nedgravd vikingskip. Seilasen over havet er oppfunnet.",
    "h1": "Runer",
    "h2": "Feil",
    "h3": "Tid",
    "carregando": "Laster 3D…",
    "sem3d": "Denne enheten kunne ikke vise 3D-grafikk. Prøv en annen nettleser."
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
    var SRC = '/g/three.min.js?v=1', TARGET = 10, TOTAL = 75, MAXE = 3;
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var R = null, scene, camera, ship, sea, seaGeo, seaPos, seaBase, sail, sailPos, sailBase, moonLight, pts, pGeo, pPos, pCol, pVel, pBase, pLife, pMax, pIdx = 0, NP = 360;
    var rockMat, iceMat, runeMat, snap = null, endT = 0, sceneT = 0;
    var GS = { x: 0, vx: 0, speed: 16, time: TOTAL, score: 0, lives: 3, spawnT: 0, hitCd: 0, shake: 0, flash: 0, scroll: 0 };
    var lastObs = null, items = [], input = { l: false, r: false, ptr: 0 }, cvEl = HEAD ? null : document.getElementById('jogo-gjellestad');
    function wave(x, z, t) { return Math.sin(x * 0.22 + t * 1.2) * 0.35 + Math.sin(z * 0.17 + t * 0.9) * 0.42 + Math.sin((x + z) * 0.11 + t * 0.6) * 0.3; }
    function rndr(a, b) { return a + Math.random() * (b - a); }

    /* ---------- carga do Three.js, só no primeiro toque ---------- */
    function loadThree() {
      if (ls >= 1) return; ls = 1;
      function ok() { try { init3d(); ls = 2; } catch (e) { ls = 3; } }
      if (window.THREE) { ok(); return; }
      var s = document.createElement('script'); s.src = SRC; s.onload = ok; s.onerror = function () { ls = 3; }; document.head.appendChild(s);
    }
    if (cvEl) cvEl.addEventListener('pointerdown', loadThree, { once: true });
    if (cvEl && window.IntersectionObserver) { /* nada é baixado antes do toque */ }

    function init3d() {
      var TH = window.THREE;
      R = new TH.WebGLRenderer({ antialias: true, alpha: false });
      scene = new TH.Scene(); var SKY = 0x0a1824; scene.background = new TH.Color(SKY); scene.fog = new TH.Fog(SKY, 30, 105);
      camera = new TH.PerspectiveCamera(58, 1, 0.1, 220);
      scene.add(new TH.HemisphereLight(0x8fb4d0, 0x10202c, 0.75));
      moonLight = new TH.DirectionalLight(0xdfeaff, 0.9); moonLight.position.set(-30, 40, -40); scene.add(moonLight);
      var moon = new TH.Mesh(new TH.SphereGeometry(5, 20, 14), new TH.MeshBasicMaterial({ color: 0xeef3ff, fog: false })); moon.position.set(-45, 38, -150); scene.add(moon);
      var sg = new TH.BufferGeometry(), sp = [], i;
      for (i = 0; i < 400; i++) { var a = Math.random() * 6.283, e = 0.12 + Math.random() * 1.1, rr0 = 190; sp.push(Math.cos(a) * Math.cos(e) * rr0, Math.sin(e) * rr0 * 0.9 + 5, -Math.abs(Math.sin(a)) * Math.cos(e) * rr0 - 20); }
      sg.setAttribute('position', new TH.Float32BufferAttribute(sp, 3));
      scene.add(new TH.Points(sg, new TH.PointsMaterial({ color: 0xffffff, size: 1.3, sizeAttenuation: false, fog: false })));
      seaGeo = new TH.PlaneGeometry(160, 200, 52, 64); seaGeo.rotateX(-Math.PI / 2); seaPos = seaGeo.attributes.position; seaBase = new Float32Array(seaPos.array);
      sea = new TH.Mesh(seaGeo, new TH.MeshPhongMaterial({ color: 0x1b4663, shininess: 20, specular: 0x1c3446, flatShading: true })); sea.position.z = -60; scene.add(sea);
      ship = new TH.Group();
      var wood = new TH.MeshPhongMaterial({ color: 0x6b3f22, flatShading: true }), dark = new TH.MeshPhongMaterial({ color: 0x3a2312, flatShading: true });
      var sh0 = new TH.Shape(); sh0.moveTo(0, -2.4); sh0.bezierCurveTo(1.15, -1.3, 1.15, 1.3, 0, 2.4); sh0.bezierCurveTo(-1.15, 1.3, -1.15, -1.3, 0, -2.4);
      var hullGeo = new TH.ExtrudeGeometry(sh0, { depth: 0.55, bevelEnabled: false }); hullGeo.rotateX(-Math.PI / 2);
      var hull = new TH.Mesh(hullGeo, wood); hull.position.y = -0.1; ship.add(hull);
      var bow = new TH.Mesh(new TH.ConeGeometry(0.22, 1.5, 6), dark); bow.position.set(0, 0.85, -2.3); bow.rotation.x = -0.35; ship.add(bow);
      var head = new TH.Mesh(new TH.SphereGeometry(0.28, 8, 6), dark); head.position.set(0, 1.62, -2.55); ship.add(head);
      var stern = new TH.Mesh(new TH.ConeGeometry(0.2, 1.2, 6), dark); stern.position.set(0, 0.65, 2.3); stern.rotation.x = 0.3; ship.add(stern);
      var mast = new TH.Mesh(new TH.CylinderGeometry(0.07, 0.09, 3.6, 8), dark); mast.position.set(0, 1.8, 0); ship.add(mast);
      var yard = new TH.Mesh(new TH.CylinderGeometry(0.05, 0.05, 2.4, 6), dark); yard.rotation.z = Math.PI / 2; yard.position.set(0, 3.2, 0); ship.add(yard);
      var cv = document.createElement('canvas'); cv.width = 128; cv.height = 128; var cx = cv.getContext('2d');
      for (var k = 0; k < 6; k++) { cx.fillStyle = k % 2 ? '#e9e2cf' : '#b3382c'; cx.fillRect(k * 21.4, 0, 22, 128); }
      sail = new TH.Mesh(new TH.PlaneGeometry(2.3, 1.9, 6, 4), new TH.MeshPhongMaterial({ map: new TH.CanvasTexture(cv), side: TH.DoubleSide, flatShading: true })); sail.position.set(0, 2.2, 0); ship.add(sail);
      sailPos = sail.geometry.attributes.position; sailBase = new Float32Array(sailPos.array);
      for (var s = -3; s <= 3; s++) { if (s === 0) continue; var sd = new TH.Mesh(new TH.CylinderGeometry(0.26, 0.26, 0.06, 10), new TH.MeshPhongMaterial({ color: s % 2 ? 0xc9a24a : 0x2f5d7a })); sd.rotation.z = Math.PI / 2; sd.position.set(0.97, 0.42, s * 0.5); ship.add(sd); var sd2 = sd.clone(); sd2.position.x = -0.97; ship.add(sd2); }
      scene.add(ship);
      rockMat = new TH.MeshPhongMaterial({ color: 0x59616a, flatShading: true });
      iceMat = new TH.MeshPhongMaterial({ color: 0xbfe6f5, flatShading: true, shininess: 90, transparent: true, opacity: 0.92 });
      runeMat = new TH.MeshPhongMaterial({ color: 0xf0c050, emissive: 0xb07a10, flatShading: true });
      pPos = new Float32Array(NP * 3); pCol = new Float32Array(NP * 3); pVel = new Float32Array(NP * 3); pBase = new Float32Array(NP * 3); pLife = new Float32Array(NP); pMax = new Float32Array(NP);
      for (i = 0; i < NP; i++) pPos[i * 3 + 1] = -100;
      pGeo = new TH.BufferGeometry(); pGeo.setAttribute('position', new TH.BufferAttribute(pPos, 3)); pGeo.setAttribute('color', new TH.BufferAttribute(pCol, 3));
      var dc = document.createElement('canvas'); dc.width = dc.height = 32; var dx = dc.getContext('2d'), dgr = dx.createRadialGradient(16, 16, 0, 16, 16, 16);
      dgr.addColorStop(0, 'rgba(255,255,255,1)'); dgr.addColorStop(1, 'rgba(255,255,255,0)'); dx.fillStyle = dgr; dx.fillRect(0, 0, 32, 32);
      pts = new TH.Points(pGeo, new TH.PointsMaterial({ size: 0.32, map: new TH.CanvasTexture(dc), vertexColors: true, transparent: true, depthWrite: false, blending: TH.AdditiveBlending })); pts.frustumCulled = false; scene.add(pts);
      resize();
    }
    function resize() {
      if (!R) return;
      var ratio = Math.min(window.devicePixelRatio || 1, 1.5), W = api.px || 800, H = api.py || 450;
      while (W * H * ratio * ratio > 1800000 && ratio > 0.6) ratio -= 0.1;
      R.setPixelRatio(1); R.setSize(Math.max(64, Math.round(W * ratio)), Math.max(64, Math.round(H * ratio)), false);
      camera.aspect = W / H; camera.fov = W / H < 0.8 ? 72 : 58; camera.updateProjectionMatrix(); snap = null;
    }
    function emit(x, y, z, vx, vy, vz, r, gg, b, life) {
      if (!R) return; var i = pIdx = (pIdx + 1) % NP, k = i * 3;
      pPos[k] = x; pPos[k + 1] = y; pPos[k + 2] = z; pVel[k] = vx; pVel[k + 1] = vy; pVel[k + 2] = vz; pBase[k] = r; pBase[k + 1] = gg; pBase[k + 2] = b; pLife[i] = pMax[i] = life;
    }
    function burst(x, y, z, n, spd, r, gg, b, up) { for (var q = 0; q < n; q++) { var a = Math.random() * 6.283, e = Math.random(); emit(x, y, z, Math.cos(a) * spd * e, up + Math.random() * spd, Math.sin(a) * spd * e, r, gg, b, 0.6 + Math.random() * 0.6); } }
    function stepParticles(dt) {
      for (var i = 0; i < NP; i++) {
        if (pLife[i] <= 0) continue; var k = i * 3; pLife[i] -= dt;
        if (pLife[i] <= 0) { pPos[k + 1] = -100; continue; }
        pVel[k + 1] -= 9 * dt; pPos[k] += pVel[k] * dt; pPos[k + 1] += pVel[k + 1] * dt; pPos[k + 2] += pVel[k + 2] * dt;
        var f = pLife[i] / pMax[i]; pCol[k] = pBase[k] * f; pCol[k + 1] = pBase[k + 1] * f; pCol[k + 2] = pBase[k + 2] * f;
      }
      pGeo.attributes.position.needsUpdate = true; pGeo.attributes.color.needsUpdate = true;
    }

    /* ---------- lógica ---------- */
    function mkMesh(kind) {
      var TH = window.THREE, m;
      if (kind === 'rune') { m = new TH.Mesh(new TH.OctahedronGeometry(0.75, 0), runeMat); m.scale.y = 1.5; }
      else if (kind === 'rock') { m = new TH.Mesh(new TH.DodecahedronGeometry(1.5, 0), rockMat); m.scale.set(1, 0.8 + Math.random() * 0.5, 1); }
      else { m = new TH.Mesh(new TH.IcosahedronGeometry(1.6, 0), iceMat); m.scale.set(1.1, 0.7, 0.9); }
      m.rotation.y = Math.random() * 6; scene.add(m); return m;
    }
    function spawn(z) {
      var r = Math.random(), kind = r < 0.36 ? 'rune' : r < 0.68 ? 'rock' : 'ice', rad = kind === 'rune' ? 1.1 : kind === 'rock' ? 1.35 : 1.5;
      var xx = (Math.random() * 2 - 1) * 13;
      if (kind !== 'rune') { for (var tr = 0; tr < 10 && lastObs && GS.time - lastObs.t < 1.1 && Math.abs(xx - lastObs.x) < 6.5; tr++) xx = (Math.random() * 2 - 1) * 13; lastObs = { x: xx, t: GS.time }; }
      var it = { kind: kind, rad: rad, x: xx, z: z, ph: Math.random() * 6, mesh: null };
      if (R) { it.mesh = mkMesh(kind); it.mesh.position.set(it.x, 0, z); }
      items.push(it);
    }
    function clearItems() { items.forEach(function (it) { if (it.mesh) { scene.remove(it.mesh); it.mesh.geometry.dispose(); } }); items = []; }
    function start() {
      clearItems(); lastObs = null; GS.x = 0; GS.vx = 0; GS.speed = 16; GS.time = TOTAL; GS.score = 0; GS.lives = 3; GS.spawnT = 0.4; GS.hitCd = 0; GS.shake = 0; GS.flash = 0; endT = 0; snap = null;
      st = 'play'; api.nota(98, 1.2, 'sawtooth', 0.05); api.nota(147, 1.2, 'sawtooth', 0.035);
    }
    function fin(won) {
      st = won ? 'win' : 'lose'; endT = 0;
    }
    function menuTap() {
      if (st === 'win') { st = 'menu'; return true; }
      if (st === 'menu' || st === 'lose') { if (ls < 2) { if (ls === 0) loadThree(); return true; } start(); return true; }
      return false;
    }
    function stepLogic(dt) {
      var dir = (input.r || input.ptr > 0 ? 1 : 0) - (input.l || input.ptr < 0 ? 1 : 0);
      GS.vx += (dir * 13 - GS.vx) * Math.min(1, dt * 4); GS.x = Math.max(-14, Math.min(14, GS.x + GS.vx * dt));
      GS.time -= dt; GS.speed = 16 + (TOTAL - GS.time) * 0.12;
      if (GS.time <= 0) { GS.time = 0; fin(false); return; }
      GS.spawnT -= dt;
      if (GS.spawnT <= 0) { spawn(-95); GS.spawnT = Math.max(0.32, 0.85 - (TOTAL - GS.time) * 0.009) * (0.7 + Math.random() * 0.6); }
      if (GS.hitCd > 0) GS.hitCd -= dt;
      for (var j = items.length - 1; j >= 0; j--) {
        var it = items[j]; it.z += GS.speed * dt;
        if (Math.abs(it.z) < 2.6) {
          var dx = it.x - GS.x, dz = it.z;
          if (Math.sqrt(dx * dx + dz * dz * 0.45) < it.rad + 0.7) {
            if (it.kind === 'rune') {
              GS.score++; GS.flash = 0.25; api.nota(988, 0.35, 'sine', 0.09); api.nota(1480, 0.4, 'sine', 0.06);
              if (it.mesh) { burst(it.mesh.position.x, it.mesh.position.y, it.mesh.position.z, 24, 4.5, 1, 0.8, 0.3, 3); scene.remove(it.mesh); it.mesh.geometry.dispose(); }
              items.splice(j, 1); if (GS.score >= TARGET) { fin(true); return; } continue;
            }
            if (GS.hitCd <= 0) {
              GS.lives--; GS.hitCd = 1.2; GS.shake = 0.5; GS.flash = 0.3; api.nota(80, 0.4, 'sine', 0.2); api.nota(180, 0.25, 'sawtooth', 0.06);
              if (it.mesh) burst(it.mesh.position.x, it.mesh.position.y + 0.5, it.mesh.position.z, 34, 6, it.kind === 'ice' ? 0.6 : 0.5, it.kind === 'ice' ? 0.85 : 0.45, it.kind === 'ice' ? 1 : 0.4, 4);
              if (GS.lives <= 0) { fin(false); return; }
            }
          }
        }
        if (it.z > 12) { if (it.mesh) { scene.remove(it.mesh); it.mesh.geometry.dispose(); } items.splice(j, 1); }
      }
    }
    function stepScene(dt, cruise) {
      sceneT += dt; GS.scroll += cruise * dt;
      var i, T2 = sceneT;
      for (i = 0; i < seaPos.count; i++) seaPos.setY(i, wave(seaBase[i * 3], seaBase[i * 3 + 2] - GS.scroll - 60, T2));
      seaPos.needsUpdate = true; seaGeo.computeVertexNormals();
      items.forEach(function (it) {
        var m = it.mesh; if (!m) return; m.position.x = it.x; m.position.z = it.z;
        m.position.y = wave(it.x, it.z - GS.scroll, T2) * 0.6 + 0.3 + Math.sin(T2 * 1.6 + it.ph) * 0.12;
        if (it.kind === 'rune') { m.rotation.y += dt * 2.2; m.position.y += 0.9; }
      });
      var wy = wave(GS.x, -GS.scroll, T2);
      ship.position.set(GS.x, wy * 0.6 + 0.15, 0);
      ship.rotation.z = -GS.vx * 0.014 + Math.sin(T2 * 1.1) * 0.05; ship.rotation.x = Math.sin(T2 * 0.9 + 1) * 0.04; ship.rotation.y = -GS.vx * 0.015;
      ship.visible = !(GS.hitCd > 0 && Math.floor(T2 * 14) % 2 === 0);
      for (i = 0; i < sailPos.count; i++) { var sx = sailBase[i * 3], sy = sailBase[i * 3 + 1]; sailPos.setZ(i, Math.sin(T2 * 2 + sx * 2 + sy) * 0.08 + (sy + 0.95) * 0.12); }
      sailPos.needsUpdate = true;
      var shake = GS.shake > 0 ? (GS.shake -= dt, (Math.random() - 0.5) * 0.35 * GS.shake) : 0;
      camera.position.set(GS.x * 0.85 + shake, 5.4 + wy * 0.3, 10.5); camera.lookAt(GS.x * 0.85, 1.4, -14);
      var fl = GS.flash > 0 ? (GS.flash -= dt, GS.flash) : 0; moonLight.intensity = 0.9 + fl * 2;
      for (var w = 0; w < 2; w++) { var side = Math.random() < 0.5 ? -1 : 1; emit(GS.x + side * (0.7 + Math.random() * 0.3), ship.position.y - 0.1, 2.2 + Math.random() * 0.6, side * (0.5 + Math.random()), 0.8 + Math.random() * 0.8, cruise * 0.9, 0.55, 0.75, 0.9, 0.8); }
      stepParticles(dt);
    }

    function reset() { st = 'menu'; }
    return {
      pausar: function () { input.l = input.r = false; input.ptr = 0; },
      resize: resize,
      dbg: function () { return { st: st, lvl: 0, pend: 0, x: GS.x, vx: GS.vx, speed: GS.speed, time: GS.time, score: GS.score, lives: GS.lives, target: TARGET, items: items.map(function (it) { return { kind: it.kind, x: it.x, z: it.z, rad: it.rad }; }), pos: [{ x: 60, y: 200 }, { x: api.w - 60, y: 200 }], ls: ls }; },
      down: function (x, y) {
        if (menuTap()) return;
        if (st === 'play') input.ptr = x < api.w / 2 ? -1 : 1;
      },
      move: function (x, y, pr) { if (st === 'play' && pr) input.ptr = x < api.w / 2 ? -1 : 1; },
      up: function () { input.ptr = 0; },
      key: function (c, d) {
        if (c === 'ArrowLeft' || c === 'KeyA') input.l = d; else if (c === 'ArrowRight' || c === 'KeyD') input.r = d;
        else if (d && (c === 'Space' || c === 'Enter') && st !== 'play') menuTap();
      },
      update: function (dt) {
        if (st === 'play') { stepLogic(dt); if (R && st !== 'menu') stepScene(dt, GS.speed); }
        else if (R && (st === 'win' || st === 'lose')) { endT += dt; if (endT < 2.5) stepScene(dt, 5); }
        else if (st === 'win' || st === 'lose') endT += dt;
      },
      draw: function () {
        var W = api.w, H = api.h, live = R && (st === 'play' || ((st === 'win' || st === 'lose') && endT < 2.5));
        if (live) { R.render(scene, camera); g.drawImage(R.domElement, 0, 0, W, H); }
        else if (R && (st === 'win' || st === 'lose')) {
          if (!snap) { snap = document.createElement('canvas'); snap.width = R.domElement.width; snap.height = R.domElement.height; R.render(scene, camera); snap.getContext('2d').drawImage(R.domElement, 0, 0); }
          g.drawImage(snap, 0, 0, W, H);
        } else {
          bg('#0e2335', '#050b12');
          g.fillStyle = '#eef3ff'; g.beginPath(); g.arc(W * 0.2, H * 0.22, Math.min(W, H) * 0.07, 0, 7); g.fill();
          g.fillStyle = '#1b4663'; g.fillRect(0, H * 0.62, W, H * 0.38);
        }
        if (st === 'play') {
          var tt = Math.max(0, Math.ceil(GS.time));
          hud(T.h1 + ' ' + Math.min(GS.score, TARGET) + '/' + TARGET, T.h2 + ' ' + (3 - GS.lives) + '/' + MAXE, true);
          txt(T.h3 + ' ' + tt, 22, 76, 13, '#c9b3f2', 'left');
        }
        if (st === 'menu') api.cartaz(T.titulo, [ls === 3 ? T.sem3d : T.sub], ls === 3 ? T.toque : ls === 1 ? T.carregando : T.toque);
        else fim(st);
      }
    };

  }
});
