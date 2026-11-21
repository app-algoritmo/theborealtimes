/* Shortshanks — os três presentes das bruxas (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-shortshanks',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "h2": "Erros",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador.",
    "titulo": "Os três presentes das bruxas",
    "sub": "Três bruxas de um olho só dão presentes a Shortshanks: uma espada, um navio e a arte de fazer cerveja. Veja a ordem em que os três presentes se levantam e brilham. Depois eles trocam de lugar. Quando a seta aparecer, toque nos presentes na mesma ordem em que brilharam, ou use as teclas 1, 2 e 3 para os lugares da esquerda para a direita. Presente errado é erro, e a ordem é mostrada de novo. Acerte 8 ordens antes do tempo acabar. Três erros encerram o jogo.",
    "perdeu": "As bruxas pediram o olho de volta",
    "v1": "Os três presentes são seus!",
    "v2": "No conto de Asbjørnsen e Moe, na tradução de Dasent, as bruxas dão a Shortshanks uma espada que põe um exército em fuga, um navio que encolhe até o bolso e cresce quando ele embarca, e a arte de fazer cem lasts de malte num só golpe. A ordem que você repete e as trocas de lugar são invenção.",
    "h1": "Ordens"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "h2": "Mistakes",
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser.",
    "titulo": "The hags' three gifts",
    "sub": "Three one-eyed hags give Shortshanks gifts: a sword, a ship and the art of brewing. Watch the order in which the three gifts rise and glow. Then they swap places. When the arrow appears, tap the gifts in the same order in which they glowed, or use keys 1, 2 and 3 for the places from left to right. A wrong gift is a mistake, and the order is shown again. Get 8 orders right before time runs out. Three mistakes end the game.",
    "perdeu": "The hags asked for their eye back",
    "v1": "The three gifts are yours!",
    "v2": "In the tale by Asbjørnsen and Moe, in Dasent's translation, the hags give Shortshanks a sword that puts an army to flight, a ship that shrinks to pocket size and grows when he steps in, and the art of brewing a hundred lasts of malt at one strike. The order you repeat and the swaps of place are invention.",
    "h1": "Orders"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "h2": "Feil",
    "h3": "Tid",
    "carregando": "Laster 3D…",
    "sem3d": "Denne enheten kunne ikke vise 3D-grafikk. Prøv en annen nettleser.",
    "titulo": "Heksenes tre gaver",
    "sub": "Tre enøyde hekser gir Shortshanks gaver: et sverd, et skip og kunsten å brygge. Se rekkefølgen de tre gavene reiser seg og lyser i. Så bytter de plass. Når pilen dukker opp, trykk på gavene i samme rekkefølge som de lyste, eller bruk tastene 1, 2 og 3 for plassene fra venstre mot høyre. En feil gave er en feil, og rekkefølgen vises på nytt. Svar riktig på 8 rekkefølger før tiden er ute. Tre feil avslutter spillet.",
    "perdeu": "Heksene ba om øyet tilbake",
    "v1": "De tre gavene er dine!",
    "v2": "I eventyret av Asbjørnsen og Moe, i Dasents oversettelse, gir heksene Shortshanks et sverd som jager en hær på flukt, et skip som krymper til lommestørrelse og vokser når han stiger om bord, og kunsten å brygge hundre lasts malt med ett slag. Rekkefølgen du gjentar, og plassbyttene er oppfinnelse.",
    "h1": "Rekkefølger"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "h2": "Errores",
    "h3": "Tiempo",
    "carregando": "Cargando el 3D…",
    "sem3d": "Este dispositivo no pudo mostrar gráficos 3D. Prueba con otro navegador.",
    "titulo": "Los tres regalos de las brujas",
    "sub": "Tres brujas tuertas dan regalos a Shortshanks: una espada, un barco y el arte de elaborar cerveza. Mira el orden en que los tres regalos se alzan y brillan. Después cambian de lugar. Cuando aparezca la flecha, toca los regalos en el mismo orden en que brillaron, o usa las teclas 1, 2 y 3 para los lugares de izquierda a derecha. Un regalo equivocado es un error, y el orden se muestra de nuevo. Acierta 8 órdenes antes de que acabe el tiempo. Tres errores terminan el juego.",
    "perdeu": "Las brujas pidieron su ojo de vuelta",
    "v1": "¡Los tres regalos son tuyos!",
    "v2": "En el cuento de Asbjørnsen y Moe, en la traducción de Dasent, las brujas dan a Shortshanks una espada que pone en fuga a un ejército, un barco que se encoge hasta caber en el bolsillo y crece cuando sube a bordo, y el arte de elaborar cien lasts de malta de un solo golpe. El orden que repites y los cambios de lugar son invención.",
    "h1": "Órdenes"
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
    var CFG = {"sky": 4872816, "fog": [30, 90], "hemi": [15266040, 3818584], "sun": 16777215, "sunPos": [-6, 22, 14], "cam": [0, 5, 9], "look": [0, 1.0, 0.4], "fov": 58, "fovP": 72, "target": 8, "maxe": 3, "total": 120, "bgA": "#5a6a80", "bgB": "#1c2430"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-shortshanks');
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
      var objs = [], slot = [0, 1, 2], seq = [0, 1, 2], k = 0, ph = 'show', pT = 0, sIdx = 0, lit = -1, swN = 0, swT = 0, P = [];
      function px(s) { return (s - 1) * 3.3; }
      function scr() { var o = []; for (var s = 0; s < 3; s++) o.push(toScr(px(s), 1.2, 0.5)); return o; }
      function begin() { ph = 'show'; sIdx = 0; pT = 0.9; lit = -1; k = 0; }
      function newRound() {
        seq = [0, 1, 2]; for (var i = 2; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = seq[i]; seq[i] = seq[j]; seq[j] = t; }
        begin();
      }
      function objAt(s) { for (var o = 0; o < 3; o++) if (slot[o] === s) return o; return -1; }
      function tap(s) {
        if (ph !== 'in') return;
        var o = objAt(s);
        if (o === seq[k]) { burst(px(s), 1.5, 0.5, 14, 2.6, 1, 0.8, 0.3, 3); api.nota(440 + k * 160, 0.2, 'triangle', 0.08); k++; if (k >= 3) { good(); if (st === 'play') newRound(); } }
        else { bad(); begin(); }
      }
      function mkObj(t) {
        var gr = new TH.Group(), m;
        if (t === 0) { m = new TH.Mesh(new TH.BoxGeometry(0.2, 1.9, 0.06), mat(0xd8dce8, { emissive: 0x000000 })); m.position.y = 1.2; gr.add(m); m = new TH.Mesh(new TH.BoxGeometry(0.8, 0.14, 0.14), mat(0xe8c050)); m.position.y = 0.3; gr.add(m); m = new TH.Mesh(new TH.CylinderGeometry(0.07, 0.07, 0.4, 6), mat(0x6a4a2a)); m.position.y = 0.05; gr.add(m); }
        else if (t === 1) { m = new TH.Mesh(new TH.BoxGeometry(1.6, 0.4, 0.7), mat(0x7a5230, { emissive: 0x000000 })); m.position.y = 0.45; gr.add(m); m = new TH.Mesh(new TH.ConeGeometry(0.38, 0.6, 4), mat(0x5a6a7c)); m.rotation.z = -Math.PI / 2; m.position.set(1.05, 0.5, 0); gr.add(m); m = new TH.Mesh(new TH.CylinderGeometry(0.04, 0.04, 1.6, 5), mat(0x4a3220)); m.position.y = 1.3; gr.add(m); m = new TH.Mesh(new TH.BoxGeometry(0.06, 1.1, 0.9), mat(0xf0e8d0)); m.position.set(0, 1.45, 0); gr.add(m); }
        else { m = new TH.Mesh(new TH.CylinderGeometry(0.6, 0.6, 1.3, 12), mat(0x9a6a30, { emissive: 0x000000 })); m.position.y = 0.75; gr.add(m); for (var q = 0; q < 3; q++) { m = new TH.Mesh(new TH.TorusGeometry(0.61, 0.04, 5, 14), mat(0x4a4a52)); m.rotation.x = Math.PI / 2; m.position.y = 0.3 + q * 0.45; gr.add(m); } m = new TH.Mesh(new TH.CylinderGeometry(0.5, 0.5, 0.06, 12), mat(0xe8d070)); m.position.y = 1.42; gr.add(m); }
        return gr;
      }
      return {
        init: function () {
          var i, m;
          m = new TH.Mesh(new TH.PlaneGeometry(50, 36), mat(0x3a4a5a)); m.rotation.x = -Math.PI / 2; m.position.set(0, -0.05, -4); scene.add(m);
          m = new TH.Mesh(new TH.BoxGeometry(11.5, 0.5, 3.0), mat(0x5a6a7c)); m.position.set(0, 0.3, 0.5); scene.add(m);
          for (i = 0; i < 3; i++) { m = mkObj(i); m.position.set(px(i), 0.55, 0.5); scene.add(m); objs.push(m); }
          m = new TH.Mesh(new TH.PlaneGeometry(40, 16), mat(0x2a3444)); m.position.set(0, 7, -6); scene.add(m);
          m = new TH.Mesh(new TH.ConeGeometry(0.8, 2.4, 7), mat(0xa8b8c8)); m.position.set(0, 1.6, -3.4); scene.add(m);
          m = new TH.Mesh(new TH.SphereGeometry(0.42, 8, 6), mat(0xe0e8f0)); m.position.set(0, 3.1, -3.4); scene.add(m);
        },
        start: function () { slot = [0, 1, 2]; newRound(); P = scr(); },
        logic: function (dt) {
          if (ph === 'show') {
            pT -= dt;
            if (pT <= 0) {
              if (lit >= 0) { lit = -1; pT = 0.3; }
              else if (sIdx < 3) { lit = seq[sIdx]; sIdx++; pT = 0.8; api.nota(300 + lit * 140, 0.4, 'sine', 0.07); }
              else { ph = 'shuf'; swN = 3 + Math.floor(score / 3); swT = 0.4; }
            }
          } else if (ph === 'shuf') {
            swT -= dt;
            if (swT <= 0) {
              if (swN > 0) {
                var a = Math.floor(Math.random() * 3), b = (a + 1 + Math.floor(Math.random() * 2)) % 3, oa = objAt(a), ob = objAt(b);
                slot[oa] = b; slot[ob] = a; swN--; swT = Math.max(0.34, 0.6 - score * 0.03);
              } else { ph = 'in'; k = 0; }
            }
          }
        },
        down: function (x, y) { if (!P.length) P = scr(); var i = nearest(P, x, y, Math.max(40, 0.16 * Math.min(api.w, api.h))); if (i >= 0) tap(i); },
        key: function (c, d) { if (!d) return; var n = { Digit1: 0, Digit2: 1, Digit3: 2 }[c]; if (n !== undefined) tap(n); },
        cam: function (sk) { var f = fit(); setCam(sk, 5 + 2.5 * (f - 1), 9 * f, 0, 1.0, 0.4); },
        anim: function (dt) {
          for (var o = 0; o < 3; o++) {
            var m = objs[o], tx = px(slot[o]), on = lit === o;
            m.position.x += (tx - m.position.x) * Math.min(1, dt * 9);
            m.position.y += ((on ? 1.4 : 0.55) - m.position.y) * Math.min(1, dt * 10);
            m.rotation.y += dt * (on ? 4 : 0.6);
          }
          this.cam(camShake(dt)); P = scr();
        },
        hud: function () {
          var W = api.w, H = api.h;
          txt(ph === 'in' ? '▶ ' + (k + 1) + '/3' : '...', W / 2, H * 0.2, 26, ph === 'in' ? '#ffe9a8' : '#c9b3f2', 'center');
          for (var s = 0; s < 3; s++) if (P[s]) txt(String(s + 1), P[s].x, P[s].y + Math.max(46, H * 0.1), 15, '#c9b3f2', 'center');
        },
        dbg: function () { return { need: ph === 'in' ? slot[seq[k]] : -1, ph: ph, pos: scr() }; }
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
