/* Flóamanna saga — mantimentos na Groenlândia (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-floamanna',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Mantimentos na Groenlândia",
    "sub": "Toque ou arraste na tela para mover o viajante pela praia. Pegue os caixotes de mantimentos que caem e desvie dos blocos de gelo. Reúna 10 caixotes antes do tempo acabar. Três impactos de gelo encerram o jogo.",
    "perdeu": "O gelo venceu",
    "v1": "Mantimentos reunidos!",
    "v2": "Na Flóamanna saga, Þorgils naufraga na Groenlândia, os companheiros adoecem e ele fica com um bebê para criar. A chuva de gelo e de caixotes é invenção.",
    "h1": "Caixotes",
    "h2": "Impactos",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador."
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Provisions in Greenland",
    "sub": "Tap or drag on the screen to move the traveller along the beach. Catch the falling crates of provisions and dodge the blocks of ice. Collect 10 crates before time runs out. Three impacts of ice end the game.",
    "perdeu": "The ice won",
    "v1": "Provisions gathered!",
    "v2": "In the Flóamanna saga, Þorgils is shipwrecked in Greenland, his companions fall ill and he is left with an infant to raise. The rain of ice and crates is invented.",
    "h1": "Crates",
    "h2": "Impacts",
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser."
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Forsyninger på Grønland",
    "sub": "Trykk eller dra på skjermen for å flytte den reisende langs stranda. Fang de fallende kassene med forsyninger og unngå isblokkene. Samle 10 kasser før tiden er ute. Tre isstøt avslutter spillet.",
    "perdeu": "Isen vant",
    "v1": "Forsyningene er samlet!",
    "v2": "I Flóamanna saga forliser Torgils på Grønland, kameratene blir syke og han blir sittende med en baby å ta vare på. Regnet av is og kasser er oppfunnet.",
    "h1": "Kasser",
    "h2": "Støt",
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
    var CFG = {"sky": 1846336, "fog": [40, 110], "hemi": [11059416, 2107420], "sun": 14674687, "sunPos": [-15, 40, 20], "cam": [0, 6.5, 13], "look": [0, 4.2, 0], "fov": 58, "fovP": 72, "target": 10, "maxe": 3, "total": 80, "bgA": "#0e2335", "bgB": "#050b12"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-floamanna');
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
      var items = [], hx = 0, tx = 0, hero, spawnT = 0, fall = 8, SP = 13;
      function mk(kind, x) {
        var m;
        if (kind === 'crate') { m = new TH.Group(); var b = new TH.Mesh(new TH.BoxGeometry(1.4, 1.2, 1.4), mat(0x8a5a2c)); m.add(b); var s = new TH.Mesh(new TH.BoxGeometry(1.5, 0.2, 0.2), mat(0xc9a24a)); s.position.y = 0.2; m.add(s); }
        else { m = new TH.Mesh(new TH.ConeGeometry(0.85, 2.0, 5), mat(0xbfe6f5, { shininess: 90 })); m.rotation.x = Math.PI; }
        m.position.set(x, 18, 0); scene.add(m); return m;
      }
      return {
        init: function () {
          var i, m;
          m = new TH.Mesh(new TH.PlaneGeometry(60, 30), mat(0xdfe6ec)); m.rotation.x = -Math.PI / 2; m.position.set(0, 0, -2); scene.add(m);
          m = new TH.Mesh(new TH.PlaneGeometry(140, 70), mat(0x173a58)); m.rotation.x = -Math.PI / 2; m.position.set(0, -0.3, -38); scene.add(m);
          for (i = 0; i < 12; i++) { m = new TH.Mesh(new TH.IcosahedronGeometry(3 + (i % 3) * 1.5, 0), mat(0xc4e0ee)); m.position.set(-50 + i * 9, 1.5, -22 - (i % 3) * 7); m.scale.y = 0.7; scene.add(m); }
          for (i = 0; i < 12; i++) { m = new TH.Mesh(new TH.ConeGeometry(8 + (i % 3) * 3, 16 + (i % 4) * 5, 5), mat(0xaec2d4)); m.position.set(-60 + i * 11, 6, -70); scene.add(m); }
          hero = new TH.Group();
          var b = new TH.Mesh(new TH.CylinderGeometry(0.45, 0.6, 1.5, 8), mat(0x3a5a7a)); b.position.y = 0.9; hero.add(b);
          var h = new TH.Mesh(new TH.SphereGeometry(0.36, 8, 6), mat(0xe8c9a0)); h.position.y = 1.95; hero.add(h);
          var f = new TH.Mesh(new TH.SphereGeometry(0.4, 8, 6), mat(0x6b4a2c)); f.position.set(0, 1.5, 0.45); hero.add(f);
          var bb = new TH.Mesh(new TH.SphereGeometry(0.26, 8, 6), mat(0xf0dcc0)); bb.position.set(0.1, 1.55, 0.7); hero.add(bb);
          hero.position.set(0, 0, 0); scene.add(hero);
        },
        start: function () { items.forEach(function (it) { scene.remove(it.m); }); items = []; hx = 0; tx = 0; spawnT = 0.5; fall = 8; },
        logic: function (dt) {
          fall = 8 + score * 0.25;
          var d = tx - hx, mv = SP * dt; hx += Math.abs(d) <= mv ? d : (d > 0 ? mv : -mv);
          spawnT -= dt; if (spawnT <= 0) { var k = Math.random() < 0.5 ? 'crate' : 'ice'; items.push({ kind: k, x: (Math.random() * 2 - 1) * 8.5, y: 17, got: false, m: null }); items[items.length - 1].m = mk(k, items[items.length - 1].x); spawnT = Math.max(0.45, 0.68 - score * 0.012); }
          for (var i = items.length - 1; i >= 0; i--) {
            var it = items[i]; it.y -= fall * dt;
            if (!it.got && it.y < 1.6 && it.y > -0.4 && Math.abs(it.x - hx) < 1.55) {
              it.got = true; scene.remove(it.m);
              if (it.kind === 'crate') { burst(hx, 1.5, 0, 18, 3.5, 1, 0.85, 0.4, 3); good(); } else { burst(hx, 1.5, 0, 26, 5, 0.6, 0.85, 1, 4); bad(); }
            }
            if (it.y < -1) { if (!it.got) scene.remove(it.m); items.splice(i, 1); }
          }
        },
        down: function (x) { tx = Math.max(-9, Math.min(9, (x / api.w * 2 - 1) * 9)); },
        move: function (x) { tx = Math.max(-9, Math.min(9, (x / api.w * 2 - 1) * 9)); },
        anim: function (dt) {
          hero.position.x = hx; hero.rotation.z = Math.max(-0.3, Math.min(0.3, (hx - tx) * 0.05)); hero.position.y = Math.abs(Math.sin(sceneT * 9)) * 0.06 * (Math.abs(tx - hx) > 0.2 ? 1 : 0);
          for (var i = 0; i < items.length; i++) { var it = items[i]; if (it.got) continue; it.m.position.set(it.x, it.y, 0); if (it.kind === 'crate') it.m.rotation.y += dt; else it.m.rotation.y += dt * 2; }
          var sk = camShake(dt); setCam(sk, 6.5, 13, 0, 4.2, 0);
        },
        dbg: function () { return { hx: hx, tx: tx, fall: fall, SP: SP, items: items.filter(function (it) { return !it.got; }).map(function (it) { return { kind: it.kind, x: it.x, y: it.y }; }), pos: [-8, -4, 0, 4, 8].map(function (v) { return { x: (v / 9 + 1) / 2 * api.w, y: 200 }; }) }; }
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
