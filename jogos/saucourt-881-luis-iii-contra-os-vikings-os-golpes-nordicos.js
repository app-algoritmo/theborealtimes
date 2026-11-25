/* Saucourt — os golpes nórdicos (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-saucourt',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "h2": "Erros",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador.",
    "titulo": "Os golpes de Saucourt",
    "sub": "Em 881, em Saucourt, os francos de Luís III enfrentaram um exército viking. Aqui você defende com o escudo cada golpe dos nórdicos. Golpes vêm da esquerda, do centro ou da direita. Toque no terço da tela de onde o golpe vem, ou use as setas ou as teclas 1, 2 e 3, para defender. Defender para o lado errado, ou tarde demais, é erro. Defenda 14 golpes antes do tempo acabar. Três erros encerram o jogo.",
    "perdeu": "O escudo rachou",
    "v1": "Vitória franca!",
    "v2": "Em 3 de agosto de 881, os reis francos Luís III e Carlomano II derrotaram os vikings em Saucourt; os Anais de Fulda falam em cerca de nove mil mortos, número provavelmente exagerado. A vitória foi celebrada no Ludwigslied, poema em alto-alemão antigo. Os golpes do jogo são invenção. O jogo em si, com seus objetos e regras, é invenção.",
    "h1": "Defesas",
    "dica": "Toque no lado de onde vem o golpe"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "h2": "Mistakes",
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser.",
    "titulo": "The blows of Saucourt",
    "sub": "In 881, at Saucourt, the Franks of Louis III faced a Viking army. Here you block with the shield every blow from the Norse. Blows come from the left, the centre or the right. Tap the third of the screen the blow comes from, or use the arrow keys or keys 1, 2 and 3, to block. Blocking the wrong side, or too late, is a mistake. Block 14 blows before time runs out. Three mistakes end the game.",
    "perdeu": "The shield cracked",
    "v1": "Frankish victory!",
    "v2": "On 3 August 881, the Frankish kings Louis III and Carloman II defeated the Vikings at Saucourt; the Annals of Fulda speak of about nine thousand dead, a figure probably exaggerated. The victory was celebrated in the Ludwigslied, a poem in Old High German. The blows in the game are invented. The game itself, with its objects and rules, is invention.",
    "h1": "Blocks",
    "dica": "Tap the side the blow comes from"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "h2": "Feil",
    "h3": "Tid",
    "carregando": "Laster 3D…",
    "sem3d": "Denne enheten kunne ikke vise 3D-grafikk. Prøv en annen nettleser.",
    "titulo": "Slagene ved Saucourt",
    "sub": "I 881 møtte frankerne til Ludvig 3. en vikinghær ved Saucourt. Her forsvarer du deg med skjoldet mot hvert slag fra nordboerne. Slag kommer fra venstre, midten eller høyre. Trykk på den tredjedelen av skjermen slaget kommer fra, eller bruk piltastene eller tastene 1, 2 og 3, for å parere. Å parere feil side, eller for sent, er en feil. Parer 14 slag før tiden er ute. Tre feil avslutter spillet.",
    "perdeu": "Skjoldet sprakk",
    "v1": "Frankisk seier!",
    "v2": "Den 3. august 881 beseiret de frankiske kongene Ludvig 3. og Karloman 2. vikingene ved Saucourt; Fuldaannalene taler om rundt ni tusen døde, et tall som trolig er overdrevet. Seieren ble feiret i Ludwigslied, et dikt på gammelhøytysk. Slagene i spillet er oppfunnet. Selve spillet, med gjenstander og regler, er oppfinnelse.",
    "h1": "Parader",
    "dica": "Trykk på siden slaget kommer fra"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "h2": "Errores",
    "h3": "Tiempo",
    "carregando": "Cargando el 3D…",
    "sem3d": "Este dispositivo no pudo mostrar gráficos 3D. Prueba con otro navegador.",
    "titulo": "Los golpes de Saucourt",
    "sub": "En 881, en Saucourt, los francos de Luis III se enfrentaron a un ejército vikingo. Aquí defiendes con el escudo cada golpe de los nórdicos. Los golpes vienen de la izquierda, del centro o de la derecha. Toca el tercio de la pantalla de donde viene el golpe, o usa las flechas o las teclas 1, 2 y 3, para parar. Parar el lado equivocado, o tarde, es un error. Para 14 golpes antes de que acabe el tiempo. Tres errores terminan el juego.",
    "perdeu": "El escudo se agrietó",
    "v1": "¡Victoria franca!",
    "v2": "El 3 de agosto de 881, los reyes francos Luis III y Carlomán II derrotaron a los vikingos en Saucourt; los Anales de Fulda hablan de unos nueve mil muertos, cifra probablemente exagerada. La victoria fue celebrada en el Ludwigslied, un poema en alto alemán antiguo. Los golpes del juego son invención. El juego en sí, con sus objetos y reglas, es invención.",
    "h1": "Paradas",
    "dica": "Toca el lado de donde viene el golpe"
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
    var CFG = {"sky": 10128026, "fog": [30, 90], "hemi": [16051432, 2366492], "sun": 16767168, "sunPos": [-6, 22, 14], "cam": [0, 5, 9], "look": [0, 1.2, 0], "fov": 58, "fovP": 72, "target": 14, "maxe": 3, "total": 100, "bgA": "#4a3e4a", "bgB": "#0c0a0e"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-saucourt');
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

    var PRM = {"ground": 5921338, "arena": 6974022, "fx": [1, 0.9, 0.8]};
function mkWarrior() { var gr = new TH.Group(), m; m = new TH.Mesh(new TH.SphereGeometry(0.95, 8, 6), mat(0x3a4a8a)); m.position.set(0, 1.2, 0); m.scale.set(1.2, 1.3, 1); gr.add(m); m = new TH.Mesh(new TH.SphereGeometry(0.5, 8, 6), mat(0xe0c8b0)); m.position.set(0, 2.6, 0); gr.add(m); m = new TH.Mesh(new TH.SphereGeometry(0.1, 6, 5), mat(0xf0c030, { emissive: 0xaa8800 })); m.position.set(-0.18, 2.65, 0.45); gr.add(m); m = new TH.Mesh(new TH.SphereGeometry(0.1, 6, 5), mat(0xf0c030, { emissive: 0xaa8800 })); m.position.set(0.18, 2.65, 0.45); gr.add(m); m = new TH.Mesh(new TH.CylinderGeometry(0.85, 0.85, 0.14, 16), mat(0xa8352a)); m.position.set(0, 1.4, 0.95); m.rotation.x = Math.PI / 2; gr.add(m); m = new TH.Mesh(new TH.TorusGeometry(0.62, 0.07, 6, 16), mat(0x4a4a46)); m.position.set(0, 1.4, 1.03); gr.add(m); return gr; } function mkBlow() { var gr = new TH.Group(), m; m = new TH.Mesh(new TH.CylinderGeometry(0.05, 0.05, 1.4, 6), mat(0x4a3a28)); m.position.set(0, 0, 0); m.rotation.x = Math.PI / 2; gr.add(m); m = new TH.Mesh(new TH.BoxGeometry(0.1, 0.5, 0.4), mat(0xa8acb8)); m.position.set(0, 0.16, 0.75); gr.add(m); return gr; } function mkDeco() { var m; m = new TH.Mesh(new TH.BoxGeometry(16, 0.3, 4), mat(0x5a5a3a)); m.position.set(0, 0.0, -9); scene.add(m); m = new TH.Mesh(new TH.BoxGeometry(3.0, 3.4, 2.4), mat(0x8a8a84)); m.position.set(-5.4, 1.7, -10); scene.add(m); m = new TH.Mesh(new TH.ConeGeometry(2.2, 1.6, 4), mat(0x4a3a2a)); m.position.set(-5.4, 4.2, -10); m.rotation.y = 0.78; scene.add(m); m = new TH.Mesh(new TH.BoxGeometry(0.1, 2.4, 0.1), mat(0x4a3a28)); m.position.set(5.4, 1.2, -8); scene.add(m); m = new TH.Mesh(new TH.BoxGeometry(1.0, 0.8, 0.05), mat(0xa8352a)); m.position.set(5.8, 2.2, -8); scene.add(m); m = new TH.Mesh(new TH.BoxGeometry(16, 3, 0.4), mat(0xc8a8a0)); m.position.set(0, 1.5, -13); scene.add(m); m = new TH.Mesh(new TH.SphereGeometry(0.9, 10, 8), mat(0xf0e8c0, { emissive: 0x887744 })); m.position.set(5, 7, -16); scene.add(m); }

G = (function () {
  var dir = -1, T0 = 2, Tt = 2, gap = 0.6, hero = null, blk = null, marks = [], tilt = 0, last = -1, rep = 0;

  function hw() { var f = fit(), d = 8 * f, fv = (api.w / api.h < 0.8 ? 72 : 58) * Math.PI / 360; return d * Math.tan(fv) * (api.w / api.h); }
  function wx(x) { return (x / api.w - 0.5) * 2 * hw(); }
  function pairMk() { var o = { on: false, kind: 0, x: 0, y: 9, z: 0, v: 3, g0: mkItem(0), g1: mkItem(1) }; o.g0.visible = false; o.g1.visible = false; scene.add(o.g0); scene.add(o.g1); return o; }
  function dica() { txt(T.dica, api.w / 2, api.h - 22, Math.max(12, Math.min(15, api.w / 40)), '#ffe9a8', 'center'); }

  function newBlow() { var d; do { d = Math.floor(Math.random() * 3); } while (d === last && rep >= 2); rep = d === last ? rep + 1 : 1; last = d; dir = d; T0 = Math.max(1.05, 2.0 - score * 0.09); Tt = T0; }
  function act(d) {
    if (dir < 0 || gap > 0) return;
    tilt = (d - 1) * 0.6;
    if (d === dir) { burst((dir - 1) * 1.7, 1.5, 1.5, 16, 2.6, PRM.fx[0], PRM.fx[1], PRM.fx[2], 3); api.nota(300 + 60 * d, 0.15, 'square', 0.05); dir = -1; gap = 0.45; good(); }
    else { dir = -1; gap = 0.5; bad(); }
  }
  return {
    init: function () {
      var m, i;
      m = new TH.Mesh(new TH.PlaneGeometry(60, 40), mat(PRM.ground)); m.rotation.x = -Math.PI / 2; m.position.set(0, -0.05, -6); scene.add(m);
      m = new TH.Mesh(new TH.CylinderGeometry(5, 5, 0.1, 24), mat(PRM.arena)); m.position.set(0, 0.0, 0); scene.add(m);
      mkDeco();
      for (i = 0; i < 3; i++) { m = new TH.Mesh(new TH.CylinderGeometry(0.8, 0.8, 0.06, 16), mat(0x6a6a7a)); m.position.set((i - 1) * 3.2, 0.08, 1.6); scene.add(m); marks.push(m); }
      hero = mkWarrior(); hero.position.set(0, 0, 1.2); scene.add(hero);
      blk = mkBlow(); blk.visible = false; scene.add(blk);
    },
    start: function () { dir = -1; gap = 0.6; tilt = 0; last = -1; rep = 0; },
    logic: function (dt) {
      if (gap > 0) { gap -= dt; return; }
      if (dir < 0) { newBlow(); return; }
      Tt -= dt; if (Tt <= 0) { dir = -1; gap = 0.5; bad(); }
    },
    down: function (x) { act(x < api.w / 3 ? 0 : (x > api.w * 2 / 3 ? 2 : 1)); },
    move: function () {},
    key: function (c, d) {
      if (!d) return; var n = { ArrowLeft: 0, KeyA: 0, Digit1: 0, ArrowUp: 1, KeyW: 1, Digit2: 1, ArrowDown: 1, Space: 1, ArrowRight: 2, KeyD: 2, Digit3: 2 }[c];
      if (n !== undefined) act(n);
    },
    cam: function (sk) { var f = fit(); setCam(sk, 4.4 + 2.2 * (f - 1), 9 * f, 0, 1.4, 0); },
    anim: function (dt) {
      var i, p;
      tilt *= Math.max(0, 1 - dt * 6); hero.rotation.y = tilt;
      if (dir >= 0) { p = 1 - Tt / T0; blk.visible = true; blk.position.set((dir - 1) * (7 * (1 - p) + 1.9 * p), 3.4 * (1 - p) + 1.4 * p, -9 * (1 - p) + 1.5 * p); blk.rotation.z += dt * 9; } else blk.visible = false;
      for (i = 0; i < 3; i++) marks[i].material.color.setHex(dir === i ? 0xffe08a : 0x6a6a7a);
      this.cam(camShake(dt));
    },
    hud: function () { dica(); },
    dbg: function () { return { dir: dir, gap: gap }; }
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
