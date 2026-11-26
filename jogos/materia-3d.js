/* Botão 3D/AR da matéria: abre o modelo da figurinha (model-viewer, carregado só ao tocar). */
(function () {
  var bt = document.querySelector('.btn-3d'); if (!bt) return;
  function carregar(cb) {
    if (window.customElements && customElements.get('model-viewer')) return cb();
    var s = document.createElement('script'); s.type = 'module'; s.src = '/g/ar/model-viewer.min.js';
    s.onload = function () { customElements.whenDefined('model-viewer').then(cb); };
    document.head.appendChild(s);
  }
  function fechar(box) { document.removeEventListener('keydown', box._k); box.remove(); bt.focus(); }
  bt.addEventListener('click', function () {
    carregar(function () {
      var box = document.createElement('div'); box.className = 'm3d'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true');
      var mv = document.createElement('model-viewer');
      mv.setAttribute('src', bt.getAttribute('data-modelo')); mv.setAttribute('alt', bt.getAttribute('data-alt') || '');
      ['ar', 'camera-controls', 'auto-rotate'].forEach(function (a) { mv.setAttribute(a, ''); });
      mv.setAttribute('ar-modes', 'scene-viewer quick-look'); mv.setAttribute('ar-placement', 'floor'); mv.setAttribute('ar-scale', 'fixed');
      mv.setAttribute('touch-action', 'pan-y'); mv.setAttribute('shadow-intensity', '1.2'); mv.setAttribute('exposure', '1.1');
      mv.setAttribute('interaction-prompt', 'none'); mv.setAttribute('camera-orbit', '0deg 78deg auto');
      var ar = document.createElement('button'); ar.type = 'button'; ar.slot = 'ar-button'; ar.className = 'm3d-ar'; ar.textContent = bt.getAttribute('data-mesa');
      mv.appendChild(ar);
      var x = document.createElement('button'); x.type = 'button'; x.className = 'm3d-x'; x.textContent = '\u00d7'; x.setAttribute('aria-label', bt.getAttribute('data-fechar'));
      x.onclick = function () { fechar(box); };
      box.onclick = function (e) { if (e.target === box) fechar(box); };
      box._k = function (e) { if (e.key === 'Escape') fechar(box); };
      document.addEventListener('keydown', box._k);
      box.appendChild(mv); box.appendChild(x); document.body.appendChild(box); x.focus();
    });
  });
})();
