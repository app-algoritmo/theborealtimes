/* Monumento de Hunnestad — os pares de imagens (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-hunnestad',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "h2": "Erros",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador.",
    "titulo": "Os pares de imagens",
    "sub": "O monumento de Hunnestad tinha pedras com imagens, entre elas uma mulher montada num lobo com serpentes. Dezesseis pedras aparecem abertas por alguns segundos e depois se viram. Toque em duas pedras para abri-las: se as imagens forem iguais, o par fica aberto. Se forem diferentes, as duas se fecham e isso é erro. Encontre os 8 pares antes do tempo acabar. Nove erros encerram o jogo.",
    "perdeu": "As pedras se perderam",
    "v1": "Todos os pares achados!",
    "v2": "Segundo as fontes, o monumento de Hunnestad, na Escânia, tinha oito pedras quando Ole Worm o registrou: cinco com imagens, duas delas também com runas. Foi destruído, provavelmente entre 1782 e 1786, e a DR 285 foi achada numa ponte em 2020. Os pares e as pedras do jogo são invenção.",
    "h1": "Pares"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "h2": "Mistakes",
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser.",
    "titulo": "The pairs of images",
    "sub": "The Hunnestad Monument had stones with images, among them a woman riding a wolf with snakes. Sixteen stones appear open for a few seconds and then turn over. Tap two stones to open them: if the images match, the pair stays open. If they differ, both close and that is a mistake. Find the 8 pairs before time runs out. Nine mistakes end the game.",
    "perdeu": "The stones were lost",
    "v1": "All pairs found!",
    "v2": "According to the sources, the Hunnestad Monument, in Scania, had eight stones when Ole Worm recorded it: five with images, two of them also with runes. It was destroyed, probably between 1782 and 1786, and DR 285 was found in a bridge in 2020. The pairs and the stones of the game are invention.",
    "h1": "Pairs"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "h2": "Feil",
    "h3": "Tid",
    "carregando": "Laster 3D…",
    "sem3d": "Denne enheten kunne ikke vise 3D-grafikk. Prøv en annen nettleser.",
    "titulo": "Bildeparene",
    "sub": "Hunnestad-monumentet hadde steiner med bilder, blant dem en kvinne som rir på en ulv med slanger. Seksten steiner vises åpne i noen sekunder og snus så. Trykk på to steiner for å åpne dem: Hvis bildene er like, blir paret åpent. Hvis de er ulike, lukkes begge, og det er en feil. Finn de 8 parene før tiden er ute. Ni feil avslutter spillet.",
    "perdeu": "Steinene gikk tapt",
    "v1": "Alle parene er funnet!",
    "v2": "Ifølge kildene hadde Hunnestad-monumentet i Skåne åtte steiner da Ole Worm tegnet det ned: fem med bilder, to av dem også med runer. Det ble ødelagt, trolig mellom 1782 og 1786, og DR 285 ble funnet i en bro i 2020. Parene og steinene i spillet er oppfinnelse.",
    "h1": "Par"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "h2": "Errores",
    "h3": "Tiempo",
    "carregando": "Cargando el 3D…",
    "sem3d": "Este dispositivo no pudo mostrar gráficos 3D. Prueba con otro navegador.",
    "titulo": "Las parejas de imágenes",
    "sub": "El monumento de Hunnestad tenía piedras con imágenes, entre ellas una mujer montada en un lobo con serpientes. Dieciséis piedras aparecen abiertas durante unos segundos y luego se dan la vuelta. Toca dos piedras para abrirlas: si las imágenes son iguales, la pareja queda abierta. Si son distintas, las dos se cierran y eso es un error. Encuentra las 8 parejas antes de que acabe el tiempo. Nueve errores terminan el juego.",
    "perdeu": "Las piedras se perdieron",
    "v1": "¡Todas las parejas halladas!",
    "v2": "Según las fuentes, el monumento de Hunnestad, en Escania, tenía ocho piedras cuando Ole Worm lo registró: cinco con imágenes, dos de ellas también con runas. Fue destruido, probablemente entre 1782 y 1786, y la DR 285 se halló en un puente en 2020. Las parejas y las piedras del juego son invención.",
    "h1": "Parejas"
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
    var CFG = {"sky": 2372140, "fog": [30, 90], "hemi": [14214364, 1845796], "sun": 16773336, "sunPos": [0, 20, 18], "cam": [0, 2.6, 10], "look": [0, 2.0, 0], "fov": 58, "fovP": 72, "target": 8, "maxe": 9, "total": 170, "bgA": "#0e2335", "bgB": "#050b12"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-hunnestad');
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
      var C = [], face = [], matched = [], first = -1, lock = 0, peek = 0, tex = [], P = [], second = -1;
      var COL = ['#e8482a', '#f0c030', '#3a8ad8', '#4aa85a', '#e8803a', '#c84a9a', '#2aa8a8', '#8a5ad8'];
      function cx(i) { return ((i % 4) - 1.5) * 2.05; }
      function cy(i) { return 2.0 + (1.5 - Math.floor(i / 4)) * 2.05; }
      function scr() { var o = []; for (var i = 0; i < 16; i++) o.push(toScr(cx(i), cy(i), 0)); return o; }
      function faceTex(k) {
        return ctex(128, 150, function (x, w, h) {
          x.fillStyle = '#fff6dc'; x.fillRect(0, 0, w, h); x.fillStyle = COL[k]; x.strokeStyle = '#3a2a40'; x.lineWidth = 4;
          x.beginPath();
          if (k === 0) x.arc(64, 75, 38, 0, 6.283);
          else if (k === 1) { x.moveTo(64, 30); x.lineTo(104, 112); x.lineTo(24, 112); x.closePath(); }
          else if (k === 2) x.rect(30, 40, 68, 68);
          else if (k === 3) { x.moveTo(64, 28); x.lineTo(102, 75); x.lineTo(64, 122); x.lineTo(26, 75); x.closePath(); }
          else if (k === 4) { for (var q = 0; q < 10; q++) { var a = -Math.PI / 2 + q * Math.PI / 5, r = q % 2 ? 20 : 44; x.lineTo(64 + Math.cos(a) * r, 78 + Math.sin(a) * r); } x.closePath(); }
          else if (k === 5) { x.ellipse(64, 76, 28, 42, 0, 0, 6.283); }
          else if (k === 6) { x.rect(52, 30, 24, 92); x.rect(26, 56, 76, 24); }
          else { x.arc(64, 75, 40, 0, 6.283); x.moveTo(94, 75); x.arc(64, 75, 30, 0, 6.283, true); }
          x.fill(); x.stroke();
        });
      }
      function deal() {
        var a = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7];
        for (var i = 15; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; }
        face = a;
        for (var q = 0; q < 16; q++) { matched[q] = false; if (C[q] && C[q].face && C[q].face.material) C[q].face.material.map = tex[face[q]]; }
      }
      function tap(i) {
        if (peek > 0 || lock > 0 || matched[i] || i === first) return;
        if (first < 0) { first = i; api.nota(520, 0.12, 'triangle', 0.06); return; }
        second = i;
        if (face[first] === face[second]) { matched[first] = matched[second] = true; burst(cx(i), cy(i), 0.5, 14, 2.4, 1, 0.9, 0.5, 3); first = -1; second = -1; good(); }
        else { lock = 0.9; bad(); }
      }
      return {
        init: function () {
          var i, m;
          for (i = 0; i < 8; i++) tex.push(faceTex(i));
          for (i = 0; i < 16; i++) {
            var gr = new TH.Group(), bk = new TH.Mesh(new TH.PlaneGeometry(1.6, 1.85), new TH.MeshBasicMaterial({ color: 0x6a7a6a })); bk.position.z = 0.02; gr.add(bk);
            var dec = new TH.Mesh(new TH.PlaneGeometry(1.1, 1.35), new TH.MeshBasicMaterial({ color: 0xd0dccc })); dec.position.z = 0.03; gr.add(dec);
            var fc = new TH.Mesh(new TH.PlaneGeometry(1.6, 1.85), new TH.MeshBasicMaterial({ map: tex[i % 8] })); fc.rotation.y = Math.PI; fc.position.z = -0.02; gr.add(fc);
            gr.position.set(cx(i), cy(i), 0); scene.add(gr); C.push({ g: gr, face: fc, rot: 0 });
          }
          m = new TH.Mesh(new TH.PlaneGeometry(60, 30), mat(0x1c2420)); m.position.set(0, 2, -3); scene.add(m);
        },
        start: function () { first = -1; second = -1; lock = 0; peek = 4.2; deal(); P = scr(); },
        logic: function (dt) {
          if (peek > 0) peek -= dt;
          if (lock > 0) { lock -= dt; if (lock <= 0) { first = -1; second = -1; } }
        },
        down: function (x, y) { if (!P.length) P = scr(); var i = nearest(P, x, y, Math.max(36, 0.1 * Math.min(api.w, api.h))); if (i >= 0) tap(i); },
        cam: function (sk) { var f = fit() > 1 ? 1.45 : 1; setCam(sk, 2.6 + 1.5 * (f - 1), 10 * f, 0, 2.0, 0); },
        anim: function (dt) {
          for (var i = 0; i < 16; i++) {
            var up = matched[i] || peek > 0 || i === first || i === second, tr = up ? Math.PI : 0;
            C[i].rot += (tr - C[i].rot) * Math.min(1, dt * 10); C[i].g.rotation.y = C[i].rot;
          }
          this.cam(camShake(dt)); P = scr();
        },
        hud: function () { if (peek > 0) txt(String(Math.ceil(peek)), api.w / 2, api.h * 0.12, 26, '#ffe9a8', 'center'); },
        dbg: function () { return { faces: face.slice(), matched: matched.slice(), first: first, lock: lock, peek: peek, pos: scr() }; }
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
