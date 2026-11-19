/* Aurvandil — o rio de gelo (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-aurvandil',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O rio de gelo",
    "sub": "Atravesse o rio pulando de bloco em bloco. Toque na tela, ou use Espaço, para saltar para o próximo bloco. Só dá para cair em cima dele, então espere o bloco passar bem à sua frente. Chegue à outra margem 4 vezes antes do tempo acabar. Três quedas na água encerram o jogo.",
    "perdeu": "Você caiu no rio",
    "v1": "Outra margem!",
    "v2": "No mito, Thor atravessou os rios Élivágar com Aurvandil numa cesta, e um dedo do pé congelado virou estrela. A travessia aos saltos é invenção.",
    "h1": "Travessias",
    "h2": "Quedas",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador."
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The river of ice",
    "sub": "Cross the river by hopping from block to block. Tap the screen, or press Space, to jump to the next block. You can only land on it, so wait until the block passes right in front of you. Reach the far bank 4 times before time runs out. Three falls into the water end the game.",
    "perdeu": "You fell in the river",
    "v1": "The far bank!",
    "v2": "In the myth, Thor waded the Élivágar rivers with Aurvandil in a basket, and a frozen toe became a star. The crossing by hopping is invented.",
    "h1": "Crossings",
    "h2": "Falls",
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser."
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Elven av is",
    "sub": "Kryss elven ved å hoppe fra blokk til blokk. Trykk på skjermen, eller trykk mellomrom, for å hoppe til neste blokk. Du kan bare lande på den, så vent til blokken passerer rett foran deg. Nå den andre bredden 4 ganger før tiden er ute. Tre fall i vannet avslutter spillet.",
    "perdeu": "Du falt i elven",
    "v1": "Den andre bredden!",
    "v2": "I myten vadet Tor over elvene Élivágar med Aurvandil i en kurv, og en frossen tå ble til en stjerne. Krysningen med hopp er oppfunnet.",
    "h1": "Krysninger",
    "h2": "Fall",
    "h3": "Tid",
    "carregando": "Laster 3D…",
    "sem3d": "Denne enheten kunne ikke vise 3D-grafikk. Prøv en annen nettleser."
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
    var CFG = {"sky": 727854, "fog": [35, 110], "hemi": [10405088, 1056816], "sun": 14674687, "sunPos": [-30, 40, 30], "cam": [0, 9.5, 9], "look": [0, 0, -8], "fov": 58, "fovP": 72, "target": 4, "maxe": 3, "total": 120, "bgA": "#0e2335", "bgB": "#050b12"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-aurvandil');
    var score = 0, errs = 0, time = 0, shake = 0, flash = 0, G = null;
    var input = { l: false, r: false, ptr: 0 };
    var NP = 320, pGeo, pPos, pCol, pVel, pBase, pLife, pMax, pIdx = 0;
    function stub() { var f = function () {}; return new Proxy(f, { get: function (t, k) { return k === Symbol.toPrimitive ? function () { return 0; } : stub(); }, set: function () { return true; }, apply: function () { return stub(); }, construct: function () { return stub(); } }); }
    function rndr(a, b) { return a + Math.random() * (b - a); }
    function mat(c, o) { o = o || {}; var p = { color: c, flatShading: true }; for (var k in o) p[k] = o[k]; return new TH.MeshPhongMaterial(p); }
    function ctex(w, h, fn) { if (HEAD) return null; var c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d'), w, h); return new TH.CanvasTexture(c); }
    function setCam(px, py, pz, lx, ly, lz) { camera.position.set(px, py, pz); camera.lookAt(lx, ly, lz); }
    function toScr(x, y, z) {
      if (HEAD) return { x: api.w / 2 + x * 40, y: api.h * 0.6 - z * 30 - y * 40 };
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
      var N = 6, A = 5.2, FW = 1.45, FLY = 0.35, floes = [], row = 0, fly = 0, flyX = 0, cross = 0, ft = 0, plr, wat, stepT = 0;
      function om() { return 1.05 + 0.15 * Math.min(cross, 3); }
      function fx(r, t) { return A * Math.sin(om() * t + floes[r - 1].ph); }
      function zr(r) { return 2 - 3.1 * r; }
      function px() { return row === 0 || row === N + 1 ? 0 : fx(row, ft); }
      function newCross() { row = 0; fly = 0; for (var i = 0; i < N; i++) floes[i].ph = rndr(0, 6.283); }
      function land() {
        var tr = row + 1;
        if (tr === N + 1) { row = 0; burst(flyX, 1, zr(N + 1), 30, 5, 1, 0.95, 0.5, 4); cross++; good(); newCross(); return; }
        if (Math.abs(flyX - fx(tr, ft)) < FW) { row = tr; api.nota(300 + tr * 40, 0.15, 'triangle', 0.06); }
        else { burst(flyX, 0.2, zr(tr), 24, 4, 0.5, 0.75, 1, 3); bad(); row = 0; }
      }
      return {
        init: function () {
          var i, m, tex;
          wat = new TH.Mesh(new TH.PlaneGeometry(90, 70, 1, 1), mat(0x15405f, { shininess: 60 })); wat.rotation.x = -Math.PI / 2; wat.position.set(0, -0.35, -10); scene.add(wat);
          for (i = 0; i < 2; i++) { m = new TH.Mesh(new TH.BoxGeometry(60, 1.2, 7), mat(0xdfe9f2)); m.position.set(0, -0.6, i ? zr(N + 1) - 3.4 : 5.2); scene.add(m); }
          for (i = 0; i < 14; i++) { m = new TH.Mesh(new TH.ConeGeometry(6 + (i % 3) * 3, 14 + (i % 4) * 4, 5), mat(0xb9cfe0)); m.position.set(-60 + i * 9, 3, -45 - (i % 3) * 8); scene.add(m); }
          for (i = 0; i < N; i++) { m = new TH.Mesh(new TH.CylinderGeometry(1.5, 1.75, 0.55, 7), mat(0xcfeaf7, { shininess: 80 })); m.position.set(0, 0, zr(i + 1)); scene.add(m); floes.push({ m: m, ph: rndr(0, 6.283) }); }
          plr = new TH.Group();
          var b = new TH.Mesh(new TH.CylinderGeometry(0.35, 0.5, 1.1, 8), mat(0xb3382c)); b.position.y = 0.75; plr.add(b);
          var h = new TH.Mesh(new TH.SphereGeometry(0.3, 8, 6), mat(0xe8c9a0)); h.position.y = 1.55; plr.add(h);
          var bd = new TH.Mesh(new TH.ConeGeometry(0.3, 0.5, 6), mat(0xc0562a)); bd.position.set(0, 1.35, 0.2); bd.rotation.x = 2.9; plr.add(bd);
          var bk = new TH.Mesh(new TH.CylinderGeometry(0.4, 0.3, 0.7, 8), mat(0x7a4a26)); bk.position.set(0, 1.0, 0.45); plr.add(bk);
          var ft2 = new TH.Mesh(new TH.SphereGeometry(0.13, 6, 5), mat(0xe8c9a0)); ft2.position.set(0.15, 1.45, 0.5); plr.add(ft2);
          scene.add(plr);
          var sg = new TH.BufferGeometry(), sp = []; for (i = 0; i < 300; i++) { var a = Math.random() * 6.283, e = 0.15 + Math.random() * 1.0; sp.push(Math.cos(a) * 170, 25 + Math.sin(e) * 90, -70 - Math.abs(Math.sin(a)) * 60); }
          sg.setAttribute('position', new TH.Float32BufferAttribute(sp, 3)); scene.add(new TH.Points(sg, new TH.PointsMaterial({ color: 0xffffff, size: 1.4, sizeAttenuation: false, fog: false })));
          var star = new TH.Mesh(new TH.OctahedronGeometry(2.2, 0), new TH.MeshBasicMaterial({ color: 0xfff4c0, fog: false })); star.position.set(-16, 34, -85); scene.add(star);
        },
        start: function () { cross = 0; ft = 0; newCross(); },
        logic: function (dt) {
          ft += dt; if (fly > 0) { fly -= dt; if (fly <= 0) { fly = 0; land(); } }
        },
        down: function () { if (fly > 0) return; flyX = px(); fly = FLY; api.nota(440, 0.12, 'sine', 0.05); },
        key: function (c, d) { if (d && c === 'Space') G.down(); },
        anim: function (dt) {
          var i, f;
          for (i = 0; i < N; i++) { f = floes[i]; f.m.position.x = fx(i + 1, ft); f.m.position.y = Math.sin(ft * 1.7 + i) * 0.06 - (row === i + 1 && fly <= 0 ? 0.08 : 0); f.m.rotation.y = ft * 0.2 + i; }
          if (fly > 0) { var k = 1 - fly / FLY, z0 = zr(row), z1 = zr(row + 1); plr.position.set(flyX, 0.3 + Math.sin(k * Math.PI) * 1.5, z0 + (z1 - z0) * k); }
          else plr.position.set(px(), 0.3 + (row > 0 && row <= N ? Math.sin(ft * 1.7 + row - 1) * 0.06 : 0), row === 0 ? zr(0) : zr(row));
          plr.rotation.y = Math.sin(ft * 2) * 0.05;
          var sk = camShake(dt); setCam(sk, 9.5, 9, 0, 0, -8);
        },
        dbg: function () { return { row: row, flying: fly > 0, px: px(), nx: row < N ? fx(row + 1, ft + FLY) : 0, cross: cross, pos: [{ x: 400, y: 200 }] }; }
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
          hud(T.h1 + ' ' + Math.min(score, CFG.target) + '/' + CFG.target, T.h2 + ' ' + errs + '/' + CFG.maxe, true);
          txt(T.h3 + ' ' + Math.max(0, Math.ceil(time)), 22, 76, 13, '#c9b3f2', 'left');
          if (G.hud) G.hud();
        }
        if (st === 'menu') api.cartaz(T.titulo, [ls === 3 ? T.sem3d : T.sub], ls === 1 ? T.carregando : T.toque);
        else fim(st);
      }
    };

  }
});
