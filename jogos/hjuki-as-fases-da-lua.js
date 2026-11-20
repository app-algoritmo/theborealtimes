/* Hjúki e Bil — as fases da lua (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-hjuki',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "As fases da lua",
    "sub": "Máni conduz a Lua, e Hjúki e Bil a seguem. Cinco luas estão em fila, e a última é um ponto de interrogação. As fases seguem sempre a mesma ordem: a Lua cresce pela direita, fica cheia e míngua. Toque na lua de baixo que vem a seguir na fila, ou use as teclas 1, 2 e 3. Uma lua errada é erro. Acerte 10 fases antes do tempo acabar. Três erros encerram o jogo.",
    "perdeu": "A Lua se perdeu",
    "v1": "A Lua segue o seu curso!",
    "v2": "Na Edda em prosa, Snorri diz que Hjúki e Bil seguem a Lua e que Máni conduz o seu crescer e o seu minguar. A fila de fases do jogo é invenção.",
    "h1": "Fases",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador.",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The phases of the moon",
    "sub": "Máni steers the Moon, and Hjúki and Bil follow it. Five moons stand in a row, and the last one is a question mark. The phases always follow the same order: the Moon grows from the right, becomes full and wanes. Tap the moon below that comes next in the row, or use keys 1, 2 and 3. A wrong moon is a mistake. Get 10 phases right before time runs out. Three mistakes end the game.",
    "perdeu": "The Moon lost its way",
    "v1": "The Moon keeps its course!",
    "v2": "In the Prose Edda, Snorri says Hjúki and Bil follow the Moon and that Máni steers its waxing and waning. The row of phases in the game is invention.",
    "h1": "Phases",
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser.",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Månens faser",
    "sub": "Máni styrer månen, og Hjúki og Bil følger den. Fem måner står på rad, og den siste er et spørsmålstegn. Fasene følger alltid samme rekkefølge: Månen vokser fra høyre, blir full og avtar. Trykk på månen under som kommer neste gang i rekka, eller bruk tastene 1, 2 og 3. En feil måne er en feil. Få 10 faser riktig før tiden er ute. Tre feil avslutter spillet.",
    "perdeu": "Månen gikk seg vill",
    "v1": "Månen følger sin bane!",
    "v2": "I Snorres Edda sier Snorre at Hjúki og Bil følger månen, og at Máni styrer månens vekst og avtakende. Rekka med faser i spillet er oppdiktet.",
    "h1": "Faser",
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
    var CFG = {"sky": 791088, "fog": [40, 100], "hemi": [12108016, 1053740], "sun": 14673663, "sunPos": [0, 20, 20], "cam": [0, 2.4, 10], "look": [0, 2.1, 0], "fov": 58, "fovP": 72, "target": 10, "maxe": 3, "total": 110, "bgA": "#0e2335", "bgB": "#050b12"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-hjuki');
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
      var c = 0, ans = 0, opts = [0, 1, 2], ai = 0, cd = 0, seqM = [], optM = [], tex = [], qT = null;
      function phaseTex(k) {
        return ctex(96, 96, function (x, w, h) {
          var r = 44, cx = 48, cy = 48;
          x.fillStyle = '#242c54'; x.beginPath(); x.arc(cx, cy, r, 0, 6.283); x.fill();
          if (k !== 0) {
            x.fillStyle = '#f4eed2';
            if (k === 4) { x.beginPath(); x.arc(cx, cy, r, 0, 6.283); x.fill(); }
            else {
              var right = k < 4, kk = right ? k : 8 - k;
              x.beginPath(); x.arc(cx, cy, r, right ? -Math.PI / 2 : Math.PI / 2, right ? Math.PI / 2 : Math.PI * 1.5); x.closePath(); x.fill();
              var xr = r * Math.abs(Math.cos(kk * Math.PI / 4));
              if (kk === 1) { x.fillStyle = '#242c54'; x.beginPath(); x.ellipse(cx, cy, xr, r, 0, 0, 6.283); x.fill(); }
              else if (kk === 3) { x.beginPath(); x.ellipse(cx, cy, xr, r, 0, 0, 6.283); x.fill(); }
            }
          }
          x.strokeStyle = 'rgba(255,255,255,.55)'; x.lineWidth = 3; x.beginPath(); x.arc(cx, cy, r, 0, 6.283); x.stroke();
        });
      }
      function qTex() { return ctex(96, 96, function (x) { x.fillStyle = '#242c54'; x.beginPath(); x.arc(48, 48, 44, 0, 6.283); x.fill(); x.strokeStyle = '#ffd870'; x.lineWidth = 4; x.beginPath(); x.arc(48, 48, 44, 0, 6.283); x.stroke(); x.fillStyle = '#ffd870'; x.font = 'bold 56px Georgia'; x.textAlign = 'center'; x.fillText('?', 48, 68); }); }
      function sx(i) { return (i - 2) * 2.3; }
      function ox(j) { return (j - 1) * 3.0; }
      function scr() { var o = []; for (var j = 0; j < 3; j++) o.push(toScr(ox(j), 0.7, 0)); return o; }
      function setQ() {
        c = Math.floor(Math.random() * 8); ans = (c + 4) % 8; var o = [ans], k;
        while (o.length < 3) { k = Math.floor(Math.random() * 8); if (o.indexOf(k) < 0) o.push(k); }
        for (var i = 2; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = o[i]; o[i] = o[j]; o[j] = t; }
        opts = o; ai = o.indexOf(ans);
        for (var s = 0; s < 4; s++) if (seqM[s] && seqM[s].material) seqM[s].material.map = tex[(c + s) % 8];
        for (var q = 0; q < 3; q++) if (optM[q] && optM[q].material) optM[q].material.map = tex[opts[q]];
      }
      function pick(j) {
        if (cd > 0) return; cd = 0.3;
        if (j === ai) { burst(ox(j), 0.9, 0.5, 14, 2.4, 1, 0.95, 0.7, 3); good(); if (st === 'play') setQ(); }
        else { bad(); }
      }
      function mk(t, r, x, y) { var m = new TH.Mesh(new TH.CircleGeometry(r, 28), new TH.MeshBasicMaterial({ map: t, transparent: true })); m.position.set(x, y, 0); scene.add(m); return m; }
      return {
        init: function () {
          var i, m;
          for (i = 0; i < 8; i++) tex.push(phaseTex(i));
          qT = qTex();
          for (i = 0; i < 4; i++) seqM.push(mk(tex[i], 0.95, sx(i), 3.5));
          seqM.push(mk(qT, 0.95, sx(4), 3.5));
          for (i = 0; i < 3; i++) optM.push(mk(tex[i], 1.0, ox(i), 0.7));
          m = new TH.Mesh(new TH.PlaneGeometry(60, 30), new TH.MeshBasicMaterial({ color: 0x080c20 })); m.position.set(0, 2, -4); scene.add(m);
          for (i = 0; i < 40; i++) { m = new TH.Mesh(new TH.SphereGeometry(0.05 + (i % 3) * 0.02, 4, 3), new TH.MeshBasicMaterial({ color: 0xdde4ff })); m.position.set(-12 + (i * 7.3) % 24, -1 + (i * 3.1) % 8, -3.5); scene.add(m); }
        },
        start: function () { cd = 0; setQ(); },
        logic: function (dt) { if (cd > 0) cd -= dt; },
        down: function (x, y) { var P = scr(); var j = nearest(P, x, y, Math.max(40, 0.14 * Math.min(api.w, api.h))); if (j >= 0) pick(j); },
        key: function (c2, d) { if (!d) return; var n = { Digit1: 0, Digit2: 1, Digit3: 2 }[c2]; if (n !== undefined) pick(n); },
        cam: function (sk) { var f = fit(); setCam(sk, 2.4 + 1.5 * (f - 1), 10 * f, 0, 2.1, 0); },
        anim: function (dt) { this.cam(camShake(dt)); },
        hud: function () { var P = scr(); for (var j = 0; j < 3; j++) txt(String(j + 1), P[j].x, P[j].y + Math.max(44, api.h * 0.1), 15, '#c9b3f2', 'center'); },
        dbg: function () { return { need: ai, pos: scr() }; }
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
