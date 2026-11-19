/* Valemon — o labirinto de gelo (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-valemon',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O labirinto de gelo",
    "sub": "Conduza o urso branco pelo labirinto de gelo até o castelo no canto oposto. Toque na direção em que quer ir, em relação ao urso: acima, abaixo, à esquerda ou à direita. Bater numa parede é erro. Atravesse 3 labirintos antes do tempo acabar. Cinco erros encerram o jogo.",
    "perdeu": "Você se perdeu no gelo",
    "v1": "O castelo à vista!",
    "v2": "No conto, a princesa segue o urso branco, que é o rei Valemon enfeitiçado, até o castelo de uma bruxa. O labirinto é invenção.",
    "h1": "Labirintos",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador.",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The ice maze",
    "sub": "Lead the white bear through the ice maze to the castle in the opposite corner. Tap in the direction you want to go, relative to the bear: up, down, left or right. Bumping into a wall is a mistake. Get through 3 mazes before time runs out. Five mistakes end the game.",
    "perdeu": "You got lost in the ice",
    "v1": "The castle in sight!",
    "v2": "In the tale, the princess follows the white bear, who is the enchanted King Valemon, to the castle of a witch. The maze is invented.",
    "h1": "Mazes",
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser.",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Isblandingen",
    "sub": "Led den hvite bjørnen gjennom isblandingen til slottet i det motsatte hjørnet. Trykk i retningen du vil gå, sett fra bjørnen: opp, ned, venstre eller høyre. Å støte mot en vegg er en feil. Kom gjennom 3 labyrinter før tiden er ute. Fem feil avslutter spillet.",
    "perdeu": "Du gikk deg vill i isen",
    "v1": "Slottet i sikte!",
    "v2": "I eventyret følger prinsessen den hvite bjørnen, som er den fortryllede kong Valemon, til slottet til en heks. Labyrinten er oppfunnet.",
    "h1": "Labyrinter",
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
    var CFG = {"sky": 1320504, "fog": [50, 140], "hemi": [12638448, 2109500], "sun": 15398143, "sunPos": [10, 40, 20], "cam": [0, 22, 10], "look": [0, 0, 0.6], "fov": 56, "fovP": 70, "target": 3, "maxe": 5, "total": 150, "bgA": "#0e2335", "bgB": "#050b12"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-valemon');
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
      var n = 5, open = [], pr = 0, pc = 0, fr = 0, fc = 0, glide = 0, bump = 0, bdir = [0, 0], lvl = 0, walls = [], bear, castle, CS = 2.4;
      function wx(c) { return (c - (n - 1) / 2) * CS; }
      function wz(r) { return (r - (n - 1) / 2) * CS; }
      function gen() {
        open = []; for (var i = 0; i < n * n; i++) open.push(0);
        var seen = {}, stk = [[0, 0]]; seen[0] = true;
        var D = [[-1, 0, 1, 4], [0, 1, 2, 8], [1, 0, 4, 1], [0, -1, 8, 2]];
        while (stk.length) {
          var c = stk[stk.length - 1], nb = [];
          for (var d = 0; d < 4; d++) { var rr = c[0] + D[d][0], cc = c[1] + D[d][1]; if (rr >= 0 && rr < n && cc >= 0 && cc < n && !seen[rr * n + cc]) nb.push(d); }
          if (!nb.length) { stk.pop(); continue; }
          var k = nb[Math.floor(Math.random() * nb.length)], r2 = c[0] + D[k][0], c2 = c[1] + D[k][1];
          open[c[0] * n + c[1]] |= D[k][2]; open[r2 * n + c2] |= D[k][3]; seen[r2 * n + c2] = true; stk.push([r2, c2]);
        }
      }
      function build() {
        walls.forEach(function (w) { scene.remove(w); }); walls = [];
        function wall(x, z, horiz) { var m = new TH.Mesh(new TH.BoxGeometry(horiz ? CS + 0.3 : 0.3, 1.3, horiz ? 0.3 : CS + 0.3), mat(0xa8d4ee, { shininess: 90 })); m.position.set(x, 0.65, z); scene.add(m); walls.push(m); }
        for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) {
          var o = open[r * n + c];
          if (r === 0 && !(o & 1)) wall(wx(c), wz(r) - CS / 2, true);
          if (c === 0 && !(o & 8)) wall(wx(c) - CS / 2, wz(r), false);
          if (!(o & 4)) wall(wx(c), wz(r) + CS / 2, true);
          if (!(o & 2)) wall(wx(c) + CS / 2, wz(r), false);
        }
        castle.position.set(wx(n - 1), 0, wz(n - 1));
      }
      function level() { n = 5 + Math.min(lvl, 2); gen(); build(); pr = pc = fr = fc = 0; glide = 0; bump = 0; }
      function scr() { return toScr(glide > 0 ? wx(fc) + (wx(pc) - wx(fc)) * (1 - glide / 0.14) : wx(pc), 0.7, glide > 0 ? wz(fr) + (wz(pr) - wz(fr)) * (1 - glide / 0.14) : wz(pr)); }
      return {
        init: function () {
          var i, m;
          m = new TH.Mesh(new TH.PlaneGeometry(70, 60), mat(0x26425a)); m.rotation.x = -Math.PI / 2; m.position.y = -0.02; scene.add(m);
          bear = new TH.Group(); var b = new TH.Mesh(new TH.SphereGeometry(0.7, 10, 8), mat(0xffffff)); b.position.y = 0.7; b.scale.set(1, 0.85, 1.2); bear.add(b);
          var h = new TH.Mesh(new TH.SphereGeometry(0.42, 8, 6), mat(0xffffff)); h.position.set(0, 0.95, -0.7); bear.add(h);
          var nz = new TH.Mesh(new TH.SphereGeometry(0.14, 6, 5), mat(0x222222)); nz.position.set(0, 0.9, -1.1); bear.add(nz);
          for (i = -1; i <= 1; i += 2) { var e = new TH.Mesh(new TH.SphereGeometry(0.13, 6, 5), mat(0xffffff)); e.position.set(i * 0.3, 1.3, -0.65); bear.add(e); }
          var cw = new TH.Mesh(new TH.TorusGeometry(0.3, 0.07, 6, 10), mat(0xf0c050, { emissive: 0x806010 })); cw.rotation.x = Math.PI / 2; cw.position.set(0, 1.4, -0.7); bear.add(cw);
          scene.add(bear);
          castle = new TH.Group(); var kp = new TH.Mesh(new TH.BoxGeometry(1.6, 1.6, 1.6), mat(0x8a8fa0)); kp.position.y = 0.8; castle.add(kp);
          for (var q = 0; q < 4; q++) { var tw = new TH.Mesh(new TH.CylinderGeometry(0.28, 0.32, 2.2, 8), mat(0x9a9fb0)); tw.position.set((q & 1 ? 1 : -1) * 0.85, 1.1, (q & 2 ? 1 : -1) * 0.85); castle.add(tw); var rf = new TH.Mesh(new TH.ConeGeometry(0.4, 0.8, 8), mat(0xb3382c)); rf.position.set(tw.position.x, 2.5, tw.position.z); castle.add(rf); }
          scene.add(castle);
        },
        start: function () { lvl = 0; level(); },
        logic: function (dt) { if (glide > 0) { glide -= dt; if (glide <= 0) { glide = 0; if (pr === n - 1 && pc === n - 1) { burst(wx(pc), 1.5, wz(pr), 36, 6, 1, 0.9, 0.4, 4); lvl++; good(); if (st === 'play') level(); } } } if (bump > 0) bump -= dt; },
        down: function (x, y) {
          if (glide > 0) return;
          var p = scr(), dx = x - p.x, dy = y - p.y, d;
          if (Math.abs(dx) > Math.abs(dy)) d = dx > 0 ? 1 : 3; else d = dy > 0 ? 2 : 0;
          var bits = [1, 2, 4, 8], DR = [-1, 0, 1, 0], DC = [0, 1, 0, -1];
          if (open[pr * n + pc] & bits[d]) { fr = pr; fc = pc; pr += DR[d]; pc += DC[d]; glide = 0.14; api.nota(300 + (pr + pc) * 12, 0.08, 'sine', 0.04); }
          else { bump = 0.2; bdir = [DC[d], DR[d]]; api.nota(110, 0.15, 'sine', 0.1); bad(); }
        },
        anim: function (dt) {
          var x = glide > 0 ? wx(fc) + (wx(pc) - wx(fc)) * (1 - glide / 0.14) : wx(pc), z = glide > 0 ? wz(fr) + (wz(pr) - wz(fr)) * (1 - glide / 0.14) : wz(pr);
          if (bump > 0) { x += bdir[0] * 0.25 * Math.sin(bump * 16); z += bdir[1] * 0.25 * Math.sin(bump * 16); }
          bear.position.set(x, Math.abs(Math.sin(sceneT * 10)) * 0.05 * (glide > 0 ? 1 : 0), z);
          if (glide > 0) bear.rotation.y = Math.atan2(-(wx(pc) - wx(fc)), -(wz(pr) - wz(fr))) + Math.PI;
          var s = 1 + (n - 5) * 0.12; var sk = camShake(dt); setCam(sk, 18 + n * 1.2, 8 + n * 0.7, 0, 0, 0.5);
        },
        dbg: function () { var p = scr(); return { n: n, pr: pr, pc: pc, open: open.slice(), glide: glide > 0, me: p, pos: [{ x: p.x + 90, y: p.y }, { x: p.x - 90, y: p.y }, { x: p.x, y: p.y + 90 }, { x: p.x, y: p.y - 90 }] }; }
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
