import re,json,os,glob
os.chdir(os.path.expanduser('~/Documents/theborealtimes'))
D=[('forseti', 'jogo-forseti', 'mitos', ('jogo-a-sentenca-de-forseti', 'game-forsetis-verdict', 'spill-forsetes-dom')), ('hermodr', 'jogo-hermodr', 'mitos', ('jogo-as-nove-noites-de-hermodr', 'game-hermods-nine-nights', 'spill-hermods-ni-netter')), ('nidhoggr', 'jogo-nidhoggr', 'mitos', ('jogo-as-raizes-de-nidhoggr', 'game-nidhoggrs-roots', 'spill-nidhoggs-rotter')), ('garmr', 'jogo-garmr', 'mitos', ('jogo-os-uivos-de-garmr', 'game-garmrs-howls', 'spill-garms-hyl')), ('islendingabok', 'jogo-islendingabok', 'sagas', ('jogo-os-rolos-de-ari', 'game-aris-scrolls', 'spill-aris-ruller')), ('fagrskinna', 'jogo-fagrskinna', 'sagas', ('jogo-os-selos-da-fagrskinna', 'game-the-seals-of-fagrskinna', 'spill-seglene-i-fagrskinna')), ('hauksbok', 'jogo-hauksbok', 'sagas', ('jogo-o-algorismo-de-haukr', 'game-haukrs-algorism', 'spill-haukrs-algorismus')), ('lanse', 'jogo-lanse', 'viking', ('jogo-a-sondagem-em-lanse-aux-meadows', 'game-the-survey-at-lanse-aux-meadows', 'spill-undersokelsen-pa-lanse-aux-meadows')), ('galloway', 'jogo-galloway', 'viking', ('jogo-o-tesouro-de-galloway', 'game-the-galloway-hoard', 'spill-galloway-skatten')), ('danelaw', 'jogo-danelaw', 'viking', ('jogo-os-cinco-burgos', 'game-the-five-boroughs', 'spill-de-fem-byene')), ('vaettir', 'jogo-vaettir', 'contos', ('jogo-os-guardioes-da-ilha', 'game-the-guardians-of-the-island', 'spill-oyas-voktere')), ('mestermoy', 'jogo-mestermoy', 'contos', ('jogo-o-estabulo-da-mestermoy', 'game-the-mestermoys-stable', 'spill-mestermoys-stall')), ('jonarnason', 'jogo-jonarnason', 'contos', ('jogo-os-fios-dos-contos-de-jon', 'game-the-threads-of-jons-tales', 'spill-trader-i-jons-fortellinger'))]
anc=['jogo-as-sementes-do-monte','game-the-seeds-of-the-mound','spill-froene-i-haugen']
y=open('boreal.yaml',encoding='utf-8').read()
if 'jogo_forseti:' in y:
    print('yaml: ja aplicado, nada a fazer')
else:
    for li in range(3):
        ln='    jogo_draugr: '+anc[li]+'\n'
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
    if '/g/tela.js?v=20' in x: open(p,'w',encoding='utf-8').write(x.replace('/g/tela.js?v=20','/g/tela.js?v=21')); n+=1
print('tela.js: temas =',len(T),'; paginas com v=21:',n)
