/* Flóki — feno antes do inverno (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-floki',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Feno antes do inverno",
    "sub": "Toque ou arraste na tela para mover Flóki pelo campo. Pegue os fardos de feno que caem e deixe os peixes passar: peixe na mão distrai e conta como erro. Reúna 14 fardos antes do tempo acabar. Três peixes pegos encerram o jogo.",
    "perdeu": "O inverno chegou",
    "v1": "O feno está guardado!",
    "v2": "Segundo a Landnámabók, Flóki pescou tanto que esqueceu de juntar feno, e as ovelhas morreram no inverno; na primavera, ao ver um fiorde cheio de gelo, deu à terra o nome Ísland. A colheita de feno é invenção.",
    "h1": "Fardos",
    "h2": "Distrações",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador."
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Hay before winter",
    "sub": "Tap or drag on the screen to move Flóki across the field. Catch the falling bales of hay and let the fish go by: a fish in your hands is a distraction and counts as a mistake. Gather 14 bales before time runs out. Three fish caught end the game.",
    "perdeu": "Winter arrived",
    "v1": "The hay is stored!",
    "v2": "According to the Landnámabók, Flóki fished so much that he forgot to gather hay, and the sheep died in winter; in spring, seeing a fjord full of ice, he named the land Iceland. The hay harvest is invented.",
    "h1": "Bales",
    "h2": "Distractions",
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser."
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Høy før vinteren",
    "sub": "Trykk eller dra på skjermen for å flytte Flóki over jordet. Fang høyballene som faller og la fiskene gå forbi: en fisk i hendene er en distraksjon og teller som en feil. Samle 14 baller før tiden er ute. Tre fangede fisk avslutter spillet.",
    "perdeu": "Vinteren kom",
    "v1": "Høyet er i hus!",
    "v2": "Ifølge Landnámabók fisket Flóki så mye at han glemte å samle høy, og sauene døde om vinteren; om våren så han en fjord full av is og kalte landet Island. Høyhøstingen er oppfunnet.",
    "h1": "Baller",
    "h2": "Distraksjoner",
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
    var CFG = {"sky": 6981288, "fog": [40, 110], "hemi": [13688046, 3160106], "sun": 16773336, "sunPos": [-15, 40, 20], "cam": [0, 6.5, 13], "look": [0, 4.2, 0], "fov": 58, "fovP": 72, "target": 14, "maxe": 3, "total": 80, "bgA": "#0e2335", "bgB": "#050b12"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-floki');
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
      var items = [], hx = 0, tx = 0, hero, spawnT = 0, fall = 6, SP = 11, raven;
      function mk(kind, x) {
        var m;
        if (kind === 'hay') { m = new TH.Group(); var b = new TH.Mesh(new TH.CylinderGeometry(0.8, 0.8, 1.3, 10), mat(0xd9b84a)); b.rotation.z = Math.PI / 2; m.add(b); var s = new TH.Mesh(new TH.TorusGeometry(0.8, 0.07, 5, 10), mat(0x8a6a2a)); s.rotation.y = Math.PI / 2; m.add(s); }
        else { m = new TH.Group(); var f = new TH.Mesh(new TH.SphereGeometry(0.7, 8, 6), mat(0x9ec8e8, { shininess: 80 })); f.scale.set(1.6, 0.7, 0.6); m.add(f); var tl = new TH.Mesh(new TH.ConeGeometry(0.4, 0.7, 4), mat(0x6aa0c8)); tl.rotation.z = Math.PI / 2; tl.position.x = -1.2; m.add(tl); }
        m.position.set(x, 18, 0); scene.add(m); return m;
      }
      return {
        init: function () {
          var i, m;
          m = new TH.Mesh(new TH.PlaneGeometry(70, 30), mat(0x6a8a4a)); m.rotation.x = -Math.PI / 2; m.position.set(0, 0, -2); scene.add(m);
          m = new TH.Mesh(new TH.PlaneGeometry(140, 70), mat(0x2a5878)); m.rotation.x = -Math.PI / 2; m.position.set(0, -0.3, -38); scene.add(m);
          for (i = 0; i < 12; i++) { m = new TH.Mesh(new TH.ConeGeometry(8 + (i % 3) * 3, 16 + (i % 4) * 5, 5), mat(0x9aa8bc)); m.position.set(-60 + i * 11, 6, -70); scene.add(m); }
          for (i = 0; i < 5; i++) { var sh = new TH.Group(), bd = new TH.Mesh(new TH.SphereGeometry(0.8, 8, 6), mat(0xf0ece0)); bd.scale.set(1.3, 0.9, 1); bd.position.y = 0.9; sh.add(bd); var hd = new TH.Mesh(new TH.SphereGeometry(0.35, 6, 5), mat(0x2a2a2a)); hd.position.set(1.0, 1.1, 0); sh.add(hd); sh.position.set(-16 + i * 8, 0, -9 - (i % 2) * 3); scene.add(sh); }
          hero = new TH.Group();
          var b = new TH.Mesh(new TH.CylinderGeometry(0.45, 0.6, 1.5, 8), mat(0x6a3a2a)); b.position.y = 0.9; hero.add(b);
          var h = new TH.Mesh(new TH.SphereGeometry(0.36, 8, 6), mat(0xe8c9a0)); h.position.y = 1.95; hero.add(h);
          var bd2 = new TH.Mesh(new TH.ConeGeometry(0.34, 0.8, 6), mat(0xc0562a)); bd2.position.set(0, 1.55, 0.25); bd2.rotation.x = 2.9; hero.add(bd2);
          raven = new TH.Mesh(new TH.SphereGeometry(0.22, 6, 5), mat(0x15151c)); raven.position.set(0.5, 2.3, 0); raven.scale.set(1.3, 1, 1); hero.add(raven);
          hero.position.set(0, 0, 0); scene.add(hero);
        },
        start: function () { items.forEach(function (it) { if (it.m) scene.remove(it.m); }); items = []; hx = 0; tx = 0; spawnT = 0.5; fall = 6; },
        logic: function (dt) {
          fall = 6 + score * 0.2;
          var d = tx - hx, mv = SP * dt; hx += Math.abs(d) <= mv ? d : (d > 0 ? mv : -mv);
          spawnT -= dt;
          if (spawnT <= 0) { var k = Math.random() < 0.58 ? 'hay' : 'fish'; var x = (Math.random() * 2 - 1) * 8.5; items.push({ kind: k, x: x, y: 17, got: false, m: mk(k, x) }); spawnT = Math.max(0.5, 0.78 - score * 0.014); }
          for (var i = items.length - 1; i >= 0; i--) {
            var it = items[i]; it.y -= fall * dt;
            if (!it.got && it.y < 1.6 && it.y > -0.4 && Math.abs(it.x - hx) < 1.55) {
              it.got = true; scene.remove(it.m);
              if (it.kind === 'hay') { burst(hx, 1.6, 0, 16, 3.2, 1, 0.85, 0.35, 3); good(); } else { burst(hx, 1.6, 0, 22, 4, 0.5, 0.75, 1, 3); bad(); }
            }
            if (it.y < -1) { if (!it.got) scene.remove(it.m); items.splice(i, 1); }
          }
        },
        down: function (x) { tx = Math.max(-9, Math.min(9, (x / api.w * 2 - 1) * 9)); },
        move: function (x) { tx = Math.max(-9, Math.min(9, (x / api.w * 2 - 1) * 9)); },
        cam: function (sk) { var f = fit(); setCam(sk, 6.5 + 4 * (f - 1), 13 * f, 0, 4.2, 0); },
        anim: function (dt) {
          hero.position.x = hx; hero.rotation.z = Math.max(-0.3, Math.min(0.3, (hx - tx) * 0.05)); hero.position.y = Math.abs(Math.sin(sceneT * 9)) * 0.06 * (Math.abs(tx - hx) > 0.2 ? 1 : 0);
          raven.position.y = 2.3 + Math.sin(sceneT * 5) * 0.04;
          for (var i = 0; i < items.length; i++) { var it = items[i]; if (it.got) continue; it.m.position.set(it.x, it.y, 0); if (it.kind === 'hay') it.m.rotation.x += dt * 1.4; else it.m.rotation.z = Math.sin(sceneT * 6 + i) * 0.4; }
          this.cam(camShake(dt));
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
