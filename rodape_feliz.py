#!/usr/bin/env python3
"""Rodapé em degradê amarelo-laranja-vermelho, com o lema nos três idiomas e a linha de edição.
Edita só o que precisa (boreal.yaml, base.html, boreal.css). Pode rodar de novo."""
import re, sys, pathlib

raiz = pathlib.Path(__file__).resolve().parent
yaml_p = raiz / "boreal.yaml"
base_p = raiz / "temas/boreal/base.html"
css_p = raiz / "temas/boreal/estatico/css/boreal.css"
for p in (yaml_p, base_p, css_p):
    if not p.exists():
        sys.exit(f"Não achei {p}. Rode de dentro da pasta do projeto.")

# 1) Lema do rodapé, em PT, EN e NO (na ordem em que aparecem no yaml)
lemas = [
    "Histórias da Escandinávia e do mundo nórdico, em português, inglês e norueguês.",
    "Stories of Scandinavia and the Nordic world, in English, Portuguese and Norwegian.",
    "Historier fra Skandinavia og Norden, på norsk, portugisisk og engelsk.",
]
y = yaml_p.read_text(encoding="utf-8")
padrao = re.compile(r"(    sobre: >-\n)(.*?)(    secoes:)", re.S)
achados = padrao.findall(y)
if len(achados) != 3:
    sys.exit(f"Esperava 3 blocos 'sobre:' no yaml e achei {len(achados)}. Nada foi alterado.")
it = iter(lemas)
y = padrao.sub(lambda m: m.group(1) + "      " + next(it) + "\n" + m.group(3), y)
yaml_p.write_text(y, encoding="utf-8")

# 2) Linha "by The Boreal Times · Duna Press Edições" no rodapé
b = base_p.read_text(encoding="utf-8")
velho = "<p>{{ t.rodape.sobre }}</p>"
novo = velho + '\n      <p class="rodape-edicao">{{ ui.linha_edicao }}</p>'
if "rodape-edicao" not in b:
    if b.count(velho) != 1:
        sys.exit("Não achei o parágrafo 'sobre' do rodapé em base.html. Nada mais foi alterado.")
    base_p.write_text(b.replace(velho, novo), encoding="utf-8")

# 3) Cor
marca = "/* ── Rodapé em degradê sol ── */"
css = css_p.read_text(encoding="utf-8")
if marca not in css:
    css += f"""

{marca}
.rodape{{background:#FF9F1C linear-gradient(120deg,#FFD23F 0%,#FF9F1C 50%,#F4623A 100%);
  color:#1F1040;border-top:3px solid #4B2A7B}}
.rodape h3,.rodape-marca{{color:#1F1040}}
.rodape ul,.rodape p{{color:#2B1850}}
.rodape li a:hover,.rodape-fim a:hover{{color:#1F1040;text-decoration:underline}}
.rodape-fim{{border-top-color:rgba(31,16,64,.3);color:#2B1850}}
.rodape-fim a{{color:#2B1850}}
.rodape-ds a{{color:#1F1040;font-weight:700}}
.rodape .rodape-edicao{{margin-top:12px;max-width:none;font-family:var(--util);
  font-size:12px;letter-spacing:.06em;color:#2B1850}}
"""
    css_p.write_text(css, encoding="utf-8")

print("Pronto: rodapé atualizado (yaml, base.html e css).")
