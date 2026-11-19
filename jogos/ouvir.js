/* Botão "Ouvir": lê a matéria em voz alta com a voz do próprio aparelho.
   Sem arquivos, sem cookies, sem enviar nada a ninguém. */
(function () {
  'use strict';
  var box = document.querySelector('.ouvir');
  var S = window.speechSynthesis;
  if (!box || !S || typeof SpeechSynthesisUtterance === 'undefined') return;
  var lang = box.getAttribute('data-lang') || 'pt-BR', pref = lang.slice(0, 2).toLowerCase();
  var btn = box.querySelector('.ouvir-tocar'), rot = box.querySelector('.ouvir-rot'), stop = box.querySelector('.ouvir-parar');
  var L = { ouvir: box.getAttribute('data-ouvir'), pausar: box.getAttribute('data-pausar'), continuar: box.getAttribute('data-continuar') };
  var chunks = [], i = 0, estado = 'parado', voz = null;

  function montar() {
    var out = [], h1 = document.querySelector('.cabeca-materia h1'), lf = document.querySelector('.linha-fina');
    if (h1) out.push(h1.textContent.trim() + '.');
    if (lf) out.push(lf.textContent.trim());
    var t = document.querySelector('.texto');
    if (t) t.querySelectorAll('h2,p').forEach(function (n) { var s = n.textContent.replace(/\s+/g, ' ').trim(); if (s) out.push(s); });
    var res = [];
    out.forEach(function (p) {
      var frases = p.match(/[^.!?]+[.!?]+["”»)]*\s*|[^.!?]+$/g) || [p], atual = '';
      frases.forEach(function (f) {
        if ((atual + f).length > 220 && atual) { res.push(atual.trim()); atual = ''; }
        atual += f;
      });
      if (atual.trim()) res.push(atual.trim());
    });
    return res;
  }
  function escolherVoz() {
    var v = S.getVoices() || [], k, melhor = null;
    for (k = 0; k < v.length; k++) {
      var vl = (v[k].lang || '').replace('_', '-').toLowerCase();
      if (vl.indexOf(pref) !== 0 && !(pref === 'nb' && vl.indexOf('no') === 0)) continue;
      if (vl === lang.toLowerCase()) { if (!melhor || v[k].localService === false || /natural|online|premium|enhanced/i.test(v[k].name)) melhor = v[k]; }
      else if (!melhor) melhor = v[k];
    }
    voz = melhor;
  }
  function rotulo() {
    rot.textContent = estado === 'tocando' ? L.pausar : estado === 'pausado' ? L.continuar : L.ouvir;
    btn.setAttribute('aria-pressed', estado === 'tocando' ? 'true' : 'false');
    stop.hidden = estado === 'parado';
  }
  /* Fala um trecho por vez: cada trecho só começa quando o anterior termina. Nos celulares,
     uma fila longa de falas costuma parar depois da primeira. Se o aparelho não avisar o fim
     de uma fala, um relógio passa para a próxima quando a voz realmente silencia. */
  var relogio = null, ficha = 0, ref = null;
  function proximo(n, f) {
    if (f !== ficha || estado !== 'tocando') return;
    if (n >= chunks.length) { estado = 'parado'; i = 0; rotulo(); return; }
    i = n;
    var u = new SpeechSynthesisUtterance(chunks[n]), feito = false;
    u.lang = lang; if (voz) u.voice = voz; u.rate = 0.95;
    function avancar() {
      if (feito) return; feito = true; clearInterval(relogio);
      if (f === ficha && estado === 'tocando') proximo(n + 1, f);
    }
    u.onend = avancar;
    u.onerror = function (e) { if (e && (e.error === 'canceled' || e.error === 'interrupted')) return; avancar(); };
    ref = u; S.speak(u);
    var ini = Date.now(), previsto = 4000 + chunks[n].length * 110;
    clearInterval(relogio);
    relogio = setInterval(function () {
      if (feito || f !== ficha) { clearInterval(relogio); return; }
      var t = Date.now() - ini;
      if ((t > 1500 && !S.speaking && !S.pending) || t > previsto * 3) avancar();
    }, 400);
  }
  function tocar() { ficha++; var f = ficha; S.cancel(); estado = 'tocando'; rotulo(); setTimeout(function () { proximo(i, f); }, 150); }
  function pausar() { ficha++; estado = 'pausado'; clearInterval(relogio); S.cancel(); rotulo(); }
  function parar() { ficha++; estado = 'parado'; i = 0; clearInterval(relogio); S.cancel(); rotulo(); }

  btn.addEventListener('click', function () {
    if (estado === 'parado') { chunks = montar(); i = 0; escolherVoz(); tocar(); }
    else if (estado === 'tocando') pausar();
    else { escolherVoz(); tocar(); }
  });
  stop.addEventListener('click', parar);
  window.addEventListener('pagehide', function () { S.cancel(); });
  if (S.onvoiceschanged !== undefined) S.onvoiceschanged = escolherVoz;
  box.hidden = false; rotulo();
})();
