/* Torslunda — as folhas de bronze (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-torslunda',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "h2": "Erros",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador.",
    "titulo": "As folhas de bronze",
    "sub": "Os moldes de Torslunda eram pressionados contra folhas finas de metal, e saíam folhas idênticas para decorar capacetes. Toque em as folhas de bronze assim que aparecer, ou use as teclas 1 a 6. Não toque em as lascas quebradas: isso é erro. O que sumir sozinho não pune você. Pegue 12 antes do tempo acabar. Três erros encerram o jogo.",
    "perdeu": "Os moldes racharam",
    "v1": "Os capacetes estão decorados!",
    "v2": "Segundo as fontes, os quatro moldes de bronze de Torslunda eram feitos para produção em massa: pressionando folhas finas de metal contra eles, saíam folhas idênticas que decoravam capacetes. O jogo em si, com seus objetos e regras, é invenção.",
    "h1": "Colhidos",
    "dica": "Toque no que aparecer, menos no que não serve"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "h2": "Mistakes",
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser.",
    "titulo": "The bronze foils",
    "sub": "The Torslunda dies were pressed against thin metal sheets, producing identical foils to decorate helmets. Tap the bronze foils as soon as it appears, or use keys 1 to 6. Do not tap the broken chips: that is a mistake. Whatever disappears by itself costs you nothing. Get 12 before time runs out. Three mistakes end the game.",
    "perdeu": "The dies cracked",
    "v1": "The helmets are decorated!",
    "v2": "According to the sources, the four bronze dies of Torslunda were made for mass production: pressing thin metal foils against them produced identical foils that decorated helmets. The game itself, with its objects and rules, is invention.",
    "h1": "Picked",
    "dica": "Tap what appears, except the wrong ones"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "h2": "Feil",
    "h3": "Tid",
    "carregando": "Laster 3D…",
    "sem3d": "Denne enheten kunne ikke vise 3D-grafikk. Prøv en annen nettleser.",
    "titulo": "Bronsefoliene",
    "sub": "Torslunda-matrisene ble presset mot tynne metallplater, og ut kom like folier til å pryde hjelmer. Trykk på bronsefoliene så snart det dukker opp, eller bruk tastene 1 til 6. Ikke trykk på de ødelagte flisene: det er en feil. Det som forsvinner av seg selv, koster ingenting. Ta 12 før tiden er ute. Tre feil avslutter spillet.",
    "perdeu": "Matrisene sprakk",
    "v1": "Hjelmene er pyntet!",
    "v2": "Ifølge kildene var de fire bronsematrisene fra Torslunda laget for masseproduksjon: ved å presse tynne metallfolier mot dem fikk man like folier som pyntet hjelmer. Selve spillet, med gjenstander og regler, er oppfinnelse.",
    "h1": "Tatt",
    "dica": "Trykk på det som dukker opp, unntatt de gale"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "h2": "Errores",
    "h3": "Tiempo",
    "carregando": "Cargando el 3D…",
    "sem3d": "Este dispositivo no pudo mostrar gráficos 3D. Prueba con otro navegador.",
    "titulo": "Las láminas de bronce",
    "sub": "Las matrices de Torslunda se presionaban contra láminas finas de metal, y salían láminas idénticas para decorar cascos. Toca las láminas de bronce en cuanto aparezca, o usa las teclas 1 a 6. No toques las astillas rotas: eso es un error. Lo que desaparezca solo no te castiga. Consigue 12 antes de que acabe el tiempo. Tres errores terminan el juego.",
    "perdeu": "Las matrices se agrietaron",
    "v1": "¡Los cascos están decorados!",
    "v2": "Según las fuentes, las cuatro matrices de bronce de Torslunda estaban hechas para la producción en serie: al presionar láminas finas de metal contra ellas salían láminas idénticas que decoraban cascos. El juego en sí, con sus objetos y reglas, es invención.",
    "h1": "Cogidos",
    "dica": "Toca lo que aparezca, menos lo que no sirve"
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
    var CFG = {"sky": 2761752, "fog": [30, 90], "hemi": [15786160, 2366484], "sun": 16771248, "sunPos": [-6, 22, 14], "cam": [0, 5, 9], "look": [0, 1.2, 0], "fov": 58, "fovP": 72, "target": 12, "maxe": 3, "total": 100, "bgA": "#0e2335", "bgB": "#050b12"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-torslunda');
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

    var PRM = {"ground": 3813920, "mound": 9071146, "badP": 0.3, "fx": [1, 0.8, 0.3], "bx": [0.6, 0.5, 0.5], "sp0": 3, "mode": "pop"};
function mkItem(k) { var gr = new TH.Group(), m; if (k === 0) { m = new TH.Mesh(new TH.BoxGeometry(0.9, 1.1, 0.08), mat(0xd8a040, { emissive: 0x553300 })); m.position.set(0, 0.6, 0); gr.add(m); m = new TH.Mesh(new TH.SphereGeometry(0.24, 8, 6), mat(0xf0c860)); m.position.set(0, 0.6, 0.06); gr.add(m); } else { m = new TH.Mesh(new TH.ConeGeometry(0.4, 0.9, 5), mat(0x6a6a6a)); m.position.set(0, 0.5, 0); m.rotation.z = 0.5; gr.add(m); m = new TH.Mesh(new TH.ConeGeometry(0.25, 0.6, 4), mat(0x8a8a8a)); m.position.set(0.3, 0.4, 0); m.rotation.z = -0.8; gr.add(m); } return gr; } function mkDeco() { var m; m = new TH.Mesh(new TH.SphereGeometry(2.4, 14, 10, 0, 6.283, 0, 1.57), mat(0x9a9aa4)); m.position.set(0, 1.2, -7); scene.add(m); m = new TH.Mesh(new TH.CylinderGeometry(2.6, 2.6, 0.3, 14), mat(0x7a7a84)); m.position.set(0, 1.2, -7); scene.add(m); }

G = (function () {
  var S = [], spawnT = 0, arrows = [], bow = null, fly = PRM.mode === 'fly', ROWS = [1.3, 2.7, 4.1];

  function hw() { var f = fit(), d = 8 * f, fv = (api.w / api.h < 0.8 ? 72 : 58) * Math.PI / 360; return d * Math.tan(fv) * (api.w / api.h); }
  function wx(x) { return (x / api.w - 0.5) * 2 * hw(); }
  function pairMk() { var o = { on: false, kind: 0, x: 0, y: 9, z: 0, v: 3, g0: mkItem(0), g1: mkItem(1) }; o.g0.visible = false; o.g1.visible = false; scene.add(o.g0); scene.add(o.g1); return o; }
  function dica() { txt(T.dica, api.w / 2, api.h - 22, Math.max(12, Math.min(15, api.w / 40)), '#ffe9a8', 'center'); }

  var XS = [-3.8, 0, 3.8], ZS = [-0.9, 1.9];
  function pos(s) { return fly ? { x: s.x, y: s.y + 0.4, z: 0 } : { x: s.x, y: 0.9, z: s.z }; }
  function resolve(s) {
    var p = pos(s); s.on = false; s.lock = false;
    if (s.kind === 0) { burst(p.x, p.y + 0.4, p.z, 14, 2.4, PRM.fx[0], PRM.fx[1], PRM.fx[2], 3); good(); }
    else { burst(p.x, p.y + 0.4, p.z, 10, 2, PRM.bx[0], PRM.bx[1], PRM.bx[2], 2); bad(); }
  }
  function tapAt(x, y) {
    var i, s, p, q, best = -1, bd = Math.pow(Math.max(46, 0.14 * Math.min(api.w, api.h)), 2), d;
    for (i = 0; i < S.length; i++) {
      s = S[i]; if (!s.on || s.lock || (!fly && s.up < 0.35)) continue;
      p = pos(s); q = toScr(p.x, p.y, p.z); d = (q.x - x) * (q.x - x) + (q.y - y) * (q.y - y);
      if (d < bd) { bd = d; best = i; }
    }
    if (best < 0) return;
    s = S[best];
    if (!fly) { resolve(s); return; }
    s.lock = true; var a = null, k; for (k = 0; k < arrows.length; k++) if (!arrows[k].on) { a = arrows[k]; break; }
    if (!a) { resolve(s); return; }
    a.on = true; a.t = 0; a.s = s; api.nota(520, 0.12, 'triangle', 0.05);
  }
  return {
    init: function () {
      var m, i, s, n = fly ? 8 : 6;
      m = new TH.Mesh(new TH.PlaneGeometry(60, 40), mat(PRM.ground)); m.rotation.x = -Math.PI / 2; m.position.set(0, -0.05, -6); scene.add(m);
      mkDeco();
      for (i = 0; i < n; i++) {
        s = { on: false, lock: false, kind: 0, x: XS[i % 3], z: ZS[Math.floor(i / 3)], y: 1.3, up: 0, t: 0, vx: 0, g0: mkItem(0), g1: mkItem(1) };
        s.g0.visible = false; s.g1.visible = false; scene.add(s.g0); scene.add(s.g1);
        if (!fly) { m = new TH.Mesh(new TH.CylinderGeometry(1.25, 1.55, 0.35, 14), mat(PRM.mound)); m.position.set(s.x, 0.1, s.z); scene.add(m); }
        S.push(s);
      }
      if (fly) {
        bow = mkBow(); bow.position.set(0, 0.2, 4.4); scene.add(bow);
        for (i = 0; i < 4; i++) { m = new TH.Mesh(new TH.CylinderGeometry(0.04, 0.04, 1.2, 5), mat(0xe8e0c8)); m.rotation.x = Math.PI / 2; m.visible = false; scene.add(m); arrows.push({ on: false, t: 0, s: null, m: m }); }
      }
    },
    start: function () { var i; spawnT = 0.5; for (i = 0; i < S.length; i++) { S[i].on = false; S[i].lock = false; } for (i = 0; i < arrows.length; i++) arrows[i].on = false; },
    logic: function (dt) {
      var i, s, free = [], h = hw();
      spawnT -= dt;
      for (i = 0; i < S.length; i++) if (!S[i].on) free.push(S[i]);
      if (spawnT <= 0 && free.length) {
        s = free[Math.floor(Math.random() * free.length)]; s.on = true; s.lock = false; s.kind = Math.random() < PRM.badP ? 1 : 0;
        if (fly) { var dir = Math.random() < 0.5 ? -1 : 1; s.y = ROWS[Math.floor(Math.random() * 3)]; s.x = -dir * (h + 1.5); s.vx = dir * Math.min(6.5, PRM.sp0 + score * 0.18); }
        else { s.up = 0; s.t = Math.max(0.95, 1.9 - score * 0.07); }
        spawnT = Math.max(0.42, 0.9 - score * 0.03);
      }
      for (i = 0; i < S.length; i++) {
        s = S[i]; if (!s.on) continue;
        if (fly) { if (!s.lock) s.x += s.vx * dt; if (Math.abs(s.x) > h + 2.2) { s.on = false; s.lock = false; } }
        else { s.t -= dt; s.up = s.t > 0.25 ? Math.min(1, s.up + dt * 6) : Math.max(0, s.up - dt * 5); if (s.t <= 0) s.on = false; }
      }
      for (i = 0; i < arrows.length; i++) {
        var a = arrows[i]; if (!a.on) continue; a.t += dt / 0.2;
        if (a.t >= 1) { a.on = false; a.m.visible = false; if (a.s.on) resolve(a.s); if (st !== 'play') return; }
      }
    },
    down: function (x, y) { tapAt(x, y); },
    move: function () {},
    key: function (c, d) { if (!d || fly) return; var n = { Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3, Digit5: 4, Digit6: 5 }[c]; if (n !== undefined && S[n] && S[n].on && S[n].up > 0.35) resolve(S[n]); },
    cam: function (sk) { var f = fit(); if (fly) setCam(sk, 3 + 2.5 * (f - 1), 10 * f, 0, 2.2, 0); else setCam(sk, 5.5 + 2.5 * (f - 1), 8.5 * f, 0, 0.8, 0.4); },
    anim: function (dt) {
      var i, s, gm, p, a;
      for (i = 0; i < S.length; i++) {
        s = S[i]; s.g0.visible = s.on && s.kind === 0 && (fly || s.up > 0.02); s.g1.visible = s.on && s.kind === 1 && (fly || s.up > 0.02);
        gm = s.kind === 0 ? s.g0 : s.g1;
        if (fly) gm.position.set(s.x, s.y, 0); else { gm.position.set(s.x, -1.0 + 1.25 * s.up, s.z); gm.scale.set(1, Math.max(0.05, s.up), 1); }
      }
      for (i = 0; i < arrows.length; i++) {
        a = arrows[i]; if (!a.on) continue; a.m.visible = true; p = a.s;
        a.m.position.set(p.x * a.t, 0.9 + (p.y + 0.4 - 0.9) * a.t, 4.2 + (0 - 4.2) * a.t);
        a.m.lookAt(p.x, p.y + 0.4, 0);
      }
      if (bow) { var tgt = 0; for (i = 0; i < arrows.length; i++) if (arrows[i].on) tgt = Math.atan2(arrows[i].s.x, 4.2); bow.rotation.y += (-tgt * 0.6 - bow.rotation.y) * Math.min(1, dt * 12); }
      this.cam(camShake(dt));
    },
    hud: function () { dica(); },
    dbg: function () { var o = [], i; for (i = 0; i < S.length; i++) o.push(S[i].on && S[i].up > 0.5 ? S[i].kind : -1); return { slots: o }; }
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
