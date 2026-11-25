/* Limerick — as moedas de prata (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-limerick',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "h2": "Erros",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador.",
    "titulo": "As moedas do Shannon",
    "sub": "Em Limerick, os nórdicos viviam do comércio e da pirataria no rio Shannon. Aqui você corre pela margem em três pistas, recolhe as moedas de prata e desvia das lanças irlandesas. Corra por três pistas. Toque na metade esquerda ou direita da tela, ou use as setas, para trocar de pista. Pegue as moedas de prata e desvie de as lanças: bater neles é erro. Pegue 12 antes do tempo acabar. Três erros encerram o jogo.",
    "perdeu": "Uma lança o alcançou",
    "v1": "Você chegou ao barco!",
    "v2": "Os nórdicos se fixaram na King's Island, em Limerick, provavelmente em 922. Em Sulcoit, em 967, os Dál gCais de Mathgamain e Brian Boru os derrotaram; o relato mais vivo vem do Cogad Gáedel re Gallaib, escrito mais de um século depois. A corrida, as moedas e as lanças do jogo são invenção. O jogo em si, com seus objetos e regras, é invenção.",
    "h1": "Coletados",
    "dica": "Toque na esquerda ou na direita para trocar de pista"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "h2": "Mistakes",
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser.",
    "titulo": "The coins of the Shannon",
    "sub": "In Limerick, the Norse lived from trade and piracy on the River Shannon. Here you run along the bank in three lanes, collect the silver coins and dodge the Irish spears. Run along three lanes. Tap the left or right half of the screen, or use the arrow keys, to change lane. Collect the silver coins and dodge the spears: hitting them is a mistake. Collect 12 before time runs out. Three mistakes end the game.",
    "perdeu": "A spear caught you",
    "v1": "You reached the boat!",
    "v2": "The Norse settled on King's Island, in Limerick, probably in 922. At Sulcoit, in 967, the Dál gCais of Mathgamain and Brian Boru defeated them; the liveliest account comes from the Cogad Gáedel re Gallaib, written more than a century later. The run, the coins and the spears in the game are invented. The game itself, with its objects and rules, is invention.",
    "h1": "Collected",
    "dica": "Tap left or right to change lane"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "h2": "Feil",
    "h3": "Tid",
    "carregando": "Laster 3D…",
    "sem3d": "Denne enheten kunne ikke vise 3D-grafikk. Prøv en annen nettleser.",
    "titulo": "Myntene ved Shannon",
    "sub": "I Limerick levde nordboerne av handel og sjørøveri på elven Shannon. Her løper du langs bredden i tre baner, samler sølvmyntene og unngår de irske spydene. Løp i tre baner. Trykk på venstre eller høyre halvdel av skjermen, eller bruk piltastene, for å bytte bane. Samle sølvmyntene og unngå spydene: å treffe dem er en feil. Samle 12 før tiden er ute. Tre feil avslutter spillet.",
    "perdeu": "Et spyd traff deg",
    "v1": "Du nådde båten!",
    "v2": "Nordboerne slo seg ned på King's Island i Limerick, trolig i 922. Ved Sulcoit i 967 beseiret Dál gCais under Mathgamain og Brian Boru dem; den mest levende beretningen kommer fra Cogad Gáedel re Gallaib, skrevet mer enn hundre år senere. Løpet, myntene og spydene i spillet er oppfunnet. Selve spillet, med gjenstander og regler, er oppfinnelse.",
    "h1": "Samlet",
    "dica": "Trykk til venstre eller høyre for å bytte bane"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "h2": "Errores",
    "h3": "Tiempo",
    "carregando": "Cargando el 3D…",
    "sem3d": "Este dispositivo no pudo mostrar gráficos 3D. Prueba con otro navegador.",
    "titulo": "Las monedas del Shannon",
    "sub": "En Limerick, los nórdicos vivían del comercio y la piratería en el río Shannon. Aquí corres por la orilla en tres carriles, recoges las monedas de plata y esquivas las lanzas irlandesas. Corre por tres carriles. Toca la mitad izquierda o derecha de la pantalla, o usa las flechas, para cambiar de carril. Recoge las monedas de plata y esquiva las lanzas: chocar con ellos es un error. Recoge 12 antes de que acabe el tiempo. Tres errores terminan el juego.",
    "perdeu": "Una lanza te alcanzó",
    "v1": "¡Llegaste al barco!",
    "v2": "Los nórdicos se fijaron en King's Island, en Limerick, probablemente en 922. En Sulcoit, en 967, los Dál gCais de Mathgamain y Brian Boru los derrotaron; el relato más vivo viene del Cogad Gáedel re Gallaib, escrito más de un siglo después. La carrera, las monedas y las lanzas del juego son invención. El juego en sí, con sus objetos y reglas, es invención.",
    "h1": "Recogidos",
    "dica": "Toca a la izquierda o a la derecha para cambiar de carril"
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
    var CFG = {"sky": 8034954, "fog": [30, 90], "hemi": [15266540, 1714716], "sun": 16773328, "sunPos": [-6, 22, 14], "cam": [0, 5, 9], "look": [0, 1.2, 0], "fov": 58, "fovP": 72, "target": 12, "maxe": 3, "total": 90, "bgA": "#2e463e", "bgB": "#080e0c"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-limerick');
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

    var PRM = {"ground": 4876858, "track": 6974026, "line": 4868656, "badP": 0.35, "fx": [0.8, 0.85, 0.9], "bx": [0.6, 0.6, 0.5]};
function mkHero() { var gr = new TH.Group(), m; m = new TH.Mesh(new TH.BoxGeometry(0.5, 0.9, 0.35), mat(0x4a5a6a)); m.position.set(0, 1.0, 0); gr.add(m); m = new TH.Mesh(new TH.SphereGeometry(0.24, 8, 6), mat(0xe0c8a8)); m.position.set(0, 1.7, 0); gr.add(m); m = new TH.Mesh(new TH.SphereGeometry(0.27, 8, 6), mat(0x2a2018)); m.position.set(0, 1.82, 0); m.scale.set(1, 0.6, 1); gr.add(m); m = new TH.Mesh(new TH.BoxGeometry(0.16, 0.7, 0.16), mat(0x4a5a6a)); m.position.set(-0.12, 0.35, 0); gr.add(m); m = new TH.Mesh(new TH.BoxGeometry(0.16, 0.7, 0.16), mat(0x4a5a6a)); m.position.set(0.12, 0.35, 0); gr.add(m); return gr; } function mkItem(k) { var gr = new TH.Group(), m; if (k === 0) { m = new TH.Mesh(new TH.CylinderGeometry(0.22, 0.22, 0.05, 10), mat(0xd8dce4, { emissive: 0x444450 })); m.position.set(0, 0.5, 0); m.rotation.x = Math.PI / 2; gr.add(m); m = new TH.Mesh(new TH.TorusGeometry(0.14, 0.02, 5, 10), mat(0x9a9eac)); m.position.set(0, 0.5, 0.03); gr.add(m); } else { m = new TH.Mesh(new TH.CylinderGeometry(0.04, 0.04, 1.4, 6), mat(0x6a4a2a)); m.position.set(0, 0.6, 0); m.rotation.z = 1.2; gr.add(m); m = new TH.Mesh(new TH.ConeGeometry(0.1, 0.35, 5), mat(0xb0b4c0)); m.position.set(0.45, 0.95, 0); m.rotation.z = -0.4; gr.add(m); } return gr; } function mkDeco() { var m; m = new TH.Mesh(new TH.BoxGeometry(16, 3, 0.4), mat(0x6a8aa0)); m.position.set(0, 1.5, -9); scene.add(m); m = new TH.Mesh(new TH.SphereGeometry(3.4, 8, 6), mat(0x3a5a32)); m.position.set(-5.4, 0.6, -10); m.scale.set(1.6, 1, 1); scene.add(m); m = new TH.Mesh(new TH.SphereGeometry(2.6, 8, 6), mat(0x44683a)); m.position.set(5.6, 0.5, -10); m.scale.set(1.5, 1, 1); scene.add(m); m = new TH.Mesh(new TH.BoxGeometry(2.2, 0.5, 0.9), mat(0x5a3a22)); m.position.set(2.0, 0.3, -6); m.rotation.y = -0.3; scene.add(m); m = new TH.Mesh(new TH.BoxGeometry(0.08, 1.8, 0.08), mat(0x4a3420)); m.position.set(2.0, 1.2, -6); scene.add(m); m = new TH.Mesh(new TH.SphereGeometry(0.9, 10, 8), mat(0xf0e8c0, { emissive: 0x887744 })); m.position.set(-6, 7, -16); scene.add(m); }

G = (function () {
  var pool = [], lane = 1, hx = 0, hero = null, divs = [], spawnT = 0, sp = 14;

  function hw() { var f = fit(), d = 8 * f, fv = (api.w / api.h < 0.8 ? 72 : 58) * Math.PI / 360; return d * Math.tan(fv) * (api.w / api.h); }
  function wx(x) { return (x / api.w - 0.5) * 2 * hw(); }
  function pairMk() { var o = { on: false, kind: 0, x: 0, y: 9, z: 0, v: 3, g0: mkItem(0), g1: mkItem(1) }; o.g0.visible = false; o.g1.visible = false; scene.add(o.g0); scene.add(o.g1); return o; }
  function dica() { txt(T.dica, api.w / 2, api.h - 22, Math.max(12, Math.min(15, api.w / 40)), '#ffe9a8', 'center'); }

  function lx(l) { return (l - 1) * 2.5; }
  function go(d) { lane = Math.max(0, Math.min(2, lane + d)); }
  return {
    init: function () {
      var m, i, s;
      m = new TH.Mesh(new TH.PlaneGeometry(46, 130), mat(PRM.ground)); m.rotation.x = -Math.PI / 2; m.position.set(0, -0.05, -40); scene.add(m);
      m = new TH.Mesh(new TH.PlaneGeometry(7.6, 130), mat(PRM.track)); m.rotation.x = -Math.PI / 2; m.position.set(0, -0.02, -40); scene.add(m);
      for (i = 0; i < 14; i++) for (s = -1; s <= 1; s += 2) { m = new TH.Mesh(new TH.BoxGeometry(0.12, 0.05, 2.2), mat(PRM.line)); m.position.set(s * 1.25, 0, 4 - i * 3.4); scene.add(m); divs.push({ m: m, z: 4 - i * 3.4, x: s * 1.25 }); }
      mkDeco();
      hero = mkHero(); hero.position.set(0, 0, 2.5); scene.add(hero);
      for (i = 0; i < 16; i++) { m = pairMk(); m.lane = 1; pool.push(m); }
    },
    start: function () { var i; lane = 1; hx = 0; spawnT = 0.5; sp = 13; for (i = 0; i < pool.length; i++) pool[i].on = false; },
    logic: function (dt) {
      var i, o;
      sp = Math.min(24, 13 + score * 0.5);
      spawnT -= dt;
      if (spawnT <= 0) {
        for (i = 0; i < pool.length; i++) if (!pool[i].on) { o = pool[i]; o.on = true; o.kind = Math.random() < PRM.badP ? 1 : 0; o.lane = Math.floor(Math.random() * 3); o.z = -45; break; }
        spawnT = Math.max(0.4, 0.95 - score * 0.03) * (13 / sp);
      }
      for (i = 0; i < pool.length; i++) {
        o = pool[i]; if (!o.on) continue; o.z += sp * dt;
        if (o.z > 1.3 && o.z < 3.8 && o.lane === lane) {
          o.on = false;
          if (o.kind === 0) { burst(lx(lane), 1.3, 2.5, 12, 2.2, PRM.fx[0], PRM.fx[1], PRM.fx[2], 3); good(); }
          else { burst(lx(lane), 1.3, 2.5, 10, 2, PRM.bx[0], PRM.bx[1], PRM.bx[2], 2); bad(); }
          if (st !== 'play') return;
        } else if (o.z > 7) o.on = false;
      }
      for (i = 0; i < divs.length; i++) { divs[i].z += sp * dt; if (divs[i].z > 6) divs[i].z -= 47.6; }
    },
    down: function (x) { go(x < api.w / 2 ? -1 : 1); },
    move: function () {},
    key: function (c, d) { if (!d) return; if (c === 'ArrowLeft' || c === 'KeyA') go(-1); else if (c === 'ArrowRight' || c === 'KeyD') go(1); },
    cam: function (sk) { var f = fit(); setCam(sk + hx * 0.35, 4.2 + 2 * (f - 1), 9 * f - 0.5, hx * 0.2, 1, -6); },
    anim: function (dt) {
      var i, o, gm;
      hx += (lx(lane) - hx) * Math.min(1, dt * 12);
      hero.position.set(hx, Math.abs(Math.sin(sceneT * 9)) * 0.12, 2.5); hero.rotation.z = (lx(lane) - hx) * -0.15;
      for (i = 0; i < pool.length; i++) {
        o = pool[i]; o.g0.visible = o.on && o.kind === 0; o.g1.visible = o.on && o.kind === 1;
        gm = o.kind === 0 ? o.g0 : o.g1; gm.position.set(lx(o.lane), 0, o.z); gm.rotation.y += dt * 2;
      }
      for (i = 0; i < divs.length; i++) divs[i].m.position.set(divs[i].x, 0, divs[i].z);
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
