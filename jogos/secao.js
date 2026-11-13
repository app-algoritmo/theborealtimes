/* Páginas de reino — atmosfera e entrada ao rolar */
(function () {
  var raiz = document.getElementById('sc');
  if (!raiz) return;
  var calmo = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  var revs = [].slice.call(raiz.querySelectorAll('.sc-rev'));
  if ('IntersectionObserver' in window && !calmo) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('sc-in'); io.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    revs.forEach(function (r) { io.observe(r); });
  } else { revs.forEach(function (r) { r.classList.add('sc-in'); }); }

  var cv = raiz.querySelector('.sc-fx');
  if (!cv || !cv.getContext) return;
  var fx = raiz.getAttribute('data-fx');
  var g = cv.getContext('2d'), W = 0, H = 0, dpr = 1, ps = [], vivo = false, raf = 0;
  var cor = { mitos: '255,222,140', sagas: '255,138,70', viking: '200,244,255', contos: '190,255,130' }[fx] || '255,255,255';

  function novo(ini) {
    var p = { x: Math.random() * W, y: Math.random() * H, r: 0.6 + Math.random() * 1.8, v: 0.3 + Math.random() * 0.9, f: Math.random() * 6.28, s: 0.5 + Math.random() };
    if (fx === 'sagas') { p.y = ini ? p.y : H + 10; p.r = 0.8 + Math.random() * 2.2; p.v = 0.5 + Math.random() * 1.4; }
    if (fx === 'viking') { p.y = ini ? p.y : -10; p.x = Math.random() * (W + 200); p.v = 0.8 + Math.random() * 1.6; }
    if (fx === 'contos') { p.r = 1.6 + Math.random() * 2.2; p.v = 0.25 + Math.random() * 0.4; p.a = Math.random() * 6.28; }
    return p;
  }
  function medir() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.round(Math.min(110, Math.max(36, W / 11)));
    if (fx === 'contos') n = Math.round(n / 2.2);
    ps = []; for (var i = 0; i < n; i++) ps.push(novo(true));
  }
  function quadro(t) {
    g.clearRect(0, 0, W, H);
    for (var i = 0; i < ps.length; i++) {
      var p = ps[i], a;
      if (fx === 'mitos') {
        p.y -= p.v * 0.18; p.x += Math.sin(t / 1800 + p.f) * 0.2;
        if (p.y < -5) p.y = H + 5;
        a = 0.35 + 0.65 * Math.abs(Math.sin(t / 900 * p.s + p.f));
      } else if (fx === 'sagas') {
        p.y -= p.v; p.x += Math.sin(t / 700 + p.f) * 0.7;
        if (p.y < -10) { ps[i] = p = novo(false); }
        a = Math.max(0, Math.min(1, p.y / H * 1.3)) * (0.5 + 0.5 * Math.sin(t / 150 + p.f));
      } else if (fx === 'viking') {
        p.y += p.v; p.x -= p.v * 0.9;
        if (p.y > H + 10 || p.x < -10) { ps[i] = p = novo(false); }
        a = 0.55;
      } else {
        p.a += 0.012; p.x += Math.cos(p.a) * p.v * 1.3; p.y += Math.sin(p.a * 1.3) * p.v;
        if (p.x < -10) p.x = W + 10; if (p.x > W + 10) p.x = -10; if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        a = Math.pow(0.5 + 0.5 * Math.sin(t / 600 * p.s + p.f), 2);
      }
      g.beginPath();
      if (fx === 'contos' || fx === 'sagas') {
        var gr = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
        gr.addColorStop(0, 'rgba(' + cor + ',' + a + ')'); gr.addColorStop(1, 'rgba(' + cor + ',0)');
        g.fillStyle = gr; g.arc(p.x, p.y, p.r * 5, 0, 6.283);
      } else { g.fillStyle = 'rgba(' + cor + ',' + a + ')'; g.arc(p.x, p.y, p.r, 0, 6.283); }
      g.fill();
    }
  }
  function laco(t) { if (!vivo) return; quadro(t); raf = requestAnimationFrame(laco); }

  medir();
  if (calmo) { quadro(1000); }
  else if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      vivo = es[0].isIntersecting;
      if (vivo) { cancelAnimationFrame(raf); raf = requestAnimationFrame(laco); }
    }).observe(cv);
  } else { vivo = true; raf = requestAnimationFrame(laco); }
  var tm; window.addEventListener('resize', function () { clearTimeout(tm); tm = setTimeout(medir, 200); });
})();
