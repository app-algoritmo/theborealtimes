#!/usr/bin/env python3
"""Migração de endereços: sem datas, inglês na raiz, português em /pt/.

Reescreve os links fixos em boreal.yaml e em conteudo/**/*.md (do endereço
antigo para o novo, no mesmo idioma) e gera o _redirects com os endereços
antigos. Roda uma vez, na raiz do repositório:  python3 migracao/migrar.py
"""
import json
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ))
import publicar  # noqa: E402

MARCA = RAIZ / "migracao" / ".feito"


def main():
    if MARCA.exists():
        sys.exit("A migração já foi aplicada neste repositório.")
    antigo = json.loads((RAIZ / "migracao" / "mapa-antigo.json").read_text(encoding="utf-8"))
    cfg = publicar.carregar_config()
    novo = publicar.mapa_de_equivalencias(cfg)

    old2new = {}   # (endereço antigo) -> endereço novo, no mesmo idioma
    for chave, por_idioma in antigo.items():
        for lang, u_antigo in por_idioma.items():
            u_novo = novo.get(chave, {}).get(lang)
            if u_novo:
                old2new[u_antigo] = u_novo

    sem_par = set()

    def trocar(u):
        m = re.match(r"^([^?#]*)(.*)$", u, re.S)
        caminho, resto = m.group(1), m.group(2)
        n = old2new.get(caminho)
        if n is None:
            n = old2new.get(caminho.rstrip("/") + "/")
        if n is None:
            if re.match(r"^/(?:(?:en|no)/)?(?:\d{4}/\d\d/\d\d/)", caminho):
                sem_par.add(u)
            return u
        return n + resto

    padroes = [
        re.compile(r'(\]\()(/[^)\s]*)(\))'),
        re.compile(r'(href=")(/[^"]*)(")'),
    ]
    yaml_pad = re.compile(r'(\b\w*url:\s*"?)(/[^"\s},]*)')

    mudou = 0
    for arq in sorted((RAIZ / "conteudo").rglob("*.md")):
        t = arq.read_text(encoding="utf-8")
        s = t
        s = yaml_pad.sub(lambda m: m.group(1) + trocar(m.group(2)), s) if arq.parent.name == "paginas" else s
        for p in padroes:
            s = p.sub(lambda m: m.group(1) + trocar(m.group(2)) + m.group(3), s)
        if s != t:
            arq.write_text(s, encoding="utf-8")
            mudou += 1
    y = RAIZ / "boreal.yaml"
    t = y.read_text(encoding="utf-8")
    s = yaml_pad.sub(lambda m: m.group(1) + trocar(m.group(2)), t)
    if s != t:
        y.write_text(s, encoding="utf-8")
    print(f"{mudou} arquivo(s) de conteúdo com links trocados; boreal.yaml atualizado.")
    if sem_par:
        print("Links com data sem equivalente (conferir):")
        for u in sorted(sem_par):
            print("  ", u)

    # ---------------- _redirects
    todos_novos = {u for por in novo.values() for u in por.values()}
    estaticos, colisoes = [], []
    for chave, por_idioma in antigo.items():
        for lang, u_antigo in por_idioma.items():
            u_novo = novo.get(chave, {}).get(lang)
            if not u_novo or u_novo == u_antigo:
                continue
            if lang == "en" and not chave.startswith("materia:") and u_antigo == "/en" + u_novo:
                continue  # coberto pela regra /en/*
            if u_antigo in todos_novos:
                colisoes.append((u_antigo, u_novo))   # o endereço antigo virou outra página
                continue
            estaticos.append((u_antigo, u_novo))
    estaticos.sort()
    ant = (RAIZ / "_redirects").read_text(encoding="utf-8")
    topo = []
    for linha in ant.splitlines():
        if linha.startswith("https://") or linha.startswith("# Domínio"):
            topo.append(linha)
    corpo = [
        "",
        "# Atalhos",
        "/assine        /pt/assinatura/   301",
        "/circulo       /pt/assinatura/   301",
        "",
        "# Endereços antigos: o inglês passou para a raiz e o português para /pt/.",
        "/en/*          /:splat           301",
        "",
        "# Endereços antigos de matérias (com data) e de páginas em português.",
    ] + [f"{a}  {b}  301" for a, b in estaticos] + [
        "",
        "# Nada de redirecionamento por país: o idioma é escolha do leitor.",
        "",
    ]
    (RAIZ / "_redirects").write_text("\n".join(topo + corpo), encoding="utf-8")
    print(f"_redirects: {len(estaticos)} regras fixas + 1 dinâmica; "
          f"{len(colisoes)} endereço(s) antigo(s) em português viraram páginas em inglês:")
    for a, b in colisoes:
        print("  ", a, "(pt antigo) agora é página nova; o português está em", b)
    MARCA.write_text("ok\n")


if __name__ == "__main__":
    main()
