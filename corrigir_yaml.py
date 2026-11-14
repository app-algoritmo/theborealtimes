#!/usr/bin/env python3
"""Restaura o boreal.yaml do Lote 12 e reaplica só as mudanças de redes e cabeçalho.
Uso (dentro do repositório): python3 corrigir_yaml.py"""
import subprocess, sys
BASE = sys.argv[1] if len(sys.argv) > 1 else "19200c1"
y = subprocess.run(["git", "show", f"{BASE}:boreal.yaml"], capture_output=True, text=True, encoding="utf-8", check=True).stdout

def troca(texto, velho, novo):
    if texto.count(velho) != 1:
        sys.exit(f"ERRO: trecho esperado não encontrado exatamente uma vez:\n{velho}")
    return texto.replace(velho, novo)

y = troca(y, """  redes:
    facebook: https://www.facebook.com/borealtimes
    instagram: https://www.instagram.com/borealtimes
    threads: https://www.threads.com/@borealtimes
    youtube: https://www.youtube.com/@borealtimes
    twitter: https://x.com/borealtimes
""", """  redes:
    # Só entram no rodapé as contas que existem (campo vazio é ignorado).
    facebook: https://www.facebook.com/borealsagaplay/
    instagram: https://www.instagram.com/borealsagaplay/
    threads: ""
    youtube: ""
    twitter: ""
""")
y = troca(y, "  publicacao_de: Duna Press\n", "  publicacao_de: Duna Press\n  # Nome que aparece no cabeçalho (o nome oficial do site continua sendo \"nome\").\n  marca: Boreal Saga Play\n")
y = troca(y, "linha_edicao: Edições Duna Press", "linha_edicao: by The Boreal Times · Duna Press Edições")
y = troca(y, "linha_edicao: Duna Press Editions", "linha_edicao: by The Boreal Times · Duna Press Editions")
y = troca(y, "linha_edicao: Duna Press-utgaver", "linha_edicao: by The Boreal Times · Duna Press-utgaver")
open("boreal.yaml", "w", encoding="utf-8").write(y)
print("✓ boreal.yaml restaurado do commit", BASE, "e redes/cabeçalho reaplicados.")
