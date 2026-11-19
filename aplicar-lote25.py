import re,json,os,glob
os.chdir(os.path.expanduser('~/Documents/theborealtimes'))
D=[('fjolsvinn', 'jogo-fjolsvinnsmal', 'mitos', ('jogo-os-aneis-do-portao', 'game-the-rings-of-the-gate', 'spill-portens-ringer')), ('rindr', 'jogo-rindr', 'mitos', ('jogo-o-caminho-ate-rindr', 'game-the-way-to-rindr', 'spill-veien-til-rind')), ('svarfdaela', 'jogo-svarfdaela', 'sagas', ('jogo-as-pecas-do-vale', 'game-the-pieces-of-the-valley', 'spill-brikkene-i-dalen')), ('droplaug', 'jogo-droplaug', 'sagas', ('jogo-os-irmaos-espelhados', 'game-the-mirrored-brothers', 'spill-de-speilvendte-brodrene')), ('fljotsdaela', 'jogo-fljotsdaela', 'sagas', ('jogo-as-tochas-do-vale', 'game-the-torches-of-the-valley', 'spill-fakklene-i-dalen')), ('haensa', 'jogo-haensa', 'sagas', ('jogo-os-fardos-de-feno', 'game-the-hay-bales', 'spill-hoyballene')), ('bardar', 'jogo-bardar', 'sagas', ('jogo-o-gelo-a-deriva', 'game-the-drifting-ice', 'spill-isen-som-driver')), ('hlodskvida', 'jogo-hlodskvida', 'sagas', ('jogo-a-fileira-de-guerreiros', 'game-the-line-of-warriors', 'spill-rekken-av-krigere')), ('tettenhall', 'jogo-tettenhall', 'viking', ('jogo-os-saqueadores-escondidos', 'game-the-hidden-raiders', 'spill-de-skjulte-raiderne')), ('thorkell', 'jogo-thorkell', 'viking', ('jogo-os-selos-de-prata', 'game-the-silver-seals', 'spill-solvseglene')), ('ravning', 'jogo-ravning', 'viking', ('jogo-as-trilhas-da-ponte', 'game-the-bridge-paths', 'spill-stiene-pa-broen')), ('vittra', 'jogo-vittra', 'contos', ('jogo-o-leite-da-vittra', 'game-the-vittras-milk', 'spill-vittraens-melk')), ('draumkvedet', 'jogo-draumkvedet', 'contos', ('jogo-a-ponte-do-sonho', 'game-the-dream-bridge', 'spill-drombroen'))]
anc=['jogo-a-aposta-de-gudbrand','game-gudbrands-bet','spill-gudbrands-veddemal']
y=open('boreal.yaml',encoding='utf-8').read()
if 'jogo_fjolsvinn:' in y:
    print('yaml: ja aplicado, nada a fazer')
else:
    for li in range(3):
        ln='    jogo_gudbrand: '+anc[li]+'\n'
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
    if '/g/tela.js?v=23' in x: open(p,'w',encoding='utf-8').write(x.replace('/g/tela.js?v=23','/g/tela.js?v=24')); n+=1
print('tela.js: temas =',len(T),'; paginas com v=24:',n)
