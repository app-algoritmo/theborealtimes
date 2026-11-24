/* Atlamál — as runas de Guðrún (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-atlamal',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "h2": "Erros",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador.",
    "titulo": "As runas de Guðrún",
    "sub": "No Atlamál, Guðrún manda um aviso em runas e o mensageiro Vingi o estraga. Kostbera ainda lê o suficiente para sentir o perigo. Arraste o dedo ou o mouse, ou use as setas, para mover a bolsa de Kostbera e pegar as runas de Guðrún. Evite as runas trocadas por Vingi: cada um que cair ali é um erro. O que cair no chão não pune você. Pegue 12 antes do tempo acabar. Três erros encerram o jogo.",
    "perdeu": "O aviso se perdeu",
    "v1": "Kostbera leu o aviso!",
    "v2": "Segundo o Atlamál, Guðrún mandou um aviso em runas, Vingi o estragou e Kostbera leu o bastante para sentir o perigo. As varetas do jogo são invenção. O jogo em si, com seus objetos e regras, é invenção.",
    "h1": "Pegos",
    "dica": "Arraste para mover a cesta"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "h2": "Mistakes",
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser.",
    "titulo": "Guðrún's runes",
    "sub": "In the Atlamál, Guðrún sends a warning in runes and the messenger Vingi corrupts it. Kostbera still reads enough to sense the danger. Drag your finger or mouse, or use the arrow keys, to move Kostbera's pouch and catch Guðrún's runes. Avoid the runes swapped by Vingi: each one that lands there is a mistake. Whatever hits the ground costs you nothing. Catch 12 before time runs out. Three mistakes end the game.",
    "perdeu": "The warning was lost",
    "v1": "Kostbera read the warning!",
    "v2": "According to the Atlamál, Guðrún sent a warning in runes, Vingi corrupted it and Kostbera read enough to sense the danger. The sticks in the game are invented. The game itself, with its objects and rules, is invention.",
    "h1": "Caught",
    "dica": "Drag to move the basket"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "h2": "Feil",
    "h3": "Tid",
    "carregando": "Laster 3D…",
    "sem3d": "Denne enheten kunne ikke vise 3D-grafikk. Prøv en annen nettleser.",
    "titulo": "Gudruns runer",
    "sub": "I Atlamál sender Gudrun en advarsel i runer, og budbringeren Vingi ødelegger den. Kostbera leser likevel nok til å ane faren. Dra med fingeren eller musen, eller bruk piltastene, for å flytte Kostberas pose og fange Gudruns runer. Unngå runene Vingi byttet om: hver en som lander der, er en feil. Det som treffer bakken, koster ingenting. Fang 12 før tiden er ute. Tre feil avslutter spillet.",
    "perdeu": "Advarselen gikk tapt",
    "v1": "Kostbera leste advarselen!",
    "v2": "Ifølge Atlamál sendte Gudrun en advarsel i runer, Vingi ødela den og Kostbera leste nok til å ane faren. Pinnene i spillet er oppfunnet. Selve spillet, med gjenstander og regler, er oppfinnelse.",
    "h1": "Fanget",
    "dica": "Dra for å flytte kurven"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "h2": "Errores",
    "h3": "Tiempo",
    "carregando": "Cargando el 3D…",
    "sem3d": "Este dispositivo no pudo mostrar gráficos 3D. Prueba con otro navegador.",
    "titulo": "Las runas de Guðrún",
    "sub": "En el Atlamál, Guðrún envía un aviso en runas y el mensajero Vingi lo estropea. Kostbera aun así lee lo suficiente para presentir el peligro. Arrastra el dedo o el ratón, o usa las flechas, para mover la bolsa de Kostbera y atrapar las runas de Guðrún. Evita las runas cambiadas por Vingi: cada uno que caiga allí es un error. Lo que caiga al suelo no te castiga. Atrapa 12 antes de que acabe el tiempo. Tres errores terminan el juego.",
    "perdeu": "El aviso se perdió",
    "v1": "¡Kostbera leyó el aviso!",
    "v2": "Según el Atlamál, Guðrún envió un aviso en runas, Vingi lo estropeó y Kostbera leyó lo suficiente para presentir el peligro. Las varillas del juego son invención. El juego en sí, con sus objetos y reglas, es invención.",
    "h1": "Atrapados",
    "dica": "Arrastra para mover la cesta"
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
    var CFG = {"sky": 2897988, "fog": [30, 90], "hemi": [14215412, 1712684], "sun": 16771272, "sunPos": [-6, 22, 14], "cam": [0, 5, 9], "look": [0, 1.2, 0], "fov": 58, "fovP": 72, "target": 12, "maxe": 3, "total": 90, "bgA": "#1e2a34", "bgB": "#070b0f"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-atlamal');
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

    var PRM = {"ground": 3029572, "badP": 0.32, "fx": [0.9, 0.9, 0.5], "bx": [0.5, 0.2, 0.2]};
function mkBasket() { var gr = new TH.Group(), m; m = new TH.Mesh(new TH.BoxGeometry(1.4, 0.7, 0.8), mat(0x6a4a2c)); m.position.set(0, 0.5, 0); gr.add(m); m = new TH.Mesh(new TH.BoxGeometry(1.5, 0.15, 0.9), mat(0x8a6a3a)); m.position.set(0, 0.9, 0); gr.add(m); m = new TH.Mesh(new TH.SphereGeometry(0.2, 8, 6), mat(0xd8c8a0)); m.position.set(0, 1.0, 0); gr.add(m); return gr; } function mkItem(k) { var gr = new TH.Group(), m; if (k === 0) { m = new TH.Mesh(new TH.BoxGeometry(0.16, 0.95, 0.1), mat(0xe8e0c8)); m.position.set(0, 0.55, 0); gr.add(m); m = new TH.Mesh(new TH.BoxGeometry(0.06, 0.5, 0.04), mat(0xf0c040, { emissive: 0x886600 })); m.position.set(-0.02, 0.6, 0.07); gr.add(m); m = new TH.Mesh(new TH.BoxGeometry(0.22, 0.05, 0.04), mat(0xf0c040, { emissive: 0x886600 })); m.position.set(0.04, 0.7, 0.07); m.rotation.z = 0.5; gr.add(m); } else { m = new TH.Mesh(new TH.BoxGeometry(0.16, 0.95, 0.1), mat(0x5a2424)); m.position.set(0, 0.55, 0); gr.add(m); m = new TH.Mesh(new TH.BoxGeometry(0.05, 0.6, 0.04), mat(0x1a0a0a)); m.position.set(-0.03, 0.55, 0.07); m.rotation.z = 0.5; gr.add(m); m = new TH.Mesh(new TH.BoxGeometry(0.05, 0.4, 0.04), mat(0x1a0a0a)); m.position.set(0.04, 0.6, 0.07); m.rotation.z = -0.6; gr.add(m); } return gr; } function mkDeco() { var m; m = new TH.Mesh(new TH.BoxGeometry(14, 0.2, 5), mat(0x3a4650)); m.position.set(0, 0.05, -5); scene.add(m); m = new TH.Mesh(new TH.SphereGeometry(5, 12, 8), mat(0x5a6a78)); m.position.set(-8, -2.6, -12); m.scale.set(2, 0.7, 1); scene.add(m); m = new TH.Mesh(new TH.SphereGeometry(5, 12, 8), mat(0x4e5e6c)); m.position.set(9, -2.8, -13); m.scale.set(2, 0.8, 1); scene.add(m); m = new TH.Mesh(new TH.SphereGeometry(0.9, 10, 8), mat(0xf0e8c0, { emissive: 0x887744 })); m.position.set(6, 6.5, -16); scene.add(m); }

G = (function () {
  var pool = [], bx = 0, tx = 0, bm = null, spawnT = 0;

  function hw() { var f = fit(), d = 8 * f, fv = (api.w / api.h < 0.8 ? 72 : 58) * Math.PI / 360; return d * Math.tan(fv) * (api.w / api.h); }
  function wx(x) { return (x / api.w - 0.5) * 2 * hw(); }
  function pairMk() { var o = { on: false, kind: 0, x: 0, y: 9, z: 0, v: 3, g0: mkItem(0), g1: mkItem(1) }; o.g0.visible = false; o.g1.visible = false; scene.add(o.g0); scene.add(o.g1); return o; }
  function dica() { txt(T.dica, api.w / 2, api.h - 22, Math.max(12, Math.min(15, api.w / 40)), '#ffe9a8', 'center'); }

  function setT(x) { var h = hw() * 0.92; tx = Math.max(-h, Math.min(h, wx(x))); }
  return {
    init: function () {
      var m, i;
      m = new TH.Mesh(new TH.PlaneGeometry(60, 40), mat(PRM.ground)); m.rotation.x = -Math.PI / 2; m.position.set(0, -0.05, -6); scene.add(m);
      mkDeco();
      bm = mkBasket(); bm.position.set(0, 0, 1); scene.add(bm);
      for (i = 0; i < 14; i++) pool.push(pairMk());
    },
    start: function () { var i; bx = tx = 0; spawnT = 0.6; for (i = 0; i < pool.length; i++) pool[i].on = false; },
    logic: function (dt) {
      var i, o, h = hw() * 0.92;
      if (input.l) tx -= 9 * dt; if (input.r) tx += 9 * dt;
      tx = Math.max(-h, Math.min(h, tx)); bx += (tx - bx) * Math.min(1, dt * 14);
      spawnT -= dt;
      if (spawnT <= 0) {
        for (i = 0; i < pool.length; i++) if (!pool[i].on) { o = pool[i]; o.on = true; o.kind = Math.random() < PRM.badP ? 1 : 0; o.x = rndr(-h, h); o.y = 8; o.v = Math.min(6.2, 3 + score * 0.14); break; }
        spawnT = Math.max(0.42, 0.95 - score * 0.035);
      }
      for (i = 0; i < pool.length; i++) {
        o = pool[i]; if (!o.on) continue; o.y -= o.v * dt;
        if (o.y < 1.15 && o.y > 0.3 && Math.abs(o.x - bx) < 1.3) {
          o.on = false;
          if (o.kind === 0) { burst(o.x, 1.3, 1, 12, 2.2, PRM.fx[0], PRM.fx[1], PRM.fx[2], 3); good(); }
          else { burst(o.x, 1.3, 1, 10, 2, PRM.bx[0], PRM.bx[1], PRM.bx[2], 2); bad(); }
          if (st !== 'play') return;
        } else if (o.y < -0.6) o.on = false;
      }
    },
    down: function (x) { setT(x); },
    move: function (x) { setT(x); },
    key: function () {},
    cam: function (sk) { var f = fit(); setCam(sk, 5 + 2.5 * (f - 1), 9 * f, 0, 1.2, 0); },
    anim: function (dt) {
      var i, o, gm;
      for (i = 0; i < pool.length; i++) {
        o = pool[i]; o.g0.visible = o.on && o.kind === 0; o.g1.visible = o.on && o.kind === 1;
        gm = o.kind === 0 ? o.g0 : o.g1; gm.position.set(o.x, o.y, 1); gm.rotation.y += dt * 2;
      }
      bm.position.set(bx, 0, 1); bm.rotation.z = (tx - bx) * -0.06;
      this.cam(camShake(dt));
    },
    hud: function () { dica(); },
    dbg: function () { return {}; }
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
