/* A senhora da floresta — responda às perguntas sobre os seres do folclore nórdico. */
BTJogo.registrar({
  canvas: 'jogo-skogsra',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "A senhora da floresta",
    "sub": "A skogsrå, a senhora da floresta, testa o seu conhecimento. São oito perguntas sobre os seres do folclore nórdico, cada uma com quatro respostas e vinte segundos. Toque na resposta (ou use as teclas de 1 a 4). Responder errado, ou deixar o tempo acabar, conta como erro; no terceiro erro o jogo acaba.",
    "perdeu": "A floresta o confundiu",
    "v1": "A floresta o deixa passar!",
    "v2": "A skogsrå aparece no folclore sueco. As perguntas e as respostas do jogo resumem tradições populares.",
    "h1": "Acertos",
    "h2": "Erros"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "The lady of the forest",
    "sub": "The skogsrå, the lady of the forest, tests your knowledge. Eight questions about beings of Nordic folklore, each with four answers and twenty seconds. Tap the answer (or use the keys 1 to 4). A wrong answer, or running out of time, counts as a mistake; the third mistake ends the game.",
    "perdeu": "The forest has confused you",
    "v1": "The forest lets you pass!",
    "v2": "The skogsrå appears in Swedish folklore. The questions and answers summarise popular traditions.",
    "h1": "Correct",
    "h2": "Mistakes"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Skogens frue",
    "sub": "Skogsråa, skogens frue, tester kunnskapene dine. Åtte spørsmål om vesener i nordisk folketro, hver med fire svar og tjue sekunder. Trykk på svaret (eller bruk tastene 1 til 4). Feil svar, eller at tiden går ut, teller som feil; ved den tredje feilen er spillet over.",
    "perdeu": "Skogen forvirret deg",
    "v1": "Skogen slipper deg forbi!",
    "v2": "Skogsråa finnes i svensk folketro. Spørsmålene og svarene oppsummerer folkelige tradisjoner.",
    "h1": "Riktige",
    "h2": "Feil"
  },
  "es": {
    "toque": "Toca para empezar",
    "de_novo": "Toca para intentarlo de nuevo",
    "jogar": "Toca para jugar otra vez",
    "titulo": "La señora del bosque",
    "sub": "La skogsrå, la señora del bosque, pone a prueba tus conocimientos. Son ocho preguntas sobre los seres del folclore nórdico, cada una con cuatro respuestas y veinte segundos. Toca la respuesta (o usa las teclas del 1 al 4). Responder mal, o dejar que se acabe el tiempo, cuenta como error; al tercer error el juego termina.",
    "perdeu": "El bosque te confundió",
    "v1": "¡El bosque te deja pasar!",
    "v2": "La skogsrå aparece en el folclore sueco. Las preguntas y las respuestas del juego resumen tradiciones populares.",
    "h1": "Aciertos",
    "h2": "Errores"
  }
},
  criar: function (api) {
    var g = api.g, T = api.T, txt = api.txt;
    var st = 'menu';
    function menu() { if (st === 'menu' || st === 'lose') { reset(); return true; } if (st === 'win') { st = 'menu'; return true; } return false; }
    function fim(s) {
      if (s === 'menu') api.cartaz(T.titulo, [T.sub], T.toque);
      else if (s === 'lose') api.cartaz(T.perdeu, [], T.de_novo, '#ff9a8d');
      else if (s === 'win') api.cartaz(T.v1, [T.v2], T.jogar, '#ffd88a');
    }
    function bg(a, b) { var s = g.createLinearGradient(0, 0, 0, api.h); s.addColorStop(0, a); s.addColorStop(1, b); g.fillStyle = s; g.fillRect(0, 0, api.w, api.h); }
    function hud(a, b, bad) { if (st === 'menu') return; txt(a, 22, 32, 15, '#f3ecd2', 'left'); if (b) txt(b, 22, 54, 13, bad ? '#ffb08a' : '#c9b3f2', 'left'); }
    function rr(x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
    function bar(x, y, w, h, f, c) { g.fillStyle = 'rgba(0,0,0,.28)'; g.fillRect(x, y, w, h); g.fillStyle = c; g.fillRect(x, y, w * Math.max(0, Math.min(1, f)), h); }
    var QS = [{"pt": {"q": "Segundo o folclore sueco, o que denuncia a skogsrå quando ela se vira de costas?", "o": ["As costas ocas, como um tronco", "Asas de corvo", "Cabelos de fogo", "Pés de cabra"]}, "en": {"q": "In Swedish folklore, what gives the skogsrå away when she turns her back?", "o": ["A hollow back, like a tree trunk", "Raven wings", "Hair of fire", "Goat's feet"]}, "no": {"q": "Ifølge svensk folketro, hva avslører skogsråa når hun snur ryggen til?", "o": ["En hul rygg, som en trestamme", "Ravnevinger", "Hår av ild", "Geitebein"]}, "es": {"q": "Según el folclore sueco, ¿qué delata a la skogsrå cuando se da la vuelta?", "o": ["La espalda hueca, como un tronco", "Alas de cuervo", "Cabellos de fuego", "Pies de cabra"]}}, {"pt": {"q": "Que oferenda se deixa ao tomte na noite de Natal, na tradição escandinava?", "o": ["Mingau com manteiga", "Uma moeda de prata", "Uma vela acesa", "Pão com mel"]}, "en": {"q": "What offering is left for the tomte on Christmas Eve, in Scandinavian tradition?", "o": ["Porridge with butter", "A silver coin", "A lit candle", "Bread with honey"]}, "no": {"q": "Hva setter man frem til tomten julaften, ifølge skandinavisk tradisjon?", "o": ["Grøt med smør", "En sølvmynt", "Et tent lys", "Brød med honning"]}, "es": {"q": "¿Qué ofrenda se deja al tomte en la noche de Navidad, en la tradición escandinava?", "o": ["Gachas con mantequilla", "Una moneda de plata", "Una vela encendida", "Pan con miel"]}}, {"pt": {"q": "Onde vive o näcken (nøkken), o espírito que toca violino?", "o": ["Em rios e lagos", "Em cavernas de gelo", "Em telhados de casas", "No alto das montanhas"]}, "en": {"q": "Where does the näcken (nøkk), the spirit who plays the fiddle, live?", "o": ["In rivers and lakes", "In ice caves", "On rooftops", "On mountaintops"]}, "no": {"q": "Hvor bor nøkken, ånden som spiller fele?", "o": ["I elver og vann", "I ishuler", "På hustak", "På fjelltopper"]}, "es": {"q": "¿Dónde vive el näcken (nøkken), el espíritu que toca el violín?", "o": ["En ríos y lagos", "En cuevas de hielo", "En los tejados de las casas", "En lo alto de las montañas"]}}, {"pt": {"q": "O que acontece aos trolls quando a luz do sol os alcança, nos contos?", "o": ["Viram pedra", "Ficam invisíveis", "Derretem como gelo", "Crescem de tamanho"]}, "en": {"q": "In the tales, what happens to trolls when sunlight reaches them?", "o": ["They turn to stone", "They become invisible", "They melt like ice", "They grow larger"]}, "no": {"q": "Hva skjer med trollene når sollyset treffer dem, i eventyrene?", "o": ["De blir til stein", "De blir usynlige", "De smelter som is", "De vokser seg større"]}, "es": {"q": "En los cuentos, ¿qué les ocurre a los trolls cuando les alcanza la luz del sol?", "o": ["Se convierten en piedra", "Se vuelven invisibles", "Se derriten como el hielo", "Crecen de tamaño"]}}, {"pt": {"q": "Na tradição nórdica antiga, o que é um draugr?", "o": ["Um morto que guarda o seu túmulo", "Um elfo da floresta", "Uma serpente do mar", "Um cavalo de oito patas"]}, "en": {"q": "In the Old Norse tradition, what is a draugr?", "o": ["A dead man who guards his grave", "A forest elf", "A sea serpent", "An eight-legged horse"]}, "no": {"q": "I norrøn tradisjon, hva er en draugr?", "o": ["En død som vokter graven sin", "En skogsalv", "En havslange", "En hest med åtte bein"]}, "es": {"q": "En la tradición nórdica antigua, ¿qué es un draugr?", "o": ["Un muerto que guarda su tumba", "Un elfo del bosque", "Una serpiente marina", "Un caballo de ocho patas"]}}, {"pt": {"q": "O que o fossegrim, o espírito das cachoeiras, ensina em troca de uma oferenda?", "o": ["Tocar rabeca", "Forjar espadas", "Ler runas", "Navegar pelas estrelas"]}, "en": {"q": "What does the fossegrim, the spirit of waterfalls, teach in return for an offering?", "o": ["Playing the fiddle", "Forging swords", "Reading runes", "Sailing by the stars"]}, "no": {"q": "Hva lærer fossegrimen, fossens ånd, bort mot et offer?", "o": ["Å spille fele", "Å smi sverd", "Å lese runer", "Å seile etter stjernene"]}, "es": {"q": "¿Qué enseña el fossegrim, el espíritu de las cascadas, a cambio de una ofrenda?", "o": ["A tocar el violín", "A forjar espadas", "A leer runas", "A navegar por las estrellas"]}}, {"pt": {"q": "Quem são as nornas, na mitologia nórdica?", "o": ["Mulheres que tecem o destino", "Cavalos das valquírias", "Guardiões da ponte Bifrost", "Corvos de Odin"]}, "en": {"q": "Who are the norns in Norse mythology?", "o": ["Women who shape fate", "Horses of the valkyries", "Guardians of Bifrost", "Odin's ravens"]}, "no": {"q": "Hvem er nornene i norrøn mytologi?", "o": ["Kvinner som former skjebnen", "Valkyrjenes hester", "Vokterne av Bifrost", "Odins ravner"]}, "es": {"q": "¿Quiénes son las nornas, en la mitología nórdica?", "o": ["Mujeres que tejen el destino", "Caballos de las valquirias", "Guardianes del puente Bifrost", "Cuervos de Odín"]}}, {"pt": {"q": "Que papel têm os landvættir, na tradição islandesa?", "o": ["Espíritos que protegem a terra", "Navios de guerra dos vikings", "Juízes do Althing", "Mercadores do mar do Norte"]}, "en": {"q": "What role do the landvættir play in Icelandic tradition?", "o": ["Spirits that protect the land", "Viking warships", "Judges of the Althing", "North Sea merchants"]}, "no": {"q": "Hvilken rolle har landvettene i islandsk tradisjon?", "o": ["Ånder som verner landet", "Vikingenes krigsskip", "Dommere på Alltinget", "Handelsmenn i Nordsjøen"]}, "es": {"q": "¿Qué papel tienen los landvættir, en la tradición islandesa?", "o": ["Espíritus que protegen la tierra", "Barcos de guerra de los vikingos", "Jueces del Althing", "Mercaderes del mar del Norte"]}}], NQ = 8, MAXE = 3, LIMQ = 20;
    var order = [], qi = 0, opts = [], right = 0, errs = 0, tmr = LIMQ, wait = 0, chosen = -1, corr = 0, sel = 0, okc = 0;
    function shuf(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
    function ask() { var o = [0, 1, 2, 3]; shuf(o); opts = o; corr = o.indexOf(0); tmr = LIMQ; wait = 0; chosen = -1; sel = 0; }
    function setup() { order = shuf([0, 1, 2, 3, 4, 5, 6, 7]); qi = 0; right = 0; errs = 0; ask(); }
    function reset() { setup(); st = 'play'; }
    function answer(i) {
      if (st !== 'play' || wait > 0) return; chosen = i; wait = 1.0; if (i === corr) { right++; if (api.nota) api.nota(600, 0.12, 'triangle', 0.06); } else { errs++; if (api.nota) api.nota(150, 0.2, 'sawtooth', 0.05); }
    }
    function done() { if (errs >= MAXE) { st = 'lose'; return; } qi++; if (qi >= NQ) { st = 'win'; return; } ask(); }
    function bx(i) { var w = Math.min(api.w - 36, 520), top = api.h * 0.4 + 2; return { x: (api.w - w) / 2, y: top + i * ((api.h * 0.58 - 10) / 4), w: w, h: (api.h * 0.58 - 10) / 4 - 8 }; }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var b = []; for (var i = 0; i < 4; i++) { var q = bx(i); b.push({ x: q.x + q.w / 2, y: q.y + q.h / 2 }); } return { st: st, qi: qi, right: right, errs: errs, corr: corr, tmr: tmr, wait: wait, box: b, q: QS[order[Math.min(qi, NQ - 1)]].pt }; },
      down: function (x, y) { if (menu()) return; for (var i = 0; i < 4; i++) { var b = bx(i); if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) { answer(i); return; } } },
      key: function (c, d) {
        if (!d) return; if (/^(Digit|Numpad)[1-4]$/.test(c)) { answer(+c.slice(-1) - 1); return; }
        if (c === 'ArrowUp' || c === 'KeyW') sel = (sel + 3) % 4; else if (c === 'ArrowDown' || c === 'KeyS') sel = (sel + 1) % 4; else if (c === 'Space' || c === 'Enter') { if (st !== 'play') menu(); else answer(sel); }
      },
      update: function (dt) { if (st !== 'play') return; if (wait > 0) { wait -= dt; if (wait <= 0) done(); return; } tmr -= dt; if (tmr <= 0) { chosen = -2; errs++; wait = 1.0; } },
      draw: function () {
        var W = api.w, H = api.h, q = QS[order[Math.min(qi, NQ - 1)]][api.L] || QS[order[Math.min(qi, NQ - 1)]].pt, i, ls;
        bg('#1f2d22', '#0a120c');
        g.fillStyle = 'rgba(255,255,255,.05)'; rr(14, 66, W - 28, H * 0.3, 12); g.fill();
        ls = api.quebra ? api.quebra(q.q, W - 60, 20) : null; if (!ls || !ls.length) ls = [q.q];
        for (i = 0; i < ls.length; i++) txt(ls[i], W / 2, 66 + 36 + i * 26, 20, '#f3ecd2');
        for (i = 0; i < 4; i++) {
          var b = bx(i), isC = i === corr, show = wait > 0 || chosen === -2; g.fillStyle = show ? (isC ? 'rgba(106,190,120,.55)' : (i === chosen ? 'rgba(200,80,70,.55)' : 'rgba(255,255,255,.06)')) : (sel === i ? 'rgba(255,255,255,.2)' : 'rgba(255,255,255,.1)'); rr(b.x, b.y, b.w, b.h, 10); g.fill();
          var tx = q.o[opts[i]], l2 = api.quebra ? api.quebra(tx, b.w - 60, 16) : null; if (!l2 || !l2.length) l2 = [tx]; txt(String(i + 1), b.x + 20, b.y + b.h / 2 + 6, 16, 'rgba(255,255,255,.5)'); for (var j = 0; j < l2.length; j++) txt(l2[j], b.x + b.w / 2 + 8, b.y + b.h / 2 + 6 - (l2.length - 1) * 9 + j * 18, 16, '#fff');
        }
        bar(W / 2 - 110, H - 12, 220, 5, tmr / LIMQ, tmr < 6 ? '#c0392b' : '#6ac07a');
        hud(T.h1 + ' ' + right + '/' + NQ, T.h2 + ' ' + errs + '/' + MAXE, errs > 0);
        fim(st);
      }
    };
  }
});
