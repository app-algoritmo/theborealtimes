#!/usr/bin/env python3
"""Gera o mapa de profundidade (VR) das ilustrações que ainda não têm.

Uso (dentro da pasta do repositório, depois do `imagem-lote`):
    pip3 install onnxruntime numpy pillow      # uma vez
    python3 ar/gerar_prof.py

Saída: jogos/vr/prof/<apelido>.jpg (320x180). Na primeira vez baixa o modelo
MiDaS small (cerca de 67 MB) do GitHub para ~/.cache/boreal-prof/."""
import sys, urllib.request
from pathlib import Path
import numpy as np
import onnxruntime as ort
from PIL import Image, ImageFilter

RAIZ = Path(__file__).resolve().parent.parent
IMG = RAIZ / "temas" / "boreal" / "estatico" / "img" / "materias"
SAIDA = RAIZ / "jogos" / "vr" / "prof"
MODELO = Path.home() / ".cache" / "boreal-prof" / "model-small.onnx"
URL = "https://github.com/isl-org/MiDaS/releases/download/v2_1/model-small.onnx"

def modelo():
    if not MODELO.exists():
        MODELO.parent.mkdir(parents=True, exist_ok=True)
        print("Baixando o modelo de profundidade (67 MB)...")
        urllib.request.urlretrieve(URL, MODELO)
    return ort.InferenceSession(str(MODELO))

def profundidade(sess, arq, saida):
    im = Image.open(arq).convert("RGB")
    x = np.asarray(im.resize((256, 256), Image.BICUBIC), dtype=np.float32) / 255.0
    x = (x - np.array([0.485, 0.456, 0.406], np.float32)) / np.array([0.229, 0.224, 0.225], np.float32)
    y = sess.run(None, {"0": x.transpose(2, 0, 1)[None]})[0][0]
    lo, hi = np.percentile(y, 2), np.percentile(y, 98)
    y = np.clip((y - lo) / max(hi - lo, 1e-6), 0, 1)
    d = Image.fromarray((y * 255).astype(np.uint8)).resize((320, 180), Image.BICUBIC).filter(ImageFilter.GaussianBlur(1.2))
    d.save(saida, "JPEG", quality=85)

def main():
    SAIDA.mkdir(parents=True, exist_ok=True)
    falta = [p for p in sorted(IMG.glob("*.webp")) if not (SAIDA / (p.stem + ".jpg")).exists()]
    if not falta:
        print("Todas as ilustrações já têm mapa de profundidade."); return
    sess = modelo()
    for p in falta:
        profundidade(sess, p, SAIDA / (p.stem + ".jpg")); print(p.stem)
    print("%d mapas gerados em jogos/vr/prof/" % len(falta))

if __name__ == "__main__":
    main()
