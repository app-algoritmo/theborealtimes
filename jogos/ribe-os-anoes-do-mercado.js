/* O crânio de Ribe — os anões do mercado (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-ribe-craneo',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "Os anões do mercado",
    "sub": "Em Ribe, um amuleto de osso com runas pedia proteção contra um anão. Anões de chapéu verde e mercadores de manto azul caminham até as barracas do mercado. Toque nos anões para detê-los antes que cheguem às barracas. Não toque nos mercadores, que são gente de paz. Um anão que chega à barraca é erro, e tocar num mercador também. Detenha 14 anões antes do tempo acabar. Três erros encerram o jogo.",
    "perdeu": "O mercado foi invadido",
    "v1": "O mercado está a salvo!",
    "v2": "O crânio de Ribe, de cerca de 725, traz runas que parecem invocar Odin e proteger contra um anão. Os anões que invadem o mercado e o ritmo do jogo são invenção.",
    "h1": "Anões",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador.",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The dwarves of the market",
    "sub": "At Ribe, a bone amulet with runes asked for protection against a dwarf. Dwarves in green hats and merchants in blue cloaks walk toward the market stalls. Tap the dwarves to stop them before they reach the stalls. Do not tap the merchants, who are peaceful people. A dwarf that reaches a stall is a mistake, and so is tapping a merchant. Stop 14 dwarves before time runs out. Three mistakes end the game.",
    "perdeu": "The market was overrun",
    "v1": "The market is safe!",
    "v2": "The Ribe skull, of about 725, bears runes that seem to invoke Odin and protect against a dwarf. The dwarves that invade the market and the rhythm of the game are invention.",
    "h1": "Dwarves",
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser.",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Dvergene på markedet",
    "sub": "I Ribe ba en beinamulett med runer om beskyttelse mot en dverg. Dverger med grønne hatter og kjøpmenn i blå kapper går mot markedsbodene. Trykk på dvergene for å stoppe dem før de når bodene. Ikke trykk på kjøpmennene, som er fredelige folk. En dverg som når en bod, er en feil, og det er også å trykke på en kjøpmann. Stopp 14 dverger før tiden er ute. Tre feil avslutter spillet.",
    "perdeu": "Markedet ble overrent",
    "v1": "Markedet er trygt!",
    "v2": "Ribe-hodeskallen, fra omkring 725, har runer som ser ut til å påkalle Odin og beskytte mot en dverg. Dvergene som invaderer markedet, og rytmen i spillet er oppdiktet.",
    "h1": "Dverger",
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
    var CFG = {"sky": 2765896, "fog": [26, 80], "hemi": [14213360, 2369584], "sun": 16773336, "sunPos": [-6, 24, 12], "cam": [0, 6, 9], "look": [0, 0.8, -1], "fov": 58, "fovP": 72, "target": 14, "maxe": 3, "total": 130, "bgA": "#0e2335", "bgB": "#050b12"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-ribe-craneo');
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
      var C = [], spT = 0.6, P = [];
      function lx(i) { return (i - 1) * 3.4; }
      function sp() { return 1.9 + Math.min(score, 12) * 0.07; }
      function mkC(dw) {
        var gr = new TH.Group(), m;
        if (dw) {
          m = new TH.Mesh(new TH.ConeGeometry(0.5, 1.0, 7), mat(0x8a4a2a)); m.position.y = 0.5; gr.add(m);
          m = new TH.Mesh(new TH.SphereGeometry(0.3, 8, 6), mat(0xf0d0b0)); m.position.y = 1.15; gr.add(m);
          m = new TH.Mesh(new TH.ConeGeometry(0.28, 0.7, 6), mat(0x3aa84a)); m.position.y = 1.7; gr.add(m);
          m = new TH.Mesh(new TH.ConeGeometry(0.22, 0.5, 6), mat(0xf4f0e8)); m.position.set(0, 0.85, 0.2); m.rotation.x = Math.PI; gr.add(m);
        } else {
          m = new TH.Mesh(new TH.ConeGeometry(0.6, 1.9, 7), mat(0x3a6ab0)); m.position.y = 0.95; gr.add(m);
          m = new TH.Mesh(new TH.SphereGeometry(0.32, 8, 6), mat(0xf0d8b8)); m.position.y = 2.1; gr.add(m);
          m = new TH.Mesh(new TH.CylinderGeometry(0.34, 0.34, 0.2, 8), mat(0xc8a060)); m.position.y = 2.4; gr.add(m);
        }
        gr.scale.set(dw ? 1.5 : 1.25, dw ? 1.5 : 1.25, dw ? 1.5 : 1.25); return gr;
      }
      function scr() { var o = []; for (var i = 0; i < C.length; i++) o.push(toScr(C[i].x, C[i].dw ? 0.8 : 1.1, C[i].z)); return o; }
      return {
        init: function () {
          var i, m;
          m = new TH.Mesh(new TH.PlaneGeometry(70, 60), mat(0x6a5a40)); m.rotation.x = -Math.PI / 2; m.position.set(0, -0.05, -10); scene.add(m);
          for (i = 0; i < 3; i++) {
            m = new TH.Mesh(new TH.BoxGeometry(2.4, 0.9, 1.4), mat(0x7a5230)); m.position.set(lx(i), 0.45, 3.0); scene.add(m);
            m = new TH.Mesh(new TH.BoxGeometry(2.8, 0.15, 1.8), mat(i % 2 ? 0xc84a3a : 0xe8d8a8)); m.position.set(lx(i), 2.2, 3.0); m.rotation.x = 0.25; scene.add(m);
            m = new TH.Mesh(new TH.CylinderGeometry(0.06, 0.06, 2.2, 5), mat(0x4a3220)); m.position.set(lx(i) - 1.2, 1.1, 3.5); scene.add(m);
            m = new TH.Mesh(new TH.CylinderGeometry(0.06, 0.06, 2.2, 5), mat(0x4a3220)); m.position.set(lx(i) + 1.2, 1.1, 3.5); scene.add(m);
          }
          for (i = 0; i < 8; i++) { m = new TH.Mesh(new TH.BoxGeometry(2.4, 2.2 + (i % 3), 2.2), mat(0x5a4a3a)); m.position.set(-20 + i * 6, 1.4, -18); scene.add(m); }
        },
        start: function () { for (var i = 0; i < C.length; i++) drop(C[i].m); C = []; spT = 0.6; P = []; },
        logic: function (dt) {
          var i;
          spT -= dt;
          if (spT <= 0) {
            var dw = Math.random() < 0.45, l = Math.floor(Math.random() * 3), m = mkC(dw);
            m.position.set(lx(l), 0, -7); scene.add(m); C.push({ m: m, x: lx(l), z: -7, dw: dw }); spT = Math.max(0.7, 1.25 - score * 0.04);
          }
          for (i = C.length - 1; i >= 0; i--) {
            C[i].z += sp() * dt;
            if (C[i].z >= 2.0) { if (C[i].dw) { burst(C[i].x, 1, 2, 14, 2.6, 1, 0.3, 0.2, 3); bad(); } drop(C[i].m); C.splice(i, 1); }
          }
        },
        down: function (x, y) {
          var P2 = scr(), i = nearest(P2, x, y, Math.max(40, 0.1 * Math.min(api.w, api.h)));
          if (i < 0) return; var c = C[i];
          if (c.dw) { burst(c.x, 1, c.z, 14, 2.4, 0.4, 0.9, 0.4, 3); good(); } else { burst(c.x, 1.2, c.z, 14, 2.6, 1, 0.3, 0.2, 3); bad(); }
          drop(c.m); C.splice(i, 1);
        },
        cam: function (sk) { var f = fit(); setCam(sk, 6 + 3 * (f - 1), 9 * f, 0, 0.8, -1); },
        anim: function (dt) { for (var i = 0; i < C.length; i++) C[i].m.position.set(C[i].x, Math.abs(Math.sin(sceneT * 6 + i)) * 0.08, C[i].z); this.cam(camShake(dt)); },
        dbg: function () {
          var pos = scr(), dws = [];
          for (var i = 0; i < C.length; i++) if (C[i].dw && C[i].z > -5) dws.push({ z: C[i].z, p: pos[i] });
          if (!pos.length) pos = [{ x: api.w / 2, y: api.h / 2 }];
          return { pos: pos, dws: dws };
        }
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
