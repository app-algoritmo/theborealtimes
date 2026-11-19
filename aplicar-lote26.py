import re,json,os,glob
os.chdir(os.path.expanduser('~/Documents/theborealtimes'))
D=[('gullthoris', 'jogo-gullthoris', 'sagas', ('jogo-as-moedas-do-dragao', 'game-the-dragons-coins', 'spill-dragens-mynter')), ('bjarnar', 'jogo-bjarnar', 'sagas', ('jogo-a-mensagem-falsificada', 'game-the-forged-message', 'spill-den-forfalskede-meldingen')), ('nott', 'jogo-nott', 'mitos', ('jogo-dia-e-noite', 'game-day-and-night', 'spill-dag-og-natt')), ('bravellir', 'jogo-bravellir', 'sagas', ('jogo-a-frota-de-bravellir', 'game-the-fleet-of-bravellir', 'spill-flaten-ved-bravellir')), ('starkad', 'jogo-starkad', 'sagas', ('jogo-o-sorteio-de-odin', 'game-odins-lots', 'spill-odins-lodd')), ('sinfjotli', 'jogo-sinfjotli', 'sagas', ('jogo-as-duas-peles-de-lobo', 'game-the-two-wolfskins', 'spill-de-to-ulveskinnene')), ('nesjar', 'jogo-nesjar', 'viking', ('jogo-o-fiorde-tomado', 'game-the-fjord-taken', 'spill-fjorden-erobret')), ('hoen', 'jogo-hoen', 'viking', ('jogo-o-colar-de-hoen', 'game-the-hoen-necklace', 'spill-hoen-halskjedet')), ('overhogdal', 'jogo-overhogdal', 'viking', ('jogo-o-tear-de-overhogdal', 'game-the-overhogdal-loom', 'spill-overhogdal-veven')), ('vinland', 'jogo-vinland', 'viking', ('jogo-o-mapa-e-a-copia', 'game-the-map-and-the-copy', 'spill-kartet-og-kopien')), ('papar', 'jogo-papar', 'viking', ('jogo-os-odres-dos-papar', 'game-the-waterskins-of-the-papar', 'spill-paparenes-vannsekker')), ('finfolk', 'jogo-finfolk', 'contos', ('jogo-as-moedas-dos-finfolk', 'game-the-finfolks-coins', 'spill-finfolkenes-mynter')), ('hogboon', 'jogo-hogboon', 'contos', ('jogo-a-porta-do-monte', 'game-the-door-of-the-mound', 'spill-porten-i-haugen'))]
anc=['jogo-a-ponte-do-sonho','game-the-dream-bridge','spill-drombroen']
y=open('boreal.yaml',encoding='utf-8').read()
if 'jogo_gullthoris:' in y:
    print('yaml: ja aplicado, nada a fazer')
else:
    for li in range(3):
        ln='    jogo_draumkvedet: '+anc[li]+'\n'
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
    if '/g/tela.js?v=24' in x: open(p,'w',encoding='utf-8').write(x.replace('/g/tela.js?v=24','/g/tela.js?v=25')); n+=1
print('tela.js: temas =',len(T),'; paginas com v=25:',n)
