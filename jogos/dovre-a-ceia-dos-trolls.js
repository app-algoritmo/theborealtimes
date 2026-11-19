/* Dovrefell — a ceia dos trolls (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-dovregato',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A ceia dos trolls",
    "sub": "É véspera de Natal, e os trolls chegaram à ceia. O urso dorme ao lado do fogão. Quando um troll levantar o garfo com a linguiça para espetar o urso, toque nele antes que o garfo chegue. Tocar num troll que só está comendo é erro. Espante 12 trolls antes do tempo acabar. Três erros, ou três espetadas no urso, encerram o jogo.",
    "perdeu": "O urso foi espetado",
    "v1": "Os trolls foram embora!",
    "v2": "No conto de Asbjørnsen e Moe, trolls tomam a casa de Halvor na véspera de Natal, um deles espeta o urso branco com uma linguiça, e o urso os põe para correr. O jogo de espantar trolls é invenção.",
    "h1": "Trolls",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador.",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The trolls' feast",
    "sub": "It is Christmas Eve, and the trolls have come to the feast. The bear sleeps beside the stove. When a troll lifts a fork with a sausage to prod the bear, tap it before the fork gets there. Tapping a troll that is only eating is a mistake. Drive off 12 trolls before time runs out. Three mistakes, or three prods at the bear, end the game.",
    "perdeu": "The bear was prodded",
    "v1": "The trolls are gone!",
    "v2": "In the tale by Asbjørnsen and Moe, trolls take over Halvor's house on Christmas Eve, one of them prods the white bear with a sausage, and the bear drives them out. The game of scaring trolls is invented.",
    "h1": "Trolls",
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser.",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Trollenes julemat",
    "sub": "Det er julaften, og trollene har kommet til festmåltidet. Bjørnen sover ved siden av ovnen. Når et troll løfter gaffelen med pølse for å pirke bjørnen, trykker du på det før gaffelen rekker fram. Å trykke på et troll som bare spiser er en feil. Driv bort 12 troll før tiden er ute. Tre feil, eller tre pirk i bjørnen, avslutter spillet.",
    "perdeu": "Bjørnen ble pirket",
    "v1": "Trollene er borte!",
    "v2": "I eventyret til Asbjørnsen og Moe tar trollene over Halvors hus på julekvelden, ett av dem pirker den hvite bjørnen med en pølse, og bjørnen jager dem ut. Spillet med å skremme troll er oppfunnet.",
    "h1": "Troll",
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
    var CFG = {"sky": 2759188, "fog": [30, 80], "hemi": [16767392, 2759184], "sun": 16763008, "sunPos": [8, 20, 14], "cam": [0, 7, 9], "look": [0, 1.4, -2], "fov": 58, "fovP": 72, "target": 12, "maxe": 3, "total": 110, "bgA": "#0e2335", "bgB": "#050b12"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-dovregato');
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
      var SL = [[-3.2, -5.2], [0, -5.2], [3.2, -5.2], [-3.2, -0.2], [0, -0.2], [3.2, -0.2]], BX = 0, BZ = 3.8, trolls = [], gap = 0.6, bear, P = [];
      function mkTroll(kind) {
        var g0 = new TH.Group();
        var b = new TH.Mesh(new TH.SphereGeometry(1.0, 8, 6), mat(0x6b7a5a)); b.scale.set(1.2, 1.4, 1.0); b.position.y = 1.2; g0.add(b);
        var h = new TH.Mesh(new TH.SphereGeometry(0.62, 8, 6), mat(0x7a8a68)); h.position.y = 2.8; g0.add(h);
        var n = new TH.Mesh(new TH.ConeGeometry(0.2, 0.9, 5), mat(0x8a6a58)); n.rotation.x = Math.PI / 2; n.position.set(0, 2.7, 0.8); g0.add(n);
        for (var s = -1; s <= 1; s += 2) { var e = new TH.Mesh(new TH.SphereGeometry(0.1, 5, 4), mat(0xffe36a, { emissive: 0xaa8a20 })); e.position.set(s * 0.25, 2.95, 0.5); g0.add(e); var ea = new TH.Mesh(new TH.ConeGeometry(0.18, 0.6, 4), mat(0x6b7a5a)); ea.position.set(s * 0.7, 3.0, 0); ea.rotation.z = -s * 1.2; g0.add(ea); }
        if (kind === 'P') {
          var fk = new TH.Mesh(new TH.CylinderGeometry(0.06, 0.06, 2.0, 5), mat(0xc0c4cc)); fk.position.set(0.9, 2.6, 0.6); fk.rotation.z = -0.5; g0.add(fk);
          var sg = new TH.Mesh(new TH.CylinderGeometry(0.2, 0.2, 0.9, 6), mat(0xc0402a, { emissive: 0x802010 })); sg.position.set(1.3, 3.5, 0.6); sg.rotation.z = -0.5; g0.add(sg);
        } else {
          var bw = new TH.Mesh(new TH.CylinderGeometry(0.55, 0.35, 0.4, 8), mat(0xc8a878)); bw.position.set(0, 1.7, 0.9); g0.add(bw);
        }
        return g0;
      }
      function tpos(t) { return { x: SL[t.slot][0], z: SL[t.slot][1] }; }
      function scr() { var o = []; for (var i = 0; i < trolls.length; i++) { var q = tpos(trolls[i]), v = toScr(q.x, 2.0, q.z); v.t = trolls[i]; o.push(v); } return o; }
      return {
        init: function () {
          var i, m;
          m = new TH.Mesh(new TH.PlaneGeometry(60, 40), mat(0x5a3d22)); m.rotation.x = -Math.PI / 2; m.position.set(0, 0, -4); scene.add(m);
          m = new TH.Mesh(new TH.PlaneGeometry(60, 24), mat(0x3a2616)); m.position.set(0, 10, -10); scene.add(m);
          m = new TH.Mesh(new TH.BoxGeometry(10, 0.4, 2.0), mat(0x8a5a2c)); m.position.set(0, 1.5, -2.7); scene.add(m);
          for (i = -1; i <= 1; i++) { m = new TH.Mesh(new TH.BoxGeometry(0.3, 1.5, 0.3), mat(0x6b4a28)); m.position.set(i * 4.6, 0.75, -2.7); scene.add(m); var pl = new TH.Mesh(new TH.CylinderGeometry(0.55, 0.45, 0.3, 8), mat(0xe8dcc0)); pl.position.set(i * 3.2, 1.85, -2.7); scene.add(pl); }
          m = new TH.Mesh(new TH.BoxGeometry(2.6, 3.0, 2.2), mat(0x3a3a42)); m.position.set(BX + 4.4, 1.5, BZ - 0.2); scene.add(m);
          m = new TH.Mesh(new TH.SphereGeometry(0.5, 8, 6), new TH.MeshBasicMaterial({ color: 0xff9a3a })); m.position.set(BX + 3.2, 1.2, BZ + 0.2); scene.add(m);
          bear = new TH.Group();
          var bd = new TH.Mesh(new TH.SphereGeometry(1.1, 9, 7), mat(0xf4f4f8)); bd.scale.set(1.5, 0.9, 1); bd.position.y = 0.9; bear.add(bd);
          var hd = new TH.Mesh(new TH.SphereGeometry(0.62, 8, 6), mat(0xf4f4f8)); hd.position.set(-1.7, 0.9, 0.2); bear.add(hd);
          var ns = new TH.Mesh(new TH.SphereGeometry(0.2, 6, 5), mat(0x20202a)); ns.position.set(-2.3, 0.85, 0.2); bear.add(ns);
          bear.position.set(BX, 0, BZ); scene.add(bear);
        },
        start: function () { trolls.forEach(function (t) { scene.remove(t.m); }); trolls = []; gap = 0.6; P = []; },
        logic: function (dt) {
          var i, t;
          for (i = trolls.length - 1; i >= 0; i--) {
            t = trolls[i]; t.t += dt;
            if (t.state === 'flee') { if (t.t > 0.45) { scene.remove(t.m); trolls.splice(i, 1); } continue; }
            if (t.t >= t.life) { if (t.kind === 'P') { burst(BX, 1.4, BZ, 18, 3, 1, 0.4, 0.3, 3); bad(); } scene.remove(t.m); trolls.splice(i, 1); }
          }
          gap -= dt;
          if (gap <= 0 && trolls.length < 4) {
            var free = [], used = {}; for (i = 0; i < trolls.length; i++) used[trolls[i].slot] = 1; for (i = 0; i < 6; i++) if (!used[i]) free.push(i);
            if (free.length) {
              var slot = free[Math.floor(Math.random() * free.length)], kind = Math.random() < 0.5 ? 'P' : 'E', lf = kind === 'P' ? Math.max(1.5, 2.6 - score * 0.09) : 2.3;
              var m = mkTroll(kind); m.position.set(SL[slot][0], 0, SL[slot][1]); m.rotation.y = SL[slot][1] < -2 ? 0 : Math.PI; scene.add(m);
              trolls.push({ slot: slot, kind: kind, t: 0, life: lf, state: 'on', m: m }); gap = Math.max(0.5, 0.9 - score * 0.03);
            }
          }
        },
        down: function (x, y) {
          P = scr(); var a = []; for (var i = 0; i < P.length; i++) if (trolls[i].state === 'on') a.push(P[i]);
          var j = nearest(a, x, y, Math.max(40, 0.12 * Math.min(api.w, api.h))); if (j < 0) return;
          var t = a[j].t; t.state = 'flee'; t.t = 0;
          if (t.kind === 'P') { burst(SL[t.slot][0], 2.5, SL[t.slot][1], 20, 4, 1, 0.9, 0.5, 3); good(); } else bad();
        },
        cam: function (sk) { var f = fit(); setCam(sk, 8 + 4 * (f - 1), 10 * f, 0, 1.0, -0.8); },
        anim: function (dt) {
          for (var i = 0; i < trolls.length; i++) {
            var t = trolls[i], m = t.m, e = t.state === 'flee' ? Math.min(1, t.t / 0.45) : 0;
            m.position.y = e * 3; m.scale.setScalar(1 - e * 0.6); m.rotation.z = e * 1.5;
            if (t.state === 'on') { m.position.y = Math.abs(Math.sin(sceneT * 6 + i)) * 0.12; if (t.kind === 'P') { var kk = t.t / t.life; m.position.x = SL[t.slot][0] + (BX - SL[t.slot][0]) * 0.22 * kk; m.position.z = SL[t.slot][1] + (BZ - SL[t.slot][1]) * 0.22 * kk; } }
          }
          bear.rotation.z = Math.sin(sceneT * 2) * 0.02;
          this.cam(camShake(dt));
        },
        dbg: function () { var o = scr(), a = []; for (var i = 0; i < o.length; i++) if (trolls[i].state === 'on') a.push({ kind: trolls[i].kind, x: o[i].x, y: o[i].y }); return { t: a, pos: a.length ? a : [{ x: api.w / 2, y: api.h / 2 }] }; }
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
