/* Tissø — os amuletos do lago (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-tisso',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os amuletos do lago",
    "sub": "Oito pares de objetos de oferenda estão virados para baixo sobre a mesa. Toque num cartão para virá-lo e depois noutro: se forem iguais, o par fica. Cartões diferentes viram de volta e contam como erro. Ache os 8 pares antes do tempo acabar. Seis erros encerram o jogo.",
    "perdeu": "O lago guardou o segredo",
    "v1": "Todos os pares achados!",
    "v2": "Em Tissø, na Dinamarca, as escavações acharam martelos de Thor, fíbulas em forma de valquíria e armas e joias lançadas no lago. Os pares de cartões são invenção.",
    "h1": "Pares",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador.",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The lake amulets",
    "sub": "Eight pairs of offering objects lie face down on the table. Tap a card to turn it over and then another: if they match, the pair stays. Different cards turn back and count as a mistake. Find the 8 pairs before time runs out. Six mistakes end the game.",
    "perdeu": "The lake kept its secret",
    "v1": "Every pair found!",
    "v2": "At Tissø in Denmark, excavations found Thor's hammers, valkyrie-shaped brooches, and weapons and jewellery thrown into the lake. The pairs of cards are invented.",
    "h1": "Pairs",
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser.",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Amulettene i sjøen",
    "sub": "Åtte par med offergjenstander ligger med forsiden ned på bordet. Trykk på et kort for å vende det og så på et til: hvis de er like, blir paret liggende. Ulike kort vendes tilbake og teller som en feil. Finn de 8 parene før tiden er ute. Seks feil avslutter spillet.",
    "perdeu": "Sjøen holdt på hemmeligheten",
    "v1": "Alle parene er funnet!",
    "v2": "Ved Tissø i Danmark har utgravinger funnet Tors hammere, valkyrje-spenner og våpen og smykker som ble kastet i sjøen. Kortparene er oppfunnet.",
    "h1": "Par",
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
    var CFG = {"sky": 1712688, "fog": [40, 100], "hemi": [13160672, 2761752], "sun": 16773328, "sunPos": [10, 40, 20], "cam": [0, 11, 7.5], "look": [0, 0, 0.6], "fov": 58, "fovP": 72, "target": 8, "maxe": 6, "total": 150, "bgA": "#0e2335", "bgB": "#050b12"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-tisso');
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
      var NC = 16, vals = [], state = [], cards = [], amu = [], fl = [], lock = 0, P = [], pend = null, angle = [];
      function cx(i) { return (i % 4 - 1.5) * 2.5; }
      function cz(i) { return (Math.floor(i / 4) - 1.5) * 2.5; }
      function scr() { var o = []; for (var i = 0; i < NC; i++) o.push(toScr(cx(i), 0.4, cz(i))); return o; }
      function mkAmu(k) {
        var g0 = new TH.Group(), m;
        if (k === 0) { m = new TH.Mesh(new TH.BoxGeometry(0.22, 1.1, 0.22), mat(0x6a707c)); m.position.y = 0.5; g0.add(m); m = new TH.Mesh(new TH.BoxGeometry(0.95, 0.4, 0.3), mat(0xc4cad4)); m.position.y = 1.0; g0.add(m); }
        else if (k === 1) { m = new TH.Mesh(new TH.CylinderGeometry(0.62, 0.62, 0.14, 12), mat(0xd9aa3a)); m.position.y = 0.2; g0.add(m); m = new TH.Mesh(new TH.SphereGeometry(0.22, 8, 6), mat(0xb3382c)); m.position.y = 0.4; g0.add(m); }
        else if (k === 2) { m = new TH.Mesh(new TH.TorusGeometry(0.5, 0.12, 6, 12), mat(0xe0b84a)); m.position.y = 0.5; m.rotation.x = 1.2; g0.add(m); }
        else if (k === 3) { m = new TH.Mesh(new TH.ConeGeometry(0.34, 1.1, 5), mat(0x9aa0aa)); m.position.y = 0.6; g0.add(m); m = new TH.Mesh(new TH.CylinderGeometry(0.1, 0.1, 0.7, 6), mat(0x6b4a28)); m.position.y = 0.1; g0.add(m); }
        else if (k === 4) { m = new TH.Mesh(new TH.CylinderGeometry(0.55, 0.55, 0.1, 14), mat(0xe8eef4, { shininess: 90 })); m.position.y = 0.25; g0.add(m); }
        else if (k === 5) { m = new TH.Mesh(new TH.SphereGeometry(0.5, 10, 8), mat(0x2f6fd0, { shininess: 90 })); m.position.y = 0.5; g0.add(m); }
        else if (k === 6) { m = new TH.Mesh(new TH.BoxGeometry(1.1, 0.35, 0.6), mat(0xd9aa3a)); m.position.y = 0.3; g0.add(m); }
        else { m = new TH.Mesh(new TH.CylinderGeometry(0.5, 0.28, 0.8, 9), mat(0xc8a878)); m.position.y = 0.5; g0.add(m); }
        return g0;
      }
      function layout() { var a = []; for (var i = 0; i < NC; i++) a.push(Math.floor(i / 2)); for (i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
      function flip(i, up) { state[i] = up ? 'up' : 'down'; }
      function pick(i) {
        if (lock > 0 || state[i] !== 'down') return;
        flip(i, true); fl.push(i); api.nota(500 + vals[i] * 40, 0.1, 'triangle', 0.05);
        if (fl.length === 2) {
          var a = fl[0], b = fl[1];
          if (vals[a] === vals[b]) { state[a] = state[b] = 'done'; burst(cx(a), 1.2, cz(a), 12, 3, 1, 0.85, 0.4, 3); burst(cx(b), 1.2, cz(b), 12, 3, 1, 0.85, 0.4, 3); fl = []; good(); }
          else { lock = 1.1; pend = [a, b]; bad(); }
        }
      }
      return {
        init: function () {
          var i, m;
          m = new TH.Mesh(new TH.BoxGeometry(14, 0.6, 14), mat(0x5a3d22)); m.position.set(0, -0.4, 0); scene.add(m);
          m = new TH.Mesh(new TH.PlaneGeometry(90, 90), mat(0x141c26)); m.rotation.x = -Math.PI / 2; m.position.set(0, -0.8, 0); scene.add(m);
          for (i = 0; i < NC; i++) {
            var c = new TH.Mesh(new TH.BoxGeometry(2.0, 0.3, 2.0), mat(0x6a7a8a)); c.position.set(cx(i), 0.05, cz(i)); scene.add(c); cards.push(c);
            var a = mkAmu(i % 8); a.position.set(cx(i), 0.2, cz(i)); a.visible = false; scene.add(a); amu.push(a);
          }
        },
        start: function () { vals = layout(); state = []; fl = []; lock = 0; pend = null; for (var i = 0; i < NC; i++) { state.push('down'); amu[i].visible = false; } P = scr();
          for (i = 0; i < NC; i++) { scene.remove(amu[i]); var a = mkAmu(vals[i]); a.position.set(cx(i), 0.2, cz(i)); a.visible = false; scene.add(a); amu[i] = a; } },
        logic: function (dt) { if (lock > 0) { lock -= dt; if (lock <= 0) { lock = 0; if (pend) { flip(pend[0], false); flip(pend[1], false); pend = null; fl = []; } } } },
        down: function (x, y) { if (!P.length) P = scr(); var i = nearest(P, x, y, Math.max(26, 0.1 * Math.min(api.w, api.h))); if (i >= 0) pick(i); },
        cam: function (sk) { var f = fit(); setCam(sk, 11 + 6 * (f - 1), 7.5 + 4 * (f - 1), 0, 0, 0.6); },
        anim: function (dt) {
          for (var i = 0; i < NC; i++) {
            var up = state[i] !== 'down'; amu[i].visible = up; amu[i].rotation.y += dt * (up ? 1.2 : 0);
            cards[i].material.color.setHex(state[i] === 'done' ? 0x4a7a4a : up ? 0x8a9aaa : 0x4a5a6a);
          }
          this.cam(camShake(dt)); P = scr();
        },
        dbg: function () { return { vals: vals.slice(), state: state.slice(), fl: fl.slice(), lock: lock, pos: scr() }; }
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
