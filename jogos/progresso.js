(function () {
  var P = location.pathname, L = P.indexOf('/en/') === 0 ? 'en' : P.indexOf('/no/') === 0 ? 'no' : 'pt';
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var TX = {
    pt: {
      ranks: ['Viajante', 'Grumete', 'Remador', 'Guerreiro', 'Escaldo', 'Jarl', 'Rei do Norte', 'Lenda de Asgard'],
      nivel: 'Nível', de: 'jogos vencidos', pts: 'pontos de saga', falta: function (k, r) { return 'Faltam ' + k + (k === 1 ? ' vitória' : ' vitórias') + ' para ' + r; },
      maximo: 'Você chegou ao topo da saga!', toque: 'Toque no emblema', reinos: 'Os quatro reinos', conq: 'Conquistas', salao: 'Salão dos jogos',
      reino: { mitos: 'Mitos e Deuses', sagas: 'Sagas e Reis', viking: 'Era Viking', contos: 'Contos e Folclore' }, conquistado: 'Reino conquistado!',
      todos: 'Todos', ven: 'Vencidos', fal: 'Faltam', vazio: 'Sua saga começa agora. Vença o primeiro jogo e o emblema acende.', ir: 'Escolher um jogo',
      comp: 'Compartilhar minha saga', copiado: 'Copiado!', limpar: 'Apagar meu progresso', conf: 'Apagar todo o progresso e recordes deste aparelho?',
      priv: 'O progresso fica salvo só neste aparelho, no navegador. Não há conta nem envio de dados. Limpar os dados do navegador apaga tudo.',
      novo: 'Nova conquista', subiu: 'Novo título', som: 'Som', dif: ['Fácil', 'Normal', 'Difícil', 'Lendário'], medalhas: 'medalhas',
      txt: function (n, t, r) { return 'Sou ' + r + ' no The Boreal Times: venci ' + n + ' de ' + t + ' jogos!'; }, jogos: '/jogos/', site: 'borealtimes.org',
      ach: [['Primeira vitória', 'Vença um jogo'], ['Cinco vitórias', 'Vença 5 jogos'], ['Quinze vitórias', 'Vença 15 jogos'], ['Meio caminho', 'Vença metade dos jogos'], ['Quase lá', 'Vença 50 jogos'],
        ['Dez ouros', 'Ganhe 10 medalhas de ouro'], ['Domador do Lendário', 'Vença em dificuldade Lendário'], ['Todas as dificuldades', 'Vença em Fácil, Normal, Difícil e Lendário'],
        ['Viajante dos quatro reinos', 'Vença ao menos um jogo em cada reino'], ['Senhor de um reino', 'Vença todos os jogos de um reino'], ['Triplo ouro', 'Ouro em Normal, Difícil e Lendário no mesmo jogo'], ['Lenda de Asgard', 'Vença todos os jogos']]
    },
    en: {
      ranks: ['Wanderer', 'Deckhand', 'Oarsman', 'Warrior', 'Skald', 'Jarl', 'King of the North', 'Legend of Asgard'],
      nivel: 'Level', de: 'games won', pts: 'saga points', falta: function (k, r) { return k + (k === 1 ? ' win' : ' wins') + ' to go for ' + r; },
      maximo: 'You reached the top of the saga!', toque: 'Tap the emblem', reinos: 'The four realms', conq: 'Achievements', salao: 'Hall of games',
      reino: { mitos: 'Myths & Gods', sagas: 'Sagas & Kings', viking: 'Viking Age', contos: 'Tales & Folklore' }, conquistado: 'Realm conquered!',
      todos: 'All', ven: 'Won', fal: 'Left', vazio: 'Your saga starts now. Win the first game and the emblem lights up.', ir: 'Pick a game',
      comp: 'Share my saga', copiado: 'Copied!', limpar: 'Clear my progress', conf: 'Erase all progress and records on this device?',
      priv: 'Progress is saved only on this device, in the browser. No account, no data sent. Clearing browser data erases everything.',
      novo: 'New achievement', subiu: 'New title', som: 'Sound', dif: ['Easy', 'Normal', 'Hard', 'Legendary'], medalhas: 'medals',
      txt: function (n, t, r) { return 'I am a ' + r + ' on The Boreal Times: I won ' + n + ' of ' + t + ' games!'; }, jogos: '/en/games/', site: 'borealtimes.org',
      ach: [['First win', 'Win a game'], ['Five wins', 'Win 5 games'], ['Fifteen wins', 'Win 15 games'], ['Halfway there', 'Win half of the games'], ['Almost there', 'Win 50 games'],
        ['Ten golds', 'Earn 10 gold medals'], ['Legendary tamer', 'Win on Legendary difficulty'], ['Every difficulty', 'Win on Easy, Normal, Hard and Legendary'],
        ['Traveller of four realms', 'Win at least one game in each realm'], ['Lord of a realm', 'Win every game of one realm'], ['Triple gold', 'Gold on Normal, Hard and Legendary in the same game'], ['Legend of Asgard', 'Win every game']]
    },
    no: {
      ranks: ['Vandrer', 'Dekksgutt', 'Roer', 'Kriger', 'Skald', 'Jarl', 'Nordens konge', 'Asgards legende'],
      nivel: 'Nivå', de: 'spill vunnet', pts: 'sagapoeng', falta: function (k, r) { return k + (k === 1 ? ' seier' : ' seiere') + ' igjen til ' + r; },
      maximo: 'Du har nådd toppen av sagaen!', toque: 'Trykk på emblemet', reinos: 'De fire rikene', conq: 'Prestasjoner', salao: 'Spillhallen',
      reino: { mitos: 'Myter og guder', sagas: 'Sagaer og konger', viking: 'Vikingtid', contos: 'Eventyr og folketro' }, conquistado: 'Riket er erobret!',
      todos: 'Alle', ven: 'Vunnet', fal: 'Gjenstår', vazio: 'Sagaen din starter nå. Vinn det første spillet, så lyser emblemet.', ir: 'Velg et spill',
      comp: 'Del sagaen min', copiado: 'Kopiert!', limpar: 'Slett fremgangen min', conf: 'Slette all fremgang og rekorder på denne enheten?',
      priv: 'Fremgangen lagres bare på denne enheten, i nettleseren. Ingen konto, ingen data sendes. Tømmer du nettleserdata, forsvinner alt.',
      novo: 'Ny prestasjon', subiu: 'Ny tittel', som: 'Lyd', dif: ['Lett', 'Normal', 'Vanskelig', 'Legendarisk'], medalhas: 'medaljer',
      txt: function (n, t, r) { return 'Jeg er ' + r + ' på The Boreal Times: ' + n + ' av ' + t + ' spill vunnet!'; }, jogos: '/no/spill/', site: 'borealtimes.org',
      ach: [['Første seier', 'Vinn et spill'], ['Fem seiere', 'Vinn 5 spill'], ['Femten seiere', 'Vinn 15 spill'], ['Halvveis', 'Vinn halvparten av spillene'], ['Nesten i mål', 'Vinn 50 spill'],
        ['Ti gull', 'Ta 10 gullmedaljer'], ['Legendarisk temmer', 'Vinn på Legendarisk'], ['Alle vanskelighetsgrader', 'Vinn på Lett, Normal, Vanskelig og Legendarisk'],
        ['Reisende i fire riker', 'Vinn minst ett spill i hvert rike'], ['Herre over et rike', 'Vinn alle spillene i ett rike'], ['Trippelt gull', 'Gull på Normal, Vanskelig og Legendarisk i samme spill'], ['Asgards legende', 'Vinn alle spillene']]
    }
  }[L];
  var EMB = ['🧭', '⚓', '🛶', '⚔️', '📜', '🛡️', '👑', '⚡'];
  var AEMO = ['⚔️', '🛶', '⚓', '🧭', '🌟', '🥇', '🔥', '🎚️', '🗺️', '🏰', '💎', '⚡'];
  var COR = { mitos: '#f5a800', sagas: '#e5322d', viking: '#00a3c7', contos: '#12a150' };
  var REINOS = ['mitos', 'sagas', 'viking', 'contos'], M = ['', '🥉', '🥈', '🥇'];
  function ls(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lw(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---------- som (mesma chave de mudo dos jogos) ---------- */
  var AC = null;
  function mudo() { return ls('bt_mudo') === '1'; }
  function audio() {
    if (mudo()) return null;
    if (!AC) { var C = window.AudioContext || window.webkitAudioContext; if (!C) return null; try { AC = new C(); } catch (e) { return null; } }
    if (AC.state === 'suspended' && AC.resume) { try { AC.resume(); } catch (e) {} }
    return AC;
  }
  function tom(f, d, tipo, v, atraso, f2) {
    var a = audio(); if (!a) return;
    try {
      var t = a.currentTime + (atraso || 0), o = a.createOscillator(), g = a.createGain();
      o.type = tipo || 'triangle'; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v || 0.1, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + d + 0.03);
    } catch (e) {}
  }
  var S = {
    tick: function (i) { tom(600 + (i % 12) * 40, 0.05, 'triangle', 0.04); },
    clique: function () { tom(880, 0.06, 'triangle', 0.06); tom(1320, 0.08, 'sine', 0.05, 0.05); },
    fanfarra: function () { [392, 523, 659, 784, 1047].forEach(function (f, i) { tom(f, 0.22, 'triangle', 0.12, i * 0.1); }); tom(1047, 0.7, 'sine', 0.08, 0.55); tom(523, 0.7, 'sine', 0.06, 0.55); },
    conq: function () { [659, 880, 1175].forEach(function (f, i) { tom(f, 0.2, 'triangle', 0.1, i * 0.09); }); tom(1760, 0.4, 'sine', 0.05, 0.3); },
    vazio: function () { tom(220, 0.25, 'sine', 0.07, 0, 150); }
  };

  /* ---------- confete de runas ---------- */
  var cf = null, cfx = null, parts = [], cfRaf = 0;
  function confete(x, y, n, cores) {
    if (RM) return;
    if (!cf) { cf = document.createElement('canvas'); cf.style.cssText = 'position:fixed;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:9999'; document.body.appendChild(cf); cfx = cf.getContext('2d'); }
    cf.width = innerWidth; cf.height = innerHeight;
    var R = 'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ'; cores = cores || ['#f5a800', '#e5322d', '#00a3c7', '#12a150', '#e91e8c', '#fff2c4'];
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2, v = 4 + Math.random() * 9;
      parts.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 5, r: R[Math.floor(Math.random() * R.length)], c: cores[i % cores.length], s: 14 + Math.random() * 16, l: 1, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3 });
    }
    if (!cfRaf) cfRaf = requestAnimationFrame(cfLoop);
  }
  function cfLoop() {
    cfx.clearRect(0, 0, cf.width, cf.height);
    parts = parts.filter(function (p) { return p.l > 0 && p.y < cf.height + 40; });
    parts.forEach(function (p) {
      p.vy += 0.28; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.l -= 0.007;
      cfx.save(); cfx.globalAlpha = Math.max(0, Math.min(1, p.l * 1.5)); cfx.translate(p.x, p.y); cfx.rotate(p.rot);
      cfx.fillStyle = p.c; cfx.font = 'bold ' + p.s + 'px serif'; cfx.textAlign = 'center'; cfx.fillText(p.r, 0, 0); cfx.restore();
    });
    if (parts.length) cfRaf = requestAnimationFrame(cfLoop); else { cfRaf = 0; cfx.clearRect(0, 0, cf.width, cf.height); }
  }

  /* ---------- aurora ---------- */
  function aurora(cv) {
    var g = cv.getContext('2d'), t = 0, vis = true, stars = [], i;
    function tam() { var r = cv.getBoundingClientRect(); cv.width = r.width * 1.0; cv.height = r.height * 1.0; stars = []; for (i = 0; i < 70; i++) stars.push([Math.random() * cv.width, Math.random() * cv.height * 0.8, Math.random() * 1.6 + 0.3, Math.random() * 6]); }
    tam(); window.addEventListener('resize', tam);
    function quadro() {
      var w = cv.width, h = cv.height; g.clearRect(0, 0, w, h);
      stars.forEach(function (s) { g.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(t * 0.8 + s[3])); g.fillStyle = '#fff'; g.beginPath(); g.arc(s[0], s[1], s[2], 0, 6.3); g.fill(); });
      g.globalAlpha = 1; g.globalCompositeOperation = 'lighter';
      [['rgba(40,220,150,', 0.34, 0], ['rgba(110,90,255,', 0.3, 2], ['rgba(230,60,200,', 0.2, 4]].forEach(function (b) {
        for (var x = 0; x <= w; x += 6) {
          var y = h * (0.28 + b[1] * 0.25) + Math.sin(x * 0.009 + t * 0.6 + b[2]) * h * 0.09 + Math.sin(x * 0.021 - t * 0.4) * h * 0.04;
          var gr = g.createLinearGradient(0, y - h * 0.2, 0, y + h * 0.25); gr.addColorStop(0, b[0] + '0)'); gr.addColorStop(0.35, b[0] + (0.24 * (0.6 + 0.4 * Math.sin(x * 0.01 + t))) + ')'); gr.addColorStop(1, b[0] + '0)');
          g.fillStyle = gr; g.fillRect(x, y - h * 0.2, 6, h * 0.45);
        }
      });
      g.globalCompositeOperation = 'source-over';
    }
    function loop() { if (vis && !document.hidden) { t += 0.016; quadro(); } requestAnimationFrame(loop); }
    if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { vis = e[0].isIntersecting; }).observe(cv);
    if (RM) quadro(); else loop();
  }

  /* ---------- dados ---------- */
  function carregar() {
    var lista = (window.BT_JOGOS || {})[L] || [];
    var dados = lista.map(function (j) {
      var m = []; for (var i = 0; i < 4; i++) m.push(parseInt(ls('bt_med_' + j[0] + '_' + i), 10) || 0);
      var best = Math.max.apply(null, m), pts = 0; m.forEach(function (v, i) { pts += v * (i + 1); });
      return { id: j[0], t: j[1], u: j[2], c: j[3], m: m, best: best, won: best > 0, pts: pts };
    });
    var r = { dados: dados, tot: dados.length, n: 0, pts: 0, gold: 0, med: [0, 0, 0, 0], dif: [0, 0, 0, 0], reino: {} };
    REINOS.forEach(function (k) { r.reino[k] = { n: 0, t: 0 }; });
    dados.forEach(function (d) {
      if (d.won) r.n++; r.pts += d.pts;
      if (r.reino[d.c]) { r.reino[d.c].t++; if (d.won) r.reino[d.c].n++; }
      d.m.forEach(function (v, i) { if (v) { r.med[v]++; r.dif[i]++; if (v === 3) r.gold++; } });
    });
    return r;
  }
  function rankDe(r) {
    var th = [0, 1, 5, 12, 25, 40, 55]; if (r.tot && r.n >= r.tot) return { i: 7, prox: null, th: th };
    var i = 0; th.forEach(function (x, k) { if (r.n >= x) i = k; });
    var alvo = i < 6 ? Math.min(th[i + 1], r.tot) : r.tot;
    return { i: i, prox: alvo, ant: th[i], th: th };
  }
  function conquistas(r) {
    var n = r.n, t = r.tot, ok = [];
    var reinoMestre = REINOS.some(function (k) { return r.reino[k].t > 0 && r.reino[k].n === r.reino[k].t; });
    var todosReinos = REINOS.every(function (k) { return r.reino[k].n > 0; });
    var triplo = r.dados.some(function (d) { return d.m[1] === 3 && d.m[2] === 3 && d.m[3] === 3; });
    return [n >= 1, n >= 5, n >= 15, t > 0 && n >= Math.ceil(t / 2), n >= 50, r.gold >= 10, r.dif[3] > 0, r.dif.every(function (x) { return x > 0; }), todosReinos, reinoMestre, triplo, t > 0 && n >= t];
  }

  /* ---------- cartão de compartilhar (imagem) ---------- */
  function cartao(r, rk, cb) {
    var c = document.createElement('canvas'); c.width = 1200; c.height = 630; var g = c.getContext('2d');
    var gr = g.createLinearGradient(0, 0, 1200, 630); gr.addColorStop(0, '#120c2e'); gr.addColorStop(0.55, '#2a1458'); gr.addColorStop(1, '#0b3a46'); g.fillStyle = gr; g.fillRect(0, 0, 1200, 630);
    for (var i = 0; i < 90; i++) { g.globalAlpha = Math.random() * 0.8; g.fillStyle = '#fff'; g.fillRect(Math.random() * 1200, Math.random() * 420, 2, 2); } g.globalAlpha = 1;
    var au = g.createLinearGradient(0, 150, 0, 420); au.addColorStop(0, 'rgba(40,220,150,0)'); au.addColorStop(0.5, 'rgba(40,220,150,.25)'); au.addColorStop(1, 'rgba(40,220,150,0)'); g.fillStyle = au; g.fillRect(0, 150, 1200, 270);
    g.textAlign = 'center'; g.fillStyle = '#f5a800'; g.font = 'bold 34px Georgia,serif'; g.fillText('THE BOREAL TIMES', 600, 70);
    g.font = '170px serif'; g.fillText(EMB[rk.i], 600, 270);
    g.fillStyle = '#fff'; g.font = 'bold 76px Georgia,serif'; g.fillText(TX.ranks[rk.i], 600, 372);
    g.fillStyle = '#d9d0ff'; g.font = '42px Georgia,serif'; g.fillText(r.n + ' / ' + r.tot + ' ' + TX.de + '  ·  ' + r.pts + ' ' + TX.pts, 600, 438);
    g.font = '46px serif'; g.fillStyle = '#fff'; g.fillText('🥇 ' + r.med[3] + '    🥈 ' + r.med[2] + '    🥉 ' + r.med[1], 600, 505);
    REINOS.forEach(function (k, i) { g.fillStyle = COR[k]; g.fillRect(300 + i * 150, 540, 140, 10); g.fillStyle = 'rgba(255,255,255,.2)'; });
    g.fillStyle = '#b9aef0'; g.font = '28px Georgia,serif'; g.fillText(TX.site, 600, 598);
    c.toBlob(cb, 'image/png');
  }

  var vistoAch = []; try { vistoAch = JSON.parse(ls('bt_conq') || '[]'); } catch (e) {}
  var vistoRank = parseInt(ls('bt_rank'), 10);
  var primeira = true;

  function render() {
    var root = document.getElementById('progresso'); if (!root) return;
    var r = carregar(), rk = rankDe(r), ach = conquistas(r), pct = r.tot ? r.n / r.tot : 0, nac = ach.filter(Boolean).length;
    var h = '<section class="pg-hero"><canvas class="pg-aurora" aria-hidden="true"></canvas><div class="pg-hero-in">' +
      '<button type="button" class="pg-emblem" style="--p:' + (RM ? Math.round(pct * 100) : 0) + '" data-p="' + Math.round(pct * 100) + '" aria-label="' + esc(TX.ranks[rk.i]) + '"><span class="pg-emo">' + EMB[rk.i] + '</span></button>' +
      '<div class="pg-dica">' + TX.toque + '</div>' +
      '<div class="pg-rank">' + esc(TX.ranks[rk.i]) + '</div><div class="pg-nivel">' + TX.nivel + ' ' + (rk.i + 1) + ' / 8 · <b class="pg-pts" data-v="' + r.pts + '">' + (RM ? r.pts : 0) + '</b> ' + TX.pts + '</div>' +
      '<div class="pg-num"><b class="pg-n" data-v="' + r.n + '">' + (RM ? r.n : 0) + '</b><span>/' + r.tot + '</span></div><div class="pg-leg">' + TX.de + '</div>';
    if (rk.prox) {
      var span = Math.max(1, rk.prox - rk.ant), f = Math.min(1, (r.n - rk.ant) / span);
      h += '<div class="pg-prox"><i style="width:' + Math.round(f * 100) + '%"></i></div><div class="pg-proxt">' + TX.falta(rk.prox - r.n, TX.ranks[rk.i + 1]) + '</div>';
    } else h += '<div class="pg-proxt">' + TX.maximo + '</div>';
    h += '<div class="pg-med"><span>🥇 <b>' + r.med[3] + '</b></span><span>🥈 <b>' + r.med[2] + '</b></span><span>🥉 <b>' + r.med[1] + '</b></span></div>';
    if (!r.n) h += '<p class="pg-vazio">' + TX.vazio + ' <a href="' + TX.jogos + '">' + TX.ir + '</a></p>';
    h += '<div class="pg-btns"><button type="button" class="pg-comp">📤 ' + TX.comp + '</button><button type="button" class="pg-som" aria-pressed="' + (mudo() ? 'false' : 'true') + '">' + (mudo() ? '🔇' : '🔊') + ' ' + TX.som + '</button></div></div></section>';

    h += '<h2 class="pg-h">' + TX.reinos + '</h2><div class="pg-reinos">' + REINOS.map(function (k) {
      var q = r.reino[k], p = q.t ? Math.round(q.n * 100 / q.t) : 0, done = q.t && q.n === q.t;
      return '<div class="pg-reino' + (done ? ' feito' : '') + '" style="--c:' + COR[k] + '"><div class="pg-anel" style="--p:' + (RM ? p : 0) + '" data-p="' + p + '"><b>' + q.n + '</b><small>/' + q.t + '</small></div><div class="pg-rnome">' + TX.reino[k] + '</div>' + (done ? '<div class="pg-coroa">👑 ' + TX.conquistado + '</div>' : '<div class="pg-rpct">' + p + '%</div>') + '</div>';
    }).join('') + '</div>';

    h += '<h2 class="pg-h">' + TX.conq + ' <small>' + nac + '/' + ach.length + '</small></h2><div class="pg-conq">' + ach.map(function (ok, i) {
      return '<div class="pg-ach' + (ok ? ' on' : '') + '" data-i="' + i + '"><span class="pg-aico">' + (ok ? AEMO[i] : '🔒') + '</span><b>' + esc(TX.ach[i][0]) + '</b><small>' + esc(TX.ach[i][1]) + '</small></div>';
    }).join('') + '</div>';

    h += '<h2 class="pg-h">' + TX.salao + '</h2><div class="pg-filtros"><button data-f="todos" class="on">' + TX.todos + ' (' + r.tot + ')</button><button data-f="ven">' + TX.ven + ' (' + r.n + ')</button><button data-f="fal">' + TX.fal + ' (' + (r.tot - r.n) + ')</button></div>' +
      '<ul class="pg-grade">' + r.dados.map(function (d) {
        return '<li data-w="' + (d.won ? 1 : 0) + '" class="' + (d.won ? 'won' : '') + '" style="--c:' + (COR[d.c] || '#888') + '"><a href="' + d.u + '"><span class="pg-ico">' + (d.won ? M[d.best] : '·') + '</span><span class="pg-tit">' + esc(d.t) + '</span><span class="pg-ms" title="' + TX.dif.join(' · ') + '">' + d.m.map(function (v) { return v ? M[v] : '○'; }).join('') + '</span></a></li>';
      }).join('') + '</ul>' +
      '<div class="pg-acoes"><button class="pg-lim">' + TX.limpar + '</button></div><p class="pg-priv">' + TX.priv + '</p>';
    root.innerHTML = '<div class="pg">' + h + '</div>';

    /* animações de entrada */
    var anim = [].slice.call(root.querySelectorAll('.pg-n,.pg-pts'));
    anim.forEach(function (el) {
      var v = parseInt(el.getAttribute('data-v'), 10) || 0; if (RM || !v) { el.textContent = v; return; }
      var t0 = performance.now(), dur = 1100, ult = -1;
      (function f(now) { var k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3), x = Math.round(v * e); el.textContent = x; if (x !== ult && el.classList.contains('pg-n')) { S.tick(x); ult = x; } if (k < 1) requestAnimationFrame(f); })(t0);
    });
    setTimeout(function () { root.querySelectorAll('[data-p]').forEach(function (e) { e.style.setProperty('--p', e.getAttribute('data-p')); }); }, 80);
    var cv = root.querySelector('.pg-aurora'); if (cv) aurora(cv);

    /* interações */
    var em = root.querySelector('.pg-emblem');
    em.onclick = function () {
      var b = em.getBoundingClientRect(); em.classList.remove('pulso'); void em.offsetWidth; em.classList.add('pulso');
      if (r.n) { S.fanfarra(); confete(b.left + b.width / 2, b.top + b.height / 2, 90); } else { S.vazio(); }
    };
    root.querySelectorAll('.pg-ach').forEach(function (a) {
      a.onclick = function () { var b = a.getBoundingClientRect(); if (a.classList.contains('on')) { S.conq(); confete(b.left + b.width / 2, b.top + b.height / 2, 28); a.classList.remove('pop'); void a.offsetWidth; a.classList.add('pop'); } else S.vazio(); };
    });
    root.querySelectorAll('.pg-reino.feito').forEach(function (a) { a.onclick = function () { var b = a.getBoundingClientRect(); S.fanfarra(); confete(b.left + b.width / 2, b.top + 40, 60, [a.style.getPropertyValue('--c'), '#fff2c4']); }; });
    root.querySelectorAll('.pg-filtros button').forEach(function (b) {
      b.onclick = function () {
        S.clique(); var filtro = b.getAttribute('data-f');
        root.querySelectorAll('.pg-filtros button').forEach(function (x) { x.classList.toggle('on', x === b); });
        root.querySelectorAll('.pg-grade li').forEach(function (li) { var w = li.getAttribute('data-w') === '1'; li.style.display = (filtro === 'todos' || (filtro === 'ven' && w) || (filtro === 'fal' && !w)) ? '' : 'none'; });
      };
    });
    var som = root.querySelector('.pg-som');
    som.onclick = function () { var m = !mudo(); lw('bt_mudo', m ? '1' : '0'); som.textContent = (m ? '🔇' : '🔊') + ' ' + TX.som; som.setAttribute('aria-pressed', m ? 'false' : 'true'); if (!m) S.clique(); };
    var bc = root.querySelector('.pg-comp');
    bc.onclick = function () {
      S.clique(); var txt = TX.txt(r.n, r.tot, TX.ranks[rk.i]);
      cartao(r, rk, function (blob) {
        var f = null; try { f = new File([blob], 'minha-saga-boreal.png', { type: 'image/png' }); } catch (e) {}
        if (navigator.canShare && f && navigator.canShare({ files: [f] })) { navigator.share({ files: [f], text: txt, url: location.href }).catch(function () {}); return; }
        if (navigator.share) { navigator.share({ text: txt, url: location.href }).catch(function () {}); return; }
        var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'minha-saga-boreal.png'; document.body.appendChild(a); a.click(); a.remove();
        try { navigator.clipboard.writeText(txt + ' ' + location.href).then(function () { bc.textContent = '✔ ' + TX.copiado; setTimeout(function () { bc.textContent = '📤 ' + TX.comp; }, 1800); }, function () {}); } catch (e) {}
      });
    };
    root.querySelector('.pg-lim').onclick = function () {
      if (!confirm(TX.conf)) return;
      try { Object.keys(localStorage).forEach(function (k) { if (k.indexOf('bt_med_') === 0 || k.indexOf('bt_rec_') === 0 || k === 'bt_conq' || k === 'bt_rank') localStorage.removeItem(k); }); } catch (e) {}
      vistoAch = []; vistoRank = NaN; primeira = false; render();
    };

    /* novidades desde a última visita */
    if (primeira) {
      primeira = false;
      var novas = []; ach.forEach(function (ok, i) { if (ok && vistoAch.indexOf(i) < 0) novas.push(i); });
      var subiu = !isNaN(vistoRank) && rk.i > vistoRank, aviso = null;
      if (subiu) aviso = '🎉 ' + TX.subiu + ': ' + TX.ranks[rk.i]; else if (novas.length && !isNaN(vistoRank)) aviso = '🏆 ' + TX.novo + ': ' + TX.ach[novas[0]][0];
      lw('bt_conq', JSON.stringify(ach.map(function (ok, i) { return ok ? i : -1; }).filter(function (x) { return x >= 0; }))); lw('bt_rank', String(rk.i));
      if (aviso || (r.n && isNaN(vistoRank))) {
        setTimeout(function () {
          var b = em.getBoundingClientRect(); S.fanfarra(); confete(b.left + b.width / 2, b.top + b.height / 2, subiu ? 140 : 90);
          if (aviso) { var tt = document.createElement('div'); tt.className = 'pg-aviso'; tt.textContent = aviso; document.body.appendChild(tt); setTimeout(function () { tt.classList.add('sai'); setTimeout(function () { tt.remove(); }, 600); }, 4200); }
        }, 1300);
      }
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render); else render();
})();
