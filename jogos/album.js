/* Galeria Épica e Álbum de Figurinhas — The Boreal Times
   Uma figurinha por história. Tudo roda no navegador; o progresso fica salvo
   no próprio aparelho (localStorage). Sem bibliotecas. */
(function () {
  'use strict';
  var host = document.getElementById('saga'), root = document.getElementById('saga-app');
  var CAT = window.BT_CAT;
  if (!host || !root || !CAT) return;
  var L = host.getAttribute('data-lang') || 'pt', MODO = host.getAttribute('data-modo') || 'galeria';
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ITENS = CAT.itens, TOTAL = CAT.total, POR = {};
  ITENS.forEach(function (x) { POR[x.i] = x; });

  var TXT = {
    pt: {
      reinos: ['Mitos e Deuses', 'Sagas e Reis', 'Era Viking', 'Contos e Folclore'],
      rar: ['Comum', 'Rara', 'Épica', 'Lendária'],
      busca: 'Buscar história', todos: 'Todos', natureza: 'Natureza', raridade: 'Raridade', reino: 'Reino',
      nada: 'Nenhuma história encontrada com esses filtros.', limpar: 'Limpar filtros', mais: 'Mostrar mais',
      mostrando: function (a, b) { return 'Mostrando ' + a + ' de ' + b; }, ler: 'Ler a história', fechar: 'Fechar',
      ant: 'Anterior', prox: 'Próxima', num: 'Figurinha', tenho: 'Na sua coleção', ir_album: 'Abrir o álbum', ir_gal: 'Ver a galeria',
      figs: 'figurinhas coladas', pacotes: 'Pacotes', brasas: 'Brasas', abrir: 'Abrir pacote', sem_pacote: 'Sem pacotes agora',
      como: 'Como ganhar pacotes', como1: 'Um pacote grátis por dia (guarda até 3).', como2: 'Um pacote por jogo vencido, uma vez por jogo.', como3: 'Dez brasas na Fogueira viram um pacote.',
      volta: 'O próximo pacote diário chega amanhã.', cheio: 'Você já guarda o máximo de pacotes diários.',
      bolsa: 'Sua bolsa', bolsa_vazia: 'Nenhuma figurinha para colar. Abra um pacote.', colar_todas: 'Colar todas',
      dica_sel: function (n) { return 'Figurinha ' + n + ' escolhida. Toque no espaço marcado do álbum, ou arraste.'; },
      dica_bolsa: 'Toque numa figurinha da bolsa e depois no espaço dela, ou arraste até lá.',
      espaco: 'Espaço', vazio: 'vazio', colada: 'colada', errado: 'Esse não é o espaço dessa figurinha.',
      fogueira: 'Fogueira', fog_txt: 'Figurinhas repetidas viram brasas: comum 1, rara 2, épica 4, lendária 8. Cada 10 brasas acendem um pacote novo.',
      forjar: 'Acender pacote (10 brasas)', forjou: 'A Fogueira acendeu um pacote novo.',
      nova: 'Nova', repetida: 'Repetida', revelar: 'Revelar tudo', continuar: 'Guardar na bolsa', pacote_t: 'Seu pacote',
      toque_virar: 'Toque para virar', vol_ok: function (v) { return 'Volume completo: ' + v + '!'; },
      alb_ok: 'Álbum completo! Você reuniu todas as histórias.',
      ganhou: function (n) { return n === 1 ? 'Você ganhou 1 pacote por vencer um jogo.' : 'Você ganhou ' + n + ' pacotes por vencer jogos.'; },
      exportar: 'Exportar coleção', importar: 'Importar coleção', apagar: 'Apagar meu álbum', confirma: 'Toque de novo para confirmar',
      importou: 'Coleção importada e somada à sua.', imp_erro: 'Arquivo inválido.', apagou: 'Álbum apagado deste aparelho.',
      priv: 'Sem conta, seu álbum fica salvo só neste aparelho, no navegador, e nada é enviado. Use Exportar para levar a coleção a outro aparelho. Limpar os dados do navegador apaga tudo.',
      sem_storage: 'Este navegador não permite salvar dados. O álbum funciona só enquanto esta página estiver aberta.',
      jg: 'Jogos', jogos: '/pt/jogos/', galeria: '/pt/galeria/', album: '/pt/album/', conta_t: 'Conta',
      c_txt: 'Entre com seu e-mail para levar o álbum a outros aparelhos. Sem senha: você recebe um link.', c_email: 'Seu e-mail', c_aceite: 'Aceito que o Boreal Saga Play guarde meu e-mail e o progresso do meu álbum para sincronizar entre aparelhos. Posso sair e apagar tudo quando quiser.',
      c_enviar: 'Enviar link de acesso', c_enviado: 'Se o e-mail estiver correto, o link chegou. Ele vale por 15 minutos.', c_con: function (e) { return 'Conectado como ' + e; }, c_sync: 'Sincronizar agora', c_sync_ok: 'Álbum sincronizado.',
      c_sair: 'Sair da conta', c_apagar: 'Apagar conta e dados', c_apagou: 'Conta e dados apagados do servidor.', c_erro: 'Não foi possível falar com o servidor. Tente de novo mais tarde.', c_link_inv: 'Esse link venceu ou já foi usado. Peça outro.', c_ent: 'Você entrou. Seu álbum foi sincronizado.', c_email_inv: 'Confira o e-mail e marque o aceite.',
      volta_b: 'Voltar', fs: 'Tela cheia', fs_sair: 'Sair da tela cheia', menu_g: 'Galeria', menu_a: 'Álbum', home: '/pt/',
      completo: 'completo', vol: 'Volume'
    },
    en: {
      reinos: ['Myths & Gods', 'Sagas & Kings', 'Viking Age', 'Tales & Folklore'],
      rar: ['Common', 'Rare', 'Epic', 'Legendary'],
      busca: 'Search stories', todos: 'All', natureza: 'Nature', raridade: 'Rarity', reino: 'Realm',
      nada: 'No stories match these filters.', limpar: 'Clear filters', mais: 'Show more',
      mostrando: function (a, b) { return 'Showing ' + a + ' of ' + b; }, ler: 'Read the story', fechar: 'Close',
      ant: 'Previous', prox: 'Next', num: 'Sticker', tenho: 'In your collection', ir_album: 'Open the album', ir_gal: 'See the gallery',
      figs: 'stickers stuck', pacotes: 'Packs', brasas: 'Embers', abrir: 'Open pack', sem_pacote: 'No packs right now',
      como: 'How to get packs', como1: 'One free pack a day (stores up to 3).', como2: 'One pack for each game you win, once per game.', como3: 'Ten embers in the Bonfire light a pack.',
      volta: 'The next daily pack arrives tomorrow.', cheio: 'You are already holding the maximum of daily packs.',
      bolsa: 'Your bag', bolsa_vazia: 'No stickers to stick. Open a pack.', colar_todas: 'Stick all',
      dica_sel: function (n) { return 'Sticker ' + n + ' selected. Tap the highlighted space in the album, or drag it there.'; },
      dica_bolsa: 'Tap a sticker in the bag and then its space, or drag it there.',
      espaco: 'Space', vazio: 'empty', colada: 'stuck', errado: 'That is not the space for this sticker.',
      fogueira: 'Bonfire', fog_txt: 'Duplicate stickers turn into embers: common 1, rare 2, epic 4, legendary 8. Every 10 embers light a new pack.',
      forjar: 'Light a pack (10 embers)', forjou: 'The Bonfire lit a new pack.',
      nova: 'New', repetida: 'Duplicate', revelar: 'Reveal all', continuar: 'Put in the bag', pacote_t: 'Your pack',
      toque_virar: 'Tap to flip', vol_ok: function (v) { return 'Volume complete: ' + v + '!'; },
      alb_ok: 'Album complete! You gathered every story.',
      ganhou: function (n) { return n === 1 ? 'You earned 1 pack for winning a game.' : 'You earned ' + n + ' packs for winning games.'; },
      exportar: 'Export collection', importar: 'Import collection', apagar: 'Delete my album', confirma: 'Tap again to confirm',
      importou: 'Collection imported and merged with yours.', imp_erro: 'Invalid file.', apagou: 'Album deleted from this device.',
      priv: 'Without an account, your album is saved only on this device, in the browser, and nothing is sent. Use Export to take the collection to another device. Clearing browser data erases everything.',
      sem_storage: 'This browser does not allow saving data. The album works only while this page stays open.',
      jg: 'Games', jogos: '/games/', galeria: '/gallery/', album: '/album/', conta_t: 'Account',
      c_txt: 'Sign in with your email to take the album to other devices. No password: you get a link.', c_email: 'Your email', c_aceite: 'I agree that Boreal Saga Play stores my email and my album progress to sync between devices. I can sign out and delete everything at any time.',
      c_enviar: 'Send sign-in link', c_enviado: 'If the email is correct, the link has arrived. It is valid for 15 minutes.', c_con: function (e) { return 'Signed in as ' + e; }, c_sync: 'Sync now', c_sync_ok: 'Album synced.',
      c_sair: 'Sign out', c_apagar: 'Delete account and data', c_apagou: 'Account and data deleted from the server.', c_erro: 'Could not reach the server. Try again later.', c_link_inv: 'This link has expired or was already used. Ask for another.', c_ent: 'You are signed in. Your album was synced.', c_email_inv: 'Check the email and tick the agreement.',
      volta_b: 'Back', fs: 'Full screen', fs_sair: 'Exit full screen', menu_g: 'Gallery', menu_a: 'Album', home: '/',
      completo: 'complete', vol: 'Volume'
    },
    no: {
      reinos: ['Myter og guder', 'Sagaer og konger', 'Vikingtid', 'Eventyr og folketro'],
      rar: ['Vanlig', 'Sjelden', 'Episk', 'Legendarisk'],
      busca: 'Søk i historier', todos: 'Alle', natureza: 'Art', raridade: 'Sjeldenhet', reino: 'Rike',
      nada: 'Ingen historier passer med disse filtrene.', limpar: 'Fjern filtre', mais: 'Vis flere',
      mostrando: function (a, b) { return 'Viser ' + a + ' av ' + b; }, ler: 'Les historien', fechar: 'Lukk',
      ant: 'Forrige', prox: 'Neste', num: 'Klistremerke', tenho: 'I samlingen din', ir_album: 'Åpne albumet', ir_gal: 'Se galleriet',
      figs: 'klistremerker limt inn', pacotes: 'Pakker', brasas: 'Glør', abrir: 'Åpne pakke', sem_pacote: 'Ingen pakker nå',
      como: 'Slik får du pakker', como1: 'En gratis pakke hver dag (du kan spare opptil 3).', como2: 'En pakke for hvert spill du vinner, én gang per spill.', como3: 'Ti glør i Bålet tenner en pakke.',
      volta: 'Neste daglige pakke kommer i morgen.', cheio: 'Du har allerede det høyeste antallet daglige pakker.',
      bolsa: 'Posen din', bolsa_vazia: 'Ingen klistremerker å lime. Åpne en pakke.', colar_todas: 'Lim inn alle',
      dica_sel: function (n) { return 'Klistremerke ' + n + ' valgt. Trykk på det markerte feltet i albumet, eller dra det dit.'; },
      dica_bolsa: 'Trykk på et klistremerke i posen og deretter på feltet, eller dra det dit.',
      espaco: 'Felt', vazio: 'tomt', colada: 'limt inn', errado: 'Dette er ikke feltet til dette klistremerket.',
      fogueira: 'Bålet', fog_txt: 'Duplikater blir til glør: vanlig 1, sjelden 2, episk 4, legendarisk 8. Hver 10. glør tenner en ny pakke.',
      forjar: 'Tenn en pakke (10 glør)', forjou: 'Bålet tente en ny pakke.',
      nova: 'Ny', repetida: 'Duplikat', revelar: 'Avslør alle', continuar: 'Legg i posen', pacote_t: 'Pakken din',
      toque_virar: 'Trykk for å snu', vol_ok: function (v) { return 'Bind ferdig: ' + v + '!'; },
      alb_ok: 'Albumet er komplett! Du har samlet alle historiene.',
      ganhou: function (n) { return n === 1 ? 'Du fikk 1 pakke for å vinne et spill.' : 'Du fikk ' + n + ' pakker for å vinne spill.'; },
      exportar: 'Eksporter samlingen', importar: 'Importer samlingen', apagar: 'Slett albumet mitt', confirma: 'Trykk igjen for å bekrefte',
      importou: 'Samlingen er importert og lagt til din.', imp_erro: 'Ugyldig fil.', apagou: 'Albumet er slettet fra denne enheten.',
      priv: 'Uten konto lagres albumet ditt bare på denne enheten, i nettleseren, og ingenting sendes. Bruk Eksporter for å ta samlingen med til en annen enhet. Hvis du sletter nettleserdata, forsvinner alt.',
      sem_storage: 'Denne nettleseren tillater ikke lagring av data. Albumet fungerer bare mens siden er åpen.',
      jg: 'Spill', jogos: '/no/spill/', galeria: '/no/galleri/', album: '/no/album/', conta_t: 'Konto',
      c_txt: 'Logg inn med e-posten din for å ta albumet med til andre enheter. Uten passord: du får en lenke.', c_email: 'E-posten din', c_aceite: 'Jeg samtykker til at Boreal Saga Play lagrer e-posten min og albumfremgangen min for synkronisering mellom enheter. Jeg kan logge ut og slette alt når som helst.',
      c_enviar: 'Send innloggingslenke', c_enviado: 'Hvis e-posten er riktig, er lenken sendt. Den gjelder i 15 minutter.', c_con: function (e) { return 'Logget inn som ' + e; }, c_sync: 'Synkroniser nå', c_sync_ok: 'Albumet er synkronisert.',
      c_sair: 'Logg ut', c_apagar: 'Slett konto og data', c_apagou: 'Konto og data er slettet fra serveren.', c_erro: 'Kunne ikke nå serveren. Prøv igjen senere.', c_link_inv: 'Denne lenken er utløpt eller allerede brukt. Be om en ny.', c_ent: 'Du er logget inn. Albumet ditt er synkronisert.', c_email_inv: 'Sjekk e-posten og kryss av for samtykket.',
      volta_b: 'Tilbake', fs: 'Fullskjerm', fs_sair: 'Avslutt fullskjerm', menu_g: 'Galleri', menu_a: 'Album', home: '/no/',
      completo: 'komplett', vol: 'Bind'
    }
  };
  // Espanhol: herda o inglês até a tradução completa; já troca a navegação.
  TXT.es = Object.assign({}, TXT.en, {
    jg: 'Juegos', jogos: '/es/juegos/', galeria: '/es/galeria/', album: '/es/album/', home: '/es/',
    menu_g: 'Galería', menu_a: 'Álbum', volta_b: 'Volver', fs: 'Pantalla completa', fs_sair: 'Salir de pantalla completa',
    completo: 'completo', vol: 'Volumen', conta_t: 'Cuenta'
  });
  var TX = TXT[L] || TXT.en;
  var NATS = []; ITENS.forEach(function (x) { if (x.k && NATS.indexOf(x.k) < 0) NATS.push(x.k); });

  /* ---------- tela imersiva com imagem de fundo ---------- */
  var FUNDOS = CAT.fundos || [], camada = 0, camadas = [], fundoAtual = '';
  function fundo(i) {
    var u = FUNDOS[i] || FUNDOS.filter(Boolean)[0] || ''; if (!u || u === fundoAtual || !camadas.length) return;
    fundoAtual = u; camada = 1 - camada;
    camadas[camada].style.backgroundImage = 'url("' + u + '")';
    camadas[camada].classList.add('on'); camadas[1 - camada].classList.remove('on');
  }
  function imersivo() {
    document.body.classList.add('sg-imersivo');
    var f = document.createElement('div'); f.className = 'sg-fundo'; f.setAttribute('aria-hidden', 'true');
    f.innerHTML = '<i></i><i></i><b></b>'; host.insertBefore(f, host.firstChild); camadas = [].slice.call(f.querySelectorAll('i'));
    var top = document.createElement('div'); top.className = 'sg-top';
    top.innerHTML = '<a class="sg-home" href="' + TX.jogos + '">Boreal Saga Play</a><nav class="sg-top-nav">' +
      '<a href="' + TX.galeria + '"' + (MODO === 'galeria' ? ' aria-current="page"' : '') + '>' + esc(TX.menu_g) + '</a>' +
      '<a href="' + TX.album + '"' + (MODO === 'album' ? ' aria-current="page"' : '') + '>' + esc(TX.menu_a) + '</a>' +
      '<a href="' + TX.jogos + '">' + esc(TX.jg) + '</a></nav>' +
      '<button type="button" class="sg-fs" hidden></button><button type="button" class="sg-volta">← ' + esc(TX.volta_b) + '</button>';
    host.insertBefore(top, f.nextSibling);
    top.querySelector('.sg-volta').onclick = function () {
      var mesmo = false; try { mesmo = document.referrer && new URL(document.referrer).origin === location.origin; } catch (e) {}
      if (mesmo && history.length > 1) history.back(); else location.href = TX.home;
    };
    var b = top.querySelector('.sg-fs'), el0 = host;
    var pode = !!(el0.requestFullscreen || el0.webkitRequestFullscreen);
    function rot() { var on = document.fullscreenElement || document.webkitFullscreenElement; b.textContent = '⛶ ' + (on ? TX.fs_sair : TX.fs); b.setAttribute('aria-pressed', on ? 'true' : 'false'); }
    if (pode) {
      b.hidden = false; rot();
      b.onclick = function () {
        var on = document.fullscreenElement || document.webkitFullscreenElement;
        try { if (on) (document.exitFullscreen || document.webkitExitFullscreen).call(document); else (el0.requestFullscreen || el0.webkitRequestFullscreen).call(el0); } catch (e) {}
      };
      document.addEventListener('fullscreenchange', rot); document.addEventListener('webkitfullscreenchange', rot);
    }
  }
  imersivo();

  /* ---------- utilidades ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function pad(n) { n = String(n); return n.length < 3 ? ('000' + n).slice(-3) : n; }
  function mini(m) { return m ? m.replace('/materias/', '/materias/mini/') : ''; }
  function img(x, cls, grande) {
    if (!x.m) return '<span class="' + cls + ' sg-semimg" aria-hidden="true">ᚠ</span>';
    var src = grande ? x.m : mini(x.m);
    return '<img class="' + cls + '" src="' + esc(src) + '" alt="" loading="lazy" decoding="async"' + (grande ? '' : ' onerror="this.onerror=null;this.src=\'' + esc(x.m) + '\'"') + '>';
  }
  function cred(x) { return x.c != null ? x.c : CAT.cred; }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function rnd() {
    try { var a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] / 4294967296; } catch (e) { return Math.random(); }
  }
  var ST_OK = true;
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { ST_OK = false; return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { ST_OK = false; return false; } }
  function lsDel(k) { try { localStorage.removeItem(k); } catch (e) { ST_OK = false; } }

  /* ---------- estado ---------- */
  var KEY = 'bt_alb_v1', CAP_DIA = 3, CUSTO_FOG = 10, BRASA = [1, 2, 4, 8], PESO = [60, 25, 11, 4];
  function vazio() { return { v: 1, stuck: {}, bag: {}, dpk: 0, wpk: 0, day: '', won: {}, ember: 0, opened: 0, seals: {}, t: 0 }; }
  function limpa(s) {
    var o = vazio();
    if (!s || s.v !== 1) return o;
    ['stuck', 'bag', 'won', 'seals'].forEach(function (k) {
      var src = s[k] || {};
      Object.keys(src).forEach(function (id) { if (k === 'won' || k === 'seals' || POR[id]) o[k][id] = 1; });
    });
    Object.keys(o.stuck).forEach(function (id) { delete o.bag[id]; });
    ['dpk', 'wpk', 'ember', 'opened', 't'].forEach(function (k) { var n = parseInt(s[k], 10); o[k] = n > 0 ? n : 0; });
    o.dpk = Math.min(o.dpk, CAP_DIA);
    o.day = typeof s.day === 'string' ? s.day.slice(0, 10) : '';
    return o;
  }
  var S;
  try { S = limpa(JSON.parse(lsGet(KEY) || 'null')); } catch (e) { S = vazio(); }
  var SEM_SALVAR = false, aoSalvar = null;
  function salvar() { S.t = Date.now(); if (!lsSet(KEY, JSON.stringify(S))) SEM_SALVAR = true; if (aoSalvar) aoSalvar(); }
  function paraObj() { return { app: 'boreal-album', v: 1, stuck: Object.keys(S.stuck), bag: Object.keys(S.bag), won: Object.keys(S.won), dpk: S.dpk, wpk: S.wpk, ember: S.ember, day: S.day, opened: S.opened }; }
  /* Junta dados de outro aparelho (ou arquivo) aos daqui: nunca perde figurinha. */
  function mesclar(o) {
    (o.stuck || []).forEach(function (id) { if (POR[id]) { S.stuck[id] = 1; delete S.bag[id]; } });
    (o.bag || []).forEach(function (id) { if (POR[id] && !S.stuck[id]) S.bag[id] = 1; });
    (o.won || []).forEach(function (id) { if (typeof id === 'string' && id.length < 80) S.won[id] = 1; });
    S.wpk = Math.max(S.wpk, Math.min(999, parseInt(o.wpk, 10) || 0));
    S.dpk = Math.max(S.dpk, Math.min(CAP_DIA, parseInt(o.dpk, 10) || 0));
    S.ember = Math.max(S.ember, Math.min(9999, parseInt(o.ember, 10) || 0));
    if (typeof o.day === 'string' && o.day > S.day) S.day = o.day.slice(0, 10);
    S.opened = Math.max(S.opened, parseInt(o.opened, 10) || 0);
  }
  function hoje() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function diasEntre(a, b) { var p = a.split('-'), q = b.split('-'); return Math.round((Date.UTC(+q[0], +q[1] - 1, +q[2]) - Date.UTC(+p[0], +p[1] - 1, +p[2])) / 864e5); }
  function qtdColadas() { return Object.keys(S.stuck).length; }
  function possui(id) { return !!(S.stuck[id] || S.bag[id]); }
  function pacotes() { return S.dpk + S.wpk; }

  /* Pacotes: um por dia (guarda até 3) e um por jogo vencido (uma vez por jogo). */
  function creditar() {
    var h = hoje(), ganhos = 0;
    if (S.day !== h) {
      var d = S.day ? Math.max(0, diasEntre(S.day, h)) : 1;
      S.dpk = Math.min(CAP_DIA, S.dpk + Math.min(d, CAP_DIA)); S.day = h;
    }
    var validos = {};
    try { var J = window.BT_JOGOS || {}; Object.keys(J).forEach(function (l) { J[l].forEach(function (g) { validos[g[0]] = 1; }); }); } catch (e) {}
    var tem = Object.keys(validos).length > 0;
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (!k || k.indexOf('bt_med_') !== 0) continue;
        var rest = k.slice(7), cut = rest.lastIndexOf('_'); if (cut < 1) continue;
        var id = rest.slice(0, cut);
        if (tem ? !validos[id] : id.indexOf('jogo-') !== 0) continue;
        if (!(parseInt(localStorage.getItem(k), 10) > 0) || S.won[id]) continue;
        S.won[id] = 1; S.wpk++; ganhos++;
      }
    } catch (e) {}
    salvar();
    return ganhos;
  }

  /* ---------- sorteio ---------- */
  function sortear(exigeNova, extra) {
    var cand = ITENS.filter(function (x) { return !possui(x.i) && !extra[x.i]; });
    if (!exigeNova || !cand.length) cand = ITENS;
    var por = [[], [], [], []], tot = 0;
    cand.forEach(function (x) { por[x.q].push(x); });
    for (var q = 0; q < 4; q++) if (por[q].length) tot += PESO[q];
    var r = rnd() * tot, qq = 0;
    for (q = 0; q < 4; q++) { if (!por[q].length) continue; if (r < PESO[q]) { qq = q; break; } r -= PESO[q]; qq = q; }
    var lista = por[qq];
    return lista[Math.floor(rnd() * lista.length)];
  }
  function abrirPacote() {
    if (pacotes() < 1) return null;
    if (S.dpk > 0) S.dpk--; else S.wpk--;
    var novos = {}, cartas = [];
    var faltam = ITENS.some(function (x) { return !possui(x.i); });
    for (var k = 0; k < 3; k++) {
      var x = sortear(faltam && (k === 0 || rnd() < 0.5), novos);
      var nova = !possui(x.i) && !novos[x.i];
      if (nova) { novos[x.i] = 1; S.bag[x.i] = 1; } else { S.ember += BRASA[x.q]; }
      cartas.push({ x: x, nova: nova, brasas: nova ? 0 : BRASA[x.q] });
    }
    S.opened++; salvar();
    return cartas;
  }
  function acenderFogueira() {
    if (S.ember < CUSTO_FOG) return false;
    S.ember -= CUSTO_FOG; S.wpk++; salvar(); return true;
  }
  function colar(id) {
    if (!S.bag[id]) return false;
    delete S.bag[id]; S.stuck[id] = 1;
    var v = POR[id].s, tot = 0, got = 0;
    ITENS.forEach(function (x) { if (x.s === v) { tot++; if (S.stuck[x.i]) got++; } });
    var msg = '';
    if (tot && got === tot && !S.seals['v' + v]) { S.seals['v' + v] = 1; msg = TX.vol_ok(TX.reinos[v]); }
    if (qtdColadas() === TOTAL && !S.seals.tudo) { S.seals.tudo = 1; msg = TX.alb_ok; }
    salvar();
    return msg || true;
  }

  /* ---------- aviso e diálogo ---------- */
  var live = el('div', 'sg-live'); live.setAttribute('role', 'status'); live.setAttribute('aria-live', 'polite'); host.appendChild(live);
  var toastT;
  function aviso(txt) {
    live.textContent = ''; var t = el('div', 'sg-toast', esc(txt)); live.appendChild(t);
    clearTimeout(toastT); toastT = setTimeout(function () { live.textContent = ''; }, 5200);
  }
  var foco, aberto = null;
  function abrirDialogo(dlg, aoFechar, inicial) {
    foco = document.activeElement; aberto = { dlg: dlg, fechar: aoFechar };
    document.body.classList.add('sg-trava');
    host.appendChild(dlg);
    (inicial || dlg.querySelector('button,a[href]') || dlg).focus();
  }
  function fecharDialogo() {
    if (!aberto) return;
    var a = aberto; aberto = null;
    if (a.dlg.parentNode) a.dlg.parentNode.removeChild(a.dlg);
    document.body.classList.remove('sg-trava');
    if (a.fechar) a.fechar();
    if (foco && foco.focus && document.contains(foco)) foco.focus();
  }
  document.addEventListener('keydown', function (e) {
    if (!aberto) return;
    if (e.key === 'Escape') { e.preventDefault(); fecharDialogo(); return; }
    if (e.key === 'Tab') {
      var f = [].slice.call(aberto.dlg.querySelectorAll('button:not([disabled]),a[href],input,select,[tabindex="0"]')).filter(function (n) { return n.offsetParent !== null; });
      if (!f.length) return;
      var a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    }
  });

  /* ---------- visor (lightbox) ---------- */
  function visor(lista, pos) {
    var x0 = lista[pos], dlg = el('div', 'sg-dlg sg-visor'); dlg.setAttribute('role', 'dialog'); dlg.setAttribute('aria-modal', 'true');
    function desenhar() {
      var x = lista[pos], c = cred(x);
      dlg.innerHTML = '<div class="sg-visor-in q' + x.q + '">' +
        '<button type="button" class="sg-x" aria-label="' + esc(TX.fechar) + '">×</button>' +
        '<figure class="sg-fig">' + (x.m ? '<img src="' + esc(x.m) + '" alt="' + esc(x.a) + '" decoding="async">' : '<span class="sg-semimg big" aria-hidden="true">ᚠ</span>') + '</figure>' +
        '<div class="sg-info"><p class="sg-sel"><span class="sg-q q' + x.q + '">' + esc(TX.rar[x.q]) + '</span> <span>' + esc(TX.num) + ' ' + pad(x.n) + ' / ' + TOTAL + '</span>' + (possui(x.i) ? ' <span class="sg-tem">✓ ' + esc(TX.tenho) + '</span>' : '') + '</p>' +
        '<h2 id="sg-v-t">' + esc(x.t) + '</h2><p class="sg-reino">' + esc(TX.reinos[x.s]) + (x.k ? ' · ' + esc(x.k) : '') + '</p>' +
        '<p class="sg-res">' + esc(x.r) + '</p>' +
        '<a class="sg-btn sg-btn-p" href="' + esc(x.u) + '">' + esc(TX.ler) + '</a>' +
        (c ? '<p class="sg-cred">' + esc(c) + '</p>' : '') + '</div>' +
        (lista.length > 1 ? '<button type="button" class="sg-nav sg-nav-a" aria-label="' + esc(TX.ant) + '">‹</button><button type="button" class="sg-nav sg-nav-p" aria-label="' + esc(TX.prox) + '">›</button>' : '') +
        '</div>';
      dlg.setAttribute('aria-labelledby', 'sg-v-t');
      dlg.querySelector('.sg-x').onclick = fecharDialogo;
      var a = dlg.querySelector('.sg-nav-a'), p = dlg.querySelector('.sg-nav-p');
      if (a) { a.onclick = function () { ir(-1); }; p.onclick = function () { ir(1); }; }
    }
    function ir(d) { pos = (pos + d + lista.length) % lista.length; var f = document.activeElement && document.activeElement.className; desenhar(); var alvo = dlg.querySelector(f && f.indexOf('sg-nav-a') >= 0 ? '.sg-nav-a' : f && f.indexOf('sg-nav-p') >= 0 ? '.sg-nav-p' : '.sg-x'); if (alvo) alvo.focus(); }
    desenhar();
    dlg.addEventListener('click', function (e) { if (e.target === dlg) fecharDialogo(); });
    dlg.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') ir(-1); else if (e.key === 'ArrowRight') ir(1); });
    var sx = null;
    dlg.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    dlg.addEventListener('touchend', function (e) { if (sx == null) return; var dx = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(dx) > 60) ir(dx < 0 ? 1 : -1); }, { passive: true });
    abrirDialogo(dlg, null, dlg.querySelector('.sg-x'));
    return x0;
  }

  /* =========================================================
     GALERIA
     ========================================================= */
  function galeria() {
    var F = { q: '', s: -1, k: '', r: -1 }, mostrar = 48, params = new URLSearchParams(location.search);
    if (params.has('secao')) { var n = parseInt(params.get('secao'), 10); if (n >= 0 && n < 4) F.s = n; }
    if (params.has('q')) F.q = String(params.get('q')).slice(0, 80);
    root.innerHTML = '';
    var bar = el('div', 'sg-filtros');
    var chips = el('div', 'sg-chips'); chips.setAttribute('role', 'group'); chips.setAttribute('aria-label', TX.reino);
    var busca = el('input', 'sg-busca'); busca.type = 'search'; busca.placeholder = TX.busca; busca.setAttribute('aria-label', TX.busca); busca.value = F.q;
    var selN = el('select', 'sg-sel-f'); selN.setAttribute('aria-label', TX.natureza);
    selN.innerHTML = '<option value="">' + esc(TX.natureza) + ': ' + esc(TX.todos) + '</option>' + NATS.map(function (n) { return '<option>' + esc(n) + '</option>'; }).join('');
    var selR = el('select', 'sg-sel-f'); selR.setAttribute('aria-label', TX.raridade);
    selR.innerHTML = '<option value="-1">' + esc(TX.raridade) + ': ' + esc(TX.todos) + '</option>' + TX.rar.map(function (n, i) { return '<option value="' + i + '">' + esc(n) + '</option>'; }).join('');
    bar.appendChild(busca); bar.appendChild(selN); bar.appendChild(selR);
    var cont = el('p', 'sg-cont'); cont.setAttribute('aria-live', 'polite');
    var grade = el('ul', 'sg-grade');
    var mais = el('button', 'sg-btn sg-mais'); mais.type = 'button'; mais.textContent = TX.mais;
    var alb = el('p', 'sg-lig'); alb.innerHTML = '<a class="sg-btn" href="' + esc(TX.album) + '">' + esc(TX.ir_album) + '</a>';
    root.appendChild(chips); root.appendChild(bar); root.appendChild(cont); root.appendChild(grade); root.appendChild(mais); root.appendChild(alb);
    var atual = [];
    function chipsHtml() {
      var tot = [ITENS.length, 0, 0, 0, 0]; ITENS.forEach(function (x) { tot[x.s + 1]++; });
      chips.innerHTML = ['<button type="button" data-s="-1" aria-pressed="' + (F.s === -1) + '">' + esc(TX.todos) + ' <small>' + tot[0] + '</small></button>']
        .concat(TX.reinos.map(function (n, i) { return '<button type="button" class="c' + i + '" data-s="' + i + '" aria-pressed="' + (F.s === i) + '">' + esc(n) + ' <small>' + tot[i + 1] + '</small></button>'; })).join('');
    }
    function filtrar() {
      var q = F.q.trim().toLowerCase();
      atual = ITENS.filter(function (x) {
        if (F.s >= 0 && x.s !== F.s) return false;
        if (F.k && x.k !== F.k) return false;
        if (F.r >= 0 && x.q !== F.r) return false;
        if (q && (x.t + ' ' + x.r).toLowerCase().indexOf(q) < 0 && pad(x.n).indexOf(q) < 0) return false;
        return true;
      });
    }
    function desenhar() {
      fundo(F.s >= 0 ? F.s : 2);
      chipsHtml(); filtrar();
      var parte = atual.slice(0, mostrar);
      grade.innerHTML = parte.map(function (x, i) {
        return '<li><button type="button" class="sg-card q' + x.q + ' r' + x.s + '" data-i="' + i + '" aria-label="' + esc(x.t + ' — ' + TX.rar[x.q] + ', ' + TX.num + ' ' + pad(x.n)) + '">' +
          '<span class="sg-card-img">' + img(x, 'sg-img') + '<span class="sg-n">' + pad(x.n) + '</span>' + (possui(x.i) ? '<span class="sg-tem-c" aria-hidden="true">✓</span>' : '') + '</span>' +
          '<span class="sg-card-t">' + esc(x.t) + '</span><span class="sg-card-m"><span class="sg-q q' + x.q + '">' + esc(TX.rar[x.q]) + '</span> ' + esc(TX.reinos[x.s]) + '</span></button></li>';
      }).join('');
      grade.classList.toggle('sg-vazia', !atual.length);
      if (!atual.length) grade.innerHTML = '<li class="sg-nada">' + esc(TX.nada) + ' <button type="button" class="sg-btn sg-lim">' + esc(TX.limpar) + '</button></li>';
      mais.hidden = atual.length <= mostrar;
      cont.textContent = TX.mostrando(parte.length, atual.length);
    }
    function url() {
      try {
        var p = new URLSearchParams(); if (F.s >= 0) p.set('secao', F.s); if (F.q) p.set('q', F.q);
        history.replaceState(null, '', location.pathname + (p.toString() ? '?' + p : ''));
      } catch (e) {}
    }
    chips.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; F.s = parseInt(b.getAttribute('data-s'), 10); mostrar = 48; desenhar(); url(); });
    var tq; busca.addEventListener('input', function () { clearTimeout(tq); tq = setTimeout(function () { F.q = busca.value; mostrar = 48; desenhar(); url(); }, 180); });
    selN.addEventListener('change', function () { F.k = selN.value; mostrar = 48; desenhar(); });
    selR.addEventListener('change', function () { F.r = parseInt(selR.value, 10); mostrar = 48; desenhar(); });
    mais.addEventListener('click', function () { mostrar += 48; desenhar(); var cs = grade.querySelectorAll('.sg-card'); if (cs[mostrar - 48]) cs[mostrar - 48].focus(); });
    grade.addEventListener('click', function (e) {
      var l = e.target.closest('.sg-lim'); if (l) { F = { q: '', s: -1, k: '', r: -1 }; busca.value = ''; selN.value = ''; selR.value = '-1'; desenhar(); url(); return; }
      var b = e.target.closest('.sg-card'); if (!b) return;
      visor(atual, parseInt(b.getAttribute('data-i'), 10));
    });
    selN.value = F.k; desenhar();
  }

  /* =========================================================
     ÁLBUM
     ========================================================= */
  function album(ganhos) {
    var vol = 0, sel = null, confirmando = false, nlimpar;
    root.innerHTML = '';
    var topo = el('section', 'sg-topo');
    var bolsaSec = el('section', 'sg-bolsa-sec');
    var tabs = el('div', 'sg-tabs'); tabs.setAttribute('role', 'group'); tabs.setAttribute('aria-label', TX.vol);
    var pagina = el('ol', 'sg-slots');
    var dica = el('p', 'sg-dica'); dica.setAttribute('aria-live', 'polite');
    var rodape = el('section', 'sg-rodape');
    root.appendChild(topo); root.appendChild(bolsaSec); root.appendChild(dica); root.appendChild(tabs); root.appendChild(pagina); root.appendChild(rodape);

    function desenharTopo() {
      var n = qtdColadas(), pct = TOTAL ? Math.round(n * 100 / TOTAL) : 0, pk = pacotes();
      var nota = S.dpk >= CAP_DIA ? TX.cheio : TX.volta;
      topo.innerHTML = '<div class="sg-prog"><div class="sg-prog-n"><b>' + n + '</b><span>/ ' + TOTAL + '</span></div><div class="sg-prog-l">' + esc(TX.figs) + ' · ' + pct + '%</div>' +
        '<div class="sg-barra" role="progressbar" aria-valuemin="0" aria-valuemax="' + TOTAL + '" aria-valuenow="' + n + '"><i style="width:' + pct + '%"></i></div></div>' +
        '<div class="sg-pacote"><button type="button" class="sg-abrir" ' + (pk ? '' : 'disabled') + '><span class="sg-pacote-ico" aria-hidden="true">᛭</span><span>' + esc(pk ? TX.abrir : TX.sem_pacote) + '</span><b>' + pk + '</b></button>' +
        '<p class="sg-pacote-n">' + esc(TX.pacotes) + ': ' + pk + ' · ' + esc(nota) + '</p></div>' +
        '<details class="sg-como"><summary>' + esc(TX.como) + '</summary><ul><li>' + esc(TX.como1) + '</li><li>' + esc(TX.como2) + '</li><li>' + esc(TX.como3) + '</li></ul></details>';
      topo.querySelector('.sg-abrir').onclick = onAbrir;
    }
    function desenharBolsa() {
      var ids = Object.keys(S.bag).map(function (i) { return POR[i]; }).filter(Boolean).sort(function (a, b) { return a.n - b.n; });
      if (sel && !S.bag[sel]) sel = null;
      bolsaSec.innerHTML = '<div class="sg-bolsa-cab"><h2>' + esc(TX.bolsa) + ' <small>' + ids.length + '</small></h2>' +
        (ids.length ? '<button type="button" class="sg-btn sg-todas">' + esc(TX.colar_todas) + '</button>' : '') + '</div>' +
        (ids.length ? '<ul class="sg-bolsa">' + ids.map(function (x) {
          return '<li><button type="button" class="sg-fig-b q' + x.q + (sel === x.i ? ' sel' : '') + '" draggable="true" data-id="' + esc(x.i) + '" aria-pressed="' + (sel === x.i) + '" aria-label="' + esc(TX.num + ' ' + pad(x.n) + ' — ' + x.t + ', ' + TX.rar[x.q]) + '">' + img(x, 'sg-img') + '<span class="sg-n">' + pad(x.n) + '</span></button></li>';
        }).join('') + '</ul>' : '<p class="sg-vazia-b">' + esc(TX.bolsa_vazia) + '</p>');
      dica.textContent = sel ? TX.dica_sel(pad(POR[sel].n)) : (ids.length ? TX.dica_bolsa : '');
    }
    function desenharTabs() {
      tabs.innerHTML = TX.reinos.map(function (nome, v) {
        var tot = 0, got = 0; ITENS.forEach(function (x) { if (x.s === v) { tot++; if (S.stuck[x.i]) got++; } });
        return '<button type="button" class="c' + v + '" data-v="' + v + '" aria-pressed="' + (vol === v) + '"><span>' + esc(nome) + '</span><small>' + got + '/' + tot + (tot && got === tot ? ' ✦' : '') + '</small></button>';
      }).join('');
    }
    function desenharPagina() {
      fundo(vol);
      var lista = ITENS.filter(function (x) { return x.s === vol; });
      pagina.className = 'sg-slots c' + vol;
      pagina.innerHTML = lista.map(function (x) {
        var cola = !!S.stuck[x.i], alvo = sel === x.i;
        var rot = TX.espaco + ' ' + pad(x.n) + (cola ? ': ' + x.t + ', ' + TX.rar[x.q] : ', ' + TX.vazio);
        return '<li><button type="button" class="sg-slot q' + x.q + (cola ? ' colada' : '') + (alvo ? ' alvo' : '') + '" data-id="' + esc(x.i) + '" aria-label="' + esc(rot) + '">' +
          (cola ? img(x, 'sg-img') + '<span class="sg-slot-t">' + esc(x.t) + '</span>' : '<span class="sg-slot-vz" aria-hidden="true">' + pad(x.n) + '</span>') +
          (cola ? '<span class="sg-n">' + pad(x.n) + '</span>' : '') + '</button></li>';
      }).join('');
    }
    function desenharRodape() {
      var pronto = S.ember >= CUSTO_FOG;
      rodape.innerHTML = '<div class="sg-fog"><h2>🔥 ' + esc(TX.fogueira) + '</h2><p>' + esc(TX.fog_txt) + '</p>' +
        '<div class="sg-brasas" aria-hidden="true"><i style="width:' + Math.min(100, Math.round(S.ember * 100 / CUSTO_FOG)) + '%"></i></div>' +
        '<p class="sg-brasas-n">' + esc(TX.brasas) + ': <b>' + S.ember + '</b></p>' +
        '<button type="button" class="sg-btn sg-btn-p sg-acender"' + (pronto ? '' : ' disabled') + '>' + esc(TX.forjar) + '</button></div>' +
        '<div class="sg-util"><p><a class="sg-btn" href="' + esc(TX.galeria) + '">' + esc(TX.ir_gal) + '</a> <a class="sg-btn" href="' + esc(TX.jogos) + '">🎮 ' + esc(TX.jg) + '</a></p>' +
        '<p><button type="button" class="sg-btn sg-exp">' + esc(TX.exportar) + '</button> <label class="sg-btn sg-imp">' + esc(TX.importar) + '<input type="file" accept="application/json,.json" hidden></label> ' +
        '<button type="button" class="sg-btn sg-apagar' + (confirmando ? ' conf' : '') + '">' + esc(confirmando ? TX.confirma : TX.apagar) + '</button></p>' +
        desenharConta() + '<p class="sg-priv">' + esc(TX.priv) + '</p>' + ((!ST_OK || SEM_SALVAR) ? '<p class="sg-priv sg-alerta">' + esc(TX.sem_storage) + '</p>' : '') + '</div>';
      rodape.querySelector('.sg-acender').onclick = function () { if (acenderFogueira()) { aviso(TX.forjou); tudo(); } };
      rodape.querySelector('.sg-exp').onclick = exportar;
      rodape.querySelector('.sg-imp input').onchange = importar;
      rodape.querySelector('.sg-apagar').onclick = apagar;
      ligarConta();
    }
    var API = CAT.api || '', SK = 'bt_alb_conta', ocupado = false, tsync;
    function conta() { try { return JSON.parse(lsGet(SK) || 'null'); } catch (e) { return null; } }
    function post(acao, d) {
      var f = new URLSearchParams(); f.set('acao', acao); Object.keys(d || {}).forEach(function (k) { f.set(k, d[k]); });
      return fetch(API.replace(/\/$/, '') + '/album.php', { method: 'POST', body: f }).then(function (r) { return r.json(); });
    }
    function sincronizar(msg) {
      var c = conta(); if (!c || ocupado) return Promise.resolve();
      ocupado = true;
      return post('obter', { sessao: c.s }).then(function (r) {
        if (!r.ok) { if (r.erro === 'sessao') lsDel(SK); throw 0; }
        if (r.dados) mesclar(r.dados);
        aoSalvar = null; salvar(); aoSalvar = agendar;
        return post('salvar', { sessao: c.s, dados: JSON.stringify(paraObj()) });
      }).then(function () { ocupado = false; if (msg) aviso(msg); tudo(); })
        .catch(function () { ocupado = false; if (msg) aviso(TX.c_erro); tudo(); });
    }
    function agendar() { if (!API || !conta()) return; clearTimeout(tsync); tsync = setTimeout(function () { sincronizar(); }, 2500); }
    if (API) aoSalvar = agendar;
    function desenharConta() {
      if (!API) return '';
      var c = conta();
      if (c) return '<div class="sg-conta"><h2>👤 ' + esc(TX.conta_t) + '</h2><p>' + esc(TX.c_con(c.email)) + '</p><p><button type="button" class="sg-btn sg-c-sync">' + esc(TX.c_sync) + '</button> <button type="button" class="sg-btn sg-c-sair">' + esc(TX.c_sair) + '</button> <button type="button" class="sg-btn sg-c-apagar">' + esc(TX.c_apagar) + '</button></p></div>';
      return '<form class="sg-conta" novalidate><h2>👤 ' + esc(TX.conta_t) + '</h2><p>' + esc(TX.c_txt) + '</p><p><input type="email" class="sg-busca sg-c-email" autocomplete="email" placeholder="' + esc(TX.c_email) + '" aria-label="' + esc(TX.c_email) + '" maxlength="190"></p>' +
        '<p><label class="sg-aceite"><input type="checkbox" class="sg-c-aceite"> <span>' + esc(TX.c_aceite) + '</span></label></p><p><button type="submit" class="sg-btn sg-btn-p">' + esc(TX.c_enviar) + '</button></p></form>';
    }
    function ligarConta() {
      var f = rodape.querySelector('form.sg-conta');
      if (f) f.onsubmit = function (e) {
        e.preventDefault();
        var em = f.querySelector('.sg-c-email').value.trim(), ok = f.querySelector('.sg-c-aceite').checked;
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em) || !ok) { aviso(TX.c_email_inv); return; }
        post('entrar', { email: em, idioma: L, consentimento: '1' }).then(function (r) { aviso(r.ok ? TX.c_enviado : TX.c_erro); }).catch(function () { aviso(TX.c_erro); });
      };
      var q = function (s) { return rodape.querySelector(s); };
      if (q('.sg-c-sync')) q('.sg-c-sync').onclick = function () { sincronizar(TX.c_sync_ok); };
      if (q('.sg-c-sair')) q('.sg-c-sair').onclick = function () { var c = conta(); lsDel(SK); if (c) post('sair', { sessao: c.s }).catch(function () {}); tudo(); };
      if (q('.sg-c-apagar')) q('.sg-c-apagar').onclick = function () {
        var b = q('.sg-c-apagar');
        if (!b.classList.contains('conf')) { b.classList.add('conf'); b.textContent = TX.confirma; return; }
        var c = conta(); lsDel(SK);
        post('apagar', { sessao: c.s }).then(function () { aviso(TX.c_apagou); }).catch(function () { aviso(TX.c_erro); }); tudo();
      };
    }
    function entrarPorLink() {
      var m = /#entrar=([a-f0-9]{64})/.exec(location.hash); if (!m || !API) return;
      try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
      post('trocar', { token: m[1] }).then(function (r) {
        if (!r.ok) { aviso(TX.c_link_inv); return; }
        lsSet(SK, JSON.stringify({ s: r.sessao, email: r.email }));
        sincronizar(TX.c_ent);
      }).catch(function () { aviso(TX.c_erro); });
    }
    function tudo() { desenharTopo(); desenharBolsa(); desenharTabs(); desenharPagina(); desenharRodape(); }

    /* --- pacote --- */
    function onAbrir() {
      var cartas = abrirPacote(); if (!cartas) return;
      desenharTopo(); desenharBolsa();
      var dlg = el('div', 'sg-dlg sg-pk'); dlg.setAttribute('role', 'dialog'); dlg.setAttribute('aria-modal', 'true'); dlg.setAttribute('aria-label', TX.pacote_t);
      var vistas = 0;
      dlg.innerHTML = '<div class="sg-pk-in"><h2>' + esc(TX.pacote_t) + '</h2><p class="sg-pk-d">' + esc(TX.toque_virar) + '</p><div class="sg-pk-cartas">' + cartas.map(function (c, i) {
        var x = c.x;
        return '<button type="button" class="sg-pc q' + x.q + '" data-i="' + i + '" aria-label="' + esc(TX.toque_virar + ' ' + (i + 1)) + '"><span class="sg-pc-in">' +
          '<span class="sg-pc-costa" aria-hidden="true">᛭</span>' +
          '<span class="sg-pc-frente">' + img(x, 'sg-img', false) + '<span class="sg-n">' + pad(x.n) + '</span><b class="sg-pc-t">' + esc(x.t) + '</b>' +
          '<span class="sg-q q' + x.q + '">' + esc(TX.rar[x.q]) + '</span><span class="sg-pc-s ' + (c.nova ? 'nova' : 'rep') + '">' + esc(c.nova ? TX.nova : TX.repetida + ' · +' + c.brasas + ' ' + TX.brasas.toLowerCase()) + '</span></span></span></button>';
      }).join('') + '</div><p class="sg-pk-btns"><button type="button" class="sg-btn sg-rev">' + esc(TX.revelar) + '</button><button type="button" class="sg-btn sg-btn-p sg-ok" hidden>' + esc(TX.continuar) + '</button></p></div>';
      var rev = dlg.querySelector('.sg-rev'), ok = dlg.querySelector('.sg-ok');
      function virar(b) {
        if (b.classList.contains('virada')) return;
        b.classList.add('virada'); vistas++;
        var c = cartas[+b.getAttribute('data-i')], x = c.x;
        b.setAttribute('aria-label', TX.num + ' ' + pad(x.n) + ' — ' + x.t + ', ' + TX.rar[x.q] + ', ' + (c.nova ? TX.nova : TX.repetida));
        if (vistas === 3) { rev.hidden = true; ok.hidden = false; ok.focus(); }
      }
      dlg.querySelectorAll('.sg-pc').forEach(function (b) { b.onclick = function () { virar(b); }; });
      rev.onclick = function () { dlg.querySelectorAll('.sg-pc').forEach(virar); };
      ok.onclick = fecharDialogo;
      abrirDialogo(dlg, function () { tudo(); }, dlg.querySelector('.sg-pc'));
    }

    /* --- colar --- */
    function tentarColar(id, slotEl) {
      var r = colar(id);
      if (r) {
        if (typeof r === 'string') aviso(r);
        sel = null; vol = POR[id].s; tudo();
        var nv = pagina.querySelector('[data-id="' + id + '"]'); if (nv && !RM) { nv.classList.add('pop'); }
        return true;
      }
      return false;
    }
    bolsaSec.addEventListener('click', function (e) {
      var t = e.target.closest('.sg-todas');
      if (t) {
        var ids = Object.keys(S.bag), msgs = [];
        ids.forEach(function (id) { var r = colar(id); if (typeof r === 'string') msgs.push(r); });
        sel = null; tudo(); if (msgs.length) aviso(msgs[msgs.length - 1]); return;
      }
      var b = e.target.closest('.sg-fig-b'); if (!b) return;
      var id = b.getAttribute('data-id'); sel = sel === id ? null : id;
      if (sel) vol = POR[sel].s;
      tudo();
      if (sel) { var alvo = pagina.querySelector('.alvo'); if (alvo && alvo.scrollIntoView) alvo.scrollIntoView({ block: 'center', behavior: RM ? 'auto' : 'smooth' }); }
      var nb = bolsaSec.querySelector('.sg-fig-b[data-id="' + id + '"]'); if (nb) nb.focus();
    });
    var arrastando = null;
    bolsaSec.addEventListener('dragstart', function (e) {
      var b = e.target.closest('.sg-fig-b'); if (!b) return;
      arrastando = b.getAttribute('data-id'); sel = arrastando; vol = POR[sel].s;
      try { e.dataTransfer.setData('text/plain', arrastando); e.dataTransfer.effectAllowed = 'move'; } catch (er) {}
      desenharTabs(); desenharPagina();
    });
    bolsaSec.addEventListener('dragend', function () { arrastando = null; });
    pagina.addEventListener('dragover', function (e) { if (arrastando && e.target.closest('.sg-slot')) { e.preventDefault(); } });
    pagina.addEventListener('drop', function (e) {
      var s = e.target.closest('.sg-slot'); if (!s || !arrastando) return; e.preventDefault();
      var id = arrastando; arrastando = null;
      if (s.getAttribute('data-id') === id) tentarColar(id); else erro(s);
    });
    function erro(s) { aviso(TX.errado); if (!RM) { s.classList.add('treme'); setTimeout(function () { s.classList.remove('treme'); }, 500); } }
    pagina.addEventListener('click', function (e) {
      var s = e.target.closest('.sg-slot'); if (!s) return;
      var id = s.getAttribute('data-id');
      if (S.stuck[id]) {
        var lista = ITENS.filter(function (x) { return S.stuck[x.i]; });
        visor(lista, lista.indexOf(POR[id])); return;
      }
      if (sel) { if (sel === id) tentarColar(id); else erro(s); }
    });
    tabs.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; vol = +b.getAttribute('data-v'); desenharTabs(); desenharPagina(); });

    /* --- exportar / importar / apagar --- */
    function exportar() {
      var o = paraObj();
      var blob = new Blob([JSON.stringify(o)], { type: 'application/json' }), a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = 'boreal-album.json'; document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    }
    function importar(e) {
      var f = e.target.files && e.target.files[0]; if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        try {
          var o = JSON.parse(r.result); if (!o || o.app !== 'boreal-album') throw 0;
          mesclar(o);
          salvar(); aviso(TX.importou); tudo();
        } catch (er) { aviso(TX.imp_erro); }
      };
      r.readAsText(f); e.target.value = '';
    }
    function apagar() {
      if (!confirmando) { confirmando = true; desenharRodape(); nlimpar = setTimeout(function () { confirmando = false; desenharRodape(); }, 4000); return; }
      clearTimeout(nlimpar); confirmando = false; lsDel(KEY); S = vazio(); S.day = hoje(); S.dpk = 1; salvar(); sel = null; aviso(TX.apagou); tudo();
    }

    tudo();
    if (ganhos) aviso(TX.ganhou(ganhos));
    entrarPorLink(); if (API && conta()) sincronizar();
  }

  /* ---------- partida ---------- */
  if (MODO === 'album') album(creditar()); else galeria();
})();
