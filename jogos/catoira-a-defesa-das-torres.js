/* Catoira — a defesa das torres (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-catoira',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A defesa das torres",
    "sub": "Barcos inimigos sobem a ria de Arousa. Um medidor de força vai e volta na parte de baixo da tela, e a marca verde mostra o ponto certo para o barco. Toque na tela, ou use Espaço, quando o medidor estiver sobre a marca, para lançar a pedra da torre. Pedra curta ou longa demais é erro, e barco que chega à margem também. Afaste 8 barcos antes do tempo acabar. Três erros encerram o jogo.",
    "perdeu": "A defesa falhou",
    "v1": "A ria está salva!",
    "v2": "Em Catoira, na Galícia, as Torres de Oeste guardavam a entrada da ria de Arousa contra ataques vindos do mar, e todo ano, em agosto, a Romaria Viking recria o ataque e a defesa. O lançamento de pedras é invenção.",
    "h1": "Barcos",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador.",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The defence of the towers",
    "sub": "Enemy ships sail up the Arousa estuary. A power gauge swings back and forth at the bottom of the screen, and the green mark shows the right spot for the ship. Tap the screen, or press Space, when the gauge is over the mark, to launch a stone from the tower. A stone too short or too long is a mistake, and so is a ship reaching the shore. Drive off 8 ships before time runs out. Three mistakes end the game.",
    "perdeu": "The defence failed",
    "v1": "The estuary is safe!",
    "v2": "At Catoira in Galicia, the Western Towers guarded the entrance to the Arousa estuary against attacks from the sea, and every August the Viking Pilgrimage reenacts the attack and the defence. The stone throwing is invented.",
    "h1": "Ships",
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser.",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Forsvaret av tårnene",
    "sub": "Fiendtlige skip seiler opp Arousa-elvemunningen. En kraftmåler svinger fram og tilbake nederst på skjermen, og det grønne merket viser det rette punktet for skipet. Trykk på skjermen, eller trykk mellomrom, når måleren står over merket, for å skyte en stein fra tårnet. En stein som blir for kort eller for lang er en feil, og det er også et skip som når land. Driv bort 8 skip før tiden er ute. Tre feil avslutter spillet.",
    "perdeu": "Forsvaret sviktet",
    "v1": "Munningen er trygg!",
    "v2": "I Catoira i Galicia voktet Torres de Oeste innløpet til Arousa mot angrep fra sjøen, og hver august gjenskaper Vikingpilegrimsferden angrepet og forsvaret. Steinkastingen er oppfunnet.",
    "h1": "Skip",
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
    var CFG = {"sky": 3824250, "fog": [40, 120], "hemi": [13623536, 2371626], "sun": 16773336, "sunPos": [20, 40, 10], "cam": [0, 7, 12], "look": [0, 1, -12], "fov": 58, "fovP": 72, "target": 8, "maxe": 3, "total": 100, "bgA": "#0e2335", "bgB": "#050b12"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-catoira');
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
      var p = 0, pd = 1, s = 0.9, has = false, resp = 0.6, cd = 0, TOL = 0.075, ship, stone, shot = null, sink = 0;
      function zz(v) { return -4 - v * 30; }
      function psp() { return 1.0 + Math.min(score, 8) * 0.09; }
      function tap() {
        if (cd > 0 || !has) return;
        cd = 0.9; var ok = Math.abs(p - s) < TOL;
        shot = { t: 0, z: zz(p), hit: ok };
        if (ok) { has = false; sink = 1.2; resp = 1.4; good(); } else { bad(); }
      }
      return {
        init: function () {
          var i, m;
          m = new TH.Mesh(new TH.PlaneGeometry(40, 130), mat(0x2a6a92, { shininess: 70 })); m.rotation.x = -Math.PI / 2; m.position.set(0, -0.2, -45); scene.add(m);
          for (var sd = -1; sd <= 1; sd += 2) { m = new TH.Mesh(new TH.BoxGeometry(24, 2, 130), mat(0x4a6a3a)); m.position.set(sd * 22, 0.6, -45); scene.add(m); for (i = 0; i < 9; i++) { var t = new TH.Mesh(new TH.ConeGeometry(2, 6, 6), mat(0x2a5a32)); t.position.set(sd * (13 + (i % 3) * 3), 4, -6 - i * 12); scene.add(t); } }
          var tw = new TH.Group();
          for (var q = 0; q < 2; q++) { var b = new TH.Mesh(new TH.BoxGeometry(2.6, 5.2, 2.6), mat(0x9a9488)); b.position.set(q * 3.4, 2.6, 0); tw.add(b); for (var c = -1; c <= 1; c += 1) { var cr = new TH.Mesh(new TH.BoxGeometry(0.7, 0.7, 0.7), mat(0x9a9488)); cr.position.set(q * 3.4 + c * 0.95, 5.6, 0); tw.add(cr); } }
                    tw.position.set(-6.5, 0, -1); scene.add(tw);
          ship = new TH.Group();
          var hu = new TH.Mesh(new TH.BoxGeometry(1.8, 0.7, 4.2), mat(0x7a4a26)); hu.position.y = 0.35; ship.add(hu);
          var pw = new TH.Mesh(new TH.ConeGeometry(0.9, 1.4, 4), mat(0x7a4a26)); pw.rotation.x = Math.PI / 2; pw.rotation.z = Math.PI / 4; pw.position.set(0, 0.35, 2.7); ship.add(pw);
          var dh = new TH.Mesh(new TH.ConeGeometry(0.25, 1, 5), mat(0x2a6a3a)); dh.position.set(0, 1.0, 3.1); ship.add(dh);
          var mk = new TH.Mesh(new TH.CylinderGeometry(0.07, 0.07, 3.2, 5), mat(0x5a3818)); mk.position.y = 2.0; ship.add(mk);
          var sl = new TH.Mesh(new TH.BoxGeometry(2.2, 2.0, 0.05), mat(0xb3382c)); sl.position.y = 2.5; ship.add(sl);
          ship.position.set(0, 0, zz(0.9)); scene.add(ship);
          stone = new TH.Mesh(new TH.DodecahedronGeometry(0.45, 0), mat(0x8a8f99)); stone.visible = false; scene.add(stone);
        },
        start: function () { p = 0; pd = 1; s = 0.9; has = false; resp = 0.6; cd = 0; shot = null; sink = 0; },
        logic: function (dt) {
          p += pd * psp() * dt; if (p > 1) { p = 1; pd = -1; } if (p < 0) { p = 0; pd = 1; }
          if (cd > 0) cd -= dt; if (sink > 0) sink -= dt;
          if (has) { s -= (0.034 + score * 0.003) * dt; if (s <= 0.12) { has = false; resp = 1.2; bad(); } }
          else if (sink <= 0) { resp -= dt; if (resp <= 0) { has = true; s = 0.9; } }
        },
        down: function () { tap(); },
        key: function (c, d) { if (d && c === 'Space') tap(); },
        cam: function (sk) { var f = fit(); setCam(sk, 7 + 4 * (f - 1), 12 * f, 0, 1, -12); },
        anim: function (dt) {
          ship.visible = has || sink > 0; ship.position.z = zz(s); ship.position.y = Math.sin(sceneT * 2) * 0.08 - (sink > 0 ? (1.2 - sink) * 1.2 : 0); ship.rotation.z = sink > 0 ? (1.2 - sink) * 0.5 : Math.sin(sceneT * 1.7) * 0.04;
          if (shot) { shot.t += dt; var k = Math.min(1, shot.t / 0.55); stone.visible = true; stone.position.set(-6 + 6 * k, 5 + Math.sin(k * Math.PI) * 6 - 5.4 * k, -1 + (shot.z + 1) * k); if (k >= 1) { burst(0, 0.5, shot.z, shot.hit ? 22 : 16, 4, shot.hit ? 1 : 0.5, shot.hit ? 0.8 : 0.75, shot.hit ? 0.4 : 1, 3); shot = null; stone.visible = false; } }
          this.cam(camShake(dt));
        },
        hud: function () {
          var W = api.w, H = api.h, L = Math.min(W * 0.8, 380), x0 = W / 2 - L / 2, y0 = H - 34;
          g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(x0, y0, L, 12);
          if (has) { g.fillStyle = 'rgba(90,200,110,.95)'; g.fillRect(x0 + L * Math.max(0, s - TOL), y0 - 3, L * 2 * TOL, 18); }
          g.fillStyle = '#fff'; g.fillRect(x0 + L * p - 2, y0 - 7, 4, 26);
        },
        dbg: function () { return { p: p, s: s, tol: TOL, cd: cd, has: has, pos: [{ x: api.w / 2, y: api.h / 2 }] }; }
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
