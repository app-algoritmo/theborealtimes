/* Salão Boreal VR — Boreal Saga Play.
   Protótipo: um salão 3D com os quatro reinos e as figurinhas em 3D.
   Funciona em tela comum (arrastar), com giroscópio e em óculos de celular (modo estéreo,
   com correção de lente). A escolha é feita só com o olhar: mire o ponto no centro e espere. */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

var $ = function (id) { return document.getElementById(id); };
var qs = new URLSearchParams(location.search);
var L = (qs.get('l') || (navigator.language || 'pt').slice(0, 2)).toLowerCase();
if (L === 'nb' || L === 'nn') L = 'no';
if (['pt', 'en', 'no', 'es'].indexOf(L) < 0) L = 'en';
document.documentElement.lang = L;

var TXT = {
  pt: { titulo: 'Salão Boreal', intro: 'Um salão viking em 3D com as figurinhas do Boreal Saga Play. Escolha com o olhar: mire o ponto no centro e espere.',
    vr: 'Modo óculos (VR)', mono: 'Explorar na tela (arraste)', aviso: 'No modo óculos: gire o celular para horizontal, encaixe no óculos e olhe para a frente. Para sair, tire o celular e toque na tela.',
    ajuste: 'Ajuste das lentes', k1: 'Lentes k1', k2: 'Lentes k2', ipd: 'Olhos (cm)', fov: 'Campo de visão', padrao: 'Valores padrão', sair: 'Sair',
    reinos: ['Mitos e Deuses', 'Sagas e Reis', 'Era Viking', 'Contos e Folclore'], rar: ['Comum', 'Rara', 'Épica', 'Lendária'],
    fig: 'Figurinha', voltar: 'Voltar', salao: 'Salão', mais: 'Mais ▶', antes: '◀ Antes', prox: 'Próxima ▶', ant: '◀ Anterior', pag: 'Página', hist: 'histórias',
    olhe: 'Olhe para a frente. O salão se ajusta em', gir: 'Sem giroscópio neste aparelho.', ler: 'Ler a história no site' },
  en: { titulo: 'Boreal Hall', intro: 'A 3D Viking hall with the Boreal Saga Play stickers. Choose with your gaze: aim the dot at the centre and wait.',
    vr: 'Headset mode (VR)', mono: 'Explore on screen (drag)', aviso: 'In headset mode: turn the phone to landscape, slot it into the headset and look straight ahead. To exit, take the phone out and tap the screen.',
    ajuste: 'Lens settings', k1: 'Lens k1', k2: 'Lens k2', ipd: 'Eyes (cm)', fov: 'Field of view', padrao: 'Default values', sair: 'Exit',
    reinos: ['Myths & Gods', 'Sagas & Kings', 'Viking Age', 'Tales & Folklore'], rar: ['Common', 'Rare', 'Epic', 'Legendary'],
    fig: 'Sticker', voltar: 'Back', salao: 'Hall', mais: 'More ▶', antes: '◀ Previous', prox: 'Next ▶', ant: '◀ Previous', pag: 'Page', hist: 'stories',
    olhe: 'Look straight ahead. The hall adjusts in', gir: 'No gyroscope on this device.', ler: 'Read the story on the site' },
  no: { titulo: 'Boreal-salen', intro: 'En viking-sal i 3D med klistremerkene fra Boreal Saga Play. Velg med blikket: sikt prikken mot midten og vent.',
    vr: 'Brillemodus (VR)', mono: 'Utforsk på skjermen (dra)', aviso: 'I brillemodus: vri telefonen til liggende, sett den i brillen og se rett frem. For å avslutte tar du ut telefonen og trykker på skjermen.',
    ajuste: 'Linseinnstillinger', k1: 'Linse k1', k2: 'Linse k2', ipd: 'Øyne (cm)', fov: 'Synsfelt', padrao: 'Standardverdier', sair: 'Avslutt',
    reinos: ['Myter og guder', 'Sagaer og konger', 'Vikingtid', 'Eventyr og folketro'], rar: ['Vanlig', 'Sjelden', 'Episk', 'Legendarisk'],
    fig: 'Klistremerke', voltar: 'Tilbake', salao: 'Salen', mais: 'Flere ▶', antes: '◀ Forrige', prox: 'Neste ▶', ant: '◀ Forrige', pag: 'Side', hist: 'historier',
    olhe: 'Se rett frem. Salen justeres om', gir: 'Ingen gyroskop på denne enheten.', ler: 'Les historien på nettstedet' },
  es: { titulo: 'Salón Boreal', intro: 'Un salón vikingo en 3D con los cromos de Boreal Saga Play. Elige con la mirada: apunta el punto al centro y espera.',
    vr: 'Modo gafas (VR)', mono: 'Explorar en pantalla (arrastra)', aviso: 'En modo gafas: gira el móvil a horizontal, colócalo en las gafas y mira al frente. Para salir, saca el móvil y toca la pantalla.',
    ajuste: 'Ajuste de las lentes', k1: 'Lentes k1', k2: 'Lentes k2', ipd: 'Ojos (cm)', fov: 'Campo de visión', padrao: 'Valores por defecto', sair: 'Salir',
    reinos: ['Mitos y Dioses', 'Sagas y Reyes', 'Era Vikinga', 'Cuentos y Folclore'], rar: ['Común', 'Rara', 'Épica', 'Legendaria'],
    fig: 'Cromo', voltar: 'Volver', salao: 'Salón', mais: 'Más ▶', antes: '◀ Antes', prox: 'Siguiente ▶', ant: '◀ Anterior', pag: 'Página', hist: 'historias',
    olhe: 'Mira al frente. El salón se ajusta en', gir: 'Este dispositivo no tiene giroscopio.', ler: 'Leer la historia en el sitio' }
};
var TX = TXT[L];
$('t1').textContent = TX.titulo; $('t2').textContent = TX.intro; $('bvr').textContent = TX.vr; $('bmono').textContent = TX.mono;
$('t3').textContent = TX.aviso; $('tadj').textContent = TX.ajuste; $('l1').textContent = TX.k1; $('l2').textContent = TX.k2;
$('l3').textContent = TX.ipd; $('l4').textContent = TX.fov; $('breset').textContent = TX.padrao; $('sair').textContent = TX.sair;
document.title = TX.titulo + ' VR · Boreal Saga Play';

/* ---------- ajustes das lentes (guardados no aparelho) ---------- */
var DEF = { k1: 0.34, k2: 0.55, ipd: 6.4, fov: 90 }, CFG = Object.assign({}, DEF);
try { Object.assign(CFG, JSON.parse(localStorage.getItem('btvr') || '{}')); } catch (e) {}
['k1', 'k2'].forEach(function (k) { if (qs.has(k)) CFG[k] = parseFloat(qs.get(k)); });
function salvarCfg() { try { localStorage.setItem('btvr', JSON.stringify(CFG)); } catch (e) {} }
function sliders() { ['k1', 'k2', 'ipd', 'fov'].forEach(function (k, i) { $(k).value = CFG[k]; $('o' + (i + 1)).textContent = CFG[k]; }); }
['k1', 'k2', 'ipd', 'fov'].forEach(function (k) {
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
  var gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, '#05030d'); gr.addColorStop(0.55, '#1b0f38'); gr.addColorStop(0.8, '#3b1f63'); gr.addColorStop(1, '#0b0618');
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

/* ---------- navegação ---------- */
var CAT = null, dyn = new THREE.Group(); scene.add(dyn);
var alvos = [], estado = 'salao', ctx = {}, loader = new GLTFLoader();
function limpar() {
  alvos = [];
  dyn.traverse(function (o) {
    if (o.geometry) o.geometry.dispose();
    if (o.material) { var ms = Array.isArray(o.material) ? o.material : [o.material]; ms.forEach(function (m) { if (m.map) m.map.dispose(); m.dispose(); }); }
  });
  while (dyn.children.length) dyn.remove(dyn.children[0]);
}
function acao(o, f) { o.userData.act = f; alvos.push(o); return o; }
function tituloTopo(txt) { var t = legenda(txt, 3.4, 0.6, 62); dyn.add(colocar(t, 0, 3.55, 3.6)); }

function salao() {
  estado = 'salao'; limpar(); fechaLer();
  tituloTopo(TX.titulo);
  var azs = [-66, -22, 22, 66];
  for (var s = 0; s < 4; s++) (function (s) {
    var g = new THREE.Group(), W = 2.3, H = W * 9 / 16;
    var moldura = new THREE.Mesh(new THREE.PlaneGeometry(W + 0.16, H + 0.16), new THREE.MeshBasicMaterial({ color: 0xf0c15a }));
    moldura.position.z = -0.004; g.add(moldura);
    var arte = new THREE.Mesh(new THREE.PlaneGeometry(W, H), new THREE.MeshBasicMaterial({ color: 0x2a1a50 }));
    g.add(arte);
    var u = (CAT.fundos && CAT.fundos[s]) || '';
    if (u) new THREE.TextureLoader().load(u, function (t) { t.colorSpace = THREE.SRGBColorSpace; arte.material.map = t; arte.material.color.set(0xffffff); arte.material.needsUpdate = true; });
    var n = CAT.itens.filter(function (x) { return x.s === s && x.ar; }).length;
    var rot = legenda(TX.reinos[s] + ' · ' + n, W + 0.1, 0.34, 54); rot.position.set(0, -H / 2 - 0.3, 0.01); g.add(rot);
    colocar(g, azs[s], 1.75, 4.2); acao(arte, function () { reino(s, 0); }); arte.userData.grupo = g;
    dyn.add(g);
  })(s);
}

function fechaLer() {}
function reino(s, pag) {
  estado = 'reino'; limpar();
  var lista = CAT.itens.filter(function (x) { return x.s === s && x.ar; }), POR = 24, npag = Math.max(1, Math.ceil(lista.length / POR));
  pag = Math.max(0, Math.min(npag - 1, pag)); ctx = { s: s, pag: pag, lista: lista, POR: POR };
  tituloTopo(TX.reinos[s] + ' · ' + TX.pag + ' ' + (pag + 1) + '/' + npag);
  var b = botao(TX.salao, 1.1, 0.32); dyn.add(colocar(b, 0, 0.32, 2.6)); acao(b, salao);
  if (pag > 0) { var a = botao(TX.antes, 1.1, 0.32); dyn.add(colocar(a, -30, 0.32, 2.6)); acao(a, function () { reino(s, pag - 1); }); }
  if (pag < npag - 1) { var p = botao(TX.mais, 1.1, 0.32); dyn.add(colocar(p, 30, 0.32, 2.6)); acao(p, function () { reino(s, pag + 1); }); }
  var fatia = lista.slice(pag * POR, pag * POR + POR), COL = 8;
  fatia.forEach(function (x, i) {
    var col = i % COL, lin = Math.floor(i / COL), az = -98 + col * (196 / (COL - 1)), y = 2.45 - lin * 0.82;
    loader.load('/g/ar/' + x.i + '.glb', function (gl) {
      if (estado !== 'reino' || ctx.s !== s || ctx.pag !== pag) return;
      var m = gl.scene; m.traverse(function (o) { if (o.isMesh && o.material && o.material.name === 'pedra') o.visible = false; });
      m.position.y = -0.1; m.scale.setScalar(2.3);
      var h = new THREE.Group(); h.add(m); colocar(h, az, y, 3.4); h.userData.idx = pag * POR + i;
      dyn.add(h); acao(h, function () { carta(h.userData.idx); });
    }, undefined, function () {});
  });
}

function carta(idx) {
  estado = 'carta'; limpar(); var x = ctx.lista[idx]; ctx.idx = idx;
  loader.load('/g/ar/' + x.i + '.glb', function (gl) {
    if (estado !== 'carta' || ctx.idx !== idx) return;
    var m = gl.scene; m.traverse(function (o) { if (o.isMesh && o.material && o.material.name === 'pedra') o.visible = false; });
    m.position.y = -0.1; m.scale.setScalar(3.2);
    var h = new THREE.Group(); h.add(m); h.position.set(-1.05, EYE + 0.15, -2.0); dyn.add(h);
    h.userData.gira = true; ctx.holder = h;
  });
  var info = painel(1.5, 1.23, 1000, 820, function (g, w, h) {
    fundoArr(g, w, h, 30);
    g.fillStyle = '#f0c15a'; g.font = '600 38px system-ui,sans-serif'; g.textBaseline = 'alphabetic'; g.textAlign = 'left';
    g.fillText(TX.fig + ' ' + String(x.n).padStart(3, '0') + ' / ' + CAT.total + ' · ' + TX.rar[x.q], 40, 66);
    g.fillStyle = '#b9a8ff'; g.font = '34px system-ui,sans-serif'; g.fillText(TX.reinos[x.s], 40, 112);
    g.fillStyle = '#fff'; g.font = 'bold 50px Georgia,serif'; var n = quebra(g, x.t, 40, 176, w - 80, 58, 3);
    g.fillStyle = '#e6defa'; g.font = '40px system-ui,sans-serif'; quebra(g, x.r, 40, 176 + n * 58 + 30, w - 80, 52, 8);
  });
  info.position.set(0.85, EYE + 0.05, -2.0); dyn.add(info);
  var vb = botao(TX.voltar, 0.9, 0.28); dyn.add(colocar(vb, 0, 0.62, 2.1)); acao(vb, function () { reino(ctx.s, ctx.pag); });
  var ab = botao(TX.ant, 0.9, 0.28); dyn.add(colocar(ab, -26, 0.62, 2.1)); acao(ab, function () { carta((idx - 1 + ctx.lista.length) % ctx.lista.length); });
  var pb = botao(TX.prox, 0.9, 0.28); dyn.add(colocar(pb, 26, 0.62, 2.1)); acao(pb, function () { carta((idx + 1) % ctx.lista.length); });
  mostrarLer(x.u);
}
var lerEl = null;
function mostrarLer(u) {
  if (!lerEl) { lerEl = document.createElement('a'); lerEl.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);bottom:40px;z-index:4;padding:.6rem 1rem;border-radius:12px;background:linear-gradient(135deg,#f0c15a,#e0883a);color:#1b1230;font-weight:600;text-decoration:none;font-size:.95rem'; document.body.appendChild(lerEl); }
  lerEl.textContent = TX.ler; lerEl.href = u; lerEl.style.display = estereo ? 'none' : 'block';
}
fechaLer = function () { if (lerEl) lerEl.style.display = 'none'; };

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
  alvos.forEach(function (a) { var g = a.userData.grupo || a; var alvo = (a === alvoAtual) ? 1.06 : 1; g.scale.lerp(new THREE.Vector3(alvo, alvo, alvo), 0.2); });
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

/* ---------- modos ---------- */
function esconderOv(s) { $('ov').style.display = s ? 'none' : 'flex'; }
$('bmono').onclick = function () { esconderOv(true); ativarGiro().catch(function () {}); };
$('bvr').onclick = async function () {
  var ok = false; try { ok = await ativarGiro(); } catch (e) {}
  if (!ok) { $('msg').textContent = TX.gir; }
  estereo = true; esconderOv(true); document.body.classList.add('est'); recentrar(6); tVida = 0; fechaLer();
  var el = document.documentElement; if (el.requestFullscreen) el.requestFullscreen().catch(function () {});
  tamanho();
};
function sairEstereo() {
  estereo = false; document.body.classList.remove('est'); esconderOv(false);
  if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(function () {});
  if (estado === 'carta' && ctx.lista) mostrarLer(ctx.lista[ctx.idx].u);
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
  if (ctx.holder && estado === 'carta') ctx.holder.rotation.y = Math.sin(tVida * 0.8) * 0.35;
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
carregarCat().then(function (c) { CAT = c; salao(); }).catch(function () { $('msg').textContent = 'catálogo?'; });
window.__vr = { look: function (y, p) { yaw = y * Math.PI / 180; pitch = p * Math.PI / 180; }, estado: function () { return estado; }, reino: reino, carta: carta, salao: salao, estereo: function (v) { estereo = !!v; tamanho(); }, cfg: CFG };
requestAnimationFrame(laco);
