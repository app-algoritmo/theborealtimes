/* Portal das Sagas — efeitos da página inicial. Sem coleta de dados, sem rastreio. */
(function () {
  'use strict';
  var calmo = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hero = document.getElementById('pt-hero');
  if (!hero) return;

  /* Neve */
  var cv = hero.querySelector('.pt-neve'), cx = cv.getContext('2d'), fl = [], W = 0, H = 0, rodando = false, ult = 0, dpr = Math.min(2, window.devicePixelRatio || 1);
  function medir() {
    var r = hero.getBoundingClientRect(); W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.round(Math.min(90, W / 13)); fl = [];
    for (var i = 0; i < n; i++) fl.push({ x: Math.random() * W, y: Math.random() * H, r: 0.7 + Math.random() * 1.9, v: 18 + Math.random() * 38, d: Math.random() * 6.28, s: 0.4 + Math.random() * 0.9 });
  }
  function quadro(t) {
    if (!rodando) return; var dt = Math.min(0.05, (t - ult) / 1000 || 0.016); ult = t; cx.clearRect(0, 0, W, H);
    for (var i = 0; i < fl.length; i++) {
      var f = fl[i]; f.y += f.v * dt; f.d += dt * f.s; f.x += Math.sin(f.d) * 14 * dt;
      if (f.y > H + 6) { f.y = -6; f.x = Math.random() * W; }
      cx.globalAlpha = 0.3 + f.r / 5; cx.fillStyle = '#fff'; cx.beginPath(); cx.arc(f.x, f.y, f.r, 0, 6.29); cx.fill();
    }
    requestAnimationFrame(quadro);
  }
  medir();
  if (!calmo && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      var v = es[0].isIntersecting; if (v && !rodando) { rodando = true; ult = performance.now(); requestAnimationFrame(quadro); } else if (!v) rodando = false;
    }).observe(hero);
  }
  var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(medir, 150); });

  /* Imagem com paralaxe suave */
  var foto = hero.querySelector('.pt-foto'), aur = hero.querySelector('.pt-aurora');
  if (!calmo) {
    var raf = 0;
    window.addEventListener('scroll', function () {
      if (raf) return; raf = requestAnimationFrame(function () { raf = 0; var y = Math.min(window.scrollY, 900); foto.style.transform = 'translateY(' + (y * 0.18) + 'px)'; });
    }, { passive: true });
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect(); aur.style.transform = 'translate(' + (((e.clientX - r.left) / r.width - 0.5) * 50) + 'px,' + (((e.clientY - r.top) / r.height - 0.5) * 26) + 'px)';
    });
  }

  /* Você sabia? */
  var fatos = Array.prototype.slice.call(document.querySelectorAll('.pt-fato'));
  if (fatos.length > 1) {
    var k = 0, pausa = false, lista = document.querySelector('.pt-sabia-lista');
    lista.addEventListener('pointerenter', function () { pausa = true; }); lista.addEventListener('pointerleave', function () { pausa = false; });
    setInterval(function () { if (pausa || document.hidden) return; fatos[k].classList.remove('pt-fato-on'); k = (k + 1) % fatos.length; fatos[k].classList.add('pt-fato-on'); }, 6500);
  }

  /* Entrada ao rolar e inclinação dos cartões */
  var rev = Array.prototype.slice.call(document.querySelectorAll('.pt-rev'));
  if ('IntersectionObserver' in window && !calmo) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('pt-in'); io.unobserve(e.target); } }); }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    rev.forEach(function (c) { io.observe(c); });
  } else rev.forEach(function (c) { c.classList.add('pt-in'); });
  if (!calmo && window.matchMedia('(hover: hover)').matches) {
    Array.prototype.forEach.call(document.querySelectorAll('.pt-card,.pt-reino'), function (c) {
      c.addEventListener('pointermove', function (e) {
        var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.classList.add('pt-tilt'); c.style.transform = 'perspective(900px) rotateX(' + ((0.5 - y) * 7) + 'deg) rotateY(' + ((x - 0.5) * 9) + 'deg) translateY(-8px)';
      });
      c.addEventListener('pointerleave', function () { c.style.transform = ''; c.classList.remove('pt-tilt'); });
    });
  }

  /* Surpreenda-me: abre uma história ao acaso */
  var bt = document.getElementById('pt-surpresa');
  if (bt) bt.addEventListener('click', function () {
    var urls = []; try { urls = JSON.parse(bt.getAttribute('data-urls') || '[]'); } catch (e) {}
    if (!urls.length) return; var d = bt.querySelector('.pt-dado'); if (d) d.style.transform = 'rotate(720deg) scale(1.4)';
    setTimeout(function () { window.location.href = urls[Math.floor(Math.random() * urls.length)]; }, calmo ? 0 : 650);
  });
})();
