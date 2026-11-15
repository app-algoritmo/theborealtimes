#!/usr/bin/env python3
"""Troca o nome do site para Boreal Saga Play e o domínio para borealsagaplay.com.
Mexe só nas linhas necessárias (não substitui arquivos inteiros).
Uso, dentro do repositório:  python3 trocar_dominio.py"""
import pathlib, re, sys

RAIZ = pathlib.Path(".")
NOME, DOMINIO = "Boreal Saga Play", "borealsagaplay.com"

def ler(p): return pathlib.Path(p).read_text(encoding="utf-8")
def gravar(p, t): pathlib.Path(p).write_text(t, encoding="utf-8")

def troca_exata(arq, velho, novo):
    t = ler(arq)
    if t.count(velho) != 1:
        sys.exit(f"ERRO em {arq}: trecho esperado não encontrado exatamente uma vez:\n{velho}")
    gravar(arq, t.replace(velho, novo))
    print(f"✓ {arq}")

# 1. boreal.yaml — só nome e url do site
troca_exata("boreal.yaml",
    "  nome: The Boreal Times\n  url: https://borealtimes.org\n",
    f"  nome: {NOME}\n  url: https://{DOMINIO}\n")

# 2. _redirects — domínio canônico e domínio antigo
troca_exata("_redirects",
    "# Domínio canônico\nhttps://www.borealtimes.org/*  https://borealtimes.org/:splat  301\n",
    "# Domínio canônico: borealsagaplay.com. O domínio antigo (borealtimes.org) redireciona para ele.\n"
    f"https://www.{DOMINIO}/*  https://{DOMINIO}/:splat  301\n"
    f"https://borealtimes.org/*  https://{DOMINIO}/:splat  301\n"
    f"https://www.borealtimes.org/*  https://{DOMINIO}/:splat  301\n")

# 3. painel de edição
troca_exata("admin/config.yml", "site_domain: borealtimes.org", f"site_domain: {DOMINIO}")

# 4. cartão de compartilhar de "Meu progresso"
p = "jogos/progresso.js"; t = ler(p); n0 = t.count("borealtimes.org")
t = t.replace("no The Boreal Times:", f"no {NOME}:").replace("on The Boreal Times:", f"on {NOME}:").replace("på The Boreal Times:", f"på {NOME}:")
t = t.replace("site: 'borealtimes.org'", f"site: '{DOMINIO}'")
gravar(p, t); print(f"✓ {p} ({n0} endereço(s) trocado(s))")

# 5. textos das páginas e matérias: nome do site (o e-mail post@borealtimes.org não muda)
total = 0
for arq in sorted(RAIZ.glob("conteudo/*/paginas/*.md")) + sorted(RAIZ.glob("conteudo/*/materias/*.md")):
    t = ler(arq); novo = t
    novo = novo.replace("O The Boreal Times", f"O {NOME}")
    novo = novo.replace("The Boreal Times", NOME).replace("Boreal Times", NOME)
    if novo != t:
        gravar(arq, novo); total += 1
print(f"✓ {total} arquivo(s) de conteúdo com o nome atualizado")
print("Pronto. Agora: python3 publicar.py construir")
