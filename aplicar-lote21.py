import re,json,os,glob
os.chdir(os.path.expanduser('~/Documents/theborealtimes'))
D=[('bragi', 'jogo-bragi', 'mitos', ('jogo-as-runas-de-bragi', 'game-bragis-runes', 'spill-bragis-runer')), ('surtr', 'jogo-surtr', 'mitos', ('jogo-a-chama-de-surtr', 'game-surtrs-flame', 'spill-surts-flamme')), ('nerthus', 'jogo-nerthus', 'mitos', ('jogo-a-carroca-de-nerthus', 'game-nerthus-wagon', 'spill-nerthus-vogn')), ('jotnar', 'jogo-jotnar', 'mitos', ('jogo-deuses-e-jotnar-no-rio', 'game-gods-and-jotnar-at-the-river', 'spill-guder-og-jotnar-ved-elva')), ('flatey', 'jogo-flatey', 'sagas', ('jogo-as-folhas-da-flateyjarbok', 'game-the-leaves-of-the-flateyjarbok', 'spill-bladene-i-flateyjarbok')), ('morkinskinna', 'jogo-morkinskinna', 'sagas', ('jogo-os-pergaminhos-da-morkinskinna', 'game-the-parchments-of-morkinskinna', 'spill-pergamentene-i-morkinskinna')), ('heimskringla', 'jogo-heimskringla', 'sagas', ('jogo-os-pinos-do-orbe', 'game-the-pegs-of-the-orb', 'spill-pinnene-pa-kloden')), ('gulating', 'jogo-gulating', 'viking', ('jogo-as-contas-do-gulating', 'game-the-accounts-of-the-gulating', 'spill-regnskapet-pa-gulating')), ('valsgarde', 'jogo-valsgarde', 'viking', ('jogo-a-escavacao-de-valsgarde', 'game-the-excavation-at-valsgarde', 'spill-utgravingen-pa-valsgarde')), ('thralls', 'jogo-thralls', 'viking', ('jogo-os-jarros-do-thrall', 'game-the-thralls-jugs', 'spill-trellens-krukker')), ('nuckelavee', 'jogo-nuckelavee', 'contos', ('jogo-o-nuckelavee-na-charneca', 'game-the-nuckelavee-on-the-moor', 'spill-nuckelaveen-pa-heia')), ('valravn', 'jogo-valravn', 'contos', ('jogo-o-cavaleiro-corvo', 'game-the-knight-raven', 'spill-ridder-ravnen')), ('draugr', 'jogo-draugr', 'contos', ('jogo-as-sementes-do-monte', 'game-the-seeds-of-the-mound', 'spill-froene-i-haugen'))]
anc=['jogo-o-tambor-das-ahkka','game-the-ahkka-drum','spill-ahkka-trommen']
y=open('boreal.yaml',encoding='utf-8').read()
if 'jogo_bragi:' in y:
    print('yaml: ja aplicado, nada a fazer')
else:
    for li in range(3):
        ln='    jogo_ahkka: '+anc[li]+'\n'
        assert y.count(ln)==1,('ancora nao encontrada no yaml',ln)
        y=y.replace(ln,ln+''.join('    jogo_%s: %s\n'%(k,s[li]) for k,cv,cor,s in D))
    open('boreal.yaml','w',encoding='utf-8').write(y)
    print('yaml: 39 chaves novas adicionadas (o resto do arquivo nao foi tocado)')
t=open('jogos/tela.js',encoding='utf-8').read()
m=re.search(r'var TEMAS = (\{.*?\});',t); T=json.loads(m.group(1))
for k,cv,cor,s in D: T[cv]=cor
T=dict(sorted(T.items()))
t=t.replace(m.group(0),'var TEMAS = '+json.dumps(T,ensure_ascii=False,separators=(',',':'))+';')
open('jogos/tela.js','w',encoding='utf-8').write(t)
n=0
for p in glob.glob('conteudo/*/paginas/*.md'):
    x=open(p,encoding='utf-8').read()
    if '/g/tela.js?v=19' in x: open(p,'w',encoding='utf-8').write(x.replace('/g/tela.js?v=19','/g/tela.js?v=20')); n+=1
print('tela.js: temas =',len(T),'; paginas com v=20:',n)
