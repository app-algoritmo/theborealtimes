#!/usr/bin/env python3
"""Aplica a migração de endereços e confere o resultado."""
import os
import re
import subprocess
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
os.chdir(RAIZ)


def passo(cmd):
    r = subprocess.run(cmd, text=True)
    if r.returncode:
        sys.exit(f"Falhou: {' '.join(cmd)}")


passo([sys.executable, "migracao/migrar.py"])
passo([sys.executable, "publicar.py"])

site = RAIZ / "site"
quebrados, n = {}, 0
for p in site.rglob("*.html"):
    t = p.read_text(encoding="utf-8", errors="ignore")
    for h in re.findall(r'(?:href|src)="(/[^"#?]*)', t):
        if h.startswith("//"):
            continue
        q = site / h.lstrip("/")
        n += 1
        if not (q.is_file() or (q / "index.html").is_file()):
            quebrados.setdefault(h, str(p.relative_to(site)))
print(f"\nLinks internos conferidos: {n}. Quebrados: {len(quebrados)}")
for h, onde in list(quebrados.items())[:15]:
    print("  ", h, "<-", onde)
datados = [p for p in site.rglob("*.html")
           if re.search(r'href="/(?:en/|no/)?20\d\d/\d\d/\d\d/', p.read_text(encoding="utf-8", errors="ignore"))]
print(f"Páginas ainda com link datado: {len(datados)}")
if quebrados or datados:
    sys.exit("Há problemas acima. Não faça commit.")
print("\nTudo certo. Pode fazer o commit.")
