/* Motor dos jogos do The Boreal Times: tela cheia, adaptação a qualquer
   tamanho e orientação, pausa. Sem dependências, sem cookies, sem coleta
   de dados. Cada jogo se registra com BTJogo.registrar({...}).

   Coordenadas dos jogos: o lado MENOR da tela vale sempre 450 unidades; o
   lado maior cresce conforme a proporção. Assim o jogo preenche toda a
   superfície, em retrato ou paisagem, sem faixas. */
(function () {
  'use strict';
  var l2 = (document.documentElement.lang || 'pt').slice(0, 2).toLowerCase();
  var L = l2 === 'en' ? 'en' : (l2 === 'nb' || l2 === 'no' || l2 === 'nn') ? 'no' : 'pt';
  var UI = {
    pt: { jogar: '▶ Jogar em tela cheia', sair: 'Sair', pausa: 'Pausar', pausado: 'Pausado', retomar: 'Toque para continuar' },
    en: { jogar: '▶ Play fullscreen', sair: 'Exit', pausa: 'Pause', pausado: 'Paused', retomar: 'Tap to continue' },
    no: { jogar: '▶ Spill på hel skjerm', sair: 'Avslutt', pausa: 'Pause', pausado: 'På pause', retomar: 'Trykk for å fortsette' }
  }[L];

  function registrar(def) {
    var cv = document.getElementById(def.canvas);
    if (!cv || !cv.getContext) return;
    var box = cv.parentNode, g = cv.getContext('2d');
    var api = { g: g, w: 800, h: 450, u: 1, L: L, T: def.t[L] || def.t.en, dpr: 1, clock: 0 };
    var jogo = null, ativo = false, fsOk = false, pausado = false;

    /* ---------- botões ---------- */
    function botao(cls, txt, fn) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = cls; b.textContent = txt;
      b.addEventListener('click', function (e) { e.stopPropagation(); fn(); });
      box.appendChild(b); return b;
    }
    var bJogar = botao('jogo-jogar', UI.jogar, entrar);
    var bSair = botao('jogo-x', '✕', sair); bSair.setAttribute('aria-label', UI.sair);
    var bPausa = botao('jogo-pausa', '❚❚', alternarPausa); bPausa.setAttribute('aria-label', UI.pausa);

    function entrar() {
      if (ativo) return;
      ativo = true; fsOk = false; pausado = false;
      box.classList.add('jogo-tela');
      document.documentElement.classList.add('jogo-aberto');
      var f = box.requestFullscreen || box.webkitRequestFullscreen;
      if (f) { try { var p = f.call(box); if (p && p.catch) p.catch(function () {}); } catch (e) {} }
      setTimeout(medir, 30); setTimeout(medir, 300);
    }
    function sair() {
      if (!ativo) return;
      ativo = false; pausado = false;
      box.classList.remove('jogo-tela');
      document.documentElement.classList.remove('jogo-aberto');
      var fe = document.fullscreenElement || document.webkitFullscreenElement;
      if (fe) { var x = document.exitFullscreen || document.webkitExitFullscreen; try { x.call(document); } catch (e) {} }
      if (jogo && jogo.pausar) jogo.pausar();
      setTimeout(medir, 30);
    }
    function alternarPausa() { if (ativo) pausado = !pausado; }
    function aoMudarFs() {
      var fe = document.fullscreenElement || document.webkitFullscreenElement;
      if (fe === box) fsOk = true;
      else if (ativo && fsOk) sair();
    }
    document.addEventListener('fullscreenchange', aoMudarFs);
    document.addEventListener('webkitfullscreenchange', aoMudarFs);
    document.addEventListener('visibilitychange', function () { if (document.hidden && ativo) pausado = true; });

    /* ---------- tamanho ---------- */
    function medir() {
      var r = cv.getBoundingClientRect();
      var W = Math.max(120, r.width), H = Math.max(120, r.height);
      api.dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(W * api.dpr); cv.height = Math.round(H * api.dpr);
      api.u = Math.min(W, H) / 450;
      api.w = W / api.u; api.h = H / api.u; api.px = W; api.py = H;
      if (jogo && jogo.resize) jogo.resize();
    }
    window.addEventListener('resize', function () { medir(); setTimeout(medir, 250); });
    window.addEventListener('orientationchange', function () { setTimeout(medir, 200); setTimeout(medir, 600); });
    if (window.ResizeObserver) new ResizeObserver(medir).observe(cv);

    /* ---------- entrada ---------- */
    function pos(e) {
      var r = cv.getBoundingClientRect();
      return [(e.clientX - r.left) / api.u, (e.clientY - r.top) / api.u];
    }
    cv.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      if (!ativo) { entrar(); return; }
      if (pausado) { pausado = false; return; }
      var p = pos(e); try { cv.setPointerCapture(e.pointerId); } catch (x) {}
      if (jogo && jogo.down) jogo.down(p[0], p[1]);
    });
    cv.addEventListener('pointermove', function (e) {
      if (!ativo || pausado) return;
      var p = pos(e); if (jogo && jogo.move) jogo.move(p[0], p[1], e.pressure > 0 || e.buttons > 0);
    });
    function solto() { if (jogo && jogo.up) jogo.up(); }
    window.addEventListener('pointerup', solto);
    window.addEventListener('pointercancel', solto);
    window.addEventListener('blur', function () { solto(); if (ativo) pausado = true; });
    cv.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    window.addEventListener('keydown', function (e) {
      if (!ativo) return;
      if (e.code === 'Escape') { sair(); return; }
      if (e.code === 'KeyP') { alternarPausa(); return; }
      if (/^(Space|Enter|Arrow|Key[WASD])/.test(e.code)) e.preventDefault();
      if (pausado) { pausado = false; return; }
      if (!e.repeat && jogo && jogo.key) jogo.key(e.code, true);
    });
    window.addEventListener('keyup', function (e) { if (ativo && jogo && jogo.key) jogo.key(e.code, false); });

    /* ---------- utilidades de desenho ---------- */
    api.sprite = (function () {
      var c = {};
      return function (n) {
        if (!c[n]) { var i = new Image(); i.src = '/g/img/' + n + '.png'; c[n] = i; }
        var s = c[n]; return s.complete && s.naturalWidth ? s : null;
      };
    })();
    api.txt = function (s, x, y, size, cor, alinh) {
      g.font = (size >= 20 ? 'bold ' : '') + size + 'px Georgia, serif';
      g.textAlign = alinh || 'center'; g.textBaseline = 'alphabetic';
      g.fillStyle = cor || '#fff'; g.fillText(s, x, y);
    };
    api.quebra = function (s, maxW, size, negrito) {
      g.font = (negrito ? 'bold ' : '') + size + 'px Georgia, serif';
      var pal = String(s).split(' '), ls = [], cur = '';
      pal.forEach(function (p) {
        var t = cur ? cur + ' ' + p : p;
        if (g.measureText(t).width > maxW && cur) { ls.push(cur); cur = p; } else cur = t;
      });
      if (cur) ls.push(cur); return ls;
    };
    api.cartaz = function (titulo, linhas, rodape, corTitulo) {
      var w = api.w, h = api.h, maxW = Math.min(w - 56, 720);
      g.fillStyle = 'rgba(10,8,25,.78)'; g.fillRect(0, 0, w, h);
      var ts = w < 520 ? 32 : 42, bs = w < 520 ? 17 : 19;
      var t = api.quebra(titulo, maxW, ts, true);
      var b = []; (linhas || []).forEach(function (l) { b = b.concat(api.quebra(l, maxW, bs)); b.push(''); });
      if (b.length) b.pop();
      var f = rodape ? api.quebra(rodape, maxW, 17) : [];
      var total = t.length * ts * 1.2 + (b.length ? 22 + b.length * bs * 1.45 : 0) + (f.length ? 34 + f.length * 24 : 0);
      var y = (h - total) / 2 + ts;
      t.forEach(function (l) { api.txt(l, w / 2, y, ts, corTitulo || '#fff'); y += ts * 1.2; });
      if (b.length) { y += 4; b.forEach(function (l) { y += bs * 1.45; api.txt(l, w / 2, y - 6, bs, '#e9e1f7'); }); }
      if (f.length) { y += 14; f.forEach(function (l) { y += 24; api.txt(l, w / 2, y, 17, '#c9b3f2'); }); }
    };

    /* ---------- laço ---------- */
    jogo = def.criar(api);
    medir();
    var ultimo = 0;
    function quadro(ts) {
      var dt = Math.min(0.05, (ts - ultimo) / 1000 || 0); ultimo = ts;
      if (!pausado) { api.clock += dt; if (jogo.update) jogo.update(dt); }
      g.setTransform(api.dpr * api.u, 0, 0, api.dpr * api.u, 0, 0);
      g.clearRect(0, 0, api.w, api.h);
      jogo.draw();
      if (pausado) {
        g.fillStyle = 'rgba(10,8,25,.7)'; g.fillRect(0, 0, api.w, api.h);
        api.txt(UI.pausado, api.w / 2, api.h / 2 - 6, 40, '#fff');
        api.txt(UI.retomar, api.w / 2, api.h / 2 + 34, 18, '#c9b3f2');
      }
      requestAnimationFrame(quadro);
    }
    requestAnimationFrame(quadro);
    window['__jogo_' + def.canvas] = { api: api, jogo: jogo, entrar: entrar, sair: sair };
  }
  window.BTJogo = { registrar: registrar };
})();
