import re,json,os,glob
os.chdir(os.path.expanduser('~/Documents/theborealtimes'))
D=[('hodr', 'jogo-hodr', 'mitos', ('jogo-quem-mente', 'game-who-is-lying', 'spill-hvem-lyver')), ('naglfar', 'jogo-naglfar', 'mitos', ('jogo-as-cordas-de-naglfar', 'game-the-ropes-of-naglfar', 'spill-naglfars-tau')), ('magni', 'jogo-magni', 'mitos', ('jogo-o-giro-de-magni', 'game-magnis-turn', 'spill-magnis-dreining')), ('hardar', 'jogo-hardar', 'sagas', ('jogo-os-vigias-das-ilhotas', 'game-the-lookouts-of-the-islets', 'spill-vaktene-pa-holmene')), ('hallfred', 'jogo-hallfred', 'sagas', ('jogo-as-pontes-de-hallfredr', 'game-hallfredrs-bridges', 'spill-hallfreds-broer')), ('knytlinga', 'jogo-knytlinga', 'sagas', ('jogo-o-mapa-dos-reinos', 'game-the-map-of-the-realms', 'spill-kartet-over-rikene')), ('vigaglums', 'jogo-vigaglums', 'sagas', ('jogo-os-lotes-do-campo', 'game-the-plots-of-the-field', 'spill-teigene-pa-jordet')), ('kensington', 'jogo-kensington', 'viking', ('jogo-as-runas-apagadas', 'game-the-erased-runes', 'spill-de-utslettede-runene')), ('emma', 'jogo-emma', 'viking', ('jogo-as-estradas-da-rainha', 'game-the-queens-roads', 'spill-dronningens-veier')), ('fulford', 'jogo-fulford', 'viking', ('jogo-a-linha-de-bandeiras', 'game-the-line-of-banners', 'spill-rekken-av-bannere')), ('holger', 'jogo-holger', 'contos', ('jogo-a-forma-que-sumiu', 'game-the-shape-that-vanished', 'spill-figuren-som-forsvant')), ('kalevipoeg', 'jogo-kalevipoeg', 'contos', ('jogo-as-pedras-de-kalevipoeg', 'game-kalevipoegs-stones', 'spill-kalevipoegs-steiner')), ('assipattle', 'jogo-assipattle', 'contos', ('jogo-as-brasas-de-assipattle', 'game-assipattles-embers', 'spill-assipattles-glor')), ('gudbrand', 'jogo-gudbrand', 'contos', ('jogo-a-aposta-de-gudbrand', 'game-gudbrands-bet', 'spill-gudbrands-veddemal'))]
anc=['jogo-os-trapos-de-tatterhood','game-tatterhoods-rags','spill-lurvehettes-filler']
y=open('boreal.yaml',encoding='utf-8').read()
if 'jogo_hodr:' in y:
    print('yaml: ja aplicado, nada a fazer')
else:
    for li in range(3):
        ln='    jogo_tatterhood: '+anc[li]+'\n'
        assert y.count(ln)==1,('ancora nao encontrada no yaml',ln)
        y=y.replace(ln,ln+''.join('    jogo_%s: %s\n'%(k,s[li]) for k,cv,cor,s in D))
    open('boreal.yaml','w',encoding='utf-8').write(y)
    print('yaml: 42 chaves novas adicionadas (o resto do arquivo nao foi tocado)')
t=open('jogos/tela.js',encoding='utf-8').read()
m=re.search(r'var TEMAS = (\{.*?\});',t); T=json.loads(m.group(1))
for k,cv,cor,s in D: T[cv]=cor
T=dict(sorted(T.items()))
t=t.replace(m.group(0),'var TEMAS = '+json.dumps(T,ensure_ascii=False,separators=(',',':'))+';')
open('jogos/tela.js','w',encoding='utf-8').write(t)
n=0
for p in glob.glob('conteudo/*/paginas/*.md'):
    x=open(p,encoding='utf-8').read()
    if '/g/tela.js?v=22' in x: open(p,'w',encoding='utf-8').write(x.replace('/g/tela.js?v=22','/g/tela.js?v=23')); n+=1
print('tela.js: temas =',len(T),'; paginas com v=23:',n)
