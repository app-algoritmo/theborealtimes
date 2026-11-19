/* Absalon — pedras para Havn (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-absalon',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Pedras para Havn",
    "sub": "Conduza o navio de Absalon pelo estreito. Toque do lado esquerdo ou direito da tela, ou use as setas, para mudar de faixa. Recolha os blocos de pedra que flutuam e desvie dos baixios. Reúna 14 blocos para o castelo antes do tempo acabar. Três encalhes encerram o jogo.",
    "perdeu": "O navio encalhou",
    "v1": "O castelo está de pé!",
    "v2": "Em 1167, segundo Saxo, o bispo Absalon fundou um castelo em Havn, na ilha de Slotsholmen, e a cidade de Copenhague cresceu ao redor dele. O estreito cheio de baixios é invenção.",
    "h1": "Blocos",
    "h2": "Encalhes",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador."
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Stones for Havn",
    "sub": "Steer Absalon's ship through the sound. Tap the left or right side of the screen, or use the arrow keys, to change lanes. Collect the floating blocks of stone and steer clear of the shoals. Gather 14 blocks for the castle before time runs out. Three groundings end the game.",
    "perdeu": "The ship ran aground",
    "v1": "The castle stands!",
    "v2": "In 1167, according to Saxo, Bishop Absalon founded a castle at Havn, on the island of Slotsholmen, and the city of Copenhagen grew around it. The sound full of shoals is invented.",
    "h1": "Blocks",
    "h2": "Groundings",
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser."
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Steiner til Havn",
    "sub": "Styr Absalons skip gjennom sundet. Trykk på venstre eller høyre side av skjermen, eller bruk piltastene, for å bytte bane. Samle de flytende steinblokkene og styr unna grunnene. Samle 14 blokker til borgen før tiden er ute. Tre grunnstøtinger avslutter spillet.",
    "perdeu": "Skipet gikk på grunn",
    "v1": "Borgen står!",
    "v2": "I 1167 grunnla biskop Absalon ifølge Saxo en borg ved Havn, på øya Slotsholmen, og byen København vokste fram rundt den. Sundet fullt av grunner er oppfunnet.",
    "h1": "Blokker",
    "h2": "Grunnstøtinger",
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
    var CFG = {"sky": 2770531, "fog": [30, 100], "hemi": [12375276, 1845816], "sun": 16773328, "sunPos": [15, 35, 10], "cam": [0, 4.5, 7], "look": [0, 0.8, -10], "fov": 58, "fovP": 72, "target": 14, "maxe": 3, "total": 90, "bgA": "#0e2335", "bgB": "#050b12"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-absalon');
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
      var LX = [-2.8, 0, 2.8], lane = 1, rows = [], nextZ = -34, ship, castle = [], dash = [], bump = 0, sx = 0;
      function sp() { return 9 + Math.min(score, 14) * 0.25; }
      function mkRow(z) {
        var c = [0, 0, 0], n = Math.random() < 0.5 ? 2 : 1, i, j;
        for (i = 0; i < n; i++) { do { j = Math.floor(Math.random() * 3); } while (c[j] === 2); c[j] = 2; }
        var free = []; for (i = 0; i < 3; i++) if (c[i] === 0) free.push(i);
        if (Math.random() < 0.85) c[free[Math.floor(Math.random() * free.length)]] = 1;
        var r = { z: z, c: c, m: [null, null, null], done: false };
        for (i = 0; i < 3; i++) {
          if (c[i] === 1) { var g0 = new TH.Group(), raft = new TH.Mesh(new TH.BoxGeometry(1.8, 0.2, 1.8), mat(0x6b4a28)); raft.position.y = 0.05; g0.add(raft); var bl = new TH.Mesh(new TH.BoxGeometry(1.2, 0.9, 1.2), mat(0xa6acb6)); bl.position.y = 0.65; g0.add(bl); g0.position.set(LX[i], 0, z); scene.add(g0); r.m[i] = g0; }
          else if (c[i] === 2) { var g1 = new TH.Group(), rk = new TH.Mesh(new TH.DodecahedronGeometry(1.0, 0), mat(0x3a3f4a)); rk.position.y = 0.3; g1.add(rk); var fm = new TH.Mesh(new TH.TorusGeometry(1.25, 0.12, 5, 10), mat(0xe8f2fa)); fm.rotation.x = Math.PI / 2; fm.position.y = 0.0; g1.add(fm); g1.position.set(LX[i], 0, z); scene.add(g1); r.m[i] = g1; }
        }
        rows.push(r);
      }
      function clear() { rows.forEach(function (r) { for (var i = 0; i < 3; i++) if (r.m[i]) scene.remove(r.m[i]); }); rows = []; }
      function step(s) { var nl = Math.max(0, Math.min(2, lane + s)); if (nl !== lane) { lane = nl; api.nota(380, 0.05, 'sine', 0.04); } }
      return {
        init: function () {
          var i, m;
          m = new TH.Mesh(new TH.PlaneGeometry(40, 160), mat(0x1f5a85, { shininess: 60 })); m.rotation.x = -Math.PI / 2; m.position.set(0, -0.2, -60); scene.add(m);
          for (var s = -1; s <= 1; s += 2) { m = new TH.Mesh(new TH.BoxGeometry(14, 1.6, 160), mat(0x4a6a3a)); m.position.set(s * 12.5, 0.2, -60); scene.add(m); for (i = 0; i < 10; i++) { var t = new TH.Mesh(new TH.ConeGeometry(1.3, 4, 6), mat(0x2a5a30)); t.position.set(s * (8.5 + (i % 3) * 3), 3.2, -6 - i * 12); scene.add(t); } }
          for (i = 0; i < 8; i++) { var d = new TH.Mesh(new TH.BoxGeometry(0.5, 0.05, 2.4), mat(0xe8f2fa)); d.position.set(((i % 2) ? 1 : -1) * (1.4 + (i % 3)), -0.1, -i * 7); scene.add(d); dash.push({ m: d, z: -i * 7 }); }
          ship = new TH.Group();
          var hu = new TH.Mesh(new TH.BoxGeometry(1.7, 0.7, 3.6), mat(0x7a4a26)); hu.position.y = 0.35; ship.add(hu);
          var pw = new TH.Mesh(new TH.ConeGeometry(0.85, 1.4, 4), mat(0x7a4a26)); pw.rotation.x = -Math.PI / 2; pw.rotation.z = Math.PI / 4; pw.position.set(0, 0.35, -2.4); ship.add(pw);
          var mk = new TH.Mesh(new TH.CylinderGeometry(0.07, 0.07, 3.2, 5), mat(0x5a3818)); mk.position.y = 2.0; ship.add(mk);
          var sl = new TH.Mesh(new TH.BoxGeometry(1.9, 1.9, 0.05), mat(0xe8e0c8)); sl.position.y = 2.4; ship.add(sl);
          var st = new TH.Mesh(new TH.BoxGeometry(1.9, 0.35, 0.07), mat(0xb3382c)); st.position.y = 2.4; ship.add(st);
          ship.position.set(0, 0, 0); scene.add(ship);
          for (i = 0; i < 14; i++) { var cb = new TH.Mesh(new TH.BoxGeometry(2, 1.1, 2), mat(0x9aa0aa)); cb.position.set(-7 + (i % 7) * 2.3, 1.2 + Math.floor(i / 7) * 1.15, -64); cb.visible = false; scene.add(cb); castle.push(cb); }
        },
        start: function () { clear(); lane = 1; sx = 0; },
        logic: function (dt) {
          var v = sp(), i, r;
          for (i = rows.length - 1; i >= 0; i--) {
            r = rows[i]; r.z += v * dt;
            if (!r.done && r.z >= -0.4) {
              r.done = true; var t = r.c[lane];
              if (t === 1) { scene.remove(r.m[lane]); r.m[lane] = null; burst(LX[lane], 1.4, 0, 16, 3, 0.8, 0.85, 1, 3); good(); }
              else if (t === 2) { burst(LX[lane], 0.8, 0, 22, 4, 0.9, 0.9, 1, 3); bump = 0.4; bad(); }
            }
            if (r.z > 8) { for (var k = 0; k < 3; k++) if (r.m[k]) scene.remove(r.m[k]); rows.splice(i, 1); }
          }
          var far = rows.length ? rows[rows.length - 1].z : -26; while (far > -88) { far -= 7.5; mkRow(far); }
          if (bump > 0) bump -= dt;
        },
        down: function (x) { step(x < api.w / 2 ? -1 : 1); },
        key: function (c, d) { if (!d) return; if (c === 'ArrowLeft' || c === 'KeyA') step(-1); else if (c === 'ArrowRight' || c === 'KeyD') step(1); },
        cam: function (sk) { var f = fit(); setCam(sk, 4.5 + 3 * (f - 1), 7 + 4 * (f - 1), 0, 0.8, -10); },
        anim: function (dt) {
          var i; sx += (LX[lane] - sx) * Math.min(1, dt * 14);
          ship.position.x = sx; ship.position.y = Math.sin(sceneT * 3) * 0.08 + (bump > 0 ? 0.15 : 0); ship.rotation.z = (LX[lane] - sx) * -0.08 + Math.sin(sceneT * 2) * 0.03;
          for (i = 0; i < rows.length; i++) { var r = rows[i]; for (var k = 0; k < 3; k++) if (r.m[k]) { r.m[k].position.z = r.z; r.m[k].position.y = Math.sin(sceneT * 2 + k + i) * 0.06; } }
          for (i = 0; i < dash.length; i++) { dash[i].z += sp() * dt; if (dash[i].z > 8) dash[i].z -= 56; dash[i].m.position.z = dash[i].z; }
          for (i = 0; i < castle.length; i++) castle[i].visible = i < score;
          this.cam(camShake(dt));
        },
        dbg: function () { return { lane: lane, rows: rows.filter(function (r) { return !r.done; }).map(function (r) { return { z: r.z, c: r.c.slice() }; }), pos: [{ x: api.w * 0.25, y: api.h * 0.5 }, { x: api.w * 0.75, y: api.h * 0.5 }] }; }
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
