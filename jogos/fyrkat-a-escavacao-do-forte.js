/* Fyrkat — a escavação do forte (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-fyrkat',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A escavação do forte",
    "sub": "O terreno do forte está dividido em blocos de terra. Toque num bloco para escavar. Cada escavação mostra, em número, quantos achados escondidos há nos blocos vizinhos. Ache todos os objetos escondidos antes de gastar as escavações. Complete 3 sítios antes do tempo acabar. Três sítios perdidos encerram o jogo.",
    "perdeu": "A escavação acabou sem achados",
    "v1": "Escavação concluída!",
    "v2": "Fyrkat foi escavado de 1950 a 1958 e tem 16 casas compridas e cerca de 30 túmulos. Os achados escondidos do jogo são invenção.",
    "h1": "Sítios",
    "h2": "Falhas",
    "h4": "Escavações",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador."
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The dig at the fort",
    "sub": "The ground of the fort is divided into blocks of earth. Tap a block to dig. Each dig shows, as a number, how many hidden finds lie in the neighbouring blocks. Find all the hidden objects before you run out of digs. Complete 3 sites before time runs out. Three lost sites end the game.",
    "perdeu": "The dig ended with no finds",
    "v1": "Dig complete!",
    "v2": "Fyrkat was excavated from 1950 to 1958 and has 16 longhouses and about 30 graves. The hidden finds in the game are invented.",
    "h1": "Sites",
    "h2": "Failures",
    "h4": "Digs",
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser."
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Utgravingen ved borgen",
    "sub": "Grunnen til borgen er delt i jordblokker. Trykk på en blokk for å grave. Hver graving viser med et tall hvor mange skjulte funn som ligger i nabo-blokkene. Finn alle de skjulte gjenstandene før gravingene er brukt opp. Fullfør 3 steder før tiden er ute. Tre tapte steder avslutter spillet.",
    "perdeu": "Utgravingen endte uten funn",
    "v1": "Utgravingen er ferdig!",
    "v2": "Fyrkat ble gravd ut fra 1950 til 1958 og har 16 langhus og omtrent 30 graver. De skjulte funnene i spillet er oppfunnet.",
    "h1": "Steder",
    "h2": "Svikt",
    "h4": "Graving",
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
    var CFG = {"sky": 1844272, "fog": [40, 100], "hemi": [11583688, 2761752], "sun": 16773328, "sunPos": [10, 40, 20], "cam": [0, 12, 10], "look": [0, 0, 0.5], "fov": 58, "fovP": 72, "target": 3, "maxe": 3, "total": 150, "bgA": "#0e2335", "bgB": "#050b12"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-fyrkat');
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
      var R0 = 5, C0 = 6, cells = [], lvl = 0, nf = 3, B = 9, used = 0, found = 0, P = [], fm = [], note = 0;
      var NF = [3, 4, 5], BU = [9, 10, 12];
      function cx(c) { return (c - (C0 - 1) / 2) * 2.2; }
      function cz(r) { return (r - (R0 - 1) / 2) * 2.2; }
      function scr() { var o = []; for (var r = 0; r < R0; r++) for (var c = 0; c < C0; c++) o.push(toScr(cx(c), 0.6, cz(r))); return o; }
      function hint(i) { var r = Math.floor(i / C0), c = i % C0, n = 0; for (var dr = -1; dr <= 1; dr++) for (var dc = -1; dc <= 1; dc++) { if (!dr && !dc) continue; var rr = r + dr, cc = c + dc; if (rr >= 0 && rr < R0 && cc >= 0 && cc < C0 && cells[rr * C0 + cc].find) n++; } return n; }
      function level() {
        nf = NF[Math.min(lvl, 2)]; B = BU[Math.min(lvl, 2)]; used = 0; found = 0;
        for (var i = 0; i < R0 * C0; i++) { var c = cells[i]; c.find = false; c.dug = false; c.h = 0; c.m.position.y = 0; c.m.visible = true; c.m.material.color.setHex(0x6b4a2c); if (c.fm) { c.fm.visible = false; } }
        var k = 0; while (k < nf) { var j = Math.floor(Math.random() * R0 * C0); if (!cells[j].find) { cells[j].find = true; k++; } }
        for (i = 0; i < R0 * C0; i++) cells[i].h = hint(i);
      }
      return {
        init: function () {
          var i, m;
          m = new TH.Mesh(new TH.PlaneGeometry(60, 40), mat(0x3b4a2c)); m.rotation.x = -Math.PI / 2; m.position.y = -0.55; scene.add(m);
          for (var r = 0; r < R0; r++) for (var c = 0; c < C0; c++) {
            var b = new TH.Mesh(new TH.BoxGeometry(2, 1, 2), mat(0x6b4a2c)); b.position.set(cx(c), 0, cz(r)); scene.add(b);
            var f = new TH.Mesh(new TH.OctahedronGeometry(0.55, 0), mat(0xf0c050, { emissive: 0xa07010 })); f.position.set(cx(c), 0.9, cz(r)); f.visible = false; scene.add(f);
            cells.push({ m: b, fm: f, find: false, dug: false, h: 0 });
          }
          for (i = 0; i < 12; i++) { m = new TH.Mesh(new TH.CylinderGeometry(0.3, 0.3, 2.4, 6), mat(0x5a3d22)); m.position.set(-14 + i * 2.6, 1.2, -9); scene.add(m); }
        },
        start: function () { lvl = 0; level(); P = scr(); },
        logic: function (dt) { if (note > 0) note -= dt; },
        down: function (x, y) {
          if (!P.length) P = scr();
          var i = nearest(P, x, y, Math.max(30, 0.1 * Math.min(api.w, api.h)));
          if (i < 0 || cells[i].dug) return;
          var c = cells[i]; c.dug = true; c.m.position.y = -0.55; c.m.material.color.setHex(0x3a2a1a);
          var r = Math.floor(i / C0), cc = i % C0;
          if (c.find) { found++; c.fm.visible = true; burst(cx(cc), 1.2, cz(r), 22, 3.5, 1, 0.85, 0.3, 3); api.nota(880, 0.25, 'triangle', 0.08);
            if (found >= nf) { lvl++; good(); if (st === 'play') level(); } }
          else { used++; api.nota(200, 0.1, 'sine', 0.06); burst(cx(cc), 0.6, cz(r), 6, 2, 0.5, 0.35, 0.2, 2);
            if (used >= B) { bad(); if (st === 'play') level(); } }
        },
        anim: function (dt) {
          for (var i = 0; i < cells.length; i++) { var c = cells[i]; if (c.fm.visible) { c.fm.rotation.y += dt * 2.4; c.fm.position.y = 0.2 + Math.sin(sceneT * 3 + i) * 0.12; } }
          var sk = camShake(dt); setCam(sk, 12, 10, 0, 0, 0.5); P = scr();
        },
        hud: function () {
          txt(T.h4 + ' ' + Math.max(0, B - used), 22, 98, 13, '#ffd88a', 'left');
          for (var i = 0; i < cells.length; i++) { var c = cells[i]; if (c.dug && !c.find) { var p = P[i]; if (p) txt(String(c.h), p.x, p.y + 6, 20, c.h ? '#ffe9a8' : '#8a7a6a', 'center'); } }
        },
        dbg: function () { return { finds: cells.map(function (c) { return c.find; }), dug: cells.map(function (c) { return c.dug; }), hints: cells.map(function (c) { return c.h; }), left: B - used, pos: scr() }; }
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
