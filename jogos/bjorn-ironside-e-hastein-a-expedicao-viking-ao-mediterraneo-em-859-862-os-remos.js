/* Björn e Hastein — remar até Luni (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-bjorn',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "h2": "Erros",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador.",
    "titulo": "Remar até Luni",
    "sub": "A frota de Hastein e Björn desceu a costa ibérica e entrou no Mediterrâneo. Aqui você rema no ritmo do navio. Um marcador vai e volta na barra. Toque na tela, ou aperte Espaço, quando ele estiver na faixa verde para remar até Luni. Acertar bem no meio vale dois pontos. Fora da faixa é erro. A faixa encolhe e o marcador acelera. Faça 12 pontos antes do tempo acabar. Três erros encerram o jogo.",
    "perdeu": "O remo escapou",
    "v1": "A frota chegou a Luni!",
    "v2": "Fontes de vários povos registram uma grande expedição viking ao Mediterrâneo em 859–861, liderada por Hastein e Björn. Luni é o lugar do truque do funeral falso, contado por Guilherme de Jumièges. O ritmo de remo do jogo é invenção. O jogo em si, com seus objetos e regras, é invenção.",
    "h1": "Pontos",
    "dica": "Toque quando o marcador estiver na faixa verde"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "h2": "Mistakes",
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser.",
    "titulo": "Rowing to Luni",
    "sub": "The fleet of Hastein and Björn went down the Iberian coast and entered the Mediterranean. Here you row in time with the ship. A marker runs back and forth along the bar. Tap the screen, or press Space, when it is in the green zone to row to Luni. Hitting the very middle is worth two points. Outside the zone is a mistake. The zone shrinks and the marker speeds up. Score 12 points before time runs out. Three mistakes end the game.",
    "perdeu": "The oar slipped",
    "v1": "The fleet reached Luni!",
    "v2": "Sources from several peoples record a great Viking expedition into the Mediterranean in 859–861, led by Hastein and Björn. Luni is the place of the fake funeral trick, told by William of Jumièges. The rowing rhythm in the game is invented. The game itself, with its objects and rules, is invention.",
    "h1": "Points",
    "dica": "Tap when the marker is in the green zone"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "h2": "Feil",
    "h3": "Tid",
    "carregando": "Laster 3D…",
    "sem3d": "Denne enheten kunne ikke vise 3D-grafikk. Prøv en annen nettleser.",
    "titulo": "Å ro til Luni",
    "sub": "Flåten til Hastein og Björn gikk nedover den iberiske kysten og inn i Middelhavet. Her ror du i takt med skipet. En markør går fram og tilbake på stolpen. Trykk på skjermen, eller trykk Mellomrom, når den er i den grønne sonen for å ro til Luni. Midt i blinken gir to poeng. Utenfor sonen er en feil. Sonen krymper og markøren går raskere. Få 12 poeng før tiden er ute. Tre feil avslutter spillet.",
    "perdeu": "Åra glapp",
    "v1": "Flåten nådde Luni!",
    "v2": "Kilder fra flere folk forteller om et stort vikingtokt inn i Middelhavet i 859–861, ledet av Hastein og Björn. Luni er stedet for trikset med den falske begravelsen, fortalt av Vilhelm av Jumièges. Roingsrytmen i spillet er oppfunnet. Selve spillet, med gjenstander og regler, er oppfinnelse.",
    "h1": "Poeng",
    "dica": "Trykk når markøren er i den grønne sonen"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "h2": "Errores",
    "h3": "Tiempo",
    "carregando": "Cargando el 3D…",
    "sem3d": "Este dispositivo no pudo mostrar gráficos 3D. Prueba con otro navegador.",
    "titulo": "Remar hasta Luni",
    "sub": "La flota de Hastein y Björn bajó por la costa ibérica y entró en el Mediterráneo. Aquí remas al compás del barco. Un marcador va y viene por la barra. Toca la pantalla, o pulsa Espacio, cuando esté en la franja verde para remar hasta Luni. Dar justo en el centro vale dos puntos. Fuera de la franja es un error. La franja se encoge y el marcador acelera. Haz 12 puntos antes de que acabe el tiempo. Tres errores terminan el juego.",
    "perdeu": "El remo se escapó",
    "v1": "¡La flota llegó a Luni!",
    "v2": "Fuentes de varios pueblos registran una gran expedición vikinga al Mediterráneo en 859–861, dirigida por Hastein y Björn. Luni es el lugar del truco del falso funeral, contado por Guillermo de Jumièges. El ritmo de remo del juego es invención. El juego en sí, con sus objetos y reglas, es invención.",
    "h1": "Puntos",
    "dica": "Toca cuando el marcador esté en la franja verde"
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
    var CFG = {"sky": 4881050, "fog": [30, 90], "hemi": [14741752, 1715256], "sun": 16773328, "sunPos": [-6, 22, 14], "cam": [0, 5, 9], "look": [0, 1.2, 0], "fov": 58, "fovP": 72, "target": 12, "maxe": 3, "total": 100, "bgA": "#1e3a4c", "bgB": "#060e14"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-bjorn');
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

    var PRM = {"ground": 2779786, "fx": [0.8, 0.8, 0.6]};
function mkWork() { var gr = new TH.Group(), m; m = new TH.Mesh(new TH.BoxGeometry(1.2, 0.5, 3.4), mat(0x8a5a3a)); m.position.set(0, 0.7, 0); gr.add(m); m = new TH.Mesh(new TH.ConeGeometry(0.6, 1.2, 4), mat(0x8a5a3a)); m.position.set(0, 0.8, 2.2); m.rotation.x = 1.57; gr.add(m); m = new TH.Mesh(new TH.BoxGeometry(0.3, 0.6, 0.3), mat(0x5a4028)); m.position.set(0, 1.4, 2.7); gr.add(m); m = new TH.Mesh(new TH.CylinderGeometry(0.28, 0.28, 0.08, 12), mat(0xc8302a)); m.position.set(-0.7, 1.0, -1.0); m.rotation.z = Math.PI / 2; gr.add(m); m = new TH.Mesh(new TH.CylinderGeometry(0.28, 0.28, 0.08, 12), mat(0xc8302a)); m.position.set(0.7, 1.0, -1.0); m.rotation.z = Math.PI / 2; gr.add(m); m = new TH.Mesh(new TH.CylinderGeometry(0.28, 0.28, 0.08, 12), mat(0xe8d8a0)); m.position.set(-0.7, 1.0, -0.09999999999999998); m.rotation.z = Math.PI / 2; gr.add(m); m = new TH.Mesh(new TH.CylinderGeometry(0.28, 0.28, 0.08, 12), mat(0xe8d8a0)); m.position.set(0.7, 1.0, -0.09999999999999998); m.rotation.z = Math.PI / 2; gr.add(m); m = new TH.Mesh(new TH.CylinderGeometry(0.28, 0.28, 0.08, 12), mat(0x2a5a8a)); m.position.set(-0.7, 1.0, 0.8); m.rotation.z = Math.PI / 2; gr.add(m); m = new TH.Mesh(new TH.CylinderGeometry(0.28, 0.28, 0.08, 12), mat(0x2a5a8a)); m.position.set(0.7, 1.0, 0.8); m.rotation.z = Math.PI / 2; gr.add(m); return gr; } function mkTool() { var gr = new TH.Group(), m; m = new TH.Mesh(new TH.CylinderGeometry(0.04, 0.04, 1.6, 6), mat(0x6a4a2a)); m.position.set(0, 0, 0); m.rotation.z = Math.PI / 2; gr.add(m); m = new TH.Mesh(new TH.BoxGeometry(0.4, 0.04, 0.2), mat(0x8a6a3a)); m.position.set(0.8, 0, 0); gr.add(m); return gr; } function mkDeco() { var m; m = new TH.Mesh(new TH.BoxGeometry(14, 0.3, 3), mat(0x1e5a7a)); m.position.set(0, 0.2, -6); scene.add(m); m = new TH.Mesh(new TH.BoxGeometry(2, 3, 1.2), mat(0xe0d4b8)); m.position.set(-6, 1.5, -9); scene.add(m); m = new TH.Mesh(new TH.BoxGeometry(2, 2.4, 1.2), mat(0xd8ccb0)); m.position.set(-3.6, 1.2, -9.5); scene.add(m); m = new TH.Mesh(new TH.BoxGeometry(2, 3.4, 1.2), mat(0xe8dcc0)); m.position.set(6, 1.7, -9); scene.add(m); m = new TH.Mesh(new TH.SphereGeometry(0.9, 10, 8), mat(0xf0e8c0, { emissive: 0x887744 })); m.position.set(0, 7, -17); scene.add(m); }

G = (function () {
  var m = 0, dr = 1, zc = 0.5, zw = 0.15, swing = 0, cd = 0, work = null, tool = null, tw = 0, tgl = 0;

  function hw() { var f = fit(), d = 8 * f, fv = (api.w / api.h < 0.8 ? 72 : 58) * Math.PI / 360; return d * Math.tan(fv) * (api.w / api.h); }
  function wx(x) { return (x / api.w - 0.5) * 2 * hw(); }
  function pairMk() { var o = { on: false, kind: 0, x: 0, y: 9, z: 0, v: 3, g0: mkItem(0), g1: mkItem(1) }; o.g0.visible = false; o.g1.visible = false; scene.add(o.g0); scene.add(o.g1); return o; }
  function dica() { txt(T.dica, api.w / 2, api.h - 22, Math.max(12, Math.min(15, api.w / 40)), '#ffe9a8', 'center'); }

  function newZone() { zc = rndr(0.22, 0.78); zw = Math.max(0.06, 0.15 - score * 0.006); }
  function act() {
    if (cd > 0) return; cd = 0.14; swing = 1;
    var d = Math.abs(m - zc);
    if (d <= zw) {
      if (d < zw * 0.4) { burst(0, 1.6, 0.5, 18, 2.8, PRM.fx[0], PRM.fx[1], PRM.fx[2], 3.5); good(2); }
      else { burst(0, 1.4, 0.5, 10, 2, PRM.fx[0], PRM.fx[1], PRM.fx[2], 2.5); good(1); }
      tw += 0.5; newZone();
    } else { bad(); newZone(); }
  }
  return {
    init: function () {
      var q;
      q = new TH.Mesh(new TH.PlaneGeometry(60, 40), mat(PRM.ground)); q.rotation.x = -Math.PI / 2; q.position.set(0, -0.05, -6); scene.add(q);
      mkDeco();
      work = mkWork(); work.position.set(0, 0, 0); scene.add(work);
      tool = mkTool(); tool.position.set(1.2, 3.2, 0); scene.add(tool);
    },
    start: function () { m = 0; dr = 1; swing = 0; cd = 0; tw = 0; newZone(); },
    logic: function (dt) {
      var sp = Math.min(1.9, 0.9 + score * 0.07);
      m += dr * sp * dt; if (m >= 1) { m = 1; dr = -1; } else if (m <= 0) { m = 0; dr = 1; }
      if (cd > 0) cd -= dt;
    },
    down: function () { act(); },
    move: function () {},
    key: function (c, d) { if (d && (c === 'Space' || c === 'Enter' || c === 'ArrowDown' || c === 'KeyS')) act(); },
    cam: function (sk) { var f = fit(); setCam(sk, 4 + 2 * (f - 1), 9 * f, 0, 1.6, 0); },
    anim: function (dt) {
      swing = Math.max(0, swing - dt * 4);
      tool.rotation.z = -0.7 + swing * 1.6 + Math.sin(sceneT * 2) * 0.03;
      work.scale.set(1, 0.75 + 0.5 * Math.min(1, score / CFG.target), 1);
      work.rotation.y += (tw - work.rotation.y) * Math.min(1, dt * 8);
      this.cam(camShake(dt));
    },
    hud: function () {
      var W = api.w, H = api.h, bw = Math.min(460, W * 0.82), x0 = (W - bw) / 2, by = H - 74;
      g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(x0 - 4, by - 4, bw + 8, 26);
      g.fillStyle = 'rgba(255,255,255,.16)'; g.fillRect(x0, by, bw, 18);
      g.fillStyle = '#7be08a'; g.fillRect(x0 + (zc - zw) * bw, by, 2 * zw * bw, 18);
      g.fillStyle = '#ffd870'; g.fillRect(x0 + m * bw - 3, by - 6, 6, 30);
      txt(T.dica, W / 2, by - 14, Math.max(12, Math.min(15, W / 40)), '#ffe9a8', 'center');
    },
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
