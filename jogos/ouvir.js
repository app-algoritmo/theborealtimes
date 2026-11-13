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
  var refs = [], relogio = null;
  /* Coloca todos os trechos na fila de uma vez, a partir de `de`. Funciona mesmo quando o
     navegador (Edge no celular, por exemplo) não avisa o fim de cada fala. */
  function falar(de) {
    refs = [];
    for (var k = de; k < chunks.length; k++) (function (n) {
      var u = new SpeechSynthesisUtterance(chunks[n]);
      u.lang = lang; if (voz) u.voice = voz; u.rate = 0.95;
      u.onstart = function () { if (estado === 'tocando') i = n; };
      u.onend = function () { if (estado === 'tocando' && n === chunks.length - 1) { estado = 'parado'; i = 0; clearInterval(relogio); rotulo(); } };
      u.onerror = function (e) { if (e && (e.error === 'canceled' || e.error === 'interrupted')) return; };
      refs.push(u); S.speak(u);
    })(k);
  }
  /* rede de segurança: se o fim da última fala nunca for avisado, encerra quando a fila esvazia */
  function vigiar() {
    clearInterval(relogio); var visto = Date.now();
    relogio = setInterval(function () {
      if (S.speaking || S.pending) visto = Date.now();
      else if (estado === 'tocando' && Date.now() - visto > 2500) { estado = 'parado'; i = 0; clearInterval(relogio); rotulo(); }
    }, 500);
  }
  function tocar() { S.cancel(); estado = 'tocando'; rotulo(); vigiar(); var de = i; setTimeout(function () { if (estado === 'tocando') falar(de); }, 200); }
  function pausar() { estado = 'pausado'; clearInterval(relogio); S.cancel(); rotulo(); }
  function parar() { estado = 'parado'; i = 0; clearInterval(relogio); S.cancel(); rotulo(); }

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
