/* Vili e Vé — os dons dos irmãos (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-vili',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "h2": "Erros",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador.",
    "titulo": "Os dons dos irmãos",
    "sub": "Odin, Vili e Vé deram dons ao primeiro casal, Ask e Embla. Cada frase cai do alto. Guie-a até a caixa certa: toque na caixa, ou use as setas e as teclas 1, 2 e 3 (Espaço faz cair mais rápido). Caixa errada, ou frase que chega sem rumo, é erro. Acerte 10 antes do tempo acabar. 3 erros encerram o jogo.",
    "perdeu": "Os dons se misturaram",
    "v1": "Cada dom com o seu irmão!",
    "v2": "Na Gylfaginning, Odin dá o fôlego e a vida, Vili dá o entendimento e o movimento ou a sensação, e Vé dá o rosto, a fala, a audição e a visão. A fila de dons, as três caixas e o ritmo do jogo são invenção.",
    "h1": "Dons",
    "bins": [
      "Odin",
      "Vili",
      "Vé"
    ],
    "frases": [
      "Dá o fôlego.",
      "Dá a vida.",
      "Dá o entendimento.",
      "Dá o movimento ou a sensação.",
      "Dá o rosto.",
      "Dá a fala.",
      "Dá a audição.",
      "Dá a visão."
    ],
    "dica": "Toque numa caixa ou use ← → e 1-2-3"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "h2": "Mistakes",
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser.",
    "titulo": "The brothers' gifts",
    "sub": "Odin, Vili and Vé gave gifts to the first couple, Ask and Embla. Each phrase falls from above. Guide it to the right box: tap the box, or use the arrow keys and keys 1, 2 and 3 (Space drops it faster). The wrong box is a mistake. Get 10 right before time runs out. 3 mistakes end the game.",
    "perdeu": "The gifts got mixed up",
    "v1": "Every gift with its brother!",
    "v2": "In the Gylfaginning, Odin gives breath and life, Vili gives understanding and motion or feeling, and Vé gives the face, speech, hearing and sight. The row of gifts, the three boxes and the rhythm of the game are invention.",
    "h1": "Gifts",
    "bins": [
      "Odin",
      "Vili",
      "Vé"
    ],
    "frases": [
      "Gives breath.",
      "Gives life.",
      "Gives understanding.",
      "Gives motion or feeling.",
      "Gives the face.",
      "Gives speech.",
      "Gives hearing.",
      "Gives sight."
    ],
    "dica": "Tap a box or use ← → and 1-2-3"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "h2": "Feil",
    "h3": "Tid",
    "carregando": "Laster 3D…",
    "sem3d": "Denne enheten kunne ikke vise 3D-grafikk. Prøv en annen nettleser.",
    "titulo": "Brødrenes gaver",
    "sub": "Odin, Vili og Vé ga gaver til det første paret, Ask og Embla. Hver frase faller ovenfra. Led den til riktig boks: trykk på boksen, eller bruk piltastene og tastene 1, 2 og 3 (mellomrom får den til å falle raskere). Feil boks er en feil. Få 10 riktige før tiden er ute. 3 feil avslutter spillet.",
    "perdeu": "Gavene ble blandet",
    "v1": "Hver gave hos sin bror!",
    "v2": "I Gylfaginning gir Odin ånde og liv, Vili gir forstand og bevegelse eller følelse, og Vé gir ansiktet, talen, hørselen og synet. Rekka med gaver, de tre boksene og rytmen i spillet er oppdiktet.",
    "h1": "Gaver",
    "bins": [
      "Odin",
      "Vili",
      "Vé"
    ],
    "frases": [
      "Gir ånde.",
      "Gir liv.",
      "Gir forstand.",
      "Gir bevegelse eller følelse.",
      "Gir ansiktet.",
      "Gir talen.",
      "Gir hørselen.",
      "Gir synet."
    ],
    "dica": "Trykk på en boks eller bruk ← → og 1-2-3"
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
    var CFG = {"sky": 1845820, "fog": [30, 90], "hemi": [14214388, 1844272], "sun": 16773336, "sunPos": [-6, 22, 14], "cam": [0, 5, 9], "look": [0, 1.2, 0], "fov": 58, "fovP": 72, "target": 10, "maxe": 3, "total": 120, "bgA": "#0e2335", "bgB": "#050b12"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-vili');
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

    var PRM = {"ground": 2765632, "cols": [5917322, 3832410, 9067066], "cat": [0, 0, 1, 1, 2, 2, 2, 2]};


G = (function () {
  var cards = [], bag = [], sel = 1, mk = [], arrow = null, spawnT = 0, glow = 0;

  function hw() { var f = fit(), d = 8 * f, fv = (api.w / api.h < 0.8 ? 72 : 58) * Math.PI / 360; return d * Math.tan(fv) * (api.w / api.h); }
  function wx(x) { return (x / api.w - 0.5) * 2 * hw(); }
  function pairMk() { var o = { on: false, kind: 0, x: 0, y: 9, z: 0, v: 3, g0: mkItem(0), g1: mkItem(1) }; o.g0.visible = false; o.g1.visible = false; scene.add(o.g0); scene.add(o.g1); return o; }
  function dica() { txt(T.dica, api.w / 2, api.h - 22, Math.max(12, Math.min(15, api.w / 40)), '#ffe9a8', 'center'); }

  function px(c) { var s = Math.min(3.6, hw() * 0.62); return (c - 1) * s; }
  function refill() { var i, j, t; bag = []; for (i = 0; i < T.frases.length; i++) bag.push(i); for (i = bag.length - 1; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); t = bag[i]; bag[i] = bag[j]; bag[j] = t; } }
  function spawn() { if (!bag.length) refill(); cards.push({ i: bag.pop(), col: 1, sx: 0, y: 8.5, fast: false }); }
  function low() { var b = null, i; for (i = 0; i < cards.length; i++) if (!b || cards[i].y < b.y) b = cards[i]; return b; }
  function setCol(c) { var k = low(); if (!k) return; if (k.col === c) k.fast = true; else k.col = c; }
  function land(k) {
    var ok = PRM.cat[k.i] === k.col, x = px(k.col);
    if (ok) { burst(x, 1.4, 0.8, 14, 2.4, 1, 0.9, 0.4, 3); good(); } else { burst(x, 1.4, 0.8, 10, 2, 1, 0.3, 0.3, 2); bad(); }
  }
  return {
    init: function () {
      var m, i;
      m = new TH.Mesh(new TH.PlaneGeometry(60, 40), mat(PRM.ground)); m.rotation.x = -Math.PI / 2; m.position.set(0, -0.05, -6); scene.add(m);
      for (i = 0; i < 3; i++) { m = new TH.Mesh(new TH.BoxGeometry(3.0, 0.9, 1.6), mat(PRM.cols[i])); m.position.set(0, 0.45, 0); scene.add(m); mk.push(m); m = new TH.Mesh(new TH.BoxGeometry(3.1, 0.12, 1.7), mat(0xa8842c)); m.position.set(0, 0.95, 0); scene.add(m); mk.push(m); }
      arrow = new TH.Mesh(new TH.ConeGeometry(0.35, 0.8, 4), mat(0xffe08a, { emissive: 0x665522 })); arrow.rotation.x = Math.PI; arrow.position.set(0, 2.2, 0); scene.add(arrow);
    },
    start: function () { cards = []; refill(); sel = 1; spawnT = 0; spawn(); },
    logic: function (dt) {
      var i, k, v = Math.min(3.1, 1.5 + score * 0.07), lw = low();
      if (!cards.length) { spawn(); }
      else if (score >= 3 && cards.length < 2 && lw && lw.y < 4.2) spawn();
      for (i = cards.length - 1; i >= 0; i--) {
        k = cards[i]; k.y -= (k.fast ? v * 4 : v) * dt;
        if (k.y <= 1.3) { cards.splice(i, 1); land(k); if (st !== 'play') return; }
      }
    },
    down: function (x) { setCol(x < api.w / 3 ? 0 : (x > api.w * 2 / 3 ? 2 : 1)); },
    move: function () {},
    key: function (c, d) {
      if (!d) return; var k = low(), n = { Digit1: 0, Digit2: 1, Digit3: 2 }[c];
      if (n !== undefined) setCol(n);
      else if (k && (c === 'ArrowLeft' || c === 'KeyA')) k.col = Math.max(0, k.col - 1);
      else if (k && (c === 'ArrowRight' || c === 'KeyD')) k.col = Math.min(2, k.col + 1);
      else if (k && (c === 'ArrowDown' || c === 'Space' || c === 'KeyS')) k.fast = true;
    },
    cam: function (sk) { var f = fit(); setCam(sk, 4.6 + 2 * (f - 1), 9 * f, 0, 2.6, 0); },
    anim: function (dt) {
      var i, k = low();
      for (i = 0; i < 3; i++) { mk[i * 2].position.x = px(i); mk[i * 2 + 1].position.x = px(i); }
      for (i = 0; i < cards.length; i++) cards[i].sx += (px(cards[i].col) - cards[i].sx) * Math.min(1, dt * 12);
      if (k) { arrow.visible = true; arrow.position.set(k.sx, 2.4 + Math.sin(sceneT * 6) * 0.15, 0); } else arrow.visible = false;
      this.cam(camShake(dt));
    },
    hud: function () {
      var W = api.w, H = api.h, fs = Math.max(12, Math.min(17, W / 34)), cw = Math.min(W * 0.5, 320), i, q, k, p, ls, h, bl, sp;
      for (i = 0; i < 3; i++) {
        p = toScr(px(i), 0.9, 0.9); sp = Math.max(70, Math.abs(toScr(px(1), 0.9, 0.9).x - toScr(px(0), 0.9, 0.9).x)) * 0.92; bl = api.quebra(T.bins[i], sp, 13);
        for (q = 0; q < bl.length; q++) txt(bl[q], p.x, p.y + 24 + q * 15, 13, '#f3ecd2', 'center');
      }
      for (i = 0; i < cards.length; i++) {
        k = cards[i]; p = toScr(k.sx, k.y, 0.8); ls = api.quebra(T.frases[k.i], cw - 16, fs); h = ls.length * (fs + 4) + 14;
        g.fillStyle = 'rgba(250,244,225,.96)'; g.fillRect(p.x - cw / 2, p.y - h / 2, cw, h);
        g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(p.x - cw / 2, p.y + h / 2, cw, 3);
        for (q = 0; q < ls.length; q++) txt(ls[q], p.x, p.y - h / 2 + 8 + fs + q * (fs + 4) - 4, fs, '#2a2236', 'center');
      }
      txt(T.dica, W / 2, H - 22, Math.max(12, Math.min(15, W / 40)), '#ffe9a8', 'center');
    },
    dbg: function () { var k = low(); return { need: k ? PRM.cat[k.i] : -1, col: k ? k.col : -1, y: k ? k.y : 0 }; }
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
