/* Arcade das Sagas — efeitos e interações. Sem coleta de dados, sem rastreio. */
(function () {
  'use strict';
  var calmo = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hero = document.getElementById('ax-hero');
  if (!hero) return;

  /* ── Neve ── */
  var cv = hero.querySelector('.ax-neve'), cx = cv.getContext('2d'), fl = [], W = 0, H = 0, rodando = false, dpr = Math.min(2, window.devicePixelRatio || 1);
  function medir() {
    var r = hero.getBoundingClientRect(); W = r.width; H = r.height;
    cv.width = W * dpr; cv.height = H * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.round(Math.min(110, W / 11)); fl = [];
    for (var i = 0; i < n; i++) fl.push({ x: Math.random() * W, y: Math.random() * H, r: 0.7 + Math.random() * 1.9, v: 18 + Math.random() * 40, d: Math.random() * 6.28, s: 0.4 + Math.random() * 0.9 });
  }
  var ult = 0, vento = 0, alvoVento = 0;
  function quadro(t) {
    if (!rodando) return;
    var dt = Math.min(0.05, (t - ult) / 1000 || 0.016); ult = t; vento += (alvoVento - vento) * 0.04;
    cx.clearRect(0, 0, W, H);
    for (var i = 0; i < fl.length; i++) {
      var f = fl[i]; f.y += f.v * dt; f.d += dt * f.s; f.x += Math.sin(f.d) * 14 * dt + vento * dt * 30;
      if (f.y > H + 6) { f.y = -6; f.x = Math.random() * W; } if (f.x > W + 6) f.x = -6; if (f.x < -6) f.x = W + 6;
      cx.globalAlpha = 0.35 + f.r / 5; cx.fillStyle = '#fff'; cx.beginPath(); cx.arc(f.x, f.y, f.r, 0, 6.29); cx.fill();
    }
    requestAnimationFrame(quadro);
  }
  medir();
  if (!calmo) {
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        var vis = es[0].isIntersecting;
        if (vis && !rodando) { rodando = true; ult = performance.now(); requestAnimationFrame(quadro); } else if (!vis) rodando = false;
      }).observe(hero);
    } else { rodando = true; requestAnimationFrame(quadro); }
  } else { cx.fillStyle = '#fff'; fl.forEach(function (f) { cx.globalAlpha = 0.5; cx.beginPath(); cx.arc(f.x, f.y, f.r, 0, 6.29); cx.fill(); }); }
  var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(medir, 150); });

  /* ── Aurora e montanhas respondem ao ponteiro e à rolagem ── */
  var aur = hero.querySelector('.ax-aurora'), m3 = hero.querySelector('.ax-m3'), m2 = hero.querySelector('.ax-m2'), conteudo = hero.querySelector('.ax-hero-in'), lua = hero.querySelector('.ax-lua');
  if (!calmo) {
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      aur.style.transform = 'translate(' + (px * 40) + 'px,' + (py * 24) + 'px)'; lua.style.transform = 'translate(' + (px * -26) + 'px,' + (py * -16) + 'px)'; alvoVento = px * 4;
    });
    var raf = 0;
    window.addEventListener('scroll', function () {
      if (raf) return; raf = requestAnimationFrame(function () {
        raf = 0; var y = Math.min(window.scrollY, 900);
        m3.style.transform = 'translateY(' + (y * -0.06) + 'px)'; m2.style.transform = 'translateY(' + (y * -0.03) + 'px)';
        conteudo.style.transform = 'translateY(' + (y * 0.22) + 'px)'; conteudo.style.opacity = String(Math.max(0, 1 - y / 620));
      });
    }, { passive: true });
  }

  /* ── Contadores ── */
  var conta = hero.querySelectorAll('[data-conta]');
  Array.prototype.forEach.call(conta, function (b) {
    var alvo = parseInt(b.getAttribute('data-conta'), 10);
    if (calmo || !alvo) return; var t0 = performance.now(); b.textContent = '0';
    (function passo(t) { var p = Math.min(1, (t - t0) / 1400); b.textContent = String(Math.round(alvo * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(passo); })(t0);
  });

  /* ── Cartões: entrada, brilho e inclinação ── */
  var cards = Array.prototype.slice.call(document.querySelectorAll('.ax-card'));
  if ('IntersectionObserver' in window && !calmo) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('ax-in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    cards.forEach(function (c) { io.observe(c); });
  } else cards.forEach(function (c) { c.classList.add('ax-in'); });
  if (!calmo && window.matchMedia('(hover: hover)').matches) {
    cards.forEach(function (c) {
      c.addEventListener('pointermove', function (e) {
        var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.classList.add('ax-tilt'); c.style.setProperty('--mx', (x * 100) + '%'); c.style.setProperty('--my', (y * 100) + '%');
        c.style.transform = 'perspective(900px) rotateX(' + ((0.5 - y) * 9) + 'deg) rotateY(' + ((x - 0.5) * 11) + 'deg) translateY(-6px) scale(1.02)';
      });
      c.addEventListener('pointerleave', function () { c.style.transform = ''; c.classList.remove('ax-tilt'); });
    });
  }

  /* ── Filtros por reino ── */
  var chips = Array.prototype.slice.call(document.querySelectorAll('.ax-chip'));
  chips.forEach(function (ch) {
    ch.addEventListener('click', function () {
      var f = ch.getAttribute('data-filtro');
      chips.forEach(function (o) { var on = o === ch; o.classList.toggle('ax-ativo', on); o.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      var k = 0;
      cards.forEach(function (c) {
        var mostra = f === 'todos' || c.getAttribute('data-reino') === f; c.hidden = !mostra;
        if (mostra) { c.classList.remove('ax-in'); void c.offsetWidth; c.style.setProperty('--i', k++); c.classList.add('ax-in'); }
      });
    });
  });

  /* ── Sortear uma aventura ── */
  var bt = document.getElementById('ax-sorteio'), ocupado = false;
  if (bt) bt.addEventListener('click', function () {
    if (ocupado) return; ocupado = true;
    var lista = cards.filter(function (c) { return !c.hidden; }); if (!lista.length) { ocupado = false; return; }
    var alvo = lista[Math.floor(Math.random() * lista.length)], rotulo = bt.innerHTML;
    bt.innerHTML = '<span class="ax-dado" aria-hidden="true">🎲</span> ' + bt.getAttribute('data-sorteando');
    document.getElementById('ax-grade').scrollIntoView({ behavior: calmo ? 'auto' : 'smooth', block: 'start' });
    var i = 0, passos = calmo ? 1 : 16 + Math.floor(Math.random() * 6), ant = null;
    (function gira() {
      if (ant) ant.classList.remove('ax-sorte');
      if (i >= passos) {
        alvo.classList.add('ax-sorteado'); alvo.classList.add('ax-in');
        setTimeout(function () { window.location.href = alvo.getAttribute('href'); }, calmo ? 200 : 1100);
        setTimeout(function () { alvo.classList.remove('ax-sorteado'); bt.innerHTML = rotulo; ocupado = false; }, 4000);
        return;
      }
      var c = lista[i % lista.length]; if (i > passos - 3) c = alvo; c.classList.add('ax-sorte'); c.classList.add('ax-in'); ant = c; i++;
      setTimeout(gira, 70 + i * i * 1.3);
    })();
  });
})();
