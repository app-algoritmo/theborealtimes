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

  /* ================= Efeitos, som, pontuação e dificuldade =================
     Tudo aqui vale para qualquer jogo: o motor lê o contador que o jogo
     desenha no canto (ex.: "Acertos 3/8", "Erros 1/3") e o estado dos
     cartazes (início, vitória, derrota) para disparar partículas, tremor,
     sons e pontos, sem mexer no código de cada jogo. */
  var TEMAS = {"jogo-althing":"viking","jogo-arrasto":"viking","jogo-balanca":"viking","jogo-berserker":"viking","jogo-bifrost":"mitos","jogo-birka":"viking","jogo-bodes":"contos","jogo-bolos":"viking","jogo-capacete":"viking","jogo-cova":"sagas","jogo-draugen":"contos","jogo-egil":"sagas","jogo-eirik":"sagas","jogo-esqui":"sagas","jogo-fadlan":"viking","jogo-fenrir":"mitos","jogo-freyja":"mitos","jogo-freyr":"mitos","jogo-frigg":"mitos","jogo-glamr":"sagas","jogo-gryla":"contos","jogo-gudrid":"sagas","jogo-gudrun":"sagas","jogo-gunnlaug":"sagas","jogo-harald":"sagas","jogo-hedeby":"viking","jogo-hrafnkell":"sagas","jogo-huginn":"mitos","jogo-huldra":"contos","jogo-huldu":"contos","jogo-idun":"mitos","jogo-kari":"sagas","jogo-kraken":"contos","jogo-lagarfljot":"contos","jogo-leif":"sagas","jogo-maldon":"viking","jogo-martelo":"mitos","jogo-mimir":"mitos","jogo-moinho":"contos","jogo-nisse":"contos","jogo-nokken":"contos","jogo-nornas":"mitos","jogo-oseberg":"viking","jogo-paris":"viking","jogo-pedrasol":"viking","jogo-ragnar":"sagas","jogo-ragnarok":"mitos","jogo-ratatosk":"mitos","jogo-remar":"viking","jogo-rok":"viking","jogo-runas":"viking","jogo-sigyn":"mitos","jogo-skadi":"mitos","jogo-sleipnir":"mitos","jogo-snorri":"sagas","jogo-soria":"contos","jogo-stamford":"viking","jogo-stiklestad":"sagas","jogo-svolder":"sagas","jogo-tafl":"viking","jogo-thor":"mitos","jogo-trelleborg":"viking","jogo-troll":"contos","jogo-trolls":"contos","jogo-ulfberht":"viking","jogo-utgard":"mitos","jogo-valquiria":"mitos","jogo-ventonorte":"contos","jogo-violino":"contos"};
  var NIVEIS = [{ m: 0.8, p: 0.6 }, { m: 1, p: 1 }, { m: 1.25, p: 1.6 }, { m: 1.5, p: 2.5 }];
  var TX = {
    pt: { dif: ['Fácil', 'Normal', 'Difícil', 'Lendário'], pts: 'Pontos', rec: 'Recorde', novo: 'Novo recorde!', som: 'Som' },
    en: { dif: ['Easy', 'Normal', 'Hard', 'Legendary'], pts: 'Score', rec: 'Best', novo: 'New best!', som: 'Sound' },
    no: { dif: ['Lett', 'Normal', 'Vanskelig', 'Legendarisk'], pts: 'Poeng', rec: 'Rekord', novo: 'Ny rekord!', som: 'Lyd' }
  }[L];
  var RE_BAD = /erro|falha|ferid|engano|tremor|encost|levado|passaram|pedra|casco|feil|bom$|forbi|stein|skrog|skjelv|sår|tatt|mistake|miss|failure|wound|touch|taken|passed|stone|hull|berøring/i;
  var RE_BOM2 = /acerto|barris|guardado|hit|barrel|kept|beholdt|tønner|treff/i;
  var RE_IGN = /tempo|time|tid\b|dias|days|dager|f[oô]lego|breath|pust|cuidado|care|stell|f[úu]ria|fury|raseri|coragem|courage|\bmot\b|juventude|youth|ungdom|until|até|til det|%/i;
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /* ---- som (WebAudio, sem arquivos) ---- */
  var AC = null, MUDO = lsGet('bt_mudo') === '1';
  function audio() {
    if (MUDO) return null;
    if (!AC) { var C = window.AudioContext || window.webkitAudioContext; if (!C) return null; try { AC = new C(); } catch (e) { return null; } }
    if (AC.state === 'suspended' && AC.resume) { try { AC.resume(); } catch (e) {} }
    return AC;
  }
  function tom(f, d, tipo, v, f2, atraso) {
    var a = audio(); if (!a) return;
    try {
      var t = a.currentTime + (atraso || 0), o = a.createOscillator(), gn = a.createGain();
      o.type = tipo || 'sine'; o.frequency.setValueAtTime(f, t);
      if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
      gn.gain.setValueAtTime(0.0001, t); gn.gain.exponentialRampToValueAtTime(v || 0.12, t + 0.012); gn.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(gn); gn.connect(a.destination); o.start(t); o.stop(t + d + 0.03);
    } catch (e) {}
  }
  var SOM = {
    tap: function () { tom(900, 0.04, 'triangle', 0.035); },
    bom: function (c) { var b = 520 + Math.min(c, 10) * 45; tom(b, 0.09, 'triangle', 0.13); tom(b * 1.5, 0.12, 'triangle', 0.11, 0, 0.07); },
    mau: function () { tom(190, 0.22, 'sawtooth', 0.1, 70); },
    inicio: function () { tom(392, 0.1, 'triangle', 0.12); tom(587, 0.16, 'triangle', 0.12, 0, 0.09); },
    vitoria: function () { [523, 659, 784, 1047].forEach(function (f, i) { tom(f, 0.2, 'triangle', 0.13, 0, i * 0.11); }); tom(1047, 0.5, 'sine', 0.08, 0, 0.5); },
    derrota: function () { [392, 330, 262].forEach(function (f, i) { tom(f, 0.25, 'sawtooth', 0.08, f * 0.8, i * 0.17); }); },
    nivel: function () { tom(660, 0.05, 'square', 0.05); }
  };

  /* ---- uma instância de efeitos por jogo ---- */
  function criarFx(id, api, g, ativoFn) {
    var tema = TEMAS[id] || 'mitos';
    var dif = parseInt(lsGet('bt_dif'), 10); if (!(dif >= 0 && dif <= 3)) dif = 1;
    var best = parseInt(lsGet('bt_rec_' + id + '_' + dif), 10) || 0;
    var parts = [], aneis = [], flut = [], amb = [], flash = null, shake = 0, shT = 0;
    var est = 'menu', marca = null, linhas = [], prev = {}, grace = 0, score = 0, combo = 0, comboT = 0, tPlay = 0, novo = false, ult = 0, ux = 0, uy = 0, ut = -9;
    var CORES = { mitos: ['#8dffc9', '#9ad7ff', '#d7b8ff'], sagas: ['#ffb36b', '#ff8a3a', '#ffd88a'], viking: ['#ffffff', '#cfe9ff', '#a8d4ff'], contos: ['#e5ff9a', '#b6ffcf', '#fff1a0'] }[tema];
    function rnd(a, b) { return a + Math.random() * (b - a); }
    function spawnAmb() {
      var w = api.w, h = api.h;
      if (tema === 'sagas') return { x: rnd(0, w), y: h + 6, vx: rnd(-8, 8), vy: -rnd(18, 42), r: rnd(1, 2.6), ph: rnd(0, 6) };
      if (tema === 'viking') return { x: rnd(0, w), y: -6, vx: rnd(-10, 10), vy: rnd(14, 34), r: rnd(1, 2.6), ph: rnd(0, 6) };
      return { x: rnd(0, w), y: rnd(0, h), vx: rnd(-6, 6), vy: rnd(-6, 6), r: rnd(1.5, 3), ph: rnd(0, 6) };
    }
    function init() { amb = []; for (var i = 0; i < 34; i++) { var a = spawnAmb(); a.y = rnd(0, api.h); amb.push(a); } }
    init();
    function pos() { return api.clock - ut < 0.9 ? [ux, uy] : [api.w / 2, api.h * 0.45]; }
    function burst(x, y, n, cores, vel, grav, vida, r) {
      for (var i = 0; i < n && parts.length < 320; i++) {
        var a = rnd(0, 6.283), v = rnd(vel * 0.3, vel);
        parts.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - vel * 0.2, g: grav, l: rnd(vida * 0.6, vida), l0: vida, c: cores[Math.floor(Math.random() * cores.length)], r: rnd(r * 0.6, r) });
      }
    }
    function texto(s, x, y, c, sz) { flut.push({ s: s, x: x, y: y, c: c, sz: sz || 18, l: 1 }); }
    function mult() { return NIVEIS[dif].p; }
    function bom(n) {
      for (var k = 0; k < n; k++) {
        combo++; comboT = 3.2;
        var pts = Math.round(100 * Math.min(combo, 10) * mult()); score += pts;
        var p = pos();
        burst(p[0], p[1], 14, ['#ffe9a8', '#ffd88a', '#ffffff', CORES[0]], 150, 120, 0.7, 3);
        aneis.push({ x: p[0], y: p[1], r: 8, l: 0.45, c: '#ffe9a8' });
        texto('+' + pts, p[0], p[1] - 14, '#ffe9a8', combo >= 5 ? 24 : 19);
        if (combo >= 3) texto('×' + combo, p[0], p[1] - 40, '#ffb86a', 16);
        SOM.bom(combo);
      }
    }
    function mau() {
      combo = 0; comboT = 0; shake = 0.35; shT = 0.35; flash = { c: '255,70,50', a: 0.32 };
      var p = pos(); burst(p[0], p[1], 22, ['#ff6a4a', '#ffb36b', '#ff3a2a'], 200, 160, 0.6, 3);
      SOM.mau();
    }
    function comecar() {
      score = 0; combo = 0; comboT = 0; tPlay = 0; novo = false; prev = {}; grace = 0.5;
      var h = api.h; burst(api.w / 2, h / 2, 26, CORES.concat(['#ffe9a8']), 220, 40, 0.8, 3); SOM.inicio();
    }
    function vencer() {
      var b = Math.round((500 + Math.max(0, 60 - tPlay) * 10) * mult()); score += b;
      for (var i = 0; i < 5; i++) burst(rnd(api.w * 0.2, api.w * 0.8), rnd(api.h * 0.2, api.h * 0.5), 26, ['#ffd88a', '#ffffff', '#ff9ad7', '#9ad7ff', '#8dffc9'], 240, 180, 1.4, 3.4);
      flash = { c: '255,216,138', a: 0.35 }; SOM.vitoria(); fecharPts();
    }
    function perder() {
      shake = 0.7; shT = 0.7; flash = { c: '255,50,40', a: 0.4 };
      burst(api.w / 2, api.h / 2, 40, ['#ff6a4a', '#5a2a2a', '#ffb36b'], 260, 200, 1, 3.6); SOM.derrota(); fecharPts();
    }
    function fecharPts() {
      if (score > best) { best = score; novo = score > 0; lsSet('bt_rec_' + id + '_' + dif, String(best)); } else novo = false;
    }
    function parse(s, y) {
      var m = /^(.*?)[\s:]*(\d+)(?:\s*\/\s*\d+)?\s*$/.exec(s);
      if (!m) return null;
      var lab = m[1].replace(/[:\s]+$/, '').toLowerCase();
      if (lab.length < 3 || RE_IGN.test(lab) || /%/.test(s)) return null;
      var seg = y >= 50, bad = RE_BAD.test(lab) || (seg && !RE_BOM2.test(lab));
      return { k: lab, v: parseInt(m[2], 10), bad: bad };
    }
    return {
      dbg: function () { return { score: score, combo: combo, est: est, best: best, dif: dif, parts: parts.length }; },
      nivel: function () { return dif; },
      mult: function () { return NIVEIS[dif].m; },
      estado: function () { return est; },
      ini: function () { linhas = []; marca = null; },
      txt: function (s, x, y, a) { if (a === 'left' && x < 40 && y < 90 && typeof s === 'string') linhas.push([s, y]); },
      cartaz: function (cor, rod) { marca = { c: cor, r: rod }; },
      toque: function (x, y) { audio(); ux = x; uy = y; ut = api.clock; aneis.push({ x: x, y: y, r: 4, l: 0.3, c: 'rgba(255,255,255,.8)' }); if (est === 'play') SOM.tap(); },
      menuClique: function (x, y) {
        if (est !== 'menu') return false;
        var g2 = pills();
        if (y < g2.y0 - 6) return false;
        for (var i = 0; i < 4; i++) { var px = g2.x0 + i * (g2.pw + 8); if (x >= px && x <= px + g2.pw) { dif = i; lsSet('bt_dif', String(i)); best = parseInt(lsGet('bt_rec_' + id + '_' + dif), 10) || 0; SOM.nivel(); aneis.push({ x: px + g2.pw / 2, y: g2.y0 + 15, r: 6, l: 0.35, c: '#ffd88a' }); return true; } }
        return true;
      },
      fim: function (dt) {
        /* estado a partir do cartaz desenhado neste quadro */
        var novoEst = 'play';
        if (marca && marca.r) novoEst = (marca.c === '#ff9a8d') ? 'lose' : (marca.c === '#ffd88a' || marca.c === '#ffd84a') ? 'win' : 'menu';
        if (novoEst !== est) {
          var ant = est; est = novoEst;
          if (est === 'play') comecar(); else if (est === 'win' && ant === 'play') vencer(); else if (est === 'lose' && ant === 'play') perder();
          if (est === 'menu') best = parseInt(lsGet('bt_rec_' + id + '_' + dif), 10) || 0;
        }
        if (dt <= 0) return;
        if (est === 'play') {
          tPlay += dt; if (grace > 0) grace -= dt;
          if (comboT > 0) { comboT -= dt; if (comboT <= 0) combo = 0; }
          var now = {}, i, p;
          for (i = 0; i < linhas.length; i++) { p = parse(linhas[i][0], linhas[i][1]); if (p) now[p.k] = p; }
          for (var k in now) {
            if (grace <= 0 && prev[k] !== undefined && now[k].v !== prev[k]) {
              if (now[k].bad) mau(); else if (now[k].v > prev[k]) bom(Math.min(3, now[k].v - prev[k]));
            }
            prev[k] = now[k].v;
          }
        }
      },
      tick: function (dt) {
        var i, p, w = api.w, h = api.h;
        if (shT > 0) shT -= dt; if (shT <= 0) shake = 0;
        if (flash) { flash.a -= dt * 0.9; if (flash.a <= 0) flash = null; }
        for (i = parts.length - 1; i >= 0; i--) { p = parts[i]; p.l -= dt; if (p.l <= 0) { parts.splice(i, 1); continue; } p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt; }
        for (i = aneis.length - 1; i >= 0; i--) { aneis[i].l -= dt; aneis[i].r += 130 * dt; if (aneis[i].l <= 0) aneis.splice(i, 1); }
        for (i = flut.length - 1; i >= 0; i--) { flut[i].l -= dt * 0.9; flut[i].y -= 38 * dt; if (flut[i].l <= 0) flut.splice(i, 1); }
        for (i = 0; i < amb.length; i++) {
          p = amb[i]; p.ph += dt; p.x += (p.vx + Math.sin(p.ph) * 8) * dt; p.y += p.vy * dt;
          if (p.y < -10 || p.y > h + 10 || p.x < -10 || p.x > w + 10) amb[i] = spawnAmb();
        }
      },
      antes: function () { if (shake > 0) { var s = shake * 14; g.save(); g.translate(rnd(-s, s), rnd(-s, s)); return true; } return false; },
      depois: function (tremeu) {
        var w = api.w, h = api.h, i, p, t = api.clock;
        /* ambiente do tema, sempre discreto */
        if (tema === 'mitos') {
          for (i = 0; i < 3; i++) {
            var gr = g.createLinearGradient(0, 0, 0, h * 0.34); gr.addColorStop(0, 'rgba(' + ['120,255,190', '130,190,255', '200,150,255'][i] + ',0.16)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
            g.fillStyle = gr; g.beginPath(); g.moveTo(0, 0);
            for (var x = 0; x <= w + 24; x += 24) g.lineTo(x, h * 0.06 + i * 16 + Math.sin(x * 0.012 + t * 0.5 + i * 1.7) * 14 + h * 0.08);
            g.lineTo(w, 0); g.fill();
          }
        }
        for (i = 0; i < amb.length; i++) {
          p = amb[i];
          if (tema === 'sagas') { g.globalAlpha = 0.5 + 0.3 * Math.sin(p.ph * 3); g.fillStyle = '#ffa24a'; }
          else if (tema === 'viking') { g.globalAlpha = 0.55; g.fillStyle = '#ffffff'; }
          else if (tema === 'contos') { g.globalAlpha = 0.3 + 0.5 * Math.abs(Math.sin(p.ph)); g.fillStyle = '#e5ff9a'; }
          else { g.globalAlpha = 0.25 + 0.5 * Math.abs(Math.sin(p.ph * 1.3)); g.fillStyle = '#cfe9ff'; }
          g.beginPath(); g.arc(p.x, p.y, p.r, 0, 6.283); g.fill();
        }
        g.globalAlpha = 1;
        /* anéis, partículas e textos flutuantes */
        for (i = 0; i < aneis.length; i++) { var a = aneis[i]; g.globalAlpha = Math.max(0, a.l * 2); g.strokeStyle = a.c; g.lineWidth = 2; g.beginPath(); g.arc(a.x, a.y, a.r, 0, 6.283); g.stroke(); }
        for (i = 0; i < parts.length; i++) { p = parts[i]; g.globalAlpha = Math.max(0, Math.min(1, p.l / p.l0 * 1.4)); g.fillStyle = p.c; g.fillRect(p.x - p.r, p.y - p.r, p.r * 2, p.r * 2); }
        g.globalAlpha = 1;
        for (i = 0; i < flut.length; i++) { var f = flut[i]; g.globalAlpha = Math.max(0, Math.min(1, f.l * 1.6)); api.txt0(f.s, f.x, f.y, f.sz, f.c, 'center'); }
        g.globalAlpha = 1;
        if (tremeu) g.restore();
        /* vinheta + flash */
        var v = g.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.45, w / 2, h / 2, Math.max(w, h) * 0.75); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.30)'); g.fillStyle = v; g.fillRect(0, 0, w, h);
        if (flash) { g.fillStyle = 'rgba(' + flash.c + ',' + Math.max(0, flash.a) + ')'; g.fillRect(0, 0, w, h); }
        /* pontos no topo */
        if (est === 'play') {
          if (w >= 640) {
            api.txt0('★ ' + score, w / 2, 26, 16, '#ffe9a8', 'center');
            if (combo >= 2) api.txt0('×' + combo + (comboT < 1 ? '…' : ''), w / 2, 46, 13, '#ffb86a', 'center');
          } else api.txt0('★ ' + score + (combo >= 2 ? '   ×' + combo : ''), 16, h - 14, 14, '#ffe9a8', 'left');
        }
        /* menu: dificuldade; fim: resumo */
        if (est === 'menu') {
          var P = pills(), n;
          if (best > 0) api.txt0(TX.rec + ': ' + best, w / 2, P.y0 - 12, 13, '#c9b3f2', 'center');
          for (n = 0; n < 4; n++) {
            var px = P.x0 + n * (P.pw + 8);
            g.fillStyle = n === dif ? '#ffd88a' : 'rgba(255,255,255,.14)'; rr(px, P.y0, P.pw, 30, 15); g.fill();
            api.txt0(TX.dif[n], px + P.pw / 2, P.y0 + 20, 13, n === dif ? '#2a1c0a' : '#e9e1f7', 'center');
          }
        } else if (est === 'win' || est === 'lose') {
          if (novo) api.txt0(TX.novo, w / 2, h - 56, 17, '#ffd88a', 'center');
          api.txt0('★ ' + score + '  ·  ' + TX.rec + ' ' + best + '  ·  ' + TX.dif[dif], w / 2, h - 30, 14, '#e9e1f7', 'center');
        }
      }
    };
    function pills() { var pw = Math.min(104, (api.w - 40) / 4 - 8), tot = pw * 4 + 24; return { pw: pw, x0: (api.w - tot) / 2, y0: api.h - 48 }; }
    function rr(x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
  }
  function alternarMudo() { MUDO = !MUDO; lsSet('bt_mudo', MUDO ? '1' : '0'); return MUDO; }

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
    var bSom = botao('jogo-som', MUDO ? '🔇' : '🔊', function () { bSom.textContent = alternarMudo() ? '🔇' : '🔊'; }); bSom.setAttribute('aria-label', TX.som);

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
      fx.toque(p[0], p[1]);
      if (fx.menuClique(p[0], p[1])) return;
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
    var fx = criarFx(def.canvas, api, g);
    api.txt0 = api.txt; var cartaz0 = api.cartaz;
    api.txt = function (s, x, y, size, cor, alinh) { fx.txt(s, x, y, alinh); return api.txt0(s, x, y, size, cor, alinh); };
    api.cartaz = function (t, l, r, c) { fx.cartaz(c, r); return cartaz0(t, l, r, c); };
    jogo = def.criar(api);
    medir();
    var ultimo = 0;
    function quadro(ts) {
      var dt = Math.min(0.05, (ts - ultimo) / 1000 || 0); ultimo = ts;
      var dtj = dt * fx.mult();
      fx.ini();
      if (!pausado) { api.clock += dtj; if (jogo.update) jogo.update(dtj); fx.tick(dt); }
      g.setTransform(api.dpr * api.u, 0, 0, api.dpr * api.u, 0, 0);
      g.clearRect(0, 0, api.w, api.h);
      var tr = fx.antes();
      jogo.draw();
      fx.fim(pausado ? 0 : dt);
      fx.depois(tr);
      if (pausado) {
        g.fillStyle = 'rgba(10,8,25,.7)'; g.fillRect(0, 0, api.w, api.h);
        api.txt(UI.pausado, api.w / 2, api.h / 2 - 6, 40, '#fff');
        api.txt(UI.retomar, api.w / 2, api.h / 2 + 34, 18, '#c9b3f2');
      }
      requestAnimationFrame(quadro);
    }
    requestAnimationFrame(quadro);
    window['__jogo_' + def.canvas] = { fx: fx, api: api, jogo: jogo, entrar: entrar, sair: sair };
  }
  window.BTJogo = { registrar: registrar };
})();
