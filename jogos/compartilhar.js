(function () {
  'use strict';
  var b = document.querySelector('.compartilhar');
  if (!b) return;
  b.addEventListener('click', function () {
    var url = location.href.split('#')[0], titulo = b.getAttribute('data-titulo') || document.title;
    function aviso() { b.classList.add('ok'); setTimeout(function () { b.classList.remove('ok'); }, 2200); }
    function copiar() {
      if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(url).then(aviso, aviso); return; }
      var t = document.createElement('textarea'); t.value = url; document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); } catch (e) {} document.body.removeChild(t); aviso();
    }
    if (navigator.share) { navigator.share({ title: titulo, url: url }).catch(function () {}); } else copiar();
  });
})();
