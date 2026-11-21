#!/usr/bin/env python3
"""Instala a estrutura do espanhol (/es/), pronta mas desligada (ativo: false)."""
import os
import subprocess
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
os.chdir(RAIZ)
y = RAIZ / "boreal.yaml"
t = y.read_text(encoding="utf-8")
if "\nes:\n" in t:
    print("boreal.yaml: espanhol já está lá")
else:
    ancora = "    rotulo: English\n    principal: true\n    slug_do_titulo: true"
    if t.count(ancora) != 1:
        sys.exit("Não achei o bloco do inglês em idiomas. Nada foi alterado.")
    t = t.replace(ancora, ancora + """
  - codigo: es-ES
    curto: es
    prefixo: /es
    rotulo: Español
    principal: false
    slug_do_titulo: true
    ativo: false   # pronto, mas fora do site até haver conteúdo; trocar por true para publicar""")
    bloco = (RAIZ / "migracao" / "es-bloco.yaml").read_text(encoding="utf-8")
    y.write_text(t.rstrip("\n") + "\n\n" + bloco, encoding="utf-8")
    print("boreal.yaml: espanhol acrescentado (desligado)")
r = subprocess.run([sys.executable, "publicar.py"])
if r.returncode:
    sys.exit("A geração falhou. Não faça commit.")
site = RAIZ / "site"
import re
n = 0
ruins = {}
for p in site.rglob("*.html"):
    for h in re.findall(r'(?:href|src)="(/[^"#?]*)', p.read_text(encoding="utf-8", errors="ignore")):
        if h.startswith("//"):
            continue
        q = site / h.lstrip("/")
        n += 1
        if not (q.is_file() or (q / "index.html").is_file()):
            ruins.setdefault(h, str(p.relative_to(site)))
print(f"Links internos conferidos: {n}. Quebrados: {len(ruins)}")
for h, o in list(ruins.items())[:10]:
    print("  ", h, "<-", o)
if (site / "es").exists():
    sys.exit("O espanhol apareceu no site, mas devia estar desligado. Não faça commit.")
if ruins:
    sys.exit("Há links quebrados. Não faça commit.")
print("\nTudo certo. O espanhol está pronto e desligado. Pode fazer o commit.")
