#!/usr/bin/env python3
"""Gera o site e confere os links internos."""
import os
import re
import subprocess
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
os.chdir(RAIZ)
if subprocess.run([sys.executable, "publicar.py"]).returncode:
    sys.exit("A geração falhou. Não faça commit.")
site = RAIZ / "site"
n, ruins = 0, {}
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
if ruins:
    sys.exit("Há links quebrados. Não faça commit.")
print("\nTudo certo. Pode fazer o commit.")
