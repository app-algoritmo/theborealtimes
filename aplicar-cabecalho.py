import os
os.chdir(os.path.expanduser('~/Documents/theborealtimes'))
def troca(arq, pares):
    t = open(arq, encoding='utf-8').read(); feito = 0
    for velho, novo in pares:
        if novo in t: continue
        assert t.count(velho) == 1, (arq, 'trecho nao encontrado', velho[:50])
        t = t.replace(velho, novo); feito += 1
    open(arq, 'w', encoding='utf-8').write(t)
    print(arq + ':', feito, 'ajuste(s) aplicado(s)' if feito else 'ja aplicado, nada a fazer')
troca('temas/boreal/base.html', [
 ('<span><b>{{ ano }}</b> &nbsp;·&nbsp; {{ ano_romano }}</span>', '<span><b>{{ ano_romano }}</b></span>'),
 ('<span class="idioma-atual" aria-current="true" lang="{{ i.codigo }}">{{ i.rotulo }}</span>', '<span class="idioma-atual" aria-current="true" lang="{{ i.codigo }}" title="{{ i.rotulo }}">{{ i.curto|upper }}</span>'),
 ('<a href="{{ i.url }}" hreflang="{{ i.codigo }}" lang="{{ i.codigo }}">{{ i.rotulo }}</a>', '<a href="{{ i.url }}" hreflang="{{ i.codigo }}" lang="{{ i.codigo }}" title="{{ i.rotulo }}" aria-label="{{ i.rotulo }}">{{ i.curto|upper }}</a>'),
])
troca('temas/boreal/estatico/css/boreal.css', [
 ('position:sticky;top:0;background:var(--papel);z-index:40}', 'position:sticky;top:0;background:#000;z-index:40}'),
 ('padding:11px 15px;color:var(--tinta);position:relative;\n}', 'padding:11px 15px;color:#f2f2ee;position:relative;\n}'),
 ('width:1px;background:var(--fio)}', 'width:1px;background:rgba(255,255,255,.22)}'),
 ('.nav a:hover{color:var(--marca)}', '.nav a:hover{color:#fff}'),
 ('.nav a:hover{color:var(--nc)}', '.nav a:hover{color:#fff;background:rgba(255,255,255,.12)}'),
])
