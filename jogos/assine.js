/* Assinatura: envia o formulário, mostra o estado e desenha a neve. Sem dependências. */
(function () {
  var raiz = document.getElementById('as'); if (!raiz) return;
  var M = window.AS_MSG || {}, ep = raiz.getAttribute('data-endpoint') || '';
  var $ = function (i) { return document.getElementById(i); };
  var form = $('as-form'), erro = $('as-erro'), botao = $('as-botao'), t0 = Date.now();
  var estados = ['ok', 'confirmado', 'expirado', 'cancelado', 'cancelar'];

  function mostrar(qual) {
    form.hidden = qual !== null;
    estados.forEach(function (e) { var el = $('as-' + e); if (el) el.hidden = e !== qual; });
    var alvo = qual && $('as-' + qual); if (alvo) { alvo.setAttribute('tabindex', '-1'); alvo.focus({ preventScroll: true }); }
  }
  function falha(msg) { erro.textContent = msg; erro.hidden = false; }
  function livre() { botao.disabled = false; botao.textContent = botao.getAttribute('data-rotulo'); }

  /* Retorno dos links do e-mail: ?status=confirmado|expirado|cancelado ou ?cancelar=TOKEN */
  var q = new URLSearchParams(location.search), st = q.get('status'), tk = q.get('cancelar');
  if (st === 'pendente') st = 'ok';
  if (st && estados.indexOf(st) > -1 && st !== 'cancelar') mostrar(st);
  else if (tk && /^[a-f0-9]{64}$/.test(tk)) {
    mostrar('cancelar');
    var cb = $('as-cancelar-botao'), rot = cb.textContent;
    cb.addEventListener('click', function () {
      cb.disabled = true; cb.textContent = cb.getAttribute('data-enviando');
      var d = new FormData(); d.append('token', tk); d.append('via', 'js');
      fetch(ep.replace('inscrever.php', 'cancelar.php'), { method: 'POST', body: d })
        .then(function (r) { return r.json(); })
        .then(function (j) { mostrar(j && j.ok ? 'cancelado' : 'expirado'); })
        .catch(function () { cb.disabled = false; cb.textContent = rot; });
    });
  }

  botao.setAttribute('data-rotulo', botao.textContent);
  form.addEventListener('submit', function (ev) {
    ev.preventDefault(); erro.hidden = true;
    var email = form.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { falha(M.email); form.email.focus(); return; }
    if (!form.consentimento.checked) { falha(M.aceite); return; }
    $('as-t').value = Date.now() - t0;
    var d = new FormData(form); d.append('via', 'js');
    botao.disabled = true; botao.textContent = botao.getAttribute('data-enviando');
    fetch(ep, { method: 'POST', body: d })
      .then(function (r) { return r.json().then(function (j) { return { s: r.status, j: j }; }); })
      .then(function (r) {
        if (r.j && r.j.ok) { mostrar('ok'); return; }
        var c = r.j && r.j.erro; falha(c === 'email' ? M.email : c === 'aceite' ? M.aceite : M.geral); livre();
      })
      .catch(function () { falha(M.geral); livre(); });
  });

  /* Neve */
  var cv = $('as-neve'), hero = raiz.querySelector('.as-hero');
  if (!cv || !cv.getContext) return;
  var cx = cv.getContext('2d'), W = 0, H = 0, fl = [], dpr = Math.min(2, window.devicePixelRatio || 1), rod = false, ult = 0;
  var calmo = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function medir() {
    var r = hero.getBoundingClientRect(); W = r.width; H = r.height;
    cv.width = W * dpr; cv.height = H * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    fl = []; for (var i = 0, n = Math.round(Math.min(100, W / 11)); i < n; i++)
      fl.push({ x: Math.random() * W, y: Math.random() * H, r: .7 + Math.random() * 1.9, v: 18 + Math.random() * 40, d: Math.random() * 6.28, s: .4 + Math.random() * .9 });
  }
  function quadro(t) {
    if (!rod) return;
    var dt = Math.min(.05, (t - ult) / 1000 || .016); ult = t; cx.clearRect(0, 0, W, H);
    fl.forEach(function (f) {
      f.y += f.v * dt; f.d += dt * f.s; f.x += Math.sin(f.d) * 14 * dt;
      if (f.y > H + 6) { f.y = -6; f.x = Math.random() * W; }
      cx.globalAlpha = .35 + f.r / 5; cx.fillStyle = '#fff'; cx.beginPath(); cx.arc(f.x, f.y, f.r, 0, 6.29); cx.fill();
    });
    requestAnimationFrame(quadro);
  }
  medir();
  if (calmo) { cx.fillStyle = '#fff'; fl.forEach(function (f) { cx.globalAlpha = .5; cx.beginPath(); cx.arc(f.x, f.y, f.r, 0, 6.29); cx.fill(); }); }
  else if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { if (es[0].isIntersecting && !rod) { rod = true; ult = performance.now(); requestAnimationFrame(quadro); } else if (!es[0].isIntersecting) rod = false; }).observe(hero);
  } else { rod = true; requestAnimationFrame(quadro); }
  var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(medir, 150); });
})();
