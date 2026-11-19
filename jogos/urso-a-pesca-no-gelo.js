/* O urso de rabo curto — a pesca no gelo (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-ursocauda',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A pesca no gelo",
    "sub": "O urso quer pescar no gelo, como a raposa ensinou. Toque na tela, ou use Espaço, para pôr o rabo no buraco. Quando a água borbulhar, toque de novo para puxar e pegar o peixe. Puxar sem peixe é erro, e deixar o rabo tempo demais congela e quebra. Pegue 6 peixes antes do tempo acabar. Três erros encerram o jogo.",
    "perdeu": "O rabo quebrou",
    "v1": "Peixes pescados!",
    "v2": "No conto de Asbjørnsen e Moe, a raposa convence o urso a pescar com o rabo num buraco no gelo, e o rabo congela e quebra. É assim, diz o conto, que o urso ficou de rabo curto. A pesca em rodadas é invenção.",
    "h1": "Peixes",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador.",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Fishing through the ice",
    "sub": "The bear wants to fish on the ice, as the fox taught him. Tap the screen, or press Space, to put his tail in the hole. When the water bubbles, tap again to pull and catch the fish. Pulling without a fish is a mistake, and leaving the tail in too long freezes and breaks it. Catch 6 fish before time runs out. Three mistakes end the game.",
    "perdeu": "The tail broke",
    "v1": "Fish caught!",
    "v2": "In the tale by Asbjørnsen and Moe, the fox persuades the bear to fish with his tail in a hole in the ice, and the tail freezes and breaks. That is how, says the tale, the bear came to have a short tail. The fishing in rounds is invented.",
    "h1": "Fish",
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser.",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Fiske gjennom isen",
    "sub": "Bjørnen vil fiske på isen, slik reven lærte ham. Trykk på skjermen, eller trykk mellomrom, for å stikke halen i hullet. Når vannet bobler, trykker du igjen for å dra opp og få fisken. Å dra uten fisk er en feil, og å la halen bli for lenge fryser den og knekker den. Fang 6 fisk før tiden er ute. Tre feil avslutter spillet.",
    "perdeu": "Halen knakk",
    "v1": "Fisken er fanget!",
    "v2": "I eventyret til Asbjørnsen og Moe får reven bjørnen til å fiske med halen i et hull i isen, og halen fryser og knekker. Slik, sier eventyret, fikk bjørnen kort hale. Fisketurene i runder er oppfunnet.",
    "h1": "Fisk",
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
    var CFG = {"sky": 4876946, "fog": [40, 110], "hemi": [11058392, 2897992], "sun": 15261904, "sunPos": [-15, 40, 20], "cam": [0, 5.5, 10], "look": [0, 1.2, 0], "fov": 58, "fovP": 72, "target": 6, "maxe": 3, "total": 100, "bgA": "#0e2335", "bgB": "#050b12"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-ursocauda');
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
      var ph = 'out', cold = 0, bite = 0, nextBite = 1.2, tail, hole, bear, bub = 0, fox, wait = 0;
      function tap() {
        if (wait > 0) return;
        if (ph === 'out') { ph = 'in'; cold = 0; bite = 0; nextBite = 1.0 + Math.random() * 1.2; api.nota(260, 0.12, 'sine', 0.05); return; }
        if (bite > 0) { burst(0, 0.8, 1.6, 20, 3.5, 0.6, 0.85, 1, 4); ph = 'out'; wait = 0.5; good(); }
        else { ph = 'out'; wait = 0.5; bad(); }
      }
      return {
        init: function () {
          var i, m;
          m = new TH.Mesh(new TH.CylinderGeometry(22, 22, 1.2, 28), mat(0x9cbcd6, { shininess: 90 })); m.position.set(0, -0.7, 0); scene.add(m);
          m = new TH.Mesh(new TH.PlaneGeometry(140, 80), mat(0x8aa4c0)); m.rotation.x = -Math.PI / 2; m.position.set(0, -1.4, -20); scene.add(m);
          for (i = 0; i < 12; i++) { m = new TH.Mesh(new TH.ConeGeometry(8 + (i % 3) * 3, 16 + (i % 4) * 5, 5), mat(0x6a84a8)); m.position.set(-60 + i * 11, 6, -50); scene.add(m); }
          for (i = 0; i < 6; i++) { m = new TH.Mesh(new TH.ConeGeometry(1.4, 5, 6), mat(0x2a5a3a)); m.position.set(-14 + i * 5.5, 2.2, -14 - (i % 2) * 3); scene.add(m); }
          hole = new TH.Mesh(new TH.CylinderGeometry(1.4, 1.4, 0.3, 16), mat(0x0a2a4a)); hole.position.set(0, -0.05, 1.8); scene.add(hole);
          bear = new TH.Group();
          var bd = new TH.Mesh(new TH.SphereGeometry(1.5, 10, 8), mat(0x6b4a2c)); bd.scale.set(1.3, 1, 1.1); bd.position.set(0, 1.5, -1.0); bear.add(bd);
          var hd = new TH.Mesh(new TH.SphereGeometry(0.85, 9, 7), mat(0x7a5a38)); hd.position.set(-1.9, 2.2, -1.0); bear.add(hd);
          var ns = new TH.Mesh(new TH.SphereGeometry(0.3, 6, 5), mat(0x20202a)); ns.position.set(-2.7, 2.1, -1.0); bear.add(ns);
          for (var s = -1; s <= 1; s += 2) { var lg = new TH.Mesh(new TH.CylinderGeometry(0.4, 0.45, 1.4, 7), mat(0x5a3a20)); lg.position.set(-0.8 + (s > 0 ? 1.6 : 0), 0.6, -1.0 + s * 0.7); bear.add(lg); }
          bear.position.set(0, 0, 0); scene.add(bear);
          tail = new TH.Mesh(new TH.CylinderGeometry(0.22, 0.2, 1, 6), mat(0x7a5a38)); tail.position.set(1.6, 0.9, 1.0); scene.add(tail);
          fox = new TH.Group();
          var fb = new TH.Mesh(new TH.SphereGeometry(0.7, 8, 6), mat(0xd9702a)); fb.scale.set(1.5, 0.9, 0.9); fb.position.y = 0.8; fox.add(fb);
          var fh = new TH.Mesh(new TH.ConeGeometry(0.4, 0.9, 5), mat(0xd9702a)); fh.rotation.z = Math.PI / 2; fh.position.set(-1.3, 1.0, 0); fox.add(fh);
          var ft = new TH.Mesh(new TH.ConeGeometry(0.4, 1.4, 5), mat(0xf4f0e8)); ft.rotation.z = -Math.PI / 2; ft.position.set(1.7, 0.9, 0); fox.add(ft);
          fox.position.set(-8, 0, 3); scene.add(fox);
        },
        start: function () { ph = 'out'; cold = 0; bite = 0; wait = 0; },
        logic: function (dt) {
          if (wait > 0) wait -= dt;
          if (ph === 'in') {
            cold += dt / 6.2;
            if (bite > 0) bite -= dt; else { nextBite -= dt; if (nextBite <= 0) { bite = 0.8; nextBite = 1.0 + Math.random() * 1.1; api.nota(700, 0.1, 'triangle', 0.06); } }
            if (cold >= 1) { burst(1.6, 0.8, 1.2, 22, 4, 0.8, 0.9, 1, 3); ph = 'out'; wait = 0.6; cold = 0; bite = 0; bad(); }
          }
        },
        down: function () { tap(); },
        key: function (c, d) { if (d && c === 'Space') tap(); },
        cam: function (sk) { var f = fit(); setCam(sk, 5.5 + 3 * (f - 1), 10 * f, 0, 1.2, 0); },
        anim: function (dt) {
          if (ph === 'in') { tail.position.set(1.6 - 1.0 * Math.min(1, cold * 4), 0.35, 1.0 + 0.8 * Math.min(1, cold * 4)); tail.scale.y = 1.6; tail.rotation.z = 0.2 + Math.min(1, cold * 4) * 0.5; tail.material.color.setHex(cold > 0.7 ? 0xbfe0f4 : 0x7a5a38); }
          else { tail.position.set(1.6, 0.9, 1.0); tail.scale.y = 1; tail.rotation.z = 0; tail.material.color.setHex(0x7a5a38); }
          if (bite > 0) { bub += dt; burst((Math.random() - 0.5) * 1.6, 0.3, 1.8, 1, 0.7, 0.7, 0.9, 1, 3); hole.material.color.setHex(0x1a6aa0); } else hole.material.color.setHex(0x0a2a4a);
          fox.position.y = Math.abs(Math.sin(sceneT * 3)) * 0.05;
          this.cam(camShake(dt));
        },
        hud: function () { if (ph === 'in') { var W = api.w, H = api.h; g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(W / 2 - 80, H - 30, 160, 8); g.fillStyle = cold > 0.7 ? '#e07a6a' : '#9ad0f0'; g.fillRect(W / 2 - 80, H - 30, 160 * Math.min(1, cold), 8); } },
        dbg: function () { return { ph: ph, bite: bite > 0, cold: cold, wait: wait, pos: [{ x: api.w / 2, y: api.h / 2 }] }; }
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
