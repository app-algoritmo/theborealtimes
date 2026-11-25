/* Landslov — os livros da lei (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-lagaboter',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "h2": "Erros",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador.",
    "titulo": "Os livros da lei",
    "sub": "A Landslov de Magnus Lagabøte existiu em quatro livros, um para cada jurisdição. Aqui você empilha com precisão os livros da lei. Um bloco vai de um lado a outro. Toque na tela, ou aperte Espaço, para soltá-lo sobre a mesa do escriba. O que sobrar para fora cai, e a pilha fica mais estreita, mas nunca menos que um mínimo. Errar o alvo por completo é erro. Empilhe 10 antes do tempo acabar. Três erros encerram o jogo.",
    "perdeu": "A pilha caiu",
    "v1": "A lei está de pé!",
    "v2": "Em 1274, o rei Magnus VI, chamado Lagabøte, deu à Noruega a Landslov, um código para todo o reino que existiu em quatro livros, um para cada jurisdição; ficou em uso por mais de quatrocentos anos. Os livros do jogo são invenção. O jogo em si, com seus objetos e regras, é invenção.",
    "h1": "Níveis",
    "dica": "Toque para soltar o bloco"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "h2": "Mistakes",
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser.",
    "titulo": "The law books",
    "sub": "The Landslov of Magnus Lagabøte existed in four books, one for each jurisdiction. Here you stack the law books with precision. A block slides from side to side. Tap the screen, or press Space, to drop it on the scribe's table. Whatever overhangs falls off and the stack gets narrower, but never below a minimum. Missing the stack completely is a mistake. Stack 10 before time runs out. Three mistakes end the game.",
    "perdeu": "The pile fell",
    "v1": "The law stands!",
    "v2": "In 1274, King Magnus VI, called Lagabøte, gave Norway the Landslov, a code for the whole kingdom that existed in four books, one for each jurisdiction; it stayed in use for more than four hundred years. The books in the game are invented. The game itself, with its objects and rules, is invention.",
    "h1": "Levels",
    "dica": "Tap to drop the block"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "h2": "Feil",
    "h3": "Tid",
    "carregando": "Laster 3D…",
    "sem3d": "Denne enheten kunne ikke vise 3D-grafikk. Prøv en annen nettleser.",
    "titulo": "Lovbøkene",
    "sub": "Landsloven til Magnus Lagabøte fantes i fire bøker, én for hver lagdømme. Her stabler du lovbøkene presist. En blokk glir fra side til side. Trykk på skjermen, eller trykk Mellomrom, for å slippe den på skriverens bord. Det som henger utenfor, faller av, og stabelen blir smalere, men aldri under et minimum. Å bomme helt er en feil. Stable 10 før tiden er ute. Tre feil avslutter spillet.",
    "perdeu": "Bunken falt",
    "v1": "Loven står!",
    "v2": "I 1274 ga kong Magnus 6., kalt Lagabøte, Norge Landsloven, en lov for hele riket som fantes i fire bøker, én for hver lagdømme; den var i bruk i mer enn fire hundre år. Bøkene i spillet er oppfunnet. Selve spillet, med gjenstander og regler, er oppfinnelse.",
    "h1": "Nivåer",
    "dica": "Trykk for å slippe blokken"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "h2": "Errores",
    "h3": "Tiempo",
    "carregando": "Cargando el 3D…",
    "sem3d": "Este dispositivo no pudo mostrar gráficos 3D. Prueba con otro navegador.",
    "titulo": "Los libros de la ley",
    "sub": "La Landslov de Magnus Lagabøte existió en cuatro libros, uno para cada jurisdicción. Aquí apilas con precisión los libros de la ley. Un bloque se desliza de un lado a otro. Toca la pantalla, o pulsa Espacio, para soltarlo sobre la mesa del escriba. Lo que sobresalga cae, y la pila se estrecha, pero nunca por debajo de un mínimo. Fallar del todo es un error. Apila 10 antes de que acabe el tiempo. Tres errores terminan el juego.",
    "perdeu": "La pila cayó",
    "v1": "¡La ley está en pie!",
    "v2": "En 1274, el rey Magnus VI, llamado Lagabøte, dio a Noruega la Landslov, un código para todo el reino que existió en cuatro libros, uno para cada jurisdicción; estuvo en uso más de cuatrocientos años. Los libros del juego son invención. El juego en sí, con sus objetos y reglas, es invención.",
    "h1": "Niveles",
    "dica": "Toca para soltar el bloque"
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
    var CFG = {"sky": 6969928, "fog": [30, 90], "hemi": [16050388, 2103312], "sun": 16769200, "sunPos": [-6, 22, 14], "cam": [0, 5, 9], "look": [0, 1.2, 0], "fov": 58, "fovP": 72, "target": 10, "maxe": 3, "total": 100, "bgA": "#3e3226", "bgB": "#0c0806"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-lagaboter');
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

    var PRM = {"ground": 5916208, "pal": [8010282, 3824250, 4876858, 9071146], "h": 0.45, "d": 1.0, "fx": [1, 0.9, 0.6]};
function mkDeco() { var m; m = new TH.Mesh(new TH.BoxGeometry(18, 0.3, 4), mat(0x4a3a28)); m.position.set(0, -0.4, -7); scene.add(m); m = new TH.Mesh(new TH.BoxGeometry(16, 5, 0.5), mat(0x5a4a3a)); m.position.set(0, 2.5, -12); scene.add(m); m = new TH.Mesh(new TH.BoxGeometry(0.5, 0.9, 0.3), mat(0xe8dcb8)); m.position.set(-5.4, 1.2, -10); m.rotation.z = 0.1; scene.add(m); m = new TH.Mesh(new TH.CylinderGeometry(0.05, 0.05, 0.9, 6), mat(0xe8e0d0)); m.position.set(-4.5, 0.8, -8); m.rotation.z = 0.5; scene.add(m); m = new TH.Mesh(new TH.BoxGeometry(0.8, 0.8, 0.8), mat(0x6a4a2a)); m.position.set(5.2, 0.4, -7); scene.add(m); m = new TH.Mesh(new TH.ConeGeometry(0.15, 0.5, 6), mat(0xffcc66, { emissive: 0x885500 })); m.position.set(5.2, 1.1, -7); scene.add(m); m = new TH.Mesh(new TH.SphereGeometry(0.9, 10, 8), mat(0xf0e8c0, { emissive: 0x887744 })); m.position.set(6, 7, -16); scene.add(m); }

G = (function () {
  var tower = [], fall = [], lvl = 1, bx = 0, bw = 3.6, cw = 3.6, cx = 0, cur = null, t = 0, camY = 0, cd = 0;

  function hw() { var f = fit(), d = 8 * f, fv = (api.w / api.h < 0.8 ? 72 : 58) * Math.PI / 360; return d * Math.tan(fv) * (api.w / api.h); }
  function wx(x) { return (x / api.w - 0.5) * 2 * hw(); }
  function pairMk() { var o = { on: false, kind: 0, x: 0, y: 9, z: 0, v: 3, g0: mkItem(0), g1: mkItem(1) }; o.g0.visible = false; o.g1.visible = false; scene.add(o.g0); scene.add(o.g1); return o; }
  function dica() { txt(T.dica, api.w / 2, api.h - 22, Math.max(12, Math.min(15, api.w / 40)), '#ffe9a8', 'center'); }

  var H = PRM.h, D = PRM.d;
  function block(w, x, y, lv) { var m = new TH.Mesh(new TH.BoxGeometry(1, 1, 1), mat(PRM.pal[lv % PRM.pal.length])); m.scale.set(w, H, D); m.position.set(x, y, 0); scene.add(m); return m; }
  function clear() { var i; for (i = 0; i < tower.length; i++) scene.remove(tower[i]); for (i = 0; i < fall.length; i++) scene.remove(fall[i].m); if (cur) scene.remove(cur); tower = []; fall = []; cur = null; }
  function spawnCur() { cur = block(cw, 0, (lvl + 0.5) * H, lvl); }
  function drop() {
    if (cd > 0 || !cur) return; cd = 0.15;
    var l = Math.max(cx - cw / 2, bx - bw / 2), r = Math.min(cx + cw / 2, bx + bw / 2), ov = r - l, nc, nw, yy = (lvl + 0.5) * H;
    if (ov <= 0.1) { fall.push({ m: cur, vy: 0, vx: cx > bx ? 2 : -2 }); cur = null; bad(); if (st !== 'play') return; cw = bw; spawnCur(); return; }
    if (Math.abs(cx - bx) < 0.14) { nc = bx; nw = cw; }
    else {
      nw = Math.max(ov, 1.2); nc = (l + r) / 2;
      if (cw - ov > 0.05) { var side = cx > bx ? 1 : -1, ow = cw - ov, px = side > 0 ? r + ow / 2 : l - ow / 2, pm = block(ow, px, yy, lvl); fall.push({ m: pm, vy: 0, vx: side * 1.5 }); }
    }
    cur.scale.x = nw; cur.position.x = nc; tower.push(cur); bx = nc; bw = nw; cw = nw; lvl++;
    burst(nc, yy, 1.2, 10, 2, PRM.fx[0], PRM.fx[1], PRM.fx[2], 2.5);
    cur = null; good(); if (st !== 'play') return; spawnCur();
  }
  return {
    init: function () {
      var m;
      m = new TH.Mesh(new TH.PlaneGeometry(60, 60), mat(PRM.ground)); m.rotation.x = -Math.PI / 2; m.position.set(0, -0.05, -6); scene.add(m);
      mkDeco();
    },
    start: function () {
      clear(); lvl = 1; bx = 0; bw = 3.6; cw = 3.6; t = 0; camY = 0; cd = 0;
      tower.push(block(3.6, 0, 0.5 * H, 0)); spawnCur();
    },
    logic: function (dt) {
      var spd = Math.min(3.4, 1.7 + score * 0.13), amp = Math.min(4.3, hw() * 0.8);
      t += dt; cx = Math.sin(t * spd) * amp; if (cur) cur.position.x = cx; if (cd > 0) cd -= dt;
    },
    down: function () { drop(); },
    move: function () {},
    key: function (c, d) { if (d && (c === 'Space' || c === 'Enter' || c === 'ArrowDown' || c === 'KeyS')) drop(); },
    cam: function (sk) { var f = fit(); setCam(sk, 3.4 + camY + 2 * (f - 1), 11 * f, 0, 1.4 + camY * 0.9, 0); },
    anim: function (dt) {
      var i, f;
      camY += (Math.max(0, lvl * H - 3) - camY) * Math.min(1, dt * 3);
      if (cur) { cur.position.y = (lvl + 0.5) * H; }
      for (i = fall.length - 1; i >= 0; i--) { f = fall[i]; f.vy += 20 * dt; f.m.position.y -= f.vy * dt; f.m.position.x += f.vx * dt; f.m.rotation.z += f.vx * dt * 0.6; if (f.m.position.y < -6) { scene.remove(f.m); fall.splice(i, 1); } }
      this.cam(camShake(dt));
    },
    hud: function () { dica(); },
    dbg: function () { return { cx: cx, bx: bx }; }
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
