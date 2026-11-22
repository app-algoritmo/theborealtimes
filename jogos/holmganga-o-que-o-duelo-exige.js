/* Hólmganga — o que o duelo exige (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-holmganga',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "h2": "Erros",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador.",
    "titulo": "O que o duelo exige",
    "sub": "Na hólmganga havia um campo de luta, estacas nos cantos e escudos. O pedido aparece no alto da tela. Toque no objeto pedido antes que o tempo do pedido acabe: o couro, a vara de aveleira ou o escudo. Você também pode usar as teclas 1, 2 e 3 para os lugares da esquerda para a direita. Depois de cada pedido, os objetos trocam de lugar. Objeto errado, ou pedido sem resposta, é erro. Atenda 10 pedidos antes do tempo acabar. Três erros encerram o jogo.",
    "perdeu": "O desafio foi perdido",
    "v1": "O duelo foi cumprido!",
    "v2": "Segundo a Wikipédia, a hólmganga se lutava sobre um couro de cerca de 3 metros de lado, com estacas de aveleira nos cantos e, em geral, três escudos para cada lutador. A ordem dos pedidos, o tempo e as trocas de lugar são invenção.",
    "h1": "Pedidos",
    "itens": [
      "o couro",
      "a vara de aveleira",
      "o escudo"
    ],
    "pede": "O duelo exige:"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "h2": "Mistakes",
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser.",
    "titulo": "What the duel demands",
    "sub": "In the hólmganga there was a fighting ground, stakes at the corners and shields. The request appears at the top of the screen. Tap the object asked for before the time for the request runs out: the hide, the hazel stave or the shield. You can also use keys 1, 2 and 3 for the places from left to right. After each request, the objects swap places. A wrong object, or a request left unanswered, is a mistake. Answer 10 requests before time runs out. Three mistakes end the game.",
    "perdeu": "The challenge was lost",
    "v1": "The duel was fulfilled!",
    "v2": "According to Wikipedia, the hólmganga was fought on a hide about 3 metres on a side, with hazel stakes at the corners and, in general, three shields for each fighter. The order of the requests, the timing and the swaps of place are invention.",
    "h1": "Requests",
    "itens": [
      "the hide",
      "the hazel stave",
      "the shield"
    ],
    "pede": "The duel demands:"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "h2": "Feil",
    "h3": "Tid",
    "carregando": "Laster 3D…",
    "sem3d": "Denne enheten kunne ikke vise 3D-grafikk. Prøv en annen nettleser.",
    "titulo": "Hva duellen krever",
    "sub": "I hólmgang var det en kampplass, staver i hjørnene og skjold. Ønsket vises øverst på skjermen. Trykk på tingen det ber om før tiden for ønsket er ute: huden, hasselstaven eller skjoldet. Du kan også bruke tastene 1, 2 og 3 for plassene fra venstre mot høyre. Etter hvert ønske bytter tingene plass. En feil ting, eller et ønske uten svar, er en feil. Svar på 10 ønsker før tiden er ute. Tre feil avslutter spillet.",
    "perdeu": "Utfordringen ble tapt",
    "v1": "Duellen ble oppfylt!",
    "v2": "Ifølge Wikipedia ble hólmgang utkjempet på en hud på omtrent 3 meter i sidelengde, med hasselstaver i hjørnene og vanligvis tre skjold til hver kriger. Rekkefølgen på ønskene, tiden og plassbyttene er oppfinnelse.",
    "h1": "Ønsker",
    "itens": [
      "huden",
      "hasselstaven",
      "skjoldet"
    ],
    "pede": "Duellen krever:"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "h2": "Errores",
    "h3": "Tiempo",
    "carregando": "Cargando el 3D…",
    "sem3d": "Este dispositivo no pudo mostrar gráficos 3D. Prueba con otro navegador.",
    "titulo": "Lo que exige el duelo",
    "sub": "En la hólmganga había un campo de lucha, estacas en las esquinas y escudos. El pedido aparece en lo alto de la pantalla. Toca el objeto pedido antes de que se acabe el tiempo del pedido: el cuero, la vara de avellano o el escudo. También puedes usar las teclas 1, 2 y 3 para los lugares de izquierda a derecha. Después de cada pedido, los objetos cambian de lugar. Un objeto equivocado, o un pedido sin respuesta, es un error. Atiende 10 pedidos antes de que acabe el tiempo. Tres errores terminan el juego.",
    "perdeu": "El desafío se perdió",
    "v1": "¡El duelo se cumplió!",
    "v2": "Según Wikipedia, la hólmganga se luchaba sobre un cuero de unos 3 metros de lado, con estacas de avellano en las esquinas y, en general, tres escudos para cada luchador. El orden de los pedidos, el tiempo y los cambios de lugar son invención.",
    "h1": "Pedidos",
    "itens": [
      "el cuero",
      "la vara de avellano",
      "el escudo"
    ],
    "pede": "El duelo exige:"
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
    var CFG = {"sky": 1842218, "fog": [30, 90], "hemi": [13160680, 1842212], "sun": 16771272, "sunPos": [-6, 22, 14], "cam": [0, 5, 9], "look": [0, 1.2, 0], "fov": 58, "fovP": 72, "target": 10, "maxe": 3, "total": 110, "bgA": "#0e2335", "bgB": "#050b12"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-holmganga');
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
      var items = [], slot = [0, 1, 2], ask = 0, lim = 4.4, tl = 4.4, cd = 0, P = [], gap = 0;
      function px(s) { return (s - 1) * 3.2; }
      function scr() { var o = []; for (var s = 0; s < 3; s++) o.push(toScr(px(s), 1.2, 0.8)); return o; }
      function objAt(s) { for (var o = 0; o < 3; o++) if (slot[o] === s) return o; return -1; }
      function nextReq() {
        var a = Math.floor(Math.random() * 3), i;
        ask = a;
        for (i = 2; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = slot[i]; slot[i] = slot[j]; slot[j] = t; }
        lim = Math.max(2.6, 4.4 - score * 0.16); tl = lim; gap = 0.5;
      }
      function tap(s) {
        if (cd > 0 || gap > 0) return; cd = 0.25;
        if (objAt(s) === ask) { burst(px(s), 1.8, 0.8, 16, 2.6, 1, 0.8, 0.3, 3); good(); if (st === 'play') nextReq(); }
        else { bad(); }
      }
      function mkItem(t) {
        var gr = new TH.Group(), m;
if (t === 0) { m = new TH.Mesh(new TH.BoxGeometry(2.0, 0.08, 2.0), mat(0x9a6a3a)); m.position.set(0, 0.2, 0); gr.add(m); m = new TH.Mesh(new TH.BoxGeometry(1.6, 0.1, 1.6), mat(0xb88a52)); m.position.set(0, 0.25, 0); gr.add(m); m = new TH.Mesh(new TH.BoxGeometry(1.2, 0.12, 1.2), mat(0x9a6a3a)); m.position.set(0, 0.3, 0); gr.add(m); } else if (t === 1) { m = new TH.Mesh(new TH.CylinderGeometry(0.07, 0.09, 2.4, 6), mat(0x8a7a3a)); m.position.set(0, 1.2, 0); gr.add(m); m = new TH.Mesh(new TH.SphereGeometry(0.11, 6, 5), mat(0xb8a85a)); m.position.set(0, 2.45, 0); gr.add(m); } else { m = new TH.Mesh(new TH.CylinderGeometry(0.9, 0.9, 0.12, 14), mat(0xa8352a)); m.position.set(0, 1.1, 0); m.rotation.x = Math.PI / 2; gr.add(m); m = new TH.Mesh(new TH.SphereGeometry(0.28, 8, 6), mat(0xc8ccd8)); m.position.set(0, 1.1, 0.1); gr.add(m); }
        return gr;
      }
      return {
        init: function () {
          var i, m;
          m = new TH.Mesh(new TH.PlaneGeometry(50, 36), mat(0x2a2a3a)); m.rotation.x = -Math.PI / 2; m.position.set(0, -0.05, -4); scene.add(m);
          m = new TH.Mesh(new TH.BoxGeometry(11.5, 0.4, 3.0), mat(0x5a4a3a)); m.position.set(0, 0.3, 0.8); scene.add(m);
          for (i = 0; i < 3; i++) { m = mkItem(i); m.position.set(px(i), 0.5, 0.8); scene.add(m); items.push(m); }
          m = new TH.Mesh(new TH.PlaneGeometry(40, 16), mat(0x2a1a22)); m.position.set(0, 7, -6); scene.add(m);
          m = new TH.Mesh(new TH.BoxGeometry(2.2, 1.0, 1.6), mat(0x6a2a2a)); m.position.set(0, 0.5, -3.6); scene.add(m);
          m = new TH.Mesh(new TH.ConeGeometry(0.8, 2.2, 7), mat(0x8a2a3a)); m.position.set(0, 2.1, -3.6); scene.add(m);
          m = new TH.Mesh(new TH.SphereGeometry(0.4, 8, 6), mat(0xf0d8b8)); m.position.set(0, 3.5, -3.6); scene.add(m);
          m = new TH.Mesh(new TH.CylinderGeometry(0.3, 0.4, 0.3, 6), mat(0xe8c050)); m.position.set(0, 4.0, -3.6); scene.add(m);
        },
        start: function () { slot = [0, 1, 2]; cd = 0; nextReq(); P = scr(); },
        logic: function (dt) {
          if (cd > 0) cd -= dt;
          if (gap > 0) { gap -= dt; return; }
          tl -= dt; if (tl <= 0) { bad(); if (st === 'play') nextReq(); }
        },
        down: function (x, y) { if (!P.length) P = scr(); var i = nearest(P, x, y, Math.max(40, 0.16 * Math.min(api.w, api.h))); if (i >= 0) tap(i); },
        key: function (c, d) { if (!d) return; var n = { Digit1: 0, Digit2: 1, Digit3: 2 }[c]; if (n !== undefined) tap(n); },
        cam: function (sk) { var f = fit(); setCam(sk, 5 + 2.5 * (f - 1), 9 * f, 0, 1.2, 0); },
        anim: function (dt) {
          for (var o = 0; o < 3; o++) { var m = items[o]; m.position.x += (px(slot[o]) - m.position.x) * Math.min(1, dt * 10); m.rotation.y = Math.sin(sceneT * 1.5 + o) * 0.15; }
          this.cam(camShake(dt)); P = scr();
        },
        hud: function () {
          var W = api.w, H = api.h;
          var ty = Math.max(98, H * 0.14);
          txt(T.pede + ' ' + T.itens[ask], W / 2, ty, Math.max(14, Math.min(20, W / 24)), '#ffe9a8', 'center');
          g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(W / 2 - 60, ty + 9, 120, 5);
          g.fillStyle = '#ffd870'; g.fillRect(W / 2 - 60, ty + 9, 120 * Math.max(0, tl / lim), 5);
          for (var s = 0; s < 3; s++) if (P[s]) txt(String(s + 1), P[s].x, P[s].y + Math.max(46, H * 0.1), 15, '#c9b3f2', 'center');
        },
        dbg: function () { return { need: gap > 0 ? -1 : slot[ask], pos: scr() }; }
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
