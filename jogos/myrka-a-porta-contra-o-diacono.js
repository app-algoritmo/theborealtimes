/* O diácono de Myrká — a porta contra o diácono (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-myrka',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "h2": "Erros",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador.",
    "titulo": "A porta contra o diácono",
    "sub": "Na véspera de Natal, o diácono morto de Myrká volta, e Guðrún precisa escapar dele. Três portas estão diante de você. Espere em silêncio. Quando uma luz pálida surgir diante de uma porta, toque nessa porta para trancá-la antes que ele chegue, ou use as teclas 1, 2 e 3. Tocar antes de a luz surgir, tocar na porta errada ou deixar o diácono entrar é erro. Tranque 10 vezes antes do tempo acabar. Três erros encerram o jogo.",
    "perdeu": "O diácono entrou",
    "v1": "As portas aguentaram!",
    "v2": "No conto, o diácono se afoga no Hörgá e volta na véspera de Natal para buscar Guðrún. Ela escapa porque vestira só uma manga do casaco, e toca o sino da igreja. As portas, a luz pálida e o ritmo do jogo são invenção.",
    "h1": "Portas"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "h2": "Mistakes",
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser.",
    "titulo": "The door against the deacon",
    "sub": "On Christmas Eve, the dead deacon of Myrká returns, and Guðrún must escape him. Three doors are before you. Wait in silence. When a pale light appears before one door, tap that door to bar it before he arrives, or use keys 1, 2 and 3. Tapping before the light appears, tapping the wrong door or letting the deacon in is a mistake. Bar 10 times before time runs out. Three mistakes end the game.",
    "perdeu": "The deacon got in",
    "v1": "The doors held!",
    "v2": "In the tale, the deacon drowns in the Hörgá and returns on Christmas Eve to fetch Guðrún. She escapes because she had put on only one sleeve of her coat, and she rings the church bell. The doors, the pale light and the rhythm of the game are invention.",
    "h1": "Doors"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "h2": "Feil",
    "h3": "Tid",
    "carregando": "Laster 3D…",
    "sem3d": "Denne enheten kunne ikke vise 3D-grafikk. Prøv en annen nettleser.",
    "titulo": "Døra mot diakonen",
    "sub": "Julaften kommer den døde diakonen fra Myrká tilbake, og Guðrún må unnslippe ham. Tre dører står foran deg. Vent i stillhet. Når et blekt lys dukker opp foran en dør, trykk på den døra for å sperre den før han kommer, eller bruk tastene 1, 2 og 3. Å trykke før lyset dukker opp, å trykke på feil dør eller å la diakonen slippe inn er en feil. Sperr 10 ganger før tiden er ute. Tre feil avslutter spillet.",
    "perdeu": "Diakonen kom inn",
    "v1": "Dørene holdt!",
    "v2": "I eventyret drukner diakonen i Hörgá og kommer tilbake julaften for å hente Guðrún. Hun slipper unna fordi hun bare hadde tatt på seg ett erme av kåpen, og hun ringer kirkeklokka. Dørene, det bleke lyset og rytmen i spillet er oppfinnelse.",
    "h1": "Dører"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "h2": "Errores",
    "h3": "Tiempo",
    "carregando": "Cargando el 3D…",
    "sem3d": "Este dispositivo no pudo mostrar gráficos 3D. Prueba con otro navegador.",
    "titulo": "La puerta contra el diácono",
    "sub": "En Nochebuena, el diácono muerto de Myrká vuelve, y Guðrún debe escapar de él. Tres puertas están ante ti. Espera en silencio. Cuando aparezca una luz pálida ante una puerta, toca esa puerta para atrancarla antes de que él llegue, o usa las teclas 1, 2 y 3. Tocar antes de que aparezca la luz, tocar la puerta equivocada o dejar entrar al diácono es un error. Atranca 10 veces antes de que acabe el tiempo. Tres errores terminan el juego.",
    "perdeu": "El diácono entró",
    "v1": "¡Las puertas resistieron!",
    "v2": "En el cuento, el diácono se ahoga en el Hörgá y vuelve en Nochebuena para buscar a Guðrún. Ella escapa porque solo se había puesto una manga del abrigo, y toca la campana de la iglesia. Las puertas, la luz pálida y el ritmo del juego son invención.",
    "h1": "Puertas"
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
    var CFG = {"sky": 1054762, "fog": [28, 80], "hemi": [12110064, 1054762], "sun": 14214399, "sunPos": [-6, 20, 14], "cam": [0, 3.6, 9], "look": [0, 1.5, 0], "fov": 58, "fovP": 72, "target": 10, "maxe": 3, "total": 110, "bgA": "#0e2335", "bgB": "#050b12"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-myrka');
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
      var ph = 'wait', t = 1.2, d = 0, c = 0, fpT = 0, gT = 0, cd = 0, fps = [], doors = [], hit = false, P = [];
      function dx(i) { return (i - 1) * 3.6; }
      function scr() { var o = []; for (var i = 0; i < 3; i++) o.push(toScr(dx(i), 1.5, 0)); return o; }
      function iv() { return Math.max(0.26, 0.4 - score * 0.014); }
      function tap(i) {
        if (cd > 0) return;
        if (ph === 'steps') {
          if (i === d) { burst(dx(i), 1.6, 0.4, 16, 2.6, 0.7, 0.8, 1, 3); good(); ph = 'gap'; gT = 0.7; c = 0; }
          else { cd = 0.3; bad(); }
        } else if (ph === 'wait') { cd = 0.3; bad(); }
      }
      return {
        init: function () {
          var i, j, m;
          m = new TH.Mesh(new TH.PlaneGeometry(60, 44), mat(0x2a3448)); m.rotation.x = -Math.PI / 2; m.position.set(0, -0.05, 0); scene.add(m);
          m = new TH.Mesh(new TH.BoxGeometry(14, 3.8, 0.8), mat(0x4a4038)); m.position.set(0, 1.9, -0.6); scene.add(m);
          m = new TH.Mesh(new TH.BoxGeometry(14.6, 0.5, 1.3), mat(0x30281e)); m.position.set(0, 4.0, -0.5); scene.add(m);
          for (i = 0; i < 3; i++) {
            m = new TH.Mesh(new TH.BoxGeometry(1.9, 3.0, 0.3), mat(0x8a5a30, { emissive: 0x000000 })); m.position.set(dx(i), 1.5, -0.1); scene.add(m); doors.push(m);
            m = new TH.Mesh(new TH.SphereGeometry(0.1, 6, 5), mat(0xe8c050)); m.position.set(dx(i) + 0.65, 1.4, 0.15); scene.add(m);
            for (j = 0; j < 4; j++) { m = new TH.Mesh(new TH.BoxGeometry(0.5, 0.05, 0.9), new TH.MeshBasicMaterial({ color: 0xc8d8ff, transparent: true, opacity: 0.75 })); m.position.set(dx(i) + (j % 2 ? 0.3 : -0.3), 0.04, 4.2 - j * 1.0); m.visible = false; scene.add(m); fps.push(m); }
          }
          for (i = 0; i < 8; i++) { m = new TH.Mesh(new TH.ConeGeometry(1.2, 5 + (i % 3), 6), mat(0x141c2a)); m.position.set(-20 + i * 5.5, 2.5, -9); scene.add(m); }
        },
        start: function () { ph = 'wait'; t = 1.2; c = 0; cd = 0; hit = false; P = scr(); },
        logic: function (dt) {
          if (cd > 0) cd -= dt;
          if (ph === 'wait') { t -= dt; if (t <= 0) { d = Math.floor(Math.random() * 3); ph = 'steps'; c = 0; fpT = 0; t = 0; } }
          else if (ph === 'steps') {
            t += dt; fpT -= dt;
            if (fpT <= 0 && c < 4) { c++; fpT = iv(); api.nota(200 + c * 30, 0.12, 'sine', 0.07); }
            if (t >= 4 * iv() + 1.1) { ph = 'gap'; gT = 0.8; c = 0; bad(); }
          } else if (ph === 'gap') { gT -= dt; if (gT <= 0) { ph = 'wait'; t = 0.9 + Math.random() * 1.3; } }
        },
        down: function (x, y) { if (!P.length) P = scr(); var i = nearest(P, x, y, Math.max(40, 0.14 * Math.min(api.w, api.h))); if (i >= 0) tap(i); },
        key: function (cc, dd) { if (!dd) return; var n = { Digit1: 0, Digit2: 1, Digit3: 2 }[cc]; if (n !== undefined) tap(n); },
        cam: function (sk) { var f = fit(); setCam(sk, 3.6 + 2 * (f - 1), 9 * f, 0, 1.5, 0); },
        anim: function (dt) {
          var i, j;
          for (i = 0; i < 3; i++) { doors[i].material.emissive.setHex(ph === 'steps' && d === i && c >= 4 ? 0x3a4a80 : 0x000000); for (j = 0; j < 4; j++) fps[i * 4 + j].visible = ph === 'steps' && d === i && j < c; }
          this.cam(camShake(dt)); P = scr();
        },
        hud: function () { var W = api.w, H = api.h; txt(ph === 'steps' ? '!' : '...', W / 2, H * 0.2, 28, ph === 'steps' ? '#ffe9a8' : '#c9b3f2', 'center'); },
        dbg: function () { return { need: ph === 'steps' ? d : -1, ph: ph, pos: scr() }; }
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
