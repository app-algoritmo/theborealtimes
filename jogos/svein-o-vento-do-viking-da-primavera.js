/* Svein Asleifarson — o vento do viking da primavera (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-svein',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "h2": "Erros",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador.",
    "titulo": "O vento do viking da primavera",
    "sub": "Svein semeava os campos e depois saía no seu viking da primavera. Rajadas de vento cruzam o mar das Órcadas. As azuis apontam para a frente do navio e enchem a vela: toque nelas para pegá-las. As vermelhas apontam para trás, contra a vela: deixe-as passar. Tocar numa rajada vermelha é erro. Pegue 14 rajadas azuis antes do tempo acabar. Três erros encerram o jogo.",
    "perdeu": "O navio ficou parado",
    "v1": "O navio segue à frente!",
    "v2": "Na Orkneyinga saga, Svein passava o inverno em casa, semeava na primavera e saía para o seu \"viking da primavera\", voltando depois do meio do verão; depois da colheita saía no \"viking do outono\". As rajadas de vento do jogo e o ritmo são invenção.",
    "h1": "Rajadas"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "h2": "Mistakes",
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser.",
    "titulo": "The wind of the spring viking",
    "sub": "Svein sowed his fields and then set out on his spring viking. Gusts of wind cross the sea of Orkney. The blue ones point to the front of the ship and fill the sail: tap them to catch them. The red ones point backward, against the sail: let them pass. Tapping a red gust is a mistake. Catch 14 blue gusts before time runs out. Three mistakes end the game.",
    "perdeu": "The ship stood still",
    "v1": "The ship sails ahead!",
    "v2": "In the Orkneyinga saga, Svein spent the winter at home, sowed in spring and set out on his \"spring viking\", returning after midsummer; after the harvest he went out on the \"autumn viking\". The gusts of wind in the game and the rhythm are invention.",
    "h1": "Gusts"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "h2": "Feil",
    "h3": "Tid",
    "carregando": "Laster 3D…",
    "sem3d": "Denne enheten kunne ikke vise 3D-grafikk. Prøv en annen nettleser.",
    "titulo": "Vinden for vårvikingen",
    "sub": "Svein sådde åkrene og dro så ut på vårvikingen sin. Vindkast krysser havet ved Orknøyene. De blå peker mot fremsiden av skipet og fyller seilet: Trykk på dem for å fange dem. De røde peker bakover, mot seilet: La dem passere. Å trykke på et rødt vindkast er en feil. Fang 14 blå vindkast før tiden er ute. Tre feil avslutter spillet.",
    "perdeu": "Skipet sto stille",
    "v1": "Skipet seiler foran!",
    "v2": "I Orknøyingenes saga tilbrakte Svein vinteren hjemme, sådde om våren og dro ut på «vårvikingen» sin, og kom tilbake etter midtsommer; etter innhøstingen dro han ut på «høstvikingen». Vindkastene i spillet og rytmen er oppfinnelse.",
    "h1": "Vindkast"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "h2": "Errores",
    "h3": "Tiempo",
    "carregando": "Cargando el 3D…",
    "sem3d": "Este dispositivo no pudo mostrar gráficos 3D. Prueba con otro navegador.",
    "titulo": "El viento del vikingo de primavera",
    "sub": "Svein sembraba sus campos y luego salía a su vikingo de primavera. Ráfagas de viento cruzan el mar de las Órcadas. Las azules apuntan a la proa del barco y llenan la vela: tócalas para atraparlas. Las rojas apuntan hacia atrás, contra la vela: déjalas pasar. Tocar una ráfaga roja es un error. Atrapa 14 ráfagas azules antes de que acabe el tiempo. Tres errores terminan el juego.",
    "perdeu": "El barco se quedó parado",
    "v1": "¡El barco navega por delante!",
    "v2": "En la Orkneyinga saga, Svein pasaba el invierno en casa, sembraba en primavera y salía a su «vikingo de primavera», y volvía después de mediados del verano; tras la cosecha salía al «vikingo de otoño». Las ráfagas de viento del juego y el ritmo son invención.",
    "h1": "Ráfagas"
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
    var CFG = {"sky": 1845818, "fog": [34, 100], "hemi": [12636384, 1055784], "sun": 15265535, "sunPos": [-8, 24, 14], "cam": [0, 5, 10], "look": [0, 2.0, 0], "fov": 58, "fovP": 72, "target": 14, "maxe": 3, "total": 110, "bgA": "#0e2335", "bgB": "#050b12"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-svein');
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
      var W2 = [], spT = 0.5, ship, sail, P = [];
      function sp() { return 2.3 + Math.min(score, 14) * 0.06; }
      function mkW(gd) {
        var gr = new TH.Group(), m = new TH.Mesh(new TH.CylinderGeometry(0.12, 0.12, 1.2, 6), mat(gd ? 0x8ad0ff : 0xe8482a, { emissive: gd ? 0x204868 : 0x501008 }));
        m.rotation.z = Math.PI / 2; m.position.x = gd ? -0.35 : 0.35; gr.add(m);
        var h = new TH.Mesh(new TH.ConeGeometry(0.4, 0.8, 6), mat(gd ? 0x8ad0ff : 0xe8482a, { emissive: gd ? 0x204868 : 0x501008 }));
        h.rotation.z = gd ? -Math.PI / 2 : Math.PI / 2; h.position.x = gd ? 0.55 : -0.55; gr.add(h);
        return gr;
      }
      function scr() { var o = []; for (var i = 0; i < W2.length; i++) o.push(toScr(W2[i].x, W2[i].y, 1.2)); return o; }
      return {
        init: function () {
          var i, m;
          m = new TH.Mesh(new TH.PlaneGeometry(90, 60), mat(0x1c3a58)); m.rotation.x = -Math.PI / 2; m.position.set(0, -0.2, -10); scene.add(m);
          ship = new TH.Group();
          m = new TH.Mesh(new TH.BoxGeometry(4.2, 0.8, 1.4), mat(0x2a2a34)); m.position.y = 0.4; ship.add(m);
          m = new TH.Mesh(new TH.ConeGeometry(0.7, 1.2, 4), mat(0x2a2a34)); m.rotation.z = -Math.PI / 2; m.position.set(2.5, 0.8, 0); ship.add(m);
          m = new TH.Mesh(new TH.CylinderGeometry(0.08, 0.08, 4, 6), mat(0x4a3220)); m.position.y = 2.6; ship.add(m);
          sail = new TH.Mesh(new TH.BoxGeometry(2.4, 2.6, 0.08), mat(0xd8d0b8)); sail.position.set(0, 2.8, 0); ship.add(sail);
          ship.position.set(0, 0, -1.2); scene.add(ship);
          for (i = 0; i < 6; i++) { m = new TH.Mesh(new TH.SphereGeometry(3 + (i % 3), 7, 5), new TH.MeshBasicMaterial({ color: 0x3a5a7a })); m.scale.y = 0.4; m.position.set(-20 + i * 8, 4 + (i % 2) * 2, -22); scene.add(m); }
        },
        start: function () { for (var i = 0; i < W2.length; i++) drop(W2[i].m); W2 = []; spT = 0.5; P = []; },
        logic: function (dt) {
          var i;
          spT -= dt;
          if (spT <= 0) {
            var gd = Math.random() < 0.45, y = [1.6, 2.8, 4.0][Math.floor(Math.random() * 3)], x0 = gd ? -5.4 : 5.4, m = mkW(gd);
            m.position.set(x0, y, 1.2); scene.add(m); W2.push({ m: m, x: x0, y: y, g: gd }); spT = Math.max(0.42, 0.72 - score * 0.02);
          }
          for (i = W2.length - 1; i >= 0; i--) { W2[i].x += (W2[i].g ? 1 : -1) * sp() * dt; if (Math.abs(W2[i].x) > 5.8) { drop(W2[i].m); W2.splice(i, 1); } }
        },
        down: function (x, y) {
          var P2 = scr(), i = nearest(P2, x, y, Math.max(38, 0.1 * Math.min(api.w, api.h)));
          if (i < 0) return; var w = W2[i];
          if (w.g) { burst(w.x, w.y, 1.2, 12, 2.4, 0.6, 0.9, 1, 3); good(); } else { burst(w.x, w.y, 1.2, 14, 2.6, 1, 0.3, 0.2, 3); bad(); }
          drop(w.m); W2.splice(i, 1);
        },
        cam: function (sk) { var f = fit(); setCam(sk, 5 + 2.5 * (f - 1), 10 * f, 0, 2.0, 0); },
        anim: function (dt) {
          for (var i = 0; i < W2.length; i++) W2[i].m.position.set(W2[i].x, W2[i].y + Math.sin(sceneT * 4 + i) * 0.08, 1.2);
          ship.rotation.z = Math.sin(sceneT * 1.3) * 0.05; ship.position.y = Math.sin(sceneT * 1.8) * 0.12; sail.scale.x = 1 + Math.min(score, 14) * 0.03;
          this.cam(camShake(dt));
        },
        dbg: function () {
          var pos = scr(), gd = [];
          for (var i = 0; i < W2.length; i++) if (W2[i].g && Math.abs(W2[i].x) < 4.8) gd.push(pos[i]);
          if (!pos.length) pos = [{ x: api.w / 2, y: api.h / 2 }];
          return { pos: pos, gd: gd };
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
