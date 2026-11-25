/* Salão Boreal VR — Boreal Saga Play.
   Protótipo: um salão 3D com os quatro reinos e as figurinhas em 3D.
   Funciona em tela comum (arrastar), com giroscópio e em óculos de celular (modo estéreo,
   com correção de lente). A escolha é feita só com o olhar: mire o ponto no centro e espere. */
import * as THREE from 'three';

var $ = function (id) { return document.getElementById(id); };
var qs = new URLSearchParams(location.search);
var L = (qs.get('l') || (navigator.language || 'pt').slice(0, 2)).toLowerCase();
if (L === 'nb' || L === 'nn') L = 'no';
if (['pt', 'en', 'no', 'es'].indexOf(L) < 0) L = 'en';
document.documentElement.lang = L;

var TXT = {
  pt: { titulo: 'Salão Boreal', intro: 'Assista às histórias do Boreal Saga Play numa tela gigante, com narração. Escolha com o olhar: mire o ponto no centro e espere.',
    vr: 'Modo óculos (VR)', mono: 'Explorar na tela (arraste)', aviso: 'No modo óculos: gire o celular para horizontal, encaixe no óculos e olhe para a frente. Para sair, tire o celular e toque na tela.',
    ajuste: 'Ajuste das lentes', k1: 'Lentes k1', k2: 'Lentes k2', ipd: 'Olhos (cm)', fov: 'Campo de visão', prof: 'Profundidade 3D', padrao: 'Valores padrão', sair: 'Sair',
    reinos: ['Mitos e Deuses', 'Sagas e Reis', 'Era Viking', 'Contos e Folclore'], rar: ['Comum', 'Rara', 'Épica', 'Lendária'],
    pausar: 'Pausar', cont: 'Continuar', menu: 'Reinos', vozl: 'pt-BR', fig: 'Figurinha', voltar: 'Voltar', salao: 'Salão', mais: 'Mais ▶', antes: '◀ Antes', prox: 'Próxima ▶', ant: '◀ Anterior', pag: 'Página', hist: 'histórias',
    olhe: 'Olhe para a frente. O salão se ajusta em', gir: 'Sem giroscópio neste aparelho.', ler: 'Ler a história no site' },
  en: { titulo: 'Boreal Hall', intro: 'Watch the Boreal Saga Play stories on a giant screen, with narration. Choose with your gaze: aim the dot at the centre and wait.',
    vr: 'Headset mode (VR)', mono: 'Explore on screen (drag)', aviso: 'In headset mode: turn the phone to landscape, slot it into the headset and look straight ahead. To exit, take the phone out and tap the screen.',
    ajuste: 'Lens settings', k1: 'Lens k1', k2: 'Lens k2', ipd: 'Eyes (cm)', fov: 'Field of view', prof: '3D depth', padrao: 'Default values', sair: 'Exit',
    reinos: ['Myths & Gods', 'Sagas & Kings', 'Viking Age', 'Tales & Folklore'], rar: ['Common', 'Rare', 'Epic', 'Legendary'],
    pausar: 'Pause', cont: 'Resume', menu: 'Realms', vozl: 'en-GB', fig: 'Sticker', voltar: 'Back', salao: 'Hall', mais: 'More ▶', antes: '◀ Previous', prox: 'Next ▶', ant: '◀ Previous', pag: 'Page', hist: 'stories',
    olhe: 'Look straight ahead. The hall adjusts in', gir: 'No gyroscope on this device.', ler: 'Read the story on the site' },
  no: { titulo: 'Boreal-salen', intro: 'Se historiene fra Boreal Saga Play på en gigantisk skjerm, med fortelling. Velg med blikket: sikt prikken mot midten og vent.',
    vr: 'Brillemodus (VR)', mono: 'Utforsk på skjermen (dra)', aviso: 'I brillemodus: vri telefonen til liggende, sett den i brillen og se rett frem. For å avslutte tar du ut telefonen og trykker på skjermen.',
    ajuste: 'Linseinnstillinger', k1: 'Linse k1', k2: 'Linse k2', ipd: 'Øyne (cm)', fov: 'Synsfelt', prof: '3D-dybde', padrao: 'Standardverdier', sair: 'Avslutt',
    reinos: ['Myter og guder', 'Sagaer og konger', 'Vikingtid', 'Eventyr og folketro'], rar: ['Vanlig', 'Sjelden', 'Episk', 'Legendarisk'],
    pausar: 'Pause', cont: 'Fortsett', menu: 'Riker', vozl: 'nb-NO', fig: 'Klistremerke', voltar: 'Tilbake', salao: 'Salen', mais: 'Flere ▶', antes: '◀ Forrige', prox: 'Neste ▶', ant: '◀ Forrige', pag: 'Side', hist: 'historier',
    olhe: 'Se rett frem. Salen justeres om', gir: 'Ingen gyroskop på denne enheten.', ler: 'Les historien på nettstedet' },
  es: { titulo: 'Salón Boreal', intro: 'Mira las historias de Boreal Saga Play en una pantalla gigante, con narración. Elige con la mirada: apunta el punto al centro y espera.',
    vr: 'Modo gafas (VR)', mono: 'Explorar en pantalla (arrastra)', aviso: 'En modo gafas: gira el móvil a horizontal, colócalo en las gafas y mira al frente. Para salir, saca el móvil y toca la pantalla.',
    ajuste: 'Ajuste de las lentes', k1: 'Lentes k1', k2: 'Lentes k2', ipd: 'Ojos (cm)', fov: 'Campo de visión', prof: 'Profundidad 3D', padrao: 'Valores por defecto', sair: 'Salir',
    reinos: ['Mitos y Dioses', 'Sagas y Reyes', 'Era Vikinga', 'Cuentos y Folclore'], rar: ['Común', 'Rara', 'Épica', 'Legendaria'],
    pausar: 'Pausar', cont: 'Continuar', menu: 'Reinos', vozl: 'es-ES', fig: 'Cromo', voltar: 'Volver', salao: 'Salón', mais: 'Más ▶', antes: '◀ Antes', prox: 'Siguiente ▶', ant: '◀ Anterior', pag: 'Página', hist: 'historias',
    olhe: 'Mira al frente. El salón se ajusta en', gir: 'Este dispositivo no tiene giroscopio.', ler: 'Leer la historia en el sitio' }
};
var TX = TXT[L];
$('t1').textContent = TX.titulo; $('t2').textContent = TX.intro; $('bvr').textContent = TX.vr; $('bmono').textContent = TX.mono;
$('t3').textContent = TX.aviso; $('tadj').textContent = TX.ajuste; $('l1').textContent = TX.k1; $('l2').textContent = TX.k2;
$('l3').textContent = TX.ipd; $('l4').textContent = TX.fov; $('l5').textContent = TX.prof; $('breset').textContent = TX.padrao; $('sair').textContent = TX.sair;
document.title = TX.titulo + ' VR · Boreal Saga Play';

/* ---------- ajustes das lentes (guardados no aparelho) ---------- */
var DEF = { k1: 0.22, k2: 0.24, ipd: 6.4, fov: 90, prof: 0.45 }, CFG = Object.assign({}, DEF);
try { Object.assign(CFG, JSON.parse(localStorage.getItem('btvr3') || '{}')); } catch (e) {}
['k1', 'k2'].forEach(function (k) { if (qs.has(k)) CFG[k] = parseFloat(qs.get(k)); });
function salvarCfg() { try { localStorage.setItem('btvr3', JSON.stringify(CFG)); } catch (e) {} }
function sliders() { ['k1', 'k2', 'ipd', 'fov', 'prof'].forEach(function (k, i) { $(k).value = CFG[k]; $('o' + (i + 1)).textContent = CFG[k]; }); }
['k1', 'k2', 'ipd', 'fov', 'prof'].forEach(function (k) {
  $(k).addEventListener('input', function () { CFG[k] = parseFloat($(k).value); sliders(); salvarCfg(); aplicarCfg(); });
});
$('breset').onclick = function () { CFG = Object.assign({}, DEF); sliders(); salvarCfg(); aplicarCfg(); };
sliders();

/* ---------- cena ---------- */
var canvas = $('c');
var renderer;
try { renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: 'high-performance' }); }
catch (e) { $('t2').textContent = 'WebGL?'; throw e; }
var DPR = Math.min(window.devicePixelRatio || 1, 2);
renderer.setPixelRatio(DPR);
var scene = new THREE.Scene();
(function fundo() {
  var c = document.createElement('canvas'); c.width = 8; c.height = 256; var g = c.getContext('2d');
  var gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, '#030208'); gr.addColorStop(0.55, '#0c0720'); gr.addColorStop(0.8, '#1a0f33'); gr.addColorStop(1, '#05030d');
  g.fillStyle = gr; g.fillRect(0, 0, 8, 256);
  var t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; scene.background = t;
})();
scene.fog = new THREE.Fog(0x1b0f38, 9, 45);
scene.add(new THREE.AmbientLight(0xd8ccff, 2.6));
var sol = new THREE.DirectionalLight(0xffe2a8, 2.2); sol.position.set(0, 3, 6); scene.add(sol);
(function chao() {
  var m = new THREE.Mesh(new THREE.CircleGeometry(12, 64), new THREE.MeshStandardMaterial({ color: 0x1a1230, roughness: 0.9 }));
  m.rotation.x = -Math.PI / 2; scene.add(m);
  [2.6, 3.4, 4.6].forEach(function (r, i) {
    var a = new THREE.Mesh(new THREE.RingGeometry(r, r + 0.03, 96), new THREE.MeshBasicMaterial({ color: i === 1 ? 0xf0c15a : 0x6b4bb8, transparent: true, opacity: 0.55 }));
    a.rotation.x = -Math.PI / 2; a.position.y = 0.01; scene.add(a);
  });
  var n = 700, pos = new Float32Array(n * 3);
  for (var i = 0; i < n; i++) {
    var th = Math.random() * Math.PI * 2, ph = Math.acos(Math.random() * 0.95 + 0.02), r = 30 + Math.random() * 10;
    pos[i * 3] = r * Math.sin(ph) * Math.cos(th); pos[i * 3 + 1] = r * Math.cos(ph); pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
  }
  var gs = new THREE.BufferGeometry(); gs.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  scene.add(new THREE.Points(gs, new THREE.PointsMaterial({ color: 0xffffff, size: 0.18, sizeAttenuation: true, fog: false })));
})();

var EYE = 1.6;
var rig = new THREE.Group(); rig.position.set(0, EYE, 0); scene.add(rig);
var cam = new THREE.PerspectiveCamera(70, 1, 0.05, 80); rig.add(cam);
var camL = new THREE.PerspectiveCamera(90, 1, 0.05, 80), camR = new THREE.PerspectiveCamera(90, 1, 0.05, 80); rig.add(camL); rig.add(camR);
function mira() {
  var g = new THREE.Group(), bg = new THREE.Mesh(new THREE.RingGeometry(0.022, 0.03, 32), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8, depthTest: false, fog: false }));
  var pr = new THREE.Mesh(new THREE.CircleGeometry(0.02, 32), new THREE.MeshBasicMaterial({ color: 0xf0c15a, transparent: true, opacity: 0.95, depthTest: false, fog: false }));
  bg.renderOrder = 998; pr.renderOrder = 999; pr.scale.setScalar(0.05); g.add(bg); g.add(pr); g.position.z = -1.5; g.userData.pr = pr; return g;
}
var mm = mira(), ml = mira(), mr = mira(); cam.add(mm); camL.add(ml); camR.add(mr);
ml.traverse(function (o) { o.layers.set(1); }); mr.traverse(function (o) { o.layers.set(2); }); camL.layers.enable(1); camR.layers.enable(2);
var miras = [mm, ml, mr];

/* ---------- estéreo com correção de lente ---------- */
var rtL, rtR, qScene = new THREE.Scene(), qCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), distMat;
distMat = new THREE.ShaderMaterial({
  uniforms: { t: { value: null }, k: { value: new THREE.Vector2(CFG.k1, CFG.k2) } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }',
  fragmentShader: 'varying vec2 vUv; uniform sampler2D t; uniform vec2 k; void main(){ vec2 p=(vUv-0.5)*2.0; float r2=dot(p,p); float f=1.0+k.x*r2+k.y*r2*r2; vec2 uv=0.5+0.5*p*f; if(uv.x<0.||uv.x>1.||uv.y<0.||uv.y>1.){ gl_FragColor=vec4(0.,0.,0.,1.); return; } gl_FragColor=texture2D(t,uv); gl_FragColor=linearToOutputTexel(gl_FragColor); }',
  depthTest: false, depthWrite: false
});
qScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), distMat));
var estereo = false;
function aplicarCfg() {
  distMat.uniforms.k.value.set(CFG.k1, CFG.k2);
  camL.position.x = -CFG.ipd / 200; camR.position.x = CFG.ipd / 200;
  camL.fov = camR.fov = CFG.fov; camL.updateProjectionMatrix(); camR.updateProjectionMatrix();
}
function tamanho() {
  var w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h, false);
  cam.aspect = w / h; cam.updateProjectionMatrix();
  var hw = Math.max(2, Math.round(w / 2 * DPR * 0.85)), hh = Math.max(2, Math.round(h * DPR * 0.85));
  [rtL, rtR].forEach(function (r) { if (r) r.dispose(); });
  rtL = new THREE.WebGLRenderTarget(hw, hh, { samples: 4 }); rtR = new THREE.WebGLRenderTarget(hw, hh, { samples: 4 });
  camL.aspect = camR.aspect = (w / 2) / h; camL.updateProjectionMatrix(); camR.updateProjectionMatrix();
}
window.addEventListener('resize', tamanho); window.addEventListener('orientationchange', function () { setTimeout(function () { tamanho(); recentrar(6); }, 300); });
aplicarCfg(); tamanho();

/* ---------- direção da cabeça: giroscópio ou arrastar ---------- */
var yaw = 0, pitch = 0, giro = false, dev = { a: 0, b: 0, g: 0 }, yawOff = 0, recent = 0, tVida = 0;
var eul = new THREE.Euler(), q1 = new THREE.Quaternion(-Math.SQRT1_2, 0, 0, Math.SQRT1_2), q0 = new THREE.Quaternion(), zee = new THREE.Vector3(0, 0, 1), qd = new THREE.Quaternion(), qy = new THREE.Quaternion(), ey = new THREE.Euler();
function recentrar(seg) { recent = seg; }
function lerGiro() {
  var a = THREE.MathUtils.degToRad(dev.a), b = THREE.MathUtils.degToRad(dev.b), g = THREE.MathUtils.degToRad(dev.g);
  var o = THREE.MathUtils.degToRad((screen.orientation && screen.orientation.angle) || window.orientation || 0);
  eul.set(b, a, -g, 'YXZ'); qd.setFromEuler(eul); qd.multiply(q1); qd.multiply(q0.setFromAxisAngle(zee, -o));
}
async function ativarGiro() {
  if (giro) return true;
  if (typeof DeviceOrientationEvent === 'undefined') return false;
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    var r = await DeviceOrientationEvent.requestPermission(); if (r !== 'granted') return false;
  }
  window.addEventListener('deviceorientation', function (e) {
    if (e.alpha == null) return; dev.a = e.alpha; dev.b = e.beta; dev.g = e.gamma;
    if (!giro) { giro = true; recentrar(6); }
  });
  return true;
}
function atualizarCabeca(dt) {
  if (giro) {
    lerGiro();
    if (recent > 0) { recent -= dt; ey.setFromQuaternion(qd, 'YXZ'); yawOff = -ey.y; }
    qy.setFromAxisAngle(new THREE.Vector3(0, 1, 0), yawOff);
    rig.quaternion.copy(qy).multiply(qd);
  } else {
    rig.quaternion.setFromEuler(new THREE.Euler(pitch, yaw, 0, 'YXZ'));
  }
}

/* ---------- texto e botões 3D ---------- */
function quebra(g, texto, x, y, larg, alt, max) {
  var ps = String(texto).split(' '), lin = '', n = 0;
  for (var i = 0; i < ps.length; i++) {
    var t = lin ? lin + ' ' + ps[i] : ps[i];
    if (g.measureText(t).width > larg && lin) { g.fillText(lin, x, y + n * alt); n++; lin = ps[i]; if (n >= max) { lin = ''; break; } } else lin = t;
  }
  if (lin && n < max) { g.fillText(lin, x, y + n * alt); n++; }
  return n;
}
function painel(wm, hm, pw, ph, desenhar) {
  var c = document.createElement('canvas'); c.width = pw; c.height = ph; var g = c.getContext('2d'); desenhar(g, pw, ph);
  var t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return new THREE.Mesh(new THREE.PlaneGeometry(wm, hm), new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false }));
}
function fundoArr(g, w, h, r, borda) {
  g.beginPath(); g.moveTo(r, 0); g.arcTo(w, 0, w, h, r); g.arcTo(w, h, 0, h, r); g.arcTo(0, h, 0, 0, r); g.arcTo(0, 0, w, 0, r); g.closePath();
  g.fillStyle = 'rgba(20,12,42,.88)'; g.fill(); g.lineWidth = 6; g.strokeStyle = borda || '#f0c15a'; g.stroke();
}
function botao(txt, wm, hm) {
  var pw = 512, ph = Math.round(512 * hm / wm);
  var m = painel(wm, hm, pw, ph, function (g, w, h) {
    fundoArr(g, w, h, 26); g.fillStyle = '#fff'; g.font = 'bold ' + Math.round(h * 0.42) + 'px system-ui,sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, w / 2, h / 2 + 2);
  });
  return m;
}
function legenda(txt, wm, hm, tam) {
  var pw = 1024, ph = Math.round(1024 * hm / wm);
  return painel(wm, hm, pw, ph, function (g, w, h) {
    g.fillStyle = '#efe9ff'; g.font = 'bold ' + (tam || Math.round(h * 0.45)) + 'px Georgia,serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, w / 2, h / 2);
  });
}
function colocar(o, az, y, R) {
  var a = az * Math.PI / 180; o.position.set(Math.sin(a) * R, y, -Math.cos(a) * R); o.lookAt(0, y, 0); return o;
}

/* ---------- cinema: tela curva gigante, narração e lista de reprodução ---------- */
var CAT = null, dyn = new THREE.Group(); scene.add(dyn);
var alvos = [], estado = 'menu', lista = [], pos = 0, telaMesh = null, kb = 0, fade = 1, mudo = false;
var RTELA = 2.2, ATELA = 100 * Math.PI / 180, HTELA = RTELA * ATELA * 9 / 16, loadTex = new THREE.TextureLoader();
function limpar() {
  alvos = []; telaMesh = null;
  dyn.traverse(function (o) {
    if (o.geometry) o.geometry.dispose();
    if (o.material) { var ms = Array.isArray(o.material) ? o.material : [o.material]; ms.forEach(function (m) { if (m.map) m.map.dispose(); m.dispose(); }); }
  });
  while (dyn.children.length) dyn.remove(dyn.children[0]);
}
function acao(o, f) { o.userData.act = f; alvos.push(o); return o; }
/* trecho de cilindro visto por dentro, centrado à frente (-z) */
function remendo(az, larg, alt, y, tex) {
  var a = larg * Math.PI / 180, c = az * Math.PI / 180;
  var g = new THREE.CylinderGeometry(RTELA, RTELA, alt, 48, 1, true, Math.PI - c - a / 2, a);
  var m = new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide, fog: false });
  var o = new THREE.Mesh(g, m); o.position.y = y; return o;
}
var vazio = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1); vazio.needsUpdate = true;
function telaProf(cor, prof) {
  var g = new THREE.CylinderGeometry(RTELA, RTELA, HTELA, 160, 90, true, Math.PI - ATELA / 2, ATELA);
  var m = new THREE.ShaderMaterial({
    uniforms: { cor: { value: cor }, dep: { value: prof }, k: { value: CFG.prof }, sc: { value: 1 }, fade: { value: 0 } },
    side: THREE.BackSide, depthWrite: true,
    vertexShader: 'uniform sampler2D dep; uniform float k, sc; varying vec2 vU; void main(){ vec2 u=(vec2(1.0-uv.x, uv.y)-0.5)*sc+0.5; vU=u; float d=texture2D(dep,u).r; vec3 p=position*(1.0-k*d); gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0); }',
    fragmentShader: 'uniform sampler2D cor; uniform float fade; varying vec2 vU; void main(){ vec4 c=texture2D(cor,vU); c.rgb*=fade; gl_FragColor=linearToOutputTexel(c); }'
  });
  var o = new THREE.Mesh(g, m); o.position.y = EYE; o.frustumCulled = false; return o;
}
function espelho(t) { t.wrapS = THREE.RepeatWrapping; t.repeat.x = -1; t.offset.x = 1; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; }
function cartaoReino(s) {
  var c = document.createElement('canvas'); c.width = 1024; c.height = 576; var g = c.getContext('2d');
  g.fillStyle = '#1a1033'; g.fillRect(0, 0, 1024, 576);
  var tex = new THREE.CanvasTexture(c); espelho(tex);
  function rotulo() {
    var gr = g.createLinearGradient(0, 380, 0, 576); gr.addColorStop(0, 'rgba(8,4,20,0)'); gr.addColorStop(1, 'rgba(8,4,20,.92)');
    g.fillStyle = gr; g.fillRect(0, 380, 1024, 196);
    g.fillStyle = '#fff'; g.font = 'bold 74px Georgia,serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(TX.reinos[s], 512, 510);
    g.lineWidth = 14; g.strokeStyle = '#f0c15a'; g.strokeRect(7, 7, 1010, 562); tex.needsUpdate = true;
  }
  rotulo();
  var u = (CAT.fundos && CAT.fundos[s]) || '';
  if (u) { var im = new Image(); im.onload = function () {
    var r = Math.max(1024 / im.width, 576 / im.height), w = im.width * r, h = im.height * r; g.drawImage(im, (1024 - w) / 2, (576 - h) / 2, w, h); rotulo(); }; im.src = u; }
  return tex;
}
function menu() {
  estado = 'menu'; pararVoz(); limpar();
  var larg = 47, alt = RTELA * larg * Math.PI / 180 * 9 / 16, pos2 = [[-25, 0], [25, 0], [-25, 1], [25, 1]];
  for (var s = 0; s < 4; s++) (function (s) {
    var p = pos2[s], tile = remendo(p[0], larg, alt, EYE + (p[1] ? -(alt / 2 + 0.05) : (alt / 2 + 0.05)), cartaoReino(s));
    tile.material.color.setScalar(0.78); tile.userData.hl = function (on) { tile.material.color.setScalar(on ? 1 : 0.78); };
    acao(tile, function () { reinoCinema(s); }); dyn.add(tile);
  })(s);
}
function reinoCinema(s) {
  lista = CAT.itens.filter(function (x) { return x.s === s && x.m; }).sort(function (a, b) { return a.n - b.n; });
  if (!lista.length) return; pos = 0; cinema();
}
function cinema() {
  estado = 'cinema'; limpar(); var x = lista[pos]; kb = 0; fade = 0; mudo = false;
  var cor = loadTex.load(x.m); cor.colorSpace = THREE.SRGBColorSpace; cor.anisotropy = 4;
  var stem = x.m.split('/').pop().replace(/\.[a-z0-9]+$/i, ''), prof = vazio;
  telaMesh = telaProf(cor, vazio); dyn.add(telaMesh);
  loadTex.load('/g/vr/prof/' + stem + '.jpg', function (d) { d.colorSpace = THREE.NoColorSpace; if (telaMesh && telaMesh.material.uniforms.cor.value === cor) telaMesh.material.uniforms.dep.value = d; });
  var seta = function (txt, az, f) { var b = botao(txt, 0.5, 0.5); dyn.add(colocar(b, az, EYE, RTELA - 0.05)); acao(b, f); };
  seta('‹', -60, function () { pos = (pos - 1 + lista.length) % lista.length; cinema(); });
  seta('›', 60, function () { pos = (pos + 1) % lista.length; cinema(); });
  var bp = botao(TX.pausar, 0.9, 0.3); dyn.add(colocar(bp, 14, 0.3, 1.8));
  acao(bp, function () { mudo = !mudo; if (mudo) pausarVoz(); else tocarVoz(); atualizaPausa(bp); });
  var bm = botao(TX.menu, 0.9, 0.3); dyn.add(colocar(bm, -14, 0.3, 1.8)); acao(bm, menu);
  falar(x);
}
function atualizaPausa(b) {
  var n = botao(mudo ? TX.cont : TX.pausar, 0.9, 0.3); b.material.map.dispose(); b.material.map = n.material.map; b.material.needsUpdate = true;
}
function fechaLer() {}

/* ---------- narração (a voz do próprio aparelho, como o botão "Ouvir" do site) ---------- */
var S = window.speechSynthesis, vozEsc = null, chunks = [], ci = 0, ficha = 0, relogio = null, falando = false;
function escolherVoz() {
  if (!S) return; var v = S.getVoices() || [], lang = TX.vozl, pref = lang.slice(0, 2).toLowerCase(), melhor = null;
  for (var k = 0; k < v.length; k++) {
    var vl = (v[k].lang || '').replace('_', '-').toLowerCase();
    if (vl.indexOf(pref) !== 0 && !(pref === 'nb' && vl.indexOf('no') === 0)) continue;
    if (vl === lang.toLowerCase()) { if (!melhor || v[k].localService === false || /natural|online|premium|enhanced/i.test(v[k].name)) melhor = v[k]; }
    else if (!melhor) melhor = v[k];
  }
  vozEsc = melhor;
}
function destravarVoz() { try { if (S) { var u = new SpeechSynthesisUtterance(' '); u.volume = 0; S.speak(u); } } catch (e) {} }
function dividir(partes) {
  var res = [];
  partes.forEach(function (p) {
    var frases = p.match(/[^.!?]+[.!?]+["”»)]*\s*|[^.!?]+$/g) || [p], atual = '';
    frases.forEach(function (f) { if ((atual + f).length > 220 && atual) { res.push(atual.trim()); atual = ''; } atual += f; });
    if (atual.trim()) res.push(atual.trim());
  });
  return res;
}
function pararVoz() { ficha++; clearInterval(relogio); falando = false; if (S) S.cancel(); }
function pausarVoz() { ficha++; clearInterval(relogio); if (S) S.cancel(); }
function proxFala(n, f) {
  if (f !== ficha) return;
  if (n >= chunks.length) { falando = false; if (estado === 'cinema') { pos = (pos + 1) % lista.length; cinema(); } return; }
  ci = n; var u = new SpeechSynthesisUtterance(chunks[n]), feito = false;
  u.lang = TX.vozl; if (vozEsc) u.voice = vozEsc; u.rate = 0.95;
  function avancar() { if (feito) return; feito = true; clearInterval(relogio); if (f === ficha) proxFala(n + 1, f); }
  u.onend = avancar; u.onerror = function (e) { if (e && (e.error === 'canceled' || e.error === 'interrupted')) return; avancar(); };
  S.speak(u);
  var ini = Date.now(), previsto = 4000 + chunks[n].length * 110; clearInterval(relogio);
  relogio = setInterval(function () { if (feito || f !== ficha) { clearInterval(relogio); return; } var tt = Date.now() - ini; if ((tt > 1500 && !S.speaking && !S.pending) || tt > previsto * 3) avancar(); }, 400);
}
function tocarVoz() { ficha++; var f = ficha; if (S) S.cancel(); falando = true; setTimeout(function () { proxFala(ci, f); }, 150); }
function falar(x) {
  pararVoz(); chunks = []; ci = 0; var f0 = ficha;
  if (!S || typeof SpeechSynthesisUtterance === 'undefined') { var f1 = ficha; setTimeout(function () { if (f1 === ficha && estado === 'cinema') { pos = (pos + 1) % lista.length; cinema(); } }, 30000); return; }
  escolherVoz();
  fetch(x.u).then(function (r) { return r.text(); }).then(function (h) {
    if (f0 !== ficha) return;
    var d = new DOMParser().parseFromString(h, 'text/html'), out = [], h1 = d.querySelector('.cabeca-materia h1'), lf = d.querySelector('.linha-fina');
    if (h1) out.push(h1.textContent.trim() + '.'); if (lf) out.push(lf.textContent.trim());
    var tx = d.querySelector('.texto'); if (tx) tx.querySelectorAll('h2,p').forEach(function (n) { var s = n.textContent.replace(/\s+/g, ' ').trim(); if (s) out.push(s); });
    if (!out.length) out.push(x.t + '. ' + x.r);
    chunks = dividir(out); ci = 0; if (!mudo) tocarVoz();
  }).catch(function () { chunks = dividir([x.t + '. ' + x.r]); ci = 0; if (!mudo) tocarVoz(); });
}

/* ---------- olhar (gaze) e toque ---------- */
var ray = new THREE.Raycaster(), alvoAtual = null, dwell = 0, espera = 0, DWELL = 1.3;
function achar(ox) {
  var lista = []; alvos.forEach(function (o) { lista.push(o); });
  var hits = ray.intersectObjects(lista, true);
  for (var i = 0; i < hits.length; i++) { var o = hits[i].object; while (o && !o.userData.act) o = o.parent; if (o) return o; }
  return null;
}
function raioCentro() {
  var d = new THREE.Vector3(0, 0, -1).applyQuaternion(rig.quaternion); ray.set(rig.position.clone(), d);
}
function mexer(dt) {
  if (espera > 0) espera -= dt;
  raioCentro(); var o = espera > 0 ? null : achar();
  if (o !== alvoAtual) { alvoAtual = o; dwell = 0; }
  if (o) {
    dwell += dt;
    if (dwell >= DWELL) { var f = o.userData.act; dwell = 0; alvoAtual = null; espera = 0.9; f(); }
  } else dwell = 0;
  var p = Math.max(0.05, Math.min(1, dwell / DWELL));
  miras.forEach(function (m) { m.userData.pr.scale.setScalar(p); m.userData.pr.material.opacity = alvoAtual ? 0.95 : 0; });
  alvos.forEach(function (a) { if (a.userData.hl) { a.userData.hl(a === alvoAtual); return; } var alvo = (a === alvoAtual) ? 1.08 : 1; a.scale.lerp(new THREE.Vector3(alvo, alvo, alvo), 0.2); });
}

/* ---------- entrada: arrastar e tocar (modo tela) ---------- */
var pd = null;
canvas.addEventListener('pointerdown', function (e) { pd = { x: e.clientX, y: e.clientY, mx: 0, y0: yaw, p0: pitch }; canvas.setPointerCapture(e.pointerId); });
canvas.addEventListener('pointermove', function (e) {
  if (!pd || giro) return; var dx = e.clientX - pd.x, dy = e.clientY - pd.y; pd.mx = Math.max(pd.mx, Math.abs(dx) + Math.abs(dy));
  yaw = pd.y0 + dx * 0.005; pitch = Math.max(-1.2, Math.min(1.2, pd.p0 + dy * 0.005));
});
canvas.addEventListener('pointerup', function (e) {
  if (!pd) return; var mov = pd.mx; pd = null;
  if (estereo) { sairEstereo(); return; }
  if (mov < 6) {
    var r = canvas.getBoundingClientRect(), nx = ((e.clientX - r.left) / r.width) * 2 - 1, ny = -(((e.clientY - r.top) / r.height) * 2 - 1);
    ray.setFromCamera(new THREE.Vector2(nx, ny), cam); var o = achar(); if (o) { dwell = 0; espera = 0.9; o.userData.act(); }
  }
});

/* ---------- manter a tela acesa (o giroscópio não conta como toque) ---------- */
var trava = null;
async function acordar() {
  try { if ('wakeLock' in navigator && !trava) { trava = await navigator.wakeLock.request('screen'); trava.addEventListener('release', function () { trava = null; }); } } catch (e) { trava = null; }
}
document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible' && estado) acordar(); });

/* ---------- modos ---------- */
function esconderOv(s) { $('ov').style.display = s ? 'none' : 'flex'; }
function comecar() {
  if (!inicio) return;
  lista = CAT.itens.filter(function (x) { return x.s === inicio.s && x.m; }).sort(function (a, b) { return a.n - b.n; });
  pos = Math.max(0, lista.indexOf(inicio)); inicio = null; cinema();
}
$('bmono').onclick = function () { acordar(); destravarVoz(); esconderOv(true); ativarGiro().catch(function () {}); comecar(); };
$('bvr').onclick = async function () {
  acordar(); destravarVoz(); var ok = false; try { ok = await ativarGiro(); } catch (e) {}
  if (!ok) { $('msg').textContent = TX.gir; }
  estereo = true; esconderOv(true); document.body.classList.add('est'); recentrar(6); tVida = 0; fechaLer();
  var el = document.documentElement; if (el.requestFullscreen) el.requestFullscreen().catch(function () {});
  tamanho(); comecar();
};
function sairEstereo() {
  estereo = false; document.body.classList.remove('est'); esconderOv(false);
  if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(function () {});
  tamanho();
}
$('sair').onclick = sairEstereo;

/* ---------- laço ---------- */
var rel = new THREE.Clock(), dica = null;
function dicaInicio() {
  if (dica) { scene.remove(dica); dica = null; }
}
function laco() {
  requestAnimationFrame(laco);
  var dt = Math.min(rel.getDelta(), 0.1); tVida += dt;
  atualizarCabeca(dt);
  mm.visible = !estereo;
  if (CAT) mexer(dt);
  if (telaMesh && estado === 'cinema') {
    var U = telaMesh.material.uniforms;
    fade = Math.min(1, fade + dt / 1.2); U.fade.value = fade; U.k.value = CFG.prof;
    kb = Math.min(1, kb + dt / 120); U.sc.value = 1 - 0.1 * kb;
  }
  if (estereo) {
    renderer.autoClear = false; renderer.setRenderTarget(null); renderer.clear();
    var w = window.innerWidth, h = window.innerHeight;
    [[camL, rtL, 0], [camR, rtR, w / 2]].forEach(function (e) {
      renderer.setRenderTarget(e[1]); renderer.setViewport(0, 0, e[1].width / DPR, e[1].height / DPR); renderer.setScissorTest(false); renderer.clear(); renderer.render(scene, e[0]);
      renderer.setRenderTarget(null); renderer.setViewport(e[2], 0, w / 2, h); distMat.uniforms.t.value = e[1].texture; renderer.render(qScene, qCam);
    });
  } else {
    renderer.autoClear = true; renderer.setRenderTarget(null); renderer.setViewport(0, 0, window.innerWidth, window.innerHeight); renderer.render(scene, cam);
  }
}

/* ---------- início ---------- */
function carregarCat() {
  return new Promise(function (ok, erro) {
    var s = document.createElement('script'); s.src = '/g/catalogo-' + L + '.js'; s.onload = function () { ok(window.BT_CAT); }; s.onerror = erro; document.head.appendChild(s);
  });
}
var H = qs.get('h'), inicio = null;
carregarCat().then(function (c) {
  CAT = c; menu();
  if (H) for (var i = 0; i < c.itens.length; i++) if (c.itens[i].i === H && c.itens[i].m) { inicio = c.itens[i]; $('t1').textContent = inicio.t; break; }
}).catch(function () { $('msg').textContent = 'catálogo?'; });
window.__vr = { look: function (y, p) { yaw = y * Math.PI / 180; pitch = p * Math.PI / 180; }, estado: function () { return estado; }, reino: reinoCinema, menu: menu, estereo: function (v) { estereo = !!v; tamanho(); }, cfg: CFG };
requestAnimationFrame(laco);

window.addEventListener('pagehide', function () { pararVoz(); });
