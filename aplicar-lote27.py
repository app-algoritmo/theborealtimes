import re,json,os,glob
os.chdir(os.path.expanduser('~/Documents/theborealtimes'))
D=[('lif', 'jogo-lif', 'mitos', ('jogo-o-abrigo-de-lif', 'game-lifs-hiding-place', 'spill-lifs-skjulested')), ('ratatoskr', 'jogo-ratatoskr', 'mitos', ('jogo-as-criaturas-da-arvore', 'game-the-creatures-of-the-tree', 'spill-skapningene-i-treet')), ('seidr', 'jogo-seidr', 'mitos', ('jogo-o-fio-do-seidr', 'game-the-thread-of-seidr', 'spill-seidr-traden')), ('audun', 'jogo-audun', 'sagas', ('jogo-o-caminho-do-urso', 'game-the-bears-road', 'spill-bjornens-vei')), ('kroka', 'jogo-krokaref', 'sagas', ('jogo-as-caixas-de-ref', 'game-refs-crates', 'spill-refs-kasser')), ('bosa', 'jogo-bosa', 'sagas', ('jogo-a-bolsa-de-sjod', 'game-sjods-purse', 'spill-sjods-pung')), ('finnboga', 'jogo-finnboga', 'sagas', ('jogo-a-forca-de-finnbogi', 'game-finnbogis-strength', 'spill-finnbogis-styrke')), ('hiddensee', 'jogo-hiddensee', 'viking', ('jogo-os-pingentes-de-hiddensee', 'game-the-hiddensee-pendants', 'spill-hiddensee-anheng')), ('mammen', 'jogo-mammen', 'viking', ('jogo-os-machados-de-mammen', 'game-the-axes-of-mammen', 'spill-mammen-oksene')), ('topon', 'jogo-topon', 'viking', ('jogo-as-fazendas-do-danelaw', 'game-the-farmsteads-of-the-danelaw', 'spill-gardene-i-danelaw')), ('grobina', 'jogo-grobina', 'viking', ('jogo-os-montes-de-grobina', 'game-the-mounds-of-grobina', 'spill-haugene-i-grobina')), ('selkiefocas', 'jogo-selkie', 'contos', ('jogo-as-focas-das-rochas', 'game-the-seals-on-the-rocks', 'spill-selene-pa-skjaerene')), ('trow', 'jogo-trow', 'contos', ('jogo-a-melodia-dos-trows', 'game-the-melody-of-the-trows', 'spill-trollenes-melodi'))]
anc=['jogo-a-porta-do-monte','game-the-door-of-the-mound','spill-porten-i-haugen']
y=open('boreal.yaml',encoding='utf-8').read()
if 'jogo_lif:' in y:
    print('yaml: ja aplicado, nada a fazer')
else:
    for li in range(3):
        ln='    jogo_hogboon: '+anc[li]+'\n'
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
    if '/g/tela.js?v=25' in x: open(p,'w',encoding='utf-8').write(x.replace('/g/tela.js?v=25','/g/tela.js?v=26')); n+=1
print('tela.js: temas =',len(T),'; paginas com v=26:',n)
