#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
THE BOREAL TIMES — gerador do site e ferramentas de redação.

    python3 publicar.py construir     gera o site em site/
    python3 publicar.py nova          cria o esqueleto de uma matéria
    python3 publicar.py imagem        prepara a foto: 1200×675 WebP
    python3 publicar.py checar        copidesque automático
    python3 publicar.py servir        http://localhost:8000

Automatiza a mecânica da publicação: conversão, capa, páginas de editoria,
feeds, SEO, verificação de padrão. Não escreve os textos.
"""

import hashlib
import json
import os
import re
import shutil
import sys
from datetime import date, datetime
from pathlib import Path
from zoneinfo import ZoneInfo

import markdown
import yaml
from jinja2 import Environment, FileSystemLoader, StrictUndefined, select_autoescape

RAIZ = Path(__file__).resolve().parent
CONFIG = RAIZ / "boreal.yaml"
CONTEUDO = RAIZ / "conteudo"
TEMA = RAIZ / "temas" / "boreal"
SAIDA = RAIZ / "site"

MESES = {
    "pt": ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho",
           "agosto", "setembro", "outubro", "novembro", "dezembro"],
    "en": ["January", "February", "March", "April", "May", "June", "July",
           "August", "September", "October", "November", "December"],
}

PROIBIDAS = [
    "imperdível", "icônico", "excepcional", "inigualável", "luxuoso",
    "deslumbrante", "exuberante", "surpreendente", "incrível", "revolucionário",
    "disruptivo", "queridinho", "must have", "must-have", "cobiçado",
    "unmissable", "iconic", "coveted", "breathtaking", "game-changing",
]

CAMPOS_OBRIGATORIOS = ["titulo", "resumo", "secao", "natureza", "autor", "data"]

# Faixa de tamanho que o copidesque considera razoável, em palavras.
PALAVRAS_MIN, PALAVRAS_MAX = 400, 1500

# Quantas matérias cada bloco de editoria mostra na capa.
POR_BLOCO = 4


# ---------------------------------------------------------------- utilidades

def data_longa(d: date, lang="pt") -> str:
    if lang == "en":
        return f"{MESES['en'][d.month - 1]} {d.day}, {d.year}"
    return f"{d.day} de {MESES['pt'][d.month - 1]} de {d.year}"


def data_curta(d: date, lang="pt") -> str:
    if lang == "en":
        return f"{d.day} {MESES['en'][d.month - 1][:3]} {d.year}"
    return f"{d.day} {MESES['pt'][d.month - 1][:3]} {d.year}"


def carregar_config() -> dict:
    with CONFIG.open(encoding="utf-8") as f:
        return yaml.safe_load(f)


_cache_md = {}


def ler_markdown(caminho: Path):
    # O mesmo arquivo é lido duas vezes por construção: uma para montar o mapa
    # de equivalências entre idiomas, outra para renderizar a página. Converter
    # markdown duas vezes por matéria dobraria o tempo de build sem necessidade.
    chave = (str(caminho), caminho.stat().st_mtime_ns)
    if chave not in _cache_md:
        bruto = caminho.read_text(encoding="utf-8")
        meta, corpo = {}, bruto
        if bruto.startswith("---"):
            _, cabeca, corpo = bruto.split("---", 2)
            meta = yaml.safe_load(cabeca) or {}
        md = markdown.Markdown(
            extensions=["tables", "attr_list", "footnotes", "smarty"])
        _cache_md[chave] = (meta, md.convert(corpo.strip()))
    meta, html = _cache_md[chave]
    return dict(meta), html


def escrever(destino: Path, texto: str):
    destino.parent.mkdir(parents=True, exist_ok=True)
    destino.write_text(texto, encoding="utf-8")


def slug_da_secao(nome: str, secoes: list) -> str:
    for s in secoes:
        if s["nome"] == nome:
            return s["slug"]
    return ""


def hoje_na_redacao(cfg) -> date:
    """A data de hoje no fuso da redação, não no da máquina que constrói.

    A Cloudflare constrói em UTC. À meia-noite e cinco de Oslo ainda são
    23h05 em UTC, e o cabeçalho sairia com a data de ontem — justamente na
    reconstrução noturna que existe para virar a data.
    """
    fuso = cfg["site"]["local"].get("fuso")
    return datetime.now(ZoneInfo(fuso)).date() if fuso else date.today()


def apelido_de(arquivo: Path) -> str:
    """O nome do arquivo sem o prefixo de data."""
    return re.sub(r"^\d{4}-\d{2}-\d{2}-", "", arquivo.stem)


def mapa_de_equivalencias(cfg):
    """Para cada peça do jornal, o endereço dela em cada idioma.

    Os apelidos mudam de idioma para idioma: /economia/ é /en/economy/ e
    /privacidade/ é /en/privacy/. Sem este mapa, o seletor de idioma e as
    etiquetas hreflang apontariam para endereços que não existem — era o que
    acontecia com as editorias mesmo antes de as páginas serem traduzidas.

    As editorias casam pela ordem em que aparecem na configuração. As páginas
    casam pela chave do bloco `paginas`. As matérias casam pelo nome do
    arquivo sem a data: 2026-11-09-starship.md em pt e 2026-11-10-starship.md
    em en são a mesma peça nos dois idiomas.
    """
    mapa = {}

    def registrar(chave, curto, url):
        mapa.setdefault(chave, {})[curto] = url

    for idioma in cfg["idiomas"]:
        curto, pref = idioma["curto"], idioma["prefixo"]
        t = cfg[curto]
        registrar("capa", curto, f"{pref}/")
        for chave, apelido in t["paginas"].items():
            registrar(f"pagina:{chave}", curto, f"{pref}/{apelido}/")
        for n, s in enumerate(t["secoes"]):
            registrar(f"secao:{n}", curto, f"{pref}/{s['slug']}/")
        for arquivo in (CONTEUDO / curto / "materias").glob("*.md"):
            meta, _ = ler_markdown(arquivo)
            d = meta.get("data")
            if isinstance(d, str):
                d = datetime.strptime(d, "%Y-%m-%d").date()
            if not d:
                continue
            registrar(f"materia:{apelido_de(arquivo)}", curto,
                      f"{pref}/{d:%Y/%m/%d}/{apelido_de(arquivo)}/")

    return mapa


def alternativas_de(mapa, chave, cfg, curto):
    """Os outros idiomas em que esta página existe, e o endereço em cada um.

    Devolve lista vazia quando a peça só existe num idioma — uma matéria sem
    tradução não deve declarar hreflang para uma página que não existe.
    """
    onde = mapa.get(chave, {})
    if curto not in onde:
        return []
    return [dict(i, url=onde[i["curto"]])
            for i in cfg["idiomas"] if i["curto"] in onde]


# ---------------------------------------------------------------- SEO

def jsonld_publicacao(cfg, idioma, t):
    s = cfg["site"]
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": s["nome"],
        "url": s["url"],
        "logo": f"{s['url']}/estatico/img/boreal-logo.png",
        "description": t["descricao"],
        "foundingDate": str(s["fundado"]),
        "publishingPrinciples": f"{s['url']}{idioma['prefixo']}/{t['paginas']['principios']}/",
        "correctionsPolicy": f"{s['url']}{idioma['prefixo']}/{t['paginas']['correcoes']}/",
        "ethicsPolicy": f"{s['url']}{idioma['prefixo']}/{t['paginas']['principios']}/",
        "parentOrganization": {"@type": "Organization", "name": s["publicacao_de"],
                               "url": s["publicacao_de_url"]},
        "address": {
            "@type": "PostalAddress",
            "addressLocality": s["local"]["cidade"],
            "addressRegion": s["local"]["regiao"],
            "addressCountry": s["local"]["pais"],
        },
        "sameAs": [v for v in s.get("redes", {}).values() if v],
    }


def jsonld_materia(cfg, idioma, pagina):
    s = cfg["site"]
    dados = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": pagina["titulo"],
        "description": pagina.get("resumo", ""),
        "datePublished": pagina["data_iso"],
        "dateModified": pagina["data_iso"],
        "inLanguage": idioma["codigo"],
        "isAccessibleForFree": True,
        # O texto é narrado por IA; o nome próprio é o do editor responsável,
        # não o de quem escreveu. Declarar Person como autor seria falso.
        "author": {"@type": "Organization", "name": s["nome"]},
        "editor": {"@type": "Person", "name": pagina.get("autor", "")},
        "genre": pagina.get("natureza", ""),
        "publisher": {
            "@type": "Organization",
            "name": s["nome"],
            "logo": {"@type": "ImageObject",
                     "url": f"{s['url']}/estatico/img/boreal-logo.png"},
        },
        "mainEntityOfPage": f"{s['url']}{pagina['url']}",
        "articleSection": pagina.get("secao", ""),
    }
    if pagina.get("imagem"):
        dados["image"] = [pagina["imagem"]]
    return dados


# ---------------------------------------------------------------- construção

def construir():
    cfg = carregar_config()
    site = cfg["site"]
    hoje = hoje_na_redacao(cfg)

    env = Environment(loader=FileSystemLoader(str(TEMA)),
                      autoescape=select_autoescape(["html"]),
                      undefined=StrictUndefined)

    if SAIDA.exists():
        shutil.rmtree(SAIDA)
    SAIDA.mkdir(parents=True)

    # A Cloudflare guarda /estatico/ por um ano (ver _headers). Sem mudar o
    # endereço do CSS, quem já visitou continua vendo o visual antigo. O hash
    # do conteúdo vai na URL: mudou o CSS, mudou o endereço, baixa de novo.
    css_v = hashlib.md5(b"".join(
        p.read_bytes() for p in sorted((TEMA / "estatico" / "css").glob("*.css"))
    )).hexdigest()[:8]

    todas_urls = []
    total_materias = 0
    mapa = mapa_de_equivalencias(cfg)

    for idioma in cfg["idiomas"]:
        curto = idioma["curto"]
        pref = idioma["prefixo"]
        t = cfg[curto]
        secoes = t["secoes"]
        pasta = CONTEUDO / curto
        raiz_saida = SAIDA / pref.lstrip("/") if pref else SAIDA
        outro = next(i for i in cfg["idiomas"] if i["curto"] != curto)

        base = {
            "site": site,
            "css_v": css_v,
            "cfg": cfg,
            "medicao": cfg["medicao"],
            "publicidade": cfg["publicidade"],
            "assinatura": cfg["assinatura"],
            "idioma": idioma,
            "outro_idioma": outro,
            "t": t,
            "ui": t["interface"],
            "secoes": secoes,
            "manifesto": t["manifesto"],
            "data_longa": data_longa(hoje, curto),
            "ano": hoje.year,
            "numero_edicao": None,
            "jsonld": json.dumps(jsonld_publicacao(cfg, idioma, t),
                                 ensure_ascii=False, indent=2),
        }

        # ---- matérias
        materias = []
        for arquivo in sorted(pasta.glob("materias/*.md"), reverse=True):
            meta, html = ler_markdown(arquivo)
            d = meta.get("data")
            if isinstance(d, str):
                d = datetime.strptime(d, "%Y-%m-%d").date()
            # O endereço é /ANO/MÊS/DIA/apelido/ — a forma que os jornais usam.
            # A data vem do campo `data`, não do nome do arquivo, para que as
            # duas nunca se desencontrem. A editoria fica fora do endereço de
            # propósito: peça reclassificada não pode quebrar o link.
            apelido = apelido_de(arquivo)
            meta.update({
                "url": f"{pref}/{d:%Y/%m/%d}/{apelido}/",
                "chave": f"materia:{apelido}",
                "secao_slug": slug_da_secao(meta.get("secao", ""), secoes),
                "data_longa": data_longa(d, curto),
                "data_curta": data_curta(d, curto),
                "data_iso": d.isoformat(),
                "leitura": meta.get("leitura", max(1, len(html.split()) // 220)),
                "imagem": meta.get("imagem", ""),
                "imagem_credito": meta.get("imagem_credito", ""),
                "imagem_alt": meta.get("imagem_alt", ""),
                "natureza": meta.get("natureza", ""),
                "fontes": meta.get("fontes") or [],
                "tags": meta.get("tags") or [],
            })
            materias.append((meta, html))

        total_materias += len(materias)
        numero = len(materias)

        for meta, html in materias:
            ctx = dict(base, pagina=meta, conteudo_html=html,
                       numero_edicao=numero,
                       alternativas=alternativas_de(mapa, meta["chave"],
                                                    cfg, curto),
                       jsonld=json.dumps(jsonld_materia(cfg, idioma, meta),
                                         ensure_ascii=False, indent=2))
            escrever(raiz_saida / meta["url"].replace(pref, "").strip("/") / "index.html",
                     env.get_template("edicao.html").render(**ctx))
            todas_urls.append(meta["url"])
            numero -= 1

        lista = [m for m, _ in materias]

        # ---- capa
        blocos = []
        for s in secoes:
            do_bloco = [m for m in lista if m.get("secao") == s["nome"]][:POR_BLOCO]
            blocos.append(dict(s, edicoes=do_bloco))

        capa_ctx = dict(base,
                        pagina={"url": f"{pref}/"},
                        numero_edicao=len(lista) if lista else None,
                        manchete=lista[0] if lista else None,
                        laterais=lista[1:4],
                        recentes=lista[4:11],
                        alternativas=alternativas_de(mapa, "capa", cfg, curto),
                        blocos=blocos)
        escrever(raiz_saida / "index.html",
                 env.get_template("capa.html").render(**capa_ctx))
        todas_urls.append(f"{pref}/")

        # ---- páginas de editoria
        for n, s in enumerate(secoes):
            da_secao = [m for m in lista if m.get("secao") == s["nome"]]
            ctx = dict(base, pagina={"url": f"{pref}/{s['slug']}/"},
                       lista={"titulo": s["nome"], "resumo": s["descricao"]},
                       alternativas=alternativas_de(mapa, f"secao:{n}",
                                                    cfg, curto),
                       edicoes=da_secao)
            escrever(raiz_saida / s["slug"] / "index.html",
                     env.get_template("lista.html").render(**ctx))
            todas_urls.append(f"{pref}/{s['slug']}/")

        # ---- arquivo
        arq = t["paginas"]["arquivo"]
        ctx = dict(base, pagina={"url": f"{pref}/{arq}/"},
                   lista={"titulo": base["ui"]["arquivo"], "resumo": t["descricao"]},
                   alternativas=alternativas_de(mapa, "pagina:arquivo",
                                                cfg, curto),
                   edicoes=lista)
        escrever(raiz_saida / arq / "index.html",
                 env.get_template("lista.html").render(**ctx))
        todas_urls.append(f"{pref}/{arq}/")

        # ---- páginas fixas
        # O nome do arquivo é o apelido no endereço. O bloco `paginas` da
        # configuração diz qual apelido corresponde a qual página em cada
        # idioma — é por ele que /privacidade/ e /en/privacy/ se reconhecem
        # como a mesma página.
        chave_da_pagina = {apelido: chave
                           for chave, apelido in t["paginas"].items()}
        for arquivo in sorted(pasta.glob("paginas/*.md")):
            meta, html = ler_markdown(arquivo)
            slug = arquivo.stem
            chave = chave_da_pagina.get(slug)
            if not chave:
                print(f"  aviso   {arquivo.name}: apelido fora do bloco "
                      f"`paginas` de {curto} — sem equivalência entre idiomas")
            meta["url"] = f"{pref}/{slug}/"
            meta.setdefault("olho", "")
            meta.setdefault("atualizado", "")
            modelo = meta.get("template", "pagina") + ".html"
            ctx = dict(base, pagina=meta, conteudo_html=html,
                       alternativas=alternativas_de(
                           mapa, f"pagina:{chave}", cfg, curto) if chave else [])
            escrever(raiz_saida / slug / "index.html",
                     env.get_template(modelo).render(**ctx))
            todas_urls.append(meta["url"])

        gerar_rss(site, t, idioma, lista, raiz_saida)

    # ---- estáticos e arquivos de raiz
    shutil.copytree(TEMA / "estatico", SAIDA / "estatico")
    if (RAIZ / "admin").exists():
        shutil.copytree(RAIZ / "admin", SAIDA / "admin")

    for extra in ("_headers", "_redirects"):
        if (RAIZ / extra).exists():
            shutil.copy(RAIZ / extra, SAIDA / extra)

    if cfg["publicidade"]["adsense"]:
        pub = cfg["publicidade"]["adsense"].replace("ca-", "")
        escrever(SAIDA / "ads.txt",
                 f"google.com, {pub}, DIRECT, f08c47fec0942fa0\n")

    gerar_sitemap(cfg, todas_urls, mapa)
    escrever(SAIDA / "robots.txt",
             f"User-agent: *\nAllow: /\nDisallow: /admin/\n"
             f"Sitemap: {site['url']}/sitemap.xml\n")
    gerar_llms(cfg)

    print(f"✓ Site gerado em {SAIDA}")
    print(f"  {total_materias} matéria(s) · {len(todas_urls)} URLs · "
          f"{len(cfg['idiomas'])} idiomas")


def gerar_rss(site, t, idioma, materias, raiz_saida):
    itens = []
    for m in materias[:30]:
        itens.append(f"""    <item>
      <title>{m['titulo']}</title>
      <link>{site['url']}{m['url']}</link>
      <guid>{site['url']}{m['url']}</guid>
      <description>{m.get('resumo','')}</description>
    </item>""")
    xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>{site['nome']}</title>
  <link>{site['url']}{idioma['prefixo']}/</link>
  <description>{t['descricao']}</description>
  <language>{idioma['codigo']}</language>
{chr(10).join(itens)}
</channel></rss>"""
    escrever(raiz_saida / "rss.xml", xml)


def gerar_sitemap(cfg, urls, mapa):
    site = cfg["site"]
    ns = ('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
          'xmlns:xhtml="http://www.w3.org/1999/xhtml"')

    # Do endereço de volta à peça que ele representa, para saber qual é o
    # equivalente no outro idioma. Trocar o prefixo /en na string não serve:
    # /economia/ não vira /en/economia/, vira /en/economy/.
    chave_do_url = {u: c for c, porIdioma in mapa.items()
                    for u in porIdioma.values()}
    principal = next(i["curto"] for i in cfg["idiomas"] if i.get("principal"))

    linhas, vistos = [], set()
    for u in urls:
        if u in vistos:
            continue
        vistos.add(u)
        onde = mapa.get(chave_do_url.get(u, ""), {})
        alt = []
        if len(onde) > 1:
            for i in cfg["idiomas"]:
                if i["curto"] in onde:
                    alt.append(
                        f'    <xhtml:link rel="alternate" '
                        f'hreflang="{i["codigo"]}" '
                        f'href="{site["url"]}{onde[i["curto"]]}"/>')
            if principal in onde:
                alt.append(f'    <xhtml:link rel="alternate" '
                           f'hreflang="x-default" '
                           f'href="{site["url"]}{onde[principal]}"/>')
        corpo = f"  <url>\n    <loc>{site['url']}{u}</loc>\n"
        if alt:
            corpo += "\n".join(alt) + "\n"
        linhas.append(corpo + "  </url>")
    escrever(SAIDA / "sitemap.xml",
             f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset {ns}>\n'
             + "\n".join(linhas) + "\n</urlset>\n")


def gerar_llms(cfg):
    s, t = cfg["site"], cfg["pt"]
    texto = f"""# {s['nome']}

> {t['descricao']}

Site editado por {s['editora']}, org.nr {s['organizacao_nr']}.
Editor responsável: {s['editor']}. Sede: {s['local']['cidade']}, Noruega.
Cobertura: {s['cobertura']}.

Elaborado por {s['publicacao_de']} ({s['publicacao_de_url']}), que edita
jornalismo em português desde {s['casa_desde']}.

## Como trabalhamos
Os textos são narrados por inteligência artificial; o editor responsável
responde pela publicação. Cada texto declara a sua natureza: história
documentada, saga ou fonte medieval, mito ou lenda, ou conto original.
Mito e lenda nunca são apresentados como fato. Ilustrações geradas por IA
vêm identificadas na legenda.

## Seções
{chr(10).join(f"- {x['nome']}: {' '.join(x['descricao'].split())}" for x in t['secoes'])}

## Uso do conteúdo
Citação de trechos curtos é permitida com atribuição a "{s['nome']}" e link
para a página original. Reprodução integral não é autorizada.

## Páginas
- {s['url']}/{t['paginas']['sobre']}/
- {s['url']}/{t['paginas']['principios']}/
- {s['url']}/{t['paginas']['quem_somos']}/
"""
    escrever(SAIDA / "llms.txt", texto)


# ---------------------------------------------------------------- copidesque

def corpo_sem_cabecalho(texto: str) -> str:
    """O texto sem o front matter. As aspas do YAML não são citação."""
    if texto.startswith("---"):
        return texto.split("---", 2)[2]
    return texto


def checar() -> int:
    cfg = carregar_config()
    validas = {}
    naturezas = {}
    for i in cfg["idiomas"]:
        c = i["curto"]
        validas[c] = {s["nome"] for s in cfg[c]["secoes"]}
        naturezas[c] = {n["nome"]: n.get("fonte_obrigatoria", True)
                        for n in cfg[c]["naturezas"]}

    erros, avisos = [], []
    for pasta in sorted(CONTEUDO.glob("*/materias")):
        idioma = pasta.parent.name
        for arquivo in sorted(pasta.glob("*.md")):
            meta, html = ler_markdown(arquivo)
            nome = f"{idioma}/{arquivo.name}"
            texto = arquivo.read_text(encoding="utf-8")
            corpo = corpo_sem_cabecalho(texto)

            for campo in CAMPOS_OBRIGATORIOS:
                if not meta.get(campo):
                    erros.append(f"{nome}: falta o campo obrigatório '{campo}'")

            if meta.get("secao") and meta["secao"] not in validas.get(idioma, set()):
                erros.append(f"{nome}: seção '{meta['secao']}' não existe")

            natureza = meta.get("natureza")
            if natureza:
                if natureza not in naturezas.get(idioma, {}):
                    erros.append(f"{nome}: natureza '{natureza}' não existe "
                                 f"({' | '.join(naturezas.get(idioma, {}))})")
                elif naturezas[idioma][natureza] and not meta.get("fontes"):
                    erros.append(f"{nome}: natureza '{natureza}' exige o campo 'fontes'")

            autor = str(meta.get("autor", "")).strip().lower()
            if autor in ("redação", "redacao", "equipe", "newsroom", "staff"):
                erros.append(f"{nome}: o campo autor leva o nome próprio do editor responsável")

            if meta.get("imagem"):
                if not meta.get("imagem_credito"):
                    erros.append(f"{nome}: imagem sem 'imagem_credito'")
                if not meta.get("imagem_alt"):
                    erros.append(f"{nome}: imagem sem 'imagem_alt' (texto alternativo)")
                credito = str(meta.get("imagem_credito", "")).lower()
                if "artificial" not in credito and "intelligence" not in credito:
                    avisos.append(f"{nome}: o crédito da imagem não diz que é ilustração "
                                  f"de IA — confira se é foto ou obra de domínio público")

            palavras = len(corpo.split())
            if palavras < PALAVRAS_MIN or palavras > PALAVRAS_MAX:
                avisos.append(f"{nome}: {palavras} palavras (faixa de {PALAVRAS_MIN} a {PALAVRAS_MAX})")

            for palavra in PROIBIDAS:
                if re.search(rf"\b{re.escape(palavra)}", corpo, re.IGNORECASE):
                    avisos.append(f"{nome}: superlativo de catálogo — '{palavra}'")

            for aspas in re.findall(r"[“\"]([^”\"]{2,})[”\"]", corpo):
                if len(aspas.split()) > 40:
                    avisos.append(f"{nome}: citação de {len(aspas.split())} palavras — parafraseie")

    if not cfg["medicao"]["verificacao_google"]:
        avisos.append("boreal.yaml: Search Console ainda não verificado")
    if not any(cfg["assinatura"]["aplicativos"].values()):
        avisos.append("boreal.yaml: endereços dos aplicativos ainda não preenchidos")

    for a in avisos:
        print(f"  aviso   {a}")
    for e in erros:
        print(f"  ERRO    {e}")
    if not erros and not avisos:
        print("✓ Nada a apontar.")
    elif not erros:
        print(f"✓ Sem erros. {len(avisos)} aviso(s) para a edição decidir.")
    else:
        print(f"✗ {len(erros)} erro(s). Publicação bloqueada até a correção.")
    return 1 if erros else 0


# ---------------------------------------------------------------- nova matéria

MODELO = """---
titulo: ""
resumo: ""
secao: "{secao}"
natureza: "{natureza}"
autor: "{autor}"
data: {data}
imagem: ""
imagem_credito: ""
imagem_alt: ""
fontes: []
tags: []
---

"""


# ---------------------------------------------------------------- imagem

# A imagem da matéria tem uma forma só: 1200×675, WebP, abaixo de 100 KB.
# Uma medida fixa evita que a capa fique irregular e que o repositório engorde.
# O Git guarda toda versão para sempre, então a foto entra já no tamanho final.
IMG_LARGURA = 1200
IMG_ALTURA = 675
IMG_PESO_ALVO = 100 * 1024
IMG_DESTINO = TEMA / "estatico" / "img" / "materias"


def preparar_imagem():
    try:
        from PIL import Image
    except ImportError:
        print("✗ Falta a biblioteca Pillow. Instale com:")
        print("    pip install pillow")
        return 1

    if len(sys.argv) < 4:
        print("Uso: python3 publicar.py imagem <arquivo> <apelido>")
        print("Ex.: python3 publicar.py imagem ~/Downloads/polotno.jpeg starship-florida")
        return 1

    origem = Path(sys.argv[2]).expanduser()
    if not origem.exists():
        print(f"✗ Não encontrei: {origem}")
        return 1

    apelido = re.sub(r"[^a-z0-9]+", "-", sys.argv[3].lower()).strip("-")
    if not apelido:
        print("✗ Apelido inválido.")
        return 1

    im = Image.open(origem).convert("RGB")
    entrada = origem.stat().st_size

    # Recorta pelo centro até 16:9 antes de redimensionar, para não deformar
    # uma foto que venha em outra proporção.
    alvo = IMG_LARGURA / IMG_ALTURA
    l, a = im.size
    if abs(l / a - alvo) > 0.01:
        if l / a > alvo:
            nova_l = round(a * alvo)
            margem = (l - nova_l) // 2
            im = im.crop((margem, 0, margem + nova_l, a))
        else:
            nova_a = round(l / alvo)
            margem = (a - nova_a) // 2
            im = im.crop((0, margem, l, margem + nova_a))
    im = im.resize((IMG_LARGURA, IMG_ALTURA), Image.LANCZOS)

    IMG_DESTINO.mkdir(parents=True, exist_ok=True)
    destino = IMG_DESTINO / f"{apelido}.webp"
    if destino.exists():
        print(f"✗ Já existe: {destino}")
        print("  Trocar uma foto não libera o espaço da anterior no Git. "
              "Use outro apelido.")
        return 1

    # Procura a maior qualidade que ainda cabe no alvo de peso. O piso de 60
    # existe para não degradar a foto além do aceitável só para bater a meta.
    melhor = None
    for q in range(90, 55, -5):
        im.save(destino, "WEBP", quality=q, method=6)
        melhor = q
        if destino.stat().st_size <= IMG_PESO_ALVO:
            break

    saida = destino.stat().st_size
    print(f"✓ {destino}")
    print(f"  {IMG_LARGURA}×{IMG_ALTURA} · qualidade {melhor} · "
          f"{entrada/1024:.0f} KB → {saida/1024:.0f} KB")
    print()
    print("No front matter da matéria:")
    print(f'  imagem: "/estatico/img/materias/{apelido}.webp"')
    return 0


def nova_materia():
    cfg = carregar_config()
    hoje = hoje_na_redacao(cfg)
    lang = input("Idioma [pt/en]: ").strip() or "pt"
    nomes = [s["nome"] for s in cfg[lang]["secoes"]]
    secao = input(f"Seção [{'/'.join(nomes)}]: ").strip() or nomes[0]
    nats = [n["nome"] for n in cfg[lang]["naturezas"]]
    natureza = input(f"Natureza [{' / '.join(nats)}]: ").strip() or nats[0]
    apelido = input("Apelido do arquivo: ").strip() or "sem-titulo"
    destino = CONTEUDO / lang / "materias" / f"{hoje.isoformat()}-{apelido}.md"
    if destino.exists():
        print(f"✗ {destino} já existe.")
        return
    destino.parent.mkdir(parents=True, exist_ok=True)
    destino.write_text(MODELO.format(secao=secao, natureza=natureza, autor=cfg["site"]["editor"],
                                     data=hoje.isoformat()), encoding="utf-8")
    print(f"✓ Criado: {destino}")


def servir():
    import http.server
    import socketserver
    os.chdir(SAIDA)
    with socketserver.TCPServer(("", 8000), http.server.SimpleHTTPRequestHandler) as s:
        print("The Boreal Times em http://localhost:8000 — Ctrl+C encerra.")
        s.serve_forever()


if __name__ == "__main__":
    comando = sys.argv[1] if len(sys.argv) > 1 else "construir"
    if comando == "construir":
        construir()
    elif comando == "checar":
        sys.exit(checar())
    elif comando == "nova":
        nova_materia()
    elif comando == "imagem":
        sys.exit(preparar_imagem())
    elif comando == "servir":
        servir()
    else:
        print(__doc__)
