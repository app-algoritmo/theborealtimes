/* O barco de pedra — a corrente da rainha (3D, invenção). Usa Three.js local, carregado no primeiro toque. */
BTJogo.registrar({
  canvas: 'jogo-barcodepedra',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A corrente da rainha",
    "sub": "A verdadeira rainha está presa por uma corrente de ferro. Um elo brilhante gira em volta dela. Toque na tela, ou use Espaço, quando o elo brilhante passar sob a espada, no alto, para cortá-lo. Cortar fora do ponto é erro. Corte 9 elos antes do tempo acabar. Três erros encerram o jogo.",
    "perdeu": "A corrente aguentou",
    "v1": "A rainha está livre!",
    "v2": "No conto islandês, o rei Sigurd corta, na terceira noite, a corrente que prende a verdadeira rainha, trocada por uma troll. O corte de elos aos poucos é invenção.",
    "h1": "Elos",
    "h3": "Tempo",
    "carregando": "Carregando o 3D…",
    "sem3d": "Este aparelho não conseguiu mostrar gráficos 3D. Tente em outro navegador.",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The queen's chain",
    "sub": "The true queen is held by an iron chain. A glowing link circles around her. Tap the screen, or press Space, when the glowing link passes under the sword at the top, to cut it. Cutting off the mark is a mistake. Cut 9 links before time runs out. Three mistakes end the game.",
    "perdeu": "The chain held",
    "v1": "The queen is free!",
    "v2": "In the Icelandic tale, King Sigurd cuts, on the third night, the chain that holds the true queen, who was swapped for a troll-woman. Cutting link by link is invented.",
    "h1": "Links",
    "h3": "Time",
    "carregando": "Loading the 3D…",
    "sem3d": "This device could not show 3D graphics. Try another browser.",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Dronningens lenke",
    "sub": "Den ekte dronningen holdes fast av en jernlenke. Et glødende ledd går rundt henne. Trykk på skjermen, eller trykk mellomrom, når det glødende leddet passerer under sverdet øverst, for å kappe det. Å kappe utenfor merket er en feil. Kapp 9 ledd før tiden er ute. Tre feil avslutter spillet.",
    "perdeu": "Lenken holdt",
    "v1": "Dronningen er fri!",
    "v2": "I det islandske eventyret kapper kong Sigurd, den tredje natten, lenken som holder den ekte dronningen fast, hun som var byttet ut med en trollkvinne. Kappingen ledd for ledd er oppfunnet.",
    "h1": "Ledd",
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
    var CFG = {"sky": 790552, "fog": [30, 90], "hemi": [9411776, 1316380], "sun": 13621503, "sunPos": [-10, 30, 20], "cam": [0, 3.4, 11], "look": [0, 2.6, -6], "fov": 58, "fovP": 72, "target": 9, "maxe": 3, "total": 100, "bgA": "#0e2335", "bgB": "#050b12"};
    var HEAD = typeof document === 'undefined', ls = HEAD ? 2 : 0;
    var TH = null, R = null, scene = null, camera = null, sun = null, snap = null, endT = 0, sceneT = 0;
    var cvEl = HEAD ? null : document.getElementById('jogo-barcodepedra');
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
      var ang = 0, TOP = Math.PI / 2, R = 2.6, links = [], gone = [], marker, sword, cd = 0, glow, queen, flash = 0;
      function wrap(a) { while (a > Math.PI) a -= 6.283185; while (a < -Math.PI) a += 6.283185; return a; }
      function om() { return 1.5 + Math.min(score, 9) * 0.13; }
      function tap() {
        if (cd > 0) return; cd = 0.55;
        var off = wrap(ang - TOP);
        if (Math.abs(off) < 0.2) {
          var b = -1, bd = 9; for (var i = 0; i < 9; i++) { if (gone[i]) continue; var d = Math.abs(wrap(2 * Math.PI * i / 9 + 0.3 - ang)); if (d < bd) { bd = d; b = i; } }
          if (b >= 0) { gone[b] = true; links[b].visible = false; burst(Math.cos(ang) * R, 2.8 + Math.sin(ang) * R, -6, 20, 4, 1, 0.85, 0.5, 3); }
          flash = 0.3; good();
        } else bad();
      }
      return {
        init: function () {
          var i, m;
          m = new TH.Mesh(new TH.PlaneGeometry(80, 60), mat(0x1c2230, { shininess: 50 })); m.rotation.x = -Math.PI / 2; m.position.set(0, 0, -12); scene.add(m);
          for (i = 0; i < 12; i++) { m = new TH.Mesh(new TH.ConeGeometry(2.6, 9 + (i % 3) * 3, 5), mat(0x2a3040)); m.position.set(-24 + i * 4.4, 4, -26 - (i % 2) * 4); scene.add(m); }
          m = new TH.Mesh(new TH.BoxGeometry(4.2, 0.7, 7), mat(0x8a8f99)); m.position.set(0, 0.35, -6); scene.add(m);
          m = new TH.Mesh(new TH.ConeGeometry(2.1, 3, 4), mat(0x8a8f99)); m.rotation.x = Math.PI / 2; m.rotation.z = Math.PI / 4; m.position.set(0, 0.35, -10.8); scene.add(m);
          queen = new TH.Group();
          var dr = new TH.Mesh(new TH.ConeGeometry(0.9, 2.6, 8), mat(0xf0ece4)); dr.position.y = 1.9; queen.add(dr);
          var hd = new TH.Mesh(new TH.SphereGeometry(0.4, 8, 6), mat(0xe8c9a0)); hd.position.y = 3.4; queen.add(hd);
          var hr = new TH.Mesh(new TH.SphereGeometry(0.45, 8, 6), mat(0xd9b84a)); hr.position.set(0, 3.55, -0.1); queen.add(hr);
          queen.position.set(0, 0.7, -6); scene.add(queen);
          for (i = 0; i < 9; i++) { var a = 2 * Math.PI * i / 9 + 0.3, l = new TH.Mesh(new TH.TorusGeometry(0.4, 0.12, 6, 10), mat(0x7a8088, { shininess: 70 })); l.position.set(Math.cos(a) * R, 2.8 + Math.sin(a) * R, -6); l.rotation.z = a + Math.PI / 2; l.rotation.y = (i % 2) * 1.2; scene.add(l); links.push(l); gone.push(false); }
          marker = new TH.Mesh(new TH.SphereGeometry(0.5, 10, 8), new TH.MeshBasicMaterial({ color: 0xff5a3a })); scene.add(marker);
          glow = new TH.Mesh(new TH.SphereGeometry(0.85, 10, 8), new TH.MeshBasicMaterial({ color: 0xff8a5a, transparent: true, opacity: 0.35 })); scene.add(glow);
          sword = new TH.Group();
          var bl = new TH.Mesh(new TH.BoxGeometry(0.22, 2.2, 0.08), mat(0xdfe6ee, { shininess: 90 })); bl.position.y = 1.1; bl.rotation.z = Math.PI; sword.add(bl);
          var gd = new TH.Mesh(new TH.BoxGeometry(1.1, 0.2, 0.2), mat(0xc9a24a)); gd.position.y = 2.3; sword.add(gd);
          var hl = new TH.Mesh(new TH.CylinderGeometry(0.09, 0.09, 0.8, 6), mat(0x5a3818)); hl.position.y = 2.8; sword.add(hl);
          sword.position.set(0, 2.8 + R + 0.45, -6); sword.rotation.z = Math.PI; sword.scale.set(1, 1, 1); scene.add(sword);
        },
        start: function () { ang = 0; cd = 0; flash = 0; for (var i = 0; i < 9; i++) { gone[i] = false; if (links[i]) links[i].visible = true; } },
        logic: function (dt) { ang += om() * dt; if (cd > 0) cd -= dt; if (flash > 0) flash -= dt; },
        down: function () { tap(); },
        key: function (c, d) { if (d && c === 'Space') tap(); },
        cam: function (sk) { var f = fit(); setCam(sk, 3.4 + 2 * (f - 1), 7 * (1 + 0.5 * (f - 1)), 0, 2.8, -6); },
        anim: function (dt) {
          marker.position.set(Math.cos(ang) * R, 2.8 + Math.sin(ang) * R, -6); glow.position.copy ? glow.position.copy(marker.position) : glow.position.set(Math.cos(ang) * R, 2.8 + Math.sin(ang) * R, -6);
          glow.scale.setScalar(1 + Math.sin(sceneT * 12) * 0.15 + (Math.abs(wrap(ang - TOP)) < 0.2 ? 0.4 : 0));
          sword.position.y = 2.8 + R + 0.45 - (flash > 0 ? 0.5 : 0);
          this.cam(camShake(dt));
        },
        dbg: function () { return { off: wrap(ang - TOP), cd: cd, pos: [{ x: api.w / 2, y: api.h / 2 }] }; }
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
