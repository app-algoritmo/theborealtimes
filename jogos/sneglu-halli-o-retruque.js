/* Sneglu-Halli — o retruque (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-halli',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O retruque",
    "sub": "Na corte de Harald, os insultos voam em dois níveis, o de cima e o de baixo, na direção de Halli. Toque no nível em que o insulto chega, ou use as setas para cima e para baixo, quando ele entrar na zona brilhante, para devolvê-lo. Devolver sem insulto na zona é erro. Insulto que passa é erro. Devolva 14 insultos antes de o tempo acabar. Três erros encerram o jogo.",
    "perdeu": "Halli ficou sem resposta",
    "v1": "Retruque certeiro!",
    "v2": "O Sneglu-Halla þáttr conta que o islandês Halli enfrenta o rei Harald e o poeta Thjodolf com respostas ferinas, num senna. Os insultos que voam e a zona de devolução são invenção.",
    "h1": "Respostas",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador.",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The comeback",
    "sub": "At Harald's court, insults fly on two levels, the upper and the lower, toward Halli. Tap the level where the insult arrives, or use the up and down arrows, when it enters the glowing zone, to send it back. Returning with no insult in the zone is a mistake. An insult that gets past is a mistake. Return 14 insults before time runs out. Three mistakes end the game.",
    "perdeu": "Halli had no reply",
    "v1": "A sharp comeback!",
    "v2": "The Sneglu-Halla þáttr tells that the Icelander Halli faces King Harald and the poet Thjodolf with cutting replies, in a senna. The insults that fly and the return zone are invention.",
    "h1": "Replies",
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser.",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Svaret",
    "sub": "Ved hoffet til Harald flyr fornærmelsene på to nivåer, det øvre og det nedre, mot Halli. Trykk på nivået der fornærmelsen kommer, eller bruk pil opp og pil ned, når den kommer inn i den lysende sonen, for å sende den tilbake. Å svare uten fornærmelse i sonen er en feil. En fornærmelse som kommer forbi, er en feil. Svar på 14 fornærmelser før tiden er ute. Tre feil avslutter spillet.",
    "perdeu": "Halli ble svar skyldig",
    "v1": "Et skarpt svar!",
    "v2": "Sneglu-Halla þáttr forteller at islendingen Halli møter kong Harald og skalden Tjodolv med skarpe svar, i en senna. Fornærmelsene som flyr, og sonen for å sende dem tilbake, er oppdiktet.",
    "h1": "Svar",
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
    var CFG = {"sky": 2758672, "fog": [30, 80], "hemi": [16767392, 2758672], "sun": 16763008, "sunPos": [6, 22, 14], "cam": [0, 5, 10], "look": [0, 1.6, 0], "fov": 58, "fovP": 72, "target": 14, "maxe": 3, "total": 90, "bgA": "#0e2335", "bgB": "#050b12"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-halli');
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
      var ZX = -3.2, ZW = 1.5, LY = [3.4, 0.9], balls = [], spawn = 0, hot = [0, 0], SP = 5.2;
      function scr() { var o = []; for (var i = 0; i < 2; i++) o.push(toScr(ZX, LY[i], 0)); return o; }
      function tap(l) {
        var b = null, bd = 99;
        for (var i = 0; i < balls.length; i++) if (!balls[i].back && balls[i].l === l && Math.abs(balls[i].x - ZX) < ZW && Math.abs(balls[i].x - ZX) < bd) { b = balls[i]; bd = Math.abs(balls[i].x - ZX); }
        hot[l] = 0.25;
        if (b) { b.back = true; burst(b.x, LY[l], 0, 14, 2.8, 1, 0.8, 0.3, 3); api.nota(440 + l * 140, 0.2, 'triangle', 0.08); good(); }
        else bad();
      }
      return {
        init: function () {
          var i, m;
          m = new TH.Mesh(new TH.PlaneGeometry(60, 40), mat(0x5a3d22)); m.rotation.x = -Math.PI / 2; m.position.set(0, -0.05, -4); scene.add(m);
          m = new TH.Mesh(new TH.PlaneGeometry(60, 24), mat(0x3a2616)); m.position.set(0, 9, -7); scene.add(m);
          for (i = 0; i < 2; i++) { m = new TH.Mesh(new TH.BoxGeometry(12.6, 0.08, 0.5), mat(0x8a6a3a)); m.position.set(0.6, LY[i] - 0.35, 0); scene.add(m); }
          for (i = 0; i < 2; i++) { m = new TH.Mesh(new TH.BoxGeometry(ZW * 2, 0.9, 0.2), new TH.MeshBasicMaterial({ color: 0xffd870, transparent: true, opacity: 0.35 })); m.position.set(ZX, LY[i], 0); scene.add(m); }
          var h = new TH.Group(), b = new TH.Mesh(new TH.ConeGeometry(0.9, 2.6, 7), mat(0x3a5a8a)); b.position.y = 1.3; h.add(b);
          var hd = new TH.Mesh(new TH.SphereGeometry(0.5, 8, 6), mat(0xf0d8b8)); hd.position.y = 3; h.add(hd); h.position.set(-5.7, 0, 0); scene.add(h);
          var k = new TH.Group(), kb = new TH.Mesh(new TH.ConeGeometry(1.1, 3, 7), mat(0x8a2a2a)); kb.position.y = 1.5; k.add(kb);
          var kh = new TH.Mesh(new TH.SphereGeometry(0.6, 8, 6), mat(0xf0d8b8)); kh.position.y = 3.5; k.add(kh); k.position.set(6.9, 0, 0); scene.add(k);
        },
        start: function () { for (var i = 0; i < balls.length; i++) scene.remove(balls[i].m); balls = []; spawn = 0.8; },
        logic: function (dt) {
          spawn -= dt;
          if (spawn <= 0) { var l = Math.floor(Math.random() * 2), m = new TH.Mesh(new TH.OctahedronGeometry(0.5, 0), mat(0xc83a3a, { emissive: 0x601010 })); m.position.set(6.2, LY[l], 0); scene.add(m); balls.push({ l: l, x: 6.2, back: false, m: m }); spawn = Math.max(0.95, 1.55 - score * 0.04); }
          for (var i = balls.length - 1; i >= 0; i--) {
            var b = balls[i];
            if (b.back) { b.x += SP * 1.6 * dt; if (b.x > 6.6) { scene.remove(b.m); balls.splice(i, 1); } }
            else { b.x -= (SP + Math.min(score, 14) * 0.1) * dt; if (b.x < ZX - ZW - 0.2) { scene.remove(b.m); balls.splice(i, 1); bad(); } }
          }
        },
        down: function (x, y) { var P = scr(); tap(Math.abs(P[0].y - y) <= Math.abs(P[1].y - y) ? 0 : 1); },
        key: function (c, d) { if (!d) return; if (c === 'ArrowUp' || c === 'KeyW') tap(0); else if (c === 'ArrowDown' || c === 'KeyS') tap(1); },
        cam: function (sk) { var f = fit(); setCam(sk, 5 + 3 * (f - 1), 10 * f, 0, 1.6, 0); },
        anim: function (dt) {
          for (var i = 0; i < balls.length; i++) { balls[i].m.position.x = balls[i].x; balls[i].m.rotation.y += dt * 6; balls[i].m.rotation.x += dt * 3; }
          this.cam(camShake(dt));
        },
        dbg: function () { var o = []; for (var i = 0; i < balls.length; i++) if (!balls[i].back) o.push({ l: balls[i].l, d: balls[i].x - ZX }); return { balls: o, pos: scr() }; }
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
