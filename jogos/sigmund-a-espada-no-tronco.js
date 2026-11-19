/* Sigmund — a espada no tronco (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-sigmundgram',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A espada no tronco",
    "sub": "Na grande sala, uma espada está cravada no tronco do Branstock. Para puxá-la, alterne as mãos: toque do lado esquerdo e depois do direito, ou use as setas esquerda e direita. Dois toques seguidos do mesmo lado escorregam a mão e contam como erro. Se você parar por muito tempo, a espada afunda um pouco. Faça 18 puxões antes do tempo acabar. Três escorregões encerram o jogo.",
    "perdeu": "A espada não saiu",
    "v1": "A espada saiu!",
    "v2": "Na Saga dos Volsungos, um velho de um olho só crava uma espada no tronco da sala e só Sigmund consegue arrancá-la. Os puxões alternados são invenção.",
    "h1": "Puxões",
    "h2": "Escorregões",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador."
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The sword in the trunk",
    "sub": "In the great hall, a sword is thrust into the trunk of the Branstock. To pull it out, alternate your hands: tap the left side and then the right, or use the left and right arrow keys. Two taps in a row on the same side slip your hand and count as a mistake. If you stop for too long, the sword sinks back a little. Make 18 pulls before time runs out. Three slips end the game.",
    "perdeu": "The sword would not come",
    "v1": "The sword came free!",
    "v2": "In the Saga of the Völsungs, a one-eyed old man thrusts a sword into the trunk in the hall, and only Sigmund can pull it out. The alternating pulls are invented.",
    "h1": "Pulls",
    "h2": "Slips",
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser."
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Sverdet i stammen",
    "sub": "I den store hallen står et sverd stukket inn i stammen på Branstock. For å dra det ut bytter du hånd: trykk på venstre side og så på høyre, eller bruk venstre og høyre piltast. To trykk på rad på samme side får hånden til å skli og teller som en feil. Hvis du stopper for lenge, synker sverdet litt tilbake. Gjør 18 drag før tiden er ute. Tre glipp avslutter spillet.",
    "perdeu": "Sverdet ville ikke løsne",
    "v1": "Sverdet kom løs!",
    "v2": "I Volsungesaga stikker en enøyd gammel mann et sverd inn i stammen i hallen, og bare Sigmund klarer å dra det ut. De vekslende draga er oppfunnet.",
    "h1": "Drag",
    "h2": "Glipp",
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
    var SRC = '/g/three.min.js?v=1';
    var CFG = {"sky": 2759186, "fog": [30, 80], "hemi": [16767392, 2759184], "sun": 16763008, "sunPos": [8, 20, 14], "cam": [0, 5, 10], "look": [0, 3.5, 0], "fov": 58, "fovP": 72, "target": 18, "maxe": 3, "total": 70, "bgA": "#0e2335", "bgB": "#050b12"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-sigmundgram');
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
      var last = 0, idle = 0, hands = [0, 0], sword, trunk, lamp = [], flick = 0;
      function pull(side) {
        if (last !== 0 && last === side) { last = 0; idle = 0; flick = 0.3; bad(); return; }
        last = side; idle = 0; hands[side < 0 ? 0 : 1] = 0.18; good();
      }
      return {
        init: function () {
          var i, m;
          m = new TH.Mesh(new TH.PlaneGeometry(60, 40), mat(0x5a3d22)); m.rotation.x = -Math.PI / 2; m.position.set(0, 0, -4); scene.add(m);
          m = new TH.Mesh(new TH.PlaneGeometry(60, 24), mat(0x3a2616)); m.position.set(0, 10, -9); scene.add(m);
          for (i = -2; i <= 2; i++) { m = new TH.Mesh(new TH.BoxGeometry(0.7, 20, 0.7), mat(0x2a1a0e)); m.position.set(i * 8, 8, -8.5); scene.add(m); }
          trunk = new TH.Group();
          var t = new TH.Mesh(new TH.CylinderGeometry(0.85, 1.1, 8, 9), mat(0x6b4a28)); t.position.y = 4; trunk.add(t);
          for (i = 0; i < 6; i++) { var br = new TH.Mesh(new TH.CylinderGeometry(0.12, 0.28, 3.2, 5), mat(0x5a3a20)); br.position.set(Math.cos(i * 1.05) * 1.5, 7.2 + (i % 2) * 0.8, Math.sin(i * 1.05) * 1.5); br.rotation.z = Math.cos(i * 1.05) * 0.9; br.rotation.x = -Math.sin(i * 1.05) * 0.9; trunk.add(br); var lf = new TH.Mesh(new TH.SphereGeometry(0.9, 6, 5), mat(0x4a7a2a)); lf.position.set(Math.cos(i * 1.05) * 2.6, 8.4 + (i % 2) * 0.8, Math.sin(i * 1.05) * 2.6); trunk.add(lf); }
          trunk.position.set(0, 0, -2); scene.add(trunk);
          sword = new TH.Group();
          var bl = new TH.Mesh(new TH.BoxGeometry(0.28, 3.2, 0.06), mat(0xdfe6ee, { shininess: 90 })); bl.position.y = 1.6; sword.add(bl);
          var gd = new TH.Mesh(new TH.BoxGeometry(1.5, 0.22, 0.22), mat(0xc9a24a)); gd.position.y = 3.3; sword.add(gd);
          var hl = new TH.Mesh(new TH.CylinderGeometry(0.1, 0.1, 0.9, 6), mat(0x5a3818)); hl.position.y = 3.9; sword.add(hl);
          var pm = new TH.Mesh(new TH.SphereGeometry(0.2, 6, 5), mat(0xc9a24a)); pm.position.y = 4.4; sword.add(pm);
          sword.position.set(0, 2.6, -0.95); scene.add(sword);
          for (i = -1; i <= 1; i += 2) { var fl = new TH.Mesh(new TH.SphereGeometry(0.35, 8, 6), new TH.MeshBasicMaterial({ color: 0xffb84a })); fl.position.set(i * 8, 2.4, -6); scene.add(fl); lamp.push(fl); }
          for (i = 0; i < 2; i++) { var hd = new TH.Mesh(new TH.SphereGeometry(0.4, 8, 6), mat(0xe8c9a0)); hd.position.set(i ? 1.6 : -1.6, 3.1, 0.6); scene.add(hd); hands[i] = 0; lamp.push(hd); }
        },
        start: function () { last = 0; idle = 0; hands = [0, 0]; flick = 0; },
        logic: function (dt) {
          idle += dt; if (idle > 1.4) { idle = 0; prog(-1); }
          if (flick > 0) flick -= dt;
          for (var i = 0; i < 2; i++) if (hands[i] > 0) hands[i] -= dt;
        },
        down: function (x) { pull(x < api.w / 2 ? -1 : 1); },
        key: function (c, d) { if (!d) return; if (c === 'ArrowLeft' || c === 'KeyA') pull(-1); else if (c === 'ArrowRight' || c === 'KeyD') pull(1); },
        cam: function (sk) { var f = fit(); setCam(sk, 5 + 2 * (f - 1), 10 * f, 0, 3.5, 0); },
        anim: function (dt) {
          var k = Math.min(1, score / CFG.target);
          sword.position.y = 2.6 + k * 2.4 + (flick > 0 ? -0.2 : 0); sword.rotation.z = Math.sin(sceneT * 30) * 0.02 * (hands[0] > 0 || hands[1] > 0 ? 1 : 0) + (last * -0.04);
          trunk.rotation.z = Math.sin(sceneT * 28) * 0.012 * ((hands[0] > 0 || hands[1] > 0) ? 1 : 0);
          lamp[0].scale.setScalar(1 + Math.sin(sceneT * 9) * 0.15); lamp[1].scale.setScalar(1 + Math.sin(sceneT * 8 + 1) * 0.15);
          lamp[2].position.y = 3.1 + (hands[0] > 0 ? 0.35 : 0); lamp[3].position.y = 3.1 + (hands[1] > 0 ? 0.35 : 0);
          this.cam(camShake(dt));
        },
        dbg: function () { return { last: last, pos: [{ x: api.w * 0.25, y: api.h * 0.5 }, { x: api.w * 0.75, y: api.h * 0.5 }] }; }
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
