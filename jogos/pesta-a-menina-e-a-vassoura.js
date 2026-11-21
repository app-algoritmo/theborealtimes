/* Pesta — a menina e a vassoura (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-pesta',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A menina e a vassoura",
    "sub": "Pesta, a velha da peste, viaja de fazenda em fazenda com vassoura e rastelo. A menina precisa escapar e juntar pão. Pães e ferramentas caem do alto. Toque no lado esquerdo ou direito da tela para mudar de faixa, ou use as setas do teclado. Pegue os pães dourados e desvie das vassouras e dos rastelos. Pegar uma ferramenta é erro. Junte 14 pães antes do tempo acabar. Três erros encerram o jogo.",
    "perdeu": "A velha alcançou a menina",
    "v1": "A menina escapou!",
    "v2": "Nas lendas norueguesas, Pesta viaja de fazenda em fazenda com uma vassoura e um rastelo, e em várias lendas uma menina escapa, como em Jostedalen. Os pães que caem, as faixas e o ritmo do jogo são invenção.",
    "h1": "Pães",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador.",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The girl and the broom",
    "sub": "Pesta, the old woman of the plague, travels from farm to farm with a broom and a rake. The girl has to escape and gather bread. Loaves and tools fall from above. Tap the left or right side of the screen to change lane, or use the arrow keys. Catch the golden loaves and dodge the brooms and rakes. Catching a tool is a mistake. Gather 14 loaves before time runs out. Three mistakes end the game.",
    "perdeu": "The old woman caught the girl",
    "v1": "The girl escaped!",
    "v2": "In Norwegian legends, Pesta travels from farm to farm with a broom and a rake, and in several legends a girl escapes, as in Jostedalen. The falling loaves, the lanes and the rhythm of the game are invention.",
    "h1": "Loaves",
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser.",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Jenta og kosten",
    "sub": "Pesta, pestkjerringa, reiser fra gård til gård med kost og rive. Jenta må rømme og samle brød. Brød og redskaper faller ovenfra. Trykk på venstre eller høyre side av skjermen for å bytte felt, eller bruk piltastene. Fang de gyldne brødene og unngå kostene og rivene. Å fange et redskap er en feil. Samle 14 brød før tiden er ute. Tre feil avslutter spillet.",
    "perdeu": "Kjerringa tok igjen jenta",
    "v1": "Jenta slapp unna!",
    "v2": "I norske sagn reiser Pesta fra gård til gård med kost og rive, og i flere sagn slipper en jente unna, som i Jostedalen. Brødene som faller, feltene og rytmen i spillet er oppdiktet.",
    "h1": "Brød",
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
    var CFG = {"sky": 2764856, "fog": [30, 80], "hemi": [13687012, 2106412], "sun": 15789280, "sunPos": [-6, 24, 12], "cam": [0, 5.5, 9], "look": [0, 1.0, -1], "fov": 58, "fovP": 72, "target": 14, "maxe": 3, "total": 150, "bgA": "#0e2335", "bgB": "#050b12"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-pesta');
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
      var lane = 2, O = [], spT = 0.5, girl, P = [], lastL = -1;
      function lx(i) { return (i - 2) * 2.0; }
      function mkO(good2) {
        var gr = new TH.Group(), m;
        if (good2) {
          m = new TH.Mesh(new TH.SphereGeometry(0.45, 10, 8), mat(0xd8a24a)); m.scale.set(1.2, 0.8, 1); gr.add(m);
          m = new TH.Mesh(new TH.BoxGeometry(0.7, 0.05, 0.05), mat(0x8a5a20)); m.position.set(0, 0.34, 0.3); gr.add(m);
        } else if (Math.random() < 0.5) {
          m = new TH.Mesh(new TH.CylinderGeometry(0.05, 0.05, 1.3, 5), mat(0x6a4a2a)); m.position.y = 0.3; gr.add(m);
          m = new TH.Mesh(new TH.ConeGeometry(0.45, 0.8, 8), mat(0x9a8a5a)); m.position.y = -0.55; m.rotation.x = Math.PI; gr.add(m);
        } else {
          m = new TH.Mesh(new TH.CylinderGeometry(0.05, 0.05, 1.3, 5), mat(0x6a4a2a)); m.position.y = 0.3; gr.add(m);
          m = new TH.Mesh(new TH.BoxGeometry(0.9, 0.12, 0.12), mat(0x8a8a92)); m.position.y = -0.4; gr.add(m);
          m = new TH.Mesh(new TH.BoxGeometry(0.1, 0.4, 0.1), mat(0x8a8a92)); m.position.set(-0.35, -0.6, 0); gr.add(m);
          m = new TH.Mesh(new TH.BoxGeometry(0.1, 0.4, 0.1), mat(0x8a8a92)); m.position.set(0.35, -0.6, 0); gr.add(m);
        }
        return gr;
      }
      function mv(d) { lane = Math.max(0, Math.min(4, lane + d)); }
      function scr() { return [{ x: api.w * 0.25, y: api.h * 0.55 }, { x: api.w * 0.75, y: api.h * 0.55 }]; }
      return {
        init: function () {
          var i, m;
          m = new TH.Mesh(new TH.PlaneGeometry(70, 50), mat(0x6a6a72)); m.rotation.x = -Math.PI / 2; m.position.set(0, -0.05, -8); scene.add(m);
          girl = new TH.Group(); m = new TH.Mesh(new TH.ConeGeometry(0.7, 1.6, 7), mat(0x8a6a5a)); m.position.y = 0.8; girl.add(m);
          m = new TH.Mesh(new TH.SphereGeometry(0.34, 8, 6), mat(0xf0d8b8)); m.position.y = 1.85; girl.add(m);
          m = new TH.Mesh(new TH.CylinderGeometry(0.55, 0.4, 0.4, 8), mat(0x8a6a3a)); m.position.set(0, 0.95, 0.45); girl.add(m);
          girl.position.set(lx(2), 0, 0.2); scene.add(girl);
          for (i = 0; i < 5; i++) { m = new TH.Mesh(new TH.BoxGeometry(1.7, 0.04, 14), mat(i % 2 ? 0x5a5a62 : 0x52525a)); m.position.set(lx(i), 0, -5); scene.add(m); }
          for (i = 0; i < 8; i++) { m = new TH.Mesh(new TH.ConeGeometry(1.2, 4 + (i % 3), 6), mat(0x23402a)); m.position.set(-18 + i * 5, 2, -15); scene.add(m); }
        },
        start: function () { for (var i = 0; i < O.length; i++) drop(O[i].m); O = []; lane = 2; spT = 0.5; },
        logic: function (dt) {
          var i;
          spT -= dt;
          if (spT <= 0) {
            var l = Math.floor(Math.random() * 5); if (l === lastL) l = (l + 1 + Math.floor(Math.random() * 4)) % 5; lastL = l;
            var gd = Math.random() < 0.45, m = mkO(gd); m.position.set(lx(l), 9, 0.2); scene.add(m); O.push({ m: m, l: l, y: 9, g: gd }); spT = Math.max(0.45, 0.72 - score * 0.02);
          }
          var v = 3.4 + Math.min(score, 12) * 0.06;
          for (i = O.length - 1; i >= 0; i--) {
            var o = O[i]; o.y -= v * dt;
            if (o.y <= 1.1 && !o.c) {
              o.c = true;
              if (o.l === lane) { if (o.g) { burst(lx(lane), 1.2, 0.2, 12, 2.4, 0.8, 0.5, 1, 3); good(); } else { burst(lx(lane), 1.2, 0.2, 14, 2.8, 1, 0.3, 0.2, 3); bad(); } drop(o.m); O.splice(i, 1); continue; }
            }
            if (o.y <= 0.1) { drop(o.m); O.splice(i, 1); }
          }
        },
        down: function (x) { mv(x < api.w / 2 ? -1 : 1); },
        key: function (c, d) { if (!d) return; if (c === 'ArrowLeft' || c === 'KeyA') mv(-1); else if (c === 'ArrowRight' || c === 'KeyD') mv(1); },
        cam: function (sk) { var f = fit(); setCam(sk, 5.5 + 2.5 * (f - 1), 9 * f, 0, 1.0, -1); },
        anim: function (dt) {
          var gx = lx(lane); girl.position.x += (gx - girl.position.x) * Math.min(1, dt * 14);
          for (var i = 0; i < O.length; i++) { O[i].m.position.set(lx(O[i].l), O[i].y, 0.2); O[i].m.rotation.y += dt * 2; }
          this.cam(camShake(dt));
        },
        hud: function () { var W = api.w, H = api.h; txt('◀', W * 0.1, H * 0.9, 26, 'rgba(255,255,255,.35)', 'center'); txt('▶', W * 0.9, H * 0.9, 26, 'rgba(255,255,255,.35)', 'center'); },
        dbg: function () { var oo = []; for (var i = 0; i < O.length; i++) if (!O[i].c) oo.push({ l: O[i].l, y: O[i].y, g: O[i].g }); return { lane: lane, objs: oo, pos: scr() }; }
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
