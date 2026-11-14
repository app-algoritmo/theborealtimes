(function () {
  var L = location.pathname.indexOf('/en/') === 0 ? 'en' : location.pathname.indexOf('/no/') === 0 ? 'no' : 'pt';
  var T = {
    pt: { de: 'jogos vencidos', med: 'Medalhas', dif: ['Fácil', 'Normal', 'Difícil', 'Lendário'], todos: 'Todos', ven: 'Vencidos', fal: 'Faltam', vazio: 'Você ainda não venceu nenhum jogo. Escolha um e comece!', ir: 'Ver os jogos', comp: 'Compartilhar', copiado: 'Copiado!', limpar: 'Apagar meu progresso', conf: 'Apagar todo o progresso e recordes deste aparelho?', priv: 'O progresso fica salvo só neste aparelho, no navegador. Não há conta nem envio de dados. Limpar os dados do navegador apaga tudo.', txt: function (n, t) { return 'Venci ' + n + ' de ' + t + ' jogos no The Boreal Times!'; }, jogos: '/jogos/' },
    en: { de: 'games won', med: 'Medals', dif: ['Easy', 'Normal', 'Hard', 'Legendary'], todos: 'All', ven: 'Won', fal: 'Left', vazio: 'You have not won any game yet. Pick one and start!', ir: 'See the games', comp: 'Share', copiado: 'Copied!', limpar: 'Clear my progress', conf: 'Erase all progress and records on this device?', priv: 'Progress is saved only on this device, in the browser. No account, no data sent. Clearing browser data erases everything.', txt: function (n, t) { return 'I won ' + n + ' of ' + t + ' games on The Boreal Times!'; }, jogos: '/en/games/' },
    no: { de: 'spill vunnet', med: 'Medaljer', dif: ['Lett', 'Normal', 'Vanskelig', 'Legendarisk'], todos: 'Alle', ven: 'Vunnet', fal: 'Gjenstår', vazio: 'Du har ikke vunnet noe spill ennå. Velg ett og start!', ir: 'Se spillene', comp: 'Del', copiado: 'Kopiert!', limpar: 'Slett fremgangen min', conf: 'Slette all fremgang og rekorder på denne enheten?', priv: 'Fremgangen lagres bare på denne enheten, i nettleseren. Ingen konto, ingen data sendes. Tømmer du nettleserdata, forsvinner alt.', txt: function (n, t) { return 'Jeg har vunnet ' + n + ' av ' + t + ' spill på The Boreal Times!'; }, jogos: '/no/spill/' }
  }[L];
  var M = ['', '🥉', '🥈', '🥇'];
  function ls(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function render() {
    var root = document.getElementById('progresso'); if (!root) return;
    var lista = (window.BT_JOGOS || {})[L] || [], filtro = 'todos';
    var dados = lista.map(function (j) {
      var m = []; for (var i = 0; i < 4; i++) m.push(parseInt(ls('bt_med_' + j[0] + '_' + i), 10) || 0);
      var best = Math.max.apply(null, m);
      return { id: j[0], t: j[1], u: j[2], c: j[3], m: m, best: best, won: best > 0 };
    });
    var n = dados.filter(function (d) { return d.won; }).length, tot = dados.length;
    var cont = [0, 0, 0, 0], porDif = [0, 0, 0, 0];
    dados.forEach(function (d) { d.m.forEach(function (v, i) { if (v) { cont[v]++; porDif[i]++; } }); });
    var pct = tot ? Math.round(n * 100 / tot) : 0;
    var h = '<div class="prog-topo"><div class="prog-num">' + n + '<span>/' + tot + '</span></div><div class="prog-leg">' + T.de + '</div>' +
      '<div class="prog-barra" role="progressbar" aria-valuenow="' + n + '" aria-valuemin="0" aria-valuemax="' + tot + '"><i style="width:' + pct + '%"></i></div></div>';
    if (!n) h += '<p class="prog-vazio">' + T.vazio + ' <a href="' + T.jogos + '">' + T.ir + '</a></p>';
    h += '<div class="prog-stats"><div><b>' + M[3] + ' ' + cont[3] + '</b><small>' + T.med + '</small></div><div><b>' + M[2] + ' ' + cont[2] + '</b><small>&nbsp;</small></div><div><b>' + M[1] + ' ' + cont[1] + '</b><small>&nbsp;</small></div></div>';
    h += '<div class="prog-dif">' + T.dif.map(function (x, i) { return '<span>' + x + ' <b>' + porDif[i] + '</b></span>'; }).join('') + '</div>';
    h += '<div class="prog-filtros"><button data-f="todos" class="on">' + T.todos + ' (' + tot + ')</button><button data-f="ven">' + T.ven + ' (' + n + ')</button><button data-f="fal">' + T.fal + ' (' + (tot - n) + ')</button></div>';
    h += '<ul class="prog-grade">' + dados.map(function (d) {
      return '<li data-w="' + (d.won ? 1 : 0) + '" class="' + (d.won ? 'won' : '') + '"><a href="' + d.u + '"><span class="prog-ico">' + (d.won ? M[d.best] : '·') + '</span><span class="prog-tit">' + esc(d.t) + '</span><span class="prog-ms">' + d.m.map(function (v) { return v ? M[v] : '○'; }).join('') + '</span></a></li>';
    }).join('') + '</ul>';
    h += '<div class="prog-acoes"><button class="prog-comp">' + T.comp + '</button><button class="prog-lim">' + T.limpar + '</button></div><p class="prog-priv">' + T.priv + '</p>';
    root.innerHTML = h;
    root.querySelectorAll('.prog-filtros button').forEach(function (b) {
      b.onclick = function () {
        filtro = b.getAttribute('data-f');
        root.querySelectorAll('.prog-filtros button').forEach(function (x) { x.classList.toggle('on', x === b); });
        root.querySelectorAll('.prog-grade li').forEach(function (li) {
          var w = li.getAttribute('data-w') === '1';
          li.style.display = (filtro === 'todos' || (filtro === 'ven' && w) || (filtro === 'fal' && !w)) ? '' : 'none';
        });
      };
    });
    var bc = root.querySelector('.prog-comp');
    bc.onclick = function () {
      var txt = T.txt(n, tot) + ' ' + location.href;
      if (navigator.share) { navigator.share({ text: txt }).catch(function () {}); return; }
      try { navigator.clipboard.writeText(txt).then(function () { bc.textContent = T.copiado; setTimeout(function () { bc.textContent = T.comp; }, 1600); }); } catch (e) {}
    };
    root.querySelector('.prog-lim').onclick = function () {
      if (!confirm(T.conf)) return;
      try { Object.keys(localStorage).forEach(function (k) { if (k.indexOf('bt_med_') === 0 || k.indexOf('bt_rec_') === 0) localStorage.removeItem(k); }); } catch (e) {}
      render();
    };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render); else render();
})();
