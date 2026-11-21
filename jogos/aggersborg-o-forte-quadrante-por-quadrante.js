/* Aggersborg — o forte, quadrante por quadrante (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-aggersborg',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "h2": "Erros",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador.",
    "titulo": "O forte, quadrante por quadrante",
    "sub": "Aggersborg tinha 48 casas longas, doze em cada quadrante. Quatro quadrantes ficam dentro do anel do forte, e a madeira se acumula num de cada vez. Toque no quadrante para erguer uma casa quando a barra dele passar da marca, ou use as setas do teclado. Tocar num quadrante sem madeira, ou erguer cedo demais, é erro. Se a madeira passar da barra cheia, ela apodrece e se perde, e isso também é erro. Erga 12 casas antes do tempo acabar. Três erros encerram o jogo.",
    "perdeu": "A madeira apodreceu",
    "v1": "O forte está de pé!",
    "v2": "Aggersborg, de cerca de 980, tem 240 metros de diâmetro interno, quatro ruas em cruz e 48 casas longas, doze por quadrante. Os quadrantes, a madeira que se acumula e o ritmo do jogo são invenção.",
    "h1": "Casas"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "h2": "Mistakes",
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser.",
    "titulo": "The fort, quadrant by quadrant",
    "sub": "Aggersborg had 48 longhouses, twelve in each quadrant. Four quadrants stand inside the ring of the fort, and timber piles up in one at a time. Tap the quadrant to raise a house when its bar passes the mark, or use the arrow keys. Tapping a quadrant with no timber, or raising too early, is a mistake. If the timber passes the full bar, it rots and is lost, and that is also a mistake. Raise 12 houses before time runs out. Three mistakes end the game.",
    "perdeu": "The timber rotted",
    "v1": "The fort stands!",
    "v2": "Aggersborg, from around 980, has an inner diameter of 240 metres, four streets in a cross and 48 longhouses, twelve per quadrant. The quadrants, the timber that piles up and the rhythm of the game are invention.",
    "h1": "Houses"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "h2": "Feil",
    "h3": "Tid",
    "carregando": "Laster 3D…",
    "sem3d": "Denne enheten kunne ikke vise 3D-grafikk. Prøv en annen nettleser.",
    "titulo": "Borgen, kvadrant for kvadrant",
    "sub": "Aggersborg hadde 48 langhus, tolv i hver kvadrant. Fire kvadranter ligger innenfor borgringen, og tømmeret hoper seg opp i én om gangen. Trykk på kvadranten for å reise et hus når stolpen passerer merket, eller bruk piltastene. Å trykke på en kvadrant uten tømmer, eller reise for tidlig, er en feil. Hvis tømmeret passerer full stolpe, råtner det og går tapt, og det er også en feil. Reis 12 hus før tiden er ute. Tre feil avslutter spillet.",
    "perdeu": "Tømmeret råtnet",
    "v1": "Borgen står!",
    "v2": "Aggersborg, fra omkring 980, har en indre diameter på 240 meter, fire gater i kors og 48 langhus, tolv per kvadrant. Kvadrantene, tømmeret som hoper seg opp, og rytmen i spillet er oppfinnelse.",
    "h1": "Hus"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "h2": "Errores",
    "h3": "Tiempo",
    "carregando": "Cargando el 3D…",
    "sem3d": "Este dispositivo no pudo mostrar gráficos 3D. Prueba con otro navegador.",
    "titulo": "El fuerte, cuadrante por cuadrante",
    "sub": "Aggersborg tenía 48 casas largas, doce en cada cuadrante. Cuatro cuadrantes están dentro del anillo del fuerte, y la madera se acumula en uno cada vez. Toca el cuadrante para levantar una casa cuando su barra pase de la marca, o usa las flechas del teclado. Tocar un cuadrante sin madera, o levantar demasiado pronto, es un error. Si la madera pasa de la barra llena, se pudre y se pierde, y eso también es un error. Levanta 12 casas antes de que acabe el tiempo. Tres errores terminan el juego.",
    "perdeu": "La madera se pudrió",
    "v1": "¡El fuerte está en pie!",
    "v2": "Aggersborg, de hacia 980, tiene 240 metros de diámetro interior, cuatro calles en cruz y 48 casas largas, doce por cuadrante. Los cuadrantes, la madera que se acumula y el ritmo del juego son invención.",
    "h1": "Casas"
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
    var CFG = {"sky": 2767400, "fog": [30, 90], "hemi": [15266000, 1845784], "sun": 16773328, "sunPos": [-8, 26, 14], "cam": [0, 7, 9], "look": [0, 0.6, 0], "fov": 58, "fovP": 72, "target": 12, "maxe": 3, "total": 100, "bgA": "#0e2335", "bgB": "#050b12"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-aggersborg');
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
      var S = [{ x: -4.4, z: 0.2 }, { x: 4.4, z: 0.2 }, { x: 0, z: -3.6 }, { x: 0, z: 3.4 }], p = [0, 0, 0, 0], act = [false, false, false, false], dr = [], spT = 1.0, P = [];
      function scr() { var o = []; for (var i = 0; i < 4; i++) o.push(toScr(S[i].x, 0.9, S[i].z)); return o; }
      function rate() { return 0.3 + Math.min(score, 12) * 0.016; }
      function tap(i) {
        if (act[i] && p[i] >= 0.3) { burst(S[i].x, 1, S[i].z, 16, 2.8, 0.9, 0.95, 1, 3); act[i] = false; p[i] = 0; good(); }
        else bad();
      }
      return {
        init: function () {
          var i, m;
          m = new TH.Mesh(new TH.PlaneGeometry(90, 70), mat(0x5a6a3a)); m.rotation.x = -Math.PI / 2; m.position.set(0, -0.05, -8); scene.add(m);
          m = new TH.Mesh(new TH.BoxGeometry(3.2, 1.8, 2.6), mat(0x4a3a28)); m.position.set(0, 0.9, 0); scene.add(m);
          m = new TH.Mesh(new TH.ConeGeometry(2.7, 1.6, 4), mat(0x5a4a30)); m.position.set(0, 2.6, 0); m.rotation.y = Math.PI / 4; scene.add(m);
          m = new TH.Mesh(new TH.BoxGeometry(0.5, 1.1, 0.5), mat(0x555a66)); m.position.set(0.9, 3.0, 0.3); scene.add(m);
          for (i = 0; i < 4; i++) { m = new TH.Mesh(new TH.SphereGeometry(1.5, 10, 6, 0, 6.283, 0, 1.5708), mat(0xc8a060)); m.position.set(S[i].x, 0, S[i].z); m.scale.set(1, 0.05, 1); scene.add(m); dr.push(m); }
          for (i = 0; i < 12; i++) { m = new TH.Mesh(new TH.ConeGeometry(1.1 + (i % 3) * 0.3, 4 + (i % 4), 6), mat(0x24301c)); m.position.set(-26 + i * 4.8, 2, -16 - (i % 3) * 3); scene.add(m); }
        },
        start: function () { for (var i = 0; i < 4; i++) { p[i] = 0; act[i] = false; } spT = 1.0; P = scr(); },
        logic: function (dt) {
          var i;
          spT -= dt;
          if (spT <= 0) { var f = []; for (i = 0; i < 4; i++) if (!act[i]) f.push(i); if (f.length) { var k = f[Math.floor(Math.random() * f.length)]; act[k] = true; p[k] = 0; } spT = Math.max(0.9, 1.9 - score * 0.07); }
          for (i = 0; i < 4; i++) if (act[i]) { p[i] += rate() * dt; if (p[i] >= 1) { act[i] = false; p[i] = 0; bad(); } }
        },
        down: function (x, y) { if (!P.length) P = scr(); var i = nearest(P, x, y, Math.max(40, 0.16 * Math.min(api.w, api.h))); if (i >= 0) tap(i); },
        key: function (c, d) { if (!d) return; var n = { ArrowLeft: 0, ArrowRight: 1, ArrowUp: 2, ArrowDown: 3, KeyA: 0, KeyD: 1, KeyW: 2, KeyS: 3 }[c]; if (n !== undefined) tap(n); },
        cam: function (sk) { var f = fit(); setCam(sk, 7 + 3 * (f - 1), 9 * f, 0, 0.6, 0); },
        anim: function (dt) {
          for (var i = 0; i < 4; i++) { var h = act[i] ? 0.15 + p[i] * 1.5 : 0.05; dr[i].scale.y += (h - dr[i].scale.y) * Math.min(1, dt * 10); var sc = act[i] ? 0.6 + Math.min(1, p[i] * 1.2) * 0.5 : 0.45; dr[i].scale.x += (sc - dr[i].scale.x) * Math.min(1, dt * 10); dr[i].scale.z = dr[i].scale.x; }
          this.cam(camShake(dt)); P = scr();
        },
        hud: function () {
          for (var i = 0; i < 4; i++) {
            var q = P[i]; if (!q) continue; var w = 50, x = q.x - w / 2, y = q.y - 38;
            g.fillStyle = 'rgba(8,10,24,.7)'; g.fillRect(x - 2, y - 2, w + 4, 10);
            g.fillStyle = act[i] ? (p[i] >= 0.3 ? '#ffe9a8' : '#9fd4ff') : 'rgba(255,255,255,.12)'; g.fillRect(x, y, w * (act[i] ? p[i] : 0), 6);
            g.fillStyle = '#ffffff'; g.fillRect(x + w * 0.3 - 1, y - 3, 2, 12);
          }
        },
        dbg: function () { return { p: p.slice(), act: act.slice(), pos: scr() }; }
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
