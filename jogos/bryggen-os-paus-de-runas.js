/* Bryggen — os paus de runas (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-bryggen',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os paus de runas",
    "sub": "No cais de Bergen, os comerciantes trazem paus com runas. Leia o texto do pau, no alto da tela, e toque na caixa certa: Dono, para etiquetas de nome, Recado, para mensagens, ou Prece, para textos religiosos. Também pode usar as teclas 1, 2 e 3. Caixa errada é erro, e pau sem destino quando o tempo da rodada acaba também é erro. Separe 12 paus antes do tempo acabar. Três erros encerram o jogo.",
    "perdeu": "Os paus se misturaram",
    "v1": "Paus separados!",
    "v2": "Nas inscrições rúnicas de Bryggen, em Bergen, há etiquetas como \"Eysteinn á mik\", recados como \"Ást min, kyss mik\" e textos em latim como \"Ave Maria\". Algumas frases do jogo são inspiradas nelas, e a separação em caixas é invenção.",
    "h1": "Paus",
    "bins": [
      "Dono",
      "Recado",
      "Prece"
    ],
    "it": [
      "Eysteinn é meu dono",
      "Gyða é minha dona",
      "Meu amor, beije-me",
      "Gyða diz que você vá para casa",
      "Ave Maria",
      "Em nome do Pai"
    ],
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador.",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The rune sticks",
    "sub": "On the wharf at Bergen, merchants bring sticks with runes. Read the text of the stick, at the top of the screen, and tap the right box: Owner, for name tags, Message, for messages, or Prayer, for religious texts. You can also use keys 1, 2 and 3. A wrong box is a mistake, and a stick left unsorted when the round time ends is also a mistake. Sort 12 sticks before time runs out. Three mistakes end the game.",
    "perdeu": "The sticks got mixed up",
    "v1": "Sticks sorted!",
    "v2": "Among the runic inscriptions of Bryggen, in Bergen, there are tags such as \"Eysteinn á mik\", messages such as \"Ást min, kyss mik\" and Latin texts such as \"Ave Maria\". Some phrases in the game are inspired by them, and the sorting into boxes is invention.",
    "h1": "Sticks",
    "bins": [
      "Owner",
      "Message",
      "Prayer"
    ],
    "it": [
      "Eysteinn owns me",
      "Gyða owns me",
      "My love, kiss me",
      "Gyða tells you to go home",
      "Ave Maria",
      "In the name of the Father"
    ],
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser.",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Runepinnene",
    "sub": "På bryggen i Bergen kommer kjøpmennene med pinner med runer. Les teksten på pinnen, øverst på skjermen, og trykk på riktig boks: Eier, for navnelapper, Beskjed, for meldinger, eller Bønn, for religiøse tekster. Du kan også bruke tastene 1, 2 og 3. En feil boks er en feil, og en pinne som ikke er sortert når rundens tid er ute, er også en feil. Sorter 12 pinner før tiden er ute. Tre feil avslutter spillet.",
    "perdeu": "Pinnene ble blandet",
    "v1": "Pinnene er sortert!",
    "v2": "Blant runeinnskriftene fra Bryggen i Bergen finnes navnelapper som «Eysteinn á mik», beskjeder som «Ást min, kyss mik» og latinske tekster som «Ave Maria». Noen setninger i spillet er inspirert av dem, og sorteringen i bokser er oppdiktet.",
    "h1": "Pinner",
    "bins": [
      "Eier",
      "Beskjed",
      "Bønn"
    ],
    "it": [
      "Eysteinn eier meg",
      "Gyða eier meg",
      "Min kjære, kyss meg",
      "Gyða sier du skal gå hjem",
      "Ave Maria",
      "I Faderens navn"
    ],
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
    var CFG = {"sky": 2765896, "fog": [30, 90], "hemi": [13161712, 2761752], "sun": 16769200, "sunPos": [-6, 26, 14], "cam": [0, 6, 9], "look": [0, 1.2, 0], "fov": 58, "fovP": 72, "target": 12, "maxe": 3, "total": 110, "bgA": "#0e2335", "bgB": "#050b12"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-bryggen');
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
      var IT = [['Eysteinn á mik', 0], ['Gyða á mik', 0], ['Ást min, kyss mik', 1], ['Gyða segir at þú gakk heim', 1], ['Ave Maria', 2], ['In nomine Patris', 2]], BC = [0xb8883a, 0x3a7ab8, 0xc8c8d8];
      var cur = -1, nT = 0, nLim = 5, gap = 0.8, prev = -1, stick = null, P = [];
      function bx(i) { return (i - 1) * 3.4; }
      function scr() { var o = []; for (var i = 0; i < 3; i++) o.push(toScr(bx(i), 0.9, 1.2)); return o; }
      function pick(i) {
        if (cur < 0) return;
        if (i === IT[cur][1]) { burst(bx(i), 1.2, 1.2, 18, 3, 1, 0.9, 0.5, 3); scene.remove(stick); stick = null; cur = -1; gap = 0.55; good(); }
        else bad();
      }
      return {
        init: function () {
          var i, m;
          m = new TH.Mesh(new TH.PlaneGeometry(70, 50), mat(0x6a4a2a)); m.rotation.x = -Math.PI / 2; m.position.set(0, 0, -6); scene.add(m);
          m = new TH.Mesh(new TH.PlaneGeometry(70, 26), mat(0x2a3a58)); m.position.set(0, 10, -12); scene.add(m);
          for (i = 0; i < 3; i++) { m = new TH.Mesh(new TH.BoxGeometry(2.8, 1.1, 2.2), mat(BC[i])); m.position.set(bx(i), 0.55, 1.2); scene.add(m); }
          for (i = 0; i < 6; i++) { m = new TH.Mesh(new TH.BoxGeometry(3, 4 + (i % 2), 2.4), mat([0xc83a2a, 0xd8a83a, 0x3a6aa8, 0x8a3a5a, 0x4a8a5a, 0xc86a3a][i])); m.position.set(-12.5 + i * 5, 2.2, -10); scene.add(m); }
        },
        start: function () { if (stick) { scene.remove(stick); stick = null; } cur = -1; gap = 0.8; prev = -1; P = scr(); },
        logic: function (dt) {
          nLim = Math.max(3.8, 5.4 - score * 0.12);
          if (cur >= 0) { nT += dt; if (nT >= nLim) { scene.remove(stick); stick = null; cur = -1; gap = 0.7; bad(); } }
          else { gap -= dt; if (gap <= 0) { var k; do { k = Math.floor(Math.random() * 6); } while (k === prev); prev = k; cur = k; nT = 0; stick = new TH.Mesh(new TH.BoxGeometry(3.6, 0.22, 0.7), mat(0xe0c88a)); stick.position.set(0, 2.2, -2); scene.add(stick); api.nota(320 + k * 30, 0.15, 'triangle', 0.05); } }
        },
        down: function (x, y) { if (!P.length) P = scr(); var i = nearest(P, x, y, Math.max(34, 0.14 * Math.min(api.w, api.h))); if (i >= 0) pick(i); },
        key: function (c, d) { if (!d) return; var n = { Digit1: 0, Digit2: 1, Digit3: 2 }[c]; if (n !== undefined) pick(n); },
        cam: function (sk) { var f = fit(); setCam(sk, 6 + 3 * (f - 1), 9 * f, 0, 1.2, 0); },
        anim: function (dt) {
          if (stick) { var q = nT / nLim; stick.position.y = 2.2 - 0.8 * q; stick.position.z = -2 + 2.2 * q; stick.rotation.z = Math.sin(sceneT * 3) * 0.06; }
          this.cam(camShake(dt)); P = scr();
        },
        hud: function () {
          var W = api.w, H = api.h, T = api.T, sz = Math.max(13, Math.min(22, W / 24));
          for (var i = 0; i < 3; i++) txt(T.bins[i], P[i] ? P[i].x : W / 2, (P[i] ? P[i].y : H * 0.8) + Math.max(20, H * 0.07), Math.max(12, Math.min(18, W / 30)), '#ffe9a8', 'center');
          if (cur >= 0) { txt(IT[cur][0], W / 2, Math.max(104, H * 0.2), sz, '#ffffff', 'center'); txt(T.it[cur], W / 2, Math.max(104, H * 0.2) + sz + 6, Math.max(11, sz - 5), '#c9d4f0', 'center'); }
        },
        dbg: function () { return { need: cur >= 0 ? IT[cur][1] : -1, pos: scr() }; }
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
