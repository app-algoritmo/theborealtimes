/* A Mulher Contrária — contra a corrente (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-contraria',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Contra a corrente",
    "sub": "Reme rio acima, contra a corrente. Toque no lado esquerdo da tela para remar com o remo esquerdo e no lado direito para o remo direito. Alterne os lados, um depois do outro: remar duas vezes seguidas do mesmo lado é erro. Avance 100 metros antes do tempo acabar. Três erros encerram o jogo.",
    "perdeu": "A correnteza venceu",
    "v1": "Rio acima!",
    "v2": "No conto, o marido procura a mulher rio acima e a acha acima de uma cachoeira, boiando contra a corrente. A remada é invenção.",
    "h1": "Metros",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador.",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Against the stream",
    "sub": "Row upriver, against the current. Tap the left side of the screen to row with the left oar and the right side for the right oar. Alternate the sides, one after the other: rowing twice in a row on the same side is a mistake. Advance 100 metres before time runs out. Three mistakes end the game.",
    "perdeu": "The current won",
    "v1": "Upriver!",
    "v2": "In the tale, the husband searches upstream and finds his wife above a waterfall, floating against the current. The rowing is invented.",
    "h1": "Metres",
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser.",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Mot strømmen",
    "sub": "Ro oppover elva, mot strømmen. Trykk på venstre side av skjermen for å ro med venstre åre og på høyre side for høyre åre. Bytt side, den ene etter den andre: å ro to ganger på rad på samme side er en feil. Kom 100 meter fram før tiden er ute. Tre feil avslutter spillet.",
    "perdeu": "Strømmen vant",
    "v1": "Oppover elva!",
    "v2": "I eventyret leter mannen oppover elva og finner kona over en foss, flytende mot strømmen. Roingen er oppfunnet.",
    "h1": "Meter",
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
    var CFG = {"sky": 2112074, "fog": [30, 110], "hemi": [12638440, 2109472], "sun": 16773328, "sunPos": [15, 40, 10], "cam": [0, 5.5, 9], "look": [0, 0.5, -12], "fov": 58, "fovP": 72, "target": 100, "maxe": 3, "total": 75, "bgA": "#0e2335", "bgB": "#050b12"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-contraria');
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
      var v = 0, last = 0, boat, oarL, oarR, trees = [], foam = [], sl = 0, sr = 0, gate, dist = 0;
      return {
        init: function () {
          var i, m;
          m = new TH.Mesh(new TH.PlaneGeometry(14, 260), mat(0x2a6a8c, { shininess: 60 })); m.rotation.x = -Math.PI / 2; m.position.set(0, -0.2, -110); scene.add(m);
          for (i = -1; i <= 1; i += 2) { m = new TH.Mesh(new TH.PlaneGeometry(40, 260), mat(0x3a5a2c)); m.rotation.x = -Math.PI / 2; m.position.set(i * 27, -0.1, -110); scene.add(m); }
          for (i = 0; i < 26; i++) { var t = new TH.Group(), tr = new TH.Mesh(new TH.CylinderGeometry(0.25, 0.3, 1.6, 6), mat(0x5a3d22)); tr.position.y = 0.8; t.add(tr); var cn = new TH.Mesh(new TH.ConeGeometry(1.6, 4, 7), mat(0x2f6a3a)); cn.position.y = 3.2; t.add(cn); t.position.set((i % 2 ? 1 : -1) * (9 + (i % 4) * 2.5), 0, -i * 8); scene.add(t); trees.push(t); }
          for (i = 0; i < 18; i++) { m = new TH.Mesh(new TH.BoxGeometry(0.8, 0.05, 0.12), new TH.MeshBasicMaterial({ color: 0xcfe8f4 })); m.position.set((Math.random() - 0.5) * 11, 0, -i * 11); scene.add(m); foam.push(m); }
          boat = new TH.Group(); var sh = new TH.Shape(); sh.moveTo(0, -2.2); sh.bezierCurveTo(1.0, -1.2, 1.0, 1.2, 0, 2.0); sh.bezierCurveTo(-1.0, 1.2, -1.0, -1.2, 0, -2.2);
          var hg = new TH.ExtrudeGeometry(sh, { depth: 0.5, bevelEnabled: false }); hg.rotateX(-Math.PI / 2); var hl = new TH.Mesh(hg, mat(0x8a5a2c)); hl.position.y = -0.05; boat.add(hl);
          var pb = new TH.Mesh(new TH.CylinderGeometry(0.3, 0.38, 0.9, 8), mat(0xc0562a)); pb.position.set(0, 0.8, 0.2); boat.add(pb);
          var ph = new TH.Mesh(new TH.SphereGeometry(0.28, 8, 6), mat(0xe8c9a0)); ph.position.set(0, 1.45, 0.2); boat.add(ph);
          oarL = new TH.Group(); var ol = new TH.Mesh(new TH.BoxGeometry(2.6, 0.08, 0.22), mat(0x6b4a2c)); ol.position.x = -1.3; oarL.add(ol); oarL.position.set(-0.8, 0.7, 0.2); boat.add(oarL);
          oarR = new TH.Group(); var orr = new TH.Mesh(new TH.BoxGeometry(2.6, 0.08, 0.22), mat(0x6b4a2c)); orr.position.x = 1.3; oarR.add(orr); oarR.position.set(0.8, 0.7, 0.2); boat.add(oarR);
          scene.add(boat);
          gate = new TH.Group(); for (i = -1; i <= 1; i += 2) { var p = new TH.Mesh(new TH.CylinderGeometry(0.2, 0.2, 5, 6), mat(0xf0c050)); p.position.set(i * 6.5, 2.5, 0); gate.add(p); }
          var bn = new TH.Mesh(new TH.BoxGeometry(13, 1, 0.1), mat(0xb3382c)); bn.position.y = 4.4; gate.add(bn); scene.add(gate);
        },
        start: function () { v = 0; last = 0; sl = 0; sr = 0; dist = 0; },
        logic: function (dt) {
          v += (-1.4 - 0.64 * v) * dt; if (v < -3) v = -3;
          dist = Math.max(0, dist + v * dt); var d = dist - score; prog(d);
          if (sl > 0) sl -= dt; if (sr > 0) sr -= dt;
        },
        down: function (x) {
          var side = x < api.w / 2 ? -1 : 1;
          if (side === last) { bad(); api.nota(110, 0.15, 'sawtooth', 0.06); return; }
          last = side; v += 3.0; api.nota(240 + (side > 0 ? 40 : 0), 0.1, 'sine', 0.05);
          if (side < 0) sl = 0.3; else sr = 0.3; if (R) burst(side * 1.4, 0.2, 0.8, 6, 1.5, 0.7, 0.9, 1, 1);
        },
        anim: function (dt) {
          var i;
          for (i = 0; i < trees.length; i++) { var t = trees[i]; t.position.z += v * dt; if (t.position.z > 12) t.position.z -= 208; if (t.position.z < -196) t.position.z += 208; }
          for (i = 0; i < foam.length; i++) { var f = foam[i]; f.position.z += (v + 2.2) * dt; if (f.position.z > 12) f.position.z -= 198; if (f.position.z < -186) f.position.z += 198; }
          boat.position.y = Math.sin(sceneT * 2.2) * 0.06; boat.rotation.z = Math.sin(sceneT * 1.7) * 0.03 + (sl > 0 ? 0.03 : 0) - (sr > 0 ? 0.03 : 0);
          oarL.rotation.y = sl > 0 ? Math.sin((0.3 - sl) / 0.3 * Math.PI) * 0.7 : 0; oarR.rotation.y = sr > 0 ? -Math.sin((0.3 - sr) / 0.3 * Math.PI) * 0.7 : 0;
          gate.position.z = -(100 - dist) * 1.0 - 4;
          var sk = camShake(dt); setCam(sk, 5.5, 9, 0, 0.5, -12);
        },
        dbg: function () { return { v: v, last: last, dist: dist, pos: [{ x: 100, y: 200 }, { x: api.w - 100, y: 200 }] }; }
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
