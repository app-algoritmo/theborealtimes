/* Askeladden — a prata e o ouro da encosta (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-askeladden',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "h2": "Erros",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador.",
    "titulo": "A prata e o ouro da encosta",
    "sub": "Askeladden volta da floresta com a prata e o ouro que achou na encosta. Nove montes de terra estão diante de você. Um brilho de metal aparece num monte de cada vez. Toque no monte que brilha antes que o brilho se apague, ou use as teclas de 1 a 9. Tocar num monte sem brilho, ou deixar um brilho apagar, é erro. Recolha 12 achados antes do tempo acabar. Três erros encerram o jogo.",
    "perdeu": "O brilho se apagou",
    "v1": "A dívida está paga!",
    "v2": "No conto, depois de vencer o troll, Askeladden leva a prata e o ouro que acha na encosta, e o dinheiro ajuda a pagar a dívida da família. Os nove montes, os brilhos e o ritmo do jogo são invenção.",
    "h1": "Achados"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "h2": "Mistakes",
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser.",
    "titulo": "The silver and gold of the hillside",
    "sub": "Askeladden comes back from the forest with the silver and gold he found on the hillside. Nine mounds of earth are before you. A gleam of metal appears on one mound at a time. Tap the mound that gleams before the gleam fades, or use keys 1 to 9. Tapping a mound without a gleam, or letting a gleam fade, is a mistake. Gather 12 finds before time runs out. Three mistakes end the game.",
    "perdeu": "The gleam faded",
    "v1": "The debt is paid!",
    "v2": "In the tale, after beating the troll, Askeladden takes the silver and gold he finds on the hillside, and the money helps pay off the family's debt. The nine mounds, the gleams and the rhythm of the game are invention.",
    "h1": "Finds"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "h2": "Feil",
    "h3": "Tid",
    "carregando": "Laster 3D…",
    "sem3d": "Denne enheten kunne ikke vise 3D-grafikk. Prøv en annen nettleser.",
    "titulo": "Sølvet og gullet i lia",
    "sub": "Askeladden kommer tilbake fra skogen med sølvet og gullet han fant i lia. Ni jordhauger ligger foran deg. Et glimt av metall dukker opp på én haug om gangen. Trykk på haugen som glimter før glimtet slukner, eller bruk tastene 1 til 9. Å trykke på en haug uten glimt, eller la et glimt slukne, er en feil. Samle 12 funn før tiden er ute. Tre feil avslutter spillet.",
    "perdeu": "Glimtet sluknet",
    "v1": "Gjelden er betalt!",
    "v2": "I eventyret tar Askeladden, etter å ha beseiret trollet, med seg sølvet og gullet han finner i lia, og pengene hjelper til med å betale familiens gjeld. De ni haugene, glimtene og rytmen i spillet er oppfinnelse.",
    "h1": "Funn"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "h2": "Errores",
    "h3": "Tiempo",
    "carregando": "Cargando el 3D…",
    "sem3d": "Este dispositivo no pudo mostrar gráficos 3D. Prueba con otro navegador.",
    "titulo": "La plata y el oro de la ladera",
    "sub": "Askeladden vuelve del bosque con la plata y el oro que encontró en la ladera. Nueve montículos de tierra están ante ti. Un destello de metal aparece en un montículo cada vez. Toca el montículo que brilla antes de que el destello se apague, o usa las teclas de 1 a 9. Tocar un montículo sin destello, o dejar que un destello se apague, es un error. Recoge 12 hallazgos antes de que acabe el tiempo. Tres errores terminan el juego.",
    "perdeu": "El destello se apagó",
    "v1": "¡La deuda está pagada!",
    "v2": "En el cuento, tras vencer al troll, Askeladden se lleva la plata y el oro que encuentra en la ladera, y el dinero ayuda a pagar la deuda de la familia. Los nueve montículos, los destellos y el ritmo del juego son invención.",
    "h1": "Hallazgos"
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
    var CFG = {"sky": 1977382, "fog": [30, 90], "hemi": [14739664, 1844764], "sun": 16773328, "sunPos": [-6, 24, 10], "cam": [0, 7, 8], "look": [0, 0.4, 0], "fov": 58, "fovP": 72, "target": 12, "maxe": 3, "total": 100, "bgA": "#0e2335", "bgB": "#050b12"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-askeladden');
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
      var A = [], k = [], tl = [], mounds = [], gl = [], spT = 0.8, P = [];
      function cx(i) { return ((i % 3) - 1) * 3.0; }
      function cz(i) { return (Math.floor(i / 3) - 1) * 2.4; }
      function scr() { var o = []; for (var i = 0; i < 9; i++) o.push(toScr(cx(i), 0.8, cz(i))); return o; }
      function dur() { return Math.max(1.6, 2.8 - score * 0.1); }
      function tap(i) {
        if (A[i]) { A[i] = false; burst(cx(i), 1.2, cz(i), 16, 2.6, k[i] ? 0.9 : 1, k[i] ? 0.5 : 0.85, k[i] ? 0.2 : 0.2, 3); good(); }
        else bad();
      }
      return {
        init: function () {
          var i, m;
          m = new TH.Mesh(new TH.PlaneGeometry(70, 50), mat(0x4a5a3a)); m.rotation.x = -Math.PI / 2; m.position.set(0, -0.05, -8); scene.add(m);
          for (i = 0; i < 9; i++) {
            m = new TH.Mesh(new TH.SphereGeometry(1.15, 10, 6, 0, 6.283, 0, 1.5708), mat(0x6a5a38, { emissive: 0x000000 })); m.position.set(cx(i), 0, cz(i)); scene.add(m); mounds.push(m);
            m = new TH.Mesh(i % 2 ? new TH.OctahedronGeometry(0.4) : new TH.TorusGeometry(0.3, 0.1, 6, 12), mat(0xf0c040, { emissive: 0x806010 })); m.position.set(cx(i), 1.4, cz(i)); m.visible = false; scene.add(m); gl.push(m);
          }
          m = new TH.Mesh(new TH.BoxGeometry(14, 1.8, 2.4), mat(0x5a4a38)); m.position.set(0, 0.9, -16); scene.add(m);
          m = new TH.Mesh(new TH.BoxGeometry(15, 0.5, 3.0), mat(0x3a2a1c)); m.position.set(0, 2.1, -16); scene.add(m);
        },
        start: function () { for (var i = 0; i < 9; i++) { A[i] = false; k[i] = 0; tl[i] = 0; } spT = 0.8; P = scr(); },
        logic: function (dt) {
          var i, n = 0;
          for (i = 0; i < 9; i++) if (A[i]) { n++; tl[i] -= dt; if (tl[i] <= 0) { A[i] = false; bad(); } }
          spT -= dt;
          if (spT <= 0) {
            if (n < 3) { var f = []; for (i = 0; i < 9; i++) if (!A[i]) f.push(i); var c = f[Math.floor(Math.random() * f.length)]; A[c] = true; k[c] = Math.random() < 0.5 ? 0 : 1; tl[c] = dur(); api.nota(900 + k[c] * 300, 0.12, 'sine', 0.05); }
            spT = Math.max(0.7, 1.4 - score * 0.05);
          }
        },
        down: function (x, y) { if (!P.length) P = scr(); var i = nearest(P, x, y, Math.max(36, 0.09 * Math.min(api.w, api.h))); if (i >= 0) tap(i); },
        key: function (c, d) { if (!d) return; var n = { Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3, Digit5: 4, Digit6: 5, Digit7: 6, Digit8: 7, Digit9: 8 }[c]; if (n !== undefined) tap(n); },
        cam: function (sk) { var f = fit(); setCam(sk, 7 + 3 * (f - 1), 8 * f, 0, 0.4, 0); },
        anim: function (dt) {
          for (var i = 0; i < 9; i++) {
            gl[i].visible = !!A[i]; if (A[i]) { gl[i].rotation.y += dt * 4; gl[i].position.y = 1.4 + Math.sin(sceneT * 6 + i) * 0.15; gl[i].material.color.setHex(k[i] ? 0xd8dce8 : 0xf0c040); gl[i].material.emissive.setHex(k[i] ? 0x60646c : 0x806010); }
            mounds[i].material.emissive.setHex(A[i] ? 0x3a3010 : 0x000000);
          }
          this.cam(camShake(dt)); P = scr();
        },
        dbg: function () { var a = []; for (var i = 0; i < 9; i++) if (A[i]) a.push(i); return { act: a, pos: scr() }; }
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
