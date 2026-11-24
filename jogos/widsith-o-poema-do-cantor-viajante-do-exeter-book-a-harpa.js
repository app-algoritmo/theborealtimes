/* Widsith — a harpa do cantor (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-widsith',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "h2": "Erros",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador.",
    "titulo": "A harpa do cantor",
    "sub": "Widsith é um cantor viajante que percorre cortes e povos. Aqui você marca o ritmo da harpa que acompanha a canção. Um marcador vai e volta na barra. Toque na tela, ou aperte Espaço, quando ele estiver na faixa verde para tocar a harpa do cantor. Acertar bem no meio vale dois pontos. Fora da faixa é erro. A faixa encolhe e o marcador acelera. Faça 12 pontos antes do tempo acabar. Três erros encerram o jogo.",
    "perdeu": "A corda arrebentou",
    "v1": "A canção chegou ao fim!",
    "v2": "Widsith, poema anglo-saxão de 143 versos preservado no Exeter Book, lista reis, povos e heróis visitados por um cantor viajante. A harpa e o ritmo do jogo são invenção. O jogo em si, com seus objetos e regras, é invenção.",
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
    "titulo": "The singer's harp",
    "sub": "Widsith is a travelling singer who goes from court to court and people to people. Here you keep the beat of the harp that goes with the song. A marker runs back and forth along the bar. Tap the screen, or press Space, when it is in the green zone to play the singer's harp. Hitting the very middle is worth two points. Outside the zone is a mistake. The zone shrinks and the marker speeds up. Score 12 points before time runs out. Three mistakes end the game.",
    "perdeu": "The string snapped",
    "v1": "The song reached its end!",
    "v2": "Widsith, an Anglo-Saxon poem of 143 lines preserved in the Exeter Book, lists kings, peoples and heroes visited by a travelling singer. The harp and the rhythm in the game are invented. The game itself, with its objects and rules, is invention.",
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
    "titulo": "Sangerens harpe",
    "sub": "Widsith er en reisende sanger som drar fra hoff til hoff og folk til folk. Her holder du takten på harpen som følger sangen. En markør går fram og tilbake på stolpen. Trykk på skjermen, eller trykk Mellomrom, når den er i den grønne sonen for å spille sangerens harpe. Midt i blinken gir to poeng. Utenfor sonen er en feil. Sonen krymper og markøren går raskere. Få 12 poeng før tiden er ute. Tre feil avslutter spillet.",
    "perdeu": "Strengen røyk",
    "v1": "Sangen nådde slutten!",
    "v2": "Widsith, et angelsaksisk dikt på 143 vers bevart i Exeter Book, lister opp konger, folk og helter som en reisende sanger besøkte. Harpen og rytmen i spillet er oppfunnet. Selve spillet, med gjenstander og regler, er oppfinnelse.",
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
    "titulo": "El arpa del cantor",
    "sub": "Widsith es un cantor viajero que recorre cortes y pueblos. Aquí marcas el ritmo del arpa que acompaña la canción. Un marcador va y viene por la barra. Toca la pantalla, o pulsa Espacio, cuando esté en la franja verde para tocar el arpa del cantor. Dar justo en el centro vale dos puntos. Fuera de la franja es un error. La franja se encoge y el marcador acelera. Haz 12 puntos antes de que acabe el tiempo. Tres errores terminan el juego.",
    "perdeu": "Se rompió la cuerda",
    "v1": "¡La canción llegó al final!",
    "v2": "Widsith, poema anglosajón de 143 versos conservado en el Libro de Exeter, enumera reyes, pueblos y héroes visitados por un cantor viajero. El arpa y el ritmo del juego son invención. El juego en sí, con sus objetos y reglas, es invención.",
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
    var CFG = {"sky": 4865580, "fog": [30, 90], "hemi": [15786176, 2760720], "sun": 16767120, "sunPos": [-6, 22, 14], "cam": [0, 5, 9], "look": [0, 1.2, 0], "fov": 58, "fovP": 72, "target": 12, "maxe": 3, "total": 100, "bgA": "#2e2618", "bgB": "#0c0904"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-widsith');
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

    var PRM = {"ground": 4864552, "fx": [1, 0.85, 0.4]};
function mkWork() { var gr = new TH.Group(), m; m = new TH.Mesh(new TH.BoxGeometry(0.22, 2.6, 0.3), mat(0x7a5a3a)); m.position.set(-0.9, 1.5, 0); gr.add(m); m = new TH.Mesh(new TH.BoxGeometry(2.2, 0.22, 0.3), mat(0x7a5a3a)); m.position.set(0.1, 2.7, 0); gr.add(m); m = new TH.Mesh(new TH.BoxGeometry(2.0, 0.2, 0.4), mat(0x5a4028)); m.position.set(0.1, 0.2, 0); gr.add(m); m = new TH.Mesh(new TH.CylinderGeometry(0.025, 0.025, 2.20, 5), mat(0xf0d060, { emissive: 0x886600 })); m.position.set(-0.55, 1.5, 0); gr.add(m); m = new TH.Mesh(new TH.CylinderGeometry(0.025, 0.025, 2.05, 5), mat(0xf0d060, { emissive: 0x886600 })); m.position.set(-0.27, 1.58, 0); gr.add(m); m = new TH.Mesh(new TH.CylinderGeometry(0.025, 0.025, 1.90, 5), mat(0xf0d060, { emissive: 0x886600 })); m.position.set(0.010000000000000009, 1.66, 0); gr.add(m); m = new TH.Mesh(new TH.CylinderGeometry(0.025, 0.025, 1.75, 5), mat(0xf0d060, { emissive: 0x886600 })); m.position.set(0.29000000000000004, 1.74, 0); gr.add(m); m = new TH.Mesh(new TH.CylinderGeometry(0.025, 0.025, 1.60, 5), mat(0xf0d060, { emissive: 0x886600 })); m.position.set(0.5700000000000001, 1.82, 0); gr.add(m); m = new TH.Mesh(new TH.CylinderGeometry(0.025, 0.025, 1.45, 5), mat(0xf0d060, { emissive: 0x886600 })); m.position.set(0.8500000000000001, 1.9, 0); gr.add(m); return gr; } function mkTool() { var gr = new TH.Group(), m; m = new TH.Mesh(new TH.CylinderGeometry(0.04, 0.04, 1.6, 6), mat(0x6a4a2a)); m.position.set(0, 0, 0); m.rotation.z = Math.PI / 2; gr.add(m); m = new TH.Mesh(new TH.SphereGeometry(0.16, 8, 6), mat(0xe8d8a0)); m.position.set(-0.85, 0, 0); gr.add(m); return gr; } function mkDeco() { var m; m = new TH.Mesh(new TH.BoxGeometry(14, 6, 0.5), mat(0x3e3226)); m.position.set(0, 3, -7); scene.add(m); m = new TH.Mesh(new TH.BoxGeometry(2, 3.4, 0.3), mat(0x6a4a30)); m.position.set(-5, 1.7, -6.6); scene.add(m); m = new TH.Mesh(new TH.ConeGeometry(0.25, 0.7, 6), mat(0xff8a2a, { emissive: 0xaa4400 })); m.position.set(-2, 3.6, -6.4); scene.add(m); m = new TH.Mesh(new TH.ConeGeometry(0.25, 0.7, 6), mat(0xff8a2a, { emissive: 0xaa4400 })); m.position.set(2, 3.6, -6.4); scene.add(m); m = new TH.Mesh(new TH.BoxGeometry(3.2, 0.5, 1.1), mat(0x5a4028)); m.position.set(4.6, 0.9, -5); scene.add(m); }

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
