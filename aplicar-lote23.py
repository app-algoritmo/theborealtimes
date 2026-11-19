import re,json,os,glob
os.chdir(os.path.expanduser('~/Documents/theborealtimes'))
D=[('hoenir', 'jogo-hoenir', 'mitos', ('jogo-o-refem-e-as-trocas', 'game-the-hostage-and-the-exchanges', 'spill-gisselen-og-byttene')), ('heidrun', 'jogo-heidrun', 'mitos', ('jogo-o-hidromel-de-heidrun', 'game-heidruns-mead', 'spill-heidruns-mjod')), ('angrboda', 'jogo-angrboda', 'mitos', ('jogo-a-floresta-de-ferro', 'game-the-iron-wood', 'spill-jernskogen')), ('hiisi', 'jogo-hiisi', 'mitos', ('jogo-o-bosque-de-hiisi', 'game-hiisis-grove', 'spill-hiisis-lund')), ('vatnsdaela', 'jogo-vatnsdaela', 'sagas', ('jogo-as-pedras-do-vale', 'game-the-stones-of-the-valley', 'spill-steinene-i-dalen')), ('kormak', 'jogo-kormak', 'sagas', ('jogo-as-covas-de-kormakr', 'game-kormakrs-pits', 'spill-kormaks-groper')), ('heidarviga', 'jogo-heidarviga', 'sagas', ('jogo-a-charneca-dos-combates', 'game-the-heath-of-the-fights', 'spill-heia-der-de-kjempet')), ('freydis', 'jogo-freydis', 'sagas', ('jogo-as-tripulacoes-de-freydis', 'game-freydis-crews', 'spill-freydis-mannskaper')), ('borgring', 'jogo-borgring', 'viking', ('jogo-os-caminhos-de-borgring', 'game-the-paths-of-borgring', 'spill-stiene-i-borgring')), ('borre', 'jogo-borre', 'viking', ('jogo-o-no-de-borre', 'game-borres-knot', 'spill-borreknuten')), ('karitrestakk', 'jogo-karitrestakk', 'contos', ('jogo-o-boi-e-as-caixas', 'game-the-bull-and-the-crates', 'spill-oksen-og-kassene')), ('glassberget', 'jogo-glassberget', 'contos', ('jogo-a-subida-da-montanha-de-vidro', 'game-the-climb-of-the-glass-mountain', 'spill-oppstigningen-pa-glassberget')), ('tatterhood', 'jogo-tatterhood', 'contos', ('jogo-os-trapos-de-tatterhood', 'game-tatterhoods-rags', 'spill-lurvehettes-filler'))]
anc=['jogo-os-fios-dos-contos-de-jon','game-the-threads-of-jons-tales','spill-trader-i-jons-fortellinger']
y=open('boreal.yaml',encoding='utf-8').read()
if 'jogo_hoenir:' in y:
    print('yaml: ja aplicado, nada a fazer')
else:
    for li in range(3):
        ln='    jogo_jonarnason: '+anc[li]+'\n'
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
    if '/g/tela.js?v=21' in x: open(p,'w',encoding='utf-8').write(x.replace('/g/tela.js?v=21','/g/tela.js?v=22')); n+=1
print('tela.js: temas =',len(T),'; paginas com v=22:',n)
