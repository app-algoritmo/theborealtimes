import re,os
os.chdir(os.path.expanduser('~/Documents/theborealtimes'))
y=open('boreal.yaml',encoding='utf-8').read()
if '    menu_galeria:' in y:
    print('yaml: ja aplicado, nada a fazer')
else:
    o=['pt','en','no']
    P={'pt':('galeria','album'),'en':('gallery','album'),'no':('galleri','album')}
    M={'pt':('Galeria','Álbum'),'en':('Gallery','Album'),'no':('Galleri','Album')}
    for padrao,fn in ((r'(?m)^(    progresso: .*\n)',lambda l:'    galeria: %s\n    album: %s\n'%P[l]),(r'(?m)^(    menu_jogos: .*\n)',lambda l:'    menu_galeria: %s\n    menu_album: %s\n'%M[l])):
        partes=re.split(padrao,y)
        assert len(partes)==7,('ancora nao encontrada 3 vezes',padrao)
        y=partes[0]+''.join(partes[1+2*k]+fn(o[k])+partes[2+2*k] for k in range(3))
    open('boreal.yaml','w',encoding='utf-8').write(y)
    print('yaml: 6 chaves de pagina/menu adicionadas (o resto do arquivo nao foi tocado)')
