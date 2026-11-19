/* Tanngrisnir e Tanngnjóstr — o carro dos bodes (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-tanngrisnir',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O carro dos bodes",
    "sub": "Conduza o carro de Thor pelo caminho de rocha. Toque na tela, ou use Espaço, para pular as pedras. Não pule sob as vigas: fique no chão. Junte ossos, os do chão e os do alto, sem deixar nenhum quebrado. Reúna 16 ossos antes do tempo acabar. Três batidas encerram o jogo.",
    "perdeu": "O carro tombou",
    "v1": "Ossos a salvo!",
    "v2": "Na Edda em Prosa, Thor come os bodes à noite e os traz de volta ao amanhecer, e nenhum osso pode ser quebrado. A corrida do carro é invenção.",
    "h1": "Ossos",
    "h2": "Batidas",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador."
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The goat chariot",
    "sub": "Drive Thor's chariot along the rocky road. Tap the screen, or press Space, to jump the rocks. Do not jump under the beams: stay on the ground. Gather bones, the ones on the ground and the ones up high, without breaking any. Collect 16 bones before time runs out. Three crashes end the game.",
    "perdeu": "The chariot overturned",
    "v1": "Bones safe!",
    "v2": "In the Prose Edda, Thor eats the goats at night and brings them back at dawn, and no bone may be broken. The chariot race is invented.",
    "h1": "Bones",
    "h2": "Crashes",
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser."
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Bukkevogna",
    "sub": "Kjør vognen til Tor langs den steinete veien. Trykk på skjermen, eller trykk mellomrom, for å hoppe over steinene. Ikke hopp under bjelkene: bli på bakken. Samle bein, de på bakken og de oppe i lufta, uten å brekke noen. Samle 16 bein før tiden er ute. Tre kollisjoner avslutter spillet.",
    "perdeu": "Vogna veltet",
    "v1": "Beina er i trygghet!",
    "v2": "I Den yngre Edda spiser Tor bukkene om kvelden og henter dem tilbake ved daggry, og ingen bein må brytes. Vognferden er oppfunnet.",
    "h1": "Bein",
    "h2": "Kollisjoner",
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
    var CFG = {"sky": 1778739, "fog": [40, 120], "hemi": [11581640, 2761752], "sun": 16770752, "sunPos": [20, 40, 10], "cam": [0, 5.2, 9], "look": [0, 1.4, -12], "fov": 58, "fovP": 72, "target": 16, "maxe": 3, "total": 85, "bgA": "#0e2335", "bgB": "#050b12"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-tanngrisnir');
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
      var items = [], py = 0, vy = 0, air = false, speed = 14, dist = 0, nextAt = 0, cart, goats = [], road, wh = [], stripes = [], lg = 0;
      function mk(kind, z) {
        var it = { kind: kind, z: z, y: 0.6, got: false, m: null };
        if (kind === 'rock') { it.m = new TH.Mesh(new TH.DodecahedronGeometry(1.25, 0), mat(0x6a6f78)); it.m.position.set(0, 0.9, z); it.m.scale.set(1.4, 1, 1.2); }
        else if (kind === 'beam') {
          it.m = new TH.Group(); var t = new TH.Mesh(new TH.BoxGeometry(7.4, 0.55, 0.7), mat(0x7a4a26)); t.position.y = 2.25; it.m.add(t);
          for (var s = -1; s <= 1; s += 2) { var p = new TH.Mesh(new TH.BoxGeometry(0.5, 2.5, 0.6), mat(0x5a3818)); p.position.set(s * 3.5, 1.2, 0); it.m.add(p); }
          it.m.position.z = z;
        } else { it.m = new TH.Group(); var b = new TH.Mesh(new TH.CylinderGeometry(0.1, 0.1, 0.8, 6), mat(0xf2ecdc, { emissive: 0x555040 })); b.rotation.z = Math.PI / 2; it.m.add(b); for (var e = -1; e <= 1; e += 2) { var k = new TH.Mesh(new TH.SphereGeometry(0.17, 6, 5), mat(0xf2ecdc, { emissive: 0x555040 })); k.position.x = e * 0.4; it.m.add(k); } it.m.position.set(0, it.y, z); }
        scene.add(it.m); items.push(it);
      }
      function spawn(z) {
        var r = Math.random();
        if (r < 0.33) { mk('rock', z); it_high(z); }
        else if (r < 0.73) { mk('beam', z); for (var i = -1; i <= 1; i++) mk('bone', z + i * 2.2); }
        else { for (var j = -1; j <= 1; j++) mk('bone', z + j * 2.2); }
      }
      function it_high(z) { mk('bone', z - 1.3); items[items.length - 1].y = 2.7; items[items.length - 1].m.position.y = 2.7; }
      function clear() { items.forEach(function (it) { if (it.m) { scene.remove(it.m); } }); items = []; }
      return {
        init: function () {
          var i, m;
          road = new TH.Mesh(new TH.PlaneGeometry(9, 220), mat(0x8a7a62)); road.rotation.x = -Math.PI / 2; road.position.set(0, 0, -95); scene.add(road);
          m = new TH.Mesh(new TH.PlaneGeometry(160, 220), mat(0x37452f)); m.rotation.x = -Math.PI / 2; m.position.set(0, -0.05, -95); scene.add(m);
          for (i = 0; i < 24; i++) { m = new TH.Mesh(new TH.BoxGeometry(0.4, 0.05, 2.4), mat(0xb8a888)); m.position.set(0, 0.03, -i * 9); scene.add(m); stripes.push(m); }
          for (i = 0; i < 16; i++) { m = new TH.Mesh(new TH.ConeGeometry(8 + (i % 3) * 3, 20 + (i % 4) * 6, 5), mat(0x4c5666)); m.position.set((i % 2 ? 1 : -1) * (22 + (i % 5) * 9), 7, -30 - i * 11); scene.add(m); }
          cart = new TH.Group();
          var bx = new TH.Mesh(new TH.BoxGeometry(2, 0.7, 2.6), mat(0x6b3f22)); bx.position.y = 1; cart.add(bx);
          for (i = -1; i <= 1; i += 2) { var w = new TH.Mesh(new TH.CylinderGeometry(0.62, 0.62, 0.22, 10), mat(0x3a2312)); w.rotation.z = Math.PI / 2; w.position.set(i * 1.1, 0.62, 0.3); cart.add(w); wh.push(w); }
          var th = new TH.Mesh(new TH.CylinderGeometry(0.3, 0.42, 1.1, 8), mat(0xb3382c)); th.position.set(0, 1.9, 0.2); cart.add(th);
          var hd = new TH.Mesh(new TH.SphereGeometry(0.32, 8, 6), mat(0xe8c9a0)); hd.position.set(0, 2.7, 0.2); cart.add(hd);
          var bd = new TH.Mesh(new TH.ConeGeometry(0.3, 0.6, 6), mat(0xc0562a)); bd.position.set(0, 2.45, 0.5); bd.rotation.x = 2.9; cart.add(bd);
          var hm = new TH.Mesh(new TH.BoxGeometry(0.2, 0.5, 0.5), mat(0x777777)); hm.position.set(0.55, 2.0, 0.1); cart.add(hm);
          for (i = -1; i <= 1; i += 2) {
            var g0 = new TH.Group(), bo = new TH.Mesh(new TH.BoxGeometry(0.9, 0.9, 1.6), mat(0xd8d2c4)); bo.position.y = 0.9; g0.add(bo);
            var he = new TH.Mesh(new TH.BoxGeometry(0.6, 0.6, 0.8), mat(0xe8e2d4)); he.position.set(0, 1.3, -1.1); g0.add(he);
            for (var c = -1; c <= 1; c += 2) { var hr = new TH.Mesh(new TH.ConeGeometry(0.12, 0.7, 5), mat(0x7b6a4a)); hr.position.set(c * 0.25, 1.85, -1.1); hr.rotation.z = -c * 0.35; g0.add(hr); }
            for (var l = 0; l < 4; l++) { var lg0 = new TH.Mesh(new TH.BoxGeometry(0.18, 0.7, 0.18), mat(0x4a3a28)); lg0.position.set(((l & 1) ? 1 : -1) * 0.3, 0.35, (l & 2) ? 0.55 : -0.55); g0.add(lg0); }
            g0.position.set(i * 0.95, 0, -2.2); cart.add(g0); goats.push(g0);
          }
          scene.add(cart);
        },
        start: function () { clear(); py = 0; vy = 0; air = false; speed = 14; dist = 0; nextAt = 40; lg = 0; },
        logic: function (dt) {
          speed = 14 + score * 0.25; dist += speed * dt;
          while (dist + 120 > nextAt) { spawn(-(nextAt - dist)); nextAt += 26 + Math.random() * 8; }
          if (air) { vy -= 38 * dt; py += vy * dt; if (py <= 0) { py = 0; vy = 0; air = false; } }
          for (var i = items.length - 1; i >= 0; i--) {
            var it = items[i]; it.z += speed * dt;
            if (!it.got && Math.abs(it.z) < (it.kind === 'bone' ? 1.2 : 1.3)) {
              if (it.kind === 'bone') {
                var hi = it.y > 1.5;
                if ((hi && py > 1.2) || (!hi && py < 1.2)) { it.got = true; burst(0, it.y + 0.3, 0, 12, 3, 1, 1, 0.8, 3); scene.remove(it.m); good(); }
              } else if (it.kind === 'rock' && py < 1.15) { it.got = true; burst(0, 1, 0, 28, 5, 0.8, 0.7, 0.5, 4); scene.remove(it.m); bad(); }
              else if (it.kind === 'beam' && py > 0.3) { it.got = true; burst(0, 2, 0, 28, 5, 0.8, 0.7, 0.5, 4); scene.remove(it.m); bad(); }
            }
            if (it.z > 8) { if (it.m && !it.got) scene.remove(it.m); items.splice(i, 1); }
          }
        },
        down: function () { if (!air) { air = true; vy = 15; api.nota(330, 0.15, 'sine', 0.06); } },
        key: function (c, d) { if (d && c === 'Space') G.down(); },
        anim: function (dt) {
          for (var i = 0; i < items.length; i++) { var it = items[i]; if (it.got) continue; it.m.position.z = it.z; if (it.kind === 'bone') it.m.rotation.y += dt * 2; }
          cart.position.y = py; lg += dt * speed * 0.35;
          for (i = 0; i < wh.length; i++) wh[i].rotation.x = -lg * 1.4;
          for (i = 0; i < goats.length; i++) goats[i].position.y = Math.abs(Math.sin(lg * 2 + i)) * 0.25 * (air ? 0.3 : 1);
          for (i = 0; i < stripes.length; i++) { var m = stripes[i]; m.position.z = ((-i * 9 + dist) % 216 + 216) % 216 - 200 + 0; }
          if (!air && Math.random() < 0.5) emit((Math.random() - 0.5) * 2, 0.3, 0.8, (Math.random() - 0.5), 1.2, 3, 0.9, 0.7, 0.4, 0.5);
          var sk = camShake(dt); setCam(sk, 5.2 + py * 0.3, 9, 0, 1.4, -12);
        },
        dbg: function () { return { py: py, air: air, speed: speed, items: items.filter(function (it) { return !it.got; }).map(function (it) { return { kind: it.kind, z: it.z, y: it.y }; }), pos: [{ x: 400, y: 200 }] }; }
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
