import re,json,os
os.chdir(os.path.expanduser('~/Documents/theborealtimes'))
arqs=[
'conteudo/pt/materias/2027-01-17-vaettir-landvaettir-espiritos-da-terra-islandia.md',
'conteudo/en/materias/2027-01-17-vaettir-landvaettir-espiritos-da-terra-islandia.md',
'conteudo/no/materias/2027-01-17-vaettir-landvaettir-espiritos-da-terra-islandia.md',
'conteudo/pt/paginas/jogo-os-guardioes-da-ilha.md',
'conteudo/en/paginas/game-the-guardians-of-the-island.md',
'conteudo/no/paginas/spill-oyas-voktere.md',
'jogos/vaettir-quatro-guardioes.js',
'temas/boreal/estatico/img/materias/vaettir-landvaettir-espiritos-islandia.webp']
n=0
for a in arqs:
    if os.path.exists(a): os.remove(a); n+=1
print('arquivos removidos:',n)
y=open('boreal.yaml',encoding='utf-8').read()
y2=re.sub(r'^    jogo_vaettir: .*\n','',y,flags=re.M)
if y2!=y:
    open('boreal.yaml','w',encoding='utf-8').write(y2); print('yaml: chaves jogo_vaettir removidas:',y.count('jogo_vaettir:'))
else: print('yaml: nada a fazer')
t=open('jogos/tela.js',encoding='utf-8').read()
m=re.search(r'var TEMAS = (\{.*?\});',t); T=json.loads(m.group(1))
if T.pop('jogo-vaettir',None) is not None:
    t=t.replace(m.group(0),'var TEMAS = '+json.dumps(T,ensure_ascii=False,separators=(',',':'))+';')
    open('jogos/tela.js','w',encoding='utf-8').write(t); print('tela.js: tema removido; temas =',len(T))
else: print('tela.js: nada a fazer')
