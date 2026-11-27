/* Möttuls saga — o manto da prova (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-mottuls',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "h2": "Erros",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador.",
    "titulo": "O manto da prova",
    "sub": "Na Möttuls saga, um manto que testa a fidelidade chega à corte do rei Artús e só cai bem em quem foi fiel. Aqui você toca nos mantos que caem bem e evita os que ficam tortos. Toque em os mantos que caem bem assim que aparecer, ou use as teclas 1 a 6. Não toque em os mantos tortos: isso é erro. O que sumir sozinho não pune você. Pegue 12 antes do tempo acabar. Três erros encerram o jogo.",
    "perdeu": "O manto te denunciou",
    "v1": "Todos os mantos provados!",
    "v2": "A Möttuls saga, também chamada Skikkju saga, traduz um conto francês do começo do século XIII sobre um manto que testa a fidelidade e chega à corte do rei Artús. Foi traduzida sob o patrocínio do rei Hákon Hákonarson, ganhou uma longa introdução sobre Artús e troca os nomes de alguns personagens. Os manuscritos completos são do século XVII. O jogo em si, com seus objetos e regras, é invenção.",
    "h1": "Acertos",
    "dica": "Toque no que aparecer, menos no que não serve"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "h2": "Mistakes",
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser.",
    "titulo": "The cloak of the test",
    "sub": "In the Möttuls saga, a cloak that tests fidelity arrives at King Artús's court and hangs well only on those who were faithful. Here you tap the cloaks that hang well and avoid the ones that hang crooked. Tap the cloaks that hang well as soon as it appears, or use keys 1 to 6. Do not tap the crooked cloaks: that is a mistake. Whatever disappears by itself costs you nothing. Get 12 before time runs out. Three mistakes end the game.",
    "perdeu": "The cloak gave you away",
    "v1": "All the cloaks tested!",
    "v2": "The Möttuls saga, also called Skikkju saga, translates a French tale of the early thirteenth century about a cloak that tests fidelity and arrives at King Artús's court. It was translated under the patronage of King Hákon Hákonarson, gained a long introduction about Artús and misnames some characters. The complete manuscripts are from the seventeenth century. The game itself, with its objects and rules, is invention.",
    "h1": "Hits",
    "dica": "Tap what appears, except the wrong ones"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "h2": "Feil",
    "h3": "Tid",
    "carregando": "Laster 3D…",
    "sem3d": "Denne enheten kunne ikke vise 3D-grafikk. Prøv en annen nettleser.",
    "titulo": "Kappen som prøve",
    "sub": "I Möttuls saga kommer en kappe som tester troskap til kong Artús' hoff og henger bare pent på dem som har vært trofaste. Her trykker du på kappene som henger pent og unngår dem som henger skjevt. Trykk på kappene som henger pent så snart det dukker opp, eller bruk tastene 1 til 6. Ikke trykk på de skjeve kappene: det er en feil. Det som forsvinner av seg selv, koster ingenting. Ta 12 før tiden er ute. Tre feil avslutter spillet.",
    "perdeu": "Kappen avslørte deg",
    "v1": "Alle kappene er prøvd!",
    "v2": "Möttuls saga, også kalt Skikkju saga, oversetter en fransk fortelling fra begynnelsen av 1200-tallet om en kappe som tester troskap og kommer til kong Artús' hoff. Den ble oversatt under beskyttelse av kong Håkon Håkonsson, fikk en lang innledning om Artús og gir noen personer feil navn. De fullstendige håndskriftene er fra 1600-tallet. Selve spillet, med gjenstander og regler, er oppfinnelse.",
    "h1": "Treff",
    "dica": "Trykk på det som dukker opp, unntatt de gale"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "h2": "Errores",
    "h3": "Tiempo",
    "carregando": "Cargando el 3D…",
    "sem3d": "Este dispositivo no pudo mostrar gráficos 3D. Prueba con otro navegador.",
    "titulo": "El manto de la prueba",
    "sub": "En la Möttuls saga, un manto que pone a prueba la fidelidad llega a la corte del rey Artús y solo cae bien a quien fue fiel. Aquí tocas los mantos que caen bien y evitas los que quedan torcidos. Toca los mantos que caen bien en cuanto aparezca, o usa las teclas 1 a 6. No toques los mantos torcidos: eso es un error. Lo que desaparezca solo no te castiga. Consigue 12 antes de que acabe el tiempo. Tres errores terminan el juego.",
    "perdeu": "El manto te delató",
    "v1": "¡Todos los mantos probados!",
    "v2": "La Möttuls saga, también llamada Skikkju saga, traduce un cuento francés de principios del siglo XIII sobre un manto que pone a prueba la fidelidad y llega a la corte del rey Artús. Se tradujo bajo el patrocinio del rey Hákon Hákonarson, ganó una larga introducción sobre Artús y confunde los nombres de algunos personajes. Los manuscritos completos son del siglo XVII. El juego en sí, con sus objetos y reglas, es invención.",
    "h1": "Aciertos",
    "dica": "Toca lo que aparezca, menos lo que no sirve"
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
    var CFG = {"sky": 3811898, "fog": [30, 90], "hemi": [15786216, 1314324], "sun": 16769216, "sunPos": [-6, 22, 14], "cam": [0, 5, 9], "look": [0, 1.2, 0], "fov": 58, "fovP": 72, "target": 12, "maxe": 3, "total": 100, "bgA": "#3a2a3a", "bgB": "#0a060a"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-mottuls');
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

    var PRM = {"ground": 5917274, "mound": 6968936, "badP": 0.35, "fx": [1, 0.85, 0.5], "bx": [0.8, 0.2, 0.2], "sp0": 3, "mode": "pop"};
function mkItem(k) { var gr = new TH.Group(), m; if (k === 0) { m = new TH.Mesh(new TH.BoxGeometry(0.5, 0.7, 0.1), mat(0x2f7a4a)); m.position.set(0, 0.5, 0); gr.add(m); m = new TH.Mesh(new TH.BoxGeometry(0.5, 0.06, 0.12), mat(0xc8a03a, { emissive: 0x554400 })); m.position.set(0, 0.82, 0.01); gr.add(m); m = new TH.Mesh(new TH.SphereGeometry(0.12, 6, 5), mat(0xc8a03a, { emissive: 0x554400 })); m.position.set(0, 0.8, 0.08); gr.add(m); } else { m = new TH.Mesh(new TH.BoxGeometry(0.5, 0.45, 0.1), mat(0x8a2a4a)); m.position.set(0.08, 0.4, 0); m.rotation.z = 0.5; gr.add(m); m = new TH.Mesh(new TH.BoxGeometry(0.3, 0.3, 0.1), mat(0x6a1a3a)); m.position.set(-0.18, 0.6, 0); m.rotation.z = -0.4; gr.add(m); m = new TH.Mesh(new TH.SphereGeometry(0.1, 6, 5), mat(0xc02828, { emissive: 0x701010 })); m.position.set(0, 0.8, 0.08); gr.add(m); } return gr; } function mkDeco() { var m; m = new TH.Mesh(new TH.BoxGeometry(14, 6, 0.5), mat(0x3a2a3a)); m.position.set(0, 3, -8); scene.add(m); m = new TH.Mesh(new TH.BoxGeometry(5.0, 0.5, 1.6), mat(0x6a4a2a)); m.position.set(-4.6, 0.6, -7.4); scene.add(m); m = new TH.Mesh(new TH.BoxGeometry(0.16, 2.4, 0.16), mat(0x8a6a2a)); m.position.set(-6.4, 1.8, -7.4); scene.add(m); m = new TH.Mesh(new TH.BoxGeometry(1.4, 1.9, 0.08), mat(0xb02a2a)); m.position.set(-6.4, 2.2, -7.38); scene.add(m); m = new TH.Mesh(new TH.BoxGeometry(1.0, 1.0, 1.0), mat(0x7a7a82)); m.position.set(5.2, 0.5, -7.4); scene.add(m); m = new TH.Mesh(new TH.SphereGeometry(0.4, 8, 6), mat(0xe0c8a8)); m.position.set(5.2, 1.4, -7.4); scene.add(m); m = new TH.Mesh(new TH.SphereGeometry(0.9, 10, 8), mat(0xf0e8c0, { emissive: 0x887744 })); m.position.set(0, 7, -16); scene.add(m); }

G = (function () {
  var S = [], spawnT = 0, arrows = [], bow = null, fly = PRM.mode === 'fly', ROWS = [1.3, 2.7, 4.1];

  function hw() { var f = fit(), d = 8 * f, fv = (api.w / api.h < 0.8 ? 72 : 58) * Math.PI / 360; return d * Math.tan(fv) * (api.w / api.h); }
  function wx(x) { return (x / api.w - 0.5) * 2 * hw(); }
  function pairMk() { var o = { on: false, kind: 0, x: 0, y: 9, z: 0, v: 3, g0: mkItem(0), g1: mkItem(1) }; o.g0.visible = false; o.g1.visible = false; scene.add(o.g0); scene.add(o.g1); return o; }
  function dica() { txt(T.dica, api.w / 2, api.h - 22, Math.max(12, Math.min(15, api.w / 40)), '#ffe9a8', 'center'); }

  var XS = [-3.8, 0, 3.8], ZS = [-0.9, 1.9];
  function pos(s) { return fly ? { x: s.x, y: s.y + 0.4, z: 0 } : { x: s.x, y: 0.9, z: s.z }; }
  function resolve(s) {
    var p = pos(s); s.on = false; s.lock = false;
    if (s.kind === 0) { burst(p.x, p.y + 0.4, p.z, 14, 2.4, PRM.fx[0], PRM.fx[1], PRM.fx[2], 3); good(); }
    else { burst(p.x, p.y + 0.4, p.z, 10, 2, PRM.bx[0], PRM.bx[1], PRM.bx[2], 2); bad(); }
  }
  function tapAt(x, y) {
    var i, s, p, q, best = -1, bd = Math.pow(Math.max(46, 0.14 * Math.min(api.w, api.h)), 2), d;
    for (i = 0; i < S.length; i++) {
      s = S[i]; if (!s.on || s.lock || (!fly && s.up < 0.35)) continue;
      p = pos(s); q = toScr(p.x, p.y, p.z); d = (q.x - x) * (q.x - x) + (q.y - y) * (q.y - y);
      if (d < bd) { bd = d; best = i; }
    }
    if (best < 0) return;
    s = S[best];
    if (!fly) { resolve(s); return; }
    s.lock = true; var a = null, k; for (k = 0; k < arrows.length; k++) if (!arrows[k].on) { a = arrows[k]; break; }
    if (!a) { resolve(s); return; }
    a.on = true; a.t = 0; a.s = s; api.nota(520, 0.12, 'triangle', 0.05);
  }
  return {
    init: function () {
      var m, i, s, n = fly ? 8 : 6;
      m = new TH.Mesh(new TH.PlaneGeometry(60, 40), mat(PRM.ground)); m.rotation.x = -Math.PI / 2; m.position.set(0, -0.05, -6); scene.add(m);
      mkDeco();
      for (i = 0; i < n; i++) {
        s = { on: false, lock: false, kind: 0, x: XS[i % 3], z: ZS[Math.floor(i / 3)], y: 1.3, up: 0, t: 0, vx: 0, g0: mkItem(0), g1: mkItem(1) };
        s.g0.visible = false; s.g1.visible = false; scene.add(s.g0); scene.add(s.g1);
        if (!fly) { m = new TH.Mesh(new TH.CylinderGeometry(1.25, 1.55, 0.35, 14), mat(PRM.mound)); m.position.set(s.x, 0.1, s.z); scene.add(m); }
        S.push(s);
      }
      if (fly) {
        bow = mkBow(); bow.position.set(0, 0.2, 4.4); scene.add(bow);
        for (i = 0; i < 4; i++) { m = new TH.Mesh(new TH.CylinderGeometry(0.04, 0.04, 1.2, 5), mat(0xe8e0c8)); m.rotation.x = Math.PI / 2; m.visible = false; scene.add(m); arrows.push({ on: false, t: 0, s: null, m: m }); }
      }
    },
    start: function () { var i; spawnT = 0.5; for (i = 0; i < S.length; i++) { S[i].on = false; S[i].lock = false; } for (i = 0; i < arrows.length; i++) arrows[i].on = false; },
    logic: function (dt) {
      var i, s, free = [], h = hw();
      spawnT -= dt;
      for (i = 0; i < S.length; i++) if (!S[i].on) free.push(S[i]);
      if (spawnT <= 0 && free.length) {
        s = free[Math.floor(Math.random() * free.length)]; s.on = true; s.lock = false; s.kind = Math.random() < PRM.badP ? 1 : 0;
        if (fly) { var dir = Math.random() < 0.5 ? -1 : 1; s.y = ROWS[Math.floor(Math.random() * 3)]; s.x = -dir * (h + 1.5); s.vx = dir * Math.min(6.5, PRM.sp0 + score * 0.18); }
        else { s.up = 0; s.t = Math.max(0.95, 1.9 - score * 0.07); }
        spawnT = Math.max(0.42, 0.9 - score * 0.03);
      }
      for (i = 0; i < S.length; i++) {
        s = S[i]; if (!s.on) continue;
        if (fly) { if (!s.lock) s.x += s.vx * dt; if (Math.abs(s.x) > h + 2.2) { s.on = false; s.lock = false; } }
        else { s.t -= dt; s.up = s.t > 0.25 ? Math.min(1, s.up + dt * 6) : Math.max(0, s.up - dt * 5); if (s.t <= 0) s.on = false; }
      }
      for (i = 0; i < arrows.length; i++) {
        var a = arrows[i]; if (!a.on) continue; a.t += dt / 0.2;
        if (a.t >= 1) { a.on = false; a.m.visible = false; if (a.s.on) resolve(a.s); if (st !== 'play') return; }
      }
    },
    down: function (x, y) { tapAt(x, y); },
    move: function () {},
    key: function (c, d) { if (!d || fly) return; var n = { Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3, Digit5: 4, Digit6: 5 }[c]; if (n !== undefined && S[n] && S[n].on && S[n].up > 0.35) resolve(S[n]); },
    cam: function (sk) { var f = fit(); if (fly) setCam(sk, 3 + 2.5 * (f - 1), 10 * f, 0, 2.2, 0); else setCam(sk, 5.5 + 2.5 * (f - 1), 8.5 * f, 0, 0.8, 0.4); },
    anim: function (dt) {
      var i, s, gm, p, a;
      for (i = 0; i < S.length; i++) {
        s = S[i]; s.g0.visible = s.on && s.kind === 0 && (fly || s.up > 0.02); s.g1.visible = s.on && s.kind === 1 && (fly || s.up > 0.02);
        gm = s.kind === 0 ? s.g0 : s.g1;
        if (fly) gm.position.set(s.x, s.y, 0); else { gm.position.set(s.x, -1.0 + 1.25 * s.up, s.z); gm.scale.set(1, Math.max(0.05, s.up), 1); }
      }
      for (i = 0; i < arrows.length; i++) {
        a = arrows[i]; if (!a.on) continue; a.m.visible = true; p = a.s;
        a.m.position.set(p.x * a.t, 0.9 + (p.y + 0.4 - 0.9) * a.t, 4.2 + (0 - 4.2) * a.t);
        a.m.lookAt(p.x, p.y + 0.4, 0);
      }
      if (bow) { var tgt = 0; for (i = 0; i < arrows.length; i++) if (arrows[i].on) tgt = Math.atan2(arrows[i].s.x, 4.2); bow.rotation.y += (-tgt * 0.6 - bow.rotation.y) * Math.min(1, dt * 12); }
      this.cam(camShake(dt));
    },
    hud: function () { dica(); },
    dbg: function () { var o = [], i; for (i = 0; i < S.length; i++) o.push(S[i].on && S[i].up > 0.5 ? S[i].kind : -1); return { slots: o }; }
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
