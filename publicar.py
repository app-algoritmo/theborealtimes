#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
BOREAL TIMES — gerador do site e ferramentas de redação.

    python3 publicar.py construir     gera o site em site/
    python3 publicar.py nova          cria o esqueleto de uma matéria
    python3 publicar.py imagem        prepara a foto: 1200×675 WebP
    python3 publicar.py checar        copidesque automático
    python3 publicar.py servir        http://localhost:8000

Automatiza a mecânica da publicação: conversão, capa, páginas de editoria,
feeds, SEO, verificação de padrão. Não escreve reportagem.
"""

import json
import os
import re
import shutil
import sys
from datetime import date, datetime
from pathlib import Path

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

CAMPOS_OBRIGATORIOS = ["titulo", "resumo", "secao", "autor", "data"]

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


def ler_markdown(caminho: Path):
    bruto = caminho.read_text(encoding="utf-8")
    meta, corpo = {}, bruto
    if bruto.startswith("---"):
        _, cabeca, corpo = bruto.split("---", 2)
        meta = yaml.safe_load(cabeca) or {}
    md = markdown.Markdown(extensions=["tables", "attr_list", "footnotes", "smarty"])
    return meta, md.convert(corpo.strip())


def escrever(destino: Path, texto: str):
    destino.parent.mkdir(parents=True, exist_ok=True)
    destino.write_text(texto, encoding="utf-8")


def slug_da_secao(nome: str, secoes: list) -> str:
    for s in secoes:
        if s["nome"] == nome:
            return s["slug"]
    return ""


# ---------------------------------------------------------------- SEO

def jsonld_publicacao(cfg, idioma, t):
    s = cfg["site"]
    return {
        "@context": "https://schema.org",
        "@type": "NewsMediaOrganization",
        "name": s["nome"],
        "url": s["url"],
        "logo": f"{s['url']}/estatico/img/boreal-logo.png",
        "description": t["descricao"],
        "foundingDate": str(s["fundado"]),
        "publishingPrinciples": f"{s['url']}{idioma['prefixo']}/principios/",
        "correctionsPolicy": f"{s['url']}{idioma['prefixo']}/correcoes/",
        "ethicsPolicy": f"{s['url']}{idioma['prefixo']}/principios/",
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
        "@type": "NewsArticle",
        "headline": pagina["titulo"],
        "description": pagina.get("resumo", ""),
        "datePublished": pagina["data_iso"],
        "dateModified": pagina["data_iso"],
        "inLanguage": idioma["codigo"],
        "isAccessibleForFree": True,
        "author": {"@type": "Person", "name": pagina.get("autor", "")},
        "publisher": {
            "@type": "NewsMediaOrganization",
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
    hoje = date.today()

    env = Environment(loader=FileSystemLoader(str(TEMA)),
                      autoescape=select_autoescape(["html"]),
                      undefined=StrictUndefined)

    if SAIDA.exists():
        shutil.rmtree(SAIDA)
    SAIDA.mkdir(parents=True)

    todas_urls = []
    total_materias = 0

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
            slug = arquivo.stem
            meta.update({
                "url": f"{pref}/{slug}/",
                "secao_slug": slug_da_secao(meta.get("secao", ""), secoes),
                "data_longa": data_longa(d, curto),
                "data_curta": data_curta(d, curto),
                "data_iso": d.isoformat(),
                "leitura": meta.get("leitura", max(1, len(html.split()) // 220)),
                "imagem": meta.get("imagem", ""),
                "imagem_credito": meta.get("imagem_credito", ""),
                "tags": meta.get("tags") or [],
                "informacao": meta.get("informacao", ""),
            })
            materias.append((meta, html))

        total_materias += len(materias)
        numero = len(materias)

        for meta, html in materias:
            ctx = dict(base, pagina=meta, conteudo_html=html,
                       numero_edicao=numero,
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
                        blocos=blocos)
        escrever(raiz_saida / "index.html",
                 env.get_template("capa.html").render(**capa_ctx))
        todas_urls.append(f"{pref}/")

        # ---- páginas de editoria
        for s in secoes:
            da_secao = [m for m in lista if m.get("secao") == s["nome"]]
            ctx = dict(base, pagina={"url": f"{pref}/{s['slug']}/"},
                       lista={"titulo": s["nome"], "resumo": s["descricao"]},
                       edicoes=da_secao)
            escrever(raiz_saida / s["slug"] / "index.html",
                     env.get_template("lista.html").render(**ctx))
            todas_urls.append(f"{pref}/{s['slug']}/")

        # ---- arquivo
        ctx = dict(base, pagina={"url": f"{pref}/arquivo/"},
                   lista={"titulo": base["ui"]["arquivo"], "resumo": t["descricao"]},
                   edicoes=lista)
        escrever(raiz_saida / "arquivo" / "index.html",
                 env.get_template("lista.html").render(**ctx))
        todas_urls.append(f"{pref}/arquivo/")

        # ---- páginas fixas
        for arquivo in sorted(pasta.glob("paginas/*.md")):
            meta, html = ler_markdown(arquivo)
            slug = arquivo.stem
            meta["url"] = f"{pref}/{slug}/"
            meta.setdefault("olho", "")
            meta.setdefault("atualizado", "")
            modelo = meta.get("template", "pagina") + ".html"
            ctx = dict(base, pagina=meta, conteudo_html=html)
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

    gerar_sitemap(cfg, todas_urls)
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


def gerar_sitemap(cfg, urls):
    site = cfg["site"]
    ns = ('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
          'xmlns:xhtml="http://www.w3.org/1999/xhtml"')
    linhas, vistos = [], set()
    for u in urls:
        if u in vistos:
            continue
        vistos.add(u)
        base_u = u[3:] if u.startswith("/en") else u
        alt = []
        for i in cfg["idiomas"]:
            alvo = f"{i['prefixo']}{base_u}"
            if alvo in urls:
                alt.append(f'    <xhtml:link rel="alternate" hreflang="{i["codigo"]}" '
                           f'href="{site["url"]}{alvo}"/>')
        alt.append(f'    <xhtml:link rel="alternate" hreflang="x-default" '
                   f'href="{site["url"]}{base_u}"/>')
        linhas.append(f"  <url>\n    <loc>{site['url']}{u}</loc>\n"
                      + "\n".join(alt) + "\n  </url>")
    escrever(SAIDA / "sitemap.xml",
             f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset {ns}>\n'
             + "\n".join(linhas) + "\n</urlset>\n")


def gerar_llms(cfg):
    s, t = cfg["site"], cfg["pt"]
    texto = f"""# {s['nome']}

> {t['descricao']}

Jornal digital editado por {s['editora']}, org.nr {s['organizacao_nr']}.
Editor responsável: {s['editor']}. Sede: {s['local']['cidade']}, Noruega.
Cobertura: {s['cobertura']}, Rússia incluída.

Uma publicação da {s['publicacao_de']} ({s['publicacao_de_url']}), que edita
jornalismo em português desde {s['casa_desde']}. As duas publicações não
compartilham conteúdo: o que sai aqui não sai lá.

## Como trabalhamos
Afirmação de fato exige registro público, documento visto pela redação ou
duas fontes independentes com conhecimento direto do assunto. Comunicação
oficial é sempre atribuída a quem a emitiu, nunca apresentada como fato
apurado. Cada matéria traz autor identificado.

## Editorias
{chr(10).join(f"- {x['nome']}: {' '.join(x['descricao'].split())}" for x in t['secoes'])}

## Uso do conteúdo
Citação de trechos curtos é permitida com atribuição a "{s['nome']}" e link
para a página original. Reprodução integral não é autorizada.

## Páginas
- {s['url']}/sobre/
- {s['url']}/principios/
- {s['url']}/quem-somos/
"""
    escrever(SAIDA / "llms.txt", texto)


# ---------------------------------------------------------------- copidesque

def checar() -> int:
    cfg = carregar_config()
    validas = set()
    for i in cfg["idiomas"]:
        validas.update(s["nome"] for s in cfg[i["curto"]]["secoes"])

    erros, avisos = [], []
    for pasta in sorted(CONTEUDO.glob("*/materias")):
        for arquivo in sorted(pasta.glob("*.md")):
            meta, html = ler_markdown(arquivo)
            nome = f"{pasta.parent.name}/{arquivo.name}"
            texto = arquivo.read_text(encoding="utf-8")

            for campo in CAMPOS_OBRIGATORIOS:
                if not meta.get(campo):
                    erros.append(f"{nome}: falta o campo obrigatório '{campo}'")

            if meta.get("secao") and meta["secao"] not in validas:
                erros.append(f"{nome}: editoria '{meta['secao']}' não existe")

            autor = str(meta.get("autor", "")).strip().lower()
            if autor in ("redação", "redacao", "equipe", "newsroom", "staff"):
                erros.append(f"{nome}: assinatura coletiva não é aceita — use nome próprio")

            if re.search(r"(R\$|US\$|€|NOK)\s?[\d.,]+", texto) and not meta.get("informacao"):
                avisos.append(f"{nome}: cita valores sem dizer de onde veio a informação")

            for palavra in PROIBIDAS:
                if re.search(rf"\b{re.escape(palavra)}", texto, re.IGNORECASE):
                    avisos.append(f"{nome}: superlativo de catálogo — '{palavra}'")

            for aspas in re.findall(r"[“\"]([^”\"]{2,})[”\"]", texto):
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
autor: "{autor}"
data: {data}
imagem: ""
imagem_credito: ""
informacao: ""
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
    hoje = date.today()
    lang = input("Idioma [pt/en]: ").strip() or "pt"
    nomes = [s["nome"] for s in cfg[lang]["secoes"]]
    secao = input(f"Editoria [{'/'.join(nomes)}]: ").strip() or nomes[0]
    apelido = input("Apelido do arquivo: ").strip() or "sem-titulo"
    destino = CONTEUDO / lang / "materias" / f"{hoje.isoformat()}-{apelido}.md"
    if destino.exists():
        print(f"✗ {destino} já existe.")
        return
    destino.parent.mkdir(parents=True, exist_ok=True)
    destino.write_text(MODELO.format(secao=secao, autor=cfg["site"]["editor"],
                                     data=hoje.isoformat()), encoding="utf-8")
    print(f"✓ Criado: {destino}")


def servir():
    import http.server
    import socketserver
    os.chdir(SAIDA)
    with socketserver.TCPServer(("", 8000), http.server.SimpleHTTPRequestHandler) as s:
        print("Boreal Times em http://localhost:8000 — Ctrl+C encerra.")
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
