/* Motor dos jogos do Boreal Saga Play: tela cheia, adaptação a qualquer
   tamanho e orientação, pausa. Sem dependências, sem cookies, sem coleta
   de dados. Cada jogo se registra com BTJogo.registrar({...}).

   Coordenadas dos jogos: o lado MENOR da tela vale sempre 450 unidades; o
   lado maior cresce conforme a proporção. Assim o jogo preenche toda a
   superfície, em retrato ou paisagem, sem faixas. */
(function () {
  'use strict';
  var l2 = (document.documentElement.lang || 'pt').slice(0, 2).toLowerCase();
  var L = l2 === 'en' ? 'en' : l2 === 'es' ? 'es' : (l2 === 'nb' || l2 === 'no' || l2 === 'nn') ? 'no' : 'pt';
  var UI = {
    pt: { jogar: '▶ Jogar em tela cheia', sair: 'Sair', pausa: 'Pausar', pausado: 'Pausado', retomar: 'Toque para continuar' },
    en: { jogar: '▶ Play fullscreen', sair: 'Exit', pausa: 'Pause', pausado: 'Paused', retomar: 'Tap to continue' },
    no: { jogar: '▶ Spill på hel skjerm', sair: 'Avslutt', pausa: 'Pause', pausado: 'På pause', retomar: 'Trykk for å fortsette' },
    es: { jogar: '▶ Jugar a pantalla completa', sair: 'Salir', pausa: 'Pausa', pausado: 'En pausa', retomar: 'Toca para continuar' }
  }[L];

  /* ================= Efeitos, som, pontuação e dificuldade =================
     Tudo aqui vale para qualquer jogo: o motor lê o contador que o jogo
     desenha no canto (ex.: "Acertos 3/8", "Erros 1/3") e o estado dos
     cartazes (início, vitória, derrota) para disparar partículas, tremor,
     sons e pontos, sem mexer no código de cada jogo. */
  var TEMAS = {"jogo-aasen":"sagas","jogo-absalon":"sagas","jogo-aegir":"mitos","jogo-aegishjalmr":"sagas","jogo-aesir":"mitos","jogo-aggersborg":"viking","jogo-agnete":"contos","jogo-ahkka":"contos","jogo-aino":"contos","jogo-ales":"viking","jogo-alfablot":"contos","jogo-alfheim":"mitos","jogo-alfhild":"sagas","jogo-althing":"viking","jogo-alvissmal":"mitos","jogo-amleth":"sagas","jogo-andvari":"mitos","jogo-angrboda":"mitos","jogo-anoes":"mitos","jogo-ans":"sagas","jogo-ansgar":"viking","jogo-ardnamurchan":"viking","jogo-arrasto":"viking","jogo-asgardsreia":"contos","jogo-ashdown":"viking","jogo-ask":"mitos","jogo-askeladden":"contos","jogo-askold":"viking","jogo-aslaug":"sagas","jogo-asmundar":"sagas","jogo-assandun":"viking","jogo-assipattle":"contos","jogo-asynjur":"mitos","jogo-atlamal":"sagas","jogo-atli":"sagas","jogo-aud":"sagas","jogo-audumbla":"mitos","jogo-audun":"sagas","jogo-aurora":"contos","jogo-aurvandil":"mitos","jogo-austrfarar":"viking","jogo-avaldsnes":"viking","jogo-backahast":"contos","jogo-balanca":"viking","jogo-baldr":"mitos","jogo-bandamanna":"sagas","jogo-barcodepedra":"contos","jogo-bardar":"sagas","jogo-beaivi":"contos","jogo-beowulf":"sagas","jogo-bergbua":"contos","jogo-bergtatt":"contos","jogo-bergthora":"sagas","jogo-berserker":"viking","jogo-bifrost":"mitos","jogo-bifrost-cores":"mitos","jogo-birger":"sagas","jogo-birka":"viking","jogo-bjarnar":"sagas","jogo-bjarni":"sagas","jogo-bjorketorp":"viking","jogo-bjorn":"viking","jogo-bodes":"contos","jogo-bolos":"viking","jogo-borg":"viking","jogo-borgring":"viking","jogo-borgund":"viking","jogo-borre":"viking","jogo-bosa":"sagas","jogo-bragi":"mitos","jogo-brand":"sagas","jogo-brandkrossi":"contos","jogo-brattahlid":"viking","jogo-bravellir":"sagas","jogo-bricio":"sagas","jogo-brunanburh":"viking","jogo-bryggen":"viking","jogo-brynhildr":"sagas","jogo-bukolla":"contos","jogo-bull":"sagas","jogo-buttercup":"contos","jogo-canuto":"sagas","jogo-capacete":"viking","jogo-carneiro":"contos","jogo-carvalho":"mitos","jogo-catoira":"viking","jogo-cintoazul":"contos","jogo-clontarf":"viking","jogo-cnut":"viking","jogo-codex":"sagas","jogo-contraria":"contos","jogo-conversao-1000":"sagas","jogo-cova":"sagas","jogo-cuerdale":"viking","jogo-danca":"contos","jogo-danelaw":"viking","jogo-danevirke":"viking","jogo-dannebrog":"sagas","jogo-darradar":"sagas","jogo-disir":"mitos","jogo-dorestad":"viking","jogo-dovregato":"contos","jogo-draugen":"contos","jogo-draugr":"contos","jogo-draumkvedet":"contos","jogo-draupnir":"mitos","jogo-droplaug":"sagas","jogo-dublin":"viking","jogo-dumbarton":"viking","jogo-ebbesen":"sagas","jogo-edmund":"viking","jogo-eggjum":"viking","jogo-egil":"sagas","jogo-egill":"sagas","jogo-eikthyrnir":"mitos","jogo-eir":"mitos","jogo-eirik":"sagas","jogo-eiriksmal":"sagas","jogo-eketorp":"viking","jogo-eldgja":"viking","jogo-eljudnir":"mitos","jogo-elveskud":"contos","jogo-emma":"viking","jogo-engelbrekt":"sagas","jogo-erico":"sagas","jogo-esqui":"sagas","jogo-eyrbyggja":"sagas","jogo-fadlan":"viking","jogo-fagrskinna":"sagas","jogo-fanitullen":"contos","jogo-fastelavn":"contos","jogo-fenrir":"mitos","jogo-fimbulvetr":"mitos","jogo-finfolk":"contos","jogo-finnboga":"sagas","jogo-finnsburg":"sagas","jogo-fjolsvinnsmal":"mitos","jogo-flatey":"sagas","jogo-fljotsdaela":"sagas","jogo-floamanna":"sagas","jogo-floki":"sagas","jogo-flugumyri":"sagas","jogo-folkvangr":"mitos","jogo-fornjotr":"mitos","jogo-foroyinga":"sagas","jogo-forseti":"mitos","jogo-franks":"mitos","jogo-freddy":"contos","jogo-freydis":"sagas","jogo-freyja":"mitos","jogo-freyr":"mitos","jogo-fridtjof":"sagas","jogo-frigg":"mitos","jogo-frigg-pares":"mitos","jogo-froso":"viking","jogo-fulford":"viking","jogo-fulla":"mitos","jogo-fylgja":"contos","jogo-fyrkat":"viking","jogo-galdra":"contos","jogo-gallehus":"viking","jogo-galloway":"viking","jogo-garmr":"mitos","jogo-gautrek":"sagas","jogo-gautreksson":"sagas","jogo-gefjon":"mitos","jogo-geirrod":"mitos","jogo-geri":"mitos","jogo-gestumblindi":"sagas","jogo-gigante":"contos","jogo-gilitrutt":"contos","jogo-ginnungagap":"mitos","jogo-gisl":"sagas","jogo-gisli":"sagas","jogo-gjallarhorn":"mitos","jogo-gjellestad":"viking","jogo-glamr":"sagas","jogo-glassberget":"contos","jogo-glima":"viking","jogo-gna":"mitos","jogo-gnezdovo":"viking","jogo-gongu":"sagas","jogo-gosforth":"viking","jogo-gotland":"viking","jogo-grimnir":"mitos","jogo-grimr":"sagas","jogo-grimsborken":"contos","jogo-gripir":"sagas","jogo-grobina":"viking","jogo-groenlandia":"viking","jogo-grogaldr":"mitos","jogo-grotti":"mitos","jogo-gryla":"contos","jogo-gudbrand":"contos","jogo-gudrid":"sagas","jogo-gudrun":"sagas","jogo-gulating":"viking","jogo-gullinbursti":"mitos","jogo-gullthoris":"sagas","jogo-gullveig":"mitos","jogo-gundestrup":"viking","jogo-gungnir":"mitos","jogo-gunnar":"sagas","jogo-gunnhild":"sagas","jogo-gunnlaug":"sagas","jogo-gunnlod":"mitos","jogo-gustavvasa":"sagas","jogo-gutasaga":"sagas","jogo-guthrum":"viking","jogo-gylfi":"mitos","jogo-haakon":"sagas","jogo-hacon":"contos","jogo-haensa":"sagas","jogo-hafli":"sagas","jogo-hakon":"sagas","jogo-halfdan":"viking","jogo-halfdansvarte":"sagas","jogo-halfs":"sagas","jogo-halldor":"sagas","jogo-hallfred":"sagas","jogo-hallgerdr":"sagas","jogo-halli":"sagas","jogo-hamdismal":"sagas","jogo-harald":"sagas","jogo-haraldgille":"sagas","jogo-haraldklak":"sagas","jogo-harbard":"mitos","jogo-hardar":"sagas","jogo-hardrada":"sagas","jogo-hattatal":"sagas","jogo-haugsnes":"sagas","jogo-hauksbok":"sagas","jogo-haustlong":"mitos","jogo-havamal":"viking","jogo-havardar":"sagas","jogo-hedeby":"viking","jogo-heidarviga":"sagas","jogo-heidrun":"mitos","jogo-heimskringla":"sagas","jogo-hekla":"contos","jogo-hel":"mitos","jogo-helgi":"contos","jogo-helgo":"viking","jogo-helhest":"contos","jogo-helreid":"sagas","jogo-herjolfsnes":"viking","jogo-hermodr":"mitos","jogo-hervor":"sagas","jogo-hiddensee":"viking","jogo-hidromel":"mitos","jogo-hiisi":"mitos","jogo-hildigunn":"sagas","jogo-hildisvini":"mitos","jogo-hjadningavig":"sagas","jogo-hjalmthes":"sagas","jogo-hjalti":"sagas","jogo-hjuki":"mitos","jogo-hlidskjalf":"mitos","jogo-hlodskvida":"sagas","jogo-hodr":"mitos","jogo-hoen":"viking","jogo-hoenir":"mitos","jogo-hogbacks":"viking","jogo-hogboon":"contos","jogo-holger":"contos","jogo-holmganga":"viking","jogo-hraesvelgr":"mitos","jogo-hrafn":"sagas","jogo-hrafnagaldr":"mitos","jogo-hrafnkell":"sagas","jogo-hrafnsmal":"sagas","jogo-hrafnthattr":"sagas","jogo-hreidar":"sagas","jogo-hrimgerdr":"mitos","jogo-hringhorni":"mitos","jogo-hrolf":"sagas","jogo-hromundar":"sagas","jogo-hrungnir":"mitos","jogo-huginn":"mitos","jogo-huldra":"contos","jogo-huldu":"contos","jogo-hunnestad":"viking","jogo-husdrapa":"viking","jogo-hvalsey":"viking","jogo-hvita":"sagas","jogo-hymir":"mitos","jogo-hyndla":"mitos","jogo-idun":"mitos","jogo-illerup":"viking","jogo-illuga":"contos","jogo-ilmarinen":"mitos","jogo-ilmatar":"contos","jogo-ingigerdr":"viking","jogo-ingolfr":"sagas","jogo-ingvar":"viking","jogo-iona":"viking","jogo-islandes":"sagas","jogo-islendingabok":"sagas","jogo-ivar":"viking","jogo-ivarthattr":"sagas","jogo-jarlshof":"viking","jogo-joik":"contos","jogo-jola":"contos","jogo-jolasveinar":"contos","jogo-jomsvikings":"sagas","jogo-jonarason":"sagas","jogo-jonarnason":"contos","jogo-jord":"mitos","jogo-jordanes":"viking","jogo-jorvik":"viking","jogo-jotnar":"mitos","jogo-joukahainen":"contos","jogo-julbock":"contos","jogo-kalevipoeg":"contos","jogo-kalmar":"sagas","jogo-kantele":"mitos","jogo-kari":"sagas","jogo-karisolm":"sagas","jogo-karitrestakk":"contos","jogo-karlevi":"viking","jogo-karlsefni":"sagas","jogo-kaupang":"viking","jogo-keldugn":"sagas","jogo-kennings":"sagas","jogo-kensington":"viking","jogo-ketilhaeng":"sagas","jogo-ketill":"sagas","jogo-kingittorsuaq":"viking","jogo-kirkegrim":"contos","jogo-kjalnes":"sagas","jogo-knattleikr":"viking","jogo-knock":"viking","jogo-knytlinga":"sagas","jogo-kopakonan":"contos","jogo-kormak":"sagas","jogo-kraken":"contos","jogo-krokaref":"sagas","jogo-kullervo":"contos","jogo-kumlbua":"contos","jogo-kveldulf":"sagas","jogo-kylver":"viking","jogo-ladby":"viking","jogo-ladoga":"viking","jogo-laevateinn":"mitos","jogo-lagaboter":"sagas","jogo-lagarfljot":"contos","jogo-lagertha":"sagas","jogo-landnamabok":"sagas","jogo-landvaettir":"contos","jogo-lanse":"viking","jogo-largs":"sagas","jogo-laxdaela":"sagas","jogo-leao":"viking","jogo-leif":"sagas","jogo-lejre":"viking","jogo-lemminkainen":"contos","jogo-lewis":"viking","jogo-lif":"mitos","jogo-limerick":"viking","jogo-lindholm":"viking","jogo-lindorm":"contos","jogo-ljosvet":"sagas","jogo-lokasenna":"mitos","jogo-lordpeter":"contos","jogo-louhi":"contos","jogo-lund":"viking","jogo-lundfinn":"contos","jogo-lussi":"contos","jogo-maeshowe":"viking","jogo-magni":"mitos","jogo-magnus":"sagas","jogo-magnus-1103":"sagas","jogo-magnus-lyrskov":"sagas","jogo-maine":"viking","jogo-maldon":"viking","jogo-mammen":"viking","jogo-mannelig":"contos","jogo-mannen":"contos","jogo-mara":"contos","jogo-marbendill":"contos","jogo-margrete":"sagas","jogo-marjatta":"contos","jogo-marsk":"sagas","jogo-martelo":"mitos","jogo-mastermyr":"viking","jogo-megingjord":"mitos","jogo-melkorka":"sagas","jogo-mestermoy":"contos","jogo-mestreferreiro":"contos","jogo-midgard":"mitos","jogo-mimir":"mitos","jogo-mjolnir":"mitos","jogo-moinho":"contos","jogo-morkinskinna":"sagas","jogo-mosekonen":"contos","jogo-mylingen":"contos","jogo-myrka":"contos","jogo-naddoddr":"viking","jogo-naglfar":"mitos","jogo-nerthus":"mitos","jogo-nesjar":"viking","jogo-nibelungen":"sagas","jogo-nidhoggr":"mitos","jogo-nils":"contos","jogo-nisse":"contos","jogo-njordr":"mitos","jogo-noaidi":"contos","jogo-nokken":"contos","jogo-nordenvinden":"contos","jogo-nornagest":"sagas","jogo-nornas":"mitos","jogo-nott":"mitos","jogo-nuckelavee":"contos","jogo-nydam":"viking","jogo-odainsakr":"sagas","jogo-odda":"sagas","jogo-oddrun":"sagas","jogo-ogmundr":"sagas","jogo-ohthere":"viking","jogo-olavo":"sagas","jogo-olavsoka":"viking","jogo-olelukoje":"contos","jogo-olkofra":"sagas","jogo-olof":"viking","jogo-orlygsstadir":"sagas","jogo-orm":"sagas","jogo-ormurin":"sagas","jogo-orvar":"sagas","jogo-osborn":"contos","jogo-oseberg":"viking","jogo-overhogdal":"viking","jogo-panqueca":"contos","jogo-papar":"viking","jogo-paris":"viking","jogo-paskkarringar":"contos","jogo-patos":"contos","jogo-pedrasol":"viking","jogo-peer":"contos","jogo-pesta":"contos","jogo-primstav":"viking","jogo-princesa":"contos","jogo-ragnar":"sagas","jogo-ragnarok":"mitos","jogo-ragnarsdrapa":"sagas","jogo-ramsund":"viking","jogo-ran":"mitos","jogo-ratatosk":"mitos","jogo-ratatoskr":"mitos","jogo-ravning":"viking","jogo-recitador":"sagas","jogo-remar":"viking","jogo-repton":"viking","jogo-reykd":"sagas","jogo-reykjavik":"viking","jogo-ribe":"viking","jogo-ribe-craneo":"viking","jogo-ridgeway":"viking","jogo-rigs":"mitos","jogo-rindr":"mitos","jogo-rognvald":"sagas","jogo-rok":"viking","jogo-rollo":"viking","jogo-runas":"viking","jogo-runepoems":"viking","jogo-rurik":"viking","jogo-saehrimnir":"mitos","jogo-saemundur":"contos","jogo-saga":"mitos","jogo-salme":"viking","jogo-sampo":"mitos","jogo-sankthans":"contos","jogo-saucourt":"viking","jogo-scar":"viking","jogo-seidr":"mitos","jogo-selkie":"contos","jogo-setepotros":"contos","jogo-sevilha":"viking","jogo-seydabrev":"viking","jogo-shortshanks":"contos","jogo-sidu":"sagas","jogo-sieidi":"contos","jogo-sif":"mitos","jogo-sigeyst":"sagas","jogo-sigmundgram":"sagas","jogo-sigrdrifa":"mitos","jogo-sigridr":"sagas","jogo-sigrun":"sagas","jogo-sigtuna":"viking","jogo-sigurd":"sagas","jogo-sigyn":"mitos","jogo-sinfjotli":"sagas","jogo-sinos":"viking","jogo-sjoorm":"contos","jogo-skadi":"mitos","jogo-skaldh":"sagas","jogo-skarphedinn":"sagas","jogo-skelkr":"contos","jogo-skidbladnir":"mitos","jogo-skofnung":"sagas","jogo-skogsra":"contos","jogo-skuldelev":"viking","jogo-skule":"sagas","jogo-sleipnir":"mitos","jogo-snaefridr":"sagas","jogo-snoldelev":"viking","jogo-snorri":"sagas","jogo-solarljod":"sagas","jogo-solmani":"mitos","jogo-somerled":"sagas","jogo-sonatorrek":"sagas","jogo-soria":"contos","jogo-spillings":"viking","jogo-stallo":"contos","jogo-stamford":"viking","jogo-stangar":"sagas","jogo-starkad":"sagas","jogo-stiklestad":"sagas","jogo-stong":"viking","jogo-stortebeker":"sagas","jogo-stufr":"sagas","jogo-sturlaugr":"sagas","jogo-styrbjorn":"sagas","jogo-surtr":"mitos","jogo-suttonhoo":"viking","jogo-svarfdaela":"sagas","jogo-svartebok":"contos","jogo-svein":"sagas","jogo-sverre":"sagas","jogo-svolder":"sagas","jogo-sweyn":"sagas","jogo-tafl":"viking","jogo-tanngrisnir":"mitos","jogo-tapio":"contos","jogo-tatterhood":"contos","jogo-tettenhall":"viking","jogo-thjalfi":"mitos","jogo-thor":"mitos","jogo-thordr":"sagas","jogo-thorfinn":"sagas","jogo-thorgerdr":"mitos","jogo-thorkell":"viking","jogo-thorlaks":"contos","jogo-thorleif":"sagas","jogo-thormod":"sagas","jogo-thorra":"viking","jogo-thorstein":"sagas","jogo-thorvard":"sagas","jogo-thralls":"viking","jogo-thyri":"viking","jogo-tilberi":"contos","jogo-tisso":"viking","jogo-tjangvide":"viking","jogo-topon":"viking","jogo-tordenskjold":"sagas","jogo-torfeinarr":"sagas","jogo-torksey":"viking","jogo-torslunda":"viking","jogo-tratado":"viking","jogo-trelleborg":"viking","jogo-tresatias":"contos","jogo-troll":"contos","jogo-trolls":"contos","jogo-trow":"contos","jogo-trundholm":"viking","jogo-tynwald":"viking","jogo-tyr":"mitos","jogo-ukko":"mitos","jogo-ulfberht":"viking","jogo-ullr":"mitos","jogo-uphellyaa":"contos","jogo-uppakra":"viking","jogo-uppsala":"viking","jogo-urnes":"viking","jogo-ursocauda":"contos","jogo-utgard":"mitos","jogo-uunartoq":"viking","jogo-uxafot":"sagas","jogo-vafthrudnir":"mitos","jogo-valemon":"contos","jogo-valla":"sagas","jogo-valquiria":"mitos","jogo-valravn":"contos","jogo-valsgarde":"viking","jogo-vapnf":"sagas","jogo-vardoger":"contos","jogo-vatnsdaela":"sagas","jogo-vegvisir":"viking","jogo-vellekla":"sagas","jogo-ventonorte":"contos","jogo-vestmannaeyjar":"viking","jogo-vidarr":"mitos","jogo-vigaglums":"sagas","jogo-viglund":"sagas","jogo-vili":"mitos","jogo-vimose":"viking","jogo-vinland":"viking","jogo-violino":"contos","jogo-vipunen":"mitos","jogo-visby":"sagas","jogo-vittra":"contos","jogo-vladimir":"viking","jogo-volsi":"sagas","jogo-volund":"mitos","jogo-voluspa":"mitos","jogo-waterford":"viking","jogo-whiteland":"contos","jogo-widsith":"sagas","jogo-wulfstan":"viking","jogo-ymir":"mitos","jogo-ynglinga":"sagas","jogo-york":"viking"};
  var NIVEIS = [{ m: 0.8, p: 0.6 }, { m: 1, p: 1 }, { m: 1.25, p: 1.6 }, { m: 1.5, p: 2.5 }];
  var TX = {
    pt: { dif: ['Fácil', 'Normal', 'Difícil', 'Lendário'], pts: 'Pontos', rec: 'Recorde', novo: 'Novo recorde!', som: 'Som', med: ['Bronze', 'Prata', 'Ouro'], comp: 'Compartilhar', cp: 'Link copiado', fiz: function (n, t, d, m) { return 'Fiz ' + n + ' pontos em "' + t + '" (' + d + ') ' + m + ' — borealsagaplay.com'; } },
    en: { dif: ['Easy', 'Normal', 'Hard', 'Legendary'], pts: 'Score', rec: 'Best', novo: 'New best!', som: 'Sound', med: ['Bronze', 'Silver', 'Gold'], comp: 'Share', cp: 'Link copied', fiz: function (n, t, d, m) { return 'I scored ' + n + ' points in "' + t + '" (' + d + ') ' + m + ' — borealsagaplay.com'; } },
    no: { dif: ['Lett', 'Normal', 'Vanskelig', 'Legendarisk'], pts: 'Poeng', rec: 'Rekord', novo: 'Ny rekord!', som: 'Lyd', med: ['Bronse', 'Sølv', 'Gull'], comp: 'Del', cp: 'Lenke kopiert', fiz: function (n, t, d, m) { return 'Jeg fikk ' + n + ' poeng i «' + t + '» (' + d + ') ' + m + ' — borealsagaplay.com'; } },
    es: { dif: ['Fácil', 'Normal', 'Difícil', 'Legendario'], pts: 'Puntos', rec: 'Récord', novo: '¡Nuevo récord!', som: 'Sonido', med: ['Bronce', 'Plata', 'Oro'], comp: 'Compartir', cp: 'Enlace copiado', fiz: function (n, t, d, m) { return 'He logrado ' + n + ' puntos en «' + t + '» (' + d + ') ' + m + ' — borealsagaplay.com'; } }
  }[L];
  var MEDAL = ['', '🥉', '🥈', '🥇'];
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
    var mist = 0, medal = 0, est = 'menu', marca = null, linhas = [], prev = {}, grace = 0, score = 0, combo = 0, comboT = 0, tPlay = 0, novo = false, ult = 0, ux = 0, uy = 0, ut = -9;
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
    function med(i) { return parseInt(lsGet('bt_med_' + id + '_' + i), 10) || 0; }
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
      mist++; combo = 0; comboT = 0; shake = 0.35; shT = 0.35; flash = { c: '255,70,50', a: 0.32 };
      var p = pos(); burst(p[0], p[1], 22, ['#ff6a4a', '#ffb36b', '#ff3a2a'], 200, 160, 0.6, 3);
      SOM.mau();
    }
    function comecar() {
      score = 0; combo = 0; comboT = 0; tPlay = 0; novo = false; mist = 0; medal = 0; prev = {}; grace = 0.5;
      var h = api.h; burst(api.w / 2, h / 2, 26, CORES.concat(['#ffe9a8']), 220, 40, 0.8, 3); SOM.inicio();
    }
    function vencer() {
      var b = Math.round((500 + Math.max(0, 60 - tPlay) * 10) * mult()); score += b;
      for (var i = 0; i < 5; i++) burst(rnd(api.w * 0.2, api.w * 0.8), rnd(api.h * 0.2, api.h * 0.5), 26, ['#ffd88a', '#ffffff', '#ff9ad7', '#9ad7ff', '#8dffc9'], 240, 180, 1.4, 3.4);
      flash = { c: '255,216,138', a: 0.35 }; SOM.vitoria(); fecharPts();
      medal = mist === 0 ? (dif >= 1 ? 3 : 2) : mist <= 1 ? 2 : 1;
      if (medal > med(dif)) lsSet('bt_med_' + id + '_' + dif, String(medal));
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
      dbg: function () { return { mist: mist, medal: medal, score: score, combo: combo, est: est, best: best, dif: dif, parts: parts.length }; },
      nivel: function () { return dif; },
      mult: function () { return NIVEIS[dif].m; },
      estado: function () { return est; },
      resumo: function () { return { score: score, dif: dif, medal: medal, titulo: T0() }; },
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
        /* marca d'água borealsagaplay.com com logo, no fundo do jogo (wm-v2) */
        (function () {
          var sz = Math.max(12, Math.min(40, w * 0.055)), lh = sz * 2.6, lw = lh * 0.9609, cx = w / 2, cy = h * 0.5;
          var L = window.__bspLogo;
          if (!L) { L = window.__bspLogo = new Image(); L.src = 'data:image/png;base64,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'; }
          var gap = sz * 0.5, top = cy - (lh + gap + sz) / 2;
          g.save(); g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = 'bold ' + sz + 'px Georgia, serif';
          if (L.complete && L.naturalWidth) { g.globalAlpha = 0.06; g.drawImage(L, cx - lw / 2, top, lw, lh); g.globalAlpha = 1; }
          g.fillStyle = 'rgba(255,255,255,.05)'; g.fillText('borealsagaplay.com', cx, top + lh + gap + sz / 2);
          g.restore();
        })();
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
        if (est === 'menu' && (!ativoFn || ativoFn())) {
          var P = pills(), n;
          if (best > 0) api.txt0(TX.rec + ': ' + best, w / 2, P.y0 - 30, 13, '#c9b3f2', 'center');
          for (n = 0; n < 4; n++) if (med(n)) api.txt0(MEDAL[med(n)], P.x0 + n * (P.pw + 8) + P.pw / 2, P.y0 - 8, 16, '#fff', 'center');
          for (n = 0; n < 4; n++) {
            var px = P.x0 + n * (P.pw + 8);
            g.fillStyle = n === dif ? '#ffd88a' : 'rgba(255,255,255,.14)'; rr(px, P.y0, P.pw, 30, 15); g.fill();
            api.txt0(TX.dif[n], px + P.pw / 2, P.y0 + 20, 13, n === dif ? '#2a1c0a' : '#e9e1f7', 'center');
          }
        } else if (est === 'win' || est === 'lose') {
          if (medal) api.txt0(MEDAL[medal] + ' ' + TX.med[medal - 1], w / 2, h - 84, 20, '#ffd88a', 'center');
          if (novo) api.txt0(TX.novo, w / 2, h - 58, 16, '#ffd88a', 'center');
          api.txt0('★ ' + score + '  ·  ' + TX.rec + ' ' + best + '  ·  ' + TX.dif[dif], w / 2, h - 30, 14, '#e9e1f7', 'center');
        }
      }
    };
    function T0() { return api.T.titulo; }
    function pills() { var pw = Math.min(104, (api.w - 40) / 4 - 8), tot = pw * 4 + 24; return { pw: pw, x0: (api.w - tot) / 2, y0: api.h - 48 }; }
    function rr(x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
  }
  function alternarMudo() { MUDO = !MUDO; lsSet('bt_mudo', MUDO ? '1' : '0'); return MUDO; }

  function registrar(def) {
    var cv = document.getElementById(def.canvas);
    if (!cv || !cv.getContext) return;
    var box = cv.parentNode, g = cv.getContext('2d');
    var api = { g: g, w: 800, h: 450, u: 1, L: L, T: def.t[L] || def.t.en, dpr: 1, clock: 0 };
    api.nota = function (f, d, tp, v) { tom(f, d, tp || 'sine', v || 0.08); };
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
    var bComp = botao('jogo-comp', '⤴', compartilhar); bComp.setAttribute('aria-label', TX.comp); bComp.style.display = 'none';
    function compartilhar() {
      var r = fx.resumo(), txt = TX.fiz(r.score, r.titulo, TX.dif[r.dif], MEDAL[r.medal]).replace(/\s+\(/, ' ('), url = location.href.split('#')[0];
      function copiar() {
        var ok = function () { bComp.textContent = '✓'; setTimeout(function () { bComp.textContent = '⤴'; }, 1600); };
        try { navigator.clipboard.writeText(txt + ' ' + url).then(ok, ok); } catch (e) { ok(); }
      }
      if (navigator.share) { try { navigator.share({ title: r.titulo, text: txt, url: url }).catch(function () {}); } catch (e) { copiar(); } } else copiar();
    }

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
    var fx = criarFx(def.canvas, api, g, function () { return ativo; });
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
      var ee = fx.estado(); bComp.style.display = (ativo && (ee === 'win' || ee === 'lose') && fx.resumo().score > 0) ? '' : 'none';
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
