/* Bjarni — sem bússola (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-bjarni',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Sem bússola",
    "sub": "Bjarni segue para a Groenlândia sem mapa nem bússola, e o vento empurra o navio para os lados. A seta no alto mostra para onde o vento sopra. Toque do lado esquerdo da tela, ou aperte a seta para a esquerda, para virar o leme à esquerda, e do lado direito, ou a seta para a direita, para virar à direita. Mantenha o navio dentro da faixa verde. Sair dela é erro, e o navio volta ao centro. Navegue 14 trechos antes do tempo acabar. Três erros encerram o jogo.",
    "perdeu": "O navio se perdeu",
    "v1": "No rumo!",
    "v2": "Segundo a Saga dos Groenlandeses, Bjarni errou o rumo para a Groenlândia, sem mapa nem bússola, e avistou três terras sem desembarcar. Os ventos e os trechos do jogo são invenção.",
    "h1": "Trechos",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador.",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "No compass",
    "sub": "Bjarni sails for Greenland with no map or compass, and the wind pushes the ship sideways. The arrow at the top shows where the wind blows. Tap the left side of the screen, or press the left arrow, to turn the helm left, and the right side, or the right arrow, to turn right. Keep the ship inside the green band. Leaving it is a mistake, and the ship returns to the centre. Sail 14 stretches before time runs out. Three mistakes end the game.",
    "perdeu": "The ship was lost",
    "v1": "On course!",
    "v2": "According to the Greenlanders' Saga, Bjarni missed his course to Greenland, with no map or compass, and sighted three lands without landing. The winds and the stretches of the game are invention.",
    "h1": "Stretches",
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser.",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Uten kompass",
    "sub": "Bjarni seiler mot Grønland uten kart og kompass, og vinden skyver skipet sidelengs. Pila øverst viser hvor vinden blåser. Trykk på venstre side av skjermen, eller trykk venstrepila, for å svinge roret til venstre, og på høyre side, eller høyrepila, for å svinge til høyre. Hold skipet innenfor det grønne feltet. Å gå utenfor er en feil, og skipet settes tilbake i midten. Seil 14 strekninger før tiden er ute. Tre feil avslutter spillet.",
    "perdeu": "Skipet gikk seg bort",
    "v1": "På kurs!",
    "v2": "Ifølge Grønlendingenes saga kom Bjarni ut av kurs mot Grønland, uten kart og kompass, og så tre land uten å gå i land. Vindene og strekningene i spillet er oppdiktet.",
    "h1": "Strekninger",
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
    var CFG = {"sky": 9083048, "fog": [20, 70], "hemi": [14213352, 2767432], "sun": 15790312, "sunPos": [-10, 26, 10], "cam": [0, 5, 9], "look": [0, 1.2, -4], "fov": 58, "fovP": 72, "target": 14, "maxe": 3, "total": 80, "bgA": "#0e2335", "bgB": "#050b12"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-bjarni');
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
      var h = 0, w = 0, wT = 0, inT = 0, ship, sea = [], BAND = 0.7;
      function steer(d) { h += d * 0.3; }
      return {
        init: function () {
          var i, m;
          m = new TH.Mesh(new TH.PlaneGeometry(120, 120), mat(0x2f4a62)); m.rotation.x = -Math.PI / 2; m.position.set(0, -0.2, -20); scene.add(m);
          for (i = 0; i < 14; i++) { m = new TH.Mesh(new TH.BoxGeometry(2.4, 0.06, 0.18), mat(0xc8d8e8)); m.position.set(((i * 7) % 16) - 8, -0.1, -i * 3.2); scene.add(m); sea.push(m); }
          ship = new TH.Group();
          var hl = new TH.Mesh(new TH.BoxGeometry(1.4, 0.7, 4), mat(0x6a4a28)); hl.position.y = 0.3; ship.add(hl);
          var ms = new TH.Mesh(new TH.CylinderGeometry(0.08, 0.08, 3.4, 5), mat(0x5a3a20)); ms.position.set(0, 2.2, 0); ship.add(ms);
          var sl = new TH.Mesh(new TH.BoxGeometry(2.4, 2.2, 0.08), mat(0xe8e0d0)); sl.position.set(0, 2.5, 0); ship.add(sl);
          ship.position.set(0, 0, -2); scene.add(ship);
          for (i = 0; i < 5; i++) { m = new TH.Mesh(new TH.ConeGeometry(4 + i, 3 + (i % 2) * 2, 5), mat(0x4a6a58)); m.position.set(-18 + i * 9, 0.4, -50); m.scale.y = 0.7; scene.add(m); }
        },
        start: function () { h = 0; w = 0; wT = 0; inT = 0; },
        logic: function (dt) {
          wT -= dt; if (wT <= 0) { w = (Math.random() < 0.5 ? -1 : 1) * (0.28 + Math.random() * 0.2); wT = 1.2 + Math.random() * 0.8; }
          h += w * dt;
          if (Math.abs(h) > BAND) { h = 0; inT = 0; bad(); }
          else { inT += dt; if (inT >= 1.1) { inT = 0; prog(1); api.nota(520, 0.12, 'sine', 0.05); } }
        },
        down: function (x) { steer(x < api.w / 2 ? -1 : 1); },
        key: function (c, d) { if (!d) return; if (c === 'ArrowLeft' || c === 'KeyA') steer(-1); else if (c === 'ArrowRight' || c === 'KeyD') steer(1); },
        cam: function (sk) { var f = fit(); setCam(sk, 5 + 3 * (f - 1), 9 * f, 0, 1.2, -4); },
        anim: function (dt) {
          ship.position.x += (h * 4 - ship.position.x) * Math.min(1, dt * 6); ship.rotation.y = -h * 0.5; ship.rotation.z = Math.sin(sceneT * 2) * 0.05 + w * 0.1;
          for (var i = 0; i < sea.length; i++) { sea[i].position.z += 6 * dt; if (sea[i].position.z > 6) sea[i].position.z -= 44; }
          this.cam(camShake(dt));
        },
        hud: function () {
          var W = api.w, H = api.h, bw = Math.min(260, W - 60), x0 = W / 2 - bw / 2, y0 = H - 34;
          g.fillStyle = 'rgba(0,0,0,.5)'; g.fillRect(x0, y0, bw, 12);
          g.fillStyle = 'rgba(80,190,110,.85)'; g.fillRect(x0 + bw * 0.15, y0, bw * 0.7, 12);
          g.fillStyle = '#ffe9a8'; g.fillRect(x0 + bw * (0.5 + h / (BAND * 2) * 0.7) - 3, y0 - 4, 6, 20);
          txt(w > 0 ? '▶ ▶' : '◀ ◀', W / 2, H * 0.2, 22, '#cfe4ff', 'center');
        },
        dbg: function () { return { h: h, w: w, pos: [{ x: api.w * 0.25, y: api.h / 2 }, { x: api.w * 0.75, y: api.h / 2 }] }; }
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
