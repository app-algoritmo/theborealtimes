/* Hárbarðsljóð — leve todos para a outra margem. */
BTJogo.registrar({
  canvas: 'jogo-harbard',
  t: {
  "pt": {
    "toque": "Toque para começar",
    "de_novo": "Toque para tentar de novo",
    "jogar": "Toque para jogar de novo",
    "titulo": "O barco de Hárbarðr",
    "sub": "Leve todos para a outra margem. Toque num passageiro para pô-lo no barco (ou tirá-lo) e depois em ▶ para atravessar. Desafio 1: Thor rema e leva um de cada vez; sem ele, o lobo come a cabra e a cabra come o feno. Desafio 2: três homens e três trolls, dois lugares no barco; numa margem com homens, os trolls nunca podem ser mais que eles. As travessias são limitadas.",
    "perdeu": "As travessias acabaram",
    "v1": "Todos chegaram à outra margem!",
    "v2": "No Hárbarðsljóð, o barqueiro se recusa a levar Thor. O quebra-cabeça de travessia é invenção.",
    "h1": "Desafio",
    "h2": "Travessias",
    "goat": "Cabra",
    "wolf": "Lobo",
    "hay": "Feno",
    "man": "Homem",
    "troll": "Troll",
    "thor": "Thor",
    "warn": "Perigo!"
  },
  "en": {
    "toque": "Tap to start",
    "de_novo": "Tap to try again",
    "jogar": "Tap to play again",
    "titulo": "Hárbarðr's boat",
    "sub": "Take everyone to the other bank. Tap a passenger to put it in the boat (or take it out) and then ▶ to cross. Puzzle 1: Thor rows and takes one at a time; without him, the wolf eats the goat and the goat eats the hay. Puzzle 2: three men and three trolls, two seats in the boat; on a bank with men, the trolls may never outnumber them. Crossings are limited.",
    "perdeu": "The crossings ran out",
    "v1": "Everyone reached the other bank!",
    "v2": "In the Hárbarðsljóð the ferryman refuses to take Thor. The crossing puzzle is made up.",
    "h1": "Puzzle",
    "h2": "Crossings",
    "goat": "Goat",
    "wolf": "Wolf",
    "hay": "Hay",
    "man": "Man",
    "troll": "Troll",
    "thor": "Thor",
    "warn": "Danger!"
  },
  "no": {
    "toque": "Trykk for å starte",
    "de_novo": "Trykk for å prøve igjen",
    "jogar": "Trykk for å spille igjen",
    "titulo": "Hárbarðrs båt",
    "sub": "Få alle over til den andre bredden. Trykk på en passasjer for å sette ham i båten (eller ta ham ut), og deretter på ▶ for å krysse. Oppgave 1: Tor ror og tar med én om gangen; uten ham spiser ulven geita, og geita spiser høyet. Oppgave 2: tre menn og tre troll, to plasser i båten; på en bredd med menn kan trollene aldri være flere enn dem. Overfartene er begrenset.",
    "perdeu": "Overfartene var brukt opp",
    "v1": "Alle kom over til den andre bredden!",
    "v2": "I Hárbarðsljóð nekter ferjemannen å ta med Tor. Overfartsgåten er diktet opp.",
    "h1": "Oppgave",
    "h2": "Overfarter",
    "goat": "Geit",
    "wolf": "Ulv",
    "hay": "Høy",
    "man": "Mann",
    "troll": "Troll",
    "thor": "Tor",
    "warn": "Fare!"
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
    var LV = [{ n: 3, cap: 1, rower: true, lim: 13, kinds: ['goat', 'wolf', 'hay'] }, { n: 6, cap: 2, rower: false, lim: 20, kinds: ['man', 'man', 'man', 'troll', 'troll', 'troll'] }];
    var lv = 0, items = [], boat = 0, cross = 0, pop = 0, warn = 0, anim = 0, tmr = 0, LIM = 240;
    function lay() { var W = api.w, H = api.h, bw = Math.min(W * 0.26, 130); return { W: W, H: H, bw: bw, y0: 118, rowh: Math.min(48, (H - 260) / 6), bx: [W * 0.02, W * 0.98 - bw], bt: H - 78 }; }
    function slot(it, i) { var L = lay(), bank = it.side, n = 0; for (var k = 0; k < items.length; k++) { if (k === i) break; if (items[k].side === bank && !items[k].inb) n++; } return { x: L.bx[bank] + L.bw / 2, y: L.y0 + n * (L.rowh + 6) + L.rowh / 2, w: L.bw, h: L.rowh }; }
    function boatPos() { var L = lay(), x = boat ? L.W * 0.98 - L.bw - L.W * 0.12 : L.W * 0.02 + L.bw + L.W * 0.12; return { x: x + (boat ? -1 : 1) * 0, y: L.y0 + 3.2 * (L.rowh + 6) + 28, w: Math.min(L.W * 0.18, 96), h: 26 }; }
    function inboat() { var r = []; items.forEach(function (it, i) { if (it.inb) r.push(i); }); return r; }
    function tpos(it, i) { if (it.inb) { var b = boatPos(), idx = inboat().indexOf(i); return { x: b.x + (idx - (inboat().length - 1) / 2) * (b.w * 0.52), y: b.y - 28, w: Math.max(28, b.w * 0.5), h: 36 }; } return slot(it, i); }
    function setupLv() { var d = LV[lv]; items = []; for (var i = 0; i < d.n; i++) items.push({ k: d.kinds[i], side: 0, inb: false }); boat = 0; cross = 0; }
    function setup() { lv = 0; tmr = LIM; warn = 0; setupLv(); }
    function reset() { setup(); st = 'play'; }
    function legal(dep, arr, load) {
      var d = LV[lv], cnt = function (bank, incl) { var o = { goat: 0, wolf: 0, hay: 0, man: 0, troll: 0 }; items.forEach(function (it, i) { var on = it.side === bank && !it.inb; if (incl && load.indexOf(i) >= 0) on = true; if (on) o[it.k]++; }); return o; };
      if (d.rower) { var c = cnt(dep, false); if (c.wolf && c.goat) return false; if (c.goat && c.hay) return false; return true; }
      var a = cnt(dep, false), b = cnt(arr, true); if (a.man && a.troll > a.man) return false; if (b.man && b.troll > b.man) return false; return true;
    }
    function go() {
      if (st !== 'play') return; var d = LV[lv], load = inboat(); if (!d.rower && !load.length) { warn = 0.8; return; }
      var dep = boat, arr = 1 - boat; if (!legal(dep, arr, load)) { warn = 1.2; if (api.nota) api.nota(130, 0.2, 'sawtooth', 0.06); return; }
      load.forEach(function (i) { items[i].side = arr; items[i].inb = false; }); boat = arr; cross++; anim = 0.4; if (api.nota) api.nota(320, 0.1, 'triangle', 0.05);
      if (items.every(function (it) { return it.side === 1; })) { if (lv + 1 >= LV.length) { st = 'win'; return; } lv++; setupLv(); return; }
      if (cross >= d.lim) st = 'lose';
    }
    function tapItem(i) { var it = items[i], d = LV[lv]; if (it.inb) { it.inb = false; return; } if (it.side !== boat) return; if (inboat().length >= d.cap) return; it.inb = true; }
    function btnGo() { var L = lay(); return { x: L.W / 2, y: L.bt + 8, w: 120, h: 44 }; }
    setup();
    return {
      pausar: function () {},
      dbg: function () { var L = lay(); return { st: st, lv: lv, items: items.map(function (it) { return { k: it.k, side: it.side, inb: it.inb }; }), boat: boat, cross: cross, lim: LV[lv].lim, cap: LV[lv].cap, rower: LV[lv].rower, pos: function (i) { return tpos(items[i], i); }, go: btnGo(), tmr: tmr }; },
      down: function (x, y) { if (menu()) return; var gb = btnGo(); if (Math.abs(x - gb.x) < gb.w / 2 && Math.abs(y - gb.y) < gb.h / 2 + 4) { go(); return; } for (var i = 0; i < items.length; i++) { var p = tpos(items[i], i); if (Math.abs(x - p.x) < p.w / 2 + 2 && Math.abs(y - p.y) < p.h / 2 + 2) { tapItem(i); return; } } },
      key: function (k, d) { if (!d) return; if (st !== 'play') { menu(); return; } if (k === 'Space' || k === 'Enter') go(); },
      update: function (dt) { pop += dt; if (warn > 0) warn -= dt; if (anim > 0) anim -= dt; if (st !== 'play') return; tmr -= dt; if (tmr <= 0) { tmr = 0; st = 'lose'; } },
      draw: function () {
        var W = api.w, H = api.h, L = lay(), i;
        bg('#12303c', '#050e14');
        g.fillStyle = 'rgba(70,120,160,.35)'; g.fillRect(L.bx[0] + L.bw, 96, L.bx[1] - L.bx[0] - L.bw, H - 190);
        for (i = 0; i < 6; i++) { g.strokeStyle = 'rgba(255,255,255,.08)'; g.lineWidth = 2; g.beginPath(); g.moveTo(L.bx[0] + L.bw + 10, 130 + i * 40 + Math.sin(pop * 2 + i) * 3); g.lineTo(L.bx[1] - 10, 130 + i * 40 + Math.sin(pop * 2 + i + 1) * 3); g.stroke(); }
        [0, 1].forEach(function (b) { g.fillStyle = '#3a4a2a'; g.fillRect(L.bx[b] - (b ? 0 : 6), 96, L.bw + 6, H - 190); });
        var bp = boatPos(), bx = bp.x; g.fillStyle = '#8a5a3a'; rr(bx - bp.w / 2, bp.y - 6, bp.w, 22, 8); g.fill(); g.fillStyle = 'rgba(255,255,255,.5)'; if (LV[lv].rower) txt(T.thor, bx, bp.y + 12, 13, '#ffd88a');
        for (i = 0; i < items.length; i++) { var it = items[i], p = tpos(it, i), col = it.k === 'goat' ? '#c8b080' : it.k === 'wolf' ? '#7a7a8a' : it.k === 'hay' ? '#d0b040' : it.k === 'man' ? '#ffd88a' : '#5aa05a'; g.fillStyle = col; rr(p.x - p.w / 2 + 2, p.y - p.h / 2 + 2, p.w - 4, p.h - 4, 8); g.fill(); if (it.inb) { g.strokeStyle = '#fff'; g.lineWidth = 2; g.stroke(); } txt(T[it.k], p.x, p.y + 5, Math.min(15, p.w / 5), 'rgba(0,0,0,.75)'); }
        var gb = btnGo(); g.fillStyle = warn > 0 ? 'rgba(192,57,43,.7)' : 'rgba(255,216,138,.25)'; rr(gb.x - gb.w / 2, gb.y - gb.h / 2, gb.w, gb.h, 12); g.fill(); txt(warn > 0 ? T.warn : '▶', gb.x, gb.y + 8, 22, '#fff');
        bar(W / 2 - 110, H - 14, 220, 5, tmr / LIM, tmr < 40 ? '#c0392b' : '#ffd88a');
        hud(T.h1 + ' ' + (lv + 1) + '/' + LV.length, T.h2 + ' ' + cross + '/' + LV[lv].lim, cross > LV[lv].lim - 4);
        fim(st);
      }
    };
  }
});
