/* Magnus, o Bom — o machado Hel (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-magnus-lyrskov',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O machado Hel",
    "sub": "Defenda a linha de batalha. Guerreiros wendos avançam por três faixas. Toque no lado esquerdo, no centro ou no lado direito da tela para golpear com o machado Hel quando um guerreiro chegar perto. Golpe no vazio e guerreiro que passa são erros. Derrube 14 guerreiros antes do tempo acabar. Três erros encerram o jogo.",
    "perdeu": "A linha cedeu",
    "v1": "A linha resistiu!",
    "v2": "Em 1043, em Lyrskov Hede, Magnus, o Bom, derrotou um exército de wendos, e as fontes falam do machado Hel de Santo Olavo. Os golpes em fila são invenção.",
    "h1": "Guerreiros",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador.",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The axe Hel",
    "sub": "Defend the battle line. Wendish warriors advance along three lanes. Tap the left side, the centre or the right side of the screen to strike with the axe Hel when a warrior gets close. A swing at nothing and a warrior who gets past are mistakes. Fell 14 warriors before time runs out. Three mistakes end the game.",
    "perdeu": "The line gave way",
    "v1": "The line held!",
    "v2": "In 1043, at Lyrskov Heath, Magnus the Good defeated an army of Wends, and the sources speak of Saint Olaf's axe Hel. The strikes in a row are invented.",
    "h1": "Warriors",
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser.",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Øksen Hel",
    "sub": "Forsvar slaglinjen. Vendiske krigere rykker fram i tre baner. Trykk på venstre side, midten eller høyre side av skjermen for å slå med øksen Hel når en kriger kommer nær. Et slag i løse luften og en kriger som slipper forbi er feil. Fell 14 krigere før tiden er ute. Tre feil avslutter spillet.",
    "perdeu": "Linjen ga etter",
    "v1": "Linjen holdt!",
    "v2": "I 1043, på Lyrskov hede, slo Magnus den gode en hær av vendere, og kildene nevner Olav den helliges øks Hel. Slagene på rad er oppfunnet.",
    "h1": "Krigere",
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
    var CFG = {"sky": 1712176, "fog": [40, 110], "hemi": [12103840, 1713176], "sun": 16767136, "sunPos": [15, 35, 15], "cam": [0, 6.5, 11], "look": [0, 0.5, -9], "fov": 58, "fovP": 72, "target": 14, "maxe": 3, "total": 80, "bgA": "#0e2335", "bgB": "#050b12"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-magnus-lyrskov');
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
      var LX = [-4.2, 0, 4.2], en = [], cd = 0, sp = 0, hero, axe, swing = 0, swLane = 1, since = 0, gate = [];
      function mkEn(lane) {
        var g0 = new TH.Group(), b = new TH.Mesh(new TH.CylinderGeometry(0.45, 0.55, 1.5, 8), mat(0x6a2c26)); b.position.y = 0.9; g0.add(b);
        var h = new TH.Mesh(new TH.SphereGeometry(0.34, 8, 6), mat(0xe0b890)); h.position.y = 1.9; g0.add(h);
        var hl = new TH.Mesh(new TH.ConeGeometry(0.36, 0.4, 8), mat(0x666b70)); hl.position.y = 2.25; g0.add(hl);
        var sh = new TH.Mesh(new TH.CylinderGeometry(0.62, 0.62, 0.12, 12), mat(0x3a4a6a)); sh.rotation.x = Math.PI / 2; sh.position.set(0, 1.1, 0.55); g0.add(sh);
        g0.position.set(LX[lane], 0, -70); scene.add(g0); return g0;
      }
      return {
        init: function () {
          var i, m;
          m = new TH.Mesh(new TH.PlaneGeometry(120, 160), mat(0x31402a)); m.rotation.x = -Math.PI / 2; m.position.set(0, -0.05, -50); scene.add(m);
          for (i = 0; i < 3; i++) { m = new TH.Mesh(new TH.PlaneGeometry(3.6, 160), mat(0x4c4a34)); m.rotation.x = -Math.PI / 2; m.position.set(LX[i], 0, -50); scene.add(m); }
          for (i = 0; i < 14; i++) { m = new TH.Mesh(new TH.ConeGeometry(7 + (i % 3) * 3, 14 + (i % 4) * 4, 5), mat(0x3d4a3a)); m.position.set(-60 + i * 9, 5, -75); scene.add(m); }
          for (i = 0; i < 6; i++) { m = new TH.Mesh(new TH.BoxGeometry(0.4, 1.6, 0.4), mat(0x6b4a2c)); m.position.set(-8.5 + i * 3.4, 0.8, 2.5); scene.add(m); gate.push(m); }
          hero = new TH.Group();
          var b = new TH.Mesh(new TH.CylinderGeometry(0.5, 0.6, 1.5, 8), mat(0xb3382c)); b.position.y = 0.9; hero.add(b);
          var h = new TH.Mesh(new TH.SphereGeometry(0.36, 8, 6), mat(0xe8c9a0)); h.position.y = 1.95; hero.add(h);
          var cr = new TH.Mesh(new TH.CylinderGeometry(0.34, 0.4, 0.2, 8), mat(0xd9b24a)); cr.position.y = 2.3; hero.add(cr);
          hero.position.set(0, 0, 3.4); scene.add(hero);
          axe = new TH.Group(); var hd = new TH.Mesh(new TH.CylinderGeometry(0.07, 0.07, 2.2, 6), mat(0x5a3818)); hd.position.y = 1.1; axe.add(hd);
          var bl = new TH.Mesh(new TH.BoxGeometry(0.9, 0.7, 0.12), mat(0xcfd4da, { shininess: 90 })); bl.position.set(0.45, 2.0, 0); axe.add(bl); axe.visible = false; scene.add(axe);
        },
        start: function () { en.forEach(function (e) { scene.remove(e.m); }); en = []; cd = 0; since = 0.8; swing = 0; },
        logic: function (dt) {
          var spd = 10 + score * 0.3; sp = spd; cd -= dt; since -= dt;
          if (since <= 0) { var ln = Math.floor(Math.random() * 3), ok = true; for (var i = 0; i < en.length; i++) if (en[i].z < -62) ok = false; if (ok) { en.push({ lane: ln, z: -70, m: mkEn(ln), dead: 0 }); since = Math.max(0.55, 1.05 - score * 0.03) * (0.85 + Math.random() * 0.4); } else since = 0.1; }
          for (var j = en.length - 1; j >= 0; j--) {
            var e = en[j];
            if (e.dead > 0) { e.dead -= dt; e.m.position.z -= 6 * dt; e.m.position.y += (3 - e.m.position.y) * dt * 2; if (e.dead <= 0) { scene.remove(e.m); en.splice(j, 1); } continue; }
            e.z += spd * dt;
            if (e.z > 1.7) { scene.remove(e.m); en.splice(j, 1); burst(LX[e.lane], 1, 1.7, 20, 4, 1, 0.4, 0.3, 3); bad(); }
          }
        },
        down: function (x) {
          if (cd > 0) return; cd = 0.3;
          var lane = x < api.w / 3 ? 0 : x < 2 * api.w / 3 ? 1 : 2, best = null;
          for (var i = 0; i < en.length; i++) { var e = en[i]; if (e.dead <= 0 && e.lane === lane && e.z > -3.8 && e.z < 1.2 && (!best || e.z > best.z)) best = e; }
          swing = 0.25; swLane = lane; api.nota(200, 0.12, 'sawtooth', 0.05);
          if (best) { best.dead = 0.5; burst(LX[lane], 1.2, best.z, 24, 5, 1, 0.8, 0.4, 3); good(); } else bad();
        },
        anim: function (dt) {
          for (var i = 0; i < en.length; i++) { var e = en[i]; if (e.dead <= 0) { e.m.position.z = e.z; e.m.position.y = Math.abs(Math.sin(sceneT * 8 + i)) * 0.18; } }
          if (swing > 0) { swing -= dt; axe.visible = true; var k = 1 - swing / 0.25; axe.position.set(LX[swLane], 0.4, 0.6); axe.rotation.set(0, 0, 1.2 - k * 2.6); } else axe.visible = false;
          var sk = camShake(dt); setCam(sk, 6.5, 11, 0, 0.5, -9);
        },
        dbg: function () { return { en: en.filter(function (e) { return e.dead <= 0; }).map(function (e) { return { lane: e.lane, z: e.z }; }), cd: cd, pos: [{ x: api.w * 0.17, y: 300 }, { x: api.w * 0.5, y: 300 }, { x: api.w * 0.83, y: 300 }] }; }
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
