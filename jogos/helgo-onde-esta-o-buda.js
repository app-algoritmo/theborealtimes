/* Helgö — onde está o Buda? (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-helgo',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Onde está o Buda?",
    "sub": "A estatueta de Buda está sob um dos potes. Veja onde ela fica, observe os potes trocarem de lugar e toque no pote que a esconde. Acerte 6 rodadas antes do tempo acabar. Três erros encerram o jogo.",
    "perdeu": "A estatueta se perdeu",
    "v1": "Estatueta achada!",
    "v2": "Em Helgö, na Suécia, escavações de 1954 acharam uma estatueta de bronze do Buda, do século VI e de estilo do norte da Índia. A troca dos potes é invenção.",
    "h1": "Rodadas",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador.",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Where is the Buddha?",
    "sub": "The Buddha statuette is under one of the pots. See where it lies, watch the pots swap places and tap the pot that hides it. Win 6 rounds before time runs out. Three mistakes end the game.",
    "perdeu": "The statuette was lost",
    "v1": "Statuette found!",
    "v2": "At Helgö, in Sweden, excavations in 1954 found a bronze statuette of the Buddha, from the 6th century and in North Indian style. The swapping of the pots is invented.",
    "h1": "Rounds",
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser.",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Hvor er Buddha?",
    "sub": "Buddha-statuetten ligger under en av krukkene. Se hvor den ligger, følg med mens krukkene bytter plass og trykk på krukken som skjuler den. Vinn 6 runder før tiden er ute. Tre feil avslutter spillet.",
    "perdeu": "Statuetten ble borte",
    "v1": "Statuetten er funnet!",
    "v2": "På Helgö i Sverige fant utgravinger i 1954 en bronsestatuett av Buddha, fra 500-tallet og i nordindisk stil. Byttingen av krukkene er oppfunnet.",
    "h1": "Runder",
    "h3": "Tid",
    "carregando": "Laster 3D…",
    "sem3d": "Denne enheten kunne ikke vise 3D-grafikk. Prøv en annen nettleser.",
    "h2": "Feil"
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
    var CFG = {"sky": 2105388, "fog": [40, 100], "hemi": [13156528, 2761752], "sun": 16773328, "sunPos": [8, 30, 20], "cam": [0, 7, 11], "look": [0, 0.6, 0], "fov": 58, "fovP": 72, "target": 6, "maxe": 3, "total": 150, "bgA": "#0e2335", "bgB": "#050b12"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-helgo');
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
      camera.aspect = W / H; camera.fov = W / H < 0.8 ? (CFG.fovP || 72) : (CFG.fov || 58); camera.updateProjectionMatrix(); snap = null;
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
      var NN = [3, 3, 4, 4, 5, 5], SW = [5, 6, 7, 8, 9, 10], rnd = 0, n = 3, cups = [], slotOf = [], statue = 0, ph = 'reveal', pt = 0, sw = [], si = 0, swT = 0, swA = 0, swB = 0, dur = 0.4, chosen = -1, P = [], stm;
      function sx(s) { return (s - (n - 1) / 2) * 3.4; }
      function scr() { var o = []; for (var s = 0; s < n; s++) o.push(toScr(sx(s), 1, 0)); return o; }
      function setup() {
        n = NN[Math.min(rnd, 5)]; slotOf = []; for (var i = 0; i < 5; i++) { slotOf.push(i); cups[i].m.visible = i < n; cups[i].y = 0; cups[i].x = sx(i); }
        statue = Math.floor(Math.random() * n); sw = []; var cnt = SW[Math.min(rnd, 5)], p = [-1, -1];
        for (i = 0; i < cnt; i++) { var a, b; do { a = Math.floor(Math.random() * n); b = Math.floor(Math.random() * n); } while (a === b || (a === p[0] && b === p[1]) || (a === p[1] && b === p[0])); sw.push([a, b]); p = [a, b]; }
        dur = Math.max(0.26, 0.44 - rnd * 0.03); ph = 'reveal'; pt = 1.5; si = 0; chosen = -1; P = scr();
      }
      return {
        init: function () {
          var i, m;
          m = new TH.Mesh(new TH.BoxGeometry(22, 0.8, 9), mat(0x6b4a2c)); m.position.set(0, -0.4, 0); scene.add(m);
          m = new TH.Mesh(new TH.PlaneGeometry(80, 50), mat(0x2a2230)); m.rotation.x = -Math.PI / 2; m.position.set(0, -0.85, -6); scene.add(m);
          for (i = 0; i < 5; i++) {
            var g0 = new TH.Group(), c = new TH.Mesh(new TH.CylinderGeometry(0.85, 1.25, 2, 12), mat(i % 2 ? 0xa4562c : 0x8c4a28)); c.position.y = 1; g0.add(c);
            var r = new TH.Mesh(new TH.TorusGeometry(0.92, 0.12, 6, 14), mat(0xd9b24a)); r.rotation.x = Math.PI / 2; r.position.y = 1.7; g0.add(r);
            scene.add(g0); cups.push({ m: g0, x: sx(i), y: 0 });
          }
          stm = new TH.Group(); var bd = new TH.Mesh(new TH.CylinderGeometry(0.2, 0.45, 0.8, 8), mat(0xe0b040, { emissive: 0x805a10 })); bd.position.y = 0.4; stm.add(bd);
          var hd = new TH.Mesh(new TH.SphereGeometry(0.22, 8, 6), mat(0xe0b040, { emissive: 0x805a10 })); hd.position.y = 1; stm.add(hd);
          var lt = new TH.Mesh(new TH.TorusGeometry(0.5, 0.1, 5, 10), mat(0xd05a8a)); lt.rotation.x = Math.PI / 2; lt.position.y = 0.05; stm.add(lt); scene.add(stm);
        },
        start: function () { rnd = 0; setup(); },
        logic: function (dt) {
          pt -= dt;
          if (ph === 'reveal') { if (pt <= 0) { ph = 'cover'; pt = 0.5; } }
          else if (ph === 'cover') { if (pt <= 0) { ph = 'shuffle'; si = 0; swT = dur; swA = sw[0][0]; swB = sw[0][1]; } }
          else if (ph === 'shuffle') {
            swT -= dt;
            if (swT <= 0) {
              var ca = slotOf.indexOf(swA), cb = slotOf.indexOf(swB); slotOf[ca] = swB; slotOf[cb] = swA;
              si++; if (si >= sw.length) { ph = 'pick'; swA = swB = -1; P = scr(); } else { swA = sw[si][0]; swB = sw[si][1]; swT = dur; }
            }
          }
          else if (ph === 'result') { if (pt <= 0 && st === 'play') setup(); }
        },
        down: function (x, y) {
          if (ph !== 'pick') return;
          var s = nearest(P, x, y, Math.max(44, 0.16 * Math.min(api.w, api.h)));
          if (s < 0) return;
          chosen = s; var cup = slotOf.indexOf(s);
          if (cup === statue) { ph = 'result'; pt = 1.3; burst(sx(s), 1.5, 0, 30, 4, 1, 0.85, 0.3, 4); rnd++; good(); }
          else { ph = 'result'; pt = 1.5; bad(); }
        },
        anim: function (dt) {
          var i;
          for (i = 0; i < 5; i++) {
            var c = cups[i], s = slotOf[i], x = sx(s), y = 0;
            if (ph === 'shuffle' && (s === swA || s === swB)) { var k = 1 - Math.max(0, swT) / dur, e = k * k * (3 - 2 * k), o = s === swA ? swB : swA; x = sx(s) + (sx(o) - sx(s)) * e; y = Math.sin(k * Math.PI) * 0.7; c.m.position.z = (s === swA ? 1 : -1) * Math.sin(k * Math.PI) * 1.4; }
            else c.m.position.z = 0;
            var lift = 0;
            if (ph === 'reveal' && i === statue) lift = 2.6;
            if (ph === 'result' && (i === statue || s === chosen)) lift = 2.6;
            c.y += (lift - c.y) * Math.min(1, dt * 10); c.m.position.set(x, y + c.y, c.m.position.z);
          }
          var sc = slotOf[statue]; stm.position.set(ph === 'shuffle' && (sc === swA || sc === swB) ? cups[statue].m.position.x : sx(sc), 0, 0); stm.rotation.y += dt * 2;
          var sk = camShake(dt); setCam(sk, 7, 11, 0, 0.6, 0);
        },
        dbg: function () { return { ph: ph, tgt: slotOf[statue], pos: scr(), n: n }; }
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
