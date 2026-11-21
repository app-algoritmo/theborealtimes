/* Vipunen — a forja dentro do gigante (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-vipunen',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "h2": "Erros",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador.",
    "titulo": "A forja dentro do gigante",
    "sub": "Dentro de Vipunen, Väinämöinen montou uma forja: a armadura é a oficina, as mangas são os foles, os joelhos são a bigorna e o antebraço é o martelo. Quatro postos ficam diante de você, e o calor se acumula num de cada vez. Toque no posto para bater quando a barra dele passar da marca, ou use as setas do teclado. Tocar num posto sem calor, ou bater cedo demais, é erro. Se o calor passar da barra cheia, ele se perde, e isso também é erro. Bata 12 vezes antes do tempo acabar. Três erros encerram o jogo.",
    "perdeu": "A forja esfriou",
    "v1": "A forja está acesa!",
    "v2": "No runo 17 do Kalevala, na tradução de Crawford, Väinämöinen, engolido por Vipunen, monta uma forja dentro do gigante: a armadura é a oficina, as mangas são os foles, os joelhos são a bigorna e o antebraço é o martelo. Forja por três dias. Os quatro postos, o calor que se acumula e o ritmo do jogo são invenção.",
    "h1": "Golpes"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "h2": "Mistakes",
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser.",
    "titulo": "The forge inside the giant",
    "sub": "Inside Vipunen, Väinämöinen set up a forge: the armour is the workshop, the sleeves are the bellows, the knees are the anvil and the forearm is the hammer. Four stations stand before you, and heat builds up in one at a time. Tap the station to strike when its bar passes the mark, or use the arrow keys. Tapping a station with no heat, or striking too early, is a mistake. If the heat passes the full bar, it is lost, and that is also a mistake. Strike 12 times before time runs out. Three mistakes end the game.",
    "perdeu": "The forge went cold",
    "v1": "The forge is lit!",
    "v2": "In Kalevala rune 17, in Crawford's translation, Väinämöinen, swallowed by Vipunen, sets up a forge inside the giant: the armour is the workshop, the sleeves are the bellows, the knees are the anvil and the forearm is the hammer. He forges for three days. The four stations, the heat that builds up and the pace of the game are invention.",
    "h1": "Strikes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "h2": "Feil",
    "h3": "Tid",
    "carregando": "Laster 3D…",
    "sem3d": "Denne enheten kunne ikke vise 3D-grafikk. Prøv en annen nettleser.",
    "titulo": "Smia inni jotunen",
    "sub": "Inne i Vipunen satte Väinämöinen opp en smie: rustningen er verkstedet, ermene er belgene, knærne er ambolten og underarmen er hammeren. Fire poster ligger foran deg, og varmen bygger seg opp i én av gangen. Trykk på posten for å slå når søylen passerer merket, eller bruk piltastene. Å trykke på en post uten varme, eller å slå for tidlig, er en feil. Hvis varmen passerer full søyle, går den tapt, og det er også en feil. Slå 12 ganger før tiden er ute. Tre feil avslutter spillet.",
    "perdeu": "Smia ble kald",
    "v1": "Smia er tent!",
    "v2": "I runo 17 av Kalevala, i Crawfords oversettelse, setter Väinämöinen, svelget av Vipunen, opp en smie inne i jotunen: rustningen er verkstedet, ermene er belgene, knærne er ambolten og underarmen er hammeren. Han smir i tre dager. De fire postene, varmen som bygger seg opp og tempoet i spillet er oppfinnelse.",
    "h1": "Slag"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "h2": "Errores",
    "h3": "Tiempo",
    "carregando": "Cargando el 3D…",
    "sem3d": "Este dispositivo no pudo mostrar gráficos 3D. Prueba con otro navegador.",
    "titulo": "La fragua dentro del gigante",
    "sub": "Dentro de Vipunen, Väinämöinen montó una fragua: la armadura es el taller, las mangas son los fuelles, las rodillas son el yunque y el antebrazo es el martillo. Cuatro puestos están ante ti, y el calor se acumula en uno cada vez. Toca el puesto para golpear cuando su barra pase la marca, o usa las flechas del teclado. Tocar un puesto sin calor, o golpear demasiado pronto, es un error. Si el calor pasa de la barra llena, se pierde, y eso también es un error. Golpea 12 veces antes de que acabe el tiempo. Tres errores terminan el juego.",
    "perdeu": "La fragua se enfrió",
    "v1": "¡La fragua está encendida!",
    "v2": "En el runo 17 del Kalevala, en la traducción de Crawford, Väinämöinen, tragado por Vipunen, monta una fragua dentro del gigante: la armadura es el taller, las mangas son los fuelles, las rodillas son el yunque y el antebrazo es el martillo. Forja durante tres días. Los cuatro puestos, el calor que se acumula y el ritmo del juego son invención.",
    "h1": "Golpes"
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
    var CFG = {"sky": 2758672, "fog": [30, 90], "hemi": [16767152, 2758672], "sun": 16763024, "sunPos": [-8, 26, 14], "cam": [0, 7, 9], "look": [0, 0.6, 0], "fov": 58, "fovP": 72, "target": 12, "maxe": 3, "total": 100, "bgA": "#0e2335", "bgB": "#050b12"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-vipunen');
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
          m = new TH.Mesh(new TH.PlaneGeometry(90, 70), mat(0x7a3a2a)); m.rotation.x = -Math.PI / 2; m.position.set(0, -0.05, -8); scene.add(m);
          m = new TH.Mesh(new TH.BoxGeometry(3.2, 1.8, 2.6), mat(0x4a2a1c)); m.position.set(0, 0.9, 0); scene.add(m);
          m = new TH.Mesh(new TH.ConeGeometry(2.7, 1.6, 4), mat(0x5a2a22)); m.position.set(0, 2.6, 0); m.rotation.y = Math.PI / 4; scene.add(m);
          m = new TH.Mesh(new TH.BoxGeometry(0.5, 1.1, 0.5), mat(0x555a66)); m.position.set(0.9, 3.0, 0.3); scene.add(m);
          for (i = 0; i < 4; i++) { m = new TH.Mesh(new TH.SphereGeometry(1.5, 10, 6, 0, 6.283, 0, 1.5708), mat(0xffb060)); m.position.set(S[i].x, 0, S[i].z); m.scale.set(1, 0.05, 1); scene.add(m); dr.push(m); }
          for (i = 0; i < 12; i++) { m = new TH.Mesh(new TH.ConeGeometry(1.1 + (i % 3) * 0.3, 4 + (i % 4), 6), mat(0x2a1410)); m.position.set(-26 + i * 4.8, 2, -16 - (i % 3) * 3); scene.add(m); }
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
