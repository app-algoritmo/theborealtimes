/* Herjólfsnes — o tecido de lã (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-herjolfsnes',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O tecido de lã",
    "sub": "Uma peça de lã é tecida fileira por fileira. Cada fileira mostra, por um instante, quatro fios de cores. Quando os fios sumirem, toque nos carretéis na mesma ordem. Fio errado é erro, e a fileira volta a aparecer por um momento. Tece 12 fios certos antes do tempo acabar. Três erros encerram o jogo.",
    "perdeu": "A trama se desfez",
    "v1": "O tecido está pronto!",
    "v2": "Em 1921, Poul Nørlund escavou o cemitério de Herjólfsnes, na Groenlândia, e achou capuzes, chapéus e vestidos de lã na moda europeia da época. A tecelagem em fileiras é invenção.",
    "h1": "Fios",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador.",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The wool cloth",
    "sub": "A piece of wool is woven row by row. Each row shows four coloured threads for a moment. When the threads vanish, tap the spools in the same order. A wrong thread is a mistake, and the row shows again for a moment. Weave 12 right threads before time runs out. Three mistakes end the game.",
    "perdeu": "The weave came apart",
    "v1": "The cloth is done!",
    "v2": "In 1921, Poul Nørlund excavated the churchyard of Herjólfsnes in Greenland and found wool hoods, hats and gowns in the European fashion of the time. The row-by-row weaving is invented.",
    "h1": "Threads",
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser.",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Ullstoffet",
    "sub": "Et stykke ull veves rad for rad. Hver rad viser fire fargede tråder et øyeblikk. Når trådene forsvinner, trykker du på garnspolene i samme rekkefølge. En feil tråd er en feil, og raden vises igjen et øyeblikk. Vev 12 riktige tråder før tiden er ute. Tre feil avslutter spillet.",
    "perdeu": "Veven gikk i oppløsning",
    "v1": "Stoffet er ferdig!",
    "v2": "I 1921 gravde Poul Nørlund ut kirkegården på Herjólfsnes på Grønland og fant hetter, hatter og kjoler i ull, i europeisk mote fra tiden. Vevingen rad for rad er oppfunnet.",
    "h1": "Tråder",
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
    var CFG = {"sky": 1843760, "fog": [40, 100], "hemi": [14209216, 2761752], "sun": 16773328, "sunPos": [10, 40, 20], "cam": [0, 10, 8], "look": [0, 0, 0.4], "fov": 58, "fovP": 72, "target": 12, "maxe": 3, "total": 110, "bgA": "#0e2335", "bgB": "#050b12"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-herjolfsnes');
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
      var COL = [0xe0d6bc, 0xb03a2e, 0x2f5f9a, 0xc8a232], row = 0, k = 0, pat = [], ph = 'show', pT = 0, spools = [], ghosts = [], cells = [], P = [];
      function sx(i) { return (i - 1.5) * 2.4; }
      function cxx(c) { return (c - 1.5) * 1.7; }
      function czz(r) { return -2.6 + r * 1.7; }
      function scr() { var o = []; for (var i = 0; i < 4; i++) o.push(toScr(sx(i), 0.9, 3.4)); return o; }
      function newRow() { pat = []; for (var i = 0; i < 4; i++) pat.push(Math.floor(Math.random() * 4)); k = 0; ph = 'show'; pT = Math.max(1.7, 2.7 - row * 0.4); }
      function tap(i) {
        if (ph !== 'hide') return;
        if (i === pat[k]) {
          cells[row * 4 + k].material.color.setHex(COL[i]); cells[row * 4 + k].visible = true; burst(cxx(k), 0.8, czz(row), 8, 2.5, 1, 0.9, 0.6, 2); k++; good();
          if (k >= 4 && st === 'play') { row++; if (row < 3) newRow(); }
        } else { ph = 'show'; pT = 1.3; bad(); }
      }
      return {
        init: function () {
          var i, m;
          m = new TH.Mesh(new TH.BoxGeometry(12, 0.5, 10), mat(0x5a3d22)); m.position.set(0, -0.35, 0.4); scene.add(m);
          m = new TH.Mesh(new TH.PlaneGeometry(90, 90), mat(0x141a24)); m.rotation.x = -Math.PI / 2; m.position.set(0, -0.8, 0); scene.add(m);
          for (i = 0; i < 6; i++) { m = new TH.Mesh(new TH.BoxGeometry(0.05, 0.05, 6), mat(0xbfb8a4)); m.position.set(-2.55 + i * 1.02, 0.02, -0.4); scene.add(m); }
          for (i = 0; i < 12; i++) { var cc = new TH.Mesh(new TH.BoxGeometry(1.55, 0.3, 1.55), mat(0xe0d6bc)); cc.position.set(cxx(i % 4), 0.15, czz(Math.floor(i / 4))); cc.visible = false; scene.add(cc); cells.push(cc); var gh = new TH.Mesh(new TH.BoxGeometry(1.55, 0.12, 1.55), mat(0x3a4250)); gh.position.set(cxx(i % 4), 0.06, czz(Math.floor(i / 4))); scene.add(gh); ghosts.push(gh); }
          for (i = 0; i < 4; i++) { var sp = new TH.Group(), b = new TH.Mesh(new TH.CylinderGeometry(0.85, 0.85, 1.3, 12), mat(COL[i])); b.position.y = 0.65; sp.add(b); var fl1 = new TH.Mesh(new TH.CylinderGeometry(1.05, 1.05, 0.14, 12), mat(0x7a5230)); fl1.position.y = 0.05; sp.add(fl1); var fl2 = fl1.clone ? new TH.Mesh(new TH.CylinderGeometry(1.05, 1.05, 0.14, 12), mat(0x7a5230)) : fl1; fl2.position.y = 1.3; sp.add(fl2); sp.position.set(sx(i), 0, 3.4); scene.add(sp); spools.push(sp); }
        },
        start: function () { row = 0; for (var i = 0; i < 12; i++) cells[i].visible = false; newRow(); P = scr(); },
        logic: function (dt) { if (ph === 'show') { pT -= dt; if (pT <= 0) ph = 'hide'; } },
        down: function (x, y) { if (!P.length) P = scr(); var i = nearest(P, x, y, Math.max(34, 0.12 * Math.min(api.w, api.h))); if (i >= 0) tap(i); },
        key: function (c, d) { if (!d) return; var n = { Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3 }[c]; if (n !== undefined) tap(n); },
        cam: function (sk) { var f = fit(); setCam(sk, 10 + 5 * (f - 1), 8 + 4 * (f - 1), 0, 0, 0.4); },
        anim: function (dt) {
          for (var i = 0; i < 12; i++) { var r = Math.floor(i / 4), c = i % 4; ghosts[i].material.color.setHex(r === row && ph === 'show' ? COL[pat[c]] : 0x3a4250); ghosts[i].scale.y = r === row && ph === 'show' ? 3 : 1; }
          for (i = 0; i < 4; i++) spools[i].rotation.y += dt * (ph === 'hide' ? 0.4 : 0);
          this.cam(camShake(dt)); P = scr();
        },
        dbg: function () { return { need: pat[k], ph: ph, row: row, pos: scr() }; }
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
